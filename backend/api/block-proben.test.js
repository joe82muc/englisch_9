"use strict";

// Block-Proben (seit 07.10.2026): je Themenbereich eine Probe über alle seine Module, 30 bis 45 Minuten,
// jede Aufgabe nennt ihr Modul, Transferaufgaben sind gekennzeichnet. NT 7 (nt7-block-*.js) und NT 9 (nt9-probe-daten.js).

const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const nt7 = require("./nt7-fragen");
const MODUL_TITEL = require("./nt7-module");
const { registerNt7Routes } = require("./nt7");
const { TESTS: NT9 } = require("./nt9-probe-daten");

const NT7_BLOECKE = {
  luft: ["luft-modul", "windkraft-strom", "windkraft-procontra", "luft-verbrennung", "achtung-explosiv", "brand-schutz", "oxidation", "luftdruck", "forschen"],
  atome: ["atommodelle", "atombau-pse"], tiere: ["wirbeltiere", "fortbewegung"],
  mensch: ["atmungsorgane", "atmen-gasaustausch", "blut", "herz-kreislauf", "herz-gesund"],
  strom: ["stromkreis", "strom-wirkungen", "spannung-stromstaerke", "widerstand", "strom-sicher"]
};
const NT9_BLOECKE = {
  rohstoffe: ["m1", "m2", "m3", "m4", "m5", "m6", "m7"],
  radioaktivitaet: ["ra-nachweis", "ra-strahlungsarten", "ra-halbwertszeit", "ra-c14", "ra-folgen", "ra-anwendung"],
  kernenergie: ["ke-kernspaltung", "ke-kettenreaktion", "ke-kraftwerk", "ke-risiken"]
};
const ALT7 = ["nt7-luft-1", "nt7-luft-2", "nt7-p1-r", "nt7-p1-m", "nt7-p2-r", "nt7-p2-m", "nt7-p3-r", "nt7-p3-m", "nt7-p4-r", "nt7-p4-m"];
// Schätzung wie im Prüfprogramm der Aufgaben (.codex-build/proben-werkzeug/pruefe-block.js)
const minuten = (it, pt) => (it.type === "choice" ? 0.75 : it.type === "text" ? 1 + 0.9 * pt : 0.5 + 0.4 * pt);

test("NT 7: je Themenbereich eine Probe für R und M – alle Module, 30 bis 45 Minuten, Modul und Transfer bei jeder Aufgabe", () => {
  assert.deepEqual(Object.keys(nt7).sort(), [...ALT7, ...Object.keys(NT7_BLOECKE).flatMap((b) => ["nt7-" + b + "-r", "nt7-" + b + "-m"])].sort());
  for (const [block, module] of Object.entries(NT7_BLOECKE)) {
    for (const zug of ["R", "M"]) {
      const id = "nt7-" + block + "-" + zug.toLowerCase(), t = nt7[id];
      assert.equal(t.id, id);
      assert.deepEqual([t.zug, t.thema, t.alt], [zug, block, undefined], id);
      assert.match(t.title, new RegExp("\\(7" + zug + "\\)"), id);
      const jeModul = {}, arten = {};
      let zeit = 0, punkte = 0;
      t.items.forEach((it, nr) => {
        const wo = id + " Aufgabe " + (nr + 1);
        assert.ok(module.includes(it.modul), wo + ": Modul " + it.modul);
        assert.equal(it.modulTitel, MODUL_TITEL[it.modul], wo);
        assert.ok(it.modulTitel.length > 5, wo);
        jeModul[it.modul] = (jeModul[it.modul] || 0) + 1;
        arten[it.type] = (arten[it.type] || 0) + 1;
        if (it.type === "choice") { assert.equal(it.options.length, 4, wo); assert.equal(new Set(it.options).size, 4, wo); assert.ok(it.answer >= 0 && it.answer < 4, wo); }
        if (it.type === "match") assert.equal(new Set(it.pairs.map((p) => p[1])).size, it.pairs.length, wo + ": jedes Ziel nur einmal");
        if (it.type === "text") { assert.equal(it.criteria.length, it.points, wo); assert.equal(it.keywords.length, it.points, wo); assert.ok(it.expected.length > 20, wo); }
        if (it.image) assert.ok(it.imageAlt && it.imageAlt.length > 25, wo + ": Bildbeschreibung");
        zeit += minuten(it, it.points); punkte += it.points;
      });
      module.forEach((m) => assert.ok(jeModul[m] >= 2, id + ": Modul " + m + " hat " + (jeModul[m] || 0) + " Aufgaben"));
      assert.ok(zeit >= 30 && zeit <= 45, id + ": etwa " + zeit.toFixed(0) + " Minuten");
      assert.ok(t.minutes >= 30 && t.minutes <= 45, id);
      assert.ok(punkte >= 28 && punkte <= 48, id + ": " + punkte + " Punkte");
      assert.ok(arten.choice >= 5 && (arten.match || 0) + (arten.order || 0) >= 3 && arten.text >= (zug === "M" ? 5 : 3), id + ": " + JSON.stringify(arten));
      assert.ok(t.items.filter((it) => it.transfer).length >= 2, id + ": Transferaufgaben");
      assert.ok(t.items.filter((it) => it.image).length >= 3, id + ": Bilder");
      // gemischt: Die richtige Antwort steht nicht immer an derselben Stelle
      assert.ok(new Set(t.items.filter((it) => it.type === "choice").map((it) => it.answer)).size >= 3, id + ": Antworten gemischt");
    }
  }
  // M-Fassung mit mehr offenen Fragen als die R-Fassung
  Object.keys(NT7_BLOECKE).forEach((b) => {
    const frei = (z) => nt7["nt7-" + b + "-" + z].items.filter((it) => it.type === "text").length;
    assert.ok(frei("m") > frei("r"), b);
  });
  ALT7.forEach((id) => assert.equal(nt7[id].alt, true, id + " ist eine frühere Fassung"));
});

