"use strict";

/**
 * Deutsch 8 (8M und 8R): die acht Proben, je viermal – R8 und M8, Variante A und Nachschreiber-Variante B.
 * Lösungen und Erwartungshorizonte bleiben ausschließlich im Backend (nie in das Website-Repo kopieren).
 *
 *   1 Sachtext und Textverständnis · 2 Argumentieren / Stellungnahme · 3 Literatur und Textanalyse ·
 *   4 Zusammenfassen / informierendes Schreiben · 5 Aufsatz / längerer Schreibtext ·
 *   6 Grammatik und Sprache I · 7 Grammatik und Sprache II · 8 Rechtschreibung, Zeichensetzung, Textüberarbeitung
 *
 * Aufbau wie bei Deutsch 7 (d7-proben-daten.js): Jede Probe steht in einer eigenen Datei im Ordner d8-proben
 * (p1.js … p8.js), jede Datei liefert vier Fassungen mit den Kennungen d8-p<nr>-r-a, -r-b, -m-a, -m-b. Geschrieben
 * werden sie mit den Bausteinen aus d8-proben/bau.js. Die Routen kommen aus d7-proben.js (stufe: 8, /api/d8/proben).
 * Variante B hat eigene Texte, Beispielsätze und Aufgaben, aber dieselben Kompetenzen, dieselbe Gesamtpunktzahl und
 * einen ähnlichen Anteil offener Aufgaben (prüft d8-proben-daten.test.js).
 * Aufgaben einer Probe, für die es schon Abgaben gibt, nicht mehr verändern (die Antwortreihenfolge hängt am Text).
 * Texte, Namen und Beispiele der Proben stehen so in keinem Lernmodul.
 *
 * Eine fehlerhafte Proben-Datei darf den Server nicht am Starten hindern (er trägt alle Fächer): Sie wird ausgelassen
 * und unter __fehler vermerkt. Der Datentest verlangt, dass __fehler leer ist – so fällt es vor dem Hochladen auf.
 */

const fs = require("fs");
const path = require("path");

const PROBEN = {}, FEHLER = [];
// Nur beim Schreiben einer Probe: D8_PROBEN_NUR=3 lädt allein p3.js (die Tests prüfen dann nur diese Probe)
const NUR = Number(process.env.D8_PROBEN_NUR) || 0;
for (let nr = 1; nr <= 8; nr++) {
  const datei = path.join(__dirname, "d8-proben", "p" + nr + ".js");
  if (!fs.existsSync(datei) || (NUR && NUR !== nr)) continue;   // noch nicht geschrieben
  try {
    const fassungen = Object.values(require(datei));
    // jede Fassung einzeln prüfen (dieselbe Prüfung wie beim Start der Routen), an einer Kopie
    const { vorbereiten } = require("./d7-proben");
    fassungen.forEach((probe) => vorbereiten({ [probe.id]: JSON.parse(JSON.stringify(probe)) }, 8));
    for (const probe of fassungen) {
      if (PROBEN[probe.id]) throw new Error("Deutsch-8-Probe doppelt: " + probe.id);
      PROBEN[probe.id] = probe;
    }
  } catch (error) {
    FEHLER.push("p" + nr + ".js: " + (error && error.message));
    console.error("Deutsch 8: Probe " + nr + " wird ausgelassen –", error && error.message);
    Object.keys(PROBEN).forEach((id) => { if (PROBEN[id].nr === nr) delete PROBEN[id]; });
  }
}

module.exports = JSON.parse(JSON.stringify(PROBEN));
// Antwortreihenfolge der Ankreuzaufgaben fest mischen (in den Dateien steht die richtige Antwort vorn)
require("./proben-mischen").mischeAlle(module.exports);
// Fassung wie geschrieben – für Tests und zum Gegenlesen
Object.defineProperty(module.exports, "__vorlage", { value: PROBEN, enumerable: false });
Object.defineProperty(module.exports, "__fehler", { value: FEHLER, enumerable: false });
