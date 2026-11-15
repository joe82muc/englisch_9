"use strict";

// Englisch 7: die großen Proben selbst (e7-proben/p<nr>.js) – Aufbau, Punkte je Teil, Hörtext mit Aufnahme, eindeutige
// Aufgaben und: In Probe 1 schreiben 7R und 7M dieselben Aufgaben (nur der Umfang beim Schreiben ist verschieden). Ab Probe 2
// hat jeder Zug eine eigene Fassung (R leichter, gleicher Hörtext) und es gibt Variante B für Nachschreiber.
// Probe 3 (Unit 3, seit 14.11.2026): Sprachmittlung wie im Buch Deutsch → Englisch, Grammatik G8 (Ort vor Zeit) und G9 (some/any/no).
// Probe 4 (Unit 4, seit 14.11.2026): Sprachmittlung wie im Buch Englisch → Deutsch (wie Probe 2), Grammatik G10 (Steigerung mit
// more/most, less/least) und G11 (much/many, too much/too many, so much/so many), Ordnungszahlen, britisches/amerikanisches Englisch.
// Probe 1 B (Nachschreiber, seit 15.11.2026): Aufbau genau wie Probe 1 A – 7R und 7M dieselben Aufgaben, eigene Texte.
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
// Länge des Lesetexts: Probe 1 (gleicher Text für beide Züge) 180–260 Wörter; ab Probe 2 R kürzer und einfacher als M
const LESE = (p) => (p.nr === 1 ? [180, 260] : p.zug === "R" ? [150, 220] : [220, 300]);
const saetzeVon = (liste) => new Set(liste.flatMap((p) => p.texte.flatMap((x) => (x.absaetze || (x.sprecher || []).map((s) => s.text)).join(" ").split(/(?<=[.!?])\s+/))).map((s) => s.trim()).filter((s) => woerter(s) >= 5));
const geschlossen = (p) => p.items.filter((i) => ["choice", "match", "order"].includes(i.type)).reduce((s, i) => s + i.points, 0);

test("Alle Proben-Dateien laden ohne Fehler, jede Probe für 7R und 7M in Variante A und B (Probe 1 B seit 15.11.2026)", () => {
  assert.deepEqual(ROH.__fehler, []);
  const P = alle();
  assert.ok(P.length >= 2, "mindestens eine Probe");
  assert.deepEqual(P.filter((p) => p.nr === 1).map((p) => p.id).sort(), ["e7-p1-m-a", "e7-p1-m-b", "e7-p1-r-a", "e7-p1-r-b"], "Probe 1 (Unit 1) mit Nachschreibprobe B");
  for (const nr of new Set(P.map((p) => p.nr))) {
    const varianten = [...new Set(P.filter((p) => p.nr === nr).map((p) => p.variante))].sort();
    assert.deepEqual(varianten, ["A", "B"], "Probe " + nr + ": Varianten");
    for (const v of varianten) assert.deepEqual(P.filter((p) => p.nr === nr && p.variante === v).map((p) => p.zug).sort(), ["M", "R"], "Probe " + nr + v + ": je eine Fassung R und M");
  }
  assert.ok(P.some((p) => p.nr === 2), "Probe 2 (Unit 2) ist da");
  assert.deepEqual(P.filter((p) => p.nr === 3).map((p) => p.id).sort(), ["e7-p3-m-a", "e7-p3-m-b", "e7-p3-r-a", "e7-p3-r-b"], "Probe 3 (Unit 3) mit vier Fassungen");
  assert.deepEqual(P.filter((p) => p.nr === 4).map((p) => p.id).sort(), ["e7-p4-m-a", "e7-p4-m-b", "e7-p4-r-a", "e7-p4-r-b"], "Probe 4 (Unit 4) mit vier Fassungen");
});

