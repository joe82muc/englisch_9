"use strict";
// Block-Probe „Radioaktivität“ – Fassung 9M und 9R. Lösungen bleiben im Backend.
//
// Module des Blocks: ra-nachweis, ra-strahlungsarten, ra-halbwertszeit, ra-c14, ra-folgen, ra-anwendung.
// Bei Ankreuzaufgaben steht die richtige Antwort immer zuerst (answer: 0), bei Zuordnungen stehen die Optionen
// in der Reihenfolge der Zeilen – gemischt wird beim Laden. Rechtschreibung zählt nie.
// Zahlen (Halbwertszeiten, Jahreszahlen, Messwerte) stammen aus den Modulseiten.

const T_NACHWEIS = "Radioaktivität und ihr Nachweis";
const T_ARTEN = "Die Strahlungsarten";
const T_HWZ = "Die Halbwertszeit";
const T_C14 = "Die C-14-Methode";
const T_FOLGEN = "Biologische Folgen von Strahlung";
const T_ANWENDUNG = "Anwendung radioaktiver Strahlung";
const T_TRANSFER = "Transfer";

const BILD = {
  quellen: { image: "assets/probe/ra-quellen.svg", imageAlt: "Animierte Landschaft im Schnitt mit vier Stellen A, B, C und D. A: Pfeile kommen von oben aus dem dunklen Weltall durch die Lufthülle bis zum Erdboden. B: Pfeile steigen aus dem Gestein im Untergrund nach oben. C: Ein Mensch, von dessen Körper feine Wellen ausgehen. D: Ein Kraftwerk mit Kühlturm und ein Krankenhaus, beide tragen das Warnzeichen für Radioaktivität." },
  abschirmung: { image: "assets/probe/ra-abschirmung.svg", imageAlt: "Animierte Zeichnung: Links steht ein Strahler, von dem drei Strahlen A, B und C nach rechts laufen. Hintereinander stehen ein Blatt Papier, eine dünne Platte aus Aluminium und ein dicker Block aus Blei. Strahl A geht durch das Papier und endet an der Aluminiumplatte. Strahl B endet schon am Papier. Strahl C geht durch Papier und Aluminium und kommt hinter dem Blei nur noch schwächer heraus." },
  ablenkung: { image: "assets/probe/ra-ablenkung.svg", imageAlt: "Animierte Zeichnung: Ein Strahl aus einem Strahler läuft von links zwischen zwei geladene Platten. Die obere Platte ist positiv geladen (Pluszeichen), die untere negativ (Minuszeichen). Hinter dem Eintritt teilt sich der Strahl in drei Strahlen: Strahl 1 biegt stark nach oben zur positiven Platte ab, Strahl 2 läuft geradeaus weiter, Strahl 3 biegt leicht nach unten zur negativen Platte ab." },
  kurve: { image: "assets/probe/ra-zerfallskurve.svg", imageAlt: "Animiertes Diagramm mit einer fallenden Kurve. Nach rechts ist die Zeit in Tagen aufgetragen (0 bis 32), nach oben die Anzahl der Atome (0 bis 8.000). Die Kurve beginnt bei 8.000 Atomen, fällt erst steil und wird dann immer flacher. Markierte Punkte: nach 8 Tagen 4.000 Atome, nach 16 Tagen 2.000 Atome, nach 24 Tagen 1.000 Atome, nach 32 Tagen 500 Atome." },
  c14: { image: "assets/probe/ra-c14-weg.svg", imageAlt: "Animiertes Schaubild mit vier nummerierten Stellen. Kleine orange Punkte stehen für C-14-Atome. Stelle 1: Hoch oben in der Luft treffen gelbe Strahlen aus dem Weltall ein, dort erscheinen die orangen Punkte. Stelle 2: Ein Pfeil führt aus der Luft in einen Baum, in der Baumkrone sitzen Punkte. Stelle 3: Ein Reh frisst am Baum, auch im Tier sitzen Punkte. Stelle 4: Tief im Boden liegt ein Knochen, in dem die Punkte nach und nach verblassen." }
};

