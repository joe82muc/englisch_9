"use strict";

/**
 * Infoaustausch-Modul (Informatik 7, Lernbereich 1)
 * -------------------------------------------------
 * Aufgebaut wie das Netzwerktest-Modul aus Informatik 9, mit zwei Unterschieden:
 *
 *   1. NOTENSCHLUESSEL NACH ZUG: R-Klassen 50 Prozent = Note 3 (GRADE_SCALE unten),
 *      M-Klassen 50 Prozent = Note 4 (GRADE_SCALE_M aus probe-kind.js). Den Zug
 *      kennt der Server aus dem Code des Kindes.
 *   2. ZUSAETZLICHE ROUTE /api/infoaustausch/feedback: Damit holen sich die
 *      acht Lernmodule sofort eine KI-Rueckmeldung zu frei geschriebenen
 *      Antworten. Diese Route vergibt KEINE Noten und speichert nichts -
 *      sie ist nur zum Ueben da.
 *
 * Aufgabentypen der Probe:
 *   - "choice": Anklicken, serverseitig exakt ausgewertet
 *   - "match":  Zuordnen, jede Zeile bekommt eine Option (1 Punkt je Zeile)
 *   - "text":   Freier Text, den die KI auf Sinnhaftigkeit prueft
 *
 * Mehrfach nutzbar: Informatik 8 registriert dieselben Routen ein zweites
 * Mal mit eigenem Pfad (opts.prefix), eigenen Dateien (opts.storeName),
 * eigenem Notenschluessel (opts.gradeScale) und eigenem KI-Text
 * (opts.kiRegeln). Ohne diese Angaben gilt alles fuer Informatik 7.
 *
 * Angaben an einer einzelnen Probe (seit 20.10.2026, NT 9 Probe 2 Organische Rohstoffe – für alle anderen Proben
 * ändert sich nichts):
 *   notenzug "M" | "R"   fester Notenschlüssel für alle Kinder dieser Probe (sonst nach dem Zug aus dem Code)
 *   wegSekunden, kopieren  eigene Testregeln statt der Vorgabe aus probe-regel.js; 0 = dafür keine Note 6, Verlassen und
 *                          Kopierversuche werden nur gewarnt und vermerkt (wie in nt7.js). /list und /start nennen beides.
 *   abgabeMinuten        Bearbeitungszeit. Die Uhr beginnt beim ersten Start und läuft beim Neuladen weiter (Datei
 *                          <storeName>_sitzungen.json). Ist sie abgelaufen, gibt die Seite automatisch ab (automatisch
 *                          "zeit"); ist die Seite zu, gibt der Server mit dem letzten Zwischenstand ab (automatisch "server").
 *                          POST zwischenstand { testId, code, answers, verlassen, kopierversuche, wegSumme } sichert den Stand.
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
const { buildXlsx } = require("./xlsx-mini");
const { probeKindPruefer, GRADE_SCALE_M, probeOffen, verlassenZahl, protokollSauber } = require("./probe-kind");
const probeRegel = require("./probe-regel");

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

function gradeFromPercent(percent, scale = GRADE_SCALE) {
  const p = Number(percent) || 0;
  for (const step of scale) {
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
  // keywordsVoll: so viele Treffer reichen fuer volle Punkte (lange, grosszuegige Listen)
  if (ratio >= 0.4 || (item.keywordsVoll && hits >= item.keywordsVoll)) points = max;
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
async function aiScore(given, item, askAnthropic, regeln = KI_REGELN) {
  const max = Number(item.points) || 2;
  const text = clean(given);

  if (text.length < 3) {
    return { points: 0, comment: "Keine Antwort abgegeben.", source: "leer" };
  }
  if (typeof askAnthropic !== "function") {
    return keywordScore(given, item);
  }

  const system = [
    regeln,
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
    item.kriterien ? "\nSo verteilt die Lehrkraft die Punkte:\n" + item.kriterien : "",
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
function createStore(dataDir, name = "infoaustausch") {
  const UNLOCK_FILE = path.join(dataDir, `${name}.json`);
  const SUBMISSIONS_FILE = path.join(dataDir, `${name}_abgaben.json`);

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

/**
 * Punkte je Teil (z. B. "Modul 1 ...", "Transfer") in der Reihenfolge der Probe.
 * Aufgaben ohne `teil` (Informatik 7) ergeben eine leere Liste.
 */
