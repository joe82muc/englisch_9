"use strict";

/**
 * Filius-Aufträge in den Einheiten: Datei hochladen, sofort bewerten, für die Probe aufbewahren
 * (Informatik 9, seit 25.10.2026: Laden-Aufgabe am Ende von N1, Punkte zählen für Probe 1b).
 *
 *   POST <prefix>/filius/pruefen { aufgabe, datei (base64), code? }
 *   -> { ok, lesbar, erfuellt, punkte: [{ ok, text }], rueckmeldung, quelle, wertung: { punkte, max, beste }, gespeichert, hinweis? }
 *
 * Bewertung: Das Prüfprogramm (filiuspruefung.js) vergibt die Punkte der Schritte genau; die KI vergibt kiPunkte nach
 * kiKriterien (wohlwollend) und schreibt die Rückmeldung. Ist die KI nicht da, prüft der Server die Namen selbst
 * (aufgabe.namen, ohne Groß/Klein und Umlaute) – so bekommt das Kind immer sofort seine Punkte.
 * Speichern: Mit dem Code eines Kindes der Stufe (opts.kindZumCode) legt der Server Datei und Wertung in den
 * Abgaben-Speicher (abgaben.js, Art "fls"). Es zählt die beste Abgabe: eine schlechtere ersetzt eine bessere nicht.
 * Die Probe holt sie über nt7.js (Aufgabe { type: "filius", ausModul: "<Kennung>" }).
 */

const FiliusLeser = require("./filiuspruefung");
const { maxPunkte } = require("./inf9-filius-aufgaben");

const clean = (v, n = 300) => String(v == null ? "" : v).trim().slice(0, n);
const glatt = (s) => String(s || "").toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]/g, "");
const MAX_BYTES = 300 * 1024;

// Geräte und Kabel als kurzer Text (für Lehrkraft, Probe und KI)
function netzText(netz) {
  const geraete = (netz.geraete || []).map((g) => (g.name || g.art) + " (" + g.art + (g.ips && g.ips.length ? ", " + g.ips.join(" / ") : "") + ")").join(", ");
  const kabel = (netz.kabel || []).map((k) => k.join(" – ")).join(", ");
  return "Geräte: " + (geraete || "keine") + " · Kabel: " + (kabel || "keins");
}

// Namen ohne KI: jeder verlangte Name kommt vor (Groß/Klein, Umlaute und Satzzeichen zählen nicht)
function namenOk(aufgabe, netz) {
  if (!Array.isArray(aufgabe.namen) || !aufgabe.namen.length) return false;
  const da = new Set((netz.geraete || []).map((g) => glatt(g.name)));
  return aufgabe.namen.every((n) => da.has(glatt(n)));
}

/**
 * KI: vergibt 0 … max Punkte nach den Kriterien und schreibt die Rückmeldung (du-Form). null, wenn sie ausfällt.
 * pruefung = Ergebnis von FiliusLeser.dateiPruefen
 */
