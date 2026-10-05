"use strict";

// Excel-Aufträge (Informatik 8): Datei lesen, Punkte exakt prüfen, KI schreibt nur die Rückmeldung.
// Die Mappen werden hier so gebaut, wie Excel sie speichert (Texte in sharedStrings, kopierte Formeln als
// „shared formula“, Zahlenformat und Schrift über styles.xml). Mit Dateien aus echtem Excel wird zusätzlich lokal
// geprüft – Musterlösungen liegen in keinem Repo.
const assert = require("node:assert/strict");
const test = require("node:test");
const express = require("express");
const { zip } = require("./xlsx-mini");
const { registerExcelPruefung, liesXlsx, tabellenText } = require("./excelpruefung");
const AUFGABEN = require("./inf8-excel-aufgaben");

const NS = 'xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"';
// Stile: 0 Standard · 1 Datum („04. Okt“) · 2 Währung · 3 fett · 4 Prozent
const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet ${NS}>
<numFmts count="1"><numFmt numFmtId="164" formatCode="#,##0.00\\ &quot;€&quot;"/></numFmts>
<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>
<fills count="1"><fill><patternFill patternType="none"/></fill></fills><borders count="1"><border/></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="5"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="16" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>
<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"><alignment horizontal="right"/></xf><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="9" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs></styleSheet>`;
const xmlText = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// zellen: { A1: "Text", B2: 3.5, D2: { f: "B2*C2", v: 36 }, D2: { f: "B2*C2", v: 36, bereich: "D2:D6", si: 0 },
//           D3: { si: 0, v: 32.4 } (kopierte Formel), B3: { v: 46299, s: 1 }, A1: { v: "Posten", s: 3 }, C1: { v: "#DIV/0!", fehler: true } }
function mappe(zellen, verfasser = "Vorname Nachname") {
  const texte = [], zeilen = {};
  for (const [a, roh] of Object.entries(zellen)) {
    const z = roh !== null && typeof roh === "object" ? roh : { v: roh };
    const stil = z.s ? ` s="${z.s}"` : "";
    let f = "";
    if (z.f && z.bereich) f = `<f t="shared" ref="${z.bereich}" si="${z.si}">${xmlText(z.f)}</f>`;
    else if (z.f) f = `<f>${xmlText(z.f)}</f>`;
    else if (z.si != null) f = `<f t="shared" si="${z.si}"/>`;
    let c;
    if (z.fehler) c = `<c r="${a}"${stil} t="e">${f}<v>${xmlText(z.v)}</v></c>`;
    else if (typeof z.v === "string") { let i = texte.indexOf(z.v); if (i < 0) i = texte.push(z.v) - 1; c = `<c r="${a}"${stil} t="s"><v>${i}</v></c>`; }
    else if (z.v === undefined) c = `<c r="${a}"${stil}/>`;
    else c = `<c r="${a}"${stil}>${f}<v>${z.v}</v></c>`;
    const nr = +a.replace(/\D/g, "");
    (zeilen[nr] = zeilen[nr] || []).push([a, c]);
  }
  const daten = Object.keys(zeilen).map(Number).sort((p, q) => p - q)
    .map((nr) => `<row r="${nr}">${zeilen[nr].sort((p, q) => (p[0] < q[0] ? -1 : 1)).map((x) => x[1]).join("")}</row>`).join("");
  return zip([
    { name: "[Content_Types].xml", data: '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"/>' },
    { name: "docProps/core.xml", data: `<cp:coreProperties xmlns:cp="x" xmlns:dc="y"><dc:creator>${verfasser}</dc:creator><cp:lastModifiedBy>${verfasser}</cp:lastModifiedBy></cp:coreProperties>` },
    { name: "xl/workbook.xml", data: `<?xml version="1.0"?><workbook ${NS} xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Tabelle1" sheetId="1" r:id="rId1"/></sheets></workbook>` },
    { name: "xl/_rels/workbook.xml.rels", data: '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="x" Target="styles.xml"/></Relationships>' },
    { name: "xl/worksheets/sheet1.xml", data: `<?xml version="1.0"?><worksheet ${NS}><sheetViews><sheetView workbookViewId="0"/></sheetViews><cols><col min="1" max="1" width="24" customWidth="1"/></cols><sheetData>${daten}</sheetData></worksheet>` },
    { name: "xl/styles.xml", data: STYLES },
    { name: "xl/sharedStrings.xml", data: `<?xml version="1.0"?><sst ${NS}>${texte.map((t) => `<si><t>${xmlText(t)}</t></si>`).join("")}</sst>` }
  ]);
}

