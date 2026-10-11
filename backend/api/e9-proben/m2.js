"use strict";

/**
 * Englisch 9M · Probe 2: Unit 2 – Exploring India (Variante A und B = Nachschreibprobe), Mittlere-Reife-Klasse
 * Teile: A Listening (12) · B Reading (12) · C Grammar and vocabulary (14) · D Mediation (8) · E Writing (14) = 60 Punkte,
 * 60 Minuten. Grammatik der Unit: simple present (Aussage, Verneinung, Frage mit do/does), word order (Subjekt–Verb–Objekt,
 * Art und Weise – Ort – Zeit). Wortschatz: Firma und Arbeit, nachhaltig leben, Kollokationen und phrasal verbs.
 * Alle Texte eigenständig für GRUMI erstellt, nichts aus dem Schulbuch oder aus Prüfungen.
 * Variante A: Interview mit dem Inhaber eines kleinen Gewürzversands (Hören; Jonas = Junge, Mr Banerjee = Mann),
 *   Übersetzerin/Übersetzer im Heimatort, Arbeiten aus der Kleinstadt (Lesen), englische E-Mail einer Pension an den Nachbarn
 *   Herrn Hoffmann (Sprachmittlung En -> De), Bildergeschichte „Drachenfest“ (Schreiben, simple past).
 *   Namen: Jonas, Mr Banerjee, Aditi, Nikhil Kulkarni, Kavya, Mr Hoffmann, Mrs Latha Joseph, Asha, Yash.
 *   Erfunden: Hill Spice Box, Dharmapet, Coral Lane Guesthouse, Pondipet.
 * Variante B: Radiointerview mit der Betreiberin eines Bücherbusses (Hören; Presenter = Mann, Ritu = junge Frau),
 *   „My week without plastic“ (Lesen), deutscher Aushang eines Jugendtreffs „Indischer Abend“ für den Austauschpartner
 *   (Sprachmittlung De -> En), Bildergeschichte „Videoanruf mit einer Partnerschule“ (Schreiben, simple past).
 *   Namen: Ritu, Ishaan, Gauri, Kunal, Aarav, Frau Desai, Vivek, Ms Joshi. Erfunden: Radio Hillside, Book Bus, Jugendtreff Südpark.
 * Gegengelesen am 11.10.2026: ein Name aus der Buchliste ersetzt (Schreibaufgabe A: jetzt Asha), Hörtexte in sich
 *   stimmig gemacht (A: Korrektur zur Laufzeit, B: Diesel statt Benzin), Aufgaben in Teil A verraten einander nichts mehr.
 *   Nacharbeit: Schreibumfang 90 bis 120 Wörter (A und B), Aushang in B ohne Wochentage (das Datum passt so in jedem
 *   Jahr), Raster der Sprachmittlung B wie in A mit 1 Punkt in der letzten Zeile, Wortschatz-Zuordnung nur noch mit
 *   Wörtern aus Wortliste und Wordbanks der Unit. Die Hörtexte sind seit der Vertonung fest – nicht mehr ändern.
 * Bleibt auf dem Server (Lösungen und Erwartungshorizont). Bausteine: bau.js.
 */
const { c, m, o, f, feld, z, a, kr, s, text, hoertext, teil, probeM } = require("./bau");

const HINWEIS = "Work on your own. Part A: your teacher plays the recording twice – read the tasks first. Read every task carefully. Arbeite allein. Den Hörtext spielt deine Lehrkraft zweimal für alle ab. Nach der Abgabe kannst du nichts mehr ändern.";

