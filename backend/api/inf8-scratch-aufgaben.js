"use strict";

/**
 * Informatik 8, Scratch-Aufträge (Modul 5): Was das Prüfprogramm am hochgeladenen Projekt prüft (scratchpruefung.js).
 * Kennung = "<einheit>-<aufgabe>" wie auf der Lernseite (8M/Informatik/<einheit>.html, Modul.makeAuftrag(…, "<aufgabe>")).
 *
 * Eine .sb3-Datei ist ein ZIP-Archiv; darin beschreibt project.json alle Figuren mit ihren Blöcken.
 * scratchProjekt(json) macht daraus eine einfache Baumform:
 *   x.skripte   [{ figur, bloecke: [knoten] }]      knoten = { op, feld: {NAME: Text}, ein: {NAME: Text | knoten}, innen: [[knoten], [knoten]] }
 *   x.variablen ["name", "alter"]                   x.alle = alle Knoten (auch Werte-Blöcke)      x.hat(op)
 *   x.figuren   ["Sprite1", "Ball"]                 die Objekte auf der Bühne (ohne die Bühne selbst)
 *   x.text()    das Programm als Text mit den deutschen Blocknamen (für die KI)
 * Geprüft wird nur, was im Skript „Wenn (Fahne) angeklickt wird“ hängt – lose herumliegende Blöcke zählen nicht.
 *
 * Aus dieser Datei wird 8M/Informatik/scratch-aufgaben.js der Website erzeugt (Ersatzweg, wenn der Server nicht
 * erreichbar ist). Deshalb hier kein require und nichts, was es nur in Node gibt.
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
      if (/^control_(if|if_else|repeat|repeat_until|forever)$/.test(k.op)) { k.innen[0] = k.innen[0] || []; if (k.op === "control_if_else") k.innen[1] = k.innen[1] || []; }
      return k;
    };
    for (const id of Object.keys(B)) if (istBlock(id) && B[id].topLevel && !B[id].shadow) skripte.push({ figur: String(t.name), bloecke: kette(id, 0) });
  }
  const x = { skripte, variablen, figuren };
  x.alle = flach([].concat(...skripte.map((s) => s.bloecke)));
  x.hat = (op) => x.alle.some((k) => k.op === op);
  x.text = () => skripte.map((s) => zeilen(s.bloecke, 0).join("\n")).filter(Boolean).slice(0, 12).join("\n\n").split("\n").slice(0, 90).join("\n") || "(Im Projekt sind keine Blöcke.)";
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
  looks_setsizeto: "setze Größe auf {SIZE}", looks_changesizeby: "ändere Größe um {CHANGE}", looks_show: "zeige dich", looks_hide: "verstecke dich", looks_nextcostume: "wechsle zum nächsten Kostüm",
  motion_movesteps: "gehe {STEPS}er Schritt", motion_gotoxy: "gehe zu x: {X} y: {Y}", motion_pointindirection: "setze Richtung auf {DIRECTION} Grad", motion_turnright: "drehe dich nach rechts um {DEGREES} Grad", motion_turnleft: "drehe dich nach links um {DEGREES} Grad",
  sensing_askandwait: "frage {QUESTION} und warte", sensing_answer: "Antwort",
  operator_join: "verbinde {STRING1} und {STRING2}", operator_add: "{NUM1} + {NUM2}", operator_subtract: "{NUM1} - {NUM2}", operator_multiply: "{NUM1} * {NUM2}", operator_divide: "{NUM1} / {NUM2}",
  operator_equals: "{OPERAND1} = {OPERAND2}", operator_gt: "{OPERAND1} > {OPERAND2}", operator_lt: "{OPERAND1} < {OPERAND2}", operator_random: "Zufallszahl von {FROM} bis {TO}",
  operator_and: "{OPERAND1} und {OPERAND2}", operator_or: "{OPERAND1} oder {OPERAND2}", operator_not: "nicht {OPERAND}",
  data_setvariableto: "setze {VARIABLE} auf {VALUE}", data_changevariableby: "ändere {VARIABLE} um {VALUE}", data_variable: "{VARIABLE}", data_showvariable: "zeige Variable {VARIABLE}", data_hidevariable: "verstecke Variable {VARIABLE}",
  control_if: "falls {CONDITION}, dann", control_if_else: "falls {CONDITION}, dann", control_repeat_until: "wiederhole bis {CONDITION}", control_repeat: "wiederhole {TIMES} mal", control_forever: "wiederhole fortlaufend", control_wait: "warte {DURATION} Sekunden", control_stop: "stoppe {STOP_OPTION}"
};
function wort(k) {
  if (!k || typeof k !== "object") return "[" + String(k == null ? "" : k).slice(0, 60) + "]";
  const muster = NAMEN[k.op] || k.op;
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
const istSage = (k) => SAGE.includes(k.op);
// die Skripte, die mit der grünen Fahne beginnen (ohne den Hut-Block); das längste zuerst
const fahnen = (x) => x.skripte.filter((s) => s.bloecke.length && s.bloecke[0].op === "event_whenflagclicked").map((s) => s.bloecke.slice(1)).sort((a, b) => flach(b).length - flach(a).length);
const fahnenKnoten = (x) => flach([].concat(...fahnen(x)));
const ohneFahne = "Dein Programm braucht oben den Block „Wenn (Fahne) angeklickt wird“. Hänge deine Blöcke darunter.";
// kommen die Arten in dieser Reihenfolge vor? Ein Eintrag darf auch eine Liste gleichwertiger Arten oder eine Prüf-Funktion sein
function nacheinander(knotenListe, ...gesucht) {
  let i = 0;
  for (const k of knotenListe) { if (i >= gesucht.length) break; const g = gesucht[i]; if (typeof g === "function" ? g(k) : Array.isArray(g) ? g.includes(k.op) : k.op === g) i++; }
  return i === gesucht.length;
}
const eigeneVariablen = (x) => x.variablen.filter((n) => !/^(meine variable|my variable)$/i.test(n));
const sagtAntwort = (k) => istSage(k) && (drin(k, "sensing_answer") || (k.ein.MESSAGE && k.ein.MESSAGE.op === "sensing_answer"));
const sagtVariable = (k) => istSage(k) && (drin(k, "data_variable") || (k.ein.MESSAGE && k.ein.MESSAGE.op === "data_variable"));
const texteVon = (k) => Object.keys(k.ein).map((n) => k.ein[n]).filter((w) => typeof w === "string");
// der Block-Stapel (Liste von Geschwistern), in dem ein passender Block hängt – auch im Inneren einer Klammer; dazu seine Stelle
function stapelMit(bloecke, test) {
  const i = (bloecke || []).findIndex(test);
  if (i >= 0) return { liste: bloecke, i };
  for (const k of bloecke || []) for (const innen of k.innen) { const r = stapelMit(innen, test); if (r) return r; }
  return null;
}
// was im selben Stapel unter dem passenden Block hängt (über alle Fahnen-Skripte gesucht), als flache Liste
const danach = (x, test) => { for (const f of fahnen(x)) { const r = stapelMit(f, test); if (r) return flach(r.liste.slice(r.i + 1)); } return []; };
const VORGABE = /^(apfel|banane|apple|banana|hallo!|hello!|hmm\.\.\.)$/i;   // Texte, die Scratch selbst in neue Blöcke schreibt

/* ---------- Einheit 1: Wieder da – Scratch ---------- */
function pruefeStart(x) {
  // jedes Fahnen-Skript zählt: Wer beim Ausprobieren ein zweites Skript gebaut hat, fällt deshalb nicht durch
  const f = fahnen(x).map(flach), da = f.length > 0, bewegt = (k) => /^motion_/.test(k.op);
  const sagt = f.some((s) => s.some(istSage)), geht = f.some((s) => s.some(bewegt));
  const folge = f.some((s) => nacheinander(s, istSage, bewegt, istSage));
  return [
    { ok: da, text: da ? "Dein Programm startet mit der grünen Fahne." : ohneFahne },
    { ok: sagt, text: sagt ? "Die Figur sagt etwas." : "Unter der Fahne fehlt noch ein Block, mit dem die Figur etwas sagt (Bereich „Aussehen“)." },
    { ok: geht, text: geht ? "Die Figur bewegt sich." : "Unter der Fahne fehlt noch ein Block, mit dem sich die Figur bewegt (Bereich „Bewegung“)." },
    { ok: folge, text: folge ? "Die Reihenfolge stimmt: sagen – bewegen – sagen." : "Die Reihenfolge soll sein: erst etwas sagen, dann bewegen, dann noch einmal etwas sagen." }
  ];
}

