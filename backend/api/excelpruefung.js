"use strict";

/**
 * Excel-Aufträge (Informatik 8): Das Kind lädt seine gespeicherte Excel-Datei hoch.
 * ------------------------------------------------------------------------------
 * Wie bei der Filius-Prüfung: Der Server liest die Datei (eine .xlsx ist ein ZIP-Archiv mit XML darin, entpackt wird
 * mit zlib ohne Fremdbibliothek), ein Prüfprogramm prüft die Punkte der Aufgabe EXAKT, und die KI schreibt danach
 * die Rückmeldung in Schülersprache. So sind die Punkte nachprüfbar und bei gleicher Datei immer gleich; die KI kann
 * sie nicht verändern. Fällt die KI aus, gibt es die Punkte mit einem festen Satz.
 *
 * Nichts wird gespeichert – keine Datei, kein Name, keine Abgabe. Gelesen werden nur die Zellen der Tabelle; der
 * Verfasser und der Speicherort, die Excel in die Datei schreibt, werden nicht ausgelesen und gehen nicht an die KI.
 *
 * Route:   POST <prefix>/excel/pruefen     Body { aufgabe: "formeln-auf1", datei: "<base64 der .xlsx>" }
 * Antwort: { ok, lesbar, erfuellt, punkte: [{ ok, text }], rueckmeldung, quelle: "ki" | "ersatz" | "pruefprogramm" }
 *
 * opts.aufgaben: { "<kennung>": { titel, auftrag: "Text für die KI", pruefe: (x) => [{ ok, text }] } }
 *   x ist die gelesene Mappe (liesXlsx): formel(a), wert(a), hatFormel(a), istZahl(a), istText(a), leer(a),
 *   istDatum(a), istProzent(a), istWaehrung(a), fett(a), bezuege(a), gleich(a, zahl, tol), formelWie(a, [..]).
 */

const zlib = require("zlib");

const clean = (v) => String(v || "").trim();
const KEINE_EXCEL = "Das ist keine Excel-Datei. Wähle die Datei mit der Endung .xlsx, die du in Excel gespeichert hast.";
const MAX_BYTES = 600 * 1024;            // eine Übungstabelle hat etwa 10 KB

/* ------------------------------------------------------------------
   ZIP lesen (Inhaltsverzeichnis am Ende der Datei: dort stehen die Größen sicher)
   ------------------------------------------------------------------ */
function zipLesen(buf) {
  const n = buf.length, liste = {};
  if (n < 30 || buf.readUInt32LE(0) !== 0x04034b50) throw new Error("kein_zip");
  for (let i = n - 22; i >= Math.max(0, n - 70000); i--) {
    if (buf.readUInt32LE(i) !== 0x06054b50) continue;
    let p = buf.readUInt32LE(i + 16);
    const anzahl = buf.readUInt16LE(i + 10);
    for (let k = 0; k < anzahl && p + 46 <= n && buf.readUInt32LE(p) === 0x02014b50; k++) {
      const nameLen = buf.readUInt16LE(p + 28), extra = buf.readUInt16LE(p + 30), komm = buf.readUInt16LE(p + 32);
      liste[buf.toString("utf8", p + 46, p + 46 + nameLen)] = { methode: buf.readUInt16LE(p + 10), gross: buf.readUInt32LE(p + 20), kopf: buf.readUInt32LE(p + 42) };
      p += 46 + nameLen + extra + komm;
    }
    break;
  }
  const text = (name) => {
    const e = liste[name];
    if (!e || e.kopf + 30 > n) throw new Error("eintrag_fehlt");
    const start = e.kopf + 30 + buf.readUInt16LE(e.kopf + 26) + buf.readUInt16LE(e.kopf + 28);
    const roh = buf.subarray(start, start + e.gross);
    if (e.methode === 0) return roh.toString("utf8");
    if (e.methode !== 8) throw new Error("verfahren");
    return zlib.inflateRawSync(roh, { maxOutputLength: 4 * 1024 * 1024 }).toString("utf8");
  };
  return { namen: Object.keys(liste), hat: (name) => Object.prototype.hasOwnProperty.call(liste, name), text };
}

