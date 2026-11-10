"use strict";

/**
 * Papierproben zurückgeben: Die Lehrkraft korrigiert eine Probe auf Papier (Korrekturblatt als PDF je Kind) und lädt
 * die PDFs hoch. Das Kind – und mit ihm die Eltern – sieht sie auf der Startseite unter „Zurückbekommen“ und auf
 * korrektur.html?papier=<id>, kann sie öffnen, herunterladen und drucken. Wunsch der Lehrkraft am 10.11.2026
 * („die PDFs den Schülern auf GRUMI hochladen ins Dashboard … für die Eltern“).
 *
 * Datenschutz (wie bei allen Proben): Auf dem Server liegen nur Code und PDF, keine Namen. Die PDFs werden ohne Namen
 * erzeugt (Namenszeile zum Selbsteintragen); die Zuordnung Datei → Code macht der Browser der Lehrkraft mit seiner
 * eigenen Namensliste, der Dateiname wird nicht übertragen.
 *
 * Sichtbar wie jede zurückgegebene Probe RUECKGABE_TAGE (7) Tage nach der Freigabe (proben-rueckgabe.js), danach
 * nennt der Server sie dem Kind nicht mehr. Die Lehrkraft kann zurücknehmen, noch einmal freigeben und löschen.
 *
 * Dateien in data (proben-speicher.js spiegelt sie nach Upstash „grumiproben“):
 *   papierproben.json                    { proben: { "<id>": { titel, fach, klasse, datum, angelegtAm,
 *                                            kinder: { "<code>": { hochgeladenAm, groesse, freigegebenAm?, geoeffnetAm? } } } } }
 *   papierprobe--<id>--<code>.json       { pdf: base64, groesse, sha1, hochgeladenAm }   (eine Datei je Kind: Ändert sich
 *                                         nur der Stand, wird nicht jedes Mal das PDF neu hochgeladen)
 * Gelöscht wird durch Überschreiben mit { geloescht: true } – der Spiegel kennt kein Löschen, eine gelöschte Datei käme
 * sonst beim nächsten Abgleich aus Upstash zurück.
 *
 *   POST /api/proben/papier/hochladen { password, id, titel, fach, klasse, datum, code, pdf }  -> { ok, kind }
 *        (pdf = base64, höchstens MAX_PDF Bytes; legt die Probe an und gibt sie diesem Kind sofort frei)
 *   POST /api/proben/papier/stand     { password, klasse? }                                    -> { ok, proben: [...], tage }
 *   POST /api/proben/papier/freigeben { password, id, codes?, offen }                          -> { ok, anzahl }
 *   POST /api/proben/papier/loeschen  { password, id, codes? }                                 -> { ok, anzahl }
 *   POST /api/proben/papier/ansehen   { code, id }  -> { ok, papier: { id, titel, fach, datum, klasse, sichtbarBis, pdf } }
 * Für die Liste des Kindes: meine(kind) -> Einträge im Format von /api/proben/rueckgabe/meine (modul "papier").
 */
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { probeKindPruefer } = require("./probe-kind");
const { RUECKGABE_TAGE, sichtbarBis, rueckgabeVorbei, VORBEI_TEXT } = require("./proben-rueckgabe");

const ANZEIGE_TAGE = 3;               // wie proben-rueckgabe.js: so lange steht die Rückgabe mindestens als Kachel da
const MAX_PDF = 700 * 1024;           // ein Korrekturblatt hat rund 200 KB; die JSON-Anfrage darf höchstens 1 MB groß sein
const ID_MUSTER = /^[a-z0-9][a-z0-9-]{2,59}$/;
const FAECHER = ["Deutsch", "Englisch", "Mathematik", "NT", "Informatik", "GPG", "WiB", "Religion", "Ethik", "Musik", "Kunst", "Sport", "Sonstiges"];

