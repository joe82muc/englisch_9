"use strict";

/**
 * Grammatikproben Englisch 8M (Stand 13.10.2026) – je Unit zwei kleine Proben (e8m-u<N>-gp1, -gp2).
 * Laufen über dasselbe Modul wie Englisch 7 und 9 (grammatik9r.js, Routen /api/grammatik9r/...).
 * Aufbau der Aufgaben siehe grammatik9r-daten.js.
 *
 * Auftrag der Lehrkraft: „zwei kleine Grammatikproben pro Unit, nicht zu schwer“, M-Schlüssel (50 % = Note 4).
 * Deshalb: 14 bis 17 Punkte je Probe, fast nur Lücken und Ankreuzen, kurze Sätze, höchstens zwei ganze Sätze zum
 * Schreiben. Passend zu den Grammatik-Seiten 8M/Englisch/unit<N>/grammatik/ (G1 bis G13):
 *   Unit 1  gp1: G1 present perfect mit for/since + G2 simple past     gp2: G3 Adverbien + G4 simple present
 *   Unit 2  gp1: G5 Reflexivpronomen                                   gp2: G6 Satzstellung + G7 simple present für Zukünftiges
 *   Unit 3  gp1: G8 much/many/(a) few/(a) little + G9 going to-future  gp2: G10 Steigerung
 *   Unit 4  gp1: G11 Passiv                                            gp2: G12 Relativsätze + G13 (not) as … as
 * Eigene Sätze, keine Namen und Sätze aus dem Schulbuch.
 */

const KI_THEMEN_8 = [
  "- present perfect: have/has + past participle (richtige 3. Form), for + Zeitspanne, since + Zeitpunkt",
  "- simple past: -ed bzw. richtige unregelmaessige Form, didn't + Grundform, was/were",
  "- Adverbien der Art und Weise: -ly (quickly, carefully, happily), well, fast, hard; Adjektiv vor dem Nomen und nach be",
  "- simple present: s bei he/she/it, don't/doesn't + Grundform, Fragen mit do/does; auch fuer feste Termine in der Zukunft",
  "- Reflexivpronomen: myself, yourself, himself, herself, itself, ourselves, yourselves, themselves",
  "- Satzstellung: Subjekt - Verb - Objekt, Ort vor Zeit, Zeitangabe auch am Satzanfang",
  "- much (nicht zaehlbar) / many (zaehlbar), a little / a few; going to-future: am/is/are + going to + Grundform",
  "- Steigerung: -er/-est, more/most, good-better-best, bad-worse-worst, Vergleich mit than",
  "- Passiv: am/is/are bzw. was/were + past participle, Handelnder mit by",
  "- Relativsaetze: who (Personen), which (Dinge), that (beides); Vergleiche mit (not) as ... as"
];

const gap = (prompt, solutions, kopf) => ({ type: "gap", ...(kopf || {}), prompt, solutions });
const choice = (prompt, options, answer, kopf) => ({ type: "choice", ...(kopf || {}), prompt, options, answer });
const text = (prompt, expected, focus, keywords, kopf) => ({ type: "text", ...(kopf || {}), prompt, points: 2, expected, focus, keywords });
const teil = (section, instruction) => ({ section, instruction });

