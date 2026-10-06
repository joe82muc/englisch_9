"use strict";

// Abgegebene Dateien der Praxisaufträge (abgaben.js): aufbewahren ohne Namen, ansehen und löschen durch die Lehrkraft.
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const { zip } = require("./xlsx-mini");
const { registerExcelPruefung, liesXlsx, zipLesen } = require("./excelpruefung");
const { registerScratchPruefung } = require("./scratchpruefung");
const { abgabenSpeicher, abgabeMerker, registerAbgabenRoutes, saeubereXlsx } = require("./abgaben");

const NS = 'xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"';
// kleine Mappe: A1 Zahl, B1 Formel; mit Verfasser, Firma und Speicherpfad wie aus echtem Excel
function mappe(a1, verfasser = "Vorname Nachname") {
  return zip([
    { name: "[Content_Types].xml", data: '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"/>' },
    { name: "docProps/core.xml", data: `<cp:coreProperties xmlns:cp="x" xmlns:dc="y"><dc:creator>${verfasser}</dc:creator><cp:lastModifiedBy>${verfasser}</cp:lastModifiedBy></cp:coreProperties>` },
    { name: "docProps/app.xml", data: "<Properties><Application>Microsoft Excel</Application><Company>Schule von " + verfasser + "</Company></Properties>" },
    { name: "xl/workbook.xml", data: `<?xml version="1.0"?><workbook ${NS} xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="m"><mc:AlternateContent><mc:Choice Requires="x15"><x15ac:absPath url="C:\\Users\\${verfasser}\\Documents\\" xmlns:x15ac="z"/></mc:Choice></mc:AlternateContent><sheets><sheet name="Tabelle1" sheetId="1" r:id="rId1"/></sheets></workbook>` },
    { name: "xl/_rels/workbook.xml.rels", data: '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>' },
    { name: "xl/worksheets/sheet1.xml", data: `<?xml version="1.0"?><worksheet ${NS}><sheetData><row r="1"><c r="A1"><v>${a1}</v></c><c r="B1"><f>A1*2</f><v>${a1 * 2}</v></c></row></sheetData></worksheet>` },
    { name: "xl/media/bild.bin", data: Buffer.from([0, 255, 1, 254, 2, 253]) }
  ]);
}
// kleines Scratch-Projekt: Fahne – frage – sage Antwort
function projekt(mitFrage = true) {
  const blocks = {
    a: { opcode: "event_whenflagclicked", next: mitFrage ? "b" : "c", parent: null, inputs: {}, fields: {}, shadow: false, topLevel: true },
    b: { opcode: "sensing_askandwait", next: "c", parent: "a", inputs: { QUESTION: [1, [10, "Wie heißt du?"]] }, fields: {}, shadow: false, topLevel: false },
    c: { opcode: "looks_sayforsecs", next: null, parent: mitFrage ? "b" : "a", inputs: { MESSAGE: [3, "d", [10, ""]], SECS: [1, [4, "2"]] }, fields: {}, shadow: false, topLevel: false },
    d: { opcode: "sensing_answer", next: null, parent: "c", inputs: {}, fields: {}, shadow: false, topLevel: false }
  };
  if (!mitFrage) delete blocks.b;
  return zip([{ name: "project.json", data: JSON.stringify({ targets: [{ isStage: true, name: "Stage", variables: {}, blocks: {} }, { isStage: false, name: "Sprite1", variables: {}, blocks }], meta: { semver: "3.0.0" } }) }]);
}

const PW = "Nur-ein-Test-4711";
const kindZumCode = async (code) => (code === "734" ? { code: "734", klasse: "8aM", zug: "8M" } : code === "735" ? { code: "735", klasse: "8aM", zug: "8M" }
  : code === "559" ? { code: "559", klasse: "7aM", zug: "7M" } : null);
const AUFGABEN = { "test-auf1": { titel: "Testauftrag", auftrag: "In A1 steht 5.", pruefe: (x) => [{ ok: x.gleich("A1", 5), text: "A1 ist 5." }, { ok: x.hatFormel("B1"), text: "B1 ist eine Formel." }] } };

