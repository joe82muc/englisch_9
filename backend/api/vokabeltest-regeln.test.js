"use strict";

// Vokabeltest: Großschreibung englischer Eigennamen und unregelmäßige Verben mit drei Formen
const assert = require("node:assert/strict");
const test = require("node:test");
const { checkAnswer, verbFormen, einBuchstabeDaneben } = require("./vokabeltest");
const { TESTS } = require("./vokabeltest-daten");

const richtig = (antwort, loesungen, lrs) => checkAnswer(antwort, loesungen, lrs).correct;

test("Eigennamen müssen großgeschrieben sein", () => {
  assert.equal(richtig("France", ["France"]), true);
  const r = checkAnswer("france", ["France"]);
  assert.equal(r.correct, false);
  assert.deepEqual(r.gross, ["France"]);
  assert.equal(richtig("frence", ["France"]), false, "Tippfehler und klein");
  assert.equal(richtig("Frence", ["France"]), false, "kurzes Wort: jeder Buchstabe zählt (seit 08.10.2026)");
  assert.equal(richtig("Northen Ireland", ["Northern Ireland"]), true, "ein Buchstabe in einem langen Wort zählt weiter");
  assert.equal(richtig("northen Ireland", ["Northern Ireland"]), false, "… aber nicht kleingeschrieben");
  assert.equal(richtig("northern ireland", ["Northern Ireland"]), false);
  assert.equal(richtig("Northern ireland", ["Northern Ireland"]), false);
  assert.equal(richtig("Northern Ireland", ["Northern Ireland"]), true);
  assert.equal(richtig("british isles", ["the British Isles; British Isles"]), false);
  assert.equal(richtig("the British Isles", ["the British Isles; British Isles"]), true);
  assert.equal(richtig("richter scale", ["Richter scale"]), false);
  assert.equal(richtig("english speaking", ["English-speaking; English speaking"]), false);
  assert.equal(richtig("English-speaking", ["English-speaking; English speaking"]), true);
  assert.equal(richtig("thanksgiving", ["Thanksgiving"]), false);
  assert.equal(richtig("turkish", ["Turkish"]), false);
  assert.equal(richtig("cv", ["CV; curriculum vitae"]), false, "Abkürzung");
  assert.equal(richtig("curriculum vitae", ["CV; curriculum vitae"]), true);
});

test("Großbuchstabe am Anfang einer Wendung und „I“ sind keine Pflicht", () => {
  assert.equal(richtig("get well soon", ["Get well soon"]), true);
  assert.equal(richtig("have a good flight", ["Have a good flight!"]), true);
  assert.equal(richtig("you're welcome", ["You're welcome; You are welcome"]), true);
  assert.equal(richtig("yours sincerely", ["Yours sincerely,"]), true);
  assert.equal(richtig("what's wrong", ["What's the matter; What is the matter; What's wrong; What is wrong"]), true);
  assert.equal(richtig("i'm afraid", ["I'm afraid; I am afraid; unfortunately"]), true);
});

test("Notenschutz LRS: Großschreibung zählt nicht", () => {
  assert.equal(richtig("france", ["France"], true), true);
  assert.equal(richtig("northern ireland", ["Northern Ireland"], true), true);
});

test("Unregelmäßige Verben: alle drei Formen in der Reihenfolge", () => {
  const drive = ["drive, drove, driven"];
  assert.equal(verbFormen(drive).length, 1);
  assert.equal(verbFormen(["one thousand two hundred; one thousand, two hundred"]).length, 0, "Zahlwort ist kein Verb");
  assert.equal(verbFormen(["Yours sincerely,"]).length, 0);
  const nur = checkAnswer("drive", drive);
  assert.equal(nur.correct, false);
  assert.deepEqual(nur.formen.fehlend, ["drove", "driven"]);
  assert.equal(richtig("drive, drove", drive), false);
  assert.equal(richtig("drive, drove, driven", drive), true);
  assert.equal(richtig("drive drove driven", drive), true);
  assert.equal(richtig("to drive - drove - driven", drive), true);
  assert.equal(richtig("drive/drove/driven", drive), true);
  const falsch = checkAnswer("drive, drived, driven", drive);
  assert.equal(falsch.correct, false);
  assert.deepEqual(falsch.formen.falsch, ["drove"]);
  assert.equal(richtig("driven, drove, drive", drive), false, "Reihenfolge zählt");
  assert.equal(richtig("drive, drove, drivn", drive), false, "kurze Form: jeder Buchstabe zählt");
  assert.equal(checkAnswer("forget, forgot, forgoten", ["forget, forgot, forgotten"]).typo, true, "ein Buchstabe in einer langen Form zählt als Tippfehler");
  assert.equal(richtig("drive, drove, drivn", drive, true), true, "mit Notenschutz LRS bleibt die Nachsicht");
  const be = ["be, was/were, been"];
  assert.equal(richtig("be, was, been", be), true);
  assert.equal(richtig("be, was, were, been", be), true);
  assert.equal(richtig("be were been", be), true);
  assert.equal(richtig("be, been", be), false);
});

