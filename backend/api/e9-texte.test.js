"use strict";

// Englisch 9 (9R): Die Skill-Module nutzen die Bausteine von Deutsch 7/8 mit – Schreibtrainer und Schülertexte
// (d7-texte.js mit fach: { kurz: "e" }) und die Rückmeldung zu offenen Übungsaufgaben (nt7-uebung.js, sprache: "en").
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const { registerD7TexteRoutes, systemEnglisch } = require("./d7-texte");
const { registerNt7UebungRoutes } = require("./nt7-uebung");

const PW = "Nur-ein-Test-4711";
const kindZumCode = async (code) => ({ 901: { code: "901", klasse: "9b", zug: "9R" }, 902: { code: "902", klasse: "9b", zug: "9R", lrs: true }, "000": { code: "000", klasse: "Lehrkraft", lehrer: true } })[code] || null;
const TEXT = "Dear Ben, I was in Melbourne last week. We visited a market and I tried a meat pie. It was great. Tomorrow I will go to the beach. See you soon, Lea";
const auftrag = (extra) => ({ modul: "u1-writing", aufgabe: "aufsatz", titel: "An email from my trip", auftrag: "Write an email to a friend about your trip (about 60 words).", ...extra });

async function mitServer(askAnthropic, lauf) {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "e9-texte-"));
  const app = express();
  app.use(express.json());
  registerD7TexteRoutes(app, { dataDir, stufe: 9, fach: { kurz: "e", name: "Englisch" }, teacherPassword: PW, kindZumCode, askAnthropic });
  registerD7TexteRoutes(app, { dataDir, stufe: 8, teacherPassword: PW, kindZumCode, askAnthropic });
  registerNt7UebungRoutes(app, { askAnthropic, route: "/api/e9/uebung/feedback", klasse: "Klasse 9", fach: "Englisch", sprache: "en", thema: "Englisch 9" });
  registerNt7UebungRoutes(app, { askAnthropic, route: "/api/d8/uebung/feedback", klasse: "Klasse 8", fach: "Deutsch", thema: "Deutsch" });
  const server = await new Promise((resolve) => { const s = app.listen(0, () => resolve(s)); });
  const post = (route, body) => fetch(`http://127.0.0.1:${server.address().port}/api/` + route, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
    .then(async (r) => ({ status: r.status, data: await r.json().catch(() => null) }));
  try { await lauf({ post, dataDir }); }
  finally { await new Promise((resolve) => server.close(resolve)); fs.rmSync(dataDir, { recursive: true, force: true }); }
}

test("Schreibtrainer Englisch: eigene Routen und eigene Datei, englische Anweisung, Rückmeldung in fünf Teilen", async () => {
  const fragen = [];
  const ki = async (system, user) => { fragen.push({ system, user: JSON.parse(user) }); return JSON.stringify({ gelungen: "Du erzählst klar von deiner Reise.", naechstes: "Achte auf die Zeitform.", stelle: "I tried a meat pie", tipp: "Was ist schon vorbei?", checkliste: [true, false] }); };
  await mitServer(ki, async ({ post, dataDir }) => {
    const r = await post("e9/schreiben/feedback", auftrag({ code: "901", text: TEXT, kriterien: ["greeting and ending", "simple past for the trip"], zug: "R", fokus: "sprache", plan: { greeting: "Dear Ben" } }));
    assert.equal(r.status, 200);
    assert.equal(r.data.quelle, "ki");
    assert.equal(r.data.fassung, 1);
    assert.deepEqual(r.data.checkliste.map((c) => c.ok), [true, false]);
    assert.equal(fragen[0].system, systemEnglisch(9));
    assert.match(fragen[0].system, /Fach Englisch für die 9\. Klasse/);
    assert.match(fragen[0].system, /Sprachmittlung/);
    assert.match(fragen[0].system, /niemals einen englischen Satz/);
    assert.equal(fragen[0].user.klasse, "R9 (Regelklasse)");
    assert.match(fragen[0].user.schwerpunkt, /^Sprache: /, "englischer Schwerpunkt statt des deutschen");
    assert.match(fragen[0].user.schwerpunkt, /Zeitform/);
    assert.equal(fragen[0].user.planung, "Dear Ben");
    assert.ok(fs.existsSync(path.join(dataDir, "e9-texte.json")), "eigene Datei für Englisch 9");
    assert.ok(!fs.existsSync(path.join(dataDir, "d9-texte.json")));
    // Notenschutz: Regel kommt dazu, das Wort LRS geht nicht an das Kind
    await post("e9/schreiben/feedback", auftrag({ code: "902", text: TEXT, kriterien: [] }));
    assert.match(fragen[1].system, /Erwähne LRS nicht/);
    // Deutsch 8 bleibt deutsch
    await post("d8/schreiben/feedback", { modul: "schr-04", aufgabe: "aufsatz", titel: "Pausen", auftrag: "Nimm Stellung.", code: "901", text: "Ich bin dafür, dass die Pause länger wird, weil Bewegung hilft.", kriterien: [] });
    assert.match(fragen[2].system, /Fach Deutsch für die 8\. Klasse/);
    assert.ok(fs.existsSync(path.join(dataDir, "d8-texte.json")));
  });
});

