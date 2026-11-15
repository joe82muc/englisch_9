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
   Englisch 9R - Unit 1 - Test 1
   Zoom in (A world language) + Intro (Australia) + Topic 1 (Uluru)
   + adjectives for talking about experiences

   9R: Es wird NUR Deutsch -> Englisch abgefragt. Notenschluessel "9R"
   (50 % = Note 3). Stehen zwei deutsche Bedeutungen im Prompt, ist
   trotzdem nur EIN englisches Wort gesucht; "hint" grenzt ab, wenn das
   deutsche Wort sonst mehrdeutig waere.
   ================================================================== */
const e9ru1t1 = {
  id: "e9r-u1-test1",
  title: "Vokabeltest 1 - A world language & Around Australia",
  unit: "Englisch 9R / Unit 1",
  classLevel: "9R",
  gradeScale: "9R",
  direction: "de-en",
  items: [
    // --- Zoom in: A world language ---
    { prompt: "Amtssprache", direction: "de-en", solutions: ["official language"] },
    { prompt: "Mehrheit; Mehrzahl", direction: "de-en", solutions: ["majority"] },
    { prompt: "Wettbewerb", direction: "de-en", solutions: ["competition"] },
    { prompt: "kommunizieren; sich verständigen", direction: "de-en", solutions: ["to communicate; communicate"] },
    { prompt: "englischsprachig", direction: "de-en", solutions: ["English-speaking; English speaking"] },
    { prompt: "Geschäftswelt; Geschäft", direction: "de-en", solutions: ["business"], hint: "international ..." },
    { prompt: "Aufgabe; Auftrag", direction: "de-en", solutions: ["task"] },
    { prompt: "die Hälfte", direction: "de-en", solutions: ["half"] },
    { prompt: "Milliarde", direction: "de-en", solutions: ["billion"] },
    { prompt: "Sprecher; Redner", direction: "de-en", solutions: ["speaker"] },

    // --- Intro: Around Australia ---
    { prompt: "beginnen; anfangen", direction: "de-en", solutions: ["to begin; begin; to start; start"] },
    { prompt: "Lebewesen; Geschöpf", direction: "de-en", solutions: ["creature"] },
    { prompt: "brechen; zerbrechen", direction: "de-en", solutions: ["to break; break"], hint: "Verb" },
    { prompt: "Siedler; Siedlerin", direction: "de-en", solutions: ["settler"] },
    { prompt: "töten", direction: "de-en", solutions: ["to kill; kill"] },
    { prompt: "kämpfen; Mühe haben", direction: "de-en", solutions: ["to struggle; struggle"] },
    { prompt: "Recht", direction: "de-en", solutions: ["right"], hint: "z. B. die Rechte der Aborigines" },
    { prompt: "flach; eben", direction: "de-en", solutions: ["flat"] },
    { prompt: "Känguru", direction: "de-en", solutions: ["kangaroo"] },

    // --- Topic 1: Uluru ---
    { prompt: "Fels; Stein", direction: "de-en", solutions: ["rock; stone"], hint: "Uluru ist ein riesiger ..." },
    { prompt: "Stamm; Volksstamm", direction: "de-en", solutions: ["tribe"] },
    { prompt: "Lebensstil; Lebensweise", direction: "de-en", solutions: ["lifestyle; life style"] },
    { prompt: "enttäuscht", direction: "de-en", solutions: ["disappointed"] },
    { prompt: "Hubschrauber", direction: "de-en", solutions: ["helicopter"] },
    { prompt: "bunt", direction: "de-en", solutions: ["colourful; colorful"] },
    { prompt: "Punkt", direction: "de-en", solutions: ["dot"], hint: "in einem Aborigine-Gemälde" },
    { prompt: "Gemälde", direction: "de-en", solutions: ["painting"] },
    { prompt: "riesig; Riesen-", direction: "de-en", solutions: ["giant; huge"] },
    { prompt: "lecker; köstlich", direction: "de-en", solutions: ["delicious; tasty"] },
    { prompt: "erfahren; herausfinden", direction: "de-en", solutions: ["to learn; learn; to find out; find out"] },

    // --- Adjectives for talking about experiences ---
    { prompt: "aufgeregt; begeistert", direction: "de-en", solutions: ["excited"], hint: "wie jemand sich fühlt" },
    { prompt: "spannend; aufregend", direction: "de-en", solutions: ["exciting"], hint: "wie etwas ist" },
    { prompt: "besorgt; beunruhigt", direction: "de-en", solutions: ["worried"] },
    { prompt: "selbstsicher; selbstbewusst", direction: "de-en", solutions: ["confident"] }
  ]
};

/* ==================================================================
   Englisch 9R - Unit 1 - Nachholprobe zu Test 1 (Stand 16.10.2026, 9M seit 17.10.2026 mit M-Schluessel)
   Derselbe Stoff wie Test 1 (Zoom in, Intro, Topic 1, adjectives),
   gleich viele Woerter (34), nur Deutsch -> Englisch, Notenschluessel
   "9R". 12 Woerter kamen in Test 1 nicht vor (Programm, halten,
   unterwegs in, Australier, britisch, Hinterland, weit, Aborigine-,
   aengstlich, davon halten, ueberrascht, langweilig); die uebrigen
   stehen in neuer Reihenfolge. Woerter 1:1 aus der Wortliste
   (progress/englisch9r/vokabeln/unit1.txt).
   ================================================================== */
const e9ru1t1nach = {
  id: "e9r-u1-test1-nach",
  title: "Vokabeltest 1 (Nachholprobe) - A world language & Around Australia",
  unit: "Englisch 9R / Unit 1",
  classLevel: "9R",
  gradeScale: "9R",
  direction: "de-en",
  items: [
    // --- Zoom in: A world language ---
    { prompt: "(Software-)Programm", direction: "de-en", solutions: ["program; software program; computer program"], hint: "am Computer" },
    { prompt: "Wettbewerb", direction: "de-en", solutions: ["competition"] },
    { prompt: "halten", direction: "de-en", solutions: ["to give; give; to give a talk; give a talk"], hint: "Tomorrow I have to ... a talk." },
    { prompt: "Milliarde", direction: "de-en", solutions: ["billion"] },
    { prompt: "englischsprachig", direction: "de-en", solutions: ["English-speaking; English speaking"] },
    { prompt: "Mehrheit; Mehrzahl", direction: "de-en", solutions: ["majority"] },
    { prompt: "Amtssprache", direction: "de-en", solutions: ["official language"] },
    { prompt: "die Hälfte", direction: "de-en", solutions: ["half"] },

    // --- Unit 1: Around Australia ---
    { prompt: "unterwegs in", direction: "de-en", solutions: ["around"], hint: "We travelled ... Scotland by bus." },

    // --- Intro ---
    { prompt: "Australier; Australierin", direction: "de-en", solutions: ["Australian"] },
    { prompt: "Lebewesen; Geschöpf", direction: "de-en", solutions: ["creature"] },
    { prompt: "britisch", direction: "de-en", solutions: ["British"] },
    { prompt: "kämpfen; Mühe haben", direction: "de-en", solutions: ["to struggle; struggle"] },
    { prompt: "das australische Hinterland", direction: "de-en", solutions: ["the outback; outback"] },
    { prompt: "töten", direction: "de-en", solutions: ["to kill; kill"] },
    { prompt: "weit", direction: "de-en", solutions: ["long"], hint: "It's a ... way to the next town." },
    { prompt: "Siedler; Siedlerin", direction: "de-en", solutions: ["settler"] },
    { prompt: "flach; eben", direction: "de-en", solutions: ["flat"] },
    { prompt: "beginnen; anfangen", direction: "de-en", solutions: ["to begin; begin; to start; start"] },

    // --- Topic 1: Uluru ---
    { prompt: "Aborigine-; zur Aborigine-Kultur gehörend", direction: "de-en", solutions: ["Aboriginal"], hint: "z. B. ... art" },
    { prompt: "Lebensstil; Lebensweise", direction: "de-en", solutions: ["lifestyle; life style"] },
    { prompt: "ängstlich", direction: "de-en", solutions: ["afraid; scared"] },
    { prompt: "Hubschrauber", direction: "de-en", solutions: ["helicopter"] },
    { prompt: "davon halten", direction: "de-en", solutions: ["to think of; think of"], hint: "What did you ... the film?" },
    { prompt: "Stamm; Volksstamm", direction: "de-en", solutions: ["tribe"] },
    { prompt: "enttäuscht", direction: "de-en", solutions: ["disappointed"] },
    { prompt: "Gemälde", direction: "de-en", solutions: ["painting"] },
    { prompt: "riesig; Riesen-", direction: "de-en", solutions: ["giant; huge"] },
    { prompt: "bunt", direction: "de-en", solutions: ["colourful; colorful"] },
    { prompt: "lecker; köstlich", direction: "de-en", solutions: ["delicious; tasty"] },

    // --- Adjectives for talking about experiences ---
    { prompt: "überrascht", direction: "de-en", solutions: ["surprised"] },
    { prompt: "langweilig", direction: "de-en", solutions: ["boring"] },
    { prompt: "aufgeregt; begeistert", direction: "de-en", solutions: ["excited"], hint: "wie jemand sich fühlt" },
    { prompt: "selbstsicher; selbstbewusst", direction: "de-en", solutions: ["confident"] }
  ]
};

/* ==================================================================
   Englisch 9R - Unit 1 - Test 2
   Topic 2 (At the doctor's) + Das kenne ich schon (at the doctor's)
   + Text (Great Barrier Reef) + Film
   Nur Deutsch -> Englisch, Notenschluessel "9R".
   ================================================================== */
const e9ru1t2 = {
  id: "e9r-u1-test2",
  title: "Vokabeltest 2 - At the doctor's & The Great Barrier Reef",
  unit: "Englisch 9R / Unit 1",
  classLevel: "9R",
  gradeScale: "9R",
  direction: "de-en",
  items: [
    // --- Topic 2: At the doctor's ---
    { prompt: "Arzthelfer; Arzthelferin", direction: "de-en", solutions: ["receptionist"] },
    { prompt: "Termin", direction: "de-en", solutions: ["appointment"], hint: "beim Arzt" },
    { prompt: "Patient; Patientin", direction: "de-en", solutions: ["patient"] },
    { prompt: "sich anmelden; sich eintragen", direction: "de-en", solutions: ["to register; register"] },
    { prompt: "Krankenakte", direction: "de-en", solutions: ["medical record"] },
    { prompt: "krank", direction: "de-en", solutions: ["ill; sick"] },
    { prompt: "Was ist los?", direction: "de-en", solutions: ["What's the matter; What is the matter; What's wrong; What is wrong"] },
    { prompt: "Fieber", direction: "de-en", solutions: ["high temperature; fever"] },
    { prompt: "Grippe", direction: "de-en", solutions: ["flu; influenza"] },
    { prompt: "sich wieder besser fühlen", direction: "de-en", solutions: ["to get better; get better"] },
    { prompt: "Rezept", direction: "de-en", solutions: ["prescription"], hint: "vom Arzt, nicht zum Kochen" },
    { prompt: "Medikamente; Medizin", direction: "de-en", solutions: ["medicine"] },
    { prompt: "Tablette", direction: "de-en", solutions: ["tablet; pill"] },
    { prompt: "Apotheke", direction: "de-en", solutions: ["pharmacy; chemist's; chemist"] },
    { prompt: "Gute Besserung!", direction: "de-en", solutions: ["Get well soon"] },
    { prompt: "Gern geschehen.", direction: "de-en", solutions: ["You're welcome; You are welcome"] },

    // --- Das kenne ich schon: at the doctor's ---
    { prompt: "Kopfschmerzen; Kopfweh", direction: "de-en", solutions: ["headache; a headache"] },
    { prompt: "Krankenpfleger; Krankenschwester", direction: "de-en", solutions: ["nurse"] },
    { prompt: "Erkältung", direction: "de-en", solutions: ["cold; a cold"], hint: "Krankheit" },
    { prompt: "sich übergeben", direction: "de-en", solutions: ["to be sick; be sick; to vomit; vomit; to throw up; throw up"] },
    { prompt: "wehtun; verletzen", direction: "de-en", solutions: ["to hurt; hurt"] },

    // --- Text: The Great Barrier Reef ---
    { prompt: "Gefahr", direction: "de-en", solutions: ["danger"] },
    { prompt: "Riff", direction: "de-en", solutions: ["reef"] },
    { prompt: "Koralle", direction: "de-en", solutions: ["coral"] },
    { prompt: "Klimawandel", direction: "de-en", solutions: ["climate change"] },
    { prompt: "Fläche; Bereich", direction: "de-en", solutions: ["area"] },
    { prompt: "Ölteppich; Ölpest", direction: "de-en", solutions: ["oil spill"] },
    { prompt: "sich erholen", direction: "de-en", solutions: ["to recover; recover"] },
    { prompt: "Regierung", direction: "de-en", solutions: ["government"] },
    { prompt: "Gesetz", direction: "de-en", solutions: ["law"] },
    { prompt: "jedoch", direction: "de-en", solutions: ["however"] },
    { prompt: "völlig", direction: "de-en", solutions: ["completely"] },
    { prompt: "Zerstörung", direction: "de-en", solutions: ["destruction"] },

    // --- Film ---
    { prompt: "Delfin", direction: "de-en", solutions: ["dolphin"] }
  ]
};


