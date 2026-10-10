"use strict";

/**
 * Englisch 9R · Probe 1: Unit 1 – Around Australia
 * Teile: A Listening (12) · B Reading (12) · C Grammar and vocabulary (14) · D Mediation (8) · E Writing (14) = 60 Punkte,
 * 60 Minuten. Grammatik der Unit: simple past, will-future, if-clauses Typ I, present progressive. Wortschatz: von
 * Erlebnissen erzählen, krank sein.
 * LehrplanPLUS E9 (Regelklasse): 1.1 Hör- und Hörsehverstehen, 1.2 Leseverstehen, 1.4 Schreiben, 1.5 Sprachmittlung,
 * 2 Wortschatz und Grammatik. Quali-Bezug: Teil A (Hörverstehen), B (Sprachgebrauch), C (Leseverstehen),
 * D (Sprachmittlung), F (Schreiben) – eigene Aufgaben, nichts aus Prüfungen.
 * Variante A: Bootsausflug zu den Delfinen (Hören), eine Nacht im Busch (Lesen), Zettel der Mutter (Sprachmittlung),
 * E-Mail über eine Klassenfahrt (Schreiben). Alle Texte eigenständig für GRUMI erstellt; Orte (Coral Point, Banjo Ridge)
 * und Personen sind erfunden und stehen in keinem Lernmodul.
 * Variante B (Nachschreibprobe): Tag im Freizeitpark, Cousin wird schwindlig (Hören), ein Kätzchen im Gully auf dem Markt (Lesen),\n * Aushang einer Jugendherberge für kranke Gäste (Sprachmittlung), E-Mail über eine Krankheitswoche (Schreiben). Erfundene Orte: Kookaburra Bay\n * Adventure Park, Sandy Hollow, Jugendherberge Seeblick; Namen: Isla, Noah, Grace Miller, Mr Tanner, Liam.\n * Bleibt auf dem Server (Lösungen und Erwartungshorizont). Bausteine: bau.js.
 */
const { c, m, o, f, feld, z, a, kr, s, text, hoertext, teil, probe } = require("./bau");

const HINWEIS = "Work on your own. Part A: your teacher plays the recording twice – read the tasks first. Read every task carefully. Arbeite allein. Den Hörtext spielt deine Lehrkraft zweimal für alle ab. Nach der Abgabe kannst du nichts mehr ändern.";

/* ------------------------------ Variante A ------------------------------ */
const A_HOEREN = hoertext("h1", "The boat trip", "Listening: two friends talk", [
  ["Jonah", "Hi Ava! How was your weekend? Did you go on the boat trip?"],
  ["Ava", "Yes, we went on Saturday. My aunt booked the tickets two weeks ago. The boat left Coral Point at half past eight in the morning."],
  ["Jonah", "That is early! Did you see any dolphins?"],
  ["Ava", "Yes, we saw about twenty dolphins. They swam next to the boat for ten minutes. It was amazing."],
  ["Jonah", "Lucky you! So it was a perfect trip?"],
  ["Ava", "Not really. After an hour the sea got rough, and I felt sick. I had a terrible headache, and my stomach hurt."],
  ["Jonah", "Oh no. What did you do?"],
  ["Ava", "A woman from the crew gave me some water and a dry biscuit. She said: If you look at the horizon, you will feel better. And it worked."],
  ["Jonah", "Good to know. Will you go again?"],
  ["Ava", "Yes, I think I will. But next time I will take a tablet before the trip, and I won't eat a big breakfast."],
  ["Jonah", "I would like to come too. How much was the ticket?"],
  ["Ava", "Thirty-five dollars for students. If you come with us in March, my aunt will book a ticket for you."],
  ["Jonah", "Great. I will ask my parents tonight."]
], { stimmen: { Jonah: "en-GB-RyanNeural", Ava: "en-GB-LibbyNeural" }, mal: 2 });

