"use strict";

/**
 * Deutsch 7 · Probe 3: Sachtext II – Zusammenfassung (Wichtiges von Einzelheiten unterscheiden, Gliederung,
 * Angaben aus dem Text, ein Diagramm oder eine Tabelle auswerten, eine Zusammenfassung schreiben).
 * LehrplanPLUS D7 2.1 (Abschnitte und Gliederung erkennen, kontinuierliche und diskontinuierliche Texte erschließen),
 * 2.3 (pragmatische Texte: Informationen entnehmen, Diagramme – M7 auch Tabellen – auswerten), 3.2 (zusammenfassen).
 * R7: 30 Punkte · M7: 34 Punkte · etwa 45 Minuten. Alle Texte eigenständig für GRUMI erstellt.
 * Die Zahlen in Diagrammen und Tabellen stammen aus erfundenen Umfragen an erfundenen Schulen bzw. in einem
 * erfundenen Verein (im Text jeweils als Umfrage benannt). Variante A hat ein Diagramm, Variante B eine Tabelle –
 * beide mit sechs Werten bei 100 Befragten.
 * Bleibt auf dem Server (Lösungen). Bausteine: bau.js.
 */
const { c, m, f, feld, a, kr, s, text, tabelle, diagramm, probe } = require("./bau");

/* ------------------------------ Texte ------------------------------ */
const ESSEN = text("t1", "Zu viel Essen landet im Müll", "Sachtext", [
  "Ein halbes Brot, zwei weiche Tomaten, ein Rest Nudeln vom Vortag: So etwas landet in vielen Küchen im Abfalleimer. Das klingt nach wenig. Zusammengerechnet werfen die Menschen in Deutschland aber jedes Jahr mehrere Millionen Tonnen Lebensmittel weg. Der größte Teil davon kommt nicht aus Supermärkten oder Gaststätten, sondern aus ganz normalen Haushalten.",
  "Wie kommt es dazu? Oft kaufen wir mehr ein, als wir brauchen, zum Beispiel weil eine große Packung billiger ist. Manches wird falsch gelagert und verdirbt deshalb schneller. Häufig wird auch zu viel gekocht. Die Reste stehen dann so lange im Kühlschrank, bis niemand sie mehr essen mag. Besonders oft trifft es Obst, Gemüse und Brot. Ob das auch in ihren Familien so ist, wollte eine 7. Klasse der Mühlbach-Schule wissen. Sie hat dazu 100 Schülerinnen und Schüler befragt (siehe Diagramm).",
  "Ein weiterer Grund ist ein Missverständnis. Auf fast jeder Packung steht ein Mindesthaltbarkeitsdatum. Viele Menschen glauben, dass ein Lebensmittel nach diesem Tag schlecht ist. Das stimmt aber nicht. Das Datum sagt nur, bis wann der Hersteller verspricht, dass Geschmack und Aussehen gleich bleiben. Joghurt, Nudeln oder Reis sind oft noch lange danach in Ordnung. Anders ist es beim Verbrauchsdatum, das zum Beispiel auf Hackfleisch steht. Ist dieser Tag vorbei, soll man das Lebensmittel nicht mehr essen.",
  "Weggeworfenes Essen ist mehr als nur Abfall. Damit ein Brot entsteht, muss zuerst Getreide wachsen. Dafür braucht man Ackerboden, Wasser und Dünger. Später wird das Korn gemahlen, der Teig gebacken und das fertige Brot in den Laden gefahren. Das alles kostet Energie. Landet das Brot im Müll, war der ganze Aufwand umsonst. Außerdem wirft jede Familie auf diese Weise Geld weg.",
  "Dabei kann jeder etwas dagegen tun. Wer vor dem Einkaufen in den Kühlschrank schaut und einen Einkaufszettel schreibt, kauft nur, was wirklich fehlt. Brot hält sich viel länger, wenn man einen Teil davon einfriert. Aus Resten lassen sich neue Gerichte machen, etwa eine Gemüsepfanne oder ein Auflauf. Und bevor ein Joghurt nur wegen des Datums im Müll landet, gilt: erst anschauen, dann riechen, dann vorsichtig probieren."
]);
const ESSEN_DIAGRAMM = diagramm("t2", "Umfrage: Was wird bei euch zu Hause am häufigsten weggeworfen?", "Personen", [
  ["Joghurt", 9], ["Brot", 27], ["Wurst", 6], ["Gemüse", 22], ["gekochte Reste", 16], ["Obst", 20]
], { hinweis: "Umfrage an der Mühlbach-Schule: Befragt wurden 100 Schülerinnen und Schüler. Jede Person hat genau eine Antwort gegeben." });

const BUECHEREI = text("t1", "Bücher zum Mitnehmen – die Schulbücherei", "Sachtext", [
  "Ein neues Jugendbuch kostet im Laden oft mehr als zehn Euro. Wer viel liest, braucht also viel Taschengeld – oder eine Bücherei. Viele Schulen haben eine eigene Schulbücherei. Dort stehen Hunderte Bücher, Comics und Zeitschriften bereit. Alle Schülerinnen und Schüler dürfen sie kostenlos ausleihen.",
  "Das Ausleihen geht schnell. Zuerst braucht man einen Ausweis, den man in der Bücherei bekommt. Jedes Buch trägt einen Aufkleber mit einem Strichcode. An der Theke wird dieser Code gescannt, ähnlich wie an der Kasse im Supermarkt. Der Computer speichert dann, wer das Buch mitgenommen hat und wann es zurück sein muss. Oft darf man ein Buch drei Wochen behalten. Wer länger braucht, kann die Zeit verlängern lassen. Wichtig ist, dass man das Buch pünktlich und sauber zurückbringt, denn andere wollen es auch noch lesen.",
  "Damit man in den Regalen etwas findet, hat jedes Buch seinen festen Platz. Sachbücher sind nach Themen geordnet, zum Beispiel Tiere, Technik oder Sport. Romane und andere Geschichten stehen meist nach dem Alphabet im Regal, und zwar nach dem Nachnamen der Autorin oder des Autors. Wer ein bestimmtes Buch sucht, kann im Katalog am Computer nachsehen oder das Büchereiteam fragen.",
  "Aber warum soll man überhaupt lesen? Lesen ist wie ein Training für den Kopf. Wer regelmäßig liest, wird dabei immer schneller und versteht auch schwierige Texte leichter. Nebenbei lernt man viele neue Wörter kennen. Das hilft nicht nur in Deutsch, sondern in jedem Fach, denn auch eine Aufgabe in Mathematik muss man zuerst genau lesen. Außerdem kann man beim Lesen abschalten und in fremde Welten eintauchen.",
  "In einer Bücherei findet fast jeder etwas, das zu ihm passt. Besonders beliebt sind bei Jugendlichen oft Comics, Fantasybücher und Krimis. Ob das auch an der Schule am Rosenhügel so ist, wollte das Büchereiteam dort wissen. Es hat 100 Schülerinnen und Schüler befragt (siehe Tabelle). Und wenn ein Buch doch langweilig ist? Dann bringt man es einfach zurück und sucht sich ein neues aus. Es kostet ja nichts."
]);
const BUECHEREI_TABELLE = tabelle("t2", "Umfrage: Was leihst du am liebsten aus?", ["Antwort", "Personen"], [
  ["Sachbücher", 15], ["Comics", 28], ["Hörbücher", 6], ["Fantasybücher", 23], ["Krimis", 19], ["Zeitschriften", 9]
], { hinweis: "Umfrage an der Schule am Rosenhügel: Befragt wurden 100 Schülerinnen und Schüler. Jede Person hat genau eine Antwort gegeben." });

