"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const tests = require("./nt7-fragen");
const { registerNt7Routes } = require("./nt7");

const NEU = ["nt7-p1-r", "nt7-p1-m", "nt7-p2-r", "nt7-p2-m", "nt7-p3-r", "nt7-p3-m", "nt7-p4-r", "nt7-p4-m"];

test("Die beiden ersten Luft-Proben sind unverändert da, dazu acht neue (je Probe eine R- und eine M-Fassung)", () => {
  // seit 07.10.2026 sind das die früheren Fassungen (alt); die Block-Proben prüft block-proben.test.js
  assert.deepEqual(Object.keys(tests).filter((id) => tests[id].alt).sort(), ["nt7-luft-1", "nt7-luft-2", ...NEU].sort());
  assert.equal(tests["nt7-luft-1"].items.length, 10);
  assert.equal(tests["nt7-luft-1"].zug, undefined);
  NEU.forEach((id) => {
    const t = tests[id];
    assert.equal(t.id, id);
    assert.equal(t.zug, id.endsWith("-r") ? "R" : "M", id);
    assert.ok(["luft", "tiere", "mensch", "strom"].includes(t.thema), id);
    assert.match(t.title, t.zug === "R" ? /\(7R\)/ : /\(7M\)/);
    assert.ok(t.minutes >= 30 && t.minutes <= 45, id);
  });
});

test("Jede neue Probe: 10 bis 13 Aufgaben, 22 bis 32 Punkte, alle drei Aufgabenarten", () => {
  NEU.forEach((id) => {
    const t = tests[id], punkte = t.items.reduce((s, i) => s + i.points, 0);
    assert.ok(t.items.length >= 10 && t.items.length <= 13, `${id}: ${t.items.length} Aufgaben`);
    assert.ok(punkte >= 22 && punkte <= 32, `${id}: ${punkte} Punkte`);
    ["choice", "match", "text"].forEach((typ) => assert.ok(t.items.some((i) => i.type === typ), `${id}: ${typ} fehlt`));
  });
});

test("Aufgaben sind auswertbar: Lösung im Bereich, Ziele eindeutig, Erwartungshorizont je Punkt", () => {
  NEU.forEach((id) => tests[id].items.forEach((it, n) => {
    const wo = `${id} Aufgabe ${n + 1}`;
    assert.ok(it.prompt && it.prompt.length > 10, wo);
    if (it.type === "choice") {
      assert.equal(it.options.length, 4, wo);
      assert.equal(new Set(it.options).size, 4, wo + ": doppelte Antwort");
      assert.ok(Number.isInteger(it.answer) && it.answer >= 0 && it.answer < 4, wo);
      assert.equal(it.points, 1, wo);
    } else if (it.type === "match") {
      assert.ok(it.pairs.length >= 3 && it.pairs.length <= 5, wo);
      assert.equal(new Set(it.pairs.map((p) => p[1])).size, it.pairs.length, wo + ": Ziel kommt doppelt vor");
      assert.equal(new Set(it.pairs.map((p) => p[0])).size, it.pairs.length, wo + ": Begriff kommt doppelt vor");
      assert.equal(it.points, it.pairs.length, wo);
    } else {
      assert.equal(it.type, "text", wo);
      assert.ok(it.expected.length > 15, wo);
      assert.equal(it.criteria.length, it.points, wo + ": ein Kriterium je Punkt");
      assert.equal(it.keywords.length, it.points, wo + ": eine Stichwortgruppe je Punkt");
      // Die Musterlösung muss die eigene Stichwortprüfung bestehen (volle Punkte ohne KI)
      const klein = it.expected.toLocaleLowerCase("de");
      const treffer = it.keywords.filter((g) => g.split("|").some((w) => klein.includes(w))).length;
      assert.equal(treffer, it.points, wo + ": Musterlösung erfüllt nicht alle Stichwortgruppen");
    }
    if (it.image) assert.match(it.image, /^assets\/proben\/[a-z0-9-]+\.svg$/, wo);
  }));
});