/* ---------- Aufgaben, die in beiden Fassungen gleich sind ---------- */
const GLEICH = {
  becquerel: { teil: T_NACHWEIS, modul: "ra-nachweis", type: "choice", prompt: "Wie entdeckte Henri Becquerel im Jahr 1896 die Radioaktivität?",
    options: ["Ein Mineral mit Uran schwärzte eine Fotoplatte, obwohl sie lichtdicht verpackt war.", "In einer Nebelkammer sah er feine Spuren, die von einem Stück Granit ausgingen.", "Sein Geiger-Müller-Zähler klickte, als er ihn an ein Mineral mit Uran hielt.", "Ein Thermometer zeigte, dass ein Mineral mit Uran von selbst immer wärmer wurde."], answer: 0, points: 1 },
  nachweis: { teil: T_NACHWEIS, modul: "ra-nachweis", type: "match", prompt: "Radioaktive Strahlung kann man nicht sehen, hören oder fühlen. Woran erkennt man sie bei diesen drei Nachweisen? Ordne zu.",
    options: ["Das Material wird geschwärzt (dunkle Flecken).", "Feine Nebelspuren zeigen den Weg der Teilchen.", "Elektrische Impulse sind als Klicks zu hören."],
    rows: [{ text: "Fotoplatte", answer: 0 }, { text: "Nebelkammer", answer: 1 }, { text: "Geiger-Müller-Zähler", answer: 2 }] },
  abschirmung: (p) => ({ teil: T_ARTEN, modul: "ra-strahlungsarten", ...BILD.abschirmung, type: "match", prompt: p,
    options: ["Beta-Strahlung", "Alpha-Strahlung", "Gamma-Strahlung"],
    rows: [{ text: "Strahl A", answer: 0 }, { text: "Strahl B", answer: 1 }, { text: "Strahl C", answer: 2 }] }),
  hwzBegriff: { teil: T_HWZ, modul: "ra-halbwertszeit", type: "choice", prompt: "Was gibt die Halbwertszeit eines radioaktiven Stoffes an?",
    options: ["die Zeit, in der die Hälfte seiner Atomkerne zerfallen ist", "die Zeit, in der alle seine Atomkerne zerfallen sind", "die halbe Zeit, in der er für Menschen gefährlich ist", "die Zeit, in der seine Strahlung doppelt so stark wird"], answer: 0, points: 1 },
  kurveAblesen: { teil: T_HWZ, modul: "ra-halbwertszeit", ...BILD.kurve, type: "choice", prompt: "Das Diagramm zeigt, wie ein radioaktiver Stoff zerfällt. Am Anfang sind 8.000 Atome vorhanden. Lies ab: Wie groß ist die Halbwertszeit dieses Stoffes?",
    options: ["8 Tage", "4 Tage", "16 Tage", "32 Tage"], answer: 0, points: 1 },
  c14Weg: (p) => ({ teil: T_C14, modul: "ra-c14", ...BILD.c14, type: "match", prompt: p,
    options: ["C-14 entsteht durch kosmische Strahlung.", "Pflanzen nehmen C-14 als Kohlenstoffdioxid auf.", "Tiere und Menschen nehmen C-14 mit der Nahrung auf.", "Es kommt kein neues C-14 mehr dazu, das vorhandene zerfällt."],
    rows: [{ text: "Stelle 1", answer: 0 }, { text: "Stelle 2", answer: 1 }, { text: "Stelle 3", answer: 2 }, { text: "Stelle 4", answer: 3 }] }),
  schaeden: { teil: T_FOLGEN, modul: "ra-folgen", type: "match", prompt: "Radioaktive Strahlung kann dem Körper schaden. Zu welcher Art von Schaden gehört das Beispiel? Ordne zu.",
    options: ["Frühschäden", "Spätschäden", "genetische Schäden"],
    rows: [{ text: "Übelkeit, Erbrechen und Haarausfall kurz nach einer starken Bestrahlung", answer: 0 }, { text: "Krebs, zum Beispiel Leukämie, nach Monaten oder Jahren", answer: 1 }, { text: "Missbildungen bei den Nachkommen, weil Keimzellen verändert wurden", answer: 2 }] },
  sievert: { teil: T_FOLGEN, modul: "ra-folgen", type: "choice", prompt: "In welcher Einheit gibt man die Strahlendosis an?",
    options: ["Sievert (Sv)", "Becquerel (Bq)", "Ampere (A)", "Watt (W)"], answer: 0, points: 1 }
};

