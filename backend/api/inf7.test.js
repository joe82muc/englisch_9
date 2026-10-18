"use strict";

// Informatik 7: Freischalten, Proben und KI-Rückmeldung laufen über die NT-7-Module mit eigenem Präfix.
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const proben = require("./inf7-fragen");
const { registerNt7Routes } = require("./nt7");
const { registerNt7FreigabeRoutes } = require("./nt7-freigabe");
const { registerNt7UebungRoutes } = require("./nt7-uebung");

const PW = "lehrer-geheim";
const kindZumCode = async (code) => (code === "111" ? { code: "111", klasse: "7aM", zug: "7M" }
  : code === "222" ? { code: "222", klasse: "7d", zug: "7R" } : null);
const MODULE = ["sicher", "filius", "gimp", "inkscape", "scratch"];

async function mitServer(aufbau, lauf) {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "inf7-test-"));
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

test("Freischalten: Informatik 7 hat einen eigenen Stand neben NT 7", async () => {
  await mitServer((app, dataDir) => {
    registerNt7FreigabeRoutes(app, { dataDir, teacherPassword: PW, kindZumCode });
    registerNt7FreigabeRoutes(app, { dataDir, teacherPassword: PW, kindZumCode, prefix: "/api/inf7", datei: "inf7-freigabe.json", name: "Informatik-7-Freigabe" });
  }, async ({ post, dataDir }) => {
    let r = await post("/api/inf7/lehrer/freigabe/setzen", { password: PW, klasse: "7aM", art: "thema", id: "sicher", offen: true });
    assert.equal(r.status, 200);
    r = await post("/api/inf7/lehrer/freigabe/setzen", { password: PW, klasse: "7aM", art: "modul", id: "zwei-computer", offen: true });
    assert.deepEqual(r.data.module, { "zwei-computer": true });
    await post("/api/nt7/lehrer/freigabe/setzen", { password: PW, klasse: "7aM", art: "thema", id: "atome", offen: true });
    const inf = (await post("/api/inf7/freigabe", { code: "111" })).data;
    assert.deepEqual([inf.klasse, inf.zug, inf.themen, inf.module], ["7aM", "7M", { sicher: true }, { "zwei-computer": true }]);
    const nt = (await post("/api/nt7/freigabe", { code: "111" })).data;
    assert.deepEqual([nt.themen, nt.module], [{ atome: true }, {}]);
    assert.deepEqual((await post("/api/inf7/freigabe", { code: "222" })).data.themen, {}, "andere Klasse, eigener Stand");
    assert.equal((await post("/api/inf7/lehrer/freigabe/setzen", { password: "falsch", klasse: "7aM", art: "thema", id: "sicher", offen: false })).status, 401);
    assert.equal((await post("/api/inf7/freigabe", { code: "000" })).status, 401);
    assert.ok(fs.existsSync(path.join(dataDir, "inf7-freigabe.json")) && fs.existsSync(path.join(dataDir, "nt7-freigabe.json")), "zwei getrennte Dateien");
  });
});

