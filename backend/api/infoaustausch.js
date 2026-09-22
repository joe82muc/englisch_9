"use strict";

/**
 * Infoaustausch-Modul (Informatik 7, Lernbereich 1)
 * -------------------------------------------------
 * Aufgebaut wie das Netzwerktest-Modul aus Informatik 9, mit zwei Unterschieden:
 *
 *   1. EIGENER NOTENSCHLUESSEL: 50 Prozent sind hier Note 3 (Absprache mit der
 *      Lehrkraft). Der Schluessel steht unten in GRADE_SCALE.
 *   2. ZUSAETZLICHE ROUTE /api/infoaustausch/feedback: Damit holen sich die
 *      acht Lernmodule sofort eine KI-Rueckmeldung zu frei geschriebenen
 *      Antworten. Diese Route vergibt KEINE Noten und speichert nichts -
 *      sie ist nur zum Ueben da.
 *
 * Aufgabentypen der Probe:
 *   - "choice": Anklicken, serverseitig exakt ausgewertet
 *   - "text":   Freier Text, den die KI auf Sinnhaftigkeit prueft
 *
 * Bewertung des freien Textes (Absprache mit der Lehrkraft):
 *   WOHLWOLLEND. Bewertet wird, ob die Aussage fachlich richtig ist.
 *   Rechtschreibung, Grammatik und Ausdruck fliessen NICHT in die Punkte ein.
 *
 * Ablauf:
 *   - Lehrkraft schaltet die Probe frei / sperrt sie wieder
 *   - Schueler sehen nur freigeschaltete Proben
 *   - Pro Name und Probe ist genau EINE Abgabe moeglich (Sperre auf dem Server)
 *   - Loesungen verlassen den Server nie vor der Abgabe
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

/* ------------------------------------------------------------------
   Notenschluessel Informatik 7
   50 Prozent = Note 3 (so von der Lehrkraft festgelegt).
   Die Stufen sind gleichmaessig gedehnt, damit der Schluessel
   nach oben und nach unten fair bleibt.
   ------------------------------------------------------------------ */
const GRADE_SCALE = [
  { grade: 1, min: 87 },
  { grade: 2, min: 70 },
  { grade: 3, min: 50 },
  { grade: 4, min: 33 },
  { grade: 5, min: 17 },
  { grade: 6, min: 0 }
];

function gradeFromPercent(percent) {
  const p = Number(percent) || 0;
  for (const step of GRADE_SCALE) {
    if (p >= step.min) return step.grade;
  }
  return 6;
}

