"use strict";

/**
 * Deutsch 8 · Probe 7: Grammatik und Sprache II (Satzreihe und Satzgefüge mit den Arten von Nebensätzen und Kommas,
 * M8 zusätzlich Schachtelsatz · Satzglieder mit der Adverbiale des Zwecks, „damit“ und „um … zu“, Grund und Zweck
 * unterscheiden · Attribute und Attributsätze erkennen, einfügen, bilden · Sprache untersuchen: Fachsprache,
 * Fremdwörter, Euphemismus, M8 zusätzlich Jugendsprache und Hyperbel mit ihrer Wirkung).
 * LehrplanPLUS D8 4.2 (Satzreihe und Satzgefüge, M8: Schachtelsatz; Finaladverbiale; Attribute, Attributivsatz),
 * 4.1 (Fachsprachen, Fremdwörter, Euphemismus, M8: Hyperbel), 4.3 (Komma). Lernmodule G4–G8.
 * R8: 13 Aufgaben, 30 Punkte, offen 4 (13 %) · M8: 13 Aufgaben, 36 Punkte, offen 9 (25 %) · 40 Minuten. Keine Lesetexte.
 * Wortfelder: Variante A Sanierung des Hallenbads · Variante B Stadtbücherei.
 * Alle Sätze, Personen und Einrichtungen sind erfunden; kein Satz steht in einem Lernmodul oder in einer anderen Probe.
 *
 * Aufbau R8 (30): Satzreihe/Satzgefüge 2 · Art des Nebensatzes 2 · Sätze verbinden (Konjunktion gegeben) 4 · Kommas 3 ·
 *   Satzglieder 3 · weil/damit 2 · damit → um … zu 2 · Attribute 2 · Attribute einfügen (Genitiv 1, Relativsatz 2) 3 ·
 *   Fachsprache 1 · Fremdwörter 2 · offen 2 (Grund und Zweck) · offen 2 (Euphemismus).
 * Aufbau M8 (36): Satzbau mit Art des Nebensatzes 3 · Schachtelsatz gliedern 2 · Satzgefüge bilden (Konjunktion selbst
 *   wählen) 4 · Kommas 4 · Satzglieder 3 · Finalsatz bilden 2 · Attribute mit Apposition 3 · Relativsatz im Dativ 2 ·
 *   Fremdwörter 2 · Sprache (Fachsprache, Jugendsprache, Euphemismus, Hyperbel) 2 · offen 3 (Schachtelsatz auflösen) ·
 *   offen 3 („um … zu“ bei verschiedenen Subjekten) · offen 3 (Hyperbel und ihre Wirkung).
 * Die Sprach-Module G7/G8 waren beim Schreiben der Probe noch im Aufbau: „Euphemismus“ und „Hyperbel“ werden deshalb
 * in der Aufgabe selbst kurz erklärt (beschönigende Umschreibung, Übertreibung).
 * Innerhalb einer Fassung steht keine Konjunktion, die ein Kind beim Verbinden selbst wählen muss, in einer anderen
 * Aufgabe als Muster. Bei ganzen Sätzen zählen die Kommas (steht in der Aufgabe); Groß-/Kleinschreibung und das
 * Satzschlusszeichen zählen nicht. Rechtschreibung wird nicht eigens gewertet.
 * Bleibt auf dem Server (Lösungen, Erwartungshorizont). Bausteine: bau.js.
 */
const { c, m, f, feld, k, a, kr, probe } = require("./bau");

/* ------------------------------ Schreibhilfen ------------------------------ */
const gross = (s) => s.charAt(0).toUpperCase() + s.slice(1);
// Lücke im Satz: Es zählt das Wort allein – oder der ganze Satz mit dem Wort.
const luecke = (satz, ...woerter) => feld(satz, woerter.concat(woerter.map((w) => satz.replace("___", w))));
// Satzumbau: ganzer Satz, 2 Punkte, alle vertretbaren Fassungen
const umbau = (satz, loesungen) => feld(satz, loesungen, { breit: true, punkte: 2 });
// Satzgefüge in beiden Reihenfolgen und mit jeder passenden Konjunktion:
// gefuege("Die Halle bleibt zu", "bleibt die Halle zu", "das Dach undicht ist", ["weil", "da"])
const gefuege = (hauptsatz, hauptsatzNachNebensatz, nebensatz, konjunktionen) =>
  konjunktionen.flatMap((kj) => [`${hauptsatz}, ${kj} ${nebensatz}.`, `${gross(kj)} ${nebensatz}, ${hauptsatzNachNebensatz}.`]);
const GRUND = ["weil", "da"], GEGENSATZ = ["obwohl", "obgleich", "obschon", "wenngleich", "auch wenn"];

