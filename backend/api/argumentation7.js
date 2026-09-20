"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const TOPICS = [
  {
    id: "wandertag",
    title: "Wandertag: Zoo oder Bowling?",
    shortTitle: "Wandertag",
    prompt: "Soll die Klasse am Wandertag in den Zoo oder zum Bowling gehen?",
    sides: ["Zoo", "Bowling"],
    starter: "Ich bin dafür, dass ...",
    counterPrompts: {
      Zoo: "Bowling ist wetterunabhängig und die ganze Klasse kann gemeinsam aktiv sein.",
      Bowling: "Im Zoo kann die Klasse Tiere beobachten und dabei etwas Neues lernen."
    }
  },
  {
    id: "handys",
    title: "Handys in der Schule",
    shortTitle: "Handys",
    prompt: "Sollen Handys in den Pausen erlaubt sein?",
    sides: ["dafür", "dagegen"],
    starter: "Handys sollten in den Pausen ...",
    counterPrompts: {
      dafür: "Ohne Handys sprechen Schülerinnen und Schüler in der Pause mehr miteinander.",
      dagegen: "Handys können in der Pause für Absprachen oder den Heimweg nützlich sein."
    }
  },
  {
    id: "hausaufgaben",
    title: "Hausaufgaben",
    shortTitle: "Hausaufgaben",
    prompt: "Soll es am Wochenende Hausaufgaben geben?",
    sides: ["dafür", "dagegen"],
    starter: "Hausaufgaben am Wochenende sind ...",
    counterPrompts: {
      dafür: "Am Wochenende brauchen Familien auch freie und planbare gemeinsame Zeit.",
      dagegen: "Kurze Aufgaben helfen dabei, den Unterrichtsstoff regelmäßig zu wiederholen."
    }
  },
  {
    id: "schuluniform",
    title: "Schuluniform",
    shortTitle: "Schuluniform",
    prompt: "Soll es an unserer Schule eine Schuluniform geben?",
    sides: ["dafür", "dagegen"],
    starter: "Eine Schuluniform wäre ...",
    counterPrompts: {
      dafür: "Kleidung ist ein Teil der Persönlichkeit und sollte selbst gewählt werden dürfen.",
      dagegen: "Einheitliche Kleidung kann sichtbare Unterschiede zwischen Familien verringern."
    }
  },
  {
    id: "schulbeginn",
    title: "Späterer Schulbeginn",
    shortTitle: "Schulbeginn",
    prompt: "Soll der Unterricht morgens später beginnen?",
    sides: ["dafür", "dagegen"],
    starter: "Der Unterricht sollte später beginnen, weil ...",
    counterPrompts: {
      dafür: "Bei einem späteren Beginn endet der Schultag ebenfalls später.",
      dagegen: "Ausgeschlafene Jugendliche können sich im Unterricht oft besser konzentrieren."
    }
  },
  {
    id: "klassenfahrt",
    title: "Klassenfahrt",
    shortTitle: "Klassenfahrt",
    prompt: "Soll eine Klassenfahrt eher sportlich oder kulturell ausgerichtet sein?",
    sides: ["sportlich", "kulturell"],
    starter: "Unsere Klassenfahrt sollte ... sein, weil ...",
    counterPrompts: {
      sportlich: "Bei kulturellen Angeboten lernt die Klasse einen neuen Ort besonders gut kennen.",
      kulturell: "Sportliche Aktivitäten stärken den Zusammenhalt und schaffen gemeinsame Erlebnisse."
    }
  },
  {
    id: "social-media",
    title: "Mindestalter für Social Media",
    shortTitle: "Social Media",
    prompt: "Soll Social Media erst ab 14 Jahren erlaubt sein?",
    sides: ["dafür", "dagegen"],
    starter: "Ein Mindestalter von 14 Jahren ist ...",
    counterPrompts: {
      dafür: "Auch jüngere Jugendliche möchten mit ihren Freunden digital in Kontakt bleiben.",
      dagegen: "Ein Mindestalter kann jüngere Kinder besser vor ungeeigneten Inhalten schützen."
    }
  },
  {
    id: "schulnoten",
    title: "Schulnoten",
    shortTitle: "Schulnoten",
    prompt: "Soll es in allen Fächern weiterhin Schulnoten geben?",
    sides: ["dafür", "dagegen"],
    starter: "Schulnoten sind ...",
    counterPrompts: {
      dafür: "Ausführliche Rückmeldungen zeigen genauer als eine Zahl, was schon gelingt.",
      dagegen: "Noten geben schnell einen Überblick über den aktuellen Leistungsstand."
    }
  }
];

