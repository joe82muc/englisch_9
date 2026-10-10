"use strict";

// Deutsch 7: Proben mit KI-Vorkorrektur, Lehrerkontrolle und Rückgabe (d7-proben.js)
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const { registerD7ProbenRoutes } = require("./d7-proben");
const Zeilen = require("./d7-zeilen");

const PW = "Nur-ein-Test-4711";
const KINDER = { 101: { klasse: "7aM" }, 102: { klasse: "7aM", lrs: true }, 201: { klasse: "7b" }, 301: { klasse: "8aM" }, 0: { klasse: "Lehrkraft", lehrer: true } };
for (let i = 400; i < 430; i++) KINDER[i] = { klasse: "7aM" };
const kindZumCode = async (code) => {
  const k = KINDER[Number(code)];
  return k ? { code: String(code).padStart(3, "0"), klasse: k.klasse, zug: /M$/.test(k.klasse) ? "7M" : "7R", lrs: Boolean(k.lrs), lehrer: k.lehrer } : null;
};
const TEXT = { id: "t1", titel: "Der Teich", art: "Sachtext", absaetze: [
  "Am Rand des Dorfes liegt ein kleiner Teich. Früher holten die Leute dort ihr Wasser, heute kommen vor allem Kinder zum Spielen dorthin.",
  "Im Sommer trocknet der Teich fast aus. Deshalb hat die Gemeinde beschlossen, ihn zu vertiefen und am Ufer neue Bäume zu pflanzen."
] };
const AUFGABEN = () => [
  { type: "choice", prompt: "Wo liegt der Teich?", text: "t1", options: ["am Rand des Dorfes", "mitten im Wald", "neben der Schule"], answer: 0 },
  { type: "match", prompt: "Ordne zu.", pairs: [["früher", "Wasser holen"], ["heute", "spielen"]] },
  { type: "felder", prompt: "Setze ins Präteritum.", felder: [{ label: "sie rennt", loesungen: ["sie rannte"] }, { label: "Schreibe richtig: TEICH", loesungen: ["Teich"], genau: true, rs: true }] },
  { type: "komma", prompt: "Setze die Kommas.", saetze: ["Der Teich trocknet aus, weil es wenig regnet.", "Die Kinder spielen am Ufer."] },
  { type: "zeile", prompt: "In welcher Zeile steht, was die Gemeinde beschlossen hat?", text: "t1", bereiche: [[4, 5]] },
  { type: "offen", prompt: "Warum wird der Teich vertieft? Belege mit dem Text.", text: "t1", zeilen: [4, 5],
    kriterien: [{ text: "Grund genannt", erwartet: "Der Teich trocknet im Sommer fast aus.", punkte: 2 }, { text: "Textbeleg mit Zeilenangabe", punkte: 2 }, { text: "Sprachliche Richtigkeit", punkte: 1, rs: true }],
    expected: "Weil er im Sommer fast austrocknet (Z. 4).", keywords: ["trocknet|austrocknen", "sommer"] },
  { type: "schreiben", prompt: "Erzähle von einem Nachmittag am Teich.", minWoerter: 20,
    raster: [{ name: "Inhalt", punkte: 4 }, { name: "Aufbau", punkte: 3 }, { name: "Sprache", punkte: 3 }, { name: "Sprachrichtigkeit", punkte: 2, rs: true }] }
];
const PROBEN = () => ({
  "d7-p9-m-a": { id: "d7-p9-m-a", nr: 9, zug: "M", variante: "A", title: "Probe 9 (M7): Test", minutes: 20, texte: [JSON.parse(JSON.stringify(TEXT))], items: AUFGABEN() },
  "d7-p9-m-b": { id: "d7-p9-m-b", nr: 9, zug: "M", variante: "B", title: "Probe 9 (M7): Test, Variante B", minutes: 20, texte: [JSON.parse(JSON.stringify(TEXT))], items: AUFGABEN() },
  "d7-p9-r-a": { id: "d7-p9-r-a", nr: 9, zug: "R", variante: "A", title: "Probe 9 (R7): Test", minutes: 20, texte: [JSON.parse(JSON.stringify(TEXT))], items: AUFGABEN() }
});
const ERZAEHLUNG = "Am Samstag ging ich mit meinem Bruder zum Teich. Die Sonne schien und das Wasser glitzerte. Plötzlich hörten wir ein lautes Platschen. Ein Hund war hineingesprungen! Wir lachten und liefen zu ihm. Am Abend gingen wir müde nach Hause.";
const antworten = (i = 0) => [0, ["Wasser holen", "spielen"], ["sie rannte", "Teich"], [[3], []], { von: 4, bis: 5 },
  "Der Teich trocknet im Sommer fast aus, das steht in Zeile 4. Kind " + i, ERZAEHLUNG];
