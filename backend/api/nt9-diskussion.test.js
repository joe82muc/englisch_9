"use strict";

// NT 9 Modul 7: Diskussionsrunde allein und am Tisch
const assert = require("node:assert/strict");
const test = require("node:test");
const express = require("express");
const { registerNt9DiskussionRoutes, ROLLEN } = require("./nt9-diskussion");

const kinder = new Map([["101", "9aM"], ["102", "9aM"], ["103", "9aM"], ["201", "9b"]]);
const kindZumCode = async (code) => (kinder.has(code) ? { code, klasse: kinder.get(code) } : null);

// Nachgebaute KI: erkennt die Aufgabe am Text
let kiAus = false;
async function askAnthropic(system, user) {
  if (kiAus) return "";
  if (system.includes("Prüfe den neuen Schülerbeitrag")) {
    const { beitrag } = JSON.parse(user);
    return /fußball/i.test(beitrag)
      ? JSON.stringify({ zugelassen: false, rueckmeldung: "Gut, dass du schreibst.", tipp: "Bleib beim Thema Erdöl." })
      : JSON.stringify({ zugelassen: true, rueckmeldung: "Klare Position.", tipp: "" });
  }
  if (system.includes("Schreibe das Protokoll")) {
    const { verlauf } = JSON.parse(user);
    // absichtlich in falscher Reihenfolge: Die Zuordnung muss über nr laufen
    return JSON.stringify({
      kern: verlauf.filter((v) => !v.vonSchueler).map((v) => ({ nr: v.nr, text: "KERN " + v.nr })).reverse(),
      pruefung: verlauf.filter((v) => v.vonSchueler).map((v) => ({ nr: v.nr, bewertung: "teilweise", text: "Ergänze eine Zahl." })),
      ergebnis: "Die Runde war sich uneinig.", staerken: "Gute Gründe.", tipp: "Nenne Fakten."
    });
  }
  const { auftrag } = JSON.parse(user);
  if (auftrag.startsWith("Sprich als")) return JSON.stringify({ text: "KI-Beitrag zur Runde." });
  const rollen = /Schreibe die Antworten dieser Rollen: ([a-z, ]+)\./.exec(auftrag)[1].split(", ");
  return JSON.stringify({
    rueckmeldung: "Stark!",
    antworten: rollen.concat(["erfunden"]).map((r) => ({ rolle: r, text: "Antwort von " + r })),
    naechste: /naechste = null/.test(auftrag) ? null : { rolle: "klima", text: "Was sagst du dazu?" }
  });
}

let server, basis, uhr = Date.now(), api;
test.before(async () => {
  const app = express();
  app.use(express.json());
  api = registerNt9DiskussionRoutes(app, { askAnthropic, kindZumCode, now: () => uhr });
  await new Promise((r) => { server = app.listen(0, "127.0.0.1", r); });
  basis = `http://127.0.0.1:${server.address().port}`;
});
test.after(() => server && server.close());

