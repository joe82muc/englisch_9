"use strict";

// Scratch-Aufträge (Informatik 8): Projekt lesen, Punkte exakt prüfen, KI schreibt nur die Rückmeldung.
// Die Projekte werden hier so gebaut, wie Scratch sie in project.json speichert (Blöcke mit Kennungen, Werte als
// [Art, Inhalt, Schatten], Variablen als [12, Name, Kennung]). Mit Projekten aus dem echten Editor wird zusätzlich
// lokal geprüft – Musterlösungen liegen in keinem Repo.
const assert = require("node:assert/strict");
const test = require("node:test");
const express = require("express");
const { zip } = require("./xlsx-mini");
const { registerScratchPruefung } = require("./scratchpruefung");
const { scratchProjekt, AUFGABEN } = require("./inf8-scratch-aufgaben");

/* ---------- Projekt bauen ---------- */
// Block: [opcode, { EINGANG: wert }, { FELD: text }, [innen], [innen2]]   wert: "Text" | Zahl | Block | { v: "variable" }
function projekt(skripte, variablen = []) {
  const blocks = {}; let nr = 0;
  const neu = () => "b" + (++nr);
  const eingang = (w, elternId) => {
    if (Array.isArray(w)) return [3, block(w, elternId), [10, ""]];
    if (w && typeof w === "object") return [3, [12, w.v, "var_" + w.v], [10, ""]];
    return [1, [typeof w === "number" ? 4 : 10, String(w)]];
  };
  function block(b, elternId) {
    const [opcode, ein = {}, feld = {}, innen, innen2] = b, id = neu();
    blocks[id] = { opcode, next: null, parent: elternId || null, inputs: {}, fields: {}, shadow: false, topLevel: false };
    for (const n of Object.keys(ein)) blocks[id].inputs[n] = n === "CONDITION" ? [2, block(ein[n], id)] : eingang(ein[n], id);
    for (const n of Object.keys(feld)) blocks[id].fields[n] = [feld[n], "var_" + feld[n]];
    if (innen) { const erste = kette(innen, id); if (erste) blocks[id].inputs.SUBSTACK = [2, erste]; }
    if (innen2) { const erste = kette(innen2, id); if (erste) blocks[id].inputs.SUBSTACK2 = [2, erste]; }
    return id;
  }
  function kette(liste, elternId) {
    let erste = null, vorher = null;
    for (const b of liste) { const id = block(b, vorher || elternId); if (vorher) blocks[vorher].next = id; else erste = id; vorher = id; }
    return erste;
  }
  for (const s of skripte) { const erste = kette(s, null); if (erste) Object.assign(blocks[erste], { topLevel: true, x: 40, y: 40 }); }
  const vars = {}; variablen.forEach((n) => { vars["var_" + n] = [n, 0]; });
  return JSON.stringify({ targets: [{ isStage: true, name: "Stage", variables: Object.assign({ "var_mv": ["meine Variable", 0] }, vars), blocks: {} }, { isStage: false, name: "Sprite1", variables: {}, blocks }], meta: { semver: "3.0.0" } });
}
const FAHNE = ["event_whenflagclicked"], ANTWORT = ["sensing_answer"];
const sage = (w, sek = 2) => ["looks_sayforsecs", { MESSAGE: w, SECS: sek }];
const frage = (t) => ["sensing_askandwait", { QUESTION: t }];
const setze = (n, w) => ["data_setvariableto", { VALUE: w }, { VARIABLE: n }];
const aendere = (n, w) => ["data_changevariableby", { VALUE: w }, { VARIABLE: n }];
const verbinde = (a, b) => ["operator_join", { STRING1: a, STRING2: b }];
const gleich = (a, b) => ["operator_equals", { OPERAND1: a, OPERAND2: b }], groesser = (a, b) => ["operator_gt", { OPERAND1: a, OPERAND2: b }], kleiner = (a, b) => ["operator_lt", { OPERAND1: a, OPERAND2: b }];
const fallsSonst = (bed, dann, sonst) => ["control_if_else", { CONDITION: bed }, {}, dann, sonst];
const bis = (bed, innen) => ["control_repeat_until", { CONDITION: bed }, {}, innen];
const V = (v) => ({ v });

