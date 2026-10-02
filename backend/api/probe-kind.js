"use strict";

/**
 * Proben: Die Kinder melden sich mit ihrem 3-stelligen Code aus dem Lernfortschritt an, nicht mit Namen.
 * Die Codes liegen in der Lernfortschritt-Datenbank (grumi-nt9), daraus kommt auch die Klasse.
 * Gespeichert werden nur Code und Klasse; welcher Name zu welchem Code gehört, weiß nur die Lehrkraft
 * (Namensliste in ihrem Browser). Gleiche Form wie im Deutsch-7-Trainer (argumentation7.js).
 *
 * probeKindPruefer(kindZumCode) -> async probeKind(req, res)
 *   liefert { code, klasse, zug: "M"|"R", firstName: "Code 123", lastName: "", className: klasse, key: "code|123" }
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
    return {
      code: kind.code, klasse: kind.klasse, zug: zugVonKlasse(kind.klasse),
      firstName: "Code " + kind.code, lastName: "", className: kind.klasse, key: "code|" + kind.code
    };
  };
}

module.exports = { probeKindPruefer, zugVonKlasse, GRADE_SCALE_M, GRADE_SCALE_R };
