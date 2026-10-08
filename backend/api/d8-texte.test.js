"use strict";

// Deutsch 8: Aufsatzeditor im Lernmodus (d7-texte.js mit stufe: 8) – Entwurf sichern, abgeben, Schreibcoach mit Schwerpunkt
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const { registerD7TexteRoutes } = require("./d7-texte");

const PW = "Nur-ein-Test-4711";
const kindZumCode = async (code) => ({ 801: { code: "801", klasse: "8aM", zug: "8M" }, 802: { code: "802", klasse: "8b", zug: "8R", lrs: true }, "000": { code: "000", klasse: "Lehrkraft", lehrer: true } })[code] || null;
const TEXT = "Ich bin dafür, dass die Pause länger wird. Wer sich bewegt, kann danach besser lernen. Das merke ich jeden Tag im Sportunterricht.";
const auftrag = (extra) => ({ modul: "schr-04", aufgabe: "aufsatz", titel: "Längere Pausen?", auftrag: "Nimm Stellung: Sollen die Pausen länger werden?", ...extra });

async function mitServer(askAnthropic, lauf, stufe = 8) {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "d8-texte-"));
  const app = express();
  app.use(express.json());
  registerD7TexteRoutes(app, { dataDir, stufe, teacherPassword: PW, kindZumCode, askAnthropic });
  const server = await new Promise((resolve) => { const s = app.listen(0, () => resolve(s)); });
  const post = (route, body) => fetch(`http://127.0.0.1:${server.address().port}/api/d${stufe}/` + route, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
    .then(async (r) => ({ status: r.status, data: await r.json().catch(() => null) }));
  try { await lauf({ post, datei: path.join(dataDir, "d" + stufe + "-texte.json") }); }
  finally { await new Promise((resolve) => server.close(resolve)); fs.rmSync(dataDir, { recursive: true, force: true }); }
}
const ki = (merke) => async (system, user) => {
  if (merke) merke.push({ system, user: JSON.parse(user) });
  return JSON.stringify({ gelungen: "Deine Meinung ist klar.", naechstes: "Ein Beispiel fehlt.", stelle: "besser lernen", tipp: "Woran merkst du das?", checkliste: [true] });
};

test("Entwurf: wird mit der Planung gesichert, überschreibt keine Fassung und kommt mit „meine“ zurück", async () => {
  await mitServer(ki(), async ({ post, datei }) => {
    assert.equal((await post("texte/entwurf", auftrag({ text: "x" }))).status, 401, "ohne Code wird nichts gespeichert");
    assert.equal((await post("texte/entwurf", auftrag({ code: "000", text: "x" }))).status, 401, "der Lehrercode speichert nichts");
    assert.equal((await post("texte/entwurf", auftrag({ code: "801", modul: "Böse Kennung", text: "x" }))).status, 400);
    const e = await post("texte/entwurf", auftrag({ code: "801", text: "Ich bin dafür,\r\n dass", plan: { these: "längere Pausen", "arg-1": "Bewegung", "Nicht Erlaubt": "x", leer: "  " } }));
    assert.equal(e.status, 200); assert.ok(e.data.zeit);
    let m = (await post("texte/meine", { code: "801", modul: "schr-04", aufgabe: "aufsatz" })).data;
    assert.equal(m.entwurf.text, "Ich bin dafür,\n dass");
    assert.deepEqual(m.entwurf.plan, { these: "längere Pausen", "arg-1": "Bewegung" });
    assert.deepEqual(m.fassungen, [], "ein Entwurf ist keine Fassung");
    // Rückmeldung holen: erste Fassung; danach weiter am Entwurf arbeiten – die Fassung bleibt
    assert.equal((await post("schreiben/feedback", auftrag({ code: "801", text: TEXT, kriterien: ["Meinung genannt"] }))).data.fassung, 1);
    await post("texte/entwurf", auftrag({ code: "801", text: TEXT + " Außerdem" }));
    m = (await post("texte/meine", { code: "801", modul: "schr-04", aufgabe: "aufsatz" })).data;
    assert.equal(m.fassungen.length, 1); assert.equal(m.fassungen[0].text, TEXT);
    assert.equal(m.entwurf.text, TEXT + " Außerdem");
    assert.equal(JSON.parse(fs.readFileSync(datei, "utf8")).eintraege.length, 1);
    // ein anderes Kind sieht ihn nicht
    assert.equal((await post("texte/meine", { code: "802", modul: "schr-04", aufgabe: "aufsatz" })).data.entwurf, undefined);
  });
});

