"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest";
const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD || "2";
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT || "";
const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY || "";
const AZURE_OPENAI_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT || "";
const AZURE_OPENAI_API_VERSION = process.env.AZURE_OPENAI_API_VERSION || "2024-10-21";
const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY || process.env.SPEECH_KEY || "";
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION || process.env.SPEECH_REGION || "";
const AZURE_SPEECH_VOICE = process.env.AZURE_SPEECH_VOICE || "en-US-JennyNeural";

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const STATIC_ROOT = resolveStaticRoot();
const DATA_DIR = path.join(__dirname, "..", "data");
const STUDENTS_FILE = path.join(DATA_DIR, "students.json");
const PROGRESS_FILE = path.join(DATA_DIR, "progress.json");

ensureDataFiles();

app.use(express.static(STATIC_ROOT));

app.get("/", (_req, res) => {
  const indexAtRoot = path.join(STATIC_ROOT, "index.html");
  if (fs.existsSync(indexAtRoot)) return res.sendFile(indexAtRoot);
  return res.send("Englisch 9 hint server laeuft. OK");
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "englisch_9",
    time: new Date().toISOString(),
    staticRoot: STATIC_ROOT,
    ai: {
      keyConfigured: Boolean(ANTHROPIC_API_KEY),
      model: ANTHROPIC_MODEL,
      azureOpenAiConfigured: Boolean(AZURE_OPENAI_ENDPOINT && AZURE_OPENAI_API_KEY && AZURE_OPENAI_DEPLOYMENT),
      azureSpeechConfigured: Boolean(AZURE_SPEECH_KEY && AZURE_SPEECH_REGION)
    }
  });
});

const sessions = new Map();

app.post("/api/auth/login", (req, res) => {
  const firstName = clean(req.body?.firstName);
  const lastName = clean(req.body?.lastName);
  const className = clean(req.body?.className);
  const password = clean(req.body?.password);

  if (!firstName || !lastName || !className) {
    return res.status(400).json({ error: "Vorname, Name und Klasse sind erforderlich." });
  }
  if (password !== TEACHER_PASSWORD) {
    return res.status(401).json({ error: "Passwort ist falsch." });
  }

  const db = loadStudents();
  const normKey = normalizeKey(firstName, lastName, className);
  let student = db.students.find((s) => s.normKey === normKey);
  const now = new Date().toISOString();

  if (!student) {
    student = {
      id: uid("stu"),
      firstName,
      lastName,
      className,
      normKey,
      createdAt: now,
      lastLoginAt: now
    };
    db.students.push(student);
  } else {
    student.lastLoginAt = now;
  }

  saveStudents(db);

  const token = uid("tok");
  sessions.set(token, { studentId: student.id, createdAt: now });

  return res.json({
    ok: true,
    token,
    student: {
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      className: student.className,
      displayName: `${student.firstName} ${student.lastName}`
    }
  });
});

app.post("/api/auth/logout", authRequired, (req, res) => {
  const token = getAuthToken(req);
  if (token) sessions.delete(token);
  return res.json({ ok: true });
});

app.get("/api/auth/me", authRequired, (req, res) => {
  return res.json({ ok: true, student: req.student });
});

app.post("/api/progress/record", authRequired, (req, res) => {
  const payload = req.body || {};
  const exerciseId = clean(payload.exerciseId);
  if (!exerciseId) {
    return res.status(400).json({ error: "exerciseId fehlt." });
  }

  const rec = {
    id: uid("prg"),
    studentId: req.student.id,
    exerciseId,
    exerciseName: clean(payload.exerciseName) || exerciseId,
    unit: clean(payload.unit) || "",
    category: clean(payload.category) || "",
    percent: clampPercent(payload.percent),
    score: numberOr(payload.score, null),
    total: numberOr(payload.total, null),
    completed: Boolean(payload.completed),
    durationSec: numberOr(payload.durationSec, null),
    meta: safeMeta(payload.meta),
    createdAt: new Date().toISOString()
  };

  const db = loadProgress();
  db.records.push(rec);
  saveProgress(db);

  return res.json({ ok: true, record: rec });
});

app.get("/api/progress/me", authRequired, (req, res) => {
  const db = loadProgress();
  const records = db.records.filter((r) => r.studentId === req.student.id);
  return res.json({ ok: true, records });
});

app.get("/api/progress/overview", authRequired, (req, res) => {
  const db = loadProgress();
  const records = db.records.filter((r) => r.studentId === req.student.id);
  return res.json({ ok: true, overview: buildStudentOverview(records), recordsCount: records.length });
});

