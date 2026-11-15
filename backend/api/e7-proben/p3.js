"use strict";

/**
 * Englisch 7 · Probe 3: Unit 3 – Welcome to Ireland (Auftrag vom 14.11.2026: „2 große Proben je Unit – A + Nachschreiber
 * B, Aufbau wie Probe 1 … online + Word/PDF“, „M und R getrennt – eigene, leichtere R-Fassungen der Module und Proben“,
 * „die ki soll mit einheitlicher temperatur die probe auswerten“; Aufbau wie Probe 2).
 *
 * Teile: A Listening (12) · B Reading (12) · C Grammar and vocabulary (22) · D Mediation (10) · E Writing (14) = 70 Punkte,
 * 90 Minuten – wie Probe 1 und 2. Jeder Zug hat eine eigene Fassung (vier Kennungen):
 *   e7-p3-m-a, e7-p3-r-a (Variante A) und e7-p3-m-b, e7-p3-r-b (Variante B = Nachschreiber, eigene Texte und Situationen).
 * 7M und 7R derselben Variante hören denselben Hörtext (eine Aufnahme je Variante) und haben dieselbe Situation in jedem Teil.
 * 7R ist leichter: Hören nur mit Auswahl und Reihenfolge (M: Notizen), kürzerer und einfacherer Lesetext (R etwa 170, M etwa
 * 240 Wörter), im Grammatikteil mehr Auswahl und Zuordnen (some/any/no aus einem Wortkasten, Satzstellung ankreuzen,
 * something/nobody … ankreuzen und zuordnen, Wörter zuordnen; M bildet die Formen selbst), Sprachmittlung mit mehr Lenkung
 * (je Frage des Gasts ein eigenes Feld mit englischem Satzanfang; M fasst in 4 bis 6 Sätzen zusammen), Schreiben 40–70 Wörter
 * mit Satzanfängen im Plan (M 60–100 Wörter). Die Note folgt dem Zug der Fassung: M 50 % = Note 4, R 50 % = Note 3.
 * A und B haben je Teil dieselben Aufgabenarten und Punkte (gleicher Anteil offener Aufgaben).
 *
 * Grammatik der Unit: G8 Orts- und Zeitangaben – Ort vor Zeit am Satzende, G9 some/any/no und something/anything/nothing,
 * somebody/anybody/nobody. Aus Unit 2 kommen present perfect und going to in den Texten vor (nicht abgefragt).
 * Wortschatz: Wortliste Unit 3 (GRUMI-Vokabeltrainer Unit 3) verstärkt – public transport, timetable, journey, to change,
 * single ticket, return ticket, all-day, stop, to get off, to arrive, to leave, across, past, on the left, near, euro, Irish,
 * Gaelic football, to be fed up, advice, should, can't stand, nobody/somebody/anybody, anything/nothing/something, guest,
 * chance, to try, positive, worried, excited, nervous, sad, angry, tired, happy, awful, background, foreground.
 *
 * Abgleich mit Blue Line 3 (Klett, Bayern M-Zug, Unit 3, S. 52–73 – nur Aufbau, Themen und Aufgabenformen, Analyse in
 * progress/englisch7/BUCH-UNIT3.md): Fahrt mit Bus und Bahn planen, Fahrkarten und Preise, Weg von der Haltestelle (Topic 1,
 * G8), jemandem mit Gefühlen und Ratschlägen helfen (Topic 2, G9, should / Why don't you …?), Umzug (Text), Bildbeschreibung
 * (Wörter background/foreground), Sprachmittlung wie im Buch Deutsch → Englisch: deutsche Informationen für einen Gast aus
 * Irland auf Englisch weitergeben, dazu ein kurzer Auftrag der Mutter bzw. des Vaters an den Gast. Hören wie Topic 1 und 2
 * (Telefonat mit Zeiten, Preisen und Wegen).
 * Nichts übernommen: keine Buchtexte, -namen oder -motive (kein Workshop, keine Straßenbahn, kein vergessener Schlüssel, keine
 * Verlustanzeige, keine Frühstückspension, keine Lüge gegenüber der Mutter, kein Streit um die Hausarbeit, keine Schauspielerin).
 *
 * Variante A: Telefonat Keeva (Mädchen) und Ciaran (Junge) – mit Bus und Zug zum Aquarium in Carrigmore, Fahrkarten, Treffpunkt
 *   an der Bushaltestelle vor der Bücherei (Hören, Irland) · Leserbrief von Tiernan, der von Wexford nach Kilbrack gezogen ist,
 *   mit der Antwort von Deirdre auf der Ratgeberseite (Lesen) · Infoblatt der Sommerrodelbahn am Eckberg für den irischen
 *   Austauschschüler Ruairi auf Englisch, Bitte der Mutter an Ruairi (Sprachmittlung, Bayern) · Nachricht an den irischen
 *   Freund Killian, der zu Besuch kommt: Treffpunkt, Weg vom Bahnhof, Pläne, der eigene Ort (Schreiben).
 * Variante B: Telefonat Molly (Mädchen) und Gavin (Junge) – Mollys neues Haus in Rathmore, Weg vom Bahnhof mit dem Bus, was man
 *   dort machen kann (Hören, Irland) · Leserbrief von Bronagh vor dem Schüleraustausch in Frankreich mit der Antwort von Dervla
 *   (Lesen) · Infoblatt des Wildparks Hirschberg für die irische Freundin Eabha auf Englisch, Bitte des Vaters an Eabha
 *   (Sprachmittlung, Bayern) · E-Mail mit Ratschlägen an die E-Mail-Freundin Orlaith, deren beste Freundin Fiadh weggezogen ist
 *   (Schreiben).
 * Alle Texte, Personen und Orte sind eigenständig für GRUMI erstellt und erfunden (Keeva, Ciaran, Carrigmore, Tiernan, Kilbrack,
 * Deirdre, Ruairi, Sommerrodelbahn am Eckberg, Killian, Molly, Gavin, Rathmore, Bronagh, Dervla, Eabha, Wildpark Hirschberg,
 * Orlaith, Fiadh; Wexford als echte Stadt; in den Grammatiksätzen Adam, Holly, Aaron, Tamsin) – geprüft mit
 * englisch7-werkzeug/namen-frei.js: sie stehen weder im Schulbuch noch in einem Lernmodul (MODULE.md, „Vergebene Namen“) noch
 * in Probe 1 oder 2.
 * LehrplanPLUS E7: Hörverstehen, Leseverstehen, Sprachmittlung (Informationen aus einem deutschen Infoblatt adressatengerecht
 * auf Englisch weitergeben), Schreiben (persönliche Nachricht/E-Mail mit Wegbeschreibung bzw. Ratschlägen), Wortschatz und
 * Grammatik der Unit.
 * Den Hörtext spielt die Lehrkraft in der Verwaltung zweimal für alle ab (Aufnahme in audio/: e7-p3-<r|m>-<a|b>-h1.mp3 –
 * R und M derselben Variante sind dieselbe Aufnahme). Bleibt auf dem Server (Lösungen und Erwartungshorizont). Bausteine: bau.js.
 */
const { c, m, o, f, feld, z, a, kr, s, text, hoertext, teil, probe7 } = require("./bau");