/* ---------- Einheit 2: Objekte und Eigenschaften ---------- */
function pruefeObjekte(x) {
  const alle = fahnenKnoten(x), da = fahnen(x).length > 0;
  const ort = alle.some((k) => k.op === "motion_gotoxy"), gross = alle.filter((k) => k.op === "looks_setsizeto"), dreh = alle.filter((k) => k.op === "motion_pointindirection");
  const andereGroesse = gross.some((k) => String(k.ein.SIZE) !== "100"), andereRichtung = dreh.some((k) => String(k.ein.DIRECTION) !== "90");
  const zwei = x.figuren.length >= 2;
  return [
    { ok: da, text: da ? "Dein Programm startet mit der grünen Fahne." : ohneFahne },
    { ok: ort, text: ort ? "Der Block „gehe zu x: … y: …“ legt die Position fest." : "Es fehlt der Block „gehe zu x: … y: …“. Er ändert die Eigenschaften x und y." },
    { ok: andereGroesse, text: andereGroesse ? "Der Block „setze Größe auf …“ ändert die Größe." : gross.length ? "Die Größe steht noch auf 100. Trage eine andere Zahl ein." : "Es fehlt der Block „setze Größe auf …“ (Bereich „Aussehen“)." },
    { ok: andereRichtung, text: andereRichtung ? "Der Block „setze Richtung auf … Grad“ ändert die Richtung." : dreh.length ? "Die Richtung steht noch auf 90 Grad. Trage eine andere Zahl ein, zum Beispiel 180." : "Es fehlt der Block „setze Richtung auf … Grad“ (Bereich „Bewegung“)." },
    { ok: zwei, text: zwei ? "Du hast ein zweites Objekt erstellt: " + x.figuren.slice(1, 4).join(", ") + "." : "Erstelle ein zweites Objekt: Klicke unten rechts auf den runden Knopf „Figur wählen“ und suche dir eine Figur aus." }
  ];
}