/* ---------- Beispielmappen ---------- */
const FEST_START = {
  A1: "Posten", B1: "Einzelpreis", C1: "Anzahl", D1: "Kosten",
  A2: "Pizza (Stück)", B2: 2.5, C2: 30, A3: "Getränke (Flasche)", B3: 0.8, C3: 40, A4: "Luftballons (Packung)", B4: 1.9, C4: 4,
  A5: "Musikbox (Leihgebühr)", B5: 15, C5: 1, A6: "Pappbecher (Packung)", B6: 2.2, C6: 3,
  A7: "Kosten zusammen", A9: "Kinder in der Klasse", B9: 24, A10: "Kosten pro Kind"
};
const FEST = Object.assign({}, FEST_START, {
  D2: { f: "B2*C2", v: 75, bereich: "D2:D6", si: 0 }, D3: { si: 0, v: 32 }, D4: { si: 0, v: 7.6 }, D5: { si: 0, v: 15 }, D6: { si: 0, v: 6.6 },
  D7: { f: "SUM(D2:D6)", v: 136.2 }, B10: { f: "D7/B9", v: 5.675 }
});
const mitStil = (zellen, adressen, s) => { const neu = Object.assign({}, zellen); adressen.forEach((a) => { const z = neu[a]; neu[a] = Object.assign({}, z !== null && typeof z === "object" ? z : { v: z }, { s }); }); return neu; };
const FEST_SCHOEN = mitStil(mitStil(FEST, ["B2", "B3", "B4", "B5", "B6", "D2", "D3", "D4", "D5", "D6", "D7", "B10"], 2), ["A1", "B1", "C1", "D1"], 3);
const SPORT = {
  A1: "Name", B1: "Weitsprung in m", C1: "Wurf in m", D1: "Lauf in s",
  A2: "Ali", B2: 3.8, C2: 28, D2: 9.4, A3: "Mia", B3: 4.1, C3: 24.5, D3: 8.9, A4: "Jonas", B4: 3.55, C4: 31, D4: 9.8, A5: "Elif", B5: 4.25, C5: 26, D5: 9.1
};
const GELD_START = { A1: "Wofür?", B1: "Euro", A2: "Taschengeld", B2: 30, A3: "Zeitungen austragen", B3: 45, A4: "Einnahmen", A6: "Handy", B6: 12, A7: "Kino", B7: 9, A8: "Snacks", B8: 14.5, A9: "Ausgaben", A11: "Übrig im Monat", A12: "Übrig im Jahr", A13: "Übrig pro Woche" };
const GELD = Object.assign({}, GELD_START, { B4: { f: "B2+B3", v: 75 }, B9: { f: "B6+B7+B8", v: 35.5 }, B11: { f: "B4-B9", v: 39.5 }, B12: { f: "B11*12", v: 474 }, B13: { f: "B11/4", v: 9.875 } });
const EINKAUF_START = { A1: "Artikel", B1: "Einzelpreis", C1: "Menge", D1: "Gesamtpreis", A2: "Wasser", B2: 0.6, C2: 48, A3: "Apfelschorle", B3: 0.9, C3: 36, A4: "Brezeln", B4: 0.75, C4: 60, A5: "Bananen", B5: 0.4, C5: 50, A6: "Müsliriegel", B6: 0.85, C6: 40, A8: "Alles zusammen" };
const EINKAUF = Object.assign({}, EINKAUF_START, { D2: { f: "B2*C2", v: 28.8, bereich: "D2:D6", si: 0 }, D3: { si: 0, v: 32.4 }, D4: { si: 0, v: 45 }, D5: { si: 0, v: 20 }, D6: { si: 0, v: 34 }, D8: { f: "D2+D3+D4+D5+D6", v: 160.2 } });

