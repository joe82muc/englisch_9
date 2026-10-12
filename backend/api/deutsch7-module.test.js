"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const express = require("express");
const { registerArgumentation7Routes, requireStudent, requireTeacher } = require("./argumentation7");
const { registerDeutsch7ModuleRoutes } = require("./deutsch7-module");

let server;
let baseUrl;
let dataDir;
let token;
let aiMode = "ok";
// Für die Prüfung „ein Kriterium darf fehlen“: Haken, die die KI je Kriterium setzt
let aiOk = null, letzterAuftrag = "";

test.before(async () => {
  dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "deutsch7-module-"));
  const app = express();
  app.use(express.json());
  const askAnthropic = async (system) => {
    if (aiMode === "down") throw new Error("offline");
    if (system.includes("Übungs-Duell")) {
      return JSON.stringify({
        kriterien: [{ text: "geht auf die Aussage ein", ok: true }, { text: "Ich-Botschaft", ok: false }],
        bewertung: "mid",
        schiedsrichter: "Du gehst auf Linus ein, aber es fehlt die Ich-Botschaft.",
        reaktion: "Na gut, vielleicht hast du ein bisschen recht."
      });
    }
    if (aiOk) {
      letzterAuftrag = system;
      return JSON.stringify({ kriterien: aiOk.map((ok, i) => ({ text: "Punkt " + i, ok })), richtig: false, rueckmeldung: "Das meiste passt.", tipp: "Nimm ein neues Beispiel." });
    }
    return "Hier ist meine Bewertung: " + JSON.stringify({
      kriterien: [{ text: "nennt ein Beispiel", ok: true }, { text: "passt zum Argument", ok: true }],
      richtig: false,
      rueckmeldung: "Dein Beispiel passt gut.",
      tipp: "Soll leer werden."
    });
  };
  registerArgumentation7Routes(app, { dataDir, teacherPassword: "2", hashSecret: "test-secret", askAnthropic });
  registerDeutsch7ModuleRoutes(app, {
    dataDir,
    askAnthropic,
    requireStudent: (req, res) => requireStudent(req, res, "test-secret"),
    requireTeacher: (req, res) => requireTeacher(req, res, "2")
  });
  server = await new Promise((resolve) => {
    const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  const start = await post("/api/de7-argument/start", { firstName: "Lea", lastName: "Muster", className: "7M" });
  token = start.body.token;
});

test.after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  fs.rmSync(dataDir, { recursive: true, force: true });
});

async function post(route, body, auth) {
  const response = await fetch(`${baseUrl}${route}`, {
    method: "POST",
    headers: { "content-type": "application/json", ...(auth ? { authorization: `Bearer ${auth}` } : {}) },
    body: JSON.stringify(body)
  });
  return { status: response.status, body: await response.json() };
}

const task = {
  modul: "argumente-formulieren",
  aufgabe: "beispiel-1",
  titel: "Beispiel finden",
  frage: "Finde ein Beispiel zum Argument.",
  kriterien: ["nennt ein Beispiel", "passt zum Argument"],
  keywords: ["zum beispiel|etwa"],
  antwort: "Zum Beispiel hat mein Cousin kein eigenes Fahrrad und müsste eins leihen."
};

test("check needs the student login", async () => {
  const result = await post("/api/de7-argument/modul/check", task);
  assert.equal(result.status, 401);
});

test("check follows the criteria and stores the entry", async () => {
  aiMode = "ok";
  const result = await post("/api/de7-argument/modul/check", task, token);
  assert.equal(result.status, 200);
  assert.equal(result.body.quelle, "ki");
  assert.equal(result.body.richtig, true, "all criteria ok means richtig");
  assert.equal(result.body.tipp, "", "no tip when everything is fulfilled");
  assert.deepEqual(result.body.kriterien.map((item) => item.ok), [true, true]);
});

test("check falls back to keywords when the AI is down", async () => {
  aiMode = "down";
  const result = await post("/api/de7-argument/modul/check", task, token);
  assert.equal(result.status, 200);
  assert.equal(result.body.quelle, "stichworte");
  assert.equal(result.body.richtig, true);
  aiMode = "ok";
});

