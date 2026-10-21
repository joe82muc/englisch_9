"use strict";

// Weiterbearbeiten nach der Abgabe (21.10.2026, probe-weiter.js): Die Lehrkraft erlaubt es in der Verwaltung, das Kind öffnet
// die Probe wieder, seine Antworten (Stand der Seite) kommen zurück, die neue Abgabe ersetzt die alte. Geprüft an allen
// Proben-Familien: Vokabeltest, Grammatik, NT-7-Familie (hier Informatik 7), Deutsch/Englisch-9-Proben, Infoaustausch.
// Dazu die Englisch-Regeln (Verlassen ohne Note 6, 1. Kopierversuch = Note 6, Englisch-9-Proben ohne Zeitbegrenzung).
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const express = require("express");
const Weiter = require("./probe-weiter");
const { registerProbeRegel } = require("./probe-regel");
const { registerVokabeltestRoutes } = require("./vokabeltest");
const { registerGrammatik9rRoutes } = require("./grammatik9r");
const { registerNt7Routes } = require("./nt7");
const { registerD7ProbenRoutes } = require("./d7-proben");
const { registerInfoaustauschRoutes } = require("./infoaustausch");
const B = require("./e9-proben/bau");

const PW = "Nur-ein-Test-4711";
const KINDER = { 301: "9b", 302: "9b", 303: "9b", 304: "9b", 701: "7b", 702: "7b" };
const kindZumCode = async (code) => (KINDER[code] ? { code, klasse: KINDER[code], zug: "R", lrs: false } : null);

const VOKABEL = { "e9r-w": { id: "e9r-w", title: "Test W", unit: "Englisch 9R / Unit 1", classLevel: "9R", gradeScale: "9R", direction: "de-en", items: [
  { prompt: "Hund", solutions: ["dog"], direction: "de-en" }, { prompt: "Katze", solutions: ["cat"], direction: "de-en" }] } };
const GRAMMATIK = { "e9r-g-w": { id: "e9r-g-w", title: "Grammatik W", kind: "probe", unit: "Unit 1", classLevel: "9R", items: [
  { type: "choice", prompt: "She ___ to school.", options: ["go", "goes"], answer: 1 }, { type: "choice", prompt: "They ___ happy.", options: ["is", "are"], answer: 1 }] } };
const INF7 = { "inf7-w-r": { id: "inf7-w-r", zug: "R", thema: "sicher", minutes: 15, title: "Probe W (7R)", scope: "Test", items: [
  { type: "choice", prompt: "Welche Antwort stimmt hier?", options: ["A", "B", "C"], answer: 2, points: 1 },
  { type: "choice", prompt: "Und welche Antwort stimmt hier?", options: ["A", "B", "C"], answer: 0, points: 1 }] } };
const E9 = { "e9-p9-r-a": B.probe(9, "A", { title: "Probe 9 (R9): Test", minutes: 60, texte: [], items: [
  B.c("Which word is a verb?", ["run", "red", "rich"], 0), B.c("Which word is an animal?", ["table", "tiger", "tea"], 1)] }) };
const INFO = { "ia-w": { id: "ia-w", title: "Infoaustausch W", unit: "Informatik 7", classLevel: "7", items: [
  { type: "choice", prompt: "Was ist ein Router?", options: ["ein Gerät im Netz", "ein Drucker"], answer: 0, points: 1 },
  { type: "choice", prompt: "Was ist ein Passwort?", options: ["ein Geheimwort", "eine Adresse"], answer: 0, points: 1 }] } };

