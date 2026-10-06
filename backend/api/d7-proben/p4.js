"use strict";

/**
 * Deutsch 7 · Probe 4: Argumentieren (Bausteine eines Arguments erkennen, ein schwaches Argument erkennen und
 * verbessern, Pro und Kontra ordnen, eigene Argumente mit Beispiel schreiben, Stellung nehmen).
 * LehrplanPLUS D7 1.2 (Meinungen nachvollziehbar begründen), 3.2 (sich argumentativ mit altersgemäßen Sachverhalten
 * auseinandersetzen, sprachliche Mittel des Argumentierens; M7: Argumente durch aussagekräftige Beispiele stützen,
 * appellative Texte wie der Leserbrief).
 * R7: 30 Punkte · M7: 34 Punkte · 45 Minuten. Alle Texte eigenständig für GRUMI erstellt.
 *
 * Streitfragen:
 *   R7 A Hausaufgaben abschaffen? · R7 B Spieleverleih in der großen Pause? ·
 *   M7 A Einheitliche Schul-T-Shirts? · M7 B Pausenverkauf nur noch mit gesunden Sachen?
 * Kein Text, kein Name und kein Beispielsatz steht in einem Lernmodul oder in einer anderen Probe. Verwandt sind nur
 * zwei Themen zum freien Schreiben im Argumentations-Führerschein (Lernmodul 1): „Hausaufgaben am Wochenende“ und
 * „Schuluniform“ – dort gibt es keine vorgegebenen Argumente, die Probe übernimmt nichts daraus.
 * Material: je Fassung drei erfundene Stimmen aus einer erfundenen Schülerzeitung – ein vollständiges Argument, ein
 * schwaches (bloße Behauptung und Abwertung) und ein Argument der Gegenseite.
 * Aufbau R7 (30): Ankreuzen 1 · offen 3 · Zuordnen 3 · Zuordnen 3 · Lücken 3 · offen 2 · offen 4 · Stellungnahme 11.
 * Aufbau M7 (34): offen 4 · Zuordnen 5 · Zuordnen 3 · offen 4 · offen 4 · Ankreuzen 1 · Leserbrief 13.
 * Reihenfolge: Die Frage nach der schwachen Stimme steht vor der Zuordnung der Bausteine, und keine Aufgabenstellung
 * nennt eine Stimme „vollständig“ oder „überzeugend“ – so steht die schwache Stimme nicht schon in einer Aufgabe.
 * (Wer alle Aufgaben vorab liest, kann sie trotzdem eingrenzen: Die anderen beiden Stimmen kommen später vor.)
 *
 * Begriffe: R7 arbeitet mit Behauptung – Begründung – Beispiel (wie die Lernmodule). M7 arbeitet mit These – Argument –
 * Begründung – Beispiel/Beleg – Schlussfolgerung; die Zuordnung erklärt diese Begriffe kurz in Klammern, weil die
 * Lernmodule nur die drei Grundbausteine verwenden.
 * R7 schreibt eine kurze Stellungnahme, M7 einen Leserbrief. Unterschrieben wird der Leserbrief nicht mit dem eigenen
 * Namen (auf dem Server stehen keine Namen der Kinder).
 * Die offenen Aufgaben werden von der KI ohne die Antworten der anderen Aufgaben korrigiert: Wo eine Aufgabe auf eine
 * andere aufbaut, nennt das Kind deshalb den Namen der Stimme noch einmal selbst.
 * Bleibt auf dem Server (Lösungen). Bausteine: bau.js.
 */
const { c, m, f, feld, a, kr, s, text, probe } = require("./bau");

/* ------------------------------ Texte ------------------------------ */
// R7, Variante A: Malik = vollständiges Argument (dafür) · Frieda = Gegenseite · Tomasz = schwach
const HAUSAUFGABEN = text("t1", "Hausaufgaben abschaffen?", "Stimmen aus der Schülerzeitung", [
  "Die Schülerzeitung „Pausenblick“ wollte in dieser Woche von ihren Leserinnen und Lesern wissen: Sollen Hausaufgaben abgeschafft werden? Hier sind drei Antworten aus den 7. Klassen.",
  "Malik: „Ich finde, dass Hausaufgaben abgeschafft werden sollen. Nach einem langen Schultag bleibt sonst kaum noch freie Zeit. Am Dienstag komme ich erst um vier Uhr heim, mache eine Stunde Hausaufgaben und muss dann gleich zum Training.“",
  "Frieda: „Ich bin gegen die Abschaffung. Wer zu Hause übt, merkt schnell, was er noch nicht verstanden hat, und kann am nächsten Tag nachfragen. Bei den Gleichungen ist mir erst bei der Hausaufgabe aufgefallen, dass ich einen Rechenschritt nicht konnte. Sonst hätte ich das erst in der Probe gemerkt.“",
  "Tomasz: „Hausaufgaben sind einfach nur nervig, das weiß doch jeder. Darüber muss man gar nicht lange reden. Nur Streber wollen so etwas behalten. Also weg damit!“"
]);

// R7, Variante B: Zeynep = Gegenseite · Bastian = schwach · Ioana = vollständiges Argument (dafür)
const SPIELE = text("t1", "Ein Spieleverleih für die Pause?", "Stimmen aus der Schülerzeitung", [
  "Die SMV schlägt vor, in der großen Pause einen Spieleverleih zu eröffnen. Dort könnte man sich Bälle, Springseile oder Kartenspiele ausleihen und nach der Pause wieder zurückbringen. Das „Schulhof-Echo“ hat drei Meinungen aus den 7. Klassen gesammelt.",
  "Zeynep: „Ich bin gegen den Verleih. Ausgeliehene Sachen gehen schnell kaputt oder verschwinden, und dann muss ständig Neues gekauft werden. An meiner Grundschule waren nach zwei Monaten fast alle Springseile weg.“",
  "Bastian: „Ein Spieleverleih ist doch Babykram, das ist halt so. Wer in der siebten Klasse noch Spielzeug braucht, gehört zurück in den Kindergarten.“",
  "Ioana: „Meiner Meinung nach brauchen wir den Spieleverleih. Bisher stehen in der Pause viele nur herum und langweilen sich. Als unsere Sportlehrerin einmal zwei Bälle mitbrachte, spielte nach fünf Minuten die halbe Klasse mit.“"
]);

