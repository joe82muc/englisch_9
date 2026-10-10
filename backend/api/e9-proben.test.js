"use strict";

// Englisch 9R: Was die Proben über Deutsch 8 hinaus können (d7-proben.js mit fach Englisch) – Kennungen e9-p…,
// Hörtexte, Prüfungsteile, tolerante Notizfelder, Regeln für die KI in der Fremdsprache, Fachname in der Rückgabe.
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const { registerD7ProbenRoutes, vorbereiten } = require("./d7-proben");
const { vorschau } = require("./proben-vorschau");
const B = require("./e9-proben/bau");

const PW = "Nur-ein-Test-4711";
const KINDER = { 901: { klasse: "9b" }, 902: { klasse: "9b", lrs: true }, 911: { klasse: "9aM" }, 801: { klasse: "8b" } };
const kindZumCode = async (code) => {
  const k = KINDER[Number(code)];
  return k ? { code: String(code).padStart(3, "0"), klasse: k.klasse, zug: /M$/.test(k.klasse) ? k.klasse[0] + "M" : k.klasse[0] + "R", lrs: Boolean(k.lrs) } : null;
};
const PROBEN = () => ({
  "e9-p9-r-a": B.probe(9, "A", {
    title: "Probe 9 (R9): Test", minutes: 45,
    texte: [
      B.hoertext("h1", "At the station", "Listening: announcement", [["Speaker", "The train to the coast leaves at half past nine. Please go to platform four."], ["Girl", "Thank you. Is there a café on the train?"]], { stimmen: { Speaker: "en-GB-RyanNeural", Girl: "en-GB-LibbyNeural" } }),
      B.text("t1", "A short text", "Article", ["Lena works in a small bike shop every Saturday. She repairs old bikes and sells them."])
    ],
    items: [
      ...B.teil("A Listening", [
        B.c("When does the train leave?", ["at half past nine", "at nine", "at ten"], 0, { text: "h1" }),
        B.f("Complete the notes.", [B.feld("Platform", ["four", "4"]), B.feld("The train goes to the …", ["coast"], { tolerant: true }), B.feld("On the train: a …", ["restaurant car"], { tolerant: true })], { text: "h1" })
      ]),
      ...B.teil("B Reading", [
        B.a("What does Lena do in the shop? Answer in English.", [B.kr("nennt reparieren und verkaufen", 2, "She repairs and sells bikes.")], "She repairs old bikes and sells them.", ["repair", "sell"], { text: "t1" })
      ]),
      ...B.teil("E Writing", [
        B.s("Write an email to a friend about your weekend (about 60 words).", [B.kr("Inhalt", 4, "Wochenende, zwei Erlebnisse"), B.kr("Sprache", 3, "verständlich, simple past"), B.kr("Rechtschreibung", 1, "", { rs: true })], { minWoerter: 20 })
      ])
    ]
  })
});
const MAIL = "Hi Tom, last weekend I went to the lake with my family. We swam and played football. On Sunday I visited my grandma and we baked a cake. It was great. See you soon, Alex";
const warte = (ms) => new Promise((ok) => setTimeout(ok, ms));
const ki = (merk = {}) => async (system, user) => {
  merk.system = (merk.system || []).concat(system); merk.user = (merk.user || []).concat(user);
  const a = JSON.parse(user);
  if (a.erwartungshorizont.length === 3) return JSON.stringify({ punkte: [3, 2, 1], begruendung: ["Du erzählst zwei Erlebnisse.", "Das simple past stimmt meist.", "Fast keine Fehler."], gelungen: ["went to the lake – richtige Form."], arbeiten: ["Schreibe einen Schlusssatz mehr."], hinweis: "Nutze ein Zeitwort mehr.", kategorien: [], markierungen: [{ stelle: "baked a cake", art: "gelungen", hinweis: "Passendes Verb." }] });
  return JSON.stringify({ punkte: [2], korrektur: "Beides steht in deiner Antwort.", hinweis: "", kategorie: "" });
};