const besteht = (aufgabe, zellen) => { const p = AUFGABEN[aufgabe].pruefe(liesXlsx(mappe(zellen))); return p.length > 0 && p.every((x) => x.ok); };

test("Mappe lesen: Texte, Zahlen, Formeln in deutscher Schreibweise, kopierte Formeln, Anzeige", () => {
  const x = liesXlsx(mappe(Object.assign({}, FEST_SCHOEN, { E1: { f: "ROUND(SUM(D2:D6)*1.5,1)", v: 204.3 }, E2: { f: "D2/0", v: "#DIV/0!", fehler: true }, E3: { v: 46299, s: 1 }, E4: { v: 0.19, s: 4 }, E5: "Fisch & Chips <neu>" })));
  assert.equal(x.wert("A2"), "Pizza (Stück)");
  assert.equal(x.wert("b2"), 2.5, "Adresse auch klein geschrieben");
  assert.equal(x.formel("D2"), "=B2*C2");
  assert.equal(x.formel("D5"), "=B5*C5", "kopierte Formel: Bezüge werden für jede Zelle verschoben");
  assert.equal(x.wert("D6"), 6.6);
  assert.equal(x.formel("D7"), "=SUMME(D2:D6)");
  assert.equal(x.formel("E1"), "=RUNDEN(SUMME(D2:D6)*1,5;1)", "Funktionsnamen, Dezimalkomma und Strichpunkt");
  assert.deepEqual(x.bezuege("D7"), ["D2", "D6"]);
  assert.equal(x.wert("E2"), "#DIV/0!");
  assert.ok(x.istDatum("E3") && x.istProzent("E4") && x.istWaehrung("B10") && !x.istWaehrung("C2"));
  assert.ok(x.fett("A1") && !x.fett("A2"));
  assert.equal(x.wert("E5"), "Fisch & Chips <neu>");
  assert.ok(x.leer("D8") && !x.leer("D7") && x.istText("A1") && !x.istText("D2") && x.istZahl("D2"));
  assert.ok(x.gleich("B10", 5.675) && !x.gleich("B10", 5.7));
  assert.match(tabellenText(x), /D7: Formel =SUMME\(D2:D6\) ergibt 136,2 \(Anzeige in Euro\)/);
});

test("Keine Excel-Datei: liesXlsx wirft", () => {
  assert.throws(() => liesXlsx(Buffer.from("Das ist ein Text.")));
  assert.throws(() => liesXlsx(zip([{ name: "projekt/konfiguration.xml", data: "<x/>" }])), "ZIP ohne Mappe (z. B. eine Filius-Datei)");
});

test("Jede Aufgabe: Die richtige Tabelle besteht, der Anfangszustand fällt durch", () => {
  assert.ok(besteht("kennenlernen-auf1", { B2: "Hallo", D5: 2027, A7: "Excel" }));
  assert.ok(besteht("kennenlernen-auf1", { B2: " hallo ", D5: 2027, A7: "EXCEL" }), "Groß- und Kleinschreibung zählt nicht");
  assert.ok(!besteht("kennenlernen-auf1", { B2: "Hallo", D5: "2027", A7: "Excel" }), "2027 als Text");
  assert.ok(besteht("eingeben-auf1", SPORT));
  assert.ok(besteht("formeln-auf1", GELD) && !besteht("formeln-auf1", GELD_START));
  assert.ok(besteht("kopieren-auf1", EINKAUF) && !besteht("kopieren-auf1", EINKAUF_START));
  assert.ok(besteht("anwendung-auf1", FEST) && !besteht("anwendung-auf1", FEST_START));
  assert.ok(besteht("anwendung-auf2", FEST_SCHOEN) && !besteht("anwendung-auf2", FEST));
});