test("Schreibwerkstatt Englisch: Entwurf sichern, abgeben, Lehrkraft sieht den Text der Klasse", async () => {
  await mitServer(null, async ({ post }) => {
    assert.equal((await post("e9/texte/entwurf", auftrag({ text: "x" }))).status, 401, "ohne Code wird nichts gespeichert");
    assert.equal((await post("e9/texte/entwurf", auftrag({ code: "901", text: "Dear Ben,", plan: { greeting: "Dear Ben" } }))).status, 200);
    const a = await post("e9/texte/abgeben", auftrag({ code: "901", text: TEXT, plan: { greeting: "Dear Ben" }, planNamen: { greeting: "Greeting" } }));
    assert.equal(a.status, 200); assert.equal(a.data.fassung, 1);
    const m = (await post("e9/texte/meine", { code: "901", modul: "u1-writing", aufgabe: "aufsatz" })).data;
    assert.equal(m.fassungen.length, 1); assert.equal(m.fassungen[0].text, TEXT); assert.equal(m.abgegeben.nr, 1);
    assert.equal((await post("e9/lehrer/texte", { password: "falsch", klasse: "9b" })).status, 401);
    const l = (await post("e9/lehrer/texte", { password: PW, klasse: "9b" })).data;
    assert.equal(l.eintraege.length, 1); assert.equal(l.eintraege[0].modul, "u1-writing"); assert.equal(l.eintraege[0].planNamen.greeting, "Greeting");
    // die Texte von Englisch 9 stehen nicht bei Deutsch 8
    assert.equal((await post("d8/lehrer/texte", { password: PW, klasse: "9b" })).data.eintraege.length, 0);
  });
});

test("Offene Übungsaufgabe Englisch: Fremdsprachen-Regeln in der Anweisung, Deutsch unverändert", async () => {
  const fragen = [];
  const ki = async (system, user) => { fragen.push({ system, user }); return JSON.stringify({ richtig: true, teilweise: false, rueckmeldung: "Stimmt: Tiere halten die Teile für Futter.", tipp: "" }); };
  await mitServer(ki, async ({ post }) => {
    const r = await post("e9/uebung/feedback", { frage: "Why is plastic dangerous for sea animals?", erwartet: "Animals think the pieces are food and eat them.", antwort: "The animals eat it because they think its food.", thema: "Unit 1: Reading", keywords: ["food|eat"] });
    assert.equal(r.status, 200); assert.equal(r.data.richtig, true); assert.equal(r.data.quelle, "ki");
    assert.match(fragen[0].system, /Übungsaufgabe in Englisch, Klasse 9/);
    assert.match(fragen[0].system, /Englisch als Fremdsprache/);
    assert.match(fragen[0].system, /Rückmeldung und Tipp schreibst du auf Deutsch/);
    await post("d8/uebung/feedback", { frage: "Warum ist das ein Kommentar?", erwartet: "Der Text wertet.", antwort: "Weil der Autor seine Meinung sagt.", keywords: [] });
    assert.doesNotMatch(fragen[1].system, /Fremdsprache/);
    // mit Bewertungspunkten (Quali-Training): auch dort gelten die Fremdsprachen-Regeln
    await post("e9/uebung/feedback", { frage: "Name two things the students will do next.", antwort: "They will ask for bins and make posters.", kriterien: ["more bins", "posters for tourists"] });
    assert.match(fragen[2].system, /Quali-Übungsaufgabe in Englisch/);
    assert.match(fragen[2].system, /Englisch als Fremdsprache/);
  });
});
