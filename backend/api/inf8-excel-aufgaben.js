"use strict";

/**
 * Informatik 8, Excel-Aufträge: Was das Prüfprogramm an der hochgeladenen Datei prüft (excelpruefung.js).
 * Kennung = "<einheit>-<aufgabe>" wie auf der Lernseite (8M/Informatik/<einheit>.html, Modul.makeAuftrag(…, "<aufgabe>")).
 * auftrag: kurze Beschreibung für die KI. pruefe(x): Liste der Punkte [{ ok, text }] – der Text spricht das Kind an
 * und nennt den nächsten Schritt.
 *
 * Erwartete Ergebnisse werden aus den Zahlen der eigenen Datei berechnet, wo es geht: Wer zum Testen eine Zahl
 * geändert hat (anderes Taschengeld, mehr Pizzen), besteht trotzdem – solange die Formeln stimmen. Folgefehler
 * zählen nur einmal: Eine Formel wird an den eigenen Zwischenergebnissen gemessen.
 * Jede Prüfung ist mit Dateien aus echtem Excel getestet (lokal: jede Musterlösung besteht, jede Startdatei und
 * jeder typische Fehler fällt durch) und zusätzlich in excelpruefung.test.js.
 *
 * Aus dieser Datei wird 8M/Informatik/excel-aufgaben.js der Website erzeugt (Ersatzweg, wenn der Server nicht
 * erreichbar ist). Deshalb hier nur x und die Helfer dieser Datei benutzen – kein require, kein Node-Eigenes.
 */