test("NT 9: drei Themenblöcke je Zug – alle Module, 30 bis 45 Minuten; die lange Probe bleibt als frühere Fassung", () => {
  assert.deepEqual(Object.keys(NT9).sort(), ["nt9m-probe1", "nt9r-probe1", ...Object.keys(NT9_BLOECKE).flatMap((b) => ["nt9m-" + b, "nt9r-" + b])].sort());
  for (const [block, module] of Object.entries(NT9_BLOECKE)) {
    for (const zug of ["M", "R"]) {
      const id = "nt9" + zug.toLowerCase() + "-" + block, t = NT9[id];
      assert.deepEqual([t.id, t.classLevel, t.thema, t.alt], [id, "9" + zug, block, undefined], id);
      const jeModul = {}, arten = {};
      let zeit = 0, punkte = 0;
      t.items.forEach((it, nr) => {
        const wo = id + " Aufgabe " + (nr + 1);
        const pt = it.type === "match" ? it.rows.length : it.points;
        assert.ok(module.includes(it.modul), wo + ": Modul " + it.modul);
        assert.ok(it.modulTitel && it.modulTitel.length > 5, wo + ": Titel des Moduls");
        assert.equal(it.teil, it.transfer ? "Transfer" : it.modulTitel, wo + ": teil");
        jeModul[it.modul] = (jeModul[it.modul] || 0) + 1;
        arten[it.type] = (arten[it.type] || 0) + 1;
        if (it.type === "choice") { assert.equal(new Set(it.options).size, it.options.length, wo); assert.ok(it.answer >= 0 && it.answer < it.options.length, wo); }
        if (it.type === "match") it.rows.forEach((r) => assert.ok(r.answer >= 0 && r.answer < it.options.length, wo));
        if (it.type === "text") assert.ok(it.expected && it.kriterien && it.keywords.length && it.keywordsVoll === 2, wo);
        if (it.image) assert.ok(it.imageAlt && it.imageAlt.length > 25, wo + ": Bildbeschreibung");
        zeit += minuten(it, pt); punkte += pt;
      });
      module.forEach((m) => assert.ok(jeModul[m] >= 2, id + ": Modul " + m + " hat " + (jeModul[m] || 0) + " Aufgaben"));
      assert.ok(zeit >= 30 && zeit <= 45, id + ": etwa " + zeit.toFixed(0) + " Minuten");
      assert.ok(t.minutes >= 30 && t.minutes <= 45, id);
      assert.ok(punkte >= 28 && punkte <= 48, id + ": " + punkte + " Punkte");
      assert.ok(arten.choice >= 5 && arten.match >= 3 && arten.text >= (zug === "M" ? 5 : 3), id + ": " + JSON.stringify(arten));
      assert.ok(t.items.filter((it) => it.transfer).length >= 2, id + ": Transferaufgaben");
      assert.ok(t.items.filter((it) => it.image).length >= 3, id + ": Bilder");
    }
  }
  // Die Rohstoff-Probe ist eine Auswahl aus der langen Probe: dieselben Aufgaben, kürzer
  for (const z of ["m", "r"]) {
    const lang = NT9["nt9" + z + "-probe1"], kurz = NT9["nt9" + z + "-rohstoffe"];
    assert.equal(lang.alt, true);
    assert.equal(lang.items.length, 37);
    assert.ok(kurz.items.length < 26, z);
    kurz.items.forEach((it) => assert.ok(lang.items.some((x) => x.prompt === it.prompt), it.prompt));
  }
});

