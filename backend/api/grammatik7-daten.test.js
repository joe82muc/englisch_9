"use strict";

// Englisch 7: die Grammatikproben e7m|r-u<N>-gp1/gp2 (grammatik7-daten.js, Routen aus grammatik9r.js). Je Unit zwei Proben,
// 7M und 7R getrennt, je 16 Punkte (10 bis 15 Minuten), R mit mehr Ankreuzen. Unit 1 hat sie seit 15.11.2026 (gp1 = G1 simple
// past, gp2 = G2–G4); die ältere Unit-1-Grammatikprobe und die Kurztests G1–G4 sind im Einsatz und dürfen sich nicht ändern.
const assert = require("node:assert/strict");
const test = require("node:test");
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const { TESTS } = require("./grammatik7-daten");
const { registerGrammatik9rRoutes } = require("./grammatik9r");

const punkte = (t) => t.items.reduce((s, it) => s + (it.type === "gap" ? (String(it.prompt).match(/___/g) || []).length : Number(it.points) || 1), 0);
const ankreuzen = (t) => t.items.filter((it) => it.type === "choice").length;
const GP = Object.keys(TESTS).filter((id) => /^e7[mr]-u[1-4]-gp[12]$/.test(id));

test("Je Unit 1 bis 4 zwei Grammatikproben für 7M und 7R", () => {
  for (const u of [1, 2, 3, 4]) for (const z of ["m", "r"]) for (const g of [1, 2]) assert.ok(TESTS["e7" + z + "-u" + u + "-gp" + g], "e7" + z + "-u" + u + "-gp" + g + " fehlt");
  assert.equal(GP.length, 16);
});

test("Jede Grammatikprobe: 16 Punkte, vollständige Aufgaben, Schlüssel und Titel nach dem Zug", () => {
  for (const id of GP) {
    const t = TESTS[id], zug = id[2].toUpperCase(), unit = id.match(/-u(\d)-/)[1];
    assert.equal(punkte(t), 16, id + ": " + punkte(t) + " Punkte");
    assert.equal(t.kind, "probe"); assert.equal(t.classLevel, "7" + zug); assert.equal(t.gradeScale, zug);
    assert.equal(t.unit, "Englisch 7" + zug + " / Unit " + unit);
    assert.match(t.title, new RegExp("^7" + zug + " · Grammatikprobe " + id.slice(-1) + " Unit " + unit + " – "), id + ": Titel");
    t.items.forEach((it, i) => {
      const wo = id + " Aufgabe " + (i + 1) + ": ";
      if (it.type === "gap") assert.ok(it.solutions.length === (it.prompt.match(/___/g) || []).length && it.solutions.every((s) => s.length && s.every((x) => String(x).trim())), wo + "Lücken und Lösungen");
      else if (it.type === "choice") { assert.ok(it.options.length >= 3 && new Set(it.options).size === it.options.length, wo + "drei verschiedene Antworten"); assert.ok(Number.isInteger(it.answer) && it.options[it.answer] !== undefined, wo + "Lösung"); }
      else { assert.equal(it.type, "text", wo + "Art"); assert.ok(it.points === 2 && it.expected && it.focus && it.keywords.length, wo + "Satz mit Musterlösung, Schwerpunkt und Stichwörtern"); }
    });
    assert.ok(t.items[0].section && t.items.some((it) => it.type === "text"), id + ": Abschnitte und ein eigener Satz");
  }
});

test("7M und 7R getrennt: eigene Aufgaben, R mit mehr Ankreuzen", () => {
  for (const id of GP.filter((x) => x[2] === "m")) {
    const m = TESTS[id], r = TESTS[id.replace(/^e7m/, "e7r")];
    assert.notDeepEqual(m.items, r.items, id + ": R hat eine eigene Fassung");
    assert.ok(ankreuzen(r) >= ankreuzen(m) + 3, id + ": R " + ankreuzen(r) + " zu M " + ankreuzen(m) + " Ankreuzaufgaben");
  }
});

test("Unit 1: gp1 übt nur G1 (simple past), gp2 G2 bis G4 – mit den Namen des Plans", () => {
  for (const z of ["m", "r"]) {
    const gp1 = JSON.stringify(TESTS["e7" + z + "-u1-gp1"].items), gp2 = JSON.stringify(TESTS["e7" + z + "-u1-gp2"].items);
    assert.match(gp1, /G1/); assert.match(gp1, /didn't/); assert.match(gp1, /"(were|was)"|Yes, they were|weren't/);
    assert.ok(!/\bG[2-4]\b/.test(gp1), "gp1 nur G1");
    for (const g of ["G2", "G3", "G4"]) assert.match(gp2, new RegExp(g), "gp2 übt " + g);
    assert.match(gp2, /\b(mine|hers|theirs|ours|yours)\b/); assert.match(gp2, /\b(Does|does)\b/);
    for (const name of ["Noor", "Logan", "Ivy", "Jasper"]) assert.ok((gp1 + gp2).includes(name), z + ": Name " + name);
    assert.match(gp1, /Skipton/);
    // Buchnamen von Unit 1 kommen nicht vor
    assert.ok(!/\b(Hannah|Tom|George|Sarah|Manchester|Brighton|Oxford|Globe)\b/.test(gp1 + gp2), z + ": keine Namen aus dem Schulbuch");
  }
});

