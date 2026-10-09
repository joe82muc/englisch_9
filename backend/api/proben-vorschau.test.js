"use strict";

// Vorschau jeder Probe für die Lehrkraft: Jede echte Probe aller Probenarten lässt sich in die gemeinsame Form
// bringen (vollständig, mit denselben Punkten wie beim Schreiben), und die Route gibt nichts ohne Passwort heraus.
const assert = require("node:assert/strict");
const test = require("node:test");
const express = require("express");
const { registerProbenVorschau, vorschau } = require("./proben-vorschau");
const d7 = require("./d7-proben");

const PW = "lehrer-geheim";
const QUELLEN = () => ({
  vokabeltest: { form: "vokabel", tests: require("./vokabeltest-daten").TESTS },
  grammatik9r: { form: "grammatik", tests: { ...require("./grammatik9r-daten").TESTS, ...require("./grammatik7-daten").TESTS } },
  nt7: { form: "nt", tests: require("./nt7-fragen") },
  nt8: { form: "nt", tests: require("./nt8-fragen") },
  inf7: { form: "nt", tests: require("./inf7-fragen") },
  inf8: { form: "nt", tests: require("./inf8-fragen") },
  d7proben: { form: "deutsch", tests: d7.vorbereiten(require("./d7-proben-daten"), 7) },
  d8proben: { form: "deutsch", tests: d7.vorbereiten(require("./d8-proben-daten"), 8) },
  infoaustausch: { form: "info", tests: require("./infoaustausch-daten").TESTS },
  nt9probe: { form: "info", tests: require("./nt9-probe-daten").TESTS },
  netzwerktest: { form: "info", tests: require("./netzwerktest-daten").TESTS },
  filiuspruefung: { form: "info", tests: require("./filiuspruefung-daten").TESTS }
});

// So rechnet jede Probenart selbst die Höchstpunktzahl (aus den jeweiligen Modulen übernommen)
const HOECHST = {
  vokabel: (t) => t.items.length,
  grammatik: (t) => t.items.reduce((s, it) => s + (it.type === "gap" ? (String(it.prompt).match(/___/g) || []).length : Number(it.points) || 1), 0),
  nt: (t) => t.items.reduce((s, it) => s + it.points, 0),
  deutsch: (t) => d7.maxPoints(t),
  info: (t) => t.items.reduce((s, it) => s + (it.type === "match" ? it.rows.length : Number(it.points) || 1), 0)
    + (t.upload ? (t.upload.checks || []).reduce((s, c) => s + c.punkte, 0) + (Number(t.upload.kiPunkte) || 0) : 0)
};

// Was eine Aufgabe je Art mindestens braucht, damit die Seite sie zeigen und die Lösung nennen kann
const liste = (v, n = 1) => Array.isArray(v) && v.length >= n;
const PFLICHT = {
  choice: (a) => liste(a.options, 2) && Number.isInteger(a.answer) && a.options[a.answer] !== undefined,
  multi: (a) => liste(a.options, 2) && liste(a.answers) && a.answers.every((i) => a.options[i] !== undefined),
  tf: (a) => liste(a.statements) && a.statements.every((s) => typeof s[0] === "string" && typeof s[1] === "boolean"),
  kreuz: (a) => liste(a.spalten, 2) && liste(a.zeilen) && a.zeilen.every((z) => typeof z[0] === "string" && a.spalten[z[1]] !== undefined),
  match: (a) => liste(a.pairs, 2) && a.pairs.every((p) => p[0] && p[1]),
  order: (a) => liste(a.steps, 2),
  gaps: (a) => typeof a.text === "string" && liste(a.gaps) && a.gaps.every((g, i) => liste(g, 2) && a.text.includes("{" + (i + 1) + "}")),
  luecke: (a) => /___/.test(a.prompt) && liste(a.solutions) && a.solutions.length === (a.prompt.match(/___/g) || []).length && a.solutions.every((s) => liste(s)),
  number: (a) => Number.isFinite(Number(a.answer)),
  labor: (a) => a.labor && a.labor.art && liste(a.regeln) && a.regeln.every((r) => r.text && Object.keys(r).length === 1),
  text: (a) => typeof a.expected === "string" && a.expected.length > 5 && Array.isArray(a.criteria),
  schreiben: (a) => liste(a.raster) && a.raster.every((k) => k.name && k.punkte > 0),
  zeile: (a) => liste(a.bereiche) && a.bereiche.every((b) => b[0] >= 1 && b[1] >= b[0]) && a.textRef,
  felder: (a) => liste(a.felder) && a.felder.every((f) => liste(f.loesungen)),
  komma: (a) => liste(a.saetze) && a.saetze.some((s) => s.includes(",")),
  vokabeln: (a) => liste(a.zeilen, 5) && a.zeilen.every((z) => z.prompt && liste(z.solutions)),
  datei: (a) => liste(a.checks) && a.checks.every((c) => c.text && c.punkte > 0)
};

