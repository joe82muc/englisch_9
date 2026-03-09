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
        res.json({ hint: message.content[0].text });
    } catch (error) {
        console.error("Fehler bei /api/hint:", error);
        res.status(500).json({ error: "Serverfehler." });
    }
});

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
        res.json({ hint: message.content[0].text });
    } catch (error) {
        console.error("Fehler bei /api/hint-accident:", error);
        res.status(500).json({ error: "Serverfehler." });
    }
});

app.post("/api/korrektur", async (req, res) => {
    try {
        const { studentAnswer } = req.body;
        if (!studentAnswer || studentAnswer.trim().length < 3) {
            return res.status(400).json({ error: "Text zu kurz." });
        }
        const message = await client.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 400,
            system: `Du bist ein Englischlehrer. Korrigiere den Text eines Schülers (9. Klasse, Thema: Unfallbericht).

WICHTIG – Antworte EXAKT in diesem JSON-Format und NICHTS anderes:
{"corrected": "Der vollständig korrigierte englische Text hier", "changes": "Deutsche Erklärung der Änderungen hier"}

REGELN für "corrected":
- Korrigiere ALLE Rechtschreib- und Grammatikfehler
- Entferne Buchstabensalat/Quatsch/sinnlose Zeichenketten komplett
- Ersetze deutsche Wörter durch englische
- Behalte den Inhalt und Stil des Schülers bei
- Korrekte Groß-/Kleinschreibung und Satzzeichen

REGELN für "changes":
- Kurz auf Deutsch erklären was geändert wurde (max. 3 Sätze)`,
            messages: [{ role: "user", content: studentAnswer }]
        });
        const raw = message.content[0].text;
        try {
            const clean = raw.replace(/```json\s*/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(clean);
            res.json({ corrected: parsed.corrected || studentAnswer, changes: parsed.changes || 'Korrektur durchgeführt.' });
        } catch(parseErr) {
            res.json({ corrected: studentAnswer, changes: raw });
        }
    } catch (error) {
        console.error("Fehler bei /api/korrektur:", error);
        res.status(500).json({ error: "Serverfehler bei der Korrektur." });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`✅ Server läuft auf Port ${PORT}`);
});