const HANDY = text("t1", "Ein Schatz in der Schublade", "Sachtext", [
  "Das neue Smartphone ist da, das alte wandert in die Schublade – vielleicht braucht man es ja noch einmal. So denken viele. Nach Schätzungen liegen in Deutschland weit mehr als hundert Millionen ausgediente Handys ungenutzt herum. Dabei sind sie alles andere als wertloser Elektroschrott: In jedem Gerät stecken Rohstoffe, die an anderer Stelle dringend gebraucht werden.",
  "Ein Smartphone besteht aus mehreren Dutzend verschiedenen Stoffen. Gehäuse und Bildschirm sind vor allem aus Kunststoff, Glas und Aluminium. Im Inneren verbinden feine Leitungen aus Kupfer die Bauteile miteinander. An wichtigen Kontakten sitzt sogar eine hauchdünne Schicht Gold, denn Gold leitet Strom sehr gut und rostet nicht. Der Akku enthält Lithium und häufig auch Kobalt. Von jedem dieser Metalle steckt in einem einzelnen Gerät allerdings nur eine winzige Menge. Beim Gold ist es viel weniger als ein Gramm.",
  "Um diese Metalle zu gewinnen, ist ein enormer Aufwand nötig. Sie werden in vielen Ländern der Welt aus der Erde geholt, meist in Bergwerken und oft Tausende Kilometer von uns entfernt. Für wenige Gramm Metall müssen dabei häufig riesige Mengen Gestein bewegt und zerkleinert werden. Das verbraucht viel Wasser und Energie und hinterlässt zerstörte Landschaften. Hilfsorganisationen berichten außerdem, dass in manchen Abbaugebieten Menschen unter gefährlichen Bedingungen arbeiten, mitunter sogar Kinder. Hinzu kommt: Die Vorräte in der Erde sind begrenzt. Was einmal abgebaut ist, wächst nicht nach.",
  "Deshalb lohnt es sich, die Rohstoffe aus alten Geräten zurückzuholen. Fachleute nennen das Recycling. In speziellen Anlagen werden die Handys zerlegt und zerkleinert, anschließend trennt man die Stoffe voneinander. Kupfer, Gold und Silber lassen sich auf diese Weise zum größten Teil zurückgewinnen. Zusammengerechnet kommt dabei einiges heraus: In einer Tonne alter Handys steckt deutlich mehr Gold als in einer Tonne Gestein aus einem Goldbergwerk. Andere Stoffe gehen beim Recycling allerdings bis heute verloren, weil es zu aufwendig wäre, sie herauszulösen.",
  "Das alles funktioniert aber nur, wenn die Geräte auch abgegeben werden. Annehmen müssen sie die Wertstoffhöfe der Gemeinden und viele Geschäfte, die Elektrogeräte verkaufen – und zwar kostenlos. In den Hausmüll dürfen Handys nicht: Das ist verboten, und beschädigte Akkus können im Müllwagen sogar einen Brand auslösen. Was mit ausgedienten Handys tatsächlich geschieht, wollte eine 7. Klasse der Mittelschule am Weiherfeld genauer wissen. Sie befragte dazu 100 Jugendliche ihrer Schule (siehe Diagramm).",
  "Noch besser als jedes Recycling ist es allerdings, ein Handy möglichst lange zu benutzen. Denn der größte Teil der Umweltbelastung entsteht bei der Herstellung, nicht beim späteren Gebrauch. Ein gesprungenes Display oder ein schwacher Akku lassen sich oft reparieren. Wer sein Gerät trotzdem ersetzt, kann das alte weitergeben oder verkaufen, solange es noch funktioniert. Dann bleibt es einige Jahre länger in Gebrauch, und es muss dafür kein neues Gerät gebaut werden. Vorher sollte man alle persönlichen Daten löschen und die SIM-Karte herausnehmen."
]);
const HANDY_DIAGRAMM = diagramm("t2", "Umfrage: Was ist mit deinem letzten alten Handy geschehen?", "Personen", [
  ["verkauft", 13], ["liegt zu Hause herum", 44], ["in den Hausmüll geworfen", 4], ["an jemanden weitergegeben", 22], ["bei einer Sammelstelle abgegeben", 12], ["weiß ich nicht mehr", 5]
], { hinweis: "Umfrage an der Mittelschule am Weiherfeld: Befragt wurden 100 Jugendliche. Jede Person hat genau eine Antwort gegeben." });

