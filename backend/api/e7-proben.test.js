"use strict";

// Englisch 7: die große Probe zu Unit 1 über die Routen von d7-proben.js (stufe 7, fach Englisch, /api/e7/proben) –
// wer welche Fassung schreiben darf, Hörtext zentral mit echter Aufnahme, Abgabe mit allen Aufgabenarten, und vor allem:
// dieselbe Leistung gibt in 7M und 7R verschiedene Noten (M 50 % = Note 4, R 50 % = Note 3).
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const { registerD7ProbenRoutes } = require("./d7-proben");
const ROH = require("./e7-proben-daten");

const PW = "Nur-ein-Test-4711";
const KINDER = { 701: { klasse: "7aM" }, 702: { klasse: "7b" }, 703: { klasse: "7b", lrs: true }, 801: { klasse: "8b" } };
const kindZumCode = async (code) => {
  const k = KINDER[Number(code)];
  return k ? { code: String(code).padStart(3, "0"), klasse: k.klasse, zug: /M$/.test(k.klasse) ? "M" : "R", lrs: Boolean(k.lrs) } : null;
};
const warte = (ms) => new Promise((ok) => setTimeout(ok, ms));
// Ersatz-KI: gibt bei offenen Aufgaben keine Punkte – so sind die Noten vorhersagbar (43 von 70 = 61 %: M Note 4, R Note 3).
// Mit ausbessern markiert sie in Antworten „three ticket“ (→ „three tickets“); bei der LRS-Prüfung der Felder gilt
// „bougth“ als nur falsch geschrieben, „get up“ (statt gets up) als falsche Form.
const ki = (merk = {}) => async (system, user) => {
  merk.system = (merk.system || []).concat(system); merk.user = (merk.user || []).concat(user);
  const a = JSON.parse(user);
  if (a.felder) { merk.lrs = (merk.lrs || []).concat([a.felder]); return JSON.stringify({ urteil: a.felder.map((f) => (/^bou/i.test(f.eingabe) ? "ja" : "nein")), grund: a.felder.map(() => "Form geprüft.") }); }
  // so antwortete Haiku live: englische Wörter in geraden Anführungszeichen – ungültiges JSON, das GRUMI trotzdem lesen muss
  if (/Kaputtdorf/.test(a.schuelerantwort)) return '{"punkte":[4,1,2,1,1],"begruendung":["Du nennst "Kaputtdorf" und den See.","Gut aufgebaut.","there was / there were","ok","ok"],"gelungen":["Du nennst deinen "favourite place"."],"arbeiten":[],"hinweis":"Schreibe "people" ohne s.","kategorien":[],"markierungen":[{"stelle":"peoples","art":"grammatik","hinweis":"Mehrzahl ist "people", ohne s","besser":"people"}]}';
  const punkte = a.erwartungshorizont.map(() => 0);
  const markierungen = /three ticket\b/.test(a.schuelerantwort) ? [{ stelle: "three ticket", art: "grammatik", hinweis: "Mehrzahl mit -s.", besser: "three tickets" }] : [];
  return JSON.stringify({ punkte, korrektur: "Teilweise richtig.", begruendung: punkte.map(() => "Teilweise erfüllt."), gelungen: [], arbeiten: [], hinweis: "", kategorie: "", kategorien: [], markierungen });
};

