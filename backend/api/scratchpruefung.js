"use strict";

/**
 * Scratch-Aufträge (Informatik 8, Modul 5): Das Kind lädt sein gespeichertes Projekt (.sb3) hoch.
 * -----------------------------------------------------------------------------------------
 * Wie bei den Excel-Aufträgen: Der Server liest das Projekt (eine .sb3 ist ein ZIP-Archiv mit project.json), ein
 * Prüfprogramm prüft die Punkte der Aufgabe EXAKT, und die KI schreibt danach die Rückmeldung in Schülersprache.
 * Die KI kann die Punkte nicht verändern. Fällt sie aus, gibt es die Punkte mit einem festen Satz.
 * Nichts wird gespeichert – kein Projekt, kein Name, keine Abgabe. An die KI geht nur das Programm als Text.
 *
 * Route:   POST <prefix>/scratch/pruefen     Body { aufgabe: "eingabe-auf1", datei: "<base64 der .sb3>" }
 * Antwort: { ok, lesbar, erfuellt, punkte: [{ ok, text }], rueckmeldung, quelle: "ki" | "ersatz" | "pruefprogramm" }
 */

const { zipLesen, rueckmeldungAusKi } = require("./excelpruefung");

const clean = (v) => String(v || "").trim();
const KEIN_PROJEKT = "Das ist kein Scratch-Projekt. Wähle die Datei mit der Endung .sb3, die du in Scratch gespeichert hast (Datei → Auf deinem Computer speichern).";
const MAX_BYTES = 700 * 1024;

async function kiRueckmeldung(aufgabe, programmText, punkte, erfuellt, askAnthropic, klasse) {
  const offen = punkte.filter((p) => !p.ok), gut = punkte.filter((p) => p.ok);
  const ersatz = erfuellt
    ? "Dein Programm erfüllt alle Punkte."
    : (gut.length ? "Ein Teil stimmt schon. " : "") + "Sieh dir die Punkte mit ✗ an, verbessere dein Programm in Scratch, speichere es und lade es noch einmal hoch.";
  if (typeof askAnthropic !== "function") return { text: ersatz, quelle: "ersatz" };

  const system = [
    `Du gibst einem Kind der ${klasse} einer bayerischen Mittelschule eine Rückmeldung zu seinem Scratch-Programm (Fach Informatik).`,
    "Ein Prüfprogramm hat das Programm schon genau geprüft. Seine Ergebnisse stimmen – ändere sie nicht und widersprich ihnen nicht.",
    "Schreibe höchstens 3 kurze Sätze (zusammen höchstens 45 Wörter) in einfacher Sprache und sprich das Kind mit du an.",
    "Nenne zuerst, was gelungen ist – auch dann, wenn noch etwas fehlt.",
    "Ist etwas offen: Greife nur EINEN offenen Punkt heraus, den wichtigsten. Nenne den Block mit seinem deutschen Namen aus Scratch",
    "und sag, wohin er gehört. Sage nicht das fertige Programm vor und zähle nicht alle offenen Punkte auf.",
    "Beschreibe keine Menüs oder Klickwege, die nicht im Auftrag oder in den Ergebnissen des Prüfprogramms stehen.",
    "Ist alles erfüllt: Lobe kurz und genau (was an diesem Programm gut ist). Fällt dir eine Kleinigkeit auf, zum Beispiel ein",
    "Tippfehler in einem Text der Figur oder ein fehlendes Leerzeichen, darfst du sie freundlich erwähnen.",
    "Sei freundlich und ermutigend. Keine Noten, keine Punkte, keine Emojis. Erfinde nichts, was nicht im Programm steht.",
    "Benutze im Text keine geraden Anführungszeichen. Namen von Blöcken schreibst du so: „frage … und warte“.",
    'Antworte nur als JSON: {"rueckmeldung": "..."}'
  ].join("\n");
  const user = [
    "Auftrag: " + aufgabe.auftrag,
    "Prüfprogramm – erfüllt:\n" + (gut.map((p) => "- " + p.text).join("\n") || "- nichts"),
    "Prüfprogramm – noch offen:\n" + (offen.map((p) => "- " + p.text).join("\n") || "- nichts"),
    "Das Programm des Kindes (Blöcke von oben nach unten, eingerückt = im Inneren einer Klammer):\n" + programmText
  ].join("\n\n");
  try {
    const text = rueckmeldungAusKi(await askAnthropic(system, user, 400));
    return text ? { text, quelle: "ki" } : { text: ersatz, quelle: "ersatz" };
  } catch (_e) {
    return { text: ersatz, quelle: "ersatz" };
  }
}

