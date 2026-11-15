"use strict";

/**
 * Englisch 7 · Probe 4: Unit 4 – USA – here we come! (Auftrag vom 14.11.2026: „2 große Proben je Unit – A + Nachschreiber
 * B, Aufbau wie Probe 1 … online + Word/PDF“, „M und R getrennt – eigene, leichtere R-Fassungen der Module und Proben“,
 * „die ki soll mit einheitlicher temperatur die probe auswerten“; Aufbau wie Probe 3, Sprachmittlung wie Probe 2).
 *
 * Teile: A Listening (12) · B Reading (12) · C Grammar and vocabulary (22) · D Mediation (10) · E Writing (14) = 70 Punkte,
 * 90 Minuten – wie Probe 1 bis 3. Jeder Zug hat eine eigene Fassung (vier Kennungen):
 *   e7-p4-m-a, e7-p4-r-a (Variante A) und e7-p4-m-b, e7-p4-r-b (Variante B = Nachschreiber, eigene Texte und Situationen).
 * 7M und 7R derselben Variante hören denselben Hörtext (eine Aufnahme je Variante) und haben dieselbe Situation in jedem Teil.
 * 7R ist leichter: Hören nur mit Auswahl und Reihenfolge (M: Notizen), kürzerer und einfacherer Lesetext (R etwa 170, M etwa
 * 260 Wörter), im Grammatikteil mehr Auswahl und Zuordnen (much/many aus einem Wortkasten, Steigerung und too much/too many
 * ankreuzen, How much/How many zuordnen, Wörter zuordnen; M bildet die Formen selbst), Sprachmittlung mit mehr Lenkung (je
 * deutsche Frage ein eigenes Feld mit deutschem Satzanfang; M fasst in 4 bis 6 Sätzen zusammen), Schreiben 40–70 Wörter mit
 * Satzanfängen im Plan (M 60–100 Wörter). Die Note folgt dem Zug der Fassung: M 50 % = Note 4, R 50 % = Note 3.
 * A und B haben je Teil dieselben Aufgabenarten und Punkte (gleicher Anteil offener Aufgaben).
 *
 * Grammatik der Unit: G10 Steigerung mit more/the most und less/the least (dazu als Wiederholung -er/-est und
 * good/better/best, bad/worse/worst), G11 much/many, How much/How many, too much/too many, so much/so many.
 * Wortschatz: Wortliste Unit 4 (GRUMI-Vokabeltrainer Unit 4) verstärkt – state, huge, national park, vacation (AE), movie (AE),
 * favorite (AE), center (AE), football (AE), social media, to share, to post, video, tablet, newspaper, useful, the most
 * important, the least difficult, less, camp, leader, deep, dollar, Ordnungszahlen (twenty-eighth, thirty-second, fortieth,
 * fiftieth, hundredth …), baseball, playing field, coach, to join, to motivate, holiday, independence, flag, fireworks,
 * Thanksgiving, to celebrate, barbecue, party, costume, dinner, festival, subject.
 *
 * Abgleich mit Blue Line 3 (Klett, Bayern M-Zug, Unit 4, S. 74–93 – nur Aufbau, Themen und Aufgabenformen, Analyse in
 * progress/englisch7/BUCH-UNIT4.md): Mediennutzung und soziale Medien vergleichen (Topic 1, G10), Ferienlager mit Mengen
 * (Topic 2, G11, Ordnungszahlen), Sport an einer US-Schule (Text), Feiertage in den USA (More about), britisches und
 * amerikanisches Englisch, E-Mail an eine neue Brieffreundin (Writing skills). Sprachmittlung wie im Buch Englisch → Deutsch:
 * ein englisches Infoblatt für die Familie auf Deutsch erklären (R: deutsche Fragen in eigenen Feldern, M: zusammenfassen),
 * dazu eine kurze englische Nachricht bzw. ein Schild, das das Kind auf Deutsch weitergibt.
 * Nichts übernommen: keine Buchtexte, -namen oder -motive (keine gewonnene Rundreise, kein Reservat-Blog, keine Rafting-Flucht
 * und kein Traum, keine Camp-Webseite mit Holzhütten und Elternfragen, kein Anmeldeformular, kein Football-Training in LA,
 * keine Umfrage im Einkaufszentrum, keine Präsidenten, keine Homophon-Sätze, keine Seite mit genau den vier Buch-Sportarten).
 *
 * Variante A: Telefonat Brooke (Mädchen) und Ethan (Junge) – Ethans erstes Ferienlager „Camp Timber Ridge“: Beginn, Bus,
 *   Packliste, kein Handy, Taschengeld, Aktivitäten (Hören, USA) · Bericht von Kendall in der Schülerzeitung der Cedarbrook
 *   Middle School über eine Woche ohne Handy (Lehrer Mr Whitfield, Darnell, Marisol; Lesen) · Infoblatt „Fourth of July in
 *   Millbrook“ für die Mutter auf Deutsch, dazu eine Nachricht der Vermieterin Mrs Kowalski; kleiner Bruder Linus
 *   (Sprachmittlung) · E-Mail an die neue E-Mail-Freundin Savannah aus Oregon über sich, die Schule, die Freizeit und das Handy
 *   (Schreiben).
 * Variante B: Telefonat Paige (Mädchen) und Marcus (Junge) – Paiges Urlaub in Montana mit Zelt, Berg, Bär und ohne Internet,
 *   Marcus im Baseballteam der Schule (Hören, USA) · Blog der bayerischen Austauschschülerin Clara (aus der Nähe von Passau)
 *   an der Pinecrest Middle School in Wisconsin: Sport an einer US-Schule, Fußballteam, Trainerin Ms Sullivan, Gastfamilie
 *   Garcia, Gastschwester Jasmine (Lesen) · Infoblatt des Herbstfests der „Hollow Creek Farm“ für den Vater auf Deutsch,
 *   dazu ein Schild am Eingang; kleine Schwester Ronja (Sprachmittlung) · E-Mail an den E-Mail-Freund Hunter über einen
 *   besonderen Tag in Bayern, verglichen mit Thanksgiving (Schreiben).
 * Alle Texte, Personen und Orte sind eigenständig für GRUMI erstellt und erfunden (Brooke, Ethan, Camp Timber Ridge, Kendall,
 * Cedarbrook Middle School, Mr Whitfield, Darnell, Marisol, Millbrook, Mrs Kowalski, Linus, Savannah, Paige, Marcus, Clara,
 * Pinecrest Middle School, Ms Sullivan, Garcia, Jasmine, Hollow Creek Farm, Ronja, Hunter; Oregon, Montana, Wisconsin und
 * Passau als echte Orte; in den Grammatiksätzen Trevor, Gianna, Dominic) – geprüft mit englisch7-werkzeug/namen-frei.js:
 * sie stehen weder im Schulbuch noch in einem Lernmodul (MODULE.md, „Vergebene Namen“) noch in Probe 1 bis 3.
 * Landeskunde nur mit sicheren Fakten: Unabhängigkeitstag am 4. Juli mit Umzügen, Feuerwerk und Rot-Weiß-Blau, Thanksgiving am
 * vierten Donnerstag im November, Herbstfeste auf Farmen mit Kürbissen, Schulsportteams, soccer = Fußball, Dollar.
 * LehrplanPLUS E7: Hörverstehen, Leseverstehen, Sprachmittlung (Informationen aus einem englischen Infoblatt adressatengerecht
 * auf Deutsch weitergeben), Schreiben (persönliche E-Mail an eine neue Brieffreundin bzw. einen Freund), Wortschatz und
 * Grammatik der Unit.
 * Den Hörtext spielt die Lehrkraft in der Verwaltung zweimal für alle ab (Aufnahme in audio/: e7-p4-<r|m>-<a|b>-h1.mp3 –
 * R und M derselben Variante sind dieselbe Aufnahme). Bleibt auf dem Server (Lösungen und Erwartungshorizont). Bausteine: bau.js.
 */
const { c, m, o, f, feld, z, a, kr, s, text, hoertext, teil, probe7 } = require("./bau");

