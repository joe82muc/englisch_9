"use strict";

// Deutsch 7, Probe 9 (M7) „Einen Aufruf schreiben“ (seit 06.11.2026): der ganze Weg mit den echten Daten – Felder je Teil
// (teile) beim Start, Abgabe als Text mit den Namen der Felder, Auftrag an die KI, Punkte mit und ohne Notenschutz.
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const { registerD7ProbenRoutes } = require("./d7-proben");
const DATEN = require("./d7-proben-daten");
const vorschau = require("./proben-vorschau");

const PW = "Nur-ein-Test-4711";
const KINDER = { 101: { klasse: "7aM" }, 102: { klasse: "7aM", lrs: true }, 201: { klasse: "7b" } };
const kindZumCode = async (code) => {
  const k = KINDER[Number(code)];
  return k ? { code: String(code).padStart(3, "0"), klasse: k.klasse, zug: /M$/.test(k.klasse) ? "7M" : "7R", lrs: Boolean(k.lrs) } : null;
};
const warte = (ms) => new Promise((ok) => setTimeout(ok, ms));
const ID = "d7-p9-m-a";
const PROBE = DATEN[ID];

// So schickt die Seite (7M/Deutsch/probe.js) eine Antwort in Teilen: je Feld eine Zeile „Name: Text“
const teilName = (t) => (typeof t === "string" ? t : (t.gruppe ? t.gruppe + " – " : "") + t.label);
const teilVorn = (n) => n + (/[.:]$/.test(n) ? " " : ": ");
const inTeilen = (item, werte) => (item.teile.length === 1 ? werte[0] : item.teile.map((t, j) => [t, werte[j] || ""]).filter(([t, w]) => w || !t.frei).map(([t, w]) => teilVorn(teilName(t)) + w).join("\n"));

function antworten() {
  return PROBE.items.map((it) => {
    if (it.type === "choice") return it.answer;
    if (it.type === "match") return it.pairs.map((p) => p[1]);
    const werte = it.teile.map((t, j) => (typeof t !== "string" && t.frei ? "" : "Antwort " + (j + 1)));
    return inTeilen(it, werte);
  });
}

