"use strict";

// Informatik 9, Probe 1b (25.10.2026): nur Einheit N1, gleiche Probe für 9M und 9R, R-Schlüssel (50 % = Note 3).
// Praxis: Am Ende der Einheit N1 üben die Kinder die Laden-Aufgabe (filius-modul.js, /api/inf9/filius/pruefen: sofort
// Punkte, zählen nicht); in der Probe bauen sie das Netz neu und laden die .fls dort hoch (nt7.js, Aufgabenart filius,
// ohne Note-6-Regel). Lädt ein Kind genau die Übungsdatei hoch, steht das in der Bewertung (uebung).
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
async function mitServer(ki, lauf, nt7extra) {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "inf9-p1b-"));
  const speicher = abgabenSpeicher({ kurs: "inf9", dataDir, env: {} });
  const app = express();
  app.use(express.json({ limit: "2mb" }));
  registerNt7Routes(app, { dataDir, teacherPassword: PW, kindZumCode, prefix: "/api/inf9", datei: "inf9-proben.json", tests: proben, fach: "Informatik", stufe: 9, notenzug: "R",
    modulAbgabe: (student, kennung) => speicher.hole(klasseNorm(student.klasse), String(student.code), kennung), ...(nt7extra || {}) });
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
const NR_FILIUS = P.items.findIndex((i) => i.type === "filius"), NR_PING = P.items.findIndex((i) => i.type === "text");
const datei = (name) => ({ name, data: b64(name) });
// richtige Antworten der Seite (die Probe ist schon gemischt: answer zeigt auf die richtige Stelle); Filius: die Datei
const richtigeAntworten = (fls) => P.items.map((it) => it.type === "choice" ? it.answer : it.type === "match" ? it.pairs.map((p) => p[1])
  : it.type === "tf" ? it.statements.map((s) => s[1]) : it.type === "text" ? "ping 192.168.0.21" : it.type === "filius" ? (fls ? datei(fls) : null) : null);
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