/* ---------- Einheit 3: Eingabe ---------- */
function pruefeEingabe(x) {
  const f = fahnen(x), alle = fahnenKnoten(x), da = f.length > 0;
  const fragt = alle.some((k) => k.op === "sensing_askandwait"), benutzt = alle.some(sagtAntwort);
  const folge = nacheinander(alle, "sensing_askandwait", sagtAntwort);
  return [
    { ok: da, text: da ? "Dein Programm startet mit der grünen Fahne." : ohneFahne },
    { ok: fragt, text: fragt ? "Die Figur stellt eine Frage und wartet auf die Eingabe." : "Es fehlt der Block „frage … und warte“ (Bereich „Fühlen“)." },
    { ok: benutzt, text: benutzt ? "Der Block „Antwort“ steckt in einem „sage“-Block." : "Die Figur soll die Eingabe wiedergeben: Ziehe den runden Block „Antwort“ in das Feld eines „sage“-Blocks." },
    { ok: folge, text: folge ? "Erst wird gefragt, dann geantwortet – die Reihenfolge stimmt." : "Der „sage“-Block mit der Antwort muss unter dem Frage-Block hängen. Vorher gibt es noch keine Antwort." }
  ];
}

/* ---------- Einheit 4: Ausgabe ---------- */
function pruefeAusgabe(x) {
  const alle = fahnenKnoten(x), da = fahnen(x).length > 0;
  const fragt = alle.some((k) => k.op === "sensing_askandwait");
  const verbinder = alle.filter((k) => k.op === "operator_join" && drin(k, "sensing_answer"));
  const sagtSatz = (k) => istSage(k) && drin(k, "operator_join") && flach([k]).some((i) => verbinder.includes(i));
  const inSage = alle.some(sagtSatz), folge = nacheinander(alle, "sensing_askandwait", sagtSatz);
  // Die Vorgabe „Apfel “ und „Banane“ ist kein eigener Text
  const eigen = (s) => s.trim() !== "" && !VORGABE.test(s.trim());
  const mitText = verbinder.find((k) => texteVon(k).some(eigen)), vorgabe = verbinder.some((k) => texteVon(k).some((s) => VORGABE.test(s.trim())));
  // Leerzeichen zwischen Text und Antwort: Text vorne endet mit Leerzeichen oder Text hinten beginnt mit einem (oder mit einem Satzzeichen)
  const abstand = !!mitText && ((typeof mitText.ein.STRING1 === "string" && typeof mitText.ein.STRING2 !== "string" && /\s$/.test(mitText.ein.STRING1)) || (typeof mitText.ein.STRING2 === "string" && typeof mitText.ein.STRING1 !== "string" && /^(\s|[!?.,])/.test(mitText.ein.STRING2)) || (typeof mitText.ein.STRING1 !== "string" && typeof mitText.ein.STRING2 !== "string"));
  return [
    { ok: da, text: da ? "Dein Programm startet mit der grünen Fahne." : ohneFahne },
    { ok: fragt, text: fragt ? "Die Figur stellt eine Frage." : "Es fehlt der Block „frage … und warte“." },
    { ok: inSage && folge, text: inSage && folge ? "Nach der Frage sagt die Figur einen Satz aus „verbinde“ und „Antwort“." : inSage ? "Der „sage“-Block mit „verbinde“ muss unter dem Frage-Block hängen. Vorher gibt es noch keine Antwort." : "Baue die Ausgabe so: In den „sage“-Block kommt ein „verbinde“-Block, und in eines seiner Felder der Block „Antwort“." },
    { ok: !!mitText, text: mitText ? "Im „verbinde“-Block steht dein eigener Text." : vorgabe ? "Im „verbinde“-Block steht noch der Text, den Scratch vorgibt. Klicke in das Feld und schreibe deinen eigenen Text, zum Beispiel „Hallo “." : "In das andere Feld des „verbinde“-Blocks gehört dein eigener Text, zum Beispiel „Hallo “." },
    { ok: abstand, text: abstand ? "Zwischen deinem Text und der Antwort ist ein Leerzeichen." : mitText ? "Dein Text und die Antwort kleben zusammen. Tippe ein Leerzeichen zwischen deinen Text und die Antwort." : "Das Leerzeichen lässt sich erst prüfen, wenn dein eigener Text im „verbinde“-Block steht." }
  ];
}

