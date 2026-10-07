"use strict";
const crypto = require("node:crypto");
const { promisify } = require("node:util");
const scrypt = promisify(crypto.scrypt);
const D = require("../kalender-daten");
const { kalenderSpeicher } = require("./speicher");
const SESSION_SECONDS = 8 * 60 * 60;
const hash = (s) => crypto.createHash("sha256").update(s).digest("hex");
const clean = (s, n) => String(s == null ? "" : s).replace(/[\u0000-\u0008\u000b-\u001f]/g, " ").trim().slice(0, n);
const loginName = (s) => String(s || "").trim().toLowerCase();
const sicherGleich = (a, b) => {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};
function problem(status, message) { const e = new Error(message); e.status = status; return e; }
function passOk(s) { return typeof s === "string" && s.length >= 8 && s.length <= 128; }
async function passHash(pass) {
  const salt = crypto.randomBytes(16).toString("hex"), key = await scrypt(pass, salt, 64);
  return { salt, hash: key.toString("hex") };
}
function pruefeEintrag(raw) {
  if (!raw || !D.datumOk(raw.datum) || raw.datum < D.von || raw.datum > D.bis) throw problem(400, "Datum muss im Schuljahr 2026/2027 liegen.");
  const e = { datum: raw.datum, klasse: D.klasse(raw.klasse), fach: clean(raw.fach, 80), titel: clean(raw.titel, 160), stunde: clean(raw.stunde, 80), hinweis: clean(raw.hinweis, 2000), uid: clean(raw.uid, 300) };
  if (!e.klasse || !e.fach || !e.titel) throw problem(400, "Bitte Klasse (z. B. 7aM), Fach und Titel angeben.");
  for (const [key, max] of Object.entries({ fach: 80, titel: 160, stunde: 80, hinweis: 2000, uid: 300 })) {
    if (String(raw[key] || "").length > max) throw problem(400, "Feld zu lang: " + key);
  }
  return e;
}
function publicAccount(k) { return { id: k.id, name: k.name, aktiv: k.aktiv, version: k.version }; }

