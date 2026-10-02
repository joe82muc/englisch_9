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
 * Umfang: 45 Minuten, je 40 Punkte. Die Aufgaben fragen ab, was in den sechs Modulen geübt wurde.
 *   9M: 19 Aufgaben, davon 8 zum Erklären.   9R: 19 Aufgaben, davon 4 zum Erklären, mehr Ankreuzen und Zuordnen, einfacher formuliert.
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
  "nachwachsende Rohstoffe).",
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
  treibhaus: { image: "assets/probe/treibhaus.svg", imageAlt: "Animiertes Schaubild zum Treibhauseffekt: Pfeil 1 führt als gelbe Welle von der Sonne zur Erdoberfläche. Pfeil 2 führt rot von der Erde bis ins Weltall. Pfeil 3 führt rot von der Erde nach oben und wird an kleinen Gasmolekülen in der Atmosphäre zur Erde zurückgelenkt." },
  verwendung: { image: "assets/probe/verwendung.svg", imageAlt: "Animiertes Balkendiagramm: Verwendung von Erdöl in Deutschland in Prozent. Bereich A: 35 Prozent, Bereich B: 29 Prozent, Bereich C: 22 Prozent, chemische Industrie: 7 Prozent, Sonstiges: 7 Prozent." }
};

/* ============================== 9M ============================== */
const probeM = {
  id: "nt9m-probe1",
  title: "Probe Organische Rohstoffe (9M)",
  unit: "NT 9M · Module 1 bis 7",
  classLevel: "9M",
  items: [
    { teil: M1, type: "choice", prompt: "Man erhitzt ein Stück Holz, Zucker oder Brot sehr stark. Was bleibt als schwarzer Rest übrig?",
      options: ["Kohlenstoff", "Sauerstoff", "Wasser", "Eisen"], answer: 0, points: 1 },
    { teil: M1, type: "match", prompt: "Regenerativ oder fossil? Ordne die Rohstoffe zu.", options: ["regenerativ (nachwachsend)", "fossil"],
      rows: [{ text: "Holz", answer: 0 }, { text: "Erdgas", answer: 1 }, { text: "Rapsöl", answer: 0 }, { text: "Steinkohle", answer: 1 }] },
    { teil: M1, type: "text", prompt: "Erkläre, warum regenerative Rohstoffe als CO₂-neutral gelten.",
      expected: "Beim Wachsen nehmen die Pflanzen CO₂ aus der Luft auf. Wenn man sie später verbrennt oder sie verrotten, wird nur so viel CO₂ frei, wie sie vorher gebunden haben. Insgesamt kommt kein zusätzliches CO₂ in die Luft.",
      kriterien: "1 Punkt: Pflanzen nehmen beim Wachsen CO₂ auf. 1 Punkt: beim Verbrennen/Verrotten wird nur so viel frei, wie vorher aufgenommen wurde (kein zusätzliches CO₂).",
      keywords: ["wachsen", "aufnehmen", "binden", "gleich viel", "so viel", "zusätzlich", "verbrennen"], points: 2, lines: 3 },

    { teil: M2, type: "choice", prompt: "Woraus wird Biodiesel hergestellt?",
      options: ["aus dem Öl von Raps", "aus Erdgas", "aus Kartoffelstärke", "aus Holzspänen"], answer: 0, points: 1 },
    { teil: M2, type: "text", prompt: "Riesige Rapsfelder nur für Biodiesel: Nenne zwei Probleme.",
      expected: "Monokulturen schaden der Artenvielfalt und dem Boden, es wird viel Dünger und Pflanzenschutzmittel gebraucht, und auf den Feldern fehlt Platz für den Anbau von Lebensmitteln.",
      kriterien: "Je 1 Punkt für ein richtiges Problem, z. B. Monokultur/weniger Artenvielfalt, viel Dünger oder Pflanzenschutzmittel, weniger Fläche für Lebensmittel, Boden wird ausgelaugt.",
      keywords: ["monokultur", "dünger", "lebensmittel", "nahrung", "fläche", "artenvielfalt", "boden", "insekten"], points: 2, lines: 3 },
    { teil: M2, type: "choice", prompt: "Was bedeutet „nachhaltig“?",
      options: ["Von einem Rohstoff wird nicht mehr verbraucht, als nachwächst.", "Ein Rohstoff hält besonders lange.", "Ein Rohstoff ist besonders billig.", "Ein Rohstoff kommt aus dem Ausland."], answer: 0, points: 1 },

    { teil: M3, ...BILD.lager, type: "match", prompt: "Die Abbildung zeigt eine Lagerstätte im Schnitt. Was befindet sich bei A, B und C?",
      options: ["Erdgas", "Erdöl", "undurchlässige Gesteinsschicht"],
      rows: [{ text: "A", answer: 0 }, { text: "B", answer: 1 }, { text: "C", answer: 2 }] },
    { teil: M3, type: "choice", prompt: "Woraus sind Erdöl und Erdgas entstanden?",
      options: ["aus winzigen Meereslebewesen (Plankton)", "aus Pflanzen der Sumpfwälder", "aus Vulkanasche", "aus Dinosaurierknochen"], answer: 0, points: 1 },
    { teil: M3, type: "text", prompt: "Beschreibe, wie aus Pflanzen der Sumpfwälder Kohle entstanden ist.",
      expected: "Pflanzen der Sumpfwälder starben ab und versanken im Schlamm, also unter Luftabschluss. Neue Schichten drückten darauf. Über Millionen Jahre wurden die Reste unter Druck und Wärme zu Torf, dann zu Braunkohle und schließlich zu Steinkohle (Inkohlung).",
      kriterien: "1 Punkt: Pflanzen versinken im Schlamm/unter Luftabschluss. 1 Punkt: Druck/Wärme und lange Zeit, Abfolge Torf, Braunkohle, Steinkohle (eine dieser Angaben genügt mit dem ersten Punkt nicht doppelt).",
      keywords: ["schlamm", "luftabschluss", "torf", "braunkohle", "steinkohle", "druck", "millionen"], points: 2, lines: 4 },

    { teil: M4, ...BILD.turm, type: "match", prompt: "Im Destillationsturm wird Erdöl getrennt. Welche Fraktion wird bei A, B, C und D entnommen?",
      options: ["Gase", "Benzin", "Diesel und leichtes Heizöl", "Rückstand (daraus Bitumen)"],
      rows: [{ text: "A (ganz oben)", answer: 0 }, { text: "B", answer: 1 }, { text: "C", answer: 2 }, { text: "D (ganz unten)", answer: 3 }] },
    { teil: M4, type: "choice", prompt: "Warum lassen sich die Bestandteile des Erdöls durch Destillation trennen?",
      options: ["Sie haben unterschiedliche Siedetemperaturen.", "Sie haben unterschiedliche Farben.", "Sie sind unterschiedlich schwer magnetisch.", "Sie lösen sich unterschiedlich in Wasser."], answer: 0, points: 1 },
    { teil: M4, type: "text", prompt: "Erkläre den Zusammenhang zwischen der Größe der Moleküle, der Siedetemperatur und der Zähflüssigkeit einer Fraktion.",
      expected: "Je größer die Moleküle, desto höher ist die Siedetemperatur und desto zähflüssiger ist der Stoff. Fraktionen mit kleinen Molekülen sieden schon bei niedriger Temperatur, sind dünnflüssig und leicht entzündlich.",
      kriterien: "1 Punkt: größere Moleküle → höhere Siedetemperatur. 1 Punkt: größere Moleküle → zähflüssiger (oder umgekehrt für kleine Moleküle).",
      keywords: ["groß", "klein", "siede", "zähflüssig", "dickflüssig", "dünnflüssig", "höher"], points: 2, lines: 3 },

    { teil: M5, ...BILD.treibhaus, type: "choice", prompt: "Was zeigt Pfeil 3 in der Abbildung?",
      options: ["Treibhausgase halten Wärmestrahlung zurück und strahlen sie zur Erde zurück.", "Sonnenlicht wird von den Wolken verschluckt.", "Die Wärme entweicht vollständig ins Weltall.", "Der Mond spiegelt das Sonnenlicht."], answer: 0, points: 1 },
    { teil: M5, type: "match", prompt: "Nimmt der Vorgang CO₂ aus der Luft auf oder gibt er CO₂ ab?", options: ["nimmt CO₂ auf", "gibt CO₂ ab"],
      rows: [{ text: "Fotosynthese der Pflanzen", answer: 0 }, { text: "Atmung von Mensch und Tier", answer: 1 }, { text: "Verbrennung von Heizöl", answer: 1 }] },
    { teil: M5, type: "text", prompt: "Erkläre den Unterschied zwischen dem natürlichen und dem verstärkten Treibhauseffekt.",
      expected: "Beim natürlichen Treibhauseffekt halten Treibhausgase wie Wasserdampf und CO₂ einen Teil der Wärme zurück, die Erde ist dadurch etwa +15 °C statt −18 °C warm. Beim verstärkten Treibhauseffekt bringt der Mensch zusätzliche Treibhausgase in die Luft, vor allem durch das Verbrennen von Kohle, Erdöl und Erdgas. Dadurch wird mehr Wärme zurückgehalten und die Erde erwärmt sich weiter.",
      kriterien: "1 Punkt: natürlicher Treibhauseffekt = Treibhausgase halten Wärme zurück, macht Leben möglich. 1 Punkt: verstärkter = zusätzliche Treibhausgase durch den Menschen (z. B. Verbrennung fossiler Rohstoffe) → stärkere Erwärmung.",
      keywords: ["natürlich", "zusätzlich", "mensch", "verbrenn", "wärme", "15", "erwärm"], points: 2, lines: 4 },

    { teil: M6, ...BILD.verwendung, type: "match", prompt: "Das Diagramm zeigt, wofür Erdöl in Deutschland verwendet wird. Welcher Bereich gehört zu A, B und C?",
      options: ["Heizung", "Verkehr", "Energiegewinnung"],
      rows: [{ text: "A (35 %)", answer: 0 }, { text: "B (29 %)", answer: 1 }, { text: "C (22 %)", answer: 2 }] },
    { teil: M6, type: "text", prompt: "Erkläre, warum Erdölprodukte heute noch so preiswert sind.",
      expected: "Im Preis sind die Umweltkosten nicht enthalten, zum Beispiel Schäden durch den Klimawandel, Krankheiten durch Abgase oder Kosten für Ölunfälle und Plastikmüll. Diese Kosten bezahlen alle später. Würde man sie einrechnen, wäre Erdöl deutlich teurer.",
      kriterien: "1 Punkt: Umweltkosten/Umweltschäden sind nicht im Preis enthalten. 1 Punkt: ein Beispiel für solche Kosten oder: sie werden später von allen bezahlt / Erdöl wäre sonst teurer.",
      keywords: ["umweltkosten", "nicht im preis", "schäden", "klima", "später", "teurer"], points: 2, lines: 3 },
    { teil: M7, type: "text", prompt: "Nenne zwei Möglichkeiten, Erdöl zu ersetzen oder einzusparen.",
      expected: "Zum Beispiel eine Wärmepumpe statt Ölheizung, Elektroauto mit Strom aus Wind und Sonne, Bahn oder Fahrrad statt Auto, Bioplastik aus Maisstärke statt Kunststoff aus Erdöl, Biodiesel aus Raps, Recycling und Kreislaufwirtschaft.",
      kriterien: "Je 1 Punkt für eine sinnvolle Möglichkeit (erneuerbare Energien, Wärmepumpe, E-Auto, Bahn/Rad, Bioplastik, Biodiesel, Naturfasern, Recycling, Energie sparen, Dämmen).",
      keywords: ["wärmepumpe", "elektro", "wind", "sonne", "bahn", "fahrrad", "bioplastik", "stärke", "biodiesel", "recycl", "sparen"], points: 2, lines: 3 },

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
    { teil: M1, type: "choice", prompt: "Man erhitzt Holz, Zucker oder Brot sehr stark. Was bleibt als schwarzer Rest übrig?",
      options: ["Kohlenstoff", "Sauerstoff", "Wasser", "Eisen"], answer: 0, points: 1 },
    { teil: M1, type: "match", prompt: "Nachwachsend oder fossil? Ordne zu.", options: ["nachwachsend", "fossil"],
      rows: [{ text: "Holz", answer: 0 }, { text: "Erdöl", answer: 1 }, { text: "Raps", answer: 0 }, { text: "Kohle", answer: 1 }] },
    { teil: M1, type: "choice", prompt: "Woraus besteht Holz ungefähr je zur Hälfte?",
      options: ["aus Zellstoff und Lignin", "aus Wasser und Salz", "aus Erdöl und Stärke", "aus Eisen und Kohle"], answer: 0, points: 1 },

    { teil: M2, type: "choice", prompt: "Woraus wird Biodiesel hergestellt?",
      options: ["aus dem Öl von Raps", "aus Erdgas", "aus Kartoffelstärke", "aus Holzspänen"], answer: 0, points: 1 },
    { teil: M2, type: "match", prompt: "Was passt? Ordne zu.", options: ["Biodiesel", "Stärke", "Holz"],
      rows: [{ text: "Daraus macht man abbaubare Folien.", answer: 1 }, { text: "Damit fährt ein Automotor.", answer: 0 }, { text: "Daraus macht man Papier und Möbel.", answer: 2 }] },
    { teil: M2, type: "text", prompt: "Riesige Rapsfelder nur für Biodiesel: Nenne zwei Probleme.",
      expected: "Monokulturen, viel Dünger und Pflanzenschutzmittel, weniger Platz für Lebensmittel, weniger Artenvielfalt.",
      kriterien: "Je 1 Punkt für ein richtiges Problem (Monokultur, Dünger/Gift, weniger Fläche für Lebensmittel, weniger Tiere und Pflanzen).",
      keywords: ["monokultur", "dünger", "lebensmittel", "nahrung", "fläche", "tiere", "insekten", "boden"], points: 2, lines: 3 },

    { teil: M3, ...BILD.lager, type: "match", prompt: "Die Abbildung zeigt eine Lagerstätte. Was befindet sich bei A, B und C?",
      options: ["Erdgas", "Erdöl", "dichte Gesteinsschicht"],
      rows: [{ text: "A", answer: 0 }, { text: "B", answer: 1 }, { text: "C", answer: 2 }] },
    { teil: M3, type: "choice", prompt: "Woraus sind Erdöl und Erdgas entstanden?",
      options: ["aus winzigen Meereslebewesen (Plankton)", "aus Pflanzen der Sumpfwälder", "aus Vulkanasche", "aus Dinosaurierknochen"], answer: 0, points: 1 },
    { teil: M3, type: "choice", prompt: "Was brauchte es für die Entstehung von Erdöl?",
      options: ["Luftabschluss, hohen Druck, hohe Temperatur und Millionen Jahre", "viel Sonne und Regen", "Feuer und Wind", "nur ein paar Jahre im Meer"], answer: 0, points: 1 },

    { teil: M4, ...BILD.turm, type: "match", prompt: "Im Destillationsturm wird Erdöl getrennt. Welche Fraktion kommt bei A, B, C und D heraus?",
      options: ["Gase", "Benzin", "Diesel und Heizöl", "Rückstand (daraus Bitumen)"],
      rows: [{ text: "A (ganz oben)", answer: 0 }, { text: "B", answer: 1 }, { text: "C", answer: 2 }, { text: "D (ganz unten)", answer: 3 }] },
    { teil: M4, type: "choice", prompt: "Wo ist es im Destillationsturm am heißesten?",
      options: ["ganz unten", "ganz oben", "in der Mitte", "überall gleich"], answer: 0, points: 1 },

    { teil: M5, ...BILD.treibhaus, type: "choice", prompt: "Was zeigt Pfeil 3 in der Abbildung?",
      options: ["Treibhausgase halten Wärme zurück und strahlen sie zur Erde zurück.", "Sonnenlicht wird von den Wolken verschluckt.", "Die ganze Wärme geht ins Weltall.", "Der Mond spiegelt das Sonnenlicht."], answer: 0, points: 1 },
    { teil: M5, type: "match", prompt: "Nimmt der Vorgang CO₂ auf oder gibt er CO₂ ab?", options: ["nimmt CO₂ auf", "gibt CO₂ ab"],
      rows: [{ text: "Fotosynthese der Pflanzen", answer: 0 }, { text: "Atmung", answer: 1 }, { text: "Verbrennung von Benzin", answer: 1 }] },
    { teil: M5, type: "text", prompt: "Nenne zwei Folgen des Klimawandels.",
      expected: "Gletscher und Polareis schmelzen, der Meeresspiegel steigt, es gibt mehr Hitze, Dürren, Stürme und Überschwemmungen, Ernten fallen aus, Tiere und Pflanzen verlieren ihren Lebensraum.",
      kriterien: "Je 1 Punkt für eine richtige Folge.",
      keywords: ["gletscher", "eis", "meeresspiegel", "dürre", "hitze", "sturm", "überschwemm", "ernte", "tiere"], points: 2, lines: 3 },

    { teil: M6, ...BILD.verwendung, type: "match", prompt: "Das Diagramm zeigt, wofür Erdöl in Deutschland verwendet wird. Welcher Bereich gehört zu A, B und C?",
      options: ["Heizung", "Verkehr", "Energiegewinnung"],
      rows: [{ text: "A (35 %)", answer: 0 }, { text: "B (29 %)", answer: 1 }, { text: "C (22 %)", answer: 2 }] },
    { teil: M6, type: "choice", prompt: "Woher kommt fast das ganze Erdöl, das in Deutschland verbraucht wird?",
      options: ["aus anderen Ländern (Import)", "aus Bayern", "aus Recycling", "aus Rapsfeldern"], answer: 0, points: 1 },
    { teil: M6, type: "match", prompt: "Welcher Blickwinkel passt? Ordne zu.", options: ["Nachhaltigkeit", "Ökologie (Umwelt)", "Ökonomie (Wirtschaft)"],
      rows: [{ text: "Erdöl wächst nicht nach.", answer: 0 }, { text: "Beim Verbrennen entsteht CO₂.", answer: 1 }, { text: "Die Umweltkosten fehlen im Preis.", answer: 2 }] },
    { teil: M7, type: "text", prompt: "Nenne zwei Möglichkeiten, Erdöl zu ersetzen oder einzusparen.",
      expected: "Zum Beispiel Wärmepumpe statt Ölheizung, Elektroauto, Bahn oder Fahrrad, Bioplastik aus Stärke, Biodiesel aus Raps, Recycling, Energie sparen.",
      kriterien: "Je 1 Punkt für eine sinnvolle Möglichkeit.",
      keywords: ["wärmepumpe", "elektro", "wind", "sonne", "bahn", "fahrrad", "bioplastik", "stärke", "biodiesel", "recycl", "sparen"], points: 2, lines: 3 },

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

const TESTS = { [probeM.id]: probeM, [probeR.id]: probeR };

module.exports = { TESTS, GRADE_SCALE, KI_REGELN };
