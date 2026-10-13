"use strict";

/**
 * Tests der Scratch-Prüfprogramme von Informatik 9 (inf9-scratch-aufgaben.js).
 *  1. Immer: kleine, im Test selbst gebaute project.json-Objekte.
 *  2. Wenn der Ordner mit den echten Projekten da ist (.codex-build/informatik9-werkzeug/scratch, im Editor gebaut und
 *     gestartet): jede Musterlösung besteht alle Punkte, jede Gegenprobe und das Startprojekt fallen mit dem erwarteten
 *     Punkt durch. Auf dem Server (ohne diesen Ordner) werden diese Tests übersprungen.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { scratchProjekt, AUFGABEN } = require("./inf9-scratch-aufgaben");
const { zipLesen } = require("./excelpruefung");

/* ---------- kleine Projekte selbst bauen ---------- */
// Block: b("looks_say", { MESSAGE: "Hi" }) · Felder f: {VARIABLE: "x"} · Innenleben sub: [[Blöcke], [Blöcke]] · Name m: "springe"
const b = (op, ein, extra) => Object.assign({ op, ein: ein || {} }, extra || {});
const v = (name) => ({ var: name });
const r = (op, ein, f) => ({ rep: op, ein: ein || {}, f: f || {} });
function bauen(figuren) {
  const targets = [{ isStage: true, name: "Stage", variables: {}, blocks: {} }];
  let zaehler = 0;
  for (const fig of figuren) {
    const blocks = {}, variables = {};
    (fig.variablen || []).forEach((n, i) => { variables["v" + i] = [n, 0]; });
    const neu = () => "b" + (++zaehler);
    const eingang = (w) => {
      if (w && typeof w === "object" && w.var) return [3, [12, w.var, "id" + w.var], [10, ""]];
      if (w && typeof w === "object" && w.rep) { const id = neu(); blocks[id] = { opcode: w.rep, next: null, inputs: Object.fromEntries(Object.entries(w.ein).map(([k, x]) => [k, eingang(x)])), fields: w.f || {}, shadow: false, topLevel: false }; return [3, id, [10, ""]]; }
      return [1, [10, String(w)]];
    };
    const kette = (liste, topLevel) => {
      let erste = null, vorher = null;
      for (const blk of liste) {
        const id = neu(), inputs = {}, fields = {};
        for (const [k, w] of Object.entries(blk.ein)) inputs[k] = eingang(w);
        for (const [k, w] of Object.entries(blk.f || {})) fields[k] = [w, null];
        (blk.sub || []).forEach((inneres, i) => { const ersterInnen = kette(inneres, false); if (ersterInnen) { inputs[i ? "SUBSTACK2" : "SUBSTACK"] = [2, ersterInnen]; blocks[ersterInnen].parent = id; } });
        blocks[id] = { opcode: blk.op, next: null, parent: vorher, inputs, fields, shadow: false, topLevel: topLevel && !vorher };
        if (blk.m !== undefined) blocks[id].mutation = { tagName: "mutation", children: [], proccode: blk.m };
        if (blk.op === "procedures_definition") { const p = neu(); blocks[p] = { opcode: "procedures_prototype", next: null, parent: id, inputs: {}, fields: {}, shadow: true, topLevel: false, mutation: { tagName: "mutation", children: [], proccode: blk.m } }; blocks[id].inputs.custom_block = [1, p]; delete blocks[id].mutation; }
        if (vorher) blocks[vorher].next = id; else erste = id;
        vorher = id;
      }
      return erste;
    };
    (fig.skripte || []).forEach((s) => kette(s, true));
    targets.push({ isStage: false, name: fig.name || "Sprite1", variables, blocks });
  }
  return { targets, meta: { semver: "3.0.0" } };
}
const fahne = (...bl) => [b("event_whenflagclicked"), ...bl];
const sage = (t) => b("looks_say", { MESSAGE: t });
const gehe = (n) => b("motion_movesteps", { STEPS: n });
const mal = (n, ...innen) => b("control_repeat", { TIMES: n }, { sub: [innen] });
const frage = (q) => b("sensing_askandwait", { QUESTION: q });
const antwort = r("sensing_answer");
const setze = (n, w) => b("data_setvariableto", { VALUE: w }, { f: { VARIABLE: n } });
const aendere = (n, w) => b("data_changevariableby", { VALUE: w }, { f: { VARIABLE: n } });
const fallsSonst = (bed, dann, sonst) => b("control_if_else", { CONDITION: bed }, { sub: [dann, sonst] });
const falls = (bed, dann) => b("control_if", { CONDITION: bed }, { sub: [dann] });
const bis = (bed, ...innen) => b("control_repeat_until", { CONDITION: bed }, { sub: [innen] });
const gt = (a, c) => r("operator_gt", { OPERAND1: a, OPERAND2: c });
const lt = (a, c) => r("operator_lt", { OPERAND1: a, OPERAND2: c });
const gl = (a, c) => r("operator_equals", { OPERAND1: a, OPERAND2: c });
const join = (a, c) => r("operator_join", { STRING1: a, STRING2: c });
const definiere = (name, ...innen) => [b("procedures_definition", {}, { m: name }), ...innen];
const ruf = (name) => b("procedures_call", {}, { m: name });
const pruefe = (kennung, projekt) => AUFGABEN[kennung].pruefe(scratchProjekt(projekt));
const offen = (kennung, projekt) => pruefe(kennung, projekt).filter((p) => !p.ok).length;
const ok = (kennung, projekt) => { const pk = pruefe(kennung, projekt); return pk.length > 0 && pk.every((p) => p.ok); };

