"use strict";

// Papierproben als PDF je Kind zurückgeben (papierproben.js) und in der Liste „Zurückbekommen“ (proben-rueckgabe.js)
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const { registerPapierprobenRoutes, MAX_PDF } = require("./papierproben");
const { registerProbenRueckgabeRoutes } = require("./proben-rueckgabe");

const PW = "Nur-ein-Test-4711";
const KINDER = { 101: "7aM", 102: "7aM", 201: "8b" };
const kindZumCode = async (code) => (String(code) === "000" ? { code: "000", lehrer: true }
  : KINDER[Number(code)] ? { code: String(code), klasse: KINDER[Number(code)], zug: "7M", lrs: false } : null);
const pdf = (text) => Buffer.from("%PDF-1.7\n% " + text + "\n%%EOF\n", "latin1").toString("base64");

async function mitServer(lauf) {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "papier-"));
  const app = express(); app.use(express.json({ limit: "1mb" }));
  const uhr = { zeit: null };
  const jetzt = () => uhr.zeit || new Date();
  const papier = registerPapierprobenRoutes(app, { dataDir, teacherPassword: PW, kindZumCode, jetzt });
  registerProbenRueckgabeRoutes(app, { dataDir, teacherPassword: PW, kindZumCode, quellen: [], jetzt, zusatz: (k) => papier.meine(k) });
  const server = await new Promise((ok) => { const s = app.listen(0, () => ok(s)); });
  const post = (route, body) => fetch(`http://127.0.0.1:${server.address().port}/api/proben/${route}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
    .then(async (x) => ({ status: x.status, data: await x.json().catch(() => null) }));
  try { await lauf({ post, dataDir, uhr }); }
  finally { await new Promise((ok) => server.close(ok)); fs.rmSync(dataDir, { recursive: true, force: true }); }
}
const PROBE = { id: "d7-aufruf-kroetenzaun", titel: "Deutschprobe: Aufruf schreiben (korrigiert)", fach: "Deutsch", klasse: "7aM", datum: "2026-11-09" };

test("Papierprobe: nur die Lehrkraft lädt hoch, jedes Kind sieht nur sein eigenes PDF", async () => {
  await mitServer(async ({ post, dataDir }) => {
    assert.equal((await post("papier/hochladen", { ...PROBE, password: "falsch", code: "101", pdf: pdf("a") })).status, 401);
    assert.equal((await post("papier/hochladen", { ...PROBE, code: "101", pdf: pdf("a") })).status, 401, "ohne Passwort");
    const a = await post("papier/hochladen", { ...PROBE, password: PW, code: "101", pdf: pdf("Kind 101") });
    assert.equal(a.status, 200); assert.equal(a.data.ok, true); assert.ok(a.data.kind.freigegebenAm, "beim Hochladen gleich freigegeben");
    assert.equal((await post("papier/hochladen", { ...PROBE, password: PW, code: "102", pdf: pdf("Kind 102") })).status, 200);

    // Liste des Kindes (dieselbe Abfrage wie die Startseite)
    const meine = await post("rueckgabe/meine", { code: "101" });
    assert.equal(meine.status, 200);
    assert.equal(meine.data.rueckgaben.length, 1);
    const e = meine.data.rueckgaben[0];
    assert.deepEqual([e.modul, e.id, e.fach, e.titel, e.datum, e.neu, e.aktuell], ["papier", PROBE.id, "Deutsch", PROBE.titel, "2026-11-09", true, true]);
    assert.match(e.sichtbarBis, /^\d{4}-\d{2}-\d{2}$/);
    assert.deepEqual((await post("rueckgabe/meine", { code: "201" })).data.rueckgaben, [], "Kind ohne PDF sieht nichts");

    // Ansehen: das eigene PDF, merkt „geöffnet“
    const s = await post("papier/ansehen", { code: "101", id: PROBE.id });
    assert.equal(s.status, 200);
    assert.equal(Buffer.from(s.data.papier.pdf, "base64").toString("latin1").includes("Kind 101"), true);
    assert.equal(s.data.papier.titel, PROBE.titel);
    assert.equal((await post("rueckgabe/meine", { code: "101" })).data.rueckgaben[0].neu, false, "nach dem Öffnen nicht mehr neu");
    assert.equal((await post("papier/ansehen", { code: "201", id: PROBE.id })).status, 404, "fremde Probe: wie unbekannt");
    assert.equal((await post("papier/ansehen", { code: "999", id: PROBE.id })).status, 404, "unbekannter Code");
    assert.equal((await post("papier/ansehen", { code: "000", id: PROBE.id })).status, 403, "Lehrercode");
    assert.equal((await post("papier/ansehen", { id: PROBE.id })).status, 400, "ohne Code");

    // Stand für die Lehrkraft: ohne Namen, mit geöffnet
    const st = await post("papier/stand", { password: PW, klasse: "7aM" });
    assert.equal(st.data.proben.length, 1);
    assert.deepEqual(Object.keys(st.data.proben[0].kinder).sort(), ["101", "102"]);
    assert.ok(st.data.proben[0].kinder["101"].geoeffnetAm); assert.equal(st.data.proben[0].kinder["102"].geoeffnetAm, "");
    assert.deepEqual((await post("papier/stand", { password: PW, klasse: "8b" })).data.proben, []);
    assert.equal((await post("papier/stand", { password: "x" })).status, 401);

    // auf dem Server liegen keine Dateinamen oder Namen, nur Code und PDF
    const dateien = fs.readdirSync(dataDir).sort();
    assert.deepEqual(dateien, ["papierprobe--d7-aufruf-kroetenzaun--101.json", "papierprobe--d7-aufruf-kroetenzaun--102.json", "papierproben.json", "proben-rueckgabe.json"].filter((d) => dateien.includes(d)));
  });
});

test("Papierprobe: Prüfungen beim Hochladen", async () => {
  await mitServer(async ({ post }) => {
    const hoch = (extra) => post("papier/hochladen", { ...PROBE, password: PW, code: "101", pdf: pdf("x"), ...extra });
    assert.equal((await hoch({ pdf: Buffer.from("<html>kein pdf").toString("base64") })).status, 400, "keine PDF");
    assert.equal((await hoch({ pdf: "" })).status, 400);
    assert.equal((await hoch({ code: "12" })).status, 400, "Code mit 2 Ziffern");
    assert.equal((await hoch({ code: "999" })).status, 404, "unbekannter Code");
    assert.equal((await hoch({ code: "000" })).status, 400, "Lehrercode");
    const fremd = await hoch({ code: "201" });
    assert.equal(fremd.status, 409, "Code aus einer anderen Klasse"); assert.match(fremd.data.error, /8b/);
    assert.equal((await hoch({ id: "../../x" })).status, 400, "Kennung mit Pfad");
    assert.equal((await hoch({ id: "A B" })).status, 400);
    assert.equal((await hoch({ titel: "  " })).status, 400, "ohne Titel");
    const gross = Buffer.concat([Buffer.from("%PDF-1.7\n"), Buffer.alloc(MAX_PDF)]).toString("base64");
    assert.notEqual((await hoch({ pdf: gross })).status, 200, "zu groß");
    assert.equal((await hoch({ fach: "Quatsch" })).status, 200, "unbekanntes Fach wird „Sonstiges“");
  });
});

test("Papierprobe: 7 Tage sichtbar, zurücknehmen, noch einmal freigeben, löschen", async () => {
  await mitServer(async ({ post, uhr, dataDir }) => {
    uhr.zeit = new Date("2026-11-10T15:00:00Z");
    await post("papier/hochladen", { ...PROBE, password: PW, code: "101", pdf: pdf("a") });
    await post("papier/hochladen", { ...PROBE, password: PW, code: "102", pdf: pdf("b") });
    uhr.zeit = new Date("2026-11-17T20:00:00Z");   // 7. Tag nach der Rückgabe (deutsche Zeit): noch zu sehen
    assert.equal((await post("rueckgabe/meine", { code: "101" })).data.rueckgaben.length, 1);
    uhr.zeit = new Date("2026-11-18T10:00:00Z");   // danach: weg
    assert.equal((await post("rueckgabe/meine", { code: "101" })).data.rueckgaben.length, 0);
    const vorbei = await post("papier/ansehen", { code: "101", id: PROBE.id });
    assert.equal(vorbei.status, 403); assert.equal(vorbei.data.vorbei, true);
    assert.equal((await post("papier/stand", { password: PW })).data.proben[0].kinder["101"].vorbei, true);

    // noch einmal freigeben: neue 7 Tage, wieder neu
    const neu = await post("papier/freigeben", { password: PW, id: PROBE.id, offen: true });
    assert.equal(neu.data.anzahl, 2);
    assert.equal((await post("rueckgabe/meine", { code: "101" })).data.rueckgaben[0].neu, true);

    // zurücknehmen nur für 102
    assert.equal((await post("papier/freigeben", { password: PW, id: PROBE.id, offen: false, codes: ["102"] })).data.anzahl, 1);
    assert.equal((await post("rueckgabe/meine", { code: "102" })).data.rueckgaben.length, 0);
    assert.equal((await post("papier/ansehen", { code: "102", id: PROBE.id })).status, 403);
    assert.equal((await post("rueckgabe/meine", { code: "101" })).data.rueckgaben.length, 1, "101 sieht sie weiter");

    // neues PDF für ein Kind ersetzt das alte und gibt wieder frei
    await post("papier/hochladen", { ...PROBE, password: PW, code: "102", pdf: pdf("b2") });
    const b2 = await post("papier/ansehen", { code: "102", id: PROBE.id });
    assert.equal(Buffer.from(b2.data.papier.pdf, "base64").toString("latin1").includes("b2"), true);

    // löschen: Datei wird überschrieben (der Upstash-Spiegel kennt kein Löschen), Eintrag weg
    assert.equal((await post("papier/loeschen", { password: PW, id: PROBE.id, codes: ["101"] })).data.anzahl, 1);
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dataDir, "papierprobe--d7-aufruf-kroetenzaun--101.json"), "utf8")).geloescht, true);
    assert.equal((await post("papier/ansehen", { code: "101", id: PROBE.id })).status, 404);
    assert.equal((await post("papier/loeschen", { password: PW, id: PROBE.id })).data.anzahl, 1);
    assert.deepEqual((await post("papier/stand", { password: PW })).data.proben, [], "letztes Kind gelöscht: Probe weg");
    assert.equal((await post("papier/loeschen", { password: PW, id: PROBE.id })).status, 404);
  });
});
