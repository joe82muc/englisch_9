"use strict";

/**
 * NT 7M: KI-Rueckmeldung zu offenen Uebungsaufgaben (Lernmodul "Luft").
 * Keine Speicherung, keine Noten - nur eine kurze Rueckmeldung fuers Ueben.
 *
 * Route: POST /api/nt7/uebung/feedback
 * Body:  { frage, erwartet, antwort, thema, keywords[] }
 * Antwort: { ok, richtig, teilweise, rueckmeldung, tipp, quelle }
 */

const { keywordFeedback } = require("./kohlenstoff");

const clean = (value) => String(value || "").trim();

function registerNt7UebungRoutes(app, opts = {}) {
  const askAnthropic = opts.askAnthropic;

  app.post("/api/nt7/uebung/feedback", async (req, res) => {
    const frage = clean(req.body?.frage).slice(0, 600);
    const erwartet = clean(req.body?.erwartet).slice(0, 1400);
    const antwort = clean(req.body?.antwort).slice(0, 1500);
    const thema = clean(req.body?.thema).slice(0, 160);
    const keywords = Array.isArray(req.body?.keywords) ? req.body.keywords : [];

    if (!frage || antwort.length < 3) {
      return res.json({ ok: true, richtig: false, teilweise: false, rueckmeldung: "Hier fehlt noch eine vollständige Antwort.", tipp: "", quelle: "leer" });
    }

    const fallback = () => ({ ok: true, teilweise: false, tipp: "", quelle: "stichworte", ...keywordFeedback(antwort, keywords) });
    if (typeof askAnthropic !== "function") return res.json(fallback());

    const system = [
      "Du prüfst eine offene Übungsaufgabe in Natur und Technik, Klasse 7 einer bayerischen Mittelschule. Thema: Luft.",
      "Bewerte nur den fachlichen Inhalt. Rechtschreibung, Grammatik und Stil zählen nicht. Eigene Worte und Stichpunkte sind erlaubt.",
      "Sei wohlwollend, aber fachlich korrekt. Falsche Aussagen nicht belohnen.",
      "richtig = alle wichtigen Inhalte da. teilweise = Ansatz stimmt, etwas Wichtiges fehlt.",
      "Die Rückmeldung spricht das Kind mit du an, in einfacher Sprache, höchstens 25 Wörter.",
      "Der Tipp verrät nicht die ganze Lösung, sondern gibt einen Denkanstoß (höchstens 15 Wörter, leer wenn richtig).",
      "Antworte nur als JSON: {\"richtig\": false, \"teilweise\": true, \"rueckmeldung\": \"...\", \"tipp\": \"...\"}"
    ].join("\n");

    const user = [
      thema ? `Thema: ${thema}` : "",
      `Aufgabe: ${frage}`,
      `Erwartete Inhalte: ${erwartet}`,
      `Antwort des Kindes: ${antwort}`
    ].filter(Boolean).join("\n\n");

    try {
      const raw = await askAnthropic(system, user, 260);
      const match = String(raw || "").match(/\{[\s\S]*\}/);
      if (!match) throw new Error("invalid_ai_response");
      const parsed = JSON.parse(match[0]);
      const richtig = Boolean(parsed.richtig);
      return res.json({
        ok: true,
        richtig,
        teilweise: !richtig && Boolean(parsed.teilweise),
        rueckmeldung: clean(parsed.rueckmeldung).slice(0, 220) || "Antwort geprüft.",
        tipp: richtig ? "" : clean(parsed.tipp).slice(0, 140),
        quelle: "ki"
      });
    } catch (_error) {
      return res.json(fallback());
    }
  });
}

module.exports = { registerNt7UebungRoutes };
