"use strict";

/**
 * Englisch 9R · Probe 2: Unit 2 – Exploring India (Variante A und B = Nachschreibprobe)
 * Teile: A Listening (12) · B Reading (12) · C Grammar and vocabulary (14) · D Mediation (8) · E Writing (14) = 60 Punkte,
 * 60 Minuten. Grammatik der Unit: simple present (he/she/it -s, do/does, don't/doesn't, Häufigkeitsadverbien),
 * word order (Subjekt–Verb–Objekt, Art und Weise – Ort – Zeit). Wortschatz: Firma und Arbeit, nachhaltig leben.
 * LehrplanPLUS E9 (Regelklasse): 1.1 Hör- und Hörsehverstehen, 1.2 Leseverstehen, 1.4 Schreiben, 1.5 Sprachmittlung,
 * 2 Wortschatz und Grammatik. Alle Texte eigenständig für GRUMI erstellt, nichts aus dem Schulbuch oder aus Prüfungen.
 * Variante A: Interview für die Schülerzeitung mit der Besitzerin einer kleinen Töpferei (Hören), eine grüne Schule
 *   (Lesen), englisches Faltblatt einer Freiwilligenwoche auf einem Biohof für die Tante (Sprachmittlung En -> De),
 *   Bildergeschichte „Jacke für die Hochzeit“ (Schreiben, simple past).
 *   Namen: Sana, Rahul, Mrs Iyer, Onkel/Tante ohne Namen. Erfunden: Orange Door Pottery, Tamaravadi, Lakeview School,
 *   Blue Heron Farm, Ketapur.
 * Variante B: Pooja und Aman planen einen Stand für den Schulbasar (Hören; Mr Sen = Kunstlehrer), Berufsbild
 *   Imker/Imkerin (Lesen), englischer Aushang zum Baumpflanztag für den Opa (Sprachmittlung En -> De),
 *   Bildergeschichte „Stromausfall am Abend“ (Schreiben, simple past).
 *   Namen: Pooja, Aman, Mr Sen. Erfunden: Rainbow Valley Trust, Kodaipet.
 * Bleibt auf dem Server (Lösungen und Erwartungshorizont). Bausteine: bau.js.
 */
const { c, m, o, f, feld, z, a, kr, s, text, hoertext, teil, probe } = require("./bau");

const HINWEIS = "Work on your own. Part A: your teacher plays the recording twice – read the tasks first. Read every task carefully. Arbeite allein. Den Hörtext spielt deine Lehrkraft zweimal für alle ab. Nach der Abgabe kannst du nichts mehr ändern.";

/* ------------------------------ Variante A ------------------------------ */
const A_HOEREN = hoertext("h1", "An interview with a potter", "Listening: an interview for the school newspaper", [
  ["Sana", "Good afternoon, Mrs Iyer. Thank you for talking to the school newspaper."],
  ["Mrs Iyer", "You are welcome, Sana. Please come in."],
  ["Sana", "Your shop is called Orange Door Pottery. What do you make here?"],
  ["Mrs Iyer", "We make clay pots, cups and plates. Everything is made by hand. Six people work here, and four of them are women from our village."],
  ["Sana", "How does a normal day start?"],
  ["Mrs Iyer", "We usually start at seven o'clock. First we mix the clay. Then we shape the pots. After that the pots dry in the sun for two days. Finally we put them in the oven."],
  ["Sana", "Do you sell your pots only in Tamaravadi?"],
  ["Mrs Iyer", "No, we don't. We sell most of them on the internet. My nephew takes the photos and puts them on our website. Customers from many countries order our cups. We send about forty parcels every week."],
  ["Sana", "Is your work good for the environment?"],
  ["Mrs Iyer", "I think so. We never use plastic. We pack every cup in old newspaper and the customers like it."],
  ["Sana", "What do you like best about your job?"],
  ["Mrs Iyer", "I love it when a child makes a first cup. Every Saturday we have a free class for children from ten o'clock to twelve o'clock."],
  ["Sana", "That is a great idea! Thank you very much, Mrs Iyer."],
  ["Mrs Iyer", "My pleasure. Come back on Saturday and make a cup yourself!"]
], { stimmen: { Sana: "en-GB-LibbyNeural", "Mrs Iyer": "en-GB-SoniaNeural" }, mal: 2 });