/* ---------- Tests, die immer laufen ---------- */
test("acht Aufgaben mit Titel, Auftrag und Prüfprogramm", () => {
  assert.deepEqual(Object.keys(AUFGABEN), ["scratch-start-auf1", "objekte-auf1", "eingabe-ausgabe-auf1", "bedingungen-auf1", "wiederholungen-auf1", "eigene-bloecke-auf1", "fehlersuche-auf1", "scratch-projekt-auf1"]);
  for (const a of Object.values(AUFGABEN)) { assert.ok(a.titel && a.auftrag.length > 40 && typeof a.pruefe === "function"); }
});

test("leeres und kaputtes Projekt: keine Aufgabe besteht, nichts wirft", () => {
  const leer = bauen([{ skripte: [] }]);
  for (const k of Object.keys(AUFGABEN)) { const pk = pruefe(k, leer); assert.ok(pk.length >= 3); assert.ok(pk.some((p) => !p.ok), k); pk.forEach((p) => assert.equal(typeof p.text, "string")); }
  assert.throws(() => scratchProjekt("{}"), /kein_projekt/);
  assert.throws(() => scratchProjekt("keinjson"));
});

test("scratch-start: Wiederholung mit Bewegung und sage", () => {
  assert.ok(ok("scratch-start-auf1", bauen([{ skripte: [fahne(sage("Hallo!"), mal("5", gehe("10")), sage("Fertig!"))] }])));
  assert.equal(offen("scratch-start-auf1", bauen([{ skripte: [[sage("Hallo!"), mal("5", gehe("10"))]] }])), 3, "ohne Fahne");
  assert.equal(offen("scratch-start-auf1", bauen([{ skripte: [fahne(sage("Hallo!"), gehe("10"), gehe("10"))] }])), 1, "ohne Wiederholung");
  assert.equal(offen("scratch-start-auf1", bauen([{ skripte: [fahne(sage("Hallo!"), mal("1", gehe("10")))] }])), 1, "Wiederholung läuft nur einmal");
});

