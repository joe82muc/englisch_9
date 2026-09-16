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

/* ------------------------------------------------------------------
   Notenschluessel Mittelschule M-Zug (50 % = Note 4)
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
 */
function checkAnswer(given, solutions) {
  const g = normalizeAnswer(given);
  if (!g) return { correct: false, typo: false, matched: "" };

  const accepted = [];
  for (const sol of solutions) {
    // ";" trennt gleichwertige Bedeutungen ("Norden; Nord-")
    String(sol).split(";").forEach((part) => {
      const n = normalizeAnswer(part);
      if (n) accepted.push({ norm: n, raw: String(part).trim() });
    });
  }

  for (const a of accepted) {
    if (g === a.norm) return { correct: true, typo: false, matched: a.raw };
  }
  for (const a of accepted) {
    if (a.norm.length >= 5 && editDistance(g, a.norm, 1) <= 1) {
      return { correct: true, typo: true, matched: a.raw };
    }
  }
  return { correct: false, typo: false, matched: "" };
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

function studentKey(firstName, lastName, className) {
  return `${clean(firstName)}|${clean(lastName)}|${clean(className)}`
    .toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ").trim();
}

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
 */
function registerVokabeltestRoutes(app, opts) {
  const store = createStore(opts.dataDir);
  const TESTS = opts.tests || {};
  const TEACHER_PASSWORD = opts.teacherPassword;
  const HASH_SECRET = opts.hashSecret || "grumi-fallback-secret";

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
      unlocked: Boolean(unlocks.unlocked[t.id]?.open)
    }));
    res.json({ ok: true, tests: list });
  });

  /* ---------- Schueler: Test starten ---------- */
  app.post("/api/vokabeltest/start", (req, res) => {
    const testId = clean(req.body?.testId);
    const firstName = clean(req.body?.firstName);
    const lastName = clean(req.body?.lastName);
    const className = clean(req.body?.className);

    const test = TESTS[testId];
    if (!test) return res.status(404).json({ ok: false, error: "test_not_found" });

    const unlocks = store.loadUnlocks();
    if (!unlocks.unlocked[testId]?.open) {
      return res.status(403).json({ ok: false, error: "locked", message: "Dieser Test ist noch nicht freigeschaltet." });
    }
    if (!firstName || !lastName || !className) {
      return res.status(400).json({ ok: false, error: "missing_fields", message: "Vorname, Nachname und Klasse sind erforderlich." });
    }

    // Bereits abgegeben? -> kein zweiter Versuch
    const key = studentKey(firstName, lastName, className);
    const existing = store.loadSubmissions().submissions
      .find((s) => s.testId === testId && s.studentKey === key);
    if (existing) {
      return res.status(409).json({
        ok: false, error: "already_submitted",
        message: "Fuer diesen Namen wurde der Test bereits abgegeben.",
        submittedAt: existing.submittedAt
      });
    }

    // Aufgaben ohne Loesungen ausliefern
    const items = test.items.map((it, idx) => ({
      nr: idx + 1,
      prompt: it.prompt,
      direction: it.direction,
      hint: it.hint || ""
    }));

    res.json({
      ok: true,
      test: { id: test.id, title: test.title, unit: test.unit, direction: test.direction || "mixed" },
      items
    });
  });

  /* ---------- Schueler: Abgabe ---------- */
  app.post("/api/vokabeltest/submit", (req, res) => {
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
      return res.status(403).json({ ok: false, error: "locked", message: "Dieser Test ist nicht freigeschaltet." });
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
        message: "Dieser Test wurde bereits abgegeben.",
        submittedAt: existing.submittedAt
      });
    }

    // ---- Auswertung ----
    const details = test.items.map((item, idx) => {
      const given = clean(answers[idx]);
      const result = checkAnswer(given, item.solutions);
      return {
        nr: idx + 1,
        prompt: item.prompt,
        given,
        correct: result.correct,
        typo: result.typo,
        expected: item.solutions.join(" / ")
      };
    });

    const total = details.length;
    const score = details.filter((d) => d.correct).length;
    const typos = details.filter((d) => d.correct && d.typo).length;
    const percent = total ? Math.round((score / total) * 100) : 0;
    const grade = gradeFromPercent(percent);

    const record = {
      id: `vt_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
      testId,
      testTitle: test.title,
      unit: test.unit,
      firstName, lastName, className,
      studentKey: key,
      testDate: testDate || new Date().toISOString().slice(0, 10),
      score, total, percent, grade, typos,
      details,
      deviceHash: deviceHash(req, HASH_SECRET),
      submittedAt: new Date().toISOString()
    };

    db.submissions.push(record);
    store.saveSubmissions(db);

    res.json({
      ok: true,
      result: {
        score, total, percent, grade, typos,
        details: details.map((d) => ({
          nr: d.nr, prompt: d.prompt, given: d.given,
          correct: d.correct, typo: d.typo, expected: d.expected
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
}

module.exports = {
  registerVokabeltestRoutes,
  gradeFromPercent,
  checkAnswer,
  normalizeAnswer,
  GRADE_SCALE
};
