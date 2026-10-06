"use strict";
// Block-Probe „Elektrizität“ – R- und M-Fassung. Lösungen bleiben im Backend.
// Module des Blocks: stromkreis · strom-wirkungen · spannung-stromstaerke · widerstand · strom-sicher.
// Reihenfolge: nach den Modulen, Transferaufgaben am Schluss. Bilder und Animationen liegen in
// 7M/NT/assets/proben (strom-*.svg: eigene Zeichnungen nach den Grafiken der Module; dazu schaltzeichen.svg,
// reihenschaltung.svg und kennlinien.svg).
const c = (modul, prompt, options, extra) => ({ type: "choice", modul, prompt, options, answer: 0, points: 1, ...(extra || {}) });
const m = (modul, prompt, pairs, extra) => ({ type: "match", modul, prompt, pairs, points: pairs.length, ...(extra || {}) });
const o = (modul, prompt, steps, extra) => ({ type: "order", modul, prompt, steps, points: steps.length, ...(extra || {}) });
const t = (modul, prompt, expected, criteria, keywords, extra) => ({ type: "text", modul, prompt, expected, criteria, keywords, points: criteria.length, ...(extra || {}) });

const S1 = "stromkreis", S2 = "strom-wirkungen", S3 = "spannung-stromstaerke", S4 = "widerstand", S5 = "strom-sicher";
const BILD = "assets/proben/";

const ALT_SCHALTPLAENE = "Drei Schaltpläne mit je einer Spannungsquelle, einem Schalter und einer Glühlampe. Schaltplan A: Der Schalter ist geschlossen, die Leitung führt ohne Lücke von einem Pol durch die Lampe zum anderen Pol. Schaltplan B: Der Schalter ist offen. Schaltplan C: Der Schalter ist geschlossen, aber eine zusätzliche Leitung verbindet die obere und die untere Leitung direkt miteinander, an der Lampe vorbei.";
const ALT_MAGNET = "Animation: Ein Eisennagel steckt in einer Spule aus Draht. Die Spule ist mit einer Batterie und einem Schalter verbunden. Solange der Schalter geschlossen ist, hängen vier Büroklammern an der Spitze des Nagels. Wird der Schalter geöffnet, fallen die Büroklammern auf den Tisch. Schließt sich der Schalter wieder, zieht der Nagel sie erneut an.";
const ALT_PLAETZE = "Schaltplan mit einer Batterie und einer Lampe. Drei mögliche Plätze für ein Messgerät sind markiert: Platz 1 liegt neben der Batterie und ist mit ihren beiden Anschlüssen verbunden. Platz 2 liegt mitten in der Leitung zwischen Batterie und Lampe. Platz 3 liegt neben der Lampe und ist mit ihren beiden Anschlüssen verbunden.";
const ALT_MINE = "Animation: Eine Bleistiftmine aus Graphit ist mit zwei Klemmen in einen Stromkreis mit Batterie und Lampe eingebaut. Die zweite Klemme wird langsam von der ersten weggeschoben und wieder zurück. Je länger das Stück Mine zwischen den Klemmen ist, desto schwächer leuchtet die Lampe.";

/* ---------- Aufgaben, die in beiden Fassungen gleich sind ---------- */
const elektronen = () => c(S1, "In der Animation wandern die Elektronen (blaue Punkte) durch den Stromkreis. Welcher Anschluss der Batterie ist der Minuspol?",
  ["Anschluss X: Die Elektronen wandern vom Minuspol durch die Lampe zum Pluspol.", "Anschluss Y: Die Elektronen wandern vom Pluspol durch die Lampe zum Minuspol.", "Beide Anschlüsse: Eine Batterie hat zwei Minuspole und keinen Pluspol.", "Das lässt sich nicht sagen: Elektronen wandern abwechselnd in beide Richtungen."],
  { image: BILD + "strom-elektronen.svg", imageAlt: "Animation: Stromkreis aus einer Batterie mit den Anschlüssen X und Y, einem geschlossenen Schalter und einer leuchtenden Lampe. Blaue Punkte wandern im Kabel im Kreis: Sie verlassen die Batterie am Anschluss X, laufen durch den Schalter und durch die Lampe und kommen am Anschluss Y wieder bei der Batterie an." });

const leiterReihe = () => c(S1, "Welche Reihe enthält nur Stoffe, die den elektrischen Strom leiten?",
  ["Kupfer, Eisen, Graphit", "Kupfer, Glas, Aluminium", "Eisen, Gummi, Graphit", "Kunststoff, Glas, trockenes Holz"]);

