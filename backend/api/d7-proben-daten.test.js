"use strict";

// Deutsch 7: die Proben selbst (d7-proben/p<nr>.js) – Aufbau, Punkte, Anteil offener Aufgaben und vor allem:
// Variante B ist gleichwertig zu Variante A, aber nicht dieselbe Probe.
const assert = require("node:assert/strict");
const test = require("node:test");
const { vorbereiten, maxPoints, anteile } = require("./d7-proben");
const Zeilen = require("./d7-zeilen");
const ROH = require("./d7-proben-daten");
const PROBEN = vorbereiten(JSON.parse(JSON.stringify(ROH)));
const VORLAGE = ROH.__vorlage;

const NUMMERN = [...new Set(Object.values(PROBEN).map((p) => p.nr))].sort((a, b) => a - b);
const TEXTPROBEN = new Set([1, 2, 3, 4, 5]);            // hier kommen mindestens 50 % der Punkte aus offenen Aufgaben
const LANGTEXT = new Set([2, 3, 5]);                    // hier steht ein längerer Lesetext
const fassung = (nr, zug, v) => PROBEN["d7-p" + nr + "-" + zug + "-" + v];
const saetze = (p) => p.texte.flatMap((t) => (t.absaetze || t.verse || []).join(" ").split(/(?<=[.!?])\s+/)).map((s) => s.trim()).filter((s) => s.length > 25);
const woerter = (p) => p.texte.reduce((n, t) => n + (t.absaetze || t.verse ? Zeilen.woerter(t) : 0), 0);

test("Es gibt mindestens eine Probe, und jede hat vier Fassungen (R7/M7, A/B)", () => {
  assert.ok(NUMMERN.length >= 1, "noch keine Probe");
  for (const nr of NUMMERN) for (const zug of ["r", "m"]) for (const v of ["a", "b"]) {
    const p = fassung(nr, zug, v);
    assert.ok(p, `Probe ${nr}: Fassung ${zug}-${v} fehlt`);
    assert.equal(p.zug, zug.toUpperCase()); assert.equal(p.variante, v.toUpperCase()); assert.equal(p.nr, nr);
    assert.match(p.title, new RegExp("^Probe " + nr + " \\((R7|M7)\\): "), p.id + ": Titel");
    assert.ok(p.kurz && p.scope && p.minutes >= 20 && p.minutes <= 90, p.id + ": kurz, scope, minutes");
    assert.equal(/Variante B/.test(p.title), v === "b", p.id + ": „Variante B“ im Titel");
  }
});