/* ------------------------------ Variante A ------------------------------ */
const A_HOEREN = hoertext("h1", "A small firm that sells spices abroad", "Listening: an interview for a school project", [
  ["Jonas", "Hello, Mr Banerjee. Thank you for taking the time for this video call. I'm Jonas, and I'm doing a school project about small firms that sell things abroad."],
  ["Mr Banerjee", "Hello, Jonas. I'm happy to help. Please ask me anything."],
  ["Jonas", "Your shop is called Hill Spice Box. Do you grow the spices on your own farm?"],
  ["Mr Banerjee", "No, I don't. People often think that, but I'm not a farmer. I buy the spices from about thirty small farms in the hills, and then we pack them and send them to our customers."],
  ["Jonas", "Oh, sorry, I thought you grew everything yourself. And where do your customers live?"],
  ["Mr Banerjee", "Mostly in Germany and England. Last year a lady in Hamburg ordered a big box of cardamom, and she wrote me a lovely email afterwards. I was really proud."],
  ["Jonas", "How long does a parcel take to Germany?"],
  ["Mr Banerjee", "Usually one week. No, wait, that's not always true. In the rainy season it can take two weeks, because the roads in the hills are so bad."],
  ["Jonas", "And do you work alone?"],
  ["Mr Banerjee", "Not at all. Two women from the village pack the boxes. My daughter Aditi makes our website. She lives in the city and works from her laptop, so we talk on the phone every day."],
  ["Jonas", "Is it difficult to run a firm like yours?"],
  ["Mr Banerjee", "Sometimes. The hardest thing is the post office. The parcels are heavy, and the price goes up every year. But I love my work, because the farmers get a fair price now. They don't have to move to the city to find a job."],
  ["Jonas", "That's a great reason. One last question. Do you use plastic?"],
  ["Mr Banerjee", "Not for the boxes. We use paper bags and metal tins. Customers can send the empty tin back, and we fill it again. Many people do that, and it makes me very happy."],
  ["Jonas", "Thank you so much. I'll send you my project when it's finished."],
  ["Mr Banerjee", "Please do. Good luck with it!"]
], { stimmen: { Jonas: "en-GB-RyanNeural", "Mr Banerjee": "en-US-GuyNeural" }, mal: 2 });

const A_LESEN = text("t1", "A translator in a small town", "Magazine article", [
  "Nikhil Kulkarni is twenty-six years old and lives in Dharmapet, a small town in the hills. He works as a translator for firms in Germany, France and Poland. His office is a tiny room above his parents' shop, but his customers never see it. All they know is that his translations are quick and correct.",
  "Nikhil's day does not look like a normal office day. Because India is several hours ahead of Europe, most of the emails arrive in the afternoon. In the morning he usually helps in the shop. Then he sits down at his laptop and drinks a cup of tea while he reads the first text. He often works until ten o'clock at night so that he can send everything back before the customers start their next day.",
  "The biggest problem is electricity. In the rainy season there may be a power cut for hours, and the internet goes down with it. Last summer Nikhil lost a whole day, and an angry customer wrote that he would never order from him again. Nikhil was very upset, so he spent his savings on a battery and a small solar panel. Now he can work even when a storm cuts the power.",
  "Many of his school friends have moved to big cities. Nikhil might earn more money there, but the rent is high and the streets are noisy. \"Here I see my family every day, and I can walk to the river after work,\" he says. \"I wouldn't change that for a bigger salary.\"",
  "Still, working alone has a downside. Some days Nikhil does not speak to anybody until dinner. That is why he started a small group at the town library. Every Wednesday, a web designer, an online English teacher and he meet there to work side by side. While they work, they share tips, and sometimes they just have a chat.",
  "The town is changing, too. The mayor wants fast internet for every street, which might bring some young people back from the cities. On Saturdays Nikhil already teaches a free evening class for teenagers who want to learn English for online jobs. \"Nobody has to leave home to work in a connected world,\" he says."
]);

const A_MAIL = "Subject: Your booking at Coral Lane Guesthouse, Pondipet\nDear Mr Hoffmann,\nThank you for your booking. We are happy that you and your wife are coming to stay with us from 3 to 9 November.\nWe have two rooms on the ground floor, so you do not need to climb any stairs. Room 2 looks onto the garden, and Room 3 has a bigger bathroom. Our house is painted yellow, and our dog Bruno loves visitors.\nBreakfast is served from half past seven to ten o'clock. We have fruit, eggs, fresh bread and several vegetarian dishes. Please tell us the evening before if you want something special.\nIf you like, our driver Mr Thomas can pick you up from the airport. The drive takes about 40 minutes and costs 900 rupees. Please send us your flight number. The Wi-Fi in the house is quite slow in the evening.\nYou can cancel your booking free of charge until 14 days before you arrive. After that we have to charge the first night.\nKind regards,\nLatha Joseph";

