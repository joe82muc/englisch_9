"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const express = require("express");
const { registerDeutsch9GrammatikRoutes } = require("./deutsch9-grammatik");

let server;
let baseUrl;
let kiModus = "ok";
let letzteFrage = "";

test.before(async () => {
  const app = express();
  app.use(express.json());
  registerDeutsch9GrammatikRoutes(app, {
    proStunde: 3,
    kindZumCode: async (code) => (code === "123" ? { code: "123", klasse: "9aM", zug: "9M" } : code === "999" ? { gesperrt: true } : null),
    askKi: async (_system, user) => {
      letzteFrage = user;
      if (kiModus === "weg") throw new Error("offline");
      if (kiModus === "murks") return "keine Ahnung";
      return "Bewertung: " + JSON.stringify({ richtig: true, rueckmeldung: "Passt, das ist Passiv Präteritum." });
    }
  });
  await new Promise((resolve) => { server = app.listen(0, resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(() => new Promise((resolve) => server.close(resolve)));

const frage = (body) => fetch(baseUrl + "/api/d9-grammatik/pruefen", {
  method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body)
}).then(async (r) => ({ status: r.status, data: await r.json() }));

const gut = {
  code: "123", modul: "d9-sb-05", aufgabe: "d9-sb-05-b4-2", auftrag: "Forme ins Passiv Präteritum um.",
  satz: "Die Klasse kaufte die Karten.", loesungen: ["Die Karten wurden von der Klasse gekauft."],
  antwort: "Von der Klasse wurden die Karten gekauft"
};

test("prüft mit gültigem Code und gibt die KI-Rückmeldung weiter", async () => {
  kiModus = "ok";
  const { status, data } = await frage(gut);
  assert.equal(status, 200);
  assert.equal(data.richtig, true);
  assert.equal(data.quelle, "ki");
  assert.match(letzteFrage, /<<<Von der Klasse wurden/);
  assert.match(letzteFrage, /Beispiellösung/);
});

test("ohne oder mit falschem Code keine KI", async () => {
  assert.equal((await frage({ ...gut, code: "" })).status, 401);
  assert.equal((await frage({ ...gut, code: "555" })).status, 401);
  assert.equal((await frage({ ...gut, code: "999" })).status, 429);
});

test("unbekannte Aufgaben und leere Antworten werden abgelehnt", async () => {
  assert.equal((await frage({ ...gut, modul: "d9-sb-11" })).status, 400);
  assert.equal((await frage({ ...gut, aufgabe: "d9-sb-04-b1" })).status, 400);
  assert.equal((await frage({ ...gut, antwort: "  " })).status, 400);
});

test("KI-Ausfall oder unbrauchbare Antwort -> 503", async () => {
  kiModus = "weg";
  assert.equal((await frage({ ...gut, code: "123" })).status, 503);
  kiModus = "murks";
  assert.equal((await frage({ ...gut, code: "123" })).status, 503);
});

test("Grenze je Code und Stunde", async () => {
  kiModus = "ok";
  const r = await frage(gut);
  assert.equal(r.status, 429);
});

test("auch Deutsch 7 und 8 (Grammatik und Rechtschreibung) sind erlaubt", async () => {
  // eigene Kinder-Grenze: Code 123 ist schon aufgebraucht, darum nur die Prüfung der Kennung (400 vs. 429)
  assert.notEqual((await frage({ ...gut, modul: "d7-gr-03", aufgabe: "d7-gr-03-b2-1" })).status, 400);
  assert.notEqual((await frage({ ...gut, modul: "d8-rs-02", aufgabe: "d8-rs-02-p1" })).status, 400);
  assert.equal((await frage({ ...gut, modul: "d6-gr-01", aufgabe: "d6-gr-01-b1" })).status, 400);
  assert.equal((await frage({ ...gut, modul: "d7-xy-01", aufgabe: "d7-xy-01-b1" })).status, 400);
});
