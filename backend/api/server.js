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

/* ═══════════════════════════════════════════════════
   SYSTEM PROMPT – deckt Present Perfect + Past Progressive ab
   ═══════════════════════════════════════════════════ */
const SYSTEM_PROMPT = `Du bist ein freundlicher Englischlehrer für eine 9. Klasse (Gymnasium, Bayern).

DEINE REGELN:
- Schreibe IMMER in vollständigen deutschen Sätzen (2-3 Sätze)
- Gib NIE die Lösung direkt an
- Erkläre WARUM die Grammatikregel so ist
- Benutze ermutigende Sprache
- Wenn der Schüler fast richtig liegt, sag das!
- Maximal 60 Wörter

THEMEN die du abdeckst:
1. Present Perfect (have/has + past participle)
2. Past Progressive (was/were + -ing)
3. Signalwörter (since, for, already, yet, just, while, when)
4. Irregular verbs (go-went-gone, etc.)
5. Verneinung und Fragebildung`;

/* ═══════════════════════════════════════════════════
   SYSTEM PROMPT – Accident Wordbank (Unit 3)
   ═══════════════════════════════════════════════════ */
const ACCIDENT_PROMPT = `Du bist ein freundlicher Englischlehrer für eine 9. Klasse (Gymnasium, Bayern).
Thema: Talking about an accident – englische Dialogsituationen (Polizist / Zeuge).

Vokabular dieser Einheit:
- Zeitreferenz: before, after, when, at the time
- Sequenzen: First, Then, After that
- Polizeigespräch: What is your name/date of birth/phone number? Can you explain in more detail please? We will get in touch.
- Zeugenaussage: I arrived at … I think the accident happened … minutes before I arrived. There was/were …

DEINE AUFGABEN (je nach Situation):
1. WENN der Schüler nicht weiterkommt oder wenig geschrieben hat: Schlage auf Deutsch vor, was als NÄCHSTES kommen sollte. Gib ein konkretes englisches Satzbeispiel das er verwenden kann (aber NICHT die exakte Lösung).
2. WENN der Schüler schon viel geschrieben hat: Prüfe auf RECHTSCHREIBUNG und GRAMMATIK. Nenne konkret die Fehler auf Deutsch und zeige die korrekte Schreibweise. z.B. "Du hast 'courner' geschrieben – richtig wäre 'corner'."
3. WENN etwas Inhaltliches fehlt (z.B. Name, Geburtsdatum, Uhrzeit): Sage konkret was fehlt.

REGELN:
- Schreibe auf Deutsch
- 2-4 Sätze
- Ermutigend und konkret
- Gib Beispielsätze auf Englisch kursiv an
- Max. 80 Wörter`;

/* ═══════════════════════════════════════════════════
   POST /api/hint – Present Perfect / Past Progressive
   ═══════════════════════════════════════════════════ */
app.post("/api/hint", async (req, res) => {
    try {
        const { studentAnswer, correctAnswer, exerciseContext } = req.body;

        if (!studentAnswer || !correctAnswer) {
            return res.status(400).json({ error: "studentAnswer und correctAnswer sind erforderlich." });
        }

        const userMessage = `Aufgabe/Kontext: "${exerciseContext || ''}"
Schülerantwort: "${studentAnswer}"
Richtige Antwort (nicht verraten!): "${correctAnswer}"
Gib einen hilfreichen Tipp auf Deutsch.`;

        const message = await client.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 150,
            system: SYSTEM_PROMPT,
            messages: [{ role: "user", content: userMessage }]
        });

        const hint = message.content[0].text;
        res.json({ hint });
    } catch (error) {
        console.error("Fehler bei /api/hint:", error);
        res.status(500).json({ error: "Serverfehler beim Generieren des Tipps." });
    }
});

/* ═══════════════════════════════════════════════════
   POST /api/hint-accident – Accident Wordbank (Unit 3)
   ═══════════════════════════════════════════════════ */
app.post("/api/hint-accident", async (req, res) => {
    try {
        const { studentAnswer, correctAnswer, exerciseContext } = req.body;

        if (!studentAnswer || !correctAnswer) {
            return res.status(400).json({ error: "studentAnswer und correctAnswer sind erforderlich." });
        }

        const userMessage = `Aufgabe/Kontext: "${exerciseContext || ''}"
Schülerantwort: "${studentAnswer}"
Richtige Antwort (nicht verraten!): "${correctAnswer}"
Gib einen hilfreichen Tipp auf Deutsch.`;

        const message = await client.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 150,
            system: ACCIDENT_PROMPT,
            messages: [{ role: "user", content: userMessage }]
        });

        const hint = message.content[0].text;
        res.json({ hint });
    } catch (error) {
        console.error("Fehler bei /api/hint-accident:", error);
        res.status(500).json({ error: "Serverfehler beim Generieren des Tipps." });
    }
});

/* ═══════════════════════════════════════════════════
   Server starten
   ═══════════════════════════════════════════════════ */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`✅ Server läuft auf Port ${PORT}`);
});
