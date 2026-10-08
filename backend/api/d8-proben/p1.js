"use strict";

/**
 * Deutsch 8 · Probe 1: Sachtext und Textverständnis (ein längerer Sachtext mit Schaubild oder Tabelle: Thema und Aufbau,
 * Textstellen mit Zeilen, Aussagen belegen, Schaubild auswerten, Aussageabsicht; M8: eigene Überschriften, Zitat in den
 * eigenen Satz einbauen, eine Aussage beurteilen).
 * LehrplanPLUS D8 2.1 (kontinuierliche und diskontinuierliche Texte erschließen, R8: Textaussagen belegen, M8: Inhalt
 * und Intention selbstständig erfassen), 2.3 (pragmatische Texte: Informationen entnehmen, Intention erkennen – R8 mit
 * Leitfragen, M8 beurteilen), 3.1 (Zitate formgerecht in eigene Texte integrieren), 3.2 (Ergebnisse einer
 * Textuntersuchung darstellen).
 * R8: 32 Punkte · M8: 38 Punkte · 45 Minuten. Variante A: Repair-Café (Schaubild), Variante B: Bibliothek der Dinge
 * (Tabelle). Alle Texte eigenständig für GRUMI erstellt; die Einrichtungen (Birkenfurt, Haselbrunn, Sonnried,
 * Weiherstetten), die Personen und alle Zahlen in Schaubild und Tabelle sind erfunden.
 * Bleibt auf dem Server (Lösungen und Erwartungshorizont). Bausteine: bau.js.
 */
const { c, m, f, feld, z, a, kr, text, tabelle, diagramm, probe } = require("./bau");

/* ------------------------------ Texte R8 ------------------------------ */
// Abschnitte: 1–6 · 7–18 · 19–31 · 32–41 · 42–50
const REPAIR_R = text("t1", "Reparieren statt wegwerfen – das Repair-Café", "Sachtext", [
  "Der Toaster wirft das Brot nicht mehr aus, am Rucksack klemmt der Reißverschluss, und der Kopfhörer bleibt auf einer Seite stumm. Solche Dinge landen oft im Müll, obwohl meist nur eine Kleinigkeit kaputt ist. In einem Repair-Café bekommen sie eine zweite Chance. Das englische Wort „repair“ bedeutet „reparieren“.",
  "Ein Repair-Café ist kein Geschäft und auch keine Werkstatt, in der man etwas abgibt und später wieder abholt. Es ist ein Treffen, das meist einmal im Monat stattfindet, zum Beispiel in einem Bürgerhaus oder in einem Jugendzentrum. An den Tischen sitzen Helferinnen und Helfer, die sich mit Technik, Holz oder Stoff gut auskennen. Sie arbeiten ehrenamtlich, bekommen also kein Geld dafür. Wer etwas Kaputtes mitbringt, setzt sich dazu und hilft bei der Reparatur mit. So lernt man gleich, wie man einen Fehler findet und mit Werkzeug umgeht. Die Hilfe kostet nichts. Nur Ersatzteile muss man selbst bezahlen, und über eine kleine Spende freut sich jedes Team.",
  "Im Repair-Café von Birkenfurt ist an jedem ersten Samstag im Monat viel los. Am Eingang trägt jeder Gast seinen Gegenstand in eine Liste ein. Dann wartet er bei Kaffee und Kuchen, bis ein Platz frei wird. Am häufigsten bringen die Gäste Geräte aus dem Haushalt mit, zum Beispiel Toaster, Mixer oder Staubsauger (siehe Schaubild). Am Tisch von Friedhelm Zeitler, einem Elektriker im Ruhestand, liegt gerade ein Mixer. „Oft ist nur ein Kabel gebrochen oder ein Schalter verschmutzt“, sagt er. Nach zwanzig Minuten läuft das Gerät wieder. Bevor die Besitzerin es mitnehmen darf, prüft Herr Zeitler noch, ob es sicher ist. Nicht jede Reparatur gelingt: Manchmal gibt es kein Ersatzteil mehr, oder das Gehäuse ist verklebt und lässt sich nicht öffnen.",
  "Reparieren lohnt sich aus mehreren Gründen. Erstens spart man Geld, weil man nichts Neues kaufen muss. Zweitens schont man die Umwelt: Für jedes neue Gerät werden Rohstoffe und viel Energie gebraucht, und jedes weggeworfene Gerät vergrößert den Müllberg. Wer seine Sachen länger benutzt, verbraucht also weniger. Drittens geht es um Wissen. Viele Menschen trauen sich heute nicht mehr zu, einen Knopf anzunähen oder einen Fahrradschlauch zu flicken. Im Repair-Café geben ältere Menschen ihr Können an jüngere weiter.",
  "Für viele Gäste ist noch etwas anderes wichtig: Man kommt miteinander ins Gespräch. Nachbarn, die sich vorher kaum kannten, sitzen plötzlich am selben Tisch. Auch Jugendliche sind willkommen, als Gäste und als Helfer. Die vierzehnjährige Merle repariert in Birkenfurt seit einem halben Jahr Fahrräder. „Am Anfang habe ich nur zugeschaut“, erzählt sie. „Jetzt wechsle ich einen Schlauch in zehn Minuten.“ Und der Toaster? Der bekommt eine neue Feder und röstet danach wieder wie am ersten Tag."
]);
const REPAIR_R_BILD = diagramm("t2", "Repair-Café Birkenfurt: Was die Gäste im letzten Jahr mitbrachten", "Gegenstände", [
  ["Spielzeug", 17], ["Haushaltsgeräte", 78], ["Fahrräder", 31], ["Kleidung und Taschen", 36], ["Möbel", 9], ["Handys und Kopfhörer", 29]
], { hinweis: "Zählung des Repair-Cafés Birkenfurt: Im letzten Jahr brachten die Gäste zusammen 200 Gegenstände mit." });

// Abschnitte: 1–7 · 8–19 · 20–30 · 31–39 · 40–50
const DINGE_R = text("t1", "Leihen statt kaufen – die Bibliothek der Dinge", "Sachtext", [
  "Für das Zeltlager braucht Levin einen großen Rucksack, seine Mutter will am Wochenende ein Regal aufhängen, und zum Geburtstag der Oma soll es frische Waffeln geben. Rucksack, Bohrmaschine und Waffeleisen kosten zusammen viel Geld. Dabei werden sie nur selten gebraucht und liegen danach wieder im Schrank. Es geht auch anders: Man leiht sich die Dinge einfach aus.",
  "Genau dafür gibt es die Bibliothek der Dinge. Sie funktioniert ähnlich wie eine Bücherei. In den Regalen stehen aber keine Bücher, sondern Gegenstände für den Alltag: Werkzeug, Küchengeräte, Spiele, Zelte oder Nähmaschinen. Wer etwas ausleihen will, meldet sich an und bekommt einen Ausweis. Dann sucht man sich einen Gegenstand aus, zum Beispiel im Katalog im Internet, und holt ihn ab. Nach einer festen Zeit bringt man ihn sauber und vollständig zurück. In manchen Orten ist das Ausleihen kostenlos, in anderen zahlt man einen kleinen Beitrag im Jahr. Geführt werden solche Bibliotheken oft von einer Gemeinde oder von einem Verein.",
  "In Haselbrunn gibt es seit drei Jahren eine Bibliothek der Dinge. Sie ist in einem früheren Laden am Marktplatz untergebracht und hat an zwei Nachmittagen in der Woche geöffnet. Rund 180 Gegenstände stehen dort bereit. Am häufigsten leihen die Leute Werkzeug aus, zum Beispiel Bohrmaschinen oder Leitern (siehe Tabelle). Die Leiterin Mirela Nowak prüft jedes Gerät, wenn es zurückkommt. „Wir schauen, ob alles funktioniert und ob nichts fehlt“, erklärt sie. Zu jedem Gerät gehört eine kurze Anleitung. Wer etwas beschädigt, soll das gleich sagen, damit es repariert werden kann.",
  "Das Leihen hat mehrere Vorteile. Der erste liegt auf der Hand: Man muss teure Geräte nicht selbst kaufen und spart Geld. Außerdem braucht man zu Hause weniger Platz, weil nichts ungenutzt im Keller herumsteht. Hinzu kommt der Nutzen für die Umwelt: Wenn sich viele Menschen ein Gerät teilen, müssen insgesamt weniger Geräte hergestellt werden. Das spart Rohstoffe und Energie, und am Ende entsteht weniger Müll. Und schließlich kann man etwas erst ausprobieren, bevor man es vielleicht doch kauft.",
  "Ganz ohne Regeln geht es allerdings nicht. Beliebte Dinge sind manchmal schon vergeben, deshalb sollte man früh reservieren. Wer etwas zu spät zurückbringt, ärgert die nächsten Nutzer und muss oft eine Gebühr zahlen. Die meisten gehen aber sorgfältig mit den Sachen um. „Die Dinge gehören hier allen ein bisschen“, sagt Frau Nowak. Auch Jugendliche nutzen das Angebot. Der fünfzehnjährige Arvid hat sich in Haselbrunn schon dreimal einen Beamer für einen Filmabend geliehen. „Kaufen könnte ich mir so ein Gerät nie“, sagt er. Und Levin? Er hat seinen Rucksack dort bekommen und nach dem Zeltlager wieder zurückgebracht."
]);
const DINGE_R_TABELLE = tabelle("t2", "Bibliothek der Dinge Haselbrunn: Ausleihen im letzten Jahr", ["Gegenstände", "Ausleihen"], [
  ["Spiele", 21], ["Werkzeug", 82], ["Küchengeräte", 38], ["Sport und Camping", 33], ["Musikinstrumente", 8], ["Beamer und Lautsprecher", 18]
], { hinweis: "Zählung der Bibliothek der Dinge Haselbrunn: Im letzten Jahr wurde zusammen 200-mal etwas ausgeliehen." });

