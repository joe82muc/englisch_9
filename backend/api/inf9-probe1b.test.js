"use strict";

// Informatik 9, Probe 1b (25.10.2026): nur Einheit N1, gleiche Probe für 9M und 9R, R-Schlüssel (50 % = Note 3).
// Praxis: Das Kind gibt die Filius-Datei am Ende der Einheit N1 ab (filius-modul.js, /api/inf9/filius/pruefen) und
// bekommt sofort Punkte (Prüfprogramm + KI); die Probe übernimmt beim Abgeben die beste Abgabe (nt7.js, ausModul).
// Die Dateien in ../dateien/inf9-p1b/ sind mit Filius 2.14.0 gebaut (richtig, adresse-falsch, drei-rechner,
// drei-ohne-kabel, andere-namen).
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const proben = require("./inf9-fragen");
const { AUFGABEN, maxPunkte } = require("./inf9-filius-aufgaben");
const { registerNt7Routes } = require("./nt7");
const { registerFiliusModulPruefung } = require("./filius-modul");
const { abgabenSpeicher, registerAbgabenRoutes } = require("./abgaben");
const { vorschau } = require("./proben-vorschau");

const PW = "lehrer-geheim";
const DATEIEN = path.join(__dirname, "..", "dateien", "inf9-p1b");
const b64 = (name) => fs.readFileSync(path.join(DATEIEN, name)).toString("base64");
const CODES = {};
for (let i = 0; i < 20; i++) CODES[String(600 + i)] = { code: String(600 + i), klasse: i % 2 ? "9b" : "9aM", zug: i % 2 ? "9R" : "9M" };
CODES["800"] = { code: "800", klasse: "8aM", zug: "8M" };
const kindZumCode = async (code) => CODES[code] || null;
const klasseNorm = (k) => String(k || "").trim();

