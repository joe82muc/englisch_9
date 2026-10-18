"use strict";

// Informatik 8: Freischalten, Proben und KI-Rückmeldung laufen über die NT-7-Module mit eigenem Präfix.
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const proben = require("./inf8-fragen");
const { registerNt7Routes } = require("./nt7");
const { registerNt7FreigabeRoutes } = require("./nt7-freigabe");
const { registerNt7UebungRoutes } = require("./nt7-uebung");

const PW = "lehrer-geheim";
const kindZumCode = async (code) => (code === "111" ? { code: "111", klasse: "8aM", zug: "8M" }
  : code === "222" ? { code: "222", klasse: "8d", zug: "8R" } : null);
const MODULE = ["infosys", "daten", "excel1", "excel2", "scratch"];

async function mitServer(aufbau, lauf) {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "inf8-test-"));
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

test("Freischalten: Informatik 8 hat einen eigenen Stand neben NT 7", async () => {
  await mitServer((app, dataDir) => {
    registerNt7FreigabeRoutes(app, { dataDir, teacherPassword: PW, kindZumCode });
    registerNt7FreigabeRoutes(app, { dataDir, teacherPassword: PW, kindZumCode, prefix: "/api/inf8", datei: "inf8-freigabe.json", name: "Informatik-8-Freigabe", stufe: 8 });
  }, async ({ post, dataDir }) => {
    let r = await post("/api/inf8/lehrer/freigabe/setzen", { password: PW, klasse: "8aM", art: "thema", id: "infosys", offen: true });
    assert.equal(r.status, 200);
    r = await post("/api/inf8/lehrer/freigabe/setzen", { password: PW, klasse: "8aM", art: "modul", id: "zwei-computer", offen: true });
    assert.deepEqual(r.data.module, { "zwei-computer": true });
    await post("/api/nt7/lehrer/freigabe/setzen", { password: PW, klasse: "7aM", art: "thema", id: "atome", offen: true });
    assert.equal((await post("/api/inf8/lehrer/freigabe/setzen", { password: PW, klasse: "7aM", art: "thema", id: "infosys", offen: true })).status, 400, "Informatik 8 gibt es nur für die 8. Klassen");
    const inf = (await post("/api/inf8/freigabe", { code: "111" })).data;
    assert.deepEqual([inf.klasse, inf.zug, inf.themen, inf.module], ["8aM", "8M", { infosys: true }, { "zwei-computer": true }]);
    const nt = (await post("/api/nt7/lehrer/freigabe", { password: PW, klasse: "7aM" })).data;
    assert.deepEqual([nt.themen, nt.module], [{ atome: true }, {}], "NT 7 hat seinen eigenen Stand");
    assert.deepEqual((await post("/api/inf8/freigabe", { code: "222" })).data.themen, {}, "andere Klasse, eigener Stand");
    assert.equal((await post("/api/inf8/lehrer/freigabe/setzen", { password: "falsch", klasse: "8aM", art: "thema", id: "infosys", offen: false })).status, 401);
    assert.equal((await post("/api/inf8/freigabe", { code: "000" })).status, 401);
    assert.ok(fs.existsSync(path.join(dataDir, "inf8-freigabe.json")) && fs.existsSync(path.join(dataDir, "nt7-freigabe.json")), "zwei getrennte Dateien");
  });
});

