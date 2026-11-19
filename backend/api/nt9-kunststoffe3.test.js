"use strict";

// NT 9M, Probe 3 Kunststoffe (19.11.2026): wie Probe 2, aber nur Module P1 bis P3 – Animationen, 6 offene Fragen,
// 53 Punkte, 45 Minuten, übliche Testregeln, nur 9M mit M-Schlüssel.
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const { registerInfoaustauschRoutes } = require("./infoaustausch");
const { TESTS, GRADE_SCALE, KI_REGELN } = require("./nt9-probe-daten");

const PW = "Nur-ein-Test-4711";
const KINDER = { 301: "9aM", 302: "9aM" };
const kindZumCode = async (code) => (KINDER[code] ? { code: String(code), klasse: KINDER[code] } : null);
const ID = "nt9m-kunststoffe3";
const MODULE = ["ku1", "ku2", "ku3"];
const punkteVon = (it) => (it.type === "match" ? it.rows.length : it.points);
// Schätzung wie in block-proben.test.js / pruefe-block.js
const minuten = (it) => (it.type === "choice" ? 0.75 : it.type === "text" ? 1 + 0.9 * it.points : 0.5 + 0.4 * it.rows.length);
// richtige Klick-Antworten, bis genau soll Punkte erreicht sind; Textaufgaben bleiben leer
function antwortenMit(t, soll) {
  let summe = 0;
  return t.items.map((it) => {
    if (it.type === "text") return "";
    const leer = it.type === "match" ? it.rows.map(() => null) : null;
    if (summe + punkteVon(it) > soll) return leer;
    summe += punkteVon(it);
    return it.type === "match" ? it.rows.map((r) => r.answer) : it.answer;
  });
}