async function filiusKi({ auftrag, kriterien, max, pruefung, askAnthropic, stufe }) {
  if (!max || typeof askAnthropic !== "function" || !pruefung || !pruefung.lesbar) return null;
  const system = [
    "Du prüfst eine Filius-Datei eines Kindes der " + (stufe || "9") + ". Klasse einer bayerischen Mittelschule (Fach Informatik).",
    "Ein Prüfprogramm hat die festen Schritte schon genau geprüft (gepruefteSchritte) – diese Punkte änderst du nicht und widersprichst ihnen nicht.",
    "Du vergibst nur die zusätzlichen Punkte nach den Kriterien (0 bis " + max + " ganze Punkte). Bewerte wohlwollend:",
    "Groß- und Kleinschreibung, Umlaute (ue statt ü) und kleine Tippfehler bei Namen zählen nicht. Im Zweifel für das Kind.",
    "text: Rückmeldung an das Kind auf Deutsch, du-Form, höchstens 2 kurze Sätze, zuerst was gelungen ist. Fehlt etwas,",
    "nenne einen Punkt, den das Kind in Filius verbessern kann. Keine Punktzahlen, keine Emojis.",
    "Antworte ausschließlich mit JSON: {\"punkte\":0,\"text\":\"…\"}."
  ].join("\n");
  const user = JSON.stringify({ auftrag, kriterien: kriterien || [], hoechstpunkte: max,
    gepruefteSchritte: (pruefung.details || []).map((x) => ({ schritt: x.text, erfuellt: x.erfuellt, gefunden: x.ist })), gebautesNetz: pruefung.netz });
  try {
    const roh = await askAnthropic(system, user, 260);
    const treffer = String(roh || "").match(/\{[\s\S]*\}/);
    if (!treffer) throw new Error("keine JSON-Antwort");
    const d = JSON.parse(treffer[0]);
    if (!Number.isFinite(Number(d.punkte))) throw new Error("keine Punkte");
    return { punkte: Math.max(0, Math.min(max, Math.round(Number(d.punkte)))), text: clean(d.text, 320), quelle: "ki" };
  } catch (err) {
    console.error("Filius-Prüfung KI:", err && err.message);
    return null;
  }
}

// Eine Datei bewerten: { lesbar, hinweis?, pruefung, ki, exakt, gesamt, max, liste: [{ ok, text }] }
async function bewerten(aufgabe, buf, askAnthropic, stufe) {
  const pruefung = FiliusLeser.dateiPruefen(buf, { checks: aufgabe.checks });
  if (!pruefung.lesbar) return { lesbar: false, hinweis: pruefung.hinweis };
  const kiMax = aufgabe.kiPunkte || 0;
  let ki = await filiusKi({ auftrag: aufgabe.auftrag, kriterien: aufgabe.kiKriterien, max: kiMax, pruefung, askAnthropic, stufe });
  if (!ki) ki = { punkte: kiMax && namenOk(aufgabe, pruefung.netz) ? kiMax : 0, text: "", quelle: "ersatz" };
  const exakt = pruefung.punkte, max = maxPunkte(aufgabe);
  const liste = pruefung.details.map((d) => ({ ok: d.erfuellt, text: d.erfuellt ? d.text : d.text + " (gefunden: " + d.ist + ")" }));
  if (kiMax) liste.push({ ok: ki.punkte >= kiMax, text: aufgabe.kiText || "Namen der Geräte" });
  return { lesbar: true, pruefung, ki, exakt, gesamt: exakt + ki.punkte, max, liste };
}

