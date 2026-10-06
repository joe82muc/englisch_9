"use strict";
// Block-Probe „Tiere an Land und in der Luft“ – R- und M-Fassung. Lösungen bleiben im Backend.
// Module: wirbeltiere (Wirbeltiere: fünf Klassen) · fortbewegung (Schwimmen, laufen, fliegen).
// Reihenfolge: erst die Aufgaben zu wirbeltiere, dann zu fortbewegung, am Schluss die Transferaufgaben.
// Bilder und Animationen: 7M/NT/assets/proben/tiere-*.svg (eigene Zeichnungen nach den Grafiken der Module).
const c = (modul, prompt, options, extra) => ({ type: "choice", modul, prompt, options, answer: 0, points: 1, ...(extra || {}) });
const m = (modul, prompt, pairs, extra) => ({ type: "match", modul, prompt, pairs, points: pairs.length, ...(extra || {}) });
const o = (modul, prompt, steps, extra) => ({ type: "order", modul, prompt, steps, points: steps.length, ...(extra || {}) });
const t = (modul, prompt, expected, criteria, keywords, extra) => ({ type: "text", modul, prompt, expected, criteria, keywords, points: criteria.length, ...(extra || {}) });

const WT = "wirbeltiere", FB = "fortbewegung";

// Bilder (Pfad relativ zu 7M/NT/) mit Beschreibung zum Vorlesen – ohne die Lösung zu nennen
const BILD = {
  frosch: { image: "assets/proben/tiere-frosch-entwicklung.svg", imageAlt: "Fünf Bilder aus der Entwicklung eines Grasfroschs in gemischter Reihenfolge. Bild A: Kaulquappe mit Schwanz und zwei Hinterbeinen. Bild B: Laichballen aus durchsichtigen Eiern im Wasser. Bild C: junger Frosch sitzt an Land. Bild D: kleine Kaulquappe mit roten Kiemenbüscheln am Kopf, noch ohne Beine. Bild E: Kaulquappe mit vier Beinen und Schwanz dicht unter der Wasseroberfläche, über ihr steigen Luftblasen auf." },
  temperatur: { image: "assets/proben/tiere-temperatur.svg", imageAlt: "Liniendiagramm. Waagrechte Achse: Außentemperatur von 0 bis 40 °C. Senkrechte Achse: Körpertemperatur von 0 bis 40 °C. Die Linie von Tier A verläuft waagrecht bei etwa 38 °C. Die Linie von Tier B steigt gleichmäßig an: bei 10 °C Außentemperatur sind es 10 °C Körpertemperatur, bei 20 °C sind es 20 °C, bei 30 °C sind es 30 °C." },
  forelle: { image: "assets/proben/tiere-forelle.svg", imageAlt: "Eine Forelle von der Seite, der Kopf zeigt nach rechts. Vier Stellen sind bezeichnet: A ist die Flosse unten gleich hinter dem Kopf, B die große Flosse am Schwanzende, C eine gestrichelt eingezeichnete Blase im Inneren des Körpers, D die Flosse oben auf dem Rücken." },
  stroemung: { image: "assets/proben/tiere-stroemung.svg", imageAlt: "Animation: drei Strömungskanäle untereinander, das Wasser strömt von links nach rechts an einem Körper vorbei. Alle Körper sind gleich hoch. A: ein eckiger Klotz, hinter ihm drehen sich zwei große Wirbel. B: ein Körper in Fischform, vorn rund und hinten spitz; hinter ihm schließen sich die Strömungslinien glatt, Wirbel gibt es nicht. C: eine Kugel, hinter ihr drehen sich zwei kleine Wirbel." },
  flugarten: { image: "assets/proben/tiere-flugarten.svg", imageAlt: "Animation mit vier Feldern. A: Ein Vogel kreist mit ausgebreiteten Flügeln über aufsteigender warmer Luft und wird dabei nach oben getragen. B: Ein Vogel steht flatternd an einer Stelle in der Luft, den Kopf gegen den Wind gerichtet; unter ihm sitzt eine Maus am Boden. C: Ein Vogel fliegt mit ausgebreiteten, ruhigen Flügeln schräg nach unten. D: Ein Vogel schlägt mit den Flügeln auf und ab und fliegt dabei vorwärts." },
  gangarten: { image: "assets/proben/tiere-gangarten.svg", imageAlt: "Drei Hinterbeine von der Seite auf dem Boden. Der rote Punkt ist jeweils die Ferse. Bein A: Nur die Zehen liegen auf dem Boden, die Ferse ist angehoben. Bein B: Nur die Zehenspitze berührt den Boden, sie steckt in einem Huf; die Ferse liegt weit oben, das Bein ist sehr lang. Bein C: Der ganze Fuß mit der Ferse liegt auf dem Boden. Legende: Unterschenkel blau, Fußknochen grün, Zehen orange." },
  gliedmassen: { image: "assets/proben/tiere-vordergliedmassen.svg", imageAlt: "Vier Vordergliedmaßen im Vergleich, mit A bis D bezeichnet. In allen sind dieselben Knochen gleich eingefärbt: Oberarmknochen blau, Elle und Speiche grün, Handknochen orange. A: schlanke Knochen, an Unterarm und Hand sitzen lange Federn. B: kurze, sehr kräftige Knochen und eine breite Hand mit starken Krallen. C: langer Oberarm und fünf lange, einzelne Finger. D: kurze Armknochen und lange Fingerknochen in einem flachen Paddel." }
};