const clean = (v) => String(v || "").trim();

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[.,;:!?"'`´()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* ------------------------------------------------------------------
   Gemeinsamer Bewertungstext fuer die KI
   Steht an einer Stelle, damit Probe und Uebungsmodule gleich streng
   (bzw. gleich wohlwollend) bewerten.
   ------------------------------------------------------------------ */
const KI_REGELN = [
  "Du korrigierst Informatik-Aufgaben einer 7. Klasse an einer bayerischen Mittelschule.",
  "Thema: Digitaler Informationsaustausch (Computerraum, E-Mail, soziale Netzwerke,",
  "Persoenlichkeits- und Urheberrecht, Netiquette, Cybermobbing, Chancen und Gefahren",
  "von Kommunikationsplattformen, Phishing, Fake News, Influencer).",
  "",
  "Bewerte AUSSCHLIESSLICH, ob die Antwort inhaltlich sinnvoll und fachlich richtig ist.",
  "Rechtschreibung, Grammatik, Zeichensetzung und Ausdruck sind voellig egal.",
  "Umgangssprache, Stichworte und eigene Worte sind ausdruecklich erlaubt.",
  "Fachbegriffe muessen NICHT genannt werden, wenn die Sache richtig beschrieben ist.",
  "Bewerte wohlwollend: Im Zweifel entscheide zugunsten der Schuelerin oder des Schuelers.",
  "Die Schueler sind 12 bis 13 Jahre alt - erwarte keine perfekten Formulierungen.",
  "Eine unvollstaendige, aber richtige Antwort bekommt Teilpunkte.",
  "Falsche oder themenfremde Aussagen bekommen 0 Punkte."
].join("\n");

/* ------------------------------------------------------------------
   Bewertung freier Texte
   ------------------------------------------------------------------ */

/**
 * Notfall-Bewertung ohne KI (Schluesselbegriffe).
 * Wird nur benutzt, wenn die KI nicht erreichbar ist, damit eine Probe
 * niemals an einer Stoerung der Schnittstelle scheitert.
 */
function keywordScore(given, item) {
  const text = normalizeText(given);
  const max = Number(item.points) || 2;
  if (text.length < 8) {
    return { points: 0, comment: "Keine oder eine sehr kurze Antwort.", source: "keywords" };
  }
  const keys = (item.keywords || []).map(normalizeText).filter(Boolean);
  if (!keys.length) {
    // Ohne Stichwoerter lieber der Lehrkraft vorlegen als falsch bewerten.
    return { points: 0, comment: "Bitte von der Lehrkraft ansehen lassen.", needsReview: true, source: "keywords" };
  }
  const hits = keys.filter((k) => text.includes(k)).length;
  const ratio = hits / keys.length;
  let points = 0;
  if (ratio >= 0.4) points = max;
  else if (hits >= 1) points = Math.max(1, Math.round(max / 2));
  return {
    points,
    comment: points === max
      ? "Wichtige Begriffe sind enthalten."
      : "Teilweise richtig - es fehlen noch Angaben.",
    needsReview: true,
    source: "keywords"
  };
}

/**
 * Bewertet eine freie Antwort der PROBE mit der KI.
 * Gibt { points, comment, source } zurueck. Bei jedem Problem faellt die
 * Funktion auf keywordScore() zurueck.
 *
 * @param askAnthropic  Funktion (system, user, maxTokens) => Promise<string>
 */
async function aiScore(given, item, askAnthropic) {
  const max = Number(item.points) || 2;
  const text = clean(given);

  if (text.length < 3) {
    return { points: 0, comment: "Keine Antwort abgegeben.", source: "leer" };
  }
  if (typeof askAnthropic !== "function") {
    return keywordScore(given, item);
  }

  const system = [
    KI_REGELN,
    "",
    `Vergib ganze Punkte von 0 bis ${max}.`,
    "",
    "Antworte NUR mit JSON in genau dieser Form, ohne weiteren Text:",
    '{"points": <Zahl>, "comment": "<eine kurze Rueckmeldung auf Deutsch, maximal 15 Woerter>"}'
  ].join("\n");

  const user = [
    "Aufgabe:",
    item.prompt,
    "",
    "Musterloesung der Lehrkraft:",
    item.expected || "(keine hinterlegt)",
    "",
    "Antwort der Schuelerin / des Schuelers:",
    text
  ].join("\n");

  try {
    const raw = await askAnthropic(system, user, 300);
    const match = String(raw || "").match(/\{[\s\S]*\}/);
    if (!match) return keywordScore(given, item);

    const parsed = JSON.parse(match[0]);
    let points = Number(parsed.points);
    if (!Number.isFinite(points)) return keywordScore(given, item);

    points = Math.max(0, Math.min(max, Math.round(points)));
    const comment = clean(parsed.comment).slice(0, 200) || "Bewertet.";
    return { points, comment, source: "ki" };
  } catch (_e) {
    return keywordScore(given, item);
  }
}

/* ------------------------------------------------------------------
   Datenhaltung
   ------------------------------------------------------------------ */
function createStore(dataDir) {
  const UNLOCK_FILE = path.join(dataDir, "infoaustausch.json");
  const SUBMISSIONS_FILE = path.join(dataDir, "infoaustausch_abgaben.json");

  function ensure() {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    if (!fs.existsSync(UNLOCK_FILE)) {
      fs.writeFileSync(UNLOCK_FILE, JSON.stringify({ unlocked: {} }, null, 2), "utf8");
    }
    if (!fs.existsSync(SUBMISSIONS_FILE)) {
      fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify({ submissions: [] }, null, 2), "utf8");
    }
  }

  function loadUnlocks() {
    try { return JSON.parse(fs.readFileSync(UNLOCK_FILE, "utf8")); }
    catch (_e) { return { unlocked: {} }; }
  }
  function saveUnlocks(data) {
    fs.writeFileSync(UNLOCK_FILE, JSON.stringify(data, null, 2), "utf8");
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

function studentKey(firstName, lastName, className) {
  return `${clean(firstName)}|${clean(lastName)}|${clean(className)}`
    .toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ").trim();
}

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
 * @param app                  Express-App
 * @param opts.dataDir         Verzeichnis fuer die JSON-Dateien
 * @param opts.teacherPassword Passwort der Lehrkraft
 * @param opts.tests           Testdefinitionen (mit Loesungen, bleiben hier)
 * @param opts.hashSecret      Secret fuer die Geraetekennung
 * @param opts.askAnthropic    Funktion fuer die KI-Bewertung (optional)
 */
function registerInfoaustauschRoutes(app, opts) {
  const store = createStore(opts.dataDir);
  const TESTS = opts.tests || {};
  const TEACHER_PASSWORD = opts.teacherPassword;
  const HASH_SECRET = opts.hashSecret || "grumi-fallback-secret";
  const askAnthropic = opts.askAnthropic;

  const isTeacher = (req) => clean(req.body?.password) === TEACHER_PASSWORD;

  const maxPoints = (test) =>
    test.items.reduce((sum, it) => sum + (Number(it.points) || 1), 0);

  /* ================================================================
     UEBUNGSMODULE: sofortige KI-Rueckmeldung zu freien Texten
     ----------------------------------------------------------------
     Diese Route gehoert NICHT zur Probe. Sie vergibt keine Noten und
     speichert nichts. Die acht Lernmodule rufen sie auf, damit die
     Schueler beim Ueben sofort erfahren, ob ihre Antwort stimmt.
     ================================================================ */
  app.post("/api/infoaustausch/feedback", async (req, res) => {
    const frage = clean(req.body?.frage);
    const erwartet = clean(req.body?.erwartet);
    const antwort = clean(req.body?.antwort);
    const thema = clean(req.body?.thema);

    if (!antwort || antwort.length < 3) {
      return res.json({
        ok: true,
        richtig: false,
        rueckmeldung: "Hier fehlt noch eine Antwort."
      });
    }

    /* Ohne KI-Anbindung lieber freundlich durchwinken als falsch bewerten:
       Die Musterloesung steht ohnehin darunter. */
    if (typeof askAnthropic !== "function") {
      return res.json({
        ok: true,
        richtig: true,
        rueckmeldung: "Vergleiche deine Antwort mit der Lösung unten."
      });
    }

    const system = [
      KI_REGELN,
      "",
      "Das hier ist eine UEBUNGSAUFGABE, keine Probe. Sei besonders ermutigend.",
      "Wenn die Antwort im Kern stimmt, ist sie richtig.",
      "Schreibe die Rueckmeldung direkt an die Schuelerin oder den Schueler (per du).",
      "Bei einer richtigen Antwort: kurz loben.",
      "Bei einer falschen Antwort: freundlich sagen, was noch fehlt - aber die",
      "Loesung NICHT verraten, die steht schon darunter.",
      "",
      "Antworte NUR mit JSON in genau dieser Form, ohne weiteren Text:",
      '{"richtig": true oder false, "rueckmeldung": "<maximal 20 Woerter auf Deutsch>"}'
    ].join("\n");

    const user = [
      thema ? "Thema der Stunde: " + thema : "",
      "Aufgabe:",
      frage,
      "",
      "Musterloesung der Lehrkraft:",
      erwartet || "(keine hinterlegt)",
      "",
      "Antwort der Schuelerin / des Schuelers:",
      antwort
    ].filter(Boolean).join("\n");

    try {
      const raw = await askAnthropic(system, user, 250);
      const match = String(raw || "").match(/\{[\s\S]*\}/);
      if (!match) throw new Error("keine JSON-Antwort");

      const parsed = JSON.parse(match[0]);
      res.json({
        ok: true,
        richtig: Boolean(parsed.richtig),
        rueckmeldung: clean(parsed.rueckmeldung).slice(0, 200) || "Bewertet."
      });
    } catch (_e) {
      // Stoerung der Schnittstelle darf die Uebung nicht blockieren.
      res.json({
        ok: true,
        richtig: true,
        rueckmeldung: "Die Prüfung klappt gerade nicht. Vergleiche selbst mit der Lösung."
      });
    }
  });

  /* ---------- Oeffentlich: Liste der Proben (OHNE Loesungen) ---------- */
  app.get("/api/infoaustausch/list", (_req, res) => {
    const unlocks = store.loadUnlocks();
    const list = Object.values(TESTS).map((t) => ({
      id: t.id,
      title: t.title,
      unit: t.unit,
      classLevel: t.classLevel,
      itemCount: t.items.length,
      maxPoints: maxPoints(t),
      unlocked: Boolean(unlocks.unlocked[t.id]?.open)
    }));
    res.json({ ok: true, tests: list });
  });

  /* ---------- Schueler: Probe starten ---------- */
  app.post("/api/infoaustausch/start", (req, res) => {
    const testId = clean(req.body?.testId);
    const firstName = clean(req.body?.firstName);
    const lastName = clean(req.body?.lastName);
    const className = clean(req.body?.className);

    const test = TESTS[testId];
    if (!test) return res.status(404).json({ ok: false, error: "test_not_found" });

    const unlocks = store.loadUnlocks();
    if (!unlocks.unlocked[testId]?.open) {
      return res.status(403).json({
        ok: false, error: "locked",
        message: "Diese Probe ist noch nicht freigeschaltet."
      });
    }
    if (!firstName || !lastName || !className) {
      return res.status(400).json({
        ok: false, error: "missing_fields",
        message: "Vorname, Nachname und Klasse sind erforderlich."
      });
    }

    const key = studentKey(firstName, lastName, className);
    const existing = store.loadSubmissions().submissions
      .find((s) => s.testId === testId && s.studentKey === key);
    if (existing) {
      return res.status(409).json({
        ok: false, error: "already_submitted",
        message: "Fuer diesen Namen wurde die Probe bereits abgegeben.",
        submittedAt: existing.submittedAt
      });
    }

    // Aufgaben OHNE Loesungen ausliefern
    const items = test.items.map((it, idx) => ({
      nr: idx + 1,
      type: it.type,
      prompt: it.prompt,
      options: it.type === "choice" ? it.options : undefined,
      image: it.image || "",
      imageAlt: it.imageAlt || "",
      points: Number(it.points) || 1,
      lines: it.lines || 3
    }));

    res.json({
      ok: true,
      test: {
        id: test.id,
        title: test.title,
        unit: test.unit,
        maxPoints: maxPoints(test)
      },
      items
    });
  });

  /* ---------- Schueler: Abgabe ---------- */
  app.post("/api/infoaustausch/submit", async (req, res) => {
    const testId = clean(req.body?.testId);
    const firstName = clean(req.body?.firstName);
    const lastName = clean(req.body?.lastName);
    const className = clean(req.body?.className);
    const testDate = clean(req.body?.testDate);
    const answers = Array.isArray(req.body?.answers) ? req.body.answers : [];

    const test = TESTS[testId];
    if (!test) return res.status(404).json({ ok: false, error: "test_not_found" });

    const unlocks = store.loadUnlocks();
    if (!unlocks.unlocked[testId]?.open) {
      return res.status(403).json({ ok: false, error: "locked", message: "Diese Probe ist nicht freigeschaltet." });
    }
    if (!firstName || !lastName || !className) {
      return res.status(400).json({ ok: false, error: "missing_fields" });
    }

    const key = studentKey(firstName, lastName, className);
    const db = store.loadSubmissions();
    const existing = db.submissions.find((s) => s.testId === testId && s.studentKey === key);
    if (existing) {
      // Serverseitige Sperre: Neuladen bringt nichts.
      return res.status(409).json({
        ok: false, error: "already_submitted",
        message: "Diese Probe wurde bereits abgegeben.",
        submittedAt: existing.submittedAt
      });
    }

    /* ---- Auswertung ---- */
    const details = [];
    let aiUsed = false;
    let needsReview = false;

    for (let idx = 0; idx < test.items.length; idx++) {
      const item = test.items[idx];
      const max = Number(item.points) || 1;
      const raw = answers[idx];

      if (item.type === "choice") {
        const picked = Number.isInteger(raw) ? raw : parseInt(raw, 10);
        const correct = picked === item.answer;
        details.push({
          nr: idx + 1,
          type: "choice",
          prompt: item.prompt,
          given: Number.isInteger(picked) && item.options[picked] !== undefined
            ? item.options[picked] : "",
          correct,
          points: correct ? max : 0,
          maxPoints: max,
          expected: item.options[item.answer]
        });
      } else {
        const given = clean(raw);
        const scored = await aiScore(given, item, askAnthropic);
        if (scored.source === "ki") aiUsed = true;
        if (scored.needsReview) needsReview = true;
        details.push({
          nr: idx + 1,
          type: "text",
          prompt: item.prompt,
          given,
          correct: scored.points >= max,
          points: scored.points,
          maxPoints: max,
          comment: scored.comment || "",
          scoredBy: scored.source,
          expected: item.expected || ""
        });
      }
    }

    const total = maxPoints(test);
    const score = details.reduce((sum, d) => sum + d.points, 0);
    const percent = total ? Math.round((score / total) * 100) : 0;
    const grade = gradeFromPercent(percent);

    const record = {
      id: `ia_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
      testId,
      testTitle: test.title,
      unit: test.unit,
      firstName, lastName, className,
      studentKey: key,
      testDate: testDate || new Date().toISOString().slice(0, 10),
      score, total, percent, grade,
      aiUsed, needsReview,
      details,
      deviceHash: deviceHash(req, HASH_SECRET),
      submittedAt: new Date().toISOString()
    };

    db.submissions.push(record);
    store.saveSubmissions(db);

    res.json({
      ok: true,
      result: {
        score, total, percent, grade,
        needsReview,
        details: details.map((d) => ({
          nr: d.nr, type: d.type, prompt: d.prompt, given: d.given,
          correct: d.correct, points: d.points, maxPoints: d.maxPoints,
          comment: d.comment || "", expected: d.expected
        })),
        submittedAt: record.submittedAt
      }
    });
  });

  /* ---------- Lehrkraft: Freischalten / Sperren ---------- */
  app.post("/api/infoaustausch/unlock", (req, res) => {
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
  app.post("/api/infoaustausch/results", (req, res) => {
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

  /* ---------- Lehrkraft: Punkte einer freien Antwort korrigieren ---------- */
  app.post("/api/infoaustausch/override", (req, res) => {
    if (!isTeacher(req)) return res.status(401).json({ ok: false, error: "bad_password" });

    const id = clean(req.body?.submissionId);
    const nr = parseInt(req.body?.nr, 10);
    const points = Number(req.body?.points);

    const db = store.loadSubmissions();
    const rec = db.submissions.find((s) => s.id === id);
    if (!rec) return res.status(404).json({ ok: false, error: "not_found" });

    const det = rec.details.find((d) => d.nr === nr);
    if (!det) return res.status(404).json({ ok: false, error: "item_not_found" });
    if (!Number.isFinite(points) || points < 0 || points > det.maxPoints) {
      return res.status(400).json({ ok: false, error: "bad_points" });
    }

    det.points = Math.round(points);
    det.correct = det.points >= det.maxPoints;
    det.scoredBy = "lehrkraft";

    rec.score = rec.details.reduce((sum, d) => sum + d.points, 0);
    rec.percent = rec.total ? Math.round((rec.score / rec.total) * 100) : 0;
    rec.grade = gradeFromPercent(rec.percent);
    rec.needsReview = rec.details.some((d) => d.scoredBy === "keywords");

    store.saveSubmissions(db);
    res.json({ ok: true, score: rec.score, percent: rec.percent, grade: rec.grade });
  });

  /* ---------- Lehrkraft: Abgabe loeschen (Nachschreiben) ---------- */
  app.post("/api/infoaustausch/delete-submission", (req, res) => {
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

  /* ---------- Lehrkraft: Export als CSV (oeffnet sich in Excel) ---------- */
  app.post("/api/infoaustausch/export", (req, res) => {
    if (!isTeacher(req)) return res.status(401).json({ ok: false, error: "bad_password" });

    const testId = clean(req.body?.testId);
    let rows = store.loadSubmissions().submissions;
    if (testId) rows = rows.filter((r) => r.testId === testId);

    const esc = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const header = ["Datum", "Probe", "Klasse", "Nachname", "Vorname", "Punkte", "Von", "Prozent", "Note", "Abgabe"];
    const lines = [header.map(esc).join(";")];
    rows.forEach((r) => {
      lines.push([
        r.testDate, r.testTitle, r.className, r.lastName, r.firstName,
        r.score, r.total, r.percent, r.grade, r.submittedAt
      ].map(esc).join(";"));
    });

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="infoaustausch_${testId || "alle"}.csv"`);
    res.send("﻿" + lines.join("\r\n"));
  });
}

module.exports = {
  registerInfoaustauschRoutes,
  gradeFromPercent,
  aiScore,
  keywordScore,
  GRADE_SCALE
};
