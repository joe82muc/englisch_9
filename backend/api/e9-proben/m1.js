"use strict";

/**
 * Englisch 9M · Probe 1: Unit 1 – Around Australia (Mittlere-Reife-Klasse)
 * Teile: A Listening (12) · B Reading (12) · C Grammar and vocabulary (14) · D Mediation (8) · E Writing (14) = 60 Punkte,
 * 60 Minuten. Grammatik der Unit: simple past, will-future, if-clauses Typ I (auch mit can und Aufforderung),
 * present progressive. Wortschatz: von Erlebnissen erzählen, krank sein.
 * Variante A: Woche auf der Schaffarm des Onkels, Hitzeschwindel (Hören), Seilbrücke für Koalas (Lesen),
 * E-Mail einer Farm-Pension über Hitzeregeln (Sprachmittlung Englisch -> Deutsch), Blogeintrag über einen Stadttag (Schreiben).
 * Variante B (Nachschreibprobe): Fahrradsturz auf dem Lyrebird Trail, Telefonat mit der Tante (Hören), Bäume für
 * Tarni Creek (Lesen), Besucherinformation einer Burg für die Eltern der Austauschpartnerin (Sprachmittlung
 * Deutsch -> Englisch), E-Mail über ein Open-Air-Konzert im Regen (Schreiben).
 * Erfundene Orte: Wattle Flat, Gum Road, Wombat Hollow, Burrawong, Tarni Creek, Lyrebird Trail, Burg Hohenwinkel; Namen:
 * Tamsin, Callum, Priya Nair, Ellis Brandt, Mr Costa, Nell Tully, Rory, Carol, Kai, Mr Lawson, Ruth Menzies, Kayla Ross,
 * Sienna, Wagner.
 * Gegengelesen am 11.10.2026: sechs Namen ersetzt, die in den Buch- und Modullisten oder in p1.js stehen,
 * Grammatiklücken mit Zeitangabe eindeutig gemacht, Aufgaben in Teil A verraten einander nichts mehr. Nacharbeit:
 * Sprachmittlung B neu (vorher Hitzeregeln wie in A), Wortschatz-Zuordnung nur noch mit Wörtern aus Wortliste und
 * Wordbanks der Unit. Die Hörtexte sind seit der Vertonung fest – nicht mehr ändern.
 * Bleibt auf dem Server (Lösungen und Erwartungshorizont). Bausteine: bau.js.
 */
const { c, m, o, f, feld, z, a, kr, s, text, hoertext, teil, probeM } = require("./bau");

const HINWEIS = "Work on your own. Part A: your teacher plays the recording twice – read the tasks first. Read every task carefully. Arbeite allein. Den Hörtext spielt deine Lehrkraft zweimal für alle ab. Nach der Abgabe kannst du nichts mehr ändern.";

/* ------------------------------ Variante A ------------------------------ */
const A_HOEREN = hoertext("h1", "A week on the farm", "Listening: two friends talk", [
  ["Callum", "Hi Tamsin! You're back at last. Mum told me you spent a week on your uncle's sheep farm. Was it as boring as you expected?"],
  ["Tamsin", "Hi Callum! No, it was great, although I was really nervous on the first day. We arrived on Tuesday – no, sorry, on Wednesday, because our flight was late."],
  ["Callum", "Wednesday, okay. So what did you do all day?"],
  ["Tamsin", "I got up at six every morning and helped my uncle Hugh with the sheep. He's building a new water tank at the moment, so I carried a lot of pipes, too."],
  ["Callum", "That sounds like hard work. Did you get a sunburn?"],
  ["Tamsin", "Worse, I'm afraid. On Friday it was forty degrees, and I forgot my hat. Around noon I felt dizzy, and I had a terrible headache."],
  ["Callum", "Oh no! Did your uncle take you to a doctor?"],
  ["Tamsin", "No, he thought I was just tired. But my aunt took my temperature and put me in the cool kitchen. She gave me water with a pinch of salt and a wet cloth for my neck."],
  ["Callum", "And did that help?"],
  ["Tamsin", "Yes, after an hour I felt fine again. My aunt said: If you drink a glass of water every hour, you won't get dizzy. Now I always carry a bottle with me."],
  ["Callum", "Wise words. Will you go back one day?"],
  ["Tamsin", "Definitely. At Christmas, I think. If my parents agree, I'll stay for two weeks. Why don't you come, too? Uncle Hugh says there's always work for another pair of hands."],
  ["Callum", "Honestly, I'd love to. I'm not sure my mum will say yes, though. If I do the washing-up for a month, she'll probably agree."],
  ["Tamsin", "Ha, good plan! I'll send you some photos tonight, and you can show her the kangaroos."]
], { stimmen: { Callum: "en-GB-RyanNeural", Tamsin: "en-GB-LibbyNeural" }, mal: 2 });

