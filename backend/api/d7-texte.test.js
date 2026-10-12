"use strict";

// Deutsch 7: Schreibtrainer und aufbewahrte Schülertexte (d7-texte.js)
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const { registerD7TexteRoutes, MAX_FASSUNGEN, vergleiche, ausTeilen, korrekturLesen } = require("./d7-texte");

const PW = "Nur-ein-Test-4711";
const kindZumCode = async (code) => ({ 101: { code: "101", klasse: "7aM", zug: "7M" }, 102: { code: "102", klasse: "7b", zug: "7R", lrs: true }, "000": { code: "000", klasse: "Lehrkraft", lehrer: true } })[code] || null;
const TEXT = "Am Morgen wachte ich auf und merkte sofort, dass etwas nicht stimmte. Im Haus war es ganz still.";
const auftrag = (extra) => ({ modul: "erz-06", aufgabe: "werkstatt", titel: "Meine Erzählung", auftrag: "Schreibe eine spannende Erzählung.", kriterien: ["Einleitung nennt Ort und Zeit", "Es gibt einen Höhepunkt"], text: TEXT, ...extra });

async function mitServer(askAnthropic, lauf, optionen = {}) {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "d7-texte-"));
  const app = express();
  app.use(express.json());
  registerD7TexteRoutes(app, { dataDir, teacherPassword: PW, kindZumCode, askAnthropic, ...optionen });
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

test("Modul neu begonnen: texte/meine nennt den Zeitpunkt, die Fassungen bleiben für die Lehrkraft", async () => {
  const gefragt = [];
  let reset = 0;
  await mitServer(ki(), async ({ post }) => {
    await post("schreiben/feedback", auftrag({ code: "101" }));
    let m = (await post("texte/meine", { code: "101", modul: "erz-06", aufgabe: "werkstatt" })).data;
    assert.equal(m.neuSeit, undefined, "nie zurückgesetzt: kein Feld");
    assert.deepEqual(gefragt[0], ["101", "d7-erz-06"], "gefragt wird mit der Kennung des Lernstands");
    reset = Date.now() + 60000;
    m = (await post("texte/meine", { code: "101", modul: "erz-06", aufgabe: "werkstatt" })).data;
    assert.equal(m.neuSeit, reset);
    assert.equal(m.fassungen.length, 1, "die Fassung von vorher ist noch da");
    assert.ok(Date.parse(m.fassungen[0].zeit) < m.neuSeit, "sie ist älter als der Neubeginn – die Seite holt sie nicht zurück");
    const l = (await post("lehrer/texte", { password: PW, klasse: "7aM" })).data;
    assert.equal(l.eintraege[0].fassungen.length, 1, "die Lehrkraft sieht sie weiter");
  }, { resetZeit: async (code, modul) => { gefragt.push([code, modul]); return reset; } });
});

/* ---------- KI-Korrektur (Baustein „korrigieren“) ---------- */
const KIND = "Hey Leute, ich find das voll blöd weil wir garnicht schlaffen können.";
const BESSER = "Sehr geehrte Redaktion, ich finde das nicht gut, weil wir gar nicht schlafen können.";
const kurz = (teile) => teile.map((x) => (x.t !== undefined ? x.t : x.art + ":" + x.alt + ">" + x.neu));

