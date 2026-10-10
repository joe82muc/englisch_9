"use strict";

/**
 * Englisch 9R · Probe 4: Unit 4 – News from New Zealand
 * Teile: A Listening (12) · B Reading (12) · C Grammar and vocabulary (14) · D Mediation (8) · E Writing (14) = 60 Punkte,
 * 60 Minuten. Grammatik der Unit: going to-future (Pläne), passive voice im simple present und simple past (nur
 * verstehen: "What does the sentence mean?", "Who does the action?"), simple past im Bericht. Wortschatz: Berufe,
 * Eigenschaften, Praktikum.
 * LehrplanPLUS E9 (Regelklasse): 1.1 Hörverstehen, 1.2 Leseverstehen, 1.4 Schreiben, 1.5 Sprachmittlung, 2 Wortschatz
 * und Grammatik. Alle Texte eigenständig für GRUMI erstellt, nichts aus Schulbuch, Prüfungen oder Lernmodulen.
 * Variante A: Berufsberatung an einer Schule (Hören: Aroha, Ms Tane; Wunsch Tischlerin, Praktikum in einer Bootswerkstatt),
 * Praktikumsbericht aus einer Marmeladenfirma (Lesen: Callum, Mr Whitford, Orchard Gate Jam Company), englische Anzeige
 * eines Jugendclubs (Sprachmittlung Englisch -> Deutsch an "dein Vater": Harbour Lane Youth Club, Port Selby),
 * Bewerbung um ein Praktikum (Schreiben: Fernhill Garden Centre).
 * Variante B: Vorstellungsgespräch um ein Praktikum (Hören: Josh, Mrs Paewai, Lakeside Cycle Repair in Tarn Cove),
 * Artikel über einen Reparaturtreff von Jung und Alt (Lesen: Mere, Mr Hobbs, Fix-It Friday in Marlow Cove), deutscher
 * Aushang einer Klettergruppe (Sprachmittlung Deutsch -> Englisch an Kiri: Turnverein Tannenberg e. V.),
 * Bewerbung um einen Ferienjob (Schreiben: Gull Street Ice Cream Café in Sandy Reach).
 * Erfundene Orte und Firmen: Pine Cove, Port Selby, Orchard Gate Jam Company, Harbour Lane, Fernhill Garden Centre,
 * Tarn Cove, Lakeside Cycle Repair, Marlow Cove, Turnverein Tannenberg, Sandy Reach, Gull Street Ice Cream Café.
 * Bleibt auf dem Server (Lösungen und Erwartungshorizont). Bausteine: bau.js.
 */
const { c, m, o, f, feld, z, a, kr, s, text, hoertext, teil, probe } = require("./bau");

const HINWEIS = "Work on your own. Part A: your teacher plays the recording twice – read the tasks first. Read every task carefully. Arbeite allein. Den Hörtext spielt deine Lehrkraft zweimal für alle ab. Nach der Abgabe kannst du nichts mehr ändern.";

/* ------------------------------ Variante A ------------------------------ */
const A_HOEREN = hoertext("h1", "After Year Nine", "Listening: a careers talk at school", [
  ["Ms Tane", "Hello Aroha, please come in. Today we are going to talk about your plans after Year Nine. What are you going to do next?"],
  ["Aroha", "Hello Ms Tane. I am going to apply for a place at the technical college in Pine Cove. I would like to become a carpenter."],
  ["Ms Tane", "That is a good idea. You are very good with your hands, and your teachers say that you are reliable. Are you going to do work experience first?"],
  ["Aroha", "Yes. I am going to spend two weeks at a boat workshop in September. My brother is not going to come with me. He is going to work in a bakery."],
  ["Ms Tane", "Excellent. What are you going to do in the workshop?"],
  ["Aroha", "I am going to learn how to use the machines, and I am going to make a small wooden box."],
  ["Ms Tane", "Very nice. Is there anything you are worried about?"],
  ["Aroha", "Yes. Writing is difficult for me, and I am not good at long texts."],
  ["Ms Tane", "Then your next step is a good CV. Come back on Thursday at ten past two and bring your last school marks. We are going to write the CV together."],
  ["Aroha", "Thank you very much. I will be there."]
], { stimmen: { "Ms Tane": "en-GB-SoniaNeural", Aroha: "en-GB-LibbyNeural" }, mal: 2 });