function registerKalenderRoutes(app, options = {}) {
  const store = options.store || kalenderSpeicher(options), failures = new Map();
  const now = options.jetzt || (() => new Date());
  const route = (name, fn) => app.post("/api/kalender/" + name, async (req, res) => {
    res.set("Cache-Control", "no-store");
    try { res.json({ ok: true, ...await fn(req) }); }
    catch (e) {
      if (!e.status) console.error("Kalender:", e.message);
      res.status(e.status || 503).json({ ok: false, error: e.status ? e.message : "Der Kalender-Speicher ist gerade nicht erreichbar. Bitte erneut versuchen." });
    }
  });
  function attempt(req) {
    const ip = req.ip || req.socket?.remoteAddress || "?", t = Date.now();
    // Bound the map and expire failures; do not rely on a client-provided IP header.
    for (const [k, v] of failures) if (t - v.start > 900000) failures.delete(k);
    if (failures.size >= 10000 && !failures.has(ip)) throw problem(429, "Zu viele Anmeldungen. Bitte später versuchen.");
    const state = failures.get(ip) || { start: t, n: 0 };
    if (state.n >= 10) throw problem(429, "Zu viele Fehlversuche. Bitte nach 15 Minuten erneut anmelden.");
    return { fail() { state.n++; failures.set(ip, state); }, clear() { failures.delete(ip); } };
  }
  function admin(req) {
    const a = attempt(req), given = String(req.body?.password || "");
    if (!options.teacherPassword || given.length > 200 || !sicherGleich(given, options.teacherPassword)) {
      a.fail(); throw problem(401, "Das Verwaltungs-Passwort stimmt nicht.");
    }
    a.clear();
  }
  async function teacher(req) {
    const token = String(req.headers.authorization || "").replace(/^Bearer /, "");
    if (!/^[a-f0-9]{64}$/.test(token)) throw problem(401, "Bitte als Lehrkraft anmelden.");
    const session = await store.session(hash(token));
    if (!session) throw problem(401, "Die Anmeldung ist abgelaufen. Bitte erneut anmelden.");
    const raw = await store.raw("konten", session.id), k = raw ? JSON.parse(raw) : null;
    if (!k || !k.aktiv || k.credentialVersion !== session.version) throw problem(401, "Bitte erneut anmelden.");
    return { konto: k, token: hash(token), raw };
  }
  async function entries() { return (await store.all("termine")).sort((a, b) => a.datum.localeCompare(b.datum) || a.klasse.localeCompare(b.klasse, "de", { numeric: true }) || a.fach.localeCompare(b.fach, "de")); }
  function display(events, accounts, pupil) {
    return events.map((e) => {
      const k = accounts.find((a) => a.id === e.lehrerId);
      const out = { ...e, lehrer: k?.name || "Ehemalige Lehrkraft" };
      delete out.uid;
      if (pupil) { delete out.lehrerId; delete out.version; delete out.erstellt; delete out.geaendert; }
      return out;
    });
  }
  route("anmelden", async (req) => {
    const a = attempt(req), id = loginName(req.body?.benutzer), pass = req.body?.passwort;
    if (typeof pass !== "string" || pass.length > 128 || id.length > 40) { a.fail(); throw problem(401, "Benutzername oder Passwort stimmt nicht."); }
    const raw = await store.raw("konten", id), k = raw ? JSON.parse(raw) : null;
    const key = await scrypt(pass, k?.salt || "kalender-unbekannt", 64);
    if (!k || !k.aktiv || !sicherGleich(key.toString("hex"), k.hash)) { a.fail(); throw problem(401, "Benutzername oder Passwort stimmt nicht."); }
    a.clear(); const token = crypto.randomBytes(32).toString("hex");
    await store.session(hash(token), { id: k.id, version: k.credentialVersion }, SESSION_SECONDS);
    return { token, konto: publicAccount(k), ablauf: Date.now() + SESSION_SECONDS * 1000 };
  });
  route("abmelden", async (req) => { const t = await teacher(req); await store.session(t.token, null); return {}; });
  route("passwort", async (req) => {
    const t = await teacher(req), pass = req.body?.neu, alt = req.body?.alt;
    if (!passOk(pass) || typeof alt !== "string" || alt.length > 128) throw problem(400, "Das neue Passwort braucht 8 bis 128 Zeichen.");
    const a = attempt(req), key = await scrypt(alt, t.konto.salt, 64);
    if (!sicherGleich(key.toString("hex"), t.konto.hash)) { a.fail(); throw problem(401, "Das bisherige Passwort stimmt nicht."); }
    a.clear();
    const next = { ...t.konto, ...await passHash(pass), credentialVersion: t.konto.credentialVersion + 1, version: t.konto.version + 1 };
    if (!await store.cas("konten", next.id, t.raw, next)) throw problem(409, "Der Zugang wurde inzwischen geändert. Bitte neu anmelden.");
    await store.session(t.token, null); return {};
  });
  route("admin/liste", async (req) => { admin(req); return { konten: (await store.all("konten")).map(publicAccount), speicher: store.art }; });
  route("admin/speichern", async (req) => {
    admin(req); const b = req.body || {}, id = loginName(b.benutzer);
    if (!/^[a-z0-9][a-z0-9._-]{2,39}$/.test(id) || !clean(b.name, 80)) throw problem(400, "Benutzername: 3 bis 40 Zeichen (a-z, 0-9, Punkt, Unterstrich, Bindestrich). Anzeigename fehlt.");
    const raw = await store.raw("konten", id), old = raw ? JSON.parse(raw) : null;
    if (old && (!b.version || b.version !== old.version)) throw problem(409, "Dieser Benutzername existiert bereits oder wurde geändert. Bitte neu laden.");
    if ((!old || b.passwort) && !passOk(b.passwort)) throw problem(400, "Das Passwort braucht 8 bis 128 Zeichen.");
    const next = { ...old, id, name: clean(b.name, 80), aktiv: b.aktiv !== false, version: (old?.version || 0) + 1, credentialVersion: (old?.credentialVersion || 0) + (b.passwort || b.aktiv === false ? 1 : 0) };
    if (b.passwort) Object.assign(next, await passHash(b.passwort));
    if (!await store.cas("konten", id, raw, next)) throw problem(409, "Der Zugang wurde inzwischen geändert.");
    return { konto: publicAccount(next) };
  });
  route("liste", async (req) => {
    const t = await teacher(req), es = await entries(), accounts = await store.all("konten");
    const klassen = options.klassenLaden ? await options.klassenLaden() : [];
    return { konto: publicAccount(t.konto), eintraege: display(es, accounts), lehrer: accounts.map(publicAccount), klassen: [...new Set([...klassen, ...es.map((e) => e.klasse)])].sort((a, b) => a.localeCompare(b, "de", { numeric: true })), speicher: store.art, vorschau: Boolean(options.vorschau) };
  });
  route("speichern", async (req) => {
    const t = await teacher(req), b = req.body || {}, e = pruefeEintrag(b), id = clean(b.id, 80) || crypto.randomBytes(12).toString("hex");
    const raw = await store.raw("termine", id), old = raw ? JSON.parse(raw) : null;
    if (b.id && !old) throw problem(404, "Der Termin existiert nicht mehr.");
    if (old && old.lehrerId !== t.konto.id) throw problem(403, "Du kannst nur deine eigenen Termine bearbeiten.");
    if (old && b.version !== old.version) throw problem(409, "Der Termin wurde inzwischen geändert. Bitte neu laden.");
    const alle = await entries();
    if (alle.some((x) => x.id !== id && D.finger(x) === D.finger(e))) throw problem(409, "Dieser Termin ist bereits eingetragen.");
    if (!old && alle.length >= 5000) throw problem(400, "Der Kalender ist voll (5000 Termine).");
    const next = { ...e, uid: old?.uid || "", id, lehrerId: t.konto.id, version: (old?.version || 0) + 1, erstellt: old?.erstellt || now().toISOString(), geaendert: now().toISOString() };
    const warnungen = D.warnungen(next, alle);
    if (warnungen.length && b.bestaetigt !== true) throw problem(409, "Bitte die Termin-Hinweise prüfen und bestätigen.");
    if (!await store.cas("termine", id, raw, next)) throw problem(409, "Der Termin wurde inzwischen geändert. Bitte neu laden.");
    return { eintrag: display([next], [t.konto])[0], warnungen };
  });
  route("loeschen", async (req) => {
    const t = await teacher(req), id = clean(req.body?.id, 80), raw = await store.raw("termine", id), e = raw ? JSON.parse(raw) : null;
    if (!e) throw problem(404, "Der Termin existiert nicht mehr.");
    if (e.lehrerId !== t.konto.id) throw problem(403, "Du kannst nur deine eigenen Termine löschen.");
    if (req.body.version !== e.version || !await store.cas("termine", id, raw, null)) throw problem(409, "Der Termin wurde inzwischen geändert. Bitte neu laden.");
    return {};
  });
  route("import", async (req) => {
    const t = await teacher(req), b = req.body || {};
    if (!Array.isArray(b.eintraege) || !b.eintraege.length || b.eintraege.length > 500) throw problem(400, "Bitte 1 bis 500 geprüfte Termine auswählen.");
    if (b.bestaetigt !== true) throw problem(400, "Bitte die Importvorschau bestätigen.");
    const alle = await entries(), seen = new Set(alle.map(D.finger)), ids = new Set(alle.map((e) => e.id)), add = [];
    for (const raw of b.eintraege) {
      const e = pruefeEintrag(raw), f = D.finger(e), id = "i" + hash(e.uid ? "uid:" + e.uid : "event:" + f).slice(0, 32);
      if (seen.has(f) || ids.has(id)) continue;
      seen.add(f); ids.add(id);
      add.push({ ...e, id, lehrerId: t.konto.id, version: 1, erstellt: now().toISOString(), geaendert: now().toISOString() });
    }
    if (alle.length + add.length > 5000) throw problem(400, "Der Kalender ist voll (5000 Termine).");
    const anzahl = await store.import(add);
    return { anzahl, doppelt: b.eintraege.length - anzahl };
  });
  route("klasse", async (req) => {
    if (typeof options.kindZumCode !== "function") throw problem(503, "Die Klassenanbindung fehlt.");
    const k = await options.kindZumCode(req.body?.code, req);
    if (k?.gesperrt) throw problem(429, "Zu viele falsche Codes. Bitte später erneut anmelden.");
    if (!k || k.lehrer) throw problem(401, "Bitte mit deinem Schülercode anmelden.");
    const es = (await entries()).filter((e) => e.klasse === k.klasse);
    return { klasse: k.klasse, eintraege: display(es, await store.all("konten"), true), vorschau: Boolean(options.vorschau) };
  });
  return { store, async heft(klasse) {
    const k = D.klasse(klasse);
    if (!k) throw problem(400, "Unbekannte Klasse.");
    return (await entries()).filter((e) => e.klasse === k).map((e) => ({
      id: "kalender:" + e.id, klasse: k, fach: e.fach,
      text: [e.titel, e.stunde, e.hinweis].filter(Boolean).join("\n"),
      faellig: e.datum, typ: "probe", link: "", quelle: "kalender", am: e.erstellt || e.datum
    }));
  } };
}
module.exports = { registerKalenderRoutes, pruefeEintrag };