const A_LESEN = text("t1", "A long night at Banjo Ridge", "Newspaper article", [
  "Two students from Year 9 spent a night in the bush last weekend. Kirra Adams and her cousin Eli wanted to walk to the lookout at Banjo Ridge. The walk usually takes two hours.",
  "They started at three o'clock on Saturday afternoon. At first everything went well. But on the way back they took the wrong path. Soon it got dark, and their phones had no signal.",
  "The cousins did not panic. They remembered a rule from school: If you get lost, stay where you are. They sat down under a big tree and put on their jackets. Kirra had a whistle in her backpack. Every ten minutes she blew it three times. Eli shared his water and two muesli bars.",
  "At home, Kirra's mother got worried. At eight o'clock she called the rangers. A team of six people started to search with torches. Just after midnight a ranger heard the whistle. The cousins were cold and tired, but they were not hurt.",
  "\"They did the right things,\" ranger Paula Dunn said. \"They stayed together, they stayed in one place, and they made a noise. If walkers do that, we will find them much faster.\" Next time the cousins will take a map and tell their parents the exact route. \"And we will start in the morning,\" Kirra says."
]);

const A_ZETTEL = "Guten Morgen! Ich bin bis 15 Uhr in der Arbeit. Jess soll bitte im Bett bleiben und viel Tee trinken – der Tee steht in der blauen Kanne. Der Hustensaft steht im Kühlschrank: dreimal am Tag einen Löffel, immer nach dem Essen. Um 16:30 Uhr habt ihr einen Termin bei Frau Dr. Berger, Papa fährt euch hin. Die Versichertenkarte von Jess liegt auf dem Küchentisch, bitte mitnehmen! Wenn das Fieber über 39 Grad steigt, ruft mich sofort an. Übrigens: Die Nachbarin holt heute Nachmittag ein Paket ab. Bussi, Mama";