test("Abgeben: legt eine Fassung für die Lehrkraft ab; noch einmal abgeben behält die frühere Fassung", async () => {
  await mitServer(ki(), async ({ post }) => {
    assert.equal((await post("texte/abgeben", auftrag({ text: TEXT }))).status, 401);
    assert.equal((await post("texte/abgeben", auftrag({ code: "801", text: "Zu kurz." }))).status, 400);
    const a = await post("texte/abgeben", auftrag({ code: "801", text: TEXT, plan: { these: "längere Pausen" }, planNamen: { these: "Meine These", "Böse Kennung": "x", leer: "" } }));
    assert.equal(a.status, 200); assert.equal(a.data.fassung, 1);
    // derselbe Text: keine neue Fassung
    assert.equal((await post("texte/abgeben", auftrag({ code: "801", text: TEXT }))).data.fassung, 1);
    const b = await post("texte/abgeben", auftrag({ code: "801", text: TEXT + " Deshalb sollten wir es ausprobieren." }));
    assert.equal(b.data.fassung, 2);
    const m = (await post("texte/meine", { code: "801", modul: "schr-04", aufgabe: "aufsatz" })).data;
    assert.deepEqual(m.fassungen.map((f) => f.nr), [1, 2]);
    assert.equal(m.fassungen[0].text, TEXT, "die erste Abgabe bleibt unverändert");
    assert.ok(m.fassungen[0].abgegeben && m.fassungen[1].abgegeben);
    assert.equal(m.abgegeben.nr, 2);
    // Lehrkraft sieht Abgabe und Planung
    const l = (await post("lehrer/texte", { password: PW, klasse: "8aM" })).data;
    assert.equal(l.eintraege.length, 1);
    assert.equal(l.eintraege[0].abgegeben.nr, 2);
    assert.deepEqual(l.eintraege[0].planNamen, { these: "Meine These" }, "Beschriftungen der Planungsfelder bleiben für die Lehrkraft erhalten");
    assert.equal(l.eintraege[0].entwurf.text, TEXT + " Deshalb sollten wir es ausprobieren.");
    assert.equal((await post("lehrer/texte", { password: "falsch", klasse: "8aM" })).status, 401);
  });
});

test("Schreibcoach: Schwerpunkt und Planung gehen an die KI, sie schreibt keinen Text; Notenschutz nur als Regel", async () => {
  const gesehen = [];
  await mitServer(ki(gesehen), async ({ post }) => {
    const r = (await post("schreiben/feedback", auftrag({ code: "801", zug: "M", text: TEXT, kriterien: ["Meinung genannt"], fokus: "belege", plan: { these: "längere Pausen", "arg-1": "Bewegung" } }))).data;
    assert.equal(r.quelle, "ki"); assert.deepEqual(r.checkliste, [{ text: "Meinung genannt", ok: true }]);
    assert.match(gesehen[0].user.schwerpunkt, /^Belege:/);
    assert.equal(gesehen[0].user.planung, "längere Pausen | Bewegung");
    assert.match(gesehen[0].user.klasse, /^M8/);
    assert.match(gesehen[0].system, /8\. Klasse/);
    assert.match(gesehen[0].system, /niemals einen Satz, einen Absatz/);
    assert.ok(!/Notenschutz|LRS/.test(gesehen[0].system));
    await post("schreiben/feedback", auftrag({ code: "802", zug: "R", text: TEXT, fokus: "erfunden" }));
    assert.equal(gesehen[1].user.schwerpunkt, undefined, "unbekannter Schwerpunkt entfällt");
    assert.ok(/Erwähne LRS nicht/.test(gesehen[1].system));
    assert.ok(!/lrs|notenschutz/i.test(JSON.stringify(r)));
  });
});

test("Deutsch 7: Der Auftrag an die KI bleibt unverändert (kein Schwerpunkt, keine Planung)", async () => {
  const gesehen = [];
  const k7 = { modul: "erz-06", aufgabe: "werkstatt", titel: "Meine Erzählung", auftrag: "Schreibe eine spannende Erzählung.", text: TEXT, fokus: "belege", plan: { these: "x" } };
  await mitServer(ki(gesehen), async ({ post }) => {
    await post("schreiben/feedback", k7);
    assert.equal(gesehen[0].user.schwerpunkt, undefined);
    assert.equal(gesehen[0].user.planung, undefined);
    assert.ok(!/schwerpunkt|niemals einen Satz/.test(gesehen[0].system));
    assert.match(gesehen[0].system, /7\. Klasse/);
  }, 7);
});