async function mitServer(lauf, merk) {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "e7-proben-"));
  const app = express();
  app.use(express.json());
  const modul = registerD7ProbenRoutes(app, { dataDir, prefix: "/api/e7/proben", datei: "e7-proben.json", stufe: 7, fach: { kurz: "e", name: "Englisch" }, sitzung: true, marken: true,
    hoerZentral: true, hoerOrdner: path.join(__dirname, "e7-proben", "audio"), ausbessern: true, lrsFelder: true, kopierenNurVermerk: true,
    teacherPassword: PW, kindZumCode, tests: JSON.parse(JSON.stringify(ROH)), askAnthropic: ki(merk), kiPauseMs: 40, nachholenMs: 0 });
  const server = await new Promise((resolve) => { const s = app.listen(0, () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (route, body) => fetch(base + "/api/e7/proben/" + route, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
    .then(async (r) => ({ status: r.status, data: await r.json().catch(() => null) }));
  const get = (route) => fetch(base + "/api/e7/proben/" + route).then((r) => r.json());
  const lehrer = (route, body) => post("teacher/" + route, { password: PW, ...body });
  const fertig = async (testId) => { for (let i = 0; i < 800; i++) { const r = (await lehrer("results", { testId })).data.submissions; if (r.length && r.every((x) => x.status !== "eingegangen")) return r; await warte(25); } throw new Error("KI wurde nicht fertig"); };
  try {
    for (const id of ["e7-p1-r-a", "e7-p1-m-a"]) assert.equal((await lehrer("unlock", { testId: id, open: true })).status, 200);
    await lauf({ post, get, lehrer, fertig, modul, base });
  } finally {
    await new Promise((resolve) => server.close(resolve));
    fs.rmSync(dataDir, { recursive: true, force: true });
  }
}

// Alle geschlossenen Aufgaben richtig, offene mit Text (die Ersatz-KI gibt dort nichts)
function antworten(testId) {
  return ROH[testId].items.map((i) => {
    if (i.type === "choice") return i.answer;
    if (i.type === "felder") return i.felder.map((f) => f.loesungen[0]);
    if (i.type === "order") return i.steps.slice();
    if (i.type === "match") return i.pairs.map((x) => x[1]);
    if (i.type === "zeile") return { von: String(i.bereiche[0][0]), bis: String(i.bereiche[0][1]) };
    if (i.type === "schreiben") return "Hi, I'm Mia. I live in Haslach. It's a small town in the south of Bavaria, near Munich. About five thousand people live there. In the past there was a big factory. My favourite place is the lake. You can swim there. I like it because it is quiet. Come and visit!";
    return "He would like three tickets for the castle.";
  });
}

test("Liste und Start: zwei Fassungen, 7M nur M, 7R nur R, 8. Klasse gar nicht; Hörtext zentral, keine Lösungen, 90 Minuten ohne Uhr", async () => {
  await mitServer(async ({ post, get }) => {
    const liste = (await get("list")).tests.filter((t) => /^e7-p1-/.test(t.id));
    assert.deepEqual(liste.map((t) => t.id).sort(), ["e7-p1-m-a", "e7-p1-r-a"]);
    assert.ok(liste.every((t) => t.hoertexte === 1 && t.unlocked), "beide offen, je ein Hörtext");
    const m = await post("start", { testId: "e7-p1-m-a", code: "701" });
    assert.equal(m.status, 200);
    assert.equal((await post("start", { testId: "e7-p1-r-a", code: "701" })).data.error, "falscher_zug");
    assert.equal((await post("start", { testId: "e7-p1-m-a", code: "702" })).data.error, "falscher_zug");
    assert.equal((await post("start", { testId: "e7-p1-r-a", code: "702" })).status, 200);
    assert.equal((await post("start", { testId: "e7-p1-r-a", code: "801" })).data.error, "falsche_stufe");
    const h = m.data.texte.find((t) => t.typ === "hoertext");
    assert.equal(h.zentral, true); assert.equal(h.sprecher, undefined); assert.deepEqual(h.rollen, ["Ella", "Josh"]);
    const roh = JSON.stringify(m.data);
    assert.ok(!/Kelmouth for ten days|six hundred years|only one bus a day/.test(roh), "kein Satz des Hörtexts und keine Lösung geht an das Kind");
    assert.ok(!/did you like|does your school have|"took"|"bought"/.test(roh), "Lösungen der Grammatik bleiben auf dem Server");
    assert.equal(m.data.sitzung.minuten, 90);
    assert.equal(m.data.test.ohneZeit, true, "Englisch: keine Zeitbegrenzung");
    assert.deepEqual([...new Set(m.data.items.map((i) => i.teil))], ["A Listening", "B Reading", "C Grammar and vocabulary", "D Mediation", "E Writing"]);
    assert.ok(m.data.items.filter((i) => i.teil === "D Mediation").every((i) => i.vorgabe), "jede Sprechblase der Mediation kommt an");
  });
});

test("Hörtext für die Lehrkraft: Mitschrift und echte Aufnahme nur mit Passwort", async () => {
  await mitServer(async ({ post, lehrer, base }) => {
    assert.equal((await post("teacher/hoertext", { testId: "e7-p1-m-a" })).status, 401);
    for (const id of ["e7-p1-r-a", "e7-p1-m-a"]) {
      const h = (await lehrer("hoertext", { testId: id })).data.hoertexte[0];
      assert.match(h.sprecher[1].text, /Kelmouth for ten days/);
      assert.ok(h.aufnahme && h.aufnahme.bytes > 300000, id + ": Aufnahme vorhanden");
      const r = await fetch(base + "/api/e7/proben/teacher/hoertext-datei", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password: PW, testId: id, text: "h1" }) });
      assert.equal(r.status, 200); assert.equal(r.headers.get("content-type"), "audio/mpeg");
    }
  });
});