test("Proben: eigenes Präfix, eigene Datei, Reihenfolge-Aufgaben, keine Lösungen an das Kind", async () => {
  const eigene = {
    "inf8-x-r": { id: "inf8-x-r", zug: "R", thema: "infosys", minutes: 15, title: "Testprobe (8R)", scope: "Test", items: [
      { type: "choice", prompt: "Welche Antwort stimmt hier?", options: ["A", "B", "C", "D"], answer: 2, points: 1 },
      { type: "order", prompt: "Bringe die Schritte in die richtige Reihenfolge.", steps: ["Zuerst öffnen", "Dann zuschneiden", "Am Ende exportieren"], points: 3 },
      { type: "match", prompt: "Ordne zu, was zusammengehört.", pairs: [["PNG", "kann durchsichtig sein"], ["JPG", "gut für Fotos"], ["XCF", "Arbeitsdatei von GIMP"]], points: 3 }
    ] }
  };
  await mitServer((app, dataDir) => {
    registerNt7Routes(app, { dataDir, teacherPassword: PW, kindZumCode, prefix: "/api/inf8", datei: "inf8-proben.json", tests: eigene, fach: "Informatik", service: "inf8-proben", csvName: "informatik8-proben.csv" });
  }, async ({ base, post, dataDir }) => {
    assert.equal((await fetch(base + "/api/nt7/list")).status, 404, "NT-7-Routen gibt es in dieser Instanz nicht");
    assert.equal((await (await fetch(base + "/api/inf8/health")).json()).service, "inf8-proben");
    const liste = (await (await fetch(base + "/api/inf8/list")).json()).tests;
    assert.deepEqual(liste.map((t) => [t.id, t.zug, t.thema, t.maxPoints, t.unlocked]), [["inf8-x-r", "R", "infosys", 7, false]]);
    assert.equal((await post("/api/inf8/start", { testId: "inf8-x-r", code: "222" })).status, 403, "gesperrt");
    assert.equal((await post("/api/inf8/teacher/unlock", { password: PW, testId: "inf8-x-r", open: true })).status, 200);
    assert.equal((await post("/api/inf8/start", { testId: "inf8-x-r", code: "111" })).status, 403, "M-Kind in der R-Probe");
    const start = await post("/api/inf8/start", { testId: "inf8-x-r", code: "222" });
    assert.equal(start.status, 200);
    const reihe = start.data.items[1];
    assert.equal(reihe.type, "order");
    assert.deepEqual(reihe.steps.slice().sort(), eigene["inf8-x-r"].items[1].steps.slice().sort());
    assert.notDeepEqual(reihe.steps, eigene["inf8-x-r"].items[1].steps, "die Schritte kommen nicht in der richtigen Reihenfolge an");
    assert.equal(/expected|answer|"pairs"/.test(JSON.stringify(start.data)), false, "Lösungen gehen nicht an das Kind");
    // zwei von drei Schritten an der richtigen Stelle sind nicht möglich; hier: nur der letzte stimmt
    const abgabe = await post("/api/inf8/submit", { testId: "inf8-x-r", code: "222",
      answers: [2, ["Dann zuschneiden", "Zuerst öffnen", "Am Ende exportieren"], ["kann durchsichtig sein", "gut für Fotos", "Arbeitsdatei von GIMP"]] });
    assert.equal(abgabe.status, 200);
    assert.deepEqual(abgabe.data.result.details.map((d) => d.points), [1, 1, 3]);
    assert.deepEqual(abgabe.data.result.details[1].expected, eigene["inf8-x-r"].items[1].steps);
    assert.equal((await post("/api/inf8/submit", { testId: "inf8-x-r", code: "222", answers: [0, [], []] })).status, 409, "nur eine Abgabe");
    assert.ok(fs.existsSync(path.join(dataDir, "inf8-proben.json")) && !fs.existsSync(path.join(dataDir, "nt7-proben.json")));
    const noten = await post("/api/inf8/teacher/results", { password: PW, testId: "inf8-x-r" });
    assert.equal(noten.data.submissions.length, 1);
  });
});

test("Proben ohne KI: Formeln als Stichwörter – Leerzeichen zählen nicht, weiterrechnen zählt nicht", async () => {
  const formel = (prompt) => ({ type: "text", prompt, expected: "Die Formel heißt =B3/$B$6.", criteria: ["richtige Formel"], keywords: ["=b3/$b$6|=b3/b$6"], points: 1, dicht: true });
  const eigene = { "inf8-f-m": { id: "inf8-f-m", zug: "M", thema: "excel2", minutes: 15, title: "Testprobe Formeln (8M)", scope: "Test", items: [
    formel("Formel eins?"), formel("Formel zwei?"), formel("Formel drei?"), formel("Formel vier?"), formel("Formel fünf?"),
    { type: "text", prompt: "Warum steht dort eine Null?", expected: "Die Zelle ist leer.", criteria: ["leere Zelle"], keywords: ["leer"], points: 1 }
  ] } };
  const key = process.env.ANTHROPIC_API_KEY; delete process.env.ANTHROPIC_API_KEY;
  try {
    await mitServer((app, dataDir) => {
      registerNt7Routes(app, { dataDir, teacherPassword: PW, kindZumCode, prefix: "/api/inf8", datei: "inf8-proben.json", tests: eigene, fach: "Informatik", service: "inf8-proben", csvName: "informatik8-proben.csv" });
    }, async ({ post }) => {
      await post("/api/inf8/teacher/unlock", { password: PW, testId: "inf8-f-m", open: true });
      assert.equal((await post("/api/inf8/start", { testId: "inf8-f-m", code: "111" })).status, 200);
      const abgabe = await post("/api/inf8/submit", { testId: "inf8-f-m", code: "111",
        answers: ["= B3 / $B$6", "c) =B3/$B$6*100", "=B3 / $B$6 * 100", "1. =b3/b$6 2. fertig", "B3/$B$6", "Die Zelle ist  leer."] });
      assert.equal(abgabe.status, 200);
      assert.deepEqual(abgabe.data.result.details.map((d) => d.points), [1, 0, 0, 1, 0, 1]);
    });
  } finally { if (key) process.env.ANTHROPIC_API_KEY = key; }
});