const HINWEIS = "Work on your own. Part A: your teacher plays the recording twice – read the tasks first. Read every task carefully. Arbeite allein. Den Hörtext spielt deine Lehrkraft zweimal für alle ab – lies vorher die Aufgaben. Du hast etwa 90 Minuten Zeit. Reinkopieren ist verboten und wird protokolliert. Nach der Abgabe kannst du nichts mehr ändern.";
const TITEL = (zug) => "Test 3 (" + zug + "7): Welcome to Ireland";
const SCOPE = "Unit 3 · Listening, Reading, Grammar and vocabulary, Mediation, Writing";
// Sprachmittlung Deutsch → Englisch: Der Gast versteht kein Deutsch – es zählt, ob die Information auf Englisch ankommt
const SM = "Sprachmittlung: verständliches Englisch für den Gast, sinngemäß und nicht Wort für Wort; Unwichtiges darf fehlen; Fehler, die das Verstehen nicht stören, kosten nichts";
const BITTE = " – zählt direkt (You should …) oder als Bericht (My mum / My dad says …); Ort vor Zeit ist schön, kostet hier aber keinen Punkt; Fehler, die das Verstehen nicht stören, kosten nichts.";
// Hinweise der Grammatikaufgaben (beide Varianten)
const H_SOME = "some in bejahten Sätzen · any in verneinten Sätzen (not … any) und in Fragen · no = kein, ohne not.";
const H_ORT = "Ort vor Zeit: Am Satzende steht erst, wo (at the station), dann, wann (at ten o'clock).";
const H_BODY = "-thing für Sachen, -body für Personen · some- in bejahten Sätzen, any- nach not und in Fragen, no- ohne not.";
// G8-Felder: die Orts- und Zeitangabe allein oder der ganze Satz
const ortZeit = (anfang, rest) => [rest, anfang + " " + rest];

/* ====================================================== Variante A ====================================================== */

const A_HOEREN = hoertext("h1", "A trip to the aquarium", "Listening: two friends on the phone", [
  ["Keeva", "Hi Ciaran, it's Keeva. Are you free on Saturday?"],
  ["Ciaran", "Hi Keeva! Yes, I think so. Why?"],
  ["Keeva", "My aunt has given me two tickets for the aquarium in Carrigmore. Would you like to come with me?"],
  ["Ciaran", "Oh, cool! I've never been to an aquarium. But how do we get there? Carrigmore is quite far."],
  ["Keeva", "We can go by train. The journey takes about an hour. From the station it's a ten-minute walk to the aquarium."],
  ["Ciaran", "And how do we get to the station? My parents are working on Saturday, so they can't drive us."],
  ["Keeva", "That's no problem. We can take the number twelve bus from the stop in front of the library."],
  ["Ciaran", "OK. When does the train leave?"],
  ["Keeva", "At twenty to ten. So let's meet at the bus stop at nine o'clock."],
  ["Ciaran", "Fine. What about the train tickets? Are they expensive?"],
  ["Keeva", "A single ticket for students is nine euros, and a return ticket is fourteen. So we should buy return tickets."],
  ["Ciaran", "Is there anything to eat at the aquarium?"],
  ["Keeva", "There's a café, but it's really expensive. Let's take some sandwiches. And bring a jacket – it's going to rain."],
  ["Ciaran", "OK. Oh, can my little brother come too? He loves fish!"],
  ["Keeva", "Sorry, I haven't got any more tickets. Maybe next time!"],
  ["Ciaran", "No problem. See you on Saturday, then!"]
], { stimmen: { Keeva: "en-GB-LibbyNeural", Ciaran: "en-GB-RyanNeural" }, mal: 2 });

const A_LESEN = {
  M: text("t1", "Teen Talk: Ask Deirdre", "Problem page", [
    "Dear Deirdre,",
    "I'm thirteen, and I'm really fed up. Two months ago my family moved from Wexford to Kilbrack, a small village in the west of Ireland. My dad has got a new job here, and my parents love the quiet life. But I can't stand it!",
    "There isn't anything to do in Kilbrack. There's no cinema and no sports centre, and there's only one shop. The only bus to the next town leaves at seven in the morning, so I can't go anywhere after school.",
    "At my new school nobody talks to me. The other kids have known each other for years. I haven't made any friends yet, and I really miss my old swimming club in Wexford. My mum says I should be more positive, but that isn't easy. What should I do?",
    "Tiernan",
    "Dear Tiernan,",
    "Moving to a new place is hard, and a lot of people feel lonely at first. But don't worry – it's going to get better!",
    "Why don't you join a club? Kilbrack hasn't got a sports centre, but I'm sure there is something for young people, like a Gaelic football team or a music group. Ask your teacher about it. A club is a great chance to meet some new people.",
    "You should also invite somebody from your class to your house. Maybe the other kids are a bit shy too!",
    "And why don't you call your old friends at the weekend? You can visit them in the holidays, too.",
    "Give Kilbrack a chance. Good luck! Deirdre"
  ]),
  R: text("t1", "Teen Talk: Ask Deirdre", "Problem page", [
    "Dear Deirdre,",
    "I'm thirteen, and I'm really fed up. Two months ago my family moved from Wexford to Kilbrack, a small village in Ireland. My dad has got a new job here, and my parents love the village. But I don't!",
    "There isn't anything to do in Kilbrack. There's no cinema and no sports centre, and there's only one shop. At my new school nobody talks to me. I haven't got any friends here yet, and I miss my old swimming club. What should I do?",
    "Tiernan",
    "Dear Tiernan,",
    "Moving is hard, but don't worry – it's going to get better!",
    "Why don't you join a club? I'm sure there is something for young people in Kilbrack, like a Gaelic football team. It's a good chance to meet new people.",
    "You should also invite somebody from your class to your house. Maybe the other kids are a bit shy too! And you can call your old friends in Wexford at the weekend.",
    "Give Kilbrack a chance! Deirdre"
  ])
};

const A_INFO = "SOMMERRODELBAHN AM ECKBERG\nGeöffnet: April bis Oktober, täglich von 10 bis 18 Uhr. Bei Regen ist die Bahn geschlossen.\nPreise: 1 Fahrt 4 € · 6 Fahrten 20 € · Kinder unter 6 Jahren frei\nKinder unter 8 Jahren fahren nur mit einem Erwachsenen. Ab 8 Jahren darf man allein fahren.\nWichtig: Während der Fahrt bitte keine Handys und Kameras – sie fallen leicht herunter!\nAnfahrt: Bus Linie 14 ab Bahnhof bis Haltestelle Eckberg, Fahrzeit 20 Minuten, jede Stunde um 10 nach. Der letzte Bus zurück fährt um 18.30 Uhr.\nEssen und Trinken: Kiosk an der Talstation (Würstchen, Brezen, Eis) · Grillplatz und Spielplatz neben der Bahn\nTipp: Wanderweg zum Gipfel, etwa 1 Stunde – tolle Aussicht auf die Alpen!";
const A_MAMA = "👩 Mama: „Sag Ruairi bitte, dass ich euch um 19 Uhr am Bahnhof abhole und dass er etwas Warmes zum Anziehen mitnehmen soll – auf dem Berg ist es oft kalt.“";

