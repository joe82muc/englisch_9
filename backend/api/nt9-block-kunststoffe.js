"use strict";
// Block-Probe „Kunststoffe“ – nur 9M (Wunsch der Lehrkraft am 22.10.2026: „erstelle probe mit den üblichen regeln“).
// Lösungen bleiben im Backend. Übliche Regeln: Testregeln mit Note 6 (Verlassen insgesamt über 1 Minute, 2. Kopierversuch),
// Note erst nach der Rückgabe, M-Schlüssel über den Zug des Codes (infoaustausch.js), 45 Minuten Richtzeit ohne Abgabeuhr.
//
// Module des Blocks (9M/NT_9/themen.js): ku1 … ku5 im Ordner 9M/NT_9/App13_Kunststoffe.
// Bei Ankreuzaufgaben steht die richtige Antwort immer zuerst (answer: 0), bei Zuordnungen stehen die Optionen
// in der Reihenfolge der Zeilen – gemischt wird beim Laden (proben-mischen.js). Rechtschreibung zählt nie.
// Fakten und Zahlen wie in den Modulen (Schulbuch Natur Plus 9/9M, eigene Formulierungen).
// Bilder: animierte SVG in 9M/NT_9/App12_Organische_Rohstoffe/assets/probe/ku-*.svg (Probe-Seite liegt dort).

const T1 = "Vielfalt der Kunststoffe";
const T2 = "Bau und Einteilung der Kunststoffe";
const T3 = "Kunststoffe verarbeiten";
const T4 = "Kunststoffmüll und Recycling";
const T5 = "Die PET-Flasche: Kreislauf und Ökobilanz";
const TR = "Transfer";

const BILD = {
  code: { image: "assets/probe/ku-code.svg", imageAlt: "Zeichen auf dem Boden einer Brotzeitbox: ein Dreieck aus drei Pfeilen, die im Kreis laufen. In der Mitte steht die Zahl 05, darunter die Buchstaben PP." },
  ketten: { image: "assets/probe/ku-ketten.svg", imageAlt: "Drei Kästen A, B und C mit Modellen von Kunststoff-Molekülen. A: lange Ketten liegen nebeneinander, ohne Verbindungen untereinander, sie gleiten leicht hin und her. B: Ketten sind an wenigen Stellen miteinander verbunden (weitmaschiges Netz), das Netz dehnt sich und geht wieder zurück. C: Ketten sind an sehr vielen Stellen verbunden (engmaschiges Netz), es bewegt sich nicht." },
  extruder: { image: "assets/probe/ku-extruder.svg", imageAlt: "Schnitt durch eine Schmelzpresse (Extruder) mit drei Stellen. Stelle 1: oben ein Trichter, in den kleine Kunststoffkörnchen fallen. Stelle 2: rote Heizbänder außen am Rohr, dort werden die Körnchen zu einer zähen Masse. Stelle 3: im Rohr eine sich drehende Schraube, die die Masse nach rechts schiebt. Rechts tritt ein Strang aus Kunststoff aus." },
  sortierung: { image: "assets/probe/ku-sortierung.svg", imageAlt: "Förderband einer Sortieranlage mit einem Scanner darüber. Auf dem Band liegen eine Shampooflasche, eine Folie und ein Joghurtbecher, auf dem noch der Deckel aus Aluminium klebt. Der Scanner leuchtet auf die Teile. Am Ende des Bandes bläst eine Luftdüse den Joghurtbecher mit dem Deckel in einen Behälter mit der Aufschrift: aussortiert, wird verbrannt." },
  pet: { image: "assets/probe/ku-pet.svg", imageAlt: "Kreislauf einer PET-Einwegflasche mit vier nummerierten Stellen auf einem Ring. Stelle 1: In einer Fabrik wird aus Erdöl Kunststoff-Granulat. Stelle 2: Kleine Rohlinge werden mit Luft zu Flaschen aufgeblasen und mit Getränk gefüllt. Stelle 3: Ein Pfandautomat nimmt eine leere Flasche an und presst sie zusammen. Stelle 4: Eine Maschine zerkleinert gepresste Flaschen zu kleinen Schnipseln, die gewaschen werden." }
};

