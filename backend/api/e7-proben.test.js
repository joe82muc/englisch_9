"use strict";

// Englisch 7: die großen Proben zu Unit 1 und Unit 2 über die Routen von d7-proben.js (stufe 7, fach Englisch, /api/e7/proben) –
// wer welche Fassung schreiben darf, Hörtext zentral mit echter Aufnahme, Abgabe mit allen Aufgabenarten, und vor allem:
// dieselbe Leistung gibt in 7M und 7R verschiedene Noten (M 50 % = Note 4, R 50 % = Note 3).
// Probe 2 (Unit 2) hat vier Fassungen: e7-p2-<r|m>-<a|b> – eigene R-Fassung, Variante B für Nachschreiber. Ebenso Probe 3
// (Unit 3, e7-p3-<r|m>-<a|b>) – dort geht die Sprachmittlung wie im Buch von Deutsch nach Englisch – und Probe 4 (Unit 4,
// e7-p4-<r|m>-<a|b>), wieder Englisch → Deutsch wie im Buch. Seit 15.11.2026 hat auch Probe 1 eine Nachschreibprobe B
// (e7-p1-<r|m>-b, 7R und 7M dieselben Aufgaben wie in A).
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const { registerD7ProbenRoutes } = require("./d7-proben");
const ROH = require("./e7-proben-daten");

const PW = "Nur-ein-Test-4711";
const KINDER = { 701: { klasse: "7aM" }, 702: { klasse: "7b" }, 703: { klasse: "7b", lrs: true }, 704: { klasse: "7aM" }, 705: { klasse: "7b" }, 801: { klasse: "8b" } };
const kindZumCode = async (code) => {
  const k = KINDER[Number(code)];
  return k ? { code: String(code).padStart(3, "0"), klasse: k.klasse, zug: /M$/.test(k.klasse) ? "M" : "R", lrs: Boolean(k.lrs) } : null;
};
const warte = (ms) => new Promise((ok) => setTimeout(ok, ms));
// Ersatz-KI: gibt bei offenen Aufgaben keine Punkte – so sind die Noten vorhersagbar (43 von 70 = 61 %: M Note 4, R Note 3).
// Mit ausbessern markiert sie in Antworten „three ticket“ (→ „three tickets“); bei der LRS-Prüfung der Felder gilt
// „bougth“ als nur falsch geschrieben, „get up“ (statt gets up) als falsche Form.
const ki = (merk = {}) => async (system, user, _max, optionen) => {
  merk.system = (merk.system || []).concat(system); merk.user = (merk.user || []).concat(user); merk.optionen = (merk.optionen || []).concat([optionen]);
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
    hoerZentral: true, hoerOrdner: path.join(__dirname, "e7-proben", "audio"), ausbessern: true, lrsFelder: true, kopierenNurVermerk: true, temperatur: 0,
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
    assert.ok(merk.optionen.length && merk.optionen.every((o) => o && o.temperatur === 0 && o.milde === false), "jede Bewertung mit Temperatur 0");
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

/* ------------------------------ Probe 2 (Unit 2): vier Fassungen ------------------------------ */
const P2 = ["e7-p2-m-a", "e7-p2-r-a", "e7-p2-m-b", "e7-p2-r-b"];
const OFFENE = ["offen", "schreiben"];

test("Probe 2: Liste und Start – Variante B erst nach dem Freischalten sichtbar, 7M nur M, 7R nur R, 8. Klasse gar nicht; keine Lösungen", async () => {
  await mitServer(async ({ post, get, lehrer }) => {
    const vorher = (await get("list")).tests.filter((t) => /^e7-p2-/.test(t.id));
    assert.deepEqual(vorher.map((t) => t.id).sort(), ["e7-p2-m-a", "e7-p2-r-a"], "gesperrte Nachschreibprobe B steht nicht in der Liste");
    assert.ok(vorher.every((t) => !t.unlocked && t.maxPoints === 70 && t.minutes === 90 && t.hoertexte === 1));
    assert.equal((await post("start", { testId: "e7-p2-m-a", code: "701" })).status, 403, "gesperrt: kein Start");
    for (const id of P2) assert.equal((await lehrer("unlock", { testId: id, open: true })).status, 200);
    const liste = (await get("list")).tests.filter((t) => /^e7-p2-/.test(t.id));
    assert.deepEqual(liste.map((t) => t.id).sort(), [...P2].sort());
    assert.ok(liste.every((t) => t.unlocked && t.title === "Test 2 (" + t.zug + "7): Fun in Wales and Scotland"));
    for (const [id, code, falsch] of [["e7-p2-m-a", "701", "e7-p2-r-a"], ["e7-p2-r-b", "702", "e7-p2-m-b"]]) {
      const s = await post("start", { testId: id, code });
      assert.equal(s.status, 200, id);
      assert.equal((await post("start", { testId: falsch, code })).data.error, "falscher_zug", falsch + " für Code " + code);
      assert.equal((await post("start", { testId: id, code: "801" })).data.error, "falsche_stufe");
      const roh = JSON.stringify(s.data), probe = ROH.__vorlage[id];
      const h = s.data.texte.find((x) => x.typ === "hoertext");
      assert.equal(h.zentral, true); assert.equal(h.sprecher, undefined);
      assert.ok(probe.texte[0].sprecher.every((x) => !roh.includes(x.text.slice(0, 30))), id + ": kein Satz des Hörtexts geht an das Kind");
      assert.ok(!/"(answer|loesungen|kriterien|expected|keywords|pairs|bereiche)"/.test(roh), id + ": keine Lösungsfelder in der Antwort");
      // Lösungen der Grammatik, Beispiellösungen und Erwartungshorizont der offenen Aufgaben stehen nirgends (Notizen zum
      // Lesetext stehen naturgemäß im Text – sie zählen hier nicht)
      const loesungen = probe.items.flatMap((i) => (i.teil === "C Grammar and vocabulary" ? (i.felder || []).flatMap((f) => f.loesungen).filter((l) => String(l).length > 6) : [])
        .concat(OFFENE.includes(i.type) ? [i.expected || ""].filter(Boolean).concat((i.kriterien || []).map((k) => k.erwartet).filter((e) => e && e.length > 12)) : []));
      assert.ok(loesungen.length >= 10, id + ": genug Lösungen zum Prüfen");
      assert.deepEqual(loesungen.filter((l) => roh.includes(JSON.stringify(l).slice(1, -1))), [], id + ": Lösungen und Erwartungshorizont bleiben auf dem Server");
      assert.ok(!/13 Pfund|44 Pfund/.test(roh), id + ": die Rechnung der Sprachmittlung bleibt auf dem Server");
      assert.deepEqual([...new Set(s.data.items.map((i) => i.teil))], ["A Listening", "B Reading", "C Grammar and vocabulary", "D Mediation", "E Writing"]);
      const d = s.data.items.filter((i) => i.teil === "D Mediation");
      assert.ok(d.every((i) => i.vorgabe) && /£/.test(d[0].vorgabe), id + ": das Programm der Sprachmittlung kommt an");
      assert.equal(Boolean(d[0].teile), /-r-/.test(id), id + ": R beantwortet die Fragen in eigenen Feldern");
      assert.equal(s.data.test.ohneZeit, true, "Englisch: keine Zeitbegrenzung");
    }
  });
});

test("Probe 2: Hörtext für die Lehrkraft – Mitschrift je Variante, 7R und 7M hören dieselbe Aufnahme", async () => {
  await mitServer(async ({ post, lehrer, base }) => {
    assert.equal((await post("teacher/hoertext", { testId: "e7-p2-r-a" })).status, 401);
    const mitschrift = {};
    for (const id of P2) {
      const h = (await lehrer("hoertext", { testId: id })).data.hoertexte[0];
      assert.equal(h.sprecher.length, ROH.__vorlage[id].texte[0].sprecher.length, id + ": ganze Mitschrift");
      mitschrift[id] = h.sprecher.map((s) => s.rolle + ": " + s.text).join("\n");
      // die Aufnahme selbst prüft der Datentest (fehlt sie, ist er rot) – hier nur: Route und Angabe passen zusammen
      const datei = path.join(__dirname, "e7-proben", "audio", id + "-h1.mp3");
      assert.equal(Boolean(h.aufnahme), fs.existsSync(datei), id + ": Angabe „Aufnahme vorhanden“ stimmt");
      const r = await fetch(base + "/api/e7/proben/teacher/hoertext-datei", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password: PW, testId: id, text: "h1" }) });
      assert.equal(r.status, fs.existsSync(datei) ? 200 : 404, id + ": Aufnahme nur, wenn es die Datei gibt");
    }
    assert.match(mitschrift["e7-p2-r-a"], /^Carys: Hello\?/); assert.match(mitschrift["e7-p2-m-b"], /^Morven: /);
    assert.equal(mitschrift["e7-p2-r-a"], mitschrift["e7-p2-m-a"], "Variante A: gleicher Hörtext für R und M");
    assert.equal(mitschrift["e7-p2-r-b"], mitschrift["e7-p2-m-b"], "Variante B: gleicher Hörtext für R und M");
    assert.notEqual(mitschrift["e7-p2-r-a"], mitschrift["e7-p2-r-b"], "Nachschreiber hören einen anderen Text");
  });
});

