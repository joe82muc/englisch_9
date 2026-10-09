"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const express = require("express");
const { registerDeutsch9GrammatikRoutes, SYSTEM, SYSTEM_ENGLISCH } = require("./deutsch9-grammatik");

let server;
let baseUrl;
let kiModus = "ok";
let letzteFrage = "";
let letztesSystem = "";

test.before(async () => {
  const app = express();
  app.use(express.json());
  registerDeutsch9GrammatikRoutes(app, {
    proStunde: 3,
    kindZumCode: async (code) => (code === "123" ? { code: "123", klasse: "9aM", zug: "9M" } : code === "734" ? { code: "734", klasse: "8b", zug: "8R" }
      : code === "999" ? { gesperrt: true } : null),
    askKi: async (system, user) => {
      letzteFrage = user;
      letztesSystem = system;
      if (kiModus === "weg") throw new Error("offline");
      if (kiModus === "murks") return "keine Ahnung";
      // englisches Zitat in doppelten Anführungszeichen, nicht maskiert: kein gültiges JSON
      if (kiModus === "zitat") return '{"richtig":false,"rueckmeldung":"Nach "How about" steht die -ing-Form."}';
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
  assert.equal(letztesSystem, SYSTEM);
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

const englisch = {
  code: "734", modul: "e8-u3-w1", aufgabe: "e8-u3-w1-p2-1", auftrag: "Mach selbst einen Vorschlag für den Klassenausflug – und begründe ihn. Dein Vorschlag:",
  loesungen: ["Why don't we go to the climbing park because everybody likes it?"], kriterien: ["ein Vorschlag mit Let's, Why don't we, How about, We could oder Shall we"],
  antwort: "How about going to the zoo? Its fun."
};

test("Englisch 8R: Grammatik- und Wordbank-Seiten fragen mit der englischen Anweisung", async () => {
  kiModus = "ok";
  const { status, data } = await frage(englisch);
  assert.equal(status, 200);
  assert.equal(data.richtig, true);
  assert.equal(letztesSystem, SYSTEM_ENGLISCH);
  assert.match(letzteFrage, /Klassenstufe: 8/);
  assert.match(letzteFrage, /<<<How about going to the zoo/);
  assert.match(SYSTEM_ENGLISCH, /Englisch/);
  assert.match(SYSTEM_ENGLISCH, /milde/);
  assert.match(SYSTEM_ENGLISCH, /Britische und amerikanische/);
  assert.equal((await frage({ ...englisch, modul: "e8-u4-g13", aufgabe: "e8-u4-g13-b5-2" })).status, 200);
});

test("Englisch: falsche Kennungen werden abgelehnt", async () => {
  assert.equal((await frage({ ...englisch, modul: "e8-u1-x1", aufgabe: "e8-u1-x1-b1-1" })).status, 400);
  assert.equal((await frage({ ...englisch, modul: "e6-u1-g1", aufgabe: "e6-u1-g1-b1-1" })).status, 400);
  assert.equal((await frage({ ...englisch, modul: "e8-u1-g1", aufgabe: "e8-u1-g10-b1-1" })).status, 400);   // Aufgabe einer anderen Seite
  assert.equal((await frage({ ...englisch, modul: "e8-u1-vokabeln", aufgabe: "e8-u1-vokabeln-b1" })).status, 400);
});

test("nicht maskierte Anführungszeichen in der Rückmeldung: Urteil und Text bleiben lesbar", async () => {
  kiModus = "zitat";
  const { status, data } = await frage({ ...englisch, antwort: "How about go to the zoo?" });
  assert.equal(status, 200);
  assert.equal(data.richtig, false);
  assert.equal(data.rueckmeldung, 'Nach "How about" steht die -ing-Form.');
  kiModus = "ok";
});
