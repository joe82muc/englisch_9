"use strict";

/**
 * Deutsch 8 · Probe 8: Rechtschreibung, Zeichensetzung, Textüberarbeitung (Nominalisierung und Großschreibung ·
 * Getrennt- und Zusammenschreibung · gleich klingende Wörter · Fremdwörter · Kommas bei Infinitivgruppe, Apposition,
 * indirekter Rede und Satzgefüge · weitere Satzzeichen, M8 auch Satzzeichen beim Zitat · einen Fehlertext überarbeiten ·
 * eine Schreibung erklären bzw. begründet entscheiden). LehrplanPLUS D8 4.3, 3.3. Keine Lesetexte, 40 Minuten.
 * R8: 30 Punkte, 9 Aufgaben · M8: 36 Punkte, 10 Aufgaben. Offene Punkte: R8 5 (17 %), M8 6 (17 %).
 *
 * Aufbau R8 (30): Groß/klein 3 · offen 2 · getrennt/zusammen 3 · gleich klingend 4 · Fremdwörter 3 · Kommas 3 ·
 *                 offen 3 · Satzzeichen zuordnen 3 · Fehlertext (6 Fehler) 6
 * Aufbau M8 (36): Groß/klein 4 · offen 3 · getrennt/zusammen 4 · gleich klingend 4 · Fremdwörter 3 · Kommas 4 ·
 *                 Zitat 1 · Satzzeichen zuordnen 3 · offen 3 · Fehlertext (7 Fehler) 7
 *
 * Wortfelder: Variante A „Wandertag“ · Variante B „Projektwoche“. Alle Sätze, Namen und Wörter sind für GRUMI erfunden.
 * Eindeutigkeit: Nur Schreibungen, die nach der amtlichen Regelung allein gelten (keine Wahlschreibungen wie
 * „kennenlernen / kennen lernen“, „mithilfe / mit Hilfe“), und nur Kommas, die Pflicht sind (Infinitivgruppen nur mit
 * um, ohne, statt, anstatt; vor „denn“; Nebensätze, Einschübe, indirekte Rede). Kein Komma vor „und“ zwischen Hauptsätzen.
 * Kennzeichen: rs = ein Wort richtig schreiben oder die Schreibung wählen · zs = Satzzeichen setzen oder wählen
 * (k(…) ist von selbst zs). Ohne Kennzeichen bleibt, was Regelwissen prüft (Begründungen, Zuordnung der Zeichen).
 * Innerhalb einer Fassung steht kein Wort, das ein Kind selbst richtig schreiben muss, an anderer Stelle richtig da.
 * Bleibt auf dem Server (Lösungen, Erwartungshorizont). Bausteine: bau.js.
 */
const { c, m, f, feld, k, a, kr, probe } = require("./bau");

/* ------------------------------ Schreibhilfen ------------------------------ */
const gross = (s) => s.charAt(0).toUpperCase() + s.slice(1);
// Groß-/Kleinschreibung zählt (groß/klein ist die Aufgabe oder ein Nomen)
const wort = (label, ...loesungen) => feld(label, loesungen, { genau: true, rs: true });
// Groß-/Kleinschreibung zählt nicht (kleingeschriebenes Wort, es geht um andere Stellen; Tablets setzen den ersten Buchstaben groß)
const wortKlein = (label, ...loesungen) => feld(label, loesungen, { rs: true });
// Fehlerwort aus dem Fehlertext (Reihenfolge egal); bei klein geschriebenen Lösungen gilt auch der große Anfangsbuchstabe
const fehler = (...loesungen) => feld("Wort", [...new Set(loesungen.concat(loesungen.filter((l) => l.charAt(0) !== gross(l).charAt(0)).map(gross)))], { genau: true, rs: true });

/* ------------------------------ Aufgabenstellungen ------------------------------ */
const GROSS_KLEIN = "Groß oder klein? Schreibe das Wort in GROSSBUCHSTABEN so in das Feld, wie es im Satz richtig geschrieben wird.";
const GETRENNT_R = "Getrennt oder zusammen? Entscheide, wie die beiden Wörter in der Klammer im Satz geschrieben werden. Ordne zu.";
const GETRENNT_M = "Getrennt oder zusammen, groß oder klein? Schreibe die beiden Wörter aus der Klammer so in das Feld, wie sie im Satz richtig geschrieben werden.";
const GLEICH = "Gleich klingende Wörter: Welches Wort passt in die Lücke? Schreibe nur dieses Wort in das Feld.";
const FREMD = "In jedem Fremdwort fehlt eine Stelle. Schreibe das ganze Wort richtig in das Feld.";
const KOMMA = "Setze die fehlenden Kommas.";
const ZEICHEN_R = "Welches Satzzeichen steht in dem Satz? Ordne zu.";
const ZEICHEN_M = "Welche Aufgabe hat das Satzzeichen in dem Satz? Ordne zu.";
const ZITAT = "Ein Mitschüler gibt eine wörtliche Rede wieder, der Begleitsatz steht hinten. Welche Schreibung ist richtig?";
const FEHLER = (zahl, mehr) => "Im Text sind " + zahl + " Wörter falsch geschrieben. Finde sie und schreibe jedes Wort richtig in ein Feld – nur das Wort" + mehr + ". Die Reihenfolge ist egal. Alle Kommas stehen schon richtig.";
const FEHLER_B = (zahl, mehr) => "Der folgende Text enthält " + zahl + " falsch geschriebene Wörter. Schreibe jedes dieser Wörter richtig in ein eigenes Feld – nur das Wort" + mehr + ". Auf die Reihenfolge kommt es nicht an. Alle Kommas sind schon richtig gesetzt.";
const OHNE_RS = " Die Rechtschreibung der Antwort zählt nicht.";

