"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const { registerNt7FreigabeRoutes } = require("./nt7-freigabe");

const PW = "lehrer-geheim";
let server, baseUrl, dataDir;

test.before(async () => {
  dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "nt7-freigabe-test-"));
  const app = express();
  app.use(express.json());
  registerNt7FreigabeRoutes(app, {
    dataDir, teacherPassword: PW,
    kindZumCode: async (code) => (code === "123" ? { code: "123", klasse: "7aM", zug: "7M" }
      : code === "456" ? { code: "456", klasse: "7d", zug: "7R" } : code === "999" ? { gesperrt: true }
      : code === "012" ? { code: "012", klasse: "Lehrkraft", zug: "", lehrer: true } : null)
  });
  await new Promise((resolve) => { server = app.listen(0, resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
  fs.rmSync(dataDir, { recursive: true, force: true });
});

const post = (route, body) => fetch(baseUrl + route, {
  method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body)
}).then(async (r) => ({ status: r.status, data: await r.json() }));

test("Ohne Einträge: leerer Stand, die Website nimmt ihren Standard", async () => {
  const r = await post("/api/nt7/freigabe", { code: "123" });
  assert.equal(r.status, 200);
  assert.deepEqual(r.data, { ok: true, klasse: "7aM", zug: "7M", themen: {}, module: {} });
  assert.equal((await post("/api/nt7/freigabe", { code: "000" })).status, 401);
  assert.equal((await post("/api/nt7/freigabe", { code: "999" })).status, 429);
});

test("Lehrercode: alles offen, unabhängig von dem, was für die Klassen gesetzt ist", async () => {
  const r = await post("/api/nt7/freigabe", { code: "012" });
  assert.equal(r.status, 200);
  assert.deepEqual(r.data, { ok: true, klasse: "Lehrkraft", zug: "", themen: {}, module: {}, alles: true });
  // Ein Kind bekommt „alles“ nie
  assert.ok(!("alles" in (await post("/api/nt7/freigabe", { code: "123" })).data));
});

test("Nur die Lehrkraft schaltet frei – und nur für 7. Klassen", async () => {
  assert.equal((await post("/api/nt7/lehrer/freigabe/setzen", { password: "falsch", klasse: "7aM", art: "thema", id: "atome", offen: true })).status, 401);
  assert.equal((await post("/api/nt7/lehrer/freigabe/setzen", { password: PW, klasse: "9aM", art: "thema", id: "atome", offen: true })).status, 400);
  assert.equal((await post("/api/nt7/lehrer/freigabe/setzen", { password: PW, klasse: "7aM", art: "kapitel", id: "atome", offen: true })).status, 400);
  assert.equal((await post("/api/nt7/lehrer/freigabe/setzen", { password: PW, klasse: "7aM", art: "thema", id: "../x", offen: true })).status, 400);
  assert.equal((await post("/api/nt7/lehrer/freigabe/setzen", { password: PW, klasse: "7aM", art: "thema", id: "atome", offen: "ja" })).status, 400);
});

test("Thema und einzelnes Modul freischalten gilt nur für diese Klasse", async () => {
  let r = await post("/api/nt7/lehrer/freigabe/setzen", { password: PW, klasse: "7aM", art: "thema", id: "atome", offen: true });
  assert.equal(r.status, 200);
  r = await post("/api/nt7/lehrer/freigabe/setzen", { password: PW, klasse: "7aM", art: "modul", id: "brand-schutz", offen: true });
  assert.deepEqual(r.data.module, { "brand-schutz": true });
  await post("/api/nt7/lehrer/freigabe/setzen", { password: PW, klasse: "7aM", art: "modul", id: "luft-modul", offen: false });
  const kind = (await post("/api/nt7/freigabe", { code: "123" })).data;
  assert.deepEqual(kind.themen, { atome: true });
  assert.deepEqual(kind.module, { "brand-schutz": true, "luft-modul": false });
  const andere = (await post("/api/nt7/freigabe", { code: "456" })).data;
  assert.deepEqual([andere.klasse, andere.zug, andere.themen, andere.module], ["7d", "7R", {}, {}]);
  const lehrkraft = (await post("/api/nt7/lehrer/freigabe", { password: PW, klasse: "7aM" })).data;
  assert.deepEqual(lehrkraft.themen, { atome: true });
});

