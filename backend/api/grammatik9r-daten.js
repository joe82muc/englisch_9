"use strict";

/**
 * Grammatikprobe und Kurztests Englisch 9R.
 *
 * Diese Datei bleibt auf dem Server: Sie enthaelt die Loesungen.
 *
 * type "gap":    "___" markiert eine Luecke. solutions[i] = alle zugelassenen
 *                Antworten fuer Luecke i. Kurz-/Langformen muessen nicht
 *                doppelt eingetragen werden (didn't = did not).
 *                Jede Luecke zaehlt 1 Punkt.
 * type "choice": options + answer (Index, 0 = erste Option). 1 Punkt.
 * type "text":   ganzer Satz, KI-Bewertung. expected = Musterloesung,
 *                focus = gepruefte Grammatik, keywords = Pflichtteile nur
 *                fuer den Notfall ohne KI ("a|b" = Alternativen).
 * section / instruction: Ueberschrift und Arbeitsauftrag, stehen bei der
 *                ersten Aufgabe eines Abschnitts.
 */

/* ==================================================================
   Grammatikprobe Unit 1 - Around Australia (G1 bis G4)
   ================================================================== */
const probeU1 = {
  id: "e9r-u1-probe",
  kind: "probe",
  title: "Grammatikprobe Unit 1 - Around Australia",
  unit: "Englisch 9R / Unit 1",
  classLevel: "9R",
  items: [
    // --- A: simple past ---
    { type: "gap", section: "A · Simple past (G1)", instruction: "Setze die Verben im simple past ein.",
      prompt: "Last year my family ___ (travel) to Australia.", solutions: [["travelled", "traveled"]] },
    { type: "gap", prompt: "We ___ (fly) to Sydney first.", solutions: [["flew"]] },
    { type: "gap", prompt: "I ___ (not / eat) kangaroo meat.", solutions: [["didn't eat"]] },
    { type: "gap", prompt: "The tour guide ___ (be) very friendly.", solutions: [["was"]] },
    { type: "gap", prompt: "The Dreamtime stories ___ (be) really interesting.", solutions: [["were"]] },
    { type: "gap", prompt: "___ you ___ (see) any koalas?", solutions: [["Did"], ["see"]] },
    { type: "gap", prompt: "Where ___ you ___ (meet) the Aboriginal people?", solutions: [["did"], ["meet"]] },

    // --- B: Kurzantworten ---
    { type: "gap", section: "B · Kurzantworten (G1)", instruction: "Gib Kurzantworten. (+) = Yes, (–) = No.",
      prompt: "Were you in Perth? (–) ___", solutions: [["No, I wasn't"]] },
    { type: "gap", prompt: "Did your sister like the outback? (+) ___", solutions: [["Yes, she did"]] },
    { type: "gap", prompt: "Was the weather hot? (+) ___", solutions: [["Yes, it was"]] },

    // --- C: will-future ---
    { type: "gap", section: "C · Will-future (G2)", instruction: "Setze die Verben im will-future ein.",
      prompt: "I hope I ___ (find) a good job after school.", solutions: [["will find"]] },
    { type: "gap", prompt: "Maybe we ___ (visit) the Great Barrier Reef next year.", solutions: [["will visit"]] },
    { type: "gap", prompt: "I'm sure it ___ (not rain) tomorrow.", solutions: [["won't rain"]] },
    { type: "gap", prompt: "___ your parents ___ (come) with you?", solutions: [["Will"], ["come"]] },
    { type: "gap", prompt: "I think Tom ___ (be) a great tour guide one day.", solutions: [["will be"]] },

    // --- D: will oder want to ---
    { type: "choice", section: "D · will oder want to? (G2)", instruction: "Kreuze die richtige Übersetzung an.",
      prompt: "Ich will ein Känguru sehen.",
      options: ["I will see a kangaroo.", "I want to see a kangaroo.", "I wants to see a kangaroo."], answer: 1 },

    // --- E: if-clauses I ---
    { type: "gap", section: "E · If-clauses Typ I (G3)", instruction: "Ergänze die if-Sätze. Achte auf die Zeitform in beiden Satzteilen.",
      prompt: "If it ___ (rain) tomorrow, we ___ (stay) at the hotel.", solutions: [["rains"], ["will stay"]] },
    { type: "gap", prompt: "If you ___ (not wear) a hat, you ___ (get) a sunburn.", solutions: [["don't wear"], ["will get"]] },
    { type: "gap", prompt: "If you feel ill, ___ (go) to the doctor's!", solutions: [["go"]] },
    { type: "gap", prompt: "If you ask the doctor, she ___ (can give) you a prescription.", solutions: [["can give"]] },

    // --- F: present progressive ---
    { type: "gap", section: "F · Present progressive (G4)", instruction: "Setze die Verben im present progressive ein.",
      prompt: "Look! The kangaroos ___ (jump) over the road.", solutions: [["are jumping"]] },
    { type: "gap", prompt: "Listen! Somebody ___ (play) the didgeridoo.", solutions: [["is playing"]] },
    { type: "gap", prompt: "Come in. I ___ (not sleep), I ___ (read).", solutions: [["am not sleeping"], ["am reading"]] },
    { type: "gap", prompt: "What ___ you ___ (do) at the moment?", solutions: [["are"], ["doing"]] },
    { type: "gap", prompt: "Tom ___ (swim) in the sea right now.", solutions: [["is swimming"]] },

    // --- G: Welche Zeit? ---
    { type: "choice", section: "G · Welche Zeitform passt?", instruction: "Achte auf die Signalwörter und kreuze an.",
      prompt: "Yesterday we ___ a snake in the outback.", options: ["see", "saw", "are seeing"], answer: 1 },
    { type: "choice", prompt: "Look! The man ___ a boomerang.", options: ["threw", "is throwing", "will throw"], answer: 1 },
    { type: "choice", prompt: "Maybe I ___ to Australia one day.", options: ["go", "went", "will go"], answer: 2 },
    { type: "choice", prompt: "If you ___ hard, you will pass the test.", options: ["will work", "work", "worked"], answer: 1 },

    // --- H: Uebersetzen ---
    { type: "text", section: "H · Übersetze ins Englische", instruction: "Schreibe ganze Sätze. Es kommt auf die richtige Zeitform an.",
      prompt: "Wir haben letzte Woche den Uluru besucht.", points: 2,
      expected: "We visited Uluru last week.", focus: "simple past (visited)",
      keywords: ["visited", "last week"] },
    { type: "text", prompt: "Ich bin sicher, dass es morgen nicht regnen wird.", points: 2,
      expected: "I'm sure it won't rain tomorrow.", focus: "will-future verneint (won't rain)",
      keywords: ["will not rain", "tomorrow"] },
    { type: "text", prompt: "Wenn du Zeit hast, rufe ich dich an.", points: 2,
      expected: "If you have time, I'll call you. / I'll call you if you have time.",
      focus: "if-clause Typ I: simple present im if-Satz (have), will-future im Hauptsatz (will call)",
      keywords: ["if you have", "will call|will phone|will ring"] },
    { type: "text", prompt: "Schau mal! Die Kinder spielen im Park.", points: 2,
      expected: "Look! The children are playing in the park.", focus: "present progressive (are playing)",
      keywords: ["are playing"] }
  ]
};

