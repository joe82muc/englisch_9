"use strict";

/**
 * Lernfortschritt Klasse 9M/9R für die Lehrkraft: NT 9 „Organische Rohstoffe“, Englisch 9 und Deutsch 9.
 * Ein Code je Kind gilt für alle Kurse.
 *
 * Feste Module stehen in KURSE (NT 9, Englisch-Grammatik Unit 1). Alle anderen Übungsseiten melden sich
 * beim ersten Melden selbst an: Kennung "e9-…" oder "d9-…" plus meta { bereich, bnr, titel, kurz, nr }.
 * Der Server merkt sich dazu, in welchen Klassen die Seite benutzt wurde (klassen).
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
 *   nt9:mods / nt9:mm:<modul> selbst angemeldete Module { id, kurs, bereich, bnr, titel, kurz, nr, klassen }
 *
 * Routen (Schüler):
 *   POST /api/nt9/fortschritt/anmelden { code, klasse?, kurs?, katalog? }   (ohne klasse: Klasse des Codes)
 *        -> { ok, code, klasse, fortschritt: { modul: { g: [ids], t } }, katalog? }  (katalog: true liefert die
 *           Aufgabenliste der Module des Kurses mit – damit zeigt die Seite dem Kind, was noch fehlt)
 *   POST /api/nt9/fortschritt/melden   { code, klasse, modul, geloest: [ids], gesamt, katalog?, meta? } -> { ok, anzahl }
 * Routen (Lehrkraft, Passwort im Body):
 *   POST /api/nt9/fortschritt/lehrer/liste    { password, kurs? }            -> { ok, speicher, kurse, module, schueler, katalog }
 *        (mit kurs: Stand und Katalog nur für die Module dieses Kurses)
 *   POST /api/nt9/fortschritt/lehrer/anlegen  { password, klasse, anzahl }   -> { ok, neu: [{ code, klasse }] }
 *   POST /api/nt9/fortschritt/lehrer/loeschen { password, code }             -> { ok }
 *   GET  /api/nt9/fortschritt/status -> { ok, speicher, verbunden }
 */

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const KLASSEN = ["9M", "9R"];
// Kurse und ihre Module (Kennung = Speicherschlüssel, kurz = Spaltenkopf in der Lehreransicht)
const KURSE = [
  { id: "nt9", titel: "NT 9 · Organische Rohstoffe", module: [
    { id: "m01", nr: 1, kurz: "Modul 1", titel: "Kohlenstoff, Holz und Raps" },
    { id: "m02", nr: 2, kurz: "Modul 2", titel: "Biodiesel, Stärke und Nachhaltigkeit" },
    { id: "m04", nr: 3, kurz: "Modul 3", titel: "Entstehung fossiler Rohstoffe" },
    { id: "m05", nr: 4, kurz: "Modul 4", titel: "Erdölaufbereitung und Fraktionen" },
    { id: "m06", nr: 5, kurz: "Modul 5", titel: "Kohlenstoffkreislauf und Treibhauseffekt" }
  ].map((m) => ({ ...m, bereich: "Organische Rohstoffe", bnr: 1 })) },
  { id: "e9", titel: "Englisch 9", module: [
    { id: "e9u1g1", nr: 1, kurz: "G1", titel: "Simple past" },
    { id: "e9u1g2", nr: 2, kurz: "G2", titel: "Will-future" },
    { id: "e9u1g3", nr: 3, kurz: "G3", titel: "If-clauses I" },
    { id: "e9u1g4", nr: 4, kurz: "G4", titel: "Present progressive" }
  ].map((m) => ({ ...m, bereich: "Unit 1 · Grammatik", bnr: 1 })) },
  { id: "d9", titel: "Deutsch 9", module: [] }
];
const KURS_IDS = KURSE.map((k) => k.id);
const MODULE = [];
KURSE.forEach((k) => k.module.forEach((m) => MODULE.push({ ...m, kurs: k.id })));
const MODUL_IDS = MODULE.map((m) => m.id);
// Selbst angemeldete Übungsseiten
const DYN_MUSTER = /^(e9|d9)-[a-z0-9-]{2,50}$/;
const MAX_DYN = 400;
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
  const { url: upUrl, token: upToken, hinweis: upHinweis } = upstashZugang(env);
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
  const mmKey = (modul) => `nt9:mm:${modul}`;

  // Selbst angemeldete Module (im Speicher zwischengespeichert, der Server läuft als eine Instanz)
  let dynCache = null;
  async function dynLaden() {
    if (dynCache) return dynCache;
    const ids = (await store.smembers("nt9:mods")).filter((id) => DYN_MUSTER.test(id));
    const metas = await store.mget(ids.map(mmKey));
    const karte = new Map();
    ids.forEach((id, i) => { if (metas[i]) karte.set(id, metas[i]); });
    dynCache = karte;
    return karte;
  }
  function metaSaeubern(id, meta) {
    const zahl = (v, max) => Math.max(0, Math.min(max, parseInt(v, 10) || 0));
    const text = (v, n) => String(v || "").replace(/[<>"]/g, "").replace(/\s+/g, " ").trim().slice(0, n);
    return { id, kurs: id.slice(0, 2), bereich: text(meta.bereich, 60) || "Weitere Übungen", bnr: zahl(meta.bnr, 99),
      titel: text(meta.titel, 90) || id, kurz: text(meta.kurz, 24), nr: zahl(meta.nr, 999), klassen: [] };
  }
  // true, wenn das Modul bekannt ist (fest oder selbst angemeldet); meldet es bei Bedarf an
  async function modulBekannt(id, meta, klasse) {
    if (MODUL_IDS.includes(id)) return true;
    if (!DYN_MUSTER.test(id)) return false;
    const dyn = await dynLaden();
    const alt = dyn.get(id);
    if (!alt && !(meta && typeof meta === "object")) return false;
    if (!alt && dyn.size >= MAX_DYN) return false;
    const neu = meta && typeof meta === "object" ? metaSaeubern(id, meta) : { ...alt };
    neu.klassen = [...new Set([...(alt ? alt.klassen || [] : []), ...(klasse ? [klasse] : [])])].sort();
    if (JSON.stringify(neu) !== JSON.stringify(alt)) {
      await store.set(mmKey(id), neu);
      if (!alt) await store.sadd("nt9:mods", id);
      dyn.set(id, neu);
    }
    return true;
  }
  async function alleModule() {
    const dyn = await dynLaden();
    const ordnung = (m) => [KURS_IDS.indexOf(m.kurs), m.bnr || 0, m.bereich || "", m.nr || 0, m.titel || ""];
    const liste = [...MODULE, ...dyn.values()];
    return liste.sort((a, b) => {
      const x = ordnung(a), y = ordnung(b);
      for (let i = 0; i < x.length; i++) {
        if (x[i] < y[i]) return -1;
        if (x[i] > y[i]) return 1;
      }
      return 0;
    });
  }

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
      grund = fehlerGrund(error) + (upHinweis ? ". " + upHinweis : "");
    }
    res.json({ ok: true, speicher: store.art, verbunden, ...(grund ? { grund } : {}) });
  });

  app.post("/api/nt9/fortschritt/anmelden", async (req, res) => {
    try {
      if (gesperrt(req)) return res.status(429).json({ ok: false, error: "Zu viele falsche Codes. Warte ein paar Minuten." });
      const body = req.body || {};
      const code = String(body.code || "").trim(), klasse = String(body.klasse || "").trim().toUpperCase();
      if (!/^\d{3}$/.test(code)) return res.status(400).json({ ok: false, error: "Der Code hat genau 3 Ziffern." });
      if (klasse && !KLASSEN.includes(klasse)) return res.status(400).json({ ok: false, error: "Unbekannte Klasse." });
      const s = await schuelerHolen(code);
      if (!s) {
        fehlversuch(req);
        return res.status(404).json({ ok: false, error: "Diesen Code gibt es nicht. Frag deine Lehrkraft." });
      }
      if (klasse && s.klasse !== klasse) {
        return res.status(409).json({ ok: false, klasse: s.klasse, error: `Dieser Code gehört zur Klasse ${s.klasse}. Öffne die Seite deiner Klasse.` });
      }
      const module = await alleModule();
      const alleIds = module.map((m) => m.id);
      const staende = await store.mget(alleIds.map((m) => pKey(code, m)));
      const fortschritt = {};
      alleIds.forEach((m, i) => {
        const p = staende[i];
        if (p && p.g) fortschritt[m] = { g: Object.keys(p.g), t: p.t || 0 };
      });
      const antwort = { ok: true, code, klasse: s.klasse, fortschritt };
      if (body.katalog === true) {
        const imKurs = KURS_IDS.includes(body.kurs) ? module.filter((m) => m.kurs === body.kurs) : module;
        const ids = imKurs.map((m) => m.id);
        const kataloge = await store.mget(ids.map(kKey));
        antwort.katalog = {};
        ids.forEach((m, i) => { if (kataloge[i]) antwort.katalog[m] = kataloge[i]; });
        antwort.module = imKurs.map(({ id, kurs, bereich, titel, kurz, nr }) => ({ id, kurs, bereich, titel, kurz, nr }));
      }
      return res.json(antwort);
    } catch (error) { return fehler(res, error); }
  });

  app.post("/api/nt9/fortschritt/melden", async (req, res) => {
    try {
      const body = req.body || {};
      const code = String(body.code || "").trim(), klasse = String(body.klasse || "").trim().toUpperCase();
      const modul = String(body.modul || "");
      if (!MODUL_IDS.includes(modul) && !DYN_MUSTER.test(modul)) return res.status(400).json({ ok: false, error: "Unbekanntes Modul." });
      if (!(await pruefen(req, res, code, klasse))) return;
      if (!(await modulBekannt(modul, body.meta, klasse))) return res.status(400).json({ ok: false, error: "Unbekanntes Modul." });
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
      const kurs = KURS_IDS.includes(req.body.kurs) ? req.body.kurs : null;
      const alle = await alleModule();
      const ids = alle.filter((m) => !kurs || m.kurs === kurs).map((m) => m.id);
      const codes = (await store.smembers("nt9:codes")).filter((c) => /^\d{3}$/.test(c)).sort();
      const stamm = await store.mget(codes.map(sKey));
      const pKeys = [];
      codes.forEach((c) => ids.forEach((m) => pKeys.push(pKey(c, m))));
      const [staende, kataloge] = await Promise.all([pKeys.length ? store.mget(pKeys) : [], store.mget(ids.map(kKey))]);
      const schueler = [];
      codes.forEach((code, i) => {
        const s = stamm[i];
        if (!s) return;
        klasseVon.set(code, s.klasse);
        const module = {};
        ids.forEach((m, j) => {
          const p = staende[i * ids.length + j];
          if (p) module[m] = { g: p.g || {}, t: p.t || 0, z: p.z || 0 };
        });
        schueler.push({ code, klasse: s.klasse, angelegt: s.angelegt || 0, module });
      });
      const katalog = {};
      ids.forEach((m, i) => { if (kataloge[i]) katalog[m] = kataloge[i]; });
      return res.json({ ok: true, speicher: store.art, kurs, kurse: KURSE.map((k) => ({ id: k.id, titel: k.titel })), module: alle, klassen: KLASSEN, schueler, katalog });
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
      const alle = await alleModule();
      await store.del([sKey(code), ...alle.map((m) => pKey(code, m.id))]);
      await store.srem("nt9:codes", code);
      klasseVon.delete(code);
      return res.json({ ok: true });
    } catch (error) { return fehler(res, error); }
  });

  return { store };
}

