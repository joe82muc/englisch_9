"use strict";
// Block-Probe „Kernenergie“ – Fassung 9M und 9R. Lösungen bleiben im Backend.
//
// Module des Blocks: ke-kernspaltung, ke-kettenreaktion, ke-kraftwerk, ke-risiken.
// Bei Ankreuzaufgaben steht die richtige Antwort immer zuerst (answer: 0), bei Zuordnungen stehen die Optionen
// in der Reihenfolge der Zeilen – gemischt wird beim Laden. Rechtschreibung zählt nie.
// Zahlen (Jahreszahlen, Halbwertszeiten, Prozentangaben) stammen aus den Modulseiten; Opferzahlen kommen nicht vor.

const T_SPALTUNG = "Die Kernspaltung";
const T_KETTE = "Die Kettenreaktion";
const T_KRAFTWERK = "Arbeitsweise eines Kernkraftwerks";
const T_RISIKEN = "Risiken und Folgen der Kernenergie";
const T_TRANSFER = "Transfer";

const BILD = {
  spaltung: { image: "assets/probe/ke-kernspaltung.svg", imageAlt: "Animierte Zeichnung in zwei Teilen. Links, vor der Spaltung: Ein kleines Teilchen A fliegt auf einen großen Atomkern B zu. Rechts, nach der Spaltung: Zwei mittelgroße Kerne C fliegen auseinander, zwischen ihnen leuchtet ein gelber Stern mit dem Wort Energie. Darunter fliegen drei kleine Teilchen D davon." },
  kette: { image: "assets/probe/ke-kettenreaktion.svg", imageAlt: "Animierte Zeichnung mit zwei Bildern. Bild A: Ein Neutron trifft einen Uran-235-Kern. Von ihm fliegen zwei Neutronen zu zwei weiteren Kernen, von diesen wieder je zwei Neutronen zu insgesamt vier Kernen, und von dort geht es weiter – es werden immer mehr. Bild B: Drei Uran-235-Kerne liegen hintereinander. Von jedem Kern fliegt ein Neutron zum nächsten Kern. Die übrigen Neutronen enden in zwei grauen Balken über und unter den Kernen. Legende: gelber Kreis = Uran-235-Kern, gepunkteter Pfeil = Weg eines Neutrons, grauer Balken = Stoff, der Neutronen einfängt." },
  kraftwerk: { image: "assets/probe/ke-kraftwerk.svg", imageAlt: "Animiertes Schema eines Kernkraftwerks mit drei Wasserkreisläufen. Links unter einer Kuppel (Reaktorgebäude) steht der Behälter A mit Stäben im Inneren. Der rote Kreislauf 1 führt von A durch den hohen Behälter B und zurück zu A. Von B führt der blaue Kreislauf 2 nach oben zu einem sich drehenden Schaufelrad C, von dort hinunter in einen Kasten mit der Aufschrift Kondensator und über eine Pumpe zurück zu B. Das Schaufelrad C ist über eine Welle mit der gelben Maschine D verbunden, von der Stromleitungen zu einem Mast führen. Der türkise Kreislauf 3 verbindet den Kondensator mit dem großen Turm E, aus dem Dampfwolken aufsteigen." },
  endlager: { image: "assets/probe/ke-endlager.svg", imageAlt: "Animierter Schnitt durch den Boden: Oben die Erdoberfläche mit einem kleinen Gebäude, von dem ein Schacht tief hinunter zu einem Stollen führt. Eine Lupe zeigt den Stollen vergrößert im Querschnitt: In der Mitte liegt der Abfall, umgeben von einer dicken dunklen Hülle A. Um A herum ist der Stollen mit einer hellen, dichten Masse B gefüllt. Außen herum liegt die feste graue Schicht C. Blaue Wassertropfen sickern von oben ein, kommen aber nicht bis zum Abfall." }
};