// Aufgaben, die in beiden Fassungen gleich sind (jeder Aufruf liefert ein eigenes Objekt)
const froschBilder = () => o(WT, "Die Bilder A bis E zeigen die Entwicklung eines Grasfroschs. Sie sind durcheinandergeraten. Bringe sie in die richtige Reihenfolge. Beginne mit dem Laich.",
  ["Bild B", "Bild D", "Bild A", "Bild E", "Bild C"], BILD.frosch);
const forelle = () => m(FB, "Das Bild zeigt eine Forelle. Ordne den Buchstaben A bis D die Körperteile und ihre Aufgaben zu.",
  [["A", "Brustflosse: steuert und bremst"], ["B", "Schwanzflosse: treibt den Fisch an"], ["C", "Schwimmblase: lässt den Fisch im Wasser schweben"], ["D", "Rückenflosse: hält den Fisch aufrecht"]], BILD.forelle);
const stroemung = () => c(FB, "Die Animation zeigt drei gleich hohe Körper im Strömungskanal. Welcher Körper bietet dem Wasser den kleinsten Widerstand?",
  ["Körper B: Hinter ihm fließt das Wasser glatt weiter, ohne Wirbel.", "Körper A: Er steht fest wie eine Wand im Wasser.", "Körper C: Er ist rund und am kürzesten.", "Körper A: Hinter ihm entstehen die größten Wirbel."], BILD.stroemung);
const flugarten = () => m(FB, "Die Animation zeigt vier Flugarten der Vögel. Ordne den Feldern A bis D die Flugart zu.",
  [["A", "Segelflug"], ["B", "Rüttelflug"], ["C", "Gleitflug"], ["D", "Ruderflug"]], BILD.flugarten);
