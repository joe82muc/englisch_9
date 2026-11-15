"use strict";

/**
 * Englisch 7 · Probe 2: Unit 2 – Fun in Wales and Scotland (Auftrag vom 14.11.2026: „2 große Proben je Unit – A + Nachschreiber
 * B, Aufbau wie Probe 1 … online + Word/PDF“, „M und R getrennt – eigene, leichtere R-Fassungen der Module und Proben“,
 * „die ki soll mit einheitlicher temperatur die probe auswerten“).
 *
 * Teile: A Listening (12) · B Reading (12) · C Grammar and vocabulary (22) · D Mediation (10) · E Writing (14) = 70 Punkte,
 * 90 Minuten – wie Probe 1. Anders als Probe 1 hat jeder Zug eine eigene Fassung (vier Kennungen):
 *   e7-p2-m-a, e7-p2-r-a (Variante A) und e7-p2-m-b, e7-p2-r-b (Variante B = Nachschreiber, eigene Texte und Situationen).
 * 7M und 7R derselben Variante hören denselben Hörtext (eine Aufnahme je Variante) und haben dieselbe Situation in jedem Teil.
 * 7R ist leichter: Hören nur mit Auswahl und Reihenfolge (M: Notizen), kürzerer und einfacherer Lesetext (R etwa 160, M etwa
 * 240 Wörter; Hörtext A 217, B 227 Wörter), im Grammatikteil mehr Auswahl und Zuordnen (am/is/are einsetzen, Partizipien aus einem Wortkasten, Kurzantworten
 * zuordnen, simple past/present perfect ankreuzen, Wörter zuordnen; M bildet die Formen selbst), Sprachmittlung mit mehr
 * Lenkung (je Frage der Oma bzw. des Vaters ein eigenes Feld, deutsche Hilfe; M fasst in 4 bis 6 Sätzen zusammen), Schreiben
 * 40–70 Wörter mit Satzanfängen im Plan (M 60–100 Wörter). Die Note folgt dem Zug der Fassung: M 50 % = Note 4, R 50 % = Note 3.
 * A und B haben je Teil dieselben Aufgabenarten und Punkte (gleicher Anteil offener Aufgaben).
 *
 * Grammatik der Unit: G5 going to-future, G6 present perfect (Aussagen, Verneinung, already/never/just/not … yet),
 * G7 present perfect (Fragen mit ever/yet, Kurzantworten), present perfect oder simple past (Signalwörter).
 * Wortschatz: Wortliste Unit 2 (GRUMI-Vokabeltrainer Unit 2) verstärkt – adventure, competition, tradition, bagpipes, kilt,
 * heavy events, stone put, caber toss, dancing, castle, century, battle, brave, careful, dangerous, safe, difficult, easy,
 * exciting, boring, fast, strong, fit, tired, to book, to pack, already, never, yet, ever, just, still, See you later, mile,
 * to decide, to think about, free, fun, rugby, skiing/to ski, history, possible, for example; sonst Grundwortschatz und Unit 1.
 *
 * Abgleich mit Blue Line 3 (Klett, Bayern M-Zug, Unit 2, S. 32–51 – nur Aufbau, Themen und Aufgabenformen, Analyse in
 * progress/englisch7/BUCH-UNIT2.md): Freizeit- und Abenteueraktivitäten mit Adjektiven (Topic 1, G5/G6), sich verabreden am
 * Telefon mit Hausarbeiten und present perfect (Topic 2, G7, PP ↔ SP), schottische Tradition und Highland Games (Intro,
 * More about), Programm einer Veranstaltung für die Familie auf Deutsch erklären (Mediation Englisch → Deutsch), dazu wie in
 * Probe 1 ein kurzer Auftrag Deutsch → Englisch. Hören wie Topic 2 (Telefonat zur Verabredung, W-Fragen).
 * Nichts übernommen: keine Buchtexte, -namen oder -motive (kein Abenteuerzentrum mit Seilrutsche, kein Festival mit zwei
 * Bühnen, kein Kino-Telefonat, kein übriges Highland-Games-Ticket, keine Bingo-Fragen).
 *
 * Variante A: Telefonat Carys (Mädchen) und Liam (Junge) – Radtour zum Wasserfall im Nant Wood, vorher Küche und Zimmer,
 *   Treffpunkt Brücke (Hören, Wales) · Blog von Shona über Highland dancing (Lesen, Schottland) · Programm „Family Day“ auf
 *   Craigwen Castle für die Oma auf Deutsch, Frage an der Kasse auf Englisch (Sprachmittlung, Wales) · E-Mail an die
 *   E-Mail-Freundin Nia über die eigene Lieblingsaktivität (Schreiben).
 * Variante B: Telefonat Morven (Mädchen) und Rory (Junge) – Bootsausflug zur kleinen Insel, vorher Opa im Garten helfen,
 *   Treffpunkt Hafencafé (Hören, Schottland) · Blog von Ifan über Pony trekking (Lesen, Wales) · Programm des Cairnbrae Snow
 *   Centre für den Vater auf Deutsch, Frage an der Kasse auf Englisch (Sprachmittlung, Schottland) · Nachricht an den Freund
 *   Finlay, der zu Besuch kommt: Verabredung für Samstag (Schreiben).
 * Alle Texte, Personen und Orte sind eigenständig für GRUMI erstellt und erfunden (Carys, Liam, Aled, Nant Wood, Shona,
 * Mrs Baird, Kyle, Balmorie, Craigwen Castle, Alfie, Nia, Morven, Rory, Ifan, Bryndu, Moel Fach, Seren, Moira, Cairnbrae Snow
 * Centre, Elsie, Finlay; Elgin als echte Stadt; in den Grammatiksätzen Ollie, Hugo, Sara, Elspeth – seit 14.11.2026 statt eines Buchnamens aus Unit 4) – sie stehen weder im Schulbuch noch in einem Lernmodul (MODULE.md, „Vergebene
 * Namen“) noch in Probe 1.
 * LehrplanPLUS E7: Hörverstehen, Leseverstehen, Sprachmittlung (Informationen aus einem Programm adressatengerecht weitergeben),
 * Schreiben (persönliche E-Mail/Nachricht), Wortschatz und Grammatik der Unit.
 * Den Hörtext spielt die Lehrkraft in der Verwaltung zweimal für alle ab (Aufnahme in audio/: e7-p2-<r|m>-<a|b>-h1.mp3 –
 * R und M derselben Variante sind dieselbe Aufnahme). Bleibt auf dem Server (Lösungen und Erwartungshorizont). Bausteine: bau.js.
 */
const { c, m, o, f, feld, z, a, kr, s, text, hoertext, teil, probe7 } = require("./bau");

const HINWEIS = "Work on your own. Part A: your teacher plays the recording twice – read the tasks first. Read every task carefully. Arbeite allein. Den Hörtext spielt deine Lehrkraft zweimal für alle ab – lies vorher die Aufgaben. Du hast etwa 90 Minuten Zeit. Reinkopieren ist verboten und wird protokolliert. Nach der Abgabe kannst du nichts mehr ändern.";
const TITEL = (zug) => "Test 2 (" + zug + "7): Fun in Wales and Scotland";
const SCOPE = "Unit 2 · Listening, Reading, Grammar and vocabulary, Mediation, Writing";
// Sprachmittlung Deutsch → Englisch: Die Frage darf direkt gestellt werden oder über die Person (My grandma wants to know …)
const FRAGE = " – zählt als direkte Frage (Can we …?) oder als Bericht (My grandma / My dad wants to know …); Fehler, die das Verstehen nicht stören, kosten nichts.";
const SM = "Sprachmittlung: verständliches Deutsch für die genannte Person, sinngemäß und nicht Wort für Wort; Unwichtiges darf fehlen";

/* ====================================================== Variante A ====================================================== */