/* ------------------------------------------------------------------
   XML (nur so viel, wie eine Excel-Mappe braucht)
   ------------------------------------------------------------------ */
const ZEICHEN = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
const klartext = (s) => String(s == null ? "" : s).replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (_m, k) => {
  if (k.charAt(0) !== "#") return ZEICHEN[k.toLowerCase()];
  const nr = k.charAt(1).toLowerCase() === "x" ? parseInt(k.slice(2), 16) : parseInt(k.slice(1), 10);
  return Number.isFinite(nr) && nr > 0 && nr < 0x110000 ? String.fromCodePoint(nr) : "";
});
const attribut = (marke, name) => {
  const m = new RegExp("(?:^|\\s)" + name + '\\s*=\\s*"([^"]*)"').exec(marke || "");
  return m ? klartext(m[1]) : null;
};

/* ------------------------------------------------------------------
   Formeln: englische Schreibweise der Datei -> deutsche Schreibweise
   ------------------------------------------------------------------ */
const BUCHST = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const spalteNr = (s) => s.split("").reduce((x, c) => x * 26 + BUCHST.indexOf(c) + 1, 0) - 1;
const spalteName = (n) => { let s = ""; n++; while (n > 0) { s = BUCHST[(n - 1) % 26] + s; n = Math.floor((n - 1) / 26); } return s; };
const teile = (a) => { const m = /^([A-Z]+)(\d+)$/.exec(a); return m ? { s: spalteNr(m[1]), z: +m[2] } : null; };