const post = async (route, body) => {
  const r = await fetch(basis + "/api/nt9/diskussion" + route, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return { status: r.status, data: await r.json() };
};
const warteBis = async (bed, ms = 3000) => { const t = Date.now(); while (!(await bed())) { if (Date.now() - t > ms) throw new Error("Zeit abgelaufen"); await new Promise((r) => setTimeout(r, 20)); } };

test("Allein: Code nötig, fremdes Thema wird abgelehnt, sonst antworten zwei andere Rollen", async () => {
  assert.equal((await post("/allein/zug", { code: "999", rolle: "klima", runde: 0, verlauf: [], beitrag: "Erdöl ist schlecht für das Klima." })).status, 404);
  const weg = await post("/allein/zug", { code: "101", rolle: "klima", runde: 0, verlauf: [], beitrag: "Ich finde Fußball am Wochenende toll." });
  assert.equal(weg.data.zugelassen, false);
  assert.match(weg.data.tipp, /Thema/);

  const ok = await post("/allein/zug", { code: "101", rolle: "klima", runde: 0, verlauf: [], beitrag: "Wir müssen raus aus dem Erdöl, weil CO₂ das Klima aufheizt." });
  assert.equal(ok.data.zugelassen, true);
  assert.equal(ok.data.antworten.length, 2, "erfundene Rollen werden entfernt");
  assert.ok(ok.data.antworten.every((a) => a.rolle !== "klima" && ROLLEN.some((r) => r.id === a.rolle)));
  assert.ok(ok.data.naechste && ok.data.naechste.text);

  const ende = await post("/allein/zug", { code: "101", rolle: "klima", runde: 3, verlauf: [], beitrag: "Mein Vorschlag: Ölheizungen durch Wärmepumpen ersetzen und mehr recyceln." });
  assert.equal(ende.data.fertig, true);
  assert.equal(ende.data.antworten.length, 4, "im Schlusswort sprechen alle vier");
  assert.equal(ende.data.naechste, null);
});

test("Protokoll: Schülerbeiträge stehen unverändert drin, mit Faktenprüfung", async () => {
  const verlauf = [
    { rolle: "klima", text: "Wir müssen raus aus dem Erdöl, weil CO₂ das Klima aufheizt." },
    { rolle: "politik", text: "Deutschland importiert fast alles Erdöl." },
    { rolle: "klima", text: "Dann sparen wir auch Geld für Importe." }
  ];
  const p = (await post("/allein/protokoll", { code: "101", rolle: "klima", verlauf })).data.protokoll;
  assert.equal(p.verlauf[0].text, verlauf[0].text, "Wortlaut des Kindes");
  assert.equal(p.verlauf[1].text, "KERN 1", "KI-Rolle als Kernaussage");
  assert.equal(p.verlauf[2].pruefung.bewertung, "teilweise");
  assert.equal(p.schuelerBeitraege, 2);
  assert.match(p.ergebnis, /uneinig/);
});

test("Ohne KI: Themenwörter entscheiden, Antworten aus dem Vorrat", async () => {
  kiAus = true;
  try {
    const nein = await post("/allein/zug", { code: "101", rolle: "politik", runde: 0, verlauf: [], beitrag: "Ich mag Pizza mit viel Käse sehr gern." });
    assert.equal(nein.data.zugelassen, false);
    const ja = await post("/allein/zug", { code: "101", rolle: "politik", runde: 0, verlauf: [], beitrag: "Wir sind beim Erdöl von anderen Ländern abhängig, das ist gefährlich." });
    assert.equal(ja.data.zugelassen, true);
    assert.equal(ja.data.quelle, "offline");
    assert.equal(ja.data.antworten.length, 2);
  } finally { kiAus = false; }
});

test("Am Tisch: Rollen wählen, Reihenfolge, KI spricht freie Rollen, Protokoll für alle", async () => {
  assert.equal((await post("/tisch/join", { code: "101", tisch: 3, rolle: "klima" })).status, 200);
  assert.equal((await post("/tisch/join", { code: "102", tisch: 3, rolle: "klima" })).status, 409, "Rolle besetzt");
  assert.equal((await post("/tisch/join", { code: "102", tisch: 3, rolle: "politik" })).status, 200);
  const andereKlasse = await post("/tisch/join", { code: "201", tisch: 3, rolle: "klima" });
  assert.equal(andereKlasse.status, 200, "Tisch 3 der Klasse 9b ist ein anderer Tisch");

  const start = await post("/tisch/start", { code: "101" });
  assert.equal(start.data.status, "laeuft");
  // Forschung (KI) beginnt, danach ist das Klima-Kind dran
  await warteBis(async () => (await post("/tisch/state", { code: "101" })).data.amZug === "klima");
  assert.equal((await post("/tisch/beitrag", { code: "102", text: "Ich möchte jetzt etwas zum Erdöl sagen." })).status, 409, "nicht dran");

  const abgelehnt = await post("/tisch/beitrag", { code: "101", text: "Am Wochenende spiele ich Fußball im Verein." });
  assert.equal(abgelehnt.data.ergebnis.zugelassen, false);
  assert.ok(abgelehnt.data.hinweis && abgelehnt.data.hinweis.tipp);
  assert.equal(abgelehnt.data.amZug, "klima", "bleibt dran");

  for (let runde = 0; runde < 3; runde++) {
    if (runde > 0) await warteBis(async () => (await post("/tisch/state", { code: "101" })).data.amZug === "klima");
    await post("/tisch/beitrag", { code: "101", text: "Erdöl verstärkt den Treibhauseffekt, deshalb weniger verbrennen." });
    await warteBis(async () => (await post("/tisch/state", { code: "102" })).data.amZug === "politik");
    await post("/tisch/beitrag", { code: "102", text: "Wir importieren fast alles Erdöl und sind abhängig von anderen Ländern." });
  }
  await warteBis(async () => (await post("/tisch/state", { code: "101" })).data.status === "fertig");
  const s = (await post("/tisch/state", { code: "102" })).data;
  assert.equal(s.beitraege.length, 15);
  assert.equal(s.beitraege.filter((b) => b.vonKind).length, 6);
  assert.equal(s.protokoll.schuelerBeitraege, 6);
  assert.equal(s.protokoll.verlauf[1].text, "Erdöl verstärkt den Treibhauseffekt, deshalb weniger verbrennen.");
});

test("Am Tisch: Ist ein Kind länger weg, springt die KI für seine Rolle ein", async () => {
  await post("/tisch/join", { code: "101", tisch: 7, rolle: "forschung" });
  await post("/tisch/join", { code: "103", tisch: 7, rolle: "klima" });
  await post("/tisch/start", { code: "101" });
  await warteBis(async () => (await post("/tisch/state", { code: "101" })).data.amZug === "forschung");
  await post("/tisch/beitrag", { code: "101", text: "Wir forschen an Kunststoff aus Maisstärke als Ersatz für Erdöl." });
  uhr += 2 * 60 * 1000; // Kind 103 meldet sich zwei Minuten nicht
  await warteBis(async () => {
    const d = (await post("/tisch/state", { code: "101" })).data;
    return d.beitraege.some((b) => b.rolle === "klima" && b.vertretung);
  });
});