const A_HOEREN = hoertext("h1", "A bike ride to the waterfall", "Listening: two friends on the phone", [
  ["Carys", "Hello?"],
  ["Liam", "Hi Carys, it's Liam. Are you busy today?"],
  ["Carys", "Hi Liam! No, not really. Why?"],
  ["Liam", "I'm going to ride my bike to the waterfall in Nant Wood this afternoon. Do you want to come with me?"],
  ["Carys", "The waterfall? I've never been there. Is it far?"],
  ["Liam", "It's about six miles from here, but the way isn't difficult. I've been there twice with my dad."],
  ["Carys", "Great! But I can't come this morning. My mum is going to have visitors tonight, so I have to clean the kitchen and tidy my room first."],
  ["Liam", "That's OK. I haven't finished my homework yet anyway. What about half past two?"],
  ["Carys", "Half past two is fine. Where shall we meet?"],
  ["Liam", "Let's meet at the bridge next to the bakery."],
  ["Carys", "OK. What do I need to bring?"],
  ["Liam", "Your helmet, of course, and something to drink. And bring your swimming things! There's a small lake under the waterfall, and you can swim in it."],
  ["Carys", "Swim? Isn't the water really cold?"],
  ["Liam", "Yes, it is! But it's fun. And there's a little café in the wood. They sell fantastic ice cream."],
  ["Carys", "Brilliant. Oh, can my cousin Aled come too? He's staying with us this week."],
  ["Liam", "Sure! Has he got a bike?"],
  ["Carys", "No, he hasn't. But he can take my old one."],
  ["Liam", "Perfect. See you later, then!"],
  ["Carys", "Bye, Liam!"]
], { stimmen: { Carys: "en-GB-LibbyNeural", Liam: "en-GB-RyanNeural" }, mal: 2 });

const A_LESEN = {
  M: text("t1", "My favourite activity: Highland dancing", "Blog post", [
    "Hi, I'm Shona, and I'm thirteen years old. I live in Balmorie, a small town in the Highlands of Scotland. My favourite activity is Highland dancing. It's a very old Scottish tradition, and I love it.",
    "I started when I was seven. Now I go to dance classes twice a week, on Tuesdays and Fridays. My teacher, Mrs Baird, is great, but she wants us to work hard. Highland dancing isn't easy. You dance on your toes all the time, so you have to be strong and fit. After a long class I'm always really tired!",
    "At a competition we wear a kilt and special shoes, and a man plays the bagpipes for us. I have already danced at a lot of Highland Games. Last summer I won my first medal! My granddad came to watch, and he was very happy. He took about a hundred photos of me.",
    "At the Highland Games there are also heavy events, like the stone put or the caber toss. My brother Kyle has tried the stone put, but I have never done it. The stones are much too heavy for me!",
    "There is one thing I don't like: our classes are on Friday evenings, so I can't go to the cinema with my friends.",
    "Next month I'm going to dance at a big competition in Elgin. More than two hundred dancers are going to be there. I'm a bit nervous, but I'm going to practise every day. Wish me luck!"
  ]),
  R: text("t1", "My favourite activity: Highland dancing", "Blog post", [
    "Hi, I'm Shona. I'm thirteen, and I live in Balmorie, a small town in Scotland. My favourite activity is Highland dancing. It's an old Scottish tradition.",
    "I go to dance classes twice a week. My teacher is Mrs Baird. She's great, but we have to work hard. Highland dancing is fun, but it isn't easy. You have to be strong and fit. After a class I'm always tired!",
    "At a competition we wear a kilt, and a man plays the bagpipes for us. I have already danced at a lot of Highland Games. Last summer I won my first medal. My granddad was very happy.",
    "At the Highland Games there are also heavy events, like the stone put. My brother Kyle has tried it, but I haven't. The stones are too heavy for me!",
    "Next month I'm going to dance at a big competition in Elgin. I'm a bit nervous, so I'm going to practise every day."
  ])
};

const A_PROGRAMM = "CRAIGWEN CASTLE – FAMILY DAY\nEvery Saturday in August, 10 a.m. to 5 p.m.\nOur castle is more than 700 years old. Find out about its history and have fun!\n\n10.30 a.m. – Battle show in the castle yard: watch a battle like in the 13th century. Please stay behind the line – it can be dangerous!\n12.00 – Welsh music and dancing in the Great Hall\n2.00 p.m. – Castle quiz for children (6 to 12 years): find the answers in the castle and win a small present\n3.30 p.m. – Tower tour: climb 150 steps to the top of the tower – great view of the sea! Not for children under 6.\n\nTickets: adults £9 · children (6 to 16) £4 · children under 6 free\nFood: Our café is open all day (sandwiches, soup, Welsh cakes). You can also have a picnic in the garden.\nPlease note: Dogs are not allowed in the castle. There is no lift in the tower.";
const A_OMA = "👵 Oma: „Frag bitte den Mann an der Kasse, ob wir oben auf dem Turm Fotos machen dürfen und wo die Toiletten sind.“";

