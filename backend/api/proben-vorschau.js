"use strict";
/* Vorschau jeder Probe für die Lehrkraft – eine Route für alle Probenarten (Verwaltung: „Vorschau · PDF“).
 *
 *   POST /api/proben/vorschau { password, modul, testId }
 *   → { ok, modul, testId, title, minutes?, total, scope?, hinweis?, texte?: [...], items: [...] }
 *
 * Jede Probenart speichert ihre Aufgaben etwas anders. Hier werden sie in wenige gemeinsame Arten übersetzt, damit
 * eine Seite der Website (js/probe-vorschau.js) alle Fächer zeigen und drucken kann – wahlweise so, wie das Kind die
 * Probe bekommt, oder mit Lösungen und Erwartungshorizont. Die Route liest nur: An Proben, Freischaltung und Abgaben
 * ändert sie nichts. Ohne Lehrerpasswort gibt es nichts, denn die Antwort enthält alle Lösungen.
 *
 * Gemeinsame Aufgabenarten (items[].type):
 *   choice   { options, answer }                 multi  { options, answers }
 *   tf       { statements: [[Text, richtig]] }   kreuz  { spalten, zeilen: [[Text, Nummer der Spalte]] }
 *   match    { pairs: [[links, rechts]] }        order  { steps }  (in der richtigen Reihenfolge)
 *   gaps     { text mit {1} {2}, gaps: [[richtig, weitere Auswahl …]] }
 *   luecke   { prompt mit ___, solutions: [[erlaubte Schreibweisen je Lücke]] }
 *   number   { answer, unit, units, tolerance }  labor  { labor, regeln: [{ text }] }
 *   text     { expected, criteria, lines }       schreiben { raster: [{ name, text, punkte }], minWoerter, plan }
 *   zeile    { bereiche: [[von, bis]] }          felder { felder: [{ label, loesungen }], menge }
 *   komma    { saetze }  (mit allen Kommas)      vokabeln { zeilen: [{ prompt, hint, solutions }] }
 *   datei    { checks: [{ text, punkte }], kiPunkte }
 * Für alle: prompt, points; wahlweise abschnitt, anweisung, material, hilfe, textRef, zeilenBezug, image, imageAlt,
 * tabelle, diagramm, modulTitel, kompetenz, transfer.
 *
 * opts.quellen: { <modul wie in js/proben-module.js>: { form: "nt" | "info" | "vokabel" | "grammatik" | "deutsch", tests } }
 */
const crypto = require("crypto");

const clean = (v, n = 80) => String(v == null ? "" : v).trim().slice(0, n);
const punkte = (v, ersatz = 1) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : ersatz);
// nur die Felder übernehmen, die es gibt (0 und false bleiben erhalten)
const nimm = (quelle, felder) => { const z = {}; felder.forEach((f) => { if (quelle[f] !== undefined && quelle[f] !== null && quelle[f] !== "") z[f] = quelle[f]; }); return z; };
const BEIWERK = ["image", "imageAlt", "tabelle", "diagramm", "modulTitel", "kompetenz", "transfer"];

/* ---------- nt7.js: NT 7, Informatik 7 und 8, NT 8 ---------- */
function ausNt(test) {
  return {
    title: test.title, minutes: test.minutes, scope: test.scope,
    items: test.items.map((a) => {
      const z = { type: a.type, prompt: a.prompt, points: punkte(a.points),
        ...nimm(a, BEIWERK.concat(["options", "answer", "answers", "statements", "pairs", "steps", "text", "gaps", "unit", "units", "tolerance", "labor", "expected", "criteria"])) };
      if (Array.isArray(a.regeln)) z.regeln = a.regeln.map((r) => ({ text: r.text }));
      return z;
    })
  };
}

/* ---------- infoaustausch.js und filiuspruefung.js: Informationsaustausch, NT 9, Netzwerktest, Filius ---------- */
function ausInfo(test) {
  const items = test.items.map((a) => {
    const basis = { prompt: a.prompt, ...nimm(a, ["image", "imageAlt", "modulTitel", "transfer"]), ...(a.teil ? { abschnitt: a.teil } : {}) };
    if (a.type === "match" && Array.isArray(a.rows)) return { ...basis, type: "kreuz", spalten: a.options, zeilen: a.rows.map((r) => [r.text, r.answer]), points: a.rows.length };
    if (a.type === "choice") return { ...basis, type: "choice", options: a.options, answer: a.answer, points: punkte(a.points) };
    return { ...basis, type: "text", expected: a.expected || "", criteria: a.kriterien ? [].concat(a.kriterien) : [], ...(a.lines ? { lines: a.lines } : {}), points: punkte(a.points) };
  });
  if (test.upload) {
    const checks = (test.upload.checks || []).map((c) => ({ text: c.text, punkte: c.punkte })), ki = Number(test.upload.kiPunkte) || 0;
    items.push({ type: "datei", abschnitt: "Praktischer Teil: Datei abgeben", prompt: test.upload.aufgabe, checks, kiPunkte: ki, points: checks.reduce((s, c) => s + c.punkte, 0) + ki });
  }
  return { title: test.title, scope: test.unit, items };
}

/* ---------- vokabeltest.js: eine Wortliste ---------- */
function ausVokabel(test) {
  const zeilen = test.items.map((a) => ({ prompt: a.prompt, ...(a.hint ? { hint: a.hint } : {}), solutions: [].concat(a.solutions || []) }));
  const richtung = test.direction || (test.items[0] && test.items[0].direction) || "de-en";
  return { title: test.title, scope: test.unit,
    items: [{ type: "vokabeln", richtung, prompt: richtung === "en-de" ? "Schreibe das deutsche Wort." : "Schreibe das englische Wort.", zeilen, points: zeilen.length }] };
}