test("Proben: eigenes Präfix, eigene Datei, Reihenfolge-Aufgaben, keine Lösungen an das Kind", async () => {
  const eigene = {
    "inf7-x-r": { id: "inf7-x-r", zug: "R", thema: "sicher", minutes: 15, title: "Testprobe (7R)", scope: "Test", items: [
      { type: "choice", prompt: "Welche Antwort stimmt hier?", options: ["A", "B", "C", "D"], answer: 2, points: 1 },
      { type: "order", prompt: "Bringe die Schritte in die richtige Reihenfolge.", steps: ["Zuerst öffnen", "Dann zuschneiden", "Am Ende exportieren"], points: 3 },
      { type: "match", prompt: "Ordne zu, was zusammengehört.", pairs: [["PNG", "kann durchsichtig sein"], ["JPG", "gut für Fotos"], ["XCF", "Arbeitsdatei von GIMP"]], points: 3 }
    ] }
  };
  await mitServer((app, dataDir) => {
    registerNt7Routes(app, { dataDir, teacherPassword: PW, kindZumCode, prefix: "/api/inf7", datei: "inf7-proben.json", tests: eigene, fach: "Informatik", service: "inf7-proben", csvName: "informatik7-proben.csv" });
  }, async ({ base, post, dataDir }) => {
    assert.equal((await fetch(base + "/api/nt7/list")).status, 404, "NT-7-Routen gibt es in dieser Instanz nicht");
    assert.equal((await (await fetch(base + "/api/inf7/health")).json()).service, "inf7-proben");
    const liste = (await (await fetch(base + "/api/inf7/list")).json()).tests;
    assert.deepEqual(liste.map((t) => [t.id, t.zug, t.thema, t.maxPoints, t.unlocked]), [["inf7-x-r", "R", "sicher", 7, false]]);
    assert.equal((await post("/api/inf7/start", { testId: "inf7-x-r", code: "222" })).status, 403, "gesperrt");
    assert.equal((await post("/api/inf7/teacher/unlock", { password: PW, testId: "inf7-x-r", open: true })).status, 200);
    assert.equal((await post("/api/inf7/start", { testId: "inf7-x-r", code: "111" })).status, 403, "M-Kind in der R-Probe");
    const start = await post("/api/inf7/start", { testId: "inf7-x-r", code: "222" });
    assert.equal(start.status, 200);
    const reihe = start.data.items[1];
    assert.equal(reihe.type, "order");
    assert.deepEqual(reihe.steps.slice().sort(), eigene["inf7-x-r"].items[1].steps.slice().sort());
    assert.notDeepEqual(reihe.steps, eigene["inf7-x-r"].items[1].steps, "die Schritte kommen nicht in der richtigen Reihenfolge an");
    assert.equal(/expected|answer|"pairs"/.test(JSON.stringify(start.data)), false, "Lösungen gehen nicht an das Kind");
    // zwei von drei Schritten an der richtigen Stelle sind nicht möglich; hier: nur der letzte stimmt
    const abgabe = await post("/api/inf7/submit", { testId: "inf7-x-r", code: "222",
      answers: [2, ["Dann zuschneiden", "Zuerst öffnen", "Am Ende exportieren"], ["kann durchsichtig sein", "gut für Fotos", "Arbeitsdatei von GIMP"]] });
    assert.equal(abgabe.status, 200);
    assert.deepEqual(abgabe.data.result.details.map((d) => d.points), [1, 1, 3]);
    assert.deepEqual(abgabe.data.result.details[1].expected, eigene["inf7-x-r"].items[1].steps);
    assert.equal((await post("/api/inf7/submit", { testId: "inf7-x-r", code: "222", answers: [0, [], []] })).status, 409, "nur eine Abgabe");
    assert.ok(fs.existsSync(path.join(dataDir, "inf7-proben.json")) && !fs.existsSync(path.join(dataDir, "nt7-proben.json")));
    const noten = await post("/api/inf7/teacher/results", { password: PW, testId: "inf7-x-r" });
    assert.equal(noten.data.submissions.length, 1);
  });
});

test("KI-Rückmeldung: eigene Route, das Fach steht im Auftrag an die KI", async () => {
  let system = "";
  await mitServer((app) => {
    registerNt7UebungRoutes(app, { askAnthropic: async (s) => { system = s; return '{"richtig": false, "teilweise": true, "rueckmeldung": "Guter Anfang.", "tipp": "Schau auf die Adresse."}'; },
      route: "/api/inf7/uebung/feedback", klasse: "Klasse 7", fach: "Informatik", thema: "Informatik" });
  }, async ({ post }) => {
    const r = await post("/api/inf7/uebung/feedback", { frage: "Woran erkennst du eine Phishing-Mail?", erwartet: "Absender, Zeitdruck, Link", antwort: "am Absender", thema: "Phishing", keywords: ["absender"] });
    assert.equal(r.status, 200);
    assert.deepEqual([r.data.quelle, r.data.teilweise, r.data.tipp], ["ki", true, "Schau auf die Adresse."]);
    assert.match(system, /Übungsaufgabe in Informatik, Klasse 7/);
    assert.match(system, /Thema: Phishing/);
  });
});

/* ---------- Die echten Proben (inf7-fragen.js) ---------- */
// die fünf Modul-Proben; Probe 1b (nach den Hefteinträgen) hat eigene Regeln, siehe unten
const IDS = Object.keys(proben).filter((id) => /^inf7-p[1-5]-[rm]$/.test(id));

