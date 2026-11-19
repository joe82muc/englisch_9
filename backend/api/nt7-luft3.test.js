"use strict";

// NT 7, Probe 3 Luft (19.11.2026): L1 bis L6 und L8, gleiche Aufgaben für R und M, Notenschlüssel nach dem Zug der Klasse.
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const nt7 = require("./nt7-fragen");
const { registerNt7Routes } = require("./nt7");

const MODULE = ["luft-modul", "windkraft-strom", "windkraft-procontra", "luft-verbrennung", "achtung-explosiv", "brand-schutz", "luftdruck"];
const R = nt7["nt7-luft3-r"], M = nt7["nt7-luft3-m"];
// richtige Klick-Antworten, bis genau soll Punkte erreicht sind; Textaufgaben bleiben leer
function antwortenMit(t, soll) {
  let summe = 0;
  return t.items.map((it) => {
    if (it.type === "text") return "";
    if (summe + it.points > soll) return it.type === "choice" ? null : [];
    summe += it.points;
    return it.type === "choice" ? it.answer : it.type === "match" ? it.pairs.map((p) => p[1]) : it.steps;
  });
}

test("Aufbau: gleiche Aufgaben in R und M, je Modul 6 Punkte, 4 Punkte Transfer, 7 offene Fragen, 10 Animationen", () => {
  assert.deepEqual([R.zug, M.zug, R.thema, M.thema, R.minutes, M.minutes], ["R", "M", "luft", "luft", 45, 45]);
  assert.deepEqual(R.items.map((it) => it.prompt), M.items.map((it) => it.prompt));
  assert.equal(R.items.reduce((s, it) => s + it.points, 0), 46);
  MODULE.forEach((m) => assert.equal(R.items.filter((it) => it.modul === m && !it.transfer).reduce((s, it) => s + it.points, 0), 6, m));
  assert.ok(R.items.every((it) => MODULE.includes(it.modul)), "nur L1 bis L6 und L8");
  assert.equal(R.items.filter((it) => it.transfer).reduce((s, it) => s + it.points, 0), 4);
  assert.equal(R.items.filter((it) => it.type === "text").length, 7);
  const bilder = R.items.filter((it) => it.image);
  assert.equal(new Set(bilder.map((it) => it.image)).size, 10);
  const ordner = path.join(__dirname, "..", "..", "..", "..", "7M", "NT");
  bilder.forEach((it) => {
    assert.match(it.image, /^assets\/proben\/luft3-[a-z]+\.svg$/);
    if (fs.existsSync(ordner)) {
      const svg = fs.readFileSync(path.join(ordner, it.image), "utf8");
      assert.ok(!svg.includes("<!--"), it.image + ": öffentliche Datei ohne Kommentare");
    }
  });
  // kein Fragetext wortgleich mit den beiden früheren Luft-Proben
  const frueher = new Set(["nt7-luft-r", "nt7-luft-m", "nt7-luft2-r", "nt7-luft2-m"].flatMap((id) => nt7[id].items.map((it) => it.prompt)));
  R.items.forEach((it) => assert.ok(!frueher.has(it.prompt), "neu: " + it.prompt.slice(0, 50)));
  // Zuordnungen: Die Lösung steht nicht in alphabetischer Reihenfolge der Ziele (so zeigt sie die Probe-Seite)
  R.items.filter((it) => it.type === "match").forEach((it) => {
    const ziele = it.pairs.map((p) => p[1]);
    assert.notDeepEqual(ziele, ziele.slice().sort((a, b) => a.localeCompare(b, "de")), it.prompt);
  });
});

test("R-Klasse: R-Schlüssel (50 % = Note 3), M-Klasse: M-Schlüssel (50 % = Note 4), falscher Zug wird abgewiesen", async () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "nt7-luft3-test-"));
  const app = express();
  app.use(express.json());
  registerNt7Routes(app, {
    dataDir, teacherPassword: "pw",
    kindZumCode: async (code) => (code === "111" ? { code: "111", klasse: "7aM", zug: "7M" } : code === "222" ? { code: "222", klasse: "7d", zug: "7R" } : null)
  });
  const server = await new Promise((resolve) => { const s = app.listen(0, () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (route, body) => fetch(base + route, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).then(async (r) => ({ status: r.status, data: await r.json() }));
  try {
    const liste = (await (await fetch(base + "/api/nt7/list")).json()).tests;
    assert.deepEqual(liste.filter((t) => t.id.startsWith("nt7-luft3")).map((t) => [t.id, t.zug, t.maxPoints, t.unlocked]),
      [["nt7-luft3-r", "R", 46, false], ["nt7-luft3-m", "M", 46, false]]);
    for (const id of ["nt7-luft3-r", "nt7-luft3-m"]) assert.equal((await post("/api/nt7/teacher/unlock", { password: "pw", testId: id, open: true })).status, 200);
    assert.equal((await post("/api/nt7/start", { testId: "nt7-luft3-m", code: "222" })).status, 403, "R-Kind in der M-Fassung");
    assert.equal((await post("/api/nt7/start", { testId: "nt7-luft3-r", code: "111" })).status, 403, "M-Kind in der R-Fassung");
    const start = await post("/api/nt7/start", { testId: "nt7-luft3-r", code: "222" });
    assert.equal(start.status, 200);
    assert.equal(JSON.stringify(start.data).includes("expected"), false, "Lösungen gehen nicht an das Kind");
    assert.equal(start.data.items.filter((it) => it.image).length, 10);
    await post("/api/nt7/start", { testId: "nt7-luft3-m", code: "111" });
    const r = await post("/api/nt7/submit", { testId: "nt7-luft3-r", code: "222", answers: antwortenMit(R, 23) });
    const m = await post("/api/nt7/submit", { testId: "nt7-luft3-m", code: "111", answers: antwortenMit(M, 23) });
    assert.deepEqual([r.status, r.data.result.score, r.data.result.total], [200, 23, 46]);
    assert.deepEqual([m.status, m.data.result.score, m.data.result.total], [200, 23, 46]);
    const note = async (id) => (await post("/api/nt7/teacher/results", { password: "pw", testId: id })).data.submissions[0].grade;
    assert.equal(await note("nt7-luft3-r"), 3, "R-Schlüssel");
    assert.equal(await note("nt7-luft3-m"), 4, "M-Schlüssel");
  } finally {
    await new Promise((resolve) => server.close(resolve));
    fs.rmSync(dataDir, { recursive: true, force: true });
  }
});
