"use strict";

/**
 * Abgegebene Dateien der Praxisaufträge aufbewahren – für die Lehrkraft (Informatik 8: Excel-Mappen, Scratch-Projekte).
 *
 * Vorgabe der Lehrkraft vom 06.10.2026: „ich will die datei irgendwie sehn können“.
 * Lädt ein angemeldetes Kind in einer Einheit seine Datei hoch (…/excel/pruefen, …/scratch/pruefen mit { code }),
 * bewahrt der Server sie auf: je Kind und Auftrag eine Fassung, immer die neueste – außer eine bestandene Fassung
 * würde von einer nicht bestandenen ersetzt. Ohne Code (Vorschau der Lehrkraft, nicht angemeldet) wird nichts
 * aufbewahrt.
 *
 * Namen speichert der Server nicht: Die Datei liegt unter dem Code des Kindes. Aus Excel-Mappen werden vorher
 * Verfasser, „zuletzt geändert von“, Firma, Speicherpfad und Verfasser von Kommentaren entfernt (saeubereXlsx);
 * der Name der hochgeladenen Datei wird nicht gespeichert.
 *
 * Speicher: die Datenbank der Proben (Upstash „grumiproben“: UPSTASH_grumiproben, UPSTASH_grumiproben_token),
 * sonst Dateien in data/abgaben/ (flüchtig auf Render, gut für Tests). Die Dateien werden nur auf Anfrage der
 * Lehrkraft geholt – sie laufen nicht über den Datei-Spiegel der Proben (proben-speicher.js).
 *   abg:<kurs>:k:<klasse>                    Hash  „<code>|<aufgabe>“ -> { zeit, art, groesse, erfuellt, offen, anzahl }
 *   abg:<kurs>:d:<klasse>:<code>:<aufgabe>   die Datei (base64)
 * Beides verfällt nach TAGE Tagen ohne neue Abgabe.
 *
 * Lehrkraft (Passwort im Body):
 *   POST <prefix>/lehrer/abgaben           { password, klasse }                 -> { ok, speicher, klasse, abgaben: [{ code, aufgabe, titel, art, zeit, groesse, erfuellt, offen, anzahl }] }
 *   POST <prefix>/lehrer/abgabe            { password, klasse, code, aufgabe }  -> { ok, name, art, datei (base64), punkte, vorschau }
 *        vorschau: { art: "tabelle", spalten, zeilen, zellen: { A1: { t, f } } } oder { art: "programm", text, figuren, variablen }
 *   POST <prefix>/lehrer/abgaben/loeschen  { password, klasse, code? }          -> { ok, anzahl }
 */

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { upstashZugang, klasseNorm } = require("./nt9-fortschritt");
const { liesXlsx, zipLesen } = require("./excelpruefung");
const { zip } = require("./xlsx-mini");

const TAGE = 400, MAX_BYTES = 640 * 1024;
const AUFGABE = /^[a-z0-9-]{2,60}$/, CODE = /^[A-Za-z0-9]{2,12}$/;
const ENDUNG = { xlsx: ".xlsx", sb3: ".sb3" };