test("Jede Probe aller Probenarten hat eine vollständige Vorschau mit denselben Punkten wie beim Schreiben", () => {
  const quellen = QUELLEN(), arten = new Set();
  let anzahl = 0;
  Object.entries(quellen).forEach(([modul, q]) => {
    const ids = Object.keys(q.tests);
    assert.ok(ids.length > 0, modul + ": keine Proben gefunden");
    ids.forEach((id) => {
      const wo = modul + "/" + id, d = vorschau(q.form, q.tests[id]);
      anzahl++;
      assert.ok(d.title && typeof d.title === "string", wo + ": Titel fehlt");
      assert.ok(d.items.length > 0, wo + ": keine Aufgaben");
      assert.equal(d.total, HOECHST[q.form](q.tests[id]), wo + ": Punktsumme weicht von der Probe ab");
      d.items.forEach((a, i) => {
        const hier = wo + " Aufgabe " + (i + 1) + " (" + a.type + ")";
        arten.add(a.type);
        assert.ok(PFLICHT[a.type], hier + ": unbekannte Aufgabenart");
        assert.ok(typeof a.prompt === "string" && a.prompt.trim().length > 3, hier + ": Aufgabentext fehlt");
        assert.ok(Number.isFinite(a.points) && a.points > 0, hier + ": Punkte fehlen");
        assert.ok(PFLICHT[a.type](a), hier + ": Angaben für Anzeige oder Lösung fehlen");
        if (a.textRef) assert.ok((d.texte || []).some((t) => t.id === a.textRef), hier + ": Lesetext " + a.textRef + " fehlt");
      });
      (d.texte || []).forEach((t) => assert.ok(t.id && t.titel && (liste(t.zeilen) || liste(t.werte) || liste(t.reihen)), wo + ": Lesetext " + t.id + " ist leer"));
      // Was nur dem Bewerten dient, gehört nicht in die Antwort
      assert.ok(!/"(keywords|keywordsVoll|wenn)":/.test(JSON.stringify(d)), wo + ": Bewertungs-Stichwörter in der Vorschau");
    });
  });
  assert.ok(anzahl >= 150, "erwartet werden alle Proben aller Fächer, gefunden: " + anzahl);
  Object.keys(PFLICHT).forEach((art) => assert.ok(arten.has(art), "Aufgabenart kommt in keiner Probe vor (Prüfung anpassen?): " + art));
});

test("Die Vorschau verändert die Proben nicht", () => {
  const quellen = QUELLEN();
  Object.entries(quellen).forEach(([modul, q]) => {
    const id = Object.keys(q.tests)[0], vorher = JSON.stringify(q.tests[id]);
    vorschau(q.form, q.tests[id]);
    assert.equal(JSON.stringify(q.tests[id]), vorher, modul + ": Probe wurde verändert");
  });
});

async function mitServer(lauf, passwort) {
  const app = express();
  app.use(express.json());
  const antwort = registerProbenVorschau(app, { teacherPassword: passwort === undefined ? PW : passwort, quellen: QUELLEN() });
  const server = await new Promise((resolve) => { const s = app.listen(0, () => resolve(s)); });
  const post = (body) => fetch(`http://127.0.0.1:${server.address().port}/api/proben/vorschau`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
    .then(async (r) => ({ status: r.status, data: await r.json().catch(() => null) }));
  try { await lauf(post, antwort); } finally { await new Promise((resolve) => server.close(resolve)); }
}

test("Route: nur mit Lehrerpasswort, unbekannte Probe 404, sonst die Probe mit Lösungen", async () => {
  await mitServer(async (post, antwort) => {
    assert.deepEqual(antwort.module.sort(), Object.keys(QUELLEN()).sort(), "meldet die Probenarten mit Vorschau");
    assert.equal((await post({ modul: "nt8", testId: "nt8-magnet-r-a" })).status, 401, "ohne Passwort");
    const falsch = await post({ password: "falsch", modul: "nt8", testId: "nt8-magnet-r-a" });
    assert.equal(falsch.status, 401);
    assert.ok(!JSON.stringify(falsch.data).includes("items"), "bei falschem Passwort keine Aufgaben");
    assert.equal((await post({ password: PW, modul: "gibt-es-nicht", testId: "x" })).status, 404);
    assert.equal((await post({ password: PW, modul: "nt8", testId: "gibt-es-nicht" })).status, 404);
    assert.equal((await post({ password: PW, modul: "__proto__", testId: "toString" })).status, 404, "keine geerbten Eigenschaften");
    assert.equal((await post({ password: PW, modul: "nt8", testId: "constructor" })).status, 404, "keine geerbten Eigenschaften");
    const nt8 = await post({ password: PW, modul: "nt8", testId: "nt8-magnet-r-a" });
    assert.equal(nt8.status, 200);
    assert.equal(nt8.data.items.length, 16); assert.equal(nt8.data.total, 37); assert.equal(nt8.data.minutes, 38);
    const vok = await post({ password: PW, modul: "vokabeltest", testId: Object.keys(require("./vokabeltest-daten").TESTS)[0] });
    assert.equal(vok.status, 200); assert.equal(vok.data.items[0].type, "vokabeln"); assert.equal(vok.data.total, vok.data.items[0].zeilen.length);
    const d8 = await post({ password: PW, modul: "d8proben", testId: "d8-p1-r-a" });
    assert.equal(d8.status, 200); assert.ok(d8.data.texte.length >= 1 && d8.data.texte[0].zeilen.length > 10, "Lesetext mit Zeilen");
  });
});

test("Route: ohne eingerichtetes Lehrerpasswort gibt es keine Vorschau", async () => {
  await mitServer(async (post) => {
    assert.equal((await post({ password: "", modul: "nt8", testId: "nt8-magnet-r-a" })).status, 503);
  }, "");
});
