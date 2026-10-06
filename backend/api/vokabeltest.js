"use strict";

/**
 * Vokabeltest-Modul
 * -----------------
 * Stellt die Routen fuer schriftliche Vokabeltests bereit:
 *   - Lehrkraft schaltet einen Test frei / sperrt ihn wieder
 *   - Schueler sehen nur freigeschaltete Tests
 *   - Jede Schuelerin / jeder Schueler kann pro Test genau EINMAL abgeben
 *   - Auswertung und Notenberechnung passieren serverseitig
 *
 * Wichtig: Die Sperre gegen mehrfaches Abgeben liegt bewusst auf dem Server.
 * Ein Neuladen der Seite (F5) kann im Browser nicht zuverlaessig verhindert
 * werden - der Server lehnt eine zweite Abgabe deshalb selbst ab.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { probeKindPruefer, probeOffen, verlassenZahl, protokollSauber } = require("./probe-kind");

/* ------------------------------------------------------------------
   Notenschluessel

   GRADE_SCALE      Mittelschule M-Zug (50 % = Note 4) - Englisch 7, 7M und 9M
   GRADE_SCALE_8R   milderer Schluessel (50 % = Note 3) - Englisch 8R
   GRADE_SCALE_9R   milderer Schluessel (50 % = Note 3) - Englisch 9R und 7R ("7R")

   Welcher Schluessel gilt, steht an der Testdefinition im Feld
   "gradeScale". Ohne Angabe bleibt es beim bisherigen M-Zug-Schluessel,
   damit bereits gestellte Proben ihre Noten behalten.
   ------------------------------------------------------------------ */
const GRADE_SCALE = [
  { grade: 1, min: 92 },
  { grade: 2, min: 81 },
  { grade: 3, min: 67 },
  { grade: 4, min: 50 },
  { grade: 5, min: 30 },
  { grade: 6, min: 0 }
];

const GRADE_SCALE_8R = [
  { grade: 1, min: 87 },
  { grade: 2, min: 73 },
  { grade: 3, min: 50 },
  { grade: 4, min: 37 },
  { grade: 5, min: 20 },
  { grade: 6, min: 0 }
];

const GRADE_SCALE_9R = [
  { grade: 1, min: 87 },
  { grade: 2, min: 73 },
  { grade: 3, min: 50 },
  { grade: 4, min: 37 },
  { grade: 5, min: 20 },
  { grade: 6, min: 0 }
];

const GRADE_SCALES = { "default": GRADE_SCALE, "8R": GRADE_SCALE_8R, "9R": GRADE_SCALE_9R, "7R": GRADE_SCALE_9R };

function gradeFromPercent(percent, scaleName) {
  const p = Number(percent) || 0;
  const scale = GRADE_SCALES[scaleName] || GRADE_SCALE;
  for (const step of scale) {
    if (p >= step.min) return step.grade;
  }
  return 6;
}

/* ------------------------------------------------------------------
   Antwortvergleich
   ------------------------------------------------------------------ */

/** Vereinheitlicht eine Antwort: Kleinschreibung, ohne Artikel/"to",
 *  ohne Klammerzusaetze, ohne Satzzeichen. */