test("KI-Rückmeldung: eigene Route, das Fach steht im Auftrag an die KI", async () => {
  let system = "";
  await mitServer((app) => {
    registerNt7UebungRoutes(app, { askAnthropic: async (s) => { system = s; return '{"richtig": false, "teilweise": true, "rueckmeldung": "Guter Anfang.", "tipp": "Schau auf die Adresse."}'; },
      route: "/api/inf8/uebung/feedback", klasse: "Klasse 8", fach: "Informatik", thema: "Informatik" });
  }, async ({ post }) => {
    const r = await post("/api/inf8/uebung/feedback", { frage: "Woran erkennst du eine Phishing-Mail?", erwartet: "Absender, Zeitdruck, Link", antwort: "am Absender", thema: "Phishing", keywords: ["absender"] });
    assert.equal(r.status, 200);
    assert.deepEqual([r.data.quelle, r.data.teilweise, r.data.tipp], ["ki", true, "Schau auf die Adresse."]);
    assert.match(system, /Übungsaufgabe in Informatik, Klasse 8/);
    assert.match(system, /Thema: Phishing/);
  });
});

/* ---------- Die echten Proben (inf8-fragen.js) ---------- */
// die fünf Modul-Proben; Probe 1b und 2b (nach den Hefteinträgen) haben eigene Regeln, siehe unten
const IDS = Object.keys(proben).filter((id) => /^inf8-p[1-5]-[rm]$/.test(id));

test("Proben: Kennungen, Zug, Modul und Dauer", () => {
  IDS.forEach((id) => {
    const p = proben[id];
    assert.match(id, /^inf8-p[1-5]-[rm]$/, id);
    assert.equal(p.id, id);
    assert.equal(p.zug, id.endsWith("-r") ? "R" : "M", id);
    assert.equal(p.thema, MODULE[Number(id[6]) - 1], id + ": Modul passt nicht zur Nummer");
    assert.match(p.title, p.zug === "R" ? /\(8R\)/ : /\(8M\)/, id);
    assert.ok(p.minutes >= 15 && p.minutes <= 20, id + ": 15 bis 20 Minuten");
  });
  // je Probe gibt es beide Fassungen
  IDS.forEach((id) => assert.ok(IDS.includes(id.replace(/-[rm]$/, id.endsWith("-r") ? "-m" : "-r")), id + ": andere Fassung fehlt"));
});

