"use strict";
// Block-Probe „Atome und Materie“ – R- und M-Fassung. Lösungen bleiben im Backend.
// Module: atommodelle (Atommodelle: von Demokrit bis Rutherford) · atombau-pse (Atombau und Periodensystem).
// Reihenfolge: erst die Aufgaben zu atommodelle, dann zu atombau-pse, am Schluss die Transferaufgaben.
// Bilder und Animationen: 7M/NT/assets/proben/atome-*.svg (eigene Zeichnungen nach den Grafiken der Module).
const c = (modul, prompt, options, extra) => ({ type: "choice", modul, prompt, options, answer: 0, points: 1, ...(extra || {}) });
const m = (modul, prompt, pairs, extra) => ({ type: "match", modul, prompt, pairs, points: pairs.length, ...(extra || {}) });
const o = (modul, prompt, steps, extra) => ({ type: "order", modul, prompt, steps, points: steps.length, ...(extra || {}) });
const t = (modul, prompt, expected, criteria, keywords, extra) => ({ type: "text", modul, prompt, expected, criteria, keywords, points: criteria.length, ...(extra || {}) });

const AM = "atommodelle", PSE = "atombau-pse";

// Bilder (Pfad relativ zu 7M/NT/) mit Beschreibung zum Vorlesen – ohne die Lösung zu nennen
const BILD = {
  kugel: { image: "assets/proben/atome-kugelmodell.svg", imageAlt: "Animation im Kugelmodell. Links „vorher“: eine dunkle Kugel mit dem Buchstaben C und zwei verbundene rote Kugeln mit dem Buchstaben O. In der Mitte stoßen die Kugeln zusammen: Die beiden roten Kugeln lösen sich voneinander, die dunkle Kugel schiebt sich dazwischen. Rechts „nachher“: eine Kette aus roter, dunkler und roter Kugel. C steht für ein Kohlenstoff-Atom, O für ein Sauerstoff-Atom." },
  streu: { image: "assets/proben/atome-streuversuch.svg", imageAlt: "Animation: Blick von oben auf den Streuversuch. Links steht ein Kasten (A), aus dem kleine Teilchen nach rechts fliegen. In der Mitte steht ein dünner senkrechter Streifen (B). Um den Streifen liegt ein fast geschlossener Ring (C); dort leuchtet ein heller Punkt auf, wo ein Teilchen ankommt. Fast alle Teilchen fliegen gerade durch den Streifen, zwei werden zur Seite abgelenkt, ein einziges fliegt zurück." },
  kern: { image: "assets/proben/atome-kern-huelle.svg", imageAlt: "Modell eines Atoms. In der Mitte sitzt ein kleiner roter Punkt (A). Um ihn liegt ein großer, gelb gefärbter, fast leerer Bereich mit gestricheltem Rand (B). In diesem Bereich sind zehn kleine blaue Punkte verteilt, einer davon ist mit C bezeichnet. Hinweis im Bild: Der Punkt in der Mitte ist viel zu groß gezeichnet." },
  symbol: { image: "assets/proben/atome-symbol.svg", imageAlt: "Atom-Symbol von Kalium: ein großes K, davor oben links die Zahl 39 und unten links die Zahl 19." },
  pse: { image: "assets/proben/atome-pse.svg", imageAlt: "Ausschnitt aus dem Periodensystem mit den ersten 20 Elementen. Die Zeilen sind die Perioden 1 bis 4, die Spalten die Hauptgruppen I bis VIII. In jedem Feld stehen die Ordnungszahl und das Elementsymbol. Periode 1: H in Hauptgruppe I und He in Hauptgruppe VIII. Periode 2 von Hauptgruppe I bis VIII: Li, Be, B, C, N, O, F, Ne. Periode 3: Na, Mg, Al, Si, P, S, Cl, Ar. Periode 4: K und Ca, danach geht die Periode weiter." },
  isotope: { image: "assets/proben/atome-isotope.svg", imageAlt: "Zwei Atomkerne aus Kugeln. Kern von Atom 1: drei rote Kugeln mit Pluszeichen und drei graue Kugeln. Kern von Atom 2: drei rote Kugeln mit Pluszeichen und vier graue Kugeln. Legende: rote Kugel mit Pluszeichen = Proton, graue Kugel = Neutron." },
  schalen: { image: "assets/proben/atome-schalen.svg", imageAlt: "Ein Atom im Schalenmodell: in der Mitte der Atomkern, darum drei gestrichelte Kreise als Schalen. Auf der inneren Schale sitzen 2 Elektronen, auf der mittleren 8 und auf der äußeren 5. Die Elektronen der äußersten Schale sind gelb umrandet." }
};

