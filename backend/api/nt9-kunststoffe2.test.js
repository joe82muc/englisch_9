"use strict";

// NT 9, Probe 2 Kunststoffe (18.11.2026): nach Regelhefteinträgen und Modulen P1 bis P5, Animationen, 6 offene Fragen,
// 58 Punkte, 45 Minuten, übliche Testregeln; gleiche Aufgaben für 9M (M-Schlüssel) und 9R (R-Schlüssel).
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const { registerInfoaustauschRoutes } = require("./infoaustausch");
const { TESTS, GRADE_SCALE, KI_REGELN } = require("./nt9-probe-daten");

const PW = "Nur-ein-Test-4711";
const KINDER = { 301: "9aM", 302: "9aM", 401: "9b", 402: "9b" };
const kindZumCode = async (code) => (KINDER[code] ? { code: String(code), klasse: KINDER[code] } : null);
const IDS = ["nt9m-kunststoffe2", "nt9r-kunststoffe2"];
const MODULE = ["ku1", "ku2", "ku3", "ku4", "ku5"];
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
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "nt9-kunststoffe2-"));
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
    for (const id of IDS) assert.equal((await post("/unlock", { password: PW, testId: id, open: true })).status, 200);
    const abgaben = async (testId) => (await post("/results", { password: PW, testId })).data.submissions;
    await lauf({ post, get, abgaben });
  } finally {
    await new Promise((resolve) => server.close(resolve));
    fs.rmSync(dataDir, { recursive: true, force: true });
  }
}

test("Aufbau: 58 Punkte, P1 bis P5 je 10 bis 11 Punkte, 6 offene Fragen, Transfer, Animationen aus allen Modulen", () => {
  for (const [id, zug] of [[IDS[0], "M"], [IDS[1], "R"]]) {
    const t = TESTS[id];
    assert.deepEqual([t.classLevel, t.thema, t.minutes, t.notenzug, t.abgabeMinuten, t.wegSekunden, t.kopieren, t.alt],
      ["9" + zug, "kunststoffe", 45, zug, undefined, undefined, undefined, undefined], id + ": übliche Testregeln, ohne Uhr");
    assert.equal(t.items.length, 25, id);
    assert.equal(t.items.reduce((s, it) => s + punkteVon(it), 0), 58, id);
    const zeit = t.items.reduce((s, it) => s + minuten(it), 0);
    assert.ok(zeit >= 38 && zeit <= 46, id + ": etwa " + zeit.toFixed(0) + " Minuten");
    const text = t.items.filter((it) => it.type === "text");
    assert.equal(text.length, 6, id + ": offene Fragen");
    MODULE.forEach((m) => {
      const teil = t.items.filter((it) => it.modul === m && !it.transfer);
      const p = teil.reduce((s, it) => s + punkteVon(it), 0);
      assert.ok(p >= 10 && p <= 11, id + " " + m + ": " + p + " Punkte");
      assert.ok(teil.some((it) => it.type === "text"), id + " " + m + ": eine offene Frage");
      assert.ok(teil.filter((it) => it.image).length >= 2, id + " " + m + ": Animationen");
    });
    const transfer = t.items.filter((it) => it.transfer);
    assert.equal(transfer.reduce((s, it) => s + punkteVon(it), 0), 5, id + ": Transfer");
    assert.ok(t.items.slice(-transfer.length).every((it) => it.transfer && it.teil === "Transfer"), id + ": Transfer am Schluss");
    t.items.forEach((it, i) => {
      const wo = id + " Aufgabe " + (i + 1);
      assert.ok(MODULE.includes(it.modul) && it.modulTitel.length > 10, wo);
      assert.equal(it.teil, it.transfer ? "Transfer" : it.modulTitel, wo + ": teil");
      if (it.type === "choice") { assert.equal(it.options.length, 4, wo); assert.equal(new Set(it.options).size, 4, wo); assert.ok(it.answer >= 0 && it.answer < 4, wo); }
      if (it.type === "match") { assert.equal(new Set(it.options).size, it.options.length, wo); it.rows.forEach((r) => assert.ok(r.answer >= 0 && r.answer < it.options.length, wo)); }
      if (it.type === "text") assert.ok(it.expected.length > 60 && it.kriterien.length > 60 && it.keywords.length >= 8 && it.keywordsVoll === 2 && it.points >= 2, wo);
      if (it.image) {
        assert.ok(/^assets\/probe\/ku2-[a-z]+\.svg$/.test(it.image) && it.imageAlt.length > 60, wo + ": Bild");
        for (const ordner of ["9M", "9R"]) {
          const datei = path.join(__dirname, "..", "..", "..", "..", ordner, "NT_9", "App12_Organische_Rohstoffe", it.image);
          if (fs.existsSync(path.join(__dirname, "..", "..", "..", "..", ordner))) assert.ok(fs.existsSync(datei), datei);
        }
      }
    });
    assert.equal(new Set(t.items.filter((it) => it.image).map((it) => it.image)).size, 15, id + ": 15 verschiedene Animationen");
  }
  // gleiche Aufgaben in beiden Kennungen (nur die Antwortreihenfolge ist je Kennung gemischt)
  assert.deepEqual(TESTS[IDS[0]].items.map((it) => it.prompt), TESTS[IDS[1]].items.map((it) => it.prompt));
  // die richtige Antwort liegt nicht immer an derselben Stelle
  const stellen = TESTS[IDS[0]].items.filter((it) => it.type === "choice").map((it) => it.answer);
  assert.ok(new Set(stellen).size >= 3, "gemischt: " + stellen.join(""));
  // die erste Kunststoff-Probe bleibt
  assert.ok(TESTS["nt9m-kunststoffe"] && TESTS["nt9r-kunststoffe"]);
});

