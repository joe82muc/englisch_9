"use strict";
// Probe 2 Kunststoffe – Wunsch der Lehrkraft am 18.11.2026: „erstelle für 9m probe zum thema kunststoffe. modul P1-P5.
// orientiere dich stark an den Regelhefteinträgen und den inhalten der der module. stelle auch ein paar offene fragen.
// baue auch animationne aus den modulen ein. m-schlüssel und r-schlüssel.“
//
// Eine Aufgabenliste, zwei Kennungen (wie Englisch 7 Probe 1): nt9m-kunststoffe2 für 9M mit M-Schlüssel (50 % = Note 4),
// nt9r-kunststoffe2 für 9R mit R-Schlüssel (50 % = Note 3) – so schaltet die Lehrkraft jede Klasse getrennt frei.
// Inhalt: Regelhefteinträge und Übungen der Module P1 bis P5 (9M/NT_9/App13_Kunststoffe), je Modul 10 bis 11 Punkte,
// dazu 5 Punkte Transfer: 25 Aufgaben, 58 Punkte, 6 offene Fragen, 45 Minuten, übliche Testregeln (Note 6 bei Verlassen
// über 1 Minute bzw. 2. Kopierversuch, Note erst nach der Rückgabe). Die erste Kunststoff-Probe (nt9-block-kunststoffe.js)
// bleibt unverändert.
// 15 animierte Bilder nach den Animationen der Module: assets/probe/ku2-*.svg in 9M und 9R (App12_Organische_Rohstoffe),
// gebaut mit .codex-build/nt9-werkzeug/bau-ku2-bilder.js.
// Bei Ankreuzaufgaben steht die richtige Antwort zuerst (answer: 0), gemischt wird beim Laden (proben-mischen.js).
// Rechtschreibung zählt nie. Fakten wie in den Modulen (PET: „weniger als die Hälfte“ wird wieder zur Flasche).

const T1 = "Vielfalt der Kunststoffe";
const T2 = "Bau und Einteilung der Kunststoffe";
const T3 = "Kunststoffe verarbeiten";
const T4 = "Kunststoffmüll und Recycling";
const T5 = "Die PET-Flasche: Kreislauf und Ökobilanz";
const TR = "Transfer";
const TITEL = { ku1: T1, ku2: T2, ku3: T3, ku4: T4, ku5: T5 };

