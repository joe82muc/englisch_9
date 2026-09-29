"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const express = require("express");
const { registerArgumentation7Routes, requireStudent, requireTeacher, TOPICS } = require("./argumentation7");
const { registerDeutsch7ModuleRoutes } = require("./deutsch7-module");
const { registerDeutsch7TischDuellRoutes } = require("./deutsch7-tischduell");

let server;
let baseUrl;
let clock = Date.now();
let aiMode = "ok";
const prompts = [];

test.before(async () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "de7-tisch-"));
  const app = express();
  app.use(express.json());
  // Die Test-KI entscheidet nach Schlüsselwörtern im Beitrag.
  const askAnthropic = async (system, user) => {
    prompts.push(user);
    if (aiMode === "down") throw new Error("offline");
    const { beitrag, typ } = JSON.parse(user);
    return JSON.stringify({
      passtZumThema: !beitrag.includes("PIZZA"),
      sachlich: !beitrag.includes("IDIOT"),
      begruendet: /weil|denn|da /.test(beitrag),
      beispiel: beitrag.includes("zum Beispiel"),
      eingehen: typ === "antwort" && beitrag.includes("zwar"),
      ueberzeugend: typ === "argument" && beitrag.includes("wichtig"),
      rueckmeldung: "Gut gemacht.",
      tipp: beitrag.includes("PIZZA") ? "Bleib beim Thema." : ""
    });
  };
  const common = {
    askAnthropic,
    requireStudent: (req, res) => requireStudent(req, res, "test-secret"),
    requireTeacher: (req, res) => requireTeacher(req, res, "2")
  };
  registerArgumentation7Routes(app, { dataDir, teacherPassword: "2", hashSecret: "test-secret", askAnthropic });
  const de7 = registerDeutsch7ModuleRoutes(app, { dataDir, ...common });
  registerDeutsch7TischDuellRoutes(app, { ...common, topics: TOPICS, storeEntry: de7.store, now: () => clock });
  await new Promise((resolve) => { server = app.listen(0, resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(() => server && server.close());

async function post(route, body = {}, token = "") {
  const res = await fetch(baseUrl + route, {
    method: "POST",
    headers: { "content-type": "application/json", ...(token ? { authorization: "Bearer " + token } : {}) },
    body: JSON.stringify(body)
  });
  return { status: res.status, data: await res.json() };
}

async function login(firstName, className = "7M") {
  const res = await post("/api/de7-argument/start", { firstName, lastName: "Test", className });
  return res.data.token;
}

async function beitrag(token, text) {
  return post("/api/de7-argument/tisch/beitrag", { text }, token);
}

test("Zwei Schüler pro Tisch: der dritte wird abgewiesen, andere Klasse hat eigene Tische", async () => {
  const mia = await login("Mia"), tim = await login("Tim"), ali = await login("Ali"), rana = await login("Rana", "7R");

  const a = await post("/api/de7-argument/tisch/join", { tisch: 3 }, mia);
  assert.equal(a.status, 200);
  assert.equal(a.data.status, "warten");
  assert.equal(a.data.partner, null);

  const b = await post("/api/de7-argument/tisch/join", { tisch: 3 }, tim);
  assert.equal(b.data.status, "thema");
  assert.equal(b.data.partner.firstName, "Mia");
  assert.ok(b.data.themen.some((t) => t.id === "handys"));
  assert.ok(b.data.themen.some((t) => t.id === "fahrradtour"));

  const c = await post("/api/de7-argument/tisch/join", { tisch: 3 }, ali);
  assert.equal(c.status, 409);
  assert.match(c.data.error, /Mia und Tim/);

  // 7R hat an Tisch 3 einen eigenen Tisch
  const d = await post("/api/de7-argument/tisch/join", { tisch: 3 }, rana);
  assert.equal(d.status, 200);
  assert.equal(d.data.status, "warten");

  assert.equal((await post("/api/de7-argument/tisch/join", { tisch: 99 }, ali)).status, 400);
  assert.equal((await post("/api/de7-argument/tisch/join", { tisch: 3 })).status, 401);
});

test("Duell: Thema wählen, Seiten auslosen, abwechselnd schreiben, KI lässt nur passende Beiträge durch", async () => {
  const lea = await login("Lea"), ben = await login("Ben");
  await post("/api/de7-argument/tisch/join", { tisch: 5 }, lea);
  await post("/api/de7-argument/tisch/join", { tisch: 5 }, ben);

  const t = await post("/api/de7-argument/tisch/thema", { thema: "handys" }, lea);
  assert.equal(t.data.status, "laeuft");
  assert.deepEqual([t.data.seiten.ich, t.data.seiten.partner].sort(), ["dafür", "dagegen"]);

  // Wer „dafür“ ist, beginnt.
  const leaIstDafuer = t.data.seiten.ich === "dafür";
  const erst = leaIstDafuer ? lea : ben, zweit = leaIstDafuer ? ben : lea;
  assert.equal((await post("/api/de7-argument/tisch/state", {}, erst)).data.amZug, "ich");

  // Der andere darf nicht schreiben
  assert.equal((await beitrag(zweit, "Ich bin dagegen, weil man abgelenkt ist.")).status, 409);

  // Themenfremd: kommt zurück, der Partner sieht nichts
  const pizza = await beitrag(erst, "Ich mag PIZZA, weil sie lecker ist.");
  assert.equal(pizza.data.ergebnis.angenommen, false);
  assert.equal(pizza.data.hinweis.tipp, "Bleib beim Thema.");
  const sichtPartner = (await post("/api/de7-argument/tisch/state", {}, zweit)).data;
  assert.equal(sichtPartner.beitraege.length, 0);
  assert.equal(sichtPartner.partnerUeberarbeitet, true);

  // Unsachlich: kommt ebenfalls zurück
  assert.equal((await beitrag(erst, "Du IDIOT, Handys sind gut, weil man chatten kann.")).data.ergebnis.angenommen, false);

  // Passend: wird gesendet, 1 + Beispiel + überzeugend = 3 Sterne
  const gut = await beitrag(erst, "Handys sind wichtig, weil man sich verabreden kann, zum Beispiel für den Heimweg.");
  assert.equal(gut.data.ergebnis.angenommen, true);
  assert.equal(gut.data.ergebnis.sterne, 3);
  assert.equal(gut.data.amZug, "partner");
  const beiPartner = (await post("/api/de7-argument/tisch/state", {}, zweit)).data;
  assert.equal(beiPartner.beitraege.length, 1);
  assert.equal(beiPartner.beitraege[0].von, "partner");
  assert.equal(beiPartner.amZug, "ich");
  assert.equal(beiPartner.typ, "antwort");
  assert.equal(beiPartner.punkte.partner, 3);

  // Die KI bekommt keine Namen, aber das Argument, auf das geantwortet wird
  const antwort = await beitrag(zweit, "Das stimmt zwar, aber ohne Handy redet man mehr, weil keiner auf den Bildschirm schaut.");
  assert.equal(antwort.data.ergebnis.sterne, 2); // Begründung + eingehen
  const letzterPrompt = JSON.parse(prompts.at(-1));
  assert.match(letzterPrompt.letztesArgumentDesMitschuelers, /Heimweg/);
  assert.ok(!prompts.at(-1).includes("Lea") && !prompts.at(-1).includes("Ben"));

  // Runde 2 beginnt die andere Seite
  assert.equal(antwort.data.runde, 2);
  assert.equal(antwort.data.amZug, "ich");
  assert.equal(antwort.data.typ, "argument");

  // Runden 2 und 3 zu Ende spielen
  const reihenfolge = [zweit, erst, erst, zweit];
  for (const tok of reihenfolge) {
    const r = await beitrag(tok, "Ich finde das richtig, weil es der Klasse hilft.");
    assert.equal(r.data.ergebnis.angenommen, true);
  }
  const ende = (await post("/api/de7-argument/tisch/state", {}, lea)).data;
  assert.equal(ende.status, "fertig");
  assert.equal(ende.beitraege.length, 6);
  assert.equal(ende.punkte.ich + ende.punkte.partner, 3 + 2 + 4);

  // Revanche: gleiches Thema, Seiten getauscht, Punkte zurück auf 0
  const rev = await post("/api/de7-argument/tisch/neu", { modus: "revanche" }, ben);
  assert.equal(rev.data.status, "laeuft");
  assert.equal(rev.data.thema.id, "handys");
  const leaNeu = (await post("/api/de7-argument/tisch/state", {}, lea)).data;
  assert.equal(leaNeu.seiten.ich, leaIstDafuer ? "dagegen" : "dafür");
  assert.equal(leaNeu.punkte.ich, 0);
});

test("Lehrkraft sieht alle Tische mit Verlauf und abgelehnten Versuchen und kann einen Tisch freigeben", async () => {
  assert.equal((await post("/api/de7-argument/teacher/tische", { password: "falsch" })).status, 401);
  const liste = await post("/api/de7-argument/teacher/tische", { password: "2" });
  const tisch5 = liste.data.tische.find((t) => t.tisch === 5 && t.klasse === "7M");
  assert.equal(tisch5.thema, "Handys in der Schule");
  assert.ok(tisch5.log.some((l) => !l.angenommen && l.text.includes("PIZZA")));
  assert.ok(tisch5.spieler.every((s) => s && s.name.endsWith("Test")));

  // Jeder geprüfte Beitrag landet auch bei den Modul-Einträgen der Schüler
  const eintraege = (await post("/api/de7-argument/teacher/module-results", { password: "2" })).data.entries;
  const tischEintraege = eintraege.filter((e) => e.art === "tischduell");
  assert.equal(tischEintraege.length, 8); // 2 abgelehnt + 6 gesendet
  assert.ok(tischEintraege.some((e) => e.ergebnis.richtig === false && e.antwort.includes("PIZZA")));
  assert.equal(tischEintraege[0].modulTitel, "Tisch-Duell zu zweit");

  const reset = await post("/api/de7-argument/teacher/tisch-reset", { password: "2", roomId: tisch5.id });
  assert.equal(reset.status, 200);
  const danach = await post("/api/de7-argument/teacher/tische", { password: "2" });
  assert.ok(!danach.data.tische.some((t) => t.id === tisch5.id));
});

test("Verwaister Platz wird frei, Wechsel an einen anderen Tisch räumt den alten Platz", async () => {
  const jan = await login("Jan"), eva = await login("Eva"), noah = await login("Noah");
  await post("/api/de7-argument/tisch/join", { tisch: 8 }, jan);
  await post("/api/de7-argument/tisch/join", { tisch: 8 }, eva);
  assert.equal((await post("/api/de7-argument/tisch/join", { tisch: 8 }, noah)).status, 409);

  // Jan meldet sich eine Minute nicht mehr: Noah bekommt seinen Platz
  clock += 60 * 1000;
  await post("/api/de7-argument/tisch/state", {}, eva);
  const noahDa = await post("/api/de7-argument/tisch/join", { tisch: 8 }, noah);
  assert.equal(noahDa.status, 200);
  assert.equal(noahDa.data.partner.firstName, "Eva");
  assert.equal((await post("/api/de7-argument/tisch/state", {}, jan)).data.status, "kein-tisch");

  // Eva wechselt an Tisch 9: Noah wartet wieder allein
  await post("/api/de7-argument/tisch/join", { tisch: 9 }, eva);
  const noahAllein = (await post("/api/de7-argument/tisch/state", {}, noah)).data;
  assert.equal(noahAllein.status, "warten");
  assert.equal(noahAllein.partner, null);

  // Verlassen
  await post("/api/de7-argument/tisch/leave", {}, noah);
  assert.equal((await post("/api/de7-argument/tisch/state", {}, noah)).data.status, "kein-tisch");
});

test("Ohne KI: großzügig senden, Beleidigungen und fehlende Begründung zurückschicken", async () => {
  const ida = await login("Ida"), max = await login("Max");
  await post("/api/de7-argument/tisch/join", { tisch: 12 }, ida);
  await post("/api/de7-argument/tisch/join", { tisch: 12 }, max);
  const t = await post("/api/de7-argument/tisch/thema", { thema: "hausaufgaben" }, max);
  const erst = t.data.amZug === "ich" ? max : ida;
  aiMode = "down";
  try {
    assert.equal((await beitrag(erst, "Du bist dumm und hast keine Ahnung davon.")).data.ergebnis.angenommen, false);
    assert.equal((await beitrag(erst, "Hausaufgaben am Wochenende sind gut.")).data.ergebnis.angenommen, false);
    const ok = await beitrag(erst, "Hausaufgaben am Wochenende sind gut, weil man in Ruhe üben kann.");
    assert.equal(ok.data.ergebnis.angenommen, true);
    assert.equal(ok.data.ergebnis.quelle, "stichworte");
  } finally {
    aiMode = "ok";
  }
});