test("Zuordnungen: Die richtige Lösung ist nie einfach „der Reihe nach“", () => {
  // nt7.js zeigt die Ziele alphabetisch sortiert, die linke Spalte in der Reihenfolge der Datei
  NEU.forEach((id) => tests[id].items.forEach((it, n) => {
    if (it.type !== "match") return;
    const sortiert = it.pairs.map((p) => p[1]).sort((a, b) => a.localeCompare(b, "de"));
    const stellen = it.pairs.map((p) => sortiert.indexOf(p[1]));
    assert.ok(stellen.some((s, i) => s !== i), `${id} Aufgabe ${n + 1}: Paare in der Datei umstellen`);
  }));
});

test("Jede Musterlösung besteht die Stichwortprüfung der eigenen Aufgabe", () => {
  NEU.forEach((id) => tests[id].items.forEach((it, n) => {
    if (it.type !== "text") return;
    const klein = it.expected.toLocaleLowerCase("de");
    it.keywords.forEach((gruppe, g) => {
      assert.ok(gruppe.split("|").some((wort) => klein.includes(wort)), `${id} Aufgabe ${n + 1}, Stichwortgruppe ${g + 1}`);
    });
  }));
});

test("Richtige Antworten liegen nach dem Mischen nicht immer an derselben Stelle", () => {
  NEU.forEach((id) => {
    const stellen = tests[id].items.filter((i) => i.type === "choice").map((i) => i.answer);
    assert.ok(new Set(stellen).size >= 3, `${id}: ${stellen.join(",")}`);
  });
});

test("R-Kinder schreiben die R-Fassung, M-Kinder die M-Fassung", async () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "nt7-proben-test-"));
  const app = express();
  app.use(express.json());
  registerNt7Routes(app, {
    dataDir, teacherPassword: "pw",
    kindZumCode: async (code) => (code === "111" ? { code: "111", klasse: "7aM", zug: "7M" } : code === "222" ? { code: "222", klasse: "7d", zug: "7R" } : null)
  });
  const server = await new Promise((resolve) => { const s = app.listen(0, () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (route, body) => fetch(base + route, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).then(async (r) => ({ status: r.status, data: await r.json() }));
  try {
    const liste = (await (await fetch(base + "/api/nt7/list")).json()).tests;
    assert.equal(liste.length, 20);
    assert.deepEqual(liste.find((t) => t.id === "nt7-p3-r"), { ...liste.find((t) => t.id === "nt7-p3-r"), zug: "R", thema: "mensch", alt: true, unlocked: false });
    assert.equal(liste.find((t) => t.id === "nt7-luft-1").zug, "");
    for (const id of ["nt7-p1-r", "nt7-p1-m"]) assert.equal((await post("/api/nt7/teacher/unlock", { password: "pw", testId: id, open: true })).status, 200);
    assert.equal((await post("/api/nt7/start", { testId: "nt7-p1-m", code: "222" })).status, 403, "R-Kind in der M-Probe");
    assert.match((await post("/api/nt7/start", { testId: "nt7-p1-m", code: "222" })).data.message, /M-Klassen/);
    assert.equal((await post("/api/nt7/start", { testId: "nt7-p1-r", code: "111" })).status, 403, "M-Kind in der R-Probe");
    const start = await post("/api/nt7/start", { testId: "nt7-p1-r", code: "222" });
    assert.equal(start.status, 200);
    assert.equal(start.data.items.length, tests["nt7-p1-r"].items.length);
    assert.equal(JSON.stringify(start.data).includes("expected"), false, "Lösungen gehen nicht an das Kind");
    // Abgabe mit allen richtigen Antworten (freie Antworten: Musterlösung) -> volle Punkte, Note 1 nach R-Schlüssel
    const t = tests["nt7-p1-r"];
    const answers = t.items.map((it) => it.type === "choice" ? it.answer : it.type === "match" ? it.pairs.map((p) => p[1]) : it.expected);
    const abgabe = await post("/api/nt7/submit", { testId: "nt7-p1-r", code: "222", answers });
    assert.equal(abgabe.status, 200);
    assert.equal(abgabe.data.result.score, abgabe.data.result.total);
    assert.equal(abgabe.data.result.grade, 1);
    assert.equal((await post("/api/nt7/submit", { testId: "nt7-p1-r", code: "222", answers })).status, 409, "nur eine Abgabe");
  } finally {
    await new Promise((resolve) => server.close(resolve));
    fs.rmSync(dataDir, { recursive: true, force: true });
  }
});
