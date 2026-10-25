"use strict";

// Informatik 9, Probe 1b (25.10.2026): nur Einheit N1, gleiche Probe für 9M und 9R, R-Schlüssel (50 % = Note 3),
// Praxisteil: in Filius zwei Rechner verbinden und die .fls abgeben (Aufgabenart "filius" in nt7.js).
// Die Dateien in ../dateien/inf9-p1b/ sind mit Filius 2.14.0 gebaut (richtig, Adresse falsch, dritter Rechner,
// drei Rechner ohne Kabel, andere Namen).
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const proben = require("./inf9-fragen");
const { registerNt7Routes } = require("./nt7");
const { vorschau } = require("./proben-vorschau");

const PW = "lehrer-geheim";
const DATEIEN = path.join(__dirname, "..", "dateien", "inf9-p1b");
const datei = (name) => ({ name, data: fs.readFileSync(path.join(DATEIEN, name)).toString("base64") });
const CODES = { "111": { code: "111", klasse: "9aM", zug: "9M" }, "222": { code: "222", klasse: "9b", zug: "9R" } };
for (let i = 0; i < 20; i++) CODES[String(600 + i)] = { code: String(600 + i), klasse: i % 2 ? "9b" : "9aM", zug: i % 2 ? "9R" : "9M" };
const kindZumCode = async (code) => CODES[code] || null;

async function mitServer(extra, lauf) {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "inf9-p1b-"));
  const app = express();
  app.use(express.json({ limit: "2mb" }));
  registerNt7Routes(app, { dataDir, teacherPassword: PW, kindZumCode, prefix: "/api/inf9", datei: "inf9-proben.json", tests: proben, fach: "Informatik", stufe: 9, notenzug: "R", ...extra });
  const server = await new Promise((resolve) => { const s = app.listen(0, () => resolve(s)); });
  const post = (route, body) => fetch(`http://127.0.0.1:${server.address().port}` + route, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
    .then(async (r) => ({ status: r.status, data: await r.json().catch(() => null) }));
  const get = (route) => fetch(`http://127.0.0.1:${server.address().port}` + route).then((r) => r.json());
  try { await lauf({ post, get }); }
  finally { await new Promise((resolve) => server.close(resolve)); fs.rmSync(dataDir, { recursive: true, force: true }); }
}

const P = proben["inf9-p1b-r"];
const NR_FILIUS = P.items.findIndex((i) => i.type === "filius"), NR_PING = P.items.findIndex((i) => i.type === "text");
// richtige Antworten der Seite (die Probe ist schon gemischt: answer zeigt auf die richtige Stelle)
function richtigeAntworten(fls) {
  return P.items.map((it) => it.type === "choice" ? it.answer : it.type === "match" ? it.pairs.map((p) => p[1])
    : it.type === "tf" ? it.statements.map((s) => s[1]) : it.type === "text" ? "ping 192.168.0.21" : it.type === "filius" ? (fls ? datei(fls) : null) : null);
}

test("Probe 1b: zwei Kennungen mit demselben Inhalt, 20 Punkte, nur N1-Stoff, Praxisteil mit Filius", () => {
  for (const id of ["inf9-p1b-r", "inf9-p1b-m"]) {
    const p = proben[id];
    assert.ok(p, id + " fehlt");
    assert.equal(p.thema, "netzwerke");
    assert.equal(p.items.reduce((s, i) => s + i.points, 0), 20, id + ": 20 Punkte (10 = 50 % = Note 3)");
    assert.deepEqual([p.wegSekunden, p.kopieren], [0, 0], id + ": Wechsel zu Filius und Kopieren der Adressen geben keine Note 6");
  }
  assert.deepEqual(proben["inf9-p1b-r"].items, proben["inf9-p1b-m"].items, "9R und 9M: gleiche Aufgaben, gleiche Reihenfolge");
  const f = P.items[NR_FILIUS];
  assert.equal(f.points, f.checks.reduce((s, c) => s + c.punkte, 0) + f.kiPunkte);
  assert.deepEqual(f.checks.map((c) => c.typ), ["endgeraete", "kabel", "ip", "ip"]);
  assert.ok(NR_PING === P.items.length - 1 && NR_FILIUS === NR_PING - 1, "Praxisteil steht am Ende");
  // Richtig/falsch wird nicht gemischt: nicht nur richtig oder nur falsch hintereinander
  const tf = P.items.find((i) => i.type === "tf").statements.map((s) => s[1]);
  assert.ok(tf.includes(true) && tf.includes(false));
  // Vorschau der Lehrkraft: Datei-Aufgabe mit Prüfpunkten und KI-Kriterium
  const v = vorschau("nt", P), d = v.items[NR_FILIUS];
  assert.equal(v.total, 20);
  assert.equal(d.type, "datei");
  assert.equal(d.checks.length, 4);
  assert.equal(d.kiPunkte, 1);
  assert.match(d.kiKriterien[0], /Kasse/);
  assert.match(d.prompt, /192\.168\.0\.21/);
});