test("Proben: kurz und auswertbar", () => {
  IDS.forEach((id) => {
    const p = proben[id], punkte = p.items.reduce((s, i) => s + i.points, 0);
    assert.ok(p.items.length >= 8 && p.items.length <= 13, `${id}: ${p.items.length} Aufgaben`);
    assert.ok(punkte >= 16 && punkte <= 26, `${id}: ${punkte} Punkte`);
    const frei = p.items.filter((i) => i.type === "text").length;
    assert.ok(p.zug === "R" ? frei <= 1 : frei >= 2 && frei <= 3, `${id}: ${frei} freie Antworten`);
    p.items.forEach((it, n) => {
      const wo = `${id} Aufgabe ${n + 1}`;
      assert.ok(it.prompt && it.prompt.length > 10, wo);
      if (it.type === "choice") {
        assert.ok(it.options.length >= 3 && it.options.length <= 4, wo);
        assert.equal(new Set(it.options).size, it.options.length, wo + ": doppelte Antwort");
        assert.ok(Number.isInteger(it.answer) && it.answer >= 0 && it.answer < it.options.length, wo);
        assert.equal(it.points, 1, wo);
        // Die richtige Antwort darf nicht an ihrer Länge zu erkennen sein
        const laengen = it.options.map((x) => x.length), andere = Math.max(...laengen.filter((_, i) => i !== it.answer));
        assert.ok(laengen[it.answer] - andere <= 6, wo + ": die richtige Antwort ist deutlich die längste – Antworten angleichen");
      } else if (it.type === "match") {
        assert.ok(it.pairs.length >= 3 && it.pairs.length <= 5, wo);
        assert.equal(new Set(it.pairs.map((x) => x[1])).size, it.pairs.length, wo + ": Ziel kommt doppelt vor");
        assert.equal(new Set(it.pairs.map((x) => x[0])).size, it.pairs.length, wo + ": Begriff kommt doppelt vor");
        assert.equal(it.points, it.pairs.length, wo);
        const sortiert = it.pairs.map((x) => x[1]).sort((a, b) => a.localeCompare(b, "de"));
        assert.ok(it.pairs.some((x, i) => sortiert.indexOf(x[1]) !== i), wo + ": Lösung wäre „der Reihe nach“ – Paare umstellen");
      } else if (it.type === "order") {
        assert.ok(it.steps.length >= 3 && it.steps.length <= 6, wo);
        assert.equal(new Set(it.steps).size, it.steps.length, wo + ": Schritt kommt doppelt vor");
        assert.equal(it.points, it.steps.length, wo);
        const sortiert = it.steps.slice().sort((a, b) => a.localeCompare(b, "de"));
        assert.ok(it.steps.filter((s, i) => sortiert[i] === s).length <= 1, wo + ": gemischte Anzeige verrät die Reihenfolge – Schritte umformulieren");
      } else {
        assert.equal(it.type, "text", wo);
        assert.ok(it.expected.length > 15, wo);
        assert.equal(it.criteria.length, it.points, wo + ": ein Kriterium je Punkt");
        assert.equal(it.keywords.length, it.points, wo + ": eine Stichwortgruppe je Punkt");
        const klein = it.expected.toLocaleLowerCase("de");
        it.keywords.forEach((g, k) => assert.ok(g.split("|").some((w) => klein.includes(w)), `${wo}: Musterlösung erfüllt Stichwortgruppe ${k + 1} nicht`));
      }
      if (it.image) assert.match(it.image, /^assets\/proben\/[a-z0-9-]+\.(svg|png)$/, wo);
    });
    const stellen = p.items.filter((i) => i.type === "choice").map((i) => i.answer);
    if (stellen.length >= 4) assert.ok(new Set(stellen).size >= 3, `${id}: richtige Antworten liegen zu oft an derselben Stelle (${stellen.join(",")})`);
  });
});

test("Proben: R- und M-Fassung prüfen denselben Stoff, die M-Fassung verlangt mehr eigene Worte", () => {
  IDS.filter((id) => id.endsWith("-r")).forEach((id) => {
    const r = proben[id], m = proben[id.replace(/-r$/, "-m")];
    const frei = (p) => p.items.filter((i) => i.type === "text").reduce((s, i) => s + i.points, 0);
    assert.ok(frei(m) > frei(r), id + ": M-Fassung braucht mehr Punkte aus freien Antworten");
  });
});

test("Proben: nur Kinder der 8. Klassen können eine Probe von Informatik 8 beginnen", async () => {
  const eigene = { "inf8-x-m": { id: "inf8-x-m", zug: "M", thema: "infosys", minutes: 15, title: "Testprobe (8M)", scope: "Test", items: [
    { type: "choice", prompt: "Welche Antwort stimmt hier?", options: ["A", "B", "C"], answer: 0, points: 1 }] } };
  const kinder = async (code) => (code === "111" ? { code: "111", klasse: "8aM" } : code === "333" ? { code: "333", klasse: "7aM" } : null);
  await mitServer((app, dataDir) => {
    registerNt7Routes(app, { dataDir, teacherPassword: PW, kindZumCode: kinder, prefix: "/api/inf8", datei: "inf8-proben.json", tests: eigene, fach: "Informatik", stufe: 8 });
  }, async ({ post }) => {
    await post("/api/inf8/teacher/unlock", { password: PW, testId: "inf8-x-m", open: true });
    const fremd = await post("/api/inf8/start", { testId: "inf8-x-m", code: "333" });
    assert.deepEqual([fremd.status, fremd.data.error], [403, "falsche_stufe"]);
    assert.equal((await post("/api/inf8/start", { testId: "inf8-x-m", code: "111" })).status, 200);
  });
});

