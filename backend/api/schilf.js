"use strict";

/**
 * SCHILF „GRUMI selbst bauen“ (Wunsch vom 16.11.2026): Umfrage für das Kollegium auf einer eigenen Seite
 * (kollegium/schilf.html). Kinder sollen keinen Zugang haben – die Seite und alle Routen für das Kollegium
 * verlangen deshalb einen zufälligen Schlüssel, der nur hier auf dem Server (schilf.json) und im QR-Code des
 * Aushangs steht. Er steht in keinem Repo. Die Lehrkraft holt ihn mit dem Verwaltungs-Passwort.
 *
 * Gespeichert wird in backend/data/schilf.json (proben-speicher.js spiegelt die Datei nach Upstash, Präfix
 * /api/schilf in PRAEFIXE): Schlüssel, Anmeldungen (Name, passende Wochentage, Tagesdatum), Zähler für die
 * Probe-Codes. Höchstens PLAETZE (5) Anmeldungen. Anmeldungen werden nach LOESCH_TAGE (180) Tagen gelöscht;
 * die Lehrkraft kann jede einzeln löschen.
 *
 * Probe-Codes: Die Kollegen-Seite verlinkt eine echte, freigeschaltete Englisch-Probe. Mit dem Lehrercode geht keine
 * Probe – deshalb gibt der Server reihum einen Fortbildungs-Code der Klasse 7zM aus (nt9-fortschritt.js), wenn
 * die Fortbildungs-Codes eingeschaltet sind.
 *
 * Kollegium (immer mit k = Schlüssel aus dem QR-Code):
 *   POST /api/schilf/stand      { k }                -> { ok, plaetze, belegt, frei, lehrerCode, probeCodes: bool }
 *   POST /api/schilf/anmelden   { k, name, tage[] }  -> { ok, platz, belegt, frei, schon? }  (409 voll)
 *   POST /api/schilf/probecode  { k }                -> { ok, code }                           (404 wenn aus)
 * Lehrkraft (immer mit password):
 *   POST /api/schilf/lehrer/schluessel { neu? }      -> { ok, schluessel }   (legt ihn beim ersten Mal an)
 *   POST /api/schilf/lehrer/liste                    -> { ok, plaetze, anmeldungen[] }
 *   POST /api/schilf/lehrer/loeschen  { id }         -> { ok, belegt }
 */

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const PLAETZE = 5;
const LOESCH_TAGE = 180;
const TAGE = ["Mo", "Di", "Mi", "Do", "Fr"];

