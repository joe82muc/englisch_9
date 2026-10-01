"use strict";

const assert = require("node:assert/strict");
const http = require("node:http");
const test = require("node:test");
const express = require("express");
const { registerNt9FortschrittRoutes, dateiStore } = require("./nt9-fortschritt");

// Nachbau der Upstash-REST-Schnittstelle (nur die Befehle, die das Modul benutzt)
function upstashAttrappe() {
  const daten = new Map(), mengen = new Map(), anfragen = [];
  const server = http.createServer((req, res) => {
    let raw = "";
    req.on("data", (c) => { raw += c; });
    req.on("end", () => {
      anfragen.push({ auth: req.headers.authorization, url: req.url, body: raw });
      if (req.headers.authorization !== "Bearer geheim") {
        res.writeHead(401, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Unauthorized" }));
      }
      const [befehl, ...args] = JSON.parse(raw);
      let result = null;
      switch (befehl) {
        case "PING": result = "PONG"; break;
        case "GET": result = daten.has(args[0]) ? daten.get(args[0]) : null; break;
        case "SET": daten.set(args[0], args[1]); result = "OK"; break;
        case "MGET": result = args.map((k) => (daten.has(k) ? daten.get(k) : null)); break;
        case "DEL": result = args.filter((k) => daten.delete(k)).length; break;
        case "SADD": { const s = mengen.get(args[0]) || new Set(); s.add(args[1]); mengen.set(args[0], s); result = 1; break; }
        case "SREM": { const s = mengen.get(args[0]) || new Set(); result = s.delete(args[1]) ? 1 : 0; break; }
        case "SMEMBERS": result = [...(mengen.get(args[0]) || [])]; break;
        default:
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "ERR unknown command " + befehl }));
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ result }));
    });
  });
  return { server, anfragen };
}

