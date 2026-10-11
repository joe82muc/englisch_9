"use strict";

/**
 * Englisch 9M · Probe 3: Unit 3 – Discover South Africa (Mittlere-Reife-Klasse, Zug M)
 * Teile: A Listening (12) · B Reading (12) · C Grammar and vocabulary (14) · D Mediation (8) · E Writing (14) = 60 Punkte,
 * 60 Minuten. Grammatik der Unit: past progressive (mit while und when, im Zusammenspiel mit dem simple past), present
 * perfect mit for und since. Wortschatz: Unfall, Erste Hilfe, Vorbild, dazu Kollokationen und phrasal verbs.
 * Variante A: Ausflug in den Bergen, Schnittwunde am Bach (Hören; Palesa, Dean, Onkel Gerrit, Anja, Mr Visser), Ruth und die
 * "Homework Box" im Schiffscontainer (Lesen; Pinegrove, Mr Olivier, Tumi), Hinweisblatt eines Kanuverleihs Englisch -> Deutsch
 * (Sprachmittlung), Unfallbericht für die Schulhomepage (Schreiben).
 * Variante B (Nachschreibprobe): Sturz vom Pferd, Telefonat mit der Mutter (Hören; Wian, Mum, Ms Hattingh, Biscuit,
 * Seabrook Hospital), Notfallsanitäterin Nadine Roux (Lesen; Karoo Gate, Ruan), Autounfall auf einem Parkplatz Deutsch ->
 * Englisch bei Constable Maseko in Brookvale (Sprachmittlung), Text über ein Vorbild (Schreiben).
 * Erfundene Orte und Namen; keine nachschlagbaren Zahlen über Südafrika.
 * Bleibt auf dem Server (Lösungen und Erwartungshorizont). Bausteine: bau.js (probeM).
 */
const { c, m, o, f, feld, z, a, kr, s, text, hoertext, teil, probeM } = require("./bau");

const HINWEIS = "Work on your own. Part A: your teacher plays the recording twice – read the tasks first. Read every task carefully. Arbeite allein. Den Hörtext spielt deine Lehrkraft zweimal für alle ab. Nach der Abgabe kannst du nichts mehr ändern.";

/* ------------------------------ Variante A ------------------------------ */
const A_HOEREN = hoertext("h1", "A hike with a surprise", "Listening: two friends talk", [
  ["Dean", "Hi Palesa! I heard you had a bit of an adventure on Saturday. Is it true?"],
  ["Palesa", "Oh, Dean, yes, and I'm still shaking a little. We were hiking up Eagle Ridge, the path behind the old farm. My uncle Gerrit was leading, and my cousin Anja and I were walking behind him."],
  ["Dean", "Was the weather okay?"],
  ["Palesa", "It was sunny in the morning, but it had rained all night, so the rocks were really wet. At about eleven o'clock we were crossing a little stream when Anja slipped."],
  ["Dean", "Oh no! Did she fall in?"],
  ["Palesa", "Not really. She landed on the stones and cut her hand. It was bleeding a lot, and she started to cry. I was so scared that I couldn't move."],
  ["Dean", "So who helped her?"],
  ["Palesa", "My uncle. He's a car mechanic, but he did a first-aid course last year. He washed the cut with water from his bottle and wrapped it in a scarf. While he was doing that, I was trying to ring the mountain rescue, but there was hardly any signal."],
  ["Dean", "Did you get through in the end?"],
  ["Palesa", "Yes, after five minutes, a bit higher up the path. The man on the phone asked where we were. I said we were at the stream near the big rock. No, sorry, I mean at the stream near the big tree. We had walked past the rock much earlier."],
  ["Dean", "And did somebody come?"],
  ["Palesa", "A volunteer called Mr Visser arrived in his truck after twenty minutes. He took us down to the clinic, and the nurse said Anja needed four stitches."],
  ["Dean", "Poor Anja! Is she all right now?"],
  ["Palesa", "She's fine, and she's proud of her bandage. But I've been thinking about it ever since. Next time I want to know what to do. I don't want to feel so helpless again."],
  ["Dean", "Maybe we could do a first-aid course together? I've wanted to learn it for ages."],
  ["Palesa", "Good idea, Dean. Let's ask Mr Visser."]
], { stimmen: { Dean: "en-GB-RyanNeural", Palesa: "en-GB-LibbyNeural" }, mal: 2 });