test("Probe 2: alle vier Fassungen abgeben – Schlüssel richtig gewertet, Note nach Zug, LRS ohne Rechtschreibzeile, Programm und Felder gehen an die KI", async () => {
  const merk = {};
  await mitServer(async ({ post, lehrer, fertig }) => {
    for (const id of P2) assert.equal((await lehrer("unlock", { testId: id, open: true })).status, 200);
    const { GRADE_SCALE_M, GRADE_SCALE_R } = require("./probe-kind");
    const note = (p, zug) => (zug === "M" ? GRADE_SCALE_M : GRADE_SCALE_R).find((s) => p >= s.min).grade;
    // 703 hat Notenschutz (LRS): Rechtschreibzeile der Schreibaufgabe fällt heraus – 68 statt 70 Punkte
    for (const [id, code, gesamt, schluessel] of [["e7-p2-m-a", "701", 70, 43], ["e7-p2-r-a", "702", 70, 44], ["e7-p2-m-b", "704", 70, 43], ["e7-p2-r-b", "703", 68, 44]]) {
      assert.equal((await post("start", { testId: id, code })).status, 200, id);
      const ab = await post("submit", { testId: id, code, answers: antworten(id) });
      assert.equal(ab.status, 200); assert.equal(ab.data.angekommen, true);
      const [row] = await fertig(id), zug = id[6].toUpperCase();
      const zu = row.details.filter((d) => !OFFENE.includes(d.type)).reduce((s, d) => s + d.points, 0);
      assert.equal(zu, schluessel, id + ": alle Ankreuz-, Feld-, Zeilen-, Ordnungs- und Zuordnungsaufgaben richtig (R hat mehr davon)");
      assert.equal(row.total, gesamt, id + ": Höchstpunktzahl");
      assert.equal(row.score, schluessel, id + ": die Ersatz-KI gibt bei offenen Aufgaben nichts");
      assert.equal(row.grade, note(row.percent, zug), id + ": Note nach dem " + zug + "-Schlüssel (" + row.percent + " %)");
      assert.equal(row.grade, zug === "M" ? 4 : 3, id + ": rund 62 % = M Note 4, R Note 3");
    }
    assert.ok(merk.user.some((u) => /CRAIGWEN CASTLE/.test(u)) && merk.user.some((u) => /CAIRNBRAE SNOW CENTRE/.test(u)), "das Programm geht als Vorlage an die KI");
    assert.ok(merk.user.some((u) => /Frag bitte den Mann an der Kasse/.test(u)), "die Bitte der Oma geht an die KI");
    assert.ok(merk.system.some((s) => /getrennte Felder geschrieben/.test(s)), "die KI weiß, dass R die Fragen in eigenen Feldern beantwortet");
    assert.ok(merk.user.some((u) => /Highland dancing/.test(u) && /textausschnitt/.test(u)), "Lesefrage mit Textausschnitt");
    assert.ok(merk.optionen.length && merk.optionen.every((o) => o && o.temperatur === 0), "jede Bewertung mit Temperatur 0");
    const [m] = await fertig("e7-p2-m-a");
    assert.equal((await lehrer("bestaetigen", { submissionId: m.id })).status, 200);
    assert.equal((await lehrer("freigeben", { submissionIds: [m.id] })).status, 200);
    const k = await post("korrektur", { code: "701", testId: "e7-p2-m-a" }), korr = k.data.korrektur || k.data;
    assert.equal(korr.fach, "Englisch 7"); assert.equal(korr.ausbessern, true);
  }, merk);
});

