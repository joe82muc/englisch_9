"use strict";
// Probe 3 Kunststoffe – Wunsch der Lehrkraft am 19.11.2026: „erstelle weiter probe zu nt 9a M zu kunststoffen. nur module
// P1-P3. so wie die andere Probe mit module P1-P5“ (gemeint: Probe 2 Kunststoffe, nt9-kunststoffe2.js).
//
// Nur 9M: Kennung nt9m-kunststoffe3 mit M-Schlüssel (50 % = Note 4), je Klasse freischaltbar, zuerst gesperrt.
// (In 9R ist P3 nur ein Zusatzmodul und die Polymerisation freiwillig – deshalb keine R-Fassung.)
// Aufbau wie Probe 2: nach den Regelhefteinträgen und Übungen der Module P1 bis P3 (9M/NT_9/App13_Kunststoffe), je Modul
// 16 Punkte, dazu 5 Punkte Transfer: 22 Aufgaben, 53 Punkte, 6 offene Fragen, 45 Minuten, übliche Testregeln (Note 6 bei
// Verlassen über 1 Minute bzw. 2. Kopierversuch, Note erst nach der Rückgabe). Andere Aufgaben als in Probe 1 und 2.
// 9 animierte Bilder nach den Animationen der Module: assets/probe/ku3-*.svg in 9M (App12_Organische_Rohstoffe),
// gebaut mit .codex-build/nt9-werkzeug/bau-ku3-bilder.js.
// Bei Ankreuzaufgaben steht die richtige Antwort zuerst (answer: 0), gemischt wird beim Laden (proben-mischen.js).
// Rechtschreibung zählt nie.

const T1 = "Vielfalt der Kunststoffe";
const T2 = "Bau und Einteilung der Kunststoffe";
const T3 = "Kunststoffe verarbeiten";
const TR = "Transfer";
const TITEL = { ku1: T1, ku2: T2, ku3: T3 };