/* ==================================================================
   Englisch 9R - Unit 1 - Versuchsprobe (26 Wörter)
   Auswahl von „Englisch weltweit“ (Zoom in) bis „Uluru und Kultur“
   (Topic 1) aus dem Vokabeltrainer 9R/Englisch/unit1/vokabular:
   8 Zoom in, 9 Intro, 9 Topic 1.
   Nur Deutsch -> Englisch, Notenschluessel "9R".
   ================================================================== */
const e9ru1versuch = {
  id: "e9r-u1-versuch",
  title: "Versuchsprobe - Englisch weltweit bis Uluru und Kultur",
  unit: "Englisch 9R / Unit 1",
  classLevel: "9R",
  gradeScale: "9R",
  direction: "de-en",
  items: [
    // --- Englisch weltweit (Zoom in) ---
    { prompt: "Milliarde", direction: "de-en", solutions: ["billion"] },
    { prompt: "Amtssprache", direction: "de-en", solutions: ["official language"] },
    { prompt: "Mehrheit; Mehrzahl", direction: "de-en", solutions: ["majority"] },
    { prompt: "die Hälfte", direction: "de-en", solutions: ["half"] },
    { prompt: "Wettbewerb", direction: "de-en", solutions: ["competition"] },
    { prompt: "kommunizieren; sich verständigen", direction: "de-en", solutions: ["to communicate; communicate"] },
    { prompt: "englischsprachig", direction: "de-en", solutions: ["English-speaking; English speaking"] },
    { prompt: "Aufgabe; Auftrag", direction: "de-en", solutions: ["task"] },

    // --- Intro: Australien ---
    { prompt: "beginnen; anfangen", direction: "de-en", solutions: ["to begin; begin; to start; start"] },
    { prompt: "Lebewesen; Geschöpf", direction: "de-en", solutions: ["creature"] },
    { prompt: "brechen; zerbrechen", direction: "de-en", solutions: ["to break; break"], hint: "Verb" },
    { prompt: "Siedler; Siedlerin", direction: "de-en", solutions: ["settler"] },
    { prompt: "töten", direction: "de-en", solutions: ["to kill; kill"] },
    { prompt: "kämpfen; Mühe haben", direction: "de-en", solutions: ["to struggle; struggle"] },
    { prompt: "Recht", direction: "de-en", solutions: ["right"], hint: "z. B. die Rechte der Aborigines" },
    { prompt: "flach; eben", direction: "de-en", solutions: ["flat"] },
    { prompt: "weit", direction: "de-en", solutions: ["long"], hint: "It's a ... way to the next town." },

    // --- Topic 1: Uluru und Kultur ---
    { prompt: "Fels; Stein", direction: "de-en", solutions: ["rock; stone"], hint: "Uluru ist ein riesiger ..." },
    { prompt: "Stamm; Volksstamm", direction: "de-en", solutions: ["tribe"] },
    { prompt: "Lebensstil; Lebensweise", direction: "de-en", solutions: ["lifestyle; life style"] },
    { prompt: "enttäuscht", direction: "de-en", solutions: ["disappointed"] },
    { prompt: "Hubschrauber", direction: "de-en", solutions: ["helicopter"] },
    { prompt: "bunt", direction: "de-en", solutions: ["colourful; colorful"] },
    { prompt: "Gemälde", direction: "de-en", solutions: ["painting"] },
    { prompt: "ängstlich", direction: "de-en", solutions: ["afraid; scared"] },
    { prompt: "lecker; köstlich", direction: "de-en", solutions: ["delicious; tasty"] }
  ]
};


/* ==================================================================
   Englisch 8R - Unit 1 - Vokabeltest
   Welcome to New York!
   ================================================================== */
const e8ru1quelle = {
  id: "e8r-u1-test1",
  title: "Vokabeltest Unit 1 - Welcome to New York!",
  unit: "Englisch 8R / Unit 1",
  classLevel: "8R",
  gradeScale: "8R",
  direction: "mixed",
  items: [
    { prompt: "island", direction: "en-de", solutions: ["Insel"] },
    { prompt: "Frankreich", direction: "de-en", solutions: ["France"] },
    { prompt: "messenger", direction: "en-de", solutions: ["Kurier, Kurierin", "Bote, Botin"] },
    { prompt: "Italien", direction: "de-en", solutions: ["Italy"] },
    { prompt: "population (no pl)", direction: "en-de", solutions: ["Bevölkerung", "Einwohner", "Einwohnerzahl"] },
    { prompt: "Zeitschrift", direction: "de-en", solutions: ["magazine"] },
    { prompt: "for", direction: "en-de", solutions: ["seit"] },
    { prompt: "Heimat", direction: "de-en", solutions: ["home country"] },
    { prompt: "poor", direction: "en-de", solutions: ["arm"] },
    { prompt: "Laufbahn", direction: "de-en", solutions: ["career"] },
    { prompt: "to be a long way away", direction: "en-de", solutions: ["weit weg sein"] },
    { prompt: "verschieden", direction: "de-en", solutions: ["different"] },
    { prompt: "culture", direction: "en-de", solutions: ["Kultur"] },
    { prompt: "Land", direction: "de-en", solutions: ["country"] },
    { prompt: "to move", direction: "en-de", solutions: ["umziehen"] },
    { prompt: "Schild", direction: "de-en", solutions: ["sign"] },
    { prompt: "to be born", direction: "en-de", solutions: ["geboren werden"] },
    { prompt: "Parade", direction: "de-en", solutions: ["parade"] },
    { prompt: "Turkish", direction: "en-de", solutions: ["türkisch", "Türkisch", "aus der Türkei"] },
    { prompt: "spanisch", direction: "de-en", solutions: ["Spanish"] },
    { prompt: "capital (city)", direction: "en-de", solutions: ["Hauptstadt"] },
    { prompt: "Stadtzentrum", direction: "de-en", solutions: ["city centre"] },
    { prompt: "noisy", direction: "en-de", solutions: ["laut"] },
    { prompt: "Park", direction: "de-en", solutions: ["park"] },
    { prompt: "tower", direction: "en-de", solutions: ["Turm"] },
    { prompt: "holen", direction: "de-en", solutions: ["to get"], hint: "Verb" },
    { prompt: "to knock sb off sth", direction: "en-de", solutions: ["jmdn. von etw. stoßen"] },
    { prompt: "demoliert", direction: "de-en", solutions: ["wrecked"] },
    { prompt: "to lie", direction: "en-de", solutions: ["lügen"] },
    { prompt: "Wahrheit", direction: "de-en", solutions: ["truth"] }
  ]
};

/* ==================================================================
   Englisch 8R - Unit 2 - Vokabeltest
   One country - different states
   ================================================================== */
const e8ru2quelle = {
  id: "e8r-u2-test1",
  title: "Vokabeltest Unit 2 - One country - different states",
  unit: "Englisch 8R / Unit 2",
  classLevel: "8R",
  gradeScale: "8R",
  direction: "mixed",
  items: [
    { prompt: "surfing", direction: "en-de", solutions: ["Surfen", "Wellenreiten", "Surf-"] },
    { prompt: "seilgezogene Straßenbahn", direction: "de-en", solutions: ["cable car"] },
    { prompt: "earthquake", direction: "en-de", solutions: ["Erdbeben"] },
    { prompt: "von allen Staaten", direction: "de-en", solutions: ["of all the states"] },
    { prompt: "to produce", direction: "en-de", solutions: ["erzeugen", "herstellen", "anbauen"] },
    { prompt: "Kajak", direction: "de-en", solutions: ["kayak"] },
    { prompt: "water", direction: "en-de", solutions: ["Wasser"] },
    { prompt: "Welle", direction: "de-en", solutions: ["wave"] },
    { prompt: "canoeing", direction: "en-de", solutions: ["Kanufahren"] },
    { prompt: "Kajakfahren", direction: "de-en", solutions: ["kayaking"] },
    { prompt: "to sit, sat, sat", direction: "en-de", solutions: ["sitzen"] },
    { prompt: "sich selbst", direction: "de-en", solutions: ["herself"] },
    { prompt: "how to …", direction: "en-de", solutions: ["wie man …"] },
    { prompt: "wenn", direction: "de-en", solutions: ["if"] },
    { prompt: "itself", direction: "en-de", solutions: ["sich", "sich selbst"] },
    { prompt: "leider", direction: "de-en", solutions: ["I'm afraid"] },
    { prompt: "boarding card", direction: "en-de", solutions: ["Bordkarte"] },
    { prompt: "Guten Flug!", direction: "de-en", solutions: ["Have a good flight!"] },
    { prompt: "another", direction: "en-de", solutions: ["noch ein", "ein anderer", "andere"] },
    { prompt: "Reise", direction: "de-en", solutions: ["journey"] },
    { prompt: "ticket", direction: "en-de", solutions: ["Ticket"] },
    { prompt: "fliegen", direction: "de-en", solutions: ["to fly"], hint: "Verb" },
    { prompt: "to arrive", direction: "en-de", solutions: ["ankommen"] },
    { prompt: "(sich) bewegen", direction: "de-en", solutions: ["to move"], hint: "Verb" },
    { prompt: "to design", direction: "en-de", solutions: ["konstruieren", "entwerfen", "gestalten", "entwickeln"] },
    { prompt: "Richterskala", direction: "de-en", solutions: ["Richter scale"] },
    { prompt: "blanket", direction: "en-de", solutions: ["Decke", "Bettdecke", "Wolldecke"] },
    { prompt: "Burger-Restaurant", direction: "de-en", solutions: ["burger bar"] },
    { prompt: "sense of smell", direction: "en-de", solutions: ["Geruchssinn"] },
    { prompt: "Sinn", direction: "de-en", solutions: ["sense"] }
  ]
};

/* ==================================================================
   Englisch 8R - Unit 3 - Vokabeltest
   Southern life
   ================================================================== */
