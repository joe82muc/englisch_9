"use strict";

/**
 * Testdefinitionen fuer die Vokabeltests.
 *
 * Diese Datei bleibt bewusst auf dem Server: Sie enthaelt die Loesungen.
 * An den Browser gehen ueber /api/vokabeltest/start nur die Aufgaben.
 *
 * direction: "en-de" -> englisches Wort steht da, Deutsch ist gesucht
 *            "de-en" -> deutsches Wort steht da, Englisch ist gesucht
 * solutions: alle zugelassenen Schreibweisen. Mehrere gleichwertige
 *            Bedeutungen koennen zusaetzlich mit ";" getrennt werden.
 */

/* ==================================================================
   Englisch 7 - Unit 1 - Test 1
   Out and about in England + Topic 1 + Numbers + Talking about places
   ================================================================== */
const e7u1t1 = {
  id: "e7-u1-test1",
  title: "Vokabeltest 1 - Out and about in England",
  unit: "Englisch 7 / Unit 1",
  classLevel: "7",
  direction: "mixed",
  items: [
    // --- Intro: Out and about in England ---
    { prompt: "unterwegs", direction: "de-en", solutions: ["out and about"] },
    { prompt: "to go surfing", direction: "en-de", solutions: ["surfen gehen"] },
    { prompt: "theatre", direction: "en-de", solutions: ["Theater"] },
    { prompt: "Theaterstück", direction: "de-en", solutions: ["play"] },
    { prompt: "science", direction: "en-de", solutions: ["Wissenschaft; Naturwissenschaft"] },
    { prompt: "Ausstellung", direction: "de-en", solutions: ["exhibition"] },
    { prompt: "rocket", direction: "en-de", solutions: ["Rakete"] },
    { prompt: "fahren", direction: "de-en", solutions: ["to drive; drive"], hint: "Verb" },
    { prompt: "coast", direction: "en-de", solutions: ["Küste"] },

    // --- Topic 1: Manchester ---
    { prompt: "Verkehr", direction: "de-en", solutions: ["traffic"] },
    { prompt: "noisy", direction: "en-de", solutions: ["laut"] },
    { prompt: "Vergangenheit", direction: "de-en", solutions: ["past"] },
    { prompt: "factory", direction: "en-de", solutions: ["Fabrik; Werk"] },
    { prompt: "Kohle", direction: "de-en", solutions: ["coal"] },
    { prompt: "mine", direction: "en-de", solutions: ["Bergwerk; Mine"] },
    { prompt: "Zentrum", direction: "de-en", solutions: ["centre; center"] },
    { prompt: "before", direction: "en-de", solutions: ["vorher; zuvor; schon einmal"] },
    { prompt: "Luft", direction: "de-en", solutions: ["air"] },
    { prompt: "clean", direction: "en-de", solutions: ["sauber"] },

    // --- Talking about places ---
    { prompt: "im Nordwesten von", direction: "de-en", solutions: ["in the northwest of"] },
    { prompt: "quiet", direction: "en-de", solutions: ["leise; ruhig; still"] },
    { prompt: "in der Nähe von", direction: "de-en", solutions: ["near"] },
    { prompt: "far", direction: "en-de", solutions: ["weit"] },
    { prompt: "Hauptstadt", direction: "de-en", solutions: ["capital; capital city"] },
    { prompt: "environment", direction: "en-de", solutions: ["Umgebung"] },
    { prompt: "Süden", direction: "de-en", solutions: ["south"] },
    { prompt: "east", direction: "en-de", solutions: ["Osten; Ost-"] },

    // --- Numbers higher than 1,000 ---
    { prompt: "eine halbe Million", direction: "de-en", solutions: ["half a million"] },
    { prompt: "one hundred thousand", direction: "en-de", solutions: ["einhunderttausend; 100000; 100.000"] },
    { prompt: "eine Million", direction: "de-en", solutions: ["a million; one million"] }
  ]
};

/* ==================================================================
   Englisch 7 - Unit 1 - Test 2
   Topic 2 + Possessive pronouns + Text + Jobs + Theatre
   + More about + Film
   ================================================================== */
