"use strict";

/**
 * NT 7: Themen und Module freischalten – je Klasse.
 *
 * Die Lehrkraft schaltet in der Verwaltung (Klasse wählen → Natur und Technik) ganze Themenbereiche oder einzelne
 * Module frei. Die Übersicht der Kinder (7M/NT/index.html, 7R/NT/index.html) und die Module fragen den Stand ihrer
 * Klasse ab; die Klasse kommt vom Code des Kindes. Welche Themen und Module es gibt, steht nur auf der Website
 * (7M/NT/themen.js) – der Server speichert, was ausdrücklich gesetzt wurde:
 *   themen: { "<thema>": true|false }, module: { "<modul>": true|false }
 * Was nicht gesetzt ist, folgt dem Standard der Website (die fünf vorhandenen Luft-Module sind offen, Neues ist zu).
 * Ein Modul-Eintrag geht vor dem Eintrag seines Themas.
 *
 * Das ist eine Lernsteuerung, kein Geheimnisschutz: Die Lernseiten selbst sind öffentliche Dateien.
 * Proben werden weiter eigens freigeschaltet (/api/nt7/teacher/unlock).
 *
 * Kind:       POST /api/nt7/freigabe                 { code }                       -> { ok, klasse, zug, themen, module }
 *             Mit dem Lehrercode (nt9-fortschritt.js): { ok, klasse: "Lehrkraft", zug: "", themen: {}, module: {}, alles: true }
 *             – die Website zeigt dann jedes Modul offen (themen.js: offen()).
 * Lehrkraft:  POST /api/nt7/lehrer/freigabe          { password, klasse }           -> { ok, klasse, themen, module }
 *             POST /api/nt7/lehrer/freigabe/setzen   { password, klasse, art: "thema"|"modul", id, offen: true|false|null }
 *                                                    (null = Eintrag entfernen, es gilt wieder der Standard)
 * Datei: backend/data/nt7-freigabe.json (wird mit den Proben nach Upstash gespiegelt, Präfix /api/nt7).
 *
 * Mehrfach registrierbar: options.prefix ("/api/inf7"), options.datei ("inf7-freigabe.json"), options.name
 * ("Informatik-7-Freigabe") – so nutzt Informatik 7 dieselbe Logik mit eigenem Stand (Module und Einheiten).
 * Deutsch 7 ebenso: "/api/d7", "d7-freigabe.json" (Themenbereiche und Module aus 7M/Deutsch/themen.js).
 * Informatik 8: "/api/inf8", "inf8-freigabe.json" und options.stufe = 8 (Freischalten für die 8. Klassen; Standard ist 7).
 * Englisch 7, 8 und 9: "/api/e7", "/api/e8", "/api/e9" (Units und Seiten aus den themen.js der Englisch-Ordner; 9M und
 * 9R haben je eine Liste, aber einen gemeinsamen Stand – er ist ohnehin nach Klasse getrennt).
 */

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { klasseNorm } = require("./nt9-fortschritt");

const KENNUNG = /^[a-z0-9-]{2,40}$/;

