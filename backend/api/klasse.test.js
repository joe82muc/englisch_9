"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const { registerKlasseRoutes, regelPruefung, tagBerlin, schuljahrGrenze } = require("./klasse");

const PW = "lehrer-geheim";
let server, baseUrl, dataDir, modul;
let kiModus = "ok", letzteFrage = "";
let zeit = new Date("2026-10-05T08:00:00Z"); // Montag, 10 Uhr in Deutschland

test.before(async () => {
  dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "klasse-test-"));
  const app = express();
  app.use(express.json());
  modul = registerKlasseRoutes(app, {
    dataDir, teacherPassword: PW, proZehnMinuten: 4, kiZeitMs: 150, jetzt: () => zeit,
    kindZumCode: async (code) => (code === "123" ? { code: "123", klasse: "7aM", zug: "7M" }
      : code === "456" ? { code: "456", klasse: "9d", zug: "9R" } : code === "999" ? { gesperrt: true } : null),
    askKi: async (_system, user) => {
      letzteFrage = user;
      if (kiModus === "weg") throw new Error("offline");
      if (kiModus === "haengt") return new Promise(() => {});
      if (kiModus === "murks") return "keine Ahnung";
      if (kiModus === "nein") return JSON.stringify({ annehmen: false, hinweis: "Bitte ohne Namen schreiben.", vorschlag: "In der Klasse wird oft gestört.", wichtig: false });
      if (kiModus === "ernst") return "Antwort: " + JSON.stringify({ annehmen: true, hinweis: "", vorschlag: "", wichtig: true });
      if (kiModus === "ernstName") return JSON.stringify({ annehmen: false, hinweis: "Du nennst einen Namen.", vorschlag: "Ein Mitschüler schlägt mich in der Pause.", wichtig: true });
      return JSON.stringify({ annehmen: true, hinweis: "", vorschlag: "", wichtig: false });
    }
  });
  await new Promise((resolve) => { server = app.listen(0, resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
  fs.rmSync(dataDir, { recursive: true, force: true });
});

const post = (route, body) => fetch(baseUrl + route, {
  method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body)
}).then(async (r) => ({ status: r.status, data: await r.json() }));

test("Datum in Deutschland: kurz nach Mitternacht zählt schon der neue Tag", () => {
  assert.equal(tagBerlin(new Date("2026-10-04T22:30:00Z")), "2026-10-05");
  assert.equal(tagBerlin(new Date("2026-01-10T22:30:00Z")), "2026-01-10");
});

test("Hausaufgaben: nur mit Lehrkraft-Passwort eintragen", async () => {
  const falsch = await post("/api/klasse/lehrer/heft/speichern", { password: "x", klasse: "7aM", fach: "Mathematik", text: "Aufgaben üben", faellig: "2026-10-06" });
  assert.equal(falsch.status, 401);
  const ohne = await post("/api/klasse/lehrer/heft/liste", { klasse: "7aM" });
  assert.equal(ohne.status, 401);
});

test("Hausaufgaben: eintragen, prüfen, ändern", async () => {
  const a = await post("/api/klasse/lehrer/heft/speichern", { password: PW, klasse: "7 a m", fach: "Mathematik", text: "  Übungsblatt fertig rechnen  ", faellig: "2026-10-05", typ: "aufgabe" });
  assert.equal(a.status, 200);
  assert.equal(a.data.eintrag.klasse, "7aM");
  assert.equal(a.data.eintrag.text, "Übungsblatt fertig rechnen");
  const b = await post("/api/klasse/lehrer/heft/speichern", { password: PW, klasse: "7aM", fach: "Deutsch", text: "Probe: Argumentieren", faellig: "2026-10-08", typ: "probe", link: "https://joe82muc.github.io/grumi/" });
  assert.equal(b.data.eintrag.typ, "probe");
  await post("/api/klasse/lehrer/heft/speichern", { password: PW, klasse: "9d", fach: "Englisch", text: "Vokabeln wiederholen", faellig: "2026-10-06" });

  for (const [feld, wert] of [["klasse", "Zebra"], ["fach", ""], ["text", "x"], ["faellig", "06.10.2026"], ["faellig", "2026-02-30"], ["faellig", "2031-01-01"], ["link", "javascript:alert(1)"]]) {
    const r = await post("/api/klasse/lehrer/heft/speichern", { password: PW, klasse: "7aM", fach: "Mathematik", text: "Aufgaben üben", faellig: "2026-10-06", [feld]: wert });
    assert.equal(r.status, 400, feld + "=" + wert);
  }

  const geaendert = await post("/api/klasse/lehrer/heft/speichern", { password: PW, id: a.data.eintrag.id, klasse: "7aM", fach: "Mathematik", text: "Übungsblatt Seite 2", faellig: "2026-10-05" });
  assert.equal(geaendert.data.eintrag.id, a.data.eintrag.id);
  assert.equal(modul.heft().length, 3);
  const weg = await post("/api/klasse/lehrer/heft/speichern", { password: PW, id: "gibt-es-nicht", klasse: "7aM", fach: "Mathematik", text: "Aufgaben", faellig: "2026-10-05" });
  assert.equal(weg.status, 404);
});

