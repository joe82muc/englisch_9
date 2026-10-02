"use strict";

/**
 * Proben dauerhaft speichern – eigene Upstash-Datenbank („grumiproben“), getrennt vom Lernfortschritt.
 *
 * Die Proben-Module (Vokabeltest, Netzwerktest, Filius, NT 7, Deutsch 7, Infoaustausch, Informatik 8,
 * Grammatik) schreiben weiter ihre JSON-Dateien in backend/data. Render löscht diesen Ordner bei jedem
 * Deploy und Neustart. Dieses Modul spiegelt die Dateien deshalb in Upstash:
 *   - beim Start und vor Proben-Anfragen (höchstens alle PRUEF_MS) neuere Stände aus Upstash holen
 *     (wichtig beim Deploy: kurz laufen alte und neue Instanz gleichzeitig),
 *   - alle TAKT_MS geänderte Dateien hochladen, beim Beenden (SIGTERM) noch einmal.
 * Hochgeladen wird erst, wenn der Stand aus Upstash einmal vollständig geholt wurde. Sonst könnte die
 * leere Datei nach einem Neustart die gespeicherten Abgaben überschreiben.
 *
 * Zugang: UPSTASH_grumiproben (Adresse) und UPSTASH_grumiproben_token. Fehlen sie, bleibt alles wie
 * bisher nur in den Dateien. Neue Proben-Module brauchen nichts weiter: Jede .json in data zählt mit,
 * außer den Dateien in AUSGENOMMEN. Neue Routen-Präfixe in PRAEFIXE ergänzen.
 *
 * Schlüssel:
 *   pd:index        Hash  Datei -> "<Teile>|<sha1 des Inhalts>"
 *   pd:<datei>:<i>  Inhalt gzip + base64, in Teilen (Upstash nimmt höchstens 1 MB je Anfrage)
 *
 * Route: GET /api/proben-speicher/status -> { ok, speicher, verbunden, dateien, grund? }
 */

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const { upstashZugang, fehlerGrund } = require("./nt9-fortschritt");
const { beimBeenden } = require("./beenden");

const URL_NAME = "UPSTASH_grumiproben";
const TOKEN_NAME = "UPSTASH_grumiproben_token";
const PRAEFIXE = [
  "/api/vokabeltest", "/api/netzwerktest", "/api/filiuspruefung", "/api/nt7", "/api/de7-argument",
  "/api/infoaustausch", "/api/informatik8", "/api/grammatik9r"
];
// Lernfortschritt hat seine eigene Datenbank, students/progress sind Reste der alten Englisch-App
const AUSGENOMMEN = new Set(["nt9-fortschritt.json", "students.json", "progress.json"]);
const gueltig = (datei) => /^[\w.-]+\.json$/.test(datei) && !AUSGENOMMEN.has(datei);
const sha1 = (buf) => crypto.createHash("sha1").update(buf).digest("hex");

function upstash(url, token, fetchImpl) {
  const doFetch = fetchImpl || fetch;
  const base = String(url).replace(/\/+$/, "");
  return async (...args) => {
    const response = await doFetch(base, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(args)
    });
    let data = null;
    try { data = await response.json(); } catch (_error) { data = null; }
    if (!response.ok || !data || data.error) throw new Error(`Upstash: ${(data && data.error) || "HTTP " + response.status}`);
    return data.result;
  };
}