async function mitServer(lauf) {
  const auftraege = [];
  const askAnthropic = async (system, user) => {
    const a = JSON.parse(user);
    auftraege.push({ system, a });
    if (a.erwartungshorizont.length === 5) return JSON.stringify({ punkte: [3, 3, 2, 1, 2], begruendung: ["gut", "gut", "Beispiel fehlt", "ja", "wenige Fehler"], gelungen: ["Drei Argumente"], arbeiten: ["Beispiel"], hinweis: "Beispiel ergänzen.", kategorien: [] });
    return JSON.stringify({ punkte: a.erwartungshorizont.map((k) => k.hoechstpunkte), korrektur: "Passt.", hinweis: "", kategorie: "" });
  };
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "d7-probe9-"));
  const app = express();
  app.use(express.json());
  registerD7ProbenRoutes(app, { dataDir, teacherPassword: PW, kindZumCode, askAnthropic, kiPauseMs: 40, nachholenMs: 0 });
  const server = await new Promise((resolve) => { const s = app.listen(0, () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (route, body) => fetch(base + "/api/d7/proben/" + route, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
    .then(async (r) => ({ status: r.status, data: await r.json().catch(() => null) }));
  const get = (route) => fetch(base + "/api/d7/proben/" + route).then((r) => r.json());
  const lehrer = (route, body) => post("teacher/" + route, { password: PW, ...body });
  const fertig = async (n) => { for (let i = 0; i < 400; i++) { const r = (await lehrer("results", { testId: ID })).data.submissions; if (r.length >= n && r.every((x) => x.status !== "eingegangen")) return r; await warte(25); } throw new Error("KI wurde nicht fertig"); };
  try { await lauf({ post, get, lehrer, fertig, auftraege }); } finally { server.close(); fs.rmSync(dataDir, { recursive: true, force: true }); }
}

test("Probe 9: Liste, Start mit Feldern je Teil (ohne Lösungen), nur für M7", () => mitServer(async ({ post, get, lehrer }) => {
  let liste = (await get("list")).tests.filter((t) => t.nr === 9);
  assert.deepEqual(liste.map((t) => [t.id, t.unlocked, t.maxPoints, t.itemCount]), [[ID, false, 40, 13]], "zuerst gesperrt");
  assert.equal((await post("start", { testId: ID, code: "101" })).data.error, "locked");
  assert.equal((await lehrer("unlock", { testId: ID, open: true })).status, 200);
  assert.equal((await post("start", { testId: ID, code: "201" })).data.error, "falscher_zug", "R7 schreibt diese Probe nicht");
  const r = await post("start", { testId: ID, code: "101" });
  assert.equal(r.status, 200);
  assert.match(r.data.test.hinweis, /zählt doppelt/);
  assert.deepEqual(r.data.texte.map((t) => t.typ), ["text", "tabelle", "tabelle"]);
  const items = r.data.items, roh = JSON.stringify(items);
  for (const geheim of ["kriterien", "erwartet", "expected", "keywords", "answer", "Tiere retten"]) assert.ok(!roh.includes(geheim), "Lösung im Start: " + geheim);
  const haupt = items.find((i) => i.type === "schreiben");
  assert.equal(haupt.teile.length, 12);
  assert.deepEqual(haupt.teile[0], { label: "Behauptung", gruppe: "Argument 1", hilfe: "Was meine ich?" });
  assert.equal(haupt.teile[9].frei, true); assert.match(haupt.teile[9].zusatz, /freiwillig/);
  assert.deepEqual(items.filter((i) => i.type === "offen").map((i) => i.teile.length), [4, 4, 1, 2, 5, 1, 3]);
  assert.deepEqual(items.filter((i) => i.teil).map((i) => i.nr), [1, 6, 10], "Überschriften Teil A, B, C");
}));

test("Probe 9: Abgabe in Teilen – KI sieht die Feldnamen, 40 Punkte, mit Notenschutz 38", () => mitServer(async ({ post, lehrer, fertig, auftraege }) => {
  await lehrer("unlock", { testId: ID, open: true });
  assert.equal((await post("submit", { testId: ID, code: "101", answers: antworten() })).status, 200);
  assert.equal((await post("submit", { testId: ID, code: "102", answers: antworten() })).status, 200);
  const rows = await fertig(2), ohne = rows.find((x) => x.code === "101"), lrs = rows.find((x) => x.code === "102");
  // Ankreuzen und Zuordnen richtig (6), offene Aufgaben voll (KI-Attrappe), Hauptteil 11 von 12
  assert.deepEqual([ohne.score, ohne.total], [39, 40]);
  assert.deepEqual([lrs.score, lrs.total], [37, 38], "Notenschutz: Rechtschreibung (2 Punkte) zählt nicht");
  assert.equal(String(ohne.grade), "1"); assert.equal(String(lrs.grade), "1");
  // Die Antwort des Kindes bleibt, wie die Seite sie geschickt hat
  const haupt = ohne.details.find((d) => d.type === "schreiben");
  assert.match(haupt.given, /^Argument 1 – Behauptung: Antwort 1\nArgument 1 – Begründung: Antwort 2/);
  assert.ok(!/Argument 4/.test(haupt.given), "leeres freiwilliges Argument fehlt");
  // Auftrag an die KI: Hinweis auf die Felder, Antwort mit Feldnamen
  const hauptAuftrag = auftraege.find((x) => x.a.erwartungshorizont.length === 5);
  assert.match(hauptAuftrag.system, /getrennte Felder/);
  assert.match(hauptAuftrag.a.schuelerantwort, /Argument 3 – Beispiel: /);
  assert.match(hauptAuftrag.a.textausschnitt, /Krötenzaun an der Waldstraße/);
  const einFeld = auftraege.find((x) => /Überschrift/.test(x.a.aufgabe));
  assert.ok(!/getrennte Felder/.test(einFeld.system), "bei nur einem Feld kein Hinweis auf Felder");
  const schluss = auftraege.find((x) => /Der Schluss/.test(x.a.aufgabe));
  assert.match(schluss.a.textausschnitt, /Feuerwehrhaus/, "Schluss: die KI bekommt den Infokasten");
}));

test("Probe 9: Vorschau für die Lehrkraft zeigt die Felder je Teil", () => {
  const v = vorschau.vorschau("deutsch", PROBE);
  const haupt = v.items.find((i) => i.type === "schreiben");
  assert.equal(haupt.teile.length, 12);
  assert.deepEqual(haupt.teile[11], { label: "Beispiel", gruppe: "Argument 4", hilfe: "zum Beispiel …" });
  assert.equal(v.items.reduce((s, i) => s + i.points, 0), 40);
});