/* ---------- Aufgaben, die in beiden Fassungen gleich sind ---------- */
const GLEICH = {
  spaltung: (p) => ({ teil: T_SPALTUNG, modul: "ke-kernspaltung", ...BILD.spaltung, type: "match", prompt: p,
    options: ["Neutron, das auf den Kern trifft", "Uran-235-Kern", "Trümmerkerne", "neue Neutronen, die frei werden"],
    rows: [{ text: "A", answer: 0 }, { text: "B", answer: 1 }, { text: "C", answer: 2 }, { text: "D", answer: 3 }] }),
  meitner: { teil: T_SPALTUNG, modul: "ke-kernspaltung", type: "choice", prompt: "Otto Hahn und Fritz Strassmann beschossen 1938 Uran mit Neutronen und fanden danach überraschend Barium. Wer erkannte zuerst, dass der Urankern dabei zerbrochen war?",
    options: ["Lise Meitner", "Marie Curie", "Henri Becquerel", "Albert Einstein"], answer: 0, points: 1 },
  kraftwerk: (p) => ({ teil: T_KRAFTWERK, modul: "ke-kraftwerk", ...BILD.kraftwerk, type: "match", prompt: p,
    options: ["Reaktordruckbehälter mit Brennelementen", "Dampferzeuger", "Turbine", "Generator", "Kühlturm"],
    rows: [{ text: "A", answer: 0 }, { text: "B", answer: 1 }, { text: "C", answer: 2 }, { text: "D", answer: 3 }, { text: "E", answer: 4 }] }),
  druck: { teil: T_KRAFTWERK, modul: "ke-kraftwerk", type: "choice", prompt: "Das Wasser im Primärkreislauf ist etwa 300 °C heiß. Warum verdampft es trotzdem nicht?",
    options: ["weil es unter sehr hohem Druck steht", "weil ihm Bor und Cadmium beigemischt sind", "weil es sehr schnell durch die Rohre fließt", "weil es ständig vom Kühlturm gekühlt wird"], answer: 0, points: 1 },
  unfaelle: { teil: T_RISIKEN, modul: "ke-risiken", type: "match", prompt: "Tschernobyl oder Fukushima? Ordne jede Aussage dem richtigen Unfall zu.",
    options: ["Tschernobyl (1986)", "Fukushima (2011)"],
    rows: [{ text: "Bei einem Sicherheitstest wurden Fehler gemacht und Schutzsysteme abgeschaltet.", answer: 0 }, { text: "Ein Erdbeben löste einen Tsunami aus, der das Kraftwerk überflutete.", answer: 1 }, { text: "Eine radioaktive Wolke zog über Europa bis nach Bayern.", answer: 0 }, { text: "Der Notstrom fiel aus, deshalb konnte nicht mehr gekühlt werden.", answer: 1 }] },
  regen: { teil: T_RISIKEN, modul: "ke-risiken", type: "choice", prompt: "Nach dem Unfall von Tschernobyl zog eine radioaktive Wolke über Europa. Warum war Südbayern besonders stark betroffen?",
    options: ["Dort regnete es, als die Wolke darüber zog – der Regen wusch die Teilchen auf den Boden.", "Dort standen damals besonders viele Kernkraftwerke, die zusätzlich Strahlung abgaben.", "Dort liegt besonders viel Granit, der die Teilchen aus der Luft anzieht und speichert.", "Dort wehte kein Wind, deshalb blieb die Wolke mehrere Jahre über dem Land stehen."], answer: 0, points: 1 },
  endlager: { teil: T_RISIKEN, modul: "ke-risiken", ...BILD.endlager, type: "match", prompt: "In einem Endlager tief unter der Erde sollen mehrere Schutzschichten den radioaktiven Abfall einschließen (Mehrbarrierenprinzip). Welche Schutzschicht ist A, B und C?",
    options: ["Behälter aus Stahl", "Verfüllung aus Ton oder Bentonit", "Gestein, z. B. Salz, Ton oder Granit"],
    rows: [{ text: "A", answer: 0 }, { text: "B", answer: 1 }, { text: "C", answer: 2 }] },
  plutonium: { teil: T_RISIKEN, modul: "ke-risiken", type: "choice", prompt: "Plutonium-239 hat eine Halbwertszeit von etwa 24.000 Jahren. Was bedeutet das für den radioaktiven Abfall?",
    options: ["Er muss für viele tausend Jahre sicher eingeschlossen werden.", "Nach 24.000 Jahren ist er vollständig zerfallen und harmlos.", "Nach 24.000 Jahren strahlt er doppelt so stark wie heute.", "Er kann nach 24 Jahren auf eine normale Deponie gebracht werden."], answer: 0, points: 1 }
};

