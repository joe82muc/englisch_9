"use strict";

// NT 8: Proben über die NT-7-Module mit eigenem Präfix – dazu Sitzung (Beginn und Zwischenstand auf dem Server),
// weitere Aufgabenarten, Nachschreibproben und Korrektur jeder Aufgabe durch die Lehrkraft.
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const { registerNt7Routes } = require("./nt7");
const { TITEL, BEREICHE } = require("./nt8-module");
const { ABGABE_ROUTEN } = require("./probe-kind");
const { KURSE } = require("./nt9-fortschritt");

const PW = "lehrer-geheim";
const kindZumCode = async (code) => (code === "111" ? { code: "111", klasse: "8aM", zug: "8M" }
  : code === "222" ? { code: "222", klasse: "8d", zug: "8R" } : code === "333" ? { code: "333", klasse: "8d", zug: "8R" }
  : code === "777" ? { code: "777", klasse: "7b", zug: "7R" } : null);

const aufgaben = () => [
  { type: "choice", modul: "magnetismus", prompt: "Welcher Stoff wird von einem Magneten angezogen?", options: ["Eisen", "Holz", "Glas", "Kupfer"], answer: 0, points: 1, kompetenz: "fachwissen" },
  { type: "multi", modul: "elektromagnet", prompt: "Was macht einen Elektromagneten stärker?", options: ["mehr Windungen", "größere Stromstärke", "ein Kern aus Holz", "ein längeres Kabel zur Batterie"], answers: [0, 1], points: 2 },
  { type: "number", modul: "generator-trafo", prompt: "Berechne die Spannung an der Sekundärspule.", answer: 46, tolerance: 0.5, unit: "V", units: ["A", "V", "W"], points: 2, arten: ["rechnen"] },
  { type: "gaps", modul: "induktion", prompt: "Ergänze den Satz.", text: "Bewegt man einen {1} in einer Spule, entsteht eine {2}.", gaps: [["Magneten", "Holzstab", "Glasstab"], ["Spannung", "Wärme", "Farbe"]], points: 2 },
  { type: "tf", modul: "magnetismus", prompt: "Richtig oder falsch?", statements: [["Gleiche Pole stoßen sich ab.", true], ["Ein Magnet hat nur einen Pol.", false]], points: 2 },
  { type: "labor", modul: "elektromagnet", prompt: "Baue einen möglichst starken Elektromagneten.", labor: { art: "elektromagnet", modus: "bau" },
    regeln: [{ text: "Der Strom ist eingeschaltet.", wenn: { an: true } }, { text: "Der Eisenkern steckt in der Spule.", wenn: { kern: true } }, { text: "Die Spule hat mindestens 200 Windungen.", wenn: { n: { min: 200 } } }], points: 3 },
  { type: "text", modul: "induktion", transfer: true, prompt: "Erkläre, warum beim schnellen Bewegen des Magneten eine größere Spannung gemessen wird.",
    expected: "Das Magnetfeld in der Spule ändert sich schneller, deshalb ist die Induktionsspannung größer.",
    criteria: ["Magnetfeld in der Spule ändert sich", "schnellere Änderung", "größere Induktionsspannung"], keywords: ["magnetfeld", "schnell", "spannung"], points: 3,
    labor: { art: "induktion", modus: "film", text: "Ein Stabmagnet wird erst langsam, dann schnell in eine Spule geschoben; der Zeiger schlägt beim zweiten Mal weiter aus." },
    tabelle: { kopf: ["Bewegung", "Ausschlag"], zeilen: [["langsam", "2"], ["schnell", "6"]] } }
];
const eigene = () => ({
  "nt8-x-r-a": { id: "nt8-x-r-a", zug: "R", variante: "A", gruppe: "nt8-x-r", thema: "magnet", minutes: 35, title: "Testprobe (8R)", scope: "Test", items: aufgaben() },
  "nt8-x-r-b": { id: "nt8-x-r-b", zug: "R", variante: "B", gruppe: "nt8-x-r", thema: "magnet", minutes: 35, title: "Testprobe (8R) – Nachschreibprobe", scope: "Test", items: aufgaben() }
});
const RICHTIG = [0, [0, 1], { wert: "46", einheit: "V" }, ["Magneten", "Spannung"], [true, false],
  { zustand: { an: true, kern: true, n: 300, geheim: { tief: 1 } }, text: "Strom an, Eisenkern, 300 Windungen" },
  "Das Magnetfeld in der Spule ändert sich schneller, darum ist die Spannung größer."];