const e7u1t2 = {
  id: "e7-u1-test2",
  title: "Vokabeltest 2 - Free time, Globe Theatre & more",
  unit: "Englisch 7 / Unit 1",
  classLevel: "7",
  direction: "mixed",
  items: [
    // --- Topic 2: Free time ---
    { prompt: "dauern; brauchen", direction: "de-en", solutions: ["to take; take"], hint: "It ... two hours." },
    { prompt: "to catch (bus/train)", direction: "en-de", solutions: ["nehmen; bekommen"] },
    { prompt: "vormittags", direction: "de-en", solutions: ["a.m.; am"], hint: "Uhrzeit" },
    { prompt: "p.m.", direction: "en-de", solutions: ["nachmittags; abends"] },
    { prompt: "Kulissen; Bühnenbild", direction: "de-en", solutions: ["scenery"] },
    { prompt: "to design", direction: "en-de", solutions: ["entwerfen; gestalten"] },
    { prompt: "gelegentlich", direction: "de-en", solutions: ["occasionally"] },
    { prompt: "to order", direction: "en-de", solutions: ["bestellen"] },
    { prompt: "gesund", direction: "de-en", solutions: ["healthy"] },
    { prompt: "I'm afraid", direction: "en-de", solutions: ["leider"] },

    // --- Possessive pronouns ---
    { prompt: "meine", direction: "de-en", solutions: ["mine"] },
    { prompt: "yours", direction: "en-de", solutions: ["deine; eure; Ihre"] },
    { prompt: "hers", direction: "en-de", solutions: ["ihre; ihrs"], hint: "von ihr" },
    { prompt: "unsere", direction: "de-en", solutions: ["ours"] },
    { prompt: "theirs", direction: "en-de", solutions: ["ihre; ihrs"], hint: "von ihnen" },

    // --- Text: The Globe Theatre ---
    { prompt: "besitzen", direction: "de-en", solutions: ["to own; own"] },
    { prompt: "landlord", direction: "en-de", solutions: ["Grundstückseigentümer; Vermieter"] },
    { prompt: "Miete", direction: "de-en", solutions: ["rent"] },
    { prompt: "builder", direction: "en-de", solutions: ["Bauarbeiter; Bauarbeiterin"] },
    { prompt: "tragen; befördern", direction: "de-en", solutions: ["to carry; carry"] },
    { prompt: "hurt", direction: "en-de", solutions: ["verletzt"] },
    { prompt: "Feuer", direction: "de-en", solutions: ["fire"] },

    // --- Jobs & theatre ---
    { prompt: "actor", direction: "en-de", solutions: ["Schauspieler; Schauspielerin; Darsteller; Darstellerin"] },
    { prompt: "Hausmeister", direction: "de-en", solutions: ["caretaker"] },
    { prompt: "engineer", direction: "en-de", solutions: ["Ingenieur; Ingenieurin; Techniker; Technikerin"] },
    { prompt: "Bauer; Landwirt", direction: "de-en", solutions: ["farmer"] },
    { prompt: "stage", direction: "en-de", solutions: ["Bühne"] },

    // --- More about ---
    { prompt: "Kultur", direction: "de-en", solutions: ["culture"] },
    { prompt: "important", direction: "en-de", solutions: ["wichtig"] },
    { prompt: "beliebt", direction: "de-en", solutions: ["popular"] },
    { prompt: "advert", direction: "en-de", solutions: ["Werbung; Anzeige"] },
    { prompt: "Sammlung", direction: "de-en", solutions: ["collection"] },
    { prompt: "artist", direction: "en-de", solutions: ["Künstler; Künstlerin"] },

    // --- Film: Surfing ---
    { prompt: "Welle", direction: "de-en", solutions: ["wave"] },
    { prompt: "brilliant", direction: "en-de", solutions: ["großartig; hervorragend; toll"] },
    { prompt: "recht haben", direction: "de-en", solutions: ["to be right; be right"] }
  ]
};

const TESTS = {
  [e7u1t1.id]: e7u1t1,
  [e7u1t2.id]: e7u1t2
};

module.exports = { TESTS };
