"use strict";

/**
 * Lernfortschritt mit Code für die Klassen 7 bis 9 (NT, Deutsch, Englisch, Informatik).
 * Ein Code je Kind gilt in allen Fächern. (Der Name „nt9“ in Routen und Schlüsseln stammt aus der
 * ersten Fassung für NT 9 und bleibt, damit vorhandene Codes und Seiten weiter funktionieren.)
 *
 * Klassen: echte Klassennamen wie „7aM“, „7b“, „8c“, „9d“. Daraus folgen Stufe und Zug:
 * mit „M“ = M-Zug, ohne = R-Klasse (7b -> 7R). Ältere Codes tragen nur den Zug („9M“, „9R“).
 *
 * Kurse (KURSE) gibt es je Fach und Stufe, mit den Zügen, für die es Inhalte gibt. Feste Module stehen
 * in KURSE (NT 9, Englisch 9 Grammatik Unit 1). Alle anderen Übungsseiten melden sich beim ersten Melden
 * selbst an: Kennung „<fach><stufe>-…“ (nt7-, d9-, e8-, i9- …) plus meta { bereich, bnr, titel, kurz, nr }.
 * Der Server merkt sich dazu, in welchen Zügen die Seite benutzt wurde (klassen: „9M“, „7R“ …).
 *
 * Namen speichert der Server nicht: Die Zuordnung Code -> Name führt die Lehrkraft getrennt
 * (die Lehrerseite hält sie nur im Browser der Lehrkraft), wie es die Datenschutzhinweise vorsehen.
 *
 * Gespeichert wird dauerhaft in Upstash Redis (UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN), sonst
 * flüchtig in data/nt9-fortschritt.json. Der kostenlose Upstash-Tarif erlaubt 500 000 Befehle im Monat.
 * Deshalb hält der Server alle Kinder im Arbeitsspeicher (er läuft als eine Instanz) und schreibt
 * Änderungen gesammelt alle paar Sekunden mit einem MSET. Beim Beenden schreibt er sofort.
 *
 * Schlüssel:
 *   nt9:codes                 Menge aller Codes
 *   nt9:c:<code>              { code, klasse, angelegt, lrs?, p: { modul: { g: { aufgabe: Zeitpunkt }, t, z, f?, v?, r?, rn?, rw?, rv?, rm?, ab?, abn? } } }
 *                             (lrs: Notenschutz LRS, Rechtschreibung zählt in Proben nicht – setzt die Lehrkraft;
 *                              v: Fehlversuche je Aufgabe vor dem ersten richtigen Lösen, 0 = auf Anhieb richtig;
 *                              r: Zeitpunkt des letzten Zurücksetzens, rn: wie oft, rw: "k" Kind / "l" Lehrkraft;
 *                              rv: [gelöst, gesamt] – Stand der Pflichtaufgaben vor dem letzten Zurücksetzen;
 *                              rm: [gelöst, gesamt] – der beste Stand vor irgendeinem Zurücksetzen, wenn er besser ist als rv;
 *                              ab: das Modul war vor einem Zurücksetzen schon vollständig gelöst (Zeitpunkt der
 *                                  letzten gelösten Aufgabe), abn: wie oft – bleibt über weitere Zurücksetzungen stehen)
 *   nt9:k:<modul>             { aufgabe: [Bezeichnung, Station oder Teil] }  (Aufgabenkatalog von den Seiten)
 *   nt9:mods / nt9:mm:<modul> selbst angemeldete Module { id, kurs, bereich, bnr, titel, kurz, nr, klassen }
 *   (alt, wird beim ersten Laden übernommen und gelöscht: nt9:s:<code>, nt9:p:<code>:<modul>)
 *
 * Routen (Schüler):
 *   POST /api/nt9/fortschritt/anmelden { code, klasse?, kurs?, katalog?, modul? }
 *        -> { ok, code, klasse, zug, fortschritt: { modul: { g: [ids], t } }, katalog?, module?, modulOk? }
 *        (klasse: Zug der Seite, z. B. „9M“ in NT 9 – passt der Code nicht dazu: 409;
 *         modul: modulOk sagt, ob der Server das Modul samt Aufgabenliste schon kennt)
 *   POST /api/nt9/fortschritt/melden   { code, klasse?, modul, geloest: [ids], gesamt, katalog?, meta?, fehler? } -> { ok, anzahl }
 *        (fehler: Fehlerwörter der Vokabeltrainer { wort: [wie oft falsch, wie oft hintereinander richtig] },
 *         immer die ganze Liste des Moduls; anmelden liefert sie als fortschritt[modul].f zurück)
 *        (versuche?: { aufgabe: Fehlversuche } – je Aufgabe gilt der größere Wert; anmelden liefert sie als .v zurück.
 *         r?: Stand des Geräts beim Zurücksetzen. Ist das Modul seither zurückgesetzt worden, übernimmt der Server
 *         nichts und antwortet { ok, zurueckgesetzt: r } – das Gerät leert dann seinen eigenen Stand.)
 *   POST /api/nt9/fortschritt/zuruecksetzen { code, klasse?, modul } -> { ok, r }
 *        (Das Kind beginnt ein Modul neu: gelöste Aufgaben und Fehlversuche weg, r/rn/rw merken es sich.
 *         Für die Lehrkraft bleibt stehen, wie weit das Kind vorher war: rv, und ab/abn, wenn das Modul fertig war.)
 * Routen (Lehrkraft, Passwort im Body):
 *   POST …/lehrer/zuruecksetzen { password, modul, code } oder { password, modul, klasse } -> { ok, anzahl, r }
 *   POST …/lehrer/aufgaben-entfernen { password, eintraege: [{ code, modul, aufgaben: [ids], z? }] } -> { ok, entfernt, kinder }
 *        (nimmt genau diese gelösten Aufgaben wieder heraus, z. B. nach einer Vorführung; alles andere bleibt)
 *   POST …/lehrer/liste       { password, kurs?, klasse? } -> { ok, speicher, kurse, module, klassen, klassenInfo, schueler, katalog }
 *   POST …/lehrer/anlegen     { password, klasse, anzahl } -> { ok, neu: [{ code, klasse }] }
 *   POST …/lehrer/loeschen    { password, code } oder { password, klasse }  -> { ok, anzahl }
 *   POST …/lehrer/umbenennen  { password, von, nach }    -> { ok, anzahl }   (z. B. 9M -> 9aM)
 *   POST …/lehrer/lrs         { password, code, lrs }    -> { ok, code, lrs } (Notenschutz LRS an/aus)
 *   POST …/lehrer/namen       { password }               -> { ok, blob, version }   Namensliste der Lehrkraft, nur Schlüsseltext
 *   POST …/lehrer/namen/sichern  { password, blob, version } -> { ok, version } | 409 { blob, version }
 *   POST …/lehrer/namen/loeschen { password }             -> { ok }
 *   GET  …/status -> { ok, speicher, verbunden }
 */

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { beimBeenden } = require("./beenden");