const EHRENAMT = text("t1", "Ohne sie läuft nichts – Ehrenamt im Sportverein", "Sachtext", [
  "Samstagmorgen, kurz vor neun: Auf dem Sportplatz werden Tore aufgestellt, in der Halle stehen die Bänke bereit, und im Vereinsheim duftet es nach frischem Kaffee. Dass all das klappt, ist kein Zufall. Dahinter stehen Menschen, die ihre Freizeit dafür einsetzen. Sie arbeiten ehrenamtlich, das heißt freiwillig und ohne Lohn. In Deutschland gibt es Zehntausende Sportvereine, und kaum einer von ihnen käme ohne solche Helferinnen und Helfer aus.",
  "Die Aufgaben im Verein sind vielfältig. Am bekanntesten sind die Trainerinnen und Trainer, die mehrmals in der Woche Übungsstunden leiten und ihre Mannschaften zu Wettkämpfen begleiten. Weniger sichtbar ist die Arbeit des Vorstands: Er plant, was im Verein geschieht, verwaltet das Geld der Mitglieder und kümmert sich um Hallenzeiten und Versicherungen. Dazu kommen Schiedsrichter, Platzwarte und alle, die bei Festen Kuchen verkaufen oder Kinder zu Auswärtsspielen fahren.",
  "Was diese Arbeit wert ist, merkt man erst, wenn man sie bezahlen müsste. Würde ein Verein alle Aufgaben an bezahlte Kräfte vergeben, müssten die Mitgliedsbeiträge stark steigen. Manche Familien könnten sich den Sport ihrer Kinder dann nicht mehr leisten. Das Ehrenamt sorgt also dafür, dass Sport für alle bezahlbar bleibt. Zwar erhalten manche Ehrenamtliche eine kleine Entschädigung, etwa für ihre Fahrtkosten. Ein Lohn ist das aber nicht.",
  "Warum übernehmen Menschen solche Aufgaben? Den meisten macht es Freude, ihr Können weiterzugeben und zu sehen, wie Kinder Fortschritte machen. Sie schätzen außerdem die Gemeinschaft im Verein. Hinzu kommt, dass man im Ehrenamt vieles lernt, was auch außerhalb des Sports nützt: vor einer Gruppe zu sprechen, Verantwortung zu tragen oder ein Turnier zu planen. Wer sich später um einen Ausbildungsplatz bewirbt, kann damit zeigen, dass auf ihn Verlass ist.",
  "Trotzdem machen sich viele Vereine Sorgen. Sie finden immer schwerer Menschen, die ein Amt für längere Zeit übernehmen wollen. Berufstätige haben oft wenig Zeit, und auch bei Jugendlichen ist der Terminkalender durch Schule und Hobbys voll. Viele helfen zwar gern bei einem einzelnen Fest, möchten sich aber nicht für Jahre festlegen. Vor allem fehlt der Nachwuchs: Hören die Älteren eines Tages auf, bleibt ihre Aufgabe oft unbesetzt. Wie es bei ihm selbst aussieht, wollte der Sportverein TSV Sonnenfeld genau wissen. Er hat seine 100 Ehrenamtlichen nach ihrem Alter gefragt (siehe Tabelle).",
  "Um junge Leute zu gewinnen, gehen viele Vereine neue Wege. Sie teilen große Ämter in kleinere Aufgaben auf, die sich auch mit wenig Zeit bewältigen lassen. Jugendliche dürfen früh mithelfen, zum Beispiel im Kindertraining an der Seite einer erfahrenen Trainerin. Viele Sportverbände bieten dafür eigene Lehrgänge an. In manchen Vereinen gibt es außerdem ein Jugendteam, das Turniere und Ausflüge selbst organisiert. Und manchmal genügt schon eine einfache Frage: Wer persönlich angesprochen wird, sagt erfahrungsgemäß viel eher Ja als jemand, der nur einen Aushang liest."
]);
const EHRENAMT_TABELLE = tabelle("t2", "Umfrage: Wie alt sind die Ehrenamtlichen im Verein?", ["Alter", "Personen"], [
  ["unter 20 Jahre", 5], ["20 bis 29 Jahre", 9], ["30 bis 39 Jahre", 13], ["40 bis 49 Jahre", 21], ["50 bis 59 Jahre", 24], ["60 Jahre und älter", 28]
], { hinweis: "Umfrage im Sportverein TSV Sonnenfeld: Befragt wurden alle 100 Ehrenamtlichen des Vereins." });

/* ------------------------------ Aufgaben ------------------------------ */
const UEBERSCHRIFTEN = "Jeder Abschnitt des Textes hat ein eigenes Thema. Ordne jedem Abschnitt die passende Überschrift zu.";
const UEBERSCHRIFTEN_M = "Vier der sechs Abschnitte haben hier schon eine Überschrift. Ordne jedem dieser Abschnitte die passende Überschrift zu.";
const UEBERSCHRIFT_TIPP = "Notiere dir zu jedem Abschnitt ein Stichwort: Wovon handelt er? Vergleiche dein Stichwort dann mit den Überschriften.";
const WICHTIG = "Für eine Zusammenfassung brauchst du nur das Wichtigste. Entscheide bei jeder Aussage: Ist sie wichtig für die Zusammenfassung oder nur eine Einzelheit?";
const W = "wichtig für die Zusammenfassung", E = "Einzelheit";
const WICHTIG_TIPP = "Frage dich bei jeder Aussage: Würde in der Zusammenfassung etwas fehlen, wenn ich sie weglasse? Beispiele, Namen und einzelne Zahlen kann man weglassen.";
const WOERTER_R = "Ergänze die Schlüsselwörter aus dem Text. Schreibe in jedes Feld nur ein Wort.";
const WOERTER_M = "Ergänze die Schlüsselwörter aus dem Text. In jedes Feld gehört nur ein Wort.";
const WOERTER_TIPP = "Suche im Text das Wort, das in der Frage auffällt, und lies dort den ganzen Satz genau.";
const RECHNE_TIPP = "Lies die Werte genau ab und schreibe sie dir auf. „Wie viele mehr“ heißt: größerer Wert minus kleinerer Wert.";
const THEMA_TIPP = "Das Thema passt zum ganzen Text. Prüfe bei jeder Antwort, ob wirklich alle Abschnitte davon handeln.";
const ABSICHT_TIPP = "Frage dich: Will der Text vor allem informieren, zu etwas auffordern, unterhalten oder für etwas werben?";

// Bewertungsraster der Zusammenfassung: Die Zeile „Inhalt“ ist je Text verschieden, der Rest gleich.
const NUR_WICHTIGES = (beispiele) => kr("Nur das Wichtigste", 2, "2 Punkte: keine Einzelheiten und Beispiele (z. B. " + beispiele + "), keine eigene Meinung, nichts, was nicht im Text steht; die Länge passt ungefähr. 1 Punkt: einzelne unnötige Einzelheiten oder ein Satz mit eigener Meinung. 0 Punkte: viele Einzelheiten, der Text wird Satz für Satz nacherzählt oder ist viel zu lang.");
const FORM_R = kr("Form und Sprache", 3, "Je 1 Punkt: Der Einleitungssatz nennt Titel oder Textsorte und das Thema · mit eigenen Worten geschrieben (keine ganzen Sätze abgeschrieben) · sachlich und im Präsens.");
const FORM_M = kr("Form und Sprache", 4, "Je 1 Punkt: Der Einleitungssatz nennt Titel oder Textsorte und das Thema · mit eigenen Worten geschrieben (keine ganzen Sätze abgeschrieben) · sachlich und im Präsens · zusammenhängend: sinnvolle Reihenfolge, die Sätze sind miteinander verknüpft.");
const RICHTIG = kr("Sprachrichtigkeit", 2, "Rechtschreibung, Grammatik und Zeichensetzung. 2 Punkte: wenige Fehler. 1 Punkt: mehrere Fehler, der Text bleibt aber gut lesbar. 0 Punkte: sehr viele Fehler.", { rs: true });