/* ---------- Einheit 5: Variablen ---------- */
function pruefeVariablen(x) {
  const alle = fahnenKnoten(x), da = fahnen(x).length > 0, eigene = eigeneVariablen(x);
  const merkeAntwort = (k) => k.op === "data_setvariableto" && !!k.ein.VALUE && k.ein.VALUE.op === "sensing_answer";
  const merkt = alle.filter(merkeAntwort);
  const zwei = new Set(merkt.map((k) => k.feld.VARIABLE)).size >= 2;
  // Kernfehler: erst beide Fragen, dann beide „setze“-Blöcke – dann steckt in beiden Variablen die zweite Antwort
  const sofort = nacheinander(alle, "sensing_askandwait", merkeAntwort, "sensing_askandwait", merkeAntwort);
  const zeigt = alle.some(sagtVariable);
  return [
    { ok: da, text: da ? "Dein Programm startet mit der grünen Fahne." : ohneFahne },
    { ok: eigene.length >= 2, text: eigene.length >= 2 ? "Du hast eigene Variablen angelegt: " + eigene.slice(0, 4).join(", ") + "." : "Lege zwei eigene Variablen an (Bereich „Variablen“, Knopf „Neue Variable“). Bisher: " + (eigene.length ? eigene.join(", ") : "keine") + "." },
    { ok: merkt.length >= 1, text: merkt.length >= 1 ? "Ein „setze … auf Antwort“-Block merkt sich eine Eingabe." : "Nach einer Frage fehlt der Block „setze … auf …“ mit dem Block „Antwort“ darin." },
    { ok: zwei && sofort, text: zwei && sofort ? "Zwei Eingaben landen in zwei verschiedenen Variablen." : zwei ? "Nach jeder Frage muss sofort „setze … auf Antwort“ kommen. Sonst steckt in beiden Variablen die zweite Antwort." : "Stelle zwei Fragen und speichere jede Antwort in einer eigenen Variablen." },
    { ok: zeigt, text: zeigt ? "Die Figur benutzt eine Variable in ihrer Ausgabe." : "Lass die Figur etwas mit einer Variablen sagen: Ziehe den runden Variablen-Block in einen „sage“- oder „verbinde“-Block." }
  ];
}