// Aufgaben, die in beiden Fassungen gleich sind (jeder Aufruf liefert ein eigenes Objekt)
const zeitstrahl = () => o(AM, "Bringe die Schritte auf dem Weg zum Kern-Hülle-Modell in die richtige zeitliche Reihenfolge. Beginne mit dem ältesten.", [
  "Demokrit denkt nach: Alles besteht aus kleinsten, unteilbaren Teilchen.",
  "Dalton stützt sich auf Messungen: Atome sind massive Kugeln.",
  "Im Streuversuch fliegen Alpha-Teilchen durch eine Goldfolie.",
  "Rutherford folgert: Ein Atom hat einen Kern und eine Hülle."]);
const kugelAnimation = () => c(AM, "Die Animation zeigt im Kugelmodell, wie Kohlenstoff verbrennt. Was passiert dabei nach Dalton mit den Atomen?", [
  "Sie werden nur neu angeordnet – kein Atom geht verloren.",
  "Sie werden zerstört, und ganz neue Atome entstehen.",
  "Die Kohlenstoff-Atome verwandeln sich in Sauerstoff-Atome.",
  "Sie werden beim Verbrennen größer und schwerer."], BILD.kugel);
const goldSauerstoff = () => c(PSE, "Gold ist ein festes, glänzendes Metall, Sauerstoff ein unsichtbares Gas. Was ist in einem Gold-Atom anders als in einem Sauerstoff-Atom?", [
  "Es hat dieselben Bausteine, aber viel mehr davon – vor allem mehr Protonen.",
  "Es besteht aus ganz anderen Bausteinen als ein Sauerstoff-Atom.",
  "Es hat einen Atomkern, das Sauerstoff-Atom hat keinen.",
  "Es hat nur Protonen, das Sauerstoff-Atom nur Elektronen."]);
const isotopeBild = () => c(PSE, "Das Bild zeigt die Kerne von zwei Atomen. Welche Aussage stimmt?", [
  "Es sind Isotope: gleich viele Protonen, aber verschieden viele Neutronen.",
  "Es sind zwei verschiedene Elemente, denn die Kerne sind verschieden schwer.",
  "Es sind Isotope: gleich viele Neutronen, aber verschieden viele Protonen.",
  "Beide Kerne sind gleich gebaut, es ist dieselbe Atomsorte."], BILD.isotope);