/* ------------------------------ „Dein nächster Schritt“ ------------------------------ */
const H_GROSS_R = "Prüfe bei jedem Wort, ob ein Signalwort davorsteht (Artikel, beim, zum, etwas, nichts, viel, wenig, alles) – ohne Signalwort bleibt ein Verb klein.";
const H_GROSS_M = "Suche vor jedem Wort ein Signalwort – auch wenn noch ein Adjektiv dazwischensteht – und denke an die Regel für Tageszeiten und Wochentage (heute Abend, aber montags).";
const H_GETRENNT_R = "Sprich die Wörter laut: Hörst du nur eine Hauptbetonung, schreibst du zusammen; hörst du zwei, schreibst du getrennt. Nomen und Verb werden getrennt geschrieben.";
const H_GETRENNT_M = "Prüfe die Wortart: Verb + Verb und Partizip + Verb werden getrennt geschrieben. Als Nomen (mit Artikel) wird eine Verbindung aus Nomen und Verb zusammen- und großgeschrieben.";
const H_GLEICH = "Mache bei „das“ oder „dass“ die Ersatzprobe mit „dieses“ oder „welches“. Bei den anderen Wörtern hilft die Bedeutung: Was soll der Satz sagen?";
const H_FREMD = "Wiederhole die typischen Bausteine von Fremdwörtern (-tion, -iv, -ell, -ieren, v) und schlage unsichere Wörter im Wörterbuch nach.";
const H_KOMMA_R = "Suche die Wortgruppe mit „zu“ und die Zusätze: Eine Infinitivgruppe mit um, ohne, statt wird abgetrennt, eine Apposition steht zwischen Kommas, und nach einem Redeverb steht ein Komma.";
const H_KOMMA_M = "Grenze die Teilsätze an den gebeugten Verben ab. Prüfe dann: Ist eine Infinitivgruppe mit um, ohne, statt oder anstatt dabei, ein Zusatz zum Nomen oder ein Nebensatz? Eingeschobenes bekommt zwei Kommas.";
const H_ZEICHEN = "Sieh dir an, wo das Zeichen steht: zwischen zwei Sätzen, mitten im Wort, vor einem Zusatz oder am Ende eines unvollständigen Satzes.";
const H_ZITAT = "Bei nachgestellten Begleitsätzen entfällt der Punkt am Ende der wörtlichen Rede, ein Komma steht nach dem Schlusszeichen. Fragezeichen und Ausrufezeichen blieben stehen.";
const H_FEHLER = "Lies den Text Wort für Wort und prüfe jedes unsichere Wort: Signalwort suchen, Ersatzprobe bei „das“, Wortart bestimmen, Fremdwort-Baustein prüfen.";
const H_GRUND = "Suche das Wort, das vor dem fraglichen Wort steht, und frage: Wird das Wort hier als Verb oder als Nomen gebraucht?";
const H_INFINITIV = "Sieh dir an, womit die Wortgruppe beginnt und wie das Verb am Ende aussieht. Nenne dann die Regel dazu.";

/* ------------------------------ Erwartungshorizont: Schreibung erklären (R8) ------------------------------ */
const GRUND_R = (signal, verb, verbKlein) => [
  kr("Großschreibung erklärt", 1, "„" + gross(signal) + " " + verb + "“: Das Verb wird hier wie ein Nomen gebraucht (Nominalisierung); davor steht das Signalwort „" + signal + "“, in dem ein Artikel steckt. Es genügt, das Signalwort oder den versteckten Artikel zu nennen." + OHNE_RS),
  kr("Kleinschreibung erklärt", 1, "„" + verbKlein + "“: Hier ist das Wort ein Verb – es sagt, was jemand tut – und es steht kein Signalwort davor. Ein richtiger Grund genügt." + OHNE_RS)
];
const KW_GRUND_R = ["signalwort|artikel|nomen|namenwort|hauptwort|nominalisier|begleiter", "verb|tunwort|tuwort|zeitwort|tätigkeit"];