/* ---------- Einheit 6: Verzweigung ---------- */
// die Bedingung enthält einen Vergleich mit der Eingabe – auch wenn er in „und“, „oder“ oder „nicht“ steckt
const vergleichtEingabe = (k) => { const b = k.ein.CONDITION; return !!b && typeof b === "object" && flach([b]).some((v) => VERGLEICH.includes(v.op) && (drin(v, "sensing_answer") || drin(v, "data_variable"))); };
function pruefeVerzweigung(x) {
  const alle = fahnenKnoten(x), da = fahnen(x).length > 0;
  const fragt = alle.some((k) => k.op === "sensing_askandwait"), wenn = alle.filter((k) => k.op === "control_if_else");
  const bed = wenn.some(vergleichtEingabe);
  const beide = wenn.some((k) => flach(k.innen[0]).some(istSage) && flach(k.innen[1]).some(istSage));
  const folge = nacheinander(alle, "sensing_askandwait", "control_if_else");
  return [
    { ok: da, text: da ? "Dein Programm startet mit der grünen Fahne." : ohneFahne },
    { ok: fragt, text: fragt ? "Die Figur stellt eine Frage." : "Es fehlt der Block „frage … und warte“." },
    { ok: wenn.length > 0 && folge, text: wenn.length > 0 && folge ? "Nach der Frage kommt der Block „falls …, dann … sonst“." : wenn.length ? "Der Block „falls …, dann … sonst“ muss unter dem Frage-Block hängen." : "Es fehlt der Block „falls …, dann … sonst“ (Bereich „Steuerung“)." },
    { ok: bed, text: bed ? "Die Bedingung vergleicht die Eingabe." : "In das sechseckige Feld gehört ein Vergleich (Bereich „Operatoren“) mit dem Block „Antwort“, zum Beispiel Antwort = 7." },
    { ok: beide, text: beide ? "In beiden Zweigen sagt die Figur etwas." : "Bei „dann“ und bei „sonst“ soll die Figur jeweils etwas sagen. In einem Zweig fehlt noch ein „sage“-Block." }
  ];
}
function pruefeVerschachtelt(x) {
  const alle = fahnenKnoten(x);
  const aussen = alle.find((k) => k.op === "control_if_else" && k.innen.some((liste) => flach(liste).some((i) => i.op === "control_if_else" || i.op === "control_if")));
  const ausgaben = new Set(alle.filter((k) => /^control_if/.test(k.op)).reduce((s, k) => s.concat(...k.innen.map((liste) => (liste || []).filter(istSage).map((i) => JSON.stringify(i.ein.MESSAGE)))), []));
  const offen = pruefeVerzweigung(x).find((p) => !p.ok), basis = !offen;
  return [
    { ok: basis, text: basis ? "Die erste Verzweigung stimmt." : "Zuerst muss die einfache Verzweigung stimmen. " + offen.text },
    { ok: !!aussen, text: aussen ? "In einem Zweig steckt eine zweite Verzweigung." : "Setze in den „sonst“-Zweig einen zweiten Block „falls …, dann … sonst“. So unterscheidest du drei Fälle." },
    { ok: ausgaben.size >= 3, text: ausgaben.size >= 3 ? "Die Figur hat drei verschiedene Ausgaben." : "Für drei Fälle braucht die Figur drei verschiedene Sätze. Bisher: " + ausgaben.size + "." }
  ];
}

