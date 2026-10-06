"use strict";

/**
 * Deutsch 7 (7M und 7R): die acht Proben, je viermal – R7 und M7, Variante A und Nachschreiber-Variante B.
 * Lösungen und Erwartungshorizonte bleiben ausschließlich im Backend (nie in das Website-Repo kopieren).
 *
 *   1 Erzählen · 2 Sachtext I · 3 Sachtext II / Zusammenfassung · 4 Argumentieren · 5 Literatur ·
 *   6 Grammatik I · 7 Grammatik II · 8 Rechtschreibung und Sprachtraining
 *
 * Jede Probe steht in einer eigenen Datei im Ordner d7-proben (p1.js … p8.js), jede Datei liefert vier Fassungen
 * mit den Kennungen d7-p<nr>-r-a, -r-b, -m-a, -m-b. Geschrieben werden sie mit den Bausteinen aus d7-proben/bau.js.
 * Variante B hat eigene Texte, Beispielsätze und Aufgaben, aber dieselben Kompetenzen, dieselbe Gesamtpunktzahl und
 * einen ähnlichen Anteil offener Aufgaben (prüft d7-proben-daten.test.js).
 * Aufgaben einer Probe, für die es schon Abgaben gibt, nicht mehr verändern (die Antwortreihenfolge hängt am Text).
 * Texte, Namen und Beispiele der Proben stehen so in keinem Lernmodul.
 */

const fs = require("fs");
const path = require("path");

const PROBEN = {};
// Nur beim Schreiben einer Probe: D7_PROBEN_NUR=3 lädt allein p3.js (die Tests prüfen dann nur diese Probe)
const NUR = Number(process.env.D7_PROBEN_NUR) || 0;
for (let nr = 1; nr <= 8; nr++) {
  const datei = path.join(__dirname, "d7-proben", "p" + nr + ".js");
  if (!fs.existsSync(datei) || (NUR && NUR !== nr)) continue;   // noch nicht geschrieben
  for (const probe of Object.values(require(datei))) {
    if (PROBEN[probe.id]) throw new Error("Deutsch-7-Probe doppelt: " + probe.id);
    PROBEN[probe.id] = probe;
  }
}

module.exports = JSON.parse(JSON.stringify(PROBEN));
// Antwortreihenfolge der Ankreuzaufgaben fest mischen (in den Dateien steht die richtige Antwort vorn)
require("./proben-mischen").mischeAlle(module.exports);
// Fassung wie geschrieben – für Tests und zum Gegenlesen
Object.defineProperty(module.exports, "__vorlage", { value: PROBEN, enumerable: false });