/* ------------------------------ Erwartungshorizont: Infinitivgruppe erklären (R8) ------------------------------ */
const INFINITIV_R = (gruppe, beispiel) => [
  kr("Wortgruppe erkannt", 1, "„" + gruppe + "“ ist eine Infinitivgruppe (Verb im Infinitiv mit „zu“). Der Fachbegriff genügt oder die Beschreibung „Wortgruppe mit zu + Verb“." + OHNE_RS),
  kr("Regel genannt", 1, "Eine Infinitivgruppe, die mit „um“, „ohne“, „statt“ oder „anstatt“ beginnt, wird immer mit einem Komma abgetrennt. Es genügt, das Wort aus dem Satz als Auslöser zu nennen." + OHNE_RS),
  kr("Eigener Satz mit Komma", 1, "Ein vollständiger eigener Satz mit „um … zu“, in dem das Komma vor „um“ steht. Beispiel: " + beispiel, { zs: true })
];
const KW_INFINITIV = ["infinitiv|zu|wortgruppe|verb", "ohne|um|statt|anstatt", "immer|regel|stets|komma|abgetrennt"];

/* ------------------------------ Erwartungshorizont: begründet entscheiden (M8) ------------------------------ */
const ENTSCHEIDEN = (richtig, adjektiv, signal) => [
  kr("Richtige Schreibung gewählt", 1, "Gewählt ist a), die Schreibung mit großem Anfangsbuchstaben („" + richtig + "“). Es genügt, „a“ zu schreiben oder die Schreibung abzuschreiben." + OHNE_RS),
  kr("Nominalisierung erklärt", 1, "Das Adjektiv „" + adjektiv + "“ wird hier wie ein Nomen gebraucht (Nominalisierung / Substantivierung)." + OHNE_RS),
  kr("Signalwort genannt", 1, "Das Signalwort „" + signal + "“ steht davor. Den Punkt gibt es nur, wenn es genannt ist." + OHNE_RS)
];
const KW_ENTSCHEIDEN = (signal) => ["richtig|groß|großgeschrieben", "nomen|namenwort|hauptwort|nominalisier|substantiv", signal + "|signalwort"];

/* ------------------------------ Erwartungshorizont: Kommas begründen (M8) ------------------------------ */
const KOMMAS_M = (einschub, nomen, gruppe) => [
  kr("Zusatz erkannt", 1, "„" + einschub + "“ ist eine Apposition (ein nachgestellter Zusatz), die „" + nomen + "“ genauer beschreibt. Der Fachbegriff muss nicht fallen; ‚Einschub‘ oder ‚Zusatz‘ genügt." + OHNE_RS),
  kr("Zwei Kommas begründet", 1, "Ein Einschub wird vorn und hinten mit einem Komma abgetrennt, weil der Satz danach weitergeht." + OHNE_RS),
  kr("Infinitivgruppe erkannt", 1, "„" + gruppe + "“ ist eine Infinitivgruppe mit „zu“; weil sie mit „ohne“ bzw. „statt“ beginnt, steht davor immer ein Komma." + OHNE_RS)
];
const KW_KOMMAS_M = ["einschub|zusatz|apposition|beisatz|erläuter|näher|genauer", "vorn und hinten|vorne und hinten|beiden seiten|davor und dahinter|davor und danach|eingeschoben|abgetrennt|weitergeht", "infinitiv|zu|ohne|statt|anstatt|wortgruppe"];

/* ============================== R8, Variante A – Wandertag ============================== */
const FT_RA = "Am Mittwoch wanderte unsere Klasse zum Burgberg. Beim klettern über die Wurzeln half Tim den anderen. Mia erzählte, das sie noch nie so weit gelaufen sei. Zum Glück kam die Sonne wider hervor. Oben erwartete uns etwas besonderes: eine Burgruine mit Aussichtsturm. Im Naturschutzgebiet durften wir leider nicht radfahren. Die Kinder begannen sofort zu fotografiren.";

