"use strict";

/**
 * Informatik 9, Scratch-Aufträge (Modul 5): Was das Prüfprogramm am hochgeladenen Projekt prüft (scratchpruefung.js).
 * Kennung = "<einheit>-<aufgabe>" wie auf der Lernseite (9M/Informatik/<einheit>.html, Modul.makeAuftrag(…, "<aufgabe>")).
 *
 * Eine .sb3-Datei ist ein ZIP-Archiv; darin beschreibt project.json alle Figuren mit ihren Blöcken.
 * scratchProjekt(json) macht daraus eine einfache Baumform:
 *   x.skripte   [{ figur, bloecke: [knoten] }]      knoten = { op, feld: {NAME: Text}, ein: {NAME: Text | knoten}, innen: [[knoten], [knoten]], proc? }
 *   x.variablen ["Punkte", "name"]                  x.alle = alle Knoten (auch Werte-Blöcke)      x.hat(op)
 *   x.figuren   ["Sprite1", "Abby"]                 die Objekte auf der Bühne (ohne die Bühne selbst)
 *   x.text()    das Programm als Text mit den deutschen Blocknamen (für die KI)
 * Eigene Blöcke: Ein Skript, das mit "procedures_definition" beginnt, ist die Definition (Name: bloecke[0].ein.custom_block.proc);
 * ein Aufruf ist ein Knoten "procedures_call" (Name in .proc).
 * Geprüft wird nur, was im Skript „Wenn (Fahne) angeklickt wird“ hängt und was in einem „Definiere“-Block steht –
 * lose herumliegende Blöcke zählen nicht.
 *
 * Eigenständig (nicht von Informatik 8 abhängig). Aus dem Teil ab "Projekt lesen" wird 9M/Informatik/scratch-aufgaben9.js
 * der Website erzeugt (Ersatzweg, wenn der Server nicht erreichbar ist). Deshalb dort kein require und nichts, was es
 * nur in Node gibt.
 */

/* ---------- Projekt lesen ---------- */
function scratchProjekt(json) {
  const p = typeof json === "string" ? JSON.parse(json) : json;
  if (!p || !Array.isArray(p.targets)) throw new Error("kein_projekt");
  const skripte = [], variablen = [], figuren = [];
  for (const t of p.targets) {
    if (!t.isStage) figuren.push(String(t.name));
    Object.values(t.variables || {}).forEach((v) => { if (Array.isArray(v)) variablen.push(String(v[0])); });
    const B = t.blocks || {};
    const istBlock = (id) => typeof id === "string" && B[id] && typeof B[id] === "object" && !Array.isArray(B[id]);
    const wert = (e, tiefe) => {            // Eingang eines Blocks: [Art, Inhalt, Schatten]
      if (!Array.isArray(e)) return "";
      const inhalt = e[1];
      if (typeof inhalt === "string") return istBlock(inhalt) && tiefe < 40 ? knoten(inhalt, tiefe + 1) : "";
      if (Array.isArray(inhalt)) return inhalt[0] === 12 ? { op: "data_variable", feld: { VARIABLE: String(inhalt[1]) }, ein: {}, innen: [] } : String(inhalt[1] == null ? "" : inhalt[1]);
      return "";
    };
    const kette = (id, tiefe) => {
      const aus = [], gesehen = new Set();
      while (istBlock(id) && !gesehen.has(id) && aus.length < 400) { gesehen.add(id); aus.push(knoten(id, tiefe)); id = B[id].next; }
      return aus;
    };
    const knoten = (id, tiefe) => {
      const b = B[id], k = { op: String(b.opcode), feld: {}, ein: {}, innen: [] };
      for (const n of Object.keys(b.fields || {})) k.feld[n] = Array.isArray(b.fields[n]) ? String(b.fields[n][0]) : "";
      for (const n of Object.keys(b.inputs || {})) {
        const e = b.inputs[n];
        if (n === "SUBSTACK" || n === "SUBSTACK2") k.innen[n === "SUBSTACK" ? 0 : 1] = tiefe < 40 ? kette(Array.isArray(e) ? e[1] : null, tiefe + 1) : [];
        else k.ein[n] = wert(e, tiefe);
      }
      if (/^procedures_(call|prototype)$/.test(k.op)) k.proc = String((b.mutation && b.mutation.proccode) || "");
      if (/^control_(if|if_else|repeat|repeat_until|forever)$/.test(k.op)) { k.innen[0] = k.innen[0] || []; if (k.op === "control_if_else") k.innen[1] = k.innen[1] || []; }
      return k;
    };
    for (const id of Object.keys(B)) if (istBlock(id) && B[id].topLevel && !B[id].shadow) skripte.push({ figur: String(t.name), bloecke: kette(id, 0) });
  }
  const x = { skripte, variablen, figuren };
  x.alle = flach([].concat(...skripte.map((s) => s.bloecke)));
  x.hat = (op) => x.alle.some((k) => k.op === op);
  x.text = () => skripte.map((s) => zeilen(s.bloecke, 0).join("\n")).filter(Boolean).slice(0, 14).join("\n\n").split("\n").slice(0, 110).join("\n") || "(Im Projekt sind keine Blöcke.)";
  return x;
}