const bild = (name, alt) => ({ image: "assets/probe/ku3-" + name + ".svg", imageAlt: alt });
const BILD = {
  isolator: bild("isolator", "Animation mit drei Bildern. A: Ein Ladekabel steckt in der Steckdose, eine Hand hält das Kabel an seiner Hülle aus Kunststoff. Im Kupferdraht innen fließt Strom (gelbe Punkte), die Hand bekommt keinen Schlag. B: Eine Bratpfanne aus Metall steht auf der heißen Herdplatte und glüht rot, der Griff aus Kunststoff bleibt blau, ein Thermometer am Griff zeigt nur wenig an. C: Eine Regentonne aus Kunststoff steht im Regen, die Jahre zählen von 1 bis 10 hoch, die Tonne bleibt unverändert."),
  codes: bild("codes", "Animation: links eine Shampooflasche, rechts eine Plastiktüte. Eine Lupe wandert zu den Zeichen: Auf der Flasche steht im Pfeil-Dreieck 02 und darunter PE-HD, auf der Tüte 04 und darunter PE-LD. Eine Hand drückt auf die Flasche, sie bleibt fest. Die Tüte lässt sich leicht zusammenknüllen."),
  wasser: bild("wasser", "Animation mit zwei Versuchen und vier Proben: A Trinkflasche, B Deckel einer Brotzeitbox, C Eimer, D Lichtschalter. Obere Reihe Versuch 1, kaltes Wasser: Die Proben fallen in je ein Glas Wasser. B und C bleiben oben schwimmen, A und D sinken auf den Boden. Untere Reihe Versuch 2, heißes Wasser mit etwa 75 Grad Celsius: Jede Probe wird mit einer Tiegelzange als Streifen ins heiße Wasser gehalten. Nur der Streifen A biegt sich, B, C und D bleiben gerade."),
  klammer: bild("klammer", "Animation mit einem Modell aus Büroklammern. Zuerst liegen acht einzelne Büroklammern durcheinander. Dann rücken sie in eine Reihe und haken sich eine nach der anderen aneinander. Am Ende ist daraus eine lange Kette geworden, rechts deuten drei Punkte an, dass sie noch viel länger weitergeht."),
  zieh: bild("zieh", "Animation: Drei Kunststoffstreifen A, B und C werden von zwei Klammern an beiden Enden auseinandergezogen und dann losgelassen. Streifen A wird lang und bleibt nach dem Loslassen lang. Streifen B wird lang und springt nach dem Loslassen in seine alte Länge zurück. Streifen C gibt nicht nach, bekommt einen Riss und bricht in zwei Stücke."),
  granulat: bild("granulat", "Animation: Links ein Werk 1. Aus einem Rohr fallen kleine Körnchen in Säcke. Ein Lastwagen bringt die Säcke nach rechts zu einem Werk 2. Dort werden die Körnchen in einer Maschine heiß gemacht und geschmolzen, auf einem Band kommen fertige Eimer und Schüsseln heraus."),
  extruder: bild("extruder", "Animation einer Schmelzpresse (Extruder) im Schnitt mit vier Buchstaben. A: oben ein Trichter, durch den Körnchen nach unten in ein Rohr fallen. B: rote Bänder rund um das Rohr, die heiß werden und glühen. C: im Rohr eine Metallwendel, die sich dreht und die Masse nach rechts schiebt. D: die Öffnung am rechten Ende, aus der ein langer, weicher Strang herauskommt."),
  giessen: bild("giessen", "Animation eines Versuchs. Eine Dose mit Kunststoffkörnchen steht auf einer Heizplatte, die Körnchen schmelzen langsam zu einer zähen Masse. Eine Hand mit Schutzhandschuh gießt die Schmelze durch einen Trichter in eine geschlossene Form aus zwei Hälften. Eine Schneeflocke zeigt: Die Form kühlt ab. Dann öffnet sich die Form und ein fertiger Becher liegt darin."),
  brennen: bild("brennen", "Animation: Zwei Kunststoffproben X und Y werden mit einer Tiegelzange in die Flamme eines Brenners gehalten. Probe X brennt mit einer kleinen, hellen Flamme ohne Rauch und tropft ab, darüber steht: Kohlenstoffdioxid und Wasser. Probe Y brennt mit einer großen, flackernden Flamme, darüber steigt dicker schwarzer Rauch mit Rußflocken auf.")
};

