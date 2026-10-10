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
   Grammatikprobe Unit 1 (G1 bis G4)
   ================================================================== */
const probeU1 = {
  id: "e9r-u1-probe",
  kind: "probe",
  title: "Grammatikprobe Unit 1",
  unit: "Englisch 9R / Unit 1",
  classLevel: "9R",
  items: [
    // --- A: simple past ---
    { type: "gap", section: "A · Simple past (G1)", instruction: "Setze die Verben im simple past ein.",
      prompt: "Last year my family ___ (travel) to Australia.", solutions: [["travelled", "traveled"]] },
    { type: "gap", prompt: "We ___ (fly) to Sydney first.", solutions: [["flew"]] },
    { type: "gap", prompt: "I ___ (not / eat) any fish at the barbecue.", solutions: [["didn't eat"]] },
    { type: "gap", prompt: "The tour guide ___ (be) very friendly.", solutions: [["was"]] },
    { type: "gap", prompt: "The Dreamtime stories ___ (be) really interesting.", solutions: [["were"]] },
    { type: "gap", prompt: "___ you ___ (see) any koalas?", solutions: [["Did"], ["see"]] },
    { type: "gap", prompt: "Where ___ you ___ (meet) your new friends?", solutions: [["did"], ["meet"]] },

    // --- B: Kurzantworten ---
    { type: "gap", section: "B · Kurzantworten (G1)", instruction: "Gib Kurzantworten. (+) = Yes, (–) = No.",
      prompt: "Were you in Perth? (–) ___", solutions: [["No, I wasn't"]] },
    { type: "gap", prompt: "Did your sister like the outback? (+) ___", solutions: [["Yes, she did"]] },
    { type: "gap", prompt: "Was the weather hot? (+) ___", solutions: [["Yes, it was"]] },

    // --- C: will-future ---
    { type: "gap", section: "C · Will-future (G2)", instruction: "Setze die Verben im will-future ein.",
      prompt: "I hope I ___ (find) a good job after school.", solutions: [["will find"]] },
    { type: "gap", prompt: "Maybe we ___ (visit) the Great Barrier Reef next year.", solutions: [["will visit"]] },
    { type: "gap", prompt: "I'm sure the bus ___ (not be) late.", solutions: [["won't be"]] },
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
    { type: "gap", prompt: "If you ask the coach, he ___ (can give) you a new shirt.", solutions: [["can give"]] },

    // --- F: present progressive ---
    { type: "gap", section: "F · Present progressive (G4)", instruction: "Setze die Verben im present progressive ein.",
      prompt: "Look! The kangaroos ___ (jump) over the road.", solutions: [["are jumping"]] },
    { type: "gap", prompt: "Listen! Somebody ___ (play) the didgeridoo.", solutions: [["is playing"]] },
    { type: "gap", prompt: "Sorry, I can't talk now. I ___ (not sleep), I ___ (study).", solutions: [["am not sleeping"], ["am studying"]] },
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
      prompt: "Wir haben letzte Woche das Museum besucht.", points: 2,
      expected: "We visited the museum last week.", focus: "simple past (visited)",
      keywords: ["visited", "last week"] },
    { type: "text", prompt: "Ich bin sicher, dass der Test morgen nicht schwer sein wird.", points: 2,
      expected: "I'm sure the test won't be difficult tomorrow.", focus: "will-future verneint (won't be)",
      keywords: ["will not be", "tomorrow"] },
    { type: "text", prompt: "Wenn du mir hilfst, bin ich schneller fertig.", points: 2,
      expected: "If you help me, I'll be finished faster. / I'll be finished faster if you help me.",
      focus: "if-clause Typ I: simple present im if-Satz (help), will-future im Hauptsatz (will be)",
      keywords: ["if you help", "will be"] },
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
      prompt: "Ich hoffe, dass wir das Spiel gewinnen.", points: 2,
      expected: "I hope we'll win the game.", focus: "will-future nach I hope (we'll win)",
      keywords: ["i hope", "will win"] }
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
      prompt: "If I ___ (get) home early, I ___ (cook) dinner.", solutions: [["get"], ["will cook"]] },
    { type: "gap", prompt: "If it ___ (not rain), we ___ (go) to the beach.", solutions: [["doesn't rain"], ["will go"]] },
    { type: "gap", prompt: "You ___ (not get) lost if you take a map.", solutions: [["won't get"]] },
    { type: "gap", prompt: "If you feel sick, ___ (stay) in bed!", solutions: [["stay"]] },
    { type: "gap", prompt: "If you heat water to 100 degrees, it ___ (boil).", solutions: [["boils"]] },
    { type: "choice", section: "Was ist richtig?", instruction: "Kreuze an.",
      prompt: "Which sentence is correct?",
      options: ["If it will rain, we stay at home.", "If it rains, we will stay at home.", "If it rain, we will stay at home."], answer: 1 },
    { type: "choice", prompt: "Which sentence is correct?",
      options: ["I'll help you, if I have time.", "I'll help you if I have time.", "I help you if I will have time."], answer: 1 },
    { type: "text", section: "Übersetze", instruction: "Schreibe den Satz auf Englisch.",
      prompt: "Wenn du mich anrufst, kann ich dich abholen.", points: 2,
      expected: "If you call me, I can pick you up.", focus: "if-clause Typ I mit can im Hauptsatz",
      keywords: ["if you call", "can pick"] }
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
    { type: "gap", prompt: "___ you ___ (watch) TV?", solutions: [["Are"], ["watching"]] },
    { type: "gap", prompt: "Who ___ she ___ (text)?", solutions: [["is"], ["texting"]] },
    { type: "gap", section: "Kurzantwort", instruction: "Antworte mit einer Kurzantwort. (+) = Yes",
      prompt: "Are you reading? (+) ___", solutions: [["Yes, I am"]] },
    { type: "choice", section: "Schreibweise", instruction: "Kreuze die richtige -ing-Form an.",
      prompt: "swim + ing = ?", options: ["swiming", "swimming", "swimmming"], answer: 1 },
    { type: "text", section: "Bildbeschreibung", instruction: "Schreibe den Satz auf Englisch.",
      prompt: "Zwei Mädchen sitzen auf einer Bank.", points: 2,
      expected: "Two girls are sitting on a bench.", focus: "present progressive (are sitting)",
      keywords: ["are sitting"] }
  ]
};

