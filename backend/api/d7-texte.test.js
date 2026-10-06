"use strict";

// Deutsch 7: Schreibtrainer und aufbewahrte Schülertexte (d7-texte.js)
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const { registerD7TexteRoutes, MAX_FASSUNGEN } = require("./d7-texte");

const PW = "Nur-ein-Test-4711";
const kindZumCode = async (code) => ({ 101: { code: "101", klasse: "7aM", zug: "7M" }, 102: { code: "102", klasse: "7b", zug: "7R", lrs: true }, "000": { code: "000", klasse: "Lehrkraft", lehrer: true } })[code] || null;
const TEXT = "Am Morgen wachte ich auf und merkte sofort, dass etwas nicht stimmte. Im Haus war es ganz still.";
const auftrag = (extra) => ({ modul: "erz-06", aufgabe: "werkstatt", titel: "Meine Erzählung", auftrag: "Schreibe eine spannende Erzählung.", kriterien: ["Einleitung nennt Ort und Zeit", "Es gibt einen Höhepunkt"], text: TEXT, ...extra });

async function mitServer(askAnthropic, lauf) {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "d7-texte-"));
  const app = express();
  app.use(express.json());
  registerD7TexteRoutes(app, { dataDir, teacherPassword: PW, kindZumCode, askAnthropic });
  const server = await new Promise((resolve) => { const s = app.listen(0, () => resolve(s)); });
  const post = (route, body) => fetch(`http://127.0.0.1:${server.address().port}/api/d7/` + route, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
    .then(async (r) => ({ status: r.status, data: await r.json().catch(() => null) }));
  try { await lauf({ post, datei: path.join(dataDir, "d7-texte.json") }); }
  finally { await new Promise((resolve) => server.close(resolve)); fs.rmSync(dataDir, { recursive: true, force: true }); }
}
const ki = (merke) => async (system, user) => {
  if (merke) merke.push({ system, user: JSON.parse(user) });
  return JSON.stringify({ gelungen: "Dein Anfang macht neugierig.", naechstes: "Der Höhepunkt fehlt noch.", stelle: "Im Haus war es ganz still.", tipp: "Erzähle, was du dann entdeckst.", checkliste: [true, false] });
};

test("Rückmeldung in fünf Teilen; mit Code wird jede Fassung aufbewahrt, das Original bleibt", async () => {
  const gesehen = [];
  await mitServer(ki(gesehen), async ({ post }) => {
    const r = (await post("schreiben/feedback", auftrag({ code: "101", zug: "M" }))).data;
    assert.equal(r.quelle, "ki"); assert.equal(r.gespeichert, true); assert.equal(r.fassung, 1);
    assert.deepEqual(r.checkliste, [{ text: "Einleitung nennt Ort und Zeit", ok: true }, { text: "Es gibt einen Höhepunkt", ok: false }]);
    assert.equal(r.stelle, "Im Haus war es ganz still.");
    assert.equal(gesehen[0].user.text, TEXT);
    assert.ok(!/Notenschutz/.test(gesehen[0].system));
    // derselbe Text noch einmal: keine neue Fassung
    assert.equal((await post("schreiben/feedback", auftrag({ code: "101" }))).data.fassung, 1);
    // überarbeitet: neue Fassungen, das Original bleibt die erste
    for (let i = 2; i <= MAX_FASSUNGEN + 3; i++) assert.equal((await post("schreiben/feedback", auftrag({ code: "101", text: TEXT + " Fassung " + i + " mit mehr Text." }))).data.fassung, i);
    const m = (await post("texte/meine", { code: "101", modul: "erz-06", aufgabe: "werkstatt" })).data;
    assert.equal(m.fassungen.length, MAX_FASSUNGEN);
    assert.equal(m.fassungen[0].text, TEXT, "der Originaltext wird nie verdrängt");
    assert.equal(m.fassungen[0].nr, 1);
    assert.equal(m.fassungen[MAX_FASSUNGEN - 1].nr, MAX_FASSUNGEN + 3);
    assert.equal(m.fassungen[0].feedback.naechstes, "Der Höhepunkt fehlt noch.");
  });
});

test("Ohne Code und mit dem Lehrercode wird nichts gespeichert; LRS-Regel nur beim Kind mit Notenschutz", async () => {
  const gesehen = [];
  await mitServer(ki(gesehen), async ({ post, datei }) => {
    assert.equal((await post("schreiben/feedback", auftrag())).data.gespeichert, false);
    assert.equal((await post("schreiben/feedback", auftrag({ code: "000" }))).data.gespeichert, false);
    assert.equal(fs.existsSync(datei), false);
    assert.equal((await post("schreiben/feedback", auftrag({ code: "102" }))).data.gespeichert, true);
    assert.ok(/Notenschutz wegen LRS/.test(gesehen[2].system));
    assert.equal((await post("texte/meine", { modul: "erz-06", aufgabe: "werkstatt" })).status, 401);
    assert.equal((await post("schreiben/feedback", { modul: "x", aufgabe: "y", text: TEXT })).status, 400);
    assert.equal((await post("schreiben/feedback", auftrag({ text: "Zu kurz." }))).data.quelle, "leer");
  });
});

test("Ohne KI: Text wird trotzdem aufbewahrt, die Checkliste bleibt offen", async () => {
  await mitServer(async () => { throw new Error("aus"); }, async ({ post }) => {
    const r = (await post("schreiben/feedback", auftrag({ code: "101" }))).data;
    assert.equal(r.quelle, "lokal"); assert.equal(r.gespeichert, true);
    assert.deepEqual(r.checkliste.map((c) => c.ok), [null, null]);
  });
});

test("Lehrkraft: Texte der Klasse ansehen, kommentieren, löschen", async () => {
  await mitServer(ki(), async ({ post }) => {
    await post("schreiben/feedback", auftrag({ code: "101" }));
    await post("schreiben/feedback", auftrag({ code: "102" }));
    assert.equal((await post("lehrer/texte", { password: "falsch", klasse: "7aM" })).status, 401);
    const liste = (await post("lehrer/texte", { password: PW, klasse: "7aM" })).data.eintraege;
    assert.deepEqual(liste.map((e) => e.code), ["101"]);
    assert.equal((await post("lehrer/texte/kommentar", { password: PW, id: liste[0].id, kommentar: "Schöner Anfang – schreib weiter!" })).status, 200);
    assert.equal((await post("texte/meine", { code: "101", modul: "erz-06", aufgabe: "werkstatt" })).data.lehrerKommentar, "Schöner Anfang – schreib weiter!");
    assert.equal((await post("lehrer/texte/loeschen", { password: PW, id: liste[0].id })).status, 200);
    assert.equal((await post("lehrer/texte", { password: PW, klasse: "7aM" })).data.eintraege.length, 0);
  });
});