function registerNt7FreigabeRoutes(app, options = {}) {
  const dataDir = options.dataDir || path.join(__dirname, "..", "data");
  const teacherPassword = String(options.teacherPassword || "");
  const kindZumCode = options.kindZumCode;
  if (typeof kindZumCode !== "function") throw new Error("NT-7-Freigabe: kindZumCode fehlt.");
  const PREFIX = String(options.prefix || "/api/nt7").replace(/\/$/, "");
  const NAME = options.name || "NT-7-Freigabe";
  const DATEI = path.join(dataDir, options.datei || "nt7-freigabe.json");
  const STUFE = parseInt(options.stufe, 10) || 7;

  function lesen() {
    try {
      const d = JSON.parse(fs.readFileSync(DATEI, "utf8"));
      return d && d.klassen && typeof d.klassen === "object" ? d : { klassen: {} };
    } catch (_error) { return { klassen: {} }; }
  }
  function schreiben(daten) {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    const temp = DATEI + ".tmp";
    fs.writeFileSync(temp, JSON.stringify(daten, null, 1), "utf8");
    fs.renameSync(temp, DATEI);
  }
  const stand = (daten, klasse) => {
    const k = daten.klassen[klasse] || {};
    return { themen: { ...(k.themen || {}) }, module: { ...(k.module || {}) } };
  };
  function lehrerOk(req, res) {
    const given = Buffer.from(String((req.body && req.body.password) || "").slice(0, 200));
    const expected = Buffer.from(teacherPassword);
    if (!teacherPassword || given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) {
      res.status(401).json({ ok: false, error: "Das Passwort stimmt nicht." });
      return false;
    }
    return true;
  }
  // Freischalten gibt es für die Klassen einer Jahrgangsstufe (Standard: 7)
  function klasse7(v) {
    const k = klasseNorm(v);
    return k && parseInt(k, 10) === STUFE ? k : "";
  }

  app.post(PREFIX + "/freigabe", async (req, res) => {
    try {
      const kind = await kindZumCode(req.body && req.body.code, req);
      if (!kind) return res.status(401).json({ ok: false, error: "Bitte melde dich mit deinem Code an." });
      if (kind.gesperrt) return res.status(429).json({ ok: false, error: "Zu viele falsche Codes. Warte ein paar Minuten." });
      if (kind.lehrer) return res.json({ ok: true, klasse: kind.klasse, zug: "", themen: {}, module: {}, alles: true });
      return res.json({ ok: true, klasse: kind.klasse, zug: kind.zug, ...stand(lesen(), kind.klasse) });
    } catch (error) {
      console.error(NAME + ":", error && error.message);
      return res.status(500).json({ ok: false, error: "Das hat gerade nicht geklappt. Versuche es noch einmal." });
    }
  });

  app.post(PREFIX + "/lehrer/freigabe", (req, res) => {
    if (!lehrerOk(req, res)) return;
    const klasse = klasse7(req.body.klasse);
    if (!klasse) return res.status(400).json({ ok: false, error: "Freischalten gibt es für die " + STUFE + ". Klassen." });
    return res.json({ ok: true, klasse, ...stand(lesen(), klasse) });
  });

  app.post(PREFIX + "/lehrer/freigabe/setzen", (req, res) => {
    if (!lehrerOk(req, res)) return;
    try {
      const b = req.body || {};
      const klasse = klasse7(b.klasse), art = b.art === "thema" ? "themen" : b.art === "modul" ? "module" : "", id = String(b.id || "");
      if (!klasse) return res.status(400).json({ ok: false, error: "Freischalten gibt es für die " + STUFE + ". Klassen." });
      if (!art || !KENNUNG.test(id)) return res.status(400).json({ ok: false, error: "Unbekanntes Thema oder Modul." });
      if (b.offen !== true && b.offen !== false && b.offen !== null) return res.status(400).json({ ok: false, error: "offen muss true, false oder null sein." });
      const daten = lesen();
      const k = daten.klassen[klasse] = daten.klassen[klasse] || {};
      k[art] = k[art] || {};
      if (b.offen === null) delete k[art][id];
      else {
        if (Object.keys(k[art]).length >= 200 && !(id in k[art])) return res.status(400).json({ ok: false, error: "Zu viele Einträge." });
        k[art][id] = b.offen;
      }
      // Ein Thema neu setzen heißt: Es gilt für alle seine Module. Einzel-Einträge dieser Module räumt die Website
      // über „module“ mit auf (sie kennt die Zuordnung) – hier nur die mitgeschickte Liste.
      if (art === "themen" && Array.isArray(b.module)) {
        k.module = k.module || {};
        b.module.map(String).filter((m) => KENNUNG.test(m)).slice(0, 60).forEach((m) => { delete k.module[m]; });
      }
      k.am = new Date().toISOString();
      schreiben(daten);
      return res.json({ ok: true, klasse, ...stand(daten, klasse) });
    } catch (error) {
      console.error(NAME + ":", error && error.message);
      return res.status(500).json({ ok: false, error: "Das hat gerade nicht geklappt. Versuche es noch einmal." });
    }
  });

  return { stand: (klasse) => stand(lesen(), klasse) };
}

module.exports = { registerNt7FreigabeRoutes };