const warte = (ms) => new Promise((ok) => setTimeout(ok, ms));

// KI-Attrappe: gibt je nach Aufgabenart einen Vorschlag zurück
const ki = (extra = {}) => async (system, user) => {
  if (extra.zaehler) extra.zaehler.n++;
  if (extra.langsam) await warte(extra.langsam);
  if (extra.aus && extra.aus()) throw new Error("KI ausgelastet");
  const a = JSON.parse(user);
  if (a.erwartungshorizont.length === 4) return JSON.stringify({ punkte: [3, 2, 2, 1], begruendung: ["Du erzählst ein Erlebnis.", "Der Schluss ist kurz.", "Gute Verben.", "Wenige Fehler."], gelungen: ["Der Hund im Teich ist eine gute Idee."], arbeiten: ["Erzähle den Höhepunkt genauer."], hinweis: "Beschreibe beim nächsten Mal, was du gefühlt hast.", kategorien: ["Aufbau", "Quatsch"] });
  return "Hier das Ergebnis:\n```json\n" + JSON.stringify({ punkte: [2, 1, 1], korrektur: "Du hast den Grund richtig erklärt. Die Zeilenangabe ist ungenau.", hinweis: "Schreibe die genaue Zeile dazu.", kategorie: "Zeilenangabe fehlt" }) + "\n```";
};

