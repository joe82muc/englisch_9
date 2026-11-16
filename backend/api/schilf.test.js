"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const { registerSchilfRoutes, nameSauber } = require("./schilf");

const PW = "lehrer-geheim";
let server, baseUrl, dataDir, K = "";
let zeit = new Date("2026-11-16T10:00:00Z");

test.before(async () => {
  dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "schilf-test-"));
  const app = express();
  app.use(express.json());
  registerSchilfRoutes(app, { dataDir, teacherPassword: PW, jetzt: () => zeit, lehrerCode: () => "000", probeCodes: ["011", "012", "013"] });
  await new Promise((resolve) => { server = app.listen(0, resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
  fs.rmSync(dataDir, { recursive: true, force: true });
});

const post = async (route, body) => {
  const r = await fetch(baseUrl + route, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  return { status: r.status, data: await r.json() };
};

test("Ohne angelegten Schlüssel ist die Seite für alle zu – auch mit leerem Schlüssel", async () => {
  for (const k of [undefined, "", "abc"]) {
    const r = await post("/api/schilf/stand", { k });
    assert.equal(r.status, 403);
    assert.equal(r.data.error, "schluessel");
  }
});

test("Schlüssel holen nur mit dem Passwort; er bleibt gleich, bis die Lehrkraft einen neuen verlangt", async () => {
  assert.equal((await post("/api/schilf/lehrer/schluessel", { password: "falsch" })).status, 401);
  assert.equal((await post("/api/schilf/lehrer/schluessel", { password: 1234 })).status, 401, "Zahl statt Text bricht nichts");
  const a = await post("/api/schilf/lehrer/schluessel", { password: PW });
  assert.equal(a.status, 200);
  assert.match(a.data.schluessel, /^[\w-]{16}$/);
  const b = await post("/api/schilf/lehrer/schluessel", { password: PW });
  assert.equal(b.data.schluessel, a.data.schluessel);
  K = a.data.schluessel;
  assert.ok(!JSON.stringify(require("./schilf")).includes(K));
});

test("Mit dem Schlüssel: Stand mit 5 freien Plätzen, Lehrercode und Hinweis auf Probe-Codes; falscher Schlüssel 403", async () => {
  const r = await post("/api/schilf/stand", { k: K });
  assert.deepEqual(r.data, { ok: true, plaetze: 5, belegt: 0, frei: 5, lehrerCode: "000", probeCodes: true });
  assert.equal((await post("/api/schilf/stand", { k: K.slice(0, -1) + (K.endsWith("a") ? "b" : "a") })).status, 403);
  assert.equal((await post("/api/schilf/anmelden", { k: "falsch", name: "Frau Test" })).status, 403);
  assert.equal((await post("/api/schilf/probecode", { k: "falsch" })).status, 403);
});

test("Anmelden: Name nötig, Wochentage nur Mo–Fr, gleicher Name zählt nur einmal", async () => {
  assert.equal((await post("/api/schilf/anmelden", { k: K, name: " " })).status, 400);
  assert.equal((await post("/api/schilf/anmelden", { k: K, name: "x" })).status, 400);
  const a = await post("/api/schilf/anmelden", { k: K, name: "  Anna   Beispiel ", tage: ["Mo", "Do", "Sa", "<b>"] });
  assert.equal(a.status, 200);
  assert.deepEqual([a.data.platz, a.data.belegt, a.data.frei], [1, 1, 4]);
  const b = await post("/api/schilf/anmelden", { k: K, name: "anna beispiel", tage: ["Di"] });
  assert.equal(b.data.schon, true);
  assert.equal(b.data.belegt, 1);
  const l = await post("/api/schilf/lehrer/liste", { password: PW });
  assert.equal(l.data.anmeldungen.length, 1);
  assert.equal(l.data.anmeldungen[0].name, "Anna Beispiel");
  assert.deepEqual(l.data.anmeldungen[0].tage, ["Di"], "Wochentage aufgefrischt");
  assert.equal(l.data.anmeldungen[0].am, "2026-11-16");
  assert.equal(nameSauber("<script>Max</script>"), "script Max /script");
});

test("Höchstens 5 Plätze: die sechste Anmeldung bekommt 409 „voll“; nach dem Löschen ist wieder Platz", async () => {
  for (const n of ["Bert", "Carla", "Dora", "Emil"]) assert.equal((await post("/api/schilf/anmelden", { k: K, name: n })).status, 200);
  const voll = await post("/api/schilf/anmelden", { k: K, name: "Fritz" });
  assert.equal(voll.status, 409);
  assert.equal(voll.data.error, "voll");
  assert.equal(voll.data.frei, 0);
  assert.equal((await post("/api/schilf/stand", { k: K })).data.frei, 0);
  const liste = (await post("/api/schilf/lehrer/liste", { password: PW })).data.anmeldungen;
  assert.equal((await post("/api/schilf/lehrer/loeschen", { password: "nein", id: liste[1].id })).status, 401);
  assert.equal((await post("/api/schilf/lehrer/loeschen", { password: PW, id: "gibtsnicht" })).status, 404);
  const weg = await post("/api/schilf/lehrer/loeschen", { password: PW, id: liste[1].id });
  assert.deepEqual([weg.data.ok, weg.data.frei], [true, 1]);
  assert.equal((await post("/api/schilf/anmelden", { k: K, name: "Fritz" })).data.platz, 5);
});

test("Probe-Codes reihum aus der Fortbildungsklasse", async () => {
  const codes = [];
  for (let i = 0; i < 4; i++) codes.push((await post("/api/schilf/probecode", { k: K })).data.code);
  assert.deepEqual(codes, ["011", "012", "013", "011"]);
});

test("Neuer Schlüssel: der alte QR-Code geht nicht mehr", async () => {
  const neu = await post("/api/schilf/lehrer/schluessel", { password: PW, neu: true });
  assert.notEqual(neu.data.schluessel, K);
  assert.equal((await post("/api/schilf/stand", { k: K })).status, 403);
  K = neu.data.schluessel;
  assert.equal((await post("/api/schilf/stand", { k: K })).status, 200);
});

test("Anmeldungen werden nach 180 Tagen gelöscht", async () => {
  zeit = new Date("2027-05-20T10:00:00Z");
  assert.equal((await post("/api/schilf/lehrer/liste", { password: PW })).data.anmeldungen.length, 0);
  assert.equal((await post("/api/schilf/stand", { k: K })).data.frei, 5);
});

test("Ohne Probe-Codes (Fortbildungs-Codes aus): 404 und probeCodes false", async () => {
  const app = express(); app.use(express.json());
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "schilf-test-aus-"));
  registerSchilfRoutes(app, { dataDir: dir, teacherPassword: PW, probeCodes: [] });
  const s = await new Promise((resolve) => { const x = app.listen(0, () => resolve(x)); });
  const b = `http://127.0.0.1:${s.address().port}`;
  const p = async (route, body) => { const r = await fetch(b + route, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }); return { status: r.status, data: await r.json() }; };
  const k = (await p("/api/schilf/lehrer/schluessel", { password: PW })).data.schluessel;
  assert.equal((await p("/api/schilf/stand", { k })).data.probeCodes, false);
  assert.equal((await p("/api/schilf/probecode", { k })).status, 404);
  await new Promise((resolve) => s.close(resolve));
  fs.rmSync(dir, { recursive: true, force: true });
});
