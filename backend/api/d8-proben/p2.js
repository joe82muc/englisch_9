"use strict";

/**
 * Deutsch 8 · Probe 2: Argumentieren und Stellung nehmen (These erkennen, Bausteine eines Arguments, starke und
 * schwache Argumente, Verknüpfungen; M8: Adverbialsätze, Einwand entkräften, Argumente gewichten; zum Schluss eine
 * kurze begründete Stellungnahme).
 * LehrplanPLUS D8 3.2 (Argumente formulieren und gewichten, Schlüsse ziehen, begründete Stellungnahme; Argumente durch
 * Beispiele stützen; M8: Adverbialsätze zur Verknüpfung), 1.3 (M8: auf Gegenargumente eingehen), 2.3 (M8: Leserbrief).
 * R8: 32 Punkte · M8: 38 Punkte · 45 Minuten. Alle Texte eigenständig für GRUMI erstellt, alle Personen, Zahlen und
 * Einrichtungen erfunden.
 *
 * Streitfragen: Variante A „Klassenfahrt ohne Handy“ · Variante B „Schulbeginn um neun“ – in jeder Fassung kommen
 * beide Seiten mit guten Gründen vor.
 * Material R8: zwei Forumsbeiträge (ein vollständiges Argument, eine Gegenstimme mit zwei Gründen und einem Vorschlag).
 * Material M8: ein Leserbrief an die Schülerzeitung (These, zwei Argumente mit Beleg bzw. Beispiel, Einräumung,
 * Appell); R8 und M8 teilen keinen Text.
 * Aufbau R8 (32): Ankreuzen 1 · Zuordnen 4 · Zeile 1 · Zuordnen 4 · Lücken 3 · offen 3 · offen 3 · Stellungnahme 13.
 * Aufbau M8 (38): Ankreuzen 1 · Zuordnen 4 · Zeile 1 · Zuordnen 4 · offen 4 · offen 4 · offen 3 · Stellungnahme 17.
 * Die Streitfrage der Schreibaufgabe ist die des Impulstexts (Probe 5 hat andere: Sozialpraktikum, Putzdienst).
 * Begriffe wie in den Lernmodulen A1–A3: These, Behauptung – Begründung – Beispiel/Beleg – Schlussfolgerung; Schwächen:
 * nur Geschmack, Übertreibung/Verallgemeinerung, am Thema vorbei; gewichten (Wen betrifft es? Wie gut belegt? Folgen?).
 * Die offenen Aufgaben werden von der KI einzeln korrigiert: Jede Aufgabe nennt deshalb selbst, worum es geht.
 * Bleibt auf dem Server (Lösungen, Erwartungshorizont). Bausteine: bau.js.
 */
const { c, m, f, feld, z, a, kr, s, text, probe } = require("./bau");

/* ------------------------------ Texte ------------------------------ */
// R8, Variante A (20 Zeilen): Tilda = vollständiges Argument für die Fahrt ohne Handy (Z. 6–12) · Kolja = Gegenstimme (Z. 13–20)
const FORUM_HANDY = text("t1", "Klassenfahrt ohne Handy?", "Beiträge aus dem Klassenforum", [
  "Im Mai fährt die Klasse 8c für fünf Tage in eine Jugendherberge am See. Die Klassenleiterin Frau Thalhammer schlägt vor, dass alle Handys zu Hause bleiben. Im Klassenforum wird darüber gestritten. Hier sind zwei Beiträge.",
  "Tilda: „Ich bin dafür, dass wir ohne Handy auf Klassenfahrt fahren. Ohne Handy haben wir mehr Zeit füreinander. Abends starrt dann nämlich niemand stundenlang auf seinen Bildschirm. Auf der Paddeltour mit meiner Jugendgruppe lagen alle Handys im wasserdichten Sack, und wir haben jeden Abend zusammen gekocht und Karten gespielt. Deshalb würden uns fünf Tage ohne Handy als Klasse guttun.“",
  "Kolja: „Ich sehe das anders. Wir sollten die Handys mitnehmen dürfen, weil viele abends kurz mit ihren Eltern sprechen möchten. Meine Cousine hatte auf ihrer ersten Fahrt starkes Heimweh, und ein Anruf zu Hause hat ihr sofort geholfen. Außerdem mache ich mit dem Handy meine Fotos, denn eine Kamera besitze ich nicht. Mein Vorschlag lautet deshalb: Die Handys kommen mit, aber tagsüber sammeln wir sie ein.“"
]);

// R8, Variante B (18 Zeilen): Merve = vollständiges Argument für neun Uhr (Z. 5–11) · Arvid = Gegenstimme (Z. 12–18)
const FORUM_NEUN = text("t1", "Schulbeginn um neun?", "Beiträge aus dem Schulforum", [
  "Der Schülerrat möchte, dass der Unterricht künftig erst um neun Uhr beginnt und nicht mehr um acht. Auf der Lernplattform der Schule dürfen alle ihre Meinung dazu schreiben. Zwei Beiträge aus der achten Jahrgangsstufe:",
  "Merve: „Ich finde, der Unterricht sollte erst um neun Uhr anfangen. Wer länger schlafen kann, passt in den ersten Stunden besser auf. Ein ausgeschlafener Kopf kann sich nämlich viel leichter konzentrieren. Als bei uns nach dem Sommerkonzert einmal die ersten beiden Stunden ausfielen, hat in Mathe fast die ganze Klasse mitgearbeitet. Darum wäre ein späterer Beginn gut für unsere Leistungen.“",
  "Arvid: „Da bin ich anderer Meinung. Der Unterricht soll weiter um acht beginnen, denn sonst endet er auch eine Stunde später. Dienstags hätte ich dann erst um halb fünf aus und käme zu spät zum Schwimmtraining. Zudem müssen viele Eltern früh zur Arbeit und könnten ihre Kinder nicht mehr mitnehmen. Ich schlage daher vor: Der Beginn bleibt, aber in der ersten Stunde schreiben wir keine Proben mehr.“"
]);