// alle Knoten in der Reihenfolge, in der sie im Programm stehen: Block, seine Werte-Blöcke, dann das Innere
function flach(bloecke) {
  const aus = [];
  const geh = (k) => { if (!k || typeof k !== "object") return; aus.push(k); Object.keys(k.ein).forEach((n) => geh(k.ein[n])); k.innen.forEach((liste) => (liste || []).forEach(geh)); };
  (bloecke || []).forEach(geh);
  return aus;
}
// steckt in den Werten dieses Blocks (nicht im Inneren einer Klammer) ein Block dieser Art?
function drin(k, op) {
  if (!k || typeof k !== "object") return false;
  return Object.keys(k.ein).some((n) => { const w = k.ein[n]; return w && typeof w === "object" && (w.op === op || drin(w, op)); });
}

/* ---------- Programm als Text (deutsche Blocknamen) ---------- */
const NAMEN = {
  event_whenflagclicked: "Wenn Fahne angeklickt wird", event_whenkeypressed: "Wenn Taste {KEY_OPTION} gedrückt wird", event_whenthisspriteclicked: "Wenn diese Figur angeklickt wird",
  looks_say: "sage {MESSAGE}", looks_sayforsecs: "sage {MESSAGE} für {SECS} Sekunden", looks_think: "denke {MESSAGE}", looks_thinkforsecs: "denke {MESSAGE} für {SECS} Sekunden",
  looks_setsizeto: "setze Größe auf {SIZE}", looks_changesizeby: "ändere Größe um {CHANGE}", looks_show: "zeige dich", looks_hide: "verstecke dich", looks_nextcostume: "wechsle zum nächsten Kostüm", looks_switchcostumeto: "wechsle zu Kostüm {COSTUME}",
  motion_movesteps: "gehe {STEPS}er Schritt", motion_gotoxy: "gehe zu x: {X} y: {Y}", motion_pointindirection: "setze Richtung auf {DIRECTION} Grad", motion_turnright: "drehe dich nach rechts um {DEGREES} Grad", motion_turnleft: "drehe dich nach links um {DEGREES} Grad",
  motion_changexby: "ändere x um {DX}", motion_changeyby: "ändere y um {DY}", motion_setx: "setze x auf {X}", motion_sety: "setze y auf {Y}",
  sensing_askandwait: "frage {QUESTION} und warte", sensing_answer: "Antwort",
  operator_join: "verbinde {STRING1} und {STRING2}", operator_add: "{NUM1} + {NUM2}", operator_subtract: "{NUM1} - {NUM2}", operator_multiply: "{NUM1} * {NUM2}", operator_divide: "{NUM1} / {NUM2}",
  operator_equals: "{OPERAND1} = {OPERAND2}", operator_gt: "{OPERAND1} > {OPERAND2}", operator_lt: "{OPERAND1} < {OPERAND2}", operator_random: "Zufallszahl von {FROM} bis {TO}",
  operator_and: "{OPERAND1} und {OPERAND2}", operator_or: "{OPERAND1} oder {OPERAND2}", operator_not: "nicht {OPERAND}",
  data_setvariableto: "setze {VARIABLE} auf {VALUE}", data_changevariableby: "ändere {VARIABLE} um {VALUE}", data_variable: "{VARIABLE}", data_showvariable: "zeige Variable {VARIABLE}", data_hidevariable: "verstecke Variable {VARIABLE}",
  control_if: "falls {CONDITION}, dann", control_if_else: "falls {CONDITION}, dann", control_repeat_until: "wiederhole bis {CONDITION}", control_repeat: "wiederhole {TIMES} mal", control_forever: "wiederhole fortlaufend", control_wait: "warte {DURATION} Sekunden", control_stop: "stoppe {STOP_OPTION}"
};
function wort(k) {
  if (!k || typeof k !== "object") return "[" + String(k == null ? "" : k).slice(0, 60) + "]";
  if (k.op === "procedures_call" || k.op === "procedures_prototype") return (k.proc || "eigener Block").replace(/%[sb]/g, "[ ]");
  if (k.op === "procedures_definition") return "Definiere " + wort(k.ein.custom_block);
  const muster = NAMEN[k.op];
  if (!muster) { const f = Object.keys(k.feld); return f.length === 1 && !Object.keys(k.ein).length ? "[" + k.feld[f[0]] + "]" : k.op; }
  const text = muster.replace(/\{(\w+)\}/g, (_m, n) => (n in k.feld ? k.feld[n] : n in k.ein ? wort(k.ein[n]) : "[ ]"));
  return /^(operator_|sensing_answer|data_variable)/.test(k.op) ? "(" + text + ")" : text;
}
function zeilen(bloecke, tiefe) {
  const aus = [], ein = "  ".repeat(tiefe);
  for (const k of bloecke || []) {
    aus.push(ein + wort(k));
    if (k.innen.length) { aus.push(...zeilen(k.innen[0], tiefe + 1)); if (k.op === "control_if_else") { aus.push(ein + "sonst"); aus.push(...zeilen(k.innen[1], tiefe + 1)); } }
  }
  return aus;
}

