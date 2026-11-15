"use strict";

/**
 * Englisch 7 · Probe 1: Unit 1 – Out and about in England (Wunsch der Lehrkraft vom 09.11.2026: „erstelle eine probe über
 * unit 1 mit kurzem listening wie bei klasse9, grammatikteil, reading (also kurzer Text und fragen dazu) und mediation wie
 * im modul und writing: where I live. umfang 90 minuten. m-schlüssel und r-schlüssel“).
 *
 * Teile: A Listening (12) · B Reading (12) · C Grammar and vocabulary (22) · D Mediation (10) · E Writing (14) = 70 Punkte,
 * 90 Minuten. 7M und 7R schreiben dieselben Aufgaben (nur der Umfang beim Schreiben ist verschieden: R 50–80, M 60–100
 * Wörter, wie im Modul „Where I live“); die Note folgt dem Zug der Fassung: M 50 % = Note 4, R 50 % = Note 3.
 *
 * Überarbeitet am 12.11.2026, bevor eine Klasse sie geschrieben hat (Wunsch der Lehrkraft: „prüfe auf schwierige wörter.
 * baue auch wörter aus der unit 1 7.klasse verstärkt ein“, dazu „lass das listening“ – Teil A mit Hörtext und Aufnahme ist
 * unverändert): Schwierige Wörter in Teil B bis E, die weder in Unit 1 noch im Grundwortschatz stehen, sind ersetzt
 * (to move, to miss, meal, quite expensive, newspaper article, guide, umbrella, audio guide, decides, meanings). Mehr
 * Wörter aus der Wortliste von Unit 1: large, northwest, half a million, catch, oh (Uhrzeit), drama, play, magician, act,
 * stage, design, scenery, healthy, brochure, city centre, exhibition, dinosaur, tour, brilliant, a.m., own, rent, rugby,
 * goat, theatre, capital, far from, a long way away, Bye for now.
 *
 * Abgleich mit Blue Line 3 (Klett, Bayern M-Zug, Unit 1, S. 10–31 – nur Themen und Can-do-Liste gelesen): Ferien in England
 * (Intro), den Heimatort beschreiben (Topic 1, simple past als Wiederholung), Schulalltag und Schul-AGs (Topic 2, simple
 * present mit Fragen und Kurzantworten, Possessivpronomen mine, yours …), Karten an einer Kasse kaufen (Mediation).
 * Wortschatz aus der Wortliste der Unit (GRUMI-Vokabeltrainer Unit 1).
 * Alle Texte, Personen und Orte sind eigenständig für GRUMI erstellt und erfunden (Kelmouth, Kingsmoor, Little Hatton,
 * Hollins Park School, Ravenhill Castle; Ella, Josh, Ruby, Priya, Dev, Mr Okafor, Chloe, Herr Brunner) – sie stehen weder
 * im Schulbuch noch in einem Lernmodul.
 * LehrplanPLUS E7: Hörverstehen, Leseverstehen, Sprachmittlung in Alltagssituationen, Schreiben (über den Wohnort),
 * Wortschatz und Grammatik der Unit.
 * Den Hörtext spielt die Lehrkraft in der Verwaltung zweimal für alle ab (Aufnahme in audio/, eine Datei je Fassung).
 * Bleibt auf dem Server (Lösungen und Erwartungshorizont). Bausteine: bau.js.
 */
const { c, m, o, f, feld, z, a, kr, s, text, hoertext, teil, probe7 } = require("./bau");

const HINWEIS = "Work on your own. Part A: your teacher plays the recording twice – read the tasks first. Read every task carefully. Arbeite allein. Den Hörtext spielt deine Lehrkraft zweimal für alle ab – lies vorher die Aufgaben. Du hast etwa 90 Minuten Zeit. Reinkopieren ist verboten und wird protokolliert. Nach der Abgabe kannst du nichts mehr ändern.";

/* ------------------------------ A Listening ------------------------------ */
const HOEREN = hoertext("h1", "Summer in Kelmouth", "Listening: two friends talk", [
  ["Ella", "Hi Josh! How were your summer holidays? Did you go away?"],
  ["Josh", "Hi Ella! Yes, we stayed with my uncle in Kelmouth for ten days. It's a small fishing town on the south coast, in Cornwall."],
  ["Ella", "Cool! What did you do there?"],
  ["Josh", "On the first day we went on a boat trip to the old lighthouse. On the second day we visited the castle on the hill. It's about six hundred years old."],
  ["Ella", "Was the weather good?"],
  ["Josh", "Not always. On the third day it rained all day, so we went to the town museum. There was an exhibition about pirates. It was really interesting."],
  ["Ella", "Pirates? That sounds like fun! Where did you sleep?"],
  ["Josh", "My uncle has a small house near the harbour. I slept in a tent in his garden with my cousin Ruby. She's eleven."],
  ["Ella", "And what's Kelmouth like?"],
  ["Josh", "It's very quiet. Only about two thousand people live there. In the past there was a big fish factory, but today most people work in hotels and cafés."],
  ["Ella", "Would you like to live there?"],
  ["Josh", "No, I wouldn't. It's too far from my friends, and there's only one bus a day. But the air is very clean, and the beaches are fantastic."],
  ["Ella", "Sounds great. Maybe I can come with you next summer!"]
], { stimmen: { Ella: "en-GB-LibbyNeural", Josh: "en-GB-RyanNeural" }, mal: 2 });

