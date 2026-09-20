"use strict";

/**
 * Praktische Filius-Pruefung (Informatik 9)
 * -----------------------------------------
 * Wie das Netzwerktest-Modul, aber mit einem zusaetzlichen Teil B:
 * Die Schuelerin / der Schueler laedt die gespeicherte Filius-Datei hoch.
 *
 * Eine .fls-Datei ist eine ZIP-Datei mit "projekt/konfiguration.xml" darin.
 * Der Server liest daraus Geraete, IP-Adressen, Gateways und installierte
 * Software aus und prueft die Pflichtpunkte EXAKT (Pruefprogramm, keine KI).
 * Die KI formuliert danach nur noch die Rueckmeldung in Schuelersprache -
 * so sind die Punkte nachpruefbar und bei gleicher Abgabe immer gleich.
 *
 * Das Entpacken passiert ohne Fremdbibliothek mit zlib (inflateRaw), damit
 * im Backend keine neue Abhaengigkeit noetig ist.
 *
 * Ausserdem liegt hier die Beispiel-Filius-Datei. Sie zeigt eine fertige
 * Loesung und wird deshalb nur ausgeliefert, wenn die Lehrkraft sie
 * freigegeben hat (opts.beispielDatei = Pfad zur .fls).
 */

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const crypto = require("crypto");

/* ------------------------------------------------------------------
   Notenschluessel (wie bei den anderen Proben)
   ------------------------------------------------------------------ */
const GRADE_SCALE = [
  { grade: 1, min: 92 }, { grade: 2, min: 81 }, { grade: 3, min: 67 },
  { grade: 4, min: 50 }, { grade: 5, min: 30 }, { grade: 6, min: 0 }
];

function gradeFromPercent(percent) {
  const p = Number(percent) || 0;
  for (const step of GRADE_SCALE) if (p >= step.min) return step.grade;
  return 6;
}

const clean = (v) => String(v || "").trim();

/* ------------------------------------------------------------------
   ZIP entpacken (nur so viel, wie fuer .fls noetig ist)
   ------------------------------------------------------------------ */
/**
 * Holt eine Datei aus einem ZIP-Puffer.
 * Unterstuetzt die beiden Verfahren, die Filius benutzt:
 *   0 = unkomprimiert gespeichert, 8 = deflate
 * @returns {string|null} Inhalt als UTF-8 Text
 */
function zipEntryLesen(buf, endung) {
  const SIG = 0x04034b50;                     // "PK\3\4" lokaler Dateikopf
  for (let i = 0; i + 30 < buf.length; i++) {
    if (buf.readUInt32LE(i) !== SIG) continue;

    const methode   = buf.readUInt16LE(i + 8);
    let   compSize  = buf.readUInt32LE(i + 18);
    const nameLen   = buf.readUInt16LE(i + 26);
    const extraLen  = buf.readUInt16LE(i + 28);
    const nameStart = i + 30;
    if (nameStart + nameLen > buf.length) continue;

    const name = buf.toString("utf8", nameStart, nameStart + nameLen);
    const datenStart = nameStart + nameLen + extraLen;

    if (!name.toLowerCase().endsWith(endung.toLowerCase())) continue;

    // Groesse 0 + Data-Descriptor: bis zum naechsten Signaturblock lesen.
    if (compSize === 0) {
      let ende = buf.length;
      for (let j = datenStart; j + 4 <= buf.length; j++) {
        const s = buf.readUInt32LE(j);
        if (s === SIG || s === 0x08074b50 || s === 0x02014b50) { ende = j; break; }
      }
      compSize = ende - datenStart;
    }
    if (compSize <= 0 || datenStart + compSize > buf.length) continue;

    const roh = buf.slice(datenStart, datenStart + compSize);
    try {
      if (methode === 0) return roh.toString("utf8");
      if (methode === 8) return zlib.inflateRawSync(roh).toString("utf8");
    } catch (_e) {
      // Naechsten Treffer versuchen
    }
  }
  return null;
}

