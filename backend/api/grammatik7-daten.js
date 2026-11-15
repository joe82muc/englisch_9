"use strict";

/**
 * Grammatiktests Englisch 7M und 7R, Unit 1 (Out and about in England),
 * dazu seit 15.11.2026 zwei Grammatikproben im Format von Unit 2: e7m-u1-gp1, e7r-u1-gp1 (G1 simple past),
 * e7m-u1-gp2, e7r-u1-gp2 (G2 simple present, G3 Fragen/Kurzantworten, G4 Possessivpronomen);
 * und je zwei Grammatikproben zu Unit 2 (Fun in Wales and Scotland), Stand 14.11.2026:
 * e7m-u2-gp1, e7r-u2-gp1 (G5 going to + G6 present perfect),
 * e7m-u2-gp2, e7r-u2-gp2 (G7 Fragen/Kurzantworten + present perfect oder simple past);
 * Unit 3 (Welcome to Ireland): e7m-u3-gp1, e7r-u3-gp1 (G8 Ort vor Zeit), e7m-u3-gp2, e7r-u3-gp2 (G9 some/any/no).
 * Unit 4 (USA - here we come!): e7m-u4-gp1, e7r-u4-gp1 (G10 more/most, less/least), e7m-u4-gp2, e7r-u4-gp2 (G11 much/many).
 * Unit 2: 7M und 7R haben getrennte Fassungen (7R leichter), je 16 Punkte.
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

/* ==================================================================
   Unit 1 - Out and about in England: zwei Grammatikproben je Zug im Format
   von Unit 2 (Stand 15.11.2026, Plan progress/englisch7/MODULE.md, „Tests Unit 1“).
   Die Grammatikprobe e7m|r-u1-probe und die Kurztests kt-g1 ... kt-g4 oben
   bleiben unverändert (im Einsatz).
   16 Punkte, 10 bis 15 Minuten, 7M und 7R getrennt.
   gp1: G1 simple past (Topic 1: Aussage, Verneinung, Fragen und Kurzantworten, was/were)
   gp2: G2 simple present + G3 Fragen mit do/does und Kurzantworten + G4 Possessivpronomen (Topic 2)
   7R: leichter (mehr Ankreuzen, meist nur ein Verb in der Luecke, ein kurzer offener Teil).
   7M: bildet die Formen selbst (Verneinung, Fragen mit Fragewort, Kurzantworten, zwei Saetze).
   Namen Noor, Logan, Ivy, Jasper, Ort Skipton (Yorkshire) - weder im Schulbuch noch in einem Modul.
   Schluessel wie Unit 2-4: 7M 50 % = Note 4, 7R 50 % = Note 3.
   ================================================================== */