const A_LESEN = text("t1", "My week at the jam factory", "Report on work experience", [
  "Last month I did a week of work experience at the Orchard Gate Jam Company. It is a small firm near my town, and it is owned by Mr Whitford. I chose it because I like cooking and I wanted to see a real kitchen.",
  "On Monday I arrived at seven o'clock. I was shown the kitchen by Mr Whitford, and I got a white hat and an apron. The fruit is washed by two workers first. Then it is cooked in big pots. My first job was to cut apples. It was boring, but my hands got quicker every hour.",
  "On Tuesday and Wednesday I worked at the filling table. The jars are filled by a machine, but the lids are put on by hand. I made many mistakes at first, and one jar fell on the floor. Mr Whitford laughed and said, \"Everybody breaks a jar in the first week.\"",
  "On Thursday I wrote labels and packed boxes. The boxes are packed by hand and sent to shops all over the region. I did not like carrying the heavy boxes, but I liked the friendly team.",
  "On Friday I was asked to join the tasting. I tried six jams and gave my opinion. I am not going to be a jam maker, but I learnt that I like working in a team. Now I am going to look for a place in a kitchen for my next work experience."
]);

const A_ANZEIGE = "Harbour Lane Youth Club – Port Selby. Come and join us! We meet every Friday from 6 to 9 pm in the old school hall on Harbour Lane. The club is open to everyone between 12 and 17. You can play table tennis, cook together, make music in our band room or get help with your homework. Our new coffee machine arrived last week, and the walls were painted blue in the summer holidays. Membership costs $10 for the whole year, and your first evening is free. To register, fill in the form on our website before the end of the month or ask at the front desk on any Friday. Parents do not have to come. There is parking behind the hall.";