test("Proben: Kennungen, Zug, Modul und Dauer", () => {
  IDS.forEach((id) => {
    const p = proben[id];
    assert.match(id, /^inf7-p[1-5]-[rm]$/, id);
    assert.equal(p.id, id);
    assert.equal(p.zug, id.endsWith("-r") ? "R" : "M", id);
    assert.equal(p.thema, MODULE[Number(id[6]) - 1], id + ": Modul passt nicht zur Nummer");
    assert.match(p.title, p.zug === "R" ? /\(7R\)/ : /\(7M\)/, id);
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

/* ---------- Probe 1b: nach den Hefteinträgen der Einheiten 1 bis 3 (18.10.2026) ----------
   Wunsch der Lehrkraft: nur Anklicken, keine offenen Fragen, dazu eine E-Mail (An, Cc, Bcc, Anhang = Schlüssel,
   Betreff und Text = KI), dieselbe Probe für 7R und 7M, Notenschlüssel R für beide. */
const HEFT = ["inf7-p1b-r", "inf7-p1b-m"];

test("Probe 1b: R und M gleich, nur Anklicken plus eine E-Mail, R-Schlüssel", () => {
  HEFT.forEach((id) => {
    const p = proben[id];
    assert.equal(p.id, id);
    assert.equal(p.zug, id.endsWith("-r") ? "R" : "M");
    assert.equal(p.thema, "sicher");
    assert.equal(p.notenzug, "R", id + ": Notenschlüssel R für beide Züge");
    assert.match(p.title, p.zug === "R" ? /\(7R\)/ : /\(7M\)/);
    const arten = p.items.map((i) => i.type);
    assert.equal(arten.filter((a) => a === "text").length, 0, id + ": keine offenen Fragen");
    assert.equal(arten.filter((a) => a === "email").length, 1, id + ": genau eine E-Mail");
    assert.ok(arten.every((a) => ["choice", "match", "order", "tf", "multi", "email"].includes(a)), id + ": nur Klick-Aufgaben");
    ["alltag", "sicher-gefaehrlich", "rechte"].forEach((e) => assert.ok(p.items.filter((i) => i.modul === e).length >= 4, id + ": zu wenig Aufgaben aus " + e));
    p.items.forEach((it, n) => {
      const wo = `${id} Aufgabe ${n + 1}`;
      assert.ok(it.modulTitel, wo + ": Einheit fehlt");
      if (it.type === "choice") {
        assert.equal(new Set(it.options).size, it.options.length, wo);
        const laengen = it.options.map((x) => x.length), andere = Math.max(...laengen.filter((_, i) => i !== it.answer));
        assert.ok(laengen[it.answer] - andere <= 8, wo + ": die richtige Antwort ist deutlich die längste");
      }
      if (it.type === "match") assert.equal(new Set(it.pairs.map((x) => x[1])).size, it.pairs.length, wo);
      if (it.type === "tf") { assert.equal(it.points, it.statements.length, wo); assert.ok(it.statements.some((x) => x[1]) && it.statements.some((x) => !x[1]), wo); }
      if (it.type === "multi") assert.equal(it.points, it.answers.length, wo);
      if (it.type === "email") {
        assert.equal(it.points, 4 + it.criteria.length, wo);
        assert.equal(it.keywords.length, it.criteria.length, wo);
        ["an", "cc", "bcc"].forEach((k) => assert.ok(it.kontakte.some((x) => x.adresse === it.soll[k]), wo + ": Kontakt für " + k));
        assert.ok(it.dateien.includes(it.soll.anhang) && it.dateien[0] !== it.soll.anhang, wo);
        const klein = it.textBeispiel.toLocaleLowerCase("de");
        it.keywords.forEach((g, k) => assert.ok(g.split("|").some((w) => klein.includes(w)), `${wo}: Beispiel erfüllt Stichwortgruppe ${k + 1} nicht`));
      }
    });
    const punkte = p.items.reduce((s, i) => s + i.points, 0);
    assert.ok(punkte >= 40 && punkte <= 60, id + ": " + punkte + " Punkte");
  });
  // derselbe Inhalt (nur die Antwortreihenfolge ist je Kennung anders gemischt)
  const inhalt = (p) => p.items.map((i) => i.prompt + "|" + (i.options || []).slice().sort().join("/"));
  assert.deepEqual(inhalt(proben["inf7-p1b-r"]), inhalt(proben["inf7-p1b-m"]));
});

test("Probe 1b: E-Mail wird nach Schlüssel und KI bewertet, die Note nach dem R-Schlüssel", async () => {
  const KI = [];
  await mitServer((app, dataDir) => {
    registerNt7Routes(app, { dataDir, teacherPassword: PW, kindZumCode, prefix: "/api/inf7", datei: "inf7-proben.json", tests: proben, fach: "Informatik",
      kiGeduldMs: 5000, askAnthropic: async (s, u) => { KI.push(JSON.parse(u)); return '{"points": 3, "comment": "Höflich, nur der Gruß fehlt."}'; } });
  }, async ({ base, post }) => {
    const alt = process.env.ANTHROPIC_API_KEY;
    process.env.ANTHROPIC_API_KEY = "test";
    try {
      assert.equal((await post("/api/inf7/teacher/unlock", { password: PW, testId: "inf7-p1b-m", open: true })).status, 200);
      const start = await post("/api/inf7/start", { testId: "inf7-p1b-m", code: "111" });
      assert.equal(start.status, 200);
      const nr = start.data.items.findIndex((i) => i.type === "email");
      const mail = start.data.items[nr];
      assert.equal(mail.kontakte.length, 3);
      assert.ok(mail.dateien.length >= 3);
      assert.equal(/"soll"|nowak@schule\.example"?,"cc"|textBeispiel|criteria|keywords/.test(JSON.stringify(mail)), false, "kein Schlüssel an das Kind");
      const leer = start.data.items.map(() => null);
      // Bcc und Cc vertauscht, Großschreibung und Leerzeichen sind egal
      leer[nr] = { an: [" Nowak@Schule.example "], cc: ["papa@post.example"], bcc: ["ben@post.example"], betreff: "Referat Bienen",
        text: "Sehr geehrte Frau Nowak,\nim Anhang ist mein Referat über Bienen.\nViele Grüße\nLea", anhang: "referat-bienen.pdf" };
      const abgabe = await post("/api/inf7/submit", { testId: "inf7-p1b-m", code: "111", answers: leer });
      assert.equal(abgabe.status, 200);
      const d = abgabe.data.result.details[nr];
      assert.equal(d.type, "email");
      assert.equal(d.feldPunkte, 2, "An und Anhang richtig, Cc und Bcc vertauscht");
      assert.equal(d.points, 5, "2 Schlüssel + 3 KI");
      assert.equal(d.source, "ki");
      assert.match(d.comment, /✓ An · ✗ Cc \(richtig: ben@post\.example\) · ✗ Bcc/);
      assert.match(d.given, /^An: nowak@schule\.example\nCc: papa@post\.example/);
      assert.equal(KI.length, 1, "nur die E-Mail geht an die KI");
      assert.match(KI[0].studentAnswer, /^Betreff: Referat Bienen/);
      assert.equal(KI[0].criteria.length, 4, "die KI bewertet nur Betreff und Text");
      // M-Kind, aber R-Schlüssel: 5 von 53 Punkten (9 %) = Note 6; der Schlüssel zeigt sich an 50 %
      const res = (await post("/api/inf7/teacher/results", { password: PW, testId: "inf7-p1b-m" })).data.submissions[0];
      assert.equal(res.zug, "M");
      assert.equal(res.total, 53);
      // Lehrkraft setzt die E-Mail auf volle Punkte – erlaubt wie bei freien Antworten
      const ov = await post("/api/inf7/teacher/override", { password: PW, submissionId: res.id, nr: nr + 1, points: 8 });
      assert.equal(ov.status, 200);
      assert.equal(ov.data.score, 8);
    } finally {
      if (alt === undefined) delete process.env.ANTHROPIC_API_KEY; else process.env.ANTHROPIC_API_KEY = alt;
    }
  });
});

test("Probe 1b: Note nach R-Schlüssel auch für M-Kinder (50 % = Note 3)", async () => {
  await mitServer((app, dataDir) => {
    registerNt7Routes(app, { dataDir, teacherPassword: PW, kindZumCode, prefix: "/api/inf7", datei: "inf7-proben.json", tests: proben, fach: "Informatik" });
  }, async ({ post }) => {
    const alt = process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    try {
      await post("/api/inf7/teacher/unlock", { password: PW, testId: "inf7-p1b-m", open: true });
      const p = proben["inf7-p1b-m"];
      // genau die Hälfte der Punkte richtig: Klick-Aufgaben der Reihe nach richtig beantworten, bis 27 von 53 erreicht sind
      let summe = 0;
      const antworten = p.items.map((it) => {
        if (summe + it.points > 27 || it.type === "email") return null;
        summe += it.points;
        if (it.type === "choice") return it.answer;
        if (it.type === "match") return it.pairs.map((x) => x[1]);
        if (it.type === "order") return it.steps.slice();
        if (it.type === "tf") return it.statements.map((x) => x[1]);
        if (it.type === "multi") return it.answers.slice();
        return null;
      });
      const r = await post("/api/inf7/submit", { testId: "inf7-p1b-m", code: "111", answers: antworten });
      assert.equal(r.status, 200);
      const res = (await post("/api/inf7/teacher/results", { password: PW, testId: "inf7-p1b-m" })).data.submissions[0];
      assert.equal(res.score, summe);
      assert.ok(res.percent >= 50 && res.percent < 67, res.percent + " %");
      assert.equal(res.grade, 3, "R-Schlüssel: 50 % = Note 3 (mit dem M-Schlüssel wäre es eine 4)");
    } finally {
      if (alt !== undefined) process.env.ANTHROPIC_API_KEY = alt;
    }
  });
});
