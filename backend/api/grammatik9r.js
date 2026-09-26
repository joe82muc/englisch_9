"use strict";

/**
 * Grammatik-Modul Englisch 9R
 * ---------------------------
 * Grammatikprobe und Kurztests zu den Units (Unit 1: G1 simple past,
 * G2 will-future, G3 if-clauses I, G4 present progressive).
 * Aufgebaut wie das Infoaustausch-Modul (Informatik 7).
 *
 * Notenschluessel je Test (Feld "gradeScale"):
 *   "9R" (Standard) 50 Prozent = Note 3 - Englisch 9R
 *   "M"             50 Prozent = Note 4 - Englisch 9M (M-Zug)
 * Englisch 9M Unit 1 nutzt dieselben Aufgaben wie 9R, nur mit "M".
 *
 * Aufgabentypen:
 *   - "gap":    Luecken im Satz ("___"). Jede Luecke ist 1 Punkt.
 *               Erst exakter Vergleich (Kurz- und Langformen gleichwertig),
 *               danach KI-Zweitmeinung fuer abgelehnte Luecken. Die KI darf
 *               nur aufwerten, nie abwerten.
 *   - "choice": Anklicken, exakt ausgewertet.
 *   - "text":   Ganzer Satz (meist Uebersetzung). Die KI prueft, ob die
 *               grammatische Struktur stimmt und der Sinn getroffen ist.
 *               Rechtschreibung von Vokabeln zaehlt nicht.
 *
 * Ablauf wie immer: Lehrkraft schaltet frei, eine Abgabe pro Name,
 * Loesungen verlassen den Server nie vor der Abgabe.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

/* ------------------------------------------------------------------
   Notenschluessel
   GRADE_SCALE    9R (50 % = Note 3) - Standard, wenn ein Test nichts angibt
   GRADE_SCALE_M  M-Zug (50 % = Note 4) - wie der M-Zug-Vokabeltest
   ------------------------------------------------------------------ */
const GRADE_SCALE = [
  { grade: 1, min: 87 },
  { grade: 2, min: 73 },
  { grade: 3, min: 50 },
  { grade: 4, min: 37 },
  { grade: 5, min: 20 },
  { grade: 6, min: 0 }
];

const GRADE_SCALE_M = [
  { grade: 1, min: 92 },
  { grade: 2, min: 81 },
  { grade: 3, min: 67 },
  { grade: 4, min: 50 },
  { grade: 5, min: 30 },
  { grade: 6, min: 0 }
];

const GRADE_SCALES = { "9R": GRADE_SCALE, "M": GRADE_SCALE_M };

function gradeFromPercent(percent, scaleName) {
  const p = Number(percent) || 0;
  const scale = GRADE_SCALES[scaleName] || GRADE_SCALE;
  for (const step of scale) {
    if (p >= step.min) return step.grade;
  }
  return 6;
}

const clean = (v) => String(v || "").trim();

/* ------------------------------------------------------------------
   Antwortvergleich
   Kurz- und Langformen sind gleichwertig: "didn't" = "did not",
   "I'll" = "I will", "won't" = "will not". Gross-/Kleinschreibung und
   Satzzeichen sind egal.
   ------------------------------------------------------------------ */