test("Die Schreibweise zählt: kurze Wörter genau, ein Buchstabenfehler nur in einem langen Wort", () => {
  // andere Wörter und kurze Wörter mit Fehler (früher zählte ab 5 Buchstaben jeder einzelne Buchstabenfehler)
  assert.equal(richtig("clear", ["clean"]), false);
  assert.equal(richtig("cost", ["coast"]), false);
  assert.equal(richtig("coas", ["coast"]), false);
  assert.equal(richtig("quit", ["quiet"]), false);
  assert.equal(richtig("nort", ["north"]), false);
  assert.equal(richtig("trafic", ["traffic"]), false, "7 Buchstaben: genau");
  assert.equal(richtig("sience", ["science"]), false);
  assert.equal(richtig("clean", ["clean"]), true);
  // lange Wörter (ab 8 Buchstaben): genau ein Buchstabe darf abweichen
  const r = checkAnswer("enviroment", ["environment"]);
  assert.deepEqual(r, { correct: true, typo: true, matched: "environment" });
  assert.equal(richtig("exibition", ["exhibition"]), true);
  assert.equal(richtig("envirment", ["environment"]), false, "zwei Buchstaben");
  // Wendungen: Wort für Wort – der Fehler muss in einem langen Wort liegen, und es darf nur einer sein
  const nw = ["in the northwest of; in the north-west of"];
  assert.equal(richtig("in the nortwest of", nw), true);
  assert.equal(richtig("in the north west of", nw), true, "Leerzeichen statt Bindestrich");
  assert.equal(richtig("in teh northwest of", nw), false, "Fehler in einem kurzen Wort");
  assert.equal(richtig("city sentre", ["city centre; city center; town centre"]), false);
  assert.equal(richtig("city center", ["city centre; city center; town centre"]), true, "hinterlegte Schreibweise");
  assert.equal(richtig("fifty thousend", ["fifty thousand"]), true);
  assert.equal(richtig("fivty thousand", ["fifty thousand"]), false);
  assert.equal(richtig("one milion", ["a million; one million"]), false);
  assert.equal(richtig("exibition and enviroment", ["exhibition and environment"]), false, "höchstens ein Wort mit Fehler");
  // kein Tippfehler, wenn ein Wort der deutschen Vorgabe herauskommt …
  const irland = ["the Republic of Ireland; Republic of Ireland"];
  assert.equal(checkAnswer("the Republik of Ireland", irland, false, { prompt: "die Republik Irland" }).correct, false);
  assert.equal(checkAnswer("the Republic of Ireland", irland, false, { prompt: "die Republik Irland" }).correct, true);
  // … oder ein anderes Wort aus den Vokabeltests
  assert.equal(checkAnswer("practise", ["practice"], false, { bekannt: new Set(["practise", "practice"]) }).correct, false);
  assert.equal(checkAnswer("practise", ["practice"], false).correct, true);
  // britische und amerikanische Schreibweise sind beide richtig (kein Tippfehler-Vermerk)
  assert.deepEqual(checkAnswer("theater", ["theatre"]), { correct: true, typo: false, matched: "theatre" });
  assert.equal(richtig("town center", ["city centre; town centre"]), true);
  assert.equal(richtig("color", ["colour"]), true);
  assert.equal(richtig("colour", ["color"]), true);
  assert.equal(richtig("centr", ["centre"]), false);
  assert.equal(richtig("theatr", ["theatre"]), false);
  // Notenschutz LRS und deutsche Antworten behalten die frühere Nachsicht
  assert.equal(richtig("coas", ["coast"], true), true);
  assert.equal(richtig("clen", ["clean"], true), true);
  assert.equal(checkAnswer("Stadteil", ["Stadtteil"], false, { direction: "en-de" }).correct, true);
  // für die KI-Zweitmeinung: genau ein Buchstabe neben einer Lösung?
  assert.equal(einBuchstabeDaneben("cost", ["coast"]), true);
  assert.equal(einBuchstabeDaneben("color", ["colour"]), true);
  assert.equal(einBuchstabeDaneben("shore", ["coast"]), false);
  assert.equal(einBuchstabeDaneben("coast", ["coast"]), false);
});