const uboot = () => t(FB, "Ein U-Boot ist vorn rund und läuft hinten spitz zu – fast wie ein Fisch. Erkläre, warum man U-Boote so baut.",
  "Wasser bremst stark. Die Form des U-Boots ist stromlinienförmig wie bei einem Fisch: Das Wasser gleitet am Rumpf vorbei, und hinter dem U-Boot entstehen kaum Wirbel. Der Widerstand ist klein. Deshalb braucht das U-Boot weniger Kraft und kommt schneller voran.",
  ["die Form ist stromlinienförmig (wie beim Fisch)", "das Wasser gleitet vorbei, es entstehen kaum Wirbel – der Widerstand ist klein", "dadurch braucht das U-Boot weniger Kraft (Energie) bzw. es kommt schneller voran"],
  ["stromlinien|fischform|wie ein fisch|wie der fisch|wie bei einem fisch|wie beim fisch|wie die fische", "widerstand|wirbel|gleitet|bremst|gebremst", "kraft|energie|schneller|treibstoff|leichter voran|spart|sparen"],
  { transfer: true });

module.exports = {
  /* ================= R-Fassung ================= */
  "nt7-tiere-r": {
    id: "nt7-tiere-r", zug: "R", thema: "tiere", minutes: 40,
    title: "Probe Tiere an Land und in der Luft (7R)",
    scope: "Wirbeltiere: gemeinsame Merkmale, fünf Klassen, heimische Tiere bestimmen; Fortbewegung im Wasser, an Land und in der Luft",
    items: [
      /* ----- Modul wirbeltiere ----- */
      c(WT, "Was haben alle Wirbeltiere gemeinsam?",
        ["ein Innenskelett mit einer Wirbelsäule", "vier Beine zum Laufen oder Springen", "ein Fell aus Haaren, das sie wärmt", "Flügel oder Flossen als Gliedmaßen"]),
      m(WT, "Ordne jeder Klasse der Wirbeltiere ihre Körperbedeckung zu.",
        [["Fische", "Schuppen mit Schleimschicht"], ["Amphibien", "nackte, feuchte Haut"], ["Reptilien", "trockene Hornschuppen"], ["Vögel", "Federn"], ["Säugetiere", "Haare (Fell)"]]),
      froschBilder(),
      c(WT, "Womit atmet ein erwachsener Grasfrosch?",
        ["mit Lungen und durch die Haut", "mit Kiemen – wie die Kaulquappe", "nur durch die feuchte Haut", "mit Lungen und Kiemen zugleich"]),
      c(WT, "Das Diagramm zeigt die Körpertemperatur von zwei Tieren. Welches Tier ist wechselwarm?",
        ["Tier B: Sein Körper ist immer etwa so warm wie die Umgebung.", "Tier A: Sein Körper ist immer etwa 38 °C warm.", "Tier A: Seine Linie liegt im Diagramm ganz oben.", "Tier B: Sein Körper ist immer kälter als 20 °C."], BILD.temperatur),
      m(WT, "Ordne jedes heimische Tier seiner Klasse zu.",
        [["Hecht", "Fische"], ["Feuersalamander", "Amphibien"], ["Ringelnatter", "Reptilien"], ["Buntspecht", "Vögel"], ["Maulwurf", "Säugetiere"]]),
      c(WT, "Du bestimmst ein Tier mit der Bestimmungshilfe: Es hat keine Federn, keine Haare und keine Flossen. Seine Haut ist nackt und feucht. Zu welcher Klasse gehört es?",
        ["zu den Amphibien", "zu den Reptilien", "zu den Fischen", "zu den Säugetieren"]),
      c(WT, "Der Pinguin kann nicht fliegen und schwimmt wie ein Fisch. Warum ist er trotzdem ein Vogel?",
        ["Er hat Federn und legt ein Ei mit Kalkschale.", "Er lebt am Meer und frisst Fische.", "Er taucht sehr gut und sehr tief.", "Er ist schwarz-weiß und läuft aufrecht."]),

      /* ----- Modul fortbewegung ----- */
      c(FB, "Biologen sagen: Ein Tier ist an seinen Lebensraum angepasst. Was ist damit gemeint?",
        ["Sein Körperbau passt zu seinem Lebensraum und seiner Fortbewegung.", "Es hat sich in wenigen Tagen an einen neuen Ort gewöhnt.", "Es ist besonders groß und stärker als andere Tiere.", "Es lebt immer mit vielen anderen Tieren zusammen."]),
      forelle(),
      stroemung(),
      t(FB, "Der Körper eines Vogels ist zum Fliegen gebaut. Nenne zwei Merkmale und erkläre bei einem, wie es beim Fliegen hilft.",
        "Vögel haben Flügel mit langen Schwungfedern. Sie bilden eine große Fläche, die den Vogel trägt und antreibt. Die Knochen sind hohl und deshalb leicht. Kräftige Flugmuskeln setzen am Brustbeinkamm an.",
        ["erstes richtiges Merkmal (z. B. Flügel mit Schwungfedern, hohle Knochen, kräftige Flugmuskeln am Brustbeinkamm, Deckfedern, leichter Schnabel)", "zweites richtiges Merkmal", "bei einem Merkmal erklärt, wie es hilft (z. B. hohle Knochen sind leicht; Schwungfedern bilden die Fläche, die trägt)"],
        ["flügel|feder|schwung", "hohl|knochen|muskel|brustbein|schnabel|deckfeder|stromlinien", "leicht|trägt|tragen|fläche|antrieb|treib|kraft|glatt|gewicht|wiegt"]),
      flugarten(),
      m(FB, "Das Bild zeigt drei Hinterbeine von der Seite. Ordne jedem Bein die Gangart und ein passendes Tier zu.",
        [["Bein A", "Zehengänger, zum Beispiel der Hund"], ["Bein B", "Zehenspitzengänger, zum Beispiel das Reh"], ["Bein C", "Sohlengänger, zum Beispiel der Bär"]], BILD.gangarten),
      c(FB, "Welche besondere Vordergliedmaße hat der Maulwurf?",
        ["eine Grabhand: breit, mit starken Krallen", "eine Flughaut zwischen langen Fingern", "eine Flosse zum Steuern und Bremsen", "einen Huf an der Zehenspitze"]),

      /* ----- Transfer ----- */
      t(WT, "Am Strand der Nordsee liegt ein Seehund. Er hat Flossen und jagt im Meer nach Fischen. Sein Körper ist mit kurzem Fell bedeckt, er atmet mit Lungen, und das Weibchen säugt sein Junges mit Milch. Zu welcher Klasse der Wirbeltiere gehört der Seehund? Begründe mit zwei Merkmalen.",
        "Der Seehund ist ein Säugetier. Er hat ein Fell aus Haaren, und das Weibchen säugt sein Junges mit Milch. Außerdem atmet er mit Lungen. Dass er im Meer lebt und Flossen hat, entscheidet nicht über die Klasse.",
        ["Klasse: Säugetier", "erstes passendes Merkmal (Fell bzw. Haare, säugt das Junge mit Milch, Lungenatmung)", "zweites passendes Merkmal"],
        ["säugetier|säuger", "fell|haare", "milch|säugt|gesäugt|lunge"],
        { transfer: true }),
      t(FB, "Taucher ziehen Schwimmflossen an die Füße. Erkläre, warum sie damit im Wasser schneller vorankommen. Welches Tier, das du kennst, hat etwas Ähnliches?",
        "Die Schwimmflossen vergrößern die Fläche der Füße. Damit drückt der Taucher bei jedem Beinschlag mehr Wasser nach hinten, und das schiebt ihn nach vorn. Der Frosch hat dafür Schwimmhäute zwischen den Zehen.",
        ["die Schwimmflossen vergrößern die Fläche der Füße", "damit wird mehr Wasser nach hinten gedrückt – das schiebt den Taucher nach vorn", "Vergleich mit einem Tier: z. B. Schwimmhäute beim Frosch (auch richtig: Ente, Schwan, Biber)"],
        ["fläche|größer|grösser|breiter|vergrößer", "wasser|drück|schieb|abstoß|abstoss|stoßen", "frosch|schwimmh|ente|schwan|biber|gans|kröte"],
        { transfer: true }),
      uboot()
    ]
  },

  /* ================= M-Fassung ================= */
  "nt7-tiere-m": {
    id: "nt7-tiere-m", zug: "M", thema: "tiere", minutes: 45,
    title: "Probe Tiere an Land und in der Luft (7M)",
    scope: "Wirbeltiere: Bauplan und Zentralnervensystem, fünf Klassen im Vergleich, Diagramm auswerten, knifflige Fälle; Fortbewegung und Angepasstheit, Flugarten, Gangarten, gemeinsamer Bauplan der Vordergliedmaßen",
    items: [
      /* ----- Modul wirbeltiere ----- */
      c(WT, "Welche Teile des Körpers bilden zusammen das Zentralnervensystem der Wirbeltiere?",
        ["Gehirn und Rückenmark", "Herz und Lunge", "Schädel und Wirbelsäule", "Nerven und Muskeln"]),
      c(WT, "Welche drei heimischen Tiere gehören alle zur selben Klasse der Wirbeltiere?",
        ["Zauneidechse, Ringelnatter, Blindschleiche", "Bergmolch, Zauneidechse, Feuersalamander", "Fledermaus, Buntspecht, Mäusebussard", "Hecht, Karpfen, Bergmolch"]),
      m(WT, "Ordne jeder Klasse der Wirbeltiere ihre Fortpflanzung zu.",
        [["Fische", "Laich im Wasser, die Jungen atmen wie die Eltern mit Kiemen"], ["Amphibien", "Laich im Wasser, aus Larven mit Kiemen werden Tiere mit Lungen"], ["Reptilien", "meist Eier mit weicher Schale an Land"], ["Vögel", "Eier mit harter Kalkschale, werden ausgebrütet"], ["Säugetiere", "lebende Junge, werden mit Milch gesäugt"]]),
      froschBilder(),
      t(WT, "Das Diagramm zeigt die Körpertemperatur von zwei Tieren bei verschiedenen Außentemperaturen. Werte es aus: Welches Tier ist gleichwarm, welches wechselwarm? Begründe mit dem Verlauf der Linien und nenne zu jedem Tier eine passende Klasse der Wirbeltiere.",
        "Tier A ist gleichwarm: Seine Linie verläuft waagrecht, die Körpertemperatur bleibt immer bei etwa 38 °C. Es könnte ein Säugetier oder ein Vogel sein. Tier B ist wechselwarm: Seine Linie steigt an, der Körper ist immer etwa so warm wie die Umgebung. Es könnte ein Reptil, ein Amphibium oder ein Fisch sein.",
        ["Tier A ist gleichwarm: Die Körpertemperatur bleibt gleich (Linie waagrecht, etwa 38 °C)", "Tier B ist wechselwarm: Die Körpertemperatur steigt mit der Außentemperatur", "passende Klassen genannt: A Vogel oder Säugetier, B Fisch, Amphibium oder Reptil"],
        ["gleichwarm|bleibt gleich|waagrecht|waagerecht|immer 38|immer gleich", "wechselwarm|steigt|umgebung|außentemperatur|aussentemperatur", "säugetier|vogel|vögel|reptil|amphib|fisch"], BILD.temperatur),
      c(WT, "Bergmolch und Zauneidechse sehen sich ähnlich: vier Beine und ein langer Schwanz. Woran erkennst du am sichersten, dass der Molch ein Amphibium ist?",
        ["an seiner nackten, feuchten Haut ohne Schuppen", "an seinen vier kurzen Beinen mit kleinen Zehen", "an seinem langen Schwanz hinter dem Rumpf", "an seiner Wirbelsäule aus vielen Wirbeln"]),
      t(WT, "Der Pinguin kann nicht fliegen, er schwimmt und taucht wie ein Fisch. Begründe mit zwei Merkmalen, warum er trotzdem ein Vogel ist. Erkläre dann, warum der Lebensraum bei der Einteilung der Wirbeltiere nicht entscheidet.",
        "Der Pinguin hat Federn und einen Schnabel. Er legt ein Ei mit Kalkschale, das ausgebrütet wird. Über die Klasse entscheiden die Merkmale des Körpers, zum Beispiel Körperbedeckung, Atmung und Fortpflanzung. Der Lebensraum und die Art, sich zu bewegen, können täuschen: Auch Wal und Delfin leben im Wasser und sind trotzdem keine Fische.",
        ["erstes richtiges Merkmal (z. B. Federn, Ei mit Kalkschale wird ausgebrütet, Schnabel)", "zweites richtiges Merkmal", "über die Klasse entscheiden die Merkmale des Körpers (Körperbau), nicht der Lebensraum oder die Fortbewegung"],
        ["feder|gefieder", "legt ei|eier|ei mit|brüt|schnabel|kalkschale|lunge", "körperbau|merkmale|körpermerkmal|täusch|nicht der lebensraum|körper entscheid"]),

      /* ----- Modul fortbewegung ----- */
      stroemung(),
      forelle(),
      c(FB, "Ein Fisch verkleinert die Gasmenge in seiner Schwimmblase. Was passiert?",
        ["Er sinkt nach unten.", "Er steigt nach oben.", "Er schwimmt schneller.", "Er kippt auf die Seite."]),
      c(FB, "Molch und Frosch schwimmen beide gut – aber verschieden. Welche Aussage stimmt?",
        ["Der Molch schlängelt und schiebt sich mit dem Ruderschwanz, der Frosch stößt sich mit den Hinterbeinen ab.", "Der Molch stößt sich mit den Hinterbeinen ab, der Frosch schlängelt und schiebt sich mit dem Ruderschwanz.", "Beide schlängeln und schieben sich mit einem breiten Ruderschwanz durchs Wasser.", "Beide stoßen sich mit langen Hinterbeinen und Schwimmhäuten ab."]),
      c(FB, "Welche zwei Dinge machen den Körper eines Vogels besonders leicht?",
        ["hohle Knochen und ein Schnabel statt schwerer Zähne", "Daunenfedern und kräftige Flugmuskeln", "ein Brustbeinkamm und lange Schwanzfedern", "eine Schwimmblase und dünne Deckfedern"]),
      c(FB, "Beim Aufschlag hebt der Vogel die Flügel wieder an. Warum spreizen sich dabei die Federn?",
        ["Die Luft strömt durch die Lücken – so bremst der Flügel kaum.", "Die Luft wird nach unten gedrückt – das hebt den Vogel hoch.", "Die Federn kühlen den Vogel beim Fliegen ab.", "Die Federn fangen mehr Wind ein und treiben den Vogel an."]),
      flugarten(),
      c(FB, "Das Bild zeigt drei Hinterbeine von der Seite. Welches Bein gehört zu einem schnellen Läufer wie dem Reh, und woran erkennst du es?",
        ["Bein B: Nur die Zehenspitze mit dem Huf berührt den Boden, das Bein ist lang.", "Bein A: Nur die Zehen berühren den Boden, die Ferse ist angehoben.", "Bein C: Die ganze Sohle liegt auf dem Boden, das gibt sicheren Halt.", "Bein C: Die Ferse berührt den Boden, das Bein ist besonders kurz."], BILD.gangarten),
      t(FB, "Das Bild zeigt vier Vordergliedmaßen von Wirbeltieren: einen Arm, einen Flügel, eine Flosse und eine Grabhand. Erkläre, warum man von einem gemeinsamen Bauplan spricht und warum die Gliedmaßen trotzdem so verschieden aussehen. Schreibe für zwei Buchstaben auf, welche Gliedmaße es ist.",
        "In allen vier Gliedmaßen liegen dieselben Knochen in derselben Reihenfolge: Oberarmknochen, Elle und Speiche, Handknochen. Form und Größe sind verschieden, weil jede Gliedmaße eine andere Aufgabe hat: Sie ist an die Fortbewegung angepasst. A ist der Flügel des Vogels (fliegen), B die Grabhand des Maulwurfs (graben), C der Arm des Menschen (greifen), D die Flosse des Delfins (schwimmen).",
        ["gemeinsamer Bauplan: in allen dieselben Knochen (Oberarmknochen, Elle und Speiche, Handknochen)", "Form und Größe unterscheiden sich, weil jede Gliedmaße eine andere Aufgabe hat (Angepasstheit)", "zwei Buchstaben richtig zugeordnet (A Flügel, B Grabhand, C Arm, D Flosse)"],
        ["gleiche knochen|gleichen knochen|dieselben knochen|selben knochen|oberarm|elle|speiche|handknochen", "aufgabe|angepasst|anpassung|fliegen|schwimmen|graben|greifen", "a flügel|a ist der flügel|a = flügel|a: flügel|b grabhand|b ist die grabhand|b = grabhand|b: grabhand|c arm|c ist der arm|c = arm|c: arm|d flosse|d ist die flosse|d = flosse|d: flosse"], BILD.gliedmassen),

      /* ----- Transfer ----- */
      t(WT, "Eine Kreuzotter kommt nach einer Mahlzeit oft wochenlang ohne Futter aus. Ein Fuchs muss fast jeden Tag fressen. Erkläre den Unterschied mit der Körpertemperatur der beiden Tiere.",
        "Die Kreuzotter ist ein Reptil und wechselwarm: Ihr Körper ist etwa so warm wie die Umgebung, sie muss ihn nicht selbst warm halten. Der Fuchs ist ein Säugetier und gleichwarm: Er hält seine Körpertemperatur immer fast gleich. Dafür braucht er viel Energie aus der Nahrung. Deshalb muss er viel öfter fressen.",
        ["die Kreuzotter ist wechselwarm: Ihre Körpertemperatur richtet sich nach der Umgebung", "der Fuchs ist gleichwarm: Seine Körpertemperatur bleibt fast gleich", "das Gleichhalten der Körpertemperatur kostet viel Energie aus der Nahrung (die Kreuzotter spart diese Energie)"],
        ["wechselwarm", "gleichwarm", "energie|nahrung braucht|verbrauch|heizen|warm halten|warmhalten|wärme erzeugen"],
        { transfer: true }),
      t(FB, "Störche fliegen im Herbst Tausende Kilometer weit bis nach Afrika. Dabei schlagen sie kaum mit den Flügeln: Sie kreisen in warmer, aufsteigender Luft nach oben und fliegen dann mit ausgebreiteten Flügeln weiter. Benenne die beiden Flugarten und erkläre, warum das für die lange Reise günstig ist.",
        "Das Kreisen in warmer, aufsteigender Luft ist der Segelflug: Der Aufwind trägt den Storch nach oben, ohne dass er mit den Flügeln schlagen muss. Danach fliegt er im Gleitflug mit ausgebreiteten Flügeln weiter und verliert dabei langsam an Höhe. Beides kostet kaum Kraft. Der Ruderflug mit ständigem Flügelschlag würde viel mehr Kraft kosten.",
        ["Segelflug: Kreisen im Aufwind, die warme Luft trägt den Vogel nach oben", "Gleitflug: mit ausgebreiteten Flügeln ohne Flügelschlag weiterfliegen (dabei sinkt der Vogel langsam)", "beides spart Kraft – der Ruderflug mit Flügelschlag würde viel mehr Kraft kosten"],
        ["segelflug|segeln|segelt", "gleitflug|gleiten|gleitet", "kraft|energie|anstreng|spart|sparen|müde"],
        { transfer: true }),
      uboot()
    ]
  }
};
