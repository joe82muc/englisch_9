"use strict";
// Block-Probe „Mensch und Gesundheit“ – R- und M-Fassung. Lösungen bleiben im Backend.
// Module des Blocks: atmungsorgane · atmen-gasaustausch · blut · herz-kreislauf · herz-gesund.
// Reihenfolge: nach den Modulen, Transferaufgaben am Schluss. Bilder und Animationen liegen in
// 7M/NT/assets/proben (mensch-*.svg: eigene Zeichnungen nach den Grafiken der Module; puls-diagramm.svg).
const c = (modul, prompt, options, extra) => ({ type: "choice", modul, prompt, options, answer: 0, points: 1, ...(extra || {}) });
const m = (modul, prompt, pairs, extra) => ({ type: "match", modul, prompt, pairs, points: pairs.length, ...(extra || {}) });
const o = (modul, prompt, steps, extra) => ({ type: "order", modul, prompt, steps, points: steps.length, ...(extra || {}) });
const t = (modul, prompt, expected, criteria, keywords, extra) => ({ type: "text", modul, prompt, expected, criteria, keywords, points: criteria.length, ...(extra || {}) });

const A = "atmungsorgane", G = "atmen-gasaustausch", B = "blut", H = "herz-kreislauf", Z = "herz-gesund";
const BILD = "assets/proben/";

/* ---------- Aufgaben, die in beiden Fassungen gleich sind ---------- */
const atemwege = () => m(A, "Das Bild zeigt den Weg der Atemluft. Ordne den Buchstaben A bis D die richtigen Namen zu.",
  [["A", "Kehlkopf"], ["B", "Luftröhre"], ["C", "Bronchien"], ["D", "Lungenbläschen"]],
  { image: BILD + "mensch-atemwege.svg", imageAlt: "Zeichnung eines Menschen: Kopf von der Seite, Oberkörper von vorn. Beschriftet ist nur die Nasenhöhle. Der Buchstabe A zeigt auf den Eingang des Luftwegs vorn im Hals. B zeigt auf das Rohr mit Rillen, das vom Hals zur Lunge führt. C zeigt auf die zwei Äste, in die sich dieses Rohr teilt. D zeigt in einer Lupe auf die winzigen Bläschen am Ende der feinsten Äste, die von feinen Blutgefäßen umgeben sind." });

const kehldeckel = () => c(A, "Was macht der Kehldeckel, wenn du einen Bissen schluckst?",
  ["Er legt sich über den Kehlkopf und verschließt den Weg in die Luftröhre.", "Er legt sich über die Speiseröhre und verschließt den Weg in den Magen.", "Er öffnet die Luftröhre besonders weit, damit du weiteratmen kannst.", "Er bringt die Stimmbänder zum Schwingen, damit ein Ton entsteht."]);

const gasTeilchen = () => m(G, "Die Animation zeigt den Gasaustausch in einem Lungenbläschen. Welches Gas ist welches Teilchen?",
  [["Teilchen 1 (Kreise): wandern aus der Luft ins Blut", "Sauerstoff"], ["Teilchen 2 (Quadrate): wandern aus dem Blut in die Luft", "Kohlenstoffdioxid"], ["Teilchen 3 (Dreiecke): bleiben in der Luft", "Stickstoff"]],
  { image: BILD + "mensch-gasaustausch.svg", imageAlt: "Animation: links ein Lungenbläschen mit Luft, rechts eine Kapillare mit Blut, dazwischen eine hauchdünne Wand. Runde Teilchen (Teilchen 1) wandern aus der Luft durch die Wand ins Blut und fließen mit dem Blut weiter. Eckige Teilchen (Teilchen 2) kommen mit dem Blut an und wandern durch die Wand in die Luft. Dreieckige Teilchen (Teilchen 3) bleiben in der Luft des Lungenbläschens." });