const R_A = [
  f(GROSS_KLEIN, [
    wort("Das SCHNAUFEN der Gruppe war weithin zu hören.", "Schnaufen"),
    wort("Der Förster zeigte uns viel INTERESSANTES über Fledermäuse.", "Interessantes"),
    wort("Im Naturschutzgebiet dürfen wir leider nicht ZELTEN.", "zelten")
  ], { hinweis: H_GROSS_R }),
  a("„Beim Rasten gibt es Tee, aber wir rasten nur zehn Minuten.“ Erkläre, warum „rasten“ in diesem Satz einmal groß- und einmal kleingeschrieben wird.",
    GRUND_R("beim", "Rasten", "wir rasten"),
    "„Beim Rasten“ wird großgeschrieben, weil „beim“ ein Signalwort ist (darin steckt der Artikel „dem“): Das Verb wird hier als Nomen gebraucht. In „wir rasten“ sagt das Wort, was wir tun; es ist ein Verb ohne Signalwort und bleibt klein.",
    KW_GRUND_R, { hilfe: "So kannst du beginnen: „Beim Rasten“ schreibt man groß, weil … In „wir rasten“ ist das Wort …", hinweis: H_GRUND }),
  m(GETRENNT_R, [
    ["Nach dem Mittagessen wollen wir am Ufer (MÜLL + SAMMELN).", "getrennt"],
    ["Mia und Tim wollen vor dem Abstieg noch einmal (HINAUF + STEIGEN).", "zusammen"],
    ["Auf der Hütte dürfen wir abends (KARTEN + SPIELEN).", "getrennt"],
    ["Bei Regen müssen alle schnell (ZURÜCK + LAUFEN).", "zusammen"]], { points: 3, rs: true, hinweis: H_GETRENNT_R }),
  f(GLEICH, [
    wortKlein("Ihr ___ heute früh am Bus gewesen. (seit oder seid)", "seid"),
    wortKlein("Es regnet ___ drei Stunden. (seit oder seid)", "seit"),
    wort("Ein Sandkorn klemmt unter Mias ___ . (Lid oder Lied)", "Lid"),
    wortKlein("Die Wespe auf dem Weg ist ___ . (tot oder Tod)", "tot")
  ], { hinweis: H_GLEICH }),
  f(FREMD, [
    wort("die Informa_ion am Parkplatz (t oder z?)", "Information", "die Information", "die Information am Parkplatz"),
    wortKlein("Die Klasse ist heute sehr akt_ (f oder v?)", "aktiv"),
    wort("die _itamine im Obst (V oder W?)", "Vitamine", "die Vitamine", "die Vitamine im Obst")
  ], { hinweis: H_FREMD }),
  k(KOMMA, [
    "Wir packen genug Wasser ein, um unterwegs nicht durstig zu werden.",
    "Herr Brandl, unser Klassenlehrer, führt die Gruppe an.",
    "Mia erzählt, sie habe den Gipfel schon einmal bestiegen."], { hinweis: H_KOMMA_R }),
  a("Mia fragt dich: „Warum steht in dem Satz ‚Tim geht los, ohne einen Pullover mitzunehmen.‘ ein Komma?“ Antworte Mia: Nenne die Wortgruppe, die das Komma auslöst, und die Regel dazu. Schreibe dann einen eigenen Satz mit „um … zu“ und setze das Komma richtig.",
    INFINITIV_R("ohne einen Pullover mitzunehmen", "Wir packen Brote ein, um unterwegs zu essen."),
    "Das Komma steht, weil „ohne einen Pullover mitzunehmen“ eine Infinitivgruppe ist (Infinitiv mit „zu“). Infinitivgruppen, die mit „um“, „ohne“, „statt“ oder „anstatt“ beginnen, trennt man immer durch ein Komma ab. Beispiel: Wir packen Brote ein, um unterwegs zu essen.",
    KW_INFINITIV, { hilfe: "So kannst du beginnen: Das Komma steht, weil die Wortgruppe … ist. Bei „ohne“, „um“, „statt“ gilt immer: …", hinweis: H_INFINITIV }),
  m(ZEICHEN_R, [
    ["Mia kocht den Tee; Jonas verteilt die Becher.", "Semikolon"],
    ["Die Gruppe wartet und wartet … dann kommt endlich der Bus.", "Auslassungspunkte"],
    ["Am Rastplatz stehen Tisch- und Bankgruppen für alle.", "Ergänzungsstrich"],
    ["Plötzlich stand er vor uns – ein Reh!", "Gedankenstrich"]], { points: 3, hinweis: H_ZEICHEN }),
  f(FEHLER("sechs", " (bei zwei zusammengehörenden Wörtern beide)"), [
    fehler("Klettern", "Beim Klettern"),
    fehler("dass"),
    fehler("wieder"),
    fehler("Besonderes", "etwas Besonderes"),
    fehler("Rad fahren", "nicht Rad fahren"),
    fehler("fotografieren", "zu fotografieren")
  ], { menge: true, vorgabe: FT_RA, hinweis: H_FEHLER })
];

/* ============================== R8, Variante B – Projektwoche ============================== */
const FT_RB = "Am Montag begann unsere Projektwoche im Werkraum. Beim zeichnen der Plakate hatte Ida die besten Ideen. Pavel erzählte, das er noch nie so viel gebastelt habe. Seid dem Morgen arbeiteten alle konzentriert. In der Pause konnte Jonas schon gut gitarrespielen. Am Nachmittag übten wir die Präsentazion vor der Klasse. Dabei fiel uns nichts neues auf.";

