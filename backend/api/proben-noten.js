"use strict";

/**
 * Notenübersicht je Klasse: alle Proben-Abgaben mit Code aus allen Proben-Modulen.
 * Die Klasse kommt aus dem Lernfortschritt (aktuelle Klasse des Codes), damit Noten nach dem
 * Umbenennen einer Klasse (9M -> 9aM) beim Kind bleiben. Namen kennt nur die Lehrkraft.
 *
 * POST /api/proben/noten { password, klasse }
 *   -> { ok, klasse, noten: [{ id, modul, fach, testId, titel, code, note, punkte, max, prozent,
 *                              datum, abgabe, nachpruefen, lrs, verlassen, zurueck, geoeffnet, sichtbarBis?, vorbei? }] }
 *   (zurueck / geoeffnet: wann die korrigierte Probe an das Kind zurückgegeben und von ihm geöffnet wurde – proben-rueckgabe.js;
 *    sichtbarBis / vorbei: 7 Tage nach der Rückgabe verschwindet sie beim Kind von selbst)
 *   (lrs: mit Notenschutz LRS gewertet; verlassen: so oft hat das Kind die Probe verlassen)
 */
const crypto = require("crypto");

function registerProbenNotenRoutes(app, options) {
  const teacherPassword = String(options.teacherPassword || "");
  const quellen = options.quellen || [];          // [{ modul, fach, abgaben: () => [...] }]
  const kindZumCode = options.kindZumCode;        // (code) -> { code, klasse } | null
  const rueckgabe = options.rueckgabe || (() => null);   // (modul, abgabe) -> { freigegebenAm, geoeffnetAm } | null

  function lehrerOk(req, res) {
    const given = Buffer.from(String((req.body && req.body.password) || "").slice(0, 200));
    const expected = Buffer.from(teacherPassword);
    if (!teacherPassword || given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) {
      res.status(401).json({ ok: false, error: "Das Passwort stimmt nicht." });
      return false;
    }
    return true;
  }

  app.post("/api/proben/noten", async (req, res) => {
    if (!lehrerOk(req, res)) return;
    const klasse = String((req.body && req.body.klasse) || "").trim();
    if (!klasse) return res.status(400).json({ ok: false, error: "Klasse fehlt." });
    try {
      const klasseVon = new Map();
      const noten = [];
      for (const q of quellen) {
        for (const r of q.abgaben() || []) {
          if (!r || !r.code) continue;
          if (!klasseVon.has(r.code)) {
            const kind = await kindZumCode(r.code);
            klasseVon.set(r.code, kind ? kind.klasse : "");
          }
          // Gelöschter Code: dann zählt die Klasse beim Abgeben
          if ((klasseVon.get(r.code) || r.className) !== klasse) continue;
          const zurueck = rueckgabe(q.modul, r);
          noten.push({
            id: r.id, modul: q.modul, fach: q.fach, testId: r.testId, titel: r.testTitle || r.testId,
            code: r.code, note: r.grade, punkte: r.score, max: r.total, prozent: r.percent,
            datum: r.testDate || String(r.submittedAt || "").slice(0, 10), abgabe: r.submittedAt,
            nachpruefen: Boolean(r.needsReview), lrs: Boolean(r.lrs), verlassen: Number(r.verlassen) || 0,
            zurueck: zurueck ? zurueck.freigegebenAm || "" : "", geoeffnet: zurueck ? zurueck.geoeffnetAm || "" : "",
            // sichtbarBis: letzter Tag, an dem das Kind die Probe sieht; vorbei: Frist um, beim Kind verschwunden
            ...(zurueck && zurueck.sichtbarBis ? { sichtbarBis: zurueck.sichtbarBis } : {}), ...(zurueck && zurueck.vorbei ? { vorbei: true } : {})
          });
        }
      }
      noten.sort((a, b) => String(a.datum).localeCompare(String(b.datum)) || a.titel.localeCompare(b.titel, "de") || a.code.localeCompare(b.code));
      res.json({ ok: true, klasse, noten });
    } catch (error) {
      console.error("Notenübersicht:", error.message);
      res.status(503).json({ ok: false, error: "Die Codes sind gerade nicht erreichbar. Versuch es gleich noch einmal." });
    }
  });
}

module.exports = { registerProbenNotenRoutes };
