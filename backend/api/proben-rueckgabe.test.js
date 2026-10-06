"use strict";

// Korrigierte Proben zurückgeben (proben-rueckgabe.js) und die Angaben dazu in der Notenübersicht (proben-noten.js)
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const { registerProbenRueckgabeRoutes } = require("./proben-rueckgabe");
const { registerProbenNotenRoutes } = require("./proben-noten");

const PW = "Nur-ein-Test-4711";
const KINDER = { 101: "7aM", 102: "7aM", 201: "8b" };
const kindZumCode = async (code) => (KINDER[Number(code)] ? { code: String(code), klasse: KINDER[Number(code)], zug: "7M", lrs: false } : null);
const abgabe = (id, code, extra) => Object.assign({ id, testId: "nt7-p1-m", testTitle: "NT 7 – Probe 1: Luft", code: String(code), className: KINDER[code], grade: 3, score: 6, total: 10, percent: 60,
  submittedAt: "2026-10-05T08:30:00.000Z", details: [
    { nr: 1, type: "choice", prompt: "Welches Gas brauchen wir zum Atmen?", given: "Stickstoff", expected: "Sauerstoff", points: 0, maxPoints: 1 },
    { nr: 2, type: "text", prompt: "Erkläre, warum warme Luft aufsteigt.", given: "Weil sie leichter ist.", expected: "Warme Luft dehnt sich aus und hat eine geringere Dichte.", points: 2, maxPoints: 3, comment: "Der Grund stimmt, die Dichte fehlt." },
    { nr: 3, type: "choice", prompt: "Luft ist ein …", given: "Gemisch", expected: "Gemisch", correct: true }
  ] }, extra || {});

