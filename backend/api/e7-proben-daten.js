"use strict";

/**
 * Englisch 7 (7M und 7R): die großen Proben – eine je Unit (bisher Probe 1: Unit 1 Out and about in England).
 * Lösungen und Erwartungshorizonte bleiben ausschließlich im Backend (nie in das Website-Repo kopieren).
 *
 * Aufbau wie Englisch 9 (e9-proben-daten.js): Jede Probe steht in einer eigenen Datei im Ordner e7-proben (p1.js …),
 * geschrieben mit den Bausteinen aus e7-proben/bau.js. Jede Datei liefert die Fassungen e7-p<nr>-r-a (7R) und
 * e7-p<nr>-m-a (7M) mit denselben Aufgaben – zwei Kennungen, damit je Klasse freigeschaltet wird und die Note dem Zug
 * folgt (M: 50 % = Note 4, R: 50 % = Note 3). Die Routen kommen aus d7-proben.js (stufe: 7, fach Englisch,
 * /api/e7/proben, Hörtext zentral wie bei Englisch 9).
 * Aufgaben einer Probe, für die es schon Abgaben gibt, nicht mehr verändern (die Antwortreihenfolge hängt am Text).
 *
 * Eine fehlerhafte Proben-Datei darf den Server nicht am Starten hindern (er trägt alle Fächer): Sie wird ausgelassen
 * und unter __fehler vermerkt. Der Datentest verlangt, dass __fehler leer ist – so fällt es vor dem Hochladen auf.
 */

const fs = require("fs");
const path = require("path");

const PROBEN = {}, FEHLER = [];
for (const nr of [1, 2, 3, 4]) {
  const datei = path.join(__dirname, "e7-proben", "p" + nr + ".js");
  if (!fs.existsSync(datei)) continue;   // noch nicht geschrieben
  try {
    const fassungen = Object.values(require(datei));
    const { vorbereiten } = require("./d7-proben");
    fassungen.forEach((probe) => vorbereiten({ [probe.id]: JSON.parse(JSON.stringify(probe)) }, 7, "e"));
    for (const probe of fassungen) {
      if (PROBEN[probe.id]) throw new Error("Englisch-7-Probe doppelt: " + probe.id);
      PROBEN[probe.id] = probe;
    }
  } catch (error) {
    FEHLER.push("p" + nr + ".js: " + (error && error.message));
    console.error("Englisch 7: Probe " + nr + " wird ausgelassen –", error && error.message);
    Object.keys(PROBEN).forEach((id) => { if (PROBEN[id].nr === nr) delete PROBEN[id]; });
  }
}

module.exports = JSON.parse(JSON.stringify(PROBEN));
// Antwortreihenfolge der Ankreuzaufgaben fest mischen (in den Dateien steht die richtige Antwort vorn)
require("./proben-mischen").mischeAlle(module.exports);
// Fassung wie geschrieben – für Tests und zum Gegenlesen
Object.defineProperty(module.exports, "__vorlage", { value: PROBEN, enumerable: false });
Object.defineProperty(module.exports, "__fehler", { value: FEHLER, enumerable: false });
