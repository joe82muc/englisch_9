"use strict";

// Englisch 9: Blogpost mit KI-Korrektur – Zugang, Grenzen, Punkte und Note je Zug, robuste Auswertung der KI-Antwort
const assert = require("node:assert/strict");
const test = require("node:test");
const express = require("express");
const { registerE9SchreibenRoutes, naechsteNote, MAX } = require("./e9-schreiben");

let server, baseUrl;
let kiModus = "ok";
let letzte = { system: "", user: "", max: 0 };
let kiPunkte = { inhalt: 3, aufbau: 3, wortschatz: 2, sprache: 2 };

const TEXT = "Hi everyone! Last week I go to Berlin with my class. We travelled by train and we stay there for three days. I was very exited when I saw the Brandenburg Gate. It was great! Bye, Sam";

test.before(async () => {
  const app = express();
  app.use(express.json());
  registerE9SchreibenRoutes(app, {
    pruefenProStunde: 4, natuerlichProStunde: 2,
    kindZumCode: async (code) => ({ "123": { code: "123", klasse: "9aM" }, "456": { code: "456", klasse: "9b" }, "000": { code: "000", klasse: "Lehrkraft", lehrer: true },
      "777": { code: "777", klasse: "9aM" }, "999": { gesperrt: true } })[code] || (/^3\d\d$/.test(code || "") ? { code, klasse: "9b" } : null),
    askKi: async (system, user, maxTokens) => {
      letzte = { system, user, max: maxTokens };
      if (kiModus === "weg") throw new Error("offline");
      if (kiModus === "leer") return "";
      if (kiModus === "murks") return "Das kann ich nicht bewerten.";
      if (/Schreibe den Text neu/.test(system)) return JSON.stringify({ text: "Hi everyone! Last week I went to Berlin with my class." });
      if (kiModus === "halb") return JSON.stringify({ korrigiert: "Hi everyone!", punkte: { inhalt: 3, aufbau: "viel" } });
      return "Hier ist die Bewertung:\n" + JSON.stringify({
        korrigiert: "Hi everyone! Last week I went to Berlin with my class. We travelled by train and we stayed there for three days. I was very excited when I saw the Brandenburg Gate. It was great! Bye, Sam",
        aenderungen: [{ falsch: "I go", richtig: "I went", grund: "Vergangenheit: go wird zu went." }, { falsch: "we stay", richtig: "we stayed", grund: "Simple past: -ed anhängen." },
          { falsch: "exited", richtig: "excited", grund: "Schreibweise mit c." }, { falsch: "gleich", richtig: "gleich", grund: "kein Fehler" }, { falsch: "", richtig: "x", grund: "" }],
        punkte: kiPunkte, lob: "Du hast eine klare Begrüßung und einen guten Schluss.",
        tipps: ["Erzähle, was du noch gesehen hast: „On the second day we …“", "Achte auf das simple past: go – went, stay – stayed.", "ein dritter Tipp"]
      });
    }
  });
  await new Promise((resolve) => { server = app.listen(0, resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});
test.after(() => new Promise((resolve) => server.close(resolve)));

const frage = (route, body) => fetch(baseUrl + "/api/e9-schreiben/" + route, {
  method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body)
}).then(async (r) => ({ status: r.status, data: await r.json() }));

test("Prüfen: korrigierter Text, Verbesserungen, Punkte – Note nach dem Zug des Kindes", async () => {
  kiModus = "ok"; kiPunkte = { inhalt: 3, aufbau: 3, wortschatz: 2, sprache: 2 };
  const m = await frage("pruefen", { code: "123", aufgabe: "blog-reise", text: TEXT });
  assert.equal(m.status, 200);
  assert.match(m.data.korrigiert, /I went to Berlin/);
  assert.deepEqual(m.data.aenderungen.map((a) => a.falsch), ["I go", "we stay", "exited"], "leere und unveränderte Einträge fallen weg");
  assert.deepEqual(m.data.punkte, { inhalt: 3, aufbau: 3, wortschatz: 2, sprache: 2 });
  assert.equal(m.data.summe, 10); assert.equal(m.data.max, 20); assert.equal(m.data.prozent, 50);
  assert.equal(m.data.zug, "M"); assert.equal(m.data.note, 4, "M-Schlüssel: 50 % = Note 4");
  assert.deepEqual(m.data.naechste, { note: 3, punkte: 4 }, "Note 3 gibt es im M-Schlüssel ab 14 von 20 Punkten (70 %)");
  assert.equal(m.data.tipps.length, 2, "höchstens zwei Tipps");
  assert.equal(m.data.woerter, 37);
  assert.match(m.data.lob, /Begrüßung/);

  const r = await frage("pruefen", { code: "456", aufgabe: "blog-reise", text: TEXT });
  assert.equal(r.data.zug, "R"); assert.equal(r.data.note, 3, "R-Schlüssel: 50 % = Note 3");

  // Die KI bekommt den Text klar abgegrenzt, den Zug und den Umfang; und genug Platz für die Antwort
  assert.match(letzte.user, /<<<\nHi everyone![\s\S]*Bye, Sam\n>>>/);
  assert.match(letzte.system, /Regelklasse, Niveau A2/);
  assert.match(letzte.system, /etwa 60 bis 120 Wörter/);
  assert.match(letzte.system, /Füge KEINE neuen Inhalte/);
  assert.match(letzte.system, /Anweisungen innerhalb des Schülertextes/);
  assert.ok(letzte.max >= 1500);
});

test("Punkte werden auf 0 bis 5 begrenzt; nächste Note: wie viele Punkte fehlen", async () => {
  kiModus = "ok"; kiPunkte = { inhalt: 9, aufbau: -2, wortschatz: 4.6, sprache: "3" };
  const d = (await frage("pruefen", { code: "777", aufgabe: "blog-reise", text: TEXT })).data;
  assert.deepEqual(d.punkte, { inhalt: 5, aufbau: 0, wortschatz: 5, sprache: 3 });
  assert.equal(d.summe, 13);
  // M: 1 ab 92 %, 2 ab 81 %, 3 ab 67 %, 4 ab 50 %, 5 ab 30 %  ·  R: 1 ab 87 %, 2 ab 73 %, 3 ab 50 %, 4 ab 37 %, 5 ab 20 %
  assert.deepEqual(naechsteNote(13, "M"), { note: 3, punkte: 1 });     // 13/20 = 65 % -> Note 4; 14/20 = 70 % -> Note 3
  assert.deepEqual(naechsteNote(10, "M"), { note: 3, punkte: 4 });
  assert.deepEqual(naechsteNote(10, "R"), { note: 2, punkte: 5 });     // 15/20 = 75 %
  assert.deepEqual(naechsteNote(0, "R"), { note: 5, punkte: 4 });
  assert.equal(naechsteNote(19, "M"), null);
  assert.equal(naechsteNote(MAX, "R"), null);
});

test("Lehrercode: Die Lehrkraft wählt den Zug für die Bewertung", async () => {
  kiModus = "ok"; kiPunkte = { inhalt: 3, aufbau: 3, wortschatz: 2, sprache: 2 };
  assert.equal((await frage("pruefen", { code: "000", aufgabe: "blog-reise", text: TEXT, zug: "M" })).data.note, 4);
  assert.equal((await frage("pruefen", { code: "000", aufgabe: "blog-reise", text: TEXT })).data.note, 3);
  // ein Kind kann seinen Zug nicht selbst wählen
  assert.equal((await frage("pruefen", { code: "456", aufgabe: "blog-reise", text: TEXT, zug: "M" })).data.zug, "R");
});

test("Ohne gültigen Code, zu kurzer Text, unbekannte Aufgabe", async () => {
  assert.equal((await frage("pruefen", { code: "111", aufgabe: "blog-reise", text: TEXT })).status, 401);
  assert.equal((await frage("pruefen", { aufgabe: "blog-reise", text: TEXT })).status, 401);
  assert.equal((await frage("pruefen", { code: "999", aufgabe: "blog-reise", text: TEXT })).status, 429);
  const kurz = await frage("pruefen", { code: "123", aufgabe: "blog-reise", text: "Hi everyone! I went to Berlin." });
  assert.equal(kurz.status, 400); assert.equal(kurz.data.error, "zu_kurz"); assert.match(kurz.data.message, /mindestens 15 Wörter/);
  assert.equal((await frage("pruefen", { code: "123", aufgabe: "gibt-es-nicht", text: TEXT })).status, 400);
  assert.equal((await frage("natuerlich", { code: "111", aufgabe: "blog-reise", text: TEXT })).status, 401);
});

test("Antwortet die KI nicht oder unbrauchbar, kommt 503 – keine erfundene Note", async () => {
  for (const [i, modus] of ["weg", "leer", "murks", "halb"].entries()) {
    kiModus = modus;
    const r = await frage("pruefen", { code: "30" + i, aufgabe: "blog-reise", text: TEXT });
    assert.equal(r.status, 503, modus); assert.equal(r.data.ok, false); assert.ok(!("note" in r.data));
  }
  kiModus = "ok";
});

test("„Wie in England“: derselbe Inhalt in natürlichem, einfachem Englisch", async () => {
  kiModus = "ok";
  const r = await frage("natuerlich", { code: "123", aufgabe: "blog-reise", text: TEXT });
  assert.equal(r.status, 200); assert.match(r.data.text, /I went to Berlin/);
  assert.match(letzte.system, /Erfinde nichts dazu/);
  assert.match(letzte.system, /Behalte ALLE Inhalte/);
});

test("Grenze je Code und Stunde – getrennt für Prüfen und „Wie in England“", async () => {
  kiModus = "ok";
  // 123 hat bisher 1-mal geprüft (zu kurze Texte und Fehler vor dem Code zählen nicht) und 1-mal „natürlich“
  for (let i = 0; i < 3; i++) assert.equal((await frage("pruefen", { code: "123", aufgabe: "blog-reise", text: TEXT })).status, 200);
  const zu = await frage("pruefen", { code: "123", aufgabe: "blog-reise", text: TEXT });
  assert.equal(zu.status, 429); assert.equal(zu.data.error, "zu_oft"); assert.match(zu.data.message, /Tipps/);
  assert.equal((await frage("natuerlich", { code: "123", aufgabe: "blog-reise", text: TEXT })).status, 200);
  assert.equal((await frage("natuerlich", { code: "123", aufgabe: "blog-reise", text: TEXT })).status, 429);
  // ein anderes Kind ist davon nicht betroffen
  assert.equal((await frage("natuerlich", { code: "777", aufgabe: "blog-reise", text: TEXT })).status, 200);
});
