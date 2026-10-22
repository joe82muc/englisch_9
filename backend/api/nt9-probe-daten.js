"use strict";

/**
 * Probe „Organische Rohstoffe“ für NT 9 (Module 1 bis 7), je eine Fassung für 9M und 9R.
 *
 * Diese Datei bleibt auf dem Server: Sie enthält die Lösungen.
 * Die Routen kommen aus infoaustausch.js und laufen unter /api/nt9probe.
 *
 *   type: "choice" -> Anklicken, answer = Index der richtigen Option (1 Punkt)
 *   type: "match"  -> Zuordnen, jede Zeile wählt eine Option (1 Punkt je Zeile)
 *   type: "text"   -> Freier Text, die KI prüft den Inhalt wohlwollend
 *                     expected: Musterlösung (nur Beispiel), kriterien: Punkteverteilung, keywords: Notfall ohne KI
 *   image          -> Abbildung (SVG mit Animation) relativ zur Probe-Seite im App12-Ordner
 *
 * Umfang: etwa 60 Minuten. Jedes der sieben Module hat einen eigenen Teil mit 4 bis 6 Aufgaben, dazu zwei Transferaufgaben.
 *   9M: 37 Aufgaben, 72 Punkte, davon 13 zum Erklären.
 *   9R: 37 Aufgaben, 69 Punkte, davon 5 zum Erklären, mehr Ankreuzen und Zuordnen, einfacher formuliert.
 * Die Antworten der Ankreuz- und Zuordnungsaufgaben stehen hier immer zuerst bzw. in Reihenfolge der Zeilen und werden
 * unten fest gemischt (gleiche Reihenfolge nach jedem Neustart, damit gespeicherte Antworten gültig bleiben).
 * Notenschlüssel nach dem Zug des Kindes (Code): M 50 % = Note 4, R 50 % = Note 3 (infoaustausch.js).
 * Rechtschreibung zählt nie (Notenschutz LRS ohnehin berücksichtigt).
 */

// R-Klassen: 50 % = Note 3 (M-Klassen bekommen in infoaustausch.js automatisch GRADE_SCALE_M)
const GRADE_SCALE = [
  { grade: 1, min: 87 },
  { grade: 2, min: 73 },
  { grade: 3, min: 50 },
  { grade: 4, min: 37 },
  { grade: 5, min: 20 },
  { grade: 6, min: 0 }
];

const KI_REGELN = [
  "Du korrigierst eine Probe im Fach Natur und Technik einer 9. Klasse an einer bayerischen Mittelschule.",
  "Die Probe gehört zu einem dieser Themenblöcke: Radioaktivität (Nachweis, Strahlungsarten, Halbwertszeit,",
  "C-14-Methode, Folgen und Anwendung von Strahlung), Kernenergie (Kernspaltung, Kettenreaktion, Kernkraftwerk,",
  "Risiken und Folgen) oder",
  "Organische Rohstoffe (Kohlenstoffverbindungen, regenerative und fossile Rohstoffe, Holz, Zellstoff,",
  "Raps, Biodiesel, Stärke, Nachhaltigkeit, Entstehung von Erdöl, Erdgas und Kohle, fraktionierte Destillation,",
  "Fraktionen und Siedetemperaturen, Produkte aus Erdöl, Kohlenstoffkreislauf, Treibhauseffekt, Klimawandel,",
  "Verwendung von Erdöl, Umweltkosten, Abhängigkeit vom Import, Ersatz durch erneuerbare Energien und",
  "nachwachsende Rohstoffe, Kreislaufwirtschaft, Argumentieren in einer Diskussion).",
  "",
  "Bewerte WOHLWOLLEND und AUSSCHLIESSLICH den fachlichen Inhalt.",
  "Rechtschreibung, Grammatik, Zeichensetzung und Ausdruck sind völlig egal (auch bei Lese-Rechtschreib-Störung).",
  "Umgangssprache, Stichworte und eigene Worte sind ausdrücklich erlaubt.",
  "Fachbegriffe müssen NICHT genannt werden, wenn die Sache richtig beschrieben ist.",
  "Die Musterlösung ist nur ein Beispiel: Jede andere fachlich richtige Antwort zählt genauso.",
  "Halte dich an die Punkteverteilung der Lehrkraft. Eine unvollständige, aber richtige Antwort bekommt Teilpunkte.",
  "Eine ungenaue Nebenbemerkung zieht keine Punkte ab, solange das Richtige erkennbar ist.",
  "Im Zweifel entscheide zugunsten der Schülerin oder des Schülers. Die Schüler sind 14 bis 16 Jahre alt.",
  "0 Punkte nur, wenn die Antwort leer, falsch oder themenfremd ist.",
  "Die Rückmeldung ist freundlich und direkt an die Schülerin oder den Schüler gerichtet (per du)."
].join("\n");

const M1 = "Modul 1 · Kohlenstoff, Holz und Raps";
const M2 = "Modul 2 · Biodiesel, Stärke und Nachhaltigkeit";
const M3 = "Modul 3 · Entstehung fossiler Rohstoffe";
const M4 = "Modul 4 · Erdölaufbereitung und Fraktionen";
const M5 = "Modul 5 · Kohlenstoffkreislauf und Treibhauseffekt";
const M6 = "Modul 6 · Erdöl – Rohstoff mit Zukunft?";
const M7 = "Modul 7 · Ohne Erdöl – geht das?";
const TR = "Transfer · Nimm Stellung";

const BILD = {
  turm: { image: "assets/probe/destillationsturm.svg", imageAlt: "Animierter Destillationsturm: Unten wird Erdöl erhitzt, Dampf steigt nach oben. Am Turm sind vier Entnahmestellen mit A (ganz oben), B, C und D (ganz unten) beschriftet. Links ein Thermometer: unten heiß, oben kühler." },
  lager: { image: "assets/probe/lagerstaette.svg", imageAlt: "Schnitt durch die Erde: Eine gewölbte, undurchlässige Gesteinsschicht. Darunter sammeln sich Stoffe. Feld A liegt ganz oben unter der Wölbung, Feld B darunter, Feld C ist die gewölbte Deckschicht selbst." },
  kohle: { image: "assets/probe/inkohlung.svg", imageAlt: "Schnitt durch den Boden unter einem Sumpfwald. Pfeile von oben zeigen den Druck neuer Schichten. Darunter drei Schichten: A oben (braun und faserig), B in der Mitte (dunkelbraun), C ganz unten (schwarz und glänzend). Ein Pfeil am Rand zeigt: je tiefer, desto älter und desto mehr Druck." },
  kreislauf: { image: "assets/probe/kohlenstoffkreislauf.svg", imageAlt: "Schaubild: Oben eine Wolke mit der Aufschrift CO₂ in der Luft. Pfeil 1 führt von der Wolke in einen Baum. Pfeil 2 führt von einem Menschen nach oben zur Wolke. Pfeil 3 führt von abgestorbenen Blättern am Boden nach oben zur Wolke. Pfeil 4 führt vom Schornstein einer Fabrik nach oben zur Wolke." },
  treibhaus: { image: "assets/probe/treibhaus.svg", imageAlt: "Animiertes Schaubild zum Treibhauseffekt: Pfeil 1 führt als gelbe Welle von der Sonne zur Erdoberfläche. Pfeil 2 führt rot von der Erde bis ins Weltall. Pfeil 3 führt rot von der Erde nach oben und wird an kleinen Gasmolekülen in der Atmosphäre zur Erde zurückgelenkt." },
  verwendung: { image: "assets/probe/verwendung.svg", imageAlt: "Animiertes Balkendiagramm: Verwendung von Erdöl in Deutschland in Prozent. Bereich A: 35 Prozent, Bereich B: 29 Prozent, Bereich C: 22 Prozent, chemische Industrie: 7 Prozent, Sonstiges: 7 Prozent." },
  kreis: { image: "assets/probe/kreislaufwirtschaft.svg", imageAlt: "Kreislauf mit vier Stationen im Uhrzeigersinn: oben neues Produkt, rechts benutzen, unten Station A, links Station B, danach wieder neues Produkt." }
};