test("Jede Fassung: 90 Minuten, 70 Punkte, fünf Teile mit festen Punkten in fester Reihenfolge", () => {
  for (const p of alle()) {
    assert.match(p.id, /^e7-p[1-4]-[rm]-[ab]$/); assert.equal(p.zug, p.id[6].toUpperCase(), p.id + ": Zug passt zur Kennung"); assert.equal(p.variante, p.id[8].toUpperCase(), p.id + ": Variante passt zur Kennung"); assert.equal(p.minutes, 90, p.id);
    assert.equal(p.notenzug, undefined, p.id + ": Note nach dem Zug der Fassung");
    assert.match(p.title, new RegExp("^Test [1-4] \\(" + p.zug + "7\\): "), p.id + ": Titel");
    const summe = {}; p.items.forEach((i) => { assert.ok(TEILE[i.teil], p.id + ": Teil " + i.teil); summe[i.teil] = (summe[i.teil] || 0) + i.points; });
    assert.deepEqual(summe, TEILE, p.id + ": Punkte je Teil");
    assert.deepEqual([...new Set(p.items.map((i) => i.teil))], Object.keys(TEILE), p.id + ": Reihenfolge der Teile");
    assert.ok(/your teacher plays/.test(p.hinweis) && /twice|zweimal/.test(p.hinweis), p.id + ": Hinweis sagt, dass die Lehrkraft den Hörtext zweimal abspielt");
  }
});

test("Probe 1 (A und B) – 7R und 7M: dieselben Texte und Aufgaben – verschieden ist nur der Umfang der Schreibaufgabe", () => {
  const P = alle();
  for (const [nr, v] of [[1, "A"], [1, "B"]]) {
    const r = P.find((p) => p.nr === nr && p.variante === v && p.zug === "R"), m = P.find((p) => p.nr === nr && p.variante === v && p.zug === "M"), wo = "Probe " + nr + v + ": ";
    assert.deepEqual(r.texte, m.texte, wo + "gleiche Texte");
    const ohneSchreiben = (p) => p.items.map((i) => (i.type === "schreiben" ? { ...i, prompt: "", minWoerter: 0 } : i));
    assert.deepEqual(ohneSchreiben(r), ohneSchreiben(m), wo + "gleiche Aufgaben");
    const er = r.items.find((i) => i.type === "schreiben"), em = m.items.find((i) => i.type === "schreiben");
    assert.ok(em.minWoerter > er.minWoerter, wo + "M schreibt mehr");
    assert.match(er.prompt, /50 to 80 words/, wo + "R schreibt 50 bis 80 Wörter"); assert.match(em.prompt, /60 to 100 words/, wo + "M schreibt 60 bis 100 Wörter");
  }
});