// M8, Variante A (30 Zeilen): These Z. 7–9 · Argument „Sicherheit“ Z. 10–16 · Argument „Verantwortung“ Z. 17–23 ·
// Einräumung Z. 24–26 · Appell Z. 27–29
const BRIEF_HANDY = text("t1", "Fünf Tage ohne Netz?", "Leserbrief an die Schülerzeitung", [
  "In ihrer letzten Ausgabe berichtete die Schülerzeitung „Federstrich“, dass die Lehrerkonferenz Klassenfahrten künftig ohne Handys durchführen möchte. Die Gemeinschaft leide, wenn abends jeder für sich auf den Bildschirm starre, heißt es in der Begründung. Dazu erreichte die Redaktion dieser Leserbrief.",
  "Liebe Redaktion, den Wunsch der Lehrerkonferenz kann ich verstehen. Trotzdem halte ich ein vollständiges Handyverbot auf Klassenfahrten für den falschen Weg.",
  "Zunächst gibt ein Handy vielen von uns Sicherheit. Wer zum ersten Mal fünf Tage von zu Hause fort ist, wird nämlich ruhiger, wenn er abends kurz mit seiner Familie sprechen kann. In einer Umfrage der SMV gaben 41 von 60 Befragten an, dass ihnen dieser Kontakt wichtig ist. Ein Verbot träfe folglich gerade diejenigen, denen der Abschied ohnehin schwerfällt.",
  "Hinzu kommt, dass wir den vernünftigen Umgang mit dem Handy nur lernen, wenn wir es benutzen dürfen. Obwohl ein Verbot bequemer erscheint, nimmt es uns die Gelegenheit, selbst Verantwortung zu übernehmen. Im Trainingslager meines Turnvereins waren die Geräte nur zwischen 18 und 19 Uhr eingeschaltet. Daran haben sich alle gehalten, sodass niemand kontrollieren musste.",
  "Zwar stimmt es, dass eine Klasse enger zusammenwächst, wenn abends gespielt und geredet wird. Dafür genügen jedoch feste Handyzeiten; ein völliges Verbot ist nicht nötig.",
  "Ich bitte die Lehrerkonferenz deshalb, statt eines Verbots eine tägliche Handystunde zu erproben, damit beide Seiten zu ihrem Recht kommen.",
  "Eine Schülerin der 8. Jahrgangsstufe"
]);

// M8, Variante B (29 Zeilen): These Z. 6–8 · Argument „Nachmittag“ Z. 9–15 · Argument „verlorene Stunde“ Z. 16–21 ·
// Einräumung Z. 22–25 · Appell Z. 26–28
const BRIEF_NEUN = text("t1", "Eine Stunde später?", "Leserbrief an die Schülerzeitung", [
  "Der Elternbeirat hat angeregt, den Unterrichtsbeginn an unserer Schule von acht auf neun Uhr zu verlegen. Jugendliche seien am frühen Morgen noch nicht leistungsfähig, heißt es in dem Antrag. Die Schülerzeitung „Lupe“ druckt dazu den folgenden Leserbrief ab.",
  "Liebes Team der „Lupe“, über den Antrag des Elternbeirats habe ich lange nachgedacht. Ich komme zu dem Ergebnis, dass der Unterricht weiterhin um acht Uhr beginnen sollte.",
  "Vor allem verschiebt ein späterer Beginn den ganzen Tag nach hinten. Da die Zahl der Stunden gleich bleibt, endet der Unterricht an langen Tagen erst gegen halb fünf. Nach einer Befragung in unserer Jahrgangsstufe besuchen 38 von 54 Jugendlichen nachmittags einen Verein, die Musikschule oder einen Kurs. Für die meisten von uns würde es somit eng, diese Termine noch zu erreichen.",
  "Darüber hinaus fürchte ich, dass die gewonnene Stunde rasch wieder verloren geht. Obwohl wir morgens länger liegen bleiben könnten, gingen viele abends einfach später ins Bett. Seit die Schule meines Cousins erst um neun beginnt, schaltet er sein Licht nach eigener Aussage kaum noch vor Mitternacht aus, sodass er morgens so müde ist wie zuvor.",
  "Gewiss ist es richtig, dass sich die innere Uhr in unserem Alter nach hinten verschiebt und frühes Aufstehen deshalb schwerfällt. Dem lässt sich allerdings begegnen, indem in der ersten Stunde keine Proben geschrieben werden.",
  "Ich bitte den Elternbeirat daher, zunächst probenfreie erste Stunden einzuführen, damit niemand auf seinen Nachmittag verzichten muss.",
  "Ein Schüler der 8. Jahrgangsstufe"
]);

/* ------------------------------ Schreibhilfen ------------------------------ */
// Lücke im Satz: Es zählt das Wort allein – oder der ganze Satz mit dem Wort.
const luecke = (satz, ...woerter) => feld(satz, woerter.concat(woerter.map((w) => satz.replace("___", w))));
// am Satzanfang großgeschrieben (so steht die Lösung in der Korrektur); verglichen wird ohne Groß-/Kleinschreibung
const WEIL = ["weil", "da"], DESHALB = ["Deshalb", "Deswegen", "Darum", "Daher"], AUSSERDEM = ["Außerdem", "Zudem"];

// Bausteine eines Arguments (rechte Seite der Zuordnung)
const BEH = "Behauptung", BEG = "Begründung", BSP = "Beispiel", BELEG = "Beleg", FOLGE = "Schlussfolgerung";
// Gewicht eines Arguments (rechte Seite der Zuordnung) – R8 und M8 mit den Begriffen ihrer Lernmodule
const R_STARK = "stark: Grund und Beispiel", R_GESCHMACK = "schwach: nur Geschmack", R_UEBERTR = "schwach: Übertreibung", R_VORBEI = "schwach: am Thema vorbei";
const M_STARK = "stichhaltig: Grund und Beispiel", M_GESCHMACK = "schwach: bloßer Geschmack", M_VERALLG = "schwach: Verallgemeinerung", M_VORBEI = "schwach: am Thema vorbei";