/* ------------------------------ Aufgabenstellungen ------------------------------ */
const REIHE_GEFUEGE = "Satzreihe oder Satzgefüge? Ordne zu.";
const NEBENSATZ = "Welche Art von Nebensatz enthält der Satz? Ordne zu.";
const KONJ = "Konjunktionalsatz", RELATIV = "Relativsatz", INDIREKT = "indirekter Fragesatz";
const SATZBAU_M = "Satzreihe oder Satzgefüge? Bestimme beim Satzgefüge auch die Art des Nebensatzes. Ordne zu.";
const REIHE = "Satzreihe", G_KONJ = "Satzgefüge: Konjunktionalsatz", G_RELATIV = "Satzgefüge: Relativsatz", G_INDIREKT = "Satzgefüge: indirekter Fragesatz";
const schachtel = (satz) => "Dieser Satz ist ein Schachtelsatz: „" + satz + "“ Ordne jedem Teil zu, was er ist.";
const HS = "Hauptsatz", NS1 = "Nebensatz 1. Grades", NS2 = "Nebensatz 2. Grades";
const VERBINDEN_R = "Verbinde die beiden Sätze zu einem Satzgefüge. Verwende die Konjunktion in Klammern und denke an das Komma.";
const VERBINDEN_M = "Verbinde die beiden Sätze zu einem Satzgefüge. In Klammern steht, was der Nebensatz ausdrücken soll. Wähle selbst eine passende Konjunktion und denke an das Komma.";
const KOMMA = "Setze die fehlenden Kommas.";
const SATZGLIED = "Welches Satzglied steht in GROSSBUCHSTABEN? Ordne zu.";
const ZWECK = "Adverbiale des Zwecks", GRUNDES = "Adverbiale des Grundes", ZEIT = "Adverbiale der Zeit", ORT = "Adverbiale des Ortes", ART = "Adverbiale der Art und Weise";
const WEIL_DAMIT = "„weil“ oder „damit“? Schreibe das passende Wort in das Feld.";
const UM_ZU = "Mache aus dem damit-Satz einen Satz mit „um … zu“. Denke an das Komma.";
const FINAL_M = "Forme das Satzglied in GROSSBUCHSTABEN in einen Nebensatz mit „um … zu“ um und schreibe den ganzen Satz auf. Denke an das Komma.";
const ATTRIBUT = "Welche Art von Attribut steht in GROSSBUCHSTABEN? Ordne zu.";
const ADJ = "Adjektivattribut", GEN = "Genitivattribut", PRAEP = "präpositionales Attribut", ATTRIBUTSATZ = "Attributsatz (Relativsatz)", APPOSITION = "Apposition";
const EINFUEGEN_R = "Attribute einfügen. a) Setze das Nomen in Klammern als Genitivattribut ein – schreibe nur die fehlenden Wörter in das Feld. b) Verbinde die beiden Sätze: Mache aus dem zweiten Satz einen Attributsatz (Relativsatz) und schreibe den ganzen Satz auf. Denke an die Kommas.";
const RELATIV_M = "Verbinde die beiden Sätze: Mache aus dem zweiten Satz einen Attributsatz (Relativsatz) zum Nomen in GROSSBUCHSTABEN. Denke an die Kommas.";
const FACHSPRACHE = "Welcher Satz ist in Fachsprache geschrieben?";
const FREMDWORT = "Was bedeutet das Fremdwort in GROSSBUCHSTABEN? Ordne die passende Erklärung zu.";
const SPRACHE_M = "Was fällt an der Sprache des Satzes auf? Ordne zu.";
const FACH = "Fachsprache", JUGEND = "Jugendsprache", EUPHEMISMUS = "Euphemismus (Beschönigung)", HYPERBEL = "Hyperbel (Übertreibung)";
const GRUND_ZWECK = " Welches Satzglied am Satzanfang nennt den Grund, welches den Zweck? Erkläre mit den passenden Fragen.";
const EUPH = " ist hier ein Euphemismus (eine beschönigende Umschreibung). Erkläre, was wirklich gemeint ist und warum man es so ausdrückt.";
const AUFLOESEN = "Löse den Schachtelsatz in zwei oder drei kürzere Sätze auf. Der Inhalt muss gleich bleiben: ";
const UM_ZU_FEHLER = " Erkläre, warum „um … zu“ hier nicht passt, und schreibe den Satz richtig auf.";
const HYPERBEL_OFFEN = " Nenne eine Hyperbel (Übertreibung) aus dem Text, erkläre, was wirklich gemeint ist, und beschreibe, welche Wirkung damit erzielt werden soll.";

/* ------------------------------ „Dein nächster Schritt“ ------------------------------ */
const H_REIHE = "Suche in jedem Teilsatz das gebeugte Verb: an zweiter Stelle = Hauptsatz, am Ende = Nebensatz. Nach „denn“, „aber“ und „doch“ folgt ein Hauptsatz.";
const H_NEBENSATZ = "Sieh dir an, womit der Nebensatz beginnt: mit einer Konjunktion, mit einem Relativpronomen (es bezieht sich auf ein Nomen davor) oder mit „ob“ bzw. einem Fragewort.";
const H_SCHACHTEL = "Suche zuerst den Hauptsatz – er kann allein stehen. Der Nebensatz 1. Grades hängt vom Hauptsatz ab; der Nebensatz 2. Grades steckt in einem anderen Nebensatz.";
const H_VERBINDEN_R = "Die Konjunktion leitet den Nebensatz ein, das gebeugte Verb rückt dort ans Ende. Zwischen Haupt- und Nebensatz steht ein Komma.";
const H_VERBINDEN_M = "Überlege zuerst, welcher Satz den Grund oder den Gegensatz nennt – er wird zum Nebensatz. Dort rückt das gebeugte Verb ans Ende.";
const H_KOMMA_R = "Suche die gebeugten Verben und grenze die Teilsätze ab: Jeder Nebensatz wird mit Komma abgetrennt – ein eingeschobener vorn und hinten.";
const H_KOMMA_M = "Grenze zuerst alle Teilsätze ab. Ein eingeschobener Nebensatz und ein eingeschobener Beisatz (Apposition) brauchen vorn und hinten ein Komma; auch vor „denn“ steht eines.";
const H_SATZGLIED = "Frage mit dem Prädikat: Wer oder was? Wem? Wen oder was? Wann? Wo? Wie? Warum? (Grund – er ist schon da) Wozu? (Zweck – er soll erreicht werden).";
const H_WEIL_DAMIT = "Frage nach dem Nebensatz: Warum? → Grund → weil. Wozu, mit welchem Ziel? → Zweck → damit.";
const H_UM_ZU = "Im um-zu-Satz fällt das Subjekt weg, und das Verb steht im Infinitiv mit „zu“ am Ende. Vor „um“ steht ein Komma.";
const H_FINAL_M = "Aus dem Nomen wird wieder ein Verb im Infinitiv mit „zu“ – bei trennbaren Verben steht „zu“ in der Mitte (aufzubauen). Das Genitivattribut wird zum Objekt.";
const H_ATTRIBUT_R = "Sieh dir die Form an: ein Adjektiv vor dem Nomen, ein Nomen im Genitiv (Wessen?), eine Gruppe mit Präposition oder ein ganzer Relativsatz hinter dem Nomen?";
const H_ATTRIBUT_M = "Sieh dir die Form an: Adjektiv vor dem Nomen, Nomen im Genitiv (Wessen?), Gruppe mit Präposition, Beisatz im selben Fall zwischen Kommas (Apposition) oder Relativsatz.";
const H_EINFUEGEN = "Genitiv: Frage „Wessen?“ und achte auf Artikel und Endung. Relativsatz: Das Relativpronomen richtet sich nach dem Nomen davor, das Verb steht am Ende, vorn und hinten ein Komma.";
const H_RELATIV_M = "Das Relativpronomen richtet sich im Geschlecht nach dem Nomen davor, im Fall nach seiner Aufgabe im Relativsatz: Frage dort „Wem?“.";
const H_FACH = "Fachsprache erkennst du an Fachwörtern, die vor allem Leute eines Berufs oder Fachgebiets genau verstehen.";
const H_FREMDWORT = "Lies den ganzen Satz und setze die Erklärungen probeweise ein: Welche passt zum Sinn?";
const H_SPRACHE_M = "Frage dich: Stehen Fachwörter eines Berufs im Satz? Klingt es wie unter Jugendlichen? Wird etwas Unangenehmes schöngeredet oder stark übertrieben?";
const H_GRUND_ZWECK = "Der Grund schaut zurück (Warum? – er ist schon da), der Zweck schaut nach vorn (Wozu? – das Ziel soll erst erreicht werden).";
const H_EUPH = "Bei einem Euphemismus fragst du immer zweimal: Was heißt das im Klartext? Und wem nützt es, wenn es harmloser klingt?";
const H_AUFLOESEN = "Schreibe zuerst jede Aussage des Schachtelsatzes als eigenen kurzen Satz auf und verbinde sie dann mit Pronomen (er, sie, es) oder Wörtern wie „deshalb“ und „aber“.";
const H_UM_ZU_FEHLER = "Prüfe bei „um … zu“ immer: Wer handelt im Hauptsatz, wer im Nebensatz? Sind es verschiedene, brauchst du „damit“ und ein eigenes Subjekt.";
const H_HYPERBEL = "Eine Hyperbel erkennst du daran, dass die Aussage wörtlich genommen unmöglich ist. Frage dann: Welches Gefühl soll bei den Lesern ankommen?";