async function mitServer(lauf, tests, zusatz) {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "nt8-test-"));
  const app = express();
  app.use(express.json());
  registerNt7Routes(app, { dataDir, teacherPassword: PW, kindZumCode, prefix: "/api/nt8", datei: "nt8-proben.json", tests: tests || eigene(),
    fach: "Natur-und-Technik", stufe: 8, service: "nt8-proben", erweitert: true, sitzung: true, ...(zusatz || {}) });
  const server = await new Promise((resolve) => { const s = app.listen(0, () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (route, body) => fetch(base + route, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
    .then(async (r) => ({ status: r.status, data: await r.json().catch(() => null) }));
  try { await lauf({ base, post, dataDir }); }
  finally { await new Promise((resolve) => server.close(resolve)); fs.rmSync(dataDir, { recursive: true, force: true }); }
}

test("NT 8 ist als Kurs bekannt, die Abgabe nennt dem Kind kein Ergebnis", () => {
  assert.ok(KURSE.some((k) => k.id === "nt8" && k.stufe === 8 && k.zuege.join("") === "MR"), "Lernstand kennt den Kurs nt8");
  assert.ok(ABGABE_ROUTEN.includes("/api/nt8/submit"), "Note erst nach der Rückgabe gilt auch für NT 8");
  Object.values(BEREICHE).forEach((module) => module.forEach((m) => assert.ok(TITEL[m], "Titel fehlt: " + m)));
  assert.equal(Object.keys(TITEL).length, [].concat(...Object.values(BEREICHE)).length, "jedes Modul steht in genau einem Bereich");
});

test("Liste und Start: Variante, keine Lösungen, Sitzung beginnt auf dem Server", async () => {
  await mitServer(async ({ base, post }) => {
    const liste = (await (await fetch(base + "/api/nt8/list")).json()).tests;
    assert.deepEqual(liste.map((t) => [t.id, t.zug, t.variante, t.gruppe, t.maxPoints, t.unlocked]),
      [["nt8-x-r-a", "R", "A", "nt8-x-r", 15, false], ["nt8-x-r-b", "R", "B", "nt8-x-r", 15, false]]);
    assert.equal((await post("/api/nt8/start", { testId: "nt8-x-r-a", code: "222" })).status, 403, "gesperrt");
    await post("/api/nt8/teacher/unlock", { password: PW, testId: "nt8-x-r-a", open: true });
    assert.equal((await post("/api/nt8/start", { testId: "nt8-x-r-a", code: "111" })).data.error, "falscher_zug");
    assert.equal((await post("/api/nt8/start", { testId: "nt8-x-r-a", code: "777" })).data.error, "falsche_stufe");
    const s = (await post("/api/nt8/start", { testId: "nt8-x-r-a", code: "222" })).data;
    assert.equal(s.test.variante, "A");
    assert.ok(s.sitzung && s.sitzung.begonnenAm && s.sitzung.minuten === 35 && !s.zwischenstand, "Sitzung beginnt, noch kein Zwischenstand");
    assert.equal(Date.parse(s.sitzung.endetAm) - Date.parse(s.sitzung.begonnenAm), 35 * 60000);
    const text = JSON.stringify(s.items);
    ["answer", "answers", "expected", "criteria", "keywords", "regeln", "\"gaps\":", "\"wenn\""].forEach((w) => assert.ok(!text.includes(w), "verrät nichts: " + w));
    const [, multi, zahl, luecke, rf, bau, frei] = s.items;
    assert.ok(!/true|false/.test(JSON.stringify(rf)), "Richtig/Falsch: nur die Aussagen");
    assert.ok(!/"unit":/.test(JSON.stringify(zahl)), "Zahl mit Einheitenauswahl: die richtige Einheit steht nicht dabei");
    assert.equal(multi.options.length, 4);
    assert.deepEqual(zahl.units, ["A", "V", "W"]);
    assert.equal(luecke.gapText, "Bewegt man einen {1} in einer Spule, entsteht eine {2}.");
    assert.deepEqual(luecke.gapOptions, [["Glasstab", "Holzstab", "Magneten"], ["Farbe", "Spannung", "Wärme"]], "Auswahl nach dem Alphabet");
    assert.deepEqual(rf.statements, ["Gleiche Pole stoßen sich ab.", "Ein Magnet hat nur einen Pol."]);
    assert.deepEqual(bau.labor, { art: "elektromagnet", modus: "bau" });
    assert.ok(frei.labor && frei.tabelle && frei.transfer && frei.modul === "induktion");
    assert.equal(s.items[0].kompetenz, "fachwissen");
  });
});

test("Zwischenstand: Neuladen beginnt nicht neu, Abgabe wertet alle Aufgabenarten", async () => {
  await mitServer(async ({ post, dataDir }) => {
    await post("/api/nt8/teacher/unlock", { password: PW, testId: "nt8-x-r-a", open: true });
    assert.equal((await post("/api/nt8/zwischenstand", { testId: "nt8-x-r-a", code: "222", answers: RICHTIG })).status, 409, "ohne Beginn kein Zwischenstand");
    const s1 = (await post("/api/nt8/start", { testId: "nt8-x-r-a", code: "222" })).data;
    const teil = [0, [0], null, ["Magneten", ""], [true, null], null, "Das Magnet"];
    const z = await post("/api/nt8/zwischenstand", { testId: "nt8-x-r-a", code: "222", answers: teil, verlassen: 1,
      protokoll: { wechsel: [{ art: "verborgen", von: "2026-10-08T08:00:00.000Z", bis: "2026-10-08T08:00:18.000Z", sekunden: 18 }] } });
    assert.equal(z.status, 200); assert.ok(z.data.gespeichertAm);
    assert.equal((await post("/api/nt8/zwischenstand", { testId: "nt8-x-r-a", code: "222", answers: [1, 2] })).status, 400);
    // Die Lehrkraft sperrt – wer begonnen hat, schreibt weiter
    await post("/api/nt8/teacher/unlock", { password: PW, testId: "nt8-x-r-a", open: false });
    assert.equal((await post("/api/nt8/start", { testId: "nt8-x-r-a", code: "333" })).status, 403, "wer nicht begonnen hat, kommt nicht mehr hinein");
    const s2 = (await post("/api/nt8/start", { testId: "nt8-x-r-a", code: "222" })).data;
    assert.equal(s2.sitzung.begonnenAm, s1.sitzung.begonnenAm, "die Zeit läuft weiter");
    assert.equal(s2.sitzung.fortgesetzt, 1);
    assert.deepEqual(s2.zwischenstand.answers, [0, [0], null, ["Magneten", ""], [true, null], null, "Das Magnet"]);
    const lauf = (await post("/api/nt8/teacher/sitzungen", { password: PW })).data.sitzungen;
    assert.deepEqual(lauf.map((x) => [x.code, x.klasse, x.beantwortet, x.aufgaben, x.verlassen, x.fortgesetzt]), [["222", "8d", 5, 7, 1, 1]]);
    assert.equal((await post("/api/nt8/teacher/sitzungen", { password: "falsch" })).status, 401);
    // Vorschau für die Lehrkraft: Aufgaben mit Lösungen – nur mit Passwort
    const vor = await post("/api/nt8/teacher/vorschau", { password: PW, testId: "nt8-x-r-a" });
    assert.equal(vor.status, 200);
    assert.equal(vor.data.items.length, 7);
    assert.ok(vor.data.items.some((it) => it.expected) && vor.data.items.some((it) => Number.isInteger(it.answer)), "Vorschau enthält Erwartungshorizont und Schlüssel");
    assert.equal(vor.data.total, vor.data.items.reduce((s, it) => s + it.points, 0));
    assert.equal((await post("/api/nt8/teacher/vorschau", { password: "falsch", testId: "nt8-x-r-a" })).status, 401, "Vorschau nur mit Passwort");
    assert.equal((await post("/api/nt8/teacher/vorschau", { password: PW, testId: "gibt-es-nicht" })).status, 404);

    const ab = await post("/api/nt8/submit", { testId: "nt8-x-r-a", code: "222", answers: RICHTIG, verlassen: 1 });
    assert.equal(ab.status, 200);
    assert.equal((await post("/api/nt8/teacher/sitzungen", { password: PW })).data.sitzungen.length, 0, "Sitzung ist beendet");
    const [row] = (await post("/api/nt8/teacher/results", { password: PW })).data.submissions;
    assert.deepEqual(row.details.map((d) => d.points), [1, 2, 2, 2, 2, 3, 3], "volle Punkte (freie Antwort nach Stichwörtern)");
    assert.deepEqual([row.score, row.total, row.variante, row.nachSperre, row.fortgesetzt], [15, 15, "A", true, 1]);
    assert.ok(row.begonnenAm === s1.sitzung.begonnenAm && row.dauerSek >= 0);
    assert.equal(row.details[2].given, "46 V"); assert.equal(row.details[2].expected, "46 V");
    assert.deepEqual(row.details[5].zustand, { an: true, kern: true, n: 300 }, "nur flache Angaben des Endzustands");
    assert.deepEqual(row.details[5].regeln.map((r) => r.ok), [true, true, true]);
    assert.ok(row.details[6].tabelle && row.details[6].labor && row.details[6].needsReview, "Darstellung und Prüfvermerk stehen bei der Abgabe");
    assert.equal(row.details[0].kompetenz, "fachwissen");
    assert.ok(fs.existsSync(path.join(dataDir, "nt8-proben.json")) && fs.existsSync(path.join(dataDir, "nt8-proben-sitzungen.json")));
    assert.equal((await post("/api/nt8/start", { testId: "nt8-x-r-a", code: "222" })).status, 409, "schon abgegeben");
  });
});

test("Teilpunkte und Abzüge: falsche Kreuze, falsche Einheit, unfertiger Aufbau", async () => {
  await mitServer(async ({ post }) => {
    await post("/api/nt8/teacher/unlock", { password: PW, testId: "nt8-x-r-a", open: true });
    await post("/api/nt8/start", { testId: "nt8-x-r-a", code: "333" });
    const antworten = [2, [0, 1, 2], { wert: "46,4", einheit: "A" }, ["Holzstab", "Spannung"], [true, true],
      { zustand: { an: true, kern: false, n: 100 }, text: "Strom an, ohne Kern, 100 Windungen" }, ""];
    assert.equal((await post("/api/nt8/submit", { testId: "nt8-x-r-a", code: "333", answers: antworten })).status, 200);
    const [row] = (await post("/api/nt8/teacher/results", { password: PW })).data.submissions;
    assert.deepEqual(row.details.map((d) => d.points), [0, 1, 1, 1, 1, 1, 0]);
    assert.deepEqual(row.details[5].regeln.map((r) => r.ok), [true, false, false]);
  });
});

test("Nachschreibprobe: Wer Variante A abgegeben hat, kann B nicht beginnen", async () => {
  await mitServer(async ({ post }) => {
    await post("/api/nt8/teacher/unlock", { password: PW, testId: "nt8-x-r-a", open: true });
    await post("/api/nt8/teacher/unlock", { password: PW, testId: "nt8-x-r-b", open: true });
    await post("/api/nt8/start", { testId: "nt8-x-r-a", code: "222" });
    await post("/api/nt8/submit", { testId: "nt8-x-r-a", code: "222", answers: RICHTIG });
    assert.equal((await post("/api/nt8/start", { testId: "nt8-x-r-b", code: "222" })).data.error, "already_submitted");
    const b = await post("/api/nt8/start", { testId: "nt8-x-r-b", code: "333" });
    assert.equal(b.status, 200); assert.equal(b.data.test.variante, "B");
  });
});

test("Lehrkraft: jede Aufgabe ändern, bestätigen, Zwischenstand als Abgabe übernehmen", async () => {
  await mitServer(async ({ post }) => {
    await post("/api/nt8/teacher/unlock", { password: PW, testId: "nt8-x-r-a", open: true });
    await post("/api/nt8/start", { testId: "nt8-x-r-a", code: "222" });
    await post("/api/nt8/submit", { testId: "nt8-x-r-a", code: "222", answers: RICHTIG });
    let [row] = (await post("/api/nt8/teacher/results", { password: PW })).data.submissions;
    // Ankreuzaufgabe ändern (bei NT 7 nicht möglich, bei NT 8 schon)
    let r = await post("/api/nt8/teacher/override", { password: PW, submissionId: row.id, nr: 1, points: 0, comment: "Im Unterricht anders besprochen.", tipp: "Wiederhole Station 2." });
    assert.equal(r.status, 200); assert.equal(r.data.score, 14);
    assert.equal((await post("/api/nt8/teacher/override", { password: PW, submissionId: row.id, nr: 1, points: 5 })).status, 400, "nicht über die Höchstpunktzahl");
    r = await post("/api/nt8/teacher/bestaetigen", { password: PW, submissionId: row.id, kommentar: "Gut gemacht." });
    assert.ok(r.data.bestaetigtAm);
    [row] = (await post("/api/nt8/teacher/results", { password: PW })).data.submissions;
    assert.deepEqual([row.details[0].source, row.details[0].tipp, row.details[0].vorschlag, row.needsReview, row.kommentar],
      ["lehrkraft", "Wiederhole Station 2.", { points: 1, source: "schluessel" }, false, "Gut gemacht."]);
    // erneute Änderung nimmt die Bestätigung zurück
    await post("/api/nt8/teacher/override", { password: PW, submissionId: row.id, nr: 7, points: 2 });
    [row] = (await post("/api/nt8/teacher/results", { password: PW })).data.submissions;
    assert.equal(row.bestaetigtAm, undefined);
    // ohne KI-Schlüssel bleibt „neu bewerten“ bei der Stichwortauswertung
    r = await post("/api/nt8/teacher/neu-bewerten", { password: PW, submissionId: row.id, nr: 7 });
    assert.equal(r.status, 200); assert.equal(r.data.ki, false); assert.equal(r.data.detail.points, 3);
    assert.equal((await post("/api/nt8/teacher/neu-bewerten", { password: PW, submissionId: row.id, nr: 1 })).status, 404, "nur freie Antworten");

    // Gerät ausgefallen: Die Lehrkraft übernimmt den gesicherten Zwischenstand
    await post("/api/nt8/start", { testId: "nt8-x-r-a", code: "333" });
    await post("/api/nt8/zwischenstand", { testId: "nt8-x-r-a", code: "333", answers: [0, [0, 1], null, null, null, null, ""] });
    r = await post("/api/nt8/teacher/sitzung-abgeben", { password: PW, testId: "nt8-x-r-a", code: "333" });
    assert.equal(r.status, 200);
    const alle = (await post("/api/nt8/teacher/results", { password: PW })).data.submissions;
    const kind = alle.find((x) => x.code === "333");
    assert.deepEqual([kind.vonLehrkraft, kind.score, kind.className, kind.zug], [true, 3, "8d", "R"]);
    assert.equal((await post("/api/nt8/teacher/sitzung-abgeben", { password: PW, testId: "nt8-x-r-a", code: "333" })).status, 404, "Zwischenstand ist verbraucht");
  });
});

// Die echten Proben (nt8-block-*.js, über nt8-fragen.js geladen und gemischt): Aufbau und Lösungsschlüssel
const ECHTE = require("./nt8-fragen");
function musterAntwort(item) {
  if (item.type === "choice") return item.answer;
  if (item.type === "multi") return item.answers;
  if (item.type === "match") return item.pairs.map((p) => p[1]);
  if (item.type === "order") return item.steps;
  if (item.type === "gaps") return item.gaps.map((g) => g[0]);
  if (item.type === "tf") return item.statements.map((s) => s[1]);
  if (item.type === "number") return { wert: String(item.answer).replace(".", ","), einheit: item.unit };
  if (item.type === "labor") {
    const z = {};
    (item.regeln || []).forEach((r) => Object.keys(r.wenn).forEach((k) => { const v = r.wenn[k]; z[k] = v && typeof v === "object" ? (Array.isArray(v.in) ? v.in[0] : v.min !== undefined ? v.min : v.max) : v; }));
    return { zustand: z, text: "Musteraufbau" };
  }
  return item.expected;
}
test("KI-Vorkorrektur: Vorschlag nach dem Erwartungshorizont, Punkte begrenzt, ohne Daten des Kindes – die Lehrkraft entscheidet", async () => {
  const anfragen = [];
  // Die KI ist hier ein Platzhalter: Sie bekommt genau das, was der Server ihr schickt, und antwortet mit zu vielen Punkten.
  const askAnthropic = async (system, user) => {
    anfragen.push({ system, user: JSON.parse(user) });
    return "Bewertung: {\"points\": 9, \"comment\": \"Du nennst das Magnetfeld und die schnellere Änderung.\", \"tipp\": \"Nenne auch die größere Spannung.\"}";
  };
  const vorher = process.env.ANTHROPIC_API_KEY; process.env.ANTHROPIC_API_KEY = "nur-ein-test";
  try {
    await mitServer(async ({ post }) => {
      await post("/api/nt8/teacher/unlock", { password: PW, testId: "nt8-x-r-a", open: true });
      await post("/api/nt8/start", { testId: "nt8-x-r-a", code: "222" });
      const ab = await post("/api/nt8/submit", { testId: "nt8-x-r-a", code: "222", answers: RICHTIG });
      assert.equal(ab.status, 200);   // (was das Kind davon sieht, regelt probe-kind.js für alle Proben: nur „Abgegeben!“)
      let frei = null;
      for (let n = 0; n < 40 && !(frei && frei.source === "ki"); n++) {     // die KI wird nach der Abgabe im Hintergrund gefragt
        await new Promise((r) => setTimeout(r, 100));
        frei = (await post("/api/nt8/teacher/results", { password: PW })).data.submissions[0].details[6];
      }
      assert.equal(frei.source, "ki", "freie Antwort trägt den KI-Vorschlag");
      assert.equal(frei.points, 3, "mehr als die Höchstpunktzahl gibt es nicht (9 → 3)");
      assert.match(frei.comment, /Magnetfeld/);
      assert.match(frei.tipp, /Spannung/);
      assert.equal(anfragen.length, 1, "nur die freie Antwort geht an die KI");
      const a = anfragen[0];
      assert.match(a.system, /Regelklasse R8/);
      assert.match(a.system, /Vorschlag/);
      assert.deepEqual(a.user.erwartungshorizont, ["Magnetfeld in der Spule ändert sich", "schnellere Änderung", "größere Induktionsspannung"]);
      assert.equal(a.user.hoechstpunkte, 3);
      assert.match(a.user.angaben, /Tabelle: Bewegung \| Ausschlag/);
      assert.ok(!/222|8d|lehrer-geheim/.test(JSON.stringify(a)), "kein Code, keine Klasse, kein Passwort in der Anfrage an die KI");
      // Die Lehrkraft entscheidet: Punkte ändern, der Vorschlag der KI bleibt als Vorschlag stehen
      const [row] = (await post("/api/nt8/teacher/results", { password: PW })).data.submissions;
      await post("/api/nt8/teacher/override", { password: PW, submissionId: row.id, nr: frei.nr, points: 2, comment: "Die Spannung fehlt." });
      const danach = (await post("/api/nt8/teacher/results", { password: PW })).data.submissions[0].details[6];
      assert.equal(danach.points, 2);
      assert.equal(danach.source, "lehrkraft");
      assert.deepEqual(danach.vorschlag, { points: 3, source: "ki" });
    }, null, { askAnthropic });
  } finally { if (vorher === undefined) delete process.env.ANTHROPIC_API_KEY; else process.env.ANTHROPIC_API_KEY = vorher; }
});

test("Echte Proben: vier Fassungen je Bereich, jede Aufgabe mit Modul aus ihrem Bereich, A und B gleich viele Punkte", () => {
  const ids = Object.keys(ECHTE);
  ids.forEach((id) => {
    const p = ECHTE[id], m = /^nt8-([a-z]+)-([rm])-([ab])$/.exec(id);
    assert.ok(m && BEREICHE[m[1]], "Kennung " + id);
    assert.deepEqual([p.id, p.zug, p.variante, p.gruppe, p.thema], [id, m[2].toUpperCase(), m[3].toUpperCase(), "nt8-" + m[1] + "-" + m[2], m[1]]);
    assert.ok(p.minutes >= 30 && p.minutes <= 40, id + ": mindestens 30 Minuten");
    p.items.forEach((item, i) => {
      assert.ok(BEREICHE[m[1]].includes(item.modul) && item.modulTitel === TITEL[item.modul], id + " Aufgabe " + (i + 1) + ": Modul " + item.modul);
      assert.ok(Number.isInteger(item.points) && item.points >= 1, id + " Aufgabe " + (i + 1) + ": Punkte");
    });
    const partner = ECHTE[id.slice(0, -1) + (m[3] === "a" ? "b" : "a")];
    assert.ok(partner, id + ": die andere Variante fehlt");
    const summe = (x) => x.items.reduce((n, it) => n + it.points, 0);
    assert.equal(summe(p), summe(partner), id + ": A und B haben dieselbe Gesamtpunktzahl");
  });
  assert.equal(ids.length % 4, 0, "je Bereich vier Fassungen");
});
test("Echte Proben: Die Musterantworten ergeben in jeder Fassung volle Punkte (Schlüssel und Stichwörter stimmen)", async () => {
  const ids = Object.keys(ECHTE);
  if (!ids.length) return;
  await mitServer(async ({ post }) => {
    for (const id of ids) {
      const code = ECHTE[id].zug === "M" ? "111" : "222";
      await post("/api/nt8/teacher/unlock", { password: PW, testId: id, open: true });
      const start = await post("/api/nt8/start", { testId: id, code });
      assert.equal(start.status, 200, id + ": Start");
      assert.ok(!/"(answer|answers|expected|criteria|keywords|regeln)":/.test(JSON.stringify(start.data.items)), id + ": keine Lösungen an das Kind");
      const ab = await post("/api/nt8/submit", { testId: id, code, answers: ECHTE[id].items.map(musterAntwort) });
      assert.equal(ab.status, 200, id + ": Abgabe");
      const row = (await post("/api/nt8/teacher/results", { password: PW, testId: id })).data.submissions[0];
      const fehlt = row.details.filter((d) => d.points !== d.maxPoints).map((d) => d.nr + " (" + d.type + ": " + d.points + "/" + d.maxPoints + ")");
      assert.deepEqual(fehlt, [], id + ": diese Aufgaben erreichen mit der Musterantwort nicht die volle Punktzahl");
      // Platz für die nächste Fassung desselben Kindes (gleiche Gruppe): Abgabe löschen
      await post("/api/nt8/teacher/delete", { password: PW, submissionId: row.id });
    }
  }, ECHTE);
});

test("NT 7 bleibt, wie es war: keine Sitzung, nur freie Antworten änderbar", async () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "nt8-test-"));
  const app = express();
  app.use(express.json());
  const alt = { "nt7-x": { id: "nt7-x", minutes: 15, title: "Alt", scope: "Test", items: [{ type: "choice", prompt: "Frage", options: ["A", "B"], answer: 1, points: 1 }] } };
  registerNt7Routes(app, { dataDir, teacherPassword: PW, kindZumCode, tests: alt });
  const server = await new Promise((resolve) => { const s = app.listen(0, () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (route, body) => fetch(base + route, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
    .then(async (r) => ({ status: r.status, data: await r.json().catch(() => null) }));
  try {
    await post("/api/nt7/teacher/unlock", { password: PW, testId: "nt7-x", open: true });
    const s = (await post("/api/nt7/start", { testId: "nt7-x", code: "777" })).data;
    assert.equal(s.sitzung, undefined); assert.equal(s.test.variante, undefined);
    assert.equal((await post("/api/nt7/zwischenstand", { testId: "nt7-x", code: "777", answers: [1] })).status, 404, "Route gibt es nur mit Sitzung");
    await post("/api/nt7/submit", { testId: "nt7-x", code: "777", answers: [1] });
    const [row] = (await post("/api/nt7/teacher/results", { password: PW })).data.submissions;
    assert.deepEqual([row.score, row.variante, row.begonnenAm, Object.keys(row.details[0]).sort().join()], [1, undefined, undefined, "expected,given,maxPoints,nr,points,prompt,source,type"]);
    assert.equal((await post("/api/nt7/teacher/override", { password: PW, submissionId: row.id, nr: 1, points: 0 })).status, 400);
    assert.equal((await post("/api/nt7/teacher/bestaetigen", { password: PW, submissionId: row.id })).status, 404);
    assert.ok(!fs.existsSync(path.join(dataDir, "nt7-proben-sitzungen.json")));
  } finally { await new Promise((resolve) => server.close(resolve)); fs.rmSync(dataDir, { recursive: true, force: true }); }
});