test("Hausaufgaben: das Kind sieht nur die Einträge seiner Klasse, ohne Verwaltungsfelder", async () => {
  const r = await post("/api/klasse/heft", { code: "123" });
  assert.equal(r.status, 200);
  assert.equal(r.data.klasse, "7aM");
  assert.equal(r.data.heute, "2026-10-05");
  assert.deepEqual(r.data.eintraege.map((e) => e.fach), ["Mathematik", "Deutsch"]);
  assert.deepEqual(Object.keys(r.data.eintraege[0]).sort(), ["fach", "faellig", "id", "link", "text", "typ"]);
  assert.equal((await post("/api/klasse/heft", { code: "456" })).data.eintraege.length, 1);
  assert.equal((await post("/api/klasse/heft", { code: "000" })).status, 401);
  assert.equal((await post("/api/klasse/heft", { code: "999" })).status, 429);
});

test("Hausaufgaben: Vergangenes verschwindet beim Kind, die Lehrkraft sieht es noch 30 Tage", async () => {
  const vorher = zeit;
  zeit = new Date("2026-10-07T08:00:00Z");
  assert.deepEqual((await post("/api/klasse/heft", { code: "123" })).data.eintraege.map((e) => e.fach), ["Deutsch"]);
  assert.equal((await post("/api/klasse/lehrer/heft/liste", { password: PW, klasse: "7aM" })).data.eintraege.length, 2);
  zeit = vorher;
});

test("Hausaufgaben: löschen", async () => {
  const liste = (await post("/api/klasse/lehrer/heft/liste", { password: PW, klasse: "9d" })).data.eintraege;
  assert.equal(liste.length, 1);
  assert.equal((await post("/api/klasse/lehrer/heft/loeschen", { password: PW, id: liste[0].id })).status, 200);
  assert.equal((await post("/api/klasse/heft", { code: "456" })).data.eintraege.length, 0);
});

test("Klassenrat: angenommene Nachricht landet anonym im Briefkasten der Klasse", async () => {
  kiModus = "ok";
  const r = await post("/api/klasse/rat/senden", { code: "123", kategorie: "Pause", text: "In der Pause ist es im Gang oft sehr laut." });
  assert.equal(r.status, 200);
  assert.deepEqual(r.data, { ok: true, angenommen: true });
  assert.match(letzteFrage, /<<<In der Pause ist es im Gang oft sehr laut\.>>>/);
  assert.match(letzteFrage, /^Jahrgangsstufe: 7\nThema: Pause\n/);
  assert.doesNotMatch(letzteFrage, /7aM|123/, "weder Klasse noch Code gehen an die KI");
  const liste = (await post("/api/klasse/lehrer/rat/liste", { password: PW, klasse: "7aM" })).data.eintraege;
  assert.equal(liste.length, 1);
  assert.equal(liste[0].kategorie, "Pause");
  assert.equal(liste[0].status, "neu");
  assert.equal(liste[0].pruefung, "ki");
  assert.equal("code" in liste[0], false, "ohne Freigabe steht kein Code dabei");
  assert.equal(liste[0].am, "2026-10-05", "anonym: nur das Tagesdatum, keine Uhrzeit");
  assert.match(liste[0].id, /^r[0-9a-f]{18}$/, "die Kennung des Eintrags verrät keine Uhrzeit");
  assert.equal((await post("/api/klasse/lehrer/rat/liste", { password: PW, klasse: "9d" })).data.eintraege.length, 0);
});