// M7, Variante A: Dilara = vollständiges Argument in fünf Schritten (dafür) · Korbinian = schwach · Amira = Gegenseite
const TSHIRT = text("t1", "Ein T-Shirt für alle?", "Stimmen aus der Schülerzeitung", [
  "Die SMV schlägt vor, dass an unserer Schule alle im Unterricht ein einheitliches Schul-T-Shirt tragen. Die Schülerzeitung „Klartext“ hat dazu Stimmen aus der 7. Jahrgangsstufe gesammelt.",
  "Dilara: „Ich bin dafür, dass wir ein Schul-T-Shirt einführen. Einheitliche Kleidung verringert den Druck, ständig teure Marken tragen zu müssen. Wenn alle das Gleiche anhaben, sieht nämlich niemand mehr, wie viel Geld eine Familie für Kleidung ausgeben kann. In meiner früheren Klasse wurde ein Junge wochenlang wegen seiner alten Pullover ausgelacht. Deshalb würde ein gemeinsames T-Shirt bei uns für mehr Fairness sorgen.“",
  "Korbinian: „So ein Einheits-T-Shirt ist doch total peinlich, das ist einfach so. Wer das gut findet, hat keine Ahnung von Mode und will sich nur bei den Lehrern beliebt machen.“",
  "Amira: „Ich lehne den Vorschlag ab. Mit meiner Kleidung zeige ich, wer ich bin und was mir gefällt. Müssten alle dasselbe tragen, ginge ein Stück Persönlichkeit verloren. Außerdem kostet das T-Shirt die Familien zusätzlich Geld, denn man braucht mehrere zum Wechseln.“"
]);

// M7, Variante B: Marlene = Gegenseite · Enes = vollständiges Argument in fünf Schritten (dagegen) · Vito = schwach
const PAUSENVERKAUF = text("t1", "Nur noch Gesundes am Pausenverkauf?", "Stimmen aus der Schülerzeitung", [
  "Der Elternbeirat möchte, dass der Pausenverkauf nur noch gesunde Sachen anbietet: keine Schokoriegel, keine Chips, keine Limonade. Das „Schulhausblatt“ hat nachgefragt, was Schülerinnen und Schüler der 7. Jahrgangsstufe davon halten.",
  "Marlene: „Ich finde den Vorschlag gut. Wer in der Pause nur Süßes isst, hat kurz darauf wieder Hunger und kann sich schlechter konzentrieren. Ein belegtes Vollkornbrot hält dagegen lange satt.“",
  "Enes: „Ich halte nichts davon, am Pausenverkauf alles Süße zu streichen. Ein solches Verbot ändert kaum etwas daran, was wir essen. Wer Lust auf Schokolade hat, bringt sie dann nämlich einfach von zu Hause mit oder kauft sie vor dem Unterricht. Seit es an der Schule meines Cousins keine Schokoriegel mehr gibt, stehen dort viele morgens beim Bäcker gegenüber an. Darum sollte der Pausenverkauf Gesundes zusätzlich anbieten, aber nichts verbieten.“",
  "Vito: „Natürlich soll es nur noch Gesundes geben, das ist doch sonnenklar. Mehr gibt es dazu nicht zu sagen. Wer trotzdem Süßkram will, hat einfach nichts im Kopf.“"
]);

/* ------------------------------ Schreibhilfen ------------------------------ */
// Lücke im Satz: Es zählt das Wort allein – oder der ganze Satz mit dem Wort.
const luecke = (satz, ...woerter) => feld(satz, woerter.concat(woerter.map((w) => satz.replace("___", w))));
const WEIL = ["weil", "da"], DENN = ["denn"], DESHALB = ["deshalb", "deswegen", "darum", "daher"];

// Bausteine eines Arguments (rechte Seite der Zuordnung)
const BEH = "Behauptung (Meinung)", BEG = "Begründung", BSP = "Beispiel";
const THESE = "These (Standpunkt)", ARG = "Argument (Grund für die These)", ERKL = "Begründung (erklärt das Argument genauer)", BELEG = "Beispiel oder Beleg", FOLGE = "Schlussfolgerung";

/* ------------------------------ Aufgabenstellungen ------------------------------ */
const SCHWAECHSTE = "Lies die drei Stimmen aus der Schülerzeitung genau. Welche ist das schwächste Argument?";
const SCHWACH_R = "Du hast in Aufgabe 1 das schwächste Argument angekreuzt. Schreibe den Namen auf und nenne zwei Schwächen dieses Arguments. Mache dann einen Vorschlag, wie man es besser schreiben könnte.";
const bausteine = (name, wessen, zahl) => "Lies noch einmal, was " + name + " schreibt. Ordne jedem " + wessen + " " + zahl + " Sätze den passenden Baustein eines Arguments zu.";
const einwand = (wofuer) => " Stell dir vor, du diskutierst mit ihr und bist " + wofuer + ". Entkräfte ihren Einwand in zwei bis drei Sätzen: Geh zuerst auf ihn ein und nenne dann ein Gegenargument mit Begründung. Bleib sachlich. Du musst dafür nicht selbst dieser Meinung sein.";
const SCHWACH_M = "Eine der drei Stimmen ist kein überzeugendes Argument. Nenne den Namen und erkläre zwei Schwächen dieser Äußerung. Formuliere sie dann so um, dass sie überzeugt. Die Meinung der Person soll dabei gleich bleiben.";
const ZUORDNEN = " Ordne zu: Spricht die Aussage dafür (Pro) oder dagegen (Kontra)?";
const LUECKEN = "Setze in jede Lücke das passende Verknüpfungswort ein: denn, deshalb oder weil. Jedes Wort passt genau einmal. Schreibe nur das fehlende Wort in das Feld.";
const SACHLICH = "In einer Diskussion soll man sachlich bleiben. Welche Formulierung ist sachlich?";

/* ------------------------------ Hilfen (R7) ------------------------------ */
const HILFE_SCHWACH = "So kannst du schreiben: Das Argument von … ist schwach. Erstens … Zweitens … Besser wäre: …";
const HILFE_BEISPIEL = "So kannst du beginnen: Zum Beispiel …";
const HILFE_ARGUMENT = "So kannst du schreiben: Ich bin der Meinung, dass …, weil … Zum Beispiel …";
const HILFE_STELLUNG = "Satzanfänge: Ich bin der Meinung, dass … · Ein wichtiger Grund ist, dass … · Außerdem … · Zum Beispiel … · Deshalb finde ich, dass …";