/* ---------- Aufgaben, die in beiden Fassungen gleich sind ---------- */
const GLEICH = {
  kohlenstoff: (p) => ({ teil: M1, type: "choice", prompt: p,
    options: ["Kohlenstoff", "Sauerstoff", "Wasser", "Eisen"], answer: 0, points: 1 }),
  holzAufbau: { teil: M1, type: "choice", prompt: "Woraus besteht Holz ungefähr je zur Hälfte?",
    options: ["aus Zellstoff (Cellulose) und Lignin", "aus Wasser und Salz", "aus Erdöl und Stärke", "aus Eisen und Kohlenstoffdioxid"], answer: 0, points: 1 },
  biodiesel: { teil: M2, type: "choice", prompt: "Woraus wird Biodiesel hergestellt?",
    options: ["aus dem Öl von Raps", "aus Erdgas", "aus Kartoffelstärke", "aus Holzspänen"], answer: 0, points: 1 },
  staerkefolie: { teil: M2, type: "choice", prompt: "Welche Eigenschaft hat eine Folie aus Stärke?",
    options: ["Sie ist biologisch abbaubar, aber nicht wasserfest.", "Sie ist wasserfest und hält ewig.", "Sie wird aus Erdöl hergestellt.", "Sie lässt sich nicht verbrennen."], answer: 0, points: 1 },
  nachhaltig: { teil: M2, type: "choice", prompt: "Was bedeutet „nachhaltig“?",
    options: ["Von einem Rohstoff wird nicht mehr verbraucht, als nachwächst.", "Ein Rohstoff hält besonders lange.", "Ein Rohstoff ist besonders billig.", "Ein Rohstoff kommt aus dem Ausland."], answer: 0, points: 1 },
  lager: (p, schicht) => ({ teil: M3, ...BILD.lager, type: "match", prompt: p,
    options: ["Erdgas", "Erdöl", schicht], rows: [{ text: "A", answer: 0 }, { text: "B", answer: 1 }, { text: "C", answer: 2 }] }),
  plankton: { teil: M3, type: "choice", prompt: "Woraus sind Erdöl und Erdgas entstanden?",
    options: ["aus winzigen Meereslebewesen (Plankton)", "aus Pflanzen der Sumpfwälder", "aus Vulkanasche", "aus Dinosaurierknochen"], answer: 0, points: 1 },
  inkohlung: (p) => ({ teil: M3, ...BILD.kohle, type: "match", prompt: p,
    options: ["Torf", "Braunkohle", "Steinkohle"], rows: [{ text: "A (oben)", answer: 0 }, { text: "B (Mitte)", answer: 1 }, { text: "C (ganz unten)", answer: 2 }] }),
  fossilien: { teil: M3, type: "choice", prompt: "Was sind Fossilien?",
    options: ["versteinerte Überreste oder Abdrücke von Lebewesen aus der Urzeit", "Gesteine aus Vulkanen", "Kristalle aus Salzwasser", "Reste von Kohle nach dem Verbrennen"], answer: 0, points: 1 },
  turm: (p, diesel) => ({ teil: M4, ...BILD.turm, type: "match", prompt: p,
    options: ["Gase", "Benzin", diesel, "Rückstand (daraus Bitumen)"],
    rows: [{ text: "A (ganz oben)", answer: 0 }, { text: "B", answer: 1 }, { text: "C", answer: 2 }, { text: "D (ganz unten)", answer: 3 }] }),
  siede: { teil: M4, type: "choice", prompt: "Warum lassen sich die Bestandteile des Erdöls durch Destillation trennen?",
    options: ["Sie haben unterschiedliche Siedetemperaturen.", "Sie haben unterschiedliche Farben.", "Sie sind unterschiedlich stark magnetisch.", "Sie lösen sich unterschiedlich in Wasser."], answer: 0, points: 1 },
  kreislauf: (p) => ({ teil: M5, ...BILD.kreislauf, type: "match", prompt: p,
    options: ["Fotosynthese", "Atmung", "Zersetzung durch Bakterien und Pilze", "Verbrennung von Kohle, Erdöl und Erdgas"],
    rows: [{ text: "Pfeil 1", answer: 0 }, { text: "Pfeil 2", answer: 1 }, { text: "Pfeil 3", answer: 2 }, { text: "Pfeil 4", answer: 3 }] }),
  pfeil3: (rueck) => ({ teil: M5, ...BILD.treibhaus, type: "choice", prompt: "Was zeigt Pfeil 3 in der Abbildung?",
    options: [rueck, "Sonnenlicht wird von den Wolken verschluckt.", "Die ganze Wärme entweicht ins Weltall.", "Der Mond spiegelt das Sonnenlicht."], answer: 0, points: 1 }),
  versuch: { teil: M5, type: "choice", prompt: "Im Versuch werden zwei gleiche Flaschen gleich lange mit einer Lampe bestrahlt. Eine enthält Luft, die andere Luft mit zusätzlichem CO₂. Was beobachtet man?",
    options: ["Die Flasche mit zusätzlichem CO₂ wird wärmer.", "Beide werden genau gleich warm.", "Die Flasche mit Luft wird wärmer.", "Die Flasche mit CO₂ kühlt ab."], answer: 0, points: 1 },
  verwendung: { teil: M6, ...BILD.verwendung, type: "match", prompt: "Das Diagramm zeigt, wofür Erdöl in Deutschland verwendet wird. Welcher Bereich gehört zu A, B und C?",
    options: ["Heizung", "Verkehr", "Energiegewinnung"],
    rows: [{ text: "A (35 %)", answer: 0 }, { text: "B (29 %)", answer: 1 }, { text: "C (22 %)", answer: 2 }] },
  importe: (bayern) => ({ teil: M6, type: "choice", prompt: "Woher kommt fast das ganze Erdöl, das in Deutschland verbraucht wird?",
    options: ["aus anderen Ländern (Import)", bayern, "aus Recycling", "aus Rapsfeldern"], answer: 0, points: 1 }),
  blick: { teil: M6, type: "match", prompt: "Welcher Blickwinkel passt? Ordne zu.", options: ["Nachhaltigkeit", "Ökologie (Umwelt)", "Ökonomie (Wirtschaft)"],
    rows: [{ text: "Erdöl wächst nicht nach.", answer: 0 }, { text: "Beim Verbrennen entsteht CO₂.", answer: 1 }, { text: "Die Umweltkosten fehlen im Preis.", answer: 2 }] },
  kreis: { teil: M7, ...BILD.kreis, type: "match", prompt: "Die Abbildung zeigt die Kreislaufwirtschaft. Was passiert bei A und bei B?",
    options: ["sammeln", "recyceln (zu neuem Rohstoff verarbeiten)", "verbrennen"],
    rows: [{ text: "A", answer: 0 }, { text: "B", answer: 1 }] },
  ersatz: { teil: M7, type: "match", prompt: "Womit kann man das Erdölprodukt ersetzen? Ordne zu.",
    options: ["Wärmepumpe", "Elektroauto mit Strom aus Wind und Sonne", "Tüte aus Maisstärke oder Stoffbeutel", "Pulli aus Wolle oder Baumwolle"],
    rows: [{ text: "Ölheizung", answer: 0 }, { text: "Auto mit Benzinmotor", answer: 1 }, { text: "Plastiktüte", answer: 2 }, { text: "Pulli aus Polyester", answer: 3 }] },
  argument: { teil: M7, type: "choice", prompt: "Was gehört in einer Diskussion zu einem guten Argument?",
    options: ["eine Behauptung mit Begründung und einem Beleg, z. B. einer Zahl oder einem Beispiel", "möglichst laut sprechen", "die andere Person auslachen", "immer dasselbe wiederholen"], answer: 0, points: 1 }
};

