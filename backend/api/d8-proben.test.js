"use strict";

// Deutsch 8: Was die Proben über Deutsch 7 hinaus können (d7-proben.js mit stufe: 8, sitzung: true, marken: true) –
// Sitzung mit Zeit und Zwischenstand, Planung zu Schreibaufgaben, Einstellungen des Probenmodus, Fehlermarkierungen.
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const { registerD7ProbenRoutes, vorbereiten } = require("./d7-proben");

const PW = "Nur-ein-Test-4711";
const KINDER = { 801: { klasse: "8aM" }, 802: { klasse: "8aM", lrs: true }, 803: { klasse: "8aM" }, 811: { klasse: "8b" }, 701: { klasse: "7aM" } };
const kindZumCode = async (code) => {
  const k = KINDER[Number(code)];
  return k ? { code: String(code).padStart(3, "0"), klasse: k.klasse, zug: /M$/.test(k.klasse) ? "8M" : "8R", lrs: Boolean(k.lrs) } : null;
};
const AUFGABEN = () => [
  { type: "choice", prompt: "Was ist eine These?", options: ["eine Behauptung", "ein Beispiel", "eine Frage"], answer: 0 },
  { type: "offen", prompt: "Nenne ein Argument für längere Pausen.", kriterien: [{ text: "Argument mit Begründung", punkte: 2 }], expected: "Wer sich bewegt, kann sich danach besser konzentrieren." },
  { type: "schreiben", prompt: "Nimm Stellung: Soll das Handy in der Pause erlaubt sein?", minWoerter: 20, form: "stellungnahme",
    raster: [{ name: "Inhalt", punkte: 4 }, { name: "Aufbau", punkte: 3 }, { name: "Sprache", punkte: 3 }, { name: "Sprachrichtigkeit", punkte: 2, rs: true }] }
];
const PROBEN = () => ({
  "d8-p9-m-a": { id: "d8-p9-m-a", nr: 9, zug: "M", variante: "A", title: "Probe 9 (M8): Test", minutes: 30, texte: [], items: AUFGABEN() },
  "d8-p9-r-a": { id: "d8-p9-r-a", nr: 9, zug: "R", variante: "A", title: "Probe 9 (R8): Test", minutes: 30, texte: [], items: AUFGABEN() }
});
const AUFSATZ = "Ich finde, das Handy sollte in der Pause erlaubt sein. Erstens kann man seine Eltern erreichen, wenn der Unterricht ausfelt. Zweitens entspannen viele Schüler bei Musik. Natürlich gibt es auch Nachteile, zum Beispiel reden manche dann weniger miteinander. Trotzdem überwiegen für mich die Vorteile.";
const warte = (ms) => new Promise((ok) => setTimeout(ok, ms));

// KI-Attrappe: Raster mit vier Zeilen = Aufsatz (mit Markierungen), sonst offene Antwort
const ki = (merk = {}) => async (system, user) => {
  merk.system = (merk.system || []).concat(system);
  const a = JSON.parse(user);
  if (a.erwartungshorizont.length === 4) return JSON.stringify({ punkte: [3, 2, 2, 1], begruendung: ["Deine Meinung ist klar.", "Der Schluss passt.", "Gute Verknüpfungen.", "Wenige Fehler."],
    gelungen: ["Du nennst auch einen Nachteil."], arbeiten: ["Belege dein erstes Argument mit einem Beispiel."], hinweis: "Schreibe zu jedem Argument ein Beispiel.", kategorien: ["Beispiel fehlt"],
    markierungen: [
      { stelle: "ausfelt", art: "rechtschreibung", hinweis: "Denk an das Grundwort fallen." },
      { stelle: "Natürlich gibt es auch Nachteile", art: "gelungen", hinweis: "Du denkst an die Gegenseite." },
      { stelle: "entspannen viele   Schüler", art: "ausdruck", hinweis: "Wobei genau? Werde konkreter." },
      { stelle: "Das steht nirgends im Text", art: "inhalt", hinweis: "Diese Stelle gibt es nicht." },
      { stelle: "Erstens", art: "unbekannt", hinweis: "Unbekannte Art." }
    ] });
  return JSON.stringify({ punkte: [1], korrektur: "Dein Argument stimmt, die Begründung fehlt.", hinweis: "Schreibe ein „weil“ dazu.", kategorie: "Begründung fehlt" });
};