const R_B = [
  f(GROSS_KLEIN, [
    wort("Das HÄMMERN in der Werkstatt war den ganzen Vormittag zu hören.", "Hämmern"),
    wort("Die Gruppe hat beim Basteln viel NÜTZLICHES gelernt.", "Nützliches"),
    wort("Im Werkraum dürfen wir leider nicht LÖTEN.", "löten")
  ], { hinweis: H_GROSS_R }),
  a("„Beim Malen herrscht Ruhe, aber wir malen nur eine Stunde.“ Erkläre, warum „malen“ in diesem Satz einmal groß- und einmal kleingeschrieben wird.",
    GRUND_R("beim", "Malen", "wir malen"),
    "„Beim Malen“ wird großgeschrieben, weil „beim“ ein Signalwort ist (darin steckt der Artikel „dem“): Das Verb wird hier als Nomen gebraucht. In „wir malen“ sagt das Wort, was wir tun; es ist ein Verb ohne Signalwort und bleibt klein.",
    KW_GRUND_R, { hilfe: "So kannst du beginnen: „Beim Malen“ schreibt man groß, weil … In „wir malen“ ist das Wort …", hinweis: H_GRUND }),
  m(GETRENNT_R, [
    ["Für das Theaterstück wollen wir noch (KULISSEN + BAUEN).", "getrennt"],
    ["Am Freitag soll jede Gruppe ihre Ergebnisse (VOR + STELLEN).", "zusammen"],
    ["Zum Schluss wollen wir alle noch (FOTOS + MACHEN).", "getrennt"],
    ["Wer fertig ist, darf den Raum (AUF + RÄUMEN).", "zusammen"]], { points: 3, rs: true, hinweis: H_GETRENNT_R }),
  f(GLEICH, [
    wortKlein("Pavel hat den Pinsel ___ in die Farbe getaucht. (wieder oder wider)", "wieder"),
    wort("___ Erwarten war die Farbe schon trocken. (wieder oder wider)", "Wider"),
    wort("Zum Abschluss der Woche singt die Gruppe ein ___ . (Lid oder Lied)", "Lied"),
    wort("Pavel malt das ___ in vielen Blautönen. (mehr oder Meer)", "Meer")
  ], { hinweis: H_GLEICH }),
  f(FREMD, [
    wortKlein("Wir wollen die Aula dekor_ren (i oder ie?)", "dekorieren"),
    wortKlein("Das Plakat wirkt sehr kreat_ (f oder v?)", "kreativ"),
    wort("die _ase mit Blumen (V oder W?)", "Vase", "die Vase", "die Vase mit Blumen")
  ], { hinweis: H_FREMD }),
  k(KOMMA, [
    "Die Gruppe holt Holz aus dem Keller, um ein Vogelhaus zu bauen.",
    "Frau Dobler, unsere Kunstlehrerin, zeigt uns die Technik.",
    "Pavel sagt, er habe den Leim vergessen."], { hinweis: H_KOMMA_R }),
  a("Ida fragt dich: „Warum steht in dem Satz ‚Pavel arbeitet allein, statt dem Team zu helfen.‘ ein Komma?“ Antworte Ida: Nenne die Wortgruppe, die das Komma auslöst, und die Regel dazu. Schreibe dann einen eigenen Satz mit „um … zu“ und setze das Komma richtig.",
    INFINITIV_R("statt dem Team zu helfen", "Wir holen Leim, um die Teile zu kleben."),
    "Das Komma steht, weil „statt dem Team zu helfen“ eine Infinitivgruppe ist (Infinitiv mit „zu“). Infinitivgruppen, die mit „um“, „ohne“, „statt“ oder „anstatt“ beginnen, trennt man immer durch ein Komma ab. Beispiel: Wir holen Leim, um die Teile zu kleben.",
    KW_INFINITIV, { hilfe: "So kannst du beginnen: Das Komma steht, weil die Wortgruppe … ist. Bei „statt“, „um“, „ohne“ gilt immer: …", hinweis: H_INFINITIV }),
  m(ZEICHEN_R, [
    ["Ida malt das Plakat; Pavel schreibt den Text.", "Semikolon"],
    ["Die Ausstellung – das war Idas Idee – beginnt um zehn Uhr.", "Gedankenstrich"],
    ["Wir brauchen Papier- und Stoffreste für die Kostüme.", "Ergänzungsstrich"],
    ["Pavel überlegt: Wir könnten noch … ach, lassen wir das.", "Auslassungspunkte"]], { points: 3, hinweis: H_ZEICHEN }),
  f(FEHLER_B("sechs", ", bei zwei zusammengehörenden Wörtern beide"), [
    fehler("Zeichnen", "Beim Zeichnen"),
    fehler("dass"),
    fehler("Seit", "Seit dem Morgen"),
    fehler("Gitarre spielen", "gut Gitarre spielen"),
    fehler("Präsentation", "die Präsentation"),
    fehler("Neues", "nichts Neues")
  ], { menge: true, vorgabe: FT_RB, hinweis: H_FEHLER })
];