/* ------------------------------ Probe 3 (Unit 3): vier Fassungen, Sprachmittlung Deutsch → Englisch ------------------------------ */
const P3 = ["e7-p3-m-a", "e7-p3-r-a", "e7-p3-m-b", "e7-p3-r-b"];

test("Probe 3: Liste und Start – Variante B erst nach dem Freischalten sichtbar, 7M nur M, 7R nur R, 8. Klasse gar nicht; keine Lösungen", async () => {
  await mitServer(async ({ post, get, lehrer }) => {
    const vorher = (await get("list")).tests.filter((t) => /^e7-p3-/.test(t.id));
    assert.deepEqual(vorher.map((t) => t.id).sort(), ["e7-p3-m-a", "e7-p3-r-a"], "gesperrte Nachschreibprobe B steht nicht in der Liste");
    assert.ok(vorher.every((t) => !t.unlocked && t.maxPoints === 70 && t.minutes === 90 && t.hoertexte === 1));
    assert.equal((await post("start", { testId: "e7-p3-r-a", code: "702" })).status, 403, "gesperrt: kein Start");
    for (const id of P3) assert.equal((await lehrer("unlock", { testId: id, open: true })).status, 200);
    const liste = (await get("list")).tests.filter((t) => /^e7-p3-/.test(t.id));
    assert.deepEqual(liste.map((t) => t.id).sort(), [...P3].sort());
    assert.ok(liste.every((t) => t.unlocked && t.title === "Test 3 (" + t.zug + "7): Welcome to Ireland"));
    for (const [id, code, falsch] of [["e7-p3-r-a", "702", "e7-p3-m-a"], ["e7-p3-m-b", "701", "e7-p3-r-b"]]) {
      const s = await post("start", { testId: id, code });
      assert.equal(s.status, 200, id);
      assert.equal((await post("start", { testId: falsch, code })).data.error, "falscher_zug", falsch + " für Code " + code);
      assert.equal((await post("start", { testId: id, code: "801" })).data.error, "falsche_stufe");
      const roh = JSON.stringify(s.data), probe = ROH.__vorlage[id];
      const h = s.data.texte.find((x) => x.typ === "hoertext");
      assert.equal(h.zentral, true); assert.equal(h.sprecher, undefined);
      assert.ok(probe.texte[0].sprecher.every((x) => !roh.includes(x.text.slice(0, 30))), id + ": kein Satz des Hörtexts geht an das Kind");
      assert.ok(!/"(answer|loesungen|kriterien|expected|keywords|pairs|bereiche)"/.test(roh), id + ": keine Lösungsfelder in der Antwort");
      // Lösungen der Satzstellung (Wortgruppen), Beispiellösungen und Erwartungshorizont stehen nirgends – einzelne Wörter wie
      // anything oder something stehen naturgemäß auch im Lesetext und zählen hier nicht
      const loesungen = probe.items.flatMap((i) => (i.teil === "C Grammar and vocabulary" ? (i.felder || []).flatMap((f) => f.loesungen).filter((l) => /\s/.test(l) && String(l).length > 6) : [])
        .concat(OFFENE.includes(i.type) ? [i.expected || ""].filter(Boolean).concat((i.kriterien || []).map((k) => k.erwartet).filter((e) => e && e.length > 12)) : []));
      assert.ok(loesungen.length >= 10, id + ": genug Lösungen zum Prüfen");
      assert.deepEqual(loesungen.filter((l) => roh.includes(JSON.stringify(l).slice(1, -1))), [], id + ": Lösungen und Erwartungshorizont bleiben auf dem Server");
      assert.ok(!/40 Euro|40 euros|forty euros|18 Euro|18 euros|eighteen euros/.test(roh), id + ": die Rechnung der Sprachmittlung bleibt auf dem Server");
      assert.deepEqual([...new Set(s.data.items.map((i) => i.teil))], ["A Listening", "B Reading", "C Grammar and vocabulary", "D Mediation", "E Writing"]);
      const d = s.data.items.filter((i) => i.teil === "D Mediation");
      assert.ok(d.every((i) => i.vorgabe) && /€/.test(d[0].vorgabe) && /Uhr/.test(d[0].vorgabe) && /„Sag /.test(d[1].vorgabe), id + ": das deutsche Infoblatt und die Bitte kommen an");
      assert.equal(Boolean(d[0].teile), /-r-/.test(id), id + ": R beantwortet die Fragen des Gasts in eigenen Feldern");
      if (d[0].teile) assert.ok(d[0].teile.every((t) => /\?/.test(t.label) && t.hilfe), id + ": die englischen Fragen mit Satzanfang kommen an");
      assert.equal(s.data.test.ohneZeit, true, "Englisch: keine Zeitbegrenzung");
    }
  });
});

