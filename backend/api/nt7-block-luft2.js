"use strict";
// Zweite Probe „Luft“ (17.10.2026) – nur die Module 1 bis 5 des Themenbereichs Luft, R- und M-Fassung. Lösungen bleiben im Backend.
//
// Wunsch der Lehrkraft: „erstelle eine weitere probe die sich mit den modulen aber überwiegend mit den arbeitsblättern decken“.
// Die Aufgaben folgen den Arbeitsblättern zu den Modulen 1–5 (7M/NT/arbeitsblaetter/L1…L5, Inhalt im Wortlaut:
// .codex-build/nt7-werkzeug/arbeitsblaetter/INHALT.md); Zahlen in Rechenaufgaben sind neu (transfer: true).
// Die M-Fassung hat dieselben Kernaufgaben und dazu die „Zusatz für M7“-Aufgaben der Blätter (mehr offene Fragen).
// modul = Kennung aus 7M/NT/themen.js. Die Probe-Seite 7M/NT/probe.js kennt nur choice, match, order und text.
// Bilder: eigene SVG in 7M/NT/assets/proben/ (dieselben wie auf den Arbeitsblättern).
// Aufgaben einer Probe, für die es schon Abgaben gibt, nicht mehr verändern (die Antwortreihenfolge hängt am Text).
const c = (modul, prompt, options, extra) => ({ type: "choice", modul, prompt, options, answer: 0, points: 1, ...(extra || {}) });
const m = (modul, prompt, pairs, extra) => ({ type: "match", modul, prompt, pairs, points: pairs.length, ...(extra || {}) });
const o = (modul, prompt, steps, extra) => ({ type: "order", modul, prompt, steps, points: steps.length, ...(extra || {}) });
const t = (modul, prompt, expected, criteria, keywords, extra) => ({ type: "text", modul, prompt, expected, criteria, keywords, points: criteria.length, ...(extra || {}) });

/* ---------- Bilder (Pfad relativ zu 7M/NT/), wie in nt7-block-luft.js ---------- */
const BILD = {
  windrad: {
    image: "assets/proben/luft-windkraftanlage.svg",
    imageAlt: "Animation: Schnitt durch eine Windkraftanlage. Der Wind dreht vorne den Rotor, Buchstabe B zeigt auf einen der langen Flügel. Im Maschinenhaus oben auf dem Turm liegen drei Bauteile hintereinander: D ist ein Kasten mit einem großen und einem kleinen Zahnrad. C ist eine Scheibe mit zwei roten Klötzen. A ist ein Kasten mit Drahtspulen und einem Magneten, der sich dreht; von dort führt ein Kabel den Turm hinunter zum Transformator."
  },
  feuerdreieck: {
    image: "assets/proben/luft-feuerdreieck.svg",
    imageAlt: "Animation: ein Dreieck mit einer flackernden Flamme in der Mitte. An den drei Seiten stehen statt der Begriffe die Buchstaben A, B und C."
  },
  rohre: {
    image: "assets/proben/luft-kerzen-rohre.svg",
    imageAlt: "Animation: Vier brennende Kerzen stehen jeweils in einem Glasrohr. Rohr A steht direkt auf dem Tisch und ist oben offen. Rohr B steht direkt auf dem Tisch und ist oben mit einer Glasplatte verschlossen. Rohr C steht auf zwei Bleistiften, sodass unten ein Spalt bleibt, und ist oben offen. Rohr D steht auf zwei Bleistiften und ist oben mit einer Glasplatte verschlossen."
  }
};

/* ---------- Aufgaben aus den Arbeitsblättern (nicht jede steht in beiden Fassungen; pro, seiteFehlt, streichholz, explodiert,
   motor und gefaehrlich sind Reserve, z. B. für eine Nachholprobe) ---------- */