/* ------------------------------ Texte M8 ------------------------------ */
// Abschnitte: 1–7 · 8–18 · 19–33 · 34–49 · 50–59 · 60–68
const REPAIR_M = text("t1", "Kaputt – und jetzt? Warum Reparieren wieder gefragt ist", "Sachtext", [
  "Ein Wasserkocher für fünfzehn Euro gibt nach zwei Jahren den Geist auf. Die Reparatur in einer Fachwerkstatt würde mehr kosten als ein neues Gerät, also wandert er auf den Wertstoffhof. So ergeht es Jahr für Jahr unzähligen Geräten. Fachleute zählen Elektroschrott inzwischen zu den Abfällen, deren Menge weltweit besonders schnell wächst. Dabei wäre bei vielen dieser Geräte nur eine Kleinigkeit zu beheben.",
  "Hier setzen Repair-Cafés an. Die Idee stammt aus den Niederlanden: 2009 fand in Amsterdam das erste Treffen dieser Art statt. Inzwischen gibt es solche Reparaturtreffs in vielen Ländern, auch in zahlreichen deutschen Städten und Gemeinden. Das Prinzip ist überall ähnlich. Ehrenamtliche mit handwerklichem Können stellen an festen Terminen ihre Zeit und ihr Werkzeug zur Verfügung. Die Besucher geben ihr defektes Gerät jedoch nicht einfach ab, sondern suchen gemeinsam mit den Helfern nach dem Fehler. „Hilfe zur Selbsthilfe“ nennen die Veranstalter das. Bezahlt werden muss nur das Ersatzteil; eine Spende ist freiwillig.",
  "Wie das in der Praxis aussieht, zeigt der Reparaturtreff in Sonnried, der seit sechs Jahren einmal im Monat im Pfarrsaal stattfindet. Zwölf Ehrenamtliche gehören zum Team, darunter eine Schneiderin, zwei Elektroniker und ein Fahrradmechaniker. Seit zwei Jahren helfen außerdem Jugendliche aus der Technikgruppe der Mittelschule mit. Mitgebracht wird alles, was sich tragen lässt: vom Toaster über die Stehlampe bis zur Jacke mit kaputtem Reißverschluss. Jeder Gegenstand wird am Empfang erfasst, und am Ende hält das Team fest, wie die Reparatur ausgegangen ist (siehe Schaubild). „Ungefähr zwei von drei Geräten können wir retten“, sagt Ilse Brandstetter, die den Treff leitet. Elektrische Geräte würden vor der Rückgabe stets auf ihre Sicherheit geprüft; eine Garantie könne das Team aber nicht geben.",
  "Dass Reparaturen scheitern, liegt oft nicht am fehlenden Können der Helfer, sondern an der Bauweise der Geräte. Gehäuse sind verklebt statt verschraubt, Akkus fest eingebaut, und manche Schrauben lassen sich nur mit Spezialwerkzeug lösen. Ersatzteile sind häufig teuer oder schon nach wenigen Jahren nicht mehr zu bekommen. Hinzu kommt der Preis: Solange ein neues Gerät weniger kostet als eine Arbeitsstunde in der Fachwerkstatt, lohnt sich die Reparatur für den Einzelnen kaum. Kritiker werfen manchen Herstellern deshalb vor, ihnen sei ein Neukauf lieber als eine Reparatur. Auch die Politik hat reagiert: In der Europäischen Union müssen Hersteller für bestimmte Geräte, etwa Waschmaschinen und Kühlschränke, inzwischen mehrere Jahre lang Ersatzteile anbieten. Einige Bundesländer zahlen zudem einen Zuschuss, wenn jemand ein defektes Elektrogerät reparieren lässt, statt es zu ersetzen.",
  "Der Nutzen des Reparierens geht über das einzelne Gerät hinaus. Jedes Produkt, das länger hält, muss erst später ersetzt werden. Damit sinkt der Bedarf an Rohstoffen und Energie, die für Herstellung und Transport nötig sind, und es entsteht weniger Abfall. Für die Besucher zählt zunächst oft das Geld, das sie sparen. Viele berichten aber auch von einem anderen Gewinn: Wer einmal gesehen hat, wie ein Staubsauger von innen aussieht, verliert die Scheu vor der Technik – und greift beim nächsten Defekt eher zum Schraubendreher als zum Geldbeutel.",
  "Allein werden Repair-Cafés das Müllproblem freilich nicht lösen. Sie finden meist nur einmal im Monat statt, und große Geräte wie Waschmaschinen lassen sich kaum dorthin tragen. Ihre eigentliche Stärke liegt woanders: Sie verändern die Einstellung der Menschen. Wer erlebt hat, dass sich ein Gerät retten lässt, achtet beim nächsten Kauf eher darauf, ob man es öffnen kann und ob es Ersatzteile gibt. So führt ein reparierter Wasserkocher am Ende vielleicht zu einer anderen Art einzukaufen."
]);
const REPAIR_M_BILD = diagramm("t2", "Reparaturtreff Sonnried: Ergebnis der Reparaturen im letzten Jahr", "Gegenstände", [
  ["Fehler nicht gefunden", 12], ["sofort repariert", 164], ["Ersatzteil nicht mehr erhältlich", 38], ["mit bestelltem Ersatzteil repariert", 36], ["Gehäuse ließ sich nicht öffnen", 24], ["Reparatur hätte sich nicht gelohnt", 26]
], { hinweis: "Auswertung des Reparaturtreffs Sonnried: Im letzten Jahr wurden 300 Gegenstände gebracht. Für jeden wurde genau ein Ergebnis festgehalten." });

// Abschnitte: 1–8 · 9–19 · 20–33 · 34–45 · 46–57 · 58–65
const DINGE_M = text("t1", "Nutzen statt besitzen – der Leihladen von nebenan", "Sachtext", [
  "In fast jedem Keller steht ein Gerät, das seinen großen Auftritt längst hinter sich hat: der Hochdruckreiniger, der einmal im Frühjahr läuft, das Raclette für den Silvesterabend oder die Stichsäge vom letzten Umzug. Gekauft wurden diese Dinge für einen einzigen Anlass, seither nehmen sie Platz weg. Wer ehrlich nachzählt, findet in den meisten Haushalten etliche Gegenstände, die nur wenige Stunden im Jahr gebraucht werden.",
  "An diesem Punkt setzt die Bibliothek der Dinge an. Der Gedanke dahinter ist alt: Schon immer haben sich Nachbarn gegenseitig eine Leiter oder einen Anhänger geliehen. Neu ist, dass das Teilen organisiert wird. Eine Bibliothek der Dinge – manche nennen sie auch Leihladen – sammelt Gebrauchsgegenstände an einem Ort, verzeichnet sie in einem Katalog und gibt sie für eine begrenzte Zeit aus. Träger sind häufig öffentliche Büchereien, Vereine oder Nachbarschaftsgruppen. Die Nutzer zahlen entweder gar nichts oder einen geringen Jahresbeitrag; für besonders wertvolle Geräte wird mitunter ein Pfand verlangt.",
  "Wie das im Alltag funktioniert, lässt sich in Weiherstetten beobachten. Dort betreibt ein Verein seit vier Jahren einen Leihladen in einem ehemaligen Schreibwarengeschäft. Rund 400 Gegenstände stehen bereit, vom Zelt bis zur Nähmaschine; die meisten wurden gespendet. Ausleihen darf, wer Mitglied ist und seinen Ausweis vorzeigt; die Leihfrist beträgt in der Regel eine Woche. Jedes Teil wird bei der Rückgabe geprüft und erst danach im Katalog wieder freigegeben. „Bei uns steht kaum etwas lange im Regal“, sagt Hanno Ruppert, der Vorsitzende des Vereins. Mehr als die Hälfte aller Ausleihen entfalle auf Werkzeug und Gartengeräte (siehe Tabelle). Manche Bohrmaschine sei hier in einem Jahr häufiger im Einsatz als in einem Privathaushalt in ihrer gesamten Lebenszeit.",
  "Dass trotzdem viele Menschen lieber kaufen, hat mehrere Gründe. Leihen kostet Zeit: Man muss den Gegenstand reservieren, abholen und pünktlich zurückbringen, und das zu Öffnungszeiten, die nicht jedem passen. Vor langen Wochenenden sind beliebte Geräte zudem schnell vergeben. Hinzu kommt die Gewohnheit. Vielen gibt es ein gutes Gefühl, etwas zu besitzen und jederzeit darauf zugreifen zu können. Manche scheuen sich außerdem, ein fremdes Gerät zu benutzen, für das sie bei einem Schaden geradestehen müssten. Nicht zuletzt machen niedrige Preise den Kauf leicht: Wenn eine einfache Stichsäge kaum mehr kostet als ein Kinoabend, erscheint der Weg zum Leihladen manchem zu umständlich.",
  "Dabei hat das Leihen handfeste Vorteile. Wer ein Gerät nur nutzt, statt es zu kaufen, spart Geld und Stauraum. Vor allem aber müssen insgesamt weniger Geräte hergestellt werden, wenn sich viele Menschen eines teilen. Das schont Rohstoffe und Energie und verringert die Abfallmenge. Ein Leihladen kann sich zudem hochwertige, langlebige Geräte leisten, die für einen einzelnen Haushalt zu teuer wären – und er lässt sie reparieren, wenn etwas kaputtgeht. Menschen mit wenig Geld erhalten so Zugang zu Dingen, die sie sich sonst nicht leisten könnten. Nebenbei entsteht ein Treffpunkt: Wer eine Nähmaschine abholt, bekommt nicht selten gleich einen Tipp dazu, wie man sie einfädelt.",
  "Ersetzen wird die Bibliothek der Dinge den eigenen Besitz nicht. Was man täglich braucht, will niemand jedes Mal ausleihen, und auf dem Land ist der nächste Leihladen oft weit entfernt. Wichtiger ist etwas anderes: Sie legt ihren Nutzern eine einfache Frage nahe. Muss ich das wirklich besitzen, oder genügt es, wenn ich es benutzen kann? Wer sich diese Frage vor dem nächsten Kauf stellt, entscheidet womöglich anders – und hat am Ende mehr Platz im Keller."
]);
const DINGE_M_TABELLE = tabelle("t2", "Leihladen Weiherstetten: Ausleihen im letzten Jahr nach Bereichen", ["Bereich", "Ausleihen"], [
  ["Küche und Feste", 96], ["Werkzeug", 212], ["Freizeit und Camping", 88], ["Gartengeräte", 104], ["Technik und Medien", 62], ["Kinder und Spiele", 38]
], { hinweis: "Auswertung des Leihladens Weiherstetten: Im letzten Jahr wurde 600-mal etwas ausgeliehen. Jede Ausleihe gehört zu genau einem Bereich." });

