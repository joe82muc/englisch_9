"use strict";

/**
 * Englisch 9M · Probe 4: Unit 4 – News from New Zealand (Mittlere-Reife-Klasse)
 * Teile: A Listening (12) · B Reading (12) · C Grammar and vocabulary (14) · D Mediation (8) · E Writing (14) = 60 Punkte,
 * 60 Minuten. Grammatik der Unit (M9): going to-future, simple past, Passiv im simple present und simple past
 * selbst bilden (Aussage, Verneinung, Frage, auch mit by; Aktiv -> Passiv). Wortschatz: Berufe, Bewerbung, Praktikum,
 * Kollokationen und phrasal verbs.
 * LehrplanPLUS E9 (M): 1.1 Hörverstehen, 1.2 Leseverstehen, 1.4 Schreiben, 1.5 Sprachmittlung, 2 Wortschatz und Grammatik.
 * Alle Texte eigenständig für GRUMI erstellt, nichts aus Schulbuch, Prüfungen, Lernmodulen oder der R-Probe p4.js.
 * Variante A: Anruf beim Jugend-Rettungsschwimmverein (Hören: Rua, Mrs Kerr, Oyster Cove Surf Life Saving Club),
 * Praktikumsbericht aus einem Radiosender (Lesen: Greta, Mr Ormond, Maren, Bay FM in Otter Bay), englischer Aushang eines
 * Vogelschutzgebiets (Sprachmittlung Englisch -> Deutsch an "deine Mutter": Heron Marsh Bird Sanctuary, Ms Park),
 * Bewerbung um einen Praktikumsplatz in einer Zahnarztpraxis (Schreiben: Cape Harrow Dental Care).
 * Variante B: Berufsberatung für eine angehende Notfallsanitäterin (Hören: Cora, Mr Donnelly, Northgate College, Hartley Bridge),
 * Zeitungsartikel über einen Dünenschutz-Verein (Lesen: Caleb, Mrs Pearce, Mr Tait, Dune Keepers, Rimu Point), deutscher
 * Aushang eines Imkervereins (Sprachmittlung Deutsch -> Englisch an Tilda: Imkerverein Lindenau, Frau Hartmann),
 * Praktikumsbericht fürs Schulmagazin (Schreiben: Lantern Theatre in Marrowby).
 * Erfundene Orte und Firmen: Oyster Cove, Otter Bay, Bay FM, Heron Marsh, Cape Harrow Dental Care, Northgate College,
 * Hartley Bridge, Rimu Point, Dune Keepers, Imkerverein Lindenau, Lantern Theatre, Marrowby.
 * Bleibt auf dem Server (Lösungen und Erwartungshorizont). Bausteine: bau.js.
 */
const { c, m, o, f, feld, z, a, kr, s, text, hoertext, teil, probeM } = require("./bau");

const HINWEIS = "Work on your own. Part A: your teacher plays the recording twice – read the tasks first. Read every task carefully. Arbeite allein. Den Hörtext spielt deine Lehrkraft zweimal für alle ab. Nach der Abgabe kannst du nichts mehr ändern.";

/* ------------------------------ Variante A ------------------------------ */
const A_HOEREN = hoertext("h1", "Joining the lifeguards", "Listening: a phone call to a club", [
  ["Mrs Kerr", "Oyster Cove Surf Life Saving Club, Mrs Kerr speaking."],
  ["Rua", "Hello, Mrs Kerr. My name is Rua Pene. I'm calling because I'd like to join the junior lifeguards. I saw your poster at the library, and, um, I think I'd be good at it because I swim every week."],
  ["Mrs Kerr", "That's great, Rua. How old are you?"],
  ["Rua", "I'm fourteen, but I'll be fifteen in December. Is that a problem?"],
  ["Mrs Kerr", "No, not at all. Our juniors are between twelve and sixteen. Have you got a certificate for swimming?"],
  ["Rua", "Well, I did the test at school, but nobody gave me a piece of paper."],
  ["Mrs Kerr", "Don't worry. We'll test you ourselves on your first evening. Training takes place on Tuesday and Thursday evenings."],
  ["Rua", "Sorry, I thought it was on Saturday mornings. My cousin told me that."],
  ["Mrs Kerr", "Ah, no. Saturday is for the older members. The juniors are taught by our coaches in the evenings, from half past five until seven."],
  ["Rua", "I see. Thank you. And is it expensive? My mum wants to know."],
  ["Mrs Kerr", "The fee is sixty dollars for the whole season. That includes a red cap and the club T-shirt, which are given to every new member."],
  ["Rua", "That's fine. Do I need my own board?"],
  ["Mrs Kerr", "Not at all. The boards belong to the club, and they are checked by our coaches every week. You only need a towel, warm clothes and a bottle of water, because the sea might be cold."],
  ["Rua", "To be honest, I'm a bit nervous. What if I can't keep up with the others?"],
  ["Mrs Kerr", "You'll be put into a small group with two or three other beginners, so you won't be alone."],
  ["Rua", "That helps. When can I come?"],
  ["Mrs Kerr", "Come this Thursday. Oh wait, that's the day of our club barbecue, so let's say next Tuesday instead. Please be at the red door at twenty-five past five and ask for me."],
  ["Rua", "Next Tuesday at twenty-five past five. Great. Thanks a lot, Mrs Kerr."],
  ["Mrs Kerr", "You're welcome, Rua. See you then."]
], { stimmen: { "Mrs Kerr": "en-GB-SoniaNeural", Rua: "en-GB-RyanNeural" }, mal: 2 });

