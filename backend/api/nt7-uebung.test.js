"use strict";

// Übungs-Rückmeldung: normale offene Fragen und Quali-Training mit Bewertungspunkten
const assert = require("node:assert/strict");
const test = require("node:test");
const express = require("express");
const { registerNt7UebungRoutes } = require("./nt7-uebung");

let antwortKi = "";
async function askAnthropic(system, user) { return typeof antwortKi === "function" ? antwortKi(system, user) : antwortKi; }

let server, basis;
test.before(async () => {
  const app = express();
  app.use(express.json());
  registerNt7UebungRoutes(app, { askAnthropic, route: "/api/nt9/uebung/feedback", klasse: "Klasse 9", thema: "Organische Rohstoffe" });
  await new Promise((r) => { server = app.listen(0, "127.0.0.1", r); });
  basis = `http://127.0.0.1:${server.address().port}`;
});
test.after(() => server && server.close());

const post = async (body) => (await fetch(basis + "/api/nt9/uebung/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })).json();
const KRITERIEN = ["Erdöl wird erhitzt.", "Dämpfe steigen nach oben.", "Die Dämpfe kühlen ab.", "Sie werden wieder flüssig."];

test("Quali: die KI hakt jeden Bewertungspunkt einzeln ab", async () => {
  let gesehen = "";
  antwortKi = (system, user) => { gesehen = user; return '```json\n{"punkte":[1,1,0,1,1],"rueckmeldung":"Gut beschrieben!","tipp":"Was passiert beim Aufsteigen?"}\n```'; };
  const d = await post({ frage: "Beschreibe die Destillation.", erwartet: "…", antwort: "das öl wird heis gemacht, dampf steigt hoch und wird wieder flüsig", keywords: [], kriterien: KRITERIEN });
  assert.deepEqual(d.punkte, [1, 1, 0, 1], "genau ein Wert je Kriterium, überzählige fallen weg");
  assert.equal(d.summe, 3);
  assert.equal(d.max, 4);
  assert.equal(d.richtig, false);
  assert.equal(d.teilweise, true);
  assert.equal(d.quelle, "ki");
  assert.match(gesehen, /1\. Erdöl wird erhitzt\.\n2\. Dämpfe steigen/);
});

test("Quali: volle Punktzahl ohne Tipp, kaputte KI-Antwort fällt auf Stichwörter zurück", async () => {
  antwortKi = '{"punkte":[1,1,1,1],"rueckmeldung":"Alles drin.","tipp":"unnötig"}';
  const voll = await post({ frage: "Beschreibe die Destillation.", erwartet: "…", antwort: "erhitzen, Dämpfe steigen, kühlen ab, werden flüssig", kriterien: KRITERIEN });
  assert.equal(voll.richtig, true);
  assert.equal(voll.tipp, "");
  antwortKi = "Ich kann das nicht bewerten.";
  const kaputt = await post({ frage: "Beschreibe die Destillation.", erwartet: "…", antwort: "erhitzen und kondensieren", keywords: ["erhitz"], kriterien: KRITERIEN });
  assert.equal(kaputt.punkte, undefined);
  assert.equal(kaputt.quelle, "stichworte");
});

test("Ohne Kriterien bleibt die normale Rückmeldung", async () => {
  antwortKi = '{"richtig":true,"teilweise":false,"rueckmeldung":"Stimmt.","tipp":""}';
  const d = await post({ frage: "Was ist Erdöl?", erwartet: "Ein Gemisch.", antwort: "ein gemisch aus vielen stoffen" });
  assert.equal(d.richtig, true);
  assert.equal(d.punkte, undefined);
});