/* ============================== 9M ============================== */
const probeM = {
  id: "nt9m-radioaktivitaet",
  title: "Probe Radioaktivität (9M)",
  unit: "NT 9M · Nachweis, Strahlungsarten, Halbwertszeit, C-14-Methode, Folgen und Anwendung",
  classLevel: "9M",
  thema: "radioaktivitaet",
  minutes: 45,
  items: [
    /* --- Radioaktivität und ihr Nachweis --- */
    { teil: T_NACHWEIS, modul: "ra-nachweis", ...BILD.quellen, type: "match", prompt: "Die Abbildung zeigt vier Quellen radioaktiver Strahlung. Ordne A, B, C und D den richtigen Begriff zu.",
      options: ["Höhenstrahlung", "Bodenstrahlung", "Eigenstrahlung", "künstliche Radioaktivität"],
      rows: [{ text: "A", answer: 0 }, { text: "B", answer: 1 }, { text: "C", answer: 2 }, { text: "D", answer: 3 }] },
    GLEICH.becquerel,
    GLEICH.nachweis,
    { teil: T_NACHWEIS, modul: "ra-nachweis", type: "choice", prompt: "Warum ist die natürliche Strahlung auf der Zugspitze stärker als im Flachland?",
      options: ["Über dem Berg ist die Lufthülle dünner und hält weniger Strahlung aus dem Weltraum ab.", "Auf dem Berg ist es kälter, deshalb senden die Gesteine dort mehr Strahlung aus.", "Der Schnee auf dem Gipfel speichert die Strahlung und gibt sie langsam wieder ab.", "Auf dem Berg ist der Luftdruck niedriger, deshalb zerfallen die Atome dort schneller."], answer: 0, points: 1 },

    /* --- Die Strahlungsarten --- */
    GLEICH.abschirmung("Ein Strahler sendet drei Strahlen aus. Sie treffen nacheinander auf Papier, Aluminium und Blei. Welche Strahlungsart ist Strahl A, B und C?"),
    { teil: T_ARTEN, modul: "ra-strahlungsarten", type: "choice", prompt: "Woraus besteht Alpha-Strahlung?",
      options: ["aus Heliumkernen mit je 2 Protonen und 2 Neutronen", "aus schnellen Elektronen mit negativer Ladung", "aus einer elektromagnetischen Welle ohne Ladung", "aus einzelnen Neutronen ohne elektrische Ladung"], answer: 0, points: 1 },
    { teil: T_ARTEN, modul: "ra-strahlungsarten", ...BILD.ablenkung, type: "text", prompt: "Radioaktive Strahlung läuft durch ein elektrisches Feld zwischen einer positiv und einer negativ geladenen Platte. Gib an, welche Strahlungsart Strahl 1, 2 und 3 ist, und begründe jeweils mit der Ladung.",
      expected: "Strahl 1 ist Beta-Strahlung: Sie besteht aus Elektronen, ist negativ geladen und wird deshalb zur positiven Platte gezogen. Strahl 2 ist Gamma-Strahlung: Sie ist eine elektromagnetische Welle ohne Ladung und wird nicht abgelenkt. Strahl 3 ist Alpha-Strahlung: Sie ist positiv geladen und wird zur negativen Platte abgelenkt.",
      kriterien: "1 Punkt: Strahl 1 = Beta-Strahlung, weil sie negativ geladen ist (wird zum Pluspol gezogen). 1 Punkt: Strahl 2 = Gamma-Strahlung, weil sie keine Ladung hat (wird nicht abgelenkt). 1 Punkt: Strahl 3 = Alpha-Strahlung, weil sie positiv geladen ist (wird zum Minuspol gezogen). Sind alle drei Strahlen richtig benannt, aber gar nicht begründet: insgesamt 2 Punkte.",
      keywords: ["beta", "gamma", "alpha", "negativ", "positiv", "keine ladung", "ungeladen", "pluspol", "minuspol", "elektron"], points: 3, lines: 6 },

    /* --- Die Halbwertszeit --- */
    GLEICH.hwzBegriff,
    GLEICH.kurveAblesen,
    { teil: T_HWZ, modul: "ra-halbwertszeit", ...BILD.kurve, type: "text", prompt: "Das Diagramm endet nach 32 Tagen bei 500 Atomen. Der Stoff zerfällt aber weiter. Berechne, wie viele Atome nach 48 Tagen noch nicht zerfallen sind. Schreibe deinen Rechenweg auf.",
      expected: "Die Halbwertszeit beträgt 8 Tage. Von Tag 32 bis Tag 48 vergehen 16 Tage, das sind zwei Halbwertszeiten. Die Zahl der Atome halbiert sich also noch zweimal: 500 → 250 → 125. Nach 48 Tagen sind noch 125 Atome übrig.",
      kriterien: "1 Punkt: Rechenweg erkennbar: Mit der Halbwertszeit von 8 Tagen wird weiter halbiert (von Tag 32 bis Tag 48 zwei Halbwertszeiten oder insgesamt sechs Halbwertszeiten ab 8.000). 1 Punkt: Ergebnis 125 Atome. Wer mit einer falsch abgelesenen Halbwertszeit folgerichtig weiterrechnet (z. B. 16 Tage → 250 Atome), erhält 1 Punkt.",
      keywords: ["125", "250", "halbwertszeit", "halbier", "hälfte", "zweimal", "zwei", "8 tage", "sechs"], points: 2, lines: 4 },

    /* --- Die C-14-Methode --- */
    GLEICH.c14Weg("Die Abbildung zeigt den Weg von C-14 von der Entstehung bis zum Fund. Was passiert an den Stellen 1, 2, 3 und 4?"),
    { teil: T_C14, modul: "ra-c14", type: "choice", prompt: "Ein Knochen enthält nur noch ein Viertel (25 %) des C-14 von frischem Material. Die Halbwertszeit von C-14 beträgt 5.730 Jahre. Wie alt ist der Knochen ungefähr?",
      options: ["11.460 Jahre", "5.730 Jahre", "17.190 Jahre", "22.920 Jahre"], answer: 0, points: 1 },

    /* --- Biologische Folgen von Strahlung --- */
    GLEICH.schaeden,
    GLEICH.sievert,
    { teil: T_FOLGEN, modul: "ra-folgen", type: "text", prompt: "Beschreibe, was radioaktive Strahlung in den Zellen des Körpers anrichten kann. Erkläre auch, warum eine sehr kleine Strahlenmenge meist ohne Folgen bleibt.",
      expected: "Die Strahlung gibt ihre Energie an die Zellen ab (sie wird absorbiert). Dabei können Moleküle zerbrechen und Gifte entstehen. Auch die DNS, also die Erbinformation, kann verändert werden – das nennt man Mutation. Der Körper hat aber Reparatursysteme: Kleine Schäden kann er oft selbst reparieren. Erst wenn die Strahlung zu stark ist oder zu lange dauert, schafft er das nicht mehr.",
      kriterien: "1 Punkt: Die Strahlung gibt Energie an die Zellen ab und beschädigt sie (Moleküle zerbrechen, Gifte entstehen, Zellen sterben). 1 Punkt: Die DNS bzw. Erbinformation kann verändert werden (Mutation). 1 Punkt: Der Körper kann kleine Schäden selbst reparieren; erst bei zu starker oder zu langer Strahlung reicht das nicht mehr.",
      keywords: ["energie", "absorb", "molekül", "dns", "dna", "erbinformation", "erbgut", "mutation", "reparier", "reparatur"], points: 3, lines: 6 },
    { teil: T_FOLGEN, modul: "ra-folgen", type: "choice", prompt: "Ein Teil unserer Strahlenbelastung wird vom Menschen selbst verursacht. Woher stammt davon der größte Teil?",
      options: ["aus medizinischen Untersuchungen wie dem Röntgen", "aus Kernkraftwerken im normalen Betrieb", "aus dem Betrieb von Kohlekraftwerken", "aus Flugreisen in großer Höhe"], answer: 0, points: 1 },

    /* --- Anwendung radioaktiver Strahlung --- */
    { teil: T_ANWENDUNG, modul: "ra-anwendung", type: "text", prompt: "Mit einem Szintigramm untersucht ein Arzt die Schilddrüse. Erkläre, wie ein Szintigramm entsteht.",
      expected: "Dem Patienten werden winzige Mengen radioaktiver Iod-Isotope in die Blutbahn gespritzt. Sie verhalten sich wie normales Iod und sammeln sich deshalb in der Schilddrüse. Dort senden sie Strahlung aus. Ein Messgerät zeichnet die Strahlung auf, und der Computer setzt daraus ein Bild der Schilddrüse zusammen. Der Arzt erkennt darauf gesunde und kranke Stellen.",
      kriterien: "1 Punkt: Radioaktives Iod (Iod-Isotope) wird in kleiner Menge in das Blut gespritzt. 1 Punkt: Es reichert sich in der Schilddrüse an. 1 Punkt: Die Strahlung wird mit einem Messgerät aufgezeichnet und zu einem Bild zusammengesetzt (der Arzt erkennt kranke Stellen).",
      keywords: ["iod", "jod", "gespritzt", "blut", "schilddrüse", "anreicher", "sammel", "messgerät", "bild", "computer"], points: 3, lines: 6 },
    { teil: T_ANWENDUNG, modul: "ra-anwendung", type: "choice", prompt: "Eine Gasleitung liegt unter der Erde und ist an einer Stelle undicht. Wie findet man das Leck mit Hilfe von Radioaktivität?",
      options: ["Man mischt radioaktives Xenon ins Gas und sucht mit dem Geiger-Müller-Zähler, wo es austritt.", "Man legt Fotoplatten auf die Leitung und wartet, bis das austretende Erdgas sie schwärzt.", "Man bestimmt mit der C-14-Methode, an welcher Stelle die Leitung am ältesten ist.", "Man bestrahlt die Leitung mit Alpha-Strahlung, die das Leck von außen sichtbar macht."], answer: 0, points: 1 },

    /* --- Transfer --- */
    { teil: T_TRANSFER, modul: "ra-nachweis", transfer: true, type: "text", prompt: "Lena misst mit einem Geiger-Müller-Zähler. Liegt kein Gegenstand davor, zählt er 20 Impulse pro Minute. Direkt an einem alten Wecker mit Leuchtziffern zählt er 95 Impulse pro Minute. Sendet der Wecker Strahlung aus? Begründe mit einer Rechnung und erkläre, woher die 20 Impulse ohne Wecker kommen.",
      expected: "Ja. Die 20 Impulse pro Minute sind die Nullrate: Sie kommen von der natürlichen Strahlung, die überall vorhanden ist, zum Beispiel aus dem Boden und aus dem Weltraum. Diese Nullrate muss man abziehen: 95 − 20 = 75. Vom Wecker stammen also etwa 75 Impulse pro Minute – er sendet Strahlung aus.",
      kriterien: "1 Punkt: Rechnung 95 − 20 = 75 Impulse pro Minute stammen vom Wecker. 1 Punkt: Die 20 Impulse sind die Nullrate bzw. die natürliche Strahlung, die überall vorhanden ist (Boden, Weltraum, Umgebung). 1 Punkt: Schlussfolgerung: Der Wecker sendet Strahlung aus (ist radioaktiv), weil der Messwert deutlich über der Nullrate liegt.",
      keywords: ["75", "nullrate", "abziehen", "natürlich", "hintergrund", "überall", "boden", "weltraum", "radioaktiv"], points: 3, lines: 6 },
    { teil: T_TRANSFER, modul: "ra-strahlungsarten", transfer: true, type: "text", prompt: "In einer Schulsammlung liegt ein Stoff, der nur Alpha-Strahlung aussendet. Er steckt in einer geschlossenen Pappschachtel. Tim sagt: „Dann ist der Stoff völlig harmlos.“ Beurteile Tims Aussage: Warum dringt keine Strahlung aus der Schachtel? Und warum wäre es trotzdem gefährlich, Staub von diesem Stoff einzuatmen?",
      expected: "Tim hat nur zum Teil recht. Alpha-Strahlung hat eine sehr kurze Reichweite und wird schon von Papier oder Pappe abgeschirmt, deshalb kommt aus der Schachtel nichts heraus. Atmet man den Stoff aber ein, sitzt er direkt im Körper. Dort hält nichts die Strahlung auf: Sie gibt auf kurzer Strecke sehr viel Energie an die Zellen ab und ist bei gleicher Energie 20-mal gefährlicher als Beta- oder Gamma-Strahlung. Zellen und DNS können geschädigt werden, später kann Krebs entstehen.",
      kriterien: "1 Punkt: Alpha-Strahlung wird schon von Papier/Pappe (oder der Haut) abgeschirmt bzw. hat nur eine sehr kurze Reichweite. 1 Punkt: Im Körper trifft sie direkt auf die Zellen und gibt dort auf kurzer Strecke sehr viel Energie ab (besonders gefährlich, 20-mal gefährlicher als Beta- und Gamma-Strahlung). 1 Punkt: eine mögliche Folge (Zellen oder DNS werden geschädigt, Mutation, Krebs) ODER ein begründetes Urteil (Tim hat nur teilweise recht).",
      keywords: ["papier", "pappe", "abgeschirmt", "reichweite", "haut", "energie", "zellen", "dns", "krebs", "20"], points: 3, lines: 6 },
    { teil: T_TRANSFER, modul: "ra-c14", transfer: true, type: "text", prompt: "In einer Höhle finden Forscher Holzkohle von einem uralten Lagerfeuer und daneben ein Beil aus Stein. a) Welchen der beiden Funde können sie mit der C-14-Methode untersuchen? Begründe. b) Die Messung zeigt: Es ist nur noch ein Achtel des C-14 von frischem Holz vorhanden. Die Halbwertszeit von C-14 beträgt 5.730 Jahre. Wie alt ist der Fund etwa?",
      expected: "a) Die Holzkohle. Sie stammt von einem Baum, also von einem Lebewesen, das zu Lebzeiten ständig C-14 aufgenommen hat. Seit der Baum tot ist, zerfällt das C-14. Der Stein hat nie gelebt und kein C-14 aufgenommen. b) Ein Achtel bedeutet drei Halbwertszeiten (die Hälfte, ein Viertel, ein Achtel): 3 · 5.730 Jahre = 17.190 Jahre, also etwa 17.000 Jahre.",
      kriterien: "1 Punkt: Holzkohle gewählt. 1 Punkt: Begründung: Das Holz stammt von einem Lebewesen, das C-14 aufgenommen hat; der Stein hat nie gelebt und nimmt kein C-14 auf. 1 Punkt: Ein Achtel sind drei Halbwertszeiten, also etwa 17.190 Jahre (rund 17.000 Jahre genügt).",
      keywords: ["holzkohle", "baum", "lebewesen", "gelebt", "aufgenommen", "stein", "drei halbwertszeiten", "17.190", "17190", "17.000", "17000"], points: 3, lines: 6 }
  ]
};