test("Sportfest: Einheit hinter der Zahl, Datum statt Zahl, vertippt", () => {
  const punkte = (z) => AUFGABEN["eingeben-aufFehler"].pruefe(liesXlsx(mappe(Object.assign({}, SPORT, z))));
  assert.match(punkte({ C4: "31 m" }).find((p) => !p.ok).text, /Keine Zahl: C4/);
  assert.match(punkte({ B3: { v: 46299, s: 1 } }).find((p) => !p.ok).text, /Als Datum angezeigt: B3/);
  assert.match(punkte({ B3: { v: 4.1, s: 1 } }).find((p) => !p.ok).text, /Als Datum angezeigt: B3/, "richtige Zahl, aber die Zelle ist noch ein Datum");
  assert.match(punkte({ D5: 9.7 }).find((p) => !p.ok).text, /D5 soll 9,1 sein/);
});

test("Formeln: getippte Ergebnisse fallen durch, geänderte Zahlen und andere Schreibweisen bestehen", () => {
  assert.ok(!besteht("formeln-auf1", Object.assign({}, GELD_START, { B4: 75, B9: 35.5, B11: 39.5, B12: 474, B13: 9.875 })), "Ergebnisse getippt");
  assert.ok(!besteht("formeln-auf1", Object.assign({}, GELD, { B4: { f: "30+45", v: 75 } })), "Formel nur mit festen Zahlen");
  assert.ok(besteht("formeln-auf1", Object.assign({}, GELD, { B2: 35, B4: { f: "SUM(B2:B3)", v: 80 }, B11: { f: "B4-B9", v: 44.5 }, B12: { f: "12*B11", v: 534 }, B13: { f: "B11/4", v: 11.125 } })), "Taschengeld geändert, SUMME");
  assert.ok(!besteht("kopieren-auf1", Object.assign({}, EINKAUF, { D3: 32.4 })), "eine Zeile getippt statt kopiert");
  assert.ok(!besteht("kopieren-auf1", Object.assign({}, EINKAUF, { D3: { f: "B2*C2", v: 28.8 } })), "Formel der falschen Zeile");
  assert.ok(besteht("kopieren-auf1", Object.assign({}, EINKAUF, { D8: { f: "SUM(D2:D6)", v: 160.2 } })));
  assert.ok(!besteht("anwendung-auf1", Object.assign({}, FEST, { D7: 136.2 })), "Summe getippt");
  assert.ok(besteht("anwendung-auf1", Object.assign({}, FEST, { C2: 36, B9: 30, D2: { f: "B2*C2", v: 90, bereich: "D2:D6", si: 0 }, D7: { f: "SUM(D2:D6)", v: 151.2 }, B10: { f: "D7/B9", v: 5.04 } })), "mehr Pizzen, mehr Kinder");
});

test("Klassenfest: neue Zeile mit Servietten", () => {
  const MIT = {
    A1: "Posten", B1: "Einzelpreis", C1: "Anzahl", D1: "Kosten", A2: "Pizza (Stück)", B2: 2.5, C2: 30, A3: "Getränke (Flasche)", B3: 0.8, C3: 40,
    A4: "Luftballons (Packung)", B4: 1.9, C4: 4, A5: "Musikbox (Leihgebühr)", B5: 15, C5: 1, A6: "Servietten (Packung)", B6: 1.5, C6: 2, A7: "Pappbecher (Packung)", B7: 2.2, C7: 3,
    D2: { f: "B2*C2", v: 75, bereich: "D2:D5", si: 0 }, D3: { si: 0, v: 32 }, D4: { si: 0, v: 7.6 }, D5: { si: 0, v: 15 }, D6: { f: "B6*C6", v: 3 }, D7: { f: "B7*C7", v: 6.6 },
    A8: "Kosten zusammen", D8: { f: "SUM(D2:D7)", v: 139.2 }, A10: "Kinder in der Klasse", B10: 24, A11: "Kosten pro Kind", B11: { f: "D8/B10", v: 5.8, s: 2 }
  };
  assert.ok(besteht("anwendung-aufM", MIT));
  assert.ok(!besteht("anwendung-aufM", FEST), "ohne neue Zeile");
  const ohneFormel = Object.assign({}, MIT, { D8: { f: "SUM(D2:D7)", v: 136.2 } }); delete ohneFormel.D6;
  const p = AUFGABEN["anwendung-aufM"].pruefe(liesXlsx(mappe(ohneFormel)));
  assert.match(p.find((x) => !x.ok).text, /D6: In der neuen Zeile fehlt noch die Formel/);
});

