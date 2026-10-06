"use strict";
// Block-Probe „Luft“ – R- und M-Fassung. Lösungen bleiben im Backend.
//
// Deckt alle neun Module des Themenbereichs Luft ab (modul = Kennung aus 7M/NT/themen.js).
// Reihenfolge: nach den Modulen, Transferaufgaben (transfer: true) am Schluss.
// Bilder und Animationen: eigene SVG-Dateien in 7M/NT/assets/proben/ (luft-*.svg), gezeichnet nach den Grafiken der Module.
// Aufgaben einer Probe, für die es schon Abgaben gibt, nicht mehr verändern (die Antwortreihenfolge hängt am Text).
const c = (modul, prompt, options, extra) => ({ type: "choice", modul, prompt, options, answer: 0, points: 1, ...(extra || {}) });
const m = (modul, prompt, pairs, extra) => ({ type: "match", modul, prompt, pairs, points: pairs.length, ...(extra || {}) });
const o = (modul, prompt, steps, extra) => ({ type: "order", modul, prompt, steps, points: steps.length, ...(extra || {}) });
const t = (modul, prompt, expected, criteria, keywords, extra) => ({ type: "text", modul, prompt, expected, criteria, keywords, points: criteria.length, ...(extra || {}) });

/* ---------- Bilder (Pfad relativ zu 7M/NT/) ---------- */
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
  },
  naegel: {
    image: "assets/proben/luft-rostversuch.svg",
    imageAlt: "Zeichnung: vier Gläser A bis D, in jedem steht ein blanker Eisennagel. A: trockene Luft mit Trockenmittel, der Deckel ist zu. B: Leitungswasser, das Glas ist offen. C: abgekochtes Wasser unter einer Ölschicht. D: Salzwasser, das Glas ist offen."
  },
  waage: {
    image: "assets/proben/luft-eisenwolle-waage.svg",
    imageAlt: "Animation: An einer Balkenwaage hängen links und rechts gleich große Büschel Eisenwolle, die Waage steht gerade. Ein Brenner entzündet das rechte Büschel. Es glüht orange und wird danach dunkel. Am Ende hängt die rechte Seite der Waage tiefer als die linke."
  },
  flasche: {
    image: "assets/proben/luft-flasche-berg-tal.svg",
    imageAlt: "Animation: Links steht auf einem Berggipfel eine leere, fest zugeschraubte Plastikflasche. Ein Pfeil führt hinunter ins Tal. Rechts im Tal wird dieselbe Flasche an den Seiten eingedrückt, sie ist immer noch zugeschraubt."
  },
  diagramm: {
    image: "assets/proben/kerze-diagramm.svg",
    imageAlt: "Säulendiagramm: Brenndauer einer Kerze unter Gläsern mit 250 ml (8 Sekunden), 500 ml (15 Sekunden) und 1000 ml (31 Sekunden)"
  },
  brenner: {
    image: "assets/proben/luft-gasbrenner-flammen.svg",
    imageAlt: "Animation: zwei Gasbrenner nebeneinander. Bei Brenner A ist die Luftzufuhr geschlossen, seine Flamme ist groß und gelb. Bei Brenner B ist die Luftzufuhr offen, seine Flamme ist kleiner und blau."
  }
};