/* ------------------------------ Aufgabenstellungen (allgemeine Anweisungen) ------------------------------ */
const these = (wer) => "Welche These (welchen Standpunkt) vertritt " + wer + " in ihrem Beitrag?";
const THESE_M = "Welche Aussage gibt die These des Leserbriefs am genauesten wieder?";
const bausteineR = (wer, zeilen) => wer + " baut ein vollständiges Argument auf (Z. " + zeilen + "). Ordne jedem Satz den passenden Baustein zu.";
const bausteineM = (was, zeilen) => "Das erste Argument des Leserbriefs (" + was + ", Z. " + zeilen + ") ist vollständig aufgebaut. Ordne jedem Satz den passenden Baustein zu.";
const GEWICHT_R = "Im Forum stehen noch mehr Beiträge. Prüfe sie: Welcher überzeugt, und welche Schwäche haben die anderen? Ordne zu.";
const GEWICHT_M = "Zur Streitfrage gingen bei der Redaktion weitere Zuschriften ein. Prüfe, wie viel Gewicht sie haben: Ordne jeder Aussage die passende Einschätzung zu.";
const LUECKEN = "Setze in jede Lücke das passende Verknüpfungswort ein: außerdem, deshalb oder weil. Jedes Wort passt genau einmal. Schreibe nur das fehlende Wort in das Feld.";
const schwach = (wer, satz, wessen) => wer + " schreibt im Forum: „" + satz + "“ Erkläre, warum dieses Argument schwach ist. Schreibe es dann so um, dass es überzeugt. " + wessen + " Meinung soll dabei gleich bleiben.";
const ergaenzen = (wer, meinung, argument) => wer + " ist " + meinung + ". Sie schreibt: „" + argument + "“ Ihr Argument ist noch nicht vollständig. Schreibe ein passendes Beispiel und eine Schlussfolgerung dazu.";
const SATZGEFUEGE = "Verbinde die beiden Sätze jeweils zu einem Satzgefüge mit einem Adverbialsatz. Verwende die Konjunktion in der Klammer und achte auf das Komma.";
const ENTKRAEFTEN = " Dann ist dieser Satz ein Einwand gegen deine Meinung. Entkräfte ihn sachlich in zwei bis drei Sätzen: Nimm ihn zuerst ernst und zeige dann, warum er nicht so schwer wiegt. Du musst dafür nicht selbst dieser Meinung sein.";
const gewichten = (wer, a1, z1, a2, z2) => wer + " stützt die These mit zwei Argumenten: „" + a1 + "“ (Z. " + z1 + ") und „" + a2 + "“ (Z. " + z2 + "). Welches der beiden wiegt deiner Ansicht nach schwerer? Entscheide dich und begründe deine Gewichtung mit zwei Gesichtspunkten. Denke daran, woran man das Gewicht eines Arguments misst.";

/* ------------------------------ Hilfen (R8) ------------------------------ */
const HILFE_SCHWACH = "So kannst du schreiben: Das Argument ist schwach, weil … Besser wäre: Ich bin …, weil …";
const HILFE_ERGAENZEN = "Satzanfänge: Zum Beispiel … · Deshalb …";
const HILFE_STELLUNG = "Satzanfänge: Meiner Meinung nach … · Ein wichtiger Grund ist, dass … · Zum Beispiel … · Noch wichtiger ist, dass … · Deshalb bin ich …";

/* ------------------------------ „Dein nächster Schritt“ ------------------------------ */
const H_THESE = "Eine These sagt klar, wofür oder wogegen jemand ist. Ein Beispiel oder ein Vorschlag der Gegenseite ist keine These.";
const H_THESE_M = "Achte auf die Feinheiten: Ist die Verfasserin oder der Verfasser gegen alles, für alles – oder für einen Mittelweg? Lies dazu Anfang und Schluss des Briefs.";
const H_BAUSTEINE = "Die Behauptung sagt, was stimmen soll. Die Begründung erklärt es (nämlich, weil, da). Beispiel und Beleg zeigen es an einem Fall oder an Zahlen. Die Schlussfolgerung zieht das Ergebnis (deshalb, darum, folglich, somit).";
const H_ZEILE = "Suche zuerst das Schlüsselwort aus der Frage im Text. Lies dann den ganzen Satz und notiere seine Zeilen.";
const H_GEWICHT = "Prüfe jede Aussage mit drei Fragen: Geht es überhaupt um die Streitfrage? Gibt es einen Grund? Stimmt das wirklich für alle und immer?";
const H_LUECKEN = "Achte auf das gebeugte Verb: Nach „weil“ steht es am Ende. „Deshalb“ nennt eine Folge, „außerdem“ fügt einen weiteren Grund hinzu.";
const H_SCHWACH = "Ein Argument überzeugt erst, wenn es einen Grund nennt und nicht übertreibt. Streiche beim nächsten Mal Wörter wie „alle“, „immer“, „jeder“.";
const H_ERGAENZEN = "Ein Beispiel ist ein einzelner Fall, den man sich vorstellen kann. Die Schlussfolgerung beginnt oft mit „deshalb“ oder „also“.";
const H_SATZGEFUEGE = "Im Nebensatz steht das gebeugte Verb am Ende. „Obwohl“ leitet das ein, was man einräumt; „sodass“ leitet die Folge ein.";
const H_ENTKRAEFTEN = "Beginne beim nächsten Mal mit „Es stimmt zwar, dass …“ und setze mit „allerdings“ oder „dennoch“ deinen Grund dagegen.";
const H_GEWICHTEN = "Das Gewicht eines Arguments misst man so: Wie viele betrifft es? Wie gut ist es belegt? Wie wichtig sind die Folgen?";
const H_STELLUNG_R = "Plane beim nächsten Mal zuerst deine zwei Argumente in Stichpunkten – jedes mit „weil“ und einem Beispiel.";
const H_STELLUNG_M = "Plane beim nächsten Mal den Einwand der Gegenseite gleich mit ein – am besten vor deinem stärksten Argument.";