/* ------------------------------ „Dein nächster Schritt“ ------------------------------ */
const H_BAUSTEINE_R = "Frage bei jedem Satz: Sagt er, was jemand will? Nennt er einen Grund dafür? Oder schildert er einen einzelnen Fall?";
const H_BAUSTEINE_M = "Überlege bei jedem Satz, welche Aufgabe er hat: den Standpunkt nennen, einen Grund nennen, den Grund genauer erklären, einen einzelnen Fall schildern oder ein Ergebnis ziehen.";
const H_SCHWAECHSTE = "Prüfe jede Stimme mit drei Fragen: Gibt es einen Grund? Gibt es ein Beispiel? Bleibt sie sachlich?";
const H_PRO_KONTRA = "Stell dir bei jeder Aussage vor, wer sie in der Diskussion sagt: jemand, der dafür ist, oder jemand, der dagegen ist?";
const H_LUECKEN = "Schau, wo das gebeugte Verb steht: nach „weil“ ganz am Ende, nach „denn“ hinter dem Subjekt, nach „deshalb“ direkt dahinter.";
const H_SACHLICH = "Sachlich ist eine Aussage, die einen Grund nennt und niemanden angreift. Prüfe jede Antwort mit diesen zwei Fragen.";

/* ------------------------------ Erwartungshorizonte, die in A und B gleich aufgebaut sind ------------------------------ */
const BEIDE = "Beide Meinungen sind gleich viel wert.";
const RICHTIG = kr("Sprachrichtigkeit", 1, "Rechtschreibung, Grammatik und Zeichensetzung. 1 Punkt: Der Text ist trotz einzelner Fehler gut lesbar. 0 Punkte: sehr viele Fehler, die das Lesen erschweren.", { rs: true });

// R7: Beispiel zu einer vorgegebenen Begründung (2 Punkte)
const beispielR = (zeigt, fall) => [
  kr("Beispiel passt zur Begründung", 1, "Das Beispiel zeigt, dass " + zeigt + " – nicht irgendein Beispiel zum Thema."),
  kr("konkret und anschaulich", 1, "Ein bestimmter Fall (" + fall + "), nicht nur die Begründung mit anderen Worten wiederholt.")
];
// R7: eigenes vollständiges Argument (4 Punkte)
const argumentR = (worum, dafuer, dagegen, stimmen) => [
  kr("Behauptung", 1, "Ein Satz sagt eindeutig, ob das Kind für oder gegen " + worum + " ist. " + BEIDE),
  kr("Begründung", 2, "2 Punkte: ein sachlicher, nachvollziehbarer Grund, der zur Behauptung passt. 1 Punkt: Der Grund ist nur angedeutet oder sehr allgemein („weil es besser ist“). 0 Punkte: kein Grund oder ganze Sätze von " + stimmen + " abgeschrieben. Der Grund darf aus Aufgabe 4 stammen, wenn er in einen eigenen Satz eingebaut ist. Mögliche Gründe für " + worum + ": " + dafuer + ". Mögliche Gründe gegen " + worum + ": " + dagegen + "."),
  kr("Beispiel", 1, "Ein konkretes Beispiel, das die Begründung anschaulich macht (ein Erlebnis, ein bestimmter Tag, eine Beobachtung an der Schule).")
];
// R7: kurze Stellungnahme (11 Punkte)
const stellungnahmeR = (worum, dafuer, dagegen, behauptung) => [
  kr("Eigene Meinung", 2, "2 Punkte: Am Anfang steht klar, ob das Kind für oder gegen " + worum + " ist, und der Text bleibt bei dieser Meinung. 1 Punkt: Die Meinung ist nur ungefähr erkennbar, kommt erst am Ende oder wechselt. " + BEIDE),
  kr("Zwei Argumente mit Begründung", 4, "Je Argument 2 Punkte: genannt (1) und nachvollziehbar begründet (1). Mögliche Argumente für " + worum + ": " + dafuer + ". Mögliche Argumente gegen " + worum + ": " + dagegen + ". Nicht gewertet werden bloße Behauptungen (" + behauptung + "), Beleidigungen und Sätze, die wörtlich aus dem Text abgeschrieben sind. Gedanken aus den Aufgaben davor dürfen in eigenen Worten vorkommen."),
  kr("Beispiel", 2, "2 Punkte: mindestens ein konkretes Beispiel (ein Erlebnis, ein bestimmter Tag, eine Beobachtung), das zu einem der Argumente passt. 1 Punkt: Das Beispiel bleibt allgemein oder passt nur ungefähr."),
  kr("Aufbau", 2, "Je 1 Punkt: Einleitungssatz und Schlusssatz sind vorhanden · die Sätze sind verknüpft (z. B. weil, denn, deshalb, außerdem, zum Beispiel) und stehen in einer sinnvollen Reihenfolge."),
  RICHTIG
];