const A_LESEN = text("t1", "A bridge for the koalas", "Newspaper article", [
  "When Year 9 at Wattle Flat High School heard that three koalas had been hit by cars on Gum Road last year, they decided to act. \"We often see koalas near the school, and we did not want to read about another accident,\" says class captain Priya Nair, 15.",
  "The students started with research. In the evenings they counted how many koalas crossed the road and sent their results to the town council. They also asked a wildlife carer, Dr Ellis Brandt, for advice. She explained that koalas cross the road because the trees on both sides are cut off from each other. \"A rope bridge above the road may help, although it is not cheap,\" she said.",
  "Money was the biggest problem. The bridge would cost far more than the school had. So the class organised a sponsored walk, a cake stall and an evening of music. While some students sold lemonade, others told the visitors why the koalas needed help. In only six weeks they collected enough money for the ropes and the poles. The council promised to pay for the building work itself, so that the bridge could be ready before summer.",
  "Not everybody liked the idea. One neighbour, Mr Costa, thought that the bridge was ugly and might scare away the tourists. Priya invited him to a meeting and showed him the numbers. Mr Costa listened and changed his mind. \"I did not know that so many koalas cross here,\" he said. \"I may still not love the look of it, but I will help to build it.\"",
  "Last Saturday the first rope was fixed above Gum Road. Camera traps will show whether the koalas use it. It might take a few months before the first one climbs across, because wild animals need time to trust something new.",
  "The students are already planning the next step. If the bridge works, they will write a guide for other schools, so that other towns can build one, too. \"We are not scientists,\" says Priya, \"but we showed that young people can change things if they stay patient.\""
]);

const A_MAIL = "Dear Mrs Wagner, thank you for your booking. We are happy to welcome you and your family at Wombat Hollow Farm Stay from 3 to 10 January. Please arrive between 2 and 4 pm; the road from the highway is gravel, so drive slowly. Summer days here can be very hot, so please bring a hat, sun cream and a water bottle (at least one litre) for each person. Our activities for children start at 7 am, before the heat, and from noon to 3 pm everybody rests in the shade. If somebody feels dizzy or sick, please tell Mr Tully at once; the nearest doctor is forty minutes away by car. By the way, our hens lay about twenty eggs a day, and Wi-Fi works only in the main house. Payment is by card on arrival. Kind regards, Nell Tully";