/* ============================== M8, Variante A – Wandertag ============================== */
const FT_MA = "Am Mittwoch brach unsere Klasse zu einer langen Wanderung auf. Beim rasten an der Quelle diskutirten alle über die weitere Route. Jonas zeigte viel Initiatife und schlug einen Umweg über den Grat vor. Seid dem Morgen hatten die Kräfte nachgelassen, denn der Aufstieg verlangte gute Konditzion. Nach der Pause ging es wider bergauf. Am Nachmittag wollten einige noch schwimmengehen.";

const M_A = [
  f(GROSS_KLEIN, [
    wort("Beim anstrengenden KLETTERN spürt man jeden Muskel.", "Klettern"),
    wort("Auf dem Gipfel erlebten wir nichts ALLTÄGLICHES.", "Alltägliches"),
    wort("Die Gruppe bricht MORGENS um sieben Uhr auf.", "morgens"),
    wort("Gestern ABEND war die Hütte schon voll.", "Abend")
  ], { hinweis: H_GROSS_M }),
  a("Welche Schreibung ist richtig? a) „Zum Abschluss gab es noch etwas Süßes.“ – b) „Zum Abschluss gab es noch etwas süßes.“ Entscheide dich und begründe deine Entscheidung in ein bis zwei Sätzen. Nenne dabei das Signalwort.",
    ENTSCHEIDEN("etwas Süßes", "süß", "etwas"),
    "a) ist richtig. „Süßes“ ist ein Adjektiv, das hier wie ein Nomen gebraucht wird (Nominalisierung). Das Signalwort „etwas“ steht davor, deshalb schreibt man es groß.",
    KW_ENTSCHEIDEN("etwas"), { hinweis: H_GRUND }),
  f(GETRENNT_M, [
    wortKlein("Nach dem Abstieg wollen wir noch (BADEN + GEHEN).", "baden gehen"),
    wortKlein("Plötzlich sahen wir einen Hund (GELAUFEN + KOMMEN).", "gelaufen kommen"),
    wort("Das (AUTO + FAHREN) ist im Naturpark verboten.", "Autofahren"),
    wort("Am Lagerfeuer wollen alle (KARTEN + SPIELEN).", "Karten spielen")
  ], { hinweis: H_GETRENNT_M }),
  f(GLEICH, [
    wortKlein("Der Förster betont, ___ der Pfad gesperrt ist. (das oder dass)", "dass"),
    wort("___ alle Vorhersagen blieb es den ganzen Tag trocken. (wieder oder wider)", "Wider"),
    wort("Zum Abschied singt die Gruppe ein ___ . (Lid oder Lied)", "Lied"),
    wortKlein("Vom Gipfel sieht man heute ___ als sonst. (mehr oder Meer)", "mehr")
  ], { hinweis: H_GLEICH }),
  f(FREMD, [
    wortKlein("Wir trainierten intens_ (f oder v?)", "intensiv"),
    wortKlein("Die Karte ist leider nicht mehr aktu_ (l oder ll?)", "aktuell"),
    wort("ein erloschener _ulkan (V oder W?)", "Vulkan", "ein Vulkan", "ein erloschener Vulkan")
  ], { hinweis: H_FREMD }),
  k(KOMMA, [
    "Statt den kürzeren Weg zu nehmen, wählte die Gruppe den Pfad am Bach.",
    "Wir besuchten die Burg Falkenstein, ein Wahrzeichen der Region, am Vormittag.",
    "Der Wirt versicherte uns, die Quelle führe auch im Sommer Wasser.",
    "Als wir den Gipfel erreichten, zog ein Gewitter auf, das schon lange drohte."], { hinweis: H_KOMMA_M }),
  c(ZITAT, [
    "„Wir machen gleich Pause an der Quelle“, schlug Tim vor.",
    "„Wir machen gleich Pause an der Quelle.“, schlug Tim vor.",
    "„Wir machen gleich Pause an der Quelle,“ schlug Tim vor.",
    "„Wir machen gleich Pause an der Quelle“. schlug Tim vor."], 0, { zs: true, hinweis: H_ZITAT }),
  m(ZEICHEN_M, [
    ["Der Gipfel schien nah; der Weg dorthin war aber noch lang.", "verbindet zwei eng zusammengehörende Hauptsätze"],
    ["Die Berg- und Talfahrt mit der Seilbahn dauert zusammen zwanzig Minuten.", "ersetzt den gemeinsamen Wortteil"],
    ["Der Aufstieg – das muss man sagen – war härter als gedacht.", "grenzt einen Einschub ab"],
    ["Dann wurde es still … und plötzlich dunkel.", "kennzeichnet eine Pause oder Auslassung"]], { points: 3, hinweis: H_ZEICHEN }),
  a("Erkläre, warum in diesem Satz drei Kommas stehen: „Der Wirt, ein alter Bergführer, wanderte los, ohne auf die Karte zu schauen.“ Benenne dazu die beiden Satzteile, die abgetrennt werden, und nenne jeweils die Regel.",
    KOMMAS_M("ein alter Bergführer", "der Wirt", "ohne auf die Karte zu schauen"),
    "„ein alter Bergführer“ ist ein Zusatz (eine Apposition) zu „der Wirt“. Ein solcher Einschub wird vorn und hinten mit einem Komma abgetrennt, weil der Satz danach weitergeht. „ohne auf die Karte zu schauen“ ist eine Infinitivgruppe mit „ohne … zu“; vor ihr steht immer ein Komma.",
    KW_KOMMAS_M, { hinweis: H_INFINITIV }),
  f(FEHLER("sieben", " (bei zwei zusammengehörenden Wörtern beide)"), [
    fehler("Rasten", "Beim Rasten"),
    fehler("diskutierten"),
    fehler("Initiative"),
    fehler("Seit", "Seit dem Morgen"),
    fehler("Kondition", "gute Kondition"),
    fehler("wieder"),
    fehler("schwimmen gehen")
  ], { menge: true, vorgabe: FT_MA, hinweis: H_FEHLER })
];

