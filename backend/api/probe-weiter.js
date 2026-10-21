"use strict";

/* ------------------------------------------------------------------
   Weiterbearbeiten nach der Abgabe – für alle Proben (Wunsch der Lehrkraft, 21.10.2026: „mach so das schüler eine probe
   weiter bearbeiten können nach abgabe, wenn der lehrer diese erlaubt in der verwaltung“)

   - Lehrkraft: Verwaltung → Noten → Note anklicken → „✏️ Weiterbearbeiten erlauben“ (oder zurücknehmen).
     Die Abgabe bekommt weiter = { erlaubtAm }. Das gilt, bis das Kind neu abgibt oder die Lehrkraft es zurücknimmt.
   - Kind: Solange die Probe freigeschaltet ist (wie beim Nachschreiben), öffnet es sie wieder. Der Start nennt
     weiter = { erlaubtAm, abgegebenAm, seite }: seite ist der Stand der Probenseite bei der Abgabe (js/probe-schutz.js,
     ProbeSchutz.regelFelder() schickt ihn mit jeder Abgabe) – damit stehen seine Antworten wieder da.
   - Gibt es neu ab, ersetzt die neue Abgabe die alte (neue Kennung: Punkte, Note, Testregeln und Rückgabe beginnen neu).
     Was vorher war, steht kurz in fassungen (Abgabezeit, Punkte, Note, ob beendet).

   Die Proben-Module fragen darf(abgabe) beim Start, bei Zwischenständen und bei der Abgabe, speichern seiteSauber(body.seite)
   in der Abgabe und legen sie mit einfuegen(liste, alt, neu) ab. Sie melden sich mit modulAnmelden(name, { lesen, schreiben })
   an (lesen() -> { daten, liste }, schreiben(daten)).

   Route: POST /api/probe-weiter/erlauben { password, modul, submissionId, erlauben }
          -> { ok, weiter: { erlaubtAm } | null }
   ------------------------------------------------------------------ */

const crypto = require("crypto");

const clean = (v, max = 120) => String(v ?? "").trim().slice(0, max);

// Darf das Kind diese Abgabe weiterbearbeiten?
const darf = (rec) => Boolean(rec && rec.weiter && rec.weiter.erlaubtAm);

/* Stand der Probenseite (ProbeSchutz): f Werte der Felder, k gewählte Antwortknöpfe, r angehakte Kästchen, x was die Seite
   selbst sichert – alles in der Reihenfolge der Seite. Zu große Stände werden nicht gespeichert (dann fängt das Kind beim
   Weiterbearbeiten mit leeren Feldern an). */
const MAX_SEITE = 300000;
function seiteSauber(s) {
  if (!s || typeof s !== "object") return undefined;
  const zahlen = (v) => (Array.isArray(v) ? v : []).slice(0, 3000).filter((n) => Number.isInteger(n) && n >= 0 && n < 100000);
  const aus = { f: (Array.isArray(s.f) ? s.f : []).slice(0, 1500).map((v) => String(v ?? "").slice(0, 15000)), k: zahlen(s.k), r: zahlen(s.r) };
  if (s.x !== undefined && s.x !== null) aus.x = s.x;
  let text = "";
  try { text = JSON.stringify(aus); } catch (_e) { return undefined; }
  if (text.length > MAX_SEITE) return undefined;
  if (!aus.f.some((v) => v !== "") && !aus.k.length && !aus.r.length && aus.x === undefined) return undefined;
  return JSON.parse(text);
}

// Was die Probenseite beim Start erfährt. mitSeite: false, wenn der Server einen neueren Zwischenstand hat (anderes Gerät)
function startAngabe(rec, mitSeite = true) {
  return { erlaubtAm: rec.weiter.erlaubtAm, abgegebenAm: rec.submittedAt || "", seite: mitSeite && rec.seite ? rec.seite : null };
}

// Neue Abgabe ablegen: Ersetzt sie eine weiterbearbeitete (alt), kommt sie an deren Stelle und merkt sich die frühere Fassung
function einfuegen(liste, alt, neu) {
  const i = alt ? liste.findIndex((s) => s && s.id === alt.id) : -1;
  if (i < 0) { liste.push(neu); return neu; }
  const kurz = { submittedAt: alt.submittedAt, score: alt.score, total: alt.total, grade: alt.grade, erlaubtAm: alt.weiter ? alt.weiter.erlaubtAm : "",
    ...(alt.abbruch ? { abbruch: alt.abbruch.grund, aufgehoben: Boolean(alt.abbruch.aufgehoben) } : {}), ...(alt.automatisch ? { automatisch: alt.automatisch } : {}) };
  neu.fassungen = [...(Array.isArray(alt.fassungen) ? alt.fassungen : []), kurz].slice(-10);
  delete neu.weiter;
  liste[i] = neu;
  return neu;
}

// Für die Notenübersicht (proben-noten.js)
function anzeige(rec) {
  return {
    ...(darf(rec) ? { weiter: { erlaubtAm: rec.weiter.erlaubtAm, seite: Boolean(rec.seite) } } : {}),
    ...(Array.isArray(rec.fassungen) && rec.fassungen.length ? { fassungen: rec.fassungen.length, vorher: rec.fassungen[rec.fassungen.length - 1] } : {})
  };
}

const module_ = new Map();   // Modulname -> { lesen() -> { daten, liste }, schreiben(daten) }
function modulAnmelden(name, fn) { module_.set(name, fn); }

function registerProbeWeiter(app, opts = {}) {
  const TEACHER_PASSWORD = String(opts.teacherPassword || "");
  const lehrkraft = (req) => {
    if (!TEACHER_PASSWORD) return false;
    const a = Buffer.from(clean(req.body && req.body.password, 200)), b = Buffer.from(TEACHER_PASSWORD);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  };
  app.post("/api/probe-weiter/erlauben", (req, res) => {
    if (!lehrkraft(req)) return res.status(401).json({ ok: false, error: "bad_password" });
    const m = module_.get(clean(req.body && req.body.modul, 40));
    if (!m) return res.status(404).json({ ok: false, error: "unbekannt" });
    try {
      const { daten, liste } = m.lesen(), id = clean(req.body.submissionId, 120);
      const rec = (liste || []).find((s) => s && s.id === id);
      if (!rec) return res.status(404).json({ ok: false, error: "not_found", message: "Diese Abgabe gibt es nicht mehr. Bitte die Noten neu laden." });
      if (req.body.erlauben === true) rec.weiter = { erlaubtAm: new Date().toISOString() };
      else delete rec.weiter;
      m.schreiben(daten);
      res.json({ ok: true, weiter: darf(rec) ? { erlaubtAm: rec.weiter.erlaubtAm, seite: Boolean(rec.seite) } : null });
    } catch (err) {
      console.error("Weiterbearbeiten erlauben:", err && err.message);
      res.status(500).json({ ok: false, error: "server_error" });
    }
  });
}

module.exports = { darf, seiteSauber, startAngabe, einfuegen, anzeige, modulAnmelden, registerProbeWeiter };