/* ------------------------------ Erwartungshorizonte, die in A und B gleich aufgebaut sind ------------------------------ */
const BEIDE = "Beide Meinungen sind gleich viel wert.";
// R8: schwaches Argument erklären und verbessern (3 Punkte)
const schwachKr = (wer, schwaechen, besser) => [
  kr("Schwäche erklärt", 1, "Eine zutreffende Schwäche: " + schwaechen + " · eine Begründung fehlt, es wird nur behauptet · ein Beispiel fehlt."),
  kr("überzeugend umgeschrieben", 2, "Eine sachliche Aussage mit derselben Meinung wie " + wer + " und einer nachvollziehbaren Begründung, z. B. „" + besser + "“ 2: sachlich und begründet · 1: sachlicher formuliert, aber ohne Begründung, oder die Begründung ist nur angedeutet · 0: Meinung geändert oder nur der Satz von " + wer + " wiederholt.")
];
// R8: Beispiel und Schlussfolgerung ergänzen (3 Punkte)
const ergaenzenKr = (zeigt, folge) => [
  kr("Beispiel passt und ist konkret", 2, "Ein einzelner Fall, der zeigt, dass " + zeigt + " (ein Erlebnis, ein bestimmter Tag, eine Beobachtung). 2: passt genau zur Begründung und ist konkret · 1: passt nur ungefähr zum Thema oder wiederholt die Begründung mit anderen Worten."),
  kr("Schlussfolgerung", 1, "Ein Satz zieht das Ergebnis aus dem Argument (z. B. mit deshalb, also, darum): " + folge)
];
// M8: zwei Satzgefüge bilden (4 Punkte)
const satzgefuegeKr = (obwohl, einraeumung, sodass) => [
  kr("Satz a) mit „obwohl“", 2, "z. B. „" + obwohl + "“ 2: „obwohl“ leitet den richtigen Teilsatz ein (die Einräumung: " + einraeumung + "), und das gebeugte Verb steht am Ende des Nebensatzes · 1: richtige Konjunktion, aber die Verbstellung ist falsch oder die Teilsätze sind vertauscht, sodass der Sinn nicht mehr stimmt. Ein fehlendes Komma kostet keinen Punkt, wird aber angemerkt."),
  kr("Satz b) mit „sodass“", 2, "z. B. „" + sodass + "“ 2: „sodass“ leitet die Folge ein, und das gebeugte Verb steht am Ende des Nebensatzes · 1: richtige Konjunktion, aber die Verbstellung ist falsch oder Grund und Folge sind vertauscht. Ein fehlendes Komma kostet keinen Punkt, wird aber angemerkt.")
];
// M8: Einwand der Gegenseite entkräften (4 Punkte)
const entkraeftenKr = (anerkennen, gruende) => [
  kr("Einwand aufgegriffen und ernst genommen", 1, "Der Einwand wird genannt oder anerkannt, z. B. „" + anerkennen + "“."),
  kr("sachlich entkräftet", 3, "Ein passender Grund, z. B.: " + gruende + " 3: stichhaltiger Grund, der genau zu diesem Einwand passt und nachvollziehbar ausgeführt ist · 2: passender Grund, aber nur knapp genannt · 1: nur widersprochen oder ein Grund, der am Einwand vorbeigeht · 0: abwertend oder unsachlich.")
];
// M8: Gewichtung begründen (3 Punkte)
const gewichtenKr = (gesichtspunkte) => [
  kr("Entscheidung", 1, "Eines der beiden Argumente wird eindeutig als das gewichtigere benannt. Beide Entscheidungen sind gleich viel wert."),
  kr("Gewichtung begründet", 2, "Je 1 Punkt für einen passenden Gesichtspunkt (höchstens 2), z. B.: " + gesichtspunkte + " Kein Punkt für „weil es mir besser gefällt“ oder für die bloße Wiederholung des Arguments.")
];
// Bewertungsraster der Stellungnahme (R8: 13 Punkte, M8: 17 Punkte)
const RASTER_R = (frage, dafuer, dagegen) => [
  kr("Inhalt: Meinung und Argumente", 6, "Die Meinung zur Streitfrage „" + frage + "“ ist klar und bleibt gleich. Zwei Argumente passen dazu; jedes hat eine Begründung und ein Beispiel. 6: zwei vollständige Argumente · 4–5: zwei Argumente, Begründung oder Beispiel fehlt einmal · 2–3: ein vollständiges Argument oder zwei Behauptungen mit nur einem Beispiel · 1: Meinung erkennbar, kaum begründet. " + BEIDE + " Mögliche Argumente dafür: " + dafuer + ". Mögliche Argumente dagegen: " + dagegen + ". Gedanken aus dem Text dürfen in eigenen Worten vorkommen; wörtlich abgeschriebene Sätze zählen nicht."),
  kr("Aufbau", 3, "Je 1 Punkt: Einleitung mit Streitfrage und Meinung · Hauptteil mit zwei erkennbaren Argumenten, das stärkere steht am Schluss · Schlusssatz, der die Meinung zusammenfasst, ohne neues Argument."),
  kr("Sprache und Verknüpfung", 2, "Sachlicher Ton; die Sätze sind verknüpft (weil, denn, außerdem, zum Beispiel, deshalb). 2: durchgehend · 1: teilweise – einzelne Sätze stehen unverbunden oder klingen umgangssprachlich."),
  kr("Sprachrichtigkeit", 2, "Rechtschreibung, Zeichensetzung und Grammatik. 2: wenige Fehler, gut lesbar · 1: mehrere Fehler, noch gut lesbar · 0: sehr viele Fehler, die das Lesen erschweren.", { rs: true })
];
const RASTER_M = (frage, dafuer, dagegen) => [
  kr("Inhalt: These, Argumente, Einwand", 8, "Die These zur Streitfrage „" + frage + "“ ist eindeutig. Zwei bis drei stichhaltige Argumente, jedes mit Begründung und Beispiel oder Beleg; ein Einwand der Gegenseite wird aufgegriffen und sachlich entkräftet. 8: alles da und überzeugend · 6–7: zwei vollständige Argumente, der Einwand wird nur genannt oder knapp abgetan · 4–5: zwei Argumente, eines davon dünn; der Einwand fehlt · 1–3: überwiegend Behauptungen. Beide Standpunkte sind gleich viel wert. Mögliche Argumente dafür: " + dafuer + ". Mögliche Argumente dagegen: " + dagegen + ". Gedanken aus dem Leserbrief dürfen in eigenen Worten vorkommen; wörtlich abgeschriebene Sätze zählen nicht."),
  kr("Aufbau", 3, "Je 1 Punkt: Einleitung führt zur Streitfrage und nennt die These · Hauptteil in steigernder Reihenfolge, der Einwand steht an einer sinnvollen Stelle · Schluss mit Fazit oder Appell, ohne neues Argument."),
  kr("Sprache und Verknüpfung", 3, "Sachlich und passend für die Schülerzeitung; die Gedanken sind verknüpft (zunächst, hinzu kommt, allerdings, deshalb) – auch mit Adverbialsätzen (weil, obwohl, sodass, damit). 3: durchgehend verknüpft, mindestens zwei Adverbialsätze · 2: überwiegend verknüpft · 1: einfache Reihung, Wiederholungen."),
  kr("Sprachrichtigkeit", 3, "Rechtschreibung, Zeichensetzung und Grammatik. 3: fast fehlerfrei · 2: einzelne Fehler · 1: mehrere Fehler, gut lesbar · 0: sehr viele Fehler, die das Lesen erschweren.", { rs: true })
];
const VORGABE_R = "So gehst du vor:\n• Einleitung: Nenne die Streitfrage und deine Meinung.\n• Hauptteil: Begründe deine Meinung mit zwei Argumenten. Jedes Argument braucht eine Begründung und ein Beispiel. Dein stärkeres Argument steht am Schluss.\n• Schluss: Fasse deine Meinung in einem Satz zusammen.\nSchreibe mindestens 80 Wörter. Gedanken aus dem Text darfst du verwenden, aber schreibe keine Sätze ab.";
const VORGABE_M = "Deine Stellungnahme soll\n• in der Einleitung zur Streitfrage hinführen und deine These nennen,\n• zwei bis drei Argumente in steigernder Reihenfolge enthalten, jeweils mit Begründung und Beispiel oder Beleg,\n• einen Einwand der Gegenseite aufgreifen und entkräften,\n• mit einem Fazit oder einem Appell schließen.\nSchreibe mindestens 120 Wörter. Gedanken aus dem Leserbrief darfst du verwenden, aber übernimm keine Sätze.";