const HILFE_GRUND_ZWECK = "So kannst du beginnen: Satz … nennt den Grund, denn man fragt … Satz … nennt den Zweck, denn man fragt …";
const HILFE_EUPH = "So kannst du beginnen: Gemeint ist, dass … Man drückt es so aus, weil …";

const SW_GRUND_ZWECK = ["warum|weshalb|wieso", "wozu|ziel|absicht|wofür"];
const SW_HARMLOS = "harmlos|klingt besser|besser klingt|freundlicher|netter|schöner|nicht so schlimm|weniger schlimm|beschönig|verharmlos|ärgern|aufregen|beschweren|angenehmer|positiver";
const SW_UM_ZU = "damit";
const SW_WIRKUNG = "ärger|verärgert|wütend|unzufried|ungeduld|stärker|eindringlich|betont|betonen|aufmerksam|dramatisch|schlimmer|überzeugen|nachdruck|deutlich|gefühl";

/* ============================== R8, Variante A – Wortfeld Sanierung des Hallenbads ============================== */
const R_A = [
  m(REIHE_GEFUEGE, [
    ["Das Hallenbad ist seit März geschlossen, denn das Dach ist undicht.", "Satzreihe"],
    ["Viele Familien hoffen, dass das Bad im Sommer wieder öffnet.", "Satzgefüge"],
    ["Die Handwerker arbeiten schnell, aber die neuen Fliesen fehlen noch.", "Satzreihe"],
    ["Niemand weiß, wann die Rutsche geliefert wird.", "Satzgefüge"]], { points: 2, hinweis: H_REIHE }),
  m(NEBENSATZ, [
    ["Herr Dobler fragt, ob das neue Sprungbrett schon da ist.", INDIREKT],
    ["Das Becken, in dem schon unsere Großeltern schwimmen lernten, bekommt neue Fliesen.", RELATIV],
    ["Die Kasse bleibt zu, solange die Bauarbeiten dauern.", KONJ],
    ["Die Stadt sucht eine Firma, die das Dach abdichtet.", RELATIV]], { points: 2, hinweis: H_NEBENSATZ }),
  f(VERBINDEN_R, [
    umbau("Der Schwimmverein trainiert weiter. Das Hallenbad ist gesperrt. (obwohl)", gefuege("Der Schwimmverein trainiert weiter", "trainiert der Schwimmverein weiter", "das Hallenbad gesperrt ist", ["obwohl"])),
    umbau("Die Schulklassen kommen wieder zum Schwimmen. Die Halle ist fertig. (sobald)", gefuege("Die Schulklassen kommen wieder zum Schwimmen", "kommen die Schulklassen wieder zum Schwimmen", "die Halle fertig ist", ["sobald"]))
  ], { hinweis: H_VERBINDEN_R }),
  k(KOMMA, [
    "Als das Wasser abgelassen wurde, kamen viele Risse zum Vorschein.",
    "Die Rutsche, die am Beckenrand steht, wird abgebaut.",
    "Der Stadtrat verspricht, dass die Arbeiten im Mai enden."], { hinweis: H_KOMMA_R }),
  m(SATZGLIED, [
    ["ZUR SICHERHEIT sperren die Arbeiter den Sprungturm.", ZWECK],
    ["AUS KOSTENGRÜNDEN verzichtet die Stadt auf eine Sauna.", GRUNDES],
    ["Die Stadt schenkt DEM SCHWIMMVEREIN neue Startblöcke.", "Dativobjekt"],
    ["SEIT DREI MONATEN ruht der Badebetrieb.", ZEIT],
    ["Die Arbeiter verlegen IM KELLER neue Rohre.", ORT],
    ["Den Bauplan erklärt DIE ARCHITEKTIN.", "Subjekt"]], { points: 3, hinweis: H_SATZGLIED }),
  f(WEIL_DAMIT, [
    luecke("Die Halle bekommt neue Fenster, ___ weniger Wärme verloren geht.", "damit"),
    luecke("Das Becken wird geleert, ___ viele Fliesen locker sind.", "weil")
  ], { hinweis: H_WEIL_DAMIT }),
  f(UM_ZU, [
    umbau("Die Arbeiter beginnen schon früh am Morgen, damit sie rechtzeitig fertig werden.", [
      "Die Arbeiter beginnen schon früh am Morgen, um rechtzeitig fertig zu werden.",
      "Um rechtzeitig fertig zu werden, beginnen die Arbeiter schon früh am Morgen."])
  ], { hinweis: H_UM_ZU }),
  m(ATTRIBUT, [
    ["Das Dach DER SCHWIMMHALLE ist undicht.", GEN],
    ["Die ROSTIGEN Rohre werden ausgetauscht.", ADJ],
    ["Das Becken MIT DER RUTSCHE bleibt erhalten.", PRAEP],
    ["Die Heizung, DIE VIEL STROM VERBRAUCHT, kommt weg.", ATTRIBUTSATZ]], { points: 2, hinweis: H_ATTRIBUT_R }),
  f(EINFUEGEN_R, [
    feld("a) Die Sanierung ___ dauert ein ganzes Jahr. (das Hallenbad)", ["des Hallenbads", "des Hallenbades", "Die Sanierung des Hallenbads dauert ein ganzes Jahr.", "Die Sanierung des Hallenbades dauert ein ganzes Jahr."]),
    feld("b) Der Sprungturm wird abgerissen. Er ist baufällig.", ["Der Sprungturm, der baufällig ist, wird abgerissen.", "Der Sprungturm, welcher baufällig ist, wird abgerissen."], { breit: true, punkte: 2 })
  ], { hinweis: H_EINFUEGEN }),
  c(FACHSPRACHE, [
    "Die Umwälzpumpe drückt das Beckenwasser durch den Sandfilter.",
    "Das Wasser im neuen Becken ist endlich wieder schön warm.",
    "Boah, die neue Rutsche ist ja mega!",
    "Wir freuen uns sehr auf den ersten Badetag."], 0, { hinweis: H_FACH }),
  m(FREMDWORT, [
    ["Die SANIERUNG kostet die Stadt zwei Millionen Euro.", "gründliche Erneuerung"],
    ["Die Lüftung ist DEFEKT.", "kaputt"],
    ["Das Becken hat eine KAPAZITÄT von 600 000 Litern.", "Fassungsvermögen"],
    ["Bis zum Herbst gibt es nur PROVISORISCHE Umkleiden.", "vorläufig, behelfsmäßig"]], { points: 2, hinweis: H_FREMDWORT }),
  a("Vergleiche die beiden Sätze: (1) „Wegen des undichten Dachs bleibt das Hallenbad geschlossen.“ (2) „Für die Reparatur des Dachs bleibt das Hallenbad geschlossen.“" + GRUND_ZWECK, [
    kr("richtig zugeordnet", 1, "Satz 1 („Wegen des undichten Dachs“) nennt den Grund, Satz 2 („Für die Reparatur des Dachs“) den Zweck."),
    kr("mit den Fragen erklärt", 1, "Grund: Frage „Warum?“ – das Dach ist schon undicht. Zweck: Frage „Wozu?“ – das Dach soll repariert werden (ein Ziel). Für den Punkt genügt eine der beiden Fragen mit passender Erklärung.")
  ], "Satz 1 nennt den Grund: Warum bleibt das Bad geschlossen? Wegen des undichten Dachs. Satz 2 nennt den Zweck: Wozu bleibt es geschlossen? Für die Reparatur – das ist das Ziel.",
  SW_GRUND_ZWECK, { hilfe: HILFE_GRUND_ZWECK, hinweis: H_GRUND_ZWECK }),
  a("Im Rathaus heißt es: „Nach der Sanierung werden die Eintrittspreise angepasst.“ Das Wort „angepasst“" + EUPH, [
    kr("Gemeintes genannt", 1, "Die Eintrittspreise werden erhöht – der Eintritt wird teurer."),
    kr("Absicht erklärt", 1, "„angepasst“ klingt harmloser und freundlicher als „erhöht“ oder „teurer“: Die schlechte Nachricht soll weniger unangenehm wirken, die Leute sollen sich nicht so ärgern.")
  ], "Gemeint ist, dass der Eintritt teurer wird. „Angepasst“ klingt harmloser als „erhöht“. So wirkt die schlechte Nachricht weniger schlimm und die Besucher ärgern sich nicht so sehr.",
  ["teurer|erhöht|erhöhen|mehr kosten|kostet mehr|höher|steigen", SW_HARMLOS], { hilfe: HILFE_EUPH, hinweis: H_EUPH })
];