/* ---------- Modul 4: Zellbezüge und Anwendungen ---------- */
const kopiert = (erste, bereich, werte, formel) => { const [sp, z0] = [bereich[0], +bereich.slice(1).split(":")[0]]; const aus = {}; werte.forEach((v, i) => { aus[sp + (z0 + i)] = i ? { si: 7, v } : { f: formel, v, bereich, si: 7 }; }); return aus; };
const WANDER_START = { A1: "Klasse", B1: "Kinder", C1: "Begleitpersonen", D1: "Personen", A2: "8a", B2: 26, C2: 3, A3: "8b", B3: 24, C3: 2, A4: "8c", B4: 27, C4: 3, A5: "8d", B5: 23, C5: 2, A6: "Zusammen" };
const WANDER = Object.assign({}, WANDER_START, kopiert("D2", "D2:D5", [29, 26, 30, 25], "B2+C2"), { B6: { f: "SUM(B2:B5)", v: 100 }, C6: { f: "SUM(C2:C5)", v: 10 }, D6: { f: "SUM(D2:D5)", v: 110 } });
const BUS_START = { A1: "Preis pro Person", B1: 6.5, A3: "Klasse", B3: "Personen", C3: "Buskosten", A4: "8a", B4: 29, A5: "8b", B5: 26, A6: "8c", B6: 30, A7: "8d", B7: 25, A8: "Zusammen" };
const BUS = Object.assign({}, BUS_START, kopiert("C4", "C4:C7", [188.5, 169, 195, 162.5], "B4*$B$1"), { B8: { f: "SUM(B4:B7)", v: 110 }, C8: { f: "SUM(C4:C7)", v: 715 } });
const UMFRAGE_START = { A1: "Schulweg", B1: "Stimmen", C1: "Anteil", A2: "zu Fuß", B2: 42, A3: "Fahrrad", B3: 56, A4: "Bus", B4: 70, A5: "Auto", B5: 22, A6: "Roller", B6: 10, A7: "Zusammen" };
const anteile = (s) => ({ C2: { f: "B2/$B$7", v: 0.21, s }, C3: { f: "B3/$B$7", v: 0.28, s }, C4: { f: "B4/$B$7", v: 0.35, s }, C5: { f: "B5/$B$7", v: 0.11, s }, C6: { f: "B6/$B$7", v: 0.05, s } });
const UMFRAGE = Object.assign({}, UMFRAGE_START, { B7: { f: "SUM(B2:B6)", v: 200 } }, anteile(4));
const VERKAUF_START = { A1: "Aufschlag je Stück", B1: 0.4, A3: "Artikel", B3: "Einkaufspreis", C3: "Verkaufspreis", D3: "verkauft", E3: "Einnahmen", F3: "Kosten", G3: "Gewinn",
  A4: "Butterbreze", B4: 0.55, D4: 48, A5: "Apfel", B5: 0.3, D5: 35, A6: "Müsliriegel", B6: 0.45, D6: 40, A7: "Saftschorle", B7: 0.6, D7: 52, A8: "Zusammen" };
const spalte = (sp, formel, werte) => { const aus = {}; werte.forEach((v, i) => { aus[sp + (4 + i)] = { f: formel(4 + i), v }; }); return aus; };
const VERKAUF = Object.assign({}, VERKAUF_START, spalte("C", (z) => `B${z}+$B$1`, [0.95, 0.7, 0.85, 1]), spalte("E", (z) => `C${z}*D${z}`, [45.6, 24.5, 34, 52]), spalte("F", (z) => `B${z}*D${z}`, [26.4, 10.5, 18, 31.2]),
  spalte("G", (z) => `E${z}-F${z}`, [19.2, 14, 16, 20.8]), { D8: { f: "SUM(D4:D7)", v: 175 }, E8: { f: "SUM(E4:E7)", v: 156.1 }, F8: { f: "SUM(F4:F7)", v: 86.1 }, G8: { f: "SUM(G4:G7)", v: 70 } });