/* ==================================================================
   Kurztests Units 2 bis 4 (G5 bis G10) - seit 10.10.2026
   Eigene Saetze, nichts aus dem Schulbuch. G10 (Passiv) prueft vor allem
   das Verstehen - so will es der Lehrplan fuer die Regelklasse.
   ================================================================== */
const ktG5 = {
  id: "e9r-u2-kt-g5",
  kind: "kurztest",
  title: "Kurztest G5 - Simple present",
  unit: "Englisch 9R / Unit 2",
  classLevel: "9R",
  items: [
    { type: "gap", section: "Simple present", instruction: "Setze die Verben im simple present ein.",
      prompt: "My aunt ___ (work) in a small company.", solutions: [["works"]] },
    { type: "gap", prompt: "The workers ___ (start) at seven o'clock.", solutions: [["start"]] },
    { type: "gap", prompt: "He ___ (not / like) early shifts.", solutions: [["doesn't like"]] },
    { type: "gap", prompt: "We ___ (not / sell) plastic bags.", solutions: [["don't sell"]] },
    { type: "gap", prompt: "___ your brother ___ (repair) phones?", solutions: [["Does"], ["repair"]] },
    { type: "gap", prompt: "Where ___ they ___ (deliver) the boxes?", solutions: [["do"], ["deliver"]] },
    { type: "gap", section: "Kurzantwort", instruction: "Antworte mit einer Kurzantwort. (–) = No",
      prompt: "Does the shop open on Sundays? (–) ___", solutions: [["No, it doesn't"]] },
    { type: "choice", section: "Was ist richtig?", instruction: "Kreuze an.",
      prompt: "Which sentence is correct?",
      options: ["She often visits her grandma.", "She visits often her grandma.", "She often visit her grandma."], answer: 0 },
    { type: "text", section: "Übersetze", instruction: "Schreibe den Satz auf Englisch.",
      prompt: "Meine Schwester arbeitet nicht am Samstag.", points: 2,
      expected: "My sister doesn't work on Saturday. / My sister doesn't work on Saturdays.",
      focus: "simple present verneint bei he/she/it (doesn't work)",
      keywords: ["does not work", "saturday|saturdays"] }
  ]
};