/* ============================== 9R ============================== */
const probeR = {
  id: "nt9r-radioaktivitaet",
  title: "Probe Radioaktivität (9R)",
  unit: "NT 9R · Nachweis, Strahlungsarten, Halbwertszeit, C-14-Methode, Folgen und Anwendung",
  classLevel: "9R",
  thema: "radioaktivitaet",
  minutes: 40,
  items: [
    /* --- Radioaktivität und ihr Nachweis --- */
    { teil: T_NACHWEIS, modul: "ra-nachweis", ...BILD.quellen, type: "match", prompt: "Die Abbildung zeigt, woher radioaktive Strahlung kommt. Was gehört zu A, B, C und D? Ordne zu.",
      options: ["Höhenstrahlung", "Bodenstrahlung", "Eigenstrahlung", "künstliche Radioaktivität"],
      rows: [{ text: "A", answer: 0 }, { text: "B", answer: 1 }, { text: "C", answer: 2 }, { text: "D", answer: 3 }] },
    GLEICH.becquerel,
    GLEICH.nachweis,
    { teil: T_NACHWEIS, modul: "ra-nachweis", type: "choice", prompt: "Ein Geiger-Müller-Zähler klickt auch dann etwa 20-mal pro Minute, wenn kein radioaktiver Gegenstand in der Nähe ist. Wie nennt man diesen Messwert?",
      options: ["Nullrate", "Halbwertszeit", "Strahlendosis", "Grenzwert"], answer: 0, points: 1 },

    /* --- Die Strahlungsarten --- */
    GLEICH.abschirmung("Ein Strahler sendet drei Strahlen aus. Sie treffen auf Papier, Aluminium und Blei. Welche Strahlungsart ist Strahl A, B und C? Ordne zu."),
    { teil: T_ARTEN, modul: "ra-strahlungsarten", type: "match", prompt: "Woraus bestehen die drei Strahlungsarten? Ordne zu.",
      options: ["Heliumkerne (2 Protonen und 2 Neutronen)", "schnelle Elektronen", "elektromagnetische Welle (wie Licht, aber energiereicher)"],
      rows: [{ text: "Alpha-Strahlung", answer: 0 }, { text: "Beta-Strahlung", answer: 1 }, { text: "Gamma-Strahlung", answer: 2 }] },
    { teil: T_ARTEN, modul: "ra-strahlungsarten", ...BILD.ablenkung, type: "choice", prompt: "Radioaktive Strahlung läuft zwischen einer positiv und einer negativ geladenen Platte hindurch. Strahl 2 läuft geradeaus weiter. Welche Strahlungsart ist das?",
      options: ["Gamma-Strahlung, denn sie hat keine Ladung", "Alpha-Strahlung, denn sie ist positiv geladen", "Beta-Strahlung, denn sie ist negativ geladen", "Gamma-Strahlung, denn sie ist besonders schwer"], answer: 0, points: 1 },

    /* --- Die Halbwertszeit --- */
    GLEICH.hwzBegriff,
    GLEICH.kurveAblesen,
    { teil: T_HWZ, modul: "ra-halbwertszeit", type: "choice", prompt: "Nach einer Halbwertszeit ist noch die Hälfte der Atome eines radioaktiven Stoffes übrig. Wie viel ist nach zwei Halbwertszeiten noch übrig?",
      options: ["ein Viertel", "ein Drittel", "ein Achtel", "nichts mehr"], answer: 0, points: 1 },
    { teil: T_HWZ, modul: "ra-halbwertszeit", type: "choice", prompt: "Im Münzexperiment steht jede Münze für ein radioaktives Atom. Nach jedem Wurf werden alle Münzen aussortiert, die „Zahl“ zeigen. Was bedeutet „Zahl“ in diesem Modell?",
      options: ["Das Atom ist zerfallen.", "Das Atom ist noch nicht zerfallen.", "Das Atom hat sich verdoppelt.", "Das Atom ist schwerer geworden."], answer: 0, points: 1 },

    /* --- Die C-14-Methode --- */
    GLEICH.c14Weg("Die Abbildung zeigt den Weg von C-14. Was passiert an den Stellen 1, 2, 3 und 4? Ordne zu."),
    { teil: T_C14, modul: "ra-c14", type: "choice", prompt: "Forscher vergleichen zwei Knochen. Knochen 1 enthält noch viel C-14, Knochen 2 nur noch sehr wenig. Was folgt daraus?",
      options: ["Knochen 2 ist älter als Knochen 1.", "Knochen 1 ist älter als Knochen 2.", "Beide Knochen sind gleich alt.", "Knochen 2 stammt von einem größeren Tier."], answer: 0, points: 1 },
    { teil: T_C14, modul: "ra-c14", type: "choice", prompt: "Ein Knochen enthält noch ein Viertel (25 %) des C-14 von frischem Material. Das sind zwei Halbwertszeiten. Eine Halbwertszeit von C-14 dauert 5.730 Jahre. Wie alt ist der Knochen ungefähr?",
      options: ["11.460 Jahre", "5.730 Jahre", "17.190 Jahre", "22.920 Jahre"], answer: 0, points: 1 },

    /* --- Biologische Folgen von Strahlung --- */
    GLEICH.schaeden,
    GLEICH.sievert,
    { teil: T_FOLGEN, modul: "ra-folgen", type: "choice", prompt: "Strahlung kann die DNS (Erbinformation) in einer Zelle verändern. Wie nennt man eine solche Veränderung?",
      options: ["Mutation", "Absorption", "Halbwertszeit", "Nullrate"], answer: 0, points: 1 },
    { teil: T_FOLGEN, modul: "ra-folgen", type: "text", prompt: "Nicht jede kleine Strahlenmenge macht krank. Erkläre, warum.",
      expected: "Der Körper hat eigene Reparatursysteme. Kleine Schäden an den Zellen kann er oft selbst reparieren. Erst wenn die Strahlung zu stark ist oder zu lange dauert, schafft er das nicht mehr, und man wird krank.",
      kriterien: "1 Punkt: Der Körper kann kleine Schäden selbst reparieren (Reparatursystem). 1 Punkt: Erst bei zu starker oder zu langer Strahlung schafft er das nicht mehr (er wird überlastet). Statt des zweiten Punkts zählt auch: Die natürliche Strahlung im Alltag ist sehr schwach.",
      keywords: ["reparier", "reparatur", "selbst", "zu stark", "zu viel", "zu lange", "überlastet", "schwach", "gering"], points: 2, lines: 3 },

    /* --- Anwendung radioaktiver Strahlung --- */
    { teil: T_ANWENDUNG, modul: "ra-anwendung", type: "match", prompt: "Mit einem Szintigramm untersucht ein Arzt die Schilddrüse. Bringe die Schritte in die richtige Reihenfolge.",
      options: ["Radioaktives Iod wird in die Blutbahn gespritzt.", "Das Iod sammelt sich in der Schilddrüse.", "Ein Messgerät zeichnet die Strahlung auf.", "Der Computer setzt daraus ein Bild zusammen."],
      rows: [{ text: "1. Schritt", answer: 0 }, { text: "2. Schritt", answer: 1 }, { text: "3. Schritt", answer: 2 }, { text: "4. Schritt", answer: 3 }] },
    { teil: T_ANWENDUNG, modul: "ra-anwendung", type: "text", prompt: "Eine Gasleitung unter der Erde ist undicht. Um das Leck zu finden, mischt man radioaktives Xenon ins Gas. Erkläre, warum das viel Arbeit spart.",
      expected: "Ohne das Xenon müsste man die Leitung über eine lange Strecke aufgraben, um das Leck zu finden. Mit Xenon geht man mit dem Geiger-Müller-Zähler über die Leitung. Dort, wo das Gas mit dem Xenon austritt, klickt der Zähler stärker. Man muss nur noch an dieser Stelle graben.",
      kriterien: "1 Punkt: Ohne die Methode müsste man die Leitung über lange Strecken aufgraben (großer Aufwand). 1 Punkt: Mit dem Geiger-Müller-Zähler (Messgerät) findet man von oben die Stelle, an der das Xenon austritt – nur dort wird gegraben.",
      keywords: ["aufgraben", "graben", "strecke", "aufwand", "geiger", "zähler", "messgerät", "austritt", "stelle", "klick"], points: 2, lines: 4 },

    /* --- Transfer --- */
    { teil: T_TRANSFER, modul: "ra-nachweis", transfer: true, type: "text", prompt: "Lena misst mit einem Geiger-Müller-Zähler. Ohne Gegenstand zählt er 20 Impulse pro Minute. An einem alten Wecker mit Leuchtziffern zählt er 95 Impulse pro Minute. Wie viele Impulse pro Minute kommen vom Wecker selbst? Schreibe auf, wie du rechnest, und erkläre, woher die 20 Impulse kommen.",
      expected: "Die 20 Impulse sind die Nullrate. Sie kommen von der natürlichen Strahlung, die überall vorhanden ist. Man muss sie abziehen: 95 − 20 = 75. Vom Wecker kommen 75 Impulse pro Minute.",
      kriterien: "1 Punkt: 95 − 20 = 75 Impulse pro Minute. 1 Punkt: Die 20 Impulse sind die Nullrate bzw. die natürliche Strahlung, die überall vorhanden ist (auch ohne Wecker).",
      keywords: ["75", "nullrate", "abziehen", "natürlich", "überall", "hintergrund", "boden", "weltraum"], points: 2, lines: 4 },
    { teil: T_TRANSFER, modul: "ra-c14", transfer: true, type: "text", prompt: "In einer Höhle finden Forscher Holzkohle von einem uralten Lagerfeuer und daneben ein Beil aus Stein. a) Welchen der beiden Funde können sie mit der C-14-Methode untersuchen? Begründe. b) Der Fund enthält noch die Hälfte des C-14 von frischem Holz. Die Halbwertszeit von C-14 beträgt 5.730 Jahre. Wie alt ist er etwa?",
      expected: "a) Die Holzkohle. Sie stammt von einem Baum, also von einem Lebewesen. Der Baum hat C-14 aufgenommen, solange er lebte. Seit er tot ist, zerfällt das C-14. Der Stein hat nie gelebt und kein C-14 aufgenommen. b) Die Hälfte ist nach einer Halbwertszeit übrig. Der Fund ist also etwa 5.730 Jahre alt.",
      kriterien: "1 Punkt: Holzkohle gewählt. 1 Punkt: Begründung: Holz stammt von einem Lebewesen, das C-14 aufgenommen hat; der Stein hat nie gelebt. 1 Punkt: etwa 5.730 Jahre (eine Halbwertszeit; rund 5.700 oder knapp 6.000 Jahre genügt).",
      keywords: ["holzkohle", "holz", "baum", "lebewesen", "gelebt", "aufgenommen", "stein", "5.730", "5730", "eine halbwertszeit"], points: 3, lines: 5 },
    { teil: T_TRANSFER, modul: "ra-strahlungsarten", transfer: true, type: "choice", prompt: "Ein Stoff sendet nur Alpha-Strahlung aus. Er liegt in einer geschlossenen Schachtel aus Pappe. Kommt die Strahlung aus der Schachtel heraus?",
      options: ["Nein, Alpha-Strahlung wird schon von Papier und Pappe aufgehalten.", "Ja, Alpha-Strahlung kann nur von dickem Blei aufgehalten werden.", "Ja, Alpha-Strahlung geht durch Pappe, aber nicht durch Aluminium.", "Nein, Alpha-Strahlung kann sich in der Luft gar nicht ausbreiten."], answer: 0, points: 1 },
    { teil: T_TRANSFER, modul: "ra-halbwertszeit", transfer: true, type: "choice", prompt: "Für eine Untersuchung im Krankenhaus bekommt ein Patient einen radioaktiven Stoff mit einer Halbwertszeit von 6 Stunden gespritzt. Wie viel von diesem Stoff ist nach 18 Stunden noch nicht zerfallen?",
      options: ["ein Achtel", "ein Viertel", "ein Drittel", "nichts mehr"], answer: 0, points: 1 }
  ]
};

module.exports = { probeM, probeR };