/* ============================== R8, Variante A – Klassenfahrt ohne Handy? ============================== */
const HANDY_DAFUER = "mehr Zeit füreinander, mehr Gespräche und gemeinsame Abende · kein Ärger um heimliche Fotos und Chats · kein teures Gerät geht verloren oder kaputt · man schläft besser";
const HANDY_DAGEGEN = "Kontakt nach Hause, Hilfe bei Heimweh · Fotos als Erinnerung · Wecker, Musik zum Einschlafen · den vernünftigen Umgang lernt man nur mit Handy; feste Handyzeiten genügen";
const R_A = [
  c(these("Tilda"), [
    "Die Klasse soll ohne Handys auf Klassenfahrt fahren.",
    "Auf einer Paddeltour sollte man sein Handy wasserdicht verpacken.",
    "Die Handys sollen mitkommen, aber tagsüber eingesammelt werden.",
    "Abends sollte jeder kurz mit seinen Eltern sprechen dürfen."], 0, { text: "t1", hinweis: H_THESE }),
  m(bausteineR("Tilda", "6–12"), [
    ["„Auf der Paddeltour mit meiner Jugendgruppe lagen alle Handys im wasserdichten Sack, und wir haben jeden Abend zusammen gekocht und Karten gespielt.“", BSP],
    ["„Ohne Handy haben wir mehr Zeit füreinander.“", BEH],
    ["„Deshalb würden uns fünf Tage ohne Handy als Klasse guttun.“", FOLGE],
    ["„Abends starrt dann nämlich niemand stundenlang auf seinen Bildschirm.“", BEG]], { text: "t1", hinweis: H_BAUSTEINE }),
  z("In welchen Zeilen erzählt Kolja ein Beispiel dafür, dass ein Anruf zu Hause helfen kann?", "t1", [[15, 17]], { hinweis: H_ZEILE }),
  m(GEWICHT_R, [
    ["„Klassenfahrten ohne Handy finde ich einfach total uncool.“", R_GESCHMACK],
    ["„Ein Handy kann auf der Fahrt leicht kaputtgehen, weil wir viel am Wasser sind: Letztes Jahr ist in der Parallelklasse eines in den See gefallen.“", R_STARK],
    ["„Mein Handy hat übrigens eine viel bessere Kamera als das von meinem Bruder.“", R_VORBEI],
    ["„Mit Handy redet auf so einer Fahrt garantiert kein Mensch mehr ein einziges Wort.“", R_UEBERTR]], { hinweis: H_GEWICHT }),
  f(LUECKEN, [
    luecke("Ich möchte mein Handy mitnehmen, ___ ich damit morgens meinen Wecker stelle.", ...WEIL),
    luecke("Die Jugendherberge liegt direkt am See. ___ kann ein Handy dort leicht nass werden.", ...DESHALB),
    luecke("Ohne Handy reden wir mehr miteinander. ___ gibt es keinen Ärger wegen peinlicher Fotos.", ...AUSSERDEM)
  ], { hinweis: H_LUECKEN }),
  a(schwach("Jannis", "Ohne Handy ist die ganze Fahrt für alle stinklangweilig, das weiß doch jeder.", "Jannis’"),
    schwachKr("Jannis", "Er übertreibt und verallgemeinert („die ganze Fahrt“, „für alle“, „das weiß doch jeder“)", "Ich möchte mein Handy mitnehmen, weil ich abends gern Musik höre und dabei besser einschlafe."),
    "Das Argument ist schwach, weil Jannis übertreibt: Er behauptet, dass sich alle langweilen, und nennt keinen Grund. Besser wäre: Ich möchte mein Handy mitnehmen, weil ich abends gern Musik höre und dabei besser einschlafe.",
    ["übertreib|übertrieb|alle|jeder|grund|begründ|behaupt|beispiel", "weil|denn|da "], { hilfe: HILFE_SCHWACH, hinweis: H_SCHWACH }),
  a(ergaenzen("Mareike", "für die Klassenfahrt ohne Handy", "Ohne Handy schlafen wir besser. Dann liegt nämlich niemand mehr bis Mitternacht wach und schreibt Nachrichten."),
    ergaenzenKr("man ohne Handy am Abend früher oder besser schläft", "Ohne Handy wären alle ausgeschlafener und hätten mehr von den Tagen."),
    "Zum Beispiel lag mein Handy am letzten Wochenende im Flur, und ich bin schon um zehn Uhr eingeschlafen. Deshalb wären wir ohne Handy auf der Fahrt morgens viel wacher.",
    ["zum beispiel|einmal|letzte|neulich|als ich|als wir|bei mir|bei uns", "deshalb|also|darum|daher|deswegen|aus diesem grund"], { hilfe: HILFE_ERGAENZEN, hinweis: H_ERGAENZEN }),
  s("Eure Klasse fährt für fünf Tage in eine Jugendherberge. Die Klassenleitung überlegt, ob alle Handys zu Hause bleiben sollen. Schreibe für das Klassenforum eine begründete Stellungnahme: Soll die Klassenfahrt ohne Handy stattfinden?",
    RASTER_R("Klassenfahrt ohne Handy?", HANDY_DAFUER, HANDY_DAGEGEN),
    { form: "stellungnahme", minWoerter: 80, text: "t1", vorgabe: VORGABE_R, hilfe: HILFE_STELLUNG, hinweis: H_STELLUNG_R })
];