function registerProbenSpeicher(app, options = {}) {
  const dataDir = options.dataDir || path.join(__dirname, "..", "data");
  const env = options.env || process.env;
  const PRUEF_MS = options.pruefMs === undefined ? 10000 : options.pruefMs;
  const TAKT_MS = options.taktMs === undefined ? 2000 : options.taktMs;
  const TEIL = options.teil || 500000;
  const { url, token, hinweis } = upstashZugang(env, URL_NAME, TOKEN_NAME);

  if (!url || !token) {
    app.get("/api/proben-speicher/status", (_req, res) => res.json({ ok: true, speicher: "datei", verbunden: false }));
    return { art: "datei", abgleichen: async () => {}, sichern: async () => {}, stop() {} };
  }

  const cmd = upstash(url, token, options.fetch);
  const bekannt = new Map(); // Datei -> { h, n, mtimeMs, size } wie zuletzt mit Upstash abgeglichen
  let bereit = false, letztePruefung = 0, abgleichLaeuft = null, sichernLaeuft = null, letzterFehler = "";

  const pfad = (datei) => path.join(dataDir, datei);
  function stand(datei) {
    try { const s = fs.statSync(pfad(datei)); return { mtimeMs: s.mtimeMs, size: s.size }; } catch (_error) { return null; }
  }
  // Lokal geändert seit dem letzten Abgleich?
  function veraendert(datei) {
    const b = bekannt.get(datei), s = stand(datei);
    return Boolean(s) && (!b || b.mtimeMs !== s.mtimeMs || b.size !== s.size);
  }
  function fehler(was, error) {
    const text = `${was}: ${error.message}`;
    if (text !== letzterFehler) console.error("Proben-Speicher:", text);
    letzterFehler = text;
  }

  // Neuere Stände aus Upstash in die Dateien holen
  function abgleichen(sofort) {
    if (abgleichLaeuft) return abgleichLaeuft;
    if (!sofort && bereit && Date.now() - letztePruefung < PRUEF_MS) return Promise.resolve();
    abgleichLaeuft = (async () => {
      const flach = (await cmd("HGETALL", "pd:index")) || [];
      for (let i = 0; i < flach.length; i += 2) {
        const datei = String(flach[i]);
        const [n, h] = String(flach[i + 1]).split("|");
        const b = bekannt.get(datei);
        if (!gueltig(datei) || (b && b.h === h)) continue;
        // Eigene Änderung ist neuer und wird gleich hochgeladen
        if (b && veraendert(datei)) continue;
        const teile = [];
        for (let j = 0; j < Number(n); j++) teile.push(await cmd("GET", `pd:${datei}:${j}`));
        if (teile.some((t) => typeof t !== "string")) throw new Error(`${datei}: Teil fehlt`);
        const inhalt = zlib.gunzipSync(Buffer.from(teile.join(""), "base64"));
        if (sha1(inhalt) !== h) throw new Error(`${datei}: Inhalt unvollständig`);
        // Während des Ladens lokal geändert? Dann gewinnt die lokale Fassung.
        if (b && veraendert(datei)) continue;
        fs.mkdirSync(dataDir, { recursive: true });
        fs.writeFileSync(pfad(datei) + ".abgleich", inhalt);
        fs.renameSync(pfad(datei) + ".abgleich", pfad(datei));
        bekannt.set(datei, { h, n: Number(n), ...stand(datei) });
      }
      letztePruefung = Date.now();
      if (!bereit) console.log(`Proben-Speicher: ${bekannt.size} Dateien aus Upstash geholt`);
      bereit = true;
      letzterFehler = "";
    })().finally(() => { abgleichLaeuft = null; });
    return abgleichLaeuft;
  }

  // Geänderte Dateien hochladen (erst, wenn der Stand aus Upstash einmal geholt wurde)
  function sichern() {
    if (sichernLaeuft) return sichernLaeuft;
    if (!bereit) return Promise.resolve();
    sichernLaeuft = (async () => {
      let dateien = [];
      try { dateien = fs.readdirSync(dataDir).filter(gueltig); } catch (_error) { dateien = []; }
      for (const datei of dateien) {
        if (!veraendert(datei)) continue;
        const s = stand(datei), b = bekannt.get(datei);
        let inhalt;
        try { inhalt = fs.readFileSync(pfad(datei)); } catch (_error) { continue; }
        const h = sha1(inhalt);
        if (b && b.h === h) { bekannt.set(datei, { ...b, ...s }); continue; }
        const text = zlib.gzipSync(inhalt).toString("base64");
        const n = Math.max(1, Math.ceil(text.length / TEIL));
        for (let j = 0; j < n; j++) await cmd("SET", `pd:${datei}:${j}`, text.slice(j * TEIL, (j + 1) * TEIL));
        await cmd("HSET", "pd:index", datei, `${n}|${h}`);
        if (b && b.n > n) await cmd("DEL", ...Array.from({ length: b.n - n }, (_, j) => `pd:${datei}:${n + j}`));
        bekannt.set(datei, { h, n, ...s });
      }
    })().catch((error) => fehler("Hochladen", error)).finally(() => { sichernLaeuft = null; });
    return sichernLaeuft;
  }

  // Vor jeder Proben-Anfrage: neueren Stand holen (beim Start wartet die Anfrage darauf)
  app.use(PRAEFIXE, (_req, _res, next) => {
    abgleichen(false).catch((error) => fehler("Abgleich", error)).then(() => next());
  });

  app.get("/api/proben-speicher/status", async (_req, res) => {
    let verbunden = false, grund = "";
    try { verbunden = (await cmd("PING")) === "PONG"; } catch (error) {
      grund = fehlerGrund(error, URL_NAME) + (hinweis ? ". " + hinweis : "");
    }
    if (verbunden && !bereit) { verbunden = false; grund = letzterFehler || "Stand noch nicht geholt"; }
    res.json({ ok: true, speicher: "upstash", verbunden, dateien: bekannt.size, ...(grund ? { grund } : {}) });
  });

  const takt = setInterval(() => {
    if (bereit) sichern();
    else abgleichen(true).catch((error) => fehler("Abgleich", error));
  }, TAKT_MS);
  if (takt.unref) takt.unref();
  abgleichen(true).catch((error) => fehler("Abgleich", error));
  if (options.beimBeendenSichern !== false) beimBeenden(async () => { await sichern(); await sichern(); });

  return { art: "upstash", abgleichen, sichern, stop: () => clearInterval(takt) };
}

module.exports = { registerProbenSpeicher, PRAEFIXE };