const PROBEN = {
  /* ================= Unit 1 ================= */
  "u1-gp1": ["Present perfect und simple past", [
    gap("We ___ (live) in this flat for six years.", [["have lived"]], teil("A · Present perfect (G1)", "Setze die Verben im present perfect ein: have/has + 3. Form.")),
    gap("My sister ___ (be) ill since Monday.", [["has been"]]),
    gap("I ___ already ___ (finish) my homework.", [["have"], ["finished"]]),
    gap("Omar ___ (not see) the new film yet.", [["hasn't seen"]]),
    gap("___ you ever ___ (eat) sushi?", [["Have"], ["eaten"]]),

    choice("I have known Lena ___ three years.", ["for", "since"], 0, teil("B · for oder since?", "Kreuze an. Zeitspanne oder Zeitpunkt?")),
    choice("They have lived in New York ___ 2020.", ["for", "since"], 1),
    choice("It has rained ___ this morning.", ["for", "since"], 1),
    choice("We have waited ___ twenty minutes.", ["for", "since"], 0),

    gap("Yesterday we ___ (visit) a museum.", [["visited"]], teil("C · Simple past (G2)", "Setze die Verben im simple past ein.")),
    gap("My parents ___ (go) to Italy last year.", [["went"]]),
    gap("I ___ (not like) the film.", [["didn't like"]]),
    gap("___ you ___ (see) the parade last week?", [["Did"], ["see"]]),
    gap("We ___ (be) very tired after the trip.", [["were"]])
  ]],
  "u1-gp2": ["Adverbien und simple present", [
    choice("Please speak ___.", ["slow", "slowly"], 1, teil("A · Adjektiv oder Adverb? (G3)", "Kreuze an. Wie ist etwas? Oder: Wie tut jemand etwas?")),
    choice("New York is a ___ city.", ["noisy", "noisily"], 0),
    choice("The messenger rides his bike very ___.", ["careful", "carefully"], 1),
    choice("My friend can cook very ___.", ["good", "well"], 1),
    choice("It was an ___ test.", ["easy", "easily"], 0),

    gap("The children played ___ (happy) in the park.", [["happily"]], teil("B · Bilde das Adverb (G3)", "Mach aus dem Adjektiv in der Klammer ein Adverb.")),
    gap("She opened the door ___ (quiet).", [["quietly"]]),
    gap("We work ___ (hard) for the test.", [["hard"]]),
    gap("He answered the question ___ (quick).", [["quickly"]]),

    gap("My brother ___ (take) the bus to school every day.", [["takes"]], teil("C · Simple present (G4)", "Setze die Verben im simple present ein. Denk an das s bei he, she, it.")),
    gap("We often ___ (play) football after school.", [["play"]]),
    gap("Aylin ___ (not like) fish.", [["doesn't like"]]),
    gap("___ your parents ___ (work) on Saturdays?", [["Do"], ["work"]]),
    gap("My best friend ___ (be) from Turkey.", [["is"]]),
    gap("Where ___ your cousin ___ (live)?", [["does"], ["live"]])
  ]],

  /* ================= Unit 2 ================= */
  "u2-gp1": ["Reflexivpronomen", [
    gap("I cut ___ with a knife.", [["myself"]], teil("A · Reflexivpronomen (G5)", "Setze ein: myself, yourself, himself, herself, itself, ourselves, yourselves oder themselves.")),
    gap("My sister taught ___ to play the guitar.", [["herself"]]),
    gap("The boys enjoyed ___ at the party.", [["themselves"]]),
    gap("We made ___ some sandwiches.", [["ourselves"]]),
    gap("The cat washed ___.", [["itself"]]),
    gap("Be careful, Ben! Don't hurt ___.", [["yourself"]]),
    gap("My dad built the garden shed ___.", [["himself"]]),
    gap("Children, please introduce ___.", [["yourselves"]]),

    choice("Can you help ___, please?", ["me", "myself"], 0, teil("B · me oder myself?", "Kreuze an. Ist dieselbe Person gemeint – oder jemand anderes?")),
    choice("I looked at ___ in the mirror.", ["me", "myself"], 1),
    choice("She baked the cake ___. Nobody helped her.", ["her", "herself"], 1),
    choice("My friends saw ___ at the cinema and said hello.", ["me", "myself"], 0),

    text("Wir haben uns im Urlaub gut amüsiert.", "We enjoyed ourselves on holiday.", "Reflexivpronomen ourselves (to enjoy oneself)",
      ["ourselves"], teil("C · Übersetze", "Schreibe den Satz auf Englisch. Benutze das Verb enjoy."))
  ]],
  "u2-gp2": ["Satzstellung und feste Termine", [
    choice("Welcher Satz ist richtig?", ["We flew to Alaska last summer.", "We flew last summer to Alaska.", "We last summer flew to Alaska."], 0,
      teil("A · Satzstellung (G6)", "Kreuze den richtigen Satz an. Denk an: Subjekt – Verb – Objekt, Ort vor Zeit.")),
    choice("Welcher Satz ist richtig?", ["My uncle showed his photos me.", "My uncle showed me his photos.", "My uncle me showed his photos."], 1),
    choice("Welcher Satz ist richtig?", ["I every Saturday play in the park football.", "I play every Saturday football in the park.", "I play football in the park every Saturday."], 2),
    choice("Welcher Satz ist richtig?", ["Yesterday met we our friends at the station.", "Yesterday we met our friends at the station.", "We met yesterday at the station our friends."], 1),
    choice("Welcher Satz ist richtig?", ["The plane landed safely in Munich last night.", "The plane landed last night in Munich safely.", "The plane safely last night landed in Munich."], 0),

    text("last week / visited / we / our grandparents / in Berlin", "We visited our grandparents in Berlin last week.", "Satzstellung: Subjekt – Verb – Objekt – Ort – Zeit (die Zeit darf auch am Anfang stehen)",
      ["we visited our grandparents in berlin"], teil("B · Baue den Satz (G6)", "Bringe die Wörter in die richtige Reihenfolge und schreibe den ganzen Satz.")),
    text("at the airport / my sister / her passport / lost / yesterday", "My sister lost her passport at the airport yesterday.", "Satzstellung: Subjekt – Verb – Objekt – Ort – Zeit (die Zeit darf auch am Anfang stehen)",
      ["my sister lost her passport at the airport"]),

    gap("The train ___ (leave) at 8:15 tomorrow morning.", [["leaves"]], teil("C · Feste Termine in der Zukunft (G7)", "Setze die Verben im simple present ein – so steht es im Fahrplan oder Programm.")),
    gap("Our flight ___ (arrive) in Toronto at 6 p.m.", [["arrives"]]),
    gap("The film ___ (not start) at seven. It starts at eight.", [["doesn't start"]]),
    gap("When ___ the bus ___ (depart)?", [["does"], ["depart"]]),
    gap("School ___ (begin) next Monday.", [["begins"]]),
    gap("The shops ___ (close) at 8 p.m. tonight.", [["close"]])
  ]],

  /* ================= Unit 3 ================= */
  "u3-gp1": ["Mengenangaben und going to-future", [
    choice("How ___ apples do we need?", ["much", "many"], 1, teil("A · much oder many? (G8)", "Kreuze an. Kann man es zählen?")),
    choice("There isn't ___ milk in the fridge.", ["much", "many"], 0),
    choice("We don't have ___ time.", ["much", "many"], 0),
    choice("___ people like pizza.", ["Much", "Many"], 1),

    choice("I have ___ friends in Berlin.", ["a few", "a little"], 0, teil("B · a few oder a little? (G8)", "Kreuze an. ein paar (zählbar) oder ein bisschen (nicht zählbar)?")),
    choice("Can I have ___ water, please?", ["a few", "a little"], 1),
    choice("We need ___ more minutes.", ["a few", "a little"], 0),
    choice("There is only ___ juice left.", ["a few", "a little"], 1),

    gap("I ___ (visit) my aunt next week.", [["am going to visit", "'m going to visit"]], teil("C · going to-future (G9)", "Setze ein: am/is/are + going to + Verb.")),
    gap("My brother ___ (train) as a chef.", [["is going to train", "'s going to train"]]),
    gap("We ___ (not stay) at home on Saturday.", [["aren't going to stay", "'re not going to stay"]]),
    gap("___ you ___ (watch) the match tonight?", [["Are"], ["going to watch"]]),
    gap("What ___ they ___ (do) after school?", [["are"], ["going to do"]]),
    gap("Are you going to come to the party? – Yes, I ___.", [["am"]])
  ]],
  "u3-gp2": ["Adjektive steigern", [
    gap("A train is ___ (fast) than a bike.", [["faster"]], teil("A · Steigerungsformen (G10)", "Setze das Adjektiv in der richtigen Form ein.")),
    gap("This is the ___ (good) pizza in town.", [["best"]]),
    gap("English is ___ (easy) than maths.", [["easier"]]),
    gap("This film is ___ (interesting) than the last one.", [["more interesting"]]),
    gap("It is the ___ (expensive) phone in the shop.", [["most expensive"]]),
    gap("The weather is ___ (bad) than yesterday.", [["worse"]]),
    gap("August is the ___ (hot) month here.", [["hottest"]]),
    gap("Our dog is ___ (big) than yours.", [["bigger"]]),

    choice("Rafting is ___ than swimming.", ["excitinger", "more exciting", "most exciting"], 1, teil("B · Was ist richtig?", "Kreuze an.")),
    choice("Who is the ___ student in your class?", ["taller", "most tall", "tallest"], 2),
    choice("My bag is heavier ___ yours.", ["than", "as", "then"], 0),
    choice("This is the ___ day of my life!", ["happyest", "happiest", "most happy"], 1),

    text("Mein Bruder ist älter als ich.", "My brother is older than me. / My brother is older than I am.", "Steigerung mit -er und than",
      ["older than"], teil("C · Übersetze", "Schreibe den Satz auf Englisch."))
  ]],

  /* ================= Unit 4 ================= */
  "u4-gp1": ["Das Passiv", [
    gap("English ___ (speak) in Canada.", [["is spoken"]], teil("A · Passiv im simple present (G11)", "Setze ein: am/is/are + 3. Form.")),
    gap("Many photos ___ (share) online every day.", [["are shared"]]),
    gap("Maple syrup ___ (make) from the sap of trees.", [["is made"]]),
    gap("These apps ___ (use) by millions of people.", [["are used"]]),

    gap("Our school ___ (build) in 1995.", [["was built"]], teil("B · Passiv im simple past (G11)", "Setze ein: was/were + 3. Form.")),
    gap("The photos ___ (take) in Toronto.", [["were taken"]]),
    gap("The email ___ (send) yesterday.", [["was sent"]]),
    gap("The tickets ___ (sell) last week.", [["were sold"]]),

    choice("This video ___ by a student.", ["made", "was made", "is make"], 1, teil("C · Was ist richtig?", "Kreuze an.")),
    choice("Ice hockey ___ in many countries.", ["is played", "plays", "is play"], 0),
    choice("The book was written ___ a Canadian author.", ["from", "of", "by"], 2),
    choice("I ___ in Munich.", ["am born", "was born", "born"], 1),

    text("Diese Autos werden in Kanada gebaut.", "These cars are built in Canada.", "Passiv im simple present: are + 3. Form (built)",
      ["are built|are made|are produced"], teil("D · Übersetze", "Schreibe den Satz auf Englisch. Benutze das Passiv."))
  ]],
  "u4-gp2": ["Relativsätze und Vergleiche", [
    choice("A vet is someone ___ helps sick animals.", ["who", "which"], 0, teil("A · who oder which? (G12)", "Kreuze an. Person oder Sache?")),
    choice("This is the app ___ I use every day.", ["who", "which"], 1),
    choice("The girl ___ lives next door is from Canada.", ["who", "which"], 0),
    choice("Hockey is a sport ___ is very popular in Canada.", ["who", "which"], 1),
    choice("I have a friend ___ speaks three languages.", ["who", "which"], 0),

    text("This is the boy. He won the race.", "This is the boy who won the race.", "Relativsatz mit who (oder that) für eine Person",
      ["boy who won|boy that won"], teil("B · Verbinde die Sätze (G12)", "Mach aus zwei Sätzen einen – mit who oder which.")),
    text("I like films. They make me laugh.", "I like films which make me laugh.", "Relativsatz mit which (oder that) für eine Sache",
      ["films which make|films that make"]),

    gap("Ben is 1.60 m. Omar is 1.60 m, too. Ben is ___ tall ___ Omar.", [["as"], ["as"]], teil("C · Vergleiche (G13)", "Ergänze den Vergleich.")),
    gap("A bike is not ___ fast ___ a car.", [["as"], ["as"]]),

    choice("My sister is ___ I am.", ["as older as", "as old as", "so old than"], 1, teil("D · Was ist richtig?", "Kreuze an.")),
    choice("This phone is not as expensive ___ that one.", ["than", "like", "as"], 2),
    choice("A horse is bigger ___ a dog.", ["than", "as", "then"], 0)
  ]]
};

const TESTS = {};
for (const [key, [thema, items]] of Object.entries(PROBEN)) {
  const [, unit, nr] = /^u(\d)-gp(\d)$/.exec(key);
  const id = `e8m-${key}`;
  TESTS[id] = {
    id,
    kind: "probe",
    title: `8M · Unit ${unit} · Grammatikprobe ${nr} - ${thema}`,
    unit: `Englisch 8M / Unit ${unit}`,
    classLevel: "8M",
    level: "8",
    kiThemen: KI_THEMEN_8,
    gradeScale: "M",
    items
  };
}

// Antwortreihenfolge fest mischen (beim Schreiben steht die richtige Antwort sonst oft an derselben Stelle), siehe proben-mischen.js
require("./proben-mischen").mischeAlle(TESTS);

module.exports = { TESTS };