/* ============================== R8, Variante B – Schulbeginn um neun? ============================== */
const NEUN_DAFUER = "ausgeschlafen lernt man leichter und passt besser auf · weniger Hektik am Morgen, Zeit für ein Frühstück · im Winter ist der Schulweg schon hell · weniger Verspätungen";
const NEUN_DAGEGEN = "der Unterricht endet später: weniger Zeit für Verein, Musikschule, Freunde und Hausaufgaben · Eltern müssen früh zur Arbeit, Busse fahren anders · viele gehen dann einfach später ins Bett";
const R_B = [
  c(these("Merve"), [
    "Der Unterricht soll künftig erst um neun Uhr beginnen.",
    "Nach einem Konzert sollten die ersten Stunden immer ausfallen.",
    "Der Beginn soll bleiben, aber ohne Proben in der ersten Stunde.",
    "Viele Eltern sollten ihre Kinder morgens zur Schule mitnehmen."], 0, { text: "t1", hinweis: H_THESE }),
  m(bausteineR("Merve", "5–11"), [
    ["„Ein ausgeschlafener Kopf kann sich nämlich viel leichter konzentrieren.“", BEG],
    ["„Darum wäre ein späterer Beginn gut für unsere Leistungen.“", FOLGE],
    ["„Wer länger schlafen kann, passt in den ersten Stunden besser auf.“", BEH],
    ["„Als bei uns nach dem Sommerkonzert einmal die ersten beiden Stunden ausfielen, hat in Mathe fast die ganze Klasse mitgearbeitet.“", BSP]], { text: "t1", hinweis: H_BAUSTEINE }),
  z("In welchen Zeilen nennt Arvid ein Beispiel aus seiner eigenen Woche?", "t1", [[14, 15]], { hinweis: H_ZEILE }),
  m(GEWICHT_R, [
    ["„Um acht Uhr schläft sowieso immer die ganze Klasse.“", R_UEBERTR],
    ["„Mein Wecker spielt übrigens jeden Morgen mein Lieblingslied.“", R_VORBEI],
    ["„Im Winter wäre der Schulweg um neun sicherer, weil es dann schon hell ist: Im Januar hat mich ein Auto im Dunkeln fast übersehen.“", R_STARK],
    ["„Früh aufstehen ist einfach nur ätzend.“", R_GESCHMACK]], { hinweis: H_GEWICHT }),
  f(LUECKEN, [
    luecke("Der erste Bus fährt bei uns schon um halb sieben. ___ müssen viele bereits um halb sechs aufstehen.", ...DESHALB),
    luecke("Um neun Uhr ist es auch im Winter schon hell. ___ bleibt morgens Zeit für ein richtiges Frühstück.", ...AUSSERDEM),
    luecke("Ich bin gegen den späteren Beginn, ___ mir dann am Nachmittag Zeit fehlt.", ...WEIL)
  ], { hinweis: H_LUECKEN }),
  a(schwach("Ruben", "Um acht Uhr kann sowieso kein Mensch denken, das ist immer so.", "Rubens"),
    schwachKr("Ruben", "Er übertreibt und verallgemeinert („kein Mensch“, „immer“)", "Ich bin für den Beginn um neun Uhr, weil ich in der ersten Stunde oft noch so müde bin, dass ich Fehler mache."),
    "Das Argument ist schwach, weil Ruben verallgemeinert: Er sagt, dass kein Mensch um acht denken kann, und gibt keinen Grund an. Besser wäre: Ich bin für den Beginn um neun Uhr, weil ich in der ersten Stunde oft noch so müde bin, dass ich Fehler mache.",
    ["übertreib|übertrieb|verallgemein|kein mensch|immer|grund|begründ|behaupt|beispiel", "weil|denn|da "], { hilfe: HILFE_SCHWACH, hinweis: H_SCHWACH }),
  a(ergaenzen("Nika", "gegen den Unterrichtsbeginn um neun Uhr", "Wer später anfängt, hat nachmittags weniger freie Zeit. Der Unterricht dauert dann nämlich an langen Tagen bis in den späten Nachmittag."),
    ergaenzenKr("am Nachmittag Zeit fehlt, wenn der Unterricht später endet", "Der Unterricht sollte weiter um acht Uhr beginnen, damit der Nachmittag frei bleibt."),
    "Zum Beispiel hätte ich am Donnerstag erst um halb fünf aus und könnte meiner Oma nicht mehr beim Einkaufen helfen. Deshalb sollte der Unterricht weiter um acht Uhr beginnen.",
    ["zum beispiel|einmal|letzte|neulich|als ich|als wir|bei mir|bei uns|am montag|am dienstag|am mittwoch|am donnerstag|am freitag", "deshalb|also|darum|daher|deswegen|aus diesem grund"], { hilfe: HILFE_ERGAENZEN, hinweis: H_ERGAENZEN }),
  s("Der Schülerrat eurer Schule möchte, dass der Unterricht künftig erst um neun Uhr beginnt und nicht mehr um acht. Schreibe für die Lernplattform der Schule eine begründete Stellungnahme: Soll der Unterricht erst um neun Uhr beginnen?",
    RASTER_R("Schulbeginn um neun?", NEUN_DAFUER, NEUN_DAGEGEN),
    { form: "stellungnahme", minWoerter: 80, text: "t1", vorgabe: VORGABE_R, hilfe: HILFE_STELLUNG, hinweis: H_STELLUNG_R })
];