/* ---------- Einheit 7: Zahlenraten ---------- */
function pruefeRaten(x) {
  const alle = fahnenKnoten(x), da = fahnen(x).length > 0;
  const geheim = alle.find((k) => k.op === "data_setvariableto" && k.ein.VALUE && k.ein.VALUE.op === "operator_random");
  const zahlName = geheim ? geheim.feld.VARIABLE : "geheimzahl";
  const istSchleife = (k) => k.op === "control_repeat_until", schleife = alle.find(istSchleife);
  const innen = schleife ? flach(schleife.innen[0]) : [];
  // Zwei Wege sind richtig: Antwort = geheimzahl – oder der Tipp wird erst in einer eigenen Variablen gespeichert (tipp = geheimzahl)
  const b = schleife && schleife.ein.CONDITION && schleife.ein.CONDITION.op === "operator_equals" ? schleife.ein.CONDITION : null;
  const namen = b ? ["OPERAND1", "OPERAND2"].map((n) => b.ein[n] && b.ein[n].op === "data_variable" ? b.ein[n].feld.VARIABLE : "") : [];
  const merktTipp = (k) => k.op === "data_setvariableto" && !!k.ein.VALUE && k.ein.VALUE.op === "sensing_answer" && namen.includes(k.feld.VARIABLE) && k.feld.VARIABLE !== zahlName;
  const mitTipp = !!b && !drin(schleife, "sensing_answer") && namen[0] !== "" && namen[1] !== "" && namen[0] !== namen[1] && alle.some(merktTipp);
  const bed = !!b && ((drin(schleife, "sensing_answer") && drin(schleife, "data_variable")) || mitTipp);
  const hinweis = innen.some((k) => /^control_if/.test(k.op) && k.ein.CONDITION && flach([k.ein.CONDITION]).some((v) => ["operator_gt", "operator_lt"].includes(v.op))) && innen.some(istSage);
  const fragtNeu = innen.some((k) => k.op === "sensing_askandwait"), neu = fragtNeu && (!mitTipp || nacheinander(innen, "sensing_askandwait", merktTipp));
  const ersteFrage = nacheinander(alle, "sensing_askandwait", "control_repeat_until");
  // „Richtig!“ hängt im selben Stapel unter der Schleife – auch wenn das ganze Spiel in „wiederhole fortlaufend“ steckt
  const ende = danach(x, istSchleife).some(istSage);
  return [
    { ok: da, text: da ? "Dein Programm startet mit der grünen Fahne." : ohneFahne },
    { ok: !!geheim, text: geheim ? "Die Geheimzahl ist eine Zufallszahl und steckt in der Variablen „" + zahlName + "“." : "Am Anfang fehlt: „setze … auf Zufallszahl von 1 bis 10“. So denkt sich die Figur eine Zahl aus." },
    { ok: ersteFrage, text: ersteFrage ? "Vor der Schleife wird das erste Mal gefragt." : "Vor dem Block „wiederhole bis …“ muss die Figur schon einmal fragen – sonst gibt es noch keine Antwort zum Vergleichen." },
    { ok: bed, text: bed ? "Die Schleife läuft, bis der Tipp gleich der Geheimzahl ist." : schleife ? "In das Feld von „wiederhole bis …“ gehört der Vergleich Antwort = " + zahlName + "." : "Es fehlt der Block „wiederhole bis …“ (Bereich „Steuerung“)." },
    { ok: hinweis, text: hinweis ? "In der Schleife gibt die Figur einen Hinweis: zu groß oder zu klein." : "In die Schleife gehört eine Verzweigung mit > oder <: Ist die Antwort größer als die Geheimzahl, sagt die Figur „Zu groß!“, sonst „Zu klein!“." },
    { ok: neu, text: neu ? "In der Schleife wird noch einmal gefragt." : fragtNeu ? "Nach der neuen Frage muss in der Schleife wieder der „setze“-Block mit „Antwort“ kommen. Sonst vergleicht die Figur immer den alten Tipp." : "Am Ende der Schleife muss die Figur noch einmal fragen. Sonst vergleicht sie immer dieselbe Antwort – und hört nie auf." },
    { ok: ende, text: ende ? "Nach der Schleife sagt die Figur, dass richtig geraten wurde." : "Unter der Schleife fehlt noch der Satz für den Erfolg, zum Beispiel „Richtig!“." }
  ];
}
function pruefeZaehler(x) {
  const alle = fahnenKnoten(x), basis = pruefeRaten(x).every((p) => p.ok);
  const istSchleife = (k) => k.op === "control_repeat_until", schleife = alle.find(istSchleife), innen = schleife ? flach(schleife.innen[0]) : [];
  const geheim = alle.find((k) => k.op === "data_setvariableto" && k.ein.VALUE && k.ein.VALUE.op === "operator_random");
  const zaehlt = innen.find((k) => k.op === "data_changevariableby" && (!geheim || k.feld.VARIABLE !== geheim.feld.VARIABLE));
  const start = !!zaehlt && nacheinander(alle, (k) => k.op === "data_setvariableto" && k.feld.VARIABLE === zaehlt.feld.VARIABLE, "control_repeat_until");
  const zeigt = !!zaehlt && danach(x, istSchleife).some((k) => k.op === "data_variable" && k.feld.VARIABLE === zaehlt.feld.VARIABLE);
  return [
    { ok: basis, text: basis ? "Das Zahlenraten-Spiel läuft." : "Zuerst muss das Spiel selbst stimmen. Lade es beim ersten Auftrag hoch und sieh nach, was dort noch offen ist." },
    { ok: !!zaehlt, text: zaehlt ? "In der Schleife zählt „ändere " + zaehlt.feld.VARIABLE + " um …“ die Versuche mit." : "Lege eine Variable für die Versuche an und setze in die Schleife den Block „ändere … um 1“." },
    { ok: start, text: start ? "Vor der Schleife bekommt der Zähler seinen Startwert." : "Vor der Schleife fehlt der Startwert für den Zähler: „setze … auf 1“." },
    { ok: zeigt, text: zeigt ? "Am Ende nennt die Figur die Zahl der Versuche." : "Nach der Schleife soll die Figur die Zahl der Versuche sagen – mit „verbinde“ und dem Variablen-Block." }
  ];
}