test("Probe 3: Hörtext für die Lehrkraft – Mitschrift je Variante, 7R und 7M hören dieselbe Aufnahme", async () => {
  await mitServer(async ({ post, lehrer, base }) => {
    assert.equal((await post("teacher/hoertext", { testId: "e7-p3-m-a" })).status, 401);
    const mitschrift = {};
    for (const id of P3) {
      const h = (await lehrer("hoertext", { testId: id })).data.hoertexte[0];
      assert.equal(h.sprecher.length, ROH.__vorlage[id].texte[0].sprecher.length, id + ": ganze Mitschrift");
      mitschrift[id] = h.sprecher.map((s) => s.rolle + ": " + s.text).join("\n");
      // die Aufnahme selbst prüft der Datentest (fehlt sie, ist er rot) – hier nur: Route und Angabe passen zusammen
      const datei = path.join(__dirname, "e7-proben", "audio", id + "-h1.mp3");
      assert.equal(Boolean(h.aufnahme), fs.existsSync(datei), id + ": Angabe „Aufnahme vorhanden“ stimmt");
      const r = await fetch(base + "/api/e7/proben/teacher/hoertext-datei", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password: PW, testId: id, text: "h1" }) });
      assert.equal(r.status, fs.existsSync(datei) ? 200 : 404, id + ": Aufnahme nur, wenn es die Datei gibt");
    }
    assert.match(mitschrift["e7-p3-r-a"], /^Keeva: Hi Ciaran/); assert.match(mitschrift["e7-p3-m-b"], /^Gavin: /);
    assert.equal(mitschrift["e7-p3-r-a"], mitschrift["e7-p3-m-a"], "Variante A: gleicher Hörtext für R und M");
    assert.equal(mitschrift["e7-p3-r-b"], mitschrift["e7-p3-m-b"], "Variante B: gleicher Hörtext für R und M");
    assert.notEqual(mitschrift["e7-p3-r-a"], mitschrift["e7-p3-r-b"], "Nachschreiber hören einen anderen Text");
  });
});

test("Probe 3: alle vier Fassungen abgeben – Schlüssel richtig gewertet, Note nach Zug, LRS ohne Rechtschreibzeile, Infoblatt und Felder gehen an die KI", async () => {
  const merk = {};
  await mitServer(async ({ post, lehrer, fertig }) => {
    for (const id of P3) assert.equal((await lehrer("unlock", { testId: id, open: true })).status, 200);
    const { GRADE_SCALE_M, GRADE_SCALE_R } = require("./probe-kind");
    const note = (p, zug) => (zug === "M" ? GRADE_SCALE_M : GRADE_SCALE_R).find((s) => p >= s.min).grade;
    // 703 hat Notenschutz (LRS): Rechtschreibzeile der Schreibaufgabe fällt heraus – 68 statt 70 Punkte
    for (const [id, code, gesamt, schluessel] of [["e7-p3-m-a", "701", 70, 43], ["e7-p3-r-a", "702", 70, 44], ["e7-p3-m-b", "704", 70, 43], ["e7-p3-r-b", "703", 68, 44]]) {
      assert.equal((await post("start", { testId: id, code })).status, 200, id);
      const ab = await post("submit", { testId: id, code, answers: antworten(id) });
      assert.equal(ab.status, 200); assert.equal(ab.data.angekommen, true);
      const [row] = await fertig(id), zug = id[6].toUpperCase();
      const zu = row.details.filter((d) => !OFFENE.includes(d.type)).reduce((s, d) => s + d.points, 0);
      assert.equal(zu, schluessel, id + ": alle Ankreuz-, Feld-, Zeilen-, Ordnungs- und Zuordnungsaufgaben richtig (R hat mehr davon)");
      assert.equal(row.total, gesamt, id + ": Höchstpunktzahl");
      assert.equal(row.score, schluessel, id + ": die Ersatz-KI gibt bei offenen Aufgaben nichts");
      assert.equal(row.grade, note(row.percent, zug), id + ": Note nach dem " + zug + "-Schlüssel (" + row.percent + " %)");
      assert.equal(row.grade, zug === "M" ? 4 : 3, id + ": rund 62 % = M Note 4, R Note 3");
    }
    assert.ok(merk.user.some((u) => /SOMMERRODELBAHN AM ECKBERG/.test(u)) && merk.user.some((u) => /WILDPARK HIRSCHBERG/.test(u)), "das deutsche Infoblatt geht als Vorlage an die KI");
    assert.ok(merk.user.some((u) => /Sag Ruairi bitte/.test(u)) && merk.user.some((u) => /Sag Eabha bitte/.test(u)), "die Bitte der Mutter bzw. des Vaters geht an die KI");
    assert.ok(merk.user.some((u) => /verständliches Englisch für den Gast/.test(u)), "der Erwartungshorizont verlangt Englisch für den Gast");
    assert.ok(merk.system.some((s) => /getrennte Felder geschrieben/.test(s)), "die KI weiß, dass R die Fragen in eigenen Feldern beantwortet");
    assert.ok(merk.user.some((u) => /Deirdre/.test(u) && /textausschnitt/.test(u)) && merk.user.some((u) => /Dervla/.test(u) && /textausschnitt/.test(u)), "Lesefrage mit Textausschnitt");
    assert.ok(merk.optionen.length && merk.optionen.every((o) => o && o.temperatur === 0), "jede Bewertung mit Temperatur 0");
    const [r] = await fertig("e7-p3-r-a");
    assert.equal((await lehrer("bestaetigen", { submissionId: r.id })).status, 200);
    assert.equal((await lehrer("freigeben", { submissionIds: [r.id] })).status, 200);
    const k = await post("korrektur", { code: "702", testId: "e7-p3-r-a" }), korr = k.data.korrektur || k.data;
    assert.equal(korr.fach, "Englisch 7"); assert.equal(korr.ausbessern, true);
  }, merk);
});

