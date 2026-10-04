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
      : code === "456" ? { code: "456", klasse: "7d", zug: "7R" } : code === "999" ? { gesperrt: true } : null)
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
