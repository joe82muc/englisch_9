"use strict";

/**
 * Grammatiktests Englisch 7M und 7R, Unit 1 (Out and about in England).
 * Laufen ueber dasselbe Modul wie Englisch 9 (grammatik9r.js, Routen
 * /api/grammatik9r/...). Aufbau der Aufgaben siehe grammatik9r-daten.js.
 *
 * Passend zu den Grammatikseiten G1-G4 von Englisch 7:
 *   G1 simple past, G2 simple present, G3 Fragen mit do/does und
 *   Kurzantworten, G4 Possessivpronomen.
 *
 * 7M und 7R schreiben dieselben Aufgaben, nur der Notenschluessel ist
 * verschieden: 7M "M" (50 % = Note 4), 7R "R" (50 % = Note 3).
 */

const KI_THEMEN_7 = [
  "- simple past: -ed bzw. richtige unregelmaessige Form, didn't + Grundform, was/were",
  "- simple present: s bei he/she/it (goes, watches), don't/doesn't + Grundform, am/is/are",
  "- Fragen mit do/does + Grundform, Fragewoerter, Kurzantworten (Yes, I do. / No, she doesn't.)",
  "- Possessivpronomen ohne Nomen: mine, yours, his, hers, its, ours, theirs;",
  "  vor einem Nomen: my, your, his, her, its, our, their"
];

/* ==================================================================
   Grammatikprobe Unit 1 (G1-G4)
   ================================================================== */
const probe = {
  key: "probe",
  kind: "probe",
  title: "Grammatikprobe Unit 1 - Out and about in England",
  items: [
    // --- A: simple past ---
    { type: "gap", section: "A · Simple past (G1)", instruction: "Setze die Verben im simple past ein.",
      prompt: "Last year we ___ (go) to London.", solutions: [["went"]] },
    { type: "gap", prompt: "I ___ (buy) a T-shirt at the market.", solutions: [["bought"]] },
    { type: "gap", prompt: "My sister ___ (not like) the museum.", solutions: [["didn't like"]] },
    { type: "gap", prompt: "The actors ___ (be) brilliant.", solutions: [["were"]] },
    { type: "gap", prompt: "___ you ___ (enjoy) the play?", solutions: [["Did"], ["enjoy"]] },
    { type: "gap", prompt: "The tour ___ (not be) boring.", solutions: [["wasn't"]] },

    // --- B: simple present ---
    { type: "gap", section: "B · Simple present (G2)", instruction: "Setze die Verben im simple present ein. Denk an das s bei he, she, it.",
      prompt: "Hannah ___ (go) to school by bus.", solutions: [["goes"]] },
    { type: "gap", prompt: "My dad ___ (not work) on Sundays.", solutions: [["doesn't work"]] },
    { type: "gap", prompt: "We ___ (not have) a garden.", solutions: [["don't have"]] },
    { type: "gap", prompt: "The Globe Theatre ___ (be) in London.", solutions: [["is"]] },
    { type: "gap", prompt: "My friends often ___ (play) rugby.", solutions: [["play"]] },

    // --- C: Fragen und Kurzantworten ---
    { type: "gap", section: "C · Fragen und Kurzantworten (G3)", instruction: "Ergänze die Fragen. Gib bei (+) und (–) eine Kurzantwort.",
      prompt: "___ you ___ (live) in a flat?", solutions: [["Do"], ["live"]] },
    { type: "gap", prompt: "___ your brother ___ (like) surfing?", solutions: [["Does"], ["like"]] },
    { type: "gap", prompt: "What time ___ the film ___ (start)?", solutions: [["does"], ["start"]] },
    { type: "gap", prompt: "Does Tom play the guitar? (–) ___", solutions: [["No, he doesn't"]] },
    { type: "gap", prompt: "Were you at the exhibition? (+) ___", solutions: [["Yes, I was", "Yes, we were"]] },

    // --- D: Possessivpronomen ---
    { type: "gap", section: "D · Possessivpronomen (G4)", instruction: "Setze das richtige Pronomen ein. In Klammern steht, wem etwas gehört.",
      prompt: "Is this bag ___? (you)", solutions: [["yours"]] },
    { type: "gap", prompt: "That's not my ticket. ___ is here. (I)", solutions: [["Mine"]] },
    { type: "gap", prompt: "The red bikes are ___. (we)", solutions: [["ours"]] },
    { type: "gap", prompt: "This isn't Tom's cap. ___ is green. (he)", solutions: [["His"]] },
    { type: "gap", prompt: "The cat is playing with ___ ball. (it)", solutions: [["its"]] },

    // --- E: Was ist richtig? ---
    { type: "choice", section: "E · Was ist richtig?", instruction: "Achte auf die Signalwörter und kreuze an.",
      prompt: "Yesterday we ___ to the coast.", options: ["drive", "drove", "drives"], answer: 1 },
    { type: "choice", prompt: "Every morning Tom ___ milk.", options: ["drink", "drinks", "drank"], answer: 1 },
    { type: "choice", prompt: "___ she speak French?", options: ["Do", "Does", "Is"], answer: 1 },
    { type: "choice", prompt: "Is this your phone? – Yes, it's ___.", options: ["my", "mine", "me"], answer: 1 },

    // --- F: Uebersetzen ---
    { type: "text", section: "F · Übersetze ins Englische", instruction: "Schreibe ganze Sätze. Es kommt auf die richtige Form an.",
      prompt: "Wir sind letzten Sommer nach Manchester gefahren.", points: 2,
      expected: "We went to Manchester last summer.", focus: "simple past (went)",
      keywords: ["went|drove|travelled|traveled", "last summer"] },
    { type: "text", prompt: "Meine Schwester trinkt keine Milch.", points: 2,
      expected: "My sister doesn't drink milk.", focus: "simple present verneint mit doesn't + Grundform",
      keywords: ["does not drink"] },
    { type: "text", prompt: "Spielst du gern Fußball?", points: 2,
      expected: "Do you like playing football? / Do you like to play football?", focus: "Frage mit do + Grundform",
      keywords: ["do you like"] },
    { type: "text", prompt: "Das Buch ist nicht meins. Es ist ihres (von ihr).", points: 2,
      expected: "The book isn't mine. It's hers.", focus: "Possessivpronomen mine und hers",
      keywords: ["mine", "hers"] }
  ]
};