const U1 = {
  "u1-gp1": {
    titel: "Grammatikprobe 1 Unit 1 – simple past",
    M: [
      // --- A: Aussagen ---
      { type: "gap", section: "A · Simple past (G1): Aussagen", instruction: "Setze die Verben im simple past ein. Achte auf die unregelmäßigen Verben.",
        prompt: "Last Saturday Noor ___ (visit) her grandma in Skipton.", solutions: [["visited"]] },
      { type: "gap", prompt: "First they ___ (go) to the market in the town centre.", solutions: [["went"]] },
      { type: "gap", prompt: "Noor ___ (buy) a warm scarf for her mum.", solutions: [["bought"]] },
      { type: "gap", prompt: "The weather ___ (be) cold and windy.", solutions: [["was"]] },
      { type: "gap", prompt: "In the afternoon Logan and Jasper ___ (ride) their bikes along the canal.", solutions: [["rode"]] },

      // --- B: Verneinung ---
      { type: "gap", section: "B · Verneinung", instruction: "Verneine im simple past: didn't + Grundform, bei be: wasn't oder weren't. Kurz- und Langform sind beide richtig.",
        prompt: "Ivy ___ (not / come) with us because she had a cold.", solutions: [["didn't come"]] },
      { type: "gap", prompt: "We ___ (not / have) time for an ice cream.", solutions: [["didn't have"]] },
      { type: "gap", prompt: "The shops ___ (not / be) open on Sunday morning.", solutions: [["weren't"]] },

      // --- C: Fragen und Kurzantworten ---
      { type: "gap", section: "C · Fragen und Kurzantworten", instruction: "Ergänze die Frage mit did und der Grundform. Gib bei (+) und (–) eine Kurzantwort.",
        prompt: "___ you ___ (enjoy) the trip to Skipton?", solutions: [["Did"], ["enjoy"]] },
      { type: "gap", prompt: "Did Jasper take the train? (–) ___", solutions: [["No, he didn't"]] },
      { type: "gap", prompt: "Were the streets busy? (+) ___", solutions: [["Yes, they were"]] },

      // --- D: Was ist richtig? ---
      { type: "choice", section: "D · Was ist richtig?", instruction: "Kreuze an.",
        prompt: "Logan ___ his homework yesterday.", options: ["didn't finish", "didn't finished", "doesn't finish"], answer: 0 },
      { type: "choice", prompt: "Where ___ you last weekend? – At my cousin's house.", options: ["were", "was", "did"], answer: 0 },

      // --- E: zwei Saetze ---
      { type: "text", section: "E · Schreibe zwei Sätze", instruction: "Schreibe zwei ganze Sätze auf Englisch. Achte auf das simple past.",
        prompt: "1. Ich habe am Samstag meinen Cousin besucht.  2. Wir sind nicht ins Kino gegangen.", points: 2,
        expected: "I visited my cousin on Saturday. We didn't go to the cinema.",
        focus: "Satz 1: simple past (visited); Satz 2: Verneinung mit didn't + Grundform (didn't go, nicht didn't went). Je Satz 1 Punkt.",
        keywords: ["visited", "didn't go|did not go"] }
    ],
    R: [
      // --- A: Welche Form ist richtig? ---
      { type: "choice", section: "A · Simple past (G1): Welche Form ist richtig?", instruction: "Achte auf die Signalwörter (last, yesterday) und kreuze an.",
        prompt: "Last Saturday Noor ___ her grandma.", options: ["visited", "visits", "visit"], answer: 0 },
      { type: "choice", prompt: "Yesterday we ___ to the market in Skipton.", options: ["went", "goed", "go"], answer: 0 },
      { type: "choice", prompt: "Logan ___ a new cap last week.", options: ["bought", "buyed", "buys"], answer: 0 },
      { type: "choice", prompt: "Ivy and Jasper ___ tired after the walk.", options: ["were", "was", "did"], answer: 0 },

      // --- B: Form schreiben ---
      { type: "gap", section: "B · Schreibe das Verb im simple past", instruction: "Setze das Verb in der Klammer im simple past ein.",
        prompt: "Ivy ___ (play) football in the park.", solutions: [["played"]] },
      { type: "gap", prompt: "Jasper ___ (watch) a film on Sunday.", solutions: [["watched"]] },
      { type: "gap", prompt: "We ___ (take) the bus to Skipton.", solutions: [["took"]] },
      { type: "gap", prompt: "Noor ___ (see) a lot of sheep on the hills.", solutions: [["saw"]] },

      // --- C: Verneinung ---
      { type: "gap", section: "C · Verneinung", instruction: "Verneine: didn't + Grundform. Bei be: wasn't oder weren't.",
        prompt: "Noor ___ (not / like) the cold wind.", solutions: [["didn't like"]] },
      { type: "gap", prompt: "We ___ (not / go) to the castle.", solutions: [["didn't go"]] },
      { type: "gap", prompt: "The shops ___ (not / be) open.", solutions: [["weren't"]] },

      // --- D: Fragen und Kurzantworten ---
      { type: "choice", section: "D · Fragen und Kurzantworten", instruction: "Kreuze das richtige Wort an.",
        prompt: "___ you enjoy the trip?", options: ["Did", "Do", "Were"], answer: 0 },
      { type: "choice", prompt: "Did Logan take the train? – No, he ___.", options: ["didn't", "wasn't", "doesn't"], answer: 0 },
      { type: "choice", prompt: "Was the market busy? – Yes, it ___.", options: ["was", "did", "were"], answer: 0 },

      // --- E: ein Satz ---
      { type: "text", section: "E · Schreibe einen Satz", instruction: "Schreibe einen ganzen Satz auf Englisch.",
        prompt: "Ich habe gestern meine Hausaufgaben nicht gemacht.", points: 2,
        expected: "I didn't do my homework yesterday.",
        focus: "Verneinung im simple past: didn't + Grundform (didn't do, nicht didn't did)",
        keywords: ["didn't do|did not do", "homework"] }
    ]
  },

  "u1-gp2": {
    titel: "Grammatikprobe 2 Unit 1 – simple present, Fragen, Possessivpronomen",
    M: [
      // --- A: simple present ---
      { type: "gap", section: "A · Simple present (G2)", instruction: "Setze die Verben im simple present ein. Denk an das s bei he, she, it. Verneinung: don't oder doesn't + Grundform.",
        prompt: "Noor ___ (catch) the bus at a quarter to eight.", solutions: [["catches"]] },
      { type: "gap", prompt: "Our lessons ___ (start) at half past eight.", solutions: [["start"]] },
      { type: "gap", prompt: "Ivy ___ (study) hard for her tests.", solutions: [["studies"]] },
      { type: "gap", prompt: "Logan ___ (not / like) PE in winter.", solutions: [["doesn't like"]] },
      { type: "gap", prompt: "We ___ (not / wear) a school uniform.", solutions: [["don't wear"]] },

      // --- B: Fragen ---
      { type: "gap", section: "B · Fragen mit do und does (G3)", instruction: "Ergänze die Fragen mit do oder does und dem Verb in der Grundform.",
        prompt: "___ Jasper ___ (go) to the drama club?", solutions: [["Does"], ["go"]] },
      { type: "gap", prompt: "What time ___ your lessons ___ (finish)?", solutions: [["do"], ["finish"]] },

      // --- C: Kurzantworten ---
      { type: "gap", section: "C · Kurzantworten (G3)", instruction: "Antworte mit einer Kurzantwort. (+) = Yes, (–) = No.",
        prompt: "Does Ivy have lunch in the canteen? (+) ___", solutions: [["Yes, she does"]] },
      { type: "gap", prompt: "Do Noor and Logan walk to school? (–) ___", solutions: [["No, they don't"]] },

      // --- D: Possessivpronomen ---
      { type: "gap", section: "D · Possessivpronomen (G4)", instruction: "Setze das Pronomen ohne Nomen ein. In Klammern steht, wem etwas gehört.",
        prompt: "This isn't Noor's pencil case. ___ is red. (she)", solutions: [["Hers"]] },
      { type: "gap", prompt: "Are these your books? – Yes, they're ___. (I)", solutions: [["mine"]] },
      { type: "gap", prompt: "Logan and Jasper have got new bikes. The blue bikes are ___. (they)", solutions: [["theirs"]] },

      // --- E: zwei Saetze ---
      { type: "text", section: "E · Schreibe zwei Sätze", instruction: "Schreibe zwei ganze Sätze auf Englisch.",
        prompt: "1. Frage Ivy: Fährt dein Bruder mit dem Bus zur Schule?  2. Sage: Die Tasche ist nicht meine. Sie ist seine.", points: 2,
        expected: "Does your brother go to school by bus? The bag isn't mine. It's his.",
        focus: "Satz 1: Frage mit Does + Grundform (go, nicht goes); Satz 2: Possessivpronomen ohne Nomen (mine, his - nicht my, him). Je Satz 1 Punkt.",
        keywords: ["does your brother", "mine", "his"] }
    ],
    R: [
      // --- A: simple present ---
      { type: "choice", section: "A · Simple present (G2): Was ist richtig?", instruction: "he, she, it – das s muss mit. Kreuze an.",
        prompt: "Noor ___ the bus to school.", options: ["catches", "catch", "catchs"], answer: 0 },
      { type: "choice", prompt: "My friends ___ lunch in the canteen.", options: ["have", "has", "haves"], answer: 0 },
      { type: "choice", prompt: "Logan ___ like maths.", options: ["doesn't", "don't", "isn't"], answer: 0 },

      // --- B: Verb einsetzen ---
      { type: "gap", section: "B · Setze das Verb ein", instruction: "Setze das Verb in der Klammer im simple present ein. Bei not: don't oder doesn't + Grundform.",
        prompt: "Ivy ___ (go) to the drama club on Fridays.", solutions: [["goes"]] },
      { type: "gap", prompt: "Lessons ___ (start) at 8.30 a.m.", solutions: [["start"]] },
      { type: "gap", prompt: "Jasper ___ (not / play) rugby.", solutions: [["doesn't play"]] },

      // --- C: Do oder Does? ---
      { type: "choice", section: "C · Fragen (G3): Do oder Does?", instruction: "Kreuze das richtige Wort an.",
        prompt: "___ you like your new school?", options: ["Do", "Does", "Are"], answer: 0 },
      { type: "choice", prompt: "___ Noor walk to school?", options: ["Does", "Do", "Is"], answer: 0 },
      { type: "choice", prompt: "Where ___ Logan and Jasper live?", options: ["do", "does", "are"], answer: 0 },

      // --- D: Kurzantworten ---
      { type: "gap", section: "D · Kurzantworten (G3)", instruction: "Ergänze die Kurzantwort. (+) = Yes, (–) = No.",
        prompt: "Does Ivy have lunch at school? (+) Yes, she ___.", solutions: [["does"]] },
      { type: "gap", prompt: "Do you wear a school uniform? (–) No, I ___.", solutions: [["don't"]] },

      // --- E: Possessivpronomen ---
      { type: "choice", section: "E · Possessivpronomen (G4)", instruction: "Ohne Nomen: mine, yours, his, hers, ours, theirs. Kreuze an.",
        prompt: "This isn't my pen. Is it ___, Jasper?", options: ["yours", "your", "you"], answer: 0 },
      { type: "choice", prompt: "Noor has got a green bag. The green bag is ___.", options: ["hers", "her", "his"], answer: 0 },
      { type: "choice", prompt: "We have got a big classroom. The big classroom is ___.", options: ["ours", "our", "us"], answer: 0 },

      // --- F: eine Frage ---
      { type: "text", section: "F · Schreibe eine Frage", instruction: "Schreibe eine ganze Frage auf Englisch. Denk an does.",
        prompt: "Frage: Spielt Logan Gitarre?", points: 2,
        expected: "Does Logan play the guitar?",
        focus: "Frage mit Does + Person + Grundform (play, nicht plays); the guitar und guitar sind beide richtig",
        keywords: ["does logan play"] }
    ]
  }
};