/* ============================== M8, Variante B – Projektwoche ============================== */
const FT_MB = "Gleich am Montag begann in unserer Schule die Projektwoche. Beim aufbauen der Bühne packten alle mit an. Danach improvisirten die Gruppen kleine Szenen. Ida summte dabei ein Lid vor sich hin. Seid dem Vormittag probten wir die Präsentazion für die Eltern. Das Team war bei vielen Aktifitäten gleichzeitig beschäftigt, denn der Zeitplan war eng. Nach der Probe wollten wir noch essengehen.";

const M_B = [
  f(GROSS_KLEIN, [
    wort("Beim sorgfältigen ZEICHNEN entstehen die schönsten Skizzen.", "Zeichnen"),
    wort("Auf der Messe entdeckten wir nichts UNBEKANNTES.", "Unbekanntes"),
    wort("Der Chor probt MONTAGS in der Aula.", "montags"),
    wort("Die Ergebnisse zeigen wir den Eltern heute ABEND.", "Abend")
  ], { hinweis: H_GROSS_M }),
  a("Welche Schreibung ist richtig? a) „Am Stand gab es viel Interessantes zu sehen.“ – b) „Am Stand gab es viel interessantes zu sehen.“ Entscheide dich und begründe deine Entscheidung in ein bis zwei Sätzen. Nenne dabei das Signalwort.",
    ENTSCHEIDEN("viel Interessantes", "interessant", "viel"),
    "a) ist richtig. „Interessantes“ ist ein Adjektiv, das hier wie ein Nomen gebraucht wird (Nominalisierung). Das Signalwort „viel“ steht davor, deshalb schreibt man es groß.",
    KW_ENTSCHEIDEN("viel"), { hinweis: H_GRUND }),
  f(GETRENNT_M, [
    wortKlein("Die Gruppe will in der Projektwoche (SINGEN + LERNEN).", "singen lernen"),
    wortKlein("Die Schule hat die Farbe für das Bühnenbild (GESCHENKT + BEKOMMEN).", "geschenkt bekommen"),
    wort("Das (KLAVIER + SPIELEN) macht Ida große Freude.", "Klavierspielen"),
    wort("Für die Ausstellung wollen alle (BILDER + MALEN).", "Bilder malen")
  ], { hinweis: H_GETRENNT_M }),
  f(GLEICH, [
    wortKlein("Ida behauptet, ___ der Raum schon frei ist. (das oder dass)", "dass"),
    wortKlein("Nach der Pause fängt die Gruppe ___ von vorn an. (wieder oder wider)", "wieder"),
    wortKlein("Für die Kulissen brauchen wir noch ___ Holz. (mehr oder Meer)", "mehr"),
    wortKlein("Der Schauspieler fällt auf der Bühne ___ um. (tot oder Tod)", "tot")
  ], { hinweis: H_GLEICH }),
  f(FREMD, [
    wortKlein("Das Team arbeitet erstaunlich effekt_ (f oder v?)", "effektiv"),
    wortKlein("Die Idee ist ganz individu_ (l oder ll?)", "individuell"),
    wort("das _ideo vom Abschlussfest (V oder W?)", "Video", "das Video", "das Video vom Abschlussfest")
  ], { hinweis: H_FREMD }),
  k(KOMMA, [
    "Anstatt allein zu arbeiten, bildeten die Schüler kleine Teams.",
    "Frau Koch, die Leiterin des Zirkusworkshops, lobte die Gruppe.",
    "Die Lehrerin erklärte, die Vorstellung finde am Freitag statt.",
    "Weil der Strom ausfiel, musste die Probe verschoben werden, die schon lange geplant war."], { hinweis: H_KOMMA_M }),
  c(ZITAT, [
    "„Wir zeigen unsere Ergebnisse am Freitag“, kündigte Ida an.",
    "„Wir zeigen unsere Ergebnisse am Freitag.“, kündigte Ida an.",
    "„Wir zeigen unsere Ergebnisse am Freitag,“ kündigte Ida an.",
    "„Wir zeigen unsere Ergebnisse am Freitag“. kündigte Ida an."], 0, { zs: true, hinweis: H_ZITAT }),
  m(ZEICHEN_M, [
    ["Der Chor probte im Saal; die Band baute die Bühne auf.", "verbindet zwei eng zusammengehörende Hauptsätze"],
    ["Die Eltern- und Lehrerführungen beginnen um zehn Uhr.", "ersetzt den gemeinsamen Wortteil"],
    ["Der Zirkus – so lautete das Motto der Woche – kam bei allen gut an.", "grenzt einen Einschub ab"],
    ["Ida zögerte: Eigentlich wollte sie … ach, egal.", "kennzeichnet eine Pause oder Auslassung"]], { points: 3, hinweis: H_ZEICHEN }),
  a("Erkläre, warum in diesem Satz drei Kommas stehen: „Die Zirkusleiterin, eine frühere Artistin, ging zur Bühne, statt im Saal zu warten.“ Benenne dazu die beiden Satzteile, die abgetrennt werden, und nenne jeweils die Regel.",
    KOMMAS_M("eine frühere Artistin", "die Zirkusleiterin", "statt im Saal zu warten"),
    "„eine frühere Artistin“ ist ein Zusatz (eine Apposition) zu „die Zirkusleiterin“. Ein solcher Einschub wird vorn und hinten mit einem Komma abgetrennt, weil der Satz danach weitergeht. „statt im Saal zu warten“ ist eine Infinitivgruppe mit „statt … zu“; vor ihr steht immer ein Komma.",
    KW_KOMMAS_M, { hinweis: H_INFINITIV }),
  f(FEHLER_B("sieben", ", bei zwei zusammengehörenden Wörtern beide"), [
    fehler("Aufbauen", "Beim Aufbauen"),
    fehler("improvisierten"),
    fehler("Lied", "ein Lied"),
    fehler("Seit", "Seit dem Vormittag"),
    fehler("Präsentation", "die Präsentation"),
    fehler("Aktivitäten", "bei vielen Aktivitäten"),
    fehler("essen gehen")
  ], { menge: true, vorgabe: FT_MB, hinweis: H_FEHLER })
];

