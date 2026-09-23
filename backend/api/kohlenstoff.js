"use strict";

const clean = (value) => String(value || "").trim();

function normalizeText(value) {
  return clean(value)
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[.,;:!?"'`()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function keywordFeedback(answer, keywords) {
  const text = normalizeText(answer);
  const normalizedKeywords = (Array.isArray(keywords) ? keywords : [])
    .map(normalizeText)
    .filter(Boolean)
    .slice(0, 12);

  if (text.length < 8) {
    return { richtig: false, rueckmeldung: "Die Antwort ist noch zu kurz." };
  }
  if (!normalizedKeywords.length) {
    return { richtig: text.length >= 40, rueckmeldung: "Begründe deine Antwort noch genauer mit Fachbegriffen." };
  }

  const hits = normalizedKeywords.filter((keyword) => text.includes(keyword)).length;
  const needed = Math.min(2, normalizedKeywords.length);
  return hits >= needed
    ? { richtig: true, rueckmeldung: "Die zentralen Fachinhalte sind enthalten." }
    : { richtig: false, rueckmeldung: "Ergänze noch passende Fachbegriffe und den Zusammenhang." };
}

function registerKohlenstoffRoutes(app, opts = {}) {
  const askAnthropic = opts.askAnthropic;

  app.post("/api/kohlenstoff/feedback", async (req, res) => {
    const frage = clean(req.body?.frage).slice(0, 600);
    const erwartet = clean(req.body?.erwartet).slice(0, 1400);
    const antwort = clean(req.body?.antwort).slice(0, 1800);
    const thema = clean(req.body?.thema).slice(0, 160);
    const keywords = Array.isArray(req.body?.keywords) ? req.body.keywords : [];

    if (!frage || antwort.length < 3) {
      return res.json({ ok: true, richtig: false, rueckmeldung: "Hier fehlt noch eine vollständige Antwort." });
    }

    if (typeof askAnthropic !== "function") {
      return res.json({ ok: true, ...keywordFeedback(antwort, keywords) });
    }

    const system = [
      "Du prüfst eine offene Natur-und-Technik-Aufgabe der 9. Klasse einer bayerischen Mittelschule.",
      "Das Thema ist Organische Rohstoffe: Holz, Raps, Stärke, Nachhaltigkeit, fossile Rohstoffe, Erdölaufbereitung oder Kohlenstoffkreislauf.",
      "Bewerte nur den fachlichen Inhalt. Rechtschreibung, Grammatik und Stil zählen nicht.",
      "Eigene Worte und Stichpunkte sind erlaubt. Bewerte wohlwollend, aber fachlich korrekt.",
      "Antworte nur als JSON: {\"richtig\": true, \"rueckmeldung\": \"höchstens 20 Wörter\"}"
    ].join("\n");

    const user = [
      thema ? `Thema: ${thema}` : "",
      `Aufgabe: ${frage}`,
      `Erwartete Inhalte: ${erwartet}`,
      `Antwort: ${antwort}`
    ].filter(Boolean).join("\n\n");

    try {
      const raw = await askAnthropic(system, user, 220);
      const match = String(raw || "").match(/\{[\s\S]*\}/);
      if (!match) throw new Error("invalid_ai_response");
      const parsed = JSON.parse(match[0]);
      return res.json({
        ok: true,
        richtig: Boolean(parsed.richtig),
        rueckmeldung: clean(parsed.rueckmeldung).slice(0, 180) || "Antwort geprüft."
      });
    } catch (_error) {
      return res.json({ ok: true, ...keywordFeedback(antwort, keywords) });
    }
  });
}

module.exports = { registerKohlenstoffRoutes, keywordFeedback, normalizeText };