/* ==================================================================
   Grammatiktest G1 - Simple past
   ================================================================== */
const ktG1 = {
  key: "kt-g1", kind: "kurztest",
  title: "Grammatiktest G1 - Simple past",
  items: [
    { type: "gap", section: "Simple past", instruction: "Setze die Verben im simple past ein.",
      prompt: "Last weekend we ___ (visit) Manchester.", solutions: [["visited"]] },
    { type: "gap", prompt: "My brother ___ (take) a lot of photos.", solutions: [["took"]] },
    { type: "gap", prompt: "We ___ (not go) to the football museum.", solutions: [["didn't go"]] },
    { type: "gap", prompt: "The weather ___ (be) great.", solutions: [["was"]] },
    { type: "gap", prompt: "The shops ___ (be) very busy.", solutions: [["were"]] },
    { type: "gap", prompt: "___ you ___ (see) the Globe Theatre?", solutions: [["Did"], ["see"]] },
    { type: "gap", section: "Kurzantwort", instruction: "Antworte mit einer Kurzantwort. (+) = Yes",
      prompt: "Were you tired? (+) ___", solutions: [["Yes, I was", "Yes, we were"]] },
    { type: "choice", section: "Was ist richtig?", instruction: "Kreuze an.",
      prompt: "Which sentence is correct?",
      options: ["He didn't played football.", "He didn't play football.", "He don't played football."], answer: 1 },
    { type: "text", section: "Übersetze", instruction: "Schreibe den Satz auf Englisch.",
      prompt: "Ich habe gestern meine Oma besucht.", points: 2,
      expected: "I visited my grandma yesterday.", focus: "simple past (visited)",
      keywords: ["visited", "yesterday"] }
  ]
};

/* ==================================================================
   Grammatiktest G2 - Simple present
   ================================================================== */
const ktG2 = {
  key: "kt-g2", kind: "kurztest",
  title: "Grammatiktest G2 - Simple present",
  items: [
    { type: "gap", section: "Simple present", instruction: "Setze die Verben im simple present ein. Denk an das s bei he, she, it.",
      prompt: "Tom ___ (live) in Manchester.", solutions: [["lives"]] },
    { type: "gap", prompt: "My sister ___ (watch) TV every evening.", solutions: [["watches"]] },
    { type: "gap", prompt: "I ___ (not like) cold weather.", solutions: [["don't like"]] },
    { type: "gap", prompt: "Hannah ___ (not play) football.", solutions: [["doesn't play"]] },
    { type: "gap", prompt: "My parents ___ (be) at work.", solutions: [["are"]] },
    { type: "gap", prompt: "The museum ___ (open) at ten o'clock.", solutions: [["opens"]] },
    { type: "gap", prompt: "Our school ___ (be) very big.", solutions: [["is"]] },
    { type: "choice", section: "Was ist richtig?", instruction: "Kreuze an.",
      prompt: "Which sentence is correct?",
      options: ["She go to school by bus.", "She goes to school by bus.", "She gos to school by bus."], answer: 1 },
    { type: "choice", prompt: "Which is a signal word for the simple present?",
      options: ["yesterday", "every day", "last week"], answer: 1 },
    { type: "text", section: "Übersetze", instruction: "Schreibe den Satz auf Englisch.",
      prompt: "Er spielt jeden Samstag Rugby.", points: 2,
      expected: "He plays rugby every Saturday.", focus: "simple present mit s bei he (plays)",
      keywords: ["plays", "every saturday|on saturdays"] }
  ]
};