/* ---------- grammatik9r.js: Grammatikproben und Kurztests Englisch ---------- */
function ausGrammatik(test) {
  return { title: test.title, scope: test.unit,
    items: test.items.map((a) => {
      const basis = { prompt: a.prompt, ...(a.section ? { abschnitt: a.section } : {}), ...(a.instruction ? { anweisung: a.instruction } : {}) };
      if (a.type === "gap") return { ...basis, type: "luecke", solutions: (a.solutions || []).map((s) => [].concat(s)), points: (String(a.prompt).match(/___/g) || []).length || 1 };
      if (a.type === "choice") return { ...basis, type: "choice", options: a.options, answer: a.answer, points: punkte(a.points) };
      return { ...basis, type: "text", expected: a.expected || "", criteria: a.focus ? ["Darauf kommt es an: " + a.focus] : [], lines: 2, points: punkte(a.points) };
    }) };
}

/* ---------- d7-proben.js: Deutsch 7 und 8 (Lesetexte mit Zeilennummern, Schreibaufgaben) ---------- */
function ausDeutsch(test) {
  const texte = (test.texte || []).map((t) => ({ ...nimm(t, ["id", "typ", "titel", "art", "zeilen", "einheit", "werte", "kopf", "reihen", "hinweis", "quelle"]) }));
  const items = test.items.map((a) => {
    const basis = { prompt: a.prompt, points: punkte(a.points), ...(a.text ? { textRef: a.text } : {}), ...(a.hilfe ? { hilfe: a.hilfe } : {}) };
    if (a.type === "choice") return { ...basis, type: "choice", options: a.options, answer: a.answer };
    if (a.type === "match") return { ...basis, type: "match", pairs: a.pairs };
    if (a.type === "order") return { ...basis, type: "order", steps: a.steps };
    if (a.type === "zeile") return { ...basis, type: "zeile", bereiche: a.bereiche };
    if (a.type === "komma") return { ...basis, type: "komma", saetze: a.saetze };
    if (a.type === "felder") return { ...basis, type: "felder", felder: a.felder.map((f) => ({ label: f.label, loesungen: f.loesungen })), ...(a.menge ? { menge: true } : {}), ...(a.vorgabe ? { material: a.vorgabe } : {}) };
    if (a.type === "schreiben") return { ...basis, type: "schreiben", raster: a.raster.map((k) => ({ name: k.name, text: k.text, punkte: k.punkte })),
      ...nimm(a, ["minWoerter", "material", "vorgabe"]), ...(Array.isArray(a.plan) ? { plan: a.plan.map((f) => ({ label: f.label, ...(f.hilfe ? { hilfe: f.hilfe } : {}) })) } : {}) };
    // offen: Erwartungshorizont je Kriterium mit Punkten
    return { ...basis, type: "text", expected: a.expected || "", criteria: (a.kriterien || []).map((k) => k.text + " (" + k.punkte + (k.punkte === 1 ? " Punkt" : " Punkte") + ")" + (k.erwartet ? ": " + k.erwartet : "")),
      ...(a.vorgabe ? { material: a.vorgabe } : {}), ...(Array.isArray(a.zeilen) ? { zeilenBezug: a.zeilen } : {}) };
  });
  return { title: test.title, minutes: test.minutes, scope: test.scope, ...(test.hinweis ? { hinweis: test.hinweis } : {}), ...(texte.length ? { texte } : {}), items };
}

const FORMEN = { nt: ausNt, info: ausInfo, vokabel: ausVokabel, grammatik: ausGrammatik, deutsch: ausDeutsch };

// Eine Probe in die gemeinsame Form bringen (auch für die Tests)
function vorschau(form, test) {
  if (!FORMEN[form]) throw new Error("unbekannte Form " + form);
  const d = FORMEN[form](test);
  d.total = d.items.reduce((s, a) => s + a.points, 0);
  Object.keys(d).forEach((k) => { if (d[k] === undefined || d[k] === null || d[k] === "") delete d[k]; });
  return d;
}

function registerProbenVorschau(app, opts) {
  const PASSWORT = opts.teacherPassword || "", QUELLEN = opts.quellen || {};
  app.post("/api/proben/vorschau", (req, res) => {
    if (!PASSWORT) return res.status(503).json({ ok: false, error: "teacher_password_not_configured" });
    const gegeben = Buffer.from(clean(req.body && req.body.password, 200)), erwartet = Buffer.from(PASSWORT);
    if (gegeben.length !== erwartet.length || !crypto.timingSafeEqual(gegeben, erwartet)) return res.status(401).json({ ok: false, error: "bad_password" });
    const modul = clean(req.body.modul, 40), id = clean(req.body.testId, 80), quelle = Object.prototype.hasOwnProperty.call(QUELLEN, modul) ? QUELLEN[modul] : null;
    if (!quelle) return res.status(404).json({ ok: false, error: "modul_not_found" });
    const test = quelle.tests && Object.prototype.hasOwnProperty.call(quelle.tests, id) ? quelle.tests[id] : null;
    if (!test) return res.status(404).json({ ok: false, error: "test_not_found" });
    try { res.json({ ok: true, modul, testId: id, ...vorschau(quelle.form, test) }); }
    catch (error) { console.error("Proben-Vorschau " + modul + "/" + id + ": " + error.message); res.status(500).json({ ok: false, error: "vorschau_fehlgeschlagen" }); }
  });
  return { module: Object.keys(QUELLEN) };
}

module.exports = { registerProbenVorschau, vorschau, FORMEN };