const ktG6 = {
  id: "e9r-u2-kt-g6",
  kind: "kurztest",
  title: "Kurztest G6 - Word order",
  unit: "Englisch 9R / Unit 2",
  classLevel: "9R",
  items: [
    { type: "choice", section: "Word order", instruction: "Kreuze den Satz mit der richtigen Wortstellung an.",
      prompt: "Which sentence is correct?",
      options: ["We recycle paper at school every week.", "We recycle at school paper every week.", "We every week recycle paper at school."], answer: 0 },
    { type: "choice", prompt: "Which sentence is correct?",
      options: ["My dad drives carefully to work every morning.", "My dad drives every morning to work carefully.", "My dad drives to work every morning carefully."], answer: 0 },
    { type: "choice", prompt: "Which sentence is correct?",
      options: ["She never eats meat.", "She eats never meat.", "Never she eats meat."], answer: 0 },
    { type: "choice", prompt: "Which sentence is correct?",
      options: ["Every Saturday we sell cakes at the market.", "Every Saturday sell we cakes at the market.", "Every Saturday we sell at the market cakes."], answer: 0 },
    { type: "choice", prompt: "Which question is correct?",
      options: ["Do you often buy second-hand clothes?", "Buy you often second-hand clothes?", "Do often you buy second-hand clothes?"], answer: 0 },
    { type: "text", section: "Bilde Sätze", instruction: "Bringe die Wörter in die richtige Reihenfolge. Schreibe den ganzen Satz.",
      prompt: "in the workshop / the team / every day / repairs / bikes", points: 2,
      expected: "The team repairs bikes in the workshop every day. / Every day the team repairs bikes in the workshop.",
      focus: "Wortstellung: Subjekt – Verb – Objekt – Ort – Zeit (die Zeit darf auch ganz am Anfang stehen)",
      keywords: ["the team repairs bikes in the workshop", "every day"] },
    { type: "text", prompt: "always / my sister / off / the lights / switches", points: 2,
      expected: "My sister always switches off the lights. / My sister always switches the lights off.",
      focus: "Häufigkeitsadverb vor dem Vollverb (always switches)",
      keywords: ["my sister always switches"] },
    { type: "text", section: "Übersetze", instruction: "Schreibe den Satz auf Englisch. Achte auf die Wortstellung.",
      prompt: "Wir treffen unsere Freunde jeden Freitag im Park.", points: 2,
      expected: "We meet our friends in the park every Friday. / Every Friday we meet our friends in the park.",
      focus: "Wortstellung: Objekt vor Ort vor Zeit (our friends – in the park – every Friday)",
      keywords: ["we meet our friends in the park", "every friday"] }
  ]
};

const ktG7 = {
  id: "e9r-u3-kt-g7",
  kind: "kurztest",
  title: "Kurztest G7 - Past progressive",
  unit: "Englisch 9R / Unit 3",
  classLevel: "9R",
  items: [
    { type: "gap", section: "Past progressive", instruction: "Setze die Verben im past progressive ein.",
      prompt: "At eight o'clock I ___ (wait) for the bus.", solutions: [["was waiting"]] },
    { type: "gap", prompt: "The children ___ (play) in the street.", solutions: [["were playing"]] },
    { type: "gap", prompt: "It ___ (not / rain) at that time.", solutions: [["wasn't raining"]] },
    { type: "gap", prompt: "What ___ you ___ (do) when the accident happened?", solutions: [["were"], ["doing"]] },
    { type: "gap", section: "When und while", instruction: "Past progressive oder simple past? Setze die Verben ein.",
      prompt: "I ___ (cross) the road when a car ___ (come) round the corner.", solutions: [["was crossing"], ["came"]] },
    { type: "gap", prompt: "While we ___ (talk), the phone ___ (ring).", solutions: [["were talking"], ["rang"]] },
    { type: "choice", section: "Was ist richtig?", instruction: "Kreuze an.",
      prompt: "Which sentence is correct?",
      options: ["She was riding her bike when she fell.", "She was ride her bike when she fell.", "She were riding her bike when she fell."], answer: 0 },
    { type: "text", section: "Übersetze", instruction: "Schreibe den Satz auf Englisch.",
      prompt: "Ich machte gerade Hausaufgaben, als mein Freund anrief.", points: 2,
      expected: "I was doing my homework when my friend called.",
      focus: "past progressive + when + simple past (was doing … when … called)",
      keywords: ["was doing", "when", "called|phoned|rang"] }
  ]
};