let server, basis;
test.before(async () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "probe-weiter-"));
  const app = express();
  app.use(express.json({ limit: "2mb" }));
  registerProbeRegel(app, { dataDir, kindZumCode, teacherPassword: PW });
  Weiter.registerProbeWeiter(app, { teacherPassword: PW });
  registerVokabeltestRoutes(app, { automatischTaktMs: 3600000, dataDir, teacherPassword: PW, tests: VOKABEL, hashSecret: "x", kindZumCode, askAnthropic: async () => "" });
  registerGrammatik9rRoutes(app, { dataDir, teacherPassword: PW, tests: GRAMMATIK, hashSecret: "x", kindZumCode, askAnthropic: async () => "" });
  registerNt7Routes(app, { dataDir, teacherPassword: PW, kindZumCode, prefix: "/api/inf7", datei: "inf7-proben.json", tests: INF7, fach: "Informatik" });
  registerD7ProbenRoutes(app, { dataDir, prefix: "/api/e9/proben", datei: "e9-proben.json", stufe: 9, fach: { kurz: "e", name: "Englisch" }, sitzung: true, marken: true,
    teacherPassword: PW, kindZumCode, tests: E9, askAnthropic: async () => "{}", kiPauseMs: 10, nachholenMs: 0 });
  registerInfoaustauschRoutes(app, { dataDir, teacherPassword: PW, tests: INFO, hashSecret: "x", kindZumCode, askAnthropic: async () => "" });
  await new Promise((resolve) => { server = app.listen(0, "127.0.0.1", resolve); });
  basis = `http://127.0.0.1:${server.address().port}`;
  await post("/api/vokabeltest/unlock", { password: PW, testId: "e9r-w", open: true });
  await post("/api/grammatik9r/unlock", { password: PW, testId: "e9r-g-w", open: true });
  await post("/api/inf7/teacher/unlock", { password: PW, testId: "inf7-w-r", open: true });
  await post("/api/e9/proben/teacher/unlock", { password: PW, testId: "e9-p9-r-a", open: true });
  await post("/api/infoaustausch/unlock", { password: PW, testId: "ia-w", open: true });
});
test.after(() => server && server.close());