// R7, Variante A – „Zu viel Essen landet im Müll“ (Abschnitte: 1–7 · 8–16 · 17–25 · 26–32 · 33–40), Diagramm
const R_A = [
  c("Welches Thema hat der Text?", [
    "Warum viele Lebensmittel im Müll landen und was man dagegen tun kann",
    "Wie man im Supermarkt möglichst billig und gesund einkauft",
    "Warum Obst und Gemüse gesünder sind als Brot und Nudeln",
    "Wie der Müll in Deutschland getrennt und abgeholt wird"], 0, { text: "t1", hinweis: THEMA_TIPP }),
  m(UEBERSCHRIFTEN, [
    ["Abschnitt 1 (Z. 1–7)", "Kleine Reste, große Mengen"],
    ["Abschnitt 2 (Z. 8–16)", "Gründe aus dem Alltag"],
    ["Abschnitt 3 (Z. 17–25)", "Ein Datum wird falsch verstanden"],
    ["Abschnitt 4 (Z. 26–32)", "Warum das ein Problem ist"],
    ["Abschnitt 5 (Z. 33–40)", "So landet weniger im Müll"]], { points: 3, text: "t1", hinweis: UEBERSCHRIFT_TIPP }),
  m(WICHTIG, [
    ["Im Abfalleimer liegen zwei weiche Tomaten.", E],
    ["Die meisten weggeworfenen Lebensmittel stammen aus Haushalten.", W],
    ["Die Umfrage fand an der Mühlbach-Schule statt.", E],
    ["Oft wird mehr eingekauft und gekocht, als gebraucht wird.", W],
    ["Das Datum auf der Packung bedeutet meist nicht, dass das Essen schlecht ist.", W],
    ["Eine große Packung ist oft billiger als eine kleine.", E]], { points: 3, text: "t1", hinweis: WICHTIG_TIPP }),
  f(WOERTER_R, [
    feld("Nach diesem Datum soll man ein Lebensmittel nicht mehr essen:", ["Verbrauchsdatum", "das Verbrauchsdatum", "dem Verbrauchsdatum", "nach dem Verbrauchsdatum", "Verbrauchs-Datum", "Verbrauchsdatums"]),
    feld("Manches verdirbt schneller, weil es falsch … wird:", ["gelagert", "falsch gelagert", "gelagert wird", "lagern", "gelagerte", "aufbewahrt", "falsch aufbewahrt"]),
    feld("Das schreibt man am besten vor dem Einkaufen:", ["Einkaufszettel", "einen Einkaufszettel", "ein Einkaufszettel", "den Einkaufszettel", "Einkaufs-Zettel", "Einkaufsliste", "eine Einkaufsliste", "Zettel", "einen Zettel"])
  ], { text: "t1", hinweis: WOERTER_TIPP }),
  f("Lies im Diagramm ab und ergänze.", [
    feld("Dieses Lebensmittel wurde am seltensten genannt:", ["Wurst", "die Wurst", "Wurst (6)", "Wurst 6", "Wurst mit 6"]),
    feld("So viele Schülerinnen und Schüler mehr nannten Gemüse als Joghurt:", ["13", "dreizehn", "13 mehr", "13 Schüler", "13 Schülerinnen und Schüler", "13 Personen", "13 Kinder", "13 Befragte", "+13", "+ 13"])
  ], { text: "t2", hinweis: RECHNE_TIPP }),
  a("Im Text steht: „Besonders oft trifft es Obst, Gemüse und Brot“ (Z. 13). Prüfe mit dem Diagramm, ob das auch bei der Umfrage an der Mühlbach-Schule so ist. Begründe: Nenne Zahlen aus dem Diagramm und vergleiche sie mit den anderen Antworten.", [
    kr("Entscheidung passt zum Diagramm", 1, "Ja – die Aussage gilt auch für die Umfrage."),
    kr("passende Zahlen genannt", 1, "Mindestens zwei der drei Werte richtig abgelesen: Brot 27, Gemüse 22, Obst 20 (oder zusammen 69 von 100)."),
    kr("mit den anderen Antworten verglichen", 1, "Das sind die drei höchsten Werte; gekochte Reste (16), Joghurt (9) und Wurst (6) wurden seltener genannt. Ein richtiger Vergleich genügt.")
  ], "Ja, das stimmt auch dort. Brot wurde von 27, Gemüse von 22 und Obst von 20 Befragten genannt. Das sind die drei höchsten Werte. Joghurt nannten nur 9 und Wurst nur 6.",
  ["ja|stimmt|passt|richtig", "27|22|20|69", "höchst|meisten|häufigsten|seltener|weniger|nur 6|nur 9|nur 16"], { text: "t2", hilfe: "So kannst du beginnen: Das stimmt (nicht), denn im Diagramm …" }),
  a("Im Text steht: „Weggeworfenes Essen ist mehr als nur Abfall“ (Z. 26). Erkläre mit eigenen Worten, was damit gemeint ist.", [
    kr("zwei passende Angaben aus dem Text", 2, "Für ein Lebensmittel braucht man Ackerboden, Wasser und Dünger; Mahlen, Backen und der Transport kosten Energie. Zwei Angaben: 2 Punkte, eine Angabe: 1 Punkt."),
    kr("erklärt, was der Satz bedeutet", 1, "Landet das Essen im Müll, war dieser ganze Aufwand umsonst (verschwendet); außerdem wird Geld weggeworfen.")
  ], "Für ein Brot braucht man Ackerboden, Wasser und viel Energie. Wenn man es wegwirft, war das alles umsonst. Man verschwendet also viel mehr als nur das Brot und dazu noch Geld.",
  ["wasser|boden|acker|dünger|energie", "umsonst|verschwend|vergeud|verloren|unnötig", "geld|aufwand|mühe|herstell|transport"], { text: "t1", zeilen: [26, 32], hilfe: "Lies die Zeilen 26 bis 32 noch einmal. So kannst du beginnen: Damit ist gemeint, dass …" }),
  s("Fasse den Sachtext „Zu viel Essen landet im Müll“ zusammen. Schreibe 60 bis 90 Wörter. Nimm nur das Wichtigste aus allen Abschnitten auf und schreibe mit eigenen Worten.", [
    kr("Inhalt", 5, "Je Kerninformation 1 Punkt: (1) In Deutschland werden sehr viele Lebensmittel weggeworfen, der größte Teil in den Haushalten. (2) Gründe: Es wird zu viel eingekauft oder gekocht, manches wird falsch gelagert. (3) Das Mindesthaltbarkeitsdatum wird oft falsch verstanden – viele Lebensmittel sind danach noch gut. (4) Das ist ein Problem, weil für Lebensmittel Boden, Wasser und Energie gebraucht werden und Geld verloren geht. (5) Was hilft: den Einkauf planen, Lebensmittel einfrieren, Reste verwerten, erst prüfen und dann wegwerfen."),
    NUR_WICHTIGES("Tomaten, Hackfleisch, Auflauf, Name der Schule, einzelne Zahlen aus dem Diagramm"),
    FORM_R, RICHTIG
  ], { minWoerter: 50, text: "t1", hilfe: "So kannst du beginnen: Der Sachtext „Zu viel Essen landet im Müll“ informiert darüber, …" })
];