app.post("/api/teacher/overview", (req, res) => {
  const password = clean(req.body?.password);
  if (password !== TEACHER_PASSWORD) {
    return res.status(401).json({ error: "Passwort ist falsch." });
  }

  const students = loadStudents().students;
  const allRecords = loadProgress().records;

  const byStudent = students.map((s) => {
    const records = allRecords.filter((r) => r.studentId === s.id);
    const ov = buildStudentOverview(records);
    return {
      student: {
        id: s.id,
        firstName: s.firstName,
        lastName: s.lastName,
        className: s.className
      },
      summary: {
        exercisesDone: ov.length,
        avgPercent: average(ov.map((x) => x.bestPercent)),
        completedExercises: ov.filter((x) => x.completed).length
      },
      exercises: ov
    };
  });

  return res.json({ ok: true, students: byStudent });
});

const VOCAB_LIBRARY = {
  unit3: {
    role_model: [
      { en: "honest", de: "ehrlich" },
      { en: "reliable", de: "zuverlaessig" },
      { en: "helpful", de: "hilfsbereit" },
      { en: "kind", de: "freundlich" },
      { en: "strong", de: "stark" },
      { en: "determined", de: "entschlossen" },
      { en: "considerate", de: "ruecksichtsvoll" },
      { en: "I admire ... because ...", de: "Ich bewundere ... weil ..." }
    ],
    accident: [
      { en: "witness", de: "Zeuge" },
      { en: "accident", de: "Unfall" },
      { en: "ambulance", de: "Krankenwagen" },
      { en: "I arrived at ...", de: "Ich kam um ... an." },
      { en: "before", de: "vor" },
      { en: "after", de: "nach" },
      { en: "at the time", de: "zu der Zeit" },
      { en: "Can you explain in more detail?", de: "Kannst du genauer erklaeren?" }
    ]
  },
  unit4: {
    intro: [
      { en: "careers", de: "Berufe" },
      { en: "advisor", de: "Berater; Beraterin" },
      { en: "volunteer", de: "Freiwilliger; Freiwillige" },
      { en: "emergency service", de: "Notdienst; Rettungsdienst" },
      { en: "health", de: "Gesundheit" },
      { en: "member", de: "Mitglied" },
      { en: "club", de: "Verein" },
      { en: "Maori", de: "Maori" }
    ],
    topic1: [
      { en: "suitability", de: "Eignung; Tauglichkeit" },
      { en: "to complete", de: "ausfuellen; machen" },
      { en: "result", de: "Ergebnis" },
      { en: "mechanic", de: "Mechaniker; Mechanikerin" },
      { en: "compromise", de: "Kompromiss" },
      { en: "conflict", de: "Konflikt; Auseinandersetzung" },
      { en: "support", de: "Unterstuetzung; Hilfe" },
      { en: "to take an exam", de: "eine Pruefung schreiben" }
    ],
    topic2: [
      { en: "retail", de: "Einzelhandel" },
      { en: "option", de: "Moeglichkeit; Option; Wahl" },
      { en: "shop assistant", de: "Verkaeufer; Verkaeuferin" },
      { en: "apprenticeship", de: "Ausbildung; Lehre" },
      { en: "supplier", de: "Zulieferer; Anbieter" },
      { en: "warehouse", de: "Lager; Lagerhalle" },
      { en: "to donate", de: "spenden; stiften" },
      { en: "to reduce", de: "reduzieren; verringern" }
    ],
    text: [
      { en: "chief", de: "Haeuptling" },
      { en: "to found", de: "gruenden" },
      { en: "although", de: "obwohl" },
      { en: "to feel sorry for", de: "Mitleid haben mit" },
      { en: "stingray", de: "Stachelrochen" },
      { en: "dolphin", de: "Delfin" },
      { en: "to point", de: "zeigen" },
      { en: "bottom", de: "Grund; Boden" }
    ],
    writing: [
      { en: "full-time", de: "Vollzeit" },
      { en: "excellent", de: "hervorragend; exzellent" },
      { en: "enquiry", de: "Anfrage" },
      { en: "qualified", de: "qualifiziert" },
      { en: "enclosed", de: "beigefuegt; anbei" },
      { en: "RE", de: "Betr." },
      { en: "certificate", de: "Zertifikat; Bescheinigung" },
      { en: "employer", de: "Arbeitgeber; Arbeitgeberin" }
    ]
  }
};

app.get("/api/vocab/options", authRequired, (_req, res) => {
  const units = Object.entries(VOCAB_LIBRARY).map(([unitKey, sections]) => ({
    unit: unitKey,
    sections: Object.entries(sections).map(([sectionKey, words]) => ({ section: sectionKey, count: words.length }))
  }));
  return res.json({ ok: true, units });
});