test("objekte: zwei Figuren mit Größe, Kostüm und gehe zu", () => {
  const eins = fahne(b("motion_gotoxy", { X: "100", Y: "50" }), b("looks_setsizeto", { SIZE: "200" }));
  const zwei = fahne(b("looks_nextcostume"));
  assert.ok(ok("objekte-auf1", bauen([{ name: "Katze", skripte: [eins] }, { name: "Ball", skripte: [zwei] }])));
  assert.equal(offen("objekte-auf1", bauen([{ name: "Katze", skripte: [[...eins, b("looks_nextcostume")]] }])), 2, "nur eine Figur");
  assert.equal(offen("objekte-auf1", bauen([{ name: "Katze", skripte: [[...eins, b("looks_nextcostume")]] }, { name: "Ball", skripte: [] }])), 1, "zweite Figur ohne Skript");
  assert.equal(offen("objekte-auf1", bauen([{ name: "Katze", skripte: [fahne(b("motion_gotoxy", { X: "1", Y: "1" }), b("looks_setsizeto", { SIZE: "100" }))] }, { name: "Ball", skripte: [zwei] }])), 1, "Größe bleibt 100");
});

test("eingabe-ausgabe: zwei Variablen, jede gleich nach ihrer Frage", () => {
  const satz = sage(join(join(v("name"), " ist "), join(v("alter"), " Jahre")));
  const gut = fahne(frage("Name?"), setze("name", antwort), frage("Alter?"), setze("alter", antwort), satz);
  assert.ok(ok("eingabe-ausgabe-auf1", bauen([{ variablen: ["name", "alter"], skripte: [gut] }])));
  const erst = fahne(frage("Name?"), frage("Alter?"), setze("name", antwort), setze("alter", antwort), satz);
  const pk = pruefe("eingabe-ausgabe-auf1", bauen([{ variablen: ["name", "alter"], skripte: [erst] }]));
  assert.deepEqual(pk.map((p) => p.ok), [true, true, true, false, true]);
  const nie = fahne(frage("Name?"), frage("Alter?"), satz);
  assert.equal(offen("eingabe-ausgabe-auf1", bauen([{ variablen: ["name", "alter"], skripte: [nie] }])), 2, "nie gesetzt");
  const ohneJoin = fahne(frage("Name?"), setze("name", antwort), frage("Alter?"), setze("alter", antwort), sage(v("name")));
  assert.equal(offen("eingabe-ausgabe-auf1", bauen([{ variablen: ["name", "alter"], skripte: [ohneJoin] }])), 1, "ohne verbinde");
});

test("bedingungen: falls-sonst und die Grenze bei 12", () => {
  const kino = (bed, dann, sonst) => bauen([{ skripte: [fahne(frage("Alter?"), fallsSonst(bed, [sage(dann)], [sage(sonst)]))] }]);
  assert.ok(ok("bedingungen-auf1", kino(gt(antwort, "11"), "Viel Spaß im Film!", "Du bist leider zu jung.")));
  assert.ok(ok("bedingungen-auf1", kino(lt(antwort, "12"), "Du bist leider zu jung.", "Viel Spaß im Film!")), "Zweige getauscht");
  assert.ok(ok("bedingungen-auf1", kino(r("operator_not", { OPERAND: lt(antwort, "12") }), "Viel Spaß im Film!", "Du bist leider zu jung.")), "nicht <");
  assert.equal(offen("bedingungen-auf1", kino(gt(antwort, "12"), "Viel Spaß im Film!", "Du bist leider zu jung.")), 1, "ab 13");
  assert.equal(offen("bedingungen-auf1", kino(gl(antwort, "12"), "Viel Spaß im Film!", "Du bist leider zu jung.")), 1, "nur genau 12");
  assert.equal(offen("bedingungen-auf1", kino(gt(antwort, "11"), "Du bist leider zu jung.", "Viel Spaß im Film!")), 1, "Sätze vertauscht");
  const ohneSonst = bauen([{ skripte: [fahne(frage("Alter?"), falls(gt(antwort, "11"), [sage("Viel Spaß im Film!")]), sage("Du bist leider zu jung."))] }]);
  assert.equal(offen("bedingungen-auf1", ohneSonst), 2, "falls ohne sonst");
  const gleich = bauen([{ skripte: [fahne(frage("Alter?"), fallsSonst(gt(antwort, "11"), [sage("Ja")], [sage("Ja")]))] }]);
  assert.ok(offen("bedingungen-auf1", gleich) >= 2, "beide Zweige gleich");
});