/* ============================== R8, Variante B – Wortfeld Stadtbücherei ============================== */
const R_B = [
  m(REIHE_GEFUEGE, [
    ["Frau Sommerer erklärt, wie die Ausleihe am Automaten funktioniert.", "Satzgefüge"],
    ["Die Stadtbücherei öffnet erst um zehn Uhr, doch die Rückgabebox ist immer erreichbar.", "Satzreihe"],
    ["Tjark sucht einen Krimi und seine Schwester blättert in den Comics.", "Satzreihe"],
    ["Viele Leser wünschen sich, dass die Bücherei auch sonntags geöffnet hat.", "Satzgefüge"]], { points: 2, hinweis: H_REIHE }),
  m(NEBENSATZ, [
    ["Der Roman, den Enie ausgeliehen hat, ist schon vorgemerkt.", RELATIV],
    ["Enie möchte wissen, wie lange sie das Hörbuch behalten darf.", INDIREKT],
    ["Die Bücherei verschickt eine Erinnerung, falls jemand die Leihfrist überzieht.", KONJ],
    ["Herr Seitz fragt, ob es den Leseausweis auch digital gibt.", INDIREKT]], { points: 2, hinweis: H_NEBENSATZ }),
  f(VERBINDEN_R, [
    umbau("Die Bücherei bleibt am Montag geschlossen. Die neuen Regale werden aufgebaut. (weil)", gefuege("Die Bücherei bleibt am Montag geschlossen", "bleibt die Bücherei am Montag geschlossen", "die neuen Regale aufgebaut werden", ["weil"])),
    umbau("Tjark gibt die Comics zurück. Die Leihfrist endet. (bevor)", gefuege("Tjark gibt die Comics zurück", "gibt Tjark die Comics zurück", "die Leihfrist endet", ["bevor"]))
  ], { hinweis: H_VERBINDEN_R }),
  k(KOMMA, [
    "Das Lesecafé, das im ersten Stock liegt, öffnet um zehn Uhr.",
    "Frau Sommerer hofft, dass viele Kinder zur Vorlesestunde kommen.",
    "Wenn ein Buch vorbestellt ist, liegt es an der Theke bereit."], { hinweis: H_KOMMA_R }),
  m(SATZGLIED, [
    ["Frau Sommerer zeigt DEN ERSTKLÄSSLERN die Bilderbuchecke.", "Dativobjekt"],
    ["FÜR DIE LESENACHT stellt die Bücherei Sitzsäcke auf.", ZWECK],
    ["AUS PLATZMANGEL lagern viele Bücher im Keller.", GRUNDES],
    ["JEDEN DONNERSTAG findet eine Vorlesestunde statt.", ZEIT],
    ["Die Hörbücher stehen NEBEN DEM EINGANG.", ORT],
    ["Die neuen Regale bezahlt DER FÖRDERVEREIN.", "Subjekt"]], { points: 3, hinweis: H_SATZGLIED }),
  f(WEIL_DAMIT, [
    luecke("Die Bücherei kauft mehr Hörbücher, ___ viele Leser danach fragen.", "weil"),
    luecke("Am Eingang steht ein Automat, ___ niemand lange an der Theke warten muss.", "damit")
  ], { hinweis: H_WEIL_DAMIT }),
  f(UM_ZU, [
    umbau("Enie geht jeden Samstag in die Bücherei, damit sie neue Mangas findet.", [
      "Enie geht jeden Samstag in die Bücherei, um neue Mangas zu finden.",
      "Um neue Mangas zu finden, geht Enie jeden Samstag in die Bücherei."])
  ], { hinweis: H_UM_ZU }),
  m(ATTRIBUT, [
    ["Die Regale MIT DEN KRIMIS stehen im ersten Stock.", PRAEP],
    ["Das Buch, DAS ENIE VORGEMERKT HAT, ist endlich da.", ATTRIBUTSATZ],
    ["Der Ausweis MEINES BRUDERS ist abgelaufen.", GEN],
    ["Die GEMÜTLICHE Leseecke ist immer besetzt.", ADJ]], { points: 2, hinweis: H_ATTRIBUT_R }),
  f(EINFUEGEN_R, [
    feld("a) Der Umbau ___ kostet viel Geld. (das Gebäude)", ["des Gebäudes", "Der Umbau des Gebäudes kostet viel Geld."]),
    feld("b) Der Lesesaal wird vergrößert. Er ist oft überfüllt.", ["Der Lesesaal, der oft überfüllt ist, wird vergrößert.", "Der Lesesaal, welcher oft überfüllt ist, wird vergrößert."], { breit: true, punkte: 2 })
  ], { hinweis: H_EINFUEGEN }),
  c(FACHSPRACHE, [
    "Der Bestand wird nach Signaturen sortiert und im Katalog erfasst.",
    "In der Bücherei findet man viele spannende Geschichten.",
    "Ey, das neue Manga-Regal ist echt der Hammer!",
    "Am Samstag gehen wir gern zusammen Bücher ausleihen."], 0, { hinweis: H_FACH }),
  m(FREMDWORT, [
    ["Im KATALOG steht jedes Buch der Bücherei.", "Verzeichnis"],
    ["Neue Leser müssen sich an der Theke REGISTRIEREN.", "anmelden"],
    ["Das Lesecafé ist bei Jugendlichen sehr POPULÄR.", "beliebt"],
    ["Von diesem Krimi gibt es nur ein EXEMPLAR.", "einzelnes Stück"]], { points: 2, hinweis: H_FREMDWORT }),
  a("Vergleiche die beiden Sätze: (1) „Für den Umbau der Kinderecke bleibt die Bücherei eine Woche geschlossen.“ (2) „Wegen eines Wasserschadens bleibt die Bücherei eine Woche geschlossen.“" + GRUND_ZWECK, [
    kr("richtig zugeordnet", 1, "Satz 1 („Für den Umbau der Kinderecke“) nennt den Zweck, Satz 2 („Wegen eines Wasserschadens“) den Grund."),
    kr("mit den Fragen erklärt", 1, "Zweck: Frage „Wozu?“ – die Kinderecke soll umgebaut werden (ein Ziel). Grund: Frage „Warum?“ – der Wasserschaden ist schon da. Für den Punkt genügt eine der beiden Fragen mit passender Erklärung.")
  ], "In Satz 1 steht der Zweck: Wozu bleibt die Bücherei geschlossen? Für den Umbau der Kinderecke – das ist das Ziel. In Satz 2 steht der Grund: Warum bleibt sie geschlossen? Wegen eines Wasserschadens.",
  SW_GRUND_ZWECK, { hilfe: HILFE_GRUND_ZWECK, hinweis: H_GRUND_ZWECK }),
  a("Die Stadtbücherei teilt mit: „Ab Januar erheben wir für jeden Leseausweis einen kleinen Unkostenbeitrag.“ Der Ausdruck „kleiner Unkostenbeitrag“" + EUPH, [
    kr("Gemeintes genannt", 1, "Der Leseausweis kostet ab Januar Geld (eine Gebühr) – er ist nicht mehr kostenlos."),
    kr("Absicht erklärt", 1, "„kleiner Unkostenbeitrag“ klingt harmloser und freundlicher als „Gebühr“ oder „Preis“: Die schlechte Nachricht soll weniger unangenehm wirken, die Leser sollen sich nicht so ärgern.")
  ], "Im Klartext heißt das: Für den Leseausweis muss man ab Januar bezahlen. „Kleiner Unkostenbeitrag“ hört sich viel netter an als „Gebühr“, deshalb regen sich die Leser weniger darüber auf.",
  ["kostet|gebühr|geld|bezahlen|zahlen|preis|nicht mehr kostenlos|nicht mehr gratis", SW_HARMLOS], { hilfe: HILFE_EUPH, hinweis: H_EUPH })
];

