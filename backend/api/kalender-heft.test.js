"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const express = require("express");
const { registerKlasseRoutes } = require("./klasse");
const { registerKalenderRoutes } = require("./kalender/server/kalender");
const PW = "Heft-Test-2026!";
const jetzt = () => new Date("2026-10-07T08:00:00Z");
const kindZumCode = async code => code === "101" ? {code, klasse:"7aM"} : code === "202" ? {code, klasse:"8c"} : code === "000" ? {code, lehrer:true} : null;
let server, base, dir, kalender, token, own, other, homework;
async function post(route, body, bearer) {
  const r = await fetch(base + route, {method:"POST",headers:{"Content-Type":"application/json",...(bearer ? {Authorization:"Bearer "+bearer} : {})},body:JSON.stringify(body)});
  return {status:r.status, data:await r.json()};
}
const kid = (code="101") => post("/api/klasse/heft", {code});
const teacher = (klasse="7aM") => post("/api/klasse/lehrer/heft/liste", {password:PW, klasse});
const proben = r => r.data.eintraege.filter(e => e.quelle === "kalender");

test.before(async () => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "grumi-kalender-heft-"));
  const app = express(); app.use(express.json());
  kalender = registerKalenderRoutes(app, {dataDir:dir, teacherPassword:PW, jetzt, kindZumCode});
  registerKlasseRoutes(app, {dataDir:dir, teacherPassword:PW, jetzt, kindZumCode, kalenderTermine:klasse => kalender.heft(klasse)});
  await new Promise(resolve => {server=app.listen(0,"127.0.0.1",resolve);});
  base = "http://127.0.0.1:"+server.address().port;
  for (const id of ["lehrer1","lehrer2"]) assert.equal((await post("/api/kalender/admin/speichern", {password:PW,benutzer:id,name:id,passwort:PW})).status,200);
  token = (await post("/api/kalender/anmelden", {benutzer:"lehrer1",passwort:PW})).data.token;
  const token2 = (await post("/api/kalender/anmelden", {benutzer:"lehrer2",passwort:PW})).data.token;
  const es = [{datum:"2026-10-08",klasse:"7aM",fach:"Deutsch",titel:"Erzaehlung",stunde:"2. Stunde",hinweis:"Schreibplan",uid:"import-7"},{datum:"2026-10-09",klasse:"8c",fach:"Informatik",titel:"Netzwerke",uid:"import-8"}];
  assert.equal((await post("/api/kalender/import", {eintraege:es,bestaetigt:true},token)).data.anzahl,2);
  assert.equal((await post("/api/kalender/import", {eintraege:[{datum:"2026-10-10",klasse:"7aM",fach:"Englisch",titel:"Unit 1"}],bestaetigt:true},token2)).data.anzahl,1);
  const liste = (await post("/api/kalender/liste",{},token)).data.eintraege;
  own = liste.find(e=>e.uid===undefined && e.titel==="Erzaehlung"); other = liste.find(e=>e.lehrerId==="lehrer2");
  homework = (await post("/api/klasse/lehrer/heft/speichern", {password:PW,klasse:"7aM",fach:"Mathematik",text:"Seite 12",faellig:"2026-10-08",typ:"aufgabe"})).data.eintrag;
  assert.equal((await post("/api/klasse/heft/eigen/speichern", {code:"101",fach:"Kunst",text:"Pinsel mitbringen",faellig:"2026-10-09"})).status,200);
});
test.after(async () => {
  await new Promise(resolve=>server.close(resolve));
  assert.equal(path.dirname(path.resolve(dir)),path.resolve(os.tmpdir()));
  fs.rmSync(dir,{recursive:true,force:true});
});