/* ==================================================================
   Kurztest G1 - Simple past
   ================================================================== */
const ktG1 = {
  id: "e9r-u1-kt-g1",
  kind: "kurztest",
  title: "Kurztest G1 - Simple past",
  unit: "Englisch 9R / Unit 1",
  classLevel: "9R",
  items: [
    { type: "gap", section: "Simple past", instruction: "Setze die Verben im simple past ein.",
      prompt: "Last weekend we ___ (go) to the beach.", solutions: [["went"]] },
    { type: "gap", prompt: "My brother ___ (buy) a surfboard.", solutions: [["bought"]] },
    { type: "gap", prompt: "We ___ (not / see) any sharks.", solutions: [["didn't see"]] },
    { type: "gap", prompt: "The water ___ (be) warm.", solutions: [["was"]] },
    { type: "gap", prompt: "The waves ___ (be) very big.", solutions: [["were"]] },
    { type: "gap", prompt: "___ you ___ (have) fun?", solutions: [["Did"], ["have"]] },
    { type: "gap", section: "Kurzantwort", instruction: "Antworte mit einer Kurzantwort. (+) = Yes",
      prompt: "Was the beach nice? (+) ___", solutions: [["Yes, it was"]] },
    { type: "choice", section: "Was ist richtig?", instruction: "Kreuze an.",
      prompt: "Which sentence is correct?",
      options: ["She didn't went home.", "She didn't go home.", "She don't go home."], answer: 1 },
    { type: "text", section: "Übersetze", instruction: "Schreibe den Satz auf Englisch.",
      prompt: "Ich war gestern nicht in der Schule.", points: 2,
      expected: "I wasn't at school yesterday.", focus: "simple past von be, verneint (wasn't)",
      keywords: ["was not", "yesterday"] }
  ]
};

/* ==================================================================
   Kurztest G2 - Will-future
   ================================================================== */