/* ------------------------------ Probe 4 (Unit 4): vier Fassungen, Sprachmittlung Englisch → Deutsch ------------------------------ */
const P4 = ["e7-p4-m-a", "e7-p4-r-a", "e7-p4-m-b", "e7-p4-r-b"];

test("Probe 4: Liste und Start – Variante B erst nach dem Freischalten sichtbar, 7M nur M, 7R nur R, 8. Klasse gar nicht; keine Lösungen", async () => {
  await mitServer(async ({ post, get, lehrer }) => {
    const vorher = (await get("list")).tests.filter((t) => /^e7-p4-/.test(t.id));
    assert.deepEqual(vorher.map((t) => t.id).sort(), ["e7-p4-m-a", "e7-p4-r-a"], "gesperrte Nachschreibprobe B steht nicht in der Liste");
    assert.ok(vorher.every((t) => !t.unlocked && t.maxPoints === 70 && t.minutes === 90 && t.hoertexte === 1));
    assert.equal((await post("start", { testId: "e7-p4-m-a", code: "701" })).status, 403, "gesperrt: kein Start");
    for (const id of P4) assert.equal((await lehrer("unlock", { testId: id, open: true })).status, 200);
    const liste = (await get("list")).tests.filter((t) => /^e7-p4-/.test(t.id));
    assert.deepEqual(liste.map((t) => t.id).sort(), [...P4].sort());
    assert.ok(liste.every((t) => t.unlocked && t.title === "Test 4 (" + t.zug + "7): USA – here we come!"));
    for (const [id, code, falsch] of [["e7-p4-m-a", "704", "e7-p4-r-a"], ["e7-p4-r-a", "705", "e7-p4-m-a"], ["e7-p4-m-b", "701", "e7-p4-r-b"], ["e7-p4-r-b", "702", "e7-p4-m-b"]]) {
      const s = await post("start", { testId: id, code });
      assert.equal(s.status, 200, id);
      assert.equal((await post("start", { testId: falsch, code })).data.error, "falscher_zug", falsch + " für Code " + code);
      assert.equal((await post("start", { testId: id, code: "801" })).data.error, "falsche_stufe");
      const roh = JSON.stringify(s.data), probe = ROH.__vorlage[id];
      const h = s.data.texte.find((x) => x.typ === "hoertext");
      assert.equal(h.zentral, true); assert.equal(h.sprecher, undefined);
      assert.ok(probe.texte[0].sprecher.every((x) => !roh.includes(x.text.slice(0, 30))), id + ": kein Satz des Hörtexts geht an das Kind");
      assert.ok(!/"(answer|loesungen|kriterien|expected|keywords|pairs|bereiche)"/.test(roh), id + ": keine Lösungsfelder in der Antwort");
      // Lösungen der Steigerung und von too much/so many (Wortgruppen), Beispiellösungen und Erwartungshorizont stehen nirgends –
      // auch nicht versteckt in einem Lesetext, einer Antwortauswahl oder der Schreibaufgabe (der Wortkasten in der Aufgabe selbst zählt nicht)
      const loesungen = probe.items.flatMap((i) => (i.teil === "C Grammar and vocabulary" ? (i.felder || []).flatMap((f) => f.loesungen).filter((l) => /\s/.test(l) && String(l).length > 6 && !i.prompt.toLowerCase().includes(String(l).toLowerCase())) : [])
        .concat(OFFENE.includes(i.type) ? [i.expected || ""].filter(Boolean).concat((i.kriterien || []).map((k) => k.erwartet).filter((e) => e && e.length > 12)) : []));
      assert.ok(loesungen.length >= 10, id + ": genug Lösungen zum Prüfen");
      assert.deepEqual(loesungen.filter((l) => roh.toLowerCase().includes(JSON.stringify(l).slice(1, -1).toLowerCase())), [], id + ": Lösungen und Erwartungshorizont bleiben auf dem Server");
      assert.ok(!/12 Dollar|9 Dollar|zusammen 12|zusammen 9/.test(roh), id + ": die Rechnung der Sprachmittlung bleibt auf dem Server");
      assert.deepEqual([...new Set(s.data.items.map((i) => i.teil))], ["A Listening", "B Reading", "C Grammar and vocabulary", "D Mediation", "E Writing"]);
      const d = s.data.items.filter((i) => i.teil === "D Mediation");
      assert.ok(d.length === 2 && d.every((i) => i.vorgabe) && /\$/.test(d[0].vorgabe) && /“/.test(d[1].vorgabe), id + ": das englische Infoblatt und die englische Nachricht kommen an");
      assert.ok(d.every((i) => /in German/.test(i.prompt)), id + ": beide Aufgaben verlangen Deutsch");
      assert.equal(Boolean(d[0].teile), /-r-/.test(id), id + ": R beantwortet die deutschen Fragen in eigenen Feldern");
      if (d[0].teile) assert.ok(d[0].teile.every((t) => /^„.+\?.*“$/.test(t.label) && t.hilfe), id + ": die deutschen Fragen mit Satzanfang kommen an");
      assert.equal(s.data.test.ohneZeit, true, "Englisch: keine Zeitbegrenzung");
    }
  });
});