const ANTEIL = Object.assign({}, VERKAUF, { H3: "Anteil am Gewinn", H4: { f: "G4/$G$8", v: 19.2 / 70, s: 4 }, H5: { f: "G5/$G$8", v: 0.2, s: 4 }, H6: { f: "G6/$G$8", v: 16 / 70, s: 4 }, H7: { f: "G7/$G$8", v: 20.8 / 70, s: 4 } });
const offen = (aufgabe, zellen) => AUFGABEN[aufgabe].pruefe(liesXlsx(mappe(zellen))).filter((p) => !p.ok).map((p) => p.text).join(" | ");

test("Modul 4: Musterlösungen bestehen, Startdateien fallen durch", () => {
  for (const [aufgabe, loesung, start] of [["relativ-auf1", WANDER, WANDER_START], ["absolut-auf1", BUS, BUS_START], ["prozent-auf1", UMFRAGE, UMFRAGE_START], ["miniprojekt-auf1", VERKAUF, VERKAUF_START], ["miniprojekt-aufM", ANTEIL, VERKAUF]]) {
    assert.equal(offen(aufgabe, loesung), "", aufgabe + ": Musterlösung");
    assert.notEqual(offen(aufgabe, start), "", aufgabe + ": Startdatei");
  }
  assert.equal(offen("miniprojekt-auf1", ANTEIL), "", "die Fassung mit Anteilen besteht auch den ersten Auftrag");
});

test("Relative Bezüge: getippte Zahlen statt kopierter Formeln", () => {
  assert.match(offen("relativ-auf1", Object.assign({}, WANDER, { D3: 26, D4: 30 })), /Getippte Zahl statt Formel: D3, D4/);
  assert.match(offen("relativ-auf1", Object.assign({}, WANDER, { C6: 10 })), /nach rechts bis D6\. Noch offen: C6/);
  assert.equal(offen("relativ-auf1", Object.assign({}, WANDER, { B6: { f: "B2+B3+B4+B5", v: 100 } })), "", "Plus-Kette statt SUMME");
});

test("Absolute Bezüge: ohne Dollar, feste Zahl, gemischter Bezug, geänderter Preis", () => {
  const ohne = Object.assign({}, BUS, { C4: { f: "B4*B1", v: 188.5 }, C5: { f: "B5*B2", v: 0 }, C6: { f: "B6*B3", v: "#VALUE!", fehler: true }, C7: { f: "B7*B4", v: 725 } });
  assert.match(offen("absolut-auf1", ohne), /stimmen noch nicht in: C5, C6, C7/);
  const einzeln = Object.assign({}, BUS, { C4: { f: "B4*B1", v: 188.5 }, C5: { f: "B5*B1", v: 169 }, C6: { f: "B6*B1", v: 195 }, C7: { f: "B7*B1", v: 162.5 } });
  assert.match(offen("absolut-auf1", einzeln), /steht B1 ohne Dollarzeichen/);
  const zahl = Object.assign({}, BUS, { C4: { f: "B4*6.5", v: 188.5 }, C5: { f: "B5*6.5", v: 169 }, C6: { f: "B6*6.5", v: 195 }, C7: { f: "B7*6.5", v: 162.5 } });
  assert.match(offen("absolut-auf1", zahl), /steht der Preis als Zahl in der Formel/);
  const gemischt = Object.assign({}, BUS, { B1: 7, C4: { f: "B$1*B4", v: 203 }, C5: { f: "B$1*B5", v: 182 }, C6: { f: "B$1*B6", v: 210 }, C7: { f: "B$1*B7", v: 175 }, C8: { f: "C4+C5+C6+C7", v: 770 } });
  assert.equal(offen("absolut-auf1", gemischt), "", "B$1 bleibt beim Kopieren nach unten stehen; Preis 7");
});