for (const nr of NUMMERN) {
  test(`Probe ${nr}: Aufgaben sind vollständig und eindeutig`, () => {
    for (const zug of ["r", "m"]) for (const v of ["a", "b"]) {
      const p = fassung(nr, zug, v), wo = (i) => `${p.id} Aufgabe ${i + 1}: `;
      assert.ok(p.items.length >= 6 && p.items.length <= 16, p.id + ": 6 bis 16 Aufgaben");
      p.items.forEach((it, i) => {
        assert.ok(it.prompt.length >= 12, wo(i) + "Aufgabenstellung zu kurz");
        if (it.type === "choice") {
          assert.ok(it.options.length >= 3 && new Set(it.options).size === it.options.length, wo(i) + "mindestens 3 verschiedene Antworten");
        }
        if (it.type === "match") {
          const ziele = it.pairs.map((x) => x[1]);
          assert.equal(new Set(it.pairs.map((x) => x[0])).size, it.pairs.length, wo(i) + "linke Seite doppelt");
          // Die Seite zeigt die Ziele alphabetisch: Die Lösung darf nicht einfach „der Reihe nach“ sein
          if (new Set(ziele).size === ziele.length && ziele.length >= 3) {
            const sortiert = ziele.slice().sort((a, b) => a.localeCompare(b, "de"));
            assert.notDeepEqual(ziele, sortiert, wo(i) + "Lösung der Zuordnung ist „der Reihe nach“ – Paare umstellen oder Ziele umbenennen");
          }
        }
        if (it.type === "order") assert.notDeepEqual(it.steps, it.steps.slice().sort((a, b) => a.localeCompare(b, "de")), wo(i) + "Lösung ist alphabetisch – Schritte umformulieren");
        if (it.type === "felder") it.felder.forEach((f) => assert.ok(f.loesungen.every((l) => String(l).trim()), wo(i) + "leere Lösung"));
        if (it.type === "offen") {
          assert.ok(it.expected && it.expected.length >= 15, wo(i) + "Beispiellösung fehlt");
          assert.ok(Array.isArray(it.keywords) && it.keywords.length >= 1, wo(i) + "Stichwörter fehlen");
          assert.ok(it.kriterien.every((k) => Number.isInteger(k.punkte) && k.punkte >= 1 && k.punkte <= 4), wo(i) + "Kriterien: 1 bis 4 ganze Punkte");
          assert.ok(it.kriterien.filter((k) => k.erwartet).length >= 1, wo(i) + "mindestens ein Kriterium braucht „erwartet“");
          const frage = it.prompt.toLocaleLowerCase("de");
          it.keywords.forEach((g) => g.split("|").forEach((w) => assert.ok(w.trim().length >= 2 && w === w.toLocaleLowerCase("de"), wo(i) + "Stichwort „" + w + "“ (klein schreiben, mindestens 2 Zeichen)")));
          assert.ok(it.points <= 8, wo(i) + "offene Aufgabe mit mehr als 8 Punkten – als s(…) mit Raster schreiben");
          void frage;
        }
        if (it.type === "schreiben") {
          assert.ok(it.raster.length >= 3 && it.raster.every((k) => k.text), wo(i) + "Raster: mindestens drei Zeilen, jede mit Beschreibung");
          assert.ok(it.minWoerter >= 30, wo(i) + "minWoerter fehlt");
          assert.ok(it.raster.filter((k) => k.rs).length <= 1, wo(i) + "höchstens eine Rasterzeile für die Rechtschreibung");
        }
        if (it.text) assert.ok(p.texte.some((t) => t.id === it.text), wo(i) + "Text fehlt");
      });
      p.texte.forEach((t) => { if (t.zeilen) assert.ok(t.zeilen.every((z) => z.t.length <= 60 || !/\s/.test(z.t)), p.id + ": Zeile länger als 60 Zeichen"); assert.ok(t.titel, p.id + ": Text ohne Titel"); });
    }
  });

  test(`Probe ${nr}: Punkte und Anteil offener Aufgaben`, () => {
    for (const zug of ["r", "m"]) for (const v of ["a", "b"]) {
      const p = fassung(nr, zug, v), max = maxPoints(p), a = anteile(p);
      assert.ok(max >= 24 && max <= 44, `${p.id}: ${max} Punkte (erwartet 24 bis 44)`);
      const offen = a.offen / max;
      if (TEXTPROBEN.has(nr)) assert.ok(offen >= 0.5 && offen <= 0.85, `${p.id}: ${Math.round(offen * 100)} % offene Punkte (erwartet 50 bis 85 %)`);
      else assert.ok(offen >= 0.08 && offen <= 0.45, `${p.id}: ${Math.round(offen * 100)} % offene Punkte (Grammatik/Rechtschreibung: 8 bis 45 %)`);
      if (LANGTEXT.has(nr)) {
        const n = woerter(p), [von, bis] = zug === "r" ? [280, 470] : [390, 640];
        assert.ok(n >= von && n <= bis, `${p.id}: Lesetext hat ${n} Wörter (erwartet ${von} bis ${bis})`);
      }
      if (zug === "r" && TEXTPROBEN.has(nr)) {
        const offene = p.items.filter((i) => i.type === "offen");
        assert.ok(offene.filter((i) => i.hilfe).length >= Math.floor(offene.length / 2), p.id + ": R7 braucht Hilfen (hilfe:) bei mindestens der Hälfte der offenen Aufgaben");
      }
    }
    assert.ok(maxPoints(fassung(nr, "m", "a")) >= maxPoints(fassung(nr, "r", "a")), "M7 hat mindestens so viele Punkte wie R7");
  });

  test(`Probe ${nr}: Variante B ist gleichwertig, aber eine andere Probe`, () => {
    for (const zug of ["r", "m"]) {
      const a = fassung(nr, zug, "a"), b = fassung(nr, zug, "b");
      assert.equal(maxPoints(b), maxPoints(a), `${zug}: Gesamtpunkte A ${maxPoints(a)} / B ${maxPoints(b)}`);
      assert.equal(b.minutes, a.minutes, zug + ": Bearbeitungszeit");
      assert.deepEqual(b.items.map((i) => i.type + ":" + i.points), a.items.map((i) => i.type + ":" + i.points), zug + ": dieselbe Folge von Aufgabenarten und Punkten");
      assert.ok(Math.abs(anteile(a).offen - anteile(b).offen) <= 2, zug + ": Anteil offener Punkte");
      // andere Texte: kein gemeinsamer Satz, andere Titel
      const sa = new Set(saetze(a));
      assert.deepEqual(saetze(b).filter((s) => sa.has(s)), [], zug + ": Variante B verwendet Sätze aus Variante A");
      a.texte.forEach((t) => assert.ok(!b.texte.some((x) => x.titel === t.titel), zug + ": gleicher Texttitel in A und B"));
      if (LANGTEXT.has(nr)) assert.ok(Math.abs(woerter(a) - woerter(b)) <= 70, `${zug}: Textlänge A ${woerter(a)} / B ${woerter(b)} Wörter`);
      // andere Aufgaben: Auswahl-Antworten, Lösungen und Beispielsätze kommen nicht doppelt vor
      const stoff = (p) => new Set(p.items.flatMap((i) => [].concat(i.options || [], (i.pairs || []).map((x) => x[0]), i.steps || [], i.saetze || [], (i.felder || []).map((f) => f.label), i.expected || [], i.vorgabe || [], i.material || []))
        .map((s) => String(s).trim()).filter((s) => s.length > 18 && !/^Abschnitt \d/.test(s)));
      const sb = stoff(b);
      assert.deepEqual([...stoff(a)].filter((s) => sb.has(s)), [], zug + ": Variante B verwendet Material aus Variante A");
    }
    // R7 und M7 sind verschiedene Proben (keine gemeinsamen Lesetexte)
    for (const v of ["a", "b"]) { const sr = new Set(saetze(fassung(nr, "r", v))); assert.deepEqual(saetze(fassung(nr, "m", v)).filter((s) => sr.has(s)), [], "R7 und M7 teilen einen Text"); }
  });
}

test("Ankreuzaufgaben: die richtige Antwort steht in der Vorlage vorn und wird beim Laden gemischt", () => {
  for (const p of Object.values(VORLAGE)) p.items.forEach((it, i) => { if (it.type === "choice") assert.equal(it.answer, 0, `${p.id} Aufgabe ${i + 1}: richtige Antwort an Stelle 0 schreiben`); });
  const stellen = Object.values(PROBEN).flatMap((p) => p.items.filter((i) => i.type === "choice").map((i) => i.answer));
  if (stellen.length >= 8) assert.ok(new Set(stellen).size >= 3, "gemischt: die richtige Antwort liegt an verschiedenen Stellen");
});

test("Kein Lesetext und keine Schreibaufgabe kommt in zwei Proben vor", () => {
  const titel = new Map();
  for (const p of Object.values(PROBEN)) p.texte.forEach((t) => { assert.ok(!titel.has(t.titel) || titel.get(t.titel) === p.id, `Text „${t.titel}“ steht in ${titel.get(t.titel)} und ${p.id}`); titel.set(t.titel, p.id); });
});
