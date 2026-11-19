"use strict";
// Dritte Probe „Luft“ (19.11.2026) – Module L1 bis L6 und L8. Lösungen bleiben im Backend.
//
// Wunsch der Lehrkraft: „erstelle dann nt probe 7m zum thema luft zu modulen l1-l6 und l8. mit teilweise auch offenen fragen
// + animationen aus den modulen. orientiere dich vor allem an den regelhefteinträgen und an den modulen. m und r schlüssel.“
// Auslegung wie bei NT 9 Probe 2 Kunststoffe: EINE Aufgabenliste, zwei Kennungen – nt7-luft3-r für die R-Klassen
// (R-Schlüssel, 50 % = Note 3) und nt7-luft3-m für die M-Klassen (M-Schlüssel, 50 % = Note 4). Kein „Zusatz für M7“-Stoff,
// damit die Aufgaben für beide Züge passen.
// Je Modul 6 Punkte nach den Regelhefteinträgen (7M/NT/arbeitsblaetter/L…-regelheft.pdf) und den Übungen der Module,
// dazu 4 Punkte Transfer: 28 Aufgaben, 46 Punkte, 7 offene Fragen, 10 Animationen, etwa 41 Minuten, übliche Testregeln.
// Kein Fragetext wortgleich mit nt7-luft oder nt7-luft2 (Test in nt7-luft3.test.js).
// Bilder: eigene SVG in 7M/NT/assets/proben/luft3-*.svg (öffentlich, ohne Kommentare), gebaut mit
// .codex-build/nt7-werkzeug/bau-luft3-bilder.js. Die Probe-Seite 7M/NT/probe.js kennt choice, match, order und text;
// Zuordnungs-Ziele zeigt sie alphabetisch – die Paare stehen deshalb nicht in dieser Reihenfolge.
// Aufgaben einer Probe, für die es schon Abgaben gibt, nicht mehr verändern (die Antwortreihenfolge hängt am Text).
const c = (modul, prompt, options, extra) => ({ type: "choice", modul, prompt, options, answer: 0, points: 1, ...(extra || {}) });
const m = (modul, prompt, pairs, extra) => ({ type: "match", modul, prompt, pairs, points: pairs.length, ...(extra || {}) });
const o = (modul, prompt, steps, extra) => ({ type: "order", modul, prompt, steps, points: steps.length, ...(extra || {}) });
const t = (modul, prompt, expected, criteria, keywords, extra) => ({ type: "text", modul, prompt, expected, criteria, keywords, points: criteria.length, ...(extra || {}) });

const bild = (name, alt) => ({ image: "assets/proben/luft3-" + name + ".svg", imageAlt: alt });
const BILD = {
  atmung: bild("atmung", "Animation: Links atmet ein Mensch, rechts steht eine Topfpflanze in der Sonne. Vom Menschen wandern rote Punkte (Gas X) zur Pflanze. Von der Pflanze wandern blaue Punkte (Gas Y) zum Menschen. Das geht immer im Kreis weiter."),
  ballon: bild("ballon", "Animation: Ein Heißluftballon steht am Boden. Der Brenner wird angezündet, die Luftteilchen im Ballon werden rot und bewegen sich schneller und weiter auseinander, der Ballon steigt. Dann geht der Brenner aus, die Teilchen werden blau und rücken zusammen, der Ballon sinkt langsam wieder."),
  dynamo: bild("dynamo", "Animation mit zwei Bildern. Links: Ein Fahrradreifen dreht sich, ein kleiner Dynamo liegt am Reifen an und dreht sich mit, die Fahrradlampe leuchtet. Rechts: Der Wind dreht den Rotor einer Windkraftanlage, im Maschinenhaus dreht sich ein Bauteil mit einem Fragezeichen, über ein Kabel leuchtet eine Lampe."),
  schatten: bild("schatten", "Animation: Ein Windrad steht nah bei einem Wohnhaus, die Sonne steht tief. Die Rotorblätter drehen sich. Ihr Schatten huscht immer wieder über das Fenster des Hauses, das Zimmer wird hell und dunkel. Vom Windrad gehen Schallwellen aus: wusch, wusch."),
  kerze: bild("kerze", "Animation: Eine Kerze wird ausgeblasen. Aus dem Docht steigt ein weißer Faden auf. Ein brennendes Streichholz wird ein Stück über den Docht in den weißen Faden gehalten. Die Flamme springt durch den weißen Faden nach unten und die Kerze brennt wieder."),
  mehl: bild("mehl", "Animation mit zwei Bildern, Lehrerversuch. A: Ein Häufchen Mehl liegt auf einem Löffel in einer Flamme, es wird nur an der Oberfläche dunkel und brennt kaum. B: In einer Dose mit einer brennenden Kerze wird Mehl mit einem Luftstoß fein aufgewirbelt, es gibt eine große Stichflamme und der Deckel fliegt weg."),
  sprinkler: bild("sprinkler", "Animation: Unter der Decke hängen drei Sprühköpfe, jeder ist mit einem roten Glasröhrchen verschlossen. Unter dem mittleren Sprühkopf brennt ein Papierkorb, heiße Luft und Rauch steigen nach oben. Ein Thermometer an der Decke steigt auf 68 Grad Celsius. Nur das mittlere Röhrchen platzt, aus diesem Sprühkopf sprüht Wasser auf das Feuer, das Feuer geht aus."),
  wald: bild("wald", "Animation: Viele Streichhölzer stehen in Reihen wie ein Wald. Links wird das erste angezündet, das Feuer springt von Streichholz zu Streichholz nach rechts. In der Mitte ist eine breite Lücke ohne Streichhölzer. An der Lücke hört das Feuer auf, die Streichhölzer rechts davon bleiben unversehrt."),
  hoehe: bild("hoehe", "Animation: Ein hoher Berg am Meer. Drei Orte sind markiert: der Strand am Meer, ein mittlerer Gipfel und ein sehr hoher Gipfel. Viele Luftteilchen schwirren herum: unten am Meer sehr viele und dicht beieinander, weiter oben immer weniger, ganz oben nur noch wenige."),
  saugnapf: bild("saugnapf", "Animation: Ein Saugnapf wird an eine Fliese gedrückt. Dabei werden Luftteilchen unter dem Napf herausgeschoben, darunter bleiben nur wenige. Außen stoßen viele Luftteilchen von allen Seiten gegen den Napf, kleine Pfeile zeigen auf den Napf. Der Napf bleibt an der Fliese hängen.")
};

