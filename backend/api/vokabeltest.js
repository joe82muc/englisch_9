"use strict";

/**
 * Vokabeltest-Modul
 * -----------------
 * Stellt die Routen fuer schriftliche Vokabeltests bereit:
 *   - Lehrkraft schaltet einen Test frei / sperrt ihn wieder
 *   - Schueler sehen nur freigeschaltete Tests
 *   - Jede Schuelerin / jeder Schueler kann pro Test genau EINMAL abgeben
 *   - Auswertung und Notenberechnung passieren serverseitig
 *
 * Wichtig: Die Sperre gegen mehrfaches Abgeben liegt bewusst auf dem Server.
 * Ein Neuladen der Seite (F5) kann im Browser nicht zuverlaessig verhindert
 * werden - der Server lehnt eine zweite Abgabe deshalb selbst ab.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { probeKindPruefer, probeOffen, verlassenZahl, protokollSauber } = require("./probe-kind");
const { verwandt } = require("./wortformen");

/* ------------------------------------------------------------------
   Notenschluessel

   GRADE_SCALE      Mittelschule M-Zug (50 % = Note 4) - Englisch 7, 7M und 9M
   GRADE_SCALE_8R   milderer Schluessel (50 % = Note 3) - Englisch 8R
   GRADE_SCALE_9R   milderer Schluessel (50 % = Note 3) - Englisch 9R und 7R ("7R")

   Welcher Schluessel gilt, steht an der Testdefinition im Feld
   "gradeScale". Ohne Angabe bleibt es beim bisherigen M-Zug-Schluessel,
   damit bereits gestellte Proben ihre Noten behalten.
   ------------------------------------------------------------------ */
const GRADE_SCALE = [
  { grade: 1, min: 92 },
  { grade: 2, min: 81 },
  { grade: 3, min: 67 },
  { grade: 4, min: 50 },
  { grade: 5, min: 30 },
  { grade: 6, min: 0 }
];

const GRADE_SCALE_8R = [
  { grade: 1, min: 87 },
  { grade: 2, min: 73 },
  { grade: 3, min: 50 },
  { grade: 4, min: 37 },
  { grade: 5, min: 20 },
  { grade: 6, min: 0 }
];

const GRADE_SCALE_9R = [
  { grade: 1, min: 87 },
  { grade: 2, min: 73 },
  { grade: 3, min: 50 },
  { grade: 4, min: 37 },
  { grade: 5, min: 20 },
  { grade: 6, min: 0 }
];

const GRADE_SCALES = { "default": GRADE_SCALE, "8R": GRADE_SCALE_8R, "9R": GRADE_SCALE_9R, "7R": GRADE_SCALE_9R };

function gradeFromPercent(percent, scaleName) {
  const p = Number(percent) || 0;
  const scale = GRADE_SCALES[scaleName] || GRADE_SCALE;
  for (const step of scale) {
    if (p >= step.min) return step.grade;
  }
  return 6;
}

/* ------------------------------------------------------------------
   Antwortvergleich
   ------------------------------------------------------------------ */

/** Vereinheitlicht eine Antwort: Kleinschreibung, ohne Artikel/"to",
 *  ohne Klammerzusaetze, ohne Satzzeichen. */