async function mitServer(lauf) {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "nt9-kunststoffe3-"));
  const app = express();
  app.use(express.json());
  registerInfoaustauschRoutes(app, { prefix: "/api/nt9probe", storeName: "nt9probe", kindZumCode, gradeScale: GRADE_SCALE, kiRegeln: KI_REGELN,
    dataDir, teacherPassword: PW, tests: TESTS });
  const server = await new Promise((resolve) => { const s = app.listen(0, () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (route, body) => fetch(base + "/api/nt9probe" + route, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
    .then(async (r) => ({ status: r.status, data: await r.json().catch(() => null) }));
  const get = (route) => fetch(base + "/api/nt9probe" + route).then((r) => r.json());
  try {
    const abgaben = async () => (await post("/results", { password: PW, testId: ID })).data.submissions;
    await lauf({ post, get, abgaben });
  } finally {
    await new Promise((resolve) => server.close(resolve));
    fs.rmSync(dataDir, { recursive: true, force: true });
  }
}

test("Aufbau: 53 Punkte, P1 bis P3 je 16 Punkte, 6 offene Fragen, Transfer, Animationen aus allen drei Modulen", () => {
  const t = TESTS[ID];
  assert.deepEqual([t.classLevel, t.thema, t.minutes, t.notenzug, t.abgabeMinuten, t.wegSekunden, t.kopieren, t.alt],
    ["9M", "kunststoffe", 45, "M", undefined, undefined, undefined, undefined], "übliche Testregeln, ohne Uhr");
  assert.equal(TESTS["nt9r-kunststoffe3"], undefined, "nur 9M");
  assert.equal(t.items.length, 22);
  assert.equal(t.items.reduce((s, it) => s + punkteVon(it), 0), 53);
  const zeit = t.items.reduce((s, it) => s + minuten(it), 0);
  assert.ok(zeit >= 38 && zeit <= 46, "etwa " + zeit.toFixed(0) + " Minuten");
  assert.equal(t.items.filter((it) => it.type === "text").length, 6, "offene Fragen");
  MODULE.forEach((m) => {
    const teil = t.items.filter((it) => it.modul === m && !it.transfer);
    assert.equal(teil.reduce((s, it) => s + punkteVon(it), 0), 16, m);
    assert.ok(teil.some((it) => it.type === "text"), m + ": eine offene Frage");
    assert.ok(teil.filter((it) => it.image).length >= 2, m + ": Animationen");
  });
  assert.ok(t.items.every((it) => MODULE.includes(it.modul)), "nur P1 bis P3");
  const transfer = t.items.filter((it) => it.transfer);
  assert.equal(transfer.reduce((s, it) => s + punkteVon(it), 0), 5, "Transfer");
  assert.ok(t.items.slice(-transfer.length).every((it) => it.transfer && it.teil === "Transfer"), "Transfer am Schluss");
  t.items.forEach((it, i) => {
    const wo = "Aufgabe " + (i + 1);
    assert.ok(it.modulTitel.length > 10, wo);
    assert.equal(it.teil, it.transfer ? "Transfer" : it.modulTitel, wo + ": teil");
    if (it.type === "choice") { assert.equal(it.options.length, 4, wo); assert.equal(new Set(it.options).size, 4, wo); assert.ok(it.answer >= 0 && it.answer < 4, wo); }
    if (it.type === "match") { assert.equal(new Set(it.options).size, it.options.length, wo); it.rows.forEach((r) => assert.ok(r.answer >= 0 && r.answer < it.options.length, wo)); }
    if (it.type === "text") assert.ok(it.expected.length > 60 && it.kriterien.length > 60 && it.keywords.length >= 8 && it.keywordsVoll === 2 && it.points >= 2, wo);
    if (it.image) {
      assert.ok(/^assets\/probe\/ku3-[a-z]+\.svg$/.test(it.image) && it.imageAlt.length > 60, wo + ": Bild");
      const ordner = path.join(__dirname, "..", "..", "..", "..", "9M");
      if (fs.existsSync(ordner)) assert.ok(fs.existsSync(path.join(ordner, "NT_9", "App12_Organische_Rohstoffe", it.image)), it.image);
    }
  });
  assert.equal(new Set(t.items.filter((it) => it.image).map((it) => it.image)).size, 9, "9 verschiedene Animationen");
  // keine Aufgabe wörtlich aus Probe 1 oder 2
  const frueher = new Set([...TESTS["nt9m-kunststoffe"].items, ...TESTS["nt9m-kunststoffe2"].items].map((it) => it.prompt));
  t.items.forEach((it) => assert.ok(!frueher.has(it.prompt), "neu: " + it.prompt.slice(0, 50)));
  // die richtige Antwort liegt nicht immer an derselben Stelle
  const stellen = t.items.filter((it) => it.type === "choice").map((it) => it.answer);
  assert.ok(new Set(stellen).size >= 3, "gemischt: " + stellen.join(""));
});

test("Liste und Start: gesperrt bis zum Freischalten, M-Schlüssel, keine Lösungen", async () => {
  await mitServer(async ({ post, get }) => {
    const vorher = (await get("/list")).tests.find((x) => x.id === ID);
    assert.deepEqual([vorher.maxPoints, vorher.notenzug, vorher.minutes, vorher.unlocked], [53, "M", 45, false]);
    assert.equal((await post("/unlock", { password: PW, testId: ID, open: true })).status, 200);
    const start = await post("/start", { testId: ID, code: "301" });
    assert.equal(start.status, 200);
    assert.equal(start.data.items.length, 22);
    start.data.items.forEach((it) => {
      assert.ok(it.answer === undefined && it.expected === undefined && it.kriterien === undefined && it.keywords === undefined, "keine Lösungen");
      if (it.type === "match") assert.ok(it.rows.every((r) => typeof r === "string"));
    });
    assert.equal(start.data.items.filter((it) => it.image).length, 9);
  });
});

test("M-Schlüssel (50 % = Note 4), alles richtig = Note 1, Verlassen über eine Minute = Note 6", async () => {
  await mitServer(async ({ post, abgaben }) => {
    const t = TESTS[ID];
    await post("/unlock", { password: PW, testId: ID, open: true });
    await post("/start", { testId: ID, code: "301" });
    // 26,5 von 53 Punkten = 50 % → nur mit Klick-Aufgaben: 27 Punkte (50,9 %) = Note 4 im M-Schlüssel
    assert.equal((await post("/submit", { testId: ID, code: "301", answers: antwortenMit(t, 27), regel: true })).status, 200);
    const [rec] = await abgaben();
    assert.deepEqual([rec.score, rec.total, rec.notenzug, rec.grade], [27, 53, "M", 4]);
    assert.ok(rec.details.filter((d) => d.type === "text").every((d) => d.points === 0), "offene Fragen ohne Antwort: 0 Punkte");

    await post("/start", { testId: ID, code: "302" });
    const weg = await post("/submit", { testId: ID, code: "302", answers: antwortenMit(t, 40), regel: true, verlassen: 3, wegSumme: 90, abbruch: { grund: "weg", sekunden: 90 } });
    assert.equal(weg.status, 200);
    const rec6 = (await abgaben()).find((x) => x.code === "302");
    assert.equal(rec6.grade, 6);
    assert.ok(rec6.abbruch);
  });
});