test("Probe 4: Hörtext für die Lehrkraft – Mitschrift je Variante, 7R und 7M hören dieselbe Aufnahme", async () => {
  await mitServer(async ({ post, lehrer, base }) => {
    assert.equal((await post("teacher/hoertext", { testId: "e7-p4-r-b" })).status, 401);
    const mitschrift = {};
    for (const id of P4) {
      const h = (await lehrer("hoertext", { testId: id })).data.hoertexte[0];
      assert.equal(h.sprecher.length, ROH.__vorlage[id].texte[0].sprecher.length, id + ": ganze Mitschrift");
      mitschrift[id] = h.sprecher.map((s) => s.rolle + ": " + s.text).join("\n");
      // die Aufnahme selbst prüft der Datentest (fehlt sie, ist er rot) – hier nur: Route und Angabe passen zusammen
      const datei = path.join(__dirname, "e7-proben", "audio", id + "-h1.mp3");
      assert.equal(Boolean(h.aufnahme), fs.existsSync(datei), id + ": Angabe „Aufnahme vorhanden“ stimmt");
      const r = await fetch(base + "/api/e7/proben/teacher/hoertext-datei", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password: PW, testId: id, text: "h1" }) });
      assert.equal(r.status, fs.existsSync(datei) ? 200 : 404, id + ": Aufnahme nur, wenn es die Datei gibt");
    }
    assert.match(mitschrift["e7-p4-r-a"], /^Ethan: Hi Brooke/); assert.match(mitschrift["e7-p4-m-b"], /^Marcus: Hi Paige/);
    assert.equal(mitschrift["e7-p4-r-a"], mitschrift["e7-p4-m-a"], "Variante A: gleicher Hörtext für R und M");
    assert.equal(mitschrift["e7-p4-r-b"], mitschrift["e7-p4-m-b"], "Variante B: gleicher Hörtext für R und M");
    assert.notEqual(mitschrift["e7-p4-r-a"], mitschrift["e7-p4-r-b"], "Nachschreiber hören einen anderen Text");
  });
});

test("Probe 4: alle vier Fassungen abgeben – Schlüssel richtig gewertet, Note nach Zug, LRS ohne Rechtschreibzeile, Infoblatt, Nachricht und Felder gehen an die KI (Temperatur 0)", async () => {
  const merk = {};
  await mitServer(async ({ post, lehrer, fertig }) => {
    for (const id of P4) assert.equal((await lehrer("unlock", { testId: id, open: true })).status, 200);
    const { GRADE_SCALE_M, GRADE_SCALE_R } = require("./probe-kind");
    const note = (p, zug) => (zug === "M" ? GRADE_SCALE_M : GRADE_SCALE_R).find((s) => p >= s.min).grade;
    // 703 hat Notenschutz (LRS): Rechtschreibzeile der Schreibaufgabe fällt heraus – 68 statt 70 Punkte
    for (const [id, code, gesamt, schluessel] of [["e7-p4-m-a", "701", 70, 43], ["e7-p4-r-a", "703", 68, 44], ["e7-p4-m-b", "704", 70, 43], ["e7-p4-r-b", "702", 70, 44]]) {
      assert.equal((await post("start", { testId: id, code })).status, 200, id);
      const ab = await post("submit", { testId: id, code, answers: antworten(id) });
      assert.equal(ab.status, 200); assert.equal(ab.data.angekommen, true);
      const [row] = await fertig(id), zug = id[6].toUpperCase();
      const zu = row.details.filter((d) => !OFFENE.includes(d.type)).reduce((s, d) => s + d.points, 0);
      assert.equal(zu, schluessel, id + ": alle Ankreuz-, Feld-, Zeilen-, Ordnungs- und Zuordnungsaufgaben richtig (R hat mehr davon)");
      assert.equal(row.total, gesamt, id + ": Höchstpunktzahl");
      assert.equal(row.score, schluessel, id + ": die Ersatz-KI gibt bei offenen Aufgaben nichts");
      assert.equal(row.grade, note(row.percent, zug), id + ": Note nach dem " + zug + "-Schlüssel (" + row.percent + " %)");
      assert.equal(row.grade, zug === "M" ? 4 : 3, id + ": rund 62 % = M Note 4, R Note 3");
      assert.equal(row.zug, zug, id + ": Zug im Datensatz");
    }
    assert.ok(merk.user.some((u) => /FOURTH OF JULY IN MILLBROOK/.test(u)) && merk.user.some((u) => /HOLLOW CREEK FARM/.test(u)), "das englische Infoblatt geht als Vorlage an die KI");
    assert.ok(merk.user.some((u) => /Mrs Kowalski/.test(u)) && merk.user.some((u) => /Sign at the entrance/.test(u)), "die englische Nachricht und das Schild gehen an die KI");
    assert.ok(merk.user.some((u) => /verständliches Deutsch für die genannte Person/.test(u)), "der Erwartungshorizont verlangt Deutsch für die Familie");
    assert.ok(merk.system.some((s) => /getrennte Felder geschrieben/.test(s)), "die KI weiß, dass R die Fragen in eigenen Feldern beantwortet");
    assert.ok(merk.user.some((u) => /Seven days without a phone/.test(u) && /textausschnitt/.test(u)) && merk.user.some((u) => /Sports, sports, sports!/.test(u) && /textausschnitt/.test(u)), "Lesefrage mit Textausschnitt");
    assert.ok(merk.optionen.length && merk.optionen.every((o) => o && o.temperatur === 0), "jede Bewertung mit Temperatur 0");
    const [m] = await fertig("e7-p4-m-b");
    assert.equal((await lehrer("bestaetigen", { submissionId: m.id })).status, 200);
    assert.equal((await lehrer("freigeben", { submissionIds: [m.id] })).status, 200);
    const k = await post("korrektur", { code: "704", testId: "e7-p4-m-b" }), korr = k.data.korrektur || k.data;
    assert.equal(korr.fach, "Englisch 7"); assert.equal(korr.ausbessern, true);
  }, merk);
});