test("wiederholungen: wiederhole bis, Frage und falls darin, Variable für die Geheimzahl", () => {
  const hinweis = fallsSonst(gt(antwort, v("geheimzahl")), [sage("Zu groß!")], [sage("Zu klein!")]);
  const gut = fahne(setze("geheimzahl", r("operator_random", { FROM: "1", TO: "10" })), frage("Rate"), bis(gl(antwort, v("geheimzahl")), hinweis, frage("Noch einmal")), sage("Richtig!"));
  assert.ok(ok("wiederholungen-auf1", bauen([{ variablen: ["geheimzahl"], skripte: [gut] }])));
  const draussen = fahne(setze("geheimzahl", "5"), frage("Rate"), bis(gl(antwort, v("geheimzahl")), hinweis), sage("Richtig!"));
  assert.deepEqual(pruefe("wiederholungen-auf1", bauen([{ variablen: ["geheimzahl"], skripte: [draussen] }])).map((p) => p.ok), [true, true, false, true, true]);
  const fest = fahne(frage("Rate"), bis(gl(antwort, "5"), fallsSonst(gt(antwort, "5"), [sage("Zu groß!")], [sage("Zu klein!")]), frage("Noch einmal")), sage("Richtig!"));
  assert.equal(offen("wiederholungen-auf1", bauen([{ skripte: [fest] }])), 1, "feste Zahl");
  const nurMal = fahne(setze("geheimzahl", "5"), frage("Rate"), mal("10", hinweis, frage("Noch einmal")), sage("Richtig!"));
  assert.equal(offen("wiederholungen-auf1", bauen([{ variablen: ["geheimzahl"], skripte: [nurMal] }])), 1, "wiederhole 10 mal");
});

test("eigene Blöcke: Definiere mit zwei Blöcken, mindestens zwei Aufrufe unter der Fahne", () => {
  const def = definiere("springe", b("motion_changeyby", { DY: "50" }), b("control_wait", { DURATION: "0.2" }), b("motion_changeyby", { DY: "-50" }));
  const gut = bauen([{ skripte: [def, fahne(ruf("springe"), gehe("50"), ruf("springe"), gehe("50"), ruf("springe"))] }]);
  assert.ok(ok("eigene-bloecke-auf1", gut));
  assert.equal(offen("eigene-bloecke-auf1", bauen([{ skripte: [def, fahne(gehe("50"), gehe("50"))] }])), 1, "nie aufgerufen");
  assert.equal(offen("eigene-bloecke-auf1", bauen([{ skripte: [def, fahne(ruf("springe"), gehe("50"))] }])), 1, "nur einmal");
  assert.equal(offen("eigene-bloecke-auf1", bauen([{ skripte: [definiere("springe", b("motion_changeyby", { DY: "50" })), fahne(ruf("springe"), ruf("springe"))] }])), 1, "Definition mit einem Block");
  assert.equal(offen("eigene-bloecke-auf1", bauen([{ skripte: [def, fahne(ruf("hüpfe"), ruf("hüpfe"))] }])), 1, "Aufruf eines anderen Namens");
  assert.equal(offen("eigene-bloecke-auf1", bauen([{ skripte: [def, [ruf("springe"), ruf("springe")]] }])), 2, "Aufrufe lose, nicht unter der Fahne");
  assert.equal(offen("eigene-bloecke-auf1", bauen([{ skripte: [fahne(gehe("50"))] }])), 2, "kein eigener Block");
  const x = scratchProjekt(gut);
  assert.match(x.text(), /Definiere springe/);
  assert.equal(x.alle.filter((k) => k.op === "procedures_call").length, 3);
});