const bild = (name, alt) => ({ image: "assets/probe/ku2-" + name + ".svg", imageAlt: alt });
const BILD = {
  eimer: bild("eimer", "Animation: Drei Eimer erscheinen nacheinander auf je einer Waage. Vor etwa 120 Jahren ein Eimer aus Holz – er bekommt dunkle Flecken (fault mit der Zeit), die Waage zeigt schwer. Vor etwa 70 Jahren ein Eimer aus Blech – er bekommt Rostflecken, die Waage zeigt schwer. Heute ein Eimer aus Kunststoff – die Waage zeigt leicht."),
  stuhl: bild("stuhl", "Animation: Ein weißer Gartenstuhl aus Kunststoff steht in der Sonne. Nach 2 Sommern ist er gelblich, nach einigen Jahren hat er Risse. Noch später bricht ein Bein ab und am Boden liegen viele kleine Krümel."),
  labor: bild("labor", "Animation mit vier Versuchen. Versuch 1: Ein Nagel ritzt über eine Kunststoffprobe und hinterlässt eine Spur. Versuch 2: Eine Probe wird in einen Stromkreis mit Batterie und Lämpchen geklemmt, das Lämpchen bleibt dunkel. Versuch 3: Vier Proben fallen in ein Glas Wasser, zwei bleiben oben, zwei sinken auf den Boden. Versuch 4: Zwei Streifen hängen in heißem Wasser, einer verbiegt sich, der andere bleibt gerade."),
  zoom: bild("zoom", "Animation: Eine Lupe vergrößert die Wand eines Kunststoffeimers. Man sieht ein dichtes Gewirr aus Fäden. Ein Faden wird hervorgehoben und als lange Kette aus vielen gleichen Perlen gezeigt."),
  poly: bild("poly", "Drei Bilder mit Formeln. Bild A: viele C-Atome hintereinander, jedes mit zwei H-Atomen, verbunden durch einfache Striche, an den Enden geht es weiter. Bild B: drei einzelne Moleküle aus je zwei C-Atomen mit zwei Strichen dazwischen und je vier H-Atomen. Bild C: ein gelber Kreis mit der Aufschrift Katalysator kommt zu einem solchen Molekül, einer der beiden Striche zwischen den C-Atomen verschwindet, an beiden C-Atomen erscheint ein roter Haken."),
  waerme: bild("waerme", "Animation: links ein Kasten Thermoplast mit Ketten ohne Verbindungen, rechts ein Kasten Duroplast mit Ketten, die durch viele kurze Striche verbunden sind. Beide werden mit einer Flamme erwärmt. Der Thermoplast sackt zusammen und zerfließt. Der Duroplast behält seine Form; bei sehr starker Hitze wird er dunkel und es steigt Rauch auf."),
  verfahren: bild("verfahren", "Animation mit drei Bildern. A: Geschmolzener Kunststoff wird aus einer Düse in eine Hohlform gepresst, die Form öffnet sich und eine Schüssel fällt heraus. B: Aus einem Ring unten wächst ein Schlauch, der von innen mit Luft zu einer großen Blase aufgeblasen und oben zwischen zwei Walzen flach gedrückt wird. C: Granulat fällt in ein beheiztes Rohr, vorne kommt aus einer Düse ein langes Rohr heraus, daneben liegen fertige Rohrstücke."),
  schaum: bild("schaum", "Abbildung: eine Hauswand mit einer Dämmplatte aus Styropor. Eine Lupe zeigt 100 Felder: 98 helle Felder stehen für Luft, 2 dunkle Felder für Polystyrol (Kunststoff)."),
  meer: bild("meer", "Animation: Eine Plastiktüte, eine Flasche und ein Becher liegen an Land neben einem Mülleimer. Regen und Wind tragen sie in einen Fluss. Der Fluss spült sie ins Meer, dort treiben sie in einen Müllstrudel. Im Meer schwimmen viele winzige Plastikteilchen und eine Schildkröte."),
  mikro: bild("mikro", "Animation: Eine Plastikflasche treibt im Meer. Über viele Jahre zerbricht sie durch Sonne, Wind und Wellen in Stücke, dann in Splitter und am Ende in winzige Teilchen. Eine Lupe zeigt: Die Teilchen sind kleiner als ein Strich von 5 Millimetern."),
  anteile: bild("anteile", "Balkendiagramm: Wie wird Kunststoffabfall in Deutschland verwertet? Balken A: 46,4 Prozent. Balken B: 52,8 Prozent. Balken C: 0,2 Prozent. Darunter: Der Rest (0,6 Prozent) kommt auf die Deponie."),
  kreis: bild("kreis", "Animation: Der Weg einer PET-Einwegflasche als Kreis. Von Erdöl über die Raffinerie zum PET-Granulat, dann im Kreis weiter zu den Stationen Rohling, Abfüller, Geschäft, Pfandautomat und Schredder-Anlage. Von dort führen Flakes zurück zum Granulat. Ein Punkt läuft den Weg ab."),
  hundert: bild("hundert", "Animation: 100 Punkte stehen für 100 gesammelte PET-Einwegflaschen. 40 Punkte werden grün: Sie werden wieder zu einer neuen Getränkeflasche. 60 Punkte werden orange: Sie werden zu Fasern, Folien oder Behältern für Nicht-Lebensmittel."),
  fuell: bild("fuell", "Abbildung: So viele neue Flaschen braucht man für 50 Füllungen. Zeile A: 3 kleine Flaschen. Zeile B: 50 kleine Flaschen. Zeile C: 1 kleine Flasche."),
  thermo: bild("thermo", "Animation mit zwei Thermometern: So heiß wird das Material für eine neue Flasche gemacht. Bei PET steigt das Thermometer auf etwa 250 Grad Celsius, bei Glas auf etwa 1600 Grad Celsius.")
};