function teilSummen(details) {
  const map = new Map();
  (details || []).forEach((d) => {
    if (!d.teil) return;
    const t = map.get(d.teil) || { teil: d.teil, points: 0, maxPoints: 0 };
    t.points += Number(d.points) || 0;
    t.maxPoints += Number(d.maxPoints) || 0;
    map.set(d.teil, t);
  });
  return [...map.values()];
}

// Kurzname fuer Tabellenkoepfe: "Modul 3 · Informationssysteme" -> "Modul 3"
const teilKurz = (teil) => String(teil).split("·")[0].trim();
// Herkunft einer Aufgabe (Block-Proben seit 07.10.2026): Modul (Kennung und Titel) und „Transfer“ – geht an die Seite
// und wird mit der Abgabe gespeichert (Korrektur, Rückgabe). alt: true an einer Probe = frühere Fassung.
const herkunft = (it) => ({ ...(it.modul ? { modul: it.modul, modulTitel: it.modulTitel || "" } : {}), ...(it.transfer ? { transfer: true } : {}) });

// Datum und Uhrzeit wie in Deutschland ueblich, z. B. 29.09.2026 10:15
function deutscheZeit(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin", day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  }).format(d).replace(",", "");
}

const BEWERTET_VON = {
  ki: "KI",
  lehrkraft: "Lehrkraft",
  keywords: "Stichwörter (KI nicht erreichbar)",
  leer: "keine Antwort"
};

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
 * @param opts.prefix          Pfad der Routen (Standard /api/infoaustausch)
 * @param opts.storeName       Name der JSON-Dateien (Standard infoaustausch)
 * @param opts.gradeScale      eigener Notenschluessel (Standard GRADE_SCALE)
 * @param opts.kiRegeln        eigener Bewertungstext fuer die KI (Standard KI_REGELN)
 * @param opts.kindZumCode     Anmeldung mit dem Code aus dem Lernfortschritt (statt Namen)
 * @param opts.zeitTaktMs, opts.nachfristMs  nur für Tests: wie oft der Server abgelaufene Bearbeitungszeiten prüft (30 s)
 *                             und wie lange er danach noch auf die Seite wartet (90 s)
 * @returns { abgaben }        alle Abgaben (fuer die Notenuebersicht je Klasse)
 */
