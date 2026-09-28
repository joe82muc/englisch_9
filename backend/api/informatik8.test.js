"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const express = require("express");
const { registerInfoaustauschRoutes } = require("./infoaustausch");
const { TESTS: INF7 } = require("./infoaustausch-daten");
const { TESTS: INF8, GRADE_SCALE, KI_REGELN } = require("./informatik8-daten");

let server;
let baseUrl;
let aiMode = "ok";
let textPoints = 2;
const systems = [];

test.before(async () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "informatik8-"));
  const app = express();
  app.use(express.json());
  const askAnthropic = async (system) => {
    systems.push(system);
    if (aiMode === "down") throw new Error("offline");
    if (system.includes("UEBUNGSAUFGABE")) return JSON.stringify({ richtig: true, rueckmeldung: "Gut erklärt." });
    return JSON.stringify({ points: textPoints, comment: "passt" });
  };
  const common = { dataDir, teacherPassword: "2", hashSecret: "x", askAnthropic };
  registerInfoaustauschRoutes(app, { ...common, tests: INF7 });
  registerInfoaustauschRoutes(app, {
    ...common, tests: INF8, prefix: "/api/informatik8", storeName: "informatik8",
    gradeScale: GRADE_SCALE, kiRegeln: KI_REGELN
  });
  await new Promise((resolve) => { server = app.listen(0, resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(() => server && server.close());

const post = async (route, body) => {
  const res = await fetch(baseUrl + route, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
  });
  return { status: res.status, data: await res.json() };
};
const probe = INF8["inf8-probe1"];
const student = (n) => ({ testId: "inf8-probe1", firstName: "Test" + n, lastName: "Kind", className: "8M" });

/* Antworten, die genau `wrong` Anklick-Punkte verschenken; freie Texte bekommen textPoints. */
function answers(wrongChoices = 0) {
  let left = wrongChoices;
  return probe.items.map((it) => {
    if (it.type === "choice") {
      if (left > 0) { left--; return (it.answer + 1) % it.options.length; }
      return it.answer;
    }
    if (it.type === "match") return it.rows.map((r) => r.answer);
    return "Eine ernsthafte Antwort mit Inhalt.";
  });
}

test("Probe hat 23 Aufgaben und 40 Punkte, gesperrt, ohne Loesungen", async () => {
  const list = await (await fetch(baseUrl + "/api/informatik8/list")).json();
  assert.equal(list.tests.length, 1);
  assert.equal(list.tests[0].itemCount, 23);
  assert.equal(list.tests[0].maxPoints, 40);
  assert.equal(list.tests[0].unlocked, false);

  assert.equal((await post("/api/informatik8/start", student(0))).status, 403);
  assert.equal((await post("/api/informatik8/unlock", { password: "falsch", testId: "inf8-probe1", open: true })).status, 401);
  assert.equal((await post("/api/informatik8/unlock", { password: "2", testId: "inf8-probe1", open: true })).status, 200);

  const start = await post("/api/informatik8/start", student(0));
  assert.equal(start.status, 200);
  const raw = JSON.stringify(start.data);
  assert.ok(!raw.includes('"answer"') && !raw.includes('"expected"') && !raw.includes('"keywords"'));
  const match = start.data.items.find((it) => it.type === "match");
  assert.deepEqual(match.rows.slice(0, 1), ["Gerät oder Programm, das eine Anfrage stellt"]);
  assert.equal(match.points, 5);

  // Informatik 7 ist davon nicht betroffen
  const inf7 = await (await fetch(baseUrl + "/api/infoaustausch/list")).json();
  assert.equal(inf7.tests[0].id, "inf7-info-probe1");
  assert.equal(inf7.tests[0].unlocked, false);
});

test("Volle Punktzahl ergibt Note 1, Zuordnen zaehlt je Zeile", async () => {
  textPoints = 2;
  const res = await post("/api/informatik8/submit", { ...student(1), answers: answers(0) });
  assert.equal(res.status, 200);
  assert.equal(res.data.result.score, 40);
  assert.equal(res.data.result.grade, 1);

  const a = answers(0);
  a[12] = [5, 1, 2, 3, 4]; // erste Zeile falsch
  const part = await post("/api/informatik8/submit", { ...student(2), answers: a });
  const m = part.data.result.details[12];
  assert.equal(m.points, 4);
  assert.equal(m.maxPoints, 5);
  assert.match(m.given, /Router/);
});

test("50 Prozent sind Note 3, 48 Prozent Note 4", async () => {
  textPoints = 0; // 24 Punkte aus Teil A und B
  const drei = await post("/api/informatik8/submit", { ...student(3), answers: answers(4) }); // 20/40
  assert.equal(drei.data.result.score, 20);
  assert.equal(drei.data.result.percent, 50);
  assert.equal(drei.data.result.grade, 3);

  const vier = await post("/api/informatik8/submit", { ...student(4), answers: answers(5) }); // 19/40
  assert.equal(vier.data.result.grade, 4);
});

test("Ohne KI greifen die Stichwoerter und die Abgabe wird zur Pruefung markiert", async () => {
  aiMode = "down";
  const a = answers(0);
  a[16] = "Der Browser schickt eine Anfrage an den Server und bekommt eine Antwort.";
  const res = await post("/api/informatik8/submit", { ...student(5), answers: a });
  aiMode = "ok";
  assert.equal(res.status, 200);
  assert.equal(res.data.result.needsReview, true);
  assert.equal(res.data.result.details[16].points, 2);
});

test("Zweite Abgabe unter gleichem Namen wird abgewiesen, Lehrkraft kann korrigieren", async () => {
  const again = await post("/api/informatik8/submit", { ...student(1), answers: answers(0) });
  assert.equal(again.status, 409);

  const results = await post("/api/informatik8/results", { password: "2", testId: "inf8-probe1" });
  const rec = results.data.submissions.find((r) => r.firstName === "Test3");
  const fix = await post("/api/informatik8/override", { password: "2", submissionId: rec.id, nr: 16, points: 2 });
  assert.equal(fix.data.score, 22);
  assert.equal(fix.data.grade, 3);
});

test("Uebungs-Rueckmeldung nutzt den Bewertungstext fuer Klasse 8", async () => {
  const res = await post("/api/informatik8/feedback", { frage: "Was ist ein Router?", erwartet: "leitet Daten weiter", antwort: "verbindet Netze", thema: "Rechnernetze" });
  assert.equal(res.data.richtig, true);
  assert.ok(systems.at(-1).includes("8. Klasse"));
  await post("/api/infoaustausch/feedback", { frage: "x", antwort: "eine Antwort" });
  assert.ok(systems.at(-1).includes("7. Klasse"));
});