const A_LESEN = text("t1", "A week at Bay FM", "Report on work experience", [
  "Last March I spent a week at Bay FM, a small radio station in Otter Bay. I wanted to find out whether I might enjoy a job in the media, although I am a very shy person and I hate the sound of my own voice. My teacher arranged the place, so that I did not have to look for it myself, and the station manager, Mr Ormond, was waiting for me at the door on Monday morning.",
  "On the first day I was introduced to the team of six people. The morning show is presented by Maren, who has worked at the station for ten years. While she was talking to the listeners, I sat in the studio and watched the screens. I was surprised because the music is not chosen by the presenters. It is selected by a computer program, and the presenters only decide when to talk.",
  "My first task was to write the weather report. The facts were sent to me by the weather office every hour, and I had to turn them into three short sentences. That sounded easy, but it was not. My first report was rejected by Maren because it was far too long. \"Listeners do not want a lecture,\" she said. \"They want to know whether to take an umbrella.\" After that I wrote shorter sentences.",
  "On Wednesday something went wrong. The microphone stopped working just before the news, and I felt panic. Luckily Maren stayed calm. She changed the cable, and the news started only one minute late. I learnt that you must always check the equipment first, because small problems may become big ones very quickly.",
  "On Thursday I was allowed to record a short interview with a local baker about his new shop. I was so nervous that my hands shook while I was holding the microphone. Although I made two mistakes, the interview was played on the radio on Friday morning. My mother heard it in the car, and she called me immediately.",
  "I am not going to become a presenter, because I still prefer to work in the background. But I enjoyed the week much more than I had expected. I might look for a part-time job in an office where I can write texts. My advice to other students: choose a place that is a bit scary, so that you can learn something new about yourself."
]);

const A_ANZEIGE = "Heron Marsh Bird Sanctuary – Volunteer Weekend. Do you like being outdoors? Join us on the first weekend of November and help us to look after the sanctuary. On Saturday, from 9 am to 3 pm, the volunteers will repair the wooden paths and clean the bird hides. On Sunday morning we will plant reeds at the edge of the lake. Volunteers must be at least 14 years old, and everybody under 16 needs a form signed by a parent. Please wear boots and bring waterproof clothes. Lunch and hot drinks are provided free of charge, but there is no bus service, so please arrange your own transport. The sanctuary was founded by local farmers and now has a small shop with postcards and books. To sign up, send an email to Ms Park by 20 October.";

