"use strict";

/**
 * Korrigierte Proben an die Kinder zurückgeben – für alle Proben-Module (Englisch, NT, Informatik …).
 *
 * Bisher sah nur die Lehrkraft die Abgabe mit Punkten je Aufgabe (Notenübersicht, Elternausdruck). Jetzt kann sie
 * eine Abgabe „zurückgeben“: Das Kind sieht sie dann auf seiner Startseite unter „Zurückbekommen“, öffnet die
 * Korrektur (Aufgabe · Deine Antwort · Punkte · Rückmeldung) und kann sie für die Eltern drucken oder als PDF sichern.
 * Die Lehrkraft entscheidet, was zurückgeht und ob die richtigen Lösungen dabeistehen; sie kann die Rückgabe wieder
 * zurücknehmen. Festgehalten wird nur: zurückgegeben am, vom Kind geöffnet am.
 *
 * Deutsch 7 hat denselben Ablauf im eigenen Modul (d7-proben.js, mit KI-Vorkorrektur und Bestätigung). Seine
 * freigegebenen Proben stehen hier nur in der Liste des Kindes, damit die Startseite eine einzige Abfrage braucht.
 *
 * Zugriff: Das Kind sieht ausschließlich Abgaben, die unter seinem eigenen Code liegen (bestehende Code-Prüfung der
 * Proben). Kein öffentlicher Link, keine Namen.
 *
 * Datei: data/proben-rueckgabe.json  { rueckgaben: { "<modul>|<abgabe>": { freigegebenAm, geoeffnetAm?, mitLoesung, kommentar? } } }
 *
 *   POST /api/proben/rueckgabe/freigeben { password, eintraege: [{ modul, id }], offen, mitLoesung?, kommentar? }
 *                                         -> { ok, anzahl, stand }       (Lehrkraft; offen: false nimmt zurück)
 *   POST /api/proben/rueckgabe/stand     { password }                    -> { ok, stand }
 *   POST /api/proben/rueckgabe/meine     { code }   -> { ok, rueckgaben: [{ modul, id, testId, fach, titel, datum, freigegebenAm, neu, aktuell }] }
 *                                         (neu = noch nicht geöffnet; aktuell = Kachel auf der Startseite, mindestens 3 Tage)
 *   POST /api/proben/rueckgabe/ansehen   { code, modul, id }             -> { ok, korrektur }   (merkt „geöffnet am“)
 */
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { probeKindPruefer } = require("./probe-kind");