/* ---------- Aufgaben, die in beiden Fassungen gleich sind (jeder Aufruf liefert eine eigene Kopie) ---------- */
const G = {
  windrad: () => m("windkraft-strom", "Das Bild zeigt eine aufgeschnittene Windkraftanlage. Ordne den Buchstaben die Bauteile zu.",
    [["Buchstabe A", "Generator"], ["Buchstabe B", "Rotorblatt"], ["Buchstabe C", "Bremse"], ["Buchstabe D", "Getriebe"]], BILD.windrad),

  deutung: () => m("forschen", "Eine Klasse hat gemessen, wie lange eine Kerze unter verschieden großen Gläsern brennt (siehe Diagramm). Was ist eine Beobachtung, was eine Deutung, was eine Bewertung? Ordne zu.",
    [["Unter dem 1000-ml-Glas brannte die Kerze 31 Sekunden.", "Beobachtung"],
     ["Im großen Glas ist mehr Sauerstoff als im kleinen.", "Deutung"],
     ["Der Versuch mit den Kerzen war spannend.", "Bewertung"]], BILD.diagramm),

  kaminofen: () => c("luft-verbrennung", "An einem Kaminofen stellt man mit einem Schieber ein, wie viel Luft zum Holz strömt. Was passiert, wenn man den Schieber fast ganz schließt?",
    ["Das Feuer brennt schwächer, weil weniger Sauerstoff an das Holz kommt.",
     "Das Feuer brennt stärker, weil die Wärme jetzt im Ofen bleibt.",
     "Das Feuer brennt genauso weiter, weil Holz zum Brennen keine Luft braucht.",
     "Das Feuer brennt stärker, weil der Stickstoff der Luft nicht mehr stört."], { transfer: true }),

  marmelade: () => c("luftdruck", "In einem neuen, noch nie geöffneten Marmeladenglas ist der Luftdruck kleiner als außen. Warum lässt sich der Deckel so schwer aufdrehen?",
    ["Die Luft von außen drückt den Deckel fest auf das Glas.",
     "Die Luft im Glas drückt den Deckel von innen fest zu.",
     "Die Marmelade klebt den Deckel am Rand des Glases fest.",
     "Im Glas ist mehr Luft als außen, sie hält den Deckel fest."], { transfer: true }),

  fair: () => c("forschen", "Mia will herausfinden, ob nasse Wäsche im Wind schneller trocknet als ohne Wind. Wie plant sie einen fairen Versuch?",
    ["Zwei gleiche, gleich nasse Tücher im selben Raum – nur vor einem steht ein Ventilator.",
     "Ein dickes Handtuch draußen im Wind, ein dünnes Tuch ohne Wind im Keller.",
     "Zwei gleiche Tücher im Wind – eines hängt in der Sonne, das andere im Schatten.",
     "Nur ein Tuch im Wind – ein zweites Tuch braucht man für den Vergleich nicht."], { transfer: true })
};