/* ---------- Helfer für die Prüfungen ---------- */
const SAGE = ["looks_say", "looks_sayforsecs", "looks_think", "looks_thinkforsecs"];
const VERGLEICH = ["operator_equals", "operator_gt", "operator_lt"];
const SCHLEIFEN = ["control_repeat", "control_repeat_until", "control_forever"];
const istSage = (k) => SAGE.includes(k.op);
const istFalls = (k) => k.op === "control_if" || k.op === "control_if_else";
const istSchleife = (k) => SCHLEIFEN.includes(k.op);
// die Skripte, die mit der grünen Fahne beginnen (ohne den Hut-Block); das längste zuerst
const fahnen = (x) => x.skripte.filter((s) => s.bloecke.length && s.bloecke[0].op === "event_whenflagclicked").map((s) => s.bloecke.slice(1)).sort((a, b) => flach(b).length - flach(a).length);
// eigene Blöcke: Name und Inhalt jeder Definition
const definitionen = (x) => x.skripte.filter((s) => s.bloecke.length && s.bloecke[0].op === "procedures_definition")
  .map((s) => ({ name: (s.bloecke[0].ein.custom_block && s.bloecke[0].ein.custom_block.proc) || "", innen: s.bloecke.slice(1) }));
// alle Stapel, die wirklich ablaufen: unter der Fahne und in „Definiere“
const stapel = (x) => fahnen(x).concat(definitionen(x).map((d) => d.innen));
const alleKnoten = (x) => flach([].concat(...stapel(x)));
const fahnenKnoten = (x) => flach([].concat(...fahnen(x)));
// bei freien Projekten zählt auch ein anderer Start (Taste, Klick auf die Figur)
const projektKnoten = (x) => flach([].concat(...x.skripte.filter((s) => s.bloecke.length && /^event_when/.test(s.bloecke[0].op)).map((s) => s.bloecke.slice(1)), ...definitionen(x).map((d) => d.innen)));
const ohneFahne = "Dein Programm braucht oben den Block „Wenn (Fahne) angeklickt wird“. Hänge deine Blöcke darunter.";
// kommen die Arten in dieser Reihenfolge vor? Ein Eintrag darf auch eine Liste gleichwertiger Arten oder eine Prüf-Funktion sein
function nacheinander(knotenListe, ...gesucht) {
  let i = 0;
  for (const k of knotenListe) { if (i >= gesucht.length) break; const g = gesucht[i]; if (typeof g === "function" ? g(k) : Array.isArray(g) ? g.includes(k.op) : k.op === g) i++; }
  return i === gesucht.length;
}
const texteVon = (k) => Object.keys(k.ein).map((n) => k.ein[n]).filter((w) => typeof w === "string");
const istZahlText = (s) => typeof s === "string" && s.trim() !== "" && !isNaN(Number(s));
// der Block-Stapel (Liste von Geschwistern), in dem ein passender Block hängt – auch im Inneren einer Klammer; dazu seine Stelle
function stapelMit(bloecke, test) {
  const i = (bloecke || []).findIndex(test);
  if (i >= 0) return { liste: bloecke, i };
  for (const k of bloecke || []) for (const innen of k.innen) { const r = stapelMit(innen, test); if (r) return r; }
  return null;
}
// Anweisungen zählen (Blöcke mit Zacken, auch im Inneren von Klammern; Werte-Blöcke zählen nicht)
const anweisungen = (bloecke) => (bloecke || []).reduce((n, k) => n + 1 + k.innen.reduce((m, l) => m + anweisungen(l), 0), 0);
const sagtVariable = (k) => istSage(k) && (drin(k, "data_variable") || (k.ein.MESSAGE && k.ein.MESSAGE.op === "data_variable"));
const merkeAntwort = (k) => k.op === "data_setvariableto" && !!k.ein.VALUE && k.ein.VALUE.op === "sensing_answer";

/* ---------- kleine Nachrechnung: Was sagt das Programm bei dieser Antwort? ---------- */
// Nur für einfache Programme (Frage, Vergleich, falls/sonst, sage). Alles andere wirft „unklar“ – dann wird nicht geurteilt.
function unklar() { return new Error("unklar"); }
function vergleiche(a, b) {   // wie Scratch: Zahlen als Zahlen, sonst Text ohne Beachtung der Groß- und Kleinschreibung
  const n1 = Number(a), n2 = Number(b), leer = (s) => typeof s === "string" && s.trim() === "";
  if (isNaN(n1) || isNaN(n2) || leer(a) || leer(b)) { const s1 = String(a).toLowerCase(), s2 = String(b).toLowerCase(); return s1 < s2 ? -1 : s1 > s2 ? 1 : 0; }
  return n1 - n2;
}
function wertVon(w, antwort) {
  if (typeof w === "string") return w;
  if (!w || typeof w !== "object") return "";
  const z = (e) => Number(wertVon(e, antwort)) || 0;
  switch (w.op) {
    case "sensing_answer": return antwort;
    case "operator_add": return z(w.ein.NUM1) + z(w.ein.NUM2);
    case "operator_subtract": return z(w.ein.NUM1) - z(w.ein.NUM2);
    case "operator_multiply": return z(w.ein.NUM1) * z(w.ein.NUM2);
    case "operator_join": return String(wertVon(w.ein.STRING1, antwort)) + String(wertVon(w.ein.STRING2, antwort));
    case "operator_equals": return vergleiche(wertVon(w.ein.OPERAND1, antwort), wertVon(w.ein.OPERAND2, antwort)) === 0;
    case "operator_gt": return vergleiche(wertVon(w.ein.OPERAND1, antwort), wertVon(w.ein.OPERAND2, antwort)) > 0;
    case "operator_lt": return vergleiche(wertVon(w.ein.OPERAND1, antwort), wertVon(w.ein.OPERAND2, antwort)) < 0;
    case "operator_and": return wertVon(w.ein.OPERAND1, antwort) === true && wertVon(w.ein.OPERAND2, antwort) === true;
    case "operator_or": return wertVon(w.ein.OPERAND1, antwort) === true || wertVon(w.ein.OPERAND2, antwort) === true;
    case "operator_not": return wertVon(w.ein.OPERAND, antwort) !== true;
    default: throw unklar();
  }
}
function laufe(bloecke, antwort, aus) {
  for (const k of bloecke || []) {
    if (istSage(k)) aus.push(String(wertVon(k.ein.MESSAGE, antwort)));
    else if (k.op === "control_if") { if (wertVon(k.ein.CONDITION, antwort) === true) laufe(k.innen[0], antwort, aus); }
    else if (k.op === "control_if_else") laufe(wertVon(k.ein.CONDITION, antwort) === true ? k.innen[0] : k.innen[1], antwort, aus);
    else if (!/^(sensing_askandwait|looks_|motion_|control_wait)/.test(k.op)) throw unklar();
  }
}
// was sagt die Figur, wenn die Antwort so lautet? (Liste der Sätze) – null, wenn das Programm zu verwickelt ist
function sagtBei(x, antwort) {
  try { const aus = []; fahnen(x).slice(0, 1).forEach((f) => laufe(f, String(antwort), aus)); return aus; } catch (_e) { return null; }
}