function tagBerlin(d) {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Berlin" }).format(d);
}
function tagPlus(tag, n) {
  const d = new Date(tag + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
const gleich = (a, b) => {
  const x = Buffer.from(String(a || "")), y = Buffer.from(String(b || ""));
  return x.length > 0 && x.length === y.length && crypto.timingSafeEqual(x, y);
};
// Name: Steuerzeichen raus, Leerraum zusammen, 2–60 Zeichen
function nameSauber(roh) {
  const n = String(roh || "").replace(/[\u0000-\u001f\u007f<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, 60);
  return n.length >= 2 ? n : "";
}
const nameKey = (n) => n.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ß]/g, "");

function registerSchilfRoutes(app, options = {}) {
  const dataDir = options.dataDir || path.join(__dirname, "..", "data");
  const teacherPassword = String(options.teacherPassword || "");
  const jetzt = typeof options.jetzt === "function" ? options.jetzt : () => new Date();
  const lehrerCode = typeof options.lehrerCode === "function" ? options.lehrerCode : () => "";
  const probeCodes = Array.isArray(options.probeCodes) ? options.probeCodes.slice() : [];
  const plaetze = options.plaetze || PLAETZE;
  const DATEI = path.join(dataDir, "schilf.json");
  const versuche = new Map(); // ip -> { start, n } (nur im Arbeitsspeicher)

  function lesen() {
    try {
      const d = JSON.parse(fs.readFileSync(DATEI, "utf8"));
      return { schluessel: String(d.schluessel || ""), anmeldungen: Array.isArray(d.anmeldungen) ? d.anmeldungen : [], probeZaehler: Number(d.probeZaehler) || 0 };
    } catch (_e) { return { schluessel: "", anmeldungen: [], probeZaehler: 0 }; }
  }
  function schreiben(daten) {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    const temp = DATEI + ".tmp";
    fs.writeFileSync(temp, JSON.stringify(daten, null, 1), "utf8");
    fs.renameSync(temp, DATEI);
  }
  // Aufräumen bei jedem Zugriff: Anmeldungen LOESCH_TAGE Tage nach dem Eintragen weg
  function daten() {
    const d = lesen(), grenze = tagPlus(tagBerlin(jetzt()), -LOESCH_TAGE), vorher = d.anmeldungen.length;
    d.anmeldungen = d.anmeldungen.filter((a) => String(a.am) >= grenze);
    if (d.anmeldungen.length !== vorher) schreiben(d);
    return d;
  }
  function lehrerOk(req, res) {
    if (!teacherPassword || !gleich(String((req.body && req.body.password) || "").slice(0, 200), teacherPassword)) {
      res.status(401).json({ ok: false, error: "Das Passwort stimmt nicht." });
      return false;
    }
    return true;
  }
  // Schlüssel aus dem QR-Code; ohne angelegten Schlüssel ist die Seite für alle zu
  function kollegeOk(req, res, d) {
    if (!d.schluessel || !gleich(String((req.body && req.body.k) || "").slice(0, 100), d.schluessel)) {
      res.status(403).json({ ok: false, error: "schluessel", message: "Diese Seite ist nur für das Kollegium. Bitte den QR-Code vom Aushang benutzen." });
      return false;
    }
    return true;
  }
  function zuViele(req, grenze) {
    const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.ip || "?";
    const t = jetzt().getTime();
    let z = versuche.get(ip);
    if (!z || t - z.start > 600000) { z = { start: t, n: 0 }; versuche.set(ip, z); }
    z.n += 1;
    if (versuche.size > 5000) versuche.clear();
    return z.n > grenze;
  }
  const stand = (d) => ({ plaetze, belegt: Math.min(d.anmeldungen.length, plaetze), frei: Math.max(0, plaetze - d.anmeldungen.length) });

  app.post("/api/schilf/stand", (req, res) => {
    if (zuViele(req, 60)) return res.status(429).json({ ok: false, error: "Zu viele Anfragen. Warte ein paar Minuten." });
    const d = daten();
    if (!kollegeOk(req, res, d)) return;
    res.json({ ok: true, ...stand(d), lehrerCode: lehrerCode(), probeCodes: probeCodes.length > 0 });
  });

  app.post("/api/schilf/anmelden", (req, res) => {
    if (zuViele(req, 30)) return res.status(429).json({ ok: false, error: "Zu viele Anfragen. Warte ein paar Minuten." });
    const d = daten();
    if (!kollegeOk(req, res, d)) return;
    const name = nameSauber(req.body && req.body.name);
    if (!name) return res.status(400).json({ ok: false, error: "Bitte gib deinen Namen ein." });
    const tage = TAGE.filter((t) => Array.isArray(req.body.tage) && req.body.tage.includes(t));
    const k = nameKey(name), da = d.anmeldungen.findIndex((a) => nameKey(a.name) === k);
    if (da >= 0) {
      // Schon angemeldet: nur die Wochentage auffrischen
      d.anmeldungen[da].tage = tage; schreiben(d);
      return res.json({ ok: true, schon: true, platz: da + 1, ...stand(d) });
    }
    if (d.anmeldungen.length >= plaetze) return res.status(409).json({ ok: false, error: "voll", message: "Alle " + plaetze + " Plätze sind schon vergeben.", ...stand(d) });
    d.anmeldungen.push({ id: crypto.randomBytes(6).toString("hex"), name, tage, am: tagBerlin(jetzt()) });
    schreiben(d);
    res.json({ ok: true, platz: d.anmeldungen.length, ...stand(d) });
  });

  app.post("/api/schilf/probecode", (req, res) => {
    if (zuViele(req, 30)) return res.status(429).json({ ok: false, error: "Zu viele Anfragen. Warte ein paar Minuten." });
    const d = daten();
    if (!kollegeOk(req, res, d)) return;
    if (!probeCodes.length) return res.status(404).json({ ok: false, error: "aus", message: "Die Probe-Codes sind gerade abgeschaltet." });
    const code = probeCodes[d.probeZaehler % probeCodes.length];
    d.probeZaehler += 1; schreiben(d);
    res.json({ ok: true, code });
  });

  app.post("/api/schilf/lehrer/schluessel", (req, res) => {
    if (!lehrerOk(req, res)) return;
    const d = daten();
    if (!d.schluessel || req.body.neu === true) { d.schluessel = crypto.randomBytes(12).toString("base64url"); schreiben(d); }
    res.json({ ok: true, schluessel: d.schluessel });
  });

  app.post("/api/schilf/lehrer/liste", (req, res) => {
    if (!lehrerOk(req, res)) return;
    const d = daten();
    res.json({ ok: true, plaetze, anmeldungen: d.anmeldungen.map((a) => ({ id: a.id, name: a.name, tage: a.tage || [], am: a.am })) });
  });

  app.post("/api/schilf/lehrer/loeschen", (req, res) => {
    if (!lehrerOk(req, res)) return;
    const d = daten(), id = String(req.body.id || ""), vorher = d.anmeldungen.length;
    d.anmeldungen = d.anmeldungen.filter((a) => a.id !== id);
    if (d.anmeldungen.length === vorher) return res.status(404).json({ ok: false, error: "Diese Anmeldung gibt es nicht." });
    schreiben(d);
    res.json({ ok: true, ...stand(d) });
  });

  return { lesen };
}

module.exports = { registerSchilfRoutes, PLAETZE, TAGE, nameSauber };
