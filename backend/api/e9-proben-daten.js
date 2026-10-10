"use strict";

/**
 * Englisch 9R: die vier großen Proben – eine je Unit, je in Variante A und Nachschreiber-Variante B.
 * Lösungen und Erwartungshorizonte bleiben ausschließlich im Backend (nie in das Website-Repo kopieren).
 *
 *   1 Unit 1 Around Australia · 2 Unit 2 Exploring India · 3 Unit 3 Discover South Africa · 4 Unit 4 News from New Zealand
 *   Teile jeder Probe: A Listening · B Reading · C Grammar and vocabulary · D Mediation · E Writing
 *
 * Aufbau wie bei Deutsch 8 (d8-proben-daten.js): Jede Probe steht in einer eigenen Datei im Ordner e9-proben
 * (p1.js … p4.js), jede Datei liefert zwei Fassungen mit den Kennungen e9-p<nr>-r-a und e9-p<nr>-r-b. Geschrieben
 * werden sie mit den Bausteinen aus e9-proben/bau.js. Die Routen kommen aus d7-proben.js (stufe: 9, fach Englisch,
 * /api/e9/proben). Variante B hat eigene Texte, Hörtexte und Aufgaben, aber dieselben Kompetenzen, dieselbe
 * Gesamtpunktzahl und dieselbe Punktzahl je Teil (prüft e9-proben-daten.test.js).
 * Aufgaben einer Probe, für die es schon Abgaben gibt, nicht mehr verändern (die Antwortreihenfolge hängt am Text).
 *
 * Eine fehlerhafte Proben-Datei darf den Server nicht am Starten hindern (er trägt alle Fächer): Sie wird ausgelassen
 * und unter __fehler vermerkt. Der Datentest verlangt, dass __fehler leer ist – so fällt es vor dem Hochladen auf.
 */

const fs = require("fs");
const path = require("path");

const PROBEN = {}, FEHLER = [];
// Nur beim Schreiben einer Probe: E9_PROBEN_NUR=2 lädt allein p2.js (die Tests prüfen dann nur diese Probe)
const NUR = Number(process.env.E9_PROBEN_NUR) || 0;
for (let nr = 1; nr <= 4; nr++) {
  const datei = path.join(__dirname, "e9-proben", "p" + nr + ".js");
  if (!fs.existsSync(datei) || (NUR && NUR !== nr)) continue;   // noch nicht geschrieben
  try {
    const fassungen = Object.values(require(datei));
    // jede Fassung einzeln prüfen (dieselbe Prüfung wie beim Start der Routen), an einer Kopie
    const { vorbereiten } = require("./d7-proben");
    fassungen.forEach((probe) => vorbereiten({ [probe.id]: JSON.parse(JSON.stringify(probe)) }, 9, "e"));
    for (const probe of fassungen) {
      if (PROBEN[probe.id]) throw new Error("Englisch-9-Probe doppelt: " + probe.id);
      PROBEN[probe.id] = probe;
    }
  } catch (error) {
    FEHLER.push("p" + nr + ".js: " + (error && error.message));
    console.error("Englisch 9: Probe " + nr + " wird ausgelassen –", error && error.message);
    Object.keys(PROBEN).forEach((id) => { if (PROBEN[id].nr === nr) delete PROBEN[id]; });
  }
}

module.exports = JSON.parse(JSON.stringify(PROBEN));
// Antwortreihenfolge der Ankreuzaufgaben fest mischen (in den Dateien steht die richtige Antwort vorn)
require("./proben-mischen").mischeAlle(module.exports);
// Fassung wie geschrieben – für Tests und zum Gegenlesen
Object.defineProperty(module.exports, "__vorlage", { value: PROBEN, enumerable: false });
Object.defineProperty(module.exports, "__fehler", { value: FEHLER, enumerable: false });