module.exports = {
  /* ================= Fassung für R-Klassen ================= */
  "nt7-strom-r": {
    id: "nt7-strom-r", zug: "R", thema: "strom", minutes: 40,
    title: "Probe Elektrizität (7R)",
    scope: "Stromkreis und Schaltplan, Wirkungen des Stroms, Spannung und Stromstärke, Widerstand, sicherer Umgang mit Strom",
    items: [
      /* ----- Der Stromkreis und sein Schaltplan ----- */
      m(S1, "Ordne den Schaltzeichen im Bild ihre Bedeutung zu.",
        [["Zeichen 1", "Glühlampe"], ["Zeichen 2", "Spannungsquelle"], ["Zeichen 3", "offener Schalter"], ["Zeichen 4", "Messgerät für die Stromstärke"]],
        { image: BILD + "schaltzeichen.svg", imageAlt: "Vier nummerierte Schaltzeichen. Zeichen 1: ein Kreis mit einem Kreuz. Zeichen 2: ein langer, dünner und ein kurzer, dicker Strich quer zur Leitung, darüber stehen Plus und Minus. Zeichen 3: eine Linie, von der ein Stück schräg abgehoben ist. Zeichen 4: ein Kreis mit dem Buchstaben A." }),
      c(S1, "Im Bild siehst du drei Schaltpläne. In welchem Schaltplan leuchtet die Lampe?",
        ["nur in Schaltplan A", "nur in Schaltplan B", "nur in Schaltplan C", "in Schaltplan A und in Schaltplan C"],
        { image: BILD + "strom-schaltplaene.svg", imageAlt: ALT_SCHALTPLAENE }),
      leiterReihe(),
      elektronen(),

      /* ----- Was Strom alles kann: Wirkungen ----- */
      m(S2, "Ordne jeder Wirkung des Stroms ein passendes Gerät zu.",
        [["Wärmewirkung", "Toaster"], ["Lichtwirkung", "LED-Lampe"], ["magnetische Wirkung", "Elektromagnet am Schrottkran"], ["chemische Wirkung", "Akku beim Laden"]]),
      t(S2, "Die Animation zeigt einen Versuch mit Spule, Eisennagel und Büroklammern. Beschreibe, was du beobachtest, und erkläre es.",
        "Ist der Schalter geschlossen, hängen die Büroklammern am Nagel. Wird der Schalter geöffnet, fallen sie ab. Fließt Strom durch die Spule, wird der Eisennagel zum Magneten – das ist die magnetische Wirkung des Stroms. Ein Elektromagnet ist nur ein Magnet, solange Strom fließt.",
        ["Beobachtung: Bei geschlossenem Schalter hängen die Büroklammern am Nagel, bei offenem Schalter fallen sie ab", "Fließt Strom durch die Spule, wird der Nagel zum Magneten (Elektromagnet, magnetische Wirkung)", "Ohne Strom ist der Nagel kein Magnet mehr – ein Elektromagnet wirkt nur, solange Strom fließt"],
        ["fallen|fällt|hängen|hängt|angezogen|zieht", "magnet", "solange|ohne strom|kein strom|strom aus|ausgeschaltet|nur wenn|nur bei"],
        { image: BILD + "strom-elektromagnet.svg", imageAlt: ALT_MAGNET }),
      c(S2, "Was stimmt für eine LED-Lampe im Vergleich zu einer Glühlampe?",
        ["Sie macht aus derselben elektrischen Energie mehr Licht und weniger Wärme.", "Sie macht aus derselben elektrischen Energie mehr Wärme und weniger Licht.", "Sie leuchtet nur, wenn in ihr ein dünner Draht hell glüht.", "Sie braucht für gleich viel Licht mehr elektrische Energie."]),
      c(S2, "Im Alltag sagt man: „Der Wasserkocher verbraucht Strom.“ Was passiert wirklich mit der elektrischen Energie?",
        ["Sie wird in Wärmeenergie umgewandelt.", "Sie verschwindet, sobald das Wasser kocht.", "Sie fließt vollständig zurück in die Steckdose.", "Sie wird in chemische Energie umgewandelt."]),

      /* ----- Spannung und Stromstärke ----- */
      m(S3, "Was geben die drei Größen an? Ordne zu.",
        [["Spannung", "wie stark die Elektronen angetrieben werden"], ["Stromstärke", "wie viele Elektronen in jeder Sekunde fließen"], ["Widerstand", "wie stark ein Leiter den Strom bremst"]]),
      c(S3, "Auf einer Fahrradlampe steht „6 V · 0,5 A“. Was bedeuten die beiden Angaben?",
        ["Die Spannung beträgt 6 Volt, die Stromstärke 0,5 Ampere.", "Die Stromstärke beträgt 6 Volt, die Spannung 0,5 Ampere.", "Die Lampe wiegt 6 Gramm und leuchtet 0,5 Stunden lang.", "Der Widerstand beträgt 6 Volt, die Spannung 0,5 Ampere."]),
      c(S3, "Du willst die Stromstärke messen. An welchen Platz im Schaltplan gehört das Messgerät?",
        ["an Platz 2: in die Leitung, also in Reihe", "an Platz 1: neben die Batterie, also parallel", "an Platz 3: neben die Lampe, also parallel", "an Platz 1 oder 3: Hauptsache, es berührt zwei Punkte"],
        { image: BILD + "strom-messplaetze.svg", imageAlt: ALT_PLAETZE }),
      c(S3, "Drei Lampen sind hintereinander in einem Stromkreis geschaltet (Reihenschaltung). Eine Lampe wird herausgedreht. Was passiert?",
        ["Alle Lampen gehen aus, denn der Stromkreis ist unterbrochen.", "Die beiden anderen Lampen leuchten heller als vorher.", "Die beiden anderen Lampen leuchten unverändert weiter.", "Nur die Lampe direkt daneben geht ebenfalls aus."]),

      /* ----- Der elektrische Widerstand ----- */
      c(S4, "Alle drei Drähte im Bild bestehen aus Kupfer. Welcher Draht hat den größten Widerstand?",
        ["Draht B, denn er ist lang und dünn.", "Draht A, denn er ist kurz und dick.", "Draht C, denn er ist kurz und dünn.", "Alle gleich, denn sie sind aus demselben Material."],
        { image: BILD + "strom-draehte.svg", imageAlt: "Drei Drähte aus Kupfer. Draht A ist 1 Meter lang und dick. Draht B ist 4 Meter lang und dünn. Draht C ist 1 Meter lang und so dünn wie Draht B." }),
      t(S4, "Das Diagramm zeigt eine Messreihe an einem Draht. Lies ab, wie groß die Stromstärke bei 4 V ist. Berechne dann den Widerstand des Drahtes und schreibe die Rechnung auf.",
        "Bei 4 V fließen 0,2 A. R = U : I = 4 V : 0,2 A = 20 Ω. Der Draht hat einen Widerstand von 20 Ohm.",
        ["Stromstärke richtig abgelesen: 0,2 A", "Rechnung R = U : I mit den Werten 4 V : 0,2 A (ein anderes richtig abgelesenes Wertepaar zählt auch)", "Ergebnis 20 Ω (Ohm)"],
        ["0,2|0.2", "u : i|u:i|u/i|geteilt|durch|4 : 0|4:0|4 v :", "20 ω|20ω|20 ohm|= 20|=20"],
        { image: BILD + "strom-ui-diagramm.svg", imageAlt: "Diagramm einer Messreihe an einem Draht: nach rechts die Spannung in Volt von 0 bis 6, nach oben die Stromstärke in Ampere von 0 bis 0,4. Die Messpunkte liegen auf einer Geraden durch den Nullpunkt. Zwei der drei Messpunkte: bei 2 Volt 0,1 Ampere und bei 6 Volt 0,3 Ampere. Der dritte Messpunkt liegt genau dazwischen bei 4 Volt." }),
      c(S4, "An einem Metalldraht wird die Spannung verdoppelt. Seine Temperatur bleibt gleich. Was passiert mit der Stromstärke?",
        ["Sie wird doppelt so groß.", "Sie wird halb so groß.", "Sie bleibt gleich groß.", "Sie sinkt auf null."]),
      c(S4, "Warum besteht ein Verlängerungskabel innen aus dickem Kupferdraht?",
        ["Dicker Kupferdraht hat einen kleinen Widerstand – das Kabel bleibt kühl.", "Dicker Kupferdraht hat einen großen Widerstand – das schützt vor zu viel Strom.", "Kupfer leitet den Strom schlecht – dadurch wird das Kabel sicherer.", "Dicker Kupferdraht wird schnell heiß – so merkt man, dass Strom fließt."]),

      /* ----- Sicher mit Strom umgehen ----- */
      m(S5, "Ordne jeder Schutzeinrichtung ihre Aufgabe zu.",
        [["Sicherung", "unterbricht den Stromkreis, wenn die Stromstärke zu groß wird"], ["FI-Schutzschalter", "schaltet ab, wenn Strom einen falschen Weg nimmt, zum Beispiel durch einen Menschen"], ["Isolierung", "verhindert, dass man den blanken Draht berührt"], ["Kindersicherung", "verhindert, dass etwas in die Steckdose gesteckt wird"]]),
      o(S5, "Jemand hängt an einem defekten Gerät und kann nicht loslassen. Bringe die Schritte in die richtige Reihenfolge.",
        ["Die Person nicht anfassen.", "Den Strom abschalten: Stecker ziehen oder Sicherung ausschalten.", "Den Notruf 112 wählen.", "Jetzt erst der Person helfen."]),
      c(S5, "Welche Spannungsquelle ist für den Menschen lebensgefährlich?",
        ["die Steckdose mit 230 V", "die Mignonzelle mit 1,5 V", "die Blockbatterie mit 9 V", "die Autobatterie mit 12 V"]),
      c(S5, "Warum ist es besonders gefährlich, elektrische Geräte mit nassen Händen anzufassen?",
        ["Nasse Haut leitet besser: Es fließt mehr Strom durch den Körper.", "Nasse Haut ist kälter: Die Geräte werden dadurch schneller heiß.", "Wasser macht die Spannung der Steckdose größer als 230 V.", "Wasser macht aus dem Gerät einen starken Elektromagneten."]),

      /* ----- Transfer ----- */
      c(S3, "Ein ferngesteuertes Auto braucht eine Spannung von 6 V. Wie viele Mignonzellen mit je 1,5 V musst du hintereinander einlegen?",
        ["4 Mignonzellen", "3 Mignonzellen", "6 Mignonzellen", "9 Mignonzellen"],
        { transfer: true }),
      t(S4, "Du klemmst eine lange Bleistiftmine aus Graphit in einen Stromkreis mit einer Lampe (siehe Animation). Schiebst du die zweite Klemme weiter weg, muss der Strom durch ein längeres Stück der Mine fließen – die Lampe wird dunkler. Erkläre das. Denke daran, wovon der Widerstand eines Leiters abhängt.",
        "Graphit leitet den Strom, deshalb leuchtet die Lampe überhaupt. Je länger das Stück der Mine ist, durch das der Strom fließen muss, desto größer ist der Widerstand. Ein größerer Widerstand bremst den Strom stärker: Die Stromstärke wird kleiner, und die Lampe leuchtet schwächer.",
        ["Die Mine aus Graphit leitet den Strom – der Stromkreis ist geschlossen", "Ein längeres Stück Mine hat einen größeren Widerstand", "Ein größerer Widerstand bedeutet eine kleinere Stromstärke – die Lampe leuchtet schwächer"],
        ["leitet|leiter|geschlossen", "größer|grösser|steigt|mehr widerstand|höher", "stromstärke|weniger strom|kleiner|gebremst|bremst"],
        { transfer: true, image: BILD + "strom-minendimmer.svg", imageAlt: ALT_MINE }),
      t(S5, "Eine Scheibe Toast klemmt im Toaster fest. Dein Bruder will sie mit einer Gabel herausholen. Der Stecker steckt noch in der Steckdose. Beurteile, ob das eine gute Idee ist, und begründe. Was sollte er zuerst tun?",
        "Das ist lebensgefährlich. Die Gabel ist aus Metall und leitet den Strom. Berührt sie im Toaster ein Teil, das unter Spannung steht, fließt Strom durch die Gabel und durch den Körper – er bekommt einen Stromschlag. Zuerst muss er den Stecker ziehen.",
        ["Urteil mit Grund: gefährlich, weil die Gabel aus Metall ist und den Strom leitet", "Der Strom kann durch den Körper fließen: Stromschlag, Lebensgefahr", "Zuerst den Stecker ziehen (den Strom abschalten)"],
        ["metall|leitet|leiter", "körper|stromschlag|lebensgefahr|lebensgefährlich|tödlich|schlag", "stecker|ausstecken|abschalten|strom aus|vom strom"],
        { transfer: true })
    ]
  },

  /* ================= Fassung für M-Klassen ================= */
  "nt7-strom-m": {
    id: "nt7-strom-m", zug: "M", thema: "strom", minutes: 45,
    title: "Probe Elektrizität (7M)",
    scope: "Stromkreis und Schaltplan, Wirkungen des Stroms und Energieumwandlung, Spannung und Stromstärke, Reihen- und Parallelschaltung, Widerstand und Ohm'sches Gesetz, sicherer Umgang mit Strom",
    items: [
      /* ----- Der Stromkreis und sein Schaltplan ----- */
      elektronen(),
      t(S1, "Im Bild siehst du drei Schaltpläne. In Schaltplan C leuchtet die Lampe nicht, obwohl der Schalter geschlossen ist. Begründe das und erkläre, warum diese Schaltung gefährlich ist.",
        "In Schaltplan C verbindet eine zusätzliche Leitung die beiden Pole direkt – an der Lampe vorbei. Das ist ein Kurzschluss. Der Strom nimmt den Weg ohne Lampe, deshalb bleibt sie dunkel. Weil kein Gerät den Strom bremst, wird er sehr groß. Leitungen und Batterie werden heiß, es kann sogar brennen.",
        ["Kurzschluss erkannt: Eine Leitung verbindet die Pole direkt, der Strom fließt an der Lampe vorbei", "Der Strom wird sehr groß, weil kein Gerät ihn bremst", "Gefahr: Leitungen und Batterie werden heiß (Brandgefahr)"],
        ["kurzschluss|direkt|vorbei|ohne lampe", "sehr groß|sehr stark|zu groß|zu stark|bremst|riesig|hohe stromstärke|großer strom", "heiß|warm|brenn|brand|feuer|schmilz"],
        { image: BILD + "strom-schaltplaene.svg", imageAlt: ALT_SCHALTPLAENE }),
      leiterReihe(),
      c(S1, "Du schaltest das Licht ein, und die Lampe leuchtet sofort. Dabei wandern die Elektronen im Kabel nur sehr langsam. Wie passt das zusammen?",
        ["Im ganzen Kabel sind schon Elektronen. Sie setzen sich alle gleichzeitig in Bewegung.", "Die Elektronen aus der Batterie rasen blitzschnell durch das leere Kabel zur Lampe.", "Die Lampe hat vom letzten Einschalten noch Elektronen gespeichert.", "Der Schalter schickt beim Schließen einen Funken durch die Luft zur Lampe."]),

      /* ----- Was Strom alles kann: Wirkungen ----- */
      m(S2, "In welche Energieform wandelt das Gerät die elektrische Energie vor allem um?",
        [["Wasserkocher", "Wärmeenergie"], ["LED-Lampe", "Strahlungsenergie (Licht)"], ["Elektromotor", "Bewegungsenergie"], ["Akku beim Laden", "chemische Energie"]]),
      t(S2, "Die Animation zeigt einen Versuch mit Spule, Eisennagel und Büroklammern. Beschreibe und erkläre, was du beobachtest. Nenne außerdem zwei Möglichkeiten, diesen Magneten stärker zu machen.",
        "Bei geschlossenem Schalter fließt Strom durch die Spule. Der Eisennagel wird zum Magneten und hält die Büroklammern fest – das ist die magnetische Wirkung des Stroms. Wird der Schalter geöffnet, fließt kein Strom mehr: Der Nagel ist kein Magnet mehr, die Büroklammern fallen ab. Stärker wird der Elektromagnet mit mehr Windungen und mit einem stärkeren Strom.",
        ["Bei geschlossenem Schalter fließt Strom durch die Spule: Der Nagel wird zum Magneten und hält die Büroklammern (magnetische Wirkung)", "Bei offenem Schalter fließt kein Strom: Der Nagel ist kein Magnet mehr, die Büroklammern fallen ab", "Zwei Möglichkeiten genannt: mehr Windungen und stärkerer Strom (zum Beispiel durch eine größere Spannung)"],
        ["magnet", "fallen|fällt|kein strom|ohne strom|solange|strom aus|nur wenn", "windung|wickel|stärkerer strom|mehr strom|stromstärke|spannung|zweite batterie|mehr batterien"],
        { image: BILD + "strom-elektromagnet.svg", imageAlt: ALT_MAGNET }),
      c(S2, "Das Diagramm zeigt, was zwei Lampen aus 100 Teilen elektrischer Energie machen. Welche Aussage stimmt?",
        ["Lampe 2 ist die LED-Lampe: Sie macht mehr Licht und weniger Wärme als Lampe 1.", "Lampe 1 ist die LED-Lampe: Sie macht fast nur Wärme und kaum Licht.", "Lampe 2 ist die Glühlampe: Bei ihr wird der größte Teil der Energie zu Licht.", "Beide Lampen sind gleich sparsam: Beide wandeln 100 Teile Energie um."],
        { image: BILD + "strom-lampen-diagramm.svg", imageAlt: "Säulendiagramm: Was wird aus 100 Teilen elektrischer Energie? Lampe 1: 5 Teile Licht und 95 Teile Wärme. Lampe 2: 35 Teile Licht und 65 Teile Wärme." }),
      c(S2, "Ein Schlüssel hängt am Minuspol in einer Kupfer-Lösung. Fließt Strom, überzieht er sich mit einer Schicht aus Kupfer. Welche Wirkung des Stroms zeigt sich hier?",
        ["die chemische Wirkung: Der Strom verändert Stoffe", "die magnetische Wirkung: Der Strom macht den Schlüssel zum Magneten", "die Wärmewirkung: Der Strom schmilzt das Kupfer auf den Schlüssel", "die Lichtwirkung: Der Strom bringt den Schlüssel zum Glühen"]),

      /* ----- Spannung und Stromstärke ----- */
      m(S3, "Im Schaltplan sind drei Plätze für ein Messgerät markiert. Was misst das Messgerät an welchem Platz?",
        [["Platz 1", "die Spannung der Batterie"], ["Platz 2", "die Stromstärke im Stromkreis"], ["Platz 3", "die Spannung an der Lampe"]],
        { image: BILD + "strom-messplaetze.svg", imageAlt: ALT_PLAETZE }),
      c(S3, "Zwei Lampen sind parallel an eine Batterie angeschlossen. Durch Lampe 1 fließen 0,4 A, durch Lampe 2 fließen 0,25 A. Wie groß ist die Gesamtstromstärke?",
        ["0,65 A", "0,15 A", "0,4 A", "0,1 A"]),
      t(S3, "Im Schaltplan sind zwei Lampen in Reihe an eine Batterie mit 6 V angeschlossen. An Lampe 1 misst man 2,5 V. Berechne die Spannung an Lampe 2 und nenne die Regel, die du benutzt.",
        "U₂ = 6 V − 2,5 V = 3,5 V. Regel: In der Reihenschaltung ergeben die Teilspannungen zusammen die Spannung der Quelle (Maschenregel).",
        ["Rechnung 6 V − 2,5 V", "Ergebnis 3,5 V", "Regel: In der Reihenschaltung ergeben die Teilspannungen zusammen die Spannung der Quelle (Maschenregel)"],
        ["6 v −|6 v -|6 −|6 -|6-|6−|minus|abziehen|abgezogen", "3,5|3.5", "teilspannung|zusammen|addier|summe|maschen|teilt sich|aufteil"],
        { image: BILD + "reihenschaltung.svg", imageAlt: "Schaltplan: Batterie mit 6 Volt, zwei Lampen in Reihe. An Lampe 1 hängt ein Spannungsmessgerät mit der Anzeige 2,5 Volt, an Lampe 2 ein Spannungsmessgerät mit einem Fragezeichen." }),
      c(S3, "Zu Hause sind alle Steckdosen parallel geschaltet. Was wäre anders, wenn alle Geräte in Reihe geschaltet wären?",
        ["Die Geräte müssten sich die Spannung teilen, und fiele eines aus, gingen alle aus.", "An jedem Gerät läge die volle Spannung, und jedes ließe sich einzeln schalten.", "Die Spannung würde mit jedem weiteren Gerät größer als 230 V werden.", "Jedes Gerät bekäme einen eigenen Zweig, und die Stromstärken würden sich addieren."]),

      /* ----- Der elektrische Widerstand ----- */
      t(S4, "Das Diagramm zeigt Spannung und Stromstärke für zwei Drähte A und B. Vergleiche die beiden Drähte: Welcher hat den größeren Widerstand? Begründe mit dem Diagramm und berechne den Widerstand von Draht B.",
        "Draht B hat den größeren Widerstand: Bei gleicher Spannung fließt durch B viel weniger Strom, seine Gerade verläuft flacher. Rechnung für Draht B: R = U : I = 6 V : 0,3 A = 20 Ω.",
        ["Draht B hat den größeren Widerstand", "Begründung mit dem Diagramm: Bei gleicher Spannung fließt durch B weniger Strom (seine Gerade ist flacher)", "Widerstand von B richtig berechnet: R = U : I, zum Beispiel 6 V : 0,3 A = 20 Ω"],
        ["draht b|b hat|b ist|b den", "weniger strom|kleinere strom|geringere strom|flacher|gleicher spannung|weniger ampere", "20 ω|20ω|20 ohm|= 20|=20"],
        { image: BILD + "kennlinien.svg", imageAlt: "Diagramm mit zwei Geraden durch den Nullpunkt: nach rechts die Spannung in Volt, nach oben die Stromstärke in Ampere. Draht A: bei 2 Volt 0,4 Ampere, bei 4 Volt 0,8 Ampere, bei 6 Volt 1,2 Ampere. Draht B: bei 2 Volt 0,1 Ampere, bei 4 Volt 0,2 Ampere, bei 6 Volt 0,3 Ampere." }),
      m(S4, "Ein Kupferdraht wird verändert. Wie ändert sich sein Widerstand – und warum?",
        [["Der Draht wird länger.", "größerer Widerstand: Mehr Atome stehen im Weg, die Elektronen stoßen öfter an"], ["Der Draht wird dicker.", "kleinerer Widerstand: Die Elektronen haben nebeneinander mehr Platz"], ["Der Draht wird heißer.", "größerer Widerstand: Die Atome schwingen stärker"]]),
      c(S4, "Ein Draht mit einem Widerstand von 40 Ω wird an 12 V angeschlossen. Welche Rechnung für die Stromstärke ist richtig?",
        ["I = U : R = 12 V : 40 Ω = 0,3 A", "I = R : U = 40 Ω : 12 V ≈ 3,3 A", "I = U · R = 12 V · 40 Ω = 480 A", "I = U : R = 12 V : 40 Ω = 3 A"]),
      c(S4, "Durch die Zuleitung und den Heizdraht eines Wasserkochers fließt derselbe Strom. Trotzdem wird nur der Heizdraht heiß. Warum?",
        ["Der Heizdraht hat den viel größeren Widerstand: In ihm wird viel mehr Energie in Wärme umgewandelt.", "Durch den Heizdraht fließt in Wirklichkeit ein viel stärkerer Strom als durch die Zuleitung.", "Die Zuleitung aus Kupfer hat überhaupt keinen Widerstand und kann deshalb nicht warm werden.", "Der Heizdraht ist dicker als die Zuleitung und speichert deshalb viel mehr Wärme."]),

      /* ----- Sicher mit Strom umgehen ----- */
      m(S5, "Ordne jeder Schutzeinrichtung ihre Aufgabe zu.",
        [["Sicherung", "unterbricht den Stromkreis, wenn die Stromstärke zu groß wird"], ["FI-Schutzschalter", "schaltet ab, wenn Strom einen falschen Weg nimmt, zum Beispiel durch einen Menschen"], ["Schutzleiter (grün-gelb)", "leitet gefährlichen Strom von einem Metallgehäuse ab"], ["Isolierung", "verhindert, dass man den blanken Draht berührt"]]),
      c(S5, "Warum schützt die Sicherung allein einen Menschen nicht vor einem Stromschlag?",
        ["Sie schaltet erst bei mehr als 16 A ab – für das Herz sind schon etwa 0,03 A gefährlich.", "Sie schaltet schon bei 0,03 A ab – das ist für den Menschen aber viel zu spät.", "Sie misst nur die Spannung – die Stromstärke im Körper kann sie nicht erkennen.", "Sie schaltet nur ab, wenn Strom durch Wasser fließt – trockene Haut bemerkt sie nicht."]),
      c(S5, "Die Oberleitung der Bahn hat 15 000 V. Warum ist es lebensgefährlich, auf einen abgestellten Waggon zu klettern, auch wenn man die Leitung gar nicht berührt?",
        ["Bei Hochspannung kann der Strom durch die Luft überspringen, wenn man der Leitung nahe kommt.", "Die Leitung ist so heiß, dass man sich schon aus einem Meter Abstand verbrennt.", "Die Leitung zieht Menschen wie ein starker Elektromagnet zu sich heran.", "Das Dach eines Waggons steht immer unter Strom, auch ohne Oberleitung."]),

      /* ----- Transfer ----- */
      t(S2, "Ein E-Bike hat einen Akku und einen Elektromotor. Beschreibe, wie die Energie beim Laden und beim Fahren umgewandelt wird. Erkläre außerdem, warum Akku und Motor dabei warm werden.",
        "Beim Laden wird elektrische Energie in chemische Energie umgewandelt und im Akku gespeichert. Beim Fahren wird die chemische Energie wieder zu elektrischer Energie, und der Elektromotor wandelt sie in Bewegungsenergie um. Bei jeder Energieumwandlung entsteht nebenbei auch Wärme, deshalb werden Akku und Motor warm.",
        ["Laden: Elektrische Energie wird in chemische Energie umgewandelt und im Akku gespeichert", "Fahren: Die chemische Energie wird wieder zu elektrischer Energie, der Motor wandelt sie in Bewegungsenergie um", "Bei jeder Energieumwandlung entsteht nebenbei auch Wärme"],
        ["chemisch", "bewegung", "jeder|immer|nebenbei|auch wärme|teil der energie|ein teil|umwandlung"],
        { transfer: true }),
      t(S4, "Du klemmst eine lange Bleistiftmine aus Graphit in einen Stromkreis mit einer Lampe (siehe Animation). Schiebst du die zweite Klemme weiter weg, muss der Strom durch ein längeres Stück der Mine fließen – die Lampe wird dunkler. Erkläre diese Beobachtung.",
        "Graphit leitet den Strom, deshalb leuchtet die Lampe überhaupt. Je länger das Stück der Mine ist, durch das der Strom fließen muss, desto größer ist der Widerstand: Die Elektronen stoßen auf dem längeren Weg öfter an. Ein größerer Widerstand bedeutet bei gleicher Spannung eine kleinere Stromstärke – die Lampe leuchtet schwächer.",
        ["Die Mine aus Graphit leitet den Strom – der Stromkreis ist geschlossen", "Ein längeres Stück Mine hat einen größeren Widerstand", "Ein größerer Widerstand bedeutet bei gleicher Spannung eine kleinere Stromstärke – die Lampe leuchtet schwächer"],
        ["leitet|leiter|geschlossen", "widerstand", "stromstärke|weniger strom|kleiner|gebremst|bremst"],
        { transfer: true, image: BILD + "strom-minendimmer.svg", imageAlt: ALT_MINE }),
      t(S5, "Beim Schulfest schließt die Klasse 7b drei Geräte an eine Mehrfachsteckdose an (siehe Bild). Die Leitung ist mit einer Sicherung für 16 A abgesichert. Beurteile mit einer Rechnung, ob alle drei Geräte gleichzeitig laufen können, und mache der Klasse einen Vorschlag.",
        "Die Stromstärken addieren sich: 5 A + 4 A + 9 A = 18 A. Das ist mehr als 16 A. Die Leitung wäre überlastet und würde heiß, deshalb unterbricht die Sicherung den Stromkreis. Die drei Geräte können also nicht gleichzeitig laufen. Vorschlag: den Wasserkocher an eine Steckdose mit einer anderen Sicherung anschließen oder die Geräte nicht gleichzeitig einschalten.",
        ["Stromstärken addiert: 5 A + 4 A + 9 A = 18 A", "Urteil: 18 A sind mehr als 16 A – die Leitung ist überlastet, die Sicherung schaltet ab", "Sinnvoller Vorschlag: zum Beispiel ein Gerät an eine Steckdose mit eigener Sicherung anschließen oder nicht alle Geräte gleichzeitig einschalten"],
        ["18", "sicherung|überlast|schaltet ab|abschalten|mehr als 16|zu viel|zu groß|über 16", "andere steckdose|anderen steckdose|andere sicherung|anderen sicherung|eigene sicherung|nicht gleichzeitig|nacheinander|ausstecken|anderen stromkreis|weglassen|abwechselnd"],
        { transfer: true, image: BILD + "strom-steckdosenleiste.svg", imageAlt: "Mehrfachsteckdose beim Schulfest. Sie hängt über eine Zuleitung an einem Sicherungskasten mit einer Sicherung für 16 Ampere. Eingesteckt sind drei Geräte: ein Waffeleisen mit etwa 5 Ampere, eine Kaffeemaschine mit etwa 4 Ampere und ein Wasserkocher mit etwa 9 Ampere." })
    ]
  }
};