module.exports = {
  /* ======================= R-Fassung ======================= */
  "nt7-luft-r": {
    id: "nt7-luft-r", zug: "R", thema: "luft", minutes: 40,
    title: "Probe Luft (7R)",
    scope: "Eigenschaften der Luft, Windkraft, Verbrennung, Explosionen, Brandschutz, Oxidation, Luftdruck, Forschen",
    items: [
      /* --- Luft – unsichtbar, aber lebenswichtig --- */
      c("luft-modul", "Welches Gas macht den größten Teil der Luft aus?",
        ["Stickstoff (etwa 78 %)", "Sauerstoff (etwa 78 %)", "Kohlenstoffdioxid (etwa 21 %)", "Edelgase (etwa 50 %)"]),
      m("luft-modul", "Welcher Versuch zeigt welche Eigenschaft der Luft? Ordne zu.",
        [["Ein „leeres“ Glas wird kopfüber ins Wasser gedrückt. Das Taschentuch darin bleibt trocken.", "Luft nimmt Raum ein."],
         ["Ein Ball ist nach dem Aufpumpen etwas schwerer als vorher.", "Luft hat ein Gewicht."],
         ["Der Griff einer zugehaltenen Luftpumpe lässt sich hineindrücken und federt zurück.", "Luft lässt sich zusammendrücken."]]),

      /* --- Windkraft: Strom aus bewegter Luft --- */
      G.windrad(),
      c("windkraft-strom", "Wie wird in einer Windkraftanlage aus Wind Strom? Welche Reihenfolge stimmt?",
        ["Wind → Rotor → Getriebe → Generator → Stromnetz",
         "Wind → Generator → Getriebe → Rotor → Stromnetz",
         "Wind → Getriebe → Rotor → Stromnetz → Generator",
         "Wind → Rotor → Generator → Getriebe → Stromnetz"]),

      /* --- Windkraft – pro und contra --- */
      c("windkraft-procontra", "Ein Dorf streitet über ein neues Windrad. Welche Lösung ist ein Kompromiss?",
        ["Das Windrad wird gebaut, aber weiter weg vom Dorf als zuerst geplant.",
         "Das Windrad wird genau so gebaut, wie es die Befürworter wollen.",
         "Das Windrad wird nicht gebaut, so wie es die Gegner wollen.",
         "Es werden gleich drei Windräder direkt am Dorfrand gebaut."]),
      t("windkraft-procontra", "Nenne ein Argument für Windkraft und ein Argument gegen Windkraft.",
        "Dafür: Ein Windrad verbrennt nichts, deshalb entstehen keine Abgase und kein CO₂ (oder: Der Wind geht nie aus, er ist erneuerbar). Dagegen: Der Wind weht nicht immer dann, wenn man Strom braucht (oder: Windräder verändern die Landschaft, Geräusche und Schatten stören Anwohner, Vögel sind gefährdet).",
        ["ein richtiges Argument für Windkraft (z. B. keine Abgase, kein CO₂, Wind ist erneuerbar, Arbeitsplätze)",
         "ein richtiges Argument gegen Windkraft (z. B. Wind weht nicht immer, Landschaftsbild, Geräusche, Schatten, Gefahr für Vögel)"],
        ["abgas|co2|co₂|erneuerbar|geht nie aus|geht nicht aus|umwelt|klima|arbeitspl|verbrennt nichts|kein brennstoff|sauber",
         "nicht immer|windstill|kein wind|wenig wind|landschaft|geräusch|lärm|laut|schatten|vögel|vogel|fledermä"]),

      /* --- Luft und Verbrennung --- */
      c("luft-verbrennung", "Das Bild zeigt das Feuerdreieck. Welche drei Bedingungen gehören an die Seiten A, B und C?",
        ["Brennstoff, Sauerstoff und Zündtemperatur",
         "Brennstoff, Stickstoff und Zündtemperatur",
         "Holz, Wind und Sonnenlicht",
         "Wärme, Rauch und Kohlenstoffdioxid"], BILD.feuerdreieck),
      c("luft-verbrennung", "Vier Kerzen brennen in Glasrohren (siehe Bild). In welchem Rohr brennt die Kerze am besten weiter?",
        ["in Rohr C", "in Rohr A", "in Rohr B", "in Rohr D"], BILD.rohre),

      /* --- Achtung, explosiv! --- */
      c("achtung-explosiv", "Ein Häufchen Mehl brennt in der Kerzenflamme kaum. Aufgewirbelter Mehlstaub kann dagegen explodieren. Warum?",
        ["Fein verteilt hat das Mehl eine riesige Oberfläche und überall Sauerstoff um sich.",
         "Aufgewirbelter Mehlstaub ist ein anderer Stoff als das Mehl im Häufchen.",
         "Beim Aufwirbeln wird das Mehl so heiß, dass es sich von selbst entzündet.",
         "Im Mehlstaub steckt viel mehr Sauerstoff als in einem Häufchen Mehl."]),
      o("achtung-explosiv", "Im Automotor laufen vier Takte nacheinander ab. Bringe sie in die richtige Reihenfolge. Beginne mit dem Ansaugen.",
        ["Ansaugen: Der Kolben geht nach unten und saugt Benzin-Luft-Gemisch an.",
         "Verdichten: Der Kolben drückt das Gemisch zusammen.",
         "Zünden und Arbeiten: Die Zündkerze zündet, der Explosionsdruck drückt den Kolben nach unten.",
         "Ausstoßen: Der Kolben schiebt die Abgase hinaus."]),
      t("achtung-explosiv", "Die Grillkohle glüht Jonas nicht schnell genug. Er will Spiritus darübergießen. Erkläre, warum das lebensgefährlich ist.",
        "Der Spiritus verdampft auf der heißen Glut sofort. Der Dampf mischt sich mit der Luft zu einem explosiven Gemisch, und die Glut zündet es schlagartig. Es entsteht eine Stichflamme (Verpuffung). Sie kann am Strahl entlang bis in die Flasche laufen – es drohen schwere Verbrennungen.",
        ["der Spiritus verdampft auf der heißen Glut, der Dampf bildet mit der Luft ein explosives (leicht entzündbares) Gemisch",
         "das Gemisch entzündet sich schlagartig: Stichflamme oder Verpuffung, die Flamme kann bis zur Flasche zurücklaufen – schwere Verbrennungen"],
        ["verdampf|verdunst|dampf|gemisch|explosiv",
         "stichflamme|verpuff|explo|schlagartig|flasche|verbrenn|flamme"]),

      /* --- Brände verhindern und löschen --- */
      m("brand-schutz", "Es gibt drei Wege, ein Feuer zu löschen. Ordne jedem Beispiel den passenden Weg zu.",
        [["Wasser auf ein brennendes Lagerfeuer gießen", "abkühlen"],
         ["eine Löschdecke über einen brennenden Papierkorb legen", "ersticken"],
         ["im Wald eine Brandschneise schlagen", "Brennstoff wegnehmen"]]),
      c("brand-schutz", "Das Öl in einer Pfanne hat Feuer gefangen. Was ist richtig?",
        ["Herd ausschalten und einen Deckel auf die Pfanne legen",
         "schnell ein Glas Wasser in die Pfanne gießen",
         "die brennende Pfanne zum offenen Fenster tragen",
         "kräftig in die Flammen pusten, bis sie ausgehen"]),

      /* --- Oxidation --- */
      c("oxidation", "Vier blanke Eisennägel stehen zwei Wochen lang in vier Gläsern (siehe Bild). In welchen Gläsern rostet der Nagel?",
        ["in den Gläsern B und D", "in den Gläsern A und B", "in den Gläsern A und C", "in den Gläsern C und D"], BILD.naegel),
      m("oxidation", "Ergänze die Wortgleichungen: Welches Oxid entsteht?",
        [["Magnesium + Sauerstoff →", "Magnesiumoxid"], ["Kohlenstoff + Sauerstoff →", "Kohlenstoffdioxid"], ["Kupfer + Sauerstoff →", "Kupferoxid"]]),
      t("oxidation", "Die Animation zeigt einen Versuch mit Eisenwolle: Nach dem Glühen sinkt die rechte Seite der Waage. Erkläre, warum das durchgeglühte Büschel schwerer ist als vorher.",
        "Beim Glühen verbindet sich das Eisen mit Sauerstoff aus der Luft. Es entsteht Eisenoxid. Das Gewicht des Sauerstoffs kommt dazu, deshalb ist das Büschel schwerer als vorher.",
        ["das Eisen verbindet sich beim Glühen mit Sauerstoff aus der Luft (es entsteht Eisenoxid)",
         "das Gewicht des gebundenen Sauerstoffs kommt dazu – deshalb ist das Büschel schwerer"],
        ["sauerstoff|luft",
         "dazu|zusätzlich|gebunden|bindet|verbind|aufgenommen|nimmt|oxid|mehr gewicht"], BILD.waage),

      /* --- Der Luftdruck --- */
      c("luftdruck", "Auf einem Berggipfel schraubst du eine leere Plastikflasche fest zu. Im Tal ist sie eingedrückt (siehe Animation). Was ist der Grund?",
        ["Im Tal ist der Luftdruck außen größer als der Druck in der Flasche.",
         "Im Tal ist es wärmer, deshalb zieht sich die Flasche zusammen.",
         "Im Tal saugt sich die Flasche von ganz allein zusammen.",
         "Im Tal ist die Luft in der Flasche schwerer geworden."], BILD.flasche),
      m("luftdruck", "Luftdruck im Alltag: Ordne jeder Beobachtung die passende Erklärung zu.",
        [["Ein Saugnapf hält an einer glatten Fliese.", "Die Luft von außen drückt ihn an."],
         ["Im Strohhalm steigt das Getränk nach oben, wenn du saugst.", "Die Luft von außen schiebt das Getränk hoch."],
         ["Auf der Zugspitze zeigt das Barometer nur etwa 700 hPa.", "Über dem Gipfel liegt weniger Luft."]]),

      /* --- Forschen wie die Profis --- */
      G.deutung(),
      c("forschen", "Das Bild zeigt zwei Gasbrenner. Welche Flamme ist heißer?",
        ["Flamme B: die blaue, rauschende Flamme",
         "Flamme A: die gelbe, leuchtende Flamme",
         "Flamme A, weil sie viel größer ist als Flamme B",
         "Beide Flammen sind genau gleich heiß."], BILD.brenner),

      /* --- Transfer --- */
      c("luft-modul", "Ein Trinkglas wird für den Versand in Luftpolsterfolie gewickelt. Welche Eigenschaft der Luft schützt das Glas vor Stößen?",
        ["Luft lässt sich zusammendrücken und federt zurück.",
         "Luft hat ein Gewicht und macht das Paket schwerer.",
         "Warme Luft ist leichter als kühle Luft und steigt auf.",
         "Luft enthält Sauerstoff, der das Glas härter macht."], { transfer: true }),
      G.kaminofen(),
      G.marmelade(),
      G.fair(),
      t("oxidation", "Lenas Großeltern wohnen direkt am Meer. Ihr Gartenzaun aus Eisen rostet dort viel schneller als Lenas Zaun in Bayern. Erkläre, woran das liegt, und nenne eine Möglichkeit, den Zaun zu schützen.",
        "Eisen rostet, wenn Sauerstoff und Wasser zusammenkommen. Am Meer ist die Luft feucht und salzig – Salz beschleunigt das Rosten. Schützen kann man den Zaun durch Streichen oder Lackieren (oder durch Verzinken): Die Schicht hält Sauerstoff und Wasser vom Eisen fern.",
        ["Eisen rostet, wenn Sauerstoff (Luft) und Wasser (Feuchtigkeit) zusammenkommen",
         "am Meer kommt Salz dazu – Salz beschleunigt das Rosten",
         "ein passender Schutz: streichen, lackieren oder verzinken (die Schicht hält Sauerstoff und Wasser fern)"],
        ["sauerstoff|wasser|feucht|nass|regen",
         "salz",
         "lack|streich|farbe|anstrich|verzink|zink|einfett|einöl|schutzschicht"], { transfer: true })
    ]
  },

  /* ======================= M-Fassung ======================= */
  "nt7-luft-m": {
    id: "nt7-luft-m", zug: "M", thema: "luft", minutes: 45,
    title: "Probe Luft (7M)",
    scope: "Eigenschaften der Luft und Formeln, Windkraft, Verbrennung, Explosionen, Brandschutz, Oxidation mit Formeln, Luftdruck, Forschen",
    items: [
      /* --- Luft – unsichtbar, aber lebenswichtig --- */
      c("luft-modul", "Welche Aussage über die Luft stimmt?",
        ["Luft ist ein Gasgemisch: etwa 78 % Stickstoff (N₂) und 21 % Sauerstoff (O₂).",
         "Luft ist ein Gasgemisch: etwa 78 % Sauerstoff (O₂) und 21 % Stickstoff (N₂).",
         "Luft ist ein Gasgemisch: etwa 78 % Stickstoff (N₂) und 21 % Kohlenstoffdioxid (CO₂).",
         "Luft ist ein einziger Stoff: Sie besteht nur aus Sauerstoff-Molekülen (O₂)."]),
      m("luft-modul", "Welcher Versuch zeigt welche Eigenschaft der Luft? Ordne zu.",
        [["Ein „leeres“ Glas wird kopfüber ins Wasser gedrückt. Das Taschentuch darin bleibt trocken.", "Luft nimmt Raum ein."],
         ["Ein Ball ist nach dem Aufpumpen etwas schwerer als vorher.", "Luft hat ein Gewicht."],
         ["Der Griff einer zugehaltenen Luftpumpe lässt sich hineindrücken und federt zurück.", "Luft lässt sich zusammendrücken."],
         ["Ein Heißluftballon steigt, wenn der Brenner die Luft im Ballon erhitzt.", "Warme Luft ist leichter als kühle Luft."]]),

      /* --- Windkraft: Strom aus bewegter Luft --- */
      G.windrad(),
      t("windkraft-strom", "Beschreibe, wie eine Windkraftanlage aus Wind elektrische Energie macht. Gehe auf Rotor, Getriebe und Generator ein.",
        "Der Wind trifft auf die Rotorblätter und dreht den Rotor. Aus der Bewegungsenergie der Luft wird eine Drehbewegung. Das Getriebe macht aus der langsamen Drehung eine schnelle. Die schnelle Drehung treibt den Generator an. Er erzeugt elektrische Energie, die über den Transformator ins Stromnetz fließt.",
        ["der Wind dreht die Rotorblätter bzw. den Rotor (Bewegungsenergie wird zur Drehbewegung)",
         "das Getriebe macht aus der langsamen Drehung eine schnelle",
         "der Generator erzeugt aus der Drehung elektrische Energie (Strom)"],
        ["rotor|flügel|dreh",
         "getriebe|schneller|schnelle",
         "generator|elektrisch|strom|dynamo"]),

      /* --- Windkraft – pro und contra --- */
      c("windkraft-procontra", "In Bayern gilt für Windräder die 10-H-Regel. Wie weit muss ein 180 m hohes Windrad danach mindestens von Wohnhäusern entfernt sein?",
        ["1800 m", "180 m", "190 m", "18 km"]),

      /* --- Luft und Verbrennung --- */
      t("luft-verbrennung", "Vier Kerzen brennen in Glasrohren (siehe Bild). Die Kerze in Rohr C brennt weiter, die Kerze in Rohr B geht schnell aus. Begründe den Unterschied.",
        "In Rohr C strömt unten durch den Spalt frische Luft nach, oben ziehen die heißen Gase ab – wie bei einem Kamin. Die Flamme bekommt immer neuen Sauerstoff. Rohr B ist unten und oben dicht: Es kommt keine frische Luft nach, der Sauerstoff im Rohr wird verbraucht.",
        ["Rohr C: unten strömt frische Luft (Sauerstoff) nach, oben ziehen die heißen Gase ab",
         "Rohr B: es kommt keine frische Luft nach – der Sauerstoff im Rohr wird verbraucht"],
        ["spalt|unten|nachström|strömt|frische luft|kamin|abziehen|zieht ab",
         "verbraucht|kein|nicht nach|fehlt|dicht|verschlossen|zu wenig|geschlossen"], BILD.rohre),

      /* --- Achtung, explosiv! --- */
      c("achtung-explosiv", "Warum ist ein fast leerer Benzintank gefährlicher als ein randvoller?",
        ["Im fast leeren Tank ist viel Platz für Luft: Benzindampf und Luft bilden ein explosives Gemisch.",
         "Im fast leeren Tank ist das restliche Benzin viel heißer als in einem vollen Tank.",
         "Im randvollen Tank ist mehr Sauerstoff, der das Benzin am Brennen hindert.",
         "Im randvollen Tank ist das Benzin zu kalt, um überhaupt Feuer zu fangen."]),

      /* --- Brände verhindern und löschen --- */
      m("brand-schutz", "Wer löscht, nimmt dem Feuer eine Seite des Feuerdreiecks weg. Ordne jeder Löschmethode zu, was dem Feuer danach fehlt.",
        [["Wasser auf ein brennendes Lagerfeuer gießen", "die Zündtemperatur – das Holz wird abgekühlt"],
         ["eine Löschdecke über einen brennenden Papierkorb legen", "der Sauerstoff – das Feuer erstickt"],
         ["im Wald eine Brandschneise schlagen", "der Brennstoff – das Feuer findet nichts mehr"]]),
      t("brand-schutz", "In einer Pfanne brennt Fett. Erkläre, warum man es auf keinen Fall mit Wasser löschen darf, und nenne die richtige Löschmethode.",
        "Wasser ist schwerer als Fett und sinkt unter das heiße Fett. Dort verdampft es schlagartig. Der Wasserdampf reißt brennendes Fett mit nach oben – es entsteht eine meterhohe Stichflamme, die Fettexplosion. Richtig: Herd ausschalten und einen Deckel auf die Pfanne legen, dann erstickt die Flamme.",
        ["das Wasser sinkt unter das heiße Fett und verdampft schlagartig",
         "der Wasserdampf reißt brennendes Fett mit nach oben: Stichflamme bzw. Fettexplosion",
         "richtig löschen: Herd ausschalten und einen Deckel auf die Pfanne legen (das Feuer erstickt)"],
        ["verdampf|dampf|sinkt|unter das fett",
         "stichflamme|fettexplosion|explo|schleuder|reißt|spritzt|nach oben",
         "deckel|erstick|herd aus|abdecken|zudecken"]),

      /* --- Oxidation --- */
      c("oxidation", "Vier blanke Eisennägel stehen zwei Wochen lang in vier Gläsern (siehe Bild). Nur in B und D rostet der Nagel. Warum bleibt er in Glas C blank?",
        ["Im abgekochten Wasser unter der Ölschicht fehlt der Sauerstoff.",
         "Ohne Salz im Wasser kann Eisen grundsätzlich nicht rosten.",
         "Das Öl überzieht den Nagel mit einer Schicht aus Zink.",
         "Abgekochtes Wasser ist zu sauber, um Eisen anzugreifen."], BILD.naegel),
      m("oxidation", "Ordne jedem Oxid seine Formel zu.",
        [["Kohlenstoffdioxid", "CO₂"], ["Kohlenstoffmonoxid", "CO"], ["Schwefeldioxid", "SO₂"], ["Magnesiumoxid", "MgO"]]),
      t("oxidation", "Die Animation zeigt einen Versuch mit Eisenwolle: Nach dem Glühen sinkt die rechte Seite der Waage. Erkläre die Beobachtung und schreibe die Wortgleichung der Reaktion auf.",
        "Beim Glühen verbindet sich das Eisen mit Sauerstoff aus der Luft. Der Sauerstoff steckt jetzt fest im neuen Stoff, sein Gewicht kommt dazu – deshalb ist das Büschel schwerer. Wortgleichung: Eisen + Sauerstoff → Eisenoxid.",
        ["das Eisen verbindet sich beim Glühen mit Sauerstoff aus der Luft",
         "das Gewicht des gebundenen Sauerstoffs kommt dazu – deshalb ist das Büschel schwerer",
         "Wortgleichung: Eisen + Sauerstoff → Eisenoxid"],
        ["sauerstoff|luft",
         "dazu|zusätzlich|gebunden|bindet|verbind|aufgenommen|nimmt|mehr gewicht|masse",
         "eisenoxid|oxid"], BILD.waage),

      /* --- Der Luftdruck --- */
      t("luftdruck", "Auf einem Berggipfel schraubst du eine leere Plastikflasche fest zu. Im Tal ist sie eingedrückt (siehe Animation). Erkläre das mit dem Luftdruck.",
        "Auf dem Gipfel ist der Luftdruck kleiner als im Tal, weil dort weniger Luft darüber liegt. In der zugeschraubten Flasche ist die dünne Bergluft eingesperrt. Im Tal drückt die Luft von außen stärker als die Luft in der Flasche – deshalb wird die Flasche eingedrückt.",
        ["in der Flasche ist die dünne Bergluft eingesperrt: Der Druck innen ist kleiner (auf dem Berg ist der Luftdruck geringer als im Tal)",
         "im Tal ist der Luftdruck außen größer als in der Flasche – die Luft von außen drückt sie ein"],
        ["berg|gipfel|dünn|weniger luft|weniger teilchen|kleiner|geringer|niedrig",
         "außen|aussen|größer|stärker|höher|mehr teilchen"], BILD.flasche),
      c("luftdruck", "Das Barometer fällt über Nacht von 1022 hPa auf 996 hPa. Welches Wetter ist jetzt wahrscheinlich?",
        ["Es wird wahrscheinlich schlechter: Ein Tief bringt oft Wolken, Wind und Regen.",
         "Es wird wahrscheinlich besser: Ein Tief bringt oft Sonne und trockene Luft.",
         "Es gibt ganz sicher ein Gewitter: Fallender Luftdruck bedeutet immer Blitz und Donner.",
         "Es ändert sich nichts: Der Luftdruck hat mit dem Wetter nichts zu tun."]),

      /* --- Forschen wie die Profis --- */
      G.deutung(),
      c("forschen", "Das Bild zeigt zwei Gasbrenner. Du brauchst deinen Brenner für einige Minuten nicht. Welche Flamme stellst du ein?",
        ["Flamme A: Die gelbe, leuchtende Flamme kann jeder gut sehen.",
         "Flamme A: Die gelbe Flamme ist heißer und hält den Brenner warm.",
         "Flamme B: Die blaue Flamme ist kühler und deshalb ungefährlich.",
         "Flamme B: Die blaue Flamme sieht man im hellen Raum am besten."], BILD.brenner),

      /* --- Transfer --- */
      G.kaminofen(),
      G.marmelade(),
      G.fair(),
      t("achtung-explosiv", "Auf einer Dose Haarspray ist das Gefahrenzeichen mit der Flamme abgedruckt. Erkläre, warum man Haarspray nie in der Nähe einer brennenden Kerze versprühen darf.",
        "Das Zeichen bedeutet: Der Inhalt ist entzündbar, er brennt leicht. Beim Sprühen wird der brennbare Stoff als feiner Nebel in der Luft verteilt. Fein verteilt hat er eine riesige Oberfläche und überall Sauerstoff um sich. Die Kerzenflamme zündet den Nebel – er verbrennt schlagartig als Stichflamme (Verpuffung).",
        ["das Zeichen mit der Flamme bedeutet entzündbar: Der Inhalt brennt leicht",
         "beim Sprühen wird der brennbare Stoff fein in der Luft verteilt (Nebel): große Oberfläche, überall Sauerstoff",
         "die Flamme zündet den Nebel, er verbrennt schlagartig: Stichflamme, Verpuffung oder Explosion"],
        ["entzündbar|entzündlich|brennbar|brennt leicht|leicht brenn|feuer fängt|feuer fangen",
         "fein|nebel|verteilt|oberfläche|tröpfchen|sauerstoff|gemisch",
         "stichflamme|verpuff|explo|schlagartig|auf einmal|feuerball"], { transfer: true }),
      t("windkraft-procontra", "Eine Gemeinde will ein 200 m hohes Windrad bauen. Der geplante Platz liegt auf einem windigen Hügel, aber nur 600 m vom Dorfrand entfernt. Beurteile den Standort: Nenne einen Vorteil und einen Nachteil und schlage einen Kompromiss vor.",
        "Vorteil: Auf dem Hügel weht viel Wind, das Windrad liefert viel Strom ohne Abgase. Nachteil: 600 m sind sehr nah am Dorf – nach der 10-H-Regel wären 2000 m nötig. Die Anwohner werden durch Geräusche und Schatten gestört. Kompromiss: Man sucht einen windigen Platz, der weiter vom Dorf entfernt ist, oder baut ein kleineres Windrad.",
        ["ein passender Vorteil des Standorts (z. B. viel Wind auf dem Hügel, viel Strom ohne Abgase)",
         "ein passender Nachteil (z. B. zu nah am Dorf: Geräusche, Schatten, Landschaftsbild; nach der 10-H-Regel wären 2000 m nötig)",
         "ein sinnvoller Kompromiss (z. B. windiger Platz mit mehr Abstand, kleineres Windrad, Abschalten zu bestimmten Zeiten)"],
        ["wind|strom|abgas|co2|co₂|erneuerbar|klima",
         "nah|abstand|lärm|laut|geräusch|schatten|2000|10-h|10 h|anwohner|landschaft",
         "kompromiss|weiter weg|woanders|andere stelle|anderer platz|kleiner|abschalt|mehr abstand|entfernt"], { transfer: true })
    ]
  }
};