function registerScratchPruefung(app, opts = {}) {
  const askAnthropic = opts.askAnthropic, prefix = opts.prefix || "/api/inf8", klasse = opts.klasse || "8. Klasse";
  const { scratchProjekt, AUFGABEN } = opts.modul || require("./inf8-scratch-aufgaben");
  // Bremse wie bei den Excel-Aufträgen: darüber gibt es weiter die exakte Prüfung, nur ohne KI-Text
  const zaehler = new Map(), FENSTER = 10 * 60 * 1000, MAX_KI = Number(opts.maxKi) || 300;
  const kiErlaubt = (ip) => {
    const jetzt = Date.now(), e = zaehler.get(ip);
    if (!e || jetzt - e.start > FENSTER) { zaehler.set(ip, { start: jetzt, n: 1 }); if (zaehler.size > 5000) zaehler.clear(); return true; }
    return ++e.n <= MAX_KI;
  };

  app.post(prefix + "/scratch/pruefen", async (req, res) => {
    const kennung = clean(req.body?.aufgabe).slice(0, 60);
    const aufgabe = Object.prototype.hasOwnProperty.call(AUFGABEN, kennung) ? AUFGABEN[kennung] : null;
    if (!aufgabe) return res.status(404).json({ ok: false, error: "unbekannte_aufgabe", message: "Diese Aufgabe gibt es nicht." });
    const b64 = typeof req.body?.datei === "string" ? req.body.datei : "";
    if (!b64) return res.status(400).json({ ok: false, error: "keine_datei", message: "Es ist keine Datei angekommen." });
    const nichtLesbar = (text) => res.json({ ok: true, lesbar: false, erfuellt: false, punkte: [], rueckmeldung: text, quelle: "pruefprogramm" });
    if (b64.length > MAX_BYTES * 1.4) return nichtLesbar("Die Datei ist zu groß für die Prüfung hier. Beantworte die Frage darunter.");
    const buf = Buffer.from(b64, "base64");
    let x;
    try {
      const zip = zipLesen(buf);
      if (!zip.hat("project.json")) throw new Error("kein_projekt");
      x = scratchProjekt(zip.text("project.json"));
    } catch (_e) { return nichtLesbar(KEIN_PROJEKT); }
    let punkte;
    try { punkte = (aufgabe.pruefe(x) || []).map((p) => ({ ok: !!p.ok, text: clean(p.text).slice(0, 300) })); }
    catch (_e) { return nichtLesbar("Das Projekt lässt sich nicht prüfen. Speichere es in Scratch noch einmal und lade es erneut hoch."); }
    const erfuellt = punkte.length > 0 && punkte.every((p) => p.ok);
    // opts.merke: das Projekt für die Lehrkraft aufbewahren, wenn das Kind mit seinem Code angemeldet ist (abgaben.js)
    const [ki, gespeichert] = await Promise.all([
      kiRueckmeldung(aufgabe, x.text(), punkte, erfuellt, kiErlaubt(req.ip || "") ? askAnthropic : null, klasse),
      opts.merke ? opts.merke(req, { aufgabe: kennung, art: "sb3", buf, punkte }) : false
    ]);
    return res.json({ ok: true, lesbar: true, erfuellt, punkte, rueckmeldung: ki.text, quelle: ki.quelle, gespeichert: !!gespeichert });
  });
}

module.exports = { registerScratchPruefung };
