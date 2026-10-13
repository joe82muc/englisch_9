"use strict";

// Informatik 9, Excel-Aufträge (Module 3 und 4): Diagramme lesen (x.diagramme) und die neun Prüfprogramme.
// Teil 1 läuft immer: kleine Mappen und Diagramme, im Test selbst gebaut (Aufbau wie Excel sie speichert).
// Teil 2 braucht die Dateien aus echtem Excel (Startdateien, Musterlösungen, Gegenproben) im Projektordner
// .codex-build/informatik9-werkzeug/excel – auf dem Server gibt es ihn nicht, dann wird Teil 2 übersprungen.
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const path = require("path");
const { zip } = require("./xlsx-mini");
const { liesXlsx, tabellenText } = require("./excelpruefung");
const AUFGABEN = require("./inf9-excel-aufgaben");

const NS = 'xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"';
const xmlText = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ---------- eine Mappe mit Zellen und Diagrammen ---------- */
// zellen: { A1: "Text", B2: 3.5, D2: { f: "B2*C2", v: 36 }, D2: { f: "B2*C2", v: 36, bereich: "D2:D6", si: 0 }, D3: { si: 0, v: 32.4 } }
function mappe(zellen, diagramme) {
  const texte = [], zeilen = {};
  for (const [a, roh] of Object.entries(zellen)) {
    const z = roh !== null && typeof roh === "object" ? roh : { v: roh };
    let f = "";
    if (z.f && z.bereich) f = `<f t="shared" ref="${z.bereich}" si="${z.si}">${xmlText(z.f)}</f>`;
    else if (z.f) f = `<f>${xmlText(z.f)}</f>`;
    else if (z.si != null) f = `<f t="shared" si="${z.si}"/>`;
    let c;
    if (typeof z.v === "string" && z.f) c = `<c r="${a}" t="str">${f}<v>${xmlText(z.v)}</v></c>`;
    else if (typeof z.v === "string") { let i = texte.indexOf(z.v); if (i < 0) i = texte.push(z.v) - 1; c = `<c r="${a}" t="s"><v>${i}</v></c>`; }
    else c = `<c r="${a}">${f}<v>${z.v}</v></c>`;
    const nr = +a.replace(/\D/g, "");
    (zeilen[nr] = zeilen[nr] || []).push([a, c]);
  }
  const daten = Object.keys(zeilen).map(Number).sort((p, q) => p - q)
    .map((nr) => `<row r="${nr}">${zeilen[nr].sort((p, q) => (p[0] < q[0] ? -1 : 1)).map((x) => x[1]).join("")}</row>`).join("");
  const teile = [
    { name: "[Content_Types].xml", data: '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"/>' },
    { name: "xl/workbook.xml", data: `<?xml version="1.0"?><workbook ${NS} xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Tabelle1" sheetId="1" r:id="rId1"/></sheets></workbook>` },
    { name: "xl/_rels/workbook.xml.rels", data: '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="x" Target="worksheets/sheet1.xml"/></Relationships>' },
    { name: "xl/worksheets/sheet1.xml", data: `<?xml version="1.0"?><worksheet ${NS}><sheetData>${daten}</sheetData></worksheet>` },
    { name: "xl/sharedStrings.xml", data: `<?xml version="1.0"?><sst ${NS}>${texte.map((t) => `<si><t>${xmlText(t)}</t></si>`).join("")}</sst>` }
  ];
  (diagramme || []).forEach((xml, i) => teile.push({ name: `xl/charts/chart${i + 1}.xml`, data: xml }));
  return zip(teile);
}