test("Probe 1b: zwei Kennungen, 20 Punkte, Praxis in der Probe wie die Übung in N1, ohne Note-6-Regel", () => {
  for (const id of ["inf9-p1b-r", "inf9-p1b-m"]) {
    const p = proben[id];
    assert.equal(p.thema, "netzwerke");
    assert.equal(p.items.reduce((s, i) => s + i.points, 0), 20, id + ": 20 Punkte (10 = 50 % = Note 3)");
    assert.deepEqual([p.wegSekunden, p.kopieren, p.minutes], [0, 0, 30], id + ": Wechsel zu Filius und Kopieren der Adressen geben keine Note 6");
  }
  assert.deepEqual(proben["inf9-p1b-r"].items, proben["inf9-p1b-m"].items, "9R und 9M: gleiche Aufgaben, gleiche Reihenfolge");
  const f = P.items[NR_FILIUS], a = AUFGABEN["netz-start-laden"];
  assert.deepEqual([f.ausModul, f.uebung, f.aufgabe.length], [undefined, "netz-start-laden", 6], "in der Probe hochladen; Übung zum Vergleich");
  assert.equal(f.points, maxPunkte(a), "gleiche Punkte wie die Übung");
  assert.deepEqual([f.checks, f.kiKriterien, f.namen], [a.checks, a.kiKriterien, a.namen], "gleiche Prüfpunkte wie die Übung");
  assert.deepEqual(f.checks.map((c) => c.typ), ["endgeraete", "kabel", "ip", "ip"]);
  assert.ok(NR_PING === P.items.length - 1 && NR_FILIUS === NR_PING - 1, "Praxisteil steht am Ende");
  assert.match(f.aufgabe[5], /probe\.fls/, "eigener Dateiname in der Probe (nicht laden.fls aus der Übung)");
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

test("Probe 1b: Liste und Start – ohne Note-6-Regel, Prüfpunkte und Übungsabgleich bleiben auf dem Server", async () => {
  await mitServer(null, async ({ post, get }) => {
    const liste = (await get("/api/inf9/list")).tests.find((t) => t.id === "inf9-p1b-m");
    assert.deepEqual([liste.maxPoints, liste.wegSekunden, liste.kopieren, liste.notenzug, liste.unlocked], [20, 0, 0, "R", false], "zuerst gesperrt");
    await post("/api/inf9/teacher/unlock", { password: PW, testId: "inf9-p1b-m", open: true });
    const start = await post("/api/inf9/start", { testId: "inf9-p1b-m", code: "600" });
    assert.equal(start.status, 200);
    assert.deepEqual([start.data.test.wegSekunden, start.data.test.kopieren], [0, 0]);
    const f = start.data.items[NR_FILIUS];
    assert.deepEqual([f.type, f.aufgabe.length, f.ausModul, f.modulStand], ["filius", 6, undefined, undefined], "in der Probe hochladen");
    assert.ok(f.image && f.imageAlt);
    for (const k of ["checks", "kiKriterien", "namen", "uebung"]) assert.equal(f[k], undefined, k + " nicht an die Seite");
  });
});

test("Probe 1b ohne KI: Filius-Datei aus der Probe nach dem Prüfprogramm, Namen prüft der Server; 9M und 9R nach dem R-Schlüssel", async () => {
  const altKey = process.env.ANTHROPIC_API_KEY;
  delete process.env.ANTHROPIC_API_KEY;
  try {
    await mitServer(null, async ({ post }) => {
      for (const id of ["inf9-p1b-r", "inf9-p1b-m"]) await post("/api/inf9/teacher/unlock", { password: PW, testId: id, open: true });
      // Übung in N1 vorher: zählt nicht für die Probe
      await hochladen(post, "richtig.fls", "605");
      const faelle = [
        // [Code, Datei, Punkte der Filius-Aufgabe (4 Prüfpunkte + 1 Punkt für die Namen)]
        ["600", "richtig.fls", 5], ["601", "adresse-falsch.fls", 4], ["602", "drei-rechner.fls", 4],
        ["603", "drei-ohne-kabel.fls", 3], ["604", "andere-namen.fls", 4], ["605", null, 0]
      ];
      for (const [code, fls, soll] of faelle) {
        const id = CODES[code].zug === "9M" ? "inf9-p1b-m" : "inf9-p1b-r";
        assert.equal((await post("/api/inf9/start", { testId: id, code })).status, 200);
        const ab = await post("/api/inf9/submit", { testId: id, code, answers: richtigeAntworten(fls) });
        assert.equal(ab.status, 200, code + " " + fls);
        const d = ab.data.result.details[NR_FILIUS];
        assert.equal(d.points, soll, (fls || "ohne Datei") + ": " + d.comment);
        assert.equal(ab.data.result.score, 15 + soll, "Teil A 14 + ping 1 + Filius");
        assert.equal(d.gleicheDatei, undefined);
        if (fls) {
          assert.equal(d.datei, fls);
          assert.ok(d.dateiDaten, "die Datei bleibt für die Lehrkraft in der Abgabe");
          assert.match(d.given, /Kasse|Laden/);
          assert.doesNotMatch(d.comment, /anteilig/);
          assert.match(d.comment, fls === "andere-namen.fls" ? /✗ Die Rechner heißen Kasse und Büro$/ : /✓ Die Rechner heißen Kasse und Büro$/, "Namen-Punkt steht in der Bewertung");
        } else assert.equal(d.given, "Keine Datei abgegeben.", "eine Übung in N1 ersetzt die Abgabe in der Probe nicht");
      }
      const richtig = (await post("/api/inf9/teacher/results", { password: PW, testId: "inf9-p1b-m" })).data.submissions.find((s) => s.code === "600");
      assert.deepEqual([richtig.score, richtig.grade], [20, 1]);
      // Lehrkraft kann die Punkte der Filius-Aufgabe ändern
      assert.equal((await post("/api/inf9/teacher/override", { password: PW, submissionId: richtig.id, nr: NR_FILIUS + 1, points: 3 })).status, 200);
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

test("Probe 1b: Genau die Datei aus der Übung in N1 hochgeladen – Hinweis für die Lehrkraft, Punkte bleiben", async () => {
  const altKey = process.env.ANTHROPIC_API_KEY;
  delete process.env.ANTHROPIC_API_KEY;
  try {
    await mitServer(null, async ({ post }) => {
      await post("/api/inf9/teacher/unlock", { password: PW, testId: "inf9-p1b-m", open: true });
      await hochladen(post, "richtig.fls", "610");          // Übung: dieselbe Datei wie später in der Probe
      await hochladen(post, "adresse-falsch.fls", "612");   // Übung: andere Datei
      for (const [code, gleich] of [["610", true], ["612", false]]) {
        await post("/api/inf9/start", { testId: "inf9-p1b-m", code });
        const d = (await post("/api/inf9/submit", { testId: "inf9-p1b-m", code, answers: richtigeAntworten("richtig.fls") })).data.result.details[NR_FILIUS];
        assert.equal(d.points, 5, "der Server zieht nichts ab – die Lehrkraft entscheidet");
        assert.equal(Boolean(d.gleicheDatei), gleich, code);
        assert.equal(Boolean(d.needsReview), gleich, code + ": „noch prüfen“");
        if (gleich) assert.match(d.comment, /^⚠️ Dieselbe Datei wie die Übung in der Einheit N1 Netzwerke kennenlernen \(abgegeben am \d\d\.\d\d\.\d{4}/);
        else assert.doesNotMatch(d.comment, /Übung/);
      }
    });
  } finally { if (altKey !== undefined) process.env.ANTHROPIC_API_KEY = altKey; }
});

test("Probe 1b mit KI: Punkt für die Namen und Rückmeldung von der KI; richtige Namen geben den Punkt sicher", async () => {
  const altKey = process.env.ANTHROPIC_API_KEY;
  process.env.ANTHROPIC_API_KEY = "test";
  const gefragt = [];
  // geizige KI wie live gesehen: Punkt für die Namen nur, wenn alles stimmt – und kaputtes JSON beim Lob
  const askAnthropic = async (system, user) => {
    gefragt.push({ system, user });
    if (/Filius-Datei/.test(system)) {
      const d = JSON.parse(user), namen = d.gebautesNetz.geraete.map((g) => g.name);
      const alles = d.gepruefteSchritte.every((x) => x.erfuellt) && namen.includes("Kasse") && namen.includes("Büro");
      return alles ? '{"punkte":1,"text":"Die Namen "Kasse" und "Büro" passen, alles verbunden."}' : JSON.stringify({ punkte: 0, text: "Prüfe Namen und Adressen noch einmal." });
    }
    return JSON.stringify({ points: 1, comment: "Richtig: ping an Büro." });
  };
  try {
    await mitServer(null, async ({ post }) => {
      await post("/api/inf9/teacher/unlock", { password: PW, testId: "inf9-p1b-r", open: true });
      // adresse-falsch: KI gibt 0, die Namen stimmen aber – Punkt sicher; andere-namen: KI entscheidet (0)
      const faelle = [["611", "richtig.fls", 5, /KI: Die Namen "Kasse" und "Büro" passen/], ["613", "adresse-falsch.fls", 4, /Prüfe Namen/], ["615", "andere-namen.fls", 4, /Prüfe Namen/]];
      for (const [code, fls, soll, text] of faelle) {
        await post("/api/inf9/start", { testId: "inf9-p1b-r", code });
        const d = (await post("/api/inf9/submit", { testId: "inf9-p1b-r", code, answers: richtigeAntworten(fls) })).data.result.details[NR_FILIUS];
        assert.deepEqual([d.points, d.source, d.needsReview], [soll, "ki", false], fls + ": " + d.comment);
        assert.match(d.comment, /✓ Genau zwei Rechner/);
        assert.match(d.comment, text);
      }
      const daten = JSON.parse(gefragt.find((g) => /Filius-Datei/.test(g.system)).user);
      assert.deepEqual([daten.hoechstpunkte, daten.gepruefteSchritte.length], [1, 4]);
      assert.deepEqual(daten.gebautesNetz.kabel, [["Kasse", "Büro"]]);
    }, { askAnthropic, kiGeduldMs: 5000 });
  } finally { if (altKey === undefined) delete process.env.ANTHROPIC_API_KEY; else process.env.ANTHROPIC_API_KEY = altKey; }
});