test("fehlersuche: die drei Fehler einzeln erkennen", () => {
  const summe = r("operator_add", { NUM1: v("zahl1"), NUM2: v("zahl2") });
  const rueck = (bed, mehr) => fallsSonst(bed, [sage("Richtig!"), ...(mehr || [])], [sage("Leider falsch.")]);
  const runde = (bed, mehr, vorn) => mal("3", ...(vorn || []), setze("zahl1", "3"), setze("zahl2", "4"), frage(join(v("zahl1"), v("zahl2"))), rueck(bed, mehr));
  const ende = sage(join("Punkte: ", v("Punkte")));
  const vars = ["Punkte", "zahl1", "zahl2"];
  const fix = bauen([{ variablen: vars, skripte: [fahne(setze("Punkte", "0"), runde(gl(antwort, summe), [aendere("Punkte", "1")]), ende)] }]);
  assert.ok(ok("fehlersuche-auf1", fix));
  const start = bauen([{ variablen: vars, skripte: [fahne(mal("3", setze("Punkte", "0"), setze("zahl1", "3"), setze("zahl2", "4"), frage(join(v("zahl1"), v("zahl2"))), rueck(gt(antwort, summe))), aendere("Punkte", "1"), ende)] }]);
  assert.deepEqual(pruefe("fehlersuche-auf1", start).map((p) => p.ok), [true, false, false, false]);
  const nurZaehler = bauen([{ variablen: vars, skripte: [fahne(runde(gl(antwort, summe), [aendere("Punkte", "1")], [setze("Punkte", "0")]), ende)] }]);
  assert.deepEqual(pruefe("fehlersuche-auf1", nurZaehler).map((p) => p.ok), [true, false, true, true]);
  const nurVergleich = bauen([{ variablen: vars, skripte: [fahne(setze("Punkte", "0"), runde(gt(antwort, summe), [aendere("Punkte", "1")]), ende)] }]);
  assert.deepEqual(pruefe("fehlersuche-auf1", nurVergleich).map((p) => p.ok), [true, true, false, true]);
  const nurAussen = bauen([{ variablen: vars, skripte: [fahne(setze("Punkte", "0"), runde(gl(antwort, summe)), aendere("Punkte", "1"), ende)] }]);
  assert.deepEqual(pruefe("fehlersuche-auf1", nurAussen).map((p) => p.ok), [true, true, true, false]);
  const imSchleifeAberNichtImDann = bauen([{ variablen: vars, skripte: [fahne(setze("Punkte", "0"), mal("3", frage("?"), rueck(gl(antwort, summe)), aendere("Punkte", "1")), ende)] }]);
  const pk = pruefe("fehlersuche-auf1", imSchleifeAberNichtImDann);
  assert.equal(pk[3].ok, false);
  assert.match(pk[3].text, /dann/);
});

test("scratch-projekt: sechs Pflichtteile, eigener Block nur als Zusatz", () => {
  const quiz = (extra) => fahne(setze("Punkte", "0"), mal("3", frage("2 mal 3?"), fallsSonst(gl(antwort, "6"), [sage("Richtig!"), aendere("Punkte", "1")], [sage("Falsch.")])), ...(extra || []));
  const projekt = bauen([{ variablen: ["Punkte"], skripte: [quiz()] }]);
  const pk = pruefe("scratch-projekt-auf1", projekt);
  assert.equal(pk.length, 7);
  assert.ok(pk.every((p) => p.ok));
  assert.match(pk[6].text, /Zusatz \(freiwillig\)/);
  assert.equal(pk[6].zusatz, true);
  const mitBlock = bauen([{ variablen: ["Punkte"], skripte: [definiere("zeige", sage(v("Punkte"))), fahne(...quiz().slice(1), ruf("zeige"))] }]);
  assert.match(pruefe("scratch-projekt-auf1", mitBlock)[6].text, /Zusatz geschafft/);
  assert.equal(offen("scratch-projekt-auf1", bauen([{ variablen: ["Punkte"], skripte: [quiz().map((k) => k)].map((s) => s.slice(1)) }])), 6, "ohne Fahne");
  assert.equal(offen("scratch-projekt-auf1", bauen([{ variablen: ["Punkte"], skripte: [fahne(frage("?"), sage("Hi"), falls(gl(antwort, "1"), [sage("Ja")]), mal("2", gehe("1")))] }])), 1, "keine Variable");
  assert.equal(offen("scratch-projekt-auf1", bauen([{ variablen: ["Punkte"], skripte: [fahne(setze("Punkte", "0"), frage("?"), sage("Hi"), falls(gl(antwort, "1"), [aendere("Punkte", "1")]))] }])), 1, "keine Wiederholung");
});