async function mitServer(lauf, merk) {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "e9-proben-"));
  const app = express();
  app.use(express.json());
  const modul = registerD7ProbenRoutes(app, { dataDir, prefix: "/api/e9/proben", datei: "e9-proben.json", stufe: 9, fach: { kurz: "e", name: "Englisch" }, sitzung: true, marken: true,
    teacherPassword: PW, kindZumCode, tests: PROBEN(), askAnthropic: ki(merk), kiPauseMs: 40, nachholenMs: 0 });
  const server = await new Promise((resolve) => { const s = app.listen(0, () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (route, body) => fetch(base + "/api/e9/proben/" + route, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
    .then(async (r) => ({ status: r.status, data: await r.json().catch(() => null) }));
  const get = (route) => fetch(base + "/api/e9/proben/" + route).then((r) => r.json());
  const lehrer = (route, body) => post("teacher/" + route, { password: PW, ...body });
  const fertig = async (testId) => { for (let i = 0; i < 600; i++) { const r = (await lehrer("results", { testId })).data.submissions; if (r.length && r.every((x) => x.status !== "eingegangen")) return r; await warte(25); } throw new Error("KI wurde nicht fertig"); };
  try {
    assert.equal((await lehrer("unlock", { testId: "e9-p9-r-a", open: true })).status, 200);
    await lauf({ post, get, lehrer, fertig, modul, dataDir });
  } finally {
    await new Promise((resolve) => server.close(resolve));
    fs.rmSync(dataDir, { recursive: true, force: true });
  }
}

test("Kennungen: Englisch 9 nimmt e9-p…, nicht d9-p…; Deutsch bleibt bei d…; Hörtext ohne Sprecher oder mit zu langem Satz fällt auf", () => {
  assert.doesNotThrow(() => vorbereiten(PROBEN(), 9, "e"));
  assert.throws(() => vorbereiten(PROBEN(), 9), /Kennung/);
  assert.throws(() => vorbereiten({ x: { id: "d9-p1-r-a", texte: [], items: [] } }, 9, "e"), /Kennung/);
  const leer = PROBEN(); leer["e9-p9-r-a"].texte[0].sprecher = [];
  assert.throws(() => vorbereiten(leer, 9, "e"), /sprecher fehlt/);
  const lang = PROBEN(); lang["e9-p9-r-a"].texte[0].sprecher[0].text = "This sentence is much too long " + "and goes on ".repeat(20) + "until the end.";
  assert.throws(() => vorbereiten(lang, 9, "e"), /220 Zeichen/);
  const p = vorbereiten(PROBEN(), 9, "e")["e9-p9-r-a"];
  assert.equal(p.texte[0].typ, "hoertext"); assert.equal(p.texte[0].mal, 2);
  assert.equal(p.items[0].teil, "A Listening"); assert.equal(p.items[3].teil, "E Writing");
});

test("Start: Hörtext mit Sprechern, Stimmen und Zahl der Durchgänge, Prüfungsteile an den Aufgaben, keine Lösungen", async () => {
  await mitServer(async ({ post, get }) => {
    assert.equal((await get("health")).service, "e9-proben");
    const start = await post("start", { testId: "e9-p9-r-a", code: "901" });
    assert.equal(start.status, 200);
    const h = start.data.texte[0];
    assert.equal(h.typ, "hoertext"); assert.equal(h.mal, 2); assert.equal(h.sprecher.length, 2); assert.equal(h.stimmen.Girl, "en-GB-LibbyNeural"); assert.equal(h.sprache, "en");
    assert.deepEqual(start.data.items.map((i) => i.teil), ["A Listening", "A Listening", "B Reading", "E Writing"]);
    assert.ok(!JSON.stringify(start.data.items).includes("restaurant car"), "Lösungen bleiben auf dem Server");
    assert.ok(start.data.sitzung && start.data.sitzung.minuten === 45, "Sitzung mit Zeit wie bei Deutsch 8");
    // nur 9. Klassen im R-Zug
    assert.equal((await post("start", { testId: "e9-p9-r-a", code: "911" })).data.error, "falscher_zug");
    assert.equal((await post("start", { testId: "e9-p9-r-a", code: "801" })).data.error, "falsche_stufe");
  });
});

test("Abgabe: tolerante Notizfelder, KI mit den Regeln für die Fremdsprache und dem Hörtext, Rückgabe nennt „Englisch 9“", async () => {
  const merk = {};
  await mitServer(async ({ post, lehrer, fertig }) => {
    const antworten = [0, ["4", "coasst", "restorant car"], "She repairs bikes and sells them.", MAIL];
    assert.equal((await post("start", { testId: "e9-p9-r-a", code: "901" })).status, 200);
    const ab = await post("submit", { testId: "e9-p9-r-a", code: "901", answers: antworten });
    assert.equal(ab.status, 200); assert.equal(ab.data.angekommen, true);
    const [row] = await fertig("e9-p9-r-a");
    const felder = row.details[1].felder;
    assert.deepEqual(felder.map((f) => f.punkte), [1, 1, 1], "ein Tippfehler in coast (5 Buchstaben) und zwei in restaurant car zählen nicht");
    assert.equal(row.details[1].teil, "A Listening");
    assert.equal(row.details[2].points, 2); assert.equal(row.details[3].points, 6);
    // die KI: Regeln der Fremdsprache und – bei Aufgaben zum Hörtext – die Mitschrift
    const system = merk.system.join("\n");
    assert.match(system, /Englisch-Probe der 9\. Klasse/);
    assert.match(system, /Sprachmittlung ist keine Übersetzung/);
    assert.match(system, /Rückmeldung schreibst du auf Deutsch/);
    assert.ok(merk.user.some((u) => /repairs old bikes/.test(u)), "der Lesetext geht als Ausschnitt mit");
    // bestätigen, freigeben, Kind sieht die Korrektur mit Fachnamen und Teilen
    assert.equal((await lehrer("bestaetigen", { submissionId: row.id })).status, 200);
    assert.equal((await lehrer("freigeben", { submissionIds: [row.id] })).status, 200);
    const k = await post("korrektur", { code: "901", testId: "e9-p9-r-a" });
    assert.equal(k.status, 200);
    const korrektur = k.data.korrektur || k.data;
    assert.equal(korrektur.fach, "Englisch 9"); assert.equal(korrektur.stufe, 9);
    assert.deepEqual(korrektur.aufgaben.map((a) => a.teil), ["A Listening", "A Listening", "B Reading", "E Writing"]);
    assert.equal(korrektur.texte[0].typ, "hoertext");
  }, merk);
});

test("Notenschutz: Rechtschreibzeile im Schreibraster zählt beim Kind mit LRS nicht; strenges Feld bleibt streng", async () => {
  await mitServer(async ({ post, fertig }) => {
    assert.equal((await post("start", { testId: "e9-p9-r-a", code: "902" })).status, 200);
    assert.equal((await post("submit", { testId: "e9-p9-r-a", code: "902", answers: [0, ["for", "coast", "restaurant car"], "She repairs bikes and sells them.", MAIL] })).status, 200);
    const [row] = await fertig("e9-p9-r-a");
    assert.equal(row.details[1].felder[0].punkte, 0, "„for“ statt „four“: kurzes Wort ohne Toleranz");
    assert.equal(row.total, 1 + 3 + 2 + 7, "die Rechtschreibzeile (1 Punkt) fehlt in der Höchstpunktzahl");
  });
});

test("Vorschau für die Lehrkraft: Hörtext mit Mitschrift, Prüfungsteile als Abschnitte", () => {
  const p = vorbereiten(PROBEN(), 9, "e")["e9-p9-r-a"], v = vorschau("deutsch", p);
  assert.equal(v.texte[0].typ, "hoertext"); assert.equal(v.texte[0].sprecher[1].rolle, "Girl"); assert.equal(v.texte[0].mal, 2);
  assert.deepEqual(v.items.map((a) => a.abschnitt), ["A Listening", "A Listening", "B Reading", "E Writing"]);
  assert.equal(v.total, 1 + 3 + 2 + 8);
});