/* ---------- Einheit 1: Ein Programm (Sequenz, Ereignis, Wiederholung) ---------- */
function pruefeStart(x) {
  const f = fahnen(x).map(flach), da = f.length > 0;
  const sagt = f.some((s) => s.some(istSage));
  const schleifen = [].concat(...f).filter((k) => k.op === "control_repeat");
  const mitBewegung = schleifen.filter((k) => flach(k.innen[0]).some((i) => /^motion_/.test(i.op)));
  const oft = (k) => typeof k.ein.TIMES !== "string" || Number(k.ein.TIMES) >= 2;
  const gut = mitBewegung.some(oft);
  return [
    { ok: da, text: da ? "Dein Programm startet mit der grünen Fahne." : ohneFahne },
    { ok: sagt, text: sagt ? "Die Figur sagt etwas." : "Unter der Fahne fehlt noch ein Block, mit dem die Figur etwas sagt: „sage …“ (Bereich „Aussehen“)." },
    { ok: gut, text: gut ? "Die Figur bewegt sich mit „wiederhole … mal“ mehrmals." : mitBewegung.length ? "Die Wiederholung läuft nur einmal. Trage in „wiederhole … mal“ eine größere Zahl ein, zum Beispiel 5." : schleifen.length ? "In „wiederhole … mal“ steckt noch kein Bewegungsblock. Ziehe „gehe … er Schritt“ (Bereich „Bewegung“) in die Klammer." : "Es fehlt der Block „wiederhole … mal“ (Bereich „Steuerung“). Setze „gehe … er Schritt“ hinein, damit sich die Figur mehrmals bewegt." }
  ];
}

/* ---------- Einheit 2: Objekte und Eigenschaften ---------- */
function pruefeObjekte(x) {
  const alle = fahnenKnoten(x), da = fahnen(x).length > 0;
  const orte = alle.some((k) => k.op === "motion_gotoxy");
  const gross = alle.some((k) => (k.op === "looks_setsizeto" && String(k.ein.SIZE) !== "100") || (k.op === "looks_changesizeby" && String(k.ein.CHANGE) !== "0"));
  const groesseStehtNoch = alle.some((k) => k.op === "looks_setsizeto" || k.op === "looks_changesizeby");
  const kost = alle.some((k) => k.op === "looks_switchcostumeto" || k.op === "looks_nextcostume");
  const zwei = x.figuren.length >= 2;
  const eigene = new Set(x.skripte.filter((s) => s.bloecke.length && s.bloecke[0].op === "event_whenflagclicked" && s.bloecke.length > 1).map((s) => s.figur));
  const beide = zwei && eigene.size >= 2;
  return [
    { ok: da, text: da ? "Dein Programm startet mit der grünen Fahne." : ohneFahne },
    { ok: zwei, text: zwei ? "Du hast mehr als ein Objekt: " + x.figuren.slice(0, 4).join(", ") + "." : "Es gibt erst ein Objekt. Hole dir ein zweites: Klicke unten rechts auf den Knopf „Figur wählen“ und suche eine Figur aus." },
    { ok: beide, text: beide ? "Beide Figuren haben ein eigenes Skript unter der Fahne." : zwei ? "Nur eine Figur hat ein Skript. Klicke die zweite Figur an und baue auch dort unter „Wenn (Fahne) angeklickt wird“ Blöcke auf." : "Die zweite Figur braucht auch ein Skript – erst muss sie da sein." },
    { ok: gross, text: gross ? "Eine Figur ändert ihre Größe." : groesseStehtNoch ? "Die Größe bleibt gleich. Trage in „setze Größe auf …“ eine andere Zahl als 100 ein, zum Beispiel 200." : "Es fehlt ein Block für die Größe: „setze Größe auf … %“ (Bereich „Aussehen“)." },
    { ok: kost, text: kost ? "Eine Figur wechselt ihr Kostüm." : "Es fehlt ein Kostümwechsel: „wechsle zum nächsten Kostüm“ oder „wechsle zu Kostüm …“ (Bereich „Aussehen“)." },
    { ok: orte, text: orte ? "Eine Figur geht mit „gehe zu x: … y: …“ an eine andere Stelle." : "Es fehlt der Block „gehe zu x: … y: …“ (Bereich „Bewegung“). Er ändert die Position der Figur." }
  ];
}

