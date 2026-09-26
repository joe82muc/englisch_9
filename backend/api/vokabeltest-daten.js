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
   Englisch 8R - Unit 1 - Vokabeltest
   Welcome to New York!
   ================================================================== */
const e8ru1t1 = {
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
const e8ru2t1 = {
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
const e8ru3t1 = {
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
const e8ru4t1 = {
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

const TESTS = {
  [e7u1t1.id]: e7u1t1,
  [e7u1t2.id]: e7u1t2,
  [e8ru1t1.id]: e8ru1t1,
  [e8ru2t1.id]: e8ru2t1,
  [e8ru3t1.id]: e8ru3t1,
  [e8ru4t1.id]: e8ru4t1,
  [e9ru1t1.id]: e9ru1t1,
  [e9ru1t2.id]: e9ru1t2
};

module.exports = { TESTS };
