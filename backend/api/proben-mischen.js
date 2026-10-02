"use strict";

/**
 * Antwortreihenfolge in Proben fest mischen.
 *
 * In den *-daten.js-Dateien steht die richtige Antwort beim Schreiben meist an derselben Stelle
 * (oft A oder B). Die Proben-Module liefern die Optionen genau in dieser Reihenfolge aus, Kinder würden
 * das schnell merken. Deshalb wird beim Laden gemischt:
 *   - choice: Optionen mischen, answer (Index) wird umgerechnet
 *   - match mit rows/options: Optionen mischen, jede rows[].answer wird umgerechnet
 * Der Zufall hängt nur an Proben-Kennung, Aufgabennummer und Aufgabentext. Die Reihenfolge ist also nach
 * jedem Neustart dieselbe – wichtig, weil gespeicherte Antworten Indizes sind. Darum auch: Aufgaben einer
 * Probe, für die es schon Abgaben gibt, nicht mehr verändern.
 * Ein „Salz“ wird so gewählt, dass die richtige Antwort etwa gleich oft auf A, B, C (und D) liegt.
 */

function zufall(text) {
  let h = 2166136261;
  for (const ch of text) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); }
  return () => {
    h = (h + 0x6D2B79F5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function reihenfolge(test, it, nr, salz) {
  const rnd = zufall(test.id + "|" + salz + "|" + nr + "|" + it.prompt);
  const idx = it.options.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  return idx;
}

const istAnkreuzen = (it) => it.type === "choice" && Array.isArray(it.options) && Number.isInteger(it.answer);
const istZuordnen = (it) => it.type === "match" && Array.isArray(it.options) && Array.isArray(it.rows);

function mischen(test) {
  // eigene Kopien: dieselbe Aufgabe kann in mehreren Proben stecken
  test.items = test.items.map((it) => {
    const kopie = { ...it };
    if (Array.isArray(it.options)) kopie.options = [...it.options];
    if (Array.isArray(it.rows)) kopie.rows = it.rows.map((r) => ({ ...r }));
    return kopie;
  });
  const ankreuzen = test.items.map((it, nr) => ({ it, nr })).filter(({ it }) => istAnkreuzen(it));
  let salz = 0;
  if (ankreuzen.length) {
    const k = Math.min(...ankreuzen.map(({ it }) => it.options.length));
    let beste = Infinity;
    for (let s = 0; s < 500; s++) {
      const zahl = new Array(k).fill(0);
      ankreuzen.forEach(({ it, nr }) => { const p = reihenfolge(test, it, nr, s).indexOf(it.answer); if (p < k) zahl[p]++; });
      const spanne = Math.max(...zahl) - Math.min(...zahl);
      if (spanne < beste) { beste = spanne; salz = s; }
      if (spanne <= 1) break;
    }
  }
  test.items.forEach((it, nr) => {
    if (!istAnkreuzen(it) && !istZuordnen(it)) return;
    const idx = reihenfolge(test, it, nr, salz);
    it.options = idx.map((i) => it.options[i]);
    if (istAnkreuzen(it)) it.answer = idx.indexOf(it.answer);
    else it.rows = it.rows.map((r) => ({ ...r, answer: idx.indexOf(r.answer) }));
  });
  return test;
}

// alle Proben eines Objekts { id: probe } mischen; gibt dasselbe Objekt zurück
function mischeAlle(tests) {
  Object.values(tests).forEach(mischen);
  return tests;
}

module.exports = { mischen, mischeAlle };