const p4a = probe(4, "A", {
  title: "Test 4 (R9): News from New Zealand", kurz: "Unit 4", scope: "Unit 4 · Listening, Reading, Grammar and vocabulary, Mediation, Writing", minutes: 60, hinweis: HINWEIS,
  texte: [A_HOEREN, A_LESEN],
  items: [
    ...teil("A Listening", [
      c("Which job would Aroha like to do?", ["carpenter", "baker", "teacher"], 0, { text: "h1" }),
      c("What is Aroha's brother going to do?", ["work in a bakery", "go to college", "build a boat"], 0, { text: "h1" }),
      c("What is difficult for Aroha?", ["writing long texts", "using machines", "getting up early"], 0, { text: "h1" }),
      c("What should Aroha bring on Thursday?", ["her last school marks", "a wooden box", "a letter from her teacher"], 0, { text: "h1" }),
      f("Listen again and complete the notes. Write one word or a number.", [
        feld("Technical college in: … Cove", ["Pine"]),
        feld("Work experience at a boat workshop for … weeks", ["two", "2"]),
        feld("Month of the work experience:", ["September"]),
        feld("Aroha is going to make a small wooden …", ["box", "a box"]),
        feld("Appointment on Thursday at ten past …", ["two", "2"])
      ], { text: "h1", tolerant: true, hinweis: "Lies vor dem Hören die Notizen: Dann weißt du, auf welche Zahl oder welches Wort du achten musst." }),
      o("What do they talk about first, next and last? Put the topics in the right order.", ["Aroha's plan for college", "Aroha's work experience", "the next step: a CV"], { text: "h1" })
    ]),
    ...teil("B Reading", [
      c("Why did Callum choose the jam company?", ["He likes cooking.", "His uncle works there.", "It is near the sea."], 0, { text: "t1" }),
      c("Who showed Callum the kitchen on Monday?", ["Mr Whitford", "two workers", "the team"], 0, { text: "t1" }),
      c("What happened at the filling table?", ["A jar fell on the floor.", "The machine broke.", "Callum cut his hand."], 0, { text: "t1" }),
      z("In which lines does the text say how the jars are filled and closed?", "t1", [[10, 12]], { hinweis: "Suche das Schlüsselwort aus der Frage (jars) im Text und lies dort genau." }),
      z("In which lines does Callum say what he did on Friday?", "t1", [[19, 20]], { hinweis: "Suche im Text das Wort Friday." }),
      f("Complete the notes about the report. Write one word or a number.", [
        feld("Callum arrived on Monday at … o'clock.", ["seven", "7"]),
        feld("His first job was to cut …", ["apples"]),
        feld("The lids are put on by …", ["hand"]),
        feld("On Friday he tried … jams.", ["six", "6"])
      ], { text: "t1", tolerant: true }),
      a("What did Callum not like or find difficult in his week? Give two things from the text. Answer in English.", [
        kr("eine Sache aus dem Text", 1, "zum Beispiel: Cutting apples was boring. / He made many mistakes at the filling table. / He did not like carrying the heavy boxes."),
        kr("eine zweite, andere Sache aus dem Text", 1, "eine andere der drei Sachen"),
        kr("verständlich auf Englisch (eigene Worte oder passende Wörter aus dem Text; Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
      ], "Cutting apples was boring for him, and he did not like carrying the heavy boxes.", ["boring|cut|apples", "heavy|boxes|carry|mistake|jar"], { text: "t1", zeilen: [8, 17] })
    ]),
    ...teil("C Grammar and vocabulary", [
      f("Complete the sentences with going to and the verbs in brackets.", [
        feld("Next week my class (visit) … a farm.", ["is going to visit"]),
        feld("We (not / wait) … for the bus. We will walk.", ["are not going to wait", "aren't going to wait", "aren’t going to wait"]),
        feld("What (you / do) … after school?", ["are you going to do"]),
        feld("I (not / go) … to the party. I am too tired.", ["am not going to go", "'m not going to go", "’m not going to go"]),
        feld("(your brother / join) … the sports club?", ["is your brother going to join", "Is your brother going to join"]),
        feld("They (start) … their work experience on Monday.", ["are going to start", "'re going to start", "’re going to start"])
      ], { hinweis: "going to: am / is / are + going to + Grundform. Bei der Verneinung steht not nach am / is / are." }),
      c("Which sentence is correct?", ["She is going to study design.", "She going to study design.", "She is going study design."], 0),
      c("The letters are written by the secretary. Who does the action?", ["the secretary", "the letters", "the boss"], 0),
      c("The shop was cleaned by the students last Friday. What does the sentence mean?", ["The students cleaned the shop last Friday.", "The students are going to clean the shop.", "The shop cleaned the students."], 0),
      f("Complete the sentences about last week with the simple past.", [
        feld("Yesterday I (write) … my CV.", ["wrote"]),
        feld("We (not / have) … much time at the end of the day.", ["did not have", "didn't have", "didn’t have"])
      ], { hinweis: "Im simple past gibt es bei Verneinung did not + Grundform." }),
      m("Match the words with their meanings.", [["reliable", "somebody you can trust to do a job well"], ["punctual", "always arriving at the right time"], ["to apply for", "to ask formally for a job"]])
    ]),
    ...teil("D Mediation", [
      a("You are in New Zealand with your father. He does not speak English. You find this advert for a youth club. Tell your father in German the important things (4 to 6 sentences). Do not translate word for word.", [
        kr("Was: Jugendclub mit Angeboten (zum Beispiel Tischtennis, Kochen, Musik, Hausaufgabenhilfe)", 1, "mindestens ein bis zwei Angebote genannt"),
        kr("Wann: freitags von 18 bis 21 Uhr", 2, "2 Punkte: Tag und Uhrzeit · 1 Punkt: nur eines davon"),
        kr("Für wen: Jugendliche von 12 bis 17 Jahren", 1, "beide Altersgrenzen oder sinngemäß 'Jugendliche ab 12 bis 17'"),
        kr("Kosten: 10 Dollar für das ganze Jahr, der erste Abend ist kostenlos", 2, "2 Punkte: Preis mit Zeitraum und der kostenlose erste Abend · 1 Punkt: nur eines davon"),
        kr("Anmeldung: Formular auf der Webseite oder freitags am Empfang", 1, "ein Weg der Anmeldung genügt; Frist (vor Monatsende) ist ein Plus"),
        kr("Sprachmittlung: verständliches Deutsch für den Vater, nicht Wort für Wort; Unwichtiges (Kaffeemaschine, Wandfarbe, Parkplatz) fehlt", 1)
      ], "Papa, das ist ein Jugendclub. Er ist jeden Freitag von 18 bis 21 Uhr und für Jugendliche zwischen 12 und 17 Jahren. Man kann Tischtennis spielen, zusammen kochen, Musik machen oder Hausaufgaben machen. Die Mitgliedschaft kostet 10 Dollar für das ganze Jahr, der erste Abend ist gratis. Anmelden kann man sich auf der Webseite oder freitags am Empfang.",
      ["tischtennis|kochen|musik|hausaufgaben", "freitag", "18|21|sechs|neun", "12|17|jugendlich", "10|zehn", "gratis|kostenlos|umsonst|frei", "anmeld|formular|webseite|empfang"], { vorgabe: A_ANZEIGE })
    ]),
    ...teil("E Writing", [
      s("You see this advert: \"Fernhill Garden Centre, Port Selby: work experience places in July for students aged 14 and older. Two weeks. You help with plants and customers. You must be reliable and like working outside.\" Write an application email (80 to 100 words). Say why you are writing · what experience you have had (simple past) · what your strengths are · when you have time and what you are going to do.", [
        kr("Inhalt", 5, "je Punkt 1: Grund des Schreibens (Anzeige, Praktikum) · Erfahrung · Stärken · wann Zeit ist · höflicher Wunsch auf Antwort oder Einladung"),
        kr("Textsorte und Aufbau", 2, "formelle Anrede (Dear Sir or Madam / Dear Mr or Ms …) und Schlussformel (Yours faithfully / Yours sincerely / Kind regards), sinnvolle Reihenfolge, höflicher Ton"),
        kr("Grammatik", 3, "going to für Pläne, simple past für Erfahrungen; Fehler stören das Verstehen kaum"),
        kr("Wortschatz", 2, "passende Wörter für Bewerbung, Stärken und Berufe (reliable, skills, to apply for, work experience), nicht nur good und nice"),
        kr("Rechtschreibung", 2, "häufige Wörter und die Wörter der Unit sind meist richtig geschrieben", { rs: true })
      ], { minWoerter: 60, plan: [
        { id: "greeting", label: "Greeting", hilfe: "Dear Sir or Madam," },
        { id: "why", label: "Why I am writing", hilfe: "I am writing because I saw your advert …" },
        { id: "experience", label: "My experience", hilfe: "simple past" },
        { id: "skills", label: "My skills and strengths", hilfe: "I am reliable / I can …" },
        { id: "when", label: "When I can start", hilfe: "I am going to be free …" },
        { id: "ending", label: "Ending", hilfe: "I look forward to hearing from you. / Yours faithfully," }
      ] })
    ])
  ]
});

/* ------------------------------ Variante B ------------------------------ */
const B_HOEREN = hoertext("h1", "The interview", "Listening: a job interview", [
  ["Mrs Paewai", "Good morning, Josh. Please sit down. Thank you for coming to the interview for our work experience place."],
  ["Josh", "Good morning, Mrs Paewai. Thank you for inviting me."],
  ["Mrs Paewai", "Why do you want to work in a bike shop?"],
  ["Josh", "I love bikes. Last year I repaired my brother's old bike, and I changed two tyres by myself."],
  ["Mrs Paewai", "Very good. Are you punctual? Our day starts at quarter to eight."],
  ["Josh", "Yes, I am always on time. I ride my bike to school, so I know the way."],
  ["Mrs Paewai", "Good. The work experience is going to last three weeks. It starts in November. Every day finishes at half past four."],
  ["Mrs Paewai", "You are going to help in the shop and clean the bikes. In the first week you are not going to work with the electric bikes."],
  ["Josh", "That is fine. What should I bring?"],
  ["Mrs Paewai", "Please bring old trousers, a bottle of water and a copy of your CV. You will get an apron from us. Please bring your own lunch."],
  ["Josh", "Okay. When will I know the result?"],
  ["Mrs Paewai", "I am going to call you on Friday afternoon."],
  ["Josh", "Thank you very much."]
], { stimmen: { "Mrs Paewai": "en-GB-SoniaNeural", Josh: "en-US-GuyNeural" }, mal: 2 });

const B_LESEN = text("t1", "Fix-It Friday", "Newspaper article", [
  "Every Friday afternoon the community hall in Marlow Cove changes into a workshop. It is called Fix-It Friday, and it is a club for young and old people. Broken things are brought to the hall by neighbours: radios, toasters, lamps, bikes and torn jackets.",
  "The club started two years ago. Mr Hobbs, a retired electrician, had an idea. \"I had too much free time, and the young people in our street did not know how a radio works,\" he says. Now ten teenagers and six older helpers meet every week.",
  "Mere is fifteen and one of the youngest members. She was taught to solder by Mr Hobbs in her first month. \"At first my hands were shaking,\" she remembers. \"Now I can repair a lamp in twenty minutes.\" Every repair is written in a big book by Mere, so the club knows what was done.",
  "The club is not only about repairs. While they work, the members talk. The teenagers learn old tricks, and the older helpers are shown by the teenagers how to use phones and video calls. Tea and biscuits are served at four o'clock, and nobody works during the break.",
  "Next month the club is going to open a second workshop in the library. \"We are going to need more helpers,\" says Mr Hobbs. \"You do not have to be an expert. You only have to be curious.\""
]);

// Kein Fahrrad-Thema: Das Vorstellungsgespräch im Hörteil spielt schon in einem Fahrradladen.
const B_AUSHANG = "Turnverein Tannenberg e. V. – Klettergruppe für Jugendliche. Wir laden alle Jugendlichen von 10 bis 16 Jahren ein: Jeden Mittwoch von 15 bis 17 Uhr klettern wir gemeinsam in der Kletterhalle in der Mühlstraße. Seile und Gurte sind da, bitte bringt nur Sportschuhe und etwas zu trinken mit. Die Teilnahme ist kostenlos, nur den Eintritt in die Halle (2 Euro) bezahlt ihr selbst. Anmeldung bitte bis Freitag per E-Mail an den Verein oder direkt in der Halle. Unser Verein wurde 1952 gegründet und hat über 200 Mitglieder. Am letzten Sonntag im Monat gibt es Kaffee und Kuchen. Die Vorstandswahl findet im März statt.";

const p4b = probe(4, "B", {
  title: "Test 4 (R9): News from New Zealand", kurz: "Unit 4", scope: "Unit 4 · Listening, Reading, Grammar and vocabulary, Mediation, Writing", minutes: 60, hinweis: HINWEIS,
  texte: [B_HOEREN, B_LESEN],
  items: [
    ...teil("A Listening", [
      c("Why does Josh want to work in a bike shop?", ["He loves bikes.", "His brother works there.", "He needs money for a new bike."], 0, { text: "h1" }),
      c("How does Josh get to school?", ["by bike", "by bus", "on foot"], 0, { text: "h1" }),
      c("What is Josh not going to do in the first week?", ["work with the electric bikes", "clean the bikes", "help in the shop"], 0, { text: "h1" }),
      c("What is Mrs Paewai going to do on Friday afternoon?", ["call Josh", "visit Josh", "write an email"], 0, { text: "h1" }),
      f("Listen again and complete the notes. Write one word or a number.", [
        feld("The day starts at quarter to …", ["eight", "8"]),
        feld("The work experience lasts … weeks.", ["three", "3"]),
        feld("It starts in:", ["November"]),
        feld("Every day finishes at half past …", ["four", "4"]),
        feld("Josh must bring a copy of his …", ["CV", "cv", "his CV"])
      ], { text: "h1", tolerant: true, hinweis: "Lies vor dem Hören die Notizen: Dann weißt du, auf welche Zahl oder welches Wort du achten musst." }),
      o("What do they talk about first, next and last? Put the topics in the right order.", ["why Josh wants the place", "the work in the shop", "what Josh must bring"], { text: "h1" })
    ]),
    ...teil("B Reading", [
      c("What is Fix-It Friday?", ["a club for young and old people", "a shop for old radios", "a school lesson"], 0, { text: "t1" }),
      c("Who taught Mere to solder?", ["Mr Hobbs", "her neighbour", "a teenager"], 0, { text: "t1" }),
      c("What is the club going to do next month?", ["open a second workshop", "stop for the holidays", "move to a school"], 0, { text: "t1" }),
      z("In which lines does Mr Hobbs say why he started the club?", "t1", [[7, 9]], { hinweis: "Suche die wörtliche Rede von Mr Hobbs." }),
      z("In which lines does the text say what the older helpers learn from the teenagers?", "t1", [[17, 19]], { hinweis: "Suche das Schlüsselwort aus der Frage (older helpers) im Text." }),
      f("Complete the notes about the club. Write one word or a number.", [
        feld("The club meets every …", ["Friday", "friday"]),
        feld("Number of teenagers in the club:", ["ten", "10"]),
        feld("Mere can repair a lamp in … minutes.", ["twenty", "20"]),
        feld("Tea and biscuits are served at … o'clock.", ["four", "4"])
      ], { text: "t1", tolerant: true }),
      a("Why is the club good for both young and old people? Give two reasons from the text. Answer in English.", [
        kr("ein Grund aus dem Text", 1, "zum Beispiel: The teenagers learn to repair things. / The older helpers learn to use phones. / The members talk to each other."),
        kr("ein zweiter, anderer Grund aus dem Text", 1, "ein anderer der Gründe"),
        kr("verständlich auf Englisch (eigene Worte oder passende Wörter aus dem Text; Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
      ], "The teenagers learn old tricks and how to repair things, and the older helpers learn how to use phones and video calls.", ["learn|repair|tricks|solder", "phone|video|talk|call"], { text: "t1", zeilen: [16, 19] })
    ]),
    ...teil("C Grammar and vocabulary", [
      f("Complete the sentences with going to and the verbs in brackets.", [
        feld("My cousin (start) … a new job in May.", ["is going to start"]),
        feld("We (not / sell) … old books at the market.", ["are not going to sell", "aren't going to sell", "aren’t going to sell"]),
        feld("Where (they / meet) … after the lesson?", ["are they going to meet"]),
        feld("I (not / be) … late for the interview.", ["am not going to be", "'m not going to be", "’m not going to be"]),
        feld("(your sister / apply) … for the job?", ["is your sister going to apply", "Is your sister going to apply"]),
        feld("He (take) … a photo for his CV.", ["is going to take", "'s going to take", "’s going to take"])
      ], { hinweis: "going to: am / is / are + going to + Grundform. Bei der Verneinung steht not nach am / is / are." }),
      c("Which sentence is correct?", ["He isn't going to come to the party.", "He doesn't going to come to the party.", "He not going to come to the party."], 0),
      c("The windows are cleaned by the students every Monday. Who does the action?", ["the students", "the windows", "the teacher"], 0),
      c("Our CVs are checked by the teacher. What does the sentence mean?", ["The teacher checks our CVs.", "We check the teacher's CV.", "The teacher is going to write our CVs."], 0),
      f("Complete the sentences about last week with the simple past.", [
        feld("Last week we (visit) … a farm.", ["visited"]),
        feld("I (not / know) … the answer.", ["did not know", "didn't know", "didn’t know"])
      ], { hinweis: "Im simple past gibt es bei Verneinung did not + Grundform." }),
      m("Match the words with their meanings.", [["a CV", "a short paper that lists your school and jobs"], ["a skill", "something you can do well because you have learned it"], ["work experience", "a short time in a firm to learn about a job"]])
    ]),
    ...teil("D Mediation", [
      a("Your exchange student Kiri from New Zealand is visiting you. She does not speak German. You see this notice. Tell Kiri in English the important things (4 to 6 sentences). Do not translate word for word.", [
        kr("Was und wo: gemeinsam klettern in der Kletterhalle", 1, "a climbing group for young people, at the climbing hall"),
        kr("Wann: jeden Mittwoch von 15 bis 17 Uhr", 2, "2 Punkte: Tag und Uhrzeit (every Wednesday, 3 to 5 pm) · 1 Punkt: nur eines davon"),
        kr("Für wen: Jugendliche von 10 bis 16 Jahren", 1, "for young people from 10 to 16 / aged ten to sixteen"),
        kr("Kosten: kostenlos, nur der Eintritt in die Halle (2 Euro) kostet etwas", 1, "it is free; you only pay 2 euros for the hall"),
        kr("Mitbringen: Sportschuhe und etwas zu trinken (Seile und Gurte gibt es dort)", 1, "sports shoes and a drink – mindestens eines davon"),
        kr("Anmeldung: bis Freitag per E-Mail oder in der Halle", 1, "register by Friday by email or at the hall"),
        kr("Sprachmittlung: verständliches, einfaches Englisch für Kiri, nicht Wort für Wort; Unwichtiges (Gründungsjahr, Kaffee und Kuchen, Vorstandswahl) fehlt", 1)
      ], "Kiri, this is a climbing group for young people from 10 to 16. They meet every Wednesday from 3 to 5 pm at the climbing hall. It is free, but you pay 2 euros for the hall. Please bring sports shoes and a drink. You must register by Friday, by email or at the hall.",
      ["climb", "wednesday", "3|5|three|five", "10|16|ten|sixteen|young", "free", "shoes|drink|water", "register|friday|email"], { vorgabe: B_AUSHANG })
    ]),
    ...teil("E Writing", [
      s("You see this advert: \"Gull Street Ice Cream Café, Sandy Reach: holiday helpers wanted from December to January. Age 15 and older. You serve customers and clean tables. You must be friendly and work well in a team.\" Write an application email (80 to 100 words). Say why you are writing · what experience you have had (simple past) · what your strengths are · when you have time and what you are going to do.", [
        kr("Inhalt", 5, "je Punkt 1: Grund des Schreibens (Anzeige, Ferienjob) · Erfahrung · Stärken · wann Zeit ist · höflicher Wunsch auf Antwort oder Einladung"),
        kr("Textsorte und Aufbau", 2, "formelle Anrede (Dear Sir or Madam / Dear Mr or Ms …) und Schlussformel (Yours faithfully / Yours sincerely / Kind regards), sinnvolle Reihenfolge, höflicher Ton"),
        kr("Grammatik", 3, "going to für Pläne, simple past für Erfahrungen; Fehler stören das Verstehen kaum"),
        kr("Wortschatz", 2, "passende Wörter für Bewerbung, Stärken und Berufe (friendly, team, skills, to apply for), nicht nur good und nice"),
        kr("Rechtschreibung", 2, "häufige Wörter und die Wörter der Unit sind meist richtig geschrieben", { rs: true })
      ], { minWoerter: 60, plan: [
        { id: "greeting", label: "Greeting", hilfe: "Dear Sir or Madam," },
        { id: "why", label: "Why I am writing", hilfe: "I am writing because I saw your advert …" },
        { id: "experience", label: "My experience", hilfe: "simple past" },
        { id: "skills", label: "My skills and strengths", hilfe: "I am friendly / I can …" },
        { id: "when", label: "When I can start", hilfe: "I am going to be free …" },
        { id: "ending", label: "Ending", hilfe: "I look forward to hearing from you. / Yours faithfully," }
      ] })
    ])
  ]
});

module.exports = { p4a, p4b };