/* ---------- Probe 1b und 2b: nach den Hefteinträgen der Module 1 und 2 (18.10.2026) ----------
   Wunsch der Lehrkraft: wie Informatik 7 Probe 1b – nur Anklicken, je eine kurze Aufgabe für die KI, dieselbe Probe
   für 8R und 8M, Notenschlüssel R für beide. */
const HEFT = { "inf8-p1b": "infosys", "inf8-p2b": "daten" };

test("Probe 1b und 2b: R und M gleich, nur Anklicken plus eine KI-Aufgabe, R-Schlüssel", () => {
  Object.keys(HEFT).forEach((basis) => {
    const r = proben[basis + "-r"], m = proben[basis + "-m"];
    [r, m].forEach((p) => {
      const id = p.id;
      assert.equal(p.thema, HEFT[basis], id);
      assert.equal(p.notenzug, "R", id + ": Notenschlüssel R für beide Züge");
      assert.match(p.title, p.zug === "R" ? /\(8R\)/ : /\(8M\)/, id);
      const arten = p.items.map((i) => i.type);
      assert.equal(arten.filter((a) => a === "text").length, 1, id + ": genau eine Aufgabe für die KI");
      assert.ok(arten.every((a) => ["choice", "match", "order", "tf", "multi", "text"].includes(a)), id);
      const module = [...new Set(p.items.map((i) => i.modul))];
      assert.equal(module.length, 4, id + ": alle vier Einheiten kommen vor");
      p.items.forEach((it, n) => {
        const wo = `${id} Aufgabe ${n + 1}`;
        assert.ok(it.modulTitel, wo + ": Einheit fehlt");
        if (it.type === "choice") {
          assert.equal(new Set(it.options).size, it.options.length, wo);
          const laengen = it.options.map((x) => x.length), andere = Math.max(...laengen.filter((_, i) => i !== it.answer));
          assert.ok(laengen[it.answer] - andere <= 6, wo + ": die richtige Antwort ist deutlich die längste");
        }
        if (it.type === "match") {
          assert.equal(new Set(it.pairs.map((x) => x[1])).size, it.pairs.length, wo);
          const sortiert = it.pairs.map((x) => x[1]).sort((a, b) => a.localeCompare(b, "de"));
          assert.ok(it.pairs.some((x, i) => sortiert.indexOf(x[1]) !== i), wo + ": Lösung wäre „der Reihe nach“");
        }
        if (it.type === "order") {
          const sortiert = it.steps.slice().sort((a, b) => a.localeCompare(b, "de"));
          assert.ok(it.steps.filter((s, i) => sortiert[i] === s).length <= 1, wo + ": gemischte Anzeige verrät die Reihenfolge");
        }
        if (it.type === "tf") {
          assert.equal(it.points, it.statements.length, wo);
          assert.ok(it.statements.some((x) => x[1]) && it.statements.some((x) => !x[1]), wo);
          if (it.wahl) assert.ok(it.wahl.length === 2 && it.wahl.every((w) => typeof w === "string" && w), wo);
        }
        if (it.type === "multi") assert.equal(it.points, it.answers.length, wo);
        if (it.type === "text") {
          assert.equal(it.criteria.length, it.points, wo);
          assert.equal(it.keywords.length, it.points, wo);
          const klein = it.expected.toLocaleLowerCase("de");
          it.keywords.forEach((g, k) => assert.ok(g.split("|").some((w) => klein.includes(w)), `${wo}: Musterlösung erfüllt Stichwortgruppe ${k + 1} nicht`));
        }
      });
      const punkte = p.items.reduce((s, i) => s + i.points, 0);
      assert.ok(punkte >= 35 && punkte <= 50, id + ": " + punkte + " Punkte");
    });
    const inhalt = (p) => p.items.map((i) => i.prompt + "|" + (i.options || []).slice().sort().join("/"));
    assert.deepEqual(inhalt(r), inhalt(m), basis + ": R und M haben denselben Inhalt");
  });
});