// R7, Variante B – „Bücher zum Mitnehmen – die Schulbücherei“ (Abschnitte: 1–6 · 7–16 · 17–23 · 24–31 · 32–39), Tabelle
const R_B = [
  c("Welches Thema hat der Text?", [
    "Wie eine Schulbücherei funktioniert und warum sich Lesen lohnt",
    "Wie man selbst ein spannendes Buch schreiben kann",
    "Warum Bücher im Laden immer teurer werden",
    "Welche Bücher in der 7. Klasse gelesen werden müssen"], 0, { text: "t1", hinweis: THEMA_TIPP }),
  m(UEBERSCHRIFTEN, [
    ["Abschnitt 1 (Z. 1–6)", "Lesen, ohne zu bezahlen"],
    ["Abschnitt 2 (Z. 7–16)", "So leiht man ein Buch aus"],
    ["Abschnitt 3 (Z. 17–23)", "Wie man ein Buch findet"],
    ["Abschnitt 4 (Z. 24–31)", "Was Lesen bringt"],
    ["Abschnitt 5 (Z. 32–39)", "Für jeden ist etwas dabei"]], { points: 3, text: "t1", hinweis: UEBERSCHRIFT_TIPP }),
  m(WICHTIG, [
    ["In der Schulbücherei kann man Bücher kostenlos ausleihen.", W],
    ["Ein Jugendbuch kostet im Laden oft mehr als zehn Euro.", E],
    ["Bei den Sachbüchern gibt es das Thema Tiere.", E],
    ["Ausgeliehene Bücher muss man nach einer festen Zeit zurückbringen.", W],
    ["Die Umfrage fand an der Schule am Rosenhügel statt.", E],
    ["Die Bücher stehen nach einer festen Ordnung im Regal.", W]], { points: 3, text: "t1", hinweis: WICHTIG_TIPP }),
  f(WOERTER_R, [
    feld("Das braucht man, bevor man etwas ausleihen kann:", ["Ausweis", "einen Ausweis", "ein Ausweis", "den Ausweis", "Büchereiausweis", "einen Büchereiausweis", "Leseausweis", "einen Leseausweis"]),
    feld("Dieses Zeichen auf dem Aufkleber wird an der Theke gescannt:", ["Strichcode", "der Strichcode", "den Strichcode", "ein Strichcode", "einen Strichcode", "Strich-Code", "Code", "der Code", "Barcode", "der Barcode"]),
    feld("Dort kann man am Computer nach einem Buch suchen:", ["Katalog", "im Katalog", "der Katalog", "den Katalog", "dem Katalog", "Katalog am Computer", "im Katalog am Computer"])
  ], { text: "t1", hinweis: WOERTER_TIPP }),
  f("Lies in der Tabelle ab und ergänze.", [
    feld("Das wurde am seltensten als Antwort gegeben:", ["Hörbücher", "die Hörbücher", "Hörbuch", "Hörbücher (6)", "Hörbücher 6", "Hörbücher mit 6", "Hoerbuecher"]),
    feld("So viele Schülerinnen und Schüler mehr leihen am liebsten Fantasybücher aus als Zeitschriften:", ["14", "vierzehn", "14 mehr", "14 Schüler", "14 Schülerinnen und Schüler", "14 Personen", "14 Kinder", "14 Befragte", "+14", "+ 14"])
  ], { text: "t2", hinweis: RECHNE_TIPP }),
  a("Im Text steht: „Besonders beliebt sind bei Jugendlichen oft Comics, Fantasybücher und Krimis“ (Z. 33–34). Prüfe mit der Tabelle, ob das auch an der Schule am Rosenhügel so ist. Begründe: Nenne Zahlen aus der Tabelle und vergleiche sie mit den anderen Antworten.", [
    kr("Entscheidung passt zur Tabelle", 1, "Ja – die Aussage gilt auch für diese Schule."),
    kr("passende Zahlen genannt", 1, "Mindestens zwei der drei Werte richtig abgelesen: Comics 28, Fantasybücher 23, Krimis 19 (oder zusammen 70 von 100)."),
    kr("mit den anderen Antworten verglichen", 1, "Das sind die drei höchsten Werte; Sachbücher (15), Zeitschriften (9) und Hörbücher (6) wurden seltener genannt. Ein richtiger Vergleich genügt.")
  ], "Ja, das ist auch an dieser Schule so. Comics wurden von 28, Fantasybücher von 23 und Krimis von 19 Befragten genannt. Das sind die drei höchsten Werte. Zeitschriften nannten nur 9 und Hörbücher nur 6.",
  ["ja|stimmt|passt|richtig", "28|23|19|70", "höchst|meisten|häufigsten|seltener|weniger|nur 6|nur 9|nur 15"], { text: "t2", hilfe: "So kannst du beginnen: Das stimmt (nicht), denn in der Tabelle …" }),
  a("Im Text steht: „Lesen ist wie ein Training für den Kopf“ (Z. 24–25). Erkläre mit eigenen Worten, was damit gemeint ist.", [
    kr("zwei passende Angaben aus dem Text", 2, "Wer regelmäßig liest, wird schneller, versteht auch schwierige Texte leichter und lernt neue Wörter. Zwei Angaben: 2 Punkte, eine Angabe: 1 Punkt."),
    kr("erklärt, was der Satz bedeutet", 1, "Wie beim Sport wird man durch regelmäßiges Üben besser – hier beim Lesen und Verstehen; das hilft in jedem Fach.")
  ], "Beim Sport wird man besser, wenn man oft übt. Genauso ist es hier: Wer regelmäßig liest, wird schneller, versteht Texte leichter und lernt neue Wörter. Das hilft dann in allen Fächern.",
  ["schneller|leichter|flüssiger", "wörter|versteh|verstehen", "üben|übt|übung|sport|muskel|besser|fächer|jedem fach"], { text: "t1", zeilen: [24, 31], hilfe: "Lies die Zeilen 24 bis 31 noch einmal. So kannst du beginnen: Damit ist gemeint, dass …" }),
  s("Fasse den Sachtext „Bücher zum Mitnehmen – die Schulbücherei“ zusammen. Schreibe 60 bis 90 Wörter. Nimm nur das Wichtigste aus allen Abschnitten auf und schreibe mit eigenen Worten.", [
    kr("Inhalt", 5, "Je Kerninformation 1 Punkt: (1) In einer Schulbücherei können alle Schülerinnen und Schüler kostenlos Bücher ausleihen. (2) Ausleihe: Man braucht einen Ausweis, das Buch wird gescannt, und man muss es nach einer festen Zeit pünktlich zurückbringen. (3) Die Bücher stehen geordnet im Regal (Sachbücher nach Themen, Geschichten nach dem Alphabet); Katalog und Büchereiteam helfen beim Suchen. (4) Lesen lohnt sich: Man liest schneller, versteht Texte leichter und lernt neue Wörter – das hilft in jedem Fach. (5) In der Bücherei findet jeder etwas Passendes; gefällt ein Buch nicht, bringt man es einfach zurück."),
    NUR_WICHTIGES("Preis eines Buches, drei Wochen, Tiere und Technik, Name der Schule, einzelne Zahlen aus der Tabelle"),
    FORM_R, RICHTIG
  ], { minWoerter: 50, text: "t1", hilfe: "So kannst du beginnen: Der Sachtext „Bücher zum Mitnehmen – die Schulbücherei“ informiert darüber, …" })
];

