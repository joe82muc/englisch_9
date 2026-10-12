"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const express = require("express");
const { registerArgumentation7Routes } = require("./argumentation7");

let server;
let baseUrl;
let dataDir;
// Zeitpunkt des letzten Zurücksetzens je Code (kommt im Server aus dem Lernfortschritt)
const resetZeiten = {};

test.before(async () => {
  dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "argumentation7-"));
  const app = express();
  app.use(express.json());
  registerArgumentation7Routes(app, {
    dataDir,
    teacherPassword: "2",
    hashSecret: "test-secret",
    kindZumCode: async (code) => (code === "123" ? { code: "123", klasse: "7aM", zug: "7M" } : code === "999" ? { gesperrt: true } : null),
    resetZeit: async (code) => resetZeiten[code] || 0,
    askAnthropic: async (system) => {
      if (system.includes("Diskussionspartner")) {
        return JSON.stringify({ counterArgument: "Bowling ist wetterunabhängig, deshalb kann der Ausflug sicher stattfinden." });
      }
      return JSON.stringify({
        summary: "Dein Argument ist klar aufgebaut.",
        components: {
          claim: { status: "good", hint: "Die Behauptung ist klar." },
          reason: { status: "good", hint: "Die Begründung passt." },
          example: { status: "good", hint: "Das Beispiel ist konkret." }
        },
        strengths: ["klare Behauptung"],
        nextStep: "Bearbeite ein neues Thema.",
        stars: 3,
        markings: [],
        objective: true,
        killerPhrases: []
      });
    }
  });
  server = await new Promise((resolve) => {
    const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  fs.rmSync(dataDir, { recursive: true, force: true });
});

test("config exposes topics without answer data", async () => {
  const response = await fetch(`${baseUrl}/api/de7-argument/config`);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.topics.length, 8);
  assert.equal(body.stages.length, 4);
  assert.equal(body.topics[0].counterPrompts, undefined);
});

test("student completes stage one and unlocks stage two", async () => {
  const start = await post("/api/de7-argument/start", {
    firstName: "Mia",
    lastName: "Muster",
    className: "7M"
  });
  assert.equal(start.response.status, 200);
  assert.equal(start.body.progress.stages["1"].unlocked, true);
  assert.equal(start.body.progress.stages["2"].unlocked, false);

  const evaluation = await post("/api/de7-argument/evaluate", {
    topicId: "wandertag",
    stage: 1,
    side: "Zoo",
    exerciseId: "lesson-1",
    content: {
      claim: "Wir sollten in den Zoo gehen.",
      reason: "Dort lernen wir viel, weil wir echte Tiere beobachten können.",
      example: "Zum Beispiel können wir das Verhalten der Affen vergleichen."
    }
  }, start.body.token);
  assert.equal(evaluation.response.status, 200);
  assert.equal(evaluation.body.evaluation.stars, 3);
  assert.equal(evaluation.body.progress.stages["2"].unlocked, true);
  assert.equal(evaluation.body.revision, 1);

  const revision = await post("/api/de7-argument/evaluate", {
    topicId: "wandertag",
    stage: 1,
    side: "Zoo",
    exerciseId: "lesson-1",
    content: {
      claim: "Wir sollten in den Zoo gehen.",
      reason: "Dort lernen wir viel, weil wir Tiere direkt beobachten können.",
      example: "Zum Beispiel können wir bei den Affen Körperbau und Verhalten vergleichen."
    }
  }, start.body.token);
  assert.equal(revision.body.revision, 2);
});

test("locked stage is rejected and duel returns a counterargument", async () => {
  const start = await post("/api/de7-argument/start", {
    firstName: "Noah",
    lastName: "Neu",
    className: "7M"
  });
  const locked = await post("/api/de7-argument/evaluate", {
    topicId: "handys",
    stage: 2,
    side: "dafür",
    content: {
      pro: "Handys sind nützlich, weil wir Absprachen treffen können.",
      contra: "Sie lenken ab, weil viele nur Videos ansehen.",
      weighing: "Trotzdem bin ich dafür, wenn es klare Regeln gibt."
    }
  }, start.body.token);
  assert.equal(locked.response.status, 403);

  const counter = await post("/api/de7-argument/counter", {
    topicId: "wandertag",
    side: "Zoo",
    studentArgument: "Im Zoo lernen wir etwas, weil wir die Tiere direkt beobachten."
  }, start.body.token);
  assert.equal(counter.response.status, 200);
  assert.match(counter.body.counterArgument, /Bowling/);
});