/* ---------- Excel-Mappe ohne persönliche Angaben ---------- */
function saeubereXlsx(buf) {
  const z = zipLesen(buf);
  const text = (name, f) => Buffer.from(f(z.text(name)), "utf8");
  const dateien = z.namen.filter((n) => !n.endsWith("/")).map((name) => {
    if (name === "docProps/core.xml") return { name, data: text(name, (t) => t.replace(/(<dc:creator>)[\s\S]*?(<\/dc:creator>)/, "$1GRUMI$2").replace(/(<cp:lastModifiedBy>)[\s\S]*?(<\/cp:lastModifiedBy>)/, "$1GRUMI$2")) };
    if (name === "docProps/app.xml") return { name, data: text(name, (t) => t.replace(/<(Company|Manager)>[\s\S]*?<\/\1>/g, "")) };
    // Speicherpfad des PCs („C:\Users\<Name>\…“) steht in der Arbeitsmappe
    if (name === "xl/workbook.xml") return { name, data: text(name, (t) => t.replace(/<mc:AlternateContent\b(?:(?!<\/mc:AlternateContent>)[\s\S])*?absPath(?:(?!<\/mc:AlternateContent>)[\s\S])*?<\/mc:AlternateContent>/g, "")) };
    if (/^xl\/comments\d*\.xml$/.test(name)) return { name, data: text(name, (t) => t.replace(/(<author>)[\s\S]*?(<\/author>)/g, "$1–$2")) };
    if (/^xl\/persons\/.*\.xml$/.test(name)) return { name, data: text(name, (t) => t.replace(/\b(displayName|userId)="[^"]*"/g, '$1="–"')) };
    return { name, data: z.daten(name) };
  });
  const sauber = zip(dateien);
  liesXlsx(sauber);                       // muss sich weiter lesen lassen – sonst wirft das hier
  return sauber;
}

/* ---------- Speicher ---------- */
function upstashBefehl(url, token, fetchImpl) {
  const doFetch = fetchImpl || fetch, base = String(url).replace(/\/+$/, "");
  return async (...args) => {
    const response = await doFetch(base, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(args) });
    let data = null;
    try { data = await response.json(); } catch (_error) { data = null; }
    if (!response.ok || !data || data.error) throw new Error(`Upstash: ${(data && data.error) || "HTTP " + response.status}`);
    return data.result;
  };
}

// options: { kurs: "inf8", env, dataDir, fetch }
function abgabenSpeicher(options = {}) {
  const kurs = String(options.kurs || "inf8").replace(/[^a-z0-9]/g, "");
  const env = options.env || process.env;
  const { url, token } = upstashZugang(env, "UPSTASH_grumiproben", "UPSTASH_grumiproben_token");
  const feld = (code, aufgabe) => `${code}|${aufgabe}`;
  const lies = (s) => { try { return JSON.parse(s); } catch (_e) { return null; } };
  const eintraege = (paare, klasse) => paare.map(([f, v]) => { const [code, aufgabe] = String(f).split("|"); const m = lies(v); return m && code && aufgabe ? { klasse, code, aufgabe, ...m } : null; }).filter(Boolean);
  // Eine bestandene Fassung wird von einer nicht bestandenen nicht ersetzt
  const behalten = (alt, neu) => !!alt && alt.erfuellt && !neu.erfuellt;

  if (url && token) {
    const cmd = upstashBefehl(url, token, options.fetch), sek = TAGE * 86400;
    const kIndex = (klasse) => `abg:${kurs}:k:${klasse}`, kDatei = (klasse, code, aufgabe) => `abg:${kurs}:d:${klasse}:${code}:${aufgabe}`;
    return {
      art: "upstash",
      async speichere(klasse, code, aufgabe, meta, buf) {
        if (behalten(lies(await cmd("HGET", kIndex(klasse), feld(code, aufgabe))), meta)) return false;
        await cmd("SET", kDatei(klasse, code, aufgabe), buf.toString("base64"), "EX", sek);
        await cmd("HSET", kIndex(klasse), feld(code, aufgabe), JSON.stringify(meta));
        await cmd("EXPIRE", kIndex(klasse), sek);
        return true;
      },
      async liste(klasse) {
        const flach = (await cmd("HGETALL", kIndex(klasse))) || [], paare = [];
        for (let i = 0; i + 1 < flach.length; i += 2) paare.push([flach[i], flach[i + 1]]);
        return eintraege(paare, klasse);
      },
      async hole(klasse, code, aufgabe) {
        const meta = lies(await cmd("HGET", kIndex(klasse), feld(code, aufgabe)));
        const b64 = meta ? await cmd("GET", kDatei(klasse, code, aufgabe)) : null;
        return meta && typeof b64 === "string" ? { meta, buf: Buffer.from(b64, "base64") } : null;
      },
      async loesche(klasse, code) {
        const weg = (await this.liste(klasse)).filter((e) => !code || e.code === code);
        for (let i = 0; i < weg.length; i += 50) {
          const teil = weg.slice(i, i + 50);
          await cmd("DEL", ...teil.map((e) => kDatei(klasse, e.code, e.aufgabe)));
          await cmd("HDEL", kIndex(klasse), ...teil.map((e) => feld(e.code, e.aufgabe)));
        }
        return weg.length;
      }
    };
  }

  // Ersatz ohne Datenbank: Dateien in data/abgaben/<kurs>/<klasse>/
  const wurzel = path.join(options.dataDir || path.join(__dirname, "..", "data"), "abgaben", kurs);
  const ordner = (klasse) => path.join(wurzel, klasse);
  const indexDatei = (klasse) => path.join(ordner(klasse), "index.json");
  const index = (klasse) => { try { return JSON.parse(fs.readFileSync(indexDatei(klasse), "utf8")) || {}; } catch (_e) { return {}; } };
  const schreibIndex = (klasse, daten) => { fs.mkdirSync(ordner(klasse), { recursive: true }); fs.writeFileSync(indexDatei(klasse) + ".tmp", JSON.stringify(daten)); fs.renameSync(indexDatei(klasse) + ".tmp", indexDatei(klasse)); };
  const datei = (klasse, code, aufgabe) => path.join(ordner(klasse), `${code}__${aufgabe}.bin`);
  return {
    art: "datei",
    async speichere(klasse, code, aufgabe, meta, buf) {
      const daten = index(klasse);
      if (behalten(lies(daten[feld(code, aufgabe)]), meta)) return false;
      fs.mkdirSync(ordner(klasse), { recursive: true });
      fs.writeFileSync(datei(klasse, code, aufgabe), buf);
      daten[feld(code, aufgabe)] = JSON.stringify(meta); schreibIndex(klasse, daten);
      return true;
    },
    async liste(klasse) { return eintraege(Object.entries(index(klasse)), klasse); },
    async hole(klasse, code, aufgabe) {
      const meta = lies(index(klasse)[feld(code, aufgabe)]);
      try { return meta ? { meta, buf: fs.readFileSync(datei(klasse, code, aufgabe)) } : null; } catch (_e) { return null; }
    },
    async loesche(klasse, code) {
      const daten = index(klasse), weg = eintraege(Object.entries(daten), klasse).filter((e) => !code || e.code === code);
      for (const e of weg) { delete daten[feld(e.code, e.aufgabe)]; try { fs.unlinkSync(datei(klasse, e.code, e.aufgabe)); } catch (_e) { /* schon weg */ } }
      if (weg.length) schreibIndex(klasse, daten);
      return weg.length;
    }
  };
}

/* ---------- Beim Hochladen merken (für die Routen …/excel/pruefen und …/scratch/pruefen) ---------- */
// Liefert eine Funktion (req, { aufgabe, art: "xlsx"|"sb3", buf, punkte }) -> true, wenn die Datei aufbewahrt wurde.
function abgabeMerker({ speicher, kindZumCode, stufe }) {
  const STUFE = parseInt(stufe, 10) || 8;
  return async (req, { aufgabe, art, buf, punkte }) => {
    try {
      const code = String((req.body && req.body.code) || "").trim();
      if (!code || !CODE.test(code) || !AUFGABE.test(aufgabe) || !ENDUNG[art] || !Buffer.isBuffer(buf) || buf.length > MAX_BYTES) return false;
      const kind = await kindZumCode(code, req);
      const klasse = kind && !kind.gesperrt ? klasseNorm(kind.klasse) : "";
      if (!klasse || parseInt(klasse, 10) !== STUFE) return false;
      const sauber = art === "xlsx" ? saeubereXlsx(buf) : buf;
      const offen = punkte.filter((p) => !p.ok).length;
      const meta = { zeit: new Date().toISOString(), art, groesse: sauber.length, erfuellt: punkte.length > 0 && offen === 0, offen, anzahl: punkte.length };
      await speicher.speichere(klasse, String(kind.code || code), aufgabe, meta, sauber);
      return true;                          // auch wenn die frühere, bestandene Fassung bleibt: Die Lehrkraft sieht eine Abgabe
    } catch (error) {
      console.error("Abgaben:", error && error.message);
      return false;
    }
  };
}

/* ---------- Vorschau für die Lehrkraft ---------- */
const zahlDe = (v) => String(Math.round(v * 10000) / 10000).replace(".", ",");
function tabellenVorschau(x) {
  const zellen = x.blaetter[0].zellen, aus = {};
  let spalten = 1, zeilen = 1;
  for (const a of Object.keys(zellen)) {
    const m = /^([A-Z]{1,2})(\d{1,4})$/.exec(a);
    if (!m) continue;
    const s = m[1].split("").reduce((n, b) => n * 26 + b.charCodeAt(0) - 64, 0), z = +m[2];
    if (s > 14 || z > 45) continue;       // Übungstabellen sind klein; mehr zeigt die Vorschau nicht
    const c = zellen[a], f = x.formel(a);
    let t = c.v === undefined || c.v === null ? "" : String(c.v);
    if (typeof c.v === "number") t = c.art === "prozent" ? zahlDe(Math.round(c.v * 1000) / 10) + " %" : c.art === "waehrung" ? c.v.toFixed(2).replace(".", ",") + " €" : c.art === "datum" ? "(Datum)" : zahlDe(c.v);
    if (t === "" && !f) continue;
    aus[a] = f ? { t: t.slice(0, 60), f: String(f).slice(0, 120) } : { t: t.slice(0, 60) };
    spalten = Math.max(spalten, s); zeilen = Math.max(zeilen, z);
  }
  return { art: "tabelle", spalten, zeilen, zellen: aus };
}

function registerAbgabenRoutes(app, options = {}) {
  const PREFIX = String(options.prefix || "/api/inf8").replace(/\/$/, "");
  const STUFE = parseInt(options.stufe, 10) || 8;
  const teacherPassword = String(options.teacherPassword || "");
  const speicher = options.speicher;
  const excel = options.excelAufgaben || {}, scratch = options.scratchModul || { AUFGABEN: {}, scratchProjekt: null };
  const titel = (aufgabe) => (excel[aufgabe] && excel[aufgabe].titel) || (scratch.AUFGABEN[aufgabe] && scratch.AUFGABEN[aufgabe].titel) || aufgabe;

  function lehrerOk(req, res) {
    const given = Buffer.from(String((req.body && req.body.password) || "").slice(0, 200)), expected = Buffer.from(teacherPassword);
    if (!teacherPassword || given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) {
      res.status(401).json({ ok: false, error: "Das Passwort stimmt nicht." });
      return false;
    }
    return true;
  }
  const klasseVon = (v) => { const k = klasseNorm(v); return k && parseInt(k, 10) === STUFE ? k : ""; };
  const fehler = (res, error) => { console.error("Abgaben:", error && error.message); return res.status(500).json({ ok: false, error: "Das hat gerade nicht geklappt. Versuche es noch einmal." }); };

  app.post(PREFIX + "/lehrer/abgaben", async (req, res) => {
    if (!lehrerOk(req, res)) return;
    const klasse = klasseVon(req.body.klasse);
    if (!klasse) return res.status(400).json({ ok: false, error: "Abgaben gibt es für die " + STUFE + ". Klassen." });
    try {
      const abgaben = (await speicher.liste(klasse)).map((e) => ({ code: e.code, aufgabe: e.aufgabe, titel: titel(e.aufgabe), art: e.art, zeit: e.zeit, groesse: e.groesse, erfuellt: !!e.erfuellt, offen: e.offen || 0, anzahl: e.anzahl || 0 }))
        .sort((a, b) => a.code.localeCompare(b.code, "de") || a.aufgabe.localeCompare(b.aufgabe, "de"));
      return res.json({ ok: true, speicher: speicher.art, klasse, abgaben });
    } catch (error) { return fehler(res, error); }
  });

  app.post(PREFIX + "/lehrer/abgabe", async (req, res) => {
    if (!lehrerOk(req, res)) return;
    const klasse = klasseVon(req.body.klasse), code = String(req.body.code || ""), aufgabe = String(req.body.aufgabe || "");
    if (!klasse || !CODE.test(code) || !AUFGABE.test(aufgabe)) return res.status(400).json({ ok: false, error: "Diese Abgabe gibt es nicht." });
    try {
      const a = await speicher.hole(klasse, code, aufgabe);
      if (!a) return res.status(404).json({ ok: false, error: "Diese Abgabe gibt es nicht (mehr)." });
      let punkte = [], vorschau = null;
      try {
        if (a.meta.art === "xlsx") {
          const x = liesXlsx(a.buf);
          vorschau = tabellenVorschau(x);
          if (excel[aufgabe]) punkte = excel[aufgabe].pruefe(x);
        } else if (scratch.scratchProjekt) {
          const x = scratch.scratchProjekt(zipLesen(a.buf).text("project.json"));
          vorschau = { art: "programm", text: x.text(), figuren: x.figuren || [], variablen: x.variablen || [] };
          if (scratch.AUFGABEN[aufgabe]) punkte = scratch.AUFGABEN[aufgabe].pruefe(x);
        }
      } catch (_e) { vorschau = null; }
      return res.json({ ok: true, name: `${aufgabe}-${code}${ENDUNG[a.meta.art] || ""}`, art: a.meta.art, zeit: a.meta.zeit, titel: titel(aufgabe),
        datei: a.buf.toString("base64"), punkte: (punkte || []).map((p) => ({ ok: !!p.ok, text: String(p.text || "").slice(0, 300) })), vorschau });
    } catch (error) { return fehler(res, error); }
  });

  app.post(PREFIX + "/lehrer/abgaben/loeschen", async (req, res) => {
    if (!lehrerOk(req, res)) return;
    const klasse = klasseVon(req.body.klasse), code = req.body.code == null || req.body.code === "" ? "" : String(req.body.code);
    if (!klasse || (code && !CODE.test(code))) return res.status(400).json({ ok: false, error: "Abgaben gibt es für die " + STUFE + ". Klassen." });
    try { return res.json({ ok: true, anzahl: await speicher.loesche(klasse, code) }); } catch (error) { return fehler(res, error); }
  });
}

module.exports = { abgabenSpeicher, abgabeMerker, registerAbgabenRoutes, saeubereXlsx, tabellenVorschau, TAGE };