function normalizeAnswer(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")   // Akzente entfernen
    .replace(/\([^)]*\)/g, " ")                          // (Klammern) weg
    .replace(/^(to|the|a|an|der|die|das|ein|eine)\s+/, "")
    .replace(/[.,;:!?"'`´]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Levenshtein-Distanz, begrenzt auf max (Abbruch spart Zeit). */
function editDistance(a, b, max) {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (cur[j] < rowMin) rowMin = cur[j];
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

/* ------------------------------------------------------------------
   Schreibfehler in englischen Antworten – seit 08.10.2026 strenger.
   Vorher zaehlte ab 5 Buchstaben jeder einzelne Buchstabenfehler noch als richtig; damit galten auch andere
   Woerter ("clear" fuer "clean", "cost" fuer "coast"). Jetzt zaehlt die Schreibweise. Nachsicht gibt es nur noch
     - fuer Leerzeichen und Bindestrich ("north west" fuer "northwest") und
     - fuer genau EINEN falschen, fehlenden oder ueberzaehligen Buchstaben in EINEM langen Wort
       (ab TIPPFEHLER_AB Buchstaben: "enviroment" fuer "environment") – nicht, wenn dabei ein Wort der deutschen
       Vorgabe ("Republik") oder ein anderes Wort aus den Vokabeltests herauskommt.
   Solche Antworten tragen weiter das Merkmal "typo" und den Hinweis, wie man das Wort schreibt.
   Notenschutz LRS und deutsche Antworten (Englisch -> Deutsch) behalten die fruehere Nachsicht.
   ------------------------------------------------------------------ */
const TIPPFEHLER_AB = 8;
// Britische und amerikanische Schreibweise sind beide richtig – auch wenn in den Loesungen nur eine steht
const SCHREIBWEISEN = new Map([["center", "centre"], ["theater", "theatre"], ["meter", "metre"], ["liter", "litre"],
  ["color", "colour"], ["favorite", "favourite"], ["neighbor", "neighbour"], ["harbor", "harbour"], ["gray", "grey"],
  ["mom", "mum"], ["math", "maths"], ["program", "programme"], ["traveling", "travelling"], ["traveled", "travelled"],
  ["traveler", "traveller"], ["jewelry", "jewellery"], ["tire", "tyre"], ["airplane", "aeroplane"],
  ["organize", "organise"], ["realize", "realise"], ["recognize", "recognise"], ["apologize", "apologise"]]);
const einheitlich = (s) => String(s).replace(/[a-z]+/g, (w) => SCHREIBWEISEN.get(w) || w);
const kompakt = (s) => String(s).replace(/[\s-]+/g, "");
const wortTeile = (s) => String(s).split(/[\s-]+/).filter(Boolean);
function kleinerTippfehler(g, sol, tabu) {
  if (kompakt(g) === kompakt(sol)) return true;
  const a = wortTeile(g), b = wortTeile(sol);
  if (a.length !== b.length) return false;
  let fehler = 0;
  for (let i = 0; i < b.length; i++) {
    if (a[i] === b[i]) continue;
    if (b[i].length < TIPPFEHLER_AB || editDistance(a[i], b[i], 1) > 1) return false;
    if (tabu && tabu(a[i])) return false;
    fehler++;
  }
  return fehler === 1;
}
// Liegt die Antwort genau einen Buchstaben neben einer Loesung ("cost"/"coast", "clear"/"clean", aber auch "color"/"colour")?
function einBuchstabeDaneben(given, solutions) {
  const g = normalizeAnswer(given);
  if (!g) return false;
  return (solutions || []).some((sol) => String(sol).split(";").some((part) => {
    const n = normalizeAnswer(part);
    return Boolean(n) && n !== g && editDistance(g, n, 1) <= 1;
  }));
}

/**
 * Prueft eine Schuelerantwort gegen alle zugelassenen Loesungen.
 * Rueckgabe: { correct, typo, matched }
 * Schreibfehler: siehe kleinerTippfehler(). Was trotz Fehler zaehlt, wird als "typo" markiert,
 * damit die Lehrkraft es sieht.
 * lrs (Notenschutz LRS): mehr Toleranz, ab 3 Zeichen 1 Fehler, ab 6 Zeichen 2 Fehler.
 * Lautgetreue Schreibungen ("wenzday") erkennt danach die KI.
 * opts: { direction: "de-en" | "en-de", prompt: deutsche Vorgabe, bekannt: Set aller Loesungswoerter der Tests }
 */
function checkAnswer(given, solutions, lrs, opts) {
  const g = normalizeAnswer(given);
  if (!g) return { correct: false, typo: false, matched: "" };

  // Unregelmäßige Verben („drive, drove, driven“): alle drei Formen müssen dastehen
  const verben = verbFormen(solutions);
  if (verben.length) {
    const versuche = verben.map((formen) => checkVerbFormen(given, formen, lrs));
    return versuche.find((v) => v.correct) || versuche[0];
  }

  const accepted = [];
  for (const sol of solutions) {
    // ";" trennt gleichwertige Bedeutungen ("Norden; Nord-")
    String(sol).split(";").forEach((part) => {
      const n = normalizeAnswer(part);
      if (n) accepted.push({ norm: n, raw: String(part).trim() });
    });
  }
  const deutscheAntwort = Boolean(opts && opts.direction === "en-de");
  const vorgabe = new Set(wortTeile(normalizeAnswer(opts && opts.prompt)));
  const tabu = (wort) => vorgabe.has(wort) || Boolean(opts && opts.bekannt && opts.bekannt.has(wort));

  // Eine einzelne Antwort (die ganze Eingabe oder ein Teil davon, siehe mitZusatz) gegen die Loesungen pruefen
  const einzeln = (roh) => {
    const n = normalizeAnswer(roh);
    if (!n) return { correct: false, typo: false, matched: "" };
    // Englische Eigennamen (France, Northern Ireland, CV …) müssen großgeschrieben sein – außer bei Notenschutz LRS
    const mitGross = (ergebnis, a) => {
      const fehler = lrs ? [] : grossFehler(roh, a.raw);
      return fehler.length ? { correct: false, typo: false, matched: a.raw, gross: fehler } : ergebnis;
    };
    for (const a of accepted) {
      if (n === a.norm) return mitGross({ correct: true, typo: false, matched: a.raw }, a);
    }
    if (!deutscheAntwort) {
      for (const a of accepted) {
        if (einheitlich(n) === einheitlich(a.norm)) return mitGross({ correct: true, typo: false, matched: a.raw }, a);
      }
    }
    for (const a of accepted) {
      let zaehlt;
      if (lrs || deutscheAntwort) {
        const erlaubt = lrs ? (a.norm.length >= 6 ? 2 : a.norm.length >= 3 ? 1 : 0) : (a.norm.length >= 5 ? 1 : 0);
        zaehlt = kompakt(n) === kompakt(a.norm) || (erlaubt > 0 && editDistance(n, a.norm, erlaubt) <= erlaubt);
      } else {
        zaehlt = kleinerTippfehler(n, a.norm, tabu);
      }
      if (zaehlt) return mitGross({ correct: true, typo: true, matched: a.raw }, a);
    }
    return { correct: false, typo: false, matched: "" };
  };

  const direkt = einzeln(given);
  if (direkt.correct || direkt.gross) return direkt;
  return mitZusatz(given, accepted, einzeln, !deutscheAntwort) || direkt;
}

/* ------------------------------------------------------------------
   Mehr geschrieben als gefragt – seit 09.10.2026.
   Gefragt ist „fahren (mit dem Auto)“, Loesung „to drive“, das Kind schreibt „to drive / drove“: Die Vokabel steht
   richtig da, der Zusatz stimmt auch. Vorher fiel so eine Antwort im genauen Vergleich durch, und die KI lehnte sie
   ab („eine der drei Formen fehlt“). Jetzt zaehlt eine Antwort aus mehreren Teilen, wenn
     - mindestens ein Teil eine zugelassene Loesung ist und
     - jeder weitere Teil ebenfalls eine Loesung ist („capital / capital city“) oder eine andere Form der Loesung:
       simple past, past participle, 3. Person, -ing, Mehrzahl, unregelmaessige Steigerung (wortformen.js).
   Ein falscher Zusatz („drive / drived“, „big / small“) zaehlt hier nicht; darueber urteilt die KI-Zweitmeinung,
   und sie soll solche Antworten ablehnen. Formen gelten nur fuer englische Antworten.
   Teile trennt das Kind mit / , ; | + Pfeil, „or“/„oder“, Gedankenstrich – oder nur mit Leerzeichen.
   ------------------------------------------------------------------ */
const ZUSATZ_TRENNER = /[\/,;|+]|->|=>|→|\s[-–—]\s|\s(?:or|oder)\s/i;
const ZUSATZ_TRENNER_BINDESTRICH = /[\/,;|+\-–—]|=>|→|\s(?:or|oder)\s/i;
function mitZusatz(given, accepted, einzeln, mitFormen) {
  const roh = String(given || "").replace(/\([^)]*\)/g, " ");
  const istForm = (n) => mitFormen && accepted.some((a) => verwandt(n, a.norm));
  const pruefe = (teile) => {
    // nur ein Teil: ein Trennzeichen ohne Zusatz („drive /“)
    if (teile.length < 2) { const r = teile.length ? einzeln(teile[0]) : null; return r && (r.correct || r.gross) ? r : null; }
    let treffer = null, typo = false;
    const zusatz = [];
    for (const teil of teile) {
      const r = einzeln(teil);
      if (r.gross) return r;                       // Eigenname kleingeschrieben: bleibt ein Fehler
      if (r.correct) { treffer = treffer || r; typo = typo || r.typo; continue; }
      if (!istForm(normalizeAnswer(teil))) return null;
      zusatz.push(teil);
    }
    return treffer ? { correct: true, typo, matched: treffer.matched, zusatz } : null;
  };
  const teilen = (trenner) => roh.split(trenner).map((t) => t.trim()).filter(Boolean);
  const getrennt = pruefe(teilen(ZUSATZ_TRENNER)) || pruefe(teilen(ZUSATZ_TRENNER_BINDESTRICH));
  if (getrennt) return getrennt;
  // Nur Leerzeichen dazwischen („drive drove driven“, „drive off drove off“): in Stuecke von der Laenge der Loesung teilen
  const woerter = roh.split(/\s+/).filter(Boolean);
  if (/^to$/i.test(woerter[0] || "")) woerter.shift();
  for (const laenge of new Set(accepted.map((a) => a.norm.split(" ").length))) {
    if (woerter.length <= laenge || woerter.length % laenge) continue;
    const stuecke = [];
    for (let i = 0; i < woerter.length; i += laenge) stuecke.push(woerter.slice(i, i + laenge).join(" "));
    const r = pruefe(stuecke);
    if (r) return r;
  }
  return null;
}

/* ------------------------------------------------------------------
   Großschreibung englischer Eigennamen

   Pflicht sind Wörter, die in der Lösung als Name großgeschrieben sind:
   Länder, Sprachen, Nationalitäten, Feiertage, Namen („France“, „Turkish“,
   „Northern Ireland“, „the British Isles“, „Thanksgiving“, „Richter scale“)
   und Abkürzungen („CV“, „B&B“). Der Großbuchstabe am Anfang einer Wendung
   („Get well soon“, „Have a good flight!“) und „I“ zählen nicht.
   ------------------------------------------------------------------ */
const SATZANFANG = new Set(["have", "what", "what's", "get", "you", "you're", "bye", "see", "yours", "how", "good",
  "excuse", "thank", "thanks", "nice", "let's", "it's", "that's", "can", "could", "would", "do", "don't", "is", "are",
  "where", "when", "why", "who", "welcome", "sorry", "please", "hello", "hi", "goodbye", "happy", "enjoy", "take", "come",
  "go", "be", "look", "listen", "wait", "help", "well", "oh", "no", "yes", "here", "there", "best", "kind", "dear",
  "cheers", "congratulations", "merry", "all", "my", "your", "say", "tell", "keep", "make", "give", "never", "the", "a", "an"]);
const woerterVon = (text) => String(text || "").replace(/\([^)]*\)/g, " ").split(/\s+/)
  .map((w) => w.replace(/^[^\p{L}&]+|[^\p{L}&]+$/gu, "")).filter(Boolean);
const istGross = (w) => /^\p{Lu}/u.test(w);
const istAbkuerzung = (w) => /\p{Lu}.*\p{Lu}/u.test(w);
const istIch = (w) => /^I(['’]|$)/.test(w);

function grossPflicht(loesung) {
  const woerter = woerterVon(loesung);
  const weitereGross = woerter.slice(1).some((w) => istGross(w) && !istIch(w));
  return woerter.filter((w, i) => {
    if (!istGross(w) || istIch(w)) return false;
    if (istAbkuerzung(w) || i > 0 || woerter.length === 1 || weitereGross) return true;
    return !SATZANFANG.has(w.toLowerCase());
  });
}
// Liefert die Pflicht-Wörter, die in der Antwort kleingeschrieben sind (leer = alles in Ordnung)
function grossFehler(given, loesung) {
  const pflicht = grossPflicht(loesung);
  if (!pflicht.length) return [];
  const woerter = woerterVon(given);
  return pflicht.filter((p) => {
    const pl = p.toLowerCase();
    const w = woerter.find((x) => x.toLowerCase() === pl) || woerter.find((x) => editDistance(x.toLowerCase(), pl, 1) <= 1);
    if (!w) return false;
    return istAbkuerzung(p) ? w !== w.toUpperCase() : !istGross(w);
  });
}

/* ------------------------------------------------------------------
   Unregelmäßige Verben: Lösung „drive, drove, driven“ (auch „be, was/were, been“).
   Alle drei Formen müssen in dieser Reihenfolge dastehen; Trennzeichen sind egal.
   Die Testseite zeigt dazu den Hinweis VERB_HINWEIS.
   ------------------------------------------------------------------ */
const VERB_HINWEIS = "alle drei Formen: Grundform, simple past, past participle";
function verbFormen(solutions) {
  const liste = [];
  for (const sol of solutions || []) {
    for (const part of String(sol).split(";")) {
      const formen = part.split(",").map((f) => f.trim());
      if (formen.length === 3 && formen.every((f) => /^[A-Za-z']+(\s*\/\s*[A-Za-z']+)*$/.test(f))) {
        liste.push(formen.map((f) => f.split("/").map((x) => x.trim().toLowerCase())));
      }
    }
  }
  return liste;
}
function checkVerbFormen(given, formen, lrs) {
  const teile = String(given || "").replace(/\([^)]*\)/g, " ").toLowerCase().replace(/^\s*to\s+/, "")
    .split(/[\s,;\/\-–]+/).map((x) => x.replace(/[.!?"'`´]/g, "")).filter(Boolean);
  const alleFormen = new Set([].concat(...formen));
  const passt = (w, alts) => {
    if (alts.includes(w)) return "exakt";
    if (alleFormen.has(w)) return ""; // eine andere Form desselben Verbs ist kein Tippfehler („driven“ statt „drive“)
    for (const a of alts) {
      // ohne Notenschutz wie bei den anderen Vokabeln: ein Buchstabenfehler nur in langen Formen („forgotten“)
      const erlaubt = lrs ? (a.length >= 6 ? 2 : a.length >= 3 ? 1 : 0) : (a.length >= TIPPFEHLER_AB ? 1 : 0);
      if (erlaubt && editDistance(w, a, erlaubt) <= erlaubt) return "typo";
    }
    return "";
  };
  const fehlend = [], falsch = [];
  let i = 0, typo = false;
  for (const alts of formen) {
    if (teile[i] === undefined) { fehlend.push(alts.join("/")); continue; }
    const r = passt(teile[i], alts);
    i++;
    if (!r) { falsch.push(alts.join("/")); continue; }
    if (r === "typo") typo = true;
    while (alts.length > 1 && teile[i] !== undefined && passt(teile[i], alts)) i++; // „was, were“
  }
  const matched = formen.map((a) => a.join("/")).join(", ");
  if (fehlend.length || falsch.length) return { correct: false, typo: false, matched, formen: { fehlend, falsch } };
  return { correct: true, typo, matched };
}

/** Kurzer Hinweis für die Lehrkraft und den Elternausdruck, warum eine Antwort nicht zählt. */
function regelHinweis(result) {
  if (result.gross && result.gross.length) return "Großschreibung: " + result.gross.join(", ");
  if (result.formen) {
    const f = result.formen;
    return "Alle drei Formen nötig" + (f.fehlend.length ? " – es fehlt: " + f.fehlend.join(", ") : "") +
      (f.falsch.length ? " – nicht richtig: " + f.falsch.join(", ") : "");
  }
  return "";
}

/* ------------------------------------------------------------------
   KI-Zweitmeinung

   Der exakte Vergleich oben kennt nur die hinterlegten Loesungen. Eine
   sinngleiche Antwort ("Bezirk" statt "Stadtteil") faellt dort durch.
   Deshalb gehen NUR die als falsch bewerteten Antworten an die KI - sie
   kann eine Antwort noch als richtig anerkennen, aber nie eine richtige
   Antwort abwerten. Faellt die KI aus, bleibt es beim exakten Ergebnis.

   @param askAnthropic  Funktion (system, user, maxTokens) => Promise<string>
   ------------------------------------------------------------------ */
async function aiReview(pending, askAnthropic, classLevel, lrs) {
  if (!pending.length || typeof askAnthropic !== "function") return {};

  const system = [
    "Du korrigierst einen Vokabeltest im Fach Englisch, Klasse " + (classLevel || "8R") + " Mittelschule.",
    "",
    "Zu jeder Aufgabe bekommst du die Musterloesungen der Lehrkraft und die Antwort",
    "der Schuelerin oder des Schuelers. Entscheide, ob die Antwort die Vokabel trifft.",
    "",
    "Als richtig gilt:",
    "- ein Synonym oder eine gleichwertige Uebersetzung ('Bezirk' statt 'Stadtteil')",
    "- eine andere, aber korrekte Wortform ('gehen' statt 'zu Fuss gehen')",
    "- fehlendes 'to' beim Verb oder fehlender Artikel",
    "- Kleinschreibung gewoehnlicher Woerter, fehlende Umlautpunkte in deutschen Antworten",
    "- eine andere RICHTIGE Schreibweise desselben englischen Wortes (britisch/amerikanisch: 'color' und 'colour',",
    "  'center' und 'centre', 'traveling' und 'travelling')",
    "- MEHR GESCHRIEBEN ALS GEFRAGT: Steht die gefragte Vokabel richtig da und daneben ein Zusatz, der ebenfalls",
    "  stimmt, ist die Antwort richtig. Zusaetze sind weitere Formen desselben Wortes (simple past, past participle,",
    "  Mehrzahl, Steigerung: 'to drive / drove', 'drive, drove, driven', 'child / children', 'big, bigger, biggest')",
    "  oder eine zweite richtige Uebersetzung ('big / large').",
    "  Was gefragt ist, zeigen die zugelassenen Loesungen: Steht dort nur die Grundform eines Verbs, genuegt sie –",
    "  niemand muss die drei Formen nennen, und wer sie richtig dazuschreibt, verliert dadurch keinen Punkt.",
    ...(lrs ? [
      "- NOTENSCHUTZ LRS (Lese-Rechtschreib-Stoerung): Rechtschreibung zaehlt nicht, auch nicht Gross- und",
      "  Kleinschreibung. Richtig ist auch lautgetreue, verdrehte oder lueckenhafte Schreibung, wenn eindeutig",
      "  die richtige Vokabel gemeint ist (z. B. 'frend' fuer 'friend', 'bycicle' fuer 'bicycle', 'wenzday' fuer 'Wednesday')."
    ] : []),
    "",
    "Als falsch gilt:",
    "- eine andere Vokabel, auch wenn sie thematisch passt",
    "- eine Antwort in der falschen Sprache",
    "- eine leere oder sinnlose Antwort",
    ...(lrs ? [] : [
      "- ein englischer Eigenname kleingeschrieben (Laender, Sprachen, Nationalitaeten, Feiertage, Namen), z. B. 'france' statt 'France'",
      "- eine FALSCH GESCHRIEBENE englische Antwort. Die Schreibweise zaehlt: Fehlt ein Buchstabe, ist einer falsch, zu viel",
      "  oder vertauscht, ist die Antwort falsch – auch wenn klar ist, welches Wort gemeint war",
      "  ('coas' statt 'coast', 'sience' statt 'science', 'quiet' und 'quite' sind verschiedene Woerter)",
      "- ein ANDERES englisches Wort, das der Loesung nur aehnlich sieht ('clear' statt 'clean', 'cost' statt 'coast')"
    ]),
    "- die gefragte Vokabel selbst fehlt (nur 'drove' oder 'drove / driven', wenn 'to drive' gefragt ist)",
    "- mehrere Antworten zur Auswahl, von denen eine falsch ist ('big / small' fuer 'gross'), oder ein falscher",
    "  Zusatz ('drive / drived')",
    "",
    lrs ? "Bewerte wohlwollend, aber nicht beliebig: Die Vokabel muss getroffen sein."
      : "Bewerte die Bedeutung wohlwollend, die Schreibweise genau: Die Vokabel muss getroffen UND richtig geschrieben sein.",
    "",
    "Gib zu jeder Antwort auch an, ob sie richtig geschrieben ist (\"spelling\": true = ein richtig geschriebenes Wort",
    "bzw. eine richtig geschriebene Wendung der Zielsprache; false = Schreibfehler).",
    "",
    "Antworte NUR mit JSON in genau dieser Form, ohne weiteren Text:",
    '{"results": [{"nr": <Zahl>, "correct": true|false, "spelling": true|false, "reason": "<max. 8 Woerter>"}]}'
  ].join("\n");

  const user = pending.map((p) => [
    "Aufgabe " + p.nr + " (" + (p.direction === "en-de" ? "Englisch -> Deutsch" : "Deutsch -> Englisch") + ")",
    "Gefragtes Wort: " + p.prompt + (p.hint ? " (Hinweis fuer das Kind: " + p.hint + ")" : ""),
    "Zugelassene Loesungen: " + p.solutions.join(" / "),
    "Antwort: " + p.given
  ].join("\n")).join("\n\n");

  try {
    const raw = await askAnthropic(system, user, 900);
    const match = String(raw || "").match(/\{[\s\S]*\}/);
    if (!match) return {};

    const parsed = JSON.parse(match[0]);
    const list = Array.isArray(parsed.results) ? parsed.results : [];
    const out = {};
    for (const r of list) {
      const nr = Number(r && r.nr);
      if (!Number.isFinite(nr)) continue;
      // Die KI darf nur aufwerten, nie abwerten.
      if (r.correct === true) {
        // spelling: true/false, wenn die KI die Schreibweise beurteilt hat (sonst undefined)
        out[nr] = { correct: true, spelling: typeof r.spelling === "boolean" ? r.spelling : undefined, reason: clean(r.reason).slice(0, 120) };
      }
    }
    return out;
  } catch (_e) {
    return {};
  }
}

/* ------------------------------------------------------------------
   Datenhaltung
   ------------------------------------------------------------------ */
function createStore(dataDir) {
  const TESTS_FILE = path.join(dataDir, "vokabeltests.json");
  const SUBMISSIONS_FILE = path.join(dataDir, "vokabeltest_abgaben.json");

  function ensure() {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    if (!fs.existsSync(TESTS_FILE)) {
      fs.writeFileSync(TESTS_FILE, JSON.stringify({ unlocked: {} }, null, 2), "utf8");
    }
    if (!fs.existsSync(SUBMISSIONS_FILE)) {
      fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify({ submissions: [] }, null, 2), "utf8");
    }
  }

  function loadUnlocks() {
    try { return JSON.parse(fs.readFileSync(TESTS_FILE, "utf8")); }
    catch (_e) { return { unlocked: {} }; }
  }
  function saveUnlocks(data) {
    fs.writeFileSync(TESTS_FILE, JSON.stringify(data, null, 2), "utf8");
  }
  function loadSubmissions() {
    try { return JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, "utf8")); }
    catch (_e) { return { submissions: [] }; }
  }
  function saveSubmissions(data) {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(data, null, 2), "utf8");
  }

  // Übungsstand der Merkliste: { stand: { "<code>": { "<wort>": { r: richtig hintereinander, n: Versuche, z: zuletzt } } } }
  const MERK_FILE = path.join(dataDir, "vokabel_merkliste.json");
  function loadMerk() {
    try { const d = JSON.parse(fs.readFileSync(MERK_FILE, "utf8")); return d && typeof d.stand === "object" && d.stand ? d : { stand: {} }; }
    catch (_e) { return { stand: {} }; }
  }
  function saveMerk(data) {
    fs.writeFileSync(MERK_FILE, JSON.stringify(data), "utf8");
  }

  ensure();
  return { loadUnlocks, saveUnlocks, loadSubmissions, saveSubmissions, loadMerk, saveMerk };
}

