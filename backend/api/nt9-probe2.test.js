"use strict";

// NT 9, Probe 2 Organische Rohstoffe (20.10.2026): nur Ankreuzen und Zuordnen, 50 Punkte, M-Schlüssel für 9M und 9R,
// ohne Note-6-Regel (Verlassen und Kopieren nur vermerkt), 30 Minuten Bearbeitungszeit mit automatischer Abgabe.
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const { registerInfoaustauschRoutes } = require("./infoaustausch");
const { TESTS, GRADE_SCALE, KI_REGELN } = require("./nt9-probe-daten");

const PW = "Nur-ein-Test-4711";
const KINDER = { 301: "9aM", 302: "9aM", 401: "9b", 402: "9b", 403: "9b" };
const kindZumCode = async (code) => (KINDER[code] ? { code: String(code), klasse: KINDER[code] } : null);
const IDS = ["nt9m-rohstoffe2", "nt9r-rohstoffe2"];
const punkteVon = (it) => (it.type === "match" ? it.rows.length : it.points);
// richtige Antworten der ersten Aufgaben, bis genau soll Punkte erreicht sind (der Rest bleibt leer)
function antwortenMit(t, soll) {
  let summe = 0;
  return t.items.map((it) => {
    const leer = it.type === "match" ? it.rows.map(() => null) : null;
    if (summe + punkteVon(it) > soll) return leer;
    summe += punkteVon(it);
    return it.type === "match" ? it.rows.map((r) => r.answer) : it.answer;
  });
}

