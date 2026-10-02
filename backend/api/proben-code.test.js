"use strict";

// Proben mit Code statt Namen und Notenübersicht je Klasse
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const express = require("express");
const { registerVokabeltestRoutes } = require("./vokabeltest");
const { registerProbenNotenRoutes } = require("./proben-noten");

const TESTS = {
  "e7m-u1-a": { id: "e7m-u1-a", title: "Unit 1 A", unit: 1, classLevel: 7, items: [
    { prompt: "Hund", solutions: ["dog"], direction: "de-en" },
    { prompt: "Katze", solutions: ["cat"], direction: "de-en" }
  ] }
};
// Wie im Lernfortschritt: Code -> aktuelle Klasse (umbenennbar)
const klassen = new Map([["123", "7aM"], ["456", "7aM"], ["789", "7b"], ["321", "7b"], ["555", "7dM"], ["556", "7dM"]]);
const lrs = new Set(["555"]);
const kindZumCode = async (code) => (klassen.has(code) ? { code, klasse: klassen.get(code), lrs: lrs.has(code) } : null);

let server, basis, dataDir;
test.before(async () => {
  dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "proben-code-"));
  const app = express();
  app.use(express.json());
  const vokabeltest = registerVokabeltestRoutes(app, { dataDir, teacherPassword: "2", tests: TESTS, hashSecret: "x", kindZumCode });
  registerProbenNotenRoutes(app, {
    teacherPassword: "2", kindZumCode,
    quellen: [{ modul: "vokabeltest", fach: "Englisch", abgaben: vokabeltest.abgaben }]
  });
  await new Promise((resolve) => { server = app.listen(0, "127.0.0.1", resolve); });
  basis = `http://127.0.0.1:${server.address().port}`;
});
test.after(() => server && server.close());

const post = async (route, body) => {
  const res = await fetch(basis + route, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return { status: res.status, data: await res.json() };
};

test("Anmeldung nur mit gültigem Code, Namen werden nicht gespeichert", async () => {
  assert.equal((await post("/api/vokabeltest/unlock", { password: "2", testId: "e7m-u1-a", open: true })).status, 200);

  const ohne = await post("/api/vokabeltest/start", { testId: "e7m-u1-a", firstName: "Max", lastName: "Muster", className: "7aM" });
  assert.equal(ohne.status, 400);
  assert.equal(ohne.data.error, "code_fehlt");
  assert.equal((await post("/api/vokabeltest/start", { testId: "e7m-u1-a", code: "12" })).status, 400);
  assert.equal((await post("/api/vokabeltest/start", { testId: "e7m-u1-a", code: "999" })).status, 404);

  const start = await post("/api/vokabeltest/start", { testId: "e7m-u1-a", code: "123" });
  assert.equal(start.status, 200);
  assert.equal(start.data.items.length, 2);

  const abgabe = await post("/api/vokabeltest/submit", { testId: "e7m-u1-a", code: "123", firstName: "Max", lastName: "Muster", answers: ["dog", "cat"] });
  assert.equal(abgabe.status, 200);
  assert.equal(abgabe.data.result.grade, 1);

  const gespeichert = fs.readFileSync(path.join(dataDir, "vokabeltest_abgaben.json"), "utf8");
  assert.ok(!gespeichert.includes("Max") && !gespeichert.includes("Muster"), "keine Namen auf dem Server");
  const rec = JSON.parse(gespeichert).submissions[0];
  assert.equal(rec.code, "123");
  assert.equal(rec.className, "7aM");

  const nochmal = await post("/api/vokabeltest/submit", { testId: "e7m-u1-a", code: "123", answers: ["dog", "cat"] });
  assert.equal(nochmal.status, 409);
  assert.equal((await post("/api/vokabeltest/start", { testId: "e7m-u1-a", code: "123" })).status, 409);
});

test("Notenschlüssel nach Zug des Kindes: M 50 % = Note 4, R 50 % = Note 3", async () => {
  const m = await post("/api/vokabeltest/submit", { testId: "e7m-u1-a", code: "456", answers: ["dog", ""] });
  assert.equal(m.data.result.percent, 50);
  assert.equal(m.data.result.grade, 4);
  // R-Kind mit dem Test des M-Zugs: trotzdem R-Schlüssel
  const r = await post("/api/vokabeltest/submit", { testId: "e7m-u1-a", code: "321", answers: ["", "cat"] });
  assert.equal(r.data.result.percent, 50);
  assert.equal(r.data.result.grade, 3);
});

test("LRS: Rechtschreibfehler zählen nicht, Verlassen wird gezählt", async () => {
  const mitLrs = await post("/api/vokabeltest/submit", { testId: "e7m-u1-a", code: "555", answers: ["dag", "kat"], verlassen: 3 });
  assert.equal(mitLrs.data.result.grade, 1, "LRS: dag/kat gelten als dog/cat");
  const ohne = await post("/api/vokabeltest/submit", { testId: "e7m-u1-a", code: "556", answers: ["dag", "kat"] });
  assert.equal(ohne.data.result.score, 0, "ohne LRS bleiben dag/kat falsch");
  const rec = JSON.parse(fs.readFileSync(path.join(dataDir, "vokabeltest_abgaben.json"), "utf8")).submissions.find((s) => s.code === "555");
  assert.equal(rec.lrs, true);
  assert.equal(rec.verlassen, 3);
});

test("Freigeschaltete Proben schließen sich nach 3 Stunden, Abgabe geht 1 Stunde länger", () => {
  const { probeOffen } = require("./probe-kind");
  const jetzt = Date.parse("2026-10-05T12:00:00Z");
  const vor = (min) => ({ open: true, changedAt: new Date(jetzt - min * 60000).toISOString() });
  assert.equal(probeOffen(vor(170), false, jetzt), true);
  assert.equal(probeOffen(vor(190), false, jetzt), false);
  assert.equal(probeOffen(vor(190), true, jetzt), true, "Abgabe nach 3 h 10 min geht noch");
  assert.equal(probeOffen(vor(250), true, jetzt), false);
  assert.equal(probeOffen({ open: false, changedAt: new Date(jetzt).toISOString() }, false, jetzt), false);
  assert.equal(probeOffen(undefined), false);
});

test("Notenübersicht je Klasse, folgt dem Umbenennen der Klasse", async () => {
  await post("/api/vokabeltest/submit", { testId: "e7m-u1-a", code: "789", answers: ["", ""] });

  assert.equal((await post("/api/proben/noten", { password: "falsch", klasse: "7aM" })).status, 401);
  const a = await post("/api/proben/noten", { password: "2", klasse: "7aM" });
  assert.equal(a.status, 200);
  assert.deepEqual(a.data.noten.map((n) => [n.code, n.note, n.punkte, n.max]).sort(), [["123", 1, 2, 2], ["456", 4, 1, 2]]);
  assert.equal(a.data.noten[0].titel, "Unit 1 A");
  assert.equal(a.data.noten[0].fach, "Englisch");
  assert.match(a.data.noten[0].datum, /^\d{4}-\d{2}-\d{2}$/);

  const b = await post("/api/proben/noten", { password: "2", klasse: "7b" });
  assert.deepEqual(b.data.noten.map((n) => n.code).sort(), ["321", "789"]);

  klassen.set("123", "7cM");
  klassen.set("456", "7cM");
  const c = await post("/api/proben/noten", { password: "2", klasse: "7cM" });
  assert.equal(c.data.noten.length, 2);
  assert.equal((await post("/api/proben/noten", { password: "2", klasse: "7aM" })).data.noten.length, 0);
});