/* ------------------------------------------------------------------
   Hilfsfunktionen
   ------------------------------------------------------------------ */
const clean = (v) => String(v || "").trim();

/**
 * Geraetekennung statt voller IP.
 * Die IP wird gekuerzt (IPv4: letztes Oktett, IPv6: nur Praefix) und danach
 * mit einem Server-Secret gehasht. Ergebnis: erkennt mehrere Abgaben vom
 * selben Geraet, laesst sich aber nicht in eine IP zurueckrechnen.
 */
function deviceHash(req, secret) {
  const raw = String(
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket?.remoteAddress || ""
  );
  let truncated;
  if (raw.includes(".")) {
    truncated = raw.split(".").slice(0, 3).join(".") + ".0";
  } else if (raw.includes(":")) {
    truncated = raw.split(":").slice(0, 4).join(":");
  } else {
    truncated = "unknown";
  }
  return crypto.createHmac("sha256", secret).update(truncated).digest("hex").slice(0, 16);
}

/* ------------------------------------------------------------------
   Routen
   ------------------------------------------------------------------ */
/**
 * @param app          Express-App
 * @param opts.dataDir Verzeichnis fuer die JSON-Dateien
 * @param opts.teacherPassword  Passwort der Lehrkraft
 * @param opts.tests   Testdefinitionen (inkl. Loesungen, bleiben serverseitig)
 * @param opts.hashSecret Secret fuer die Geraetekennung
 * @param opts.askAnthropic Funktion fuer die KI-Zweitmeinung (optional)
 * @param opts.kindZumCode  Anmeldung mit dem Code aus dem Lernfortschritt (statt Namen)
 * @returns { abgaben }     alle Abgaben (fuer die Notenuebersicht je Klasse)
 */