const STAGES = [
  { id: 1, title: "Argument bauen", subtitle: "Behauptung, Begründung und Beispiel" },
  { id: 2, title: "Zwei Seiten sehen", subtitle: "Pro und Kontra abwägen" },
  { id: 3, title: "Argument-Duell", subtitle: "Auf ein Gegenargument antworten" },
  { id: 4, title: "Freie Argumentation", subtitle: "Einen eigenen Text untersuchen" }
];

const EXPECTED_COMPONENTS = {
  1: ["claim", "reason", "example"],
  2: ["pro", "contra", "weighing"],
  3: ["response", "reason", "objective"],
  4: ["claim", "reason", "example", "objective"]
};

function registerArgumentation7Routes(app, options = {}) {
  const dataDir = options.dataDir || path.join(__dirname, "..", "data");
  const dataFile = path.join(dataDir, "argumentation7.json");
  const teacherPassword = String(options.teacherPassword || process.env.TEACHER_PASSWORD || "2");
  const tokenSecret = String(options.hashSecret || `${teacherPassword}|de7-argumentation`);
  const askAnthropic = typeof options.askAnthropic === "function" ? options.askAnthropic : async () => "";

  function readData() {
    fs.mkdirSync(dataDir, { recursive: true });
    if (!fs.existsSync(dataFile)) return { attempts: [] };
    try {
      const data = JSON.parse(fs.readFileSync(dataFile, "utf8"));
      return { attempts: Array.isArray(data.attempts) ? data.attempts : [] };
    } catch (error) {
      console.error("Argumentation 7: Datendatei konnte nicht gelesen werden:", error.message);
      return { attempts: [] };
    }
  }

  function writeData(data) {
    fs.mkdirSync(dataDir, { recursive: true });
    const temp = `${dataFile}.tmp`;
    fs.writeFileSync(temp, JSON.stringify(data, null, 2), "utf8");
    fs.renameSync(temp, dataFile);
  }

  app.get("/api/de7-argument/config", (_req, res) => {
    res.json({
      ok: true,
      service: "argumentation7",
      aiConfigured: Boolean(process.env.ANTHROPIC_API_KEY),
      topics: TOPICS.map(publicTopic),
      stages: STAGES
    });
  });

  app.post("/api/de7-argument/start", (req, res) => {
    const student = readIdentity(req.body);
    if (!student) {
      return res.status(400).json({ ok: false, error: "Bitte Vorname, Nachname und Klasse vollständig angeben." });
    }

    const token = signToken({
      key: student.key,
      firstName: student.firstName,
      lastName: student.lastName,
      className: student.className,
      issuedAt: Date.now()
    }, tokenSecret);
    const progress = buildProgress(readData().attempts, student.key);
    return res.json({ ok: true, token, student: withoutKey(student), progress });
  });

  app.get("/api/de7-argument/progress", (req, res) => {
    const student = requireStudent(req, res, tokenSecret);
    if (!student) return;
    return res.json({ ok: true, progress: buildProgress(readData().attempts, student.key) });
  });

  app.post("/api/de7-argument/counter", async (req, res) => {
    const student = requireStudent(req, res, tokenSecret);
    if (!student) return;
    const topic = TOPICS.find((item) => item.id === clean(req.body?.topicId, 60));
    const side = clean(req.body?.side, 60);
    const studentArgument = clean(req.body?.studentArgument, 1800);
    if (!topic || !topic.sides.includes(side) || studentArgument.length < 12) {
      return res.status(400).json({ ok: false, error: "Für das Duell fehlen Thema, Position oder Argument." });
    }

    let counterArgument = topic.counterPrompts[side];
    let source = "regel";
    try {
      const raw = await askAnthropic(
        [
          "Du bist ein fairer Diskussionspartner für eine 7. Klasse.",
          "Formuliere genau ein kurzes, sachliches Gegenargument zur Position des Schülers.",
          "Das Gegenargument braucht eine Behauptung und eine Begründung, aber keine Beleidigung und keine Fangfrage.",
          "Verwende höchstens 45 Wörter und antworte ausschließlich als JSON: {\"counterArgument\":\"...\"}."
        ].join("\n"),
        JSON.stringify({ topic: topic.prompt, studentSide: side, studentArgument }),
        180
      );
      const parsed = parseJsonObject(raw);
      const candidate = clean(parsed?.counterArgument, 420);
      if (candidate) {
        counterArgument = candidate;
        source = "ki";
      }
    } catch (error) {
      console.error("Argumentation 7 Gegenargument:", error.message);
    }

    return res.json({ ok: true, counterArgument, source });
  });

  app.post("/api/de7-argument/evaluate", async (req, res) => {
    const student = requireStudent(req, res, tokenSecret);
    if (!student) return;
    const topic = TOPICS.find((item) => item.id === clean(req.body?.topicId, 60));
    const stage = Number(req.body?.stage);
    const side = clean(req.body?.side, 60);
    const content = sanitizeContent(req.body?.content);
    const exerciseId = clean(req.body?.exerciseId, 100) || crypto.randomUUID();
    if (!topic || !EXPECTED_COMPONENTS[stage] || !hasEnoughContent(stage, content)) {
      return res.status(400).json({ ok: false, error: "Die Eingabe ist noch zu kurz oder unvollständig." });
    }
    if (side && !topic.sides.includes(side)) {
      return res.status(400).json({ ok: false, error: "Diese Position gehört nicht zum ausgewählten Thema." });
    }

    const before = readData();
    const progressBefore = buildProgress(before.attempts, student.key);
    if (!progressBefore.stages[String(stage)]?.unlocked) {
      return res.status(403).json({ ok: false, error: "Schließe zuerst die vorherige Stufe mit mindestens zwei Sternen ab." });
    }

    const fallback = buildFallbackEvaluation(stage, content);
    let evaluation = fallback;
    let source = "regel";
    try {
      const raw = await askAnthropic(
        buildEvaluationSystemPrompt(stage),
        JSON.stringify({
          grade: 7,
          topic: topic.prompt,
          chosenSide: side || null,
          stage,
          studentText: content
        }),
        900
      );
      const parsed = parseJsonObject(raw);
      if (parsed) {
        evaluation = normalizeEvaluation(parsed, stage, content, fallback);
        source = "ki";
      }
    } catch (error) {
      console.error("Argumentation 7 Auswertung:", error.message);
    }

    const matching = before.attempts.filter((row) => row.studentKey === student.key && row.exerciseId === exerciseId);
    const attempt = {
      id: crypto.randomUUID(),
      exerciseId,
      revision: matching.length + 1,
      studentKey: student.key,
      firstName: student.firstName,
      lastName: student.lastName,
      className: student.className,
      topicId: topic.id,
      topicTitle: topic.title,
      stage,
      side,
      content,
      evaluation,
      source,
      createdAt: new Date().toISOString()
    };
    const current = readData();
    current.attempts.push(attempt);
    writeData(current);
    const progress = buildProgress(current.attempts, student.key);

    return res.json({
      ok: true,
      attemptId: attempt.id,
      exerciseId,
      revision: attempt.revision,
      evaluation,
      source,
      progress
    });
  });

  app.post("/api/de7-argument/teacher/results", (req, res) => {
    if (!requireTeacher(req, res, teacherPassword)) return;
    const attempts = readData().attempts.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return res.json({ ok: true, attempts, overview: buildTeacherOverview(attempts) });
  });

  app.post("/api/de7-argument/teacher/delete", (req, res) => {
    if (!requireTeacher(req, res, teacherPassword)) return;
    const id = clean(req.body?.attemptId, 100);
    const data = readData();
    const before = data.attempts.length;
    data.attempts = data.attempts.filter((row) => row.id !== id);
    if (data.attempts.length === before) return res.status(404).json({ ok: false, error: "Versuch nicht gefunden." });
    writeData(data);
    return res.json({ ok: true });
  });

  app.post("/api/de7-argument/teacher/export", (req, res) => {
    if (!requireTeacher(req, res, teacherPassword)) return;
    const attempts = readData().attempts;
    const lines = [
      ["Klasse", "Nachname", "Vorname", "Thema", "Stufe", "Version", "Sterne", "Quelle", "Zeitpunkt"],
      ...attempts.map((row) => [
        row.className,
        row.lastName,
        row.firstName,
        row.topicTitle,
        row.stage,
        row.revision,
        row.evaluation?.stars ?? 0,
        row.source,
        row.createdAt
      ])
    ];
    const csv = lines.map((line) => line.map(csvValue).join(";")).join("\r\n");
    return res.type("text/csv; charset=utf-8").attachment("argumentation-7m.csv").send(`\ufeff${csv}`);
  });
}