/* ============================== M8, Variante A – Fünf Tage ohne Netz? ============================== */
const M_A = [
  c(THESE_M, [
    "Handys sollten auf Klassenfahrten nicht ganz verboten, sondern auf feste Zeiten beschränkt werden.",
    "Handys sollten auf Klassenfahrten zu jeder Zeit und ohne Regeln erlaubt sein.",
    "Klassenfahrten sollten ohne Handys stattfinden, damit die Gemeinschaft wächst.",
    "Vor jeder Klassenfahrt sollte die SMV eine Umfrage durchführen."], 0, { text: "t1", hinweis: H_THESE_M }),
  m(bausteineM("„Sicherheit“", "10–16"), [
    ["„In einer Umfrage der SMV gaben 41 von 60 Befragten an, dass ihnen dieser Kontakt wichtig ist.“", BELEG],
    ["„Ein Verbot träfe folglich gerade diejenigen, denen der Abschied ohnehin schwerfällt.“", FOLGE],
    ["„Zunächst gibt ein Handy vielen von uns Sicherheit.“", BEH],
    ["„Wer zum ersten Mal fünf Tage von zu Hause fort ist, wird nämlich ruhiger, wenn er abends kurz mit seiner Familie sprechen kann.“", BEG]], { text: "t1", hinweis: H_BAUSTEINE }),
  z("In welchen Zeilen räumt die Verfasserin ein, dass die Lehrerkonferenz in einem Punkt recht hat?", "t1", [[24, 25]], { hinweis: H_ZEILE }),
  m(GEWICHT_M, [
    ["„Wer sein Handy abgeben muss, hat fünf Tage lang überhaupt keinen Spaß mehr.“", M_VERALLG],
    ["„Auf unserer letzten Fahrt wurden heimlich Fotos aus dem Schlafraum verschickt; ohne Handys wäre das nicht möglich gewesen.“", M_STARK],
    ["„Klassenfahrten ohne Handy sind einfach von gestern.“", M_GESCHMACK],
    ["„Unsere Parallelklasse fährt dieses Jahr übrigens mit dem Zug statt mit dem Bus.“", M_VORBEI]], { hinweis: H_GEWICHT }),
  a(SATZGEFUEGE + " a) Ein Verbot lässt sich leicht durchsetzen. Es löst das eigentliche Problem nicht. (obwohl) – b) Abends schaut jeder auf seinen Bildschirm. Kaum jemand unterhält sich noch. (sodass)",
    satzgefuegeKr("Obwohl sich ein Verbot leicht durchsetzen lässt, löst es das eigentliche Problem nicht.", "Das Verbot ist leicht durchzusetzen", "Abends schaut jeder auf seinen Bildschirm, sodass sich kaum jemand noch unterhält."),
    "a) Obwohl sich ein Verbot leicht durchsetzen lässt, löst es das eigentliche Problem nicht. b) Abends schaut jeder auf seinen Bildschirm, sodass sich kaum jemand noch unterhält.",
    ["obwohl", "sodass|so dass"], { hinweis: H_SATZGEFUEGE }),
  a("Die Verfasserin des Leserbriefs meint, „dass wir den vernünftigen Umgang mit dem Handy nur lernen, wenn wir es benutzen dürfen“ (Z. 17–18). Stell dir vor, du bist für die Klassenfahrt ohne Handy." + ENTKRAEFTEN,
    entkraeftenKr("Es stimmt, dass man den Umgang mit dem Handy üben muss …", "Fünf Tage Pause nehmen niemandem die Übung – den Umgang lernt man an allen übrigen Tagen des Jahres · gerade der Verzicht gehört zum vernünftigen Umgang: Man merkt, dass es auch ohne geht · auf der Fahrt geht es um die Gemeinschaft, das Üben hat zu Hause seinen Platz."),
    "Es stimmt, dass man den Umgang mit dem Handy nur durch Übung lernt. Allerdings bleiben dafür alle anderen Wochen des Jahres, sodass fünf Tage Pause niemandem schaden. Außerdem gehört zum vernünftigen Umgang auch die Erfahrung, dass man eine Zeit lang gut ohne Handy auskommt.",
    ["zwar|stimmt|richtig|verständlich|berechtigt|nachvollziehbar", "allerdings|aber|jedoch|dennoch|trotzdem|doch", "übrig|jahr|zu hause|verzicht|ohne handy|pause|fünf tage|auskomm|gemeinschaft"], { text: "t1", zeilen: [17, 23], hinweis: H_ENTKRAEFTEN }),
  a(gewichten("Die Verfasserin", "Sicherheit", "10–16", "Verantwortung lernen", "17–23"),
    gewichtenKr("Wie viele betrifft es? (41 von 60 Befragten ist der Kontakt nach Hause wichtig) · Wie gut ist es belegt? (eine Umfrage gegenüber einem einzelnen Beispiel aus dem Trainingslager) · Wie wichtig oder dauerhaft sind die Folgen? (Verantwortung braucht man ein Leben lang, Heimweh betrifft nur diese fünf Tage)."),
    "Schwerer wiegt für mich das Argument der Sicherheit. Es betrifft die meisten, denn 41 von 60 Befragten ist der Kontakt nach Hause wichtig. Außerdem ist es mit einer Umfrage belegt, während das zweite Argument nur auf einem einzelnen Beispiel beruht.",
    ["sicherheit|verantwortung", "betrifft|viele|meisten|beleg|umfrage|41|folgen|wichtig|dauer|beispiel|leben"], { text: "t1", zeilen: [10, 23], hinweis: H_GEWICHTEN }),
  s("Die Lehrerkonferenz eurer Schule möchte, dass Klassenfahrten künftig ohne Handys stattfinden. Verfasse für die Schülerzeitung eine begründete Stellungnahme zu der Frage: Sollen Handys auf Klassenfahrten zu Hause bleiben?",
    RASTER_M("Klassenfahrt ohne Handy?", HANDY_DAFUER, HANDY_DAGEGEN),
    { form: "stellungnahme", minWoerter: 120, text: "t1", vorgabe: VORGABE_M, hinweis: H_STELLUNG_M })
];