test("unknown module is rejected", async () => {
  const result = await post("/api/de7-argument/modul/check", { ...task, modul: "gibt-es-nicht" }, token);
  assert.equal(result.status, 400);
});

test("duel returns referee verdict and reaction", async () => {
  const result = await post("/api/de7-argument/modul/duell", {
    modul: "angemessen-ausdruecken",
    duell: "streit",
    thema: "Plakat für die Projektwoche",
    rolle: "Linus, genervt",
    auftrag: "Antworte ruhig mit einer Ich-Botschaft.",
    kriterien: ["geht auf die Aussage ein", "Ich-Botschaft"],
    aussage: "Du machst ja eh nie was!",
    antwort: "Ich habe gestern zwei Stunden am Plakat gemalt und bin traurig, wenn du das sagst.",
    verlauf: [{ wer: "Linus", text: "Du machst ja eh nie was!" }]
  }, token);
  assert.equal(result.status, 200);
  assert.equal(result.body.bewertung, "mid");
  assert.match(result.body.reaktion, /recht/);
  assert.deepEqual(result.body.kriterien.map((item) => item.ok), [true, false]);
});

test("teacher sees the module entries, students do not", async () => {
  await post("/api/de7-argument/modul/tagebuch", { modul: "sachlich-diskutieren", text: "Ich will andere ausreden lassen." }, token);
  const denied = await post("/api/de7-argument/teacher/module-results", { password: "falsch" });
  assert.equal(denied.status, 401);
  const result = await post("/api/de7-argument/teacher/module-results", { password: "2" });
  assert.equal(result.status, 200);
  assert.equal(result.body.entries.length, 4);
  assert.ok(result.body.entries.every((entry) => entry.lastName === "Muster"));
  const arten = result.body.entries.map((entry) => entry.art).sort();
  assert.deepEqual(arten, ["duell", "tagebuch", "text", "text"]);

  const removed = await post("/api/de7-argument/teacher/module-delete", { password: "2", entryId: result.body.entries[0].id });
  assert.equal(removed.status, 200);
  const after = await post("/api/de7-argument/teacher/module-results", { password: "2" });
  assert.equal(after.body.entries.length, 3);
});

test("ab drei Kriterien darf eines fehlen – die Aufgabe gilt als gelöst, der Tipp bleibt", async () => {
  const { noetig } = require("./deutsch7-module");
  assert.deepEqual([1, 2, 3, 4, 5, 6, 8].map(noetig), [1, 2, 2, 3, 4, 4, 6]);
  const vier = { ...task, aufgabe: "beispiel-4", kriterien: ["nennt ein Beispiel", "passt zum Argument", "ist ein neues Beispiel", "ist ein ganzer Satz"] };
  try {
    aiOk = [true, true, false, true];
    let result = await post("/api/de7-argument/modul/check", vier, token);
    assert.equal(result.body.richtig, true, "drei von vier genügen");
    assert.equal(result.body.teilweise, false);
    assert.equal(result.body.tipp, "Nimm ein neues Beispiel.", "der Tipp zum fehlenden Punkt bleibt");
    assert.deepEqual(result.body.kriterien.map((item) => item.ok), [true, true, false, true], "die Checkliste zeigt den fehlenden Punkt");
    assert.match(letzterAuftrag, /Sei großzügig/);
    assert.match(letzterAuftrag, /Im Zweifel gilt ok true/);
    aiOk = [true, false, false, true];
    result = await post("/api/de7-argument/modul/check", vier, token);
    assert.equal(result.body.richtig, false, "zwei von vier genügen nicht");
    assert.equal(result.body.teilweise, true);
    aiOk = [true, false];
    result = await post("/api/de7-argument/modul/check", task, token);
    assert.equal(result.body.richtig, false, "bei zwei Kriterien zählen beide");
    aiOk = [true, true, false];
    result = await post("/api/de7-argument/modul/check", { ...task, aufgabe: "beispiel-3", kriterien: ["a", "b", "c"] }, token);
    assert.equal(result.body.richtig, true, "zwei von drei genügen");
  } finally { aiOk = null; }
});