app.post("/api/vocab/generate", authRequired, (req, res) => {
  const unit = clean(req.body?.unit || "unit4").toLowerCase();
  const section = clean(req.body?.section || "all").toLowerCase();
  const direction = clean(req.body?.direction || "mixed").toLowerCase();
  const limit = Math.min(Math.max(Number(req.body?.limit || 20), 5), 120);

  const unitData = VOCAB_LIBRARY[unit];
  if (!unitData) return res.status(400).json({ error: "Unit nicht gefunden." });

  let pool = [];
  if (section === "all") Object.values(unitData).forEach((arr) => { pool = pool.concat(arr); });
  else pool = unitData[section] || [];

  if (!pool.length) return res.status(400).json({ error: "Kein Vokabelbereich gefunden." });

  const shuffled = shuffle(pool).slice(0, Math.min(limit, pool.length));
  const cards = shuffled.map((v) => {
    const dir = direction === "mixed" ? (Math.random() < 0.5 ? "en-de" : "de-en") : direction;
    const prompt = dir === "en-de" ? v.en : v.de;
    const solution = dir === "en-de" ? v.de : v.en;
    const answers = String(solution).split(/[;,]/).map((x) => x.trim()).filter(Boolean);

    return { id: uid("voc"), unit, section, direction: dir, prompt, answers, solution };
  });

  return res.json({ ok: true, cards, timerSec: 5 });
});

app.post("/api/vocab/example", async (req, res) => {
  try {
    const word = clean(req.body?.word);
    const meaning = clean(req.body?.meaning || "");
    const topic = clean(req.body?.topic || "topic2").toLowerCase();
    const level = clean(req.body?.level || "A2+");
    const providerRaw = clean(req.body?.provider || "anthropic").toLowerCase();
    const provider = providerRaw === "azure" ? "azure" : "anthropic";
    const sentenceModeRaw = clean(req.body?.sentenceMode || "mixed").toLowerCase();
    const allowedModes = new Set(["mixed", "daily", "definition", "paraphrase"]);
    const sentenceMode = allowedModes.has(sentenceModeRaw) ? sentenceModeRaw : "mixed";
    const modeForPrompt = sentenceMode === "mixed" ? ["daily", "definition", "paraphrase"][Math.floor(Math.random() * 3)] : sentenceMode;
    const variationSeed = String(req.body?.variationSeed || Date.now());
    const previousSentences = Array.isArray(req.body?.previousSentences)
      ? req.body.previousSentences.map((s) => String(s || "").trim()).filter(Boolean).slice(-8)
      : [];
    if (!word) return res.status(400).json({ error: "word fehlt." });

    let sentence = "";
    let source = "fallback";

    const system = [
      "You are an English teacher assistant for German grade 9 students.",
      "Write exactly one short and natural English example sentence.",
      "Use level as requested (A2, A2+, or B1).",
      "Keep it simple and school-friendly. Max 16 words.",
      "Use the given word exactly once.",
      "The sentence must match the real meaning of the word.",
      "Vary the wording each time.",
      "Do not repeat any previous sentence from the provided list.",
      "No list, no explanation, sentence only."
    ].join("\n");
    const userPrompt = `Word: ${word}\nMeaning hint (German): ${meaning || "-"}\nTopic: ${topic}\nLevel: ${level}\nSentence mode: ${modeForPrompt}\nVariation: ${variationSeed}\nPrevious: ${previousSentences.join(" || ") || "-"}`;

    if (provider === "anthropic") {
      if (ANTHROPIC_API_KEY) {
        const raw = await askAnthropic(system, userPrompt, 110);
        sentence = normalizeEnglishSentence(raw);
        source = sentence ? "anthropic" : source;
      }
      if (!sentence && AZURE_OPENAI_ENDPOINT && AZURE_OPENAI_API_KEY && AZURE_OPENAI_DEPLOYMENT) {
        const aiRaw = await askAzureOpenAI(system, userPrompt, 120);
        sentence = normalizeEnglishSentence(aiRaw);
        source = sentence ? "azure-openai-fallback" : source;
      }
    } else {
      if (AZURE_OPENAI_ENDPOINT && AZURE_OPENAI_API_KEY && AZURE_OPENAI_DEPLOYMENT) {
        const aiRaw = await askAzureOpenAI(system, userPrompt, 120);
        sentence = normalizeEnglishSentence(aiRaw);
        source = sentence ? "azure-openai" : source;
      }
      if (!sentence && ANTHROPIC_API_KEY) {
        const raw = await askAnthropic(system, userPrompt, 110);
        sentence = normalizeEnglishSentence(raw);
        source = sentence ? "anthropic-fallback" : source;
      }
    }

    if (!sentence) {
      sentence = buildFallbackExampleSentence(word, topic, level, previousSentences, modeForPrompt, meaning);
      source = "fallback";
    }

    return res.json({ ok: true, sentence, source });
  } catch (error) {
    console.error("Fehler bei /api/vocab/example:", error.message);
    const word = clean(req.body?.word || "word");
    const meaning = clean(req.body?.meaning || "");
    const topic = clean(req.body?.topic || "topic2").toLowerCase();
    const level = clean(req.body?.level || "A2+");
    const sentenceModeRaw = clean(req.body?.sentenceMode || "mixed").toLowerCase();
    const allowedModes = new Set(["mixed", "daily", "definition", "paraphrase"]);
    const sentenceMode = allowedModes.has(sentenceModeRaw) ? sentenceModeRaw : "mixed";
    const modeForPrompt = sentenceMode === "mixed" ? ["daily", "definition", "paraphrase"][Math.floor(Math.random() * 3)] : sentenceMode;
    const previousSentences = Array.isArray(req.body?.previousSentences)
      ? req.body.previousSentences.map((s) => String(s || "").trim()).filter(Boolean).slice(-8)
      : [];
    return res.status(200).json({ ok: true, sentence: buildFallbackExampleSentence(word, topic, level, previousSentences, modeForPrompt, meaning), source: "fallback-error" });
  }
});