/* ---------- Einheit 8: eigenes Projekt ---------- */
function pruefeProjekt(x) {
  const alle = fahnenKnoten(x), da = fahnen(x).length > 0;
  const fragt = alle.some((k) => k.op === "sensing_askandwait"), wenn = alle.some((k) => /^control_if/.test(k.op) && k.ein.CONDITION && typeof k.ein.CONDITION === "object");
  const merkt = alle.some((k) => k.op === "data_setvariableto" || k.op === "data_changevariableby");
  const saetze = new Set(alle.filter(istSage).map((k) => JSON.stringify(k.ein.MESSAGE)));
  return [
    { ok: da, text: da ? "Dein Programm startet mit der grünen Fahne." : ohneFahne },
    { ok: fragt, text: fragt ? "Eingabe: Die Figur stellt mindestens eine Frage." : "Eingabe fehlt: Baue mindestens einen Block „frage … und warte“ ein." },
    { ok: merkt, text: merkt ? "Variable: Dein Programm merkt sich etwas." : "Variable fehlt: Benutze „setze … auf …“ oder „ändere … um …“." },
    { ok: wenn, text: wenn ? "Verzweigung: Dein Programm entscheidet mit „falls“." : "Verzweigung fehlt: Baue einen Block „falls …, dann“ mit einer Bedingung ein." },
    { ok: saetze.size >= 2, text: saetze.size >= 2 ? "Ausgabe: Die Figur sagt mindestens zwei verschiedene Dinge." : "Ausgabe: Die Figur soll mindestens zwei verschiedene Dinge sagen. Hänge einen zweiten „sage“-Block mit anderem Text an." }
  ];
}

