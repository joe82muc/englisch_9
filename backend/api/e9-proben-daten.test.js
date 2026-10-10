"use strict";

// Englisch 9R: die großen Proben selbst (e9-proben/p<nr>.js) – Aufbau, Punkte je Teil, Hörtext, Eindeutigkeit und
// vor allem: Variante B ist eine echte Nachschreibprobe (eigene Texte und Aufgaben, gleiche Punkte je Teil).
// Beim Schreiben einer Probe: E9_PROBEN_NUR=2 prüft nur p2.js.
const assert = require("node:assert/strict");
const test = require("node:test");
const ROH = require("./e9-proben-daten");
const { vorbereiten } = require("./d7-proben");

const TEILE = { "A Listening": 12, "B Reading": 12, "C Grammar and vocabulary": 14, "D Mediation": 8, "E Writing": 14 };
const STIMMEN = ["en-GB-SoniaNeural", "en-GB-RyanNeural", "en-GB-LibbyNeural", "en-US-GuyNeural", "en-US-JennyNeural"];
const alle = () => Object.values(vorbereiten(JSON.parse(JSON.stringify(ROH.__vorlage)), 9, "e"));
const woerter = (s) => (String(s).match(/[A-Za-zÄÖÜäöüß0-9'’-]+/g) || []).length;
const nummern = [...new Set(Object.values(ROH.__vorlage).map((p) => p.nr))];

test("Alle Proben-Dateien laden ohne Fehler", () => {
  assert.deepEqual(ROH.__fehler, []);
  assert.ok(nummern.length >= 1, "mindestens eine Probe");
});

test("Jede Fassung: R9, 60 Minuten, 60 Punkte, fünf Teile mit festen Punkten in fester Reihenfolge", () => {
  for (const p of alle()) {
    assert.match(p.id, /^e9-p[1-4]-r-[ab]$/); assert.equal(p.zug, "R"); assert.equal(p.minutes, 60, p.id);
    assert.match(p.title, /^Test [1-4] \(R9\): /, p.id + ": Titel");
    const summe = {}; p.items.forEach((i) => { assert.ok(TEILE[i.teil], p.id + ": Teil " + i.teil); summe[i.teil] = (summe[i.teil] || 0) + i.points; });
    assert.deepEqual(summe, TEILE, p.id + ": Punkte je Teil");
    assert.deepEqual([...new Set(p.items.map((i) => i.teil))], Object.keys(TEILE), p.id + ": Reihenfolge der Teile");
    assert.ok(p.hinweis && /twice|zweimal/.test(p.hinweis), p.id + ": Hinweis nennt die Zahl der Hördurchgänge");
  }
});

test("Hörtext und Lesetext: ein Hörtext (150–230 Wörter, zwei Durchgänge, erlaubte Stimmen), ein Lesetext (200–300 Wörter)", () => {
  for (const p of alle()) {
    const h = p.texte.filter((t) => t.typ === "hoertext"), l = p.texte.filter((t) => t.typ === "text");
    assert.equal(h.length, 1, p.id + ": genau ein Hörtext"); assert.equal(l.length, 1, p.id + ": genau ein Lesetext");
    const w = woerter(h[0].sprecher.map((s) => s.text).join(" "));
    assert.ok(w >= 150 && w <= 230, p.id + ": Hörtext hat " + w + " Wörter");
    assert.equal(h[0].mal, 2, p.id);
    const rollen = [...new Set(h[0].sprecher.map((s) => s.rolle))];
    assert.ok(rollen.length >= 2 && rollen.every((r) => STIMMEN.includes((h[0].stimmen || {})[r])), p.id + ": jede Rolle hat eine erlaubte Stimme");
    assert.equal(new Set(rollen.map((r) => h[0].stimmen[r])).size, rollen.length, p.id + ": jede Rolle eine eigene Stimme");
    assert.ok(!/\d/.test(h[0].sprecher.map((s) => s.text).join(" ")), p.id + ": Zahlen im Hörtext ausgeschrieben");
    const lw = woerter(l[0].absaetze.join(" "));
    assert.ok(lw >= 200 && lw <= 300, p.id + ": Lesetext hat " + lw + " Wörter");
    // Teil A bezieht sich auf den Hörtext, Teil B auf den Lesetext
    p.items.forEach((i) => { if (i.teil === "A Listening") assert.equal(i.text, h[0].id, p.id + ": Aufgabe in Teil A ohne Hörtext"); if (i.teil === "B Reading") assert.equal(i.text, l[0].id, p.id + ": Aufgabe in Teil B ohne Lesetext"); });
  }
});

test("Aufgaben: eindeutige Ankreuzaufgaben, Felder mit Lösung, Notizen beim Hören und Lesen tolerant, Schreibraster mit Rechtschreibzeile", () => {
  for (const p of alle()) {
    p.items.forEach((i, k) => {
      const wo = p.id + " Aufgabe " + (k + 1) + ": ";
      if (i.type === "choice") { assert.ok(i.options.length >= 3, wo + "mindestens drei Antworten"); assert.equal(new Set(i.options.map((o) => o.toLowerCase())).size, i.options.length, wo + "Antwort doppelt"); }
      if (i.type === "felder") { i.felder.forEach((f) => assert.ok(f.label && f.loesungen.every((l) => String(l).trim()), wo + "Feld ohne Text oder Lösung")); if (i.teil !== "C Grammar and vocabulary") assert.equal(i.tolerant, true, wo + "Notizfelder sind tolerant"); else assert.notEqual(i.tolerant, true, wo + "Grammatikfelder sind streng"); }
      if (i.type === "match") assert.equal(new Set(i.pairs.map((x) => x[1])).size, i.pairs.length, wo + "Zuordnung nicht eindeutig");
      if (i.type === "offen") assert.ok(i.expected && i.kriterien.every((x) => Number.isInteger(x.punkte)), wo + "Beispiellösung und ganze Punkte");
    });
    const d = p.items.filter((i) => i.teil === "D Mediation"), e = p.items.filter((i) => i.teil === "E Writing");
    assert.ok(d.length === 1 && d[0].type === "offen" && d[0].vorgabe && d[0].vorgabe.length > 200, p.id + ": Teil D ist eine offene Aufgabe mit Vorlage");
    assert.ok(e.length === 1 && e[0].type === "schreiben" && e[0].minWoerter >= 50 && Array.isArray(e[0].plan), p.id + ": Teil E ist eine Schreibaufgabe mit Planung");
    assert.equal(e[0].raster.filter((r) => r.rs).length, 1, p.id + ": genau eine Rasterzeile Rechtschreibung (Notenschutz)");
    const offen = p.items.filter((i) => i.type === "offen" || i.type === "schreiben").reduce((s, i) => s + i.points, 0);
    assert.ok(offen >= 22 && offen <= 28, p.id + ": " + offen + " Punkte in offenen Aufgaben");
  }
});

test("Variante B ist eine echte Nachschreibprobe: eigene Texte, Hörtexte und Aufgaben – gleiche Punkte und Aufgabenarten je Teil", () => {
  const P = alle();
  for (const nr of nummern) {
    const a = P.find((p) => p.nr === nr && p.variante === "A"), b = P.find((p) => p.nr === nr && p.variante === "B");
    assert.ok(a && b, "Probe " + nr + ": Variante A und B");
    assert.equal(a.title, b.title, "Probe " + nr + ": gleicher Titel");
    for (const t of Object.keys(TEILE)) {
      const art = (p) => p.items.filter((i) => i.teil === t).map((i) => i.type + ":" + i.points).sort().join(",");
      assert.equal(art(a), art(b), "Probe " + nr + " Teil " + t + ": gleiche Aufgabenarten und Punkte");
    }
    // nichts doppelt: kein Satz der Texte, keine Aufgabenstellung mit eigenem Inhalt, keine Vorlage
    const saetze = (p) => new Set(p.texte.flatMap((x) => (x.absaetze || x.sprecher.map((s) => s.text)).join(" ").split(/(?<=[.!?])\s+/)).map((s) => s.trim()).filter((s) => woerter(s) >= 5));
    const sa = saetze(a), gleich = [...saetze(b)].filter((s) => sa.has(s));
    assert.deepEqual(gleich, [], "Probe " + nr + ": Sätze in beiden Varianten");
    assert.notEqual(a.items.find((i) => i.teil === "D Mediation").vorgabe, b.items.find((i) => i.teil === "D Mediation").vorgabe);
    assert.notEqual(a.items.find((i) => i.teil === "E Writing").prompt, b.items.find((i) => i.teil === "E Writing").prompt);
    const fragen = new Set(a.items.filter((i) => i.type === "choice" || i.type === "offen").map((i) => i.prompt));
    const doppelt = b.items.filter((i) => (i.type === "choice" || i.type === "offen") && fragen.has(i.prompt) && !/^Which sentence is correct\?$/.test(i.prompt)).map((i) => i.prompt);
    assert.deepEqual(doppelt, [], "Probe " + nr + ": gleiche Fragen in beiden Varianten");
  }
});