/* ============================== 9M ============================== */
const probeM = {
  id: "nt9m-probe1",
  title: "Probe Organische Rohstoffe (9M)",
  unit: "NT 9M · Module 1 bis 7",
  classLevel: "9M",
  items: [
    GLEICH.kohlenstoff("Man erhitzt ein Stück Holz, Zucker oder Brot sehr stark. Was bleibt als schwarzer Rest übrig?"),
    { teil: M1, type: "match", prompt: "Regenerativ oder fossil? Ordne die Rohstoffe zu.", options: ["regenerativ (nachwachsend)", "fossil"],
      rows: [{ text: "Holz", answer: 0 }, { text: "Erdgas", answer: 1 }, { text: "Rapsöl", answer: 0 }, { text: "Steinkohle", answer: 1 }] },
    GLEICH.holzAufbau,
    { teil: M1, type: "text", prompt: "Beschreibe, wie man aus Holz Zellstoff gewinnt, und nenne zwei Produkte, die aus Zellstoff hergestellt werden.",
      expected: "Das Holz wird zerkleinert und in einer Lauge gekocht. Dabei löst sich das Lignin (Holzstoff) heraus, der Zellstoff bleibt übrig. Aus Zellstoff stellt man zum Beispiel Papier, Pappe, Textilien, Isoliermaterial oder Klebstoffe her.",
      kriterien: "1 Punkt: Holz zerkleinern und in Lauge kochen ODER das Lignin wird herausgelöst und der Zellstoff bleibt übrig. 1 Punkt: zwei passende Produkte (Papier, Pappe, Textilien/Kleidung, Isoliermaterial, Klebstoff, Taschentücher …).",
      keywords: ["zerkleiner", "lauge", "koch", "lignin", "papier", "pappe", "textil", "kleb", "isolier"], points: 2, lines: 4 },

    GLEICH.biodiesel,
    GLEICH.staerkefolie,
    { teil: M2, type: "text", prompt: "Riesige Rapsfelder nur für Biodiesel: Nenne zwei Probleme.",
      expected: "Monokulturen schaden der Artenvielfalt und dem Boden, es wird viel Dünger und Pflanzenschutzmittel gebraucht, und auf den Feldern fehlt Platz für den Anbau von Lebensmitteln.",
      kriterien: "Je 1 Punkt für ein richtiges Problem, z. B. Monokultur/weniger Artenvielfalt, viel Dünger oder Pflanzenschutzmittel, weniger Fläche für Lebensmittel, Boden wird ausgelaugt.",
      keywords: ["monokultur", "dünger", "lebensmittel", "nahrung", "fläche", "artenvielfalt", "boden", "insekten"], points: 2, lines: 3 },
    GLEICH.nachhaltig,
    { teil: M2, type: "text", prompt: "Auch nachwachsende Rohstoffe werden nicht automatisch nachhaltig genutzt. Erkläre, warum, und nenne eine Möglichkeit, sie nachhaltiger zu nutzen.",
      expected: "Nachhaltig ist die Nutzung nur, wenn nicht mehr verbraucht wird, als nachwächst. Ist die Nachfrage größer als das Angebot, werden zum Beispiel Wälder übernutzt oder riesige Monokulturen angelegt. Nachhaltiger wird es durch Mehrfachnutzung (Kaskade: Holz erst als Möbel, dann als Spanplatte, zum Schluss als Brennstoff), durch Kreislaufwirtschaft und Recycling oder durch vielfältigen Anbau statt Monokultur.",
      kriterien: "1 Punkt: Erklärung (es wird mehr verbraucht, als nachwächst / Nachfrage größer als Angebot / Übernutzung, Monokultur). 1 Punkt: eine sinnvolle Möglichkeit (Mehrfachnutzung/Kaskade, Kreislauf/Recycling, Vielfalt statt Monokultur, weniger verbrauchen).",
      keywords: ["nachwächst", "nachfrage", "mehr verbraucht", "kaskade", "mehrfach", "kreislauf", "recycl", "vielfalt", "monokultur"], points: 2, lines: 4 },

    GLEICH.lager("Die Abbildung zeigt eine Lagerstätte im Schnitt. Was befindet sich bei A, B und C?", "undurchlässige Gesteinsschicht"),
    GLEICH.plankton,
    GLEICH.inkohlung("Die Abbildung zeigt im Schnitt, wie aus Pflanzen der Sumpfwälder Kohle entsteht. Welcher Stoff liegt bei A, B und C?"),
    GLEICH.fossilien,
    { teil: M3, type: "text", prompt: "Vergleiche die Entstehung von Erdöl und Kohle. Nenne eine Gemeinsamkeit und einen Unterschied.",
      expected: "Gemeinsam: Beide entstanden aus Resten von Lebewesen unter Luftabschluss, hohem Druck und hoher Temperatur über Millionen Jahre. Unterschied: Erdöl und Erdgas entstanden aus winzigen Meereslebewesen (Plankton) über Faulschlamm, Kohle aus Landpflanzen der Sumpfwälder über Torf. Erdöl wandert durch das Gestein, Kohle bleibt als feste Schicht liegen.",
      kriterien: "1 Punkt: eine richtige Gemeinsamkeit (Reste von Lebewesen, Luftabschluss, Druck, Wärme, Millionen Jahre). 1 Punkt: ein richtiger Unterschied (Plankton/Meer gegen Landpflanzen/Sumpf, Faulschlamm gegen Torf, wandert gegen bleibt als feste Schicht).",
      keywords: ["luftabschluss", "druck", "millionen", "plankton", "meer", "pflanzen", "sumpf", "torf", "faulschlamm"], points: 2, lines: 4 },

    GLEICH.turm("Im Destillationsturm wird Erdöl getrennt. Welche Fraktion wird bei A, B, C und D entnommen?", "Diesel und leichtes Heizöl"),
    GLEICH.siede,
    { teil: M4, type: "choice", prompt: "Warum erhält man bei der Destillation von Erdöl keine reinen Stoffe, sondern Fraktionen?",
      options: ["Viele Bestandteile haben ähnliche Siedetemperaturen und verdampfen zusammen.", "Erdöl ist zu dunkel.", "Im Turm ist es überall gleich heiß.", "Die Stoffe reagieren mit dem Wasserdampf."], answer: 0, points: 1 },
    { teil: M4, type: "text", prompt: "Erkläre den Zusammenhang zwischen der Größe der Moleküle, der Siedetemperatur und der Zähflüssigkeit einer Fraktion.",
      expected: "Je größer die Moleküle, desto höher ist die Siedetemperatur und desto zähflüssiger ist der Stoff. Fraktionen mit kleinen Molekülen sieden schon bei niedriger Temperatur, sind dünnflüssig und leicht entzündlich.",
      kriterien: "1 Punkt: größere Moleküle → höhere Siedetemperatur. 1 Punkt: größere Moleküle → zähflüssiger (oder umgekehrt für kleine Moleküle).",
      keywords: ["groß", "klein", "siede", "zähflüssig", "dickflüssig", "dünnflüssig", "höher"], points: 2, lines: 3 },
    { teil: M4, type: "text", prompt: "Der Rückstand aus dem Destillationsturm wird bei vermindertem Druck noch einmal destilliert. Erkläre, warum, und nenne ein Produkt, das dabei entsteht.",
      expected: "Bei über 350 °C würde sich der Rückstand zersetzen. Bei vermindertem Druck sinken die Siedetemperaturen, so kann man ihn schon bei etwa 250 °C destillieren. Dabei entstehen schweres Heizöl und Schmieröle, übrig bleibt Bitumen für Asphalt.",
      kriterien: "1 Punkt: Der Rückstand würde sich bei hoher Temperatur zersetzen ODER bei vermindertem Druck sinkt die Siedetemperatur. 1 Punkt: ein Produkt (schweres Heizöl, Schmieröl, Bitumen/Asphalt).",
      keywords: ["zersetz", "druck", "siedetemperatur", "niedriger", "350", "250", "heizöl", "schmieröl", "bitumen", "asphalt"], points: 2, lines: 4 },

    GLEICH.kreislauf("Die Abbildung zeigt den Kohlenstoffkreislauf. Welcher Vorgang gehört zu Pfeil 1, 2, 3 und 4?"),
    GLEICH.pfeil3("Treibhausgase halten Wärmestrahlung zurück und strahlen sie zur Erde zurück."),
    { teil: M5, type: "choice", prompt: "Wie warm wäre es auf der Erde im Durchschnitt ohne den natürlichen Treibhauseffekt?",
      options: ["etwa −18 °C", "etwa +15 °C", "etwa 0 °C", "etwa +30 °C"], answer: 0, points: 1 },
    GLEICH.versuch,
    { teil: M5, type: "text", prompt: "Erkläre den Unterschied zwischen dem natürlichen und dem verstärkten Treibhauseffekt.",
      expected: "Beim natürlichen Treibhauseffekt halten Treibhausgase wie Wasserdampf und CO₂ einen Teil der Wärme zurück, die Erde ist dadurch etwa +15 °C statt −18 °C warm. Beim verstärkten Treibhauseffekt bringt der Mensch zusätzliche Treibhausgase in die Luft, vor allem durch das Verbrennen von Kohle, Erdöl und Erdgas. Dadurch wird mehr Wärme zurückgehalten und die Erde erwärmt sich weiter.",
      kriterien: "1 Punkt: natürlicher Treibhauseffekt = Treibhausgase halten Wärme zurück, macht Leben möglich. 1 Punkt: verstärkter = zusätzliche Treibhausgase durch den Menschen (z. B. Verbrennung fossiler Rohstoffe) → stärkere Erwärmung.",
      keywords: ["natürlich", "zusätzlich", "mensch", "verbrenn", "wärme", "15", "erwärm"], points: 2, lines: 4 },
    { teil: M5, type: "text", prompt: "Nenne zwei Dinge, mit denen du selbst im Alltag CO₂ sparen kannst.",
      expected: "Zum Beispiel mit dem Fahrrad, zu Fuß oder mit Bus und Bahn fahren statt mit dem Auto, weniger Fleisch essen, regionale Lebensmittel kaufen, Licht und Geräte ausschalten, weniger heizen, Dinge länger nutzen statt neu kaufen.",
      kriterien: "Je 1 Punkt für eine sinnvolle Möglichkeit.",
      keywords: ["fahrrad", "zu fuß", "bus", "bahn", "fleisch", "regional", "licht", "strom", "heiz", "ausschalten", "weniger"], points: 2, lines: 3 },

    GLEICH.verwendung,
    { teil: M6, type: "choice", prompt: "Was ist mit „stofflicher Nutzung“ von Erdöl gemeint?",
      options: ["Erdöl wird zu Produkten wie Kunststoff verarbeitet.", "Erdöl wird verbrannt, um zu heizen.", "Erdöl bleibt im Boden.", "Aus Erdöl wird im Kraftwerk Strom."], answer: 0, points: 1 },
    GLEICH.importe("aus deutschen Ölfeldern"),
    GLEICH.blick,
    { teil: M6, type: "text", prompt: "Erkläre, warum Erdölprodukte heute noch so preiswert sind.",
      expected: "Im Preis sind die Umweltkosten nicht enthalten, zum Beispiel Schäden durch den Klimawandel, Krankheiten durch Abgase oder Kosten für Ölunfälle und Plastikmüll. Diese Kosten bezahlen alle später. Würde man sie einrechnen, wäre Erdöl deutlich teurer.",
      kriterien: "1 Punkt: Umweltkosten/Umweltschäden sind nicht im Preis enthalten. 1 Punkt: ein Beispiel für solche Kosten oder: sie werden später von allen bezahlt / Erdöl wäre sonst teurer.",
      keywords: ["umweltkosten", "nicht im preis", "schäden", "klima", "später", "teurer"], points: 2, lines: 3 },

    GLEICH.kreis,
    GLEICH.ersatz,
    { teil: M7, type: "text", prompt: "Erdöl wird als Energieträger und als Rohstoff genutzt. Nenne für beides je einen Ersatz.",
      expected: "Als Energieträger: Strom aus Wind, Sonne oder Wasser, zum Beispiel für eine Wärmepumpe oder ein Elektroauto, oder Biodiesel aus Raps. Als Rohstoff: Bioplastik aus Mais- oder Kartoffelstärke oder Zucker, Fasern aus Baumwolle, Wolle oder Hanf, Dämmstoff aus Holzfasern.",
      kriterien: "1 Punkt: ein Ersatz für Erdöl als Energieträger (erneuerbare Energien, Wärmepumpe, E-Auto, Bahn, Biodiesel). 1 Punkt: ein Ersatz für Erdöl als Rohstoff (Bioplastik/Stärke/Zucker, Naturfasern, Holzfasern, recycelter Kunststoff).",
      keywords: ["wind", "sonne", "wärmepumpe", "elektro", "biodiesel", "bioplastik", "stärke", "mais", "baumwolle", "wolle", "holz"], points: 2, lines: 4 },
    { teil: M7, type: "text", prompt: "Ersatzstoffe aus Pflanzen haben auch Nachteile. Nenne zwei.",
      expected: "Sie sind oft noch teurer als Erdölprodukte, ihre Herstellung muss weiter erforscht werden, die Pflanzen brauchen Ackerfläche, auf der sonst Nahrung wachsen könnte, und nicht jedes Bioplastik ist kompostierbar.",
      kriterien: "Je 1 Punkt für einen richtigen Nachteil (teurer, Forschung nötig, Ackerfläche/Konkurrenz zu Lebensmitteln, Monokultur/Dünger, nicht jedes Bioplastik kompostierbar).",
      keywords: ["teuer", "kosten", "forsch", "acker", "fläche", "nahrung", "lebensmittel", "kompost", "monokultur"], points: 2, lines: 3 },
    GLEICH.argument,

    { teil: TR, type: "text", prompt: "Ein Mitschüler sagt: „Mit Holz heizen ist fürs Klima genauso schlimm wie mit Kohle – beides macht CO₂.“ Hat er recht? Begründe.",
      expected: "Nur teilweise. Beim Verbrennen entsteht bei beiden CO₂. Holz ist aber CO₂-neutral: Der Baum hat beim Wachsen genauso viel CO₂ aus der Luft aufgenommen, wie beim Verbrennen frei wird – vorausgesetzt, es werden wieder Bäume nachgepflanzt. Kohle setzt Kohlenstoff frei, der Millionen Jahre im Boden gespeichert war. Dieses CO₂ kommt zusätzlich in die Luft und verstärkt den Treibhauseffekt.",
      kriterien: "1 Punkt: Holz ist CO₂-neutral bzw. der Baum hat das CO₂ vorher beim Wachsen aufgenommen. 1 Punkt: Kohle bringt zusätzliches CO₂ in die Luft (Kohlenstoff war Millionen Jahre gespeichert) bzw. verstärkt den Treibhauseffekt.",
      keywords: ["neutral", "wachsen", "aufgenommen", "gebunden", "zusätzlich", "millionen", "gespeichert", "nachpflanz"], points: 2, lines: 5 },
    { teil: TR, type: "text", prompt: "In einer Diskussion sagt jemand: „Wir hören ab morgen auf, Erdöl zu benutzen!“ Nimm Stellung: Nenne ein Argument dafür, ein Argument dagegen und dein Fazit.",
      expected: "Dafür: Beim Verbrennen von Erdöl entsteht CO₂, das den Klimawandel verstärkt; Erdöl ist endlich und Deutschland ist vom Import abhängig. Dagegen: Erdöl steckt in sehr vielen Produkten und wird zum Heizen und im Verkehr gebraucht; Ersatz ist oft noch teuer und muss erst gebaut und erforscht werden. Fazit: Ein schrittweiser Umstieg mit Zeitplan ist sinnvoll, zuerst sollte man aufhören, Erdöl zu verbrennen.",
      kriterien: "1 Punkt: ein sachliches Argument dafür (Klima/CO₂, endlich, Abhängigkeit, Umweltschäden). 1 Punkt: ein sachliches Argument dagegen (viele Produkte, Heizung/Verkehr, Ersatz teuer/noch nicht genug, Arbeitsplätze, Zeit). 1 Punkt: ein begründetes Fazit.",
      keywords: ["co2", "klima", "endlich", "import", "produkte", "teuer", "zeit", "schrittweise", "ersatz", "arbeitsplätze"], points: 3, lines: 6 }
  ]
};