// Grammatik G10/G11 über die echte Wertung: richtige Formen zählen, typische Fehler (Superlativ ohne the, more bei kurzen
// Adjektiven, much statt many, too much statt too many) nicht – Groß-/Kleinschreibung und ein Satzzeichen am Ende sind egal
test("Probe 4: Grammatik G10/G11 – the best ja, best ohne the und more deep nein; much statt many und too much statt too many falsch; Großschreibung und Punkt egal", async () => {
  await mitServer(async ({ post, lehrer, fertig }) => {
    const id = "e7-p4-m-a", items = ROH[id].items;
    assert.equal((await lehrer("unlock", { testId: id, open: true })).status, 200);
    const steig = items.findIndex((i) => i.teil === "C Grammar and vocabulary" && i.type === "felder" && /^Steigerung/.test(i.hinweis));
    const menge = items.findIndex((i) => i.teil === "C Grammar and vocabulary" && i.type === "felder" && /^many bei/.test(i.hinweis));
    const zuviel = items.findIndex((i) => i.teil === "C Grammar and vocabulary" && i.type === "felder" && /^too much/.test(i.hinweis));
    assert.ok(steig >= 0 && menge >= 0 && zuviel >= 0);
    const roh = antworten(id);
    // Steigerung: more expensive · the best · the most useful · deeper · less dangerous · the least difficult
    roh[steig] = ["More expensive.", "best", "the most useful", "more deep", "less dangerous", "the least difficult"];
    roh[menge] = ["much", "much", "many", "much"];          // erstes Feld falsch (photos → many)
    roh[zuviel] = ["too much", "So much!", "too much", "so many"];   // drittes Feld falsch (cars → too many)
    assert.equal((await post("start", { testId: id, code: "701" })).status, 200);
    assert.equal((await post("submit", { testId: id, code: "701", answers: roh })).status, 200);
    const [row] = await fertig(id);
    assert.deepEqual(row.details[steig].felder.map((x) => x.punkte), [1, 0, 1, 0, 1, 1], "Großschreibung und Punkt egal; best ohne the und more deep sind falsch");
    assert.deepEqual(row.details[menge].felder.map((x) => x.punkte), [0, 1, 1, 1], "much photos ist falsch");
    assert.deepEqual(row.details[zuviel].felder.map((x) => x.punkte), [1, 1, 0, 1], "too much cars ist falsch");
    assert.equal(row.score, 43 - 4, "nur die vier falschen Felder fehlen");
  });
});

/* ------------------------------ Probe 1 B (Unit 1): Nachschreibprobe, 7R und 7M dieselben Aufgaben wie in Probe 1 A ------------------------------ */
const P1B = ["e7-p1-m-b", "e7-p1-r-b"];

test("Probe 1 B: Liste und Start – erst nach dem Freischalten sichtbar, 7M nur M, 7R nur R, 8. Klasse gar nicht; keine Lösungen", async () => {
  await mitServer(async ({ post, get, lehrer }) => {
    const vorher = (await get("list")).tests.filter((t) => /^e7-p1-/.test(t.id));
    assert.deepEqual(vorher.map((t) => t.id).sort(), ["e7-p1-m-a", "e7-p1-r-a"], "gesperrte Nachschreibprobe B steht nicht in der Liste");
    assert.equal((await post("start", { testId: "e7-p1-m-b", code: "701" })).status, 403, "gesperrt: kein Start");
    for (const id of P1B) assert.equal((await lehrer("unlock", { testId: id, open: true })).status, 200);
    const liste = (await get("list")).tests.filter((t) => /^e7-p1-/.test(t.id));
    assert.deepEqual(liste.map((t) => t.id).sort(), ["e7-p1-m-a", "e7-p1-m-b", "e7-p1-r-a", "e7-p1-r-b"]);
    assert.ok(liste.filter((t) => P1B.includes(t.id)).every((t) => t.unlocked && t.variante === "B" && t.maxPoints === 70 && t.minutes === 90 && t.hoertexte === 1 && t.title === "Test 1 (" + t.zug + "7): Out and about in England"));
    for (const [id, code, falsch] of [["e7-p1-m-b", "704", "e7-p1-r-b"], ["e7-p1-r-b", "705", "e7-p1-m-b"]]) {
      const s = await post("start", { testId: id, code });
      assert.equal(s.status, 200, id);
      assert.equal((await post("start", { testId: falsch, code })).data.error, "falscher_zug", falsch + " für Code " + code);
      assert.equal((await post("start", { testId: id, code: "801" })).data.error, "falsche_stufe");
      const roh = JSON.stringify(s.data), probe = ROH.__vorlage[id];
      const h = s.data.texte.find((x) => x.typ === "hoertext");
      assert.equal(h.zentral, true); assert.equal(h.sprecher, undefined); assert.deepEqual(h.rollen, ["Reggie", "Maisie"]);
      assert.ok(probe.texte[0].sprecher.every((x) => !roh.includes(x.text.slice(0, 30))), id + ": kein Satz des Hörtexts geht an das Kind");
      assert.ok(!/"(answer|loesungen|kriterien|expected|keywords|pairs|bereiche)"/.test(roh), id + ": keine Lösungsfelder in der Antwort");
      // Lösungen der Grammatik (Wortgruppen), Beispiellösungen und Erwartungshorizont stehen nirgends
      const loesungen = probe.items.flatMap((i) => (i.teil === "C Grammar and vocabulary" ? (i.felder || []).flatMap((f) => f.loesungen).filter((l) => /\s/.test(l) && String(l).length > 6) : [])
        .concat(["offen", "schreiben"].includes(i.type) ? [i.expected || ""].filter(Boolean).concat((i.kriterien || []).map((k) => k.erwartet).filter((e) => e && e.length > 12)) : []));
      assert.ok(loesungen.length >= 10, id + ": genug Lösungen zum Prüfen");
      // als ganze Wörter gesucht („he doesn't“ steckt sonst in „she doesn't speak much English“ der Lage)
      const steht = (l) => new RegExp("(?<![a-z])" + JSON.stringify(l).slice(1, -1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?![a-z])", "i").test(roh);
      assert.deepEqual(loesungen.filter(steht), [], id + ": Lösungen und Erwartungshorizont bleiben auf dem Server");
      assert.ok(!/28 Pfund|zusammen 28/.test(roh), id + ": die Rechnung der Sprachmittlung bleibt auf dem Server");
      assert.ok(!/did you have|does your brother like|"drove"|"catches"|"theirs"/.test(roh), id + ": Lösungen der Grammatik bleiben auf dem Server");
      assert.deepEqual([...new Set(s.data.items.map((i) => i.teil))], ["A Listening", "B Reading", "C Grammar and vocabulary", "D Mediation", "E Writing"]);
      const d = s.data.items.filter((i) => i.teil === "D Mediation");
      assert.ok(d.length === 5 && d.every((i) => i.vorgabe) && /Frau Keller: „/.test(d[0].vorgabe) && /Assistant: “/.test(d[1].vorgabe), id + ": jede Sprechblase der Mediation kommt an");
      assert.equal(s.data.sitzung.minuten, 90);
      assert.equal(s.data.test.ohneZeit, true, "Englisch: keine Zeitbegrenzung");
    }
  });
});

test("Probe 1 B: Hörtext für die Lehrkraft – Mitschrift, 7R und 7M hören dieselbe Aufnahme, anders als Probe 1 A", async () => {
  await mitServer(async ({ post, lehrer, base }) => {
    assert.equal((await post("teacher/hoertext", { testId: "e7-p1-r-b" })).status, 401);
    const mitschrift = {};
    for (const id of ["e7-p1-r-a", ...P1B]) {
      const h = (await lehrer("hoertext", { testId: id })).data.hoertexte[0];
      assert.equal(h.sprecher.length, ROH.__vorlage[id].texte[0].sprecher.length, id + ": ganze Mitschrift");
      mitschrift[id] = h.sprecher.map((s) => s.rolle + ": " + s.text).join("\n");
      // die Aufnahme selbst prüft der Datentest (fehlt sie, ist er rot) – hier nur: Route und Angabe passen zusammen
      const datei = path.join(__dirname, "e7-proben", "audio", id + "-h1.mp3");
      assert.equal(Boolean(h.aufnahme), fs.existsSync(datei), id + ": Angabe „Aufnahme vorhanden“ stimmt");
      const r = await fetch(base + "/api/e7/proben/teacher/hoertext-datei", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password: PW, testId: id, text: "h1" }) });
      assert.equal(r.status, fs.existsSync(datei) ? 200 : 404, id + ": Aufnahme nur, wenn es die Datei gibt");
    }
    assert.match(mitschrift["e7-p1-m-b"], /^Reggie: Hi Maisie!/);
    assert.equal(mitschrift["e7-p1-r-b"], mitschrift["e7-p1-m-b"], "Variante B: gleicher Hörtext für R und M");
    assert.notEqual(mitschrift["e7-p1-r-a"], mitschrift["e7-p1-r-b"], "Nachschreiber hören einen anderen Text");
  });
});

