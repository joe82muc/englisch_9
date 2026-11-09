"use strict";

// Englisch 7: die großen Proben selbst (e7-proben/p<nr>.js) – Aufbau, Punkte je Teil, Hörtext mit Aufnahme, eindeutige
// Aufgaben und: 7R und 7M schreiben dieselben Aufgaben (nur der Umfang beim Schreiben ist verschieden).
// Solange die Aufnahme noch fehlt: E7_PROBEN_OHNE_TON=1 überspringt nur die Ton-Prüfung.
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const path = require("path");
const ROH = require("./e7-proben-daten");
const { vorbereiten } = require("./d7-proben");

const TEILE = { "A Listening": 12, "B Reading": 12, "C Grammar and vocabulary": 22, "D Mediation": 10, "E Writing": 14 };
const STIMMEN = ["en-GB-SoniaNeural", "en-GB-RyanNeural", "en-GB-LibbyNeural", "en-US-GuyNeural", "en-US-JennyNeural"];
const alle = () => Object.values(vorbereiten(JSON.parse(JSON.stringify(ROH.__vorlage)), 7, "e"));
const woerter = (s) => (String(s).match(/[A-Za-zÄÖÜäöüß0-9'’-]+/g) || []).length;

test("Alle Proben-Dateien laden ohne Fehler, jede Probe für 7R und 7M", () => {
  assert.deepEqual(ROH.__fehler, []);
  const P = alle();
  assert.ok(P.length >= 2, "mindestens eine Probe");
  for (const nr of new Set(P.map((p) => p.nr))) assert.deepEqual(P.filter((p) => p.nr === nr).map((p) => p.zug).sort(), ["M", "R"], "Probe " + nr + ": je eine Fassung R und M");
});

test("Jede Fassung: 90 Minuten, 70 Punkte, fünf Teile mit festen Punkten in fester Reihenfolge", () => {
  for (const p of alle()) {
    assert.match(p.id, /^e7-p[1-4]-[rm]-a$/); assert.equal(p.zug, p.id[6].toUpperCase(), p.id + ": Zug passt zur Kennung"); assert.equal(p.minutes, 90, p.id);
    assert.equal(p.notenzug, undefined, p.id + ": Note nach dem Zug der Fassung");
    assert.match(p.title, new RegExp("^Test [1-4] \\(" + p.zug + "7\\): "), p.id + ": Titel");
    const summe = {}; p.items.forEach((i) => { assert.ok(TEILE[i.teil], p.id + ": Teil " + i.teil); summe[i.teil] = (summe[i.teil] || 0) + i.points; });
    assert.deepEqual(summe, TEILE, p.id + ": Punkte je Teil");
    assert.deepEqual([...new Set(p.items.map((i) => i.teil))], Object.keys(TEILE), p.id + ": Reihenfolge der Teile");
    assert.ok(/your teacher plays/.test(p.hinweis) && /twice|zweimal/.test(p.hinweis), p.id + ": Hinweis sagt, dass die Lehrkraft den Hörtext zweimal abspielt");
  }
});

test("7R und 7M: dieselben Texte und Aufgaben – verschieden ist nur der Umfang der Schreibaufgabe", () => {
  const P = alle();
  for (const nr of new Set(P.map((p) => p.nr))) {
    const r = P.find((p) => p.nr === nr && p.zug === "R"), m = P.find((p) => p.nr === nr && p.zug === "M");
    assert.deepEqual(r.texte, m.texte, "Probe " + nr + ": gleiche Texte");
    const ohneSchreiben = (p) => p.items.map((i) => (i.type === "schreiben" ? { ...i, prompt: "", minWoerter: 0 } : i));
    assert.deepEqual(ohneSchreiben(r), ohneSchreiben(m), "Probe " + nr + ": gleiche Aufgaben");
    const er = r.items.find((i) => i.type === "schreiben"), em = m.items.find((i) => i.type === "schreiben");
    assert.ok(em.minWoerter > er.minWoerter, "Probe " + nr + ": M schreibt mehr");
  }
});

// Die Kinder haben keinen eigenen Spieler (server.js: hoerZentral) – ohne Aufnahme könnte die Lehrkraft nur vorlesen
test("Zu jedem Hörtext liegt eine Aufnahme bereit (e7-proben/audio/<Probe>-<Text>.mp3, etwa eine Minute)", { skip: process.env.E7_PROBEN_OHNE_TON ? "E7_PROBEN_OHNE_TON gesetzt" : false }, () => {
  for (const p of alle()) for (const h of p.texte.filter((t) => t.typ === "hoertext")) {
    const datei = path.join(__dirname, "e7-proben", "audio", p.id + "-" + h.id + ".mp3");
    assert.ok(fs.existsSync(datei), p.id + ": Aufnahme " + path.basename(datei) + " fehlt");
    const b = fs.readFileSync(datei);
    assert.ok(b.length > 300000 && b.length < 1800000, p.id + ": Aufnahme hat " + b.length + " Bytes");
    assert.ok(b[0] === 0xff && (b[1] & 0xe0) === 0xe0, p.id + ": Aufnahme beginnt nicht wie eine MP3-Datei");
  }
});

test("Hörtext und Lesetext: ein kurzer Hörtext (150–230 Wörter, zwei Sprecher, zwei Durchgänge), ein Lesetext (180–260 Wörter)", () => {
  for (const p of alle()) {
    const h = p.texte.filter((t) => t.typ === "hoertext"), l = p.texte.filter((t) => t.typ === "text");
    assert.equal(h.length, 1, p.id + ": genau ein Hörtext"); assert.equal(l.length, 1, p.id + ": genau ein Lesetext");
    const w = woerter(h[0].sprecher.map((s) => s.text).join(" "));
    assert.ok(w >= 150 && w <= 230, p.id + ": Hörtext hat " + w + " Wörter");
    const rollen = [...new Set(h[0].sprecher.map((s) => s.rolle))];
    assert.equal(rollen.length, 2, p.id + ": genau zwei Sprecherrollen (die Aufnahme kann je Dialog zwei Stimmen)");
    assert.ok(rollen.every((r) => STIMMEN.includes((h[0].stimmen || {})[r])), p.id + ": jede Rolle hat eine erlaubte Stimme");
    assert.equal(h[0].mal, 2, p.id);
    assert.ok(!/\d/.test(h[0].sprecher.map((s) => s.text).join(" ")), p.id + ": Zahlen im Hörtext ausgeschrieben");
    const lw = woerter(l[0].absaetze.join(" "));
    assert.ok(lw >= 180 && lw <= 260, p.id + ": Lesetext hat " + lw + " Wörter");
    p.items.forEach((i) => { if (i.teil === "A Listening") assert.equal(i.text, h[0].id, p.id + ": Aufgabe in Teil A ohne Hörtext"); if (i.teil === "B Reading") assert.equal(i.text, l[0].id, p.id + ": Aufgabe in Teil B ohne Lesetext"); });
  }
});

test("Aufgaben: eindeutige Ankreuzaufgaben, Felder mit Lösung, Mediation als Gespräch, Schreibraster mit Rechtschreibzeile", () => {
  for (const p of alle()) {
    p.items.forEach((i, k) => {
      const wo = p.id + " Aufgabe " + (k + 1) + ": ";
      if (i.type === "choice") { assert.ok(i.options.length >= 3, wo + "mindestens drei Antworten"); assert.equal(new Set(i.options.map((o) => o.toLowerCase())).size, i.options.length, wo + "Antwort doppelt"); }
      if (i.type === "felder") { i.felder.forEach((f) => assert.ok(f.label && f.loesungen.every((l) => String(l).trim()), wo + "Feld ohne Text oder Lösung")); if (i.teil !== "C Grammar and vocabulary") assert.equal(i.tolerant, true, wo + "Notizfelder sind tolerant"); else assert.notEqual(i.tolerant, true, wo + "Grammatikfelder sind streng"); }
      if (i.type === "match") assert.equal(new Set(i.pairs.map((x) => x[1])).size, i.pairs.length, wo + "Zuordnung nicht eindeutig");
      if (i.type === "offen") assert.ok(i.expected && i.kriterien.every((x) => Number.isInteger(x.punkte)), wo + "Beispiellösung und ganze Punkte");
    });
    // Mediation wie im Modul „Helping tourists“: Beitrag für Beitrag, abwechselnd Deutsch → Englisch und Englisch → Deutsch
    const d = p.items.filter((i) => i.teil === "D Mediation");
    assert.ok(d.length >= 4 && d.every((i) => i.type === "offen" && i.vorgabe && i.points === 2), p.id + ": Teil D sind Gesprächsbeiträge mit Sprechblase (je 2 Punkte)");
    assert.ok(d.some((i) => /„/.test(i.vorgabe)) && d.some((i) => /“[^„]*$/.test(i.vorgabe) && /Assistant/.test(i.vorgabe)), p.id + ": beide Richtungen kommen vor");
    const e = p.items.filter((i) => i.teil === "E Writing");
    assert.ok(e.length === 1 && e[0].type === "schreiben" && e[0].minWoerter >= 40 && Array.isArray(e[0].plan) && /Where I live/.test(e[0].prompt), p.id + ": Teil E ist „Where I live“ mit Planung");
    assert.equal(e[0].raster.filter((r) => r.rs).length, 1, p.id + ": genau eine Rasterzeile Rechtschreibung (Notenschutz)");
  }
});

test("Kein Satz der Proben-Texte steht in einer Englisch-9-Probe", () => {
  const E9 = require("./e9-proben-daten").__vorlage;
  const saetze = (liste) => new Set(liste.flatMap((p) => p.texte.flatMap((x) => (x.absaetze || (x.sprecher || []).map((s) => s.text)).join(" ").split(/(?<=[.!?])\s+/))).map((s) => s.trim()).filter((s) => woerter(s) >= 5));
  const neun = saetze(Object.values(E9));
  assert.deepEqual([...saetze(alle())].filter((s) => neun.has(s)), []);
});
