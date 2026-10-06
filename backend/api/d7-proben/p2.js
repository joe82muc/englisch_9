"use strict";

/**
 * Deutsch 7 · Probe 2: Sachtext I (Informationen finden, Abschnitte verstehen, Kernaussagen, Textbelege mit
 * Zeilenangaben). LehrplanPLUS D7 2.1 (Lesestrategien, Text als Ganzes erfassen), 2.3 (pragmatische Texte: Informationen
 * entnehmen), 3.2 (Ergebnisse einer Textuntersuchung darstellen), M7 zusätzlich: zentrale Aussagen belegen.
 * R7: 30 Punkte · M7: 34 Punkte · etwa 45 Minuten. Alle Texte eigenständig für GRUMI erstellt.
 * Bleibt auf dem Server (Lösungen). Bausteine: bau.js.
 */
const { c, m, f, feld, z, a, kr, text, probe } = require("./bau");

/* ------------------------------ Texte ------------------------------ */
const SCHLAF = text("t1", "Müde am Morgen – warum Jugendliche anders schlafen", "Sachtext", [
  "Der Wecker klingelt um halb sieben, aber Emre kommt kaum aus dem Bett. Am Abend zuvor lag er lange wach, obwohl er pünktlich das Licht ausgemacht hatte. So geht es vielen Jugendlichen. Mit Faulheit hat das wenig zu tun. Schuld ist die innere Uhr.",
  "Jeder Mensch hat eine innere Uhr. Sie sitzt im Gehirn und steuert, wann wir müde werden und wann wir aufwachen. Dabei hilft ein Botenstoff, das Melatonin. Wird es abends dunkel, schüttet der Körper Melatonin aus, und wir werden schläfrig. In der Pubertät verschiebt sich diese Uhr. Das Melatonin kommt dann später am Abend, oft erst nach 22 Uhr. Deshalb werden viele Jugendliche später müde als Kinder oder Erwachsene.",
  "Trotzdem brauchen Jugendliche viel Schlaf. Fachleute empfehlen für Zwölf- bis Vierzehnjährige etwa neun Stunden pro Nacht. Wer erst um 23 Uhr einschläft und um halb sieben aufstehen muss, kommt nur auf siebeneinhalb Stunden. Der fehlende Schlaf hat Folgen: Man kann sich in den ersten Schulstunden schlechter konzentrieren, vergisst Gelerntes schneller und ist häufiger gereizt. Im Schlaf sortiert das Gehirn nämlich, was es am Tag gelernt hat. Auch der Körper erholt sich in der Nacht und kann Krankheiten besser abwehren.",
  "Ein Problem verstärkt die Müdigkeit noch: das Handy. Der Bildschirm strahlt helles, bläuliches Licht ab. Dieses Licht bremst das Melatonin, und der Körper glaubt, es sei noch Tag. Außerdem halten spannende Videos und Nachrichten von Freunden wach. Aus „nur noch fünf Minuten“ wird dann schnell eine ganze Stunde.",
  "Was hilft? Fachleute raten, das Handy eine Stunde vor dem Schlafen wegzulegen und es nachts nicht neben das Bett zu legen. Auch feste Schlafenszeiten helfen der inneren Uhr, selbst am Wochenende. Wer am Samstag bis mittags schläft, verschiebt seine Uhr noch weiter nach hinten. Und am Morgen macht helles Tageslicht wach: Ein Schulweg zu Fuß oder mit dem Rad bringt den Körper deshalb gut in Schwung."
]);

const FAHRRAD = text("t1", "Auf zwei Rädern – wie das Fahrrad erfunden wurde", "Sachtext", [
  "Heute fahren Millionen Menschen jeden Tag mit dem Fahrrad zur Schule oder zur Arbeit. Vor etwas mehr als 200 Jahren gab es noch kein einziges. Wer schnell vorankommen wollte, brauchte ein Pferd – und ein Pferd war teuer. Die meisten Menschen gingen deshalb zu Fuß.",
  "Im Jahr 1817 stellte Karl Drais aus Mannheim eine neue Erfindung vor: die Laufmaschine. Sie bestand fast ganz aus Holz und hatte zwei Räder hintereinander, einen Sattel und eine Lenkstange. Pedale gab es nicht. Der Fahrer saß auf dem Sattel und stieß sich abwechselnd mit den Füßen vom Boden ab. Bei seiner ersten Fahrt schaffte Drais etwa 14 Kilometer in einer Stunde. Damit war er schneller als die Postkutsche.",
  "Warum kam Drais gerade damals auf diese Idee? Manche Forscher vermuten einen Zusammenhang mit dem Wetter. Das Jahr 1816 war ungewöhnlich kalt, die Ernte fiel schlecht aus, und Hafer wurde knapp. Viele Pferde konnten nicht mehr gefüttert werden. Ein Fahrzeug, das kein Futter braucht, kam also genau zur richtigen Zeit.",
  "Die Laufmaschine war aber noch kein Fahrrad, wie wir es kennen. Erst rund fünfzig Jahre später bauten Erfinder in Frankreich Pedale an das Vorderrad. Um schneller zu fahren, machte man dieses Vorderrad immer größer. So entstand das Hochrad. Es war schnell, aber gefährlich: Wer stürzte, fiel aus großer Höhe kopfüber auf die Straße. Trotzdem war es bei jungen Leuten sehr beliebt.",
  "Im Jahr 1885 kam in England das Sicherheitsrad auf den Markt. Es hatte zwei gleich große Räder, und eine Kette übertrug die Kraft von den Pedalen auf das Hinterrad. Wenig später kamen Reifen mit Luft dazu, die das Fahren viel bequemer machten. Jetzt trauten sich auch Menschen auf das Rad, denen das Hochrad zu gefährlich gewesen war. Seitdem hat sich die Grundform des Fahrrads kaum verändert. Neu sind vor allem die Gangschaltung, bessere Bremsen und seit einigen Jahren der Elektromotor."
]);

