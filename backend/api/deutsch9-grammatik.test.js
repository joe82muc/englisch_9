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
      : code === "225" ? { code: "225", klasse: "7aM", zug: "7M" }
      : code === "559" ? { code: "559", klasse: "8aM", zug: "8M" }
      : code === "999" ? { gesperrt: true } : null),
    askKi: async (system, user) => {
      letzteFrage = user;
      letztesSystem = system;
      if (kiModus === "weg") throw new Error("offline");
      // KI-Hilfe (Englisch 8M): Die „KI“ verrät hier absichtlich die Lösung – der Server muss sie in Stufe 1 verdecken
      if (kiModus === "hilfe") return JSON.stringify({ hinweise: ["Du brauchst 'has', nicht 'have'. Bei he, she, it steht immer has.", "Hier fehlt die 3. Form: eaten."] });
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

test("Deutsch 7 bekommt den großzügigeren Auftrag, Deutsch 8 und 9 behalten ihren", async () => {
  const { SYSTEM_D7 } = require("./deutsch9-grammatik");
  kiModus = "ok";
  // eigener Code: Die Grenze je Stunde der anderen Codes ist schon aufgebraucht oder wird noch gebraucht
  let r = await frage({ ...gut, code: "225", modul: "d7-gr-03", aufgabe: "d7-gr-03-b2-1" });
  assert.equal(r.status, 200);
  assert.equal(letztesSystem, SYSTEM_D7);
  assert.match(letztesSystem, /Kommas zählen nur, wenn der Arbeitsauftrag ausdrücklich das Setzen von Kommas übt/);
  assert.ok(!letztesSystem.includes("Satzart, Komma)"), "die strenge Komma-Regel ist ersetzt");
  assert.match(letztesSystem, /Sei großzügig/);
  assert.match(letztesSystem, /Im Zweifel ist die Antwort richtig/);
  r = await frage({ ...gut, code: "225", modul: "d8-rs-02", aufgabe: "d8-rs-02-p1" });
  assert.equal(r.status, 200);
  assert.equal(letztesSystem, SYSTEM, "Deutsch 8 unverändert");
  assert.ok(SYSTEM.includes("Satzart, Komma)"), "Deutsch 8 und 9 behalten die strenge Regel");
  assert.doesNotMatch(SYSTEM + SYSTEM_ENGLISCH, /großzügig/);
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

/* ---------- KI-Hilfe in Stufen (Englisch 8M, seit 13.10.2026) ---------- */
const hilfe = (body) => fetch(baseUrl + "/api/d9-grammatik/hilfe", {
  method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body)
}).then(async (r) => ({ status: r.status, data: await r.json() }));

const hilfeGut = {
  code: "559", modul: "e8-m-u1-g1", aufgabe: "e8-m-u1-g1-b2", auftrag: "have oder has? Setze ein.", stufe: 1,
  saetze: [
    { satz: "My cousin ___ lived in Boston for a year.", antworten: ["have"], loesungen: ["has"] },
    { satz: "I have never ___ sushi. (eat)", antworten: ["ate"], loesungen: ["eaten"] }
  ]
};

test("KI-Hilfe: Die Sicherung verdeckt die Loesung, laesst aber stehen, was das Kind schrieb und was im Satz steht", () => {
  const { loesungVerdecken } = require("./deutsch9-grammatik");
  const s = (satz, antworten, loesungen) => ({ satz, antworten, loesungen });
  assert.equal(loesungVerdecken("Du brauchst 'has', nicht 'have'. Bei he, she, it steht has.", s("My cousin ___ lived here.", ["have"], ["has"])),
    "Du brauchst '___', nicht 'have'. Bei he, she, it steht ___.");
  // mehrere Woerter: die ganze Form und ihre Teile; 'lived' hat das Kind selbst geschrieben
  assert.equal(loesungVerdecken("Richtig ist 'have lived' - mit have, weil we mehrere sind. Dein 'lived' stimmt.", s("We ___ (live) here for six years.", ["has lived"], ["have lived"])),
    "Richtig ist '___' - mit ___, weil we mehrere sind. Dein 'lived' stimmt.");
  // Woerter, die es auch im Deutschen gibt, nur in Anfuehrungszeichen verdecken
  assert.equal(loesungVerdecken("Was war gestern? Du brauchst 'was', weil es um gestern geht.", s("The email ___ sent yesterday.", ["is"], ["was"])),
    "Was war gestern? Du brauchst '___', weil es um gestern geht.");
  // Kurzform mit Apostroph, typografisch geschrieben
  assert.equal(loesungVerdecken("Die Verneinung heisst hasn’t seen.", s("Omar ___ (not see) the film yet.", ["didn't saw"], ["hasn't seen"])), "Die Verneinung heisst ___.");
  // nichts zu verdecken: Hinweis bleibt, wie er ist
  assert.equal(loesungVerdecken("Schau auf die Person: Ist 'my cousin' einer oder mehrere?", s("My cousin ___ lived here.", ["have"], ["has"])),
    "Schau auf die Person: Ist 'my cousin' einer oder mehrere?");
});

test("KI-Hilfe Stufe 1: eigener Auftrag ohne Aufloesung, die Loesung steht nicht im Hinweis", async () => {
  const { systemHilfe, SYSTEM_HILFE } = require("./deutsch9-grammatik");
  kiModus = "hilfe";
  const { status, data } = await hilfe(hilfeGut);
  assert.equal(status, 200);
  assert.equal(data.stufe, 1);
  assert.equal(data.hinweise.length, 2);
  assert.equal(letztesSystem, systemHilfe(1));
  assert.equal(SYSTEM_HILFE, systemHilfe(1));
  assert.match(letztesSystem, /Verrate die L.sung nicht/);
  assert.doesNotMatch(letztesSystem, /Nenne jetzt die richtige Form/, "die Anweisung der zweiten Stufe steht nicht in der ersten");
  assert.match(letzteFrage, /Stufe: 1/);
  assert.match(letzteFrage, /Satz 1: My cousin ___ lived/);
  assert.match(letzteFrage, /Antwort des Kindes: <<<have>>>/);
  assert.doesNotMatch(data.hinweise[0], /\bhas\b/);
  assert.match(data.hinweise[0], /nicht 'have'/, "die Antwort des Kindes bleibt lesbar");
  assert.doesNotMatch(data.hinweise[1], /eaten/);
});

test("KI-Hilfe Stufe 2: Jetzt darf die Form genannt werden", async () => {
  const { systemHilfe } = require("./deutsch9-grammatik");
  kiModus = "hilfe";
  const { status, data } = await hilfe({ ...hilfeGut, stufe: 2 });
  assert.equal(status, 200);
  assert.equal(data.stufe, 2);
  assert.equal(letztesSystem, systemHilfe(2));
  assert.match(letztesSystem, /Nenne jetzt die richtige Form/);
  assert.doesNotMatch(letztesSystem, /Verrate die L.sung nicht/);
  assert.match(data.hinweise[0], /'has'/);
  assert.match(data.hinweise[1], /eaten/);
});

test("KI-Hilfe: nur fuer die Seiten der 8M, nur mit Code, mit Grenze je Stunde", async () => {
  kiModus = "hilfe";
  assert.equal((await hilfe({ ...hilfeGut, modul: "e8-u1-g1", aufgabe: "e8-u1-g1-b2" })).status, 400, "8R hat keine KI-Hilfe");
  assert.equal((await hilfe({ ...hilfeGut, modul: "d7-gr-03", aufgabe: "d7-gr-03-b2" })).status, 400);
  assert.equal((await hilfe({ ...hilfeGut, aufgabe: "e8-m-u1-g2-b2" })).status, 400, "Aufgabe einer anderen Seite");
  assert.equal((await hilfe({ ...hilfeGut, saetze: [] })).status, 400);
  assert.equal((await hilfe({ ...hilfeGut, code: "" })).status, 401);
  assert.equal((await hilfe({ ...hilfeGut, code: "999" })).status, 429);
  assert.equal((await hilfe(hilfeGut)).status, 200, "dritte Frage dieser Stunde");
  assert.equal((await hilfe(hilfeGut)).status, 429, "vierte Frage: Grenze erreicht");
  kiModus = "murks";
  assert.equal((await hilfe({ ...hilfeGut, code: "225" })).status, 503);
  kiModus = "ok";
});