test("Abgabe: alle geschlossenen Aufgaben richtig gewertet; gleiche Leistung → Note nach M- bzw. R-Schlüssel; Rückgabe nennt „Englisch 7“", async () => {
  const merk = {};
  await mitServer(async ({ post, lehrer, fertig }) => {
    const rows = {};
    for (const [id, code] of [["e7-p1-m-a", "701"], ["e7-p1-r-a", "702"]]) {
      assert.equal((await post("start", { testId: id, code })).status, 200);
      const ab = await post("submit", { testId: id, code, answers: antworten(id) });
      assert.equal(ab.status, 200); assert.equal(ab.data.angekommen, true);
      [rows[id]] = await fertig(id);
    }
    const m = rows["e7-p1-m-a"], r = rows["e7-p1-r-a"];
    // geschlossen: 12 + 12 - 3 (offene Frage) + 22 = 43 Punkte; offen (3 + 10 + 14) gibt die Ersatz-KI keine
    const geschlossen = m.details.filter((d) => !["offen", "schreiben"].includes(d.type)).reduce((s, d) => s + d.points, 0);
    assert.equal(geschlossen, 43, "alle Ankreuz-, Feld-, Zeilen-, Ordnungs- und Zuordnungsaufgaben richtig");
    assert.equal(m.score, r.score); assert.equal(m.total, 70); assert.equal(r.total, 70);
    assert.equal(m.percent, r.percent);
    const erwartet = (p, skala) => skala.find((s) => p >= s.min).grade;
    const { GRADE_SCALE_M, GRADE_SCALE_R } = require("./probe-kind");
    assert.equal(m.grade, erwartet(m.percent, GRADE_SCALE_M)); assert.equal(r.grade, erwartet(r.percent, GRADE_SCALE_R));
    assert.equal(m.score, 43); assert.equal(m.grade, 4); assert.equal(r.grade, 3);
    assert.ok(m.grade > r.grade, "der M-Schlüssel ist strenger: " + m.percent + " % = M " + m.grade + ", R " + r.grade);
    assert.match(merk.system.join("\n"), /Sprachmittlung ist keine Übersetzung/);
    assert.ok(merk.user.some((u) => /Herr Brunner/.test(u)), "die Sprechblase geht an die KI mit");
    assert.equal((await lehrer("bestaetigen", { submissionId: m.id })).status, 200);
    assert.equal((await lehrer("freigeben", { submissionIds: [m.id] })).status, 200);
    const k = await post("korrektur", { code: "701", testId: "e7-p1-m-a" });
    const korrektur = k.data.korrektur || k.data;
    assert.equal(korrektur.fach, "Englisch 7"); assert.equal(korrektur.stufe, 7);
  }, merk);
});

test("LRS (lrsFelder): nur falsch geschrieben zählt, falsche Form nicht; Rechtschreibzeile raus; Ausbessern mit durchgestrichener Stelle und Verbesserung", async () => {
  const merk = {};
  await mitServer(async ({ post, lehrer, fertig }) => {
    const id = "e7-p1-r-a", items = ROH[id].items;
    const vergangen = items.findIndex((i) => i.teil === "C Grammar and vocabulary" && i.type === "felder");
    const gegenwart = vergangen + 1, mediation = items.map((i) => i.teil).lastIndexOf("D Mediation");
    const roh = antworten(id);
    roh[vergangen] = roh[vergangen].slice(); roh[vergangen][2] = "bougth";        // bought – nur falsch geschrieben
    roh[gegenwart] = roh[gegenwart].slice(); roh[gegenwart][1] = "get up";        // gets up – falsche Form
    roh[mediation] = "He would like the three ticket and one audio guide. Can he pay by card?";
    // Kind mit Notenschutz (703) und ohne (702) schreiben dasselbe
    for (const code of ["703", "702"]) {
      assert.equal((await post("start", { testId: id, code })).status, 200);
      assert.equal((await post("submit", { testId: id, code, answers: roh })).status, 200);
    }
    const rows = await fertig(id), lrs = rows.find((r) => r.code === "703"), ohne = rows.find((r) => r.code === "702");
    assert.deepEqual((merk.lrs || []).flat().map((f) => f.eingabe).sort(), ["bougth", "get up"], "nur die falschen Felder des LRS-Kindes gehen an die KI");
    assert.equal(lrs.total, 68, "Rechtschreibzeile der Schreibaufgabe (2 Punkte) fällt bei LRS heraus");
    assert.equal(ohne.total, 70);
    const v = lrs.details[vergangen].felder[2], g = lrs.details[gegenwart].felder[1];
    assert.equal(v.lrsOk, true); assert.equal(v.punkte, 1, "bougth: nur die Schreibweise – voller Punkt");
    assert.ok(!g.lrsOk); assert.equal(g.punkte, 0, "get up statt gets up: falsche Form bleibt falsch");
    assert.equal(ohne.details[vergangen].felder[2].punkte, 0, "ohne Notenschutz zählt bougth nicht");
    assert.equal(lrs.score, 43 - 1, "nur gets up fehlt");
    // Ausbessern: Markierung mit Verbesserung in der kurzen Antwort
    const med = lrs.details[mediation];
    assert.deepEqual(med.marken.map((m) => [med.given.slice(m.start, m.end), m.besser]), [["three ticket", "three tickets"]]);
    assert.ok(merk.system.some((s) => /besser: die richtige Fassung genau dieser Stelle/.test(s)), "die KI wird nach der Verbesserung gefragt");
    // Korrektur für das Kind
    assert.equal((await lehrer("bestaetigen", { submissionId: lrs.id })).status, 200);
    assert.equal((await lehrer("freigeben", { submissionIds: [lrs.id] })).status, 200);
    const k = (await post("korrektur", { code: "703", testId: id })).data, korr = k.korrektur || k;
    assert.equal(korr.ausbessern, true);
    assert.equal(korr.aufgaben[vergangen].felder[2].nurSchreibweise, true);
    assert.equal(korr.aufgaben[mediation].marken[0].besser, "three tickets");
    // Notenschutz zurückgenommen: bougth zählt wieder nach dem Schlüssel
    const zurueck = (await lehrer("einstellung", { submissionId: lrs.id, rsWerten: true })).data.submission;
    assert.equal(zurueck.total, 70); assert.equal(zurueck.score, 43 - 2);
    // die Lehrkraft setzt eine Verbesserung selbst – sie bleibt erhalten
    const neu = await lehrer("bewerten", { submissionId: lrs.id, nr: mediation + 1, marken: [{ start: med.marken[0].start, end: med.marken[0].end, type: "grammar", comment: "Mehrzahl!", besser: "three tickets" }] });
    assert.equal(neu.status, 200);
    assert.equal(neu.data.submission.details[mediation].marken[0].besser, "three tickets");
  }, merk);
});