test("teacher endpoint is password protected and contains revisions", async () => {
  const denied = await post("/api/de7-argument/teacher/results", { password: "wrong" });
  assert.equal(denied.response.status, 401);

  const allowed = await post("/api/de7-argument/teacher/results", { password: "2" });
  assert.equal(allowed.response.status, 200);
  assert.equal(allowed.body.attempts.length, 2);
  assert.equal(allowed.body.overview.length, 1);
});

async function post(route, body, token) {
  const response = await fetch(`${baseUrl}${route}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body)
  });
  return { response, body: await response.json() };
}

test("start accepts a progress code instead of a name", async () => {
  const post = (body) => fetch(`${baseUrl}/api/de7-argument/start`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  let response = await post({ code: "123" });
  let body = await response.json();
  assert.equal(response.status, 200);
  assert.deepEqual(body.student, { firstName: "Code 123", lastName: "", className: "7aM", code: "123" });
  assert.ok(body.token);
  const progress = await fetch(`${baseUrl}/api/de7-argument/progress`, { headers: { authorization: "Bearer " + body.token } });
  assert.equal(progress.status, 200);
  response = await post({ code: "456" });
  assert.equal(response.status, 404);
  response = await post({ code: "999" });
  assert.equal(response.status, 429);
  response = await post({ firstName: "Lea", lastName: "Muster", className: "7M" });
  assert.equal(response.status, 200, "Anmeldung mit Namen geht weiter");
});

test("Modul neu beginnen: Versuche vor dem Zurücksetzen zählen nicht mehr, bleiben aber für die Lehrkraft", async () => {
  const warte = () => new Promise((resolve) => setTimeout(resolve, 15));
  const stufe1 = (token, exerciseId) => post("/api/de7-argument/evaluate", {
    topicId: "wandertag", stage: 1, side: "Zoo", exerciseId,
    content: { claim: "Wir sollten in den Zoo gehen.", reason: "Dort lernen wir viel, weil wir echte Tiere beobachten können.", example: "Zum Beispiel können wir das Verhalten der Affen vergleichen." }
  }, token);
  const start = await post("/api/de7-argument/start", { code: "123" });
  const token = start.body.token;
  const erste = await stufe1(token, "reset-1");
  assert.equal(erste.body.progress.stages["1"].passed, true);
  assert.equal(erste.body.progress.stages["2"].unlocked, true);
  assert.equal(erste.body.progress.reset, undefined, "noch nie zurückgesetzt");
  const vorher = (await post("/api/de7-argument/teacher/results", { password: "2" })).body.attempts.length;

  // Das Kind (oder die Lehrkraft) setzt den Führerschein im Lernfortschritt zurück
  await warte();
  resetZeiten["123"] = Date.now();
  await warte();
  const stand = await (await fetch(`${baseUrl}/api/de7-argument/progress`, { headers: { authorization: "Bearer " + token } })).json();
  assert.equal(stand.progress.stages["1"].passed, false);
  assert.equal(stand.progress.stages["1"].bestStars, 0);
  assert.equal(stand.progress.stages["2"].unlocked, false, "Stufe 2 ist wieder gesperrt");
  assert.equal(stand.progress.reset, resetZeiten["123"]);
  assert.equal((await post("/api/de7-argument/start", { code: "123" })).body.progress.stages["1"].passed, false);
  const gesperrt = await post("/api/de7-argument/evaluate", {
    topicId: "handys", stage: 2, side: "dafür",
    content: { pro: "Handys sind nützlich, weil wir Absprachen treffen können.", contra: "Sie lenken ab, weil viele nur Videos ansehen.", weighing: "Trotzdem bin ich dafür, wenn es klare Regeln gibt." }
  }, token);
  assert.equal(gesperrt.response.status, 403);
  // Die alte Fassung ist für die Lehrkraft noch da
  assert.equal((await post("/api/de7-argument/teacher/results", { password: "2" })).body.attempts.length, vorher);

  // Neu begonnen: Der nächste Versuch zählt wieder
  const neu = await stufe1(token, "reset-2");
  assert.equal(neu.body.progress.stages["1"].passed, true);
  assert.equal(neu.body.progress.stages["2"].unlocked, true);
  assert.equal(neu.body.progress.reset, resetZeiten["123"]);
  // Wer mit Namen angemeldet ist, hat keinen Lernstand: nichts ändert sich
  const mia = await post("/api/de7-argument/start", { firstName: "Mia", lastName: "Muster", className: "7M" });
  assert.equal(mia.body.progress.stages["1"].passed, true);
  delete resetZeiten["123"];
});