const AUFGABEN = {
  "scratch-start-auf1": {
    titel: "Mein erstes Programm",
    auftrag: "Ein erstes Programm in Scratch: Wenn die grüne Fahne angeklickt wird, sagt die Figur etwas, bewegt sich und sagt dann noch einmal etwas (Reihenfolge von Anweisungen).",
    pruefe: pruefeStart
  },
  "objekte-auf1": {
    titel: "Eigenschaften verändern",
    auftrag: "Die Figur ist ein Objekt mit Eigenschaften. Das Programm soll drei Eigenschaften ändern: Position (gehe zu x: … y: …), Größe (setze Größe auf …) und Richtung (setze Richtung auf … Grad). Außerdem soll das Kind über den Knopf „Figur wählen“ ein zweites Objekt erstellen.",
    pruefe: pruefeObjekte
  },
  "eingabe-auf1": {
    titel: "Die Figur fragt nach",
    auftrag: "Eingabe: Die Figur stellt mit „frage … und warte“ eine Frage und gibt die Eingabe danach mit „sage Antwort“ wieder.",
    pruefe: pruefeEingabe
  },
  "ausgabe-auf1": {
    titel: "Eine Begrüßung zusammensetzen",
    auftrag: "Ausgabe: Die Figur fragt nach dem Namen und begrüßt das Kind mit einem zusammengesetzten Satz: sage (verbinde „Hallo “ und Antwort). Zwischen Text und Antwort gehört ein Leerzeichen.",
    pruefe: pruefeAusgabe
  },
  "variablen-auf1": {
    titel: "Zwei Antworten merken",
    auftrag: "Variablen: Die Figur stellt zwei Fragen (zum Beispiel Name und Alter), speichert jede Antwort in einer eigenen Variablen und benutzt die Variablen in ihrer Ausgabe.",
    pruefe: pruefeVariablen
  },
  "verzweigung-auf1": {
    titel: "Richtig oder falsch?",
    auftrag: "Verzweigung: Die Figur stellt eine Quizfrage. Mit „falls …, dann … sonst“ und einem Vergleich der Antwort sagt sie „Richtig!“ oder „Leider falsch.“",
    pruefe: pruefeVerzweigung
  },
  "verzweigung-aufM": {
    titel: "Drei Fälle unterscheiden",
    auftrag: "Verschachtelte Verzweigung: Im sonst-Zweig steckt eine zweite Verzweigung, sodass die Figur drei Fälle unterscheidet (zum Beispiel nach dem Alter: Kind, jugendlich, erwachsen).",
    pruefe: pruefeVerschachtelt
  },
  "zahlenraten-auf1": {
    titel: "Zahlenraten",
    auftrag: "Mini-Anwendung Zahlenraten: Die Figur merkt sich eine Zufallszahl von 1 bis 10, fragt nach einem Tipp und wiederholt bis zur richtigen Antwort. In der Schleife sagt sie „Zu groß!“ oder „Zu klein!“ und fragt noch einmal. Am Ende „Richtig!“.",
    pruefe: pruefeRaten
  },
  "zahlenraten-aufM": {
    titel: "Versuche mitzählen",
    auftrag: "Zahlenraten mit Zähler: Eine zweite Variable zählt die Versuche (Startwert vor der Schleife, „ändere … um 1“ in der Schleife). Am Ende nennt die Figur die Zahl der Versuche.",
    pruefe: pruefeZaehler
  },
  "eigenes-projekt-auf1": {
    titel: "Mein eigenes kleines Projekt",
    auftrag: "Eigenes kleines Projekt (zum Beispiel ein Quiz oder ein Rechentrainer). Mindestens: Start mit der Fahne, eine Eingabe, eine Variable, eine Verzweigung, zwei verschiedene Ausgaben. Gib zusätzlich eine kurze, freundliche Rückmeldung zur Idee des Programms.",
    pruefe: pruefeProjekt
  }
};

module.exports = { scratchProjekt, AUFGABEN };
