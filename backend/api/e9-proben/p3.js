"use strict";

/**
 * Englisch 9R · Probe 3: Unit 3 – Discover South Africa
 * Teile: A Listening (12) · B Reading (12) · C Grammar and vocabulary (14) · D Mediation (8) · E Writing (14) = 60 Punkte,
 * 60 Minuten. Grammatik der Unit: past progressive (was/were + -ing), while und when, present perfect mit for und since.
 * Wortschatz: Unfall (accident, witness, injured, ambulance), Vorbild (to admire, brave, reliable, role model).
 * LehrplanPLUS E9 (Regelklasse): 1.1 Hör- und Hörsehverstehen, 1.2 Leseverstehen, 1.4 Schreiben, 1.5 Sprachmittlung,
 * 2 Wortschatz und Grammatik – eigene Aufgaben, nichts aus Prüfungen oder dem Schulbuch.
 * Variante A: umgestürzter Marktstand bei Wind (Hören; Nomvula, Jabu, Mrs Petersen, Sergeant Adams), Jabu hilft älteren Leuten
 * mit dem Smartphone (Lesen), Hinweisblatt einer Arztpraxis Englisch -> Deutsch (Sprachmittlung), Text über ein Vorbild aus
 * Familie oder Nachbarschaft (Schreiben).
 * Variante B (Nachschreibprobe): Zusammenstoß zweier Rollerfahrer auf dem Schulhof (Hören; Lindiwe, Sizwe, Mr Jacobs), Lindiwe
 * und die Schulband (Lesen), verstauchter Knöchel bei Dr Govender Deutsch -> Englisch (Sprachmittlung), Text über ein Vorbild aus
 * Verein, Schule oder Ort (Schreiben).
 * Erfundene Orte und Namen: Harbour Road market, Sunvale, Kestrel Hall, Oakfield Family Practice (Marula Lane), Tern Bay,
 * Hillview School, Fernlea Surgery. Keine echten Prominenten, keine nachschlagbaren Zahlen über Südafrika.
 * Bleibt auf dem Server (Lösungen und Erwartungshorizont). Bausteine: bau.js.
 */
const { c, m, o, f, feld, z, a, kr, s, text, hoertext, teil, probe } = require("./bau");

const HINWEIS = "Work on your own. Part A: your teacher plays the recording twice – read the tasks first. Read every task carefully. Arbeite allein. Den Hörtext spielt deine Lehrkraft zweimal für alle ab. Nach der Abgabe kannst du nichts mehr ändern.";

/* ------------------------------ Variante A ------------------------------ */
const A_HOEREN = hoertext("h1", "The market stall", "Listening: two friends talk", [
  ["Jabu", "Hi Nomvula! You look tired. What happened at the market on Saturday?"],
  ["Nomvula", "Oh, it was a crazy morning. My aunt has had a stall at the Harbour Road market for six years, and I help her every weekend."],
  ["Jabu", "I know. So what was the problem?"],
  ["Nomvula", "At ten o'clock the wind suddenly got very strong. I was putting oranges into bags when I heard a loud crash."],
  ["Jabu", "What was it?"],
  ["Nomvula", "Mrs Petersen's stall fell over. She was selling cheese when the wind pulled the roof off. Boxes and tables flew everywhere."],
  ["Jabu", "Was anybody hurt?"],
  ["Nomvula", "A boy was standing next to the stall. A box hit his arm, but it was only a small cut. A woman gave him a plaster."],
  ["Jabu", "Did the police come?"],
  ["Nomvula", "Yes. Sergeant Adams was driving past, so he stopped at once. He closed the street and asked everybody to move back. While he was talking to the people, we carried the boxes away."],
  ["Jabu", "How is Mrs Petersen now?"],
  ["Nomvula", "She is fine, but she has been very sad since Saturday. She has sold cheese at that market for thirty years."],
  ["Jabu", "We must help her. I can bring my father's tools next Saturday."],
  ["Nomvula", "Great idea! Let's build her a new roof."]
], { stimmen: { Jabu: "en-GB-RyanNeural", Nomvula: "en-GB-LibbyNeural" }, mal: 2 });