const A_LESEN = text("t1", "The Homework Box", "Portrait", [
  "Ruth Mabasa is seventeen and lives in Pinegrove, a quiet neighbourhood at the edge of a small town. Although she is still at school herself, many younger children call her \"Sister Ruth\". She has never won a prize, and she does not post videos about herself. Still, a lot of parents say that she has changed their street.",
  "It began three years ago. Ruth's cousin Tumi was failing maths because he had no quiet place to study. Twelve people lived in his house, and the electricity often failed in the evenings. Ruth wanted to help, but her own room was far too small. Then she remembered the old shipping container behind Mr Olivier's hardware shop. She went to ask him whether the children might use it.",
  "Mr Olivier was not sure at first. He worried that the noise might disturb his customers. In the end he said yes, so that Ruth could try it for one month. She and her friends painted the container yellow, carried in old tables and fixed two solar lamps to the roof. Now the children can also study when the power is off. The \"Homework Box\" is open from three to six o'clock, Monday to Thursday.",
  "The rules are simple. Every child reads for ten minutes, then does his or her homework. Older pupils help the younger ones, and each helper looks after two children at most. Ruth never gives the answers. \"I ask questions until they find the solution themselves,\" she says. \"Otherwise they learn nothing, and they know it.\"",
  "Not everything went well. Last winter the container was so cold that the group had to stop for three weeks. During that time Ruth was writing letters to local firms while her marks were getting worse, and her mother began to worry. Ruth admits that she was tired and nearly gave up. Then a bakery sent a heater, and the children came back.",
  "Today twenty-six children come to the Homework Box, and eight pupils help. Ruth has run the Box since she was fourteen, and she hopes to become a teacher. \"I might not change the world,\" she says, \"but I can change one afternoon for a child.\""
]);

const A_BLATT = "Mill Dam Canoe Hire – Information for visitors. Our canoes are for two or three people. Everyone must wear a life jacket for the whole trip, even good swimmers. Children under twelve may only go out with an adult in the same canoe. The last canoe leaves at half past two, and all canoes must be back by four o'clock because the wind often gets stronger in the late afternoon. If your canoe tips over, please stay calm and hold on to it. Do not try to swim to the bank on your own – our rescue boat will come to you. Please tell the office about every accident, even a small one. The dam was built many years ago to drive a mill, and our café sells fresh scones. T-shirts with our logo cost less this month.";

