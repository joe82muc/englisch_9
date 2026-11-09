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
  "Hi, I'm Priya, and I'm twelve years old. Last summer my family moved from Little Hatton, a small village in the east of England, to Kingsmoor. Kingsmoor is a big city in the north. Now I go to Hollins Park School.",
  "Every morning I get up at a quarter to seven. I catch the bus at twenty past seven, and it takes about forty minutes to get to school. My brother Dev doesn't take the bus. His school is only five minutes away, so he walks.",
  "Lessons start at half past eight. My favourite subject is Science because our teacher, Mr Okafor, does a lot of experiments with us. I don't like PE very much. On Thursdays after school I go to the robot club. Last week we built a small robot that can carry a cup of water!",
  "At lunchtime most students eat in the canteen. The food is OK, but it's quite expensive: a hot meal costs £3.20. So I usually bring sandwiches from home.",
  "Do I miss my village? Sometimes. In Little Hatton everybody knew me, and it was always quiet. Kingsmoor is noisy, and there's a lot of traffic. But there are two cinemas, a big library and lots of shops. And at school I found a new friend, Chloe. Her bike is red and mine is blue, and every Saturday we ride to the library together."
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
        c("What kind of text is this?", ["a blog post", "a newspaper article", "a letter to a teacher"], 0, { text: "t1" }),
        c("Why doesn't Dev take the bus?", ["His school is very near.", "He doesn't like buses.", "The bus is too expensive."], 0, { text: "t1" }),
        c("What did the robot club do last week?", ["They built a small robot.", "They visited a robot exhibition.", "They watched a film about robots."], 0, { text: "t1" }),
        z("In which line(s) does Priya say why she likes Science?", "t1", [[9, 11]], { hinweis: "Suche das Schlüsselwort aus der Frage (Science) im Text und lies dort genau." }),
        z("In which line(s) does Priya say what is good about Kingsmoor?", "t1", [[19, 20]], { hinweis: "Suche im letzten Absatz das Wort „But“: Danach kommt das Gute an Kingsmoor." }),
        f("Complete the notes about Priya. Write one word or a number.", [
          feld("Priya gets up at a quarter to …", ["seven", "7"]),
          feld("The bus ride to school takes about … minutes.", ["forty", "40"]),
          feld("A hot meal in the canteen costs £ …", ["3.20", "3,20", "3.2", "three twenty", "three pounds twenty"]),
          feld("Priya's new friend:", ["Chloe"])
        ], { text: "t1", tolerant: true }),
        a("Is life in Kingsmoor better or worse for Priya? Give one thing that is better and one thing that is worse than in Little Hatton. Answer in English.", [
          kr("eine Sache, die in Kingsmoor besser ist", 1, "zum Beispiel: There are two cinemas / a big library / lots of shops. / She has a new friend (Chloe). / the robot club"),
          kr("eine Sache, die in Kingsmoor schlechter ist", 1, "zum Beispiel: It is noisy. / There is a lot of traffic. / Not everybody knows her (in Little Hatton everybody knew her). / The bus ride is long."),
          kr("verständlich auf Englisch (eigene Worte oder passende Wörter aus dem Text; Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
        ], "Better: In Kingsmoor there are two cinemas and a big library. Worse: Kingsmoor is noisy, and there is a lot of traffic.", ["cinema|library|shop|friend|chloe|club", "noisy|traffic|loud|quiet|knew|know"], { text: "t1", zeilen: [17, 22] })
      ]),
      ...teil("C Grammar and vocabulary", [
        f("A class trip: Complete the sentences with the simple past of the verbs in brackets.", [
          feld("Last Saturday our class (take) … a train to the city.", ["took"]),
          feld("First we (visit) … an old castle.", ["visited"]),
          feld("Our teacher (buy) … tickets for a boat tour.", ["bought"]),
          feld("The weather (be) … great.", ["was"]),
          feld("Two boys (not / listen) … to the guide.", ["did not listen", "didn't listen", "didn’t listen"]),
          feld("(you / like) … the trip? – Yes, I did.", ["did you like"])
        ], { hinweis: "Wiederhole die unregelmäßigen Verben (take – took, buy – bought) und die Verneinung und Frage mit did + Grundform." }),
        f("Complete the sentences with the simple present of the verbs in brackets.", [
          feld("My cousin (live) … on a farm near the coast.", ["lives"]),
          feld("She (get up) … at six o'clock every day.", ["gets up"]),
          feld("Her parents (not / have) … a car.", ["do not have", "don't have", "don’t have"]),
          feld("The bus (not / stop) … in her village.", ["does not stop", "doesn't stop", "doesn’t stop"])
        ], { hinweis: "he, she, it – das s muss mit! Verneinung: don't / doesn't + Grundform." }),
        f("Complete the questions and the short answers.", [
          feld("(your school / have) … a drama club? – Yes, it does.", ["does your school have"]),
          feld("(you / walk) … to school? – No, I don't. I take the bus.", ["do you walk"]),
          feld("Does your sister like football? – Yes, …", ["she does", "yes, she does", "yes she does"]),
          feld("Do your friends live in the city centre? – No, …", ["they don't", "they do not", "no, they don't", "no they don't", "no, they do not"])
        ], { hinweis: "Fragen mit do / does + Grundform. Kurzantwort: Yes, she does. / No, they don't." }),
        f("Complete the sentences with mine, yours, his, hers, ours or theirs.", [
          feld("Is this your pencil case, Ben? – Yes, it's … . Thank you!", ["mine"]),
          feld("Amy has got a green bike. The green bike is … .", ["hers"]),
          feld("This isn't my umbrella. Is it … , Mrs Lee?", ["yours"]),
          feld("My brother and I have got a dog. The black dog is … .", ["ours"])
        ], { hinweis: "mine (meins), yours (deins, Ihres), his (seins), hers (ihres), ours (unseres), theirs (ihres – von ihnen)." }),
        m("Match the words with their meanings.", [["a factory", "a building where people make things"], ["noisy", "with a lot of loud sounds"], ["the coast", "the land next to the sea"], ["healthy", "good for your body"]])
      ]),
      ...teil("D Mediation", [
        a(LAGE + " Herr Brunner says something to you. Tell the assistant in English.", [
          kr("möchte Karten für die Burg – für sich und seine zwei Kinder (drei Personen)", 1, "He would like tickets for the castle for himself and his two children. – drei Karten genügt auch" + ICH),
          kr("fragt nach dem Preis", 1, "How much are the tickets? / He wants to know the price." + ICH)
        ], "He would like tickets for the castle for himself and his two children. How much are the tickets?", ["ticket", "two|2|three|3|children|kids", "how much|price|cost"],
        { vorgabe: "🧳 Herr Brunner: „Guten Tag! Ich möchte Karten für die Burg – für mich und meine zwei Kinder. Was kosten die Karten?“", hilfe: UEBER }),
        a("The assistant answers. Tell Herr Brunner in German what she says.", [
          kr("Erwachsene zahlen 12 Pfund, Kinder von 5 bis 15 Jahren zahlen den halben Preis", 1, "beide Angaben sinngemäß; Pfund, nicht Euro"),
          kr("sie fragt, wie alt die Kinder sind", 1)
        ], "Erwachsene zahlen 12 Pfund. Kinder von 5 bis 15 zahlen den halben Preis. Sie fragt, wie alt Ihre Kinder sind.", ["12|zwölf|zwoelf", "halb|haelfte|hälfte|6|sechs", "alt|alter"],
        { vorgabe: "🏰 Assistant: “Adults pay £12. How old are the children? Children from 5 to 15 pay half price.”" }),
        a("Herr Brunner answers and asks something. Tell the assistant in English.", [
          kr("Alter der Kinder: Tochter 10, Sohn 16", 1, "His daughter is ten and his son is sixteen. – beide Zahlen richtig" + ICH),
          kr("fragt nach einer Führung auf Deutsch", 1, "Is there a (guided) tour in German? / He asks for a tour in German." + ICH)
        ], "His daughter is ten, and his son is sixteen. He asks: Is there a guided tour in German?", ["ten|10", "sixteen|16", "tour|guide", "german"],
        { vorgabe: "🧳 Herr Brunner: „Meine Tochter ist zehn, mein Sohn ist sechzehn. Gibt es auch eine Führung auf Deutsch?“", hilfe: UEBER }),
        a("The assistant answers. Tell Herr Brunner in German what she says.", [
          kr("keine Führung auf Deutsch, aber ein Audioguide auf Deutsch für 2 Pfund", 1, "beide Angaben sinngemäß"),
          kr("zusammen 30 Pfund (zwei Erwachsene und ein Kind – der Sohn zahlt wie ein Erwachsener)", 1, "der Betrag 30 Pfund genügt")
        ], "Leider gibt es keine Führung auf Deutsch, aber einen Audioguide auf Deutsch für 2 Pfund. Zwei Erwachsene und ein Kind kosten zusammen 30 Pfund.", ["keine|nicht|leider", "audio|guide|gerät|geraet", "2|zwei", "30|dreißig|dreissig"],
        { vorgabe: "🏰 Assistant: “I'm afraid there's no tour in German. But we have audio guides in German for £2. Two adults and one child – that's £30, please.”" }),
        a("Herr Brunner decides. Tell the assistant in English.", [
          kr("nimmt die drei Karten und einen Audioguide", 1, "He would like the three tickets and one audio guide." + ICH),
          kr("fragt, ob er mit Karte zahlen kann", 1, "Can he pay by card?" + ICH)
        ], "He would like the three tickets and one audio guide. Can he pay by card?", ["three|3|ticket", "audio|guide", "card"],
        { vorgabe: "🧳 Herr Brunner: „Gut, dann nehmen wir die drei Karten und einen Audioguide. Kann ich mit Karte bezahlen?“", hilfe: UEBER })
      ]),
      ...teil("E Writing", [
        s("Where I live: Your class is making a website about the places where you live. Write a short text about your village, town or city (" + umfang + "). Write about: the name of the place, what kind of place it is and where it is · how many people live there · what it was like in the past · your favourite place there and what you can do there · what you like or don't like about the place and why.", [
          kr("Inhalt", 5, "alle fünf Punkte des Auftrags – je Punkt 1: Name, Art des Ortes (village, town, city) und Lage · Einwohnerzahl oder Größe · wie es früher war (there was / there were …) · Lieblingsort und was man dort tun kann · was gefällt oder nicht gefällt, mit Grund (because …)"),
          kr("Textsorte und Aufbau", 2, "kurzer Text für die Website der Klasse: Einstieg (Hi, I'm … / I live in …), sinnvolle Reihenfolge, ein Schlusssatz; Sätze verbunden (and, but, because)"),
          kr("Grammatik", 3, "simple present für heute (I live, it has, people work – he/she/it mit s), simple past für früher (there was, there were, people worked); Fehler stören das Verstehen kaum"),
          kr("Wortschatz", 2, "passende Wörter der Unit für Orte (village, town, city, in the north / south of …, near, coast, quiet, noisy, traffic, factory …), nicht nur nice und good"),
          kr("Rechtschreibung", 2, "häufige Wörter und die Wörter der Unit sind meist richtig geschrieben", { rs: true })
        ], { minWoerter: zug === "M" ? 50 : 40, plan: [
          { id: "start", label: "Start", hilfe: "Hi, I'm … I live in …" },
          { id: "place", label: "What kind of place? Where is it?", hilfe: "It's a small town in the south of Bavaria, near …" },
          { id: "people", label: "How many people live there?", hilfe: "About … people live there." },
          { id: "past", label: "In the past …", hilfe: "In the past there was … / there were …" },
          { id: "favourite", label: "My favourite place – what can you do there?", hilfe: "My favourite place is … You can …" },
          { id: "opinion", label: "What do you like or not like? Why?", hilfe: "I like … because … / I don't like …" },
          { id: "end", label: "End", hilfe: "Come and visit …! / Thanks for reading." }
        ] })
      ])
    ]
  });
}

const p1r = fassung("R"), p1m = fassung("M");
module.exports = { p1r, p1m };
