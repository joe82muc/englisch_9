"use strict";

// Testregeln der Vokabeltests (16.10.2026): 5× verlassen oder 2. Kopierversuch -> Test beendet, Note 6;
// der Server zählt mit (/vorfall), die Lehrkraft kann die Note 6 aufheben (/abbruch).
// Seit 21.10.2026 (Englisch): Verlassen gibt keine Note 6 mehr (nur Warnung und Vermerk), schon der 1. Kopierversuch = Note 6.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const express = require("express");
const { registerVokabeltestRoutes, TEST_REGEL } = require("./vokabeltest");

const TESTS = {
  "e9r-u1-x": { id: "e9r-u1-x", title: "Test X", unit: "Englisch 9R / Unit 1", classLevel: "9R", gradeScale: "9R", direction: "de-en", items: [
    { prompt: "Hund", solutions: ["dog"], direction: "de-en" },
    { prompt: "Katze", solutions: ["cat"], direction: "de-en" }
  ] }
};
const kindZumCode = async (code) => (code === "000" ? { code, klasse: "Lehrkraft", zug: "", lrs: false, lehrer: true }
  : /^\d{3}$/.test(code) ? { code, klasse: "9a", zug: "R", lrs: false } : null);

let server, basis, dataDir, vt;
test.before(async () => {
  dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "vt-abbruch-"));
  const app = express();
  app.use(express.json());
  vt = registerVokabeltestRoutes(app, { automatischTaktMs: 3600000, dataDir, teacherPassword: "pw", tests: TESTS, hashSecret: "x", kindZumCode, askAnthropic: async () => "" });
  await new Promise((resolve) => { server = app.listen(0, "127.0.0.1", resolve); });
  basis = `http://127.0.0.1:${server.address().port}`;
  await post("/api/vokabeltest/unlock", { password: "pw", testId: "e9r-u1-x", open: true });
});
test.after(() => server && server.close());

