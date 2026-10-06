"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const { registerUebersetzen, marken, geschachtelt } = require("./uebersetzen");

let server, baseUrl, dataDir, modul;
let kiAufrufe = [], kiModus = "ok", zeit = new Date("2026-10-07T08:00:00Z");

test.before(async () => {
  dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "uebersetzen-test-"));
  const app = express();
  app.use(express.json());
  modul = registerUebersetzen(app, {
    dataDir, jetzt: () => zeit, neuJeCode: 400,
    kindZumCode: async (code) => (code === "734" ? { code: "734", klasse: "8aM", zug: "8M" } : code === "000" ? { code: "000", klasse: "Lehrkraft", lehrer: true } : code === "999" ? { gesperrt: true } : null),
    askKi: async (system, user) => {
      kiAufrufe.push({ system, user });
      const texte = JSON.parse(user);
      if (kiModus === "weg") throw new Error("offline");
      if (kiModus === "murks") return "Hier ist die Übersetzung.";
      if (kiModus === "kurz") return JSON.stringify(texte.slice(1).map((t) => "EN " + t));
      if (kiModus === "marken") return JSON.stringify(texte.map((t) => "EN " + t.replace(/<\/?g\d+>|<x\d+\/>/g, "")));
      if (kiModus === "langsam") await new Promise((ok) => setTimeout(ok, 120));
      return "Gern: " + JSON.stringify(texte.map((t) => "EN " + t));
    }
  });
  await new Promise((resolve) => { server = app.listen(0, resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});
test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
  fs.rmSync(dataDir, { recursive: true, force: true });
});
const post = (body) => fetch(baseUrl + "/api/uebersetzen", {
  method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body)
}).then(async (r) => ({ status: r.status, data: await r.json() }));

test("Markierungen: gleiche Marken und richtige Schachtelung", () => {
  assert.equal(marken("Klicke auf <g1>Start</g1> <x2/>."), marken("<x2/> <g1>Start</g1> anklicken."));
  assert.notEqual(marken("<g1>a</g1>"), marken("a"));
  assert.equal(geschachtelt("<g1>a <g2>b</g2></g1>"), true);
  assert.equal(geschachtelt("<g1>a <g2>b</g1></g2>"), false);
  assert.equal(geschachtelt("</g1>a<g1>"), false);
});

test("Nur bekannte Sprachen, begrenzte Menge", async () => {
  assert.equal((await post({ sprache: "fr", texte: ["Hallo"] })).status, 400);
  assert.equal((await post({ sprache: "de", texte: ["Hallo"] })).status, 400);
  assert.equal((await post({ sprache: "en", texte: "Hallo" })).status, 400);
  assert.equal((await post({ sprache: "en", texte: Array.from({ length: 81 }, (_, i) => "Text " + i) })).status, 400);
  assert.equal((await post({ sprache: "en", texte: ["x".repeat(1501)] })).status, 400);
  assert.equal(kiAufrufe.length, 0);
});

test("Ohne Code wird nichts Neues übersetzt – die Seite bittet um Anmeldung", async () => {
  const r = await post({ sprache: "en", texte: ["Öffne die Tabelle."], fest: true });
  assert.deepEqual(r.data, { ok: true, texte: [null], anmelden: true });
  assert.deepEqual((await post({ sprache: "en", texte: ["Öffne die Tabelle."], code: "555", fest: true })).data.texte, [null]);
  assert.equal((await post({ sprache: "en", texte: ["Öffne die Tabelle."], code: "999", fest: true })).data.anmelden, true);
  assert.equal(kiAufrufe.length, 0);
});

