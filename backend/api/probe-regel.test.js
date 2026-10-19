"use strict";

// Testregeln aller Proben (17.10.2026): länger als 1 Minute weg oder 2. Kopierversuch = Probe beendet, Note 6;
// Zählung beim Server (/api/probe-regel/vorfall), Aufheben durch die Lehrkraft (/api/probe-regel/aufheben).
// Geprüft mit dem NT-7-Modul (nt7.js, gilt ebenso für NT 8 und Informatik 7/8/9).
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const express = require("express");
const { registerNt7Routes } = require("./nt7");
const { registerProbeRegel, abbruchAusAbgabe, REGEL } = require("./probe-regel");

const TESTS = {
  "nt7-x-m": { id: "nt7-x-m", title: "Probe X", scope: "Test", minutes: 10, zug: "M", thema: "luft", items: [
    { type: "choice", prompt: "Was brennt?", options: ["Holz", "Stein", "Glas"], answer: 0, points: 2 },
    { type: "choice", prompt: "Was löscht?", options: ["Benzin", "Sand", "Papier"], answer: 1, points: 2 }
  ] }
};
const kindZumCode = async (code) => (/^\d{3}$/.test(code) && code !== "000" ? { code, klasse: "7aM", lrs: false } : null);

let server, basis, dataDir;
test.before(async () => {
  dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "probe-regel-"));
  const app = express();
  app.use(express.json());
  registerProbeRegel(app, { dataDir, kindZumCode, teacherPassword: "pw" });
  registerNt7Routes(app, { dataDir, kindZumCode, teacherPassword: "pw", tests: TESTS });
  await new Promise((resolve) => { server = app.listen(0, "127.0.0.1", resolve); });
  basis = `http://127.0.0.1:${server.address().port}`;
  await post("/api/nt7/teacher/unlock", { password: "pw", testId: "nt7-x-m", open: true });
});
test.after(() => server && server.close());