// M7: schwache Äußerung erkennen, erklären, umformulieren (4 Punkte)
const schwachM = (name, schwaechen, besser) => [
  kr("schwache Äußerung erkannt", 1, name + "."),
  kr("zwei Schwächen erklärt", 2, "Je 1 Punkt (höchstens 2): " + schwaechen + " · ein Beispiel oder Beleg fehlt. Wurde eine andere Stimme genannt: 0 Punkte."),
  kr("überzeugend umformuliert", 1, besser)
];
// M7: Einwand entkräften (4 Punkte)
const einwandM = (eingehen, gegenargumente) => [
  kr("geht auf den Einwand ein", 1, "Der Einwand wird aufgegriffen und ernst genommen, z. B. „" + eingehen + "“ oder „Ich verstehe den Einwand, doch …“."),
  kr("Gegenargument mit Begründung", 2, "2 Punkte: ein passendes Gegenargument oder eine Lösung, nachvollziehbar begründet. 1 Punkt: Das Gegenargument wird nur genannt oder bleibt ungenau. Möglich sind zum Beispiel: " + gegenargumente + "."),
  kr("sachlicher Ton", 1, "Höflich und ohne Abwertung der anderen Person („Das ist doch Quatsch“ = 0 Punkte).")
];
// M7: eigenes Argument in vier Schritten (4 Punkte)
const argumentM = (worum, dafuer, dagegen, ausDemText) => [
  kr("Argument", 1, "Es ist klar, ob das Kind für oder gegen " + worum + " ist, und das Argument stützt diese Meinung. " + BEIDE + " Mögliche Argumente für " + worum + ": " + dafuer + ". Mögliche Argumente gegen " + worum + ": " + dagegen + ". Kein Punkt für ein Argument, das nur aus dem Text übernommen ist (" + ausDemText + "); ein Gedanke aus Aufgabe 3 ist erlaubt."),
  kr("Begründung", 1, "Das Argument wird genauer erklärt (z. B. mit weil, denn, nämlich) und nicht nur behauptet."),
  kr("Beispiel oder Beleg", 1, "Ein konkreter Fall, eine eigene Erfahrung oder eine Beobachtung, die genau zu diesem Argument passt."),
  kr("Schlussfolgerung", 1, "Ein abschließender Satz zieht die Folgerung aus dem Argument (z. B. mit deshalb, darum, also).")
];
// M7: Leserbrief (13 Punkte)
const leserbriefM = (worum, dafuer, dagegen) => [
  kr("These", 2, "2 Punkte: Der eigene Standpunkt (für oder gegen " + worum + ") steht klar am Anfang und wird bis zum Schluss durchgehalten. 1 Punkt: Der Standpunkt ist erkennbar, bleibt aber ungenau, kommt erst am Ende oder wechselt. Beide Standpunkte sind gleich viel wert."),
  kr("Argumente mit Begründung", 4, "Zwei Argumente, je 2 Punkte: klar genannt (1) und nachvollziehbar begründet (1). Mögliche Argumente für " + worum + ": " + dafuer + ". Mögliche Argumente gegen " + worum + ": " + dagegen + ". Nicht gewertet werden bloße Behauptungen, Abwertungen und Sätze, die wörtlich aus dem Text abgeschrieben sind. Gedanken aus dem Text und den Aufgaben davor dürfen in eigenen Worten vorkommen."),
  kr("Beispiele oder Belege", 2, "Je 1 Punkt für ein konkretes Beispiel oder einen Beleg (eigene Erfahrung, Beobachtung, Zahl), das genau zu einem der Argumente passt – höchstens 2. Ein einziges, aber ausführliches und treffendes Beispiel kann 2 Punkte bekommen."),
  kr("Gegenargument", 2, "1 Punkt: Ein Argument der anderen Seite wird ausdrücklich aufgegriffen. 1 Punkt: Es wird sachlich entkräftet (mit einer Lösung oder einem stärkeren eigenen Argument)."),
  kr("Aufbau und Form", 2, "Je 1 Punkt: Form eines Leserbriefs – Anrede, Bezug auf die Streitfrage oder den Vorschlag, Gruß mit der vorgegebenen Unterschrift · roter Faden – die Gedanken sind verknüpft (z. B. weil, denn, außerdem, zwar … aber, deshalb), und der Brief endet mit einer Schlussfolgerung oder einer Aufforderung."),
  RICHTIG
];
const UNTERSCHRIFT = " Beginne mit einer Anrede und unterschreibe mit „Eine Schülerin der 7. Klasse“ oder „Ein Schüler der 7. Klasse“ – nicht mit deinem Namen. Gedanken aus den Aufgaben davor darfst du verwenden, Sätze aus dem Text aber nicht abschreiben.";
const LESERBRIEF = " Schreibe einen Leserbrief, in dem du Stellung nimmst (mindestens 100 Wörter). Nenne deine These, stütze sie mit zwei Argumenten samt Begründung und Beispiel oder Beleg, greife ein Gegenargument auf und entkräfte es. Schließe mit einer Schlussfolgerung." + UNTERSCHRIFT;
const STELLUNGNAHME = " Schreibe für die Schülerzeitung eine kurze Stellungnahme (mindestens 60 Wörter). Sage deutlich, ob du dafür oder dagegen bist. Nenne zwei Argumente mit Begründung und mindestens ein Beispiel. Beginne mit einem Einleitungssatz und ende mit einem Schlusssatz. Dein Argument aus Aufgabe 7 darfst du wieder verwenden; schreibe aber keine Sätze aus dem Text ab.";