function fassungA(zug) {
  const R = zug === "R";
  return probe7(2, zug, "A", {
    title: TITEL(zug), kurz: "Unit 2", scope: SCOPE, minutes: 90, hinweis: HINWEIS,
    texte: [A_HOEREN, A_LESEN[zug]],
    items: [
      ...teil("A Listening", R ? [
        c("Where does Liam want to go this afternoon?", ["to the waterfall in Nant Wood", "to the swimming pool", "to the sports centre"], 0, { text: "h1" }),
        c("How far is it?", ["about six miles", "about two miles", "about sixteen miles"], 0, { text: "h1" }),
        c("Has Carys been there before?", ["No, she has never been there.", "Yes, she has been there once.", "Yes, she has been there twice."], 0, { text: "h1" }),
        c("Why can't Carys come in the morning?", ["She has to help at home.", "She wants to visit her grandma.", "She hasn't finished her homework."], 0, { text: "h1" }),
        c("When do Carys and Liam want to meet?", ["at half past two", "at half past ten", "at two o'clock"], 0, { text: "h1" }),
        c("Where do Carys and Liam want to meet?", ["at the bridge next to the bakery", "at the café in the wood", "at Liam's house"], 0, { text: "h1" }),
        c("What does Carys need to bring?", ["her swimming things", "a map", "some sandwiches"], 0, { text: "h1" }),
        c("What is the water at the waterfall like?", ["very cold", "warm", "dirty"], 0, { text: "h1" }),
        c("Who else wants to come?", ["Carys's cousin Aled", "Liam's dad", "Liam's sister"], 0, { text: "h1" }),
        o("What do Carys and Liam talk about? Put the topics in the right order.", ["Liam says how far it is to the waterfall.", "Carys says why she can't come in the morning.", "Liam says what Carys needs to bring."], { text: "h1" })
      ] : [
        c("Where does Liam want to go this afternoon?", ["to the waterfall in Nant Wood", "to the lake in the park", "to the sports centre"], 0, { text: "h1" }),
        c("Why can't Carys go in the morning?", ["She has to help at home.", "She hasn't finished her homework.", "She wants to visit her cousin."], 0, { text: "h1" }),
        c("What is special about the café in the wood?", ["They sell fantastic ice cream.", "It is open all night.", "It is next to the bridge."], 0, { text: "h1" }),
        c("Who else wants to come?", ["Carys's cousin", "Liam's dad", "Liam's sister"], 0, { text: "h1" }),
        f("Listen again and complete the notes. Write one word or a number.", [
          feld("Distance to the waterfall: about … miles", ["six", "6"]),
          feld("Liam has been there … with his dad.", ["twice", "two times", "2 times", "two", "2"]),
          feld("Time to meet: …", ["half past two", "2.30", "2:30", "two thirty", "14.30", "14:30", "half two", "2.30 pm", "2.30 p.m."]),
          feld("Place to meet: at the … next to the bakery", ["bridge"]),
          feld("Carys must bring her helmet, something to drink and her … things.", ["swimming", "swim"])
        ], { text: "h1", tolerant: true, hinweis: "Lies vor dem Hören die Notizen: Dann weißt du, auf welche Zahl oder welches Wort du achten musst." }),
        o("What do Carys and Liam talk about? Put the topics in the right order.", ["Liam says how far it is to the waterfall.", "Carys says why she can't come in the morning.", "Liam says what Carys needs to bring."], { text: "h1" })
      ]),
      ...teil("B Reading", R ? [
        c("Where does Shona live?", ["in a small town in Scotland", "in a big city in Wales", "on a farm in England"], 0, { text: "t1" }),
        c("What do the dancers wear at a competition?", ["a kilt", "a helmet", "jeans and a T-shirt"], 0, { text: "t1" }),
        c("What did Shona win last summer?", ["her first medal", "a new kilt", "a trip to Elgin"], 0, { text: "t1" }),
        c("Why hasn't Shona tried the stone put?", ["The stones are too heavy for her.", "She doesn't like the Highland Games.", "Her granddad doesn't want her to."], 0, { text: "t1" }),
        c("How does Shona feel about the competition in Elgin?", ["She is a bit nervous.", "She is bored.", "She is angry."], 0, { text: "t1" }),
        z("In which line(s) does Shona say why Highland dancing isn't easy?", "t1", [[6, 6]], { hinweis: "Suche das Schlüsselwort aus der Frage (easy) im Text und lies dort genau." }),
        z("In which line(s) does Shona say what she is going to do next month?", "t1", [[15, 16]], { hinweis: "Suche die Wörter „next month“ im Text." }),
        f("Complete the notes about Shona. Write one word or a number.", [
          feld("Shona is … years old.", ["thirteen", "13"]),
          feld("She goes to dance classes … a week.", ["twice", "two times", "2 times"]),
          feld("Her teacher is Mrs …", ["Baird"])
        ], { text: "t1", tolerant: true }),
        a("Do you think Shona likes Highland dancing? Give one reason from the text. Answer in English.", [
          kr("ein passender Grund aus dem Text, dass Shona ihr Hobby mag", 1, "zum Beispiel: It's her favourite activity. / It's fun. / She has danced at a lot of Highland Games. / She won a medal. / She is going to practise every day. – Ein Nein mit „it isn't easy“ trifft den Text nicht (sie nennt es ihre Lieblingsbeschäftigung)."),
          kr("verständlich auf Englisch (Stichworte und Wörter aus dem Text genügen; Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
        ], "Yes, I think so. It's her favourite activity, and she is going to practise every day.", ["favourite|fun|love|like|medal|games|practise|practice|every day|competition"], { text: "t1", zeilen: [1, 16] })
      ] : [
        c("What is Highland dancing?", ["an old Scottish tradition", "a new sport from England", "a dance on the ice"], 0, { text: "t1" }),
        c("What happened last summer?", ["Shona won her first medal.", "Shona danced at a competition in Elgin.", "Shona's granddad bought her a kilt."], 0, { text: "t1" }),
        c("Who is Kyle?", ["Shona's brother", "Shona's dance teacher", "a man who plays the bagpipes"], 0, { text: "t1" }),
        z("In which line(s) does Shona say what dancers wear at a competition?", "t1", [[10, 11]], { hinweis: "Suche das Schlüsselwort aus der Frage (competition, wear) im Text und lies dort genau." }),
        z("In which line(s) does Shona say what she is going to do next month?", "t1", [[21, 23]], { hinweis: "Suche die Wörter „next month“ im Text." }),
        f("Complete the notes about Shona. Write one word or a number.", [
          feld("Shona started Highland dancing when she was …", ["seven", "7"]),
          feld("She has dance classes on Tuesdays and …", ["Fridays", "Friday"]),
          feld("Her granddad took about … photos of her.", ["a hundred", "one hundred", "100", "hundred"]),
          feld("More than … dancers are going to be at the competition in Elgin.", ["two hundred", "200", "two-hundred"])
        ], { text: "t1", tolerant: true }),
        a("Shona loves Highland dancing, but it isn't always easy for her. Give one thing that she likes about it and one thing that is hard or not so nice. Answer in English.", [
          kr("eine Sache, die Shona am Highland dancing gefällt", 1, "zum Beispiel: It's an old tradition. / She dances at competitions and Highland Games. / She won her first medal. / Her granddad came to watch. / Her teacher is great. / She wears a kilt, a man plays the bagpipes."),
          kr("eine Sache, die schwer oder nicht schön ist", 1, "zum Beispiel: You dance on your toes all the time. / You have to be strong and fit. / She is tired after a class. / She has to work hard. / She can't go to the cinema with her friends on Fridays. / She is nervous before the competition."),
          kr("verständlich auf Englisch (eigene Worte oder passende Wörter aus dem Text; Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
        ], "She likes the competitions – last summer she won her first medal. But it is hard: you dance on your toes, and after a class she is always tired.", ["tradition|competition|games|medal|granddad|kilt|bagpipes|teacher|love", "toes|strong|fit|tired|hard|cinema|friday|nervous"], { text: "t1", zeilen: [1, 24] })
      ]),
      ...teil("C Grammar and vocabulary", R ? [
        f("Plans for Saturday: Complete the sentences with am, is or are.", [
          feld("Tomorrow I … going to visit my grandma.", ["am"]),
          feld("My dad … going to drive us to the castle.", ["is"]),
          feld("We … going to have a picnic there.", ["are"]),
          feld("My friends … not going to come with us.", ["are"])
        ], { hinweis: "I → am · he, she, it → is · we, you, they → are – dann going to + Grundform." }),
        f("Complete the sentences with have or has and the past participle. Use: bought · done · packed · seen · visited", [
          feld("I (pack) … my bag.", ["have packed", "'ve packed", "’ve packed"]),
          feld("Mum (buy) … the tickets.", ["has bought", "'s bought", "’s bought"]),
          feld("We (see) … the castle on the hill.", ["have seen", "'ve seen", "’ve seen"]),
          feld("Ollie (do) … his homework.", ["has done", "'s done", "’s done"]),
          feld("My parents (visit) … Wales three times.", ["have visited", "'ve visited", "’ve visited"])
        ], { hinweis: "present perfect = have/has + 3. Form. he, she, it (Mum, Ollie) → has." }),
        m("Match the questions and the short answers.", [["Have you ever been to Scotland?", "Yes, I have."], ["Has your sister tidied her room?", "No, she hasn't."], ["Have your friends seen the film?", "Yes, they have."], ["Has your dad fed the cat?", "No, he hasn't."]],
          { hinweis: "In der Kurzantwort steht dasselbe Hilfsverb wie in der Frage (have oder has) und das passende Fürwort (I, she, he, they)." }),
        c("Choose the right form: Yesterday we … to the beach.", ["went", "have gone", "go"], 0, { hinweis: "yesterday, last …, … ago → simple past." }),
        c("Choose the right form: My friends have never … rugby.", ["played", "play", "plays"], 0, { hinweis: "have/has + 3. Form: play – played – played." }),
        c("Choose the right form: Last week my uncle … a new car.", ["bought", "has bought", "buys"], 0, { hinweis: "last week → simple past." }),
        c("Choose the right form: … you finished your homework yet? – No, not yet.", ["Have", "Did", "Do"], 0, { hinweis: "yet → present perfect: Have you …?" }),
        m("What do the words mean in German? Match them.", [["competition", "Wettkampf"], ["brave", "mutig"], ["tired", "müde"], ["careful", "vorsichtig"], ["to give up", "aufgeben"]])
      ] : [
        f("Plans for the weekend: Complete the sentences with going to and the verbs in brackets.", [
          feld("Tomorrow my family (visit) … a castle in North Wales.", ["is going to visit", "'s going to visit", "’s going to visit"]),
          feld("I (take) … lots of photos.", ["am going to take", "'m going to take", "’m going to take"]),
          feld("My brother (not / play) … football this weekend.", ["is not going to play", "isn't going to play", "isn’t going to play", "'s not going to play", "’s not going to play"]),
          feld("(you / bring) … your camera too? – Yes, I am.", ["are you going to bring"])
        ], { hinweis: "am / is / are + going to + Grundform. Verneinung: isn't / aren't / I'm not going to …" }),
        f("Before the trip: Complete the sentences with the present perfect of the verbs in brackets.", [
          feld("Mum (already / pack) … the bags.", ["has already packed", "'s already packed", "’s already packed"]),
          feld("I (just / make) … sandwiches for everybody.", ["have just made", "'ve just made", "’ve just made"]),
          feld("Dad (not / find) … the car keys yet.", ["has not found", "hasn't found", "hasn’t found"]),
          feld("My sister (never / be) … to Wales before.", ["has never been", "'s never been", "’s never been"]),
          feld("We (already / book) … a room in a small hotel.", ["have already booked", "'ve already booked", "’ve already booked"]),
          feld("You (not / see) … the castle yet. It's fantastic!", ["have not seen", "haven't seen", "haven’t seen"])
        ], { hinweis: "have/has + 3. Form; already, just, never stehen zwischen have/has und der 3. Form, yet am Satzende." }),
        f("An interview: Complete the questions and the short answers.", [
          feld("(you / ever / try) … the caber toss? – No, I haven't.", ["have you ever tried"]),
          feld("(your brother / ever / play) … rugby? – Yes, he has.", ["has your brother ever played"]),
          feld("Have your parents ever been to Scotland? – Yes, …", ["they have", "yes, they have", "yes they have"]),
          feld("Has your sister fed the cat yet? – No, …", ["she hasn't", "she has not", "she hasn’t", "no, she hasn't", "no she hasn't", "no, she has not", "no, she hasn’t"])
        ], { hinweis: "Frage: Have/Has + Person + ever + 3. Form. Kurzantwort: Yes, they have. / No, she hasn't." }),
        f("Present perfect or simple past? Complete the sentences with the right form of the verbs in brackets.", [
          feld("We (go) … to Scotland last summer.", ["went"]),
          feld("I (never / see) … a real kilt.", ["have never seen", "'ve never seen", "’ve never seen"]),
          feld("Two days ago my cousin (win) … a dancing competition.", ["won"]),
          feld("(you / tidy) … your room yet? – No, not yet.", ["have you tidied"])
        ], { hinweis: "last …, … ago, yesterday → simple past. never, ever, already, yet → present perfect." }),
        m("Find the opposites. Match the adjectives.", [["dangerous", "safe"], ["boring", "exciting"], ["difficult", "easy"], ["fast", "slow"]])
      ]),
      ...teil("D Mediation", [
        R ? a("You are on holiday in Wales with your grandma, your little brother Alfie (5 years old) and your dog. Your grandma doesn't speak English. She asks you questions about this programme. Answer her questions in German. (Beantworte die Fragen deiner Oma auf Deutsch – kurze Sätze genügen.)", [
          kr("Show mit der Schlacht: um 10.30 Uhr", 1, "halb elf oder 10.30 Uhr"),
          kr("um 12 Uhr: walisische Musik und Tanz (in der großen Halle)", 1, "Musik und Tanz genügen"),
          kr("Alfie darf nicht beim Quiz mitmachen – erst ab 6 Jahren (Kinder von 6 bis 12)", 1, "Nein mit Grund (zu jung / erst ab 6)"),
          kr("Eintritt für alle drei: 13 Pfund (Oma 9 Pfund, du 4 Pfund, Alfie frei)", 2, "2 Punkte: 13 Pfund oder alle drei Preise richtig zusammengezählt · 1 Punkt: die Einzelpreise richtig, aber nicht oder falsch zusammengezählt; Pfund, nicht Euro"),
          kr("Hunde sind in der Burg nicht erlaubt", 1),
          kr("Essen: Café den ganzen Tag (Sandwiches, Suppe, Kuchen) oder Picknick im Garten", 1, "eines genügt"),
          kr(SM + " (auf Deutsch, verständlich für die Oma)", 1)
        ], "1. Die Show mit der Schlacht beginnt um 10.30 Uhr. 2. Um 12 Uhr gibt es walisische Musik und Tanz. 3. Nein, beim Quiz dürfen erst Kinder ab 6 mitmachen. 4. Du zahlst 9 Pfund, ich 4 Pfund und Alfie nichts – zusammen 13 Pfund. 5. Nein, Hunde dürfen nicht in die Burg. 6. Ja, das Café hat den ganzen Tag offen, und wir dürfen auch im Garten picknicken.",
        ["10.30|10:30|halb elf", "musik|tanz", "6|sechs|jung", "13|dreizehn", "hund", "café|cafe|picknick|suppe|sandwich"],
        { vorgabe: A_PROGRAMM, teile: [
          { label: "„Wann beginnt die Show mit der Schlacht?“", hilfe: "Die Show beginnt um …" },
          { label: "„Was gibt es um 12 Uhr?“", hilfe: "Um 12 Uhr gibt es …" },
          { label: "„Darf Alfie beim Quiz mitmachen? Er ist fünf.“", hilfe: "Ja / Nein, …" },
          { label: "„Was kostet der Eintritt für uns drei?“", hilfe: "Du zahlst …, ich …, Alfie … – zusammen …" },
          { label: "„Dürfen wir unseren Hund mitnehmen?“", hilfe: "Ja / Nein, …" },
          { label: "„Können wir dort etwas essen?“", hilfe: "Ja, …" }
        ] })
        : a("You are on holiday in Wales with your grandma and your little brother Alfie (5 years old). Your grandma doesn't speak English. She has found this programme and wants to know: What can we see and do there, and when? · What does it cost for the three of us? · Can Alfie do everything? · Where can we eat? Tell her the important things in German (4 to 6 sentences). Do not translate word for word.", [
          kr("Programm mit Uhrzeit: Schlacht-Show 10.30 Uhr, Musik und Tanz 12 Uhr, Quiz für Kinder 14 Uhr, Turmführung 15.30 Uhr", 2, "2 Punkte: mindestens drei Programmpunkte mit Uhrzeit · 1 Punkt: zwei Programmpunkte mit Uhrzeit oder mehrere ohne Uhrzeit"),
          kr("Eintritt für alle drei: 13 Pfund (Oma 9 Pfund, du 4 Pfund, Alfie frei)", 2, "2 Punkte: 13 Pfund oder alle drei Preise richtig · 1 Punkt: Einzelpreise richtig, aber nicht oder falsch zusammengezählt; Pfund, nicht Euro"),
          kr("Alfie (5) kann nicht alles: Quiz erst ab 6, Turm erst ab 6", 2, "2 Punkte: Quiz und Turm · 1 Punkt: eines davon"),
          kr("Essen: Café den ganzen Tag oder Picknick im Garten", 1, "eines genügt"),
          kr(SM + " (Hunde, Aufzug, Blick aufs Meer sind nicht gefragt)", 1)
        ], "Um 10.30 Uhr gibt es eine Show mit einer Schlacht wie im 13. Jahrhundert, um 12 Uhr walisische Musik und Tanz, um 14 Uhr ein Quiz für Kinder und um 15.30 Uhr eine Führung auf den Turm. Für uns drei kostet es 13 Pfund: du zahlst 9 Pfund, ich 4 Pfund, und Alfie ist frei. Alfie darf aber beim Quiz und auf dem Turm noch nicht mitmachen, das geht erst ab 6. Essen können wir im Café oder bei einem Picknick im Garten.",
        ["10.30|10:30|halb elf|schlacht|kampf", "12|musik|tanz", "quiz|14|turm|15.30", "13|dreizehn|9|neun", "6|sechs|jung|nicht", "café|cafe|picknick"],
        { vorgabe: A_PROGRAMM }),
        a(R ? "Your grandma wants to know two things. Ask the man at the ticket desk in English. (Stelle die zwei Fragen auf Englisch.)" : "Your grandma wants to know two things. Ask the man at the ticket desk in English.", [
          kr("fragt, ob man oben auf dem Turm fotografieren darf", 1, "Can we take photos on the tower? / Is it OK to take pictures at the top of the tower?" + FRAGE),
          kr("fragt, wo die Toiletten sind", 1, "Where are the toilets, please?" + FRAGE)
        ], "Excuse me, can we take photos at the top of the tower? And where are the toilets, please?", ["photo|picture|foto", "toilet|loo|bathroom|wc"],
        { vorgabe: A_OMA, ...(R ? { hilfe: "Can we … ? · Where are … ?" } : {}) })
      ]),
      ...teil("E Writing", [
        s(R ? "My favourite activity: Your new e-friend Nia from Wales wants to know about your free time. Write an e-mail to her (40 to 70 words). Use the plan. Write about: your favourite activity and why you like it · where and how often you do it · something you have already done or have never done (I have … / I have never …) · what you are going to do next weekend (I'm going to …) · a question to Nia. (Schreibe eine E-Mail mit 40 bis 70 Wörtern.)"
          : "My favourite activity: Your new e-friend Nia from Wales wants to know what you do in your free time. Write an e-mail to her (60 to 100 words). Write about: your favourite activity and why you like it · where and how often you do it · something you have already done or have never done (present perfect) · what you are going to do next weekend or in the holidays (going to) · a question to Nia about her free time.", [
          kr("Inhalt", 5, "alle fünf Punkte des Auftrags – je Punkt 1: Lieblingsaktivität mit Grund (because …) · wo und wie oft · etwas, das man schon getan oder noch nie getan hat · was man am nächsten Wochenende" + (R ? "" : " oder in den Ferien") + " vorhat · eine Frage an Nia (die Zeitform bewertet die Zeile Grammatik)"),
          kr("Textsorte und Aufbau", 2, "E-Mail an eine Freundin: Anrede (Hi Nia / Dear Nia), sinnvolle Reihenfolge, Schluss (Write soon! / Bye / Best wishes) und Name; Sätze verbunden (and, but, because)"),
          kr("Grammatik", 3, "present perfect (I have already … / I have never … – have/has + 3. Form) und going to (I'm going to …) erkennbar richtig gebildet, simple present für Gewohnheiten (he/she/it mit s); Fehler stören das Verstehen kaum" + (R ? "; in R7 genügen kurze, einfache Sätze" : "")),
          kr("Wortschatz", 2, "passende Wörter der Unit für Freizeit und Abenteuer (exciting, fun, dangerous, safe, difficult, easy, fast, strong, fit, tired, careful, competition, adventure, already, never, ever, twice a week, occasionally …), nicht nur nice und good"),
          kr("Rechtschreibung", 2, "häufige Wörter und die Wörter der Unit sind meist richtig geschrieben", { rs: true })
        ], { minWoerter: R ? 30 : 50, plan: R ? [
          { id: "start", label: "Start", hilfe: "Hi Nia, my name is … I'm … years old." },
          { id: "activity", label: "What is your favourite activity? Why?", hilfe: "My favourite activity is swimming / football / riding my bike … I like it because it's fun / exciting." },
          { id: "where", label: "Where and how often?", hilfe: "I do it at the sports club / in the park … every Saturday / twice a week." },
          { id: "done", label: "What have you already done? What have you never done?", hilfe: "I have already won a medal / climbed a big rock … · I have never …" },
          { id: "plans", label: "What are you going to do next weekend?", hilfe: "Next weekend I'm going to …" },
          { id: "question", label: "Ask Nia a question.", hilfe: "What do you do in your free time? / Have you ever …?" },
          { id: "end", label: "End", hilfe: "Write soon! Bye, …" }
        ] : [
          { id: "start", label: "Start", hilfe: "Hi Nia, …" },
          { id: "activity", label: "My favourite activity – why?", hilfe: "exciting, fun, not dangerous …" },
          { id: "where", label: "Where? How often?", hilfe: "club, park, mountains … · twice a week, occasionally …" },
          { id: "done", label: "Already done / never done", hilfe: "I have already … · I have never …" },
          { id: "plans", label: "Next weekend / in the holidays", hilfe: "I'm going to …" },
          { id: "question", label: "Question to Nia", hilfe: "What …? / Have you ever …?" },
          { id: "end", label: "End", hilfe: "Write soon! …" }
        ] })
      ])
    ]
  });
}

/* ====================================================== Variante B ====================================================== */

const B_HOEREN = hoertext("h1", "A boat trip to the island", "Listening: two friends on the phone", [
  ["Morven", "Hello, Morven speaking."],
  ["Rory", "Hi Morven, it's Rory. Have you got a minute?"],
  ["Morven", "Sure. What's up?"],
  ["Rory", "On Sunday my dad and I are going to take the boat to the little island near our town. Would you like to come with us?"],
  ["Morven", "A boat trip? I'd love to! I've never been on a boat."],
  ["Rory", "Really? It's great. I've done the trip three times. The boat leaves the harbour at ten past eleven, and the trip takes about forty minutes."],
  ["Morven", "And what can you do on the island?"],
  ["Rory", "There's an old castle from the thirteenth century, and you can see lots of birds there."],
  ["Morven", "Cool! How much is a ticket?"],
  ["Rory", "It's eight pounds for adults and five pounds for children. But don't worry – my dad has already bought a ticket for you."],
  ["Morven", "That's really kind! But I must ask my mum first. And on Sunday mornings I usually help my grandpa in his garden."],
  ["Rory", "Can't you help him on Saturday?"],
  ["Morven", "Maybe. I'm going to ask him. Where shall we meet?"],
  ["Rory", "Let's meet in front of the harbour café at a quarter to eleven."],
  ["Morven", "OK. What should I bring?"],
  ["Rory", "A warm jacket – it's often cold and windy on the boat. And bring some sandwiches, because there isn't a shop on the island."],
  ["Morven", "All right. I'm going to call my mum now. Bye, Rory!"],
  ["Rory", "Bye! See you on Sunday, I hope!"]
], { stimmen: { Morven: "en-GB-SoniaNeural", Rory: "en-GB-RyanNeural" }, mal: 2 });

const B_LESEN = {
  M: text("t1", "My favourite activity: pony trekking", "Blog post", [
    "Hello! My name is Ifan, I'm twelve, and I live on a farm near Bryndu, a small village in the mountains of Wales. My favourite activity is pony trekking. That means you ride a pony on long paths through the hills.",
    "My parents have got six Welsh mountain ponies. In summer, tourists come to our farm for trekking tours, and every Saturday I help my dad. Before a tour, I feed the ponies and clean them. Pony trekking isn't dangerous if you're careful: every rider must wear a helmet, and on our tours the ponies always walk slowly. They never run.",
    "I learned to ride when I was five. My favourite pony is called Seren – that's the Welsh word for 'star'. She's small and brown, and she's very brave. Last year she carried me across a river in a storm. That was really exciting!",
    "I have been to the top of Moel Fach, the big hill behind our farm, many times. The view is fantastic: on a clear day you can see the sea. But I have never been up there at night.",
    "The only thing I don't like is getting up early at the weekend. The ponies are always hungry at six o'clock!",
    "In the summer holidays my cousin Moira from London is going to stay with us. She has never been on a pony, so I'm going to teach her. I'm sure she's going to love it."
  ]),
  R: text("t1", "My favourite activity: pony trekking", "Blog post", [
    "Hello! I'm Ifan, I'm twelve, and I live on a farm in the mountains of Wales. My favourite activity is pony trekking. You ride a pony on long paths through the hills.",
    "My parents have got six ponies. In summer, tourists come to our farm for trekking tours. Every Saturday I help my dad. Before a tour, I feed the ponies and clean them.",
    "Pony trekking isn't dangerous if you're careful. Every rider must wear a helmet, and the ponies always walk slowly.",
    "My favourite pony is called Seren. That's the Welsh word for 'star'. She's small and brown, and she's very brave.",
    "I have been to the top of the big hill near our farm many times. On a clear day you can see the sea from there!",
    "In the summer holidays my cousin from London is going to stay with us. She has never been on a pony, so I'm going to teach her to ride."
  ])
};

const B_PROGRAMM = "CAIRNBRAE SNOW CENTRE – WINTER FUN\nEvery weekend in January and February, 9 a.m. to 4 p.m.\n\nSki lessons for beginners (people who can't ski yet): 10 a.m. and 1.30 p.m., 2 hours – adults £20 · children (6 years and older) £12\nSnow tubing: sit in a big ring and go down the hill – fast and exciting! £5 · only for children 8 years and older\nSledging hill: free for everybody. Bring your own sledge or rent one for £3.\nRent skis, boots and a helmet: adults £15 a day · children £10 a day\n\nCafé: hot soup, sandwiches and hot chocolate – open all day\nPlease bring: warm clothes, gloves and sunglasses – the sun is strong in the snow!\nBus: from the town centre every hour. The last bus back leaves at 4.30 p.m.";
const B_PAPA = "👨 Papa: „Frag bitte die Frau an der Kasse, wo wir die Ski bekommen und ob Elsie auch einen Helm braucht.“";

function fassungB(zug) {
  const R = zug === "R";
  return probe7(2, zug, "B", {
    title: TITEL(zug), kurz: "Unit 2", scope: SCOPE, minutes: 90, hinweis: HINWEIS,
    texte: [B_HOEREN, B_LESEN[zug]],
    items: [
      ...teil("A Listening", R ? [
        c("Where are Rory and his dad going on Sunday?", ["to a little island", "to the mountains", "to a lake"], 0, { text: "h1" }),
        c("Has Morven been on a boat before?", ["No, never.", "Yes, once.", "Yes, three times."], 0, { text: "h1" }),
        c("When does the boat leave the harbour?", ["at ten past eleven", "at a quarter to eleven", "at ten to eleven"], 0, { text: "h1" }),
        c("What can you see on the island?", ["an old castle", "a big zoo", "a famous museum"], 0, { text: "h1" }),
        c("How much do children pay for the boat?", ["five pounds", "eight pounds", "nine pounds"], 0, { text: "h1" }),
        c("What does Morven usually do on Sunday mornings?", ["She helps her grandpa in the garden.", "She goes swimming.", "She tidies her room."], 0, { text: "h1" }),
        c("Where do Morven and Rory want to meet?", ["in front of the harbour café", "at the bus stop", "at Rory's house"], 0, { text: "h1" }),
        c("Why does Morven need a warm jacket?", ["It is often cold and windy on the boat.", "It is going to snow.", "The castle is very cold."], 0, { text: "h1" }),
        c("Why should Morven bring sandwiches?", ["There isn't a shop on the island.", "The café is closed on Sundays.", "The boat trip takes three hours."], 0, { text: "h1" }),
        o("What do Morven and Rory talk about? Put the topics in the right order.", ["Rory says how long the boat trip takes.", "Morven says that she must ask her mum.", "Rory says what Morven should bring."], { text: "h1" })
      ] : [
        c("Where are Rory and his dad going on Sunday?", ["to a little island", "to the mountains", "to a lake in the hills"], 0, { text: "h1" }),
        c("What can you see on the island?", ["an old castle and lots of birds", "a big zoo and a beach", "a famous museum and a shop"], 0, { text: "h1" }),
        c("Who has bought a ticket for Morven?", ["Rory's dad", "Morven's mum", "Morven's grandpa"], 0, { text: "h1" }),
        c("What does Morven usually do on Sunday mornings?", ["She helps her grandpa in the garden.", "She goes swimming with her mum.", "She tidies her room."], 0, { text: "h1" }),
        f("Listen again and complete the notes. Write one word or a number.", [
          feld("The boat leaves the harbour at …", ["ten past eleven", "11.10", "11:10", "10 past 11", "eleven ten", "11.10 am", "11.10 a.m."]),
          feld("The boat trip takes about … minutes.", ["forty", "40"]),
          feld("Rory has done the trip … times.", ["three", "3"]),
          feld("Place to meet: in front of the harbour …", ["café", "cafe"]),
          feld("Morven must bring a warm jacket and some …", ["sandwiches", "sandwich"])
        ], { text: "h1", tolerant: true, hinweis: "Lies vor dem Hören die Notizen: Dann weißt du, auf welche Zahl oder welches Wort du achten musst." }),
        o("What do Morven and Rory talk about? Put the topics in the right order.", ["Rory says how long the boat trip takes.", "Morven says that she must ask her mum.", "Rory says what Morven should bring."], { text: "h1" })
      ]),
      ...teil("B Reading", R ? [
        c("Where does Ifan live?", ["on a farm in Wales", "in a big town in Scotland", "near the sea in England"], 0, { text: "t1" }),
        c("Who comes to the farm in summer?", ["tourists", "Ifan's teachers", "a famous rider"], 0, { text: "t1" }),
        c("What does Ifan do before a tour?", ["He feeds the ponies and cleans them.", "He buys new helmets.", "He rides to the top of the hill."], 0, { text: "t1" }),
        c("What is Seren like?", ["small, brown and brave", "big, black and fast", "old, white and tired"], 0, { text: "t1" }),
        c("What is Ifan's plan for the summer holidays?", ["teach his cousin to ride", "visit his cousin in London", "buy a new pony"], 0, { text: "t1" }),
        z("In which line(s) does Ifan say what he does every Saturday?", "t1", [[5, 6]], { hinweis: "Suche das Schlüsselwort aus der Frage (Saturday) im Text und lies dort genau." }),
        z("In which line(s) does Ifan say what you can see from the top of the hill?", "t1", [[11, 12]], { hinweis: "Suche die Wörter „top of the hill“ im Text." }),
        f("Complete the notes about Ifan. Write one word or a number.", [
          feld("Ifan is … years old.", ["twelve", "12"]),
          feld("His parents have got … ponies.", ["six", "6"]),
          feld("Seren is the Welsh word for …", ["star", "a star"])
        ], { text: "t1", tolerant: true }),
        a("Is pony trekking on Ifan's farm safe? Give one reason from the text. Answer in English.", [
          kr("ein passender Grund aus dem Text", 1, "Every rider must wear a helmet. / The ponies always walk slowly. – eines genügt; „Seren is brave“ allein trifft die Frage nicht"),
          kr("verständlich auf Englisch (Stichworte und Wörter aus dem Text genügen; Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
        ], "Yes, it is safe. Every rider must wear a helmet, and the ponies walk slowly.", ["helmet|slow|walk|careful"], { text: "t1", zeilen: [7, 8] })
      ] : [
        c("What is pony trekking?", ["You ride a pony on long paths through the hills.", "You race with ponies on the beach.", "You show your pony at a competition."], 0, { text: "t1" }),
        c("Why is Seren special for Ifan?", ["She carried him across a river in a storm.", "She is the fastest pony on the farm.", "She was a present from his grandma."], 0, { text: "t1" }),
        c("Who is Moira?", ["Ifan's cousin from London", "a tourist from Scotland", "Ifan's riding teacher"], 0, { text: "t1" }),
        z("In which line(s) does Ifan say what he does before a tour?", "t1", [[7, 8]], { hinweis: "Suche das Schlüsselwort aus der Frage (before a tour) im Text und lies dort genau." }),
        z("In which line(s) does Ifan say what he doesn't like?", "t1", [[18, 19]], { hinweis: "Suche die Wörter „don't like“ im Text." }),
        f("Complete the notes about Ifan. Write one word or a number.", [
          feld("Ifan's parents have got … ponies.", ["six", "6"]),
          feld("Ifan learned to ride when he was …", ["five", "5"]),
          feld("Seren is the Welsh word for …", ["star", "a star"]),
          feld("From the top of Moel Fach you can see the … on a clear day.", ["sea"])
        ], { text: "t1", tolerant: true }),
        a("Why is pony trekking on Ifan's farm not dangerous? Give two things from the text. Answer in English.", [
          kr("Helm: Jeder Reiter muss einen Helm tragen", 1, "Every rider must wear a helmet. – sinngemäß"),
          kr("Die Ponys gehen immer langsam, sie rennen nie", 1, "The ponies always walk slowly. / They never run. – eines genügt"),
          kr("verständlich auf Englisch (eigene Worte oder passende Wörter aus dem Text; Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
        ], "Every rider must wear a helmet, and the ponies always walk slowly – they never run.", ["helmet", "slow|walk|run"], { text: "t1", zeilen: [8, 10] })
      ]),
      ...teil("C Grammar and vocabulary", R ? [
        f("Plans for the weekend: Complete the sentences with am, is or are.", [
          feld("Next Saturday my friends … going to play rugby in the park.", ["are"]),
          feld("I … going to watch them.", ["am"]),
          feld("My sister … not going to come – she's ill.", ["is"]),
          feld("… you going to come too?", ["are"])
        ], { hinweis: "I → am · he, she, it → is · we, you, they → are – dann going to + Grundform." }),
        f("Complete the sentences with have or has and the past participle. Use: cleaned · fed · made · taken · washed", [
          feld("I (feed) … the dog.", ["have fed", "'ve fed", "’ve fed"]),
          feld("Dad (wash) … the car.", ["has washed", "'s washed", "’s washed"]),
          feld("My brothers (clean) … the kitchen.", ["have cleaned", "'ve cleaned", "’ve cleaned"]),
          feld("Grandma (make) … a cake for us.", ["has made", "'s made", "’s made"]),
          feld("We (take) … the rubbish out.", ["have taken", "'ve taken", "’ve taken"])
        ], { hinweis: "present perfect = have/has + 3. Form. he, she, it (Dad, Grandma) → has." }),
        m("Match the questions and the short answers.", [["Have you ever played rugby?", "No, I haven't."], ["Has your brother been to Wales?", "Yes, he has."], ["Have your parents booked the hotel?", "No, they haven't."], ["Has your mum seen the castle?", "Yes, she has."]],
          { hinweis: "In der Kurzantwort steht dasselbe Hilfsverb wie in der Frage (have oder has) und das passende Fürwort (I, she, he, they)." }),
        c("Choose the right form: Last Sunday I … my grandma.", ["visited", "have visited", "visit"], 0, { hinweis: "last Sunday → simple past." }),
        c("Choose the right form: We … the new film yet.", ["haven't seen", "didn't see", "don't see"], 0, { hinweis: "yet → present perfect: haven't + 3. Form." }),
        c("Choose the right form: My cousins … to our house three days ago.", ["came", "have come", "come"], 0, { hinweis: "… ago → simple past." }),
        c("Choose the right form: Has your dad … the tickets yet?", ["bought", "buy", "buyed"], 0, { hinweis: "has + 3. Form: buy – bought – bought." }),
        m("What do the words mean in German? Match them.", [["adventure", "Abenteuer"], ["heavy", "schwer"], ["to book", "buchen"], ["safe", "ungefährlich"], ["still", "immer noch"]])
      ] : [
        f("Plans for the holidays: Complete the sentences with going to and the verbs in brackets.", [
          feld("Next week we (stay) … with my aunt in Scotland.", ["are going to stay", "'re going to stay", "’re going to stay"]),
          feld("My aunt (show) … us the Highlands.", ["is going to show", "'s going to show", "’s going to show"]),
          feld("I (not / forget) … my camera this time!", ["am not going to forget", "'m not going to forget", "’m not going to forget"]),
          feld("What (you / do) … in the holidays?", ["are you going to do"])
        ], { hinweis: "am / is / are + going to + Grundform. Verneinung: I'm not / isn't / aren't going to …" }),
        f("Getting ready for the party: Complete the sentences with the present perfect of the verbs in brackets.", [
          feld("We (already / clean) … the living room.", ["have already cleaned", "'ve already cleaned", "’ve already cleaned"]),
          feld("Grandma (just / make) … a big cake.", ["has just made", "'s just made", "’s just made"]),
          feld("I (not / buy) … the drinks yet.", ["have not bought", "haven't bought", "haven’t bought"]),
          feld("Hugo (never / help) … in the kitchen before.", ["has never helped", "'s never helped", "’s never helped"]),
          feld("My parents (already / take) … the chairs into the garden.", ["have already taken", "'ve already taken", "’ve already taken"]),
          feld("Sara (not / finish) … the shopping list yet.", ["has not finished", "hasn't finished", "hasn’t finished"])
        ], { hinweis: "have/has + 3. Form; already, just, never stehen zwischen have/has und der 3. Form, yet am Satzende." }),
        f("Questions about the holidays: Complete the questions and the short answers.", [
          feld("(you / ever / sleep) … in a tent? – Yes, I have.", ["have you ever slept"]),
          feld("(Elspeth / ever / hear) … bagpipes? – No, she hasn't.", ["has Elspeth ever heard"]),
          feld("Have you finished your homework yet? – Yes, …", ["I have", "yes, I have", "yes I have"]),
          feld("Has your dad washed the car yet? – No, …", ["he hasn't", "he has not", "he hasn’t", "no, he hasn't", "no he hasn't", "no, he has not", "no, he hasn’t"])
        ], { hinweis: "Frage: Have/Has + Person + ever + 3. Form. Kurzantwort: Yes, I have. / No, he hasn't." }),
        f("Present perfect or simple past? Complete the sentences with the right form of the verbs in brackets.", [
          feld("Yesterday I (meet) … my friends at the skate park.", ["met"]),
          feld("I (already / do) … my homework.", ["have already done", "'ve already done", "’ve already done"]),
          feld("Last weekend my uncle (take) … us to an old castle.", ["took"]),
          feld("(your sister / ever / be) … to Wales? – Yes, she has.", ["has your sister ever been"])
        ], { hinweis: "last …, … ago, yesterday → simple past. never, ever, already, yet → present perfect." }),
        m("Jobs around the house: Which words go together?", [["to feed", "the dog"], ["to tidy", "your room"], ["to make", "your bed"], ["to do", "your homework"]])
      ]),
      ...teil("D Mediation", [
        R ? a("You are on a winter holiday in Scotland with your dad and your little sister Elsie (7 years old). Your dad doesn't speak English. He asks you questions about this programme. Answer his questions in German. (Beantworte die Fragen deines Vaters auf Deutsch – kurze Sätze genügen.)", [
          kr("Skikurse: um 10 Uhr und um 13.30 Uhr", 1, "beide Zeiten; halb zwei gilt"),
          kr("Skikurs für alle drei: 44 Pfund (Papa 20 Pfund, du und Elsie je 12 Pfund)", 2, "2 Punkte: 44 Pfund oder alle drei Preise richtig zusammengezählt · 1 Punkt: die Einzelpreise richtig, aber nicht oder falsch zusammengezählt; Pfund, nicht Euro"),
          kr("Elsie darf nicht zum Snowtubing – erst ab 8 Jahren", 1, "Nein mit Grund (zu jung / erst ab 8)"),
          kr("Schlittenfahren ist kostenlos (einen Schlitten leihen kostet 3 Pfund)", 1, "kostenlos genügt"),
          kr("mitbringen: warme Kleidung, Handschuhe, Sonnenbrille", 1, "mindestens zwei davon"),
          kr("der letzte Bus zurück fährt um 16.30 Uhr", 1, "halb fünf gilt"),
          kr(SM + " (auf Deutsch, verständlich für den Vater)", 1)
        ], "1. Die Skikurse fangen um 10 Uhr und um 13.30 Uhr an. 2. Du zahlst 20 Pfund, Elsie und ich je 12 Pfund – zusammen 44 Pfund. 3. Nein, Snowtubing geht erst ab 8 Jahren. 4. Schlittenfahren kostet nichts, nur ein Schlitten zum Leihen kostet 3 Pfund. 5. Warme Kleidung, Handschuhe und eine Sonnenbrille. 6. Der letzte Bus fährt um 16.30 Uhr zurück.",
        ["10|zehn|13.30|13:30|halb zwei", "44|vierundvierzig", "8|acht|jung", "kostenlos|nichts|frei|gratis", "kleidung|handschuh|sonnenbrille", "16.30|16:30|halb fünf|halb fuenf"],
        { vorgabe: B_PROGRAMM, teile: [
          { label: "„Wann fangen die Skikurse an?“", hilfe: "Die Skikurse fangen um … an." },
          { label: "„Was kostet der Skikurs für uns drei?“", hilfe: "Du zahlst …, Elsie und ich … – zusammen …" },
          { label: "„Darf Elsie zum Snowtubing? Sie ist sieben.“", hilfe: "Ja / Nein, …" },
          { label: "„Was kostet das Schlittenfahren?“", hilfe: "Schlittenfahren kostet …" },
          { label: "„Was müssen wir mitbringen?“", hilfe: "Wir brauchen …" },
          { label: "„Wann fährt der letzte Bus zurück?“", hilfe: "Der letzte Bus fährt um …" }
        ] })
        : a("You are on a winter holiday in Scotland with your dad and your little sister Elsie (7 years old). Your dad doesn't speak English. He has found this programme and wants to know: When are the ski lessons, and what do they cost for the three of us? · What can Elsie do there? · What do we need to bring? · How do we get back to the town? Tell him the important things in German (4 to 6 sentences). Do not translate word for word.", [
          kr("Skikurse: um 10 Uhr und um 13.30 Uhr, je zwei Stunden", 1, "beide Zeiten"),
          kr("Skikurs für alle drei: 44 Pfund (Papa 20 Pfund, du und Elsie je 12 Pfund)", 2, "2 Punkte: 44 Pfund oder alle drei Preise richtig · 1 Punkt: Einzelpreise richtig, aber nicht oder falsch zusammengezählt; Pfund, nicht Euro"),
          kr("Elsie (7): Skikurs und Schlittenfahren (kostenlos) ja, Snowtubing nein – erst ab 8", 2, "2 Punkte: Snowtubing nicht und eine Sache, die sie machen kann · 1 Punkt: nur eines davon"),
          kr("mitbringen: warme Kleidung, Handschuhe, Sonnenbrille", 1, "mindestens zwei davon"),
          kr("zurück mit dem Bus ins Zentrum, der letzte fährt um 16.30 Uhr", 1, "Bus und Uhrzeit"),
          kr(SM + " (Café, Preise für Skiausleihe sind nicht gefragt)", 1)
        ], "Die Skikurse für Anfänger sind um 10 Uhr und um 13.30 Uhr und dauern zwei Stunden. Für uns drei kosten sie 44 Pfund: du zahlst 20 Pfund, Elsie und ich je 12 Pfund. Elsie kann also beim Skikurs mitmachen und kostenlos Schlitten fahren, aber zum Snowtubing ist sie noch zu jung – das geht erst ab 8. Wir brauchen warme Kleidung, Handschuhe und Sonnenbrillen. Zurück in die Stadt fährt jede Stunde ein Bus, der letzte um 16.30 Uhr.",
        ["10|zehn|13.30|13:30|halb zwei", "44|vierundvierzig|20|zwanzig|12|zwölf", "schlitten|snowtubing|tubing|8|acht", "kleidung|handschuh|sonnenbrille", "bus", "16.30|16:30|halb fünf"],
        { vorgabe: B_PROGRAMM }),
        a(R ? "Your dad wants to know two things. Ask the woman at the desk in English. (Stelle die zwei Fragen auf Englisch.)" : "Your dad wants to know two things. Ask the woman at the desk in English.", [
          kr("fragt, wo man die Ski bekommt (leihen kann)", 1, "Where can we get / rent the skis?" + FRAGE),
          kr("fragt, ob Elsie auch einen Helm braucht", 1, "Does Elsie need a helmet too?" + FRAGE)
        ], "Excuse me, where can we get the skis? And does Elsie need a helmet too?", ["ski", "helmet|helm"],
        { vorgabe: B_PAPA, ...(R ? { hilfe: "Where can we … ? · Does Elsie … ?" } : {}) })
      ]),
      ...teil("E Writing", [
        s(R ? "Let's meet! Your friend Finlay from Scotland is going to stay with you next weekend. Write a message to him (40 to 70 words). Use the plan. Write about: what you are going to do together on Saturday (We're going to …) · when and where you are going to meet · what he needs to bring · something you have already done or haven't done yet for his visit (I have already … / I haven't … yet) · a question: “Have you ever …?” (Schreibe eine Nachricht mit 40 bis 70 Wörtern.)"
          : "Let's meet! Your friend Finlay from Scotland is going to stay with you next weekend. Write a message to him (60 to 100 words). Write about: what you are going to do together on Saturday and why it's fun (going to) · when and where you are going to meet · what he needs to bring · something you have already done or haven't done yet for his visit (present perfect) · a question with “Have you ever …?”", [
          kr("Inhalt", 5, "alle fünf Punkte des Auftrags – je Punkt 1: was ihr am Samstag vorhabt" + (R ? "" : " (mit Grund, warum es Spaß macht)") + " · Uhrzeit und Treffpunkt · was Finlay mitbringen soll · etwas, das man für den Besuch schon getan oder noch nicht getan hat · eine Frage mit Have you ever …? (die Zeitform bewertet die Zeile Grammatik)"),
          kr("Textsorte und Aufbau", 2, "Nachricht an einen Freund: Anrede (Hi Finlay), sinnvolle Reihenfolge, Schluss (See you on Saturday! / Bye) und Name; Sätze verbunden (and, but, because)"),
          kr("Grammatik", 3, "going to (We're going to …) und present perfect (I have already … / I haven't … yet, Have you ever …? – have/has + 3. Form) erkennbar richtig gebildet; Fehler stören das Verstehen kaum" + (R ? "; in R7 genügen kurze, einfache Sätze" : "")),
          kr("Wortschatz", 2, "passende Wörter der Unit für Freizeit, Verabredung und Hausarbeiten (exciting, fun, adventure, to book, to pack, to tidy, already, yet, ever, See you later, at half past …, in front of …), nicht nur nice und good"),
          kr("Rechtschreibung", 2, "häufige Wörter und die Wörter der Unit sind meist richtig geschrieben", { rs: true })
        ], { minWoerter: R ? 30 : 50, plan: R ? [
          { id: "start", label: "Start", hilfe: "Hi Finlay, I'm happy that you're going to visit me!" },
          { id: "plan", label: "What are you going to do on Saturday?", hilfe: "On Saturday we're going to go swimming / play football / ride our bikes to …" },
          { id: "meet", label: "When and where are you going to meet?", hilfe: "Let's meet at the station / in front of … at ten o'clock / at half past two." },
          { id: "bring", label: "What does Finlay need to bring?", hilfe: "Please bring your bike / your swimming things / a warm jacket." },
          { id: "done", label: "What have you already done? What haven't you done yet?", hilfe: "I have already tidied my room / booked the tickets … · I haven't … yet." },
          { id: "question", label: "Ask Finlay a question.", hilfe: "Have you ever … ?" },
          { id: "end", label: "End", hilfe: "See you on Saturday! Bye, …" }
        ] : [
          { id: "start", label: "Start", hilfe: "Hi Finlay, …" },
          { id: "plan", label: "Saturday – what and why?", hilfe: "We're going to … because it's exciting / fun …" },
          { id: "meet", label: "When and where?", hilfe: "Let's meet at … at …" },
          { id: "bring", label: "What to bring", hilfe: "Don't forget …" },
          { id: "done", label: "Already done / not done yet", hilfe: "I have already … · I haven't … yet." },
          { id: "question", label: "Have you ever …?", hilfe: "Have you ever … ?" },
          { id: "end", label: "End", hilfe: "See you on Saturday! …" }
        ] })
      ])
    ]
  });
}

const p2ra = fassungA("R"), p2ma = fassungA("M"), p2rb = fassungB("R"), p2mb = fassungB("M");
module.exports = { p2ra, p2rb, p2ma, p2mb };