/* ------------------------------ gemeinsame Arbeitsanweisungen und Tipps ------------------------------ */
const UEBERSCHRIFTEN = "Der Text hat fünf Abschnitte. Ordne jedem Abschnitt die Überschrift zu, die sein Thema am besten trifft.";
const UEBERSCHRIFTEN_M = "Der Text hat sechs Abschnitte. Für vier davon steht hier eine Überschrift. Ordne sie den Abschnitten zu.";
const UEBERSCHRIFT_TIPP = "Lies von jedem Abschnitt den ersten und den letzten Satz und notiere dir ein Stichwort. Erst danach vergleichst du mit den Überschriften.";
const THEMA_TIPP = "Das Thema muss zu allen Abschnitten passen. Streiche die Antworten, die nur ein Beispiel oder nur einen Abschnitt treffen.";
const KERN_TIPP = "Die Kernaussage fasst den ganzen Text zusammen. Prüfe bei jeder Antwort, ob der Text das wirklich so sagt – auch die Einschränkungen.";
const ZEILE_TIPP = "Suche zuerst den Abschnitt, in dem es um die Frage geht. Lies dort Satz für Satz und notiere die Zeilen des passenden Satzes.";
const ERGAENZE = "Ergänze die Angaben aus dem Text.";
const ERGAENZE_TIPP = "Überfliege den Text nach dem auffälligsten Wort der Frage (einem Namen oder einer Zahl) und lies dort den ganzen Satz.";
const RECHNE_TIPP = "Schreibe dir die Werte heraus, die du brauchst. „Wie viele mehr“ bedeutet: den kleineren Wert vom größeren abziehen.";
const RECHNE_TIPP_M = "Schreibe dir zuerst die Werte heraus, die zur Frage gehören, und rechne dann. Prüfe mit der Gesamtzahl, ob dein Ergebnis stimmen kann.";
const ABSICHT_TIPP = "Frage dich: Will der Text vor allem informieren, etwas verkaufen, unterhalten oder vor etwas warnen? Achte auf den Ton und darauf, ob Tatsachen genannt werden.";
const NICHT_TIPP = "Suche zu jeder Aussage die Textstelle. Übrig bleibt die Aussage, die der Text so nicht macht – achte auf Wörter wie „die meisten“ oder „immer“.";
const KERN_FRAGE = "Fasse die wichtigsten Aussagen des Textes in zwei bis drei Sätzen zusammen.";
const BELEG_TIPP = "Ein Beleg braucht drei Dinge: die Aussage, die Textstelle mit Zeile und einen Satz, der erklärt, was die Stelle zeigt.";
const EINBAU_TIPP = "Ein eingebautes Zitat ist kurz und gehört zu deinem eigenen Satz. Lies den Satz zur Probe halblaut: Geht der Satzbau auf?";
const ABSICHT_FRAGE = "Welche Absicht verfolgt der Text vor allem: informieren, werben, unterhalten oder zu etwas auffordern? Entscheide dich und begründe deine Entscheidung mit zwei Merkmalen des Textes.";

// Erwartungshorizont, der in A und B gleich aufgebaut ist (der Inhalt kommt je Text dazu)
const BELEGE_KR = (belege, erklaerung) => [
  kr("erster passender Beleg", 1, "Mögliche Belege: " + belege),
  kr("zweiter Beleg aus einer anderen Textstelle", 1, "Ein weiterer Beleg aus der Liste – nicht dieselbe Stelle noch einmal."),
  kr("Form der Belege", 1, "Wörtliche Zitate stehen in Anführungszeichen und sind unverändert, sinngemäße Wiedergaben haben „vgl.“; zu beiden Belegen steht eine passende Zeilenangabe. Fehlt das bei einem der Belege: 0 Punkte."),
  kr("Erklärung in einem eigenen Satz", 1, erklaerung)
];
const EINBAU_KR = (einbau, inhalt) => [
  kr("Zitat formal richtig", 1, "Die übernommene Wortgruppe steht in Anführungszeichen, ist wörtlich (kein Wort verändert) und hat eine Zeilenangabe."),
  kr("in den eigenen Satz eingebaut", 1, "Das Zitat ist Teil des eigenen Satzes, und der Satzbau geht auf, z. B. " + einbau + " Nicht erfüllt: Der ganze Satz ist nur abgeschrieben oder hinter einem Doppelpunkt angehängt."),
  kr("Aussage richtig wiedergegeben", 1, inhalt)
];
const ABSICHT_KR = (merkmale) => [
  kr("Absicht richtig bestimmt", 1, "Der Text will vor allem sachlich informieren (und zum Nachdenken über das eigene Verhalten anregen). Nicht: werben oder unterhalten."),
  kr("zwei passende Merkmale", 2, "Je Merkmal 1 Punkt: " + merkmale),
  kr("an einer Textstelle gezeigt", 1, "Mindestens ein Merkmal wird mit einem Beispiel, einem Zitat oder einer Zeilenangabe aus dem Text belegt.")
];
const URTEIL_KR = (stimmt, dagegen) => [
  kr("was an der Aussage stimmt", 1, stimmt),
  kr("was dagegen spricht", 2, "Je Gesichtspunkt 1 Punkt: " + dagegen),
  kr("eigenes Urteil klar formuliert und begründet", 1, "Eine eindeutige Stellungnahme zur Aussage (z. B. „Die Aussage ist zu einseitig“), die aus dem Abwägen folgt – nicht nur „stimmt“ oder „stimmt nicht“."),
  kr("Bezug auf Text oder Material", 1, "Mindestens ein Gesichtspunkt ist mit einem Zitat, einer Zeilenangabe oder einer Zahl belegt.")
];