/* ------------------------------ B Reading ------------------------------ */
const LESEN = text("t1", "New in the city", "Blog post", [
  "Hi, I'm Priya, and I'm twelve years old. Last year my family lived in Little Hatton, a small village in the east of England. Now we live in Kingsmoor, a large city in the northwest. About half a million people live here. I go to Hollins Park School.",
  "Every morning I get up at a quarter to seven. I catch the bus at seven oh five, and it takes about forty minutes to get to school. My brother Dev doesn't take the bus. His school is only five minutes away, so he walks.",
  "Lessons start at half past eight. My favourite subject is Science because our teacher, Mr Okafor, does a lot of experiments with us. On Thursdays after school I go to the drama club. This year we are doing a play about a magician. I don't want to act on the stage, so I design the scenery. Last week we painted a big castle for the play!",
  "At lunchtime most students eat in the canteen. The food is healthy, but it costs a lot: a hot lunch is £3.20. So I usually bring sandwiches from home.",
  "Do I want to go back to Little Hatton? Sometimes. In Little Hatton everybody knew me, and it was always quiet. Kingsmoor is noisy, and there's a lot of traffic. But there are two cinemas, a big library and lots of shops. And at school I found a new friend, Chloe. Her bike is red and mine is blue, and every Saturday we ride to the library together."
]);

/* ------------------------------ D Mediation (wie im Modul A8 „Helping tourists“: Gespräch, Beitrag für Beitrag) ------------------------------ */
const LAGE = "You are at Ravenhill Castle with your family. A tourist from Germany, Herr Brunner, wants to buy tickets, but he doesn't speak much English. You help him.";
const UEBER = "Talk ABOUT Herr Brunner: He would like … · He asks … · His daughter …";
// Spricht das Kind gegenüber der Verkäuferin als Herr Brunner („I would like …“), zählt der Inhalt trotzdem – nur angestrichen
const ICH = " – Sagt das Kind I, my, me statt he, his, him, gilt der Punkt trotzdem; die Stelle wird nur angestrichen (Ausdruck, Verbesserung mit he/his).";