for (const klasse of ["7M", "7R"]) {
  for (const [key, def] of Object.entries(U1)) {
    const id = `e7${klasse.slice(1).toLowerCase()}-${key}`;
    TESTS[id] = {
      id,
      kind: "probe",
      title: `${klasse} · ${def.titel}`,
      unit: `Englisch ${klasse} / Unit 1`,
      classLevel: klasse,
      level: "7",
      kiThemen: KI_THEMEN_7,
      gradeScale: klasse === "7M" ? "M" : "R",
      items: def[klasse[1]]
    };
  }
}

/* ==================================================================
   Unit 2 - Fun in Wales and Scotland (Stand 14.11.2026)
   Zwei Grammatikproben je Zug, 16 Punkte, 10 bis 15 Minuten.
   gp1: G5 going to-future + G6 present perfect (Aussage, Verneinung)
   gp2: G7 present perfect Fragen/Kurzantworten + present perfect oder simple past
   7R: leichter (mehr Ankreuzen, meist nur ein Verb in der Luecke, ein kurzer offener Teil).
   7M: anspruchsvoller (Formen selbst bilden, Verneinung/Fragen gemischt, zwei eigene Saetze).
   Schluessel wie Unit 1: 7M 50 % = Note 4, 7R 50 % = Note 3.
   ================================================================== */
const KI_THEMEN_7_U2 = [
  "- going to-future: am/is/are + going to + Grundform; Verneinung mit not (isn't going to); Fragen mit Are/Is ... going to",
  "- present perfect: have/has + 3. Form (been, done, seen, made, taken, packed ...); haven't/hasn't; he/she/it -> has",
  "- present perfect Fragen: Have/Has + Person + 3. Form (ever, yet); Kurzantworten Yes, I have. / No, she hasn't.",
  "- present perfect oder simple past: genaue Zeitangabe (yesterday, last summer, two days ago) -> simple past;",
  "  ever, never, already, yet, just, before -> present perfect"
];

const U2 = {
  "u2-gp1": {
    titel: "Grammatikprobe 1 Unit 2 – going to und present perfect",
    M: [
      // --- A: going to ---
      { type: "gap", section: "A · Going to-future (G5)", instruction: "Bilde das going to-future. Achte auf am, is oder are und auf die Verneinung.",
        prompt: "Next weekend we ___ (visit) a castle in Wales.", solutions: [["are going to visit"]] },
      { type: "gap", prompt: "Rhys ___ (not / try) the zip line. He thinks it looks dangerous.", solutions: [["isn't going to try"]] },
      { type: "gap", prompt: "I ___ (book) a room for Saturday night.", solutions: [["am going to book"]] },
      { type: "gap", prompt: "___ you ___ (watch) the rugby match tomorrow?", solutions: [["Are"], ["going to watch"]] },

      // --- B: present perfect ---
      { type: "gap", section: "B · Present perfect (G6)", instruction: "Setze das present perfect ein: have/has + 3. Form. Bei not darfst du die Kurzform oder die Langform schreiben.",
        prompt: "Mia ___ already ___ (pack) her rucksack.", solutions: [["has"], ["packed"]] },
      { type: "gap", prompt: "We ___ (not / book) the tickets yet.", solutions: [["haven't booked"]] },
      { type: "gap", prompt: "Omar ___ never ___ (see) a kilt before.", solutions: [["has"], ["seen"]] },
      { type: "gap", prompt: "My parents ___ (be) to Scotland three times.", solutions: [["have been"]] },
      { type: "gap", prompt: "Jonas ___ (not / do) his homework yet.", solutions: [["hasn't done"]] },

      // --- C: Welche Form? ---
      { type: "choice", section: "C · Welche Form passt?", instruction: "Achte auf die Signalwörter und kreuze an.",
        prompt: "Tomorrow we ___ the hills near Cardiff.", options: ["are going to climb", "have climbed", "climbed"], answer: 0 },
      { type: "choice", prompt: "Lotta ___ the zip line twice already, so she knows it well.", options: ["is going to try", "has tried", "try"], answer: 1 },

      // --- D: eigene Saetze ---
      { type: "text", section: "D · Schreibe zwei eigene Sätze", instruction: "Schreibe zwei ganze Sätze über dich. Achte auf die richtige Form.",
        prompt: "1. Was hast du für nächstes Wochenende vor? (going to)  2. Was hast du diese Woche schon erledigt? (present perfect, zum Beispiel mit already)", points: 2,
        expected: "Next weekend I'm going to visit my cousin. I've already finished my English homework.",
        focus: "Satz 1: going to-future mit am/is/are + going to + Grundform; Satz 2: present perfect mit have/has + 3. Form. Je Satz 1 Punkt.",
        keywords: ["going to", "have|has|'ve|'s"] }
    ],
    R: [
      // --- A: am, is oder are ---
      { type: "choice", section: "A · Going to-future (G5): am, is oder are?", instruction: "Kreuze das richtige Wort an.",
        prompt: "Tomorrow I ___ going to pack my rucksack.", options: ["am", "is", "are"], answer: 0 },
      { type: "choice", prompt: "Lotta ___ going to book a room for us.", options: ["am", "is", "are"], answer: 1 },
      { type: "choice", prompt: "My friends and I ___ going to try the zip line.", options: ["am", "is", "are"], answer: 2 },

      // --- B: going to ergaenzen ---
      { type: "gap", section: "B · Going to ergänzen", instruction: "Setze ein. Nach going to steht die Grundform. (–) heißt: verneint.",
        prompt: "We are going to ___ (visit) a castle next week.", solutions: [["visit"]] },
      { type: "gap", prompt: "Omar ___ going to play rugby tomorrow. He is ill. (–)", solutions: [["isn't"]] },
      { type: "gap", prompt: "Are you going to ___ (watch) the match? – Yes, I ___.", solutions: [["watch"], ["am"]] },

      // --- C: present perfect ---
      { type: "gap", section: "C · Present perfect (G6)", instruction: "Schreibe die 3. Form des Verbs in der Klammer.",
        prompt: "Mia has already ___ (pack) her bag.", solutions: [["packed"]] },
      { type: "gap", prompt: "We have ___ (see) a Welsh castle.", solutions: [["seen"]] },
      { type: "gap", prompt: "I ___ (not / finish) my homework yet.", solutions: [["haven't finished"]] },
      { type: "gap", prompt: "He has ___ (make) a sandwich for the hike.", solutions: [["made"]] },
      { type: "gap", prompt: "We have ___ (take) a lot of photos.", solutions: [["taken"]] },
      { type: "choice", section: "C2 · have oder has?", instruction: "Kreuze an.",
        prompt: "Omar ___ been to Scotland before.", options: ["have", "has", "is"], answer: 1 },
      { type: "choice", prompt: "My parents ___ never eaten haggis.", options: ["has", "have", "are"], answer: 1 },

      // --- D: ein eigener Satz ---
      { type: "text", section: "D · Schreibe einen Satz", instruction: "Schreibe einen ganzen Satz mit going to.",
        prompt: "Was hast du für das nächste Wochenende vor? Schreibe einen Satz mit going to.", points: 2,
        expected: "I'm going to visit my grandma on Saturday.",
        focus: "going to-future: am/is/are + going to + Grundform",
        keywords: ["going to"] }
    ]
  },

  "u2-gp2": {
    titel: "Grammatikprobe 2 Unit 2 – present perfect: Fragen und Zeitformen",
    M: [
      // --- A: Fragen ---
      { type: "gap", section: "A · Fragen im present perfect (G7)", instruction: "Ergänze die Fragen mit have oder has und der 3. Form.",
        prompt: "___ you ever ___ (be) to Wales?", solutions: [["Have"], ["been"]] },
      { type: "gap", prompt: "___ Aylin ___ (finish) her project yet?", solutions: [["Has"], ["finished"]] },
      { type: "gap", prompt: "What ___ they ___ (see) in Scotland so far?", solutions: [["have"], ["seen"]] },

      // --- B: Kurzantworten ---
      { type: "gap", section: "B · Kurzantworten (G7)", instruction: "Antworte mit einer Kurzantwort. (+) = Yes, (–) = No.",
        prompt: "Has Lotta packed her bag? (+) ___", solutions: [["Yes, she has"]] },
      { type: "gap", prompt: "Have they booked the hotel? (–) ___", solutions: [["No, they haven't"]] },
      { type: "gap", prompt: "Have you seen the castle yet? (–) ___", solutions: [["No, I haven't", "No, we haven't"]] },

      // --- C: present perfect oder simple past ---
      { type: "gap", section: "C · Present perfect oder simple past?", instruction: "Setze die Verben in der passenden Zeitform ein. Achte auf die Signalwörter.",
        prompt: "Last summer we ___ (go) to a camp in Wales.", solutions: [["went"]] },
      { type: "gap", prompt: "I ___ never ___ (eat) a Welsh cake.", solutions: [["have"], ["eaten"]] },
      { type: "gap", prompt: "Rhys ___ (visit) his cousin two days ago.", solutions: [["visited"]] },
      { type: "gap", prompt: "We ___ (not / see) a seal yet.", solutions: [["haven't seen"]] },

      // --- D: eigene Saetze ---
      { type: "text", section: "D · Schreibe zwei eigene Sätze", instruction: "Schreibe zwei ganze Sätze. Achte auf die richtige Zeitform.",
        prompt: "1. Frage deinen Freund Omar, ob er schon einmal eine Seilrutsche (zip line) ausprobiert hat.  2. Sage, was du letzten Sommer gemacht hast.", points: 2,
        expected: "Have you ever tried a zip line, Omar? Last summer I went to a camp in Scotland.",
        focus: "Satz 1: present perfect Frage mit Have you ever + 3. Form; Satz 2: simple past mit einer Zeitangabe (last summer). Je Satz 1 Punkt.",
        keywords: ["have you ever", "last summer"] }
    ],
    R: [
      // --- A: Fragen ---
      { type: "choice", section: "A · Fragen im present perfect (G7)", instruction: "Kreuze Have oder Has an.",
        prompt: "___ you ever tried skiing?", options: ["Have", "Has", "Do"], answer: 0 },
      { type: "choice", prompt: "___ Mia packed her bag yet?", options: ["Have", "Has", "Did"], answer: 1 },
      { type: "choice", prompt: "___ your parents booked the hotel?", options: ["Has", "Have", "Do"], answer: 1 },
      { type: "gap", section: "A2 · Frage ergänzen", instruction: "Schreibe die 3. Form des Verbs in der Klammer.",
        prompt: "Have you ___ (see) the castle yet?", solutions: [["seen"]] },
      { type: "gap", prompt: "Has Omar ___ (finish) his homework?", solutions: [["finished"]] },

      // --- B: Kurzantworten ---
      { type: "gap", section: "B · Kurzantworten (G7)", instruction: "Ergänze die Kurzantwort. (+) = Yes, (–) = No.",
        prompt: "Has Lotta packed her bag? (+) Yes, she ___.", solutions: [["has"]] },
      { type: "gap", prompt: "Have they booked the hotel? (–) No, they ___.", solutions: [["haven't"]] },
      { type: "gap", prompt: "Have you seen the zip line? (+) Yes, I ___.", solutions: [["have"]] },

      // --- C: Welche Zeitform? ---
      { type: "choice", section: "C · Present perfect oder simple past?", instruction: "Achte auf die Signalwörter und kreuze an.",
        prompt: "We ___ to Wales last summer.", options: ["went", "have been", "go"], answer: 0 },
      { type: "choice", prompt: "Have you ___ seen a seal?", options: ["yesterday", "ever", "last week"], answer: 1 },
      { type: "choice", prompt: "I ___ my grandma two days ago.", options: ["visited", "have visited", "visit"], answer: 0 },
      { type: "choice", prompt: "Omar has ___ packed his bag.", options: ["already", "yesterday", "ago"], answer: 0 },

      // --- D: Luecken ---
      { type: "gap", section: "D · Setze das Verb ein", instruction: "Simple past oder present perfect? Achte auf die Signalwörter.",
        prompt: "Last weekend we ___ (go) to a castle.", solutions: [["went"]] },
      { type: "gap", prompt: "Mia has ___ (be) to Scotland before.", solutions: [["been"]] },

      // --- E: eine Frage ---
      { type: "text", section: "E · Schreibe eine Frage", instruction: "Schreibe eine ganze Frage.",
        prompt: "Frage einen Freund, ob er schon einmal in Schottland war.", points: 2,
        expected: "Have you ever been to Scotland?",
        focus: "present perfect Frage: Have + you + ever + 3. Form (been)",
        keywords: ["have you ever been"] }
    ]
  }
};