test("Liste und Start: Notenschlüssel je Kennung, keine Lösungen", async () => {
  await mitServer(async ({ post, get }) => {
    const liste = (await get("/list")).tests;
    for (const [id, zug] of [[IDS[0], "M"], [IDS[1], "R"]]) {
      const t = liste.find((x) => x.id === id);
      assert.deepEqual([t.maxPoints, t.notenzug, t.wegSekunden, t.abgabeMinuten, t.unlocked], [58, zug, undefined, undefined, true], id);
    }
    const start = await post("/start", { testId: IDS[0], code: "301" });
    assert.equal(start.status, 200);
    assert.equal(start.data.items.length, 25);
    start.data.items.forEach((it) => {
      assert.ok(it.answer === undefined && it.expected === undefined && it.kriterien === undefined && it.keywords === undefined, "keine Lösungen");
      if (it.type === "match") assert.ok(it.rows.every((r) => typeof r === "string"));
    });
    assert.ok(start.data.items.filter((it) => it.image).every((it) => it.imageAlt.length > 60));
  });
});

test("M-Schlüssel für 9M (50 % = Note 4), R-Schlüssel für 9R (50 % = Note 3); Verlassen über eine Minute = Note 6", async () => {
  await mitServer(async ({ post, abgaben }) => {
    const m = TESTS[IDS[0]], r = TESTS[IDS[1]];
    await post("/start", { testId: m.id, code: "301" });
    assert.equal((await post("/submit", { testId: m.id, code: "301", answers: antwortenMit(m, 29), regel: true })).status, 200);
    await post("/start", { testId: r.id, code: "401" });
    assert.equal((await post("/submit", { testId: r.id, code: "401", answers: antwortenMit(r, 29), regel: true })).status, 200);
    const [recM] = await abgaben(m.id), [recR] = await abgaben(r.id);
    assert.deepEqual([recM.score, recM.total, recM.percent, recM.notenzug, recM.grade], [29, 58, 50, "M", 4]);
    assert.deepEqual([recR.score, recR.total, recR.percent, recR.notenzug, recR.grade], [29, 58, 50, "R", 3]);
    // offene Fragen ohne Antwort: 0 Punkte
    assert.ok(recM.details.filter((d) => d.type === "text").every((d) => d.points === 0));

    // übliche Testregeln: insgesamt über eine Minute weg = Note 6
    await post("/start", { testId: m.id, code: "302" });
    const weg = await post("/submit", { testId: m.id, code: "302", answers: antwortenMit(m, 43), regel: true, verlassen: 3, wegSumme: 90, abbruch: { grund: "weg", sekunden: 90 } });
    assert.equal(weg.status, 200);
    const rec6 = (await abgaben(m.id)).find((x) => x.code === "302");
    assert.equal(rec6.grade, 6);
    assert.ok(rec6.abbruch);
  });
});