const ktG8 = {
  id: "e9r-u3-kt-g8",
  kind: "kurztest",
  title: "Kurztest G8 - Present perfect with for and since",
  unit: "Englisch 9R / Unit 3",
  classLevel: "9R",
  items: [
    { type: "gap", section: "Present perfect", instruction: "Setze die Verben im present perfect ein.",
      prompt: "I ___ (know) my best friend for ten years.", solutions: [["have known"]] },
    { type: "gap", prompt: "She ___ (live) in this town since 2020.", solutions: [["has lived"]] },
    { type: "gap", prompt: "We ___ (not / see) him since Monday.", solutions: [["haven't seen"]] },
    { type: "gap", prompt: "How long ___ you ___ (have) your dog?", solutions: [["have"], ["had"]] },
    { type: "gap", section: "For oder since?", instruction: "Setze for oder since ein.",
      prompt: "He has played football ___ five years.", solutions: [["for"]] },
    { type: "gap", prompt: "They have been friends ___ last summer.", solutions: [["since"]] },
    { type: "gap", prompt: "I have had this phone ___ my birthday.", solutions: [["since"]] },
    { type: "choice", section: "Was ist richtig?", instruction: "Kreuze an.",
      prompt: "Which sentence is correct?",
      options: ["I have lived here for three years.", "I live here since three years.", "I have lived here since three years."], answer: 0 },
    { type: "text", section: "Übersetze", instruction: "Schreibe den Satz auf Englisch.",
      prompt: "Meine Tante arbeitet seit 2019 im Krankenhaus.", points: 2,
      expected: "My aunt has worked at the hospital since 2019. / My aunt has worked in the hospital since 2019.",
      focus: "present perfect mit since (has worked … since 2019)",
      keywords: ["has worked|has been working", "since 2019"] }
  ]
};

const ktG9 = {
  id: "e9r-u4-kt-g9",
  kind: "kurztest",
  title: "Kurztest G9 - Going to-future",
  unit: "Englisch 9R / Unit 4",
  classLevel: "9R",
  items: [
    { type: "gap", section: "Going to-future", instruction: "Setze die Verben mit going to ein.",
      prompt: "I ___ (apply) for an apprenticeship next year.", solutions: [["am going to apply", "'m going to apply"]] },
    { type: "gap", prompt: "My sister ___ (start) her work experience on Monday.", solutions: [["is going to start", "'s going to start"]] },
    { type: "gap", prompt: "We ___ (not / stay) at home in the holidays.", solutions: [["aren't going to stay", "'re not going to stay"]] },
    { type: "gap", prompt: "___ you ___ (write) your CV tonight?", solutions: [["Are"], ["going to write"]] },
    { type: "gap", prompt: "What ___ he ___ (do) after school?", solutions: [["is"], ["going to do"]] },
    { type: "gap", section: "Kurzantwort", instruction: "Antworte mit einer Kurzantwort. (+) = Yes",
      prompt: "Is she going to join the club? (+) ___", solutions: [["Yes, she is"]] },
    { type: "choice", section: "Was ist richtig?", instruction: "Kreuze an.",
      prompt: "Which sentence is correct?",
      options: ["They are going to visit a factory.", "They going to visit a factory.", "They are going to visiting a factory."], answer: 0 },
    { type: "text", section: "Übersetze", instruction: "Schreibe den Satz auf Englisch. Benutze going to.",
      prompt: "Ich werde nächste Woche ein Praktikum machen.", points: 2,
      expected: "I am going to do work experience next week. / I am going to do an internship next week.",
      focus: "going to-future (am going to do)",
      keywords: ["am going to", "next week"] }
  ]
};