test("Vergleich: Rechtschreibung wird ausgebessert, Falsches steht alt und neu nebeneinander", () => {
  const teile = vergleiche(KIND, BESSER);
  assert.deepEqual(kurz(teile), ["falsch:Hey Leute,>Sehr geehrte Redaktion,", "ich", "rs:find>finde", "das", "falsch:voll blöd>nicht gut,", "weil wir", "rs:garnicht>gar nicht", "rs:schlaffen>schlafen", "können."]);
  assert.equal(ausTeilen(teile, true), BESSER, "alles ausgebessert = die Fassung der KI");
  assert.equal(ausTeilen(teile, false), "Hey Leute, ich finde das voll blöd weil wir gar nicht schlafen können.", "nur die Rechtschreibung: das Falsche steht noch wie beim Kind");
  // unverändert, nur Großschreibung und Satzzeichen, Zeilenwechsel bleiben
  assert.deepEqual(kurz(vergleiche("Ich bin dafür.", "Ich bin dafür.")), ["Ich bin dafür."]);
  const brief = vergleiche("liebe redaktion\n\nich bin dafür das der platz offen bleibt", "Liebe Redaktion,\n\nich bin dafür, dass der Platz offen bleibt.");
  assert.deepEqual(kurz(brief), ["rs:liebe>Liebe", "rs:redaktion>Redaktion,", "ich bin", "rs:dafür>dafür,", "rs:das>dass", "der", "rs:platz>Platz", "offen", "rs:bleibt>bleibt."]);
  assert.equal(ausTeilen(brief, true), "Liebe Redaktion,\n\nich bin dafür, dass der Platz offen bleibt.");
  // ein fehlendes Wort wird eingefügt, ein überflüssiges gestrichen
  assert.deepEqual(kurz(vergleiche("Ich hoffe Sie ändern das das.", "Ich hoffe, dass Sie das ändern.")).filter((x) => /falsch/.test(x)).length > 0, true);
});

test("Vergleich: Die KI schreibt nichts dazu – eine längere Ergänzung wird verworfen", () => {
  const alt = "Der Platz soll offen bleiben, weil wir dort spielen.";
  const teile = vergleiche(alt, alt + " Zum Beispiel haben wir letzte Woche dort ein Turnier gespielt.");
  assert.deepEqual(kurz(teile), [alt]);
  assert.equal(ausTeilen(teile, true), alt);
  // eine kurze Ersetzung mit mehr Wörtern bleibt (Anrede)
  assert.deepEqual(kurz(vergleiche("Hi, ich bin dafür.", "Sehr geehrte Redaktion, ich bin dafür.")), ["falsch:Hi,>Sehr geehrte Redaktion,", "ich bin dafür."]);
});

test("Antwort der KI lesen: Bausteine, Lob, Hinweis, Text", () => {
  const p = korrekturLesen("BAUSTEINE: ja, Ja, nein\nLOB: Deine Behauptung ist klar.\nHINWEIS: Dir fehlt noch ein Beispiel.\nTEXT:\nIch bin dafür.\n\nViele Grüße", 3);
  assert.deepEqual(p, { bausteine: [true, true, false], lob: "Deine Behauptung ist klar.", hinweis: "Dir fehlt noch ein Beispiel.", text: "Ich bin dafür.\n\nViele Grüße" });
  assert.deepEqual(korrekturLesen("BAUSTEINE: ja\nLOB: Gut.\nHINWEIS:\nTEXT: Ich bin dafür.", 2).bausteine, [true, false], "fehlt eine Angabe, gilt der Baustein nicht als da");
  assert.equal(korrekturLesen("BAUSTEINE: ja\nLOB: Gut.", 1), null, "ohne TEXT keine Korrektur");
  assert.equal(korrekturLesen("", 1), null);
});

const kor = (extra) => ({ modul: "arg-08", aufgabe: "arg1", titel: "Mein erstes Argument", auftrag: "Schreibe ein Argument mit Behauptung, Begründung und Beispiel.",
  bausteine: ["Behauptung: Was meinst du?", "Begründung: Warum?", "Beispiel: ein einzelner Fall"], text: KIND, ...extra });
const kiKor = (merke, antwort) => async (system, user, maxTokens, optionen) => {
  if (merke) merke.push({ system, user: JSON.parse(user), maxTokens, optionen });
  return antwort || "BAUSTEINE: ja, ja, nein\nLOB: Deine Meinung ist klar.\nHINWEIS: Ein Beispiel fehlt noch.\nTEXT:\n" + BESSER;
};