/* ------------------------------ R8, Variante A: Repair-Café ------------------------------ */
const R_A = [
  c("Welches Thema hat der Text?", [
    "Was ein Repair-Café ist und warum es sich lohnt, kaputte Dinge zu reparieren",
    "Wie man einen kaputten Toaster zu Hause selbst repariert",
    "Warum neue Geräte heute schneller kaputtgehen als früher",
    "Wie ein Elektriker im Ruhestand seine Samstage verbringt"], 0, { text: "t1", hinweis: THEMA_TIPP }),
  m(UEBERSCHRIFTEN, [
    ["Abschnitt 1 (Z. 1–6)", "Kaputt heißt nicht wertlos"],
    ["Abschnitt 2 (Z. 7–18)", "Ein Treffen, kein Geschäft"],
    ["Abschnitt 3 (Z. 19–31)", "Samstags in Birkenfurt"],
    ["Abschnitt 4 (Z. 32–41)", "Drei gute Gründe"],
    ["Abschnitt 5 (Z. 42–50)", "Mehr als nur reparieren"]], { points: 3, text: "t1", hinweis: UEBERSCHRIFT_TIPP }),
  z("In welchen Zeilen steht, was die Gäste im Repair-Café selbst bezahlen müssen?", "t1", [[16, 18]], { hinweis: ZEILE_TIPP }),
  z("In welchen Zeilen wird erklärt, warum eine Reparatur manchmal nicht gelingt?", "t1", [[29, 31]], { hinweis: ZEILE_TIPP }),
  f(ERGAENZE, [
    feld("So oft findet ein Repair-Café meistens statt:", ["einmal im Monat", "1-mal im Monat", "1x im Monat", "1 x im Monat", "1 mal im Monat", "ein Mal im Monat", "einmal pro Monat", "einmal monatlich", "monatlich", "jeden Monat", "meist einmal im Monat", "meistens einmal im Monat"]),
    feld("Diesen Beruf hatte Herr Zeitler früher:", ["Elektriker", "Elektriker im Ruhestand", "ein Elektriker", "er war Elektriker"]),
    feld("Das repariert Merle im Repair-Café:", ["Fahrräder", "Fahrrad", "die Fahrräder", "Räder", "Fahrraeder", "Fahrräder reparieren"])
  ], { text: "t1", hinweis: ERGAENZE_TIPP }),
  a("Erkläre mit eigenen Worten, was ein Repair-Café von einer Werkstatt unterscheidet. Nenne zwei Unterschiede.", [
    kr("erster Unterschied", 1, "Mögliche Unterschiede: Man gibt nichts ab, sondern hilft selbst mit und lernt dabei · die Hilfe kostet nichts (nur Ersatzteile, eine Spende ist freiwillig) · die Helfer arbeiten ehrenamtlich · es ist ein Treffen, das nur etwa einmal im Monat stattfindet."),
    kr("zweiter Unterschied", 1, "Ein weiterer, anderer Unterschied aus der Liste."),
    kr("verständlich in eigenen Worten erklärt", 1, "Nicht nur Sätze aus dem Text abgeschrieben; der Vergleich mit der Werkstatt ist erkennbar.")
  ], "In einer Werkstatt gibt man sein Gerät ab und bezahlt für die Reparatur. Im Repair-Café hilft man selbst mit, und die Hilfe ist kostenlos, weil die Helfer ehrenamtlich arbeiten.",
  ["selbst|mithelfen|hilft mit|gemeinsam|zusammen|lern", "kostenlos|kostet nichts|kein geld|ehrenamt|spende|umsonst|gratis|einmal im monat"], { text: "t1", zeilen: [7, 18], hilfe: "So kannst du beginnen: In einer Werkstatt … Im Repair-Café dagegen …", hinweis: "Bei einem Vergleich nennst du immer beide Seiten: Wie ist es hier, wie ist es dort?" }),
  a("Im Text heißt es: „Reparieren lohnt sich aus mehreren Gründen“ (Z. 32). Belege diese Aussage mit zwei Gründen aus dem Text und gib an, in welchen Zeilen sie stehen.", [
    kr("erster Grund richtig genannt", 1, "Mögliche Gründe: Man spart Geld, weil man nichts Neues kaufen muss (Z. 32–33) · man schont die Umwelt: weniger Rohstoffe und Energie, weniger Müll (Z. 33–37) · Wissen wird weitergegeben: Ältere zeigen Jüngeren, wie man repariert (Z. 37–41)."),
    kr("zweiter, anderer Grund richtig genannt", 1, "Ein weiterer Grund aus der Liste."),
    kr("passende Zeilenangaben", 2, "Je Grund 1 Punkt für eine Zeilenangabe, die die Textstelle trifft. Eine Zeile daneben gilt noch.")
  ], "Man spart Geld, weil man nichts Neues kaufen muss (Z. 32–33). Außerdem schont man die Umwelt, denn für neue Geräte werden Rohstoffe und Energie gebraucht (Z. 33–35).",
  ["geld|spar", "umwelt|rohstoff|energie|müll|wissen|können", "z.|zeile"], { text: "t1", zeilen: [32, 41], hilfe: "So kannst du schreiben: Ein Grund ist, dass … (Z. …). Außerdem … (Z. …).", hinweis: "Schreibe hinter jeden Grund sofort die Zeile, in der du ihn gefunden hast." }),
  a("Im Text steht: In einem Repair-Café bekommen kaputte Dinge „eine zweite Chance“ (Z. 5). Erkläre, was damit gemeint ist, und nenne ein Beispiel aus dem Text.", [
    kr("Bedeutung erklärt", 2, "Kaputte Dinge werden nicht weggeworfen, sondern repariert und danach weiter benutzt. 2 Punkte: beides genannt (nicht wegwerfen und wieder benutzen) · 1 Punkt: nur ungenau, z. B. „man kümmert sich um die Sachen“."),
    kr("Beispiel aus dem Text", 1, "z. B. der Mixer, der nach zwanzig Minuten wieder läuft · der Toaster, der eine neue Feder bekommt · die Fahrräder, die Merle repariert")
  ], "Damit ist gemeint, dass kaputte Dinge nicht im Müll landen, sondern repariert und weiter benutzt werden. Der Mixer läuft zum Beispiel nach zwanzig Minuten wieder.",
  ["müll|wegwerf|weggeworfen|wegschmei|entsorg", "reparier|weiter|wieder|noch einmal", "toaster|mixer|rucksack|kopfhörer|fahrr"], { text: "t1", hilfe: "So kannst du beginnen: Damit ist gemeint, dass …", hinweis: "Ersetze das Bild durch das, was wirklich passiert: Was geschieht mit dem kaputten Gegenstand?" }),
  f("Lies im Schaubild ab und ergänze.", [
    feld("Diese Gegenstände wurden am seltensten mitgebracht:", ["Möbel", "die Möbel", "Möbel (9)", "Möbel 9", "Moebel"]),
    feld("So viele Haushaltsgeräte mehr als Fahrräder wurden mitgebracht:", ["47", "siebenundvierzig", "47 mehr", "47 Gegenstände", "47 Geräte", "47 Stück", "+47", "+ 47"])
  ], { text: "t2", hinweis: RECHNE_TIPP }),
  a("Im Text steht: „Am häufigsten bringen die Gäste Geräte aus dem Haushalt mit“ (Z. 22–23). Prüfe mit dem Schaubild, ob das in Birkenfurt stimmt. Nenne Zahlen aus dem Schaubild und vergleiche sie.", [
    kr("Entscheidung passt zum Schaubild", 1, "Ja – die Aussage stimmt."),
    kr("passende Zahl genannt", 1, "Haushaltsgeräte: 78 (von 200 Gegenständen) – richtig abgelesen."),
    kr("mit einem anderen Wert verglichen", 1, "z. B. Kleidung und Taschen folgen mit 36, das ist nicht einmal halb so viel; Möbel wurden nur 9-mal gebracht. Ein richtiger Vergleich mit Zahl genügt.")
  ], "Ja, das stimmt. Im letzten Jahr wurden 78 Haushaltsgeräte mitgebracht. Das ist der höchste Wert. Auf dem zweiten Platz stehen Kleidung und Taschen mit nur 36.",
  ["ja|stimmt|richtig|passt", "78", "36|31|29|17|höchst|meisten|mehr als|doppelt"], { text: "t2", hilfe: "So kannst du beginnen: Das stimmt (nicht), denn im Schaubild …", hinweis: "Zu einem Vergleich gehören immer zwei Werte: der größte und einer, mit dem du ihn vergleichst." }),
  c("Was will der Text vor allem erreichen?", [
    "Er informiert über Repair-Cafés und zeigt, dass sich Reparieren lohnt.",
    "Er wirbt für den Kauf von besonders haltbaren Geräten.",
    "Er erzählt eine spannende Geschichte über einen kaputten Toaster.",
    "Er warnt davor, elektrische Geräte selbst zu öffnen."], 0, { points: 2, text: "t1", hinweis: ABSICHT_TIPP }),
  a(KERN_FRAGE, [
    kr("was ein Repair-Café ist", 1, "Ein Treffen, bei dem kaputte Dinge repariert statt weggeworfen werden."),
    kr("wie es abläuft", 1, "Ehrenamtliche Helfer unterstützen die Gäste kostenlos; die Gäste reparieren selbst mit."),
    kr("warum es sich lohnt", 1, "Mindestens ein Grund: Geld sparen · Umwelt schonen · Wissen weitergeben · Menschen kommen ins Gespräch.")
  ], "In einem Repair-Café werden kaputte Dinge repariert, statt sie wegzuwerfen. Ehrenamtliche Helfer zeigen den Gästen kostenlos, wie das geht. Das spart Geld, schont die Umwelt und bringt Menschen zusammen.",
  ["reparier", "ehrenamt|helfer|kostenlos|gemeinsam|selbst", "geld|umwelt|müll|wissen|gespräch|lern"], { text: "t1", hinweis: "Beantworte der Reihe nach drei Fragen: Was ist das? Wie läuft es ab? Wozu ist es gut?" }),
  a("Deine Schule überlegt, zweimal im Jahr ein Repair-Café in der Aula zu veranstalten. Hältst du das für eine gute Idee? Begründe deine Meinung mit zwei Informationen aus dem Text.", [
    kr("eigene Meinung klar formuliert", 1, "Dafür oder dagegen – eindeutig erkennbar."),
    kr("zwei Informationen aus dem Text als Begründung", 2, "Je passender Information 1 Punkt. Dafür z. B.: Man spart Geld · es entsteht weniger Müll, Rohstoffe werden geschont · Jugendliche lernen reparieren und können mithelfen · Menschen kommen ins Gespräch. Dagegen lässt sich mit dem Text sagen: Man braucht Helfer, die sich auskennen · nicht jede Reparatur gelingt · elektrische Geräte müssen auf ihre Sicherheit geprüft werden.")
  ], "Ich halte das für eine gute Idee. Im Text steht, dass man beim Reparieren Geld spart und weniger Müll entsteht. Außerdem könnten wir Jugendlichen dabei lernen, wie man etwas selbst repariert.",
  ["gut|sinnvoll|dafür|dagegen|finde|halte|meinung", "geld|müll|umwelt|rohstoff|lernen|wissen|gespräch|helfer|sicher"], { text: "t1", hilfe: "So kannst du beginnen: Ich halte das für (k)eine gute Idee, denn im Text steht, dass …", hinweis: "Eine Meinung überzeugt erst, wenn du sie mit Angaben aus dem Text stützt. Suche zwei passende Stellen." })
];