const START = projekt([[FAHNE, sage("Hallo!"), ["motion_movesteps", { STEPS: 100 }], sage("Ich bin angekommen.")]]);
const OBJEKTE = projekt([[FAHNE, ["motion_gotoxy", { X: -150, Y: 50 }], ["looks_setsizeto", { SIZE: 50 }], ["motion_pointindirection", { DIRECTION: 180 }]]]);
const EINGABE = projekt([[FAHNE, frage("Wie heißt du?"), sage(ANTWORT)]]);
const AUSGABE = projekt([[FAHNE, frage("Wie heißt du?"), sage(verbinde("Hallo ", ANTWORT))]]);
const VARIABLEN = projekt([[FAHNE, frage("Wie heißt du?"), setze("name", ANTWORT), frage("Wie alt bist du?"), setze("alter", ANTWORT), sage(verbinde("Hallo ", V("name"))), sage(verbinde("Nächstes Jahr bist du ", ["operator_add", { NUM1: V("alter"), NUM2: 1 }]))]], ["name", "alter"]);
const QUIZ = [FAHNE, frage("Wie viele Tage hat eine Woche?"), fallsSonst(gleich(ANTWORT, "7"), [sage("Richtig!")], [sage("Leider falsch.")])];
const VERZWEIGUNG = projekt([QUIZ]);
const ALTER = projekt([[FAHNE, frage("Wie alt bist du?"), setze("alter", ANTWORT), fallsSonst(kleiner(V("alter"), "14"), [sage("Du bist noch ein Kind.")], [fallsSonst(kleiner(V("alter"), "18"), [sage("Du bist jugendlich.")], [sage("Du bist erwachsen.")])])]], ["alter"]);
const raten = (extraVor = [], extraIn = [], ende = [sage("Richtig!")]) => [FAHNE, setze("geheimzahl", ["operator_random", { FROM: 1, TO: 10 }]), ...extraVor, frage("Rate!"),
  bis(gleich(ANTWORT, V("geheimzahl")), [...extraIn, fallsSonst(groesser(ANTWORT, V("geheimzahl")), [sage("Zu groß!", 1)], [sage("Zu klein!", 1)]), frage("Rate noch einmal!")]), ...ende];
const RATEN = projekt([raten()], ["geheimzahl"]);
const ZAEHLER = projekt([raten([setze("versuche", "1")], [aendere("versuche", 1)], [sage(verbinde("Richtig! Versuche: ", V("versuche")))])], ["geheimzahl", "versuche"]);

const offen = (aufgabe, json) => AUFGABEN[aufgabe].pruefe(scratchProjekt(json)).filter((p) => !p.ok).map((p) => p.text).join(" | ");

test("Projekt lesen: Skripte, Werte-Blöcke, Variablen, Programm als Text", () => {
  const x = scratchProjekt(ALTER);
  assert.equal(x.skripte.length, 1);
  assert.deepEqual(x.variablen, ["meine Variable", "alter"]);
  assert.ok(x.hat("control_if_else") && x.hat("sensing_answer") && x.hat("data_variable") && !x.hat("operator_random"));
  assert.equal(x.text(), [
    "Wenn Fahne angeklickt wird", "frage [Wie alt bist du?] und warte", "setze alter auf (Antwort)", "falls ((alter) < [14]), dann", "  sage [Du bist noch ein Kind.] für [2] Sekunden",
    "sonst", "  falls ((alter) < [18]), dann", "    sage [Du bist jugendlich.] für [2] Sekunden", "  sonst", "    sage [Du bist erwachsen.] für [2] Sekunden"].join("\n"));
  assert.throws(() => scratchProjekt("{}"));
  assert.throws(() => scratchProjekt("kein JSON"));
});

test("Jede Aufgabe: Die Musterlösung besteht, ein fremdes Programm fällt durch", () => {
  const paare = [["scratch-start-auf1", START, OBJEKTE], ["objekte-auf1", OBJEKTE, START], ["eingabe-auf1", EINGABE, START], ["ausgabe-auf1", AUSGABE, EINGABE], ["variablen-auf1", VARIABLEN, AUSGABE],
    ["verzweigung-auf1", VERZWEIGUNG, VARIABLEN], ["verzweigung-aufM", ALTER, VERZWEIGUNG], ["zahlenraten-auf1", RATEN, VERZWEIGUNG], ["zahlenraten-aufM", ZAEHLER, RATEN], ["eigenes-projekt-auf1", ZAEHLER, AUSGABE]];
  assert.deepEqual(paare.map((p) => p[0]).sort(), Object.keys(AUFGABEN).sort(), "jede Aufgabe ist getestet");
  for (const [aufgabe, gut, fremd] of paare) {
    assert.equal(offen(aufgabe, gut), "", aufgabe + ": Musterlösung");
    assert.notEqual(offen(aufgabe, fremd), "", aufgabe + ": fremdes Programm");
  }
  assert.equal(offen("verzweigung-auf1", ALTER), "", "die verschachtelte Fassung besteht auch den ersten Auftrag");
  assert.equal(offen("zahlenraten-auf1", ZAEHLER), "", "die Fassung mit Zähler besteht auch den ersten Auftrag");
});

