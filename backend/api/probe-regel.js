"use strict";

/* ------------------------------------------------------------------
   Testregeln für alle Proben (Wunsch der Lehrkraft: 16.10.2026 für die Vokabeltests, 17.10.2026 für alle Proben:
   „mach bei allen proben mehr als 1 minute verlassen automatisch note 6, kopierversuch einmal dann automatisch
   note 6 mit vorwarnungen“)

   - Insgesamt länger als 1 Minute weg (anderer Tab, andere App, Fenster ohne Fokus, Seite geschlossen; alle Wechsel
     zusammengezählt – Nachtrag der Lehrkraft: „in summe länger als eine minute = note 6 … alles unter 5 sekunden zählt
     nicht“): Die Probe ist beendet – Note 6, mit Vermerk in der Verwaltung (proben-noten.js). Ausnahme: Hat das Kind vor dem
     letzten Verlassen schon 2 Minuten nichts mehr eingegeben oder angetippt (fertig, Bildschirm hat sich von selbst
     gesperrt), wird die Probe nur abgegeben – ohne Note 6.
   - Kopieren oder Einfügen: eine Warnung, beim 2. Versuch ist die Probe beendet – Note 6.
   - Nur die Vokabeltests zusätzlich: beim 5. Verlassen beendet (4 Warnungen) – das regelt vokabeltest.js selbst.
   Zählen und Warnen macht die Seite (js/probe-schutz.js, Angabe regel). Beendet = die Seite gibt sofort ab, das
   Proben-Modul gibt Note 6 (abbruch in der Abgabe). Die Lehrkraft kann die Note 6 aufheben (Route aufheben).

   Routen:
     POST /api/probe-regel/vorfall  { modul, testId, code, verlassen, kopieren }  Seite meldet ihre Zahlen; Antwort:
                                    die gezählten Zahlen (höchster Stand – auch nach Neuladen oder Gerätewechsel)
     POST /api/probe-regel/aufheben { password, modul, submissionId, aufheben }   Note 6 aufheben / wieder setzen
   Die Proben-Module melden sich mit modulAnmelden(name, { aufheben(id, aufheben) }) an und rufen bei der Abgabe
   abbruchAusAbgabe(body, modul, testId, studentKey) auf; nach jedem Neurechnen note6(rec).
   ------------------------------------------------------------------ */

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { probeKindPruefer } = require("./probe-kind");

// verlassen: 0 = kein Höchstwert für die Zahl der Wechsel (nur Vokabeltests haben 5)
const REGEL = { verlassen: 0, kopieren: 2, wegSekunden: 60 };
const GRUENDE = ["verlassen", "kopieren", "weg"];
const ABBRUCH_TEXT = {
  verlassen: (a) => `Test beendet: Die Testseite wurde ${a.verlassen}-mal verlassen (nach 4 Warnungen). Deshalb Note 6.`,
  kopieren: () => "Probe beendet: zweiter Versuch zu kopieren oder einzufügen (nach einer Warnung). Deshalb Note 6.",
  weg: (a) => `Probe beendet: Die Seite war insgesamt ${a.sekunden ? a.sekunden + " Sekunden" : "länger als 1 Minute"} verlassen (erlaubt ist höchstens 1 Minute; Wechsel unter 5 Sekunden zählen nicht). Deshalb Note 6.`
};
// automatisch abgegeben, aber ohne Note 6 (zeit: Bearbeitungszeit der Probe abgelaufen, die Seite hat abgegeben – NT 9 Probe 2)
const AUTOMATISCH = ["ruhe", "gesperrt", "server", "zeit"];
const anzahl = (v) => Math.max(0, Math.min(999, Math.round(Number(v)) || 0));
const clean = (v, max = 120) => String(v ?? "").trim().slice(0, max);

/* Abbruch aus einer Abgabe lesen: Nur Seiten, die die Regeln kennen (regel: true), können einen Abbruch melden – eine
   alte, noch offene Seite hat nicht gewarnt. gezaehlt = was der Server zählt ({ verlassen, kopieren }).
   regel = die Regeln des Moduls (Vokabeltest: verlassen 5). Ergebnis: abbruch-Objekt oder null. */