const m4a = probeM(4, "A", {
  title: "Test 4 (M9): News from New Zealand", kurz: "Unit 4", scope: "Unit 4 · Listening, Reading, Grammar and vocabulary, Mediation, Writing", minutes: 60, hinweis: HINWEIS,
  texte: [A_HOEREN, A_LESEN],
  items: [
    ...teil("A Listening", [
      c("Why does Rua think he would be a good junior lifeguard?", ["He swims every week.", "He has a swimming certificate.", "He has worked at the beach before."], 0, { text: "h1" }),
      c("When do the juniors train?", ["on Tuesday and Thursday evenings", "on Saturday mornings", "on Thursday afternoons"], 0, { text: "h1" }),
      c("What is included in the fee?", ["a cap and a T-shirt", "a board and a rescue tube", "a towel and a bottle of water"], 0, { text: "h1" }),
      c("How does Rua feel at the end of the call?", ["less nervous than at the start", "angry about the fee", "bored by all the questions"], 0, { text: "h1" }),
      f("Listen again and complete the notes. Write one word or a number.", [
        feld("Juniors are aged twelve to …", ["sixteen", "16"]),
        feld("Fee for the whole season: … dollars", ["sixty", "60"]),
        feld("Training lasts from half past five until … o'clock.", ["seven", "7"]),
        feld("Rua must bring a towel, warm clothes and a bottle of …", ["water", "a bottle of water"]),
        feld("Rua's first evening: next …", ["Tuesday", "tuesday"])
      ], { text: "h1", tolerant: true, hinweis: "Lies vor dem Hören die Notizen: Dann weißt du, auf welche Zahl oder welches Wort du achten musst. Achte auf Korrekturen im Gespräch." }),
      o("What do they talk about first, next and last? Put the topics in the right order.", ["Rua's age and his swimming test", "the training times and the fee", "the date of Rua's first evening"], { text: "h1" })
    ]),
    ...teil("B Reading", [
      c("Greta wrote this report. How did she get her work experience place?", ["Her teacher arranged it.", "She wrote an application.", "Her mother knew the manager."], 0, { text: "t1" }),
      c("What went wrong on Wednesday?", ["The microphone stopped working.", "The news was cancelled.", "Maren was late for work."], 0, { text: "t1" }),
      c("What does the last paragraph show about Greta's week?", ["She liked it, although she does not want to be a presenter.", "She hated it and wants to forget it.", "She wants to work at Bay FM next year."], 0, { text: "t1" }),
      z("In which lines does Greta say how the music at Bay FM is chosen?", "t1", [[12, 14]], { hinweis: "Suche das Schlüsselwort aus der Frage (music) im Text und lies dort genau." }),
      z("In which lines does the text say what happened to Greta's first weather report?", "t1", [[18, 21]], { hinweis: "Suche im Text die Wörter weather report." }),
      f("Complete the notes about the report. Write one word or a number.", [
        feld("Bay FM is a small radio station in … Bay.", ["Otter"]),
        feld("The team has … people.", ["six", "6"]),
        feld("Maren has worked at the station for … years.", ["ten", "10"]),
        feld("Greta recorded an interview with a local …", ["baker", "a baker"])
      ], { text: "t1", tolerant: true }),
      a("Greta says she learnt something during her week. Give two things she learnt. Answer in English.", [
        kr("eine Sache, die Greta gelernt hat", 1, "zum Beispiel: Reports must be short and clear. / You must always check the equipment first. / She prefers to work in the background. / It is good to try something a bit scary."),
        kr("eine zweite, andere Sache, die Greta gelernt hat", 1, "eine andere der Sachen"),
        kr("verständlich auf Englisch (eigene Worte oder passende Wörter aus dem Text; Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
      ], "She learnt that a report must be short, and that you must always check the equipment first.", ["short|shorter|report|lecture", "equipment|check|microphone|background|scary"], { text: "t1", zeilen: [15, 39] })
    ]),
    ...teil("C Grammar and vocabulary", [
      f("Complete the sentences. Use the passive voice, going to or the simple past.", [
        feld("Every morning the classroom (clean) … by the caretaker.", ["is cleaned"]),
        feld("The match (not / cancel) … yesterday, although it rained.", ["was not cancelled", "wasn't cancelled", "wasn’t cancelled", "was not canceled", "wasn't canceled", "wasn’t canceled"]),
        feld("Where (the boats / keep) … every winter?", ["are the boats kept", "Are the boats kept"]),
        feld("(you / be going to / apply) … for the job?", ["are you going to apply", "Are you going to apply"]),
        feld("We (not / be going to / stay) … long at the party tonight.", ["are not going to stay", "aren't going to stay", "aren’t going to stay", "'re not going to stay", "’re not going to stay"]),
        feld("Why (Owen / leave) … the club so early last night?", ["did Owen leave", "Did Owen leave"])
      ], { hinweis: "Passiv: am / is / are oder was / were + 3. Form (Partizip). going to: am / is / are + going to + Grundform. Verneinung und Frage im simple past mit did + Grundform." }),
      c("Which is the correct passive form of \"The council built the new pier last year.\"?", ["The new pier was built by the council last year.", "The new pier is built by the council last year.", "The new pier was build by the council last year."], 0),
      c("Sandwiches … by the volunteers every Friday.", ["are made", "is made", "are making"], 0),
      c("Which passive question is correct?", ["When was the bridge repaired?", "When was the bridge repair?", "When did the bridge repaired?"], 0),
      f("Change the sentences into the passive voice. Use by.", [
        feld("The volunteers plant trees every spring.  →  Trees …", ["Trees are planted by the volunteers every spring", "Trees are planted by the volunteers every spring.", "are planted by the volunteers every spring", "Trees are planted every spring by the volunteers", "are planted every spring by the volunteers"]),
        feld("The storm destroyed the old boat shed.  →  The old boat shed …", ["The old boat shed was destroyed by the storm", "The old boat shed was destroyed by the storm.", "was destroyed by the storm", "was destroyed by the storm."])
      ], { hinweis: "Das Objekt des Aktivsatzes wird zum Subjekt. Die Zeit bleibt gleich: Präsens → is / are + 3. Form, simple past → was / were + 3. Form." }),
      m("Match the expressions with their meanings.", [["to fill in", "to write the information in a form"], ["to take part in", "to be one of the people who do an activity"], ["to make an appointment", "to arrange a time to meet somebody"]])
    ]),
    ...teil("D Mediation", [
      a("You are on holiday in New Zealand with your mother. She does not speak English. Your brother Jasper (15) would like to join a volunteer weekend. Read the notice and tell your mother in German what she needs to know (5 to 7 sentences). Do not translate word for word.", [
        kr("Wann: erstes Novemberwochenende, Samstag ganztags (9 bis 15 Uhr), Sonntagvormittag", 1, "Wochenende im November und mindestens ein Tag/eine Zeit genannt"),
        kr("Aufgaben: Wege reparieren, Beobachtungshütten putzen, Schilf pflanzen", 1, "mindestens eine Aufgabe sinngemäß genannt"),
        kr("Alter und Erlaubnis: ab 14 Jahren; unter 16 braucht Jasper ein von einem Elternteil unterschriebenes Formular", 2, "2 Punkte: Mindestalter und Formular der Eltern · 1 Punkt: nur eines davon (Jasper ist 15, also braucht er das Formular)"),
        kr("Mitbringen: Stiefel und wasserdichte Kleidung", 1, "mindestens eines von beidem"),
        kr("Essen kostenlos, aber Anreise selbst organisieren (kein Bus)", 1, "beide Teile sinngemäß; Essen/Getränke gratis UND eigene Anreise"),
        kr("Anmeldung per E-Mail bis 20. Oktober", 1, "die Frist (20. Oktober) oder der Weg (E-Mail an Ms Park) ist genannt – eines genügt für den Punkt"),
        kr("Sprachmittlung: verständliches Deutsch für die Mutter, nicht Wort für Wort; Unwichtiges (Gründung durch Landwirte, Laden mit Postkarten) fehlt", 1)
      ], "Mama, das ist ein Freiwilligen-Wochenende in einem Vogelschutzgebiet, am ersten Wochenende im November. Am Samstag von 9 bis 15 Uhr werden Wege repariert und Beobachtungshütten geputzt, am Sonntagvormittag wird Schilf gepflanzt. Man muss mindestens 14 sein, und weil Jasper noch keine 16 ist, braucht er ein Formular, das du unterschreibst. Er soll Stiefel und wetterfeste Kleidung mitbringen. Essen und Getränke sind kostenlos, aber wir müssen selbst hinkommen, denn es fährt kein Bus. Anmelden kann man sich per E-Mail bis zum 20. Oktober.",
      ["november|wochenende", "samstag|sonntag|9|15", "weg|hütte|schilf|reparier|putz|pflanz", "14|16|alter", "formular|unterschrift|unterschrei|eltern", "stiefel|wasserdicht|wetterfest|regen", "kostenlos|gratis|umsonst|essen", "bus|anreise|hinkommen|transport", "e-mail|mail|20|oktober"], { vorgabe: A_ANZEIGE })
    ]),
    ...teil("E Writing", [
      s("You see this advert: \"Cape Harrow Dental Care: work experience places for students aged 15 and older. Two weeks in March. You help at the reception, prepare the rooms and talk to patients. You must be calm, friendly and tidy.\" Write a formal application email (90 to 120 words). Use paragraphs and linking words (for example because, although, so that). Say why you are writing · who you are (age, school) · what experience you have had (simple past) · what your strengths are · what you are going to learn or do there (going to) · when you are free, and end politely.", [
        kr("Inhalt", 5, "je Punkt 1 (fünf von sechs Punkten genügen für die volle Punktzahl): Grund des Schreibens (Anzeige, Praktikum) · Alter und Schule · Erfahrung (simple past) · Stärken · Pläne/Aufgaben (going to) · wann Zeit ist und höflicher Wunsch auf Antwort"),
        kr("Textsorte und Aufbau", 2, "formelle Anrede (Dear Sir or Madam / Dear Mr or Ms …) und Schlussformel (Yours faithfully / Yours sincerely / Kind regards); Absätze mit sinnvoller Reihenfolge; Verbindungswörter (because, although, so that, also, finally) und höflicher Ton"),
        kr("Grammatik", 3, "going to für Pläne, simple past für Erfahrungen, richtiger Satzbau mit Nebensätzen; Fehler stören das Verstehen kaum"),
        kr("Wortschatz", 2, "passende Wörter für Bewerbung, Stärken und Berufe (reliable, calm, skills, to apply for, work experience, patients), nicht nur good und nice"),
        kr("Rechtschreibung", 2, "häufige Wörter und die Wörter der Unit sind meist richtig geschrieben", { rs: true })
      ], { minWoerter: 90, plan: [
        { id: "greeting", label: "Greeting", hilfe: "Dear Sir or Madam," },
        { id: "why", label: "Why I am writing and who I am", hilfe: "I am writing because I saw your advert … I am … years old and I go to …" },
        { id: "experience", label: "My experience", hilfe: "simple past: I helped … / I worked …" },
        { id: "skills", label: "My strengths", hilfe: "I am calm and … because …" },
        { id: "plans", label: "What I am going to learn or do", hilfe: "I am going to …" },
        { id: "ending", label: "When I am free and ending", hilfe: "I am free in March. I look forward to hearing from you. / Yours faithfully," }
      ] })
    ])
  ]
});

/* ------------------------------ Variante B ------------------------------ */
const B_HOEREN = hoertext("h1", "A job in an ambulance", "Listening: a talk with a careers adviser", [
  ["Mr Donnelly", "Come in, Cora, and take a seat. Your form teacher says you have a question about jobs in health care."],
  ["Cora", "Yes, Mr Donnelly. I'd like to become a paramedic, but, well, I'm not really sure what the training is like."],
  ["Mr Donnelly", "Why a paramedic? Most students your age say doctor or nurse."],
  ["Cora", "Last summer my neighbour fell off a ladder, and an ambulance was called by my aunt. The paramedics were so calm and kind that I couldn't stop thinking about them afterwards."],
  ["Mr Donnelly", "That's a good reason. First you finish school, and then you apply to Northgate College for the course."],
  ["Cora", "My cousin said it takes four years."],
  ["Mr Donnelly", "Not quite. The course itself takes three years. After that you do a year of paid work at an ambulance station."],
  ["Cora", "Oh, I see. Is it hard to get a place?"],
  ["Mr Donnelly", "Every year about forty students are accepted, but more than a hundred apply. Good marks in biology and English are needed, and you must pass a fitness test."],
  ["Cora", "Fitness is no problem. I run three times a week. But I'm worried about biology. My last test was a disaster."],
  ["Mr Donnelly", "Don't be too hard on yourself. One bad mark is not the end of the world. A free tutoring group is offered by the school on Wednesday afternoons. Why don't you go?"],
  ["Cora", "I didn't know that. I'll go next week, I promise."],
  ["Mr Donnelly", "Good. And I have another idea. The ambulance station at Hartley Bridge holds an open day next month. You could ask the crews your questions there and even sit in an ambulance."],
  ["Cora", "That sounds brilliant! I'm so excited. Do I have to book?"],
  ["Mr Donnelly", "Yes, please send an email to the station by the end of this week. I'll write down the address for you, and you can take a friend with you."],
  ["Cora", "Perfect. Thank you so much for your help."],
  ["Mr Donnelly", "You're welcome. Come back and see me when you have your results, and we'll talk about your next steps."]
], { stimmen: { "Mr Donnelly": "en-US-GuyNeural", Cora: "en-GB-LibbyNeural" }, mal: 2 });

const B_LESEN = text("t1", "Keeping the dunes alive", "Newspaper article", [
  "On the first Sunday of every month the beach at Rimu Point looks different from the rest of the week. Instead of surfers and dog walkers, there are about forty people in gloves and old boots, carrying small plants in plastic trays. They belong to the Dune Keepers, a club that was started eight years ago by a few neighbours who were worried about the sand.",
  "The dunes protect the houses behind them from storms, but they are easily damaged. Footpaths made by walkers cut through the plants, and then the wind carries the sand away. Dune grass is planted by the club to hold the sand together. \"One plant looks like nothing,\" says the chairwoman, Mrs Pearce. \"But after two years the roots form a net under the sand.\"",
  "Fifteen-year-old Caleb joined last winter because his school asked every student to do some community work. \"I thought it would be boring,\" he admits. \"Although I am still not a fan of getting up early, I now look forward to Sundays.\" Caleb has a special job: he makes the wooden signs that tell walkers to stay on the path. While he paints them, he listens to the stories of an older member, Mr Tait, who remembers the beach when the dunes were twice as high.",
  "The plants are grown by the members in their gardens, so that the club does not have to buy them. The seeds are collected from the beach in autumn, and in spring the young plants are carried back in trays. Each tray is marked with the name of its grower, which leads to a friendly competition about whose plants grow best.",
  "Not everybody likes the signs, however. A few surfers say that the new path to the water is too long, and some walkers simply ignore the rules. Mrs Pearce understands the problem. \"We cannot force anybody,\" she says. \"But we may be able to change their minds if they see how much work is put into every metre.\"",
  "Next spring the club is going to extend the planting to the south end of the beach. Volunteers are needed, and no experience is required. \"You might get cold hands and wet knees,\" says Caleb with a smile, \"but you will go home knowing that you helped to protect the beach.\""
]);

const B_AUSHANG = "Imkerverein Lindenau e. V. – Schnupperkurs Imkern für Jugendliche. Möchtest du wissen, wie Honig entsteht? An drei Samstagen im Mai zeigen wir Jugendlichen ab 13 Jahren, wie man mit Bienen arbeitet. Treffpunkt ist jeweils um zehn Uhr am Vereinsgarten hinter der alten Mühle, der Kurs dauert bis zum Mittag. Schutzanzüge und Handschuhe stellt der Verein, ihr braucht nur feste Schuhe und gute Laune mitzubringen. Der Kurs ist kostenlos, nur wer am Ende ein eigenes Glas Honig mitnehmen möchte, zahlt fünf Euro. Wichtig: Wer allergisch gegen Bienenstiche ist, darf leider nicht teilnehmen. Im Herbst feiert der Verein sein hundertjähriges Bestehen mit einem großen Fest. Anmeldung bei Frau Hartmann bis Ende April.";

const m4b = probeM(4, "B", {
  title: "Test 4 (M9): News from New Zealand", kurz: "Unit 4", scope: "Unit 4 · Listening, Reading, Grammar and vocabulary, Mediation, Writing", minutes: 60, hinweis: HINWEIS,
  texte: [B_HOEREN, B_LESEN],
  items: [
    ...teil("A Listening", [
      c("Why does Cora want to become a paramedic?", ["The paramedics who helped her neighbour were calm and kind.", "Her aunt works as a paramedic.", "Her form teacher told her to do it."], 0, { text: "h1" }),
      c("How long does the course at Northgate College take?", ["three years", "four years", "two years"], 0, { text: "h1" }),
      c("What is Cora worried about?", ["her biology marks", "the fitness test", "her English lessons"], 0, { text: "h1" }),
      c("How does Cora feel at the end of the talk?", ["hopeful and excited", "tired and bored", "angry with her cousin"], 0, { text: "h1" }),
      f("Listen again and complete the notes. Write one word or a number.", [
        feld("Students accepted each year: about …", ["forty", "40"]),
        feld("Cora runs … times a week.", ["three", "3"]),
        feld("Free tutoring group: on … afternoons", ["Wednesday", "wednesday"]),
        feld("Open day at the ambulance station at Hartley …", ["Bridge"]),
        feld("Cora must book by the end of this …", ["week"])
      ], { text: "h1", tolerant: true, hinweis: "Lies vor dem Hören die Notizen: Dann weißt du, auf welche Zahl oder welches Wort du achten musst. Achte auf Korrekturen im Gespräch." }),
      o("What do they talk about first, next and last? Put the topics in the right order.", ["Cora's reason for the job", "the college course and the places", "help with biology and the open day"], { text: "h1" })
    ]),
    ...teil("B Reading", [
      c("Why was the club started?", ["Some neighbours were worried about the sand.", "A school needed community work.", "Surfers wanted a longer path to the water."], 0, { text: "t1" }),
      c("Who makes the wooden signs?", ["Caleb", "Mrs Pearce", "Mr Tait"], 0, { text: "t1" }),
      c("What does Caleb's comment \"I now look forward to Sundays\" show?", ["His opinion of the club has changed.", "He prefers getting up early.", "He wants to leave the club soon."], 0, { text: "t1" }),
      z("In which lines does the text say why the dunes are damaged?", "t1", [[8, 10]], { hinweis: "Suche das Schlüsselwort aus der Frage (damaged) im Text und lies dort genau." }),
      z("In which lines does Mrs Pearce talk about people who do not follow the rules?", "t1", [[31, 34]], { hinweis: "Suche die wörtliche Rede von Mrs Pearce im vorletzten Absatz." }),
      f("Complete the notes about the club. Write one word or a number.", [
        feld("The club was started … years ago.", ["eight", "8"]),
        feld("Caleb's school asked every student to do … work.", ["community"]),
        feld("The seeds are collected on the beach in …", ["autumn", "the autumn", "fall"]),
        feld("Next spring the club will plant at the … end of the beach.", ["south", "southern"])
      ], { text: "t1", tolerant: true }),
      a("Why is the club important for the beach? Give two reasons from the text. Answer in English.", [
        kr("ein Grund aus dem Text", 1, "zum Beispiel: The dune grass holds the sand together. / The dunes protect the houses from storms. / The signs keep walkers on the path."),
        kr("ein zweiter, anderer Grund aus dem Text", 1, "ein anderer der Gründe"),
        kr("verständlich auf Englisch (eigene Worte oder passende Wörter aus dem Text; Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
      ], "The members plant dune grass, which holds the sand together and protects the houses from storms, and the signs keep walkers on the path.", ["grass|plant|roots|sand", "storm|houses|sign|path|walkers"], { text: "t1", zeilen: [8, 22] })
    ]),
    ...teil("C Grammar and vocabulary", [
      f("Complete the sentences. Use the passive voice, going to or the simple past.", [
        feld("The tickets (sell) … at the door every Saturday.", ["are sold"]),
        feld("The old lighthouse (paint) … by volunteers last summer.", ["was painted"]),
        feld("Where (the photos / take) … last summer?", ["were the photos taken", "Were the photos taken"]),
        feld("(your cousin / be going to / study) … abroad next year?", ["is your cousin going to study", "Is your cousin going to study"]),
        feld("Erin (not / be going to / join) … the choir next term.", ["is not going to join", "isn't going to join", "isn’t going to join", "'s not going to join", "’s not going to join"]),
        feld("I (not / buy) … the ticket, because it was too expensive.", ["did not buy", "didn't buy", "didn’t buy"])
      ], { hinweis: "Passiv: am / is / are oder was / were + 3. Form (Partizip). going to: am / is / are + going to + Grundform. Verneinung und Frage im simple past mit did + Grundform." }),
      c("Which sentence means the same as \"Somebody stole my bike yesterday.\"?", ["My bike was stolen yesterday.", "My bike is stolen yesterday.", "My bike stole yesterday."], 0),
      c("Fresh bread … in our bakery every morning.", ["is baked", "are baked", "was baking"], 0),
      c("The mayor opened the new library last May. Which passive sentence is correct?", ["The new library was opened by the mayor last May.", "The new library is opened by the mayor last May.", "The new library was open by the mayor last May."], 0),
      f("Change the sentences into the passive voice. Use by.", [
        feld("The students organise the school party every year.  →  The school party …", ["The school party is organised by the students every year", "The school party is organised by the students every year.", "The school party is organized by the students every year", "The school party is organized by the students every year.", "is organised by the students every year", "is organised by the students every year.", "is organized by the students every year", "is organized by the students every year.", "The school party is organised every year by the students", "The school party is organized every year by the students", "is organised every year by the students", "is organized every year by the students"]),
        feld("A famous artist designed our new logo.  →  Our new logo …", ["Our new logo was designed by a famous artist", "Our new logo was designed by a famous artist.", "was designed by a famous artist", "was designed by a famous artist."])
      ], { hinweis: "Das Objekt des Aktivsatzes wird zum Subjekt. Die Zeit bleibt gleich: Präsens → is / are + 3. Form, simple past → was / were + 3. Form." }),
      m("Match the expressions with their meanings.", [["to hand in", "to give a piece of work to a teacher or a boss"], ["to look after", "to take care of somebody or something"], ["to meet a deadline", "to finish something in time"]])
    ]),
    ...teil("D Mediation", [
      a("Your exchange partner Tilda from New Zealand is staying with you. She loves nature and does not speak German. You see this notice. Tell Tilda in English what she needs to know (5 to 7 sentences). Do not translate word for word.", [
        kr("Wann: drei Samstage im Mai, um zehn Uhr bis Mittag", 2, "2 Punkte: Samstage im Mai und Uhrzeit/Dauer (three Saturdays in May, from 10 am until noon) · 1 Punkt: nur eines davon"),
        kr("Für wen: Jugendliche ab 13 Jahren (Tilda ist alt genug, wenn sie mindestens 13 ist)", 1, "for young people from 13 / aged thirteen and older"),
        kr("Ausrüstung: Schutzanzug und Handschuhe vom Verein; mitbringen nur feste Schuhe", 1, "the club provides protective clothing; bring strong shoes – mindestens eines davon"),
        kr("Kosten: kostenlos, nur das Glas Honig kostet fünf Euro", 1, "the course is free; a jar of honey costs 5 euros"),
        kr("Allergie gegen Bienenstiche: dann darf man nicht teilnehmen", 1, "you cannot take part if you are allergic to bee stings"),
        kr("Anmeldung bei Frau Hartmann bis Ende April", 1, "register with Mrs Hartmann by the end of April – Person oder Frist genannt"),
        kr("Sprachmittlung: verständliches, einfaches Englisch für Tilda, nicht Wort für Wort; Unwichtiges (Fest zum hundertjährigen Bestehen, „gute Laune“) fehlt – der Treffpunkt (Vereinsgarten hinter der alten Mühle) darf genannt werden", 1)
      ], "Tilda, this is a beginners' course about keeping bees for young people from 13. It takes place on three Saturdays in May, from 10 am until noon. The club gives you protective clothes and gloves, so you only need strong shoes. The course is free, but a jar of honey costs 5 euros. You can't take part if you are allergic to bee stings. You must register with Mrs Hartmann by the end of April.",
      ["bee|keep", "saturday|may", "10|ten|noon|midday|lunch", "13|thirteen|young", "gloves|protective|clothes|suit|shoes", "free|5|five|honey", "allerg|sting", "register|sign|hartmann|april"], { vorgabe: B_AUSHANG })
    ]),
    ...teil("E Writing", [
      s("Your school magazine asks for reports about work experience. You spent a week at the Lantern Theatre in Marrowby. Write your report (90 to 120 words). Give it a title, use paragraphs and linking words (for example first, then, although, because, finally). Say where and when you were · what jobs you did (simple past) · one thing that was difficult · something you learnt · one thing that was done by somebody else (use the passive voice) · what you are going to do next.", [
        kr("Inhalt", 5, "je Punkt 1 (fünf von sechs Punkten genügen für die volle Punktzahl): wo und wann · Aufgaben · eine Schwierigkeit · etwas Gelerntes · ein Satz im Passiv · Pläne (going to)"),
        kr("Textsorte und Aufbau", 2, "Überschrift, Absätze mit sinnvoller Reihenfolge (zum Beispiel Einleitung, Aufgaben, Schluss), Verbindungswörter (first, then, although, because, finally); Berichtston"),
        kr("Grammatik", 3, "simple past im Bericht, mindestens ein richtig gebildeter Passivsatz, going to für Pläne; Fehler stören das Verstehen kaum"),
        kr("Wortschatz", 2, "passende Wörter für Praktikum und Berufswelt (work experience, backstage, team, tasks, to learn, colleague), nicht nur good und nice"),
        kr("Rechtschreibung", 2, "häufige Wörter und die Wörter der Unit sind meist richtig geschrieben", { rs: true })
      ], { minWoerter: 90, plan: [
        { id: "title", label: "Title", hilfe: "A week at the Lantern Theatre" },
        { id: "intro", label: "Where and when I was", hilfe: "Last … I spent a week at …" },
        { id: "jobs", label: "My jobs", hilfe: "simple past: First I … / Then I …" },
        { id: "problem", label: "A difficult moment", hilfe: "Although …, … / It was difficult because …" },
        { id: "passive", label: "Something that was done by somebody else", hilfe: "passive: The stage was built by … / The tickets were sold by …" },
        { id: "end", label: "What I learnt and what I am going to do", hilfe: "I learnt that … Next year I am going to …" }
      ] })
    ])
  ]
});

module.exports = { m4a, m4b };