async function mitServer(lauf, extra = {}) {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "nt9-probe2-"));
  const app = express();
  app.use(express.json());
  registerInfoaustauschRoutes(app, { prefix: "/api/nt9probe", storeName: "nt9probe", kindZumCode, gradeScale: GRADE_SCALE, kiRegeln: KI_REGELN,
    dataDir, teacherPassword: PW, tests: TESTS, ...extra });
  const server = await new Promise((resolve) => { const s = app.listen(0, () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (route, body) => fetch(base + "/api/nt9probe" + route, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
    .then(async (r) => ({ status: r.status, data: await r.json().catch(() => null) }));
  const get = (route) => fetch(base + "/api/nt9probe" + route).then((r) => r.json());
  try {
    for (const id of [...IDS, "nt9m-rohstoffe"]) assert.equal((await post("/unlock", { password: PW, testId: id, open: true })).status, 200);
    const sitzDatei = path.join(dataDir, "nt9probe_sitzungen.json");
    const sitzungen = () => JSON.parse(fs.readFileSync(sitzDatei, "utf8")).sitzungen;
    const zurueckdrehen = (minuten) => {
      const d = JSON.parse(fs.readFileSync(sitzDatei, "utf8"));
      Object.values(d.sitzungen).forEach((s) => { s.begonnenAm = new Date(Date.now() - minuten * 60000).toISOString(); });
      fs.writeFileSync(sitzDatei, JSON.stringify(d));
    };
    const abgaben = async (testId) => (await post("/results", { password: PW, testId })).data.submissions;
    await lauf({ post, get, sitzungen, zurueckdrehen, abgaben });
  } finally {
    await new Promise((resolve) => server.close(resolve));
    fs.rmSync(dataDir, { recursive: true, force: true });
  }
}
const warte = (ms) => new Promise((ok) => setTimeout(ok, ms));

test("Aufbau: 50 Punkte, nur Ankreuzen und Zuordnen, alle sieben Module, jedes mit einer Animation", () => {
  for (const id of IDS) {
    const t = TESTS[id];
    assert.equal(t.items.reduce((s, it) => s + punkteVon(it), 0), 50, id);
    assert.deepEqual([...new Set(t.items.map((it) => it.type))].sort(), ["choice", "match"], id + ": keine offenen Fragen");
    assert.deepEqual([t.notenzug, t.wegSekunden, t.kopieren, t.abgabeMinuten, t.thema], ["M", 0, 0, 30, "rohstoffe"], id);
    const module = ["m1", "m2", "m3", "m4", "m5", "m6", "m7"];
    module.forEach((m) => {
      const teil = t.items.filter((it) => it.modul === m);
      assert.ok(teil.length >= 3, id + " " + m);
      assert.ok(teil.some((it) => it.image), id + " " + m + ": Animation");
    });
    t.items.forEach((it, i) => {
      assert.ok(module.includes(it.modul) && it.modulTitel === it.teil, id + " Aufgabe " + (i + 1));
      if (it.image) {
        assert.ok(it.imageAlt.length > 40, id + " Aufgabe " + (i + 1) + ": Bildbeschreibung");
        for (const zug of ["9M", "9R"]) {
          const datei = path.join(__dirname, "..", "..", "..", "..", zug, "NT_9", "App12_Organische_Rohstoffe", it.image);
          if (fs.existsSync(path.dirname(datei))) assert.ok(fs.existsSync(datei), datei);
        }
      }
    });
  }
  // gleiche Aufgaben in beiden Kennungen
  assert.deepEqual(TESTS[IDS[0]].items.map((it) => it.prompt), TESTS[IDS[1]].items.map((it) => it.prompt));
});

test("Liste und Start nennen M-Schlüssel, Testregeln ohne Note 6 und die Bearbeitungszeit – die anderen Proben nicht", async () => {
  await mitServer(async ({ post, get }) => {
    const liste = (await get("/list")).tests;
    for (const id of IDS) {
      const t = liste.find((x) => x.id === id);
      assert.deepEqual([t.maxPoints, t.notenzug, t.wegSekunden, t.kopieren, t.abgabeMinuten, t.unlocked], [50, "M", 0, 0, 30, true], id);
    }
    const alt = liste.find((x) => x.id === "nt9m-rohstoffe");
    assert.deepEqual([alt.notenzug, alt.wegSekunden, alt.kopieren, alt.abgabeMinuten], [undefined, undefined, undefined, undefined]);

    const start = await post("/start", { testId: "nt9r-rohstoffe2", code: "401" });
    assert.equal(start.status, 200);
    assert.deepEqual([start.data.test.notenzug, start.data.test.wegSekunden, start.data.test.kopieren], ["M", 0, 0]);
    const s = start.data.sitzung;
    assert.equal(Date.parse(s.endetAm) - Date.parse(s.begonnenAm), 30 * 60000);
    assert.ok(start.data.items.every((it) => it.answer === undefined && it.points >= 1), "keine Lösungen");
    // Neuladen: die Uhr läuft weiter
    await warte(20);
    const nochmal = await post("/start", { testId: "nt9r-rohstoffe2", code: "401" });
    assert.equal(nochmal.data.sitzung.begonnenAm, s.begonnenAm);

    const altStart = await post("/start", { testId: "nt9m-rohstoffe", code: "301" });
    assert.equal(altStart.status, 200);
    assert.equal(altStart.data.sitzung, undefined, "frühere Proben ohne Bearbeitungszeit");
  });
});

test("M-Schlüssel auch für die R-Klasse: 50 % = Note 4; Verlassen und Kopieren geben keine Note 6", async () => {
  await mitServer(async ({ post, abgaben }) => {
    const t = TESTS["nt9r-rohstoffe2"];
    await post("/start", { testId: t.id, code: "401" });
    const r = await post("/submit", { testId: t.id, code: "401", answers: antwortenMit(t, 25), verlassen: 7,
      regel: true, kopierversuche: 6, wegSumme: 900, abbruch: { grund: "weg", sekunden: 900 } });
    assert.equal(r.status, 200);
    const [rec] = await abgaben(t.id);
    assert.deepEqual([rec.score, rec.total, rec.percent, rec.zug, rec.notenzug, rec.grade], [25, 50, 50, "R", "M", 4]);
    assert.equal(rec.abbruch, undefined, "keine Note 6 trotz 15 Minuten weg und 6 Kopierversuchen");
    assert.deepEqual([rec.verlassen, rec.kopierversuche, rec.wegSekunden], [7, 6, 900], "nur vermerkt");

    // volle Punktzahl in der M-Klasse
    const m = TESTS["nt9m-rohstoffe2"];
    await post("/start", { testId: m.id, code: "301" });
    assert.equal((await post("/submit", { testId: m.id, code: "301", answers: antwortenMit(m, 50), regel: true })).status, 200);
    const [recM] = await abgaben(m.id);
    assert.deepEqual([recM.score, recM.grade], [50, 1]);

    // Lehrkraft ändert Punkte: der Schlüssel bleibt M
    const det = rec.details.find((d) => d.points === 0);
    const o = await post("/override", { password: PW, submissionId: rec.id, nr: det.nr, points: det.maxPoints });
    assert.equal(o.status, 200);
    const p = Math.round(((25 + det.maxPoints) / 50) * 100);
    assert.equal(o.data.grade, p >= 67 ? 3 : 4, "M-Schlüssel nach dem Ändern");
  });
});

test("Zeit um: Die Seite gibt mit „zeit“ ab; ist die Seite zu, gibt der Server mit dem Zwischenstand ab (ohne Note 6)", async () => {
  await mitServer(async ({ post, sitzungen, zurueckdrehen, abgaben }) => {
    const t = TESTS["nt9m-rohstoffe2"];
    // Kind 301: Seite gibt nach Ablauf selbst ab
    await post("/start", { testId: t.id, code: "301" });
    const a = await post("/submit", { testId: t.id, code: "301", answers: antwortenMit(t, 10), regel: true, automatisch: "zeit" });
    assert.equal(a.status, 200);
    // Kind 302: Seite zu – nur der Zwischenstand liegt auf dem Server
    await post("/start", { testId: t.id, code: "302" });
    const zs = await post("/zwischenstand", { testId: t.id, code: "302", answers: antwortenMit(t, 20), verlassen: 2, kopierversuche: 1, wegSumme: 45 });
    assert.equal(zs.status, 200);
    assert.equal((await post("/zwischenstand", { testId: t.id, code: "999", answers: [] })).status, 404, "ohne Start kein Zwischenstand");
    assert.equal(Object.keys(sitzungen()).length, 1, "nach der Abgabe von 301 ist nur noch eine Bearbeitung offen");
    zurueckdrehen(31);
    await warte(700);   // der Server prüft hier alle 100 ms
    const liste = await abgaben(t.id);
    const r301 = liste.find((x) => x.code === "301"), r302 = liste.find((x) => x.code === "302");
    assert.equal(r301.automatisch, "zeit");
    assert.equal(r302.automatisch, "server");
    assert.deepEqual([r302.score, r302.verlassen, r302.kopierversuche, r302.wegSekunden, r302.abbruch], [20, 2, 1, 45, undefined]);
    assert.deepEqual(sitzungen(), {}, "Bearbeitung abgeschlossen");
    // Seite kommt zu spät: schon abgegeben
    assert.equal((await post("/submit", { testId: t.id, code: "302", answers: antwortenMit(t, 50), regel: true })).status, 409);
  }, { zeitTaktMs: 100, nachfristMs: 0 });
});

test("Zeit um beim Neuladen: Start gibt mit dem letzten Stand ab; Abgabe löschen (Nachschreiben) startet die Uhr neu", async () => {
  await mitServer(async ({ post, zurueckdrehen, abgaben }) => {
    const t = TESTS["nt9r-rohstoffe2"];
    await post("/start", { testId: t.id, code: "402" });
    await post("/zwischenstand", { testId: t.id, code: "402", answers: antwortenMit(t, 12) });
    zurueckdrehen(30.5);
    const s = await post("/start", { testId: t.id, code: "402" });
    assert.deepEqual([s.status, s.data.zeitUm], [409, true]);
    const [rec] = await abgaben(t.id);
    assert.deepEqual([rec.code, rec.score, rec.automatisch], ["402", 12, "server"]);
    // Nachschreiben
    assert.equal((await post("/delete-submission", { password: PW, submissionId: rec.id })).status, 200);
    const neu = await post("/start", { testId: t.id, code: "402" });
    assert.equal(neu.status, 200);
    assert.ok(Date.now() - Date.parse(neu.data.sitzung.begonnenAm) < 5000, "neue Uhr");
    assert.equal(neu.data.zwischenstand, undefined, "alter Zwischenstand ist weg");
  }, { zeitTaktMs: 60000 });
});