const e8ru3quelle = {
  id: "e8r-u3-test1",
  title: "Vokabeltest Unit 3 - Southern life",
  unit: "Englisch 8R / Unit 3",
  classLevel: "8R",
  gradeScale: "8R",
  direction: "mixed",
  items: [
    { prompt: "to get on sth", direction: "en-de", solutions: ["in etw. steigen", "in etw. einsteigen"] },
    { prompt: "Dampfer", direction: "de-en", solutions: ["steamboat"] },
    { prompt: "to enjoy", direction: "en-de", solutions: ["genießen", "Gefallen finden an"] },
    { prompt: "Klima", direction: "de-en", solutions: ["climate"] },
    { prompt: "Thanksgiving", direction: "en-de", solutions: ["Erntedankfest"] },
    { prompt: "ein paar", direction: "de-en", solutions: ["a few"] },
    { prompt: "I don't mind.", direction: "en-de", solutions: ["Es macht nichts."] },
    { prompt: "froh", direction: "de-en", solutions: ["happy"] },
    { prompt: "rice", direction: "en-de", solutions: ["Reis"] },
    { prompt: "Erdbeere", direction: "de-en", solutions: ["strawberry"] },
    { prompt: "plum", direction: "en-de", solutions: ["Pflaume"] },
    { prompt: "Banane", direction: "de-en", solutions: ["banana"] },
    { prompt: "nurse", direction: "en-de", solutions: ["Krankenpfleger, Krankenschwester"] },
    { prompt: "anderer Meinung sein", direction: "de-en", solutions: ["to disagree"], hint: "Verb" },
    { prompt: "forever", direction: "en-de", solutions: ["für immer", "ewig"] },
    { prompt: "aus dem Weg gehen", direction: "de-en", solutions: ["to avoid"], hint: "Verb" },
    { prompt: "to drive off", direction: "en-de", solutions: ["wegfahren"] },
    { prompt: "von etw. stürzen", direction: "de-en", solutions: ["to fall off"], hint: "Verb" },
    { prompt: "to find out", direction: "en-de", solutions: ["herausfinden"] },
    { prompt: "sich setzen", direction: "de-en", solutions: ["to sit down"], hint: "Verb" },
    { prompt: "so that", direction: "en-de", solutions: ["damit", "sodass"] },
    { prompt: "Donner", direction: "de-en", solutions: ["boom"] },
    { prompt: "smoke", direction: "en-de", solutions: ["Rauch"] },
    { prompt: "Höhle", direction: "de-en", solutions: ["cave"] },
    { prompt: "while", direction: "en-de", solutions: ["während"] },
    { prompt: "bevor", direction: "de-en", solutions: ["before"] },
    { prompt: "when", direction: "en-de", solutions: ["als", "wenn"] },
    { prompt: "Ärger", direction: "de-en", solutions: ["trouble"] },
    { prompt: "pie", direction: "en-de", solutions: ["Kuchen", "Pastete"] },
    { prompt: "ehrenamtlich", direction: "de-en", solutions: ["volunteer"] }
  ]
};

/* ==================================================================
   Englisch 8R - Unit 4 - Vokabeltest
   Working in Canada
   ================================================================== */
const e8ru4quelle = {
  id: "e8r-u4-test1",
  title: "Vokabeltest Unit 4 - Working in Canada",
  unit: "Englisch 8R / Unit 4",
  classLevel: "8R",
  gradeScale: "8R",
  direction: "mixed",
  items: [
    { prompt: "second", direction: "en-de", solutions: ["zweit-"] },
    { prompt: "Grenze", direction: "de-en", solutions: ["border"] },
    { prompt: "wilderness", direction: "en-de", solutions: ["Wildnis"] },
    { prompt: "französisch", direction: "de-en", solutions: ["French"] },
    { prompt: "language", direction: "en-de", solutions: ["Sprache"] },
    { prompt: "Kanadier, Kanadierin", direction: "de-en", solutions: ["Canadian"] },
    { prompt: "fair", direction: "en-de", solutions: ["fair", "gerecht"] },
    { prompt: "App", direction: "de-en", solutions: ["app"] },
    { prompt: "to mean, meant, meant", direction: "en-de", solutions: ["meinen", "bedeuten"] },
    { prompt: "Selfie", direction: "de-en", solutions: ["selfie"] },
    { prompt: "software", direction: "en-de", solutions: ["Software"] },
    { prompt: "Tutorial", direction: "de-en", solutions: ["tutorial"] },
    { prompt: "guest", direction: "en-de", solutions: ["Gast"] },
    { prompt: "Ausbildung", direction: "de-en", solutions: ["training"] },
    { prompt: "CV (curriculum vitae)", direction: "en-de", solutions: ["Lebenslauf"] },
    { prompt: "Praktikum", direction: "de-en", solutions: ["internship"] },
    { prompt: "confident", direction: "en-de", solutions: ["selbstsicher", "selbstbewusst", "sicher"] },
    { prompt: "Mit freundlichen Grüßen", direction: "de-en", solutions: ["Yours sincerely,"] },
    { prompt: "to plan", direction: "en-de", solutions: ["planen"] },
    { prompt: "Tourismus", direction: "de-en", solutions: ["tourism"] },
    { prompt: "address", direction: "en-de", solutions: ["Adresse"] },
    { prompt: "Geburtsdatum", direction: "de-en", solutions: ["date of birth"] },
    { prompt: "education", direction: "en-de", solutions: ["Ausbildung", "Erziehung", "Bildung"] },
    { prompt: "Interesse", direction: "de-en", solutions: ["interest"] },
    { prompt: "bed and breakfast (B&B)", direction: "en-de", solutions: ["Frühstückspension"] },
    { prompt: "Hotel", direction: "de-en", solutions: ["hotel"] },
    { prompt: "to travel", direction: "en-de", solutions: ["reisen"] },
    { prompt: "in etw. steigen", direction: "de-en", solutions: ["to get on sth"], hint: "Verb" },
    { prompt: "cable car", direction: "en-de", solutions: ["seilgezogene Straßenbahn", "Seilbahn"] },
    { prompt: "wegfahren", direction: "de-en", solutions: ["to drive off"], hint: "Verb" }
  ]
};

/* ==================================================================
   Englisch 9M - Unit 1 - Test 1 und 2
   9M nutzt fuer Unit 1 denselben Vokabeltrainer wie 9R, deshalb auch
   dieselben Woerter (nur Deutsch -> Englisch). Einziger Unterschied:
   der M-Zug-Notenschluessel (50 % = Note 4, gradeScale "default").
   ================================================================== */
const asM = (t, id) => {
  const copy = { ...t, id, unit: "Englisch 9M / Unit 1", classLevel: "9M" };
  delete copy.gradeScale;
  return copy;
};
const e9mu1t1 = asM(e9ru1t1, "e9m-u1-test1");
// Nachholprobe zu Test 1 (17.10.2026): dieselben Wörter wie der Nachschreibtest der 9R, M-Schlüssel
const e9mu1t1nach = asM(e9ru1t1nach, "e9m-u1-test1-nach");
const e9mu1t2 = asM(e9ru1t2, "e9m-u1-test2");

/* ==================================================================
   Englisch 7M und 7R - Unit 1 - Vokabeltests (Stand 26.09.2026)
   Nur Deutsch -> Englisch: Deutsch ist vorgegeben, die Schueler
   schreiben das englische Wort. Stehen zwei deutsche Bedeutungen da,
   ist trotzdem nur EIN englisches Wort gesucht.

   Test 1: Zoom in (British Isles) bis Numbers higher than 1,000
   Test 2: Topic 2 bis Reading skills

   7M und 7R schreiben dieselben Woerter, nur der Notenschluessel ist
   verschieden: 7M = M-Zug (50 % = Note 4), 7R = "7R" (50 % = Note 3).
   ================================================================== */
const e7u1Words1 = [
  // --- Zoom in: The British Isles ---
  { prompt: "die Britischen Inseln", direction: "de-en", solutions: ["the British Isles; British Isles"] },
  { prompt: "Nordirland", direction: "de-en", solutions: ["Northern Ireland"] },
  { prompt: "Frankreich", direction: "de-en", solutions: ["France"] },
  { prompt: "Alter; Zeitalter", direction: "de-en", solutions: ["age"] },

  // --- Intro ---
  { prompt: "unterwegs", direction: "de-en", solutions: ["out and about"] },
  { prompt: "surfen gehen", direction: "de-en", solutions: ["to go surfing; go surfing"] },
  { prompt: "Theater", direction: "de-en", solutions: ["theatre; theater"] },
  { prompt: "Theaterstück", direction: "de-en", solutions: ["play"] },
  { prompt: "Besuch; Besichtigung", direction: "de-en", solutions: ["visit"] },
  { prompt: "Naturwissenschaft", direction: "de-en", solutions: ["science"] },
  { prompt: "Ausstellung", direction: "de-en", solutions: ["exhibition"] },
  { prompt: "Rakete", direction: "de-en", solutions: ["rocket"] },
  { prompt: "Küste", direction: "de-en", solutions: ["coast"] },

  // --- Topic 1: Manchester ---
  { prompt: "im Nordwesten von", direction: "de-en", solutions: ["in the northwest of; in the north-west of"] },
  { prompt: "Verkehr", direction: "de-en", solutions: ["traffic"], hint: "auf der Straße" },
  { prompt: "laut", direction: "de-en", solutions: ["noisy; loud"] },
  { prompt: "Vergangenheit", direction: "de-en", solutions: ["past; the past"] },
  { prompt: "Fabrik", direction: "de-en", solutions: ["factory"] },
  { prompt: "Kohle", direction: "de-en", solutions: ["coal"] },
  { prompt: "Bergwerk", direction: "de-en", solutions: ["mine"] },
  { prompt: "Ziege", direction: "de-en", solutions: ["goat"] },
  { prompt: "Luft", direction: "de-en", solutions: ["air"] },
  { prompt: "sauber", direction: "de-en", solutions: ["clean"] },

  // --- Talking about places ---
  { prompt: "leise; ruhig", direction: "de-en", solutions: ["quiet"] },
  { prompt: "in der Nähe von", direction: "de-en", solutions: ["near"] },
  { prompt: "weit weg sein", direction: "de-en", solutions: ["to be a long way away; be a long way away; to be far away; be far away"] },
  { prompt: "Hauptstadt", direction: "de-en", solutions: ["capital; capital city"] },
  { prompt: "Stadtzentrum", direction: "de-en", solutions: ["city centre; city center; town centre"] },

  // --- Numbers higher than 1,000 ---
  { prompt: "eintausendzweihundert", direction: "de-en", solutions: ["one thousand two hundred; a thousand two hundred; one thousand, two hundred"], hint: "in Worten" },
  { prompt: "eine Million", direction: "de-en", solutions: ["a million; one million"], hint: "in Worten" }
];

const e7u1Words2 = [
  // --- Topic 2: Free time ---
  { prompt: "deine; eure", direction: "de-en", solutions: ["yours"], hint: "Is this pen ...?" },
  { prompt: "ihre (von ihr)", direction: "de-en", solutions: ["hers"], hint: "The bag is ..." },
  { prompt: "meine", direction: "de-en", solutions: ["mine"], hint: "The book is ..." },
  { prompt: "unsere", direction: "de-en", solutions: ["ours"], hint: "The house is ..." },
  { prompt: "ihre (von ihnen)", direction: "de-en", solutions: ["theirs"], hint: "The ball is ..." },
  { prompt: "vormittags (Uhrzeit)", direction: "de-en", solutions: ["a.m.; am"] },
  { prompt: "leider", direction: "de-en", solutions: ["I'm afraid; I am afraid; unfortunately"] },
  { prompt: "gelegentlich", direction: "de-en", solutions: ["occasionally"] },
  { prompt: "bestellen", direction: "de-en", solutions: ["to order; order"] },
  { prompt: "klingen", direction: "de-en", solutions: ["to sound; sound"] },
  { prompt: "gesund", direction: "de-en", solutions: ["healthy"] },
  { prompt: "Kulissen; Bühnenbild", direction: "de-en", solutions: ["scenery"] },

  // --- Text: The Globe Theatre ---
  { prompt: "Schauspieler; Schauspielerin", direction: "de-en", solutions: ["actor"] },
  { prompt: "besitzen", direction: "de-en", solutions: ["to own; own"] },
  { prompt: "Miete", direction: "de-en", solutions: ["rent"] },
  { prompt: "Bauarbeiter; Bauarbeiterin", direction: "de-en", solutions: ["builder"] },
  { prompt: "tragen; befördern", direction: "de-en", solutions: ["to carry; carry"] },
  { prompt: "verletzt", direction: "de-en", solutions: ["hurt; injured"] },

  // --- Das kenne ich schon: jobs ---
  { prompt: "Ingenieur; Ingenieurin", direction: "de-en", solutions: ["engineer"] },
  { prompt: "Hausmeister; Hausmeisterin", direction: "de-en", solutions: ["caretaker"] },
  { prompt: "Polizeibeamter; Polizeibeamtin", direction: "de-en", solutions: ["police officer; policeman; policewoman"] },
  { prompt: "Zauberkünstler; Zauberkünstlerin", direction: "de-en", solutions: ["magician"] },
  { prompt: "Bühne", direction: "de-en", solutions: ["stage"] },

  // --- Film / Surfing ---
  { prompt: "Welle", direction: "de-en", solutions: ["wave"] },
  { prompt: "recht haben", direction: "de-en", solutions: ["to be right; be right"] },
  { prompt: "großartig; hervorragend", direction: "de-en", solutions: ["brilliant; great"] },
  { prompt: "Bis bald.", direction: "de-en", solutions: ["Bye for now; See you soon"] },

  // --- More about ---
  { prompt: "Kultur", direction: "de-en", solutions: ["culture"] },
  { prompt: "Mode", direction: "de-en", solutions: ["fashion"] },
  { prompt: "Erwachsener; Erwachsene", direction: "de-en", solutions: ["adult"] },
  { prompt: "wichtig", direction: "de-en", solutions: ["important"] },
  { prompt: "beliebt", direction: "de-en", solutions: ["popular"] },

  // --- Reading skills ---
  { prompt: "Werbung; Anzeige", direction: "de-en", solutions: ["advert; ad; advertisement"] },
  { prompt: "Sammlung", direction: "de-en", solutions: ["collection"] },
  { prompt: "Künstler; Künstlerin", direction: "de-en", solutions: ["artist"] }
];