test("Mehr geschrieben als gefragt: richtige Zusätze kosten den Punkt nicht (seit 09.10.2026)", () => {
  // der Anlass: „fahren (mit dem Auto)“, Lösung nur die Grundform, das Kind schreibt die Vergangenheit dazu
  const drive = ["to drive; drive"];
  assert.deepEqual(checkAnswer("to drive / drove", drive), { correct: true, typo: false, matched: "to drive", zusatz: ["drove"] });
  for (const antwort of ["drive, drove, driven", "to drive - drove - driven", "drive-drove-driven", "drive drove driven", "to drive drove driven",
    "drive (drove, driven)", "drive/drove", "drive; drives", "drive or driving", "drove / drive", "Drive, Drove, Driven"]) {
    assert.equal(richtig(antwort, drive), true, antwort);
  }
  // falscher Zusatz, andere Vokabel, Grundform fehlt: zählt hier nicht (darüber urteilt die KI – und soll ablehnen)
  for (const antwort of ["drive / drived", "drive, drove, drived", "drive / ride", "drive / car", "drove / driven", "drove", "drive a", "drive /"]) {
    assert.equal(richtig(antwort, drive), antwort === "drive /", antwort);
  }
  // Wendungen: genau ein Wort in anderer Form
  assert.equal(richtig("to drive off / drove off", ["to drive off"]), true);
  assert.equal(richtig("drive off drove off driven off", ["to drive off"]), true);
  assert.equal(richtig("drive off / drove away", ["to drive off"]), false);
  // Mehrzahl, regelmäßige Formen, unregelmäßige Steigerung
  assert.equal(richtig("child / children", ["child"]), true);
  assert.equal(richtig("children (child)", ["children"]), true);
  assert.equal(richtig("child, childs", ["child"]), false);
  assert.equal(richtig("city, cities", ["city"]), true);
  assert.equal(richtig("factory - factories", ["factory"]), true);
  assert.equal(richtig("play / played / played", ["to play; play"]), true);
  assert.equal(richtig("stop, stopped, stopped", ["to stop; stop"]), true);
  assert.equal(richtig("stop, stoped", ["to stop; stop"]), false);
  assert.equal(richtig("good, better, best", ["good"]), true);
  assert.equal(richtig("go / went / gone", ["to go; go"]), true);
  assert.equal(richtig("go / goed", ["to go; go"]), false);
  // zwei zugelassene Lösungen nebeneinander
  assert.equal(richtig("capital / capital city", ["capital; capital city"]), true);
  assert.equal(richtig("big, large", ["big; large"]), true);
  assert.equal(richtig("big / small", ["big; large"]), false);
  assert.equal(checkAnswer("Bezirk / Stadtteil", ["Bezirk; Stadtteil"], false, { direction: "en-de" }).correct, true);
  assert.equal(richtig("park / parks", ["park"]), true);
  assert.equal(checkAnswer("Park / Parks", ["Park"], false, { direction: "en-de" }).correct, false, "Formen nur bei englischen Antworten");
  // die übrigen Regeln gelten in jedem Teil weiter
  assert.equal(richtig("clean / clear", ["clean"]), false, "anderes Wort");
  assert.equal(richtig("quiet / quite", ["quiet"]), false);
  assert.equal(richtig("north-west", ["north"]), false, "Bindestrich trennt nur, wenn jeder Teil stimmt");
  assert.deepEqual(checkAnswer("the British Isles / british isles", ["the British Isles; British Isles"]).gross, ["British", "Isles"]);
  assert.equal(checkAnswer("enviroment / environments", ["environment"]).typo, true, "Tippfehler in einem langen Wort bleibt vermerkt");
  assert.equal(richtig("driv / drove", drive), false);
  assert.equal(richtig("driv / drove", drive, true), true, "Notenschutz LRS");
  // unverändert: Wo die Lösung selbst drei Formen nennt, bleiben alle drei Pflicht
  assert.equal(richtig("drive / drove", ["drive, drove, driven"]), false);
});

test("Alle hinterlegten Lösungen der Vokabeltests zählen weiterhin als richtig", () => {
  let n = 0;
  for (const t of Object.values(TESTS)) {
    for (const it of t.items) {
      for (const sol of it.solutions) {
        for (const teil of String(sol).split(";").map((s) => s.trim()).filter(Boolean)) {
          n++;
          assert.equal(richtig(teil, it.solutions), true, t.id + ": „" + teil + "“ für „" + it.prompt + "“");
        }
      }
    }
  }
  assert.ok(n > 400);
});