/* ============================== 9R ============================== */
const probeR = {
  id: "nt9r-probe1",
  title: "Probe Organische Rohstoffe (9R)",
  unit: "NT 9R · Module 1 bis 7",
  classLevel: "9R",
  items: [
    GLEICH.kohlenstoff("Man erhitzt Holz, Zucker oder Brot sehr stark. Was bleibt als schwarzer Rest übrig?"),
    { teil: M1, type: "match", prompt: "Nachwachsend oder fossil? Ordne zu.", options: ["nachwachsend", "fossil"],
      rows: [{ text: "Holz", answer: 0 }, { text: "Erdöl", answer: 1 }, { text: "Raps", answer: 0 }, { text: "Kohle", answer: 1 }] },
    GLEICH.holzAufbau,
    { teil: M1, type: "choice", prompt: "Wie gewinnt man Zellstoff aus Holz?",
      options: ["Holz zerkleinern und in Lauge kochen", "Holz verbrennen", "Holz in Wasser einfrieren", "Holz mit Erdöl mischen"], answer: 0, points: 1 },
    { teil: M1, type: "choice", prompt: "Was stellt man aus Zellstoff her?",
      options: ["Papier und Pappe", "Benzin und Diesel", "Glas und Porzellan", "Eisen und Stahl"], answer: 0, points: 1 },

    GLEICH.biodiesel,
    { teil: M2, type: "match", prompt: "Was passt? Ordne zu.", options: ["Biodiesel", "Stärke", "Holz"],
      rows: [{ text: "Daraus macht man abbaubare Folien.", answer: 1 }, { text: "Damit fährt ein Automotor.", answer: 0 }, { text: "Daraus macht man Papier und Möbel.", answer: 2 }] },
    GLEICH.staerkefolie,
    GLEICH.nachhaltig,
    { teil: M2, type: "text", prompt: "Riesige Rapsfelder nur für Biodiesel: Nenne zwei Probleme.",
      expected: "Monokulturen, viel Dünger und Pflanzenschutzmittel, weniger Platz für Lebensmittel, weniger Artenvielfalt.",
      kriterien: "Je 1 Punkt für ein richtiges Problem (Monokultur, Dünger/Gift, weniger Fläche für Lebensmittel, weniger Tiere und Pflanzen).",
      keywords: ["monokultur", "dünger", "lebensmittel", "nahrung", "fläche", "tiere", "insekten", "boden"], points: 2, lines: 3 },

    GLEICH.lager("Die Abbildung zeigt eine Lagerstätte. Was befindet sich bei A, B und C?", "dichte Gesteinsschicht"),
    GLEICH.plankton,
    GLEICH.inkohlung("Die Abbildung zeigt, wie Kohle im Boden entsteht. Was liegt bei A, B und C?"),
    { teil: M3, type: "choice", prompt: "Was brauchte es für die Entstehung von Erdöl?",
      options: ["Luftabschluss, hohen Druck, hohe Temperatur und Millionen Jahre", "viel Sonne und Regen", "Feuer und Wind", "nur ein paar Jahre im Meer"], answer: 0, points: 1 },
    GLEICH.fossilien,

    GLEICH.turm("Im Destillationsturm wird Erdöl getrennt. Welche Fraktion kommt bei A, B, C und D heraus?", "Diesel und Heizöl"),
    { teil: M4, type: "choice", prompt: "Wo ist es im Destillationsturm am heißesten?",
      options: ["ganz unten", "ganz oben", "in der Mitte", "überall gleich"], answer: 0, points: 1 },
    GLEICH.siede,
    { teil: M4, type: "choice", prompt: "Welcher Teil des Erdöls ist am zähflüssigsten?",
      options: ["der Rückstand (daraus Bitumen)", "Benzin", "die Gase", "Kerosin"], answer: 0, points: 1 },
    { teil: M4, type: "match", prompt: "Wofür braucht man diese Erdölprodukte? Ordne zu.", options: ["Auto", "Flugzeug", "Straßenbelag", "Heizung im Haus"],
      rows: [{ text: "Benzin", answer: 0 }, { text: "Kerosin", answer: 1 }, { text: "Bitumen", answer: 2 }, { text: "Heizöl", answer: 3 }] },

    GLEICH.kreislauf("Die Abbildung zeigt den Kohlenstoffkreislauf. Was passiert bei Pfeil 1, 2, 3 und 4?"),
    GLEICH.pfeil3("Treibhausgase halten Wärme zurück und strahlen sie zur Erde zurück."),
    GLEICH.versuch,
    { teil: M5, type: "text", prompt: "Nenne zwei Folgen des Klimawandels.",
      expected: "Gletscher und Polareis schmelzen, der Meeresspiegel steigt, es gibt mehr Hitze, Dürren, Stürme und Überschwemmungen, Ernten fallen aus, Tiere und Pflanzen verlieren ihren Lebensraum.",
      kriterien: "Je 1 Punkt für eine richtige Folge.",
      keywords: ["gletscher", "eis", "meeresspiegel", "dürre", "hitze", "sturm", "überschwemm", "ernte", "tiere"], points: 2, lines: 3 },
    { teil: M5, type: "choice", prompt: "Womit sparst du im Alltag CO₂?",
      options: ["mit dem Fahrrad statt mit dem Auto fahren", "das Licht immer anlassen", "öfter mit dem Flugzeug reisen", "Geräte im Stand-by lassen"], answer: 0, points: 1 },

    GLEICH.verwendung,
    GLEICH.importe("aus Bayern"),
    GLEICH.blick,
    { teil: M6, type: "choice", prompt: "Warum sind Erdölprodukte noch so billig?",
      options: ["Die Umweltkosten sind nicht im Preis enthalten.", "Erdöl gibt es unbegrenzt.", "Erdöl wird in Deutschland gefördert.", "Erdöl muss nicht verarbeitet werden."], answer: 0, points: 1 },
    { teil: M6, type: "choice", prompt: "Was passiert mit dem allergrößten Teil des Erdöls in Deutschland?",
      options: ["Er wird verbrannt (Heizung, Verkehr, Energie).", "Er wird zu Kunststoff.", "Er wird zu Medikamenten.", "Er wird zu Kosmetik."], answer: 0, points: 1 },

    GLEICH.kreis,
    GLEICH.ersatz,
    { teil: M7, type: "text", prompt: "Nenne zwei Möglichkeiten, Erdöl zu ersetzen oder einzusparen.",
      expected: "Zum Beispiel Wärmepumpe statt Ölheizung, Elektroauto, Bahn oder Fahrrad, Bioplastik aus Stärke, Biodiesel aus Raps, Recycling, Energie sparen.",
      kriterien: "Je 1 Punkt für eine sinnvolle Möglichkeit.",
      keywords: ["wärmepumpe", "elektro", "wind", "sonne", "bahn", "fahrrad", "bioplastik", "stärke", "biodiesel", "recycl", "sparen"], points: 2, lines: 3 },
    { teil: M7, type: "choice", prompt: "Welcher Nachteil gilt für viele Ersatzstoffe aus Pflanzen?",
      options: ["Sie brauchen Ackerfläche, auf der sonst Nahrung wachsen könnte.", "Sie wachsen nicht nach.", "Sie sind immer giftig.", "Sie verstärken den Treibhauseffekt mehr als Erdöl."], answer: 0, points: 1 },
    GLEICH.argument,

    { teil: TR, type: "text", prompt: "Mit Holz zu heizen gilt als besser für das Klima als mit Kohle. Erkläre, warum.",
      expected: "Der Baum hat beim Wachsen CO₂ aus der Luft aufgenommen. Beim Verbrennen wird nur so viel CO₂ frei, wie er vorher aufgenommen hat (CO₂-neutral), wenn neue Bäume nachwachsen. Kohle war Millionen Jahre im Boden. Ihr CO₂ kommt zusätzlich in die Luft und heizt das Klima auf.",
      kriterien: "1 Punkt: Der Baum hat das CO₂ vorher aufgenommen / Holz ist CO₂-neutral / Holz wächst nach. 1 Punkt: Kohle bringt zusätzliches CO₂ in die Luft bzw. war lange im Boden gespeichert.",
      keywords: ["neutral", "wachsen", "aufgenommen", "nachwachs", "zusätzlich", "millionen", "boden", "gespeichert"], points: 2, lines: 4 },
    { teil: TR, type: "text", prompt: "Jemand sagt: „Wir hören ab morgen auf, Erdöl zu benutzen!“ Was meinst du dazu? Nenne zwei Argumente.",
      expected: "Zum Beispiel: Das wäre gut für das Klima, weil beim Verbrennen von Erdöl CO₂ entsteht. Aber es geht nicht so schnell, weil Erdöl in sehr vielen Produkten steckt und wir es zum Heizen und Autofahren brauchen. Ersatz ist oft noch teuer. Besser ist ein schrittweiser Umstieg.",
      kriterien: "Je 1 Punkt für ein sachliches Argument (Klima/CO₂, endlich, Import, viele Produkte, Heizung/Verkehr, Ersatz teuer, Zeit). 1 Punkt für eine eigene Meinung mit Begründung.",
      keywords: ["co2", "klima", "endlich", "produkte", "heiz", "auto", "teuer", "zeit", "schrittweise"], points: 3, lines: 5 }
  ]
};

