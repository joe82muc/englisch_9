/* Deutsch 7: Zeilen eines Lesetextes.
 *
 * Lesetexte bekommen Zeilennummern, und die Aufgaben fragen nach Textstellen („Z. 12–14“). Damit Zeile 12 auf jedem
 * Gerät dieselbe Stelle ist, wird hier nach einer festen Zeichenzahl umbrochen – nicht nach der Breite des Bildschirms.
 * Dieselbe Datei liegt auf der Website (7M/Deutsch/d7-zeilen.js, für die Texte der Module) und auf dem Server
 * (backend/api/d7-zeilen.js, für die Texte der Proben). Beide Kopien müssen gleich bleiben.
 *
 * Text: { absaetze: ["…", "…"] }   Fließtext; ein Absatz, der mit „# “ beginnt, ist eine Zwischenüberschrift (ohne Nummer)
 *       { verse: ["…", "", "…"] }  Gedicht: jede Zeile bleibt, wie sie ist; "" = neue Strophe
 * umbrechen(text) -> [{ n: Zeilennummer (0 = Zwischenüberschrift), t: Text, neu: beginnt Absatz/Strophe, kopf?: true }]
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.D7Zeilen = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  var BREITE = 60;

  function umbrechen(text, breite) {
    var b = breite || (text && text.breite) || BREITE, out = [], n = 0;
    if (!text) return out;
    if (Array.isArray(text.verse)) {
      var neu = true;
      text.verse.forEach(function (v) {
        v = String(v == null ? "" : v).trim();
        if (!v) { neu = true; return; }
        out.push({ n: ++n, t: v, neu: neu }); neu = false;
      });
      return out;
    }
    (text.absaetze || []).forEach(function (absatz) {
      absatz = String(absatz == null ? "" : absatz).trim();
      if (!absatz) return;
      if (absatz.indexOf("# ") === 0) { out.push({ n: 0, t: absatz.slice(2).trim(), neu: true, kopf: true }); return; }
      var zeile = "", erste = true;
      absatz.split(/\s+/).forEach(function (w) {
        if (zeile && (zeile + " " + w).length > b) { out.push({ n: ++n, t: zeile, neu: erste }); erste = false; zeile = w; }
        else zeile = zeile ? zeile + " " + w : w;
      });
      if (zeile) out.push({ n: ++n, t: zeile, neu: erste });
    });
    return out;
  }

  // Zahl der Textzeilen (ohne Zwischenüberschriften)
  function anzahl(zeilen) { return zeilen.reduce(function (m, z) { return Math.max(m, z.n); }, 0); }

  // Ausschnitt als nummerierter Text, eine Zeile je Textzeile: „12  Text der Zeile“ (für die KI und zum Gegenlesen)
  function nummeriert(zeilen, von, bis) {
    return zeilen.filter(function (z) { return z.kopf ? (!von && !bis) : (!von || z.n >= von) && (!bis || z.n <= bis); })
      .map(function (z) { return z.kopf ? "[" + z.t + "]" : (z.n < 10 ? " " : "") + z.n + "  " + z.t; }).join("\n");
  }

  // Wörter zählen (für Metadaten und Mindestlängen)
  function woerter(s) {
    if (s && typeof s === "object") s = (s.absaetze || s.verse || []).filter(function (a) { return String(a).indexOf("# ") !== 0; }).join(" ");
    var m = String(s || "").match(/[A-Za-zÄÖÜäöüßÀ-ÿ0-9][A-Za-zÄÖÜäöüßÀ-ÿ0-9'’\-]*/g);
    return m ? m.length : 0;
  }

  return { BREITE: BREITE, umbrechen: umbrechen, anzahl: anzahl, nummeriert: nummeriert, woerter: woerter };
});
