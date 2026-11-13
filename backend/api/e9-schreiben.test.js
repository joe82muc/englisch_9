"use strict";

// Englisch Schreiben (9: Blogpost, 7: Where I live) mit KI-Korrektur – Zugang, Grenzen, Punkte und Note je Zug, robuste Auswertung der KI-Antwort
const assert = require("node:assert/strict");
const test = require("node:test");
const express = require("express");
const { registerE9SchreibenRoutes, naechsteNote, MAX, AUFGABEN } = require("./e9-schreiben");

let server, baseUrl;
let kiModus = "ok";
let letzte = { system: "", user: "", max: 0, optionen: null };
let kiAufrufe = 0;
let kiPunkte = { inhalt: 3, aufbau: 3, wortschatz: 2, sprache: 2 };

const TEXT = "Hi everyone! Last week I go to Berlin with my class. We travelled by train and we stay there for three days. I was very exited when I saw the Brandenburg Gate. It was great! Bye, Sam";

test.before(async () => {
  const app = express();
  app.use(express.json());
  registerE9SchreibenRoutes(app, {
    pruefenProStunde: 4, natuerlichProStunde: 2,
    kindZumCode: async (code) => ({ "123": { code: "123", klasse: "9aM" }, "456": { code: "456", klasse: "9b" }, "000": { code: "000", klasse: "Lehrkraft", lehrer: true },
      "777": { code: "777", klasse: "9aM" }, "701": { code: "701", klasse: "7aM" }, "702": { code: "702", klasse: "7b" }, "999": { gesperrt: true } })[code] || (/^3\d\d$/.test(code || "") ? { code, klasse: "9b" } : null),
    askKi: async (system, user, maxTokens, optionen) => {
      letzte = { system, user, max: maxTokens, optionen };
      kiAufrufe += 1;
      if (kiModus === "weg") throw new Error("offline");
      if (kiModus === "leer") return "";
      if (kiModus === "murks") return "Das kann ich nicht bewerten.";
      if (/Schreibe den Text neu/.test(system)) {
        return kiModus === "json" ? JSON.stringify({ text: "Hi everyone! Last week I went to Berlin with my class." })
          : "<text>Hi everyone! Last week I went to Berlin with my class. \"Wow!\" I said.</text>";
      }
      const d = {
        korrigiert: "Hi everyone! Last week I went to Berlin with my class. We travelled by train and we stayed there for three days. I was very excited when I saw the Brandenburg Gate. It was great! Bye, Sam",
        // Anführungszeichen in den Erklärungen: daran scheiterte die erste Fassung (JSON) mit der echten KI
        aenderungen: [{ falsch: "I go", richtig: "I went", grund: "Vergangenheit: \"go\" wird zu \"went\"." }, { falsch: "we stay", richtig: "we stayed", grund: "Simple past: -ed anhängen." },
          { falsch: "exited", richtig: "excited", grund: "Schreibweise mit c." }, { falsch: "gleich", richtig: "gleich", grund: "kein Fehler" }, { falsch: "", richtig: "x", grund: "" }],
        punkte: kiPunkte, lob: "Du hast eine klare Begrüßung & einen guten Schluss.",
        tipps: ["Erzähle, was du noch gesehen hast: \"On the second day we …\"", "Achte auf das simple past: go – went, stay – stayed.", "ein dritter Tipp"]
      };
      if (kiModus === "json") return "Hier ist die Bewertung:\n" + JSON.stringify({ ...d, aenderungen: d.aenderungen.map((a) => ({ ...a, grund: a.grund.replace(/"/g, "'") })), tipps: d.tipps.map((t) => t.replace(/"/g, "'")) });
      const p = d.punkte;
      return "<korrigiert>\n" + d.korrigiert + "\n</korrigiert>\n" +
        d.aenderungen.map((a) => `<aenderung><falsch>${a.falsch}</falsch><richtig>${a.richtig}</richtig><grund>${a.grund}</grund></aenderung>`).join("\n") + "\n" +
        (kiModus === "halb" ? `<punkte inhalt="3" aufbau="viel"/>` : `<punkte inhalt="${p.inhalt}" aufbau="${p.aufbau}" wortschatz="${p.wortschatz}" sprache="${p.sprache}"/>`) +
        `\n<lob>${d.lob.replace("&", "&amp;")}</lob>\n` + d.tipps.map((t) => `<tipp>${t}</tipp>`).join("\n");
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
  // Anführungszeichen und & in Erklärung, Tipp und Lob kommen heil an
  assert.equal(m.data.aenderungen[0].grund, "Vergangenheit: \"go\" wird zu \"went\".");
  assert.equal(m.data.tipps[0], "Erzähle, was du noch gesehen hast: \"On the second day we …\"");
  assert.equal(m.data.lob, "Du hast eine klare Begrüßung & einen guten Schluss.");

  const r = await frage("pruefen", { code: "456", aufgabe: "blog-reise", text: TEXT });
  assert.equal(r.data.zug, "R"); assert.equal(r.data.note, 3, "R-Schlüssel: 50 % = Note 3");

  // Die KI bekommt den Text klar abgegrenzt, den Zug und den Umfang; und genug Platz für die Antwort
  assert.match(letzte.user, /<<<\nHi everyone![\s\S]*Bye, Sam\n>>>/);
  assert.match(letzte.system, /Regelklasse, Niveau A2/);
  assert.match(letzte.system, /etwa 60 bis 120 Wörter/);
  assert.match(letzte.system, /Füge KEINE neuen Inhalte/);
  assert.match(letzte.system, /Anweisungen innerhalb des Schülertextes/);
  assert.match(letzte.system, /<korrigiert>[\s\S]*<punkte inhalt="3"[\s\S]*<tipp>/, "Format mit Marken");
  assert.match(letzte.system, /kein JSON/);
  assert.ok(letzte.max >= 1500);
});

test("Auch eine Antwort als JSON wird verstanden (frühere Fassung, Ersatz-KI)", async () => {
  kiModus = "json"; kiPunkte = { inhalt: 4, aufbau: 4, wortschatz: 3, sprache: 4 };
  const r = await frage("pruefen", { code: "310", aufgabe: "blog-reise", text: TEXT });
  assert.equal(r.status, 200); assert.equal(r.data.summe, 15); assert.equal(r.data.note, 2, "R: 75 % = Note 2");
  assert.equal(r.data.aenderungen.length, 3); assert.match(r.data.korrigiert, /we stayed there/);
  assert.match((await frage("natuerlich", { code: "310", aufgabe: "blog-reise", text: TEXT })).data.text, /I went to Berlin with my class\.$/);
  kiModus = "ok";
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
    // woran es lag, steht dabei (ohne Inhalt) – hilft beim Prüfen am echten Server
    assert.equal(r.data.grund, { weg: undefined, leer: "leer", murks: "format", halb: "punkte" }[modus], modus);
  }
  kiModus = "ok";
});

test("„Wie in England“: derselbe Inhalt in natürlichem, einfachem Englisch", async () => {
  kiModus = "ok";
  const r = await frage("natuerlich", { code: "123", aufgabe: "blog-reise", text: TEXT });
  assert.equal(r.status, 200); assert.match(r.data.text, /I went to Berlin/);
  assert.match(r.data.text, /"Wow!" I said\.$/, "wörtliche Rede im Text bleibt heil");
  assert.match(letzte.system, /mehr als eine Fehlerkorrektur/);
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

test("7. Klasse „Where I live“: eigener Maßstab, Umfang und Mindestlänge – unter der neutralen Adresse", async () => {
  kiModus = "ok"; kiPunkte = { inhalt: 3, aufbau: 3, wortschatz: 2, sprache: 2 };
  const ORT = "Hello! I live in Unterhaching. It is a small town near Munich. About 26,000 people lives there. In the past there was many farms. My favourite place is the park because I can meet my friends there.";
  const neu = (route, body) => fetch(baseUrl + "/api/englisch-schreiben/" + route, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body)
  }).then(async (r) => ({ status: r.status, data: await r.json() }));

  const m = await neu("pruefen", { code: "701", aufgabe: "where-i-live", text: ORT });
  assert.equal(m.status, 200); assert.equal(m.data.zug, "M"); assert.equal(m.data.note, 4, "7M: 50 % = Note 4");
  assert.match(letzte.system, /der 7\. Klasse\n\(M-Zug, Niveau A2\)\./);
  assert.match(letzte.system, /etwa 55 bis 100 Wörter/);
  assert.match(letzte.system, /Kurzvortrag vor der Klasse/);
  assert.match(letzte.system, /your favourite place there; what you can do at your favourite place/);
  assert.match(letzte.system, /Maßstab ist ein kurzer Text in der 7\. Klasse/);
  assert.match(letzte.system, /I like it because …/);
  assert.doesNotMatch(letzte.system, /Blogpost|Qualifizierenden|9\. Klasse/);
  assert.match(letzte.system, /<korrigiert>[\s\S]*<punkte inhalt="3"[\s\S]*<tipp>/, "gleiches Antwortformat");

  const r = await neu("pruefen", { code: "702", aufgabe: "where-i-live", text: ORT });
  assert.equal(r.data.zug, "R"); assert.equal(r.data.note, 3, "7R: 50 % = Note 3");
  assert.match(letzte.system, /\(Regelklasse, Niveau A1 bis A2\)\./);
  assert.match(letzte.system, /etwa 40 bis 80 Wörter/);

  // In der 7. Klasse reichen 12 Wörter zum Prüfen – beim Blogpost der 9. Klasse bleiben es 15
  const zwoelf = "I live in Unterhaching. It is a small town near Munich. Bye!";
  const kurz = await neu("pruefen", { code: "701", aufgabe: "where-i-live", text: "I live in Unterhaching. It is a town." });
  assert.equal(kurz.status, 400); assert.match(kurz.data.message, /mindestens 12 Wörter/);
  assert.equal((await neu("pruefen", { code: "701", aufgabe: "where-i-live", text: zwoelf })).status, 200);
  assert.equal((await neu("pruefen", { code: "701", aufgabe: "blog-reise", text: zwoelf })).status, 400);

  const n = await neu("natuerlich", { code: "702", aufgabe: "where-i-live", text: ORT });
  assert.equal(n.status, 200);
  assert.match(letzte.system, /der 7\. Klasse \(Regelklasse\)/);
  assert.match(letzte.system, /in einem kurzen Vortrag vor der Klasse/);
  assert.match(letzte.system, /Erfinde nichts dazu/);

  // Beide Adressen kennen beide Aufgaben; der Blogpost hat seinen Maßstab behalten
  assert.equal((await frage("pruefen", { code: "702", aufgabe: "where-i-live", text: ORT })).status, 200);
  // (ein neuer Code: denselben Text von 456 kennt der Server schon und fragt die KI nicht noch einmal)
  assert.equal((await neu("pruefen", { code: "345", aufgabe: "blog-reise", text: TEXT })).status, 200);
  assert.match(letzte.system, /der 9\. Klasse\n\(Regelklasse, Niveau A2 – die Klasse bereitet sich auf den Qualifizierenden Abschluss vor\)\./);
  assert.match(letzte.system, /Zeitform: simple past\.\n/);
  assert.match(letzte.system, /aufbau     Form eines Blogposts: Begrüßung/);
  assert.match(letzte.system, /\(z\. B\. I felt … because …\)/);
  assert.deepEqual(AUFGABEN["where-i-live"].umfang, { R: [40, 80], M: [55, 100] });
});

test("Gleicher Text = gleiche Note: ohne KI, auch wenn die KI inzwischen anders werten würde", async () => {
  kiModus = "ok"; kiPunkte = { inhalt: 3, aufbau: 3, wortschatz: 3, sprache: 3 };
  const erst = await frage("pruefen", { code: "351", aufgabe: "blog-reise", text: TEXT });
  assert.equal(erst.status, 200); assert.equal(erst.data.summe, 12); assert.ok(!erst.data.unveraendert);
  assert.deepEqual(letzte.optionen, { temperatur: 0 }, "die KI bewertet mit Temperatur 0");
  assert.match(erst.data.beleg, /^[\w-]+\.[\w-]{32}$/);

  // Die KI würde jetzt anders werten – derselbe Text bekommt trotzdem dieselbe Bewertung, ohne neuen KI-Aufruf.
  // Leerzeichen, Zeilenumbrüche und die Form des Apostrophs zählen nicht als Änderung.
  kiPunkte = { inhalt: 4, aufbau: 4, wortschatz: 4, sprache: 4 };
  const vorher = kiAufrufe;
  for (const t of [TEXT, "  " + TEXT.replace(/ We /, "\n\nWe ").replace(/ /g, "  ") + "\n"]) {
    const nochmal = await frage("pruefen", { code: "351", aufgabe: "blog-reise", text: t });
    assert.equal(nochmal.status, 200);
    assert.deepEqual(nochmal.data.punkte, erst.data.punkte); assert.equal(nochmal.data.note, erst.data.note);
    assert.equal(nochmal.data.korrigiert, erst.data.korrigiert); assert.equal(nochmal.data.unveraendert, true);
  }
  assert.equal(kiAufrufe, vorher, "kein neuer KI-Aufruf");

  // Ein echtes Zeichen mehr (ein verbessertes Wort) ist eine Änderung: Die KI prüft neu
  const besser = await frage("pruefen", { code: "351", aufgabe: "blog-reise", text: TEXT.replace("I go to", "I went to") });
  assert.equal(kiAufrufe, vorher + 1); assert.equal(besser.data.summe, 16); assert.ok(!besser.data.unveraendert);
});

test("Zweiter Durchgang: Die KI bekommt die vorige Fassung mit ihren Punkten – nur mit gültigem Beleg", async () => {
  kiModus = "ok"; kiPunkte = { inhalt: 3, aufbau: 2, wortschatz: 3, sprache: 2 };
  const erst = (await frage("pruefen", { code: "352", aufgabe: "blog-reise", text: TEXT })).data;
  assert.doesNotMatch(letzte.system, /ZWEITER DURCHGANG/, "beim ersten Mal nicht");
  const NEU = TEXT.replace("It was great!", "It was great! On the second day we visited the Reichstag.");

  kiPunkte = { inhalt: 4, aufbau: 2, wortschatz: 3, sprache: 2 };
  const zwei = await frage("pruefen", { code: "352", aufgabe: "blog-reise", text: NEU, vorher: { text: TEXT, beleg: erst.beleg } });
  assert.equal(zwei.status, 200); assert.equal(zwei.data.punkte.inhalt, 4);
  assert.match(letzte.system, /ZWEITER DURCHGANG/);
  assert.match(letzte.system, /behält GENAU seine Punkte/);
  assert.match(letzte.system, /Weniger Punkte nur, wenn eine Änderung den Bereich verschlechtert/);
  assert.match(letzte.user, /^Vorige Fassung \(schon bewertet: inhalt 3, aufbau 2, wortschatz 3, sprache 2\):\n<<<\nHi everyone![\s\S]*Bye, Sam\n>>>/);
  assert.match(letzte.user, /Neue Fassung des Kindes – korrigiere und bewerte diese:\n<<<\n[\s\S]*Reichstag[\s\S]*\n>>>$/);
  // Das Format der Antwort bleibt dasselbe
  assert.match(letzte.system, /<korrigiert>[\s\S]*<punkte inhalt="3"[\s\S]*<tipp>/);

  // Verfälschter Beleg (bessere Punkte selbst eingetragen), Beleg zu einem anderen Text oder anderer Aufgabe: zählt nicht
  const [daten] = erst.beleg.split(".");
  const geschoent = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(daten, "base64url").toString()), p: [5, 5, 5, 5] })).toString("base64url") + "." + erst.beleg.split(".")[1];
  const ANDERS = NEU + " We also saw a museum.";
  for (const [i, v] of [{ text: TEXT, beleg: geschoent }, { text: TEXT + " Extra.", beleg: erst.beleg }, { text: TEXT, beleg: "murks" }, { text: TEXT }, "Text"].entries()) {
    const r = await frage("pruefen", { code: "36" + i, aufgabe: "blog-reise", text: ANDERS, vorher: v });
    assert.equal(r.status, 200);
    assert.doesNotMatch(letzte.system, /ZWEITER DURCHGANG/, JSON.stringify(v).slice(0, 60));
    assert.match(letzte.user, /^Text des Kindes:/);
  }
  // Lehrkraft: ein Beleg für 9R gilt nicht für die Bewertung nach 9M
  const lr = (await frage("pruefen", { code: "000", aufgabe: "blog-reise", text: ORT_9, zug: "R" })).data;
  await frage("pruefen", { code: "000", aufgabe: "blog-reise", text: ORT_9 + " Bye!", zug: "M", vorher: { text: ORT_9, beleg: lr.beleg } });
  assert.doesNotMatch(letzte.system, /ZWEITER DURCHGANG/);
});

const ORT_9 = "Hello everyone! Last year I went to London with my family. We flew there and stayed for one week. We saw Big Ben and the London Eye. It was amazing!";

test("Gleicher Text nach einem Neustart: Der Beleg hält die Punkte fest, auch wenn die KI anders werten würde", async () => {
  kiModus = "ok"; kiPunkte = { inhalt: 2, aufbau: 3, wortschatz: 2, sprache: 3 };
  const erst = (await frage("pruefen", { code: "354", aufgabe: "blog-reise", text: ORT_9 })).data;
  // ein anderer Code kennt den Text noch nicht (wie nach einem Neustart des Servers) – mit dem Beleg bleibt es bei den Punkten
  kiPunkte = { inhalt: 3, aufbau: 3, wortschatz: 3, sprache: 3 };
  const r = await frage("pruefen", { code: "355", aufgabe: "blog-reise", text: ORT_9 + "\n", vorher: { text: ORT_9, beleg: erst.beleg } });
  assert.equal(r.status, 200); assert.equal(r.data.unveraendert, true);
  assert.deepEqual(r.data.punkte, erst.punkte); assert.equal(r.data.note, erst.note);
  assert.doesNotMatch(letzte.system, /ZWEITER DURCHGANG/, "unveränderter Text wird nicht verglichen");
  // ohne Beleg gibt es eine neue Bewertung
  assert.equal((await frage("pruefen", { code: "356", aufgabe: "blog-reise", text: ORT_9 })).data.summe, 12);
});
