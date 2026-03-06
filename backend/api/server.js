import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

/* =========================================================
   BASIS
========================================================= */

app.get("/", (req, res) => {
  res.send("Present Perfect hint server läuft.");
});

/* =========================================================
   HILFSFUNKTIONEN
========================================================= */

function normalize(text = "") {
  return text
    .toLowerCase()
    .replace(/[?.!,;:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function words(text = "") {
  return normalize(text).split(" ").filter(Boolean);
}

function includesWord(text, word) {
  return words(text).includes(word.toLowerCase());
}

function includesAnyWord(text, list) {
  const w = words(text);
  return list.some(item => w.includes(item.toLowerCase()));
}

function isEmpty(text = "") {
  return normalize(text).length === 0;
}

function startsWithAuxiliary(text = "") {
  const w = words(text);
  if (w.length === 0) return false;
  return ["have", "has", "haven't", "hasn't", "have not", "has not"].some(aux =>
    normalize(text).startsWith(aux)
  );
}

function hasHaveOrHas(text = "") {
  const n = normalize(text);
  return (
    n.includes(" have ") ||
    n.startsWith("have ") ||
    n.endsWith(" have") ||
    n.includes(" has ") ||
    n.startsWith("has ") ||
    n.endsWith(" has") ||
    n.includes("haven't") ||
    n.includes("hasn't") ||
    n.includes("have not") ||
    n.includes("has not")
  );
}

function hasNegation(text = "") {
  const n = normalize(text);
  return (
    n.includes("not") ||
    n.includes("haven't") ||
    n.includes("hasn't") ||
    n.includes("have not") ||
    n.includes("has not")
  );
}

function hasQuestionOrder(text = "") {
  const n = normalize(text);
  return n.startsWith("have ") || n.startsWith("has ");
}

function containsFor(text = "") {
  return includesWord(text, "for");
}

function containsSince(text = "") {
  return includesWord(text, "since");
}

/* =========================================================
   VERBFORMEN / PAST PARTICIPLES
========================================================= */

const irregularParticiples = {
  be: "been",
  sing: "sung",
  go: "gone",
  do: "done",
  see: "seen",
  write: "written",
  eat: "eaten",
  take: "taken",
  speak: "spoken",
  give: "given",
  know: "known",
  choose: "chosen",
  drive: "driven",
  break: "broken",
  come: "come",
  become: "become",
  run: "run",
  buy: "bought",
  bring: "brought",
  think: "thought",
  teach: "taught",
  meet: "met",
  make: "made",
  find: "found",
  tell: "told",
  read: "read",
  hear: "heard",
  wear: "worn",
  swim: "swum",
  drink: "drunk",
  begin: "begun",
  ring: "rung",
  rise: "risen",
  fall: "fallen",
  forget: "forgotten",
  get: "got",
  grow: "grown",
  hide: "hidden",
  ride: "ridden",
  shake: "shaken",
  show: "shown",
  sleep: "slept",
  spend: "spent",
  stand: "stood",
  understand: "understood",
  win: "won",
  lose: "lost",
  leave: "left",
  feel: "felt",
  keep: "kept",
  learn: "learned",
  listen: "listened",
  live: "lived",
  achieve: "achieved",
  visit: "visited",
  help: "helped",
  tidy: "tidied",
  watch: "watched",
  play: "played"
};

function getExpectedParticiple(correctAnswer = "") {
  const w = words(correctAnswer);

  for (const token of w) {
    const values = Object.values(irregularParticiples);
    if (values.includes(token)) return token;
  }

  for (const token of w) {
    if (
      token.endsWith("ed") ||
      token === "been" ||
      token === "done" ||
      token === "met" ||
      token === "seen" ||
      token === "written" ||
      token === "sung" ||
      token === "gone"
    ) {
      return token;
    }
  }

  return "";
}

function looksLikeBaseVerbInsteadOfParticiple(studentAnswer = "", expectedParticiple = "") {
  const s = words(studentAnswer);

  if (!expectedParticiple) return false;
  if (s.includes(expectedParticiple)) return false;

  const suspiciousBaseForms = [
    "be", "sing", "go", "do", "see", "write", "listen",
    "live", "achieve", "visit", "meet", "watch", "play"
  ];

  return suspiciousBaseForms.some(v => s.includes(v));
}

function expectedAuxiliaryFromCorrect(correctAnswer = "") {
  const n = normalize(correctAnswer);

  if (
    n.startsWith("has ") ||
    n.startsWith("hasn't ") ||
    n.startsWith("has not ")
  ) {
    return "has";
  }

  if (
    n.startsWith("have ") ||
    n.startsWith("haven't ") ||
    n.startsWith("have not ")
  ) {
    return "have";
  }

  return "";
}

function detectSignalWordIssue(studentAnswer = "", correctAnswer = "") {
  const s = normalize(studentAnswer);
  const c = normalize(correctAnswer);

  const signalWords = ["already", "just", "ever", "yet", "never", "for", "since"];

  for (const word of signalWords) {
    if (includesWord(c, word) && !includesWord(s, word)) {
      return word;
    }
  }

  return "";
}

/* =========================================================
   FOR / SINCE
========================================================= */

function getForSinceHint(studentAnswer = "", correctAnswer = "", exerciseText = "") {
  const s = normalize(studentAnswer);
  const c = normalize(correctAnswer);
  const ex = normalize(exerciseText);

  if (c.includes("since") && !s.includes("since")) {
    return "Achte auf einen Startpunkt: bei Tagen, Jahren, Uhrzeiten oder since + Nebensatz brauchst du meist since.";
  }

  if (c.includes("for") && !s.includes("for")) {
    return "Achte auf eine Zeitspanne: bei for geht es um eine Dauer wie two years, a week oder a long time.";
  }

  if (s.includes("for") && c.includes("since")) {
    return "Hier geht es nicht um eine Dauer, sondern um einen Startpunkt. Deshalb passt since besser.";
  }

  if (s.includes("since") && c.includes("for")) {
    return "Hier geht es um eine Zeitspanne. Deshalb passt for besser.";
  }

  if (ex.includes("sunday") || ex.includes("1994") || ex.includes("monday") || ex.includes("6 o'clock")) {
    return "Tipp: Sunday, 1994, last Monday oder 6 o'clock sind Zeitpunkte. Denke an since.";
  }

  if (ex.includes("a week") || ex.includes("two years") || ex.includes("many years") || ex.includes("a long time")) {
    return "Tipp: a week, two years oder many years sind Zeitspannen. Denke an for.";
  }

  return "Überlege: since = Startpunkt, for = Zeitspanne.";
}

/* =========================================================
   PRESENT PERFECT HAUPTLOGIK
========================================================= */

function buildPresentPerfectHint({
  studentAnswer = "",
  correctAnswer = "",
  exerciseText = "",
  grammarTopic = ""
}) {
  const s = normalize(studentAnswer);
  const c = normalize(correctAnswer);
  const topic = normalize(grammarTopic);
  const expectedParticiple = getExpectedParticiple(correctAnswer);
  const expectedAux = expectedAuxiliaryFromCorrect(correctAnswer);

  if (isEmpty(studentAnswer)) {
    return "Schreibe zuerst eine Antwort. Dann kann ich dir einen gezielten Tipp geben.";
  }

  /* ---------- FOR / SINCE ---------- */
  if (topic.includes("for vs since") || c.includes("for") || c.includes("since")) {
    if (
      (containsFor(studentAnswer) || containsSince(studentAnswer)) &&
      (containsFor(correctAnswer) || containsSince(correctAnswer))
    ) {
      const hint = getForSinceHint(studentAnswer, correctAnswer, exerciseText);
      if (hint) return hint;
    }
  }

  /* ---------- HAVE / HAS FEHLT ---------- */
  if ((c.includes("have") || c.includes("has")) && !hasHaveOrHas(studentAnswer)) {
    return "Dir fehlt das Hilfsverb. Im Present Perfect brauchst du have oder has + 3. Form.";
  }

  /* ---------- HAVE / HAS VERWECHSELT ---------- */
  if (expectedAux === "has" && includesWord(studentAnswer, "have")) {
    return "Achte auf das Subjekt: bei he, she oder it brauchst du has.";
  }

  if (expectedAux === "have" && includesWord(studentAnswer, "has")) {
    return "Achte auf das Subjekt: bei I, you, we oder they brauchst du have.";
  }

  /* ---------- BEEN ---------- */
  if (c.includes("been") && !includesWord(studentAnswer, "been")) {
    if (includesWord(studentAnswer, "be")) {
      return "Bei be brauchst du im Present Perfect nicht be, sondern die 3. Form been.";
    }
    return "Achte auf die 3. Form von be: been.";
  }

  /* ---------- PAST PARTICIPLE FEHLT ---------- */
  if (expectedParticiple && !includesWord(studentAnswer, expectedParticiple)) {
    if (looksLikeBaseVerbInsteadOfParticiple(studentAnswer, expectedParticiple)) {
      return `Nach have oder has brauchst du die 3. Verbform. Hier passt ${expectedParticiple}.`;
    }
  }

  /* ---------- SIGNALWORT FEHLT ---------- */
  const missingSignal = detectSignalWordIssue(studentAnswer, correctAnswer);
  if (missingSignal) {
    if (missingSignal === "already") {
      return "Das Signalwort already fehlt noch im Satz.";
    }
    if (missingSignal === "just") {
      return "Denke an das Signalwort just.";
    }
    if (missingSignal === "ever") {
      return "In solchen Fragen passt oft ever.";
    }
    if (missingSignal === "yet") {
      return "Hier fehlt noch das Signalwort yet.";
    }
    if (missingSignal === "never") {
      return "Hier passt das Signalwort never.";
    }
    if (missingSignal === "for") {
      return "Hier brauchst du for, weil es um eine Zeitspanne geht.";
    }
    if (missingSignal === "since") {
      return "Hier brauchst du since, weil es um einen Startpunkt geht.";
    }
  }

  /* ---------- VERNEINUNG ---------- */
  if ((c.includes("haven't") || c.includes("hasn't") || c.includes(" not ")) && !hasNegation(studentAnswer)) {
    return "Achte darauf: Der Satz muss verneint werden. Du brauchst not oder die Kurzform n't.";
  }

  /* ---------- FRAGE ---------- */
  if (c.endsWith("?") || topic.includes("question")) {
    if (!hasQuestionOrder(studentAnswer) && (c.startsWith("have ") || c.startsWith("has "))) {
      return "Bei Fragen steht have oder has am Anfang des Satzes.";
    }
  }

  /* ---------- SPEZIELLE VERBEN ---------- */
  if (c.includes("sung") && !s.includes("sung")) {
    return "Achte auf das unregelmäßige Verb: sing – sang – sung.";
  }

  if (c.includes("met") && !s.includes("met")) {
    return "Die 3. Form von meet ist met.";
  }

  if (c.includes("seen") && !s.includes("seen")) {
    return "Die 3. Form von see ist seen.";
  }

  if (c.includes("written") && !s.includes("written")) {
    return "Die 3. Form von write ist written.";
  }

  if (c.includes("gone") && !s.includes("gone")) {
    return "Die 3. Form von go ist gone.";
  }

  /* ---------- FOR / SINCE FALLBACK ---------- */
  if (topic.includes("for vs since")) {
    return getForSinceHint(studentAnswer, correctAnswer, exerciseText);
  }

  /* ---------- ALLGEMEINER FALLBACK ---------- */
  return "Prüfe have oder has, dann die 3. Verbform und achte auf Signalwörter wie already, ever, for oder since.";
}

/* =========================================================
   OPTIONAL: HINWEIS VERKÜRZEN
========================================================= */

function shortenHint(hint = "") {
  if (!hint) return "Prüfe have oder has und die 3. Verbform.";
  return hint.length > 220 ? hint.slice(0, 217) + "..." : hint;
}

/* =========================================================
   API ROUTE
========================================================= */

app.post("/hint", (req, res) => {
  try {
    const {
      studentAnswer = "",
      correctAnswer = "",
      exerciseText = "",
      grammarTopic = ""
    } = req.body || {};

    const hint = buildPresentPerfectHint({
      studentAnswer,
      correctAnswer,
      exerciseText,
      grammarTopic
    });

    res.json({
      hint: shortenHint(hint)
    });
  } catch (error) {
    console.error("Fehler in /hint:", error);
    res.status(500).json({
      hint: "Serverfehler. Prüfe have oder has und die 3. Verbform."
    });
  }
});

/* =========================================================
   PORT
========================================================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Present Perfect hint server läuft auf Port ${PORT}`);
});
