"use strict";

// Note erst nach der Rückgabe (Abgabe-Antwort ohne Punkte, Note, Lösungen) und Vokabeltest: Notenschutz LRS je
// Abgabe nachträglich an/aus, einzelne Antwort von der Lehrkraft gewertet.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const express = require("express");
const { registerVokabeltestRoutes } = require("./vokabeltest");
const { registerProbenRueckgabeRoutes } = require("./proben-rueckgabe");
const { ABGABE_ROUTEN, abgabeOhneErgebnis, ohneErgebnis } = require("./probe-kind");

const TESTS = {
  "e7m-u1-a": { id: "e7m-u1-a", title: "Unit 1 A", unit: 1, classLevel: "7M", items: [
    { prompt: "Hund", solutions: ["dog"], direction: "de-en" },
    { prompt: "Frankreich", solutions: ["France"], direction: "de-en" },
    { prompt: "Umgebung", solutions: ["environment"], direction: "de-en" },
    { prompt: "Rakete", solutions: ["rocket"], direction: "de-en" }
  ] }
};
const klassen = new Map([["101", "7aM"], ["102", "7aM"], ["103", "7aM"], ["104", "7aM"], ["105", "7aM"], ["106", "7aM"], ["201", "7b"]]);
const kindZumCode = async (code) => (klassen.has(code) ? { code, klasse: klassen.get(code), lrs: false } : null);
// Die „KI“ der Tests: schweigt, solange kein Test sie umstellt
let ki = async () => "";

let server, basis, dataDir;
test.before(async () => {
  dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "proben-ergebnis-"));
  const app = express();
  app.use(express.json());
  app.use(ABGABE_ROUTEN, abgabeOhneErgebnis);           // wie in server.js: vor den Proben-Modulen
  let rueckgabe = null;
  const vokabeltest = registerVokabeltestRoutes(app, { dataDir, teacherPassword: "geheim", tests: TESTS, hashSecret: "x", kindZumCode, askAnthropic: (...a) => ki(...a),
    zurueckgegeben: (abgabe) => Boolean(rueckgabe.stand("vokabeltest", abgabe)) });   // wie in server.js
  rueckgabe = registerProbenRueckgabeRoutes(app, { dataDir, teacherPassword: "geheim", kindZumCode, quellen: [{ modul: "vokabeltest", fach: "Englisch", abgaben: vokabeltest.abgaben }] });
  await new Promise((resolve) => { server = app.listen(0, "127.0.0.1", resolve); });
  basis = `http://127.0.0.1:${server.address().port}`;
});
test.after(() => server && server.close());

