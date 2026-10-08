"use strict";

/**
 * NT-Proben Klasse 7 (7M und 7R)
 * -----------------------------
 * Proben mit zug: "M" oder "R" sind Fassungen für M- bzw. R-Klassen (nt7-p1-m, nt7-p1-r …). Die Liste nennt den
 * Zug, und nur Kinder dieses Zugs können sie beginnen. Die beiden ersten Proben (nt7-luft-1/-2) haben keinen
 * Zug und bleiben, wie sie waren.
 * Urspruenglich ein eigenstaendiger Express-Server (7M/NT/backend/server.js).
 * Der war aber nirgends deployt - die Lehrerseite rief ins Leere und meldete
 * "Failed to fetch". Deshalb hier als Modul, das seine Routen in den
 * vorhandenen Server einhaengt, genau wie Vokabeltest, Netzwerktest und
 * Filius-Pruefung.
 *
 * Routen:
 *   GET  /api/nt7/health
 *   GET  /api/nt7/list
 *   POST /api/nt7/start | submit
 *   POST /api/nt7/teacher/unlock | results | override | delete | export
 *
 * Die Fragen stehen in nt7-fragen.js und bleiben serverseitig.
 *
 * Mehrfach registrierbar (Informatik 7): opts.prefix ("/api/inf7"), opts.datei ("inf7-proben.json"),
 * opts.tests (Fragen), opts.fach ("Informatik"), opts.csvName, opts.service.
 * opts.stufe (Informatik 8: 8) – nur Kinder dieser Jahrgangsstufe können die Proben beginnen; steht auch in den Meldungen des Servers.
 * Aufgabenart "order" (Reihenfolge): steps = richtige Reihenfolge; die Seite bekommt die Schritte gemischt,
 * je Schritt an der richtigen Stelle gibt es 1 Punkt.
 * Block-Proben (seit 07.10.2026, nt7-block-*.js): Jede Aufgabe nennt ihr Modul (modul, modulTitel) und ggf. transfer: true.
 * alt: true an einer Probe = frühere Fassung. Sie steht weiter in der Liste (Ergebnisse bleiben einsehbar), die Seiten
 * bieten sie aber nicht mehr zum Freischalten oder Schreiben an.
 *
 * NT 8 (opts.erweitert, opts.sitzung) – für alle anderen Kurse ändert sich nichts:
 *   Aufgabenarten zusätzlich: multi (mehrere richtige Antworten: answers = Indizes), number (Zahl mit Toleranz, dazu
 *     wahlweise die Einheit: units = Auswahl, unit = richtige), gaps (Lückentext: text mit {1}, {2} …, gaps = je Lücke
 *     die Auswahl, das erste Wort ist richtig), tf (statements = [[Aussage, true|false]]), labor (Bauaufgabe im
 *     NT-Labor: Die Seite schickt den Endzustand, regeln = [{ text, wenn }] ergibt je erfüllter Regel 1 Punkt).
 *   Zu jeder Aufgabe möglich: labor (Animation oder Versuch zum Ansehen), tabelle { kopf, zeilen }, diagramm
 *     { art, x, y, … } (zeichnet die Seite selbst), kompetenz (fachwissen | erkenntnis | kommunikation | bewertung)
 *     und arten (z. B. ["diagramm", "versuch", "rechnen", "modell"]) für die Lernstandsdiagnose.
 *   Nachschreibproben: variante "A" | "B", gruppe = gemeinsame Kennung beider Varianten. Wer eine Variante abgegeben
 *     hat, kann die andere nicht mehr beginnen.
 *   Sitzung: Beginn und Zwischenstand liegen auf dem Server (Datei …-sitzungen.json). Neuladen, anderes Gerät oder
 *     WLAN-Ausfall beginnen die Probe nicht neu.
 *       POST start          -> zusätzlich sitzung { begonnenAm, serverZeit, minuten, endetAm, fortgesetzt } und
 *                              zwischenstand { answers, gespeichertAm }
 *       POST zwischenstand  { testId, code, answers, verlassen?, protokoll? } -> { ok, gespeichertAm }
 *       POST teacher/sitzungen { testId? } | teacher/sitzung-abgeben { testId, code }   laufende Bearbeitungen sehen,
 *                              einen gesicherten Zwischenstand als Abgabe übernehmen (Gerät ausgefallen)
 *     Läuft die Zeit ab, wird nichts automatisch abgegeben oder bewertet – das entscheidet die Lehrkraft.
 *   Korrektur: Die KI bewertet freie Antworten nur vor (Vorschlag mit Begründung und Lernhinweis). Die Lehrkraft kann
 *     jede Aufgabe ändern (teacher/override: points, comment, tipp), eine Antwort neu bewerten lassen
 *     (teacher/neu-bewerten) und das Gesamtergebnis bestätigen (teacher/bestaetigen). Zurückgegeben wird wie in allen
 *     Fächern über /api/proben/rueckgabe.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const nt7Tests = require("./nt7-fragen");
const { probeKindPruefer, probeOffen, verlassenZahl, protokollSauber, GRADE_SCALE_M, GRADE_SCALE_R } = require("./probe-kind");

/**
 * @param app            Express-App
 * @param opts.dataDir   Verzeichnis fuer die JSON-Ablage
 * @param opts.teacherPassword  Passwort der Lehrkraft
 * @param opts.model     Anthropic-Modell (optional)
 */