function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[’‘´`]/g, "'")
    .replace(/\bwon't\b/g, "will not")
    .replace(/\bcan't\b/g, "can not")
    .replace(/\bcannot\b/g, "can not")
    .replace(/n't\b/g, " not")
    .replace(/'ll\b/g, " will")
    .replace(/'m\b/g, " am")
    .replace(/'re\b/g, " are")
    .replace(/\b(he|she|it|that|there|what|who|where)'s\b/g, "$1 is")
    .replace(/[.,;:!?"()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Luecke gegen alle zugelassenen Loesungen pruefen. */
function checkGap(given, solutions) {
  const g = normalize(given);
  if (!g) return false;
  return (solutions || []).some((s) => normalize(s) === g);
}

/** Notfall-Bewertung eines Satzes ohne KI: alle Pflichtteile enthalten? */
function keywordScore(given, item) {
  const max = Number(item.points) || 2;
  const text = normalize(given);
  if (text.length < 4) {
    return { points: 0, comment: "Keine Antwort abgegeben.", source: "leer" };
  }
  const parts = item.keywords || [];
  if (!parts.length) {
    return { points: 0, comment: "Bitte von der Lehrkraft ansehen lassen.", needsReview: true, source: "keywords" };
  }
  // Jeder Pflichtteil darf Alternativen haben: "will stay|will be staying"
  const hits = parts.filter((p) =>
    String(p).split("|").some((alt) => text.includes(normalize(alt)))
  ).length;
  let points = 0;
  if (hits === parts.length) points = max;
  else if (hits > 0) points = Math.max(1, Math.round(max / 2));
  return {
    points,
    comment: points === max ? "Die wichtigen Formen stimmen." : "Teilweise richtig.",
    needsReview: true,
    source: "keywords"
  };
}

/* ------------------------------------------------------------------
   KI-Regeln (gemeinsam fuer Luecken und Saetze)
   ------------------------------------------------------------------ */
const KI_REGELN = [
  "Du korrigierst eine Englisch-Grammatikarbeit einer 9. Klasse an einer",
  "bayerischen Mittelschule. Themen: simple past, will-future, if-clauses Typ I,",
  "present progressive.",
  "",
  "Es geht um die GRAMMATIK. Pruefe, ob die geforderte Zeitform richtig gebildet ist:",
  "- simple past: -ed bzw. richtige unregelmaessige Form, didn't + Grundform, was/were",
  "- will-future: will/won't + Grundform",
  "- if-clause I: simple present im if-Satz, will/can/Befehlsform im Hauptsatz",
  "- present progressive: am/is/are + Verb-ing, richtige -ing-Schreibweise",
  "",
  "Kurzformen und Langformen sind gleichwertig (didn't = did not, I'll = I will).",
  "Gross- und Kleinschreibung sowie Satzzeichen sind egal.",
  "Rechtschreibfehler bei Vokabeln, die mit der Grammatik nichts zu tun haben, sind egal.",
  "Fehler in der grammatischen Form selbst sind Fehler (z. B. 'goed', 'didn't went',",
  "'swiming', 'If it will rain', fehlendes am/is/are, falsche Zeitform).",
  "Die Schueler sind 14 bis 15 Jahre alt. Bewerte fair und im Zweifel wohlwollend."
].join("\n");

/**
 * KI-Zweitmeinung fuer abgelehnte Luecken (Sammelaufruf).
 * Rueckgabe: { "<nr>-<gap>": { correct: true, reason } } - nur Aufwertungen.
 */
async function aiReviewGaps(pending, askAnthropic) {
  if (!pending.length || typeof askAnthropic !== "function") return {};

  const system = [
    KI_REGELN,
    "",
    "Du bekommst Luecken, die der exakte Vergleich abgelehnt hat. Entscheide je Luecke,",
    "ob die Antwort trotzdem grammatisch richtig ist und in den Satz passt",
    "(z. B. eine andere, ebenfalls korrekte Form).",
    "",
    "Antworte NUR mit JSON in genau dieser Form, ohne weiteren Text:",
    '{"results": [{"id": "<id>", "correct": true|false, "reason": "<max. 8 Woerter>"}]}'
  ].join("\n");

  const user = pending.map((p) => [
    "id: " + p.id,
    "Satz: " + p.prompt,
    "Luecke Nr. " + p.gap + ", zugelassene Loesungen: " + p.solutions.join(" / "),
    "Antwort: " + p.given
  ].join("\n")).join("\n\n");

  try {
    const raw = await askAnthropic(system, user, 900);
    const match = String(raw || "").match(/\{[\s\S]*\}/);
    if (!match) return {};
    const parsed = JSON.parse(match[0]);
    const out = {};
    for (const r of (Array.isArray(parsed.results) ? parsed.results : [])) {
      if (r && r.correct === true && r.id) {
        out[String(r.id)] = { correct: true, reason: clean(r.reason).slice(0, 120) };
      }
    }
    return out;
  } catch (_e) {
    return {};
  }
}

/** KI-Bewertung eines ganzen Satzes. Faellt bei Problemen auf keywordScore zurueck. */
async function aiScoreText(given, item, askAnthropic) {
  const max = Number(item.points) || 2;
  const text = clean(given);
  if (text.length < 4) return { points: 0, comment: "Keine Antwort abgegeben.", source: "leer" };
  if (typeof askAnthropic !== "function") return keywordScore(given, item);

  const system = [
    KI_REGELN,
    "",
    `Vergib ganze Punkte von 0 bis ${max}:`,
    `- ${max} Punkte: Grammatik der geforderten Struktur stimmt und der Sinn ist getroffen.`,
    "- 1 Punkt: Struktur im Kern richtig, aber ein Fehler in der Form oder ein Satzteil fehlt.",
    "- 0 Punkte: falsche Zeitform, Struktur fehlt oder Satz passt nicht zur Aufgabe.",
    "Andere Woerter mit gleicher Bedeutung sind erlaubt.",
    "",
    "Antworte NUR mit JSON in genau dieser Form, ohne weiteren Text:",
    '{"points": <Zahl>, "comment": "<kurze Rueckmeldung auf Deutsch, maximal 15 Woerter>"}'
  ].join("\n");

  const user = [
    "Aufgabe:", item.prompt,
    "",
    "Gepruefte Grammatik: " + (item.focus || "(siehe Aufgabe)"),
    "Musterloesung der Lehrkraft: " + (item.expected || "(keine hinterlegt)"),
    "",
    "Antwort der Schuelerin / des Schuelers:", text
  ].join("\n");

  try {
    const raw = await askAnthropic(system, user, 300);
    const match = String(raw || "").match(/\{[\s\S]*\}/);
    if (!match) return keywordScore(given, item);
    const parsed = JSON.parse(match[0]);
    let points = Number(parsed.points);
    if (!Number.isFinite(points)) return keywordScore(given, item);
    points = Math.max(0, Math.min(max, Math.round(points)));
    return { points, comment: clean(parsed.comment).slice(0, 200) || "Bewertet.", source: "ki" };
  } catch (_e) {
    return keywordScore(given, item);
  }
}

/* ------------------------------------------------------------------
   Datenhaltung
   ------------------------------------------------------------------ */
function createStore(dataDir) {
  const UNLOCK_FILE = path.join(dataDir, "grammatik9r.json");
  const SUBMISSIONS_FILE = path.join(dataDir, "grammatik9r_abgaben.json");

  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(UNLOCK_FILE)) {
    fs.writeFileSync(UNLOCK_FILE, JSON.stringify({ unlocked: {} }, null, 2), "utf8");
  }
  if (!fs.existsSync(SUBMISSIONS_FILE)) {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify({ submissions: [] }, null, 2), "utf8");
  }

  const load = (file, fallback) => {
    try { return JSON.parse(fs.readFileSync(file, "utf8")); }
    catch (_e) { return fallback; }
  };
  const save = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");

  return {
    loadUnlocks: () => load(UNLOCK_FILE, { unlocked: {} }),
    saveUnlocks: (d) => save(UNLOCK_FILE, d),
    loadSubmissions: () => load(SUBMISSIONS_FILE, { submissions: [] }),
    saveSubmissions: (d) => save(SUBMISSIONS_FILE, d)
  };
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
  if (raw.includes(".")) truncated = raw.split(".").slice(0, 3).join(".") + ".0";
  else if (raw.includes(":")) truncated = raw.split(":").slice(0, 4).join(":");
  else truncated = "unknown";
  return crypto.createHmac("sha256", secret).update(truncated).digest("hex").slice(0, 16);
}

const gapCount = (item) => (String(item.prompt).match(/___/g) || []).length;

function itemPoints(item) {
  if (item.type === "gap") return gapCount(item);
  return Number(item.points) || 1;
}

const maxPoints = (test) => test.items.reduce((sum, it) => sum + itemPoints(it), 0);

/** Musterloesung zum Anzeigen: Luecken mit der ersten Loesung gefuellt. */
function gapExpected(item) {
  let k = 0;
  return String(item.prompt).replace(/___/g, () => {
    const sol = (item.solutions[k++] || [])[0] || "";
    return "[" + sol + "]";
  });
}

/* ------------------------------------------------------------------
   Routen
   ------------------------------------------------------------------ */
function registerGrammatik9rRoutes(app, opts) {
  const store = createStore(opts.dataDir);
  const TESTS = opts.tests || {};
  const TEACHER_PASSWORD = opts.teacherPassword;
  const HASH_SECRET = opts.hashSecret || "grumi-fallback-secret";
  const askAnthropic = opts.askAnthropic;

  const isTeacher = (req) => clean(req.body?.password) === TEACHER_PASSWORD;

  /* ---------- Oeffentlich: Liste (OHNE Loesungen) ---------- */
  app.get("/api/grammatik9r/list", (_req, res) => {
    const unlocks = store.loadUnlocks();
    res.json({
      ok: true,
      tests: Object.values(TESTS).map((t) => ({
        id: t.id,
        title: t.title,
        kind: t.kind,
        unit: t.unit,
        classLevel: t.classLevel,
        itemCount: t.items.length,
        maxPoints: maxPoints(t),
        unlocked: Boolean(unlocks.unlocked[t.id]?.open)
      }))
    });
  });

  /* ---------- Schueler: starten ---------- */
  app.post("/api/grammatik9r/start", (req, res) => {
    const testId = clean(req.body?.testId);
    const firstName = clean(req.body?.firstName);
    const lastName = clean(req.body?.lastName);
    const className = clean(req.body?.className);

    const test = TESTS[testId];
    if (!test) return res.status(404).json({ ok: false, error: "test_not_found" });
    if (!store.loadUnlocks().unlocked[testId]?.open) {
      return res.status(403).json({ ok: false, error: "locked", message: "Dieser Test ist noch nicht freigeschaltet." });
    }
    if (!firstName || !lastName || !className) {
      return res.status(400).json({ ok: false, error: "missing_fields", message: "Vorname, Nachname und Klasse sind erforderlich." });
    }

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

    res.json({
      ok: true,
      test: { id: test.id, title: test.title, kind: test.kind, unit: test.unit, maxPoints: maxPoints(test) },
      items: test.items.map((it, idx) => ({
        nr: idx + 1,
        type: it.type,
        section: it.section || "",
        instruction: it.instruction || "",
        prompt: it.prompt,
        options: it.type === "choice" ? it.options : undefined,
        gaps: it.type === "gap" ? gapCount(it) : undefined,
        points: itemPoints(it)
      }))
    });
  });

  /* ---------- Schueler: Abgabe ---------- */
  app.post("/api/grammatik9r/submit", async (req, res) => {
    const testId = clean(req.body?.testId);
    const firstName = clean(req.body?.firstName);
    const lastName = clean(req.body?.lastName);
    const className = clean(req.body?.className);
    const testDate = clean(req.body?.testDate);
    const answers = Array.isArray(req.body?.answers) ? req.body.answers : [];

    const test = TESTS[testId];
    if (!test) return res.status(404).json({ ok: false, error: "test_not_found" });
    if (!store.loadUnlocks().unlocked[testId]?.open) {
      return res.status(403).json({ ok: false, error: "locked", message: "Dieser Test ist nicht freigeschaltet." });
    }
    if (!firstName || !lastName || !className) {
      return res.status(400).json({ ok: false, error: "missing_fields" });
    }

    const key = studentKey(firstName, lastName, className);
    const db = store.loadSubmissions();
    const existing = db.submissions.find((s) => s.testId === testId && s.studentKey === key);
    if (existing) {
      return res.status(409).json({
        ok: false, error: "already_submitted",
        message: "Dieser Test wurde bereits abgegeben.",
        submittedAt: existing.submittedAt
      });
    }

    /* ---- 1. Luecken und Auswahl exakt auswerten ---- */
    const details = [];
    const pendingGaps = [];

    test.items.forEach((item, idx) => {
      const nr = idx + 1;
      const raw = answers[idx];

      if (item.type === "choice") {
        const picked = Number.isInteger(raw) ? raw : parseInt(raw, 10);
        const correct = picked === item.answer;
        details.push({
          nr, type: "choice", prompt: item.prompt,
          given: Number.isInteger(picked) && item.options[picked] !== undefined ? item.options[picked] : "",
          correct, points: correct ? 1 : 0, maxPoints: 1,
          expected: item.options[item.answer]
        });
        return;
      }

      if (item.type === "gap") {
        const n = gapCount(item);
        const given = Array.isArray(raw) ? raw.map(clean) : [clean(raw)];
        const gapOk = [];
        for (let g = 0; g < n; g++) {
          const ok = checkGap(given[g], item.solutions[g]);
          gapOk.push(ok);
          if (!ok && given[g]) {
            pendingGaps.push({
              id: nr + "-" + g, detailIdx: details.length, gap: g + 1,
              prompt: item.prompt, given: given[g], solutions: item.solutions[g]
            });
          }
        }
        details.push({
          nr, type: "gap", prompt: item.prompt,
          given: given.slice(0, n).join(" | "),
          gapOk, aiGaps: [],
          points: gapOk.filter(Boolean).length, maxPoints: n,
          expected: gapExpected(item)
        });
        return;
      }

      details.push({ nr, type: "text", prompt: item.prompt, given: clean(raw), item });
    });

    /* ---- 2. KI-Zweitmeinung fuer abgelehnte Luecken (nur Aufwertung) ---- */
    let aiUsed = false;
    if (pendingGaps.length) {
      const verdicts = await aiReviewGaps(pendingGaps, askAnthropic);
      for (const p of pendingGaps) {
        const v = verdicts[p.id];
        if (!v) continue;
        const d = details[p.detailIdx];
        if (!d.gapOk[p.gap - 1]) {
          d.gapOk[p.gap - 1] = true;
          d.aiGaps.push(p.gap);
          d.points += 1;
          d.comment = "Von der KI als richtig anerkannt" + (v.reason ? ": " + v.reason : ".");
          aiUsed = true;
        }
      }
    }

    /* ---- 3. Saetze von der KI bewerten ---- */
    let needsReview = false;
    for (const d of details) {
      if (d.type !== "text") continue;
      const item = d.item;
      const max = Number(item.points) || 2;
      const scored = await aiScoreText(d.given, item, askAnthropic);
      if (scored.source === "ki") aiUsed = true;
      if (scored.needsReview) needsReview = true;
      delete d.item;
      Object.assign(d, {
        points: scored.points, maxPoints: max,
        comment: scored.comment || "", scoredBy: scored.source,
        expected: item.expected || ""
      });
    }
    details.forEach((d) => { d.correct = d.points >= d.maxPoints; });

    const total = maxPoints(test);
    const score = details.reduce((sum, d) => sum + d.points, 0);
    const percent = total ? Math.round((score / total) * 100) : 0;
    const grade = gradeFromPercent(percent, test.gradeScale);

    const record = {
      id: `g9r_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
      testId, testTitle: test.title, unit: test.unit,
      firstName, lastName, className, studentKey: key,
      testDate: testDate || new Date().toISOString().slice(0, 10),
      score, total, percent, grade, aiUsed, needsReview,
      gradeScale: test.gradeScale || "9R",
      details,
      deviceHash: deviceHash(req, HASH_SECRET),
      submittedAt: new Date().toISOString()
    };
    db.submissions.push(record);
    store.saveSubmissions(db);

    res.json({
      ok: true,
      result: {
        score, total, percent, grade, needsReview,
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
  app.post("/api/grammatik9r/unlock", (req, res) => {
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
  app.post("/api/grammatik9r/results", (req, res) => {
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

  /* ---------- Lehrkraft: Punkte einer Aufgabe aendern ---------- */
  app.post("/api/grammatik9r/override", (req, res) => {
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
    rec.grade = gradeFromPercent(rec.percent, rec.gradeScale || TESTS[rec.testId]?.gradeScale);
    rec.needsReview = rec.details.some((d) => d.scoredBy === "keywords");
    store.saveSubmissions(db);
    res.json({ ok: true, score: rec.score, percent: rec.percent, grade: rec.grade });
  });

  /* ---------- Lehrkraft: Abgabe loeschen (Nachschreiben) ---------- */
  app.post("/api/grammatik9r/delete-submission", (req, res) => {
    if (!isTeacher(req)) return res.status(401).json({ ok: false, error: "bad_password" });
    const id = clean(req.body?.submissionId);
    const db = store.loadSubmissions();
    const before = db.submissions.length;
    db.submissions = db.submissions.filter((s) => s.id !== id);
    if (db.submissions.length === before) return res.status(404).json({ ok: false, error: "not_found" });
    store.saveSubmissions(db);
    res.json({ ok: true, removed: before - db.submissions.length });
  });

  /* ---------- Lehrkraft: Export als CSV ---------- */
  app.post("/api/grammatik9r/export", (req, res) => {
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
    res.setHeader("Content-Disposition", `attachment; filename="grammatik9r_${testId || "alle"}.csv"`);
    res.send("﻿" + lines.join("\r\n"));
  });
}

module.exports = {
  registerGrammatik9rRoutes,
  gradeFromPercent,
  normalize,
  checkGap,
  keywordScore,
  maxPoints,
  GRADE_SCALE,
  GRADE_SCALE_M
};