/* ==================================================================
   Grammatiktest G3 - Fragen und Kurzantworten
   ================================================================== */
const ktG3 = {
  key: "kt-g3", kind: "kurztest",
  title: "Grammatiktest G3 - Fragen mit do und does",
  items: [
    { type: "gap", section: "Fragen", instruction: "Ergänze die Fragen mit do oder does und dem Verb.",
      prompt: "___ you ___ (like) the theatre?", solutions: [["Do"], ["like"]] },
    { type: "gap", prompt: "___ Tom ___ (live) near the coast?", solutions: [["Does"], ["live"]] },
    { type: "gap", prompt: "Where ___ your parents ___ (work)?", solutions: [["do"], ["work"]] },
    { type: "gap", section: "Kurzantworten", instruction: "Antworte mit einer Kurzantwort. (+) = Yes, (–) = No",
      prompt: "Does Hannah play the guitar? (+) ___", solutions: [["Yes, she does"]] },
    { type: "gap", prompt: "Do your friends go surfing? (–) ___", solutions: [["No, they don't"]] },
    { type: "gap", prompt: "Is Manchester in the north of England? (+) ___", solutions: [["Yes, it is"]] },
    { type: "choice", section: "Was ist richtig?", instruction: "Kreuze an.",
      prompt: "Which question is correct?",
      options: ["Does he likes pizza?", "Does he like pizza?", "Do he like pizza?"], answer: 1 },
    { type: "text", section: "Übersetze", instruction: "Schreibe die Frage auf Englisch.",
      prompt: "Wann stehst du am Morgen auf?", points: 2,
      expected: "When do you get up in the morning?", focus: "Frage mit Fragewort + do + Grundform",
      keywords: ["when do you get up"] }
  ]
};

/* ==================================================================
   Grammatiktest G4 - Possessivpronomen
   ================================================================== */
const ktG4 = {
  key: "kt-g4", kind: "kurztest",
  title: "Grammatiktest G4 - Possessivpronomen",
  items: [
    { type: "gap", section: "Possessivpronomen", instruction: "Setze das richtige Pronomen ein. In Klammern steht, wem etwas gehört.",
      prompt: "This isn't my bag. ___ is blue. (I)", solutions: [["Mine"]] },
    { type: "gap", prompt: "Is this pen ___? (you)", solutions: [["yours"]] },
    { type: "gap", prompt: "That's not Tom's jacket. ___ is black. (he)", solutions: [["His"]] },
    { type: "gap", prompt: "Are these Hannah's books? – Yes, they're ___. (she)", solutions: [["hers"]] },
    { type: "gap", prompt: "We love our house. ___ is very old. (we)", solutions: [["Ours"]] },
    { type: "gap", prompt: "The ball isn't ours. It's ___. (they)", solutions: [["theirs"]] },
    { type: "choice", section: "Was ist richtig?", instruction: "Kreuze an.",
      prompt: "Is this your bike? – Yes, it's ___.", options: ["my", "mine", "me"], answer: 1 },
    { type: "choice", prompt: "The dog is eating ___ food.", options: ["its", "it's", "his"], answer: 0 },
    { type: "text", section: "Übersetze", instruction: "Schreibe die Sätze auf Englisch.",
      prompt: "Das ist nicht meine Tasche. Meine ist rot.", points: 2,
      expected: "That's not my bag. Mine is red.", focus: "my vor dem Nomen, mine ohne Nomen",
      keywords: ["my bag", "mine is red"] }
  ]
};

/* ---- Je eine Fassung fuer 7M und 7R erzeugen ---- */
const TESTS = {};
for (const klasse of ["7M", "7R"]) {
  for (const base of [probe, ktG1, ktG2, ktG3, ktG4]) {
    const id = `e7${klasse.slice(1).toLowerCase()}-u1-${base.key}`;
    const { key, ...rest } = base;
    TESTS[id] = {
      ...rest,
      id,
      title: `${klasse} · ${base.title}`,
      unit: `Englisch ${klasse} / Unit 1`,
      classLevel: klasse,
      level: "7",
      kiThemen: KI_THEMEN_7,
      gradeScale: klasse === "7M" ? "M" : "R"
    };
  }
}

module.exports = { TESTS };