/* ============================== 9M ============================== */
const probeM = {
  id: "nt9m-kunststoffe",
  title: "Probe Kunststoffe (9M)",
  unit: "NT 9M · Vielfalt, Bau und Einteilung, Verarbeitung, Kunststoffmüll und Recycling, PET-Flasche und Ökobilanz",
  classLevel: "9M",
  thema: "kunststoffe",
  minutes: 45,
  items: [
    /* --- Vielfalt der Kunststoffe --- */
    { teil: T1, modul: "ku1", type: "match", prompt: "Kunststoffe haben viele Vorteile. Welche Eigenschaft ist bei diesem Gegenstand am wichtigsten? Ordne zu.",
      options: ["leitet keinen Strom", "wärmeisolierend", "rostet nicht, obwohl ständig Wasser darin steht", "durchsichtig und sehr leicht"],
      rows: [{ text: "Hülle eines Stromkabels", answer: 0 }, { text: "Griff eines Kochtopfs", answer: 1 }, { text: "Regentonne im Garten", answer: 2 }, { text: "Trinkflasche für eine lange Wanderung", answer: 3 }] },
    { teil: T1, modul: "ku1", ...BILD.code, type: "choice", prompt: "Dieses Zeichen steht auf dem Boden einer Brotzeitbox. Aus welchem Kunststoff ist sie?",
      options: ["Polypropen", "Polystyrol", "Polyvinylchlorid", "Polyethylenterephthalat"], answer: 0, points: 1 },
    { teil: T1, modul: "ku1", type: "text", prompt: "Kunststoffe haben auch Nachteile. Nenne zwei.",
      expected: "Kunststoffe verkratzen leicht. Sie sind nicht biologisch abbaubar, deshalb sammeln sich Plastikmüll und Mikroplastik in der Natur an. (Auch richtig: temperaturempfindlich, werden mit der Zeit spröde, lassen sich kaum reparieren.)",
      kriterien: "Je 1 Punkt für jeden richtigen Nachteil, höchstens 2: verkratzen leicht / nicht sehr hart; temperaturempfindlich, werden in der Wärme weich; werden mit der Zeit spröde und brüchig (Sonnenlicht); lassen sich kaum reparieren; nicht biologisch abbaubar, Plastikmüll, Mikroplastik, Müll im Meer.",
      keywords: ["kratz", "temperatur", "wärme", "weich", "spröde", "brüchig", "reparier", "abbaubar", "verrott", "müll", "mikroplastik"], points: 2, lines: 3 },

    /* --- Bau und Einteilung der Kunststoffe --- */
    { teil: T2, modul: "ku2", ...BILD.ketten, type: "match", prompt: "Die Abbildung zeigt den Aufbau von drei Kunststoffgruppen. Ordne A, B und C die richtige Gruppe zu.",
      options: ["Thermoplaste", "Elastomere", "Duroplaste"],
      rows: [{ text: "A", answer: 0 }, { text: "B", answer: 1 }, { text: "C", answer: 2 }] },
    { teil: T2, modul: "ku2", type: "match", prompt: "Welche Kunststoffgruppe ist gemeint? Ordne zu.",
      options: ["Thermoplaste", "Elastomere", "Duroplaste"],
      rows: [{ text: "Wird beim Erwärmen weich und lässt sich beliebig oft neu formen.", answer: 0 }, { text: "Lässt sich dehnen und nimmt danach wieder seine Form an.", answer: 1 }, { text: "Bleibt beim Erwärmen hart und zersetzt sich bei sehr großer Hitze.", answer: 2 }] },
    { teil: T2, modul: "ku2", type: "text", prompt: "Der Kunststoff Polyethen wird aus dem Gas Ethen hergestellt. Beschreibe, wie das geschieht.",
      expected: "Ethen-Moleküle haben eine Doppelbindung zwischen den beiden Kohlenstoff-Atomen. Mit Hilfe eines Katalysators wird diese Doppelbindung aufgespalten. Dann verbinden sich sehr viele Ethen-Moleküle zu langen Ketten (Makromolekülen) mit Einfachbindungen. Diesen Vorgang nennt man Polymerisation.",
      kriterien: "1 Punkt: Ethen hat eine C=C-Doppelbindung. 1 Punkt: Ein Katalysator spaltet die Doppelbindung auf (öffnet sie). 1 Punkt: Viele Ethen-Moleküle verbinden sich zu langen Ketten (Makromolekül, Polyethen) – das ist die Polymerisation. Der Begriff Polymerisation allein ohne Beschreibung gibt keinen Punkt.",
      keywords: ["doppelbindung", "katalysator", "aufgespalten", "aufspalten", "öffnet", "kette", "verbinden", "makromolekül", "polymerisation", "viele"], points: 3, lines: 5 },
    { teil: T2, modul: "ku2", type: "choice", prompt: "Was ist ein Monomer?",
      options: ["ein einzelnes kleines Molekül, ein Baustein der Kette", "eine lange Kette aus vielen verbundenen Bausteinen", "ein Hilfsstoff, der die Doppelbindung aufspaltet", "ein fertiger Kunststoff aus nur einer Sorte Ketten"], answer: 0, points: 1 },

    /* --- Kunststoffe verarbeiten --- */
    { teil: T3, modul: "ku3", ...BILD.extruder, type: "match", prompt: "Die Abbildung zeigt eine Schmelzpresse (Extruder). Was passiert an den Stellen 1, 2 und 3? Ordne zu.",
      options: ["Das Kunststoff-Granulat wird eingefüllt.", "Der Kunststoff wird erhitzt und schmilzt langsam.", "Eine Schnecke drückt die Masse zusammen und schiebt sie weiter."],
      rows: [{ text: "Stelle 1", answer: 0 }, { text: "Stelle 2", answer: 1 }, { text: "Stelle 3", answer: 2 }] },
    { teil: T3, modul: "ku3", type: "match", prompt: "Mit welchem Verfahren wird der Gegenstand hergestellt? Ordne zu.",
      options: ["Strangpressen", "Spritzgießen", "Folienblasen"],
      rows: [{ text: "Abwasserrohr", answer: 0 }, { text: "Salatschüssel", answer: 1 }, { text: "Müllbeutel", answer: 2 }] },
    { teil: T3, modul: "ku3", type: "choice", prompt: "Geschäumtes Polystyrol (Styropor) wird zum Dämmen von Häusern verwendet. Warum hält es die Wärme so gut im Haus?",
      options: ["Es besteht fast nur aus eingeschlossener Luft.", "Es besteht fast nur aus festem Kunststoff.", "Es besteht fast nur aus feinem Metallpulver.", "Es besteht fast nur aus gepresstem Holzmehl."], answer: 0, points: 1 },
    { teil: T3, modul: "ku3", type: "text", prompt: "Eine Salatschüssel aus Kunststoff wird durch Spritzgießen hergestellt. Beschreibe, wie das geht.",
      expected: "Der geschmolzene Kunststoff aus dem Extruder wird unter hohem Druck in eine Hohlform (Spritzgussform) gepresst. Dort kühlt er ab und wird fest. Dann öffnet man die Form und nimmt die fertige Schüssel heraus.",
      kriterien: "1 Punkt: Geschmolzener Kunststoff wird (unter hohem Druck) in eine Hohlform / Form / Werkzeug gepresst oder gespritzt. 1 Punkt: Er kühlt ab (wird fest), dann wird die Schüssel aus der Form genommen.",
      keywords: ["geschmolzen", "flüssig", "druck", "hohlform", "form", "gepresst", "gespritzt", "abkühl", "kühl", "fest", "entnommen", "heraus"], points: 2, lines: 4 },

    /* --- Kunststoffmüll und Recycling --- */
    { teil: T4, modul: "ku4", type: "match", prompt: "Kunststoffabfälle können auf drei Arten verwertet werden. Ordne jeder Beschreibung die richtige Art zu.",
      options: ["werkstoffliche Verwertung", "rohstoffliche Verwertung", "thermische Verwertung"],
      rows: [{ text: "Die Kunststoffe werden zerkleinert und zu neuen Produkten umgeschmolzen.", answer: 0 }, { text: "Die Kunststoffe werden ohne Luft erhitzt und in ein erdölähnliches Gemisch zerlegt.", answer: 1 }, { text: "Die Kunststoffe werden verbrannt, nur ihre Energie wird genutzt.", answer: 2 }] },
    { teil: T4, modul: "ku4", type: "choice", prompt: "Welche Art der Verwertung spielt bei uns von der Menge her kaum eine Rolle?",
      options: ["die rohstoffliche Verwertung", "die werkstoffliche Verwertung", "die thermische Verwertung", "die Verbrennung in Müllverbrennungsanlagen"], answer: 0, points: 1 },
    { teil: T4, modul: "ku4", ...BILD.sortierung, type: "choice", prompt: "In der Sortieranlage wird der Joghurtbecher aussortiert und später verbrannt. Warum?",
      options: ["Der Alu-Deckel klebt noch dran – der Scanner erkennt zwei Stoffe.", "Der Becher ist zu klein – der Scanner übersieht ihn einfach.", "Der Becher ist zu leicht – er fliegt vom Band, bevor er sortiert wird.", "Der Becher ist aus einem Kunststoff, den man nicht schmelzen kann."], answer: 0, points: 1 },
    { teil: T4, modul: "ku4", type: "choice", prompt: "Was versteht man unter Mikroplastik?",
      options: ["Kunststoffteilchen, die kleiner als 5 Millimeter sind", "Kunststoff, der sich in der Natur schnell auflöst", "Plastikflaschen mit weniger als einem Liter Inhalt", "Kunststoff, den man nur unter dem Mikroskop herstellen kann"], answer: 0, points: 1 },
    { teil: T4, modul: "ku4", type: "text", prompt: "Was muss gegeben sein, damit die werkstoffliche Verwertung gut funktioniert? Begründe.",
      expected: "Die Kunststoffabfälle müssen gut sortiert sein, also möglichst sortenrein (nur eine Kunststoffsorte, sauber). Nur dann entstehen daraus wieder neue Produkte in guter Qualität. Aus einem Gemisch verschiedener Kunststoffe lassen sich nur Dinge in schlechterer Qualität herstellen.",
      kriterien: "1 Punkt: Die Abfälle müssen gut sortiert bzw. sortenrein sein (nach Kunststoffsorten getrennt). 1 Punkt: Begründung: Nur aus sortenreinem Kunststoff entstehen neue Produkte in guter Qualität; aus Gemischen wird es schlechtere Qualität.",
      keywords: ["sortiert", "sortenrein", "getrennt", "sorte", "trennen", "qualität", "gemisch", "schlechter", "minderwertig"], points: 2, lines: 4 },

    /* --- Die PET-Flasche: Kreislauf und Ökobilanz --- */
    { teil: T5, modul: "ku5", ...BILD.pet, type: "match", prompt: "Die Abbildung zeigt den Weg einer PET-Einwegflasche. Was passiert an den Stellen 1 bis 4? Ordne zu.",
      options: ["Aus Erdöl wird PET-Granulat hergestellt.", "Rohlinge werden zu Flaschen aufgeblasen und befüllt.", "Die leere Flasche wird im Pfandautomaten zusammengepresst.", "Die Flaschen werden zu Flakes zerkleinert und gewaschen."],
      rows: [{ text: "Stelle 1", answer: 0 }, { text: "Stelle 2", answer: 1 }, { text: "Stelle 3", answer: 2 }, { text: "Stelle 4", answer: 3 }] },
    { teil: T5, modul: "ku5", type: "choice", prompt: "Gebrauchte PET-Einwegflaschen werden fast alle zurückgegeben. Wie viel des Materials wird wieder zu neuen Getränkeflaschen?",
      options: ["weniger als die Hälfte", "etwa drei Viertel", "fast zwei Drittel", "etwa 90 Prozent"], answer: 0, points: 1 },
    { teil: T5, modul: "ku5", type: "choice", prompt: "Wie oft kann eine PET-Mehrwegflasche gereinigt und neu befüllt werden?",
      options: ["bis zu 20-mal", "bis zu 5-mal", "bis zu 100-mal", "bis zu 500-mal"], answer: 0, points: 1 },
    { teil: T5, modul: "ku5", type: "text", prompt: "Erkläre, warum man bei der PET-Einwegflasche nicht von einem echten Kreislauf sprechen kann.",
      expected: "Die Einwegflasche wird nach einmaligem Gebrauch zerstört und zerkleinert. Nur ein Teil des Materials – weniger als die Hälfte – wird wieder zu neuen Flaschen. Der größte Teil wird zu Produkten mit geringerer Qualität, zum Beispiel Fasern für Kleidung oder Folien.",
      kriterien: "1 Punkt: Nur ein Teil (weniger als die Hälfte; je nach Angabe etwa ein Drittel bis knapp die Hälfte) wird wieder zu neuen Flaschen. 1 Punkt: Der größte Teil wird zu anderen Produkten mit geringerer Qualität (Fasern, Kleidung, Folien) – oder: Die Flasche wird nach einmaligem Gebrauch zerstört.",
      keywords: ["drittel", "30", "hälfte", "teil", "fasern", "kleidung", "folie", "qualität", "zerstört", "einmal", "andere produkte"], points: 2, lines: 4 },
    { teil: T5, modul: "ku5", type: "choice", prompt: "Was untersucht eine Ökobilanz?",
      options: ["die Umweltwirkungen eines Produkts auf seinem ganzen Lebensweg", "die Kosten eines Produkts auf seinem ganzen Lebensweg", "die Haltbarkeit eines Produkts auf seinem ganzen Lebensweg", "das Gewicht eines Produkts auf seinem ganzen Lebensweg"], answer: 0, points: 1 },

    /* --- Transfer --- */
    { teil: TR, modul: "ku2", transfer: true, type: "text", prompt: "Eine Firma entwickelt den Griff für eine Bratpfanne. Er soll hart und stabil sein und auch dann nicht weich werden, wenn die Pfanne auf dem heißen Herd steht. Welche Kunststoffgruppe sollte die Firma wählen? Begründe.",
      expected: "Duroplaste. Sie sind hart und stabil und lassen sich beim Erwärmen nicht verformen, weil ihre Moleküle eng miteinander vernetzt sind. Ein Thermoplast würde in der Wärme weich, ein Elastomer wäre zu weich und dehnbar.",
      kriterien: "1 Punkt: Duroplast(e) gewählt. 1 Punkt: Begründung: hart und stabil, werden beim Erwärmen nicht weich (engmaschig vernetzte Moleküle).",
      keywords: ["duroplast", "hart", "stabil", "nicht weich", "erwärm", "vernetzt", "engmaschig"], points: 2, lines: 4 },
    { teil: TR, modul: "ku5", transfer: true, type: "choice", prompt: "Familie Yılmaz trinkt viel Wasser. Welche Möglichkeit belastet die Umwelt am wenigsten?",
      options: ["Leitungswasser aus dem Wasserhahn", "Mineralwasser in PET-Einwegflaschen", "Mineralwasser in Einwegflaschen aus Glas", "Mineralwasser in Getränkedosen aus Aluminium"], answer: 0, points: 1 },
    { teil: TR, modul: "ku4", transfer: true, type: "choice", prompt: "Ein ganz schwarzer Blumentopf aus Kunststoff landet im gelben Sack. Was passiert in der Sortieranlage wahrscheinlich?",
      options: ["Der Scanner erkennt ihn nicht – der Topf wird aussortiert und verbrannt.", "Der Scanner erkennt ihn als PET – er wird zu neuen Flaschen.", "Der Topf ist zu schwer – er bleibt auf dem Förderband liegen.", "Der Topf wird gewaschen und als Blumentopf wieder verkauft."], answer: 0, points: 1 }
  ]
};

