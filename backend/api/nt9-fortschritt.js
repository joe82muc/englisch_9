"use strict";

/**
 * NT 9M/9R „Organische Rohstoffe“: Lernfortschritt für die Lehrkraft.
 *
 * Jedes Kind bekommt von der Lehrkraft einen 3-stelligen Code und meldet sich damit in den
 * Modulen an. Die Modulseiten melden, welche Aufgaben gelöst sind. Die Lehrkraft sieht den
 * Stand in proben-verwalten.html (Reiter „Lernfortschritt NT 9“, Lehrerpasswort).
 * Namen speichert der Server nicht: Die Zuordnung Code -> Name führt die Lehrkraft getrennt
 * (die Lehrerseite hält sie nur im Browser der Lehrkraft), wie es die Datenschutzhinweise vorsehen.
 *
 * Gespeichert wird dauerhaft in Upstash Redis (Umgebungsvariablen UPSTASH_REDIS_REST_URL und
 * UPSTASH_REDIS_REST_TOKEN). Fehlen sie, landet alles in data/nt9-fortschritt.json – das ist auf
 * dem kostenlosen Render-Tarif nur flüchtig und dient zum Testen.
 *
 * Schlüssel:
 *   nt9:codes                 Menge aller Codes
 *   nt9:s:<code>              { code, klasse, angelegt }
 *   nt9:p:<code>:<modul>      { g: { aufgabe: Zeitpunkt }, t: Aufgaben gesamt, z: letzte Meldung }
 *   nt9:k:<modul>             { aufgabe: [Bezeichnung, Station] }  (Aufgabenkatalog, kommt von den Seiten)
 *
 * Routen (Schüler):
 *   POST /api/nt9/fortschritt/anmelden { code, klasse }  -> { ok, code, klasse, fortschritt: { modul: { g: [ids], t } } }
 *   POST /api/nt9/fortschritt/melden   { code, klasse, modul, geloest: [ids], gesamt, katalog? } -> { ok, anzahl }
 * Routen (Lehrkraft, Passwort im Body):
 *   POST /api/nt9/fortschritt/lehrer/liste    { password }                   -> { ok, speicher, module, schueler, katalog }
 *   POST /api/nt9/fortschritt/lehrer/anlegen  { password, klasse, anzahl }   -> { ok, neu: [{ code, klasse }] }
 *   POST /api/nt9/fortschritt/lehrer/loeschen { password, code }             -> { ok }
 *   GET  /api/nt9/fortschritt/status -> { ok, speicher, verbunden }
 */

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const KLASSEN = ["9M", "9R"];
const MODULE = [
  { id: "m01", nr: 1, titel: "Kohlenstoff, Holz und Raps" },
  { id: "m02", nr: 2, titel: "Biodiesel, Stärke und Nachhaltigkeit" },
  { id: "m04", nr: 3, titel: "Entstehung fossiler Rohstoffe" },
  { id: "m05", nr: 4, titel: "Erdölaufbereitung und Fraktionen" },
  { id: "m06", nr: 5, titel: "Kohlenstoffkreislauf und Treibhauseffekt" }
];
const MODUL_IDS = MODULE.map((m) => m.id);
const MAX_CODES = 800;
const MAX_AUFGABEN = 300;
// Fehlversuche bei der Anmeldung: die ganze Schule hat oft nur eine IP, darum großzügig
const FEHL_FENSTER_MS = 10 * 60 * 1000;
const FEHL_MAX = 60;

/* ---------- Speicher ---------- */