test("Mit Code: übersetzt, gespeichert – danach bekommt es jeder ohne KI und ohne Code", async () => {
  const texte = ["Öffne die Tabelle.", "Klicke auf <g1>Start</g1>.", "", "Öffne die Tabelle."];
  const r = await post({ sprache: "en", texte, code: "734", fest: true });
  assert.deepEqual(r.data, { ok: true, texte: ["EN Öffne die Tabelle.", "EN Klicke auf <g1>Start</g1>.", "", "EN Öffne die Tabelle."] });
  assert.equal(kiAufrufe.length, 1);
  assert.deepEqual(JSON.parse(kiAufrufe[0].user), ["Öffne die Tabelle.", "Klicke auf <g1>Start</g1>."], "doppelte und leere Texte gehen nicht an die KI");
  assert.match(kiAufrufe[0].system, /ins Englisch\./);
  assert.equal((kiAufrufe[0].system + kiAufrufe[0].user).includes("734"), false, "der Code geht nicht an die KI");
  assert.equal(fs.existsSync(path.join(dataDir, "uebersetzungen-en.json")), true);
  const gast = await post({ sprache: "en", texte: ["Klicke auf <g1>Start</g1>.", "Öffne die Tabelle."] });
  assert.deepEqual(gast.data, { ok: true, texte: ["EN Klicke auf <g1>Start</g1>.", "EN Öffne die Tabelle."] });
  assert.equal(kiAufrufe.length, 1);
  // andere Sprache: eigener Speicher, auch mit dem Lehrercode
  const hu = await post({ sprache: "hu", texte: ["Öffne die Tabelle."], code: "000", fest: true });
  assert.deepEqual(hu.data.texte, ["EN Öffne die Tabelle."]);
  assert.match(kiAufrufe[1].system, /ins Ungarisch\./);
  assert.equal(Object.keys(modul.speicher("hu")).length, 1);
  assert.equal(Object.keys(modul.speicher("uk")).length, 0);
});

test("Was erst beim Arbeiten entsteht (fest fehlt), wird übersetzt, aber nicht aufbewahrt", async () => {
  const vorher = Object.keys(modul.speicher("en")).length;
  const r = await post({ sprache: "en", texte: ["Deine Antwort war fast richtig."], code: "734" });
  assert.deepEqual(r.data.texte, ["EN Deine Antwort war fast richtig."]);
  assert.equal(Object.keys(modul.speicher("en")).length, vorher);
  assert.deepEqual((await post({ sprache: "en", texte: ["Deine Antwort war fast richtig."] })).data.texte, [null]);
});

test("Antwort der KI unbrauchbar: Text bleibt deutsch (null) und wird nicht gespeichert", async () => {
  zeit = new Date("2026-10-07T09:00:00Z");
  const vorher = Object.keys(modul.speicher("en")).length;
  for (const modus of ["weg", "murks", "kurz", "marken"]) {
    kiModus = modus;
    const r = await post({ sprache: "en", texte: ["Markiere <g1>B3</g1> und <x2/>.", "Zweiter Satz mit <g1>Marke</g1>."], code: "734", fest: true });
    assert.deepEqual(r.data.texte, [null, null], modus);
  }
  kiModus = "ok";
  assert.equal(Object.keys(modul.speicher("en")).length, vorher);
});

test("Dieselben Texte gleichzeitig von zwei Kindern: nur eine Anfrage an die KI", async () => {
  zeit = new Date("2026-10-07T10:00:00Z");
  kiModus = "langsam";
  const vorher = kiAufrufe.length;
  const [a, b] = await Promise.all([
    post({ sprache: "uk", texte: ["Speichere die Datei."], code: "734", fest: true }),
    post({ sprache: "uk", texte: ["Speichere die Datei."], code: "000", fest: true })
  ]);
  kiModus = "ok";
  assert.deepEqual([a.data.texte, b.data.texte], [["EN Speichere die Datei."], ["EN Speichere die Datei."]]);
  assert.equal(kiAufrufe.length - vorher, 1);
});

test("Grenze je Code: danach nur noch, was schon gespeichert ist", async () => {
  zeit = new Date("2026-10-07T11:00:00Z");
  const lang = "Dieser Satz ist ungefähr einhundert Zeichen lang, damit die Grenze von vierhundert Zeichen schnell erreicht ist. ";
  for (let i = 0; i < 3; i++) assert.equal((await post({ sprache: "hr", texte: [lang + i], code: "734", fest: true })).data.texte[0], "EN " + (lang + i).trim());
  const voll = await post({ sprache: "hr", texte: [lang + "4", lang + "0"], code: "734", fest: true });
  assert.deepEqual(voll.data, { ok: true, texte: [null, "EN " + (lang + "0").trim()], voll: true });
  zeit = new Date("2026-10-07T11:11:00Z"); // zehn Minuten später geht es weiter
  assert.equal((await post({ sprache: "hr", texte: [lang + "4"], code: "734", fest: true })).data.texte[0], "EN " + (lang + "4").trim());
});