test("Klassenrat: Code steht nur dabei, wenn das Kind es ankreuzt", async () => {
  kiModus = "ernst";
  const r = await post("/api/klasse/rat/senden", { code: "123", kategorie: "Klassenklima", text: "Ich werde in der Pause oft ausgelacht.", zeigen: true });
  assert.equal(r.data.angenommen, true);
  assert.match(r.data.hilfe, /116 111/);
  const eintrag = (await post("/api/klasse/lehrer/rat/liste", { password: PW, klasse: "7aM" })).data.eintraege.find((e) => e.wichtig);
  assert.equal(eintrag.code, "123");
  assert.equal(eintrag.wichtig, true);
  assert.equal(eintrag.am, zeit.toISOString(), "mit Freigabe steht die Uhrzeit dabei");
  const liste = (await post("/api/klasse/lehrer/rat/liste", { password: PW, klasse: "7aM" })).data.eintraege;
  assert.equal(liste[0].id, eintrag.id, "die neueste Nachricht steht oben");
});

test("Klassenrat: abgelehnte Nachricht wird nicht gespeichert, das Kind bekommt Hinweis und Vorschlag", async () => {
  kiModus = "nein";
  const vorher = modul.rat().length;
  const r = await post("/api/klasse/rat/senden", { code: "123", kategorie: "Unterricht", text: "Max stört immer und nervt alle." });
  assert.equal(r.status, 200);
  assert.equal(r.data.angenommen, false);
  assert.equal(r.data.hinweis, "Bitte ohne Namen schreiben.");
  assert.equal(r.data.vorschlag, "In der Klasse wird oft gestört.");
  assert.equal(modul.rat().length, vorher);
});

test("Klassenrat: zu kurze Nachricht, falscher Code, zu viele Nachrichten", async () => {
  kiModus = "ok";
  assert.equal((await post("/api/klasse/rat/senden", { code: "456", text: "Hallo" })).status, 400);
  assert.equal((await post("/api/klasse/rat/senden", { code: "000", text: "Wir wünschen uns einen Ausflug." })).status, 401);
  let letzte;
  for (let i = 0; i < 5; i++) letzte = await post("/api/klasse/rat/senden", { code: "456", kategorie: "Wunsch / Idee", text: "Wir wünschen uns einen Ausflug in den Zoo." });
  assert.equal(letzte.status, 429);
  assert.equal(modul.rat().filter((e) => e.klasse === "9d").length, 4);
});

test("Klassenrat: ohne KI prüft die Wortliste, die Lehrkraft sieht das", async () => {
  zeit = new Date("2026-10-05T09:00:00Z"); // neue 10 Minuten
  kiModus = "weg";
  const gut = await post("/api/klasse/rat/senden", { code: "123", text: "Der Marsch zur Turnhalle dauert zu lange." });
  assert.equal(gut.data.angenommen, true);
  assert.equal(modul.rat().at(-1).pruefung, "regeln");
  kiModus = "murks";
  const schlecht = await post("/api/klasse/rat/senden", { code: "123", text: "Die anderen sind alle dumm und blöd." });
  assert.equal(schlecht.data.angenommen, false);
  assert.match(schlecht.data.hinweis, /sachlich/);
  assert.equal(regelPruefung("Das ist ein Idiot").annehmen, false);
  assert.equal(regelPruefung("Wir möchten mehr Gruppenarbeit.").annehmen, true);
});

test("Klassenrat: antwortet die KI nicht rechtzeitig, wartet das Kind nicht ewig", async () => {
  kiModus = "haengt";
  const start = Date.now();
  const r = await post("/api/klasse/rat/senden", { code: "123", text: "Wir wünschen uns mehr Zeit für die Freiarbeit." });
  assert.equal(r.data.angenommen, true);
  assert.ok(Date.now() - start < 3000, "die Antwort kommt nach dem Zeitlimit, nicht erst nach Minuten");
  assert.equal(modul.rat().at(-1).pruefung, "regeln");
});

test("Klassenrat: Lehrkraft setzt Status, ergänzt eigenes Thema und löscht", async () => {
  const liste = (await post("/api/klasse/lehrer/rat/liste", { password: PW, klasse: "7aM" })).data.eintraege;
  const id = liste[0].id;
  assert.equal((await post("/api/klasse/lehrer/rat/status", { password: PW, id, status: "agenda" })).status, 200);
  assert.equal((await post("/api/klasse/lehrer/rat/status", { password: PW, id, status: "quatsch" })).status, 400);
  assert.equal((await post("/api/klasse/lehrer/rat/status", { password: "x", id, status: "done" })).status, 401);
  const thema = await post("/api/klasse/lehrer/rat/thema", { password: PW, klasse: "7aM", kategorie: "Organisation", text: "Regeln für Gruppenarbeiten besprechen" });
  assert.equal(thema.data.eintrag.quelle, "lehrkraft");
  assert.equal(thema.data.eintrag.status, "agenda");
  const neu = (await post("/api/klasse/lehrer/rat/liste", { password: PW, klasse: "7aM" })).data.eintraege;
  assert.equal(neu.find((e) => e.id === id).status, "agenda");
  assert.equal((await post("/api/klasse/lehrer/rat/loeschen", { password: PW, id })).status, 200);
  assert.equal((await post("/api/klasse/lehrer/rat/liste", { password: PW, klasse: "7aM" })).data.eintraege.some((e) => e.id === id), false);
});