function e7Test(klasse, nr, words, thema) {
  const t = {
    id: `e7${klasse.toLowerCase().slice(1)}-u1-test${nr}`,
    title: `${klasse} · Vokabeltest ${nr} - ${thema}`,
    unit: `Englisch ${klasse} / Unit 1`,
    classLevel: klasse,
    direction: "de-en",
    items: words
  };
  // 7R: 50 % = Note 3. 7M: ohne Angabe = M-Zug-Schluessel (50 % = Note 4).
  if (klasse === "7R") t.gradeScale = "7R";
  return t;
}
const E7_THEMA1 = "Zoom in bis Numbers";
const E7_THEMA2 = "Topic 2 bis Reading skills";
const e7mu1t1 = e7Test("7M", 1, e7u1Words1, E7_THEMA1);
const e7mu1t2 = e7Test("7M", 2, e7u1Words2, E7_THEMA2);
const e7ru1t1 = e7Test("7R", 1, e7u1Words1, E7_THEMA1);
const e7ru1t2 = e7Test("7R", 2, e7u1Words2, E7_THEMA2);

/* ==================================================================
   Englisch 7M - Unit 1 - Probe (Stand 02.10.2026)
   Zoom in bis einschliesslich Topic 1 (Manchester), 30 Woerter.
   Nur Deutsch -> Englisch, M-Zug-Notenschluessel (50 % = Note 4).
   Ausgelassen: Woerter, die im Deutschen gleich sind (Wales, Plan,
   Roboter), "about" (hier: an) und Grundwortschatz aus Klasse 5
   (Kuh, Milch).
   ================================================================== */
const e7mu1probe1 = {
  id: "e7m-u1-probe1",
  title: "7M · Probe - Zoom in bis Topic 1 Manchester",
  unit: "Englisch 7M / Unit 1",
  classLevel: "7M",
  direction: "de-en",
  items: [
    // --- Zoom in: The British Isles ---
    { prompt: "die Britischen Inseln", direction: "de-en", solutions: ["the British Isles; British Isles"] },
    { prompt: "Nordirland", direction: "de-en", solutions: ["Northern Ireland"] },
    { prompt: "die Republik Irland", direction: "de-en", solutions: ["the Republic of Ireland; Republic of Ireland"] },
    { prompt: "Frankreich", direction: "de-en", solutions: ["France"] },
    { prompt: "Alter; Zeitalter", direction: "de-en", solutions: ["age"] },

    // --- Intro ---
    { prompt: "unterwegs", direction: "de-en", solutions: ["out and about"] },
    { prompt: "surfen gehen", direction: "de-en", solutions: ["to go surfing; go surfing"] },
    { prompt: "Theater", direction: "de-en", solutions: ["theatre; theater"], hint: "das Gebäude" },
    { prompt: "Theaterstück", direction: "de-en", solutions: ["play"] },
    { prompt: "Besuch; Besichtigung", direction: "de-en", solutions: ["visit"] },
    { prompt: "Naturwissenschaft", direction: "de-en", solutions: ["science"] },
    { prompt: "Ausstellung", direction: "de-en", solutions: ["exhibition"] },
    { prompt: "Rakete", direction: "de-en", solutions: ["rocket"] },
    { prompt: "fahren (mit dem Auto)", direction: "de-en", solutions: ["to drive; drive"], hint: "Verb" },
    { prompt: "Süden; Süd-", direction: "de-en", solutions: ["south"] },
    { prompt: "Küste", direction: "de-en", solutions: ["coast"] },

    // --- Topic 1: Manchester ---
    { prompt: "im Nordwesten von", direction: "de-en", solutions: ["in the northwest of; in the north-west of"] },
    { prompt: "eine halbe Million", direction: "de-en", solutions: ["half a million"], hint: "in Worten" },
    { prompt: "Verkehr", direction: "de-en", solutions: ["traffic"], hint: "auf der Straße" },
    { prompt: "laut", direction: "de-en", solutions: ["noisy; loud"] },
    { prompt: "Vergangenheit", direction: "de-en", solutions: ["past; the past"] },
    { prompt: "Fabrik; Werk", direction: "de-en", solutions: ["factory"] },
    { prompt: "Kohle", direction: "de-en", solutions: ["coal"] },
    { prompt: "Bergwerk; Mine", direction: "de-en", solutions: ["mine"] },
    { prompt: "Westen; West-", direction: "de-en", solutions: ["west"] },
    { prompt: "Zentrum; Mitte", direction: "de-en", solutions: ["centre; center"], hint: "... of town" },
    { prompt: "vorher; zuvor", direction: "de-en", solutions: ["before"] },
    { prompt: "Ziege", direction: "de-en", solutions: ["goat"] },
    { prompt: "Luft", direction: "de-en", solutions: ["air"] },
    { prompt: "sauber", direction: "de-en", solutions: ["clean"] }
  ]
};

/* ==================================================================
   Englisch 7M - Unit 1 - Vokabeltest 3 (Stand 06.10.2026)
   Zoom in (British Isles) bis Numbers higher than 1,000, 30 Woerter –
   derselbe Stoff wie Test 1, aber eine neue Auswahl: mehr Woerter aus
   "Talking about places" und mehr Zahlen, dazu Himmelsrichtungen und
   Woerter, die in Test 1 und in der Probe nicht vorkamen.
   Nur Deutsch -> Englisch, M-Zug-Notenschluessel (50 % = Note 4).
   Eigennamen muessen grossgeschrieben sein, Zahlen stehen in Worten.
   ================================================================== */
const e7mu1t3 = {
  id: "e7m-u1-test3",
  title: "7M · Vokabeltest 3 - Zoom in bis Numbers",
  unit: "Englisch 7M / Unit 1",
  classLevel: "7M",
  direction: "de-en",
  items: [
    // --- Zoom in: The British Isles ---
    { prompt: "die Britischen Inseln", direction: "de-en", solutions: ["the British Isles; British Isles"] },
    { prompt: "die Republik Irland", direction: "de-en", solutions: ["the Republic of Ireland; Republic of Ireland"] },
    { prompt: "Nordirland", direction: "de-en", solutions: ["Northern Ireland"] },
    { prompt: "Alter; Zeitalter", direction: "de-en", solutions: ["age"] },

    // --- Intro ---
    { prompt: "unterwegs", direction: "de-en", solutions: ["out and about"] },
    { prompt: "Theaterstück", direction: "de-en", solutions: ["play"] },
    { prompt: "Naturwissenschaft", direction: "de-en", solutions: ["science"] },
    { prompt: "Ausstellung", direction: "de-en", solutions: ["exhibition"] },
    { prompt: "fahren (mit dem Auto)", direction: "de-en", solutions: ["to drive; drive"], hint: "Verb" },
    { prompt: "Süden; Süd-", direction: "de-en", solutions: ["south"] },
    { prompt: "Küste", direction: "de-en", solutions: ["coast"] },

    // --- Topic 1: Manchester ---
    { prompt: "im Nordwesten von", direction: "de-en", solutions: ["in the northwest of; in the north-west of"] },
    { prompt: "Verkehr", direction: "de-en", solutions: ["traffic"], hint: "auf der Straße" },
    { prompt: "Vergangenheit", direction: "de-en", solutions: ["past; the past"] },
    { prompt: "Fabrik; Werk", direction: "de-en", solutions: ["factory"] },
    { prompt: "Bergwerk; Mine", direction: "de-en", solutions: ["mine"] },
    { prompt: "Norden; Nord-", direction: "de-en", solutions: ["north"] },
    { prompt: "Osten; Ost-", direction: "de-en", solutions: ["east"] },
    { prompt: "vorher; zuvor", direction: "de-en", solutions: ["before"] },
    { prompt: "sauber", direction: "de-en", solutions: ["clean"] },

    // --- Talking about places ---
    { prompt: "leise; ruhig", direction: "de-en", solutions: ["quiet"] },
    { prompt: "weit", direction: "de-en", solutions: ["far"], hint: "Ist der Bahnhof … von hier?" },
    { prompt: "groß", direction: "de-en", solutions: ["large; big"], hint: "eine … Stadt" },
    { prompt: "Umgebung", direction: "de-en", solutions: ["environment"] },
    { prompt: "Hauptstadt", direction: "de-en", solutions: ["capital; capital city"] },
    { prompt: "Stadtzentrum", direction: "de-en", solutions: ["city centre; city center; town centre"] },

    // --- Numbers higher than 1,000 ---
    { prompt: "zweitausendfünfhundert", direction: "de-en", solutions: ["two thousand five hundred; two thousand, five hundred"], hint: "in Worten" },
    { prompt: "fünfzigtausend", direction: "de-en", solutions: ["fifty thousand"], hint: "in Worten" },
    { prompt: "eine halbe Million", direction: "de-en", solutions: ["half a million; five hundred thousand"], hint: "in Worten" },
    { prompt: "eine Million", direction: "de-en", solutions: ["a million; one million"], hint: "in Worten" }
  ]
};

/* ==================================================================
   Englisch 8R - Unit 1 bis 4: neue Vokabeltests, nur Deutsch -> Englisch
   Grundlage sind die Wörter der früheren gemischten Tests (e8r-uN-test1):
   Englisch -> Deutsch-Aufgaben stehen jetzt auf Deutsch, bei mehrdeutigen
   deutschen Wörtern hilft ein Hinweis.
   ================================================================== */
