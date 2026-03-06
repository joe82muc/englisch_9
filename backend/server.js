import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";

const app = express();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Present Perfect hint server läuft.");
});

/* =========================================================
   SYSTEM PROMPT
========================================================= */
const SYSTEM_PROMPT = `Du bist ein freundlicher Englischlehrer für eine 9. Klasse (Gymnasium, Bayern).
Du hilfst Schülern beim Lernen des Present Perfect auf Englisch.

DEINE REGELN:
- Schreibe IMMER in vollständigen deutschen Sätzen (2-3 Sätze)
- Gib NIE die Lösung direkt an
- Erkläre WARUM die Grammatikregel so ist
- Sei ermutigend und positiv
- Beziehe dich konkret auf den Satz des Schülers
- Maximal 60 Wörter

GRAMMATIK-WISSEN:
- Present Perfect: have/has + Partizip (3. Form)
- for = Zeitspanne (for two years, for a week, for a long time)
- since = Zeitpunkt (since Sunday, since 1994, since she was young, since 6 o'clock)
- Signalwörter: already (zwischen have/has und Partizip), just, ever (Fragen), yet (Verneinung/Ende), never
- he/she/it → has · I/you/we/they → have
- Fragen: Have/Has + Subjekt + (ever) + Partizip?
- Verneinung: haven't / hasn't + Partizip
- Unregelmäßige Verben: sing→sung, be→been, see→seen, write→written, meet→met, go→gone`;

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

    const userMessage = `Aufgabe: "${exerciseText}"
Thema: ${grammarTopic}
Antwort des Schülers: "${studentAnswer}"
Richtige Antwort (nicht verraten!): "${correctAnswer}"

Gib dem Schüler einen hilfreichen Tipp in 2-3 vollständigen deutschen Sätzen. Verrate nicht die Lösung, sondern erkläre die Grammatikregel.`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }]
    });

    const hint = message.content[0]?.text || "Prüfe have/has und die 3. Verbform.";
    res.json({ hint });

  } catch (error) {
    console.error("Fehler:", error);
    res.status(500).json({ hint: "Serverfehler. Prüfe have oder has und die 3. Verbform." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
