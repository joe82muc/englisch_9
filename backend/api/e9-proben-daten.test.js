"use strict";

// Englisch 9R: die großen Proben selbst (e9-proben/p<nr>.js) – Aufbau, Punkte je Teil, Hörtext, Eindeutigkeit und
// vor allem: Variante B ist eine echte Nachschreibprobe (eigene Texte und Aufgaben, gleiche Punkte je Teil).
// Beim Schreiben einer Probe: E9_PROBEN_NUR=2 prüft nur p2.js.
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const path = require("path");
const ROH = require("./e9-proben-daten");
const { vorbereiten } = require("./d7-proben");

const TEILE = { "A Listening": 12, "B Reading": 12, "C Grammar and vocabulary": 14, "D Mediation": 8, "E Writing": 14 };
// Englisch 9M (m1.js … m4.js, Zug M): gleiche Teile und Punkte, aber längere Texte und mehr eigener Text.
// Beim Schreiben einer M-Probe, solange die Aufnahme noch fehlt: E9_PROBEN_OHNE_TON=1 überspringt nur die Ton-Prüfung.
const MASS = { R: { hoer: [150, 230], lese: [200, 300], schreib: 50, vorlage: 200 }, M: { hoer: [230, 330], lese: [320, 420], schreib: 80, vorlage: 300 } };
const STIMMEN = ["en-GB-SoniaNeural", "en-GB-RyanNeural", "en-GB-LibbyNeural", "en-US-GuyNeural", "en-US-JennyNeural"];
const alle = () => Object.values(vorbereiten(JSON.parse(JSON.stringify(ROH.__vorlage)), 9, "e"));
const woerter = (s) => (String(s).match(/[A-Za-zÄÖÜäöüß0-9'’-]+/g) || []).length;
const nummern = [...new Set(Object.values(ROH.__vorlage).map((p) => p.nr))];

test("Alle Proben-Dateien laden ohne Fehler", () => {
  assert.deepEqual(ROH.__fehler, []);
  assert.ok(nummern.length >= 1, "mindestens eine Probe");
});

test("Jede Fassung: R9 oder M9, 60 Minuten, 60 Punkte, fünf Teile mit festen Punkten in fester Reihenfolge", () => {
  for (const p of alle()) {
    assert.match(p.id, /^e9-p[1-4]-[rm]-[ab]$/); assert.equal(p.zug, p.id[6].toUpperCase(), p.id + ": Zug passt zur Kennung"); assert.equal(p.minutes, 60, p.id);
    assert.match(p.title, new RegExp("^Test [1-4] \\(" + p.zug + "9\\): "), p.id + ": Titel");
    const summe = {}; p.items.forEach((i) => { assert.ok(TEILE[i.teil], p.id + ": Teil " + i.teil); summe[i.teil] = (summe[i.teil] || 0) + i.points; });
    assert.deepEqual(summe, TEILE, p.id + ": Punkte je Teil");
    assert.deepEqual([...new Set(p.items.map((i) => i.teil))], Object.keys(TEILE), p.id + ": Reihenfolge der Teile");
    assert.ok(p.hinweis && /twice|zweimal/.test(p.hinweis), p.id + ": Hinweis nennt die Zahl der Hördurchgänge");
    assert.ok(/your teacher plays/.test(p.hinweis) && !/you can listen/.test(p.hinweis), p.id + ": Hinweis sagt, dass die Lehrkraft den Hörtext abspielt");
  }
});

// Die Kinder haben keinen eigenen Spieler (server.js: hoerZentral) – ohne Aufnahme könnte die Lehrkraft nur vorlesen
test("Zu jedem Hörtext liegt eine Aufnahme bereit (e9-proben/audio/<Probe>-<Text>.mp3, etwa eine Minute)", { skip: process.env.E9_PROBEN_OHNE_TON ? "E9_PROBEN_OHNE_TON gesetzt – nur beim Schreiben einer Probe" : false }, () => {
  for (const p of alle()) for (const h of p.texte.filter((t) => t.typ === "hoertext")) {
    const datei = path.join(__dirname, "e9-proben", "audio", p.id + "-" + h.id + ".mp3");
    assert.ok(fs.existsSync(datei), p.id + ": Aufnahme " + path.basename(datei) + " fehlt");
    const b = fs.readFileSync(datei);
    assert.ok(b.length > 300000 && b.length < (p.zug === "M" ? 2200000 : 1500000), p.id + ": Aufnahme hat " + b.length + " Bytes");
    assert.ok(b[0] === 0xff && (b[1] & 0xe0) === 0xe0, p.id + ": Aufnahme beginnt nicht wie eine MP3-Datei");
  }
});

test("Hörtext und Lesetext: ein Hörtext (R 150–230, M 230–330 Wörter, zwei Durchgänge, erlaubte Stimmen), ein Lesetext (R 200–300, M 320–420 Wörter)", () => {
  for (const p of alle()) {
    const h = p.texte.filter((t) => t.typ === "hoertext"), l = p.texte.filter((t) => t.typ === "text"), mass = MASS[p.zug];
    assert.equal(h.length, 1, p.id + ": genau ein Hörtext"); assert.equal(l.length, 1, p.id + ": genau ein Lesetext");
    const w = woerter(h[0].sprecher.map((s) => s.text).join(" "));
    assert.ok(w >= mass.hoer[0] && w <= mass.hoer[1], p.id + ": Hörtext hat " + w + " Wörter (erlaubt " + mass.hoer.join("–") + ")");
    // die Aufnahme kann je Dialog nur zwei Stimmen – M-Proben haben deshalb genau zwei Sprecherrollen
    if (p.zug === "M") assert.equal(new Set(h[0].sprecher.map((s) => s.rolle)).size, 2, p.id + ": Hörtext mit genau zwei Sprecherrollen");
    assert.equal(h[0].mal, 2, p.id);
    const rollen = [...new Set(h[0].sprecher.map((s) => s.rolle))];
    assert.ok(rollen.length >= 2 && rollen.every((r) => STIMMEN.includes((h[0].stimmen || {})[r])), p.id + ": jede Rolle hat eine erlaubte Stimme");
    assert.equal(new Set(rollen.map((r) => h[0].stimmen[r])).size, rollen.length, p.id + ": jede Rolle eine eigene Stimme");
    assert.ok(!/\d/.test(h[0].sprecher.map((s) => s.text).join(" ")), p.id + ": Zahlen im Hörtext ausgeschrieben");
    const lw = woerter(l[0].absaetze.join(" "));
    assert.ok(lw >= mass.lese[0] && lw <= mass.lese[1], p.id + ": Lesetext hat " + lw + " Wörter (erlaubt " + mass.lese.join("–") + ")");
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
    assert.ok(d.length === 1 && d[0].type === "offen" && d[0].vorgabe && d[0].vorgabe.length > MASS[p.zug].vorlage, p.id + ": Teil D ist eine offene Aufgabe mit Vorlage (über " + MASS[p.zug].vorlage + " Zeichen)");
    assert.ok(e.length === 1 && e[0].type === "schreiben" && e[0].minWoerter >= MASS[p.zug].schreib && Array.isArray(e[0].plan), p.id + ": Teil E ist eine Schreibaufgabe mit Planung (mindestens " + MASS[p.zug].schreib + " Wörter)");
    assert.equal(e[0].raster.filter((r) => r.rs).length, 1, p.id + ": genau eine Rasterzeile Rechtschreibung (Notenschutz)");
    const offen = p.items.filter((i) => i.type === "offen" || i.type === "schreiben").reduce((s, i) => s + i.points, 0);
    assert.ok(offen >= 22 && offen <= 28, p.id + ": " + offen + " Punkte in offenen Aufgaben");
  }
});

test("Variante B ist eine echte Nachschreibprobe: eigene Texte, Hörtexte und Aufgaben – gleiche Punkte und Aufgabenarten je Teil", () => {
  const P = alle();
  for (const nr of nummern) for (const zug of [...new Set(P.filter((p) => p.nr === nr).map((p) => p.zug))]) {
    const a = P.find((p) => p.nr === nr && p.zug === zug && p.variante === "A"), b = P.find((p) => p.nr === nr && p.zug === zug && p.variante === "B");
    assert.ok(a && b, "Probe " + nr + " (" + zug + "9): Variante A und B");
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

// Englisch 9M: Die M-Proben sind eigene Proben – kein Satz und keine Frage stammt aus einer R-Probe (Geschwister in
// beiden Zügen, Nachschreiber) und umgekehrt.
test("M-Proben sind eigenständig: kein Satz der Texte und keine Frage steht auch in einer R-Probe", () => {
  const P = alle(), R = P.filter((p) => p.zug === "R"), M = P.filter((p) => p.zug === "M");
  if (!M.length) return;
  const saetze = (liste) => new Set(liste.flatMap((p) => p.texte.flatMap((x) => (x.absaetze || x.sprecher.map((s) => s.text)).join(" ").split(/(?<=[.!?])\s+/))).map((s) => s.trim()).filter((s) => woerter(s) >= 5));
  const rs = saetze(R);
  assert.deepEqual([...saetze(M)].filter((s) => rs.has(s)), [], "Sätze aus R-Proben in M-Proben");
  const rf = new Set(R.flatMap((p) => p.items.filter((i) => i.type === "choice" || i.type === "offen").map((i) => i.prompt)));
  const doppelt = M.flatMap((p) => p.items.filter((i) => (i.type === "choice" || i.type === "offen") && rf.has(i.prompt) && !/^Which sentence is correct\?$/.test(i.prompt)).map((i) => p.id + ": " + i.prompt));
  assert.deepEqual(doppelt, [], "Fragen aus R-Proben in M-Proben");
  const rv = new Set(R.flatMap((p) => p.items.filter((i) => i.vorgabe).map((i) => i.vorgabe)));
  assert.deepEqual(M.flatMap((p) => p.items.filter((i) => i.vorgabe && rv.has(i.vorgabe)).map((i) => p.id)), [], "Vorlagen der Sprachmittlung aus R-Proben");
});
