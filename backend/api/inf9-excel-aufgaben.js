"use strict";

/**
 * Informatik 9, Excel-Aufträge (Module 3 und 4): Was das Prüfprogramm an der hochgeladenen Datei prüft (excelpruefung.js).
 * Kennung = "<einheit>-<aufgabe>" wie auf der Lernseite (9M/Informatik/<einheit>.html, Modul.makeAuftrag(…, "<aufgabe>")).
 * auftrag: kurze Beschreibung für die KI (ohne die fertigen Formeln). pruefe(x): Liste der Punkte [{ ok, text }] – der Text
 * spricht das Kind an und nennt den nächsten Schritt, verrät aber nie die fertige Formel. Aufbau und Regeln wie
 * inf8-excel-aufgaben.js (dort ausführlich erklärt).
 *
 * Erwartete Werte werden aus den Zahlen der eigenen Datei gerechnet (wer zum Testen eine Zahl ändert, besteht trotzdem);
 * Folgefehler zählen nur einmal. Modul 4 prüft auch Diagramme: x.diagramme (siehe excelpruefung.js, Block „Diagramme“).
 * Jede Prüfung ist mit Dateien aus echtem Excel getestet (inf9-excel.test.js): jede Musterlösung besteht, jede Startdatei und
 * jede Gegenprobe fällt durch – mit dem passenden Punkt.
 *
 * Aus dieser Datei wird 9M/Informatik/excel-aufgaben9.js der Website erzeugt (Ersatzweg, wenn der Server nicht erreichbar ist;
 * Erzeuger: .codex-build/informatik9-werkzeug/excel/mach-aufgaben9.py). Deshalb hier nur x und die Helfer dieser Datei
 * benutzen – kein require, kein Node-Eigenes.
 */

const zahl = (x, a) => (typeof x.wert(a) === "number" ? x.wert(a) : 0);
// Formel des Kindes für die Rückmeldung: Der Leser liefert sie groß und ohne Leerzeichen – Texte in Anführungszeichen
// sähen dann falsch aus ("MITVERSAND"), deshalb stehen sie als "…" da.
const zeig = (x, a) => x.formel(a).replace(/"[^"]*"/g, '"…"');
const zahlDe = (n) => String(Math.round(n * 100) / 100).replace(".", ",");
const liste = (zellen) => zellen.join(", ");
const nahe = (v, soll, tol) => typeof v === "number" && Math.abs(v - soll) <= (tol == null ? 0.005 : tol);
const ohneDollar = (x, a) => x.bezuege(a).map((b) => b.replace(/\$/g, ""));
const nennt = (x, a, ziel) => ohneDollar(x, a).includes(ziel);
// true, wenn die Formel in a die Zelle ziel mit festgemachter Zeile anspricht ($G$1 oder G$1) – nur so bleibt der Bezug beim Kopieren nach unten stehen
const fest = (x, a, ziel) => { const m = /^([A-Z]+)(\d+)$/.exec(ziel); return x.bezuege(a).some((b) => b === "$" + m[1] + "$" + m[2] || b === m[1] + "$" + m[2]); };
const istFehler = (x, a) => typeof x.wert(a) === "string" && x.wert(a).charAt(0) === "#";
const gleichText = (v, soll) => typeof v === "string" && v.trim().toLowerCase() === soll.toLowerCase();
const summeVon = (x, spalte, von, bis) => { let s = 0; for (let z = von; z <= bis; z++) s += zahl(x, spalte + z); return s; };