const A_LESEN = text("t1", "A green school", "Information text", [
  "Lakeview School is a normal school with six hundred students, but it is special: it is a green school. Here, students and teachers think about the environment every day. The school does not have much money, so the ideas are simple and cheap.",
  "Every morning, the students bring water in their own bottles. The school has no plastic bottles at all. In the canteen, the cook uses fresh vegetables from the school garden. Food that nobody eats goes into a compost box, and the compost goes back to the garden. Class 8 looks after the garden on Mondays and Thursdays.",
  "Energy is also important. The classrooms have big windows, so the teachers usually switch off the lights in the morning. A solar panel on the roof gives power for the computers. Every Friday, one class checks the building and writes down which lights are still on. It never takes longer than ten minutes.",
  "Many students come to school by bike or on foot. Students who live far away often take the school bus together. Only a few parents bring their children by car. Rahul from Class 9 says: \"I ride to school with three friends. We talk and laugh on the way. It is faster than the bus, and it costs nothing.\"",
  "The headteacher thinks the project works because everybody helps. \"Our students don't wait for adults,\" she says. \"They have ideas, and they do something.\" Next year, the school wants to start a swap shop for old school clothes."
]);

const A_FLYER = "BLUE HERON FARM – VOLUNTEER WEEK\nDo you want to learn about organic farming? Join us for one week on our small family farm near Ketapur!\nEvery morning you help with the vegetables or look after the hens. In the afternoon you learn how to make compost or cook with fresh food from the farm.\nDates: 4 to 10 March (more weeks in April).\nPrice: 60 euros per week. This includes your food and a bed in a shared room.\nPlease bring: a sun hat, strong shoes and a water bottle. Please do not bring plastic bags – we don't use them on the farm.\nOur farm has three dogs and a swimming pond. The internet works only in the office.\nTo join us, send us an email before 20 February.";