/* ============================== R7, Variante A – Hausaufgaben abschaffen? ============================== */
const R_A_DAFUER = "mehr Zeit für Erholung, Hobbys und Familie · nicht alle haben zu Hause Hilfe oder Ruhe zum Lernen";
const R_A_DAGEGEN = "durch Üben wird man sicherer · man lernt, selbstständig zu arbeiten und sich die Zeit einzuteilen";
const R_A = [
  c(SCHWAECHSTE, ["die Stimme von Tomasz", "die Stimme von Malik", "die Stimme von Frieda"], 0, { text: "t1", hinweis: H_SCHWAECHSTE }),
  a(SCHWACH_R, [
    kr("zwei Schwächen genannt", 2, "Gemeint ist Tomasz. Je 1 Punkt für eine zutreffende Schwäche (höchstens 2): Er nennt keinen Grund, sondern behauptet nur („einfach nur nervig“, „das weiß doch jeder“) · er beleidigt alle, die anderer Meinung sind („Streber“), und bleibt nicht sachlich · ein Beispiel fehlt. Geht es in der Antwort um Malik oder Frieda: 0 Punkte."),
    kr("Vorschlag zur Verbesserung", 1, "Ein brauchbarer Vorschlag: einen Grund und ein Beispiel ergänzen, sachlich bleiben – oder ein besserer Satz, z. B. „Hausaufgaben sollen abgeschafft werden, weil viele nach der Schule zu müde zum Lernen sind.“")
  ], "Das Argument von Tomasz ist schwach. Erstens nennt er keinen Grund, er sagt nur, dass Hausaufgaben nerven. Zweitens beleidigt er andere als Streber. Besser wäre: Hausaufgaben sollen abgeschafft werden, weil viele nach der Schule zu müde zum Lernen sind.",
  ["tomasz", "grund|gründ|behaupt|beweis", "streber|beleidig|unsachlich|gemein|unhöflich|beschimpf", "weil|denn|beispiel"], { text: "t1", hilfe: HILFE_SCHWACH }),
  m(bausteine("Malik", "seiner", "drei"), [
    ["„Am Dienstag komme ich erst um vier Uhr heim, mache eine Stunde Hausaufgaben und muss dann gleich zum Training.“", BSP],
    ["„Ich finde, dass Hausaufgaben abgeschafft werden sollen.“", BEH],
    ["„Nach einem langen Schultag bleibt sonst kaum noch freie Zeit.“", BEG]], { text: "t1", hinweis: H_BAUSTEINE_R }),
  m("Sollen Hausaufgaben abgeschafft werden?" + ZUORDNEN, [
    ["Viele schreiben die Lösungen morgens schnell von anderen ab und lernen dabei nichts.", "Pro – Hausaufgaben abschaffen"],
    ["An den Hausaufgaben sieht die Lehrkraft, wer noch Hilfe braucht.", "Kontra – Hausaufgaben behalten"],
    ["Wer Hausaufgaben allein erledigt, lernt, selbstständig zu arbeiten.", "Kontra – Hausaufgaben behalten"],
    ["Hausaufgaben sind ungerecht: Nicht jedes Kind hat zu Hause jemanden, der helfen kann.", "Pro – Hausaufgaben abschaffen"],
    ["Wegen der Hausaufgaben gibt es in vielen Familien am Nachmittag Streit.", "Pro – Hausaufgaben abschaffen"],
    ["Ohne Hausaufgaben müsste im Unterricht mehr wiederholt werden, und für neue Themen bliebe weniger Zeit.", "Kontra – Hausaufgaben behalten"]], { points: 3, hinweis: H_PRO_KONTRA }),
  f(LUECKEN, [
    luecke("Hausaufgaben sollen bleiben, ___ man nur durch Üben sicher wird.", ...WEIL),
    luecke("Ich bin für die Abschaffung, ___ viele sind nach dem Unterricht einfach zu müde.", ...DENN),
    luecke("In der Ganztagsklasse üben alle schon in der Schule. ___ brauchen sie zu Hause keine Aufgaben mehr.", ...DESHALB)
  ], { hinweis: H_LUECKEN }),
  a("Ronja schreibt: „Ich möchte die Hausaufgaben behalten. Mit ihnen bereitet man sich nämlich gut auf Proben vor.“ Ein Beispiel fehlt noch. Schreibe ein passendes Beispiel zu Ronjas Begründung.",
    beispielR("Hausaufgaben bei der Vorbereitung auf eine Probe helfen", "ein Fach, eine bestimmte Probe, ein Erlebnis"),
    "Zum Beispiel hatten wir vor der letzten Englisch-Probe jeden Tag ein paar Vokabeln auf. Deshalb konnte ich in der Probe fast alle Wörter.",
    ["letzte|neulich|einmal|als wir|als ich|vor der", "vokabel|mathe|englisch|note|geübt|gelernt|wiederholt|konnte|gewusst"], { hilfe: HILFE_BEISPIEL }),
  a("Sollen Hausaufgaben abgeschafft werden? Schreibe ein eigenes vollständiges Argument mit Behauptung, Begründung und Beispiel. Du darfst dafür oder dagegen sein. Einen Gedanken aus Aufgabe 4 darfst du aufgreifen, aber schreibe nichts aus dem Text ab.",
    argumentR("die Abschaffung der Hausaufgaben", R_A_DAFUER, R_A_DAGEGEN, "Malik oder Frieda"),
    "Ich bin der Meinung, dass Hausaufgaben bleiben sollen, weil man dabei lernt, sich die Arbeit selbst einzuteilen. Zum Beispiel überlege ich mir am Montag, an welchem Nachmittag ich welche Aufgabe erledige.",
    ["zeit|müde|freizeit|hobby|lern|geübt|übung|selbstständig|helfen|stress|wiederhol|abschreib|streit|einteil", "einmal|letzte|neulich|als ich|als wir|gestern|jeden tag|am montag|am dienstag|am mittwoch|am donnerstag|am freitag|in mathe|in englisch"], { text: "t1", hilfe: HILFE_ARGUMENT }),
  s("Sollen Hausaufgaben abgeschafft werden?" + STELLUNGNAHME,
    stellungnahmeR("die Abschaffung der Hausaufgaben", R_A_DAFUER, R_A_DAGEGEN, "„Hausaufgaben nerven“"),
    { minWoerter: 60, text: "t1", hilfe: HILFE_STELLUNG })
];