/* ============================== 9M ============================== */
const probeM = {
  id: "nt9m-kernenergie",
  title: "Probe Kernenergie (9M)",
  unit: "NT 9M · Kernspaltung, Kettenreaktion, Kernkraftwerk, Risiken und Folgen",
  classLevel: "9M",
  thema: "kernenergie",
  minutes: 45,
  items: [
    /* --- Die Kernspaltung --- */
    GLEICH.spaltung("Die Abbildung zeigt eine Kernspaltung: links vor der Spaltung, rechts danach. Ordne A, B, C und D zu."),
    GLEICH.meitner,
    { teil: T_SPALTUNG, modul: "ke-kernspaltung", type: "text", prompt: "Bei der Kernspaltung wird sehr viel Wärme frei. Erkläre, wie diese Wärme entsteht.",
      expected: "Wenn der Urankern zerbricht, fliegen die beiden Trümmerkerne mit sehr hoher Geschwindigkeit auseinander. Sie stoßen gegen andere Atome in ihrer Umgebung. Dadurch bewegen sich diese Atome schneller – der Stoff wird heiß.",
      kriterien: "1 Punkt: Die Trümmerkerne (Bruchstücke des Kerns) fliegen mit hoher Geschwindigkeit auseinander. 1 Punkt: Sie stoßen andere Atome an, die sich dadurch schneller bewegen – das ist Wärme.",
      keywords: ["trümmerkern", "bruchstück", "geschwindigkeit", "schnell", "auseinander", "stoßen", "atome", "beweg", "heiß"], points: 2, lines: 4 },

    /* --- Die Kettenreaktion --- */
    { teil: T_KETTE, modul: "ke-kettenreaktion", ...BILD.kette, type: "choice", prompt: "Die Abbildung zeigt zwei Kettenreaktionen. Welche Aussage passt zu Bild B?",
      options: ["Nur ein Neutron pro Spaltung löst eine neue Spaltung aus – so läuft es im Kernkraftwerk.", "Jede Spaltung löst mehrere neue Spaltungen aus – so läuft es im Kernkraftwerk.", "Nur ein Neutron pro Spaltung löst eine neue Spaltung aus – so läuft es in der Atombombe.", "Alle Neutronen werden eingefangen – deshalb findet keine Spaltung mehr statt."], answer: 0, points: 1 },
    { teil: T_KETTE, modul: "ke-kettenreaktion", type: "match", prompt: "Welche Erklärung gehört zu welchem Fachbegriff? Ordne zu.",
      options: ["Jede Spaltung löst weitere Spaltungen aus.", "Es muss genügend spaltbares Uran-235 vorhanden sein.", "Stoff, der Neutronen abbremst, z. B. Wasser oder Graphit", "Stoff, der Neutronen einfängt, z. B. Bor oder Cadmium"],
      rows: [{ text: "Kettenreaktion", answer: 0 }, { text: "kritische Masse", answer: 1 }, { text: "Moderator", answer: 2 }, { text: "Absorber (in den Steuerstäben)", answer: 3 }] },
    { teil: T_KETTE, modul: "ke-kettenreaktion", type: "choice", prompt: "Natururan enthält nur etwa 0,7 % spaltbares Uran-235. Was muss man tun, damit in einem Reaktor eine Kettenreaktion möglich ist?",
      options: ["den Anteil von Uran-235 auf 3 bis 4 % erhöhen (anreichern)", "das Uran auf etwa 300 °C erhitzen, bis es schmilzt", "dem Uran die Stoffe Bor und Cadmium beimischen", "das Uran unter hohem Druck in Wasser auflösen"], answer: 0, points: 1 },

    /* --- Arbeitsweise eines Kernkraftwerks --- */
    GLEICH.kraftwerk("Die Abbildung zeigt einen Druckwasserreaktor. Welches Bauteil ist A, B, C, D und E?"),
    GLEICH.druck,
    { teil: T_KRAFTWERK, modul: "ke-kraftwerk", type: "choice", prompt: "Die Leistung eines Reaktors soll sinken. Was muss man dafür tun?",
      options: ["die Steuerstäbe tiefer zwischen die Brennelemente schieben, damit sie mehr Neutronen einfangen", "die Steuerstäbe ganz aus dem Reaktor ziehen, damit weniger Neutronen frei werden", "den Druck im Primärkreislauf erhöhen, damit die Neutronen langsamer werden", "die Turbine schneller laufen lassen, damit sie mehr Wärme aus dem Reaktor holt"], answer: 0, points: 1 },
    { teil: T_KRAFTWERK, modul: "ke-kraftwerk", type: "text", prompt: "Beschreibe den Weg der Energie in einem Kernkraftwerk von der Kernspaltung bis zum elektrischen Strom.",
      expected: "Im Reaktor entsteht durch kontrollierte Kernspaltung Wärme. Sie erhitzt das Wasser im Primärkreislauf. Im Dampferzeuger gibt dieses Wasser die Wärme an den Sekundärkreislauf ab, dort entsteht Dampf. Der Dampf treibt die Turbinen an. Die Turbinen drehen den Generator, und der erzeugt elektrischen Strom.",
      kriterien: "1 Punkt: Durch Kernspaltung im Reaktor entsteht Wärme, die Wasser erhitzt. 1 Punkt: Es entsteht Dampf (im Dampferzeuger), der die Turbine antreibt. 1 Punkt: Die Turbine dreht den Generator, der den Strom erzeugt. Ebenso richtig ist die Kette Kernenergie → Wärme → Bewegungsenergie → elektrische Energie, wenn klar wird, wo die Umwandlung stattfindet.",
      keywords: ["kernspaltung", "wärme", "wasser", "dampf", "turbine", "generator", "strom", "bewegung"], points: 3, lines: 6 },
    { teil: T_KRAFTWERK, modul: "ke-kraftwerk", type: "text", prompt: "Ein Druckwasserreaktor hat drei getrennte Wasserkreisläufe. Erkläre, warum das Wasser aus dem Reaktor nicht selbst zur Turbine geleitet wird.",
      expected: "Das Wasser im Primärkreislauf fließt durch den Reaktor und ist radioaktiv. Im Dampferzeuger gibt es nur seine Wärme an den zweiten Kreislauf ab, das Wasser selbst mischt sich nicht. So bleibt das radioaktive Wasser im Reaktorgebäude eingeschlossen. Turbine, Kühlturm und Umwelt kommen nicht damit in Berührung.",
      kriterien: "1 Punkt: Das Wasser im Primärkreislauf (aus dem Reaktor) ist radioaktiv. 1 Punkt: Durch die Trennung wird nur Wärme übertragen; das radioaktive Wasser bleibt im geschlossenen Kreislauf bzw. im Reaktorgebäude und gelangt nicht zu Turbine, Kühlturm oder in die Umwelt (Sicherheit).",
      keywords: ["radioaktiv", "primär", "wärme", "getrennt", "geschlossen", "reaktorgebäude", "umwelt", "sicherheit", "mischt"], points: 2, lines: 4 },

    /* --- Risiken und Folgen der Kernenergie --- */
    GLEICH.unfaelle,
    GLEICH.regen,
    { teil: T_RISIKEN, modul: "ke-risiken", type: "choice", prompt: "In Fukushima schalteten sich die Reaktoren beim Erdbeben automatisch ab. Warum mussten sie trotzdem weiter gekühlt werden?",
      options: ["Die Brennstäbe erzeugen auch nach dem Abschalten noch viel Wärme.", "Die Kettenreaktion lief trotz Abschaltung mit voller Leistung weiter.", "Das Meerwasser des Tsunamis hatte die Reaktoren stark aufgeheizt.", "Die Turbinen drehten sich weiter und heizten das Wasser wieder auf."], answer: 0, points: 1 },
    GLEICH.endlager,
    GLEICH.plutonium,
    { teil: T_RISIKEN, modul: "ke-risiken", type: "text", prompt: "Eine Gemeinde wird als möglicher Standort für ein Endlager geprüft. Im Ort gibt es Streit. Nenne ein Argument der Gegner und ein Argument dafür, dass trotzdem irgendwo ein Endlager gebaut werden muss.",
      expected: "Gegner: Sie haben Angst vor der Strahlung und vor Unfällen bei den Transporten. Niemand möchte ein Endlager in seiner Nähe haben. Dafür: Der radioaktive Abfall ist schon da und bleibt viele tausend Jahre gefährlich. Er muss irgendwo dauerhaft sicher eingeschlossen werden, denn Zwischenlager sind nur eine Lösung auf Zeit. Das ist auch eine Verantwortung gegenüber späteren Generationen.",
      kriterien: "1 Punkt: ein Argument der Gegner (Angst vor Strahlung, Sorge wegen der Transporte oder eines Unfalls, Sorge um Grundwasser oder Gesundheit, niemand will das Lager in seiner Nähe). 1 Punkt: ein Argument für ein Endlager (der Abfall ist vorhanden und strahlt tausende Jahre, er muss dauerhaft sicher eingeschlossen werden, Zwischenlager sind nur eine Lösung auf Zeit, Verantwortung für kommende Generationen).",
      keywords: ["angst", "strahlung", "transport", "nähe", "niemand", "tausend", "sicher", "zwischenlager", "generation", "verantwortung", "irgendwo"], points: 2, lines: 4 },

    /* --- Transfer --- */
    { teil: T_TRANSFER, modul: "ke-kettenreaktion", transfer: true, type: "text", prompt: "In einer Wissenssendung steht ein Raum voller gespannter Mausefallen. Auf jeder Falle liegen zwei Tischtennisbälle. Jemand wirft einen einzigen Ball hinein – nach wenigen Sekunden sind alle Fallen zugeschnappt und überall fliegen Bälle. Erkläre, was dieses Modell zeigt: Wofür stehen die Fallen und die Bälle? Was müsste man ändern, damit der Vorgang so gleichmäßig abläuft wie in einem Kernkraftwerk?",
      expected: "Das Modell zeigt eine unkontrollierte Kettenreaktion. Die Mausefallen stehen für die Uran-235-Kerne, die Bälle für die Neutronen. Jede Falle, die zuschnappt, schleudert zwei Bälle weg, die weitere Fallen auslösen – es werden blitzschnell immer mehr, wie bei einer Atombombe. Im Kernkraftwerk darf von jeder Spaltung nur ein Neutron eine neue Spaltung auslösen. Im Modell müsste man also die überzähligen Bälle abfangen, so wie die Steuerstäbe Neutronen einfangen.",
      kriterien: "1 Punkt: Fallen = Urankerne (Atomkerne), Bälle = Neutronen. 1 Punkt: Jede ausgelöste Falle löst mehrere weitere aus – eine (unkontrollierte) Kettenreaktion, die immer schneller wird. 1 Punkt: Für einen gleichmäßigen Ablauf darf pro Falle nur ein Ball eine weitere Falle auslösen; die überzähligen Bälle müssen abgefangen werden (wie Neutronen durch Steuerstäbe bzw. Absorber).",
      keywords: ["urankern", "atomkern", "kerne", "neutron", "kettenreaktion", "unkontrolliert", "abfangen", "einfangen", "steuerst", "nur ein"], points: 3, lines: 7 },
    { teil: T_TRANSFER, modul: "ke-kraftwerk", transfer: true, type: "text", prompt: "In Spanien steht ein Sonnenkraftwerk: Hunderte Spiegel lenken das Sonnenlicht auf einen Turm. Dort wird Wasser so heiß, dass Dampf entsteht. Vergleiche dieses Kraftwerk mit einem Kernkraftwerk: Nenne eine Gemeinsamkeit bei der Stromerzeugung und einen wichtigen Unterschied. Welchen Vorteil hat das Sonnenkraftwerk?",
      expected: "Gemeinsam: In beiden Kraftwerken wird Wasser zu Dampf erhitzt. Der Dampf treibt eine Turbine an, die einen Generator dreht – so entsteht Strom. Unterschied: Die Wärme kommt beim Sonnenkraftwerk vom gebündelten Sonnenlicht, beim Kernkraftwerk aus der Kernspaltung von Uran. Vorteil: Im Sonnenkraftwerk entsteht kein radioaktiver Abfall, und es kann keinen Reaktorunfall geben.",
      kriterien: "1 Punkt: Gemeinsamkeit: Dampf treibt eine Turbine an, die einen Generator dreht (Wärme → Bewegung → Strom). 1 Punkt: Unterschied: Wärmequelle Sonnenlicht statt Kernspaltung (kein Uran, keine Kettenreaktion). 1 Punkt: ein Vorteil: kein radioaktiver Abfall, keine Gefahr eines Reaktorunfalls, keine radioaktive Strahlung oder kein Uran nötig.",
      keywords: ["dampf", "turbine", "generator", "sonne", "kernspaltung", "uran", "abfall", "radioaktiv", "unfall", "wärmequelle"], points: 3, lines: 7 },
    { teil: T_TRANSFER, modul: "ke-risiken", transfer: true, type: "text", prompt: "Ein Land plant ein neues Kernkraftwerk direkt an der Küste. In der Gegend gibt es manchmal starke Erdbeben. Nenne zwei Dinge, die die Planer nach dem Unfall von Fukushima unbedingt beachten müssen, und begründe eines davon.",
      expected: "Die Notstromgeneratoren müssen hoch und gut geschützt stehen, damit sie bei einer Überflutung weiterlaufen. Außerdem braucht das Kraftwerk einen guten Schutz vor Tsunamis, zum Beispiel hohe Schutzmauern, und mehrere unabhängige Kühlsysteme. Begründung: Auch nach dem Abschalten erzeugen die Brennstäbe noch viel Wärme. Fällt der Strom aus, funktioniert die Kühlung nicht mehr, die Brennstäbe überhitzen und es kann zu Explosionen kommen – so wie in Fukushima.",
      kriterien: "Je 1 Punkt für zwei sinnvolle Maßnahmen: Notstromgeneratoren höher und geschützt aufstellen, Schutz vor Tsunami und Überflutung (Mauern, wasserdichte Gebäude), mehrere unabhängige Kühlsysteme, Notfallpläne mit Übungen (auch: einen sichereren Standort wählen). 1 Punkt: Begründung, z. B. die Brennstäbe müssen auch nach dem Abschalten gekühlt werden – ohne Strom keine Kühlung, dann Überhitzung und Explosionen.",
      keywords: ["notstrom", "generator", "höher", "tsunami", "mauer", "überflut", "kühl", "unabhängig", "notfallplan", "überhitz", "wärme"], points: 3, lines: 7 }
  ]
};