const LICHT = text("t1", "Wenn die Nacht nicht mehr dunkel wird", "Sachtext", [
  "Wer nachts in einer Großstadt zum Himmel schaut, sieht nur wenige Sterne. Auf dem Land sind es bei klarem Wetter mehrere Tausend. Der Grund dafür ist nicht etwa schlechte Luft, sondern Licht: Straßenlaternen, Schaufenster, Leuchtreklamen und angestrahlte Gebäude hellen den Nachthimmel auf. Fachleute sprechen von Lichtverschmutzung.",
  "Über jeder größeren Stadt liegt nachts eine Lichtglocke. Sie entsteht, weil ein Teil des künstlichen Lichts nach oben abstrahlt und in der Luft an Staub und Wassertröpfchen gestreut wird. Wer in der Dunkelheit auf eine Stadt zufährt, erkennt ihren hellen Schein schon aus vielen Kilometern Entfernung. Messungen zeigen außerdem, dass der Nachthimmel über Europa von Jahr zu Jahr heller wird.",
  "Für viele Tiere ist das ein ernstes Problem. Nachtaktive Insekten orientieren sich am schwachen Licht von Mond und Sternen. Eine helle Lampe bringt sie durcheinander: Sie umkreisen die Lichtquelle, bis sie erschöpft sind, oder werden dort zur leichten Beute für Fledermäuse und Spinnen. An einer einzigen Straßenlaterne können in einer Sommernacht mehr als hundert Insekten verenden. Diese Tiere fehlen dann als Bestäuber von Pflanzen und als Nahrung für Vögel.",
  "Auch Zugvögel leiden unter dem Licht. Viele Arten fliegen nachts und richten sich dabei unter anderem nach den Sternen. Beleuchtete Hochhäuser und Türme lenken sie von ihrem Weg ab. Manche Vögel prallen gegen die Gebäude, andere kreisen stundenlang im Lichtschein und verlieren dabei Kraft, die sie für ihre weite Reise brauchen. Sogar Pflanzen reagieren auf das Kunstlicht: Bäume, die direkt neben einer Laterne stehen, behalten im Herbst ihre Blätter länger als andere.",
  "Der Mensch bleibt ebenfalls nicht verschont. Unser Körper braucht den Wechsel von Hell und Dunkel, um zur Ruhe zu kommen. Dringt nachts viel Licht ins Schlafzimmer, schlafen viele Menschen schlechter. Außerdem geht etwas verloren, das die Menschen seit Jahrtausenden begleitet hat: der Blick in einen Himmel voller Sterne.",
  "Dabei lässt sich Lichtverschmutzung leichter verringern als viele andere Umweltprobleme. Schaltet man eine Lampe aus, ist die Belastung sofort verschwunden. Viele Gemeinden rüsten deshalb ihre Straßenlaternen um. Moderne Leuchten strahlen nur nach unten, verwenden warmes, gelbliches Licht und werden spät in der Nacht gedimmt. Manche gehen erst an, wenn ein Bewegungsmelder jemanden bemerkt. Das schont nicht nur die Tiere, sondern spart auch Strom und Geld. In einigen Gegenden Deutschlands, zum Beispiel in der Rhön, gibt es inzwischen sogenannte Sternenparks. Dort achten die Gemeinden besonders darauf, dass die Nacht dunkel bleibt. Auch zu Hause kann jeder etwas tun: Wer die Gartenbeleuchtung nachts ausschaltet, hält unnötiges Licht zurück."
]);

const WASSER = text("t1", "Der lange Weg zum Wasserhahn", "Sachtext", [
  "Hahn auf, Wasser läuft – für uns ist das selbstverständlich. Jeder Mensch in Deutschland verbraucht am Tag ungefähr 125 Liter Trinkwasser. Nur einen kleinen Teil davon trinken wir tatsächlich. Das meiste fließt beim Duschen, bei der Toilettenspülung und beim Wäschewaschen durch die Leitungen. Kaum jemand macht sich Gedanken darüber, woher dieses Wasser kommt und wer dafür sorgt, dass es sauber ist.",
  "Der größte Teil des Trinkwassers in Deutschland stammt aus dem Grundwasser. Es entsteht, wenn Regen im Boden versickert. Auf dem Weg nach unten dringt das Wasser durch Schichten aus Erde, Sand und Kies. Diese Schichten wirken wie ein Filter: Schmutzteilchen bleiben hängen, und viele Schadstoffe werden von winzigen Lebewesen im Boden abgebaut. Bis ein Regentropfen im Grundwasser ankommt, können Jahre oder sogar Jahrzehnte vergehen.",
  "Wasserwerke pumpen das Grundwasser durch Brunnen nach oben. Oft ist es schon so sauber, dass es kaum behandelt werden muss. Meist wird es belüftet und noch einmal gefiltert, um Eisen und Mangan zu entfernen. Diese Stoffe sind nicht gefährlich, sie würden das Wasser aber braun färben und die Rohre verstopfen. Wo es wenig Grundwasser gibt, nutzen die Wasserwerke Wasser aus Talsperren, Seen oder Flüssen. Dieses Wasser muss aufwendiger gereinigt werden.",
  "Trinkwasser gehört in Deutschland zu den am strengsten kontrollierten Lebensmitteln. Eine Verordnung legt fest, wie viel von welchem Stoff höchstens enthalten sein darf. Die Wasserwerke untersuchen deshalb regelmäßig Proben im Labor. Geprüft wird zum Beispiel, ob Krankheitserreger oder zu viel Nitrat im Wasser sind. Vom Wasserwerk gelangt das Wasser in Hochbehälter oder Wassertürme. Sie stehen an erhöhten Stellen, damit das Wasser mit genügend Druck durch die Leitungen bis in die oberen Stockwerke der Häuser fließt.",
  "So sicher die Versorgung heute ist – für immer garantiert ist sie nicht. In trockenen Sommern sinkt mancherorts der Grundwasserspiegel, weil mehr Wasser entnommen wird, als durch Regen nachkommt. Außerdem gelangen Dünger aus der Landwirtschaft und Reste von Medikamenten in den Boden und damit ins Grundwasser. Sie wieder herauszufiltern, ist teuer. Fachleute fordern deshalb, sparsamer mit Wasser umzugehen und die Böden besser zu schützen.",
  "Jeder kann etwas zum Schutz des Wassers beitragen. Alte Medikamente gehören nicht in die Toilette oder ins Waschbecken; wie man sie richtig entsorgt, erfährt man in der Apotheke. Wer kürzer duscht und den Wasserhahn beim Zähneputzen zudreht, spart Wasser und zugleich die Energie, die zum Erwärmen nötig ist. Übrigens: Leitungswasser kostet nur einen Bruchteil dessen, was Wasser aus der Flasche kostet, und muss nicht mit dem Lastwagen transportiert werden."
]);