app.post("/api/speech/speak", async (req, res) => {
  try {
    const text = clean(req.body?.text);
    const voice = clean(req.body?.voice || AZURE_SPEECH_VOICE || "en-US-JennyNeural");
    if (!text) return res.status(400).json({ error: "text fehlt." });
    if (!AZURE_SPEECH_KEY || !AZURE_SPEECH_REGION) {
      return res.status(503).json({ error: "azure_speech_not_configured" });
    }

    const ssml = `<speak version='1.0' xml:lang='en-US'><voice name='${escapeXml(voice)}'>${escapeXml(text)}</voice></speak>`;
    const endpoint = `https://${AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": AZURE_SPEECH_KEY,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
        "User-Agent": "englisch_9"
      },
      body: ssml
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({ error: "azure_speech_error", detail: errText.slice(0, 300) });
    }

    const arr = await response.arrayBuffer();
    const buf = Buffer.from(arr);
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(buf);
  } catch (error) {
    console.error("Fehler bei /api/speech/speak:", error.message);
    return res.status(500).json({ error: "speech_failed" });
  }
});

const SYSTEM_PROMPT = `Du bist ein freundlicher Englischlehrer fuer eine 9. Klasse (Gymnasium, Bayern).

DEINE REGELN:
- Schreibe IMMER in vollstaendigen deutschen Saetzen (2-3 Saetze)
- Gib NIE die Loesung direkt an
- Erklaere WARUM die Grammatikregel so ist
- Benutze ermutigende Sprache
- Wenn der Schueler fast richtig liegt, sag das
- Maximal 60 Woerter`;

const ACCIDENT_PROMPT = `Du bist ein freundlicher Englischlehrer fuer eine 9. Klasse (Gymnasium, Bayern).
Thema: Talking about an accident - englische Dialogsituationen (Polizist / Zeuge).

REGELN:
- Schreibe auf Deutsch
- 2-4 Saetze
- Ermutigend und konkret
- Gib kurze Beispielsatz-Ideen auf Englisch
- Max. 80 Woerter`;

app.post("/api/hint", async (req, res) => {
  try {
    const studentAnswer = String(req.body?.studentAnswer ?? req.body?.userAnswer ?? "").trim();
    const correctAnswer = String(req.body?.correctAnswer ?? "").trim();
    const exerciseContext = String(req.body?.exerciseContext ?? req.body?.prompt ?? "").trim();
    const step = Number(req.body?.step || 1);

    if (!studentAnswer) return res.status(400).json({ error: "studentAnswer fehlt." });
    if (!ANTHROPIC_API_KEY || !correctAnswer) return res.json({ hint: buildStepHint(studentAnswer, step) });

    const userMessage = `Aufgabe/Kontext: "${exerciseContext}"
Schuelerantwort: "${studentAnswer}"
Richtige Antwort (nicht verraten!): "${correctAnswer}"
Gib einen hilfreichen Tipp auf Deutsch.`;

    const hint = await askAnthropic(SYSTEM_PROMPT, userMessage, 170);
    return res.json({ hint: hint || buildStepHint(studentAnswer, step) });
  } catch (error) {
    console.error("Fehler bei /api/hint:", error.message);
    return res.status(200).json({ hint: buildStepHint(String(req.body?.studentAnswer || req.body?.userAnswer || ""), Number(req.body?.step || 1)) });
  }
});

app.post("/api/hint-accident", async (req, res) => {
  try {
    const studentAnswer = String(req.body?.studentAnswer ?? req.body?.userAnswer ?? "").trim();
    const correctAnswer = String(req.body?.correctAnswer ?? "").trim();
    const exerciseContext = String(req.body?.exerciseContext ?? req.body?.prompt ?? "").trim();
    const step = Number(req.body?.step || 1);

    if (!studentAnswer) return res.status(400).json({ error: "studentAnswer fehlt." });
    if (!ANTHROPIC_API_KEY || !correctAnswer) return res.json({ hint: buildStepHint(studentAnswer, step) });

    const userMessage = `Aufgabe/Kontext: "${exerciseContext}"
Schuelerantwort: "${studentAnswer}"
Richtige Antwort (nicht verraten!): "${correctAnswer}"
Gib einen hilfreichen Tipp auf Deutsch.`;

    const hint = await askAnthropic(ACCIDENT_PROMPT, userMessage, 190);
    return res.json({ hint: hint || buildStepHint(studentAnswer, step) });
  } catch (error) {
    console.error("Fehler bei /api/hint-accident:", error.message);
    return res.status(200).json({ hint: buildStepHint(String(req.body?.studentAnswer || req.body?.userAnswer || ""), Number(req.body?.step || 1)) });
  }
});

app.post("/api/korrektur", async (req, res) => {
  try {
    const studentAnswer = String(req.body?.studentAnswer ?? req.body?.userAnswer ?? "").trim();
    if (studentAnswer.length < 3) return res.status(400).json({ error: "Text zu kurz." });

    if (!ANTHROPIC_API_KEY) {
      const suggestion = localGermanGrammarFix(studentAnswer);
      return res.json({ suggestion, corrected: suggestion, changes: "Lokale Korrektur ohne KI." });
    }

    const system = `Du bist ein Englischlehrer. Korrigiere den Text eines Schuelers (9. Klasse, Thema: Unfallbericht).
Antworte nur als JSON: {"corrected":"...","changes":"..."}`;
    const raw = await askAnthropic(system, studentAnswer, 420);

    let corrected = studentAnswer;
    let changes = "Korrektur durchgefuehrt.";

    if (raw) {
      try {
        const clean = raw.replace(/```json\s*/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(clean);
        corrected = String(parsed.corrected || studentAnswer);
        changes = String(parsed.changes || changes);
      } catch (_e) {
        corrected = localGermanGrammarFix(studentAnswer);
        changes = raw;
      }
    }

    return res.json({ suggestion: corrected, corrected, changes });
  } catch (error) {
    console.error("Fehler bei /api/korrektur:", error.message);
    const studentAnswer = String(req.body?.studentAnswer ?? req.body?.userAnswer ?? "").trim();
    const suggestion = localGermanGrammarFix(studentAnswer);
    return res.status(200).json({ suggestion, corrected: suggestion, changes: "Fallback wegen Serverfehler." });
  }
});

