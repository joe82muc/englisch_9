"use strict";

/**
 * Deutsch 7: Bausteine für die Proben-Dateien p1.js bis p8.js in diesem Ordner (kurze Schreibweise der Aufgaben).
 * Was die Aufgabenarten bedeuten und wie sie gewertet werden, steht im Kopf von ../d7-proben.js.
 *
 *   c(frage, [optionen], richtige, extra)              Ankreuzen – die richtige Antwort beim Schreiben an Stelle 0, gemischt wird beim Laden
 *   m(frage, [[links, rechts], …], extra)              Zuordnen – rechts dürfen Begriffe mehrfach vorkommen (z. B. Aktiv/Passiv)
 *   o(frage, [schritte in richtiger Folge], extra)     Reihenfolge
 *   f(frage, [feld(…), …], extra)                      kurze Eingaben; feld(label, [lösungen], { genau, rs, zs, punkte, breit })
 *   k(frage, ["Satz mit richtigen Kommas", …], extra)  Kommas setzen (das Kind bekommt die Sätze ohne Kommas)
 *   z(frage, textId, [[von, bis], …], extra)           Zeilenangabe
 *   a(frage, [kr(…), …], beispiel, [stichwörter], extra)   offene Antwort; kr(name, punkte, erwartet, { rs, zs })
 *   s(frage, [kr(…), …], extra)                        längerer Text; extra: { minWoerter, material }
 * extra bei allen: { text: "t1" } = Text, auf den sich die Aufgabe bezieht · { hinweis: "…" } = „Dein nächster Schritt“
 * bei falscher Antwort · { hilfe: "…" } = Hilfe, die das Kind in der Probe sieht (R7: Satzstarter, Wortspeicher).
 * a(…) zusätzlich: { zeilen: [von, bis] } = Ausschnitt des Textes, den die KI zum Korrigieren braucht.
 */

const c = (prompt, options, answer, extra) => ({ type: "choice", prompt, options, answer: answer || 0, ...(extra || {}) });
const m = (prompt, pairs, extra) => ({ type: "match", prompt, pairs, ...(extra || {}) });
const o = (prompt, steps, extra) => ({ type: "order", prompt, steps, ...(extra || {}) });
const feld = (label, loesungen, extra) => ({ label, loesungen: Array.isArray(loesungen) ? loesungen : [loesungen], ...(extra || {}) });
const f = (prompt, felder, extra) => ({ type: "felder", prompt, felder, ...(extra || {}) });
const k = (prompt, saetze, extra) => ({ type: "komma", prompt, saetze, ...(extra || {}) });
const z = (prompt, text, bereiche, extra) => ({ type: "zeile", prompt, text, bereiche, ...(extra || {}) });
const kr = (text, punkte, erwartet, extra) => ({ text, punkte, erwartet: erwartet || "", ...(extra || {}) });
const a = (prompt, kriterien, expected, keywords, extra) => ({ type: "offen", prompt, kriterien, expected, keywords: keywords || [], ...(extra || {}) });
const s = (prompt, raster, extra) => ({ type: "schreiben", prompt, raster: raster.map((r) => ({ name: r.text, text: r.erwartet, punkte: r.punkte, ...(r.rs ? { rs: true } : {}), ...(r.zs ? { zs: true } : {}) })), ...(extra || {}) });

const EIGEN = "Eigenständig für GRUMI erstellt.";
// Lesetext: absaetze (Fließtext, feste Zeilen mit 60 Zeichen) – „# Titel“ als Absatz = Zwischenüberschrift ohne Zeilennummer
const text = (id, titel, art, absaetze, extra) => ({ id, typ: "text", titel, art, absaetze, quelle: EIGEN, ...(extra || {}) });
const gedicht = (id, titel, verse, extra) => ({ id, typ: "gedicht", titel, art: "Gedicht", verse, ...(extra || {}) });
const tabelle = (id, titel, kopf, reihen, extra) => ({ id, typ: "tabelle", titel, art: "Tabelle", kopf, reihen, quelle: EIGEN, ...(extra || {}) });
const diagramm = (id, titel, einheit, werte, extra) => ({ id, typ: "diagramm", titel, art: "Diagramm", einheit, werte, quelle: EIGEN, ...(extra || {}) });

// Eine Probe: probe(nr, zug, variante, { title, kurz, scope, minutes, hinweis, texte, items })
function probe(nr, zug, variante, inhalt) {
  const id = "d7-p" + nr + "-" + zug.toLowerCase() + "-" + variante.toLowerCase();
  return { id, nr, zug, variante, ...inhalt };
}

module.exports = { c, m, o, f, feld, k, z, a, kr, s, text, gedicht, tabelle, diagramm, probe, EIGEN };