const zahl = (x, a) => (typeof x.wert(a) === "number" ? x.wert(a) : 0);
const gleichText = (v, soll) => typeof v === "string" && v.trim().toLowerCase() === soll.toLowerCase();
const zahlDe = (n) => String(n).replace(".", ",");
// Was steht gerade in der Zelle? – für Rückmeldungen wie „Dort steht jetzt …“
const inhalt = (x, a) => (x.leer(a) ? "Die Zelle ist noch leer." : "Dort steht jetzt: " + (typeof x.wert(a) === "number" ? zahlDe(x.wert(a)) : "„" + String(x.wert(a)).slice(0, 30) + "“") + ".");
// Sieht ein Text aus wie eine Formel ohne Gleichheitszeichen? (B2+B3, SUMME(B2:B3))
const ohneGleich = (x, a) => x.istText(a) && /^\s*(?:[A-Za-z]{1,3}\d+\s*[-+*\/]|[A-Za-zÄÖÜäöü]+\s*\()/.test(String(x.wert(a)));

/* ================= Modul 3: Excel Grundlagen ================= */
/* ---------- Einheit 1: Excel kennenlernen ---------- */
function pruefeErste(x) {
  const b2 = gleichText(x.wert("B2"), "Hallo"), d5 = x.wert("D5") === 2027, a7 = gleichText(x.wert("A7"), "Excel");
  return [
    { ok: b2, text: b2 ? "In B2 steht „Hallo“." : "In B2 soll das Wort „Hallo“ stehen. " + inhalt(x, "B2") },
    { ok: d5, text: d5 ? "In D5 steht die Zahl 2027." : "In D5 soll die Zahl 2027 stehen. " + inhalt(x, "D5") },
    { ok: a7, text: a7 ? "In A7 steht „Excel“." : "In A7 soll das Wort „Excel“ stehen. " + inhalt(x, "A7") }
  ];
}

/* ---------- Einheit 2: Daten eingeben ---------- */
const SPORT = { B2: 3.8, C2: 28, D2: 9.4, B3: 4.1, C3: 24.5, D3: 8.9, B4: 3.55, C4: 31, D4: 9.8, B5: 4.25, C5: 26, D5: 9.1 };
function pruefeSport(x) {
  const zellen = Object.keys(SPORT);
  const kopf = ["A1", "B1", "C1", "D1"].filter((a) => x.istText(a)).length, namen = ["A2", "A3", "A4", "A5"].filter((a) => x.istText(a)).length;
  const leer = zellen.filter((a) => x.leer(a)), keineZahl = zellen.filter((a) => !x.leer(a) && !x.istZahl(a));
  const datum = zellen.filter((a) => x.istDatum(a) || (x.istZahl(a) && x.wert(a) > 1000));
  const falsch = zellen.filter((a) => x.istZahl(a) && !datum.includes(a) && Math.abs(x.wert(a) - SPORT[a]) > 0.001);
  const okZahl = !leer.length && !keineZahl.length;
  return [
    { ok: kopf === 4, text: kopf === 4 ? "In Zeile 1 stehen vier Überschriften." : "In Zeile 1 sollen vier Überschriften stehen (A1 bis D1). Gefunden: " + kopf + "." },
    { ok: namen === 4, text: namen === 4 ? "In Spalte A stehen die vier Namen." : "In A2 bis A5 sollen die vier Namen stehen." },
    { ok: okZahl, text: okZahl ? "Alle zwölf Ergebnisse sind Zahlen." : [leer.length ? "Noch leer: " + leer.join(", ") + "." : "", keineZahl.length ? "Keine Zahl: " + keineZahl.join(", ") + ". Steht dort eine Einheit oder ein Tippfehler?" : ""].filter(Boolean).join(" ") },
    { ok: !datum.length, text: datum.length ? "Als Datum angezeigt: " + datum.join(", ") + ". Tippe die Zahl mit Komma – und stelle das Zahlenformat der Zelle auf „Standard“." : "Kein Ergebnis wird als Datum angezeigt." },
    { ok: !falsch.length && okZahl && !datum.length, text: falsch.length ? "Vertippt: " + falsch.map((a) => a + " soll " + zahlDe(SPORT[a]) + " sein").join(", ") + "." : (!okZahl || datum.length ? "Die Werte lassen sich erst vergleichen, wenn die Punkte darüber stimmen." : "Alle Werte stimmen mit der Vorlage überein.") }
  ];
}

/* ---------- Einheit 3: Erste Formeln ---------- */
const GELD = { B4: "Einnahmen: Taschengeld plus Zeitungen", B9: "Ausgaben: Handy plus Kino plus Snacks", B11: "Übrig im Monat: Einnahmen minus Ausgaben", B12: "Übrig im Jahr: Übrig im Monat mal 12", B13: "Übrig pro Woche: Übrig im Monat geteilt durch 4" };
function pruefeGeld(x) {
  // B11 bis B13 werden an den eigenen Zwischenergebnissen gemessen: Ein Fehler in B4 zählt nur einmal
  const soll = { B4: zahl(x, "B2") + zahl(x, "B3"), B9: zahl(x, "B6") + zahl(x, "B7") + zahl(x, "B8"), B11: zahl(x, "B4") - zahl(x, "B9"), B12: zahl(x, "B11") * 12, B13: zahl(x, "B11") / 4 };
  return Object.keys(GELD).map((a) => {
    const was = GELD[a];
    if (!x.hatFormel(a)) return { ok: false, text: a + ": Hier steht " + (x.leer(a) ? "noch nichts" : "keine Formel") + ". " + (ohneGleich(x, a) ? "Fehlt das Gleichheitszeichen am Anfang? " : "") + "Gesucht: " + was + "." };
    if (!x.bezuege(a).length) return { ok: false, text: a + ": In der Formel stehen nur feste Zahlen. Verwende Zelladressen wie B2." };
    if (typeof x.wert(a) === "string" && x.wert(a).charAt(0) === "#") return { ok: false, text: a + ": Die Zelle zeigt " + x.wert(a) + ". Verbessere zuerst die Zellen, mit denen diese Formel rechnet." };
    const ok = x.gleich(a, soll[a]);
    return { ok, text: ok ? a + ": " + x.formel(a) + " – stimmt." : a + ": Die Formel ergibt nicht den richtigen Wert. Gesucht: " + was + "." };
  });
}

/* ---------- Einheit 4: Formeln kopieren ---------- */
function pruefeEinkauf(x) {
  const punkte = [2, 3, 4, 5, 6].map((z) => {
    const a = "D" + z, soll = zahl(x, "B" + z) * zahl(x, "C" + z);
    if (!x.hatFormel(a)) return { ok: false, text: a + ": Hier steht " + (x.leer(a) ? "noch nichts. " : "keine Formel. ") + (z === 2 ? "Schreibe hier die Formel für Einzelpreis mal Menge." : "Kopiere die Formel aus D2 mit dem Ausfüllkästchen nach unten.") };
    const ok = x.gleich(a, soll) && x.bezuege(a).length >= 2;
    return { ok, text: ok ? a + ": " + x.formel(a) + " – stimmt." : a + ": Die Formel soll Einzelpreis mal Menge dieser Zeile rechnen." };
  });
  const summe = [2, 3, 4, 5, 6].reduce((s, z) => s + zahl(x, "D" + z), 0);
  const okS = x.hatFormel("D8") && x.gleich("D8", summe) && x.bezuege("D8").length >= 1;
  punkte.push({ ok: okS, text: okS ? "D8: " + x.formel("D8") + " zählt alles zusammen." : "D8: Hier soll eine Formel alle Gesamtpreise von D2 bis D6 zusammenzählen." });
  return punkte;
}

/* ---------- Einheit 5: Klassenfest ---------- */
function pruefeFest(x) {
  const punkte = [2, 3, 4, 5, 6].map((z) => {
    const a = "D" + z, ok = x.hatFormel(a) && x.bezuege(a).length >= 2 && x.gleich(a, zahl(x, "B" + z) * zahl(x, "C" + z));
    return { ok, text: ok ? a + ": " + x.formel(a) + " – stimmt." : a + ": Hier soll eine Formel Einzelpreis mal Anzahl rechnen." };
  });
  const summe = [2, 3, 4, 5, 6].reduce((s, z) => s + zahl(x, "D" + z), 0);
  const okS = x.hatFormel("D7") && x.bezuege("D7").length >= 1 && x.gleich("D7", summe);
  punkte.push({ ok: okS, text: okS ? "D7: " + x.formel("D7") + " zählt alle Kosten zusammen." : "D7: Hier soll eine Formel die Kosten von D2 bis D6 zusammenzählen." });
  const okK = x.hatFormel("B10") && x.bezuege("B10").length >= 2 && zahl(x, "B9") > 0 && x.gleich("B10", zahl(x, "D7") / zahl(x, "B9"));
  punkte.push({ ok: okK, text: okK ? "B10: " + x.formel("B10") + " teilt die Kosten durch die Zahl der Kinder." : "B10: Hier soll eine Formel die Kosten zusammen (D7) durch die Zahl der Kinder (B9) teilen." });
  return punkte;
}

// Die Tabelle herrichten: Geldbeträge in Euro, Überschriften fett – und die Formeln sind noch da
function pruefeFestFormat(x) {
  const euro = (zellen) => zellen.every((a) => x.istZahl(a) && x.istWaehrung(a));
  const preise = ["B2", "B3", "B4", "B5", "B6"], kosten = ["D2", "D3", "D4", "D5", "D6", "D7"], kopf = ["A1", "B1", "C1", "D1"];
  const okP = euro(preise), okK = euro(kosten), okB = euro(["B10"]), okF = kopf.every((a) => x.fett(a));
  const offen = pruefeFest(x).find((p) => !p.ok);
  const ohneEuro = (zellen) => zellen.filter((a) => !(x.istZahl(a) && x.istWaehrung(a))).join(", ");
  return [
    { ok: okP, text: okP ? "Die Einzelpreise B2 bis B6 werden in Euro angezeigt." : "Noch nicht in Euro: " + ohneEuro(preise) + ". Markiere die Zellen und wähle das Zahlenformat „Währung“." },
    { ok: okK, text: okK ? "Die Kosten D2 bis D7 werden in Euro angezeigt." : "Noch nicht in Euro: " + ohneEuro(kosten) + ". Markiere die Zellen und wähle das Zahlenformat „Währung“." },
    { ok: okB, text: okB ? "Die Kosten pro Kind in B10 werden in Euro angezeigt." : "B10 (Kosten pro Kind) wird noch nicht in Euro angezeigt." },
    { ok: okF, text: okF ? "Die Überschriften in Zeile 1 sind fett." : "Die Überschriften in Zeile 1 (A1 bis D1) sind noch nicht alle fett." },
    { ok: !offen, text: !offen ? "Alle Formeln sind noch da und rechnen richtig." : "Erst muss die Rechnung aus dem ersten Auftrag stimmen. " + offen.text + " Ein Euro-Zeichen tippst du nicht ein – das macht das Zahlenformat." }
  ];
}

// Ein Posten kommt dazu: neue Zeile 6 (Servietten), Formel in D6, Summe erfasst die neue Zeile
function pruefeFestZeile(x) {
  const okT = x.istText("A6") && /serv/i.test(String(x.wert("A6"))) && x.gleich("B6", 1.5, 0.001) && x.gleich("C6", 2, 0.001);
  const okF = x.hatFormel("D6") && x.bezuege("D6").length >= 2 && x.gleich("D6", zahl(x, "B6") * zahl(x, "C6"));
  const okAlt = x.hatFormel("D7") && x.gleich("D7", zahl(x, "B7") * zahl(x, "C7")) && zahl(x, "D7") > 0;
  const summe = [2, 3, 4, 5, 6, 7].reduce((s, z) => s + zahl(x, "D" + z), 0);
  const summeDa = x.hatFormel("D8") && x.bezuege("D8").length >= 1 && x.gleich("D8", summe), okS = summeDa && okF;
  const okK = x.hatFormel("B11") && zahl(x, "B10") > 0 && x.gleich("B11", zahl(x, "D8") / zahl(x, "B10"));
  return [
    { ok: okT, text: okT ? "In Zeile 6 stehen die Servietten mit Einzelpreis 1,5 und Anzahl 2." : "In die neue Zeile 6 gehören: Servietten (Packung), Einzelpreis 1,5, Anzahl 2." },
    { ok: okF, text: okF ? "D6: " + x.formel("D6") + " rechnet die Kosten der Servietten." : "D6: In der neuen Zeile fehlt noch die Formel für die Kosten. Hole sie dir aus D5." },
    { ok: okAlt, text: okAlt ? "Die Pappbecher sind eine Zeile nach unten gerutscht – ihre Formel rechnet weiter richtig." : "In Zeile 7 sollen jetzt die Pappbecher stehen, mit ihrer Formel in D7." },
    { ok: okS, text: okS ? "D8: " + x.formel("D8") + " zählt auch die neue Zeile mit." : summeDa ? "D8: Die Summen-Formel ist da. Sie stimmt, sobald in D6 die Formel für die Servietten steht." : "D8: Die Summe soll alle Kosten von D2 bis D7 zusammenzählen – auch die neue Zeile." },
    { ok: okK, text: okK ? "B11: Die Kosten pro Kind rechnen mit der neuen Summe." : "B11: Die Kosten pro Kind sollen die neue Summe (D8) durch die Zahl der Kinder (B10) teilen." }
  ];
}

/* ================= Modul 4: Zellbezüge und Anwendungen ================= */
// true, wenn die Formel in a die Zelle ziel mit festgemachter Zeile anspricht ($B$1 oder B$1) – nur so bleibt der
// Bezug beim Kopieren nach unten stehen
const fest = (x, a, ziel) => { const m = /^([A-Z]+)(\d+)$/.exec(ziel); return x.bezuege(a).some((b) => b === "$" + m[1] + "$" + m[2] || b === m[1] + "$" + m[2]); };
const nennt = (x, a, ziel) => x.bezuege(a).some((b) => b.replace(/\$/g, "") === ziel);
const summeVon = (x, spalte, von, bis) => { let s = 0; for (let z = von; z <= bis; z++) s += zahl(x, spalte + z); return s; };
const liste = (zellen) => zellen.join(", ");

/* ---------- Einheit 1: relative Zellbezüge (Wandertag) ---------- */
function pruefeWander(x) {
  const zeilen = [2, 3, 4, 5], spalten = ["B", "C", "D"];
  const offenD = zeilen.filter((z) => !(x.hatFormel("D" + z) && x.bezuege("D" + z).length >= 2 && x.gleich("D" + z, zahl(x, "B" + z) + zahl(x, "C" + z)))).map((z) => "D" + z);
  const getippt = offenD.filter((a) => !x.hatFormel(a) && !x.leer(a));
  const offenS = spalten.filter((s) => !(x.hatFormel(s + "6") && x.bezuege(s + "6").length >= 1 && x.gleich(s + "6", summeVon(x, s, 2, 5)))).map((s) => s + "6");
  const okD2 = !offenD.includes("D2");
  return [
    { ok: okD2, text: okD2 ? "D2: " + x.formel("D2") + " zählt Kinder und Begleitpersonen zusammen." : "D2: Hier soll eine Formel die Kinder (B2) und die Begleitpersonen (C2) zusammenzählen." },
    { ok: !offenD.length, text: !offenD.length ? "D3 bis D5: Die kopierten Formeln rechnen jede mit ihrer eigenen Zeile." : (getippt.length ? "Getippte Zahl statt Formel: " + liste(getippt) + ". " : "") + "Kopiere die Formel aus D2 mit dem Ausfüllkästchen nach unten bis D5. Noch offen: " + liste(offenD) + "." },
    { ok: !offenS.includes("B6"), text: !offenS.includes("B6") ? "B6: " + x.formel("B6") + " zählt alle Kinder zusammen." : "B6: Hier soll eine Formel die Kinder von B2 bis B5 zusammenzählen." },
    { ok: !offenS.includes("C6") && !offenS.includes("D6"), text: !offenS.includes("C6") && !offenS.includes("D6") ? "C6 und D6: Die nach rechts kopierten Formeln rechnen jede mit ihrer eigenen Spalte." : "Kopiere die Formel aus B6 mit dem Ausfüllkästchen nach rechts bis D6. Noch offen: " + liste(offenS.filter((a) => a !== "B6")) + "." }
  ];
}

/* ---------- Einheit 2: absolute Zellbezüge (Busfahrt) ---------- */
function pruefeBus(x) {
  const zeilen = [4, 5, 6, 7], preis = zahl(x, "B1");
  const wert = zeilen.filter((z) => !(x.hatFormel("C" + z) && x.gleich("C" + z, zahl(x, "B" + z) * preis))).map((z) => "C" + z);
  const ohneB1 = zeilen.filter((z) => x.hatFormel("C" + z) && !nennt(x, "C" + z, "B1")).map((z) => "C" + z);
  const ohneDollar = zeilen.filter((z) => nennt(x, "C" + z, "B1") && !fest(x, "C" + z, "B1")).map((z) => "C" + z);
  const okWert = !wert.length && preis > 0, okFest = okWert && !ohneB1.length && !ohneDollar.length;
  const okB8 = x.hatFormel("B8") && x.gleich("B8", summeVon(x, "B", 4, 7)), okC8 = x.hatFormel("C8") && x.gleich("C8", summeVon(x, "C", 4, 7)) && okWert;
  return [
    { ok: okWert, text: okWert ? "C4 bis C7: Alle Buskosten stimmen (Personen mal Preis pro Person)." : "Die Buskosten stimmen noch nicht in: " + liste(wert) + ". Jede Klasse zahlt Personen mal den Preis aus B1." },
    { ok: okFest, text: okFest ? "Der Bezug auf den Preis ist festgemacht: " + x.formel("C4") + "." : !okWert ? "Der Preis in B1 muss in jeder Formel festgemacht sein – mit Dollarzeichen." : ohneB1.length ? "In " + liste(ohneB1) + " steht der Preis als Zahl in der Formel. Verwende die Zelle B1 – dann rechnet alles neu, wenn sich der Preis ändert." : "In " + liste(ohneDollar) + " steht B1 ohne Dollarzeichen. Schreibe in C4 die Formel mit $B$1 und kopiere sie nach unten." },
    { ok: okB8, text: okB8 ? "B8: " + x.formel("B8") + " zählt alle Personen zusammen." : "B8: Hier soll eine Formel die Personen von B4 bis B7 zusammenzählen." },
    { ok: okC8, text: okC8 ? "C8: " + x.formel("C8") + " zählt alle Buskosten zusammen." : "C8: Hier soll eine Formel die Buskosten von C4 bis C7 zusammenzählen." }
  ];
}

/* ---------- Einheit 4: Prozent (Umfrage zum Schulweg) ---------- */
function pruefeUmfrage(x) {
  const zeilen = [2, 3, 4, 5, 6], gesamt = summeVon(x, "B", 2, 6);
  const okSumme = x.hatFormel("B7") && x.gleich("B7", gesamt) && gesamt > 0;
  const wert = zeilen.filter((z) => !(x.hatFormel("C" + z) && x.gleich("C" + z, zahl(x, "B" + z) / (gesamt || 1), 0.0005))).map((z) => "C" + z);
  const mal100 = zeilen.filter((z) => x.hatFormel("C" + z) && x.gleich("C" + z, 100 * zahl(x, "B" + z) / (gesamt || 1), 0.05)).map((z) => "C" + z);
  const ohneDollar = zeilen.filter((z) => x.hatFormel("C" + z) && !fest(x, "C" + z, "B7")).map((z) => "C" + z);
  const ohneFormat = zeilen.filter((z) => !x.istProzent("C" + z)).map((z) => "C" + z);
  const okWert = okSumme && !wert.length, okFest = okWert && !ohneDollar.length, okFormat = !ohneFormat.length && okWert;
  return [
    { ok: okSumme, text: okSumme ? "B7: " + x.formel("B7") + " zählt alle Stimmen zusammen." : "B7: Hier soll eine Formel alle Stimmen von B2 bis B6 zusammenzählen." },
    { ok: okWert, text: okWert ? "C2 bis C6: Jeder Anteil ist Stimmen geteilt durch alle Stimmen." : mal100.length ? "In " + liste(mal100) + " wird noch mal 100 gerechnet. Lass das weg – das Prozentformat erledigt die Anzeige." : "Der Anteil stimmt noch nicht in: " + liste(wert) + ". Rechne Stimmen geteilt durch alle Stimmen (B7)." },
    { ok: okFest, text: okFest ? "Der Bezug auf alle Stimmen ist festgemacht: " + x.formel("C2") + "." : !okWert ? "Der Bezug auf B7 muss festgemacht sein, damit er beim Kopieren stehen bleibt." : "In " + liste(ohneDollar) + " steht B7 ohne Dollarzeichen. Schreibe in C2 die Formel mit $B$7 und kopiere sie nach unten." },
    { ok: okFormat, text: okFormat ? "Die Anteile werden in Prozent angezeigt." : ohneFormat.length ? "Noch nicht als Prozent angezeigt: " + liste(ohneFormat) + ". Markiere die Zellen und klicke auf das Prozentzeichen." : "Die Anteile werden als Prozent angezeigt, aber die Werte stimmen noch nicht." }
  ];
}

/* ---------- Einheit 5: Mini-Projekt Pausenverkauf ---------- */
function pruefeVerkauf(x) {
  const zeilen = [4, 5, 6, 7], auf = zahl(x, "B1");
  const falsch = (spalte, soll) => zeilen.filter((z) => !(x.hatFormel(spalte + z) && x.gleich(spalte + z, soll(z)))).map((z) => spalte + z);
  const c = falsch("C", (z) => zahl(x, "B" + z) + auf), cDollar = zeilen.filter((z) => x.hatFormel("C" + z) && !fest(x, "C" + z, "B1")).map((z) => "C" + z);
  const e = falsch("E", (z) => zahl(x, "C" + z) * zahl(x, "D" + z)), f = falsch("F", (z) => zahl(x, "B" + z) * zahl(x, "D" + z)), g = falsch("G", (z) => zahl(x, "E" + z) - zahl(x, "F" + z));
  const s = ["D", "E", "F", "G"].filter((sp) => !(x.hatFormel(sp + "8") && x.gleich(sp + "8", summeVon(x, sp, 4, 7)))).map((sp) => sp + "8");
  const okC = !c.length && !cDollar.length, okRest = !e.length && !f.length && !g.length && okC;
  return [
    { ok: okC, text: okC ? "Verkaufspreis: " + x.formel("C4") + " – der Aufschlag aus B1 ist festgemacht." : c.length ? "Der Verkaufspreis stimmt noch nicht in: " + liste(c) + ". Rechne Einkaufspreis plus den Aufschlag aus B1 – mit festgemachtem Bezug." : "In " + liste(cDollar) + " ist der Aufschlag B1 nicht festgemacht. Schreibe $B$1 und kopiere die Formel aus C4." },
    { ok: !e.length && okC, text: !e.length && okC ? "Einnahmen: Verkaufspreis mal verkaufte Stück." : e.length ? "Die Einnahmen stimmen noch nicht in: " + liste(e) + ". Rechne Verkaufspreis mal verkaufte Stück." : "Die Einnahmen stimmen erst, wenn die Verkaufspreise stimmen." },
    { ok: !f.length, text: !f.length ? "Kosten: Einkaufspreis mal verkaufte Stück." : "Die Kosten stimmen noch nicht in: " + liste(f) + ". Rechne Einkaufspreis mal verkaufte Stück." },
    { ok: !g.length && okRest, text: !g.length && okRest ? "Gewinn: Einnahmen minus Kosten." : g.length ? "Der Gewinn stimmt noch nicht in: " + liste(g) + ". Rechne Einnahmen minus Kosten." : "Der Gewinn stimmt erst, wenn die Spalten davor stimmen." },
    { ok: !s.length && okRest, text: !s.length && okRest ? "Zeile 8: Die Summen stimmen – Gewinn zusammen: " + String(Math.round(zahl(x, "G8") * 100) / 100).replace(".", ",") + " €." : s.length ? "In Zeile 8 fehlt noch eine Summen-Formel in: " + liste(s) + "." : "Die Summen stimmen erst, wenn die Zeilen darüber stimmen." }
  ];
}
function pruefeAnteil(x) {
  const zeilen = [4, 5, 6, 7], gesamt = zahl(x, "G8");
  const basis = pruefeVerkauf(x).every((p) => p.ok);
  const wert = zeilen.filter((z) => !(x.hatFormel("H" + z) && gesamt > 0 && x.gleich("H" + z, zahl(x, "G" + z) / gesamt, 0.0005))).map((z) => "H" + z);
  const ohneDollar = zeilen.filter((z) => x.hatFormel("H" + z) && !fest(x, "H" + z, "G8")).map((z) => "H" + z);
  const ohneFormat = zeilen.filter((z) => !x.istProzent("H" + z)).map((z) => "H" + z);
  const okWert = !wert.length, okFest = okWert && !ohneDollar.length;
  return [
    { ok: basis, text: basis ? "Die Tabelle aus dem ersten Auftrag rechnet weiter richtig." : "In der Tabelle aus dem ersten Auftrag stimmt etwas nicht mehr. Prüfe die Spalten C bis G und die Summen." },
    { ok: okWert, text: okWert ? "H4 bis H7: Jeder Anteil ist Gewinn des Artikels geteilt durch den Gewinn zusammen." : "Der Anteil stimmt noch nicht in: " + liste(wert) + ". Rechne Gewinn des Artikels geteilt durch den Gewinn zusammen (G8)." },
    { ok: okFest, text: okFest ? "Der Bezug auf den Gewinn zusammen ist festgemacht: " + x.formel("H4") + "." : !okWert ? "Der Bezug auf G8 muss festgemacht sein, damit er beim Kopieren stehen bleibt." : "In " + liste(ohneDollar) + " steht G8 ohne Dollarzeichen." },
    { ok: !ohneFormat.length && okWert, text: !ohneFormat.length && okWert ? "Die Anteile werden in Prozent angezeigt." : ohneFormat.length ? "Noch nicht als Prozent angezeigt: " + liste(ohneFormat) + "." : "Das Prozentformat stimmt, die Werte noch nicht." }
  ];
}

module.exports = {
  "kennenlernen-auf1": {
    titel: "Drei Zellen füllen und speichern",
    auftrag: "Erste Mappe in Excel: In die Zelle B2 das Wort Hallo, in D5 die Zahl 2027 und in A7 das Wort Excel schreiben, dann speichern.",
    pruefe: pruefeErste
  },
  "eingeben-auf1": {
    titel: "Ergebnisse vom Sportfest eintragen",
    auftrag: "Eine Tabelle anlegen: Zeile 1 mit den Überschriften Name, Weitsprung in m, Wurf in m, Lauf in s. Darunter vier Kinder (Ali, Mia, Jonas, Elif) mit je drei Ergebnissen. Alle Ergebnisse müssen Zahlen sein: mit Komma, ohne Einheit.",
    pruefe: pruefeSport
  },
  "eingeben-aufFehler": {
    titel: "Die Tabelle reparieren",
    auftrag: "In einer fertigen Sportfest-Tabelle stecken drei Eingabefehler (ein Punkt statt Komma, der zu einem Datum wurde, und zwei Zahlen mit Einheit dahinter). Das Kind soll sie finden und verbessern. Die Datums-Zelle braucht zusätzlich das Zahlenformat Standard.",
    pruefe: pruefeSport
  },
  "formeln-auf1": {
    titel: "Einnahmen, Ausgaben und was übrig bleibt",
    auftrag: "Taschengeld-Tabelle: In B4 die Einnahmen (B2 plus B3), in B9 die Ausgaben (B6 bis B8), in B11 Einnahmen minus Ausgaben, in B12 das Ergebnis mal 12, in B13 das Ergebnis geteilt durch 4. Überall sollen Formeln mit Zelladressen stehen, keine getippten Ergebnisse.",
    pruefe: pruefeGeld
  },
  "kopieren-auf1": {
    titel: "Gesamtpreise ausrechnen und zusammenzählen",
    auftrag: "Einkaufsliste: In D2 die Formel Einzelpreis mal Menge schreiben und mit dem Ausfüllkästchen bis D6 nach unten kopieren. In D8 alle Gesamtpreise zusammenzählen.",
    pruefe: pruefeEinkauf
  },
  "anwendung-auf1": {
    titel: "Was kostet das Klassenfest?",
    auftrag: "Kostenplan für ein Klassenfest: In D2 bis D6 Einzelpreis mal Anzahl (Formel schreiben und kopieren), in D7 die Kosten zusammen, in B10 die Kosten pro Kind (Kosten zusammen geteilt durch die Zahl der Kinder in B9).",
    pruefe: pruefeFest
  },
  "anwendung-auf2": {
    titel: "Die Tabelle herrichten",
    auftrag: "Den Kostenplan für das Klassenfest herrichten: Alle Geldbeträge (B2 bis B6, D2 bis D7 und B10) mit dem Zahlenformat Währung in Euro anzeigen, die Überschriften in Zeile 1 fett machen. Die Formeln bleiben stehen.",
    pruefe: pruefeFestFormat
  },
  "anwendung-aufM": {
    titel: "Ein Posten kommt dazu",
    auftrag: "In den Kostenplan eine Zeile einfügen (neue Zeile 6: Servietten, Einzelpreis 1,5, Anzahl 2), die Formel für die Kosten aus der Zeile darüber nachziehen und prüfen, dass die Summe die neue Zeile mitzählt.",
    pruefe: pruefeFestZeile
  },
  "relativ-auf1": {
    titel: "Wer kommt mit zum Wandertag?",
    auftrag: "Tabelle zum Wandertag: In D2 Kinder plus Begleitpersonen rechnen und die Formel nach unten bis D5 kopieren. In B6 alle Kinder zusammenzählen und diese Formel nach rechts bis D6 kopieren. Es geht um relative Zellbezüge: Beim Kopieren passt Excel die Bezüge an.",
    pruefe: pruefeWander
  },
  "absolut-auf1": {
    titel: "Was kostet der Bus?",
    auftrag: "Buskosten für vier Klassen: Der Preis pro Person steht nur einmal in B1. In C4 Personen mal Preis rechnen – mit absolutem Zellbezug $B$1 – und nach unten bis C7 kopieren. In B8 und C8 zusammenzählen.",
    pruefe: pruefeBus
  },
  "prozent-auf1": {
    titel: "Umfrage auswerten",
    auftrag: "Umfrage zum Schulweg: In B7 alle Stimmen zusammenzählen. In C2 den Anteil rechnen (Stimmen geteilt durch alle Stimmen, mit absolutem Bezug $B$7), nach unten kopieren und als Prozent anzeigen lassen.",
    pruefe: pruefeUmfrage
  },
  "miniprojekt-auf1": {
    titel: "Der Pausenverkauf rechnet sich",
    auftrag: "Mini-Projekt Pausenverkauf: Verkaufspreis = Einkaufspreis plus Aufschlag aus B1 (absoluter Bezug), Einnahmen = Verkaufspreis mal verkaufte Stück, Kosten = Einkaufspreis mal verkaufte Stück, Gewinn = Einnahmen minus Kosten; alle Formeln nach unten kopieren, in Zeile 8 Summen bilden.",
    pruefe: pruefeVerkauf
  },
  "miniprojekt-aufM": {
    titel: "Welcher Artikel bringt am meisten?",
    auftrag: "Mini-Projekt Pausenverkauf, Zusatz: In Spalte H den Anteil jedes Artikels am Gewinn ausrechnen (Gewinn des Artikels geteilt durch den Gewinn zusammen, absoluter Bezug $G$8), nach unten kopieren und als Prozent anzeigen.",
    pruefe: pruefeAnteil
  }
};