/* ============================== R7, Variante B – Spieleverleih in der großen Pause? ============================== */
const R_B_DAFUER = "mehr Bewegung und weniger Langeweile in der Pause · auch Kinder ohne eigene Spielsachen können mitspielen";
const R_B_DAGEGEN = "Spiele gehen kaputt oder verschwinden und kosten Geld · jemand muss die Ausgabe betreuen, und die Pause ist kurz";
const R_B = [
  c(SCHWAECHSTE, ["die Stimme von Bastian", "die Stimme von Zeynep", "die Stimme von Ioana"], 0, { text: "t1", hinweis: H_SCHWAECHSTE }),
  a(SCHWACH_R, [
    kr("zwei Schwächen genannt", 2, "Gemeint ist Bastian. Je 1 Punkt für eine zutreffende Schwäche (höchstens 2): Er nennt keinen Grund, sondern behauptet nur („Babykram“, „das ist halt so“) · er macht sich über alle lustig, die anderer Meinung sind („gehört zurück in den Kindergarten“), und bleibt nicht sachlich · ein Beispiel fehlt. Geht es in der Antwort um Zeynep oder Ioana: 0 Punkte."),
    kr("Vorschlag zur Verbesserung", 1, "Ein brauchbarer Vorschlag: einen Grund und ein Beispiel ergänzen, sachlich bleiben – oder ein besserer Satz, z. B. „Ich bin gegen den Spieleverleih, weil in der kurzen Pause kaum Zeit zum Ausleihen bleibt.“")
  ], "Das Argument von Bastian ist schwach. Erstens gibt er keinen Grund an, er sagt nur „das ist halt so“. Zweitens macht er sich über andere lustig und schickt sie in den Kindergarten. Besser wäre: Ich bin gegen den Spieleverleih, weil in der kurzen Pause kaum Zeit zum Ausleihen bleibt.",
  ["bastian", "grund|gründ|behaupt|beweis", "kindergarten|babykram|beleidig|unsachlich|gemein|unhöflich|lustig", "weil|denn|beispiel"], { text: "t1", hilfe: HILFE_SCHWACH }),
  m(bausteine("Ioana", "ihrer", "drei"), [
    ["„Bisher stehen in der Pause viele nur herum und langweilen sich.“", BEG],
    ["„Als unsere Sportlehrerin einmal zwei Bälle mitbrachte, spielte nach fünf Minuten die halbe Klasse mit.“", BSP],
    ["„Meiner Meinung nach brauchen wir den Spieleverleih.“", BEH]], { text: "t1", hinweis: H_BAUSTEINE_R }),
  m("Soll es in der großen Pause einen Spieleverleih geben?" + ZUORDNEN, [
    ["Jemand muss die Ausgabe in jeder Pause betreuen und hat dann selbst keine Pause.", "Kontra – gegen den Spieleverleih"],
    ["Dann können auch Kinder mitspielen, die zu Hause keinen eigenen Ball oder Federballschläger haben.", "Pro – für den Spieleverleih"],
    ["Beim gemeinsamen Spielen lernt man Kinder aus anderen Klassen kennen.", "Pro – für den Spieleverleih"],
    ["Auf dem engen Hof könnten herumfliegende Bälle andere treffen.", "Kontra – gegen den Spieleverleih"],
    ["Um die beliebtesten Spiele gäbe es schnell Streit: Sie reichen nicht für alle.", "Kontra – gegen den Spieleverleih"],
    ["Wer in der Pause etwas zu tun hat, kommt seltener auf dumme Ideen.", "Pro – für den Spieleverleih"]], { points: 3, hinweis: H_PRO_KONTRA }),
  f(LUECKEN, [
    luecke("Ich bin für den Verleih, ___ viele Familien würden alte Spiele spenden.", ...DENN),
    luecke("Die große Pause dauert nur zwanzig Minuten. ___ bleibt nach dem Anstehen kaum Zeit zum Spielen.", ...DESHALB),
    luecke("Der Verleih ist eine gute Idee, ___ man dabei Verantwortung lernt.", ...WEIL)
  ], { hinweis: H_LUECKEN }),
  a("Henrik schreibt: „Ich wünsche mir den Spieleverleih. Bewegung in der Pause macht nämlich wach.“ Ein Beispiel fehlt noch. Schreibe ein passendes Beispiel zu Henriks Begründung.",
    beispielR("man nach Bewegung in der Pause wacher oder aufmerksamer ist", "ein Spiel, eine bestimmte Stunde, ein Erlebnis"),
    "Zum Beispiel habe ich letzte Woche in der Pause Fußball gespielt. In der Mathestunde danach war ich viel munterer als sonst und konnte gut aufpassen.",
    ["letzte|neulich|einmal|als wir|als ich|nach der", "fußball|seil|mathe|stunde|unterricht|aufpassen|konzentrier|munter|fit"], { hilfe: HILFE_BEISPIEL }),
  a("Soll es in der großen Pause einen Spieleverleih geben? Schreibe ein eigenes vollständiges Argument mit Behauptung, Begründung und Beispiel. Du darfst dafür oder dagegen sein. Einen Gedanken aus Aufgabe 4 darfst du aufgreifen, aber schreibe nichts aus dem Text ab.",
    argumentR("den Spieleverleih", R_B_DAFUER, R_B_DAGEGEN, "Zeynep oder Ioana"),
    "Ich bin der Meinung, dass wir keinen Spieleverleih brauchen, weil es um die besten Spiele nur Ärger gibt. Zum Beispiel wollen bei uns immer alle den einen neuen Ball haben, und am Ende streiten sich zwei Gruppen darum.",
    ["beweg|langweil|spaß|kaputt|verschw|geld|kosten|platz|streit|ärger|betreu|verantwort|mitspiel|kennenlern|ausleih", "einmal|letzte|neulich|als ich|als wir|gestern|jeden tag|bei uns|in meiner|an meiner|in unserer|an unserer"], { text: "t1", hilfe: HILFE_ARGUMENT }),
  s("Soll es in der großen Pause einen Spieleverleih geben?" + STELLUNGNAHME,
    stellungnahmeR("den Spieleverleih", R_B_DAFUER, R_B_DAGEGEN, "„Spiele sind cool“ oder „Spiele sind peinlich“"),
    { minWoerter: 60, text: "t1", hilfe: HILFE_STELLUNG })
];