// Steht der Funktionsname in der Formel? (Die Datei speichert englisch; der Leser übersetzt, SQRT sicherheitshalber mitzählen.)
const FUNKTION = { SUMME: ["SUMME", "SUM"], MITTELWERT: ["MITTELWERT", "AVERAGE"], PRODUKT: ["PRODUKT", "PRODUCT"], QUOTIENT: ["QUOTIENT"], RUNDEN: ["RUNDEN", "ROUND"], WURZEL: ["WURZEL", "SQRT"], WENN: ["WENN", "IF"] };
const hatFunktion = (x, a, name) => { const f = x.formel(a); return FUNKTION[name].some((n) => new RegExp("(^|[^A-Z0-9._])" + n + "\\(").test(f)); };
// Beide Texte der WENN-Formel stehen in Anführungszeichen (vier Zeichen); ohne sie meldet Excel #NAME?
const mitText = (x, a) => (x.formel(a).match(/"/g) || []).length >= 4 && x.wert(a) !== "#NAME?";

// Grund, warum in a gar nicht gerechnet wird: keine Formel / nur feste Zahlen – sonst ""
function ohneRechnung(x, a, was) {
  if (!x.hatFormel(a)) return a + ": Hier steht " + (x.leer(a) ? "noch nichts" : "eine getippte Zahl oder ein Text, keine Formel") + ". Gesucht: " + was + ".";
  if (!x.bezuege(a).length) return a + ": In der Formel stehen nur feste Zahlen. Verwende Zelladressen – dann rechnet Excel neu, wenn sich eine Zahl ändert.";
  return "";
}

// Eine nach unten kopierte Formelspalte, die eine feste Zelle braucht (z. B. E2:E6 mit $G$1): "" wenn alles stimmt, sonst der nächste Schritt.
// Zuerst wird die erste Zelle beurteilt (die das Kind selbst schreibt), danach die kopierten.
function festSpalte(x, sp, zeilen, ziel, eigene, schreibe, was) {
  const a1 = sp + zeilen[0], ohne = zeilen.filter((z) => !x.hatFormel(sp + z));
  if (ohne.includes(zeilen[0])) return a1 + ": " + schreibe + (zeilen.some((z) => !x.hatFormel(sp + z) && !x.leer(sp + z)) ? " Getippte Zahlen sind keine Formel." : "");
  if (!nennt(x, a1, ziel)) return a1 + ": " + was[0].toUpperCase() + was.slice(1) + " steht als Zahl in der Formel. Verwende die Zelle " + ziel + " und mach den Bezug mit Dollarzeichen fest.";
  if (!fest(x, a1, ziel)) return a1 + ": " + ziel + " steht ohne Dollarzeichen. Mach den Bezug auf " + ziel + " fest und ziehe die Formel noch einmal nach unten.";
  if (!nennt(x, a1, eigene(zeilen[0]))) return a1 + ": In der Formel fehlt " + eigene(zeilen[0]) + " – die Zelle der eigenen Zeile.";
  if (ohne.length) return "Ziehe die Formel aus " + a1 + " mit dem Ausfüllkästchen nach unten bis " + sp + zeilen[zeilen.length - 1] + ". Noch offen: " + liste(ohne.map((z) => sp + z)) + ".";
  const schief = zeilen.filter((z) => !(nennt(x, sp + z, ziel) && fest(x, sp + z, ziel) && nennt(x, sp + z, eigene(z))));
  return schief.length ? "Ziehe die Formel aus " + a1 + " noch einmal mit dem Ausfüllkästchen nach unten. Noch nicht richtig: " + liste(schief.map((z) => sp + z)) + "." : "";
}

/* ---------- Zellbereiche aus Diagramm-Verweisen („Tabelle1!$A$2:$A$6“) ---------- */
const SPALTEN = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const spNr = (s) => s.split("").reduce((n, c) => n * 26 + SPALTEN.indexOf(c) + 1, 0);
const spName = (n) => { let s = ""; while (n > 0) { s = SPALTEN[(n - 1) % 26] + s; n = Math.floor((n - 1) / 26); } return s; };
function zellenVon(ref) {
  const aus = [];
  String(ref || "").replace(/[$()]/g, "").split(",").forEach((t) => {
    const m = /^([A-Z]+)(\d+)(?::([A-Z]+)(\d+))?$/.exec(t.slice(t.lastIndexOf("!") + 1).trim().toUpperCase());
    if (!m) return;
    const s1 = spNr(m[1]), z1 = +m[2], s2 = m[3] ? spNr(m[3]) : s1, z2 = m[4] ? +m[4] : z1;
    if ((Math.abs(s2 - s1) + 1) * (Math.abs(z2 - z1) + 1) > 5000) return;
    for (let s = Math.min(s1, s2); s <= Math.max(s1, s2); s++) for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) aus.push(spName(s) + z);
  });
  return aus;
}
const zellenIn = (von, bis) => zellenVon(von + ":" + bis);

/* ---------- Diagramme prüfen (gemeinsame Bausteine für Modul 4) ---------- */
const ART_NAME = { saeule: "Säulendiagramm", balken: "Balkendiagramm", kreis: "Kreisdiagramm", ring: "Ringdiagramm", linie: "Liniendiagramm", flaeche: "Flächendiagramm", punkt: "Punktdiagramm", sonst: "ein anderes Diagramm" };
const artName = (d) => (d.art === "sonst" ? ART_NAME.sonst : "ein " + ART_NAME[d.art]);
// das passende Diagramm der Mappe: erstes mit gewünschter Art, sonst das erste
const diagramm = (x, arten) => { const d = x.diagramme || []; return d.find((c) => arten.includes(c.art)) || d[0] || null; };
const KEIN_DIAGRAMM = "In deiner Datei ist noch kein Diagramm. Markiere die Tabelle mit den Überschriften und füge das Diagramm ein, speichere die Datei und lade sie noch einmal hoch.";
const erst = (was, mehrere) => was + (mehrere ? " lassen" : " lässt") + " sich prüfen, sobald ein Diagramm in der Datei ist.";

function vorhandenPunkt(d) {
  return d ? { ok: true, text: "In der Datei ist ein Diagramm." } : { ok: false, text: KEIN_DIAGRAMM };
}
function titelPunkt(d) {
  if (!d) return { ok: false, text: erst("Der Titel") };
  const t = String(d.titel || "").trim();
  if (t && t.toLowerCase() !== "diagrammtitel") return { ok: true, text: "Das Diagramm hat einen eigenen Titel: „" + t.slice(0, 60) + "“." };
  if (t) return { ok: false, text: "Im Titel steht noch das Wort „Diagrammtitel“. Klicke auf den Titel und schreibe hinein, worum es im Diagramm geht." };
  if (d.autoTitel) return { ok: false, text: "Der Titel kommt noch von Excel selbst – du hast keinen eigenen geschrieben. Klicke auf den Titel und schreibe hinein, worum es im Diagramm geht." };
  return { ok: false, text: "Das Diagramm hat noch keinen Titel. Füge einen Diagrammtitel hinzu und schreibe hinein, worum es im Diagramm geht." };
}
// Welche Zellen der Spalte A (Beschriftung) und B (Werte) stecken im Diagramm? Reihenname und Kategorien zählen beide als Beschriftung
function imDiagramm(d) {
  const werte = new Set(), namen = new Set();
  (d ? d.reihen : []).forEach((r) => { zellenVon(r.werte).forEach((a) => werte.add(a)); zellenVon(r.kategorien).concat(zellenVon(r.nameRef)).forEach((a) => namen.add(a)); });
  return { werte, namen };
}
// Name der Zeile für die Rückmeldung („Klettern“), sonst die Zeilennummer
const zeilenName = (x, a) => { const z = a.replace(/\D/g, ""), n = x.wert("A" + z); return typeof n === "string" && n ? "„" + n.slice(0, 24) + "“" : "Zeile " + z; };
// Daten: Alle Werte (wertZellen) und alle Beschriftungen (namenZellen) müssen im Diagramm stecken; verboten: zellen, die nicht hineingehören
function datenPunkt(x, d, wertZellen, namenZellen, was, verboten) {
  if (!d) return { ok: false, text: erst("Die Daten", true) };
  const im = imDiagramm(d);
  const fehlW = wertZellen.filter((a) => !im.werte.has(a)), fehlN = namenZellen.filter((a) => !im.namen.has(a));
  const zuViel = (verboten || []).filter((a) => im.werte.has(a) || im.namen.has(a));
  if (zuViel.length) return { ok: false, text: "Im Diagramm steckt auch " + zuViel.map((a) => a.replace(/\D/g, "")).filter((v, i, l) => l.indexOf(v) === i).map((z) => "Zeile " + z + " (" + zeilenName(x, "A" + z) + ")").join(" und ") + ", das gehört nicht dazu. Wähle nur " + was + " aus." };
  if (fehlW.length) {
    const wo = fehlW.map((a) => zeilenName(x, a)).filter((v, i, l) => l.indexOf(v) === i);
    return { ok: false, text: "Im Diagramm fehlen Werte: " + wo.join(", ") + ". Markiere beim Einfügen die ganze Tabelle mit den Überschriften – " + was + "." };
  }
  if (fehlN.length) return { ok: false, text: "Im Diagramm fehlen die Beschriftungen (" + zeilenName(x, fehlN[0]) + (fehlN.length > 1 ? " und weitere" : "") + "). Markiere beim Einfügen auch die Spalte A mit den Namen." };
  return { ok: true, text: "Im Diagramm stecken " + was + "." };
}

/* =========================== Modul 3: Excel-Funktionen =========================== */

/* ---------- Einheit 1: Kiosk (relative und absolute Bezüge) ---------- */
function pruefeKiosk(x) {
  const zeilen = [2, 3, 4, 5, 6];
  // D: Preis mal Menge der eigenen Zeile
  const dOhneFormel = zeilen.filter((z) => !x.hatFormel("D" + z)), dFalschBezug = zeilen.filter((z) => x.hatFormel("D" + z) && !(nennt(x, "D" + z, "B" + z) && nennt(x, "D" + z, "C" + z)));
  const dOffen = zeilen.filter((z) => dOhneFormel.includes(z) || dFalschBezug.includes(z));
  const dGetippt = dOhneFormel.filter((z) => !x.leer("D" + z)).map((z) => "D" + z);
  const dWertFalsch = zeilen.filter((z) => !nahe(x.wert("D" + z), zahl(x, "B" + z) * zahl(x, "C" + z)));
  // E: Menge mal Pfand aus G1, festgemacht
  const eText = festSpalte(x, "E", zeilen, "G1", (z) => "C" + z, "Schreibe hier eine Formel: Menge mal Pfand aus G1. Der Pfand in G1 muss beim Kopieren an seinem Platz bleiben.", "der Pfand");
  const eWertFalsch = zeilen.filter((z) => !nahe(x.wert("E" + z), zahl(x, "C" + z) * zahl(x, "G1")));
  return [
    { ok: !dOffen.length, text: !dOffen.length ? "D2 bis D6: Jede Zelle rechnet Preis mal Menge ihrer eigenen Zeile." : dOhneFormel.includes(2) || dOhneFormel.length === 5 ? "D2: Schreibe hier eine Formel: Preis mal Menge von Zeile 2. Ziehe sie dann nach unten bis D6." + (dGetippt.length ? " Getippte Zahlen sind keine Formeln: " + liste(dGetippt) + "." : "") : dFalschBezug.length ? "In " + liste(dFalschBezug.map((z) => "D" + z)) + " rechnet die Formel nicht mit Preis und Menge der eigenen Zeile. Ziehe die Formel aus D2 nach unten." : "Ziehe die Formel aus D2 mit dem Ausfüllkästchen nach unten bis D6. Noch offen: " + liste(dOhneFormel.map((z) => "D" + z)) + (dGetippt.length ? " (dort stehen getippte Zahlen)" : "") + "." },
    { ok: !dWertFalsch.length, text: !dWertFalsch.length ? "D2 bis D6: Alle Gesamtpreise stimmen." : dOffen.length ? "Die Gesamtpreise stimmen, sobald in D2 bis D6 überall die Formel steht." : "Der Gesamtpreis stimmt noch nicht in: " + liste(dWertFalsch.map((z) => "D" + z)) + ". Rechne Preis mal Menge dieser Zeile." },
    { ok: !eText, text: !eText ? "E2 bis E6: Der Pfand in G1 ist festgemacht – " + zeig(x, "E2") + "." : eText },
    { ok: !eWertFalsch.length, text: !eWertFalsch.length ? "E2 bis E6: Das Pfand gesamt stimmt in jeder Zeile." : eText ? "Das Pfand gesamt stimmt, sobald in E2 bis E6 die Formel mit dem festgemachten Bezug auf G1 steht." : "Das Pfand gesamt stimmt noch nicht in: " + liste(eWertFalsch.map((z) => "E" + z)) + ". Rechne Menge mal Pfand aus G1." }
  ];
}

/* ---------- Einheit 2: Schritte-Wettbewerb (SUMME, MITTELWERT) ---------- */
function pruefeSchritte(x) {
  const sp = ["B", "C"];
  // Punkt „Funktion benutzt“ für eine Zeile (9 oder 10) beider Teams
  const mitFunktion = (zeile, name, was) => {
    const probleme = sp.map((s) => s + zeile).map((a) => {
      const g = ohneRechnung(x, a, was);
      if (g) return g;
      if (!hatFunktion(x, a, name)) return a + ": Das rechnet vielleicht richtig, aber Excel hat dafür die Funktion " + name + ". Benutze sie mit einem Bereich (von der ersten bis zur letzten Zelle mit Doppelpunkt).";
      return "";
    }).filter(Boolean);
    return probleme;
  };
  const p1 = mitFunktion(9, "SUMME", "die Summe aller sieben Tage dieses Teams"), p3 = mitFunktion(10, "MITTELWERT", "der Durchschnitt der sieben Tage dieses Teams");
  const werte = (zeile, soll) => sp.map((s) => s + zeile).filter((a) => !nahe(x.wert(a), soll(a.charAt(0)), 0.005));
  const summeFalsch = werte(9, (s) => summeVon(x, s, 2, 8)), schnittFalsch = werte(10, (s) => summeVon(x, s, 2, 8) / 7);
  const mitSumme = schnittFalsch.filter((a) => nahe(x.wert(a), summeVon(x, a.charAt(0), 2, 9) / 8, 0.01));
  return [
    { ok: !p1.length, text: !p1.length ? "B9 und C9: Die Summen benutzen SUMME – " + zeig(x, "B9") + "." : p1[0] },
    { ok: !summeFalsch.length, text: !summeFalsch.length ? "Die Summen stimmen: alle sieben Tage sind dabei." : summeFalsch.map((a) => a + (x.leer(a) ? " ist noch leer" : " zeigt " + (typeof x.wert(a) === "number" ? zahlDe(x.wert(a)) : String(x.wert(a)))))[0] + ". Zähle alle sieben Tage zusammen – vom Montag (Zeile 2) bis zum Sonntag (Zeile 8)." },
    { ok: !p3.length, text: !p3.length ? "B10 und C10: Die Durchschnitte benutzen MITTELWERT – " + zeig(x, "B10") + "." : p3[0] },
    { ok: !schnittFalsch.length, text: !schnittFalsch.length ? "Die Durchschnitte stimmen." : mitSumme.length ? mitSumme[0] + ": Die Summe aus Zeile 9 steht mit im Bereich. Der Durchschnitt gilt nur für die sieben Tage (Zeile 2 bis 8)." : schnittFalsch[0] + (x.leer(schnittFalsch[0]) ? " ist noch leer" : " zeigt " + (typeof x.wert(schnittFalsch[0]) === "number" ? zahlDe(x.wert(schnittFalsch[0])) : String(x.wert(schnittFalsch[0])))) + ". Der Durchschnitt gilt für die sieben Tage von Zeile 2 bis Zeile 8." }
  ];
}

/* ---------- Einheit 3: Jugendraum renovieren (PRODUKT, QUOTIENT, RUNDEN, WURZEL) ---------- */
// Eine Zelle, die mit einer bestimmten Funktion rechnen soll: Funktion benutzt UND Wert stimmt
function funktionsPunkt(x, a, name, soll, was, extra) {
  const grund = ohneRechnung(x, a, was);
  if (grund) return { ok: false, text: grund };
  if (istFehler(x, a)) return { ok: false, text: a + ": Die Zelle zeigt " + x.wert(a) + ". Prüfe die Zellen, mit denen die Formel rechnet, und die Klammer." };
  const funk = hatFunktion(x, a, name), wertOk = soll.pruef(x.wert(a));
  if (funk && wertOk) return { ok: true, text: a + ": " + zeig(x, a) + " – stimmt." };
  if (!funk && wertOk) return { ok: false, text: a + ": Das rechnet richtig. Übe hier die Funktion " + name + "." };
  if (funk) return { ok: false, text: a + ": Die Funktion " + name + " ist da, aber das Ergebnis stimmt nicht. " + ((extra && extra(x.wert(a))) || "Prüfe, welche Zellen in der Klammer stehen.") };
  return { ok: false, text: a + ": " + ((extra && extra(x.wert(a))) || "Das Ergebnis stimmt noch nicht.") + " Gesucht: " + was + "." };
}
const exakt = (s) => ({ pruef: (v) => nahe(v, s, 0.0001) });
function pruefeRenovieren(x) {
  const flaeche = zahl(x, "B1") * zahl(x, "B2"), kartons = zahl(x, "B4") ? Math.trunc(zahl(x, "B3") / zahl(x, "B4")) : 0, preis = zahl(x, "B6") * zahl(x, "B7");
  const rabattOhne = zahl(x, "B8") * 0.03, rabatt = Math.round(rabattOhne * 100 + 1e-9) / 100, seite = zahl(x, "B11") >= 0 ? Math.sqrt(zahl(x, "B11")) : 0;
  const cent = (v) => typeof v === "number" && Math.abs(v * 100 - Math.round(v * 100)) < 1e-6;
  return [
    funktionsPunkt(x, "B3", "PRODUKT", exakt(flaeche), "die Bodenfläche (Länge mal Breite) mit der Funktion PRODUKT"),
    funktionsPunkt(x, "B5", "QUOTIENT", exakt(kartons), "wie viele ganze Kartons voll verlegt werden (Bodenfläche geteilt durch das, was ein Karton schafft), mit der Funktion QUOTIENT",
      (v) => (typeof v === "number" && zahl(x, "B4") && Math.abs(v - zahl(x, "B3") / zahl(x, "B4")) < 1e-9 && v !== kartons ? "Mit dem Geteilt-Zeichen bekommst du eine Kommazahl. QUOTIENT gibt nur die ganze Zahl." : "")),
    funktionsPunkt(x, "B8", "PRODUKT", exakt(preis), "der Preis ohne Rabatt (Preis je Karton mal Zahl der Kartons) mit der Funktion PRODUKT"),
    funktionsPunkt(x, "B9", "RUNDEN", { pruef: (v) => nahe(v, rabatt, 0.0001) || (cent(v) && nahe(v, rabattOhne, 0.0051)) }, "der Rabatt von 3 % auf den Preis ohne Rabatt, auf Cent gerundet, mit der Funktion RUNDEN",
      (v) => (typeof v === "number" && !cent(v) ? "Das Ergebnis hat mehr als zwei Nachkommastellen. Runde auf Cent: Gib bei RUNDEN an, auf wie viele Stellen." : "")),
    funktionsPunkt(x, "B12", "WURZEL", exakt(seite), "die Seitenlänge der quadratischen Tanzfläche mit der Funktion WURZEL")
  ];
}

/* ---------- Einheit 4: Versand im Schülerladen (WENN) ---------- */
function pruefeVersand(x) {
  const zeilen = [2, 3, 4, 5, 6, 7], grenze = zahl(x, "G1"), preis = zahl(x, "G2");
  const sollC = (z) => (zahl(x, "B" + z) >= grenze ? 0 : preis);
  // (1) C: WENN-Formeln mit Zellbezug
  const cKeine = zeilen.filter((z) => !x.hatFormel("C" + z)), cOhneWenn = zeilen.filter((z) => x.hatFormel("C" + z) && !hatFunktion(x, "C" + z, "WENN")), cOhneBezug = zeilen.filter((z) => x.hatFormel("C" + z) && !x.bezuege("C" + z).length);
  const cOffen = zeilen.filter((z) => cKeine.includes(z) || cOhneWenn.includes(z) || cOhneBezug.includes(z));
  const cGetippt = cKeine.filter((z) => !x.leer("C" + z));
  const cWertFalsch = zeilen.filter((z) => !nahe(x.wert("C" + z), sollC(z), 0.0001));
  const genau = zeilen.filter((z) => nahe(zahl(x, "B" + z), grenze, 0.0001) && !nahe(x.wert("C" + z), 0, 0.0001));
  // (3) D: WENN-Formeln mit Text
  const dKeine = zeilen.filter((z) => !x.hatFormel("D" + z)), dOhneWenn = zeilen.filter((z) => x.hatFormel("D" + z) && !hatFunktion(x, "D" + z, "WENN")),
    dOhneAnf = zeilen.filter((z) => x.hatFormel("D" + z) && hatFunktion(x, "D" + z, "WENN") && !mitText(x, "D" + z)), dFehler = zeilen.filter((z) => istFehler(x, "D" + z));
  const dOffen = zeilen.filter((z) => dKeine.includes(z) || dOhneWenn.includes(z) || dOhneAnf.includes(z));
  const dGetippt = dKeine.filter((z) => !x.leer("D" + z));
  // (4) D: Texte – gemessen am eigenen Versand (Folgefehler zählen einmal), ersatzweise am Bestellwert
  const textFalsch = zeilen.filter((z) => {
    const v = x.wert("D" + z), nachC = zahl(x, "C" + z) === 0 ? "kostenlos" : "mit Versand", nachB = zahl(x, "B" + z) >= grenze ? "kostenlos" : "mit Versand";
    return !(gleichText(v, nachC) || gleichText(v, nachB));
  });
  return [
    { ok: !cOffen.length, text: !cOffen.length ? "C2 bis C7: Der Versand wird mit WENN entschieden – " + zeig(x, "C2") + "." : cKeine.includes(2) ? "C2: Schreibe hier eine WENN-Formel: Ist der Bestellwert hoch genug, kostet der Versand nichts, sonst den Versandpreis. Ziehe sie dann nach unten bis C7." + (cGetippt.length ? " Getippte Zahlen sind keine Formel." : "") : cOhneWenn.length ? "In " + liste(cOhneWenn.map((z) => "C" + z)) + " steht keine WENN-Formel. Hier muss Excel entscheiden: Bestellwert hoch genug oder nicht." : cOhneBezug.length ? "In " + liste(cOhneBezug.map((z) => "C" + z)) + " kommt keine Zelladresse vor. Die Bedingung soll den Bestellwert aus Spalte B prüfen." : "Ziehe die Formel aus C2 mit dem Ausfüllkästchen nach unten bis C7. Noch offen: " + liste(cKeine.map((z) => "C" + z)) + "." },
    { ok: !cWertFalsch.length, text: !cWertFalsch.length ? "C2 bis C7: Der Versand stimmt in jeder Zeile." : cOffen.length && !cWertFalsch.every((z) => x.hatFormel("C" + z)) ? "Der Versand stimmt, sobald in C2 bis C7 überall die WENN-Formel steht." : genau.length ? "C" + genau[0] + ": Bei genau " + zahlDe(grenze) + " € ist der Versand schon kostenlos. Prüfe dein Vergleichszeichen: Es muss auch den Wert selbst einschließen." : "Der Versand stimmt noch nicht in: " + liste(cWertFalsch.map((z) => "C" + z)) + ". Ab dem Wert aus G1 ist er kostenlos, darunter kostet er den Preis aus G2." },
    { ok: !dOffen.length, text: !dOffen.length ? "D2 bis D7: Der Hinweis kommt aus einer WENN-Formel mit Text – " + zeig(x, "D2") + "." : dOhneAnf.length ? "In " + liste(dOhneAnf.map((z) => "D" + z)) + " fehlen die Anführungszeichen um den Text. Text steht in Excel immer in Anführungszeichen." + (dFehler.length ? " Darum zeigt die Zelle einen Fehler." : "") : dKeine.includes(2) ? "D2: Schreibe hier eine WENN-Formel, die als Hinweis einen Text ausgibt: kostenlos oder mit Versand. Ziehe sie dann nach unten bis D7." + (dGetippt.length ? " Getippte Texte sind keine Formel." : "") : dOhneWenn.length ? "In " + liste(dOhneWenn.map((z) => "D" + z)) + " steht keine WENN-Formel." : "Ziehe die Formel aus D2 mit dem Ausfüllkästchen nach unten bis D7. Noch offen: " + liste(dKeine.map((z) => "D" + z)) + "." },
    { ok: !textFalsch.length, text: !textFalsch.length ? "D2 bis D7: Die Hinweise stimmen – kostenlos oder mit Versand." : dOffen.length && textFalsch.every((z) => !x.hatFormel("D" + z) || istFehler(x, "D" + z)) ? "Die Hinweise stimmen, sobald in D2 bis D7 die WENN-Formel mit Text in Anführungszeichen steht." : "Der Hinweis stimmt noch nicht in: " + liste(textFalsch.map((z) => "D" + z)) + ". Er soll „kostenlos“ heißen, wenn der Versand nichts kostet, sonst „mit Versand“." }
  ];
}

/* ---------- Einheit 5: Abschlussfahrt (Projekt) ---------- */
// Anteil in Prozent: als Zahl (37,5) oder als Bruch im Prozentformat (0,375)
const anteilOk = (x, a, teil, ganzes) => ganzes > 0 && (nahe(x.wert(a), teil / ganzes * 100, 0.051) || (x.istProzent(a) && nahe(x.wert(a), teil / ganzes, 0.0006)));
function pruefeFahrt(x) {
  const zeilen = [2, 3, 4, 5];
  // (1) Gesamt je Posten
  const dOhne = zeilen.filter((z) => !x.hatFormel("D" + z)), dBezug = zeilen.filter((z) => x.hatFormel("D" + z) && !(nennt(x, "D" + z, "B" + z) && nennt(x, "D" + z, "C" + z)));
  const dWert = zeilen.filter((z) => !nahe(x.wert("D" + z), zahl(x, "B" + z) * zahl(x, "C" + z)));
  const dOk = !dOhne.length && !dBezug.length && !dWert.length;
  // (2) Summe, (3) Kosten je Person, (4) Budget-Check, (5) Stimmen
  const summeD = summeVon(x, "D", 2, 5), summeG = summeVon(x, "G", 2, 5);
  const gSumme = (a, soll, was, bereich) => {
    const g = ohneRechnung(x, a, was);
    if (g) return { ok: false, text: g };
    return nahe(x.wert(a), soll) ? { ok: true, text: a + ": " + zeig(x, a) + " zählt " + bereich + " zusammen." } : { ok: false, text: a + ": Die Summe stimmt noch nicht. Zähle genau " + bereich + " zusammen." };
  };
  const p2 = gSumme("D6", summeD, "die Kosten aller vier Posten zusammen", "die Gesamtkosten von D2 bis D5");
  const sollJe = zahl(x, "C2") ? Math.round(zahl(x, "D6") / zahl(x, "C2") * 100 + 1e-9) / 100 : 0;
  const gJe = ohneRechnung(x, "D7", "die Kosten je Person (Summe geteilt durch die Zahl der Personen), gerundet");
  const p3 = gJe ? { ok: false, text: gJe } : !nahe(x.wert("D7"), sollJe, 0.0001) ? { ok: false, text: istFehler(x, "D7") ? "D7: Die Zelle zeigt " + x.wert("D7") + ". Prüfe die Zellen, mit denen die Formel rechnet." : "D7: Teile die Summe (D6) durch die Zahl der Personen und runde das Ergebnis auf Cent." }
    : !hatFunktion(x, "D7", "RUNDEN") ? { ok: false, text: "D7: Das rechnet richtig. Benutze hier aber auch RUNDEN auf zwei Stellen – bei anderen Zahlen kämen sonst Bruchteile von Cent heraus." } : { ok: true, text: "D7: " + zeig(x, "D7") + " – Kosten je Person, auf Cent gerundet." };
  const sollE = zahl(x, "D7") <= zahl(x, "D8") ? "passt" : "zu teuer";
  const gE = ohneRechnung(x, "D9", "der Budget-Check: passt oder zu teuer");
  const p4 = gE ? { ok: false, text: gE } : !hatFunktion(x, "D9", "WENN") ? { ok: false, text: "D9: Hier soll Excel mit WENN entscheiden: Sind die Kosten je Person höchstens so hoch wie das Budget?" }
    : !mitText(x, "D9") ? { ok: false, text: "D9: Der Text muss in Anführungszeichen stehen." + (istFehler(x, "D9") ? " Darum zeigt die Zelle einen Fehler." : "") }
    : !gleichText(x.wert("D9"), sollE) ? { ok: false, text: "D9: Das Ergebnis stimmt nicht zu deinen Kosten (D7) und deinem Budget (D8). Prüfe das Vergleichszeichen." } : { ok: true, text: "D9: " + zeig(x, "D9") + " – der Budget-Check zeigt „" + sollE + "“." };
  const p5 = gSumme("G6", summeG, "die Stimmen aller vier Ziele zusammen", "die Stimmen von G2 bis G5");
  // (6) Anteile
  const ganzes = zahl(x, "G6") > 0 ? zahl(x, "G6") : summeG;
  const hText0 = festSpalte(x, "H", zeilen, "G6", (z) => "G" + z, "Schreibe hier eine Formel: Stimmen des Ziels geteilt durch alle Stimmen, mal 100. Der Bezug auf die Summe muss beim Kopieren stehen bleiben.", "die Summe der Stimmen");
  const hWert = zeilen.filter((z) => !anteilOk(x, "H" + z, zahl(x, "G" + z), ganzes));
  const hOk = !hText0 && !hWert.length;
  const hText = hOk ? "H2 bis H5: Jeder Anteil ist Stimmen geteilt durch alle Stimmen – mit festgemachtem Bezug: " + zeig(x, "H2") + "." : hText0 || "Der Anteil stimmt noch nicht in: " + liste(hWert.map((z) => "H" + z)) + ". Rechne Stimmen geteilt durch alle Stimmen und nimm das Ergebnis mal 100.";
  return [
    { ok: dOk, text: dOk ? "D2 bis D5: Jeder Posten rechnet Preis mal Personen seiner Zeile." : dOhne.includes(2) ? "D2: Schreibe hier eine Formel: Preis je Person mal Personen. Ziehe sie dann nach unten bis D5." : dOhne.length ? "Ziehe die Formel aus D2 mit dem Ausfüllkästchen nach unten bis D5. Noch offen: " + liste(dOhne.map((z) => "D" + z)) + "." : dBezug.length ? "In " + liste(dBezug.map((z) => "D" + z)) + " rechnet die Formel nicht mit Preis und Personen der eigenen Zeile." : "Der Gesamtpreis stimmt noch nicht in: " + liste(dWert.map((z) => "D" + z)) + ". Rechne Preis je Person mal Personen." },
    p2, p3, p4, p5, { ok: hOk, text: hText }
  ];
}

/* =========================== Modul 4: Excel-Diagramme =========================== */

/* ---------- Einheit 1: Lieblingssport (Säulendiagramm) ---------- */
function pruefeSport(x) {
  const d = diagramm(x, ["saeule"]);
  const typ = !d ? { ok: false, text: erst("Die Art des Diagramms") }
    : d.art === "saeule" && d.gestapelt !== "prozent" ? { ok: true, text: "Das Diagramm ist ein Säulendiagramm." }
    : d.art === "saeule" ? { ok: false, text: "Alle Säulen sind gleich hoch, weil das Diagramm 100 % gestapelt zeigt. Nimm die einfache Säule." }
    : d.art === "balken" ? { ok: false, text: "Das ist ein Balkendiagramm – gefragt sind Säulen, sie stehen aufrecht. Ändere die Art des Diagramms." }
    : { ok: false, text: "Das Diagramm ist " + artName(d) + ". Gefragt ist ein Säulendiagramm: Die Säulen stehen aufrecht." };
  return [
    vorhandenPunkt(d), typ,
    datenPunkt(x, d, zellenIn("B2", "B6"), zellenIn("A2", "A6"), "alle fünf Sportarten mit ihren Stimmen"),
    titelPunkt(d)
  ];
}

/* ---------- Einheit 2: Schulweg (Kreisdiagramm) ---------- */
function pruefeSchulweg(x) {
  const zeilen = [2, 3, 4, 5], gesamt = summeVon(x, "B", 2, 5);
  const gS = ohneRechnung(x, "B6", "die Summe aller Kinder");
  const p1 = gS ? { ok: false, text: gS } : nahe(x.wert("B6"), gesamt) ? { ok: true, text: "B6: " + zeig(x, "B6") + " zählt alle Kinder zusammen." } : { ok: false, text: "B6: Die Summe stimmt noch nicht. Zähle genau die Kinder der vier Schulwege (B2 bis B5) zusammen." };
  const ganzes = zahl(x, "B6") > 0 ? zahl(x, "B6") : gesamt;
  const cText0 = festSpalte(x, "C", zeilen, "B6", (z) => "B" + z, "Schreibe hier eine Formel: Kinder des Schulwegs geteilt durch alle Kinder, mal 100. Der Bezug auf die Summe muss beim Kopieren stehen bleiben.", "die Summe der Kinder");
  const cWert = zeilen.filter((z) => !anteilOk(x, "C" + z, zahl(x, "B" + z), ganzes));
  const cOk = !cText0 && !cWert.length;
  const p2 = { ok: cOk, text: cOk ? "C2 bis C5: Jeder Anteil ist Kinder geteilt durch alle Kinder – mit festgemachtem Bezug: " + zeig(x, "C2") + "." : cText0 || "Der Anteil stimmt noch nicht in: " + liste(cWert.map((z) => "C" + z)) + ". Rechne Kinder geteilt durch alle Kinder und nimm das Ergebnis mal 100." };
  const d = diagramm(x, ["kreis", "ring"]);
  const typ = !d ? { ok: false, text: KEIN_DIAGRAMM }
    : d.art === "kreis" || d.art === "ring" ? { ok: true, text: "Das Diagramm ist ein Kreisdiagramm." }
    : d.art === "saeule" || d.art === "balken" ? { ok: false, text: "Das ist " + artName(d) + ". Es vergleicht Werte. Hier geht es um die Anteile am Ganzen – dafür passt ein Kreisdiagramm." }
    : d.art === "linie" ? { ok: false, text: "Eine Linie zeigt eine Entwicklung über die Zeit. Hier geht es um Anteile am Ganzen – dafür passt ein Kreisdiagramm." }
    : { ok: false, text: "Das Diagramm ist " + artName(d) + ". Gefragt ist ein Kreisdiagramm." };
  return [
    p1, p2, typ,
    datenPunkt(x, d, zellenIn("B2", "B5"), zellenIn("A2", "A5"), "die vier Schulwege mit ihren Kindern", ["B6", "A6"]),
    titelPunkt(d)
  ];
}

/* ---------- Einheit 3: Wetterstation (Liniendiagramm) ---------- */
function pruefeWetter(x) {
  const d = diagramm(x, ["linie"]);
  const typ = !d ? { ok: false, text: erst("Die Art des Diagramms") }
    : d.art === "linie" ? { ok: true, text: "Das Diagramm ist ein Liniendiagramm." }
    : d.art === "saeule" || d.art === "balken" ? { ok: false, text: "Das ist " + artName(d) + ". Es vergleicht einzelne Werte. Hier soll man den Verlauf über die Woche sehen – dafür passt eine Linie." }
    : { ok: false, text: "Das Diagramm ist " + artName(d) + ". Gefragt ist ein Liniendiagramm: Es zeigt, wie sich die Temperatur über die Woche entwickelt." };
  return [
    vorhandenPunkt(d), typ,
    datenPunkt(x, d, zellenIn("B2", "B8"), zellenIn("A2", "A8"), "alle sieben Tage mit ihrer Temperatur"),
    titelPunkt(d)
  ];
}

/* ---------- Einheit 4: Taschengeld (passendes Diagramm wählen) ---------- */
function pruefeAuswertung(x) {
  const d = diagramm(x, ["kreis", "ring", "balken", "saeule"]);
  // 100-%-Streifen: alle Posten müssen in EINEM Balken liegen (jeder Posten eine eigene Datenreihe)
  const anteile = d && (d.art === "kreis" || d.art === "ring" || ((d.art === "balken" || d.art === "saeule") && d.gestapelt === "prozent"));
  const typ = !d ? { ok: false, text: erst("Die Art des Diagramms") }
    : anteile && (d.art === "kreis" || d.art === "ring") ? { ok: true, text: "Das Diagramm ist ein Kreisdiagramm – es zeigt die Anteile am Ganzen." }
    : anteile && d.reihen.length < 2 ? { ok: false, text: "Ein 100-%-Streifen zeigt alle Posten in einem einzigen Balken, jeder Posten ein Stück. Bei dir liegt jeder Posten in einem eigenen Balken. Wähle im Reiter „Entwurf“ den Befehl „Zeile/Spalte tauschen“ – oder nimm ein Kreisdiagramm." }
    : anteile ? { ok: true, text: "Das Diagramm ist ein 100-%-Streifen – er zeigt die Anteile am Ganzen." }
    : d.art === "saeule" || d.art === "balken" ? { ok: false, text: "Man kann die Beträge vergleichen – aber gefragt sind die Anteile am ganzen Taschengeld. Dafür passt ein Kreisdiagramm oder ein 100-%-Streifen." }
    : d.art === "linie" ? { ok: false, text: "Eine Linie zeigt eine Entwicklung über die Zeit. Hier gibt es keine Zeit – gefragt sind die Anteile am ganzen Taschengeld." }
    : { ok: false, text: "Das Diagramm ist " + artName(d) + ". Gefragt sind die Anteile am ganzen Taschengeld: Kreisdiagramm oder 100-%-Streifen." };
  return [
    vorhandenPunkt(d), typ,
    datenPunkt(x, d, zellenIn("B2", "B6"), zellenIn("A2", "A6"), "alle fünf Posten des Taschengelds"),
    titelPunkt(d)
  ];
}

module.exports = {
  "excel-start-auf1": {
    titel: "Der Kiosk rechnet",
    auftrag: "Kiosk-Tabelle: In D2 bis D6 den Gesamtpreis jedes Artikels berechnen (Preis mal Menge, Formel schreiben und nach unten kopieren). In E2 bis E6 das Pfand gesamt berechnen (Menge mal der Pfand, der nur einmal in G1 steht). Der Bezug auf G1 muss beim Kopieren festgemacht sein (absoluter Bezug mit Dollarzeichen).",
    pruefe: pruefeKiosk
  },
  "summe-mittelwert-auf1": {
    titel: "Wer hat mehr Schritte gemacht?",
    auftrag: "Schritte-Wettbewerb zweier Teams: In B9 und C9 mit der Funktion SUMME die Schritte der sieben Tage zusammenzählen, in B10 und C10 mit der Funktion MITTELWERT den Durchschnitt der sieben Tage berechnen. Der Bereich geht jeweils von Zeile 2 bis Zeile 8.",
    pruefe: pruefeSchritte
  },
  "rechenfunktionen-auf1": {
    titel: "Den Jugendraum renovieren",
    auftrag: "Jugendraum renovieren: Bodenfläche mit PRODUKT (Länge mal Breite), ganze Kartons mit QUOTIENT (Bodenfläche durch die Fläche eines Kartons, nur die ganze Zahl), Preis ohne Rabatt mit PRODUKT, 3 % Rabatt mit RUNDEN auf Cent gerundet und die Seitenlänge der quadratischen Tanzfläche mit WURZEL.",
    pruefe: pruefeRenovieren
  },
  "wenn-auf1": {
    titel: "Versand im Schülerladen",
    auftrag: "Versand im Schülerladen: Ab dem Bestellwert aus G1 ist der Versand kostenlos, sonst kostet er den Preis aus G2. In C2 bis C7 mit WENN den Versand berechnen (nach unten kopieren). In D2 bis D7 mit WENN einen Hinweistext ausgeben: kostenlos oder mit Versand. Ein Bestellwert, der genau so hoch ist wie die Grenze, ist schon kostenlos.",
    pruefe: pruefeVersand
  },
  "excel-projekt-auf1": {
    titel: "Die Abschlussfahrt planen",
    auftrag: "Abschlussfahrt: Gesamt je Posten (Preis je Person mal Personen), Summe aller Posten, Kosten je Person (Summe geteilt durch die Personen, mit RUNDEN auf Cent), Budget-Check mit WENN (passt oder zu teuer), bei der Umfrage die Summe der Stimmen und der Anteil jedes Ziels in Prozent (Stimmen geteilt durch alle Stimmen mal 100, Bezug auf die Summe festgemacht, auf eine Stelle gerundet).",
    pruefe: pruefeFahrt
  },
  "saeulen-balken-auf1": {
    titel: "Lieblingssport als Säulendiagramm",
    auftrag: "Umfrage Lieblingssport der 9. Klassen: Aus der Tabelle (Sportarten und Stimmen) ein Säulendiagramm erstellen, das alle fünf Sportarten zeigt, und dem Diagramm einen eigenen Titel geben.",
    pruefe: pruefeSport
  },
  "kreis-streifen-auf1": {
    titel: "Der Schulweg als Kreisdiagramm",
    auftrag: "Schulweg der Klasse: In B6 alle Kinder zusammenzählen, in C2 bis C5 den Anteil jedes Schulwegs in Prozent berechnen (Kinder geteilt durch alle Kinder mal 100, Bezug auf die Summe festgemacht). Dann ein Kreisdiagramm der vier Schulwege (ohne die Summe) mit eigenem Titel erstellen.",
    pruefe: pruefeSchulweg
  },
  "linien-auf1": {
    titel: "Das Wetter der Woche als Liniendiagramm",
    auftrag: "Wetterstation der Schule: Aus den Temperaturen von Montag bis Sonntag ein Liniendiagramm erstellen, das alle sieben Tage zeigt, und dem Diagramm einen eigenen Titel geben.",
    pruefe: pruefeWetter
  },
  "auswertung-auf1": {
    titel: "Wie teilt sich das Taschengeld auf?",
    auftrag: "Taschengeld-Ausgaben eines Monats: Das Kind soll selbst das passende Diagramm wählen, um zu zeigen, wie sich das Taschengeld aufteilt (Anteile am Ganzen: Kreisdiagramm, Ringdiagramm oder 100-%-Streifen), mit allen fünf Posten und einem eigenen Titel.",
    pruefe: pruefeAuswertung
  }
};