function registerNt7Routes(app, opts) {
  const DATA_DIR = opts.dataDir;
  const DATA_FILE = path.join(DATA_DIR, opts.datei || "nt7-proben.json");
  const PREFIX = String(opts.prefix || "/api/nt7").replace(/\/$/, "");
  const tests = opts.tests || nt7Tests;
  const FACH = opts.fach || "Natur-und-Technik";
  const SERVICE = opts.service || "nt7-proben";
  const STUFE = opts.stufe ? String(opts.stufe) : "";
  const LOG = opts.fach ? opts.fach + " " + (STUFE || "7") : "NT7";
  const TEACHER_PASSWORD = opts.teacherPassword || "";
  const MODEL = opts.model || process.env.ANTHROPIC_MODEL_HAIKU || "claude-haiku-4-5";
  /* Der Hauptserver reicht seine askAnthropic-Funktion herein. Sie probiert
     mehrere Modelle durch - wichtig, weil das in ANTHROPIC_MODEL gesetzte
     Modell abgekuendigt sein kann. Fehlt sie, fragen wir direkt an. */
  const askAnthropic = typeof opts.askAnthropic === "function" ? opts.askAnthropic : null;
  const pending = new Set();
  /* Abgabe: Die Antworten werden sofort gespeichert (freie Antworten vorläufig nach Stichwörtern). Danach bewertet
     die KI die freien Antworten. Das Kind wartet höchstens KI_GEDULD_MS auf sie; was länger dauert, läuft im
     Hintergrund weiter und landet im gespeicherten Satz (bis zu KI_VERSUCHE Anläufe im Abstand von KI_PAUSE_MS).
     So geht keine Abgabe verloren, wenn die KI langsam ist, ausfällt oder der Server neu startet. */
  const KI_GEDULD_MS = opts.kiGeduldMs === undefined ? 20000 : opts.kiGeduldMs;
  const KI_PAUSE_MS = opts.kiPauseMs === undefined ? 20000 : opts.kiPauseMs;
  const KI_VERSUCHE = opts.kiVersuche || 3;
  const warte = (ms) => new Promise((ok) => { const timer = setTimeout(ok, ms); if (timer.unref) timer.unref(); });
  // NT 8: weitere Aufgabenarten, Nachschreibproben, Korrektur jeder Aufgabe (erweitert); Beginn und Zwischenstand
  // auf dem Server (sitzung). Ohne diese Angaben verhält sich das Modul wie bisher.
  const ERWEITERT = opts.erweitert === true, SITZUNG = opts.sitzung === true;
  const SITZ_FILE = path.join(DATA_DIR, String(opts.datei || "nt7-proben.json").replace(/\.json$/, "") + "-sitzungen.json");
  const SITZ_MAX_ALTER = 24 * 60 * 60 * 1000;   // ältere Zwischenstände räumt der Server auf

  /* ---------- Sitzungen: Beginn und Zwischenstand (nur mit opts.sitzung) ---------- */
  function sitzLesen() {
    try { const d = JSON.parse(fs.readFileSync(SITZ_FILE, "utf8")); return { sitzungen: d && d.sitzungen && typeof d.sitzungen === "object" ? d.sitzungen : {} }; }
    catch (_e) { return { sitzungen: {} }; }
  }
  function sitzSchreiben(d) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const grenze = Date.now() - SITZ_MAX_ALTER;
    Object.keys(d.sitzungen).forEach((k) => { if (!(Date.parse(d.sitzungen[k].begonnenAm) > grenze)) delete d.sitzungen[k]; });
    const temp = SITZ_FILE + ".tmp";
    fs.writeFileSync(temp, JSON.stringify(d, null, 1), "utf8");
    fs.renameSync(temp, SITZ_FILE);
  }
  const sitzKey = (test, student) => test.id + "|" + student.code;
  const sitzAntwort = (test, sitz) => ({ begonnenAm: sitz.begonnenAm, serverZeit: new Date().toISOString(), minuten: test.minutes || 0,
    endetAm: new Date(Date.parse(sitz.begonnenAm) + (test.minutes || 0) * 60000).toISOString(), ...(sitz.fortgesetzt ? { fortgesetzt: sitz.fortgesetzt } : {}) });
  // Endzustand einer Bauaufgabe (NT-Labor): nur flache, kleine Angaben übernehmen
  function zustandSauber(z) {
    const aus = {};
    if (!z || typeof z !== "object" || Array.isArray(z)) return aus;
    Object.keys(z).slice(0, 40).forEach((k) => {
      if (!/^[a-zA-Z][a-zA-Z0-9_]{0,24}$/.test(k)) return;
      const v = z[k];
      if (typeof v === "boolean" || (typeof v === "number" && Number.isFinite(v))) aus[k] = v;
      else if (typeof v === "string") aus[k] = v.slice(0, 60);
      else if (Array.isArray(v)) aus[k] = v.slice(0, 40).map((x) => (typeof x === "number" && Number.isFinite(x) ? x : String(x == null ? "" : x).slice(0, 40)));
    });
    return aus;
  }
  // Antwort eines Zwischenstands in die Form der Abgabe bringen (begrenzte Länge, keine fremden Felder)
  function antwortSauber(item, raw) {
    if (raw == null) return null;
    if (item.type === "choice") return Number.isInteger(raw) ? raw : null;
    if (item.type === "multi") return Array.isArray(raw) ? raw.filter(Number.isInteger).slice(0, 12) : [];
    if (item.type === "tf") return Array.isArray(raw) ? raw.slice(0, 20).map((v) => (v === true ? true : v === false ? false : null)) : [];
    if (item.type === "number") return { wert: clean(raw && raw.wert !== undefined ? raw.wert : raw, 20), einheit: clean(raw && raw.einheit, 12) };
    if (item.type === "labor") return { zustand: zustandSauber(raw && raw.zustand), text: clean(raw && raw.text, 400) };
    if (Array.isArray(raw)) return raw.slice(0, 30).map((v) => clean(v, 200));
    return clean(raw, 1500);
  }
  // „12,5“ oder „12.5 V“ -> 12.5; leer oder kein Zahlwort -> null
  function zahlLesen(v) {
    const m = String(v == null ? "" : v).replace(/\s+/g, "").replace(",", ".").match(/^-?\d+(\.\d+)?/);
    return m ? Number(m[0]) : null;
  }
  // Regel einer Bauaufgabe: { schluessel: Wert } oder { schluessel: { min, max, in: [...] } } – alles muss zutreffen
  function regelOk(wenn, z) {
    return Object.keys(wenn || {}).every((k) => {
      const soll = wenn[k], ist = z[k];
      if (soll && typeof soll === "object" && !Array.isArray(soll)) {
        if (Array.isArray(soll.in)) return soll.in.includes(ist);
        if (typeof ist !== "number") return false;
        return (soll.min === undefined || ist >= soll.min) && (soll.max === undefined || ist <= soll.max);
      }
      return ist === soll;
    });
  }

  function readData() {
    fs.mkdirSync(DATA_DIR, {recursive: true});
    if (!fs.existsSync(DATA_FILE)) return {unlocked: {}, submissions: []};
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  }
  function writeData(data) {
    fs.mkdirSync(DATA_DIR, {recursive: true});
    const temp = DATA_FILE + ".tmp";
    fs.writeFileSync(temp, JSON.stringify(data, null, 2), "utf8");
    fs.renameSync(temp, DATA_FILE);
  }
  const clean = (v, max = 120) => String(v ?? "").trim().slice(0, max);
  // Anmeldung mit dem Code aus dem Lernfortschritt (opts.kindZumCode) statt mit Namen
  const probeKind = probeKindPruefer(opts.kindZumCode);
  function teacher(req, res) {
    if (!TEACHER_PASSWORD) { res.status(503).json({ok:false,error:"teacher_password_not_configured"}); return false; }
    const given = Buffer.from(clean(req.body?.password, 200));
    const expected = Buffer.from(TEACHER_PASSWORD);
    if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) {
      res.status(401).json({ok:false,error:"bad_password"}); return false;
    }
    return true;
  }
  function maxPoints(test) { return test.items.reduce((sum, item) => sum + item.points, 0); }
  // Notenschluessel nach dem Zug des Kindes: M-Klassen 50 % = Note 4, R-Klassen 50 % = Note 3
  function grade(percent, zug) { return ((zug === "R" ? GRADE_SCALE_R : GRADE_SCALE_M).find(s => percent >= s.min) || {grade:6}).grade; }
  function publicItem(item, index) {
    return {nr:index+1,type:item.type,prompt:item.prompt,points:item.points,
      options:item.options || undefined, labels:item.pairs?.map(pair => pair[0]),
      targets:item.pairs?.map(pair => pair[1]).sort((a,b) => a.localeCompare(b,"de")),
      steps:item.steps ? item.steps.slice().sort((a,b) => a.localeCompare(b,"de")) : undefined,
      image:item.image || undefined,imageAlt:item.imageAlt || undefined,...herkunft(item),...zusatz(item),
      // NT 8: Lückentext (je Lücke die Auswahl, nach dem Alphabet), Richtig/Falsch-Aussagen, Zahl mit Einheit
      ...(item.type === "gaps" ? {gapText:item.text,gapOptions:item.gaps.map(g => g.slice().sort((a,b) => a.localeCompare(b,"de")))} : {}),
      ...(item.type === "tf" ? {statements:item.statements.map(s => s[0])} : {}),
      ...(item.type === "number" ? {units:item.units ? item.units.slice() : undefined,unit:item.units ? undefined : item.unit || undefined} : {})};
  }
  // Was die Seite zusätzlich zur Aufgabe zeigt (NT 8): Animation oder Versuch aus dem NT-Labor, Messwerttabelle,
  // Diagramm. Steht auch bei der Abgabe, damit Korrektur, Rückgabe und Ausdruck dieselbe Darstellung zeigen.
  function zusatz(item) {
    return {...(item.labor ? {labor:item.labor} : {}),...(item.tabelle ? {tabelle:item.tabelle} : {}),...(item.diagramm ? {diagramm:item.diagramm} : {}),
      ...(item.kompetenz ? {kompetenz:item.kompetenz} : {}),...(item.arten ? {arten:item.arten} : {})};
  }
  // Herkunft einer Aufgabe (Block-Proben): Modul, in dem der Stoff steht (Kennung und Titel), und „Transfer“.
  // Steht bei der Aufgabe in der Probe und – mit der Abgabe gespeichert – in Korrektur und Rückgabe.
  function herkunft(item) {
    return {...(item.modul ? {modul:item.modul,modulTitel:item.modulTitel || ""} : {}),...(item.transfer ? {transfer:true} : {})};
  }
  // item.dicht: Die Stichwörter sind Formeln. Leerzeichen um Rechenzeichen und Klammern zählen nicht,
  // und hinter der Formel darf nicht weitergerechnet werden (=B3/$B$6*100 ist nicht =B3/$B$6).
  function formelTreffer(text, word) {
    for (let i = text.indexOf(word); i >= 0; i = text.indexOf(word, i + 1)) {
      if (word.endsWith(")") || !/[*\/+^0-9]/.test(text[i + word.length] || "")) return true;
    }
    return false;
  }
  function textFallback(answer, item) {
    if (answer.length < 3) return {points:0,comment:"Keine auswertbare Antwort.",source:"leer",needsReview:false};
    let lower = answer.toLocaleLowerCase("de");
    if (item.dicht) lower = lower.replace(/\s*([=*\/+\-():;$])\s*/g, "$1");
    const trifft = item.dicht ? word => formelTreffer(lower, word) : word => lower.includes(word);
    const hits = item.keywords.filter(group => group.split("|").some(trifft)).length;
    const points = Math.min(item.points, hits);
    return {points,comment:"Vorläufige Stichwortauswertung. Die Lehrkraft prüft diese Antwort nach.",source:"stichworte",needsReview:true};
  }
  // NT 8: Die KI korrigiert nur vor. Sie bekommt Aufgabe, Angaben zu Bild, Tabelle oder Versuch, den
  // Erwartungshorizont (je Kriterium 1 Punkt), den Zug und die Höchstpunktzahl – und liefert Punkte, eine kurze
  // Begründung und einen Lernhinweis. Ob es dabei bleibt, entscheidet die Lehrkraft.
  function vorkorrektur(item, answer, zug) {
    const kontext = [item.imageAlt ? "Abbildung: " + item.imageAlt : "",
      item.tabelle ? "Tabelle: " + [item.tabelle.kopf].concat(item.tabelle.zeilen || []).map(z => (z || []).join(" | ")).join(" / ") : "",
      item.diagramm && item.diagramm.text ? "Diagramm: " + item.diagramm.text : "",
      item.labor && item.labor.text ? "Versuch/Animation: " + item.labor.text : ""].filter(Boolean).join("\n");
    return {
      system: [
        "Du korrigierst eine Natur-und-Technik-Probe der " + (STUFE || "8") + ". Klasse einer bayerischen Mittelschule vor (" +
          (zug === "M" ? "Mittlere-Reife-Klasse M" + (STUFE || "8") + ": Fachsprache und Begründungen dürfen erwartet werden" : "Regelklasse R" + (STUFE || "8") + ": einfache Sprache genügt") + ").",
        "Deine Bewertung ist ein Vorschlag. Die Lehrkraft prüft ihn und entscheidet.",
        "Der Erwartungshorizont nennt die Kriterien. Für jedes Kriterium, das die Antwort sinngemäß erfüllt, gibt es genau einen Punkt – auch in eigenen Worten oder Stichpunkten.",
        "Rechtschreibung, Grammatik und Ausdruck zählen nicht. Falsche Behauptungen nicht belohnen. Verlange nichts, was nicht in Aufgabe oder Erwartungshorizont steht.",
        "comment: kurze Begründung auf Deutsch (du-Form, höchstens 30 Wörter, zuerst was gelungen ist).",
        "tipp: ein konkreter nächster Lernschritt (höchstens 18 Wörter; leer, wenn alle Punkte erreicht sind).",
        "Antworte ausschließlich mit JSON: {\"points\":0,\"comment\":\"…\",\"tipp\":\"…\"}."
      ].join("\n"),
      user: JSON.stringify({aufgabe:item.prompt,...(kontext ? {angaben:kontext} : {}),musterantwort:item.expected,erwartungshorizont:item.criteria,hoechstpunkte:item.points,antwortDesKindes:answer})
    };
  }
  async function textScore(answer, item, zug) {
    const fallback = textFallback(answer, item);
    if (!answer || !process.env.ANTHROPIC_API_KEY) return fallback;
    const erw = ERWEITERT ? vorkorrektur(item, answer, zug) : null;
    const tipp = (parsed) => (erw ? {tipp:clean(parsed.tipp,220)} : {});

    const systemText = erw ? erw.system : [
      "Du korrigierst eine " + FACH + "-Probe der " + (STUFE || "7") + ". Klasse einer bayerischen Mittelschule.",
      "Bewerte fachlichen Sinn wohlwollend anhand der Kriterien. Eigene Worte gelten. Rechtschreibung, Grammatik und Ausdruck sind egal.",
      "Gib fuer jedes erfuellte Kriterium genau einen Punkt. Bei teilweise richtigem Inhalt darf ein Punkt gegeben werden. Falsche Behauptungen nicht belohnen.",
      "Antworte ausschliesslich mit JSON: {\"points\":0,\"comment\":\"Kurze konkrete Rueckmeldung auf Deutsch\"}."
    ].join("\n");
    const userText = erw ? erw.user : JSON.stringify({question:item.prompt,expected:item.expected,criteria:item.criteria,studentAnswer:answer});

    /* Bevorzugt ueber den Hauptserver: Er probiert mehrere Modelle durch, begrenzt die Zahl gleichzeitiger
       Anfragen und setzt eine Zeitgrenze. Scheitert der Anlauf, gilt vorläufig das Stichwort-Ergebnis – die Abgabe
       fragt später im Hintergrund noch einmal nach (kiNachtragen). */
    if (askAnthropic) {
      try {
        const raw = await askAnthropic(systemText, userText, erw ? 320 : 220);
        const match = String(raw || "").match(/\{[\s\S]*\}/);
        if (!match) throw new Error("Invalid AI response");
        const parsed = JSON.parse(match[0]);
        if (!Number.isFinite(Number(parsed.points))) throw new Error("Invalid AI points");
        return {points:Math.max(0,Math.min(item.points,Math.round(Number(parsed.points)))),comment:clean(parsed.comment,220) || "KI-Bewertung.",...tipp(parsed),source:"ki",needsReview:false};
      } catch (err) {
        console.error(LOG + " KI-Korrektur (askAnthropic):",err.message);
        return fallback;
      }
    }

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",signal:AbortSignal.timeout(18000),
        headers:{"content-type":"application/json","x-api-key":process.env.ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01"},
        body:JSON.stringify({model:MODEL,max_tokens:erw ? 320 : 220,system:erw ? erw.system : [
          "Du korrigierst eine " + FACH + "-Probe der " + (STUFE || "7") + ". Klasse einer bayerischen Mittelschule.",
          "Bewerte fachlichen Sinn wohlwollend anhand der Kriterien. Eigene Worte gelten. Rechtschreibung, Grammatik und Ausdruck sind egal.",
          "Gib für jedes erfüllte Kriterium genau einen Punkt. Bei teilweise richtigem Inhalt darf ein Punkt gegeben werden. Falsche Behauptungen nicht belohnen.",
          "Die erwartete Antwort ist ein Beispiel, keine Checkliste: Trifft das Kind den Kern, gibt es volle oder fast volle Punkte, auch wenn Einzelheiten fehlen. Im Zweifel für das Kind.",
          "Antworte ausschließlich mit JSON: {\"points\":0,\"comment\":\"Kurze konkrete Rückmeldung auf Deutsch\"}."
        ].join("\n"),messages:[{role:"user",content:erw ? erw.user : JSON.stringify({question:item.prompt,expected:item.expected,criteria:item.criteria,studentAnswer:answer})}]})
      });
      if (!response.ok) throw new Error("Anthropic HTTP " + response.status);
      const data = await response.json();
      const raw = data.content?.find(block => block.type === "text")?.text || "";
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Invalid AI response");
      const parsed = JSON.parse(match[0]);
      if (!Number.isFinite(Number(parsed.points))) throw new Error("Invalid AI points");
      return {points:Math.max(0,Math.min(item.points,Math.round(Number(parsed.points)))),comment:clean(parsed.comment,220) || "KI-Bewertung.",...tipp(parsed),source:"ki",needsReview:false};
    } catch (err) {
      console.error(LOG + " KI-Korrektur:",err.message);
      return fallback;
    }
  }


  app.get(PREFIX + "/health", (_req,res) => res.json({ok:true,service:SERVICE,aiConfigured:Boolean(process.env.ANTHROPIC_API_KEY),storageConfigured:Boolean(process.env.NT_DATA_DIR)}));
  app.get(PREFIX + "/list", (_req,res) => {
    const data = readData();
    res.json({ok:true,tests:Object.values(tests).map(test => ({id:test.id,title:test.title,scope:test.scope,minutes:test.minutes,itemCount:test.items.length,maxPoints:maxPoints(test),zug:test.zug || "",thema:test.thema || "",...(test.alt ? {alt:true} : {}),...(test.variante ? {variante:test.variante,gruppe:test.gruppe || ""} : {}),unlocked:probeOffen(data.unlocked[test.id])}))});
  });
  // Hat das Kind diese Probe schon abgegeben – oder (Nachschreibproben) die andere Variante derselben Probe?
  const schonAbgegeben = (data, test, student) => data.submissions.some(row => row.studentKey === student.key &&
    (row.testId === test.id || (test.gruppe && tests[row.testId] && tests[row.testId].gruppe === test.gruppe)));
  app.post(PREFIX + "/start", async (req,res) => {
    const test = tests[clean(req.body?.testId)];
    if (!test) return res.status(404).json({ok:false,error:"test_not_found"});
    // Mit Sitzung: Wer schon begonnen hat, darf weiterschreiben, auch wenn die Probe inzwischen gesperrt wurde
    const gesperrt = !probeOffen(readData().unlocked[test.id]);
    if (gesperrt && !SITZUNG) return res.status(403).json({ok:false,error:"locked"});
    const student = await probeKind(req, res);
    if (!student) return;
    if (gesperrt && !sitzLesen().sitzungen[sitzKey(test, student)]) return schonAbgegeben(readData(), test, student) ? res.status(409).json({ok:false,error:"already_submitted"}) : res.status(403).json({ok:false,error:"locked"});
    // Probe einer anderen Jahrgangsstufe (nur wenn opts.stufe gesetzt ist)
    if (STUFE && String(student.klasse || "").indexOf(STUFE) !== 0) return res.status(403).json({ok:false,error:"falsche_stufe",message:`Diese Probe ist für die ${STUFE}. Klassen.`});
    // Fassung für den anderen Zug: R-Kinder schreiben die R-Probe, M-Kinder die M-Probe
    if (test.zug && test.zug !== student.zug) return res.status(403).json({ok:false,error:"falscher_zug",message:`Diese Probe ist für die ${test.zug === "M" ? "M-Klassen" : "R-Klassen"}. Wähle die Probe für deine Klasse.`});
    const data = readData();
    if (schonAbgegeben(data, test, student)) return res.status(409).json({ok:false,error:"already_submitted"});
    const antwort = {ok:true,test:{id:test.id,title:test.title,scope:test.scope,minutes:test.minutes,maxPoints:maxPoints(test),...(test.variante ? {variante:test.variante} : {})},items:test.items.map(publicItem)};
    if (SITZUNG) {
      // Beginn festhalten (oder die laufende Sitzung fortsetzen) und den letzten Zwischenstand mitgeben
      const sd = sitzLesen(), k = sitzKey(test, student);
      let sitz = sd.sitzungen[k];
      if (!sitz) sitz = sd.sitzungen[k] = {testId:test.id,code:student.code,klasse:student.klasse,begonnenAm:new Date().toISOString()};
      else sitz.fortgesetzt = (sitz.fortgesetzt || 0) + 1;      // Seite neu geladen oder anderes Gerät
      sitzSchreiben(sd);
      antwort.sitzung = sitzAntwort(test, sitz);
      if (sitz.answers) antwort.zwischenstand = {answers:sitz.answers,gespeichertAm:sitz.gespeichertAm};
    }
    return res.json(antwort);
  });
  // Zwischenstand sichern (alle paar Sekunden, solange das Kind arbeitet). Gibt nichts ab und bewertet nichts.
  if (SITZUNG) app.post(PREFIX + "/zwischenstand", async (req,res) => {
    try {
      const test = tests[clean(req.body?.testId)];
      if (!test) return res.status(404).json({ok:false,error:"test_not_found"});
      const student = await probeKind(req, res);
      if (!student) return;
      if (!Array.isArray(req.body.answers) || req.body.answers.length !== test.items.length) return res.status(400).json({ok:false,error:"bad_answers"});
      const sd = sitzLesen(), sitz = sd.sitzungen[sitzKey(test, student)];
      if (!sitz) return res.status(409).json({ok:false,error:"keine_sitzung",message:"Diese Probe wurde noch nicht begonnen oder ist schon abgegeben."});
      sitz.answers = test.items.map((item, i) => antwortSauber(item, req.body.answers[i]));
      sitz.gespeichertAm = new Date().toISOString();
      sitz.verlassen = verlassenZahl(req.body.verlassen);
      const prot = protokollSauber(req.body.protokoll);
      if (prot) sitz.protokoll = prot;
      sitzSchreiben(sd);
      return res.json({ok:true,gespeichertAm:sitz.gespeichertAm,sitzung:sitzAntwort(test, sitz)});
    } catch (err) {
      console.error(LOG + " Zwischenstand:",err && err.message);
      return res.status(500).json({ok:false,error:"server_error"});
    }
  });
  // Punkte, Prozent, Note und „Nachsehen nötig“ eines Satzes aus seinen Einzelheiten
  function rechne(record, test) {
    const total = maxPoints(test), score = record.details.reduce((sum,d) => sum+d.points,0);
    Object.assign(record, {score,total,percent:Math.round(score/total*100),grade:grade(score/total*100,record.zug),needsReview:record.details.some(d => d.needsReview)});
  }
  // KI-Bewertung der freien Antworten in den gespeicherten Satz eintragen. Lesen, ändern und schreiben geschieht
  // ohne Unterbrechung – gleichzeitige Abgaben anderer Kinder gehen dabei nicht verloren.
  async function kiNachtragen(id, test, frei) {
    let offen = frei.slice();
    for (let versuch = 0; versuch < KI_VERSUCHE && offen.length; versuch++) {
      if (versuch) await warte(KI_PAUSE_MS);
      const stand = readData().submissions.find(row => row.id === id);
      if (!stand) return;                                      // von der Lehrkraft gelöscht
      const ergebnisse = await Promise.all(offen.map(i => textScore(stand.details[i].given, test.items[i], stand.zug).catch(() => null)));
      const data = readData(), row = data.submissions.find(r => r.id === id);
      if (!row) return;
      const weiter = [];
      offen.forEach((i, k) => {
        const d = row.details[i], r = ergebnisse[k];
        if (d.source === "lehrkraft") return;                  // die Lehrkraft hat inzwischen selbst bewertet
        if (r && r.source === "ki") Object.assign(d, {points:r.points,comment:r.comment,...(r.tipp !== undefined ? {tipp:r.tipp} : {}),source:"ki",needsReview:false});
        else weiter.push(i);
      });
      rechne(row, test); writeData(data);
      offen = weiter;
    }
  }
  // Antworten einer Abgabe auswerten: geschlossene Aufgaben nach dem Schlüssel, freie vorläufig nach Stichwörtern
  // (frei = Nummern der freien Antworten, die danach die KI bewertet)
  function auswerten(test, answers) {
      const details = [], frei = [];
      for (let i=0; i<test.items.length; i++) {
        const item = test.items[i], raw = answers[i];
        const base = {nr:i+1,type:item.type,prompt:item.prompt,maxPoints:item.points,...herkunft(item),...(ERWEITERT ? {...zusatz(item),...(item.image ? {image:item.image,imageAlt:item.imageAlt || ""} : {})} : {})};
        if (item.type === "multi") {
          // mehrere richtige Antworten: je richtig gewählter 1 Punkt, je falsch gewählter 1 Punkt Abzug (nie unter 0)
          const picked = Array.isArray(raw) ? [...new Set(raw.filter(Number.isInteger))].filter(n => n >= 0 && n < item.options.length) : [];
          const richtig = picked.filter(n => item.answers.includes(n)).length;
          details.push({...base,given:picked.map(n => item.options[n]),points:Math.max(0,Math.min(item.points,richtig - (picked.length - richtig))),expected:item.answers.map(n => item.options[n]),source:"schluessel"});
        } else if (item.type === "number") {
          // Zahl mit Toleranz; mit units zählt die Einheit als eigener Punkt
          const wert = zahlLesen(raw && raw.wert !== undefined ? raw.wert : raw), einheit = clean(raw && raw.einheit,12);
          const wertOk = wert !== null && Math.abs(wert - item.answer) <= (item.tolerance || 0) + 1e-9;
          const einheitOk = Boolean(item.units) && wert !== null && einheit === item.unit;
          const zeige = (z, e) => String(z).replace(".", ",") + (e ? " " + e : "");
          details.push({...base,given:wert === null ? "" : zeige(wert, item.units ? einheit : item.unit),points:(wertOk ? item.points - (item.units ? 1 : 0) : 0) + (einheitOk ? 1 : 0),expected:zeige(item.answer, item.unit),source:"schluessel"});
        } else if (item.type === "gaps") {
          const given = Array.isArray(raw) ? raw.map(v => clean(v,80)).slice(0,item.gaps.length) : [];
          const expected = item.gaps.map(g => g[0]);
          details.push({...base,prompt:item.prompt + " – " + item.text,given,labels:item.gaps.map((_,j) => "Lücke " + (j+1)),points:expected.filter((v,j) => given[j] === v).length,expected,source:"schluessel"});
        } else if (item.type === "tf") {
          const given = Array.isArray(raw) ? raw.slice(0,item.statements.length).map(v => v === true ? "richtig" : v === false ? "falsch" : "") : [];
          const expected = item.statements.map(s => s[1] ? "richtig" : "falsch");
          details.push({...base,given,labels:item.statements.map(s => s[0]),points:expected.filter((v,j) => given[j] === v).length,expected,source:"schluessel"});
        } else if (item.type === "labor") {
          // Bauaufgabe: Es zählt der fachliche Endzustand – je erfüllter Regel 1 Punkt
          const z = zustandSauber(raw && raw.zustand), regeln = item.regeln || [], erfuellt = regeln.map(r => regelOk(r.wenn, z));
          details.push({...base,given:clean(raw && raw.text,400),zustand:z,regeln:regeln.map((r,j) => ({text:r.text,ok:erfuellt[j]})),points:erfuellt.filter(Boolean).length,expected:regeln.map(r => r.text).join("; "),source:"schluessel"});
        } else if (item.type === "choice") {
          const picked = Number.isInteger(raw) ? raw : -1;
          details.push({...base,given:item.options[picked] || "",points:picked === item.answer ? item.points : 0,expected:item.options[item.answer],source:"schluessel"});
        } else if (item.type === "match") {
          const given = Array.isArray(raw) ? raw.map(v => clean(v,120)) : [];
          const expected = item.pairs.map(pair => pair[1]);
          const points = expected.filter((v,j) => given[j] === v).length;
          details.push({...base,given,labels:item.pairs.map(pair => pair[0]),points,expected,source:"schluessel"});
        } else if (item.type === "order") {
          const given = Array.isArray(raw) ? raw.map(v => clean(v,200)).slice(0,item.steps.length) : [];
          const points = item.steps.filter((v,j) => given[j] === v).length;
          details.push({...base,given,labels:item.steps.map((_,j) => (j+1) + "."),points,expected:item.steps,source:"schluessel"});
        } else {
          // freie Antwort: sofort vorläufig nach Stichwörtern, die KI kommt nach dem Speichern
          const given = clean(raw,1500), result = textFallback(given,item);
          details.push({...base,given,points:result.points,expected:item.expected,comment:result.comment,source:result.source,needsReview:result.needsReview});
          if (given && process.env.ANTHROPIC_API_KEY) frei.push(i);
        }
      }
      return {details, frei};
  }
  // Angaben der Sitzung für die Abgabe (NT 8): Variante, Beginn, Bearbeitungszeit, wie oft neu geladen
  function sitzungAngaben(test, student, record) {
    if (test.variante) record.variante = test.variante;
    if (!SITZUNG) return;
    const sitz = sitzLesen().sitzungen[sitzKey(test, student)];
    if (!sitz) return;
    record.begonnenAm = sitz.begonnenAm;
    record.dauerSek = Math.max(0, Math.round((Date.parse(record.submittedAt) - Date.parse(sitz.begonnenAm)) / 1000));
    if (sitz.fortgesetzt) record.fortgesetzt = sitz.fortgesetzt;
  }
  // Erst wenn die Abgabe gespeichert ist, wird der Zwischenstand gelöscht
  function sitzungLoeschen(test, student) {
    if (!SITZUNG) return;
    try { const sd = sitzLesen(); delete sd.sitzungen[sitzKey(test, student)]; sitzSchreiben(sd); } catch (_e) { /* die Abgabe ist trotzdem da */ }
  }
  app.post(PREFIX + "/submit", async (req,res) => {
    const test = tests[clean(req.body?.testId)];
    if (!test) return res.status(404).json({ok:false,error:"test_not_found"});
    const student = await probeKind(req, res);
    if (!student) return;
    if (!Array.isArray(req.body.answers) || req.body.answers.length !== test.items.length) return res.status(400).json({ok:false,error:"bad_answers"});
    const submissionKey = `${test.id}|${student.key}`;
    if (pending.has(submissionKey)) return res.status(409).json({ok:false,error:"submission_in_progress"});
    pending.add(submissionKey);
    try {
      const data = readData();
      // Mit Sitzung: Wer begonnen hat, kann auch nach dem Sperren noch abgeben (die Lehrkraft sieht den Vermerk)
      const laufend = SITZUNG && Boolean(sitzLesen().sitzungen[sitzKey(test, student)]);
      if (!probeOffen(data.unlocked[test.id], true) && !laufend) return res.status(403).json({ok:false,error:"locked"});
      if (schonAbgegeben(data, test, student)) return res.status(409).json({ok:false,error:"already_submitted"});
      const {details, frei} = auswerten(test, req.body.answers);
      const record = {id:crypto.randomUUID(),testId:test.id,testTitle:test.title,...student,studentKey:student.key,verlassen:verlassenZahl(req.body.verlassen),protokoll:protokollSauber(req.body.protokoll),details,submittedAt:new Date().toISOString()};
      // nach dem Sperren von Hand abgegeben (Nachfrist): für die Lehrkraft vermerkt
      if (!probeOffen(data.unlocked[test.id])) record.nachSperre = true;
      sitzungAngaben(test, student, record);
      rechne(record, test);
      data.submissions.push(record); writeData(data);          // ab hier ist die Abgabe sicher
      sitzungLoeschen(test, student);
      if (frei.length) await Promise.race([kiNachtragen(record.id, test, frei), warte(KI_GEDULD_MS)]);
      const stand = readData().submissions.find(row => row.id === record.id) || record;
      return res.json({ok:true,result:{score:stand.score,total:stand.total,percent:stand.percent,grade:stand.grade,needsReview:stand.needsReview,details:stand.details,submittedAt:stand.submittedAt}});
    } catch (err) {
      console.error(LOG + " submission:",err);
      return res.status(500).json({ok:false,error:"server_error"});
    } finally { pending.delete(submissionKey); }
  });
  app.post(PREFIX + "/teacher/unlock", (req,res) => {
    if (!teacher(req,res)) return;
    const id = clean(req.body.testId);
    if (!tests[id]) return res.status(404).json({ok:false,error:"test_not_found"});
    const data = readData(); data.unlocked[id] = {open:req.body.open === true,changedAt:new Date().toISOString()}; writeData(data);
    res.json({ok:true,testId:id,unlocked:data.unlocked[id].open});
  });
  app.post(PREFIX + "/teacher/results", (req,res) => {
    if (!teacher(req,res)) return;
    const id = clean(req.body.testId);
    const rows = readData().submissions.filter(row => !id || row.testId === id).sort((a,b) => a.className.localeCompare(b.className,"de") || a.lastName.localeCompare(b.lastName,"de"));
    res.json({ok:true,submissions:rows});
  });
  app.post(PREFIX + "/teacher/override", (req,res) => {
    if (!teacher(req,res)) return;
    const data = readData(), row = data.submissions.find(s => s.id === clean(req.body.submissionId));
    const item = row?.details.find(d => d.nr === Number(req.body.nr));
    const points = Number(req.body.points);
    if (!row || !item) return res.status(404).json({ok:false,error:"not_found"});
    // NT 8 (erweitert): Die Lehrkraft kann jede Aufgabe ändern, nicht nur die freien Antworten
    if ((item.type !== "text" && !ERWEITERT) || !Number.isInteger(points) || points < 0 || points > item.maxPoints) return res.status(400).json({ok:false,error:"invalid_override"});
    if (ERWEITERT && item.source !== "lehrkraft" && item.vorschlag === undefined) item.vorschlag = {points:item.points,source:item.source};   // was Schlüssel oder KI vorgeschlagen hatten
    item.points = points; item.source = "lehrkraft"; item.needsReview = false; item.comment = clean(req.body.comment,ERWEITERT ? 600 : 220) || item.comment;
    if (ERWEITERT && typeof req.body.tipp === "string") item.tipp = clean(req.body.tipp,300);
    row.score = row.details.reduce((sum,d) => sum+d.points,0); row.percent = Math.round(row.score/row.total*100); row.grade = grade(row.score/row.total*100,row.zug); row.needsReview = row.details.some(d => d.needsReview);
    if (ERWEITERT) delete row.bestaetigtAm;                    // nach einer Änderung neu bestätigen
    writeData(data); res.json({ok:true,score:row.score,percent:row.percent,grade:row.grade});
  });
  if (ERWEITERT) {
    // Probe vor dem Einsatz ansehen: jede Aufgabe mit Lösungsschlüssel und Erwartungshorizont – nur mit Lehrerpasswort
    app.post(PREFIX + "/teacher/vorschau", (req,res) => {
      if (!teacher(req,res)) return;
      const id = clean(req.body.testId), test = tests[id];
      if (!test) return res.status(404).json({ok:false,error:"test_not_found"});
      res.json({ok:true,testId:id,title:test.title,minutes:test.minutes,scope:test.scope || "",total:test.items.reduce((sum,item) => sum+item.points,0),items:test.items});
    });
    // Freie Antwort noch einmal von der KI bewerten lassen (z. B. nachdem die KI nicht erreichbar war)
    app.post(PREFIX + "/teacher/neu-bewerten", async (req,res) => {
      if (!teacher(req,res)) return;
      try {
        const id = clean(req.body.submissionId), nr = Number(req.body.nr);
        const vorher = readData().submissions.find(s => s.id === id), test = vorher && tests[vorher.testId];
        const d0 = vorher?.details.find(d => d.nr === nr);
        if (!vorher || !test || !d0 || d0.type !== "text") return res.status(404).json({ok:false,error:"not_found"});
        const r = await textScore(d0.given, test.items[nr-1], vorher.zug);
        const data = readData(), row = data.submissions.find(s => s.id === id), d = row?.details.find(x => x.nr === nr);
        if (!row || !d) return res.status(404).json({ok:false,error:"not_found"});
        Object.assign(d, {points:r.points,comment:r.comment,...(r.tipp !== undefined ? {tipp:r.tipp} : {}),source:r.source,needsReview:r.needsReview});
        delete d.vorschlag; delete row.bestaetigtAm;
        rechne(row, test); writeData(data);
        return res.json({ok:true,detail:d,score:row.score,percent:row.percent,grade:row.grade,ki:r.source === "ki"});
      } catch (err) {
        console.error(LOG + " neu bewerten:",err && err.message);
        return res.status(500).json({ok:false,error:"server_error"});
      }
    });
    // Gesamtergebnis bestätigen: Erst damit gilt die Korrektur als geprüft (Zurückgeben: /api/proben/rueckgabe)
    app.post(PREFIX + "/teacher/bestaetigen", (req,res) => {
      if (!teacher(req,res)) return;
      const data = readData(), row = data.submissions.find(s => s.id === clean(req.body.submissionId));
      if (!row) return res.status(404).json({ok:false,error:"not_found"});
      if (req.body.offen === false) delete row.bestaetigtAm;
      else {
        row.bestaetigtAm = new Date().toISOString(); row.needsReview = false;
        // Was die KI nicht bewerten konnte, gilt mit der Bestätigung als von der Lehrkraft geprüft – der Vermerk
        // „vorläufig“ soll nicht in der zurückgegebenen Probe stehen
        row.details.forEach(d => { d.needsReview = false; if (d.source === "stichworte") { d.source = "lehrkraft"; if (/^Vorläufige Stichwortauswertung/.test(d.comment || "")) d.comment = ""; } });
      }
      if (typeof req.body.kommentar === "string") row.kommentar = clean(req.body.kommentar,1200);
      writeData(data); res.json({ok:true,bestaetigtAm:row.bestaetigtAm || ""});
    });
  }
  if (SITZUNG) {
    // Laufende Bearbeitungen: wer schreibt gerade, seit wann, wann zuletzt gesichert
    app.post(PREFIX + "/teacher/sitzungen", (req,res) => {
      if (!teacher(req,res)) return;
      const id = clean(req.body.testId);
      const liste = Object.values(sitzLesen().sitzungen).filter(s => tests[s.testId] && (!id || s.testId === id)).map(s => ({testId:s.testId,code:s.code,klasse:s.klasse,
        begonnenAm:s.begonnenAm,gespeichertAm:s.gespeichertAm || "",minuten:tests[s.testId].minutes || 0,verlassen:s.verlassen || 0,fortgesetzt:s.fortgesetzt || 0,
        beantwortet:(s.answers || []).filter(a => a !== null && a !== "" && !(Array.isArray(a) && !a.some(x => x !== "" && x !== null)) && !(a && typeof a === "object" && "wert" in a && !a.wert)).length,aufgaben:tests[s.testId].items.length}))
        .sort((a,b) => String(a.code).localeCompare(String(b.code)));
      res.json({ok:true,serverZeit:new Date().toISOString(),sitzungen:liste});
    });
    // Gesicherten Zwischenstand als Abgabe übernehmen (Gerät ausgefallen, Kind konnte nicht abgeben)
    app.post(PREFIX + "/teacher/sitzung-abgeben", async (req,res) => {
      if (!teacher(req,res)) return;
      try {
        const test = tests[clean(req.body.testId)], code = clean(req.body.code,3);
        const sitz = test && sitzLesen().sitzungen[test.id + "|" + code];
        if (!test || !sitz) return res.status(404).json({ok:false,error:"not_found",message:"Zu diesem Kind gibt es keinen Zwischenstand."});
        const { zugVonKlasse } = require("./probe-kind");
        const student = {code,klasse:sitz.klasse,zug:zugVonKlasse(sitz.klasse),lrs:false,firstName:"Code " + code,lastName:"",className:sitz.klasse,key:"code|" + code};
        const data = readData();
        if (schonAbgegeben(data, test, student)) return res.status(409).json({ok:false,error:"already_submitted"});
        const {details, frei} = auswerten(test, sitz.answers || test.items.map(() => null));
        const record = {id:crypto.randomUUID(),testId:test.id,testTitle:test.title,...student,studentKey:student.key,verlassen:verlassenZahl(sitz.verlassen),protokoll:sitz.protokoll,details,
          submittedAt:new Date().toISOString(),vonLehrkraft:true,standVom:sitz.gespeichertAm || sitz.begonnenAm};
        sitzungAngaben(test, student, record);
        rechne(record, test);
        data.submissions.push(record); writeData(data);
        sitzungLoeschen(test, student);
        if (frei.length) kiNachtragen(record.id, test, frei).catch(() => {});
        return res.json({ok:true,submissionId:record.id});
      } catch (err) {
        console.error(LOG + " Zwischenstand übernehmen:",err && err.message);
        return res.status(500).json({ok:false,error:"server_error"});
      }
    });
  }
  app.post(PREFIX + "/teacher/delete", (req,res) => {
    if (!teacher(req,res)) return;
    const data = readData(), before = data.submissions.length;
    data.submissions = data.submissions.filter(s => s.id !== clean(req.body.submissionId));
    if (data.submissions.length === before) return res.status(404).json({ok:false,error:"not_found"});
    writeData(data); res.json({ok:true});
  });
  app.post(PREFIX + "/teacher/export", (req,res) => {
    if (!teacher(req,res)) return;
    const id = clean(req.body.testId);
    const rows = readData().submissions.filter(row => !id || row.testId === id);
    const quote = v => {
      const text = String(v ?? "");
      return '"' + (/^[=+\-@\t\r]/.test(text) ? "'" : "") + text.replace(/"/g,'""') + '"';
    };
    const csv = ["Probe;Klasse;Nachname;Vorname;Punkte;Gesamt;Prozent;Note;Nachpruefen;Abgabe", ...rows.map(r => [r.testTitle,r.className,r.lastName,r.firstName,r.score,r.total,r.percent,r.grade,r.needsReview ? "ja":"nein",r.submittedAt].map(quote).join(";"))].join("\r\n");
    res.type("text/csv; charset=utf-8").attachment(opts.csvName || "nt7-proben.csv").send("\ufeff"+csv);
  });

  // Fuer die Notenuebersicht je Klasse
  return { abgaben: () => readData().submissions };
}

module.exports = { registerNt7Routes };