const A_LESEN = text("t1", "The phone teacher", "Portrait", [
  "Jabu from Sunvale is fifteen. He does not look like a hero. He is quiet, he loves football, and he has a small scruffy dog. But many people in his street call him their role model.",
  "Every Thursday afternoon Jabu goes to Kestrel Hall and teaches older people how to use a smartphone. He has done this for two years. It started by accident. One day his grandmother was trying to make a video call when the screen went black. While Jabu was helping her, three of her friends were watching and asking questions. A week later there were ten people in the room.",
  "Now the lessons have a fixed plan. First, the learners write their passwords on a card. Then Jabu shows them how to send a photo or a message. He never laughs when someone makes a mistake. \"I have forgotten things too,\" he says. \"Everybody needs time.\"",
  "Since September his classmate Nomvula has helped him, because the group has grown to twenty-two people. The learners do not pay anything. Only the tea and the biscuits are paid by the hall.",
  "Jabu says he has learned a lot about patience. Last week an old man was sending his first message to his grandson when his hands began to shake. Jabu waited quietly for five minutes. Then the message was sent, and the man cried a little. \"That moment is my reward,\" says Jabu."
]);

const A_BLATT = "Oakfield Family Practice, Marula Lane – Information for patients. Opening hours: Monday to Friday, 8 a.m. to 4 p.m. Please arrive ten minutes before your appointment and register at the desk. Bring your insurance card and a list of your medicines. If you have a cough or a fever, please wear a mask in the waiting room. If you cannot come, please call us at least one day before your appointment. Our waiting room was painted last spring, and parking is free. The café next door sells cheap coffee and cakes. Thank you for your help!";