test("Klassenrat: ernstes Anliegen mit Namen kommt trotzdem an – nur für die Lehrkraft, nie auf die Tagesordnung", async () => {
  kiModus = "ernstName";
  const r = await post("/api/klasse/rat/senden", { code: "123", kategorie: "Pause", text: "Tim schlägt mich jeden Tag in der Pause und ich habe Angst." });
  assert.equal(r.status, 200);
  assert.equal(r.data.angenommen, true);
  assert.equal(r.data.privat, true);
  assert.match(r.data.hilfe, /116 111/);
  assert.equal("vorschlag" in r.data, false);
  const liste = (await post("/api/klasse/lehrer/rat/liste", { password: PW, klasse: "7aM" })).data.eintraege;
  const eintrag = liste[0];
  assert.match(eintrag.text, /Tim schlägt mich/);
  assert.equal(eintrag.privat, true);
  assert.equal(eintrag.wichtig, true);
  assert.equal("code" in eintrag, false, "ohne Freigabe bleibt auch diese Nachricht ohne Code");
  const agenda = await post("/api/klasse/lehrer/rat/status", { password: PW, id: eintrag.id, status: "agenda" });
  assert.equal(agenda.status, 400);
  assert.match(agenda.data.error, /nicht auf die Tagesordnung/);
  assert.equal((await post("/api/klasse/lehrer/rat/status", { password: PW, id: eintrag.id, status: "done" })).status, 200);
  // Nicht ernst und mit Namen: weiter abgelehnt und nicht gespeichert
  kiModus = "nein";
  const vorher = modul.rat().length;
  const laestern = await post("/api/klasse/rat/senden", { code: "456", text: "Max nervt einfach nur, das ist alles." });
  assert.equal(laestern.data.angenommen, false);
  assert.equal("hilfe" in laestern.data, false);
  assert.equal(modul.rat().length, vorher);
});

test("Löschfristen: Heft 60 Tage nach dem Termin, Klassenrat mit dem neuen Schuljahr", async () => {
  assert.equal(schuljahrGrenze("2026-10-04"), "2026-08-01");
  assert.equal(schuljahrGrenze("2027-08-31"), "2026-08-01");
  assert.equal(schuljahrGrenze("2027-09-01"), "2027-08-01");
  await post("/api/klasse/lehrer/heft/speichern", { password: PW, klasse: "7aM", fach: "Englisch", text: "Vokabeln lernen", faellig: "2026-10-06", typ: "aufgabe" });
  assert.ok(modul.heft().length > 0 && modul.rat().length > 0);

  zeit = new Date("2026-12-04T08:00:00Z"); // 59 Tage nach dem Termin: noch gespeichert, für das Kind längst nicht mehr sichtbar
  assert.equal((await post("/api/klasse/heft", { code: "123" })).data.eintraege.length, 0);
  assert.ok(modul.heft().some((e) => e.faellig === "2026-10-06"));
  zeit = new Date("2026-12-06T08:00:00Z"); // 61 Tage: gelöscht
  await post("/api/klasse/heft", { code: "123" });
  assert.equal(modul.heft().some((e) => e.faellig === "2026-10-06"), false);

  zeit = new Date("2027-08-20T08:00:00Z"); // Sommerferien: die Themen des Schuljahres sind noch da
  assert.ok((await post("/api/klasse/lehrer/rat/liste", { password: PW, klasse: "7aM" })).data.eintraege.length > 0);
  zeit = new Date("2027-09-14T08:00:00Z"); // neues Schuljahr: alles vom alten ist gelöscht, auch für andere Klassen
  assert.equal((await post("/api/klasse/lehrer/rat/liste", { password: PW, klasse: "7aM" })).data.eintraege.length, 0);
  assert.equal(modul.rat().length, 0);
});
