"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const zlib = require("node:zlib");
const test = require("node:test");
const express = require("express");
const { registerInfoaustauschRoutes } = require("./infoaustausch");
const { TESTS: INF7 } = require("./infoaustausch-daten");
const { TESTS: INF8, GRADE_SCALE, KI_REGELN } = require("./informatik8-daten");

let server;
let baseUrl;
let aiMode = "ok";
let textPoints = 2;
const systems = [];
const users = [];

test.before(async () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "informatik8-"));
  const app = express();
  app.use(express.json());
  const askAnthropic = async (system, user) => {
    systems.push(system);
    users.push(user);
    if (aiMode === "down") throw new Error("offline");
    if (system.includes("UEBUNGSAUFGABE")) return JSON.stringify({ richtig: true, rueckmeldung: "Gut erklärt." });
    // Antworten mit FALSCH bekommen 0 Punkte, alle anderen textPoints
    const points = user.includes("FALSCH") ? 0 : textPoints;
    return JSON.stringify({ points, comment: "passt" });
  };
  // Codes 100-199: R-Klasse 8b, 200-299: M-Klasse 8aM (Anmeldung wie im Lernfortschritt)
  const kindZumCode = async (code) => (/^1\d\d$/.test(code) ? { code, klasse: "8b" } : /^2\d\d$/.test(code) ? { code, klasse: "8aM" } : null);
  const common = { dataDir, teacherPassword: "2", hashSecret: "x", askAnthropic, kindZumCode };
  registerInfoaustauschRoutes(app, { ...common, tests: INF7 });
  registerInfoaustauschRoutes(app, {
    ...common, tests: INF8, prefix: "/api/informatik8", storeName: "informatik8",
    gradeScale: GRADE_SCALE, kiRegeln: KI_REGELN
  });
  await new Promise((resolve) => { server = app.listen(0, resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(() => server && server.close());

const post = async (route, body) => {
  const res = await fetch(baseUrl + route, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
  });
  return { status: res.status, data: await res.json() };
};
const probe = INF8["inf8-probe1"];
const student = (n) => ({ testId: "inf8-probe1", code: String(100 + n) });

/* Antworten, die genau `wrong` Anklick-Punkte verschenken; freie Texte bekommen textPoints. */
function answers(wrongChoices = 0) {
  let left = wrongChoices;
  return probe.items.map((it) => {
    if (it.type === "choice") {
      if (left > 0) { left--; return (it.answer + 1) % it.options.length; }
      return it.answer;
    }
    if (it.type === "match") return it.rows.map((r) => r.answer);
    return "Eine ernsthafte Antwort mit Inhalt.";
  });
}

/* Minimales Entpacken, um die Excel-Datei zu pruefen */
function unzip(buf) {
  const files = {};
  let end = buf.length - 22;
  while (buf.readUInt32LE(end) !== 0x06054b50) end--;
  const count = buf.readUInt16LE(end + 10);
  let p = buf.readUInt32LE(end + 16);
  for (let i = 0; i < count; i++) {
    const method = buf.readUInt16LE(p + 10);
    const size = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extra = buf.readUInt16LE(p + 30);
    const comment = buf.readUInt16LE(p + 32);
    const offset = buf.readUInt32LE(p + 42);
    const name = buf.slice(p + 46, p + 46 + nameLen).toString("utf8");
    const dataStart = offset + 30 + buf.readUInt16LE(offset + 26) + buf.readUInt16LE(offset + 28);
    const raw = buf.slice(dataStart, dataStart + size);
    files[name] = (method === 8 ? zlib.inflateRawSync(raw) : raw).toString("utf8");
    p += 46 + nameLen + extra + comment;
  }
  return files;
}

test("Probe: 6 Module je 6 Punkte + 4 Punkte Transfer = 40, gesperrt, ohne Loesungen", async () => {
  const teile = {};
  probe.items.forEach((it) => {
    const p = it.type === "match" ? it.rows.length : it.points;
    teile[it.teil] = (teile[it.teil] || 0) + p;
  });
  assert.deepEqual(Object.values(teile), [6, 6, 6, 6, 6, 6, 4]);
  assert.equal(probe.items.filter((it) => it.teil.startsWith("Transfer")).length, 2);

  const list = await (await fetch(baseUrl + "/api/informatik8/list")).json();
  assert.equal(list.tests.length, 1);
  assert.equal(list.tests[0].itemCount, 26);
  assert.equal(list.tests[0].maxPoints, 40);
  assert.equal(list.tests[0].unlocked, false);

  assert.equal((await post("/api/informatik8/start", student(0))).status, 403);
  assert.equal((await post("/api/informatik8/unlock", { password: "falsch", testId: "inf8-probe1", open: true })).status, 401);
  assert.equal((await post("/api/informatik8/unlock", { password: "2", testId: "inf8-probe1", open: true })).status, 200);

  const start = await post("/api/informatik8/start", student(0));
  assert.equal(start.status, 200);
  const raw = JSON.stringify(start.data);
  for (const secret of ['"answer"', '"expected"', '"keywords"', '"kriterien"', '"keywordsVoll"']) {
    assert.ok(!raw.includes(secret), secret + " darf nicht an den Browser gehen");
  }
  assert.equal(start.data.items[0].teil, "Modul 1 · Was sind Rechnernetze?");
  assert.equal(start.data.items[25].teil, "Transfer · Wende dein Wissen an");
  const match = start.data.items.find((it) => it.type === "match");
  assert.equal(match.points, 2);

  // Informatik 7 ist davon nicht betroffen
  const inf7 = await (await fetch(baseUrl + "/api/infoaustausch/list")).json();
  assert.equal(inf7.tests[0].id, "inf7-info-probe1");
  assert.equal(inf7.tests[0].unlocked, false);
});

test("Volle Punktzahl ergibt Note 1, Punkte je Modul werden zurueckgegeben", async () => {
  textPoints = 2;
  const res = await post("/api/informatik8/submit", { ...student(1), answers: answers(0) });
  assert.equal(res.status, 200);
  assert.equal(res.data.result.score, 40);
  assert.equal(res.data.result.grade, 1);
  assert.deepEqual(res.data.result.teile.map((t) => t.points), [6, 6, 6, 6, 6, 6, 4]);
  assert.equal(res.data.result.details[0].teil, "Modul 1 · Was sind Rechnernetze?");

  // Zuordnen zaehlt je Zeile
  const a = answers(0);
  const wlan = probe.items[2].options.indexOf("WLAN (Funk)"); // Optionen sind gemischt (proben-mischen.js)
  a[2] = [wlan, wlan]; // erste Zeile falsch (gehört zu LAN), zweite richtig
  const part = await post("/api/informatik8/submit", { ...student(2), answers: a });
  const m = part.data.result.details[2];
  assert.equal(m.points, 1);
  assert.equal(m.maxPoints, 2);
  assert.match(m.given, /WLAN/);
});

test("Note 1 nur, wenn alle Module sitzen: 35 Punkte = 1, 34 Punkte = 2, ein ganzes Modul falsch = 2", async () => {
  textPoints = 2;
  const eins = await post("/api/informatik8/submit", { ...student(10), answers: answers(5) });
  assert.equal(eins.data.result.score, 35);
  assert.equal(eins.data.result.grade, 1);

  const zwei = await post("/api/informatik8/submit", { ...student(11), answers: answers(6) });
  assert.equal(zwei.data.result.score, 34);
  assert.equal(zwei.data.result.grade, 2);

  // Modul 3 komplett falsch, alles andere inklusive Transfer richtig
  const a = answers(0);
  probe.items.forEach((it, i) => {
    if (!it.teil.startsWith("Modul 3")) return;
    if (it.type === "choice") a[i] = (it.answer + 1) % it.options.length;
    else if (it.type === "match") a[i] = it.rows.map((r) => (r.answer + 1) % it.options.length);
    else a[i] = "FALSCH";
  });
  const ohneModul = await post("/api/informatik8/submit", { ...student(12), answers: a });
  assert.equal(ohneModul.data.result.score, 34);
  assert.equal(ohneModul.data.result.grade, 2);
  assert.equal(ohneModul.data.result.teile[2].points, 0);
});

test("50 Prozent sind Note 3, 48 Prozent Note 4", async () => {
  textPoints = 0; // 24 Punkte aus Anklicken und Zuordnen
  const drei = await post("/api/informatik8/submit", { ...student(3), answers: answers(4) }); // 20/40
  assert.equal(drei.data.result.score, 20);
  assert.equal(drei.data.result.percent, 50);
  assert.equal(drei.data.result.grade, 3);

  const vier = await post("/api/informatik8/submit", { ...student(4), answers: answers(5) }); // 19/40
  assert.equal(vier.data.result.grade, 4);
  textPoints = 2;
});

test("M-Klassen: 50 Prozent sind Note 4, 92 Prozent Note 1", async () => {
  textPoints = 0;
  const m = await post("/api/informatik8/submit", { ...student(103), answers: answers(4) }); // Code 203, 20/40
  assert.equal(m.data.result.percent, 50);
  assert.equal(m.data.result.grade, 4);
  textPoints = 2;
  const rec = (await post("/api/informatik8/results", { password: "2", testId: "inf8-probe1" })).data.submissions.find((r) => r.code === "203");
  assert.equal(rec.zug, "M");
});

test("KI bekommt Punkteverteilung und wohlwollende Regeln", async () => {
  const kiPrompt = users.find((u) => u.includes("Nenne zwei Dienste"));
  assert.ok(kiPrompt.includes("So verteilt die Lehrkraft die Punkte"));
  assert.ok(kiPrompt.includes("Je passender Dienst 1 Punkt"));
  assert.ok(systems.some((s) => s.includes("SEHR WOHLWOLLEND")));
});

test("Ohne KI greifen die Stichwoerter grosszuegig und die Abgabe wird zur Pruefung markiert", async () => {
  aiMode = "down";
  const a = answers(0);
  a[3] = "drucken und e-mails schicken";                                         // 2 Treffer reichen
  a[7] = "Der Browser schickt eine Anfrage an den Server und bekommt eine Antwort.";
  const res = await post("/api/informatik8/submit", { ...student(5), answers: a });
  aiMode = "ok";
  assert.equal(res.status, 200);
  assert.equal(res.data.result.needsReview, true);
  assert.equal(res.data.result.details[3].points, 2);
  assert.equal(res.data.result.details[7].points, 2);
});

test("Zweite Abgabe unter gleichem Namen wird abgewiesen, Lehrkraft kann korrigieren", async () => {
  const again = await post("/api/informatik8/submit", { ...student(1), answers: answers(0) });
  assert.equal(again.status, 409);

  const results = await post("/api/informatik8/results", { password: "2", testId: "inf8-probe1" });
  const rec = results.data.submissions.find((r) => r.code === "103");
  const fix = await post("/api/informatik8/override", { password: "2", submissionId: rec.id, nr: 16, points: 2 });
  assert.equal(fix.data.score, 22);
  assert.equal(fix.data.grade, 3);
});

test("Export: echte Excel-Datei mit Ergebnissen, Punkten je Modul und allen Antworten", async () => {
  const res = await fetch(baseUrl + "/api/informatik8/export", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: "2", testId: "inf8-probe1", format: "xlsx" })
  });
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type"), /spreadsheetml/);
  assert.match(res.headers.get("content-disposition"), /informatik8_inf8-probe1_\d{4}-\d{2}-\d{2}\.xlsx/);
  const buf = Buffer.from(await res.arrayBuffer());
  assert.equal(buf.slice(0, 2).toString(), "PK");

  const files = unzip(buf);
  assert.ok(files["[Content_Types].xml"]);
  assert.match(files["xl/workbook.xml"], /name="Ergebnisse".*name="Antworten".*name="Notenschlüssel"/);
  const ergebnisse = files["xl/worksheets/sheet1.xml"];
  assert.ok(ergebnisse.includes("Modul 1 (6 P)"));
  assert.ok(ergebnisse.includes("Transfer (4 P)"));
  assert.ok(ergebnisse.includes("Code 101"));
  const antworten = files["xl/worksheets/sheet2.xml"];
  assert.ok(antworten.includes("Nenne zwei Dienste"));
  assert.ok(antworten.includes("Lösung"));
  // Notenschluessel: Note 1 ab 35 Punkten, Note 3 ab 20 Punkten
  const schluessel = files["xl/worksheets/sheet3.xml"];
  assert.match(schluessel, /<c r="A2"><v>1<\/v><\/c><c r="B2"><v>87<\/v><\/c><c r="C2"><v>35<\/v><\/c>/);
  assert.match(schluessel, /<c r="A4"><v>3<\/v><\/c><c r="B4"><v>50<\/v><\/c><c r="C4"><v>20<\/v><\/c>/);

  // CSV gibt es weiterhin, sortiert, mit Modulspalten und deutscher Uhrzeit
  const csvBuf = Buffer.from(await (await fetch(baseUrl + "/api/informatik8/export", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: "2", testId: "inf8-probe1" })
  })).arrayBuffer());
  // UTF-8-BOM, damit Excel die Umlaute richtig liest (fetch().text() wuerde ihn entfernen)
  assert.deepEqual([...csvBuf.slice(0, 3)], [0xef, 0xbb, 0xbf]);
  const csv = csvBuf.slice(3).toString("utf8");
  assert.ok(csv.split("\r\n")[0].includes('"Modul 6 (6 P)";"Transfer (4 P)";"Abgabe"'));
  assert.match(csv.split("\r\n")[1], /"\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}"$/);

  const denied = await post("/api/informatik8/export", { password: "falsch", format: "xlsx" });
  assert.equal(denied.status, 401);
});

test("Uebungs-Rueckmeldung nutzt den Bewertungstext fuer Klasse 8", async () => {
  const res = await post("/api/informatik8/feedback", { frage: "Was ist ein Router?", erwartet: "leitet Daten weiter", antwort: "verbindet Netze", thema: "Rechnernetze" });
  assert.equal(res.data.richtig, true);
  assert.ok(systems.at(-1).includes("8. Klasse"));
  await post("/api/infoaustausch/feedback", { frage: "x", antwort: "eine Antwort" });
  assert.ok(systems.at(-1).includes("7. Klasse"));
});