/* ---------- Diagramm-XML, wie Excel es schreibt (gekürzt: ohne Formatierung) ---------- */
// opt: { typ: "bar"|"pie"|"doughnut"|"line"|"area"|"scatter", richtung: "col"|"bar", gruppe: "clustered"|"stacked"|"percentStacked"|"standard",
//        titel: "Text" | "@auto" | undefined (kein Titel), reihen: [{ name: "Tabelle1!$B$1", kat: "Tabelle1!$A$2:$A$6", val: "Tabelle1!$B$2:$B$6", nameText }] }
function diagramm(opt) {
  const titel = opt.titel === undefined ? "" : opt.titel === "@auto"
    ? '<c:title><c:overlay val="0"/><c:spPr><a:noFill/></c:spPr><c:txPr><a:p><a:pPr><a:defRPr sz="1400"/></a:pPr><a:endParaRPr lang="de-DE"/></a:p></c:txPr></c:title>'
    : `<c:title><c:tx><c:rich><a:bodyPr/><a:p><a:pPr><a:defRPr sz="1400"/></a:pPr><a:r><a:rPr lang="de-DE"/><a:t>${xmlText(opt.titel)}</a:t></a:r></a:p></c:rich></c:tx><c:overlay val="0"/><c:txPr><a:p><a:endParaRPr lang="de-DE"/></a:p></c:txPr></c:title>`;
  const ser = (opt.reihen || []).map((r, i) => {
    const tx = r.name ? `<c:tx><c:strRef><c:f>${r.name}</c:f><c:strCache><c:ptCount val="1"/><c:pt idx="0"><c:v>${xmlText(r.nameText || "Reihe")}</c:v></c:pt></c:strCache></c:strRef></c:tx>` : "";
    const kat = r.kat ? (opt.typ === "scatter" ? `<c:xVal><c:numRef><c:f>${r.kat}</c:f></c:numRef></c:xVal>` : `<c:cat><c:strRef><c:f>${r.kat}</c:f><c:strCache><c:ptCount val="1"/></c:strCache></c:strRef></c:cat>`) : "";
    const val = opt.typ === "scatter" ? `<c:yVal><c:numRef><c:f>${r.val}</c:f></c:numRef></c:yVal>` : `<c:val><c:numRef><c:f>${r.val}</c:f><c:numCache><c:formatCode>General</c:formatCode></c:numCache></c:numRef></c:val>`;
    const dpt = opt.typ === "pie" ? '<c:dPt><c:idx val="0"/><c:bubble3D val="0"/><c:spPr><a:solidFill><a:schemeClr val="accent1"/></a:solidFill></c:spPr></c:dPt><c:dLbls><c:tx><c:rich><a:p><a:r><a:t>FALSCH</a:t></a:r></a:p></c:rich></c:tx></c:dLbls>' : "";
    return `<c:ser><c:idx val="${i}"/><c:order val="${i}"/>${tx}<c:spPr><a:solidFill><a:schemeClr val="accent1"/></a:solidFill></c:spPr>${dpt}${kat}${val}</c:ser>`;
  }).join("");
  const art = { bar: `<c:barChart><c:barDir val="${opt.richtung || "col"}"/><c:grouping val="${opt.gruppe || "clustered"}"/><c:varyColors val="0"/>${ser}</c:barChart>`,
    pie: `<c:pieChart><c:varyColors val="1"/>${ser}</c:pieChart>`, doughnut: `<c:doughnutChart><c:varyColors val="1"/>${ser}<c:holeSize val="75"/></c:doughnutChart>`,
    line: `<c:lineChart><c:grouping val="standard"/><c:varyColors val="0"/>${ser}<c:marker val="1"/></c:lineChart>`, area: `<c:areaChart><c:grouping val="standard"/>${ser}</c:areaChart>`,
    scatter: `<c:scatterChart><c:scatterStyle val="lineMarker"/>${ser}</c:scatterChart>` }[opt.typ];
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><c:chartSpace xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><c:chart>${titel}<c:autoTitleDeleted val="${opt.titel === undefined ? 1 : 0}"/><c:plotArea><c:layout/>${art}<c:catAx><c:title><c:tx><c:rich><a:p><a:r><a:t>Achsentitel</a:t></a:r></a:p></c:rich></c:tx></c:title></c:catAx></c:plotArea></c:chart></c:chartSpace>`;
}
const EINE = [{ name: "Tabelle1!$B$1", nameText: "Stimmen", kat: "Tabelle1!$A$2:$A$6", val: "Tabelle1!$B$2:$B$6" }];

/* ---------- Teil 1: x.diagramme an selbst gebauten Dateien ---------- */
test("Diagramme lesen: eine Mappe ohne Diagramm liefert eine leere Liste", () => {
  assert.deepEqual(liesXlsx(mappe({ A1: "x", B1: 1 })).diagramme, []);
});

test("Diagramme lesen: Art, 100-%-Stapel, eigener Titel, Reihen mit Namen und Bereichen", () => {
  const lies = (opt) => liesXlsx(mappe({ A1: "x" }, [diagramm(opt)])).diagramme;
  const s = lies({ typ: "bar", richtung: "col", titel: "Lieblingssport & mehr", reihen: EINE });
  assert.equal(s.length, 1);
  assert.deepEqual(s[0], { art: "saeule", gestapelt: "", titel: "Lieblingssport & mehr", autoTitel: false, reihen: [{ name: "Stimmen", nameRef: "Tabelle1!$B$1", kategorien: "Tabelle1!$A$2:$A$6", werte: "Tabelle1!$B$2:$B$6" }] });
  assert.equal(lies({ typ: "bar", richtung: "bar", titel: "t", reihen: EINE })[0].art, "balken");
  const streifen = lies({ typ: "bar", richtung: "bar", gruppe: "percentStacked", titel: "t", reihen: EINE })[0];
  assert.equal(streifen.art, "balken"); assert.equal(streifen.gestapelt, "prozent");
  assert.equal(lies({ typ: "bar", gruppe: "stacked", titel: "t", reihen: EINE })[0].gestapelt, "gestapelt");
  assert.equal(lies({ typ: "pie", titel: "t", reihen: EINE })[0].art, "kreis");
  assert.equal(lies({ typ: "doughnut", titel: "t", reihen: EINE })[0].art, "ring");
  assert.equal(lies({ typ: "line", titel: "t", reihen: EINE })[0].art, "linie");
  assert.equal(lies({ typ: "area", titel: "t", reihen: EINE })[0].art, "flaeche");
  const punkt = lies({ typ: "scatter", titel: "t", reihen: [{ val: "Tabelle1!$B$2:$B$6", kat: "Tabelle1!$A$2:$A$6" }] })[0];
  assert.equal(punkt.art, "punkt"); assert.equal(punkt.reihen[0].werte, "Tabelle1!$B$2:$B$6"); assert.equal(punkt.reihen[0].kategorien, "Tabelle1!$A$2:$A$6");
});

test("Diagramme lesen: automatischer Titel, kein Titel, Beschriftung der Achse und Datenbeschriftung zählen nicht", () => {
  const lies = (opt) => liesXlsx(mappe({ A1: "x" }, [diagramm(opt)])).diagramme[0];
  const auto = lies({ typ: "bar", titel: "@auto", reihen: EINE });
  assert.equal(auto.titel, ""); assert.equal(auto.autoTitel, true, "Excel schreibt c:title ohne c:tx");
  const keiner = lies({ typ: "bar", reihen: EINE });
  assert.equal(keiner.titel, ""); assert.equal(keiner.autoTitel, false);
  assert.equal(lies({ typ: "pie", titel: "Kreis", reihen: EINE }).titel, "Kreis", "Text im Datenpunkt (dLbls) ist nicht der Titel");
  assert.equal(lies({ typ: "bar", titel: "Diagrammtitel", reihen: EINE }).titel, "Diagrammtitel", "von Hand getippt: bleibt stehen, die Prüfung zählt ihn nicht als eigenen");
});

test("Diagramme lesen: Titel aus einer Zelle (c:strRef) zählt als eigener Titel", () => {
  const xml = diagramm({ typ: "bar", titel: "x", reihen: EINE }).replace(/<c:title>[\s\S]*?<\/c:title>/, '<c:title><c:tx><c:strRef><c:f>Tabelle1!$D$1</c:f><c:strCache><c:ptCount val="1"/><c:pt idx="0"><c:v>Mein Titel aus D1</c:v></c:pt></c:strCache></c:strRef></c:tx><c:overlay val="0"/></c:title>');
  const d = liesXlsx(mappe({ A1: "x" }, [xml])).diagramme[0];
  assert.equal(d.titel, "Mein Titel aus D1"); assert.equal(d.autoTitel, false);
});

test("Diagramme lesen: mehrere Reihen, Reihenname ohne Zelle, zwei Diagramme in der Reihenfolge der Dateien", () => {
  const zwei = [{ name: "Tabelle1!$A$2", nameText: "Essen", kat: "Tabelle1!$B$1", val: "Tabelle1!$B$2" }, { name: "Tabelle1!$A$3", nameText: "Handy", kat: "Tabelle1!$B$1", val: "Tabelle1!$B$3" }];
  const x = liesXlsx(mappe({ A1: "x" }, [diagramm({ typ: "bar", titel: "eins", reihen: zwei }), diagramm({ typ: "pie", titel: "zwei", reihen: [{ kat: "Tabelle1!$A$2:$A$6", val: "Tabelle1!$B$2:$B$6" }] })]));
  assert.equal(x.diagramme.length, 2);
  assert.deepEqual(x.diagramme[0].reihen.map((r) => r.name), ["Essen", "Handy"]);
  assert.equal(x.diagramme[1].titel, "zwei"); assert.deepEqual(x.diagramme[1].reihen[0], { name: "", nameRef: "", kategorien: "Tabelle1!$A$2:$A$6", werte: "Tabelle1!$B$2:$B$6" });
  assert.match(tabellenText(x), /Diagramm 2: Kreisdiagramm, Titel: „zwei“/, "die KI bekommt eine Zeile je Diagramm");
});

test("Diagramme lesen: ein kaputtes Diagramm macht die Mappe nicht unlesbar", () => {
  const x = liesXlsx(mappe({ A1: "x", B1: 2 }, ["<kaputt"]));
  assert.equal(x.wert("B1"), 2);
  assert.ok(Array.isArray(x.diagramme));
});

test("Formeln: SQRT wird WURZEL, QUOTIENT und RUNDEN bleiben lesbar", () => {
  const x = liesXlsx(mappe({ B11: 9, B12: { f: "SQRT(B11)", v: 3 }, B5: { f: "QUOTIENT(B3,B4)", v: 10 }, B9: { f: "ROUND(B8*3%,2)", v: 10.87 } }));
  assert.equal(x.formel("B12"), "=WURZEL(B11)"); assert.equal(x.formel("B5"), "=QUOTIENT(B3;B4)"); assert.equal(x.formel("B9"), "=RUNDEN(B8*3%;2)");
});

/* ---------- Teil 1: Prüfprogramme an selbst gebauten Mappen ---------- */
const SPORT = { A1: "Sportart", B1: "Stimmen", A2: "Fußball", B2: 14, A3: "Basketball", B3: 9, A4: "Schwimmen", B4: 7, A5: "Tanzen", B5: 11, A6: "Klettern", B6: 5 };
const punkte = (kennung, zellen, dia) => AUFGABEN[kennung].pruefe(liesXlsx(mappe(zellen, dia)));
const offen = (p) => p.map((q, i) => (q.ok ? 0 : i + 1)).filter(Boolean);

test("Säulendiagramm: richtig besteht; Balken, kein eigener Titel, zu kurzer Bereich, kein Diagramm fallen mit dem passenden Punkt durch", () => {
  const S = (opt) => punkte("saeulen-balken-auf1", SPORT, [diagramm(Object.assign({ typ: "bar", titel: "Lieblingssport", reihen: EINE }, opt))]);
  assert.deepEqual(offen(S({})), []);
  assert.deepEqual(offen(S({ richtung: "bar" })), [2]);
  assert.match(S({ richtung: "bar" })[1].text, /Balkendiagramm – gefragt sind Säulen/);
  assert.deepEqual(offen(S({ titel: "@auto" })), [4]);
  assert.deepEqual(offen(S({ titel: undefined })), [4]);
  assert.deepEqual(offen(S({ titel: "Diagrammtitel" })), [4]);
  assert.deepEqual(offen(S({ reihen: [{ name: "Tabelle1!$B$1", nameText: "Stimmen", kat: "Tabelle1!$A$2:$A$5", val: "Tabelle1!$B$2:$B$5" }] })), [3]);
  assert.match(S({ reihen: [{ name: "Tabelle1!$B$1", nameText: "Stimmen", kat: "Tabelle1!$A$2:$A$5", val: "Tabelle1!$B$2:$B$5" }] })[2].text, /„Klettern“/);
  assert.deepEqual(offen(S({ gruppe: "percentStacked" })), [2], "alle Säulen gleich hoch");
  assert.deepEqual(offen(punkte("saeulen-balken-auf1", SPORT, [])), [1, 2, 3, 4]);
  // zwei Diagramme: das passende (Säule) wird geprüft, nicht das erste
  assert.deepEqual(offen(punkte("saeulen-balken-auf1", SPORT, [diagramm({ typ: "pie", titel: "x", reihen: EINE }), diagramm({ typ: "bar", titel: "y", reihen: EINE })])), []);
  // Bereich aus mehreren Teilen
  assert.deepEqual(offen(S({ reihen: [{ name: "Tabelle1!$B$1", nameText: "Stimmen", kat: "(Tabelle1!$A$2:$A$4,Tabelle1!$A$5:$A$6)", val: "Tabelle1!$B$2:$B$3,Tabelle1!$B$4:$B$6" }] })), []);
});

test("Taschengeld: Kreis, Ring und 100-%-Streifen mit einem Balken je Posten bestehen; eine Reihe mit fünf Balken, Säule und Linie nicht", () => {
  const AUSG = { A1: "Ausgaben im Monat", B1: "Betrag in €", A2: "Essen", B2: 18, A3: "Handy", B3: 10, A4: "Kleidung", B4: 12, A5: "Freizeit", B5: 14, A6: "Sparen", B6: 6 };
  const A = (opt) => punkte("auswertung-auf1", AUSG, [diagramm(Object.assign({ typ: "pie", titel: "Taschengeld", reihen: EINE }, opt))]);
  assert.deepEqual(offen(A({})), []);
  assert.deepEqual(offen(A({ typ: "doughnut" })), []);
  const proZeile = [2, 3, 4, 5, 6].map((z) => ({ name: "Tabelle1!$A$" + z, nameText: "P" + z, kat: "Tabelle1!$B$1", val: "Tabelle1!$B$" + z }));
  assert.deepEqual(offen(A({ typ: "bar", richtung: "bar", gruppe: "percentStacked", reihen: proZeile })), []);
  assert.deepEqual(offen(A({ typ: "bar", richtung: "bar", gruppe: "percentStacked" })), [2]);
  assert.match(A({ typ: "bar", richtung: "bar", gruppe: "percentStacked" })[1].text, /einem einzigen Balken/);
  assert.deepEqual(offen(A({ typ: "bar" })), [2]);
  assert.match(A({ typ: "bar" })[1].text, /gefragt sind die Anteile/);
  assert.deepEqual(offen(A({ typ: "line" })), [2]);
  assert.match(A({ typ: "line" })[1].text, /Hier gibt es keine Zeit/);
});

test("Schulweg: Kreis mit der Summe, ohne Dollar und Kreis ohne Titel", () => {
  const WEG = { A1: "Schulweg", B1: "Kinder", C1: "Anteil in %", A2: "Bus", B2: 12, A3: "Fahrrad", B3: 9, A4: "zu Fuß", B4: 6, A5: "Auto", B5: 3, A6: "Summe",
    B6: { f: "SUM(B2:B5)", v: 30 }, C2: { f: "B2/$B$6*100", v: 40, bereich: "C2:C5", si: 0 }, C3: { si: 0, v: 30 }, C4: { si: 0, v: 20 }, C5: { si: 0, v: 10 } };
  const K = (zellen, opt) => punkte("kreis-streifen-auf1", Object.assign({}, WEG, zellen), [diagramm(Object.assign({ typ: "pie", titel: "Schulweg", reihen: [{ name: "Tabelle1!$B$1", nameText: "Kinder", kat: "Tabelle1!$A$2:$A$5", val: "Tabelle1!$B$2:$B$5" }] }, opt))]);
  assert.deepEqual(offen(K({})), []);
  assert.deepEqual(offen(K({}, { reihen: [{ name: "Tabelle1!$B$1", nameText: "Kinder", kat: "Tabelle1!$A$2:$A$6", val: "Tabelle1!$B$2:$B$6" }] })), [4]);
  assert.match(K({}, { reihen: [{ name: "Tabelle1!$B$1", nameText: "Kinder", kat: "Tabelle1!$A$2:$A$6", val: "Tabelle1!$B$2:$B$6" }] })[3].text, /Zeile 6 \(„Summe“\)/);
  assert.deepEqual(offen(K({ C2: { f: "B2/B6*100", v: 40, bereich: "C2:C5", si: 0 }, C3: { si: 0, v: 0 }, C4: { si: 0, v: 0 }, C5: { si: 0, v: 0 } })), [2]);
  assert.deepEqual(offen(K({}, { titel: "@auto" })), [5]);
  assert.deepEqual(offen(K({ C2: { f: "B2/$B$6", v: 0.4, bereich: "C2:C5", si: 0 }, C3: { si: 0, v: 0.3 }, C4: { si: 0, v: 0.2 }, C5: { si: 0, v: 0.1 } })), [2], "Bruch ohne Prozentformat: 0,4 ist nicht 40");
});

test("WENN: kleiner-als statt kleiner-gleich, Text ohne Anführungszeichen, alles richtig mit festen Zahlen", () => {
  const V = { A1: "Bestellung", B1: "Bestellwert", C1: "Versand", D1: "Hinweis", F1: "Ab", G1: 50, F2: "Versand", G2: 4.9, B2: 23.5, B3: 50, B4: 74.9, B5: 49.99, B6: 120, B7: 8 };
  const C = [4.9, 0, 0, 4.9, 0, 4.9], D = ["mit Versand", "kostenlos", "kostenlos", "mit Versand", "kostenlos", "mit Versand"];
  const voll = (cf, df) => { const z = Object.assign({}, V); for (let i = 0; i < 6; i++) { z["C" + (i + 2)] = { f: cf(i + 2), v: C[i] }; z["D" + (i + 2)] = { f: df(i + 2), v: D[i] }; } return z; };
  const gut = voll((r) => `IF(B${r}>=$G$1,0,$G$2)`, (r) => `IF(C${r}=0,"kostenlos","mit Versand")`);
  assert.deepEqual(offen(punkte("wenn-auf1", gut)), []);
  assert.deepEqual(offen(punkte("wenn-auf1", voll((r) => `IF(B${r}>=50,0,4.9)`, (r) => `IF(C${r}=0,"kostenlos","mit Versand")`))), [], "feste Zahlen in der Formel");
  const klein = Object.assign({}, gut, { C3: { f: "IF(B3>$G$1,0,$G$2)", v: 4.9 } });
  assert.deepEqual(offen(punkte("wenn-auf1", klein)), [2], "genau 50 € bekommt Versand berechnet; der Hinweistext bleibt davon unberührt");
  assert.match(punkte("wenn-auf1", klein)[1].text, /genau 50 €/);
  const ohneAnf = Object.assign({}, gut);
  for (let i = 2; i <= 7; i++) ohneAnf["D" + i] = { f: `IF(C${i}=0,kostenlos,"mit Versand")`, v: "#NAME?" };
  assert.deepEqual(offen(punkte("wenn-auf1", ohneAnf)), [3, 4]);
  assert.match(punkte("wenn-auf1", ohneAnf)[2].text, /fehlen die Anführungszeichen/);
});

test("Rechenfunktionen: Funktion und Wert getrennt beurteilt", () => {
  const R = { B1: 6.5, B2: 4, B4: 2.5, B6: 32.95, B7: 11, B11: 9 };
  const mit = (z) => punkte("rechenfunktionen-auf1", Object.assign({}, R, z));
  const ganz = { B3: { f: "PRODUCT(B1,B2)", v: 26 }, B5: { f: "QUOTIENT(B3,B4)", v: 10 }, B8: { f: "PRODUCT(B6,B7)", v: 362.45 }, B9: { f: "ROUND(B8*3%,2)", v: 10.87 }, B12: { f: "SQRT(B11)", v: 3 } };
  assert.deepEqual(offen(mit(ganz)), []);
  assert.deepEqual(offen(mit(Object.assign({}, ganz, { B3: { f: "B1*B2", v: 26 } }))), [1]);
  assert.match(mit(Object.assign({}, ganz, { B3: { f: "B1*B2", v: 26 } }))[0].text, /Übe hier die Funktion PRODUKT/);
  assert.deepEqual(offen(mit(Object.assign({}, ganz, { B5: { f: "B3/B4", v: 10.4 } }))), [2]);
  assert.match(mit(Object.assign({}, ganz, { B5: { f: "B3/B4", v: 10.4 } }))[1].text, /ganze Zahl/);
  assert.deepEqual(offen(mit(Object.assign({}, ganz, { B9: { f: "B8*3%", v: 10.8735 } }))), [4]);
  assert.deepEqual(offen(mit(Object.assign({}, ganz, { B12: { f: "SQRT(9)", v: 3 } }))), [5], "nur feste Zahlen");
  assert.deepEqual(offen(mit(Object.assign({}, ganz, { B12: { f: "SQRT(B11)", v: "#ZAHL!", fehler: true }, B11: -4 }))).includes(5), true);
  assert.deepEqual(offen(mit(Object.assign({}, ganz, { B1: 7, B2: 5, B3: { f: "PRODUCT(B1,B2)", v: 35 }, B5: { f: "QUOTIENT(B3,B4)", v: 14 } }))), [], "andere Zahlen, gleiche Formeln");
});

/* ---------- Teil 2: Dateien aus echtem Excel (lokal) ---------- */
const WERK = path.resolve(__dirname, "..", "..", "..", "informatik9-werkzeug", "excel");
const VORHANDEN = fs.existsSync(path.join(WERK, "faelle9.js")) && fs.existsSync(path.join(WERK, "loesungen"));
if (!VORHANDEN) {
  test("Dateien aus echtem Excel: Ordner informatik9-werkzeug fehlt (auf dem Server normal)", { skip: "keine Testdateien vorhanden" }, () => {});
} else {
  const F = require(path.join(WERK, "faelle9.js"));
  const alle = F.faelle();
  const lesen = (f) => AUFGABEN[f.aufgabe].pruefe(liesXlsx(fs.readFileSync(f.datei)));

  test(`Echtes Excel: alle ${alle.filter((f) => f.art === "loesung").length} Musterlösungen bestehen alle Punkte`, () => {
    for (const f of alle.filter((q) => q.art === "loesung")) {
      const p = lesen(f);
      assert.ok(p.length > 0 && p.every((q) => q.ok), `${f.aufgabe} ${path.basename(f.datei)}: offen ${offen(p)} – ${p.filter((q) => !q.ok).map((q) => q.text).join(" | ")}`);
    }
  });
  test("Echtes Excel: jede der neun Startdateien fällt mit allen Punkten durch", () => {
    const starts = alle.filter((f) => f.art === "start");
    assert.equal(starts.length, 9);
    for (const f of starts) assert.deepEqual(offen(lesen(f)), f.offen, f.aufgabe);
  });
  test("Echtes Excel: jede Gegenprobe fällt mit genau dem passenden Punkt durch", () => {
    const falsch = alle.filter((f) => f.art === "falsch");
    assert.ok(falsch.length >= 40, "mindestens zwei bis drei Gegenproben je Auftrag: " + falsch.length);
    for (const f of falsch) assert.deepEqual(offen(lesen(f)), f.offen, `${f.aufgabe} ${f.text}`);
    const je = {}; falsch.forEach((f) => { je[f.aufgabe] = (je[f.aufgabe] || 0) + 1; });
    for (const k of Object.keys(AUFGABEN)) assert.ok(je[k] >= 2, k + " hat mindestens zwei Gegenproben");
  });
  test("Echtes Excel: eine fremde Musterlösung besteht nie", () => {
    for (const f of alle.filter((q) => q.art === "fremd")) assert.ok(offen(lesen(f)).length > 0, f.text);
  });
  test("Echtes Excel: x.diagramme – Art, Titel und Bereiche der Musterlösungen", () => {
    const d = (rel) => liesXlsx(fs.readFileSync(path.join(WERK, "loesungen", rel))).diagramme;
    assert.deepEqual(d("excel-start/auf1.xlsx"), []);
    assert.deepEqual(d("saeulen-balken/auf1.xlsx"), [{ art: "saeule", gestapelt: "", titel: "Lieblingssport der 9. Klassen", autoTitel: false, reihen: [{ name: "Stimmen", nameRef: "Tabelle1!$B$1", kategorien: "Tabelle1!$A$2:$A$6", werte: "Tabelle1!$B$2:$B$6" }] }]);
    assert.equal(d("kreis-streifen/auf1.xlsx")[0].art, "kreis"); assert.equal(d("kreis-streifen/auf1.xlsx")[0].reihen[0].werte, "Tabelle1!$B$2:$B$5");
    assert.equal(d("linien/auf1.xlsx")[0].art, "linie"); assert.equal(d("linien/auf1-nur-linie.xlsx")[0].art, "linie");
    assert.equal(d("auswertung/auf1-ring.xlsx")[0].art, "ring");
    const streifen = d("auswertung/auf1-streifen.xlsx")[0];
    assert.equal(streifen.art, "balken"); assert.equal(streifen.gestapelt, "prozent"); assert.equal(streifen.reihen.length, 5);
    assert.equal(streifen.reihen[0].name, "Essen und Trinken"); assert.equal(streifen.reihen[0].werte, "Tabelle1!$B$2");
    const f = (n) => liesXlsx(fs.readFileSync(path.join(WERK, "falsch", n))).diagramme[0];
    assert.equal(f("saeulen-balken-balken.xlsx").art, "balken");
    assert.deepEqual([f("saeulen-balken-titel-automatisch.xlsx").titel, f("saeulen-balken-titel-automatisch.xlsx").autoTitel], ["", true]);
    assert.deepEqual([f("saeulen-balken-ohne-titel.xlsx").titel, f("saeulen-balken-ohne-titel.xlsx").autoTitel], ["", false]);
    assert.equal(f("saeulen-balken-titel-diagrammtitel.xlsx").titel, "Diagrammtitel");
    assert.equal(f("kreis-streifen-kreis-mit-summe.xlsx").reihen[0].werte, "Tabelle1!$B$2:$B$6");
    assert.equal(f("saeulen-balken-nur-werte.xlsx").reihen[0].kategorien, "");
  });
}
