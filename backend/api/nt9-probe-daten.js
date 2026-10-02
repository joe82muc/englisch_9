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
  "Thema: Organische Rohstoffe (Kohlenstoffverbindungen, regenerative und fossile Rohstoffe, Holz, Zellstoff,",
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

// Antwortreihenfolge fest mischen: Oben steht die richtige Antwort immer zuerst, das dürfen die Kinder nicht merken.
// Der Zufall hängt nur an Proben-Kennung und Aufgabentext, die Reihenfolge ist nach jedem Neustart gleich.
function zufall(text) {
  let h = 2166136261;
  for (const ch of text) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); }
  return () => {
    h = (h + 0x6D2B79F5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function reihenfolge(test, it, nr, salz) {
  const rnd = zufall(test.id + "|" + salz + "|" + nr + "|" + it.prompt);
  const idx = it.options.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  return idx;
}
function mischen(test) {
  const misch = (it) => it.type === "choice" || it.type === "match";
  // Salz so wählen, dass die richtige Antwort beim Ankreuzen etwa gleich oft auf A, B, C und D liegt
  let salz = 0;
  for (let s = 0; s < 500; s++) {
    const zahl = [0, 0, 0, 0];
    test.items.forEach((it, nr) => { if (it.type === "choice") zahl[reihenfolge(test, it, nr, s).indexOf(it.answer)]++; });
    if (Math.max(...zahl) - Math.min(...zahl) <= 1) { salz = s; break; }
  }
  test.items.forEach((it, nr) => {
    if (!misch(it)) return;
    const idx = reihenfolge(test, it, nr, salz);
    it.options = idx.map((i) => it.options[i]);
    if (it.type === "choice") it.answer = idx.indexOf(it.answer);
    else it.rows = it.rows.map((r) => ({ ...r, answer: idx.indexOf(r.answer) }));
  });
}
// GLEICH-Objekte werden in beiden Fassungen benutzt: vorher kopieren, damit jede Fassung eigen gemischt wird
[probeM, probeR].forEach((p) => {
  p.items = p.items.map((it) => {
    const kopie = { ...it };
    if (it.options) kopie.options = [...it.options];
    if (it.rows) kopie.rows = it.rows.map((r) => ({ ...r }));
    return kopie;
  });
  mischen(p);
});

const TESTS = { [probeM.id]: probeM, [probeR.id]: probeR };

module.exports = { TESTS, GRADE_SCALE, KI_REGELN };