const ITEMS = [
  /* --- P1 Vielfalt der Kunststoffe (11 Punkte) --- */
  { teil: T1, modul: "ku1", ...BILD.eimer, type: "text",
    prompt: "Die Animation zeigt Eimer aus drei Zeiten. Heute ist fast jeder Eimer aus Kunststoff. Begründe das mit drei verschiedenen Vorteilen von Kunststoffen. Mindestens ein Vorteil soll nicht in der Animation zu sehen sein.",
    expected: "Kunststoffe sind leicht – die Waage zeigt beim Kunststoffeimer am wenigsten an. Sie sind beständig gegen Wasser, Luft und viele Chemikalien: Sie rosten nicht und faulen nicht. Außerdem lassen sie sich schnell, günstig und genau passend in Form und Eigenschaften herstellen. (Auch richtig: Sie leiten keinen Strom, sie isolieren Wärme.)",
    kriterien: "Je 1 Punkt für jeden verschiedenen richtigen Vorteil, höchstens 3: leicht; beständig gegen Wasser, Luft und Chemikalien (rostet nicht, fault nicht, verrottet nicht – das zählt zusammen nur als EIN Vorteil); leitet keinen Strom (Isolator); wärmeisolierend; maßgeschneidert, in jeder Form und mit passenden Eigenschaften herstellbar; schnell, günstig, billig in großen Mengen herzustellen.",
    keywords: ["leicht", "rost", "fault", "beständig", "strom", "isolier", "wärme", "billig", "günstig", "schnell", "form", "maßgeschneidert"], points: 3, lines: 5 },
  { teil: T1, modul: "ku1", ...BILD.stuhl, type: "choice",
    prompt: "Ein Gartenstuhl aus Kunststoff steht viele Jahre in der Sonne. Welche Nachteile von Kunststoffen zeigt die Animation?",
    options: ["Er wird im Sonnenlicht spröde, bricht und zerfällt nur in immer kleinere Teilchen.", "Er rostet im Regen und wird dabei mit den Jahren immer schwerer.", "Er wird im Sonnenlicht weich und lässt sich dann biegen wie Gummi.", "Er verrottet nach wenigen Jahren vollständig und wird zu guter Erde."], answer: 0, points: 1 },
  { teil: T1, modul: "ku1", type: "match",
    prompt: "Der Recycling-Code nennt die Kunststoffsorte. Ordne jedem Code den richtigen Kunststoff zu.",
    options: ["Polyethylenterephthalat", "Polyvinylchlorid", "Polypropen", "Polystyrol"],
    rows: [{ text: "01 PET", answer: 0 }, { text: "05 PP", answer: 2 }, { text: "06 PS", answer: 3 }] },
  { teil: T1, modul: "ku1", ...BILD.labor, type: "match",
    prompt: "Die Animation zeigt vier Versuche mit Kunststoffproben. Was zeigt jeder Versuch? Ordne zu.",
    options: ["Kunststoffe lassen sich leicht zerkratzen.", "Kunststoffe leiten keinen Strom.", "Manche Kunststoffe sind leichter als Wasser, andere schwerer.", "Manche Kunststoffe werden schon in heißem Wasser weich."],
    rows: [{ text: "Versuch 1", answer: 0 }, { text: "Versuch 2", answer: 1 }, { text: "Versuch 3", answer: 2 }, { text: "Versuch 4", answer: 3 }] },

  /* --- P2 Bau und Einteilung der Kunststoffe (10 Punkte) --- */
  { teil: T2, modul: "ku2", ...BILD.zoom, type: "choice",
    prompt: "Die Animation zoomt in die Wand eines Kunststoffeimers. Was zeigt sie über den Aufbau von Kunststoffen?",
    options: ["Sie bestehen aus sehr langen Ketten aus vielen, meist gleichen Bausteinen.", "Sie bestehen aus einzelnen kleinen Kugeln, die nicht miteinander verbunden sind.", "Sie bestehen aus winzigen Fäden aus Metall, die fest miteinander verflochten sind.", "Sie bestehen aus sehr kurzen Molekülen, die jeweils nur zwei Atome haben."], answer: 0, points: 1 },
  { teil: T2, modul: "ku2", ...BILD.poly, type: "match",
    prompt: "Die Animation zeigt drei Bilder zur Herstellung von Polyethen aus Ethen. Was zeigt welches Bild? Ordne zu.",
    options: ["viele einzelne Ethen-Moleküle mit einer C=C-Doppelbindung", "Ein Katalysator spaltet die Doppelbindung auf.", "eine lange Kette mit C–C-Einfachbindungen: Polyethen"],
    rows: [{ text: "Bild A", answer: 2 }, { text: "Bild B", answer: 0 }, { text: "Bild C", answer: 1 }] },
  { teil: T2, modul: "ku2", type: "match",
    prompt: "Zu welcher Kunststoffgruppe gehört der Gegenstand? Ordne zu.",
    options: ["Thermoplast", "Elastomer", "Duroplast"],
    rows: [{ text: "Abwasserrohr", answer: 0 }, { text: "Matratze", answer: 1 }, { text: "Schutzhelm", answer: 2 }, { text: "Fitnessband", answer: 1 }] },
  { teil: T2, modul: "ku2", ...BILD.waerme, type: "text",
    prompt: "Die Animation zeigt einen Thermoplast und einen Duroplast beim Erwärmen. Erkläre mit dem Bau der Ketten, warum man einen alten Eimer aus Thermoplast einschmelzen und neu formen kann, eine Steckdose aus Duroplast aber nicht.",
    expected: "Beim Thermoplast liegen die Ketten nebeneinander, ohne miteinander verbunden zu sein. Beim Erwärmen gleiten sie aneinander vorbei – der Kunststoff wird weich und lässt sich beliebig oft neu formen. Beim Duroplast sind die Ketten engmaschig miteinander vernetzt. Sie können nicht aneinander vorbeigleiten. Deshalb wird er nicht weich, sondern zersetzt sich bei sehr großer Hitze (er verkohlt).",
    kriterien: "1 Punkt: Thermoplast – die Ketten sind nicht miteinander verbunden (nicht vernetzt) und gleiten beim Erwärmen aneinander vorbei, er wird weich und formbar. 1 Punkt: Duroplast – die Ketten sind eng (engmaschig) vernetzt und können nicht gleiten; er wird nicht weich, sondern zersetzt sich bei sehr großer Hitze. Nur „wird weich“ bzw. „bleibt hart“ ohne die Ketten: zusammen höchstens 1 Punkt.",
    keywords: ["ketten", "verbunden", "verbindung", "gleiten", "weich", "vernetzt", "engmaschig", "zersetzt", "verkohlt", "hart"], points: 2, lines: 5 },

  /* --- P3 Kunststoffe verarbeiten (11 Punkte) --- */
  { teil: T3, modul: "ku3", type: "choice",
    prompt: "Die chemische Industrie liefert Kunststoff als Granulat. Was macht die verarbeitende Industrie damit?",
    options: ["Sie schmilzt das Granulat und formt daraus Gegenstände.", "Sie stellt das Granulat in der Raffinerie aus Erdöl her.", "Sie sammelt alte Gegenstände ein und verbrennt sie.", "Sie mahlt fertige Gegenstände wieder zu feinem Pulver."], answer: 0, points: 1 },
  { teil: T3, modul: "ku3", ...BILD.verfahren, type: "match",
    prompt: "Die Animation zeigt drei Verfahren, mit denen Kunststoff geformt wird. Wie heißt das Verfahren? Ordne zu.",
    options: ["Spritzgießen", "Folienblasen", "Strangpressen"],
    rows: [{ text: "A", answer: 0 }, { text: "B", answer: 1 }, { text: "C", answer: 2 }] },
  { teil: T3, modul: "ku3", type: "match",
    prompt: "Polyethen (PE) oder Polystyrol (PS)? Ordne zu.",
    options: ["Polyethen (PE)", "Polystyrol (PS)"],
    rows: [{ text: "Müllsack", answer: 0 }, { text: "Joghurtbecher", answer: 1 }, { text: "verbrennt rückstandsfrei zu Kohlenstoffdioxid und Wasser", answer: 0 }, { text: "brennt mit stark rußender Flamme, dabei entstehen giftige Stoffe", answer: 1 }] },
  { teil: T3, modul: "ku3", ...BILD.schaum, type: "text",
    prompt: "Häuser werden oft mit Platten aus Styropor (geschäumtem Polystyrol) gedämmt. Erkläre mit der Abbildung, warum Styropor so gut dämmt. Welche Gefahr gibt es bei einem Brand?",
    expected: "Styropor besteht zu etwa 98 % aus eingeschlossener Luft und nur zu 2 % aus Kunststoff. Die eingeschlossene Luft hält die Wärme zurück, deshalb dämmt Styropor sehr gut. Aber es ist brennbar: Polystyrol brennt mit stark rußender Flamme, dabei entstehen giftige Stoffe.",
    kriterien: "1 Punkt: Styropor besteht fast nur aus (eingeschlossener) Luft, etwa 98 %. 1 Punkt: Die Luft hält die Wärme zurück, Styropor dämmt bzw. isoliert gut (hält Kälte draußen). 1 Punkt: Gefahr beim Brand: Styropor ist brennbar, brennt mit rußender Flamme oder es entstehen giftige Stoffe (Gase, Rauch).",
    keywords: ["luft", "98", "wärme", "dämm", "isolier", "kälte", "brennbar", "brennt", "ruß", "giftig"], points: 3, lines: 5 },

  /* --- P4 Kunststoffmüll und Recycling (11 Punkte) --- */
  { teil: T4, modul: "ku4", ...BILD.meer, type: "choice",
    prompt: "Die Animation zeigt, wie Plastikmüll ins Meer gelangt. Welche Aussage stimmt?",
    options: ["Das meiste Plastik im Meer kommt vom Land: Regen und Wind tragen es in Flüsse, die es ins Meer spülen.", "Das meiste Plastik im Meer wird von großen Schiffen absichtlich direkt ins Wasser gekippt.", "Plastik, das ins Meer gelangt, löst sich schon nach wenigen Wochen vollständig im Wasser auf.", "Plastik gelangt nur an den Badestränden ins Meer, über die Flüsse kommt so gut wie keines."], answer: 0, points: 1 },
  { teil: T4, modul: "ku4", ...BILD.mikro, type: "choice",
    prompt: "Die Animation zeigt, was mit einer Plastikflasche im Meer passiert. Welche Aussage stimmt?",
    options: ["Sie zerfällt in immer kleinere Teile, am Ende in Mikroplastik unter 5 mm – der Kunststoff ist nicht weg.", "Sie verrottet nach einigen Jahren vollständig, übrig bleiben nur Wasser und Kohlenstoffdioxid.", "Sie löst sich im salzigen Meerwasser nach und nach ganz auf, so wie Zucker in heißem Tee.", "Sie sinkt auf den Meeresgrund und wird dort im Lauf der Zeit wieder zu Erdöl umgewandelt."], answer: 0, points: 1 },
  { teil: T4, modul: "ku4", ...BILD.anteile, type: "match",
    prompt: "Das Diagramm zeigt, wie Kunststoffabfall in Deutschland verwertet wird. Ordne jedem Balken die Art der Verwertung zu.",
    options: ["werkstoffliche Verwertung", "thermische Verwertung", "rohstoffliche Verwertung"],
    rows: [{ text: "Balken A (46,4 %)", answer: 0 }, { text: "Balken B (52,8 %)", answer: 1 }, { text: "Balken C (0,2 %)", answer: 2 }] },
  { teil: T4, modul: "ku4", type: "match",
    prompt: "Wohin gehört der Abfall? Ordne zu.",
    options: ["gelber Sack", "Altglas", "Altpapier", "Restmüll"],
    rows: [{ text: "leere Konservendose", answer: 0 }, { text: "leeres Marmeladenglas", answer: 1 }, { text: "alte Zahnbürste", answer: 3 }] },
  { teil: T4, modul: "ku4", type: "text",
    prompt: "Beim Umgang mit Müll gilt die Reihenfolge „Vermeiden – Verwerten – Entsorgen“. Erkläre die drei Begriffe. Nenne zum Vermeiden ein Beispiel.",
    expected: "Vermeiden: Abfall gar nicht erst entstehen lassen, z. B. Mehrwegflasche, Brotzeitdose oder Stofftasche statt Plastiktüte. Verwerten: Aus Abfall wird wieder ein Rohstoff oder ein neues Produkt gemacht (Recycling, z. B. über den gelben Sack). Entsorgen: Was übrig bleibt, wird verbrannt oder auf einer Deponie gelagert.",
    kriterien: "1 Punkt: Vermeiden richtig erklärt (möglichst wenig Abfall entstehen lassen) ODER ein passendes Beispiel (Mehrweg, Brotzeitdose, Stofftasche, Leitungswasser, eigener Becher …). 1 Punkt: Verwerten = aus Abfall wieder einen Rohstoff oder ein neues Produkt machen (Recycling, umschmelzen, gelber Sack). 1 Punkt: Entsorgen = der Rest wird verbrannt oder auf einer Deponie gelagert.",
    keywords: ["weniger", "nicht entstehen", "sparen", "mehrweg", "dose", "tasche", "rohstoff", "neues produkt", "recycl", "verbrannt", "deponie", "rest"], points: 3, lines: 6 },

  /* --- P5 Die PET-Flasche: Kreislauf und Ökobilanz (10 Punkte) --- */
  { teil: T5, modul: "ku5", ...BILD.kreis, type: "match",
    prompt: "Die Animation zeigt den Weg einer PET-Einwegflasche. Was passiert an diesen Stationen? Ordne zu.",
    options: ["Aus geschmolzenem Granulat entsteht ein kleines, dickes Röhrchen mit Schraubgewinde.", "Die Rohlinge werden zu Flaschen aufgeblasen und mit Getränk gefüllt.", "Die leere Flasche wird zusammengepresst – sie ist damit zerstört.", "Die Flaschen werden zerkleinert und gewaschen, es entstehen Flakes."],
    rows: [{ text: "Rohling", answer: 0 }, { text: "Abfüller", answer: 1 }, { text: "Pfandautomat", answer: 2 }, { text: "Schredder-Anlage", answer: 3 }] },
  { teil: T5, modul: "ku5", ...BILD.hundert, type: "text",
    prompt: "Die Animation zeigt, was aus 100 gesammelten PET-Einwegflaschen wird. Erkläre, warum nur ein Teil wieder zu neuen Getränkeflaschen wird. Nenne zwei Gründe.",
    expected: "Für neue Getränkeflaschen muss das PET extrem rein sein (99,9 %) – schon wenige falsch sortierte oder verschmutzte Flaschen stören. Eingeschmolzenes PET ist außerdem oft leicht verfärbt. Ein Teil wird auch ins Ausland exportiert. Deshalb wird der größere Teil zu Fasern, Folien oder Behältern mit geringerer Qualität.",
    kriterien: "Je 1 Punkt für jeden richtigen Grund, höchstens 2: Getränkeflaschen brauchen sehr reines, sauberes, gut sortiertes Material (99,9 %) – falsch Sortiertes oder Verschmutztes stört; eingeschmolzenes PET ist oft verfärbt bzw. hat eine schlechtere Qualität; ein Teil wird ins Ausland exportiert. Nur „wird zu Fasern und Folien“ ohne Grund: 0 Punkte.",
    keywords: ["rein", "99", "sauber", "verschmutz", "sortiert", "verfärb", "farbe", "qualität", "ausland", "export"], points: 2, lines: 4 },
  { teil: T5, modul: "ku5", ...BILD.fuell, type: "match",
    prompt: "Für 50 Füllungen braucht man je nach Flasche verschieden viele neue Flaschen. Welche Flasche gehört zu A, B und C? Ordne zu.",
    options: ["PET-Mehrwegflasche", "PET-Einwegflasche", "Glas-Mehrwegflasche"],
    rows: [{ text: "A (3 Flaschen)", answer: 0 }, { text: "B (50 Flaschen)", answer: 1 }, { text: "C (1 Flasche)", answer: 2 }] },
  { teil: T5, modul: "ku5", ...BILD.thermo, type: "choice",
    prompt: "In einer Ökobilanz vergleicht man auch, wie viel Energie die Herstellung braucht. Was folgt aus der Animation?",
    options: ["Für eine Glasflasche braucht man bei der Herstellung viel mehr Energie als für eine PET-Flasche.", "Für eine PET-Flasche braucht man bei der Herstellung viel mehr Energie als für eine Glasflasche.", "Glasflaschen sind beim Transport leichter als PET-Flaschen, deshalb sparen sie dort Energie.", "Für eine Ökobilanz spielt es keine Rolle, wie heiß das Material gemacht werden muss."], answer: 0, points: 1 },

  /* --- Transfer (5 Punkte) --- */
  { teil: TR, modul: "ku4", transfer: true, type: "text",
    prompt: "Beim Wandertag findet eure Klasse Plastikflaschen und Tüten am Ufer eines kleinen Bachs – weit weg vom Meer. Erkläre, warum es trotzdem gut für das Meer ist, den Müll einzusammeln.",
    expected: "Der Bach fließt in einen Fluss und der Fluss ins Meer. Regen und Wind tragen den Müll ins Wasser, so gelangt er bis ins Meer – das meiste Plastik im Meer kommt auf diesem Weg vom Land. Im Meer verrottet er nicht, sondern zerfällt über Jahre zu Mikroplastik. Tiere verfangen sich darin oder halten ihn für Nahrung.",
    kriterien: "1 Punkt: Der Müll wird vom Bach über Flüsse ins Meer gespült (das meiste Plastik im Meer kommt vom Land). 1 Punkt: eine Folge im Meer: verrottet nicht, zerfällt zu Mikroplastik; Tiere verfangen sich darin oder fressen ihn; Schadstoffe (Weichmacher) gelangen in die Nahrung.",
    keywords: ["fluss", "flüsse", "meer", "gespült", "land", "mikroplastik", "tiere", "fressen", "nahrung", "verrott", "verfangen"], points: 2, lines: 4 },
  { teil: TR, modul: "ku3", transfer: true, type: "choice",
    prompt: "Eine Firma will Gartenschläuche herstellen, die viele Meter lang sind. Welches Verfahren passt am besten?",
    options: ["Strangpressen", "Spritzgießen", "Folienblasen", "Gießen in eine Hohlform"], answer: 0, points: 1 },
  { teil: TR, modul: "ku4", transfer: true, type: "choice",
    prompt: "Aus gemischten Kunststoffabfällen aus dem gelben Sack werden Parkbänke und Blumenkübel gemacht. Wie nennt man diese Art der Verwertung?",
    options: ["werkstoffliche Verwertung", "rohstoffliche Verwertung", "thermische Verwertung", "Entsorgung auf der Deponie"], answer: 0, points: 1 },
  { teil: TR, modul: "ku2", transfer: true, type: "choice",
    prompt: "Für die Dichtung in einem Wasserhahn braucht man einen Kunststoff, der sich zusammendrücken lässt und danach wieder seine Form annimmt. Welche Kunststoffgruppe passt?",
    options: ["Elastomer", "Thermoplast", "Duroplast", "keine – dafür nimmt man Metall"], answer: 0, points: 1 }
];

// Probe für einen Zug: gleiche Aufgaben, fester Notenschlüssel des Zugs (notenzug), übliche Testregeln
function kunststoffProbe2(zug) {
  return {
    id: "nt9" + zug.toLowerCase() + "-kunststoffe2",
    title: `Probe 2 Kunststoffe (9${zug})`,
    unit: `NT 9${zug} · Kunststoffe: Vielfalt, Bau und Einteilung, Verarbeitung, Müll und Recycling, PET-Flasche und Ökobilanz`,
    classLevel: "9" + zug, thema: "kunststoffe", minutes: 45, notenzug: zug,
    items: ITEMS.map((it) => ({
      ...JSON.parse(JSON.stringify(it)),
      ...(it.type === "match" ? { points: it.rows.length } : {}),
      // Notfall ohne KI: zwei passende Stichwörter reichen für volle Punkte (die Abgabe wird zur Prüfung markiert)
      ...(it.type === "text" ? { keywordsVoll: 2 } : {}),
      modulTitel: TITEL[it.modul]
    }))
  };
}

module.exports = { ITEMS, kunststoffProbe2 };