async function post(route, body) {
  const res = await fetch(basis + route, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return { status: res.status, data: await res.json() };
}
const abgabe = async (code) => (await post("/api/vokabeltest/results", { password: "pw", testId: "e9r-u1-x" })).data.submissions.find((s) => s.code === code);

test("Regel (Englisch seit 21.10.2026): Verlassen ohne Note 6, 1. Kopierversuch = Note 6", () => {
  assert.deepEqual(TEST_REGEL, { verlassen: 0, kopieren: 1, wegSekunden: 0, ruheMinuten: 5 });
});

test("Start nennt Regel und bisherige Zahlen; der Server zählt mit und nimmt den höchsten Stand", async () => {
  const s1 = await post("/api/vokabeltest/start", { testId: "e9r-u1-x", code: "101" });
  assert.equal(s1.status, 200);
  assert.deepEqual(s1.data.regel, { verlassen: 0, kopieren: 1, wegSekunden: 0, ruheMinuten: 5 });
  assert.deepEqual(s1.data.vorfaelle, { verlassen: 0, kopieren: 0, wegSumme: 0, weg: null, aktiv: null });
  assert.equal(s1.data.weiter, undefined);

  assert.equal((await post("/api/vokabeltest/vorfall", { testId: "e9r-u1-x", code: "101", verlassen: 3, wegSumme: 40 })).status, 200);
  // ein zweites Gerät mit niedrigeren Zahlen setzt nichts zurück
  const v = await post("/api/vokabeltest/vorfall", { testId: "e9r-u1-x", code: "101", verlassen: 1, kopieren: 0 });
  assert.equal(v.data.verlassen, 3);
  assert.equal(v.data.kopieren, 0);
  const s2 = await post("/api/vokabeltest/start", { testId: "e9r-u1-x", code: "101" });
  assert.deepEqual(s2.data.vorfaelle, { verlassen: 3, kopieren: 0, wegSumme: 40, weg: null, aktiv: null });

  // ohne gültigen Code nichts
  assert.equal((await post("/api/vokabeltest/vorfall", { testId: "e9r-u1-x", code: "000", verlassen: 9 })).status, 403);
});

test("Ohne Regelverstoß: Note nach Punkten, Zahlen stehen in der Abgabe", async () => {
  const r = await post("/api/vokabeltest/submit", { testId: "e9r-u1-x", code: "101", answers: ["dog", "cat"], verlassen: 2, regel: true, kopierversuche: 0 });
  assert.equal(r.status, 200);
  const rec = await abgabe("101");
  assert.equal(rec.grade, 1);
  assert.equal(rec.verlassen, 3, "der Server hatte schon 3 gezählt");
  assert.equal(rec.wegSekunden, 40);
  assert.equal(rec.kopierversuche, 0);
  assert.equal(rec.abbruch, undefined);
  // nach der Abgabe ist der Zwischenstand weg
  const vf = JSON.parse(fs.readFileSync(path.join(dataDir, "vokabeltest_vorfaelle.json"), "utf8"));
  assert.equal(vf.vorfaelle["e9r-u1-x|code|101"], undefined);
});

test("Oft verlassen: keine Note 6 mehr – auch wenn eine ältere Seite noch „verlassen“ meldet", async () => {
  const r = await post("/api/vokabeltest/submit", { testId: "e9r-u1-x", code: "102", answers: ["dog", "cat"], verlassen: 5, regel: true,
    kopierversuche: 0, abbruch: { grund: "verlassen" } });
  assert.equal(r.status, 200);
  const rec = await abgabe("102");
  assert.equal(rec.score, 2);
  assert.equal(rec.grade, 1);
  assert.equal(rec.abbruch, undefined);
  assert.equal(rec.verlassen, 5, "das Verlassen steht weiter in der Abgabe");
});

test("1. Kopierversuch: Note 6 ohne Vorwarnung; die Lehrkraft hebt sie auf und setzt sie wieder", async () => {
  await post("/api/vokabeltest/submit", { testId: "e9r-u1-x", code: "103", answers: ["dog", ""], regel: true, kopierversuche: 1, regelKopieren: 1, abbruch: { grund: "kopieren" } });
  let rec = await abgabe("103");
  assert.equal(rec.grade, 6);
  assert.equal(rec.abbruch.grund, "kopieren");
  assert.match(rec.kommentar, /ohne Vorwarnung/);

  assert.equal((await post("/api/vokabeltest/abbruch", { password: "falsch", submissionId: rec.id, aufheben: true })).status, 401);
  const auf = await post("/api/vokabeltest/abbruch", { password: "pw", submissionId: rec.id, aufheben: true });
  assert.equal(auf.data.grade, 3, "50 % im R-Schlüssel");
  rec = await abgabe("103");
  assert.equal(rec.abbruch.aufgehoben, true);
  assert.equal(rec.kommentar, undefined);

  const wieder = await post("/api/vokabeltest/abbruch", { password: "pw", submissionId: rec.id, aufheben: false });
  assert.equal(wieder.data.grade, 6);
  assert.match((await abgabe("103")).kommentar, /kopieren oder einzufügen/);

  // eine Abgabe ohne Abbruch lässt sich nicht „aufheben“
  const normal = await abgabe("101");
  assert.equal((await post("/api/vokabeltest/abbruch", { password: "pw", submissionId: normal.id, aufheben: true })).status, 409);
});

test("Server-Zählung reicht: Seite meldet keinen Kopierversuch, Server kennt einen -> Note 6", async () => {
  await post("/api/vokabeltest/start", { testId: "e9r-u1-x", code: "104" });
  await post("/api/vokabeltest/vorfall", { testId: "e9r-u1-x", code: "104", verlassen: 5, kopieren: 1 });
  await post("/api/vokabeltest/submit", { testId: "e9r-u1-x", code: "104", answers: ["dog", "cat"], verlassen: 4, regel: true, kopierversuche: 0, regelKopieren: 1 });
  const rec = await abgabe("104");
  assert.equal(rec.grade, 6);
  assert.equal(rec.abbruch.grund, "kopieren");
  assert.equal(rec.abbruch.verlassen, 5);
});

test("Übergang: Eine noch offene ältere Seite (ohne regelKopieren) hat beim 1. Kopierversuch nur gewarnt – erst der 2. gibt Note 6", async () => {
  await post("/api/vokabeltest/submit", { testId: "e9r-u1-x", code: "117", answers: ["dog", "cat"], regel: true, kopierversuche: 1 });
  const rec = await abgabe("117");
  assert.equal(rec.grade, 1);
  assert.equal(rec.abbruch, undefined);
  assert.equal(rec.kopierversuche, 1);
  await post("/api/vokabeltest/submit", { testId: "e9r-u1-x", code: "118", answers: ["dog", "cat"], regel: true, kopierversuche: 2, abbruch: { grund: "kopieren" } });
  const r2 = await abgabe("118");
  assert.equal(r2.grade, 6);
  assert.match(r2.kommentar, /zweiter Versuch/);
});

test("Alte Seite ohne Regel: keine Note 6, auch bei vielen Wechseln", async () => {
  await post("/api/vokabeltest/submit", { testId: "e9r-u1-x", code: "105", answers: ["dog", "cat"], verlassen: 7 });
  const rec = await abgabe("105");
  assert.equal(rec.grade, 1);
  assert.equal(rec.abbruch, undefined);
});

test("Abgabe gelöscht (neu schreiben): die Zählung beginnt von vorn", async () => {
  await post("/api/vokabeltest/start", { testId: "e9r-u1-x", code: "106" });
  await post("/api/vokabeltest/vorfall", { testId: "e9r-u1-x", code: "106", verlassen: 2 });
  await post("/api/vokabeltest/submit", { testId: "e9r-u1-x", code: "106", answers: ["dog", "cat"], regel: true });
  // nach der Abgabe nimmt der Server keine Meldungen mehr an
  assert.equal((await post("/api/vokabeltest/vorfall", { testId: "e9r-u1-x", code: "106", verlassen: 3 })).status, 409);
  const rec = await abgabe("106");
  assert.equal((await post("/api/vokabeltest/delete-submission", { password: "pw", submissionId: rec.id })).status, 200);
  const s = await post("/api/vokabeltest/start", { testId: "e9r-u1-x", code: "106" });
  assert.deepEqual(s.data.vorfaelle, { verlassen: 0, kopieren: 0, wegSumme: 0, weg: null, aktiv: null });
});

/* ---------- seit 17.10.2026: länger als 1 Minute weg, automatisch abgeben (Englisch seit 21.10.2026: weg ohne Note 6) ---------- */
test("Länger als 1 Minute weg: keine Note 6 mehr, die Sekunden stehen als Vermerk in der Abgabe", async () => {
  await post("/api/vokabeltest/submit", { testId: "e9r-u1-x", code: "107", answers: ["dog", "cat"], regel: true, wegSumme: 75, abbruch: { grund: "weg", sekunden: 75 } });
  const rec = await abgabe("107");
  assert.equal(rec.score, 2);
  assert.equal(rec.grade, 1);
  assert.equal(rec.abbruch, undefined);
  assert.equal(rec.wegSekunden, 75);
});

test("Automatisch abgegeben (5 Minuten nichts eingegeben, Bildschirm gesperrt): Note nach Punkten, nur ein Vermerk", async () => {
  await post("/api/vokabeltest/submit", { testId: "e9r-u1-x", code: "108", answers: ["dog", ""], regel: true, automatisch: "ruhe" });
  const rec = await abgabe("108");
  assert.equal(rec.grade, 3, "50 % im R-Schlüssel");
  assert.equal(rec.automatisch, "ruhe");
  assert.equal(rec.abbruch, undefined);
  // ein unbekannter Grund wird nicht übernommen
  await post("/api/vokabeltest/submit", { testId: "e9r-u1-x", code: "109", answers: ["dog", "cat"], regel: true, automatisch: "irgendwas" });
  assert.equal((await abgabe("109")).automatisch, undefined);
});

test("Seite meldet ihren Stand; verlassen und nicht zurück: der Server gibt nach 5 Minuten ab – ohne Note 6 (Englisch)", async () => {
  await post("/api/vokabeltest/start", { testId: "e9r-u1-x", code: "110" });
  const weg = new Date().toISOString();
  const v = await post("/api/vokabeltest/vorfall", { testId: "e9r-u1-x", code: "110", verlassen: 1, kopieren: 0, wegSumme: 12, sichtbar: false, weg,
    aktiv: weg, answers: ["dog", "kat"], testDate: "2026-10-17" });
  assert.equal(v.status, 200);
  assert.equal(v.data.verlassen, 1);
  // Start auf einem anderen Gerät erfährt, seit wann die Seite verlassen ist und wie lange schon insgesamt
  const s = await post("/api/vokabeltest/start", { testId: "e9r-u1-x", code: "110" });
  assert.equal(s.data.vorfaelle.weg, weg);
  assert.equal(s.data.vorfaelle.wegSumme, 12);
  assert.equal(await vt.automatischAbgeben(Date.now() + 4 * 60 * 1000), 0, "nach 4 Minuten noch nicht");
  assert.equal(await abgabe("110"), undefined);
  assert.equal(await vt.automatischAbgeben(Date.now() + 6 * 60 * 1000), 1);
  const rec = await abgabe("110");
  assert.equal(rec.score, 1);
  assert.equal(rec.grade, 3, "50 % im R-Schlüssel – Verlassen gibt keine Note 6");
  assert.equal(rec.abbruch, undefined);
  assert.equal(rec.automatisch, "server");
  assert.ok(rec.wegSekunden > 360, "12 s vorher + 6 Minuten");
  assert.equal(rec.testDate, "2026-10-17");
  assert.equal(rec.verlassen, 2);
  // danach nimmt der Server keine Meldungen mehr an – die Seite zeigt „schon abgegeben“
  assert.equal((await post("/api/vokabeltest/vorfall", { testId: "e9r-u1-x", code: "110", sichtbar: true })).status, 409);
});

test("Fertig und Bildschirm gesperrt (2 Minuten nichts eingegeben, dann weg): der Server gibt ohne Note 6 ab", async () => {
  const jetzt = Date.now(), weg = new Date(jetzt).toISOString(), aktiv = new Date(jetzt - 3 * 60 * 1000).toISOString();
  await post("/api/vokabeltest/vorfall", { testId: "e9r-u1-x", code: "113", sichtbar: false, weg, aktiv, answers: ["dog", "cat"] });
  assert.equal(await vt.automatischAbgeben(jetzt + 6 * 60 * 1000), 1);
  const rec = await abgabe("113");
  assert.equal(rec.automatisch, "gesperrt");
  assert.equal(rec.abbruch, undefined);
  assert.equal(rec.grade, 1);
});

test("Summe aus mehreren Wechseln: auch 61 Sekunden oder mehr geben keine Note 6 – der höchste Stand steht als Vermerk da", async () => {
  await post("/api/vokabeltest/submit", { testId: "e9r-u1-x", code: "114", answers: ["dog", "cat"], regel: true, wegSumme: 61 });
  const rec = await abgabe("114");
  assert.equal(rec.grade, 1);
  assert.equal(rec.abbruch, undefined);
  assert.equal(rec.wegSekunden, 61);
  // Server kennt die höhere Summe (anderes Gerät)
  await post("/api/vokabeltest/vorfall", { testId: "e9r-u1-x", code: "116", wegSumme: 70 });
  await post("/api/vokabeltest/submit", { testId: "e9r-u1-x", code: "116", answers: ["dog", "cat"], regel: true, wegSumme: 10 });
  const r116 = await abgabe("116");
  assert.equal(r116.grade, 1);
  assert.equal(r116.wegSekunden, 70);
});

test("Sichtbare Seite: der Server gibt erst nach 30 Minuten ohne Meldung ab, ohne Antwort gar nicht", async () => {
  await post("/api/vokabeltest/vorfall", { testId: "e9r-u1-x", code: "111", sichtbar: true, aktiv: new Date().toISOString(), answers: ["dog", ""] });
  await post("/api/vokabeltest/vorfall", { testId: "e9r-u1-x", code: "112", sichtbar: false, weg: new Date().toISOString(), answers: ["", ""] });
  assert.equal(await vt.automatischAbgeben(Date.now() + 10 * 60 * 1000), 0);
  assert.equal(await vt.automatischAbgeben(Date.now() + 31 * 60 * 1000), 1);
  assert.equal((await abgabe("111")).automatisch, "server");
  assert.equal(await abgabe("112"), undefined, "ohne eine einzige Antwort gibt der Server nicht ab");
});