const ITEMS = [
  /* --- P1 Vielfalt der Kunststoffe (16 Punkte) --- */
  { teil: T1, modul: "ku1", ...BILD.isolator, type: "match",
    prompt: "Die Animation zeigt drei Gegenstände mit Teilen aus Kunststoff. Welcher Vorteil von Kunststoffen wird jeweils genutzt? Ordne zu.",
    options: ["Kunststoff leitet keinen Strom (Isolator).", "Kunststoff ist wärmeisolierend.", "Kunststoff ist beständig gegen Wasser und Luft – er rostet und fault nicht.", "Kunststoff ist biologisch abbaubar."],
    rows: [{ text: "A: Hülle des Ladekabels", answer: 0 }, { text: "B: Griff der Bratpfanne", answer: 1 }, { text: "C: Regentonne", answer: 2 }] },
  { teil: T1, modul: "ku1", type: "text",
    prompt: "Lisa sagt: „Kunststoff ist der perfekte Werkstoff – er hat überhaupt keine Nachteile.“ Widersprich ihr: Nenne drei verschiedene Nachteile von Kunststoffen.",
    expected: "Kunststoffe verkratzen leicht. Viele sind temperaturempfindlich und werden schon in heißem Wasser weich. Im Sonnenlicht werden sie mit der Zeit spröde und brüchig. Ein kaputtes Kunststoffteil lässt sich meist nicht reparieren. Die meisten Kunststoffe sind nicht biologisch abbaubar – Plastikmüll und Mikroplastik sammeln sich in der Natur an.",
    kriterien: "Je 1 Punkt für jeden verschiedenen richtigen Nachteil, höchstens 3: verkratzt leicht (nicht sehr hart); temperaturempfindlich (wird in Wärme bzw. heißem Wasser weich); wird mit der Zeit (im Sonnenlicht) spröde, brüchig; lässt sich kaum reparieren; nicht biologisch abbaubar, verrottet nicht (Plastikmüll, Mikroplastik in der Natur oder im Meer – das zählt zusammen nur als EIN Nachteil). Auch richtig: wird meist aus Erdöl hergestellt (begrenzter Rohstoff).",
    keywords: ["kratz", "temperatur", "weich", "spröde", "brüchig", "sonne", "reparier", "abbaubar", "verrott", "mikroplastik", "müll", "erdöl"], points: 3, lines: 5 },
  { teil: T1, modul: "ku1", ...BILD.codes, type: "choice",
    prompt: "Auf der Shampooflasche steht der Recycling-Code 02 PE-HD, auf der Tüte 04 PE-LD. Welche Aussage stimmt?",
    options: ["Beide sind aus Polyethen: die Flasche aus der festeren Sorte (hohe Dichte), die Tüte aus der weicheren (niedrige Dichte).", "Die Flasche ist aus Polyethen, die Tüte aus Polystyrol – deshalb haben die beiden verschiedene Nummern.", "Beide sind aus PET; die Nummer zeigt nur, wie oft der Kunststoff schon recycelt wurde.", "Die Nummer zeigt, wie lange das Produkt haltbar ist: die Tüte doppelt so lange wie die Flasche."], answer: 0, points: 1 },
  { teil: T1, modul: "ku1", type: "match",
    prompt: "Was bedeutet der Recycling-Code? Ordne zu.",
    options: ["Polyvinylchlorid", "Polyethen mit hoher Dichte", "andere Kunststoffe", "Polypropen"],
    rows: [{ text: "03 PVC", answer: 0 }, { text: "02 PE-HD", answer: 1 }, { text: "07", answer: 2 }] },
  { teil: T1, modul: "ku1", ...BILD.wasser, type: "match",
    prompt: "Die Animation zeigt zwei Versuche mit vier Kunststoffproben. Welches Ergebnis hat jede Probe? Ordne zu.",
    options: ["schwimmt – bleibt in heißem Wasser fest", "sinkt – wird in heißem Wasser weich", "sinkt – bleibt in heißem Wasser fest", "schwimmt – wird in heißem Wasser weich"],
    rows: [{ text: "Probe A (Trinkflasche)", answer: 1 }, { text: "Probe B (Deckel der Brotzeitbox)", answer: 0 }, { text: "Probe C (Eimer)", answer: 0 }, { text: "Probe D (Lichtschalter)", answer: 2 }] },
  { teil: T1, modul: "ku1", type: "text",
    prompt: "Du willst herausfinden, ob ein Kunststoff temperaturempfindlich ist. Beschreibe den Versuch und worauf du dabei achten musst.",
    expected: "Ich lege die Kunststoffprobe in heißes Wasser (etwa 75 °C) und versuche, sie mit zwei Tiegelzangen zu verbiegen. Wird sie weich und lässt sich biegen, ist der Kunststoff temperaturempfindlich. Achtung: Heißes Wasser nur zusammen mit der Lehrkraft und mit Tiegelzangen – sonst kann man sich verbrühen.",
    kriterien: "1 Punkt: Durchführung und Auswertung – die Probe in heißes Wasser legen und versuchen, sie zu verbiegen; wird sie weich (biegsam), ist der Kunststoff temperaturempfindlich. Nur „ins heiße Wasser legen“ ohne Beobachtung reicht auch für diesen Punkt. 1 Punkt: Sicherheit – Tiegelzange(n) benutzen, nur mit der Lehrkraft, Vorsicht vor Verbrühungen (heißes Wasser).",
    keywords: ["heiß", "wasser", "75", "biegen", "verbieg", "weich", "zange", "tiegel", "lehrkraft", "lehrer", "verbrüh", "vorsicht"], points: 2, lines: 4 },

  /* --- P2 Bau und Einteilung der Kunststoffe (16 Punkte) --- */
  { teil: T2, modul: "ku2", ...BILD.klammer, type: "match",
    prompt: "Die Animation zeigt ein Modell für den Aufbau eines Kunststoffs. Was stellt das Modell jeweils dar? Ordne zu.",
    options: ["ein Monomer (einzelner Baustein)", "ein Polymer (Makromolekül)", "die Polymerisation", "ein Katalysator"],
    rows: [{ text: "eine einzelne Büroklammer", answer: 0 }, { text: "die lange Kette aus Büroklammern", answer: 1 }, { text: "das Aneinanderhaken der Büroklammern", answer: 2 }] },
  { teil: T2, modul: "ku2", type: "choice",
    prompt: "Was muss ein Molekül haben, damit es wie Ethen zu langen Ketten polymerisieren kann?",
    options: ["eine C=C-Doppelbindung", "mindestens zehn Wasserstoff-Atome", "schon eine lange Kette aus C-Atomen", "einen Recycling-Code"], answer: 0, points: 1 },
  { teil: T2, modul: "ku2", type: "match",
    prompt: "So entsteht aus Ethen der Kunststoff Polyethen. Bringe die Schritte in die richtige Reihenfolge: Ordne jedem Schritt den passenden Satz zu.",
    options: ["Viele einzelne Ethen-Moleküle mit einer C=C-Doppelbindung liegen nebeneinander.", "Ein Katalysator spaltet die C=C-Doppelbindungen auf.", "Jedes C-Atom hat einen freien „Haken“ und verbindet sich mit dem nächsten Molekül.", "Es entsteht eine lange Kette mit C–C-Einfachbindungen: Polyethen."],
    rows: [{ text: "1. Schritt", answer: 0 }, { text: "2. Schritt", answer: 1 }, { text: "3. Schritt", answer: 2 }, { text: "4. Schritt", answer: 3 }] },
  { teil: T2, modul: "ku2", ...BILD.zieh, type: "match",
    prompt: "In der Animation werden drei Kunststoffstreifen auseinandergezogen. Zu welcher Kunststoffgruppe gehört jeder Streifen? Ordne zu.",
    options: ["Thermoplast", "Elastomer", "Duroplast"],
    rows: [{ text: "Streifen A", answer: 0 }, { text: "Streifen B", answer: 1 }, { text: "Streifen C", answer: 2 }] },
  { teil: T2, modul: "ku2", type: "match",
    prompt: "Aus welcher Kunststoffgruppe ist jeder dieser Alltagsgegenstände gemacht? Ordne zu.",
    options: ["Thermoplast", "Elastomer", "Duroplast"],
    rows: [{ text: "Gummiring", answer: 1 }, { text: "Lichtschalter", answer: 2 }, { text: "Wasserflasche", answer: 0 }] },
  { teil: T2, modul: "ku2", type: "text",
    prompt: "Ein Fitnessband geht nach dem Dehnen wieder in seine alte Form zurück. Ein Lichtschalter gibt nicht nach und bricht bei zu großer Kraft. Erkläre beides mit dem Bau der Ketten.",
    expected: "Das Fitnessband ist ein Elastomer: Seine Ketten sind weitmaschig (locker) vernetzt. Beim Dehnen werden die Ketten gestreckt, das lockere Netz zieht sie danach wieder in die Ausgangsform zurück. Der Lichtschalter ist ein Duroplast: Seine Ketten sind engmaschig vernetzt. Sie können sich nicht strecken und nicht aneinander vorbeigleiten – deshalb gibt er nicht nach und bricht bei zu großer Kraft.",
    kriterien: "1 Punkt: Fitnessband = Elastomer, die Ketten sind weitmaschig (locker, wenig) vernetzt und werden beim Loslassen zurückgezogen. 1 Punkt: Lichtschalter = Duroplast, die Ketten sind engmaschig (eng, stark, viel) vernetzt und können sich nicht bewegen bzw. nicht gleiten. Nur die Gruppennamen ohne die Ketten: zusammen höchstens 1 Punkt.",
    keywords: ["elastomer", "duroplast", "ketten", "weitmaschig", "locker", "engmaschig", "vernetzt", "netz", "zurück", "gleiten", "strecken"], points: 2, lines: 5 },

  /* --- P3 Kunststoffe verarbeiten (16 Punkte) --- */
  { teil: T3, modul: "ku3", ...BILD.granulat, type: "match",
    prompt: "Die Animation zeigt den Weg vom Kunststoff zum fertigen Eimer. Wie heißen Werk 1, Werk 2 und der Inhalt der Säcke? Ordne zu.",
    options: ["chemische Industrie", "verarbeitende Industrie", "Granulat", "Raffinerie"],
    rows: [{ text: "Werk 1", answer: 0 }, { text: "Werk 2", answer: 1 }, { text: "Inhalt der Säcke", answer: 2 }] },
  { teil: T3, modul: "ku3", ...BILD.extruder, type: "match",
    prompt: "Die Animation zeigt eine Schmelzpresse (Extruder). Wie heißen die Teile A bis D? Ordne zu.",
    options: ["Trichter", "Heizbänder", "Schnecke", "Düse", "Hohlform"],
    rows: [{ text: "A", answer: 0 }, { text: "B", answer: 1 }, { text: "C", answer: 2 }, { text: "D", answer: 3 }] },
  { teil: T3, modul: "ku3", type: "text",
    prompt: "Die Schmelzpresse (Extruder) arbeitet ähnlich wie ein Fleischwolf. Erkläre, was die beiden gemeinsam haben und was beim Extruder anders ist.",
    expected: "Gemeinsam: In beiden dreht sich eine Schnecke. Sie presst die Masse zusammen und schiebt sie nach vorn, am Ende kommt sie als Strang heraus. Anders: Der Extruder ist beheizt. Heizbänder machen die Kunststoffkörnchen weich, sie schmelzen zu einer zähen Masse.",
    kriterien: "1 Punkt: Gemeinsamkeit – eine (Metall-)Schnecke dreht sich, presst die Masse und schiebt sie nach vorn bzw. drückt sie als Strang heraus. 1 Punkt: Unterschied – der Extruder ist beheizt (Heizung, Heizbänder), der Kunststoff wird weich bzw. geschmolzen.",
    keywords: ["schnecke", "dreht", "presst", "drückt", "schiebt", "nach vorn", "strang", "beheizt", "heiz", "heiß", "warm", "schmilzt", "schmelz", "weich"], points: 2, lines: 4 },
  { teil: T3, modul: "ku3", ...BILD.giessen, type: "choice",
    prompt: "Die Animation zeigt einen Versuch im Kleinen. Welches Verfahren der Industrie funktioniert genauso?",
    options: ["Spritzgießen", "Strangpressen", "Folienblasen", "Polymerisation"], answer: 0, points: 1 },
  { teil: T3, modul: "ku3", type: "text",
    prompt: "Müllbeutel werden durch Folienblasen hergestellt. Beschreibe, wie aus Kunststoff-Granulat ein Müllbeutel entsteht.",
    expected: "Das Granulat wird in der Schmelzpresse (Extruder) geschmolzen. Die Schmelze wird mit Druckluft zu einem weiten Schlauch aufgeblasen. Der Schlauch wird aufgerollt, zu Folien geschnitten und in Abständen verschweißt – so entstehen Müllbeutel.",
    kriterien: "1 Punkt: Das Granulat wird geschmolzen bzw. weich gemacht (im Extruder, in der Schmelzpresse, mit Hitze). 1 Punkt: Die Schmelze wird mit (Druck-)Luft zu einem Schlauch aufgeblasen. 1 Punkt: Der Schlauch bzw. die Folie wird (zu Folien) geschnitten und verschweißt (zugeschweißt).",
    keywords: ["geschmolzen", "schmelz", "extruder", "heiß", "weich", "druckluft", "luft", "aufgeblasen", "schlauch", "geschnitten", "schneid", "verschweißt", "schweiß"], points: 3, lines: 5 },
  { teil: T3, modul: "ku3", ...BILD.brennen, type: "match",
    prompt: "In der Animation hält die Lehrkraft zwei Kunststoffproben in eine Flamme. Polyethen (PE) oder Polystyrol (PS)? Ordne zu.",
    options: ["Polyethen (PE)", "Polystyrol (PS)"],
    rows: [{ text: "Probe X", answer: 0 }, { text: "Probe Y", answer: 1 }, { text: "hart und spröde", answer: 1 }] },

  /* --- Transfer (5 Punkte) --- */
  { teil: TR, modul: "ku2", transfer: true, type: "text",
    prompt: "Eine Firma möchte alte Lichtschalter aus Duroplast im Extruder einschmelzen und daraus neue Rohre pressen. Erkläre, warum das nicht klappt.",
    expected: "Im Extruder muss der Kunststoff weich werden und schmelzen, damit man ihn formen kann – das geht nur bei Thermoplasten. Die Ketten im Duroplast sind engmaschig vernetzt und können nicht aneinander vorbeigleiten. Er wird deshalb beim Erwärmen nicht weich, sondern zersetzt sich bei sehr großer Hitze (er verkohlt und qualmt).",
    kriterien: "1 Punkt: Ein Duroplast wird beim Erwärmen nicht weich bzw. schmilzt nicht, er zersetzt sich (verkohlt) bei großer Hitze – der Extruder braucht weichen, geschmolzenen Kunststoff (geht nur mit Thermoplasten). 1 Punkt: Begründung mit den Ketten: engmaschig vernetzt, sie können nicht aneinander vorbeigleiten.",
    keywords: ["weich", "schmilzt", "schmelzen", "zersetzt", "verkohlt", "qualmt", "vernetzt", "engmaschig", "ketten", "gleiten", "thermoplast"], points: 2, lines: 4 },
  { teil: TR, modul: "ku1", transfer: true, type: "choice",
    prompt: "Am Strand findet Tim ein zerbrochenes Kunststoffteil mit dem Recycling-Code 06 PS. Was könnte es gewesen sein?",
    options: ["ein Joghurtbecher", "der Deckel einer Brotzeitbox", "eine Getränkeflasche", "ein Fahrradschlauch"], answer: 0, points: 1 },
  { teil: TR, modul: "ku3", transfer: true, type: "choice",
    prompt: "Eine Firma braucht 100 000 Karosserien für ein Spielzeugauto, die alle genau gleich aussehen. Welches Verfahren passt am besten?",
    options: ["Spritzgießen", "Strangpressen", "Folienblasen", "jede Karosserie einzeln von Hand schnitzen"], answer: 0, points: 1 },
  { teil: TR, modul: "ku2", transfer: true, type: "choice",
    prompt: "Ein Hersteller möchte einen Kunststoff mit anderen Eigenschaften, zum Beispiel härter. Was kann er dafür verändern?",
    options: ["welche und wie viele Monomere er verwendet und wie sie miteinander verknüpft sind", "nur die Farbe des Granulats", "die Nummer im Recycling-Code", "die Größe der Säcke, in denen das Granulat geliefert wird"], answer: 0, points: 1 }
];

// Probe 3 Kunststoffe nur für 9M: M-Schlüssel (notenzug), übliche Testregeln
function kunststoffProbe3() {
  return {
    id: "nt9m-kunststoffe3",
    title: "Probe 3 Kunststoffe P1–P3 (9M)",
    unit: "NT 9M · Kunststoffe: Vielfalt, Bau und Einteilung, Verarbeitung (Module P1 bis P3)",
    classLevel: "9M", thema: "kunststoffe", minutes: 45, notenzug: "M",
    items: ITEMS.map((it) => ({
      ...JSON.parse(JSON.stringify(it)),
      ...(it.type === "match" ? { points: it.rows.length } : {}),
      // Notfall ohne KI: zwei passende Stichwörter reichen für volle Punkte (die Abgabe wird zur Prüfung markiert)
      ...(it.type === "text" ? { keywordsVoll: 2 } : {}),
      modulTitel: TITEL[it.modul]
    }))
  };
}

module.exports = { ITEMS, kunststoffProbe3 };