const herzBild = () => m(H, "Das Bild zeigt ein Herz von vorn. Ordne den Räumen 1 bis 4 die richtigen Namen zu.",
  [["Raum 1", "rechter Vorhof"], ["Raum 2", "rechte Herzkammer"], ["Raum 3", "linker Vorhof"], ["Raum 4", "linke Herzkammer"]],
  { image: BILD + "mensch-herz.svg", imageAlt: "Schnitt durch ein Herz von vorn. Die rechte Seite des Menschen liegt im Bild links, die linke Seite des Menschen im Bild rechts. Vier Räume sind nummeriert. Raum 1 liegt oben auf der rechten Seite des Menschen, in ihn mündet ein Gefäß vom Körper. Raum 2 liegt darunter, aus ihm führt ein Gefäß zur Lunge. Raum 3 liegt oben auf der linken Seite des Menschen, in ihn mündet ein Gefäß von der Lunge. Raum 4 liegt darunter und hat die dickste Wand, aus ihm führt ein Gefäß in den Körper. Zwischen den oberen und den unteren Räumen und an den Ausgängen sitzen gelb gezeichnete Klappen." });

const kreislaufBild = () => c(H, "Die Animation zeigt den Blutkreislauf. Ein rotes Blutkörperchen fließt nacheinander durch die Gefäße A, B, C und D. In welchen beiden Gefäßen ist das Blut sauerstoffreich?",
  ["in B und C", "in A und B", "in A und D", "in C und D"],
  { image: BILD + "mensch-kreislauf.svg", imageAlt: "Animation: Schema des Blutkreislaufs mit der Lunge oben, dem Herzen mit vier Räumen in der Mitte und dem Körper unten. Ein rotes Blutkörperchen wandert im Kreis: aus der rechten Herzhälfte durch Gefäß A zur Lunge, von der Lunge durch Gefäß B in die linke Herzhälfte, von dort durch Gefäß C in den Körper und vom Körper durch Gefäß D zurück in die rechte Herzhälfte." });