for (const klasse of ["7M", "7R"]) {
  for (const [key, def] of Object.entries(U2)) {
    const id = `e7${klasse.slice(1).toLowerCase()}-${key}`;
    TESTS[id] = {
      id,
      kind: "probe",
      title: `${klasse} · ${def.titel}`,
      unit: `Englisch ${klasse} / Unit 2`,
      classLevel: klasse,
      level: "7",
      kiThemen: KI_THEMEN_7_U2,
      gradeScale: klasse === "7M" ? "M" : "R",
      items: def[klasse[1]]
    };
  }
}

/* ==================================================================
   Unit 3 - Welcome to Ireland (Stand 14.11.2026)
   Zwei Grammatikproben je Zug, 16 Punkte, 10 bis 15 Minuten.
   gp1: G8 Ort vor Zeit (Zeit am Satzanfang nur 7M, Plus)
   gp2: G9 some/any/no, something/anything/nothing, somebody/anybody/nobody
   7R: leichter (mehr Ankreuzen, kuerzere Saetze, ein kurzer offener Teil).
   7M: bildet selbst (Angaben ordnen, Saetze umstellen, zwei eigene Saetze).
   Schluessel wie Unit 1/2: 7M 50 % = Note 4, 7R 50 % = Note 3.
   ================================================================== */
const KI_THEMEN_7_U3 = [
  "- Ort vor Zeit am Satzende: We met at the station on Friday. (nicht: on Friday at the station); gilt auch in Fragen und beim going to-future",
  "- Zeitangabe am Satzanfang (nur 7M, Plus): On Friday we met at the station. (Komma ist egal)",
  "- some in bejahten Saetzen, any in verneinten Saetzen und Fragen (We haven't got any apples. Have you got any money?)",
  "- no ohne not (There is no milk. = There isn't any milk.); keine doppelte Verneinung (nicht: I didn't see nobody)",
  "- something/anything/nothing und somebody/anybody/nobody (someone/anyone/no one gelten genauso); bei Angeboten und Bitten some (nur 7M, Plus)"
];

