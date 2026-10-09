"use strict";

/**
 * Weitere Formen englischer Wörter
 * --------------------------------
 * Für Vokabeltest-Antworten, in denen ein Kind mehr hinschreibt als gefragt: „to drive / drove“,
 * „drive, drove, driven“, „child / children“, „good – better – best“. Solche Zusätze sind richtig und dürfen den
 * Punkt nicht kosten (siehe mitZusatz in vokabeltest.js).
 *
 *   verwandt("drove", "drive")          -> true   andere Form desselben Wortes
 *   verwandt("drove off", "drive off")  -> true   Wendung: genau ein Wort in anderer Form
 *   verwandt("drived", "drive")         -> false  falsche Form
 *
 * Bewusst eng: unregelmäßige Formen aus den Listen unten, regelmäßige nur -s, -ed und -ing.
 * Steigerungen auf -er/-est und alles andere beurteilt die KI-Zweitmeinung.
 */

// Grundform und ihre weiteren Formen (simple past, past participle; bei be/do/go/have auch die Gegenwart)
const VERBEN = [
  "be am is are was were been being", "beat beat beaten", "become became become", "begin began begun", "bend bent",
  "bite bit bitten", "bleed bled", "blow blew blown", "break broke broken", "bring brought", "build built",
  "burn burnt burned", "buy bought", "catch caught", "choose chose chosen", "come came", "cost cost", "cut cut",
  "deal dealt", "dig dug", "do does did done", "draw drew drawn", "dream dreamt dreamed", "drink drank drunk",
  "drive drove driven", "eat ate eaten", "fall fell fallen", "feed fed", "feel felt", "fight fought", "find found",
  "fly flew flown flies", "forget forgot forgotten", "forgive forgave forgiven", "freeze froze frozen",
  "get got gotten", "give gave given", "go goes went gone", "grow grew grown", "hang hung", "have has had",
  "hear heard", "hide hid hidden", "hit hit", "hold held", "hurt hurt", "keep kept", "know knew known", "lay laid",
  "lead led", "learn learnt learned", "leave left", "lend lent", "let let", "lie lay lain", "light lit", "lose lost",
  "make made", "mean meant", "meet met", "pay paid", "put put", "read read", "ride rode ridden", "ring rang rung",
  "rise rose risen", "run ran", "say said", "see saw seen", "sell sold", "send sent", "set set", "shake shook shaken",
  "shine shone", "shoot shot", "show showed shown", "shut shut", "sing sang sung", "sink sank sunk", "sit sat",
  "sleep slept", "smell smelt smelled", "speak spoke spoken", "spell spelt spelled", "spend spent", "stand stood",
  "steal stole stolen", "stick stuck", "sweep swept", "swim swam swum", "take took taken", "teach taught",
  "tear tore torn", "tell told", "think thought", "throw threw thrown", "understand understood", "wake woke woken",
  "wear wore worn", "win won", "write wrote written"
];
// Einzahl und unregelmäßige Mehrzahl
const MEHRZAHL = [
  "child children", "man men", "woman women", "person people", "foot feet", "tooth teeth", "mouse mice",
  "goose geese", "life lives", "knife knives", "wife wives", "leaf leaves", "shelf shelves", "half halves",
  "wolf wolves", "thief thieves", "loaf loaves", "sheep sheep", "fish fish"
];
// Unregelmäßige Steigerung
const STEIGERUNG = ["good better best", "bad worse worst", "far farther further farthest furthest", "little less least",
  "much more most", "many more most"];

const FAMILIEN = new Map();           // Wort -> alle Wortfamilien, in denen es vorkommt („lay“: lie und lay)
for (const zeile of [...VERBEN, ...MEHRZAHL, ...STEIGERUNG]) {
  const familie = new Set(zeile.split(" "));
  for (const wort of familie) FAMILIEN.set(wort, [...(FAMILIEN.get(wort) || []), familie]);
}
const OHNE_ED = new Set(VERBEN.map((z) => z.split(" ")[0]));      // kein „drived“
const OHNE_S = new Set(MEHRZAHL.map((z) => z.split(" ")[0]));     // kein „childs“

/** Regelmäßige Formen: Mehrzahl / 3. Person (-s), Vergangenheit (-ed), -ing. */
function regelFormen(wort) {
  const f = new Set();
  if (!/^[a-z]{2,}$/.test(wort)) return f;
  const konsonantY = /[^aeiou]y$/.test(wort);                                   // city, carry
  const verdoppeln = /^[^aeiou]*[aeiou][^aeiouwxy]$/.test(wort) ? wort.slice(-1) : "";   // stop, plan
  if (!OHNE_S.has(wort)) f.add(konsonantY ? wort.slice(0, -1) + "ies" : wort + (/(s|x|z|ch|sh|o)$/.test(wort) ? "es" : "s"));
  if (!OHNE_ED.has(wort)) f.add(konsonantY ? wort.slice(0, -1) + "ied" : wort + verdoppeln + (wort.endsWith("e") ? "d" : "ed"));
  if (wort.endsWith("ie")) f.add(wort.slice(0, -2) + "ying");                   // lie -> lying
  else if (/[^eoy]e$/.test(wort) && wort.length > 2) f.add(wort.slice(0, -1) + "ing");   // drive -> driving
  else f.add(wort + verdoppeln + "ing");
  return f;
}

function verwandtesWort(a, b) {
  if (a === b) return false;
  if ((FAMILIEN.get(a) || []).some((familie) => familie.has(b))) return true;
  return regelFormen(b).has(a) || regelFormen(a).has(b);
}

/** Ist a eine andere Form von b? Beide kleingeschrieben; bei Wendungen darf genau ein Wort abweichen. */
function verwandt(a, b) {
  const x = String(a || "").split(" ").filter(Boolean), y = String(b || "").split(" ").filter(Boolean);
  if (!x.length || x.length !== y.length) return false;
  let andere = 0;
  for (let i = 0; i < x.length; i++) {
    if (x[i] === y[i]) continue;
    if (!verwandtesWort(x[i], y[i])) return false;
    andere++;
  }
  return andere === 1;
}

module.exports = { verwandt, regelFormen };
