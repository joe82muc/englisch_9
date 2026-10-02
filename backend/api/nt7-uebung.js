"use strict";

/**
 * NT 7M: KI-Rueckmeldung zu offenen Uebungsaufgaben (Lernmodul "Luft").
 * Keine Speicherung, keine Noten - nur eine kurze Rueckmeldung fuers Ueben.
 *
 * Route: POST /api/nt7/uebung/feedback
 * Body:  { frage, erwartet, antwort, thema, keywords[], kriterien[]? }
 * Antwort: { ok, richtig, teilweise, rueckmeldung, tipp, quelle }
 *
 * Quali-Training: Mit kriterien[] (Bewertungspunkte, je 1 Punkt) hakt die KI jeden Punkt einzeln ab.
 * Antwort dann zusätzlich { punkte: [0|1, …], summe, max }. Ohne KI fehlt punkte, die Seite prüft selbst.
 *
 * Mehrfach registrierbar (z. B. NT 9, Organische Rohstoffe):
 * opts.route, opts.klasse ("Klasse 9"), opts.thema (Thema im Systemtext).
 */

const { keywordFeedback } = require("./kohlenstoff");

const clean = (value) => String(value || "").trim();

function registerNt7UebungRoutes(app, opts = {}) {
  const askAnthropic = opts.askAnthropic;
  const route = opts.route || "/api/nt7/uebung/feedback";
  const klasse = opts.klasse || "Klasse 7";
  const themaSystem = opts.thema || "Luft";

  app.post(route, async (req, res) => {
    const frage = clean(req.body?.frage).slice(0, 600);
    const erwartet = clean(req.body?.erwartet).slice(0, 1400);
    const antwort = clean(req.body?.antwort).slice(0, 1500);
    const thema = clean(req.body?.thema).slice(0, 160);
    const keywords = Array.isArray(req.body?.keywords) ? req.body.keywords : [];

    if (!frage || antwort.length < 3) {
      return res.json({ ok: true, richtig: false, teilweise: false, rueckmeldung: "Hier fehlt noch eine vollständige Antwort.", tipp: "", quelle: "leer" });
    }

    const kriterien = (Array.isArray(req.body?.kriterien) ? req.body.kriterien : [])
      .map((k) => clean(k).slice(0, 200)).filter(Boolean).slice(0, 12);

    const fallback = () => ({ ok: true, teilweise: false, tipp: "", quelle: "stichworte", ...keywordFeedback(antwort, keywords) });
    if (typeof askAnthropic !== "function") return res.json(fallback());

    if (kriterien.length) {
      const systemQuali = [
        `Du korrigierst eine Quali-Übungsaufgabe in Natur und Technik, ${klasse} einer bayerischen Mittelschule. Thema: ${themaSystem}.`,
        "Für jeden Bewertungspunkt gibt es 1 Punkt, wenn sein Inhalt in der Antwort sinngemäß vorkommt –",
        "auch mit eigenen Worten, in Stichpunkten, in anderer Reihenfolge oder mit Rechtschreibfehlern (auch bei Lese-Rechtschreib-Störung).",
        "Fachbegriffe müssen nicht fallen, wenn die Sache richtig beschrieben ist. Im Zweifel entscheide für das Kind.",
        "0 Punkte nur, wenn der Inhalt fehlt oder fachlich falsch ist. Ein Satz kann mehrere Punkte abdecken.",
        "Die Rückmeldung spricht das Kind mit du an, in einfacher Sprache, höchstens 30 Wörter, und nennt zuerst, was gut war.",
        "Der Tipp sagt, welcher Schritt noch fehlt, ohne die Lösung vorzusagen (höchstens 18 Wörter, leer wenn alles da ist).",
        "Antworte nur als JSON: {\"punkte\": [1, 0, ...], \"rueckmeldung\": \"...\", \"tipp\": \"...\"}",
        "punkte enthält genau eine 0 oder 1 je Bewertungspunkt, in derselben Reihenfolge."
      ].join("\n");
      const userQuali = [
        thema ? `Thema: ${thema}` : "",
        `Aufgabe: ${frage}`,
        "Bewertungspunkte:\n" + kriterien.map((k, i) => `${i + 1}. ${k}`).join("\n"),
        `Antwort des Kindes: ${antwort}`
      ].filter(Boolean).join("\n\n");
      try {
        const raw = await askAnthropic(systemQuali, userQuali, 420);
        const match = String(raw || "").match(/\{[\s\S]*\}/);
        if (!match) throw new Error("invalid_ai_response");
        const parsed = JSON.parse(match[0]);
        const punkte = kriterien.map((_, i) => (Array.isArray(parsed.punkte) && Number(parsed.punkte[i]) >= 1 ? 1 : 0));
        const summe = punkte.reduce((a, b) => a + b, 0), max = kriterien.length;
        return res.json({
          ok: true, punkte, summe, max,
          richtig: summe === max,
          teilweise: summe > 0 && summe < max,
          rueckmeldung: clean(parsed.rueckmeldung).slice(0, 260) || "Antwort geprüft.",
          tipp: summe === max ? "" : clean(parsed.tipp).slice(0, 160),
          quelle: "ki"
        });
      } catch (_error) {
        return res.json(fallback());
      }
    }

    const system = [
      `Du prüfst eine offene Übungsaufgabe in Natur und Technik, ${klasse} einer bayerischen Mittelschule. Thema: ${themaSystem}.`,
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