const m2a = probeM(2, "A", {
  title: "Test 2 (M9): Exploring India", kurz: "Unit 2", scope: "Unit 2 · Listening, Reading, Grammar and vocabulary, Mediation, Writing", minutes: 60, hinweis: HINWEIS,
  texte: [A_HOEREN, A_LESEN],
  items: [
    ...teil("A Listening", [
      c("Why does Jonas say sorry to Mr Banerjee?", ["He had a wrong idea about the firm.", "He is late for the video call.", "He cannot hear Mr Banerjee very well."], 0, { text: "h1" }),
      c("How long does a parcel to Germany take in the rainy season?", ["two weeks", "one week", "three weeks"], 0, { text: "h1" }),
      c("Why does Mr Banerjee love his work?", ["He helps the farmers to get a fair price.", "He earns a lot of money with every parcel.", "He can work in the city with his daughter."], 0, { text: "h1" }),
      c("What can customers do with an empty tin?", ["They can send it back to be filled again.", "They can throw it into a paper bag.", "They can use it to pack their own parcels."], 0, { text: "h1" }),
      f("Listen again and complete the notes. Write one or two words or a number.", [
        feld("Mr Banerjee buys spices from about … small farms.", ["thirty", "30"]),
        feld("Last year a lady from … ordered a big box of cardamom.", ["Hamburg"]),
        feld("Number of women from the village who pack the boxes:", ["two", "2"]),
        feld("His daughter makes the firm's …", ["website", "the website", "web site", "webpage", "web page", "homepage"]),
        feld("The hardest thing for his firm is the …", ["post office", "the post office", "post", "the post"])
      ], { text: "h1", tolerant: true, hinweis: "Lies vor dem Hören die Notizen: Dann weißt du, auf welche Zahl oder welches Wort du achten musst." }),
      o("How does a spice get to a customer? Put the steps in the right order.", ["Mr Banerjee buys the spices from the farmers.", "Women from the village pack the boxes.", "The parcel travels to the customer in Europe."], { text: "h1" })
    ]),
    ...teil("B Reading", [
      c("Where is Nikhil's office?", ["in a small room above his parents' shop", "in a big building in the city", "in the town library"], 0, { text: "t1" }),
      c("What does Nikhil's decision to stay in Dharmapet show?", ["Family and a quiet life are more important to him than a bigger salary.", "He cannot find any work in the big cities.", "He is afraid of living far away from the river."], 0, { text: "t1" }),
      c("Why did Nikhil start the group at the library?", ["He wanted to meet other people while he works.", "The library needed help with its computers.", "The mayor asked him to teach a class there."], 0, { text: "t1" }),
      z("In which lines does the text say how Nikhil solved the problem with the electricity?", "t1", [[18, 20]], { hinweis: "Suche im Text die Stelle über den Strom (electricity, power cut) und lies dort weiter: Was hat Nikhil gekauft?" }),
      z("In which lines does the text say in which countries Nikhil's customers live?", "t1", [[2, 3]], { hinweis: "Suche den Anfang des Textes." }),
      f("Complete the notes about Nikhil. Write one word or a number.", [
        feld("Nikhil reads the first text while he drinks a cup of …", ["tea"]),
        feld("Last summer he lost a whole … because of a power cut.", ["day"]),
        feld("The group at the library meets every …", ["Wednesday"]),
        feld("In his free evening class teenagers learn … for online jobs.", ["English"])
      ], { text: "t1", tolerant: true }),
      a("Why is Nikhil's work a good example of working in a connected world? Give two reasons from the text. Answer in English.", [
        kr("ein Grund aus dem Text", 1, "zum Beispiel: His customers live in other countries and he works with them by email. / He can work from a small town. / He meets people who work online, too."),
        kr("ein zweiter, anderer Grund aus dem Text", 1, "ein anderer der genannten Gründe, zum Beispiel: He teaches teenagers English for online jobs. / The mayor wants fast internet for every street."),
        kr("verständlich auf Englisch (eigene Worte oder passende Wörter aus dem Text; Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
      ], "His customers live in Germany, France and Poland, but he works for them from a small town by email, and he teaches teenagers English for online jobs.", ["customer|email|firm|Germany|Europe|abroad", "small town|laptop|internet|online|teach|class"], { text: "t1", zeilen: [2, 36] })
    ]),
    ...teil("C Grammar and vocabulary", [
      f("Complete the sentences with the simple present of the verbs in brackets.", [
        feld("Kavya (have) … a small stall at the weekly market.", ["has", "has got"]),
        feld("Where (your cousin / live) …?", ["does your cousin live"]),
        feld("The farmers (not / earn) … much money in the rainy season.", ["don't earn", "do not earn", "don’t earn"]),
        feld("My brother always (go) … to the library by bike.", ["goes"]),
        feld("How often (the shop / close) … for repairs?", ["does the shop close"]),
        feld("My mother (not / have) … time for lunch on Mondays.", ["doesn't have", "does not have", "doesn’t have", "hasn't got", "has not got"])
      ], { hinweis: "Denk an has und goes bei he, she, it sowie an do und does in Fragen und Verneinungen. Nach does und doesn't steht das Verb ohne -s." }),
      c("Which sentence is correct?", ["Our teacher explains the task clearly to the class every morning.", "Our teacher explains clearly the task to the class every morning.", "Our teacher the task explains clearly to the class every morning."], 0),
      c("___ the farmers sell their spices at the local market?", ["Do", "Does", "Are"], 0),
      c("We ___ plastic bags in our shop.", ["don't use", "doesn't use", "not use"], 0),
      f("Complete the task. Write one whole sentence.", [
        feld("Make the sentence negative: My aunt works in a bank on Saturdays.", ["My aunt doesn't work in a bank on Saturdays.", "My aunt does not work in a bank on Saturdays.", "My aunt doesn’t work in a bank on Saturdays."], { breit: true }),
        feld("Make a question: The market opens at seven o'clock. (What time …)", ["What time does the market open?"], { breit: true })
      ], { hinweis: "Verneinung und Frage mit do/does: danach steht das Verb ohne -s." }),
      m("Match the words with their meanings.", [["to throw away", "to put something in the bin because you do not want it"], ["working hours", "the time of the day when people do their job"], ["to look forward to", "to be happy about something that is going to happen"]])
    ]),
    ...teil("D Mediation", [
      a("Your neighbour Mr Hoffmann is seventy-two. He does not speak English, he has a bad knee and eats no meat. He wants to stay at this guesthouse in India with his wife. He wants to know: Is there a room without stairs? · When is breakfast, and is there vegetarian food? · How can they get from the airport to the house? · Can they cancel the booking? Tell him the important things in German (4 to 6 sentences). Do not translate word for word.", [
        kr("Zimmer: zwei Zimmer im Erdgeschoss, keine Treppen", 1, "Erdgeschoss bzw. ohne Treppen"),
        kr("Frühstück: von halb acht bis zehn Uhr, auch vegetarische Gerichte; Sonderwünsche am Vorabend sagen", 2, "2 Punkte: Zeit und vegetarisch · 1 Punkt: nur eines davon"),
        kr("Abholung: Fahrer holt vom Flughafen ab, ca. 40 Minuten, 900 Rupien, Flugnummer schicken", 2, "2 Punkte: Abholung mit Dauer oder Preis und Flugnummer · 1 Punkt: nur Abholung"),
        kr("Stornierung: kostenlos bis 14 Tage vor der Ankunft, danach wird die erste Nacht berechnet", 2, "2 Punkte: Frist und Folge · 1 Punkt: nur eines davon"),
        kr("Sprachmittlung: verständliches Deutsch für Herrn Hoffmann, nicht Wort für Wort; Unwichtiges (Hund, gelbes Haus, langsames WLAN) fehlt", 1)
      ], "Es gibt zwei Zimmer im Erdgeschoss, Sie müssen also keine Treppen steigen. Frühstück gibt es von halb acht bis zehn Uhr, auch mit vegetarischen Gerichten; besondere Wünsche sagen Sie am Abend vorher. Der Fahrer der Pension holt Sie am Flughafen ab, die Fahrt dauert etwa 40 Minuten und kostet 900 Rupien, dafür brauchen die Leute Ihre Flugnummer. Sie können kostenlos stornieren, wenn Sie das bis 14 Tage vor der Ankunft tun, später wird die erste Nacht berechnet.",
      ["Erdgeschoss|Treppe", "halb acht|7.30|7:30|zehn", "vegetarisch", "Flughafen|abhol|Fahrer", "40|900|Flugnummer", "kostenlos|stornier", "14|Nacht"], { vorgabe: A_MAIL })
    ]),
    ...teil("E Writing", [
      s("Write a story about the pictures (90 to 120 words).\nPicture 1: the day of the kite festival – Asha and her grandfather on the roof – the sky is full of kites – Asha has a new blue kite.\nPicture 2: the wind stops – the string breaks – the blue kite falls into a tall tree in the neighbour's garden.\nPicture 3: Yash, the boy next door, comes with a long bamboo pole – Asha and Yash try to get the kite down – grandfather laughs.\nPicture 4: the kite is free – the three of them stand on the roof and fly it together.\nYour story must include: a title · what happened in each picture · how Asha felt in the middle of the story · how the story ended and why Asha was happy.\nWrite in three paragraphs (beginning, middle, end).", [
        kr("Inhalt", 5, "je Bild 1 Punkt (Bild 1 bis 4 sind erkennbar erzählt) · 1 Punkt für Titel, Gefühle von Asha in der Mitte und einen Schluss mit Begründung (zwei der drei Punkte genügen für den Punkt, wenn sie klar erzählt sind)"),
        kr("Textsorte und Aufbau", 2, "Titel und drei Absätze (Anfang, Mitte, Schluss); Verbindungswörter und Nebensätze (first, then, after that, but, because, although, while, in the end)"),
        kr("Grammatik", 3, "Erzählzeit (simple past) durchgehalten, unregelmäßige Formen (fell, broke, came, stood), Satzstellung Subjekt–Verb–Objekt und Art und Weise – Ort – Zeit; Fehler stören das Verstehen kaum"),
        kr("Wortschatz", 2, "passende, abwechslungsreiche Wörter für Handlung und Gefühle, nicht nur good, nice und happy"),
        kr("Rechtschreibung", 2, "häufige Wörter und die Wörter der Unit sind meist richtig geschrieben", { rs: true })
      ], { minWoerter: 90, plan: [
        { id: "title", label: "Title", hilfe: "For example: The blue kite in the tree" },
        { id: "beginning", label: "Beginning (Picture 1)", hilfe: "Who? Where? When? What was the mood like? (simple past)" },
        { id: "problem", label: "Picture 2: the problem", hilfe: "What went wrong? How did Asha feel?" },
        { id: "solution", label: "Picture 3: the solution", hilfe: "Who helped? What did the two of them do? What did grandfather do?" },
        { id: "end", label: "Picture 4 and ending", hilfe: "How did the story end? Why was Asha happy?" },
        { id: "links", label: "Linking words", hilfe: "first, then, after that, but, because, although, while, in the end" }
      ] })
    ])
  ]
});

/* ------------------------------ Variante B ------------------------------ */
const B_HOEREN = hoertext("h1", "A bus full of books", "Listening: a radio interview", [
  ["Presenter", "Good morning, and welcome to Young Voices on Radio Hillside. My guest today is Ritu, who runs the Book Bus. Welcome, Ritu."],
  ["Ritu", "Thanks for having me. I'm a bit nervous, to be honest, because this is my first time on the radio."],
  ["Presenter", "Don't worry. So, the Book Bus is an old school bus. Did you start it ten years ago?"],
  ["Ritu", "Oh, no, not ten years. It was four years ago. My brother and I painted an old bus yellow and put shelves inside."],
  ["Presenter", "And where does it go?"],
  ["Ritu", "It visits six villages, one village every day from Monday to Saturday."],
  ["Presenter", "How much does it cost to borrow a book?"],
  ["Ritu", "Nothing. It's completely free. People often think they must pay a small fee, but we never ask for money. A local bank pays for the diesel, and a company gives us new books every year."],
  ["Presenter", "That's wonderful. Is the bus good for the environment, too?"],
  ["Ritu", "We try. Last spring we put a solar panel on the roof. Now the lights and the fan run on solar power. Only the engine still uses diesel, which is a pity. We hope to get an electric bus one day, but it's too expensive for now."],
  ["Presenter", "Who comes to the bus?"],
  ["Ritu", "Mostly children, but grandparents come, too. One old man could not read at all. Now he reads a story to his grandchildren every evening. When he told me that, I almost cried."],
  ["Presenter", "What a lovely story. What is the biggest problem?"],
  ["Ritu", "In the rainy season the roads are very muddy, so we sometimes can't reach the last village. Then the children wait at the road, and afterwards they walk home very quietly."],
  ["Presenter", "Can our listeners help?"],
  ["Ritu", "Yes, please! They can give us old picture books. Please bring them to the market square on Friday between three and five."],
  ["Presenter", "Thank you, Ritu, and come back soon."]
], { stimmen: { Presenter: "en-US-GuyNeural", Ritu: "en-GB-LibbyNeural" }, mal: 2 });

const B_LESEN = text("t1", "My week without plastic", "Blog post by Ishaan", [
  "Last month I decided to live without single-use plastic for one week. My sister Gauri laughed and said that I would give up on the second day. Although I don't like to lose a bet, I accepted, and I started on Monday.",
  "Monday was harder than I expected. In our kitchen, almost everything came in plastic: the rice, the biscuits, even the tea. So I took two steel boxes and three glass jars to the market. The woman at the vegetable stall looked surprised at first, but she filled them with rice and lentils and gave me a small discount because I came without a bag.",
  "The bathroom was the next problem. I found a bar of soap and a bamboo toothbrush at a small shop. While my little brother thought that the soap smelled like a flower garden, my mother said that it might not last long. She was right: after three days it had melted in the wet dish.",
  "On Wednesday I forgot my lunch box. In the school canteen, all the snacks came in plastic cups, so I sat there and looked at my friends. Then Kunal opened his steel tin, broke his sandwich in two and put half of it on my table without a word. I have never enjoyed a sandwich as much as that one.",
  "By Sunday I had a clear result. Normally our family fills a big bin every two days, but my own rubbish for the whole week fitted into a small box. I failed once, on Friday, when a friend gave me a drink with a plastic straw and I was too shy to say no. Gauri stopped laughing on Saturday. On Sunday she asked me where she could buy a steel bottle.",
  "I might not manage a whole plastic-free life, but I will keep my jars and boxes so that I can buy rice without a bag every week. Maybe you could try it for one day, too. You may be surprised how much you can change."
]);

const B_AUSHANG = "JUGENDTREFF SÜDPARK – INDISCHER ABEND\nLiebe Jugendliche, liebe Eltern,\nam 21. November laden wir von 18 bis 21 Uhr zu einem indischen Abend in den Jugendtreff Südpark ein. Der Eingang liegt im Hof, nicht an der Straße.\nUnsere Gastköchin Frau Desai kocht mit euch drei vegetarische Gerichte. Das Kochen beginnt um 18 Uhr, gegessen wird gegen halb acht gemeinsam an einem langen Tisch. Danach zeigt ein Mitarbeiter Fotos von einer Reise durch Indien, und es gibt ein kleines Quiz mit Preisen.\nDer Abend kostet 4 Euro pro Person für die Zutaten. Bitte bringt eine Schürze oder ein altes T-Shirt und eine eigene Dose für die Reste mit.\nDie Garderobe ist im Keller. Fahrräder bitte nur am Zaun abstellen, Parkplätze gibt es leider nicht.\nAnmeldung bis zum 19. November in der Liste an der Tür des Treffs oder per Mail.";

const m2b = probeM(2, "B", {
  title: "Test 2 (M9): Exploring India", kurz: "Unit 2", scope: "Unit 2 · Listening, Reading, Grammar and vocabulary, Mediation, Writing", minutes: 60, hinweis: HINWEIS,
  texte: [B_HOEREN, B_LESEN],
  items: [
    ...teil("A Listening", [
      c("When did Ritu start the Book Bus?", ["four years ago", "ten years ago", "two years ago"], 0, { text: "h1" }),
      c("How much do people pay when they borrow a book from the Book Bus?", ["nothing", "a small fee", "one old picture book"], 0, { text: "h1" }),
      c("What has the solar panel changed?", ["The lights and the fan do not need diesel any more.", "People can charge their phones at the bus.", "The bus can stay longer in every village."], 0, { text: "h1" }),
      c("How do the children feel when the bus cannot reach their village?", ["sad", "angry with Ritu", "glad to go home"], 0, { text: "h1" }),
      f("Listen again and complete the notes. Write one or two words or a number.", [
        feld("The Book Bus visits … villages.", ["six", "6"]),
        feld("Ritu and her … painted the old bus yellow.", ["brother", "her brother"]),
        feld("A local … pays for the diesel.", ["bank", "a bank"]),
        feld("Only the … still uses diesel.", ["engine", "the engine", "motor", "the motor"]),
        feld("Listeners can bring old picture books to the … on Friday.", ["market square", "the market square", "marketplace", "market place", "market", "the market"])
      ], { text: "h1", tolerant: true, hinweis: "Lies vor dem Hören die Notizen: Dann weißt du, auf welche Zahl oder welches Wort du achten musst." }),
      o("How did the Book Bus change? Put the steps in the right order.", ["Ritu starts the Book Bus with an old school bus.", "The bus gets a solar panel on the roof.", "Ritu hopes to get an electric bus one day."], { text: "h1" })
    ]),
    ...teil("B Reading", [
      c("What was the problem on Monday?", ["Almost everything in the kitchen came in plastic.", "The market was closed.", "Gauri took Ishaan's jars away."], 0, { text: "t1" }),
      c("How does Gauri feel about the week at the end?", ["She respects what her brother did.", "She is sure that he will fail soon.", "She is angry about all the plastic at school."], 0, { text: "t1" }),
      c("Why did Kunal share his sandwich with Ishaan?", ["He saw that Ishaan had nothing to eat.", "He did not like the food in the canteen.", "Ishaan had asked him for it."], 0, { text: "t1" }),
      z("In which lines does the text say what Ishaan took to the market?", "t1", [[7, 8]], { hinweis: "Suche das Schlüsselwort aus der Frage (market) im Text und lies dort genau." }),
      z("In which lines does the text say what happened to the soap?", "t1", [[14, 15]], { hinweis: "Suche das Wort soap im Text." }),
      f("Complete the notes about the week. Write one word or a number.", [
        feld("Ishaan wanted to live without single-use plastic for one …", ["week"]),
        feld("He took two steel boxes and three glass … to the market.", ["jars"]),
        feld("After three days the soap had … in the wet dish.", ["melted"]),
        feld("Gauri asked where she could buy a steel …", ["bottle"])
      ], { text: "t1", tolerant: true }),
      a("Why was the week a success for Ishaan although he failed once? Give two reasons from the text. Answer in English.", [
        kr("ein Grund aus dem Text", 1, "zum Beispiel: His rubbish for the whole week fitted into a small box. / Gauri stopped laughing and wanted a steel bottle."),
        kr("ein zweiter, anderer Grund aus dem Text", 1, "ein anderer der genannten Gründe, zum Beispiel: He will keep his jars and boxes. / He wants to buy rice without a bag every week."),
        kr("verständlich auf Englisch (eigene Worte oder passende Wörter aus dem Text; Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
      ], "His rubbish for the whole week fitted into a small box, and he wants to keep his jars and boxes so that he can buy rice without a bag.", ["rubbish|box|bin|small", "keep|jars|boxes|rice|Gauri|bottle|sister"], { text: "t1", zeilen: [21, 29] })
    ]),
    ...teil("C Grammar and vocabulary", [
      f("Complete the sentences with the simple present of the verbs in brackets.", [
        feld("Ishaan (carry) … his own bottle to school every day.", ["carries"]),
        feld("What time (your sister / get up) … on Sundays?", ["does your sister get up"]),
        feld("The bus (not / go) … to the village on Sundays.", ["doesn't go", "does not go", "doesn’t go"]),
        feld("My grandfather always (do) … the shopping on Saturday.", ["does"]),
        feld("Why (the children / wait) … at the road?", ["do the children wait"]),
        feld("We (not / buy) … bottled water in our house.", ["don't buy", "do not buy", "don’t buy"])
      ], { hinweis: "Denk an does bei he, she, it sowie an do und does in Fragen und Verneinungen. Nach do/does und don't/doesn't steht das Verb ohne -s." }),
      c("Which sentence is correct?", ["The children read their books quietly in the library after school.", "The children read quietly their books in the library after school.", "The children read in the library their books quietly after school."], 0),
      c("___ your cousins live in a big city?", ["Do", "Does", "Is"], 0),
      c("My father ___ to work by bus.", ["usually goes", "goes usually", "usually go"], 0),
      f("Complete the task. Write one whole sentence.", [
        feld("Make the sentence negative: The market opens on Mondays.", ["The market doesn't open on Mondays.", "The market does not open on Mondays.", "The market doesn’t open on Mondays."], { breit: true }),
        feld("Put the words in the right order: walks / the old man / his dog / slowly / in the park / every evening", ["The old man walks his dog slowly in the park every evening.", "Every evening the old man walks his dog slowly in the park.", "Every evening, the old man walks his dog slowly in the park.", "The old man slowly walks his dog in the park every evening.", "Every evening the old man slowly walks his dog in the park.", "Every evening, the old man slowly walks his dog in the park."], { breit: true })
      ], { hinweis: "Verneinung mit doesn't: danach steht das Verb ohne -s. Reihenfolge: Subjekt – Verb – Objekt, dann Art und Weise – Ort – Zeit." }),
      m("Match the words with their meanings.", [["can't stand", "not to like something at all"], ["to switch off", "to stop a light or a machine by pressing a button"], ["part-time", "for only some hours of the day or the week"]])
    ]),
    ...teil("D Mediation", [
      a("Your exchange partner Aarav is visiting you in Germany. He does not read German and eats no meat. He sees this notice in your youth club and wants to join. He wants to know: What happens there? · When and where is it? · What does it cost? · What must he bring? · How can he sign up? Write him a message in English (4 to 6 sentences). Do not translate word for word.", [
        kr("Aktion: gemeinsam indisch (vegetarisch) kochen und essen, danach Fotos und Quiz", 2, "2 Punkte: Kochen/Essen und vegetarisch oder Fotos/Quiz · 1 Punkt: nur eines davon"),
        kr("Zeit und Ort: 21. November, 18 bis 21 Uhr, Jugendtreff Südpark", 2, "2 Punkte: Datum, Uhrzeit und Ort · 1 Punkt: nur das Datum (mit oder ohne Uhrzeit) oder nur der Ort; der Eingang im Hof darf genannt werden, muss aber nicht"),
        kr("Kosten: 4 Euro pro Person für die Zutaten", 1, "Preis"),
        kr("mitbringen: Schürze oder altes T-Shirt und eine Dose für die Reste", 1, "mindestens eines der beiden"),
        kr("Anmeldung: bis 19. November, in der Liste an der Tür oder per Mail", 1, "Frist und Weg; die Frist allein genügt für den Punkt"),
        kr("Sprachmittlung: verständliches Englisch für Aarav, nicht Wort für Wort; Unwichtiges (Garderobe, Fahrräder, Parkplätze) fehlt", 1)
      ], "On 21 November there is an Indian evening at the youth club Südpark from six to nine. You cook three vegetarian dishes with a guest cook and eat them together. After that there are photos from a trip to India and a small quiz. It costs four euros for the food. Bring an apron or an old T-shirt and a box for the leftovers. You must sign up by 19 November on the list at the door or by email.",
      ["cook|dish|eat|food", "21|November", "youth club|Südpark|six|18|nine", "four|4|euro", "apron|T-shirt|box|leftover", "sign up|register|list|email|mail|19", "vegetarian|photo|quiz"], { vorgabe: B_AUSHANG })
    ]),
    ...teil("E Writing", [
      s("Write a story about the pictures (90 to 120 words).\nPicture 1: a Tuesday afternoon – the computer room of an Indian school – Vivek and his class wait for the first video call with a partner school in Scotland – everybody is excited.\nPicture 2: the screen suddenly goes black – the internet is gone – Vivek feels worried and the children look at each other.\nPicture 3: Ms Joshi, the teacher, uses her phone as a hotspot – the picture comes back – the Scottish children wave.\nPicture 4: the two classes talk, laugh and show each other their classrooms – Vivek makes a new friend.\nYour story must include: a title · what happened in each picture · how Vivek felt in the middle of the story · how the story ended and why Vivek was happy.\nWrite in three paragraphs (beginning, middle, end).", [
        kr("Inhalt", 5, "je Bild 1 Punkt (Bild 1 bis 4 sind erkennbar erzählt) · 1 Punkt für Titel, Gefühle von Vivek in der Mitte und einen Schluss mit Begründung (zwei der drei Punkte genügen für den Punkt, wenn sie klar erzählt sind)"),
        kr("Textsorte und Aufbau", 2, "Titel und drei Absätze (Anfang, Mitte, Schluss); Verbindungswörter und Nebensätze (first, then, after that, but, because, although, while, in the end)"),
        kr("Grammatik", 3, "Erzählzeit (simple past) durchgehalten, unregelmäßige Formen (went, came, felt, made), Satzstellung Subjekt–Verb–Objekt und Art und Weise – Ort – Zeit; Fehler stören das Verstehen kaum"),
        kr("Wortschatz", 2, "passende, abwechslungsreiche Wörter für Handlung, Technik und Gefühle, nicht nur good, nice und happy"),
        kr("Rechtschreibung", 2, "häufige Wörter und die Wörter der Unit sind meist richtig geschrieben", { rs: true })
      ], { minWoerter: 90, plan: [
        { id: "title", label: "Title", hilfe: "For example: A call across the world" },
        { id: "beginning", label: "Beginning (Picture 1)", hilfe: "Who? Where? When? What was the mood like? (simple past)" },
        { id: "problem", label: "Picture 2: the problem", hilfe: "What went wrong? How did Vivek feel?" },
        { id: "solution", label: "Picture 3: the solution", hilfe: "Who helped? What did the teacher do?" },
        { id: "end", label: "Picture 4 and ending", hilfe: "How did the story end? Why was Vivek happy?" },
        { id: "links", label: "Linking words", hilfe: "first, then, after that, but, because, although, while, in the end" }
      ] })
    ])
  ]
});

module.exports = { m2a, m2b };