function abbruchAusAbgabe(body, gezaehlt, regel = REGEL, verlassenSeite = 0) {
  if (!body || body.regel !== true) return null;
  const angabe = body.abbruch && typeof body.abbruch === "object" ? body.abbruch : {};
  const verlassen = Math.max(anzahl(verlassenSeite || body.verlassen), anzahl(gezaehlt && gezaehlt.verlassen));
  const kopierversuche = Math.max(anzahl(body.kopierversuche), anzahl(gezaehlt && gezaehlt.kopieren));
  // Sekunden insgesamt verlassen (Seite und Server zählen mit, es gilt der höhere Stand)
  const wegSumme = Math.max(anzahl(body.wegSumme), anzahl(gezaehlt && gezaehlt.wegSumme), anzahl(angabe.sekunden));
  let grund = GRUENDE.includes(angabe.grund) ? angabe.grund : "";
  // Probe ohne Grenze für das Verlassen (wegSekunden 0, z. B. Nachholprobe 2 Deutsch 7): auch eine ältere Seite beendet dann nicht
  if (grund === "weg" && !regel.wegSekunden) grund = "";
  // Probe ohne Grenze für Kopierversuche (kopieren 0, Informatik 8 Probe 1c/2c): ebenso, auch wenn eine ältere Seite „kopieren“ meldet
  if (grund === "kopieren" && !regel.kopieren) grund = "";
  // Die Seite hat ohne Note 6 abgegeben (Bildschirm gesperrt nach 2 Minuten Ruhe): dann zählt die Summe nicht als Abbruch
  if (!grund && regel.wegSekunden && wegSumme > regel.wegSekunden && body.automatisch !== "gesperrt") grund = "weg";
  if (!grund && regel.verlassen && verlassen >= regel.verlassen) grund = "verlassen";
  if (!grund && regel.kopieren && kopierversuche >= regel.kopieren) grund = "kopieren";
  if (!grund) return null;
  const a = { grund, verlassen, kopierversuche, zeit: new Date().toISOString() };
  if (grund === "weg") a.sekunden = wegSumme || undefined;
  a.text = ABBRUCH_TEXT[grund](a);
  return a;
}
// Ohne Note 6 automatisch abgegeben (5 Minuten nichts eingegeben, Bildschirm gesperrt): nur ein Vermerk
function automatischAusAbgabe(body) {
  return body && body.regel === true && AUTOMATISCH.includes(body.automatisch) ? body.automatisch : "";
}
// Ein nach den Regeln beendeter Test bleibt Note 6, solange die Lehrkraft das nicht aufhebt
function note6(rec) {
  if (rec && rec.abbruch && !rec.abbruch.aufgehoben) rec.grade = 6;
  return rec;
}
// Was die Abgabe zu den Testregeln sagt (null: Seite ohne Testregeln) – für eintragen()
function ausAbgabe(body, modul, testId, studentKey, regel = REGEL) {
  if (!body || body.regel !== true) return null;
  const gz = gezaehlt(modul, testId, studentKey);
  const abbruch = abbruchAusAbgabe(body, gz, regel);
  return { abbruch, automatisch: abbruch ? "" : automatischAusAbgabe(body),
    kopierversuche: Math.max(anzahl(body.kopierversuche), anzahl(gz.kopieren)),
    wegSekunden: Math.max(anzahl(body.wegSumme), anzahl(gz.wegSumme)) };
}
// Testregeln in eine neue Abgabe eintragen (nach dem Rechnen, vor dem Speichern)
function eintragen(rec, stand) {
  if (!stand) return rec;
  rec.kopierversuche = stand.kopierversuche;
  rec.wegSekunden = stand.wegSekunden;   // Sekunden insgesamt verlassen (Vermerk in der Verwaltung)
  if (stand.automatisch) rec.automatisch = stand.automatisch;
  if (!stand.abbruch) return rec;
  rec.abbruch = stand.abbruch;
  if (!rec.kommentar) rec.kommentar = stand.abbruch.text;
  return note6(rec);
}
// Aufheben / wieder setzen an einer gespeicherten Abgabe (das Modul rechnet danach die Note neu und speichert)
function aufhebenSetzen(rec, aufheben) {
  rec.abbruch.aufgehoben = aufheben === true;
  if (rec.abbruch.aufgehoben) {
    rec.abbruch.aufgehobenAm = new Date().toISOString();
    if (rec.kommentar === rec.abbruch.text) delete rec.kommentar;
  } else {
    delete rec.abbruch.aufgehobenAm;
    if (!rec.kommentar) rec.kommentar = rec.abbruch.text;
  }
}

const module_ = new Map();   // Modulname -> { aufheben(id, aufheben) -> Ergebnis | null }
function modulAnmelden(name, fn) { module_.set(name, fn); }

let speicher = null;   // gesetzt von registerProbeRegel
const schluessel = (modul, testId, studentKey) => modul + "|" + testId + "|" + studentKey;
function gezaehlt(modul, testId, studentKey) {
  if (!speicher) return {};
  return speicher.lesen().eintraege[schluessel(modul, testId, studentKey)] || {};
}
// Nach der Abgabe (die Zahlen stehen jetzt in der Abgabe) und beim Löschen einer Abgabe (Nachschreiben)
function vergessen(modul, testId, studentKey) {
  if (!speicher) return;
  const db = speicher.lesen(), k = schluessel(modul, testId, studentKey);
  if (!db.eintraege[k]) return;
  delete db.eintraege[k];
  speicher.schreiben(db);
}