/* ------------------------------ Aufgaben ------------------------------ */
const UEBERSCHRIFTEN = "Jeder Abschnitt des Textes hat ein eigenes Thema. Ordne jedem Abschnitt die passende Überschrift zu.";
const ERGAENZE = "Ergänze die Angaben aus dem Text.";
const ZEILE_HILFE = "Suche im Text zuerst das Schlüsselwort aus der Frage. Lies dann den ganzen Satz und notiere seine Zeilen.";

// R7, Variante A – „Müde am Morgen“ (Abschnitte: 1–5 · 6–13 · 14–23 · 24–29 · 30–36)
const R_A = [
  c("Worum geht es in dem Text?", [
    "Warum Jugendliche morgens oft müde sind und was dagegen hilft",
    "Wie man am schnellsten einschläft",
    "Warum Handys in der Schule verboten sind",
    "Wie viele Stunden Erwachsene schlafen sollen"], 0, { text: "t1", hinweis: "Lies Überschrift und ersten Abschnitt: Dort steht meist, worum es im ganzen Text geht." }),
  m(UEBERSCHRIFTEN, [
    ["Abschnitt 1 (Z. 1–5)", "Emre kommt nicht aus dem Bett"],
    ["Abschnitt 2 (Z. 6–13)", "Die innere Uhr verschiebt sich"],
    ["Abschnitt 3 (Z. 14–23)", "Zu wenig Schlaf hat Folgen"],
    ["Abschnitt 4 (Z. 24–29)", "Das Handy hält wach"],
    ["Abschnitt 5 (Z. 30–36)", "Tipps für besseren Schlaf"]], { text: "t1", hinweis: "Lies von jedem Abschnitt den ersten Satz. Er verrät oft schon das Thema." }),
  z("In welchen Zeilen wird erklärt, was der Körper tut, wenn es abends dunkel wird?", "t1", [[8, 9]], { hinweis: ZEILE_HILFE }),
  z("In welchen Zeilen steht, wie viel Schlaf Fachleute für Zwölf- bis Vierzehnjährige empfehlen?", "t1", [[14, 16]], { hinweis: ZEILE_HILFE }),
  f(ERGAENZE, [
    feld("Erst nach dieser Uhrzeit kommt das Melatonin bei Jugendlichen oft:", ["22 Uhr", "22", "nach 22 Uhr", "22:00", "22.00", "22:00 Uhr", "22.00 Uhr", "um 22 Uhr"]),
    feld("So viele Stunden Schlaf empfehlen Fachleute pro Nacht:", ["9", "neun", "9 Stunden", "neun Stunden", "etwa neun Stunden", "etwa 9 Stunden", "etwa neun", "etwa 9", "ca. 9", "ca. 9 Stunden"]),
    feld("So lange vor dem Schlafen soll man das Handy weglegen:", ["eine Stunde", "1 Stunde", "1 h", "eine Stunde vorher", "1 Stunde vorher", "eine", "1", "eine Stunde davor", "1 Stunde davor"])
  ], { text: "t1", hinweis: "Zahlen findest du schnell, wenn du den Text mit den Augen überfliegst und nur auf Ziffern und Zahlwörter achtest." }),
  a("Erkläre mit eigenen Worten, warum viele Jugendliche abends später müde werden als Kinder.", [
    kr("Grund genannt", 2, "In der Pubertät verschiebt sich die innere Uhr: Das Melatonin (der Botenstoff, der müde macht) wird später am Abend ausgeschüttet."),
    kr("verständlich in eigenen Worten erklärt", 1, "Nicht nur Sätze abgeschrieben; der Zusammenhang „Botenstoff kommt später – man wird später müde“ ist erkennbar.")
  ], "In der Pubertät verstellt sich die innere Uhr. Der Körper schüttet das Melatonin, das müde macht, erst später am Abend aus. Deshalb werden Jugendliche später müde.",
  ["innere uhr|uhr", "melatonin|botenstoff", "später|spät"], { text: "t1", zeilen: [6, 13], hilfe: "So kannst du beginnen: In der Pubertät …" }),
  a("Zu wenig Schlaf hat Folgen. Nenne zwei Folgen aus dem Text und gib an, in welchen Zeilen sie stehen.", [
    kr("erste Folge richtig genannt", 1, "z. B. schlechtere Konzentration in den ersten Schulstunden"),
    kr("zweite Folge richtig genannt", 1, "z. B. Gelerntes schneller vergessen, häufiger gereizt (auch: der Körper erholt sich schlechter)"),
    kr("passende Zeilenangabe", 2, "Z. 17–21; 2 Punkte für eine passende Angabe, 1 Punkt, wenn sie nur grob stimmt")
  ], "Man kann sich schlechter konzentrieren und vergisst Gelerntes schneller (Z. 18–20).",
  ["konzentrier", "vergisst|vergessen|gereizt", "z.|zeile"], { text: "t1", zeilen: [14, 23], hilfe: "So kannst du schreiben: Eine Folge ist … Eine weitere Folge ist … (Z. …)." }),
  a("Im Text steht: „Der Körper glaubt, es sei noch Tag“ (Z. 26–27). Erkläre, was damit gemeint ist.", [
    kr("Zusammenhang mit dem Licht des Bildschirms erkannt", 2, "Das helle, bläuliche Licht des Handys wirkt wie Tageslicht und bremst das Melatonin."),
    kr("Folge erklärt", 1, "Man wird nicht müde bzw. schläft später ein.")
  ], "Das helle Licht vom Handy wirkt auf den Körper wie Tageslicht. Er schüttet weniger Melatonin aus, deshalb wird man nicht müde.",
  ["licht|bildschirm|handy", "melatonin|müde|wach"], { text: "t1", zeilen: [24, 29], hilfe: "Lies die Sätze davor noch einmal (Z. 24–26)." }),
  c("Welcher Satz fasst die wichtigste Aussage des ganzen Textes am besten zusammen?", [
    "Jugendliche werden wegen ihrer inneren Uhr später müde, brauchen aber viel Schlaf – einige Gewohnheiten helfen ihnen.",
    "Jugendliche sind morgens müde, weil sie zu faul zum Aufstehen sind.",
    "Das Handy ist der einzige Grund dafür, dass Jugendliche schlecht schlafen.",
    "Die Schule sollte später beginnen, damit alle ausschlafen können."], 0, { points: 2, text: "t1", hinweis: "Die Kernaussage passt zum ganzen Text, nicht nur zu einem Abschnitt. Prüfe jede Antwort: Steht das wirklich so im Text?" }),
  a("Am Wochenende bis mittags schlafen – ist das nach dem Text eine gute Idee? Begründe mit dem Text.", [
    kr("Antwort passt zum Text (nein oder eher nicht)", 1),
    kr("Begründung aus dem Text", 2, "Wer am Samstag bis mittags schläft, verschiebt seine innere Uhr noch weiter nach hinten; feste Schlafenszeiten helfen der inneren Uhr (Z. 32–34).")
  ], "Nein. Wer bis mittags schläft, verschiebt seine innere Uhr noch weiter nach hinten und wird am Abend noch später müde.",
  ["verschieb|nach hinten|uhr", "nein|nicht|keine gute"], { text: "t1", zeilen: [30, 36], hilfe: "So kannst du beginnen: Nach dem Text ist das …, weil …" }),
  a("Emre möchte morgens wacher sein. Gib ihm zwei Tipps aus dem Text und erkläre bei einem Tipp, warum er hilft.", [
    kr("erster passender Tipp", 1, "Handy eine Stunde vor dem Schlafen weglegen / nachts nicht neben das Bett legen · feste Schlafenszeiten, auch am Wochenende · morgens Tageslicht, Schulweg zu Fuß oder mit dem Rad"),
    kr("zweiter passender Tipp", 1),
    kr("Erklärung, warum ein Tipp hilft", 2, "z. B. ohne Bildschirmlicht wird das Melatonin nicht gebremst · feste Zeiten helfen der inneren Uhr · helles Tageslicht macht wach")
  ], "Emre soll das Handy eine Stunde vor dem Schlafen weglegen, weil das Licht das Melatonin bremst. Außerdem soll er auch am Wochenende zu festen Zeiten schlafen gehen.",
  ["handy", "fest|schlafenszeit|tageslicht|zu fuß|rad", "weil|denn|damit|deshalb"], { text: "t1", zeilen: [24, 36], hilfe: "So kannst du schreiben: Erstens … Zweitens … Das hilft, weil …" })
];