function normalizeAnswer(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")   // Akzente entfernen
    .replace(/\([^)]*\)/g, " ")                          // (Klammern) weg
    .replace(/^(to|the|a|an|der|die|das|ein|eine)\s+/, "")
    .replace(/[.,;:!?"'`´]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Levenshtein-Distanz, begrenzt auf max (Abbruch spart Zeit). */
function editDistance(a, b, max) {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (cur[j] < rowMin) rowMin = cur[j];
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

/**
 * Prueft eine Schuelerantwort gegen alle zugelassenen Loesungen.
 * Rueckgabe: { correct, typo, matched }
 * Ein kleiner Tippfehler (Distanz 1) gilt ab 5 Zeichen noch als richtig,
 * wird aber als "typo" markiert, damit die Lehrkraft es sieht.
 * lrs (Notenschutz LRS): mehr Toleranz, ab 3 Zeichen 1 Fehler, ab 6 Zeichen 2 Fehler.
 * Lautgetreue Schreibungen ("wenzday") erkennt danach die KI.
 */
function checkAnswer(given, solutions, lrs) {
  const g = normalizeAnswer(given);
  if (!g) return { correct: false, typo: false, matched: "" };

  // Unregelmäßige Verben („drive, drove, driven“): alle drei Formen müssen dastehen
  const verben = verbFormen(solutions);
  if (verben.length) {
    const versuche = verben.map((formen) => checkVerbFormen(given, formen, lrs));
    return versuche.find((v) => v.correct) || versuche[0];
  }

  const accepted = [];
  for (const sol of solutions) {
    // ";" trennt gleichwertige Bedeutungen ("Norden; Nord-")
    String(sol).split(";").forEach((part) => {
      const n = normalizeAnswer(part);
      if (n) accepted.push({ norm: n, raw: String(part).trim() });
    });
  }

  // Englische Eigennamen (France, Northern Ireland, CV …) müssen großgeschrieben sein – außer bei Notenschutz LRS
  const mitGross = (ergebnis, a) => {
    const fehler = lrs ? [] : grossFehler(given, a.raw);
    return fehler.length ? { correct: false, typo: false, matched: a.raw, gross: fehler } : ergebnis;
  };
  for (const a of accepted) {
    if (g === a.norm) return mitGross({ correct: true, typo: false, matched: a.raw }, a);
  }
  for (const a of accepted) {
    const erlaubt = lrs ? (a.norm.length >= 6 ? 2 : a.norm.length >= 3 ? 1 : 0) : (a.norm.length >= 5 ? 1 : 0);
    if (erlaubt && editDistance(g, a.norm, erlaubt) <= erlaubt) {
      return mitGross({ correct: true, typo: true, matched: a.raw }, a);
    }
  }
  return { correct: false, typo: false, matched: "" };
}

/* ------------------------------------------------------------------
   Großschreibung englischer Eigennamen

   Pflicht sind Wörter, die in der Lösung als Name großgeschrieben sind:
   Länder, Sprachen, Nationalitäten, Feiertage, Namen („France“, „Turkish“,
   „Northern Ireland“, „the British Isles“, „Thanksgiving“, „Richter scale“)
   und Abkürzungen („CV“, „B&B“). Der Großbuchstabe am Anfang einer Wendung
   („Get well soon“, „Have a good flight!“) und „I“ zählen nicht.
   ------------------------------------------------------------------ */
const SATZANFANG = new Set(["have", "what", "what's", "get", "you", "you're", "bye", "see", "yours", "how", "good",
  "excuse", "thank", "thanks", "nice", "let's", "it's", "that's", "can", "could", "would", "do", "don't", "is", "are",
  "where", "when", "why", "who", "welcome", "sorry", "please", "hello", "hi", "goodbye", "happy", "enjoy", "take", "come",
  "go", "be", "look", "listen", "wait", "help", "well", "oh", "no", "yes", "here", "there", "best", "kind", "dear",
  "cheers", "congratulations", "merry", "all", "my", "your", "say", "tell", "keep", "make", "give", "never", "the", "a", "an"]);
const woerterVon = (text) => String(text || "").replace(/\([^)]*\)/g, " ").split(/\s+/)
  .map((w) => w.replace(/^[^\p{L}&]+|[^\p{L}&]+$/gu, "")).filter(Boolean);
const istGross = (w) => /^\p{Lu}/u.test(w);
const istAbkuerzung = (w) => /\p{Lu}.*\p{Lu}/u.test(w);
const istIch = (w) => /^I(['’]|$)/.test(w);

function grossPflicht(loesung) {
  const woerter = woerterVon(loesung);
  const weitereGross = woerter.slice(1).some((w) => istGross(w) && !istIch(w));
  return woerter.filter((w, i) => {
    if (!istGross(w) || istIch(w)) return false;
    if (istAbkuerzung(w) || i > 0 || woerter.length === 1 || weitereGross) return true;
    return !SATZANFANG.has(w.toLowerCase());
  });
}
// Liefert die Pflicht-Wörter, die in der Antwort kleingeschrieben sind (leer = alles in Ordnung)
function grossFehler(given, loesung) {
  const pflicht = grossPflicht(loesung);
  if (!pflicht.length) return [];
  const woerter = woerterVon(given);
  return pflicht.filter((p) => {
    const pl = p.toLowerCase();
    const w = woerter.find((x) => x.toLowerCase() === pl) || woerter.find((x) => editDistance(x.toLowerCase(), pl, 1) <= 1);
    if (!w) return false;
    return istAbkuerzung(p) ? w !== w.toUpperCase() : !istGross(w);
  });
}

/* ------------------------------------------------------------------
   Unregelmäßige Verben: Lösung „drive, drove, driven“ (auch „be, was/were, been“).
   Alle drei Formen müssen in dieser Reihenfolge dastehen; Trennzeichen sind egal.
   Die Testseite zeigt dazu den Hinweis VERB_HINWEIS.
   ------------------------------------------------------------------ */
const VERB_HINWEIS = "alle drei Formen: Grundform, simple past, past participle";
function verbFormen(solutions) {
  const liste = [];
  for (const sol of solutions || []) {
    for (const part of String(sol).split(";")) {
      const formen = part.split(",").map((f) => f.trim());
      if (formen.length === 3 && formen.every((f) => /^[A-Za-z']+(\s*\/\s*[A-Za-z']+)*$/.test(f))) {
        liste.push(formen.map((f) => f.split("/").map((x) => x.trim().toLowerCase())));
      }
    }
  }
  return liste;
}
function checkVerbFormen(given, formen, lrs) {
  const teile = String(given || "").replace(/\([^)]*\)/g, " ").toLowerCase().replace(/^\s*to\s+/, "")
    .split(/[\s,;\/\-–]+/).map((x) => x.replace(/[.!?"'`´]/g, "")).filter(Boolean);
  const alleFormen = new Set([].concat(...formen));
  const passt = (w, alts) => {
    if (alts.includes(w)) return "exakt";
    if (alleFormen.has(w)) return ""; // eine andere Form desselben Verbs ist kein Tippfehler („driven“ statt „drive“)
    for (const a of alts) {
      const erlaubt = lrs ? (a.length >= 6 ? 2 : a.length >= 3 ? 1 : 0) : (a.length >= 5 ? 1 : 0);
      if (erlaubt && editDistance(w, a, erlaubt) <= erlaubt) return "typo";
    }
    return "";
  };
  const fehlend = [], falsch = [];
  let i = 0, typo = false;
  for (const alts of formen) {
    if (teile[i] === undefined) { fehlend.push(alts.join("/")); continue; }
    const r = passt(teile[i], alts);
    i++;
    if (!r) { falsch.push(alts.join("/")); continue; }
    if (r === "typo") typo = true;
    while (alts.length > 1 && teile[i] !== undefined && passt(teile[i], alts)) i++; // „was, were“
  }
  const matched = formen.map((a) => a.join("/")).join(", ");
  if (fehlend.length || falsch.length) return { correct: false, typo: false, matched, formen: { fehlend, falsch } };
  return { correct: true, typo, matched };
}

/** Kurzer Hinweis für die Lehrkraft und den Elternausdruck, warum eine Antwort nicht zählt. */
function regelHinweis(result) {
  if (result.gross && result.gross.length) return "Großschreibung: " + result.gross.join(", ");
  if (result.formen) {
    const f = result.formen;
    return "Alle drei Formen nötig" + (f.fehlend.length ? " – es fehlt: " + f.fehlend.join(", ") : "") +
      (f.falsch.length ? " – nicht richtig: " + f.falsch.join(", ") : "");
  }
  return "";
}

/* ------------------------------------------------------------------
   KI-Zweitmeinung

   Der exakte Vergleich oben kennt nur die hinterlegten Loesungen. Eine
   sinngleiche Antwort ("Bezirk" statt "Stadtteil") faellt dort durch.
   Deshalb gehen NUR die als falsch bewerteten Antworten an die KI - sie
   kann eine Antwort noch als richtig anerkennen, aber nie eine richtige
   Antwort abwerten. Faellt die KI aus, bleibt es beim exakten Ergebnis.

   @param askAnthropic  Funktion (system, user, maxTokens) => Promise<string>
   ------------------------------------------------------------------ */
async function aiReview(pending, askAnthropic, classLevel, lrs) {
  if (!pending.length || typeof askAnthropic !== "function") return {};

  const system = [
    "Du korrigierst einen Vokabeltest im Fach Englisch, Klasse " + (classLevel || "8R") + " Mittelschule.",
    "",
    "Zu jeder Aufgabe bekommst du die Musterloesungen der Lehrkraft und die Antwort",
    "der Schuelerin oder des Schuelers. Entscheide, ob die Antwort die Vokabel trifft.",
    "",
    "Als richtig gilt:",
    "- ein Synonym oder eine gleichwertige Uebersetzung ('Bezirk' statt 'Stadtteil')",
    "- eine andere, aber korrekte Wortform ('gehen' statt 'zu Fuss gehen')",
    "- fehlendes 'to' beim Verb oder fehlender Artikel",
    "- Kleinschreibung gewoehnlicher Woerter, Tippfehler, fehlende Umlautpunkte",
    ...(lrs ? [
      "- NOTENSCHUTZ LRS (Lese-Rechtschreib-Stoerung): Rechtschreibung zaehlt nicht, auch nicht Gross- und",
      "  Kleinschreibung. Richtig ist auch lautgetreue, verdrehte oder lueckenhafte Schreibung, wenn eindeutig",
      "  die richtige Vokabel gemeint ist (z. B. 'frend' fuer 'friend', 'bycicle' fuer 'bicycle', 'wenzday' fuer 'Wednesday')."
    ] : []),
    "",
    "Als falsch gilt:",
    "- eine andere Vokabel, auch wenn sie thematisch passt",
    "- eine Antwort in der falschen Sprache",
    "- eine leere oder sinnlose Antwort",
    ...(lrs ? [] : ["- ein englischer Eigenname kleingeschrieben (Laender, Sprachen, Nationalitaeten, Feiertage, Namen), z. B. 'france' statt 'France'"]),
    "- bei unregelmaessigen Verben fehlt eine der drei Formen (z. B. nur 'drive' statt 'drive, drove, driven')",
    "",
    "Bewerte wohlwollend, aber nicht beliebig: Die Vokabel muss getroffen sein.",
    "",
    "Antworte NUR mit JSON in genau dieser Form, ohne weiteren Text:",
    '{"results": [{"nr": <Zahl>, "correct": true|false, "reason": "<max. 8 Woerter>"}]}'
  ].join("\n");

  const user = pending.map((p) => [
    "Aufgabe " + p.nr + " (" + (p.direction === "en-de" ? "Englisch -> Deutsch" : "Deutsch -> Englisch") + ")",
    "Gefragtes Wort: " + p.prompt + (p.hint ? " (Hinweis fuer das Kind: " + p.hint + ")" : ""),
    "Zugelassene Loesungen: " + p.solutions.join(" / "),
    "Antwort: " + p.given
  ].join("\n")).join("\n\n");

  try {
    const raw = await askAnthropic(system, user, 900);
    const match = String(raw || "").match(/\{[\s\S]*\}/);
    if (!match) return {};

    const parsed = JSON.parse(match[0]);
    const list = Array.isArray(parsed.results) ? parsed.results : [];
    const out = {};
    for (const r of list) {
      const nr = Number(r && r.nr);
      if (!Number.isFinite(nr)) continue;
      // Die KI darf nur aufwerten, nie abwerten.
      if (r.correct === true) {
        out[nr] = { correct: true, reason: clean(r.reason).slice(0, 120) };
      }
    }
    return out;
  } catch (_e) {
    return {};
  }
}

/* ------------------------------------------------------------------
   Datenhaltung
   ------------------------------------------------------------------ */
function createStore(dataDir) {
  const TESTS_FILE = path.join(dataDir, "vokabeltests.json");
  const SUBMISSIONS_FILE = path.join(dataDir, "vokabeltest_abgaben.json");

  function ensure() {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    if (!fs.existsSync(TESTS_FILE)) {
      fs.writeFileSync(TESTS_FILE, JSON.stringify({ unlocked: {} }, null, 2), "utf8");
    }
    if (!fs.existsSync(SUBMISSIONS_FILE)) {
      fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify({ submissions: [] }, null, 2), "utf8");
    }
  }

  function loadUnlocks() {
    try { return JSON.parse(fs.readFileSync(TESTS_FILE, "utf8")); }
    catch (_e) { return { unlocked: {} }; }
  }
  function saveUnlocks(data) {
    fs.writeFileSync(TESTS_FILE, JSON.stringify(data, null, 2), "utf8");
  }
  function loadSubmissions() {
    try { return JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, "utf8")); }
    catch (_e) { return { submissions: [] }; }
  }
  function saveSubmissions(data) {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(data, null, 2), "utf8");
  }

  ensure();
  return { loadUnlocks, saveUnlocks, loadSubmissions, saveSubmissions };
}

/* ------------------------------------------------------------------
   Hilfsfunktionen
   ------------------------------------------------------------------ */
const clean = (v) => String(v || "").trim();

/**
 * Geraetekennung statt voller IP.
 * Die IP wird gekuerzt (IPv4: letztes Oktett, IPv6: nur Praefix) und danach
 * mit einem Server-Secret gehasht. Ergebnis: erkennt mehrere Abgaben vom
 * selben Geraet, laesst sich aber nicht in eine IP zurueckrechnen.
 */
function deviceHash(req, secret) {
  const raw = String(
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket?.remoteAddress || ""
  );
  let truncated;
  if (raw.includes(".")) {
    truncated = raw.split(".").slice(0, 3).join(".") + ".0";
  } else if (raw.includes(":")) {
    truncated = raw.split(":").slice(0, 4).join(":");
  } else {
    truncated = "unknown";
  }
  return crypto.createHmac("sha256", secret).update(truncated).digest("hex").slice(0, 16);
}

/* ------------------------------------------------------------------
   Routen
   ------------------------------------------------------------------ */
/**
 * @param app          Express-App
 * @param opts.dataDir Verzeichnis fuer die JSON-Dateien
 * @param opts.teacherPassword  Passwort der Lehrkraft
 * @param opts.tests   Testdefinitionen (inkl. Loesungen, bleiben serverseitig)
 * @param opts.hashSecret Secret fuer die Geraetekennung
 * @param opts.askAnthropic Funktion fuer die KI-Zweitmeinung (optional)
 * @param opts.kindZumCode  Anmeldung mit dem Code aus dem Lernfortschritt (statt Namen)
 * @returns { abgaben }     alle Abgaben (fuer die Notenuebersicht je Klasse)
 */
function registerVokabeltestRoutes(app, opts) {
  const store = createStore(opts.dataDir);
  const TESTS = opts.tests || {};
  const TEACHER_PASSWORD = opts.teacherPassword;
  const HASH_SECRET = opts.hashSecret || "grumi-fallback-secret";
  const askAnthropic = opts.askAnthropic;
  const probeKind = probeKindPruefer(opts.kindZumCode);

  const isTeacher = (req) => clean(req.body?.password) === TEACHER_PASSWORD;

  /* ---------- Oeffentlich: Liste der Tests (OHNE Loesungen) ---------- */
  app.get("/api/vokabeltest/list", (_req, res) => {
    const unlocks = store.loadUnlocks();
    const list = Object.values(TESTS).map((t) => ({
      id: t.id,
      title: t.title,
      unit: t.unit,
      classLevel: t.classLevel,
      itemCount: t.items.length,
      unlocked: probeOffen(unlocks.unlocked[t.id])
    }));
    res.json({ ok: true, tests: list });
  });

  /* ---------- Schueler: Test starten ---------- */
  app.post("/api/vokabeltest/start", async (req, res) => {
    const testId = clean(req.body?.testId);

    const test = TESTS[testId];
    if (!test) return res.status(404).json({ ok: false, error: "test_not_found" });

    const unlocks = store.loadUnlocks();
    if (!probeOffen(unlocks.unlocked[testId])) {
      return res.status(403).json({ ok: false, error: "locked", message: "Dieser Test ist noch nicht freigeschaltet." });
    }
    const kind = await probeKind(req, res);
    if (!kind) return;

    // Bereits abgegeben? -> kein zweiter Versuch
    const key = kind.key;
    const existing = store.loadSubmissions().submissions
      .find((s) => s.testId === testId && s.studentKey === key);
    if (existing) {
      return res.status(409).json({
        ok: false, error: "already_submitted",
        message: "Mit diesem Code wurde der Test bereits abgegeben.",
        submittedAt: existing.submittedAt
      });
    }

    // Aufgaben ohne Loesungen ausliefern
    const items = test.items.map((it, idx) => ({
      nr: idx + 1,
      prompt: it.prompt,
      direction: it.direction,
      // Bei unregelmäßigen Verben („drive, drove, driven“) sieht das Kind, dass alle drei Formen gefragt sind
      hint: [it.hint, verbFormen(it.solutions).length ? VERB_HINWEIS : ""].filter(Boolean).join(" · ")
    }));

    res.json({
      ok: true,
      test: { id: test.id, title: test.title, unit: test.unit, direction: test.direction || "mixed" },
      items
    });
  });

  /* ---------- Schueler: Abgabe ---------- */
  app.post("/api/vokabeltest/submit", async (req, res) => {
    const testId = clean(req.body?.testId);
    const testDate = clean(req.body?.testDate);
    const answers = Array.isArray(req.body?.answers) ? req.body.answers : [];

    const test = TESTS[testId];
    if (!test) return res.status(404).json({ ok: false, error: "test_not_found" });

    const unlocks = store.loadUnlocks();
    if (!probeOffen(unlocks.unlocked[testId], true)) {
      return res.status(403).json({ ok: false, error: "locked", message: "Dieser Test ist nicht freigeschaltet." });
    }
    const kind = await probeKind(req, res);
    if (!kind) return;
    const { code, firstName, lastName, className } = kind;

    const key = kind.key;
    const db = store.loadSubmissions();
    const existing = db.submissions.find((s) => s.testId === testId && s.studentKey === key);
    if (existing) {
      // Serverseitige Sperre: Neuladen bringt nichts.
      return res.status(409).json({
        ok: false, error: "already_submitted",
        message: "Dieser Test wurde bereits abgegeben.",
        submittedAt: existing.submittedAt
      });
    }

    // ---- Auswertung: erst exakt, dann KI-Zweitmeinung ----
    const details = test.items.map((item, idx) => {
      const given = clean(answers[idx]);
      const result = checkAnswer(given, item.solutions, kind.lrs);
      // Zahlwörter (Hinweis „in Worten“): Eine Zahl in Ziffern ist keine Vokabel – auch nicht für die KI
      const ziffern = !result.correct && /in worten/i.test(item.hint || "") && /\d/.test(given);
      const regel = ziffern ? "Zahl in Worten schreiben, nicht in Ziffern" : regelHinweis(result);
      return {
        nr: idx + 1,
        prompt: item.prompt,
        given,
        correct: result.correct,
        typo: result.typo,
        ai: false,
        aiReason: "",
        // regel: Eigenname kleingeschrieben, Verbformen fehlen oder Ziffern statt Zahlwort – das darf die KI nicht durchwinken
        regel: Boolean(regel),
        comment: regel,
        expected: item.solutions.join(" / ")
      };
    });

    // Nur die abgelehnten Antworten mit Inhalt der KI vorlegen (ohne Verstöße gegen Großschreibung/Verbformen).
    const pending = details
      .map((d, idx) => ({ d, item: test.items[idx] }))
      .filter(({ d }) => !d.correct && d.given && !d.regel)
      .map(({ d, item }) => ({
        nr: d.nr,
        prompt: d.prompt,
        given: d.given,
        direction: item.direction,
        hint: item.hint || "",
        solutions: item.solutions
      }));

    if (pending.length) {
      const verdicts = await aiReview(pending, askAnthropic, test.classLevel, kind.lrs);
      for (const d of details) {
        const v = verdicts[d.nr];
        if (v && v.correct && !d.correct) {
          d.correct = true;
          d.ai = true;
          d.aiReason = v.reason;
        }
      }
    }

    const total = details.length;
    const score = details.filter((d) => d.correct).length;
    const typos = details.filter((d) => d.correct && d.typo).length;
    const aiAccepted = details.filter((d) => d.correct && d.ai).length;
    const percent = total ? Math.round((score / total) * 100) : 0;
    // Schluessel nach dem Zug des Kindes (M: 50 % = Note 4, R: 50 % = Note 3), auch wenn es
    // den Test des anderen Zugs erwischt hat. R-Tests behalten ihren eigenen R-Schluessel.
    const scaleName = kind.zug === "M" ? "default"
      : (test.gradeScale && test.gradeScale !== "default" ? test.gradeScale : "9R");
    const grade = gradeFromPercent(percent, scaleName);

    const record = {
      id: `vt_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
      testId,
      testTitle: test.title,
      unit: test.unit,
      code, zug: kind.zug, lrs: kind.lrs, verlassen: verlassenZahl(req.body?.verlassen), protokoll: protokollSauber(req.body?.protokoll),
      firstName, lastName, className,
      studentKey: key,
      testDate: testDate || new Date().toISOString().slice(0, 10),
      score, total, percent, grade, typos, aiAccepted,
      gradeScale: scaleName,
      details,
      deviceHash: deviceHash(req, HASH_SECRET),
      submittedAt: new Date().toISOString()
    };

    // Erst jetzt frisch laden: Waehrend der KI-Pruefung koennen andere Kinder
    // abgegeben haben. Mit dem alten Stand wuerden deren Abgaben ueberschrieben.
    const fresh = store.loadSubmissions();
    if (fresh.submissions.some((s) => s.testId === testId && s.studentKey === key)) {
      return res.status(409).json({ ok: false, error: "already_submitted", message: "Mit diesem Code wurde bereits abgegeben." });
    }
    fresh.submissions.push(record);
    store.saveSubmissions(fresh);

    res.json({
      ok: true,
      result: {
        score, total, percent, grade, typos, aiAccepted,
        details: details.map((d) => ({
          nr: d.nr, prompt: d.prompt, given: d.given,
          correct: d.correct, typo: d.typo,
          ai: d.ai, aiReason: d.aiReason, comment: d.comment || "",
          expected: d.expected
        })),
        submittedAt: record.submittedAt
      }
    });
  });

  /* ---------- Lehrkraft: Freischalten / Sperren ---------- */
  app.post("/api/vokabeltest/unlock", (req, res) => {
    if (!isTeacher(req)) return res.status(401).json({ ok: false, error: "bad_password" });

    const testId = clean(req.body?.testId);
    const open = Boolean(req.body?.open);
    if (!TESTS[testId]) return res.status(404).json({ ok: false, error: "test_not_found" });

    const unlocks = store.loadUnlocks();
    unlocks.unlocked[testId] = { open, changedAt: new Date().toISOString() };
    store.saveUnlocks(unlocks);

    res.json({ ok: true, testId, open });
  });

  /* ---------- Lehrkraft: Ergebnisse ---------- */
  app.post("/api/vokabeltest/results", (req, res) => {
    if (!isTeacher(req)) return res.status(401).json({ ok: false, error: "bad_password" });

    const testId = clean(req.body?.testId);
    let rows = store.loadSubmissions().submissions;
    if (testId) rows = rows.filter((r) => r.testId === testId);

    rows = rows.slice().sort((a, b) =>
      a.className.localeCompare(b.className) ||
      a.lastName.localeCompare(b.lastName) ||
      a.firstName.localeCompare(b.firstName)
    );

    const grades = rows.map((r) => r.grade);
    const avg = grades.length
      ? Math.round((grades.reduce((a, b) => a + b, 0) / grades.length) * 100) / 100
      : null;

    res.json({
      ok: true,
      count: rows.length,
      averageGrade: avg,
      distribution: [1, 2, 3, 4, 5, 6].map((g) => ({ grade: g, count: grades.filter((x) => x === g).length })),
      submissions: rows
    });
  });

  /* ---------- Lehrkraft: Einzelne Abgabe loeschen (Nachschreiben) ---------- */
  app.post("/api/vokabeltest/delete-submission", (req, res) => {
    if (!isTeacher(req)) return res.status(401).json({ ok: false, error: "bad_password" });

    const id = clean(req.body?.submissionId);
    const db = store.loadSubmissions();
    const before = db.submissions.length;
    db.submissions = db.submissions.filter((s) => s.id !== id);
    if (db.submissions.length === before) {
      return res.status(404).json({ ok: false, error: "not_found" });
    }
    store.saveSubmissions(db);
    res.json({ ok: true, removed: before - db.submissions.length });
  });

  /* ---------- Lehrkraft: Export als CSV ---------- */
  app.post("/api/vokabeltest/export", (req, res) => {
    if (!isTeacher(req)) return res.status(401).json({ ok: false, error: "bad_password" });

    const testId = clean(req.body?.testId);
    let rows = store.loadSubmissions().submissions;
    if (testId) rows = rows.filter((r) => r.testId === testId);

    const esc = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const header = ["Datum", "Test", "Klasse", "Nachname", "Vorname", "Punkte", "Von", "Prozent", "Note", "Abgabe"];
    const lines = [header.map(esc).join(";")];
    rows.forEach((r) => {
      lines.push([
        r.testDate, r.testTitle, r.className, r.lastName, r.firstName,
        r.score, r.total, r.percent, r.grade, r.submittedAt
      ].map(esc).join(";"));
    });

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="vokabeltest_${testId || "alle"}.csv"`);
    res.send("﻿" + lines.join("\r\n"));
  });

  return { abgaben: () => store.loadSubmissions().submissions };
}

module.exports = {
  registerVokabeltestRoutes,
  gradeFromPercent,
  checkAnswer,
  normalizeAnswer,
  grossPflicht,
  verbFormen,
  GRADE_SCALE,
  GRADE_SCALE_8R,
  GRADE_SCALE_9R
};