// Upstash Redis über die REST-Schnittstelle (kein eigenes Paket nötig)
function upstashStore(url, token, fetchImpl) {
  const doFetch = fetchImpl || fetch;
  const base = String(url).replace(/\/+$/, "");
  async function call(pathPart, body) {
    const response = await doFetch(base + pathPart, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    let data = null;
    try { data = await response.json(); } catch (_error) { data = null; }
    if (!response.ok || !data || data.error) throw new Error(`Upstash: ${(data && data.error) || "HTTP " + response.status}`);
    return data;
  }
  const cmd = async (...args) => (await call("", args)).result;
  return {
    art: "upstash",
    ping: async () => (await cmd("PING")) === "PONG",
    get: async (key) => parse(await cmd("GET", key)),
    set: async (key, value) => { await cmd("SET", key, JSON.stringify(value)); },
    mget: async (keys) => (keys.length ? (await cmd("MGET", ...keys)).map(parse) : []),
    del: async (keys) => { if (keys.length) await cmd("DEL", ...keys); },
    sadd: async (set, member) => { await cmd("SADD", set, member); },
    srem: async (set, member) => { await cmd("SREM", set, member); },
    smembers: async (set) => (await cmd("SMEMBERS", set)) || []
  };
}

// Ersatz ohne Datenbank: alles in einer JSON-Datei (oder nur im Speicher, wenn file fehlt)
function dateiStore(file) {
  let daten = null;
  function laden() {
    if (daten) return daten;
    daten = {};
    if (file && fs.existsSync(file)) {
      try { daten = JSON.parse(fs.readFileSync(file, "utf8")) || {}; } catch (error) {
        console.error("NT 9 Fortschritt: Datendatei konnte nicht gelesen werden:", error.message);
        daten = {};
      }
    }
    return daten;
  }
  function sichern() {
    if (!file) return;
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const temp = `${file}.tmp`;
    fs.writeFileSync(temp, JSON.stringify(daten), "utf8");
    fs.renameSync(temp, file);
  }
  const copy = (v) => (v === undefined ? null : JSON.parse(JSON.stringify(v)));
  return {
    art: "datei",
    ping: async () => true,
    get: async (key) => copy(laden()[key]),
    set: async (key, value) => { laden()[key] = copy(value); sichern(); },
    mget: async (keys) => keys.map((k) => copy(laden()[k])),
    del: async (keys) => { keys.forEach((k) => delete laden()[k]); sichern(); },
    sadd: async (set, member) => { const d = laden(); const s = new Set(d[set] || []); s.add(member); d[set] = [...s]; sichern(); },
    srem: async (set, member) => { const d = laden(); d[set] = (d[set] || []).filter((m) => m !== member); sichern(); },
    smembers: async (set) => [...(laden()[set] || [])]
  };
}

function parse(raw) {
  if (raw === null || raw === undefined) return null;
  try { return JSON.parse(raw); } catch (_error) { return null; }
}

/* ---------- Routen ---------- */

function registerNt9FortschrittRoutes(app, options = {}) {
  const teacherPassword = String(options.teacherPassword || "2");
  const env = options.env || process.env;
  // Werte aus dem Render-Dashboard: Leerzeichen und Anführungszeichen (aus dem .env-Kasten kopiert) entfernen
  const envWert = (v) => String(v || "").trim().replace(/^["']+|["']+$/g, "").trim();
  const upUrl = envWert(env.UPSTASH_REDIS_REST_URL), upToken = envWert(env.UPSTASH_REDIS_REST_TOKEN);
  const store = options.store || (upUrl && upToken
    ? upstashStore(upUrl, upToken, options.fetch)
    : dateiStore(path.join(options.dataDir || path.join(__dirname, "..", "data"), "nt9-fortschritt.json")));
  const now = options.now || (() => Date.now());
  const klasseVon = new Map(); // Code -> Klasse (Zwischenspeicher, spart Datenbankzugriffe)
  const katalogHash = new Map(); // Modul -> Prüfsumme des zuletzt gespeicherten Katalogs
  const fehlversuche = new Map(); // IP -> { n, bis }

  const sKey = (code) => `nt9:s:${code}`;
  const pKey = (code, modul) => `nt9:p:${code}:${modul}`;
  const kKey = (modul) => `nt9:k:${modul}`;

  function lehrerOk(req, res) {
    const given = Buffer.from(String((req.body && req.body.password) || "").slice(0, 200));
    const expected = Buffer.from(teacherPassword);
    if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) {
      res.status(401).json({ ok: false, error: "Das Passwort stimmt nicht." });
      return false;
    }
    return true;
  }

  function ip(req) {
    const fwd = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
    return fwd || req.ip || "?";
  }
  function gesperrt(req) {
    const e = fehlversuche.get(ip(req));
    return Boolean(e && e.bis > now() && e.n >= FEHL_MAX);
  }
  function fehlversuch(req) {
    const k = ip(req), e = fehlversuche.get(k);
    if (!e || e.bis <= now()) fehlversuche.set(k, { n: 1, bis: now() + FEHL_FENSTER_MS });
    else e.n += 1;
  }

  async function schuelerHolen(code) {
    const s = await store.get(sKey(code));
    if (s) klasseVon.set(code, s.klasse); else klasseVon.delete(code);
    return s;
  }

  // Prüft Code und Klasse; schreibt bei Fehlern selbst die Antwort
  async function pruefen(req, res, code, klasse) {
    if (!/^\d{3}$/.test(code) || !KLASSEN.includes(klasse)) {
      res.status(400).json({ ok: false, error: "Code oder Klasse fehlen." });
      return null;
    }
    let k = klasseVon.get(code);
    if (!k) {
      const s = await schuelerHolen(code);
      if (!s) {
        fehlversuch(req);
        res.status(404).json({ ok: false, error: "Diesen Code gibt es nicht. Frag deine Lehrkraft." });
        return null;
      }
      k = s.klasse;
    }
    if (k !== klasse) {
      res.status(409).json({ ok: false, klasse: k, error: `Dieser Code gehört zur Klasse ${k}. Öffne die Seite deiner Klasse.` });
      return null;
    }
    return k;
  }

  const fehler = (res, error) => {
    console.error("NT 9 Fortschritt:", error.message);
    res.status(503).json({ ok: false, error: "Der Speicher ist gerade nicht erreichbar. Versuch es gleich noch einmal." });
  };

  app.get("/api/nt9/fortschritt/status", async (_req, res) => {
    let verbunden = false, grund = "";
    try { verbunden = await store.ping(); } catch (error) {
      console.error("NT 9 Fortschritt status:", error.message);
      grund = fehlerGrund(error);
    }
    res.json({ ok: true, speicher: store.art, verbunden, ...(grund ? { grund } : {}) });
  });

  app.post("/api/nt9/fortschritt/anmelden", async (req, res) => {
    try {
      if (gesperrt(req)) return res.status(429).json({ ok: false, error: "Zu viele falsche Codes. Warte ein paar Minuten." });
      const body = req.body || {};
      const code = String(body.code || "").trim(), klasse = String(body.klasse || "").trim().toUpperCase();
      if (!/^\d{3}$/.test(code)) return res.status(400).json({ ok: false, error: "Der Code hat genau 3 Ziffern." });
      if (!KLASSEN.includes(klasse)) return res.status(400).json({ ok: false, error: "Die Klasse fehlt." });
      const s = await schuelerHolen(code);
      if (!s) {
        fehlversuch(req);
        return res.status(404).json({ ok: false, error: "Diesen Code gibt es nicht. Frag deine Lehrkraft." });
      }
      if (s.klasse !== klasse) {
        return res.status(409).json({ ok: false, klasse: s.klasse, error: `Dieser Code gehört zur Klasse ${s.klasse}. Öffne die Seite deiner Klasse.` });
      }
      const staende = await store.mget(MODUL_IDS.map((m) => pKey(code, m)));
      const fortschritt = {};
      MODUL_IDS.forEach((m, i) => {
        const p = staende[i];
        if (p && p.g) fortschritt[m] = { g: Object.keys(p.g), t: p.t || 0 };
      });
      return res.json({ ok: true, code, klasse: s.klasse, fortschritt });
    } catch (error) { return fehler(res, error); }
  });

  app.post("/api/nt9/fortschritt/melden", async (req, res) => {
    try {
      const body = req.body || {};
      const code = String(body.code || "").trim(), klasse = String(body.klasse || "").trim().toUpperCase();
      const modul = String(body.modul || "");
      if (!MODUL_IDS.includes(modul)) return res.status(400).json({ ok: false, error: "Unbekanntes Modul." });
      if (!(await pruefen(req, res, code, klasse))) return;
      const geloest = aufgabenListe(body.geloest);
      const gesamt = Math.max(0, Math.min(MAX_AUFGABEN, parseInt(body.gesamt, 10) || 0));
      const alt = (await store.get(pKey(code, modul))) || { g: {}, t: 0 };
      const g = alt.g || {};
      const zeit = now();
      geloest.forEach((id) => { if (!g[id] && Object.keys(g).length < MAX_AUFGABEN) g[id] = zeit; });
      await store.set(pKey(code, modul), { g, t: gesamt || alt.t || 0, z: zeit });
      const katalog = katalogPruefen(body.katalog);
      if (katalog) {
        const hash = crypto.createHash("sha1").update(JSON.stringify(katalog)).digest("hex");
        if (katalogHash.get(modul) !== hash) {
          await store.set(kKey(modul), katalog);
          katalogHash.set(modul, hash);
        }
      }
      return res.json({ ok: true, anzahl: Object.keys(g).length });
    } catch (error) { return fehler(res, error); }
  });

  app.post("/api/nt9/fortschritt/lehrer/liste", async (req, res) => {
    if (!lehrerOk(req, res)) return;
    try {
      const codes = (await store.smembers("nt9:codes")).filter((c) => /^\d{3}$/.test(c)).sort();
      const stamm = await store.mget(codes.map(sKey));
      const pKeys = [];
      codes.forEach((c) => MODUL_IDS.forEach((m) => pKeys.push(pKey(c, m))));
      const [staende, kataloge] = await Promise.all([store.mget(pKeys), store.mget(MODUL_IDS.map(kKey))]);
      const schueler = [];
      codes.forEach((code, i) => {
        const s = stamm[i];
        if (!s) return;
        klasseVon.set(code, s.klasse);
        const module = {};
        MODUL_IDS.forEach((m, j) => {
          const p = staende[i * MODUL_IDS.length + j];
          if (p) module[m] = { g: p.g || {}, t: p.t || 0, z: p.z || 0 };
        });
        schueler.push({ code, klasse: s.klasse, angelegt: s.angelegt || 0, module });
      });
      const katalog = {};
      MODUL_IDS.forEach((m, i) => { if (kataloge[i]) katalog[m] = kataloge[i]; });
      return res.json({ ok: true, speicher: store.art, module: MODULE, klassen: KLASSEN, schueler, katalog });
    } catch (error) { return fehler(res, error); }
  });

  app.post("/api/nt9/fortschritt/lehrer/anlegen", async (req, res) => {
    if (!lehrerOk(req, res)) return;
    try {
      const body = req.body || {};
      const klasse = String(body.klasse || "").trim().toUpperCase();
      if (!KLASSEN.includes(klasse)) return res.status(400).json({ ok: false, error: "Bitte 9M oder 9R wählen." });
      const anzahl = parseInt(body.anzahl, 10);
      if (!(anzahl >= 1 && anzahl <= 60)) return res.status(400).json({ ok: false, error: "Bitte 1 bis 60 Codes auf einmal anlegen." });
      const vorhanden = new Set(await store.smembers("nt9:codes"));
      if (vorhanden.size + anzahl > MAX_CODES) return res.status(400).json({ ok: false, error: "Es gibt schon zu viele Codes. Lösche zuerst alte Einträge." });
      const frei = [];
      for (let c = 100; c <= 999; c++) if (!vorhanden.has(String(c))) frei.push(String(c));
      const neu = [];
      for (let i = 0; i < anzahl; i++) {
        const code = frei.splice(crypto.randomInt(frei.length), 1)[0];
        await store.set(sKey(code), { code, klasse, angelegt: now() });
        await store.sadd("nt9:codes", code);
        klasseVon.set(code, klasse);
        neu.push({ code, klasse });
      }
      return res.json({ ok: true, neu });
    } catch (error) { return fehler(res, error); }
  });

  app.post("/api/nt9/fortschritt/lehrer/loeschen", async (req, res) => {
    if (!lehrerOk(req, res)) return;
    try {
      const code = String((req.body && req.body.code) || "");
      if (!/^\d{3}$/.test(code)) return res.status(400).json({ ok: false, error: "Ungültiger Code." });
      await store.del([sKey(code), ...MODUL_IDS.map((m) => pKey(code, m))]);
      await store.srem("nt9:codes", code);
      klasseVon.delete(code);
      return res.json({ ok: true });
    } catch (error) { return fehler(res, error); }
  });

  return { store };
}

// Kurzer Grund für die Statusseite, ohne Schlüssel oder Adresse preiszugeben
function fehlerGrund(error) {
  const text = String((error && error.message) || "");
  const code = error && error.cause && error.cause.code ? String(error.cause.code) : "";
  if (/WRONGPASS|Unauthorized|401|invalid.*token|auth/i.test(text)) return "Token wird abgelehnt (falscher oder schreibgeschützter Token?)";
  if (/Invalid URL|Failed to parse URL/i.test(text)) return "Die Adresse (UPSTASH_REDIS_REST_URL) ist keine gültige URL";
  if (code === "ENOTFOUND" || code === "EAI_AGAIN") return "Die Adresse (UPSTASH_REDIS_REST_URL) wird nicht gefunden";
  if (code) return "Netzwerkfehler " + code;
  return text.replace(/https?:\/\/\S+/g, "<Adresse>").replace(/Bearer\s+\S+/g, "").slice(0, 120) || "unbekannt";
}

function aufgabenListe(v) {
  if (!Array.isArray(v)) return [];
  const out = new Set();
  for (const id of v) {
    const s = String(id || "");
    if (/^[A-Za-z0-9_-]{1,60}$/.test(s)) out.add(s);
    if (out.size >= MAX_AUFGABEN) break;
  }
  return [...out];
}

// Katalog { id: [Bezeichnung, Station] } – nur übernehmen, was harmlos und klein ist
function katalogPruefen(v) {
  if (!v || typeof v !== "object" || Array.isArray(v)) return null;
  const out = {};
  let n = 0;
  for (const [id, wert] of Object.entries(v)) {
    if (!/^[A-Za-z0-9_-]{1,60}$/.test(id) || !Array.isArray(wert)) continue;
    out[id] = [String(wert[0] || id).replace(/[<>]/g, "").slice(0, 140), String(wert[1] || "").replace(/[^0-9]/g, "").slice(0, 2)];
    if (++n >= MAX_AUFGABEN) break;
  }
  return n ? out : null;
}

module.exports = { registerNt9FortschrittRoutes, upstashStore, dateiStore, MODULE };