/* ---------- Einheit 3: Eingabe, Ausgabe, Variable ---------- */
function pruefeEingabeAusgabe(x) {
  const alle = fahnenKnoten(x), da = fahnen(x).length > 0;
  const fragen = alle.filter((k) => k.op === "sensing_askandwait");
  const merkt = alle.filter(merkeAntwort), namen = new Set(merkt.map((k) => k.feld.VARIABLE));
  const sofort = nacheinander(alle, "sensing_askandwait", merkeAntwort, "sensing_askandwait", merkeAntwort);
  const satz = alle.some((k) => istSage(k) && flach([k]).some((i) => i.op === "operator_join" && flach([i]).some((j) => j.op === "data_variable")));
  const zwei = namen.size >= 2;
  return [
    { ok: da, text: da ? "Dein Programm startet mit der grünen Fahne." : ohneFahne },
    { ok: fragen.length >= 2, text: fragen.length >= 2 ? "Die Figur stellt zwei Fragen." : "Die Figur soll zwei Fragen stellen, zum Beispiel nach dem Namen und nach dem Alter. Dafür brauchst du den Block „frage … und warte“ zweimal." },
    { ok: zwei, text: zwei ? "Zwei Eingaben werden in zwei verschiedenen Variablen gespeichert: " + [...namen].slice(0, 3).join(", ") + "." : merkt.length ? "Erst eine Variable bekommt die Antwort. Lege eine zweite Variable an (Bereich „Variablen“, Knopf „Neue Variable“) und setze sie auf „Antwort“." : "Keine Variable bekommt die Antwort. Lege zwei Variablen an und baue „setze … auf Antwort“ ein (der runde Block „Antwort“ kommt aus dem Bereich „Fühlen“)." },
    { ok: zwei && sofort, text: zwei && sofort ? "Jede Antwort wird gleich nach ihrer Frage gespeichert." : zwei ? "Speichere jede Antwort sofort nach ihrer Frage. Sonst steckt in beiden Variablen die zweite Antwort." : "Sobald zwei Variablen die Antworten bekommen, wird auch die Reihenfolge geprüft: frage – setze – frage – setze." },
    { ok: satz, text: satz ? "Die Figur sagt einen Satz mit „verbinde“ und einer Variablen." : "Die Ausgabe fehlt noch: „sage“ mit einem „verbinde“-Block, in dem eine Variable steckt (zum Beispiel verbinde name und alter)." }
  ];
}

/* ---------- Einheit 4: Bedingung und Alternative ---------- */
function pruefeBedingungen(x) {
  const alle = fahnenKnoten(x), da = fahnen(x).length > 0;
  const fragt = alle.some((k) => k.op === "sensing_askandwait"), sonst = alle.filter((k) => k.op === "control_if_else");
  const folge = sonst.length > 0 && nacheinander(alle, "sensing_askandwait", "control_if_else");
  const vergleich = alle.some((k) => istFalls(k) && k.ein.CONDITION && typeof k.ein.CONDITION === "object" && flach([k.ein.CONDITION]).some((v) => VERGLEICH.includes(v.op) && drin(v, "sensing_answer") && texteVon(v).some(istZahlText)));
  const beide = sonst.some((k) => {
    const a = flach(k.innen[0]).filter(istSage), b = flach(k.innen[1]).filter(istSage);
    return a.length > 0 && b.length > 0 && JSON.stringify(a.map((s) => s.ein.MESSAGE)) !== JSON.stringify(b.map((s) => s.ein.MESSAGE));
  });
  // die Grenze: ab 12 Jahren ins Kino
  const [a0, a5, a11, a12, a13, a40] = [0, 5, 11, 12, 13, 40].map((n) => sagtBei(x, n));
  const rechenbar = fragt && !!a11 && !!a12 && !!a13 && !!a0 && !!a5 && !!a40;
  const j = (l) => JSON.stringify(l);
  const grenzeOk = rechenbar && j(a12) === j(a13) && j(a12) === j(a40) && j(a11) === j(a5) && j(a11) === j(a0) && j(a12) !== j(a11);
  const verkehrt = rechenbar && grenzeOk && /(zu jung|leider|nicht|nein)/i.test(a12.join(" ")) && !/(zu jung|leider|nicht|nein)/i.test(a11.join(" "));
  const okGrenze = !rechenbar || (grenzeOk && !verkehrt);
  return [
    { ok: da, text: da ? "Dein Programm startet mit der grünen Fahne." : ohneFahne },
    { ok: fragt, text: fragt ? "Die Figur fragt nach dem Alter." : "Es fehlt der Block „frage … und warte“ (Bereich „Fühlen“). Die Figur soll nach dem Alter fragen." },
    { ok: folge, text: folge ? "Nach der Frage kommt der Block „falls …, dann … sonst“." : sonst.length ? "Der Block „falls …, dann … sonst“ muss unter dem Frage-Block hängen. Vorher gibt es noch keine Antwort." : "Es fehlt der Block „falls …, dann … sonst“ (Bereich „Steuerung“). Er hat zwei Teile: einen für „ja“ und einen für „nein“." },
    { ok: vergleich, text: vergleich ? "Die Bedingung vergleicht die Antwort mit einer Zahl." : "In das sechseckige Feld gehört ein Vergleich (Bereich „Operatoren“) mit dem Block „Antwort“ und einer Zahl, zum Beispiel Antwort > 11." },
    { ok: beide, text: beide ? "Im „dann“-Teil und im „sonst“-Teil sagt die Figur etwas Verschiedenes." : "Beide Teile brauchen einen „sage“-Block mit einem anderen Satz: einen für „Viel Spaß im Film!“ und einen für „Du bist leider zu jung.“ Ein Satz allein unter „falls“ reicht nicht." },
    { ok: okGrenze, text: !rechenbar ? "Die Grenze konnte nicht nachgerechnet werden." : okGrenze ? "Die Grenze stimmt: Ab 12 Jahren verhält sich das Programm anders als mit 11." : verkehrt ? "Die Sätze sind vertauscht: Wer 12 oder älter ist, soll „Viel Spaß im Film!“ hören." : "Die Grenze stimmt nicht. Ab 12 Jahren soll es anders sein als mit 11. Teste 11, 12 und 13 und achte auf das Zeichen im Vergleich." }
  ];
}