const m3a = probeM(3, "A", {
  title: "Test 3 (M9): Discover South Africa", kurz: "Unit 3", scope: "Unit 3 · Listening, Reading, Grammar and vocabulary, Mediation, Writing", minutes: 60, hinweis: HINWEIS,
  texte: [A_HOEREN, A_LESEN],
  items: [
    ...teil("A Listening", [
      c("What was Palesa doing when Anja slipped?", ["She was crossing a stream.", "She was ringing the rescue team.", "She was washing the cut."], 0, { text: "h1" }),
      c("Where did Palesa finally say they were?", ["at the stream near the big tree", "at the stream near the big rock", "on the road to the clinic"], 0, { text: "h1" }),
      c("Who helped Anja first?", ["Her uncle, with water and a scarf.", "A nurse from the clinic.", "Mr Visser, with his truck."], 0, { text: "h1" }),
      c("Why does Palesa want to learn first aid?", ["She felt helpless and wants to be ready next time.", "She wants to work at the clinic.", "Her uncle asked her to do it."], 0, { text: "h1" }),
      f("Listen again and complete the notes. Write one word or a number.", [
        feld("The path is called … Ridge.", ["Eagle"]),
        feld("The accident happened at about … o'clock.", ["eleven", "11"]),
        feld("Uncle Gerrit is a car …", ["mechanic", "a mechanic"]),
        feld("Mr Visser came after … minutes.", ["twenty", "20"]),
        feld("Anja needed … stitches.", ["four", "4"])
      ], { text: "h1", tolerant: true, hinweis: "Lies vor dem Hören die Notizen: Dann weißt du, auf welche Zahl oder welches Wort du achten musst." }),
      o("What happened first? Put the events in the right order.", ["Anja slipped on the wet stones.", "Palesa reached the rescue team by phone.", "Mr Visser took the girls to the clinic."], { text: "h1" })
    ]),
    ...teil("B Reading", [
      c("What did Mr Olivier think at first?", ["The noise might disturb his customers.", "The container was too old.", "Ruth was too young for the idea."], 0, { text: "t1" }),
      c("Why did the group stop working last winter?", ["The container was too cold.", "The solar lamps were broken.", "Ruth had to take her exams."], 0, { text: "t1" }),
      c("What does the text show about Ruth in the cold winter?", ["She was close to giving up, but she found a way to go on.", "She was angry with Mr Olivier and left the group.", "She did not care about her marks."], 0, { text: "t1" }),
      z("In which lines does the text explain the rules of the Homework Box?", "t1", [[21, 26]], { hinweis: "Suche den Absatz, der mit „The rules are simple“ beginnt." }),
      z("In which lines does the text say that Ruth's school marks suffered?", "t1", [[29, 30]], { hinweis: "Suche die Stelle über den kalten Winter und die Briefe an die Firmen." }),
      f("Complete the notes about the Homework Box. Write one word or a number.", [
        feld("The container is painted …", ["yellow"]),
        feld("It is open from Monday to …", ["Thursday"]),
        feld("Each helper looks after … children at most.", ["two", "2"]),
        feld("Number of children today:", ["twenty-six", "26", "twenty six"])
      ], { text: "t1", tolerant: true }),
      a("Why do you think the children learn well in the Homework Box? Give two reasons from the text. Answer in English.", [
        kr("ein Grund, der aus dem Text folgt", 1, "zum Beispiel: It is quiet / they have a place to study. / They can study when the power is off (solar lamps). / Older pupils help them."),
        kr("ein zweiter, anderer Grund aus dem Text", 1, "ein anderer der Gründe (auch: Ruth asks questions, so they find the answers themselves. / They have rules and read first.)"),
        kr("verständlich auf Englisch, in eigenen Worten (Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
      ], "They have a quiet place with light, even when the power is off, and Ruth asks questions so that the children find the answers themselves.", ["quiet|place|lamp|light|power|help|older", "question|themselves|solution|read|rules"], { text: "t1", zeilen: [7, 26] })
    ]),
    ...teil("C Grammar and vocabulary", [
      f("Complete the sentences with the correct form of the verbs in brackets (past progressive, simple past or present perfect).", [
        feld("While Dad (drive) … us to the station, the car suddenly stopped.", ["was driving"]),
        feld("We (not / look) … at the road when the dog ran out.", ["were not looking", "weren't looking", "weren’t looking"]),
        feld("What (your sister / carry) … when she slipped?", ["was your sister carrying"]),
        feld("The lights (go) … out while we were cooking.", ["went"]),
        feld("How long (you / know) … Mr Visser? – Since last summer.", ["have you known"]),
        feld("Our neighbours are new. They (not / live) … here for long.", ["have not lived", "haven't lived", "haven’t lived", "have not been living", "haven't been living", "haven’t been living"])
      ], { hinweis: "Past progressive: was/were + Verb mit -ing. Present perfect: have/has + dritte Form des Verbs (know – known)." }),
      c("Which sentence is correct?", ["Mum was cooking when we came home.", "Mum is cooking when we came home.", "Mum were cooking when we came home."], 0),
      c("Choose the correct question.", ["Why were you running when the bus arrived?", "Why you were running when the bus arrived?", "Why was you running when the bus arrived?"], 0),
      c("Which sentence says that something is still true today?", ["We have lived in this street since 2018.", "We lived in this street in 2018.", "We were living in this street last year."], 0),
      f("Write one whole sentence each.", [
        feld("Join the sentences with while or when: Theo was cleaning the kitchen. The glass broke.", [
          "While Theo was cleaning the kitchen, the glass broke.", "While Theo was cleaning the kitchen the glass broke.", "The glass broke while Theo was cleaning the kitchen.",
          "Theo was cleaning the kitchen when the glass broke.", "When the glass broke, Theo was cleaning the kitchen.", "When the glass broke Theo was cleaning the kitchen.",
          "When Theo was cleaning the kitchen, the glass broke.", "When Theo was cleaning the kitchen the glass broke.", "The glass broke when Theo was cleaning the kitchen."
        ], { breit: true }),
        feld("Ask a question with how long: Mr Visser has had his truck for six years.", [
          "How long has Mr Visser had his truck?", "How long has Mr. Visser had his truck?", "How long has he had his truck?",
          "How long has Mr Visser had the truck?", "How long has Mr. Visser had the truck?"
        ], { breit: true })
      ], { hinweis: "Beachte die Satzstellung: Bei der Frage steht has vor dem Namen." }),
      m("Match the phrases with their meanings.", [["to pull over", "to stop a car at the side of the road"], ["to give first aid", "to help a hurt person before a doctor arrives"], ["to take a statement", "to write down what a witness says"]])
    ]),
    ...teil("D Mediation", [
      a("Your grandfather does not speak English. He would like to hire a canoe at Mill Dam with you and your little sister (9) and wants to know the rules for a safe trip. You read this sheet. Tell him the important points in German (4 to 6 sentences). Do not translate word for word.", [
        kr("Rettungsweste für die ganze Fahrt für alle (auch gute Schwimmer)", 1, "Rettungsweste/Schwimmweste und alle bzw. die ganze Zeit"),
        kr("Kinder unter zwölf nur mit einem Erwachsenen im selben Kanu", 1, "Kinder unter 12 und Erwachsener im Kanu (gilt für die kleine Schwester: Sie muss bei Opa im Kanu sitzen – auch so gesagt richtig)"),
        kr("zeitliche Regeln: letztes Kanu um halb drei, bis vier Uhr zurück", 2, "2 Punkte: beide Zeiten (halb drei/14.30 und vier/16 Uhr) · 1 Punkt: nur eine; der Grund (Wind am späten Nachmittag) ist nicht nötig"),
        kr("bei Kentern ruhig bleiben, am Kanu festhalten, nicht allein ans Ufer schwimmen (das Rettungsboot kommt)", 2, "2 Punkte: am Kanu festhalten/ruhig bleiben und nicht allein schwimmen bzw. Rettungsboot · 1 Punkt: nur eines davon"),
        kr("jeden Unfall im Büro melden, auch einen kleinen", 1, "Büro und Unfall/Meldung"),
        kr("Sprachmittlung: verständliches Deutsch für den Opa, nicht Wort für Wort; Unwichtiges (Staudamm und Mühle, Café, T-Shirts) fehlt", 1)
      ], "Alle müssen die ganze Fahrt über eine Rettungsweste tragen, auch wenn man gut schwimmen kann. Kinder unter zwölf dürfen nur mit einem Erwachsenen im selben Kanu fahren. Das letzte Kanu fährt um halb drei los, und um vier Uhr müssen alle wieder zurück sein. Wenn das Kanu kentert, sollen wir ruhig bleiben und uns am Kanu festhalten; wir dürfen nicht allein ans Ufer schwimmen, denn das Rettungsboot kommt zu uns. Jeden Unfall, auch einen kleinen, müssen wir im Büro melden.",
      ["weste", "kinder|zwölf|12", "halb drei|14.30|vier|16", "kentert|festhalt|ruhig|rettungsboot", "büro|melden"], { vorgabe: A_BLATT })
    ]),
    ...teil("E Writing", [
      s("Last Saturday you saw a small accident near your school. Write an accident report for the school website (90 to 120 words). Tell us: where and when it happened · what you were doing when it happened (past progressive) · what happened exactly (while or when) · who was hurt and how · who helped · what has changed since then (for or since).", [
        kr("Inhalt", 5, "sechs Punkte des Auftrags: Ort und Zeit · was ich gerade tat · Hergang · wer verletzt, wie · wer half · was sich seither geändert hat. 5 P.: alle sechs · 4 P.: fünf · 3 P.: vier · 2 P.: drei · 1 P.: zwei · 0 P.: höchstens einer"),
        kr("Textsorte und Aufbau", 2, "Bericht mit Überschrift oder Einleitung, Absätze (Einleitung, Hergang, Schluss), Verbindungswörter (first, then, after that, because, although, so that)"),
        kr("Grammatik", 3, "simple past für den Hergang, mindestens ein Satz im past progressive (mit while oder when), mindestens ein Satz im present perfect mit for oder since; Fehler stören das Verstehen kaum"),
        kr("Wortschatz", 2, "passende Wörter zum Thema Unfall (witness, injured, ambulance, to bleed, to call for help, first aid), nicht nur bad und hurt"),
        kr("Rechtschreibung", 2, "häufige Wörter und die Wörter der Unit sind meist richtig geschrieben", { rs: true })
      ], { minWoerter: 90, plan: [
        { id: "where", label: "Where and when did the accident happen?", hilfe: "Last Saturday at about … near …" },
        { id: "doing", label: "What were you doing?", hilfe: "past progressive: I was walking … when …" },
        { id: "what", label: "What happened exactly?", hilfe: "while / when, first, then, after that" },
        { id: "hurt", label: "Who was hurt, and how?", hilfe: "injured, to bleed, to cut, to break" },
        { id: "help", label: "Who helped?", hilfe: "called an ambulance, gave first aid" },
        { id: "since", label: "What has changed since then?", hilfe: "present perfect: has been … for / since …" }
      ] })
    ])
  ]
});

/* ------------------------------ Variante B ------------------------------ */
const B_HOEREN = hoertext("h1", "A fall at the stables", "Listening: a phone call", [
  ["Mum", "Wian! Finally. I've been trying to call you since lunchtime. Ms Hattingh left a message, and I nearly drove to the stables. What happened?"],
  ["Wian", "Hi Mum. Don't panic, I'm fine, honestly. It sounds worse than it was."],
  ["Mum", "Then tell me everything. I thought your riding lesson was on Tuesdays."],
  ["Wian", "No, Mum, Wednesday. We always ride on Wednesday. Anyway, we were trotting round the sand ring, and I was concentrating on my feet, when a dog suddenly ran in through the gate."],
  ["Mum", "Oh no."],
  ["Wian", "My horse Biscuit got a fright and stopped dead. I didn't, so I flew over his head and landed on my shoulder."],
  ["Mum", "Wian! Did you hit your head?"],
  ["Wian", "A bit, but I was wearing my helmet. It's got a big scratch now. Ms Hattingh says it saved me."],
  ["Mum", "I'm glad you listened to me about the helmet. So what happened then?"],
  ["Wian", "Ms Hattingh ran over, checked my neck and my arms, and asked me lots of questions. What day is it, what's my name, you know. Then she drove me to Seabrook Hospital in her van, because my shoulder hurt every time I moved it."],
  ["Mum", "And you didn't call me?"],
  ["Wian", "My phone was in my bag at the stables, and, well, to be honest, I was a bit embarrassed. Everybody was watching, and I thought you'd tell me to stop riding."],
  ["Mum", "Oh, love. I would never do that after one fall. Did they take an X-ray?"],
  ["Wian", "Yes, but I had to wait for two hours first. A nurse put a cold pack on my shoulder. The doctor said nothing is broken, it's only badly bruised. I mustn't ride for ten days."],
  ["Mum", "Ten days is fine. Honestly, I'm just relieved. I've been so worried since I heard."],
  ["Wian", "Sorry, Mum. I've loved riding since I was twelve, and I won't give it up. But I'll call you next time. Promise."],
  ["Mum", "Good. Stay where you are, I'm coming to pick you up."]
], { stimmen: { Mum: "en-US-JennyNeural", Wian: "en-GB-RyanNeural" }, mal: 2 });

const B_LESEN = text("t1", "The calm in the ambulance", "Report", [
  "Nadine Roux is twenty-four, and she is a paramedic at the Karoo Gate ambulance station. Her shift starts at six o'clock in the morning. While most people in town are still asleep, she checks the oxygen bottles, the bandages and the radio in her ambulance. \"If one thing is missing, it might cost somebody's life,\" she says.",
  "She has wanted this job since she was eleven. At that time her grandfather fell down the steps of his house, and she was standing next to him when the ambulance arrived. \"The two paramedics were so calm that I stopped crying,\" she remembers. \"I thought: I want to be that calm for somebody else.\" After school she trained for two years, and she has worked at Karoo Gate for three years now.",
  "A normal day is rarely normal. Last month Nadine and her partner Ruan were driving back from a call when they saw a farm worker lying next to his bicycle. Although they were already tired, they stopped at once. The man had hit a stone, and he was bleeding from his head. While Ruan was holding the man's hand, Nadine was cleaning the wound and talking to him quietly. He was taken to hospital and recovered well.",
  "Nadine does not want to keep her knowledge to herself. Every second Friday she goes to the local school and shows the pupils how to give first aid, so that they know what to do before the ambulance arrives. She brings a doll, a few bandages and a lot of jokes. \"Children laugh, but they remember,\" she says. Last year a ten-year-old girl who had learned from her helped her little brother when he choked on a sweet.",
  "The job has a hard side, too. After a night shift Nadine sometimes cannot sleep because she keeps thinking about the people she could not save. Her friends say she should look for a calmer job. She does not agree. \"I might be tired,\" she says, \"but I have never felt that my work was pointless.\"",
  "In her free time Nadine runs along the river or plays the guitar, badly, as she admits. Her biggest wish is to open a training centre for young first-aiders. \"One day every village will have somebody who knows what to do,\" she says. \"Then I can retire happily.\""
]);

const B_VORLAGE = "Heute Vormittag gegen zehn Uhr stand Opas Mietwagen auf dem Parkplatz des Supermarkts in Brookvale, als ein anderer Wagen beim Rückwärtsfahren gegen die rechte Seite gefahren ist. Die Fahrertür ist eingedrückt und der Außenspiegel ist abgebrochen. Verletzt wurde niemand, Opa war gerade im Laden und hat Brot gekauft. Der andere Fahrer ist einfach weggefahren, ohne seinen Namen zu sagen. Eine Frau hat alles gesehen und sich das Kennzeichen aufgeschrieben; sie hat Opa einen Zettel gegeben. Opa braucht eine schriftliche Bestätigung der Polizei für die Autovermietung. Übrigens war es ein heißer Tag, und Omas Geburtstag ist nächste Woche. Opa spricht kein Englisch, bitte erklär dem Constable alles.";

const m3b = probeM(3, "B", {
  title: "Test 3 (M9): Discover South Africa", kurz: "Unit 3", scope: "Unit 3 · Listening, Reading, Grammar and vocabulary, Mediation, Writing", minutes: 60, hinweis: HINWEIS,
  texte: [B_HOEREN, B_LESEN],
  items: [
    ...teil("A Listening", [
      c("What was Wian doing when the dog ran in?", ["He was trotting round the ring.", "He was jumping over a fence.", "He was cleaning the horse."], 0, { text: "h1" }),
      c("On which day does Wian have his riding lesson?", ["on Wednesday", "on Tuesday", "on Thursday"], 0, { text: "h1" }),
      c("Why did Wian not call his mother?", ["He was embarrassed and afraid she would stop him riding.", "He lost his phone on the way to the hospital.", "He did not want to wake her up."], 0, { text: "h1" }),
      c("What did the doctor say?", ["Nothing is broken, but Wian must not ride for ten days.", "The shoulder is broken and needs an operation.", "Wian is fine and can ride again tomorrow."], 0, { text: "h1" }),
      f("Listen again and complete the notes. Write one word or a number.", [
        feld("The horse is called …", ["Biscuit"]),
        feld("Wian landed on his …", ["shoulder", "his shoulder"]),
        feld("His helmet has a big … now.", ["scratch", "a scratch"]),
        feld("He waited for … hours at the hospital.", ["two", "2"]),
        feld("Wian has loved riding since he was …", ["twelve", "12"])
      ], { text: "h1", tolerant: true, hinweis: "Lies vor dem Hören die Notizen: Dann weißt du, auf welche Zahl oder welches Wort du achten musst." }),
      o("What happened first? Put the events in the right order.", ["A dog ran into the ring.", "Ms Hattingh drove Wian to the hospital.", "A doctor said that nothing was broken."], { text: "h1" })
    ]),
    ...teil("B Reading", [
      c("What were Nadine and Ruan doing when they saw the farm worker?", ["They were driving back from a call.", "They were cleaning the ambulance.", "They were visiting a school."], 0, { text: "t1" }),
      c("What made Nadine want to become a paramedic?", ["The paramedics who helped her grandfather were very calm.", "Her friends were all training for the job.", "She wanted to earn a lot of money."], 0, { text: "t1" }),
      c("What does the text show about Nadine's attitude to her job?", ["It is hard, but she finds it meaningful.", "She would like to find an easier job soon.", "She thinks it is boring most of the time."], 0, { text: "t1" }),
      z("In which lines does the text say how long Nadine has worked at Karoo Gate?", "t1", [[12, 13]], { hinweis: "Suche die Zeitangabe mit „for“ am Ende des zweiten Absatzes." }),
      z("In which lines does the text explain why Nadine goes to the local school?", "t1", [[22, 25]], { hinweis: "Suche den Absatz über den Freitag und den Erste-Hilfe-Unterricht." }),
      f("Complete the notes about the report. Write one word or a number.", [
        feld("Nadine's shift starts at … o'clock.", ["six", "6"]),
        feld("She has wanted the job since she was …", ["eleven", "11"]),
        feld("She trained for … years after school.", ["two", "2"]),
        feld("She goes to school every second …", ["Friday"])
      ], { text: "t1", tolerant: true }),
      a("Nadine says: \"I have never felt that my work was pointless.\" Why is her work not pointless? Give two reasons from the text. Answer in English.", [
        kr("ein Grund, der aus dem Text folgt", 1, "zum Beispiel: She helps people in danger (the farm worker recovered). / She is calm for others, like the paramedics for her grandfather."),
        kr("ein zweiter, anderer Grund aus dem Text", 1, "ein anderer der Gründe (auch: The children remember first aid, and a girl helped her brother. / She wants a training centre.)"),
        kr("verständlich auf Englisch, in eigenen Worten (Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
      ], "She helps people in danger, for example the farm worker who recovered, and the children she teaches can help others, like the girl who helped her little brother.", ["help|save|recover|worker|calm", "child|school|learn|brother|first aid|centre"], { text: "t1", zeilen: [14, 29] })
    ]),
    ...teil("C Grammar and vocabulary", [
      f("Complete the sentences with the correct form of the verbs in brackets (past progressive, simple past or present perfect).", [
        feld("When the phone (ring) …, we were sitting in the car.", ["rang"]),
        feld("He (not / wear) … a helmet when he fell off his bike.", ["was not wearing", "wasn't wearing", "wasn’t wearing"]),
        feld("Who (you / wait) … for when the accident happened?", ["were you waiting"]),
        feld("While the girls (play) … hockey, the ball hit a window.", ["were playing"]),
        feld("How long (they / live) … in this town? – Since 2019.", ["have they lived", "have they been living"]),
        feld("My mother (not / see) … her old friend since last summer.", ["has not seen", "hasn't seen", "hasn’t seen"])
      ], { hinweis: "Past progressive: was/were + Verb mit -ing. Present perfect: have/has + dritte Form des Verbs (see – seen)." }),
      c("Which sentence is correct?", ["They were having dinner when the storm began.", "They was having dinner when the storm began.", "They were have dinner when the storm began."], 0),
      c("Choose the correct answer: Dr Visagie ___ at this hospital for three years now.", ["has worked", "works", "is working"], 0),
      c("Which sentence means the same? The accident happened while Milo was crossing the road.", ["Milo was crossing the road when the accident happened.", "Milo had crossed the road before the accident happened.", "Milo crossed the road after the accident happened."], 0),
      f("Write one whole sentence each.", [
        feld("Join the sentences with when: She was crossing the road. A car stopped suddenly.", [
          "She was crossing the road when a car stopped suddenly.", "When a car stopped suddenly, she was crossing the road.", "When a car stopped suddenly she was crossing the road.",
          "She was crossing the road when the car stopped suddenly.", "When the car stopped suddenly, she was crossing the road.",
          "She was crossing the road when a car suddenly stopped.", "When a car suddenly stopped, she was crossing the road.", "When a car suddenly stopped she was crossing the road.",
          "When she was crossing the road, a car stopped suddenly.", "When she was crossing the road a car stopped suddenly.", "When she was crossing the road, a car suddenly stopped.",
          "A car stopped suddenly when she was crossing the road.", "A car suddenly stopped when she was crossing the road."
        ], { breit: true }),
        feld("Use since: Mr Venter started to work at the hospital in 2021. He still works there.", [
          "Mr Venter has worked at the hospital since 2021.", "Mr Venter has been working at the hospital since 2021.", "Mr Venter has been at the hospital since 2021.",
          "Mr. Venter has worked at the hospital since 2021.", "Mr. Venter has been working at the hospital since 2021.", "Mr. Venter has been at the hospital since 2021.",
          "He has worked at the hospital since 2021.", "He has been working at the hospital since 2021.", "Mr Venter has worked there since 2021.", "Mr Venter has been working there since 2021.",
          "Since 2021 Mr Venter has worked at the hospital.", "Since 2021, Mr Venter has worked at the hospital.", "Since 2021 Mr Venter has been working at the hospital.", "Since 2021, Mr Venter has been working at the hospital."
        ], { breit: true })
      ], { hinweis: "Beachte die Zeitform: In beiden Sätzen steht das Verb nicht im simple past." }),
      m("Match the phrases with their meanings.", [["to look up to somebody", "to respect and admire a person"], ["to set an example", "to show other people how to behave well"], ["to come round", "to wake up after being unconscious"]])
    ]),
    ...teil("D Mediation", [
      a("You are at the police station in Brookvale with your grandfather, who speaks only German. He wants to report a car accident. Constable Maseko asks you what happened. Read the message from your mother and tell the constable the important facts in English (4 to 6 sentences). Do not translate word for word.", [
        kr("Opas Mietwagen stand auf dem Parkplatz des Supermarkts, als ein anderer Wagen beim Rückwärtsfahren dagegenfuhr (heute gegen zehn Uhr)", 2, "2 Punkte: was (parked car was hit by another car that was reversing) und wann/wo (this morning, supermarket car park) · 1 Punkt: nur eines davon"),
        kr("Schaden: Fahrertür (rechte Seite) eingedrückt, Außenspiegel abgebrochen", 1, "door dented and/or mirror broken – ein Teil genügt, wenn der Schaden klar wird; die Seite muss nicht genannt sein"),
        kr("niemand verletzt", 1, "nobody was hurt"),
        kr("der andere Fahrer ist weggefahren, ohne seinen Namen zu sagen", 1, "the other driver drove away without giving his or her name"),
        kr("eine Frau hat das Kennzeichen aufgeschrieben und Opa einen Zettel gegeben (Zeugin)", 1, "a witness / a woman wrote down the number plate"),
        kr("Opa braucht eine schriftliche Bestätigung für die Autovermietung", 1, "he needs a written report/paper for the car hire company"),
        kr("Sprachmittlung: verständliches, einfaches Englisch für den Constable, nicht Wort für Wort; Unwichtiges (Brot, Hitze, Omas Geburtstag) fehlt", 1)
      ], "Constable, my grandfather's rental car was parked at the supermarket car park this morning at about ten when another car hit it while reversing. The driver's door is dented and the mirror is broken. Nobody was hurt. The other driver drove away without telling us his name, but a woman saw everything and wrote down the number plate. My grandfather needs a written report for the car hire company.",
      ["parked|car park|supermarket", "reversing|hit|backing", "door|mirror|damage", "hurt|injured", "drove away|name", "woman|witness|number plate|plate", "report|written|company|hire"], { vorgabe: B_VORLAGE })
    ]),
    ...teil("E Writing", [
      s("Write a text about a person who is a role model for you (90 to 120 words). The person can be real or invented. Tell us: who the person is and how you know him or her · what he or she did in the past · what he or she has done for a long time or since a certain date (for or since) · a difficult moment (use while or when) · why this person is a role model for you · what you have learned or want to do yourself.", [
        kr("Inhalt", 5, "sechs Punkte des Auftrags: wer ist die Person · was hat sie getan · was seit langem (for/since) · schwieriger Moment · warum Vorbild · was gelernt oder vorgenommen. 5 P.: alle sechs · 4 P.: fünf · 3 P.: vier · 2 P.: drei · 1 P.: zwei · 0 P.: höchstens einer"),
        kr("Textsorte und Aufbau", 2, "Text über eine Person mit Einleitung, Hauptteil und Schluss in Absätzen; Verbindungswörter (because, although, so that, but, then, now)"),
        kr("Grammatik", 3, "Vergangenes im simple past, mindestens ein Satz im present perfect mit for oder since, mindestens ein Satz im past progressive mit while oder when; Fehler stören das Verstehen kaum"),
        kr("Wortschatz", 2, "passende Wörter für Vorbilder und Eigenschaften (brave, reliable, to admire, to look up to, to set an example), nicht nur good und nice"),
        kr("Rechtschreibung", 2, "häufige Wörter und die Wörter der Unit sind meist richtig geschrieben", { rs: true })
      ], { minWoerter: 90, plan: [
        { id: "who", label: "Who is your role model, and how do you know him or her?", hilfe: "My role model is … I know her from …" },
        { id: "did", label: "What did he or she do in the past?", hilfe: "simple past" },
        { id: "long", label: "What has he or she done for a long time?", hilfe: "present perfect: has trained … for … / since …" },
        { id: "hard", label: "A difficult moment", hilfe: "While she was … , … / When it happened, he was …" },
        { id: "why", label: "Why is this person a role model for you?", hilfe: "because …, brave, reliable, I look up to …" },
        { id: "learned", label: "What have you learned or what do you want to do?", hilfe: "I have learned that … / I want to …" }
      ] })
    ])
  ]
});

module.exports = { m3a, m3b };