async function starte(optionen) {
  const app = express();
  app.use(express.json());
  const out = registerNt9FortschrittRoutes(app, { teacherPassword: "2", ...optionen });
  const server = await new Promise((resolve) => { const s = app.listen(0, "127.0.0.1", () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = async (route, body, headers = {}) => {
    const r = await fetch(base + route, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });
    return { status: r.status, body: await r.json() };
  };
  const get = async (route) => { const r = await fetch(base + route); return { status: r.status, body: await r.json() }; };
  return { server, post, get, store: out.store };
}

async function ablauf(t, api) {
  const { post, get } = api;
  void t;

  const status = await get("/api/nt9/fortschritt/status");
  assert.equal(status.body.verbunden, true);

  // Lehrkraft: falsches Passwort
  assert.equal((await post("/api/nt9/fortschritt/lehrer/liste", { password: "x" })).status, 401);

  // Codes anlegen
  assert.equal((await post("/api/nt9/fortschritt/lehrer/anlegen", { password: "2", klasse: "9M", anzahl: 0 })).status, 400);
  assert.equal((await post("/api/nt9/fortschritt/lehrer/anlegen", { password: "2", klasse: "9X", anzahl: 2 })).status, 400);
  const neu = await post("/api/nt9/fortschritt/lehrer/anlegen", { password: "2", klasse: "9m", anzahl: 3, namen: ["Lena"] });
  assert.equal(neu.status, 200);
  assert.equal(neu.body.neu.length, 3);
  neu.body.neu.forEach((n) => { assert.match(n.code, /^\d{3}$/); assert.equal(n.klasse, "9M"); assert.equal(n.name, undefined); });
  assert.equal(new Set(neu.body.neu.map((n) => n.code)).size, 3);
  const lena = neu.body.neu[0].code, ben = neu.body.neu[1].code;
  const r9 = (await post("/api/nt9/fortschritt/lehrer/anlegen", { password: "2", klasse: "9R", anzahl: 1 })).body.neu[0].code;

  // Anmelden
  assert.equal((await post("/api/nt9/fortschritt/anmelden", { code: "12", klasse: "9M" })).status, 400);
  const frei = ["100", "101", "102", "103", "104"].find((c) => ![lena, ben, r9, neu.body.neu[2].code].includes(c));
  const unbekannt = await post("/api/nt9/fortschritt/anmelden", { code: frei, klasse: "9M" });
  assert.equal(unbekannt.status, 404);
  const falscheKlasse = await post("/api/nt9/fortschritt/anmelden", { code: r9, klasse: "9M" });
  assert.equal(falscheKlasse.status, 409);
  assert.equal(falscheKlasse.body.klasse, "9R");
  const an = await post("/api/nt9/fortschritt/anmelden", { code: lena, klasse: "9M" });
  assert.equal(an.status, 200);
  assert.equal(an.body.name, undefined, "der Server kennt keine Namen");
  assert.deepEqual(an.body.fortschritt, {});

  // Melden: Vereinigung der gelösten Aufgaben, Katalog, Schutz gegen Unsinn
  assert.equal((await post("/api/nt9/fortschritt/melden", { code: lena, klasse: "9M", modul: "m99", geloest: ["a"] })).status, 400);
  assert.equal((await post("/api/nt9/fortschritt/melden", { code: lena, klasse: "9R", modul: "m06", geloest: ["a"] })).status, 409);
  let m = await post("/api/nt9/fortschritt/melden", {
    code: lena, klasse: "9M", modul: "m06", geloest: ["mc1-0", "duell", "bö<se>"], gesamt: 72,
    katalog: { "mc1-0": ["Ankreuzen: Welcher Vorgang …", "1"], duell: ["Duell gegen den Klimaleugner", "7"], "x y": ["kaputt", "1"] }
  });
  assert.equal(m.status, 200);
  assert.equal(m.body.anzahl, 2);
  m = await post("/api/nt9/fortschritt/melden", { code: lena, klasse: "9M", modul: "m06", geloest: ["kreuz"], gesamt: 72 });
  assert.equal(m.body.anzahl, 3, "frühere Aufgaben bleiben erhalten");

  const wieder = await post("/api/nt9/fortschritt/anmelden", { code: lena, klasse: "9M" });
  assert.deepEqual(wieder.body.fortschritt.m06.g.sort(), ["duell", "kreuz", "mc1-0"]);
  assert.equal(wieder.body.fortschritt.m06.t, 72);

  // Lehreransicht
  const liste = await post("/api/nt9/fortschritt/lehrer/liste", { password: "2" });
  assert.equal(liste.status, 200);
  assert.equal(liste.body.schueler.length, 4);
  const l = liste.body.schueler.find((s) => s.code === lena);
  assert.deepEqual(Object.keys(l.module.m06.g).sort(), ["duell", "kreuz", "mc1-0"]);
  assert.equal(l.module.m06.t, 72);
  assert.deepEqual(liste.body.katalog.m06, { "mc1-0": ["Ankreuzen: Welcher Vorgang …", "1"], duell: ["Duell gegen den Klimaleugner", "7"] });
  assert.equal(liste.body.module.length, 5);

  assert.ok(liste.body.schueler.every((s) => !("name" in s)));
  assert.ok(!JSON.stringify(await api.store.get(`nt9:s:${lena}`)).includes("Lena"));

  // Löschen
  assert.equal((await post("/api/nt9/fortschritt/anmelden", { code: ben, klasse: "9M" })).status, 200);
  assert.equal((await post("/api/nt9/fortschritt/lehrer/loeschen", { password: "2", code: lena })).status, 200);
  assert.equal((await post("/api/nt9/fortschritt/anmelden", { code: lena, klasse: "9M" })).status, 404);
  assert.equal((await post("/api/nt9/fortschritt/melden", { code: lena, klasse: "9M", modul: "m06", geloest: ["a"] })).status, 404);
  const nachher = await post("/api/nt9/fortschritt/lehrer/liste", { password: "2" });
  assert.equal(nachher.body.schueler.length, 3);
}

test("Ablauf mit Ersatzspeicher", async (t) => {
  const api = await starte({ store: dateiStore(null) });
  try { await ablauf(t, api); } finally { await new Promise((r) => api.server.close(r)); }
});

test("Ablauf mit Upstash-REST (Attrappe)", async (t) => {
  const { server: up, anfragen } = upstashAttrappe();
  await new Promise((r) => up.listen(0, "127.0.0.1", r));
  const url = `http://127.0.0.1:${up.address().port}/`;
  const api = await starte({ env: { UPSTASH_REDIS_REST_URL: url, UPSTASH_REDIS_REST_TOKEN: "geheim" } });
  try {
    assert.equal(api.store.art, "upstash");
    await ablauf(t, api);
    assert.ok(anfragen.length > 10);
    assert.ok(anfragen.every((a) => a.auth === "Bearer geheim"));
  } finally {
    await new Promise((r) => api.server.close(r));
    await new Promise((r) => up.close(r));
  }
});

test("Upstash nicht erreichbar oder falscher Token", async () => {
  const { server: up } = upstashAttrappe();
  await new Promise((r) => up.listen(0, "127.0.0.1", r));
  const api = await starte({ env: { UPSTASH_REDIS_REST_URL: `http://127.0.0.1:${up.address().port}`, UPSTASH_REDIS_REST_TOKEN: "falsch" } });
  try {
    const status = await api.get("/api/nt9/fortschritt/status");
    assert.equal(status.body.verbunden, false);
    const an = await api.post("/api/nt9/fortschritt/anmelden", { code: "123", klasse: "9M" });
    assert.equal(an.status, 503);
  } finally {
    await new Promise((r) => api.server.close(r));
    await new Promise((r) => up.close(r));
  }
});

test("Sperre nach vielen falschen Codes", async () => {
  let jetzt = 1_000_000;
  const api = await starte({ store: dateiStore(null), now: () => jetzt });
  try {
    for (let i = 0; i < 60; i++) {
      const r = await api.post("/api/nt9/fortschritt/anmelden", { code: "555", klasse: "9M" }, { "X-Forwarded-For": "10.0.0.1" });
      assert.equal(r.status, 404);
    }
    assert.equal((await api.post("/api/nt9/fortschritt/anmelden", { code: "555", klasse: "9M" }, { "X-Forwarded-For": "10.0.0.1" })).status, 429);
    assert.equal((await api.post("/api/nt9/fortschritt/anmelden", { code: "555", klasse: "9M" }, { "X-Forwarded-For": "10.0.0.2" })).status, 404, "andere IP ist nicht betroffen");
    jetzt += 11 * 60 * 1000;
    assert.equal((await api.post("/api/nt9/fortschritt/anmelden", { code: "555", klasse: "9M" }, { "X-Forwarded-For": "10.0.0.1" })).status, 404, "nach 10 Minuten wieder frei");
  } finally { await new Promise((r) => api.server.close(r)); }
});