module.exports = {
  /* ================= R-Fassung ================= */
  "nt7-atome-r": {
    id: "nt7-atome-r", zug: "R", thema: "atome", minutes: 40,
    title: "Probe Atome und Materie (7R)",
    scope: "Atommodelle von Demokrit bis Rutherford, Bausteine der Atome, Ordnungszahl und Massenzahl, Periodensystem, Metalle, Nichtmetalle und Edelgase",
    items: [
      /* ----- Modul atommodelle ----- */
      c(AM, "Demokrit überlegte: Zerteilt man einen Stoff immer weiter, bleibt am Ende ein kleinstes Teilchen übrig. Er nannte es Atom, nach dem griechischen Wort „atomos“. Was bedeutet dieses Wort?",
        ["unteilbar", "unsichtbar", "winzig klein", "kugelrund"]),
      zeitstrahl(),
      c(AM, "Welche Aussage gehört zu Daltons Kugelmodell?",
        ["Alle Atome eines Elements sind gleich groß und gleich schwer.", "Jedes Atom hat einen Kern und eine Hülle.", "Ein Atom besteht fast nur aus leerem Raum.", "Bei einer chemischen Reaktion gehen Atome verloren."]),
      kugelAnimation(),
      m(AM, "Die Animation zeigt den Streuversuch von oben. Ordne den Buchstaben A, B und C die Teile des Versuchs zu.",
        [["A", "Strahlenquelle: sendet Alpha-Teilchen aus"], ["B", "Goldfolie: darauf treffen die Alpha-Teilchen"], ["C", "Leuchtschirm: blitzt auf, wo ein Teilchen einschlägt"]], BILD.streu),
      m(AM, "Rutherford zog aus jeder Beobachtung im Streuversuch einen Schluss. Ordne zu.",
        [["Fast alle Alpha-Teilchen fliegen gerade durch die Folie.", "Das Atom ist fast leer."], ["Einige Alpha-Teilchen werden abgelenkt.", "Im Atom sitzt etwas positiv Geladenes."], ["Ganz wenige Alpha-Teilchen prallen zurück.", "Der Kern ist winzig, aber sehr schwer."]]),
      m(AM, "Das Bild zeigt ein Atom im Kern-Hülle-Modell von Rutherford. Ordne den Buchstaben A, B und C zu.",
        [["A", "Atomkern: positiv geladen, enthält fast die ganze Masse"], ["B", "Atomhülle: fast leerer Raum um den Kern"], ["C", "Elektron: negativ geladen"]], BILD.kern),
      c(AM, "Stell dir ein Atom so groß wie ein Fußballstadion vor. Wie groß wäre dann sein Kern?",
        ["etwa wie eine Erbse", "etwa wie ein Fußball", "etwa wie ein Auto", "etwa wie das ganze Spielfeld"]),
      c(AM, "Für welche Beobachtung reicht das einfache Kugelmodell nicht mehr aus?",
        ["Alpha-Teilchen fliegen durch eine Goldfolie hindurch.", "Eis schmilzt zu flüssigem Wasser.", "Luft lässt sich zusammendrücken.", "Kohlenstoff verbrennt zu Kohlenstoffdioxid."]),

      /* ----- Modul atombau-pse ----- */
      m(PSE, "Ordne jedem Baustein des Atoms seine Beschreibung zu.",
        [["Proton", "positiv geladen, im Atomkern"], ["Neutron", "ungeladen, im Atomkern"], ["Elektron", "negativ geladen, in der Atomhülle"]]),
      goldSauerstoff(),
      c(PSE, "Ein Atom hat 7 Protonen und 7 Elektronen. Wie ist es nach außen geladen?",
        ["neutral – Plus und Minus gleichen sich aus", "positiv – die Protonen sind stärker", "negativ – die Elektronen sind stärker", "unklar – es kommt auf die Neutronen an"]),
      isotopeBild(),
      t(PSE, "Das Bild zeigt das Atom-Symbol von Kalium. Bestimme, wie viele Protonen, Elektronen und Neutronen ein neutrales Kalium-Atom hat.",
        "Die untere Zahl ist die Ordnungszahl: Das Atom hat 19 Protonen. Ein neutrales Atom hat genauso viele Elektronen, also 19. Die Neutronen berechnet man mit Massenzahl minus Ordnungszahl: 39 − 19 = 20 Neutronen.",
        ["19 Protonen", "19 Elektronen", "20 Neutronen (39 − 19)"],
        ["19 proton|neunzehn proton|protonen: 19|protonen 19|protonen = 19|protonen sind 19", "19 elektron|neunzehn elektron|elektronen: 19|elektronen 19|elektronen = 19|elektronen sind 19", "20 neutron|zwanzig neutron|neutronen: 20|neutronen 20|neutronen = 20|neutronen sind 20|= 20|=20"], BILD.symbol),
      c(PSE, "Wonach sind die Elemente im Periodensystem geordnet?",
        ["nach steigender Ordnungszahl", "nach dem Alphabet", "nach ihrer Farbe", "nach dem Jahr ihrer Entdeckung"]),
      m(PSE, "Lies im Periodensystem ab: Welches Element steht an dieser Stelle?",
        [["Periode 2, Hauptgruppe IV", "Kohlenstoff (C)"], ["Periode 3, Hauptgruppe I", "Natrium (Na)"], ["Periode 3, Hauptgruppe VII", "Chlor (Cl)"], ["Periode 2, Hauptgruppe VIII", "Neon (Ne)"]], BILD.pse),
      c(PSE, "Ein unbekannter Stoff glänzt silbrig, leitet Strom und Wärme gut und lässt sich verbiegen. Zu welcher Gruppe gehört er?",
        ["zu den Metallen", "zu den Nichtmetallen", "zu den Edelgasen", "zu den Isotopen"]),
      m(PSE, "Ordne jedem Element eine Eigenschaft oder Verwendung zu.",
        [["Helium", "viel leichter als Luft, füllt Ballons"], ["Neon", "leuchtet rot-orange in Leuchtröhren"], ["Aluminium", "leichtes Metall für Fahrradrahmen und Dosen"], ["Chlor", "giftiges Gas – Stoffe mit Chlor desinfizieren das Schwimmbad"]]),

      /* ----- Transfer ----- */
      t(AM, "Eine Kerze brennt ab und wird immer kleiner. Tom sagt: „Die Atome der Kerze sind einfach verschwunden.“ Beurteile Toms Aussage mit Daltons Kugelmodell.",
        "Toms Aussage stimmt nicht. Nach Dalton gehen bei einer chemischen Reaktion keine Atome verloren. Die Atome der Kerze werden nur neu angeordnet: Sie verbinden sich mit Sauerstoff aus der Luft zu neuen Stoffen, zum Beispiel zu Kohlenstoffdioxid. Diese Stoffe sind Gase und verteilen sich unsichtbar in der Luft.",
        ["Aussage ist falsch: Bei einer chemischen Reaktion gehen keine Atome verloren", "die Atome werden neu angeordnet bzw. verbinden sich neu (z. B. mit Sauerstoff)", "es entstehen neue Stoffe (z. B. Kohlenstoffdioxid), die als Gas in die Luft gehen"],
        ["nicht verloren|gehen nicht|nicht verschw|falsch|stimmt nicht|nicht richtig|kein atom|keine atome|unrecht|nicht recht", "neu angeordnet|anordn|ordnen|verbinden|verbindet", "gas|luft|kohlenstoffdioxid|co2|neue stoffe|neuer stoff|rauch"],
        { transfer: true }),
      t(PSE, "Früher füllte man Luftschiffe mit Wasserstoff. Wasserstoff ist brennbar. Heute nimmt man Helium. Beide Gase sind viel leichter als Luft. Erkläre, warum Helium sicherer ist, und nenne die Gruppe von Elementen, zu der Helium gehört.",
        "Wasserstoff kann Feuer fangen, dann brennt das ganze Luftschiff. Helium brennt nicht und reagiert fast nie mit anderen Stoffen. Deshalb ist es viel sicherer. Helium gehört zu den Edelgasen.",
        ["Gefahr erkannt: Wasserstoff kann Feuer fangen oder explodieren", "Helium brennt nicht bzw. reagiert fast nie mit anderen Stoffen", "Helium ist ein Edelgas"],
        ["feuer|explo|gefähr|entzünd|anbrennen|verbrenn|brennen|flamme", "brennt nicht|nicht brenn|reagiert nicht|reagiert fast nie|reagiert kaum|reaktionsträg|nicht reagier|kann nicht brennen", "edelgas"],
        { transfer: true }),
      t(PSE, "Du reibst einen Luftballon an deinen Haaren. Dabei wandern Elektronen von den Haaren auf den Ballon. Vorher waren Ballon und Haare neutral. Wie sind Ballon und Haare danach geladen? Begründe.",
        "Der Ballon hat jetzt mehr Elektronen als Protonen. Er ist negativ geladen. Den Haaren fehlen Elektronen: Sie haben jetzt mehr Protonen als Elektronen und sind positiv geladen. Neutral ist etwas nur, wenn es gleich viele Protonen und Elektronen hat.",
        ["Der Ballon ist negativ geladen", "Die Haare sind positiv geladen", "Begründung: Der Ballon hat jetzt mehr Elektronen als Protonen, den Haaren fehlen Elektronen (neutral = gleich viele)"],
        ["negativ|minus", "positiv|plus", "mehr elektronen|zu viele elektronen|fehlen|weniger elektronen|gleich viele|mehr protonen|elektronen dazu|elektronen bekommen|elektronen abgegeben|elektronen verloren"],
        { transfer: true })
    ]
  },

  /* ================= M-Fassung ================= */
  "nt7-atome-m": {
    id: "nt7-atome-m", zug: "M", thema: "atome", minutes: 45,
    title: "Probe Atome und Materie (7M)",
    scope: "Atommodelle und ihre Grenzen, Streuversuch auswerten, Energiestufen, Atombau, Isotope, Periodensystem mit Schalen und Außenelektronen, Metalle, Nichtmetalle und Edelgase",
    items: [
      /* ----- Modul atommodelle ----- */
      c(AM, "Warum nennt man Demokrits Idee von den Atomen ein Gedankenmodell?",
        ["Er kam nur durch Nachdenken darauf – ohne Versuch und ohne Messung.", "Er überprüfte sie mit einem Versuch an einer dünnen Goldfolie.", "Er hatte Stoffe vor und nach Reaktionen genau gewogen.", "Er hatte einzelne Atome unter dem Mikroskop gesehen."]),
      zeitstrahl(),
      kugelAnimation(),
      t(AM, "Die Animation zeigt den Streuversuch. Beschreibe, was mit den Alpha-Teilchen passiert. Erkläre dann, warum das nicht zu Daltons Kugelmodell passt und was Rutherford über den Bau des Atoms folgerte.",
        "Fast alle Alpha-Teilchen fliegen gerade durch die Goldfolie. Wenige werden abgelenkt, ganz wenige prallen zurück. Nach Dalton liegen in der Folie massive Kugeln dicht an dicht – dann hätten die Teilchen abprallen oder stecken bleiben müssen. Rutherford folgerte: Das Atom ist fast leer. In der Mitte sitzt ein winziger, schwerer, positiv geladener Kern. Er stößt die positiven Alpha-Teilchen ab.",
        ["Beobachtung: Fast alle Teilchen fliegen gerade durch, wenige werden abgelenkt, ganz wenige prallen zurück", "nach Dalton (massive Kugeln dicht an dicht) hätten die Teilchen abprallen oder stecken bleiben müssen", "Folgerung: Das Atom ist fast leer", "in der Mitte sitzt ein winziger, schwerer, positiv geladener Kern (er lenkt Teilchen ab oder wirft sie zurück)"],
        ["durch|hindurch", "massiv|kugel|stecken|mauer|abprallen müssen|abgeprallt|hätten", "leer", "kern"], BILD.streu),
      c(AM, "Bei einem Streuversuch zählt man 10 000 Alpha-Teilchen: 9 970 fliegen fast gerade durch die Folie, 27 werden deutlich abgelenkt, 3 prallen zurück. Wie viel Prozent fliegen fast gerade durch?",
        ["99,7 %", "97 %", "9,97 %", "0,3 %"]),
      c(AM, "Wie groß ist der Atomkern im Vergleich zum ganzen Atom?",
        ["etwa 10 000- bis 100 000-mal kleiner", "etwa 10- bis 100-mal kleiner", "etwa halb so groß", "fast genauso groß"]),
      t(AM, "Erkläre, was ein Modell in den Naturwissenschaften ist. Nenne für das Kern-Hülle-Modell eine Beobachtung, die es erklärt, und eine Frage, die es offen lässt.",
        "Ein Modell ist eine vereinfachte Vorstellung von etwas, das man nicht direkt sehen kann. Es ist nicht die Wirklichkeit selbst. Das Kern-Hülle-Modell erklärt den Streuversuch: Fast alle Alpha-Teilchen fliegen durch, weil das Atom fast leer ist. Es sagt aber nicht, wie die Elektronen in der Hülle verteilt sind.",
        ["Modell = vereinfachte Vorstellung von etwas, das man nicht direkt sehen kann (nicht die Wirklichkeit selbst)", "das Kern-Hülle-Modell erklärt z. B. den Streuversuch, die Ladungen im Atom oder wo die Masse sitzt", "Grenze: Es sagt nicht, wie die Elektronen in der Hülle verteilt sind"],
        ["vereinfacht|vorstellung|bild|nicht die wirklichkeit|nicht direkt sehen|nicht sehen", "streuversuch|alpha|goldfolie|ladung|masse|durch", "verteilt|verteilung|energiestufe|schale|wo die elektronen|wie die elektronen|anordnung der elektronen"]),
      c(AM, "Ein Sauerstoff-Atom hat 8 Elektronen. Wie verteilen sie sich im Energiestufenmodell?",
        ["2 auf der 1. Stufe, 6 auf der 2. Stufe", "8 auf der 1. Stufe, 0 auf der 2. Stufe", "4 auf der 1. Stufe, 4 auf der 2. Stufe", "6 auf der 1. Stufe, 2 auf der 2. Stufe"]),

      /* ----- Modul atombau-pse ----- */
      goldSauerstoff(),
      m(PSE, "Ordne jedem Baustein des Atoms seine Beschreibung zu.",
        [["Proton", "im Kern, positiv geladen – seine Zahl bestimmt das Element"], ["Neutron", "im Kern, ungeladen, etwa so schwer wie ein Proton"], ["Elektron", "in der Hülle, negativ geladen, fast ohne Masse"]]),
      t(PSE, "Das Bild zeigt das Atom-Symbol von Kalium. Bestimme die Zahl der Protonen, Elektronen und Neutronen eines neutralen Kalium-Atoms. Schreibe auf, wie du die Neutronen berechnest.",
        "Die Ordnungszahl ist 19: Das Atom hat 19 Protonen und als neutrales Atom auch 19 Elektronen. Neutronen = Massenzahl minus Ordnungszahl = 39 − 19 = 20.",
        ["19 Protonen und 19 Elektronen", "20 Neutronen", "Rechenweg: Massenzahl minus Ordnungszahl (39 − 19)"],
        ["19 proton|19 elektron|neunzehn|je 19|jeweils 19", "20 neutron|zwanzig|= 20|=20|neutronen: 20|neutronen 20", "massenzahl|minus|39 - 19|39-19|39 − 19|39 – 19|39−19"], BILD.symbol),
      isotopeBild(),
      m(PSE, "Lies im Periodensystem ab: Welches Element steht an dieser Stelle?",
        [["Periode 2, Hauptgruppe VI", "Sauerstoff (O)"], ["Periode 3, Hauptgruppe II", "Magnesium (Mg)"], ["Periode 3, Hauptgruppe VIII", "Argon (Ar)"], ["Periode 4, Hauptgruppe I", "Kalium (K)"]], BILD.pse),
      t(PSE, "Das Bild zeigt ein Atom im Schalenmodell. Bestimme mit dem Bild, in welcher Periode und in welcher Hauptgruppe das Element steht. Wie viele Protonen hat das neutrale Atom? Begründe kurz.",
        "Das Atom hat drei Schalen, also steht das Element in der 3. Periode. Auf der äußersten Schale sitzen 5 Elektronen, also steht es in der Hauptgruppe V. Zusammen sind es 2 + 8 + 5 = 15 Elektronen. Ein neutrales Atom hat genauso viele Protonen: 15. (Das Element ist Phosphor.)",
        ["3 Schalen, also 3. Periode", "5 Außenelektronen, also Hauptgruppe V", "15 Protonen (so viele wie Elektronen: 2 + 8 + 5)"],
        ["3. periode|dritte periode|dritten periode|periode 3|periode: 3|drei schalen|3 schalen", "hauptgruppe 5|5. hauptgruppe|fünfte hauptgruppe|fünften hauptgruppe|v. hauptgruppe|hauptgruppe v|hauptgruppe: v|5 außen|fünf außen", "15|fünfzehn"], BILD.schalen),
      c(PSE, "Warum reagieren Edelgase fast nie mit anderen Stoffen?",
        ["Ihre äußerste Schale ist voll besetzt – das ist besonders stabil.", "Sie haben keine Elektronen, die reagieren könnten.", "Ihre Atome sind zu leicht, um andere Atome zu treffen.", "Ihr Atomkern enthält nur Neutronen und ist ungeladen."]),
      m(PSE, "Ordne jedem Element seine Stoffgruppe und eine Eigenschaft zu.",
        [["Natrium", "Metall: weich, reagiert heftig mit Wasser"], ["Chlor", "Nichtmetall: giftiges, gelbgrünes Gas"], ["Neon", "Edelgas: leuchtet rot-orange in Leuchtröhren"]]),
      c(PSE, "Wasserstoff steht in Hauptgruppe I – in einer Spalte mit den Metallen Lithium, Natrium und Kalium. Was stimmt?",
        ["Wasserstoff ist eine Ausnahme: Er ist ein Nichtmetall.", "Wasserstoff ist das leichteste aller Metalle.", "Wasserstoff ist ein Edelgas und reagiert fast nie.", "Wasserstoff gehört in Wahrheit in Hauptgruppe VIII."]),

      /* ----- Transfer ----- */
      t(AM, "Eisenwolle verbrennt an der Luft zu Eisenoxid. Danach zeigt die Waage mehr an als vorher. Lena meint: „Bei der Reaktion sind neue Atome entstanden.“ Beurteile Lenas Aussage mit Daltons Kugelmodell und erkläre, woher die zusätzliche Masse kommt.",
        "Lenas Aussage stimmt nicht. Nach Dalton entstehen bei einer chemischen Reaktion keine neuen Atome, und es gehen auch keine verloren. Die Atome werden nur neu angeordnet. Die Eisen-Atome verbinden sich mit Sauerstoff-Atomen aus der Luft. Diese Sauerstoff-Atome kommen zur Masse dazu, deshalb ist das Eisenoxid schwerer als die Eisenwolle.",
        ["Aussage ist falsch: Nach Dalton entstehen keine neuen Atome (und keine gehen verloren)", "die Atome werden nur neu angeordnet bzw. verbinden sich neu", "die zusätzliche Masse stammt von Sauerstoff-Atomen aus der Luft, die sich mit dem Eisen verbinden"],
        ["falsch|stimmt nicht|nicht richtig|keine neuen|entstehen nicht|entstehen keine|unrecht|nicht recht", "neu angeordnet|anordn|ordnen sich|verbinden|verbindet", "sauerstoff|luft"],
        { transfer: true }),
      t(PSE, "Die häufigste Sorte von Chlor-Atomen hat die Massenzahl 35. Ein Forscherteam untersucht ein Atom mit 17 Protonen und 20 Neutronen. Jonas sagt: „Das kann kein Chlor sein.“ Beurteile die Aussage und begründe. Das Periodensystem im Bild hilft dir.",
        "Jonas hat nicht recht. Die Zahl der Protonen legt das Element fest: 17 Protonen bedeuten Chlor. Das Atom hat nur mehr Neutronen als die häufigste Atomsorte. Es ist ein Isotop von Chlor mit der Massenzahl 17 + 20 = 37.",
        ["Aussage ist falsch: Die Protonenzahl (Ordnungszahl 17) legt das Element fest – es ist Chlor", "es ist ein Isotop: gleiche Protonenzahl, aber andere Neutronenzahl", "Massenzahl 37 (17 + 20)"],
        ["protonenzahl|zahl der protonen|17 protonen|ordnungszahl|ist chlor|doch chlor|trotzdem chlor|falsch|nicht recht|unrecht|stimmt nicht", "isotop|neutronenzahl|mehr neutronen|andere neutronen|zahl der neutronen", "37"],
        { transfer: true, ...BILD.pse }),
      t(PSE, "In einer Glühlampe wird ein dünner Draht aus Metall so heiß, dass er hell leuchtet. Die Lampe ist nicht mit Luft gefüllt, sondern mit Argon. Erkläre, warum man Argon nimmt. Nutze dein Wissen über die Luft und über die Stoffgruppe, zu der Argon gehört.",
        "In der Luft ist Sauerstoff. Der glühend heiße Draht würde mit dem Sauerstoff reagieren und verbrennen. Argon ist ein Edelgas aus der Hauptgruppe VIII. Edelgase reagieren fast nie mit anderen Stoffen, weil ihre Außenschale voll besetzt ist. Deshalb bleibt der Draht in Argon erhalten.",
        ["in Luft ist Sauerstoff – der heiße Draht würde damit reagieren bzw. verbrennen", "Argon ist ein Edelgas", "Edelgase reagieren fast nie (reaktionsträge, volle Außenschale) – der Draht bleibt erhalten"],
        ["sauerstoff|verbrenn|durchbrenn|oxid", "edelgas", "reagiert nicht|reagiert fast nie|reagiert kaum|reagieren fast nie|reagieren nicht|reagieren kaum|reaktionsträg|träge|voll besetzt|nicht reagier|stabil"],
        { transfer: true })
    ]
  }
};