// Notfall ohne KI: zwei passende Stichwörter reichen für volle Punkte (die Abgabe wird zur Prüfung markiert)
[probeM, probeR].forEach((p) => p.items.forEach((it) => {
  if (it.type === "text") it.keywordsVoll = 2;
  if (it.type === "match") it.points = it.rows.length;
}));

/* ================= Block-Proben (seit 07.10.2026) =================
 * Je Themenblock eine Probe über alle seine Module, 30 bis 45 Minuten, je eine Fassung für 9M und 9R:
 *   rohstoffe        – Auswahl aus der langen Probe oben (dieselben Aufgaben, neue Kennungen nt9m-/nt9r-rohstoffe)
 *   radioaktivitaet  – nt9-block-radioaktivitaet.js
 *   kernenergie      – nt9-block-kernenergie.js
 *   kunststoffe      – nt9-block-kunststoffe.js (seit 22.10.2026 9M mit ku1 bis ku5, seit 22.10.2026 9R ohne den 9M-Stoff)
 * Jede Aufgabe nennt ihr Modul: teil = Titel des Moduls (das sehen die Kinder), modul = Kennung aus
 * 9M/NT_9/themen.js (für die Verwaltung), Transferaufgaben: teil „Transfer“, transfer: true.
 * Die lange Probe (nt9m-probe1, nt9r-probe1, etwa 60 Minuten) bleibt als frühere Fassung (alt) erhalten:
 * Ihre Ergebnisse sind weiter einsehbar, zum Freischalten wird sie nicht mehr angeboten. */
const MODUL_KENNUNG = { [M1]: "m1", [M2]: "m2", [M3]: "m3", [M4]: "m4", [M5]: "m5", [M6]: "m6", [M7]: "m7" };
// Auswahl: Nummern der Aufgaben in der langen Probe (ab 0); transfer: Modul, auf dem die Transferaufgabe aufbaut
function rohstoffBlock(quelle, id, minutes, auswahl, transfer) {
  return {
    id, title: quelle.title, unit: quelle.unit.replace("Module 1 bis 7", "Organische Rohstoffe, alle sieben Module"), classLevel: quelle.classLevel, thema: "rohstoffe", minutes,
    items: auswahl.map((nr) => {
      const it = quelle.items[nr], istTransfer = it.teil === TR;
      return { ...it, teil: istTransfer ? "Transfer" : it.teil.split("·")[1].trim(), modul: istTransfer ? transfer[nr] : MODUL_KENNUNG[it.teil], ...(istTransfer ? { transfer: true } : {}) };
    })
  };
}
const bloecke = [
  rohstoffBlock(probeM, "nt9m-rohstoffe", 45, [0, 1, 3, 4, 6, 7, 9, 10, 13, 14, 15, 17, 19, 22, 23, 25, 27, 29, 31, 34, 35, 36], { 35: "m5", 36: "m7" }),
  rohstoffBlock(probeR, "nt9r-rohstoffe", 40, [0, 1, 3, 5, 6, 9, 10, 11, 14, 15, 16, 17, 20, 22, 23, 25, 26, 31, 32, 34, 35, 36], { 35: "m5", 36: "m7" })
];
["radioaktivitaet", "kernenergie", "kunststoffe"].forEach((block) => {
  const b = JSON.parse(JSON.stringify(require("./nt9-block-" + block)));
  [b.probeM, b.probeR].filter(Boolean).forEach((p) => {
    p.items.forEach((it) => {
      if (it.type === "text") it.keywordsVoll = 2;
      if (it.type === "match") it.points = it.rows.length;
    });
    bloecke.push(p);
  });
});
// Titel des Moduls zu jeder Aufgabe (bei Transferaufgaben steht in teil „Transfer“): für Korrektur und Rückgabe
bloecke.forEach((p) => {
  const titel = {};
  p.items.forEach((it) => { if (!it.transfer && it.modul && !titel[it.modul]) titel[it.modul] = it.teil; });
  p.items.forEach((it) => { it.modulTitel = titel[it.modul] || ""; });
});
probeM.alt = true;
probeR.alt = true;

/* ================= Probe 2 Organische Rohstoffe (seit 20.10.2026) =================
 * Auftrag der Lehrkraft: „einfache probe zu allen modulen organische stoffe modul 1-7 für NT 9. zum ankreuzen, zuordnen,
 * auch mit animationen ohne offene fragen. m-schlüssel. 50 punkte. ohne minutenregel. wenn jemand nicht abgibt
 * automatische abgabe nach 30 minuten. ohne note 6 bei verlassen der probe oder kopieren. ganz ähnliche bzw. gleiche
 * fragen wie in den modulen.“
 * Die Fragen stammen (fast) wörtlich aus den Übungen der Module 1 bis 7. Je Modul 7 Punkte (Modul 1: 8), 27 Aufgaben,
 * jedes Modul mit einer Animation (assets/probe/*.svg; erhitzen.svg und biodiesel.svg sind neu).
 * Gleiche Aufgaben für 9M und 9R (zwei Kennungen, damit jede Klasse getrennt freigeschaltet wird), beide nach dem
 * M-Schlüssel (notenzug "M": 50 % = Note 4). wegSekunden 0 + kopieren 0: Verlassen und Kopierversuche werden nur gewarnt
 * und vermerkt, nie Note 6. abgabeMinuten 30: danach gibt die Seite ab, ist sie zu, der Server (infoaustausch.js). */