const FAECHER = { nt: "Natur und Technik", gpg: "Geschichte/Politik/Geographie", d: "Deutsch", e: "Englisch", i: "Informatik" };
// Kurse je Fach und Stufe; zuege = Züge, für die es Inhalte gibt
const KURSE = [
  { id: "nt7", fach: "nt", stufe: 7, zuege: ["M", "R"], titel: "NT 7", module: [] },
  { id: "nt8", fach: "nt", stufe: 8, zuege: ["M", "R"], titel: "NT 8", module: [] },
  { id: "gpg8", fach: "gpg", stufe: 8, zuege: ["M", "R"], titel: "GPG 8", module: [] },
  { id: "nt9", fach: "nt", stufe: 9, zuege: ["M", "R"], titel: "NT 9 · Organische Rohstoffe", module: [
    { id: "m01", nr: 1, kurz: "Modul 1", titel: "Kohlenstoff, Holz und Raps" },
    { id: "m02", nr: 2, kurz: "Modul 2", titel: "Biodiesel, Stärke und Nachhaltigkeit" },
    { id: "m04", nr: 3, kurz: "Modul 3", titel: "Entstehung fossiler Rohstoffe" },
    { id: "m05", nr: 4, kurz: "Modul 4", titel: "Erdölaufbereitung und Fraktionen" },
    { id: "m06", nr: 5, kurz: "Modul 5", titel: "Kohlenstoffkreislauf und Treibhauseffekt" },
    { id: "m07", nr: 6, kurz: "Modul 6", titel: "Erdöl – Rohstoff mit Zukunft?" },
    { id: "m08", nr: 7, kurz: "Modul 7", titel: "Ohne Erdöl – geht das?" }
  ].map((m) => ({ ...m, bereich: "Organische Rohstoffe", bnr: 1 })) },
  { id: "d7", fach: "d", stufe: 7, zuege: ["M", "R"], titel: "Deutsch 7", module: [] },
  { id: "d8", fach: "d", stufe: 8, zuege: ["M", "R"], titel: "Deutsch 8", module: [] },
  { id: "d9", fach: "d", stufe: 9, zuege: ["M", "R"], titel: "Deutsch 9", module: [] },
  { id: "e7", fach: "e", stufe: 7, zuege: ["M", "R"], titel: "Englisch 7", module: [] },
  { id: "e8", fach: "e", stufe: 8, zuege: ["M", "R"], titel: "Englisch 8", module: [] },
  { id: "e9", fach: "e", stufe: 9, zuege: ["M", "R"], titel: "Englisch 9", module: [
    { id: "e9u1g1", nr: 1, kurz: "G1", titel: "Simple past" },
    { id: "e9u1g2", nr: 2, kurz: "G2", titel: "Will-future" },
    { id: "e9u1g3", nr: 3, kurz: "G3", titel: "If-clauses I" },
    { id: "e9u1g4", nr: 4, kurz: "G4", titel: "Present progressive" }
  ].map((m) => ({ ...m, bereich: "Unit 1 · Grammatik", bnr: 1 })) },
  { id: "i7", fach: "i", stufe: 7, zuege: ["M", "R"], titel: "Informatik 7", module: [] },
  { id: "i8", fach: "i", stufe: 8, zuege: ["M", "R"], titel: "Informatik 8", module: [] },
  { id: "i9", fach: "i", stufe: 9, zuege: ["M", "R"], titel: "Informatik 9", module: [] }
];
const KURS_IDS = KURSE.map((k) => k.id);
const MODULE = [];
KURSE.forEach((k) => k.module.forEach((m) => MODULE.push({ ...m, kurs: k.id })));
const MODUL_IDS = MODULE.map((m) => m.id);
// Selbst angemeldete Übungsseiten: <fach><stufe>-…
const DYN_MUSTER = /^(nt|gpg|d|e|i)([5-9]|10)-[a-z0-9-]{2,60}$/;
const MAX_DYN = 1500;
const MAX_CODES = 900; // 3-stellige Codes: 100 bis 999
const MAX_AUFGABEN = 300;
// Kurse, in denen ein Modul zurückgesetzt werden darf (Kind auf der Modulseite, Lehrkraft in der Verwaltung).
// NT 7 (Erprobung, Wunsch vom 12.10.2026) und Deutsch 7 (Wunsch vom selben Tag). Voraussetzung für einen weiteren
// Kurs: Alle seine Seiten melden über js/lernstand.js (das schickt „r“ mit) – sonst nähme der Server nach einem
// Zurücksetzen nichts mehr an. (Deutsch 7: Der Argumentations-Führerschein meldet selbst und schickt „r“ ebenfalls.)
const RESET_KURSE = ["nt7", "d7"];
// Englisch 8M (Wunsch vom 13.10.2026): Die 8M-Seiten liegen im Kurs „e8“ neben denen der 8R und tragen die Kennung
// e8-m-… – nur sie dürfen neu begonnen werden, die 8R-Seiten (e8-u…) bleiben, wie sie sind.
const RESET_PREFIXE = ["e8-m-"];
// Fehlversuche bei der Anmeldung: die ganze Schule hat oft nur eine IP, darum großzügig
const FEHL_FENSTER_MS = 10 * 60 * 1000;
const FEHL_MAX = 60;

/* ---------- Klassen ---------- */

// „9aM“, „9 a m“ -> „9aM“; „7b“ -> „7b“; „9M“/„9r“ (nur Zug, ältere Codes) -> „9M“/„9R“; sonst ""
function klasseNorm(v) {
  const s = String(v || "").replace(/\s+/g, "");
  let m = /^(5|6|7|8|9|10)([MR])$/i.exec(s);
  if (m) return m[1] + m[2].toUpperCase();
  // „9dR“ ist dieselbe Klasse wie „9d“: R-Klassen stehen ohne Endung, M-Klassen mit „M“
  m = /^(5|6|7|8|9|10)([a-z])([mr]?)$/i.exec(s);
  if (m) return m[1] + m[2].toLowerCase() + (/m/i.test(m[3]) ? "M" : "");
  return "";
}
// Zug einer Klasse: „7aM“ -> „7M“, „7b“ -> „7R“, „9R“ -> „9R“
function zugVon(klasse) {
  const k = klasseNorm(klasse);
  if (!k) return "";
  return parseInt(k, 10) + (/M$/.test(k) ? "M" : "R");
}
// Lehrercode: ein fester Code für die Lehrkraft. Mit ihm sind in den Übersichten alle Module aller Klassen offen
// (die Routen …/freigabe melden dann „alles: true“). Er gehört zu keiner Klasse: kein Lernstand, keine Proben, keine
// abgegebenen Dateien, kein Hausaufgabenheft. Die Codes der Kinder liegen zwischen 100 und 999 – ein Code, der mit
// 0 beginnt, kann deshalb nie einem Kind gehören. Umgebungsvariable LEHRER_CODE: drei Ziffern mit führender 0
// (z. B. „042“) ändert ihn, „aus“ schaltet ihn ab; ohne Angabe gilt „000“.
const LEHRER_KLASSE = "Lehrkraft";
function lehrerCode(env = process.env) {
  const v = String((env && env.LEHRER_CODE) || "").trim();
  if (/^aus$/i.test(v)) return "";
  return /^0\d\d$/.test(v) ? v : "000";
}
function kursVon(modul) {
  if (MODUL_IDS.includes(modul)) return MODULE.find((m) => m.id === modul).kurs;
  const m = DYN_MUSTER.exec(modul);
  return m && KURS_IDS.includes(m[1] + m[2]) ? m[1] + m[2] : "";
}

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
    // paare: [[key, value], …] – ein Befehl für alle
    mset: async (paare) => { if (paare.length) await cmd("MSET", ...paare.flatMap(([k, v]) => [k, JSON.stringify(v)])); },
    del: async (keys) => { if (keys.length) await cmd("DEL", ...keys); },
    sadd: async (set, members) => { const m = [].concat(members); if (m.length) await cmd("SADD", set, ...m); },
    srem: async (set, members) => { const m = [].concat(members); if (m.length) await cmd("SREM", set, ...m); },
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
        console.error("Lernfortschritt: Datendatei konnte nicht gelesen werden:", error.message);
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
    mset: async (paare) => { const d = laden(); paare.forEach(([k, v]) => { d[k] = copy(v); }); sichern(); },
    del: async (keys) => { keys.forEach((k) => delete laden()[k]); sichern(); },
    sadd: async (set, members) => { const d = laden(); const s = new Set(d[set] || []); [].concat(members).forEach((m) => s.add(m)); d[set] = [...s]; sichern(); },
    srem: async (set, members) => { const d = laden(); const weg = new Set([].concat(members)); d[set] = (d[set] || []).filter((m) => !weg.has(m)); sichern(); },
    smembers: async (set) => [...(laden()[set] || [])]
  };
}

