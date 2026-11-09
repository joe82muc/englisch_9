"use strict";

/**
 * Englisch 7 (7M und 7R): Bausteine für die großen Proben in diesem Ordner (p1.js …, eine Probe je Unit).
 * Es sind die Bausteine von Englisch 9 (../e9-proben/bau.js: Deutsch-7-Bausteine plus hoertext und teil) – hier mit
 * den Kennungen von Englisch 7: e7-p<nr>-<r|m>-<a|b>.
 *
 * 7M und 7R schreiben dieselben Aufgaben. Es gibt trotzdem zwei Fassungen je Probe (Zug R und Zug M): So schaltet die
 * Lehrkraft je Klasse frei, und die Note folgt dem Zug der Fassung (M: 50 % = Note 4, R: 50 % = Note 3).
 */

const B = require("../e9-proben/bau");

// probe7(nr, zug, variante, { title, kurz, scope, minutes, hinweis, texte, items })
function probe7(nr, zug, variante, inhalt) {
  const id = "e7-p" + nr + "-" + zug.toLowerCase() + "-" + variante.toLowerCase();
  return { id, nr, zug, variante, ...inhalt };
}

module.exports = { ...B, probe7 };