async function mitServer(speicher, lauf) {
  const app = express();
  app.use(express.json({ limit: "1mb" }));
  const merke = abgabeMerker({ speicher, kindZumCode, stufe: 8 });
  registerExcelPruefung(app, { prefix: "/api/inf8", aufgaben: AUFGABEN, merke });
  registerScratchPruefung(app, { prefix: "/api/inf8", merke });
  registerAbgabenRoutes(app, { prefix: "/api/inf8", stufe: 8, teacherPassword: PW, speicher, excelAufgaben: AUFGABEN, scratchModul: require("./inf8-scratch-aufgaben") });
  const server = await new Promise((resolve) => { const s = app.listen(0, () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (route, body) => fetch(base + route, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
    .then(async (r) => ({ status: r.status, data: await r.json().catch(() => null) }));
  try { await lauf(post); } finally { await new Promise((resolve) => server.close(resolve)); }
}
const dateiSpeicher = () => { const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "abgaben-test-")); return { speicher: abgabenSpeicher({ kurs: "inf8", env: {}, dataDir }), dataDir }; };

// Upstash nachgebaut: nur die Befehle, die abgaben.js benutzt
function falschesUpstash() {
  const werte = new Map(), hashes = new Map(), befehle = [];
  const fetchImpl = async (_url, init) => {
    const [befehl, ...a] = JSON.parse(init.body); befehle.push(befehl);
    const h = (k) => { if (!hashes.has(k)) hashes.set(k, new Map()); return hashes.get(k); };
    let result = null;
    if (befehl === "SET") { werte.set(a[0], a[1]); result = "OK"; }
    else if (befehl === "GET") result = werte.has(a[0]) ? werte.get(a[0]) : null;
    else if (befehl === "DEL") { result = a.filter((k) => werte.delete(k)).length; }
    else if (befehl === "HSET") { h(a[0]).set(a[1], a[2]); result = 1; }
    else if (befehl === "HGET") result = h(a[0]).has(a[1]) ? h(a[0]).get(a[1]) : null;
    else if (befehl === "HGETALL") result = [...h(a[0]).entries()].flat();
    else if (befehl === "HDEL") result = a.slice(1).filter((f) => h(a[0]).delete(f)).length;
    else if (befehl === "EXPIRE") result = 1;
    else return { ok: false, status: 400, json: async () => ({ error: "unbekannt: " + befehl }) };
    return { ok: true, status: 200, json: async () => ({ result }) };
  };
  return { fetchImpl, werte, befehle };
}

test("Excel-Mappe säubern: Verfasser, Firma und Speicherpfad sind weg, die Zellen bleiben", () => {
  const roh = mappe(5, "Mia Musterkind"), sauber = saeubereXlsx(roh);
  const z = zipLesen(sauber);
  const alles = z.namen.filter((n) => n !== "xl/media/bild.bin").map((n) => z.text(n)).join("\n");
  assert.equal(/Musterkind|Mia/.test(alles), false, "kein Name mehr in der Datei");
  assert.match(z.text("docProps/core.xml"), /<dc:creator>GRUMI<\/dc:creator>.*<cp:lastModifiedBy>GRUMI<\/cp:lastModifiedBy>/);
  assert.equal(/absPath|Company/.test(alles), false);
  assert.deepEqual([...z.daten("xl/media/bild.bin")], [0, 255, 1, 254, 2, 253], "andere Teile bleiben Byte für Byte gleich");
  const x = liesXlsx(sauber);
  assert.ok(x.gleich("A1", 5) && x.gleich("B1", 10) && x.hatFormel("B1"));
  assert.throws(() => saeubereXlsx(Buffer.from("keine Mappe")));
});

for (const art of ["datei", "upstash"]) {
  test(`Speicher (${art}): aufbewahren, auflisten, holen, löschen – eine bestandene Fassung bleibt`, async () => {
    const falsch = falschesUpstash();
    const speicher = art === "datei" ? dateiSpeicher().speicher
      : abgabenSpeicher({ kurs: "inf8", env: { UPSTASH_grumiproben: "https://beispiel.upstash.io", UPSTASH_grumiproben_token: "t" }, fetch: falsch.fetchImpl });
    assert.equal(speicher.art, art);
    const meta = (erfuellt) => ({ zeit: "2026-10-06T08:00:00.000Z", art: "xlsx", groesse: 3, erfuellt, offen: erfuellt ? 0 : 1, anzahl: 2 });
    assert.equal(await speicher.speichere("8aM", "734", "test-auf1", meta(false), Buffer.from("eins")), true);
    assert.equal(await speicher.speichere("8aM", "734", "test-auf1", meta(true), Buffer.from("zwei")), true, "neuere Fassung ersetzt");
    assert.equal(await speicher.speichere("8aM", "734", "test-auf1", meta(false), Buffer.from("drei")), false, "bestanden bleibt");
    await speicher.speichere("8aM", "735", "test-auf1", meta(false), Buffer.from("vier"));
    await speicher.speichere("8b", "801", "test-auf1", meta(true), Buffer.from("andere Klasse"));
    const liste = await speicher.liste("8aM");
    assert.deepEqual(liste.map((e) => [e.code, e.aufgabe, e.erfuellt]).sort(), [["734", "test-auf1", true], ["735", "test-auf1", false]]);
    assert.equal((await speicher.hole("8aM", "734", "test-auf1")).buf.toString(), "zwei");
    assert.equal(await speicher.hole("8aM", "999", "test-auf1"), null);
    assert.equal(await speicher.loesche("8aM", "735"), 1);
    assert.equal((await speicher.liste("8aM")).length, 1);
    assert.equal(await speicher.loesche("8aM"), 1);
    assert.deepEqual(await speicher.liste("8aM"), []);
    assert.equal((await speicher.liste("8b")).length, 1, "andere Klasse unberührt");
    if (art === "upstash") assert.ok(falsch.befehle.includes("EXPIRE") && [...falsch.werte.keys()].every((k) => k.startsWith("abg:inf8:d:8b:")), "Schlüssel mit Verfall, gelöschte Dateien sind weg");
  });
}

test("Hochladen mit Code: Die Datei wird aufbewahrt – ohne Namen; ohne Code, mit Code einer 7. Klasse oder falschem Code nicht", async () => {
  const { speicher, dataDir } = dateiSpeicher();
  await mitServer(speicher, async (post) => {
    const b64 = (a1, name) => mappe(a1, name).toString("base64");
    let r = await post("/api/inf8/excel/pruefen", { aufgabe: "test-auf1", datei: b64(4, "Mia Musterkind") });
    assert.equal(r.data.gespeichert, false, "ohne Code (Vorschau der Lehrkraft)");
    for (const code of ["559", "000", "ab cd", ""]) assert.equal((await post("/api/inf8/excel/pruefen", { aufgabe: "test-auf1", datei: b64(4), code })).data.gespeichert, false, "Code " + code);
    assert.deepEqual(await speicher.liste("8aM"), []);
    r = await post("/api/inf8/excel/pruefen", { aufgabe: "test-auf1", datei: b64(4, "Mia Musterkind"), code: "734" });
    assert.deepEqual([r.status, r.data.erfuellt, r.data.gespeichert], [200, false, true]);
    r = await post("/api/inf8/excel/pruefen", { aufgabe: "test-auf1", datei: b64(5, "Mia Musterkind"), code: "734" });
    assert.deepEqual([r.data.erfuellt, r.data.gespeichert], [true, true]);
    await post("/api/inf8/excel/pruefen", { aufgabe: "test-auf1", datei: b64(9, "Mia Musterkind"), code: "734" });   // schlechter: die bestandene Fassung bleibt
    await post("/api/inf8/excel/pruefen", { aufgabe: "test-auf1", datei: Buffer.from("keine Mappe").toString("base64"), code: "734" });   // nicht lesbar: nichts gespeichert
    await post("/api/inf8/scratch/pruefen", { aufgabe: "eingabe-auf1", datei: projekt(true).toString("base64"), code: "735" });
    await post("/api/inf8/scratch/pruefen", { aufgabe: "eingabe-auf1", datei: projekt(false).toString("base64"), code: "734" });

    assert.equal((await post("/api/inf8/lehrer/abgaben", { password: "falsch", klasse: "8aM" })).status, 401);
    assert.equal((await post("/api/inf8/lehrer/abgaben", { password: PW, klasse: "7aM" })).status, 400);
    const liste = (await post("/api/inf8/lehrer/abgaben", { password: PW, klasse: "8aM" })).data;
    assert.deepEqual(liste.abgaben.map((a) => [a.code, a.aufgabe, a.titel, a.art, a.erfuellt, a.offen]), [
      ["734", "eingabe-auf1", "Die Figur fragt nach", "sb3", false, 2], ["734", "test-auf1", "Testauftrag", "xlsx", true, 0], ["735", "eingabe-auf1", "Die Figur fragt nach", "sb3", true, 0]]);
    // nichts mit Namen auf der Platte
    const platte = fs.readdirSync(path.join(dataDir, "abgaben", "inf8", "8aM")).map((f) => fs.readFileSync(path.join(dataDir, "abgaben", "inf8", "8aM", f))).map((b) => { try { const z = zipLesen(b); return z.namen.filter((n) => /\.xml$/.test(n)).map((n) => z.text(n)).join(""); } catch (_e) { return b.toString("utf8"); } }).join("");
    assert.equal(/Musterkind/.test(platte), false, "der Name aus der Excel-Datei ist nirgends gespeichert");

    // ansehen: Tabelle mit Formel, Punkte der Prüfung, die Datei selbst
    assert.equal((await post("/api/inf8/lehrer/abgabe", { password: "falsch", klasse: "8aM", code: "734", aufgabe: "test-auf1" })).status, 401);
    assert.equal((await post("/api/inf8/lehrer/abgabe", { password: PW, klasse: "8aM", code: "999", aufgabe: "test-auf1" })).status, 404);
    let a = (await post("/api/inf8/lehrer/abgabe", { password: PW, klasse: "8aM", code: "734", aufgabe: "test-auf1" })).data;
    assert.deepEqual([a.name, a.art, a.titel], ["test-auf1-734.xlsx", "xlsx", "Testauftrag"]);
    assert.deepEqual(a.vorschau, { art: "tabelle", spalten: 2, zeilen: 1, zellen: { A1: { t: "5" }, B1: { t: "10", f: "=A1*2" } } });
    assert.deepEqual(a.punkte.map((p) => p.ok), [true, true]);
    assert.ok(liesXlsx(Buffer.from(a.datei, "base64")).gleich("A1", 5), "die heruntergeladene Datei ist die bestandene Fassung");
    a = (await post("/api/inf8/lehrer/abgabe", { password: PW, klasse: "8aM", code: "735", aufgabe: "eingabe-auf1" })).data;
    assert.equal(a.name, "eingabe-auf1-735.sb3");
    assert.equal(a.vorschau.art, "programm");
    assert.match(a.vorschau.text, /Wenn Fahne angeklickt wird\nfrage \[Wie heißt du\?\] und warte\nsage \(Antwort\) für \[2\] Sekunden/);
    assert.ok(a.punkte.length >= 3 && a.punkte.every((p) => p.ok));

    // löschen: ein Kind, dann die Klasse
    assert.equal((await post("/api/inf8/lehrer/abgaben/loeschen", { password: "falsch", klasse: "8aM" })).status, 401);
    assert.equal((await post("/api/inf8/lehrer/abgaben/loeschen", { password: PW, klasse: "8aM", code: "735" })).data.anzahl, 1);
    assert.equal((await post("/api/inf8/lehrer/abgaben/loeschen", { password: PW, klasse: "8aM" })).data.anzahl, 2);
    assert.deepEqual((await post("/api/inf8/lehrer/abgaben", { password: PW, klasse: "8aM" })).data.abgaben, []);
  });
});

test("Fällt der Speicher aus, gibt es die Prüfung trotzdem – nur ohne Aufbewahren", async () => {
  const kaputt = { art: "upstash", speichere: async () => { throw new Error("Upstash: HTTP 500"); }, liste: async () => { throw new Error("Upstash: HTTP 500"); }, hole: async () => null, loesche: async () => 0 };
  await mitServer(kaputt, async (post) => {
    const r = await post("/api/inf8/excel/pruefen", { aufgabe: "test-auf1", datei: mappe(5).toString("base64"), code: "734" });
    assert.deepEqual([r.status, r.data.erfuellt, r.data.gespeichert], [200, true, false]);
    assert.equal((await post("/api/inf8/lehrer/abgaben", { password: PW, klasse: "8aM" })).status, 500);
  });
});