const A = {
  // Modul 1 – Arbeitsblatt Aufgabe 2
  luftteile: () => m("luft-modul", "Woraus besteht Luft? Ordne jedem Bestandteil seinen Anteil zu.",
    [["Stickstoff", "78 %"], ["Sauerstoff", "21 %"], ["sonstige Gase (vor allem Edelgase wie Argon)", "1 %"]]),
  // Modul 1 – Arbeitsblatt Aufgabe 3 (Versuche und Eigenschaften der Luft)
  versuche: () => m("luft-modul", "Was zeigt jeder Versuch? Ordne die passende Eigenschaft der Luft zu.",
    [["Ein „leeres“ Glas wird kopfüber ins Wasser gedrückt. Das Taschentuch darin bleibt trocken.", "Luft nimmt Raum ein."],
     ["Ein Ball wird vor und nach dem Aufpumpen gewogen. Er wird etwas schwerer.", "Luft hat ein Gewicht."],
     ["Eine Luftpumpe wird vorne zugehalten. Der Griff lässt sich hineindrücken und federt zurück.", "Luft lässt sich zusammendrücken."],
     ["Ein Brenner erhitzt die Luft in einem Heißluftballon. Der Ballon steigt.", "Warme Luft ist leichter als kühle Luft."]]),
  // Modul 1 – Arbeitsblatt Aufgabe 6
  glas: () => t("luft-modul", "Erkläre: Warum bleibt das Taschentuch im „leeren“ Glas trocken, wenn man das Glas kopfüber ins Wasser drückt?",
    "Das Glas ist nicht leer, es ist voller Luft. Die Luft besetzt den Platz im Glas, deshalb kann das Wasser nicht hinein: Luft nimmt Raum ein.",
    ["erkannt: Im Glas ist Luft (das Glas ist nicht leer)",
     "erklärt: Die Luft braucht Platz / nimmt Raum ein, deshalb kann das Wasser nicht ins Glas"],
    ["luft|gefüllt|voll", "platz|raum|kann nicht hinein|kommt nicht hinein|nicht rein|verdräng|drückt das wasser"]),
  // Modul 2 – Arbeitsblatt Aufgabe 1
  windrad: () => m("windkraft-strom", "Das Bild zeigt eine aufgeschnittene Windkraftanlage. Ordne den Buchstaben die Bauteile zu.",
    [["Buchstabe A", "Generator"], ["Buchstabe B", "Rotorblatt"], ["Buchstabe C", "Bremse"], ["Buchstabe D", "Getriebe"]], BILD.windrad),
  // Modul 2 – Arbeitsblatt Aufgabe 5 c
  sturm: () => c("windkraft-strom", "Bei Sturm steht eine Windkraftanlage still. Warum?",
    ["Eine Bremse blockiert den Rotor, damit die Anlage nicht beschädigt wird.",
     "Bei Sturm weht oben am Turm kein Wind.",
     "Der Generator hat schon genug Strom erzeugt und macht eine Pause.",
     "Bei Sturm wird die Gondel abgeschaltet, weil der Wind dann erneuerbar ist."]),
  // Modul 3 – Arbeitsblatt Aufgabe 1
  pro: () => c("windkraft-procontra", "Welche Aussage ist ein Argument FÜR Windkraft (Pro)?",
    ["Ein Windrad verbrennt nichts – es entstehen keine Abgase.",
     "Bei Windstille liefert das Windrad keinen Strom.",
     "Die riesigen Anlagen verändern das Landschaftsbild.",
     "Vögel können mit den Rotorblättern zusammenstoßen."]),
  contra: () => c("windkraft-procontra", "Welche Aussage ist ein Argument GEGEN Windkraft (Contra)?",
    ["Bei tiefer Sonne werfen die Rotorblätter einen flackernden Schatten auf die Häuser.",
     "Windstrom spart klimaschädliches CO₂.",
     "Bau, Wartung und Reparatur bringen Arbeitsplätze.",
     "Der Wind geht nie aus – er ist erneuerbar."]),
  // Modul 3 – Arbeitsblatt Aufgabe 2
  begriffe: () => m("windkraft-procontra", "Was bedeuten diese Wörter? Ordne zu.",
    [["Kompromiss", "eine Einigung, bei der jede Seite etwas nachgibt"],
     ["Befürworter", "Menschen, die für eine Sache sind"],
     ["Argument", "ein Grund, mit dem man eine Meinung stützt"]]),
  // Modul 3 – Arbeitsblatt Aufgabe 5 (neue Zahl)
  zehnH: () => c("windkraft-procontra", "In Bayern gilt die 10-H-Regel: Ein Windrad muss von Wohnhäusern mindestens zehnmal so weit entfernt stehen, wie es hoch ist. Ein Windrad ist 180 m hoch. Wie groß muss der Abstand mindestens sein?",
    ["1800 m", "180 m", "190 m", "18 000 m"], { transfer: true }),
  // Modul 3 – Arbeitsblatt Aufgabe 3
  kompromiss: () => t("windkraft-procontra", "Eine Gemeinde streitet über ein neues Windrad. Beschreibe, wie ein Kompromiss aussehen könnte.",
    "Man sucht eine Lösung, die Gegner und Befürworter beide akzeptieren können – jede Seite gibt etwas nach. Zum Beispiel wird das Windrad gebaut, aber mit genug Abstand zu den Wohnhäusern, nicht im Vogelschutzgebiet und dort, wo viel Wind weht.",
    ["erklärt: eine Lösung, mit der beide Seiten (Gegner und Befürworter) leben können / jede Seite gibt etwas nach",
     "ein passendes Beispiel (z. B. mehr Abstand zu den Häusern, anderer Standort, nicht im Vogelschutzgebiet, kleinere oder weniger Windräder)"],
    ["beide|alle|jede seite|gegner und befürworter|einig|nachgeb|zufrieden|akzeptier|mittelweg", "abstand|weiter weg|entfernt|standort|ort|vogel|kleiner|weniger|wald|feld|außerhalb|nachts|abschalt"]),
  // Modul 4 – Arbeitsblatt Aufgabe 1
  dreieck: () => c("luft-verbrennung", "Das Bild zeigt das Feuerdreieck. Welche drei Bedingungen gehören an die Seiten A, B und C?",
    ["Brennstoff, Sauerstoff und Zündtemperatur",
     "Brennstoff, Stickstoff und Wasser",
     "Holz, Wind und Sonnenlicht",
     "Wärme, Rauch und Kohlenstoffdioxid"], BILD.feuerdreieck),
  seiteFehlt: () => c("luft-verbrennung", "Was passiert, wenn eine Seite des Feuerdreiecks fehlt?",
    ["Das Feuer geht aus.", "Das Feuer brennt stärker.", "Das Feuer brennt genauso weiter.", "Das Feuer wird zu einer Explosion."]),
  // Modul 4 – Arbeitsblatt Aufgabe 2
  brennbar: () => m("luft-verbrennung", "Brennbar oder nicht? Ordne jedem Stoff die passende Gruppe zu.",
    [["Erdgas", "brennbar – gasförmig"], ["Sand", "nicht brennbar"], ["Holz", "brennbar – fest"], ["Spiritus", "brennbar – flüssig"]]),
  // Modul 4 – Arbeitsblatt Aufgabe 3 a (Werte wie in der Abbildung im Modul)
  zuendtemp: () => o("luft-verbrennung", "Ordne die Stoffe nach ihrer Zündtemperatur – beginne mit der niedrigsten.",
    ["Streichholzkopf", "Papier", "Butan im Feuerzeug", "Spiritus", "Erdgas"]),
  // Modul 4 – Arbeitsblatt Aufgabe 3 b
  streichholz: () => c("luft-verbrennung", "Warum genügt beim Streichholz schon das Anreiben an der Schachtel?",
    ["Die Reibungswärme reicht für die niedrige Zündtemperatur des Streichholzkopfes (60–80 °C).",
     "In der Schachtel ist ein kleines Feuer versteckt.",
     "Der Streichholzkopf braucht zum Brennen keinen Sauerstoff.",
     "Holz entzündet sich schon bei Zimmertemperatur."]),
  // Modul 4 – Arbeitsblatt Aufgabe 4
  rohre: () => c("luft-verbrennung", "Vier Kerzen brennen in Glasrohren (siehe Bild). In welchem Rohr brennt die Kerze weiter?",
    ["in Rohr C", "in Rohr A", "in Rohr B", "in Rohr D"], BILD.rohre),
  // Modul 4 – Arbeitsblatt Aufgabe 6
  spaene: () => t("luft-verbrennung", "Erkläre: Warum brennen dünne Holzspäne besser als ein dicker Holzklotz?",
    "Die Holzspäne sind fein zerteilt und haben zusammen eine größere Oberfläche. Nur an der Oberfläche kann der Sauerstoff mit dem Brennstoff reagieren. Je feiner der Brennstoff, desto heftiger verbrennt er.",
    ["genannt: Die Späne sind fein zerteilt / haben eine größere Oberfläche",
     "erklärt: An der Oberfläche kommt Sauerstoff (Luft) an das Holz – mehr Oberfläche, mehr Sauerstoff kommt heran"],
    ["oberfläche|fein|klein|dünn|zerteil|zerklein", "sauerstoff|luft"]),
  // Modul 5 – Arbeitsblatt Aufgabe 1
  explodiert: () => c("achtung-explosiv", "Was davon kann explodieren?",
    ["Mehlstaub, der fein in der Luft verteilt ist", "Mehl in einer geschlossenen Tüte", "ein Holzbalken", "ein Eimer Sand"]),
  // Modul 5 – Arbeitsblatt Aufgabe 1 (Holzstaub in der Schreinerei), auf eine neue Lage angewandt
  schreinerei: () => c("achtung-explosiv", "In einer Schreinerei schwebt beim Schleifen feiner Holzstaub in der Luft. Warum sind Rauchen und offenes Feuer dort streng verboten?",
    ["Der fein verteilte Holzstaub kann sich an einem Funken entzünden und explodieren.",
     "Der Holzstaub senkt die Zündtemperatur der Luft auf null.",
     "Rauch macht das Holz feucht, dann lässt es sich nicht mehr schleifen.",
     "Holzstaub ist nicht brennbar, aber der Rauch färbt das Holz dunkel."], { transfer: true }),
  // Modul 5 – Arbeitsblatt Aufgabe 2 b
  mehlstaub: () => o("achtung-explosiv", "Lehrerversuch Mehlstaub-Explosion: Bringe die Schritte in die richtige Reihenfolge.",
    ["Mehl liegt in der Schale, das Teelicht brennt, der Pappdeckel liegt oben auf dem Rohr.",
     "Durch den Schlauch wird kräftig Luft geblasen.",
     "Das Mehl wirbelt hoch und verteilt sich fein im Rohr.",
     "Der Mehlstaub entzündet sich am Teelicht.",
     "Explosion: Der Deckel fliegt weg, Flammen schlagen heraus."]),
  // Modul 5 – Arbeitsblatt Aufgabe 3
  staub: () => c("achtung-explosiv", "Warum kann fein verteilter Staub explodieren, ein Klumpen desselben Stoffes aber nicht?",
    ["Fein verteilt hat er eine riesige Oberfläche: Viele Teilchen treffen gleichzeitig auf Sauerstoff und verbrennen auf einen Schlag.",
     "Staub ist ein anderer Stoff als der Klumpen.",
     "Staub ist leichter als Luft und steigt deshalb in die Flamme.",
     "Im Staub steckt mehr Wasser, das bei Hitze explodiert."]),
  // Modul 5 – Arbeitsblatt Aufgabe 4
  motor: () => m("achtung-explosiv", "Kleine Explosionen im Automotor: Was macht welches Teil?",
    [["Zündkerze", "erzeugt den Funken"], ["Kolben", "wird vom Druck der Explosion nach unten geschoben"], ["Benzin-Luft-Gemisch", "explodiert in winzigen Mengen"]]),
  // Modul 5 – Arbeitsblatt Aufgabe 5
  gefaehrlich: () => c("achtung-explosiv", "Welche Handlung ist gefährlich?",
    ["Spiritus auf die Glut im Grill gießen", "feste Grillanzünder verwenden", "einen Anzündkamin benutzen", "an der Tankstelle den Motor abstellen"]),
  // Modul 5 – Arbeitsblatt Aufgabe 6
  spiritus: () => t("achtung-explosiv", "Jonas will Spiritus auf die Grillkohle gießen, damit das Feuer schneller brennt. Erkläre, was passieren kann.",
    "Der Spiritus verdampft auf der heißen Glut sofort. Der Dampf bildet mit der Luft ein explosives Gemisch, das sich schlagartig entzündet. Es entsteht eine Stichflamme (Verpuffung). Sie kann am Strahl entlang bis in die Flasche laufen – schwere Verbrennungen, Lebensgefahr.",
    ["erklärt: Spiritus verdampft auf der heißen Glut, der Dampf bildet mit der Luft ein explosives (leicht entzündbares) Gemisch",
     "Folge: Das Gemisch entzündet sich schlagartig – Stichflamme oder Verpuffung, die Flamme kann bis zur Flasche laufen, schwere Verbrennungen"],
    ["verdampf|dampf|gas|gemisch", "stichflamme|verpuff|explo|flamme|verbrenn|lebensgefahr|flasche|schlagartig"])
};

