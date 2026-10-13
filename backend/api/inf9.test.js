"use strict";

// Informatik 9: gemeinsame Proben für R9 und M9, Notenschlüssel R für beide (50 % = Note 3), eigene Freischaltung.
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const proben = require("./inf9-fragen");
const { registerNt7Routes } = require("./nt7");
const { registerNt7FreigabeRoutes } = require("./nt7-freigabe");

const PW = "lehrer-geheim";
const kindZumCode = async (code) => (code === "111" ? { code: "111", klasse: "9aM", zug: "9M" }
  : code === "222" ? { code: "222", klasse: "9b", zug: "9R" } : code === "333" ? { code: "333", klasse: "8aM", zug: "8M" } : null);
const MODULE = ["netzwerke", "internet", "funktionen", "diagramme", "scratch"];
const IDS = Object.keys(proben);

async function mitServer(aufbau, lauf) {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "inf9-test-"));
  const app = express();
  app.use(express.json());
  aufbau(app, dataDir);
  const server = await new Promise((resolve) => { const s = app.listen(0, () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (route, body) => fetch(base + route, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
    .then(async (r) => ({ status: r.status, data: await r.json().catch(() => null) }));
  try { await lauf({ base, post, dataDir }); }
  finally { await new Promise((resolve) => server.close(resolve)); fs.rmSync(dataDir, { recursive: true, force: true }); }
}

// vier Ankreuzfragen: zwei richtig = 50 %
const viertel = (id, zug) => ({ id, zug, thema: "netzwerke", minutes: 15, title: "Testprobe (9" + zug + ")", scope: "Test",
  items: [0, 1, 2, 3].map((n) => ({ type: "choice", prompt: "Frage " + (n + 1) + ": Welche Antwort stimmt?", options: ["A", "B", "C"], answer: 0, points: 1 })) });

test("Notenschlüssel: R9 und M9 bekommen bei 50 % die Note 3 (fester R-Schlüssel)", async () => {
  const eigene = { "inf9-x-r": viertel("inf9-x-r", "R"), "inf9-x-m": viertel("inf9-x-m", "M") };
  await mitServer((app, dataDir) => {
    registerNt7Routes(app, { dataDir, teacherPassword: PW, kindZumCode, prefix: "/api/inf9", datei: "inf9-proben.json", tests: eigene, fach: "Informatik", stufe: 9, notenzug: "R" });
  }, async ({ post }) => {
    for (const id of Object.keys(eigene)) await post("/api/inf9/teacher/unlock", { password: PW, testId: id, open: true });
    assert.equal((await post("/api/inf9/start", { testId: "inf9-x-m", code: "111" })).status, 200);
    assert.equal((await post("/api/inf9/start", { testId: "inf9-x-r", code: "222" })).status, 200);
    assert.equal((await post("/api/inf9/start", { testId: "inf9-x-m", code: "333" })).status, 403, "8. Klasse darf nicht");
    const m = await post("/api/inf9/submit", { testId: "inf9-x-m", code: "111", answers: [0, 0, 1, 1] });
    const r = await post("/api/inf9/submit", { testId: "inf9-x-r", code: "222", answers: [0, 0, 1, 1] });
    assert.equal(m.status, 200); assert.equal(r.status, 200);
    const noteM = (await post("/api/inf9/teacher/results", { password: PW, testId: "inf9-x-m" })).data.submissions[0];
    const noteR = (await post("/api/inf9/teacher/results", { password: PW, testId: "inf9-x-r" })).data.submissions[0];
    assert.deepEqual([noteM.percent, noteM.grade], [50, 3], "9aM: 50 % = Note 3 (nach M-Schlüssel wäre es eine 4)");
    assert.deepEqual([noteR.percent, noteR.grade], [50, 3], "9b: 50 % = Note 3");
  });
});

test("Notenschlüssel: Grenzen des R-Schlüssels gelten für die 9aM genauso (1 ab 87, 2 ab 73, 3 ab 50, 4 ab 37, 5 ab 20)", async () => {
  // 100 Ankreuzfragen: Prozent = Zahl der richtigen Antworten
  const hundert = { "inf9-h-m": { id: "inf9-h-m", zug: "M", thema: "netzwerke", minutes: 15, title: "Hundert (9M)", scope: "Test",
    items: Array.from({ length: 100 }, (_, n) => ({ type: "choice", prompt: "Frage Nummer " + (n + 1) + " der Reihe?", options: ["A", "B"], answer: 0, points: 1 })) } };
  const faelle = [[100, 1], [87, 1], [86, 2], [73, 2], [72, 3], [50, 3], [49, 4], [37, 4], [36, 5], [20, 5], [19, 6], [0, 6]];
  const codes = faelle.map((_, i) => String(400 + i));
  const kinder = async (code) => (codes.includes(code) ? { code, klasse: "9aM", zug: "9M" } : null);
  await mitServer((app, dataDir) => {
    registerNt7Routes(app, { dataDir, teacherPassword: PW, kindZumCode: kinder, prefix: "/api/inf9", datei: "inf9-proben.json", tests: hundert, fach: "Informatik", stufe: 9, notenzug: "R" });
  }, async ({ post }) => {
    await post("/api/inf9/teacher/unlock", { password: PW, testId: "inf9-h-m", open: true });
    for (let i = 0; i < faelle.length; i++) {
      await post("/api/inf9/start", { testId: "inf9-h-m", code: codes[i] });
      const ab = await post("/api/inf9/submit", { testId: "inf9-h-m", code: codes[i], answers: Array.from({ length: 100 }, (_, n) => (n < faelle[i][0] ? 0 : 1)) });
      assert.equal(ab.status, 200, "Abgabe " + faelle[i][0] + " %");
    }
    const alle = (await post("/api/inf9/teacher/results", { password: PW, testId: "inf9-h-m" })).data.submissions;
    faelle.forEach(([pct, note], i) => {
      const s = alle.find((x) => String(x.code) === codes[i]);
      assert.ok(s, "Abgabe von Code " + codes[i] + " fehlt");
      assert.deepEqual([s.percent, s.grade], [pct, note], pct + " % muss Note " + note + " sein");
    });
  });
});

test("Ohne die Option bleibt alles beim Alten: M-Klasse 50 % = Note 4 (andere Fächer sind nicht betroffen)", async () => {
  const eigene = { "inf9-x-m": viertel("inf9-x-m", "M") };
  await mitServer((app, dataDir) => {
    registerNt7Routes(app, { dataDir, teacherPassword: PW, kindZumCode, prefix: "/api/inf9", datei: "inf9-proben.json", tests: eigene, fach: "Informatik", stufe: 9 });
  }, async ({ post }) => {
    await post("/api/inf9/teacher/unlock", { password: PW, testId: "inf9-x-m", open: true });
    await post("/api/inf9/start", { testId: "inf9-x-m", code: "111" });
    await post("/api/inf9/submit", { testId: "inf9-x-m", code: "111", answers: [0, 0, 1, 1] });
    assert.equal((await post("/api/inf9/teacher/results", { password: PW, testId: "inf9-x-m" })).data.submissions[0].grade, 4);
  });
});

test("Freischalten: Informatik 9 hat einen eigenen Stand, nur für 9. Klassen", async () => {
  await mitServer((app, dataDir) => {
    registerNt7FreigabeRoutes(app, { dataDir, teacherPassword: PW, kindZumCode, prefix: "/api/inf9", datei: "inf9-freigabe.json", name: "Informatik-9-Freigabe", stufe: 9 });
  }, async ({ post, dataDir }) => {
    assert.equal((await post("/api/inf9/lehrer/freigabe/setzen", { password: PW, klasse: "9aM", art: "thema", id: "netzwerke", offen: true })).status, 200);
    assert.equal((await post("/api/inf9/lehrer/freigabe/setzen", { password: PW, klasse: "9b", art: "modul", id: "ip-adressen", offen: true })).status, 200);
    assert.equal((await post("/api/inf9/lehrer/freigabe/setzen", { password: PW, klasse: "8aM", art: "thema", id: "netzwerke", offen: true })).status, 400, "nur 9. Klassen");
    const m = (await post("/api/inf9/freigabe", { code: "111" })).data, r = (await post("/api/inf9/freigabe", { code: "222" })).data;
    assert.deepEqual([m.klasse, m.themen, m.module], ["9aM", { netzwerke: true }, {}]);
    assert.deepEqual([r.klasse, r.themen, r.module], ["9b", {}, { "ip-adressen": true }], "9b getrennt von 9aM freischaltbar");
    assert.ok(fs.existsSync(path.join(dataDir, "inf9-freigabe.json")));
  });
});

test("Proben: je Probe zwei Kennungen mit demselben Inhalt und derselben Antwortreihenfolge", () => {
  assert.equal(IDS.length, 10, "fünf Proben, je eine Kennung für 9R und 9M");
  IDS.forEach((id) => {
    const p = proben[id];
    assert.match(id, /^inf9-p[1-5]-[rm]$/, id);
    assert.equal(p.id, id);
    assert.equal(p.zug, id.endsWith("-r") ? "R" : "M", id);
    assert.equal(p.thema, MODULE[Number(id[6]) - 1], id + ": Modul passt nicht zur Nummer");
    assert.match(p.title, p.zug === "R" ? /\(9R\)/ : /\(9M\)/, id);
    assert.ok(p.minutes >= 15 && p.minutes <= 20, id + ": 15 bis 20 Minuten");
    const andere = proben[id.replace(/-[rm]$/, id.endsWith("-r") ? "-m" : "-r")];
    assert.ok(andere, id + ": Kennung für den anderen Zug fehlt");
    assert.deepEqual(p.items, andere.items, id + ": R9 und M9 müssen dieselben Aufgaben in derselben Reihenfolge bekommen");
    assert.equal(p.scope, andere.scope);
  });
});

const glatt = (s) => String(s).toLowerCase().replace(/ß/g, "ss").replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue");
test("Proben: kurz, auswertbar, 20 Punkte (10 Punkte = 50 % = Note 3)", () => {
  IDS.forEach((id) => {
    const p = proben[id], vorlage = proben.__vorlage[id], punkte = p.items.reduce((s, i) => s + i.points, 0);
    assert.ok(p.items.length >= 8 && p.items.length <= 14, `${id}: ${p.items.length} Aufgaben`);
    assert.equal(punkte, 20, `${id}: ${punkte} Punkte`);
    const frei = p.items.filter((i) => i.type === "text");
    assert.ok(frei.length >= 1 && frei.length <= 3, `${id}: ${frei.length} freie Antworten (1 bis 3)`);
    assert.ok(frei.reduce((s, i) => s + i.points, 0) <= 6, `${id}: höchstens 6 Punkte hängen an freien Antworten`);
    p.items.forEach((it, nr) => {
      assert.ok(it.prompt && it.prompt.length >= 12, `${id} Aufgabe ${nr + 1}: Frage fehlt`);
      if (it.type === "choice") {
        assert.ok(it.options.length >= 3 && it.options.length <= 4, `${id} Aufgabe ${nr + 1}: 3 oder 4 Antworten`);
        assert.equal(new Set(it.options).size, it.options.length, `${id} Aufgabe ${nr + 1}: doppelte Antwort`);
        // die richtige Antwort ist nicht an der Länge zu erkennen (in der Vorlage steht sie an Stelle answer)
        const v = vorlage.items[nr], richtig = v.options[v.answer].length, andere = v.options.filter((_, i) => i !== v.answer).map((o) => o.length);
        assert.ok(richtig <= Math.max(...andere) * 1.6 + 6, `${id} Aufgabe ${nr + 1}: Die richtige Antwort ist auffällig lang`);
      }
      if (it.type === "match") assert.ok(it.points >= 3 && it.points <= 5, `${id} Aufgabe ${nr + 1}: 3 bis 5 Paare`);
      if (it.type === "order") assert.ok(it.steps.length >= 3 && it.steps.length <= 5, `${id} Aufgabe ${nr + 1}: 3 bis 5 Schritte`);
      if (it.type === "text") {
        assert.equal(it.criteria.length, it.points, `${id} Aufgabe ${nr + 1}: je Kriterium ein Punkt`);
        assert.ok(it.keywords.length >= it.points, `${id} Aufgabe ${nr + 1}: mindestens eine Stichwortgruppe je Punkt`);
        // die Musterlösung erfüllt jede ihrer Stichwortgruppen
        const muster = glatt(it.dicht ? it.expected.replace(/\s+/g, "") : it.expected);
        it.keywords.forEach((g) => assert.ok(g.split("|").some((w) => muster.includes(glatt(it.dicht ? w.replace(/\s+/g, "") : w))), `${id} Aufgabe ${nr + 1}: Musterlösung trifft die Gruppe „${g}“ nicht`));
      }
      if (it.image) assert.ok(it.imageAlt && it.imageAlt.length > 20, `${id} Aufgabe ${nr + 1}: Bild ohne Beschreibung`);
    });
  });
});

test("Probe 3, WENN-Formel ohne KI: richtige Formel 2 Punkte, vertauschte Texte nur 1, Tablet-Anführungszeichen und Leerzeichen zählen nicht", async () => {
  const faelle = [
    ['=WENN(B3>=30;"Urkunde";"Teilnahme")', 2],
    ['= wenn( B3 >= 30 ; "Urkunde" ; "Teilnahme" )', 2],
    ["=WENN(B3>=30;„Urkunde“;„Teilnahme“)", 2],
    ['=WENN(B3<30;"Teilnahme";"Urkunde")', 2],
    ['=WENN(B3>29;"Urkunde";"Teilnahme")', 2],
    ['=WENN(B3>=30;"Teilnahme";"Urkunde")', 1],
    ['=WENN(B3<30;"Urkunde";"Teilnahme")', 1],
    ["=WENN(B3>=30;Urkunde;Teilnahme)", 1],
    ['WENN B3 groesser 30 dann Urkunde', 0]
  ];
  const codes = faelle.map((_, i) => String(500 + i));
  const kinder = async (code) => (codes.includes(code) ? { code, klasse: "9aM", zug: "9M" } : null);
  const id = "inf9-p3-m", nr = proben[id].items.findIndex((i) => i.type === "text" && /Sportabzeichen/.test(i.prompt));
  assert.ok(nr >= 0, "Aufgabe mit der WENN-Formel nicht gefunden");
  await mitServer((app, dataDir) => {
    registerNt7Routes(app, { dataDir, teacherPassword: PW, kindZumCode: kinder, prefix: "/api/inf9", datei: "inf9-proben.json", tests: proben, fach: "Informatik", stufe: 9, notenzug: "R" });
  }, async ({ post }) => {
    await post("/api/inf9/teacher/unlock", { password: PW, testId: id, open: true });
    for (let i = 0; i < faelle.length; i++) {
      await post("/api/inf9/start", { testId: id, code: codes[i] });
      const answers = proben[id].items.map((it, k) => (k === nr ? faelle[i][0] : it.type === "text" ? "" : null));
      assert.equal((await post("/api/inf9/submit", { testId: id, code: codes[i], answers })).status, 200, "Abgabe " + faelle[i][0]);
    }
    const alle = (await post("/api/inf9/teacher/results", { password: PW, testId: id })).data.submissions;
    faelle.forEach(([formel, punkte], i) => {
      const s = alle.find((x) => String(x.code) === codes[i]);
      assert.ok(s, "Abgabe fehlt: " + formel);
      assert.equal(s.details[nr].points, punkte, formel + " soll " + punkte + " Punkt(e) bekommen");
    });
  });
});