function fassungA(zug) {
  const R = zug === "R";
  return probe7(3, zug, "A", {
    title: TITEL(zug), kurz: "Unit 3", scope: SCOPE, minutes: 90, hinweis: HINWEIS,
    texte: [A_HOEREN, A_LESEN[zug]],
    items: [
      ...teil("A Listening", R ? [
        c("Who has given Keeva the tickets?", ["her aunt", "her mum", "her teacher"], 0, { text: "h1" }),
        c("Has Ciaran been to an aquarium before?", ["No, never.", "Yes, once.", "Yes, twice."], 0, { text: "h1" }),
        c("How long does the train journey take?", ["about an hour", "about ten minutes", "about two hours"], 0, { text: "h1" }),
        c("Where is the bus stop?", ["in front of the library", "next to the station", "behind the school"], 0, { text: "h1" }),
        c("When does the train leave?", ["at twenty to ten", "at nine o'clock", "at twenty past ten"], 0, { text: "h1" }),
        c("How much is a return ticket for students?", ["fourteen euros", "nine euros", "four euros"], 0, { text: "h1" }),
        c("Why do they want to take sandwiches?", ["The café is really expensive.", "There isn't a café.", "The café is closed on Saturdays."], 0, { text: "h1" }),
        c("What is the weather going to be like on Saturday?", ["It's going to rain.", "It's going to be sunny.", "It's going to snow."], 0, { text: "h1" }),
        c("Why can't Ciaran's little brother come?", ["Keeva hasn't got any more tickets.", "He is too young.", "He doesn't like fish."], 0, { text: "h1" }),
        o("What do Keeva and Ciaran talk about? Put the topics in the right order.", ["Keeva says how long the train journey takes.", "Keeva says where they can get the bus.", "Keeva says how much the tickets are."], { text: "h1" })
      ] : [
        c("Why does Keeva call Ciaran?", ["She wants to take him to the aquarium.", "She needs help with her homework.", "She wants to borrow his bike."], 0, { text: "h1" }),
        c("Why can't Ciaran's parents drive them to the station?", ["They are working on Saturday.", "They haven't got a car.", "They are on holiday."], 0, { text: "h1" }),
        c("Why are return tickets better for Keeva and Ciaran?", ["They are cheaper than two single tickets.", "You can use them on the bus too.", "Students don't have to pay for them."], 0, { text: "h1" }),
        c("Why can't Ciaran's little brother come?", ["Keeva hasn't got any more tickets.", "He is ill.", "He is too young for the aquarium."], 0, { text: "h1" }),
        f("Listen again and complete the notes. Write one word or a number.", [
          feld("Bus to the station: number …", ["twelve", "12"]),
          feld("The train leaves at …", ["twenty to ten", "9.40", "9:40", "09.40", "09:40", "nine forty", "twenty to 10", "9.40 am", "9.40 a.m."]),
          feld("Return ticket for students: … euros", ["fourteen", "14", "€14", "14 euros", "fourteen euros"]),
          feld("Walk from the station to the aquarium: … minutes", ["ten", "10"]),
          feld("Take some sandwiches and a … – it's going to rain.", ["jacket", "rain jacket", "raincoat"])
        ], { text: "h1", tolerant: true, hinweis: "Lies vor dem Hören die Notizen: Dann weißt du, auf welche Zahl oder welches Wort du achten musst." }),
        o("What do Keeva and Ciaran talk about? Put the topics in the right order.", ["Keeva says how long the train journey takes.", "Keeva says where they can get the bus.", "Keeva says how much the tickets are."], { text: "h1" })
      ]),
      ...teil("B Reading", R ? [
        c("Where does Tiernan live now?", ["in a small village in Ireland", "in a big city in Ireland", "on a farm in England"], 0, { text: "t1" }),
        c("How does Tiernan feel?", ["He is fed up.", "He is excited.", "He is happy."], 0, { text: "t1" }),
        c("What is there in Kilbrack?", ["only one shop", "a cinema", "a big sports centre"], 0, { text: "t1" }),
        c("Who talks to Tiernan at his new school?", ["nobody", "his teacher", "all the kids"], 0, { text: "t1" }),
        c("What does Deirdre think?", ["It's going to get better.", "Tiernan should move back to Wexford.", "Tiernan's parents are wrong."], 0, { text: "t1" }),
        z("In which line(s) does Tiernan say what he misses?", "t1", [[9, 9]], { hinweis: "Suche das Schlüsselwort aus der Frage (miss) im Text und lies dort genau." }),
        z("In which line(s) does Deirdre say who Tiernan should invite?", "t1", [[16, 16]], { hinweis: "Suche das Wort „invite“ im Text." }),
        f("Complete the notes about Tiernan. Write one word or a number.", [
          feld("Tiernan is … years old.", ["thirteen", "13"]),
          feld("His family moved to Kilbrack … months ago.", ["two", "2"]),
          feld("His old town is …", ["Wexford"])
        ], { text: "t1", tolerant: true }),
        a("Give one piece of advice from Deirdre. Answer in English.", [
          kr("ein Rat von Deirdre aus dem Text", 1, "zum Beispiel: Join a club. / Invite somebody from your class. / Call your old friends at the weekend. / Give Kilbrack a chance. / Don't worry. – Ein Problem von Tiernan (nobody talks to me) ist kein Rat."),
          kr("verständlich auf Englisch (Stichworte und Wörter aus dem Text genügen; Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
        ], "He should join a club, because it's a good chance to meet new people.", ["club|invite|call|friends|chance|worry"], { text: "t1", zeilen: [1, 19] })
      ] : [
        c("Why did Tiernan's family move to Kilbrack?", ["His dad has got a new job there.", "His grandparents live there.", "His parents wanted a bigger house."], 0, { text: "t1" }),
        c("Why can't Tiernan go to the next town after school?", ["The only bus leaves in the morning.", "His parents don't let him.", "He hasn't got a bike."], 0, { text: "t1" }),
        c("What does Deirdre say about the other kids in Tiernan's class?", ["Maybe they are a bit shy too.", "They aren't very nice.", "They don't like new people."], 0, { text: "t1" }),
        z("In which line(s) does Tiernan say why it is hard to make friends at his new school?", "t1", [[10, 11]], { hinweis: "Suche die Stelle über die anderen Kinder (the other kids) und lies dort genau." }),
        z("In which line(s) does Deirdre say who Tiernan can ask about clubs?", "t1", [[21, 22]], { hinweis: "Suche das Wort „ask“ im Text." }),
        f("Complete the notes about Tiernan. Write one word or a number.", [
          feld("Tiernan moved to Kilbrack … months ago.", ["two", "2"]),
          feld("His dad has got a new … in Kilbrack.", ["job"]),
          feld("The only bus to the next town leaves at … in the morning.", ["seven", "7", "7 o'clock", "seven o'clock"]),
          feld("Tiernan misses his old … club.", ["swimming", "swim"])
        ], { text: "t1", tolerant: true }),
        a("Name one of Tiernan's problems in Kilbrack and one piece of advice from Deirdre. Answer in English.", [
          kr("ein Problem von Tiernan", 1, "zum Beispiel: There isn't anything to do. / There's no cinema and no sports centre. / There's only one shop. / He can't go to the next town after school. / Nobody talks to him. / He hasn't made any friends yet. / He misses his swimming club."),
          kr("ein Rat von Deirdre", 1, "zum Beispiel: Join a club (Gaelic football team, music group). / Ask your teacher about clubs. / Invite somebody from your class. / Call your old friends at the weekend. / Visit them in the holidays. / Give Kilbrack a chance."),
          kr("verständlich auf Englisch (eigene Worte oder passende Wörter aus dem Text; Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
        ], "Nobody at his new school talks to him. Deirdre says he should join a club, for example a Gaelic football team.", ["nothing|anything|cinema|shop|bus|nobody|friends|miss|swimming", "club|ask|teacher|invite|call|visit|chance"], { text: "t1", zeilen: [1, 28] })
      ]),
      ...teil("C Grammar and vocabulary", R ? [
        f("Complete the sentences with some, any or no. Use: some · any · no", [
          feld("There are … nice shops in the town centre.", ["some"]),
          feld("We haven't got … bread for the picnic.", ["any"]),
          feld("Are there … good cafés near the station?", ["any"]),
          feld("Sorry, there are … trains on Sundays.", ["no"]),
          feld("My brother has got … new friends at his school.", ["some"])
        ], { hinweis: H_SOME }),
        c("Choose the right word order: We're going to meet …", ["at the station at ten o'clock", "at ten o'clock at the station", "at the station ten o'clock"], 0, { hinweis: H_ORT }),
        c("Choose the right word order: I lost my phone …", ["on the bus yesterday", "yesterday on the bus", "on yesterday the bus"], 0, { hinweis: H_ORT }),
        c("Choose the right word order: My cousin is going to arrive …", ["in Ireland next week", "next week in Ireland", "in next week Ireland"], 0, { hinweis: H_ORT }),
        f("Place and time: Write the words in brackets in the right order.", [
          feld("We had a picnic … (last Sunday / in the park)", ortZeit("We had a picnic", "in the park last Sunday")),
          feld("Adam is going to play table tennis … (after school / at the sports centre)", ortZeit("Adam is going to play table tennis", "at the sports centre after school")),
          feld("Holly met her friends … (at four o'clock / at the café)", ortZeit("Holly met her friends", "at the café at four o'clock").concat(["at the cafe at four o'clock", "at the café at 4 o'clock", "at the cafe at 4 o'clock"]))
        ], { hinweis: H_ORT }),
        c("Choose the right word: I'm bored. There's … to do here.", ["nothing", "anything", "nobody"], 0, { hinweis: H_BODY }),
        c("Choose the right word: Listen! There's … at the door.", ["somebody", "anybody", "nobody"], 0, { hinweis: H_BODY }),
        m("Match the questions and the answers.", [["Have you got anything to drink?", "Yes, there's some juice in the fridge."], ["Did anybody call me?", "Yes, somebody from your swimming club."], ["What did you buy in town?", "Nothing. The shops were closed."], ["Who is in the classroom?", "Nobody. The others are outside."]],
          { hinweis: "Lies die Frage genau: Geht es um Sachen (anything, nothing) oder um Personen (anybody, somebody, nobody)?" }),
        m("What do the words mean in German? Match them.", [["timetable", "Fahrplan"], ["to change", "umsteigen"], ["return ticket", "Hin- und Rückfahrkarte"], ["worried", "besorgt"], ["background", "Hintergrund"]])
      ] : [
        f("Complete the sentences with some, any or no.", [
          feld("Are there … buses to the beach on Sundays?", ["any"]),
          feld("Sorry, I can't buy a ticket. I've got … money with me.", ["no"]),
          feld("We need … bread for the sandwiches.", ["some"]),
          feld("My new neighbours haven't got … children.", ["any"]),
          feld("There's … milk in the fridge. Can you buy some, please?", ["no"]),
          feld("My sister has made … new friends at her new school.", ["some"])
        ], { hinweis: H_SOME }),
        f("Place and time: Write the words in brackets in the right order.", [
          feld("We're going to have a picnic … (on Sunday / at the beach)", ortZeit("We're going to have a picnic", "at the beach on Sunday").concat(["we are going to have a picnic at the beach on sunday"])),
          feld("Adam lost his bag … (yesterday / on the train)", ortZeit("Adam lost his bag", "on the train yesterday")),
          feld("My aunt is going to arrive … (at six o'clock / at the bus station)", ortZeit("My aunt is going to arrive", "at the bus station at six o'clock").concat(["at the bus station at 6 o'clock"])),
          feld("Did you see Holly … (last weekend / at the party)?", ortZeit("Did you see Holly", "at the party last weekend").concat(["did you see holly at the party last weekend?"]))
        ], { hinweis: H_ORT }),
        f("Complete the sentences with some-, any- or no- and -thing or -body.", [
          feld("I'm hungry, but there isn't … in the fridge.", ["anything"]),
          feld("Where are the others? There's … in the classroom.", ["nobody", "no one", "no-one"]),
          feld("I didn't see … at the bus stop. It was empty.", ["anybody", "anyone"]),
          feld("This town is so boring – there's … to do!", ["nothing"]),
          feld("I've got … for you – a present from Ireland!", ["something"])
        ], { hinweis: H_BODY }),
        f("Travel and pictures: Complete the words.", [
          feld("You want to go to the city and come back. You need a … ticket.", ["return"]),
          feld("Look at the … to find out when the next bus leaves.", ["timetable", "time table"]),
          feld("The people at the front of a picture are in the …", ["foreground"])
        ], { hinweis: "Wörter der Unit 3: Fahrkarten (single / return), Fahrplan, Bildbeschreibung (foreground, background)." }),
        m("How do they feel? Match the situations and the feelings.", [["Your best friend is moving to another country.", "sad"], ["You're going to fly to Ireland tomorrow – your first time on a plane!", "excited"], ["Your little brother is two hours late and isn't answering his phone.", "worried"], ["Somebody has broken your new bike.", "angry"]])
      ]),
      ...teil("D Mediation", [
        R ? a("You are at home in Bavaria. Your Irish exchange partner Ruairi (13) is staying with your family. He doesn't speak German. He has found this flyer and asks you questions about it. Answer his questions in English. (Beantworte Ruairis Fragen auf Englisch – kurze Sätze genügen.)", [
          kr("geöffnet: täglich von 10 bis 18 Uhr", 1, "from ten to six / from 10 a.m. to 6 p.m. – beide Zeiten"),
          kr("sechs Fahrten für beide: 40 Euro (je 20 Euro)", 2, "2 Punkte: 40 Euro oder je 20 Euro für sechs Fahrten · 1 Punkt: 20 Euro nur für einen, oder mit Einzelfahrten gerechnet (6 × 4 € = 24 € je Person, 48 €); Euro"),
          kr("ja: ab 8 Jahren darf man allein fahren", 1, "Ja mit Grund (ab 8 / er ist älter als 8)"),
          kr("nein: keine Handys und Kameras während der Fahrt", 1, "Nein genügt, wenn Fotos auf der Fahrt gemeint sind"),
          kr("mit dem Bus Linie 14 vom Bahnhof", 1, "Bus 14 genügt (Haltestelle Eckberg, 20 Minuten sind nicht nötig)"),
          kr("ja: Kiosk (Würstchen, Brezen, Eis) oder Grillplatz", 1, "eines genügt (kiosk, sausages, pretzels, ice cream, barbecue)"),
          kr(SM, 1)
        ], "1. It's open every day from 10 a.m. to 6 p.m. 2. Six rides cost 20 euros, so for both of us that's 40 euros. 3. Yes, you can. From eight you can ride alone. 4. No, you can't. Phones and cameras aren't allowed on the ride. 5. We can take the number 14 bus from the station. 6. Yes, there's a kiosk with sausages, pretzels and ice cream.",
        ["10|ten|6|six|18", "40|forty|20|twenty", "8|eight|alone|yes", "phone|camera|photo|no", "bus|14|fourteen", "kiosk|sausage|pretzel|ice cream|food|eat|barbecue|grill"],
        { vorgabe: A_INFO, teile: [
          { label: "„When is the toboggan run open?“", hilfe: "It's open every day from … to …" },
          { label: "„We want six rides each. How much is that for us?“", hilfe: "Six rides cost … – for both of us that's …" },
          { label: "„Can I ride alone? I'm thirteen.“", hilfe: "Yes / No, you … from … years." },
          { label: "„Can I take photos on the ride?“", hilfe: "Yes / No, …" },
          { label: "„How do we get there?“", hilfe: "We can take the bus number … from …" },
          { label: "„Is there anything to eat there?“", hilfe: "Yes, there's …" }
        ] })
        : a("Your Irish exchange partner Ruairi (13) is staying with your family in Bavaria. He doesn't speak German. He has found this flyer and wants to know: When can we go there? · What does it cost for the two of us? (We want six rides each.) · Can I ride alone? · How do we get there and back? Tell him the important things in English (4 to 6 sentences). Do not translate word for word.", [
          kr("Öffnungszeiten: täglich 10 bis 18 Uhr, bei Regen geschlossen", 2, "2 Punkte: Uhrzeit und Regen · 1 Punkt: eines davon"),
          kr("Preis: 40 Euro für beide (sechs Fahrten je 20 Euro)", 2, "2 Punkte: 40 Euro oder je 20 Euro für sechs Fahrten · 1 Punkt: 20 Euro nur für einen, oder mit Einzelfahrten gerechnet (6 × 4 € = 24 € je Person, 48 €); Euro"),
          kr("allein fahren: ja, ab 8 Jahren", 1),
          kr("Anfahrt: Bus Linie 14 vom Bahnhof (20 Minuten, jede Stunde um 10 nach), letzter Bus zurück um 18.30 Uhr", 2, "2 Punkte: Bus 14 und eine weitere Angabe (vom Bahnhof, Fahrzeit, Takt, letzter Bus) · 1 Punkt: nur der Bus"),
          kr(SM + " (Essen, Fotos und Wanderweg sind nicht gefragt)", 1)
        ], "The toboggan run is open every day from ten to six, but not when it rains. Six rides cost twenty euros, so for the two of us it's forty euros. You can ride alone because you're older than eight. We can take the number fourteen bus from the station – it takes twenty minutes and goes every hour. The last bus back leaves at half past six.",
        ["10|ten|6|six|rain", "40|forty|20|twenty", "8|eight|alone", "bus|14|fourteen", "station|20|twenty|hour|6.30|18.30|half past six|last"],
        { vorgabe: A_INFO }),
        a(R ? "Your mum wants you to tell Ruairi two things. Tell him in English. (Sag es Ruairi auf Englisch.)" : "Your mum wants you to tell Ruairi two things. Tell him in English.", [
          kr("sagt, dass die Mutter sie um 19 Uhr am Bahnhof abholt", 1, "My mum is going to pick us up at the station at seven o'clock. / My mum is going to meet us at the station at 7 p.m." + BITTE),
          kr("sagt, dass er etwas Warmes zum Anziehen mitnehmen soll (auf dem Berg ist es kalt)", 1, "You should take something warm / a jacket / a jumper – it's cold on the mountain." + BITTE)
        ], "My mum says she's going to pick us up at the station at seven o'clock. And you should take something warm – it's often cold on the mountain.", ["seven|7|station|pick|meet", "warm|jacket|jumper|sweater|coat|hoodie|cold"],
        { vorgabe: A_MAMA, ...(R ? { hilfe: "My mum is going to … at … · You should take …" } : {}) })
      ]),
      ...teil("E Writing", [
        s(R ? "Come and visit me! Your Irish friend Killian is going to visit you next month. He is going to come to your town by train. Write a message to him (40 to 70 words). Use the plan. Write about: where and when you are going to meet (I'm going to wait at the station at …) · how you get from the station to your house (We can take the bus number … · We get off at …) · what you are going to do together (We're going to …) · something your town has got or hasn't got (There are some … / There isn't any … / There's no …) · a question to Killian. (Schreibe eine Nachricht mit 40 bis 70 Wörtern.)"
          : "Come and visit me! Your Irish friend Killian is going to visit you next month. He is going to come to your town by train. Write a message to him (60 to 100 words). Write about: where and when you are going to meet him (place before time) · how you are going to get from the station to your house (bus or train, stop, the way) · what you are going to do together (going to) · what there is or isn't in your town (some, any, no) · a question to Killian.", [
          kr("Inhalt", 5, "alle fünf Punkte des Auftrags – je Punkt 1: Treffpunkt und Uhrzeit · Weg vom Bahnhof zum Haus (Bus oder Zug, Haltestelle, aussteigen oder Fußweg) · was ihr zusammen vorhabt · was es im Ort gibt oder nicht gibt · eine Frage an Killian (Zeitform und Satzstellung bewertet die Zeile Grammatik)"),
          kr("Textsorte und Aufbau", 2, "Nachricht an einen Freund: Anrede (Hi Killian / Dear Killian), sinnvolle Reihenfolge, Schluss (See you soon! / Bye) und Name; Sätze verbunden (and, but, then, because)"),
          kr("Grammatik", 3, "Ort vor Zeit (at the station at ten o'clock), some/any/no (There are some … / There isn't any … / There's no …) und going to (We're going to …) erkennbar richtig gebildet; Fehler stören das Verstehen kaum" + (R ? "; in R7 genügen kurze, einfache Sätze" : "")),
          kr("Wortschatz", 2, "passende Wörter der Unit für Verkehr und Wege (bus, train, stop, to get off, to change, ticket, journey, timetable, across, past, on the left/right, near …), nicht nur nice und good"),
          kr("Rechtschreibung", 2, "häufige Wörter und die Wörter der Unit sind meist richtig geschrieben", { rs: true })
        ], { minWoerter: R ? 30 : 50, plan: R ? [
          { id: "start", label: "Start", hilfe: "Hi Killian, I'm so happy that you're going to visit me!" },
          { id: "meet", label: "Where and when are you going to meet?", hilfe: "I'm going to wait for you at the station at … o'clock." },
          { id: "way", label: "How do you get to your house?", hilfe: "We can take the bus number … · We get off at … · Then we walk past / across …" },
          { id: "plans", label: "What are you going to do together?", hilfe: "On Saturday we're going to …" },
          { id: "town", label: "What has your town got? What hasn't it got?", hilfe: "There are some … · There isn't any … / There's no …" },
          { id: "question", label: "Ask Killian a question.", hilfe: "Have you ever …? / What would you like to …?" },
          { id: "end", label: "End", hilfe: "See you soon! Bye, …" }
        ] : [
          { id: "start", label: "Start", hilfe: "Hi Killian, …" },
          { id: "meet", label: "Meeting point and time", hilfe: "at the station at …" },
          { id: "way", label: "From the station to my house", hilfe: "bus number …, get off at …, walk past …" },
          { id: "plans", label: "What we're going to do", hilfe: "We're going to …" },
          { id: "town", label: "My town", hilfe: "some … · not … any … · no …" },
          { id: "question", label: "Question to Killian", hilfe: "Have you ever …? / Do you …?" },
          { id: "end", label: "End", hilfe: "See you soon! …" }
        ] })
      ])
    ]
  });
}

/* ====================================================== Variante B ====================================================== */

const B_HOEREN = hoertext("h1", "Molly's new home", "Listening: two cousins on the phone", [
  ["Gavin", "Hi Molly, it's Gavin. How's your new house?"],
  ["Molly", "Hi Gavin! It's great. My room is much bigger than my old one, and there's a garden with an apple tree."],
  ["Gavin", "Cool! And what about your new school?"],
  ["Molly", "It's OK. I was really nervous on the first day, but the teachers are nice. I haven't got any friends yet. But yesterday a girl from my class asked me to come to her drama club."],
  ["Gavin", "That's good! Mum says I can visit you on Saturday. How do I get to your house from the station?"],
  ["Molly", "Take the number seven bus. You need a single ticket – it's two euros. Get off at the fourth stop, at the church."],
  ["Gavin", "At the church. OK."],
  ["Molly", "Then walk across the bridge and past the post office. Our house is the yellow one on the left, next to the bakery."],
  ["Gavin", "Sounds easy. Is there anything to do in Rathmore?"],
  ["Molly", "Well, there's no cinema, but there's a big lake. We can go kayaking there in the afternoon. Bring some old clothes – you're going to get wet!"],
  ["Gavin", "Great! When shall I come?"],
  ["Molly", "Come at eleven. My mum is going to make pancakes for lunch."],
  ["Gavin", "Perfect. See you on Saturday!"],
  ["Molly", "Bye, Gavin!"]
], { stimmen: { Molly: "en-GB-SoniaNeural", Gavin: "en-GB-RyanNeural" }, mal: 2 });

const B_LESEN = {
  M: text("t1", "Teen Talk: Ask Dervla", "Problem page", [
    "Dear Dervla,",
    "I'm twelve, and I'm really worried. In May my class is going to France for two weeks. We're going to stay with host families and go to a French school there. Everybody in my class is excited, but I'm not.",
    "I have never been away from home without my parents, and I can't speak much French. What if my host family doesn't like me? What if I don't understand anything at school? Last night I couldn't sleep at all.",
    "My mum says the trip is a great chance, but I'd like to stay at home. Should I tell my teacher?",
    "Bronagh",
    "Dear Bronagh,",
    "It's normal to feel nervous before a big trip. A lot of your classmates feel the same – they just don't say it!",
    "First, you should talk to your teacher. Teachers have done trips like this many times, and they can tell you a lot about the families and the school.",
    "Why don't you write an e-mail to your host family before the trip? Send them some photos of your family and your pets. Then they know you a bit before you arrive.",
    "You should also learn some easy French sentences, like 'Thank you' or 'Where is the toilet?'",
    "Your parents can't come with you, but you can call them every evening. Two weeks go fast, and I'm sure you're going to have a great time! Dervla"
  ]),
  R: text("t1", "Teen Talk: Ask Dervla", "Problem page", [
    "Dear Dervla,",
    "I'm twelve, and I'm really worried. In May my class is going to France for two weeks. We're going to stay with host families there and go to a French school. Everybody in my class is excited, but I'm not.",
    "I have never been away from home without my parents, and I can't speak much French. What if my host family doesn't like me? My mum says the trip is a great chance, but I'd like to stay at home. What should I do?",
    "Bronagh",
    "Dear Bronagh,",
    "Don't worry – a lot of people feel nervous before a big trip.",
    "First, you should talk to your teacher. Teachers can tell you a lot about the families and the school.",
    "Why don't you write an e-mail to your host family? Send them some photos of your family and your pets.",
    "You can call your parents every evening. I'm sure you're going to have a great time! Dervla"
  ])
};

const B_INFO = "WILDPARK HIRSCHBERG\nÖffnungszeiten: März bis Oktober täglich 9 bis 17 Uhr · November bis Februar nur Samstag und Sonntag, 10 bis 16 Uhr\nEintritt: Erwachsene 8 € · Kinder von 4 bis 14 Jahren 5 € · Kinder unter 4 Jahren frei\nFütterungen: Wölfe um 11 Uhr · Bären um 14.30 Uhr\nStreichelgehege: Ziegen und Schafe dürfen nur mit Futter aus dem Automaten (1 €) gefüttert werden. Bitte kein anderes Futter mitbringen!\nHunde sind im Wildpark leider nicht erlaubt.\nEssen: Gasthaus am Eingang (warme Gerichte, Kuchen) · Picknickplatz am Weiher\nAnfahrt: Bus Linie 7 ab Marktplatz bis Haltestelle Wildpark, Fahrzeit 15 Minuten. Montag bis Freitag jede Stunde, am Wochenende nur alle zwei Stunden.";
const B_PAPA = "👨 Papa: „Sag Eabha bitte, dass wir am Samstag um 9 Uhr am Marktplatz auf den Bus warten und dass sie feste Schuhe anziehen soll.“";

function fassungB(zug) {
  const R = zug === "R";
  return probe7(3, zug, "B", {
    title: TITEL(zug), kurz: "Unit 3", scope: SCOPE, minutes: 90, hinweis: HINWEIS,
    texte: [B_HOEREN, B_LESEN[zug]],
    items: [
      ...teil("A Listening", R ? [
        c("What does Molly say about her new room?", ["It's much bigger than her old one.", "It's smaller than her old one.", "It's next to the kitchen."], 0, { text: "h1" }),
        c("How did Molly feel on her first day at the new school?", ["nervous", "happy", "bored"], 0, { text: "h1" }),
        c("Has Molly got any new friends?", ["No, not yet.", "Yes, a lot.", "Yes, two."], 0, { text: "h1" }),
        c("Which bus does Gavin need to take?", ["number seven", "number eleven", "number four"], 0, { text: "h1" }),
        c("Where must Gavin get off?", ["at the church", "at the bakery", "at the post office"], 0, { text: "h1" }),
        c("Where is Molly's house?", ["next to the bakery", "next to the church", "behind the post office"], 0, { text: "h1" }),
        c("What is there in Rathmore?", ["a big lake", "a cinema", "a swimming pool"], 0, { text: "h1" }),
        c("What are Molly and Gavin going to do in the afternoon?", ["go kayaking", "go to the cinema", "play football"], 0, { text: "h1" }),
        c("Why should Gavin bring some old clothes?", ["He's going to get wet.", "It's going to be cold.", "They're going to paint Molly's room."], 0, { text: "h1" }),
        o("What do Molly and Gavin talk about? Put the topics in the right order.", ["Molly talks about her new school.", "Molly explains the way to her house.", "Molly says what they can do in Rathmore."], { text: "h1" })
      ] : [
        c("What does Molly like about her new house?", ["Her room is bigger, and there's a garden.", "It's very near her new school.", "It's next to the lake."], 0, { text: "h1" }),
        c("What has a girl from Molly's class done?", ["She has asked Molly to come to her drama club.", "She has shown Molly the town.", "She has given Molly her phone number."], 0, { text: "h1" }),
        c("What is the way from the bus stop to Molly's house?", ["across the bridge and past the post office", "past the church and across the park", "across the market square and past the school"], 0, { text: "h1" }),
        c("Why should Gavin bring some old clothes?", ["He's going to get wet.", "They're going to work in the garden.", "It's going to be cold."], 0, { text: "h1" }),
        f("Listen again and complete the notes. Write one word or a number.", [
          feld("Bus from the station: number …", ["seven", "7"]),
          feld("Price of a single ticket: … euros", ["two", "2", "€2", "2 euros", "two euros"]),
          feld("Get off at the … stop.", ["fourth", "4th", "four", "4"]),
          feld("Molly's house is the … one on the left.", ["yellow"]),
          feld("Gavin should come at … o'clock.", ["eleven", "11"])
        ], { text: "h1", tolerant: true, hinweis: "Lies vor dem Hören die Notizen: Dann weißt du, auf welche Zahl oder welches Wort du achten musst." }),
        o("What do Molly and Gavin talk about? Put the topics in the right order.", ["Molly talks about her new school.", "Molly explains the way to her house.", "Molly says what they can do in Rathmore."], { text: "h1" })
      ]),
      ...teil("B Reading", R ? [
        c("Where is Bronagh's class going?", ["to France", "to Germany", "to Spain"], 0, { text: "t1" }),
        c("How does Bronagh feel about the trip?", ["She is worried.", "She is excited.", "She is angry."], 0, { text: "t1" }),
        c("What has Bronagh never done?", ["She has never been away from home without her parents.", "She has never been on a plane.", "She has never had a pet."], 0, { text: "t1" }),
        c("Who should Bronagh talk to first?", ["her teacher", "her host family", "her grandma"], 0, { text: "t1" }),
        c("What can Bronagh do every evening in France?", ["call her parents", "write a diary", "go to a French club"], 0, { text: "t1" }),
        z("In which line(s) does Bronagh say what her mum thinks?", "t1", [[8, 9]], { hinweis: "Suche das Wort „mum“ im Text." }),
        z("In which line(s) does Dervla say what Bronagh can send to her host family?", "t1", [[16, 17]], { hinweis: "Suche das Schlüsselwort aus der Frage (send) im Text und lies dort genau." }),
        f("Complete the notes about Bronagh. Write one word or a number.", [
          feld("Bronagh is … years old.", ["twelve", "12"]),
          feld("The class trip is in …", ["May"]),
          feld("The trip is for … weeks.", ["two", "2"])
        ], { text: "t1", tolerant: true }),
        a("What can Bronagh do before the trip? Give one idea from the text. Answer in English.", [
          kr("eine Idee aus dem Text für die Zeit vor der Reise", 1, "zum Beispiel: talk to her teacher / write an e-mail to her host family / send them some photos of her family and her pets – „call her parents every evening“ gehört zur Zeit in Frankreich, zählt aber, wenn das Kind es als Rat nennt (im Zweifel für das Kind)."),
          kr("verständlich auf Englisch (Stichworte und Wörter aus dem Text genügen; Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
        ], "She can write an e-mail to her host family and send them some photos.", ["teacher|e-mail|email|mail|write|photo|picture|send"], { text: "t1", zeilen: [1, 19] })
      ] : [
        c("What are the students going to do in France?", ["stay with host families and go to a French school", "stay in a hotel and visit museums", "go camping by the sea"], 0, { text: "t1" }),
        c("What does Bronagh's mum think about the trip?", ["It's a great chance.", "Two weeks are too long.", "Bronagh should stay at home."], 0, { text: "t1" }),
        c("Why should Bronagh talk to her teacher?", ["Teachers have done trips like this many times.", "Her teacher speaks very good French.", "Her teacher is going to stay with her."], 0, { text: "t1" }),
        z("In which line(s) does Bronagh say what she has never done?", "t1", [[6, 6]], { hinweis: "Suche das Wort „never“ im Text." }),
        z("In which line(s) does Dervla say how Bronagh can stay in contact with her parents?", "t1", [[24, 25]], { hinweis: "Suche das Schlüsselwort aus der Frage (parents) im Antwortbrief von Dervla." }),
        f("Complete the notes about Bronagh. Write one word or a number.", [
          feld("The class is going to France in …", ["May"]),
          feld("They are going to stay there for … weeks.", ["two", "2"]),
          feld("Bronagh can send her host family some … of her family and her pets.", ["photos", "photo", "pictures", "photographs", "fotos"]),
          feld("She should learn some easy … sentences.", ["French"])
        ], { text: "t1", tolerant: true }),
        a("Why is Bronagh worried about the trip? Give one reason. Then give one idea from Dervla: what can Bronagh do before the trip? Answer in English.", [
          kr("ein Grund, warum Bronagh sich Sorgen macht", 1, "zum Beispiel: She has never been away from home without her parents. / She can't speak much French. / Maybe her host family doesn't like her. / Maybe she doesn't understand anything at school."),
          kr("eine Idee von Dervla für die Zeit vor der Reise", 1, "zum Beispiel: talk to her teacher / write an e-mail to her host family / send photos of her family and her pets / learn some easy French sentences"),
          kr("verständlich auf Englisch (eigene Worte oder passende Wörter aus dem Text; Fehler, die das Verstehen nicht stören, zählen nicht)", 1)
        ], "She can't speak much French. Before the trip she can write an e-mail to her host family and send them some photos.", ["never|away|parents|french|host family|like|understand", "teacher|e-mail|email|mail|photo|picture|learn|sentence"], { text: "t1", zeilen: [1, 26] })
      ]),
      ...teil("C Grammar and vocabulary", R ? [
        f("Complete the sentences with some, any or no. Use: some · any · no", [
          feld("We need … eggs for the cake.", ["some"]),
          feld("There aren't … buses after eight o'clock.", ["any"]),
          feld("Have you got … brothers or sisters?", ["any"]),
          feld("I'm sorry, there's … bread left.", ["no"]),
          feld("Tamsin has bought … new books for the journey.", ["some"])
        ], { hinweis: H_SOME }),
        c("Choose the right word order: Aaron is going to play football …", ["in the park after school", "after school in the park", "in after school the park"], 0, { hinweis: H_ORT }),
        c("Choose the right word order: We arrived …", ["at the hotel late in the evening", "late in the evening at the hotel", "at late the hotel in the evening"], 0, { hinweis: H_ORT }),
        c("Choose the right word order: Tamsin met her cousin …", ["at the station last Friday", "last Friday at the station", "at last Friday the station"], 0, { hinweis: H_ORT }),
        f("Place and time: Put the words in brackets in the right order.", [
          feld("My dad works … (on Saturdays / at the supermarket)", ortZeit("My dad works", "at the supermarket on Saturdays")),
          feld("Let's have lunch … (at one o'clock / in the café)", ortZeit("Let's have lunch", "in the café at one o'clock").concat(["in the cafe at one o'clock", "in the café at 1 o'clock", "in the cafe at 1 o'clock"])),
          feld("We watched a film … (last night / at my friend's house)", ortZeit("We watched a film", "at my friend's house last night"))
        ], { hinweis: H_ORT }),
        c("Choose the right word: The fridge is empty. There's … to eat.", ["nothing", "anything", "somebody"], 0, { hinweis: H_BODY }),
        c("Choose the right word: … has taken my bike! It isn't in the garage.", ["Somebody", "Anybody", "Nothing"], 0, { hinweis: H_BODY }),
        m("Match the sentences and the answers.", [["Is there any milk?", "No, there isn't any. I can buy some."], ["Did you meet anybody at the party?", "Yes, I met somebody from my old school."], ["What's in that box?", "Nothing. It's empty."], ["Who knows the answer?", "Nobody. It's too difficult."]],
          { hinweis: "Lies die Frage genau: Geht es um Sachen (any, nothing) oder um Personen (anybody, somebody, nobody)?" }),
        m("What do the words mean in German? Match them.", [["advice", "Rat"], ["single ticket", "einfache Fahrkarte"], ["to arrive", "ankommen"], ["to be fed up", "die Nase voll haben"], ["foreground", "Vordergrund"]])
      ] : [
        f("Complete the sentences with some, any or no.", [
          feld("Have you got … plans for the weekend?", ["any"]),
          feld("There are … cows in the field next to our house.", ["some"]),
          feld("We can't make pancakes. There are … eggs.", ["no"]),
          feld("My grandparents haven't got … pets.", ["any"]),
          feld("There's … juice in the fridge. Help yourself!", ["some"]),
          feld("Sorry, I've got … time today. Let's meet tomorrow.", ["no"])
        ], { hinweis: H_SOME }),
        f("Place and time: Put the words in brackets in the right order.", [
          feld("My mum is going to pick me up … (at five o'clock / at the sports centre)", ortZeit("My mum is going to pick me up", "at the sports centre at five o'clock").concat(["at the sports centre at 5 o'clock"])),
          feld("We had dinner … (last Saturday / in a small restaurant)", ortZeit("We had dinner", "in a small restaurant last Saturday")),
          feld("Aaron is going to stay … (next summer / in Ireland)", ortZeit("Aaron is going to stay", "in Ireland next summer")),
          feld("Were you … (yesterday afternoon / at the swimming pool)?", ortZeit("Were you", "at the swimming pool yesterday afternoon").concat(["were you at the swimming pool yesterday afternoon?"]))
        ], { hinweis: H_ORT }),
        f("Complete the sentences with some-, any- or no- and -thing or -body.", [
          feld("I knocked at the door, but … opened it.", ["nobody", "no one", "no-one"]),
          feld("I didn't buy … in town – the shops were closed.", ["anything"]),
          feld("… has left a bag on the bus. Whose is it?", ["somebody", "someone"]),
          feld("We didn't meet … on our walk. The park was empty.", ["anybody", "anyone"]),
          feld("I've got … to tell you – it's a secret!", ["something"])
        ], { hinweis: H_BODY }),
        f("Travel, pictures and feelings: Complete the words.", [
          feld("You only want to go to the city, not back. You need a … ticket.", ["single"]),
          feld("The mountains are behind the people – they're in the … of the picture.", ["background"]),
          feld("I don't know what to do. Can you give me some …?", ["advice"])
        ], { hinweis: "Wörter der Unit 3: Fahrkarten (single / return), Bildbeschreibung (foreground, background), Ratschläge (advice, should)." }),
        m("How do they feel? Match the situations and the feelings.", [["You've worked in the garden all day.", "tired"], ["It's raining again, and you can't go out – for the fifth day!", "fed up"], ["Your team has won the final!", "happy"], ["You're going to sing in front of the whole school tonight.", "nervous"]])
      ]),
      ...teil("D Mediation", [
        R ? a("You are at home in Bavaria. Your Irish friend Eabha (12) is staying with your family. She doesn't speak German. Your dad wants to go to this park with you and Eabha on a Saturday in July. Eabha asks you questions about the flyer. Answer her questions in English. (Beantworte Eabhas Fragen auf Englisch – kurze Sätze genügen.)", [
          kr("im Juli geöffnet: täglich von 9 bis 17 Uhr", 1, "from nine to five / from 9 a.m. to 5 p.m. – beide Zeiten"),
          kr("Eintritt für alle drei: 18 Euro (Papa 8 Euro, Eabha und du je 5 Euro)", 2, "2 Punkte: 18 Euro oder alle drei Preise richtig zusammengezählt · 1 Punkt: die Einzelpreise richtig, aber nicht oder falsch zusammengezählt; Euro"),
          kr("Fütterung der Wölfe: um 11 Uhr", 1, "at eleven o'clock / at 11 a.m."),
          kr("nein: die Ziegen nur mit Futter aus dem Automaten füttern", 1, "Nein mit Grund (only food from the machine / no other food); 1 Euro muss nicht genannt sein"),
          kr("nein: Hunde sind nicht erlaubt", 1),
          kr("ja: Gasthaus am Eingang oder Picknickplatz am Weiher", 1, "eines genügt (restaurant, warm food, cake, picnic, lake/pond)"),
          kr(SM, 1)
        ], "1. In July it's open every day from 9 a.m. to 5 p.m. 2. My dad pays 8 euros, you and I pay 5 euros each – that's 18 euros together. 3. The wolves get their food at 11 o'clock. 4. No, you can't. You can only give them food from the machine. 5. No, dogs aren't allowed in the park. 6. Yes, there's a restaurant at the entrance, and there's a picnic place at the lake.",
        ["9|nine|5|five|17", "18|eighteen", "11|eleven|wolf|wolves", "no|machine|only|food", "dog|no|not", "restaurant|picnic|cake|food|lunch"],
        { vorgabe: B_INFO, teile: [
          { label: "„When is the park open in July?“", hilfe: "It's open every day from … to …" },
          { label: "„What does it cost for your dad, you and me?“", hilfe: "My dad pays …, you and I pay … – together that's …" },
          { label: "„When can we watch the wolves?“", hilfe: "The wolves get their food at …" },
          { label: "„Can I give the goats some of my apple?“", hilfe: "Yes / No, …" },
          { label: "„Can we take your dog with us?“", hilfe: "Yes / No, …" },
          { label: "„Can we have lunch there?“", hilfe: "Yes, there's …" }
        ] })
        : a("Your Irish friend Eabha (12) is staying with your family in Bavaria. She doesn't speak German. Your dad wants to go to this park with you and Eabha on a Saturday in July. Eabha has found the flyer and wants to know: When is the park open? · What does it cost for the three of us? · What can we see and do there? · How do we get there? Tell her the important things in English (4 to 6 sentences). Do not translate word for word.", [
          kr("im Juli geöffnet: täglich von 9 bis 17 Uhr", 1, "beide Zeiten"),
          kr("Eintritt für alle drei: 18 Euro (Papa 8 Euro, Eabha und du je 5 Euro)", 2, "2 Punkte: 18 Euro oder alle drei Preise richtig · 1 Punkt: Einzelpreise richtig, aber nicht oder falsch zusammengezählt; Euro"),
          kr("sehen und machen: Fütterung der Wölfe um 11 Uhr, der Bären um 14.30 Uhr, Ziegen und Schafe im Streichelgehege mit Futter aus dem Automaten füttern", 2, "2 Punkte: zwei Dinge (mit Uhrzeit bei den Fütterungen) · 1 Punkt: eines davon"),
          kr("Anfahrt: Bus Linie 7 ab Marktplatz (15 Minuten), am Wochenende nur alle zwei Stunden", 2, "2 Punkte: Bus 7 und eine weitere Angabe (vom Marktplatz, Fahrzeit, am Wochenende nur alle zwei Stunden) · 1 Punkt: nur der Bus"),
          kr(SM + " (Hunde, Essen und die Winterzeiten sind nicht gefragt)", 1)
        ], "In July the park is open every day from nine to five. For the three of us it costs eighteen euros: my dad pays eight euros, and you and I pay five euros each. At eleven o'clock the wolves get their food, and at half past two the bears. You can also feed the goats, but only with food from the machine. We can take the number seven bus from the market square – but on Saturdays it only goes every two hours.",
        ["9|nine|5|five|17", "18|eighteen|8|eight", "wolf|wolves|bear|goat|sheep|feed", "bus|7|seven", "market|15|fifteen|two hours|weekend|saturday"],
        { vorgabe: B_INFO }),
        a(R ? "Your dad wants you to tell Eabha two things. Tell her in English. (Sag es Eabha auf Englisch.)" : "Your dad wants you to tell Eabha two things. Tell her in English.", [
          kr("sagt, dass ihr am Samstag um 9 Uhr am Marktplatz auf den Bus wartet", 1, "We're going to wait for the bus at the market square at nine o'clock on Saturday. – Treffpunkt und Uhrzeit" + BITTE),
          kr("sagt, dass sie feste Schuhe anziehen soll", 1, "You should wear good / strong / walking shoes (boots)." + BITTE)
        ], "My dad says we're going to wait for the bus at the market square at nine o'clock on Saturday. And you should wear good shoes.", ["nine|9|market|bus", "shoe|boot"],
        { vorgabe: B_PAPA, ...(R ? { hilfe: "My dad says we're going to … at … · You should wear …" } : {}) })
      ]),
      ...teil("E Writing", [
        s(R ? "An e-mail with advice: Your Irish e-friend Orlaith has written to you: “My best friend Fiadh has moved to another town. Now nobody sits next to me at school, and I'm really fed up. What should I do?” Write an e-mail to her (40 to 70 words). Use the plan. Write about: that you understand her (I'm sorry that … / I know how you feel.) · one piece of advice (You should …) · another piece of advice (Why don't you …?) · how she can see or talk to Fiadh (You can … at the weekend / by bus) · a question to Orlaith. (Schreibe eine E-Mail mit 40 bis 70 Wörtern.)"
          : "An e-mail with advice: Your Irish e-friend Orlaith has written to you: “My best friend Fiadh has moved to another town. Now nobody sits next to me at school, and I'm really fed up. What should I do?” Write an e-mail to her (60 to 100 words). Write about: show that you understand how she feels · give two pieces of advice (You should … / Why don't you …?) · an idea how she can stay in contact with Fiadh or visit her · a question to Orlaith.", [
          kr("Inhalt", 5, "alle fünf Punkte des Auftrags – je Punkt 1: zeigt Verständnis (I'm sorry … / I know how you feel) · ein Rat (You should …) · ein zweiter, anderer Rat (Why don't you …? / You can …) · wie sie Fiadh sehen, anrufen oder besuchen kann · eine Frage an Orlaith (die Satzformen bewertet die Zeile Grammatik)"),
          kr("Textsorte und Aufbau", 2, "E-Mail an eine Freundin: Anrede (Hi Orlaith / Dear Orlaith), sinnvolle Reihenfolge, Schluss (Write soon! / Take care! / Best wishes) und Name; Sätze verbunden (and, but, because)"),
          kr("Grammatik", 3, "Ratschläge (You should … / Why don't you …?), some/any/no und Zusammensetzungen (somebody, nobody, anything …) sowie simple present erkennbar richtig gebildet; Fehler stören das Verstehen kaum" + (R ? "; in R7 genügen kurze, einfache Sätze" : "")),
          kr("Wortschatz", 2, "passende Wörter der Unit für Gefühle und Ratschläge (fed up, sad, lonely, worried, happy, advice, should, to try, chance, positive, to invite …), nicht nur nice und good"),
          kr("Rechtschreibung", 2, "häufige Wörter und die Wörter der Unit sind meist richtig geschrieben", { rs: true })
        ], { minWoerter: R ? 30 : 50, plan: R ? [
          { id: "start", label: "Start", hilfe: "Hi Orlaith, thank you for your e-mail." },
          { id: "feel", label: "Show that you understand her.", hilfe: "I'm sorry that … / I know how you feel." },
          { id: "advice1", label: "Advice 1", hilfe: "You should talk to … / You should join …" },
          { id: "advice2", label: "Advice 2", hilfe: "Why don't you invite somebody …?" },
          { id: "fiadh", label: "How can she see or talk to Fiadh?", hilfe: "You can call Fiadh every … / You can take the bus to …" },
          { id: "question", label: "Ask Orlaith a question.", hilfe: "How is your …? / Have you got any …?" },
          { id: "end", label: "End", hilfe: "Write soon! Take care, …" }
        ] : [
          { id: "start", label: "Start", hilfe: "Hi Orlaith, …" },
          { id: "feel", label: "I understand you", hilfe: "I'm sorry … / I know …" },
          { id: "advice1", label: "Advice 1", hilfe: "You should …" },
          { id: "advice2", label: "Advice 2", hilfe: "Why don't you …?" },
          { id: "fiadh", label: "Staying in contact with Fiadh", hilfe: "call, visit, bus, train …" },
          { id: "question", label: "Question to Orlaith", hilfe: "…?" },
          { id: "end", label: "End", hilfe: "Write soon! …" }
        ] })
      ])
    ]
  });
}

const p3ra = fassungA("R"), p3ma = fassungA("M"), p3rb = fassungB("R"), p3mb = fassungB("M");
module.exports = { p3ra, p3rb, p3ma, p3mb };