function registerProbeRegel(app, opts = {}) {
  const DATEI = path.join(opts.dataDir || path.join(__dirname, "..", "data"), "probe_regel.json");
  const TEACHER_PASSWORD = String(opts.teacherPassword || "");
  speicher = {
    lesen() {
      try { const d = JSON.parse(fs.readFileSync(DATEI, "utf8")); return d && d.eintraege && typeof d.eintraege === "object" ? d : { eintraege: {} }; }
      catch (_e) { return { eintraege: {} }; }
    },
    schreiben(d) {
      fs.mkdirSync(path.dirname(DATEI), { recursive: true });
      const tmp = DATEI + ".tmp";
      fs.writeFileSync(tmp, JSON.stringify(d), "utf8");
      // Windows: rename scheitert manchmal kurz (Virenscanner) – dann einmal direkt schreiben
      try { fs.renameSync(tmp, DATEI); } catch (_e) { fs.writeFileSync(DATEI, JSON.stringify(d), "utf8"); try { fs.unlinkSync(tmp); } catch (_x) { /* egal */ } }
    }
  };
  const probeKind = probeKindPruefer(opts.kindZumCode);
  const lehrkraft = (req) => {
    if (!TEACHER_PASSWORD) return false;
    const a = Buffer.from(clean(req.body && req.body.password, 200)), b = Buffer.from(TEACHER_PASSWORD);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  };

  app.post("/api/probe-regel/vorfall", async (req, res) => {
    const modul = clean(req.body && req.body.modul, 40), testId = clean(req.body && req.body.testId, 80);
    if (!module_.has(modul) || !testId) return res.status(404).json({ ok: false, error: "unbekannt" });
    const kind = await probeKind(req, res);
    if (!kind) return;
    const db = speicher.lesen();
    // Liegen gebliebene Stände (Probe nie abgegeben) nach einer Woche entfernen
    const alt = Date.now() - 7 * 24 * 60 * 60 * 1000;
    for (const [k, v] of Object.entries(db.eintraege)) if (!v || !(Date.parse(v.zeit) > alt)) delete db.eintraege[k];
    const k = schluessel(modul, testId, kind.key), vorher = db.eintraege[k] || {};
    const stand = {
      verlassen: Math.max(anzahl(vorher.verlassen), anzahl(req.body.verlassen)),
      kopieren: Math.max(anzahl(vorher.kopieren), anzahl(req.body.kopieren)),
      wegSumme: Math.max(anzahl(vorher.wegSumme), anzahl(req.body.wegSumme)),
      zeit: new Date().toISOString()
    };
    db.eintraege[k] = stand;
    speicher.schreiben(db);
    res.json({ ok: true, verlassen: stand.verlassen, kopieren: stand.kopieren, wegSumme: stand.wegSumme, regel: REGEL });
  });

  app.post("/api/probe-regel/aufheben", async (req, res) => {
    if (!lehrkraft(req)) return res.status(401).json({ ok: false, error: "bad_password" });
    const m = module_.get(clean(req.body && req.body.modul, 40));
    if (!m) return res.status(404).json({ ok: false, error: "unbekannt" });
    try {
      const r = await m.aufheben(clean(req.body.submissionId, 120), req.body.aufheben === true);
      if (!r) return res.status(404).json({ ok: false, error: "not_found" });
      if (r.fehler) return res.status(409).json({ ok: false, error: r.fehler, message: "Diese Probe wurde nicht vorzeitig beendet." });
      res.json({ ok: true, ...r });
    } catch (err) {
      console.error("Testregeln aufheben:", err && err.message);
      res.status(500).json({ ok: false, error: "server_error" });
    }
  });
}

/* Für die Module: Aufheben-Funktion aus Lesen/Schreiben der Abgaben bauen.
   lesen() -> { daten, liste }, schreiben(daten), neu(rec) rechnet Punkte/Note neu (danach note6). */
function aufhebenMit({ lesen, schreiben, neu }) {
  return (id, aufheben) => {
    const { daten, liste } = lesen();
    const rec = (liste || []).find((s) => s.id === id);
    if (!rec) return null;
    if (!rec.abbruch) return { fehler: "kein_abbruch" };
    aufhebenSetzen(rec, aufheben);
    if (neu) neu(rec);
    note6(rec);
    schreiben(daten);
    return { score: rec.score, total: rec.total, percent: rec.percent, grade: rec.grade, abbruch: rec.abbruch };
  };
}

module.exports = { REGEL, ABBRUCH_TEXT, AUTOMATISCH, abbruchAusAbgabe, automatischAusAbgabe, ausAbgabe, note6, eintragen, aufhebenSetzen,
  modulAnmelden, gezaehlt, vergessen, registerProbeRegel, aufhebenMit };