test("Prozent: ohne Format, mal 100, ohne Dollar, getippt", () => {
  assert.match(offen("prozent-auf1", Object.assign({}, UMFRAGE, anteile(0))), /Noch nicht als Prozent angezeigt: C2, C3, C4, C5, C6/);
  const mal = Object.assign({}, UMFRAGE, { C2: { f: "B2/$B$7*100", v: 21 }, C3: { f: "B3/$B$7*100", v: 28 }, C4: { f: "B4/$B$7*100", v: 35 }, C5: { f: "B5/$B$7*100", v: 11 }, C6: { f: "B6/$B$7*100", v: 5 } });
  assert.match(offen("prozent-auf1", mal), /wird noch mal 100 gerechnet/);
  const ohne = Object.assign({}, UMFRAGE, { C3: { f: "B3/B8", v: "#DIV/0!", fehler: true, s: 4 }, C4: { f: "B4/B9", v: "#DIV/0!", fehler: true, s: 4 } });
  assert.match(offen("prozent-auf1", ohne), /stimmt noch nicht in: C3, C4/);
  assert.match(offen("prozent-auf1", Object.assign({}, UMFRAGE, { C2: { v: 0.21, s: 4 } })), /stimmt noch nicht in: C2/, "Prozent getippt statt gerechnet");
});

test("Mini-Projekt: Aufschlag ohne Dollar, Summe getippt, anderer Aufschlag", () => {
  assert.match(offen("miniprojekt-auf1", Object.assign({}, VERKAUF, { C5: { f: "B5+B2", v: 0.3 }, E5: { f: "C5*D5", v: 10.5 }, G5: { f: "E5-F5", v: 0 }, E8: { f: "SUM(E4:E7)", v: 142.1 }, G8: { f: "SUM(G4:G7)", v: 56 } })), /Verkaufspreis stimmt noch nicht in: C5/);
  assert.match(offen("miniprojekt-auf1", Object.assign({}, VERKAUF, { G8: 70 })), /fehlt noch eine Summen-Formel in: G8/);
  const mehr = Object.assign({}, VERKAUF, { B1: 0.5 }, spalte("C", (z) => `B${z}+$B$1`, [1.05, 0.8, 0.95, 1.1]), spalte("E", (z) => `C${z}*D${z}`, [50.4, 28, 38, 57.2]), spalte("G", (z) => `E${z}-F${z}`, [24, 17.5, 20, 26]),
    { E8: { f: "SUM(E4:E7)", v: 173.6 }, G8: { f: "SUM(G4:G7)", v: 87.5 } });
  assert.equal(offen("miniprojekt-auf1", mehr), "", "Aufschlag 0,5: Gewinn 87,5");
  assert.match(offen("miniprojekt-aufM", Object.assign({}, ANTEIL, { H5: { f: "G5/G9", v: "#DIV/0!", fehler: true, s: 4 } })), /Anteil stimmt noch nicht in: H5/);
});

/* ---------- Route ---------- */
let antwortKi = "", gesehen = [];
async function askAnthropic(system, user) { gesehen.push({ system, user }); if (antwortKi instanceof Error) throw antwortKi; return antwortKi; }
let server, basis;
test.before(async () => {
  const app = express();
  app.use(express.json({ limit: "1mb" }));
  registerExcelPruefung(app, { askAnthropic, prefix: "/api/inf8", aufgaben: AUFGABEN, maxKi: 6 });
  await new Promise((r) => { server = app.listen(0, "127.0.0.1", r); });
  basis = `http://127.0.0.1:${server.address().port}`;
});
test.after(() => server && server.close());
const post = async (body) => { const r = await fetch(basis + "/api/inf8/excel/pruefen", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); return { status: r.status, json: await r.json() }; };
const b64 = (zellen, verfasser) => mappe(zellen, verfasser).toString("base64");