const E8R_DE = {
  // Unit 1
  "island": { prompt: "Insel", solutions: ["island"] },
  "messenger": { prompt: "Bote, Botin; Kurier, Kurierin", solutions: ["messenger"] },
  "population (no pl)": { prompt: "Bevölkerung; Einwohnerzahl", solutions: ["population"] },
  "for": { prompt: "seit", hint: "seit zwei Jahren = … two years", solutions: ["for; since"] },
  "poor": { prompt: "arm", hint: "nicht reich", solutions: ["poor"] },
  "to be a long way away": { prompt: "weit weg sein", solutions: ["to be a long way away; to be far away"] },
  "culture": { prompt: "Kultur", solutions: ["culture"] },
  "to move": { prompt: "umziehen", hint: "in eine andere Wohnung", solutions: ["to move"] },
  "to be born": { prompt: "geboren werden", solutions: ["to be born"] },
  "Turkish": { prompt: "türkisch", solutions: ["Turkish"] },
  "capital (city)": { prompt: "Hauptstadt", solutions: ["capital; capital city"] },
  "noisy": { prompt: "laut", hint: "Die Straße ist …", solutions: ["noisy; loud"] },
  "tower": { prompt: "Turm", solutions: ["tower"] },
  "to knock sb off sth": { prompt: "jemanden von etwas stoßen", solutions: ["to knock sb off sth; to knock somebody off something; to knock sb off; knock off"] },
  "to lie": { prompt: "lügen", hint: "nicht die Wahrheit sagen", solutions: ["to lie"] },
  // Unit 2
  "surfing": { prompt: "Surfen; Wellenreiten", solutions: ["surfing"] },
  "earthquake": { prompt: "Erdbeben", solutions: ["earthquake"] },
  "to produce": { prompt: "herstellen; erzeugen", solutions: ["to produce"] },
  "water": { prompt: "Wasser", solutions: ["water"] },
  "canoeing": { prompt: "Kanufahren", solutions: ["canoeing"] },
  "to sit, sat, sat": { prompt: "sitzen", solutions: ["to sit"] },
  "how to …": { prompt: "wie man (etwas macht)", hint: "… to swim", solutions: ["how to"] },
  "itself": { prompt: "sich selbst", hint: "für Dinge und Tiere (it)", solutions: ["itself"] },
  "boarding card": { prompt: "Bordkarte", solutions: ["boarding card; boarding pass"] },
  "another": { prompt: "noch ein; ein anderer", solutions: ["another"] },
  "ticket": { prompt: "Ticket; Fahrkarte", solutions: ["ticket"] },
  "to arrive": { prompt: "ankommen", solutions: ["to arrive"] },
  "to design": { prompt: "entwerfen; gestalten", solutions: ["to design"] },
  "blanket": { prompt: "Decke", hint: "zum Zudecken", solutions: ["blanket"] },
  "sense of smell": { prompt: "Geruchssinn", solutions: ["sense of smell"] },
  // Unit 3
  "to get on sth": { prompt: "in etwas einsteigen", hint: "Bus, Zug", solutions: ["to get on; to get on sth; to get on something"] },
  "to enjoy": { prompt: "genießen", solutions: ["to enjoy"] },
  "Thanksgiving": { prompt: "Erntedankfest (in den USA)", solutions: ["Thanksgiving"] },
  "I don't mind.": { prompt: "Es macht mir nichts aus.", solutions: ["I don't mind; I do not mind"] },
  "rice": { prompt: "Reis", solutions: ["rice"] },
  "plum": { prompt: "Pflaume", solutions: ["plum"] },
  "nurse": { prompt: "Krankenpfleger, Krankenschwester", solutions: ["nurse"] },
  "forever": { prompt: "für immer; ewig", solutions: ["forever; for ever"] },
  "to drive off": { prompt: "wegfahren", solutions: ["to drive off; to drive away"] },
  "to find out": { prompt: "herausfinden", solutions: ["to find out"] },
  "so that": { prompt: "damit; sodass", solutions: ["so that"] },
  "smoke": { prompt: "Rauch", solutions: ["smoke"] },
  "while": { prompt: "während", hint: "… ich schlief", solutions: ["while"] },
  "when": { prompt: "als; wenn", hint: "zeitlich", solutions: ["when"] },
  "pie": { prompt: "Pastete; gefüllter Kuchen", solutions: ["pie"] },
  // Unit 4
  "second": { prompt: "zweit-", hint: "der … Tag", solutions: ["second"] },
  "wilderness": { prompt: "Wildnis", solutions: ["wilderness"] },
  "language": { prompt: "Sprache", solutions: ["language"] },
  "fair": { prompt: "fair; gerecht", solutions: ["fair"] },
  "to mean, meant, meant": { prompt: "meinen; bedeuten", solutions: ["to mean"] },
  "software": { prompt: "Software", solutions: ["software"] },
  "guest": { prompt: "Gast", solutions: ["guest"] },
  "CV (curriculum vitae)": { prompt: "Lebenslauf", solutions: ["CV; curriculum vitae"] },
  "confident": { prompt: "selbstbewusst; selbstsicher", solutions: ["confident"] },
  "to plan": { prompt: "planen", solutions: ["to plan"] },
  "address": { prompt: "Adresse", solutions: ["address"] },
  "education": { prompt: "Bildung; Erziehung", solutions: ["education"] },
  "bed and breakfast (B&B)": { prompt: "Frühstückspension", solutions: ["bed and breakfast; B&B"] },
  "to travel": { prompt: "reisen", solutions: ["to travel"] },
  "cable car": { prompt: "Seilbahn", solutions: ["cable car"] }
};
// Deutsch -> Englisch, die schon so gefragt waren: eindeutiger machen
const E8R_KLARER = {
  "sich selbst": { prompt: "sich selbst", hint: "für eine Frau oder ein Mädchen (she)" },
  "fliegen": { solutions: ["to fly"] },
  "leider": { solutions: ["I'm afraid; I am afraid; unfortunately"] }
};
function e8rDeutschEnglisch(quelle) {
  const items = quelle.items.map((it) => {
    if (it.direction === "en-de") {
      const neu = E8R_DE[it.prompt];
      if (!neu) throw new Error("Vokabeltest 8R: keine deutsche Fassung für " + it.prompt);
      return { prompt: neu.prompt, direction: "de-en", solutions: neu.solutions, ...(neu.hint ? { hint: neu.hint } : {}) };
    }
    const k = E8R_KLARER[it.prompt];
    return k ? { ...it, ...k, direction: "de-en" } : { ...it };
  });
  return {
    id: quelle.id.replace(/-test1$/, "-test2"),
    title: quelle.title,
    unit: quelle.unit,
    classLevel: "8R",
    gradeScale: "8R",
    direction: "de-en",
    items
  };
}
const e8ru1t2 = e8rDeutschEnglisch(e8ru1quelle);
const e8ru2t2 = e8rDeutschEnglisch(e8ru2quelle);
const e8ru3t2 = e8rDeutschEnglisch(e8ru3quelle);
const e8ru4t2 = e8rDeutschEnglisch(e8ru4quelle);

/* ==================================================================
   Englisch 7M und 7R - Unit 2 "Fun in Wales and Scotland" - Vokabeltests (Stand 14.11.2026)
   Nur Deutsch -> Englisch: Deutsch ist vorgegeben, die Schueler schreiben das englische Wort.
   Stehen zwei deutsche Bedeutungen da, ist trotzdem nur EIN englisches Wort gesucht.

   Test 1: Intro bis Topic 1 (dazu einige Woerter aus dem Kasten "adjectives")
   Test 2: Topic 2 bis Presentation skills (Topic 2, adverbs, Text, Film, More about, Presentation)

   7M: je 30 Woerter, M-Zug-Notenschluessel (50 % = Note 4).
   7R: je 24 Woerter, eigene Auswahl (haeufigere, alltagsnaehere Woerter), gradeScale "7R" (50 % = Note 3).
   Ausgelassen: Woerter, die im Deutschen gleich sind (rugby, hammer, kilt, Highland Games ...), die
   Reihen der unregelmaessigen Verben, die Partizipien (done, seen ...: mehrdeutig) und Platzhalter
   (to be going to do sth, not ... yet, must never/not). Eigennamen muessen grossgeschrieben sein.
   ================================================================== */
const e7mu2Words1 = [
  // --- Intro ---
  { prompt: "Walisisch; walisisch", direction: "de-en", solutions: ["Welsh"] },
  { prompt: "Seilrutsche", direction: "de-en", solutions: ["zip line; zipline"] },
  { prompt: "Meile", direction: "de-en", solutions: ["mile"] },
  { prompt: "bis", direction: "de-en", solutions: ["until"], hint: "Wait ... six o'clock." },
  { prompt: "Burg; Schloss", direction: "de-en", solutions: ["castle"] },
  { prompt: "gegen", direction: "de-en", solutions: ["against"] },
  { prompt: "die Engländer", direction: "de-en", solutions: ["the English"] },
  { prompt: "Wettkampf; Wettbewerb", direction: "de-en", solutions: ["competition"] },
  { prompt: "schottisch; aus Schottland", direction: "de-en", solutions: ["Scottish"] },
  { prompt: "Tradition; Brauch", direction: "de-en", solutions: ["tradition"] },
  { prompt: "Dudelsack", direction: "de-en", solutions: ["bagpipes"] },
  { prompt: "Rock", direction: "de-en", solutions: ["skirt"], hint: "Kleidungsstück" },
  { prompt: "Geschichte", direction: "de-en", solutions: ["history"], hint: "Schulfach" },
  { prompt: "Schotte; Schottin", direction: "de-en", solutions: ["Scot"] },

  // --- Topic 1 ---
  { prompt: "Abenteuer; Erlebnis", direction: "de-en", solutions: ["adventure"] },
  { prompt: "schon; bereits", direction: "de-en", solutions: ["already"] },
  { prompt: "packen; einpacken", direction: "de-en", solutions: ["to pack; pack"] },
  { prompt: "Internetseite", direction: "de-en", solutions: ["website; web site"] },
  { prompt: "stark", direction: "de-en", solutions: ["strong"] },
  { prompt: "buchen; reservieren", direction: "de-en", solutions: ["to book; book"] },
  { prompt: "schwierig; kompliziert", direction: "de-en", solutions: ["difficult"] },
  { prompt: "gefährlich", direction: "de-en", solutions: ["dangerous"] },
  { prompt: "schon immer", direction: "de-en", solutions: ["always"], hint: "Megan has ... loved horses." },
  { prompt: "ungefährlich; sicher", direction: "de-en", solutions: ["safe"], hint: "Gegenteil von dangerous" },
  { prompt: "vorsichtig; sorgfältig", direction: "de-en", solutions: ["careful"] },
  { prompt: "(sich) entscheiden; beschließen", direction: "de-en", solutions: ["to decide; decide"] },
  { prompt: "nachdenken über; sich überlegen", direction: "de-en", solutions: ["to think about; think about"] },

  // --- Das kenne ich schon: adjectives ---
  { prompt: "müde", direction: "de-en", solutions: ["tired"] },
  { prompt: "spannend; aufregend", direction: "de-en", solutions: ["exciting"] },
  { prompt: "langweilig", direction: "de-en", solutions: ["boring"] }
];

const e7mu2Words2 = [
  // --- Topic 2 ---
  { prompt: "schon einmal; jemals", direction: "de-en", solutions: ["ever"], hint: "Have you ... been to Wales?" },
  { prompt: "herausfinden", direction: "de-en", solutions: ["to find out; find out"] },
  { prompt: "übrig", direction: "de-en", solutions: ["left"], hint: "There is one piece of cake ..." },
  { prompt: "Bis später.", direction: "de-en", solutions: ["See you later"] },
  { prompt: "gerade (eben); soeben", direction: "de-en", solutions: ["just"], hint: "Elif has ... finished her breakfast." },
  { prompt: "ein anderer; noch ein", direction: "de-en", solutions: ["another"] },

  // --- Das kenne ich schon: adverbs of time ---
  { prompt: "nie; niemals", direction: "de-en", solutions: ["never"] },
  { prompt: "noch; immer noch", direction: "de-en", solutions: ["still"] },
  { prompt: "gelegentlich", direction: "de-en", solutions: ["occasionally"] },

  // --- Text ---
  { prompt: "Jahrhundert", direction: "de-en", solutions: ["century"] },
  { prompt: "Schlacht; Kampf", direction: "de-en", solutions: ["battle"] },
  { prompt: "zwischen", direction: "de-en", solutions: ["between"] },
  { prompt: "frei; kostenlos", direction: "de-en", solutions: ["free"] },
  { prompt: "Armee; Heer", direction: "de-en", solutions: ["army"] },
  { prompt: "Spinne", direction: "de-en", solutions: ["spider"] },
  { prompt: "Netz", direction: "de-en", solutions: ["web"], hint: "von einer Spinne" },
  { prompt: "aufgeben", direction: "de-en", solutions: ["to give up; give up"] },
  { prompt: "Frieden schaffen", direction: "de-en", solutions: ["to make peace; make peace"] },
  { prompt: "tapfer; mutig", direction: "de-en", solutions: ["brave"] },

  // --- Film ---
  { prompt: "Aktenkoffer; Aktentasche", direction: "de-en", solutions: ["briefcase"] },
  { prompt: "Jahreszeit", direction: "de-en", solutions: ["time of year"] },
  { prompt: "Requisit", direction: "de-en", solutions: ["prop"] },
  { prompt: "Grund", direction: "de-en", solutions: ["reason"], hint: "Warum? – Der ..." },

  // --- More about ---
  { prompt: "heben; hochheben", direction: "de-en", solutions: ["to lift; lift"] },
  { prompt: "schwer", direction: "de-en", solutions: ["heavy"], hint: "von einem Gewicht" },
  { prompt: "selten", direction: "de-en", solutions: ["rarely"] },
  { prompt: "Kette", direction: "de-en", solutions: ["chain"] },
  { prompt: "zum Beispiel", direction: "de-en", solutions: ["for example"] },

  // --- Presentation skills ---
  { prompt: "Universität", direction: "de-en", solutions: ["university"] },
  { prompt: "Partnerstadt", direction: "de-en", solutions: ["twin town"] }
];

