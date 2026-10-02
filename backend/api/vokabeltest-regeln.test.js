"use strict";

// Vokabeltest: Großschreibung englischer Eigennamen und unregelmäßige Verben mit drei Formen
const assert = require("node:assert/strict");
const test = require("node:test");
const { checkAnswer, verbFormen } = require("./vokabeltest");
const { TESTS } = require("./vokabeltest-daten");

const richtig = (antwort, loesungen, lrs) => checkAnswer(antwort, loesungen, lrs).correct;

test("Eigennamen müssen großgeschrieben sein", () => {
  assert.equal(richtig("France", ["France"]), true);
  const r = checkAnswer("france", ["France"]);
  assert.equal(r.correct, false);
  assert.deepEqual(r.gross, ["France"]);
  assert.equal(richtig("frence", ["France"]), false, "Tippfehler und klein");
  assert.equal(richtig("Frence", ["France"]), true, "nur Tippfehler zählt weiter");
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
  assert.equal(checkAnswer("drive, drove, drivn", drive).typo, true, "kleiner Tippfehler zählt als Tippfehler");
  const be = ["be, was/were, been"];
  assert.equal(richtig("be, was, been", be), true);
  assert.equal(richtig("be, was, were, been", be), true);
  assert.equal(richtig("be were been", be), true);
  assert.equal(richtig("be, been", be), false);
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