app.post("/api/conversation", async (req, res) => {
  try {
    const studentMessage = String(req.body?.studentMessage ?? req.body?.message ?? "").trim();
    if (studentMessage.length < 2) return res.status(400).json({ error: "studentMessage fehlt." });

    if (!ANTHROPIC_API_KEY) {
      return res.json({
        reply: "Great start. Tell me one more detail about what you saw.",
        correction: "",
        hint: "Nutze einen kurzen Satz mit Zeitangabe (z.B. at 5 pm).",
        score: 1
      });
    }

    const system = `Du bist ein freundlicher Ranger in einem Nationalpark.
Du sprichst mit einem Schueler (Englisch Niveau A2).
Antworte exakt als JSON mit Feldern: reply, correction, hint, score.`;

    const raw = await askAnthropic(system, studentMessage, 320);
    if (!raw) {
      return res.json({
        reply: "Good effort. Can you describe the scene in one more sentence?",
        correction: "",
        hint: "Achte auf einfache Saetze in der Vergangenheit.",
        score: 1
      });
    }

    try {
      const clean = raw.replace(/```json\s*/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(clean);
      return res.json({
        reply: String(parsed.reply || ""),
        correction: String(parsed.correction || ""),
        hint: String(parsed.hint || ""),
        score: Number(parsed.score === 0 ? 0 : 1)
      });
    } catch (_e) {
      return res.json({ reply: raw, correction: "", hint: "", score: 1 });
    }
  } catch (error) {
    console.error("Fehler bei /api/conversation:", error.message);
    return res.status(500).json({ error: "Serverfehler." });
  }
});

app.post("/api/mediation/hint", async (req, res) => {
  const userAnswer = String(req.body?.userAnswer ?? "").trim();
  const step = Number(req.body?.step || 1);
  if (!userAnswer) return res.json({ hint: "Bitte zuerst eine kurze Antwort eingeben." });
  return res.json({ hint: buildStepHint(userAnswer, step) });
});

app.post("/api/mediation/grammar", async (req, res) => {
  const userAnswer = String(req.body?.userAnswer ?? "").trim();
  return res.json({ suggestion: localGermanGrammarFix(userAnswer) });
});

app.post("/api/role-model/help", async (req, res) => {
  try {
    const userText = String(req.body?.userText ?? "").trim();
    if (userText.length < 5) return res.status(400).json({ hint: "Bitte schreibe zuerst einen kurzen Text." });

    if (!ANTHROPIC_API_KEY) {
      return res.json({ hint: "Fallback ohne KI-Key: Nutze mindestens 2 Eigenschaften und 1 because-Satz.", source: "fallback-no-key" });
    }

    const system = `Du bist ein freundlicher Englischlehrer fuer die 9. Klasse.
Gib kurzes Feedback zu einem Role-Model-Text.
- Antworte auf Deutsch in 2-3 Saetzen
- Keine komplette Musterloesung
- Nenne 1 Staerke und 1 naechsten Verbesserungsschritt`;

    const user = `Schuelertext:\n${userText}\n\nGib eine kurze KI-Hilfe.`;
    const hint = await askAnthropic(system, user, 190);

    return res.json({ hint: hint || "Guter Anfang. Ergaenze eine zweite Eigenschaft und einen klaren because-Satz.", source: "anthropic" });
  } catch (error) {
    console.error("Fehler bei /api/role-model/help:", error.message);
    return res.status(200).json({ hint: "KI gerade nicht erreichbar. Verbessere zuerst einen because-Satz.", source: "fallback-error" });
  }
});


app.post("/api/check-quality", async (req, res) => {
  try {
    const answer = String(req.body?.answer ?? req.body?.studentAnswer ?? "").trim();
    const task = String(req.body?.task ?? req.body?.context ?? "").trim();
    const minWords = Math.max(3, Number(req.body?.minWords || 6));
    const minSpelling = Math.max(70, Math.min(100, Number(req.body?.minSpelling || 90)));

    if (!answer) {
      return res.status(400).json({ error: "answer fehlt." });
    }

    const words = answer.split(/\s+/).filter(Boolean);
    const fallbackCorrect = words.length >= minWords && answer.length >= 20;

    if (!ANTHROPIC_API_KEY) {
      return res.json({
        ok: true,
        correct: fallbackCorrect,
        verdict: fallbackCorrect ? "Richtig" : "Noch nicht vollständig",
        reason: fallbackCorrect ? "Inhalt wirkt vollständig genug." : "Bitte noch etwas genauer und vollständiger antworten.",
        source: "fallback-no-key",
        spelling: fallbackCorrect ? 90 : 70
      });
    }

    const system = `Du bist Englischlehrer (9. Klasse).\nBewerte eine Schuelerantwort streng.\nAntworte NUR als JSON: {"correct":true|false,"reason":"...","spelling":0-100}.\nRegeln:\n- correct=true NUR wenn Inhalt/Aufgabe passt, Zeitform stimmt und Rechtschreibung mindestens bei minSpelling liegt.\n- Wenn Zeitform falsch ist (z.B. when ... come statt came), dann correct=false.\n- spelling ist deine geschaetzte Rechtschreib-Qualitaet in Prozent.`;

    const user = `Aufgabe: ${task || "Freie Antwort"}\nAntwort: ${answer}\nMindestwoerter: ${minWords}\nMindestrechtschreibung: ${minSpelling}%`;
    const raw = await askAnthropic(system, user, 180);

    let correct = fallbackCorrect;
    let spelling = fallbackCorrect ? 90 : 70;
    let reason = correct ? "Antwort wirkt gut und vollständig." : "Antwort ist noch nicht vollständig genug.";

    if (raw) {
      try {
        const clean = raw.replace(/```json\s*/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(clean);
        const parsedSpelling = Number(parsed.spelling);
        spelling = Number.isFinite(parsedSpelling) ? Math.max(0, Math.min(100, parsedSpelling)) : spelling;
        correct = Boolean(parsed.correct) && spelling >= minSpelling;
        reason = String(parsed.reason || reason);
      } catch (_e) {
        // fallback remains active
      }
    }

    return res.json({
      ok: true,
      correct,
      verdict: correct ? "Richtig" : "Noch nicht vollständig",
      spelling,
      reason,
      source: "anthropic"
    });
  } catch (error) {
    console.error("Fehler bei /api/check-quality:", error.message);
    const answer = String(req.body?.answer ?? req.body?.studentAnswer ?? "").trim();
    const words = answer.split(/\s+/).filter(Boolean);
    const correct = words.length >= 6 && answer.length >= 20;
    return res.status(200).json({
      ok: true,
      correct,
      verdict: correct ? "Richtig" : "Noch nicht vollständig",
      spelling: correct ? 90 : 70,
      reason: correct ? "Antwort wirkt gut und vollständig." : "Bitte noch etwas genauer und vollständiger antworten.",
      source: "fallback-error"
    });
  }
});
app.listen(PORT, () => {
  console.log(`Server laeuft auf Port ${PORT}`);
  console.log(`Static root: ${STATIC_ROOT}`);
});

