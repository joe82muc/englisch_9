"use strict";

const assert = require("node:assert/strict");
const http = require("node:http");
const test = require("node:test");
const express = require("express");
const { registerNt9FortschrittRoutes, dateiStore, upstashZugang, klasseNorm, zugVon, lehrerCode } = require("./nt9-fortschritt");

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
        case "MSET": for (let i = 0; i < args.length; i += 2) daten.set(args[i], args[i + 1]); result = "OK"; break;
        case "DEL": result = args.filter((k) => daten.delete(k)).length; break;
        case "SADD": { const s = mengen.get(args[0]) || new Set(); args.slice(1).forEach((m) => s.add(m)); mengen.set(args[0], s); result = 1; break; }
        case "SREM": { const s = mengen.get(args[0]) || new Set(); result = args.slice(1).filter((m) => s.delete(m)).length; break; }
        case "SMEMBERS": result = [...(mengen.get(args[0]) || [])]; break;
        default:
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "ERR unknown command " + befehl }));
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ result }));
    });
  });
  return { server, anfragen, daten, mengen };
}

async function starte(optionen) {
  const app = express();
  app.use(express.json());
  const out = registerNt9FortschrittRoutes(app, { teacherPassword: "2", flushMs: 0, beimBeendenSichern: false, ...optionen });
  const server = await new Promise((resolve) => { const s = app.listen(0, "127.0.0.1", () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = async (route, body, headers = {}) => {
    const r = await fetch(base + route, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });
    return { status: r.status, body: await r.json() };
  };
  const get = async (route) => { const r = await fetch(base + route); return { status: r.status, body: await r.json() }; };
  return { server, post, get, store: out.store, flush: out.flush, kindZumCode: out.kindZumCode };
}
const P = "/api/nt9/fortschritt";

test("Klassennamen", () => {
  assert.equal(klasseNorm("9aM"), "9aM");
  assert.equal(klasseNorm(" 9 a m "), "9aM");
  assert.equal(klasseNorm("7B"), "7b");
  assert.equal(klasseNorm("9m"), "9M");
  assert.equal(klasseNorm("9R"), "9R");
  assert.equal(klasseNorm("9dR"), "9d", "R-Klasse mit R am Ende");
  assert.equal(klasseNorm("9 d r"), "9d");
  assert.equal(zugVon("9dR"), "9R");
  assert.equal(klasseNorm("12a"), "");
  assert.equal(klasseNorm("9ab"), "");
  assert.equal(zugVon("7aM"), "7M");
  assert.equal(zugVon("7b"), "7R");
  assert.equal(zugVon("8c"), "8R");
  assert.equal(zugVon("9d"), "9R");
  assert.equal(zugVon("9M"), "9M");
});

async function ablauf(api) {
  const { post, get } = api;

  const status = await get(P + "/status");
  assert.equal(status.body.verbunden, true);

  // Lehrkraft: falsches Passwort
  assert.equal((await post(P + "/lehrer/liste", { password: "x" })).status, 401);

  // Codes anlegen
  assert.equal((await post(P + "/lehrer/anlegen", { password: "2", klasse: "9aM", anzahl: 0 })).status, 400);
  assert.equal((await post(P + "/lehrer/anlegen", { password: "2", klasse: "12xy", anzahl: 2 })).status, 400);
  const neu = await post(P + "/lehrer/anlegen", { password: "2", klasse: "9am", anzahl: 3, namen: ["Lena"] });
  assert.equal(neu.status, 200);
  assert.equal(neu.body.neu.length, 3);
  neu.body.neu.forEach((n) => { assert.match(n.code, /^\d{3}$/); assert.equal(n.klasse, "9aM"); assert.equal(n.name, undefined); });
  assert.equal(new Set(neu.body.neu.map((n) => n.code)).size, 3);
  const lena = neu.body.neu[0].code, ben = neu.body.neu[1].code;
  const r9 = (await post(P + "/lehrer/anlegen", { password: "2", klasse: "9d", anzahl: 1 })).body.neu[0].code;
  const s7 = (await post(P + "/lehrer/anlegen", { password: "2", klasse: "7b", anzahl: 1 })).body.neu[0].code;

  // Anmelden
  assert.equal((await post(P + "/anmelden", { code: "12", klasse: "9M" })).status, 400);
  const frei = ["100", "101", "102", "103", "104", "105"].find((c) => ![lena, ben, r9, s7, neu.body.neu[2].code].includes(c));
  assert.equal((await post(P + "/anmelden", { code: frei, klasse: "9M" })).status, 404);
  const falscheKlasse = await post(P + "/anmelden", { code: r9, klasse: "9M" });
  assert.equal(falscheKlasse.status, 409, "Seite 9M, Code aus 9d (R-Zug)");
  assert.equal(falscheKlasse.body.klasse, "9d");
  assert.equal((await post(P + "/anmelden", { code: r9, klasse: "9R" })).status, 200, "Zug passt");
  const an = await post(P + "/anmelden", { code: lena, klasse: "9M" });
  assert.equal(an.status, 200);
  assert.equal(an.body.klasse, "9aM");
  assert.equal(an.body.zug, "9M");
  assert.equal(an.body.name, undefined, "der Server kennt keine Namen");
  assert.deepEqual(an.body.fortschritt, {});

  // Melden: Vereinigung der gelösten Aufgaben, Katalog, Schutz gegen Unsinn
  assert.equal((await post(P + "/melden", { code: lena, klasse: "9M", modul: "m99", geloest: ["a"] })).status, 400);
  assert.equal((await post(P + "/melden", { code: lena, klasse: "9R", modul: "m06", geloest: ["a"] })).status, 409);
  let m = await post(P + "/melden", {
    code: lena, klasse: "9M", modul: "m06", geloest: ["mc1-0", "duell", "bö<se>"], gesamt: 72,
    katalog: { "mc1-0": ["Ankreuzen: Welcher Vorgang …", "1"], duell: ["Duell gegen den Klimaleugner", "7"], "x y": ["kaputt", "1"] }
  });
  assert.equal(m.status, 200);
  assert.equal(m.body.anzahl, 2);
  m = await post(P + "/melden", { code: lena, klasse: "9aM", modul: "m06", geloest: ["kreuz"], gesamt: 72 });
  assert.equal(m.body.anzahl, 3, "frühere Aufgaben bleiben erhalten; echte Klasse statt Zug geht auch");

  const wieder = await post(P + "/anmelden", { code: lena, klasse: "9M", modul: "m06" });
  assert.deepEqual(wieder.body.fortschritt.m06.g.sort(), ["duell", "kreuz", "mc1-0"]);
  assert.equal(wieder.body.fortschritt.m06.t, 72);
  assert.equal(wieder.body.modulOk, true);

  // Lehreransicht
  const liste = await post(P + "/lehrer/liste", { password: "2" });
  assert.equal(liste.status, 200);
  assert.equal(liste.body.schueler.length, 5);
  assert.deepEqual(liste.body.klassen, ["7b", "9aM", "9d"]);
  assert.deepEqual(liste.body.klassenInfo.find((k) => k.klasse === "7b"), { klasse: "7b", zug: "7R", stufe: 7, anzahl: 1 });
  const l = liste.body.schueler.find((s) => s.code === lena);
  assert.deepEqual(Object.keys(l.module.m06.g).sort(), ["duell", "kreuz", "mc1-0"]);
  assert.equal(l.module.m06.t, 72);
  assert.deepEqual(liste.body.katalog.m06, { "mc1-0": ["Ankreuzen: Welcher Vorgang …", "1"], duell: ["Duell gegen den Klimaleugner", "7"] });
  assert.equal(liste.body.module.length, 11); // inkl. NT 9 Modul 6 (m07) und Modul 7 (m08)
  assert.deepEqual(liste.body.kurse.map((k) => k.id), ["nt7", "nt9", "d7", "d8", "d9", "e7", "e8", "e9", "i7", "i8", "i9"]);
  assert.deepEqual(liste.body.kurse.find((k) => k.id === "e8").zuege, ["R"]);
  assert.equal(liste.body.kurse.find((k) => k.id === "i9").fachName, "Informatik");
  const nur9aM = await post(P + "/lehrer/liste", { password: "2", klasse: "9aM", kurs: "nt9" });
  assert.equal(nur9aM.body.schueler.length, 3);
  const klassenWahl = await post(P + "/lehrer/liste", { password: "2", nurKlassen: true });
  assert.equal(klassenWahl.body.schueler.length, 5);
  assert.deepEqual(klassenWahl.body.module, []);
  assert.ok(klassenWahl.body.schueler.every((s) => Object.keys(s.module).length === 0));
  assert.equal(klassenWahl.body.klassenInfo.length, 3);

  // Englisch: festes Modul, Teil-Namen als Station, Katalog beim Anmelden
  const e = await post(P + "/melden", {
    code: lena, klasse: "9M", modul: "e9u1g1", geloest: ["a1", "c2"], gesamt: 25,
    katalog: { a1: ["Test yourself · Aufgabe 1", "Test yourself"], a2: ["Test yourself · Aufgabe 2", "Test yourself"], c2: ["Was ist richtig? · Aufgabe 2", "Was ist <b>richtig?"] }
  });
  assert.equal(e.status, 200);
  const mitKatalog = await post(P + "/anmelden", { code: lena, kurs: "e9", katalog: true });
  assert.deepEqual(mitKatalog.body.fortschritt.e9u1g1.g.sort(), ["a1", "c2"]);
  assert.deepEqual(Object.keys(mitKatalog.body.katalog), ["e9u1g1"], "nur Module des Kurses");
  assert.equal(mitKatalog.body.katalog.e9u1g1.c2[1], "Was ist brichtig?");
  const ohneKatalog = await post(P + "/anmelden", { code: lena, klasse: "9M" });
  assert.equal(ohneKatalog.body.katalog, undefined);

  // Selbst angemeldete Übungsseiten
  assert.equal((await post(P + "/melden", { code: lena, modul: "d9-rs-01", geloest: ["ex-s1-1"] })).status, 400, "ohne meta unbekannt");
  assert.equal((await post(P + "/melden", { code: lena, modul: "x9-quatsch", geloest: ["a"], meta: { titel: "x" } })).status, 400, "falsches Präfix");
  assert.equal((await post(P + "/melden", { code: lena, modul: "nt8-quatsch", geloest: ["a"], meta: { titel: "x" } })).status, 400, "Kurs NT 8 gibt es nicht");
  assert.equal((await post(P + "/anmelden", { code: lena, modul: "d9-rs-01" })).body.modulOk, false);
  const d = await post(P + "/melden", {
    code: lena, klasse: "9aM", modul: "d9-rs-01", geloest: ["ex-s1-1", "ex-s1-3"], gesamt: 10,
    meta: { bereich: "Rechtschreibung: Strategien", bnr: 1, titel: "Strategie 1: <b>Wortart</b>", kurz: "S1", nr: 1 },
    katalog: { "ex-s1-1": ["Aufgabe 1", "Aufgaben"], "ex-s1-3": ["Aufgabe 3", "Aufgaben"] }
  });
  assert.equal(d.status, 200);
  assert.equal(d.body.anzahl, 2);
  assert.equal((await post(P + "/anmelden", { code: lena, modul: "d9-rs-01" })).body.modulOk, true);
  // danach geht es ohne meta; der Zug des zweiten Kindes kommt dazu
  assert.equal((await post(P + "/melden", { code: r9, modul: "d9-rs-01", geloest: ["ex-s1-2"] })).status, 200);
  const ohneKlasse = await post(P + "/anmelden", { code: r9, kurs: "d9", katalog: true });
  assert.equal(ohneKlasse.body.klasse, "9d");
  assert.deepEqual(ohneKlasse.body.fortschritt["d9-rs-01"].g, ["ex-s1-2"]);
  assert.deepEqual(Object.keys(ohneKlasse.body.katalog), ["d9-rs-01"]);
  assert.equal(ohneKlasse.body.module[0].titel, "Strategie 1: bWortart/b");
  const nurDeutsch = await post(P + "/lehrer/liste", { password: "2", kurs: "d9" });
  const mod = nurDeutsch.body.module.find((x) => x.id === "d9-rs-01");
  assert.deepEqual(mod.klassen, ["9M", "9R"]);
  assert.equal(mod.bereich, "Rechtschreibung: Strategien");
  assert.equal(mod.kurs, "d9");
  const lenaD = nurDeutsch.body.schueler.find((x) => x.code === lena);
  assert.deepEqual(Object.keys(lenaD.module), ["d9-rs-01"], "nur Module des Kurses");

  // Klasse 7: NT 7 als selbst angemeldetes Modul
  const n7 = await post(P + "/melden", { code: s7, modul: "nt7-luft", geloest: ["q1"], gesamt: 40, meta: { bereich: "Luft", titel: "Luft", nr: 1 } });
  assert.equal(n7.status, 200);
  const nt7 = await post(P + "/lehrer/liste", { password: "2", kurs: "nt7", klasse: "7b" });
  assert.deepEqual(nt7.body.module.map((x) => [x.id, x.kurs, x.klassen.join()]), [["nt7-luft", "nt7", "7R"]]);
  assert.deepEqual(Object.keys(nt7.body.schueler[0].module), ["nt7-luft"]);

  // Gleicher Katalog wird nicht noch einmal geschrieben
  const vorher = JSON.stringify(await api.store.get("nt9:k:d9-rs-01"));
  assert.ok(vorher.includes("Aufgabe 3"));

  assert.ok(liste.body.schueler.every((s) => !("name" in s)));
  assert.ok(!JSON.stringify(await api.store.get(`nt9:c:${lena}`)).includes("Lena"));
  assert.deepEqual(Object.keys((await api.store.get(`nt9:c:${lena}`)).p).sort(), ["d9-rs-01", "e9u1g1", "m06"]);

  // Klasse umbenennen (z. B. alte Codes „9M“ -> „9aM“)
  assert.equal((await post(P + "/lehrer/umbenennen", { password: "2", von: "9d", nach: "9x" })).body.anzahl, 1);
  assert.equal((await post(P + "/anmelden", { code: r9 })).body.klasse, "9x");
  assert.equal((await api.store.get(`nt9:c:${r9}`)).klasse, "9x");

  // Löschen: einzeln und eine ganze Klasse
  assert.equal((await post(P + "/anmelden", { code: ben, klasse: "9M" })).status, 200);
  assert.equal((await post(P + "/lehrer/loeschen", { password: "2", code: lena })).status, 200);
  assert.equal((await post(P + "/anmelden", { code: lena, klasse: "9M" })).status, 404);
  assert.equal((await post(P + "/melden", { code: lena, klasse: "9M", modul: "m06", geloest: ["a"] })).status, 404);
  assert.equal(await api.store.get(`nt9:c:${lena}`), null);
  const kl = await post(P + "/lehrer/loeschen", { password: "2", klasse: "9aM" });
  assert.equal(kl.body.anzahl, 2);
  const nachher = await post(P + "/lehrer/liste", { password: "2" });
  assert.deepEqual(nachher.body.klassen, ["7b", "9x"]);
  assert.deepEqual((await api.store.smembers("nt9:codes")).sort(), [r9, s7].sort());
}

test("Ablauf mit Ersatzspeicher", async () => {
  const api = await starte({ store: dateiStore(null) });
  try { await ablauf(api); } finally { await new Promise((r) => api.server.close(r)); }
});

test("Ablauf mit Upstash-REST (Attrappe)", async () => {
  const { server: up, anfragen } = upstashAttrappe();
  await new Promise((r) => up.listen(0, "127.0.0.1", r));
  const url = `http://127.0.0.1:${up.address().port}/`;
  // Werte wie aus dem .env-Kasten kopiert: mit Anführungszeichen und Leerzeichen
  const api = await starte({ env: { UPSTASH_REDIS_REST_URL: ` "${url}" `, UPSTASH_REDIS_REST_TOKEN: '"geheim"' } });
  try {
    assert.equal(api.store.art, "upstash");
    await ablauf(api);
    assert.ok(anfragen.length > 10);
    assert.ok(anfragen.every((a) => a.auth === "Bearer geheim"));
  } finally {
    await new Promise((r) => api.server.close(r));
    await new Promise((r) => up.close(r));
  }
});

test("Ältere Speicherform wird übernommen", async () => {
  const store = dateiStore(null);
  await store.sadd("nt9:codes", ["111", "222"]);
  await store.set("nt9:s:111", { code: "111", klasse: "9M", angelegt: 5 });
  await store.set("nt9:s:222", { code: "222", klasse: "9R", angelegt: 6 });
  await store.set("nt9:p:111:m06", { g: { a: 1, b: 2 }, t: 72, z: 2 });
  await store.set("nt9:p:111:d9-rs-01", { g: { x: 3 }, t: 10, z: 3 });
  await store.sadd("nt9:mods", "d9-rs-01");
  await store.set("nt9:mm:d9-rs-01", { id: "d9-rs-01", kurs: "d9", bereich: "Rechtschreibung", bnr: 1, titel: "S1", kurz: "S1", nr: 1, klassen: ["9M"] });
  const api = await starte({ store });
  try {
    const an = await api.post(P + "/anmelden", { code: "111", klasse: "9M" });
    assert.equal(an.status, 200);
    assert.deepEqual(an.body.fortschritt.m06.g.sort(), ["a", "b"]);
    assert.deepEqual(an.body.fortschritt["d9-rs-01"], { g: ["x"], t: 10 });
    assert.equal((await api.post(P + "/anmelden", { code: "222" })).body.klasse, "9R");
    const neu = await store.get("nt9:c:111");
    assert.equal(neu.klasse, "9M");
    assert.deepEqual(neu.p.m06, { g: { a: 1, b: 2 }, t: 72, z: 2 });
    assert.equal(await store.get("nt9:s:111"), null, "alte Schlüssel sind weg");
    assert.equal(await store.get("nt9:p:111:m06"), null);
    // umbenennen der alten Zug-Klasse in die echte Klasse
    assert.equal((await api.post(P + "/lehrer/umbenennen", { password: "2", von: "9M", nach: "9aM" })).body.anzahl, 1);
    assert.equal((await api.post(P + "/anmelden", { code: "111", klasse: "9M" })).status, 200, "NT-Seite 9M passt weiter");
  } finally { await new Promise((r) => api.server.close(r)); }
});

test("Meldungen werden gesammelt geschrieben", async () => {
  const { server: up, anfragen, daten } = upstashAttrappe();
  await new Promise((r) => up.listen(0, "127.0.0.1", r));
  const api = await starte({ flushMs: 1500, env: { UPSTASH_REDIS_REST_URL: `http://127.0.0.1:${up.address().port}`, UPSTASH_REDIS_REST_TOKEN: "geheim" } });
  try {
    const codes = (await api.post(P + "/lehrer/anlegen", { password: "2", klasse: "9aM", anzahl: 3 })).body.neu.map((n) => n.code);
    await api.post(P + "/anmelden", { code: codes[0] });
    const start = anfragen.length;
    for (let i = 0; i < 10; i++) {
      for (const c of codes) await api.post(P + "/melden", { code: c, modul: "m06", geloest: ["a" + i], gesamt: 72 });
    }
    // 30 Meldungen von drei Kindern: noch nichts geschrieben, Lesen kommt aus dem Speicher
    assert.equal(anfragen.length - start, 0);
    assert.deepEqual((await api.post(P + "/anmelden", { code: codes[1] })).body.fortschritt.m06.g.length, 10);
    await new Promise((r) => setTimeout(r, 1900));
    const befehle = anfragen.slice(start).map((a) => JSON.parse(a.body)[0]);
    assert.deepEqual(befehle, ["MSET"], "ein MSET für alle drei Kinder");
    assert.equal(Object.keys(JSON.parse(daten.get("nt9:c:" + codes[2])).p.m06.g).length, 10);
    // nichts Neues: kein Schreiben
    await api.post(P + "/melden", { code: codes[0], modul: "m06", geloest: ["a1"], gesamt: 72 });
    await new Promise((r) => setTimeout(r, 1900));
    assert.equal(anfragen.length - start, 1);
  } finally {
    await new Promise((r) => api.server.close(r));
    await new Promise((r) => up.close(r));
  }
});

test("Upstash nicht erreichbar oder falscher Token", async () => {
  const { server: up } = upstashAttrappe();
  await new Promise((r) => up.listen(0, "127.0.0.1", r));
  const api = await starte({ env: { UPSTASH_REDIS_REST_URL: `http://127.0.0.1:${up.address().port}`, UPSTASH_REDIS_REST_TOKEN: "Xq7geheimZ9" } });
  try {
    const status = await api.get(P + "/status");
    assert.equal(status.body.verbunden, false);
    assert.match(status.body.grund, /Token wird abgelehnt/);
    assert.ok(!JSON.stringify(status.body).includes("Xq7geheimZ9"), "der Token erscheint nicht in der Antwort");
    const an = await api.post(P + "/anmelden", { code: "123", klasse: "9M" });
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
      const r = await api.post(P + "/anmelden", { code: "555", klasse: "9M" }, { "X-Forwarded-For": "10.0.0.1" });
      assert.equal(r.status, 404);
    }
    assert.equal((await api.post(P + "/anmelden", { code: "555", klasse: "9M" }, { "X-Forwarded-For": "10.0.0.1" })).status, 429);
    assert.equal((await api.post(P + "/anmelden", { code: "555", klasse: "9M" }, { "X-Forwarded-For": "10.0.0.2" })).status, 404, "andere IP ist nicht betroffen");
    jetzt += 11 * 60 * 1000;
    assert.equal((await api.post(P + "/anmelden", { code: "555", klasse: "9M" }, { "X-Forwarded-For": "10.0.0.1" })).status, 404, "nach 10 Minuten wieder frei");
  } finally { await new Promise((r) => api.server.close(r)); }
});

test("Zugangsdaten werden großzügig gelesen", () => {
  const ziel = { url: "https://grand-raccoon-1.upstash.io", token: "AbC123=", hinweis: "" };
  const fall = (url, token) => upstashZugang({ UPSTASH_REDIS_REST_URL: url, UPSTASH_REDIS_REST_TOKEN: token });
  assert.deepEqual(fall("https://grand-raccoon-1.upstash.io", "AbC123="), ziel);
  assert.deepEqual(fall(' "https://grand-raccoon-1.upstash.io" ', '"AbC123="'), ziel, "Anführungszeichen");
  assert.deepEqual(fall("grand-raccoon-1.upstash.io", "AbC123="), ziel, "Endpoint ohne https://");
  assert.deepEqual(fall('UPSTASH_REDIS_REST_URL="https://grand-raccoon-1.upstash.io"', 'UPSTASH_REDIS_REST_TOKEN="AbC123="'), ziel, "ganze .env-Zeile");
  assert.deepEqual(fall("AbC123=", "https://grand-raccoon-1.upstash.io"), ziel, "vertauscht");
  assert.match(fall("AbC123=", "AbC123=").hinweis, /keine Upstash-Adresse/);
  assert.equal(fall("", "").url, "");
});

test("Kind zum Code für andere Module", async () => {
  const api = await starte({ store: dateiStore(null) });
  try {
    const code = (await api.post(P + "/lehrer/anlegen", { password: "2", klasse: "7aM", anzahl: 1 })).body.neu[0].code;
    assert.deepEqual(await api.kindZumCode(code), { code, klasse: "7aM", zug: "7M", lrs: false });
    assert.equal(await api.kindZumCode("1"), null);
    const frei = ["100", "101", "102"].find((c) => c !== code);
    assert.equal(await api.kindZumCode(frei), null);

    // Notenschutz LRS: nur die Lehrkraft setzt ihn, er steht in der Liste und kommt bei den Proben an
    assert.equal((await api.post(P + "/lehrer/lrs", { password: "falsch", code, lrs: true })).status, 401);
    assert.equal((await api.post(P + "/lehrer/lrs", { password: "2", code: frei, lrs: true })).status, 404);
    assert.deepEqual((await api.post(P + "/lehrer/lrs", { password: "2", code, lrs: true })).body, { ok: true, code, lrs: true });
    assert.equal((await api.kindZumCode(code)).lrs, true);
    const liste = (await api.post(P + "/lehrer/liste", { password: "2", nurKlassen: true })).body;
    assert.equal(liste.schueler.find((s) => s.code === code).lrs, true);
    await api.post(P + "/lehrer/lrs", { password: "2", code, lrs: false });
    assert.equal((await api.kindZumCode(code)).lrs, false);
  } finally { await new Promise((r) => api.server.close(r)); }
});

test("Lehrercode: meldet sich an, gehört zu keiner Klasse, speichert nichts", async () => {
  // Welcher Code gilt: ohne Angabe 000, mit führender 0 änderbar, „aus“ schaltet ab; Codes der Kinder (100–999) nie
  assert.equal(lehrerCode({}), "000");
  assert.equal(lehrerCode({ LEHRER_CODE: "042" }), "042");
  assert.equal(lehrerCode({ LEHRER_CODE: "aus" }), "");
  assert.equal(lehrerCode({ LEHRER_CODE: "742" }), "000", "ein Code, den ein Kind haben könnte, wird nicht angenommen");
  assert.equal(lehrerCode({ LEHRER_CODE: "12" }), "000");

  const api = await starte({ store: dateiStore(null) });
  try {
    const an = await api.post(P + "/anmelden", { code: "000" });
    assert.equal(an.status, 200);
    assert.deepEqual(an.body, { ok: true, code: "000", klasse: "Lehrkraft", zug: "", fortschritt: {}, lehrer: true });
    // Die Seite einer Klasse schickt ihre Klasse mit (NT 9: „9M“) – beim Lehrercode wird sie nicht verglichen
    assert.equal((await api.post(P + "/anmelden", { code: "000", klasse: "9M" })).status, 200);
    assert.equal((await api.post(P + "/anmelden", { code: "000", klasse: "7b" })).body.lehrer, true);
    assert.deepEqual(await api.kindZumCode("000"), { code: "000", klasse: "Lehrkraft", zug: "", lrs: false, lehrer: true });

    // Lernstand melden: Antwort „in Ordnung“, gespeichert wird nichts – kein Kind, kein Modul, kein Katalog
    const m = await api.post(P + "/melden", { code: "000", klasse: "7aM", modul: "nt7-luft", geloest: ["a", "b"], gesamt: 5,
      meta: { bereich: "Luft", bnr: 1, titel: "Luft", kurz: "L", nr: 1 }, katalog: { a: ["Aufgabe a", "Basis"] } });
    assert.deepEqual(m.body, { ok: true, anzahl: 0, lehrer: true });
    assert.equal(await api.store.get("nt9:c:000"), null);
    assert.deepEqual((await api.post(P + "/anmelden", { code: "000" })).body.fortschritt, {});
    const liste = (await api.post(P + "/lehrer/liste", { password: "2" })).body;
    assert.deepEqual(liste.klassen, []);
    assert.ok(!JSON.stringify(liste).includes("Lehrkraft"));

    // Kinder bekommen nie einen Code unter 100 – auch nicht, wenn sehr viele angelegt werden
    const neu = (await api.post(P + "/lehrer/anlegen", { password: "2", klasse: "7aM", anzahl: 60 })).body.neu.map((x) => x.code);
    assert.ok(neu.every((c) => +c >= 100 && c !== "000"));
    // Ein falscher Code bleibt falsch
    assert.equal((await api.post(P + "/anmelden", { code: "001" })).status, 404);
  } finally { await new Promise((r) => api.server.close(r)); }

  // Abgeschaltet oder geändert
  const aus = await starte({ store: dateiStore(null), lehrerCode: "" });
  try {
    assert.equal((await aus.post(P + "/anmelden", { code: "000" })).status, 404);
    assert.equal(await aus.kindZumCode("000"), null);
  } finally { await new Promise((r) => aus.server.close(r)); }
  const anders = await starte({ store: dateiStore(null), lehrerCode: "042" });
  try {
    assert.equal((await anders.post(P + "/anmelden", { code: "000" })).status, 404);
    assert.equal((await anders.post(P + "/anmelden", { code: "042" })).body.lehrer, true);
  } finally { await new Promise((r) => anders.server.close(r)); }
});

test("Fehlerwörter der Vokabeltrainer", async () => {
  const api = await starte({ store: dateiStore(null) });
  try {
    const code = (await api.post(P + "/lehrer/anlegen", { password: "2", klasse: "8c", anzahl: 1 })).body.neu[0].code;
    const meta = { bereich: "Vokabeln", titel: "Unit 1", nr: 1 };
    let r = await api.post(P + "/melden", { code, modul: "e8-u1-vokabeln", geloest: ["w1"], gesamt: 100, meta, fehler: { w3: [2, 0], w7: [1, 1], "x y": [1, 0], w9: [0, 0] } });
    assert.equal(r.status, 200);
    let an = await api.post(P + "/anmelden", { code });
    assert.deepEqual(an.body.fortschritt["e8-u1-vokabeln"].f, { w3: [2, 0], w7: [1, 1] }, "nur gültige Einträge mit Fehlern");
    // nur die Fehlerliste ändert sich: wird trotzdem gespeichert
    await api.post(P + "/melden", { code, modul: "e8-u1-vokabeln", geloest: ["w1"], gesamt: 100, fehler: { w3: [2, 1] } });
    an = await api.post(P + "/anmelden", { code });
    assert.deepEqual(an.body.fortschritt["e8-u1-vokabeln"].f, { w3: [2, 1] });
    // ohne fehler-Feld bleibt die Liste
    await api.post(P + "/melden", { code, modul: "e8-u1-vokabeln", geloest: ["w2"], gesamt: 100 });
    const l = await api.post(P + "/lehrer/liste", { password: "2", kurs: "e8", klasse: "8c" });
    assert.deepEqual(l.body.schueler[0].module["e8-u1-vokabeln"].f, { w3: [2, 1] });
    // leere Liste löscht
    await api.post(P + "/melden", { code, modul: "e8-u1-vokabeln", geloest: [], gesamt: 100, fehler: {} });
    an = await api.post(P + "/anmelden", { code });
    assert.equal(an.body.fortschritt["e8-u1-vokabeln"].f, undefined);
  } finally { await new Promise((r) => api.server.close(r)); }
});

test("Deutsch 7: früher angemeldete Module erscheinen unter den heutigen Bereichsnamen", async () => {
  const api = await starte({ store: dateiStore(null) });
  try {
    const [kind] = (await api.post(P + "/lehrer/anlegen", { password: "2", klasse: "7aM", anzahl: 1 })).body.neu.map((x) => x.code);
    // so stand ein Modul vor dem 06.10.2026 im Speicher
    await api.store.sadd("nt9:mods", "d7-gr-01");
    await api.store.set("nt9:mm:d7-gr-01", { id: "d7-gr-01", kurs: "d7", bereich: "Grammatik", bnr: 2, titel: "Wortarten und Pronomen", kurz: "G1", nr: 1, klassen: ["7M"] });
    // eine noch nicht neu geladene Seite meldet mit dem alten Namen, eine neue Seite mit dem neuen
    assert.equal((await api.post(P + "/melden", { code: kind, modul: "d7-rs-03", geloest: ["a"], gesamt: 7, meta: { bereich: "Rechtschreibung", bnr: 3, titel: "Getrennt oder zusammen?", kurz: "R3", nr: 3 } })).status, 200);
    assert.equal((await api.post(P + "/melden", { code: kind, modul: "d7-rs-fehler", geloest: ["check"], gesamt: 18, meta: { bereich: "Rechtschreibung und Sprachtraining", bnr: 6, titel: "Mein Fehlertraining", kurz: "Modul 8", nr: 8 } })).status, 200);
    assert.equal((await api.post(P + "/melden", { code: kind, modul: "d7-argumentationstrainer", geloest: ["s1"], gesamt: 4, meta: { bereich: "Argumentieren und diskutieren", bnr: 1, titel: "Argumentations-Führerschein", kurz: "Modul 1", nr: 1 } })).status, 200);
    await api.flush();
    const module = (await api.post(P + "/lehrer/liste", { password: "2", kurs: "d7", klasse: "7aM" })).body.module;
    const bereich = (id) => (module.find((m) => m.id === id) || {}).bereich;
    assert.equal(bereich("d7-gr-01"), "Grammatik und Sprache");
    assert.equal(bereich("d7-rs-03"), "Rechtschreibung und Sprachtraining");
    assert.equal(bereich("d7-rs-fehler"), "Rechtschreibung und Sprachtraining");
    assert.deepEqual([...new Set(module.map((m) => m.bereich))], ["Argumentieren und diskutieren", "Grammatik und Sprache", "Rechtschreibung und Sprachtraining"], "jeder Bereich einmal, in der Reihenfolge der Themenbereiche");
    assert.equal((await api.store.get("nt9:mm:d7-rs-03")).bnr, 6, "gespeichert wird gleich der heutige Stand");
  } finally { await new Promise((ok) => api.server.close(ok)); }
});