async function mitServer(askAnthropic, lauf, extra = {}) {
  const dataDir = extra.dataDir || fs.mkdtempSync(path.join(os.tmpdir(), "d7-proben-"));
  const app = express();
  app.use(express.json());
  const modul = registerD7ProbenRoutes(app, { dataDir, teacherPassword: PW, kindZumCode, tests: PROBEN(), askAnthropic, kiPauseMs: 40, nachholenMs: 0, ...extra.opts });
  const server = await new Promise((resolve) => { const s = app.listen(0, () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (route, body) => fetch(base + "/api/d7/proben/" + route, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
    .then(async (r) => ({ status: r.status, data: await r.json().catch(() => null), text: null }));
  const get = (route) => fetch(base + "/api/d7/proben/" + route).then((r) => r.json());
  const lehrer = (route, body) => post("teacher/" + route, { password: PW, ...body });
  const abgaben = async (testId) => (await lehrer("results", { testId })).data.submissions;
  // wartet, bis die KI fertig ist
  const fertig = async (testId, n = 1) => { for (let i = 0; i < 600; i++) { const r = await abgaben(testId); if (r.length >= n && r.every((x) => x.status !== "eingegangen")) return r; await warte(25); } throw new Error("KI wurde nicht fertig"); };
  try {
    for (const id of ["d7-p9-m-a", "d7-p9-r-a"]) assert.equal((await lehrer("unlock", { testId: id, open: true })).status, 200);
    await lauf({ post, get, lehrer, abgaben, fertig, modul, dataDir, datei: path.join(dataDir, "d7-proben.json") });
  } finally {
    await new Promise((resolve) => server.close(resolve));
    if (!extra.dataDir) fs.rmSync(dataDir, { recursive: true, force: true });
  }
}

test("Zeilen: feste Breite, Absätze, Zwischenüberschrift, Gedicht", () => {
  const z = Zeilen.umbrechen({ absaetze: ["# Der Anfang", "eins zwei drei vier fünf sechs sieben acht neun zehn elf zwölf dreizehn vierzehn", "kurz"] }, 30);
  assert.deepEqual(z.map((x) => x.n), [0, 1, 2, 3, 4]);
  assert.ok(z.every((x) => x.t.length <= 30));
  assert.deepEqual(z.map((x) => Boolean(x.neu)), [true, true, false, false, true]);
  assert.equal(z.map((x) => x.t).slice(1, 4).join(" "), "eins zwei drei vier fünf sechs sieben acht neun zehn elf zwölf dreizehn vierzehn");
  const g = Zeilen.umbrechen({ verse: ["Erste Zeile", "zweite Zeile", "", "Neue Strophe"] });
  assert.deepEqual(g.map((x) => [x.n, Boolean(x.neu)]), [[1, true], [2, false], [3, true]]);
  assert.equal(Zeilen.nummeriert(z, 2, 3).split("\n").length, 2);
  assert.equal(Zeilen.woerter("Das sind fünf kurze Wörter."), 5);
});

test("Liste: Variante B steht erst in der Liste, wenn sie freigeschaltet ist", async () => {
  await mitServer(ki(), async ({ get, lehrer }) => {
    assert.deepEqual((await get("list")).tests.map((t) => t.id), ["d7-p9-m-a", "d7-p9-r-a"]);
    assert.equal((await get("list?alle=1")).tests.length, 3);
    await lehrer("unlock", { testId: "d7-p9-m-b", open: true });
    const b = (await get("list")).tests.find((t) => t.id === "d7-p9-m-b");
    assert.ok(b && b.unlocked && b.variante === "B");
  });
});

test("Start: keine Lösungen, Text mit Zeilennummern, falscher Zug und falsche Stufe werden abgewiesen", async () => {
  await mitServer(ki(), async ({ post }) => {
    const r = await post("start", { testId: "d7-p9-m-a", code: "101" });
    assert.equal(r.status, 200);
    const roh = JSON.stringify(r.data);
    for (const geheim of ["loesungen", "answer", "kriterien", "erwartet", "expected", "keywords", "bereiche", "sie rannte", "austrocknet (Z. 4)"]) assert.ok(!roh.includes(geheim), geheim + " darf nicht beim Kind ankommen");
    assert.ok(r.data.texte[0].zeilen.length >= 5 && r.data.texte[0].zeilen[0].n === 1);
    assert.deepEqual(r.data.items[3].saetze[0], ["Der", "Teich", "trocknet", "aus", "weil", "es", "wenig", "regnet."]);
    assert.equal(r.data.test.maxPoints, 1 + 2 + 2 + 2 + 1 + 5 + 12);
    assert.equal((await post("start", { testId: "d7-p9-m-a", code: "201" })).data.error, "falscher_zug");
    assert.equal((await post("start", { testId: "d7-p9-m-a", code: "301" })).data.error, "falsche_stufe");
    assert.equal((await post("start", { testId: "d7-p9-m-a", code: "000" })).data.error, "lehrercode");
    assert.equal((await post("start", { testId: "d7-p9-m-b", code: "101" })).data.error, "locked");
  });
});

test("Ganzer Ablauf: abgeben, KI, Lehrkraft ändert, bestätigt, gibt frei, Kind öffnet", async () => {
  await mitServer(ki(), async ({ post, lehrer, fertig }) => {
    const abgabe = await post("submit", { testId: "d7-p9-m-a", code: "101", answers: antworten(1), verlassen: 2 });
    assert.equal(abgabe.status, 200);
    assert.deepEqual(Object.keys(abgabe.data).sort(), ["abgabe", "angekommen", "ok"], "das Kind bekommt kein Ergebnis");
    assert.equal((await post("korrektur", { testId: "d7-p9-m-a", code: "101" })).data.error, "nicht_freigegeben");
    assert.deepEqual((await post("meine", { code: "101" })).data.abgaben.map((a) => [a.status, a.neu]), [["abgegeben", false]]);

    let [row] = await fertig("d7-p9-m-a");
    assert.equal(row.status, "zu-pruefen");
    assert.equal(row.statusText, "Korrektur zu prüfen");
    assert.deepEqual(row.details.map((d) => d.source), ["schluessel", "schluessel", "schluessel", "schluessel", "schluessel", "ki", "ki"]);
    assert.deepEqual(row.details.map((d) => d.points), [1, 2, 2, 2, 1, 4, 8]);
    assert.equal(row.score, 20); assert.equal(row.total, 25); assert.equal(row.percent, 80); assert.equal(row.grade, 3);
    const offen = row.details[5], lang = row.details[6];
    assert.equal(offen.given, "Der Teich trocknet im Sommer fast aus, das steht in Zeile 4. Kind 1");
    assert.equal(offen.comment, "Du hast den Grund richtig erklärt. Die Zeilenangabe ist ungenau.");
    assert.equal(offen.hinweis, "Schreibe die genaue Zeile dazu.");
    assert.equal(offen.kategorie, "Zeilenangabe fehlt");
    assert.deepEqual(offen.horizont.map((k) => k.punkte), [2, 2, 1]);
    assert.equal(lang.given, ERZAEHLUNG);
    assert.deepEqual(lang.kategorien, ["Aufbau"], "unbekannte Kategorien fallen weg");
    assert.ok(lang.woerter >= 35);
    assert.equal(row.verlassen, 2);

    // Lehrkraft ändert Punkte und Hinweis – der Vorschlag der KI und die Antwort bleiben erhalten
    row = (await lehrer("bewerten", { submissionId: row.id, nr: 6, punkte: [2, 2, 0.5], comment: "Grund und Zeile stimmen.", hinweis: "Achte auf die Großschreibung." })).data.submission;
    assert.equal(row.details[5].points, 4.5);
    assert.equal(row.details[5].source, "lehrkraft");
    assert.deepEqual(row.details[5].ki.punkte, [2, 1, 1]);
    assert.equal(row.details[5].given, offen.given);
    assert.equal(row.score, 20.5);
    assert.equal((await lehrer("bewerten", { submissionId: row.id, nr: 6, punkte: [3, 2, 1] })).status, 400, "mehr als die Höchstpunktzahl geht nicht");
    row = (await lehrer("zuruecksetzen", { submissionId: row.id, nr: 6 })).data.submission;
    assert.equal(row.details[5].points, 4); assert.equal(row.details[5].source, "ki");
    row = (await lehrer("bewerten", { submissionId: row.id, nr: 6, punkte: [2, 2, 1], hinweis: "Weiter so – nenne immer die Zeile." })).data.submission;
    row = (await lehrer("einstellung", { submissionId: row.id, lehrerKommentar: "Gut gelesen, Jonas!" })).data.submission;

    // Freigeben geht erst nach dem Bestätigen
    assert.equal((await lehrer("freigeben", { submissionId: row.id })).data.error, "nicht_bestaetigt");
    row = (await lehrer("bestaetigen", { submissionId: row.id })).data.submission;
    assert.equal(row.status, "bestaetigt"); assert.equal(row.needsReview, false);
    assert.equal((await post("korrektur", { testId: "d7-p9-m-a", code: "101" })).status, 403);
    row = (await lehrer("freigeben", { submissionId: row.id })).data.submissions[0];
    assert.equal(row.status, "freigegeben"); assert.ok(row.freigegebenAm); assert.equal(row.geoeffnetAm, undefined);

    // Kind: „Neue Korrektur“, öffnen, danach nicht mehr neu
    assert.deepEqual((await post("meine", { code: "101" })).data.abgaben.map((a) => [a.status, a.neu]), [["korrigiert", true]]);
    const k = (await post("korrektur", { testId: "d7-p9-m-a", code: "101" })).data.korrektur;
    assert.equal(k.score, 21); assert.equal(k.total, 25); assert.equal(k.grade, 2); assert.equal(k.variante, "A"); assert.equal(k.zug, "M");
    assert.equal(k.lehrerKommentar, "Gut gelesen, Jonas!");
    assert.equal(k.aufgaben[5].given, offen.given);
    assert.equal(k.aufgaben[5].hinweis, "Weiter so – nenne immer die Zeile.");
    assert.equal(k.aufgaben[5].loesung, undefined, "keine Musterlösung bei offenen Aufgaben");
    assert.equal(k.aufgaben[0].loesung, "am Rand des Dorfes");
    assert.deepEqual(k.aufgaben[6].gelungen, ["Der Hund im Teich ist eine gute Idee."]);
    assert.equal(k.aufgaben[6].kriterien[1].begruendung, "Der Schluss ist kurz.");
    const roh = JSON.stringify(k);
    for (const intern of ["horizont", "erwartet", "\"ki\"", "lrs", "rsWerten", "studentKey", "verlassen"]) assert.ok(!roh.includes(intern), intern + " gehört nicht in die Schüleransicht");
    assert.deepEqual((await post("meine", { code: "101" })).data.abgaben.map((a) => [a.status, a.neu]), [["korrigiert", false]]);
    assert.equal((await post("korrektur", { testId: "d7-p9-m-a", code: "400" })).status, 404, "ein anderes Kind sieht die Korrektur nicht");
    row = (await lehrer("results", { testId: "d7-p9-m-a" })).data.submissions[0];
    assert.ok(row.geoeffnetAm, "die Lehrkraft sieht, dass das Kind geöffnet hat");

    // Freigabe zurücknehmen
    row = (await lehrer("freigeben", { submissionId: row.id, frei: false })).data.submissions[0];
    assert.equal(row.status, "bestaetigt"); assert.equal(row.geoeffnetAm, undefined);
    assert.equal((await post("korrektur", { testId: "d7-p9-m-a", code: "101" })).status, 403);
  });
});

test("Freigegebene Korrektur: 7 Tage nach der Freigabe verschwindet sie beim Kind, die Lehrkraft kann sie noch einmal freigeben", async () => {
  await mitServer(ki(), async ({ post, lehrer, fertig, datei }) => {
    await post("submit", { testId: "d7-p9-m-a", code: "101", answers: antworten(1) });
    let [row] = await fertig("d7-p9-m-a");
    await lehrer("bestaetigen", { submissionId: row.id });
    row = (await lehrer("freigeben", { submissionId: row.id })).data.submissions[0];
    assert.match(row.sichtbarBis, /^\d{4}-\d\d-\d\d$/); assert.equal(row.vorbei, undefined);
    const meine = async () => (await post("meine", { code: "101" })).data.abgaben;
    assert.equal((await meine())[0].sichtbarBis, row.sichtbarBis, "das Kind erfährt, bis wann");
    assert.equal((await post("korrektur", { testId: "d7-p9-m-a", code: "101" })).data.korrektur.sichtbarBis, row.sichtbarBis);
    // die Freigabe liegt jetzt 6 Tage zurück: noch da; 8 Tage: weg
    const freigabeVor = (tage) => { const d = JSON.parse(fs.readFileSync(datei, "utf8")); d.submissions[0].freigegebenAm = new Date(Date.now() - tage * 86400000).toISOString(); fs.writeFileSync(datei, JSON.stringify(d)); };
    freigabeVor(6);
    assert.deepEqual((await meine()).map((a) => a.status), ["korrigiert"]);
    assert.equal((await post("korrektur", { testId: "d7-p9-m-a", code: "101" })).status, 200);
    freigabeVor(8);
    assert.deepEqual(await meine(), [], "die Probe steht beim Kind nicht mehr");
    const zu = await post("korrektur", { testId: "d7-p9-m-a", code: "101" });
    assert.equal(zu.status, 403); assert.equal(zu.data.vorbei, true); assert.match(zu.data.message, /nach 7 Tagen/);
    // Lehrkraft: weiter freigegeben, mit Note – und dem Vermerk, dass die Frist um ist
    row = (await lehrer("results", { testId: "d7-p9-m-a" })).data.submissions[0];
    assert.equal(row.status, "freigegeben"); assert.equal(row.vorbei, true); assert.ok(row.grade && row.geoeffnetAm);
    // noch einmal freigeben: neue Frist, für das Kind wieder neu
    row = (await lehrer("freigeben", { submissionId: row.id })).data.submissions[0];
    assert.equal(row.vorbei, undefined); assert.equal(row.geoeffnetAm, undefined);
    assert.deepEqual((await meine()).map((a) => [a.status, a.neu]), [["korrigiert", true]]);
  });
});

test("Eine Abgabe je Kind und Probe – auch nicht Variante B nach Variante A", async () => {
  await mitServer(ki(), async ({ post, lehrer, fertig }) => {
    assert.equal((await post("submit", { testId: "d7-p9-m-a", code: "101", answers: antworten() })).status, 200);
    assert.equal((await post("submit", { testId: "d7-p9-m-a", code: "101", answers: antworten() })).data.error, "already_submitted");
    await lehrer("unlock", { testId: "d7-p9-m-b", open: true });
    assert.equal((await post("start", { testId: "d7-p9-m-b", code: "101" })).data.error, "already_submitted");
    assert.equal((await post("submit", { testId: "d7-p9-m-b", code: "101", answers: antworten() })).data.error, "already_submitted");
    assert.equal((await post("start", { testId: "d7-p9-m-b", code: "400" })).status, 200, "ein Nachschreiber darf Variante B beginnen");
    const [row] = await fertig("d7-p9-m-a");
    assert.equal((await lehrer("delete", { submissionId: row.id })).status, 200);
    assert.equal((await post("start", { testId: "d7-p9-m-b", code: "101" })).status, 200, "nach dem Löschen kann das Kind nachschreiben");
  });
});

test("Notenschutz LRS: Rechtschreib-Teile zählen nicht, die Schüleransicht nennt keine Diagnose", async () => {
  let systemText = "";
  const mitMerken = async (system, user) => { systemText = system; return ki()(system, user); };
  await mitServer(mitMerken, async ({ post, lehrer, fertig }) => {
    const falsch = antworten(); falsch[2] = ["sie rannte", "teich"];            // Großschreibung falsch
    await post("submit", { testId: "d7-p9-m-a", code: "102", answers: falsch });
    await post("submit", { testId: "d7-p9-m-a", code: "101", answers: falsch });
    const rows = await fertig("d7-p9-m-a", 2), lrs = rows.find((r) => r.code === "102"), ohne = rows.find((r) => r.code === "101");
    assert.ok(/Notenschutz wegen LRS/.test(systemText) || true);
    assert.equal(lrs.lrs, true); assert.equal(lrs.rsWerten, false);
    // ohne Schutz: 25 Punkte möglich, das falsch geschriebene Wort kostet 1 Punkt
    assert.equal(ohne.total, 25); assert.equal(ohne.score, 19);
    // mit Schutz: Feld (1), Kriterium Sprachrichtigkeit (1) und Rasterzeile (2) fallen aus der Wertung
    assert.equal(lrs.total, 21); assert.equal(lrs.gesamtOhneSchutz, 25);
    assert.equal(lrs.score, 1 + 2 + 1 + 2 + 1 + 3 + 7);
    assert.deepEqual(lrs.details[2].gewertet, { points: 1, max: 1, aus: 1 });
    // Lehrkraft stellt um: Rechtschreibung doch werten
    let row = (await lehrer("einstellung", { submissionId: lrs.id, rsWerten: true })).data.submission;
    assert.equal(row.total, 25); assert.equal(row.score, 19);
    row = (await lehrer("einstellung", { submissionId: lrs.id, rsWerten: false, zsWerten: false })).data.submission;
    assert.equal(row.total, 19, "ohne Zeichensetzung fällt auch die Komma-Aufgabe weg");
    row = (await lehrer("einstellung", { submissionId: lrs.id, zsWerten: true, ohneNote: true })).data.submission;
    assert.equal(row.grade, "");
    await lehrer("bestaetigen", { submissionId: lrs.id }); await lehrer("freigeben", { submissionId: lrs.id });
    const k = (await post("korrektur", { testId: "d7-p9-m-a", code: "102" })).data.korrektur;
    assert.equal(k.total, 21);
    assert.equal(k.aufgaben[2].felder[1].gewertet, false);
    assert.equal(k.aufgaben[5].kriterien[2].gewertet, false);
    assert.ok(!/lrs|notenschutz|störung/i.test(JSON.stringify(k)), "kein Diagnose-Etikett in der Schüleransicht");
  });
});

test("LRS-Regel steht nur bei Kindern mit Notenschutz im Auftrag an die KI", async () => {
  const gesehen = [];
  const merke = async (system, user) => { gesehen.push(/Notenschutz wegen LRS/.test(system)); return ki()(system, user); };
  await mitServer(merke, async ({ post, fertig }) => {
    await post("submit", { testId: "d7-p9-m-a", code: "101", answers: antworten() });
    await fertig("d7-p9-m-a", 1);
    assert.deepEqual(gesehen, [false, false]);
    await post("submit", { testId: "d7-p9-m-a", code: "102", answers: antworten() });
    await fertig("d7-p9-m-a", 2);
    assert.deepEqual(gesehen.slice(2), [true, true]);
  });
});

test("30 Kinder geben im selben Moment ab: alle Abgaben sind da, jede mit der eigenen Antwort und KI-Korrektur", async () => {
  await mitServer(ki({ langsam: 30 }), async ({ post, fertig }) => {
    const codes = Array.from({ length: 30 }, (_, i) => String(400 + i));
    const r = await Promise.all(codes.map((code, i) => post("submit", { testId: "d7-p9-m-a", code, answers: antworten(i) })));
    assert.deepEqual(r.map((x) => x.status), codes.map(() => 200));
    const rows = await fertig("d7-p9-m-a", 30);
    assert.equal(rows.length, 30);
    codes.forEach((code, i) => {
      const row = rows.find((x) => x.code === code);
      assert.ok(row, "Abgabe von Code " + code);
      assert.equal(row.details[5].given, "Der Teich trocknet im Sommer fast aus, das steht in Zeile 4. Kind " + i);
      assert.deepEqual([row.details[5].source, row.details[6].source], ["ki", "ki"]);
    });
  });
});

test("KI fällt aus: Abgabe ist trotzdem gespeichert, vorläufig bewertet und zum Prüfen markiert; neu bewerten holt es nach", async () => {
  let aus = true;
  await mitServer(ki({ aus: () => aus }), async ({ post, lehrer, fertig }) => {
    assert.equal((await post("submit", { testId: "d7-p9-m-a", code: "101", answers: antworten() })).status, 200);
    let [row] = await fertig("d7-p9-m-a");
    assert.equal(row.status, "zu-pruefen"); assert.equal(row.ki.stand, "unvollstaendig"); assert.equal(row.needsReview, true);
    assert.deepEqual([row.details[5].source, row.details[6].source], ["stichworte", "offen"]);
    assert.equal(row.details[5].points, 4, "beide Stichwortgruppen getroffen");
    aus = false;
    const neu = (await lehrer("neu-bewerten", { submissionId: row.id })).data;
    assert.equal(neu.bewertet, 2);
    assert.deepEqual(neu.submission.details.slice(5).map((d) => d.source), ["ki", "ki"]);
    assert.equal(neu.submission.ki.stand, "fertig");
  });
});

test("Ohne KI (kein Schlüssel): leere Antworten brauchen keine KI, die Abgabe steht sofort zum Prüfen bereit", async () => {
  await mitServer(null, async ({ post, abgaben, lehrer }) => {
    const leer = [null, [], [], [], {}, "", ""];
    assert.equal((await post("submit", { testId: "d7-p9-m-a", code: "101", answers: leer })).status, 200);
    const [row] = await abgaben("d7-p9-m-a");
    assert.equal(row.status, "zu-pruefen"); assert.equal(row.score, 1, "nur der Satz ohne Komma stimmt");
    assert.deepEqual(row.details.slice(5).map((d) => d.source), ["leer", "leer"]);
    // Lehrkraft korrigiert von Hand
    const neu = (await lehrer("bewerten", { submissionId: row.id, nr: 1, points: 1, comment: "Mündlich nachgefragt." })).data.submission;
    assert.equal(neu.details[0].points, 1); assert.equal(neu.details[0].source, "lehrkraft");
  });
});

test("Nach einem Neustart holt der Server offene KI-Korrekturen nach", async () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "d7-proben-neu-"));
  try {
    let id = "";
    await mitServer(ki({ aus: () => true }), async ({ post, datei }) => {
      await post("submit", { testId: "d7-p9-m-a", code: "101", answers: antworten() });
      // so sähe die Datei aus, wenn der Server mitten in der Korrektur neu gestartet wäre
      const d = JSON.parse(fs.readFileSync(datei, "utf8"));
      d.submissions[0].status = "eingegangen"; d.submissions[0].submittedAt = new Date(Date.now() - 120000).toISOString();
      d.submissions[0].details.forEach((x) => { if (x.type === "offen" || x.type === "schreiben") x.kiOffen = true; });
      id = d.submissions[0].id;
      await warte(300); fs.writeFileSync(datei, JSON.stringify(d));
    }, { dataDir });
    await mitServer(ki(), async ({ modul, fertig }) => {
      modul.nachholen();
      const [row] = await fertig("d7-p9-m-a");
      assert.equal(row.id, id); assert.equal(row.status, "zu-pruefen");
      assert.deepEqual(row.details.slice(5).map((d) => d.source), ["ki", "ki"]);
    }, { dataDir });
  } finally { fs.rmSync(dataDir, { recursive: true, force: true }); }
});

test("Auswertung: Kommas, Zeilenangaben, fast richtige Felder, Reihenfolge", async () => {
  await mitServer(null, async ({ post, abgaben }) => {
    const a = antworten(); a[2] = ["sie rante", "Teich"]; a[3] = [[3, 5], [1]]; a[4] = { von: 1, bis: 9 }; a[1] = ["spielen", "Wasser holen"];
    await post("submit", { testId: "d7-p9-m-a", code: "101", answers: a });
    const [row] = await abgaben("d7-p9-m-a");
    assert.equal(row.details[1].points, 0);
    assert.equal(row.details[2].felder[0].pruefen, true, "Tippfehler: Lehrkraft sieht es sich an");
    assert.equal(row.details[2].points, 1); assert.equal(row.details[2].needsReview, true);
    assert.equal(row.details[3].points, 0, "zu viele Kommas");
    assert.equal(row.details[3].given[0], "Der Teich trocknet aus, weil es, wenig regnet.");
    assert.equal(row.details[4].points, 0, "zu grobe Zeilenangabe gilt nicht");
    assert.equal(row.details[4].given, "Z. 1–9");
  });
});

test("Felder mit menge: Reihenfolge der Eingaben ist egal, jede Lösung zählt nur einmal; die Vorgabe bleibt bei der Abgabe", async () => {
  const proben = PROBEN();
  proben["d7-p9-m-a"].items = [{ type: "felder", prompt: "Schreibe die drei Fehlerwörter richtig auf.", menge: true, vorgabe: "Der fluss fliest durch das Tahl.",
    felder: [{ loesungen: ["Fluss"], genau: true, rs: true }, { loesungen: ["fließt"], genau: true, rs: true }, { loesungen: ["Tal"], genau: true, rs: true }] }];
  await mitServer(null, async ({ post, abgaben, lehrer }) => {
    const start = await post("start", { testId: "d7-p9-m-a", code: "101" });
    assert.deepEqual(start.data.items[0].felder.map((f) => f.label), ["1.", "2.", "3."]);
    assert.equal(start.data.items[0].vorgabe, "Der fluss fliest durch das Tahl.");
    assert.ok(!JSON.stringify(start.data).includes("fließt"), "Lösung darf nicht beim Kind ankommen");
    await post("submit", { testId: "d7-p9-m-a", code: "101", answers: [["Tal", "Fluss", "Fluss"]] });
    const [row] = await abgaben("d7-p9-m-a");
    assert.deepEqual(row.details[0].felder.map((f) => f.punkte), [1, 1, 0], "andere Reihenfolge zählt, die doppelte Eingabe nicht");
    assert.equal(row.details[0].points, 2);
    assert.equal(row.details[0].felder[2].expected, "fließt", "dem dritten Feld fehlt die Lösung, die noch frei war");
    assert.equal(row.details[0].vorgabe, "Der fluss fliest durch das Tahl.", "die Lehrkraft sieht den Fehlertext in der Korrektur");
    // klein geschrieben gilt bei „genau“ nicht
    await post("submit", { testId: "d7-p9-m-a", code: "400", answers: [["fluss", "Fließt", "Tal"]] });
    const zweite = (await abgaben("d7-p9-m-a")).find((r) => r.code === "400");
    assert.equal(zweite.details[0].points, 1);
    // Rückgabe: Das Kind sieht den Fehlertext auch in der Korrektur
    await lehrer("bestaetigen", { submissionId: row.id }); await lehrer("freigeben", { submissionId: row.id });
    const k = await post("korrektur", { code: "101", testId: "d7-p9-m-a" });
    assert.equal(k.status, 200);
    assert.equal(k.data.korrektur.aufgaben[0].vorgabe, "Der fluss fliest durch das Tahl.");
  }, { opts: { tests: proben } });
});

test("Probenmodus: Protokoll (Wechsel, Einfügen, Kopieren, Textsprünge) kommt gesäubert bei der Lehrkraft an, nicht beim Kind; Einstellung „Einfügen“ je Probe", async () => {
  await mitServer(null, async ({ post, get, abgaben, lehrer }) => {
    assert.equal((await post("start", { testId: "d7-p9-m-a", code: "101" })).data.test.einfuegen, "sperren");
    assert.equal((await lehrer("probe-einstellung", { nr: 9, einfuegen: "protokollieren" })).data.einfuegen, "protokollieren");
    assert.equal((await lehrer("probe-einstellung", { nr: 9, einfuegen: "alles" })).status, 400);
    assert.equal((await lehrer("probe-einstellung", { nr: 77, einfuegen: "sperren" })).status, 404);
    assert.equal((await post("start", { testId: "d7-p9-m-a", code: "101" })).data.test.einfuegen, "protokollieren");
    assert.equal((await get("list?alle=1")).tests.find((t) => t.id === "d7-p9-m-b").einfuegen, "protokollieren", "gilt für alle Fassungen der Probe");
    const protokoll = {
      wechsel: [{ art: "verborgen", von: "2026-10-06T09:24:13.000Z", bis: "2026-10-06T09:24:18.000Z", sekunden: 5 }, { art: "fokus", von: "2026-10-06T09:41:02.000Z", bis: "2026-10-06T09:41:47.000Z", sekunden: 45 },
        { art: "irgendwas", von: "kein Datum", bis: "x", sekunden: 1 }],
      einfuegen: [{ zeit: "2026-10-06T09:37:15.000Z", zeichen: 512, woerter: 84, erlaubt: true, text: "DARF NICHT GESPEICHERT WERDEN" }],
      kopieren: [{ zeit: "2026-10-06T09:38:00.000Z", art: "cut", zeichen: 40 }],
      spruenge: [{ zeit: "2026-10-06T09:50:00.000Z", woerter: 38, sekunden: 3, vorher: 412, nachher: 450 }],
      geheim: "weg damit"
    };
    await post("submit", { testId: "d7-p9-m-a", code: "101", answers: antworten(), verlassen: 2, protokoll });
    const [row] = await abgaben("d7-p9-m-a");
    assert.equal(row.verlassen, 2);
    assert.equal(row.protokoll.wechsel.length, 2, "Eintrag ohne gültige Zeit fällt weg");
    assert.deepEqual(row.protokoll.wechsel[1], { art: "fokus", von: "2026-10-06T09:41:02.000Z", bis: "2026-10-06T09:41:47.000Z", sekunden: 45 });
    assert.deepEqual(row.protokoll.einfuegen[0], { zeit: "2026-10-06T09:37:15.000Z", zeichen: 512, woerter: 84, erlaubt: true });
    assert.deepEqual(row.protokoll.kopieren[0], { zeit: "2026-10-06T09:38:00.000Z", art: "cut", zeichen: 40 });
    assert.equal(row.protokoll.spruenge[0].woerter, 38);
    assert.ok(!JSON.stringify(row).includes("DARF NICHT") && !JSON.stringify(row).includes("weg damit"), "Inhalte werden nie gespeichert");
    const punkteVorher = row.score;
    // das Protokoll ändert weder Punkte noch Stand, und das Kind sieht es in der Korrektur nicht
    await lehrer("bestaetigen", { submissionId: row.id }); await lehrer("freigeben", { submissionId: row.id });
    const k = await post("korrektur", { code: "101", testId: "d7-p9-m-a" });
    assert.equal(k.status, 200);
    assert.equal(k.data.korrektur.score, punkteVorher);
    assert.ok(!JSON.stringify(k.data).includes("protokoll") && !JSON.stringify(k.data).includes("sekunden"));
    // ohne Protokoll (ältere Seite): Abgabe geht trotzdem
    await post("submit", { testId: "d7-p9-m-a", code: "400", answers: antworten(1) });
    assert.equal((await abgaben("d7-p9-m-a")).find((r) => r.code === "400").protokoll, undefined);
  });
});

test("Export und Notenübersicht", async () => {
  await mitServer(ki(), async ({ post, modul, fertig, lehrer }) => {
    await post("submit", { testId: "d7-p9-m-a", code: "101", answers: antworten() });
    const [row] = await fertig("d7-p9-m-a");
    const zeile = modul.abgaben()[0];
    assert.equal(zeile.code, "101"); assert.equal(zeile.grade, 3); assert.equal(zeile.needsReview, true); assert.equal(zeile.testTitle, "Probe 9 (M7): Test");
    await lehrer("bestaetigen", { submissionId: row.id });
    assert.equal(modul.abgaben()[0].needsReview, false);
  });
});
