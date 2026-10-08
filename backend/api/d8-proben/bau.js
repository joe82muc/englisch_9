"use strict";

/**
 * Deutsch 8: Bausteine für die Proben-Dateien p1.js bis p8.js in diesem Ordner.
 * Es sind die Bausteine von Deutsch 7 (../d7-proben/bau.js: c, m, o, f/feld, k, z, a/kr, s, text, gedicht, tabelle,
 * diagramm) – hier nur mit den Kennungen von Deutsch 8 (d8-p<nr>-<r|m>-<a|b>).
 *
 * Neu in Deutsch 8 bei s(…) – längerer Text:
 *   extra.form   Schreibform; sie bestimmt das Planungswerkzeug, das das Kind in der Probe bekommt:
 *                "stellungnahme" · "argumentation" (mit Gegenargument und Abwägung, M8) · "zusammenfassung" ·
 *                "inhaltsangabe" · "bericht" · "charakterisierung" · "monolog" · "perspektive" · "brief" ·
 *                "material" (materialgestütztes Schreiben) · "frei"
 *   extra.plan   eigene Planungsfelder statt der Vorgabe der Schreibform: [{ id: "these", label: "Meine Meinung", hilfe: "…" }]
 * Die Planung wird mit der Abgabe aufbewahrt, aber nicht bewertet.
 */

const B = require("../d7-proben/bau");

// Eine Probe: probe(nr, zug, variante, { title, kurz, scope, minutes, hinweis, texte, items })
function probe(nr, zug, variante, inhalt) {
  const id = "d8-p" + nr + "-" + zug.toLowerCase() + "-" + variante.toLowerCase();
  return { id, nr, zug, variante, ...inhalt };
}

module.exports = { ...B, probe };