// R7, Variante B – „Auf zwei Rädern“ (Abschnitte: 1–5 · 6–12 · 13–18 · 19–25 · 26–34)
const R_B = [
  c("Worum geht es in dem Text?", [
    "Wie sich das Fahrrad von der Laufmaschine bis heute entwickelt hat",
    "Warum Pferde früher wichtiger waren als heute",
    "Wie man ein Fahrrad richtig repariert",
    "Welche Fahrräder heute am schnellsten sind"], 0, { text: "t1", hinweis: "Lies Überschrift und ersten Abschnitt: Dort steht meist, worum es im ganzen Text geht." }),
  m(UEBERSCHRIFTEN, [
    ["Abschnitt 1 (Z. 1–5)", "Ohne Pferd kam man nicht schnell voran"],
    ["Abschnitt 2 (Z. 6–12)", "Eine Maschine zum Laufen"],
    ["Abschnitt 3 (Z. 13–18)", "Ein kaltes Jahr als Auslöser?"],
    ["Abschnitt 4 (Z. 19–25)", "Schneller, aber riskant: das Hochrad"],
    ["Abschnitt 5 (Z. 26–34)", "Fast schon das Fahrrad von heute"]], { text: "t1", hinweis: "Lies von jedem Abschnitt den ersten Satz. Er verrät oft schon das Thema." }),
  z("In welchen Zeilen wird beschrieben, wie sich der Fahrer auf der Laufmaschine fortbewegte?", "t1", [[9, 11]], { hinweis: ZEILE_HILFE }),
  z("In welchen Zeilen steht, warum das Hochrad gefährlich war?", "t1", [[23, 24]], { hinweis: ZEILE_HILFE }),
  f(ERGAENZE, [
    feld("In diesem Jahr stellte Karl Drais die Laufmaschine vor:", ["1817", "im Jahr 1817"]),
    feld("So viele Kilometer schaffte er bei seiner ersten Fahrt in einer Stunde:", ["14", "14 km", "etwa 14", "14 Kilometer", "etwa 14 Kilometer", "etwa 14 km", "vierzehn", "ca. 14", "ca. 14 km", "ca. 14 Kilometer"]),
    feld("In diesem Land kam 1885 das Sicherheitsrad auf den Markt:", ["England", "in England"])
  ], { text: "t1", hinweis: "Zahlen findest du schnell, wenn du den Text mit den Augen überfliegst und nur auf Ziffern und Zahlwörter achtest." }),
  a("Erkläre mit eigenen Worten, warum die Laufmaschine noch kein richtiges Fahrrad war.", [
    kr("Grund genannt", 2, "Sie hatte keine Pedale (und keine Kette): Der Fahrer musste sich mit den Füßen vom Boden abstoßen."),
    kr("verständlich in eigenen Worten erklärt", 1, "Nicht nur Sätze abgeschrieben; der Unterschied zum Fahrrad ist erkennbar.")
  ], "Die Laufmaschine hatte keine Pedale. Man musste sich mit den Füßen vom Boden abstoßen, also eher laufen als fahren.",
  ["pedal", "füße|füßen|abstoßen|abstieß|stoßen|laufen"], { text: "t1", zeilen: [6, 12], hilfe: "So kannst du beginnen: Die Laufmaschine hatte …" }),
  a("Das Sicherheitsrad war besser als das Hochrad. Nenne zwei Verbesserungen aus dem Text und gib an, in welchen Zeilen sie stehen.", [
    kr("erste Verbesserung richtig genannt", 1, "zwei gleich große Räder · Kette, die die Kraft auf das Hinterrad überträgt · (wenig später) Reifen mit Luft"),
    kr("zweite Verbesserung richtig genannt", 1),
    kr("passende Zeilenangabe", 2, "Z. 27–30; 2 Punkte für eine passende Angabe, 1 Punkt, wenn sie nur grob stimmt")
  ], "Es hatte zwei gleich große Räder und eine Kette zum Hinterrad (Z. 27–28).",
  ["gleich groß|räder", "kette|luft|reifen", "z.|zeile"], { text: "t1", zeilen: [26, 31], hilfe: "So kannst du schreiben: Eine Verbesserung war … Eine weitere war … (Z. …)." }),
  a("Im Text steht: „Ein Fahrzeug, das kein Futter braucht, kam also genau zur richtigen Zeit“ (Z. 17–18). Erkläre, was damit gemeint ist.", [
    kr("Zusammenhang mit dem kalten Jahr erkannt", 2, "1816 fiel die Ernte schlecht aus, Hafer wurde knapp, viele Pferde konnten nicht gefüttert werden."),
    kr("Folge erklärt", 1, "Ein Fahrzeug ohne Pferd – die Laufmaschine – war deshalb besonders nützlich.")
  ], "Weil es nach der schlechten Ernte zu wenig Hafer für die Pferde gab, brauchte man ein Fahrzeug, das ohne Pferd auskommt. Die Laufmaschine war so ein Fahrzeug.",
  ["ernte|hafer|futter|kalt", "pferd"], { text: "t1", zeilen: [13, 18], hilfe: "Lies die Sätze davor noch einmal (Z. 14–17)." }),
  c("Welcher Satz fasst die wichtigste Aussage des ganzen Textes am besten zusammen?", [
    "Aus der Laufmaschine von 1817 wurde in mehreren Schritten das Fahrrad, wie wir es heute kennen.",
    "Karl Drais hat das Fahrrad mit Pedalen und Kette ganz allein erfunden.",
    "Das Fahrrad wurde erfunden, weil die Postkutsche zu langsam war.",
    "Früher waren Fahrräder so gefährlich, dass sie verboten wurden."], 0, { points: 2, text: "t1", hinweis: "Die Kernaussage passt zum ganzen Text, nicht nur zu einem Abschnitt. Prüfe jede Antwort: Steht das wirklich so im Text?" }),
  a("War das Hochrad nach dem Text eine gute Erfindung? Begründe mit dem Text.", [
    kr("Antwort passt zum Text (nur teilweise oder eher nein)", 1),
    kr("Begründung aus dem Text", 2, "Es war schnell, aber gefährlich: Bei einem Sturz fiel man aus großer Höhe kopfüber auf die Straße (Z. 23–24).")
  ], "Nur teilweise. Das Hochrad war zwar schnell, aber gefährlich, weil man bei einem Sturz aus großer Höhe kopfüber auf die Straße fiel.",
  ["gefährlich|sturz|stürz|fiel|höhe", "schnell"], { text: "t1", zeilen: [19, 25], hilfe: "So kannst du beginnen: Nach dem Text war das Hochrad …, weil …" }),
  a("Du erklärst einem jüngeren Kind, wie sich das Fahrrad verändert hat. Nenne zwei Erfindungen aus dem Text in der richtigen Reihenfolge und erkläre bei einer, was sie verbessert hat.", [
    kr("erste passende Erfindung", 1, "Laufmaschine (1817) · Pedale am Vorderrad · Hochrad · Sicherheitsrad mit Kette (1885) · Reifen mit Luft · Gangschaltung, Bremsen, Elektromotor"),
    kr("zweite Erfindung, die Reihenfolge stimmt", 1),
    kr("Erklärung, was eine Erfindung verbessert hat", 2, "z. B. Pedale: man muss sich nicht mehr abstoßen · Kette und gleich große Räder: sicherer · Luftreifen: bequemer")
  ], "Zuerst gab es die Laufmaschine ohne Pedale. Später kam das Sicherheitsrad mit Kette. Weil die Kette die Kraft auf das Hinterrad überträgt, konnten beide Räder gleich groß sein, und man fiel nicht mehr so tief.",
  ["laufmaschine|pedal|hochrad", "kette|sicherheitsrad|luft|reifen", "weil|dadurch|deshalb|damit|bequem|sicher"], { text: "t1", hilfe: "So kannst du schreiben: Zuerst … Später … Das war besser, weil …" })
];