const BILD2 = {
  erhitzen: { image: "assets/probe/erhitzen.svg", imageAlt: "Animierter Versuch: Drei Reagenzgläser werden über Brennerflammen stark erhitzt. In Glas A ist Zucker, in Glas B Kochsalz, in Glas C sind Holzspäne. Der Inhalt von Glas A und Glas C wird nach und nach braun und dann schwarz, das Kochsalz in Glas B bleibt weiß." },
  biodiesel: { image: "assets/probe/biodiesel.svg", imageAlt: "Animiertes Ablaufbild: Rapssamen vom Feld kommen zu Station A, dort entstehen Rapsöl und Rapsschrot. Das Rapsöl fließt zu Station B, dort kommt Methanol dazu. Aus Station B kommen Biodiesel und Glycerin. Der Biodiesel fließt zur Tankstelle." }
};
const EINFACH = [
  /* Modul 1 · Kohlenstoff, Holz und Raps (8 Punkte) */
  { teil: M1, ...BILD2.erhitzen, type: "match", prompt: "Die Animation zeigt den Versuch aus Modul 1: Drei Stoffe werden stark erhitzt. Ist der Stoff organisch oder nicht organisch? Ordne zu.",
    options: ["organisch", "nicht organisch (anorganisch)"], rows: [{ text: "A · Zucker", answer: 0 }, { text: "B · Kochsalz", answer: 1 }, { text: "C · Holzspäne", answer: 0 }] },
  { teil: M1, type: "match", prompt: "Regenerativ (nachwachsend) oder fossil? Ordne die Rohstoffe zu.", options: ["regenerativ (nachwachsend)", "fossil"],
    rows: [{ text: "Holz", answer: 0 }, { text: "Erdgas", answer: 1 }, { text: "Raps", answer: 0 }] },
  { teil: M1, type: "choice", prompt: "Woraus besteht Holz etwa je zur Hälfte?",
    options: ["aus Zellstoff (Cellulose) und Holzstoff (Lignin)", "aus Wasser und Sand", "aus Öl und Stärke", "aus Rinde und Harz"], answer: 0, points: 1 },
  { teil: M1, type: "choice", prompt: "Aus welchem Teil der Rapspflanze gewinnt man das Öl?",
    options: ["aus den Samen", "aus den Blättern", "aus den Wurzeln", "aus den Blüten"], answer: 0, points: 1 },

  /* Modul 2 · Biodiesel, Stärke und Nachhaltigkeit (7 Punkte) */
  { teil: M2, ...BILD2.biodiesel, type: "match", prompt: "Die Animation zeigt, wie aus Raps Biodiesel wird. Was passiert bei A und was bei B?",
    options: ["In der Ölmühle werden die Rapssamen gepresst.", "In der Biodieselanlage reagiert das Rapsöl mit Methanol.", "In der Raffinerie wird Erdöl destilliert."],
    rows: [{ text: "A", answer: 0 }, { text: "B", answer: 1 }] },
  { teil: M2, type: "choice", prompt: "Wofür steht das „Bio“ in Biodiesel?",
    options: ["Er wird aus Pflanzen hergestellt.", "Er wird besonders ökologisch hergestellt.", "Er ist gesund.", "Er stammt aus dem Bioladen."], answer: 0, points: 1 },
  { teil: M2, type: "choice", prompt: "Zu welcher Stoffgruppe gehört Stärke?",
    options: ["zu den Kohlenhydraten", "zu den Fetten", "zu den Eiweißen", "zu den Mineralstoffen"], answer: 0, points: 1 },
  { teil: M2, type: "choice", prompt: "Was ist ein Nachteil von Stärkefolie?",
    options: ["Sie ist nicht wasserfest.", "Sie wird aus Erdöl hergestellt.", "Sie ist nicht biologisch abbaubar.", "Sie ist giftig."], answer: 0, points: 1 },
  { teil: M2, type: "choice", prompt: "Wann ist die Nutzung eines Waldes nachhaltig?",
    options: ["wenn nur so viele Bäume gefällt werden, wie gleichzeitig nachwachsen", "wenn alle Bäume auf einmal gefällt werden", "wenn gar keine Bäume mehr nachwachsen", "wenn man nur Fichten pflanzt"], answer: 0, points: 1 },
  { teil: M2, type: "choice", prompt: "Was bedeutet Kaskadennutzung?",
    options: ["Ein Rohstoff wird mehrfach genutzt und erst am Ende verbrannt.", "Holz wird sofort verbrannt.", "Man nutzt nur Wasserkraft.", "Rohstoffe werden weggeworfen."], answer: 0, points: 1 },

  /* Modul 3 · Entstehung fossiler Rohstoffe (7 Punkte) */
  GLEICH.lager("Die Abbildung zeigt eine Lagerstätte im Schnitt. Was befindet sich bei A, B und C?", "undurchlässige Gesteinsschicht"),
  GLEICH.inkohlung("Die Abbildung zeigt im Schnitt, wie aus Pflanzen der Sumpfwälder Kohle entsteht. Welcher Stoff liegt bei A, B und C?"),
  { teil: M3, type: "choice", prompt: "Woraus sind Erdöl und Erdgas entstanden?",
    options: ["aus winzigen Meereslebewesen (Plankton)", "aus Bäumen in Sumpfwäldern", "aus Vulkanasche", "aus Meersalz"], answer: 0, points: 1 },

  /* Modul 4 · Erdölaufbereitung und Fraktionen (7 Punkte) */
  GLEICH.turm("Im Destillationsturm wird Erdöl getrennt. Welche Fraktion wird bei A, B, C und D entnommen?", "Diesel und leichtes Heizöl"),
  { teil: M4, type: "choice", prompt: "Auf welcher Stoffeigenschaft beruht die fraktionierte Destillation?",
    options: ["auf unterschiedlichen Siedetemperaturen", "auf unterschiedlichen Farben", "auf unterschiedlicher Magnetisierbarkeit", "auf unterschiedlicher Löslichkeit in Wasser"], answer: 0, points: 1 },
  { teil: M4, type: "choice", prompt: "Wie verändert sich die Temperatur im Destillationsturm?",
    options: ["Sie nimmt von unten nach oben ab.", "Sie nimmt von unten nach oben zu.", "Sie ist überall gleich.", "Sie ist in der Mitte am höchsten."], answer: 0, points: 1 },
  { teil: M4, type: "choice", prompt: "Wie hängen Molekülgröße und Siedetemperatur zusammen?",
    options: ["Je größer die Moleküle, desto höher die Siedetemperatur.", "Je größer die Moleküle, desto niedriger die Siedetemperatur.", "Es gibt keinen Zusammenhang.", "Nur kleine Moleküle haben eine Siedetemperatur."], answer: 0, points: 1 },

  /* Modul 5 · Kohlenstoffkreislauf und Treibhauseffekt (7 Punkte) */
  GLEICH.kreislauf("Die Abbildung zeigt den Kohlenstoffkreislauf. Welcher Vorgang gehört zu Pfeil 1, 2, 3 und 4?"),
  GLEICH.pfeil3("Treibhausgase halten Wärmestrahlung zurück und strahlen sie zur Erde zurück."),
  { teil: M5, type: "choice", prompt: "Wie warm wäre die Erde im Durchschnitt ohne Treibhausgase?",
    options: ["etwa −18 °C", "etwa +15 °C", "etwa 0 °C", "etwa +30 °C"], answer: 0, points: 1 },
  { teil: M5, type: "choice", prompt: "Im Versuch werden zwei gleiche Flaschen mit einer Rotlichtlampe bestrahlt: eine mit normaler Luft, eine mit Luft und zusätzlichem CO₂. Welche Flasche ist am Ende wärmer?",
    options: ["die Flasche mit Luft und zusätzlichem CO₂", "die Flasche mit normaler Luft", "Beide sind gleich warm.", "Keine – beide kühlen ab."], answer: 0, points: 1 },

  /* Modul 6 · Erdöl – Rohstoff mit Zukunft? (7 Punkte) */
  GLEICH.verwendung,
  { teil: M6, type: "choice", prompt: "Woher kommt fast das ganze Erdöl, das in Deutschland verbraucht wird?",
    options: ["aus anderen Ländern (Import)", "aus deutschen Ölfeldern", "aus Recycling", "aus Raps"], answer: 0, points: 1 },
  { teil: M6, type: "match", prompt: "Welcher Blickwinkel passt? Ordne zu.", options: ["Nachhaltigkeit", "Ökologie (Umwelt)", "Ökonomie (Wirtschaft)"],
    rows: [{ text: "Erdöl wächst nicht nach.", answer: 0 }, { text: "Plastikmüll gefährdet Meerestiere.", answer: 1 }, { text: "Die Umweltkosten fehlen im Preis.", answer: 2 }] },

  /* Modul 7 · Ohne Erdöl – geht das? (7 Punkte) */
  GLEICH.kreis,
  { teil: M7, type: "match", prompt: "Womit kann man das Erdölprodukt ersetzen? Ordne zu.",
    options: ["Wärmepumpe", "Elektroauto mit Strom aus Wind und Sonne", "Tüte aus Maisstärke oder Stoffbeutel", "Pulli aus Wolle oder Baumwolle"],
    rows: [{ text: "Heizöl in der Heizung", answer: 0 }, { text: "Benzin im Auto", answer: 1 }, { text: "Plastiktüte", answer: 2 }, { text: "Polyester-Pulli", answer: 3 }] },
  { teil: M7, type: "choice", prompt: "Welcher Nachteil gilt für viele Ersatzstoffe aus Pflanzen?",
    options: ["Sie brauchen Ackerfläche, auf der sonst Nahrung wachsen könnte.", "Sie wachsen nicht nach.", "Sie verstärken den Treibhauseffekt mehr als Erdöl.", "Sie sind immer giftig."], answer: 0, points: 1 }
];
function einfacheProbe(id, zug) {
  return {
    id, title: `Probe 2 Organische Rohstoffe – Ankreuzen und Zuordnen (9${zug})`, unit: `NT 9${zug} · Organische Rohstoffe, alle sieben Module`,
    classLevel: "9" + zug, thema: "rohstoffe", minutes: 30, abgabeMinuten: 30, notenzug: "M", wegSekunden: 0, kopieren: 0,
    items: EINFACH.map((it) => ({ ...it, ...(it.type === "match" ? { points: it.rows.length } : {}), teil: it.teil.split("·")[1].trim(), modul: MODUL_KENNUNG[it.teil] }))
  };
}
bloecke.push(einfacheProbe("nt9m-rohstoffe2", "M"), einfacheProbe("nt9r-rohstoffe2", "R"));
bloecke.slice(-2).forEach((p) => p.items.forEach((it) => { it.modulTitel = it.teil; }));

/* ================= Probe 3 Organische Rohstoffe (seit 20.10.2026) =================
 * Auftrag der Lehrkraft: „mach weitere probe. sortiere in der probe nach themen. mach noch mehr aufgaben 80 punkte.
 * transfer einbauen. ohne offene fragen“ – Rahmen wie Probe 2 (M-Schlüssel, ohne Note-6-Regel, automatische Abgabe).
 * 41 Aufgaben, 80 Punkte: sechs Themen quer durch die Module (zusammen 70 Punkte) und ein Transferteil (10 Punkte).
 * teil = Thema (Überschrift in der Probe, Punkte je Thema im Ergebnis und in der Excel-Liste), modul = Kennung des Moduls,
 * aus dem die Aufgabe stammt (die Seite zeigt den Titel bei jeder Aufgabe, die Rückgabe zählt die Punkte je Modul).
 * Fragen nach den Übungen der Module, möglichst andere als in Probe 2; neue Animation assets/probe/kugelfall.svg.
 * 45 Minuten Bearbeitungszeit (Probe 2: 30 Minuten für 50 Punkte). */
