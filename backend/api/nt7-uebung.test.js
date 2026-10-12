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

test("Nachsicht (Deutsch 7): Der Kern genügt – andere Fächer behalten ihren Auftrag", async () => {
  const app = express();
  app.use(express.json());
  const auftraege = {};
  const ki = (name) => async (system) => { auftraege[name] = system; return '{"richtig":true,"teilweise":false,"rueckmeldung":"Passt.","tipp":""}'; };
  registerNt7UebungRoutes(app, { askAnthropic: ki("d7"), route: "/api/d7/uebung/feedback", klasse: "Klasse 7", fach: "Deutsch", nachsicht: true, thema: "Deutsch" });
  registerNt7UebungRoutes(app, { askAnthropic: ki("d8"), route: "/api/d8/uebung/feedback", klasse: "Klasse 8", fach: "Deutsch", thema: "Deutsch" });
  registerNt7UebungRoutes(app, { askAnthropic: ki("e9"), route: "/api/e9/uebung/feedback", klasse: "Klasse 9", fach: "Englisch", sprache: "en", thema: "Englisch" });
  const s = await new Promise((r) => { const x = app.listen(0, "127.0.0.1", () => r(x)); });
  try {
    const frage = { frage: "Finde eine eigene Zwischenüberschrift.", erwartet: "Zum Beispiel: Der Biber schafft neue Lebensräume.", antwort: "Biber helfen anderen Tieren" };
    for (const kurs of ["d7", "d8", "e9"]) {
      const r = await fetch(`http://127.0.0.1:${s.address().port}/api/${kurs}/uebung/feedback`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(frage) });
      assert.equal((await r.json()).richtig, true);
    }
    assert.match(auftraege.d7, /Sei großzügig/);
    assert.match(auftraege.d7, /Ein passender, sinnvoller Gedanke genügt/);
    assert.match(auftraege.d7, /Im Zweifel ist die Antwort richtig/);
    assert.doesNotMatch(auftraege.d7, /alle wichtigen Inhalte da/);
    // Deutsch 8 und Englisch 9: wortgleich wie bisher
    const alt = (fach, klasse, fremd) => [
      `Du prüfst eine offene Übungsaufgabe in ${fach}, ${klasse} einer bayerischen Mittelschule. Thema: ${fach}.`,
      "Bewerte nur den fachlichen Inhalt. Rechtschreibung, Grammatik und Stil zählen nicht. Eigene Worte und Stichpunkte sind erlaubt.",
      "Sei wohlwollend, aber fachlich korrekt. Falsche Aussagen nicht belohnen."
    ].join("\n") + "\n" + (fremd ? "Das Fach ist Englisch" : "richtig = alle wichtigen Inhalte da. teilweise = Ansatz stimmt, etwas Wichtiges fehlt.");
    assert.ok(auftraege.d8.startsWith(alt("Deutsch", "Klasse 8", false)), "Deutsch 8 unverändert");
    assert.ok(auftraege.e9.startsWith(alt("Englisch", "Klasse 9", true)), "Englisch 9 unverändert");
    assert.match(auftraege.e9, /richtig = alle wichtigen Inhalte da/);
    assert.doesNotMatch(auftraege.d8 + auftraege.e9, /großzügig/);
  } finally { await new Promise((r) => s.close(r)); }
});
