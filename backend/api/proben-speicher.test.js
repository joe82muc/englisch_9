"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const express = require("express");
const { registerProbenSpeicher } = require("./proben-speicher");
const { upstashZugang } = require("./nt9-fortschritt");

// Nachbau der Upstash-REST-Schnittstelle (nur die Befehle, die das Modul benutzt)
function upstashAttrappe() {
  const daten = new Map(), hashes = new Map();
  const zustand = { kaputt: false, befehle: [] };
  const server = http.createServer((req, res) => {
    let raw = "";
    req.on("data", (c) => { raw += c; });
    req.on("end", () => {
      const antwort = (status, body) => { res.writeHead(status, { "Content-Type": "application/json" }); res.end(JSON.stringify(body)); };
      if (zustand.kaputt) return antwort(500, { error: "kaputt" });
      if (req.headers.authorization !== "Bearer geheim") return antwort(401, { error: "Unauthorized" });
      const [befehl, ...args] = JSON.parse(raw);
      zustand.befehle.push(befehl);
      const h = hashes.get(args[0]) || new Map();
      switch (befehl) {
        case "PING": return antwort(200, { result: "PONG" });
        case "GET": return antwort(200, { result: daten.has(args[0]) ? daten.get(args[0]) : null });
        case "SET": daten.set(args[0], args[1]); return antwort(200, { result: "OK" });
        case "DEL": return antwort(200, { result: args.filter((k) => daten.delete(k)).length });
        case "HSET": h.set(args[1], args[2]); hashes.set(args[0], h); return antwort(200, { result: 1 });
        case "HGETALL": return antwort(200, { result: [...h].flat() });
        default: return antwort(400, { error: "ERR unknown command " + befehl });
      }
    });
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () =>
    resolve({ url: `http://127.0.0.1:${server.address().port}`, daten, hashes, zustand, close: () => server.close() })));
}

const ordner = () => fs.mkdtempSync(path.join(os.tmpdir(), "proben-"));
const lies = (dir, datei) => fs.readFileSync(path.join(dir, datei), "utf8");
const schreib = (dir, datei, inhalt) => fs.writeFileSync(path.join(dir, datei), typeof inhalt === "string" ? inhalt : JSON.stringify(inhalt, null, 2));

// Server mit Proben-Speicher und einer Probe-Route, die ihre Datei liest
async function starte(up, dataDir, extra = {}) {
  const app = express();
  const speicher = registerProbenSpeicher(app, {
    dataDir, taktMs: 60000, pruefMs: 0, beimBeendenSichern: false,
    env: { UPSTASH_grumiproben: up.url, UPSTASH_grumiproben_token: "geheim" }, ...extra
  });
  app.get("/api/vokabeltest/liste", (_req, res) => res.type("json").send(lies(dataDir, "vokabeltest_abgaben.json")));
  const server = await new Promise((resolve) => { const s = app.listen(0, "127.0.0.1", () => resolve(s)); });
  const basis = `http://127.0.0.1:${server.address().port}`;
  return { speicher, basis, close: () => { speicher.stop(); server.close(); } };
}

test("ohne Zugangsdaten bleibt alles in den Dateien", async () => {
  const app = express();
  const speicher = registerProbenSpeicher(app, { dataDir: ordner(), env: {} });
  assert.equal(speicher.art, "datei");
});

test("Neustart holt die Abgaben zurück, leere Startdatei überschreibt nichts", async () => {
  const up = await upstashAttrappe();
  const a = ordner();
  schreib(a, "vokabeltest_abgaben.json", { submissions: [] });
  const s1 = await starte(up, a);
  await s1.speicher.abgleichen(true);
  schreib(a, "vokabeltest_abgaben.json", { submissions: [{ id: 1, code: "123", note: 2 }] });
  await s1.speicher.sichern();
  s1.close();

  // Neue Instanz: Render hat den Ordner geleert, das Modul legt eine leere Datei an
  const b = ordner();
  schreib(b, "vokabeltest_abgaben.json", { submissions: [] });
  const s2 = await starte(up, b);
  const liste = await (await fetch(s2.basis + "/api/vokabeltest/liste")).json();
  assert.deepEqual(liste.submissions, [{ id: 1, code: "123", note: 2 }]);
  s2.close();
  up.close();
});

test("ohne Verbindung beim Start wird nichts hochgeladen", async () => {
  const up = await upstashAttrappe();
  const a = ordner();
  const s1 = await starte(up, a);
  await s1.speicher.abgleichen(true);
  schreib(a, "vokabeltests.json", { unlocked: { t1: { open: true } } });
  await s1.speicher.sichern();
  s1.close();
  const vorher = JSON.stringify([...up.daten]);

  up.zustand.kaputt = true;
  const b = ordner();
  schreib(b, "vokabeltests.json", { unlocked: {} });
  const s2 = await starte(up, b);
  await assert.rejects(s2.speicher.abgleichen(true));
  schreib(b, "vokabeltests.json", { unlocked: { neu: true } });
  await s2.speicher.sichern();
  up.zustand.kaputt = false;
  assert.equal(JSON.stringify([...up.daten]), vorher, "Upstash unverändert");

  await s2.speicher.abgleichen(true);
  assert.deepEqual(JSON.parse(lies(b, "vokabeltests.json")), { unlocked: { t1: { open: true } } });
  s2.close();
  up.close();
});

