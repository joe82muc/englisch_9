"use strict";

/**
 * NT-Proben Klasse 7M
 * -------------------
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
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const tests = require("./nt7-fragen");

/**
 * @param app            Express-App
 * @param opts.dataDir   Verzeichnis fuer die JSON-Ablage
 * @param opts.teacherPassword  Passwort der Lehrkraft
 * @param opts.model     Anthropic-Modell (optional)
 */
function registerNt7Routes(app, opts) {
  const DATA_DIR = opts.dataDir;
  const DATA_FILE = path.join(DATA_DIR, "nt7-proben.json");
  const TEACHER_PASSWORD = opts.teacherPassword || "";
  const MODEL = opts.model || process.env.ANTHROPIC_MODEL || "claude-haiku-4-5";
  const pending = new Set();


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
  function identity(body) {
    const firstName = clean(body.firstName, 60);
    const lastName = clean(body.lastName, 60);
    const className = clean(body.className, 30);
    if (!firstName || !lastName || !className) return null;
    const key = [firstName,lastName,className].join("|").toLocaleLowerCase("de").normalize("NFKC").replace(/\s+/g," ");
    return {firstName,lastName,className,key};
  }
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
  function grade(percent) { return percent >= 92 ? 1 : percent >= 81 ? 2 : percent >= 67 ? 3 : percent >= 50 ? 4 : percent >= 30 ? 5 : 6; }
  function publicItem(item, index) {
    return {nr:index+1,type:item.type,prompt:item.prompt,points:item.points,
      options:item.options || undefined, labels:item.pairs?.map(pair => pair[0]),
      targets:item.pairs?.map(pair => pair[1]).sort((a,b) => a.localeCompare(b,"de")),
      image:item.image || undefined,imageAlt:item.imageAlt || undefined};
  }
  function textFallback(answer, item) {
    if (answer.length < 3) return {points:0,comment:"Keine auswertbare Antwort.",source:"leer",needsReview:false};
    const lower = answer.toLocaleLowerCase("de");
    const hits = item.keywords.filter(group => group.split("|").some(word => lower.includes(word))).length;
    const points = Math.min(item.points, hits);
    return {points,comment:"Vorläufige Stichwortauswertung. Die Lehrkraft prüft diese Antwort nach.",source:"stichworte",needsReview:true};
  }
  async function textScore(answer, item) {
    const fallback = textFallback(answer, item);
    if (!answer || !process.env.ANTHROPIC_API_KEY) return fallback;
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",signal:AbortSignal.timeout(18000),
        headers:{"content-type":"application/json","x-api-key":process.env.ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01"},
        body:JSON.stringify({model:MODEL,max_tokens:220,system:[
          "Du korrigierst eine Natur-und-Technik-Probe der 7. Klasse einer bayerischen Mittelschule.",
          "Bewerte fachlichen Sinn wohlwollend anhand der drei Kriterien. Eigene Worte gelten. Rechtschreibung, Grammatik und Ausdruck sind egal.",
          "Gib für jedes erfüllte Kriterium genau einen Punkt. Bei teilweise richtigem Inhalt darf ein Punkt gegeben werden. Falsche Behauptungen nicht belohnen.",
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
      console.error("NT7 KI-Korrektur:",err.message);
      return fallback;
    }
  }


  app.get("/api/nt7/health", (_req,res) => res.json({ok:true,service:"nt7-proben",aiConfigured:Boolean(process.env.ANTHROPIC_API_KEY),storageConfigured:Boolean(process.env.NT_DATA_DIR)}));
  app.get("/api/nt7/list", (_req,res) => {
    const data = readData();
    res.json({ok:true,tests:Object.values(tests).map(test => ({id:test.id,title:test.title,scope:test.scope,minutes:test.minutes,itemCount:test.items.length,maxPoints:maxPoints(test),unlocked:Boolean(data.unlocked[test.id])}))});
  });
  app.post("/api/nt7/start", (req,res) => {
    const test = tests[clean(req.body?.testId)];
    const student = identity(req.body || {});
    if (!test) return res.status(404).json({ok:false,error:"test_not_found"});
    if (!student) return res.status(400).json({ok:false,error:"missing_identity"});
    const data = readData();
    if (!data.unlocked[test.id]) return res.status(403).json({ok:false,error:"locked"});
    if (data.submissions.some(row => row.testId === test.id && row.studentKey === student.key)) return res.status(409).json({ok:false,error:"already_submitted"});
    return res.json({ok:true,test:{id:test.id,title:test.title,scope:test.scope,minutes:test.minutes,maxPoints:maxPoints(test)},items:test.items.map(publicItem)});
  });
  app.post("/api/nt7/submit", async (req,res) => {
    const test = tests[clean(req.body?.testId)];
    const student = identity(req.body || {});
    if (!test) return res.status(404).json({ok:false,error:"test_not_found"});
    if (!student) return res.status(400).json({ok:false,error:"missing_identity"});
    if (!Array.isArray(req.body.answers) || req.body.answers.length !== test.items.length) return res.status(400).json({ok:false,error:"bad_answers"});
    const submissionKey = `${test.id}|${student.key}`;
    if (pending.has(submissionKey)) return res.status(409).json({ok:false,error:"submission_in_progress"});
    pending.add(submissionKey);
    try {
      let data = readData();
      if (!data.unlocked[test.id]) return res.status(403).json({ok:false,error:"locked"});
      if (data.submissions.some(row => row.testId === test.id && row.studentKey === student.key)) return res.status(409).json({ok:false,error:"already_submitted"});
      const details = [];
      for (let i=0; i<test.items.length; i++) {
        const item = test.items[i], raw = req.body.answers[i];
        const base = {nr:i+1,type:item.type,prompt:item.prompt,maxPoints:item.points};
        if (item.type === "choice") {
          const picked = Number.isInteger(raw) ? raw : -1;
          details.push({...base,given:item.options[picked] || "",points:picked === item.answer ? item.points : 0,expected:item.options[item.answer],source:"schluessel"});
        } else if (item.type === "match") {
          const given = Array.isArray(raw) ? raw.map(v => clean(v,120)) : [];
          const expected = item.pairs.map(pair => pair[1]);
          const points = expected.filter((v,j) => given[j] === v).length;
          details.push({...base,given,labels:item.pairs.map(pair => pair[0]),points,expected,source:"schluessel"});
        } else {
          const given = clean(raw,1500);
          const result = await textScore(given,item);
          details.push({...base,given,points:result.points,expected:item.expected,comment:result.comment,source:result.source,needsReview:result.needsReview});
        }
      }
      const score = details.reduce((sum,d) => sum+d.points,0), total = maxPoints(test), percent = Math.round(score/total*100);
      const record = {id:crypto.randomUUID(),testId:test.id,testTitle:test.title,...student,studentKey:student.key,score,total,percent,grade:grade(score/total*100),needsReview:details.some(d => d.needsReview),details,submittedAt:new Date().toISOString()};
      data = readData();
      if (!data.unlocked[test.id]) return res.status(403).json({ok:false,error:"locked"});
      if (data.submissions.some(row => row.testId === test.id && row.studentKey === student.key)) return res.status(409).json({ok:false,error:"already_submitted"});
      data.submissions.push(record); writeData(data);
      return res.json({ok:true,result:{score,total,percent,grade:record.grade,needsReview:record.needsReview,details,submittedAt:record.submittedAt}});
    } catch (err) {
      console.error("NT7 submission:",err);
      return res.status(500).json({ok:false,error:"server_error"});
    } finally { pending.delete(submissionKey); }
  });
  app.post("/api/nt7/teacher/unlock", (req,res) => {
    if (!teacher(req,res)) return;
    const id = clean(req.body.testId);
    if (!tests[id]) return res.status(404).json({ok:false,error:"test_not_found"});
    const data = readData(); data.unlocked[id] = req.body.open === true; writeData(data);
    res.json({ok:true,testId:id,unlocked:data.unlocked[id]});
  });
  app.post("/api/nt7/teacher/results", (req,res) => {
    if (!teacher(req,res)) return;
    const id = clean(req.body.testId);
    const rows = readData().submissions.filter(row => !id || row.testId === id).sort((a,b) => a.className.localeCompare(b.className,"de") || a.lastName.localeCompare(b.lastName,"de"));
    res.json({ok:true,submissions:rows});
  });
  app.post("/api/nt7/teacher/override", (req,res) => {
    if (!teacher(req,res)) return;
    const data = readData(), row = data.submissions.find(s => s.id === clean(req.body.submissionId));
    const item = row?.details.find(d => d.nr === Number(req.body.nr));
    const points = Number(req.body.points);
    if (!row || !item) return res.status(404).json({ok:false,error:"not_found"});
    if (item.type !== "text" || !Number.isInteger(points) || points < 0 || points > item.maxPoints) return res.status(400).json({ok:false,error:"invalid_override"});
    item.points = points; item.source = "lehrkraft"; item.needsReview = false; item.comment = clean(req.body.comment,220) || item.comment;
    row.score = row.details.reduce((sum,d) => sum+d.points,0); row.percent = Math.round(row.score/row.total*100); row.grade = grade(row.score/row.total*100); row.needsReview = row.details.some(d => d.needsReview);
    writeData(data); res.json({ok:true,score:row.score,percent:row.percent,grade:row.grade});
  });
  app.post("/api/nt7/teacher/delete", (req,res) => {
    if (!teacher(req,res)) return;
    const data = readData(), before = data.submissions.length;
    data.submissions = data.submissions.filter(s => s.id !== clean(req.body.submissionId));
    if (data.submissions.length === before) return res.status(404).json({ok:false,error:"not_found"});
    writeData(data); res.json({ok:true});
  });
  app.post("/api/nt7/teacher/export", (req,res) => {
    if (!teacher(req,res)) return;
    const id = clean(req.body.testId);
    const rows = readData().submissions.filter(row => !id || row.testId === id);
    const quote = v => {
      const text = String(v ?? "");
      return '"' + (/^[=+\-@\t\r]/.test(text) ? "'" : "") + text.replace(/"/g,'""') + '"';
    };
    const csv = ["Probe;Klasse;Nachname;Vorname;Punkte;Gesamt;Prozent;Note;Nachpruefen;Abgabe", ...rows.map(r => [r.testTitle,r.className,r.lastName,r.firstName,r.score,r.total,r.percent,r.grade,r.needsReview ? "ja":"nein",r.submittedAt].map(quote).join(";"))].join("\r\n");
    res.type("text/csv; charset=utf-8").attachment("nt7-proben.csv").send("\ufeff"+csv);
  });
}

module.exports = { registerNt7Routes };