/* ---------- Einheit 5: Wiederholung und Schachtelung ---------- */
function pruefeWiederholungen(x) {
  const alle = fahnenKnoten(x), da = fahnen(x).length > 0;
  const bisSchleife = alle.find((k) => k.op === "control_repeat_until"), schleife = bisSchleife || alle.find(istSchleife);
  const innen = schleife ? flach(schleife.innen[0]) : [];
  const fragtDrin = innen.some((k) => k.op === "sensing_askandwait"), fallsDrin = innen.some(istFalls);
  const geheim = schleife && nacheinander(alle, (k) => k.op === "data_setvariableto" && !merkeAntwort(k), (k) => k === schleife);
  const gesetzt = geheim ? alle.filter((k, i) => k.op === "data_setvariableto" && !merkeAntwort(k) && i < alle.indexOf(schleife)) : [];
  const benutzt = gesetzt.some((s) => flach([schleife.ein.CONDITION].concat(schleife.innen[0])).some((k) => k.op === "data_variable" && k.feld.VARIABLE === s.feld.VARIABLE));
  const ohneSchleife = "Zuerst braucht das Programm die Wiederholung „wiederhole bis …“ (Bereich „Steuerung“).";
  return [
    { ok: da, text: da ? "Dein Programm startet mit der grünen Fahne." : ohneFahne },
    { ok: !!bisSchleife, text: bisSchleife ? "Das Programm benutzt „wiederhole bis …“." : schleife ? "Das ist eine andere Wiederholung. Hier passt „wiederhole bis …“: Die Figur soll weiterfragen, bis die Zahl stimmt." : ohneSchleife },
    { ok: fragtDrin, text: fragtDrin ? "In der Wiederholung wird gefragt." : schleife ? "In der Wiederholung fehlt „frage … und warte“. Ohne neue Frage ändert sich die Antwort nie – das Programm hört nicht auf." : ohneSchleife },
    { ok: fallsDrin, text: fallsDrin ? "In der Wiederholung steht ein „falls“ (Schachtelung)." : schleife ? "In die Wiederholung gehört ein „falls …, dann“: Ist die Antwort größer als die Geheimzahl, sagt die Figur „Zu groß!“, sonst „Zu klein!“." : ohneSchleife },
    { ok: !!benutzt, text: benutzt ? "Die Geheimzahl steckt in der Variablen „" + gesetzt[0].feld.VARIABLE + "“ und wird in der Wiederholung benutzt." : geheim ? "Die Variable mit der Geheimzahl kommt in der Wiederholung nicht vor. Vergleiche in „wiederhole bis“ die Antwort mit dieser Variablen." : "Lege eine Variable für die Geheimzahl an und setze sie vor der Wiederholung: „setze geheimzahl auf …“. Vergleiche in „wiederhole bis“ die Antwort mit dieser Variablen." }
  ];
}

/* ---------- Einheit 6: Eigene Blöcke ---------- */
function pruefeEigeneBloecke(x) {
  const da = fahnen(x).length > 0, defs = definitionen(x);
  const gross = defs.filter((d) => anweisungen(d.innen) >= 2);
  const aufrufe = (name) => flach([].concat(...fahnen(x))).filter((k) => k.op === "procedures_call" && k.proc === name).length;
  const meist = defs.reduce((m, d) => Math.max(m, aufrufe(d.name)), 0);
  const name = (defs.find((d) => aufrufe(d.name) === meist) || defs[0] || { name: "" }).name.replace(/%[sb]/g, "").trim();
  return [
    { ok: da, text: da ? "Dein Programm startet mit der grünen Fahne." : ohneFahne },
    { ok: gross.length > 0, text: gross.length ? "Der eigene Block „" + gross[0].name + "“ fasst mehrere Blöcke zusammen." : defs.length ? "Unter „Definiere " + (defs[0].name || "…") + "“ hängt zu wenig. In den eigenen Block gehören mindestens zwei Blöcke (zum Beispiel hoch, warten, runter)." : "Es fehlt ein eigener Block. Gehe in den Bereich „Meine Blöcke“, klicke auf „Neuer Block“ und gib ihm einen Namen. Unter den Block „Definiere …“ hängst du die Blöcke, die er zusammenfassen soll." },
    { ok: meist >= 2, text: meist >= 2 ? "Der eigene Block „" + name + "“ wird mindestens zweimal benutzt." : meist === 1 ? "Der eigene Block „" + name + "“ wird erst einmal benutzt. Ziehe ihn noch ein zweites Mal unter die Fahne – dafür sind eigene Blöcke da." : defs.length ? "Der eigene Block „" + name + "“ ist gebaut, steht aber nirgends unter der Fahne. Ziehe ihn aus „Meine Blöcke“ in dein Programm." : "Benutze den eigenen Block mindestens zweimal unter der Fahne." }
  ];
}