/* ============================== M7, Variante A – Einheitliche Schul-T-Shirts für alle? ============================== */
const M_A_DAFUER = "weniger Markendruck und Ausgrenzung · stärkeres Gemeinschaftsgefühl";
const M_A_DAGEGEN = "Kleidung gehört zur Persönlichkeit · zusätzliche Kosten und Aufwand für die Familien";
const M_A = [
  a(SCHWACH_M,
    schwachM("Korbinian", "Er begründet nicht, sondern behauptet nur („total peinlich“, „das ist einfach so“) · er wertet alle ab, die anderer Meinung sind („keine Ahnung von Mode“, „bei den Lehrern beliebt machen“), und bleibt unsachlich",
      "Eine Aussage gegen das Schul-T-Shirt mit nachvollziehbarer Begründung und ohne Abwertung, z. B. „Ich bin gegen das Schul-T-Shirt, weil viele es als Zwang empfinden und es dann nur widerwillig tragen würden.“ Nur Amiras Sätze abzuschreiben, genügt nicht."),
    "Korbinians Äußerung überzeugt nicht. Er behauptet nur, das T-Shirt sei peinlich, und nennt keinen Grund dafür („das ist einfach so“). Außerdem wertet er alle ab, die anderer Meinung sind: Sie hätten „keine Ahnung von Mode“. Besser: Ich bin gegen das Schul-T-Shirt, weil viele es als Zwang empfinden und es dann nur widerwillig tragen würden.",
    ["korbinian", "grund|gründ|behaupt|beweis|beleg", "abwert|wertet|beleidig|ahnung|respektlos|unhöflich|angreif|beliebt|unterstell|lustig", "weil|denn|nämlich"], { text: "t1" }),
  m(bausteine("Dilara", "ihrer", "fünf"), [
    ["„In meiner früheren Klasse wurde ein Junge wochenlang wegen seiner alten Pullover ausgelacht.“", BELEG],
    ["„Ich bin dafür, dass wir ein Schul-T-Shirt einführen.“", THESE],
    ["„Deshalb würde ein gemeinsames T-Shirt bei uns für mehr Fairness sorgen.“", FOLGE],
    ["„Wenn alle das Gleiche anhaben, sieht nämlich niemand mehr, wie viel Geld eine Familie für Kleidung ausgeben kann.“", ERKL],
    ["„Einheitliche Kleidung verringert den Druck, ständig teure Marken tragen zu müssen.“", ARG]], { text: "t1", hinweis: H_BAUSTEINE_M }),
  m("Einheitliche Schul-T-Shirts für alle?" + ZUORDNEN, [
    ["Morgens müsste niemand mehr lange überlegen, was er anziehen soll.", "Pro – für das Schul-T-Shirt"],
    ["Unterschiede fallen trotzdem auf, zum Beispiel an teuren Schuhen, Handys oder Rucksäcken.", "Kontra – gegen das Schul-T-Shirt"],
    ["Bei Ausflügen erkennt man sofort, wer zur eigenen Schule gehört.", "Pro – für das Schul-T-Shirt"],
    ["Weil man die T-Shirts jeden Tag braucht, müssten die Familien ständig waschen.", "Kontra – gegen das Schul-T-Shirt"],
    ["Nicht jeder fühlt sich in demselben Schnitt und derselben Farbe wohl.", "Kontra – gegen das Schul-T-Shirt"],
    ["Ein gemeinsames T-Shirt kann das Gefühl stärken, zusammenzugehören.", "Pro – für das Schul-T-Shirt"]], { points: 3, hinweis: H_PRO_KONTRA }),
  a("Amira wendet ein: „Müssten alle dasselbe tragen, ginge ein Stück Persönlichkeit verloren.“" + einwand("für das Schul-T-Shirt"),
    einwandM("Es stimmt zwar, dass Kleidung etwas über einen Menschen zeigt, aber …",
      "Persönlichkeit zeigt sich auch in Frisur, Schuhen, Schmuck, Hobbys und im Verhalten · das T-Shirt gilt nur im Unterricht, in der Freizeit trägt jeder, was er will · die Klassen könnten Farbe und Aufdruck selbst mitbestimmen"),
    "Es stimmt zwar, dass Kleidung etwas über einen Menschen zeigt. Trotzdem geht die Persönlichkeit nicht verloren, denn man zeigt sie auch durch Frisur, Schuhe, Hobbys und vor allem durch sein Verhalten. Außerdem zieht nach der Schule jeder wieder an, was er möchte.",
    ["zwar|versteh|stimmt|natürlich|richtig", "aber|doch|jedoch|trotzdem|allerdings|dennoch", "frisur|schuh|schmuck|freizeit|verhalten|hobby|nachmittag|mitbestimm|charakter|hose|nach der schule|unterricht"], { text: "t1" }),
  a("Einheitliche Schul-T-Shirts für alle? Formuliere ein eigenes Argument, das im Text noch nicht vorkommt. Du darfst dafür oder dagegen sein. Baue es vollständig auf: Argument – Begründung – Beispiel oder Beleg – Schlussfolgerung. Einen Gedanken aus Aufgabe 3 darfst du aufgreifen.",
    argumentM("das Schul-T-Shirt", "stärkeres Gemeinschaftsgefühl · morgens keine lange Kleiderwahl", "Unterschiede zeigen sich trotzdem an Schuhen und Handys · nicht jeder fühlt sich darin wohl", "Markendruck, Persönlichkeit, Kosten"),
    "Ich bin für das Schul-T-Shirt, weil es den Zusammenhalt stärkt. Wer dasselbe trägt wie die anderen, fühlt sich nämlich als Teil der Schule. Beim letzten Fußballturnier trugen alle aus meiner Klasse das gleiche Trikot, und wir haben uns viel mehr angefeuert als sonst. Deshalb würde ein gemeinsames T-Shirt unserer Schule guttun.",
    ["weil|denn|nämlich", "zum beispiel|beispielsweise|einmal|letzte|neulich|bei uns|in meiner|in unserer", "deshalb|darum|daher|also|deswegen|aus diesem grund"], { text: "t1" }),
  c(SACHLICH, [
    "Ich sehe das anders, weil nicht jedem dieselbe Farbe steht.",
    "Wer gegen das T-Shirt ist, hat einfach nichts verstanden.",
    "Nur Angeber brauchen jeden Tag ein neues Outfit.",
    "So einen Unsinn kann sich nur die SMV ausdenken."], 0, { hinweis: H_SACHLICH }),
  s("Die Schülerzeitung „Klartext“ druckt Leserbriefe zum Vorschlag der SMV ab: Einheitliche Schul-T-Shirts für alle?" + LESERBRIEF,
    leserbriefM("das Schul-T-Shirt", M_A_DAFUER + " · morgens keine lange Kleiderwahl", M_A_DAGEGEN + " · Unterschiede zeigen sich trotzdem (Schuhe, Handys)"),
    { minWoerter: 100, text: "t1" })
];

