"use strict";

/**
 * NT 8 (8M und 8R): alle Proben. Je Themenbereich EINE Probe über seine Module, 30 bis 40 Minuten, in vier Fassungen:
 *   nt8-<bereich>-r-a   Regelklasse, Variante A        nt8-<bereich>-m-a   M-Klasse, Variante A
 *   nt8-<bereich>-r-b   Regelklasse, Nachschreibprobe  nt8-<bereich>-m-b   M-Klasse, Nachschreibprobe
 * Die Aufgaben stehen in nt8-block-<bereich>.js (eine Datei je Themenbereich; fehlt sie, gibt es die Probe noch nicht).
 * Hier wird ergänzt, was sich aus der Kennung ergibt: zug, variante, gruppe (beide Varianten einer Probe – wer eine
 * abgegeben hat, kann die andere nicht mehr beginnen), thema und bei jeder Aufgabe der Titel ihres Moduls.
 * Lösungen und Erwartungshorizonte bleiben auf dem Server.
 */
const fs = require("fs");
const path = require("path");
const { TITEL, BEREICHE } = require("./nt8-module");

const tests = {};
Object.keys(BEREICHE).forEach((bereich) => {
  if (!fs.existsSync(path.join(__dirname, "nt8-block-" + bereich + ".js"))) return;
  // als Kopie: Das Mischen verändert die Aufgaben, die Vorlage bleibt unberührt
  const proben = JSON.parse(JSON.stringify(require("./nt8-block-" + bereich)));
  Object.keys(proben).forEach((id) => {
    const m = /^nt8-([a-z]+)-([rm])-([ab])$/.exec(id), probe = proben[id];
    if (!m || m[1] !== bereich) throw new Error("NT 8: unerwartete Proben-Kennung " + id + " in nt8-block-" + bereich + ".js");
    Object.assign(probe, { id, zug: m[2].toUpperCase(), variante: m[3].toUpperCase(), gruppe: "nt8-" + bereich + "-" + m[2], thema: bereich });
    probe.items.forEach((item) => { item.modulTitel = TITEL[item.modul] || ""; });
    tests[id] = probe;
  });
});

// Antwortreihenfolge der Ankreuzaufgaben fest mischen (beim Schreiben steht die richtige Antwort vorn), siehe proben-mischen.js
require("./proben-mischen").mischeAlle(tests);

module.exports = tests;