test("Typische Fehler werden genau benannt", () => {
  // Blöcke hängen nicht an der Fahne
  assert.match(offen("scratch-start-auf1", projekt([[sage("Hallo!"), ["motion_movesteps", { STEPS: 100 }], sage("Fertig.")]])), /braucht oben den Block „Wenn \(Fahne\) angeklickt wird“/);
  assert.match(offen("scratch-start-auf1", projekt([[FAHNE, ["motion_movesteps", { STEPS: 100 }], sage("Hallo!"), sage("Fertig.")]])), /^Die Reihenfolge soll sein/);
  assert.match(offen("objekte-auf1", projekt([[FAHNE, ["motion_gotoxy", { X: 0, Y: 0 }], ["looks_setsizeto", { SIZE: 100 }], ["motion_pointindirection", { DIRECTION: 90 }]]])), /^Die Größe steht noch auf 100/);
  assert.match(offen("eingabe-auf1", projekt([[FAHNE, sage(ANTWORT), frage("Wie heißt du?")]])), /^Der „sage“-Block mit der Antwort muss unter dem Frage-Block hängen/);
  assert.match(offen("ausgabe-auf1", projekt([[FAHNE, frage("Wie heißt du?"), sage(verbinde("Hallo", ANTWORT))]])), /^Dein Text und die Antwort kleben zusammen/);
  assert.equal(offen("ausgabe-auf1", projekt([[FAHNE, frage("Wie heißt du?"), sage(verbinde(ANTWORT, " ist ein schöner Name."))]])), "", "Antwort vorne, Text hinten");
  assert.match(offen("variablen-auf1", projekt([[FAHNE, frage("Name?"), setze("name", ANTWORT), sage(verbinde("Hallo ", V("name")))]], ["name"])), /Lege zwei eigene Variablen an/);
  assert.match(offen("verzweigung-auf1", projekt([[FAHNE, frage("Tage?"), fallsSonst(gleich(ANTWORT, "7"), [sage("Richtig!")], [])]])), /^Bei „dann“ und bei „sonst“/);
  assert.match(offen("verzweigung-auf1", projekt([[FAHNE, frage("Tage?"), fallsSonst(gleich("7", "7"), [sage("Richtig!")], [sage("Falsch.")])]])), /^In das sechseckige Feld gehört ein Vergleich/);
  const ohneNeu = [FAHNE, setze("geheimzahl", ["operator_random", { FROM: 1, TO: 10 }]), frage("Rate!"), bis(gleich(ANTWORT, V("geheimzahl")), [fallsSonst(groesser(ANTWORT, V("geheimzahl")), [sage("Zu groß!")], [sage("Zu klein!")])]), sage("Richtig!")];
  assert.match(offen("zahlenraten-auf1", projekt([ohneNeu], ["geheimzahl"])), /^Am Ende der Schleife muss die Figur noch einmal fragen/);
  assert.match(offen("zahlenraten-aufM", projekt([raten([], [aendere("versuche", 1)], [sage(verbinde("Versuche: ", V("versuche")))])], ["geheimzahl", "versuche"])), /^Vor der Schleife fehlt der Startwert/);
  assert.match(offen("eigenes-projekt-auf1", EINGABE), /Variable fehlt.*Verzweigung fehlt.*zwei verschiedene Dinge/);
});