function buildEvaluationSystemPrompt(stage) {
  const stageInstruction = {
    1: "Prüfe getrennt claim (Behauptung), reason (Begründung) und example (Beispiel oder Vergleich).",
    2: "Prüfe getrennt pro (Pro-Argument), contra (Kontra-Argument) und weighing (begründete Abwägung).",
    3: "Prüfe getrennt response (direkter Bezug auf das Gegenargument), reason (Begründung der Antwort) und objective (sachlicher Ton).",
    4: "Prüfe claim, reason, example und objective. Markiere außerdem kurze Originalstellen im Text."
  }[stage];
  return [
    "Du gibst Lernfeedback zum Argumentieren in einer 7. Klasse einer bayerischen Mittelschule.",
    stageInstruction,
    "Bewerte Inhalt und Aufbau wohlwollend. Rechtschreibung ist nur dann ein Hinweis, wenn der Sinn unklar wird.",
    "Jeder Komponentenstatus ist exakt good, partial oder missing.",
    "Gib kurze, konkrete Hinweise, aber schreibe niemals eine Musterlösung und formuliere keinen Schülertext um.",
    "Ein Hinweis soll nur sagen, was ergänzt oder genauer erklärt werden muss.",
    "stars ist eine ganze Zahl von 0 bis 3. Ab 2 Sternen gilt die Stufe als bestanden.",
    "markings enthält höchstens 8 kurze, wörtlich im Schülertext vorkommende Ausschnitte mit label Behauptung, Begründung, Beispiel, Pro, Kontra oder Gegenargument.",
    "killerPhrases enthält nur unsachliche Pauschalaussagen aus dem Originaltext.",
    "Antworte ausschließlich als JSON mit diesem Schema:",
    '{"summary":"kurze Rückmeldung","components":{"claim":{"status":"good","hint":"..."}},"strengths":["..."],"nextStep":"...","stars":2,"markings":[{"label":"Behauptung","quote":"Originalstelle"}],"objective":true,"killerPhrases":[]}'
  ].join("\n");
}