const m1a = probeM(1, "A", {
  title: "Test 1 (M9): Around Australia", kurz: "Unit 1", scope: "Unit 1 · Listening, Reading, Grammar and vocabulary, Mediation, Writing", minutes: 60, hinweis: HINWEIS,
  texte: [A_HOEREN, A_LESEN],
  items: [
    ...teil("A Listening", [
      c("On which day did Tamsin arrive at the farm?", ["on Wednesday", "on Tuesday", "on Friday"], 0, { text: "h1" }),
      c("What is Tamsin's uncle doing at the moment?", ["He is building a water tank.", "He is shearing the sheep.", "He is painting the farmhouse."], 0, { text: "h1" }),
      c("Why did Tamsin feel dizzy on Friday?", ["She worked in the great heat without a hat.", "She had not eaten any breakfast.", "She was afraid of the sheep."], 0, { text: "h1" }),
      c("How does Callum feel about Tamsin's invitation?", ["He would like to come but is unsure about his mum.", "He thinks the farm sounds boring.", "He has already asked his parents."], 0, { text: "h1" }),
      f("Listen again and complete the notes. Write one word or a number.", [
        feld("Tamsin got up at … every morning.", ["six", "6", "six o'clock", "6 o'clock", "6:00", "6.00", "six am", "6 am"]),
        feld("Temperature on Friday: … degrees", ["forty", "40"]),
        feld("Her aunt gave her water with a pinch of …", ["salt"]),
        feld("Tip: drink a glass of water every …", ["hour", "an hour", "one hour", "1 hour", "every hour", "hours"]),
        feld("Tamsin wants to stay for … weeks.", ["two", "2"])
      ], { text: "h1", tolerant: true, hinweis: "Lies vor dem Hören die Notizen: Dann weißt du, auf welche Zahl oder welches Wort du achten musst." }),
      o("What happened first? Put the events in the right order.", ["Tamsin felt dizzy at noon.", "Her aunt gave her water and a wet cloth.", "Tamsin invited Callum to the farm."], { text: "h1" })
    ]),
    ...teil("B Reading", [
      c("What made the students start the project?", ["Koalas had been hit by cars on Gum Road.", "A teacher told them about a competition.", "The council asked them for help."], 0, { text: "t1" }),
      c("Why did the class organise a walk, a stall and an evening of music?", ["They needed money for the bridge.", "They wanted to make friends with the neighbours.", "They had to finish a school project."], 0, { text: "t1" }),
      c("What does Mr Costa's comment at the end of paragraph 4 show?", ["He changed his attitude after he heard the facts.", "He still thinks the bridge is a bad idea.", "He wants to be the leader of the project."], 0, { text: "t1" }),
      z("In which lines does the text say how the students collected money?", "t1", [[14, 18]], { hinweis: "Suche die Absatzstelle, in der es um den Preis der Brücke und um Aktionen geht." }),
      z("In which lines does Mr Costa explain why he changed his mind?", "t1", [[24, 26]], { hinweis: "Suche die Stelle mit der wörtlichen Rede von Mr Costa." }),
      f("Complete the notes about the article. Write one word or a number.", [
        feld("Number of koalas hit by cars last year:", ["three", "3"]),
        feld("The students collected the money in … weeks.", ["six", "6"]),
        feld("Priya Nair is … years old.", ["fifteen", "15"]),
        feld("The first rope was fixed last …", ["Saturday"])
      ], { text: "t1", tolerant: true }),
      a("Why can the project be called a success so far? Give two reasons based on the text. Answer in English.", [
        kr("ein Grund, der sich aus dem Text ergibt", 1, "zum Beispiel: They found out facts by counting the koalas. / They collected enough money. / They convinced the neighbour. / The council will help and the first rope is up."),
        kr("ein zweiter, anderer Grund", 1, "ein anderer der genannten Gründe"),
        kr("verständlich auf Englisch (eigene Worte; Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
      ], "The students collected enough money in only six weeks, and they changed Mr Costa's mind with facts, so the first rope is already up.", ["money|collected", "Costa|neighbour|mind|council|rope|numbers|research|counted"], { text: "t1", zeilen: [6, 26] })
    ]),
    ...teil("C Grammar and vocabulary", [
      f("Complete the sentences with the correct form of the verbs in brackets.", [
        feld("The guide (not / tell) … us about the storm last night.", ["did not tell", "didn't tell", "didn’t tell"]),
        feld("Yesterday the ranger (catch) … a snake near the hut.", ["caught"]),
        feld("What time (you / get) … home after the hike last Sunday?", ["did you get"]),
        feld("Don't worry, I (carry) … your backpack.", ["will carry", "'ll carry", "’ll carry"]),
        feld("Why (the kids / wear) … hats right now?", ["are the kids wearing"]),
        feld("If it is too hot, we (not / walk) … to the lake.", ["will not walk", "won't walk", "won’t walk"])
      ], { hinweis: "Wiederhole simple past (mit did), will-future, present progressive und if-Sätze Typ I – auch Verneinung und Frage." }),
      c("If you ___ your hat, you will get a headache.", ["forget", "will forget", "forgot"], 0),
      c("Which sentence is correct?", ["If you feel sick, tell the teacher at once.", "If you will feel sick, tell the teacher at once.", "If you felt sick, tells the teacher at once."], 0),
      c("I can't go out now. I ___ for my English test.", ["am studying", "study", "studied"], 0),
      f("Rewrite the sentences. Write the whole sentence.", [
        feld("Make a question: The students visited the beach.", ["Did the students visit the beach?", "Did the students visit the beach", "did the students visit the beach?"]),
        feld("Join the sentences with if: Drink water. You will feel better.", ["If you drink water, you will feel better.", "If you drink water, you will feel better", "You will feel better if you drink water.", "You will feel better if you drink water", "If you drink water you will feel better.", "If you drink water you will feel better", "You'll feel better if you drink water.", "You’ll feel better if you drink water.", "If you drink water, you'll feel better.", "If you drink water, you’ll feel better.", "If you drink water you'll feel better."])
      ], { hinweis: "Frage im simple past mit did + Grundform; if-Satz Typ I: simple present nach if, will im Hauptsatz." }),
      m("Match the expressions with their meanings.", [["to go sightseeing", "to visit the famous places of a town"], ["to recover", "to become healthy again after an illness"], ["a waiting room", "the place where patients sit before they see the doctor"]])
    ]),
    ...teil("D Mediation", [
      a("Your father wants to know what the family must think about because of the heat. You received this e-mail from a farm stay in Australia. Tell him in German what is important for him (4 to 6 sentences). Do not translate word for word.", [
        kr("mitbringen: Hut, Sonnencreme, Wasserflasche (mindestens ein Liter) für jede Person", 2, "2 Punkte: mindestens zwei der drei Dinge, dazu die Angabe, dass jeder eins braucht · 1 Punkt: nur ein oder zwei Dinge ohne diese Angabe"),
        kr("Aktivitäten für Kinder beginnen früh um sieben Uhr (vor der Hitze)", 1, "Kinderprogramm ab 7 Uhr morgens, damit es noch nicht heiß ist"),
        kr("Mittagsruhe von zwölf bis fünfzehn Uhr im Schatten", 1, "von 12 bis 15 Uhr ruhen alle im Schatten"),
        kr("bei Schwindel oder Übelkeit sofort Mr Tully Bescheid sagen", 2, "2 Punkte: sofort Bescheid sagen und wem · 1 Punkt: nur eines davon"),
        kr("der nächste Arzt ist 40 Minuten mit dem Auto entfernt", 1, "der Arzt ist weit weg (40 Minuten)"),
        kr("Sprachmittlung: verständliches Deutsch für den Vater, nicht Wort für Wort; Unwichtiges (Hühner, WLAN, Bezahlung, Schotterstraße) fehlt", 1)
      ], "Papa, die Farm schreibt, dass es dort sehr heiß werden kann. Jeder von uns soll einen Hut, Sonnencreme und eine Wasserflasche mit mindestens einem Liter mitbringen. Das Programm für die Kinder beginnt schon um sieben Uhr morgens, und von zwölf bis drei Uhr ruhen alle im Schatten. Wenn jemandem schwindelig oder schlecht wird, müssen wir sofort Herrn Tully Bescheid sagen. Der nächste Arzt ist vierzig Minuten mit dem Auto entfernt.",
      ["Hut", "Sonnencreme|Sonnenschutz", "Wasser|Flasche|Liter", "sieben|7 Uhr|früh|morgens", "zwölf|12|Mittag|Schatten|Ruhe", "schwindelig|schlecht|Übelkeit|krank", "Tully|Bescheid|sofort", "Arzt|vierzig|40"], { vorgabe: A_MAIL })
    ]),
    ...teil("E Writing", [
      s("You spent a day in a big city with your class. Write a blog post about it (90 to 110 words). Tell your readers: which city you visited and who you went with · two things you saw or did · what went wrong (for example the weather or the transport) · how you solved the problem · how you liked the day · one tip for other travellers (use an if-sentence) and what you will do next time.", [
        kr("Inhalt", 5, "sechs Inhaltspunkte des Auftrags: Stadt und Begleitung · zwei Erlebnisse · Panne · Lösung · Bewertung · Tipp mit if-Satz und Vorsatz. Alle sechs erfüllt = 5 Punkte, fünf = 4, vier = 3, drei = 2, zwei = 1"),
        kr("Textsorte und Aufbau", 2, "Überschrift oder Anrede an die Leser, Absätze (zum Beispiel Einleitung, Hauptteil, Schluss), sinnvolle Verbindungswörter (first, after that, although, because, while, so that)"),
        kr("Grammatik", 3, "Erlebnisse im simple past (auch Verneinung), mindestens ein if-Satz Typ I und eine Zukunftsform mit will; Fehler stören das Verstehen kaum"),
        kr("Wortschatz", 2, "passende, abwechslungsreiche Wörter für Erlebnisse, Reise und Beschwerden, nicht nur good, nice und bad"),
        kr("Rechtschreibung", 2, "häufige Wörter und die Wörter der Unit sind meist richtig geschrieben", { rs: true })
      ], { minWoerter: 90, plan: [
        { id: "title", label: "Title and greeting", hilfe: "A day in …" },
        { id: "where", label: "Which city? Who with?" },
        { id: "did", label: "Two things you saw or did", hilfe: "simple past" },
        { id: "wrong", label: "What went wrong?" },
        { id: "solved", label: "How did you solve it?" },
        { id: "opinion", label: "How did you like the day?" },
        { id: "tip", label: "One tip and next time", hilfe: "If you …, you will … / Next time I will …" }
      ] })
    ])
  ]
});

/* ------------------------------ Variante B (Nachschreibprobe) ------------------------------ */
const B_HOEREN = hoertext("h1", "An accident on the trail", "Listening: aunt and nephew talk on the phone", [
  ["Carol", "Rory, hello! Your mum told me you were in hospital at the weekend. What on earth happened?"],
  ["Rory", "Hi Aunt Carol. It's not as bad as it sounds. I fell off my bike on the Lyrebird Trail on Saturday and hurt my wrist."],
  ["Carol", "The Lyrebird Trail? Is that the one near the old railway bridge?"],
  ["Rory", "No, that's the Swan Trail. The Lyrebird Trail is the one by the lake, with all the roots on the path. I was riding too fast down a hill, and I was talking to Kai instead of watching the track."],
  ["Carol", "Oh dear. Did somebody help you?"],
  ["Rory", "Kai's dad was waiting at the car park, and he drove me to the hospital straight away. At first I was scared because my wrist was swollen and blue."],
  ["Carol", "Of course you were. Is it broken?"],
  ["Rory", "No, the doctor took an X-ray and said it's only sprained. I have to wear a tight bandage for ten days. She says if I rest my hand and put ice on it, it will heal much faster."],
  ["Carol", "Thank goodness. So why do you sound so sad?"],
  ["Rory", "I'm not allowed to play basketball for three weeks, and that's the worst thing. Our school final is next Thursday."],
  ["Carol", "Poor you! You were so excited about it."],
  ["Rory", "I know. I'll sit on the bench and cheer, I think. At the moment I'm learning to write with my left hand, and it looks terrible."],
  ["Carol", "Ha! Listen, I'm coming to town on Friday. If your mum agrees, I'll take you to the cinema, and you can choose any film."],
  ["Rory", "Brilliant! If it's an action film, I'll even pay for the popcorn."],
  ["Carol", "Deal. I'll call your mum tonight."]
], { stimmen: { Carol: "en-GB-SoniaNeural", Rory: "en-GB-RyanNeural" }, mal: 2 });

const B_LESEN = text("t1", "Trees for Tarni Creek", "Newspaper article", [
  "For years, the banks of Tarni Creek near the small town of Burrawong looked sad. Rubbish lay between the weeds, and during heavy rain the water washed away the soil. Last spring, twenty-two students from Year 9 at Burrawong High decided to change that, although many adults told them it would take too long.",
  "Their teacher, Mr Lawson, invited a local bush regenerator, Ruth Menzies, to talk to the class. She explained that native trees hold the soil with their roots and give shade to the water, so that fish and frogs can live there. \"You don't have to be an expert,\" she told the students. \"You only need patience and the right plants.\"",
  "The class chose twelve kinds of local plants. A nursery sold them the seedlings at half price, and the rest of the money came from a school disco. On four Saturday mornings the students planted the seedlings and protected them with cardboard collars. While some of them dug holes, others carried water from a tank to the creek.",
  "The first months were hard. In summer a heatwave burnt many of the young plants, and a flood in autumn washed some of them away. One group nearly gave up. \"I was angry for a day or two,\" says Kayla Ross, 14. \"Then we decided to plant again, but this time we put the seedlings higher up on the bank.\"",
  "That decision worked. A year later more than two thirds of the trees are growing well, and last month a student saw a platypus in the pool below the old bridge. Experts say that platypuses may come back to a creek only if the water stays clean and cool, so this is a good sign.",
  "Burrawong Council now wants to use the students' plan for another creek. Kayla smiles when she hears that. \"If everybody planted ten trees, we could change a whole country,\" she says, \"but first we need to water ours in this dry weather.\""
]);

const B_INFO = "BURG HOHENWINKEL – INFORMATIONEN FÜR BESUCHER\nDie Burg ist von Dienstag bis Sonntag von 10 bis 17 Uhr geöffnet. Montags bleibt sie geschlossen.\nDer Eintritt kostet für Erwachsene 8 Euro und für Schülerinnen und Schüler 5 Euro. Die Führung ist im Preis enthalten.\nFührungen auf Deutsch beginnen zu jeder vollen Stunde. Eine Führung in englischer Sprache gibt es nur sonntags um 14 Uhr. Bitte melden Sie sich dafür bis Mittwoch per E-Mail an, denn die Gruppe hat höchstens 15 Plätze.\nGroße Taschen und Rucksäcke dürfen nicht in die Räume mitgenommen werden. Am Eingang stehen Schließfächer bereit (1-Euro-Münze).\nIm Burgcafé gibt es jeden Tag frischen Apfelkuchen. Übrigens: Am ersten Wochenende im September findet im Burghof ein Mittelaltermarkt statt, Hunde müssen draußen bleiben, und der Parkplatz für Reisebusse liegt hinter der Burg.";

const m1b = probeM(1, "B", {
  title: "Test 1 (M9): Around Australia", kurz: "Unit 1", scope: "Unit 1 · Listening, Reading, Grammar and vocabulary, Mediation, Writing", minutes: 60, hinweis: HINWEIS,
  texte: [B_HOEREN, B_LESEN],
  items: [
    ...teil("A Listening", [
      c("Where exactly did Rory have his accident?", ["on the trail by the lake", "on the trail near the railway bridge", "in the car park"], 0, { text: "h1" }),
      c("What did the doctor tell Rory to do?", ["to rest his hand and put ice on it", "to keep his arm in a cast", "to stay in bed for a week"], 0, { text: "h1" }),
      c("Why is Rory so sad about his injury?", ["He cannot play in the school basketball final.", "He cannot ride his bike to school.", "He has to stay in hospital."], 0, { text: "h1" }),
      c("What will Carol do if Rory's mum agrees?", ["She will take him to the cinema.", "She will drive him to the doctor.", "She will bring him a new bike."], 0, { text: "h1" }),
      f("Listen again and complete the notes. Write one word or a number.", [
        feld("Rory fell off his bike on …", ["Saturday", "on Saturday"]),
        feld("Rory has to wear a bandage for … days.", ["ten", "10"]),
        feld("No basketball for … weeks.", ["three", "3"]),
        feld("Rory is learning to write with his … hand.", ["left"]),
        feld("Carol is coming to town on …", ["Friday"])
      ], { text: "h1", tolerant: true, hinweis: "Lies vor dem Hören die Notizen: Dann weißt du, auf welche Zahl oder welches Wort du achten musst." }),
      o("What happened first? Put the events in the right order.", ["Rory fell off his bike.", "The doctor took an X-ray.", "Carol promised to call Rory's mum."], { text: "h1" })
    ]),
    ...teil("B Reading", [
      c("Why did the students want to plant trees?", ["The creek banks looked sad and the soil was washed away.", "They wanted to win a prize.", "The council had asked them to."], 0, { text: "t1" }),
      c("How did the class pay for the plants?", ["with a discount from a nursery and money from a school disco", "with money from the council", "with money from their parents"], 0, { text: "t1" }),
      c("What does Kayla's decision to plant the seedlings higher up show?", ["The students learned from their mistake.", "The students wanted to make the work easier.", "The students were afraid of the creek."], 0, { text: "t1" }),
      z("In which lines does the text say what the students did on Saturday mornings?", "t1", [[15, 18]], { hinweis: "Suche die Stelle mit den vier Samstagen." }),
      z("In which lines does the text show a sign that the creek is getting healthier?", "t1", [[26, 29]], { hinweis: "Suche das Tier, das im Bach gesehen wurde." }),
      f("Complete the notes about the article. Write one word or a number.", [
        feld("Number of students in the project:", ["twenty-two", "22", "twenty two"]),
        feld("Number of kinds of plants:", ["twelve", "12"]),
        feld("Kayla Ross is … years old.", ["fourteen", "14"]),
        feld("Animal seen in the pool:", ["platypus", "a platypus", "platypuses"])
      ], { text: "t1", tolerant: true }),
      a("What can other people learn from the students' project? Give two ideas based on the text. Answer in English.", [
        kr("eine Lehre, die sich aus dem Text ergibt", 1, "zum Beispiel: Ask an expert for advice. / Don't give up when something goes wrong. / Learn from mistakes and try again. / Young people can change things."),
        kr("eine zweite, andere Lehre", 1, "eine andere der Ideen"),
        kr("verständlich auf Englisch (eigene Worte; Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
      ], "Other people can learn that you should not give up when plants die, and you should ask an expert for advice before you start.", ["give up|again|patience|try", "expert|advice|ask|learn|mistake|plan|together"], { text: "t1", zeilen: [7, 34] })
    ]),
    ...teil("C Grammar and vocabulary", [
      f("Complete the sentences with the correct form of the verbs in brackets.", [
        feld("The bus (not / arrive) … on time, so we waited.", ["did not arrive", "didn't arrive", "didn’t arrive"]),
        feld("Last Sunday my dad (drive) … us to the lake.", ["drove"]),
        feld("How long (you / stay) … in Melbourne last summer?", ["did you stay"]),
        feld("Wait, I (help) … you with that box.", ["will help", "'ll help", "’ll help"]),
        feld("Why (you / wear) … a scarf in this heat?", ["are you wearing"]),
        feld("If you (not / wear) … sun cream, you will get burnt.", ["do not wear", "don't wear", "don’t wear"])
      ], { hinweis: "Wiederhole simple past (mit did), will-future, present progressive und if-Sätze Typ I – auch Verneinung und Frage." }),
      c("If it ___ tomorrow, we will cancel the picnic.", ["rains", "will rain", "rained"], 0),
      c("Which sentence is correct?", ["She will not come if she is ill.", "She will not come if she will be ill.", "She not will come if she is ill."], 0),
      c("Please be quiet. The doctor ___ a patient right now.", ["is examining", "examines", "examined"], 0),
      f("Rewrite the sentences. Write the whole sentence.", [
        feld("Make it negative: We took a lot of photos.", ["We did not take a lot of photos.", "We did not take a lot of photos", "We didn't take a lot of photos.", "We didn't take a lot of photos", "We didn’t take a lot of photos.", "We didn’t take a lot of photos", "We did not take many photos.", "We didn't take many photos."]),
        feld("Join the sentences with if: Wear a helmet. You will protect your head.", ["If you wear a helmet, you will protect your head.", "If you wear a helmet, you will protect your head", "You will protect your head if you wear a helmet.", "You will protect your head if you wear a helmet", "If you wear a helmet you will protect your head.", "If you wear a helmet you will protect your head", "If you wear a helmet, you'll protect your head.", "If you wear a helmet, you’ll protect your head.", "You'll protect your head if you wear a helmet.", "You’ll protect your head if you wear a helmet.", "If you wear a helmet you'll protect your head."])
      ], { hinweis: "Verneinung im simple past mit did not + Grundform; if-Satz Typ I: simple present nach if, will im Hauptsatz." }),
      m("Match the expressions with their meanings.", [["to miss the bus", "to be too late to get on it"], ["an appointment", "a fixed time when you see the doctor"], ["to avoid", "to stay away from something"]])
    ]),
    ...teil("D Mediation", [
      a("Your Australian exchange partner Sienna does not speak German. Her parents are coming to visit, and next Monday the three of them want to see Burg Hohenwinkel with a tour in English. You found this information on a leaflet. Tell her in English what is important for them (4 to 6 sentences). Do not translate word for word.", [
        kr("montags geschlossen – der geplante Montag geht nicht; geöffnet Dienstag bis Sonntag von 10 bis 17 Uhr", 2, "2 Punkte: montags geschlossen und die Öffnungszeiten (Tage oder Uhrzeit) · 1 Punkt: nur eines davon"),
        kr("Führung auf Englisch nur sonntags um 14 Uhr", 1, "the tour in English is only on Sundays at two o'clock"),
        kr("für die englische Führung bis Mittwoch per E-Mail anmelden", 1, "you must sign up by e-mail by Wednesday – Umschreiben gilt (write an e-mail before Wednesday)"),
        kr("Eintritt: Erwachsene 8 Euro, Schülerinnen und Schüler 5 Euro, Führung inbegriffen", 2, "2 Punkte: beide Preise · 1 Punkt: nur ein Preis oder nur der Hinweis, dass die Führung nichts extra kostet"),
        kr("große Taschen und Rucksäcke bleiben im Schließfach am Eingang (1-Euro-Münze)", 1, "big bags and backpacks must stay in a locker at the entrance – Umschreiben gilt (a small cupboard with a key)"),
        kr("Sprachmittlung: verständliches, einfaches Englisch für Sienna, nicht Wort für Wort; Unwichtiges (deutsche Führungen, Burgcafé, Mittelaltermarkt, Hunde, Busparkplatz) fehlt", 1)
      ], "Sienna, the castle is closed on Mondays, so you can't go there on Monday. It is open from Tuesday to Sunday from ten to five. There is a tour in English only on Sundays at two o'clock, and you must sign up by e-mail by Wednesday. A ticket costs eight euros for adults and five euros for students, and the tour is included. You can't take big bags or backpacks inside, but there are lockers at the entrance. You need a one-euro coin for them.",
      ["closed|Monday", "open|Tuesday|ten|10|five|17", "English|tour|guide", "Sunday|two|2 pm|14", "e-mail|email|mail|sign up|register|Wednesday", "eight|8|five|5|euro", "bag|backpack|rucksack", "locker|entrance|coin"], { vorgabe: B_INFO })
    ]),
    ...teil("E Writing", [
      s("Last weekend you went to an open-air concert, but it rained. Write an e-mail to your Australian friend Callum (90 to 110 words). Tell him: which concert you went to and who you went with · what went wrong · what you did about it · what was good about the evening anyway · how you felt the next day · one thing you will do differently next time (use will or an if-sentence).", [
        kr("Inhalt", 5, "sechs Inhaltspunkte des Auftrags: Konzert und Begleitung · Panne · Lösung · etwas Gutes · Gefühl am nächsten Tag · Vorsatz mit will oder if-Satz. Alle sechs erfüllt = 5 Punkte, fünf = 4, vier = 3, drei = 2, zwei = 1"),
        kr("Textsorte und Aufbau", 2, "Anrede und Schluss mit Gruß, Absätze (zum Beispiel vor dem Konzert, Konzert, danach), sinnvolle Verbindungswörter (first, after that, although, because, while, so that)"),
        kr("Grammatik", 3, "Erlebnisse im simple past (auch Verneinung), dazu eine Zukunftsform mit will oder ein if-Satz Typ I (der Auftrag lässt die Wahl; beides zusammen ist ein Plus); Fehler stören das Verstehen kaum"),
        kr("Wortschatz", 2, "passende, abwechslungsreiche Wörter für Erlebnisse, Wetter und Befinden (soaked, sore throat, to catch a cold), nicht nur good, nice und bad"),
        kr("Rechtschreibung", 2, "häufige Wörter und die Wörter der Unit sind meist richtig geschrieben", { rs: true })
      ], { minWoerter: 90, plan: [
        { id: "greeting", label: "Greeting", hilfe: "Hi Callum, …" },
        { id: "what", label: "Which concert? Who with?" },
        { id: "wrong", label: "What went wrong?", hilfe: "simple past" },
        { id: "did", label: "What did you do about it?" },
        { id: "good", label: "What was good anyway?" },
        { id: "next", label: "How did you feel the next day? Next time I will …", hilfe: "will or an if-sentence" },
        { id: "ending", label: "Ending", hilfe: "Write back soon! / Bye, …" }
      ] })
    ])
  ]
});
module.exports = { m1a, m1b };