// M7, Variante A – „Wenn die Nacht nicht mehr dunkel wird“ (Abschnitte: 1–6 · 7–13 · 14–21 · 22–30 · 31–36 · 37–50)
const M_A = [
  c("Welche Absicht hat der Text vor allem?", [
    "Er informiert über ein Umweltproblem und zeigt, was man dagegen tun kann.",
    "Er ruft dazu auf, nachts alle Lampen in der Stadt abzuschalten.",
    "Er erzählt von einer Nachtwanderung unter dem Sternenhimmel.",
    "Er wirbt für Straßenlaternen mit Bewegungsmelder."], 0, { text: "t1", hinweis: "Frage dich: Will der Text vor allem informieren, überzeugen, unterhalten oder etwas verkaufen?" }),
  m(UEBERSCHRIFTEN, [
    ["Abschnitt 1 (Z. 1–6)", "Ein Himmel fast ohne Sterne"],
    ["Abschnitt 2 (Z. 7–13)", "Wie die Lichtglocke entsteht"],
    ["Abschnitt 3 (Z. 14–21)", "Tödliche Falle für Insekten"],
    ["Abschnitt 4 (Z. 22–30)", "Vögel und Pflanzen kommen aus dem Takt"],
    ["Abschnitt 5 (Z. 31–36)", "Was dem Menschen fehlt"],
    ["Abschnitt 6 (Z. 37–50)", "Ein Problem, das sich lösen lässt"]], { points: 3, text: "t1", hinweis: "Fasse jeden Abschnitt für dich in einem Stichwort zusammen und vergleiche es dann mit den Überschriften." }),
  z("In welchen Zeilen wird erklärt, wie die Lichtglocke über einer Stadt entsteht?", "t1", [[7, 10]], { hinweis: ZEILE_HILFE }),
  z("In welchen Zeilen steht, woran man moderne, umweltfreundliche Straßenleuchten erkennt?", "t1", [[40, 43]], { hinweis: ZEILE_HILFE }),
  f(ERGAENZE, [
    feld("So viele Sterne sieht man auf dem Land bei klarem Wetter:", ["mehrere Tausend", "Tausende", "mehrere 1000", "einige Tausend", "mehrere Tausend Sterne"]),
    feld("So viele Insekten können an einer Laterne in einer Sommernacht verenden:", ["mehr als hundert", "über hundert", "mehr als 100", "über 100", "hundert", "100", ">100", "mehr als hundert Insekten"]),
    feld("In dieser Gegend Deutschlands gibt es einen Sternenpark:", ["Rhön", "in der Rhön", "die Rhön"])
  ], { text: "t1", hinweis: "Überfliege den Text gezielt nach dem Schlüsselwort der Frage (Sterne, Insekten, Sternenpark)." }),
  a("Erkläre das Wort „Lichtverschmutzung“ (Z. 6) mit eigenen Worten und nenne ein Beispiel dafür aus dem Text.", [
    kr("Bedeutung erklärt", 2, "Künstliches Licht hellt den Nachthimmel auf; die Nacht wird nicht mehr richtig dunkel."),
    kr("Beispiel aus dem Text", 1, "Straßenlaternen · Schaufenster · Leuchtreklamen · angestrahlte Gebäude")
  ], "Lichtverschmutzung bedeutet, dass künstliches Licht den Himmel nachts aufhellt, sodass es nicht mehr richtig dunkel wird. Ein Beispiel sind Leuchtreklamen.",
  ["künstlich|lampe|licht", "himmel|nacht|dunkel|hell", "laterne|schaufenster|reklame|gebäude"], { text: "t1", zeilen: [1, 6] }),
  a("Lichtverschmutzung schadet Tieren. Belege diese Aussage mit zwei verschiedenen Textstellen. Gib die Zeilen an.", [
    kr("erster Beleg (Tier und Schaden)", 1, "Insekten: umkreisen die Lampe bis zur Erschöpfung / werden leichte Beute / verenden (Z. 14–21)"),
    kr("zweiter Beleg (anderes Tier oder anderer Schaden)", 1, "Zugvögel: werden vom Weg abgelenkt, prallen gegen Gebäude, verlieren Kraft (Z. 22–27)"),
    kr("Zeilenangaben oder wörtliche Zitate zu beiden Belegen", 2, "je passender Angabe 1 Punkt")
  ], "Insekten umkreisen Lampen, bis sie erschöpft sind (Z. 16–17). Zugvögel werden von beleuchteten Hochhäusern von ihrem Weg abgelenkt (Z. 24–25).",
  ["insekt", "vögel|vogel|zugv", "z.|zeile"], { text: "t1", zeilen: [14, 30] }),
  a("Erkläre den Zusammenhang: Warum ist es auch für Pflanzen und Vögel ein Nachteil, wenn an Laternen viele Insekten sterben?", [
    kr("Insekten als Bestäuber", 2, "Die Insekten fehlen als Bestäuber: Pflanzen werden nicht bestäubt und bilden weniger Früchte und Samen."),
    kr("Insekten als Nahrung", 2, "Die Insekten fehlen als Nahrung: Vögel finden weniger Futter.")
  ], "Insekten bestäuben Pflanzen. Fehlen sie, werden weniger Blüten bestäubt. Außerdem fressen viele Vögel Insekten und finden dann weniger Nahrung.",
  ["bestäub", "nahrung|futter|fressen"], { text: "t1", zeilen: [19, 21] }),
  c("Welche Aussage lässt sich mit dem Text NICHT belegen?", [
    "Lichtverschmutzung ist die wichtigste Ursache für das Insektensterben.",
    "Der Nachthimmel über Europa wird heller.",
    "Warmes, gelbliches Licht gehört zu modernen Straßenleuchten.",
    "Auch Menschen schlafen bei viel Licht schlechter."], 0, { points: 2, text: "t1", hinweis: "Suche zu jeder Aussage die Textstelle. Die Aussage, zu der du keine findest, ist die gesuchte." }),
  a("Fasse die Kernaussage des ganzen Textes in zwei bis drei Sätzen zusammen.", [
    kr("Problem benannt", 1, "Künstliches Licht hellt die Nacht immer mehr auf (Lichtverschmutzung)."),
    kr("Folgen genannt", 2, "Es schadet Tieren (Insekten, Zugvögel), Pflanzen und Menschen – mindestens zwei Betroffene."),
    kr("Lösung genannt", 1, "Das Problem lässt sich leicht verringern (Licht aus, bessere Leuchten, Sternenparks).")
  ], "Künstliches Licht macht die Nächte immer heller. Das schadet Insekten, Zugvögeln und auch dem Schlaf der Menschen. Mit besseren Leuchten und weniger Beleuchtung lässt sich das Problem aber leicht verringern.",
  ["licht", "tier|insekt|vögel|mensch", "verringern|lampe|leuchte|ausschalt|dimm|lösung|sternenpark"], { text: "t1" }),
  a("Im Text heißt es, Lichtverschmutzung lasse sich „leichter verringern als viele andere Umweltprobleme“ (Z. 37–38). Erkläre, warum das so ist, und nenne zwei Maßnahmen aus dem Text.", [
    kr("Begründung", 2, "Schaltet man eine Lampe aus, ist die Belastung sofort verschwunden – es bleibt nichts zurück."),
    kr("zwei Maßnahmen", 2, "Leuchten strahlen nur nach unten · warmes, gelbliches Licht · nachts dimmen · Bewegungsmelder · Sternenparks · Gartenbeleuchtung ausschalten; je Maßnahme 1 Punkt")
  ], "Sobald man eine Lampe ausschaltet, ist die Belastung sofort weg. Gemeinden können zum Beispiel Leuchten einbauen, die nur nach unten strahlen, und sie spät in der Nacht dimmen.",
  ["sofort|ausschalt|verschwunden", "unten|warm|gelb|dimm|bewegungsmelder|sternenpark|garten"], { text: "t1", zeilen: [37, 50] }),
  a("Eure Gemeinde überlegt, die Straßenlaternen zwischen 1 Uhr und 5 Uhr ganz auszuschalten. Nimm Stellung: Bist du dafür oder dagegen? Begründe deine Meinung und verwende mindestens eine Information aus dem Text.", [
    kr("eigene Meinung klar formuliert", 1),
    kr("Begründung mit einer Information aus dem Text", 2, "z. B. schont Insekten und Zugvögel · besserer Schlaf · spart Strom und Geld; dagegen ließe sich mit dem Text der Bewegungsmelder als bessere Lösung nennen"),
    kr("nachvollziehbar und zusammenhängend formuliert", 1)
  ], "Ich bin dafür, weil nachts kaum jemand unterwegs ist und so weniger Insekten an den Laternen sterben. Außerdem spart die Gemeinde Strom und Geld.",
  ["dafür|dagegen|finde|meinung|bin", "insekt|vögel|tiere|strom|geld|schlaf|bewegungsmelder|sicher"], { text: "t1" })
];

