"use strict";

/**
 * Englisch 9R: Bausteine für die großen Proben p1.js bis p4.js in diesem Ordner (eine Probe je Unit).
 * Es sind die Bausteine von Deutsch 7/8 (../d7-proben/bau.js: c, m, o, f/feld, a/kr, s, z, text, tabelle) – hier mit
 * den Kennungen von Englisch 9 (e9-p<nr>-r-<a|b>) und dazu:
 *
 *   hoertext(id, titel, art, [["Rolle", "Satz. Satz."], …], { stimmen: { Rolle: "en-GB-SoniaNeural" }, mal: 2 })
 *       Hörtext: Die Seite spielt ihn höchstens „mal“-mal ab (Vorgabe 2) und zeigt ihn nicht an. Jeder Satz höchstens
 *       220 Zeichen, Zahlen und Uhrzeiten ausgeschrieben. Stimmen: en-GB-SoniaNeural, en-GB-RyanNeural,
 *       en-GB-LibbyNeural, en-US-GuyNeural, en-US-JennyNeural.
 *   teil(name, [aufgaben])   setzt an jede Aufgabe den Prüfungsteil ("A Listening", "B Reading", "C Grammar and
 *       vocabulary", "D Mediation", "E Writing") – die Seite schreibt davor eine Überschrift.
 *   extra.tolerant: true an f(…) oder feld(…): ein Tippfehler in einem längeren Wort zählt nicht (Notizen beim Hören).
 *
 * Lösungen und Erwartungshorizonte bleiben auf dem Server. Texte, Hörtexte, Namen und Situationen der Proben stehen
 * in keinem Lernmodul und stammen nicht aus dem Schulbuch oder aus Prüfungen.
 */

const B = require("../d7-proben/bau");

const hoertext = (id, titel, art, zeilen, extra) => ({ id, typ: "hoertext", titel, art, sprecher: zeilen.map((z) => ({ rolle: z[0], text: z[1] })), quelle: B.EIGEN, ...(extra || {}) });
const teil = (name, aufgaben) => aufgaben.map((x) => ({ ...x, teil: name }));

// Eine Probe: probe(nr, variante, { title, kurz, scope, minutes, hinweis, texte, items }) – Englisch 9R hat nur den R-Zug
function probe(nr, variante, inhalt) {
  const id = "e9-p" + nr + "-r-" + variante.toLowerCase();
  return { id, nr, zug: "R", variante, ...inhalt };
}

module.exports = { ...B, hoertext, teil, probe };