// M7, Variante A – „Ein Schatz in der Schublade“ (Abschnitte: 1–7 · 8–16 · 17–27 · 28–37 · 38–46 · 47–56), Diagramm
const M_A = [
  c("Was will der Text vor allem?", [
    "Er informiert über die Rohstoffe in Handys und zeigt, warum man alte Geräte nicht liegen lassen sollte.",
    "Er wirbt dafür, sich möglichst oft ein neues Smartphone mit besserer Technik zu kaufen.",
    "Er erklärt Schritt für Schritt, wie man ein kaputtes Handy zu Hause selbst repariert.",
    "Er erzählt von der gefährlichen Arbeit der Menschen in einem Goldbergwerk."], 0, { text: "t1", hinweis: ABSICHT_TIPP }),
  m(UEBERSCHRIFTEN_M, [
    ["Abschnitt 1 (Z. 1–7)", "Vergessen, aber nicht wertlos"],
    ["Abschnitt 2 (Z. 8–16)", "Was in einem Smartphone steckt"],
    ["Abschnitt 4 (Z. 28–37)", "Aus Schrott werden Rohstoffe"],
    ["Abschnitt 5 (Z. 38–46)", "Wohin mit dem alten Gerät?"]], { points: 3, text: "t1", hinweis: UEBERSCHRIFT_TIPP }),
  a("Für die Abschnitte 3 (Z. 17–27) und 6 (Z. 47–56) fehlt noch eine Überschrift. Formuliere für jeden der beiden Abschnitte selbst eine kurze, treffende Überschrift.", [
    kr("Überschrift für Abschnitt 3", 2, "Thema des ganzen Abschnitts: Die Metalle zu gewinnen ist sehr aufwendig und schadet Umwelt und Menschen, z. B. „Der Abbau belastet Mensch und Natur“ oder „Metalle gewinnen – ein riesiger Aufwand“. 2 Punkte: nennt den Abbau (die Gewinnung) der Metalle und seinen Aufwand oder seine Folgen und ist kurz. 1 Punkt: nennt nur eine Einzelheit (z. B. nur „Kinderarbeit“ oder „Wasserverbrauch“), bleibt zu allgemein (nur „Metalle“) oder ist ein abgeschriebener ganzer Satz."),
    kr("Überschrift für Abschnitt 6", 2, "Thema des ganzen Abschnitts: Am besten nutzt man ein Handy möglichst lange (reparieren, weitergeben, verkaufen), z. B. „Lange nutzen ist am besten“ oder „Reparieren und weitergeben“. 2 Punkte: nennt das lange Nutzen (auch als Reparieren und Weitergeben) und ist kurz. 1 Punkt: nennt nur eine Einzelheit (z. B. nur „Daten löschen“), bleibt zu allgemein (nur „Handy“) oder ist ein abgeschriebener ganzer Satz.")
  ], "Abschnitt 3: Der Abbau belastet Mensch und Natur. Abschnitt 6: Lange nutzen ist am besten.",
  ["abbau|aufwand|bergwerk|umwelt|mensch und natur|gewinn|folgen", "lange|länger|reparier|weitergeben|nutzen|benutzen"], { text: "t1" }),
  m(WICHTIG, [
    ["Gold leitet Strom sehr gut und rostet nicht.", E],
    ["Ein Smartphone enthält viele verschiedene Stoffe, darunter wertvolle Metalle.", W],
    ["Aus alten Handys lassen sich Metalle zurückgewinnen.", W],
    ["Die Umfrage stammt von einer 7. Klasse.", E],
    ["Viele Abbaugebiete liegen Tausende Kilometer von uns entfernt.", E],
    ["Alte Handys gehören nicht in den Hausmüll, sondern müssen abgegeben werden.", W]], { points: 3, text: "t1", hinweis: WICHTIG_TIPP }),
  f(WOERTER_M, [
    feld("Dieses Metall steckt neben Lithium häufig im Akku:", ["Kobalt", "das Kobalt", "Cobalt"]),
    feld("Das können beschädigte Akkus im Müllwagen auslösen:", ["Brand", "einen Brand", "ein Brand", "Brände", "Brand auslösen", "Feuer", "ein Feuer"]),
    feld("Dabei entsteht der größte Teil der Umweltbelastung eines Handys:", ["Herstellung", "bei der Herstellung", "der Herstellung", "die Herstellung", "Herstellen", "beim Herstellen", "Produktion", "bei der Produktion"])
  ], { text: "t1", hinweis: WOERTER_TIPP }),
  f("Lies im Diagramm ab, rechne und ergänze.", [
    feld("So viele Jugendliche haben ihr altes Handy weitergegeben oder verkauft (zusammen):", ["35", "fünfunddreißig", "35 Jugendliche", "35 Personen", "35 Befragte", "35 Schüler"]),
    feld("So viele Jugendliche mehr haben ihr Handy weitergegeben, als es in den Hausmüll geworfen haben:", ["18", "achtzehn", "18 mehr", "18 Jugendliche", "18 Personen", "18 Befragte", "18 Schüler", "+18", "+ 18"])
  ], { text: "t2", hinweis: RECHNE_TIPP }),
  a("Im Text heißt es: „Das alles funktioniert aber nur, wenn die Geräte auch abgegeben werden“ (Z. 38–39). Erkläre mit Hilfe des Diagramms, wie gut das bei den befragten Jugendlichen klappt. Nenne zwei passende Zahlen und erkläre mit dem Text, was das für die Rohstoffe bedeutet.", [
    kr("Ergebnis des Diagramms richtig beurteilt", 1, "Es klappt noch nicht gut: Nur wenige haben ihr altes Handy bei einer Sammelstelle abgegeben; am häufigsten liegt es zu Hause herum."),
    kr("zwei passende Zahlen genannt", 2, "12 von 100 haben es bei einer Sammelstelle abgegeben · bei 44 liegt es zu Hause herum · 4 warfen es in den Hausmüll. Je passender, richtig abgelesener Zahl 1 Punkt."),
    kr("Bedeutung mit dem Text erklärt", 1, "Die Metalle in den nicht abgegebenen Handys können nicht zurückgewonnen werden (kein Recycling); sie müssen mit großem Aufwand neu abgebaut werden.")
  ], "Bei den befragten Jugendlichen klappt das noch nicht gut. Nur 12 von 100 haben ihr altes Handy bei einer Sammelstelle abgegeben, bei 44 liegt es zu Hause herum. Die Metalle in diesen Geräten können deshalb nicht zurückgewonnen werden und müssen neu abgebaut werden.",
  ["12|zwölf", "44|vierundvierzig", "zurückgew|verloren|neu ab|recycel|recycling|wiederverwert|ungenutzt"], { text: "t2" }),
  s("Schreibe eine Zusammenfassung des Sachtextes „Ein Schatz in der Schublade“. Umfang: 80 bis 120 Wörter. Beachte die Regeln für eine Zusammenfassung.", [
    kr("Inhalt", 6, "Je Kerninformation 1 Punkt: (1) Sehr viele alte Handys liegen ungenutzt herum, obwohl sie wertvolle Rohstoffe enthalten. (2) Ein Smartphone besteht aus vielen Stoffen, darunter Metalle wie Kupfer, Gold, Lithium und Kobalt – je Gerät nur in winzigen Mengen. (3) Diese Metalle zu gewinnen ist sehr aufwendig und schadet Umwelt und Menschen; die Vorräte sind begrenzt. (4) Durch Recycling lassen sich viele Metalle zurückgewinnen (aber nicht alle Stoffe). (5) Dafür muss man alte Geräte abgeben (Wertstoffhof, Geschäfte); in den Hausmüll dürfen sie nicht. (6) Am besten ist es, ein Handy möglichst lange zu nutzen (reparieren, weitergeben, verkaufen)."),
    NUR_WICHTIGES("Gold rostet nicht, eine Tonne Handys, die Umfrage der 7. Klasse, SIM-Karte, einzelne Zahlen aus dem Diagramm"),
    FORM_M, RICHTIG
  ], { minWoerter: 70, text: "t1" })
];