async function mitServer(lauf, extra = {}) {
  const dataDir = extra.dataDir || fs.mkdtempSync(path.join(os.tmpdir(), "d8-proben-"));
  const app = express();
  app.use(express.json());
  const modul = registerD7ProbenRoutes(app, { dataDir, prefix: "/api/d8/proben", datei: "d8-proben.json", stufe: 8, sitzung: true, marken: true, teacherPassword: PW, kindZumCode,
    tests: PROBEN(), askAnthropic: extra.ki === undefined ? ki() : extra.ki, kiPauseMs: 40, nachholenMs: 0, ...extra.opts });
  const server = await new Promise((resolve) => { const s = app.listen(0, () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (route, body) => fetch(base + "/api/d8/proben/" + route, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
    .then(async (r) => ({ status: r.status, data: await r.json().catch(() => null) }));
  const get = (route) => fetch(base + "/api/d8/proben/" + route).then((r) => r.json());
  const lehrer = (route, body) => post("teacher/" + route, { password: PW, ...body });
  const abgaben = async (testId) => (await lehrer("results", { testId })).data.submissions;
  const fertig = async (testId, n = 1) => { for (let i = 0; i < 600; i++) { const r = await abgaben(testId); if (r.length >= n && r.every((x) => x.status !== "eingegangen")) return r; await warte(25); } throw new Error("KI wurde nicht fertig"); };
  const sitzDatei = path.join(dataDir, "d8-proben-sitzungen.json");
  try {
    for (const id of ["d8-p9-m-a", "d8-p9-r-a"]) assert.equal((await lehrer("unlock", { testId: id, open: true })).status, 200);
    await lauf({ post, get, lehrer, abgaben, fertig, modul, dataDir, sitzDatei, datei: path.join(dataDir, "d8-proben.json") });
  } finally {
    await new Promise((resolve) => server.close(resolve));
    if (!extra.dataDir) fs.rmSync(dataDir, { recursive: true, force: true });
  }
}

test("Kennungen: Deutsch 8 nimmt d8-p…, nicht d7-p…; unbekannte Schreibform und kaputte Planung fallen beim Laden auf", () => {
  assert.throws(() => vorbereiten({ x: { id: "d7-p1-m-a", texte: [], items: [] } }, 8), /Kennung/);
  assert.doesNotThrow(() => vorbereiten(PROBEN(), 8));
  const falsch = PROBEN(); falsch["d8-p9-m-a"].items[2].form = "roman";
  assert.throws(() => vorbereiten(falsch, 8), /Schreibform/);
  const plan = PROBEN(); plan["d8-p9-m-a"].items[2].plan = [{ id: "Meine These", label: "x" }];
  assert.throws(() => vorbereiten(plan, 8), /Planung/);
});

test("Start: nur 8. Klassen; die Sitzung beginnt einmal – Neuladen setzt die Zeit nicht zurück", async () => {
  await mitServer(async ({ post, sitzDatei }) => {
    assert.equal((await post("start", { testId: "d8-p9-m-a", code: "701" })).status, 403);
    assert.equal((await post("start", { testId: "d8-p9-m-a", code: "811" })).data.error, "falscher_zug");
    const a = (await post("start", { testId: "d8-p9-m-a", code: "801" })).data;
    assert.equal(a.ok, true);
    assert.equal(a.sitzung.minuten, 30);
    assert.equal(Date.parse(a.sitzung.endetAm) - Date.parse(a.sitzung.begonnenAm), 30 * 60000);
    assert.equal(a.sitzung.timer, true);
    assert.equal(a.zwischenstand, undefined);
    assert.equal(a.items[2].form, "stellungnahme");
    assert.deepEqual(a.test.schutz, { wechsel: true, warnen: true, kopieren: "sperren", ausschneiden: "sperren", kontextmenue: "sperren", spruenge: true, timer: true });
    await warte(30);
    const b = (await post("start", { testId: "d8-p9-m-a", code: "801" })).data;
    assert.equal(b.sitzung.begonnenAm, a.sitzung.begonnenAm, "Beginn bleibt");
    assert.ok(Date.parse(b.sitzung.serverZeit) > Date.parse(a.sitzung.serverZeit));
    assert.equal(Object.keys(JSON.parse(fs.readFileSync(sitzDatei, "utf8")).sitzungen).length, 1);
  });
});

test("Zwischenstand: wird gesichert, kommt beim nächsten Start zurück, gibt nichts ab", async () => {
  await mitServer(async ({ post, abgaben }) => {
    await post("start", { testId: "d8-p9-m-a", code: "801" });
    assert.equal((await post("zwischenstand", { testId: "d8-p9-m-a", code: "801", answers: [0] })).status, 400, "falsche Anzahl");
    const z = await post("zwischenstand", { testId: "d8-p9-m-a", code: "801", answers: [0, "Bewegung hilft.", "Ich finde, "], plan: { 3: { these: "Handy erlauben", "arg-1": "Eltern erreichen", "Böse Kennung": "x" }, 1: { these: "gehört nicht hierher" } } });
    assert.equal(z.status, 200);
    assert.ok(z.data.gespeichertAm && z.data.sitzung.endetAm);
    const neu = (await post("start", { testId: "d8-p9-m-a", code: "801" })).data;
    assert.deepEqual(neu.zwischenstand.answers, [0, "Bewegung hilft.", "Ich finde, "]);
    assert.deepEqual(neu.zwischenstand.plan, { 3: { these: "Handy erlauben", "arg-1": "Eltern erreichen" } });
    assert.equal((await abgaben("d8-p9-m-a")).length, 0, "ein Zwischenstand ist keine Abgabe");
    // fremdes Kind, falscher Zug
    assert.equal((await post("zwischenstand", { testId: "d8-p9-m-a", code: "811", answers: [0, "", ""] })).status, 403);
    assert.equal((await post("zwischenstand", { testId: "d8-p9-m-a", code: "999", answers: [0, "", ""] })).status >= 400, true);
  });
});

test("Abgabe: Planung und Zeiten stehen bei der Lehrkraft, die Sitzung ist danach weg; überzogene Zeit ändert keine Punkte", async () => {
  await mitServer(async ({ post, fertig, sitzDatei }) => {
    await post("start", { testId: "d8-p9-m-a", code: "801" });
    // Beginn zurückdatieren: 41 Minuten Bearbeitung bei 30 erlaubten
    const sd = JSON.parse(fs.readFileSync(sitzDatei, "utf8"));
    Object.values(sd.sitzungen)[0].begonnenAm = new Date(Date.now() - 41 * 60000).toISOString();
    fs.writeFileSync(sitzDatei, JSON.stringify(sd));
    const r = await post("submit", { testId: "d8-p9-m-a", code: "801", answers: [0, "Wer sich bewegt, kann sich besser konzentrieren.", AUFSATZ], plan: { 3: { these: "Handy erlauben" } } });
    assert.equal(r.status, 200);
    const [row] = await fertig("d8-p9-m-a");
    assert.deepEqual(row.details[2].plan, { these: "Handy erlauben" });
    assert.equal(row.details[2].form, "stellungnahme");
    assert.equal(row.zeit.erlaubt, 30);
    assert.ok(row.zeit.minuten >= 41 && row.zeit.ueber >= 11, JSON.stringify(row.zeit));
    assert.equal(row.details[0].points, 1, "die Zeit ändert nichts an den Punkten");
    assert.ok(row.grade !== "", "und es gibt eine Note");
    assert.deepEqual(JSON.parse(fs.readFileSync(sitzDatei, "utf8")).sitzungen, {});
    assert.equal((await post("zwischenstand", { testId: "d8-p9-m-a", code: "801", answers: [0, "", ""] })).status, 409, "nach der Abgabe wird nichts mehr gesichert");
  });
});

test("Fehlermarkierungen: Die KI nennt Stellen, der Server macht Bereiche daraus – der Text des Kindes bleibt unverändert", async () => {
  await mitServer(async ({ post, fertig, lehrer }) => {
    await post("start", { testId: "d8-p9-m-a", code: "801" });
    await post("submit", { testId: "d8-p9-m-a", code: "801", answers: [0, "Bewegung hilft, weil man wacher ist.", AUFSATZ] });
    const [row] = await fertig("d8-p9-m-a");
    const d = row.details[2];
    assert.equal(d.given, AUFSATZ);
    assert.deepEqual(d.marken.map((m) => [AUFSATZ.slice(m.start, m.end), m.type, m.von]),
      [["ausfelt", "spelling", "ki"], ["entspannen viele Schüler", "expression", "ki"], ["Natürlich gibt es auch Nachteile", "positive", "ki"]]);
    assert.ok(d.marken.every((m) => m.comment));
    // Lehrkraft ändert: eine Markierung weg, eine eigene dazu; kaputte Angaben fallen heraus
    const start = AUFSATZ.indexOf("Trotzdem");
    const b = await lehrer("bewerten", { submissionId: row.id, nr: 3, marken: [d.marken[0], { start, end: start + 8, type: "structure", comment: "Guter Übergang zum Schluss." },
      { start: 5, end: 3, type: "content" }, { start: 0, end: 4, type: "erfunden" }, { start: 2, end: AUFSATZ.length + 50, type: "content" }, { start: d.marken[0].start + 1, end: d.marken[0].end + 4, type: "grammar" }] });
    assert.equal(b.status, 200);
    const neu = b.data.submission.details[2];
    assert.deepEqual(neu.marken.map((m) => [AUFSATZ.slice(m.start, m.end), m.type, m.von]), [["ausfelt", "spelling", "ki"], ["Trotzdem", "structure", "lehrer"]]);
    assert.equal(neu.given, AUFSATZ);
    // Schüleransicht: Bereiche ohne „von“
    await lehrer("bestaetigen", { submissionId: row.id });
    await lehrer("freigeben", { submissionId: row.id });
    const k = (await post("korrektur", { testId: "d8-p9-m-a", code: "801" })).data.korrektur;
    assert.equal(k.stufe, 8); assert.equal(k.fach, "Deutsch 8");
    assert.deepEqual(k.aufgaben[2].marken, neu.marken.map((m) => ({ start: m.start, end: m.end, type: m.type, comment: m.comment })));
    // zurücksetzen holt den Vorschlag der KI wieder
    const z = await lehrer("zuruecksetzen", { submissionId: row.id, nr: 3 });
    assert.equal(z.data.submission.details[2].marken.length, 3);
  });
});

test("Notenschutz: Die KI soll keine Rechtschreibfehler markieren – und tut sie es doch, fällt die Markierung weg", async () => {
  const merk = {};
  await mitServer(async ({ post, fertig }) => {
    await post("start", { testId: "d8-p9-m-a", code: "802" });
    await post("submit", { testId: "d8-p9-m-a", code: "802", answers: [0, "Bewegung hilft, weil man wacher ist.", AUFSATZ] });
    const [row] = await fertig("d8-p9-m-a");
    assert.ok(merk.system.some((s) => /Markiere keine Rechtschreibfehler/.test(s)));
    assert.ok(!row.details[2].marken.some((m) => m.type === "spelling"));
    assert.equal(row.details[2].marken.length, 2);
    const k = JSON.stringify((await post("korrektur", { testId: "d8-p9-m-a", code: "802" })).data || {});
    assert.ok(!/lrs|notenschutz/i.test(k));
  }, { ki: ki(merk) });
});

test("Einstellungen des Probenmodus je Probe: Die Lehrkraft schaltet einzeln, die Kinder bekommen den Stand", async () => {
  await mitServer(async ({ post, get, lehrer }) => {
    assert.equal((await lehrer("probe-einstellung", { nr: 9 })).status, 400);
    assert.equal((await lehrer("probe-einstellung", { nr: 99, schutz: { timer: false } })).status, 404);
    const r = await lehrer("probe-einstellung", { nr: 9, schutz: { timer: false, kopieren: "erlauben", warnen: "nein", kontextmenue: "egal", erfunden: true } });
    assert.equal(r.status, 200);
    assert.deepEqual(r.data.schutz, { wechsel: true, warnen: true, kopieren: "erlauben", ausschneiden: "sperren", kontextmenue: "sperren", spruenge: true, timer: false });
    assert.equal(r.data.einfuegen, "sperren");
    assert.equal((await lehrer("probe-einstellung", { nr: 9, einfuegen: "protokollieren" })).data.schutz.kopieren, "erlauben");
    const t = (await get("list")).tests.find((x) => x.id === "d8-p9-m-a");
    assert.equal(t.schutz.timer, false); assert.equal(t.einfuegen, "protokollieren");
    const s = (await post("start", { testId: "d8-p9-m-a", code: "801" })).data;
    assert.equal(s.sitzung.timer, false); assert.equal(s.test.schutz.kopieren, "erlauben");
  });
});

test("Lehrkraft: laufende Bearbeitungen sehen, Zeit für ein Kind verlängern, Zwischenstand als Abgabe übernehmen", async () => {
  await mitServer(async ({ post, lehrer, fertig }) => {
    await post("start", { testId: "d8-p9-m-a", code: "801" });
    await post("start", { testId: "d8-p9-m-a", code: "803" });
    await post("zwischenstand", { testId: "d8-p9-m-a", code: "803", answers: [0, "Bewegung hilft.", AUFSATZ], plan: { 3: { these: "erlauben" } } });
    const l = (await lehrer("sitzungen", { nr: 9 })).data;
    assert.deepEqual(l.sitzungen.map((s) => s.code), ["801", "803"]);
    assert.ok(l.sitzungen[1].woerter > 40 && l.sitzungen[1].gespeichertAm && !l.sitzungen[0].gespeichertAm);
    assert.equal((await post("teacher/sitzungen", { password: "falsch", nr: 9 })).status, 401);
    // Zeit verlängern
    assert.equal((await lehrer("sitzung-zeit", { nr: 9, code: "801", minuten: 500 })).status, 400);
    assert.equal((await lehrer("sitzung-zeit", { nr: 9, code: "999", minuten: 10 })).status, 404);
    assert.equal((await lehrer("sitzung-zeit", { nr: 9, code: "801", minuten: 10 })).data.sitzung.minuten, 40);
    assert.equal((await post("start", { testId: "d8-p9-m-a", code: "801" })).data.sitzung.minuten, 40);
    // Zwischenstand übernehmen
    assert.equal((await lehrer("sitzung-abgeben", { nr: 9, code: "801" })).status, 409, "noch nichts gesichert");
    const u = await lehrer("sitzung-abgeben", { nr: 9, code: "803" });
    assert.equal(u.status, 200);
    assert.equal(u.data.submission.vonLehrkraftAbgegeben, true);
    const rows = await fertig("d8-p9-m-a");
    assert.equal(rows.length, 1);
    assert.equal(rows[0].code, "803"); assert.equal(rows[0].details[2].given, AUFSATZ); assert.deepEqual(rows[0].details[2].plan, { these: "erlauben" });
    assert.equal((await lehrer("sitzung-abgeben", { nr: 9, code: "803" })).status, 404, "die Sitzung ist weg");
    assert.equal((await post("start", { testId: "d8-p9-m-a", code: "803" })).status, 409, "schon abgegeben");
  });
});

test("Sperrt die Lehrkraft die Probe, kann ein Kind mit laufender Sitzung in der Nachfrist weiterschreiben und abgeben – neu beginnen nicht", async () => {
  await mitServer(async ({ post, lehrer }) => {
    await post("start", { testId: "d8-p9-m-a", code: "801" });
    await lehrer("unlock", { testId: "d8-p9-m-a", open: false });
    assert.equal((await post("start", { testId: "d8-p9-m-a", code: "803" })).status, 403, "neu beginnen geht nicht");
    assert.equal((await post("start", { testId: "d8-p9-m-a", code: "801" })).status, 200, "weiterschreiben geht");
    assert.equal((await post("zwischenstand", { testId: "d8-p9-m-a", code: "801", answers: [0, "x", "y"] })).status, 200);
    assert.equal((await post("submit", { testId: "d8-p9-m-a", code: "801", answers: [0, "Bewegung hilft.", AUFSATZ] })).status, 200);
  });
});

test("Server verliert die Sitzung (Neustart ohne Spiegel): Der Beginn vom Gerät gilt, wenn er glaubhaft ist", async () => {
  await mitServer(async ({ post, sitzDatei }) => {
    const a = (await post("start", { testId: "d8-p9-m-a", code: "801" })).data;
    fs.rmSync(sitzDatei, { force: true });
    const vor20 = new Date(Date.now() - 20 * 60000).toISOString();
    const z = await post("zwischenstand", { testId: "d8-p9-m-a", code: "801", answers: [0, "", "Text"], begonnenAm: vor20 });
    assert.equal(z.data.sitzung.begonnenAm, vor20);
    fs.rmSync(sitzDatei, { force: true });
    const zukunft = new Date(Date.now() + 3600000).toISOString(), uralt = new Date(Date.now() - 9 * 3600000).toISOString();
    for (const t of [zukunft, uralt, "kein Datum"]) {
      fs.rmSync(sitzDatei, { force: true });
      const r = (await post("start", { testId: "d8-p9-m-a", code: "801", begonnenAm: t })).data;
      assert.ok(Math.abs(Date.parse(r.sitzung.begonnenAm) - Date.now()) < 5000, "unglaubhafter Beginn: es zählt jetzt");
    }
    assert.ok(a.sitzung.begonnenAm);
  });
});

test("Deutsch 7 bleibt, wie es ist: keine Sitzung, kein Zwischenstand, keine Markierungen", async () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "d7-ohne-"));
  const app = express(); app.use(express.json());
  const proben = { "d7-p9-m-a": { id: "d7-p9-m-a", nr: 9, zug: "M", variante: "A", title: "Probe 9 (M7): Test", minutes: 30, texte: [], items: AUFGABEN().map((x) => { delete x.form; return x; }) } };
  const k7 = async (code) => (code === "701" ? { code: "701", klasse: "7aM", zug: "7M", lrs: false } : null);
  const merk = {};
  registerD7ProbenRoutes(app, { dataDir, teacherPassword: PW, kindZumCode: k7, tests: proben, askAnthropic: ki(merk), kiPauseMs: 40, nachholenMs: 0 });
  const server = await new Promise((resolve) => { const s = app.listen(0, () => resolve(s)); });
  const post = (route, body) => fetch(`http://127.0.0.1:${server.address().port}/api/d7/proben/` + route, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).then(async (r) => ({ status: r.status, data: await r.json().catch(() => null) }));
  try {
    await post("teacher/unlock", { password: PW, testId: "d7-p9-m-a", open: true });
    const s = (await post("start", { testId: "d7-p9-m-a", code: "701" })).data;
    assert.equal(s.sitzung, undefined); assert.equal(s.test.schutz, undefined);
    assert.equal((await post("zwischenstand", { testId: "d7-p9-m-a", code: "701", answers: [0, "", ""] })).status, 404);
    await post("submit", { testId: "d7-p9-m-a", code: "701", answers: [0, "Bewegung hilft, weil man wacher ist.", AUFSATZ] });
    let row;
    for (let i = 0; i < 400; i++) { row = (await post("teacher/results", { password: PW, testId: "d7-p9-m-a" })).data.submissions[0]; if (row && row.status !== "eingegangen") break; await warte(25); }
    assert.equal(row.details[2].marken, undefined);
    assert.equal(row.zeit, undefined);
    assert.ok(!merk.system.some((x) => /markierungen/.test(x)), "der Auftrag an die KI ist für Deutsch 7 unverändert");
    assert.ok(!fs.existsSync(path.join(dataDir, "d7-proben-sitzungen.json")));
    assert.equal((await post("teacher/probe-einstellung", { password: PW, nr: 9, schutz: { timer: false } })).status, 400);
    assert.equal((await post("teacher/probe-einstellung", { password: PW, nr: 9, einfuegen: "protokollieren" })).data.schutz, undefined);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    fs.rmSync(dataDir, { recursive: true, force: true });
  }
});