test("Probe 1 B: beide Fassungen abgeben – Schlüssel richtig gewertet (wie A 43 Punkte), Note nach Zug, LRS ohne Rechtschreibzeile, Sprechblasen und Textausschnitt gehen an die KI", async () => {
  const merk = {};
  await mitServer(async ({ post, lehrer, fertig }) => {
    for (const id of P1B) assert.equal((await lehrer("unlock", { testId: id, open: true })).status, 200);
    const { GRADE_SCALE_M, GRADE_SCALE_R } = require("./probe-kind");
    const note = (p, zug) => (zug === "M" ? GRADE_SCALE_M : GRADE_SCALE_R).find((s) => p >= s.min).grade;
    // 703 hat Notenschutz (LRS): Rechtschreibzeile der Schreibaufgabe fällt heraus – 68 statt 70 Punkte
    for (const [id, code, gesamt] of [["e7-p1-m-b", "701", 70], ["e7-p1-r-b", "703", 68]]) {
      assert.equal((await post("start", { testId: id, code })).status, 200, id);
      const ab = await post("submit", { testId: id, code, answers: antworten(id) });
      assert.equal(ab.status, 200); assert.equal(ab.data.angekommen, true);
      const [row] = await fertig(id), zug = id[6].toUpperCase();
      const zu = row.details.filter((d) => !OFFENE.includes(d.type)).reduce((s, d) => s + d.points, 0);
      assert.equal(zu, 43, id + ": alle Ankreuz-, Feld-, Zeilen-, Ordnungs- und Zuordnungsaufgaben richtig (wie Probe 1 A)");
      assert.equal(row.total, gesamt, id + ": Höchstpunktzahl");
      assert.equal(row.score, 43, id + ": die Ersatz-KI gibt bei offenen Aufgaben nichts");
      assert.equal(row.grade, note(row.percent, zug), id + ": Note nach dem " + zug + "-Schlüssel (" + row.percent + " %)");
      assert.equal(row.grade, zug === "M" ? 4 : 3, id + ": rund 62 % = M Note 4, R Note 3");
    }
    assert.ok(merk.user.some((u) => /Frau Keller/.test(u)) && merk.user.some((u) => /Larkdale Railway/.test(u)), "die Sprechblasen und die Lage gehen an die KI");
    assert.ok(merk.user.some((u) => /Mr Ashworth/.test(u) && /textausschnitt/.test(u)), "Lesefrage mit Textausschnitt");
    assert.match(merk.system.join("\n"), /Sprachmittlung ist keine Übersetzung/);
    assert.ok(merk.optionen.length && merk.optionen.every((o) => o && o.temperatur === 0), "jede Bewertung mit Temperatur 0");
    const [m] = await fertig("e7-p1-m-b");
    assert.equal((await lehrer("bestaetigen", { submissionId: m.id })).status, 200);
    assert.equal((await lehrer("freigeben", { submissionIds: [m.id] })).status, 200);
    const k = await post("korrektur", { code: "701", testId: "e7-p1-m-b" }), korr = k.data.korrektur || k.data;
    assert.equal(korr.fach, "Englisch 7"); assert.equal(korr.ausbessern, true);
  }, merk);
});