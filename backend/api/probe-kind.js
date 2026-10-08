"use strict";

/**
 * Proben: Die Kinder melden sich mit ihrem 3-stelligen Code aus dem Lernfortschritt an, nicht mit Namen.
 * Die Codes liegen in der Lernfortschritt-Datenbank (grumi-nt9), daraus kommt auch die Klasse.
 * Gespeichert werden nur Code und Klasse; welcher Name zu welchem Code gehört, weiß nur die Lehrkraft
 * (Namensliste in ihrem Browser). Gleiche Form wie im Deutsch-7-Trainer (argumentation7.js).
 *
 * probeKindPruefer(kindZumCode) -> async probeKind(req, res)
 *   liefert { code, klasse, zug: "M"|"R", lrs, firstName: "Code 123", lastName: "", className: klasse, key: "code|123" }
 *   (lrs: Notenschutz LRS, von der Lehrkraft beim Code gesetzt -> Rechtschreibung zählt nicht)
 *   oder schreibt selbst die Fehlerantwort und liefert null.
 *
 * Notenschlüssel nach dem Zug des Kindes: M-Klassen 50 % = Note 4, R-Klassen 50 % = Note 3.
 * Proben, die M und R gemeinsam schreiben (Informatik), werten damit je Kind richtig.
 */
const GRADE_SCALE_M = [
  { grade: 1, min: 92 }, { grade: 2, min: 81 }, { grade: 3, min: 67 },
  { grade: 4, min: 50 }, { grade: 5, min: 30 }, { grade: 6, min: 0 }
];
const GRADE_SCALE_R = [
  { grade: 1, min: 87 }, { grade: 2, min: 73 }, { grade: 3, min: 50 },
  { grade: 4, min: 37 }, { grade: 5, min: 20 }, { grade: 6, min: 0 }
];
// „7aM“, „9M“ -> M; „7b“, „9R“ -> R
const zugVonKlasse = (klasse) => (/M$/.test(String(klasse || "")) ? "M" : "R");

/* Freigeschaltete Proben schließen sich 3 Stunden nach dem Freischalten von selbst, falls das Sperren
   vergessen wird (sonst ginge die Probe zu Hause). Abgeben geht eine Stunde länger, damit niemand
   mitten in der Probe seine Arbeit verliert. eintrag: { open, changedAt } aus der Freischalt-Datei. */
const OFFEN_MS = 3 * 60 * 60 * 1000;
const ABGABE_MS = 4 * 60 * 60 * 1000;
/* Sperrt die Lehrkraft die Probe von Hand, während Kinder noch abgeben (Stundenende), geht Abgeben noch
   NACHFRIST_MS weiter – sonst wäre die Arbeit dieser Kinder verloren. Beginnen kann die Probe dann niemand mehr. */
const NACHFRIST_MS = 15 * 60 * 1000;
function probeOffen(eintrag, zurAbgabe, jetzt = Date.now()) {
  if (!eintrag) return false;
  if (eintrag === true) return true; // ältere Form ohne Zeitpunkt (NT 7)
  if (!eintrag.open) {
    const zu = Date.parse(eintrag.changedAt || "");
    return Boolean(zurAbgabe) && Number.isFinite(zu) && jetzt - zu >= 0 && jetzt - zu < NACHFRIST_MS;
  }
  const seit = Date.parse(eintrag.changedAt || "");
  if (!Number.isFinite(seit)) return true;
  return jetzt - seit < (zurAbgabe ? ABGABE_MS : OFFEN_MS);
}

// Wie oft das Kind die Probe verlassen hat (Tab oder App gewechselt), zählt der Browser mit
const verlassenZahl = (v) => Math.max(0, Math.min(999, parseInt(v, 10) || 0));

/* Protokoll des Probenmodus (js/probe-schutz.js auf der Website), mit der Abgabe geschickt und bei ihr gespeichert:
   wechsel   [{ art: "verborgen" | "fokus" | "geschlossen", von, bis, sekunden }]   Seite verlassen – mit Uhrzeit und Dauer
   einfuegen [{ zeit, zeichen, woerter, erlaubt }]   kopieren [{ zeit, art, zeichen }]   spruenge [{ zeit, woerter, … }]
   Nur Zeitpunkte und Zahlen: Eingefügter oder kopierter Text wird nie übertragen. Welche andere Seite oder App offen
   war, kann ein Browser nicht erkennen – das steht nirgends. Nichts davon bewertet eine Probe; was die Ereignisse
   bedeuten, entscheidet die Lehrkraft. Ohne Ereignisse: undefined (es wird nichts gespeichert). */
