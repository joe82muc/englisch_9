"use strict";

const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-20241022";

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const STATIC_ROOT = resolveStaticRoot();
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
    staticRoot: STATIC_ROOT
  });
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

    if (!studentAnswer) {
      return res.status(400).json({ error: "studentAnswer fehlt." });
    }

    if (!ANTHROPIC_API_KEY || !correctAnswer) {
      return res.json({ hint: buildStepHint(studentAnswer, step) });
    }

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

    if (!studentAnswer) {
      return res.status(400).json({ error: "studentAnswer fehlt." });
    }

    if (!ANTHROPIC_API_KEY || !correctAnswer) {
      return res.json({ hint: buildStepHint(studentAnswer, step) });
    }

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
    if (studentAnswer.length < 3) {
      return res.status(400).json({ error: "Text zu kurz." });
    }

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

    return res.json({
      suggestion: corrected,
      corrected,
      changes
    });
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
    if (studentMessage.length < 2) {
      return res.status(400).json({ error: "studentMessage fehlt." });
    }

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
      return res.json({
        reply: raw,
        correction: "",
        hint: "",
        score: 1
      });
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
    if (userText.length < 5) {
      return res.status(400).json({ hint: "Bitte schreibe zuerst einen kurzen Text." });
    }

    if (!ANTHROPIC_API_KEY) {
      return res.json({
        hint: "Fallback ohne KI-Key: Nutze mindestens 2 Eigenschaften und 1 because-Satz.",
        source: "fallback-no-key"
      });
    }

    const system = `Du bist ein freundlicher Englischlehrer fuer die 9. Klasse.
Gib kurzes Feedback zu einem Role-Model-Text.
- Antworte auf Deutsch in 2-3 Saetzen
- Keine komplette Musterloesung
- Nenne 1 Staerke und 1 naechsten Verbesserungsschritt`;

    const user = `Schuelertext:\n${userText}\n\nGib eine kurze KI-Hilfe.`;
    const hint = await askAnthropic(system, user, 190);

    return res.json({
      hint: hint || "Guter Anfang. Ergaenze eine zweite Eigenschaft und einen klaren because-Satz.",
      source: "anthropic"
    });
  } catch (error) {
    console.error("Fehler bei /api/role-model/help:", error.message);
    return res.status(200).json({
      hint: "KI gerade nicht erreichbar. Verbessere zuerst einen because-Satz.",
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

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: maxTokens,
      temperature: 0.3,
      system,
      messages: [{ role: "user", content: user }]
    })
  });

  if (!response.ok) {
    const raw = await response.text();
    throw new Error(`Anthropic HTTP ${response.status}: ${raw.slice(0, 250)}`);
  }

  const data = await response.json();
  if (!Array.isArray(data?.content)) return "";
  return data.content
    .filter((item) => item && item.type === "text")
    .map((item) => item.text || "")
    .join("\n")
    .trim();
}

function resolveStaticRoot() {
  const candidates = [
    __dirname,
    path.join(__dirname, ".."),
    path.join(__dirname, "..", "..")
  ];

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

  if (step <= 1) {
    return "Schritt 1: Pruefe, ob dein Inhalt zur Aufgabe passt. Nutze ein Schluesselwort aus der Aufgabe.";
  }
  if (step === 2) {
    return "Schritt 2: Formuliere den Satz knapper und klarer. Achte auf eine vollstaendige Satzstruktur.";
  }
  if (step === 3) {
    return "Schritt 3: Feinschliff bei Grammatik und Rechtschreibung (Gross-/Kleinschreibung, Artikel, Punkt).";
  }
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

  const first = text.charAt(0);
  text = first.toUpperCase() + text.slice(1);
  if (!/[.!?]$/.test(text)) text += ".";

  return text;
}