test("Vorhandene/importierte Proben aller Lehrkraefte zusaetzlich im richtigen Klassenheft",async()=>{
  const r=await kid(); assert.equal(r.status,200); assert.equal(proben(r).length,2);
  const e=proben(r).find(e=>e.id==="kalender:"+own.id);
  assert.equal(e.fach,"Deutsch"); assert.equal(e.text,"Erzaehlung\n2. Stunde"); assert.equal(e.faellig,"2026-10-08"); assert.equal(e.typ,"probe");
  assert.ok(!JSON.stringify(r.data).includes("Schreibplan"));
  const original=(await post("/api/kalender/liste",{},token)).data.eintraege.find(e=>e.id===own.id);
  assert.equal(original.hinweis,"Schreibplan");
  assert.ok(r.data.eintraege.some(e=>e.id===homework.id)); assert.equal(r.data.eigene.length,1);
  assert.equal(proben(await kid("202")).length,1); assert.equal(proben(await teacher()).length,2);
  assert.equal(proben(await teacher()).find(entry=>entry.id==="kalender:"+own.id).text,"Erzaehlung\n2. Stunde");
  assert.ok(proben(r).some(e=>e.id==="kalender:"+other.id));
});
test("Klasse vom Code, keine fremden oder privaten Verwaltungsfelder",async()=>{
  const r=await post("/api/klasse/heft", {code:"101",klasse:"8c"});
  assert.equal(r.data.klasse,"7aM"); assert.ok(proben(r).every(e=>e.fach!=="Informatik"));
  assert.deepEqual(Object.keys(proben(r)[0]).sort(),["fach","faellig","id","link","quelle","text","typ"]);
  assert.equal((await kid("000")).status,403); assert.equal((await kid("999")).status,401);
  assert.equal((await post("/api/klasse/lehrer/heft/liste",{klasse:"7aM"})).status,401);
  assert.equal((await kid("202")).data.eigene.length,0);
});
test("Neue Probe, Aenderung, Verschiebung und Klassenwechsel ohne stale Kopien",async()=>{
  const neu=await post("/api/kalender/speichern", {datum:"2026-10-14",klasse:"7aM",fach:"GPG",titel:"Wissen",bestaetigt:true},token);
  assert.equal(neu.status,200); const id="kalender:"+neu.data.eintrag.id;
  assert.ok(proben(await kid()).some(e=>e.id===id));
  const update=await post("/api/kalender/speichern", {...neu.data.eintrag,datum:"2026-10-20",klasse:"8c",titel:"Wissen aktualisiert",stunde:"3. Stunde",bestaetigt:true},token);
  assert.equal(update.status,200); assert.ok(!proben(await kid()).some(e=>e.id===id));
  const e=proben(await kid("202")).find(e=>e.id===id); assert.equal(e.faellig,"2026-10-20"); assert.equal(e.text,"Wissen aktualisiert\n3. Stunde");
  assert.equal((await post("/api/kalender/loeschen",{id:neu.data.eintrag.id,version:update.data.eintrag.version},token)).status,200);
  assert.ok(!proben(await kid("202")).some(e=>e.id===id));
  assert.ok((await kid()).data.eintraege.some(e=>e.id===homework.id));
});
test("Wiederholtes Laden und erneuter Import erzeugen keine doppelten Hefttermine",async()=>{
  const erneut=await post("/api/kalender/import",{eintraege:[{datum:"2026-10-08",klasse:"7aM",fach:"Deutsch",titel:"Erzaehlung",stunde:"2. Stunde",hinweis:"Schreibplan",uid:"import-7"}],bestaetigt:true},token);
  assert.equal(erneut.data.anzahl,0);
  for(let i=0;i<3;i++){const es=proben(await kid()); assert.equal(es.length,2); assert.equal(new Set(es.map(e=>e.id)).size,2);}
  const gespeicherte=JSON.parse(fs.readFileSync(path.join(dir,"klasse-heft.json"),"utf8")).eintraege;
  assert.equal(gespeicherte.length,1); assert.equal(gespeicherte[0].id,homework.id);
});
test("Kalendertermine sind im Heft nicht separat aenderbar oder loeschbar",async()=>{
  const id="kalender:"+own.id;
  assert.equal((await post("/api/klasse/lehrer/heft/speichern",{password:PW,id,klasse:"7aM",fach:"Deutsch",text:"Falsch",faellig:"2026-10-09"})).status,409);
  assert.equal((await post("/api/klasse/lehrer/heft/loeschen",{password:PW,id})).status,409);
  assert.equal((await post("/api/klasse/heft/eigen/loeschen",{code:"101",id})).status,200);
  assert.ok(proben(await kid()).some(e=>e.id===id));
});
test("Vergangene Termine: bestehende Sichtbarkeitsfristen auch fuer Kalenderproben",async()=>{
  const es=[{datum:"2026-09-01",klasse:"7aM",fach:"Sport",titel:"Alte Probe"},{datum:"2026-09-25",klasse:"7aM",fach:"Musik",titel:"Letzter Monat"},{datum:"2026-10-06",klasse:"7aM",fach:"Kunst",titel:"Gestern"},{datum:"2027-08-20",klasse:"7aM",fach:"Ethik",titel:"Zukunft"}];
  assert.equal((await post("/api/kalender/import",{eintraege:es,bestaetigt:true},token)).data.anzahl,4);
  const ks=proben(await kid()).map(e=>e.text), ls=proben(await teacher()).map(e=>e.text);
  assert.ok(!ks.includes("Alte Probe")&&!ks.includes("Letzter Monat")); assert.ok(ks.includes("Gestern")&&ks.includes("Zukunft"));
  assert.ok(!ls.includes("Alte Probe")&&ls.includes("Letzter Monat"));
});
test("Kalenderausfall: normale und private Aufgaben bleiben lesbar, sichtbare Warnung",async t=>{
  const all=kalender.store.all; kalender.store.all=async bucket=>{if(bucket==="termine") throw new Error("Test offline");return all(bucket);};
  t.after(()=>{kalender.store.all=all;});
  for(const r of [await kid(),await teacher()]){assert.equal(r.status,200);assert.match(r.data.kalenderFehler,/Probentermine/);assert.ok(r.data.eintraege.some(e=>e.id===homework.id));assert.equal(proben(r).length,0);}
  assert.equal((await kid()).data.eigene.length,1);
});