async function askAnthropic(system, user, maxTokens) {
  const apiKey = ANTHROPIC_API_KEY;
  if (!apiKey) return "";

  const modelCandidates = uniqueModels([
    ANTHROPIC_MODEL,
    "claude-3-5-haiku-latest",
    "claude-3-5-sonnet-latest"
  ]);

  let lastError = null;

  for (const model of modelCandidates) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        temperature: 0.3,
        system,
        messages: [{ role: "user", content: user }]
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (!Array.isArray(data?.content)) return "";
      return data.content.filter((item) => item && item.type === "text").map((item) => item.text || "").join("\n").trim();
    }

    const raw = await response.text();
    const compact = raw.slice(0, 250);

    const maybeModelError = response.status === 400 || response.status === 404;
    const mentionsModel = /model/i.test(compact);
    if (maybeModelError && mentionsModel) {
      lastError = new Error(`Anthropic HTTP ${response.status} (${model}): ${compact}`);
      continue;
    }

    throw new Error(`Anthropic HTTP ${response.status} (${model}): ${compact}`);
  }

  throw lastError || new Error("Anthropic call failed on all model candidates.");
}

function uniqueModels(models) {
  const seen = new Set();
  const out = [];
  for (const m of models) {
    const v = String(m || "").trim();
    if (!v || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

async function askAzureOpenAI(system, user, maxTokens) {
  if (!AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_API_KEY || !AZURE_OPENAI_DEPLOYMENT) return "";
  const base = AZURE_OPENAI_ENDPOINT.replace(/\/+$/, "");
  const url = `${base}/openai/deployments/${AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${AZURE_OPENAI_API_VERSION}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": AZURE_OPENAI_API_KEY
    },
    body: JSON.stringify({
      temperature: 0.35,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ]
    })
  });
  if (!response.ok) {
    const raw = await response.text();
    throw new Error(`Azure OpenAI HTTP ${response.status}: ${raw.slice(0, 250)}`);
  }
  const data = await response.json();
  return String(data?.choices?.[0]?.message?.content || "").trim();
}

function normalizeEnglishSentence(raw) {
  let text = String(raw || "").replace(/["`]/g, "").replace(/\s+/g, " ").trim();
  if (!text) return "";
  text = text.split("\n")[0].trim();
  text = text.replace(/^\d+[\).\s-]*/, "").trim();
  if (!/[.!?]$/.test(text)) text += ".";
  if (text.length > 180) text = text.slice(0, 179).trim() + ".";
  return text;
}