/* ============================== M7, Variante B – Pausenverkauf nur noch mit gesunden Sachen? ============================== */
const M_B_DAFUER = "wer Gesundes isst, bleibt länger satt und kann sich besser konzentrieren · ohne Süßes im Angebot greifen mehr Kinder zu Obst und Broten";
const M_B_DAGEGEN = "ein Verbot ändert wenig, weil Süßes dann mitgebracht wird · Jugendliche sollen selbst entscheiden lernen";
const M_B = [
  a(SCHWACH_M,
    schwachM("Vito", "Er begründet nicht, sondern behauptet nur („das ist doch sonnenklar“, „mehr gibt es dazu nicht zu sagen“) · er wertet alle ab, die anderer Meinung sind („hat einfach nichts im Kopf“), und bleibt unsachlich",
      "Eine Aussage für den Vorschlag (nur noch Gesundes) mit nachvollziehbarer Begründung und ohne Abwertung, z. B. „Ich bin dafür, dass es nur noch Gesundes gibt, weil viele sonst aus Gewohnheit jeden Tag zu Süßem greifen.“ Nur Marlenes Sätze abzuschreiben, genügt nicht."),
    "Vitos Äußerung überzeugt nicht. Er sagt nur, das sei sonnenklar, und gibt keinen Grund an. Außerdem beleidigt er alle, die gern Süßes essen. Besser: Ich bin dafür, dass es nur noch Gesundes gibt, weil viele sonst aus Gewohnheit jeden Tag zu Süßem greifen.",
    ["vito", "grund|gründ|behaupt|beweis|beleg", "abwert|wertet|beleidig|im kopf|respektlos|unhöflich|angreif|dumm|lustig", "weil|denn|nämlich"], { text: "t1" }),
  m(bausteine("Enes", "seiner", "fünf"), [
    ["„Wer Lust auf Schokolade hat, bringt sie dann nämlich einfach von zu Hause mit oder kauft sie vor dem Unterricht.“", ERKL],
    ["„Darum sollte der Pausenverkauf Gesundes zusätzlich anbieten, aber nichts verbieten.“", FOLGE],
    ["„Ein solches Verbot ändert kaum etwas daran, was wir essen.“", ARG],
    ["„Seit es an der Schule meines Cousins keine Schokoriegel mehr gibt, stehen dort viele morgens beim Bäcker gegenüber an.“", BELEG],
    ["„Ich halte nichts davon, am Pausenverkauf alles Süße zu streichen.“", THESE]], { text: "t1", hinweis: H_BAUSTEINE_M }),
  m("Soll der Pausenverkauf nur noch gesunde Sachen anbieten?" + ZUORDNEN, [
    ["Jugendliche sollen lernen, selbst zu entscheiden, was sie essen.", "Kontra – Angebot wie bisher"],
    ["Solange Schokoriegel in der Auslage liegen, greifen viele zu ihnen statt zum Obst.", "Pro – nur noch Gesundes"],
    ["Belegte Brötchen und Obstbecher kosten meist mehr als ein Schokoriegel.", "Kontra – Angebot wie bisher"],
    ["Zucker in Limonade und Süßigkeiten schadet auf Dauer den Zähnen.", "Pro – nur noch Gesundes"],
    ["Eine Schule sollte nichts verkaufen, wovor sie im Unterricht selbst warnt.", "Pro – nur noch Gesundes"],
    ["Ohne Süßes würde der Pausenverkauf weniger verkaufen und weniger Geld einnehmen.", "Kontra – Angebot wie bisher"]], { points: 3, hinweis: H_PRO_KONTRA }),
  a("Marlene wendet ein: „Wer in der Pause nur Süßes isst, hat kurz darauf wieder Hunger und kann sich schlechter konzentrieren.“" + einwand("gegen den Vorschlag des Elternbeirats"),
    einwandM("Es stimmt zwar, dass man von Süßem allein nicht lange satt wird, aber …",
      "dafür muss man Süßes nicht verbieten – es genügt, wenn es zusätzlich Brote und Obst gibt · es kommt auf die Menge an: ein Riegel zusätzlich zum Pausenbrot schadet der Konzentration nicht · wer nur Süßes essen will, bringt es ohnehin von zu Hause mit · Jugendliche sollen lernen, selbst zu entscheiden"),
    "Es stimmt zwar, dass man von Süßem allein nicht lange satt wird. Trotzdem muss man deshalb nicht alles Süße streichen, denn es reicht, wenn der Pausenverkauf zusätzlich Brote und Obst anbietet. Dann kann jeder selbst etwas kaufen, das satt macht.",
    ["zwar|versteh|stimmt|natürlich|richtig", "aber|doch|jedoch|trotzdem|allerdings|dennoch", "zusätzlich|von zu hause|mitbring|selbst entscheid|menge|verbot|verbiet|obst|brot|auswahl|beides"], { text: "t1" }),
  a("Soll der Pausenverkauf nur noch gesunde Sachen anbieten? Formuliere ein eigenes Argument, das im Text noch nicht vorkommt. Du darfst dafür oder dagegen sein. Baue es vollständig auf: Argument – Begründung – Beispiel oder Beleg – Schlussfolgerung. Einen Gedanken aus Aufgabe 3 darfst du aufgreifen.",
    argumentM("den Vorschlag (nur noch Gesundes)", "Zucker schadet den Zähnen · die Schule soll nichts verkaufen, wovor sie selbst warnt", "Gesundes ist oft teurer · der Pausenverkauf nimmt weniger Geld ein", "satt bleiben und Konzentration, Süßes wird von zu Hause mitgebracht"),
    "Ich bin gegen den Vorschlag, weil gesunde Sachen oft mehr kosten. Für ein belegtes Brötchen braucht man nämlich mehr Taschengeld als für eine Breze oder einen Riegel. Bei uns reicht vielen das Geld schon jetzt nur für eine Kleinigkeit. Deshalb sollte der Pausenverkauf auch weiterhin günstige Sachen anbieten.",
    ["weil|denn|nämlich", "zum beispiel|beispielsweise|einmal|letzte|neulich|bei uns|in meiner|in unserer", "deshalb|darum|daher|also|deswegen|aus diesem grund"], { text: "t1" }),
  c(SACHLICH, [
    "Ich bin anderer Meinung, weil jeder selbst über sein Essen entscheiden sollte.",
    "Typisch Elternbeirat: Hauptsache, uns wird wieder etwas verboten.",
    "Wer freiwillig Karotten kauft, dem ist nicht mehr zu helfen.",
    "Nur Dumme stopfen sich in der Pause mit Zucker voll."], 0, { hinweis: H_SACHLICH }),
  s("Das „Schulhausblatt“ druckt Leserbriefe zum Vorschlag des Elternbeirats ab: Soll der Pausenverkauf nur noch gesunde Sachen anbieten?" + LESERBRIEF,
    leserbriefM("den Vorschlag (nur noch Gesundes)", M_B_DAFUER + " · Zucker schadet den Zähnen", M_B_DAGEGEN + " · Gesundes ist oft teurer"),
    { minWoerter: 100, text: "t1" })
];

const ALLE = { kurz: "Argumentieren", scope: "Argumente erkennen · begründen · Stellung nehmen", minutes: 45 };
module.exports = {
  "d7-p4-r-a": probe(4, "R", "A", { ...ALLE, title: "Probe 4 (R7): Argumentieren", texte: [HAUSAUFGABEN], items: R_A }),
  "d7-p4-r-b": probe(4, "R", "B", { ...ALLE, title: "Probe 4 (R7): Argumentieren – Variante B", texte: [SPIELE], items: R_B }),
  "d7-p4-m-a": probe(4, "M", "A", { ...ALLE, title: "Probe 4 (M7): Argumentieren", texte: [TSHIRT], items: M_A }),
  "d7-p4-m-b": probe(4, "M", "B", { ...ALLE, title: "Probe 4 (M7): Argumentieren – Variante B", texte: [PAUSENVERKAUF], items: M_B })
};