const ITEMS = [
  /* --- L1 Luft – unsichtbar, aber lebenswichtig (6 Punkte) --- */
  m("luft-modul", "Die Animation zeigt Mensch und Pflanze. Welches Gas ist Gas X, welches Gas Y? Ordne zu.",
    [["Gas Y (von der Pflanze zum Menschen)", "Sauerstoff"], ["Gas X (vom Menschen zur Pflanze)", "Kohlenstoffdioxid"]], BILD.atmung),
  c("luft-modul", "Luft ist ein Gasgemisch. Was bedeutet das?",
    ["Luft besteht aus mehreren verschiedenen Gasen.", "Luft besteht nur aus Sauerstoff.", "Luft ist ein Gemisch aus Gas und Wasser.", "Luft entsteht erst, wenn man Gase erhitzt."]),
  c("luft-modul", "Wie schwer ist 1 Liter Luft ungefähr?",
    ["etwa 1,3 g", "etwa 13 g", "etwa 1,3 kg", "gar nicht – Luft hat kein Gewicht"]),
  t("luft-modul", "Die Animation zeigt einen Heißluftballon. Erkläre, warum er steigt, wenn der Brenner brennt, und was passiert, wenn der Brenner lange aus bleibt.",
    "Der Brenner erwärmt die Luft im Ballon. Warme Luft ist leichter als kühle Luft – die Luft im Ballon ist leichter als die Luft draußen, deshalb steigt der Ballon. Bleibt der Brenner aus, kühlt die Luft im Ballon ab und wird schwerer. Der Ballon sinkt.",
    ["Warme Luft ist leichter als kühle Luft (die erwärmte Luft im Ballon ist leichter als die Luft draußen) – deshalb steigt er.",
     "Ohne Brenner kühlt die Luft im Ballon ab (wird schwerer), der Ballon sinkt."],
    ["warm|heiß|erwärm|leichter", "kühlt|kalt|kühl|abkühl|schwerer|sinkt|fällt|runter|nach unten"], BILD.ballon),

  /* --- L2 Windkraft: Strom aus bewegter Luft (6 Punkte) --- */
  c("windkraft-strom", "Die Animation vergleicht ein Fahrrad mit einer Windkraftanlage. Welches Bauteil der Windkraftanlage arbeitet wie der Dynamo am Fahrrad?",
    ["der Generator", "das Getriebe", "die Bremse", "das Rotorblatt"], BILD.dynamo),
  m("windkraft-strom", "Welches Bauteil einer Windkraftanlage hat welche Aufgabe? Ordne zu.",
    [["Getriebe", "macht die langsame Drehung schneller"], ["Bremse", "blockiert den Rotor, wenn der Wind zu stark weht"], ["Gondel", "Maschinenhaus oben auf dem Turm"]]),
  t("windkraft-strom", "Wind ist eine erneuerbare Energiequelle. Erkläre, was „erneuerbar“ bedeutet. Nenne außerdem, welche Energie eine Windkraftanlage in welche Energie umwandelt.",
    "Erneuerbar heißt: Der Wind wird nicht verbraucht, er entsteht immer wieder neu. Eine Windkraftanlage wandelt die Bewegungsenergie des Windes in elektrische Energie um.",
    ["erneuerbar = wird nicht verbraucht bzw. entsteht immer wieder neu (geht nicht aus)",
     "Bewegungsenergie (des Windes) wird in elektrische Energie (Strom) umgewandelt"],
    ["nicht verbraucht|immer wieder|neu|geht nicht aus|unendlich|nie leer|nachwächst|nicht aufgebraucht", "bewegung|wind.*strom|elektrisch|strom"]),

  /* --- L3 Windkraft – pro und contra (6 Punkte) --- */
  c("windkraft-procontra", "Die Animation zeigt ein Windrad nah bei einem Wohnhaus. Welches Contra-Argument wird hier gezeigt?",
    ["Anwohner werden durch Schatten und Geräusche gestört.", "Windräder können Vögel gefährden.", "Der Wind weht nicht immer dann, wenn wir Strom brauchen.", "Windräder brauchen sehr viel Benzin für ihre Rotoren."], BILD.schatten),
  m("windkraft-procontra", "Wer ist gemeint? Ordne zu.",
    [["Anwohner", "Menschen, die in der Nähe wohnen"], ["Befürworter", "Menschen, die für eine Sache sind"], ["Gegner", "Menschen, die gegen eine Sache sind"]]),
  t("windkraft-procontra", "Tom sagt: „Windräder sind super – damit haben wir immer Strom.“ Was stimmt an Toms Aussage, was nicht? Begründe.",
    "Richtig ist: Windräder liefern Strom, ohne etwas zu verbrennen – ohne Abgase und ohne CO₂, und der Wind ist erneuerbar. Falsch ist „immer“: Der Wind weht nicht immer dann, wenn wir Strom brauchen. Bei Flaute liefern Windräder keinen Strom.",
    ["Was stimmt: Windräder liefern Strom ohne Abgase bzw. ohne CO₂ (der Wind ist erneuerbar, schützt das Klima).",
     "Was nicht stimmt: Der Wind weht nicht immer (Flaute) – deshalb gibt es nicht immer Strom aus Windrädern."],
    ["abgas|co2|co₂|klima|umwelt|sauber|erneuerbar|nichts verbrannt|nicht verbrannt|kein verbrennen", "weht nicht immer|nicht immer wind|kein wind|flaute|windstill|wenn kein wind|nicht immer"]),

  /* --- L4 Luft und Verbrennung (6 Punkte) --- */
  c("luft-verbrennung", "Die Animation zeigt einen Versuch mit einer Kerze. Was zeigt er?",
    ["Nicht der Docht brennt, sondern das gasförmige Wachs (Wachsdampf).", "Der Docht brennt, das Wachs hält die Kerze nur aufrecht.", "Die Kerze braucht zum Brennen keinen Sauerstoff.", "Rauch ist brennbar, weil er aus Kohlenstoffdioxid besteht."], BILD.kerze),
  c("luft-verbrennung", "Fast erloschene Glut flammt wieder auf, wenn man mit einem Blasebalg Luft hineinbläst. Warum?",
    ["Mit der Luft kommt mehr Sauerstoff an den Brennstoff.", "Die Luft kühlt die Glut unter ihre Zündtemperatur ab.", "Die Luft bringt neuen Brennstoff in die Glut.", "Die Luft enthält Kohlenstoffdioxid, das gut brennt."]),
  c("luft-verbrennung", "Ein Streichholzkopf entzündet sich schon beim Anreiben, ein Blatt Papier daneben aber nicht. Warum?",
    ["Der Streichholzkopf hat eine viel niedrigere Zündtemperatur (60–80 °C) als Papier (etwa 250 °C).", "Papier ist nicht brennbar.", "Der Streichholzkopf braucht zum Brennen keinen Sauerstoff.", "Papier hat eine niedrigere Zündtemperatur als der Streichholzkopf."]),
  m("luft-verbrennung", "Das Feuer geht aus oder brennt gar nicht erst. Welche Bedingung aus dem Feuerdreieck fehlt? Ordne zu.",
    [["Ein Holzscheit liegt im Kamin, aber niemand zündet es an.", "genug Hitze (Zündtemperatur)"],
     ["Ein Glas wird über eine brennende Kerze gestülpt. Nach kurzer Zeit geht sie aus.", "Sauerstoff"],
     ["Im Grill ist die ganze Kohle verglüht. Das Feuer geht aus.", "Brennstoff"]]),

  /* --- L5 Achtung, explosiv! (6 Punkte) --- */
  t("achtung-explosiv", "Die Animation zeigt zwei Lehrerversuche mit Mehl. Erkläre, warum das Mehl in B explodiert, in A aber kaum brennt.",
    "In B ist das Mehl fein in der Luft verteilt. Dadurch hat es eine riesige Oberfläche: Fast alle Mehlteilchen treffen gleichzeitig auf Sauerstoff und verbrennen auf einmal – schlagartig. Im Häufchen (A) kommt der Sauerstoff nur an die äußere Schicht heran.",
    ["In B ist das Mehl fein in der Luft verteilt – riesige (große) Oberfläche (im Häufchen kommt Sauerstoff nur außen heran).",
     "Fast alle Teilchen treffen gleichzeitig auf Sauerstoff und verbrennen auf einmal (schlagartig)."],
    ["verteilt|aufgewirbelt|staub|oberfläche|fein|in der luft", "gleichzeitig|auf einmal|schlagartig|sauerstoff|alle teilchen|sofort|schnell"], BILD.mehl),
  c("achtung-explosiv", "Welche Stoffe können explodieren, wenn sie fein in der Luft verteilt sind?",
    ["brennbare Stoffe als Staub, Nebel oder Gas", "nur Gase, aber nie Staub", "nur Stoffe, die nicht brennbar sind", "nur Metalle wie Eisen und Kupfer"]),
  c("achtung-explosiv", "Warum entsteht bei einer Explosion eine Druckwelle?",
    ["Die heißen Gase dehnen sich schlagartig aus und schieben die Luft weg.", "Die Flamme saugt die Luft aus der Umgebung an.", "Der Sauerstoff wird zu einem schweren Feststoff.", "Die Teilchen werden kalt und ziehen sich schlagartig zusammen."]),
  c("achtung-explosiv", "Was schiebt im Automotor den Kolben nach unten?",
    ["der Druck der heißen Gase, nachdem die Zündkerze das Benzin-Luft-Gemisch gezündet hat", "eine starke Feder, die unter dem Kolben sitzt", "der Fahrtwind, der vorne in den Motor strömt", "das Getriebe, das den Kolben mit Zahnrädern zieht"]),
  c("achtung-explosiv", "Was ist eine Verpuffung?",
    ["eine schwache Explosion mit dumpfem „Wusch“ und großer Flamme", "ein Feuer, das ganz ohne Sauerstoff brennt", "eine Explosion, bei der keine Flamme entsteht", "das Löschen eines Feuers mit Wasserdampf"]),

  /* --- L6 Brände verhindern und löschen (6 Punkte) --- */
  c("brand-schutz", "Die Animation zeigt eine Sprinkleranlage. Warum geht nur der Sprühkopf über dem Feuer auf?",
    ["Nur dort wird es so heiß, dass das Glasröhrchen platzt.", "Der Rauchmelder schaltet immer genau einen Sprühkopf ein.", "Die anderen Sprühköpfe haben kein Wasser.", "Der Sprühkopf über dem Feuer wird vom Rauch aufgedrückt."], BILD.sprinkler),
  o("brand-schutz", "Im Schulhaus brennt es. Bringe die Schritte in die richtige Reihenfolge.",
    ["Alarm auslösen", "den Raum verlassen und die Tür schließen", "über den Fluchtweg zum Sammelplatz gehen und dort bleiben"]),
  t("brand-schutz", "Die Animation zeigt einen „Wald“ aus Streichhölzern. Erkläre, warum das Feuer an der Lücke aufhört, und nenne, welche Seite des Feuerdreiecks dort fehlt.",
    "In der Lücke stehen keine Streichhölzer. Das Feuer findet dort nichts mehr, was brennen kann, und kann nicht weiterspringen. Es fehlt der Brennstoff. So arbeitet eine Brandschneise im Wald.",
    ["In der Lücke gibt es nichts mehr, was brennen kann (keine Streichhölzer, das Feuer kann nicht überspringen).",
     "Es fehlt der Brennstoff (Brandschneise)."],
    ["nichts|keine streichhölzer|kein holz|nicht weiter|nicht überspring|abstand|lücke|leer|nicht rüber", "brennstoff|brandschneise"], BILD.wald),

  /* --- L8 Der Luftdruck (6 Punkte) --- */
  m("luftdruck", "Die Animation zeigt, wie dicht die Luft in verschiedenen Höhen ist. Welcher Luftdruck gehört zu welchem Ort? Ordne zu.",
    [["Gipfel der Zugspitze (2962 m)", "etwa 700 hPa"], ["Strand an der Nordsee (0 m)", "etwa 1013 hPa"], ["Gipfel des Mount Everest (8849 m)", "etwa 330 hPa"]], BILD.hoehe),
  t("luftdruck", "Ein Saugnapf hält an der Fliese – dabei saugt er gar nicht! Erkläre mit dem Luftdruck, warum er hält.",
    "Beim Andrücken wird die Luft unter dem Napf hinausgeschoben. Unter dem Napf sind nur noch wenige Luftteilchen, der Druck dort ist klein. Von außen stoßen viele Teilchen gegen den Napf: Der größere Luftdruck von außen drückt den Napf an die Fliese.",
    ["Unter dem Napf ist (fast) keine Luft mehr bzw. nur wenige Teilchen – dort ist der Druck kleiner.",
     "Der (größere) Luftdruck von außen drückt den Napf an die Fliese."],
    ["keine luft|wenig|raus|klein|unterdruck|leer", "außen|draußen|von außen|drückt|presst"], BILD.saugnapf),
  c("luftdruck", "Das Barometer zeigt ein Hoch an. Welches Wetter ist wahrscheinlich?",
    ["oft sonnig und trocken", "oft Wolken, Regen und Wind", "immer Schnee", "Gewitter mit Hagel"]),

  /* --- Transfer (4 Punkte) --- */
  t("brand-schutz", "Aus dem Kellerfenster deines Nachbarhauses quillt Rauch. Du wählst die 112. Was sagst du am Telefon? Nenne, was die Feuerwehr wissen muss.",
    "Ich nenne meinen Namen und sage, wo es brennt (Straße, Hausnummer, Keller). Ich sage, was passiert ist: Aus dem Kellerfenster kommt Rauch, vielleicht sind noch Menschen im Haus. Dann warte ich auf Rückfragen und lege nicht einfach auf.",
    ["wer anruft (Name) und wo es brennt (Adresse, Straße, Hausnummer)",
     "was passiert ist (Rauch aus dem Keller, Menschen in Gefahr?) und auf Rückfragen warten"],
    ["name|ich heiße|wo|straße|adresse|hausnummer|ort", "was passiert|rauch|brennt|keller|menschen|verletzt|rückfrage|warten|nicht auflegen|fragen"], { transfer: true }),
  c("luftdruck", "Beim Landen im Flugzeug drückt es in deinen Ohren. Was hilft?",
    ["Schlucken oder gähnen – dann strömt Luft ins Mittelohr und der Druck gleicht sich aus.", "Die Luft anhalten, bis das Flugzeug steht.", "Die Ohren fest zuhalten, damit keine Luft hineinkommt.", "Nichts – der Luftdruck ist im Flugzeug immer gleich."], { transfer: true }),
  c("achtung-explosiv", "An jeder Tankstelle gilt: Rauchen und offenes Feuer verboten. Warum?",
    ["Benzindämpfe bilden mit Luft ein explosives Gemisch – schon ein Funke kann es zünden.", "Zigarettenrauch macht das Benzin schlechter.", "Benzin hat eine sehr hohe Zündtemperatur von über 1000 °C.", "Feuer verbraucht den Sauerstoff, den die Autos zum Tanken brauchen."], { transfer: true })
];

const fassung = (zug) => ({
  id: "nt7-luft3-" + zug.toLowerCase(), zug, thema: "luft", minutes: 45,
  title: `Probe 3 Luft – Module 1 bis 6 und 8 (7${zug})`,
  scope: "Luft und ihre Eigenschaften, Windkraft, Windkraft pro und contra, Verbrennung, Explosionen, Brände verhindern und löschen, Luftdruck",
  items: JSON.parse(JSON.stringify(ITEMS))
});

module.exports = {
  /* gleiche Aufgaben für beide Züge – der Notenschlüssel kommt aus dem Zug der Klasse (R-Klassen R, M-Klassen M) */
  "nt7-luft3-r": fassung("R"),
  "nt7-luft3-m": fassung("M")
};
