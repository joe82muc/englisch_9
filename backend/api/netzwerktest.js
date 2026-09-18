"use strict";

/**
 * Netzwerktest-Modul (Informatik 9)
 * ---------------------------------
 * Aufgebaut wie das Vokabeltest-Modul, aber mit zwei Aufgabentypen:
 *   - "choice": Anklicken, serverseitig exakt ausgewertet
 *   - "text":   Freier Text, den die KI auf inhaltliche Sinnhaftigkeit prueft
 *
 * Bewertung des freien Textes (Absprache mit der Lehrkraft):
 *   WOHLWOLLEND. Bewertet wird, ob die Aussage fachlich richtig ist.
 *   Rechtschreibung, Grammatik und Ausdruck fliessen NICHT in die Punkte ein.
 *
 * Ablauf wie beim Vokabeltest:
 *   - Lehrkraft schaltet die Probe frei / sperrt sie wieder
 *   - Schueler sehen nur freigeschaltete Proben
 *   - Pro Name und Probe ist genau EINE Abgabe moeglich (Sperre auf dem Server)
 *   - Loesungen verlassen den Server nie vor der Abgabe
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

/* ------------------------------------------------------------------
   Notenschluessel Mittelschule (identisch zum Vokabeltest)
   ------------------------------------------------------------------ */
const GRADE_SCALE = [
  { grade: 1, min: 92 },
  { grade: 2, min: 81 },
  { grade: 3, min: 67 },
  { grade: 4, min: 50 },
  { grade: 5, min: 30 },
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
      ? "Wichtige Fachbegriffe sind enthalten."
      : "Teilweise richtig - es fehlen noch Angaben.",
    needsReview: true,
    source: "keywords"
  };
}

/**
 * Bewertet eine freie Antwort mit der KI.
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
    "Du korrigierst eine Informatik-Probe einer 9. Klasse an einer bayerischen Mittelschule.",
    "Thema: Computernetzwerke (Netzwerkarten, Datenpakete, Topologien, Netzwerkgeraete, IP-Adressen).",
    "",
    "Bewerte AUSSCHLIESSLICH, ob die Antwort inhaltlich sinnvoll und fachlich richtig ist.",
    "Rechtschreibung, Grammatik, Zeichensetzung und Ausdruck sind voellig egal.",
    "Umgangssprache und eigene Worte sind ausdruecklich erlaubt.",
    "Fachbegriffe muessen NICHT genannt werden, wenn die Sache richtig beschrieben ist.",
    "Bewerte wohlwollend: Im Zweifel entscheide zugunsten der Schuelerin oder des Schuelers.",
    "Eine unvollstaendige, aber richtige Antwort bekommt Teilpunkte.",
    "Falsche oder themenfremde Aussagen bekommen 0 Punkte.",
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
  const UNLOCK_FILE = path.join(dataDir, "netzwerktests.json");
  const SUBMISSIONS_FILE = path.join(dataDir, "netzwerktest_abgaben.json");

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
function registerNetzwerktestRoutes(app, opts) {
  const store = createStore(opts.dataDir);
  const TESTS = opts.tests || {};
  const TEACHER_PASSWORD = opts.teacherPassword;
  const HASH_SECRET = opts.hashSecret || "grumi-fallback-secret";
  const askAnthropic = opts.askAnthropic;

  const isTeacher = (req) => clean(req.body?.password) === TEACHER_PASSWORD;

  const maxPoints = (test) =>
    test.items.reduce((sum, it) => sum + (Number(it.points) || 1), 0);

  /* ---------- Oeffentlich: Liste der Proben (OHNE Loesungen) ---------- */
  app.get("/api/netzwerktest/list", (_req, res) => {
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
  app.post("/api/netzwerktest/start", (req, res) => {
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
  app.post("/api/netzwerktest/submit", async (req, res) => {
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
      id: `nt_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
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
  app.post("/api/netzwerktest/unlock", (req, res) => {
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
  app.post("/api/netzwerktest/results", (req, res) => {
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
  app.post("/api/netzwerktest/override", (req, res) => {
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
  app.post("/api/netzwerktest/delete-submission", (req, res) => {
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
  app.post("/api/netzwerktest/export", (req, res) => {
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
    res.setHeader("Content-Disposition", `attachment; filename="netzwerktest_${testId || "alle"}.csv"`);
    res.send("﻿" + lines.join("\r\n"));
  });
}

module.exports = {
  registerNetzwerktestRoutes,
  gradeFromPercent,
  aiScore,
  keywordScore
};