test("Korrektur: Teile, beide Fassungen, Bausteine; mit Code bleibt der Text des Kindes für die Lehrkraft", async () => {
  const gesehen = [];
  await mitServer(kiKor(gesehen), async ({ post }) => {
    const r = (await post("schreiben/korrektur", kor({ code: "101", zug: "M" }))).data;
    assert.equal(r.quelle, "ki"); assert.equal(r.rs, 3); assert.equal(r.falsch, 2);
    assert.equal(r.korrigiert, BESSER);
    assert.equal(r.bereinigt, "Hey Leute, ich finde das voll blöd weil wir gar nicht schlafen können.");
    assert.deepEqual(r.bausteine, [true, true, false]); assert.equal(r.vollstaendig, false);
    assert.equal(r.hinweis, "Ein Beispiel fehlt noch."); assert.equal(r.gespeichert, true); assert.equal(r.fassung, 1);
    // Auftrag an die KI: großzügig bei den Bausteinen, nichts dazuschreiben, ohne den allgemeinen Milde-Zusatz
    assert.equal(gesehen[0].user.text, KIND); assert.deepEqual(gesehen[0].user.bausteine.length, 3);
    assert.ok(/Im Zweifel „ja“/.test(gesehen[0].system) && /Du schreibst nichts dazu/.test(gesehen[0].system) && /7\. Klasse/.test(gesehen[0].system));
    assert.deepEqual(gesehen[0].optionen, { milde: false });
    // für die Lehrkraft: Fassung 1 ist der Text, wie das Kind ihn geschrieben hat
    const liste = (await post("lehrer/texte", { password: PW, klasse: "7aM" })).data.eintraege;
    assert.equal(liste[0].fassungen[0].text, KIND);
    assert.equal(liste[0].fassungen[0].feedback.naechstes, "Ein Beispiel fehlt noch.");
    assert.deepEqual(liste[0].fassungen[0].feedback.korrektur.bausteine, [{ text: "Behauptung", ok: true }, { text: "Begründung", ok: true }, { text: "Beispiel", ok: false }]);
    assert.equal(liste[0].fassungen[0].feedback.korrektur.korrigiert, BESSER);
    // zu wenig, unbekannter Auftrag, ohne Code
    assert.equal((await post("schreiben/korrektur", kor({ text: "Hallo" }))).status, 400);
    assert.equal((await post("schreiben/korrektur", kor({ modul: "x" }))).status, 400);
    assert.equal((await post("schreiben/korrektur", kor())).data.gespeichert, false);
  });
});

test("Korrektur: alle Bausteine da -> vollständig; ohne KI bleibt der Text, wie er ist", async () => {
  await mitServer(kiKor(null, "BAUSTEINE: ja, ja, ja\nLOB: Alles da.\nHINWEIS:\nTEXT:\n" + KIND), async ({ post }) => {
    const r = (await post("schreiben/korrektur", kor())).data;
    assert.equal(r.vollstaendig, true); assert.equal(r.rs + r.falsch, 0); assert.equal(r.hinweis, "");
    assert.deepEqual(r.teile, [{ t: KIND, ws: "" }]);
  });
  await mitServer(async () => { throw new Error("aus"); }, async ({ post }) => {
    const r = (await post("schreiben/korrektur", kor({ code: "101" }))).data;
    assert.equal(r.quelle, "lokal"); assert.deepEqual(r.bausteine, [null, null, null]); assert.equal(r.vollstaendig, false);
    assert.equal(r.korrigiert, KIND); assert.equal(r.gespeichert, true);
  });
  // unbrauchbare Antwort der KI (kein TEXT): wie ohne KI
  await mitServer(kiKor(null, "Das kann ich nicht."), async ({ post }) => {
    assert.equal((await post("schreiben/korrektur", kor())).data.quelle, "lokal");
  });
});