// Kopierte Formeln speichert Excel nur in der ersten Zelle („shared formula“). Für die übrigen Zellen werden die
// Bezüge ohne $ um ds Spalten und dz Zeilen verschoben.
function verschiebe(f, ds, dz) {
  return f.replace(/(\$?)([A-Z]{1,3})(\$?)(\d+)(?![A-Za-z(])/g, (_m, fs, sp, fz, ze) => {
    const s = spalteNr(sp) + (fs ? 0 : ds), z = +ze + (fz ? 0 : dz);
    return s < 0 || z < 1 ? "#BEZUG!" : fs + spalteName(s) + fz + z;
  });
}
const NAMEN = { SUM: "SUMME", AVERAGE: "MITTELWERT", COUNT: "ANZAHL", IF: "WENN", ROUND: "RUNDEN", PRODUCT: "PRODUKT", COUNTA: "ANZAHL2", TODAY: "HEUTE", AND: "UND", OR: "ODER" };
const FEHLERWERT = { "#REF!": "#BEZUG!", "#VALUE!": "#WERT!", "#NAME?": "#NAME?", "#DIV/0!": "#DIV/0!", "#N/A": "#NV", "#NUM!": "#ZAHL!", "#NULL!": "#NULL!" };
function deutsch(f) {
  let s = String(f).replace(/\s+/g, "");
  s = s.replace(/,/g, ";").replace(/(\d)\.(\d)/g, "$1,$2");
  s = s.replace(/#REF!/g, "#BEZUG!").replace(/#VALUE!/g, "#WERT!");
  s = s.replace(/[A-Z][A-Z0-9.]*(?=\()/g, (name) => NAMEN[name] || name);
  return "=" + s.toUpperCase();
}

/* ------------------------------------------------------------------
   Mappe lesen
   ------------------------------------------------------------------ */
function blattLesen(xml, texte, formate) {
  const zellen = {}, gemeinsam = {};
  const re = /<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g;
  let m;
  while ((m = re.exec(xml))) {
    const a = attribut(m[1], "r"), typ = attribut(m[1], "t") || "n", innen = m[2] || "";
    if (!a) continue;
    const fM = /<f\b([^>]*?)(?:\/>|>([\s\S]*?)<\/f>)/.exec(innen), vM = /<v\b[^>]*>([\s\S]*?)<\/v>/.exec(innen);
    let f = "";
    if (fM) {
      const si = attribut(fM[1], "si"), fText = klartext(fM[2] || "");
      if (attribut(fM[1], "t") === "shared" && si != null) {
        if (fText) { gemeinsam[si] = { f: fText, a }; f = fText; }
        else if (gemeinsam[si]) { const von = teile(gemeinsam[si].a), nach = teile(a); f = von && nach ? verschiebe(gemeinsam[si].f, nach.s - von.s, nach.z - von.z) : ""; }
      } else f = fText;
    }
    const vText = vM ? klartext(vM[1]) : null;
    let v;
    if (typ === "s") v = vText != null ? texte[+vText] || "" : "";
    else if (typ === "inlineStr") v = (innen.match(/<t\b[^>]*>([\s\S]*?)<\/t>/g) || []).map((t) => klartext(t.replace(/<[^>]+>/g, ""))).join("");
    else if (typ === "str") v = vText != null ? vText : "";
    else if (typ === "e") v = vText != null ? (FEHLERWERT[vText] || vText) : "#WERT!";
    else if (typ === "b") v = vText === "1";
    else v = vText != null && vText !== "" ? parseFloat(vText) : undefined;
    const stil = (formate || [])[+attribut(m[1], "s") || 0] || {};
    if (f || v !== undefined) zellen[a] = { f: f ? deutsch(f) : "", v, art: stil.art || "", fett: !!stil.fett };
  }
  return zellen;
}

// Wie zeigt Excel die Zelle an? (Datum, Prozent, Währung; fett) – wichtig, wenn eine Zahl als Datum erscheint
function stileLesen(xml) {
  const roh = {}, formate = [];
  for (const m of xml.matchAll(/<numFmt\b([^>]*?)\/?>/g)) roh[attribut(m[1], "numFmtId")] = (attribut(m[1], "formatCode") || "").toLowerCase();
  const fonts = [], fontBlock = /<fonts\b[^>]*>([\s\S]*?)<\/fonts>/.exec(xml);
  if (fontBlock) for (const m of fontBlock[1].matchAll(/<font\b[^>]*?(?:\/>|>([\s\S]*?)<\/font>)/g)) fonts.push(/<b\s*\/>|<b\s+val="(?:1|true)"/.test(m[1] || ""));
  const xfs = /<cellXfs\b[^>]*>([\s\S]*?)<\/cellXfs>/.exec(xml);
  if (xfs) for (const m of xfs[1].matchAll(/<xf\b([^>]*)>/g)) {
    const id = +attribut(m[1], "numFmtId") || 0, voll = roh[id] || "";
    // für die Datumserkennung zählen nur die Platzhalter: Texte in Anführungszeichen und eckige Klammern weglassen
    const code = voll.replace(/"[^"]*"/g, "").replace(/\[[^\]]*\]/g, "");
    const eingebautesDatum = (id >= 14 && id <= 22) || (id >= 27 && id <= 36) || (id >= 45 && id <= 47) || (id >= 50 && id <= 58);
    formate.push({
      art: eingebautesDatum || /(^|[^a-z])(d{1,4}|m{3,5}|yy(yy)?)([^a-z]|$)/.test(code) ? "datum"
        : id === 9 || id === 10 || code.indexOf("%") >= 0 ? "prozent"
        : (id >= 5 && id <= 8) || id === 42 || id === 44 || /€|eur/.test(voll) ? "waehrung" : "",   // 37–41 und 43 („000“) zeigen kein Währungszeichen
      fett: !!fonts[+attribut(m[1], "fontId") || 0]
    });
  }
  return formate;
}

/**
 * Liest eine .xlsx-Datei. Wirft, wenn es keine Excel-Mappe ist.
 * @param {Buffer} buf
 */
function liesXlsx(buf) {
  const zip = zipLesen(buf);
  if (!zip.hat("xl/workbook.xml")) throw new Error("keine_mappe");
  const mappe = zip.text("xl/workbook.xml"), ziel = {};
  if (zip.hat("xl/_rels/workbook.xml.rels")) for (const m of zip.text("xl/_rels/workbook.xml.rels").matchAll(/<Relationship\b([^>]*?)\/?>/g)) ziel[attribut(m[1], "Id")] = attribut(m[1], "Target");
  const texte = [];
  if (zip.hat("xl/sharedStrings.xml")) for (const m of zip.text("xl/sharedStrings.xml").matchAll(/<si\b[^>]*?(?:\/>|>([\s\S]*?)<\/si>)/g)) {
    const ohneLautschrift = (m[1] || "").replace(/<rPh\b[\s\S]*?<\/rPh>/g, "");
    texte.push((ohneLautschrift.match(/<t\b[^>]*>([\s\S]*?)<\/t>/g) || []).map((t) => klartext(t.replace(/<[^>]+>/g, ""))).join(""));
  }
  const formate = zip.hat("xl/styles.xml") ? stileLesen(zip.text("xl/styles.xml")) : [];
  const blaetter = [];
  let nr = 0;
  for (const m of mappe.matchAll(/<sheet\b([^>]*?)\/?>/g)) {
    nr++;
    let pfad = ziel[attribut(m[1], "r:id")] || ("worksheets/sheet" + nr + ".xml");
    pfad = pfad.charAt(0) === "/" ? pfad.slice(1) : "xl/" + pfad;
    blaetter.push({ name: attribut(m[1], "name") || "", zellen: zip.hat(pfad) ? blattLesen(zip.text(pfad), texte, formate) : {} });
  }
  if (!blaetter.length) throw new Error("kein_blatt");
  const z = (a, b) => (blaetter[b || 0] || { zellen: {} }).zellen[String(a).toUpperCase().replace(/\$/g, "")] || null;
  const glatt = (s) => String(s || "").replace(/\s/g, "").toUpperCase();
  const info = {
    blaetter,
    zelle: z,
    formel: (a, b) => { const c = z(a, b); return c ? c.f : ""; },
    wert: (a, b) => { const c = z(a, b); return c ? c.v : undefined; },
    hatFormel: (a, b) => !!info.formel(a, b),
    istZahl: (a, b) => typeof info.wert(a, b) === "number",
    istText: (a, b) => typeof info.wert(a, b) === "string" && info.wert(a, b) !== "" && !info.hatFormel(a, b),
    istDatum: (a, b) => { const c = z(a, b); return !!c && c.art === "datum"; },
    istProzent: (a, b) => { const c = z(a, b); return !!c && c.art === "prozent"; },
    istWaehrung: (a, b) => { const c = z(a, b); return !!c && c.art === "waehrung"; },
    fett: (a, b) => { const c = z(a, b); return !!c && c.fett; },
    leer: (a, b) => { const c = z(a, b); return !c || ((c.v === undefined || c.v === "") && !c.f); },
    bezuege: (a, b) => info.formel(a, b).match(/\$?[A-Z]{1,3}\$?\d+/g) || [],
    gleich: (a, zahl, tol, b) => typeof info.wert(a, b) === "number" && Math.abs(info.wert(a, b) - zahl) <= (tol == null ? 0.005 : tol),
    formelWie: (a, liste, b) => (liste || []).some((f) => glatt(f) === info.formel(a, b))
  };
  return info;
}

/* ------------------------------------------------------------------
   Tabelle als Text für die KI: nur Zellen des ersten Blatts, zeilenweise, gekürzt
   ------------------------------------------------------------------ */
const zahlDe = (n) => String(Math.round(n * 10000) / 10000).replace(".", ",");
function tabellenText(x, max = 90) {
  const zellen = x.blaetter[0].zellen;
  const adressen = Object.keys(zellen).filter((a) => teile(a)).sort((a, b) => { const p = teile(a), q = teile(b); return p.z - q.z || p.s - q.s; });
  const zeilen = adressen.slice(0, max).map((a) => {
    const c = zellen[a], anzeige = c.art === "datum" ? " (wird als Datum angezeigt)" : c.art === "waehrung" ? " (Anzeige in Euro)" : c.art === "prozent" ? " (Anzeige in Prozent)" : "";
    const wert = typeof c.v === "number" ? zahlDe(c.v) : c.v === undefined ? "" : "„" + String(c.v).slice(0, 40) + "“";
    if (c.f) return `${a}: Formel ${c.f.slice(0, 60)} ergibt ${wert}${anzeige}`;
    return `${a}: ${typeof c.v === "number" ? "Zahl" : "Text"} ${wert}${anzeige}`;
  });
  if (adressen.length > max) zeilen.push(`… und ${adressen.length - max} weitere Zellen`);
  return zeilen.join("\n") || "(Die Tabelle ist leer.)";
}

/* ------------------------------------------------------------------
   KI: schreibt die Rückmeldung. Die Punkte des Prüfprogramms kann sie nicht ändern.
   ------------------------------------------------------------------ */
// Holt den Text aus der Antwort der KI – auch wenn das JSON abgeschnitten ist (zu lange Antwort) – und kürzt ihn
// auf höchstens `max` Zeichen, ohne mitten im Satz aufzuhören.
function rueckmeldungAusKi(roh, max = 380) {
  const s = String(roh || "");
  let text = "";
  const ganz = s.match(/\{[\s\S]*\}/);
  if (ganz) { try { text = clean(JSON.parse(ganz[0]).rueckmeldung); } catch (_e) { text = ""; } }
  if (!text) {
    // ungültiges JSON: entweder abgeschnitten oder mit geraden Anführungszeichen mitten im Text ("Standard")
    const m = s.match(/"rueckmeldung"\s*:\s*"([\s\S]*?)"\s*\}\s*(?:```)?\s*$/) || s.match(/"rueckmeldung"\s*:\s*"([\s\S]*)$/);
    if (m) text = clean(m[1].replace(/\\n/g, " ").replace(/\\"/g, '"').replace(/\\\\/g, "\\").replace(/\\$/, ""));
  }
  text = text.replace(/\s+/g, " ");
  if (text.length <= max && /[.!?…“"]$/.test(text)) return text;
  // am letzten Satzende vor der Grenze aufhören
  const teil = text.slice(0, max), ende = Math.max(teil.lastIndexOf(". "), teil.lastIndexOf("! "), teil.lastIndexOf("? "), /[.!?]$/.test(teil) ? teil.length - 1 : -1);
  return ende >= 15 ? teil.slice(0, ende + 1) : (text.length <= max ? text : "");
}

async function kiRueckmeldung(aufgabe, x, punkte, erfuellt, askAnthropic, klasse) {
  const offen = punkte.filter((p) => !p.ok), gut = punkte.filter((p) => p.ok);
  const ersatz = erfuellt
    ? "Deine Tabelle erfüllt alle Punkte."
    : (gut.length ? "Ein Teil stimmt schon. " : "") + "Sieh dir die Punkte mit ✗ an, verbessere sie in Excel, speichere und lade die Datei noch einmal hoch.";
  if (typeof askAnthropic !== "function") return { text: ersatz, quelle: "ersatz" };

  const system = [
    `Du gibst einem Kind der ${klasse} einer bayerischen Mittelschule eine Rückmeldung zu seiner Excel-Tabelle (Fach Informatik).`,
    "Ein Prüfprogramm hat die Tabelle schon genau geprüft. Seine Ergebnisse stimmen – ändere sie nicht und widersprich ihnen nicht.",
    "Schreibe höchstens 3 kurze Sätze (zusammen höchstens 45 Wörter) in einfacher Sprache und sprich das Kind mit du an.",
    "Nenne zuerst, was gelungen ist – auch dann, wenn noch etwas fehlt.",
    "Ist etwas offen: Greife nur EINEN offenen Punkt heraus, den wichtigsten. Sag, in welcher Zelle das Kind nachsehen soll und",
    "beschreibe in Worten, was dort gerechnet oder eingetragen werden soll (zum Beispiel: die beiden Einnahmen zusammenzählen).",
    "Sage keine Formel vor – auch keine Rechnung mit Zelladressen wie B2+B3. Zähle nicht alle offenen Punkte auf.",
    "Beschreibe keine Menüs oder Klickwege, die nicht im Auftrag oder in den Ergebnissen des Prüfprogramms stehen.",
    "Ist alles erfüllt: Lobe kurz und genau (was an dieser Tabelle gut ist). Fällt dir in der Tabelle noch eine Kleinigkeit auf,",
    "zum Beispiel ein Tippfehler in einer Überschrift, darfst du sie freundlich erwähnen.",
    "Sei freundlich und ermutigend. Keine Noten, keine Punkte, keine Emojis. Erfinde nichts, was nicht in der Tabelle steht.",
    "Benutze im Text keine geraden Anführungszeichen. Namen von Schaltflächen schreibst du so: „Standard“.",
    'Antworte nur als JSON: {"rueckmeldung": "..."}'
  ].join("\n");
  const user = [
    "Auftrag: " + aufgabe.auftrag,
    "Prüfprogramm – erfüllt:\n" + (gut.map((p) => "- " + p.text).join("\n") || "- nichts"),
    "Prüfprogramm – noch offen:\n" + (offen.map((p) => "- " + p.text).join("\n") || "- nichts"),
    "Die Tabelle des Kindes:\n" + tabellenText(x)
  ].join("\n\n");
  try {
    const text = rueckmeldungAusKi(await askAnthropic(system, user, 400));
    return text ? { text, quelle: "ki" } : { text: ersatz, quelle: "ersatz" };
  } catch (_e) {
    return { text: ersatz, quelle: "ersatz" };
  }
}

/* ------------------------------------------------------------------
   Route
   ------------------------------------------------------------------ */
function registerExcelPruefung(app, opts = {}) {
  const askAnthropic = opts.askAnthropic, prefix = opts.prefix || "/api/inf8", klasse = opts.klasse || "8. Klasse";
  const aufgaben = opts.aufgaben || {};
  // Bremse gegen Dauerfeuer: Eine ganze Klasse teilt sich in der Schule eine Adresse, deshalb großzügig. Darüber
  // gibt es weiter die exakte Prüfung, nur ohne KI-Text.
  const zaehler = new Map(), FENSTER = 10 * 60 * 1000, MAX_KI = Number(opts.maxKi) || 300;
  const kiErlaubt = (ip) => {
    const jetzt = Date.now(), e = zaehler.get(ip);
    if (!e || jetzt - e.start > FENSTER) { zaehler.set(ip, { start: jetzt, n: 1 }); if (zaehler.size > 5000) zaehler.clear(); return true; }
    return ++e.n <= MAX_KI;
  };

  app.post(prefix + "/excel/pruefen", async (req, res) => {
    const kennung = clean(req.body?.aufgabe).slice(0, 60);
    const aufgabe = Object.prototype.hasOwnProperty.call(aufgaben, kennung) ? aufgaben[kennung] : null;
    if (!aufgabe) return res.status(404).json({ ok: false, error: "unbekannte_aufgabe", message: "Diese Aufgabe gibt es nicht." });
    const b64 = typeof req.body?.datei === "string" ? req.body.datei : "";
    if (!b64) return res.status(400).json({ ok: false, error: "keine_datei", message: "Es ist keine Datei angekommen." });
    const nichtLesbar = (text) => res.json({ ok: true, lesbar: false, erfuellt: false, punkte: [], rueckmeldung: text, quelle: "pruefprogramm" });
    if (b64.length > MAX_BYTES * 1.4) return nichtLesbar("Die Datei ist zu groß. Eine Übungstabelle ist viel kleiner – hast du die richtige Datei gewählt?");
    let x;
    try { x = liesXlsx(Buffer.from(b64, "base64")); } catch (_e) { return nichtLesbar(KEINE_EXCEL); }
    let punkte;
    try { punkte = (aufgabe.pruefe(x) || []).map((p) => ({ ok: !!p.ok, text: clean(p.text).slice(0, 300) })); }
    catch (_e) { return nichtLesbar("Die Datei lässt sich nicht prüfen. Speichere sie in Excel noch einmal als Excel-Arbeitsmappe (.xlsx)."); }
    const erfuellt = punkte.length > 0 && punkte.every((p) => p.ok);
    const ki = await kiRueckmeldung(aufgabe, x, punkte, erfuellt, kiErlaubt(req.ip || "") ? askAnthropic : null, klasse);
    return res.json({ ok: true, lesbar: true, erfuellt, punkte, rueckmeldung: ki.text, quelle: ki.quelle });
  });
}

module.exports = { registerExcelPruefung, liesXlsx, tabellenText, zipLesen, rueckmeldungAusKi };