test("Die Unit-1-Grammatikprobe und die Kurztests G1–G4 (im Einsatz) sind unverändert", () => {
  const alt = ["probe", "kt-g1", "kt-g2", "kt-g3", "kt-g4"].flatMap((k) => ["e7m-u1-" + k, "e7r-u1-" + k]).sort((a, b) => Object.keys(TESTS).indexOf(a) - Object.keys(TESTS).indexOf(b));
  const fingerabdruck = crypto.createHash("sha256").update(JSON.stringify(alt.map((id) => TESTS[id]))).digest("hex");
  assert.equal(fingerabdruck, "6645af0ce0b169ee8238ae3a8c1f9512165d01e08d9a98e5c99956742ba73d64");
});

// Über die echten Routen: alles richtig = 16 Punkte (Sätze ohne KI über die Stichwörter), typische Fehler zählen nicht
test("Unit 1 über die Routen: alles richtig gibt 16 Punkte, didn't came und goes nach Does sind falsch", async () => {
  const PW = "Nur-ein-Test-4711", dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "grammatik7-"));
  const KINDER = { 701: { klasse: "7aM", zug: "M" }, 702: { klasse: "7b", zug: "R" }, 703: { klasse: "7aM", zug: "M" } };
  const app = express(); app.use(express.json());
  registerGrammatik9rRoutes(app, { dataDir, teacherPassword: PW, tests: TESTS, hashSecret: "x", askAnthropic: async () => "",
    kindZumCode: async (code) => (KINDER[code] ? { code: String(code), klasse: KINDER[code].klasse, zug: KINDER[code].zug, lrs: false } : null) });
  const server = await new Promise((ok) => { const s = app.listen(0, "127.0.0.1", () => ok(s)); });
  const post = (route, body) => fetch(`http://127.0.0.1:${server.address().port}/api/grammatik9r/${route}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).then(async (r) => ({ status: r.status, data: await r.json() }));
  const richtig = (id) => TESTS[id].items.map((it) => (it.type === "choice" ? it.answer : it.type === "gap" ? it.solutions.map((s) => s[0]) : it.expected));
  try {
    const liste = (await (await fetch(`http://127.0.0.1:${server.address().port}/api/grammatik9r/list`)).json()).tests.filter((t) => /^e7[mr]-u1-gp/.test(t.id));
    assert.deepEqual(liste.map((t) => t.id).sort(), ["e7m-u1-gp1", "e7m-u1-gp2", "e7r-u1-gp1", "e7r-u1-gp2"]);
    assert.ok(liste.every((t) => t.maxPoints === 16 && !t.unlocked), "16 Punkte, zuerst gesperrt");
    for (const [id, code] of [["e7m-u1-gp1", "701"], ["e7r-u1-gp1", "702"], ["e7m-u1-gp2", "701"], ["e7r-u1-gp2", "702"]]) {
      assert.equal((await post("unlock", { password: PW, testId: id, open: true })).status, 200);
      const s = await post("start", { testId: id, code });
      assert.equal(s.status, 200, id); assert.equal(s.data.test.maxPoints, 16);
      assert.ok(!/"(answer|solutions|expected|keywords)"/.test(JSON.stringify(s.data)), id + ": keine Lösungen beim Kind");
      const ab = await post("submit", { testId: id, code, answers: richtig(id) });
      assert.equal(ab.status, 200, id); assert.equal(ab.data.result.score, 16, id + ": alles richtig"); assert.equal(ab.data.result.grade, 1);
    }
    // typische Fehler: didn't came (statt didn't come) und Frage mit goes nach Does
    const fehler = richtig("e7m-u1-gp1"), b1 = TESTS["e7m-u1-gp1"].items.findIndex((it) => /not \/ come/.test(it.prompt));
    fehler[b1] = ["didn't came"];
    assert.equal((await post("unlock", { password: PW, testId: "e7m-u1-gp1", open: true })).status, 200);
    const f1 = await post("submit", { testId: "e7m-u1-gp1", code: "703", answers: fehler });
    assert.equal(f1.data.result.score, 15, "didn't came zählt nicht");
    const fehler2 = richtig("e7m-u1-gp2"), b2 = TESTS["e7m-u1-gp2"].items.findIndex((it) => /Jasper ___ \(go\)/.test(it.prompt));
    fehler2[b2] = ["Does", "goes"];
    const f2 = await post("submit", { testId: "e7m-u1-gp2", code: "703", answers: fehler2 });
    assert.equal(f2.data.result.score, 15, "Does … goes zählt nicht");
  } finally {
    await new Promise((ok) => server.close(ok));
    fs.rmSync(dataDir, { recursive: true, force: true });
  }
});