/* ============================== M8, Variante B – Eine Stunde später? ============================== */
const M_B = [
  c(THESE_M, [
    "Der Unterricht soll weiter um acht Uhr beginnen; gegen die Müdigkeit helfen erste Stunden ohne Proben.",
    "Der Unterricht soll erst um neun Uhr beginnen, damit alle ausgeschlafen in die Schule kommen.",
    "Vereine und Musikschulen sollen ihre Zeiten an den Stundenplan der Schule anpassen.",
    "Der Elternbeirat soll zuerst alle Jugendlichen befragen, bevor er einen Antrag stellt."], 0, { text: "t1", hinweis: H_THESE_M }),
  m(bausteineM("„Nachmittag“", "9–15"), [
    ["„Da die Zahl der Stunden gleich bleibt, endet der Unterricht an langen Tagen erst gegen halb fünf.“", BEG],
    ["„Vor allem verschiebt ein späterer Beginn den ganzen Tag nach hinten.“", BEH],
    ["„Für die meisten von uns würde es somit eng, diese Termine noch zu erreichen.“", FOLGE],
    ["„Nach einer Befragung in unserer Jahrgangsstufe besuchen 38 von 54 Jugendlichen nachmittags einen Verein, die Musikschule oder einen Kurs.“", BELEG]], { text: "t1", hinweis: H_BAUSTEINE }),
  z("In welchen Zeilen räumt der Verfasser ein, dass der Elternbeirat in einem Punkt recht hat?", "t1", [[22, 24]], { hinweis: H_ZEILE }),
  m(GEWICHT_M, [
    ["„Frühaufsteher waren mir schon immer unsympathisch.“", M_GESCHMACK],
    ["„Unsere Turnhalle bekommt im nächsten Jahr übrigens einen neuen Boden.“", M_VORBEI],
    ["„Um acht Uhr ist grundsätzlich kein einziger Jugendlicher aufnahmefähig.“", M_VERALLG],
    ["„Wer um neun beginnt, kommt im Winter bei Tageslicht zur Schule; auf unserer unbeleuchteten Landstraße wäre das deutlich sicherer.“", M_STARK]], { hinweis: H_GEWICHT }),
  a(SATZGEFUEGE + " a) Viele gehen rechtzeitig schlafen. Sie sind um acht Uhr noch nicht richtig wach. (obwohl) – b) Der Unterricht endet eine Stunde später. Für das Training bleibt kaum noch Zeit. (sodass)",
    satzgefuegeKr("Obwohl viele rechtzeitig schlafen gehen, sind sie um acht Uhr noch nicht richtig wach.", "Viele gehen rechtzeitig schlafen", "Der Unterricht endet eine Stunde später, sodass für das Training kaum noch Zeit bleibt."),
    "a) Obwohl viele rechtzeitig schlafen gehen, sind sie um acht Uhr noch nicht richtig wach. b) Der Unterricht endet eine Stunde später, sodass für das Training kaum noch Zeit bleibt.",
    ["obwohl", "sodass|so dass"], { hinweis: H_SATZGEFUEGE }),
  a("Der Verfasser des Leserbriefs befürchtet: „Obwohl wir morgens länger liegen bleiben könnten, gingen viele abends einfach später ins Bett“ (Z. 17–19). Stell dir vor, du bist für den Unterrichtsbeginn um neun Uhr." + ENTKRAEFTEN,
    entkraeftenKr("Es ist verständlich, dass manche dann später schlafen gehen würden …", "Viele werden abends ohnehin erst spät müde, weil sich die innere Uhr in diesem Alter verschiebt – die Stunde am Morgen ist deshalb zusätzlicher Schlaf · wann man ins Bett geht, hat jeder selbst in der Hand; ein früher Beginn erzwingt keinen frühen Schlaf · ein einzelnes Beispiel (der Cousin) beweist nicht, dass es allen so ergeht."),
    "Es ist verständlich, dass manche dann später schlafen gehen würden. Allerdings werden viele von uns abends ohnehin erst spät müde, weil sich die innere Uhr in unserem Alter verschiebt. Die zusätzliche Stunde am Morgen wäre deshalb echter Schlaf, den wir jetzt nicht bekommen.",
    ["zwar|stimmt|richtig|verständlich|berechtigt|nachvollziehbar", "allerdings|aber|jedoch|dennoch|trotzdem|doch", "innere uhr|ohnehin|sowieso|müde|selbst|eltern|einzel|cousin|beispiel|zusätzlich|mehr schlaf"], { text: "t1", zeilen: [16, 25], hinweis: H_ENTKRAEFTEN }),
  a(gewichten("Der Verfasser", "Nachmittag", "9–15", "verlorene Stunde", "16–21"),
    gewichtenKr("Wie viele betrifft es? (38 von 54 Jugendlichen haben nachmittags Termine) · Wie gut ist es belegt? (eine Befragung gegenüber einer Befürchtung und dem einzelnen Beispiel des Cousins) · Wie wichtig sind die Folgen? (verpasste Termine in jeder Woche; fehlender Schlaf wirkt sich auf den ganzen Schultag aus)."),
    "Ich halte das Argument mit dem Nachmittag für das gewichtigere. Es betrifft die Mehrheit, denn 38 von 54 Jugendlichen haben nachmittags feste Termine. Zudem stützt es sich auf eine Befragung, das andere dagegen nur auf eine Befürchtung und das Beispiel eines Cousins.",
    ["nachmittag|stunde|termin|schlaf", "betrifft|viele|mehrheit|meisten|beleg|befragung|38|folgen|wichtig|befürchtung|beispiel|cousin"], { text: "t1", zeilen: [9, 21], hinweis: H_GEWICHTEN }),
  s("Der Elternbeirat eurer Schule regt an, den Unterrichtsbeginn von acht auf neun Uhr zu verlegen. Verfasse für die Schülerzeitung eine begründete Stellungnahme zu der Frage: Soll der Unterricht künftig erst um neun Uhr beginnen?",
    RASTER_M("Schulbeginn um neun?", NEUN_DAFUER, NEUN_DAGEGEN),
    { form: "stellungnahme", minWoerter: 120, text: "t1", vorgabe: VORGABE_M, hinweis: H_STELLUNG_M })
];

const R_HINWEIS = "Arbeite allein. Lies zuerst die beiden Beiträge genau. Löse dann die Aufgaben der Reihe nach; am Schluss schreibst du deine eigene Stellungnahme. Dabei hilft dir „Meine Planung“. Deine Antworten werden laufend gespeichert. Nach der Abgabe kannst du nichts mehr ändern.";
const M_HINWEIS = "Arbeite allein. Lies zuerst den Leserbrief genau. Bearbeite dann die Aufgaben; am Schluss verfasst du deine eigene Stellungnahme. Dafür steht dir „Meine Planung“ zur Verfügung. Deine Antworten werden laufend gespeichert. Nach der Abgabe kannst du nichts mehr ändern.";
const R_ALLE = { kurz: "Argumentieren", scope: "Argumente erkennen und prüfen · verknüpfen · kurze begründete Stellungnahme", minutes: 45, hinweis: R_HINWEIS };
const M_ALLE = { kurz: "Argumentieren", scope: "Argumente prüfen und gewichten · Einwand entkräften · begründete Stellungnahme", minutes: 45, hinweis: M_HINWEIS };
module.exports = {
  "d8-p2-r-a": probe(2, "R", "A", { ...R_ALLE, title: "Probe 2 (R8): Argumentieren und Stellung nehmen", texte: [FORUM_HANDY], items: R_A }),
  "d8-p2-r-b": probe(2, "R", "B", { ...R_ALLE, title: "Probe 2 (R8): Argumentieren und Stellung nehmen – Variante B", texte: [FORUM_NEUN], items: R_B }),
  "d8-p2-m-a": probe(2, "M", "A", { ...M_ALLE, title: "Probe 2 (M8): Argumentieren und Stellung nehmen", texte: [BRIEF_HANDY], items: M_A }),
  "d8-p2-m-b": probe(2, "M", "B", { ...M_ALLE, title: "Probe 2 (M8): Argumentieren und Stellung nehmen – Variante B", texte: [BRIEF_NEUN], items: M_B })
};