test("Route: richtige Datei – Punkte vom Prüfprogramm, Rückmeldung von der KI, kein Name an die KI", async () => {
  gesehen = []; antwortKi = '```json\n{"rueckmeldung": "Deine Formeln rechnen alle richtig. Stark, dass du die Summe mit SUMME gebildet hast."}\n```';
  const r = await post({ aufgabe: "anwendung-auf1", datei: b64(FEST, "Maximiliane Musterkind") });
  assert.equal(r.status, 200);
  assert.equal(r.json.erfuellt, true);
  assert.equal(r.json.lesbar, true);
  assert.equal(r.json.punkte.length, 7);
  assert.equal(r.json.quelle, "ki");
  assert.match(r.json.rueckmeldung, /Deine Formeln rechnen alle richtig/);
  assert.equal(gesehen.length, 1);
  assert.match(gesehen[0].user, /D2: Formel =B2\*C2 ergibt 75/, "die KI sieht die Tabelle");
  assert.match(gesehen[0].user, /Prüfprogramm – noch offen:\n- nichts/);
  assert.ok(!/Musterkind/.test(gesehen[0].user + gesehen[0].system), "der Verfasser der Datei geht nicht an die KI");
  assert.ok(!/Musterkind/.test(JSON.stringify(r.json)));
});

test("Route: Die KI kann die Punkte nicht ändern", async () => {
  antwortKi = '{"rueckmeldung": "Alles ist falsch."}';
  assert.equal((await post({ aufgabe: "formeln-auf1", datei: b64(GELD) })).json.erfuellt, true);
  antwortKi = '{"rueckmeldung": "Super, alles richtig!", "erfuellt": true, "punkte": []}';
  const r = await post({ aufgabe: "formeln-auf1", datei: b64(GELD_START) });
  assert.equal(r.json.erfuellt, false);
  assert.equal(r.json.punkte.filter((p) => !p.ok).length, 5);
});

test("Route: KI fällt aus – die Prüfung gibt es trotzdem", async () => {
  antwortKi = new Error("overloaded");
  let r = await post({ aufgabe: "kopieren-auf1", datei: b64(EINKAUF) });
  assert.deepEqual([r.json.erfuellt, r.json.quelle, r.json.rueckmeldung], [true, "ersatz", "Deine Tabelle erfüllt alle Punkte."]);
  antwortKi = "Das ist keine Antwort im verlangten Format.";
  r = await post({ aufgabe: "kopieren-auf1", datei: b64(Object.assign({}, EINKAUF, { D8: 160.2 })) });
  assert.deepEqual([r.json.erfuellt, r.json.quelle], [false, "ersatz"]);
  assert.match(r.json.rueckmeldung, /Ein Teil stimmt schon/);
});

test("Route: unbekannte Aufgabe, keine Datei, falsche Datei, zu große Datei", async () => {
  antwortKi = '{"rueckmeldung": "x"}'; gesehen = [];
  assert.equal((await post({ aufgabe: "gibt-es-nicht", datei: b64(FEST) })).status, 404);
  assert.equal((await post({ aufgabe: "__proto__", datei: b64(FEST) })).status, 404);
  assert.equal((await post({ aufgabe: "anwendung-auf1" })).status, 400);
  let r = await post({ aufgabe: "anwendung-auf1", datei: Buffer.from("kein Excel").toString("base64") });
  assert.deepEqual([r.status, r.json.lesbar, r.json.erfuellt, r.json.quelle], [200, false, false, "pruefprogramm"]);
  assert.match(r.json.rueckmeldung, /keine Excel-Datei/);
  r = await post({ aufgabe: "anwendung-auf1", datei: "A".repeat(900 * 1024) });
  assert.equal(r.json.lesbar, false);
  assert.match(r.json.rueckmeldung, /zu groß/);
  assert.equal(gesehen.length, 0, "ohne lesbare Tabelle wird die KI nicht gefragt");
});

test("Route: Bremse – nach vielen Prüfungen in kurzer Zeit gibt es die Punkte weiter, aber ohne KI-Text", async () => {
  antwortKi = '{"rueckmeldung": "Gut gemacht."}';
  let ersatz = 0;
  for (let i = 0; i < 12; i++) { const r = await post({ aufgabe: "kennenlernen-auf1", datei: b64({ B2: "Hallo", D5: 2027, A7: "Excel" }) }); assert.equal(r.json.erfuellt, true); if (r.json.quelle === "ersatz") ersatz++; }
  assert.ok(ersatz >= 6, "mindestens sechs Antworten ohne KI: " + ersatz);
});