async function post(route, body) {
  const res = await fetch(basis + route, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return { status: res.status, data: await res.json().catch(() => null) };
}
const erlauben = (modul, submissionId, erlauben = true) => post("/api/probe-weiter/erlauben", { password: PW, modul, submissionId, erlauben });

/* Ablauf je Probenart: abgeben -> kein zweiter Start -> Lehrkraft erlaubt -> Start mit den Antworten -> neu abgeben ersetzt */
async function ablauf({ modul, start, submit, results, code, ersteAntworten, neueAntworten, seite, mehr = {}, punkteVorher, punkteNachher }) {
  const s1 = await post(start, { testId: mehr.testId, code });
  assert.equal(s1.status, 200, modul + ": erster Start");
  assert.equal(s1.data.weiter, undefined);
  assert.equal((await post(submit, { testId: mehr.testId, code, answers: ersteAntworten, regel: true, seite })).status, 200, modul + ": erste Abgabe");
  assert.equal((await post(start, { testId: mehr.testId, code })).status, 409, modul + ": ohne Erlaubnis kein zweiter Start");
  const liste = async () => (await post(results, { password: PW, testId: mehr.testId })).data.submissions.filter((s) => s.code === code);
  const [alt] = await liste();
  assert.equal(alt.score, punkteVorher, modul + ": Punkte der ersten Abgabe");
  assert.deepEqual(alt.seite, seite, modul + ": Stand der Seite steht in der Abgabe");

  const e = await erlauben(modul, alt.id);
  assert.equal(e.status, 200, modul + ": erlauben");
  assert.equal(e.data.weiter.seite, true);
  const s2 = await post(start, { testId: mehr.testId, code });
  assert.equal(s2.status, 200, modul + ": Start mit Erlaubnis");
  assert.deepEqual(s2.data.weiter.seite, seite, modul + ": die Antworten kommen zurück");
  assert.equal(s2.data.weiter.abgegebenAm, alt.submittedAt);

  const r = await post(submit, { testId: mehr.testId, code, answers: neueAntworten, regel: true, seite: { f: ["neu"], k: [], r: [] } });
  assert.equal(r.status, 200, modul + ": neue Abgabe");
  const danach = await liste();
  assert.equal(danach.length, 1, modul + ": die neue Abgabe ersetzt die alte");
  assert.notEqual(danach[0].id, alt.id, modul + ": neue Kennung");
  assert.equal(danach[0].score, punkteNachher, modul + ": Punkte neu gerechnet");
  assert.equal(danach[0].weiter, undefined, modul + ": Erlaubnis verbraucht");
  assert.equal(danach[0].fassungen.length, 1);
  assert.equal(danach[0].fassungen[0].score, punkteVorher);
  assert.equal((await post(start, { testId: mehr.testId, code })).status, 409, modul + ": danach wieder gesperrt");
  return danach[0];
}

test("Vokabeltest: weiterbearbeiten, Vorfälle werden angenommen, Zurücknehmen sperrt wieder", async () => {
  const neu = await ablauf({ modul: "vokabeltest", start: "/api/vokabeltest/start", submit: "/api/vokabeltest/submit", results: "/api/vokabeltest/results", code: "301",
    ersteAntworten: ["dog", ""], neueAntworten: ["dog", "cat"], seite: { f: ["dog", ""], k: [], r: [] }, mehr: { testId: "e9r-w" }, punkteVorher: 1, punkteNachher: 2 });
  assert.equal(neu.grade, 1);
  // Zurücknehmen: erlauben und gleich wieder zurücknehmen -> kein Start
  const e = await erlauben("vokabeltest", neu.id);
  assert.equal((await post("/api/vokabeltest/vorfall", { testId: "e9r-w", code: "301", verlassen: 1 })).status, 200, "während des Weiterbearbeitens zählt der Server mit");
  assert.ok(e.data.weiter.erlaubtAm);
  const z = await erlauben("vokabeltest", neu.id, false);
  assert.equal(z.data.weiter, null);
  assert.equal((await post("/api/vokabeltest/start", { testId: "e9r-w", code: "301" })).status, 409);
  // Zugriffsschutz und unbekannte Angaben
  assert.equal((await post("/api/probe-weiter/erlauben", { password: "falsch", modul: "vokabeltest", submissionId: neu.id, erlauben: true })).status, 401);
  assert.equal((await erlauben("gibtsnicht", neu.id)).status, 404);
  assert.equal((await erlauben("vokabeltest", "vt_gibtsnicht")).status, 404);
});

test("Grammatik (Englisch): Regeln beim Start, Verlassen ohne Note 6, 1. Kopierversuch = Note 6, weiterbearbeiten", async () => {
  const s = await post("/api/grammatik9r/start", { testId: "e9r-g-w", code: "302" });
  assert.deepEqual(s.data.regel, { verlassen: 0, kopieren: 1, wegSekunden: 0 });
  await post("/api/grammatik9r/submit", { testId: "e9r-g-w", code: "302", answers: [1, 1], regel: true, wegSumme: 200, kopierversuche: 0 });
  let rec = (await post("/api/grammatik9r/results", { password: PW, testId: "e9r-g-w" })).data.submissions.find((x) => x.code === "302");
  assert.equal(rec.grade, 1, "200 Sekunden weg: keine Note 6");
  assert.equal(rec.abbruch, undefined);
  assert.equal(rec.wegSekunden, 200);
  // Kopierversuch beim Weiterbearbeiten: Note 6 (Text sagt „ohne Vorwarnung“)
  await erlauben("grammatik9r", rec.id);
  await post("/api/grammatik9r/submit", { testId: "e9r-g-w", code: "302", answers: [1, 1], regel: true, kopierversuche: 1, regelKopieren: 1, abbruch: { grund: "kopieren" } });
  rec = (await post("/api/grammatik9r/results", { password: PW, testId: "e9r-g-w" })).data.submissions.find((x) => x.code === "302");
  assert.equal(rec.grade, 6);
  assert.equal(rec.abbruch.grund, "kopieren");
  assert.match(rec.kommentar, /ohne Vorwarnung/);
  assert.equal(rec.fassungen[0].grade, 1);

  // Übergang: ältere, noch offene Seite (ohne regelKopieren) hat beim 1. Kopierversuch nur gewarnt – keine Note 6
  await post("/api/grammatik9r/submit", { testId: "e9r-g-w", code: "304", answers: [1, 1], regel: true, kopierversuche: 1 });
  const alt = (await post("/api/grammatik9r/results", { password: PW, testId: "e9r-g-w" })).data.submissions.find((x) => x.code === "304");
  assert.equal(alt.abbruch, undefined);
  assert.equal(alt.grade, 1);

  await ablauf({ modul: "grammatik9r", start: "/api/grammatik9r/start", submit: "/api/grammatik9r/submit", results: "/api/grammatik9r/results", code: "303",
    ersteAntworten: [0, 1], neueAntworten: [1, 1], seite: { f: [], k: [], r: [1, 3] }, mehr: { testId: "e9r-g-w" }, punkteVorher: 1, punkteNachher: 2 });
});

test("NT-7-Familie (Informatik 7): weiterbearbeiten", async () => {
  await ablauf({ modul: "inf7", start: "/api/inf7/start", submit: "/api/inf7/submit", results: "/api/inf7/teacher/results", code: "701",
    ersteAntworten: [2, 1], neueAntworten: [2, 0], seite: { f: [], k: [], r: [2] }, mehr: { testId: "inf7-w-r" }, punkteVorher: 1, punkteNachher: 2 });
});

test("Englisch 9 (große Proben): ohne Zeitbegrenzung, Englisch-Regeln, weiterbearbeiten mit Zwischenstand", async () => {
  const s = await post("/api/e9/proben/start", { testId: "e9-p9-r-a", code: "301" });
  assert.equal(s.status, 200);
  assert.equal(s.data.test.wegSekunden, 0);
  assert.equal(s.data.test.kopieren, 1);
  assert.equal(s.data.test.ohneZeit, true);
  assert.equal(s.data.sitzung.timer, false, "keine Restzeit auf der Seite");
  const liste = (await (await fetch(basis + "/api/e9/proben/list")).json()).tests;
  assert.equal(liste[0].ohneZeit, true);
  assert.equal((await post("/api/e9/proben/submit", { testId: "e9-p9-r-a", code: "301", answers: [0, 0], regel: true, wegSumme: 300, seite: { f: [], k: [], r: [0, 3] } })).status, 200);
  const alle = async () => (await post("/api/e9/proben/teacher/results", { password: PW, testId: "e9-p9-r-a" })).data.submissions.filter((x) => x.code === "301");
  const [alt] = await alle();
  assert.equal(alt.abbruch, undefined, "300 Sekunden weg: keine Note 6");
  assert.equal(alt.zeit.ohneZeit, true);
  assert.equal(alt.zeit.ueber, undefined, "nichts „überzogen“");
  assert.equal((await post("/api/e9/proben/start", { testId: "e9-p9-r-a", code: "301" })).status, 409);

  await erlauben("e9proben", alt.id);
  const s2 = await post("/api/e9/proben/start", { testId: "e9-p9-r-a", code: "301" });
  assert.equal(s2.status, 200);
  assert.deepEqual(s2.data.weiter.seite, { f: [], k: [], r: [0, 3] });
  // Zwischenstand während des Weiterbearbeitens: angenommen; danach kommt beim Start der neuere Zwischenstand statt des alten Stands
  assert.equal((await post("/api/e9/proben/zwischenstand", { testId: "e9-p9-r-a", code: "301", answers: [0, 1] })).status, 200);
  const s3 = await post("/api/e9/proben/start", { testId: "e9-p9-r-a", code: "301" });
  assert.deepEqual(s3.data.zwischenstand.answers, [0, 1]);
  assert.equal(s3.data.weiter.seite, null);
  assert.equal((await post("/api/e9/proben/submit", { testId: "e9-p9-r-a", code: "301", answers: [0, 1], regel: true, kopierversuche: 1, regelKopieren: 1, abbruch: { grund: "kopieren" } })).status, 200);
  const danach = await alle();
  assert.equal(danach.length, 1);
  assert.notEqual(danach[0].id, alt.id);
  assert.equal(danach[0].abbruch.grund, "kopieren", "1. Kopierversuch = Note 6");
  assert.equal(danach[0].fassungen.length, 1);
});

test("Infoaustausch: weiterbearbeiten", async () => {
  await ablauf({ modul: "infoaustausch", start: "/api/infoaustausch/start", submit: "/api/infoaustausch/submit", results: "/api/infoaustausch/results", code: "702",
    ersteAntworten: [0, 1], neueAntworten: [0, 0], seite: { f: ["x"], k: [0], r: [] }, mehr: { testId: "ia-w" }, punkteVorher: 1, punkteNachher: 2 });
});

test("Bausteine: Stand der Seite säubern, Anzeige für die Notenübersicht", () => {
  assert.equal(Weiter.seiteSauber(null), undefined);
  assert.equal(Weiter.seiteSauber({ f: ["", ""], k: [], r: [] }), undefined, "ein leerer Stand wird nicht gespeichert");
  assert.deepEqual(Weiter.seiteSauber({ f: ["a", 5], k: [1, -2, 1.5, "x"], r: [0], p: { geheim: 1 } }), { f: ["a", "5"], k: [1], r: [0] });
  assert.equal(Weiter.seiteSauber({ f: ["x".repeat(15000)].concat(Array(30).fill("y".repeat(15000))) }), undefined, "zu groß");
  assert.deepEqual(Weiter.anzeige({ id: "a" }), {});
  assert.deepEqual(Weiter.anzeige({ id: "a", weiter: { erlaubtAm: "2026-10-21T08:00:00.000Z" } }), { weiter: { erlaubtAm: "2026-10-21T08:00:00.000Z", seite: false } });
  const a = Weiter.anzeige({ id: "a", fassungen: [{ submittedAt: "x", score: 1, grade: 4 }] });
  assert.equal(a.fassungen, 1);
  assert.equal(a.vorher.grade, 4);
});