/* ---------- Einheit 7: Fehlersuche ---------- */
function pruefeFehlersuche(x) {
  const alle = fahnenKnoten(x), da = fahnen(x).length > 0;
  const aender = alle.find((k) => k.op === "data_changevariableby");
  const zaehlerName = aender ? aender.feld.VARIABLE : ((alle.find((k) => k.op === "data_setvariableto" && /punkt/i.test(k.feld.VARIABLE)) || { feld: {} }).feld.VARIABLE || "Punkte");
  const nullSetzen = (k) => k.op === "data_setvariableto" && k.feld.VARIABLE === zaehlerName;
  const schleife = alle.find((k) => k.op === "control_repeat" || k.op === "control_repeat_until");
  const innen = schleife ? flach(schleife.innen[0]) : [];
  let ort = null;
  if (schleife) for (const f of fahnen(x)) { ort = ort || stapelMit(f, (k) => k === schleife); }
  const istNull = (v) => typeof v === "string" && v.trim() !== "" && Number(v) === 0;
  const vorher = !!ort && ort.liste.slice(0, ort.i).some((k) => nullSetzen(k) && istNull(k.ein.VALUE));
  const inSchleife = innen.some(nullSetzen);
  const keineSchleife = "Das Programm braucht die Wiederholung (wiederhole 3 mal), in der die Fragen gestellt werden.";
  const vergleiche = innen.filter((k) => istFalls(k) && k.ein.CONDITION && typeof k.ein.CONDITION === "object");
  const gleichAntwort = vergleiche.some((k) => flach([k.ein.CONDITION]).some((v) => v.op === "operator_equals" && drin(v, "sensing_answer")));
  const andereZeichen = vergleiche.some((k) => flach([k.ein.CONDITION]).some((v) => (v.op === "operator_gt" || v.op === "operator_lt") && drin(v, "sensing_answer")));
  const imDann = vergleiche.some((k) => flach(k.innen[0]).some((i) => i.op === "data_changevariableby" && i.feld.VARIABLE === zaehlerName));
  const inSchleifeErhoeht = innen.some((k) => k.op === "data_changevariableby" && k.feld.VARIABLE === zaehlerName);
  const zaehlerOk = vorher && !inSchleife;
  return [
    { ok: da, text: da ? "Dein Programm startet mit der grünen Fahne." : ohneFahne },
    { ok: zaehlerOk, text: zaehlerOk ? "Der Zähler „" + zaehlerName + "“ wird vor der Wiederholung auf 0 gestellt." : !schleife ? keineSchleife : inSchleife ? "In der Wiederholung steht „setze " + zaehlerName + " auf …“. Dadurch beginnt jede Runde wieder bei 0 und die Punkte gehen verloren. Setze den Block vor die Wiederholung." : "Vor der Wiederholung fehlt „setze " + zaehlerName + " auf 0“. Ohne Startwert zählt das Programm von einem alten Stand weiter." },
    { ok: gleichAntwort, text: gleichAntwort ? "Das „falls“ prüft mit „=“, ob die Antwort stimmt." : !schleife ? keineSchleife : andereZeichen ? "Das „falls“ vergleicht mit „>“ oder „<“. Ob die Antwort stimmt, prüft man mit dem Zeichen „=“: Antwort gleich der Summe." : "In der Wiederholung fehlt ein „falls …“, das mit „=“ prüft, ob die Antwort richtig ist." },
    { ok: imDann, text: imDann ? "Die Punkte werden in der Wiederholung erhöht, und zwar nur bei richtiger Antwort." : !schleife ? keineSchleife : inSchleifeErhoeht ? "„ändere " + zaehlerName + " um 1“ steht in der Wiederholung, aber nicht im „dann“-Teil des „falls“. So gäbe es Punkte auch für falsche Antworten." : aender ? "„ändere " + zaehlerName + " um 1“ steht außerhalb der Wiederholung. Ziehe den Block in den „dann“-Teil des „falls“, damit jede richtige Antwort zählt." : "Es fehlt der Block „ändere " + zaehlerName + " um 1“ im „dann“-Teil des „falls“." }
  ];
}