/* ============================== 9R ==============================
 * Seit 22.10.2026 („ziehe r nach“). Ohne den Stoff, den das Schulbuch nur für 9M vorsieht: Polymerisation (Modul 2),
 * Verarbeitung (Modul 3, für 9R ein Zusatzmodul) und Ökobilanz (Modul 5). Mehr Ankreuzen und Zuordnen, 4 Textaufgaben.
 * 16 Aufgaben stammen unverändert aus der 9M-Fassung (Nummern in AUS_M), 8 sind eigene, einfache Aufgaben. */
const T5R = "Die PET-Flasche: Kreislauf und Mehrweg";
const ausM = (i, teil) => { const it = JSON.parse(JSON.stringify(probeM.items[i])); if (teil) it.teil = teil; return it; };
const probeR = {
  id: "nt9r-kunststoffe",
  title: "Probe Kunststoffe (9R)",
  unit: "NT 9R · Vielfalt, Bau und Einteilung, Kunststoffmüll und Recycling, PET-Flasche und Mehrweg",
  classLevel: "9R",
  thema: "kunststoffe",
  minutes: 40,
  items: [
    /* --- Vielfalt der Kunststoffe --- */
    ausM(0), ausM(1), ausM(2),
    { teil: T1, modul: "ku1", type: "choice", prompt: "Mit welchem Versuch zeigst du, dass Kunststoff keinen Strom leitet?",
      options: ["Die Probe in einen Stromkreis mit Lämpchen klemmen – das Lämpchen bleibt aus.", "Die Probe in Wasser legen – sie schwimmt oben.", "Mit einem Nagel über die Probe ritzen – es bleibt ein Kratzer.", "Die Probe in heißes Wasser legen – sie wird weich."], answer: 0, points: 1 },
    { teil: T1, modul: "ku1", type: "match", prompt: "Der Recycling-Code nennt die Kunststoffsorte. Ordne jedem Code den Namen zu.",
      options: ["Polyethylenterephthalat", "Polyvinylchlorid", "Polystyrol"],
      rows: [{ text: "01 PET", answer: 0 }, { text: "03 PVC", answer: 1 }, { text: "06 PS", answer: 2 }] },

    /* --- Bau und Einteilung der Kunststoffe --- */
    ausM(3), ausM(4),
    { teil: T2, modul: "ku2", type: "choice", prompt: "Woraus bestehen Kunststoffe?",
      options: ["aus sehr großen, kettenartigen Molekülen", "aus winzigen Metallkörnchen", "aus Glasfasern und Sand", "aus getrockneten Pflanzenfasern"], answer: 0, points: 1 },
    { teil: T2, modul: "ku2", type: "match", prompt: "Zu welcher Kunststoffgruppe gehört der Gegenstand? Ordne zu.",
      options: ["Thermoplaste", "Elastomere", "Duroplaste"],
      rows: [{ text: "Plastiktüte", answer: 0 }, { text: "Gummiring", answer: 1 }, { text: "Lichtschalter", answer: 2 }] },

    /* --- Kunststoffmüll und Recycling --- */
    ausM(11), ausM(12), ausM(13), ausM(14), ausM(15),
    { teil: T4, modul: "ku4", type: "match", prompt: "Wohin gehört der Abfall? Ordne zu.",
      options: ["gelber Sack", "Altglas", "Altpapier"],
      rows: [{ text: "leerer Joghurtbecher", answer: 0 }, { text: "leeres Marmeladenglas", answer: 1 }, { text: "alte Zeitung", answer: 2 }] },
    { teil: T4, modul: "ku4", type: "choice", prompt: "Was ist für die Umwelt am besten?",
      options: ["Müll gar nicht erst entstehen lassen", "Müll sauber trennen und verwerten", "Müll verbrennen und die Wärme nutzen", "Müll auf einer Deponie lagern"], answer: 0, points: 1 },

    /* --- Die PET-Flasche: Kreislauf und Mehrweg --- */
    ausM(16, T5R), ausM(17, T5R), ausM(18, T5R), ausM(19, T5R),
    { teil: T5R, modul: "ku5", type: "choice", prompt: "Was passiert mit einer PET-Mehrwegflasche, nachdem du sie zurückgegeben hast?",
      options: ["Sie wird gereinigt und wieder befüllt.", "Sie wird sofort zusammengepresst.", "Sie wird zu Fasern für Kleidung verarbeitet.", "Sie wird in einer Müllverbrennungsanlage verbrannt."], answer: 0, points: 1 },

    /* --- Transfer --- */
    ausM(21), ausM(23),
    { teil: TR, modul: "ku4", transfer: true, type: "choice", prompt: "Tim hat einen Joghurt mit Deckel aus Aluminium gegessen. Was sollte er tun, bevor er den Becher in den gelben Sack wirft?",
      options: ["Den Deckel ganz abziehen und beides einzeln einwerfen.", "Den Deckel fest auf den Becher drücken.", "Den Becher in Papier einwickeln.", "Den Becher mit dem Deckel in den Restmüll werfen."], answer: 0, points: 1 }
  ]
};

module.exports = { probeM, probeR };
