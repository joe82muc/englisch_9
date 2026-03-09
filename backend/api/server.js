import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";

const app = express();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Englisch 9 hint server läuft. ✅");
});

/* =========================================================
   SYSTEM PROMPT – deckt Present Perfect + Past Progressive ab
========================================================= */
const SYSTEM_PROMPT = `Du bist ein freundlicher Englischlehrer für eine 9. Klasse (Gymnasium, Bayern).

DEINE REGELN:
- Schreibe IMMER in vollständigen deutschen Sätzen (2-3 Sätze)
- Gib NIE die Lösung direkt an
- Erkläre WARUM die Grammatikregel so ist
- Beziehe dich konkret auf den Satz und das Thema der Aufgabe
- Sei ermutigend und positiv
- Maximal 60 Wörter

GRAMMATIK – PRESENT PERFECT:
- Formel: have/has + Partizip (3. Form)
- he/she/it → has · I/you/we/they → have
- for = Zeitspanne (for two years) · since = Zeitpunkt (since 1994)
- Signalwörter: already, just, ever, yet, never
- Unregelmäßige Verben: sing→sung, be→been, see→seen, meet→met

GRAMMATIK – PAST PROGRESSIVE:
- Formel: was/were + Verb-ing
- I/he/she/it → was · you/we/they → were
- while + Past Progressive = zwei gleichzeitige Aktionen
- when + Simple Past = kurze Unterbrechung der laufenden Aktion
- Verneinung: wasn't/weren't + Verb-ing
- Fragen: Was/Were + Subjekt + Verb-ing?
- Spelling: stummes -e fällt weg (have→having), Konsonant verdoppeln (run→running)

WICHTIG: Erkläre immer das Grammatikthema das in der Aufgabe steht – nicht das andere!`;

/* =========================================================
   HINT ROUTE
========================================================= */
app.post("/hint", async (req, res) => {
  try {
    const {
      studentAnswer = "",
      correctAnswer = "",
      exerciseText = "",
      grammarTopic = ""
    } = req.body || {};

    if (!studentAnswer || studentAnswer.trim().length < 2) {
      return res.json({ hint: "Schreib erst eine Antwort, dann kann ich dir helfen!" });
    }

    const userMessage = `Grammatikthema dieser Aufgabe: ${grammarTopic}
Aufgabe: "${exerciseText}"
Antwort des Schülers: "${studentAnswer}"
Richtige Antwort (NICHT verraten!): "${correctAnswer}"

Gib einen hilfreichen Tipp in 2-3 deutschen Sätzen. Erkläre die Grammatikregel für "${grammarTopic}". Verrate nicht die Lösung.`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }]
    });

    const hint = message.content[0]?.text || "Prüfe die Grammatikregel und versuche es nochmal.";
    res.json({ hint });

  } catch (error) {
    console.error("Fehler:", error);
    res.status(500).json({ hint: "Serverfehler – bitte nochmal versuchen." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