/* ---------- Einheit 8: eigenes Projekt ---------- */
function pruefeProjekt(x) {
  const alle = projektKnoten(x), da = fahnen(x).length > 0;
  const fragt = alle.some((k) => k.op === "sensing_askandwait"), sagt = alle.some(istSage);
  const merkt = alle.some((k) => k.op === "data_setvariableto" || k.op === "data_changevariableby");
  const wenn = alle.some((k) => istFalls(k) && k.ein.CONDITION && typeof k.ein.CONDITION === "object");
  const schleife = alle.some(istSchleife);
  const defs = definitionen(x), benutzt = defs.some((d) => alleKnoten(x).some((k) => k.op === "procedures_call" && k.proc === d.name));
  return [
    { ok: da, text: da ? "Objekt: Eine Figur hat ein Skript unter „Wenn (Fahne) angeklickt wird“." : "Objekt: " + ohneFahne },
    { ok: fragt, text: fragt ? "Eingabe: Das Programm stellt eine Frage (frage … und warte)." : "Eingabe fehlt: Baue mindestens einen Block „frage … und warte“ ein." },
    { ok: sagt, text: sagt ? "Ausgabe: Die Figur sagt etwas (sage …)." : "Ausgabe fehlt: Die Figur soll etwas sagen. Benutze den Block „sage …“." },
    { ok: merkt, text: merkt ? "Variable: Dein Programm merkt sich etwas (setze … oder ändere …)." : "Variable fehlt: Lege eine Variable an und benutze „setze … auf …“ oder „ändere … um …“." },
    { ok: wenn, text: wenn ? "Bedingung: Dein Programm entscheidet mit „falls“." : "Bedingung fehlt: Baue einen Block „falls …, dann“ mit einer Bedingung ein." },
    { ok: schleife, text: schleife ? "Wiederholung: Dein Programm wiederholt etwas." : "Wiederholung fehlt: Benutze „wiederhole … mal“, „wiederhole bis …“ oder „wiederhole fortlaufend“." },
    { ok: true, zusatz: true, text: benutzt ? "Zusatz geschafft: Du hast einen eigenen Block gebaut und benutzt." : "Zusatz (freiwillig): Ein eigener Block („Meine Blöcke“, „Neuer Block“) macht dein Programm übersichtlicher." }
  ];
}

const AUFGABEN = {
  "scratch-start-auf1": {
    titel: "Begrüßung",
    auftrag: "Ein erstes Programm in Scratch: Wenn die grüne Fahne angeklickt wird, sagt die Figur Hallo, geht mit einer Wiederholung („wiederhole … mal“) ein Stück und sagt am Ende „Fertig!“ (Sequenz, Ereignis, Wiederholung).",
    pruefe: pruefeStart
  },
  "objekte-auf1": {
    titel: "Zwei Figuren",
    auftrag: "Objekte und Eigenschaften: Das Kind fügt eine zweite Figur hinzu. Die erste Figur wird größer, die zweite wechselt das Kostüm; mindestens eine Figur geht mit „gehe zu x: … y: …“ an eine andere Stelle. Beide Figuren haben ein eigenes Skript unter der Fahne.",
    pruefe: pruefeObjekte
  },
  "eingabe-ausgabe-auf1": {
    titel: "Steckbrief",
    auftrag: "Eingabe, Ausgabe und Variable: Die Figur fragt nach Name und Alter, speichert jede Antwort in einer eigenen Variablen und gibt mit „sage“ und „verbinde“ einen Satz aus, in dem beide Variablen vorkommen.",
    pruefe: pruefeEingabeAusgabe
  },
  "bedingungen-auf1": {
    titel: "Kino-Kasse",
    auftrag: "Bedingung und Alternative: Die Figur fragt nach dem Alter. Ab 12 Jahren sagt sie „Viel Spaß im Film!“, sonst „Du bist leider zu jung.“ Mit „falls … dann … sonst“ und einem Vergleich der Antwort mit einer Zahl.",
    pruefe: pruefeBedingungen
  },
  "wiederholungen-auf1": {
    titel: "Zahlenraten",
    auftrag: "Wiederholung und Schachtelung: Die Figur merkt sich eine Geheimzahl in einer Variablen, fragt nach einem Tipp und wiederholt, bis der Tipp stimmt. In der Wiederholung steht ein „falls“ (Zu groß! oder Zu klein!) und die Frage wird neu gestellt. Am Ende sagt sie „Richtig!“.",
    pruefe: pruefeWiederholungen
  },
  "eigene-bloecke-auf1": {
    titel: "Springen",
    auftrag: "Eigene Blöcke (Teilmethoden): Das Kind baut mit „Neuer Block“ den Block „springe“ (hoch, warten, runter) und benutzt ihn unter der Fahne mindestens zweimal, dazwischen geht die Figur ein Stück.",
    pruefe: pruefeEigeneBloecke
  },
  "fehlersuche-auf1": {
    titel: "Fehler im Punkte-Quiz",
    auftrag: "Fehlersuche: Das Kind repariert ein Punkte-Quiz mit drei Rechenfragen in einer Wiederholung. Es enthält drei Fehler: Der Zähler wird in der Schleife immer wieder auf 0 gesetzt, der Vergleich nutzt das falsche Zeichen, und „ändere Punkte um 1“ steht an der falschen Stelle. Verrate nicht, wo die Fehler genau sind.",
    pruefe: pruefeFehlersuche
  },
  "scratch-projekt-auf1": {
    titel: "Mein Scratch-Projekt",
    auftrag: "Eigenes Projekt (zum Beispiel ein Spiel oder Quiz). Pflicht: eine Figur mit Skript an der Fahne, eine Eingabe, eine Ausgabe, eine Variable, eine Bedingung, eine Wiederholung. Ein eigener Block ist ein freiwilliger Zusatz. Gib zusätzlich eine kurze, freundliche Rückmeldung zur Idee des Projekts.",
    pruefe: pruefeProjekt
  }
};

module.exports = { scratchProjekt, AUFGABEN };
