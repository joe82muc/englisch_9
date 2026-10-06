"use strict";

// Proben (nt7.js: NT 7, Informatik 7, Informatik 8): Jede Abgabe kommt an – auch wenn die ganze Klasse im selben
// Moment abgibt, die KI langsam ist oder ausfällt, oder die Lehrkraft gerade sperrt.
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const { registerNt7Routes } = require("./nt7");
const { probeOffen, NACHFRIST_MS } = require("./probe-kind");

const PW = "Nur-ein-Test-4711";
const KINDER = Array.from({ length: 30 }, (_, i) => String(100 + i));
const kindZumCode = async (code) => (KINDER.includes(String(code)) ? { code: String(code), klasse: "8aM", zug: "8M" } : null);
const PROBE = { "inf8-t-m": { id: "inf8-t-m", zug: "M", thema: "excel1", minutes: 15, title: "Testprobe (8M)", scope: "Test", items: [
  { type: "choice", prompt: "Welche Antwort stimmt hier?", options: ["A", "B", "C", "D"], answer: 1, points: 1 },
  { type: "text", prompt: "Warum steht dort eine Null?", expected: "Die Zelle ist leer.", criteria: ["leere Zelle"], keywords: ["leer"], points: 1 },
  { type: "text", prompt: "Was macht eine Formel?", expected: "Sie rechnet von selbst neu.", criteria: ["rechnet", "von selbst"], keywords: ["rechnet", "selbst"], points: 2 }
] } };
const antworten = (i) => [i % 4, "Die Zelle ist leer, Kind " + i, "Sie rechnet neu."];