function registerPapierprobenRoutes(app, options) {
  const teacherPassword = String(options.teacherPassword || "");
  const jetztDatum = typeof options.jetzt === "function" ? options.jetzt : () => new Date();
  const kindZumCode = options.kindZumCode;
  const probeKind = probeKindPruefer(kindZumCode);
  const dataDir = options.dataDir;
  const INDEX = path.join(dataDir, "papierproben.json");
  const pdfDatei = (id, code) => path.join(dataDir, `papierprobe--${id}--${code}.json`);

  function lies() {
    try {
      const d = JSON.parse(fs.readFileSync(INDEX, "utf8"));
      return { proben: d && d.proben && typeof d.proben === "object" ? d.proben : {} };
    } catch (_e) { return { proben: {} }; }
  }
  function schreibeDatei(datei, inhalt) {
    fs.mkdirSync(dataDir, { recursive: true });
    const temp = datei + ".tmp";
    fs.writeFileSync(temp, JSON.stringify(inhalt), "utf8");
    for (let i = 0; ; i++) {
      try { fs.renameSync(temp, datei); return; }
      catch (error) {
        if (i >= 6 || !["EPERM", "EBUSY", "EACCES"].includes(error.code)) throw error;
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 40);
      }
    }
  }
  const schreibe = (daten) => schreibeDatei(INDEX, daten);
  function lehrerOk(req, res) {
    const given = Buffer.from(String((req.body && req.body.password) || "").slice(0, 200));
    const expected = Buffer.from(teacherPassword);
    if (!teacherPassword || given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) {
      res.status(401).json({ ok: false, error: "Das Passwort stimmt nicht." });
      return false;
    }
    return true;
  }
  const text = (v, max) => String(v == null ? "" : v).replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max);
  const tag = (v) => (/^\d{4}-\d{2}-\d{2}$/.test(String(v || "")) ? String(v) : "");
  const codesAus = (v) => (Array.isArray(v) ? v.map(String).filter((c) => /^\d{3}$/.test(c)) : null);
  function standKind(k) {
    return { hochgeladenAm: k.hochgeladenAm || "", groesse: k.groesse || 0, freigegebenAm: k.freigegebenAm || "", geoeffnetAm: k.geoeffnetAm || "",
      sichtbarBis: k.freigegebenAm ? sichtbarBis(k.freigegebenAm) : "", ...(k.freigegebenAm && rueckgabeVorbei(k.freigegebenAm, jetztDatum()) ? { vorbei: true } : {}) };
  }
  function probeAus(id, p) {
    const kinder = {};
    Object.keys(p.kinder || {}).forEach((c) => { kinder[c] = standKind(p.kinder[c]); });
    return { id, titel: p.titel, fach: p.fach, klasse: p.klasse, datum: p.datum, angelegtAm: p.angelegtAm, kinder };
  }

  /* ---------- Lehrkraft ---------- */
  app.post("/api/proben/papier/hochladen", async (req, res) => {
    if (!lehrerOk(req, res)) return;
    const b = req.body || {};
    const id = String(b.id || ""), code = String(b.code || ""), klasse = text(b.klasse, 12);
    if (!ID_MUSTER.test(id)) return res.status(400).json({ ok: false, error: "Die Kennung der Probe ist ungültig (nur a–z, 0–9 und Bindestrich)." });
    if (!/^\d{3}$/.test(code)) return res.status(400).json({ ok: false, error: "Der Code hat genau 3 Ziffern." });
    const titel = text(b.titel, 120), fach = FAECHER.includes(b.fach) ? b.fach : "Sonstiges", datum = tag(b.datum);
    if (!titel) return res.status(400).json({ ok: false, error: "Bitte einen Titel angeben." });
    const pdfText = typeof b.pdf === "string" ? b.pdf.replace(/^data:application\/pdf;base64,/, "") : "";
    const pdf = Buffer.from(pdfText, "base64");
    if (!pdf.length || pdf.slice(0, 5).toString("latin1") !== "%PDF-") return res.status(400).json({ ok: false, error: "Das ist keine PDF-Datei." });
    if (pdf.length > MAX_PDF) return res.status(413).json({ ok: false, error: `Die PDF ist zu groß (höchstens ${Math.round(MAX_PDF / 1024)} KB).` });
    // Nur Codes, die es gibt – und die zur angegebenen Klasse gehören (gegen Vertipper bei der Zuordnung)
    let kind = null;
    try { kind = kindZumCode ? await kindZumCode(code, req) : { code, klasse }; } catch (error) {
      return res.status(503).json({ ok: false, error: "Die Codes sind gerade nicht erreichbar: " + error.message });
    }
    if (!kind || kind.gesperrt) return res.status(404).json({ ok: false, error: `Den Code ${code} gibt es nicht.` });
    if (kind.lehrer) return res.status(400).json({ ok: false, error: "Das ist der Lehrercode – er gehört zu keinem Kind." });
    if (klasse && kind.klasse && String(kind.klasse) !== klasse) return res.status(409).json({ ok: false, error: `Code ${code} gehört zur Klasse ${kind.klasse}, nicht zu ${klasse}.` });
    const daten = lies(), jetzt = jetztDatum().toISOString();
    const p = daten.proben[id] || { titel, fach, klasse: klasse || String(kind.klasse || ""), datum, angelegtAm: jetzt, kinder: {} };
    Object.assign(p, { titel, fach, datum: datum || p.datum });
    schreibeDatei(pdfDatei(id, code), { pdf: pdf.toString("base64"), groesse: pdf.length, sha1: crypto.createHash("sha1").update(pdf).digest("hex"), hochgeladenAm: jetzt });
    // Neues PDF = neue Rückgabe: frisches Datum, für das Kind wieder „neu“
    p.kinder[code] = { hochgeladenAm: jetzt, groesse: pdf.length, freigegebenAm: jetzt };
    daten.proben[id] = p;
    schreibe(daten);
    res.json({ ok: true, kind: { code, ...standKind(p.kinder[code]) }, tage: RUECKGABE_TAGE });
  });

  app.post("/api/proben/papier/stand", (req, res) => {
    if (!lehrerOk(req, res)) return;
    const klasse = text(req.body.klasse, 12), daten = lies();
    const proben = Object.keys(daten.proben).filter((id) => !klasse || daten.proben[id].klasse === klasse)
      .map((id) => probeAus(id, daten.proben[id])).sort((a, b) => String(b.angelegtAm).localeCompare(String(a.angelegtAm)));
    res.json({ ok: true, proben, tage: RUECKGABE_TAGE });
  });

  app.post("/api/proben/papier/freigeben", (req, res) => {
    if (!lehrerOk(req, res)) return;
    const id = String(req.body.id || ""), daten = lies(), p = daten.proben[id];
    if (!p) return res.status(404).json({ ok: false, error: "Diese Papierprobe gibt es nicht." });
    const offen = req.body.offen !== false, nur = codesAus(req.body.codes), jetzt = jetztDatum().toISOString();
    let anzahl = 0;
    Object.keys(p.kinder).forEach((c) => {
      if (nur && !nur.includes(c)) return;
      const k = p.kinder[c];
      if (!offen) { if (k.freigegebenAm) { delete k.freigegebenAm; delete k.geoeffnetAm; anzahl++; } return; }
      // schon sichtbar: bleibt, wie es ist; Frist um oder zurückgenommen: neue Rückgabe
      if (k.freigegebenAm && !rueckgabeVorbei(k.freigegebenAm, jetztDatum())) return;
      k.freigegebenAm = jetzt; delete k.geoeffnetAm; anzahl++;
    });
    schreibe(daten);
    res.json({ ok: true, anzahl, offen, probe: probeAus(id, p), tage: RUECKGABE_TAGE });
  });

  app.post("/api/proben/papier/loeschen", (req, res) => {
    if (!lehrerOk(req, res)) return;
    const id = String(req.body.id || ""), daten = lies(), p = daten.proben[id];
    if (!p) return res.status(404).json({ ok: false, error: "Diese Papierprobe gibt es nicht." });
    const nur = codesAus(req.body.codes);
    let anzahl = 0;
    Object.keys(p.kinder).forEach((c) => {
      if (nur && !nur.includes(c)) return;
      schreibeDatei(pdfDatei(id, c), { geloescht: true, am: jetztDatum().toISOString() });
      delete p.kinder[c]; anzahl++;
    });
    if (!Object.keys(p.kinder).length) delete daten.proben[id];
    schreibe(daten);
    res.json({ ok: true, anzahl });
  });

  /* ---------- Kind ---------- */
  // Einträge für /api/proben/rueckgabe/meine (gleiches Format wie die anderen Rückgaben)
  function meine(kind) {
    const daten = lies(), aus = [], jetzt = jetztDatum();
    Object.keys(daten.proben).forEach((id) => {
      const p = daten.proben[id], k = p.kinder && p.kinder[String(kind.code)];
      if (!k || !k.freigegebenAm || rueckgabeVorbei(k.freigegebenAm, jetzt)) return;
      const zuletzt = Math.max(Date.parse(k.freigegebenAm) || 0, Date.parse(k.geoeffnetAm) || 0);
      aus.push({ modul: "papier", id, testId: id, fach: p.fach, titel: p.titel, datum: p.datum || String(p.angelegtAm || "").slice(0, 10),
        freigegebenAm: k.freigegebenAm, neu: !k.geoeffnetAm, aktuell: !k.geoeffnetAm || jetzt.getTime() - zuletzt < ANZEIGE_TAGE * 86400000,
        sichtbarBis: sichtbarBis(k.freigegebenAm) });
    });
    return aus;
  }

  app.post("/api/proben/papier/ansehen", async (req, res) => {
    const kind = await probeKind(req, res);
    if (!kind) return;
    const id = String(req.body.id || ""), daten = lies(), p = daten.proben[id], k = p && p.kinder && p.kinder[String(kind.code)];
    // fremde und unbekannte Proben sehen gleich aus
    if (!k) return res.status(404).json({ ok: false, error: "not_found", message: "Diese Probe gibt es bei deinem Code nicht." });
    if (!k.freigegebenAm) return res.status(403).json({ ok: false, error: "nicht_freigegeben", message: "Deine Lehrkraft hat diese Probe noch nicht zurückgegeben." });
    if (rueckgabeVorbei(k.freigegebenAm, jetztDatum())) return res.status(403).json({ ok: false, error: "nicht_freigegeben", vorbei: true, message: VORBEI_TEXT });
    let datei = null;
    try { datei = JSON.parse(fs.readFileSync(pdfDatei(id, kind.code), "utf8")); } catch (_e) { datei = null; }
    if (!datei || !datei.pdf) return res.status(404).json({ ok: false, error: "not_found", message: "Die Datei ist gerade nicht da. Versuche es in einer Minute noch einmal." });
    if (!k.geoeffnetAm) { k.geoeffnetAm = jetztDatum().toISOString(); schreibe(daten); }
    res.json({ ok: true, papier: { id, titel: p.titel, fach: p.fach, datum: p.datum || "", klasse: kind.klasse, freigegebenAm: k.freigegebenAm,
      sichtbarBis: sichtbarBis(k.freigegebenAm), pdf: datei.pdf } });
  });

  return { meine };
}

module.exports = { registerPapierprobenRoutes, MAX_PDF, FAECHER };