const ALLE = { kurz: "Rechtschreibung", scope: "Groß und klein · getrennt und zusammen · gleich klingende Wörter · Fremdwörter · Kommas und weitere Satzzeichen · Text überarbeiten", minutes: 40,
  texte: [],
  hinweis: "Arbeite allein und lies jede Aufgabe genau. In dieser Probe kommt es auf die genaue Schreibweise an – bei vielen Feldern auch auf groß und klein. Prüfe deshalb jedes Feld, bevor du abgibst. Plane für den Fehlertext am Ende etwa 8 Minuten ein. Nach der Abgabe kannst du nichts mehr ändern." };
module.exports = {
  "d8-p8-r-a": probe(8, "R", "A", { ...ALLE, title: "Probe 8 (R8): Rechtschreibung, Zeichensetzung, Textüberarbeitung", items: R_A }),
  "d8-p8-r-b": probe(8, "R", "B", { ...ALLE, title: "Probe 8 (R8): Rechtschreibung, Zeichensetzung, Textüberarbeitung – Variante B", items: R_B }),
  "d8-p8-m-a": probe(8, "M", "A", { ...ALLE, title: "Probe 8 (M8): Rechtschreibung, Zeichensetzung, Textüberarbeitung", items: M_A }),
  "d8-p8-m-b": probe(8, "M", "B", { ...ALLE, title: "Probe 8 (M8): Rechtschreibung, Zeichensetzung, Textüberarbeitung – Variante B", items: M_B })
};