const e7ru2Words1 = [
  // --- Intro ---
  { prompt: "Meile", direction: "de-en", solutions: ["mile"] },
  { prompt: "bis", direction: "de-en", solutions: ["until"], hint: "Wait ... six o'clock." },
  { prompt: "Burg; Schloss", direction: "de-en", solutions: ["castle"] },
  { prompt: "gegen", direction: "de-en", solutions: ["against"] },
  { prompt: "die Engländer", direction: "de-en", solutions: ["the English"] },
  { prompt: "Wettkampf; Wettbewerb", direction: "de-en", solutions: ["competition"] },
  { prompt: "schottisch; aus Schottland", direction: "de-en", solutions: ["Scottish"] },
  { prompt: "Tradition; Brauch", direction: "de-en", solutions: ["tradition"] },
  { prompt: "Rock", direction: "de-en", solutions: ["skirt"], hint: "Kleidungsstück" },
  { prompt: "Geschichte", direction: "de-en", solutions: ["history"], hint: "Schulfach" },

  // --- Topic 1 ---
  { prompt: "Abenteuer; Erlebnis", direction: "de-en", solutions: ["adventure"] },
  { prompt: "schon; bereits", direction: "de-en", solutions: ["already"] },
  { prompt: "packen; einpacken", direction: "de-en", solutions: ["to pack; pack"] },
  { prompt: "Internetseite", direction: "de-en", solutions: ["website; web site"] },
  { prompt: "stark", direction: "de-en", solutions: ["strong"] },
  { prompt: "buchen; reservieren", direction: "de-en", solutions: ["to book; book"] },
  { prompt: "schwierig; kompliziert", direction: "de-en", solutions: ["difficult"] },
  { prompt: "gefährlich", direction: "de-en", solutions: ["dangerous"] },
  { prompt: "schon immer", direction: "de-en", solutions: ["always"], hint: "Megan has ... loved horses." },
  { prompt: "vorsichtig; sorgfältig", direction: "de-en", solutions: ["careful"] },

  // --- Das kenne ich schon: adjectives ---
  { prompt: "müde", direction: "de-en", solutions: ["tired"] },
  { prompt: "einfach; leicht", direction: "de-en", solutions: ["easy"] },
  { prompt: "spannend; aufregend", direction: "de-en", solutions: ["exciting"] },
  { prompt: "langweilig", direction: "de-en", solutions: ["boring"] }
];

const e7ru2Words2 = [
  // --- Topic 2 ---
  { prompt: "herausfinden", direction: "de-en", solutions: ["to find out; find out"] },
  { prompt: "Bis später.", direction: "de-en", solutions: ["See you later"] },
  { prompt: "gerade (eben); soeben", direction: "de-en", solutions: ["just"], hint: "Elif has ... finished her breakfast." },
  { prompt: "ein anderer; noch ein", direction: "de-en", solutions: ["another"] },

  // --- Das kenne ich schon: adverbs of time ---
  { prompt: "nie; niemals", direction: "de-en", solutions: ["never"] },
  { prompt: "noch; immer noch", direction: "de-en", solutions: ["still"] },
  { prompt: "gelegentlich", direction: "de-en", solutions: ["occasionally"] },

  // --- Text ---
  { prompt: "Jahrhundert", direction: "de-en", solutions: ["century"] },
  { prompt: "Schlacht; Kampf", direction: "de-en", solutions: ["battle"] },
  { prompt: "zwischen", direction: "de-en", solutions: ["between"] },
  { prompt: "frei; kostenlos", direction: "de-en", solutions: ["free"] },
  { prompt: "Armee; Heer", direction: "de-en", solutions: ["army"] },
  { prompt: "Spinne", direction: "de-en", solutions: ["spider"] },
  { prompt: "aufgeben", direction: "de-en", solutions: ["to give up; give up"] },
  { prompt: "tapfer; mutig", direction: "de-en", solutions: ["brave"] },

  // --- Film ---
  { prompt: "Jahreszeit", direction: "de-en", solutions: ["time of year"] },
  { prompt: "Grund", direction: "de-en", solutions: ["reason"], hint: "Warum? – Der ..." },

  // --- More about ---
  { prompt: "heben; hochheben", direction: "de-en", solutions: ["to lift; lift"] },
  { prompt: "schwer", direction: "de-en", solutions: ["heavy"], hint: "von einem Gewicht" },
  { prompt: "selten", direction: "de-en", solutions: ["rarely"] },
  { prompt: "Kette", direction: "de-en", solutions: ["chain"] },
  { prompt: "zum Beispiel", direction: "de-en", solutions: ["for example"] },
  { prompt: "möglich", direction: "de-en", solutions: ["possible"] },

  // --- Presentation skills ---
  { prompt: "Universität", direction: "de-en", solutions: ["university"] }
];

function e7u2Test(klasse, nr, words, thema) {
  const t = {
    id: `e7${klasse.toLowerCase().slice(1)}-u2-test${nr}`,
    title: `${klasse} · Vokabeltest ${nr} - ${thema}`,
    unit: `Englisch ${klasse} / Unit 2`,
    classLevel: klasse,
    direction: "de-en",
    items: words
  };
  // 7R: 50 % = Note 3. 7M: ohne Angabe = M-Zug-Schluessel (50 % = Note 4).
  if (klasse === "7R") t.gradeScale = "7R";
  return t;
}
const e7mu2t1 = e7u2Test("7M", 1, e7mu2Words1, "Intro bis Topic 1");
const e7mu2t2 = e7u2Test("7M", 2, e7mu2Words2, "Topic 2 bis Presentation skills");
const e7ru2t1 = e7u2Test("7R", 1, e7ru2Words1, "Intro bis Topic 1");
const e7ru2t2 = e7u2Test("7R", 2, e7ru2Words2, "Topic 2 bis Presentation skills");

/* ==================================================================
   Englisch 7M und 7R - Unit 3 "Welcome to Ireland" - Vokabeltests (Stand 14.11.2026)
   Nur Deutsch -> Englisch: Deutsch ist vorgegeben, die Schueler schreiben das englische Wort.
   Stehen zwei deutsche Bedeutungen da, ist trotzdem nur EIN englisches Wort gesucht.

   Test 1: Intro bis Topic 2 (Intro, Topic 1, travel, Topic 2, adjectives for feelings)
   Test 2: Text bis Speaking skills (Text, prepositions of time, Film, More about, Speaking skills)

   7M: je 30 Woerter, M-Zug-Notenschluessel (50 % = Note 4).
   7R: je 24 Woerter, eigene Auswahl (haeufigere, alltagsnaehere Woerter), gradeScale "7R" (50 % = Note 3).
   Ausgelassen: Woerter, die im Deutschen (fast) gleich sind (euro, orchestra, bus, accent, list,
   paper, gold, religion, workshop ...), Eigennamen von Sportarten (hurling, Gaelic football),
   Platzhalter (one(s), who, that, not ... any, can't stand + -ing), mehrdeutige Woerter ohne
   klaren hint. Eigennamen muessen grossgeschrieben sein.
   ================================================================== */
const e7mu3Words1 = [
  // --- Intro ---
  { prompt: "irisch; aus Irland", direction: "de-en", solutions: ["Irish"] },
  { prompt: "die Iren", direction: "de-en", solutions: ["the Irish"] },
  { prompt: "feiern", direction: "de-en", solutions: ["to celebrate; celebrate"] },
  { prompt: "Kleeblatt", direction: "de-en", solutions: ["shamrock"] },
  { prompt: "Hälfte", direction: "de-en", solutions: ["half"] },

  // --- Topic 1 ---
  { prompt: "Fahrplan", direction: "de-en", solutions: ["timetable"] },
  { prompt: "umsteigen", direction: "de-en", solutions: ["to change; change"] },
  { prompt: "Fahrt; Reise", direction: "de-en", solutions: ["journey"] },
  { prompt: "pro Stück; jeweils", direction: "de-en", solutions: ["each"], hint: "The apples cost 50 cent ..." },
  { prompt: "Schlüssel", direction: "de-en", solutions: ["key"] },
  { prompt: "Aushang; Plakat", direction: "de-en", solutions: ["notice"] },
  { prompt: "einfache Fahrkarte", direction: "de-en", solutions: ["single ticket"] },
  { prompt: "Hin- und Rückfahrkarte", direction: "de-en", solutions: ["return ticket"] },
  { prompt: "öffentliche Verkehrsmittel", direction: "de-en", solutions: ["public transport"] },
  { prompt: "kosten", direction: "de-en", solutions: ["to cost; cost"] },

  // --- Das kenne ich schon: travel ---
  { prompt: "ankommen", direction: "de-en", solutions: ["to arrive; arrive"] },
  { prompt: "Straßenbahn", direction: "de-en", solutions: ["tram"] },
  { prompt: "in der Nähe von; nah", direction: "de-en", solutions: ["near"] },
  { prompt: "aussteigen", direction: "de-en", solutions: ["to get off; get off"] },
  { prompt: "Haltestelle", direction: "de-en", solutions: ["stop"] },

  // --- Topic 2 ---
  { prompt: "Rat; Ratschlag", direction: "de-en", solutions: ["advice"] },
  { prompt: "sollte", direction: "de-en", solutions: ["should"] },
  { prompt: "Gast", direction: "de-en", solutions: ["guest"] },
  { prompt: "versuchen; probieren", direction: "de-en", solutions: ["to try; try"] },
  { prompt: "jemand", direction: "de-en", solutions: ["someone; somebody"] },
  { prompt: "die Nase voll haben (von)", direction: "de-en", solutions: ["to be fed up; be fed up; to be fed up with; be fed up with"] },

  // --- Das kenne ich schon: adjectives for feelings ---
  { prompt: "wütend; zornig", direction: "de-en", solutions: ["angry"] },
  { prompt: "beunruhigt; besorgt", direction: "de-en", solutions: ["worried"] },
  { prompt: "albern", direction: "de-en", solutions: ["silly"] },
  { prompt: "aufgeregt; begeistert", direction: "de-en", solutions: ["excited"] }
];