async function post(route, body) {
  const res = await fetch(basis + route, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return { status: res.status, data: await res.json() };
}
const abgabe = async (code) => (await post("/api/nt7/teacher/results", { password: "pw", testId: "nt7-x-m" })).data.submissions.find((s) => s.code === code);

test("Regeln: 1 Minute, 2. Kopierversuch, keine Höchstzahl für Wechsel", () => {
  assert.deepEqual(REGEL, { verlassen: 0, kopieren: 2, wegSekunden: 60 });
  assert.equal(abbruchAusAbgabe({ regel: true, verlassen: 9 }, {}), null, "viele kurze Wechsel allein beenden keine Probe");
  assert.equal(abbruchAusAbgabe({ abbruch: { grund: "weg" } }, {}), null, "ohne regel: true (alte Seite) kein Abbruch");
  assert.equal(abbruchAusAbgabe({ regel: true, kopierversuche: 2 }, {}).grund, "kopieren");
  assert.equal(abbruchAusAbgabe({ regel: true }, { kopieren: 2 }).grund, "kopieren", "Server-Zählung reicht");
  // insgesamt mehr als 60 Sekunden weg (Summe aller Wechsel ab 5 Sekunden, Seite oder Server)
  assert.equal(abbruchAusAbgabe({ regel: true, wegSumme: 60 }, {}), null, "60 Sekunden sind erlaubt");
  assert.equal(abbruchAusAbgabe({ regel: true, wegSumme: 61 }, {}).grund, "weg");
  assert.equal(abbruchAusAbgabe({ regel: true, wegSumme: 61 }, {}).sekunden, 61);
  assert.equal(abbruchAusAbgabe({ regel: true, wegSumme: 20 }, { wegSumme: 75 }).sekunden, 75, "Server-Summe reicht");
  assert.equal(abbruchAusAbgabe({ regel: true, wegSumme: 90, automatisch: "gesperrt" }, {}), null, "Bildschirm gesperrt: nur abgegeben");
  // Probe ohne 1-Minuten-Regel (wegSekunden 0): weder die Summe noch eine gemeldete „weg“-Beendigung geben Note 6
  const ohne = { ...REGEL, wegSekunden: 0 };
  assert.equal(abbruchAusAbgabe({ regel: true, wegSumme: 500 }, {}, ohne), null);
  assert.equal(abbruchAusAbgabe({ regel: true, wegSumme: 500, abbruch: { grund: "weg", sekunden: 500 } }, {}, ohne), null);
  assert.equal(abbruchAusAbgabe({ regel: true, kopierversuche: 2 }, {}, ohne).grund, "kopieren", "Kopieren zählt weiter");
  // Probe ganz ohne Note-6-Regel (Informatik 8 Probe 1c/2c: wegSekunden 0 und kopieren 0)
  const frei = { ...REGEL, wegSekunden: 0, kopieren: 0 };
  assert.equal(abbruchAusAbgabe({ regel: true, kopierversuche: 9, wegSumme: 500 }, { kopieren: 9 }, frei), null);
  assert.equal(abbruchAusAbgabe({ regel: true, kopierversuche: 2, abbruch: { grund: "kopieren", kopieren: 2 } }, {}, frei), null, "auch wenn eine ältere Seite „kopieren“ meldet");
});

test("Zählung beim Server: höchster Stand, nur mit gültigem Code und bekanntem Modul", async () => {
  assert.equal((await post("/api/probe-regel/vorfall", { modul: "nt7", testId: "nt7-x-m", code: "701", verlassen: 2, kopieren: 1 })).status, 200);
  const v = await post("/api/probe-regel/vorfall", { modul: "nt7", testId: "nt7-x-m", code: "701", verlassen: 1, kopieren: 0, wegSumme: 14 });
  assert.deepEqual([v.data.verlassen, v.data.kopieren, v.data.wegSumme], [2, 1, 14]);
  assert.equal((await post("/api/probe-regel/vorfall", { modul: "gibtsnicht", testId: "x", code: "701" })).status, 404);
  assert.equal((await post("/api/probe-regel/vorfall", { modul: "nt7", testId: "nt7-x-m", code: "999x" })).status, 400);
});

test("Ohne Verstoß: Note nach Punkten; die Kopierversuche (Server) stehen in der Abgabe, die Zählung ist danach weg", async () => {
  const r = await post("/api/nt7/submit", { testId: "nt7-x-m", code: "701", answers: [0, 1], regel: true, kopierversuche: 0 });
  assert.equal(r.status, 200);
  const rec = await abgabe("701");
  assert.equal(rec.grade, 1);
  assert.equal(rec.kopierversuche, 1);
  assert.equal(rec.wegSekunden, 14, "Sekunden insgesamt verlassen (Vermerk in der Verwaltung)");
  assert.equal(rec.abbruch, undefined);
  const db = JSON.parse(fs.readFileSync(path.join(dataDir, "probe_regel.json"), "utf8"));
  assert.equal(db.eintraege["nt7|nt7-x-m|code|701"], undefined);
});

test("Länger als 1 Minute weg: Note 6 – bleibt nach dem Ändern von Punkten; Lehrkraft hebt auf und setzt wieder", async () => {
  await post("/api/nt7/submit", { testId: "nt7-x-m", code: "702", answers: [0, 1], regel: true, abbruch: { grund: "weg", sekunden: 95 } });
  let rec = await abgabe("702");
  assert.equal(rec.score, 4);
  assert.equal(rec.grade, 6);
  assert.equal(rec.abbruch.grund, "weg");
  assert.match(rec.kommentar, /95 Sekunden/);

  assert.equal((await post("/api/probe-regel/aufheben", { password: "falsch", modul: "nt7", submissionId: rec.id, aufheben: true })).status, 401);
  const auf = await post("/api/probe-regel/aufheben", { password: "pw", modul: "nt7", submissionId: rec.id, aufheben: true });
  assert.equal(auf.status, 200);
  assert.equal(auf.data.grade, 1);
  rec = await abgabe("702");
  assert.equal(rec.abbruch.aufgehoben, true);
  assert.equal(rec.kommentar, undefined);

  const wieder = await post("/api/probe-regel/aufheben", { password: "pw", modul: "nt7", submissionId: rec.id, aufheben: false });
  assert.equal(wieder.data.grade, 6);
  assert.match((await abgabe("702")).kommentar, /Note 6/);

  const normal = await abgabe("701");
  assert.equal((await post("/api/probe-regel/aufheben", { password: "pw", modul: "nt7", submissionId: normal.id, aufheben: true })).status, 409);
});

test("Automatisch abgegeben ohne Note 6 (Bildschirm gesperrt): nur ein Vermerk", async () => {
  await post("/api/nt7/submit", { testId: "nt7-x-m", code: "703", answers: [0, 0], regel: true, automatisch: "gesperrt" });
  const rec = await abgabe("703");
  assert.equal(rec.automatisch, "gesperrt");
  assert.equal(rec.abbruch, undefined);
  assert.notEqual(rec.grade, 6);
});

test("Alte Seite ohne Regel: keine Note 6; Abgabe gelöscht: Zählung von vorn", async () => {
  await post("/api/probe-regel/vorfall", { modul: "nt7", testId: "nt7-x-m", code: "704", kopieren: 5 });
  await post("/api/nt7/submit", { testId: "nt7-x-m", code: "704", answers: [0, 1] });
  const rec = await abgabe("704");
  assert.equal(rec.grade, 1);
  assert.equal(rec.abbruch, undefined);
  await post("/api/probe-regel/vorfall", { modul: "nt7", testId: "nt7-x-m", code: "705", kopieren: 1 });
  await post("/api/nt7/submit", { testId: "nt7-x-m", code: "705", answers: [0, 1], regel: true });
  const r5 = await abgabe("705");
  assert.equal((await post("/api/nt7/teacher/delete", { password: "pw", submissionId: r5.id })).status, 200);
  const v = await post("/api/probe-regel/vorfall", { modul: "nt7", testId: "nt7-x-m", code: "705" });
  assert.deepEqual([v.data.verlassen, v.data.kopieren], [0, 0]);
});