function buildFallbackEvaluation(stage, content) {
  const objective = !findKillerPhrases(Object.values(content).join(" ")).length;
  let components;
  if (stage === 1) {
    components = {
      claim: assessField(content.claim, 6, "Formuliere klar, was du forderst oder meinst."),
      reason: assessField(content.reason, 10, "Erkläre, warum deine Behauptung sinnvoll ist."),
      example: assessField(content.example, 10, "Ergänze ein konkretes Beispiel oder einen Vergleich.")
    };
  } else if (stage === 2) {
    components = {
      pro: assessField(content.pro, 12, "Erkläre einen Vorteil mit einer Begründung."),
      contra: assessField(content.contra, 12, "Erkläre einen Nachteil mit einer Begründung."),
      weighing: assessField(content.weighing, 12, "Wäge beide Seiten ab und begründe deine Entscheidung.")
    };
  } else if (stage === 3) {
    components = {
      response: assessField(content.reply, 14, "Beziehe dich direkt auf das Gegenargument."),
      reason: assessReason(content.reply),
      objective: {
        status: objective ? "good" : "partial",
        hint: objective ? "Du bleibst sachlich." : "Vermeide pauschale oder abwertende Formulierungen."
      }
    };
  } else {
    const text = content.text || "";
    components = {
      claim: assessField(text, 20, "Mache deine Position im Text deutlich."),
      reason: assessReason(text),
      example: assessExample(text),
      objective: {
        status: objective ? "good" : "partial",
        hint: objective ? "Der Ton ist sachlich." : "Prüfe den Text auf pauschale oder abwertende Aussagen."
      }
    };
  }
  const stars = scoreComponents(stage, components);
  return {
    summary: stars >= 2 ? "Dein Argument ist nachvollziehbar aufgebaut." : "Ein wichtiger Baustein deines Arguments fehlt noch.",
    components,
    strengths: Object.entries(components).filter(([, value]) => value.status === "good").slice(0, 2).map(([key]) => componentLabel(key)),
    nextStep: firstHint(components),
    stars,
    passed: stars >= 2,
    markings: buildFallbackMarkings(stage, content),
    objective,
    killerPhrases: findKillerPhrases(Object.values(content).join(" "))
  };
}

