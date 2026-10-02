"use strict";

// NT 9 Probe Organische Rohstoffe: Umfang, gültige Lösungen, gemischte Antworten
const assert = require("node:assert/strict");
const test = require("node:test");
const { TESTS } = require("./nt9-probe-daten");

const punkte = (t) => t.items.reduce((s, it) => s + (it.type === "match" ? it.rows.length : it.points), 0);

test("Je eine ausführliche Fassung für 9M und 9R mit allen sieben Modulen", () => {
  assert.deepEqual(Object.keys(TESTS).sort(), ["nt9m-probe1", "nt9r-probe1"]);
  for (const t of Object.values(TESTS)) {
    assert.ok(t.items.length >= 35, t.id + ": mindestens 35 Aufgaben");
    for (let m = 1; m <= 7; m++) assert.ok(t.items.filter((it) => it.teil.startsWith("Modul " + m + " ")).length >= 4, t.id + ": Modul " + m + " mit mindestens 4 Aufgaben");
    assert.ok(t.items.some((it) => it.teil.startsWith("Transfer")), t.id + ": Transfer");
  }
  assert.equal(punkte(TESTS["nt9m-probe1"]), 72);
  assert.equal(punkte(TESTS["nt9r-probe1"]), 69);
  assert.ok(TESTS["nt9r-probe1"].items.filter((it) => it.type === "text").length < TESTS["nt9m-probe1"].items.filter((it) => it.type === "text").length, "9R mit weniger Erklär-Aufgaben");
});

test("Lösungen gültig, richtige Antwort nicht immer an derselben Stelle", () => {
  for (const t of Object.values(TESTS)) {
    const stelle = [0, 0, 0, 0];
    for (const it of t.items) {
      if (it.type === "choice") { assert.ok(it.answer >= 0 && it.answer < it.options.length, t.id + ": " + it.prompt); stelle[it.answer]++; }
      if (it.type === "match") it.rows.forEach((r) => assert.ok(r.answer >= 0 && r.answer < it.options.length, t.id + ": " + it.prompt));
      if (it.type === "text") assert.ok(it.expected && it.kriterien && it.keywords.length && it.points >= 2, t.id + ": " + it.prompt);
    }
    assert.ok(Math.max(...stelle) - Math.min(...stelle) <= 1, t.id + ": A/B/C/D etwa gleich oft richtig (" + stelle.join("/") + ")");
  }
  // Die Verwendung von Erdöl: Zuordnung bleibt fachlich richtig, auch wenn die Optionen gemischt sind
  const v = TESTS["nt9m-probe1"].items.find((it) => it.prompt.startsWith("Das Diagramm zeigt"));
  assert.deepEqual(v.rows.map((r) => v.options[r.answer]), ["Heizung", "Verkehr", "Energiegewinnung"]);
});

test("Reihenfolge ist nach einem Neustart dieselbe", () => {
  const vorher = JSON.stringify(TESTS);
  delete require.cache[require.resolve("./nt9-probe-daten")];
  assert.equal(JSON.stringify(require("./nt9-probe-daten").TESTS), vorher);
});