test("beim Deploy laufen zwei Instanzen: die neue sieht Abgaben der alten", async () => {
  const up = await upstashAttrappe();
  const alt = ordner(), neu = ordner();
  const s1 = await starte(up, alt);
  const s2 = await starte(up, neu);
  await s1.speicher.abgleichen(true);
  await s2.speicher.abgleichen(true);
  schreib(alt, "vokabeltest_abgaben.json", { submissions: [{ id: "spaet" }] });
  await s1.speicher.sichern();
  const liste = await (await fetch(s2.basis + "/api/vokabeltest/liste")).json();
  assert.deepEqual(liste.submissions, [{ id: "spaet" }]);

  // Eigene, noch nicht hochgeladene Änderung wird nicht überschrieben
  schreib(neu, "vokabeltest_abgaben.json", { submissions: [{ id: "spaet" }, { id: "neu-lokal" }] });
  schreib(alt, "vokabeltest_abgaben.json", { submissions: [{ id: "anders" }] });
  await s1.speicher.sichern();
  await s2.speicher.abgleichen(true);
  assert.equal(JSON.parse(lies(neu, "vokabeltest_abgaben.json")).submissions.length, 2);
  s1.close();
  s2.close();
  up.close();
});

test("große Dateien in Teilen, ausgenommene und fremde Dateien bleiben draußen", async () => {
  const up = await upstashAttrappe();
  const a = ordner();
  const s1 = await starte(up, a, { teil: 40 });
  await s1.speicher.abgleichen(true);
  const gross = { submissions: Array.from({ length: 300 }, (_, i) => ({ id: i, text: "Zufall " + Math.random() })) };
  schreib(a, "netzwerktest_abgaben.json", gross);
  schreib(a, "nt9-fortschritt.json", { geheim: true });
  schreib(a, "students.json", { students: [] });
  await s1.speicher.sichern();
  const [n] = up.hashes.get("pd:index").get("netzwerktest_abgaben.json").split("|");
  assert.ok(Number(n) > 3, "in mehreren Teilen");
  assert.ok(!up.hashes.get("pd:index").has("nt9-fortschritt.json"));
  assert.ok(!up.hashes.get("pd:index").has("students.json"));

  // Kleiner geworden: überzählige Teile werden gelöscht
  schreib(a, "netzwerktest_abgaben.json", { submissions: [] });
  await s1.speicher.sichern();
  const [n2] = up.hashes.get("pd:index").get("netzwerktest_abgaben.json").split("|");
  assert.equal([...up.daten.keys()].filter((k) => k.startsWith("pd:netzwerktest_abgaben.json:")).length, Number(n2));
  s1.close();

  // Ein Eintrag mit fremdem Pfad im Index wird nie geschrieben
  up.hashes.get("pd:index").set("../../boese.json", "1|x");
  const b = ordner();
  schreib(b, "netzwerktest_abgaben.json", gross);
  const s2 = await starte(up, b, { teil: 40 });
  await s2.speicher.abgleichen(true);
  assert.deepEqual(JSON.parse(lies(b, "netzwerktest_abgaben.json")), { submissions: [] });
  assert.ok(!fs.existsSync(path.join(b, "..", "..", "boese.json")));
  s2.close();
  up.close();
});

test("Upstash wird nur bei Änderungen beschrieben", async () => {
  const up = await upstashAttrappe();
  const a = ordner();
  schreib(a, "grammatik9r.json", { unlocked: {} });
  const s1 = await starte(up, a);
  await s1.speicher.abgleichen(true);
  await s1.speicher.sichern();
  const n = up.zustand.befehle.length;
  await s1.speicher.sichern();
  await s1.speicher.sichern();
  assert.equal(up.zustand.befehle.length, n);
  s1.close();
  up.close();
});

test("Zugangsdaten mit eigenen Namen und ganzer .env-Zeile aus Upstash", () => {
  const z = upstashZugang(
    { UPSTASH_grumiproben: 'UPSTASH_REDIS_REST_URL="https://tight-polecat-1.upstash.io"', UPSTASH_grumiproben_token: " AbC12= " },
    "UPSTASH_grumiproben", "UPSTASH_grumiproben_token");
  assert.deepEqual(z, { url: "https://tight-polecat-1.upstash.io", token: "AbC12=", hinweis: "" });
  const kaputt = upstashZugang({ UPSTASH_grumiproben: "https://x.upstash.ioZkZ Tc", UPSTASH_grumiproben_token: "t" }, "UPSTASH_grumiproben", "UPSTASH_grumiproben_token");
  assert.match(kaputt.hinweis, /UPSTASH_grumiproben enthält Leerzeichen/);
});