/* ------------------------------ R8, Variante B: Bibliothek der Dinge ------------------------------ */
const R_B = [
  c("Welches Thema hat der Text?", [
    "Wie eine Bibliothek der Dinge funktioniert und welche Vorteile das Leihen hat",
    "Wie man in einer Bücherei schnell das richtige Buch findet",
    "Warum Werkzeug und Küchengeräte immer teurer werden",
    "Wie eine Familie ein Zeltlager und einen Geburtstag vorbereitet"], 0, { text: "t1", hinweis: THEMA_TIPP }),
  m(UEBERSCHRIFTEN, [
    ["Abschnitt 1 (Z. 1–7)", "Teuer gekauft, selten gebraucht"],
    ["Abschnitt 2 (Z. 8–19)", "Wie eine Bücherei, nur ohne Bücher"],
    ["Abschnitt 3 (Z. 20–30)", "Das Angebot in Haselbrunn"],
    ["Abschnitt 4 (Z. 31–39)", "Was für das Leihen spricht"],
    ["Abschnitt 5 (Z. 40–50)", "Regeln und Erfahrungen"]], { points: 3, text: "t1", hinweis: UEBERSCHRIFT_TIPP }),
  z("In welchen Zeilen steht, was das Ausleihen in einer Bibliothek der Dinge kostet?", "t1", [[16, 17]], { hinweis: ZEILE_TIPP }),
  z("In welchen Zeilen wird erklärt, was die Leiterin prüft, wenn ein Gerät zurückkommt?", "t1", [[25, 28]], { hinweis: ZEILE_TIPP }),
  f(ERGAENZE, [
    feld("So viele Gegenstände stehen in Haselbrunn bereit:", ["180", "rund 180", "etwa 180", "ca. 180", "ungefähr 180", "180 Gegenstände", "rund 180 Gegenstände", "etwa 180 Gegenstände", "ca. 180 Gegenstände"]),
    feld("Das gehört zu jedem Gerät dazu:", ["Anleitung", "eine Anleitung", "eine kurze Anleitung", "kurze Anleitung", "die Anleitung", "Gebrauchsanleitung", "eine Gebrauchsanleitung"]),
    feld("Das hat sich Arvid schon dreimal geliehen:", ["Beamer", "einen Beamer", "den Beamer", "ein Beamer", "einen Beamer für einen Filmabend"])
  ], { text: "t1", hinweis: ERGAENZE_TIPP }),
  a("Erkläre mit eigenen Worten, was die Bibliothek der Dinge mit einer Bücherei gemeinsam hat und was anders ist.", [
    kr("Gemeinsamkeit", 1, "Man meldet sich an (Ausweis), leiht etwas aus und bringt es nach einer festen Zeit zurück."),
    kr("Unterschied", 1, "Es gibt dort keine Bücher, sondern Gegenstände für den Alltag (Werkzeug, Küchengeräte, Spiele, Zelte …)."),
    kr("verständlich in eigenen Worten erklärt", 1, "Nicht nur Sätze aus dem Text abgeschrieben; Gemeinsamkeit und Unterschied sind als solche erkennbar.")
  ], "Wie in einer Bücherei meldet man sich an, leiht etwas aus und bringt es nach einer bestimmten Zeit wieder zurück. Der Unterschied ist, dass man keine Bücher bekommt, sondern Gegenstände wie Werkzeug oder Küchengeräte.",
  ["ausleih|leih|zurück|ausweis|anmeld", "keine bücher|statt bücher|gegenst|werkzeug|geräte|dinge|sachen"], { text: "t1", zeilen: [8, 19], hilfe: "So kannst du beginnen: Gemeinsam ist beiden, dass … Anders ist, dass …", hinweis: "Bei einem Vergleich nennst du immer beide Seiten: Was ist gleich, was ist verschieden?" }),
  a("Im Text heißt es: „Das Leihen hat mehrere Vorteile“ (Z. 31). Belege diese Aussage mit zwei Vorteilen aus dem Text und gib an, in welchen Zeilen sie stehen.", [
    kr("erster Vorteil richtig genannt", 1, "Mögliche Vorteile: Man spart Geld, weil man teure Geräte nicht kaufen muss (Z. 31–33) · man braucht zu Hause weniger Platz (Z. 33–34) · es ist gut für die Umwelt: weniger Geräte, Rohstoffe, Energie und Müll (Z. 34–38) · man kann etwas erst ausprobieren (Z. 38–39)."),
    kr("zweiter, anderer Vorteil richtig genannt", 1, "Ein weiterer Vorteil aus der Liste."),
    kr("passende Zeilenangaben", 2, "Je Vorteil 1 Punkt für eine Zeilenangabe, die die Textstelle trifft. Eine Zeile daneben gilt noch.")
  ], "Man muss teure Geräte nicht selbst kaufen und spart dadurch Geld (Z. 32–33). Außerdem braucht man zu Hause weniger Platz, weil nichts im Keller herumsteht (Z. 33–34).",
  ["geld|spar", "platz|umwelt|rohstoff|energie|müll|ausprobier", "z.|zeile"], { text: "t1", zeilen: [31, 39], hilfe: "So kannst du schreiben: Ein Vorteil ist, dass … (Z. …). Außerdem … (Z. …).", hinweis: "Schreibe hinter jeden Vorteil sofort die Zeile, in der du ihn gefunden hast." }),
  a("Frau Nowak sagt: „Die Dinge gehören hier allen ein bisschen“ (Z. 44–45). Erkläre, was sie damit meint, und nenne eine Regel aus dem Text, die deshalb wichtig ist.", [
    kr("Bedeutung erklärt", 2, "Die Gegenstände gehören nicht einer einzelnen Person: Viele Menschen teilen sie sich und benutzen sie nacheinander. 2 Punkte: beides genannt (nicht einem allein, sondern gemeinsam genutzt) · 1 Punkt: nur ungenau, z. B. „jeder darf sie haben“."),
    kr("Regel aus dem Text", 1, "z. B. pünktlich zurückbringen · sauber und vollständig zurückgeben · einen Schaden gleich melden · sorgfältig mit den Sachen umgehen")
  ], "Sie meint, dass die Gegenstände nicht einem Einzelnen gehören, sondern von vielen Menschen nacheinander benutzt werden. Deshalb muss man sie pünktlich und sauber zurückbringen.",
  ["allen|viele|jeder|gemeinsam|teilen|nacheinander|nicht einem", "pünktlich|zurück|sauber|vollständig|sorgfältig|schaden|beschädig|melden"], { text: "t1", hilfe: "So kannst du beginnen: Sie meint damit, dass …", hinweis: "Frage dich: Wem gehört der Gegenstand, und wer benutzt ihn nach dir?" }),
  f("Lies in der Tabelle ab und ergänze.", [
    feld("Diese Gegenstände wurden am seltensten ausgeliehen:", ["Musikinstrumente", "die Musikinstrumente", "Musikinstrumente (8)", "Musikinstrumente 8", "Musikinstrument", "Instrumente"]),
    feld("So viele Ausleihen mehr gab es bei Werkzeug als bei Küchengeräten:", ["44", "vierundvierzig", "44 mehr", "44 Ausleihen", "44-mal", "44 mal", "+44", "+ 44"])
  ], { text: "t2", hinweis: RECHNE_TIPP }),
  a("Im Text steht: „Am häufigsten leihen die Leute Werkzeug aus“ (Z. 23–24). Prüfe mit der Tabelle, ob das in Haselbrunn stimmt. Nenne Zahlen aus der Tabelle und vergleiche sie.", [
    kr("Entscheidung passt zur Tabelle", 1, "Ja – die Aussage stimmt."),
    kr("passende Zahl genannt", 1, "Werkzeug: 82 Ausleihen (von 200) – richtig abgelesen."),
    kr("mit einem anderen Wert verglichen", 1, "z. B. Küchengeräte folgen mit 38, das ist nicht einmal halb so viel; Musikinstrumente wurden nur 8-mal geliehen. Ein richtiger Vergleich mit Zahl genügt.")
  ], "Ja, das stimmt. Werkzeug wurde im letzten Jahr 82-mal ausgeliehen. Das ist mit Abstand der höchste Wert, denn Küchengeräte kommen als Nächstes nur auf 38 Ausleihen.",
  ["ja|stimmt|richtig|passt", "82", "38|33|21|18|höchst|meisten|mehr als|doppelt"], { text: "t2", hilfe: "So kannst du beginnen: Das stimmt (nicht), denn in der Tabelle …", hinweis: "Zu einem Vergleich gehören immer zwei Werte: der größte und einer, mit dem du ihn vergleichst." }),
  c("Was will der Text vor allem erreichen?", [
    "Er informiert über die Bibliothek der Dinge und zeigt, welche Vorteile das Leihen hat.",
    "Er wirbt für ein Geschäft, das Werkzeug besonders günstig verkauft.",
    "Er erzählt eine lustige Geschichte über einen Filmabend unter Freunden.",
    "Er warnt davor, fremde Geräte ohne Anleitung zu benutzen."], 0, { points: 2, text: "t1", hinweis: ABSICHT_TIPP }),
  a(KERN_FRAGE, [
    kr("was eine Bibliothek der Dinge ist", 1, "Ein Ort, an dem man Gegenstände für den Alltag ausleihen kann, statt sie zu kaufen."),
    kr("wie es abläuft", 1, "Man meldet sich an, leiht aus und bringt den Gegenstand nach einer festen Zeit zurück; dabei gelten Regeln."),
    kr("warum es sich lohnt", 1, "Mindestens ein Vorteil: Geld sparen · weniger Platz nötig · gut für die Umwelt · erst ausprobieren.")
  ], "In einer Bibliothek der Dinge kann man Gegenstände wie Werkzeug oder Küchengeräte ausleihen und muss sie nicht kaufen. Man meldet sich an und bringt die Sachen nach einer festen Zeit zurück. So spart man Geld und Platz und schont die Umwelt.",
  ["leih", "anmeld|ausweis|zurück|regel", "geld|platz|umwelt|müll|rohstoff|ausprobier"], { text: "t1", hinweis: "Beantworte der Reihe nach drei Fragen: Was ist das? Wie läuft es ab? Wozu ist es gut?" }),
  a("In eurer Schule soll ein Regal eingerichtet werden, aus dem sich alle Klassen Dinge leihen können, zum Beispiel Bälle, Spiele oder einen Lautsprecher. Hältst du das für eine gute Idee? Begründe deine Meinung mit zwei Informationen aus dem Text.", [
    kr("eigene Meinung klar formuliert", 1, "Dafür oder dagegen – eindeutig erkennbar."),
    kr("zwei Informationen aus dem Text als Begründung", 2, "Je passender Information 1 Punkt. Dafür z. B.: Man spart Geld, weil nicht jede Klasse alles kaufen muss · es wird weniger Platz gebraucht · insgesamt sind weniger Dinge nötig, das schont die Umwelt · man kann etwas ausprobieren. Dagegen oder als Bedingung lässt sich mit dem Text sagen: Es braucht feste Regeln · beliebte Dinge sind oft vergeben · jemand muss prüfen, ob alles vollständig zurückkommt.")
  ], "Ich finde die Idee gut. Im Text steht, dass man beim Leihen Geld spart, weil nicht jeder alles selbst kaufen muss. Außerdem werden insgesamt weniger Dinge gebraucht, wenn viele sie sich teilen. Wichtig wären aber Regeln, damit alles pünktlich zurückkommt.",
  ["gut|sinnvoll|dafür|dagegen|finde|halte|meinung", "geld|platz|umwelt|teilen|ausprobier|regel|vergeben|zurück|prüf"], { text: "t1", hilfe: "So kannst du beginnen: Ich halte das für (k)eine gute Idee, denn im Text steht, dass …", hinweis: "Eine Meinung überzeugt erst, wenn du sie mit Angaben aus dem Text stützt. Suche zwei passende Stellen." })
];

