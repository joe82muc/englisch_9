"use strict";

/**
 * Kleine Excel-Datei (.xlsx) ohne zusaetzliches Paket.
 *
 * Eine CSV-Datei haengt in Excel vom Rechner ab (Trennzeichen, Umlaute,
 * Datumsformat). Eine echte .xlsx-Datei oeffnet sich ueberall gleich:
 * Zahlen sind Zahlen, Datumswerte sind Datumswerte, die Kopfzeile bleibt stehen.
 *
 *   buildXlsx([{ name, columns: [{ header, width, type }], rows: [[...]] }])
 *     type: "text" (Standard), "number", "date" (JS-Date oder "JJJJ-MM-TT"),
 *           "datetime" (JS-Date, wird in deutscher Zeit angezeigt)
 *   -> Buffer
 */

const zlib = require("zlib");

/* ---------------- ZIP (Deflate) ---------------- */

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function zip(files) {
  const locals = [];
  const centrals = [];
  let offset = 0;
  // feste DOS-Zeit 01.01.2020 00:00, damit gleiche Daten gleiche Dateien ergeben
  const dosTime = 0;
  const dosDate = ((2020 - 1980) << 9) | (1 << 5) | 1;

  for (const f of files) {
    const name = Buffer.from(f.name, "utf8");
    const raw = Buffer.isBuffer(f.data) ? f.data : Buffer.from(f.data, "utf8");
    const packed = zlib.deflateRawSync(raw);
    const crc = crc32(raw);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);        // benoetigte Version
    local.writeUInt16LE(0x0800, 6);    // Dateinamen in UTF-8
    local.writeUInt16LE(8, 8);         // Deflate
    local.writeUInt16LE(dosTime, 10);
    local.writeUInt16LE(dosDate, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(packed.length, 18);
    local.writeUInt32LE(raw.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    locals.push(local, name, packed);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt16LE(dosTime, 12);
    central.writeUInt16LE(dosDate, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(packed.length, 20);
    central.writeUInt32LE(raw.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt16LE(0, 30);
    central.writeUInt16LE(0, 32);
    central.writeUInt16LE(0, 34);
    central.writeUInt16LE(0, 36);
    central.writeUInt32LE(0, 38);
    central.writeUInt32LE(offset, 42);
    centrals.push(central, name);

    offset += local.length + name.length + packed.length;
  }

  const centralSize = centrals.reduce((s, b) => s + b.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20);

  return Buffer.concat([...locals, ...centrals, end]);
}

/* ---------------- Tabellen-XML ---------------- */

const xmlEsc = (s) => String(s)
  // Steuerzeichen sind in XML verboten
  .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function colName(i) {
  let s = "";
  for (let n = i + 1; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
  return s;
}

// Excel zaehlt Tage ab dem 30.12.1899
const EXCEL_EPOCH = Date.UTC(1899, 11, 30);

function berlinParts(date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
  }).formatToParts(date);
  const get = (t) => Number(parts.find((p) => p.type === t).value);
  return { y: get("year"), m: get("month"), d: get("day"), h: get("hour"), min: get("minute"), s: get("second") };
}

function dateSerial(value) {
  if (!value) return null;
  const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return (Date.UTC(+m[1], +m[2] - 1, +m[3]) - EXCEL_EPOCH) / 86400000;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  const p = berlinParts(d);
  return (Date.UTC(p.y, p.m - 1, p.d) - EXCEL_EPOCH) / 86400000;
}

function dateTimeSerial(value) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  const p = berlinParts(d);
  return (Date.UTC(p.y, p.m - 1, p.d, p.h, p.min, p.s) - EXCEL_EPOCH) / 86400000;
}

// Stil-Nummern aus styles.xml
const STYLE = { text: 0, header: 1, date: 2, datetime: 3, wrap: 4 };

function cellXml(ref, value, type) {
  if (value === null || value === undefined || value === "") return "";
  if (type === "number") {
    const n = Number(value);
    if (Number.isFinite(n)) return `<c r="${ref}"><v>${n}</v></c>`;
  }
  if (type === "date") {
    const n = dateSerial(value);
    if (n !== null) return `<c r="${ref}" s="${STYLE.date}"><v>${n}</v></c>`;
  }
  if (type === "datetime") {
    const n = dateTimeSerial(value);
    if (n !== null) return `<c r="${ref}" s="${STYLE.datetime}"><v>${n}</v></c>`;
  }
  const style = type === "wrap" ? ` s="${STYLE.wrap}"` : "";
  return `<c r="${ref}" t="inlineStr"${style}><is><t xml:space="preserve">${xmlEsc(value)}</t></is></c>`;
}

function sheetXml(sheet) {
  const cols = sheet.columns;
  const colsXml = "<cols>" + cols.map((c, i) =>
    `<col min="${i + 1}" max="${i + 1}" width="${c.width || 12}" customWidth="1"/>`).join("") + "</cols>";

  const head = `<row r="1">` + cols.map((c, i) =>
    `<c r="${colName(i)}1" t="inlineStr" s="${STYLE.header}"><is><t xml:space="preserve">${xmlEsc(c.header)}</t></is></c>`
  ).join("") + `</row>`;

  const body = sheet.rows.map((row, r) =>
    `<row r="${r + 2}">` + cols.map((c, i) => cellXml(colName(i) + (r + 2), row[i], c.type)).join("") + `</row>`
  ).join("");

  const pane = '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>';

  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ' +
    'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
    pane + '<sheetFormatPr defaultRowHeight="15"/>' + colsXml +
    `<sheetData>${head}${body}</sheetData></worksheet>`;
}

const STYLES_XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
  '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
  '<numFmts count="2"><numFmt numFmtId="164" formatCode="dd.mm.yyyy"/><numFmt numFmtId="165" formatCode="dd.mm.yyyy hh:mm"/></numFmts>' +
  '<fonts count="2"><font><sz val="11"/><name val="Calibri"/><family val="2"/></font>' +
  '<font><b/><sz val="11"/><name val="Calibri"/><family val="2"/></font></fonts>' +
  '<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>' +
  '<fill><patternFill patternType="solid"><fgColor rgb="FFDDEBF7"/><bgColor indexed="64"/></patternFill></fill></fills>' +
  '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
  '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
  '<cellXfs count="5">' +
  '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
  '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment wrapText="1" vertical="top"/></xf>' +
  '<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>' +
  '<xf numFmtId="165" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>' +
  '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment wrapText="1" vertical="top"/></xf>' +
  '</cellXfs>' +
  '<cellStyles count="1"><cellStyle name="Standard" xfId="0" builtinId="0"/></cellStyles>' +
  '</styleSheet>';

function sheetName(name, used) {
  // Excel: hoechstens 31 Zeichen, keine : \ / ? * [ ]
  let base = String(name || "Tabelle").replace(/[:\\/?*[\]]/g, " ").trim().slice(0, 31) || "Tabelle";
  let n = base, k = 2;
  while (used.has(n.toLowerCase())) n = base.slice(0, 28) + " " + k++;
  used.add(n.toLowerCase());
  return n;
}

function buildXlsx(sheets) {
  const used = new Set();
  const names = sheets.map((s) => sheetName(s.name, used));

  const files = [
    {
      name: "[Content_Types].xml",
      data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
        '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
        sheets.map((_s, i) =>
          `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`
        ).join("") +
        '</Types>'
    },
    {
      name: "_rels/.rels",
      data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
        '</Relationships>'
    },
    {
      name: "xl/workbook.xml",
      data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ' +
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
        '<bookViews><workbookView/></bookViews><sheets>' +
        names.map((n, i) => `<sheet name="${xmlEsc(n)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join("") +
        '</sheets></workbook>'
    },
    {
      name: "xl/_rels/workbook.xml.rels",
      data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        sheets.map((_s, i) =>
          `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`
        ).join("") +
        `<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>` +
        '</Relationships>'
    },
    { name: "xl/styles.xml", data: STYLES_XML },
    ...sheets.map((s, i) => ({ name: `xl/worksheets/sheet${i + 1}.xml`, data: sheetXml(s) }))
  ];

  return zip(files);
}

module.exports = { buildXlsx, crc32, dateSerial, dateTimeSerial };