const p3a = probe(3, "A", {
  title: "Test 3 (R9): Discover South Africa", kurz: "Unit 3", scope: "Unit 3 · Listening, Reading, Grammar and vocabulary, Mediation, Writing", minutes: 60, hinweis: HINWEIS,
  texte: [A_HOEREN, A_LESEN],
  items: [
    ...teil("A Listening", [
      c("What was Nomvula doing when she heard the crash?", ["She was putting oranges into bags.", "She was serving a customer.", "She was talking to Sergeant Adams."], 0, { text: "h1" }),
      c("What happened to the boy?", ["A box hit his arm and he got a small cut.", "He fell down and broke his leg.", "The roof fell on his head."], 0, { text: "h1" }),
      c("What did Sergeant Adams do?", ["He closed the street.", "He carried the boxes away.", "He built a new roof."], 0, { text: "h1" }),
      c("How is Mrs Petersen now?", ["She is not hurt, but she feels sad.", "She is in hospital.", "She is angry with the police."], 0, { text: "h1" }),
      f("Listen again and complete the notes. Write one word or a number.", [
        feld("The wind got strong at … o'clock.", ["ten", "10"]),
        feld("Nomvula was putting … into bags.", ["oranges"]),
        feld("A woman gave the boy a …", ["plaster", "a plaster"]),
        feld("Mrs Petersen has sold cheese for … years.", ["thirty", "30"]),
        feld("Jabu can bring his father's … next Saturday.", ["tools"])
      ], { text: "h1", tolerant: true, hinweis: "Lies vor dem Hören die Notizen: Dann weißt du, auf welche Zahl oder welches Wort du achten musst." }),
      o("What happened first? Put the events in the right order.", ["The wind pulled the roof off Mrs Petersen's stall.", "A box hit a boy's arm.", "Sergeant Adams closed the street."], { text: "h1" })
    ]),
    ...teil("B Reading", [
      c("What kind of text is this?", ["a portrait of a young person", "a recipe", "a school timetable"], 0, { text: "t1" }),
      c("How did the lessons start?", ["Jabu helped his grandmother, and her friends wanted help too.", "A teacher asked Jabu to start a course.", "Jabu saw a poster in the hall."], 0, { text: "t1" }),
      c("Why does Nomvula help Jabu now?", ["The group has become bigger.", "She wants to earn money.", "Jabu is ill."], 0, { text: "t1" }),
      z("In which lines does the text say how often and for how long Jabu has taught?", "t1", [[5, 7]], { hinweis: "Suche die Stelle mit „Every Thursday“ und der Zeitangabe mit „two years“." }),
      z("In which lines does Jabu wait for an old man?", "t1", [[21, 24]], { hinweis: "Suche den Absatz über die erste Nachricht des alten Mannes." }),
      f("Complete the notes about the portrait. Write one word or a number.", [
        feld("The lessons are on … afternoons.", ["Thursday", "Thursdays"]),
        feld("Jabu has taught for … years.", ["two", "2"]),
        feld("Number of learners now:", ["twenty-two", "22", "twenty two"]),
        feld("Jabu waited for … minutes.", ["five", "5"])
      ], { text: "t1", tolerant: true }),
      a("Why do the learners like Jabu's lessons? Give two reasons from the text. Answer in English.", [
        kr("ein Grund aus dem Text", 1, "zum Beispiel: He never laughs at mistakes. / He is patient. / He gives them time. / They do not pay."),
        kr("ein zweiter, anderer Grund aus dem Text", 1, "ein anderer der Gründe (auch: He shows them how to send photos and messages. / The lessons have a plan.)"),
        kr("verständlich auf Englisch (eigene Worte oder passende Wörter aus dem Text; Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
      ], "Jabu never laughs when somebody makes a mistake, and the lessons are free.", ["laugh|mistake|patient|time", "free|pay|money|plan|photo|message|show"], { text: "t1", zeilen: [12, 16] })
    ]),
    ...teil("C Grammar and vocabulary", [
      f("Complete the sentences with the past progressive or the present perfect of the verbs in brackets.", [
        feld("At eight o'clock I (walk) … to school.", ["was walking"]),
        feld("While we (have) … lunch, the phone rang.", ["were having"]),
        feld("It (not / rain) … when we left the house.", ["was not raining", "wasn't raining", "wasn’t raining"]),
        feld("What (you / do) … when the lights went out?", ["were you doing"]),
        feld("My uncle (live) … in this town for ten years.", ["has lived"]),
        feld("Our teacher (be) … at this school since 2019.", ["has been", "'s been", "’s been"])
      ], { hinweis: "Past progressive: was/were + Verb mit -ing. Present perfect: have/has + dritte Form des Verbs." }),
      c("Which sentence is correct?", ["We were eating when the lights went out.", "We was eating when the lights went out.", "We eating were when the lights went out."], 0),
      c("___ I was waiting for the bus, it started to rain.", ["While", "Since", "For"], 0),
      c("Choose the sentence without a mistake.", ["She has lived here for six years.", "She has lived here since six years.", "She lives here since six years."], 0),
      f("Write for or since.", [
        feld("My cousin has played the guitar … he was eight.", ["since"]),
        feld("We have been in this room … twenty minutes.", ["for"])
      ], { hinweis: "for + Zeitraum (two years), since + Zeitpunkt (Monday, 2020)." }),
      m("Match the words with their meanings.", [["a witness", "a person who sees what happens"], ["injured", "hurt in an accident"], ["brave", "not afraid of danger"]])
    ]),
    ...teil("D Mediation", [
      a("Your parents do not speak English. You read this information sheet in a doctor's waiting room. Tell your parents the important things in German (4 bis 6 Sätze). Übersetze nicht Wort für Wort.", [
        kr("Öffnungszeiten: Montag bis Freitag, 8 bis 16 Uhr", 1, "Nennung von Tagen und Uhrzeit; nur eines von beiden = 0"),
        kr("zehn Minuten vor dem Termin kommen und sich am Empfang anmelden", 2, "2 Punkte: Zeit (10 Minuten vorher) und Anmeldung · 1 Punkt: nur eines davon"),
        kr("Versichertenkarte und Liste der Medikamente mitbringen", 2, "2 Punkte: beides · 1 Punkt: nur eines davon"),
        kr("bei Husten oder Fieber im Wartezimmer eine Maske tragen", 1, "Maske und Anlass (Husten/Fieber/krank)"),
        kr("den Termin mindestens einen Tag vorher absagen, wenn man nicht kommen kann (anrufen)", 1),
        kr("Sprachmittlung: verständliches Deutsch für die Eltern, nicht Wort für Wort; Unwichtiges (Farbe des Wartezimmers, Parkplatz, Café) fehlt", 1)
      ], "Die Praxis hat von Montag bis Freitag von acht bis sechzehn Uhr geöffnet. Wir sollen zehn Minuten vor dem Termin da sein und uns am Empfang anmelden. Wir müssen die Versichertenkarte und eine Liste mit den Medikamenten mitbringen. Wer Husten oder Fieber hat, muss im Wartezimmer eine Maske tragen. Wenn wir nicht kommen können, müssen wir mindestens einen Tag vorher anrufen.",
      ["montag|freitag|8|acht", "zehn|10", "anmeld|empfang", "karte", "medikament", "maske", "absag|anruf|anrufen|vorher"], { vorgabe: A_BLATT })
    ]),
    ...teil("E Writing", [
      s("Write a text about a role model from your family or your neighbourhood (80 to 100 words). Tell us: who the person is · what he or she did in the past · what he or she has done until today (for or since) · why this person is your role model · what you have learned from him or her.", [
        kr("Inhalt", 5, "alle fünf Punkte des Auftrags – je Punkt 1: wer ist die Person · was hat sie getan · was tut sie bis heute · warum Vorbild · was habe ich gelernt"),
        kr("Textsorte und Aufbau", 2, "Text über eine Person mit Einleitung und Schluss, sinnvolle Reihenfolge, ein paar Verbindungswörter (because, so, but, and, now)"),
        kr("Grammatik", 3, "Vergangenes im simple past, mindestens ein Satz im present perfect mit for oder since; gern ein Satz mit was/were + -ing; Fehler stören das Verstehen kaum"),
        kr("Wortschatz", 2, "passende Wörter für Vorbilder und Eigenschaften (brave, reliable, to admire, to help), nicht nur good und nice"),
        kr("Rechtschreibung", 2, "häufige Wörter und die Wörter der Unit sind meist richtig geschrieben", { rs: true })
      ], { minWoerter: 60, plan: [
        { id: "who", label: "Who is your role model?", hilfe: "My role model is … / He (She) is my …" },
        { id: "did", label: "What did he or she do?", hilfe: "simple past" },
        { id: "today", label: "What has he or she done until today?", hilfe: "present perfect: has helped … for … / since …" },
        { id: "why", label: "Why is this person a role model?", hilfe: "because …, brave, reliable" },
        { id: "learned", label: "What have you learned?", hilfe: "I have learned that …" },
        { id: "ending", label: "Ending", hilfe: "That is why I admire … / Thank you, …" }
      ] })
    ])
  ]
});

/* ------------------------------ Variante B ------------------------------ */
const B_HOEREN = hoertext("h1", "A crash in the schoolyard", "Listening: two students talk", [
  ["Sizwe", "Lindiwe, I heard about the accident in the schoolyard yesterday. Were you there?"],
  ["Lindiwe", "Yes, I was. It happened in the second break at twenty to eleven."],
  ["Sizwe", "What were you doing?"],
  ["Lindiwe", "I was eating my sandwich on the bench when two boys on scooters crashed into each other near the bike stands."],
  ["Sizwe", "Oh no! Who were they?"],
  ["Lindiwe", "Two boys from Year Seven. They were racing round the yard, and one of them was laughing and not looking at the path."],
  ["Sizwe", "Were they badly hurt?"],
  ["Lindiwe", "No. One boy had a sore knee, and the other one got a bump on his elbow. Both boys were fine after ten minutes."],
  ["Sizwe", "Did a teacher see it?"],
  ["Lindiwe", "Yes. Mr Jacobs was walking across the yard with a cup of tea when it happened. He ran to the boys at once and put a cold wet cloth on the knee."],
  ["Sizwe", "That was quick."],
  ["Lindiwe", "The school secretary brought an ice pack, and a friend of the boys sat with them until the bell rang."],
  ["Sizwe", "And what about the scooters?"],
  ["Lindiwe", "They have been allowed for only one year. But since yesterday they have been forbidden in the breaks. The headteacher says the pupils must leave them at the gate."]
], { stimmen: { Sizwe: "en-US-GuyNeural", Lindiwe: "en-US-JennyNeural" }, mal: 2 });

const B_LESEN = text("t1", "The girl with the trumpet", "Report", [
  "Lindiwe is sixteen and lives in the small town of Tern Bay with her mother and her little brother Mpho. Her day starts early. At half past five her alarm clock rings, and at six she is already on the minibus to school.",
  "After lessons Lindiwe does not go home. Three afternoons a week she is in the school band. She has played the trumpet since she was ten, and she has been the leader of the band for one year. \"Mr Jacobs, our teacher, trusted me,\" she says. \"I did not want to let him down.\"",
  "Last spring the band had a problem. The power went off while the players were practising for a town festival. It was dark in the hall, and some of the younger members wanted to go home. But Lindiwe was holding her trumpet, and she had an idea: \"Let's play without the lights!\" Ten minutes later the whole group was playing in the dark. Mr Jacobs says he has never heard such a good rehearsal.",
  "On Saturdays Lindiwe has a second job: she teaches the trumpet to six small children at the library. She has done this for six months. She does not earn any money, but she loves it.",
  "What does she want to do after school? \"I would like to become a music teacher,\" says Lindiwe. \"My dream is a school where every child can try an instrument.\" Until then, she will practise every evening. Her brother Mpho, who is only eight, says: \"I hear her every day. I know all her songs now.\""
]);

const B_ERZAEHLUNG = "Jonas ist heute Mittag in der Ferienwohnung auf der Treppe ausgerutscht, als er einen vollen Wassereimer getragen hat. Das war vor ungefähr zwei Stunden. Er hat sich den linken Knöchel verdreht, der Knöchel ist dick und tut sehr weh. Jonas kann nur schlecht auftreten. Mit dem Kopf ist er zum Glück nicht aufgeschlagen. Wichtig: Er ist allergisch gegen Penicillin, das sollst du der Ärztin unbedingt sagen. Wir haben den Fuß schon mit Eis gekühlt. Übrigens holt Papa heute das Auto aus der Werkstatt ab, und die Praxis hat ein schönes neues Schild. Bis später, ich bleibe mit der Kleinen in der Wohnung, Mama";

const p3b = probe(3, "B", {
  title: "Test 3 (R9): Discover South Africa", kurz: "Unit 3", scope: "Unit 3 · Listening, Reading, Grammar and vocabulary, Mediation, Writing", minutes: 60, hinweis: HINWEIS,
  texte: [B_HOEREN, B_LESEN],
  items: [
    ...teil("A Listening", [
      c("Where was Lindiwe when the boys crashed?", ["on a bench", "in the classroom", "in the sports hall"], 0, { text: "h1" }),
      c("What was Mr Jacobs doing when the accident happened?", ["He was walking across the yard.", "He was riding a scooter.", "He was talking to the headteacher."], 0, { text: "h1" }),
      c("What happened to the boys?", ["Both had small injuries and were fine after a short time.", "One boy broke his arm.", "Both boys went to hospital."], 0, { text: "h1" }),
      c("What is the new rule?", ["Scooters are forbidden in the breaks.", "Scooters may only be used in the morning.", "Nobody may come to school by scooter."], 0, { text: "h1" }),
      f("Listen again and complete the notes. Write one word or a number.", [
        feld("Time of the accident: … to eleven", ["twenty", "20"]),
        feld("Lindiwe was eating a …", ["sandwich", "a sandwich"]),
        feld("The boys are in Year …", ["seven", "7"]),
        feld("The secretary brought an … pack.", ["ice", "an ice"]),
        feld("Scooters have been forbidden since …", ["yesterday"])
      ], { text: "h1", tolerant: true, hinweis: "Lies vor dem Hören die Notizen: Dann weißt du, auf welche Zahl oder welches Wort du achten musst." }),
      o("What happened first? Put the events in the right order.", ["The two boys crashed into each other.", "Mr Jacobs put a cold wet cloth on a knee.", "The secretary brought an ice pack."], { text: "h1" })
    ]),
    ...teil("B Reading", [
      c("What is the text mainly about?", ["the daily life of a young musician", "a festival in a big city", "a shop that sells trumpets"], 0, { text: "t1" }),
      c("Why did Lindiwe's idea help the band?", ["The players could go on practising without lights.", "An electrician came to the hall.", "The younger members went home."], 0, { text: "t1" }),
      c("What does Lindiwe do on Saturdays?", ["She teaches small children at the library.", "She plays in a shop.", "She practises with Mr Jacobs."], 0, { text: "t1" }),
      z("In which lines does the text say how long Lindiwe has played the trumpet and led the band?", "t1", [[6, 8]], { hinweis: "Suche die beiden Zeitangaben mit since und for." }),
      z("In which lines does Lindiwe have her idea during the power cut?", "t1", [[13, 15]], { hinweis: "Suche die Stelle, an der Lindiwe die Trompete hält und etwas vorschlägt." }),
      f("Complete the notes about the report. Write one word or a number.", [
        feld("Lindiwe gets up at half past …", ["five", "5"]),
        feld("Her instrument is the …", ["trumpet", "the trumpet"]),
        feld("Number of children she teaches:", ["six", "6"]),
        feld("She wants to become a … teacher.", ["music"])
      ], { text: "t1", tolerant: true }),
      a("Name two things that show that Lindiwe is a good leader. Answer in English.", [
        kr("eine Sache aus dem Text", 1, "zum Beispiel: She had an idea when the lights went out. / She did not want to let Mr Jacobs down. / She teaches small children."),
        kr("eine zweite, andere Sache aus dem Text", 1, "eine andere der Sachen (auch: She kept the group together. / She practises every evening.)"),
        kr("verständlich auf Englisch (eigene Worte oder passende Wörter aus dem Text; Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
      ], "When the lights went out, she had an idea and the band went on playing. She also teaches small children for free.", ["idea|play|dark|light", "teach|children|trust|practise|library"], { text: "t1", zeilen: [13, 19] })
    ]),
    ...teil("C Grammar and vocabulary", [
      f("Complete the sentences with the past progressive, the simple past or the present perfect of the verbs in brackets.", [
        feld("While Mpho (do) … his homework, the dog ate his sandwich.", ["was doing"]),
        feld("We (not / watch) … TV when the doorbell rang.", ["were not watching", "weren't watching", "weren’t watching"]),
        feld("What (the girls / do) … at nine o'clock?", ["were the girls doing"]),
        feld("I (hear) … a loud noise while I was cooking.", ["heard"]),
        feld("My aunt (work) … in this hospital for eight years.", ["has worked"]),
        feld("They (be) … friends since 2018.", ["have been", "'ve been", "’ve been"])
      ], { hinweis: "Past progressive: was/were + Verb mit -ing. Present perfect: have/has + dritte Form des Verbs." }),
      c("Which sentence is correct?", ["I was reading a book when she called me.", "I were reading a book when she called me.", "I was read a book when she called me."], 0),
      c("Sam was riding his scooter ___ he fell off.", ["when", "for", "since"], 0),
      c("Only one sentence is right. Which one?", ["He has been ill since Monday.", "He has been ill for Monday.", "He is ill since Monday."], 0),
      f("Write for or since.", [
        feld("We have known each other … two years.", ["for"]),
        feld("It has been windy … this morning.", ["since"])
      ], { hinweis: "for + Zeitraum (two years), since + Zeitpunkt (Monday, 2020)." }),
      m("Match the words with their meanings.", [["to admire", "to like and respect someone very much"], ["reliable", "you can always trust this person"], ["a role model", "a person that others want to be like"]])
    ]),
    ...teil("D Mediation", [
      a("You are on holiday in South Africa. You are at Fernlea Surgery with your little brother Jonas. Your mum stayed with the baby and wrote you this message in German. Tell the doctor, Dr Govender, the important things in English (4 to 6 sentences). Do not translate word for word.", [
        kr("Jonas ist auf der Treppe ausgerutscht (vor ungefähr zwei Stunden)", 2, "2 Punkte: was (slipped / fell on the stairs) und wann (about two hours ago) · 1 Punkt: nur eines davon"),
        kr("linker Knöchel dick und schmerzhaft, Jonas kann kaum auftreten", 2, "2 Punkte: Knöchel (left ankle, swollen / hurts) und Auftreten (can hardly walk) · 1 Punkt: nur eines davon"),
        kr("nicht mit dem Kopf aufgeschlagen", 1, "he did not hit his head – Umschreiben gilt"),
        kr("allergisch gegen Penicillin", 1, "he is allergic to penicillin"),
        kr("der Fuß wurde schon mit Eis gekühlt", 1, "we have put ice on his foot / we cooled it with ice"),
        kr("Sprachmittlung: verständliches, einfaches Englisch für die Ärztin, nicht Wort für Wort; Unwichtiges (Auto, Werkstatt, Schild) fehlt", 1)
      ], "Doctor, my brother Jonas slipped on the stairs about two hours ago. His left ankle is swollen and it hurts a lot, so he can hardly walk. He did not hit his head. He is allergic to penicillin. We have put ice on his foot.",
      ["stairs|slip|fell", "two|2|hours", "ankle|foot", "walk|stand", "head", "allerg|penicillin", "ice"], { vorgabe: B_ERZAEHLUNG })
    ]),
    ...teil("E Writing", [
      s("Write a text about a role model from your club, your school or your town (80 to 100 words). Tell us: who the person is · what he or she did in the past · what he or she has done until today (for or since) · why this person is your role model · what you have learned from him or her.", [
        kr("Inhalt", 5, "alle fünf Punkte des Auftrags – je Punkt 1: wer ist die Person · was hat sie getan · was tut sie bis heute · warum Vorbild · was habe ich gelernt"),
        kr("Textsorte und Aufbau", 2, "Text über eine Person mit Einleitung und Schluss, sinnvolle Reihenfolge, ein paar Verbindungswörter (because, so, but, and, now)"),
        kr("Grammatik", 3, "Vergangenes im simple past, mindestens ein Satz im present perfect mit for oder since; gern ein Satz mit was/were + -ing; Fehler stören das Verstehen kaum"),
        kr("Wortschatz", 2, "passende Wörter für Vorbilder und Eigenschaften (brave, reliable, to admire, to help), nicht nur good und nice"),
        kr("Rechtschreibung", 2, "häufige Wörter und die Wörter der Unit sind meist richtig geschrieben", { rs: true })
      ], { minWoerter: 60, plan: [
        { id: "who", label: "Who is your role model and where do you know him or her from?", hilfe: "My role model is … in my club / school / town" },
        { id: "did", label: "What did he or she do?", hilfe: "simple past" },
        { id: "today", label: "What has he or she done until today?", hilfe: "present perfect: has trained … for … / since …" },
        { id: "why", label: "Why is this person a role model?", hilfe: "because …, brave, reliable" },
        { id: "learned", label: "What have you learned?", hilfe: "I have learned that …" },
        { id: "ending", label: "Ending", hilfe: "That is why I admire … / Thank you, …" }
      ] })
    ])
  ]
});

module.exports = { p3a, p3b };