const WIND_STROM = ["Der Wind trifft auf die Rotorblätter.",
  "Der Rotor beginnt sich zu drehen.",
  "Das Getriebe macht die Drehung schneller.",
  "Der Generator erzeugt elektrische Energie.",
  "Der Strom wird in das Stromnetz eingespeist."];

module.exports = {
  /* ======================= R-Fassung (48 Punkte, etwa 35 Minuten) ======================= */
  "nt7-luft2-r": {
    id: "nt7-luft2-r", zug: "R", thema: "luft", minutes: 40,
    title: "Probe Luft – Module 1 bis 5 (7R)",
    scope: "Luft und ihre Eigenschaften, Windkraft, Windkraft pro und contra, Verbrennung, Explosionen – wie auf den Arbeitsblättern",
    items: [
      /* --- Modul 1 --- */
      A.luftteile(), A.versuche(), A.glas(),
      /* --- Modul 2 --- */
      A.windrad(),
      o("windkraft-strom", "Vom Wind zum Strom: Bringe die Schritte in die richtige Reihenfolge.", WIND_STROM),
      A.sturm(),
      /* --- Modul 3 --- */
      A.contra(), A.begriffe(), A.zehnH(), A.kompromiss(),
      /* --- Modul 4 --- */
      A.dreieck(), A.brennbar(), A.zuendtemp(), A.rohre(), A.spaene(),
      /* --- Modul 5 --- */
      A.mehlstaub(), A.staub(), A.schreinerei(), A.spiritus()
    ]
  },

  /* ======================= M-Fassung (48 Punkte, etwa 40 Minuten) ======================= */
  "nt7-luft2-m": {
    id: "nt7-luft2-m", zug: "M", thema: "luft", minutes: 45,
    title: "Probe Luft – Module 1 bis 5 (7M)",
    scope: "Luft und Formeln, Windkraft, Windkraft pro und contra, Verbrennung und Oberfläche, Explosionen – wie auf den Arbeitsblättern mit den M7-Zusatzaufgaben",
    items: [
      /* --- Modul 1 --- */
      A.versuche(),
      // Arbeitsblatt: Zusatz für M7 a
      m("luft-modul", "Welche Formel gehört zu welchem Stoff? Ordne zu.",
        [["Stickstoff", "N₂"], ["Kohlenstoffdioxid", "CO₂"], ["Sauerstoff", "O₂"]]),
      // Arbeitsblatt: Zusatz für M7 b
      t("luft-modul", "Aus welchen Atomen besteht ein Kohlenstoffdioxid-Molekül (CO₂)? Gib die Art und die Anzahl der Atome an.",
        "Ein Kohlenstoffdioxid-Molekül besteht aus 1 Kohlenstoff-Atom (C) und 2 Sauerstoff-Atomen (O). Die kleine 2 gehört zum O; eine 1 schreibt man nicht.",
        ["1 Kohlenstoff-Atom (C)", "2 Sauerstoff-Atome (O)"],
        ["(ein|1|einem)\\s*kohlenstoff|1\\s*c\\b|ein c\\b|kohlenstoff", "(zwei|2)\\s*sauerstoff|2\\s*o\\b|zwei o\\b"]),
      /* --- Modul 2 --- */
      A.windrad(),
      o("windkraft-strom", "Vom Wind zum Strom: Bringe die Schritte in die richtige Reihenfolge.", WIND_STROM),
      // Arbeitsblatt Aufgabe 6
      t("windkraft-strom", "Warum werden Windkraftanlagen heute immer größer und höher gebaut? Nenne zwei Gründe.",
        "1. Ein großer Rotor fängt mehr Wind ein, deshalb liefert die Anlage mehr Strom. 2. In großer Höhe weht der Wind stärker und gleichmäßiger als nah am Boden.",
        ["größerer Rotor (längere Rotorblätter) fängt mehr Wind ein – mehr Strom",
         "in großer Höhe weht der Wind stärker / gleichmäßiger"],
        ["rotor|flügel|blätter|größer|mehr wind|fängt", "höhe|hoch|oben|stärker|gleichmäßig|mehr wind"]),
      /* --- Modul 3 --- */
      A.contra(), A.zehnH(), A.kompromiss(),
      // Arbeitsblatt: Zusatz für M7
      t("windkraft-procontra", "Warum ist es so schwierig, sich für oder gegen ein neues Windrad zu entscheiden? Begründe mit einem Pro- und einem Contra-Argument.",
        "Auf beiden Seiten gibt es gute Argumente, man muss sie abwägen. Pro: Windkraft schützt Klima und Umwelt, weil keine Abgase und kein CO₂ entstehen. Contra: Anwohner und Natur werden belastet, z. B. durch Geräusche, Schatten oder die Gefahr für Vögel.",
        ["ein passendes Pro-Argument (z. B. keine Abgase, kein CO₂, erneuerbar, Arbeitsplätze)",
         "ein passendes Contra-Argument (z. B. Wind weht nicht immer, Landschaftsbild, Geräusche, Schatten, Gefahr für Vögel)"],
        ["abgas|co2|co₂|erneuerbar|geht nie aus|klima|umwelt|arbeitspl|verbrennt nichts|sauber", "nicht immer|windstill|landschaft|geräusch|lärm|laut|schatten|vögel|vogel|anwohner"]),
      /* --- Modul 4 --- */
      A.dreieck(), A.zuendtemp(),
      // Arbeitsblatt Aufgabe 4: Begründung zu Rohr B
      t("luft-verbrennung", "Vier Kerzen brennen in Glasrohren (siehe Bild). Warum geht die Kerze in Rohr B aus?",
        "Rohr B ist oben verschlossen. Bei der Verbrennung wird der Sauerstoff verbraucht, und es kommt keine frische Luft nach. Ohne Sauerstoff geht die Flamme aus.",
        ["Rohr B ist oben verschlossen / es kommt keine frische Luft nach", "der Sauerstoff wird beim Brennen verbraucht – ohne Sauerstoff geht die Flamme aus"],
        ["verschlossen|zu\\b|geschlossen|glasplatte|keine (frische )?luft|nicht nach", "sauerstoff"], BILD.rohre),
      // Arbeitsblatt: Zusatz für M7 (neue Zahlen)
      t("luft-verbrennung", "Ein Holzwürfel mit 6 cm Kantenlänge hat eine Oberfläche von 216 cm². Man zerschneidet ihn in 8 kleine Würfel mit 3 cm Kantenlänge. Wie groß ist die Oberfläche jetzt (mit Rechnung)? Was bleibt gleich? Was bedeutet das für das Brennen?",
        "Ein kleiner Würfel hat 6 · 3 cm · 3 cm = 54 cm² Oberfläche, alle 8 zusammen 8 · 54 cm² = 432 cm². Die Oberfläche hat sich verdoppelt, die Holzmenge bleibt gleich. Mit größerer Oberfläche kommt mehr Sauerstoff an das Holz – die kleinen Würfel brennen schneller und heftiger.",
        ["Oberfläche jetzt 432 cm² (mit Rechnung, z. B. 8 · 6 · 3 cm · 3 cm) – sie verdoppelt sich",
         "Die Holzmenge (das Volumen, die Masse) bleibt gleich",
         "Folge: größere Oberfläche – mehr Sauerstoff kommt heran, das Holz brennt schneller / heftiger"],
        ["432|doppelt|verdoppel", "holzmenge|menge|volumen|masse|gewicht|gleich viel holz", "sauerstoff|luft|schneller|besser|heftiger|stärker"], { transfer: true }),
      /* --- Modul 5 --- */
      A.mehlstaub(), A.staub(), A.schreinerei(), A.spiritus(),
      // Arbeitsblatt: Zusatz für M7
      t("achtung-explosiv", "Warum ist ein fast leerer Benzintank gefährlicher als ein randvoller?",
        "Im vollen Tank ist fast nur flüssiges Benzin und kaum Luft – also kaum Sauerstoff. Im fast leeren Tank ist viel Platz für Luft und Benzindampf. Dort kann sich ein explosives Benzin-Luft-Gemisch bilden.",
        ["im vollen Tank ist kaum Luft (kaum Sauerstoff)", "im fast leeren Tank ist viel Luft und Benzindampf – ein explosives Benzin-Luft-Gemisch kann entstehen"],
        ["kaum luft|keine luft|wenig luft|kein platz|kaum sauerstoff|wenig sauerstoff|kein sauerstoff|voll", "dampf|gemisch|viel luft|mehr luft|explo|sauerstoff"])
    ]
  }
};