const ktG2 = {
  id: "e9r-u1-kt-g2",
  kind: "kurztest",
  title: "Kurztest G2 - Will-future",
  unit: "Englisch 9R / Unit 1",
  classLevel: "9R",
  items: [
    { type: "gap", section: "Will-future", instruction: "Setze die Verben im will-future ein.",
      prompt: "I think I ___ (become) a nurse.", solutions: [["will become"]] },
    { type: "gap", prompt: "Maybe it ___ (be) sunny tomorrow.", solutions: [["will be"]] },
    { type: "gap", prompt: "We ___ (not / travel) by plane.", solutions: [["won't travel"]] },
    { type: "gap", prompt: "___ you ___ (help) me with my project?", solutions: [["Will"], ["help"]] },
    { type: "gap", section: "Kurzantwort", instruction: "Antworte mit einer Kurzantwort. (–) = No",
      prompt: "Will the tour be long? (–) ___", solutions: [["No, it won't"]] },
    { type: "choice", section: "Was ist richtig?", instruction: "Kreuze an.",
      prompt: "Ich will ein Eis kaufen.",
      options: ["I will buy an ice cream.", "I want to buy an ice cream.", "I want buy an ice cream."], answer: 1 },
    { type: "choice", prompt: "Which sentence is correct?",
      options: ["I hope I will get the job.", "I hope I will to get the job.", "I hope I wills get the job."], answer: 0 },
    { type: "text", section: "Übersetze", instruction: "Schreibe den Satz auf Englisch.",
      prompt: "Ich hoffe, dass ich schnell einen Job bekomme.", points: 2,
      expected: "I hope I'll get a job quickly.", focus: "will-future nach I hope (I'll get)",
      keywords: ["i hope", "will get|will find"] }
  ]
};

/* ==================================================================
   Kurztest G3 - If-clauses I
   ================================================================== */
const ktG3 = {
  id: "e9r-u1-kt-g3",
  kind: "kurztest",
  title: "Kurztest G3 - If-clauses Typ I",
  unit: "Englisch 9R / Unit 1",
  classLevel: "9R",
  items: [
    { type: "gap", section: "If-clauses Typ I", instruction: "Ergänze die if-Sätze.",
      prompt: "If I ___ (have) time, I ___ (call) you.", solutions: [["have"], ["will call"]] },
    { type: "gap", prompt: "If it ___ (not rain), we ___ (go) to the beach.", solutions: [["doesn't rain"], ["will go"]] },
    { type: "gap", prompt: "You ___ (not feel) cold if you wear warm clothes.", solutions: [["won't feel"]] },
    { type: "gap", prompt: "If you feel sick, ___ (stay) in bed!", solutions: [["stay"]] },
    { type: "gap", prompt: "If you heat water to 100 degrees, it ___ (boil).", solutions: [["boils"]] },
    { type: "choice", section: "Was ist richtig?", instruction: "Kreuze an.",
      prompt: "Which sentence is correct?",
      options: ["If it will rain, we stay at home.", "If it rains, we will stay at home.", "If it rain, we will stay at home."], answer: 1 },
    { type: "choice", prompt: "Which sentence is correct?",
      options: ["I'll call you, if I have time.", "I'll call you if I have time.", "I call you if I will have time."], answer: 1 },
    { type: "text", section: "Übersetze", instruction: "Schreibe den Satz auf Englisch.",
      prompt: "Wenn du mich fragst, kann ich dir helfen.", points: 2,
      expected: "If you ask me, I can help you.", focus: "if-clause Typ I mit can im Hauptsatz",
      keywords: ["if you ask", "can help"] }
  ]
};

/* ==================================================================
   Kurztest G4 - Present progressive
   ================================================================== */
const ktG4 = {
  id: "e9r-u1-kt-g4",
  kind: "kurztest",
  title: "Kurztest G4 - Present progressive",
  unit: "Englisch 9R / Unit 1",
  classLevel: "9R",
  items: [
    { type: "gap", section: "Present progressive", instruction: "Setze die Verben im present progressive ein.",
      prompt: "Look! The dog ___ (run) after the ball.", solutions: [["is running"]] },
    { type: "gap", prompt: "I ___ (write) an email at the moment.", solutions: [["am writing"]] },
    { type: "gap", prompt: "The children ___ (not / sit) in the classroom.", solutions: [["aren't sitting", "are not sitting"]] },
    { type: "gap", prompt: "___ you ___ (listen) to me?", solutions: [["Are"], ["listening"]] },
    { type: "gap", prompt: "Who ___ she ___ (talk) to?", solutions: [["is"], ["talking"]] },
    { type: "gap", section: "Kurzantwort", instruction: "Antworte mit einer Kurzantwort. (+) = Yes",
      prompt: "Are you reading? (+) ___", solutions: [["Yes, I am"]] },
    { type: "choice", section: "Schreibweise", instruction: "Kreuze die richtige -ing-Form an.",
      prompt: "swim + ing = ?", options: ["swiming", "swimming", "swimmming"], answer: 1 },
    { type: "text", section: "Bildbeschreibung", instruction: "Schreibe den Satz auf Englisch.",
      prompt: "Einige Leute stehen um ein Feuer herum.", points: 2,
      expected: "Some people are standing around the fire.", focus: "present progressive (are standing)",
      keywords: ["are standing"] }
  ]
};

const TESTS = {
  [probeU1.id]: probeU1,
  [ktG1.id]: ktG1,
  [ktG2.id]: ktG2,
  [ktG3.id]: ktG3,
  [ktG4.id]: ktG4
};

module.exports = { TESTS };