const EIGENER_ABLAUF = new Set(["d7proben", "d8proben", "e9proben"]);   // Module, die Rückgabe und Korrekturseite selbst mitbringen
const ANZEIGE_TAGE = 3;                         // so lange bleibt eine Rückgabe mindestens als Kachel auf der Startseite
// So viele Tage nach der Rückgabe sieht das Kind die korrigierte Probe (Startseite, Liste, Korrekturseite); danach
// verschwindet sie bei ihm von selbst. Abgabe, Punkte und Note bleiben bei der Lehrkraft; gibt sie die Probe noch
// einmal zurück, beginnt die Frist neu. Gilt auch für die Module mit eigenem Ablauf (d7-proben.js).
const RUECKGABE_TAGE = 7;
const tagBerlin = (d) => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Berlin" }).format(d);
function tagPlus(tag, n) { const d = new Date(tag + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
// Letzter Tag (JJJJ-MM-TT, deutsche Zeit), an dem das Kind die Probe noch sieht; "" = Rückgabetag unbekannt, dann gilt keine Frist
function sichtbarBis(freigegebenAm) {
  const t = Date.parse(freigegebenAm || "");
  return Number.isFinite(t) ? tagPlus(tagBerlin(new Date(t)), RUECKGABE_TAGE) : "";
}
function rueckgabeVorbei(freigegebenAm, jetzt) {
  const bis = sichtbarBis(freigegebenAm);
  return Boolean(bis) && tagBerlin(jetzt || new Date()) > bis;
}
const VORBEI_TEXT = "Diese Probe ist nicht mehr zu sehen: Zurückgegebene Proben verschwinden nach " + RUECKGABE_TAGE + " Tagen von selbst. Frag deine Lehrkraft, wenn du sie noch einmal brauchst.";

function registerProbenRueckgabeRoutes(app, options) {
  const teacherPassword = String(options.teacherPassword || "");
  const jetztDatum = typeof options.jetzt === "function" ? options.jetzt : () => new Date();   // für Tests
  const quellen = options.quellen || [];          // [{ modul, fach, abgaben: () => [...] }]
  const probeKind = probeKindPruefer(options.kindZumCode);
  const DATEI = path.join(options.dataDir, "proben-rueckgabe.json");

  function lies() {
    try {
      const d = JSON.parse(fs.readFileSync(DATEI, "utf8"));
      return { rueckgaben: d && typeof d.rueckgaben === "object" && d.rueckgaben ? d.rueckgaben : {} };
    } catch (_e) { return { rueckgaben: {} }; }
  }
  function schreibe(daten) {
    fs.mkdirSync(options.dataDir, { recursive: true });
    const temp = DATEI + ".tmp";
    fs.writeFileSync(temp, JSON.stringify(daten, null, 1), "utf8");
    for (let i = 0; ; i++) {
      try { fs.renameSync(temp, DATEI); return; }
      catch (error) {
        if (i >= 6 || !["EPERM", "EBUSY", "EACCES"].includes(error.code)) throw error;
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 40);
      }
    }
  }
  function lehrerOk(req, res) {
    const given = Buffer.from(String((req.body && req.body.password) || "").slice(0, 200));
    const expected = Buffer.from(teacherPassword);
    if (!teacherPassword || given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) {
      res.status(401).json({ ok: false, error: "Das Passwort stimmt nicht." });
      return false;
    }
    return true;
  }
  const schluessel = (modul, id) => modul + "|" + id;
  const text = (v, max) => (Array.isArray(v) ? v.join(", ") : v == null ? "" : typeof v === "object" ? JSON.stringify(v) : String(v)).slice(0, max || 6000);
  const zahl = (v, ersatz) => (typeof v === "number" && Number.isFinite(v) ? v : ersatz);
  // Zuordnen und Reihenfolge (Liste mit labels, z. B. NT 7): „links → rechts“ je Paar statt einer bloßen Aufzählung
  const paare = (v, labels, max) => (Array.isArray(v) && Array.isArray(labels) && labels.length
    ? labels.map((l, j) => text(l, 200) + " → " + (text(v[j], 300) || "–")).join("; ").slice(0, max || 6000) : text(v, max));
  function finde(modul, id) {
    const q = quellen.find((x) => x.modul === modul);
    const r = q && (q.abgaben() || []).find((x) => x && x.id === id);
    return r ? { q, r } : null;
  }
  // Stand einer Abgabe für die Notenübersicht: { freigegebenAm, geoeffnetAm, sichtbarBis, vorbei } oder null
  // (vorbei: Die Frist ist um, das Kind sieht die Probe nicht mehr – zurückgegeben bleibt sie trotzdem)
  function stand(modul, r, daten) {
    const mitFrist = (am, auf) => ({ freigegebenAm: am || "", geoeffnetAm: auf || "", sichtbarBis: sichtbarBis(am), vorbei: rueckgabeVorbei(am, jetztDatum()) });
    if (EIGENER_ABLAUF.has(modul)) return r && r.status === "freigegeben" ? mitFrist(r.freigegebenAm, r.geoeffnetAm) : null;
    const e = (daten || lies()).rueckgaben[schluessel(modul, r.id)];
    return e ? mitFrist(e.freigegebenAm, e.geoeffnetAm) : null;
  }

  /* ---------- Lehrkraft ---------- */
  app.post("/api/proben/rueckgabe/freigeben", (req, res) => {
    if (!lehrerOk(req, res)) return;
    const liste = Array.isArray(req.body.eintraege) ? req.body.eintraege.slice(0, 400) : [];
    if (!liste.length) return res.status(400).json({ ok: false, error: "Keine Abgabe genannt." });
    const offen = req.body.offen !== false, daten = lies(), jetzt = jetztDatum().toISOString();
    let anzahl = 0;
    liste.forEach((e) => {
      const modul = String((e && e.modul) || ""), id = String((e && e.id) || "");
      if (EIGENER_ABLAUF.has(modul) || !finde(modul, id)) return;
      const k = schluessel(modul, id), alt = daten.rueckgaben[k];
      if (!offen) { if (alt) { delete daten.rueckgaben[k]; anzahl++; } return; }
      // Ist die Frist schon um, zählt das als neue Rückgabe: neues Datum, für das Kind wieder „neu“
      const weiter = alt && !rueckgabeVorbei(alt.freigegebenAm, jetztDatum()) ? alt : null;
      const neu = { freigegebenAm: (weiter && weiter.freigegebenAm) || jetzt, mitLoesung: req.body.mitLoesung !== false };
      if (weiter && weiter.geoeffnetAm) neu.geoeffnetAm = weiter.geoeffnetAm;
      const kommentar = typeof req.body.kommentar === "string" ? req.body.kommentar.replace(/\u0000/g, "").trim().slice(0, 1200) : alt && alt.kommentar;
      if (kommentar) neu.kommentar = kommentar;
      daten.rueckgaben[k] = neu; anzahl++;
    });
    // Einträge zu gelöschten Abgaben aufräumen
    Object.keys(daten.rueckgaben).forEach((k) => { const i = k.indexOf("|"); if (!finde(k.slice(0, i), k.slice(i + 1))) delete daten.rueckgaben[k]; });
    schreibe(daten);
    res.json({ ok: true, anzahl, offen, stand: standMitFrist(daten.rueckgaben), tage: RUECKGABE_TAGE });
  });
  // Für die Lehrerseiten: je Rückgabe dazu, bis wann das Kind sie sieht und ob die Frist schon um ist
  function standMitFrist(rueckgaben) {
    const aus = {}, heute = jetztDatum();
    Object.keys(rueckgaben).forEach((k) => { const e = rueckgaben[k]; aus[k] = { ...e, sichtbarBis: sichtbarBis(e.freigegebenAm), ...(rueckgabeVorbei(e.freigegebenAm, heute) ? { vorbei: true } : {}) }; });
    return aus;
  }
  app.post("/api/proben/rueckgabe/stand", (req, res) => {
    if (!lehrerOk(req, res)) return;
    res.json({ ok: true, stand: standMitFrist(lies().rueckgaben), tage: RUECKGABE_TAGE });
  });

  /* ---------- Kind ---------- */
  app.post("/api/proben/rueckgabe/meine", async (req, res) => {
    const kind = await probeKind(req, res);
    if (!kind) return;
    const daten = lies(), rueckgaben = [], jetzt = jetztDatum().getTime();
    quellen.forEach((q) => {
      (q.abgaben() || []).forEach((r) => {
        if (!r || String(r.code) !== String(kind.code)) return;
        const s = stand(q.modul, r, daten);
        // Frist um: Die Probe steht beim Kind nicht mehr (weder als Kachel noch in der Liste)
        if (!s || s.vorbei) return;
        // aktuell = steht als Kachel auf der Startseite: solange ungeöffnet, sonst noch ANZEIGE_TAGE nach Rückgabe/Öffnen
        const zuletzt = Math.max(Date.parse(s.freigegebenAm) || 0, Date.parse(s.geoeffnetAm) || 0);
        rueckgaben.push({ modul: q.modul, id: r.id, testId: r.testId, fach: q.fach, titel: r.testTitle || r.testId,
          datum: r.testDate || String(r.submittedAt || "").slice(0, 10), freigegebenAm: s.freigegebenAm, neu: !s.geoeffnetAm,
          aktuell: !s.geoeffnetAm || jetzt - zuletzt < ANZEIGE_TAGE * 86400000, sichtbarBis: s.sichtbarBis });
      });
    });
    rueckgaben.sort((a, b) => String(b.freigegebenAm).localeCompare(String(a.freigegebenAm)));
    res.json({ ok: true, klasse: kind.klasse, rueckgaben, tage: RUECKGABE_TAGE });
  });
  app.post("/api/proben/rueckgabe/ansehen", async (req, res) => {
    const kind = await probeKind(req, res);
    if (!kind) return;
    const modul = String(req.body.modul || ""), id = String(req.body.id || "");
    const treffer = EIGENER_ABLAUF.has(modul) ? null : finde(modul, id);
    // fremde und unbekannte Abgaben sehen gleich aus – niemand erfährt, ob es eine Abgabe mit dieser Kennung gibt
    if (!treffer || String(treffer.r.code) !== String(kind.code)) return res.status(404).json({ ok: false, error: "not_found", message: "Diese Probe gibt es bei deinem Code nicht." });
    const daten = lies(), e = daten.rueckgaben[schluessel(modul, id)];
    if (!e) return res.status(403).json({ ok: false, error: "nicht_freigegeben", message: "Deine Lehrkraft hat diese Probe noch nicht zurückgegeben." });
    if (rueckgabeVorbei(e.freigegebenAm, jetztDatum())) return res.status(403).json({ ok: false, error: "nicht_freigegeben", vorbei: true, message: VORBEI_TEXT });
    if (!e.geoeffnetAm) { e.geoeffnetAm = jetztDatum().toISOString(); schreibe(daten); }
    const r = treffer.r;
    const aufgaben = (Array.isArray(r.details) ? r.details : []).map((d, i) => {
      const max = zahl(d.maxPoints, 1), punkte = zahl(d.points, d.correct ? 1 : 0);
      const a = { nr: d.nr != null ? d.nr : i + 1, prompt: text(d.prompt, 3000), given: paare(d.given, d.labels), points: punkte, max, comment: text(d.comment, 1500) };
      if (e.mitLoesung && punkte < max && d.expected != null && d.expected !== "") { a.loesung = paare(d.expected, d.labels, 3000); a.beispiel = d.type === "text"; }
      Object.assign(a, herkunft(d));
      // NT 8: Abbildung, Messwerttabelle, Diagramm, Endzustand einer Bauaufgabe und Lernhinweis – damit Korrektur und
      // Elternausdruck dieselbe Darstellung zeigen wie die Probe (nur was bei der Abgabe gespeichert wurde)
      ["image", "imageAlt", "tabelle", "diagramm", "labor", "zustand", "regeln", "tipp", "kompetenz"].forEach((k) => { if (d[k] !== undefined && d[k] !== "") a[k] = d[k]; });
      return a;
    });
    res.json({ ok: true, korrektur: {
      modul, id, fach: treffer.q.fach, titel: r.testTitle || r.testId, klasse: kind.klasse, code: kind.code,
      ...(r.variante ? { variante: r.variante } : {}), ...(r.testId ? { testId: r.testId } : {}),
      datum: r.testDate || r.submittedAt || "", freigegebenAm: e.freigegebenAm, sichtbarBis: sichtbarBis(e.freigegebenAm), kommentar: e.kommentar || r.kommentar || "",
      score: r.score, total: r.total, percent: r.percent, grade: r.grade, aufgaben
    } });
  });

  return { stand };
}

// Herkunft einer Aufgabe für die Rückgabe: Titel des Moduls (NT 7: modulTitel; NT 9: teil, bei Transferaufgaben
// modulTitel) und die Marke „Transfer“. So sieht das Kind, welches Modul es wiederholen sollte.
function herkunft(d) {
  const teil = String(d.teil || ""), istTransfer = Boolean(d.transfer) || teil.slice(0, 8).toLowerCase() === "transfer";
  const modul = String(d.modulTitel || (istTransfer ? "" : teil)).trim().slice(0, 120);
  return { ...(modul ? { modul } : {}), ...(istTransfer ? { transfer: true } : {}) };
}

module.exports = { registerProbenRueckgabeRoutes, RUECKGABE_TAGE, sichtbarBis, rueckgabeVorbei, VORBEI_TEXT };