test("Probe 2b: eigene Knöpfe (wahl) gehen an das Kind und stehen im Ergebnis, Note nach dem R-Schlüssel", async () => {
  await mitServer((app, dataDir) => {
    registerNt7Routes(app, { dataDir, teacherPassword: PW, kindZumCode, prefix: "/api/inf8", datei: "inf8-proben.json", tests: proben, fach: "Informatik", stufe: 8 });
  }, async ({ post }) => {
    const alt = process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    try {
      const kind = "111";   // 8aM
      await post("/api/inf8/teacher/unlock", { password: PW, testId: "inf8-p2b-m", open: true });
      const start = await post("/api/inf8/start", { testId: "inf8-p2b-m", code: kind });
      assert.equal(start.status, 200, JSON.stringify(start.data));
      const nrTf = start.data.items.findIndex((i) => i.type === "tf" && /Rätselrakete/.test(i.prompt));
      assert.deepEqual(start.data.items[nrTf].wahl, ["ausfüllen", "leer lassen"]);
      const p = proben["inf8-p2b-m"];
      const richtig = (it) => (it.type === "choice" ? it.answer : it.type === "match" ? it.pairs.map((x) => x[1]) : it.type === "order" ? it.steps.slice()
        : it.type === "tf" ? it.statements.map((x) => x[1]) : it.type === "multi" ? it.answers.slice() : null);
      // die Pflichtfeld-Aufgabe richtig, dann weitere Klick-Aufgaben, bis genau die Hälfte der Punkte (aufgerundet) erreicht ist
      const gesamt = p.items.reduce((s, i) => s + i.points, 0), ziel = Math.ceil(gesamt / 2);
      let summe = p.items[nrTf].points;
      const antworten = p.items.map((it, i) => {
        if (i === nrTf) return richtig(it);
        if (it.type === "text" || summe + it.points > ziel) return null;
        summe += it.points;
        return richtig(it);
      });
      assert.equal(summe, ziel, "Testaufbau: genau die Hälfte");
      const r = await post("/api/inf8/submit", { testId: "inf8-p2b-m", code: kind, answers: antworten });
      assert.equal(r.status, 200);
      const res = (await post("/api/inf8/teacher/results", { password: PW, testId: "inf8-p2b-m" })).data.submissions[0];
      const d = res.details[nrTf];
      assert.deepEqual(d.given, ["ausfüllen", "leer lassen", "ausfüllen", "leer lassen"]);
      assert.deepEqual(d.expected, d.given);
      assert.equal(d.points, 4);
      assert.equal(res.score, ziel);
      const prozent = res.score / res.total * 100;
      assert.ok(prozent >= 50 && prozent < 67, Math.round(prozent) + " %");
      assert.equal(res.zug, "M");
      assert.equal(res.grade, 3, "R-Schlüssel: 50 % = Note 3 (mit dem M-Schlüssel wäre es eine 4)");
    } finally {
      if (alt !== undefined) process.env.ANTHROPIC_API_KEY = alt;
    }
  });
});

test("Probe 1b: die Tabelle geht an das Kind und steht in der Abgabe (Rückgabe)", async () => {
  await mitServer((app, dataDir) => {
    registerNt7Routes(app, { dataDir, teacherPassword: PW, kindZumCode, prefix: "/api/inf8", datei: "inf8-proben.json", tests: proben, fach: "Informatik", stufe: 8 });
  }, async ({ post }) => {
    const kind = "111";
    await post("/api/inf8/teacher/unlock", { password: PW, testId: "inf8-p1b-m", open: true });
    const start = await post("/api/inf8/start", { testId: "inf8-p1b-m", code: kind });
    const mitTab = start.data.items.filter((i) => i.tabelle);
    assert.equal(mitTab.length, 2);
    assert.deepEqual(mitTab[0].tabelle.kopf, ["Betrieb", "Bereich", "Entfernung", "Arbeitsbeginn"]);
    const r = await post("/api/inf8/submit", { testId: "inf8-p1b-m", code: kind, answers: start.data.items.map(() => null) });
    assert.equal(r.status, 200);
    const res = (await post("/api/inf8/teacher/results", { password: PW, testId: "inf8-p1b-m" })).data.submissions[0];
    assert.equal(res.details.filter((d) => d.tabelle).length, 2);
  });
});