const HINWEIS = "Work on your own. Part A: your teacher plays the recording twice – read the tasks first. Read every task carefully. Arbeite allein. Den Hörtext spielt deine Lehrkraft zweimal für alle ab – lies vorher die Aufgaben. Du hast etwa 90 Minuten Zeit. Reinkopieren ist verboten und wird protokolliert. Nach der Abgabe kannst du nichts mehr ändern.";
const TITEL = (zug) => "Test 4 (" + zug + "7): USA – here we come!";
const SCOPE = "Unit 4 · Listening, Reading, Grammar and vocabulary, Mediation, Writing";
// Sprachmittlung Englisch → Deutsch (wie Probe 2): Die Person versteht kein Englisch – es zählt, ob die Information auf Deutsch ankommt
const SM = "Sprachmittlung: verständliches Deutsch für die genannte Person, sinngemäß und nicht Wort für Wort; Unwichtiges darf fehlen";
const WEITER = " – auf Deutsch und sinngemäß, nicht Wort für Wort; Fehler, die das Verstehen nicht stören, kosten nichts.";
// Hinweise der Grammatikaufgaben (beide Varianten)
const H_STEIG = "Steigerung: kurze Adjektive mit -er / the -est (cheap – cheaper – the cheapest), lange mit more / the most (useful – more useful – the most useful); weniger: less / the least. Unregelmäßig: good – better – the best, bad – worse – the worst. Vergleich mit than, höchste Stufe mit the.";
const H_MUCH = "many bei zählbaren Nomen in der Mehrzahl (many friends · How many photos?) · much bei nicht zählbaren Nomen (much time · How much money?).";
const H_TOO = "too much / too many = zu viel / zu viele (das ist schlecht) · so much / so many = so viel / so viele · much bei nicht zählbaren, many bei zählbaren Nomen.";
const H_HOW = "How many …? fragt nach einer Anzahl (Wie viele?), How much …? nach einer Menge oder einem Preis (Wie viel?).";
const H_WORT = "Wörter der Unit 4: Medien, Camp, Sport, Feiertage, britisches und amerikanisches Englisch, Ordnungszahlen (fourth, hundredth …).";

/* ====================================================== Variante A ====================================================== */

const A_HOEREN = hoertext("h1", "Ready for camp?", "Listening: two friends on the phone", [
  ["Ethan", "Hi Brooke, it's Ethan. Do you have a minute? I need your help."],
  ["Brooke", "Sure, Ethan. What's up?"],
  ["Ethan", "I'm going to Camp Timber Ridge this summer. You've been there, right?"],
  ["Brooke", "Yes, twice! It's the most exciting camp in the state."],
  ["Ethan", "Really? It's my first summer camp, and I'm a bit nervous. When does it start?"],
  ["Brooke", "On Sunday, the twenty-eighth of June. The bus leaves from our school at eight o'clock, and the ride takes about three hours."],
  ["Ethan", "What do I need to pack?"],
  ["Brooke", "A sleeping bag and a warm jacket – the nights in the mountains are cold. But don't take too many T-shirts. You can wash your clothes at camp."],
  ["Ethan", "Can I take my phone?"],
  ["Brooke", "No, phones aren't allowed. But you can call home on Wednesdays."],
  ["Ethan", "Two weeks without my phone? Wow. How much money do I need?"],
  ["Brooke", "Not much. Twenty dollars for the camp shop is enough."],
  ["Ethan", "And what's the best activity?"],
  ["Brooke", "Canoeing on the lake, I think. The climbing wall is more difficult, but it's fun too. And on the last night there's a big campfire with a talent show."],
  ["Ethan", "A talent show? But I can't sing!"],
  ["Brooke", "You don't have to sing. Last year a boy told jokes, and he was the funniest of all."],
  ["Ethan", "Great. Thanks, Brooke. I'm less nervous now!"],
  ["Brooke", "You're going to love it!"]
], { stimmen: { Brooke: "en-US-JennyNeural", Ethan: "en-US-GuyNeural" }, mal: 2 });

const A_LESEN = {
  M: text("t1", "Seven days without a phone", "School magazine", [
    "Last month our class at Cedarbrook Middle School tried something new: one week without phones, tablets and social media. It was the idea of our teacher, Mr Whitfield. He thinks that we spend more time with our phones than with real people. Most of us thought it was the worst idea ever.",
    "Before the week, we did a survey. Twenty-two of the twenty-five students in our class have got their own phone. Most of them use it for more than three hours a day – they chat with friends, watch videos and post photos. For many of us, the phone was the most important thing in our lives.",
    "The first two days were really hard. On Monday I wanted to check my phone all the time. My best friend Darnell said that Tuesday was the most boring day of his life. But then things changed. We played more games outside, and in the evenings we talked more with our families. I read two books – more than in the whole month before!",
    "Not everything was easy. Marisol couldn't share her photos with her cousins in another state, and some parents weren't happy because they couldn't call their kids after school.",
    "After the week, we did the survey again. Most students said that they felt less tired, and many of them slept better. Now a lot of us leave our phones in our bags at dinner. Is a phone less important than friends? I think so. But I'm still happy that I've got mine back!",
    "Kendall, Grade 7"
  ]),
  R: text("t1", "Seven days without a phone", "School magazine", [
    "Last month our class at Cedarbrook Middle School tried something new: one week without phones and social media. It was the idea of our teacher, Mr Whitfield. He thinks that we spend too much time online. Most of us didn't like the idea at all.",
    "There are twenty-five students in our class, and twenty-two of them have got a phone. Many of them use it for three hours a day or more. They chat with friends and watch videos.",
    "The first two days were really hard. On Monday I wanted to check my phone all the time. My best friend Darnell said that Tuesday was the most boring day of his life! But then we played more games outside, and we talked more with our families. I read two books.",
    "After the week, most students felt less tired. Now many of us leave our phones in our bags at dinner. I think that friends are more important than phones. But I'm happy that I've got my phone back!",
    "Kendall, Grade 7"
  ])
};

const A_INFO = "FOURTH OF JULY IN MILLBROOK\nFun for the whole family – come and celebrate with us!\n8 to 10 a.m. – Pancake breakfast at the fire station: adults $6 · kids (4 to 14) $3 · kids under 4 free\n10:30 a.m. – Parade through the town center with the high school band, old cars and lots of flags\n11:30 a.m. – Kids' bike parade: decorate your bike in red, white and blue! For kids from 5 to 10. You must wear a helmet.\n1 to 5 p.m. – Games, music and swimming at the town beach · 3 p.m.: watermelon-eating contest\n9:30 p.m. – Fireworks over the lake – free for everybody! Bring a blanket and come early.\nPlease note: No dogs at the fireworks – the noise scares them. No glass bottles on the beach.\nRain? Then the fireworks are on July 5 at 9:30 p.m.";
const A_NACHRICHT = "📱 Text message from Mrs Kowalski (she owns your vacation house): “Hi! The pancake breakfast is really popular – go there before nine, or the pancakes are gone. And you can borrow our big blanket for the fireworks. It's in the garage. Have fun!”";

