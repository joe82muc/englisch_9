"use strict";

/**
 * NT 7: Proben 1 bis 4 nach dem LehrplanPLUS, je eine Fassung für R-Klassen (zug "R") und M-Klassen (zug "M").
 * Lösungen und Erwartungshorizont bleiben ausschließlich im Backend. nt7-fragen.js hängt diese Proben an.
 *
 *   thema: Themenbereich der Übersicht (7M/NT/themen.js), unter dem die Probe steht
 *   choice: 1 Punkt · match: 1 Punkt je Paar (jedes Ziel kommt genau einmal vor) · text: 1 Punkt je Kriterium
 *   expected = Musterlösung, criteria = Erwartungshorizont (je Kriterium 1 Punkt), keywords = Stichwortgruppen
 *   für die vorläufige Bewertung ohne KI. Bilder liegen in 7M/NT/assets/proben (eigene Zeichnungen).
 *
 * Aufgaben einer Probe, für die es schon Abgaben gibt, nicht mehr verändern (die Antwortreihenfolge hängt am Text).
 */

const c = (prompt, options, answer, extra) => ({ type: "choice", prompt, options, answer, points: 1, ...(extra || {}) });
const m = (prompt, pairs, extra) => ({ type: "match", prompt, pairs, points: pairs.length, ...(extra || {}) });
const t = (prompt, expected, criteria, keywords, extra) => ({ type: "text", prompt, expected, criteria, keywords, points: criteria.length, ...(extra || {}) });