const U3 = {
  "u3-gp1": {
    titel: "Grammatikprobe 1 Unit 3 – Ort vor Zeit",
    M: [
      // --- A: zwei Angaben ordnen ---
      { type: "gap", section: "A · Ort vor Zeit (G8)", instruction: "Schreibe die beiden Angaben in Klammern in der richtigen Reihenfolge in die Lücke. Erst der Ort, dann die Zeit.",
        prompt: "We waited ___ (on Friday / at the bus stop).", solutions: [["at the bus stop on Friday"]] },
      { type: "gap", prompt: "Cormac is going to meet us ___ (tomorrow / at the harbour).", solutions: [["at the harbour tomorrow", "at the harbor tomorrow"]] },
      { type: "gap", prompt: "The ferry leaves ___ (at 8 o'clock / from the pier).", solutions: [["from the pier at 8 o'clock", "from the pier at eight o'clock"]] },
      { type: "gap", prompt: "Did Sorcha stay ___ (last night / in a hostel)?", solutions: [["in a hostel last night"]] },
      { type: "gap", prompt: "My parents bought two tickets ___ (yesterday / at the station).", solutions: [["at the station yesterday"]] },

      // --- B: Saetze ordnen ---
      { type: "gap", section: "B · Sätze ordnen", instruction: "Bringe die Wörter in die richtige Reihenfolge und schreibe den ganzen Satz auf.",
        prompt: "the bus / Brigid / on Saturday / took / to the lake → ___",
        solutions: [["Brigid took the bus to the lake on Saturday", "On Saturday Brigid took the bus to the lake"]] },
      { type: "gap", prompt: "we / in the city centre / are going to / next week / meet → ___",
        solutions: [["We are going to meet in the city centre next week", "Next week we are going to meet in the city centre"]] },
      { type: "gap", prompt: "the bus / stops / outside the school / at half past four → ___",
        solutions: [["The bus stops outside the school at half past four", "At half past four the bus stops outside the school"]] },
      { type: "gap", prompt: "you / did / meet / Kieran / at the café / yesterday → ___?",
        solutions: [["Did you meet Kieran at the café yesterday", "Did you meet Kieran at the cafe yesterday"]] },

      // --- C: Was ist richtig? ---
      { type: "choice", section: "C · Was ist richtig?", instruction: "Kreuze an.",
        prompt: "Which sentence is correct?",
        options: ["We arrived in Kinsale on Tuesday.", "We arrived on Tuesday in Kinsale.", "We on Tuesday arrived in Kinsale."], answer: 0 },
      { type: "choice", prompt: "Wir haben uns gestern im Park getroffen.",
        options: ["We met in the park yesterday.", "We met yesterday in the park.", "We yesterday met in the park."], answer: 0 },
      { type: "choice", prompt: "Which sentence is NOT correct?",
        options: ["Did you wait at the pier last night?", "Are they going to arrive at the hotel at six?", "I'm going to meet Eimear tomorrow at the cinema."], answer: 2 },

      // --- D: Plus: Zeit am Anfang ---
      { type: "gap", section: "D · Zeit am Satzanfang (Plus)", instruction: "Beginne den Satz mit der Zeitangabe. Das Komma ist nicht wichtig.",
        prompt: "We had a picnic in the park on Sunday. → ___",
        solutions: [["On Sunday we had a picnic in the park"]] },
      { type: "gap", prompt: "Declan is going to visit his cousin in Waterford next summer. → ___",
        solutions: [["Next summer Declan is going to visit his cousin in Waterford", "Next summer Declan's going to visit his cousin in Waterford"]] },

      // --- E: eigene Saetze ---
      { type: "text", section: "E · Schreibe zwei Sätze", instruction: "Schreibe zwei ganze Sätze auf Englisch. Achte auf Ort vor Zeit.",
        prompt: "1. Wir haben gestern am Strand ein Picknick gemacht.  2. Ich treffe Sorcha morgen am Bahnhof.", points: 2,
        expected: "We had a picnic on the beach yesterday. I'm going to meet Sorcha at the station tomorrow.",
        focus: "Satz 1: Ort vor Zeit im simple past (on the beach yesterday); Satz 2: going to-future mit Ort vor Zeit (at the station tomorrow). Je Satz 1 Punkt.",
        keywords: ["on the beach yesterday|at the beach yesterday", "at the station tomorrow"] }
    ],
    R: [
      // --- A: Welcher Satz ist richtig? ---
      { type: "choice", section: "A · Ort vor Zeit (G8)", instruction: "Erst der Ort, dann die Zeit. Kreuze den richtigen Satz an.",
        prompt: "Welcher Satz ist richtig?",
        options: ["Eimear waited at the pier on Friday.", "Eimear waited on Friday at the pier.", "Eimear on Friday waited at the pier."], answer: 0 },
      { type: "choice", prompt: "Welcher Satz ist richtig?",
        options: ["We arrived at 6 o'clock at the hotel.", "We arrived at the hotel at 6 o'clock.", "We at the hotel arrived at 6 o'clock."], answer: 1 },
      { type: "choice", prompt: "Welcher Satz ist richtig?",
        options: ["Cormac took the bus last Sunday to Sligo.", "Cormac took the bus to Sligo last Sunday.", "Cormac last Sunday took the bus to Sligo."], answer: 1 },
      { type: "choice", prompt: "Welche Frage ist richtig?",
        options: ["Did you wait last night at the station?", "Did you wait at the station last night?", "Did last night you wait at the station?"], answer: 1 },

      // --- B: zwei Angaben ordnen ---
      { type: "gap", section: "B · Beide Angaben einsetzen", instruction: "Schreibe die beiden Angaben in Klammern in der richtigen Reihenfolge in die Lücke.",
        prompt: "We had lunch ___ (at 1 o'clock / in the café).", solutions: [["in the café at 1 o'clock", "in the cafe at 1 o'clock", "in the café at one o'clock", "in the cafe at one o'clock"]] },
      { type: "gap", prompt: "Declan waited ___ (on Monday / at the corner).", solutions: [["at the corner on Monday"]] },
      { type: "gap", prompt: "We are going to swim ___ (tomorrow / in the sea).", solutions: [["in the sea tomorrow"]] },
      { type: "gap", prompt: "I arrived ___ (last night / at the hostel).", solutions: [["at the hostel last night"]] },

      // --- C: Saetze ordnen ---
      { type: "gap", section: "C · Sätze ordnen", instruction: "Bringe die Wörter in die richtige Reihenfolge und schreibe den ganzen Satz auf.",
        prompt: "I / arrived / at the hostel / on Monday → ___", solutions: [["I arrived at the hostel on Monday"]] },
      { type: "gap", prompt: "the ferry / leaves / from the pier / at 9 o'clock → ___",
        solutions: [["The ferry leaves from the pier at 9 o'clock", "The ferry leaves from the pier at nine o'clock"]] },
      { type: "gap", prompt: "we / are going to / swim / in the sea / tomorrow → ___",
        solutions: [["We are going to swim in the sea tomorrow"]] },

      // --- D: Wie sagst du es? ---
      { type: "choice", section: "D · Wie sagst du es auf Englisch?", instruction: "Denke an die englische Reihenfolge und kreuze an.",
        prompt: "Wir sind gestern in Kinsale angekommen.",
        options: ["We arrived in Kinsale yesterday.", "We arrived yesterday in Kinsale.", "We yesterday arrived in Kinsale."], answer: 0 },
      { type: "choice", prompt: "Ich treffe Declan morgen am Bahnhof.",
        options: ["I'm going to meet Declan tomorrow at the station.", "I'm going to meet Declan at the station tomorrow.", "I'm going to tomorrow meet Declan at the station."], answer: 1 },
      { type: "choice", prompt: "Habt ihr gestern im Café gewartet?",
        options: ["Did you wait in the café yesterday?", "Did you wait yesterday in the café?", "Did yesterday you wait in the café?"], answer: 0 },

      // --- E: ein Satz ---
      { type: "text", section: "E · Schreibe einen Satz", instruction: "Schreibe einen ganzen Satz auf Englisch. Erst der Ort, dann die Zeit.",
        prompt: "Wir haben am Sonntag am See ein Picknick gemacht.", points: 2,
        expected: "We had a picnic at the lake on Sunday.",
        focus: "simple past mit Ort vor Zeit (at the lake on Sunday)",
        keywords: ["at the lake on sunday|by the lake on sunday|near the lake on sunday"] }
    ]
  },

  "u3-gp2": {
    titel: "Grammatikprobe 2 Unit 3 – some, any, no",
    M: [
      // --- A: some oder any ---
      { type: "gap", section: "A · some oder any (G9)", instruction: "Schreibe some oder any. Bejaht: some. Verneint und Frage: any.",
        prompt: "We've got ___ sandwiches for the trip.", solutions: [["some"]] },
      { type: "gap", prompt: "There aren't ___ free seats on the bus.", solutions: [["any"]] },
      { type: "gap", prompt: "Have you got ___ money for the tickets?", solutions: [["any"]] },
      { type: "gap", prompt: "Eimear put ___ apples in the picnic bag.", solutions: [["some"]] },
      { type: "gap", prompt: "Kieran doesn't have ___ brothers or sisters.", solutions: [["any"]] },

      // --- B: no, any, nothing ---
      { type: "gap", section: "B · no oder any? Beide Sätze sagen dasselbe", instruction: "Schreibe das fehlende Wort. Mit no steht kein not im Satz.",
        prompt: "There isn't any space in the van. = There is ___ space in the van.", solutions: [["no"]] },
      { type: "gap", prompt: "We have no tickets left. = We haven't got ___ tickets left.", solutions: [["any"]] },
      { type: "gap", prompt: "I didn't hear anything. = I heard ___.", solutions: [["nothing"]] },

      // --- C: -thing und -body ---
      { type: "gap", section: "C · something, anything, nothing, somebody, anybody, nobody", instruction: "Setze das passende Wort ein.",
        prompt: "There isn't ___ to eat in the new flat.", solutions: [["anything"]] },
      { type: "gap", prompt: "Is there ___ in the garden?", solutions: [["anybody", "anyone"]] },
      { type: "gap", prompt: "I've got ___ for you – a small map of Killarney!", solutions: [["something"]] },
      { type: "gap", prompt: "___ came to the meeting. The room was empty.", solutions: [["Nobody", "No one"]] },
      { type: "gap", prompt: "I can't see ___ from our group at the station.", solutions: [["anybody", "anyone"]] },

      // --- D: Plus: Angebote ---
      { type: "gap", section: "D · Angebote (Plus)", instruction: "Bei Angeboten und Bitten steht auch in der Frage das Wort für „etwas“, das sonst in bejahten Sätzen steht.",
        prompt: "Would you like ___ more soup?", solutions: [["some"]] },

      // --- E: eigene Saetze ---
      { type: "text", section: "E · Schreibe zwei Sätze", instruction: "Ihr macht ein Picknick am See. Schreibe zwei ganze Sätze auf Englisch.",
        prompt: "1. Sage, was ihr dabeihabt (benutze some).  2. Sage, dass ihr kein Wasser dabeihabt (benutze any oder no).", points: 2,
        expected: "We've got some sandwiches and fruit. We haven't got any water.",
        focus: "Satz 1: some im bejahten Satz; Satz 2: any im verneinten Satz mit not oder no ohne not (keine doppelte Verneinung). Je Satz 1 Punkt.",
        keywords: ["some", "any|no"] }
    ],
    R: [
      // --- A: some oder any ---
      { type: "choice", section: "A · some oder any? (G9)", instruction: "Bejaht: some. Verneint und Frage: any. Kreuze an.",
        prompt: "We've got ___ juice for the picnic.", options: ["some", "any", "no"], answer: 0 },
      { type: "choice", prompt: "There aren't ___ chairs in the room.", options: ["some", "any", "no"], answer: 1 },
      { type: "choice", prompt: "Have you got ___ money?", options: ["some", "any", "no"], answer: 1 },
      { type: "choice", prompt: "Brigid bought ___ bread.", options: ["some", "any", "no"], answer: 0 },

      // --- B: some oder any schreiben ---
      { type: "gap", section: "B · Schreibe some oder any", instruction: "Bejaht: some. Verneint und Frage: any.",
        prompt: "There are ___ boxes in my room.", solutions: [["some"]] },
      { type: "gap", prompt: "We haven't got ___ milk.", solutions: [["any"]] },
      { type: "gap", prompt: "Is there ___ cheese in the bag?", solutions: [["any"]] },
      { type: "gap", prompt: "Kieran has ___ good ideas.", solutions: [["some"]] },

      // --- C: -thing und -body ---
      { type: "choice", section: "C · something, anything, nothing, somebody, anybody, nobody", instruction: "Kreuze das passende Wort an.",
        prompt: "I've got ___ for you – a small present!", options: ["something", "anything", "nothing"], answer: 0 },
      { type: "choice", prompt: "There isn't ___ in the fridge.", options: ["anything", "something", "nothing"], answer: 0 },
      { type: "choice", prompt: "Is there ___ at home?", options: ["somebody", "anybody", "nobody"], answer: 1 },
      { type: "choice", prompt: "___ was at the bus stop. It was empty.", options: ["Nobody", "Somebody", "Anybody"], answer: 0 },

      // --- D: no ---
      { type: "gap", section: "D · no oder any?", instruction: "Beide Sätze sagen dasselbe. Schreibe das fehlende Wort.",
        prompt: "There isn't any milk. = There is ___ milk.", solutions: [["no"]] },
      { type: "gap", prompt: "We haven't got any tickets. = We have ___ tickets.", solutions: [["no"]] },

      // --- E: ein Satz ---
      { type: "text", section: "E · Schreibe einen Satz", instruction: "Schreibe einen ganzen Satz auf Englisch. Benutze some und any.",
        prompt: "Sage: Wir haben etwas Obst dabei, aber wir haben kein Brot dabei.", points: 2,
        expected: "We've got some fruit, but we haven't got any bread.",
        focus: "some im bejahten Teil, any im verneinten Teil (oder no ohne not)",
        keywords: ["some", "any|no bread"] }
    ]
  }
};