/* ============================== M8, Variante A – Wortfeld Sanierung des Hallenbads ============================== */
const M_A = [
  m(SATZBAU_M, [
    ["Das Freibad bleibt geöffnet, die Schwimmhalle ist dagegen bis zum Herbst gesperrt.", REIHE],
    ["Der Stadtrat prüft, ob eine Solaranlage auf das Dach passt.", G_INDIREKT],
    ["Das Sprungbrett, das seit Jahren wackelt, wird endlich ersetzt.", G_RELATIV],
    ["Bevor die Fliesenleger kommen, muss der Beton trocknen.", G_KONJ],
    ["Die Kosten steigen, denn das Material ist teurer geworden.", REIHE],
    ["Noch steht nicht fest, wer die neue Sauna bezahlt.", G_INDIREKT]], { points: 3, hinweis: H_NEBENSATZ }),
  m(schachtel("Herr Hollweck berichtet, dass die Pumpe, die erst im Vorjahr eingebaut wurde, schon wieder ausgefallen ist."), [
    ["die erst im Vorjahr eingebaut wurde", NS2],
    ["Herr Hollweck berichtet", HS],
    ["dass die Pumpe … schon wieder ausgefallen ist", NS1]], { points: 2, hinweis: H_SCHACHTEL }),
  f(VERBINDEN_M, [
    umbau("Die Schwimmhalle bleibt bis zum Herbst gesperrt. Die Lüftung wird ausgetauscht. (Grund)", gefuege("Die Schwimmhalle bleibt bis zum Herbst gesperrt", "bleibt die Schwimmhalle bis zum Herbst gesperrt", "die Lüftung ausgetauscht wird", GRUND)),
    umbau("Die Bauarbeiten kommen gut voran. Das Wetter ist schlecht. (Gegensatz)", gefuege("Die Bauarbeiten kommen gut voran", "kommen die Bauarbeiten gut voran", "das Wetter schlecht ist", GEGENSATZ))
  ], { hinweis: H_VERBINDEN_M }),
  k(KOMMA, [
    "Die Architektin, die den Umbau plant, stellt heute ihre Entwürfe vor.",
    "Niemand weiß, wie teuer die Sanierung wird, denn die Preise steigen weiter.",
    "Der Stadtrat verspricht, dass das Bad, das viele Vereine nutzen, pünktlich fertig wird.",
    "Frau Haberkorn, die Bürgermeisterin, eröffnet das Bad im September."], { hinweis: H_KOMMA_M }),
  m(SATZGLIED, [
    ["FÜR EINEN SICHEREN BADEBETRIEB lässt die Stadt das Wasser täglich prüfen.", ZWECK],
    ["AUFGRUND DER HOHEN KOSTEN verzichtet der Stadtrat auf eine zweite Rutsche.", GRUNDES],
    ["Die Stadt überlässt DEN VEREINEN die Halle am Abend.", "Dativobjekt"],
    ["Die Bauleiterin kontrolliert MIT GROSSER SORGFALT jede Schweißnaht.", ART],
    ["NACH DEN PFINGSTFERIEN beginnt der Probebetrieb.", ZEIT],
    ["Die Fliesenleger verkleiden DAS GESAMTE BECKEN mit hellblauen Platten.", "Akkusativobjekt"]], { points: 3, hinweis: H_SATZGLIED }),
  f(FINAL_M, [
    umbau("ZUM ABDICHTEN DES BECKENS verwenden die Arbeiter eine Spezialfolie.", [
      "Um das Becken abzudichten, verwenden die Arbeiter eine Spezialfolie.",
      "Die Arbeiter verwenden eine Spezialfolie, um das Becken abzudichten."])
  ], { hinweis: H_FINAL_M }),
  m(ATTRIBUT, [
    ["Die Umkleiden IM UNTERGESCHOSS bekommen neue Spinde.", PRAEP],
    ["Herr Hollweck, DER LEITER DES BADES, führt die Gäste über die Baustelle.", APPOSITION],
    ["Die Fenster DER SÜDSEITE werden dreifach verglast.", GEN],
    ["Das Becken, DAS BISHER NUR 1,30 METER TIEF WAR, wird vertieft.", ATTRIBUTSATZ],
    ["Die UNDICHTE Decke wird zuerst repariert.", ADJ],
    ["Die Rutsche AUS EDELSTAHL bleibt erhalten.", PRAEP]], { points: 3, hinweis: H_ATTRIBUT_M }),
  f(RELATIV_M, [
    umbau("Die FIRMA kommt aus dem Nachbarort. Die Stadt hat der Firma den Auftrag gegeben.", [
      "Die Firma, der die Stadt den Auftrag gegeben hat, kommt aus dem Nachbarort.",
      "Die Firma, welcher die Stadt den Auftrag gegeben hat, kommt aus dem Nachbarort."])
  ], { hinweis: H_RELATIV_M }),
  m(FREMDWORT, [
    ["Die Stadt will zwei Millionen Euro INVESTIEREN.", "Geld für etwas einsetzen"],
    ["Die FASSADE der Halle wird neu gestrichen.", "Außenseite eines Gebäudes"],
    ["Im Becken ZIRKULIERT das Wasser ständig.", "im Kreis fließen"],
    ["Die Bauleiterin legt großen Wert auf PRÄZISION.", "Genauigkeit"]], { points: 2, hinweis: H_FREMDWORT }),
  m(SPRACHE_M, [
    ["Im alten Bad war das Wasser so kalt, dass man sofort zum Eiszapfen wurde.", HYPERBEL],
    ["Die Chlorgasanlage wird durch eine Elektrolyse-Einheit ersetzt.", FACH],
    ["Die Stadt spricht von einer „Preisanpassung“ – der Eintritt wird teurer.", EUPHEMISMUS],
    ["Die neue Rutsche wird safe richtig krass!", JUGEND]], { points: 2, hinweis: H_SPRACHE_M }),
  a(AUFLOESEN + "„Die Sauna, die der Förderverein, der seit Jahren Spenden sammelt, bezahlen will, wird erst im nächsten Jahr gebaut.“", [
    kr("mindestens zwei vollständige Sätze, kein Schachtelsatz mehr", 1, "Zwei oder drei Sätze, in denen kein Nebensatz mehr in einem anderen Nebensatz steckt."),
    kr("Inhalt vollständig", 1, "Alle drei Aussagen bleiben erhalten: (1) Der Förderverein sammelt seit Jahren Spenden. (2) Er will die Sauna bezahlen. (3) Die Sauna wird erst im nächsten Jahr gebaut. Fehlt eine Aussage oder ist eine verändert: 0 Punkte."),
    kr("sprachlich richtige Sätze", 1, "Die neuen Sätze sind grammatisch richtig und gut verständlich; die Bezüge stimmen (z. B. „er“ für den Förderverein, „sie“ für die Sauna).")
  ], "Der Förderverein sammelt seit Jahren Spenden. Er will die Sauna bezahlen. Sie wird aber erst im nächsten Jahr gebaut.",
  ["förderverein", "spenden", "nächsten jahr|nächstes jahr"], { hinweis: H_AUFLOESEN }),
  a("Auf der Internetseite der Stadt steht: „Die Stadt baut eine Rampe, um mit dem Rollstuhl ins Becken zu kommen.“" + UM_ZU_FEHLER, [
    kr("Fehler erkannt", 1, "Der Satz klingt, als wolle die Stadt selbst mit dem Rollstuhl ins Becken – gemeint sind aber die Badegäste im Rollstuhl."),
    kr("Regel genannt", 1, "„um … zu“ geht nur, wenn beide Teilsätze dasselbe Subjekt haben; hier sind es verschiedene (die Stadt – die Menschen im Rollstuhl)."),
    kr("Satz verbessert", 1, "Mit „damit“ und eigenem Subjekt, z. B.: „Die Stadt baut eine Rampe, damit Menschen im Rollstuhl ins Becken kommen.“ (auch: „…, damit man mit dem Rollstuhl ins Becken kommt.“)")
  ], "„um … zu“ passt nur, wenn in beiden Teilsätzen dieselbe Person handelt. Hier baut die Stadt, aber ins Becken kommen sollen die Menschen im Rollstuhl. Richtig: Die Stadt baut eine Rampe, damit Menschen im Rollstuhl ins Becken kommen.",
  ["subjekt|dieselbe|derselbe|gleiche|nicht die stadt|stadt selbst|verschiedene", SW_UM_ZU], { hinweis: H_UM_ZU_FEHLER }),
  a("Ein Leserbrief zur Sanierung beginnt so: „Seit einer Ewigkeit warten wir nun auf unser Bad. Die Baustelle kommt im Schneckentempo voran, und im Rathaus hat man uns schon tausendmal vertröstet.“" + HYPERBEL_OFFEN, [
    kr("Hyperbel genannt", 1, "„Seit einer Ewigkeit“ oder „tausendmal vertröstet“ (auch „im Schneckentempo“ wird anerkannt)."),
    kr("Gemeintes erklärt", 1, "Passend zur gewählten Stelle: Es dauert schon sehr lange (viele Monate) bzw. man wurde schon oft vertröstet bzw. es geht sehr langsam – aber nicht wirklich ewig oder tausendmal."),
    kr("Wirkung beschrieben", 1, "Die Übertreibung zeigt Ärger und Ungeduld des Schreibers, macht die Kritik eindringlicher und soll die Leser auf seine Seite ziehen – sachlich ist sie nicht.")
  ], "Eine Hyperbel ist „tausendmal vertröstet“. Gemeint ist, dass das Rathaus die Bürger schon oft hingehalten hat, aber nicht wirklich tausendmal. Mit der Übertreibung zeigt der Schreiber, wie verärgert er ist, und seine Kritik wirkt stärker.",
  ["ewigkeit|tausendmal|schneckentempo", "sehr lange|lange|oft|viele male|häufig|mehrmals|langsam", SW_WIRKUNG], { hinweis: H_HYPERBEL })
];