test("NT 7: Modul und Transfer stehen in der Liste, in der Probe und in der gespeicherten Abgabe", async () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "block-proben-test-"));
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
    assert.deepEqual(liste.filter((t) => t.alt).map((t) => t.id).sort(), ALT7.slice().sort());
    const eintrag = liste.find((t) => t.id === "nt7-atome-r");
    assert.deepEqual([eintrag.zug, eintrag.thema, eintrag.alt, eintrag.unlocked], ["R", "atome", undefined, false]);
    assert.equal((await post("/api/nt7/teacher/unlock", { password: "pw", testId: "nt7-luft-r", open: true })).status, 200);
    const start = await post("/api/nt7/start", { testId: "nt7-luft-r", code: "222" });
    assert.equal(start.status, 200);
    const t = nt7["nt7-luft-r"];
    start.data.items.forEach((it, i) => {
      assert.deepEqual([it.modul, it.modulTitel, it.transfer], [t.items[i].modul, MODUL_TITEL[t.items[i].modul], t.items[i].transfer ? true : undefined], "Aufgabe " + (i + 1));
      if (it.type === "order") assert.deepEqual(it.steps.slice().sort(), t.items[i].steps.slice().sort());
    });
    assert.equal(JSON.stringify(start.data).includes("expected"), false, "Lösungen gehen nicht an das Kind");
    assert.ok(start.data.items.some((it) => it.transfer) && start.data.items.some((it) => it.image));
    // alles richtig beantwortet: volle Punkte; in der Abgabe steht bei jeder Aufgabe ihr Modul
    const answers = t.items.map((it) => (it.type === "choice" ? it.answer : it.type === "match" ? it.pairs.map((p) => p[1]) : it.type === "order" ? it.steps : it.expected));
    const abgabe = await post("/api/nt7/submit", { testId: "nt7-luft-r", code: "222", answers });
    assert.equal(abgabe.status, 200);
    assert.equal(abgabe.data.result.score, abgabe.data.result.total);
    abgabe.data.result.details.forEach((d, i) => assert.deepEqual([d.modul, d.modulTitel, d.transfer], [t.items[i].modul, MODUL_TITEL[t.items[i].modul], t.items[i].transfer ? true : undefined]));
    const gespeichert = (await post("/api/nt7/teacher/results", { password: "pw", testId: "nt7-luft-r" })).data.submissions[0];
    assert.ok(gespeichert.details.every((d) => d.modulTitel) && gespeichert.details.some((d) => d.transfer));
    // frühere Fassung: weiter vorhanden (Ergebnisse), ein M-Kind kann die R-Fassung nicht schreiben
    assert.equal((await post("/api/nt7/start", { testId: "nt7-luft-r", code: "111" })).status, 403);
    assert.equal((await post("/api/nt7/start", { testId: "nt7-p1-r", code: "222" })).status, 403, "nicht freigeschaltet");
  } finally {
    await new Promise((resolve) => server.close(resolve));
    fs.rmSync(dataDir, { recursive: true, force: true });
  }
});