const e7mu3Words2 = [
  // --- Text ---
  { prompt: "Regenbogen", direction: "de-en", solutions: ["rainbow"] },
  { prompt: "schließlich; zum Schluss", direction: "de-en", solutions: ["finally"] },
  { prompt: "ganz", direction: "de-en", solutions: ["whole"], hint: "the ... pizza = die ganze Pizza" },
  { prompt: "einander; gegenseitig", direction: "de-en", solutions: ["each other"] },
  { prompt: "Topf", direction: "de-en", solutions: ["pot"] },
  { prompt: "sich anfühlen; empfinden", direction: "de-en", solutions: ["to feel; feel"] },
  { prompt: "noch; sogar", direction: "de-en", solutions: ["even"], hint: "It is ... colder today than yesterday." },
  { prompt: "Gedicht", direction: "de-en", solutions: ["poem"] },
  { prompt: "genug; genügend", direction: "de-en", solutions: ["enough"] },
  { prompt: "konnte", direction: "de-en", solutions: ["could"], hint: "can in der Vergangenheit" },
  { prompt: "Überraschung", direction: "de-en", solutions: ["surprise"] },
  { prompt: "Überschrift; Schlagzeile", direction: "de-en", solutions: ["headline"] },
  { prompt: "bedeuten; meinen", direction: "de-en", solutions: ["to mean; mean"] },
  { prompt: "jmdn. jmdm. vorstellen", direction: "de-en", solutions: ["to introduce sb to sb; introduce sb to sb; to introduce; introduce"] },
  { prompt: "Karte", direction: "de-en", solutions: ["card"], hint: "z. B. Geburtstagskarte" },

  // --- Das kenne ich schon: prepositions of time ---
  { prompt: "nach", direction: "de-en", solutions: ["after"], hint: "zeitlich: ... school" },
  { prompt: "vor; bevor", direction: "de-en", solutions: ["before"] },
  { prompt: "bis", direction: "de-en", solutions: ["until"], hint: "Wait ... six o'clock." },

  // --- Film ---
  { prompt: "während", direction: "de-en", solutions: ["during"], hint: "... the lesson" },

  // --- More about ---
  { prompt: "Problem; Schwierigkeiten; Ärger", direction: "de-en", solutions: ["trouble"] },
  { prompt: "Insel", direction: "de-en", solutions: ["island"] },
  { prompt: "Katholik; katholisch", direction: "de-en", solutions: ["Catholic"] },
  { prompt: "sterben", direction: "de-en", solutions: ["to die; die"] },
  { prompt: "seit; seitdem", direction: "de-en", solutions: ["since"], hint: "I have lived here ... 2020." },
  { prompt: "Zeichen; Schild", direction: "de-en", solutions: ["sign"] },
  { prompt: "Typ; Sorte; Art", direction: "de-en", solutions: ["type"] },

  // --- Speaking skills ---
  { prompt: "Campingplatz; Zeltplatz", direction: "de-en", solutions: ["campsite"] },
  { prompt: "Hintergrund", direction: "de-en", solutions: ["background"] },
  { prompt: "Mitte", direction: "de-en", solutions: ["middle"] },
  { prompt: "Vordergrund", direction: "de-en", solutions: ["foreground"] }
];

const e7ru3Words1 = [
  // --- Intro ---
  { prompt: "irisch; aus Irland", direction: "de-en", solutions: ["Irish"] },
  { prompt: "die Iren", direction: "de-en", solutions: ["the Irish"] },
  { prompt: "feiern", direction: "de-en", solutions: ["to celebrate; celebrate"] },
  { prompt: "Hälfte", direction: "de-en", solutions: ["half"] },

  // --- Topic 1 ---
  { prompt: "Fahrplan", direction: "de-en", solutions: ["timetable"] },
  { prompt: "umsteigen", direction: "de-en", solutions: ["to change; change"] },
  { prompt: "Fahrt; Reise", direction: "de-en", solutions: ["journey"] },
  { prompt: "Schlüssel", direction: "de-en", solutions: ["key"] },
  { prompt: "einfache Fahrkarte", direction: "de-en", solutions: ["single ticket"] },
  { prompt: "Hin- und Rückfahrkarte", direction: "de-en", solutions: ["return ticket"] },
  { prompt: "kosten", direction: "de-en", solutions: ["to cost; cost"] },

  // --- Das kenne ich schon: travel ---
  { prompt: "ankommen", direction: "de-en", solutions: ["to arrive; arrive"] },
  { prompt: "Straßenbahn", direction: "de-en", solutions: ["tram"] },
  { prompt: "in der Nähe von; nah", direction: "de-en", solutions: ["near"] },
  { prompt: "aussteigen", direction: "de-en", solutions: ["to get off; get off"] },
  { prompt: "Haltestelle", direction: "de-en", solutions: ["stop"] },

  // --- Topic 2 ---
  { prompt: "Rat; Ratschlag", direction: "de-en", solutions: ["advice"] },
  { prompt: "sollte", direction: "de-en", solutions: ["should"] },
  { prompt: "Gast", direction: "de-en", solutions: ["guest"] },
  { prompt: "versuchen; probieren", direction: "de-en", solutions: ["to try; try"] },
  { prompt: "jemand", direction: "de-en", solutions: ["someone; somebody"] },

  // --- Das kenne ich schon: adjectives for feelings ---
  { prompt: "wütend; zornig", direction: "de-en", solutions: ["angry"] },
  { prompt: "beunruhigt; besorgt", direction: "de-en", solutions: ["worried"] },
  { prompt: "albern", direction: "de-en", solutions: ["silly"] }
];

const e7ru3Words2 = [
  // --- Text ---
  { prompt: "Regenbogen", direction: "de-en", solutions: ["rainbow"] },
  { prompt: "schließlich; zum Schluss", direction: "de-en", solutions: ["finally"] },
  { prompt: "ganz", direction: "de-en", solutions: ["whole"], hint: "the ... pizza = die ganze Pizza" },
  { prompt: "einander; gegenseitig", direction: "de-en", solutions: ["each other"] },
  { prompt: "Topf", direction: "de-en", solutions: ["pot"] },
  { prompt: "Gedicht", direction: "de-en", solutions: ["poem"] },
  { prompt: "genug; genügend", direction: "de-en", solutions: ["enough"] },
  { prompt: "konnte", direction: "de-en", solutions: ["could"], hint: "can in der Vergangenheit" },
  { prompt: "Überraschung", direction: "de-en", solutions: ["surprise"] },
  { prompt: "Überschrift; Schlagzeile", direction: "de-en", solutions: ["headline"] },
  { prompt: "bedeuten; meinen", direction: "de-en", solutions: ["to mean; mean"] },
  { prompt: "Karte", direction: "de-en", solutions: ["card"], hint: "z. B. Geburtstagskarte" },

  // --- Das kenne ich schon: prepositions of time ---
  { prompt: "nach", direction: "de-en", solutions: ["after"], hint: "zeitlich: ... school" },
  { prompt: "vor; bevor", direction: "de-en", solutions: ["before"] },

  // --- Film ---
  { prompt: "während", direction: "de-en", solutions: ["during"], hint: "... the lesson" },

  // --- More about ---
  { prompt: "Problem; Schwierigkeiten; Ärger", direction: "de-en", solutions: ["trouble"] },
  { prompt: "Insel", direction: "de-en", solutions: ["island"] },
  { prompt: "sterben", direction: "de-en", solutions: ["to die; die"] },
  { prompt: "Zeichen; Schild", direction: "de-en", solutions: ["sign"] },
  { prompt: "Typ; Sorte; Art", direction: "de-en", solutions: ["type"] },

  // --- Speaking skills ---
  { prompt: "Campingplatz; Zeltplatz", direction: "de-en", solutions: ["campsite"] },
  { prompt: "Hintergrund", direction: "de-en", solutions: ["background"] },
  { prompt: "Mitte", direction: "de-en", solutions: ["middle"] },
  { prompt: "Vordergrund", direction: "de-en", solutions: ["foreground"] }
];

function e7u3Test(klasse, nr, words, thema) {
  const t = {
    id: `e7${klasse.toLowerCase().slice(1)}-u3-test${nr}`,
    title: `${klasse} · Vokabeltest ${nr} - ${thema}`,
    unit: `Englisch ${klasse} / Unit 3`,
    classLevel: klasse,
    direction: "de-en",
    items: words
  };
  // 7R: 50 % = Note 3. 7M: ohne Angabe = M-Zug-Schluessel (50 % = Note 4).
  if (klasse === "7R") t.gradeScale = "7R";
  return t;
}
const e7mu3t1 = e7u3Test("7M", 1, e7mu3Words1, "Intro bis Topic 2");
const e7mu3t2 = e7u3Test("7M", 2, e7mu3Words2, "Text bis Speaking skills");
const e7ru3t1 = e7u3Test("7R", 1, e7ru3Words1, "Intro bis Topic 2");
const e7ru3t2 = e7u3Test("7R", 2, e7ru3Words2, "Text bis Speaking skills");

/* ==================================================================
   Englisch 7M und 7R - Unit 4 "USA - here we come!" - Vokabeltests (Stand 14.11.2026)
   Nur Deutsch -> Englisch: Deutsch ist vorgegeben, die Schueler schreiben das englische Wort.
   Stehen zwei deutsche Bedeutungen da, ist trotzdem nur EIN englisches Wort gesucht.

   Test 1: Intro bis Topic 2 (Intro, Topic 1, comparing things, Topic 2, ordinal numbers, much/many)
   Test 2: Text bis Writing skills (Text, Film, More about, celebrations, Writing skills, BE/AE)

   7M: je 30 Woerter, M-Zug-Notenschluessel (50 % = Note 4).
   7R: je 24 Woerter, eigene Auswahl (haeufigere, alltagsnaehere Woerter), gradeScale "7R" (50 % = Note 3).
   Ausgelassen: Woerter, die im Deutschen (fast) gleich sind (baseball, hotel, video, tablet, cheerleader,
   festival, cafe, party, carnival, costume, helicopter, megaphone, dollar, president ...), Platzhalter
   (which, themselves), die Reihen der unregelmaessigen Verben und Steigerungsformen, Ausrufe (Go!).
   Ordnungszahlen: nur zwei bis drei je Test, alle Schreibweisen (Wort, Zahl) zugelassen.
   BE/AE: wo das Wort beides sein kann (center/centre, favorite/favourite), gelten beide Schreibweisen.
   Eigennamen muessen grossgeschrieben sein.
   ================================================================== */
const e7mu4Words1 = [
  // --- Intro ---
  { prompt: "Tal", direction: "de-en", solutions: ["valley"] },
  { prompt: "Bundesstaat; Staat", direction: "de-en", solutions: ["state"], hint: "z. B. Texas ist ein ... der USA" },
  { prompt: "riesig; riesengroß", direction: "de-en", solutions: ["huge"] },
  { prompt: "Pflanze", direction: "de-en", solutions: ["plant"] },
  { prompt: "Welt; Erde", direction: "de-en", solutions: ["earth"] },
  { prompt: "eingeboren; einheimisch", direction: "de-en", solutions: ["native"] },
  { prompt: "siedeln; besiedeln; sich niederlassen", direction: "de-en", solutions: ["to settle; settle"] },

  // --- Topic 1 ---
  { prompt: "Urlaub; Ferien", direction: "de-en", solutions: ["vacation; holiday"] },
  { prompt: "Stamm; Volksstamm", direction: "de-en", solutions: ["tribe"] },
  { prompt: "Reservat; Reservierung", direction: "de-en", solutions: ["reservation"] },
  { prompt: "sich erinnern (an); sich merken", direction: "de-en", solutions: ["to remember; remember"] },
  { prompt: "teilen", direction: "de-en", solutions: ["to share; share"] },
  { prompt: "neueste; aktuell", direction: "de-en", solutions: ["latest"] },
  { prompt: "Zeitung", direction: "de-en", solutions: ["newspaper"] },
  { prompt: "nützlich; hilfreich; brauchbar", direction: "de-en", solutions: ["useful"] },
  { prompt: "interessiert sein an; sich interessieren für", direction: "de-en", solutions: ["to be interested in; be interested in; interested in"] },

  // --- Das kenne ich schon: comparing things ---
  { prompt: "günstig; billig", direction: "de-en", solutions: ["cheap"] },
  { prompt: "langweilig", direction: "de-en", solutions: ["boring"] },
  { prompt: "schlechter; schlimmer", direction: "de-en", solutions: ["worse"], hint: "bad, ..., the worst" },

  // --- Topic 2 ---
  { prompt: "Leiter; Leiterin", direction: "de-en", solutions: ["leader"] },
  { prompt: "Raft; Floß", direction: "de-en", solutions: ["raft"] },
  { prompt: "paddeln", direction: "de-en", solutions: ["to paddle; paddle"] },
  { prompt: "Welle", direction: "de-en", solutions: ["wave"] },
  { prompt: "Strömung", direction: "de-en", solutions: ["current"] },
  { prompt: "umkippen; (sich) umdrehen", direction: "de-en", solutions: ["to turn over; turn over"] },

  // --- Das kenne ich schon: ordinal numbers ---
  { prompt: "vierzigste", direction: "de-en", solutions: ["fortieth; 40th"], hint: "Ordnungszahl" },
  { prompt: "einundfünfzigste", direction: "de-en", solutions: ["fifty-first; fifty first; 51st"], hint: "Ordnungszahl" },
  { prompt: "hundertste", direction: "de-en", solutions: ["hundredth; one hundredth; 100th"], hint: "Ordnungszahl" },

  // --- Das kenne ich schon: 'much' or 'many'? ---
  { prompt: "viel Geld", direction: "de-en", solutions: ["much money"] },
  { prompt: "viele Leute; viele Menschen", direction: "de-en", solutions: ["many people"] }
];

