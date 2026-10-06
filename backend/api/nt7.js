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
      image:item.image || undefined,imageAlt:item.imageAlt || undefined,...herkunft(item)};
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
  async function textScore(answer, item) {
    const fallback = textFallback(answer, item);
    if (!answer || !process.env.ANTHROPIC_API_KEY) return fallback;

    const systemText = [
      "Du korrigierst eine " + FACH + "-Probe der " + (STUFE || "7") + ". Klasse einer bayerischen Mittelschule.",
      "Bewerte fachlichen Sinn wohlwollend anhand der Kriterien. Eigene Worte gelten. Rechtschreibung, Grammatik und Ausdruck sind egal.",
      "Gib fuer jedes erfuellte Kriterium genau einen Punkt. Bei teilweise richtigem Inhalt darf ein Punkt gegeben werden. Falsche Behauptungen nicht belohnen.",
      "Antworte ausschliesslich mit JSON: {\"points\":0,\"comment\":\"Kurze konkrete Rueckmeldung auf Deutsch\"}."
    ].join("\n");
    const userText = JSON.stringify({question:item.prompt,expected:item.expected,criteria:item.criteria,studentAnswer:answer});

    /* Bevorzugt ueber den Hauptserver: Er probiert mehrere Modelle durch, begrenzt die Zahl gleichzeitiger
       Anfragen und setzt eine Zeitgrenze. Scheitert der Anlauf, gilt vorläufig das Stichwort-Ergebnis – die Abgabe
       fragt später im Hintergrund noch einmal nach (kiNachtragen). */
    if (askAnthropic) {
      try {
        const raw = await askAnthropic(systemText, userText, 220);
        const match = String(raw || "").match(/\{[\s\S]*\}/);
        if (!match) throw new Error("Invalid AI response");
        const parsed = JSON.parse(match[0]);
        if (!Number.isFinite(Number(parsed.points))) throw new Error("Invalid AI points");
        return {points:Math.max(0,Math.min(item.points,Math.round(Number(parsed.points)))),comment:clean(parsed.comment,220) || "KI-Bewertung.",source:"ki",needsReview:false};
      } catch (err) {
        console.error(LOG + " KI-Korrektur (askAnthropic):",err.message);
        return fallback;
      }
    }

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",signal:AbortSignal.timeout(18000),
        headers:{"content-type":"application/json","x-api-key":process.env.ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01"},
        body:JSON.stringify({model:MODEL,max_tokens:220,system:[
          "Du korrigierst eine " + FACH + "-Probe der " + (STUFE || "7") + ". Klasse einer bayerischen Mittelschule.",
          "Bewerte fachlichen Sinn wohlwollend anhand der Kriterien. Eigene Worte gelten. Rechtschreibung, Grammatik und Ausdruck sind egal.",
          "Gib für jedes erfüllte Kriterium genau einen Punkt. Bei teilweise richtigem Inhalt darf ein Punkt gegeben werden. Falsche Behauptungen nicht belohnen.",
          "Die erwartete Antwort ist ein Beispiel, keine Checkliste: Trifft das Kind den Kern, gibt es volle oder fast volle Punkte, auch wenn Einzelheiten fehlen. Im Zweifel für das Kind.",
          "Antworte ausschließlich mit JSON: {\"points\":0,\"comment\":\"Kurze konkrete Rückmeldung auf Deutsch\"}."
        ].join("\n"),messages:[{role:"user",content:JSON.stringify({question:item.prompt,expected:item.expected,criteria:item.criteria,studentAnswer:answer})}]})
      });
      if (!response.ok) throw new Error("Anthropic HTTP " + response.status);
      const data = await response.json();
      const raw = data.content?.find(block => block.type === "text")?.text || "";
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Invalid AI response");
      const parsed = JSON.parse(match[0]);
      if (!Number.isFinite(Number(parsed.points))) throw new Error("Invalid AI points");
      return {points:Math.max(0,Math.min(item.points,Math.round(Number(parsed.points)))),comment:clean(parsed.comment,220) || "KI-Bewertung.",source:"ki",needsReview:false};
    } catch (err) {
      console.error(LOG + " KI-Korrektur:",err.message);
      return fallback;
    }
  }


  app.get(PREFIX + "/health", (_req,res) => res.json({ok:true,service:SERVICE,aiConfigured:Boolean(process.env.ANTHROPIC_API_KEY),storageConfigured:Boolean(process.env.NT_DATA_DIR)}));
  app.get(PREFIX + "/list", (_req,res) => {
    const data = readData();
    res.json({ok:true,tests:Object.values(tests).map(test => ({id:test.id,title:test.title,scope:test.scope,minutes:test.minutes,itemCount:test.items.length,maxPoints:maxPoints(test),zug:test.zug || "",thema:test.thema || "",...(test.alt ? {alt:true} : {}),unlocked:probeOffen(data.unlocked[test.id])}))});
  });
  app.post(PREFIX + "/start", async (req,res) => {
    const test = tests[clean(req.body?.testId)];
    if (!test) return res.status(404).json({ok:false,error:"test_not_found"});
    if (!probeOffen(readData().unlocked[test.id])) return res.status(403).json({ok:false,error:"locked"});
    const student = await probeKind(req, res);
    if (!student) return;
    // Probe einer anderen Jahrgangsstufe (nur wenn opts.stufe gesetzt ist)
    if (STUFE && String(student.klasse || "").indexOf(STUFE) !== 0) return res.status(403).json({ok:false,error:"falsche_stufe",message:`Diese Probe ist für die ${STUFE}. Klassen.`});
    // Fassung für den anderen Zug: R-Kinder schreiben die R-Probe, M-Kinder die M-Probe
    if (test.zug && test.zug !== student.zug) return res.status(403).json({ok:false,error:"falscher_zug",message:`Diese Probe ist für die ${test.zug === "M" ? "M-Klassen" : "R-Klassen"}. Wähle die Probe für deine Klasse.`});
    const data = readData();
    if (data.submissions.some(row => row.testId === test.id && row.studentKey === student.key)) return res.status(409).json({ok:false,error:"already_submitted"});
    return res.json({ok:true,test:{id:test.id,title:test.title,scope:test.scope,minutes:test.minutes,maxPoints:maxPoints(test)},items:test.items.map(publicItem)});
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
      const ergebnisse = await Promise.all(offen.map(i => textScore(stand.details[i].given, test.items[i]).catch(() => null)));
      const data = readData(), row = data.submissions.find(r => r.id === id);
      if (!row) return;
      const weiter = [];
      offen.forEach((i, k) => {
        const d = row.details[i], r = ergebnisse[k];
        if (d.source === "lehrkraft") return;                  // die Lehrkraft hat inzwischen selbst bewertet
        if (r && r.source === "ki") Object.assign(d, {points:r.points,comment:r.comment,source:"ki",needsReview:false});
        else weiter.push(i);
      });
      rechne(row, test); writeData(data);
      offen = weiter;
    }
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
      if (!probeOffen(data.unlocked[test.id], true)) return res.status(403).json({ok:false,error:"locked"});
      if (data.submissions.some(row => row.testId === test.id && row.studentKey === student.key)) return res.status(409).json({ok:false,error:"already_submitted"});
      const details = [], frei = [];
      for (let i=0; i<test.items.length; i++) {
        const item = test.items[i], raw = req.body.answers[i];
        const base = {nr:i+1,type:item.type,prompt:item.prompt,maxPoints:item.points,...herkunft(item)};
        if (item.type === "choice") {
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
      const record = {id:crypto.randomUUID(),testId:test.id,testTitle:test.title,...student,studentKey:student.key,verlassen:verlassenZahl(req.body.verlassen),protokoll:protokollSauber(req.body.protokoll),details,submittedAt:new Date().toISOString()};
      // nach dem Sperren von Hand abgegeben (Nachfrist): für die Lehrkraft vermerkt
      if (!probeOffen(data.unlocked[test.id])) record.nachSperre = true;
      rechne(record, test);
      data.submissions.push(record); writeData(data);          // ab hier ist die Abgabe sicher
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
    if (item.type !== "text" || !Number.isInteger(points) || points < 0 || points > item.maxPoints) return res.status(400).json({ok:false,error:"invalid_override"});
    item.points = points; item.source = "lehrkraft"; item.needsReview = false; item.comment = clean(req.body.comment,220) || item.comment;
    row.score = row.details.reduce((sum,d) => sum+d.points,0); row.percent = Math.round(row.score/row.total*100); row.grade = grade(row.score/row.total*100,row.zug); row.needsReview = row.details.some(d => d.needsReview);
    writeData(data); res.json({ok:true,score:row.score,percent:row.percent,grade:row.grade});
  });
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