/* ============================== 9R ============================== */
const probeR = {
  id: "nt9r-kernenergie",
  title: "Probe Kernenergie (9R)",
  unit: "NT 9R · Kernspaltung, Kettenreaktion, Kernkraftwerk, Risiken und Folgen",
  classLevel: "9R",
  thema: "kernenergie",
  minutes: 40,
  items: [
    /* --- Die Kernspaltung --- */
    GLEICH.spaltung("Die Abbildung zeigt eine Kernspaltung: links vorher, rechts nachher. Was ist A, B, C und D? Ordne zu."),
    GLEICH.meitner,
    { teil: T_SPALTUNG, modul: "ke-kernspaltung", type: "choice", prompt: "Was passiert bei einer Kernspaltung?",
      options: ["Ein schwerer Atomkern wird von einem Neutron getroffen und zerbricht in zwei kleinere Kerne.", "Zwei leichte Atomkerne stoßen zusammen und verschmelzen zu einem schweren Kern.", "Ein schwerer Atomkern gibt alle seine Elektronen ab und wird dadurch leichter.", "Ein schwerer Atomkern wird so stark erhitzt, dass er schmilzt und verdampft."], answer: 0, points: 1 },

    /* --- Die Kettenreaktion --- */
    { teil: T_KETTE, modul: "ke-kettenreaktion", ...BILD.kette, type: "choice", prompt: "Die Abbildung zeigt zwei Kettenreaktionen. Welches Bild zeigt die kontrollierte Kettenreaktion in einem Kernkraftwerk?",
      options: ["Bild B, denn dort löst nur ein Neutron pro Spaltung eine neue Spaltung aus.", "Bild A, denn dort löst jede Spaltung zwei neue Spaltungen aus.", "Bild A, denn dort werden keine Neutronen eingefangen.", "Bild B, denn dort werden alle Neutronen eingefangen."], answer: 0, points: 1 },
    { teil: T_KETTE, modul: "ke-kettenreaktion", type: "match", prompt: "Welche Erklärung gehört zu welchem Begriff? Ordne zu.",
      options: ["Jede Spaltung löst weitere Spaltungen aus.", "bremst Neutronen ab, z. B. Wasser oder Graphit", "fangen Neutronen ein und regeln so die Kettenreaktion"],
      rows: [{ text: "Kettenreaktion", answer: 0 }, { text: "Moderator", answer: 1 }, { text: "Steuerstäbe", answer: 2 }] },
    { teil: T_KETTE, modul: "ke-kettenreaktion", type: "choice", prompt: "In einem Kernkraftwerk und in einer Atombombe läuft eine Kettenreaktion ab. Was ist der Unterschied?",
      options: ["Im Kernkraftwerk läuft sie kontrolliert ab, in der Atombombe unkontrolliert.", "Im Kernkraftwerk läuft sie unkontrolliert ab, in der Atombombe kontrolliert.", "Im Kernkraftwerk verschmelzen Atomkerne, in der Atombombe werden sie gespalten.", "Im Kernkraftwerk wird Kohle verbrannt, in der Atombombe wird Uran gespalten."], answer: 0, points: 1 },

    /* --- Arbeitsweise eines Kernkraftwerks --- */
    GLEICH.kraftwerk("Die Abbildung zeigt ein Kernkraftwerk (Druckwasserreaktor). Welches Bauteil ist A, B, C, D und E? Ordne zu."),
    { teil: T_KRAFTWERK, modul: "ke-kraftwerk", ...BILD.kraftwerk, type: "choice", prompt: "In der Abbildung des Kernkraftwerks sind die drei Wasserkreisläufe mit 1, 2 und 3 nummeriert. In welchem Kreislauf ist das Wasser radioaktiv?",
      options: ["nur in Kreislauf 1 (Primärkreislauf)", "nur in Kreislauf 2 (Sekundärkreislauf)", "nur in Kreislauf 3 (Kühlwasserkreislauf)", "in Kreislauf 1 und in Kreislauf 2"], answer: 0, points: 1 },
    GLEICH.druck,
    { teil: T_KRAFTWERK, modul: "ke-kraftwerk", type: "match", prompt: "Im Kernkraftwerk wird Energie mehrmals umgewandelt. Bringe die Energieformen in die richtige Reihenfolge.",
      options: ["Kernenergie (Kernspaltung im Reaktor)", "Wärme (heißes Wasser und Dampf)", "Bewegungsenergie (die Turbine dreht sich)", "elektrische Energie (aus dem Generator)"],
      rows: [{ text: "1. (am Anfang)", answer: 0 }, { text: "2.", answer: 1 }, { text: "3.", answer: 2 }, { text: "4. (am Ende)", answer: 3 }] },
    { teil: T_KRAFTWERK, modul: "ke-kraftwerk", type: "text", prompt: "Zu vielen Kernkraftwerken gehört ein großer Kühlturm. Erkläre, wozu er gebraucht wird.",
      expected: "Der Dampf muss nach der Turbine wieder zu Wasser werden. Dazu wird er im Kondensator mit Kühlwasser abgekühlt. Das Kühlwasser nimmt dabei Wärme auf. Im Kühlturm gibt es diese überschüssige Wärme an die Luft ab und kann danach wieder kühlen.",
      kriterien: "1 Punkt: Im Kühlturm wird überschüssige Wärme an die Luft abgegeben (das Kühlwasser wird wieder abgekühlt). 1 Punkt: Das Kühlwasser wird gebraucht, um den Dampf im Kondensator abzukühlen, damit er wieder zu Wasser wird.",
      keywords: ["wärme", "luft", "abgegeben", "kühlwasser", "abkühl", "kühlt", "dampf", "kondensator", "wasser"], points: 2, lines: 4 },

    /* --- Risiken und Folgen der Kernenergie --- */
    GLEICH.unfaelle,
    GLEICH.regen,
    { teil: T_RISIKEN, modul: "ke-risiken", type: "text", prompt: "Nenne zwei Folgen, die der Unfall von Tschernobyl für die Menschen hatte.",
      expected: "Viele Menschen wurden durch die Strahlung krank, zum Beispiel erkrankten Kinder an Schilddrüsenkrebs. Die Menschen aus der Umgebung mussten ihre Heimat verlassen, die Stadt Pripjat ist bis heute eine Geisterstadt in der Sperrzone. Lebensmittel wie Milch, Pilze und Wild waren belastet.",
      kriterien: "Je 1 Punkt für eine richtige Folge: Krankheiten durch Strahlung (z. B. Schilddrüsenkrebs), Evakuierung und Verlust der Heimat, Sperrzone bis heute, belastete Lebensmittel (Milch, Pilze, Wild), Angst, schwer erkrankte oder gestorbene Rettungskräfte.",
      keywords: ["krank", "krebs", "schilddrüse", "evakuier", "heimat", "sperrzone", "verlassen", "lebensmittel", "pilze", "milch", "angst"], points: 2, lines: 3 },
    { teil: T_RISIKEN, modul: "ke-risiken", type: "match", prompt: "Abgebrannte Brennelemente sind heiß und stark radioaktiv. Bringe ihren Weg in die richtige Reihenfolge.",
      options: ["Abklingbecken im Kraftwerk (mehrere Jahre kühlen)", "Zwischenlager (mehrere Jahrzehnte)", "Transport im CASTOR-Behälter", "Endlager tief unter der Erde"],
      rows: [{ text: "1. Station", answer: 0 }, { text: "2. Station", answer: 1 }, { text: "3. Station", answer: 2 }, { text: "4. Station", answer: 3 }] },
    GLEICH.endlager,
    GLEICH.plutonium,

    /* --- Transfer --- */
    { teil: T_TRANSFER, modul: "ke-risiken", transfer: true, type: "text", prompt: "Ein Land plant ein neues Kernkraftwerk direkt an der Küste. In der Gegend gibt es manchmal starke Erdbeben. Nenne zwei Dinge, auf die die Planer nach dem Unfall von Fukushima achten müssen.",
      expected: "Die Notstromgeneratoren müssen hoch und geschützt stehen, damit sie bei einer Überflutung weiterlaufen. Das Kraftwerk braucht einen Schutz vor Tsunamis, zum Beispiel hohe Mauern. Außerdem sind mehrere unabhängige Kühlsysteme und Notfallpläne wichtig.",
      kriterien: "Je 1 Punkt für eine sinnvolle Maßnahme: Notstromgeneratoren höher und geschützt aufstellen, Schutz vor Tsunami und Überflutung (hohe Mauern, wasserdichte Gebäude), mehrere unabhängige Kühlsysteme, Notfallpläne mit Übungen (auch: einen sichereren Standort wählen).",
      keywords: ["notstrom", "generator", "höher", "tsunami", "mauer", "überflut", "kühl", "unabhängig", "notfallplan", "übung"], points: 2, lines: 4 },
    { teil: T_TRANSFER, modul: "ke-kettenreaktion", transfer: true, type: "text", prompt: "In einer Wissenssendung steht ein Raum voller gespannter Mausefallen. Auf jeder Falle liegen zwei Tischtennisbälle. Jemand wirft einen Ball hinein – nach wenigen Sekunden sind alle Fallen zugeschnappt. Das ist ein Modell für die Kettenreaktion. Wofür stehen die Mausefallen? Wofür stehen die Bälle? Erkläre, warum am Ende alle Fallen zuschnappen.",
      expected: "Die Mausefallen stehen für die Uran-Kerne, die Bälle für die Neutronen. Trifft ein Ball eine Falle, schnappt sie zu und schleudert zwei Bälle weg. Diese treffen weitere Fallen, die wieder je zwei Bälle wegschleudern. So werden es immer mehr – wie bei einer Kettenreaktion.",
      kriterien: "1 Punkt: Mausefallen = Urankerne (Atomkerne). 1 Punkt: Bälle = Neutronen. 1 Punkt: Jede Falle schleudert zwei Bälle weg, die weitere Fallen auslösen – es werden immer mehr (Kettenreaktion).",
      keywords: ["urankern", "uran", "atomkern", "kerne", "neutron", "kettenreaktion", "immer mehr", "weitere", "auslös"], points: 3, lines: 5 },
    { teil: T_TRANSFER, modul: "ke-kraftwerk", transfer: true, type: "choice", prompt: "In einem Sonnenkraftwerk lenken viele Spiegel das Sonnenlicht auf einen Turm. Dort wird Wasser zu Dampf erhitzt. Was hat dieses Kraftwerk mit einem Kernkraftwerk gemeinsam?",
      options: ["In beiden treibt Dampf eine Turbine an, die einen Generator dreht.", "In beiden werden die Atomkerne von Uran gespalten.", "In beiden regeln Steuerstäbe, wie viel Wärme entsteht.", "In beiden entsteht Abfall, der sehr lange Zeit strahlt."], answer: 0, points: 1 },
    { teil: T_TRANSFER, modul: "ke-risiken", transfer: true, type: "choice", prompt: "In einem Krankenhaus fällt Abfall mit radioaktivem Jod-131 an. Jod-131 hat eine Halbwertszeit von nur 8 Tagen. Was bedeutet das für die Lagerung dieses Abfalls?",
      options: ["Er muss nur einige Monate sicher gelagert werden, dann ist fast alles zerfallen.", "Er muss wie Plutonium viele tausend Jahre in einem Endlager bleiben.", "Er ist nach genau 8 Tagen vollständig zerfallen und völlig harmlos.", "Er strahlt nach 8 Tagen doppelt so stark wie am ersten Tag."], answer: 0, points: 1 }
  ]
};

module.exports = { probeM, probeR };