function fassungA(zug) {
  const R = zug === "R";
  return probe7(4, zug, "A", {
    title: TITEL(zug), kurz: "Unit 4", scope: SCOPE, minutes: 90, hinweis: HINWEIS,
    texte: [A_HOEREN, A_LESEN[zug]],
    items: [
      ...teil("A Listening", R ? [
        c("Where is Ethan going this summer?", ["to a summer camp", "to his grandparents", "to a soccer camp by the sea"], 0, { text: "h1" }),
        c("How often has Brooke been to the camp?", ["twice", "once", "three times"], 0, { text: "h1" }),
        c("How does Ethan feel about the camp?", ["a bit nervous", "bored", "angry"], 0, { text: "h1" }),
        c("When does the bus leave?", ["at eight o'clock", "at nine o'clock", "at three o'clock"], 0, { text: "h1" }),
        c("Why does Ethan need a warm jacket?", ["The nights in the mountains are cold.", "It's going to snow.", "The bus is very cold."], 0, { text: "h1" }),
        c("Can Ethan take his phone to camp?", ["No, phones aren't allowed.", "Yes, but only on Sundays.", "Yes, for one hour a day."], 0, { text: "h1" }),
        c("How much money does Ethan need for the camp shop?", ["twenty dollars", "ten dollars", "fifty dollars"], 0, { text: "h1" }),
        c("Which activity does Brooke like best?", ["canoeing on the lake", "the climbing wall", "riding a horse"], 0, { text: "h1" }),
        c("What happens on the last night?", ["There's a big campfire with a talent show.", "There's a party in the dining hall.", "There's a movie night."], 0, { text: "h1" }),
        o("What do Brooke and Ethan talk about? Put the topics in the right order.", ["Brooke says when the camp starts.", "Brooke says what Ethan should pack.", "Brooke talks about her favourite activity."], { text: "h1" })
      ] : [
        c("Why does Ethan call Brooke?", ["He needs her help before camp.", "He wants to borrow her sleeping bag.", "He wants to invite her to a party."], 0, { text: "h1" }),
        c("Why shouldn't Ethan take too many T-shirts?", ["He can wash his clothes at camp.", "There isn't much room on the bus.", "It's going to be very hot."], 0, { text: "h1" }),
        c("What does Brooke say about the climbing wall?", ["It's more difficult than canoeing, but fun.", "It's the easiest activity at camp.", "It's closed this summer."], 0, { text: "h1" }),
        c("How does Ethan feel at the end of the call?", ["less nervous than before", "more nervous than before", "angry with Brooke"], 0, { text: "h1" }),
        f("Listen again and complete the notes. Write one word or a number.", [
          feld("Camp starts on Sunday, the … of June.", ["twenty-eighth", "28th", "28", "twenty eighth", "the twenty-eighth", "the 28th"]),
          feld("The bus ride takes about … hours.", ["three", "3"]),
          feld("Ethan can call home on …", ["Wednesdays", "Wednesday", "Wednesday evening", "Wednesdays only"]),
          feld("Money for the camp shop: … dollars", ["twenty", "20", "$20", "20 dollars", "twenty dollars"]),
          feld("On the last night: a big campfire and a … show", ["talent"])
        ], { text: "h1", tolerant: true, hinweis: "Lies vor dem Hören die Notizen: Dann weißt du, auf welche Zahl oder welches Wort du achten musst." }),
        o("What do Brooke and Ethan talk about? Put the topics in the right order.", ["Brooke says when the camp starts.", "Brooke says what Ethan should pack.", "Brooke talks about her favourite activity."], { text: "h1" })
      ]),
      ...teil("B Reading", R ? [
        c("Whose idea was the week without phones?", ["their teacher's idea", "the students' idea", "the parents' idea"], 0, { text: "t1" }),
        c("What did most students think about the idea at first?", ["They didn't like it.", "They loved it.", "They didn't understand it."], 0, { text: "t1" }),
        c("How were the first two days?", ["really hard", "great fun", "very easy"], 0, { text: "t1" }),
        c("What did the students do more during the week?", ["They played games outside.", "They watched TV.", "They did their homework."], 0, { text: "t1" }),
        c("How did most students feel after the week?", ["less tired", "more tired", "angry"], 0, { text: "t1" }),
        z("In which line(s) does Kendall say what Darnell thought about Tuesday?", "t1", [[11, 12]], { hinweis: "Suche den Namen „Darnell“ im Text und lies dort genau." }),
        z("In which line(s) does Kendall say what many students do at dinner now?", "t1", [[15, 16]], { hinweis: "Suche das Wort „dinner“ im Text." }),
        f("Complete the notes about Kendall's class. Write one word or a number.", [
          feld("There are … students in Kendall's class.", ["twenty-five", "25", "twenty five"]),
          feld("During the week Kendall read … books.", ["two", "2"]),
          feld("Mr Whitfield thinks the students spend too much time …", ["online", "on the internet", "on their phones"])
        ], { text: "t1", tolerant: true }),
        a("What was good about the week without phones? Give one thing from the text. Answer in English.", [
          kr("eine gute Sache aus dem Text", 1, "zum Beispiel: They played more games outside. / They talked more with their families. / Kendall read two books. / Most students felt less tired. / Many students leave their phones in their bags at dinner now. – Dass die ersten Tage schwer waren, ist keine gute Sache."),
          kr("verständlich auf Englisch (Stichworte und Wörter aus dem Text genügen; Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
        ], "They played more games outside and talked more with their families.", ["game|outside|talk|famil|read|book|tired|dinner"], { text: "t1", zeilen: [1, 19] })
      ] : [
        c("Why did Mr Whitfield want a week without phones?", ["He thinks the students spend more time with phones than with people.", "The students' phones were too expensive.", "He wanted to test a new app."], 0, { text: "t1" }),
        c("Why was the week hard for Marisol?", ["She couldn't share her photos with her cousins.", "She lost her phone on Monday.", "Her parents called her all the time."], 0, { text: "t1" }),
        c("What does Kendall think now?", ["A phone is less important than friends.", "Phones should never be allowed at school.", "The week without phones was a bad idea."], 0, { text: "t1" }),
        z("In which line(s) does Kendall say what the students did more during the week?", "t1", [[14, 15]], { hinweis: "Suche die Stelle, an der sich etwas ändert (But then things changed), und lies dort genau." }),
        z("In which line(s) does Kendall say why some parents weren't happy?", "t1", [[18, 19]], { hinweis: "Suche das Wort „parents“ im Text." }),
        f("Complete the notes about Kendall's class. Write one word or a number.", [
          feld("… of the twenty-five students have got their own phone.", ["twenty-two", "22", "twenty two"]),
          feld("Most of them use their phone for more than … hours a day.", ["three", "3"]),
          feld("Darnell said that Tuesday was the most … day of his life.", ["boring"]),
          feld("During the phone-free week Kendall read … books.", ["two", "2"])
        ], { text: "t1", tolerant: true }),
        a("Name one problem during the week without phones and one good thing about it. Answer in English.", [
          kr("ein Problem in der Woche ohne Handy", 1, "zum Beispiel: The first two days were really hard. / Kendall wanted to check her phone all the time. / Tuesday was the most boring day for Darnell. / Marisol couldn't share her photos with her cousins. / Some parents couldn't call their kids after school."),
          kr("eine gute Sache", 1, "zum Beispiel: They played more games outside. / They talked more with their families. / Kendall read two books. / Most students felt less tired. / Many students slept better. / Now many leave their phones in their bags at dinner."),
          kr("verständlich auf Englisch (eigene Worte oder passende Wörter aus dem Text; Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
        ], "The first two days were really hard, and Marisol couldn't share her photos. But the students played more games outside and talked more with their families.", ["hard|check|boring|share|photo|cousin|parent|call", "game|outside|talk|famil|read|book|tired|slept|sleep|dinner"], { text: "t1", zeilen: [1, 25] })
      ]),
      ...teil("C Grammar and vocabulary", R ? [
        f("Complete the sentences with much or many. Use: much · many", [
          feld("How … T-shirts are you going to take to camp?", ["many"]),
          feld("Hurry up! We haven't got … time.", ["much"]),
          feld("There were so … people at the parade!", ["many"]),
          feld("How … money do you need for the trip?", ["much"]),
          feld("Trevor hasn't got … friends at his new school yet.", ["many"])
        ], { hinweis: H_MUCH }),
        c("Choose the right form: For me, history is … than geography.", ["more interesting", "interestinger", "most interesting"], 0, { hinweis: H_STEIG }),
        c("Choose the right form: This is … app on my phone.", ["the most useful", "the usefullest", "more useful"], 0, { hinweis: H_STEIG }),
        c("Choose the right form: My new tablet was … than my old one – it was only ninety dollars.", ["less expensive", "the least expensive", "more expensive"], 0, { hinweis: H_STEIG }),
        f("Write the right form of the adjective in brackets.", [
          feld("Today is (hot) … than yesterday.", ["hotter"]),
          feld("Gianna is (good) … swimmer in our class.", ["the best"]),
          feld("The second movie was (exciting) … than the first one.", ["more exciting"])
        ], { hinweis: H_STEIG }),
        c("Choose the right words: I can't close my bag. There are … clothes in it.", ["too many", "too much", "so much"], 0, { hinweis: H_TOO }),
        c("Choose the right words: Don't put … salt on your fries!", ["too much", "too many", "how many"], 0, { hinweis: H_TOO }),
        m("Match the questions and the answers.", [["How many brothers have you got?", "Two – and one sister."], ["How much is the ticket?", "Five dollars."], ["How many photos did you post?", "Too many – about fifty!"], ["How much time have we got?", "Not much – ten minutes."]],
          { hinweis: H_HOW }),
        m("What do the words mean in German? Match them.", [["useful", "nützlich"], ["newspaper", "Zeitung"], ["to share", "teilen"], ["vacation", "Urlaub"], ["thirty-second", "zweiunddreißigste"]], { hinweis: H_WORT })
      ] : [
        f("Compare: Write the right form of the adjective in brackets (-er / the -est, more / the most, less / the least).", [
          feld("Our new tablet is (expensive) … than the old one.", ["more expensive"]),
          feld("For me, Saturday is (good) … day of the week.", ["the best"]),
          feld("This is (useful) … app on my phone.", ["the most useful"]),
          feld("The lake is (deep) … than the swimming pool.", ["deeper"]),
          feld("Skateboarding is (less / dangerous) … than climbing.", ["less dangerous"]),
          feld("For me, maths is (least / difficult) … subject at school.", ["the least difficult"])
        ], { hinweis: H_STEIG }),
        f("Complete the sentences with much or many.", [
          feld("How … photos did you take at camp?", ["many"]),
          feld("We didn't have … time at the airport.", ["much"]),
          feld("There weren't … people on the beach.", ["many"]),
          feld("How … is a ticket for the boat?", ["much"])
        ], { hinweis: H_MUCH }),
        f("Complete the sentences with too much, too many, so much or so many.", [
          feld("I can't eat all that – it's … food for me!", ["too much"]),
          feld("Thank you … for the present!", ["so much"]),
          feld("There are … cars in the town center. Let's take our bikes.", ["too many"]),
          feld("I've made … new friends at camp – it's great!", ["so many"])
        ], { hinweis: H_TOO }),
        f("Unit 4 words: Complete the sentences.", [
          feld("You can read the news online or in a …", ["newspaper"]),
          feld("On the Fourth of July many families have a … in the garden – they cook burgers and sausages outside.", ["barbecue", "BBQ", "barbeque"]),
          feld("Our school is 100 years old this year. It's the school's … birthday.", ["hundredth", "100th", "one hundredth"]),
          feld("The camp … is a young woman. She helps the kids and makes the rules.", ["leader"])
        ], { hinweis: H_WORT }),
        m("British English or American English? Match the words.", [["film", "movie"], ["holiday", "vacation"], ["football", "soccer"], ["autumn", "fall"]], { hinweis: "Britisches Englisch links, amerikanisches rechts – Achtung: In den USA ist football ein anderes Spiel." })
      ]),
      ...teil("D Mediation", [
        R ? a("You are on vacation in the USA with your mum and your little brother Linus (7 years old). Your mum doesn't speak English. She asks you questions about this flyer. Answer her questions in German. (Beantworte die Fragen deiner Mutter auf Deutsch – kurze Sätze genügen.)", [
          kr("Frühstück: von 8 bis 10 Uhr bei der Feuerwehr (fire station)", 1, "Zeit und Ort"),
          kr("Frühstück für alle drei: 12 Dollar (Mama 6 Dollar, du und Linus je 3 Dollar)", 2, "2 Punkte: 12 Dollar oder alle drei Preise richtig zusammengezählt · 1 Punkt: die Einzelpreise richtig, aber nicht oder falsch zusammengezählt; Dollar, nicht Euro"),
          kr("Linus darf beim Fahrrad-Umzug mitmachen (Kinder von 5 bis 10), er muss einen Helm tragen", 1, "Ja mit Grund (5 bis 10 Jahre) oder Ja mit Helm"),
          kr("Nachmittag (13 bis 17 Uhr): Spiele, Musik und Schwimmen am Strand, um 15 Uhr ein Wassermelonen-Wettessen", 1, "eines genügt"),
          kr("Feuerwerk um 21.30 Uhr, kostenlos", 1, "Uhrzeit und kostenlos; halb zehn gilt"),
          kr("bei Regen: Feuerwerk am 5. Juli (um 21.30 Uhr)", 1, "das Datum genügt"),
          kr(SM + " (auf Deutsch, verständlich für die Mutter)", 1)
        ], "1. Das Frühstück gibt es von 8 bis 10 Uhr bei der Feuerwehr. 2. Du zahlst 6 Dollar, Linus und ich je 3 Dollar – zusammen 12 Dollar. 3. Ja, er darf mitmachen – es ist für Kinder von 5 bis 10, aber er braucht einen Helm. 4. Am Nachmittag gibt es Spiele, Musik und Schwimmen am Strand. 5. Das Feuerwerk ist um 21.30 Uhr und kostet nichts. 6. Wenn es regnet, ist das Feuerwerk am 5. Juli.",
        ["8|acht|10|zehn|feuerwehr|feuerwache", "12|zwölf|zwoelf", "ja|helm|5|10", "spiel|musik|schwimm|strand|melone", "21.30|21:30|halb zehn|kostenlos|nichts|frei|gratis", "5. juli|fünften|sonntag|nächsten tag|naechsten tag"],
        { vorgabe: A_INFO, teile: [
          { label: "„Wann und wo gibt es das Pfannkuchen-Frühstück?“", hilfe: "Das Frühstück gibt es von … bis … bei …" },
          { label: "„Was kostet das Frühstück für uns drei?“", hilfe: "Du zahlst …, Linus und ich … – zusammen …" },
          { label: "„Darf Linus beim Fahrrad-Umzug mitmachen? Er ist sieben.“", hilfe: "Ja / Nein, …" },
          { label: "„Was können wir am Nachmittag machen?“", hilfe: "Am Nachmittag gibt es …" },
          { label: "„Wann ist das Feuerwerk, und was kostet es?“", hilfe: "Das Feuerwerk ist um … Es kostet …" },
          { label: "„Und was ist, wenn es regnet?“", hilfe: "Wenn es regnet, …" }
        ] })
        : a("You are on vacation in the USA with your mum and your little brother Linus (7 years old). Your mum doesn't speak English. She has found this flyer and wants to know: What can we do on the Fourth of July, and when? · What does the breakfast cost for the three of us? · Can Linus take part in the bike parade? · What happens if it rains? Tell her the important things in German (4 to 6 sentences). Do not translate word for word.", [
          kr("Programm mit Uhrzeit: Frühstück 8 bis 10 Uhr, Umzug 10.30 Uhr, Fahrrad-Umzug 11.30 Uhr, Nachmittag am Strand 13 bis 17 Uhr, Feuerwerk 21.30 Uhr (kostenlos)", 2, "2 Punkte: mindestens drei Programmpunkte mit Uhrzeit · 1 Punkt: zwei Programmpunkte mit Uhrzeit oder mehrere ohne Uhrzeit"),
          kr("Frühstück für alle drei: 12 Dollar (Mama 6 Dollar, du und Linus je 3 Dollar)", 2, "2 Punkte: 12 Dollar oder alle drei Preise richtig · 1 Punkt: Einzelpreise richtig, aber nicht oder falsch zusammengezählt; Dollar, nicht Euro"),
          kr("Linus (7) darf beim Fahrrad-Umzug mitmachen (Kinder von 5 bis 10), er braucht aber einen Helm", 2, "2 Punkte: Ja und Helm · 1 Punkt: eines davon"),
          kr("bei Regen: Feuerwerk am 5. Juli um 21.30 Uhr", 1, "das Datum genügt"),
          kr(SM + " (Hunde, Glasflaschen, Decke und das Wettessen sind nicht gefragt)", 1)
        ], "Von 8 bis 10 Uhr gibt es bei der Feuerwehr ein Pfannkuchen-Frühstück, um 10.30 Uhr einen Umzug durch die Stadt und um 11.30 Uhr einen Fahrrad-Umzug für Kinder. Am Nachmittag kann man am Strand spielen und schwimmen, und um 21.30 Uhr ist ein Feuerwerk über dem See – das kostet nichts. Das Frühstück kostet für uns drei 12 Dollar: du zahlst 6 Dollar, Linus und ich je 3 Dollar. Linus darf beim Fahrrad-Umzug mitmachen, weil er zwischen 5 und 10 ist, aber er muss einen Helm tragen. Wenn es regnet, ist das Feuerwerk am 5. Juli.",
        ["frühstück|fruehstueck|umzug|feuerwerk|10.30|21.30", "12|zwölf|zwoelf|6|sechs", "ja|darf|helm", "5. juli|fünften|regen"],
        { vorgabe: A_INFO }),
        a(R ? "Your mum asks: „Was schreibt sie?“ Tell your mum the two important things from the message in German. (Sag es deiner Mutter auf Deutsch.)" : "Your mum asks: „Was schreibt sie?“ Tell your mum the two important things from the message in German.", [
          kr("sagt, dass man vor 9 Uhr zum Frühstück gehen soll – sonst sind die Pfannkuchen weg", 1, "vor 9 Uhr hingehen; der Grund (sehr beliebt, sonst keine Pfannkuchen mehr) ist schön, aber nicht nötig" + WEITER),
          kr("sagt, dass ihr euch für das Feuerwerk ihre große Decke leihen dürft – sie liegt in der Garage", 1, "Decke leihen (für das Feuerwerk); die Garage muss nicht genannt sein" + WEITER)
        ], "Sie schreibt, dass wir vor 9 Uhr zum Frühstück gehen sollen, sonst sind die Pfannkuchen weg. Und wir dürfen uns für das Feuerwerk ihre große Decke leihen – sie liegt in der Garage.", ["9|neun|früh|frueh|pfannkuchen", "decke|garage"],
        { vorgabe: A_NACHRICHT, ...(R ? { hilfe: "Sie schreibt, dass wir … · Außerdem …" } : {}) })
      ]),
      ...teil("E Writing", [
        s(R ? "An e-mail to a new friend: Your class has an e-mail project with a school in the USA. Your new e-friend Savannah (13) from Oregon has written: “Hi! I'm Savannah. Please tell me about yourself! What do you do in your free time? And how do you use your phone? I can't live without my phone!” Write an e-mail to her (40 to 70 words). Use the plan. Write about: yourself (name, age, family) · your school (My favourite subject is …) · your free time (I often … / Sometimes I …) · your phone (I use my phone for … · … is more useful than …) · a question to Savannah. (Schreibe eine E-Mail mit 40 bis 70 Wörtern.)"
          : "An e-mail to a new friend: Your class has an e-mail project with a school in the USA. Your new e-friend Savannah (13) from Oregon has written: “Hi! I'm Savannah. Please tell me about yourself and your school! What do you do in your free time? And how do you use your phone and social media? I can't live without my phone!” Write an e-mail to her (60 to 100 words). Write about: yourself and your family · your school (subjects, how you get there) · your free time and how often you do things (always, often, sometimes …) · how you use your phone and social media – compare (more … than, the most …) · a question to Savannah.", [
          kr("Inhalt", 5, "alle fünf Punkte des Auftrags – je Punkt 1: über sich (Name, Alter, Familie) · Schule (" + (R ? "zum Beispiel Lieblingsfach" : "Fächer, Schulweg") + ") · Freizeit (was und wie oft) · Handy" + (R ? "" : " und soziale Medien") + " mit einem Vergleich · eine Frage an Savannah (die Formen bewertet die Zeile Grammatik)"),
          kr("Textsorte und Aufbau", 2, "E-Mail an eine neue Brieffreundin: Anrede (Hi Savannah / Dear Savannah), Bezug auf ihre E-Mail (Thank you for …), sinnvolle Reihenfolge, Schluss (Write soon! / Best wishes) und Name; Sätze verbunden (and, but, because) – ein Betreff (Subject) ist schön, aber nicht nötig"),
          kr("Grammatik", 3, "Steigerung (more … than, the most …, -er / the -est, better, the best) erkennbar richtig gebildet, simple present (he/she/it mit s) und Häufigkeitswörter (always, often, sometimes) an der richtigen Stelle; Fehler stören das Verstehen kaum" + (R ? "; in R7 genügen kurze, einfache Sätze" : "")),
          kr("Wortschatz", 2, "passende Wörter der Unit für Medien und Freizeit (social media, to post, to share, to chat, video, tablet, online, useful, important, interesting, favourite/favorite …), nicht nur nice und good"),
          kr("Rechtschreibung", 2, "häufige Wörter und die Wörter der Unit sind meist richtig geschrieben", { rs: true })
        ], { minWoerter: R ? 30 : 50, plan: R ? [
          { id: "subject", label: "Subject", hilfe: "Subject: Hi from Bavaria!" },
          { id: "start", label: "Start", hilfe: "Hi Savannah, thank you for your e-mail! My name is …" },
          { id: "me", label: "About you", hilfe: "I'm … years old. I live in … with …" },
          { id: "school", label: "Your school", hilfe: "I go to … My favourite subject is … because …" },
          { id: "free", label: "Your free time", hilfe: "I often … · Sometimes I …" },
          { id: "phone", label: "Your phone", hilfe: "I use my phone for … · For me, … is more useful than …" },
          { id: "question", label: "Ask Savannah a question.", hilfe: "What is your favorite …? / Do you …?" },
          { id: "end", label: "End", hilfe: "Write soon! Bye, …" }
        ] : [
          { id: "start", label: "Subject and start", hilfe: "Subject: … · Hi Savannah, …" },
          { id: "me", label: "Me and my family", hilfe: "age, town, family …" },
          { id: "school", label: "My school", hilfe: "subjects, bus, bike …" },
          { id: "free", label: "Free time – how often?", hilfe: "always, often, sometimes …" },
          { id: "phone", label: "Phone and social media", hilfe: "more … than · the most …" },
          { id: "question", label: "Question to Savannah", hilfe: "…?" },
          { id: "end", label: "End", hilfe: "Write soon! …" }
        ] })
      ])
    ]
  });
}

/* ====================================================== Variante B ====================================================== */

const B_HOEREN = hoertext("h1", "A vacation in Montana", "Listening: two friends talking", [
  ["Marcus", "Hi Paige! Welcome back! How was your vacation?"],
  ["Paige", "Hi Marcus! It was amazing. We were in Montana for ten days."],
  ["Marcus", "Montana? That's far. Did you fly?"],
  ["Paige", "No, we drove. It took two days, and we slept in a hotel on the way. My little brother was so bored in the car!"],
  ["Marcus", "Where did you stay?"],
  ["Paige", "We camped in a tent near a national park. On the third day we climbed a mountain. It was more difficult than I thought, but the view from the top was the most beautiful thing I've ever seen."],
  ["Marcus", "Did you see any animals?"],
  ["Paige", "Yes, a bear! We saw it from the car, of course. At night there were so many stars."],
  ["Marcus", "Cool! Did you post lots of photos?"],
  ["Paige", "No. There wasn't much internet in the park, so I couldn't post anything. My dad says that was the best part of the vacation!"],
  ["Marcus", "And what was the worst part?"],
  ["Paige", "The last day. It rained so much that our tent was wet inside."],
  ["Marcus", "Oh no! I've got news too. I'm on the school baseball team now."],
  ["Paige", "That's great! When is your first game?"],
  ["Marcus", "On Saturday, the twelfth of September. It starts at two o'clock at the playing field behind the school."],
  ["Paige", "Can I come and watch? My little brother loves baseball!"],
  ["Marcus", "Sure! Bring him too."]
], { stimmen: { Paige: "en-US-JennyNeural", Marcus: "en-US-GuyNeural" }, mal: 2 });

const B_LESEN = {
  M: text("t1", "Sports, sports, sports!", "Blog post", [
    "Hi everybody! I'm Clara, I'm thirteen, and I'm from a small town near Passau in Bavaria. This school year I'm an exchange student in Wisconsin. I live with the Garcia family and go to Pinecrest Middle School. Today I want to write about the biggest difference between my school at home and my school here: sports!",
    "At home we have PE twice a week, and that's it. Here, sports are much more important. The school has got teams for soccer, basketball, volleyball, track and field and many other sports. Every afternoon, hundreds of students practice on the playing fields behind the school.",
    "In September I joined the girls' soccer team. In the USA they say soccer, because football is a different game here! We practice four times a week, from three to five o'clock. Our coach, Ms Sullivan, is strict, but she's the best coach I've ever had. She always motivates us, even when we lose.",
    "Our games are on Saturdays. Lots of parents and students come to watch, and the school band plays. At my first game I was so nervous that I couldn't eat anything. We lost, but I scored our only goal! My host sister Jasmine took a video of it and shared it with my family in Germany.",
    "The best day so far was the last game of the season. More than four hundred people watched, and we won! After the game the whole team went out for pizza.",
    "Is everything better here? No. The school day is longer, and I haven't got much time for my friends at home. But I'm going to miss my team a lot when I fly home in June."
  ]),
  R: text("t1", "Sports, sports, sports!", "Blog post", [
    "Hi everybody! I'm Clara, I'm thirteen, and I'm from Bavaria. This school year I'm an exchange student in Wisconsin, in the USA. I live with a host family and go to Pinecrest Middle School.",
    "At home we have PE twice a week, and that's it. Here, sports are much more important. The school has got teams for soccer, basketball and many other sports. Every afternoon, lots of students practice after school.",
    "In September I joined the girls' soccer team. We practice four times a week after school. Our coach, Ms Sullivan, is strict, but she's the best coach I've ever had.",
    "Our games are on Saturdays. Lots of parents and students come to watch, and the school band plays. At my first game I scored a goal! My host sister Jasmine took a video and shared it with my family in Germany.",
    "But not everything is better here. The school day is longer, and I haven't got much time for my friends at home. But I love my team!"
  ])
};

const B_INFO = "HOLLOW CREEK FARM – FALL FESTIVAL\nEvery Saturday and Sunday in October, 10 a.m. to 6 p.m.\nPumpkin picking: find your own pumpkin in our huge field! Small pumpkins $4 · big pumpkins $9\nTractor rides around the farm: every 30 minutes, the first one at 10:30 a.m. · $3 a person · kids under 3 free\nCostume parade for kids (4 to 12 years): October 31 at 2 p.m. – the best costume wins a big pumpkin pie!\nFarm café: apple juice, donuts, hot chocolate and pumpkin soup\nFarm shop: fresh apples, honey and apple pie to take home\nPlease note: Wear old shoes – our fields are often wet and dirty! The last tractor ride leaves at 5:30 p.m.";
const B_SCHILD = "📌 Sign at the entrance: “TODAY: The tractor rides start at 1 p.m., not at 10:30 a.m. Because of the rain, the pumpkin field closes at 4 p.m. Sorry!”";

function fassungB(zug) {
  const R = zug === "R";
  return probe7(4, zug, "B", {
    title: TITEL(zug), kurz: "Unit 4", scope: SCOPE, minutes: 90, hinweis: HINWEIS,
    texte: [B_HOEREN, B_LESEN[zug]],
    items: [
      ...teil("A Listening", R ? [
        c("How long was Paige in Montana?", ["for ten days", "for two weeks", "for three days"], 0, { text: "h1" }),
        c("How did Paige's family get to Montana?", ["by car", "by plane", "by train"], 0, { text: "h1" }),
        c("Where did the family sleep near the national park?", ["in a tent", "in a hotel", "at a friend's house"], 0, { text: "h1" }),
        c("What did they do on the third day?", ["They climbed a mountain.", "They went canoeing.", "They visited a museum."], 0, { text: "h1" }),
        c("Which animal did Paige see?", ["a bear", "a wolf", "a horse"], 0, { text: "h1" }),
        c("Why couldn't Paige post photos?", ["There wasn't much internet in the park.", "Her phone was broken.", "Her dad didn't let her."], 0, { text: "h1" }),
        c("What was the worst part of the vacation?", ["the rain on the last day", "the long drive", "the food at the hotel"], 0, { text: "h1" }),
        c("What is Marcus's news?", ["He's on the school baseball team.", "He has got a new dog.", "His family is going to move."], 0, { text: "h1" }),
        c("Where is Marcus's first game?", ["at the playing field behind the school", "at the big stadium in the city", "in the park next to Paige's house"], 0, { text: "h1" }),
        o("What do Paige and Marcus talk about? Put the topics in the right order.", ["Paige says how her family got to Montana.", "Paige talks about the animals.", "Marcus talks about his baseball team."], { text: "h1" })
      ] : [
        c("What was Paige's little brother like in the car?", ["He was so bored.", "He was ill.", "He slept all the time."], 0, { text: "h1" }),
        c("What does Paige say about the mountain?", ["It was more difficult to climb than she thought.", "It was the easiest part of the trip.", "She didn't want to climb it."], 0, { text: "h1" }),
        c("What does Paige's dad think?", ["No internet was the best part of the vacation.", "Montana was too far away.", "The tent was too small for the family."], 0, { text: "h1" }),
        c("What happened on the last day?", ["It rained a lot, and the tent was wet inside.", "They lost the way back to the car.", "Paige's brother was ill."], 0, { text: "h1" }),
        f("Listen again and complete the notes. Write one word or a number.", [
          feld("Paige's family was in Montana for … days.", ["ten", "10"]),
          feld("The drive took … days.", ["two", "2"]),
          feld("At night they could see so many … in the sky.", ["stars", "star"]),
          feld("Marcus's first game: Saturday, the … of September", ["twelfth", "12th", "12", "the twelfth", "the 12th"]),
          feld("The game starts at … o'clock.", ["two", "2"])
        ], { text: "h1", tolerant: true, hinweis: "Lies vor dem Hören die Notizen: Dann weißt du, auf welche Zahl oder welches Wort du achten musst." }),
        o("What do Paige and Marcus talk about? Put the topics in the right order.", ["Paige says how her family got to Montana.", "Paige talks about the animals.", "Marcus talks about his baseball team."], { text: "h1" })
      ]),
      ...teil("B Reading", R ? [
        c("Where is Clara this school year?", ["in the USA", "in Germany", "in England"], 0, { text: "t1" }),
        c("What is different at Clara's American school?", ["Sports are more important.", "There aren't any sports teams.", "The school day is shorter."], 0, { text: "t1" }),
        c("Which team did Clara join?", ["the girls' soccer team", "the basketball team", "the school band"], 0, { text: "t1" }),
        c("When are the games?", ["on Saturdays", "on Fridays", "on Sundays"], 0, { text: "t1" }),
        c("What did Clara do at her first game?", ["She scored a goal.", "She was the coach.", "She played in the school band."], 0, { text: "t1" }),
        z("In which line(s) does Clara say how often her team practices?", "t1", [[9, 10]], { hinweis: "Suche die Wörter „times a week“ im Text." }),
        z("In which line(s) does Clara say what Jasmine did?", "t1", [[14, 15]], { hinweis: "Suche den Namen „Jasmine“ im Text." }),
        f("Complete the notes about Clara. Write one word or a number.", [
          feld("Clara is … years old.", ["thirteen", "13"]),
          feld("At home Clara has PE … a week.", ["twice", "two times", "2 times"]),
          feld("Clara joined the soccer team in …", ["September"])
        ], { text: "t1", tolerant: true }),
        a("What does Clara like about sports at her American school? Give one thing from the text. Answer in English.", [
          kr("eine Sache aus dem Text, die Clara am Sport ihrer Schule gefällt", 1, "zum Beispiel: Her coach is the best coach she has ever had. / She plays in the girls' soccer team. / Lots of people come to watch the games. / She scored a goal. / Sports are more important there. – „The school day is longer“ ist keine Sache, die ihr gefällt."),
          kr("verständlich auf Englisch (Stichworte und Wörter aus dem Text genügen; Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
        ], "She likes her coach – Ms Sullivan is the best coach she has ever had.", ["coach|team|soccer|watch|goal|video|important|game"], { text: "t1", zeilen: [1, 18] })
      ] : [
        c("Why do people in the USA say soccer?", ["Football is a different game there.", "Soccer is the older word.", "Soccer is only a game for girls."], 0, { text: "t1" }),
        c("What happened at Clara's first game?", ["Her team lost, but she scored the only goal.", "Her team won, and she scored three goals.", "She couldn't play because she was ill."], 0, { text: "t1" }),
        c("What isn't so good for Clara in the USA?", ["She hasn't got much time for her friends at home.", "Nobody comes to watch the games.", "Her coach doesn't like her."], 0, { text: "t1" }),
        z("In which line(s) does Clara say what she thinks about her coach?", "t1", [[15, 16]], { hinweis: "Suche das Wort „coach“ im Text und lies dort genau." }),
        z("In which line(s) does Clara say what the team did after the last game of the season?", "t1", [[23, 24]], { hinweis: "Suche die Wörter „After the game“ im Text." }),
        f("Complete the notes about Clara. Write one word or a number.", [
          feld("Clara's team practices … times a week.", ["four", "4"]),
          feld("Practice is from three to … o'clock.", ["five", "5"]),
          feld("More than … people watched the last game of the season.", ["four hundred", "400", "four-hundred"]),
          feld("Clara is going to fly home in …", ["June"])
        ], { text: "t1", tolerant: true }),
        a("Clara loves sports at her American school, but not everything is better there. Give one thing that she likes and one thing that isn't so good for her. Answer in English.", [
          kr("eine Sache, die Clara gefällt", 1, "zum Beispiel: Sports are more important there. / She plays in the girls' soccer team. / Her coach is the best coach she has ever had and motivates the team. / Lots of people watch the games, and the band plays. / She scored a goal. / Her team won the last game. / They went out for pizza."),
          kr("eine Sache, die nicht so gut ist", 1, "zum Beispiel: The school day is longer. / She hasn't got much time for her friends at home. / She was very nervous at her first game. / Her team lost the first game. / The coach is strict."),
          kr("verständlich auf Englisch (eigene Worte oder passende Wörter aus dem Text; Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
        ], "She likes her coach, because Ms Sullivan always motivates the team. But the school day is longer, and she hasn't got much time for her friends at home.", ["coach|team|soccer|watch|band|goal|won|pizza|important", "longer|time|friends|nervous|lost|strict"], { text: "t1", zeilen: [1, 27] })
      ]),
      ...teil("C Grammar and vocabulary", R ? [
        f("Complete the sentences with much or many. Use: much · many", [
          feld("How … dollars did you pay for the tickets?", ["many"]),
          feld("Sorry, I haven't got … money with me.", ["much"]),
          feld("There weren't … cars on the road this morning.", ["many"]),
          feld("How … milk do we need for the pancakes?", ["much"]),
          feld("Dominic has got so … cousins in the USA.", ["many"])
        ], { hinweis: H_MUCH }),
        c("Choose the right form: Basketball is … than golf.", ["more exciting", "excitinger", "most exciting"], 0, { hinweis: H_STEIG }),
        c("Choose the right form: This is … day of my vacation!", ["the best", "the goodest", "the better"], 0, { hinweis: H_STEIG }),
        c("Choose the right form: For me, golf is … sport of all – it's so boring!", ["the least exciting", "the less exciting", "the most exciting"], 0, { hinweis: H_STEIG }),
        f("Write the right form of the adjective in brackets.", [
          feld("The hike was (difficult) … than the bike ride.", ["more difficult"]),
          feld("Montana was (beautiful) … place of our trip.", ["the most beautiful"]),
          feld("My bag is (big) … than yours.", ["bigger"])
        ], { hinweis: H_STEIG }),
        c("Choose the right words: We can't go in. There are … people in the shop.", ["too many", "too much", "so much"], 0, { hinweis: H_TOO }),
        c("Choose the right words: I'm so full – that was … pizza for me!", ["too much", "too many", "how many"], 0, { hinweis: H_TOO }),
        m("Match the questions and the answers.", [["How many players are on your team?", "Eleven – and I'm one of them!"], ["How much does the ticket cost?", "Four dollars for kids."], ["How many games have you won?", "Not many – only two."], ["How much homework have you got?", "Too much!"]],
          { hinweis: H_HOW }),
        m("What do the words mean in German? Match them.", [["coach", "Trainer"], ["to celebrate", "feiern"], ["independence", "Unabhängigkeit"], ["huge", "riesig"], ["fiftieth", "fünfzigste"]], { hinweis: H_WORT })
      ] : [
        f("Compare: Write the right form of the adjective in brackets (-er / the -est, more / the most, less / the least).", [
          feld("At my school, soccer is (popular) … than baseball.", ["more popular"]),
          feld("This is (bad) … pizza I've ever eaten!", ["the worst"]),
          feld("The second hike was (long) … than the first one.", ["longer"]),
          feld("For me, history is (less / interesting) … than science.", ["less interesting"]),
          feld("That was (exciting) … game of the season!", ["the most exciting"]),
          feld("The bus is (least / expensive) … way to get to the city.", ["the least expensive"])
        ], { hinweis: H_STEIG }),
        f("Complete the sentences with much or many.", [
          feld("How … stars can you see tonight?", ["many"]),
          feld("There isn't … snow this winter.", ["much"]),
          feld("Did you take … photos on your trip?", ["many"]),
          feld("How … juice is there in the fridge?", ["much"])
        ], { hinweis: H_MUCH }),
        f("Complete the sentences with too much, too many, so much or so many.", [
          feld("There were … people at the concert – it was fantastic!", ["so many"]),
          feld("Don't drink … cola – it's bad for your teeth.", ["too much"]),
          feld("I can't carry this bag. There are … books in it.", ["too many"]),
          feld("I love this town – there's … to do here!", ["so much"])
        ], { hinweis: H_TOO }),
        f("Unit 4 words: Complete the sentences.", [
          feld("Thanksgiving is on the … Thursday in November.", ["fourth", "4th"]),
          feld("On the evening of Independence Day, there are … in the sky.", ["fireworks"]),
          feld("A … is bigger than a phone, but smaller than a laptop.", ["tablet"]),
          feld("In the summer holidays, many American kids spend two or three weeks at a summer …", ["camp"])
        ], { hinweis: H_WORT }),
        m("Ordinal numbers: Match the numbers and the words.", [["32nd", "thirty-second"], ["40th", "fortieth"], ["68th", "sixty-eighth"], ["100th", "hundredth"]], { hinweis: "Ordnungszahlen: 32nd = thirty-second · Achtung: forty ohne u (fortieth)." })
      ]),
      ...teil("D Mediation", [
        R ? a("You are on a fall vacation in the USA with your dad and your little sister Ronja (7 years old). Your dad doesn't speak English. He asks you questions about this flyer. Answer his questions in German. (Beantworte die Fragen deines Vaters auf Deutsch – kurze Sätze genügen.)", [
          kr("geöffnet: samstags und sonntags im Oktober, von 10 bis 18 Uhr", 1, "Tage und Uhrzeit; „am Wochenende“ genügt"),
          kr("ein großer Kürbis kostet 9 Dollar", 1, "Dollar, nicht Euro"),
          kr("Traktorfahrt für alle drei: 9 Dollar (je 3 Dollar)", 2, "2 Punkte: 9 Dollar oder je 3 Dollar für alle drei · 1 Punkt: nur 3 Dollar pro Person ohne Gesamtpreis oder falsch gerechnet (Ronja ist nicht frei – frei sind nur Kinder unter 3); Dollar, nicht Euro"),
          kr("Kostüm-Umzug am 31. Oktober um 14 Uhr; Ronja darf mitmachen (Kinder von 4 bis 12)", 1, "Datum oder Uhrzeit und Ja"),
          kr("alte Schuhe anziehen – die Felder sind oft nass und schmutzig", 1, "alte Schuhe genügt"),
          kr("Essen und Trinken im Café: Apfelsaft, Donuts, heiße Schokolade, Kürbissuppe (oder Hofladen mit Äpfeln, Honig, Apfelkuchen)", 1, "Ja und eine Sache genügt"),
          kr(SM + " (auf Deutsch, verständlich für den Vater)", 1)
        ], "1. Das Fest ist samstags und sonntags im Oktober von 10 bis 18 Uhr offen. 2. Ein großer Kürbis kostet 9 Dollar. 3. Wir zahlen jeder 3 Dollar – zusammen 9 Dollar. 4. Der Umzug ist am 31. Oktober um 14 Uhr, und Ronja darf mitmachen. 5. Wir sollen alte Schuhe anziehen, weil die Felder nass und schmutzig sind. 6. Ja, im Café gibt es Kürbissuppe, Donuts und heiße Schokolade.",
        ["samstag|sonntag|wochenende|10|18", "9|neun", "9|neun|3|drei", "31|14|ja|darf", "schuh", "café|cafe|suppe|donut|schokolade|saft|kuchen"],
        { vorgabe: B_INFO, teile: [
          { label: "„Wann ist das Fest geöffnet?“", hilfe: "Das Fest ist … von … bis … geöffnet." },
          { label: "„Was kostet ein großer Kürbis?“", hilfe: "Ein großer Kürbis kostet …" },
          { label: "„Was kostet die Traktorfahrt für uns drei?“", hilfe: "Wir zahlen jeder … – zusammen …" },
          { label: "„Wann ist der Kostüm-Umzug? Darf Ronja mitmachen?“", hilfe: "Der Umzug ist am … um … Ronja …" },
          { label: "„Was sollen wir anziehen?“", hilfe: "Wir sollen … anziehen, weil …" },
          { label: "„Können wir dort etwas essen?“", hilfe: "Ja, im Café gibt es …" }
        ] })
        : a("You are on a fall vacation in the USA with your dad and your little sister Ronja (7 years old). Your dad doesn't speak English. He has found this flyer and wants to know: When is the festival open? · What can we do there? · What does a tractor ride cost for the three of us? · What should we wear? Tell him the important things in German (4 to 6 sentences). Do not translate word for word.", [
          kr("geöffnet: samstags und sonntags im Oktober, von 10 bis 18 Uhr", 2, "2 Punkte: Tage und Uhrzeit · 1 Punkt: eines davon"),
          kr("was man machen kann: Kürbis selbst aussuchen (klein 4 Dollar, groß 9 Dollar), Traktorfahrt um die Farm, Kostüm-Umzug für Kinder am 31. Oktober um 14 Uhr (Ronja darf mitmachen), Café, Hofladen", 2, "2 Punkte: mindestens zwei Dinge · 1 Punkt: eines davon"),
          kr("Traktorfahrt für alle drei: 9 Dollar (je 3 Dollar)", 2, "2 Punkte: 9 Dollar oder je 3 Dollar für alle drei · 1 Punkt: nur 3 Dollar pro Person ohne Gesamtpreis oder falsch gerechnet (Ronja ist nicht frei – frei sind nur Kinder unter 3); Dollar, nicht Euro"),
          kr("Kleidung: alte Schuhe, weil die Felder oft nass und schmutzig sind", 1, "alte Schuhe genügt"),
          kr(SM + " (Hofladen, Kürbiskuchen und die letzte Fahrt sind nicht gefragt)", 1)
        ], "Das Herbstfest ist im Oktober jeden Samstag und Sonntag von 10 bis 18 Uhr offen. Man kann sich auf einem riesigen Feld selbst einen Kürbis aussuchen – ein kleiner kostet 4 Dollar, ein großer 9 Dollar – und mit dem Traktor um die Farm fahren. Die Traktorfahrt kostet für uns drei 9 Dollar, also 3 Dollar für jeden. Am 31. Oktober um 14 Uhr gibt es einen Kostüm-Umzug für Kinder, da kann Ronja mitmachen. Wir sollen alte Schuhe anziehen, weil die Felder oft nass und schmutzig sind.",
        ["samstag|sonntag|wochenende|10|18", "kürbis|kuerbis|traktor|umzug|kostüm|kostuem|café|cafe", "9|neun|3|drei", "schuh"],
        { vorgabe: B_INFO }),
        a(R ? "Your dad sees this sign and asks: „Was steht da?“ Tell him the two important things in German. (Sag es deinem Vater auf Deutsch.)" : "Your dad sees this sign and asks: „Was steht da?“ Tell him the two important things in German.", [
          kr("sagt, dass die Traktorfahrten heute erst um 13 Uhr anfangen (nicht um 10.30 Uhr)", 1, "13 Uhr oder ein Uhr mittags; „erst später“ ohne Uhrzeit genügt nicht" + WEITER),
          kr("sagt, dass das Kürbisfeld wegen des Regens schon um 16 Uhr schließt", 1, "Uhrzeit nötig, der Grund (Regen) nicht" + WEITER)
        ], "Auf dem Schild steht, dass die Traktorfahrten heute erst um 13 Uhr anfangen und nicht um halb elf. Und wegen des Regens macht das Kürbisfeld schon um 16 Uhr zu.", ["13|ein uhr|traktor", "16|vier|kürbis|kuerbis|feld"],
        { vorgabe: B_SCHILD, ...(R ? { hilfe: "Auf dem Schild steht, dass … · Außerdem …" } : {}) })
      ]),
      ...teil("E Writing", [
        s(R ? "A special day: Your American e-friend Hunter has written: “Last week we celebrated Thanksgiving. My whole family came to our house, and we had a huge dinner. It's my favorite holiday! What special days do you celebrate in Germany?” Write an e-mail to him (40 to 70 words). Use the plan. Write about: a special day in your family or town and when it is (My favourite special day is … It's in …) · what people do or eat on this day (We … / People …) · what you like best (I like … best because …) · a comparison with Thanksgiving (It's longer / more fun / less … than …) · a question to Hunter. (Schreibe eine E-Mail mit 40 bis 70 Wörtern.)"
          : "A special day: Your American e-friend Hunter has written: “Last week we celebrated Thanksgiving. My whole family came to our house, and we had a huge dinner. It's my favorite holiday! What special days do you celebrate in Germany?” Write an e-mail to him (60 to 100 words). Write about: a special day or festival in your family, your town or in Bavaria (what and when) · what people do, eat or wear on this day · what you like most about it and why (the best …, the nicest …) · compare it with Thanksgiving (more … than, bigger …) · a question to Hunter about American holidays.", [
          kr("Inhalt", 5, "alle fünf Punkte des Auftrags – je Punkt 1: welcher besondere Tag oder welches Fest und wann · was man an diesem Tag tut, isst oder trägt · was am schönsten ist" + (R ? "" : " (mit Grund)") + " · ein Vergleich mit Thanksgiving · eine Frage an Hunter (die Formen bewertet die Zeile Grammatik)"),
          kr("Textsorte und Aufbau", 2, "E-Mail an einen Freund: Anrede (Hi Hunter / Dear Hunter), Bezug auf seine E-Mail (Thank you for …), sinnvolle Reihenfolge, Schluss (Write soon! / Best wishes) und Name; Sätze verbunden (and, but, because)"),
          kr("Grammatik", 3, "Steigerung (bigger than, more exciting than, the best, the most …) erkennbar richtig gebildet, simple present für Bräuche (People celebrate …, he/she/it mit s), simple past nur, wo es passt; Fehler stören das Verstehen kaum" + (R ? "; in R7 genügen kurze, einfache Sätze" : "")),
          kr("Wortschatz", 2, "passende Wörter der Unit für Feste (to celebrate, holiday, festival, party, birthday, dinner, barbecue, costume, carnival, procession, fireworks, present, to invite, to dance …), nicht nur nice und good"),
          kr("Rechtschreibung", 2, "häufige Wörter und die Wörter der Unit sind meist richtig geschrieben", { rs: true })
        ], { minWoerter: R ? 30 : 50, plan: R ? [
          { id: "start", label: "Start", hilfe: "Hi Hunter, thank you for your e-mail!" },
          { id: "day", label: "Which special day? When is it?", hilfe: "My favourite special day is … It's in …" },
          { id: "do", label: "What do people do or eat?", hilfe: "On this day we … / People …" },
          { id: "best", label: "What do you like best?", hilfe: "I like … best because …" },
          { id: "compare", label: "Compare it with Thanksgiving.", hilfe: "It's longer / more fun / less … than Thanksgiving." },
          { id: "question", label: "Ask Hunter a question.", hilfe: "What do you do on …? / Do you …?" },
          { id: "end", label: "End", hilfe: "Write soon! Bye, …" }
        ] : [
          { id: "start", label: "Start", hilfe: "Hi Hunter, …" },
          { id: "day", label: "Special day – what and when?", hilfe: "festival, holiday, birthday … in …" },
          { id: "do", label: "What people do, eat, wear", hilfe: "celebrate, costume, dinner …" },
          { id: "best", label: "The best part – why?", hilfe: "the best … · the nicest …" },
          { id: "compare", label: "Compared with Thanksgiving", hilfe: "more … than · bigger …" },
          { id: "question", label: "Question to Hunter", hilfe: "…?" },
          { id: "end", label: "End", hilfe: "Write soon! …" }
        ] })
      ])
    ]
  });
}

const p4ra = fassungA("R"), p4ma = fassungA("M"), p4rb = fassungB("R"), p4mb = fassungB("M");
module.exports = { p4ra, p4rb, p4ma, p4mb };