function registerFiliusModulPruefung(app, opts = {}) {
  const prefix = String(opts.prefix || "/api/inf9").replace(/\/$/, ""), aufgaben = opts.aufgaben || {};
  const askAnthropic = opts.askAnthropic, speicher = opts.speicher, kindZumCode = opts.kindZumCode;
  const STUFE = parseInt(opts.stufe, 10) || 9, klasseNorm = opts.klasseNorm || ((k) => String(k || ""));
  // Bremse gegen Dauerfeuer (wie Excel/Scratch): darüber gibt es weiter die genaue Prüfung, die Namen ohne KI
  const zaehler = new Map(), FENSTER = 10 * 60 * 1000, MAX_KI = Number(opts.maxKi) || 300;
  const kiErlaubt = (ip) => {
    const jetzt = Date.now(), e = zaehler.get(ip);
    if (!e || jetzt - e.start > FENSTER) { zaehler.set(ip, { start: jetzt, n: 1 }); if (zaehler.size > 5000) zaehler.clear(); return true; }
    return ++e.n <= MAX_KI;
  };

  app.post(prefix + "/filius/pruefen", async (req, res) => {
    const kennung = clean(req.body && req.body.aufgabe, 60);
    const aufgabe = Object.prototype.hasOwnProperty.call(aufgaben, kennung) ? aufgaben[kennung] : null;
    if (!aufgabe) return res.status(404).json({ ok: false, error: "unbekannte_aufgabe", message: "Diese Aufgabe gibt es nicht." });
    const b64 = typeof (req.body && req.body.datei) === "string" ? req.body.datei.replace(/^data:[^,]*,/, "") : "";
    if (!b64) return res.status(400).json({ ok: false, error: "keine_datei", message: "Es ist keine Datei angekommen." });
    const nichtLesbar = (text) => res.json({ ok: true, lesbar: false, erfuellt: false, punkte: [], rueckmeldung: text, quelle: "pruefprogramm" });
    if (b64.length > MAX_BYTES * 1.4) return nichtLesbar("Die Datei ist zu groß für eine Filius-Datei aus diesem Auftrag. Hast du die richtige Datei gewählt?");
    const buf = Buffer.from(b64, "base64");
    try {
      const r = await bewerten(aufgabe, buf, kiErlaubt(req.ip || "") ? askAnthropic : null, STUFE);
      if (!r.lesbar) return nichtLesbar(r.hinweis);
      // Für die Lehrkraft und die Probe aufbewahren – nur mit dem Code eines Kindes dieser Stufe
      const code = clean(req.body.code, 12);
      let gespeichert = false, beste = { punkte: r.gesamt, zeit: new Date().toISOString() }, hinweis = "";
      if (code && speicher && kindZumCode) {
        try {
          const kind = await kindZumCode(code, req);
          const klasse = kind && !kind.gesperrt ? klasseNorm(kind.klasse) : "";
          if (klasse && parseInt(klasse, 10) === STUFE) {
            const kc = String(kind.code || code), alt = await speicher.hole(klasse, kc, kennung);
            const offen = r.liste.filter((p) => !p.ok).length;
            const meta = { zeit: new Date().toISOString(), art: "fls", groesse: buf.length, erfuellt: r.gesamt === r.max, offen, anzahl: r.liste.length,
              punkte: r.gesamt, max: r.max, exakt: r.exakt, ki: { punkte: r.ki.punkte, text: r.ki.text, quelle: r.ki.quelle },
              liste: r.liste, netzText: netzText(r.pruefung.netz) };
            if (alt && alt.meta && typeof alt.meta.punkte === "number" && alt.meta.punkte > r.gesamt) beste = { punkte: alt.meta.punkte, zeit: alt.meta.zeit };
            else await speicher.speichere(klasse, kc, kennung, meta, buf);
            gespeichert = true;
          } else hinweis = "Dein Code gehört nicht zu einer " + STUFE + ". Klasse – die Punkte werden nicht gespeichert.";
        } catch (err) {
          console.error("Filius-Abgabe speichern:", err && err.message);
          hinweis = "Deine Datei ist geprüft, konnte aber gerade nicht gespeichert werden. Lade sie in einer Minute noch einmal hoch.";
        }
      } else hinweis = "Du bist nicht mit deinem Code angemeldet. Deine Punkte werden deshalb nicht für die Probe gespeichert. Melde dich oben mit deinem Code an und lade die Datei noch einmal hoch.";
      const erfuellt = r.gesamt === r.max;
      const ersatzText = erfuellt ? "Alles Geforderte ist da – gut gemacht." : "Ein Teil stimmt schon. Sieh dir die Punkte mit ✗ an, verbessere sie in Filius, speichere und lade die Datei noch einmal hoch.";
      return res.json({ ok: true, lesbar: true, erfuellt, punkte: r.liste, rueckmeldung: r.ki.text || ersatzText, quelle: r.ki.quelle === "ki" ? "ki" : "pruefprogramm",
        wertung: { punkte: r.gesamt, max: r.max, beste: beste.punkte }, gespeichert, ...(hinweis ? { hinweis } : {}) });
    } catch (err) {
      console.error("Filius-Prüfung:", err && err.message);
      return nichtLesbar("Die Datei lässt sich nicht prüfen. Speichere in Filius noch einmal (im Entwurfsmodus) und lade die neue Datei hoch.");
    }
  });
}

module.exports = { registerFiliusModulPruefung, bewerten, filiusKi, netzText, namenOk };