/* ------------------------------ M8, Variante A: Repair-Café ------------------------------ */
const M_A = [
  c("Welcher Satz gibt die Kernaussage des ganzen Textes am besten wieder?", [
    "Repair-Cafés retten viele Geräte und verändern den Umgang mit Dingen, stoßen aber an Grenzen, die auch mit der Bauweise der Geräte zusammenhängen.",
    "Repair-Cafés sind wenig sinnvoll, weil die meisten Reparaturen an fehlenden Ersatzteilen scheitern.",
    "Elektroschrott entsteht vor allem deshalb, weil die Verbraucher zu bequem zum Reparieren sind.",
    "Die Europäische Union hat das Problem des Elektroschrotts mit neuen Vorschriften gelöst."], 0, { points: 2, text: "t1", hinweis: KERN_TIPP }),
  m(UEBERSCHRIFTEN_M, [
    ["Abschnitt 1 (Z. 1–7)", "Zu billig für die Werkstatt"],
    ["Abschnitt 2 (Z. 8–18)", "Eine Idee aus Amsterdam"],
    ["Abschnitt 3 (Z. 19–33)", "Bilanz eines Reparaturtreffs"],
    ["Abschnitt 6 (Z. 60–68)", "Grenzen und eigentliche Stärke"]], { points: 3, text: "t1", hinweis: UEBERSCHRIFT_TIPP }),
  a("Für die Abschnitte 4 (Z. 34–49) und 5 (Z. 50–59) fehlt noch eine Überschrift. Formuliere für jeden der beiden Abschnitte selbst eine kurze, treffende Überschrift.", [
    kr("Überschrift für Abschnitt 4", 2, "Thema des ganzen Abschnitts: Was das Reparieren erschwert – die Bauweise der Geräte, fehlende oder teure Ersatzteile, der niedrige Neupreis; dazu die Reaktion der Politik. Z. B. „Was das Reparieren schwer macht“ oder „Gebaut, um nicht geöffnet zu werden“. 2 Punkte: nennt die Hindernisse (Bauweise, Hersteller) als Thema und ist kurz · 1 Punkt: nennt nur eine Einzelheit (z. B. nur „Akkus“ oder nur „Zuschuss“), bleibt zu allgemein (nur „Geräte“) oder ist ein abgeschriebener ganzer Satz."),
    kr("Überschrift für Abschnitt 5", 2, "Thema des ganzen Abschnitts: der Nutzen des Reparierens für Umwelt, Geldbeutel und das eigene Zutrauen zur Technik. Z. B. „Was Reparieren bringt“ oder „Gewinn für Umwelt und Mensch“. 2 Punkte: nennt den Nutzen (Gewinn, Vorteile) und ist kurz · 1 Punkt: nennt nur eine Einzelheit (z. B. nur „Staubsauger“ oder nur „Geld“), bleibt zu allgemein oder ist ein abgeschriebener ganzer Satz.")
  ], "Abschnitt 4: Was das Reparieren schwer macht. Abschnitt 5: Gewinn für Umwelt und Mensch.",
  ["bauweise|hersteller|gebaut|verklebt|ersatzteil|hindernis|schwer|scheiter", "nutzen|gewinn|vorteil|bringt|umwelt|lohnt"], { text: "t1", hinweis: "Eine gute Überschrift passt zum ganzen Abschnitt. Prüfe: Kommt das, was sie nennt, in mehreren Sätzen des Abschnitts vor?" }),
  z("In welchen Zeilen wird beschrieben, was mit „Hilfe zur Selbsthilfe“ gemeint ist?", "t1", [[14, 17]], { hinweis: ZEILE_TIPP }),
  z("In welchen Zeilen steht, wozu Hersteller in der Europäischen Union inzwischen verpflichtet sind?", "t1", [[44, 47]], { hinweis: ZEILE_TIPP }),
  a("Erkläre mit eigenen Worten den Zusammenhang, den der Text zwischen der Lebensdauer eines Geräts und der Umwelt herstellt.", [
    kr("längere Nutzung", 1, "Ein Gerät, das länger hält (weil es repariert wird), muss erst später ersetzt werden."),
    kr("Folge für Rohstoffe und Energie", 1, "Es müssen weniger neue Geräte hergestellt und transportiert werden; der Bedarf an Rohstoffen und Energie sinkt."),
    kr("Folge für den Abfall", 1, "Es entsteht weniger Abfall (Elektroschrott).")
  ], "Wird ein Gerät repariert, hält es länger und muss erst später durch ein neues ersetzt werden. Dadurch braucht man weniger Rohstoffe und weniger Energie für Herstellung und Transport, und es fällt weniger Abfall an.",
  ["länger|später|ersetz", "rohstoff|energie|herstell", "abfall|müll|schrott"], { text: "t1", zeilen: [50, 54], hinweis: "Einen Zusammenhang erklärst du als Kette: Wenn …, dann … – und deshalb …" }),
  a("„Im Repair-Café sollen die Besucher selbst etwas lernen.“ Belege diese Aussage mit zwei verschiedenen Textstellen: Zitiere wörtlich oder gib sinngemäß wieder (vgl.), nenne jeweils die Zeilen und erkläre in einem Satz, was die Stellen zeigen.",
    BELEGE_KR("Die Besucher „suchen gemeinsam mit den Helfern nach dem Fehler“ (Z. 15–16) · „Hilfe zur Selbsthilfe“ (Z. 16–17) · wer ein Gerät von innen gesehen hat, „verliert die Scheu vor der Technik“ (Z. 57–58) und greift später selbst zum Schraubendreher (vgl. Z. 58–59) · Jugendliche der Technikgruppe helfen mit (vgl. Z. 23–24).", "Die Stellen zeigen: Die Gäste geben ihr Gerät nicht nur ab, sondern lernen, Fehler zu finden und selbst zu reparieren."),
    "Die Besucher „suchen gemeinsam mit den Helfern nach dem Fehler“ (Z. 15–16). Außerdem verliert, wer einmal ein Gerät von innen gesehen hat, „die Scheu vor der Technik“ (Z. 57–58). Beide Stellen zeigen, dass die Gäste nicht nur ein repariertes Gerät mitnehmen, sondern selbst etwas über das Reparieren lernen.",
    ["gemeinsam|selbsthilfe|scheu|fehler|technik|schraubendreher", "z.|zeile|vgl", "zeig|lern|selbst"], { text: "t1", hinweis: BELEG_TIPP }),
  a("Im Text steht: „Ihre eigentliche Stärke liegt woanders: Sie verändern die Einstellung der Menschen“ (Z. 63–64). Gib diese Aussage in einem eigenen Satz wieder und baue dabei eine Wortgruppe aus der Textstelle als Zitat in deinen Satz ein.",
    EINBAU_KR("… bestehe der wichtigste Erfolg darin, dass sie „die Einstellung der Menschen“ (Z. 63–64) verändern.", "Die wichtigste Wirkung der Repair-Cafés ist, dass die Menschen anders über das Reparieren und über ihre Geräte denken."),
    "Dem Text zufolge besteht der wichtigste Erfolg der Repair-Cafés darin, dass sie „die Einstellung der Menschen“ (Z. 63–64) verändern.",
    ["einstellung der menschen|eigentliche stärke|verändern", "z.|zeile"], { text: "t1", zeilen: [60, 66], hinweis: EINBAU_TIPP }),
  f("Lies im Schaubild ab, rechne und ergänze.", [
    feld("So viele Gegenstände wurden insgesamt repariert (sofort oder mit bestelltem Ersatzteil):", ["200", "zweihundert", "200 Gegenstände", "200 Geräte", "200 Stück", "200 von 300"]),
    feld("So viele Reparaturen scheiterten am Ersatzteil oder am Gehäuse (zusammen):", ["62", "zweiundsechzig", "62 Reparaturen", "62 Gegenstände", "62 Geräte", "62 Stück"])
  ], { text: "t2", hinweis: RECHNE_TIPP_M }),
  a("Frau Brandstetter sagt: „Ungefähr zwei von drei Geräten können wir retten“ (Z. 29–30). Prüfe diese Aussage mit dem Schaubild: Rechne nach und nenne die Zahlen. Erkläre dann mit Schaubild und Text, woran die übrigen Reparaturen vor allem scheitern.", [
    kr("Aussage richtig beurteilt", 1, "Die Aussage stimmt (sogar genau)."),
    kr("mit Zahlen nachgerechnet", 2, "164 sofort + 36 mit bestelltem Ersatzteil = 200 von 300 Gegenständen, das sind zwei Drittel. 2 Punkte: Rechnung und Bezug auf die Gesamtzahl · 1 Punkt: nur einzelne Werte abgelesen oder nur die Summe ohne Bezug auf 300."),
    kr("Gründe mit Schaubild und Text erklärt", 1, "Am häufigsten ist das Ersatzteil nicht mehr erhältlich (38), oft lässt sich das Gehäuse nicht öffnen (24) – laut Text liegt das an der Bauweise der Geräte und an den Herstellern, nicht am Können der Helfer (Z. 34–39).")
  ], "Die Aussage stimmt. 164 Gegenstände wurden sofort repariert und 36 mit einem bestellten Ersatzteil, zusammen also 200 von 300. Das sind genau zwei von drei. Die übrigen Reparaturen scheiterten am häufigsten daran, dass es kein Ersatzteil mehr gab (38) oder dass sich das Gehäuse nicht öffnen ließ (24). Nach dem Text liegt das an der Bauweise der Geräte.",
  ["200|164|zwei drittel", "300", "ersatzteil|gehäuse|bauweise|verklebt|hersteller"], { text: "t2", hinweis: "Wer eine Aussage mit Zahlen prüft, nennt die Werte, die Rechnung und das Ergebnis – und sagt dann erst, ob die Aussage stimmt." }),
  c("Welche Aussage lässt sich mit dem Text NICHT belegen?", [
    "Die meisten Hersteller bauen ihre Geräte absichtlich so, dass sie bald kaputtgehen.",
    "Das erste Repair-Café fand in Amsterdam statt.",
    "In Sonnried wird festgehalten, wie jede Reparatur ausgegangen ist.",
    "Für manche Geräte müssen Hersteller in der Europäischen Union über Jahre Ersatzteile anbieten."], 0, { points: 2, text: "t1", hinweis: NICHT_TIPP }),
  a(ABSICHT_FRAGE,
    ABSICHT_KR("Der Text nennt Tatsachen und Zahlen (2009, zwölf Ehrenamtliche, Schaubild) · Fachleute, Kritiker und die Leiterin kommen zu Wort, zum Teil in indirekter Rede · sachliche Sprache ohne Ausrufe und ohne Anrede der Leser · er nennt auch Grenzen und Hindernisse, nicht nur Vorteile (Z. 34–49, 60–62)."),
    "Der Text will vor allem sachlich informieren. Das erkennt man an den vielen Tatsachen und Zahlen, zum Beispiel dem Jahr 2009 und der Auswertung aus Sonnried. Außerdem nennt er nicht nur Vorteile, sondern auch Grenzen: Repair-Cafés würden das Müllproblem allein nicht lösen (vgl. Z. 60–61).",
    ["informier|sachlich|aufklär", "zahl|tatsache|fakt|schaubild|grenze|nachteil|zitat|fachleute|sprache|beide seiten"], { text: "t1", hinweis: "Die Absicht erkennst du an der Machart: Welche Art von Angaben kommt vor, und wie spricht der Text über sein Thema?" }),
  a("Ein Schüler meint nach dem Lesen: „Repair-Cafés bringen nichts – ein Drittel der Sachen landet ja trotzdem im Müll.“ Beurteile diese Aussage mit Hilfe von Text und Schaubild. Zeige, was daran stimmt und was dagegen spricht, und formuliere dein eigenes Urteil.",
    URTEIL_KR("Etwa ein Drittel der Gegenstände (100 von 300) konnte tatsächlich nicht repariert werden; auch der Text sagt, dass Repair-Cafés das Müllproblem allein nicht lösen (Z. 60–61).", "Zwei Drittel der Gegenstände werden gerettet, das spart Rohstoffe, Energie, Abfall und Geld (Z. 50–55) · die Besucher lernen dazu und verlieren die Scheu vor der Technik (Z. 56–59) · die Einstellung ändert sich: Man achtet beim nächsten Kauf darauf, ob sich ein Gerät reparieren lässt (Z. 63–66)."),
    "An der Aussage stimmt, dass ein Drittel der Gegenstände nicht repariert werden konnte: In Sonnried waren es 100 von 300. Auch der Text räumt ein, dass Repair-Cafés das Müllproblem allein nicht lösen (vgl. Z. 60–61). Trotzdem ist die Aussage zu einseitig. Zwei von drei Geräten werden gerettet, und das spart Rohstoffe, Energie und Geld. Außerdem verändern die Treffen „die Einstellung der Menschen“ (Z. 63–64), die danach eher auf reparierbare Geräte achten. Ich halte Repair-Cafés deshalb für sinnvoll, auch wenn sie nicht alles retten können.",
    ["drittel|100|nicht repariert|nicht lösen", "zwei von drei|200|rohstoff|energie|geld|einstellung|lern|scheu", "einseitig|trotzdem|dennoch|allerdings|urteil|meiner meinung|halte|finde"], { text: "t1", hinweis: "Beurteilen heißt abwägen: erst sagen, was stimmt, dann, was dagegen spricht – und am Schluss ein klares eigenes Urteil." })
];