test("Eintrag entfernen (null) und Thema neu setzen räumt Einzel-Einträge seiner Module auf", async () => {
  await post("/api/nt7/lehrer/freigabe/setzen", { password: PW, klasse: "7aM", art: "modul", id: "luft-modul", offen: null });
  let stand = (await post("/api/nt7/lehrer/freigabe", { password: PW, klasse: "7aM" })).data;
  assert.equal("luft-modul" in stand.module, false);
  await post("/api/nt7/lehrer/freigabe/setzen", { password: PW, klasse: "7aM", art: "modul", id: "atommodelle", offen: false });
  const r = await post("/api/nt7/lehrer/freigabe/setzen", { password: PW, klasse: "7aM", art: "thema", id: "atome", offen: false, module: ["atommodelle", "atombau-pse"] });
  assert.deepEqual(r.data.themen, { atome: false });
  assert.deepEqual(r.data.module, { "brand-schutz": true });
});

test("Deutsch 7: eigener Stand unter /api/d7, getrennt von NT 7", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "d7-freigabe-test-"));
  const app = express();
  app.use(express.json());
  const kindZumCode = async (code) => (code === "123" ? { code: "123", klasse: "7aM", zug: "7M" } : code === "456" ? { code: "456", klasse: "7d", zug: "7R" } : null);
  registerNt7FreigabeRoutes(app, { dataDir: dir, teacherPassword: PW, kindZumCode });
  registerNt7FreigabeRoutes(app, { dataDir: dir, teacherPassword: PW, kindZumCode, prefix: "/api/d7", datei: "d7-freigabe.json", name: "Deutsch-7-Freigabe" });
  const s = await new Promise((resolve) => { const x = app.listen(0, () => resolve(x)); });
  const p = (route, body) => fetch(`http://127.0.0.1:${s.address().port}` + route, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body)
  }).then(async (r) => ({ status: r.status, data: await r.json().catch(() => null) }));
  try {
    assert.deepEqual((await p("/api/d7/freigabe", { code: "123" })).data, { ok: true, klasse: "7aM", zug: "7M", themen: {}, module: {} });
    let r = await p("/api/d7/lehrer/freigabe/setzen", { password: PW, klasse: "7aM", art: "thema", id: "grammatik", offen: true });
    assert.deepEqual(r.data.themen, { grammatik: true });
    r = await p("/api/d7/lehrer/freigabe/setzen", { password: PW, klasse: "7aM", art: "modul", id: "gr-04", offen: false });
    assert.deepEqual(r.data.module, { "gr-04": false });
    r = await p("/api/d7/lehrer/freigabe/setzen", { password: PW, klasse: "7aM", art: "modul", id: "argumentationstrainer", offen: true });
    assert.equal(r.status, 200);
    const kind = (await p("/api/d7/freigabe", { code: "123" })).data;
    assert.deepEqual([kind.themen, kind.module], [{ grammatik: true }, { "gr-04": false, argumentationstrainer: true }]);
    assert.deepEqual((await p("/api/d7/freigabe", { code: "456" })).data.themen, {}, "andere Klasse, eigener Stand");
    assert.deepEqual((await p("/api/nt7/freigabe", { code: "123" })).data.themen, {}, "NT 7 bleibt unberührt");
    assert.equal((await p("/api/d7/lehrer/freigabe/setzen", { password: "falsch", klasse: "7aM", art: "thema", id: "grammatik", offen: false })).status, 401);
    assert.equal((await p("/api/d7/lehrer/freigabe/setzen", { password: PW, klasse: "8a", art: "thema", id: "grammatik", offen: true })).status, 400, "nur 7. Klassen");
    assert.equal((await p("/api/d7/freigabe", { code: "000" })).status, 401);
    assert.ok(fs.existsSync(path.join(dir, "d7-freigabe.json")) && !fs.existsSync(path.join(dir, "nt7-freigabe.json")), "eigene Datei");
  } finally {
    await new Promise((resolve) => s.close(resolve));
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("Englisch: je Stufe ein Stand (/api/e7, /api/e9); 9M und 9R teilen sich /api/e9, getrennt nach Klasse", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "e-freigabe-test-"));
  const app = express();
  app.use(express.json());
  const KINDER = { 701: ["7aM", "7M"], 901: ["9aM", "9M"], 902: ["9b", "9R"] };
  const kindZumCode = async (code) => (KINDER[code] ? { code: String(code), klasse: KINDER[code][0], zug: KINDER[code][1] }
    : code === "012" ? { code: "012", klasse: "Lehrkraft", zug: "", lehrer: true } : null);
  [7, 8, 9].forEach((stufe) => registerNt7FreigabeRoutes(app, { dataDir: dir, teacherPassword: PW, kindZumCode, prefix: "/api/e" + stufe, datei: "e" + stufe + "-freigabe.json", name: "Englisch-" + stufe + "-Freigabe", stufe }));
  const s = await new Promise((resolve) => { const x = app.listen(0, () => resolve(x)); });
  const p = (route, body) => fetch(`http://127.0.0.1:${s.address().port}` + route, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body)
  }).then(async (r) => ({ status: r.status, data: await r.json().catch(() => null) }));
  try {
    // zuerst ist nichts gesetzt – die Website sperrt dann alles
    assert.deepEqual((await p("/api/e9/freigabe", { code: "901" })).data, { ok: true, klasse: "9aM", zug: "9M", themen: {}, module: {} });
    // 9aM: Unit 1 und eine Mediation; 9b: nur der Vokabeltrainer der Unit 1 (gleiche Kennung wie bei 9M)
    await p("/api/e9/lehrer/freigabe/setzen", { password: PW, klasse: "9aM", art: "thema", id: "u1", offen: true });
    await p("/api/e9/lehrer/freigabe/setzen", { password: PW, klasse: "9aM", art: "modul", id: "med-park", offen: true });
    await p("/api/e9/lehrer/freigabe/setzen", { password: PW, klasse: "9b", art: "modul", id: "u1-vokabeln", offen: true });
    const m = (await p("/api/e9/freigabe", { code: "901" })).data, r = (await p("/api/e9/freigabe", { code: "902" })).data;
    assert.deepEqual([m.themen, m.module], [{ u1: true }, { "med-park": true }]);
    assert.deepEqual([r.themen, r.module], [{}, { "u1-vokabeln": true }], "9b hat seinen eigenen Stand");
    // Stufen sind getrennt: Eine 7. Klasse lässt sich unter /api/e9 nicht schalten, /api/e7 hat seine eigene Datei
    assert.equal((await p("/api/e9/lehrer/freigabe/setzen", { password: PW, klasse: "7aM", art: "thema", id: "u1", offen: true })).status, 400);
    assert.equal((await p("/api/e7/lehrer/freigabe/setzen", { password: PW, klasse: "7aM", art: "thema", id: "u1", offen: true })).status, 200);
    assert.equal((await p("/api/e8/lehrer/freigabe/setzen", { password: PW, klasse: "8b", art: "modul", id: "u2-vokabeln", offen: true })).status, 200);
    assert.deepEqual((await p("/api/e7/freigabe", { code: "701" })).data.themen, { u1: true });
    assert.deepEqual((await p("/api/e9/freigabe", { code: "701" })).data.themen, {}, "ein Kind der 7. Klasse hat in Englisch 9 nichts offen");
    assert.equal((await p("/api/e9/freigabe", { code: "012" })).data.alles, true, "Lehrercode: alles offen");
    assert.equal((await p("/api/e9/lehrer/freigabe/setzen", { password: "falsch", klasse: "9aM", art: "thema", id: "u1", offen: false })).status, 401);
    assert.equal((await p("/api/e9/freigabe", { code: "555" })).status, 401);
    assert.ok(["e7", "e8", "e9"].every((k) => fs.existsSync(path.join(dir, k + "-freigabe.json"))), "je Stufe eine Datei");
  } finally {
    await new Promise((resolve) => s.close(resolve));
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("NT 9: eigener Stand unter /api/n9 – nichts gesetzt heißt offen, die Lehrkraft sperrt je Klasse", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "n9-freigabe-test-"));
  const app = express();
  app.use(express.json());
  const KINDER = { 901: ["9aM", "9M"], 902: ["9b", "9R"] };
  const kindZumCode = async (code) => (KINDER[code] ? { code: String(code), klasse: KINDER[code][0], zug: KINDER[code][1] } : null);
  registerNt7FreigabeRoutes(app, { dataDir: dir, teacherPassword: PW, kindZumCode, prefix: "/api/n9", datei: "n9-freigabe.json", name: "NT-9-Freigabe", stufe: 9 });
  registerNt7FreigabeRoutes(app, { dataDir: dir, teacherPassword: PW, kindZumCode, prefix: "/api/e9", datei: "e9-freigabe.json", name: "Englisch-9-Freigabe", stufe: 9 });
  const s = await new Promise((resolve) => { const x = app.listen(0, () => resolve(x)); });
  const p = (route, body) => fetch(`http://127.0.0.1:${s.address().port}` + route, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body)
  }).then(async (r) => ({ status: r.status, data: await r.json().catch(() => null) }));
  try {
    // nichts gesetzt: Die Website zeigt dann alles, was in der Liste „offen: true“ hat
    assert.deepEqual((await p("/api/n9/freigabe", { code: "901" })).data, { ok: true, klasse: "9aM", zug: "9M", themen: {}, module: {} });
    // 9aM: Kernenergie gesperrt, davon die Kernspaltung wieder offen; 9b: nur Modul 7 gesperrt
    await p("/api/n9/lehrer/freigabe/setzen", { password: PW, klasse: "9aM", art: "thema", id: "kernenergie", offen: false });
    await p("/api/n9/lehrer/freigabe/setzen", { password: PW, klasse: "9aM", art: "modul", id: "ke-kernspaltung", offen: true });
    await p("/api/n9/lehrer/freigabe/setzen", { password: PW, klasse: "9b", art: "modul", id: "m7", offen: false });
    const m = (await p("/api/n9/freigabe", { code: "901" })).data, r = (await p("/api/n9/freigabe", { code: "902" })).data;
    assert.deepEqual([m.themen, m.module], [{ kernenergie: false }, { "ke-kernspaltung": true }]);
    assert.deepEqual([r.themen, r.module], [{}, { m7: false }], "9b hat seinen eigenen Stand");
    // „Alle freischalten“ beim Themenbereich räumt die Einzel-Einträge seiner Module mit auf
    await p("/api/n9/lehrer/freigabe/setzen", { password: PW, klasse: "9aM", art: "thema", id: "kernenergie", offen: true, module: ["ke-kernspaltung", "ke-kettenreaktion"] });
    assert.deepEqual((await p("/api/n9/lehrer/freigabe", { password: PW, klasse: "9aM" })).data.module, {});
    // zurück zur Vorgabe der Website (null) – und Englisch 9 bleibt davon unberührt
    await p("/api/n9/lehrer/freigabe/setzen", { password: PW, klasse: "9b", art: "modul", id: "m7", offen: null });
    assert.deepEqual((await p("/api/n9/freigabe", { code: "902" })).data.module, {});
    assert.deepEqual((await p("/api/e9/freigabe", { code: "901" })).data.themen, {}, "eigene Datei, eigener Stand");
    assert.equal((await p("/api/n9/lehrer/freigabe/setzen", { password: PW, klasse: "7aM", art: "thema", id: "rohstoffe", offen: false })).status, 400, "nur 9. Klassen");
    assert.equal((await p("/api/n9/lehrer/freigabe/setzen", { password: "falsch", klasse: "9aM", art: "thema", id: "rohstoffe", offen: false })).status, 401);
    assert.ok(fs.existsSync(path.join(dir, "n9-freigabe.json")) && !fs.existsSync(path.join(dir, "e9-freigabe.json")), "nur die eigene Datei wird geschrieben");
  } finally {
    await new Promise((resolve) => s.close(resolve));
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