for (const klasse of ["7M", "7R"]) {
  for (const [key, def] of Object.entries(U3)) {
    const id = `e7${klasse.slice(1).toLowerCase()}-${key}`;
    TESTS[id] = {
      id,
      kind: "probe",
      title: `${klasse} · ${def.titel}`,
      unit: `Englisch ${klasse} / Unit 3`,
      classLevel: klasse,
      level: "7",
      kiThemen: KI_THEMEN_7_U3,
      gradeScale: klasse === "7M" ? "M" : "R",
      items: def[klasse[1]]
    };
  }
}

/* ==================================================================
   Unit 4 - USA - here we come! (Stand 14.11.2026)
   Zwei Grammatikproben je Zug, 16 Punkte, 10 bis 15 Minuten.
   gp1: G10 Steigerung mit more/most und less/least (dazu -er/-est, good/better/best)
   gp2: G11 much/many (How much/How many, too much/too many, so much/so many)
   7R: leichter (mehr Ankreuzen, kuerzere Saetze, ein kurzer offener Teil).
   7M: bildet selbst (Formen und Saetze schreiben, zwei eigene Saetze).
   Schluessel wie Unit 1-3: 7M 50 % = Note 4, 7R 50 % = Note 3.
   ================================================================== */
const KI_THEMEN_7_U4 = [
  "- Steigerung langer Adjektive: more + Adjektiv + than (1. Steigerung), the most + Adjektiv (2. Steigerung); the gehoert zu the most; kein doppeltes Steigern (nicht: more cheaper, the most best)",
  "- less ... than und the least ...: weniger/am wenigsten; geht auch bei kurzen Adjektiven (less dangerous, the least popular)",
  "- Wiederholung kurze Adjektive: -er than / the -est (cheaper, the fastest); Adjektive auf -y: -ier / the -iest (funnier, the funniest); beim Vergleich zweier Dinge than (nicht as)",
  "- unregelmaessig: good - better - the best, bad - worse - the worst",
  "- many bei zaehlbaren Nomen im Plural (How many bags?), much bei nicht zaehlbaren Nomen (How much water?); in bejahten Saetzen meist a lot of / lots of (nicht: We've got much sandwiches)",
  "- too much / too many = zu viel(e), so much / so many = so viel(e); too much/so much + nicht zaehlbar (luggage, food, snow, fun, money, time), too many/so many + Plural",
  "- Fragen: How much/How many + Nomen + do/does bzw. have/has ... (How many days are we here? How much money have you got?)"
];