function parse(raw) {
  if (raw === null || raw === undefined) return null;
  try { return JSON.parse(raw); } catch (_error) { return null; }
}

// Große Mengen in Stücken lesen/schreiben (Upstash: höchstens 1 MB je Anfrage)
async function mgetStuecke(store, keys, n = 100) {
  const out = [];
  for (let i = 0; i < keys.length; i += n) out.push(...(await store.mget(keys.slice(i, i + n))));
  return out;
}
async function msetStuecke(store, paare, maxBytes = 600000) {
  let stueck = [], groesse = 0;
  for (const p of paare) {
    const g = JSON.stringify(p[1]).length + p[0].length + 16;
    if (stueck.length && groesse + g > maxBytes) { await store.mset(stueck); stueck = []; groesse = 0; }
    stueck.push(p); groesse += g;
  }
  if (stueck.length) await store.mset(stueck);
}

/* ---------- Routen ---------- */

let beendenAngemeldet = false;

function registerNt9FortschrittRoutes(app, options = {}) {
  const teacherPassword = String(options.teacherPassword || "2");
  const env = options.env || process.env;
  const { url: upUrl, token: upToken, hinweis: upHinweis } = upstashZugang(env);
  const store = options.store || (upUrl && upToken
    ? upstashStore(upUrl, upToken, options.fetch)
    : dateiStore(path.join(options.dataDir || path.join(__dirname, "..", "data"), "nt9-fortschritt.json")));
  const now = options.now || (() => Date.now());
  const FLUSH_MS = options.flushMs === undefined ? 6000 : options.flushMs;
  const fehlversuche = new Map(); // IP -> { n, bis }

  const sKey = (code) => `nt9:s:${code}`;
  const cKey = (code) => `nt9:c:${code}`;
  const pKey = (code, modul) => `nt9:p:${code}:${modul}`;
  const kKey = (modul) => `nt9:k:${modul}`;
  const mmKey = (modul) => `nt9:mm:${modul}`;

  /* --- Selbst angemeldete Module --- */
  // Deutsch 7 hat seit dem 06.10.2026 sechs Themenbereiche. Module, die sich früher angemeldet haben (oder die eine
  // noch nicht neu geladene Seite meldet), tragen die alten Namen und Nummern ihrer Bereiche – angleichen, damit
  // die Lehrkraft im Lernstand keinen Bereich doppelt sieht.
  const D7_BEREICHE = { "Grammatik": ["Grammatik und Sprache", 5], "Rechtschreibung": ["Rechtschreibung und Sprachtraining", 6], "Argumentieren und diskutieren": ["Argumentieren und diskutieren", 3] };
  const bereichHeute = (m) => (m && m.kurs === "d7" && D7_BEREICHE[m.bereich] ? { ...m, bereich: D7_BEREICHE[m.bereich][0], bnr: D7_BEREICHE[m.bereich][1] } : m);
  let dynCache = null;
  async function dynLaden() {
    if (dynCache) return dynCache;
    const ids = (await store.smembers("nt9:mods")).filter((id) => DYN_MUSTER.test(id));
    const metas = await mgetStuecke(store, ids.map(mmKey));
    const karte = new Map();
    ids.forEach((id, i) => { if (metas[i]) karte.set(id, bereichHeute(metas[i])); });
    dynCache = karte;
    return karte;
  }
  function metaSaeubern(id, meta) {
    const zahl = (v, max) => Math.max(0, Math.min(max, parseInt(v, 10) || 0));
    const text = (v, n) => String(v || "").replace(/[<>"]/g, "").replace(/\s+/g, " ").trim().slice(0, n);
    return { id, kurs: kursVon(id), bereich: text(meta.bereich, 60) || "Weitere Übungen", bnr: zahl(meta.bnr, 99),
      titel: text(meta.titel, 90) || id, kurz: text(meta.kurz, 24), nr: zahl(meta.nr, 999), klassen: [] };
  }
  // true, wenn das Modul bekannt ist (fest oder selbst angemeldet); meldet es bei Bedarf an
  async function modulBekannt(id, meta, zug) {
    if (MODUL_IDS.includes(id)) return true;
    if (!kursVon(id)) return false;
    const dyn = await dynLaden();
    const alt = dyn.get(id);
    if (!alt && !(meta && typeof meta === "object")) return false;
    if (!alt && dyn.size >= MAX_DYN) return false;
    const neu = bereichHeute(meta && typeof meta === "object" ? metaSaeubern(id, meta) : { ...alt });
    neu.klassen = [...new Set([...(alt ? alt.klassen || [] : []), ...(zug ? [zug] : [])])].sort();
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
    const liste = [...MODULE, ...[...dyn.values()].filter((m) => KURS_IDS.includes(m.kurs))];
    return liste.sort((a, b) => {
      const x = ordnung(a), y = ordnung(b);
      for (let i = 0; i < x.length; i++) {
        if (x[i] < y[i]) return -1;
        if (x[i] > y[i]) return 1;
      }
      return 0;
    });
  }

  /* --- Kataloge (im Speicher, geschrieben wird nur bei Änderung) --- */
  const katCache = new Map(); // Modul -> { k: Katalog, json } oder null
  async function katalogeHolen(ids) {
    const fehlt = ids.filter((id) => !katCache.has(id));
    if (fehlt.length) {
      const werte = await mgetStuecke(store, fehlt.map(kKey));
      fehlt.forEach((id, i) => katCache.set(id, werte[i] ? { k: werte[i], json: JSON.stringify(werte[i]) } : null));
    }
    const out = {};
    ids.forEach((id) => { const e = katCache.get(id); if (e) out[id] = e.k; });
    return out;
  }
  async function katalogSichern(modul, katalog) {
    const json = JSON.stringify(katalog);
    await katalogeHolen([modul]);
    const alt = katCache.get(modul);
    if (alt && alt.json === json) return;
    await store.set(kKey(modul), katalog);
    katCache.set(modul, { k: katalog, json });
  }

  /* --- Kinder: alle im Arbeitsspeicher, Änderungen gesammelt schreiben --- */
  let kinderCache = null, ladeVersprechen = null;
  function kinderLaden() {
    if (kinderCache) return Promise.resolve(kinderCache);
    if (!ladeVersprechen) {
      ladeVersprechen = (async () => {
        const codes = (await store.smembers("nt9:codes")).filter((c) => /^\d{3}$/.test(c));
        const karte = new Map(), fehlt = [];
        const saetze = await mgetStuecke(store, codes.map(cKey));
        codes.forEach((c, i) => { if (saetze[i] && saetze[i].klasse) karte.set(c, satzSaeubern(c, saetze[i])); else fehlt.push(c); });
        if (fehlt.length) await uebernehmen(fehlt, karte);
        kinderCache = karte;
        return karte;
      })().finally(() => { ladeVersprechen = null; });
    }
    return ladeVersprechen;
  }
  function satzSaeubern(code, s) {
    return { code, klasse: klasseNorm(s.klasse) || "9M", angelegt: s.angelegt || 0, ...(s.lrs ? { lrs: true } : {}), p: s.p && typeof s.p === "object" ? s.p : {} };
  }
  // Ältere Speicherform (je Kind und Modul ein Schlüssel) in einen Satz je Kind übernehmen
  async function uebernehmen(codes, karte) {
    const stamm = await mgetStuecke(store, codes.map(sKey));
    const modIds = [...MODULE.map((m) => m.id), ...(await dynLaden()).keys()];
    const pk = [];
    codes.forEach((c) => modIds.forEach((m) => pk.push(pKey(c, m))));
    const staende = await mgetStuecke(store, pk, 200);
    const neu = [], alt = [];
    codes.forEach((c, i) => {
      const s = stamm[i];
      if (!s) return;
      const satz = satzSaeubern(c, s);
      modIds.forEach((m, j) => {
        const p = staende[i * modIds.length + j];
        if (p && p.g) satz.p[m] = { g: p.g, t: p.t || 0, z: p.z || 0 };
      });
      karte.set(c, satz);
      neu.push([cKey(c), satz]);
      alt.push(sKey(c), ...modIds.map((m) => pKey(c, m)));
    });
    if (neu.length) {
      await msetStuecke(store, neu);
      for (let i = 0; i < alt.length; i += 200) await store.del(alt.slice(i, i + 200));
    }
  }

  const schmutzig = new Set();
  let flushTimer = null, flushLaeuft = null;
  async function flush() {
    if (flushTimer) { clearTimeout(flushTimer); flushTimer = null; }
    if (flushLaeuft) await flushLaeuft;
    if (!schmutzig.size || !kinderCache) return;
    const codes = [...schmutzig];
    schmutzig.clear();
    const paare = codes.map((c) => kinderCache.get(c)).filter(Boolean).map((s) => [cKey(s.code), s]);
    flushLaeuft = msetStuecke(store, paare).catch((error) => {
      console.error("Lernfortschritt: Schreiben fehlgeschlagen:", error.message);
      codes.forEach((c) => schmutzig.add(c));
      if (!flushTimer) { flushTimer = setTimeout(flush, Math.max(FLUSH_MS, 1000) * 4); if (flushTimer.unref) flushTimer.unref(); }
    }).finally(() => { flushLaeuft = null; });
    await flushLaeuft;
  }
  async function geaendert(code) {
    schmutzig.add(code);
    if (FLUSH_MS <= 0) { await flush(); return; }
    if (!flushTimer) { flushTimer = setTimeout(flush, FLUSH_MS); if (flushTimer.unref) flushTimer.unref(); }
  }
  // Beim Beenden (Render schickt SIGTERM) noch alles schreiben
  if (options.beimBeendenSichern !== false && !beendenAngemeldet) {
    beendenAngemeldet = true;
    beimBeenden(flush);
  }

  /* --- Hilfen --- */
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
  // Kind zum Code; schreibt bei Fehlern selbst die Antwort. klasse (optional): Zug der Seite
  // Lehrercode (siehe oben): options.lehrerCode überschreibt die Umgebungsvariable (Tests), "" = abgeschaltet
  const LEHRER = options.lehrerCode !== undefined ? String(options.lehrerCode || "") : lehrerCode();
  const istLehrer = (code) => Boolean(LEHRER) && String(code || "").trim() === LEHRER;
  async function kindPruefen(req, res, code, klasse) {
    if (!/^\d{3}$/.test(code)) { res.status(400).json({ ok: false, error: "Der Code hat genau 3 Ziffern." }); return null; }
    // Die Lehrkraft gehört zu keiner Klasse: Die Klasse der Seite (z. B. „9M“) wird nicht verglichen
    if (istLehrer(code)) return { code, klasse: LEHRER_KLASSE, p: {}, lehrer: true };
    const kz = klasse ? klasseNorm(klasse) : "";
    if (klasse && !kz) { res.status(400).json({ ok: false, error: "Unbekannte Klasse." }); return null; }
    const kind = (await kinderLaden()).get(code);
    if (!kind) {
      fehlversuch(req);
      res.status(404).json({ ok: false, error: "Diesen Code gibt es nicht. Frag deine Lehrkraft." });
      return null;
    }
    if (kz && zugVon(kz) !== zugVon(kind.klasse)) {
      res.status(409).json({ ok: false, klasse: kind.klasse, error: `Dieser Code gehört zur Klasse ${kind.klasse}. Öffne die Seite deiner Klasse.` });
      return null;
    }
    return kind;
  }
  const fehler = (res, error) => {
    console.error("Lernfortschritt:", error.message);
    res.status(503).json({ ok: false, error: "Der Speicher ist gerade nicht erreichbar. Versuch es gleich noch einmal." });
  };
  const kursInfo = () => KURSE.map((k) => ({ id: k.id, fach: k.fach, fachName: FAECHER[k.fach], stufe: k.stufe, zuege: k.zuege, titel: k.titel }));

  /* --- Schüler --- */
  app.get("/api/nt9/fortschritt/status", async (_req, res) => {
    let verbunden = false, grund = "";
    try { verbunden = await store.ping(); } catch (error) {
      console.error("Lernfortschritt status:", error.message);
      grund = fehlerGrund(error) + (upHinweis ? ". " + upHinweis : "");
    }
    res.json({ ok: true, speicher: store.art, verbunden, ...(grund ? { grund } : {}) });
  });

  app.post("/api/nt9/fortschritt/anmelden", async (req, res) => {
    try {
      if (gesperrt(req)) return res.status(429).json({ ok: false, error: "Zu viele falsche Codes. Warte ein paar Minuten." });
      const body = req.body || {};
      const kind = await kindPruefen(req, res, String(body.code || "").trim(), String(body.klasse || "").trim());
      if (!kind) return;
      const fortschritt = {};
      Object.keys(kind.p).forEach((m) => {
        const p = kind.p[m];
        if (p && p.g) fortschritt[m] = { g: Object.keys(p.g), t: p.t || 0, ...(p.f ? { f: p.f } : {}), ...(p.v ? { v: p.v } : {}), ...(p.r ? { r: p.r } : {}) };
      });
      const antwort = { ok: true, code: kind.code, klasse: kind.klasse, zug: zugVon(kind.klasse), fortschritt };
      if (kind.lehrer) antwort.lehrer = true;
      const modul = String(body.modul || "");
      if (modul && kursVon(modul)) {
        const bekannt = MODUL_IDS.includes(modul) || (await dynLaden()).has(modul);
        antwort.modulOk = bekannt && Boolean((await katalogeHolen([modul]))[modul]);
      }
      if (body.katalog === true) {
        const module = await alleModule();
        const imKurs = KURS_IDS.includes(body.kurs) ? module.filter((m) => m.kurs === body.kurs) : module;
        antwort.katalog = await katalogeHolen(imKurs.map((m) => m.id));
        antwort.module = imKurs.map(({ id, kurs, bereich, titel, kurz, nr }) => ({ id, kurs, bereich, titel, kurz, nr }));
      }
      return res.json(antwort);
    } catch (error) { return fehler(res, error); }
  });

  app.post("/api/nt9/fortschritt/melden", async (req, res) => {
    try {
      const body = req.body || {};
      const modul = String(body.modul || "");
      if (!kursVon(modul)) return res.status(400).json({ ok: false, error: "Unbekanntes Modul." });
      const kind = await kindPruefen(req, res, String(body.code || "").trim(), String(body.klasse || "").trim());
      if (!kind) return;
      // Lehrercode: Es wird nichts gespeichert – weder der Lernstand noch das Modul oder sein Katalog
      if (kind.lehrer) return res.json({ ok: true, anzahl: 0, lehrer: true });
      if (!(await modulBekannt(modul, body.meta, zugVon(kind.klasse)))) return res.status(400).json({ ok: false, error: "Unbekanntes Modul." });
      const geloest = aufgabenListe(body.geloest);
      const gesamt = Math.max(0, Math.min(MAX_AUFGABEN, parseInt(body.gesamt, 10) || 0));
      const alt = kind.p[modul] || { g: {}, t: 0, z: 0 };
      // Zurückgesetzt, seit dieses Gerät seinen Stand geholt hat: nichts übernehmen (sonst käme der alte Stand wieder)
      if (alt.r && alt.r > (parseInt(body.r, 10) || 0)) {
        const katalogAlt = katalogPruefen(body.katalog);
        if (katalogAlt) await katalogSichern(modul, katalogAlt);
        return res.json({ ok: true, anzahl: Object.keys(alt.g || {}).length, zurueckgesetzt: alt.r });
      }
      const g = alt.g || {};
      const zeit = now();
      let neu = 0;
      geloest.forEach((id) => { if (!g[id] && Object.keys(g).length < MAX_AUFGABEN) { g[id] = zeit; neu++; } });
      const t = gesamt || alt.t || 0;
      const fehlerNeu = body.fehler !== undefined ? fehlerPruefen(body.fehler) : alt.f;
      const fehlerAnders = JSON.stringify(fehlerNeu || null) !== JSON.stringify(alt.f || null);
      // Fehlversuche: je Aufgabe der größere Wert (zwei Geräte zählen getrennt)
      let v = alt.v, versucheAnders = false;
      if (body.versuche !== undefined) {
        const gemeldet = versuchePruefen(body.versuche);
        v = Object.assign({}, alt.v || {});
        Object.keys(gemeldet).forEach((id) => { if (v[id] === undefined || gemeldet[id] > v[id]) { v[id] = gemeldet[id]; versucheAnders = true; } });
      }
      if (neu || t !== alt.t || !kind.p[modul] || fehlerAnders || versucheAnders) {
        kind.p[modul] = { g, t, z: neu || fehlerAnders || versucheAnders ? zeit : alt.z || zeit,
          ...(fehlerNeu && Object.keys(fehlerNeu).length ? { f: fehlerNeu } : {}),
          ...(v && Object.keys(v).length ? { v } : {}),
          ...resetFelder(alt) };
        await geaendert(kind.code);
      }
      const katalog = katalogPruefen(body.katalog);
      if (katalog) await katalogSichern(modul, katalog);
      return res.json({ ok: true, anzahl: Object.keys(g).length });
    } catch (error) { return fehler(res, error); }
  });

  /* --- Ein Modul neu beginnen (erst nur in den Kursen aus RESET_KURSE) ---
     Gelöste Aufgaben und Fehlversuche des Moduls werden gelöscht. r (Zeitpunkt) sagt jedem Gerät des Kindes, dass es
     seinen eigenen Stand leeren muss; Meldungen mit älterem r nimmt „melden“ nicht mehr an. Fehlerwörter (f) bleiben.
     Für die Lehrkraft bleibt vermerkt, wie weit das Kind vorher war (rv) – und ob es das Modul schon einmal ganz
     abgeschlossen hatte (ab, abn): Ein neu begonnenes Modul sieht sonst aus, als hätte das Kind nichts getan. */
  const resetErlaubt = (modul) => RESET_KURSE.includes(kursVon(modul)) || (Boolean(kursVon(modul)) && RESET_PREFIXE.some((p) => modul.startsWith(p)));
  // [gelöst, gesamt] der Pflichtaufgaben. „Plus“-Aufgaben sind für R-Klassen freiwillig und zählen dort nicht mit
  // (so rechnet auch die Verwaltung der Lehrkraft). Ohne Aufgabenliste zählt, was das Kind gemeldet hat.
  function pflichtStand(kind, p, katalog) {
    const g = (p && p.g) || {};
    if (katalog) {
      const r = /R$/.test(zugVon(kind.klasse));
      const pflicht = Object.keys(katalog).filter((id) => !(r && katalog[id][1] === "Plus"));
      return [pflicht.filter((id) => g[id]).length, pflicht.length];
    }
    const n = Object.keys(g).length;
    return [n, Math.max((p && p.t) || 0, n)];
  }
  function modulLeeren(kind, modul, wer, zeit, katalog) {
    const alt = kind.p[modul] || { g: {}, t: 0, z: 0 };
    const [geloest, gesamt] = pflichtStand(kind, alt, katalog);
    const fertig = gesamt > 0 && geloest >= gesamt;
    const zuletztGeloest = Math.max(0, ...Object.values(alt.g || {}).map((z) => Number(z) || 0));
    const vorher = geloest ? [geloest, gesamt] : alt.rv;
    // rm: der beste Stand, den das Kind vor irgendeinem Zurücksetzen je hatte (rv ist nur der Stand vor dem letzten).
    // Steht nur da, wenn er besser ist als rv – die Verwaltung zeigt damit den „maximal erreichten Fortschritt“.
    const anteil = (s) => (Array.isArray(s) && s[1] > 0 ? s[0] / s[1] : -1);
    const bester = [vorher, alt.rm, alt.rv].filter((s) => anteil(s) >= 0).sort((a, b) => anteil(b) - anteil(a) || b[0] - a[0])[0];
    kind.p[modul] = { g: {}, t: alt.t || 0, z: zeit, ...(alt.f ? { f: alt.f } : {}), r: zeit, rn: Math.min(999, (alt.rn || 0) + 1), rw: wer,
      ...(vorher ? { rv: vorher } : {}),
      ...(bester && anteil(bester) > anteil(vorher) ? { rm: bester } : {}),
      ...(fertig ? { ab: zuletztGeloest || zeit, abn: Math.min(999, (alt.abn || 0) + 1) } : alt.ab ? { ab: alt.ab, abn: alt.abn || 1 } : {}) };
  }
  app.post("/api/nt9/fortschritt/zuruecksetzen", async (req, res) => {
    try {
      if (gesperrt(req)) return res.status(429).json({ ok: false, error: "Zu viele falsche Codes. Warte ein paar Minuten." });
      const body = req.body || {};
      const modul = String(body.modul || "");
      if (!kursVon(modul)) return res.status(400).json({ ok: false, error: "Unbekanntes Modul." });
      if (!resetErlaubt(modul)) return res.status(400).json({ ok: false, error: "Zurücksetzen gibt es in diesem Fach noch nicht." });
      const kind = await kindPruefen(req, res, String(body.code || "").trim(), String(body.klasse || "").trim());
      if (!kind) return;
      const zeit = now();
      // Lehrercode: Es ist nichts gespeichert, also auch nichts zu löschen – das Gerät leert nur seinen eigenen Stand
      if (kind.lehrer) return res.json({ ok: true, r: zeit, lehrer: true });
      modulLeeren(kind, modul, "k", zeit, (await katalogeHolen([modul]))[modul]);
      await geaendert(kind.code);
      return res.json({ ok: true, r: zeit });
    } catch (error) { return fehler(res, error); }
  });

  /* --- Lehrkraft --- */
  function klassenUebersicht(kinder) {
    const n = {};
    kinder.forEach((k) => { n[k.klasse] = (n[k.klasse] || 0) + 1; });
    return Object.keys(n).sort((a, b) => parseInt(a, 10) - parseInt(b, 10) || a.localeCompare(b, "de"))
      .map((k) => ({ klasse: k, zug: zugVon(k), stufe: parseInt(k, 10), anzahl: n[k] }));
  }

  app.post("/api/nt9/fortschritt/lehrer/liste", async (req, res) => {
    if (!lehrerOk(req, res)) return;
    try {
      const body = req.body || {};
      const kurs = KURS_IDS.includes(body.kurs) ? body.kurs : null;
      const klasse = body.klasse ? klasseNorm(body.klasse) : "";
      // nurKlassen: nur Klassen und Codes, ohne Lernstand (für die Klassenauswahl)
      const nurKlassen = body.nurKlassen === true;
      const alle = nurKlassen ? [] : await alleModule();
      const module = alle.filter((m) => !kurs || m.kurs === kurs);
      const ids = module.map((m) => m.id);
      const kinder = [...(await kinderLaden()).values()];
      const info = klassenUebersicht(kinder);
      const schueler = kinder.filter((k) => !klasse || k.klasse === klasse).sort((a, b) => a.code.localeCompare(b.code)).map((k) => {
        const m = {};
        ids.forEach((id) => { const p = k.p[id]; if (p) m[id] = { g: p.g || {}, t: p.t || 0, z: p.z || 0, ...(p.f ? { f: p.f } : {}),
          ...(p.v ? { v: p.v } : {}), ...resetFelder(p) }; });
        return { code: k.code, klasse: k.klasse, angelegt: k.angelegt || 0, ...(k.lrs ? { lrs: true } : {}), module: m };
      });
      const katalog = await katalogeHolen(ids);
      return res.json({ ok: true, speicher: store.art, kurs, kurse: kursInfo(), module: kurs ? module : alle,
        klassen: info.map((k) => k.klasse), klassenInfo: info, schueler, katalog });
    } catch (error) { return fehler(res, error); }
  });

  app.post("/api/nt9/fortschritt/lehrer/anlegen", async (req, res) => {
    if (!lehrerOk(req, res)) return;
    try {
      const body = req.body || {};
      const klasse = klasseNorm(body.klasse);
      if (!klasse) return res.status(400).json({ ok: false, error: "Unbekannte Klasse. Beispiele: 7aM, 7b, 8c, 9d." });
      const anzahl = parseInt(body.anzahl, 10);
      if (!(anzahl >= 1 && anzahl <= 60)) return res.status(400).json({ ok: false, error: "Bitte 1 bis 60 Codes auf einmal anlegen." });
      const kinder = await kinderLaden();
      const vorhanden = new Set([...kinder.keys(), ...(await store.smembers("nt9:codes"))]);
      if (vorhanden.size + anzahl > MAX_CODES) return res.status(400).json({ ok: false, error: "Es gibt schon zu viele Codes. Lösche zuerst alte Klassen." });
      const frei = [];
      for (let c = 100; c <= 999; c++) if (!vorhanden.has(String(c))) frei.push(String(c));
      const neu = [];
      for (let i = 0; i < anzahl; i++) {
        const code = frei.splice(crypto.randomInt(frei.length), 1)[0];
        neu.push({ code, klasse, angelegt: now(), p: {} });
      }
      await msetStuecke(store, neu.map((s) => [cKey(s.code), s]));
      await store.sadd("nt9:codes", neu.map((s) => s.code));
      neu.forEach((s) => kinder.set(s.code, s));
      return res.json({ ok: true, neu: neu.map((s) => ({ code: s.code, klasse })) });
    } catch (error) { return fehler(res, error); }
  });

  app.post("/api/nt9/fortschritt/lehrer/loeschen", async (req, res) => {
    if (!lehrerOk(req, res)) return;
    try {
      const body = req.body || {};
      const kinder = await kinderLaden();
      let codes;
      if (body.klasse !== undefined) {
        const klasse = klasseNorm(body.klasse);
        if (!klasse) return res.status(400).json({ ok: false, error: "Unbekannte Klasse." });
        codes = [...kinder.values()].filter((k) => k.klasse === klasse).map((k) => k.code);
      } else {
        const code = String(body.code || "");
        if (!/^\d{3}$/.test(code)) return res.status(400).json({ ok: false, error: "Ungültiger Code." });
        codes = [code];
      }
      if (codes.length) {
        await store.del(codes.map(cKey));
        await store.srem("nt9:codes", codes);
        codes.forEach((c) => { kinder.delete(c); schmutzig.delete(c); });
      }
      return res.json({ ok: true, anzahl: codes.length });
    } catch (error) { return fehler(res, error); }
  });

  // Ein Modul zurücksetzen: für ein Kind (code) oder für alle Kinder einer Klasse (klasse)
  app.post("/api/nt9/fortschritt/lehrer/zuruecksetzen", async (req, res) => {
    if (!lehrerOk(req, res)) return;
    try {
      const body = req.body || {};
      const modul = String(body.modul || "");
      if (!kursVon(modul)) return res.status(400).json({ ok: false, error: "Unbekanntes Modul." });
      if (!resetErlaubt(modul)) return res.status(400).json({ ok: false, error: "Zurücksetzen gibt es in diesem Fach noch nicht." });
      const kinder = await kinderLaden();
      let liste;
      if (body.klasse !== undefined) {
        const klasse = klasseNorm(body.klasse);
        if (!klasse) return res.status(400).json({ ok: false, error: "Unbekannte Klasse." });
        liste = [...kinder.values()].filter((k) => k.klasse === klasse);
      } else {
        const code = String(body.code || "");
        if (!/^\d{3}$/.test(code)) return res.status(400).json({ ok: false, error: "Ungültiger Code." });
        const kind = kinder.get(code);
        if (!kind) return res.status(404).json({ ok: false, error: "Diesen Code gibt es nicht." });
        liste = [kind];
      }
      // Nur Kinder, die in dem Modul schon etwas stehen haben – sonst entstünden leere Einträge für die ganze Klasse
      const zeit = now();
      const betroffen = liste.filter((k) => { const p = k.p[modul]; return p && (Object.keys(p.g || {}).length || (p.v && Object.keys(p.v).length)); });
      const katalog = (await katalogeHolen([modul]))[modul];
      for (const kind of betroffen) { modulLeeren(kind, modul, "l", zeit, katalog); await geaendert(kind.code); }
      return res.json({ ok: true, anzahl: betroffen.length, r: zeit });
    } catch (error) { return fehler(res, error); }
  });

  // Einzelne gelöste Aufgaben wieder herausnehmen (Lehrkraft, alle Kurse), z. B. eine Anpassung des Lernstands für eine
  // Vorführung zurücknehmen: nur die genannten Kennungen, alles andere bleibt. z (optional): „zuletzt aktiv“ des Moduls.
  // Ohne Zurücksetzen-Marke r – Geräte, die die Aufgaben schon übernommen haben, können sie wieder melden.
  app.post("/api/nt9/fortschritt/lehrer/aufgaben-entfernen", async (req, res) => {
    if (!lehrerOk(req, res)) return;
    try {
      const liste = Array.isArray(req.body && req.body.eintraege) ? req.body.eintraege.slice(0, 1000) : [];
      if (!liste.length) return res.status(400).json({ ok: false, error: "Keine Einträge." });
      const kinder = await kinderLaden(), codes = new Set();
      let entfernt = 0;
      for (const e of liste) {
        const kind = kinder.get(String((e && e.code) || "")), modul = String((e && e.modul) || "");
        const p = kind && kursVon(modul) ? kind.p[modul] : null;
        if (!p || !p.g) continue;
        const weg = aufgabenListe(e.aufgaben).filter((id) => p.g[id] !== undefined);
        weg.forEach((id) => { delete p.g[id]; });
        const z = Number(e.z);
        if (Number.isFinite(z) && z > 0 && z !== p.z) p.z = z;
        else if (!weg.length) continue;
        entfernt += weg.length; codes.add(kind.code);
      }
      for (const c of codes) await geaendert(c);
      return res.json({ ok: true, entfernt, kinder: codes.size });
    } catch (error) { return fehler(res, error); }
  });

  // Notenschutz LRS: Rechtschreibung zählt in Proben nicht. Nur Code und Merkmal, kein Name.
  app.post("/api/nt9/fortschritt/lehrer/lrs", async (req, res) => {
    if (!lehrerOk(req, res)) return;
    try {
      const body = req.body || {};
      const kind = (await kinderLaden()).get(String(body.code || "").trim());
      if (!kind) return res.status(404).json({ ok: false, error: "Diesen Code gibt es nicht." });
      if (body.lrs === true) kind.lrs = true; else delete kind.lrs;
      schmutzig.delete(kind.code);
      await msetStuecke(store, [[cKey(kind.code), kind]]);
      return res.json({ ok: true, code: kind.code, lrs: Boolean(kind.lrs) });
    } catch (error) { return fehler(res, error); }
  });
  /* --- Namensliste der Lehrkraft, damit sie auf jedem ihrer Geräte steht – hier nur als Schlüsseltext ---
   * Der Browser der Lehrkraft verschlüsselt die Liste { Code: Name } selbst (AES-GCM, Schlüssel per PBKDF2 aus dem
   * Lehrkraft-Passwort; ältere Sicherungen verwenden noch einen eigenen Namens-Schlüssel) und legt nur den
   * Schlüsseltext ab. In der Datenbank steht
   * kein lesbarer Name; der Server entschlüsselt nie. Abrufen und Speichern nur mit dem Lehrkraft-Passwort – die
   * Seiten der Kinder kommen nicht heran. version = Zähler gegen gleichzeitiges Speichern von zwei Geräten. */
  const NAMEN_KEY = "nt9:namen";
  const NAMEN_FORM = /^v1\.[A-Za-z0-9+/=]{16,64}\.[A-Za-z0-9+/=]{12,32}\.[A-Za-z0-9+/=]{16,400000}$/;
  // Die einzelne Serverinstanz führt Versionsprüfung und Schreiben gemeinsam aus.
  let namenSchreibfolge = Promise.resolve();
  function namenAendern(fn) {
    const vorgang = namenSchreibfolge.then(fn, fn);
    namenSchreibfolge = vorgang.catch(() => {});
    return vorgang;
  }
  app.post("/api/nt9/fortschritt/lehrer/namen", async (req, res) => {
    if (!lehrerOk(req, res)) return;
    try {
      const alt = await store.get(NAMEN_KEY);
      return res.json({ ok: true, blob: (alt && alt.blob) || "", version: (alt && alt.version) || 0 });
    } catch (error) { return fehler(res, error); }
  });
  app.post("/api/nt9/fortschritt/lehrer/namen/sichern", async (req, res) => {
    if (!lehrerOk(req, res)) return;
    try {
      const blob = String((req.body && req.body.blob) || "");
      // nur Schlüsseltext in der erwarteten Form – nie eine lesbare Liste
      if (!NAMEN_FORM.test(blob)) return res.status(400).json({ ok: false, error: "Die Namensliste muss verschlüsselt ankommen." });
      return await namenAendern(async () => {
        const alt = await store.get(NAMEN_KEY), version = (alt && alt.version) || 0;
        if (Number(req.body.version) !== version) {
          return res.status(409).json({ ok: false, error: "Die Namensliste wurde inzwischen auf einem anderen Gerät geändert.", blob: (alt && alt.blob) || "", version });
        }
        await store.set(NAMEN_KEY, { blob, version: version + 1, zeit: new Date().toISOString() });
        return res.json({ ok: true, version: version + 1 });
      });
    } catch (error) { return fehler(res, error); }
  });
  app.post("/api/nt9/fortschritt/lehrer/namen/loeschen", async (req, res) => {
    if (!lehrerOk(req, res)) return;
    try {
      await namenAendern(() => store.del([NAMEN_KEY]));
      return res.json({ ok: true });
    } catch (error) { return fehler(res, error); }
  });
  app.post("/api/nt9/fortschritt/lehrer/umbenennen", async (req, res) => {
    if (!lehrerOk(req, res)) return;
    try {
      const body = req.body || {};
      const von = klasseNorm(body.von), nach = klasseNorm(body.nach);
      if (!von || !nach) return res.status(400).json({ ok: false, error: "Unbekannte Klasse. Beispiele: 7aM, 7b, 8c, 9d." });
      const kinder = await kinderLaden();
      const betroffen = [...kinder.values()].filter((k) => k.klasse === von);
      betroffen.forEach((k) => { k.klasse = nach; schmutzig.delete(k.code); });
      await msetStuecke(store, betroffen.map((k) => [cKey(k.code), k]));
      return res.json({ ok: true, anzahl: betroffen.length });
    } catch (error) { return fehler(res, error); }
  });

  // Für andere Module (z. B. Deutsch 7): Kind zum Code, mit derselben Sperre bei vielen falschen Codes.
  // -> { code, klasse, zug } | { gesperrt: true } | null
  // Lehrercode: { code, klasse: "Lehrkraft", zug: "", lehrer: true } – wer damit etwas speichern würde (Proben,
  // Hausaufgabenheft), muss „lehrer“ selbst abweisen.
  async function kindZumCode(code, req) {
    if (req && gesperrt(req)) return { gesperrt: true };
    const c = String(code || "").trim();
    if (!/^\d{3}$/.test(c)) return null;
    if (istLehrer(c)) return { code: c, klasse: LEHRER_KLASSE, zug: "", lrs: false, lehrer: true };
    const kind = (await kinderLaden()).get(c);
    if (!kind) { if (req) fehlversuch(req); return null; }
    return { code: kind.code, klasse: kind.klasse, zug: zugVon(kind.klasse), lrs: Boolean(kind.lrs) };
  }

  // Für andere Module (Deutsch 7, Argumentations-Führerschein): Wann wurde dieses Modul für das Kind zuletzt
  // zurückgesetzt? 0 = nie. Was davor lag, zählt dort nicht mehr zum Stand.
  async function resetZeit(code, modul) {
    const kind = (await kinderLaden()).get(String(code || "").trim());
    const p = kind && kind.p[modul];
    return (p && p.r) || 0;
  }

  return { store, flush, kindZumCode, resetZeit, lehrerCode: LEHRER,
    klassenLaden: async () => klassenUebersicht([...(await kinderLaden()).values()]).map((k) => k.klasse)
  };
}

// Vermerke zum Zurücksetzen eines Moduls: Sie bleiben stehen, wenn das Kind danach weiterarbeitet
function resetFelder(p) {
  if (!p) return {};
  return {
    ...(p.r ? { r: p.r, rn: p.rn || 1, rw: p.rw || "k" } : {}),
    ...(Array.isArray(p.rv) ? { rv: p.rv } : {}),
    ...(Array.isArray(p.rm) ? { rm: p.rm } : {}),
    ...(p.ab ? { ab: p.ab, abn: p.abn || 1 } : {})
  };
}

// Zugangsdaten aus dem Render-Dashboard großzügig lesen: ganze .env-Zeile, Anführungszeichen,
// Leerzeichen, Adresse ohne https:// (so steht sie im Feld „Endpoint“) und vertauschte Werte.
// Andere Variablennamen (z. B. für die Proben-Datenbank) über urlName/tokenName.
function upstashZugang(env, urlName = "UPSTASH_REDIS_REST_URL", tokenName = "UPSTASH_REDIS_REST_TOKEN") {
  // Auch eine ganze .env-Zeile aus der Upstash-Konsole (die heißt immer UPSTASH_REDIS_REST_…)
  const wert = (v, ...namen) => {
    let s = String(v || "").trim();
    const name = namen.find((n) => s.toUpperCase().startsWith(n.toUpperCase() + "="));
    if (name) s = s.slice(name.length + 1);
    return s.trim().replace(/^["']+|["']+$/g, "").trim();
  };
  const adresse = (v) => (v && !/^https?:\/\//i.test(v) && /^[a-z0-9.-]+\.upstash\.io\/?$/i.test(v) ? "https://" + v : v);
  let url = adresse(wert(env[urlName], urlName, "UPSTASH_REDIS_REST_URL"));
  let token = wert(env[tokenName], tokenName, "UPSTASH_REDIS_REST_TOKEN");
  if (url && token && !/upstash\.io/i.test(url) && /upstash\.io/i.test(token)) [url, token] = [adresse(token), url];
  let hinweis = "";
  if (url && !/upstash\.io/i.test(url)) hinweis = `In ${urlName} steht keine Upstash-Adresse (…upstash.io)`;
  else if (/\s/.test(url)) hinweis = `${urlName} enthält Leerzeichen`;
  return { url, token, hinweis };
}

// Kurzer Grund für die Statusseite, ohne Schlüssel oder Adresse preiszugeben
function fehlerGrund(error, urlName = "UPSTASH_REDIS_REST_URL") {
  const text = String((error && error.message) || "");
  const code = error && error.cause && error.cause.code ? String(error.cause.code) : "";
  if (/WRONGPASS|Unauthorized|401|invalid.*token|auth/i.test(text)) return "Token wird abgelehnt (falscher oder schreibgeschützter Token?)";
  if (/Invalid URL|Failed to parse URL/i.test(text)) return `Die Adresse (${urlName}) ist keine gültige URL`;
  if (code === "ENOTFOUND" || code === "EAI_AGAIN") return `Die Adresse (${urlName}) wird nicht gefunden`;
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

// Fehlerwörter { wort: [falsch, richtig hintereinander] } – Kennungen wie bei den Aufgaben, Zahlen begrenzt
function fehlerPruefen(v) {
  if (!v || typeof v !== "object" || Array.isArray(v)) return {};
  const out = {};
  let n = 0;
  for (const [id, wert] of Object.entries(v)) {
    if (!/^[A-Za-z0-9_-]{1,60}$/.test(id) || !Array.isArray(wert)) continue;
    const falsch = Math.max(0, Math.min(999, parseInt(wert[0], 10) || 0));
    const richtig = Math.max(0, Math.min(9, parseInt(wert[1], 10) || 0));
    if (!falsch) continue;
    out[id] = [falsch, richtig];
    if (++n >= 400) break;
  }
  return out;
}

// Fehlversuche { aufgabe: Zahl } – 0 = auf Anhieb richtig; Kennungen wie bei den Aufgaben, Zahlen begrenzt
function versuchePruefen(v) {
  if (!v || typeof v !== "object" || Array.isArray(v)) return {};
  const out = {};
  let n = 0;
  for (const [id, wert] of Object.entries(v)) {
    const zahl = parseInt(wert, 10);
    if (!/^[A-Za-z0-9_-]{1,60}$/.test(id) || !(zahl >= 0)) continue;
    out[id] = Math.min(99, zahl);
    if (++n >= MAX_AUFGABEN) break;
  }
  return out;
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

module.exports = { registerNt9FortschrittRoutes, upstashStore, dateiStore, upstashZugang, fehlerGrund, klasseNorm, zugVon, lehrerCode, LEHRER_KLASSE, MODULE, KURSE };