const post = async (route, body) => {
  const res = await fetch(basis + route, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return { status: res.status, data: await res.json() };
};
const lehrer = (route, body) => post("/api/vokabeltest/" + route, { password: "geheim", ...body });
const abgabe = async (code) => (await lehrer("results", { testId: "e7m-u1-a" })).data.submissions.find((s) => s.code === code);

test("Abgabe: Das Kind bekommt weder Punkte noch Note noch Lösungen – gespeichert ist alles", async () => {
  await lehrer("unlock", { testId: "e7m-u1-a", open: true });
  const r = await post("/api/vokabeltest/submit", { testId: "e7m-u1-a", code: "101", answers: ["dog", "france", "enviroment", "rakete"] });
  assert.equal(r.status, 200);
  assert.equal(r.data.ok, true);
  assert.equal(r.data.abgegeben, true);
  assert.equal(r.data.result.abgegeben, true);
  assert.ok(r.data.result.submittedAt);
  assert.deepEqual(r.data.result.details, []);
  assert.equal(r.data.result.grade, "–");
  const roh = JSON.stringify(r.data);
  for (const geheim of ["France", "environment", "rocket", "Großschreibung", "expected"]) assert.ok(!roh.includes(geheim), geheim + " gehört nicht in die Antwort an das Kind");
  assert.ok(!/"(score|percent)":\s*\d/.test(roh), "keine Punkte, keine Prozent");

  // Die Lehrkraft sieht sofort alles: dog richtig, france falsch (Großschreibung), enviroment Tippfehler, rakete falsch
  const s = await abgabe("101");
  assert.equal(s.score, 2); assert.equal(s.total, 4); assert.equal(s.percent, 50); assert.equal(s.grade, 4);
  assert.match(s.details[1].comment, /Großschreibung: France/);
  assert.equal(s.details[1].expected, "France");
});

test("Fehlerantworten bleiben, wie sie sind (zweite Abgabe, gesperrt, falscher Code)", async () => {
  const nochmal = await post("/api/vokabeltest/submit", { testId: "e7m-u1-a", code: "101", answers: [] });
  assert.equal(nochmal.status, 409);
  assert.equal(nochmal.data.error, "already_submitted");
  assert.match(nochmal.data.message, /bereits abgegeben/);
  assert.equal((await post("/api/vokabeltest/submit", { testId: "e7m-u1-a", code: "999", answers: [] })).status, 404);
  assert.deepEqual(ohneErgebnis({ ok: false, error: "locked" }), { ok: false, error: "locked" });
  assert.equal(ohneErgebnis(null), null);
});

test("Erst die Rückgabe zeigt dem Kind Note, Punkte und Lösungen", async () => {
  const s = await abgabe("101");
  const vorher = await post("/api/proben/rueckgabe/ansehen", { code: "101", modul: "vokabeltest", id: s.id });
  assert.equal(vorher.status, 403);
  assert.equal(vorher.data.error, "nicht_freigegeben");
  assert.deepEqual((await post("/api/proben/rueckgabe/meine", { code: "101" })).data.rueckgaben, []);
  assert.equal((await post("/api/proben/rueckgabe/freigeben", { password: "geheim", eintraege: [{ modul: "vokabeltest", id: s.id }], offen: true })).data.anzahl, 1);
  const meine = (await post("/api/proben/rueckgabe/meine", { code: "101" })).data.rueckgaben;
  assert.equal(meine.length, 1); assert.equal(meine[0].neu, true);
  const k = (await post("/api/proben/rueckgabe/ansehen", { code: "101", modul: "vokabeltest", id: s.id })).data.korrektur;
  assert.equal(k.grade, 4); assert.equal(k.score, 2); assert.equal(k.aufgaben.length, 4);
  assert.equal(k.aufgaben[1].loesung, "France");
  // ein anderes Kind sieht sie nicht
  assert.equal((await post("/api/proben/rueckgabe/ansehen", { code: "102", modul: "vokabeltest", id: s.id })).status, 404);
});

test("Jedes Proben-Modul der Notenübersicht steht in ABGABE_ROUTEN (Deutsch hat den eigenen Ablauf)", () => {
  const quelltext = fs.readFileSync(path.join(__dirname, "server.js"), "utf8");
  const block = quelltext.slice(quelltext.indexOf("const PROBEN_QUELLEN = ["), quelltext.indexOf("];", quelltext.indexOf("const PROBEN_QUELLEN = [")));
  const module = [...block.matchAll(/modul:\s*"([\w-]+)"/g)].map((m) => m[1]).filter((m) => !/^d[78]proben$/.test(m));
  assert.ok(module.length >= 10, "Module gefunden: " + module.join(", "));
  for (const m of module) assert.ok(ABGABE_ROUTEN.includes("/api/" + m + "/submit"), m + " fehlt in ABGABE_ROUTEN (probe-kind.js)");
  assert.ok(quelltext.indexOf("app.use(ABGABE_ROUTEN, abgabeOhneErgebnis)") < quelltext.indexOf("registerVokabeltestRoutes(app"), "muss vor den Proben-Modulen stehen");
});

test("Notenschutz LRS für eine Abgabe nachträglich: Rechtschreibung zählt nicht mehr – und wieder zurück", async () => {
  await post("/api/vokabeltest/submit", { testId: "e7m-u1-a", code: "102", answers: ["dag", "france", "envirment", "rokit"] });
  let s = await abgabe("102");
  assert.equal(s.lrs, false); assert.equal(s.score, 0); assert.equal(s.grade, 6);

  assert.equal((await post("/api/vokabeltest/lrs", { password: "falsch", submissionId: s.id, lrs: true })).status, 401);
  assert.equal((await lehrer("lrs", { submissionId: "gibt-es-nicht", lrs: true })).status, 404);

  const an = await lehrer("lrs", { submissionId: s.id, lrs: true });
  assert.deepEqual(an.data, { ok: true, lrs: true, score: 4, total: 4, percent: 100, grade: 1 });
  s = await abgabe("102");
  assert.equal(s.lrs, true); assert.equal(s.grade, 1);
  assert.equal(s.details[1].correct, true, "france zählt mit LRS");
  assert.equal(s.details[1].comment, "");
  assert.deepEqual(s.details.map((d) => d.given), ["dag", "france", "envirment", "rokit"], "die Antworten bleiben unverändert");

  const aus = await lehrer("lrs", { submissionId: s.id, lrs: false });
  assert.equal(aus.data.score, 0); assert.equal(aus.data.grade, 6); assert.equal(aus.data.lrs, false);
  assert.equal((await abgabe("102")).lrs, false);
  // das Merkmal beim Code bleibt unberührt: eine weitere Abgabe desselben Kindes würde ohne LRS gewertet
  assert.equal((await kindZumCode("102")).lrs, false);

  // Zählt eine Antwort trotz Schreibfehler, steht die richtige Schreibung dabei (Rückgabe, Elternausdruck);
  // nimmt die Lehrkraft die Antwort zurück, verschwindet dieser Zusatz
  await lehrer("lrs", { submissionId: s.id, lrs: true });
  assert.equal((await abgabe("102")).details[2].comment, "Zählt – richtig geschrieben: environment");
  await lehrer("override", { submissionId: s.id, nr: 3, points: 0 });
  const danach = await abgabe("102");
  assert.equal(danach.details[2].comment, ""); assert.equal(danach.score, 3);
});

test("LRS an und wieder aus führt genau zum alten Stand zurück – auch wenn die KI beim zweiten Mal anders urteilt", async () => {
  // Beim Abgeben erkennt die KI „doggy“ an, bei der Neubewertung antwortet sie nicht mehr
  ki = async (_system, user) => JSON.stringify({ results: [...String(user).matchAll(/Aufgabe (\d+)/g)].map((m) => ({ nr: +m[1], correct: true, reason: "passt" })) });
  await post("/api/vokabeltest/submit", { testId: "e7m-u1-a", code: "103", answers: ["doggy", "france", "environment", "rocket"] });
  ki = async () => "";
  let s = await abgabe("103");
  assert.equal(s.score, 3); assert.equal(s.details[0].ai, true); assert.equal(s.details[1].correct, false);

  const an = await lehrer("lrs", { submissionId: s.id, lrs: true });
  assert.equal(an.data.score, 4, "mit LRS zählt france; doggy bleibt anerkannt – mit Notenschutz wird nichts schlechter");
  const aus = await lehrer("lrs", { submissionId: s.id, lrs: false });
  assert.equal(aus.data.score, 3);
  s = await abgabe("103");
  assert.equal(s.details[0].ai, true);
  assert.equal(s.details[1].correct, false); assert.match(s.details[1].comment, /Großschreibung: France/);
  assert.ok(!("detailsOhneLrs" in s), "der aufgehobene Stand ist wieder weg");
});

test("KI-Zweitmeinung: Schreibfehler winkt sie nicht durch – ein Synonym und eine andere richtige Schreibweise zählen", async () => {
  // Diese „KI“ hält jede Antwort für inhaltlich richtig; die Schreibweise beurteilt sie, wie hier vorgegeben
  const schreibweise = { roket: true, rockett: false, enviromant: false };
  const auftraege = [];
  ki = async (system, user) => {
    auftraege.push(system);
    const results = [...String(user).matchAll(/Aufgabe (\d+)[\s\S]*?Antwort: (.*)/g)].map((m) => ({ nr: +m[1], correct: true, spelling: schreibweise[m[2].trim()], reason: "passt" }));
    return JSON.stringify({ results });
  };
  await post("/api/vokabeltest/submit", { testId: "e7m-u1-a", code: "104", answers: ["hound", "France", "enviromant", "rockett"] });
  await post("/api/vokabeltest/submit", { testId: "e7m-u1-a", code: "105", answers: ["dogg", "France", "environment", "roket"] });
  ki = async () => "";
  assert.match(auftraege[0], /Die Schreibweise zaehlt/);
  assert.match(auftraege[0], /"spelling": true\|false/);

  const a = await abgabe("104");
  assert.equal(a.details[0].correct, true, "„hound“: anderes Wort mit passender Bedeutung – die KI entscheidet");
  assert.equal(a.details[0].ai, true);
  assert.equal(a.details[2].correct, false, "„enviromant“: zwei Buchstaben falsch, die KI nennt es einen Schreibfehler");
  assert.equal(a.details[3].correct, false, "„rockett“: ein Buchstabe zu viel in einem kurzen Wort");
  assert.equal(a.score, 2);

  const b = await abgabe("105");
  assert.equal(b.details[0].correct, false, "„dogg“: ein Buchstabe neben der Lösung – ohne ausdrückliches „richtig geschrieben“ zählt es nicht");
  assert.equal(b.details[3].correct, true, "ein Buchstabe neben der Lösung, aber von der KI als richtige Schreibweise bestätigt (wie color/colour)");
  assert.equal(b.score, 3);
});

test("Die Lehrkraft wertet eine Antwort selbst; LRS an/aus lässt ihre Entscheidung stehen", async () => {
  await post("/api/vokabeltest/submit", { testId: "e7m-u1-a", code: "201", answers: ["doggy", "France", "", "rocket"] });
  let s = await abgabe("201");
  assert.equal(s.zug, "R"); assert.equal(s.score, 2); assert.equal(s.percent, 50); assert.equal(s.grade, 3, "R-Schlüssel: 50 % = Note 3");

  assert.equal((await post("/api/vokabeltest/override", { password: "falsch", submissionId: s.id, nr: 1, points: 1 })).status, 401);
  assert.equal((await lehrer("override", { submissionId: s.id, nr: 1, points: 2 })).status, 400);
  assert.equal((await lehrer("override", { submissionId: s.id, nr: 9, points: 1 })).status, 404);
  const hoch = await lehrer("override", { submissionId: s.id, nr: 1, points: 1 });
  assert.deepEqual(hoch.data, { ok: true, score: 3, percent: 75, grade: 2 });
  const runter = await lehrer("override", { submissionId: s.id, nr: 4, points: 0, comment: "abgeschrieben" });
  assert.deepEqual(runter.data, { ok: true, score: 2, percent: 50, grade: 3 });

  await lehrer("lrs", { submissionId: s.id, lrs: true });
  s = await abgabe("201");
  assert.equal(s.details[0].correct, true); assert.equal(s.details[0].scoredBy, "lehrkraft");
  assert.equal(s.details[3].correct, false); assert.equal(s.details[3].comment, "abgeschrieben");
  assert.equal(s.score, 2);
});

test("Richtige Zusätze zählen sofort – und ältere Abgaben lassen sich nachwerten (nur aufwerten, mit Bericht)", async () => {
  // Die „KI“ lehnt alles ab: Der Punkt für „dog / dogs“ kommt aus der festen Regel, nicht von ihr
  const auftraege = [];
  ki = async (system, user) => { auftraege.push(system + "\n" + user); return JSON.stringify({ results: [] }); };
  await post("/api/vokabeltest/submit", { testId: "e7m-u1-a", code: "106", answers: ["dog / dogs", "France", "environment", "rakete"] });
  ki = async () => "";
  let s = await abgabe("106");
  assert.equal(s.details[0].correct, true); assert.equal(s.details[0].ai, false); assert.equal(s.score, 3); assert.equal(s.grade, 3);
  assert.ok(!auftraege[0].includes("dog / dogs"), "geht gar nicht erst an die KI");
  assert.match(auftraege[0], /MEHR GESCHRIEBEN ALS GEFRAGT/);
  assert.ok(!/fehlt eine der drei Formen/.test(auftraege[0]), "die alte Anweisung, an der „to drive / drove“ scheiterte, ist weg");

  // Stand von vor der Regel nachstellen: Die Antwort galt als falsch
  const datei = path.join(dataDir, "vokabeltest_abgaben.json");
  const db = JSON.parse(fs.readFileSync(datei, "utf8"));
  const rec = db.submissions.find((x) => x.code === "106");
  rec.details[0].correct = false;
  Object.assign(rec, { score: 2, percent: 50, grade: 4 });
  fs.writeFileSync(datei, JSON.stringify(db), "utf8");

  assert.equal((await post("/api/vokabeltest/nachwerten", { password: "falsch" })).status, 401);
  const r = await lehrer("nachwerten", { submissionIds: [rec.id] });
  assert.equal(r.data.anzahl, 1);
  assert.equal(r.data.abgaben.length, 1);
  assert.deepEqual(r.data.abgaben[0].antworten, [{ nr: 1, prompt: "Hund", given: "dog / dogs" }]);
  assert.deepEqual(r.data.abgaben[0].vorher, { score: 2, grade: 4 });
  assert.equal(r.data.abgaben[0].score, 3); assert.equal(r.data.abgaben[0].grade, 3); assert.equal(r.data.abgaben[0].code, "106");
  s = await abgabe("106");
  assert.equal(s.score, 3); assert.equal(s.percent, 75); assert.equal(s.grade, 3);
  assert.equal(s.details[3].correct, false, "„rakete“ bleibt falsch");

  // Was die Lehrkraft selbst gewertet hat, bleibt – und sonst ändert ein zweiter Lauf nichts mehr (auch nicht bei den anderen Abgaben)
  await lehrer("override", { submissionId: rec.id, nr: 1, points: 0 });
  const vorher = (await lehrer("results", { testId: "e7m-u1-a" })).data.submissions.map((x) => [x.id, x.score, x.grade]);
  const nochmal = await lehrer("nachwerten", { testId: "e7m-u1-a" });
  assert.equal(nochmal.data.anzahl, 0); assert.deepEqual(nochmal.data.abgaben, []);
  assert.deepEqual((await lehrer("results", { testId: "e7m-u1-a" })).data.submissions.map((x) => [x.id, x.score, x.grade]), vorher);
  assert.equal((await abgabe("106")).details[0].correct, false);
});

test("Merkliste: falsche Wörter aus zurückgegebenen Tests, üben bis „gelernt“ – nichts vor der Rückgabe", async () => {
  const merk = (route, body) => post("/api/vokabeltest/merkliste" + route, body);
  // 101 hat den Test zurückbekommen (france, rakete falsch); 102 hat abgegeben, aber noch nichts zurückbekommen
  const liste = await merk("", { code: "101" });
  assert.equal(liste.status, 200);
  assert.equal(liste.data.gelerntAb, 2);
  assert.deepEqual(liste.data.woerter.map((w) => [w.frage, w.loesung, w.gegeben, w.richtig, w.gelernt]), [["Frankreich", "France", "france", 0, false], ["Rakete", "rocket", "rakete", 0, false]]);
  assert.equal(liste.data.woerter[0].test, "Unit 1 A");
  assert.match(liste.data.woerter[0].datum, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(!("solutions" in liste.data.woerter[0]));
  assert.deepEqual((await merk("", { code: "102" })).data.woerter, [], "vor der Rückgabe sieht das Kind seine Fehler nicht");
  assert.equal((await merk("", {})).status, 400);
  assert.equal((await merk("", { code: "999" })).status, 404);

  const [frankreich, rakete] = liste.data.woerter;
  // falsch geübt: Grund wie im Test; zweimal hintereinander richtig = gelernt; ein Fehler setzt zurück
  let r = await merk("/pruefen", { code: "101", id: frankreich.id, antwort: "france" });
  assert.equal(r.data.richtig, false); assert.equal(r.data.hinweis, "Großschreibung: France"); assert.equal(r.data.wort.richtig, 0);
  r = await merk("/pruefen", { code: "101", id: frankreich.id, antwort: "France" });
  assert.equal(r.data.richtig, true); assert.equal(r.data.wort.richtig, 1); assert.equal(r.data.wort.gelernt, false);
  r = await merk("/pruefen", { code: "101", id: frankreich.id, antwort: " France " });
  assert.equal(r.data.wort.richtig, 2); assert.equal(r.data.wort.gelernt, true); assert.equal(r.data.wort.versuche, 3);
  r = await merk("/pruefen", { code: "101", id: rakete.id, antwort: "rocket" });
  assert.equal(r.data.wort.richtig, 1);
  r = await merk("/pruefen", { code: "101", id: rakete.id, antwort: "" });
  assert.equal(r.data.richtig, false); assert.equal(r.data.wort.richtig, 0, "ein Fehler setzt die Reihe zurück");
  assert.equal((await merk("/pruefen", { code: "101", id: "gibt-es-nicht", antwort: "x" })).status, 404);
  assert.equal((await merk("/pruefen", { code: "103", id: frankreich.id, antwort: "France" })).status, 404, "fremde Wörter gibt es nicht (103 hat nichts zurückbekommen)");

  // der Stand bleibt gespeichert (Datei wird wie die Abgaben nach Upstash gespiegelt)
  const danach = (await merk("", { code: "101" })).data.woerter;
  assert.deepEqual(danach.map((w) => [w.frage, w.richtig, w.gelernt]), [["Frankreich", 2, true], ["Rakete", 0, false]]);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dataDir, "vokabel_merkliste.json"), "utf8")).stand["101"][frankreich.id].r, 2);
  // „wieder üben“
  r = await merk("/zurueck", { code: "101", id: frankreich.id });
  assert.equal(r.data.wort.gelernt, false); assert.equal(r.data.wort.richtig, 0);

  // Nimmt die Lehrkraft die Rückgabe zurück, ist die Liste wieder leer; wertet sie eine Antwort als richtig, fällt das Wort heraus
  const s = await abgabe("101");
  await post("/api/proben/rueckgabe/freigeben", { password: "geheim", eintraege: [{ modul: "vokabeltest", id: s.id }], offen: false });
  assert.deepEqual((await merk("", { code: "101" })).data.woerter, []);
  await post("/api/proben/rueckgabe/freigeben", { password: "geheim", eintraege: [{ modul: "vokabeltest", id: s.id }], offen: true });
  await lehrer("override", { submissionId: s.id, nr: 4, points: 1 });
  assert.deepEqual((await merk("", { code: "101" })).data.woerter.map((w) => w.frage), ["Frankreich"]);
  await lehrer("override", { submissionId: s.id, nr: 4, points: 0 });
});