function buildFallbackExampleSentence(word, topic, level, previousSentences, mode, meaning) {
  const cleanWord = String(word || "word").trim() || "word";
  const lower = cleanWord.toLowerCase();
  const levelKey = String(level || "A2+").toUpperCase();
  const modeKey = String(mode || "daily").toLowerCase();
  const meaningHint = String(meaning || "").trim();
  const previous = Array.isArray(previousSentences) ? new Set(previousSentences.map((s) => String(s || "").trim())) : new Set();

  const modeSentences = {
    daily: [
      `I used "${lower}" in a short conversation after school.`,
      `Today I heard "${lower}" in a normal daily situation.`,
      `My friend and I used "${lower}" while talking about our day.`
    ],
    definition: [
      `"${lower}" means ${meaningHint || "something important in this topic"}.`,
      `In simple words, "${lower}" is ${meaningHint || "a useful term for Unit 4"}.`,
      `A short definition: "${lower}" is ${meaningHint || "a key word in this lesson"}.`
    ],
    paraphrase: [
      `You can say "${lower}" when you want to describe ${meaningHint || "this idea"} in another way.`,
      `Another way to explain "${lower}" is to use easy words for ${meaningHint || "its meaning"}.`,
      `I can paraphrase "${lower}" by describing ${meaningHint || "it"} in simple English.`
    ]
  };

  if (modeSentences[modeKey]) {
    const filteredMode = modeSentences[modeKey].filter((s) => !previous.has(s));
    const useMode = filteredMode.length ? filteredMode : modeSentences[modeKey];
    return useMode[Math.floor(Math.random() * useMode.length)];
  }

  const byTopic = {
    writing: [
      `I used "${lower}" in my short application letter.`,
      `In writing class, I practiced "${lower}" today.`,
      `My teacher liked my sentence with "${lower}".`
    ],
    text: [
      `In the story, "${lower}" was an important word.`,
      `I understood the text better after learning "${lower}".`,
      `We found "${lower}" in the reading task today.`
    ],
    topic1: [
      `I can use "${lower}" when talking about jobs.`,
      `In careers class, we practiced "${lower}" together.`,
      `My partner used "${lower}" in a good sentence.`
    ],
    topic2: [
      `At work, "${lower}" is useful in daily tasks.`,
      `In the shop role-play, I used "${lower}" correctly.`,
      `We needed "${lower}" in our business exercise.`
    ],
    intro: [
      `Today we learned "${lower}" in Unit 4.`,
      `Our class practiced "${lower}" with simple examples.`,
      `I can remember "${lower}" from today's lesson.`
    ],
    more: [
      `I used "${lower}" while talking about New Zealand.`,
      `In our project, "${lower}" was a helpful word.`,
      `We built a short dialogue with "${lower}".`
    ]
  };
  const simple = [
    `Today we practiced "${lower}" in English class.`,
    `I can use "${lower}" in a correct sentence now.`,
    `My classmate and I used "${lower}" in a dialogue.`
  ];
  let pool = byTopic[topic] || simple;
  if (levelKey === "B1") {
    pool = pool.concat([
      `I can use "${lower}" confidently when explaining my ideas.`,
      `During discussion, I used "${lower}" in a clear sentence.`
    ]);
  }
  const filtered = pool.filter((s) => !previous.has(s));
  const use = filtered.length ? filtered : pool;
  const idx = Math.floor(Math.random() * use.length);
  return use[idx];
}