/* ------------------------------------------------------------------
   Filius-Projekt auslesen
   ------------------------------------------------------------------ */
/**
 * Liest die Netzstruktur aus konfiguration.xml.
 * @returns {{geraete:Array, software:Array, dhcp:boolean, ips:Array}}
 */
function filiusAuslesen(xml) {
  const geraete = [];
  // Jeder Knoten beginnt mit <object class="filius.hardware.knoten.XYZ"
  const teile = xml.split(/(?=<object class="filius\.hardware\.knoten\.)/);

  for (const t of teile.slice(1)) {
    const art = (t.match(/knoten\.(\w+)/) || [])[1] || "?";
    const name = (t.match(/<void property="name">\s*<string>([^<]*)<\/string>/) || [])[1] || "";
    const ips = (t.match(/<void property="ip">\s*<string>([^<]*)<\/string>/g) || [])
      .map((s) => (s.match(/<string>([^<]*)<\/string>/) || [])[1])
      .filter(Boolean);
    const gateway = (t.match(/<void property="gateway">\s*<string>([^<]*)<\/string>/) || [])[1] || "";
    const dns = (t.match(/<void property="dns">\s*<string>([^<]*)<\/string>/) || [])[1] || "";
    const maske = (t.match(/<void property="(?:subnetzMaske|netzmaske)">\s*<string>([^<]*)<\/string>/) || [])[1] || "";
    geraete.push({ art, name, ips, gateway, dns, maske });
  }

  const software = Array.from(new Set(
    (xml.match(/filius\.software\.[\w.]+\.(\w+)/g) || [])
      .map((s) => s.split(".").pop())
  ));

  /* DHCP: Vorsicht - <void property="DHCPServer"> steht in JEDER Datei als
     leerer Platzhalter (nur mit einem Thread-Namen darin). Das allein beweist
     nichts. Gewertet wird nur, wenn ein Bereich oder ein Aktiv-Flag gesetzt ist. */
  /* Vorsicht 2: <void property="aktiv"><boolean>true</boolean></void> heisst nur,
     dass IRGENDEIN Dienst laeuft - in einer Testdatei war es der Webserver.
     Als DHCP-Nachweis zaehlt daher nur ein gesetzter Adressbereich oder ein
     ausdrueckliches DHCP-Feld. */
  const dhcp = /<void property="(?:untergrenze|obergrenze|rangeStart|rangeEnd)">/i.test(xml)
    || /dhcpKonfiguration|aktivDHCP|dhcpAktiviert/i.test(xml);

  /* Laeuft ein Dienst wirklich? Filius merkt sich den gestarteten Dienst mit
     aktiv=true kurz hinter der Software-Klasse. */
  function dienstLaeuft(klasse) {
    const re = new RegExp(
      'class="filius\\.software\\.[\\w.]*' + klasse + '"[\\s\\S]{0,900}?<void property="aktiv">\\s*<boolean>true</boolean>',
      "i"
    );
    return re.test(xml);
  }

  /* Selbst geschriebene Webseiten: Filius legt jede Datei mit Namen, Typ und
     vollstaendigem Inhalt ab. So laesst sich pruefen, ob wirklich eine eigene
     Seite geschrieben wurde und nicht nur die leere Vorlage stehen blieb. */
  const seiten = [];
  const dateiRe = /<object class="filius\.software\.system\.Datei">([\s\S]{0,60000}?)<\/object>/g;
  let treffer;
  while ((treffer = dateiRe.exec(xml)) !== null) {
    const block = treffer[1];
    const name = (block.match(/<void property="name">\s*<string>([^<]*)<\/string>/) || [])[1] || "";
    if (!/\.html?$/i.test(name)) continue;
    const inhalt = (block.match(/<void property="dateiInhalt">\s*<string>([\s\S]*?)<\/string>/) || [])[1] || "";
    const text = inhalt
      .replace(/&lt;[^&]*?&gt;/g, " ")   // HTML-Tags (im XML maskiert) entfernen
      .replace(/<[^>]*>/g, " ")
      .replace(/&[a-z]+;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    seiten.push({ name, zeichen: inhalt.length, text });
  }

  const ips = Array.from(new Set(geraete.flatMap((g) => g.ips)));

  return {
    geraete, software, dhcp, ips, seiten,
    webserverLaeuft: dienstLaeuft("WebServer"),
    echoserverLaeuft: dienstLaeuft("ServerBaustein")
  };
}

/* ------------------------------------------------------------------
   Pflichtpunkte pruefen (exakt, ohne KI)
   ------------------------------------------------------------------ */
function checkAusfuehren(check, netz) {
  const g = netz.geraete;
  switch (check.typ) {
    case "geraet": {
      const n = g.filter((x) => x.art === check.art).length;
      return { ok: n >= (check.mindestens || 1), ist: n + " gefunden" };
    }
    case "router2": {
      const r = g.filter((x) => x.art === "Vermittlungsrechner" && x.ips.length >= 2);
      return { ok: r.length >= 1, ist: r.length ? "vorhanden" : "fehlt oder nur eine Schnittstelle" };
    }
    case "ip": {
      const da = netz.ips.includes(check.ip);
      return { ok: da, ist: da ? "vorhanden" : "nicht gefunden" };
    }
    case "netz": {
      const n = netz.ips.filter((ip) => ip.startsWith(check.praefix)).length;
      return { ok: n >= (check.mindestens || 1), ist: n + " Adressen" };
    }
    case "gateway": {
      const imNetz = g.filter((x) => x.ips.some((ip) => ip.startsWith(check.praefix))
        && x.art !== "Vermittlungsrechner" && x.art !== "Switch");
      if (!imNetz.length) return { ok: false, ist: "keine Geraete in diesem Netz" };
      const falsch = imNetz.filter((x) => x.gateway !== check.gateway);
      return {
        ok: falsch.length === 0,
        ist: falsch.length ? (falsch.length + " ohne bzw. mit falschem Gateway") : "bei allen richtig"
      };
    }
    case "software": {
      const da = netz.software.includes(check.name);
      return { ok: da, ist: da ? "installiert" : "nicht installiert" };
    }
    case "dhcp": {
      return { ok: netz.dhcp, ist: netz.dhcp ? "aktiviert" : "nicht gefunden" };
    }
    case "laeuft": {
      /* Dienst installiert UND gestartet. */
      const da = netz.software.includes(check.name);
      const an = check.name === "WebServer" ? netz.webserverLaeuft
               : check.name === "ServerBaustein" ? netz.echoserverLaeuft
               : false;
      if (!da) return { ok: false, ist: "nicht installiert" };
      return { ok: an, ist: an ? "installiert und gestartet" : "installiert, aber nicht gestartet" };
    }
    case "webseite": {
      /* Eigene Seite geschrieben? Die leere Filius-Vorlage hat rund 200 Zeichen,
         deshalb zaehlt nur eine Seite mit erkennbarem eigenem Text. */
      const min = Number(check.mindestZeichen) || 120;
      const passende = (netz.seiten || []).filter((x) =>
        (!check.dateiname || x.name.toLowerCase() === String(check.dateiname).toLowerCase())
        && x.text.length >= min);
      if (!passende.length) {
        const gibt = (netz.seiten || []).length;
        return { ok: false, ist: gibt ? "Seite vorhanden, aber zu wenig eigener Inhalt" : "keine HTML-Seite gefunden" };
      }
      return { ok: true, ist: passende.map((x) => x.name).join(", ") + " mit eigenem Inhalt" };
    }
    default:
      return { ok: false, ist: "unbekannte Pruefung" };
  }
}

/**
 * Prueft eine hochgeladene .fls-Datei gegen die Checks der Aufgabe.
 * @param {Buffer} buf  Inhalt der Datei
 */
function dateiPruefen(buf, upload) {
  const xml = zipEntryLesen(buf, "konfiguration.xml");
  if (!xml) {
    return {
      lesbar: false,
      punkte: 0,
      maxPunkte: (upload.checks || []).reduce((s, c) => s + c.punkte, 0),
      details: [],
      hinweis: "Die Datei konnte nicht gelesen werden. Ist es wirklich eine in Filius gespeicherte .fls-Datei?"
    };
  }

  const netz = filiusAuslesen(xml);
  const details = (upload.checks || []).map((c) => {
    const r = checkAusfuehren(c, netz);
    return {
      id: c.id, text: c.text,
      erfuellt: r.ok, ist: r.ist,
      punkte: r.ok ? c.punkte : 0, maxPunkte: c.punkte
    };
  });

  return {
    lesbar: true,
    punkte: details.reduce((s, d) => s + d.punkte, 0),
    maxPunkte: details.reduce((s, d) => s + d.maxPunkte, 0),
    details,
    netz: {
      geraete: netz.geraete.map((g) => ({ art: g.art, name: g.name, ips: g.ips, gateway: g.gateway })),
      software: netz.software,
      dhcp: netz.dhcp
    }
  };
}

/**
 * Die KI bewertet das gebaute Netz zusaetzlich zu den festen Pruefpunkten.
 *
 * Aufteilung der Punkte in Teil B:
 *   - Pflichtpunkte (checks): vom Pruefprogramm exakt vergeben, immer gleich.
 *   - KI-Punkte (kiPunkte):   fuer die Qualitaet der Gesamtloesung - sauberer
 *     Aufbau, sinnvolle Namen, stimmige Adressen, sichtbarer Mehraufwand.
 *
 * Die KI kann die Pflichtpunkte NICHT veraendern. Faellt sie aus, gibt es
 * die KI-Punkte anteilig zu den erfuellten Pflichtpunkten, damit niemand
 * wegen einer Stoerung der Schnittstelle Nachteile hat.
 */
async function kiBewertung(pruefung, upload, askAnthropic) {
  const max = Number(upload.kiPunkte) || 0;
  const offen = pruefung.details.filter((d) => !d.erfuellt);
  const erfuellt = pruefung.details.filter((d) => d.erfuellt);

  if (!pruefung.lesbar) {
    return { punkte: 0, maxPunkte: max, text: pruefung.hinweis, quelle: "keine-datei" };
  }

  /* Ersatz, wenn keine KI erreichbar ist: anteilig zu den Pflichtpunkten. */
  const anteil = pruefung.maxPunkte
    ? Math.round(max * (pruefung.punkte / pruefung.maxPunkte))
    : 0;
  const ersatzText = offen.length
    ? "Noch offen: " + offen.map((d) => d.text).join("; ") + "."
    : "Alles Geforderte ist vorhanden.";

  if (typeof askAnthropic !== "function" || !max) {
    return { punkte: anteil, maxPunkte: max, text: ersatzText, quelle: "ersatz" };
  }

  const netz = pruefung.netz || { geraete: [], software: [], dhcp: false };
  const liste = netz.geraete.map((g) =>
    "- " + g.art + (g.name ? " (" + g.name + ")" : "") +
    (g.ips && g.ips.length ? ", IP " + g.ips.join(" / ") : ", ohne feste IP") +
    (g.gateway ? ", Gateway " + g.gateway : "")
  ).join("\n");

  const system = [
    "Du bewertest das Netzwerk, das eine Schuelerin oder ein Schueler der 9. Klasse",
    "in der Lernsoftware Filius gebaut hat (Mittelschule Bayern).",
    "",
    "Die Pflichtanforderungen sind bereits automatisch geprueft worden - die aendere nicht.",
    "Du vergibst zusaetzliche Punkte fuer die QUALITAET der Gesamtloesung:",
    "- Ist das Netz sauber und nachvollziehbar aufgebaut?",
    "- Passen Adressen, Netzmasken und Gateways zusammen?",
    "- Sind die Geraete sinnvoll benannt?",
    "- Wurde mehr gemacht als verlangt, zum Beispiel DNS, Mailserver oder DHCP?",
    "",
    "Bewerte wohlwollend: Im Zweifel fuer die Schuelerin oder den Schueler.",
    "Ist das Geforderte da und stimmig, gib die volle Punktzahl.",
    "Bei einem halb fertigen Netz gib Teilpunkte, bei einem leeren Netz 0.",
    "",
    "Vergib ganze Punkte von 0 bis " + max + ".",
    "",
    "Antworte NUR mit JSON in genau dieser Form, ohne weiteren Text:",
    '{"punkte": <Zahl>, "text": "<Rueckmeldung auf Deutsch, hoechstens 3 kurze Saetze, direkt an die Schuelerin oder den Schueler>"}'
  ].join("\n");

  const user = [
    "Aufgabenstellung:",
    upload.aufgabe,
    "",
    "Automatisch geprueft - erfuellt: " + (erfuellt.map((d) => d.text).join("; ") || "nichts"),
    "Automatisch geprueft - offen: " + (offen.map((d) => d.text + " (" + d.ist + ")").join("; ") || "nichts"),
    "",
    "Das tatsaechlich gebaute Netz:",
    liste || "(keine Geraete gefunden)",
    "",
    "Installierte Software: " + (netz.software.join(", ") || "keine"),
    "DHCP eingerichtet: " + (netz.dhcp ? "ja" : "nein")
  ].join("\n");

  try {
    const roh = await askAnthropic(system, user, 400);
    const treffer = String(roh || "").match(/\{[\s\S]*\}/);
    if (!treffer) return { punkte: anteil, maxPunkte: max, text: ersatzText, quelle: "ersatz" };

    const daten = JSON.parse(treffer[0]);
    let punkte = Number(daten.punkte);
    if (!Number.isFinite(punkte)) return { punkte: anteil, maxPunkte: max, text: ersatzText, quelle: "ersatz" };
    punkte = Math.max(0, Math.min(max, Math.round(punkte)));

    return {
      punkte,
      maxPunkte: max,
      text: clean(daten.text).slice(0, 400) || ersatzText,
      quelle: "ki"
    };
  } catch (_e) {
    return { punkte: anteil, maxPunkte: max, text: ersatzText, quelle: "ersatz" };
  }
}

/* ------------------------------------------------------------------
   Datenhaltung
   ------------------------------------------------------------------ */
function createStore(dataDir) {
  const UNLOCK_FILE = path.join(dataDir, "filiuspruefungen.json");
  const SUB_FILE = path.join(dataDir, "filiuspruefung_abgaben.json");

  function ensure() {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    if (!fs.existsSync(UNLOCK_FILE)) fs.writeFileSync(UNLOCK_FILE, JSON.stringify({ unlocked: {} }, null, 2), "utf8");
    if (!fs.existsSync(SUB_FILE)) fs.writeFileSync(SUB_FILE, JSON.stringify({ submissions: [] }, null, 2), "utf8");
  }
  function loadUnlocks() {
    try {
      const d = JSON.parse(fs.readFileSync(UNLOCK_FILE, "utf8"));
      if (!d.dateien) d.dateien = {};
      return d;
    } catch (_e) { return { unlocked: {}, dateien: {} }; }
  }
  function saveUnlocks(d) { fs.writeFileSync(UNLOCK_FILE, JSON.stringify(d, null, 2), "utf8"); }
  function loadSubmissions() {
    try { return JSON.parse(fs.readFileSync(SUB_FILE, "utf8")); } catch (_e) { return { submissions: [] }; }
  }
  function saveSubmissions(d) { fs.writeFileSync(SUB_FILE, JSON.stringify(d, null, 2), "utf8"); }

  ensure();
  return { loadUnlocks, saveUnlocks, loadSubmissions, saveSubmissions };
}

function studentKey(f, l, k) {
  return `${clean(f)}|${clean(l)}|${clean(k)}`.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim();
}

/* ------------------------------------------------------------------
   Routen
   ------------------------------------------------------------------ */
function registerFiliusPruefungRoutes(app, opts) {
  const store = createStore(opts.dataDir);
  const TESTS = opts.tests || {};
  const PW = opts.teacherPassword;
  const askAnthropic = opts.askAnthropic;

  const isTeacher = (req) => clean(req.body?.password) === PW;
  const maxA = (t) => t.items.reduce((s, i) => s + (Number(i.points) || 1), 0);
  const maxB = (t) => (t.upload?.checks || []).reduce((s, c) => s + c.punkte, 0)
    + (Number(t.upload?.kiPunkte) || 0);

  app.get("/api/filiuspruefung/list", (_req, res) => {
    const u = store.loadUnlocks();
    res.json({
      ok: true,
      tests: Object.values(TESTS).map((t) => ({
        id: t.id, title: t.title, unit: t.unit, classLevel: t.classLevel,
        itemCount: t.items.length,
        maxPoints: maxA(t) + maxB(t),
        unlocked: Boolean(u.unlocked[t.id]?.open)
      }))
    });
  });

  app.post("/api/filiuspruefung/start", (req, res) => {
    const testId = clean(req.body?.testId);
    const firstName = clean(req.body?.firstName);
    const lastName = clean(req.body?.lastName);
    const className = clean(req.body?.className);
    const test = TESTS[testId];
    if (!test) return res.status(404).json({ ok: false, error: "test_not_found" });

    if (!store.loadUnlocks().unlocked[testId]?.open) {
      return res.status(403).json({ ok: false, error: "locked", message: "Diese Pruefung ist noch nicht freigeschaltet." });
    }
    if (!firstName || !lastName || !className) {
      return res.status(400).json({ ok: false, error: "missing_fields", message: "Vorname, Nachname und Klasse sind erforderlich." });
    }
    const key = studentKey(firstName, lastName, className);
    const da = store.loadSubmissions().submissions.find((s) => s.testId === testId && s.studentKey === key);
    if (da) {
      return res.status(409).json({ ok: false, error: "already_submitted", message: "Fuer diesen Namen wurde die Pruefung bereits abgegeben.", submittedAt: da.submittedAt });
    }

    res.json({
      ok: true,
      test: { id: test.id, title: test.title, unit: test.unit, maxPoints: maxA(test) + maxB(test), maxA: maxA(test), maxB: maxB(test) },
      items: test.items.map((it, i) => ({ nr: i + 1, type: it.type, prompt: it.prompt, options: it.options, points: Number(it.points) || 1 })),
      upload: { aufgabe: test.upload.aufgabe, punkte: maxB(test) }
    });
  });

  app.post("/api/filiuspruefung/submit", async (req, res) => {
    const testId = clean(req.body?.testId);
    const firstName = clean(req.body?.firstName);
    const lastName = clean(req.body?.lastName);
    const className = clean(req.body?.className);
    const answers = Array.isArray(req.body?.answers) ? req.body.answers : [];
    const dateiB64 = clean(req.body?.datei);      // Base64 der .fls-Datei
    const dateiName = clean(req.body?.dateiName);

    const test = TESTS[testId];
    if (!test) return res.status(404).json({ ok: false, error: "test_not_found" });
    if (!store.loadUnlocks().unlocked[testId]?.open) {
      return res.status(403).json({ ok: false, error: "locked" });
    }
    if (!firstName || !lastName || !className) {
      return res.status(400).json({ ok: false, error: "missing_fields" });
    }

    const key = studentKey(firstName, lastName, className);
    const db = store.loadSubmissions();
    const da = db.submissions.find((s) => s.testId === testId && s.studentKey === key);
    if (da) {
      return res.status(409).json({ ok: false, error: "already_submitted", message: "Diese Pruefung wurde bereits abgegeben.", submittedAt: da.submittedAt });
    }

    /* ---- Teil A ---- */
    const teilA = test.items.map((item, i) => {
      const p = Number.isInteger(answers[i]) ? answers[i] : parseInt(answers[i], 10);
      const ok = p === item.answer;
      return {
        nr: i + 1, prompt: item.prompt,
        given: item.options[p] !== undefined ? item.options[p] : "",
        correct: ok, points: ok ? (Number(item.points) || 1) : 0,
        maxPoints: Number(item.points) || 1,
        expected: item.options[item.answer]
      };
    });

    /* ---- Teil B: Filius-Datei ---- */
    let teilB = { lesbar: false, punkte: 0, maxPunkte: maxB(test), details: [], hinweis: "Keine Datei abgegeben." };
    if (dateiB64) {
      try {
        const buf = Buffer.from(dateiB64, "base64");
        if (buf.length > 6 * 1024 * 1024) {
          teilB.hinweis = "Die Datei ist zu gross (mehr als 6 MB).";
        } else {
          teilB = dateiPruefen(buf, test.upload);
        }
      } catch (_e) {
        teilB.hinweis = "Die Datei konnte nicht gelesen werden.";
      }
    }
    /* Die KI bewertet die Qualitaet des Netzes zusaetzlich zu den Pflichtpunkten. */
    const ki = await kiBewertung(teilB, test.upload, askAnthropic);
    teilB.ki = ki;
    teilB.rueckmeldung = ki.text;
    teilB.punkte += ki.punkte;
    teilB.maxPunkte += ki.maxPunkte;

    const score = teilA.reduce((s, d) => s + d.points, 0) + teilB.punkte;
    const total = maxA(test) + maxB(test);
    const percent = total ? Math.round((score / total) * 100) : 0;
    const grade = gradeFromPercent(percent);

    const record = {
      id: `fp_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
      testId, testTitle: test.title, unit: test.unit,
      firstName, lastName, className, studentKey: key,
      testDate: clean(req.body?.testDate) || new Date().toISOString().slice(0, 10),
      score, total, percent, grade,
      teilA, teilB, dateiName,
      submittedAt: new Date().toISOString()
    };
    db.submissions.push(record);
    store.saveSubmissions(db);

    res.json({
      ok: true,
      result: {
        score, total, percent, grade,
        teilA, teilB: {
          lesbar: teilB.lesbar, punkte: teilB.punkte, maxPunkte: teilB.maxPunkte,
          details: teilB.details, rueckmeldung: teilB.rueckmeldung,
          ki: teilB.ki || null, hinweis: teilB.hinweis || ""
        },
        submittedAt: record.submittedAt
      }
    });
  });

  /* ---------- Beispieldatei: Status, Freigabe, Download ----------
     Die Datei zeigt eine fertige Loesung und darf deshalb nicht dauerhaft
     offen liegen. Sie wird nur ausgeliefert, wenn die Lehrkraft sie
     freigegeben hat - dieselbe Logik wie bei den Pruefungen. */

  app.get("/api/filiuspruefung/beispiel/status", (_req, res) => {
    const u = store.loadUnlocks();
    const frei = Boolean(u.dateien?.beispiel?.open);
    res.json({ ok: true, frei, dateiname: "beispiel-netz.fls" });
  });

  app.post("/api/filiuspruefung/beispiel/freigeben", (req, res) => {
    if (!isTeacher(req)) return res.status(401).json({ ok: false, error: "bad_password" });
    const open = Boolean(req.body?.open);
    const u = store.loadUnlocks();
    if (!u.dateien) u.dateien = {};
    u.dateien.beispiel = { open, changedAt: new Date().toISOString() };
    store.saveUnlocks(u);
    res.json({ ok: true, frei: open });
  });

  app.get("/api/filiuspruefung/beispiel/datei", (_req, res) => {
    const u = store.loadUnlocks();
    if (!u.dateien?.beispiel?.open) {
      return res.status(403).json({
        ok: false, error: "locked",
        message: "Die Beispieldatei ist noch nicht freigegeben."
      });
    }
    const datei = opts.beispielDatei;
    if (!datei || !fs.existsSync(datei)) {
      return res.status(404).json({ ok: false, error: "not_found" });
    }
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", 'attachment; filename="beispiel-netz.fls"');
    res.send(fs.readFileSync(datei));
  });

  app.post("/api/filiuspruefung/unlock", (req, res) => {
    if (!isTeacher(req)) return res.status(401).json({ ok: false, error: "bad_password" });
    const testId = clean(req.body?.testId);
    const open = Boolean(req.body?.open);
    if (!TESTS[testId]) return res.status(404).json({ ok: false, error: "test_not_found" });
    const u = store.loadUnlocks();
    u.unlocked[testId] = { open, changedAt: new Date().toISOString() };
    store.saveUnlocks(u);
    res.json({ ok: true, testId, open });
  });

  app.post("/api/filiuspruefung/results", (req, res) => {
    if (!isTeacher(req)) return res.status(401).json({ ok: false, error: "bad_password" });
    const testId = clean(req.body?.testId);
    let rows = store.loadSubmissions().submissions;
    if (testId) rows = rows.filter((r) => r.testId === testId);
    rows = rows.slice().sort((a, b) =>
      a.className.localeCompare(b.className) ||
      a.lastName.localeCompare(b.lastName) ||
      a.firstName.localeCompare(b.firstName));
    const grades = rows.map((r) => r.grade);
    res.json({
      ok: true, count: rows.length,
      averageGrade: grades.length ? Math.round((grades.reduce((a, b) => a + b, 0) / grades.length) * 100) / 100 : null,
      distribution: [1, 2, 3, 4, 5, 6].map((g) => ({ grade: g, count: grades.filter((x) => x === g).length })),
      submissions: rows
    });
  });

  app.post("/api/filiuspruefung/delete-submission", (req, res) => {
    if (!isTeacher(req)) return res.status(401).json({ ok: false, error: "bad_password" });
    const id = clean(req.body?.submissionId);
    const db = store.loadSubmissions();
    const vor = db.submissions.length;
    db.submissions = db.submissions.filter((s) => s.id !== id);
    if (db.submissions.length === vor) return res.status(404).json({ ok: false, error: "not_found" });
    store.saveSubmissions(db);
    res.json({ ok: true, removed: vor - db.submissions.length });
  });

  app.post("/api/filiuspruefung/export", (req, res) => {
    if (!isTeacher(req)) return res.status(401).json({ ok: false, error: "bad_password" });
    const testId = clean(req.body?.testId);
    let rows = store.loadSubmissions().submissions;
    if (testId) rows = rows.filter((r) => r.testId === testId);
    const esc = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const lines = [["Datum", "Pruefung", "Klasse", "Nachname", "Vorname", "TeilA", "TeilB", "Punkte", "Von", "Prozent", "Note", "Datei"].map(esc).join(";")];
    rows.forEach((r) => {
      const a = (r.teilA || []).reduce((s, d) => s + d.points, 0);
      lines.push([r.testDate, r.testTitle, r.className, r.lastName, r.firstName,
        a, r.teilB ? r.teilB.punkte : 0, r.score, r.total, r.percent, r.grade, r.dateiName || ""].map(esc).join(";"));
    });
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="filiuspruefung.csv"`);
    res.send("﻿" + lines.join("\r\n"));
  });
}

module.exports = {
  registerFiliusPruefungRoutes,
  gradeFromPercent,
  zipEntryLesen,
  filiusAuslesen,
  dateiPruefen
};