function registerInfoaustauschRoutes(app, opts) {
  const P = opts.prefix || "/api/infoaustausch";
  const NAME = opts.storeName || "infoaustausch";
  // R-Klassen: eigener Schluessel (50 % = Note 3), M-Klassen: 50 % = Note 4 (Zug kommt vom Code)
  const SCALE = opts.gradeScale || GRADE_SCALE;
  const SCALE_M = opts.gradeScaleM || GRADE_SCALE_M;
  const REGELN = opts.kiRegeln || KI_REGELN;
  const grade = (percent, zug) => gradeFromPercent(percent, zug === "M" ? SCALE_M : SCALE);
  // notenzug an der Probe: fester Schlüssel für alle Kinder (gespeichert in der Abgabe, damit Neurechnen ihn behält)
  const notenzugVon = (test) => (test && (test.notenzug === "M" || test.notenzug === "R") ? test.notenzug : "");
  const zugFuerNote = (rec) => rec.notenzug || rec.zug;
  // Testregeln dieser Probe: wegSekunden / kopieren an der Probe ersetzen die Vorgabe (0 = dafür keine Note 6)
  const regelAngaben = (test) => ({ ...(Number.isInteger(test.wegSekunden) ? { wegSekunden: test.wegSekunden } : {}),
    ...(Number.isInteger(test.kopieren) ? { kopieren: test.kopieren } : {}) });
  const regelVon = (test) => ({ ...probeRegel.REGEL, ...regelAngaben(test) });
  const store = createStore(opts.dataDir, NAME);
  const TESTS = opts.tests || {};
  const TEACHER_PASSWORD = opts.teacherPassword;
  const HASH_SECRET = opts.hashSecret || "grumi-fallback-secret";
  const askAnthropic = opts.askAnthropic;
  const probeKind = probeKindPruefer(opts.kindZumCode);
  const REGEL_MODUL = String(P).replace(/^\/api\//, "");   // Name für Rückgabe und Testregeln

  const isTeacher = (req) => clean(req.body?.password) === TEACHER_PASSWORD;

  // Zuordnen: ein Punkt je Zeile
  const itemPoints = (it) => it.type === "match" ? it.rows.length : (Number(it.points) || 1);
  const maxPoints = (test) =>
    test.items.reduce((sum, it) => sum + itemPoints(it), 0);

  /* ---------- Bearbeitungszeit (abgabeMinuten an der Probe): Beginn und Zwischenstand je Kind ---------- */
  const SITZ_FILE = path.join(opts.dataDir, `${NAME}_sitzungen.json`);
  const NACHFRIST_MS = opts.nachfristMs ?? 90 * 1000;   // so lange wartet der Server nach Ablauf auf die Abgabe der Seite (Tests: kürzer)
  const sitzKey = (testId, studentKey) => testId + "|" + studentKey;
  function sitzLesen() {
    try { const d = JSON.parse(fs.readFileSync(SITZ_FILE, "utf8")); return { sitzungen: d && d.sitzungen && typeof d.sitzungen === "object" ? d.sitzungen : {} }; }
    catch (_e) { return { sitzungen: {} }; }
  }
  function sitzSchreiben(d) {
    const temp = SITZ_FILE + ".tmp";
    fs.writeFileSync(temp, JSON.stringify(d, null, 1), "utf8");
    fs.renameSync(temp, SITZ_FILE);
  }
  function sitzLoeschen(testId, studentKey) {
    const d = sitzLesen(), k = sitzKey(testId, studentKey);
    if (!d.sitzungen[k]) return;
    delete d.sitzungen[k];
    sitzSchreiben(d);
  }
  const endeVon = (test, s) => Date.parse(s.begonnenAm) + test.abgabeMinuten * 60000;
  const sitzAntwort = (test, s) => ({ begonnenAm: s.begonnenAm, serverZeit: new Date().toISOString(), minuten: test.abgabeMinuten,
    endetAm: new Date(endeVon(test, s)).toISOString() });
  const zahl = (v) => Math.max(0, Math.min(99999, Math.round(Number(v)) || 0));
  // Antworten aus einem Zwischenstand in die Form der Abgabe bringen (keine fremden Felder, begrenzte Länge)
  function antwortenSauber(test, raw) {
    const liste = Array.isArray(raw) ? raw : [];
    return test.items.map((it, i) => {
      const a = liste[i];
      if (it.type === "choice") return Number.isInteger(a) && a >= 0 && a < it.options.length ? a : null;
      if (it.type === "match") return it.rows.map((_r, r) => (Array.isArray(a) && Number.isInteger(a[r]) && a[r] >= 0 && a[r] < it.options.length ? a[r] : null));
      return clean(a).slice(0, 2000);
    });
  }

  /* ---------- Auswertung einer Abgabe (Seite oder Server nach Ablauf der Zeit) ---------- */
  async function auswerten(test, answers) {
    const details = [];
    let aiUsed = false;
    let needsReview = false;

    for (let idx = 0; idx < test.items.length; idx++) {
      const item = test.items[idx];
      const max = itemPoints(item);
      const raw = answers[idx];

      if (item.type === "match") {
        const picked = Array.isArray(raw) ? raw : [];
        const optionText = (k) => {
          const n = Number.isInteger(k) ? k : parseInt(k, 10);
          return Number.isInteger(n) && item.options[n] !== undefined ? item.options[n] : "";
        };
        let hits = 0;
        const given = [];
        const expected = [];
        item.rows.forEach((row, r) => {
          const chosen = optionText(picked[r]);
          if (chosen && chosen === item.options[row.answer]) hits++;
          given.push(`${row.text} → ${chosen || "–"}`);
          expected.push(`${row.text} → ${item.options[row.answer]}`);
        });
        details.push({
          nr: idx + 1,
          type: "match",
          teil: item.teil || "", ...herkunft(item),
          prompt: item.prompt,
          given: given.join(" | "),
          correct: hits === max,
          points: hits,
          maxPoints: max,
          expected: expected.join(" | ")
        });
      } else if (item.type === "choice") {
        const picked = Number.isInteger(raw) ? raw : parseInt(raw, 10);
        const correct = picked === item.answer;
        details.push({
          nr: idx + 1,
          type: "choice",
          teil: item.teil || "", ...herkunft(item),
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
        const scored = await aiScore(given, item, askAnthropic, REGELN);
        if (scored.source === "ki") aiUsed = true;
        if (scored.needsReview) needsReview = true;
        details.push({
          nr: idx + 1,
          type: "text",
          teil: item.teil || "", ...herkunft(item),
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
    return { details, aiUsed, needsReview };
  }

  /* Abgabe bewerten und speichern. body = Angaben der Seite zu den Testregeln (bzw. die des Servers);
     extra = { testDate, deviceHash }. Ergebnis: die gespeicherte Abgabe oder null (mit diesem Code schon abgegeben). */
  const inArbeit = new Set();
  async function abgabeSpeichern(test, kind, answers, body, extra) {
    const key = kind.key, sperre = sitzKey(test.id, key);
    if (inArbeit.has(sperre)) return null;
    inArbeit.add(sperre);
    try {
      const { details, aiUsed, needsReview } = await auswerten(test, answers);
      const total = maxPoints(test);
      const score = details.reduce((sum, d) => sum + d.points, 0);
      const percent = total ? Math.round((score / total) * 100) : 0;
      const notenzug = notenzugVon(test);
      const record = {
        id: `ia_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
        testId: test.id,
        testTitle: test.title,
        unit: test.unit,
        code: kind.code, zug: kind.zug, ...(notenzug ? { notenzug } : {}), lrs: kind.lrs, verlassen: verlassenZahl(body && body.verlassen), protokoll: protokollSauber(body && body.protokoll),
        firstName: kind.firstName, lastName: kind.lastName, className: kind.className,
        studentKey: key,
        testDate: extra.testDate || new Date().toISOString().slice(0, 10),
        score, total, percent, grade: grade(percent, notenzug || kind.zug),
        aiUsed, needsReview,
        details,
        deviceHash: extra.deviceHash || "",
        submittedAt: new Date().toISOString()
      };

      // Erst jetzt frisch laden: Waehrend der KI-Pruefung koennen andere Kinder
      // abgegeben haben. Mit dem alten Stand wuerden deren Abgaben ueberschrieben.
      const fresh = store.loadSubmissions();
      if (fresh.submissions.some((s) => s.testId === test.id && s.studentKey === key)) return null;
      probeRegel.eintragen(record, probeRegel.ausAbgabe(body, REGEL_MODUL, test.id, key, regelVon(test)));   // Testregeln: beendet = Note 6
      fresh.submissions.push(record);
      store.saveSubmissions(fresh);
      probeRegel.vergessen(REGEL_MODUL, test.id, key);
      if (test.abgabeMinuten) sitzLoeschen(test.id, key);
      return record;
    } finally {
      inArbeit.delete(sperre);
    }
  }

  // Zeit abgelaufen, Seite gibt nicht mehr ab (zu, Gerät aus): der Server gibt mit dem letzten Zwischenstand ab – ohne Note 6
  async function zeitAbgabe(test, s) {
    const body = { regel: true, automatisch: "server", verlassen: s.verlassen || 0, kopierversuche: s.kopierversuche || 0, wegSumme: s.wegSumme || 0 };
    const rec = await abgabeSpeichern(test, s.kind, antwortenSauber(test, s.answers), body,
      { testDate: String(s.begonnenAm || "").slice(0, 10), deviceHash: "" });
    if (!rec && !inArbeit.has(sitzKey(test.id, s.kind.key))) sitzLoeschen(test.id, s.kind.key);   // schon abgegeben
    return rec;
  }
  async function zeitAbgaben() {
    const jetzt = Date.now();
    const faellig = Object.values(sitzLesen().sitzungen).filter((s) => {
      const test = TESTS[s.testId];
      return test && test.abgabeMinuten && s.kind && jetzt > endeVon(test, s) + NACHFRIST_MS;
    });
    for (const s of faellig) await zeitAbgabe(TESTS[s.testId], s);
    // Sitzungen von Proben ohne Bearbeitungszeit (oder entfernten Proben) nach einem Tag aufräumen
    const d = sitzLesen(); let weg = false;
    Object.keys(d.sitzungen).forEach((k) => {
      const s = d.sitzungen[k], test = TESTS[s.testId];
      if ((!test || !test.abgabeMinuten) && !(Date.parse(s.begonnenAm) > jetzt - 24 * 3600000)) { delete d.sitzungen[k]; weg = true; }
    });
    if (weg) sitzSchreiben(d);
  }
  if (Object.values(TESTS).some((t) => t.abgabeMinuten)) {
    const takt = setInterval(() => { zeitAbgaben().catch((e) => console.error(`${NAME}: Abgabe nach Ablauf der Zeit:`, e.message)); }, opts.zeitTaktMs || 30 * 1000);
    if (takt.unref) takt.unref();
  }

  /* ================================================================
     UEBUNGSMODULE: sofortige KI-Rueckmeldung zu freien Texten
     ----------------------------------------------------------------
     Diese Route gehoert NICHT zur Probe. Sie vergibt keine Noten und
     speichert nichts. Die acht Lernmodule rufen sie auf, damit die
     Schueler beim Ueben sofort erfahren, ob ihre Antwort stimmt.
     ================================================================ */
  app.post(P + "/feedback", async (req, res) => {
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
      REGELN,
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
  app.get(P + "/list", (_req, res) => {
    const unlocks = store.loadUnlocks();
    const list = Object.values(TESTS).map((t) => ({
      id: t.id,
      title: t.title,
      unit: t.unit,
      classLevel: t.classLevel,
      itemCount: t.items.length,
      maxPoints: maxPoints(t),
      ...(t.alt ? { alt: true } : {}), thema: t.thema || "", minutes: t.minutes || undefined,
      ...(notenzugVon(t) ? { notenzug: notenzugVon(t) } : {}), ...regelAngaben(t), ...(t.abgabeMinuten ? { abgabeMinuten: t.abgabeMinuten } : {}),
      unlocked: probeOffen(unlocks.unlocked[t.id])
    }));
    res.json({ ok: true, tests: list });
  });

  /* ---------- Schueler: Probe starten ---------- */
  app.post(P + "/start", async (req, res) => {
    const testId = clean(req.body?.testId);

    const test = TESTS[testId];
    if (!test) return res.status(404).json({ ok: false, error: "test_not_found" });

    const unlocks = store.loadUnlocks();
    if (!probeOffen(unlocks.unlocked[testId])) {
      return res.status(403).json({
        ok: false, error: "locked",
        message: "Diese Probe ist noch nicht freigeschaltet."
      });
    }
    const kind = await probeKind(req, res);
    if (!kind) return;

    const key = kind.key;
    const existing = store.loadSubmissions().submissions
      .find((s) => s.testId === testId && s.studentKey === key);
    if (existing) {
      return res.status(409).json({
        ok: false, error: "already_submitted",
        message: "Mit diesem Code wurde die Probe bereits abgegeben.",
        submittedAt: existing.submittedAt
      });
    }

    // Bearbeitungszeit: Die Uhr beginnt beim ersten Start und läuft beim Neuladen weiter
    let sitzung = null, zwischenstand = null;
    if (test.abgabeMinuten) {
      const d = sitzLesen(), k = sitzKey(testId, key);
      let s = d.sitzungen[k];
      if (!s) {
        s = { testId, kind, begonnenAm: new Date().toISOString(), answers: [], gespeichertAm: "" };
        d.sitzungen[k] = s;
        sitzSchreiben(d);
      }
      if (Date.now() > endeVon(test, s)) {
        const rec = await zeitAbgabe(test, s);
        return res.status(409).json({
          ok: false, error: "already_submitted", zeitUm: true,
          message: "Die Bearbeitungszeit ist abgelaufen. Deine Probe wurde mit deinem letzten Stand automatisch abgegeben.",
          submittedAt: rec ? rec.submittedAt : ""
        });
      }
      sitzung = sitzAntwort(test, s);
      if (Array.isArray(s.answers) && s.answers.length) zwischenstand = { answers: antwortenSauber(test, s.answers), gespeichertAm: s.gespeichertAm || "" };
    }

    // Aufgaben OHNE Loesungen ausliefern
    const items = test.items.map((it, idx) => ({
      nr: idx + 1,
      type: it.type,
      teil: it.teil || "", ...herkunft(it),
      prompt: it.prompt,
      options: it.type === "choice" || it.type === "match" ? it.options : undefined,
      rows: it.type === "match" ? it.rows.map((r) => r.text) : undefined,
      image: it.image || "",
      imageAlt: it.imageAlt || "",
      points: itemPoints(it),
      lines: it.lines || 3
    }));

    res.json({
      ok: true,
      test: {
        id: test.id,
        title: test.title,
        unit: test.unit,
        maxPoints: maxPoints(test),
        ...(notenzugVon(test) ? { notenzug: notenzugVon(test) } : {}), ...regelAngaben(test)
      },
      items,
      ...(sitzung ? { sitzung } : {}), ...(zwischenstand ? { zwischenstand } : {})
    });
  });

  /* ---------- Schueler: Zwischenstand sichern (nur Proben mit Bearbeitungszeit) ----------
     Damit kann der Server nach Ablauf der Zeit abgeben, auch wenn die Seite nicht mehr offen ist. Geprüft wird nur,
     ob es zu Probe und Code eine laufende Bearbeitung gibt (die hat der Start mit gültigem Code angelegt). */
  app.post(P + "/zwischenstand", (req, res) => {
    const testId = clean(req.body?.testId), code = clean(req.body?.code);
    const test = TESTS[testId];
    if (!test || !test.abgabeMinuten) return res.status(404).json({ ok: false, error: "test_not_found" });
    if (!/^\d{3}$/.test(code)) return res.status(400).json({ ok: false, error: "code_falsch" });
    const d = sitzLesen(), s = d.sitzungen[sitzKey(testId, "code|" + code)];
    if (!s) return res.status(404).json({ ok: false, error: "keine_sitzung" });
    if (Date.now() > endeVon(test, s) + NACHFRIST_MS) return res.status(409).json({ ok: false, error: "zeit_um" });
    s.answers = antwortenSauber(test, req.body?.answers);
    s.verlassen = Math.max(zahl(s.verlassen), zahl(req.body?.verlassen));
    s.kopierversuche = Math.max(zahl(s.kopierversuche), zahl(req.body?.kopierversuche));
    s.wegSumme = Math.max(zahl(s.wegSumme), zahl(req.body?.wegSumme));
    s.gespeichertAm = new Date().toISOString();
    sitzSchreiben(d);
    res.json({ ok: true, gespeichertAm: s.gespeichertAm, ...sitzAntwort(test, s) });
  });

  /* ---------- Schueler: Abgabe ---------- */
  app.post(P + "/submit", async (req, res) => {
    const testId = clean(req.body?.testId);
    const testDate = clean(req.body?.testDate);
    const answers = Array.isArray(req.body?.answers) ? req.body.answers : [];

    const test = TESTS[testId];
    if (!test) return res.status(404).json({ ok: false, error: "test_not_found" });

    const unlocks = store.loadUnlocks();
    if (!probeOffen(unlocks.unlocked[testId], true)) {
      return res.status(403).json({ ok: false, error: "locked", message: "Diese Probe ist nicht freigeschaltet." });
    }
    const kind = await probeKind(req, res);
    if (!kind) return;

    const key = kind.key;
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

    /* ---- Auswertung und Speichern (auch nach Ablauf der Bearbeitungszeit: Die Seite gibt dann selbst ab) ---- */
    const record = await abgabeSpeichern(test, kind, answers, req.body, { testDate, deviceHash: deviceHash(req, HASH_SECRET) });
    if (!record) {
      return res.status(409).json({ ok: false, error: "already_submitted", message: "Mit diesem Code wurde bereits abgegeben." });
    }
    const { details } = record;

    res.json({
      ok: true,
      result: {
        score: record.score, total: record.total, percent: record.percent, grade: record.grade,
        needsReview: record.needsReview,
        teile: teilSummen(details),
        details: details.map((d) => ({
          nr: d.nr, type: d.type, teil: d.teil, ...herkunft(d), prompt: d.prompt, given: d.given,
          correct: d.correct, points: d.points, maxPoints: d.maxPoints,
          comment: d.comment || "", expected: d.expected
        })),
        submittedAt: record.submittedAt
      }
    });
  });

  /* ---------- Lehrkraft: Freischalten / Sperren ---------- */
  app.post(P + "/unlock", (req, res) => {
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
  app.post(P + "/results", (req, res) => {
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
  app.post(P + "/override", (req, res) => {
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
    rec.grade = grade(rec.percent, zugFuerNote(rec));
    probeRegel.note6(rec);
    rec.needsReview = rec.details.some((d) => d.scoredBy === "keywords");

    store.saveSubmissions(db);
    res.json({ ok: true, score: rec.score, percent: rec.percent, grade: rec.grade });
  });

  /* ---------- Lehrkraft: Abgabe loeschen (Nachschreiben) ---------- */
  app.post(P + "/delete-submission", (req, res) => {
    if (!isTeacher(req)) return res.status(401).json({ ok: false, error: "bad_password" });

    const id = clean(req.body?.submissionId);
    const db = store.loadSubmissions();
    const before = db.submissions.length;
    const weg = db.submissions.find((s) => s.id === id);
    if (weg) { probeRegel.vergessen(REGEL_MODUL, weg.testId, weg.studentKey); sitzLoeschen(weg.testId, weg.studentKey); }   // Nachschreiben: Uhr von vorn
    db.submissions = db.submissions.filter((s) => s.id !== id);
    if (db.submissions.length === before) {
      return res.status(404).json({ ok: false, error: "not_found" });
    }
    store.saveSubmissions(db);
    res.json({ ok: true, removed: before - db.submissions.length });
  });

  /* ---------- Lehrkraft: Export fuer Excel ----------
     format "xlsx": echte Excel-Datei mit drei Blaettern
       Ergebnisse  – eine Zeile je Schueler, Punkte je Teil (Modul 1-6, Transfer)
       Antworten   – jede Antwort mit Punkten, KI-Rueckmeldung und Loesung
       Notenschluessel
     sonst: CSV mit Semikolon (fuer die Seiten, die noch CSV laden) */
  app.post(P + "/export", (req, res) => {
    if (!isTeacher(req)) return res.status(401).json({ ok: false, error: "bad_password" });

    const testId = clean(req.body?.testId);
    let rows = store.loadSubmissions().submissions;
    if (testId) rows = rows.filter((r) => r.testId === testId);
    rows = rows.slice().sort((a, b) =>
      a.className.localeCompare(b.className, "de") ||
      a.lastName.localeCompare(b.lastName, "de") ||
      a.firstName.localeCompare(b.firstName, "de")
    );

    // alle Teile in der Reihenfolge der Probe(n)
    const teile = [];
    const tests = testId && TESTS[testId] ? [TESTS[testId]] : Object.values(TESTS);
    tests.forEach((t) => t.items.forEach((it) => {
      if (it.teil && !teile.includes(it.teil)) teile.push(it.teil);
    }));
    const teilMax = (teil) => {
      const t = tests.find((x) => x.items.some((it) => it.teil === teil));
      return t ? t.items.filter((it) => it.teil === teil).reduce((s, it) => s + itemPoints(it), 0) : "";
    };
    const summenVon = (r) => {
      const s = teilSummen(r.details);
      return teile.map((teil) => {
        const hit = s.find((x) => x.teil === teil);
        return hit ? hit.points : "";
      });
    };
    const stamp = new Date().toISOString().slice(0, 10);
    const fileBase = `${NAME}_${testId || "alle"}_${stamp}`;

    if (clean(req.body?.format) === "xlsx") {
      const ergebnisse = {
        name: "Ergebnisse",
        columns: [
          { header: "Klasse", width: 8 },
          { header: "Nachname", width: 16 },
          { header: "Vorname", width: 14 },
          { header: "Datum", width: 11, type: "date" },
          { header: "Punkte", width: 8, type: "number" },
          { header: "von", width: 6, type: "number" },
          { header: "Prozent", width: 8, type: "number" },
          { header: "Note", width: 6, type: "number" },
          ...teile.map((teil) => ({ header: `${teilKurz(teil)} (${teilMax(teil)} P)`, width: 11, type: "number" })),
          { header: "Bitte prüfen", width: 12 },
          { header: "Probe", width: 34 },
          { header: "Abgabe", width: 16, type: "datetime" }
        ],
        rows: rows.map((r) => [
          r.className, r.lastName, r.firstName, r.testDate,
          r.score, r.total, r.percent, r.grade,
          ...summenVon(r),
          r.needsReview ? "ja – ohne KI bewertet" : "",
          r.testTitle, r.submittedAt
        ])
      };

      const antworten = {
        name: "Antworten",
        columns: [
          { header: "Klasse", width: 8 },
          { header: "Nachname", width: 16 },
          { header: "Vorname", width: 14 },
          { header: "Nr", width: 5, type: "number" },
          { header: "Teil", width: 12 },
          { header: "Aufgabe", width: 48, type: "wrap" },
          { header: "Antwort", width: 48, type: "wrap" },
          { header: "Punkte", width: 8, type: "number" },
          { header: "von", width: 6, type: "number" },
          { header: "bewertet von", width: 14 },
          { header: "Rückmeldung", width: 36, type: "wrap" },
          { header: "Lösung", width: 48, type: "wrap" }
        ],
        rows: []
      };
      rows.forEach((r) => (r.details || []).forEach((d) => {
        antworten.rows.push([
          r.className, r.lastName, r.firstName, d.nr, d.teil ? teilKurz(d.teil) : "",
          d.prompt, d.given || "", d.points, d.maxPoints,
          d.type === "text" ? (BEWERTET_VON[d.scoredBy] || d.scoredBy || "") : "automatisch",
          d.comment || "", d.expected || ""
        ]);
      }));

      // Notenschluessel mit Punktgrenzen, wenn genau eine Probe gewaehlt ist
      const total = testId && TESTS[testId] ? maxPoints(TESTS[testId]) : 0;
      const abPunkte = (min) => {
        if (!total) return "";
        for (let p = 0; p <= total; p++) if (Math.round((p / total) * 100) >= min) return p;
        return total;
      };
      const schluessel = {
        name: "Notenschlüssel",
        columns: [
          { header: "Note", width: 6, type: "number" },
          { header: "R-Klassen ab Prozent", width: 18, type: "number" },
          { header: total ? `R-Klassen ab Punkte (von ${total})` : "R-Klassen ab Punkte", width: 26, type: "number" },
          { header: "M-Klassen ab Prozent", width: 18, type: "number" },
          { header: total ? `M-Klassen ab Punkte (von ${total})` : "M-Klassen ab Punkte", width: 26, type: "number" }
        ],
        rows: SCALE.map((s, i) => [s.grade, s.min, abPunkte(s.min), SCALE_M[i].min, abPunkte(SCALE_M[i].min)])
      };

      const buf = buildXlsx([ergebnisse, antworten, schluessel]);
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="${fileBase}.xlsx"`);
      return res.send(buf);
    }

    // CSV: Text, der mit = + - @ beginnt, wuerde Excel als Formel lesen
    const esc = (v) => {
      let s = String(v == null ? "" : v);
      if (/^[=+\-@]/.test(s) && !/^-?\d+([.,]\d+)?$/.test(s)) s = "'" + s;
      return `"${s.replace(/"/g, '""')}"`;
    };
    const header = ["Datum", "Probe", "Klasse", "Nachname", "Vorname", "Punkte", "Von", "Prozent", "Note",
      ...teile.map((teil) => `${teilKurz(teil)} (${teilMax(teil)} P)`), "Abgabe"];
    const lines = [header.map(esc).join(";")];
    rows.forEach((r) => {
      lines.push([
        r.testDate, r.testTitle, r.className, r.lastName, r.firstName,
        r.score, r.total, r.percent, r.grade, ...summenVon(r), deutscheZeit(r.submittedAt)
      ].map(esc).join(";"));
    });

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${fileBase}.csv"`);
    res.send("﻿" + lines.join("\r\n"));
  });

  // Testregeln: Die Lehrkraft hebt die Note 6 einer beendeten Probe auf (/api/probe-regel/aufheben)
  probeRegel.modulAnmelden(REGEL_MODUL, { aufheben: probeRegel.aufhebenMit({
    lesen: () => { const d = store.loadSubmissions(); return { daten: d, liste: d.submissions }; },
    schreiben: (d) => store.saveSubmissions(d),
    neu: (rec) => { rec.grade = grade(rec.percent, zugFuerNote(rec)); }
  }) });

  return { abgaben: () => store.loadSubmissions().submissions };
}

module.exports = {
  registerInfoaustauschRoutes,
  gradeFromPercent,
  aiScore,
  keywordScore,
  GRADE_SCALE,
  KI_REGELN
};