function normalizeEvaluation(value, stage, content, fallback) {
  const keys = EXPECTED_COMPONENTS[stage];
  const components = {};
  for (const key of keys) {
    const proposed = value?.components?.[key];
    components[key] = {
      status: ["good", "partial", "missing"].includes(proposed?.status) ? proposed.status : fallback.components[key].status,
      hint: clean(proposed?.hint, 240) || fallback.components[key].hint
    };
  }
  const stars = scoreComponents(stage, components);
  const original = Object.values(content).join(" ");
  const markings = Array.isArray(value?.markings) ? value.markings.map((mark) => ({
    label: clean(mark?.label, 40),
    quote: clean(mark?.quote, 180)
  })).filter((mark) => mark.label && mark.quote && original.includes(mark.quote)).slice(0, 8) : fallback.markings;
  const killerPhrases = Array.isArray(value?.killerPhrases) ? value.killerPhrases.map((item) => clean(item, 120)).filter((item) => item && original.includes(item)).slice(0, 5) : fallback.killerPhrases;
  const objective = typeof value?.objective === "boolean" ? value.objective : fallback.objective;
  return {
    summary: clean(value?.summary, 260) || fallback.summary,
    components,
    strengths: Array.isArray(value?.strengths) ? value.strengths.map((item) => clean(item, 140)).filter(Boolean).slice(0, 3) : fallback.strengths,
    nextStep: clean(value?.nextStep, 260) || firstHint(components),
    stars,
    passed: stars >= 2,
    markings,
    objective,
    killerPhrases
  };
}

function scoreComponents(stage, components) {
  const keys = EXPECTED_COMPONENTS[stage].slice(0, 3);
  const score = keys.reduce((sum, key) => sum + (components[key]?.status === "good" ? 1 : components[key]?.status === "partial" ? 0.5 : 0), 0);
  let stars = Math.max(0, Math.min(3, Math.round(score)));
  if (components.objective?.status === "missing") stars = Math.min(stars, 1);
  return stars;
}