/* ------------------------------ M8, Variante B: Bibliothek der Dinge ------------------------------ */
const M_B = [
  c("Welcher Satz gibt die Kernaussage des ganzen Textes am besten wieder?", [
    "Leihläden sparen Geld, Platz und Rohstoffe und regen zum Nachdenken über Besitz an, können das Kaufen aber nicht ganz ersetzen.",
    "Leihläden werden kaum genutzt, weil den meisten Menschen der Weg dorthin zu umständlich ist.",
    "Wer Geräte kauft, statt sie zu leihen, handelt gedankenlos und schadet vor allem sich selbst.",
    "Bibliotheken der Dinge haben den Kauf von Werkzeug in vielen Orten überflüssig gemacht."], 0, { points: 2, text: "t1", hinweis: KERN_TIPP }),
  m(UEBERSCHRIFTEN_M, [
    ["Abschnitt 1 (Z. 1–8)", "Gekauft für einen einzigen Anlass"],
    ["Abschnitt 2 (Z. 9–19)", "Teilen wird organisiert"],
    ["Abschnitt 3 (Z. 20–33)", "Der Leihladen in Weiherstetten"],
    ["Abschnitt 6 (Z. 58–65)", "Eine Frage vor jedem Kauf"]], { points: 3, text: "t1", hinweis: UEBERSCHRIFT_TIPP }),
  a("Für die Abschnitte 4 (Z. 34–45) und 5 (Z. 46–57) fehlt noch eine Überschrift. Formuliere für jeden der beiden Abschnitte selbst eine kurze, treffende Überschrift.", [
    kr("Überschrift für Abschnitt 4", 2, "Thema des ganzen Abschnitts: Gründe, warum viele Menschen trotzdem lieber kaufen – Zeitaufwand, Gewohnheit, Scheu vor fremden Geräten, niedrige Preise. Z. B. „Warum viele trotzdem kaufen“ oder „Was vom Leihen abhält“. 2 Punkte: nennt die Gründe gegen das Leihen (für das Kaufen) als Thema und ist kurz · 1 Punkt: nennt nur eine Einzelheit (z. B. nur „Öffnungszeiten“ oder nur „Stichsäge“), bleibt zu allgemein (nur „Kaufen“) oder ist ein abgeschriebener ganzer Satz."),
    kr("Überschrift für Abschnitt 5", 2, "Thema des ganzen Abschnitts: die Vorteile des Leihens für Geldbeutel, Umwelt und Menschen mit wenig Geld. Z. B. „Was das Leihen bringt“ oder „Vorteile für Mensch und Umwelt“. 2 Punkte: nennt die Vorteile (den Nutzen) und ist kurz · 1 Punkt: nennt nur eine Einzelheit (z. B. nur „Nähmaschine“ oder nur „Stauraum“), bleibt zu allgemein oder ist ein abgeschriebener ganzer Satz.")
  ], "Abschnitt 4: Warum viele trotzdem kaufen. Abschnitt 5: Vorteile für Mensch und Umwelt.",
  ["trotzdem|gründe|kaufen|abhält|gewohnheit|aufwand|hindernis|dagegen", "vorteil|nutzen|bringt|gewinn|umwelt|lohnt"], { text: "t1", hinweis: "Eine gute Überschrift passt zum ganzen Abschnitt. Prüfe: Kommt das, was sie nennt, in mehreren Sätzen des Abschnitts vor?" }),
  z("In welchen Zeilen wird beschrieben, was eine Bibliothek der Dinge mit den Gegenständen macht?", "t1", [[12, 15]], { hinweis: ZEILE_TIPP }),
  z("In welchen Zeilen steht, was sich ein Leihladen leisten kann, ein einzelner Haushalt aber oft nicht?", "t1", [[50, 53]], { hinweis: ZEILE_TIPP }),
  a("Erkläre mit eigenen Worten den Zusammenhang, den der Text zwischen niedrigen Preisen und der Entscheidung gegen das Leihen herstellt.", [
    kr("niedrige Preise", 1, "Einfache Geräte sind heute sehr billig (eine Stichsäge kostet kaum mehr als ein Kinoabend)."),
    kr("Aufwand des Leihens", 1, "Leihen kostet dagegen Zeit und Mühe: reservieren, abholen, pünktlich zurückbringen, feste Öffnungszeiten."),
    kr("Folge", 1, "Deshalb erscheint vielen der Kauf einfacher; der Weg zum Leihladen lohnt sich für sie scheinbar nicht.")
  ], "Viele einfache Geräte kosten heute nur wenig. Wer leiht, muss dagegen reservieren, den Gegenstand abholen und pünktlich zurückbringen. Weil der Kauf so billig ist, kommt vielen dieser Aufwand zu groß vor, und sie kaufen lieber.",
  ["billig|günstig|niedrig|wenig kostet|preis", "zeit|aufwand|umständlich|abholen|reservier|zurückbring|öffnungszeit", "deshalb|darum|also|lieber|einfacher|lohnt"], { text: "t1", zeilen: [34, 45], hinweis: "Einen Zusammenhang erklärst du als Kette: Wenn …, dann … – und deshalb …" }),
  a("„Ein Leihladen sorgt dafür, dass seine Gegenstände in gutem Zustand sind.“ Belege diese Aussage mit zwei verschiedenen Textstellen: Zitiere wörtlich oder gib sinngemäß wieder (vgl.), nenne jeweils die Zeilen und erkläre in einem Satz, was die Stellen zeigen.",
    BELEGE_KR("„Jedes Teil wird bei der Rückgabe geprüft“ (Z. 26) und erst danach wieder freigegeben (vgl. Z. 27) · der Leihladen leistet sich „hochwertige, langlebige Geräte“ (Z. 51) · „er lässt sie reparieren, wenn etwas kaputtgeht“ (Z. 53).", "Die Stellen zeigen: Der Leihladen kümmert sich darum, dass alles funktioniert und lange hält, bevor es der Nächste bekommt."),
    "Im Text heißt es: „Jedes Teil wird bei der Rückgabe geprüft“ (Z. 26). Außerdem lässt der Leihladen seine Geräte reparieren, „wenn etwas kaputtgeht“ (Z. 53). Beide Stellen zeigen, dass der Laden darauf achtet, dass alles funktioniert, bevor es die nächste Person bekommt.",
    ["geprüft|prüf|reparier|hochwertig|langlebig|freigegeben", "z.|zeile|vgl", "zeig|funktionier|zustand|in ordnung|kümmer"], { text: "t1", hinweis: BELEG_TIPP }),
  a("Im Text steht: „Wichtiger ist etwas anderes: Sie legt ihren Nutzern eine einfache Frage nahe“ (Z. 61–62). Gib diese Aussage in einem eigenen Satz wieder und baue dabei eine Wortgruppe aus der Textstelle als Zitat in deinen Satz ein.",
    EINBAU_KR("… sei vor allem wichtig, dass sie ihren Nutzern „eine einfache Frage“ (Z. 62) nahelegt.", "Der eigentliche Wert der Bibliothek der Dinge liegt darin, dass sie die Nutzer zum Nachdenken bringt: Muss ich etwas besitzen, oder genügt es, es zu benutzen?"),
    "Dem Text zufolge ist an der Bibliothek der Dinge vor allem wichtig, dass sie ihren Nutzern „eine einfache Frage“ (Z. 62) nahelegt, nämlich ob man etwas wirklich besitzen muss.",
    ["einfache frage|wichtiger|nahe", "z.|zeile"], { text: "t1", zeilen: [58, 65], hinweis: EINBAU_TIPP }),
  f("Lies in der Tabelle ab, rechne und ergänze.", [
    feld("So viele Ausleihen entfielen auf Werkzeug und Gartengeräte zusammen:", ["316", "dreihundertsechzehn", "316 Ausleihen", "316-mal", "316 mal", "316 von 600"]),
    feld("So viele Ausleihen mehr gab es bei „Küche und Feste“ als bei „Kinder und Spiele“:", ["58", "achtundfünfzig", "58 mehr", "58 Ausleihen", "58-mal", "58 mal", "+58", "+ 58"])
  ], { text: "t2", hinweis: RECHNE_TIPP_M }),
  a("Herr Ruppert sagt, mehr als die Hälfte aller Ausleihen entfalle auf Werkzeug und Gartengeräte (Z. 29–30). Prüfe diese Aussage mit der Tabelle: Rechne nach und nenne die Zahlen. Erkläre dann mit dem Text, warum gerade solche Geräte besonders oft geliehen werden.", [
    kr("Aussage richtig beurteilt", 1, "Die Aussage stimmt (knapp)."),
    kr("mit Zahlen nachgerechnet", 2, "212 (Werkzeug) + 104 (Gartengeräte) = 316 von 600 Ausleihen; die Hälfte wären 300. 2 Punkte: Rechnung und Vergleich mit der Hälfte oder der Gesamtzahl · 1 Punkt: nur einzelne Werte abgelesen oder nur die Summe ohne Vergleich."),
    kr("mit dem Text erklärt", 1, "Solche Geräte braucht man nur selten oder für einen einzelnen Anlass (Umzug, Frühjahr); ein Kauf lohnt sich deshalb kaum (Z. 1–8), im Leihladen sind sie dagegen ständig im Einsatz (Z. 31–33).")
  ], "Die Aussage stimmt. Auf Werkzeug entfielen 212 und auf Gartengeräte 104 Ausleihen, zusammen 316 von 600. Die Hälfte wären 300, es ist also etwas mehr. Solche Geräte braucht man meist nur für einen einzelnen Anlass, zum Beispiel für einen Umzug. Deshalb lohnt es sich kaum, sie zu kaufen.",
  ["316|212|104", "600|300|hälfte", "selten|anlass|umzug|lohnt|einmal|wenige stunden|kaum"], { text: "t2", hinweis: "Wer eine Aussage mit Zahlen prüft, nennt die Werte, die Rechnung und das Ergebnis – und sagt dann erst, ob die Aussage stimmt." }),
  c("Welche Aussage lässt sich mit dem Text NICHT belegen?", [
    "Wer Dinge leiht, geht sorgfältiger mit ihnen um als mit dem eigenen Besitz.",
    "Für besonders wertvolle Geräte wird manchmal ein Pfand verlangt.",
    "Die meisten Gegenstände im Leihladen von Weiherstetten wurden gespendet.",
    "Auf dem Land ist der nächste Leihladen oft weit entfernt."], 0, { points: 2, text: "t1", hinweis: NICHT_TIPP }),
  a(ABSICHT_FRAGE,
    ABSICHT_KR("Der Text nennt Tatsachen und Zahlen (rund 400 Gegenstände, Leihfrist, Tabelle) · der Vorsitzende des Vereins kommt zu Wort, zum Teil in indirekter Rede · sachliche Sprache ohne Ausrufe und ohne Aufforderung an die Leser · er stellt beide Seiten dar: Vorteile des Leihens und Gründe, lieber zu kaufen (Z. 34–45), dazu die Grenzen (Z. 58–61)."),
    "Der Text will in erster Linie informieren. Er nennt Tatsachen und Zahlen, etwa die rund 400 Gegenstände und die Tabelle aus Weiherstetten. Außerdem stellt er beide Seiten dar: die Vorteile des Leihens, aber auch die Gründe, warum viele lieber kaufen (vgl. Z. 34–45).",
    ["informier|sachlich|aufklär", "zahl|tatsache|fakt|tabelle|grenze|nachteil|zitat|beide seiten|sprache|gründe"], { text: "t1", hinweis: "Die Absicht erkennst du an der Machart: Welche Art von Angaben kommt vor, und wie spricht der Text über sein Thema?" }),
  a("Eine Schülerin meint nach dem Lesen: „Leihläden sind überflüssig – wer etwas braucht, kauft es heute sowieso billig.“ Beurteile diese Aussage mit Hilfe von Text und Tabelle. Zeige, was daran stimmt und was dagegen spricht, und formuliere dein eigenes Urteil.",
    URTEIL_KR("Viele einfache Geräte sind tatsächlich billig, und viele Menschen kaufen lieber, weil Leihen Zeit kostet und sie an Besitz gewöhnt sind (Z. 34–45).", "Das Angebot wird stark genutzt: 600 Ausleihen im Jahr, kaum etwas steht lange im Regal (Z. 27–28) · Leihen spart Geld, Stauraum, Rohstoffe und Abfall (Z. 46–50) · Menschen mit wenig Geld bekommen Zugang zu hochwertigen Geräten (Z. 53–55) · der Leihladen regt dazu an, über Besitz nachzudenken (Z. 61–65)."),
    "Richtig ist, dass viele einfache Geräte heute wenig kosten und dass manche lieber kaufen, weil das Leihen Zeit kostet (vgl. Z. 35–37). Überflüssig sind Leihläden deshalb aber nicht. In Weiherstetten wurde in einem Jahr 600-mal etwas ausgeliehen, das Angebot wird also genutzt. Außerdem spart das Leihen Rohstoffe und verschafft Menschen mit wenig Geld „Zugang zu Dingen, die sie sich sonst nicht leisten könnten“ (Z. 54–55). Ich finde die Aussage daher zu kurz gedacht: Billig kaufen ist bequem, aber Leihen ist für viele Menschen und für die Umwelt die bessere Lösung.",
    ["billig|günstig|preis|lieber kaufen|zeit kostet", "600|genutzt|rohstoff|abfall|wenig geld|zugang|stauraum|platz|nachdenken", "einseitig|trotzdem|dennoch|allerdings|urteil|meiner meinung|halte|finde|kurz gedacht"], { text: "t1", hinweis: "Beurteilen heißt abwägen: erst sagen, was stimmt, dann, was dagegen spricht – und am Schluss ein klares eigenes Urteil." })
];