module.exports = {
  /* ================= Probe 1: Luft und naturwissenschaftliches Arbeiten ================= */
  "nt7-p1-r": {
    id: "nt7-p1-r", zug: "R", thema: "luft", minutes: 40,
    title: "Probe 1 (7R): Luft und naturwissenschaftliches Arbeiten",
    scope: "Luft, Luftdruck, Verbrennung, Brandschutz, Oxidation, Windkraft, Forschen",
    items: [
      c("Wie groß ist ungefähr der Anteil von Sauerstoff in der Luft?", ["21 %", "78 %", "1 %", "50 %"], 0),
      c("Was ist der Luftdruck?", ["Das Gewicht der Luft über uns drückt auf alles.", "Der Wind, der gegen ein Haus bläst.", "Die Wärme der Luft im Sommer.", "Der Anteil von Sauerstoff in der Luft."], 0),
      c("Welche drei Dinge braucht ein Feuer?", ["Brennstoff, Sauerstoff und Zündtemperatur", "Wasser, Wind und Holz", "Rauch, Licht und Kohlenstoffdioxid", "Stickstoff, Wärme und Staub"], 0),
      c("Öl in der Pfanne hat Feuer gefangen. Was ist richtig?", ["Herd ausschalten und einen Deckel auf die Pfanne legen", "Wasser in die Pfanne gießen", "Die Pfanne zum offenen Fenster tragen", "Kräftig in die Flamme pusten"], 0),
      c("Was ist eine Vermutung (Hypothese)?", ["Eine begründete Annahme, die man mit einem Versuch überprüft.", "Das Ergebnis eines Versuchs.", "Eine Liste der Geräte für den Versuch.", "Eine Regel für das Verhalten im Fachraum."], 0),
      m("Ordne jeder Löschmethode ein Beispiel zu.", [["abkühlen", "Wasser auf brennendes Holz"], ["ersticken", "Löschdecke über die Flamme"], ["Brennstoff wegnehmen", "Gashahn zudrehen"]]),
      m("Ordne den Teilen der Windkraftanlage ihre Aufgabe zu.", [["Rotorblätter", "werden vom Wind gedreht"], ["Generator", "erzeugt elektrische Energie"], ["Bremse", "stoppt den Rotor bei Sturm"]]),
      m("Was entsteht? Ergänze die Wortgleichungen.", [["Magnesium + Sauerstoff →", "Magnesiumoxid"], ["Eisen + Sauerstoff →", "Eisenoxid"], ["Kohlenstoff + Sauerstoff →", "Kohlenstoffdioxid"]]),
      m("Ordne die Schritte beim Forschen zu.", [["Vermutung", "Das nehme ich an, bevor ich den Versuch mache."], ["Beobachtung", "Das sehe oder messe ich im Versuch."], ["Auswertung", "Das schließe ich aus dem Ergebnis."]]),
      t("Auf einem hohen Berg ist der Luftdruck geringer als im Tal. Erkläre, warum.",
        "Über dem Berg liegt weniger Luft als über dem Tal. Die Luft darüber wiegt deshalb weniger und drückt schwächer. Darum ist der Luftdruck auf dem Berg geringer.",
        ["über dem Berg liegt weniger Luft", "weniger Luft wiegt weniger (geringeres Gewicht der Luft)", "deshalb drückt sie schwächer – der Luftdruck ist geringer"],
        ["weniger luft|luftschicht|luftsäule", "gewicht|wiegt|masse|schwer", "druck|drückt"]),
      t("Ein Fahrrad steht den ganzen Winter im Freien und rostet. Nenne die zwei Stoffe, die Eisen zum Rosten braucht, und eine Maßnahme, die das Rad schützt.",
        "Eisen rostet, wenn Sauerstoff aus der Luft und Wasser (Feuchtigkeit) dazukommen. Schutz: das Rad trocken unterstellen, lackieren, einölen oder verzinkte Teile verwenden.",
        ["Sauerstoff (Luft)", "Wasser oder Feuchtigkeit", "sinnvolle Schutzmaßnahme (z. B. lackieren, einölen, verzinken, trocken unterstellen)"],
        ["sauerstoff|luft", "wasser|feucht|regen|nass", "lack|öl|oel|fett|verzink|trocken|unterstell|abdeck"]),
      t("In der Schule ertönt der Feueralarm. Nenne drei Regeln, an die du dich hältst.",
        "Ruhe bewahren und den Raum sofort verlassen, Sachen liegen lassen. Fenster und Türen schließen. Den gekennzeichneten Fluchtweg nehmen, keinen Aufzug benutzen und am Sammelplatz bleiben.",
        ["eine richtige Regel (z. B. Ruhe bewahren, Raum sofort verlassen)", "eine zweite richtige Regel (z. B. Fenster und Türen schließen, Sachen liegen lassen)", "eine dritte richtige Regel (z. B. Fluchtweg nehmen, kein Aufzug, zum Sammelplatz gehen)"],
        ["ruhe|ruhig|verlassen|raus", "fenster|tür|sachen|tasche|liegen", "fluchtweg|aufzug|sammelplatz|gebückt|alarm"])
    ]
  },
  "nt7-p1-m": {
    id: "nt7-p1-m", zug: "M", thema: "luft", minutes: 45,
    title: "Probe 1 (7M): Luft und naturwissenschaftliches Arbeiten",
    scope: "Luft, Luftdruck, Verbrennung, Brandschutz, Oxidation mit Gleichungen, Windkraft, Versuche auswerten",
    items: [
      c("Wie erklärt das Teilchenmodell den Luftdruck?", ["Die Luftteilchen stoßen von allen Seiten auf jede Fläche.", "Die Luftteilchen kleben an jeder Fläche fest.", "Die Luftteilchen werden von der Sonne nach unten gedrückt.", "Die Luftteilchen sind am Boden größer als in der Höhe."], 0),
      c("Wofür steht die Formel SO₂?", ["Schwefeldioxid", "Sauerstoff", "Kohlenstoffdioxid", "Stickstoff"], 0),
      c("Mehlstaub in der Luft kann explodieren, ein Klumpen Mehl nicht. Warum?", ["Fein verteilt hat das Mehl eine viel größere Oberfläche und überall Sauerstoff.", "Mehlstaub ist ein anderer Stoff als Mehl.", "Ein Klumpen Mehl hat eine höhere Zündtemperatur als Staub.", "Mehlstaub enthält mehr Wasser."], 0),
      c("Was gilt für einen fairen Versuch?", ["Man verändert nur eine Größe und lässt alles andere gleich.", "Man verändert möglichst viele Größen gleichzeitig.", "Man führt den Versuch nur ein einziges Mal durch.", "Man schreibt nur auf, was zur Vermutung passt."], 0),
      m("Was entsteht bei der Reaktion?", [["Magnesium + Sauerstoff →", "Magnesiumoxid (ein Metalloxid)"], ["Schwefel + Sauerstoff →", "Schwefeldioxid (ein Nichtmetalloxid)"], ["Kohlenstoff + zu wenig Sauerstoff →", "Kohlenstoffmonoxid (ein giftiges Gas)"]]),
      m("Ordne jedem Brand das passende Löschmittel zu.", [["Fett in der Pfanne", "Deckel auflegen"], ["ausgelaufenes Benzin", "Löschschaum"], ["Elektrogerät unter Spannung", "Kohlenstoffdioxid-Löscher"]]),
      m("Welche Energieform liegt an dieser Stelle der Windkraftanlage vor?", [["Wind vor dem Rotor", "Bewegungsenergie der Luft"], ["Rotor und Getriebe", "Bewegungsenergie der Drehung"], ["Ausgang des Generators", "elektrische Energie"]]),
      t("Das Diagramm zeigt, wie lange eine Kerze unter verschieden großen Gläsern brennt. Formuliere einen Je-desto-Satz und erkläre das Ergebnis.",
        "Je größer das Glas ist, desto länger brennt die Kerze. Im großen Glas ist mehr Luft und damit mehr Sauerstoff. Die Kerze geht aus, wenn nicht mehr genug Sauerstoff im Glas ist.",
        ["Je-desto-Satz: je größer das Glas, desto länger brennt die Kerze", "im größeren Glas ist mehr Luft bzw. Sauerstoff", "die Flamme erlischt, wenn zu wenig Sauerstoff übrig ist"],
        ["je größer|je mehr|desto länger", "mehr luft|mehr sauerstoff|sauerstoff", "erlischt|geht aus|verbraucht|knapp|fehlt|zu wenig|nicht genug|nicht mehr genug"],
        { image: "assets/proben/kerze-diagramm.svg", imageAlt: "Säulendiagramm: Brenndauer einer Kerze unter Gläsern mit 250 ml (8 Sekunden), 500 ml (15 Sekunden) und 1000 ml (31 Sekunden)" }),
      t("Eisenwolle wird auf einer Waage verbrannt und ist danach schwerer als vorher. Erkläre das und stelle die Wortgleichung auf.",
        "Das Eisen reagiert mit Sauerstoff aus der Luft. Der Sauerstoff wird gebunden und zählt jetzt zur Masse dazu. Es entsteht Eisenoxid. Wortgleichung: Eisen + Sauerstoff → Eisenoxid.",
        ["Eisen reagiert mit Sauerstoff aus der Luft (Sauerstoff wird gebunden)", "dadurch nimmt die Masse zu", "Wortgleichung: Eisen + Sauerstoff → Eisenoxid"],
        ["sauerstoff|luft", "gebunden|aufgenommen|dazu|masse|schwerer", "eisenoxid|oxid"]),
      t("Kohlenstoff verbrennt vollständig. Schreibe die Formelgleichung auf und benenne die Ausgangsstoffe und das Produkt.",
        "C + O₂ → CO₂. Ausgangsstoffe sind Kohlenstoff und Sauerstoff, das Produkt ist Kohlenstoffdioxid.",
        ["Formelgleichung C + O₂ → CO₂", "Ausgangsstoffe: Kohlenstoff und Sauerstoff", "Produkt: Kohlenstoffdioxid"],
        ["c + o|c+o", "kohlenstoff|sauerstoff", "co2|co₂|kohlenstoffdioxid"]),
      t("Eine Gemeinde will drei Windkraftanlagen bauen. Nenne einen Vorteil und einen Nachteil und erkläre, worauf es beim Standort ankommt.",
        "Vorteil: Wind ist eine erneuerbare Energiequelle, beim Betrieb entsteht kein Kohlenstoffdioxid. Nachteil: Bei Windstille gibt es keinen Strom; Anwohner stören sich an Lärm, Schatten oder dem Landschaftsbild. Der Standort braucht viel Wind und genug Abstand zu Wohnhäusern und Schutzgebieten.",
        ["sinnvoller Vorteil (z. B. erneuerbar, kein CO₂ im Betrieb)", "sinnvoller Nachteil (z. B. abhängig vom Wind, Lärm, Schatten, Vögel, Landschaft)", "Standortkriterium (z. B. viel Wind, Abstand zu Häusern, Naturschutz)"],
        ["erneuerbar|kein co|sauber|klima|umwelt", "windstille|lärm|schatten|vögel|landschaft|abhängig", "wind|abstand|standort|naturschutz|höhe"]),
      t("Erkläre, warum eine Brandschutztür ein Feuer aufhalten kann und warum man sie nie mit einem Keil offen halten darf.",
        "Die geschlossene Tür trennt den Brand vom Rest des Gebäudes: Feuer, Hitze und Rauch kommen nicht weiter, und das Feuer bekommt weniger Luft und findet keinen neuen Brennstoff. Mit einem Keil kann die Tür im Brandfall nicht zufallen – Feuer und Rauch breiten sich dann ungehindert aus.",
        ["die Tür hält Feuer, Hitze und Rauch zurück (trennt Abschnitte)", "das Feuer bekommt weniger Luft bzw. findet keinen neuen Brennstoff", "festgekeilt kann sie nicht schließen – Feuer und Rauch breiten sich aus"],
        ["rauch|hitze|feuer|aufhalten|trennt", "luft|sauerstoff|brennstoff", "keil|offen|schließen|zufallen|ausbreiten"])
    ]
  },

  /* ================= Probe 2: Atome und Tiere ================= */
  "nt7-p2-r": {
    id: "nt7-p2-r", zug: "R", thema: "tiere", minutes: 40,
    title: "Probe 2 (7R): Atome und Tiere",
    scope: "Atommodelle, Atombau, Periodensystem, Wirbeltierklassen, Fortbewegung",
    items: [
      c("Von wem stammt die Idee, dass alles aus kleinsten, unteilbaren Teilchen besteht?", ["Demokrit", "Rutherford", "Ohm", "Volta"], 0),
      c("Was zeigte Rutherfords Versuch mit der Goldfolie?", ["Ein Atom ist fast leer und hat in der Mitte einen winzigen Kern.", "Ein Atom ist eine massive Kugel ohne Hohlraum.", "Atome kann man mit dem bloßen Auge sehen.", "Gold besteht nicht aus Atomen."], 0),
      c("Welcher Forscher beschrieb um 1808 die Atome als winzige, massive Kugeln?", ["John Dalton", "Ernest Rutherford", "Demokrit", "Alessandro Volta"], 0),
      c("Welche Wirbeltiere sind gleichwarm?", ["Vögel und Säugetiere", "Fische und Amphibien", "Reptilien und Fische", "Amphibien und Reptilien"], 0),
      c("Zu welcher Klasse gehört die Fledermaus?", ["Säugetiere", "Vögel", "Reptilien", "Amphibien"], 0),
      m("Ordne jedem Teilchen seine Eigenschaft zu.", [["Proton", "positiv geladen, im Atomkern"], ["Neutron", "ungeladen, im Atomkern"], ["Elektron", "negativ geladen, in der Atomhülle"]]),
      m("Ordne jeder Klasse die Körperbedeckung zu.", [["Fische", "Schuppen mit Schleimschicht"], ["Amphibien", "nackte, feuchte Haut"], ["Reptilien", "trockene Hornschuppen"], ["Vögel", "Federn"], ["Säugetiere", "Haare (Fell)"]]),
      m("Ordne jedes Tier seiner Klasse zu.", [["Bachforelle", "Fisch"], ["Grasfrosch", "Amphibie"], ["Zauneidechse", "Reptil"], ["Amsel", "Vogel"], ["Igel", "Säugetier"]]),
      m("Ordne jeder Stoffgruppe ein Beispiel zu.", [["Edelgas", "Helium"], ["Metall", "Aluminium"], ["Nichtmetall", "Chlor"]]),
      t("Ein Kohlenstoff-Atom hat die Ordnungszahl 6 und die Massenzahl 12. Wie viele Protonen, Neutronen und Elektronen hat es?",
        "6 Protonen, 6 Neutronen (12 − 6) und 6 Elektronen.",
        ["6 Protonen", "6 Neutronen", "6 Elektronen"],
        ["6 proton|sechs proton|protonen: 6|protonen 6", "6 neutron|sechs neutron|neutronen: 6|neutronen 6", "6 elektron|sechs elektron|elektronen: 6|elektronen 6"]),
      t("Nenne zwei Merkmale, die alle Wirbeltiere gemeinsam haben.",
        "Alle Wirbeltiere haben ein Innenskelett mit einer Wirbelsäule. Ihr Körper ist in Kopf, Rumpf und Schwanz gegliedert.",
        ["Innenskelett mit Wirbelsäule", "Körper in Kopf, Rumpf und Schwanz gegliedert (auch richtig: Gehirn und Rückenmark, geschützt von Schädel und Wirbelsäule)"],
        ["wirbelsäule|innenskelett|skelett", "kopf|rumpf|schwanz|gegliedert|gehirn|rückenmark"]),
      t("Beschreibe an zwei Beispielen, wie der Körper eines Fisches an das Leben im Wasser angepasst ist.",
        "Der Körper ist stromlinienförmig, so gleitet der Fisch leicht durch das Wasser. Mit der Schwanzflosse treibt er sich an, die anderen Flossen steuern. Die Schwimmblase lässt ihn im Wasser schweben, mit Kiemen atmet er.",
        ["erste Angepasstheit richtig genannt (z. B. Stromlinienform, Flossen, Schwimmblase, Kiemen, Schleimschicht)", "zweite Angepasstheit richtig genannt", "bei mindestens einer erklärt, wozu sie dient"],
        ["stromlinien|spindel|form", "flosse|schwimmblase|kiemen|schleim", "gleitet|antrieb|steuern|schweben|atmet|widerstand"])
    ]
  },
  "nt7-p2-m": {
    id: "nt7-p2-m", zug: "M", thema: "tiere", minutes: 45,
    title: "Probe 2 (7M): Atome und Tiere",
    scope: "Atommodelle und ihre Grenzen, Atombau, Periodensystem, Wirbeltierklassen, Fortbewegung",
    items: [
      c("In welcher Reihenfolge entstanden die Atommodelle?", ["Demokrit – Dalton – Rutherford", "Dalton – Rutherford – Demokrit", "Rutherford – Demokrit – Dalton", "Demokrit – Rutherford – Dalton"], 0),
      c("Worin unterscheiden sich die Isotope eines Elements?", ["in der Zahl der Neutronen", "in der Zahl der Protonen", "in der Zahl der Elektronen", "im Elementsymbol"], 0),
      c("Warum reagieren Edelgase fast nie mit anderen Stoffen?", ["Ihre äußere Schale ist voll besetzt.", "Sie haben keine Elektronen.", "Sie sind zu leicht.", "Sie bestehen nur aus Neutronen."], 0),
      c("Was bedeutet „wechselwarm“?", ["Die Körpertemperatur ändert sich mit der Temperatur der Umgebung.", "Das Tier wechselt im Winter sein Fell.", "Die Körpertemperatur bleibt immer gleich.", "Das Tier lebt abwechselnd an Land und im Wasser."], 0),
      m("Rutherfords Versuch: Welcher Schluss gehört zu welcher Beobachtung?", [["Ganz wenige Teilchen prallen zurück.", "Der Kern ist winzig, enthält aber fast die ganze Masse."], ["Fast alle Teilchen fliegen gerade durch die Folie.", "Das Atom ist fast leer."], ["Wenige Teilchen werden abgelenkt.", "Der Kern ist positiv geladen und stößt die positiven Teilchen ab."]]),
      m("Ordne jeder Klasse ihre Fortpflanzung zu.", [["Fische", "Laich im Wasser, die Jungen atmen wie die Eltern mit Kiemen"], ["Amphibien", "Laich im Wasser, aus Larven mit Kiemen werden Tiere mit Lungen"], ["Reptilien", "Eier mit weicher Schale an Land"], ["Vögel", "Eier mit Kalkschale, werden ausgebrütet"], ["Säugetiere", "Junge werden lebend geboren und gesäugt"]]),
      m("Angepasst an die Fortbewegung: Wozu dient das Merkmal?", [["Stromlinienform der Forelle", "wenig Widerstand im Wasser"], ["hohle Knochen des Mäusebussards", "geringes Gewicht zum Fliegen"], ["lange Hinterbeine des Grasfroschs", "weite Sprünge"]]),
      t("Natrium hat die Ordnungszahl 11 und die Massenzahl 23. Bestimme die Zahl der Protonen, Elektronen und Neutronen und erkläre, wie du die Neutronenzahl berechnest.",
        "11 Protonen und 11 Elektronen (so viele wie die Ordnungszahl). Neutronen: Massenzahl minus Ordnungszahl, also 23 − 11 = 12 Neutronen.",
        ["11 Protonen und 11 Elektronen", "12 Neutronen", "Rechenweg: Massenzahl minus Ordnungszahl"],
        ["11 proton|11 elektron|elf", "12 neutron|zwölf|12", "massenzahl|minus|23 - 11|23-11|23 − 11"]),
      t("Erkläre, was ein Modell in den Naturwissenschaften ist, und begründe an einem Beispiel, warum die Atommodelle immer wieder verändert wurden.",
        "Ein Modell ist eine vereinfachte Vorstellung von etwas, das man nicht direkt sehen kann. Es erklärt bestimmte Beobachtungen. Passt eine neue Beobachtung nicht dazu, wird das Modell erweitert oder ersetzt. Beispiel: Nach dem Streuversuch reichte Daltons Kugelmodell nicht mehr aus, Rutherford entwickelte das Kern-Hülle-Modell.",
        ["Modell = vereinfachte Vorstellung (nicht die Wirklichkeit selbst)", "neue Beobachtungen oder Versuche passen nicht zum alten Modell – es wird erweitert oder ersetzt", "passendes Beispiel (z. B. Streuversuch: vom Kugelmodell zum Kern-Hülle-Modell)"],
        ["vereinfacht|vorstellung|bild|nicht die wirklichkeit", "beobachtung|versuch|erweiter|ersetz|veränder|verbesser|angepasst", "dalton|rutherford|streuversuch|kugelmodell|kern"]),
      t("Ein Tier hat trockene, schuppige Haut und atmet sein Leben lang mit Lungen. Morgens liegt es in der Sonne, bis sein Körper warm genug ist. Seine Eier vergräbt es im warmen Boden. Ordne es einer Wirbeltierklasse zu und begründe mit zwei Merkmalen.",
        "Es ist ein Reptil. Dafür sprechen die trockene Haut mit Hornschuppen und dass es wechselwarm ist: Es muss sich in der Sonne aufwärmen. Dazu passen die Lungenatmung und die Eier, die an Land abgelegt werden.",
        ["Klasse: Reptil", "erstes passendes Merkmal als Begründung", "zweites passendes Merkmal als Begründung"],
        ["reptil|kriechtier", "schuppen|haut|trocken", "wechselwarm|sonne|aufwärm|eier|land|boden|lunge"]),
      t("Der Arm des Menschen, der Flügel eines Vogels und die Flosse eines Wals bestehen aus den gleichen Knochen, sehen aber verschieden aus. Erkläre das und nenne für zwei der drei Gliedmaßen, wozu ihre Form passt.",
        "Alle drei haben den gleichen Grundbauplan: Oberarmknochen, Elle und Speiche, Handknochen. Die Form ist an die Fortbewegung im jeweiligen Lebensraum angepasst: Der Flügel ist leicht und trägt Federn zum Fliegen, die Flosse ist kurz und breit zum Schwimmen, der Arm greift.",
        ["gleicher Grundbauplan bzw. gleiche Knochen genannt", "Form ist an Aufgabe/Fortbewegung/Lebensraum angepasst", "für zwei Gliedmaßen richtig genannt, wozu die Form passt (z. B. Flügel – fliegen, Flosse – schwimmen, Arm – greifen)"],
        ["bauplan|oberarm|elle|speiche|gleiche knochen", "angepasst|anpassung|lebensraum|aufgabe", "fliegen|schwimmen|greifen|flügel|flosse"]),
      t("Chlor steht in der 7. Hauptgruppe und in der 3. Periode. Was sagt das über seine Elektronen aus? Wie viele Elektronen fehlen dem Chlor-Atom zur voll besetzten Außenschale?",
        "Chlor hat 7 Außenelektronen (Hauptgruppe) und 3 Schalen (Periode). Eine voll besetzte Außenschale hat 8 Elektronen – dem Chlor-Atom fehlt also 1 Elektron.",
        ["7 Außenelektronen", "3 Schalen", "1 Elektron fehlt (8 − 7)"],
        ["7 außen|sieben außen|7 elektronen|außenelektronen", "3 schalen|drei schalen|schalen", "1 elektron|ein elektron|eines|eins|fehlt 1|8 - 7|8-7|8 − 7"])
    ]
  },

  /* ================= Probe 3: Atmung, Blut, Herz und Kreislauf ================= */
  "nt7-p3-r": {
    id: "nt7-p3-r", zug: "R", thema: "mensch", minutes: 40,
    title: "Probe 3 (7R): Atmung, Blut, Herz und Kreislauf",
    scope: "Atmungsorgane, Gasaustausch, Blutbestandteile, Herz, Blutkreislauf, Gesunderhaltung",
    items: [
      c("Wo findet in der Lunge der Gasaustausch statt?", ["in den Lungenbläschen", "in der Luftröhre", "im Kehlkopf", "in der Nasenhöhle"], 0),
      c("In welcher Schleife des Blutkreislaufs nimmt das Blut Sauerstoff auf?", ["in der Lungenschleife", "in der Körperschleife", "in beiden Schleifen", "in keiner – das geschieht im Herzen"], 0),
      c("Was gibt der Puls an?", ["wie oft das Herz in einer Minute schlägt", "wie viel Blut ein Mensch hat", "wie viel Sauerstoff in der Luft ist", "wie tief man einatmet"], 0),
      c("Was sind Arterien?", ["Blutgefäße, die vom Herzen wegführen", "Blutgefäße, die zum Herzen hinführen", "die kleinsten Blutgefäße", "die Ventile im Herzen"], 0),
      c("Was macht das Zwerchfell beim Einatmen?", ["Es zieht sich zusammen und wird flach.", "Es wölbt sich nach oben.", "Es bewegt sich nicht.", "Es füllt sich mit Luft."], 0),
      m("Der Weg der Atemluft: Ordne die Stationen in der richtigen Reihenfolge zu.", [["1. Station", "Nasenhöhle"], ["2. Station", "Luftröhre"], ["3. Station", "Bronchien"], ["4. Station", "Lungenbläschen"]]),
      m("Ordne jedem Blutbestandteil seine Aufgabe zu.", [["Blutplasma", "transportiert Nährstoffe und Abfallstoffe"], ["rote Blutkörperchen", "transportieren Sauerstoff"], ["weiße Blutkörperchen", "wehren Krankheitserreger ab"], ["Blutplättchen", "verschließen Wunden"]]),
      m("Herz und Blutgefäße: Was gehört zusammen?", [["linke Herzkammer", "pumpt Blut in den Körper"], ["rechte Herzkammer", "pumpt Blut in die Lunge"], ["Herzklappen", "lassen das Blut nur in eine Richtung fließen"], ["Kapillaren", "hier werden Stoffe ausgetauscht"]]),
      t("Erkläre, was beim Gasaustausch in der Lunge geschieht.",
        "Sauerstoff wandert aus der Luft im Lungenbläschen durch die dünne Wand in das Blut. Kohlenstoffdioxid wandert aus dem Blut in das Lungenbläschen und wird ausgeatmet.",
        ["Sauerstoff geht aus der Luft ins Blut", "Kohlenstoffdioxid geht aus dem Blut in die Luft", "durch die dünne Wand der Lungenbläschen bzw. in die Kapillaren"],
        ["sauerstoff", "kohlenstoffdioxid|co2|co₂", "wand|dünn|kapillar|blut"]),
      t("Beschreibe den Weg des Blutes in der Körperschleife – vom Herzen in den Körper und wieder zurück.",
        "Die linke Herzkammer pumpt das sauerstoffreiche Blut in die Arterien. In den Kapillaren der Organe gibt es Sauerstoff und Nährstoffe ab. Über die Venen fließt das sauerstoffarme Blut zurück zum rechten Vorhof.",
        ["Start in der linken Herzkammer, über die Arterien in den Körper", "in den Kapillaren Abgabe von Sauerstoff (Stoffaustausch)", "über die Venen zurück zum Herzen (rechter Vorhof)"],
        ["linke|arterie", "kapillar|sauerstoff|organ", "vene|zurück|rechte"]),
      t("Nenne zwei Dinge, die Herz und Kreislauf schaden, und zwei Dinge, die sie gesund halten.",
        "Schädlich sind zum Beispiel Rauchen, zu fettes und zu süßes Essen, Bewegungsmangel und Dauerstress. Gesund halten regelmäßige Bewegung, ausgewogene Ernährung, genug Schlaf und nicht zu rauchen.",
        ["erster Risikofaktor", "zweiter Risikofaktor", "erste Schutzmaßnahme", "zweite Schutzmaßnahme"],
        ["rauch|nikotin", "fett|süß|übergewicht|bewegungsmangel|stress|alkohol", "bewegung|sport", "ernährung|obst|gemüse|schlaf|nicht rauchen"])
    ]
  },
  "nt7-p3-m": {
    id: "nt7-p3-m", zug: "M", thema: "mensch", minutes: 45,
    title: "Probe 3 (7M): Atmung, Blut, Herz und Kreislauf",
    scope: "Atmungsorgane, Gasaustausch, Zellatmung, Blut, Herz, Blutkreislauf, Belastung und Gesunderhaltung",
    items: [
      c("Wie ist die Ausatemluft ungefähr zusammengesetzt?", ["etwa 17 % Sauerstoff und 4 % Kohlenstoffdioxid", "kein Sauerstoff und 21 % Kohlenstoffdioxid", "21 % Sauerstoff und 0,04 % Kohlenstoffdioxid", "50 % Sauerstoff und 50 % Kohlenstoffdioxid"], 0),
      c("Welche Wortgleichung beschreibt die Zellatmung?", ["Traubenzucker + Sauerstoff → Kohlenstoffdioxid + Wasser", "Kohlenstoffdioxid + Wasser → Traubenzucker + Sauerstoff", "Traubenzucker + Kohlenstoffdioxid → Sauerstoff + Wasser", "Sauerstoff + Wasser → Traubenzucker"], 0),
      c("Welches Blut fließt in der Lungenarterie?", ["sauerstoffarmes Blut vom Herzen zur Lunge", "sauerstoffreiches Blut vom Herzen zur Lunge", "sauerstoffreiches Blut von der Lunge zum Herzen", "sauerstoffarmes Blut von der Lunge in den Körper"], 0),
      c("Warum ist die Wand der linken Herzkammer dicker als die der rechten?", ["Sie pumpt das Blut durch den ganzen Körper.", "Sie pumpt das Blut nur in die Lunge.", "In ihr sammelt sich das meiste Fett.", "Sie muss kein Blut pumpen."], 0),
      m("Bau und Aufgabe: Was gehört zusammen?", [["Flimmerhärchen", "befördern Staub und Schleim nach oben"], ["Knorpelspangen", "halten die Luftröhre offen"], ["Kehldeckel", "verschließt beim Schlucken die Luftröhre"], ["Lungenbläschen", "bieten eine riesige Oberfläche für den Gasaustausch"]]),
      m("Ordne jedem Blutgefäß Bau und Aufgabe zu.", [["Arterie", "dicke, elastische Wand – führt vom Herzen weg"], ["Vene", "mit Klappen – führt zum Herzen hin"], ["Kapillare", "hauchdünne Wand – Stoffaustausch"]]),
      m("Ein Blutbild lesen: Was bedeutet der Befund?", [["zu wenige rote Blutkörperchen", "weniger Sauerstoff – man ist schnell müde"], ["sehr viele weiße Blutkörperchen", "der Körper bekämpft eine Infektion"], ["zu wenige Blutplättchen", "Wunden bluten länger"]]),
      t("Das Diagramm zeigt den Puls eines Schülers in Ruhe, direkt nach einem Sprint und drei Minuten später. Beschreibe den Verlauf und erkläre, warum der Puls bei Belastung steigt.",
        "In Ruhe liegt der Puls bei 72, nach dem Sprint bei 148, nach drei Minuten Pause wieder bei 88 Schlägen pro Minute. Bei Belastung brauchen die Muskeln mehr Energie und damit mehr Sauerstoff. Das Herz schlägt schneller, damit mehr Blut mit Sauerstoff zu den Muskeln kommt und das Kohlenstoffdioxid abtransportiert wird.",
        ["Verlauf beschrieben: Puls steigt bei Belastung stark an und sinkt in der Pause wieder", "Muskeln brauchen mehr Energie bzw. Sauerstoff", "das Herz pumpt schneller, um mehr Blut (Sauerstoff) zu liefern bzw. Kohlenstoffdioxid abzutransportieren"],
        ["steigt|höher|sinkt|148|72|88", "sauerstoff|energie|muskel", "schneller|pumpt|mehr blut|transport"],
        { image: "assets/proben/puls-diagramm.svg", imageAlt: "Säulendiagramm Puls in Schlägen pro Minute: in Ruhe 72, direkt nach dem Sprint 148, nach drei Minuten Pause 88" }),
      t("Im Glasglocken-Modell stehen die Glasglocke für den Brustkorb, ein Luftballon für die Lunge und eine Gummihaut für das Zwerchfell. Erkläre daran das Einatmen und nenne eine Sache, die das Modell nicht richtig zeigt.",
        "Zieht man die Gummihaut nach unten, wird der Raum in der Glocke größer und der Ballon füllt sich mit Luft – so wie die Lunge, wenn das Zwerchfell flach wird. Das Modell zeigt aber keine Rippen: Der Brustkorb bewegt sich nicht, und es gibt nur einen Ballon statt zwei Lungenflügeln.",
        ["Gummihaut (Zwerchfell) nach unten → Raum wird größer", "Ballon (Lunge) füllt sich mit Luft – Einatmen", "Grenze des Modells genannt (z. B. keine Rippen/Rippenatmung, nur ein Ballon, starre Glocke)"],
        ["unten|zieht|flach|größer", "füllt|luft|einatmen|dehnt", "rippen|brustkorb|starr|nur ein|zwei lungen|modell"]),
      t("Beschreibe den Weg eines roten Blutkörperchens von der rechten Herzkammer bis zurück in den rechten Vorhof. Gib an, wo es Sauerstoff aufnimmt und wo es ihn abgibt.",
        "Rechte Herzkammer → Lungenarterie → Lunge: Dort nimmt es Sauerstoff auf. Lungenvene → linker Vorhof → linke Herzkammer → Körperarterie → Kapillaren der Organe: Dort gibt es den Sauerstoff ab. Über die Körpervenen kommt es zurück in den rechten Vorhof.",
        ["Lungenschleife: rechte Kammer – Lungenarterie – Lunge – Lungenvene – linker Vorhof", "Sauerstoffaufnahme in der Lunge", "Körperschleife: linke Kammer – Arterien – Kapillaren – Venen – rechter Vorhof", "Sauerstoffabgabe in den Kapillaren des Körpers"],
        ["lungenarterie|lunge", "aufnimmt|nimmt|aufnahme", "linke|arterie|vene", "abgibt|gibt|abgabe|kapillar"]),
      t("Begründe, warum Rauchen dem Herz-Kreislauf-System schadet: Nenne zwei Wirkungen des Rauchens und eine mögliche Folge für Herz oder Kreislauf.",
        "Nikotin verengt die Blutgefäße und lässt das Herz schneller schlagen, der Blutdruck steigt. Kohlenstoffmonoxid aus dem Rauch besetzt rote Blutkörperchen, die dann keinen Sauerstoff mehr transportieren. Auf Dauer lagern sich Stoffe in den Arterien ab – das Risiko für einen Herzinfarkt steigt.",
        ["erste richtige Wirkung (z. B. Nikotin verengt Gefäße, Puls und Blutdruck steigen)", "zweite richtige Wirkung (z. B. Kohlenstoffmonoxid blockiert rote Blutkörperchen)", "Folge für Herz oder Kreislauf benannt (z. B. weniger Sauerstoff, Ablagerungen, Herzinfarkt)"],
        ["nikotin|verengt|gefäße|blutdruck|puls", "kohlenstoffmonoxid|kohlenmonoxid|monoxid|monooxid|co |rote blutkörperchen", "sauerstoff|ablagerung|herzinfarkt|schlaganfall|verstopf"])
    ]
  },

  /* ================= Probe 4: Elektrizität ================= */
  "nt7-p4-r": {
    id: "nt7-p4-r", zug: "R", thema: "strom", minutes: 40,
    title: "Probe 4 (7R): Elektrizität",
    scope: "Stromkreis, Schaltzeichen, Wirkungen des Stroms, Spannung, Stromstärke, Widerstand, Sicherheit",
    items: [
      c("Wann fließt elektrischer Strom?", ["nur im geschlossenen Stromkreis", "immer, wenn eine Batterie in der Nähe ist", "nur im offenen Stromkreis", "nur wenn eine Lampe fehlt"], 0),
      c("In welcher Einheit misst man die Spannung?", ["Volt (V)", "Ampere (A)", "Ohm (Ω)", "Gramm (g)"], 0),
      c("In welcher Einheit misst man die Stromstärke?", ["Ampere (A)", "Volt (V)", "Ohm (Ω)", "Meter (m)"], 0),
      c("Welcher Stoff leitet den elektrischen Strom?", ["Kupfer", "Glas", "Gummi", "trockenes Holz"], 0),
      c("Was macht die Sicherung im Sicherungskasten?", ["Sie unterbricht den Stromkreis, wenn die Stromstärke zu groß wird.", "Sie macht den Strom stärker.", "Sie speichert Strom für später.", "Sie schaltet das Licht ein."], 0),
      m("Ordne den Schaltzeichen im Bild ihre Bedeutung zu.", [["Zeichen 1", "Glühlampe"], ["Zeichen 2", "Spannungsquelle"], ["Zeichen 3", "offener Schalter"], ["Zeichen 4", "Stromstärke-Messgerät"]],
        { image: "assets/proben/schaltzeichen.svg", imageAlt: "Vier nummerierte Schaltzeichen: 1 Kreis mit Kreuz, 2 langer und kurzer Strich, 3 Linie mit schräg abgehobenem Stück, 4 Kreis mit A" }),
      m("Ordne jeder Wirkung des Stroms ein Gerät zu.", [["Wärmewirkung", "Toaster"], ["Lichtwirkung", "LED-Lampe"], ["magnetische Wirkung", "Elektromagnet am Schrottkran"], ["chemische Wirkung", "Akku beim Laden"]]),
      m("Was bedeuten die drei Größen?", [["Spannung", "wie stark die Elektronen angetrieben werden"], ["Stromstärke", "wie viele Elektronen pro Sekunde fließen"], ["Widerstand", "wie stark der Strom gebremst wird"]]),
      t("An einem Draht liegt eine Spannung von 6 V. Es fließt ein Strom von 0,5 A. Berechne den Widerstand und schreibe die Rechnung auf.",
        "R = U : I = 6 V : 0,5 A = 12 Ω.",
        ["Ansatz R = U : I", "Werte richtig eingesetzt (6 V : 0,5 A)", "Ergebnis 12 Ω mit Einheit"],
        ["u : i|u/i|u:i|spannung durch|geteilt", "6|0,5|0.5", "12 ω|12ω|12 ohm|= 12|=12"]),
      t("In einer Reihenschaltung mit zwei Lampen brennt eine Lampe durch. Was passiert mit der anderen? Begründe.",
        "Die andere Lampe geht auch aus. In der Reihenschaltung gibt es nur einen Weg für den Strom. Ist er an einer Stelle unterbrochen, ist der ganze Stromkreis offen.",
        ["die zweite Lampe erlischt ebenfalls", "der Stromkreis ist unterbrochen (offen)", "es gibt nur einen Weg für den Strom"],
        ["aus|erlischt|dunkel|leuchtet nicht", "unterbrochen|offen", "ein weg|einen weg|hintereinander|reihe"]),
      t("Nenne drei Regeln für den sicheren Umgang mit Strom und begründe eine davon.",
        "Stecker immer am Stecker herausziehen, nie am Kabel. Keine elektrischen Geräte mit nassen Händen oder am Wasser benutzen. Nichts in Steckdosen stecken und beschädigte Kabel nicht verwenden. Begründung: Wasser und der menschliche Körper leiten Strom – ein Stromschlag an der Steckdose ist lebensgefährlich.",
        ["erste richtige Regel", "zweite richtige Regel", "dritte richtige Regel", "eine Regel fachlich richtig begründet"],
        ["stecker|kabel", "wasser|nass|bad", "steckdose|kaputt|beschädigt|defekt", "leitet|stromschlag|lebensgefahr|gefährlich|brand"])
    ]
  },
  "nt7-p4-m": {
    id: "nt7-p4-m", zug: "M", thema: "strom", minutes: 45,
    title: "Probe 4 (7M): Elektrizität",
    scope: "Stromkreise, Reihen- und Parallelschaltung, Messen, Ohm'sches Gesetz, Leiterwiderstand, Sicherheit",
    items: [
      c("Zwei gleiche Lampen sind parallel an eine Batterie geschaltet. Wie groß ist die Spannung an jeder Lampe?", ["so groß wie die Spannung der Batterie", "halb so groß wie die Spannung der Batterie", "doppelt so groß wie die Spannung der Batterie", "null"], 0),
      c("In einer Parallelschaltung fließen durch die beiden Zweige 0,2 A und 0,3 A. Wie groß ist die Gesamtstromstärke?", ["0,5 A", "0,1 A", "0,06 A", "0,3 A"], 0),
      c("An einem Draht wird die Spannung verdoppelt, seine Temperatur bleibt gleich. Was passiert mit der Stromstärke?", ["Sie wird doppelt so groß.", "Sie wird halb so groß.", "Sie bleibt gleich.", "Sie wird null."], 0),
      c("Wie wird ein Stromstärke-Messgerät angeschlossen?", ["in Reihe – der Strom fließt durch das Messgerät", "parallel zur Lampe", "nur an den Pluspol der Batterie", "gar nicht an den Stromkreis"], 0),
      m("Wofür nutzt man das Gerät? Die elektrische Energie wird umgewandelt in …", [["Wasserkocher", "Wärme"], ["LED", "Licht (Strahlungsenergie)"], ["Elektromotor", "Bewegungsenergie"], ["Akku beim Laden", "chemische Energie"]]),
      m("Wie ändert sich der Widerstand eines Metalldrahts – und warum?", [["Der Draht wird länger.", "größerer Widerstand: Die Elektronen stoßen öfter an."], ["Der Draht wird dicker.", "kleinerer Widerstand: Die Elektronen haben mehr Platz."], ["Der Draht wird heißer.", "größerer Widerstand: Die Atome bewegen sich stärker."]]),
      m("Ordne jeder Schutzeinrichtung ihre Aufgabe zu.", [["Isolierung", "verhindert, dass man den blanken Draht berührt"], ["Sicherung", "schaltet ab, wenn die Stromstärke zu groß wird"], ["Kindersicherung in der Steckdose", "verhindert, dass etwas in die Steckdose gesteckt wird"]]),
      t("Das Diagramm zeigt Spannung und Stromstärke für zwei Drähte A und B. Welcher Draht hat den größeren Widerstand? Begründe mit dem Diagramm und berechne beide Widerstände.",
        "Draht B hat den größeren Widerstand: Bei gleicher Spannung fließt durch B viel weniger Strom (seine Gerade verläuft flacher). Draht A: R = 6 V : 1,2 A = 5 Ω. Draht B: R = 6 V : 0,3 A = 20 Ω.",
        ["Draht B hat den größeren Widerstand", "Begründung: bei gleicher Spannung kleinere Stromstärke (flachere Gerade)", "Widerstand von A richtig berechnet: 5 Ω", "Widerstand von B richtig berechnet: 20 Ω"],
        ["draht b|b hat|b ist", "weniger strom|kleinere strom|flacher|gleicher spannung", "5 ω|5ω|5 ohm|= 5|=5", "20 ω|20ω|20 ohm|= 20|=20"],
        { image: "assets/proben/kennlinien.svg", imageAlt: "Diagramm mit zwei Geraden durch den Ursprung. Draht A: bei 2 Volt 0,4 Ampere, bei 4 Volt 0,8 Ampere, bei 6 Volt 1,2 Ampere. Draht B: bei 2 Volt 0,1 Ampere, bei 4 Volt 0,2 Ampere, bei 6 Volt 0,3 Ampere." }),
      t("Ein Heizdraht hat einen Widerstand von 46 Ω und wird an 230 V angeschlossen. Berechne die Stromstärke und schreibe die Rechnung auf.",
        "I = U : R = 230 V : 46 Ω = 5 A.",
        ["Ansatz I = U : R", "Werte richtig eingesetzt (230 V : 46 Ω)", "Ergebnis 5 A mit Einheit"],
        ["u : r|u/r|u:r|spannung durch|geteilt", "230|46", "5 a|5a|= 5|fünf"]),
      t("Im Schaltplan sind zwei Lampen in Reihe an eine Batterie mit 6 V angeschlossen. An Lampe 1 misst man 2,5 V. Berechne die Spannung an Lampe 2 und nenne die Regel, die du benutzt.",
        "U₂ = 6 V − 2,5 V = 3,5 V. Regel: In der Reihenschaltung ergeben die Teilspannungen zusammen die Spannung der Quelle (Maschenregel).",
        ["Rechnung 6 V − 2,5 V", "Ergebnis 3,5 V", "Regel: Teilspannungen addieren sich zur Gesamtspannung (Maschenregel)"],
        ["6|2,5|2.5|minus", "3,5|3.5", "teilspannung|zusammen|addier|summe|maschen"],
        { image: "assets/proben/reihenschaltung.svg", imageAlt: "Schaltplan: Batterie mit 6 Volt, zwei Lampen in Reihe, an Lampe 1 ein Spannungsmessgerät mit der Anzeige 2,5 Volt, an Lampe 2 ein Spannungsmessgerät mit Fragezeichen" }),
      t("Die Steckdosen in einem Haus sind parallel geschaltet. Begründe mit zwei Argumenten, warum das sinnvoll ist, und sage, was in einer Reihenschaltung anders wäre.",
        "An jeder Steckdose liegt die volle Spannung von 230 V – in einer Reihenschaltung würde sie sich auf die Geräte aufteilen. Außerdem arbeitet jedes Gerät unabhängig: Schaltet man eines aus oder geht es kaputt, laufen die anderen weiter.",
        ["an jeder Steckdose liegt die volle Spannung", "Geräte sind unabhängig voneinander (eines aus – die anderen laufen weiter)", "Reihenschaltung: Die Spannung würde sich aufteilen bzw. alle Geräte fielen zusammen aus"],
        ["volle spannung|230|gleiche spannung", "unabhängig|weiter|einzeln|ausschalten", "aufteilen|teilt|teilen|alle aus|fallen aus|unterbrochen"]),
      t("Ein eingeschalteter Föhn fällt in die volle Badewanne. Erkläre die Gefahr und nenne die Schutzeinrichtung, die hier Leben retten kann.",
        "Wasser leitet den Strom. Er fließt durch das Wasser und durch den Körper der Person in der Wanne – das ist lebensgefährlich, weil der Strom den Herzschlag stört. Der FI-Schutzschalter erkennt, dass Strom einen falschen Weg nimmt, und schaltet in Sekundenbruchteilen ab.",
        ["Wasser (und der Körper) leitet den Strom", "Strom durch den Körper ist lebensgefährlich (Herz, Muskeln)", "FI-Schutzschalter schaltet ab"],
        ["wasser|leitet", "körper|herz|lebensgefahr|stromschlag|tödlich", "fi|schutzschalter|fehlerstrom"])
    ]
  }
};