// M7, Variante B – „Der lange Weg zum Wasserhahn“ (Abschnitte: 1–7 · 8–15 · 16–23 · 24–32 · 33–40 · 41–49)
const M_B = [
  c("Welche Absicht hat der Text vor allem?", [
    "Er informiert darüber, woher unser Trinkwasser kommt und warum wir es schützen müssen.",
    "Er will die Leser überreden, kein Wasser aus Flaschen mehr zu kaufen.",
    "Er erzählt von einem Besuch im Wasserwerk.",
    "Er warnt davor, Wasser aus der Leitung zu trinken."], 0, { text: "t1", hinweis: "Frage dich: Will der Text vor allem informieren, überzeugen, unterhalten oder etwas verkaufen?" }),
  m(UEBERSCHRIFTEN, [
    ["Abschnitt 1 (Z. 1–7)", "Ein Alltagsgut, über das kaum jemand nachdenkt"],
    ["Abschnitt 2 (Z. 8–15)", "Der Boden als Filter"],
    ["Abschnitt 3 (Z. 16–23)", "Vom Brunnen ins Wasserwerk"],
    ["Abschnitt 4 (Z. 24–32)", "Streng geprüft und mit Druck verteilt"],
    ["Abschnitt 5 (Z. 33–40)", "Gefahren für das Grundwasser"],
    ["Abschnitt 6 (Z. 41–49)", "Was jeder Einzelne tun kann"]], { points: 3, text: "t1", hinweis: "Fasse jeden Abschnitt für dich in einem Stichwort zusammen und vergleiche es dann mit den Überschriften." }),
  z("In welchen Zeilen wird erklärt, warum die Bodenschichten wie ein Filter wirken?", "t1", [[11, 13]], { hinweis: ZEILE_HILFE }),
  z("In welchen Zeilen steht, warum Hochbehälter und Wassertürme an erhöhten Stellen stehen?", "t1", [[30, 32]], { hinweis: ZEILE_HILFE }),
  f(ERGAENZE, [
    feld("So viele Liter Trinkwasser verbraucht jeder Mensch in Deutschland ungefähr am Tag:", ["125", "125 Liter", "ungefähr 125", "ungefähr 125 Liter", "etwa 125", "etwa 125 Liter", "ca. 125", "125 l", "ca. 125 Liter", "ca. 125 l"]),
    feld("Diese zwei Stoffe werden im Wasserwerk meist herausgefiltert:", ["Eisen und Mangan", "Mangan und Eisen", "Eisen, Mangan", "Eisen Mangan", "Mangan, Eisen", "Eisen & Mangan", "Eisen u. Mangan"]),
    feld("So lange kann es dauern, bis ein Regentropfen im Grundwasser ankommt:", ["Jahre oder Jahrzehnte", "Jahre oder sogar Jahrzehnte", "Jahrzehnte", "Jahre", "Jahre bis Jahrzehnte", "mehrere Jahre", "viele Jahre", "sogar Jahrzehnte"])
  ], { text: "t1", hinweis: "Überfliege den Text gezielt nach dem Schlüsselwort der Frage (Liter, Stoffe, Regentropfen)." }),
  a("Erkläre das Wort „Grundwasser“ (Z. 9) mit eigenen Worten und beschreibe, wie es entsteht.", [
    kr("Bedeutung erklärt", 2, "Wasser, das sich unter der Erde bzw. tief im Boden sammelt."),
    kr("Entstehung beschrieben", 1, "Regen versickert im Boden.")
  ], "Grundwasser ist Wasser, das sich unter der Erde sammelt. Es entsteht, wenn Regen im Boden versickert.",
  ["boden|erde|unter", "regen|versicker"], { text: "t1", zeilen: [8, 15] }),
  a("Das Grundwasser ist in Gefahr. Belege diese Aussage mit zwei verschiedenen Textstellen. Gib die Zeilen an.", [
    kr("erster Beleg", 1, "In trockenen Sommern sinkt der Grundwasserspiegel, weil mehr Wasser entnommen wird, als durch Regen nachkommt (Z. 34–36)."),
    kr("zweiter Beleg", 1, "Dünger aus der Landwirtschaft und Reste von Medikamenten gelangen ins Grundwasser (Z. 36–38)."),
    kr("Zeilenangaben oder wörtliche Zitate zu beiden Belegen", 2, "je passender Angabe 1 Punkt")
  ], "In trockenen Sommern sinkt der Grundwasserspiegel (Z. 34–35). Außerdem gelangen Dünger und Reste von Medikamenten ins Grundwasser (Z. 36–38).",
  ["trocken|sinkt|grundwasserspiegel", "dünger|medikament", "z.|zeile"], { text: "t1", zeilen: [33, 40] }),
  a("Erkläre den Zusammenhang: Warum muss Wasser aus Flüssen und Seen aufwendiger gereinigt werden als Grundwasser?", [
    kr("Grundwasser ist schon gefiltert", 2, "Auf dem Weg durch Erde, Sand und Kies bleiben Schmutzteilchen hängen; Lebewesen im Boden bauen Schadstoffe ab."),
    kr("Wasser aus Flüssen und Seen fehlt dieser Filter", 2, "Es ist nicht durch den Boden gesickert und enthält deshalb mehr Schmutz und Schadstoffe.")
  ], "Grundwasser sickert lange durch Erde, Sand und Kies und wird dabei gefiltert. Wasser aus Flüssen und Seen hat diesen natürlichen Filter nicht durchlaufen, deshalb muss es im Wasserwerk stärker gereinigt werden.",
  ["filter|gefiltert|sand|kies|schichten|boden", "fluss|flüsse|see|nicht"], { text: "t1" }),
  c("Welche Aussage lässt sich mit dem Text NICHT belegen?", [
    "Leitungswasser ist gesünder als Wasser aus der Flasche.",
    "Eisen und Mangan im Wasser sind nicht gefährlich.",
    "Der größte Teil des Trinkwassers stammt aus dem Grundwasser.",
    "Wer kürzer duscht, spart auch Energie."], 0, { points: 2, text: "t1", hinweis: "Suche zu jeder Aussage die Textstelle. Die Aussage, zu der du keine findest, ist die gesuchte." }),
  a("Fasse die Kernaussage des ganzen Textes in zwei bis drei Sätzen zusammen.", [
    kr("Herkunft des Trinkwassers", 1, "Es stammt meist aus dem Grundwasser und wird im Wasserwerk aufbereitet."),
    kr("Kontrolle und Sicherheit", 1, "Es wird streng kontrolliert, die Versorgung ist heute sicher."),
    kr("Gefährdung und Schutz", 2, "Trockenheit und Schadstoffe gefährden das Grundwasser; deshalb muss man sparsam damit umgehen und es schützen.")
  ], "Unser Trinkwasser stammt meist aus dem Grundwasser und wird streng kontrolliert. Trockene Sommer und Schadstoffe gefährden es aber. Deshalb sollte jeder sparsam mit Wasser umgehen und es schützen.",
  ["grundwasser", "kontroll|sauber|sicher|geprüft", "schütz|spar|gefahr|gefähr|trocken|schadstoff|dünger"], { text: "t1" }),
  a("Im Text heißt es, die Versorgung sei nicht „für immer garantiert“ (Z. 33–34). Erkläre, warum, und nenne zwei Dinge, die jeder Einzelne nach dem Text tun kann.", [
    kr("Begründung", 2, "Der Grundwasserspiegel sinkt in trockenen Sommern; Dünger und Reste von Medikamenten gelangen ins Grundwasser. Eine Ursache klar erklärt: 2 Punkte, nur genannt: 1 Punkt."),
    kr("zwei Dinge, die jeder tun kann", 2, "Medikamente nicht in Toilette oder Waschbecken · kürzer duschen · Wasserhahn beim Zähneputzen zudrehen · Leitungswasser trinken; je 1 Punkt")
  ], "In trockenen Sommern sinkt der Grundwasserspiegel, und Dünger und Medikamente verschmutzen das Grundwasser. Jeder kann kürzer duschen und alte Medikamente nicht in die Toilette werfen.",
  ["trocken|sinkt|dünger|medikament|schadstoff", "dusch|zähneputzen|wasserhahn|toilette|apotheke|leitungswasser"], { text: "t1", zeilen: [33, 49] }),
  a("In eurer Schule soll ein Trinkwasserspender aufgestellt werden, an dem alle ihre Flaschen mit Leitungswasser füllen können. Nimm Stellung: Bist du dafür oder dagegen? Begründe deine Meinung und verwende mindestens eine Information aus dem Text.", [
    kr("eigene Meinung klar formuliert", 1),
    kr("Begründung mit einer Information aus dem Text", 2, "z. B. Leitungswasser wird streng kontrolliert · es kostet nur einen Bruchteil · es muss nicht mit dem Lastwagen transportiert werden"),
    kr("nachvollziehbar und zusammenhängend formuliert", 1)
  ], "Ich bin dafür, weil Leitungswasser streng kontrolliert wird und viel weniger kostet als Wasser aus der Flasche. Außerdem muss es nicht mit dem Lastwagen gebracht werden.",
  ["dafür|dagegen|finde|meinung|bin", "kontroll|kostet|billig|günstig|lastwagen|transport|flasche"], { text: "t1" })
];

const ALLE = { kurz: "Sachtext I", scope: "Informationen finden · Kernaussagen · Textbelege", minutes: 45 };
module.exports = {
  "d7-p2-r-a": probe(2, "R", "A", { ...ALLE, title: "Probe 2 (R7): Sachtext I", texte: [SCHLAF], items: R_A }),
  "d7-p2-r-b": probe(2, "R", "B", { ...ALLE, title: "Probe 2 (R7): Sachtext I – Variante B", texte: [FAHRRAD], items: R_B }),
  "d7-p2-m-a": probe(2, "M", "A", { ...ALLE, title: "Probe 2 (M7): Sachtext I", texte: [LICHT], items: M_A }),
  "d7-p2-m-b": probe(2, "M", "B", { ...ALLE, title: "Probe 2 (M7): Sachtext I – Variante B", texte: [WASSER], items: M_B })
};