// Server wie in server.js: Einheit (filius/pruefen) und Probe teilen sich den Abgaben-Speicher
async function mitServer(ki, lauf) {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "inf9-p1b-"));
  const speicher = abgabenSpeicher({ kurs: "inf9", dataDir, env: {} });
  const app = express();
  app.use(express.json({ limit: "2mb" }));
  registerNt7Routes(app, { dataDir, teacherPassword: PW, kindZumCode, prefix: "/api/inf9", datei: "inf9-proben.json", tests: proben, fach: "Informatik", stufe: 9, notenzug: "R",
    modulAbgabe: (student, kennung) => speicher.hole(klasseNorm(student.klasse), String(student.code), kennung) });
  registerFiliusModulPruefung(app, { askAnthropic: ki, prefix: "/api/inf9", aufgaben: AUFGABEN, speicher, stufe: 9, kindZumCode, klasseNorm });
  registerAbgabenRoutes(app, { prefix: "/api/inf9", stufe: 9, teacherPassword: PW, speicher, filiusAufgaben: AUFGABEN });
  const server = await new Promise((resolve) => { const s = app.listen(0, () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (route, body) => fetch(base + route, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
    .then(async (r) => ({ status: r.status, data: await r.json().catch(() => null) }));
  const get = (route) => fetch(base + route).then((r) => r.json());
  try { await lauf({ post, get, speicher }); }
  finally { await new Promise((resolve) => server.close(resolve)); fs.rmSync(dataDir, { recursive: true, force: true }); }
}
const hochladen = (post, datei, code) => post("/api/inf9/filius/pruefen", { aufgabe: "netz-start-laden", datei: b64(datei), ...(code ? { code } : {}) });

const P = proben["inf9-p1b-r"];
const NR_FILIUS = P.items.findIndex((i) => i.type === "filius");
// richtige Antworten der Seite (die Probe ist schon gemischt: answer zeigt auf die richtige Stelle); Filius: nichts
const richtigeAntworten = () => P.items.map((it) => it.type === "choice" ? it.answer : it.type === "match" ? it.pairs.map((p) => p[1])
  : it.type === "tf" ? it.statements.map((s) => s[1]) : it.type === "text" ? "ping 192.168.0.21" : null);
// Ersatz-KI: Punkt für die Namen nur bei Kasse und Büro; freie Antwort 1 Punkt
const ersatzKi = (gefragt) => async (system, user) => {
  gefragt.push({ system, user });
  if (/Filius-Datei/.test(system)) {
    const netz = JSON.parse(user).gebautesNetz, namen = netz.geraete.map((g) => g.name);
    const ok = namen.includes("Kasse") && namen.includes("Büro");
    return JSON.stringify({ punkte: ok ? 1 : 0, text: ok ? "Namen und Adressen passen." : "Die Rechner sollen Kasse und Büro heißen." });
  }
  return JSON.stringify({ points: 1, comment: "Richtig: ping an Büro." });
};

test("Probe 1b: zwei Kennungen, 20 Punkte, Praxis kommt aus der Einheit N1, übliche Testregeln", () => {
  for (const id of ["inf9-p1b-r", "inf9-p1b-m"]) {
    const p = proben[id];
    assert.equal(p.thema, "netzwerke");
    assert.equal(p.items.reduce((s, i) => s + i.points, 0), 20, id + ": 20 Punkte (10 = 50 % = Note 3)");
    assert.equal(p.wegSekunden, undefined, id + ": in der Probe wird nichts in Filius gemacht – übliche Testregeln");
    assert.equal(p.kopieren, undefined);
  }
  assert.deepEqual(proben["inf9-p1b-r"].items, proben["inf9-p1b-m"].items, "9R und 9M: gleiche Aufgaben, gleiche Reihenfolge");
  const f = P.items[NR_FILIUS], a = AUFGABEN["netz-start-laden"];
  assert.equal(f.ausModul, "netz-start-laden");
  assert.equal(f.points, maxPunkte(a), "Punkte der Probe = Höchstpunkte in der Einheit");
  assert.deepEqual(f.checks, a.checks);
  assert.deepEqual(f.checks.map((c) => c.typ), ["endgeraete", "kabel", "ip", "ip"]);
  const v = vorschau("nt", P), d = v.items[NR_FILIUS];
  assert.deepEqual([v.total, d.type, d.checks.length, d.kiPunkte], [20, "datei", 4, 1]);
  assert.match(d.kiKriterien[0], /Kasse/);
});

test("Einheit N1 ohne KI: sofort Punkte (Namen prüft dann der Server), die beste Abgabe bleibt, ohne Code nichts gespeichert", async () => {
  await mitServer(null, async ({ post, speicher }) => {
    const faelle = [["richtig.fls", 5, true], ["adresse-falsch.fls", 4, false], ["drei-rechner.fls", 4, false], ["drei-ohne-kabel.fls", 3, false], ["andere-namen.fls", 4, false]];
    for (const [datei, soll, erfuellt] of faelle) {
      const r = (await hochladen(post, datei)).data;
      assert.deepEqual([r.lesbar, r.wertung.punkte, r.wertung.max, r.erfuellt], [true, soll, 5, erfuellt], datei + ": " + JSON.stringify(r.punkte));
      assert.equal(r.punkte.length, 5, "vier Prüfpunkte und der Punkt für die Namen");
      assert.match(r.hinweis, /nicht mit deinem Code angemeldet/);
      assert.equal(r.gespeichert, false);
    }
    // mit Code: 4 Punkte, dann 5 (besser, ersetzt), dann 3 (schlechter, bleibt bei 5)
    let r = (await hochladen(post, "adresse-falsch.fls", "600")).data;
    assert.deepEqual([r.gespeichert, r.wertung.punkte, r.wertung.beste], [true, 4, 4]);
    r = (await hochladen(post, "richtig.fls", "600")).data;
    assert.deepEqual([r.wertung.punkte, r.wertung.beste], [5, 5]);
    r = (await hochladen(post, "drei-ohne-kabel.fls", "600")).data;
    assert.deepEqual([r.wertung.punkte, r.wertung.beste], [3, 5], "eine schlechtere Abgabe ersetzt die bessere nicht");
    const gespeichert = await speicher.hole("9aM", "600", "netz-start-laden");
    assert.deepEqual([gespeichert.meta.art, gespeichert.meta.punkte, gespeichert.meta.max], ["fls", 5, 5]);
    assert.match(gespeichert.meta.netzText, /Kasse \(Rechner, 192\.168\.0\.20\)/);
    // Code einer 8. Klasse: geprüft, aber nicht gespeichert
    r = (await hochladen(post, "richtig.fls", "800")).data;
    assert.deepEqual([r.gespeichert, r.wertung.punkte], [false, 5]);
    // keine Filius-Datei
    r = (await post("/api/inf9/filius/pruefen", { aufgabe: "netz-start-laden", datei: Buffer.from("kein zip").toString("base64"), code: "600" })).data;
    assert.deepEqual([r.lesbar, r.erfuellt], [false, false]);
    assert.equal((await post("/api/inf9/filius/pruefen", { aufgabe: "gibt-es-nicht", datei: b64("richtig.fls") })).status, 404);
    // Lehrkraft: Liste mit Punkten, Abgabe mit Netz-Vorschau und Datei
    const liste = (await post("/api/inf9/lehrer/abgaben", { password: PW, klasse: "9aM" })).data.abgaben;
    assert.deepEqual(liste.map((a) => [a.code, a.aufgabe, a.art, a.punkte, a.max]), [["600", "netz-start-laden", "fls", 5, 5]]);
    assert.match(liste[0].titel, /Ladens/);
    const eine = (await post("/api/inf9/lehrer/abgabe", { password: PW, klasse: "9aM", code: "600", aufgabe: "netz-start-laden" })).data;
    assert.equal(eine.name, "netz-start-laden-600.fls");
    assert.equal(eine.vorschau.art, "netz");
    assert.equal(eine.punkte.length, 5);
    assert.equal(eine.datei, b64("richtig.fls"));
  });
});

test("Einheit N1 mit KI: Die KI vergibt den Punkt für die Namen und schreibt die Rückmeldung", async () => {
  const gefragt = [];
  await mitServer(ersatzKi(gefragt), async ({ post }) => {
    let r = (await hochladen(post, "richtig.fls", "602")).data;
    assert.deepEqual([r.wertung.punkte, r.quelle, r.rueckmeldung], [5, "ki", "Namen und Adressen passen."]);
    r = (await hochladen(post, "andere-namen.fls", "604")).data;
    assert.deepEqual([r.wertung.punkte, r.punkte[4].ok], [4, false]);
    const frage = JSON.parse(gefragt.find((g) => /Filius-Datei/.test(g.system)).user);
    assert.deepEqual([frage.hoechstpunkte, frage.gepruefteSchritte.length], [1, 4]);
    assert.deepEqual(frage.gebautesNetz.kabel, [["Kasse", "Büro"]]);
  });
});

test("Einheit N1: Richtige Namen geben den Punkt auch dann, wenn die KI ihn wegen anderer Fehler abzieht; kaputtes JSON wird trotzdem gelesen", async () => {
  // live gesehen (25.10.2026): Bei falscher Adresse lobte die KI die Namen, gab aber 0 Punkte
  const geizig = async () => '{"punkte":0,"text":"Die Namen "Kasse" und "Büro" sind richtig. Prüfe die Adresse von Büro."}';
  await mitServer(geizig, async ({ post }) => {
    let r = (await hochladen(post, "adresse-falsch.fls")).data;
    assert.deepEqual([r.wertung.punkte, r.punkte[4].ok, r.quelle], [4, true, "ki"]);
    assert.match(r.rueckmeldung, /Prüfe die Adresse von Büro/, "Text der KI kommt an, obwohl ihr JSON kaputt ist");
    r = (await hochladen(post, "richtig.fls")).data;
    assert.equal(r.wertung.punkte, 5);
    r = (await hochladen(post, "andere-namen.fls")).data;
    assert.deepEqual([r.wertung.punkte, r.punkte[4].ok], [4, false], "andere Namen: die KI entscheidet weiter");
  });
});

test("Probe 1b übernimmt die beste Abgabe aus der Einheit; ohne Abgabe 0 Punkte; 9M und 9R nach dem R-Schlüssel", async () => {
  const altKey = process.env.ANTHROPIC_API_KEY;
  delete process.env.ANTHROPIC_API_KEY;
  try {
    await mitServer(null, async ({ post, get }) => {
      const liste = (await get("/api/inf9/list")).tests.find((t) => t.id === "inf9-p1b-m");
      assert.deepEqual([liste.maxPoints, liste.notenzug, liste.unlocked, liste.wegSekunden], [20, "R", false, undefined], "zuerst gesperrt, übliche Testregeln");
      for (const id of ["inf9-p1b-r", "inf9-p1b-m"]) await post("/api/inf9/teacher/unlock", { password: PW, testId: id, open: true });
      await hochladen(post, "richtig.fls", "610");          // 9aM: 5 Punkte
      await hochladen(post, "adresse-falsch.fls", "611");   // 9b: 4 Punkte
      const faelle = [["610", "inf9-p1b-m", 5], ["611", "inf9-p1b-r", 4], ["612", "inf9-p1b-m", 0]];
      for (const [code, id, soll] of faelle) {
        const start = await post("/api/inf9/start", { testId: id, code });
        assert.equal(start.status, 200);
        const f = start.data.items[NR_FILIUS];
        assert.equal(f.type, "filius");
        assert.equal(f.ausModul, true);
        assert.equal(f.checks, undefined, "Prüfpunkte nicht an die Seite");
        assert.deepEqual(f.modulStand.abgegeben, soll > 0, code + ": Stand der Abgabe in der Einheit");
        if (soll) assert.equal(f.modulStand.punkte, soll);
        const ab = await post("/api/inf9/submit", { testId: id, code, answers: richtigeAntworten() });
        assert.equal(ab.status, 200);
        const d = ab.data.result.details[NR_FILIUS];
        assert.deepEqual([d.points, d.source], [soll, "modul"], code + ": " + d.comment);
        assert.equal(ab.data.result.score, 15 + soll, "Teil A 14 + ping 1 + Praxis aus der Einheit");
        if (soll) { assert.ok(d.dateiDaten, "die Datei steht in der Abgabe (Download für die Lehrkraft)"); assert.match(d.given, /Abgegeben in der Einheit am .* Kasse/); }
        else assert.equal(d.given, "Keine Abgabe in der Einheit.");
      }
      const s = (await post("/api/inf9/teacher/results", { password: PW, testId: "inf9-p1b-m" })).data.submissions.find((x) => x.code === "610");
      assert.deepEqual([s.score, s.grade], [20, 1]);
      // Lehrkraft kann die Punkte der Filius-Aufgabe ändern
      const o = await post("/api/inf9/teacher/override", { password: PW, submissionId: s.id, nr: NR_FILIUS + 1, points: 3 });
      assert.equal(o.status, 200);
      // 10 von 20 = 50 % = Note 3, auch in 9M (ohne Abgabe in der Einheit: Teil A bis Aufgabe 5)
      await post("/api/inf9/start", { testId: "inf9-p1b-m", code: "614" });
      const halb = richtigeAntworten().map((a, i) => (i <= 4 ? a : P.items[i].type === "choice" ? (P.items[i].answer + 1) % P.items[i].options.length : P.items[i].type === "text" ? "weiß ich nicht" : null));
      const h = await post("/api/inf9/submit", { testId: "inf9-p1b-m", code: "614", answers: halb });
      assert.deepEqual([h.data.result.score, h.data.result.grade], [10, 3]);
    });
  } finally { if (altKey !== undefined) process.env.ANTHROPIC_API_KEY = altKey; }
});