test("Probe 1b: Liste und Start – ohne Note-6-Regel, Prüfpunkte bleiben auf dem Server", async () => {
  await mitServer({}, async ({ post, get }) => {
    const liste = (await get("/api/inf9/list")).tests.find((t) => t.id === "inf9-p1b-m");
    assert.deepEqual([liste.maxPoints, liste.wegSekunden, liste.kopieren, liste.notenzug, liste.unlocked], [20, 0, 0, "R", false], "zuerst gesperrt");
    await post("/api/inf9/teacher/unlock", { password: PW, testId: "inf9-p1b-m", open: true });
    const start = await post("/api/inf9/start", { testId: "inf9-p1b-m", code: "111" });
    assert.equal(start.status, 200);
    assert.deepEqual([start.data.test.wegSekunden, start.data.test.kopieren], [0, 0]);
    const f = start.data.items[NR_FILIUS];
    assert.equal(f.type, "filius");
    assert.equal(f.aufgabe.length, 6);
    assert.ok(f.image && f.imageAlt);
    assert.equal(f.checks, undefined, "Prüfpunkte nicht an die Seite");
    assert.equal(f.kiKriterien, undefined);
    assert.equal(JSON.stringify(start.data).includes("192.168.0.21\",\"punkte"), false);
  });
});

test("Probe 1b ohne KI: Filius-Datei nach dem Prüfprogramm, KI-Punkt anteilig; 9M und 9R nach dem R-Schlüssel", async () => {
  const altKey = process.env.ANTHROPIC_API_KEY;
  delete process.env.ANTHROPIC_API_KEY;
  try {
    await mitServer({}, async ({ post }) => {
      for (const id of ["inf9-p1b-r", "inf9-p1b-m"]) await post("/api/inf9/teacher/unlock", { password: PW, testId: id, open: true });
      const faelle = [
        // [Code, Datei, Punkte der Filius-Aufgabe (4 Prüfpunkte + 1 KI-Punkt anteilig)]
        ["600", "richtig.fls", 5], ["601", "adresse-falsch.fls", 4], ["602", "drei-rechner.fls", 4],
        ["603", "drei-ohne-kabel.fls", 3], ["604", "andere-namen.fls", 5], ["605", null, 0]
      ];
      for (const [code, fls, soll] of faelle) {
        const id = CODES[code].zug === "9M" ? "inf9-p1b-m" : "inf9-p1b-r";
        assert.equal((await post("/api/inf9/start", { testId: id, code })).status, 200);
        const ab = await post("/api/inf9/submit", { testId: id, code, answers: richtigeAntworten(fls) });
        assert.equal(ab.status, 200, code + " " + fls);
        const d = ab.data.result.details[NR_FILIUS];
        assert.equal(d.points, soll, (fls || "ohne Datei") + ": " + d.comment);
        assert.equal(ab.data.result.score, 15 + soll, "Teil A 14 + ping 1 + Filius");
        if (fls) {
          assert.equal(d.datei, fls);
          assert.ok(d.dateiDaten, "die Datei bleibt für die Lehrkraft in der Abgabe");
          assert.match(d.given, /Kasse|Laden/);
        } else assert.equal(d.given, "Keine Datei abgegeben.");
      }
      const alle = (await post("/api/inf9/teacher/results", { password: PW, testId: "inf9-p1b-m" })).data.submissions;
      const richtig = alle.find((s) => s.code === "600");
      assert.deepEqual([richtig.score, richtig.grade], [20, 1]);
      // keine gültige Filius-Datei
      await post("/api/inf9/start", { testId: "inf9-p1b-m", code: "606" });
      const kaputt = await post("/api/inf9/submit", { testId: "inf9-p1b-m", code: "606", answers: richtigeAntworten(null).map((a, i) => (i === NR_FILIUS ? { name: "bild.fls", data: Buffer.from("kein zip").toString("base64") } : a)) });
      assert.equal(kaputt.data.result.details[NR_FILIUS].points, 0);
      assert.match(kaputt.data.result.details[NR_FILIUS].given, /nicht gelesen werden/);
      // 10 von 20 Punkten = 50 % = Note 3, auch in 9M
      await post("/api/inf9/start", { testId: "inf9-p1b-m", code: "608" });
      const halb = richtigeAntworten(null).map((a, i) => (i <= 4 ? a : P.items[i].type === "choice" ? (P.items[i].answer + 1) % P.items[i].options.length : P.items[i].type === "text" ? "weiß ich nicht" : null));
      const h = await post("/api/inf9/submit", { testId: "inf9-p1b-m", code: "608", answers: halb });
      assert.deepEqual([h.data.result.score, h.data.result.grade], [10, 3], "die ersten fünf Aufgaben = 10 Punkte");
    });
  } finally { if (altKey !== undefined) process.env.ANTHROPIC_API_KEY = altKey; }
});