const p2a = probe(2, "A", {
  title: "Test 2 (R9): Exploring India", kurz: "Unit 2", scope: "Unit 2 · Listening, Reading, Grammar and vocabulary, Mediation, Writing", minutes: 60, hinweis: HINWEIS,
  texte: [A_HOEREN, A_LESEN],
  items: [
    ...teil("A Listening", [
      c("How many people work at Orange Door Pottery?", ["six", "four", "ten"], 0, { text: "h1" }),
      c("Where do they sell most of their pots?", ["on the internet", "in the village", "at the school"], 0, { text: "h1" }),
      c("What do they use to pack the cups?", ["old newspaper", "plastic bags", "cardboard boxes"], 0, { text: "h1" }),
      c("What happens every Saturday?", ["There is a free class for children.", "There is a big market.", "The shop is closed."], 0, { text: "h1" }),
      f("Listen again and complete the notes. Write one word or a number.", [
        feld("The working day usually starts at … o'clock.", ["seven", "7", "7.00", "7:00"]),
        feld("The pots dry in the sun for … days.", ["two", "2"]),
        feld("Mrs Iyer's … takes the photos for the website.", ["nephew", "her nephew", "the nephew"]),
        feld("Number of parcels every week: about …", ["forty", "40"]),
        feld("The class for children ends at … o'clock.", ["twelve", "12", "12.00", "12:00"])
      ], { text: "h1", tolerant: true, hinweis: "Lies vor dem Hören die Notizen: Dann weißt du, auf welche Zahl oder welches Wort du achten musst." }),
      o("How do they make a pot? Put the steps in the right order.", ["They mix the clay.", "They shape the pot.", "The pot dries in the sun."], { text: "h1" })
    ]),
    ...teil("B Reading", [
      c("What is special about Lakeview School?", ["It is a green school.", "It is a very big school.", "It is a school for adults."], 0, { text: "t1" }),
      c("What happens to the food that nobody eats?", ["It goes into a compost box.", "The cook sells it.", "The students take it home."], 0, { text: "t1" }),
      c("How do many students get to school?", ["by bike or on foot", "by car", "by train"], 0, { text: "t1" }),
      z("In which lines does the text say who looks after the school garden?", "t1", [[10, 11]], { hinweis: "Suche das Schlüsselwort aus der Frage (garden) im Text und lies dort genau." }),
      z("In which lines does the text say what the school does every Friday?", "t1", [[15, 16]], { hinweis: "Suche den Tag der Woche, den die Frage nennt." }),
      f("Complete the notes about the school. Write one word or a number.", [
        feld("The students bring water in their own …", ["bottles"]),
        feld("A solar panel gives power for the …", ["computers"]),
        feld("Rahul rides to school with … friends.", ["three", "3"]),
        feld("Next year the school wants to start a swap shop for old …", ["school clothes", "clothes"])
      ], { text: "t1", tolerant: true }),
      a("What does Rahul like about riding his bike to school? Give two reasons from the text. Answer in English.", [
        kr("ein Grund aus dem Text", 1, "zum Beispiel: He rides with friends. / They talk and laugh. / It is faster than the bus. / It costs nothing."),
        kr("ein zweiter, anderer Grund aus dem Text", 1, "ein anderer der genannten Gründe"),
        kr("verständlich auf Englisch (eigene Worte oder passende Wörter aus dem Text; Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
      ], "He rides with three friends, and it is faster than the bus.", ["friend|talk|laugh", "faster|bus|nothing|cost|free"], { text: "t1", zeilen: [20, 23] })
    ]),
    ...teil("C Grammar and vocabulary", [
      f("Complete the sentences with the simple present of the verbs in brackets.", [
        feld("My uncle (work) … for a small soap company.", ["works"]),
        feld("He (not / like) … the noise in the factory.", ["doesn't like", "does not like", "doesn’t like"]),
        feld("My aunt (teach) … English at a village school.", ["teaches"]),
        feld("What time (the workers / finish) … work?", ["do the workers finish"]),
        feld("We (not / sell) … sweets in plastic boxes.", ["don't sell", "do not sell", "don’t sell"]),
        feld("My sister (study) … design in the evening.", ["studies"])
      ], { hinweis: "Denk an das -s bei he, she, it und an do und does in Fragen und Verneinungen." }),
      c("Which sentence is correct?", ["The workers go home by bus at five o'clock.", "The workers go at five o'clock home by bus.", "The workers by bus go home at five o'clock."], 0),
      c("___ your mother work in the city?", ["Does", "Do", "Is"], 0),
      c("Sana ___ to school by car.", ["never goes", "goes never", "never go"], 0),
      f("Complete the sentences with do, does, don't or doesn't.", [
        feld("… you like cricket? – Yes, I do.", ["Do"]),
        feld("My father … work on Sundays. He stays at home.", ["doesn't", "does not", "doesn’t"])
      ], { hinweis: "Bei he, she, it brauchst du does und doesn't." }),
      m("Match the words with their meanings.", [["an employee", "a person who works for a company"], ["a customer", "a person who buys something in a shop"], ["to recycle", "to use old things again to make new things"]])
    ]),
    ...teil("D Mediation", [
      a("Your aunt wants to join a volunteer week on a farm in India. She does not speak English. She wants to know: what you do there · when and where · what it costs · what to bring · until when she must register. Tell her the important things in German (4 to 6 sentences). Do not translate word for word.", [
        kr("Tätigkeit: morgens Gemüse bzw. Hühner, nachmittags Kompost oder Kochen mit frischem Essen vom Hof", 2, "2 Punkte: Vormittags- und Nachmittagsarbeit · 1 Punkt: nur eines davon oder sehr ungenau"),
        kr("Zeit und Ort: 4. bis 10. März, Hof bei Ketapur", 1, "Datum und Ort; ein Teil allein genügt nicht"),
        kr("Kosten: 60 Euro pro Woche, Essen und Bett im Mehrbettzimmer inklusive", 2, "2 Punkte: Preis und was dabei ist · 1 Punkt: nur der Preis"),
        kr("mitbringen: Sonnenhut, feste Schuhe, Trinkflasche (keine Plastiktüten)", 1, "mindestens zwei der Dinge"),
        kr("Anmeldung per E-Mail bis 20. Februar", 1, "Frist und Weg; die Frist allein genügt für den Punkt"),
        kr("Sprachmittlung: verständliches Deutsch für die Tante, nicht Wort für Wort; Unwichtiges (Hunde, Teich, Internet nur im Büro) fehlt", 1)
      ], "Auf dem Biohof hilft man morgens beim Gemüse oder bei den Hühnern, nachmittags lernt man Kompost machen oder kocht mit frischen Sachen vom Hof. Die Woche ist vom 4. bis 10. März auf einem Hof bei Ketapur. Sie kostet 60 Euro, dafür bekommst du Essen und ein Bett in einem Zimmer, das du mit anderen teilst. Bring einen Sonnenhut, feste Schuhe und eine Trinkflasche mit, aber keine Plastiktüten. Du musst dich bis zum 20. Februar per E-Mail anmelden.",
      ["Gemüse|Hühner|Hennen", "Kompost|kochen", "März|4", "Ketapur|Hof", "60", "Essen|Bett|Zimmer|inklusive|enthalten", "Hut|Schuhe|Flasche", "20|Februar|E-Mail|Mail"], { vorgabe: A_FLYER })
    ]),
    ...teil("E Writing", [
      s("Write a story about the four pictures (80 to 100 words).\nPicture 1: Saturday morning – Sana and her uncle – small tailor's shop – a lot of work.\nPicture 2: a man comes in a hurry – needs his jacket for a wedding at six o'clock – the sewing machine stops.\nPicture 3: Sana and Rahul carry an old sewing machine from the neighbour's house.\nPicture 4: the jacket is ready – the man is very happy – he gives them sweets.\nGive your story a title and write a beginning and an ending.", [
        kr("Inhalt", 5, "je Bild 1 Punkt (Bild 1 bis 4 sind erkennbar erzählt) · 1 Punkt für einen eigenen Anfang und einen Schluss"),
        kr("Textsorte und Aufbau", 2, "Titel, Anfang, Hauptteil, Schluss; Verbindungswörter (first, then, after that, but, because, at last)"),
        kr("Grammatik", 3, "Erzählzeit (simple past) durchgehalten, Satzstellung Subjekt–Verb–Objekt und Art und Weise – Ort – Zeit; Fehler stören das Verstehen kaum"),
        kr("Wortschatz", 2, "passende Wörter für Arbeit und Handlung, nicht nur good und nice"),
        kr("Rechtschreibung", 2, "häufige Wörter und die Wörter der Unit sind meist richtig geschrieben", { rs: true })
      ], { minWoerter: 60, plan: [
        { id: "title", label: "Title", hilfe: "Zum Beispiel: A jacket for the wedding" },
        { id: "beginning", label: "Beginning", hilfe: "Wer? Wo? Wann? (simple past)" },
        { id: "pic12", label: "Pictures 1 and 2", hilfe: "Was ist das Problem?" },
        { id: "pic34", label: "Pictures 3 and 4", hilfe: "Wie wird das Problem gelöst?" },
        { id: "ending", label: "Ending", hilfe: "Wie geht es aus? Was denken die Personen?" }
      ] })
    ])
  ]
});

/* ------------------------------ Variante B ------------------------------ */
const B_HOEREN = hoertext("h1", "A stand for the bazaar", "Listening: two friends make a plan", [
  ["Pooja", "Hi Aman! Let's plan our stand for the school bazaar. It is on Friday from two o'clock to five o'clock."],
  ["Aman", "Good idea. What do we sell?"],
  ["Pooja", "Bookmarks. My grandmother grows lots of flowers in her garden. I press them between old books for two weeks. Then I glue them on small cards, and on Friday we sell them."],
  ["Aman", "Nice! And I can bring books. We can have a book swap. People bring an old book and take a different one."],
  ["Pooja", "I like that. The book swap is free, but the bookmarks cost money. How much is a bookmark?"],
  ["Aman", "I think twenty rupees is fair."],
  ["Pooja", "Okay. Who gives us a table?"],
  ["Aman", "Mr Sen, our art teacher. He has two tables in the art room, and he carries them to the hall on Thursday."],
  ["Pooja", "Perfect. We also need a sign and a box for the money."],
  ["Aman", "I always do the signs. You look after the money because you are good at maths."],
  ["Pooja", "Fine. When do we meet to set up the stand?"],
  ["Aman", "Let's meet on Thursday at four o'clock in the art room. And please bring a bag, not a plastic bag. We don't use plastic at our stand."],
  ["Pooja", "Of course. I never use plastic bags. See you on Thursday!"]
], { stimmen: { Pooja: "en-GB-LibbyNeural", Aman: "en-GB-RyanNeural" }, mal: 2 });

const B_LESEN = text("t1", "A job with bees", "Job profile", [
  "A beekeeper looks after bees. She keeps them in wooden boxes, which are called hives. A small farm often has ten to twenty hives. The bees make honey, and the beekeeper sells it at markets and in shops.",
  "A beekeeper's day starts early. In summer she usually gets up at five o'clock because the bees are calm in the morning. First she checks the hives. She wears a white suit and a hat with a net. Then she takes out the honey and cleans the boxes.",
  "In winter the work is different. The bees stay in the hive, and the beekeeper does not open it. She repairs boxes, makes new frames and talks to customers. Some beekeepers also teach school classes about bees.",
  "This job is not for everyone. A beekeeper needs patience and has to stay calm. A sting hurts, and some people are allergic. Most beekeepers learn the work from an experienced person, and many do a course for a few weeks. The pay is not high, but many people love the job.",
  "Bees are important for nature, too. They carry pollen from flower to flower, so fruit and vegetables grow. Many beekeepers do not use chemicals because they can harm the bees. That is why the job is a good example of sustainable work."
]);

const B_AUSHANG = "RAINBOW VALLEY TRUST – TREE PLANTING DAY\nHelp us to plant two hundred young trees on the hills above Kodaipet!\nWhen: Sunday, 12 October. We meet at the bus station at half past seven in the morning. A bus takes us to the hills.\nWhat to bring: a sun hat and a bottle of water. We give you gloves and a small spade.\nThe day is free, but we are happy about a donation of five euros for the trees. At one o'clock everybody gets a free vegetarian lunch.\nAt four o'clock a local band plays music, and you can buy a T-shirt of the project.\nPlease call us before Friday to say that you are coming.";

const p2b = probe(2, "B", {
  title: "Test 2 (R9): Exploring India", kurz: "Unit 2", scope: "Unit 2 · Listening, Reading, Grammar and vocabulary, Mediation, Writing", minutes: 60, hinweis: HINWEIS,
  texte: [B_HOEREN, B_LESEN],
  items: [
    ...teil("A Listening", [
      c("What do Pooja and Aman want to sell?", ["bookmarks with pressed flowers", "lemon drinks", "popcorn"], 0, { text: "h1" }),
      c("Who gives them a table?", ["Mr Sen", "Pooja's grandmother", "the headteacher"], 0, { text: "h1" }),
      c("How much is a bookmark?", ["twenty rupees", "ten rupees", "fifty rupees"], 0, { text: "h1" }),
      c("Who looks after the money?", ["Pooja", "Aman", "Mr Sen"], 0, { text: "h1" }),
      f("Listen again and complete the notes. Write one word or a number.", [
        feld("Pooja's grandmother grows lots of …", ["flowers"]),
        feld("Pooja presses the flowers for … weeks.", ["two", "2"]),
        feld("The bazaar ends at … o'clock.", ["five", "5", "5.00", "5:00"]),
        feld("Mr Sen carries the tables to the hall on …", ["Thursday"]),
        feld("Aman makes the …", ["sign", "signs", "the sign", "the signs"])
      ], { text: "h1", tolerant: true, hinweis: "Lies vor dem Hören die Notizen: Dann weißt du, auf welche Zahl oder welches Wort du achten musst." }),
      o("How do they get the bookmarks ready? Put the steps in the right order.", ["Pooja presses the flowers.", "Pooja glues the flowers on cards.", "They sell the bookmarks at the bazaar."], { text: "h1" })
    ]),
    ...teil("B Reading", [
      c("What kind of text is this?", ["a job profile", "a recipe", "a diary"], 0, { text: "t1" }),
      c("Why does a beekeeper get up early in summer?", ["The bees are calm in the morning.", "The honey is very cold.", "The shops open early."], 0, { text: "t1" }),
      c("What is true about winter?", ["The beekeeper does not open the hives.", "The beekeeper takes out honey every day.", "The bees fly from flower to flower."], 0, { text: "t1" }),
      z("In which lines does the text say what a beekeeper wears?", "t1", [[7, 8]], { hinweis: "Suche das Schlüsselwort aus der Frage (wears) im Text und lies dort genau." }),
      z("In which lines does the text say how most beekeepers learn the job?", "t1", [[16, 17]], { hinweis: "Suche die Stelle über das Lernen des Berufs." }),
      f("Complete the notes about the job. Write one word or a number.", [
        feld("The beekeeper sells honey at markets and in …", ["shops"]),
        feld("In summer she gets up at … o'clock.", ["five", "5"]),
        feld("In winter she repairs boxes and makes new …", ["frames"]),
        feld("Many beekeepers do not use … because they can harm the bees.", ["chemicals"])
      ], { text: "t1", tolerant: true }),
      a("Why is the beekeeper's job good for nature? Give two reasons from the text. Answer in English.", [
        kr("ein Grund aus dem Text", 1, "zum Beispiel: Bees carry pollen from flower to flower. / Fruit and vegetables grow because of the bees. / The beekeeper does not use chemicals."),
        kr("ein zweiter, anderer Grund aus dem Text", 1, "ein anderer der genannten Gründe"),
        kr("verständlich auf Englisch (eigene Worte oder passende Wörter aus dem Text; Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
      ], "The bees carry pollen, so fruit and vegetables grow, and the beekeeper does not use chemicals.", ["pollen|flower|fruit|vegetable|grow", "chemical|harm"], { text: "t1", zeilen: [19, 21] })
    ]),
    ...teil("C Grammar and vocabulary", [
      f("Complete the sentences with the simple present of the verbs in brackets.", [
        feld("Aman (live) … in a small town.", ["lives"]),
        feld("He (not / eat) … meat.", ["doesn't eat", "does not eat", "doesn’t eat"]),
        feld("My grandmother (water) … her plants every evening.", ["waters"]),
        feld("How often (you / recycle) … paper?", ["do you recycle"]),
        feld("The bus (not / stop) … here on Sundays.", ["doesn't stop", "does not stop", "doesn’t stop"]),
        feld("Pooja (wash) … her cup after lunch.", ["washes"])
      ], { hinweis: "Denk an das -s bei he, she, it (auch -es nach sh, ch, s) und an do und does in Fragen und Verneinungen." }),
      c("Which sentence is correct?", ["The children walk quietly to school every morning.", "The children walk to quietly school every morning.", "The children every morning to school walk quietly."], 0),
      c("___ Pooja ride her bike to school?", ["Does", "Do", "Is"], 0),
      c("Aman ___ late for school.", ["is never", "never is", "never be"], 0),
      f("Complete the sentences with do, does, don't or doesn't.", [
        feld("Where … your uncle work?", ["does"]),
        feld("I … like loud music. It hurts my ears.", ["don't", "do not", "don’t"])
      ], { hinweis: "Bei he, she, it brauchst du does und doesn't." }),
      m("Match the words with their meanings.", [["a salary", "the money you get every month for your work"], ["to reuse", "to use something again"], ["a boss", "the person who tells the workers what to do"]])
    ]),
    ...teil("D Mediation", [
      a("Your grandpa is on holiday in India. He does not speak English. He sees this notice and wants to join. He wants to know: what the day is about · when and where to meet · what to bring · what it costs and if there is food · how to say that he is coming. Tell him the important things in German (4 to 6 sentences). Do not translate word for word.", [
        kr("Aktion: Baumpflanztag (200 junge Bäume) am Sonntag, 12. Oktober", 2, "2 Punkte: Baumpflanzen und Tag · 1 Punkt: nur eines davon"),
        kr("Treffpunkt Busbahnhof um halb acht, ein Bus fährt zu den Hügeln", 1, "Ort und Uhrzeit"),
        kr("mitbringen: Sonnenhut und Wasserflasche (Handschuhe und Spaten gibt es dort)", 1, "mindestens Hut oder Wasser"),
        kr("kostenlos, Spende von 5 Euro willkommen; um 13 Uhr kostenloses vegetarisches Mittagessen", 2, "2 Punkte: Kosten und Essen · 1 Punkt: nur eines davon"),
        kr("Anmeldung per Anruf bis Freitag", 1, "Weg und Frist; eines davon genügt nicht für den Punkt"),
        kr("Sprachmittlung: verständliches Deutsch für den Opa, nicht Wort für Wort; Unwichtiges (Band, T-Shirt) fehlt", 1)
      ], "Es ist ein Baumpflanztag am Sonntag, dem 12. Oktober. Man trifft sich um halb acht am Busbahnhof, von dort fährt ein Bus zu den Hügeln. Du sollst einen Sonnenhut und eine Flasche Wasser mitbringen, Handschuhe und einen kleinen Spaten bekommst du dort. Mitmachen kostet nichts, aber über fünf Euro Spende freuen sie sich, und mittags gibt es ein kostenloses vegetarisches Essen. Vor Freitag musst du anrufen und sagen, dass du kommst.",
      ["Baum|Bäume", "Sonntag|12", "halb acht|7.30|7:30|Busbahnhof", "Hut|Wasser|Flasche", "kostenlos|frei|nichts|Spende", "Mittagessen|Essen|vegetarisch", "anrufen|Anruf|telefon", "Freitag"], { vorgabe: B_AUSHANG })
    ]),
    ...teil("E Writing", [
      s("Write a story about the four pictures (80 to 100 words).\nPicture 1: evening – Pooja's family at dinner – the light goes out.\nPicture 2: it is dark and quiet – Pooja looks for a torch – no batteries.\nPicture 3: Aman comes with an old lantern – neighbours sit outside – stars – stories.\nPicture 4: next morning – the light is back – Pooja and Aman smile and talk about the night.\nGive your story a title and write a beginning and an ending.", [
        kr("Inhalt", 5, "je Bild 1 Punkt (Bild 1 bis 4 sind erkennbar erzählt) · 1 Punkt für einen eigenen Anfang und einen Schluss"),
        kr("Textsorte und Aufbau", 2, "Titel, Anfang, Hauptteil, Schluss; Verbindungswörter (first, then, after that, but, because, at last)"),
        kr("Grammatik", 3, "Erzählzeit (simple past) durchgehalten, Satzstellung Subjekt–Verb–Objekt und Art und Weise – Ort – Zeit; Fehler stören das Verstehen kaum"),
        kr("Wortschatz", 2, "passende Wörter für Stimmung und Handlung, nicht nur good und nice"),
        kr("Rechtschreibung", 2, "häufige Wörter und die Wörter der Unit sind meist richtig geschrieben", { rs: true })
      ], { minWoerter: 60, plan: [
        { id: "title", label: "Title", hilfe: "Zum Beispiel: A night without light" },
        { id: "beginning", label: "Beginning", hilfe: "Wer? Wo? Wann? (simple past)" },
        { id: "pic12", label: "Pictures 1 and 2", hilfe: "Was ist das Problem?" },
        { id: "pic34", label: "Pictures 3 and 4", hilfe: "Wie wird das Problem gelöst?" },
        { id: "ending", label: "Ending", hilfe: "Wie geht es aus? Was denken die Personen?" }
      ] })
    ])
  ]
});

module.exports = { p2a, p2b };