test("Reinkopieren ist verboten und wird protokolliert – aber keine Note 6 (kopierenNurVermerk)", async () => {
  await mitServer(async ({ post, fertig }) => {
    const id = "e7-p1-m-a";
    const start = await post("start", { testId: id, code: "701" });
    assert.equal(start.data.test.kopieren, 0, "die Seite beendet bei Kopierversuchen nicht");
    assert.equal(start.data.test.wegSekunden, 0);
    assert.match(start.data.test.hinweis, /Reinkopieren ist verboten und wird protokolliert/);
    // eine Seite meldet sogar „beendet wegen Kopieren“ (ältere Seite) und drei Versuche – trotzdem keine Note 6
    const ab = await post("submit", { testId: id, code: "701", answers: antworten(id), regel: true, regelKopieren: 0, kopierversuche: 3, abbruch: { grund: "kopieren" },
      protokoll: { einfuegen: [{ zeit: new Date().toISOString(), zeichen: 40, woerter: 8, erlaubt: false }] } });
    assert.equal(ab.status, 200);
    const [row] = await fertig(id);
    assert.ok(!row.abbruch, "kein Abbruch");
    assert.notEqual(row.grade, 6);
    assert.equal(row.grade, 4, "43 von 70 Punkten = 61 % = Note 4 im M-Schlüssel");
    assert.equal(row.kopierversuche || (row.regelStand && row.regelStand.kopierversuche) || (row.testregeln && row.testregeln.kopierversuche), 3, "die Versuche sind vermerkt");
  });
});

test("KI-Antwort mit geraden Anführungszeichen um englische Wörter (live so gesehen) wird trotzdem gelesen", async () => {
  await mitServer(async ({ post, fertig }) => {
    const id = "e7-p1-r-a", roh = antworten(id), e = ROH[id].items.findIndex((i) => i.type === "schreiben");
    roh[e] = "Hi, I'm Mia and I live in Kaputtdorf. It's a small village. About 900 peoples live there. In the past there was a mill. My favourite place is the lake. You can swim there. Come and visit!";
    assert.equal((await post("start", { testId: id, code: "702" })).status, 200);
    assert.equal((await post("submit", { testId: id, code: "702", answers: roh })).status, 200);
    const [row] = await fertig(id), d = row.details[e];
    assert.equal(d.source, "ki", "die KI-Bewertung kam an");
    assert.deepEqual(d.kriterien.map((k) => k.punkte), [4, 1, 2, 1, 1]);
    assert.match(d.begruendung[0], /Kaputtdorf/);
    assert.equal(d.hinweis, 'Schreibe "people" ohne s.');
    assert.deepEqual(d.marken.map((m) => [d.given.slice(m.start, m.end), m.besser]), [["peoples", "people"]]);
  });
});