function assessField(text, minWords, missingHint) {
  const words = wordCount(text);
  if (!words) return { status: "missing", hint: missingHint };
  if (words < minWords) return { status: "partial", hint: "Der Gedanke ist da. Erkläre ihn noch etwas genauer." };
  return { status: "good", hint: "Dieser Baustein ist verständlich ausgeführt." };
}

function assessReason(text) {
  const value = String(text || "");
  const hasConnector = /\b(weil|denn|da|deshalb|daher|dadurch|aus diesem grund)\b/i.test(value);
  if (wordCount(value) < 5) return { status: "missing", hint: "Ergänze eine nachvollziehbare Begründung." };
  return hasConnector
    ? { status: "good", hint: "Die Begründung ist sprachlich erkennbar." }
    : { status: "partial", hint: "Mache deutlicher, warum dein Argument gilt." };
}

function assessExample(text) {
  const value = String(text || "");
  if (/\b(zum beispiel|beispielsweise|etwa|wenn|wie)\b/i.test(value) && wordCount(value) >= 8) {
    return { status: "good", hint: "Du machst deinen Gedanken an einem Beispiel anschaulich." };
  }
  return { status: wordCount(value) >= 25 ? "partial" : "missing", hint: "Ergänze ein konkretes Beispiel oder einen Vergleich." };
}

function buildFallbackMarkings(stage, content) {
  if (stage === 1) return [
    { label: "Behauptung", quote: content.claim },
    { label: "Begründung", quote: content.reason },
    { label: "Beispiel", quote: content.example }
  ].filter((item) => item.quote);
  if (stage === 2) return [
    { label: "Pro", quote: content.pro },
    { label: "Kontra", quote: content.contra },
    { label: "Abwägung", quote: content.weighing }
  ].filter((item) => item.quote);
  if (stage === 3) return content.reply ? [{ label: "Gegenargument", quote: content.reply }] : [];
  return [];
}

function buildProgress(attempts, studentKey) {
  const mine = attempts.filter((row) => row.studentKey === studentKey);
  const stages = {};
  let previousPassed = true;
  for (const stage of STAGES) {
    const rows = mine.filter((row) => row.stage === stage.id);
    const bestStars = rows.reduce((best, row) => Math.max(best, Number(row.evaluation?.stars) || 0), 0);
    const passed = bestStars >= 2;
    stages[String(stage.id)] = {
      unlocked: stage.id === 1 || previousPassed,
      passed,
      bestStars,
      attempts: rows.length
    };
    previousPassed = previousPassed && passed;
  }
  return {
    stages,
    totalAttempts: mine.length,
    licenceReady: STAGES.every((stage) => stages[String(stage.id)].passed)
  };
}

function buildTeacherOverview(attempts) {
  const students = new Map();
  for (const row of attempts) {
    if (!students.has(row.studentKey)) {
      students.set(row.studentKey, {
        studentKey: row.studentKey,
        firstName: row.firstName,
        lastName: row.lastName,
        className: row.className,
        attempts: 0,
        stages: { 1: 0, 2: 0, 3: 0, 4: 0 },
        lastActive: row.createdAt
      });
    }
    const item = students.get(row.studentKey);
    item.attempts += 1;
    item.stages[row.stage] = Math.max(item.stages[row.stage] || 0, Number(row.evaluation?.stars) || 0);
    if (row.createdAt > item.lastActive) item.lastActive = row.createdAt;
  }
  return Array.from(students.values()).sort((a, b) => a.className.localeCompare(b.className, "de") || a.lastName.localeCompare(b.lastName, "de"));
}