function registerVokabeltestRoutes(app, opts) {
  const store = createStore(opts.dataDir);
  const TESTS = opts.tests || {};
  const TEACHER_PASSWORD = opts.teacherPassword;
  const HASH_SECRET = opts.hashSecret || "grumi-fallback-secret";
  const askAnthropic = opts.askAnthropic;
  const probeKind = probeKindPruefer(opts.kindZumCode);

  const isTeacher = (req) => clean(req.body?.password) === TEACHER_PASSWORD;

  // Alle englischen Loesungswoerter der Tests: Ergibt ein Buchstabenfehler eines davon, ist es ein anderes Wort,
  // kein Tippfehler (siehe kleinerTippfehler)
  const BEKANNT = new Set();
  for (const t of Object.values(TESTS)) {
    for (const it of t.items || []) {
      if (it.direction === "en-de") continue;
      for (const sol of it.solutions || []) String(sol).split(/[;,\/]/).forEach((teil) => wortTeile(normalizeAnswer(teil)).forEach((w) => BEKANNT.add(w)));
    }
  }

  /* ---------- Auswertung: erst exakt, dann KI-Zweitmeinung ----------
     Bei der Abgabe und wenn die Lehrkraft den Notenschutz LRS einer Abgabe nachträglich an- oder ausschaltet
     (dann mit den gespeicherten Antworten). lrs: Rechtschreibung zählt nicht. */
  async function werteAus(test, answers, lrs) {
    const details = test.items.map((item, idx) => {
      const given = clean(answers[idx]);
      const result = checkAnswer(given, item.solutions, lrs, { direction: item.direction, prompt: item.prompt, bekannt: BEKANNT });
      // Zahlwörter (Hinweis „in Worten“): Eine Zahl in Ziffern ist keine Vokabel – auch nicht für die KI
      const ziffern = !result.correct && /in worten/i.test(item.hint || "") && /\d/.test(given);
      const regel = ziffern ? "Zahl in Worten schreiben, nicht in Ziffern" : regelHinweis(result);
      return {
        nr: idx + 1,
        prompt: item.prompt,
        given,
        correct: result.correct,
        typo: result.typo,
        ai: false,
        aiReason: "",
        // regel: Eigenname kleingeschrieben, Verbformen fehlen oder Ziffern statt Zahlwort – das darf die KI nicht durchwinken
        regel: Boolean(regel),
        // Gilt eine Antwort trotz kleinem Schreibfehler, steht in der Rückgabe und im Elternausdruck, wie man das Wort schreibt
        comment: regel || (result.correct && result.typo && result.matched ? ZAEHLT + result.matched : ""),
        expected: item.solutions.join(" / ")
      };
    });

    // Nur die abgelehnten Antworten mit Inhalt der KI vorlegen (ohne Verstöße gegen Großschreibung/Verbformen).
    const pending = details
      .map((d, idx) => ({ d, item: test.items[idx] }))
      .filter(({ d }) => !d.correct && d.given && !d.regel)
      .map(({ d, item }) => ({
        nr: d.nr,
        prompt: d.prompt,
        given: d.given,
        direction: item.direction,
        hint: item.hint || "",
        solutions: item.solutions
      }));

    if (pending.length) {
      const verdicts = await aiReview(pending, askAnthropic, test.classLevel, lrs);
      for (const d of details) {
        const v = verdicts[d.nr];
        if (v && v.correct && !d.correct) {
          // Ohne Notenschutz zaehlt bei englischen Antworten die Schreibweise: Hat die KI sie beanstandet, bleibt die
          // Antwort falsch. Liegt die Antwort genau einen Buchstaben neben einer Loesung, muss die KI die Schreibweise
          // ausdruecklich bestaetigt haben ("color" fuer "colour" ja – "coas" oder "cost" fuer "coast" nein).
          const item = test.items[d.nr - 1];
          if (!lrs && item.direction !== "en-de" &&
            (v.spelling === false || (v.spelling !== true && einBuchstabeDaneben(d.given, item.solutions)))) continue;
          d.correct = true;
          d.ai = true;
          d.aiReason = v.reason;
        }
      }
    }
    return details;
  }
  function summe(details, scaleName) {
    const total = details.length;
    const score = details.filter((d) => d.correct).length;
    const percent = total ? Math.round((score / total) * 100) : 0;
    return {
      total, score, percent,
      typos: details.filter((d) => d.correct && d.typo).length,
      aiAccepted: details.filter((d) => d.correct && d.ai).length,
      grade: gradeFromPercent(percent, scaleName)
    };
  }
  const ZAEHLT = "Zählt – richtig geschrieben: ";
  // Schluessel einer gespeicherten Abgabe (aeltere Abgaben tragen ihn noch nicht)
  const skalaVon = (rec) => rec.gradeScale || (TESTS[rec.testId] && TESTS[rec.testId].gradeScale) || "default";

  /* ---------- Oeffentlich: Liste der Tests (OHNE Loesungen) ---------- */
  app.get("/api/vokabeltest/list", (_req, res) => {
    const unlocks = store.loadUnlocks();
    const list = Object.values(TESTS).map((t) => ({
      id: t.id,
      title: t.title,
      unit: t.unit,
      classLevel: t.classLevel,
      itemCount: t.items.length,
      unlocked: probeOffen(unlocks.unlocked[t.id])
    }));
    res.json({ ok: true, tests: list });
  });

  /* ---------- Schueler: Test starten ---------- */
  app.post("/api/vokabeltest/start", async (req, res) => {
    const testId = clean(req.body?.testId);

    const test = TESTS[testId];
    if (!test) return res.status(404).json({ ok: false, error: "test_not_found" });

    const unlocks = store.loadUnlocks();
    if (!probeOffen(unlocks.unlocked[testId])) {
      return res.status(403).json({ ok: false, error: "locked", message: "Dieser Test ist noch nicht freigeschaltet." });
    }
    const kind = await probeKind(req, res);
    if (!kind) return;

    // Bereits abgegeben? -> kein zweiter Versuch
    const key = kind.key;
    const existing = store.loadSubmissions().submissions
      .find((s) => s.testId === testId && s.studentKey === key);
    if (existing) {
      return res.status(409).json({
        ok: false, error: "already_submitted",
        message: "Mit diesem Code wurde der Test bereits abgegeben.",
        submittedAt: existing.submittedAt
      });
    }

    // Aufgaben ohne Loesungen ausliefern
    const items = test.items.map((it, idx) => ({
      nr: idx + 1,
      prompt: it.prompt,
      direction: it.direction,
      // Bei unregelmäßigen Verben („drive, drove, driven“) sieht das Kind, dass alle drei Formen gefragt sind
      hint: [it.hint, verbFormen(it.solutions).length ? VERB_HINWEIS : ""].filter(Boolean).join(" · ")
    }));

    res.json({
      ok: true,
      test: { id: test.id, title: test.title, unit: test.unit, direction: test.direction || "mixed" },
      items
    });
  });

  /* ---------- Schueler: Abgabe ---------- */
  app.post("/api/vokabeltest/submit", async (req, res) => {
    const testId = clean(req.body?.testId);
    const testDate = clean(req.body?.testDate);
    const answers = Array.isArray(req.body?.answers) ? req.body.answers : [];

    const test = TESTS[testId];
    if (!test) return res.status(404).json({ ok: false, error: "test_not_found" });

    const unlocks = store.loadUnlocks();
    if (!probeOffen(unlocks.unlocked[testId], true)) {
      return res.status(403).json({ ok: false, error: "locked", message: "Dieser Test ist nicht freigeschaltet." });
    }
    const kind = await probeKind(req, res);
    if (!kind) return;
    const { code, firstName, lastName, className } = kind;

    const key = kind.key;
    const db = store.loadSubmissions();
    const existing = db.submissions.find((s) => s.testId === testId && s.studentKey === key);
    if (existing) {
      // Serverseitige Sperre: Neuladen bringt nichts.
      return res.status(409).json({
        ok: false, error: "already_submitted",
        message: "Dieser Test wurde bereits abgegeben.",
        submittedAt: existing.submittedAt
      });
    }

    const details = await werteAus(test, answers, kind.lrs);
    // Schluessel nach dem Zug des Kindes (M: 50 % = Note 4, R: 50 % = Note 3), auch wenn es
    // den Test des anderen Zugs erwischt hat. R-Tests behalten ihren eigenen R-Schluessel.
    const scaleName = kind.zug === "M" ? "default"
      : (test.gradeScale && test.gradeScale !== "default" ? test.gradeScale : "9R");
    const { total, score, typos, aiAccepted, percent, grade } = summe(details, scaleName);

    const record = {
      id: `vt_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
      testId,
      testTitle: test.title,
      unit: test.unit,
      code, zug: kind.zug, lrs: kind.lrs, verlassen: verlassenZahl(req.body?.verlassen), protokoll: protokollSauber(req.body?.protokoll),
      firstName, lastName, className,
      studentKey: key,
      testDate: testDate || new Date().toISOString().slice(0, 10),
      score, total, percent, grade, typos, aiAccepted,
      gradeScale: scaleName,
      details,
      deviceHash: deviceHash(req, HASH_SECRET),
      submittedAt: new Date().toISOString()
    };

    // Erst jetzt frisch laden: Waehrend der KI-Pruefung koennen andere Kinder
    // abgegeben haben. Mit dem alten Stand wuerden deren Abgaben ueberschrieben.
    const fresh = store.loadSubmissions();
    if (fresh.submissions.some((s) => s.testId === testId && s.studentKey === key)) {
      return res.status(409).json({ ok: false, error: "already_submitted", message: "Mit diesem Code wurde bereits abgegeben." });
    }
    fresh.submissions.push(record);
    store.saveSubmissions(fresh);

    res.json({
      ok: true,
      result: {
        score, total, percent, grade, typos, aiAccepted,
        details: details.map((d) => ({
          nr: d.nr, prompt: d.prompt, given: d.given,
          correct: d.correct, typo: d.typo,
          ai: d.ai, aiReason: d.aiReason, comment: d.comment || "",
          expected: d.expected
        })),
        submittedAt: record.submittedAt
      }
    });
  });

  /* ---------- Lehrkraft: Freischalten / Sperren ---------- */
  app.post("/api/vokabeltest/unlock", (req, res) => {
    if (!isTeacher(req)) return res.status(401).json({ ok: false, error: "bad_password" });

    const testId = clean(req.body?.testId);
    const open = Boolean(req.body?.open);
    if (!TESTS[testId]) return res.status(404).json({ ok: false, error: "test_not_found" });

    const unlocks = store.loadUnlocks();
    unlocks.unlocked[testId] = { open, changedAt: new Date().toISOString() };
    store.saveUnlocks(unlocks);

    res.json({ ok: true, testId, open });
  });

  /* ---------- Lehrkraft: Ergebnisse ---------- */
  app.post("/api/vokabeltest/results", (req, res) => {
    if (!isTeacher(req)) return res.status(401).json({ ok: false, error: "bad_password" });

    const testId = clean(req.body?.testId);
    let rows = store.loadSubmissions().submissions;
    if (testId) rows = rows.filter((r) => r.testId === testId);

    rows = rows.slice().sort((a, b) =>
      a.className.localeCompare(b.className) ||
      a.lastName.localeCompare(b.lastName) ||
      a.firstName.localeCompare(b.firstName)
    );

    const grades = rows.map((r) => r.grade);
    const avg = grades.length
      ? Math.round((grades.reduce((a, b) => a + b, 0) / grades.length) * 100) / 100
      : null;

    res.json({
      ok: true,
      count: rows.length,
      averageGrade: avg,
      distribution: [1, 2, 3, 4, 5, 6].map((g) => ({ grade: g, count: grades.filter((x) => x === g).length })),
      submissions: rows
    });
  });

  /* ---------- Lehrkraft: Notenschutz LRS fuer EINE Abgabe an- oder ausschalten ----------
     Fuer Kinder, bei denen der Notenschutz beim Code noch nicht eingetragen war, als sie geschrieben haben
     (oder zu Unrecht eingetragen war). Die gespeicherten Antworten werden neu gewertet: Mit LRS zaehlt die
     Rechtschreibung nicht. Antworten, die die Lehrkraft selbst gewertet hat, bleiben, wie sie sind.
     Das Merkmal beim Code (fuer kuenftige Proben) aendert sich dadurch nicht. */
  app.post("/api/vokabeltest/lrs", async (req, res) => {
    if (!isTeacher(req)) return res.status(401).json({ ok: false, error: "bad_password" });

    const id = clean(req.body?.submissionId);
    const lrs = req.body?.lrs === true;
    const alt = store.loadSubmissions().submissions.find((s) => s.id === id);
    if (!alt) return res.status(404).json({ ok: false, error: "not_found" });
    const test = TESTS[alt.testId];
    const passt = test && Array.isArray(alt.details) && alt.details.length === test.items.length &&
      alt.details.every((d, i) => d.prompt === test.items[i].prompt);
    if (!passt) {
      return res.status(409).json({ ok: false, error: "test_geaendert", message: "Die Aufgaben dieses Tests wurden seit der Abgabe geändert – neu werten geht nicht mehr." });
    }

    const neu = await werteAus(test, alt.details.map((d) => d.given), lrs);

    // Erst jetzt frisch laden (waehrend der KI-Pruefung koennen andere Kinder abgegeben haben)
    const db = store.loadSubmissions();
    const rec = db.submissions.find((s) => s.id === id);
    if (!rec) return res.status(404).json({ ok: false, error: "not_found" });
    const vorher = rec.details;
    let details;
    if (lrs) {
      // Stand ohne Notenschutz aufheben: Ausschalten fuehrt genau dorthin zurueck (die KI urteilt nicht jedes Mal gleich)
      if (!rec.lrs && !rec.detailsOhneLrs) rec.detailsOhneLrs = vorher.map((d) => ({ ...d }));
      // Mit Notenschutz wird keine Antwort schlechter gewertet als vorher
      details = neu.map((d, i) => (vorher[i].correct && !d.correct ? vorher[i] : d));
    } else {
      details = rec.detailsOhneLrs || neu;
      delete rec.detailsOhneLrs;
    }
    rec.details = details.map((d, i) => (vorher[i].scoredBy === "lehrkraft" ? vorher[i] : d));
    rec.lrs = lrs;
    Object.assign(rec, summe(rec.details, skalaVon(rec)));
    store.saveSubmissions(db);
    res.json({ ok: true, lrs, score: rec.score, total: rec.total, percent: rec.percent, grade: rec.grade });
  });

  /* ---------- Lehrkraft: Abgaben nach den aktuellen Regeln nachwerten ----------
     Wird eine Regel grosszuegiger (09.10.2026: richtige Zusaetze wie „to drive / drove“ zaehlen), gilt sie zunaechst
     nur fuer neue Abgaben. Hier prueft der Server die gespeicherten Antworten noch einmal – nur mit dem genauen
     Vergleich, ohne KI. Es wird nie abgewertet: Was schon zaehlt, bleibt; was die Lehrkraft selbst gewertet hat,
     bleibt ebenfalls. Die Antwort nennt jede Aenderung, damit die Lehrkraft sieht, was sich getan hat.
     body: { submissionIds: [...] } (die angezeigten Abgaben) oder { testId } oder nichts (alle) */
  app.post("/api/vokabeltest/nachwerten", (req, res) => {
    if (!isTeacher(req)) return res.status(401).json({ ok: false, error: "bad_password" });

    const ids = Array.isArray(req.body?.submissionIds) ? new Set(req.body.submissionIds.map(String)) : null;
    const testId = clean(req.body?.testId);
    const db = store.loadSubmissions();
    const abgaben = [];
    for (const rec of db.submissions) {
      if (ids ? !ids.has(rec.id) : testId && rec.testId !== testId) continue;
      const test = TESTS[rec.testId];
      if (!test || !Array.isArray(rec.details) || rec.details.length !== test.items.length) continue;
      const nachsehen = (details, lrs) => {
        const neu = [];
        details.forEach((d, i) => {
          const item = test.items[i];
          if (d.correct || d.scoredBy === "lehrkraft" || !d.given || d.prompt !== item.prompt) return;
          const r = checkAnswer(d.given, item.solutions, lrs, { direction: item.direction, prompt: item.prompt, bekannt: BEKANNT });
          if (!r.correct) return;
          Object.assign(d, { correct: true, typo: r.typo, ai: false, aiReason: "", regel: false, comment: r.typo && r.matched ? ZAEHLT + r.matched : "" });
          neu.push({ nr: d.nr, prompt: d.prompt, given: d.given });
        });
        return neu;
      };
      const vorher = { score: rec.score, grade: rec.grade };
      const antworten = nachsehen(rec.details, Boolean(rec.lrs));
      // Der aufgehobene Stand ohne Notenschutz (siehe /lrs) bekommt dieselben Punkte
      if (Array.isArray(rec.detailsOhneLrs) && rec.detailsOhneLrs.length === test.items.length) nachsehen(rec.detailsOhneLrs, false);
      if (!antworten.length) continue;
      Object.assign(rec, summe(rec.details, skalaVon(rec)));
      abgaben.push({ id: rec.id, code: rec.code || "", firstName: rec.firstName, lastName: rec.lastName, className: rec.className,
        antworten, vorher, score: rec.score, total: rec.total, grade: rec.grade });
    }
    if (abgaben.length) store.saveSubmissions(db);
    res.json({ ok: true, anzahl: abgaben.reduce((n, a) => n + a.antworten.length, 0), abgaben });
  });

  /* ---------- Kind: Merkliste – alle Wörter, die es in einem Vokabeltest falsch hatte, aus allen Units ----------
     Die Liste entsteht aus den gespeicherten Abgaben; deshalb stehen auch frühere Tests darin. Sie zeigt nur Tests,
     die die Lehrkraft schon zurückgegeben hat – vorher soll das Kind seine Fehler nicht sehen (Note erst nach der
     Rückgabe). Hatte das Kind ein Wort in einem späteren Test richtig, fällt es heraus. Geübt wird auf
     merkliste.html: GELERNT_AB-mal hintereinander richtig = gelernt. Gespeichert wird nur dieser Übungsstand.
       POST /api/vokabeltest/merkliste          { code }              -> { ok, klasse, gelerntAb, woerter: [...] }
       POST /api/vokabeltest/merkliste/pruefen  { code, id, antwort } -> { ok, richtig, tippfehler, hinweis, wort }
       POST /api/vokabeltest/merkliste/zurueck  { code, id }          -> { ok, wort }   (ein gelerntes Wort wieder üben) */
  const GELERNT_AB = 2;
  const zurueckgegeben = typeof opts.zurueckgegeben === "function" ? opts.zurueckgegeben : () => true;
  const merkId = (richtung, prompt) => crypto.createHash("sha1").update(richtung + "|" + prompt).digest("hex").slice(0, 12);
  function merklisteVon(code) {
    const abgaben = store.loadSubmissions().submissions
      .filter((s) => String(s.code || "") === String(code) && Array.isArray(s.details) && zurueckgegeben(s))
      .sort((a, b) => String(a.submittedAt).localeCompare(String(b.submittedAt)));
    const woerter = new Map();
    for (const rec of abgaben) {
      const test = TESTS[rec.testId];
      rec.details.forEach((d, i) => {
        const item = test && test.items[i] && test.items[i].prompt === d.prompt ? test.items[i] : null;
        const richtung = (item && item.direction) || "de-en";
        const id = merkId(richtung, d.prompt);
        if (d.correct) { woerter.delete(id); return; }       // in einem späteren Test richtig gehabt
        woerter.set(id, {
          id, frage: d.prompt, richtung, hinweis: (item && item.hint) || "",
          solutions: item ? item.solutions : String(d.expected || "").split(" / ").filter(Boolean),
          gegeben: d.given || "", test: rec.testTitle || rec.testId, unit: rec.unit || "",
          datum: rec.testDate || String(rec.submittedAt || "").slice(0, 10)
        });
      });
    }
    return [...woerter.values()];
  }
  function merkAusgabe(w, stand) {
    // „to drive; drive“ -> Lösung „to drive“, auch richtig: „drive“
    const formen = [...new Set(w.solutions.flatMap((s) => String(s).split(";")).map((s) => s.trim()).filter(Boolean))];
    const r = (stand && stand.r) || 0;
    return { id: w.id, frage: w.frage, richtung: w.richtung, hinweis: w.hinweis, loesung: formen[0] || "", auch: formen.slice(1, 4),
      gegeben: w.gegeben, test: w.test, unit: w.unit, datum: w.datum, richtig: r, versuche: (stand && stand.n) || 0, gelernt: r >= GELERNT_AB };
  }
  app.post("/api/vokabeltest/merkliste", async (req, res) => {
    const kind = await probeKind(req, res);
    if (!kind) return;
    const stand = store.loadMerk().stand[kind.code] || {};
    res.json({ ok: true, klasse: kind.klasse, gelerntAb: GELERNT_AB, woerter: merklisteVon(kind.code).map((w) => merkAusgabe(w, stand[w.id])) });
  });
  app.post("/api/vokabeltest/merkliste/pruefen", async (req, res) => {
    const kind = await probeKind(req, res);
    if (!kind) return;
    const id = clean(req.body?.id), antwort = clean(req.body?.antwort).slice(0, 200);
    const w = merklisteVon(kind.code).find((x) => x.id === id);
    if (!w) return res.status(404).json({ ok: false, error: "wort_unbekannt", message: "Dieses Wort steht nicht auf deiner Merkliste." });
    const r = antwort ? checkAnswer(antwort, w.solutions, kind.lrs, { direction: w.richtung, prompt: w.frage, bekannt: BEKANNT }) : { correct: false };
    const db = store.loadMerk();
    const meins = db.stand[kind.code] = db.stand[kind.code] || {};
    const alt = meins[id] || { r: 0, n: 0 };
    meins[id] = { r: r.correct ? alt.r + 1 : 0, n: (alt.n || 0) + 1, z: new Date().toISOString() };
    store.saveMerk(db);
    res.json({ ok: true, richtig: Boolean(r.correct), tippfehler: Boolean(r.correct && r.typo), hinweis: r.correct ? "" : regelHinweis(r), wort: merkAusgabe(w, meins[id]) });
  });
  app.post("/api/vokabeltest/merkliste/zurueck", async (req, res) => {
    const kind = await probeKind(req, res);
    if (!kind) return;
    const id = clean(req.body?.id);
    const w = merklisteVon(kind.code).find((x) => x.id === id);
    if (!w) return res.status(404).json({ ok: false, error: "wort_unbekannt", message: "Dieses Wort steht nicht auf deiner Merkliste." });
    const db = store.loadMerk();
    const meins = db.stand[kind.code] = db.stand[kind.code] || {};
    meins[id] = { r: 0, n: (meins[id] && meins[id].n) || 0, z: new Date().toISOString() };
    store.saveMerk(db);
    res.json({ ok: true, wort: merkAusgabe(w, meins[id]) });
  });

  /* ---------- Lehrkraft: Eine Antwort selbst werten (richtig = 1 Punkt, falsch = 0) ---------- */
  app.post("/api/vokabeltest/override", (req, res) => {
    if (!isTeacher(req)) return res.status(401).json({ ok: false, error: "bad_password" });

    const id = clean(req.body?.submissionId);
    const nr = parseInt(req.body?.nr, 10);
    const points = Number(req.body?.points);
    const db = store.loadSubmissions();
    const rec = db.submissions.find((s) => s.id === id);
    if (!rec) return res.status(404).json({ ok: false, error: "not_found" });
    const det = (rec.details || []).find((d) => d.nr === nr);
    if (!det) return res.status(404).json({ ok: false, error: "item_not_found" });
    if (points !== 0 && points !== 1) return res.status(400).json({ ok: false, error: "bad_points" });

    det.correct = points === 1;
    det.scoredBy = "lehrkraft";
    det.typo = false;
    det.ai = false;
    det.aiReason = "";
    // Der Hinweis der Regel („Großschreibung: France“) passt nicht, solange die Lehrkraft die Antwort gelten laesst;
    // nimmt sie das zurueck, steht er wieder da
    const eigener = clean(req.body?.comment).slice(0, 220);
    // „Zählt – richtig geschrieben: …“ gehoert nur zu einer Antwort, die zaehlt
    const bisher = String(det.comment || "").startsWith(ZAEHLT) ? "" : det.comment || "";
    if (det.correct) {
      if (bisher && !det.regelHinweis) det.regelHinweis = bisher;
      det.comment = eigener;
    } else {
      det.comment = eigener || bisher || det.regelHinweis || "";
    }
    Object.assign(rec, summe(rec.details, skalaVon(rec)));
    store.saveSubmissions(db);
    res.json({ ok: true, score: rec.score, percent: rec.percent, grade: rec.grade });
  });

  /* ---------- Lehrkraft: Einzelne Abgabe loeschen (Nachschreiben) ---------- */
  app.post("/api/vokabeltest/delete-submission", (req, res) => {
    if (!isTeacher(req)) return res.status(401).json({ ok: false, error: "bad_password" });

    const id = clean(req.body?.submissionId);
    const db = store.loadSubmissions();
    const before = db.submissions.length;
    db.submissions = db.submissions.filter((s) => s.id !== id);
    if (db.submissions.length === before) {
      return res.status(404).json({ ok: false, error: "not_found" });
    }
    store.saveSubmissions(db);
    res.json({ ok: true, removed: before - db.submissions.length });
  });

  /* ---------- Lehrkraft: Export als CSV ---------- */
  app.post("/api/vokabeltest/export", (req, res) => {
    if (!isTeacher(req)) return res.status(401).json({ ok: false, error: "bad_password" });

    const testId = clean(req.body?.testId);
    let rows = store.loadSubmissions().submissions;
    if (testId) rows = rows.filter((r) => r.testId === testId);

    const esc = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const header = ["Datum", "Test", "Klasse", "Nachname", "Vorname", "Punkte", "Von", "Prozent", "Note", "Abgabe"];
    const lines = [header.map(esc).join(";")];
    rows.forEach((r) => {
      lines.push([
        r.testDate, r.testTitle, r.className, r.lastName, r.firstName,
        r.score, r.total, r.percent, r.grade, r.submittedAt
      ].map(esc).join(";"));
    });

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="vokabeltest_${testId || "alle"}.csv"`);
    res.send("﻿" + lines.join("\r\n"));
  });

  return { abgaben: () => store.loadSubmissions().submissions };
}

module.exports = {
  registerVokabeltestRoutes,
  gradeFromPercent,
  checkAnswer,
  normalizeAnswer,
  grossPflicht,
  verbFormen,
  kleinerTippfehler,
  einBuchstabeDaneben,
  TIPPFEHLER_AB,
  GRADE_SCALE,
  GRADE_SCALE_8R,
  GRADE_SCALE_9R
};