const p1a = probe(1, "A", {
  title: "Test 1 (R9): Around Australia", kurz: "Unit 1", scope: "Unit 1 · Listening, Reading, Grammar and vocabulary, Mediation, Writing", minutes: 60, hinweis: HINWEIS,
  texte: [A_HOEREN, A_LESEN],
  items: [
    ...teil("A Listening", [
      c("When did Ava go on the boat trip?", ["on Saturday", "on Sunday", "on Friday"], 0, { text: "h1" }),
      c("What time did the boat leave?", ["at half past eight", "at eight o'clock", "at half past nine"], 0, { text: "h1" }),
      c("Why was the trip not perfect?", ["Ava felt sick.", "It rained all day.", "They did not see any dolphins."], 0, { text: "h1" }),
      c("What will Jonah do tonight?", ["ask his parents", "book a ticket", "take a tablet"], 0, { text: "h1" }),
      f("Listen again and complete the notes. Write one word or a number.", [
        feld("Number of dolphins: about …", ["twenty", "20"]),
        feld("The dolphins swam next to the boat for … minutes.", ["ten", "10"]),
        feld("The woman gave Ava water and a dry …", ["biscuit", "a biscuit"]),
        feld("Her tip: look at the …", ["horizon", "the horizon"]),
        feld("Ticket for students: … dollars", ["thirty-five", "35", "thirty five"])
      ], { text: "h1", tolerant: true, hinweis: "Lies vor dem Hören die Notizen: Dann weißt du, auf welche Zahl oder welches Wort du achten musst." }),
      o("What happened first? Put the events in the right order.", ["They saw the dolphins.", "The sea got rough and Ava felt sick.", "A woman from the crew helped Ava."], { text: "h1" })
    ]),
    ...teil("B Reading", [
      c("What kind of text is this?", ["a newspaper article", "a letter to a friend", "an advertisement"], 0, { text: "t1" }),
      c("Why did the cousins get lost?", ["They took the wrong path on the way back.", "They lost their map.", "They walked too fast."], 0, { text: "t1" }),
      c("Who called the rangers?", ["Kirra's mother", "Eli", "a teacher"], 0, { text: "t1" }),
      z("In which lines does the text say what Kirra did with her whistle?", "t1", [[11, 13]], { hinweis: "Suche das Schlüsselwort aus der Frage (whistle) im Text und lies dort genau." }),
      z("In which lines does the ranger say what the cousins did right?", "t1", [[19, 21]], { hinweis: "Suche die Stelle mit der wörtlichen Rede der Rangerin." }),
      f("Complete the notes about the article. Write one word or a number.", [
        feld("The walk started on Saturday at … o'clock.", ["three", "3"]),
        feld("Number of people in the search team:", ["six", "6"]),
        feld("A ranger heard the whistle just after …", ["midnight"]),
        feld("Next time the cousins will take a …", ["map", "a map"])
      ], { text: "t1", tolerant: true }),
      a("Why did the rangers find the cousins quite quickly? Give two reasons from the text. Answer in English.", [
        kr("ein Grund aus dem Text", 1, "zum Beispiel: They stayed in one place. / They stayed together. / They made a noise with the whistle."),
        kr("ein zweiter, anderer Grund aus dem Text", 1, "ein anderer der drei Gründe"),
        kr("verständlich auf Englisch (eigene Worte oder passende Wörter aus dem Text; Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
      ], "They stayed in one place, and Kirra blew her whistle, so the rangers could hear them.", ["stay|stayed", "place|together|tree", "whistle|noise"], { text: "t1", zeilen: [19, 21] })
    ]),
    ...teil("C Grammar and vocabulary", [
      f("Complete the sentences with the simple past of the verbs in brackets.", [
        feld("Last summer my family and I (fly) … to Darwin.", ["flew"]),
        feld("We (stay) … there for two weeks.", ["stayed"]),
        feld("One day we (see) … a crocodile in a river.", ["saw"]),
        feld("My brother (take) … a hundred photos.", ["took"]),
        feld("I (not / like) … the heat.", ["did not like", "didn't like", "didn’t like"]),
        feld("What (you / eat) … there? – Fish and chips.", ["did you eat"])
      ], { hinweis: "Wiederhole die unregelmäßigen Verben und die Fragen und Verneinungen mit did." }),
      c("Which sentence is correct?", ["I think it will rain tomorrow.", "I think it will rains tomorrow.", "I think it rain will tomorrow."], 0),
      c("Look! A kangaroo ___ across the road.", ["is jumping", "are jumping", "jump"], 0),
      c("If you ___ sun cream, you will get a sunburn.", ["don't use", "won't use", "didn't use"], 0),
      f("Complete the if-sentences with the correct form of the verbs in brackets.", [
        feld("If it (be) … hot tomorrow, we will go to the beach.", ["is"]),
        feld("If you drink enough water, you (feel) … better.", ["will feel", "'ll feel", "’ll feel"])
      ], { hinweis: "If-Satz Typ I: nach if das simple present, im Hauptsatz will + Verb." }),
      m("Match the words with their meanings.", [["exhausting", "very tiring"], ["a prescription", "a note from the doctor for your medicine"], ["to get lost", "not to know where you are"]])
    ]),
    ...teil("D Mediation", [
      a("Your Australian guest Jess is ill. She does not speak German. Your mum left this note in the kitchen. Tell Jess the important things in English (4 to 6 sentences). Do not translate word for word.", [
        kr("im Bett bleiben und viel Tee trinken", 1, "stay in bed, drink a lot of tea"),
        kr("Hustensaft: im Kühlschrank, dreimal am Tag ein Löffel nach dem Essen", 2, "2 Punkte: was (cough medicine / cough syrup) und wie (one spoon three times a day, after meals) · 1 Punkt: nur eines davon oder ungenau"),
        kr("Arzttermin um halb fünf, der Vater fährt", 2, "2 Punkte: Termin mit Uhrzeit (half past four / 4.30) und wer fährt · 1 Punkt: Termin ohne Uhrzeit oder ohne Fahrer"),
        kr("Versichertenkarte mitnehmen", 1, "take your insurance card / health card – Umschreiben gilt (the card for the doctor)"),
        kr("bei Fieber über 39 Grad sofort die Mutter anrufen", 1, "call my mum if your temperature goes over 39"),
        kr("Sprachmittlung: verständliches, einfaches Englisch für Jess, nicht Wort für Wort; Unwichtiges (Paket, Kanne, Arbeitszeit) fehlt", 1)
      ], "Jess, my mum says you should stay in bed and drink a lot of tea. The cough medicine is in the fridge. Take one spoon three times a day after meals. We have an appointment at the doctor's at half past four, and my dad will drive us. Please take your insurance card. If your temperature goes over 39, we must call my mum.",
      ["bed", "tea", "cough|medicine|syrup", "three|3", "doctor|appointment", "half past four|4.30|4:30|16", "card", "39|temperature|fever"], { vorgabe: A_ZETTEL })
    ]),
    ...teil("E Writing", [
      s("You are back from a class trip. Write an email to your Australian friend Jess (80 to 100 words). Tell her: where you were and when · two things you did · something that went wrong or was funny · how you liked it · one thing you will do next time.", [
        kr("Inhalt", 5, "alle fünf Punkte des Auftrags – je Punkt 1: Ort und Zeit · zwei Unternehmungen · eine Panne oder etwas Lustiges · Bewertung · ein Vorsatz für das nächste Mal"),
        kr("Textsorte und Aufbau", 2, "Anrede und Schluss mit Gruß, sinnvolle Reihenfolge, ein paar Verbindungswörter (first, then, after that, but, because)"),
        kr("Grammatik", 3, "Erlebnisse im simple past, mindestens ein Satz mit will oder ein if-Satz; Fehler stören das Verstehen kaum"),
        kr("Wortschatz", 2, "passende Wörter für Erlebnisse und Bewertungen, nicht nur good und nice"),
        kr("Rechtschreibung", 2, "häufige Wörter und die Wörter der Unit sind meist richtig geschrieben", { rs: true })
      ], { minWoerter: 60, plan: [
        { id: "greeting", label: "Greeting", hilfe: "Hi Jess, …" },
        { id: "where", label: "Where and when?" },
        { id: "did", label: "Two things you did", hilfe: "simple past" },
        { id: "wrong", label: "Something that went wrong or was funny" },
        { id: "opinion", label: "How was it?" },
        { id: "next", label: "Next time I will …" },
        { id: "ending", label: "Ending", hilfe: "Write back soon! / Bye, …" }
      ] })
    ])
  ]
});

/* ------------------------------ Variante B (Nachschreibprobe) ------------------------------ */
const B_HOEREN = hoertext("h1", "A day at the theme park", "Listening: two friends talk", [
  ["Isla", "Hi Noah! You look tired. What did you do on Sunday?"],
  ["Noah", "Hi Isla! I went to Kookaburra Bay Adventure Park with my cousin. We arrived at quarter past ten, and the queue at the gate was very long."],
  ["Isla", "Which ride did you like best?"],
  ["Noah", "The wooden roller coaster. It is called the Big Wave. We rode it three times, and it was so fast!"],
  ["Isla", "Sounds great. So it was a perfect day?"],
  ["Noah", "Not quite. At lunch my cousin ate a huge ice cream, and then he went on the spinning cups. Afterwards he felt dizzy, and he was sick behind a bin."],
  ["Isla", "Oh no! What did you do?"],
  ["Noah", "A man from the park took us to the first aid room. The nurse gave him a glass of water and told him to sit down for twenty minutes. She also said: If you eat small snacks, you will not feel sick on the rides."],
  ["Isla", "That is a good tip. Is the park expensive?"],
  ["Noah", "Forty-two dollars for students. The park opens at nine on Saturdays. If you want, we can go together in May."],
  ["Isla", "Yes, please! I will look at the website tonight."]
], { stimmen: { Isla: "en-GB-SoniaNeural", Noah: "en-US-GuyNeural" }, mal: 2 });

const B_LESEN = text("t1", "A surprise at the market", "Newspaper article", [
  "A small kitten and a quick-thinking girl made the news at the Sandy Hollow market last Saturday. Grace Miller, 14, was buying fruit with her father when she heard a thin cry from the street.",
  "At first Grace could not see anything. Then she looked into a drain next to the bakery stall. A small grey kitten was sitting in the water. It was too scared to move. Grace tried to reach it, but her arm was too short. She shouted to her father, and he called the fire brigade at once.",
  "Two firefighters arrived after only six minutes. Mr Tanner lifted the cover of the drain and took the kitten out. It was wet and cold. Grace wrapped it in her scarf and held it close. A vet who was shopping at the market checked the kitten and said that it was not hurt.",
  "\"Grace did the right thing,\" Mr Tanner said. \"She did not put her hand deep into the drain, and she asked for help. If you find an animal in trouble, call for help first. Then we will do the rest.\"",
  "Nobody knows who the kitten belongs to. The animal shelter will keep it for two weeks. If nobody comes, Grace's family will take it home. \"I will call it Lucky,\" Grace says."
]);

const B_AUSHANG = "Hinweise für kranke Gäste – Jugendherberge Seeblick. Wer sich krank fühlt, meldet sich bitte an der Rezeption; sie ist täglich von 7 bis 21 Uhr besetzt. Danach klingeln Sie bitte beim Hausmeister (Zimmer 3). Pflaster und ein Fieberthermometer finden Sie im Erste-Hilfe-Raum im Erdgeschoss, direkt neben der Küche. Medikamente gibt die Herberge nicht aus. Die nächste Apotheke ist die Marien-Apotheke am Marktplatz, zehn Minuten zu Fuß; sie schließt werktags um 18 Uhr und samstags um 12 Uhr. Kranke Gäste können das Frühstück auf dem Zimmer bekommen – bitte am Vorabend bis 20 Uhr an der Rezeption anmelden. Im Notfall wählen Sie 112. Übrigens: Die Waschmaschine im Keller nimmt nur Zwei-Euro-Münzen, und der Fahrradverleih ist montags geschlossen.";

const p1b = probe(1, "B", {
  title: "Test 1 (R9): Around Australia", kurz: "Unit 1", scope: "Unit 1 · Listening, Reading, Grammar and vocabulary, Mediation, Writing", minutes: 60, hinweis: HINWEIS,
  texte: [B_HOEREN, B_LESEN],
  items: [
    ...teil("A Listening", [
      c("Which day did Noah go to the park?", ["on Sunday", "on Saturday", "on Monday"], 0, { text: "h1" }),
      c("What time did Noah and his cousin arrive?", ["at quarter past ten", "at quarter to ten", "at half past ten"], 0, { text: "h1" }),
      c("What went wrong at the park?", ["Noah's cousin was sick.", "Noah lost his ticket.", "The roller coaster was closed."], 0, { text: "h1" }),
      c("What will Isla do tonight?", ["look at the website", "call the nurse", "buy a ticket"], 0, { text: "h1" }),
      f("Listen again and complete the notes. Write one word or a number.", [
        feld("Name of the roller coaster: the Big …", ["Wave", "the Wave"]),
        feld("They rode it … times.", ["three", "3"]),
        feld("The nurse told the cousin to sit down for … minutes.", ["twenty", "20"]),
        feld("Her tip: eat small …", ["snacks"]),
        feld("Ticket for students: … dollars", ["forty-two", "42", "forty two"])
      ], { text: "h1", tolerant: true, hinweis: "Lies vor dem Hören die Notizen: Dann weißt du, auf welche Zahl oder welches Wort du achten musst." }),
      o("What happened first? Put the events in the right order.", ["Noah and his cousin arrived at the park.", "The cousin felt dizzy after the spinning cups.", "A nurse gave the cousin a glass of water."], { text: "h1" })
    ]),
    ...teil("B Reading", [
      c("Where was the kitten?", ["in a drain next to a bakery stall", "in a tree near the road", "in a box behind the market"], 0, { text: "t1" }),
      c("Who called the fire brigade?", ["Grace's father", "Grace", "the baker"], 0, { text: "t1" }),
      c("Who checked the kitten?", ["a vet from the market", "Mr Tanner", "Grace's mother"], 0, { text: "t1" }),
      z("In which lines does the text say what Grace did to keep the kitten warm?", "t1", [[12, 13]], { hinweis: "Suche das Schlüsselwort aus der Frage (warm) und denke an Kleidung: Was hat Grace benutzt?" }),
      z("In which lines does Mr Tanner give advice?", "t1", [[15, 18]], { hinweis: "Suche die Stelle mit der wörtlichen Rede des Feuerwehrmanns." }),
      f("Complete the notes about the article. Write one word or a number.", [
        feld("Colour of the kitten:", ["grey", "gray"]),
        feld("Grace's age:", ["fourteen", "14"]),
        feld("The firefighters arrived after … minutes.", ["six", "6"]),
        feld("The shelter will keep the kitten for … weeks.", ["two", "2"])
      ], { text: "t1", tolerant: true }),
      a("What will happen to the kitten? Give two things from the text. Answer in English.", [
        kr("eine Aussage aus dem Text", 1, "zum Beispiel: The shelter will keep it for two weeks. / Grace's family will take it home if nobody comes. / Grace will call it Lucky."),
        kr("eine zweite, andere Aussage aus dem Text", 1, "eine andere der drei Aussagen"),
        kr("verständlich auf Englisch (eigene Worte oder passende Wörter aus dem Text; Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
      ], "The animal shelter will keep the kitten for two weeks. If nobody comes, Grace's family will take it home.", ["shelter|two weeks|weeks", "family|take it home|adopt|Lucky|call"], { text: "t1", zeilen: [19, 21] })
    ]),
    ...teil("C Grammar and vocabulary", [
      f("Complete the sentences with the simple past of the verbs in brackets.", [
        feld("Last weekend my cousin and I (go) … to the beach.", ["went"]),
        feld("We (swim) … in the sea for an hour.", ["swam"]),
        feld("I (lose) … my sunglasses.", ["lost"]),
        feld("My cousin (buy) … two ice creams.", ["bought"]),
        feld("We (not / have) … lunch at home.", ["did not have", "didn't have", "didn’t have"]),
        feld("Where (you / put) … your towel?", ["did you put"])
      ], { hinweis: "Wiederhole die unregelmäßigen Verben und die Fragen und Verneinungen mit did." }),
      c("Which sentence is correct?", ["If it rains, we will stay at home.", "If it will rain, we stay at home.", "If it rained, we will stay at home."], 0),
      c("Be quiet! The baby ___ .", ["is sleeping", "sleeps", "are sleeping"], 0),
      c("Don't worry, I ___ you with the bags.", ["will help", "helped", "was helping"], 0),
      f("Complete the if-sentences with the correct form of the verbs in brackets.", [
        feld("If you (take) … a tablet, your headache will go away.", ["take"]),
        feld("If we (not / hurry) …, we will miss the bus.", ["do not hurry", "don't hurry", "don’t hurry"])
      ], { hinweis: "If-Satz Typ I: nach if das simple present, im Hauptsatz will + Verb." }),
      m("Match the words with their meanings.", [["a queue", "a line of people who wait for something"], ["swollen", "bigger than normal because of an injury"], ["a sore throat", "pain in your throat when you swallow"]])
    ]),
    ...teil("D Mediation", [
      a("Your Australian guest Liam feels ill after a long day in the sun. He does not speak German. You read this notice in the youth hostel. Tell Liam the important things in English (4 to 6 sentences). Do not translate word for word.", [
        kr("Rezeption täglich von sieben bis einundzwanzig Uhr, danach der Hausmeister (Zimmer 3)", 1, "reception open from 7 am to 9 pm, later the caretaker – 1 Punkt für die Rezeption mit Zeit, der Hausmeister ist ein Plus"),
        kr("Erste-Hilfe-Raum im Erdgeschoss neben der Küche, dort Pflaster und Fieberthermometer", 2, "2 Punkte: wo (ground floor, next to the kitchen) und was (plasters, thermometer) · 1 Punkt: nur eines davon"),
        kr("Apotheke am Marktplatz, zehn Minuten zu Fuß, schließt werktags um 18 Uhr und samstags um 12 Uhr", 2, "2 Punkte: wo/Weg und Schließzeit · 1 Punkt: nur eines davon oder ungenau"),
        kr("Frühstück auf dem Zimmer, am Vorabend bis 20 Uhr anmelden", 1, "you can have breakfast in your room if you tell the reception the evening before (by 8 pm)"),
        kr("Notfall: 112 anrufen", 1, "in an emergency call 112"),
        kr("Sprachmittlung: verständliches, einfaches Englisch für Liam, nicht Wort für Wort; Unwichtiges (Waschmaschine, Fahrradverleih) fehlt", 1)
      ], "Liam, the reception is open every day from seven in the morning to nine at night. Later you can ring the caretaker. In the first aid room next to the kitchen there are plasters and a thermometer. The chemist's is at the market square, ten minutes on foot. It closes at six on weekdays and at twelve on Saturdays. If you want breakfast in your room, tell the reception by eight the evening before. In an emergency, call 112.",
      ["reception", "caretaker|janitor", "first aid", "kitchen|ground floor", "plaster|thermometer", "chemist|pharmacy", "market", "six|6|18|twelve|12", "breakfast", "112|emergency"], { vorgabe: B_AUSHANG })
    ]),
    ...teil("E Writing", [
      s("You were ill last week and stayed at home. Write an email to your Australian friend Noah (80 to 100 words). Tell him: what was wrong and when it started · what you did to feel better · who helped you · one thing you missed · one thing you will do when you are well again.", [
        kr("Inhalt", 5, "alle fünf Punkte des Auftrags – je Punkt 1: Beschwerden und Beginn · was gegen die Beschwerden getan wurde · wer geholfen hat · etwas Verpasstes · ein Vorsatz oder Plan für die Zeit nach der Krankheit"),
        kr("Textsorte und Aufbau", 2, "Anrede und Schluss mit Gruß, sinnvolle Reihenfolge, ein paar Verbindungswörter (first, then, after that, but, because)"),
        kr("Grammatik", 3, "Erlebnisse im simple past, mindestens ein Satz mit will oder ein if-Satz; Fehler stören das Verstehen kaum"),
        kr("Wortschatz", 2, "passende Wörter zu Krankheit und Beschwerden (headache, temperature, to feel better), nicht nur bad und good"),
        kr("Rechtschreibung", 2, "häufige Wörter und die Wörter der Unit sind meist richtig geschrieben", { rs: true })
      ], { minWoerter: 60, plan: [
        { id: "greeting", label: "Greeting", hilfe: "Hi Noah, …" },
        { id: "wrong", label: "What was wrong? When did it start?", hilfe: "simple past" },
        { id: "better", label: "What did you do to feel better?" },
        { id: "help", label: "Who helped you?" },
        { id: "missed", label: "What did you miss?" },
        { id: "next", label: "When I am well again, I will …", hilfe: "will oder if-Satz" },
        { id: "ending", label: "Ending", hilfe: "Write back soon! / Bye, …" }
      ] })
    ])
  ]
});
module.exports = { p1a, p1b };