/* ============================== M8, Variante B – Wortfeld Stadtbücherei ============================== */
const M_B = [
  m(SATZBAU_M, [
    ["Der Bildband, den Yara vorbestellt hat, liegt an der Theke bereit.", G_RELATIV],
    ["Die Ausleihe läuft jetzt über einen Automaten, doch an der Theke hilft weiterhin eine Mitarbeiterin.", REIHE],
    ["Die Leiterin überlegt, ob die Bücherei auch sonntags öffnen soll.", G_INDIREKT],
    ["Nachdem der Teppich verlegt war, räumten die Helfer die Regale ein.", G_KONJ],
    ["Die Leser stimmen darüber ab, welche Zeitschriften die Bücherei abonniert.", G_INDIREKT],
    ["Die Bücherei verlängert die Leihfrist, denn in den Ferien verreisen viele Leser.", REIHE]], { points: 3, hinweis: H_NEBENSATZ }),
  m(schachtel("Frau Wieland erzählt, dass der Lesesessel, den ein Schreiner aus dem Ort gespendet hat, immer besetzt ist."), [
    ["Frau Wieland erzählt", HS],
    ["den ein Schreiner aus dem Ort gespendet hat", NS2],
    ["dass der Lesesessel … immer besetzt ist", NS1]], { points: 2, hinweis: H_SCHACHTEL }),
  f(VERBINDEN_M, [
    umbau("Die Bücherei schafft zusätzliche Tablets an. Immer mehr Leser leihen E-Books aus. (Grund)", gefuege("Die Bücherei schafft zusätzliche Tablets an", "schafft die Bücherei zusätzliche Tablets an", "immer mehr Leser E-Books ausleihen", GRUND)),
    umbau("Der Lesesaal ist jeden Nachmittag voll. Die Stühle sind unbequem. (Gegensatz)", gefuege("Der Lesesaal ist jeden Nachmittag voll", "ist der Lesesaal jeden Nachmittag voll", "die Stühle unbequem sind", GEGENSATZ))
  ], { hinweis: H_VERBINDEN_M }),
  k(KOMMA, [
    "Herr Mayrhofer, der Hausmeister der Bücherei, schließt um sieben Uhr ab.",
    "Frau Wieland berichtet, dass die Lampen, die im Lesesaal hängen, ausgetauscht werden.",
    "Der Roman, den die Lesegruppe ausgewählt hat, ist ständig ausgeliehen.",
    "Niemand weiß, wann der Aufzug repariert wird, denn das Ersatzteil fehlt noch."], { hinweis: H_KOMMA_M }),
  m(SATZGLIED, [
    ["Yara blättert GANZ VORSICHTIG in dem alten Atlas.", ART],
    ["Die Stadt stellt DER BÜCHEREI einen zweiten Raum zur Verfügung.", "Dativobjekt"],
    ["INFOLGE EINES ROHRBRUCHS blieb die Kinderabteilung zwei Wochen gesperrt.", GRUNDES],
    ["Bruno bringt DEN ÜBERFÄLLIGEN COMIC endlich zurück.", "Akkusativobjekt"],
    ["FÜR DIE AUTORENLESUNG räumen die Mitarbeiter den Lesesaal um.", ZWECK],
    ["WÄHREND DER SOMMERFERIEN läuft der Lesewettbewerb.", ZEIT]], { points: 3, hinweis: H_SATZGLIED }),
  f(FINAL_M, [
    umbau("ZUM EINSCANNEN DER AUSWEISE brauchen die Mitarbeiter ein Lesegerät.", [
      "Um die Ausweise einzuscannen, brauchen die Mitarbeiter ein Lesegerät.",
      "Die Mitarbeiter brauchen ein Lesegerät, um die Ausweise einzuscannen."])
  ], { hinweis: H_FINAL_M }),
  m(ATTRIBUT, [
    ["Frau Wieland, DIE LEITERIN DER BÜCHEREI, begrüßt die neue Lesegruppe.", APPOSITION],
    ["Die Zeitschriften AUF DEM DREHSTÄNDER sind nur zum Lesen vor Ort.", PRAEP],
    ["Der Einband DES LEXIKONS ist beschädigt.", GEN],
    ["Der Krimi, DEN BRUNO EMPFOHLEN HAT, ist spannend.", ATTRIBUTSATZ],
    ["Die LEISE Ecke im Obergeschoss ist bei Schülern beliebt.", ADJ],
    ["Die Öffnungszeiten DER STADTBÜCHEREI ändern sich im Herbst.", GEN]], { points: 3, hinweis: H_ATTRIBUT_M }),
  f(RELATIV_M, [
    umbau("Die AUTORIN liest am Freitag in der Bücherei. Die Lesegruppe hat der Autorin einen Brief geschrieben.", [
      "Die Autorin, der die Lesegruppe einen Brief geschrieben hat, liest am Freitag in der Bücherei.",
      "Die Autorin, welcher die Lesegruppe einen Brief geschrieben hat, liest am Freitag in der Bücherei."])
  ], { hinweis: H_RELATIV_M }),
  m(FREMDWORT, [
    ["Im FOYER steht ein Regal mit Neuerscheinungen.", "Eingangshalle"],
    ["Die Leiterin PRÄSENTIERT die Pläne für den Umbau.", "vorstellen, zeigen"],
    ["Die Bücherei will ihr Angebot MODERNISIEREN.", "auf den neuesten Stand bringen"],
    ["Die LEKTÜRE für die Lesenacht suchen die Kinder selbst aus.", "Lesestoff"]], { points: 2, hinweis: H_FREMDWORT }),
  m(SPRACHE_M, [
    ["Die neue Manga-Ecke ist mega, da chillen wir jetzt jeden Freitag.", JUGEND],
    ["Die Stadt nennt es „Bestandspflege“ – 3000 alte Bücher kommen ins Altpapier.", EUPHEMISMUS],
    ["Die Medien werden per RFID-Chip am Selbstverbucher erfasst.", FACH],
    ["Für dieses Referat habe ich eine Million Bücher gewälzt.", HYPERBEL]], { points: 2, hinweis: H_SPRACHE_M }),
  a(AUFLOESEN + "„Das Lesecafé, das die Stadt, die jeden Euro zweimal umdrehen muss, eigentlich schließen wollte, bleibt nun doch geöffnet.“", [
    kr("mindestens zwei vollständige Sätze, kein Schachtelsatz mehr", 1, "Zwei oder drei Sätze, in denen kein Nebensatz mehr in einem anderen Nebensatz steckt."),
    kr("Inhalt vollständig", 1, "Alle drei Aussagen bleiben erhalten: (1) Die Stadt muss jeden Euro zweimal umdrehen (sie muss sparen). (2) Sie wollte das Lesecafé eigentlich schließen. (3) Das Lesecafé bleibt nun doch geöffnet. Fehlt eine Aussage oder ist eine verändert: 0 Punkte."),
    kr("sprachlich richtige Sätze", 1, "Die neuen Sätze sind grammatisch richtig und gut verständlich; die Bezüge stimmen (z. B. „sie“ für die Stadt, „es“ für das Lesecafé).")
  ], "Die Stadt muss jeden Euro zweimal umdrehen. Deshalb wollte sie das Lesecafé eigentlich schließen. Nun bleibt es aber doch geöffnet.",
  ["stadt", "schließen", "geöffnet|offen"], { hinweis: H_AUFLOESEN }),
  a("In einem Flyer der Stadtbücherei steht: „Wir stellen Sitzsäcke auf, um beim Lesen bequem zu liegen.“" + UM_ZU_FEHLER, [
    kr("Fehler erkannt", 1, "Der Satz klingt, als wollten die Mitarbeiter der Bücherei („wir“) selbst bequem liegen – gemeint sind aber die Leser."),
    kr("Regel genannt", 1, "„um … zu“ geht nur, wenn beide Teilsätze dasselbe Subjekt haben; hier sind es verschiedene (die Mitarbeiter – die Leser)."),
    kr("Satz verbessert", 1, "Mit „damit“ und eigenem Subjekt, z. B.: „Wir stellen Sitzsäcke auf, damit die Leser beim Lesen bequem liegen.“ (auch: „…, damit man beim Lesen bequem liegen kann.“)")
  ], "Bei „um … zu“ müssen beide Teilsätze dasselbe Subjekt haben. Hier klingt es, als wollten die Mitarbeiter selbst auf den Sitzsäcken liegen – gemeint sind aber die Besucher. Richtig: Wir stellen Sitzsäcke auf, damit die Leser beim Lesen bequem liegen.",
  ["subjekt|dieselbe|derselbe|gleiche|nicht die mitarbeiter|mitarbeiter selbst|verschiedene|nicht wir", SW_UM_ZU], { hinweis: H_UM_ZU_FEHLER }),
  a("In einer Online-Bewertung der Stadtbücherei steht: „Die Auswahl an Jugendbüchern ist winzig, an der Theke steht man stundenlang an, und die Computer stammen aus der Steinzeit.“" + HYPERBEL_OFFEN, [
    kr("Hyperbel genannt", 1, "„stundenlang“ oder „aus der Steinzeit“ (auch „winzig“ wird anerkannt)."),
    kr("Gemeintes erklärt", 1, "Passend zur gewählten Stelle: Man muss an der Theke eine Weile warten bzw. die Computer sind alt und langsam bzw. die Auswahl ist klein – aber nicht wirklich Stunden, Steinzeit oder winzig."),
    kr("Wirkung beschrieben", 1, "Die Übertreibung zeigt, wie unzufrieden die Person ist, macht die Kritik eindringlicher und soll andere Leser überzeugen – sachlich ist sie nicht.")
  ], "Eine Hyperbel ist „aus der Steinzeit“. In Wirklichkeit sind die Computer einfach alt und langsam. Die Person übertreibt, damit jeder merkt, wie unzufrieden sie ist – so klingt die Kritik viel schärfer als eine sachliche Beschreibung.",
  ["stundenlang|steinzeit|winzig", "lange|alt|veraltet|wenig|klein|langsam|weile", SW_WIRKUNG], { hinweis: H_HYPERBEL })
];

const ALLE = {
  kurz: "Grammatik und Sprache II", scope: "Satzreihe und Satzgefüge · Satzglieder und Finaladverbiale · Attribute · Sprache untersuchen", minutes: 40, texte: [],
  hinweis: "Arbeite allein. Lies jede Aufgabe genau: Dort steht, in welcher Form du antworten sollst. Wenn du ganze Sätze schreibst, zählen auch die Kommas. Deine Antworten werden laufend gespeichert. Nach der Abgabe kannst du nichts mehr ändern."
};
module.exports = {
  "d8-p7-r-a": probe(7, "R", "A", { ...ALLE, title: "Probe 7 (R8): Grammatik und Sprache II", items: R_A }),
  "d8-p7-r-b": probe(7, "R", "B", { ...ALLE, title: "Probe 7 (R8): Grammatik und Sprache II – Variante B", items: R_B }),
  "d8-p7-m-a": probe(7, "M", "A", { ...ALLE, title: "Probe 7 (M8): Grammatik und Sprache II", items: M_A }),
  "d8-p7-m-b": probe(7, "M", "B", { ...ALLE, title: "Probe 7 (M8): Grammatik und Sprache II – Variante B", items: M_B })
};