function fassung(zug) {
  const umfang = zug === "M" ? "60 to 100 words" : "50 to 80 words";
  return probe7(1, zug, "A", {
    title: "Test 1 (" + zug + "7): Out and about in England", kurz: "Unit 1",
    scope: "Unit 1 · Listening, Reading, Grammar and vocabulary, Mediation, Writing", minutes: 90, hinweis: HINWEIS,
    texte: [HOEREN, LESEN],
    items: [
      ...teil("A Listening", [
        c("Where is Kelmouth?", ["on the south coast of England", "in the north of England", "near London"], 0, { text: "h1" }),
        c("Where does Josh's uncle live?", ["near the harbour", "next to the castle", "in the town centre"], 0, { text: "h1" }),
        c("Why did they go to the museum?", ["It rained all day.", "Ruby wanted to see the pirates.", "The castle was closed."], 0, { text: "h1" }),
        c("Why doesn't Josh want to live in Kelmouth?", ["It is too far from his friends.", "It is too noisy.", "The beaches are dirty."], 0, { text: "h1" }),
        f("Listen again and complete the notes. Write one word or a number.", [
          feld("Josh stayed in Kelmouth for … days.", ["ten", "10"]),
          feld("The castle is about … years old.", ["six hundred", "600", "six-hundred"]),
          feld("The exhibition in the museum was about …", ["pirates"]),
          feld("Number of people in Kelmouth: about …", ["two thousand", "2000", "2,000", "2.000", "2 000", "two-thousand"]),
          feld("Ruby is … years old.", ["eleven", "11"])
        ], { text: "h1", tolerant: true, hinweis: "Lies vor dem Hören die Notizen: Dann weißt du, auf welche Zahl oder welches Wort du achten musst." }),
        o("What did Josh do first? Put the events in the right order.", ["Josh went on a boat trip to the lighthouse.", "Josh visited the castle.", "Josh saw an exhibition in the museum."], { text: "h1" })
      ]),
      ...teil("B Reading", [
        c("What kind of text is this?", ["a blog post", "a brochure for tourists", "a letter to a teacher"], 0, { text: "t1" }),
        c("Why doesn't Dev take the bus?", ["His school is very near.", "He doesn't like buses.", "The bus is always late."], 0, { text: "t1" }),
        c("What did the drama club do last week?", ["They painted a castle for the play.", "They visited a castle.", "They watched a play at the theatre."], 0, { text: "t1" }),
        z("In which line(s) does Priya say why she likes Science?", "t1", [[10, 12]], { hinweis: "Suche das Schlüsselwort aus der Frage (Science) im Text und lies dort genau." }),
        z("In which line(s) does Priya say what is good about Kingsmoor?", "t1", [[21, 23]], { hinweis: "Suche im letzten Absatz das Wort „But“: Danach kommt das Gute an Kingsmoor." }),
        f("Complete the notes about Priya. Write one word or a number.", [
          feld("About … people live in Kingsmoor.", ["half a million", "500,000", "500000", "500.000", "500 000", "five hundred thousand", "a half million"]),
          feld("Priya gets up at a quarter to …", ["seven", "7"]),
          feld("The bus ride to school takes about … minutes.", ["forty", "40"]),
          feld("A hot lunch in the canteen costs £ …", ["3.20", "3,20", "3.2", "three twenty", "three pounds twenty"])
        ], { text: "t1", tolerant: true }),
        a("Is life in Kingsmoor better or worse for Priya? Give one thing that is better and one thing that is worse than in Little Hatton. Answer in English.", [
          kr("eine Sache, die in Kingsmoor besser ist", 1, "zum Beispiel: There are two cinemas / a big library / lots of shops. / She has a new friend (Chloe). / the drama club"),
          kr("eine Sache, die in Kingsmoor schlechter ist", 1, "zum Beispiel: It is noisy. / There is a lot of traffic. / It isn't quiet. / Not everybody knows her (in Little Hatton everybody knew her). / The bus ride is long."),
          kr("verständlich auf Englisch (eigene Worte oder passende Wörter aus dem Text; Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
        ], "Better: In Kingsmoor there are two cinemas and a big library. Worse: Kingsmoor is noisy, and there is a lot of traffic.", ["cinema|library|shop|friend|chloe|club|drama", "noisy|traffic|loud|quiet|knew|know"], { text: "t1", zeilen: [19, 24] })
      ]),
      ...teil("C Grammar and vocabulary", [
        f("A class trip: Complete the sentences with the simple past of the verbs in brackets.", [
          feld("Last Saturday our class (take) … a train to the city centre.", ["took"]),
          feld("First we (visit) … an exhibition about dinosaurs.", ["visited"]),
          feld("Then our teacher (buy) … tickets for a boat tour.", ["bought"]),
          feld("The weather (be) … brilliant.", ["was"]),
          feld("Tom (not / come) … with us – he was ill.", ["did not come", "didn't come", "didn’t come"]),
          feld("(you / like) … the trip? – Yes, I did.", ["did you like"])
        ], { hinweis: "Wiederhole die unregelmäßigen Verben (take – took, buy – bought) und die Verneinung und Frage mit did + Grundform." }),
        f("Complete the sentences with the simple present of the verbs in brackets.", [
          feld("My cousin (live) … on a farm near the coast.", ["lives"]),
          feld("She (get up) … at 6 a.m. every day.", ["gets up"]),
          feld("Her parents (not / own) … the farm. They pay rent for it.", ["do not own", "don't own", "don’t own"]),
          feld("The bus (not / stop) … in her village.", ["does not stop", "doesn't stop", "doesn’t stop"])
        ], { hinweis: "he, she, it – das s muss mit! Verneinung: don't / doesn't + Grundform." }),
        f("Complete the questions and the short answers.", [
          feld("(your school / have) … a drama club? – Yes, it does.", ["does your school have"]),
          feld("(you / walk) … to school? – No, I don't. I catch the bus.", ["do you walk"]),
          feld("Does your sister play rugby? – Yes, …", ["she does", "yes, she does", "yes she does"]),
          feld("Do your friends live in the city centre? – No, …", ["they don't", "they do not", "no, they don't", "no they don't", "no, they do not"])
        ], { hinweis: "Fragen mit do / does + Grundform. Kurzantwort: Yes, she does. / No, they don't." }),
        f("Complete the sentences with mine, yours, his, hers, ours or theirs.", [
          feld("Is this your pencil case, Ben? – Yes, it's … . Thank you!", ["mine"]),
          feld("Amy has got a green bike. The green bike is … .", ["hers"]),
          feld("This isn't my ticket. Is it … , Mrs Lee?", ["yours"]),
          feld("My brother and I have got a goat. The white goat is … .", ["ours"])
        ], { hinweis: "mine (meins), yours (deins, Ihres), his (seins), hers (ihres), ours (unseres), theirs (ihres – von ihnen)." }),
        m("What do the words mean? Match them.", [["a factory", "a building where people make things"], ["noisy", "very loud – not quiet"], ["the coast", "the land next to the sea"], ["healthy", "good for your body"]])
      ]),
      ...teil("D Mediation", [
        a(LAGE + " Herr Brunner says something to you. Tell the assistant in English.", [
          kr("möchte Karten für die Burg – für sich und seine zwei Kinder (drei Personen) (zählt auch mit I/my statt he/his)", 1, "He would like tickets for the castle for himself and his two children. – drei Karten genügt auch" + ICH),
          kr("fragt nach dem Preis (zählt auch mit I/my statt he/his)", 1, "How much are the tickets? / He wants to know the price." + ICH)
        ], "He would like tickets for the castle for himself and his two children. How much are the tickets?", ["ticket", "two|2|three|3|children|kids", "how much|price|cost"],
        { vorgabe: "🧳 Herr Brunner: „Guten Tag! Ich möchte Karten für die Burg – für mich und meine zwei Kinder. Was kosten die Karten?“", hilfe: UEBER }),
        a("The assistant answers. Tell Herr Brunner in German what she says.", [
          kr("Erwachsene zahlen 12 Pfund, Kinder von 5 bis 15 Jahren zahlen den halben Preis", 1, "beide Angaben sinngemäß; Pfund, nicht Euro"),
          kr("sie fragt, wie alt die Kinder sind", 1)
        ], "Erwachsene zahlen 12 Pfund. Kinder von 5 bis 15 zahlen den halben Preis. Sie fragt, wie alt Ihre Kinder sind.", ["12|zwölf|zwoelf", "halb|haelfte|hälfte|6|sechs", "alt|alter"],
        { vorgabe: "🏰 Assistant: “Adults pay £12. How old are the children? Children from 5 to 15 pay half price.”" }),
        a("Herr Brunner answers and asks something. Tell the assistant in English.", [
          kr("Alter der Kinder: Tochter 10, Sohn 16 (zählt auch mit I/my statt he/his)", 1, "His daughter is ten and his son is sixteen. – beide Zahlen richtig" + ICH),
          kr("fragt nach einer Führung auf Deutsch (zählt auch mit I/my statt he/his)", 1, "Is there a tour in German? / He asks for a tour in German." + ICH)
        ], "His daughter is ten, and his son is sixteen. He asks: Is there a tour in German?", ["ten|10", "sixteen|16", "tour|guide", "german"],
        { vorgabe: "🧳 Herr Brunner: „Meine Tochter ist zehn, mein Sohn ist sechzehn. Gibt es auch eine Führung auf Deutsch?“", hilfe: UEBER }),
        a("The assistant answers. Tell Herr Brunner in German what she says.", [
          kr("keine Führung auf Deutsch, aber eine Broschüre auf Deutsch für 2 Pfund", 1, "beide Angaben sinngemäß (Broschüre, Heft oder Prospekt)"),
          kr("zusammen 30 Pfund (zwei Erwachsene und ein Kind – der Sohn zahlt wie ein Erwachsener)", 1, "der Betrag 30 Pfund genügt")
        ], "Leider gibt es keine Führung auf Deutsch, aber eine Broschüre auf Deutsch für 2 Pfund. Zwei Erwachsene und ein Kind kosten zusammen 30 Pfund.", ["keine|nicht|leider", "brosch|heft|prospekt", "2|zwei", "30|dreißig|dreissig"],
        { vorgabe: "🏰 Assistant: “I'm afraid there's no tour in German. But we have a brochure in German for £2. Two adults and one child – that's £30, please.”" }),
        a("Herr Brunner says what he wants. Tell the assistant in English.", [
          kr("nimmt die drei Karten und eine Broschüre (zählt auch mit I/my statt he/his)", 1, "He would like the three tickets and a brochure. – brochure falsch geschrieben zählt" + ICH),
          kr("fragt, ob er mit Karte zahlen kann (zählt auch mit I/my statt he/his)", 1, "Can he pay by card?" + ICH)
        ], "He would like the three tickets and a brochure. Can he pay by card?", ["three|3|ticket", "broch|brosch|brosh|brour|booklet", "card"],
        { vorgabe: "🧳 Herr Brunner: „Gut, dann nehmen wir die drei Karten und eine Broschüre. Kann ich mit Karte bezahlen?“", hilfe: UEBER })
      ]),
      ...teil("E Writing", [
        s("Where I live: Your class is making a website about the places where you live. Write a short text about your village, town or city (" + umfang + "). Write about: the name of the place, what kind of place it is and where it is · how many people live there · what it was like in the past · your favourite place there and what you can do there · what you like or don't like about the place and why.", [
          kr("Inhalt", 5, "alle fünf Punkte des Auftrags – je Punkt 1: Name, Art des Ortes (village, town, city) und Lage · Einwohnerzahl oder Größe · wie es früher war (there was / there were …) · Lieblingsort und was man dort tun kann · was gefällt oder nicht gefällt, mit Grund (because …)"),
          kr("Textsorte und Aufbau", 2, "kurzer Text für die Website der Klasse: Einstieg (Hi, I'm … / I live in …), sinnvolle Reihenfolge, ein Schlusssatz; Sätze verbunden (and, but, because)"),
          kr("Grammatik", 3, "simple present für heute (I live, it has, people work – he/she/it mit s), simple past für früher (there was, there were, people worked); Fehler stören das Verstehen kaum"),
          kr("Wortschatz", 2, "passende Wörter der Unit für Orte (village, town, large city, capital, city centre, in the north / south / east / west of …, near, far from, a long way away, coast, quiet, noisy, traffic, the air is clean, factory, mine, farm …), nicht nur nice und good"),
          kr("Rechtschreibung", 2, "häufige Wörter und die Wörter der Unit sind meist richtig geschrieben", { rs: true })
        ], { minWoerter: zug === "M" ? 50 : 40, plan: [
          { id: "start", label: "Start", hilfe: "Hi, I'm … I live in …" },
          { id: "place", label: "What kind of place? Where is it?", hilfe: "It's a small village / a large town in the south of Bavaria, near … / not far from …" },
          { id: "people", label: "How many people live there?", hilfe: "About … people live there. (2,500 / 50,000 / half a million)" },
          { id: "past", label: "In the past …", hilfe: "In the past there was a factory / a mine … / there were a lot of farms …" },
          { id: "favourite", label: "My favourite place – what can you do there?", hilfe: "My favourite place is the city centre / the … You can …" },
          { id: "opinion", label: "What do you like or not like? Why?", hilfe: "I like it because it's quiet and the air is clean. / I don't like the traffic – it's noisy." },
          { id: "end", label: "End", hilfe: "Come and visit …! / Bye for now." }
        ] })
      ])
    ]
  });
}

const p1r = fassung("R"), p1m = fassung("M");
module.exports = { p1r, p1m };

/* ====================================================== Variante B ======================================================
 * Nachschreibprobe (Auftrag vom 15.11.2026, Plan progress/englisch7/MODULE.md, „Tests Unit 1“): Variante A oben bleibt
 * Zeichen für Zeichen, wie sie ist (es gibt Abgaben) – B steht nur dahinter. Aufbau genau wie A, damit der Nachschreiber
 * gleichwertig ist: dieselben Teile, Aufgabenarten, Punkte und Hilfen (A Listening 12 · B Reading 12 · C Grammar and
 * vocabulary 22 · D Mediation 10 · E Writing 14 = 70 Punkte, 90 Minuten); 7M und 7R schreiben dieselben Aufgaben, nur der
 * Umfang beim Schreiben ist verschieden (R 50–80, M 60–100 Wörter) – gleiche Bewertung wie A (Raster 5 · 2 · 3 · 2 · 2).
 * Eigene Texte und Situationen: Hörtext Maisie (Mädchen) und Reggie (Junge) über einen Tagesausflug nach Brinmouth
 * (erfundener Küstenort, 219 Wörter, Zahlen ausgeschrieben) · Blog von Elodie, neu an der Hollybrook School in Wexley
 * (erfunden, 245 Wörter; Lehrer Mr Ashworth) · Sprachmittlung an der Kasse der Larkdale-Dampfeisenbahn (erfunden) mit der
 * Touristin Frau Keller (wie A Beitrag für Beitrag, Deutsch ↔ Englisch) · E-Mail an Elodie über den eigenen Schultag (Topic 2).
 * Nichts aus dem Schulbuch (keine Theaterkasse mit Halbpreiskarten, kein Surfen, keine Radtour, kein Verkehrsmuseum).
 * Wortschatz aus der Wortliste von Unit 1 (GRUMI-Vokabeltrainer): coast, east, south, north, large, noisy, quiet, the air is
 * clean, a long way away, to catch (bus/train), to take (dauern), a.m., p.m., to design, drama, canteen, healthy, traffic,
 * factory, city centre, capital, adult, brochure, to drive – drove.
 * Die Aufnahme des Hörtexts fehlt noch (audio/e7-p1-<r|m>-b-h1.mp3, eine Aufnahme für beide Züge; Gemini TTS nach dem
 * Gegenlesen, Rollen in .codex-build/englisch7-probe/plan-e7.json).
 */
const B_HOEREN = hoertext("h1", "A day in Brinmouth", "Listening: two friends talk", [
  ["Reggie", "Hi Maisie! You weren't at the football club on Saturday. Where were you?"],
  ["Maisie", "Hi Reggie! I was in Brinmouth with my mum and my little brother. It's a small town on the east coast."],
  ["Reggie", "How did you get there?"],
  ["Maisie", "We caught the train at a quarter past eight. The journey took two hours."],
  ["Reggie", "What did you do first?"],
  ["Maisie", "First we walked along the beach to the old harbour. There's a big old ship there. It's about two hundred years old, and today it's a museum."],
  ["Reggie", "Did you go on the ship?"],
  ["Maisie", "Yes, we did. The beds on the ship were very small! After that we bought sandwiches at the market and had a picnic on the beach."],
  ["Reggie", "Did you swim in the sea?"],
  ["Maisie", "No, we didn't. It was sunny, but the wind was very cold. So in the afternoon we went fishing from the harbour wall. My brother caught twelve little fish, and I only caught five. But we put them all back."],
  ["Reggie", "Would you like to live in Brinmouth?"],
  ["Maisie", "Yes, I would. It's quiet, the air is clean, and you can see the sea from almost every street. But there isn't a cinema, and in winter a lot of shops are closed."],
  ["Reggie", "No cinema? I don't think I'd like that."],
  ["Maisie", "Well, you can come with us next time!"]
], { stimmen: { Maisie: "en-GB-SoniaNeural", Reggie: "en-GB-RyanNeural" }, mal: 2 });

const B_LESEN = text("t1", "My first weeks in Wexley", "Blog post", [
  "Hi, I'm Elodie, and I'm twelve. Last year my family lived in a large, noisy city in the north of England. Now we live in Wexley, a small town on the south coast. About twelve thousand people live here. I go to Hollybrook School. It's small – it has about four hundred students.",
  "I get up at seven o'clock. Our house is a long way away from the school, but my mum works at the hospital next to Hollybrook, so she drives me there every morning. Lessons start at ten to nine.",
  "My favourite subject is Art. Our teacher, Mr Ashworth, is really funny, and in his lessons we design our own posters and T-shirts. On Tuesdays I go to the science club. Last week we made a rocket out of an old bottle and some water. It flew over the school roof!",
  "Every student at Hollybrook wears a school uniform: a dark blue jumper, a white shirt and grey trousers or a grey skirt. At my old school we didn't wear a uniform, so I didn't like it at first. But now I think it's OK – in the morning I don't have to think about my clothes!",
  "Do I miss my old city? Sometimes. I miss my friends, and there isn't much to do in Wexley in the evenings. But the sea is only two miles from our house, and on Sundays I walk on the beach with my dad. I really like it here!"
]);

// D Mediation wie in A: Gespräch an einer Kasse, Beitrag für Beitrag, abwechselnd Deutsch → Englisch und Englisch → Deutsch
const B_LAGE = "You are at the Larkdale Railway with your family. It is an old railway with steam trains (Dampfzüge). A tourist from Germany, Frau Keller, wants to buy tickets, but she doesn't speak much English. You help her.";
const B_UEBER = "Talk ABOUT Frau Keller: She would like … · She asks … · Her husband …";
// Spricht das Kind gegenüber dem Verkäufer als Frau Keller („I would like …“), zählt der Inhalt trotzdem – nur angestrichen
const B_ICH = " – Sagt das Kind I, my, me statt she, her, gilt der Punkt trotzdem; die Stelle wird nur angestrichen (Ausdruck, Verbesserung mit she/her).";

function fassungB(zug) {
  const umfang = zug === "M" ? "60 to 100 words" : "50 to 80 words";
  return probe7(1, zug, "B", {
    title: "Test 1 (" + zug + "7): Out and about in England", kurz: "Unit 1",
    scope: "Unit 1 · Listening, Reading, Grammar and vocabulary, Mediation, Writing", minutes: 90, hinweis: HINWEIS,
    texte: [B_HOEREN, B_LESEN],
    items: [
      ...teil("A Listening", [
        c("Who went to Brinmouth with Maisie?", ["her mum and her little brother", "her dad and her grandma", "her class and her teacher"], 0, { text: "h1" }),
        c("What did they have for lunch?", ["sandwiches from the market", "fish and chips at a café", "pizza on the train"], 0, { text: "h1" }),
        c("Why didn't they swim in the sea?", ["The wind was very cold.", "The water was dirty.", "There were too many people on the beach."], 0, { text: "h1" }),
        c("What does Maisie say is not so good about Brinmouth?", ["There isn't a cinema.", "It is very noisy.", "The air isn't clean."], 0, { text: "h1" }),
        f("Listen again and complete the notes. Write one word or a number.", [
          feld("Brinmouth is on the … coast.", ["east"]),
          feld("They caught the train at a quarter past …", ["eight", "8"]),
          feld("The train journey took … hours.", ["two", "2"]),
          feld("The old ship is about … years old.", ["two hundred", "200", "two-hundred"]),
          feld("Maisie caught … fish.", ["five", "5"])
        ], { text: "h1", tolerant: true, hinweis: "Lies vor dem Hören die Notizen: Dann weißt du, auf welche Zahl oder welches Wort du achten musst." }),
        o("Maisie's day in Brinmouth: Put the events in the right order.", ["Maisie went on an old ship.", "Maisie had a picnic on the beach.", "Maisie went fishing."], { text: "h1" })
      ]),
      ...teil("B Reading", [
        c("Who is Elodie?", ["a new student at Hollybrook School", "a teacher at Hollybrook School", "a tourist on holiday in Wexley"], 0, { text: "t1" }),
        c("Where does Elodie's mum work?", ["at the hospital next to the school", "at Hollybrook School", "in a shop in Wexley"], 0, { text: "t1" }),
        c("What happened at the science club last week?", ["Their bottle rocket flew over the school roof.", "They visited a science museum.", "Mr Ashworth showed them a real rocket."], 0, { text: "t1" }),
        z("In which line(s) does Elodie say what the students do in Mr Ashworth's lessons?", "t1", [[10, 12]], { hinweis: "Suche den Namen aus der Frage (Mr Ashworth) im Text und lies den Satz bis zum Ende." }),
        z("In which line(s) does Elodie say why the uniform is OK for her now?", "t1", [[18, 19]], { hinweis: "Suche das Schlüsselwort aus der Frage (uniform) im Text. Nach dem Wort „But“ steht, was sie heute denkt." }),
        f("Complete the notes about Elodie. Write one word or a number.", [
          feld("About … people live in Wexley.", ["twelve thousand", "12,000", "12000", "12.000", "12 000", "twelve-thousand"]),
          feld("Hollybrook School has got about … students.", ["four hundred", "400", "four-hundred"]),
          feld("Lessons start at ten to …", ["nine", "9"]),
          feld("The sea is … miles from Elodie's house.", ["two", "2"])
        ], { text: "t1", tolerant: true }),
        a("What does Elodie like about her new life in Wexley, and what doesn't she like so much? Give one thing for each. Answer in English.", [
          kr("eine Sache, die Elodie gefällt", 1, "zum Beispiel: Art / Mr Ashworth is funny / they design posters and T-shirts / the science club / the sea is near / walks on the beach (with her dad) / the uniform is OK now / she really likes it here"),
          kr("eine Sache, die ihr nicht so gefällt oder die sie vermisst", 1, "zum Beispiel: She misses her friends (from her old city). / There isn't much to do in the evenings. / At first she didn't like the uniform. / The house is a long way from the school."),
          kr("verständlich auf Englisch (eigene Worte oder passende Wörter aus dem Text; Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
        ], "She likes the sea and the walks on the beach with her dad. She misses her friends, and there isn't much to do in Wexley in the evenings.", ["art|ashworth|poster|science|rocket|sea|beach|uniform|club|funny", "friend|evening|miss|much to do|uniform|long way"], { text: "t1", zeilen: [10, 23] })
      ]),
      ...teil("C Grammar and vocabulary", [
        f("A trip to the seaside: Complete the sentences with the simple past of the verbs in brackets.", [
          feld("Last Sunday my family (drive) … to the coast.", ["drove"]),
          feld("First we (walk) … along the beach.", ["walked"]),
          feld("Then my dad (find) … a nice café near the harbour.", ["found"]),
          feld("The sandwiches there (be) … very good.", ["were"]),
          feld("My sister (not / want) … to go home – she loved the sea.", ["did not want", "didn't want", "didn’t want"]),
          feld("(you / have) … a good weekend? – Yes, I did.", ["did you have"])
        ], { hinweis: "Wiederhole die unregelmäßigen Verben (drive – drove, find – found) und die Verneinung und Frage mit did + Grundform." }),
        f("Complete the sentences with the simple present of the verbs in brackets.", [
          feld("My uncle (work) … in a factory near the city centre.", ["works"]),
          feld("He (catch) … the bus at 6.15 a.m. every day.", ["catches"]),
          feld("My cousins (not / like) … the noisy traffic in the city.", ["do not like", "don't like", "don’t like"]),
          feld("My aunt (not / drive) … to work. She goes by train.", ["does not drive", "doesn't drive", "doesn’t drive"])
        ], { hinweis: "he, she, it – das s muss mit (catch – catches)! Verneinung: don't / doesn't + Grundform." }),
        f("Complete the questions and the short answers.", [
          feld("(your brother / like) … his new school? – Yes, he does.", ["does your brother like"]),
          feld("(you / have) … lunch in the canteen? – No, I don't. I bring sandwiches.", ["do you have"]),
          feld("Does Mr Ashworth give a lot of homework? – No, …", ["he doesn't", "he does not", "no, he doesn't", "no he doesn't", "no, he does not"]),
          feld("Do your parents work in the city centre? – Yes, …", ["they do", "yes, they do", "yes they do"])
        ], { hinweis: "Fragen mit do / does + Grundform. Kurzantwort: Yes, they do. / No, he doesn't." }),
        f("Complete the sentences with mine, yours, his, hers, ours or theirs.", [
          feld("This isn't my pen. Is it … , Reggie?", ["yours"]),
          feld("Reggie has got a black school bag. The black bag is … .", ["his"]),
          feld("My grandparents have got a big garden. The big garden is … .", ["theirs"]),
          feld("Is this your scarf? – Yes, it's … . Thanks!", ["mine"])
        ], { hinweis: "mine (meins), yours (deins, Ihres), his (seins), hers (ihres), ours (unseres), theirs (ihres – von ihnen)." }),
        m("What do the words mean? Match them.", [["traffic", "all the cars, buses and bikes on the road"], ["a capital", "the most important city of a country"], ["an adult", "a person who isn't a child any more"], ["a brochure", "a small book with pictures and information"]])
      ]),
      ...teil("D Mediation", [
        a(B_LAGE + " Frau Keller says something to you. Tell the assistant in English.", [
          kr("möchte zwei Karten für den Dampfzug – für sich und ihren Mann (zählt auch mit I/my statt she/her)", 1, "She would like two tickets for the (steam) train for herself and her husband. – zwei Karten genügt auch" + B_ICH),
          kr("fragt, wann der nächste Zug fährt (zählt auch mit I/my statt she/her)", 1, "When does the next train leave? / She wants to know when the next train goes." + B_ICH)
        ], "She would like two tickets for the steam train for herself and her husband. When does the next train leave?", ["ticket", "two|2|husband", "when|time|next"],
        { vorgabe: "🧳 Frau Keller: „Guten Tag! Ich möchte zwei Karten für den Dampfzug – für mich und meinen Mann. Wann fährt der nächste Zug?“", hilfe: B_UEBER }),
        a("The assistant answers. Tell Frau Keller in German what he says.", [
          kr("der nächste Zug fährt um 11.30 Uhr", 1, "Uhrzeit richtig (11.30 Uhr / halb zwölf)"),
          kr("Erwachsene zahlen 14 Pfund – für die Fahrt hin und zurück", 1, "Preis sinngemäß; Pfund, nicht Euro; „hin und zurück“ darf fehlen")
        ], "Der nächste Zug fährt um halb zwölf. Erwachsene zahlen 14 Pfund für die Fahrt hin und zurück.", ["11.30|11:30|halb zwölf|halb zwoelf|elf uhr dreißig|elf uhr dreissig", "14|vierzehn"],
        { vorgabe: "🚂 Assistant: “The next train leaves at 11.30. Adults pay £14 – that's for the trip there and back.”" }),
        a("Frau Keller answers and asks something. Tell the assistant in English.", [
          kr("ihr kleiner Hund ist dabei – fragt, ob er mitfahren darf (zählt auch mit I/my statt she/her)", 1, "She has got a small dog with her. Can the dog come on the train too?" + B_ICH),
          kr("fragt, wann sie wieder zurück sind (zählt auch mit I/my statt she/her)", 1, "When are they back? / When does the train come back?" + B_ICH)
        ], "She has got a small dog with her. Can the dog come on the train too? And when are they back here?", ["dog", "when|time", "back|return"],
        { vorgabe: "🧳 Frau Keller: „Gut. Unser kleiner Hund ist auch dabei – darf er mitfahren? Und wann sind wir wieder zurück?“", hilfe: B_UEBER }),
        a("The assistant answers. Tell Frau Keller in German what he says.", [
          kr("kleine Hunde fahren kostenlos mit, und der Zug ist um 13.30 Uhr wieder zurück", 1, "beide Angaben sinngemäß (13.30 Uhr / halb zwei am Nachmittag)"),
          kr("zusammen 28 Pfund (zwei Erwachsene)", 1, "der Betrag 28 Pfund genügt")
        ], "Kleine Hunde dürfen kostenlos mitfahren. Der Zug ist um halb zwei wieder hier. Für zwei Erwachsene macht das zusammen 28 Pfund.", ["hund", "kostenlos|umsonst|gratis|nichts|frei", "13.30|13:30|halb zwei|1.30", "28|achtundzwanzig"],
        { vorgabe: "🚂 Assistant: “Small dogs can come with you for free. The train is back here at 1.30 p.m. So that's two adults – £28, please.”" }),
        a("Frau Keller says what she wants. Tell the assistant in English.", [
          kr("nimmt die zwei Karten (zählt auch mit I/my statt she/her)", 1, "She would like / She takes the two tickets." + B_ICH),
          kr("fragt, wo man vor der Fahrt einen Kaffee trinken kann (zählt auch mit I/my statt she/her)", 1, "Where can they have / drink / get a coffee before the trip? – coffee falsch geschrieben zählt" + B_ICH)
        ], "She would like the two tickets. Where can they have a coffee before the trip?", ["two|2|ticket", "coffee|cofee|kaffee|kafee|café|cafe"],
        { vorgabe: "🧳 Frau Keller: „Prima, dann nehmen wir die zwei Karten. Wo können wir vor der Fahrt noch einen Kaffee trinken?“", hilfe: B_UEBER })
      ]),
      ...teil("E Writing", [
        s("My school day: Elodie's class at Hollybrook School is doing a project with your class. Their teacher, Mr Ashworth, asks: What is a school day like in Germany? Write an e-mail to Elodie (" + umfang + "). Write about: your school – its name, where it is and how big it is · your morning: when you get up, how you get to school and how long it takes · your favourite subject or club and why you like it · something you did at school last week · a question for Elodie about her school.", [
          kr("Inhalt", 5, "alle fünf Punkte des Auftrags – je Punkt 1: die eigene Schule (Name und Lage oder Größe) · der Morgen (Aufstehen, Schulweg, wie lange er dauert) · Lieblingsfach oder AG mit Grund (because …) · etwas, das letzte Woche in der Schule war (Last week we … / There was …) · eine Frage an Elodie zu ihrer Schule (die Form der Frage bewertet die Zeile Grammatik)"),
          kr("Textsorte und Aufbau", 2, "E-Mail an Elodie: Anrede (Hi Elodie / Dear Elodie), sinnvolle Reihenfolge, Schluss (Write soon! / Bye for now) und Name; Sätze verbunden (and, but, because)"),
          kr("Grammatik", 3, "simple present für den Schulalltag (I get up, I catch the bus, school starts – he/she/it mit s, don't/doesn't + Grundform), simple past für letzte Woche (we went, there was, we didn't …), Frage mit do/does + Grundform; Fehler stören das Verstehen kaum"),
          kr("Wortschatz", 2, "passende Wörter der Unit für den Schultag (to catch the bus, it takes … minutes, a.m., p.m., lessons start, subject, club, drama, to design, canteen, healthy, uniform …), nicht nur nice und good"),
          kr("Rechtschreibung", 2, "häufige Wörter und die Wörter der Unit sind meist richtig geschrieben", { rs: true })
        ], { minWoerter: zug === "M" ? 50 : 40, plan: [
          { id: "start", label: "Start", hilfe: "Hi Elodie, my name is … I'm … years old." },
          { id: "school", label: "My school – name, where, how big?", hilfe: "I go to the … school in … It's a small / big school with about … students." },
          { id: "morning", label: "My morning", hilfe: "I get up at … I catch the bus at … a.m. / I walk. It takes about … minutes." },
          { id: "favourite", label: "My favourite subject or club – why?", hilfe: "My favourite subject is … because … / On Mondays I go to the … club." },
          { id: "lastweek", label: "Last week at school", hilfe: "Last week we went to … / we had a test in … / there was …" },
          { id: "question", label: "A question for Elodie", hilfe: "Do you … ? / Does your school … ?" },
          { id: "end", label: "End", hilfe: "Write soon! / Bye for now, …" }
        ] })
      ])
    ]
  });
}

Object.assign(module.exports, { p1rb: fassungB("R"), p1mb: fassungB("M") });