test("lose Blöcke neben der Fahne zählen nicht; andere Starts nur im freien Projekt", () => {
  const x = bauen([{ variablen: ["Punkte"], skripte: [fahne(sage("Hi")), [mal("5", gehe("1"))]] }]);
  assert.equal(offen("scratch-start-auf1", x), 1, "loses wiederhole zählt nicht");
  const taste = [b("event_whenkeypressed", {}, { f: { KEY_OPTION: "space" } }), frage("?"), sage("Hi"), setze("Punkte", "1"), falls(gl(antwort, "1"), [sage("Ja")]), mal("2", gehe("1"))];
  const pk = pruefe("scratch-projekt-auf1", bauen([{ variablen: ["Punkte"], skripte: [fahne(gehe("1")), taste] }]));
  assert.equal(pk.filter((p) => !p.ok).length, 0, "Start mit Taste zählt im freien Projekt");
});

test("Projekt mit Kreisbezug und fehlenden Blöcken bringt nichts zum Absturz", () => {
  const p = { targets: [{ isStage: false, name: "S", variables: {}, blocks: { a: { opcode: "event_whenflagclicked", next: "b", topLevel: true, inputs: {}, fields: {} }, b: { opcode: "control_repeat", next: "a", topLevel: false, inputs: { SUBSTACK: [2, "b"], TIMES: [1, [4, "5"]] }, fields: {} }, c: { opcode: "procedures_call", next: "zz", topLevel: true, inputs: {}, fields: {} } } }] };
  for (const k of Object.keys(AUFGABEN)) assert.doesNotThrow(() => pruefe(k, p));
});

/* ---------- Tests mit den echten Projekten (nur wenn der Ordner da ist) ---------- */
const WERKZEUG = path.resolve(__dirname, "..", "..", "..", "informatik9-werkzeug", "scratch");
const faelleDatei = path.join(WERKZEUG, "faelle9.json");
const vorhanden = fs.existsSync(faelleDatei);
const FAELLE = vorhanden ? JSON.parse(fs.readFileSync(faelleDatei, "utf8")) : [];
const dateien = FAELLE.filter(([, d]) => !fs.existsSync(path.join(WERKZEUG, d)));

test("echte Projekte aus dem Scratch-Editor: alle Dateien sind da", { skip: !vorhanden && "Ordner informatik9-werkzeug/scratch fehlt" }, () => {
  assert.deepEqual(dateien.map((f) => f[1]), []);
  assert.ok(FAELLE.length >= 35);
});
for (const [aufgabe, datei, soll, text, erwartetOffen] of FAELLE) {
  test(`echt: ${aufgabe} · ${datei} – ${text}`, { skip: !fs.existsSync(path.join(WERKZEUG, datei)) && "Datei fehlt" }, () => {
    const x = scratchProjekt(zipLesen(fs.readFileSync(path.join(WERKZEUG, datei))).text("project.json"));
    const pk = AUFGABEN[aufgabe].pruefe(x);
    const besteht = pk.length > 0 && pk.every((p) => p.ok);
    assert.equal(besteht, soll, pk.filter((p) => !p.ok).map((p) => p.text).join(" / "));
    if (erwartetOffen != null) assert.equal(pk.filter((p) => !p.ok).length, erwartetOffen, pk.map((p) => (p.ok ? "✓ " : "✗ ") + p.text).join("\n"));
  });
}