function protokollSauber(p) {
  const istZeit = (v) => typeof v === "string" && v.length <= 30 && !Number.isNaN(Date.parse(v));
  const ganz = (v, max) => Math.max(0, Math.min(max, Math.round(Number(v)) || 0));
  const liste = (v) => (Array.isArray(v) ? v.slice(0, 100) : []);
  const aus = {
    wechsel: liste(p && p.wechsel).filter((w) => w && istZeit(w.von) && istZeit(w.bis))
      .map((w) => ({ art: ["fokus", "geschlossen"].includes(w.art) ? w.art : "verborgen", von: w.von, bis: w.bis, sekunden: ganz(w.sekunden, 86400) })),
    einfuegen: liste(p && p.einfuegen).filter((e) => e && istZeit(e.zeit)).map((e) => ({ zeit: e.zeit, zeichen: ganz(e.zeichen, 1000000), woerter: ganz(e.woerter, 200000), erlaubt: e.erlaubt === true })),
    kopieren: liste(p && p.kopieren).filter((e) => e && istZeit(e.zeit)).map((e) => ({ zeit: e.zeit, art: e.art === "cut" ? "cut" : "copy", zeichen: ganz(e.zeichen, 1000000) })),
    spruenge: liste(p && p.spruenge).filter((e) => e && istZeit(e.zeit))
      .map((e) => ({ zeit: e.zeit, woerter: ganz(e.woerter, 200000), sekunden: ganz(e.sekunden, 600), vorher: ganz(e.vorher, 200000), nachher: ganz(e.nachher, 200000) }))
  };
  // Verbindung weg / wieder da (nur wenn es welche gab – ältere Abgaben und Auswertungen kennen das Feld nicht)
  const verbindung = liste(p && p.verbindung).filter((e) => e && istZeit(e.zeit)).map((e) => ({ zeit: e.zeit, art: e.art === "da" ? "da" : "weg" }));
  if (verbindung.length) aus.verbindung = verbindung;
  return aus.wechsel.length || aus.einfuegen.length || aus.kopieren.length || aus.spruenge.length || verbindung.length ? aus : undefined;
}

/* Notenschutz LRS: Rechtschreibung zählt nicht. Text für die KI-Bewertung freier Antworten. */
const LRS_REGEL = "WICHTIG: Dieses Kind hat Notenschutz wegen LRS (Lese-Rechtschreib-Störung). Rechtschreibung zählt " +
  "überhaupt nicht – auch nicht Groß- und Kleinschreibung, vertauschte, fehlende oder lautgetreu geschriebene Buchstaben. " +
  "Bewerte nur, ob der Inhalt stimmt und ob erkennbar das richtige Wort gemeint ist.";

function probeKindPruefer(kindZumCode) {
  return async function probeKind(req, res) {
    const code = String((req.body && req.body.code) || "").trim();
    if (!code) {
      res.status(400).json({ ok: false, error: "code_fehlt", message: "Bitte melde dich mit deinem Code an. Siehst du kein Feld für den Code, lade die Seite neu." });
      return null;
    }
    if (!/^\d{3}$/.test(code)) {
      res.status(400).json({ ok: false, error: "code_falsch", message: "Der Code hat genau 3 Ziffern." });
      return null;
    }
    let kind = null;
    try { kind = await kindZumCode(code, req); } catch (error) {
      console.error("Probe-Anmeldung:", error.message);
      res.status(503).json({ ok: false, error: "codes_nicht_erreichbar", message: "Der Server kann die Codes gerade nicht prüfen. Versuch es gleich noch einmal." });
      return null;
    }
    if (kind && kind.gesperrt) {
      res.status(429).json({ ok: false, error: "gesperrt", message: "Zu viele falsche Codes. Warte ein paar Minuten." });
      return null;
    }
    if (!kind) {
      res.status(404).json({ ok: false, error: "code_unbekannt", message: "Diesen Code gibt es nicht. Prüfe ihn oder frag deine Lehrkraft." });
      return null;
    }
    // Lehrercode: öffnet Module, aber keine Proben – eine Abgabe unter diesem Code gehörte zu keiner Klasse
    if (kind.lehrer) {
      res.status(403).json({ ok: false, error: "lehrercode", message: "Mit dem Lehrercode kann keine Probe geschrieben werden. Ansehen kannst du jede Probe in der Verwaltung auf ihrer Lehrerseite." });
      return null;
    }
    return {
      code: kind.code, klasse: kind.klasse, zug: zugVonKlasse(kind.klasse), lrs: Boolean(kind.lrs),
      firstName: "Code " + kind.code, lastName: "", className: kind.klasse, key: "code|" + kind.code
    };
  };
}

/* Note erst nach der Rückgabe: Die Antwort auf eine Abgabe nennt dem Kind weder Punkte noch Note noch Lösungen –
   sonst stünden sie auf dem Bildschirm, während die Nachbarn noch schreiben. Die Lehrkraft sieht alles sofort
   (Noten, Lehrerseite der Probe) und gibt die Probe zurück; dann steht sie beim Kind unter „Zurückbekommen“
   (proben-rueckgabe.js). server.js hängt das vor die Abgabe-Routen aller Proben-Module (ABGABE_ROUTEN); die Module
   selbst antworten wie bisher. Deutsch 7 und 8 haben denselben Ablauf im eigenen Modul.
   Die Platzhalter („–“, leere Listen) sind für Seiten, die noch die frühere Antwort erwarten (offen gebliebener Tab). */
const ABGABE_ROUTEN = ["vokabeltest", "grammatik9r", "nt7", "nt8", "inf7", "inf8", "infoaustausch", "informatik8", "nt9probe",
  "netzwerktest", "filiuspruefung"].map((modul) => "/api/" + modul + "/submit");
function ohneErgebnis(body) {
  if (!body || body.ok !== true || !body.result || typeof body.result !== "object") return body;
  return { ok: true, abgegeben: true, result: { abgegeben: true, submittedAt: body.result.submittedAt || new Date().toISOString(),
    score: "–", total: "–", percent: "–", grade: "–", typos: 0, aiAccepted: 0, needsReview: false, teile: [], details: [] } };
}
function abgabeOhneErgebnis(_req, res, next) {
  const json = res.json.bind(res);
  res.json = (body) => json(ohneErgebnis(body));
  next();
}

module.exports = { probeKindPruefer, zugVonKlasse, probeOffen, NACHFRIST_MS, verlassenZahl, protokollSauber, LRS_REGEL, GRADE_SCALE_M, GRADE_SCALE_R,
  ABGABE_ROUTEN, ohneErgebnis, abgabeOhneErgebnis };