test("Probe 1b mit KI: Die KI vergibt nur den Punkt für Namen und Gesamteindruck und schreibt die Rückmeldung", async () => {
  const altKey = process.env.ANTHROPIC_API_KEY;
  process.env.ANTHROPIC_API_KEY = "test";
  const gefragt = [];
  const askAnthropic = async (system, user) => {
    gefragt.push({ system, user });
    if (/Filius-Datei/.test(system)) {
      const netz = JSON.parse(user).gebautesNetz;
      const ok = netz.geraete.some((g) => g.name === "Kasse") && netz.geraete.some((g) => g.name === "Büro");
      return JSON.stringify({ punkte: ok ? 1 : 0, text: ok ? "Namen und Adressen passen." : "Die Rechner sollten Kasse und Büro heißen." });
    }
    return JSON.stringify({ points: 1, comment: "Richtig: ping an Büro." });
  };
  try {
    await mitServer({ askAnthropic, kiGeduldMs: 5000 }, async ({ post }) => {
      await post("/api/inf9/teacher/unlock", { password: PW, testId: "inf9-p1b-r", open: true });
      const faelle = [["611", "richtig.fls", 5], ["613", "andere-namen.fls", 4]];
      for (const [code, fls, soll] of faelle) {
        await post("/api/inf9/start", { testId: "inf9-p1b-r", code });
        const ab = await post("/api/inf9/submit", { testId: "inf9-p1b-r", code, answers: richtigeAntworten(fls) });
        const d = ab.data.result.details[NR_FILIUS];
        assert.deepEqual([d.points, d.kiPunkte, d.source], [soll, soll - 4, "ki"], fls + ": " + d.comment);
        assert.match(d.comment, /✓ Genau zwei Rechner/);
        assert.match(d.comment, /KI: /);
      }
      const frage = gefragt.find((g) => /Filius-Datei/.test(g.system));
      assert.ok(frage, "die KI wurde zur Filius-Datei gefragt");
      const daten = JSON.parse(frage.user);
      assert.equal(daten.hoechstpunkte, 1);
      assert.equal(daten.gepruefteSchritte.length, 4);
      assert.deepEqual(daten.gebautesNetz.kabel, [["Kasse", "Büro"]]);
    });
  } finally { if (altKey === undefined) delete process.env.ANTHROPIC_API_KEY; else process.env.ANTHROPIC_API_KEY = altKey; }
});