test("Kaputte und böswillige Projekte bringen das Prüfprogramm nicht aus dem Tritt", () => {
  const kreis = JSON.stringify({ targets: [{ isStage: false, name: "S", variables: { a: "kaputt" }, blocks: {
    a: { opcode: "event_whenflagclicked", next: "b", topLevel: true }, b: { opcode: "looks_say", next: "a", inputs: { MESSAGE: [3, "c", [10, ""]] } },
    c: { opcode: "operator_join", inputs: { STRING1: [3, "c", [10, ""]], STRING2: [3, "gibtsnicht", [10, ""]] } }, lose: [12, "x", "id", 0, 0] } }] });
  const x = scratchProjekt(kreis);
  assert.equal(x.skripte.length, 1);
  assert.ok(x.text().length > 10);
  for (const a of Object.keys(AUFGABEN)) assert.ok(Array.isArray(AUFGABEN[a].pruefe(x)), a);
});

/* ---------- Route ---------- */
let antwortKi = "", gesehen = [];
async function askAnthropic(system, user) { gesehen.push({ system, user }); if (antwortKi instanceof Error) throw antwortKi; return antwortKi; }
let server, basis;
test.before(async () => {
  const app = express();
  app.use(express.json({ limit: "1mb" }));
  registerScratchPruefung(app, { askAnthropic, prefix: "/api/inf8" });
  await new Promise((r) => { server = app.listen(0, "127.0.0.1", r); });
  basis = `http://127.0.0.1:${server.address().port}`;
});
test.after(() => server && server.close());
const post = async (body) => { const r = await fetch(basis + "/api/inf8/scratch/pruefen", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); return { status: r.status, json: await r.json() }; };
const sb3 = (json) => zip([{ name: "project.json", data: json }, { name: "bild.svg", data: "<svg/>" }]).toString("base64");

test("Route: richtiges Projekt – Punkte vom Prüfprogramm, Rückmeldung von der KI, die das Programm als Text sieht", async () => {
  gesehen = []; antwortKi = '{"rueckmeldung": "Deine Figur begrüßt jedes Kind mit seinem Namen. Das Leerzeichen hinter Hallo hast du nicht vergessen."}';
  const r = await post({ aufgabe: "ausgabe-auf1", datei: sb3(AUSGABE) });
  assert.deepEqual([r.status, r.json.lesbar, r.json.erfuellt, r.json.quelle, r.json.punkte.length], [200, true, true, "ki", 5]);
  assert.match(r.json.rueckmeldung, /begrüßt jedes Kind/);
  assert.match(gesehen[0].user, /sage \(verbinde \[Hallo \] und \(Antwort\)\) für \[2\] Sekunden/);
  assert.match(gesehen[0].user, /Prüfprogramm – noch offen:\n- nichts/);
});

test("Route: Die KI kann die Punkte nicht ändern; fällt sie aus, gibt es die Punkte trotzdem", async () => {
  antwortKi = '{"rueckmeldung": "Alles prima!", "erfuellt": true}';
  let r = await post({ aufgabe: "ausgabe-auf1", datei: sb3(EINGABE) });
  assert.equal(r.json.erfuellt, false);
  assert.ok(r.json.punkte.some((p) => !p.ok));
  antwortKi = new Error("overloaded");
  r = await post({ aufgabe: "zahlenraten-auf1", datei: sb3(RATEN) });
  assert.deepEqual([r.json.erfuellt, r.json.quelle, r.json.rueckmeldung], [true, "ersatz", "Dein Programm erfüllt alle Punkte."]);
});

test("Route: unbekannte Aufgabe, keine Datei, falsche Datei", async () => {
  antwortKi = '{"rueckmeldung": "x"}'; gesehen = [];
  assert.equal((await post({ aufgabe: "gibt-es-nicht", datei: sb3(START) })).status, 404);
  assert.equal((await post({ aufgabe: "constructor", datei: sb3(START) })).status, 404);
  assert.equal((await post({ aufgabe: "eingabe-auf1" })).status, 400);
  let r = await post({ aufgabe: "eingabe-auf1", datei: Buffer.from("kein Projekt").toString("base64") });
  assert.deepEqual([r.json.lesbar, r.json.erfuellt, r.json.quelle], [false, false, "pruefprogramm"]);
  assert.match(r.json.rueckmeldung, /kein Scratch-Projekt/);
  r = await post({ aufgabe: "eingabe-auf1", datei: zip([{ name: "xl/workbook.xml", data: "<x/>" }]).toString("base64") });
  assert.equal(r.json.lesbar, false, "eine Excel-Datei ist kein Scratch-Projekt");
  assert.equal(gesehen.length, 0, "ohne lesbares Projekt wird die KI nicht gefragt");
});