const THEMA = {
  t1: "Thema 1 · Kohlenstoff und organische Stoffe",
  t2: "Thema 2 · Nachwachsende Rohstoffe: Holz, Raps und Stärke",
  t3: "Thema 3 · Fossile Rohstoffe: So sind sie entstanden",
  t4: "Thema 4 · Erdöl: von der Raffinerie zum Produkt",
  t5: "Thema 5 · Klima: Kohlenstoffkreislauf und Treibhauseffekt",
  t6: "Thema 6 · Nachhaltigkeit und Zukunft ohne Erdöl",
  tr: "Transfer · Wende dein Wissen an"
};
const BILD3 = {
  kugel: { image: "assets/probe/kugelfall.svg", imageAlt: "Animierter Kugelfall-Versuch: Vier Messzylinder A, B, C und D enthalten vier Fraktionen des Erdöls. In jedem fällt eine Kugel von der Start- zur Ziellinie. In B ist die Kugel nach etwa einer Sekunde unten, in D nach etwa eineinhalb Sekunden, in A nach etwa zweieinhalb Sekunden, in C braucht sie über sieben Sekunden." }
};
// t = Thema, m = Modul (Konstante M1 … M7), tr = Transfer (Modul, auf dem die Aufgabe aufbaut)
const THEMEN_PROBE = [
  /* Thema 1 · Kohlenstoff und organische Stoffe (7 Punkte) */
  { t: "t1", m: M1, ...BILD2.erhitzen, type: "choice", prompt: "Die Animation zeigt den Versuch aus Modul 1. Was zeigt die schwarze Farbe in Glas A und Glas C?",
    options: ["Der Stoff enthält Kohlenstoff – er ist ein organischer Stoff.", "Der Stoff enthält Eisen.", "Der Stoff ist ein Salz.", "Der Stoff war vorher nass."], answer: 0, points: 1 },
  { t: "t1", m: M1, type: "match", prompt: "Organisch und nachwachsend, organisch, aber fossil, oder nicht organisch? Ordne zu.",
    options: ["organisch und nachwachsend", "organisch, aber fossil", "nicht organisch"],
    rows: [{ text: "Baumwolle", answer: 0 }, { text: "Braunkohle", answer: 1 }, { text: "Eisenerz", answer: 2 }, { text: "Kartoffeln", answer: 0 }] },
  { t: "t1", m: M1, type: "choice", prompt: "Warum zählen Erdöl und Kohle zu den organischen, aber nicht zu den regenerativen Rohstoffen?",
    options: ["Sie sind aus abgestorbenen Lebewesen entstanden, wachsen aber nicht nach.", "Sie enthalten keinen Kohlenstoff.", "Sie wachsen jedes Jahr nach.", "Sie werden im Wald angebaut."], answer: 0, points: 1 },
  { t: "t1", m: M1, type: "choice", prompt: "Was bedeutet regenerativ?",
    options: ["nachwachsend", "verbraucht", "fossil", "künstlich hergestellt"], answer: 0, points: 1 },

  /* Thema 2 · Nachwachsende Rohstoffe: Holz, Raps und Stärke (13 Punkte) */
  { t: "t2", m: M1, type: "choice", prompt: "Welche Aufgabe hat das Lignin im Holz?",
    options: ["Es verklebt die Zellstofffasern und macht das Holz fest.", "Es färbt die Blätter grün.", "Es ist das Öl im Holz.", "Es löst sich im Regen sofort auf."], answer: 0, points: 1 },
  { t: "t2", m: M1, type: "match", prompt: "Aus Holz oder aus Raps? Ordne die Produkte zu.", options: ["aus Holz", "aus Raps"],
    rows: [{ text: "Zeitungen und Bücher", answer: 0 }, { text: "Biodiesel", answer: 1 }, { text: "Toilettenpapier", answer: 0 }, { text: "Speiseöl", answer: 1 }] },
  { t: "t2", m: M2, type: "match", prompt: "Wofür nutzt man die Reste aus der Rapsverarbeitung? Ordne zu.",
    options: ["als Brennstoff oder Dünger", "als Futtermittel für Tiere", "in der Kosmetikindustrie"],
    rows: [{ text: "Rapsstroh", answer: 0 }, { text: "Rapsschrot", answer: 1 }, { text: "Glycerin", answer: 2 }] },
  { t: "t2", m: M2, type: "choice", prompt: "Wie viel Öl enthalten Rapssamen etwa?",
    options: ["etwa 40 %", "etwa 4 %", "etwa 90 %", "gar keins"], answer: 0, points: 1 },
  { t: "t2", m: M2, type: "choice", prompt: "Welche Pflanzen enthalten besonders viel Stärke?",
    options: ["Kartoffeln, Mais und Weizen", "Raps, Sonnenblumen und Oliven", "Salat, Gurken und Tomaten", "Äpfel, Birnen und Kirschen"], answer: 0, points: 1 },
  { t: "t2", m: M2, type: "match", prompt: "Vorteil oder Nachteil von Stärkefolie? Ordne zu.", options: ["Vorteil", "Nachteil"],
    rows: [{ text: "biologisch abbaubar", answer: 0 }, { text: "nicht wasserfest", answer: 1 }, { text: "aus einem nachwachsenden Rohstoff", answer: 0 }] },

  /* Thema 3 · Fossile Rohstoffe: So sind sie entstanden (11 Punkte) */
  { t: "t3", m: M3, type: "choice", prompt: "Was ist ein Fossil?",
    options: ["ein versteinerter Überrest oder Abdruck eines Lebewesens aus der Urzeit", "ein besonders alter Stein, der nie gelebt hat", "ein Tier, das heute noch im Meer lebt", "ein Modell aus Gips für das Museum"], answer: 0, points: 1 },
  { t: "t3", m: M3, type: "choice", prompt: "Was bedeutet das lateinische Wort „fossilis“?",
    options: ["ausgegraben", "verbrannt", "nachwachsend", "flüssig"], answer: 0, points: 1 },
  { t: "t3", m: M3, type: "choice", prompt: "Warum verwesten die abgestorbenen Meereslebewesen am Meeresgrund nicht vollständig?",
    options: ["Dort gab es kaum Sauerstoff.", "Das Wasser war zu salzig.", "Es war dort zu hell.", "Die Reste waren aus Stein."], answer: 0, points: 1 },
  { t: "t3", m: M3, ...BILD.kohle, type: "match", prompt: "Die Abbildung zeigt, wie Kohle im Boden entsteht. Wie viel Kohlenstoff enthält der Stoff bei A, B und C?",
    options: ["etwa 60 % Kohlenstoff", "etwa 70 % Kohlenstoff", "über 80 % Kohlenstoff"],
    rows: [{ text: "A (oben)", answer: 0 }, { text: "B (Mitte)", answer: 1 }, { text: "C (ganz unten)", answer: 2 }] },
  { t: "t3", m: M3, type: "match", prompt: "Nur bei Erdöl und Erdgas, nur bei Kohle oder bei beiden? Ordne zu.",
    options: ["nur bei Erdöl und Erdgas", "nur bei Kohle", "bei beiden"],
    rows: [{ text: "entstand aus Plankton im Meer", answer: 0 }, { text: "Zwischenstufe Torf", answer: 1 }, { text: "Luftabschluss, hoher Druck und Millionen Jahre", answer: 2 }, { text: "sammelt sich unter einer dichten Gesteinsschicht", answer: 0 }] },
  { t: "t3", m: M3, type: "choice", prompt: "Warum sind fossile Rohstoffe endlich?",
    options: ["Sie entstehen in Millionen Jahren, werden aber in wenigen hundert Jahren verbraucht.", "Sie verdunsten mit der Zeit von selbst.", "Man darf sie nur an Sonntagen fördern.", "Sie wachsen jedes Jahr nach."], answer: 0, points: 1 },

  /* Thema 4 · Erdöl: von der Raffinerie zum Produkt (13 Punkte) */
  { t: "t4", m: M4, type: "choice", prompt: "Was ist Erdöl?",
    options: ["ein Stoffgemisch aus vielen Kohlenwasserstoffen", "ein Reinstoff", "ein Metall", "eine Art Wasser"], answer: 0, points: 1 },
  { t: "t4", m: M4, ...BILD.turm, type: "choice", prompt: "Die Abbildung zeigt den Destillationsturm. Warum werden die Dämpfe auf verschiedenen Höhen wieder flüssig?",
    options: ["Nach oben wird es kühler – jeder Stoff wird flüssig, wenn er unter seine Siedetemperatur abkühlt.", "Nach oben wird es immer heißer.", "Die Dämpfe werden von Magneten festgehalten.", "Die Stoffe gefrieren oben zu Eis."], answer: 0, points: 1 },
  { t: "t4", m: M4, type: "choice", prompt: "Auf welche Temperatur wird das Rohöl im Röhrenofen erhitzt?",
    options: ["etwa 350 °C", "etwa 35 °C", "etwa 100 °C", "etwa 1000 °C"], answer: 0, points: 1 },
  { t: "t4", m: M4, ...BILD3.kugel, type: "match", prompt: "Die Animation zeigt den Kugelfall-Versuch mit vier Fraktionen des Erdöls. Je zähflüssiger der Stoff, desto langsamer sinkt die Kugel. Welcher Stoff ist in welchem Glas?",
    options: ["Benzin", "Kerosin", "Dieselöl", "Motoröl"],
    rows: [{ text: "Glas A", answer: 2 }, { text: "Glas B", answer: 0 }, { text: "Glas C", answer: 3 }, { text: "Glas D", answer: 1 }] },
  { t: "t4", m: M4, type: "match", prompt: "Gasförmig, flüssig oder fest? Ordne zu (bei Zimmertemperatur).", options: ["gasförmig", "flüssig", "fest"],
    rows: [{ text: "Propan", answer: 0 }, { text: "Kerosin", answer: 1 }, { text: "Bitumen", answer: 2 }] },
  { t: "t4", m: M4, type: "match", prompt: "Wird der Stoff als Energieträger verbrannt, oder ist er Rohstoff für ein Produkt? Ordne zu.",
    options: ["als Energieträger verbrannt", "Rohstoff für ein Produkt"],
    rows: [{ text: "Kerosin im Flugzeug", answer: 0 }, { text: "Kopfschmerztablette", answer: 1 }, { text: "Gas im Campingkocher", answer: 0 }] },

  /* Thema 5 · Klima: Kohlenstoffkreislauf und Treibhauseffekt (13 Punkte) */
  { t: "t5", m: M5, type: "match", prompt: "Nimmt der Vorgang CO₂ aus der Luft auf, gibt er CO₂ ab, oder speichert er Kohlenstoff lange? Ordne zu.",
    options: ["nimmt CO₂ aus der Luft auf", "gibt CO₂ an die Luft ab", "speichert Kohlenstoff lange"],
    rows: [{ text: "Fotosynthese", answer: 0 }, { text: "Waldbrand", answer: 1 }, { text: "Kohle, Erdöl und Erdgas im Boden", answer: 2 }] },
  { t: "t5", m: M5, ...BILD.kreislauf, type: "choice", prompt: "Die Abbildung zeigt den Kohlenstoffkreislauf. Bei welchem Pfeil kommt Kohlenstoff in die Luft, der Millionen Jahre im Boden gespeichert war?",
    options: ["Pfeil 4", "Pfeil 1", "Pfeil 2", "Pfeil 3"], answer: 0, points: 1 },
  { t: "t5", m: M5, ...BILD.treibhaus, type: "choice", prompt: "Die Abbildung zeigt den Treibhauseffekt. Was zeigt Pfeil 1?",
    options: ["Sonnenlicht gelangt fast ungehindert durch die Atmosphäre zur Erde.", "Die Erde strahlt Wärme ins Weltall ab.", "Treibhausgase strahlen Wärme zur Erde zurück.", "Wolken halten das Sonnenlicht auf."], answer: 0, points: 1 },
  { t: "t5", m: M5, type: "match", prompt: "Woher kommt das Treibhausgas vor allem? Ordne zu.",
    options: ["CO₂ (Kohlenstoffdioxid)", "CH₄ (Methan)", "N₂O (Lachgas)", "FCKW"],
    rows: [{ text: "Kohlekraftwerk", answer: 0 }, { text: "Rinder verdauen Gras", answer: 1 }, { text: "Dünger auf dem Feld", answer: 2 }, { text: "alter Kühlschrank", answer: 3 }] },
  { t: "t5", m: M5, type: "match", prompt: "Fakt oder Mythos? Ordne zu.", options: ["Fakt", "Mythos"],
    rows: [{ text: "Ohne Treibhausgase wäre die Erde im Durchschnitt etwa −18 °C kalt.", answer: 0 },
      { text: "Ein eiskalter Winter beweist, dass es keine Erderwärmung gibt.", answer: 1 },
      { text: "Seit der Industrialisierung ist der CO₂-Anteil der Luft um die Hälfte gestiegen.", answer: 0 },
      { text: "CO₂ ist ein so kleiner Teil der Luft, dass es keine Wirkung hat.", answer: 1 }] },

  /* Thema 6 · Nachhaltigkeit und Zukunft ohne Erdöl (13 Punkte) */
  { t: "t6", m: M2, type: "match", prompt: "Nachhaltig oder nicht nachhaltig? Ordne zu.", options: ["nachhaltig", "nicht nachhaltig"],
    rows: [{ text: "Holz erst als Regal, dann als Holzfaserplatte nutzen", answer: 0 }, { text: "mehr Bäume fällen, als nachwachsen", answer: 1 }, { text: "Mischwald statt Fichten-Monokultur pflanzen", answer: 0 }] },
  { t: "t6", m: M6, type: "choice", prompt: "Was bedeutet es, vom Erdöl-Import abhängig zu sein?",
    options: ["Steigen die Preise oder liefert ein Land nicht, trifft uns das direkt.", "Wir können so viel Erdöl fördern, wie wir wollen.", "Erdöl wird dadurch klimafreundlich.", "Wir brauchen keine Raffinerien."], answer: 0, points: 1 },
  { t: "t6", m: M7, type: "match", prompt: "Womit kann man das Erdölprodukt ersetzen? Ordne zu.",
    options: ["Biodiesel aus Raps", "Dämmplatten aus Holzfasern", "Wärmepumpe"],
    rows: [{ text: "Diesel im Traktor", answer: 0 }, { text: "Styropor-Dämmung", answer: 1 }, { text: "Heizöl in der Heizung", answer: 2 }] },
  { t: "t6", m: M7, type: "match", prompt: "Wer sagt das in der Diskussion? Ordne zu.",
    options: ["Mia Wagner, Klimaschützerin", "Ole Hansen, Ingenieur auf einer Ölbohrinsel", "Sabine Koch, Abgeordnete", "Dr. Jonas Brandt, Chemiker in der Forschung"],
    rows: [{ text: "„Der niedrige Preis lügt – die Schäden zahlen wir später.“", answer: 0 },
      { text: "„Ohne Erdöl gäbe es keine Kunstfasern und kein Kerosin.“", answer: 1 },
      { text: "„Wir dürfen nicht von wenigen Lieferländern abhängen.“", answer: 2 },
      { text: "„Mein Labor macht Folien aus Kartoffelstärke.“", answer: 3 }] },
  { t: "t6", m: M7, ...BILD.kreis, type: "choice", prompt: "Die Abbildung zeigt die Kreislaufwirtschaft. Welche Aussage passt dazu?",
    options: ["Produkte werden lange genutzt und am Ende recycelt.", "Produkte werden nach einmaligem Gebrauch verbrannt.", "Erdöl wird schneller gefördert.", "Müll wird ins Meer gebracht."], answer: 0, points: 1 },
  { t: "t6", m: M6, type: "choice", prompt: "Warum sind Erdölprodukte heute noch so preiswert?",
    options: ["Die Umweltkosten sind nicht im Preis enthalten.", "Erdöl gibt es unbegrenzt.", "Erdöl wird in Deutschland gefördert.", "Erdöl muss nicht verarbeitet werden."], answer: 0, points: 1 },

  /* Transfer · neue Situationen, Wissen aus den Modulen anwenden (10 Punkte) */
  { t: "tr", m: M1, type: "choice", prompt: "Lena heizt mit Holzpellets, Tom mit Heizöl. Welche Aussage stimmt?",
    options: ["Lenas Heizung ist CO₂-neutral, wenn so viel Holz nachwächst, wie verbrannt wird. Toms CO₂ kommt zusätzlich in die Luft.", "Beide Heizungen sind gleich gut für das Klima.", "Toms Heizung ist besser, weil Heizöl flüssig ist.", "Holz setzt beim Verbrennen überhaupt kein CO₂ frei."], answer: 0, points: 1 },
  { t: "tr", m: M6, ...BILD.verwendung, type: "choice", prompt: "Lies im Diagramm ab: Wie viel Prozent des Erdöls werden in den Bereichen A, B und C zusammen verbrannt?",
    options: ["etwa 86 %", "etwa 7 %", "etwa 35 %", "etwa 50 %"], answer: 0, points: 1 },
  { t: "tr", m: M3, ...BILD.lager, type: "choice", prompt: "Ein Bohrer bohrt von oben in die Lagerstätte aus der Abbildung. Was erreicht er zuerst, wenn er die Gesteinsschicht C durchbohrt hat?",
    options: ["Erdgas", "Erdöl", "Wasser", "Kohle"], answer: 0, points: 1 },
  { t: "tr", m: M2, type: "choice", prompt: "Eine Pommesbude gibt ihr altes Frittierfett ab, daraus wird Biodiesel. Warum ist das besser für die Umwelt als Biodiesel aus frischem Raps?",
    options: ["Dafür werden keine zusätzlichen Äcker gebraucht.", "Der Biodiesel riecht besser.", "Der Biodiesel stammt dann aus Erdöl.", "Man braucht dafür mehr Dünger."], answer: 0, points: 1 },
  { t: "tr", m: M4, type: "choice", prompt: "Beim Zelten kocht Familie Huber mit Gas aus einer Flasche. In der Flasche ist das Gas flüssig. Warum?",
    options: ["Propan und Butan werden unter Druck flüssig.", "Das Gas ist in der Flasche gefroren.", "In der Flasche ist Wasser beigemischt.", "Gas ist immer flüssig."], answer: 0, points: 1 },
  { t: "tr", m: M5, type: "choice", prompt: "Eine Stadt pflanzt 1000 neue Bäume. Was bewirkt das im Kohlenstoffkreislauf?",
    options: ["Die Bäume nehmen bei der Fotosynthese CO₂ aus der Luft auf.", "Die Bäume geben mehr CO₂ ab, als sie aufnehmen.", "Bäume haben mit CO₂ nichts zu tun.", "Die Luft bekommt dadurch mehr Methan."], answer: 0, points: 1 },
  { t: "tr", m: M6, type: "match", prompt: "Welcher Blickwinkel steckt hinter der Aussage? Ordne zu.", options: ["Nachhaltigkeit", "Ökologie (Umwelt)", "Ökonomie (Wirtschaft)"],
    rows: [{ text: "Die Erdölvorräte sind irgendwann aufgebraucht.", answer: 0 },
      { text: "Ein Liter Benzin erzeugt beim Verbrennen etwa 2,3 kg CO₂.", answer: 1 },
      { text: "Liefert ein Land kein Erdöl mehr, steigen bei uns die Preise.", answer: 2 }] },
  { t: "tr", m: M5, type: "choice", prompt: "Max sagt: „Das Klima hat sich früher auch geändert, also ist der Mensch nicht schuld.“ Was antwortest du am besten?",
    options: ["Früher hatte das natürliche Ursachen. Heute bringt der Mensch zusätzlich viel CO₂ in die Luft – deshalb wird es so schnell wärmer.", "Max hat recht, der Mensch hat keinen Einfluss.", "Das Klima hat sich noch nie geändert.", "CO₂ kühlt die Erde ab."], answer: 0, points: 1 }
];
function themenProbe(id, zug) {
  return {
    id, title: `Probe 3 Organische Rohstoffe – nach Themen mit Transfer (9${zug})`, unit: `NT 9${zug} · Organische Rohstoffe, alle sieben Module`,
    classLevel: "9" + zug, thema: "rohstoffe", minutes: 45, abgabeMinuten: 45, notenzug: "M", wegSekunden: 0, kopieren: 0,
    items: THEMEN_PROBE.map(({ t, m, ...it }) => ({ ...it, ...(it.type === "match" ? { points: it.rows.length } : {}),
      teil: THEMA[t], modul: MODUL_KENNUNG[m], modulTitel: m.split("·")[1].trim(), ...(t === "tr" ? { transfer: true } : {}) }))
  };
}
bloecke.push(themenProbe("nt9m-rohstoffe3", "M"), themenProbe("nt9r-rohstoffe3", "R"));

// Antwortreihenfolge fest mischen (die richtige Antwort steht oben immer zuerst), siehe proben-mischen.js
const { mischeAlle } = require("./proben-mischen");
const alle = { [probeM.id]: probeM, [probeR.id]: probeR };
bloecke.forEach((p) => { alle[p.id] = p; });
const TESTS = mischeAlle(alle);

module.exports = { TESTS, GRADE_SCALE, KI_REGELN };