const ktG10 = {
  id: "e9r-u4-kt-g10",
  kind: "kurztest",
  title: "Kurztest G10 - Passive verstehen",
  unit: "Englisch 9R / Unit 4",
  classLevel: "9R",
  items: [
    { type: "choice", section: "Wer tut etwas?", instruction: "Lies den Passivsatz und kreuze an, wer etwas tut.",
      prompt: "The parcels are delivered by a driver. Who delivers the parcels?",
      options: ["a driver", "the parcels", "the customers"], answer: 0 },
    { type: "choice", prompt: "The clubhouse was built by the members. Who built the clubhouse?",
      options: ["the members", "the clubhouse", "a company"], answer: 0 },
    { type: "choice", section: "Gleiche Bedeutung", instruction: "Welcher Satz bedeutet dasselbe? Kreuze an.",
      prompt: "Volunteers clean the beach every month.",
      options: ["The beach is cleaned by volunteers every month.", "The volunteers are cleaned by the beach every month.", "The beach was cleaned by volunteers last month."], answer: 0 },
    { type: "choice", prompt: "A teacher wrote the report.",
      options: ["The report was written by a teacher.", "The report is written by a teacher.", "A teacher was written by the report."], answer: 0 },
    { type: "choice", section: "Gegenwart oder Vergangenheit?", instruction: "Kreuze die richtige Übersetzung an.",
      prompt: "The kiwis were packed by hand.",
      options: ["Die Kiwis wurden von Hand verpackt.", "Die Kiwis werden von Hand verpackt.", "Die Kiwis packen von Hand."], answer: 0 },
    { type: "choice", prompt: "The windows are cleaned every Friday.",
      options: ["Die Fenster werden jeden Freitag geputzt.", "Die Fenster wurden jeden Freitag geputzt.", "Die Fenster putzen jeden Freitag."], answer: 0 },
    { type: "gap", section: "is, are, was oder were?", instruction: "Setze die richtige Form von be ein.",
      prompt: "English ___ spoken in New Zealand.", solutions: [["is"]] },
    { type: "gap", prompt: "The shelves ___ filled every morning.", solutions: [["are"]] },
    { type: "gap", prompt: "The bridge ___ built in 1990.", solutions: [["was"]] },
    { type: "gap", prompt: "The letters ___ sent yesterday.", solutions: [["were"]] }
  ]
};

/* ==================================================================
   Englisch 9M - Unit 1
   Dieselben Aufgaben wie 9R (9M uebernimmt die Grammatikseiten von 9R),
   aber mit M-Zug-Notenschluessel: 50 % = Note 4.
   ================================================================== */
const asM = (t) => ({
  ...t,
  id: t.id.replace(/^e9r-/, "e9m-"),
  unit: "Englisch 9M / Unit 1",
  classLevel: "9M",
  gradeScale: "M"
});
const m9 = [probeU1, ktG1, ktG2, ktG3, ktG4].map(asM);

const TESTS = {
  [probeU1.id]: probeU1,
  [ktG1.id]: ktG1,
  [ktG2.id]: ktG2,
  [ktG3.id]: ktG3,
  [ktG4.id]: ktG4
};
m9.forEach((t) => { TESTS[t.id] = t; });
// Units 2 bis 4 gibt es nur fuer 9R (die 9M-Klassen haben eigene Grammatikseiten)
[ktG5, ktG6, ktG7, ktG8, ktG9, ktG10].forEach((t) => { TESTS[t.id] = t; });

// Antwortreihenfolge fest mischen (beim Schreiben steht die richtige Antwort meist an derselben Stelle), siehe proben-mischen.js
require("./proben-mischen").mischeAlle(TESTS);

module.exports = { TESTS };