async function mitServer(lauf) {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "rueckgabe-"));
  const nt = [abgabe("a1", 101), abgabe("a2", 102), abgabe("a3", 201)];
  const deutsch = [{ id: "d1", testId: "d7-p2-m-a", testTitle: "Probe 2 (M7): Sachtext I", code: "101", className: "7aM", grade: 2, score: 28, total: 34, percent: 82, submittedAt: "2026-10-06T08:00:00.000Z", status: "freigegeben", freigegebenAm: "2026-10-06T12:00:00.000Z" },
    { id: "d2", testId: "d7-p2-m-a", testTitle: "Probe 2 (M7): Sachtext I", code: "102", className: "7aM", grade: 4, score: 17, total: 34, percent: 50, submittedAt: "2026-10-06T08:00:00.000Z", status: "zu-pruefen" }];
  const quellen = [{ modul: "nt7", fach: "NT", abgaben: () => nt }, { modul: "d7proben", fach: "Deutsch", abgaben: () => deutsch }];
  const app = express(); app.use(express.json());
  const r = registerProbenRueckgabeRoutes(app, { dataDir, teacherPassword: PW, kindZumCode, quellen });
  registerProbenNotenRoutes(app, { teacherPassword: PW, kindZumCode, quellen, rueckgabe: (modul, a) => r.stand(modul, a) });
  const server = await new Promise((ok) => { const s = app.listen(0, () => ok(s)); });
  const post = (route, body) => fetch(`http://127.0.0.1:${server.address().port}/api/proben/${route}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
    .then(async (x) => ({ status: x.status, data: await x.json().catch(() => null) }));
  try { await lauf({ post, nt, dataDir }); }
  finally { await new Promise((ok) => server.close(ok)); fs.rmSync(dataDir, { recursive: true, force: true }); }
}

test("Zurückgeben: erst nach der Freigabe sieht das Kind seine Probe – nur die eigene", async () => {
  await mitServer(async ({ post }) => {
    // vorher: nichts zurückbekommen außer der freigegebenen Deutsch-Probe (eigener Ablauf)
    let meine = await post("rueckgabe/meine", { code: "101" });
    assert.equal(meine.status, 200);
    assert.deepEqual(meine.data.rueckgaben.map((x) => x.modul + ":" + x.id), ["d7proben:d1"]);
    assert.equal(meine.data.rueckgaben[0].neu, true);
    assert.deepEqual((await post("rueckgabe/meine", { code: "102" })).data.rueckgaben, [], "die noch nicht freigegebene Deutsch-Probe steht nicht da");
    assert.equal((await post("rueckgabe/ansehen", { code: "101", modul: "nt7", id: "a1" })).status, 403, "noch nicht zurückgegeben");

    // nur die Lehrkraft gibt zurück
    assert.equal((await post("rueckgabe/freigeben", { password: "falsch", eintraege: [{ modul: "nt7", id: "a1" }] })).status, 401);
    assert.equal((await post("rueckgabe/freigeben", { code: "101", eintraege: [{ modul: "nt7", id: "a1" }] })).status, 401);
    const frei = await post("rueckgabe/freigeben", { password: PW, eintraege: [{ modul: "nt7", id: "a1" }, { modul: "nt7", id: "gibt-es-nicht" }, { modul: "d7proben", id: "d2" }], kommentar: "Schau dir Aufgabe 2 noch einmal an." });
    assert.equal(frei.data.anzahl, 1, "unbekannte Abgaben und Deutsch (eigener Ablauf) werden übersprungen");

    meine = await post("rueckgabe/meine", { code: "101" });
    assert.deepEqual(meine.data.rueckgaben.map((x) => x.modul + ":" + x.id).sort(), ["d7proben:d1", "nt7:a1"]);
    const k = await post("rueckgabe/ansehen", { code: "101", modul: "nt7", id: "a1" });
    assert.equal(k.status, 200);
    const kor = k.data.korrektur;
    assert.equal(kor.titel, "NT 7 – Probe 1: Luft"); assert.equal(kor.fach, "NT"); assert.equal(kor.grade, 3); assert.equal(kor.kommentar, "Schau dir Aufgabe 2 noch einmal an.");
    assert.deepEqual(kor.aufgaben.map((a) => [a.points, a.max]), [[0, 1], [2, 3], [1, 1]]);
    assert.equal(kor.aufgaben[0].loesung, "Sauerstoff", "falsch gelöst: richtige Lösung steht dabei");
    assert.equal(kor.aufgaben[1].beispiel, true, "freie Antwort: Lösung gilt als Beispiel");
    assert.equal(kor.aufgaben[2].loesung, undefined, "richtig gelöst: keine Lösung nötig");
    assert.equal(kor.aufgaben[1].comment, "Der Grund stimmt, die Dichte fehlt.");
    assert.ok(!JSON.stringify(k.data).includes("\"lrs\""), "kein Etikett zum Notenschutz");

    // ein anderes Kind kommt nicht an diese Abgabe – auch nicht mit der richtigen Kennung
    assert.equal((await post("rueckgabe/ansehen", { code: "102", modul: "nt7", id: "a1" })).status, 404);
    assert.equal((await post("rueckgabe/ansehen", { code: "102", modul: "nt7", id: "a2" })).status, 403, "eigene Abgabe, aber nicht zurückgegeben");
    assert.equal((await post("rueckgabe/ansehen", { code: "999", modul: "nt7", id: "a1" })).status, 404, "unbekannter Code");
    assert.equal((await post("rueckgabe/ansehen", { modul: "nt7", id: "a1" })).status, 400, "ohne Code");
    assert.equal((await post("rueckgabe/ansehen", { code: "101", modul: "d7proben", id: "d1" })).status, 404, "Deutsch hat seine eigene Korrekturseite");
  });
});

test("Zurückgeben: geöffnet-Vermerk, ohne Lösungen, ganze Klasse, zurücknehmen; Notenübersicht zeigt den Stand", async () => {
  await mitServer(async ({ post, nt }) => {
    await post("rueckgabe/freigeben", { password: PW, eintraege: [{ modul: "nt7", id: "a1" }, { modul: "nt7", id: "a2" }], mitLoesung: false });
    let noten = (await post("noten", { password: PW, klasse: "7aM" })).data.noten;
    const zeile = (id) => noten.find((n) => n.id === id);
    assert.ok(zeile("a1").zurueck && zeile("a2").zurueck && !zeile("a1").geoeffnet, "zurückgegeben, noch nicht geöffnet");
    assert.ok(zeile("d1").zurueck, "freigegebene Deutsch-Probe zählt als zurückgegeben");
    assert.equal(zeile("d2").zurueck, "");

    const k = (await post("rueckgabe/ansehen", { code: "101", modul: "nt7", id: "a1" })).data.korrektur;
    assert.ok(k.aufgaben.every((a) => a.loesung === undefined), "ohne Lösungen zurückgegeben");
    assert.equal((await post("rueckgabe/meine", { code: "101" })).data.rueckgaben.find((x) => x.id === "a1").neu, false, "nach dem Öffnen nicht mehr neu");
    noten = (await post("noten", { password: PW, klasse: "7aM" })).data.noten;
    assert.ok(noten.find((n) => n.id === "a1").geoeffnet, "Lehrkraft sieht: geöffnet");
    assert.equal(noten.find((n) => n.id === "a2").geoeffnet, "");

    // noch einmal zurückgeben (jetzt mit Lösungen): der Geöffnet-Vermerk und das erste Datum bleiben
    const erst = (await post("rueckgabe/stand", { password: PW })).data.stand["nt7|a1"];
    await post("rueckgabe/freigeben", { password: PW, eintraege: [{ modul: "nt7", id: "a1" }], mitLoesung: true });
    const dann = (await post("rueckgabe/stand", { password: PW })).data.stand["nt7|a1"];
    assert.equal(dann.freigegebenAm, erst.freigegebenAm); assert.equal(dann.geoeffnetAm, erst.geoeffnetAm); assert.equal(dann.mitLoesung, true);

    // zurücknehmen
    assert.equal((await post("rueckgabe/freigeben", { password: PW, eintraege: [{ modul: "nt7", id: "a1" }], offen: false })).data.anzahl, 1);
    assert.equal((await post("rueckgabe/ansehen", { code: "101", modul: "nt7", id: "a1" })).status, 403);
    assert.ok(!(await post("rueckgabe/meine", { code: "101" })).data.rueckgaben.some((x) => x.id === "a1"));

    // wird eine Abgabe gelöscht, verschwindet auch ihr Eintrag
    nt.splice(nt.findIndex((x) => x.id === "a2"), 1);
    await post("rueckgabe/freigeben", { password: PW, eintraege: [{ modul: "nt7", id: "a3" }] });
    assert.deepEqual(Object.keys((await post("rueckgabe/stand", { password: PW })).data.stand), ["nt7|a3"]);
    assert.equal((await post("rueckgabe/stand", { password: "x" })).status, 401);
  });
});

test("Zurückgeben: eine Rückgabe bleibt mindestens 3 Tage als Kachel auf der Startseite (aktuell)", async () => {
  await mitServer(async ({ post, dataDir }) => {
    await post("rueckgabe/freigeben", { password: PW, eintraege: [{ modul: "nt7", id: "a1" }] });
    const eintrag = async () => { const e = (await post("rueckgabe/meine", { code: "101" })).data.rueckgaben.find((x) => x.id === "a1"); return [e.neu, e.aktuell]; };
    assert.deepEqual(await eintrag(), [true, true], "frisch zurückgegeben");
    await post("rueckgabe/ansehen", { code: "101", modul: "nt7", id: "a1" });
    assert.deepEqual(await eintrag(), [false, true], "geöffnet – bleibt trotzdem stehen");

    const datei = path.join(dataDir, "proben-rueckgabe.json");
    const vor = (tage) => new Date(Date.now() - tage * 86400000).toISOString();
    const setze = (freigegeben, geoeffnet) => {
      const d = JSON.parse(fs.readFileSync(datei, "utf8")), e = d.rueckgaben["nt7|a1"];
      e.freigegebenAm = freigegeben;
      if (geoeffnet) e.geoeffnetAm = geoeffnet; else delete e.geoeffnetAm;
      fs.writeFileSync(datei, JSON.stringify(d), "utf8");
    };
    setze(vor(2.9), vor(2.9)); assert.deepEqual(await eintrag(), [false, true], "knapp 3 Tage: noch da");
    setze(vor(3.1), vor(3.1)); assert.deepEqual(await eintrag(), [false, false], "nach 3 Tagen: nur noch in der Liste");
    setze(vor(10), vor(2)); assert.deepEqual(await eintrag(), [false, true], "spät geöffnet: ab dem Öffnen noch 3 Tage");
    setze(vor(10), ""); assert.deepEqual(await eintrag(), [true, true], "ungeöffnet bleibt stehen, egal wie lange");
    // in der Liste steht sie in jedem Fall weiter
    setze(vor(30), vor(20));
    assert.ok((await post("rueckgabe/meine", { code: "101" })).data.rueckgaben.some((x) => x.id === "a1"));
    assert.equal((await post("rueckgabe/ansehen", { code: "101", modul: "nt7", id: "a1" })).status, 200);
  });
});