// M7, Variante B – „Ohne sie läuft nichts – Ehrenamt im Sportverein“ (Abschnitte: 1–8 · 9–17 · 18–25 · 26–33 · 34–44 · 45–54), Tabelle
const M_B = [
  c("Was will der Text vor allem?", [
    "Er informiert über die Arbeit der Ehrenamtlichen im Sportverein und zeigt, warum neue Helfer gebraucht werden.",
    "Er fordert, dass alle Trainerinnen und Trainer endlich einen richtigen Lohn bekommen.",
    "Er erzählt von einem spannenden Fußballturnier an einem Samstagmorgen im Herbst.",
    "Er wirbt mit vielen Angeboten um neue Mitglieder für den TSV Sonnenfeld."], 0, { text: "t1", hinweis: ABSICHT_TIPP }),
  m(UEBERSCHRIFTEN_M, [
    ["Abschnitt 1 (Z. 1–8)", "Nichts klappt von allein"],
    ["Abschnitt 2 (Z. 9–17)", "Wer was im Verein erledigt"],
    ["Abschnitt 4 (Z. 26–33)", "Was Ehrenamtliche selbst davon haben"],
    ["Abschnitt 5 (Z. 34–44)", "Helfer werden knapp"]], { points: 3, text: "t1", hinweis: UEBERSCHRIFT_TIPP }),
  a("Für die Abschnitte 3 (Z. 18–25) und 6 (Z. 45–54) fehlt noch eine Überschrift. Formuliere für jeden der beiden Abschnitte selbst eine kurze, treffende Überschrift.", [
    kr("Überschrift für Abschnitt 3", 2, "Thema des ganzen Abschnitts: Erst das Ehrenamt macht den Sport für alle bezahlbar – bezahlte Kräfte würden die Beiträge stark erhöhen, z. B. „Unbezahlt, aber viel wert“ oder „Ehrenamt hält den Sport bezahlbar“. 2 Punkte: nennt den Wert der unbezahlten Arbeit oder dass Sport dadurch bezahlbar bleibt, und ist kurz. 1 Punkt: nennt nur eine Einzelheit (z. B. nur „Fahrtkosten“), bleibt zu allgemein (nur „Ehrenamt“) oder ist ein abgeschriebener ganzer Satz."),
    kr("Überschrift für Abschnitt 6", 2, "Thema des ganzen Abschnitts: Wie Vereine junge Leute für das Ehrenamt gewinnen (kleinere Aufgaben, früh mithelfen, Lehrgänge, persönlich ansprechen), z. B. „Neue Wege zum Nachwuchs“ oder „So gewinnen Vereine junge Helfer“. 2 Punkte: nennt das Gewinnen junger Leute (neuer Helfer) und ist kurz. 1 Punkt: nennt nur eine Einzelheit (z. B. nur „Lehrgänge“ oder „Jugendteam“), bleibt zu allgemein (nur „Vereine“) oder ist ein abgeschriebener ganzer Satz.")
  ], "Abschnitt 3: Unbezahlt, aber viel wert. Abschnitt 6: So gewinnen Vereine junge Helfer.",
  ["wert|bezahl|geld|beitr|kosten|teuer", "nachwuchs|junge|jugend|gewinnen|neue wege|helfer|ansprechen"], { text: "t1" }),
  m(WICHTIG, [
    ["Ehrenamtliche arbeiten freiwillig und ohne Lohn.", W],
    ["Am Samstagmorgen werden auf dem Sportplatz Tore aufgestellt.", E],
    ["Bei Vereinsfesten wird Kuchen verkauft.", E],
    ["Im Verein gibt es viele verschiedene Aufgaben, vom Training bis zur Verwaltung.", W],
    ["Im Ehrenamt lernt man vieles, was auch außerhalb des Sports nützt.", W],
    ["Die Umfrage stammt vom TSV Sonnenfeld.", E]], { points: 3, text: "t1", hinweis: WICHTIG_TIPP }),
  f(WOERTER_M, [
    feld("Dieser Teil des Vereins verwaltet das Geld der Mitglieder:", ["Vorstand", "der Vorstand", "den Vorstand", "Vorstands", "des Vorstands", "Vereinsvorstand", "der Vereinsvorstand"]),
    feld("Dafür bekommen manche Ehrenamtliche eine kleine Entschädigung:", ["Fahrtkosten", "für Fahrtkosten", "ihre Fahrtkosten", "für ihre Fahrtkosten", "die Fahrtkosten", "für die Fahrtkosten", "Fahrkosten", "Fahrt-Kosten"]),
    feld("Sie bieten eigene Lehrgänge für Jugendliche an, die mithelfen wollen:", ["Sportverbände", "die Sportverbände", "viele Sportverbände", "Sportverband", "der Sportverband", "Sportverbänden", "Verbände", "die Verbände"])
  ], { text: "t1", hinweis: WOERTER_TIPP }),
  f("Lies in der Tabelle ab, rechne und ergänze.", [
    feld("So viele Ehrenamtliche sind zwischen 30 und 49 Jahre alt (zusammen):", ["34", "vierunddreißig", "34 Ehrenamtliche", "34 Personen", "34 Mitglieder", "34 Befragte"]),
    feld("So viele Ehrenamtliche mehr sind 40 bis 49 Jahre alt als 20 bis 29 Jahre alt:", ["12", "zwölf", "12 mehr", "12 Ehrenamtliche", "12 Personen", "12 Mitglieder", "12 Befragte", "+12", "+ 12"])
  ], { text: "t2", hinweis: RECHNE_TIPP }),
  a("Im Text heißt es: „Vor allem fehlt der Nachwuchs“ (Z. 39–40). Erkläre mit Hilfe der Tabelle, ob das auch für den TSV Sonnenfeld gilt. Nenne zwei passende Zahlen und erkläre mit dem Text, welche Folge das für den Verein haben kann.", [
    kr("Ergebnis der Tabelle richtig beurteilt", 1, "Ja, es gilt auch dort: Der Verein hat nur wenige junge, aber viele ältere Ehrenamtliche."),
    kr("zwei passende Zahlen genannt", 2, "Nur 5 sind unter 20 Jahre (oder: 14 sind unter 30) · 28 sind 60 Jahre und älter (oder: 52 sind 50 und älter). Je passender, richtig abgelesener oder berechneter Zahl 1 Punkt."),
    kr("Folge mit dem Text erklärt", 1, "Hören die Älteren auf, bleiben ihre Aufgaben unbesetzt – dem Verein fehlen dann zum Beispiel Trainer oder Vorstandsmitglieder.")
  ], "Ja, das gilt auch für den TSV Sonnenfeld. Nur 5 der 100 Ehrenamtlichen sind jünger als 20 Jahre, aber 28 sind 60 Jahre oder älter. Wenn die Älteren aufhören, gibt es zu wenige Jüngere, die ihre Aufgaben übernehmen, und die Ämter bleiben unbesetzt.",
  ["nur 5|5 der|5 sind|fünf|14|vierzehn", "28|achtundzwanzig|52|zweiundfünfzig", "unbesetzt|aufhören|aufhört|niemand|übernehm|nachfolg"], { text: "t2" }),
  s("Schreibe eine Zusammenfassung des Sachtextes „Ohne sie läuft nichts – Ehrenamt im Sportverein“. Umfang: 80 bis 120 Wörter. Beachte die Regeln für eine Zusammenfassung.", [
    kr("Inhalt", 6, "Je Kerninformation 1 Punkt: (1) Sportvereine sind auf Ehrenamtliche angewiesen – Menschen, die freiwillig und ohne Lohn mitarbeiten. (2) Die Aufgaben sind vielfältig: Training, Vorstand, Schiedsrichter, Hilfe bei Festen und Fahrten. (3) Durch das Ehrenamt bleibt Sport für alle bezahlbar; bezahlte Kräfte würden die Beiträge stark erhöhen. (4) Gründe für das Engagement: Freude, Gemeinschaft und dass man vieles lernt, was auch sonst nützt. (5) Problem: Vereine finden immer schwerer Ehrenamtliche, vor allem der Nachwuchs fehlt. (6) Lösungen: kleinere Aufgaben, Jugendliche früh einbinden (Lehrgänge), Menschen persönlich ansprechen."),
    NUR_WICHTIGES("Kaffee im Vereinsheim, Kuchenverkauf, Fahrtkosten, Name des Vereins, einzelne Zahlen aus der Tabelle"),
    FORM_M, RICHTIG
  ], { minWoerter: 70, text: "t1" })
];

const ALLE = { kurz: "Sachtext II", scope: "Wichtiges erkennen · Diagramm und Tabelle · Zusammenfassung", minutes: 45 };
module.exports = {
  "d7-p3-r-a": probe(3, "R", "A", { ...ALLE, title: "Probe 3 (R7): Sachtext II – Zusammenfassung", texte: [ESSEN, ESSEN_DIAGRAMM], items: R_A }),
  "d7-p3-r-b": probe(3, "R", "B", { ...ALLE, title: "Probe 3 (R7): Sachtext II – Zusammenfassung – Variante B", texte: [BUECHEREI, BUECHEREI_TABELLE], items: R_B }),
  "d7-p3-m-a": probe(3, "M", "A", { ...ALLE, title: "Probe 3 (M7): Sachtext II – Zusammenfassung", texte: [HANDY, HANDY_DIAGRAMM], items: M_A }),
  "d7-p3-m-b": probe(3, "M", "B", { ...ALLE, title: "Probe 3 (M7): Sachtext II – Zusammenfassung – Variante B", texte: [EHRENAMT, EHRENAMT_TABELLE], items: M_B })
};