// Zugangsdaten aus dem Render-Dashboard großzügig lesen: ganze .env-Zeile, Anführungszeichen,
// Leerzeichen, Adresse ohne https:// (so steht sie im Feld „Endpoint“) und vertauschte Werte
function upstashZugang(env) {
  const wert = (v, name) => {
    let s = String(v || "").trim();
    if (s.toUpperCase().startsWith(name + "=")) s = s.slice(name.length + 1);
    return s.trim().replace(/^["']+|["']+$/g, "").trim();
  };
  const adresse = (v) => (v && !/^https?:\/\//i.test(v) && /^[a-z0-9.-]+\.upstash\.io\/?$/i.test(v) ? "https://" + v : v);
  let url = adresse(wert(env.UPSTASH_REDIS_REST_URL, "UPSTASH_REDIS_REST_URL"));
  let token = wert(env.UPSTASH_REDIS_REST_TOKEN, "UPSTASH_REDIS_REST_TOKEN");
  if (url && token && !/upstash\.io/i.test(url) && /upstash\.io/i.test(token)) [url, token] = [adresse(token), url];
  let hinweis = "";
  if (url && !/upstash\.io/i.test(url)) hinweis = "In UPSTASH_REDIS_REST_URL steht keine Upstash-Adresse (…upstash.io)";
  else if (/\s/.test(url)) hinweis = "UPSTASH_REDIS_REST_URL enthält Leerzeichen";
  return { url, token, hinweis };
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

// Katalog { id: [Bezeichnung, Station oder Teil] } – nur übernehmen, was harmlos und klein ist
function katalogPruefen(v) {
  if (!v || typeof v !== "object" || Array.isArray(v)) return null;
  const out = {};
  let n = 0;
  for (const [id, wert] of Object.entries(v)) {
    if (!/^[A-Za-z0-9_-]{1,60}$/.test(id) || !Array.isArray(wert)) continue;
    out[id] = [String(wert[0] || id).replace(/[<>]/g, "").slice(0, 140), String(wert[1] || "").replace(/[<>"]/g, "").trim().slice(0, 30)];
    if (++n >= MAX_AUFGABEN) break;
  }
  return n ? out : null;
}

module.exports = { registerNt9FortschrittRoutes, upstashStore, dateiStore, upstashZugang, MODULE, KURSE };