// Probe 1 B ist der Nachschreiber zu einer schon geschriebenen Probe 1 A: Er muss gleichwertig sein – dieselben Aufgabenarten in
// derselben Reihenfolge, dieselben Hilfen an denselben Stellen, dieselbe Bewertung beim Schreiben (Mindestlänge, Raster).
test("Probe 1 B ist gleich gebaut wie Probe 1 A: Aufgabe für Aufgabe dieselbe Art, dieselben Punkte und Hilfen, gleiche Mindestlänge", () => {
  const P = alle();
  for (const zug of ["R", "M"]) {
    const a = P.find((p) => p.id === "e7-p1-" + zug.toLowerCase() + "-a"), b = P.find((p) => p.id === "e7-p1-" + zug.toLowerCase() + "-b"), wo = "Probe 1 (" + zug + "7): ";
    const bau = (p) => p.items.map((i) => [i.teil, i.type, i.points, (i.felder || []).length, Boolean(i.hinweis), Boolean(i.hilfe), Boolean(i.tolerant), i.text || ""].join("|"));
    assert.deepEqual(bau(b), bau(a), wo + "Aufgabe für Aufgabe gleich gebaut");
    const sa = a.items.find((i) => i.type === "schreiben"), sb = b.items.find((i) => i.type === "schreiben");
    assert.equal(sb.minWoerter, sa.minWoerter, wo + "gleiche Mindestlänge");
    assert.deepEqual(sb.raster.map((r) => [r.name, r.punkte, Boolean(r.rs)]), sa.raster.map((r) => [r.name, r.punkte, Boolean(r.rs)]), wo + "gleiches Raster");
    assert.equal(b.hinweis, a.hinweis, wo + "gleicher Hinweis");
    const h = b.texte.find((t) => t.typ === "hoertext");
    assert.deepEqual([...new Set(h.sprecher.map((s) => s.rolle))], ["Reggie", "Maisie"], wo + "Hörtext Reggie und Maisie");
    assert.deepEqual(h.stimmen, { Maisie: "en-GB-SoniaNeural", Reggie: "en-GB-RyanNeural" }, wo + "Mädchen und Junge, britische Stimmen");
    assert.match(b.texte.find((t) => t.typ === "text").absaetze.join(" "), /Elodie[\s\S]*Hollybrook School[\s\S]*Mr Ashworth/, wo + "Blog von Elodie");
    const d = b.items.filter((i) => i.teil === "D Mediation");
    assert.ok(d.every((i) => /Frau Keller|Assistant/.test(i.vorgabe)) && /Larkdale Railway/.test(d[0].prompt), wo + "Sprachmittlung an der Kasse der Larkdale-Bahn mit Frau Keller");
    assert.ok(/e-mail to Elodie/.test(sb.prompt) && /school day/i.test(sb.prompt) && !/Where I live/.test(sb.prompt), wo + "Schreiben: E-Mail über den Schultag (nicht Where I live wie in A)");
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

test("Hörtext und Lesetext: ein kurzer Hörtext (150–230 Wörter, zwei Sprecher, zwei Durchgänge), ein Lesetext (Probe 1: 180–260 Wörter; ab Probe 2 R 150–220, M 220–300)", () => {
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
    assert.equal(new Set(rollen.map((r) => h[0].stimmen[r])).size, 2, p.id + ": jede Rolle eine eigene Stimme");
    const lw = woerter(l[0].absaetze.join(" ")), [von, bis] = LESE(p);
    assert.ok(lw >= von && lw <= bis, p.id + ": Lesetext hat " + lw + " Wörter (erlaubt " + von + "–" + bis + ")");
    p.items.forEach((i) => { if (i.teil === "A Listening") assert.equal(i.text, h[0].id, p.id + ": Aufgabe in Teil A ohne Hörtext"); if (i.teil === "B Reading") assert.equal(i.text, l[0].id, p.id + ": Aufgabe in Teil B ohne Lesetext"); });
  }
});

test("Aufgaben: eindeutige Ankreuzaufgaben, Felder mit Lösung, Schreibraster mit Rechtschreibzeile; Probe 1: Mediation als Gespräch, Where I live", () => {
  for (const p of alle()) {
    p.items.forEach((i, k) => {
      const wo = p.id + " Aufgabe " + (k + 1) + ": ";
      if (i.type === "choice") { assert.ok(i.options.length >= 3, wo + "mindestens drei Antworten"); assert.equal(new Set(i.options.map((o) => o.toLowerCase())).size, i.options.length, wo + "Antwort doppelt"); }
      if (i.type === "felder") { i.felder.forEach((f) => assert.ok(f.label && f.loesungen.every((l) => String(l).trim()), wo + "Feld ohne Text oder Lösung")); if (i.teil !== "C Grammar and vocabulary") assert.equal(i.tolerant, true, wo + "Notizfelder sind tolerant"); else assert.notEqual(i.tolerant, true, wo + "Grammatikfelder sind streng"); }
      if (i.type === "match") assert.equal(new Set(i.pairs.map((x) => x[1])).size, i.pairs.length, wo + "Zuordnung nicht eindeutig");
      if (i.type === "offen") assert.ok(i.expected && i.kriterien.every((x) => Number.isInteger(x.punkte)), wo + "Beispiellösung und ganze Punkte");
    });
    const e = p.items.filter((i) => i.teil === "E Writing");
    assert.ok(e.length === 1 && e[0].type === "schreiben" && Array.isArray(e[0].plan) && e[0].plan.length >= 5, p.id + ": Teil E ist eine Schreibaufgabe mit Planung");
    assert.equal(e[0].raster.filter((r) => r.rs).length, 1, p.id + ": genau eine Rasterzeile Rechtschreibung (Notenschutz)");
    assert.deepEqual(e[0].raster.map((r) => r.punkte), [5, 2, 3, 2, 2], p.id + ": Raster Inhalt 5 · Aufbau 2 · Grammatik 3 · Wortschatz 2 · Rechtschreibung 2");
    if (p.nr !== 1) continue;
    // Probe 1 – Mediation wie im Modul „Helping tourists“: Beitrag für Beitrag, abwechselnd Deutsch → Englisch und Englisch → Deutsch
    const d = p.items.filter((i) => i.teil === "D Mediation");
    assert.ok(d.length >= 4 && d.every((i) => i.type === "offen" && i.vorgabe && i.points === 2), p.id + ": Teil D sind Gesprächsbeiträge mit Sprechblase (je 2 Punkte)");
    assert.ok(d.some((i) => /„/.test(i.vorgabe)) && d.some((i) => /“[^„]*$/.test(i.vorgabe) && /Assistant/.test(i.vorgabe)), p.id + ": beide Richtungen kommen vor");
    if (p.variante === "A") assert.ok(e[0].minWoerter >= 40 && /Where I live/.test(e[0].prompt), p.id + ": Teil E ist „Where I live“");
    else assert.ok(e[0].minWoerter >= 40 && /e-mail/.test(e[0].prompt), p.id + ": Teil E ist eine E-Mail (Nachschreiber)");
  }
});

// Ab Probe 2 (Wunsch der Lehrkraft 14.11.2026: „M und R getrennt – eigene, leichtere R-Fassungen“): dieselbe Situation und
// derselbe Hörtext (eine Aufnahme je Variante), aber R mit Auswahl statt Notizen, kürzerem Lesetext, mehr Auswahl und
// Zuordnen in der Grammatik, gelenkter Sprachmittlung und 40–70 Wörtern beim Schreiben (M 60–100).
test("Ab Probe 2 – 7R ist eine eigene, leichtere Fassung derselben Variante: gleicher Hörtext, kürzerer Lesetext, mehr Auswahl", () => {
  const P = alle().filter((p) => p.nr >= 2);
  assert.ok(P.length >= 8, "Probe 2 und 3 mit je vier Fassungen");
  for (const r of P.filter((p) => p.zug === "R")) {
    const m = P.find((p) => p.nr === r.nr && p.variante === r.variante && p.zug === "M"), wo = "Probe " + r.nr + r.variante + ": ";
    assert.ok(m, wo + "M-Fassung fehlt");
    assert.deepEqual(r.texte.find((t) => t.typ === "hoertext"), m.texte.find((t) => t.typ === "hoertext"), wo + "gleicher Hörtext (eine Aufnahme für beide Züge)");
    const lr = r.texte.find((t) => t.typ === "text"), lm = m.texte.find((t) => t.typ === "text");
    assert.equal(lr.titel, lm.titel, wo + "gleiche Situation im Lesetext");
    assert.ok(woerter(lr.absaetze.join(" ")) + 50 <= woerter(lm.absaetze.join(" ")), wo + "der Lesetext für R ist deutlich kürzer");
    assert.ok(geschlossen(r) >= geschlossen(m) + 10, wo + "R hat mehr Auswahl-, Zuordnungs- und Reihenfolgeaufgaben (" + geschlossen(r) + " zu " + geschlossen(m) + " Punkte)");
    const hoerArten = (p) => [...new Set(p.items.filter((i) => i.teil === "A Listening").map((i) => i.type))].sort().join(",");
    assert.equal(hoerArten(r), "choice,order", wo + "R hört mit Auswahl und Reihenfolge, ohne Notizen");
    assert.ok(m.items.some((i) => i.teil === "A Listening" && i.type === "felder" && i.felder.length >= 4), wo + "M macht beim Hören Notizen");
    const grammatik = (p, arten) => p.items.filter((i) => i.teil === "C Grammar and vocabulary" && arten.includes(i.type)).reduce((s, i) => s + i.points, 0);
    assert.ok(grammatik(r, ["choice", "match"]) >= 12 && grammatik(m, ["felder"]) >= 18, wo + "Grammatik: R mehr Auswahl und Zuordnen, M bildet die Formen selbst");
    const er = r.items.find((i) => i.type === "schreiben"), em = m.items.find((i) => i.type === "schreiben");
    assert.match(er.prompt, /40 to 70 words/, wo + "R schreibt 40 bis 70 Wörter"); assert.match(em.prompt, /60 to 100 words/, wo + "M schreibt 60 bis 100 Wörter");
    assert.ok(er.minWoerter >= 30 && em.minWoerter >= 50 && em.minWoerter > er.minWoerter, wo + "Mindestlänge R " + er.minWoerter + ", M " + em.minWoerter);
    assert.ok(er.plan.every((x) => x.hilfe && x.hilfe.length >= 10), wo + "Plan für R mit Satzanfängen");
    assert.notEqual(r.title, m.title, wo + "Titel nennt den Zug");
  }
});

test("Probe 2 – Sprachmittlung wie im Buch Unit 2: Programm Englisch → Deutsch (R je Frage ein Feld, M zusammenfassen) und eine Frage Deutsch → Englisch", () => {
  for (const p of alle().filter((x) => x.nr === 2)) {
    const d = p.items.filter((i) => i.teil === "D Mediation"), wo = p.id + ": ";
    assert.equal(d.length, 2, wo + "zwei Aufgaben in Teil D");
    assert.ok(d.every((i) => i.type === "offen" && i.vorgabe), wo + "offene Aufgaben mit Vorlage");
    const [programm, frage] = d;
    assert.ok(programm.vorgabe.length > 450 && /£/.test(programm.vorgabe) && !/„/.test(programm.vorgabe) && programm.points === 8, wo + "erst ein englisches Programm mit Preisen (8 Punkte)");
    assert.ok(/in German/.test(programm.prompt) && /doesn't speak English/.test(programm.prompt), wo + "Auftrag: einer Person ohne Englisch auf Deutsch erklären");
    assert.ok(programm.kriterien.some((k) => /^Sprachmittlung/.test(k.text)), wo + "Kriterium Sprachmittlung");
    if (p.zug === "R") assert.ok(Array.isArray(programm.teile) && programm.teile.length >= 5 && programm.teile.every((t) => /^„[^„“]+\?[^„“]*“$/.test(t.label) && t.hilfe), wo + "R: je Frage ein Feld mit Satzanfang");
    else assert.ok(!programm.teile && /4 to 6 sentences/.test(programm.prompt) && /Do not translate word for word/.test(programm.prompt), wo + "M: 4 bis 6 Sätze, nicht Wort für Wort");
    assert.ok(/„.+“/.test(frage.vorgabe) && /in English/.test(frage.prompt) && frage.points === 2, wo + "dann eine deutsche Bitte auf Englisch weitergeben (2 Punkte)");
    assert.equal(Boolean(frage.hilfe), p.zug === "R", wo + "Satzanfänge nur für R");
  }
});

// Unit 3 im Buch: Sprachmittlung Deutsch → Englisch (deutscher Text, ein englischsprachiger Gast fragt). In der Probe: ein deutsches
// Infoblatt für den Gast aus Irland (R beantwortet seine englischen Fragen in eigenen Feldern, M fasst zusammen) und eine
// deutsche Bitte der Mutter bzw. des Vaters, die das Kind dem Gast auf Englisch sagt.
test("Probe 3 – Sprachmittlung wie im Buch Unit 3: deutsches Infoblatt → Englisch für den Gast (R je Frage ein Feld, M zusammenfassen) und eine Bitte auf Englisch weitergeben", () => {
  const P = alle().filter((x) => x.nr === 3);
  assert.ok(P.length >= 4, "Probe 3 mit vier Fassungen");
  for (const p of P) {
    const d = p.items.filter((i) => i.teil === "D Mediation"), wo = p.id + ": ";
    assert.equal(d.length, 2, wo + "zwei Aufgaben in Teil D");
    assert.ok(d.every((i) => i.type === "offen" && i.vorgabe), wo + "offene Aufgaben mit Vorlage");
    const [info, bitte] = d;
    assert.ok(info.vorgabe.length > 450 && /€/.test(info.vorgabe) && /\bUhr\b/.test(info.vorgabe) && /[äöüß]/.test(info.vorgabe) && !/„/.test(info.vorgabe) && info.points === 8, wo + "erst ein deutsches Infoblatt mit Preisen und Uhrzeiten (8 Punkte)");
    assert.ok(/in English/.test(info.prompt) && /doesn't speak German/.test(info.prompt) && !/in German/.test(info.prompt), wo + "Auftrag: einem Gast ohne Deutsch auf Englisch erklären (nicht Englisch → Deutsch wie in Probe 2)");
    assert.ok(info.kriterien.some((k) => /^Sprachmittlung: verständliches Englisch/.test(k.text)), wo + "Kriterium Sprachmittlung auf Englisch");
    if (p.zug === "R") assert.ok(Array.isArray(info.teile) && info.teile.length >= 5 && info.teile.every((t) => /^„[A-Z][^„“äöüß]+\?[^„“]*“$/.test(t.label) && /^[A-Z][^äöüß]+$/.test(t.hilfe)), wo + "R: je englische Frage des Gasts ein Feld mit englischem Satzanfang");
    else assert.ok(!info.teile && /4 to 6 sentences/.test(info.prompt) && /Do not translate word for word/.test(info.prompt), wo + "M: 4 bis 6 Sätze, nicht Wort für Wort");
    assert.ok(/^\S+ (Mama|Papa): „Sag .+ bitte, .+“$/.test(bitte.vorgabe) && /Tell (him|her) in English/.test(bitte.prompt) && bitte.points === 2, wo + "dann eine deutsche Bitte der Mutter / des Vaters, auf Englisch an den Gast (2 Punkte)");
    assert.equal(Boolean(bitte.hilfe), p.zug === "R", wo + "Satzanfänge nur für R");
  }
});

test("Probe 3 – Grammatik der Unit: G8 Ort vor Zeit und G9 some/any/no mit something/nobody …, dazu Wörter der Unit 3", () => {
  for (const p of alle().filter((x) => x.nr === 3)) {
    const C = p.items.filter((i) => i.teil === "C Grammar and vocabulary"), wo = p.id + ": ";
    const punkte = (re) => C.filter((i) => re.test(i.hinweis || "")).reduce((s, i) => s + i.points, 0);
    assert.ok(punkte(/^Ort vor Zeit/) >= 4, wo + "G8 Ort vor Zeit mit mindestens 4 Punkten");
    assert.ok(punkte(/^some in bejahten/) >= 5, wo + "G9 some/any/no mit mindestens 5 Punkten");
    assert.ok(punkte(/^-thing für Sachen|Sachen .* Personen/) >= 5, wo + "G9 something/anybody/nobody … mit mindestens 5 Punkten");
    // die Felder zur Satzstellung: Orts- vor Zeitangabe, beide in Klammern vorgegeben
    const ort = C.filter((i) => i.type === "felder" && /^Ort vor Zeit/.test(i.hinweis || "")).flatMap((i) => i.felder);
    assert.ok(ort.length >= 3 && ort.every((x) => /\(([^/()]+) \/ ([^/()]+)\)/.test(x.label) && x.loesungen.every((l) => !/^(yesterday|tomorrow|last|next|on (sunday|saturday)|at \d|after)/i.test(l))), wo + "Satzstellung: Lösungen beginnen mit dem Ort");
    const woerterDerUnit = JSON.stringify(C).toLowerCase();
    assert.ok(["timetable", "return", "single", "change", "worried", "fed up", "advice", "background", "foreground"].filter((w) => woerterDerUnit.includes(w)).length >= 3, wo + "Wörter der Unit 3");
  }
});

// Unit 4 (Auftrag 14.11.2026): Hörtext etwa 200–220 Wörter mit Mädchen und Junge, Zahlen ausgeschrieben – die Personen sind
// Jugendliche aus den USA (amerikanische Stimmen), Ordnungszahlen der Unit kommen vor.
test("Probe 4 – Hörtext: 200 bis 220 Wörter, ein Mädchen und ein Junge mit amerikanischen Stimmen, Ordnungszahlen ausgeschrieben", () => {
  const P = alle().filter((x) => x.nr === 4);
  assert.equal(P.length, 4, "Probe 4 mit vier Fassungen");
  const ORDNUNG = /\b(?:twenty-|thirty-|forty-|fifty-)?(?:first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth)\b/;
  for (const p of P) {
    const h = p.texte.find((t) => t.typ === "hoertext"), satz = h.sprecher.map((s) => s.text).join(" "), w = woerter(satz);
    assert.ok(w >= 200 && w <= 220, p.id + ": Hörtext hat " + w + " Wörter");
    assert.deepEqual(Object.values(h.stimmen).sort(), ["en-US-GuyNeural", "en-US-JennyNeural"], p.id + ": Mädchen und Junge aus den USA");
    assert.match(satz, ORDNUNG, p.id + ": eine Ordnungszahl im Hörtext");
  }
});

// Unit 4 im Buch: Mediation wieder Englisch → Deutsch (englische Webseite, Fragen der Eltern auf Deutsch). In der Probe: ein
// englisches Infoblatt (R beantwortet die deutschen Fragen der Mutter bzw. des Vaters in eigenen Feldern, M fasst zusammen) und
// eine kurze englische Nachricht bzw. ein Schild, das das Kind auf Deutsch weitergibt – beide Aufgaben Englisch → Deutsch.
test("Probe 4 – Sprachmittlung wie im Buch Unit 4: englisches Infoblatt → Deutsch (R je deutsche Frage ein Feld, M zusammenfassen) und eine englische Nachricht auf Deutsch weitergeben", () => {
  for (const p of alle().filter((x) => x.nr === 4)) {
    const d = p.items.filter((i) => i.teil === "D Mediation"), wo = p.id + ": ";
    assert.equal(d.length, 2, wo + "zwei Aufgaben in Teil D");
    assert.ok(d.every((i) => i.type === "offen" && i.vorgabe), wo + "offene Aufgaben mit Vorlage");
    const [info, nachricht] = d;
    assert.ok(info.vorgabe.length > 450 && /\$/.test(info.vorgabe) && /[ap]\.m\./.test(info.vorgabe) && !/[äöüßÄÖÜ„]/.test(info.vorgabe) && info.points === 8, wo + "erst ein englisches Infoblatt mit Dollarpreisen und Uhrzeiten (8 Punkte)");
    assert.ok(/in German/.test(info.prompt) && /doesn't speak English/.test(info.prompt) && !/in English/.test(info.prompt), wo + "Auftrag: einer Person ohne Englisch auf Deutsch erklären (nicht Deutsch → Englisch wie in Probe 3)");
    assert.ok(info.kriterien.some((k) => /^Sprachmittlung: verständliches Deutsch/.test(k.text)), wo + "Kriterium Sprachmittlung auf Deutsch");
    assert.ok(info.kriterien.some((k) => /Dollar, nicht Euro/.test(k.erwartet)), wo + "Gesamtpreis in Dollar mit Teilpunkt für die Einzelpreise");
    if (p.zug === "R") assert.ok(Array.isArray(info.teile) && info.teile.length >= 5 && info.teile.every((t) => t.label.length <= 60 && /^„[A-ZÄÖÜ][^„“]+\?[^„“]*“$/.test(t.label) && /[äöüß]|\b(?:was|wann|wo|darf|können|sollen|und)\b/i.test(t.label) && /^[A-ZÄÖÜ]/.test(t.hilfe) && !/\b(?:the|you|is|are)\b/.test(t.hilfe)), wo + "R: je deutsche Frage ein Feld mit deutschem Satzanfang");
    else assert.ok(!info.teile && /4 to 6 sentences/.test(info.prompt) && /Do not translate word for word/.test(info.prompt), wo + "M: 4 bis 6 Sätze, nicht Wort für Wort");
    assert.ok(/“[^”]+”/.test(nachricht.vorgabe) && !/[äöüß„]/.test(nachricht.vorgabe) && /in German/.test(nachricht.prompt) && nachricht.points === 2, wo + "dann eine englische Nachricht bzw. ein Schild auf Deutsch weitergeben (2 Punkte)");
    assert.ok(nachricht.kriterien.every((k) => /auf Deutsch/.test(k.erwartet)), wo + "die Kriterien verlangen Deutsch");
    assert.equal(Boolean(nachricht.hilfe), p.zug === "R", wo + "Satzanfänge nur für R");
  }
});

test("Probe 4 – Grammatik der Unit: G10 Steigerung (more/most, less/least, -er/-est, good/better/best) und G11 much/many mit too/so, dazu Wörter der Unit 4", () => {
  for (const p of alle().filter((x) => x.nr === 4)) {
    const C = p.items.filter((i) => i.teil === "C Grammar and vocabulary"), wo = p.id + ": ";
    const punkte = (re) => C.filter((i) => re.test(i.hinweis || "")).reduce((s, i) => s + i.points, 0);
    assert.ok(punkte(/^Steigerung/) >= 6, wo + "G10 Steigerung mit mindestens 6 Punkten");
    assert.ok(punkte(/^many bei zählbaren/) >= 4, wo + "G11 much/many mit mindestens 4 Punkten");
    assert.ok(punkte(/^too much/) >= 2, wo + "too much/too many, so much/so many mit mindestens 2 Punkten");
    // die höchste Stufe immer mit the – auch in den Lösungen der Felder
    const steig = C.filter((i) => /^Steigerung/.test(i.hinweis || ""));
    steig.flatMap((i) => i.felder || []).forEach((x) => assert.ok(x.loesungen.every((l) => !/^(most|least|best|worst)\b/.test(l)), wo + "Superlativ ohne the: " + x.label));
    const alleFormen = JSON.stringify(steig).toLowerCase();
    assert.ok(/\bmore \w+/.test(alleFormen) && /\bthe most \w+/.test(alleFormen) && /\b(less|the least) \w+/.test(alleFormen) && /\w+er\b/.test(alleFormen) && /\bthe (best|worst)\b/.test(alleFormen), wo + "more, the most, less/the least, -er und good/bad unregelmäßig");
    if (p.zug === "M") assert.ok(C.flatMap((i) => i.felder || []).filter((x) => /\((less|least) \/ \w+\)/.test(x.label)).length >= 2, wo + "M bildet less … und the least … selbst");
    const woerterDerUnit = JSON.stringify(C).toLowerCase();
    assert.ok(["useful", "newspaper", "share", "vacation", "movie", "soccer", "fall", "coach", "celebrate", "independence", "fireworks", "barbecue", "leader", "camp", "tablet", "huge", "thanksgiving"].filter((w) => woerterDerUnit.includes(w)).length >= 3, wo + "Wörter der Unit 4");
    assert.match(woerterDerUnit, /hundredth|fiftieth|fortieth|thirty-second|fourth|sixty-eighth/, wo + "eine Ordnungszahl im Grammatik- und Wortschatzteil");
  }
});

test("Variante B ist eine echte Nachschreibprobe: eigene Texte, Hörtexte und Situationen – gleiche Punkte und Aufgabenarten je Teil", () => {
  const P = alle();
  for (const b of P.filter((p) => p.variante === "B")) {
    const a = P.find((p) => p.nr === b.nr && p.zug === b.zug && p.variante === "A"), wo = "Probe " + b.nr + " (" + b.zug + "7): ";
    assert.ok(a, wo + "Variante A fehlt");
    assert.equal(a.title, b.title, wo + "gleicher Titel");
    for (const t of Object.keys(TEILE)) {
      const art = (p) => p.items.filter((i) => i.teil === t).map((i) => i.type + ":" + i.points).sort().join(",");
      assert.equal(art(a), art(b), wo + "Teil " + t + ": gleiche Aufgabenarten und Punkte");
    }
    const sa = saetzeVon([a]);
    assert.deepEqual([...saetzeVon([b])].filter((x) => sa.has(x)), [], wo + "Sätze in beiden Varianten");
    assert.notEqual(a.texte[0].titel, b.texte[0].titel, wo + "anderer Hörtext");
    a.items.filter((i) => i.vorgabe).forEach((i) => assert.ok(!b.items.some((x) => x.vorgabe === i.vorgabe), wo + "Vorlage doppelt"));
    assert.notEqual(a.items.find((i) => i.type === "schreiben").prompt, b.items.find((i) => i.type === "schreiben").prompt, wo + "andere Schreibaufgabe");
    const fragen = new Set(a.items.filter((i) => ["choice", "offen"].includes(i.type)).map((i) => i.prompt));
    assert.deepEqual(b.items.filter((i) => ["choice", "offen"].includes(i.type) && fragen.has(i.prompt)).map((i) => i.prompt), [], wo + "gleiche Fragen in beiden Varianten");
    const felder = new Set(a.items.flatMap((i) => (i.felder || []).map((f) => f.label)));
    assert.deepEqual(b.items.flatMap((i) => (i.felder || []).map((f) => f.label)).filter((l) => felder.has(l)), [], wo + "gleiche Lückensätze in beiden Varianten");
  }
});

test("Jede Probe hat eigene Texte: kein Satz steht in zwei Proben (Probe 1, Probe 2 …)", () => {
  const P = alle(), nummern = [...new Set(P.map((p) => p.nr))];
  for (const x of nummern) for (const y of nummern.filter((n) => n > x)) {
    const sx = saetzeVon(P.filter((p) => p.nr === x));
    assert.deepEqual([...saetzeVon(P.filter((p) => p.nr === y))].filter((s) => sx.has(s)), [], "Probe " + x + " und " + y);
  }
});

test("Kein Satz der Proben-Texte steht in einer Englisch-9-Probe", () => {
  const E9 = require("./e9-proben-daten").__vorlage;
  const saetze = (liste) => new Set(liste.flatMap((p) => p.texte.flatMap((x) => (x.absaetze || (x.sprecher || []).map((s) => s.text)).join(" ").split(/(?<=[.!?])\s+/))).map((s) => s.trim()).filter((s) => woerter(s) >= 5));
  const neun = saetze(Object.values(E9));
  assert.deepEqual([...saetze(alle())].filter((s) => neun.has(s)), []);
});