const U4 = {
  "u4-gp1": {
    titel: "Grammatikprobe 1 Unit 4 – more, most, less, least",
    M: [
      // --- A: Steigerung bilden ---
      { type: "gap", section: "A · Steigern (G10)", instruction: "Schreibe die richtige Form des Adjektivs in Klammern. Kurz: -er/-est. Lang: more/most. Achte auf the.",
        prompt: "A plane is ___ than a bus. (fast)", solutions: [["faster"]] },
      { type: "gap", prompt: "This app is ___ than that app. (popular)", solutions: [["more popular"]] },
      { type: "gap", prompt: "Yosemite is ___ park on our list. (beautiful)", solutions: [["the most beautiful"]] },
      { type: "gap", prompt: "Cody's new phone is ___ than his old phone. (good)", solutions: [["better"]] },
      { type: "gap", prompt: "Zoe is ___ girl in our camp. (funny)", solutions: [["the funniest"]] },

      // --- B: less / least ---
      { type: "gap", section: "B · less und least", instruction: "Schreibe less oder least.",
        prompt: "Walking is ___ tiring than running.", solutions: [["less"]] },
      { type: "gap", prompt: "Of all three sports, golf is the ___ dangerous.", solutions: [["least"]] },
      { type: "gap", prompt: "Our old bus was ___ comfortable than the new bus.", solutions: [["less"]] },

      // --- C: Gegenteil mit less ---
      { type: "gap", section: "C · Dasselbe mit less", instruction: "Schreibe den ganzen Satz so, dass er dasselbe sagt. Benutze less.",
        prompt: "A hotel is more expensive than a hostel. → A hostel is ___",
        solutions: [["A hostel is less expensive than a hotel"]] },
      { type: "gap", prompt: "Football is more popular than golf. → Golf is ___",
        solutions: [["Golf is less popular than football"]] },
      { type: "gap", prompt: "Surfing is more dangerous than swimming. → Swimming is ___",
        solutions: [["Swimming is less dangerous than surfing"]] },

      // --- D: Was ist richtig? ---
      { type: "choice", section: "D · Was ist richtig?", instruction: "Kreuze an.",
        prompt: "Which sentence is correct?",
        options: ["Flying is more cheaper than driving.", "Flying is more expensive than driving.", "Flying is expensiver than driving."], answer: 1 },
      { type: "choice", prompt: "Which sentence is NOT correct?",
        options: ["This is the best app in the shop.", "This is the most good app in the shop.", "This is the cheapest app in the shop."], answer: 1 },
      { type: "choice", prompt: "Das ist der gefährlichste Sport im Camp.",
        options: ["That is the most dangerous sport at the camp.", "That is most dangerous sport at the camp.", "That is the dangerousest sport at the camp."], answer: 0 },

      // --- E: eigene Saetze ---
      { type: "text", section: "E · Schreibe zwei Sätze", instruction: "Schreibe zwei ganze Sätze auf Englisch. Benutze more … than und the most.",
        prompt: "1. Ein Flug nach Hawaii ist teurer als eine Busreise.  2. Yellowstone ist der berühmteste Nationalpark.", points: 2,
        expected: "A flight to Hawaii is more expensive than a bus trip. Yellowstone is the most famous national park.",
        focus: "Satz 1: more expensive than (nicht expensiver, nicht as); Satz 2: the most famous (the nicht vergessen, nicht famousest). Je Satz 1 Punkt.",
        keywords: ["more expensive", "the most famous|the best known|the best-known|the most well-known"] }
    ],
    R: [
      // --- A: Welche Form ist richtig? ---
      { type: "choice", section: "A · Welche Form ist richtig? (G10)", instruction: "Kurz: -er/-est. Lang: more/most. Kreuze an.",
        prompt: "A plane is ___ than a bus.", options: ["faster", "more fast", "most fast"], answer: 0 },
      { type: "choice", prompt: "This app is ___ than that app.", options: ["more popular", "popularer", "most popular"], answer: 0 },
      { type: "choice", prompt: "Yosemite is ___ park on our list.", options: ["the most beautiful", "more beautiful", "the beautifulest"], answer: 0 },
      { type: "choice", prompt: "Cody's new phone is ___ than his old phone.", options: ["gooder", "better", "more good"], answer: 1 },

      // --- B: more, most, less, least ---
      { type: "gap", section: "B · more, most, less oder least", instruction: "Schreibe das fehlende Wort: more, most, less oder least.",
        prompt: "Our bus is ___ comfortable than the train. The train has better seats.", solutions: [["less"]] },
      { type: "gap", prompt: "Skiing is ___ dangerous than golf.", solutions: [["more"]] },
      { type: "gap", prompt: "Golf is the ___ exciting sport at our school. Nobody likes it.", solutions: [["least"]] },
      { type: "gap", prompt: "Nora is the ___ famous singer in our class. Everybody knows her.", solutions: [["most"]] },

      // --- C: Steigerung einsetzen ---
      { type: "gap", section: "C · Schreibe die Form", instruction: "Schreibe die richtige Form des Adjektivs in Klammern. Achte auf the.",
        prompt: "Buses are ___ than taxis. (cheap)", solutions: [["cheaper"]] },
      { type: "gap", prompt: "Surfing is ___ than swimming. (exciting)", solutions: [["more exciting"]] },
      { type: "gap", prompt: "This is ___ train in the USA. (fast)", solutions: [["the fastest"]] },

      // --- D: Wie sagst du es? ---
      { type: "choice", section: "D · Wie sagst du es auf Englisch?", instruction: "Kreuze an.",
        prompt: "Fliegen ist teurer als Autofahren.",
        options: ["Flying is more expensive than driving.", "Flying is more expensive as driving.", "Flying is expensiver than driving."], answer: 0 },
      { type: "choice", prompt: "Das ist die beste App.",
        options: ["This is the most good app.", "This is the best app.", "This is the goodest app."], answer: 1 },
      { type: "choice", prompt: "Golf ist weniger gefährlich als Skifahren.",
        options: ["Golf is less dangerous than skiing.", "Golf is more less dangerous than skiing.", "Golf is least dangerous than skiing."], answer: 0 },

      // --- E: ein Satz ---
      { type: "text", section: "E · Schreibe einen Satz", instruction: "Schreibe einen ganzen Satz auf Englisch. Benutze less … than.",
        prompt: "Eine Busreise ist weniger teuer als ein Flug.", points: 2,
        expected: "A bus trip is less expensive than a flight.",
        focus: "less expensive than (auch cheaper than ist richtig); than nicht vergessen",
        keywords: ["less expensive|cheaper", "than"] }
    ]
  },

  "u4-gp2": {
    titel: "Grammatikprobe 2 Unit 4 – much und many",
    M: [
      // --- A: much oder many ---
      { type: "gap", section: "A · much oder many? (G11)", instruction: "Schreibe much oder many. Zählbar (Plural): many. Nicht zählbar: much.",
        prompt: "How ___ bags have you got?", solutions: [["many"]] },
      { type: "gap", prompt: "We haven't got ___ time before the bus leaves.", solutions: [["much"]] },
      { type: "gap", prompt: "How ___ water do we need for the hike?", solutions: [["much"]] },
      { type: "gap", prompt: "There aren't ___ tickets left for the game.", solutions: [["many"]] },
      { type: "gap", prompt: "Nora doesn't eat ___ meat.", solutions: [["much"]] },

      // --- B: a lot of ---
      { type: "gap", section: "B · much, many oder a lot of?", instruction: "Schreibe much, many oder a lot of. In bejahten Sätzen steht meistens a lot of.",
        prompt: "We've got ___ sandwiches in our bag.", solutions: [["a lot of", "lots of"]] },
      { type: "gap", prompt: "I haven't got ___ homework today.", solutions: [["much"]] },
      { type: "gap", prompt: "Have you got ___ friends in the camp?", solutions: [["many"]] },

      // --- C: too / so ---
      { type: "gap", section: "C · too oder so", instruction: "Schreibe too much, too many, so much oder so many. too = zu viel(e), so = so viel(e).",
        prompt: "There is ___ luggage in the van. We can't close the door. (zu viel)", solutions: [["too much"]] },
      { type: "gap", prompt: "There are ___ people at the beach. We can't find a place. (zu viele)", solutions: [["too many"]] },
      { type: "gap", prompt: "Wow, the park is huge! There are ___ trees here. (so viele)", solutions: [["so many"]] },
      { type: "gap", prompt: "We had ___ fun at the camp! (so viel)", solutions: [["so much"]] },

      // --- D: Fragen bilden ---
      { type: "gap", section: "D · Fragen mit How much / How many", instruction: "Mache aus dem Satz eine Frage. Schreibe die ganze Frage.",
        prompt: "We need a lot of water. → ___",
        solutions: [["How much water do we need"]] },
      { type: "gap", prompt: "There are a lot of tents. → ___",
        solutions: [["How many tents are there"]] },

      // --- E: eigene Saetze ---
      { type: "text", section: "E · Schreibe zwei Sätze", instruction: "Du bist im Summer camp. Schreibe zwei ganze Sätze auf Englisch.",
        prompt: "1. Frage: Wie viele Tage seid ihr im Camp?  2. Sage: Es liegt zu viel Schnee auf dem Berg.", points: 2,
        expected: "How many days are we at the camp? There is too much snow on the mountain.",
        focus: "Satz 1: Frage mit How many + days (Plural), Wortstellung der Frage; Satz 2: too much + snow (nicht zaehlbar, kein too many). Je Satz 1 Punkt.",
        keywords: ["how many days", "too much"] }
    ],
    R: [
      // --- A: much oder many ---
      { type: "choice", section: "A · much oder many? (G11)", instruction: "Zählbar (Plural): many. Nicht zählbar: much. Kreuze an.",
        prompt: "How ___ bags have you got?", options: ["many", "much", "any"], answer: 0 },
      { type: "choice", prompt: "We haven't got ___ time.", options: ["much", "many", "any"], answer: 0 },
      { type: "choice", prompt: "How ___ water do we need?", options: ["much", "many", "any"], answer: 0 },
      { type: "choice", prompt: "There aren't ___ tickets left.", options: ["many", "much", "any"], answer: 0 },

      // --- B: much oder many schreiben ---
      { type: "gap", section: "B · Schreibe much oder many", instruction: "Zählbar (Plural): many. Nicht zählbar: much.",
        prompt: "How ___ days are we here?", solutions: [["many"]] },
      { type: "gap", prompt: "I haven't got ___ money.", solutions: [["much"]] },
      { type: "gap", prompt: "How ___ friends have you got?", solutions: [["many"]] },
      { type: "gap", prompt: "Is there ___ food in the bag?", solutions: [["much"]] },

      // --- C: too / so ---
      { type: "choice", section: "C · too oder so?", instruction: "too = zu viel(e), so = so viel(e). Kreuze an.",
        prompt: "There are ___ people here. We can't move! (zu viele)", options: ["too many", "too much", "so much"], answer: 0 },
      { type: "choice", prompt: "I can't carry the bag. There is ___ luggage in it. (zu viel)", options: ["too much", "too many", "so many"], answer: 0 },
      { type: "choice", prompt: "Wow, there are ___ stars tonight! (so viele)", options: ["so many", "so much", "too much"], answer: 0 },
      { type: "choice", prompt: "We had ___ fun at the camp! (so viel)", options: ["so much", "so many", "too many"], answer: 0 },

      // --- D: a lot of ---
      { type: "gap", section: "D · Bejahter Satz: a lot of", instruction: "In bejahten Sätzen sagt man meistens a lot of. Schreibe a lot of.",
        prompt: "We've got ___ sandwiches.", solutions: [["a lot of", "lots of"]] },
      { type: "gap", prompt: "I've got ___ homework.", solutions: [["a lot of", "lots of"]] },

      // --- E: ein Satz ---
      { type: "text", section: "E · Schreibe eine Frage", instruction: "Schreibe eine ganze Frage auf Englisch. Benutze How much.",
        prompt: "Frage: Wie viel Geld hast du?", points: 2,
        expected: "How much money have you got? (oder: How much money do you have?)",
        focus: "How much + money (nicht zaehlbar); Frage richtig gebildet (have you got / do you have)",
        keywords: ["how much money", "have you got|do you have"] }
    ]
  }
};

for (const klasse of ["7M", "7R"]) {
  for (const [key, def] of Object.entries(U4)) {
    const id = `e7${klasse.slice(1).toLowerCase()}-${key}`;
    TESTS[id] = {
      id,
      kind: "probe",
      title: `${klasse} · ${def.titel}`,
      unit: `Englisch ${klasse} / Unit 4`,
      classLevel: klasse,
      level: "7",
      kiThemen: KI_THEMEN_7_U4,
      gradeScale: klasse === "7M" ? "M" : "R",
      items: def[klasse[1]]
    };
  }
}

// Antwortreihenfolge fest mischen (beim Schreiben steht die richtige Antwort meist an derselben Stelle), siehe proben-mischen.js
require("./proben-mischen").mischeAlle(TESTS);

module.exports = { TESTS };