module.exports = {
  /* ================= Fassung für R-Klassen ================= */
  "nt7-mensch-r": {
    id: "nt7-mensch-r", zug: "R", thema: "mensch", minutes: 40,
    title: "Probe Mensch und Gesundheit (7R)",
    scope: "Atmungsorgane, Atmen und Gasaustausch, Blut, Herz und Blutkreislauf, Herz und Kreislauf gesund halten",
    items: [
      /* ----- Der Weg der Luft: Atmungsorgane ----- */
      atemwege(),
      c(A, "Welche drei Aufgaben hat die Nasenhöhle beim Einatmen?",
        ["Sie reinigt, wärmt und befeuchtet die Luft.", "Sie kühlt, trocknet und verdichtet die Luft.", "Sie reinigt die Luft und nimmt Sauerstoff auf.", "Sie wärmt die Luft und erzeugt die Stimme."]),
      kehldeckel(),
      c(A, "Welche Aufgabe haben die Flimmerhärchen in der Luftröhre?",
        ["Sie befördern Schleim und Staub nach oben zum Rachen.", "Sie halten die Luftröhre offen, damit sie nicht zusammenfällt.", "Sie wärmen die Atemluft auf Körpertemperatur an.", "Sie nehmen den Sauerstoff aus der Atemluft auf."]),

      /* ----- Atmen und Gasaustausch ----- */
      c(G, "Wie weist man Kohlenstoffdioxid in der Ausatemluft nach?",
        ["Man bläst in klares Kalkwasser: Es wird milchig-trüb.", "Man bläst in klares Kalkwasser: Es färbt sich rot.", "Man hält einen glimmenden Holzspan hinein: Er flammt auf.", "Man riecht daran: Kohlenstoffdioxid riecht stechend."]),
      m(G, "Die Animation zeigt das Glasglocken-Modell der Atmung. Wofür stehen die Teile A, B und C im Körper?",
        [["A – die Glasglocke", "Brustkorb"], ["B – der Luftballon", "Lunge"], ["C – die Gummihaut", "Zwerchfell"]],
        { image: BILD + "mensch-glasglocke.svg", imageAlt: "Animation: Eine Glasglocke (A) ist unten mit einer Gummihaut (C) verschlossen. Durch einen Stopfen führt ein Glasrohr in die Glocke, an seinem Ende hängt ein Luftballon (B). Die Gummihaut wird nach unten gezogen und wieder losgelassen. Beim Ziehen strömt Luft durch das Rohr, und der Ballon wird größer. Beim Loslassen wird er wieder kleiner." }),
      gasTeilchen(),
      t(G, "Erkläre, wie die Luft beim Einatmen in die Lunge kommt. Verwende die Wörter Zwerchfell, Brustraum und Lunge.",
        "Beim Einatmen zieht sich das Zwerchfell zusammen und wird flacher. Dadurch wird der Brustraum größer. Die Lunge dehnt sich mit, und Luft strömt hinein.",
        ["Das Zwerchfell zieht sich zusammen und wird flacher (auch richtig: Die Zwischenrippenmuskeln heben die Rippen)", "Der Brustraum wird dadurch größer", "Die Lunge dehnt sich mit, und Luft strömt hinein"],
        ["zusammen|flach|senkt|unten|heben|hebt", "größer|weiter|mehr platz|mehr raum|vergrößert", "dehnt|strömt|hinein|einström|füllt"]),

      /* ----- Blut ----- */
      m(B, "Ordne jedem Bestandteil des Blutes seine Aufgabe zu.",
        [["Blutplasma", "transportiert Nährstoffe, Abfallstoffe und Wärme"], ["rote Blutkörperchen", "transportieren Sauerstoff"], ["weiße Blutkörperchen", "bekämpfen Krankheitserreger"], ["Blutplättchen", "verschließen Wunden"]]),
      o(B, "Du hast dich in den Finger geschnitten. Bringe in die richtige Reihenfolge, wie sich die Wunde verschließt.",
        ["Blutplättchen lagern sich am Rand der Wunde an und verkleben.", "Fäden aus Fibrin spannen ein Netz über die Wunde.", "Im Netz bleiben Blutzellen hängen – ein Pfropf dichtet die Wunde ab.", "Der Pfropf trocknet zu Schorf, darunter wächst neue Haut."]),
      c(B, "Warum werden ständig neue Blutspenden gebraucht?",
        ["Blut lässt sich nicht künstlich herstellen und ist nur begrenzt haltbar.", "Gespendetes Blut ist gesünder als das eigene Blut eines Menschen.", "Jeder Mensch muss einmal im Jahr sein Blut austauschen lassen.", "Künstliches Blut aus der Fabrik ist für Krankenhäuser viel zu teuer."]),

      /* ----- Herz und Blutkreislauf ----- */
      herzBild(),
      c(H, "Welche Aufgabe haben die Herzklappen?",
        ["Sie lassen das Blut nur in eine Richtung strömen.", "Sie pumpen das Blut aus den Kammern in die Arterien.", "Sie trennen die rechte von der linken Herzhälfte.", "Sie nehmen den Sauerstoff aus dem Blut auf."]),
      c(H, "Welche Aussage über die Blutgefäße stimmt?",
        ["Arterien führen das Blut vom Herzen weg, Venen führen es zum Herzen hin.", "Venen führen das Blut vom Herzen weg, Arterien führen es zum Herzen hin.", "Arterien führen immer sauerstoffreiches Blut, Venen immer sauerstoffarmes.", "Kapillaren führen das Blut vom Herzen weg, Arterien führen es zum Herzen hin."]),
      kreislaufBild(),

      /* ----- Herz und Kreislauf gesund halten ----- */
      c(Z, "Das Bild zeigt zwei Arterien im Querschnitt. Was ist in Arterie 2 passiert?",
        ["In der Gefäßwand haben sich Fett und Kalk abgelagert. Die Arterie ist enger.", "Die Gefäßwand ist durch Sport dicker geworden. Das Blut fließt jetzt leichter.", "Die Arterie hat sich geweitet. Es passt jetzt mehr Blut hindurch als vorher.", "Ein Blutpfropf hat die Arterie ganz verschlossen. Es fließt kein Blut mehr."],
        { image: BILD + "mensch-arterie.svg", imageAlt: "Zwei Arterien im Querschnitt. Arterie 1: ein Ring aus Gefäßwand, innen eine große runde Öffnung voller Blut. Arterie 2: An der Innenseite der Gefäßwand liegt eine dicke gelbe Schicht. Für das Blut bleibt nur noch eine kleine Öffnung in der Mitte frei." }),
      c(Z, "Das Diagramm zeigt den Puls eines Schülers. Welche Aussage passt zum Diagramm?",
        ["Bei Belastung steigt der Puls stark an, in der Pause sinkt er wieder.", "Nach drei Minuten Pause ist der Puls niedriger als in Ruhe.", "Direkt nach dem Sprint ist der Puls genauso hoch wie in Ruhe.", "In der Pause steigt der Puls weiter an, weil das Herz müde ist."],
        { image: BILD + "puls-diagramm.svg", imageAlt: "Säulendiagramm Puls in Schlägen pro Minute: in Ruhe 72, direkt nach dem Sprint 148, nach drei Minuten Pause 88" }),
      t(Z, "Nenne zwei Dinge, die Herz und Kreislauf schaden, und zwei Dinge, die sie gesund halten.",
        "Schädlich sind zum Beispiel Rauchen, Bewegungsmangel, zu fettes und zu süßes Essen, Dauerstress oder Alkohol. Gesund halten jeden Tag Bewegung, ausgewogenes Essen, genug Schlaf und nicht zu rauchen.",
        ["ein richtiger Risikofaktor (zum Beispiel Rauchen, Bewegungsmangel, zu fettes oder zu süßes Essen, Übergewicht, Dauerstress, Alkohol)", "ein zweiter richtiger Risikofaktor", "eine richtige Schutzmaßnahme (zum Beispiel jeden Tag Bewegung, ausgewogen essen, nicht rauchen, genug schlafen)", "eine zweite richtige Schutzmaßnahme"],
        ["rauch|nikotin|zigarette|vape", "fett|süß|zucker|übergewicht|bewegungsmangel|sitzen|stress|alkohol|fast food|limo", "beweg|sport|rad|laufen|schwimmen", "essen|ernähr|obst|gemüse|wasser|schlaf|nicht rauchen|erhol"]),

      /* ----- Transfer ----- */
      c(Z, "Frau Demir fährt seit einem Jahr jeden Tag mit dem Rad zur Arbeit. Ihr Ruhepuls ist in dieser Zeit von 80 auf 66 Schläge pro Minute gesunken. Was ist der Grund?",
        ["Ihr Herzmuskel ist kräftiger geworden und pumpt mit jedem Schlag mehr Blut.", "Ihr Herz ist vom vielen Radfahren müde und schlägt deshalb langsamer.", "Sie hat durch das Radfahren weniger Blut, das gepumpt werden muss.", "Ihre Arterien sind enger geworden, deshalb fließt das Blut langsamer."],
        { transfer: true }),
      t(G, "25 Kinder sitzen zwei Stunden lang in einem Klassenzimmer. Die Fenster sind geschlossen, die Luft wird „schlecht“. Erkläre, wie das Atmen die Luft im Raum verändert und warum Lüften hilft.",
        "Bei jedem Atemzug nimmt der Körper Sauerstoff aus der Luft auf und gibt Kohlenstoffdioxid ab. In der Luft im Raum wird deshalb der Sauerstoff weniger und das Kohlenstoffdioxid mehr. Beim Lüften strömt frische Luft mit mehr Sauerstoff und wenig Kohlenstoffdioxid herein.",
        ["Der Sauerstoff in der Raumluft wird weniger, weil er beim Atmen aufgenommen wird", "Das Kohlenstoffdioxid in der Raumluft wird mehr, weil es ausgeatmet wird", "Lüften tauscht die Luft aus: Frische Luft mit mehr Sauerstoff und weniger Kohlenstoffdioxid kommt herein"],
        ["sauerstoff", "kohlenstoffdioxid|co2|co₂", "frisch|austausch|neue luft|herein|hinaus|raus"],
        { transfer: true }),
      t(H, "Auf einer langen Busfahrt sitzt du viele Stunden still. Deine Füße werden dick und schwer. Es hilft, zwischendurch aufzustehen und die Beine zu bewegen. Erkläre das. Denke an die Venen in den Beinen, an die Muskeln und an die Venenklappen.",
        "In den Beinen muss das Blut in den Venen gegen die Schwerkraft nach oben zum Herzen fließen. Bewegen sich die Beinmuskeln, drücken sie die Venen zusammen und schieben das Blut weiter. Die Venenklappen lassen es nur in Richtung Herz fließen, es kann nicht zurücksacken. Beim langen Stillsitzen fehlt diese Hilfe, das Blut staut sich in den Beinen.",
        ["Das Blut muss in den Beinvenen nach oben zum Herzen fließen (gegen die Schwerkraft)", "Die Beinmuskeln drücken beim Bewegen die Venen zusammen und schieben das Blut weiter", "Die Venenklappen lassen das Blut nur in Richtung Herz fließen – es kann nicht zurückfließen"],
        ["nach oben|zum herz|schwerkraft|hoch", "drück|press|pump|schieb|quetsch|anspann", "zurück|eine richtung|richtung herz|nur zum herz"],
        { transfer: true })
    ]
  },

  /* ================= Fassung für M-Klassen ================= */
  "nt7-mensch-m": {
    id: "nt7-mensch-m", zug: "M", thema: "mensch", minutes: 45,
    title: "Probe Mensch und Gesundheit (7M)",
    scope: "Atmungsorgane, Atmen und Gasaustausch, Zellatmung, Blut, Herz und Blutkreislauf, Herz und Kreislauf gesund halten",
    items: [
      /* ----- Der Weg der Luft: Atmungsorgane ----- */
      atemwege(),
      c(A, "Die Lunge besteht aus etwa 300 Millionen winzigen Lungenbläschen. Welchen Vorteil hat das gegenüber einem einzigen großen Hohlraum?",
        ["Viele kleine Bläschen haben zusammen eine viel größere Oberfläche für den Gasaustausch.", "Viele kleine Bläschen sind zusammen leichter als ein einziger großer Hohlraum.", "In vielen kleinen Bläschen bleibt die Luft länger warm als in einem großen Hohlraum.", "Viele kleine Bläschen können mehr Staub festhalten als ein einziger großer Hohlraum."]),
      kehldeckel(),
      t(A, "Mit jedem Atemzug gelangt auch Staub in die Luftröhre. Erkläre, wie die Luftröhre dafür sorgt, dass er nicht in die Lunge kommt.",
        "Die Luftröhre ist innen mit einer Schleimhaut ausgekleidet. Der Staub bleibt am klebrigen Schleim hängen. Die Flimmerhärchen schlagen in Richtung Rachen und befördern den Schleim mit dem Staub nach oben. Dort wird er verschluckt oder ausgehustet.",
        ["Der Staub bleibt am klebrigen Schleim der Schleimhaut hängen", "Die Flimmerhärchen befördern den Schleim mit dem Staub nach oben zum Rachen", "Im Rachen wird der Schleim verschluckt oder ausgehustet"],
        ["schleim", "flimmerhärchen|flimmerhaare|härchen", "verschluck|geschluckt|ausgehustet|husten|hustet"]),

      /* ----- Atmen und Gasaustausch ----- */
      c(G, "Welche Wortgleichung beschreibt die Zellatmung?",
        ["Traubenzucker + Sauerstoff → Kohlenstoffdioxid + Wasser", "Kohlenstoffdioxid + Wasser → Traubenzucker + Sauerstoff", "Traubenzucker + Kohlenstoffdioxid → Sauerstoff + Wasser", "Sauerstoff + Stickstoff → Kohlenstoffdioxid + Wasser"]),
      t(G, "Die Animation zeigt das Glasglocken-Modell: A ist die Glasglocke, B der Luftballon, C die Gummihaut. Erkläre, warum Luft in den Ballon strömt, wenn man die Gummihaut nach unten zieht. Nenne außerdem eine Sache, die das Modell nicht oder anders zeigt als dein Körper.",
        "Zieht man die Gummihaut nach unten, wird der Raum in der Glocke größer. Dieselbe Luft verteilt sich auf mehr Platz, der Druck in der Glocke sinkt. Draußen ist der Druck jetzt höher, deshalb strömt Luft durch das Rohr in den Ballon – so wie beim Einatmen in die Lunge. Das Modell zeigt aber keine Rippen und keine Rippenatmung. Es hat nur einen Ballon statt zwei Lungenflügeln mit Lungenbläschen, und es gibt keinen Gasaustausch mit dem Blut.",
        ["Der Raum in der Glocke wird größer (so wie der Brustraum, wenn das Zwerchfell flacher wird)", "Der Druck in der Glocke sinkt und ist kleiner als draußen – deshalb strömt Luft von außen in den Ballon", "Eine Grenze des Modells genannt (zum Beispiel: keine Rippen und keine Rippenatmung, nur ein Ballon statt zwei Lungenflügeln mit Lungenbläschen, kein Gasaustausch mit dem Blut, Luft zwischen Ballon und Glas)"],
        ["größer|mehr platz|mehr raum|vergrößert", "druck|unterdruck", "rippen|lungenflügel|lungenbläschen|gasaustausch|nur ein|blut|starr"],
        { image: BILD + "mensch-glasglocke.svg", imageAlt: "Animation: Eine Glasglocke (A) ist unten mit einer Gummihaut (C) verschlossen. Durch einen Stopfen führt ein Glasrohr in die Glocke, an seinem Ende hängt ein Luftballon (B). Die Gummihaut wird nach unten gezogen und wieder losgelassen. Beim Ziehen strömt Luft durch das Rohr, und der Ballon wird größer. Beim Loslassen wird er wieder kleiner." }),
      gasTeilchen(),
      c(G, "Wie ist die Ausatemluft ungefähr zusammengesetzt?",
        ["78 % Stickstoff, 17 % Sauerstoff, 4 % Kohlenstoffdioxid", "78 % Stickstoff, 21 % Sauerstoff, 0,04 % Kohlenstoffdioxid", "78 % Stickstoff, 4 % Sauerstoff, 17 % Kohlenstoffdioxid", "17 % Stickstoff, 4 % Sauerstoff, 78 % Kohlenstoffdioxid"]),

      /* ----- Blut ----- */
      c(B, "Das Bild zeigt Blut vor und nach dem Schleudern in der Zentrifuge. Welche Aussage über die Schichten stimmt?",
        ["A ist das Blutplasma, C sind die roten Blutkörperchen.", "A sind die roten Blutkörperchen, C ist das Blutplasma.", "A ist reines Wasser, C ist der rote Blutfarbstoff.", "A sind die Blutplättchen, C sind die weißen Blutkörperchen."],
        { image: BILD + "mensch-blutroehrchen.svg", imageAlt: "Zwei Röhrchen mit Blut. Vor dem Schleudern ist das Blut gleichmäßig rot. Nach dem Schleudern liegt oben eine gelbliche, klare Schicht A, sie macht etwa 55 Prozent aus. Unten liegt eine dunkelrote Schicht C mit etwa 45 Prozent. Dazwischen ist eine hauchdünne helle Schicht zu sehen." }),
      m(B, "Im Labor wird ein Blutbild gemacht. Ordne jedem Befund die passende Folge zu.",
        [["zu wenige rote Blutkörperchen", "Die Person ist oft müde und schnell außer Atem."], ["sehr viele weiße Blutkörperchen", "Der Körper bekämpft gerade eine Infektion."], ["zu wenige Blutplättchen", "Schon kleine Wunden bluten lange."]]),
      c(B, "Bei der Blutgerinnung bilden sich Fäden aus Fibrin. Welche Aufgabe haben sie?",
        ["Sie bilden ein Netz, in dem Blutzellen hängen bleiben – so entsteht ein Pfropf.", "Sie transportieren Sauerstoff zur verletzten Stelle – so heilt die Wunde schneller.", "Sie bekämpfen die Krankheitserreger, die in die Wunde eingedrungen sind.", "Sie wachsen zu einer neuen Hautschicht zusammen, die für immer bleibt."]),
      c(B, "Vor einer Blutübertragung wird im Labor die Blutgruppe getestet. Warum ist das nötig?",
        ["Passen die Blutgruppen nicht zusammen, verklumpen die roten Blutkörperchen.", "Passen die Blutgruppen nicht zusammen, wird das Blut viel zu dünnflüssig.", "Nur Blut der Blutgruppe 0 enthält genügend rote Blutkörperchen.", "Bei fremden Blutgruppen fehlen die Blutplättchen für den Wundverschluss."]),

      /* ----- Herz und Blutkreislauf ----- */
      herzBild(),
      kreislaufBild(),
      t(H, "„In Arterien fließt immer sauerstoffreiches Blut.“ Erkläre, warum diese Aussage falsch ist.",
        "Arterien sind Blutgefäße, die das Blut vom Herzen wegführen. Die Lungenarterie führt das Blut von der rechten Herzkammer zur Lunge. Dieses Blut kommt aus dem Körper und hat seinen Sauerstoff abgegeben: Es ist sauerstoffarm. Erst in der Lunge nimmt es wieder Sauerstoff auf.",
        ["Arterien heißen alle Gefäße, die Blut vom Herzen wegführen", "Die Lungenarterie führt Blut vom Herzen zur Lunge", "Dieses Blut ist sauerstoffarm – es nimmt erst in der Lunge Sauerstoff auf"],
        ["vom herzen|herzen weg|wegführ|weg führ|führen weg", "lungenarterie|zur lunge|in die lunge", "sauerstoffarm|wenig sauerstoff|kaum sauerstoff|keinen sauerstoff|erst in der lunge"]),
      c(H, "Warum hat die linke Herzkammer eine viel dickere Muskelwand als die rechte?",
        ["Sie pumpt das Blut durch den ganzen Körper, die rechte nur durch die Lunge.", "Sie pumpt das Blut nur durch die Lunge, die rechte durch den ganzen Körper.", "Sie nimmt das sauerstoffarme Blut aus dem ganzen Körper auf.", "Sie muss das Blut in der Körperschleife mit Sauerstoff beladen."]),

      /* ----- Herz und Kreislauf gesund halten ----- */
      t(Z, "Das Diagramm zeigt den Puls eines Schülers in Ruhe, direkt nach einem Sprint und nach drei Minuten Pause. Beschreibe den Verlauf und erkläre, warum der Puls bei Belastung steigt.",
        "In Ruhe liegt der Puls bei 72, direkt nach dem Sprint bei 148 und nach drei Minuten Pause bei 88 Schlägen pro Minute. Beim Sprint arbeiten die Muskeln stärker und brauchen mehr Energie. Dafür brauchen sie mehr Sauerstoff und Nährstoffe, und es entsteht mehr Kohlenstoffdioxid. Das Herz schlägt schneller, damit das Blut den Sauerstoff rascher zu den Muskeln bringt und das Kohlenstoffdioxid abtransportiert.",
        ["Verlauf beschrieben: Bei Belastung steigt der Puls stark an (von 72 auf 148), in der Pause sinkt er wieder (auf 88)", "Die Muskeln brauchen bei Belastung mehr Energie und deshalb mehr Sauerstoff", "Das Herz schlägt schneller, damit das Blut mehr Sauerstoff zu den Muskeln bringt bzw. das Kohlenstoffdioxid abtransportiert"],
        ["steigt|höher|sinkt|148|72|88", "energie|sauerstoff", "transport|bringt|pumpt|mehr blut|kohlenstoffdioxid|co2|versorg"],
        { image: BILD + "puls-diagramm.svg", imageAlt: "Säulendiagramm Puls in Schlägen pro Minute: in Ruhe 72, direkt nach dem Sprint 148, nach drei Minuten Pause 88" }),
      c(Z, "Das Bild zeigt zwei Arterien im Querschnitt. Arterie 2 ist krank. Welche Aussage stimmt?",
        ["Arteriosklerose: Ablagerungen machen die Arterie eng, das Herz muss kräftiger pumpen.", "Arteriosklerose: Die Arterie ist weiter geworden, das Herz muss weniger pumpen.", "Herzinfarkt: Ein Blutpfropf hat diese Arterie schon vollständig verschlossen.", "Schlaganfall: Die Gefäßwand ist geplatzt, das Blut läuft aus der Arterie."],
        { image: BILD + "mensch-arterie.svg", imageAlt: "Zwei Arterien im Querschnitt. Arterie 1: ein Ring aus Gefäßwand, innen eine große runde Öffnung voller Blut. Arterie 2: An der Innenseite der Gefäßwand liegt eine dicke gelbe Schicht. Für das Blut bleibt nur noch eine kleine Öffnung in der Mitte frei." }),
      c(Z, "Warum schadet das Kohlenstoffmonoxid aus dem Tabakrauch dem Körper?",
        ["Es besetzt in den roten Blutkörperchen den Platz des Sauerstoffs.", "Es verengt die Blutgefäße und macht schnell abhängig.", "Es lagert sich als Kalk in den Wänden der Arterien ab.", "Es lähmt die Blutplättchen, sodass Wunden länger bluten."]),

      /* ----- Transfer ----- */
      t(G, "25 Kinder sitzen zwei Stunden lang in einem Klassenzimmer. Die Fenster sind geschlossen, die Luft wird „schlecht“. Erkläre, wie das Atmen die Luft im Raum verändert und warum Lüften hilft. Nutze, was du über Einatemluft und Ausatemluft weißt.",
        "Die Einatemluft enthält etwa 21 % Sauerstoff und nur 0,04 % Kohlenstoffdioxid, die Ausatemluft nur noch etwa 17 % Sauerstoff, aber etwa 4 % Kohlenstoffdioxid. Mit jedem Atemzug wird deshalb in der Raumluft der Sauerstoff weniger und das Kohlenstoffdioxid mehr. Beim Lüften strömt frische Luft mit mehr Sauerstoff und wenig Kohlenstoffdioxid herein.",
        ["Der Sauerstoff in der Raumluft wird weniger, weil er beim Atmen aufgenommen wird", "Das Kohlenstoffdioxid in der Raumluft wird mehr, weil es ausgeatmet wird", "Lüften tauscht die Luft aus: Frische Luft mit mehr Sauerstoff und weniger Kohlenstoffdioxid kommt herein"],
        ["sauerstoff", "kohlenstoffdioxid|co2|co₂", "frisch|austausch|neue luft|herein|hinaus|raus"],
        { transfer: true }),
      t(H, "Auf einer langen Busfahrt sitzt du viele Stunden still. Deine Füße werden dick und schwer. Es hilft, zwischendurch aufzustehen und die Beine zu bewegen. Erkläre das mit dem Weg des Blutes von den Füßen zurück zum Herzen.",
        "In den Beinen muss das Blut in den Venen gegen die Schwerkraft nach oben zum Herzen fließen. Bewegen sich die Beinmuskeln, drücken sie die Venen zusammen und schieben das Blut weiter. Die Venenklappen lassen es nur in Richtung Herz fließen, es kann nicht zurücksacken. Beim langen Stillsitzen fehlt diese Hilfe, das Blut staut sich in den Beinen.",
        ["Das Blut muss in den Beinvenen nach oben zum Herzen fließen (gegen die Schwerkraft)", "Die Beinmuskeln drücken beim Bewegen die Venen zusammen und schieben das Blut weiter", "Die Venenklappen lassen das Blut nur in Richtung Herz fließen – es kann nicht zurückfließen"],
        ["vene|schwerkraft|nach oben", "muskel", "klappe"],
        { transfer: true }),
      t(B, "Eine Ausdauerläuferin spendet zwei Tage vor einem wichtigen Wettkampf Blut. Ihr Trainer hält das für keine gute Idee. Begründe seine Meinung. Nutze, was du über die Blutbestandteile und über die Zeit nach einer Blutspende weißt.",
        "Bei der Spende gibt sie etwa einen halben Liter Blut ab und damit auch viele rote Blutkörperchen. Die Flüssigkeit bildet der Körper schnell nach, die Blutzellen aber erst in den nächsten Wochen. Zwei Tage nach der Spende hat sie also weniger rote Blutkörperchen. Ihr Blut kann weniger Sauerstoff zu den Muskeln transportieren, und sie hat weniger Ausdauer.",
        ["Mit der Spende verliert sie rote Blutkörperchen; der Körper bildet die Blutzellen erst in den nächsten Wochen nach", "Rote Blutkörperchen transportieren den Sauerstoff – ihr Blut kann jetzt weniger Sauerstoff transportieren", "Die Muskeln bekommen weniger Sauerstoff: weniger Leistung und Ausdauer im Wettkampf"],
        ["wochen|nachgebildet|nachbilden|bildet|fehlen|weniger rote|verliert", "sauerstoff", "muskel|ausdauer|leistung|müde|schlapp|außer atem|langsamer"],
        { transfer: true })
    ]
  }
};