const e7mu4Words2 = [
  // --- Text ---
  { prompt: "Spielfeld", direction: "de-en", solutions: ["playing field"] },
  { prompt: "schlagen; treffen", direction: "de-en", solutions: ["to hit; hit"], hint: "Baseball: den Ball ..." },
  { prompt: "Schläger", direction: "de-en", solutions: ["bat"], hint: "Baseball" },
  { prompt: "Korb", direction: "de-en", solutions: ["basket"], hint: "Basketball" },
  { prompt: "prellen; hüpfen", direction: "de-en", solutions: ["to bounce; bounce"] },

  // --- Film ---
  { prompt: "Trainer; Trainerin", direction: "de-en", solutions: ["coach"] },
  { prompt: "überraschen", direction: "de-en", solutions: ["to surprise; surprise"] },
  { prompt: "Freund (umgangssprachlich)", direction: "de-en", solutions: ["pal"] },
  { prompt: "mitmachen bei", direction: "de-en", solutions: ["to join; join"] },
  { prompt: "noch nie", direction: "de-en", solutions: ["never"], hint: "I have ... been to Texas." },

  // --- More about ---
  { prompt: "Bürgerrechte; Grundrechte", direction: "de-en", solutions: ["civil rights"] },
  { prompt: "Afroamerikaner; Afroamerikanerin", direction: "de-en", solutions: ["African American"] },
  { prompt: "friedlich", direction: "de-en", solutions: ["peaceful"] },
  { prompt: "Unabhängigkeit", direction: "de-en", solutions: ["independence"] },
  { prompt: "Flagge; Fahne", direction: "de-en", solutions: ["flag"] },
  { prompt: "Feuerwerk", direction: "de-en", solutions: ["fireworks"] },
  { prompt: "Feiertag", direction: "de-en", solutions: ["holiday"] },
  { prompt: "entdecken", direction: "de-en", solutions: ["to discover; discover"] },
  { prompt: "Erntedankfest", direction: "de-en", solutions: ["Thanksgiving"] },
  { prompt: "beginnen; anfangen", direction: "de-en", solutions: ["to begin; begin; to start; start"] },

  // --- Das kenne ich schon: celebrations ---
  { prompt: "Abendessen", direction: "de-en", solutions: ["dinner"] },
  { prompt: "Grillfest", direction: "de-en", solutions: ["barbecue"] },
  { prompt: "einladen", direction: "de-en", solutions: ["to invite; invite"] },
  { prompt: "Umzug; Festzug", direction: "de-en", solutions: ["procession"] },
  { prompt: "Geschenk", direction: "de-en", solutions: ["present"] },

  // --- Writing skills ---
  { prompt: "Betreff", direction: "de-en", solutions: ["subject"], hint: "in einer E-Mail" },
  { prompt: "dich; selbst", direction: "de-en", solutions: ["yourself"], hint: "Tell us about ..." },

  // --- Das kenne ich schon: British English / American English ---
  { prompt: "Zentrum; Mitte", direction: "de-en", solutions: ["center; centre"] },
  { prompt: "Lieblings-", direction: "de-en", solutions: ["favorite; favourite"] },
  { prompt: "Film (amerikanisches Englisch)", direction: "de-en", solutions: ["movie"] }
];

const e7ru4Words1 = [
  // --- Intro ---
  { prompt: "Tal", direction: "de-en", solutions: ["valley"] },
  { prompt: "Bundesstaat; Staat", direction: "de-en", solutions: ["state"], hint: "z. B. Texas ist ein ... der USA" },
  { prompt: "riesig; riesengroß", direction: "de-en", solutions: ["huge"] },
  { prompt: "Pflanze", direction: "de-en", solutions: ["plant"] },
  { prompt: "Welt; Erde", direction: "de-en", solutions: ["earth"] },
  { prompt: "siedeln; besiedeln; sich niederlassen", direction: "de-en", solutions: ["to settle; settle"] },

  // --- Topic 1 ---
  { prompt: "Urlaub; Ferien", direction: "de-en", solutions: ["vacation; holiday"] },
  { prompt: "Stamm; Volksstamm", direction: "de-en", solutions: ["tribe"] },
  { prompt: "sich erinnern (an); sich merken", direction: "de-en", solutions: ["to remember; remember"] },
  { prompt: "teilen", direction: "de-en", solutions: ["to share; share"] },
  { prompt: "Zeitung", direction: "de-en", solutions: ["newspaper"] },
  { prompt: "nützlich; hilfreich; brauchbar", direction: "de-en", solutions: ["useful"] },
  { prompt: "interessiert sein an; sich interessieren für", direction: "de-en", solutions: ["to be interested in; be interested in; interested in"] },

  // --- Das kenne ich schon: comparing things ---
  { prompt: "günstig; billig", direction: "de-en", solutions: ["cheap"] },
  { prompt: "langweilig", direction: "de-en", solutions: ["boring"] },

  // --- Topic 2 ---
  { prompt: "Leiter; Leiterin", direction: "de-en", solutions: ["leader"] },
  { prompt: "Raft; Floß", direction: "de-en", solutions: ["raft"] },
  { prompt: "paddeln", direction: "de-en", solutions: ["to paddle; paddle"] },
  { prompt: "Welle", direction: "de-en", solutions: ["wave"] },
  { prompt: "Strömung", direction: "de-en", solutions: ["current"] },

  // --- Das kenne ich schon: ordinal numbers ---
  { prompt: "fünfzigste", direction: "de-en", solutions: ["fiftieth; 50th"], hint: "Ordnungszahl" },
  { prompt: "hundertste", direction: "de-en", solutions: ["hundredth; one hundredth; 100th"], hint: "Ordnungszahl" },

  // --- Das kenne ich schon: 'much' or 'many'? ---
  { prompt: "viel Zeit", direction: "de-en", solutions: ["much time"] },
  { prompt: "viele Freunde", direction: "de-en", solutions: ["many friends"] }
];

const e7ru4Words2 = [
  // --- Text ---
  { prompt: "Spielfeld", direction: "de-en", solutions: ["playing field"] },
  { prompt: "Schläger", direction: "de-en", solutions: ["bat"], hint: "Baseball" },
  { prompt: "Korb", direction: "de-en", solutions: ["basket"], hint: "Basketball" },
  { prompt: "prellen; hüpfen", direction: "de-en", solutions: ["to bounce; bounce"] },
  { prompt: "springen", direction: "de-en", solutions: ["to jump; jump"] },

  // --- Film ---
  { prompt: "Trainer; Trainerin", direction: "de-en", solutions: ["coach"] },
  { prompt: "überraschen", direction: "de-en", solutions: ["to surprise; surprise"] },
  { prompt: "mitmachen bei", direction: "de-en", solutions: ["to join; join"] },
  { prompt: "noch nie", direction: "de-en", solutions: ["never"], hint: "I have ... been to Texas." },

  // --- More about ---
  { prompt: "friedlich", direction: "de-en", solutions: ["peaceful"] },
  { prompt: "Flagge; Fahne", direction: "de-en", solutions: ["flag"] },
  { prompt: "Feuerwerk", direction: "de-en", solutions: ["fireworks"] },
  { prompt: "Feiertag", direction: "de-en", solutions: ["holiday"] },
  { prompt: "entdecken", direction: "de-en", solutions: ["to discover; discover"] },
  { prompt: "Erntedankfest", direction: "de-en", solutions: ["Thanksgiving"] },

  // --- Das kenne ich schon: celebrations ---
  { prompt: "Abendessen", direction: "de-en", solutions: ["dinner"] },
  { prompt: "Grillfest", direction: "de-en", solutions: ["barbecue"] },
  { prompt: "einladen", direction: "de-en", solutions: ["to invite; invite"] },
  { prompt: "Geburtstag", direction: "de-en", solutions: ["birthday"] },
  { prompt: "Geschenk", direction: "de-en", solutions: ["present"] },

  // --- Writing skills ---
  { prompt: "Betreff", direction: "de-en", solutions: ["subject"], hint: "in einer E-Mail" },
  { prompt: "dich; selbst", direction: "de-en", solutions: ["yourself"], hint: "Tell us about ..." },

  // --- Das kenne ich schon: British English / American English ---
  { prompt: "Zentrum; Mitte", direction: "de-en", solutions: ["center; centre"] },
  { prompt: "Lieblings-", direction: "de-en", solutions: ["favorite; favourite"] }
];

function e7u4Test(klasse, nr, words, thema) {
  const t = {
    id: `e7${klasse.toLowerCase().slice(1)}-u4-test${nr}`,
    title: `${klasse} · Vokabeltest ${nr} - ${thema}`,
    unit: `Englisch ${klasse} / Unit 4`,
    classLevel: klasse,
    direction: "de-en",
    items: words
  };
  // 7R: 50 % = Note 3. 7M: ohne Angabe = M-Zug-Schluessel (50 % = Note 4).
  if (klasse === "7R") t.gradeScale = "7R";
  return t;
}
const e7mu4t1 = e7u4Test("7M", 1, e7mu4Words1, "Intro bis Topic 2");
const e7mu4t2 = e7u4Test("7M", 2, e7mu4Words2, "Text bis Writing skills");
const e7ru4t1 = e7u4Test("7R", 1, e7ru4Words1, "Intro bis Topic 2");
const e7ru4t2 = e7u4Test("7R", 2, e7ru4Words2, "Text bis Writing skills");

const TESTS = {
  [e8ru1t2.id]: e8ru1t2,
  [e8ru2t2.id]: e8ru2t2,
  [e8ru3t2.id]: e8ru3t2,
  [e8ru4t2.id]: e8ru4t2,
  [e9ru1t1.id]: e9ru1t1,
  [e9ru1t1nach.id]: e9ru1t1nach,
  [e9ru1t2.id]: e9ru1t2,
  [e9ru1versuch.id]: e9ru1versuch,
  [e9mu1t1.id]: e9mu1t1,
  [e9mu1t1nach.id]: e9mu1t1nach,
  [e9mu1t2.id]: e9mu1t2,
  [e7mu1t1.id]: e7mu1t1,
  [e7mu1t2.id]: e7mu1t2,
  [e7mu1probe1.id]: e7mu1probe1,
  [e7mu1t3.id]: e7mu1t3,
  [e7ru1t1.id]: e7ru1t1,
  [e7ru1t2.id]: e7ru1t2,
  [e7mu2t1.id]: e7mu2t1,
  [e7mu2t2.id]: e7mu2t2,
  [e7ru2t1.id]: e7ru2t1,
  [e7ru2t2.id]: e7ru2t2,
  [e7mu3t1.id]: e7mu3t1,
  [e7mu3t2.id]: e7mu3t2,
  [e7ru3t1.id]: e7ru3t1,
  [e7ru3t2.id]: e7ru3t2,
  [e7mu4t1.id]: e7mu4t1,
  [e7mu4t2.id]: e7mu4t2,
  [e7ru4t1.id]: e7ru4t1,
  [e7ru4t2.id]: e7ru4t2,
  // Englisch 8M: je Unit zwei Tests (e8m-u<N>-test1, -test2) – eigene Datei, weil es acht sind
  ...require("./vokabeltest-8m-daten").TESTS
};

module.exports = { TESTS };