function hasEnoughContent(stage, content) {
  if (stage === 1) return [content.claim, content.reason, content.example].every((item) => wordCount(item) >= 2);
  if (stage === 2) return [content.pro, content.contra, content.weighing].every((item) => wordCount(item) >= 3);
  if (stage === 3) return wordCount(content.reply) >= 5 && wordCount(content.counterArgument) >= 4;
  if (stage === 4) return wordCount(content.text) >= 25;
  return false;
}

function sanitizeContent(value) {
  const allowed = ["claim", "reason", "example", "pro", "contra", "weighing", "reply", "counterArgument", "text"];
  const result = {};
  for (const key of allowed) result[key] = clean(value?.[key], key === "text" ? 4500 : 1800);
  return result;
}

function readIdentity(value) {
  const firstName = clean(value?.firstName, 60);
  const lastName = clean(value?.lastName, 60);
  const className = clean(value?.className, 30);
  if (!firstName || !lastName || !className) return null;
  const key = [firstName, lastName, className].join("|").toLocaleLowerCase("de").normalize("NFKC").replace(/\s+/g, " ");
  return { firstName, lastName, className, key };
}

function signToken(payload, secret) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function requireStudent(req, res, secret) {
  const header = String(req.headers.authorization || "");
  const token = header.startsWith("Bearer ") ? header.slice(7) : clean(req.body?.token, 2000);
  const [body, signature] = token.split(".");
  if (!body || !signature) {
    res.status(401).json({ ok: false, error: "Bitte neu anmelden." });
    return null;
  }
  const expected = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  const givenBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (givenBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(givenBuffer, expectedBuffer)) {
    res.status(401).json({ ok: false, error: "Die Anmeldung ist ungültig." });
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!payload.key || Date.now() - Number(payload.issuedAt) > 1000 * 60 * 60 * 24 * 90) throw new Error("expired");
    return payload;
  } catch (_error) {
    res.status(401).json({ ok: false, error: "Bitte neu anmelden." });
    return null;
  }
}

function requireTeacher(req, res, password) {
  const given = Buffer.from(clean(req.body?.password, 200));
  const expected = Buffer.from(password);
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) {
    res.status(401).json({ ok: false, error: "Passwort ist falsch." });
    return false;
  }
  return true;
}

function parseJsonObject(raw) {
  if (!raw) return null;
  const match = String(raw).match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch (_error) {
    return null;
  }
}

function findKillerPhrases(text) {
  const patterns = [
    /\b(jeder weiß|alle wissen|immer|nie|totaler quatsch|völliger unsinn|wer das glaubt|nur dumme)\b/gi
  ];
  const hits = [];
  for (const pattern of patterns) {
    const found = String(text || "").match(pattern) || [];
    hits.push(...found);
  }
  return Array.from(new Set(hits)).slice(0, 5);
}

function firstHint(components) {
  const first = Object.values(components).find((item) => item.status !== "good");
  return first?.hint || "Probiere als Nächstes ein neues Thema.";
}

function componentLabel(key) {
  return ({
    claim: "klare Behauptung",
    reason: "nachvollziehbare Begründung",
    example: "passendes Beispiel",
    pro: "Pro-Argument",
    contra: "Kontra-Argument",
    weighing: "begründete Abwägung",
    response: "direkte Antwort",
    objective: "sachlicher Ton"
  })[key] || key;
}

function publicTopic(topic) {
  return {
    id: topic.id,
    title: topic.title,
    shortTitle: topic.shortTitle,
    prompt: topic.prompt,
    sides: topic.sides,
    starter: topic.starter
  };
}

function withoutKey(student) {
  return { firstName: student.firstName, lastName: student.lastName, className: student.className };
}

function clean(value, max = 240) {
  return String(value ?? "").replace(/\u0000/g, "").trim().slice(0, max);
}

function wordCount(value) {
  return String(value || "").trim().split(/\s+/).filter(Boolean).length;
}

function csvValue(value) {
  const text = String(value ?? "");
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

module.exports = { registerArgumentation7Routes, TOPICS, STAGES };