async function mitServer(askAnthropic, extra, lauf) {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "proben-abgabe-"));
  const app = express();
  app.use(express.json());
  registerNt7Routes(app, { dataDir, teacherPassword: PW, kindZumCode, prefix: "/api/inf8", datei: "inf8-proben.json", tests: PROBE, fach: "Informatik", stufe: 8,
    service: "inf8-proben", askAnthropic, kiGeduldMs: 300, kiPauseMs: 60, ...extra });
  const server = await new Promise((resolve) => { const s = app.listen(0, () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (route, body) => fetch(base + route, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
    .then(async (r) => ({ status: r.status, data: await r.json().catch(() => null) }));
  const key = process.env.ANTHROPIC_API_KEY; process.env.ANTHROPIC_API_KEY = "nur-fuer-den-test";
  try {
    assert.equal((await post("/api/inf8/teacher/unlock", { password: PW, testId: "inf8-t-m", open: true })).status, 200);
    await lauf({ post, datei: path.join(dataDir, "inf8-proben.json") });
  } finally {
    if (key === undefined) delete process.env.ANTHROPIC_API_KEY; else process.env.ANTHROPIC_API_KEY = key;
    await new Promise((resolve) => server.close(resolve)); fs.rmSync(dataDir, { recursive: true, force: true });
  }
}
const warte = (ms) => new Promise((ok) => setTimeout(ok, ms));
const gespeichert = (datei) => { try { return JSON.parse(fs.readFileSync(datei, "utf8")).submissions; } catch (_e) { return []; } };
const ergebnisse = async (post) => (await post("/api/inf8/teacher/results", { password: PW, testId: "inf8-t-m" })).data.submissions;

test("30 Kinder geben im selben Moment ab: alle 30 Abgaben sind gespeichert, jede mit ihren eigenen Antworten", async () => {
  let gleichzeitig = 0, hoechstens = 0;
  const ki = async () => { gleichzeitig++; hoechstens = Math.max(hoechstens, gleichzeitig); await warte(20 + Math.random() * 120); gleichzeitig--; return '{"points": 1, "comment": "Passt."}'; };
  await mitServer(ki, {}, async ({ post, datei }) => {
    const antwortenServer = await Promise.all(KINDER.map((code, i) => post("/api/inf8/submit", { testId: "inf8-t-m", code, answers: antworten(i) })));
    assert.deepEqual(antwortenServer.map((r) => r.status), KINDER.map(() => 200), "jede Abgabe wurde angenommen");
    const reihen = await ergebnisse(post);
    assert.equal(reihen.length, 30);
    assert.equal(new Set(reihen.map((r) => r.studentKey)).size, 30, "30 verschiedene Kinder");
    KINDER.forEach((code, i) => {
      const r = reihen.find((x) => String(x.code || x.studentKey).includes(code));
      assert.ok(r, "Abgabe von Code " + code + " ist da");
      assert.equal(r.details[1].given, "Die Zelle ist leer, Kind " + i, "die eigene Antwort, nicht die eines anderen Kindes");
      assert.deepEqual(r.details.map((d) => d.source), ["schluessel", "ki", "ki"]);
      assert.equal(r.score, (i % 4 === 1 ? 1 : 0) + 2);
    });
    assert.equal(gespeichert(datei).length, 30, "die Datei ist vollständig und lesbar");
    assert.ok(hoechstens > 1, "die KI wurde wirklich gleichzeitig gefragt (" + hoechstens + ")");
  });
});

test("Die KI antwortet nicht: Die Abgabe ist sofort gespeichert, das Kind bekommt nach kurzer Zeit ein vorläufiges Ergebnis", async () => {
  await mitServer(() => new Promise(() => {}), { kiGeduldMs: 1500 }, async ({ post, datei }) => {
    const start = Date.now();
    let beantwortet = 0;
    const laufend = Promise.all(KINDER.map((code, i) => post("/api/inf8/submit", { testId: "inf8-t-m", code, answers: antworten(i) }).then((r) => { beantwortet++; return r; })));
    // Alle 30 liegen in der Datei, bevor auch nur ein Kind seine Antwort vom Server hat
    for (let i = 0; i < 45 && gespeichert(datei).length < 30; i++) await warte(30);
    assert.deepEqual([gespeichert(datei).length, beantwortet], [30, 0], "gespeichert, bevor die KI geantwortet hat");
    const antwortenServer = await laufend;
    assert.ok(Date.now() - start < 8000, "niemand wartet endlos");
    for (const r of antwortenServer) {
      assert.equal(r.status, 200);
      assert.equal(r.data.result.needsReview, true);
      assert.deepEqual(r.data.result.details.map((d) => d.source), ["schluessel", "stichworte", "stichworte"]);
      assert.equal(r.data.result.details[1].points, 1, "vorläufig nach Stichwörtern");
    }
  });
});

test("Die KI fällt aus und kommt wieder: Die Bewertung wird im Hintergrund nachgetragen", async () => {
  let aufrufe = 0;
  const ki = async () => { if (++aufrufe <= 4) throw new Error("Anthropic HTTP 429"); return '{"points": 1, "comment": "Nachgetragen."}'; };
  await mitServer(ki, { kiGeduldMs: 20 }, async ({ post }) => {
    const r = await post("/api/inf8/submit", { testId: "inf8-t-m", code: "100", answers: antworten(1) });
    assert.equal(r.status, 200);
    let reihe;
    for (let i = 0; i < 40; i++) { await warte(50); reihe = (await ergebnisse(post))[0]; if (!reihe.needsReview) break; }
    assert.deepEqual(reihe.details.map((d) => [d.source, d.comment || ""]).slice(1), [["ki", "Nachgetragen."], ["ki", "Nachgetragen."]]);
    assert.equal(reihe.needsReview, false);
    assert.equal(reihe.score, 1 + 1 + 1);
  });
});

test("Hat die Lehrkraft schon selbst bewertet, überschreibt die nachgetragene KI das nicht", async () => {
  let frei; const sperre = new Promise((ok) => { frei = ok; });
  const ki = async () => { await sperre; return '{"points": 0, "comment": "KI."}'; };
  await mitServer(ki, { kiGeduldMs: 20 }, async ({ post }) => {
    await post("/api/inf8/submit", { testId: "inf8-t-m", code: "100", answers: antworten(1) });
    const reihe = (await ergebnisse(post))[0];
    assert.equal((await post("/api/inf8/teacher/override", { password: PW, submissionId: reihe.id, nr: 3, points: 2, comment: "Von der Lehrkraft." })).status, 200);
    frei(); await warte(150);
    const danach = (await ergebnisse(post))[0];
    assert.deepEqual([danach.details[2].source, danach.details[2].points], ["lehrkraft", 2]);
    assert.deepEqual([danach.details[1].source, danach.details[1].points], ["ki", 0]);
  });
});

test("Zweimal gleichzeitig abgegeben (Doppelklick, zweites Gerät): genau eine Abgabe zählt", async () => {
  await mitServer(async () => { await warte(80); return '{"points": 1, "comment": "ok"}'; }, {}, async ({ post }) => {
    const beide = await Promise.all([0, 1].map(() => post("/api/inf8/submit", { testId: "inf8-t-m", code: "100", answers: antworten(1) })));
    assert.deepEqual(beide.map((r) => r.status).sort(), [200, 409]);
    assert.equal((await post("/api/inf8/submit", { testId: "inf8-t-m", code: "100", answers: antworten(1) })).data.error, "already_submitted");
    assert.equal((await ergebnisse(post)).length, 1);
  });
});

test("Die Lehrkraft sperrt, während Kinder noch abgeben: Die Abgabe kommt trotzdem an, beginnen kann niemand mehr", async () => {
  await mitServer(null, {}, async ({ post }) => {
    assert.equal((await post("/api/inf8/start", { testId: "inf8-t-m", code: "100" })).status, 200);
    assert.equal((await post("/api/inf8/teacher/unlock", { password: PW, testId: "inf8-t-m", open: false })).status, 200);
    assert.equal((await post("/api/inf8/start", { testId: "inf8-t-m", code: "101" })).status, 403, "beginnen geht nach dem Sperren nicht mehr");
    const r = await post("/api/inf8/submit", { testId: "inf8-t-m", code: "100", answers: antworten(1) });
    assert.equal(r.status, 200, "abgeben geht in der Nachfrist noch");
    assert.equal((await ergebnisse(post))[0].nachSperre, true, "für die Lehrkraft vermerkt");
  });
  // die Regel selbst: Nachfrist nur für die Abgabe, nur nach dem Sperren von Hand und nur begrenzt
  const zu = { open: false, changedAt: "2026-10-06T08:00:00.000Z" }, t0 = Date.parse(zu.changedAt);
  assert.equal(probeOffen(zu, true, t0 + 60 * 1000), true);
  assert.equal(probeOffen(zu, false, t0 + 60 * 1000), false);
  assert.equal(probeOffen(zu, true, t0 + NACHFRIST_MS + 1000), false);
  assert.equal(probeOffen({ open: false }, true), false, "nie freigeschaltet oder ohne Zeitpunkt: gesperrt");
  assert.equal(probeOffen(undefined, true), false);
});