function escapeXml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function resolveStaticRoot() {
  const candidates = [__dirname, path.join(__dirname, ".."), path.join(__dirname, "..", "..")];
  for (const dir of candidates) {
    const hasIndex = fs.existsSync(path.join(dir, "index.html"));
    const hasUnit3 = fs.existsSync(path.join(dir, "unit3"));
    if (hasIndex || hasUnit3) return dir;
  }
  return __dirname;
}

function buildStepHint(userAnswer, step) {
  const ans = String(userAnswer || "").trim();
  if (!ans) return "Bitte zuerst eine kurze Antwort eingeben.";
  if (step <= 1) return "Schritt 1: Pruefe, ob dein Inhalt zur Aufgabe passt. Nutze ein Schluesselwort aus der Aufgabe.";
  if (step === 2) return "Schritt 2: Formuliere den Satz knapper und klarer. Achte auf eine vollstaendige Satzstruktur.";
  if (step === 3) return "Schritt 3: Feinschliff bei Grammatik und Rechtschreibung (Gross-/Kleinschreibung, Artikel, Punkt).";
  return "Naechster Schritt: Vergleiche deine Antwort mit der Aufgabenfrage und verbessere nur ein Detail.";
}

function localGermanGrammarFix(input) {
  let text = String(input || "").trim();
  if (!text) return "Bitte Text eingeben.";
  text = text.replace(/\s+/g, " ");
  text = text.replace(/\bprozent\b/gi, "Prozent");
  text = text.replace(/\bnotaufnahme\b/gi, "Notaufnahme");
  text = text.replace(/\bkrankenhaus\b/gi, "Krankenhaus");
  text = text.replace(/\bgegend\b/gi, "Gegend");
  text = text.charAt(0).toUpperCase() + text.slice(1);
  if (!/[.!?]$/.test(text)) text += ".";
  return text;
}

function authRequired(req, res, next) {
  const token = getAuthToken(req);
  if (!token || !sessions.has(token)) return res.status(401).json({ error: "Nicht angemeldet." });
  const session = sessions.get(token);
  const student = loadStudents().students.find((s) => s.id === session.studentId);
  if (!student) {
    sessions.delete(token);
    return res.status(401).json({ error: "Session ungueltig." });
  }
  req.student = { id: student.id, firstName: student.firstName, lastName: student.lastName, className: student.className, displayName: `${student.firstName} ${student.lastName}` };
  next();
}

function getAuthToken(req) {
  const auth = String(req.headers.authorization || "");
  if (!auth.toLowerCase().startsWith("bearer ")) return "";
  return auth.slice(7).trim();
}

function clean(v) { return String(v || "").trim(); }

function normalizeKey(firstName, lastName, className) {
  return `${firstName}|${lastName}|${className}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
}

function uid(prefix) { return `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`; }

function clampPercent(p) {
  const n = Number(p);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function numberOr(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function safeMeta(meta) {
  if (!meta || typeof meta !== "object") return {};
  try { return JSON.parse(JSON.stringify(meta)); } catch (_e) { return {}; }
}

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(STUDENTS_FILE)) fs.writeFileSync(STUDENTS_FILE, JSON.stringify({ students: [] }, null, 2), "utf8");
  if (!fs.existsSync(PROGRESS_FILE)) fs.writeFileSync(PROGRESS_FILE, JSON.stringify({ records: [] }, null, 2), "utf8");
}

function loadStudents() {
  try { return JSON.parse(fs.readFileSync(STUDENTS_FILE, "utf8")); } catch (_e) { return { students: [] }; }
}

function saveStudents(data) { fs.writeFileSync(STUDENTS_FILE, JSON.stringify(data, null, 2), "utf8"); }

function loadProgress() {
  try { return JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf8")); } catch (_e) { return { records: [] }; }
}

function saveProgress(data) { fs.writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2), "utf8"); }

function shuffle(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function average(nums) {
  if (!nums.length) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

function buildStudentOverview(records) {
  const byExercise = new Map();
  for (const r of records) {
    const key = String(r.exerciseId || "");
    if (!key) continue;
    if (!byExercise.has(key)) byExercise.set(key, []);
    byExercise.get(key).push(r);
  }

  const overview = [];
  for (const [exerciseId, recs] of byExercise.entries()) {
    recs.sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
    const latest = recs[recs.length - 1];
    const bestPercent = Math.max(...recs.map((r) => Number(r.percent || 0)));
    overview.push({
      exerciseId,
      exerciseName: latest.exerciseName || exerciseId,
      unit: latest.unit || "",
      category: latest.category || "",
      attempts: recs.length,
      completed: recs.some((r) => r.completed),
      latestPercent: Number(latest.percent || 0),
      bestPercent,
      lastAt: latest.createdAt
    });
  }

  overview.sort((a, b) => String(b.lastAt).localeCompare(String(a.lastAt)));
  return overview;
}




