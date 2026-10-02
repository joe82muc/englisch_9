"use strict";

// Alle Proben: Antworten fest gemischt, Lösungen gültig, Reihenfolge nach Neustart gleich
const assert = require("node:assert/strict");
const test = require("node:test");

const DATEIEN = ["infoaustausch-daten", "informatik8-daten", "netzwerktest-daten", "filiuspruefung-daten",
  "grammatik9r-daten", "grammatik7-daten", "nt7-fragen", "nt9-probe-daten"];
const laden = (f) => { const m = require("./" + f); return m.TESTS || m; };

test("Jede Probe: Lösungen zeigen auf eine vorhandene Option", () => {
  for (const f of DATEIEN) for (const p of Object.values(laden(f))) for (const it of p.items) {
    if (it.type === "choice" && Array.isArray(it.options)) assert.ok(Number.isInteger(it.answer) && it.answer >= 0 && it.answer < it.options.length, p.id + ": " + it.prompt);
    if (it.type === "match" && it.rows) it.rows.forEach((r) => assert.ok(r.answer >= 0 && r.answer < it.options.length, p.id + ": " + it.prompt));
  }
});

test("Größere Proben: die richtige Antwort liegt nicht gehäuft an einer Stelle", () => {
  for (const f of DATEIEN) for (const p of Object.values(laden(f))) {
    const ankreuzen = p.items.filter((it) => it.type === "choice" && Array.isArray(it.options));
    if (ankreuzen.length < 8) continue;
    const k = Math.min(...ankreuzen.map((it) => it.options.length)), zahl = new Array(k).fill(0);
    ankreuzen.forEach((it) => { if (it.answer < k) zahl[it.answer]++; });
    assert.ok(Math.max(...zahl) - Math.min(...zahl) <= 1, p.id + ": " + zahl.join("/"));
  }
});

test("Reihenfolge ist nach einem Neustart dieselbe", () => {
  for (const f of DATEIEN) {
    const vorher = JSON.stringify(laden(f));
    delete require.cache[require.resolve("./" + f)];
    assert.equal(JSON.stringify(laden(f)), vorher, f);
  }
});