/* ------------------------------ die vier Fassungen ------------------------------ */
const R8 = {
  kurz: "Sachtext und Textverständnis", scope: "Lesen: Thema und Aufbau, Textstellen mit Zeilen, Aussagen belegen, Schaubild oder Tabelle auswerten, Aussageabsicht", minutes: 45,
  hinweis: "Arbeite allein. Lies zuerst den ganzen Text und sieh dir das Material dazu an. Beides kannst du während der Probe jederzeit wieder aufrufen. Antworte bei offenen Fragen in ganzen Sätzen. Deine Antworten werden laufend gespeichert. Nach der Abgabe kannst du nichts mehr ändern."
};
const M8 = {
  kurz: "Sachtext und Textverständnis", scope: "Lesen: Kernaussage und Aufbau, Aussagen mit Zitaten belegen, Zitat einbauen, Schaubild oder Tabelle auswerten, Absicht bestimmen, Aussage beurteilen", minutes: 45,
  hinweis: "Arbeite allein. Lies zuerst den ganzen Text und das Material dazu; beides bleibt während der Probe abrufbar. Antworte bei offenen Fragen in ganzen Sätzen und belege deine Aussagen mit Zeilenangaben. Deine Antworten werden laufend gespeichert. Nach der Abgabe kannst du nichts mehr ändern."
};
const TITEL = "Sachtext und Textverständnis";
const R_AP = probe(1, "R", "A", { ...R8, title: "Probe 1 (R8): " + TITEL, texte: [REPAIR_R, REPAIR_R_BILD], items: R_A });
const R_BP = probe(1, "R", "B", { ...R8, title: "Probe 1 (R8): " + TITEL + " – Variante B", texte: [DINGE_R, DINGE_R_TABELLE], items: R_B });
const M_AP = probe(1, "M", "A", { ...M8, title: "Probe 1 (M8): " + TITEL, texte: [REPAIR_M, REPAIR_M_BILD], items: M_A });
const M_BP = probe(1, "M", "B", { ...M8, title: "Probe 1 (M8): " + TITEL + " – Variante B", texte: [DINGE_M, DINGE_M_TABELLE], items: M_B });

module.exports = { [R_AP.id]: R_AP, [R_BP.id]: R_BP, [M_AP.id]: M_AP, [M_BP.id]: M_BP };
