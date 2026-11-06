"use strict";

/**
 * Deutsch 7 · Probe 9 (nur M7): Einen Aufruf schreiben – „Krötenzaun an der Waldstraße“
 * Wunsch der Lehrkraft (06.11.2026): „aufruf schreiben zu einem vorgegebenen text als infomaterial. die schüler sollen
 * keinen fließtext schreiben sondern den aufsatz schrittweise erarbeiten. mindestens 3 argumente mit b,b,b.
 * 2-fachwertung“ – zuerst als Papierprobe (OneDrive 7\Deutsch\Proben\Deutschprobe_M7_Aufruf_Kroetenzaun), danach
 * dieselbe Probe hier zum Freischalten mit KI-Vorkorrektur („nimm diese probe und lade sie in die grumi app“).
 *
 * Gleiche Aufgaben, Punkte und Lösungen wie auf Papier (40 Punkte, M-Schlüssel, zählt doppelt). Online anders:
 *   – Aufgabe 1a/1b sind zum Ankreuzen (auf Papier offen), 1c zum Zuordnen (gehört hinein / nicht hinein).
 *   – Jeder Teil des Aufrufs hat ein eigenes Feld (teile): Die Kinder schreiben keinen Fließtext. Abgegeben wird je
 *     Aufgabe ein Text mit dem Namen jedes Feldes vorn („Behauptung: …“) – so sehen KI und Lehrkraft die Teile.
 *   – Rechtschreibung und Zeichensetzung (2 Punkte, rs) bewertet die KI an den Argumenten (Aufgabe 8);
 *     auf Papier galten sie für die Aufgaben 3 bis 6. Mit Notenschutz fallen sie weg (38 Punkte).
 *   – Tims Entwurf: 7c ist zum Ankreuzen, 7d und 7e stehen in einer Aufgabe mit drei Feldern.
 * Nur für M7, nur Fassung A (keine Variante B, kein R7). Lehrplanbezug wie Probe 4 und die Module A11/A12: D7 3.2
 * (appellative Texte, Argumente mit Beispielen stützen), Aufruf nach dem Regelheft der Lehrkraft (Planen, Überschrift,
 * Einleitung, Hauptteil mit Informationen und Argumenten, Schluss mit Aufforderungssätzen, Appell, Gruß).
 * Alle Texte eigenständig für GRUMI erstellt; Ort, Personen und Zahlen sind erfunden, die Sachinformationen zur
 * Krötenwanderung stimmen. Kein Text, Name oder Beispielsatz steht in einem Lernmodul.
 * Bleibt auf dem Server (Lösungen). Bausteine: bau.js.
 */
const { c, m, a, kr, s, text, tabelle, probe } = require("./bau");

/* ------------------------------ Material ------------------------------ */
const ARTIKEL = text("t1", "Krötenzaun an der Waldstraße: Naturschützer suchen Helfer", "Zeitungsartikel", [
  "Jedes Frühjahr wandern Hunderte Kröten zum Mühlweiher. Ohne Hilfe würden viele von ihnen auf der Straße sterben. Doch der Naturschutzgruppe gehen die Helfer aus.",
  "Wenn es im März abends regnet und es draußen wärmer als fünf Grad ist, beginnt am Ortsrand eine besondere Reise: Hunderte Erdkröten machen sich auf den Weg. Den Winter haben sie im Wald verbracht, versteckt unter Laub und in Erdlöchern. Jetzt wandern sie zum Mühlweiher. Dort sind sie selbst einmal aus dem Ei geschlüpft, und dort legen die Weibchen nun ihren Laich ab: lange Schnüre mit mehreren tausend Eiern. Viele Männchen machen es sich dabei bequem. Sie klammern sich auf dem Rücken eines Weibchens fest und lassen sich tragen.",
  "# Ein gefährlicher Weg",
  "Doch zwischen dem Wald und dem Weiher liegt die Waldstraße. Die Kröten sind nachts unterwegs und kommen nur langsam voran. Nähert sich ein Auto, bleiben sie im Scheinwerferlicht oft einfach sitzen. Früher wurden hier jedes Frühjahr Hunderte Kröten überfahren. Schon der starke Luftzug eines schnellen Autos kann eine Kröte schwer verletzen.",
  "# So funktioniert der Krötenzaun",
  "Deshalb stellt die Naturschutzgruppe seit zwölf Jahren einen Krötenzaun auf. Er ist etwa 40 Zentimeter hoch und 400 Meter lang. Die Kröten kommen nicht darüber. Sie laufen am Zaun entlang und fallen in Eimer, die im Boden eingegraben sind. Jeden Morgen und jeden Abend leeren Helferinnen und Helfer die Eimer. Sie zählen die Tiere, tragen die Zahl in eine Liste ein und bringen die Kröten sicher über die Straße zum Weiher. Im letzten Frühjahr retteten sie so 1.870 Kröten, Frösche und Molche.",
  "# Helfer gesucht",
  "„Leider werden wir immer weniger“, sagt Gisela Berger, die die Aktion leitet. „Wir sind nur noch neun Leute, und die meisten sind über 65 Jahre alt.“ Deshalb hofft sie auf Jugendliche. Schon eine Stunde pro Woche ist eine große Hilfe. Wer jünger als 14 Jahre ist, darf nur zusammen mit einem Erwachsenen mitmachen und braucht die Erlaubnis seiner Eltern. Wichtig sind eine Warnweste, eine Taschenlampe und feste Schuhe. Wer mindestens fünfmal mithilft, bekommt eine Urkunde für sein ehrenamtliches Engagement. „Die macht sich auch in einer Bewerbung gut“, sagt Gisela Berger.",
  "Lea (13) war im letzten Frühjahr mit ihrem Vater dabei. „Nachts mit der Stirnlampe an der Straße zu stehen und eine Kröte in der Hand zu halten, war richtig spannend“, erzählt sie. „Und jetzt weiß ich, wie man Kröten und Frösche unterscheidet.“",
  "Kröten sind übrigens sehr nützlich: Sie fressen Schnecken, Würmer und Insekten. Wie alle Frösche und Kröten in Deutschland stehen sie unter Naturschutz."
]);
const INFOKASTEN = tabelle("t2", "Mitmachen beim Krötenzaun", ["Was?", "Wann und wo?"], [
  ["Infotreffen", "Mittwoch, 24. Februar, 17 Uhr, Feuerwehrhaus"],
  ["Zaun aufbauen", "Samstag, 27. Februar, 9 Uhr, Parkplatz an der Waldstraße"],
  ["Einsätze", "Anfang März bis Mitte April, morgens um 7 Uhr oder abends um 19 Uhr"],
  ["Anmeldung", "Anmeldezettel bis Freitag, 19. Februar, im Sekretariat der Schule abgeben"]
], { art: "Infokasten zum Artikel" });
const WOERTER = tabelle("t3", "Worterklärungen zum Krötenzaun", ["Wort", "Bedeutung"], [
  ["der Laich", "die Eier von Kröten und Fröschen"],
  ["der Weiher", "ein kleiner, flacher See"],
  ["der Molch", "kleines Tier mit Schwanz, lebt im und am Wasser"],
  ["ehrenamtlich", "freiwillig und ohne Bezahlung"],
  ["das Engagement", "der Einsatz für eine gute Sache"],
  ["die Urkunde", "ein Schreiben, das etwas offiziell bestätigt"]
], { art: "Worterklärungen" });

// Angaben des Infokastens für den Erwartungshorizont (die KI bekommt je Aufgabe nur einen Text als Ausschnitt)
const INFO = "Infokasten: Infotreffen Mittwoch, 24. Februar, 17 Uhr, Feuerwehrhaus · Zaun aufbauen Samstag, 27. Februar, 9 Uhr, Parkplatz an der Waldstraße · Einsätze Anfang März bis Mitte April, morgens 7 Uhr oder abends 19 Uhr · Anmeldung: Anmeldezettel bis Freitag, 19. Februar, im Sekretariat abgeben";

/* ------------------------------ Aufgaben ------------------------------ */
const TEIL_A = "Teil A: Planen", TEIL_B = "Teil B: Den Aufruf Schritt für Schritt schreiben", TEIL_C = "Teil C: Überarbeiten";
const HINEIN = "gehört in einen Aufruf", NICHT = "gehört nicht in einen Aufruf";
const TIM = "Tim aus der Redaktion der Schülerzeitung hat diese Sätze für den Aufruf geschrieben:\n" +
  "① „Ihr solltet unbedingt beim Krötenzaun mitmachen, weil das richtig Spaß macht.“\n" +
  "② „Wer nicht mitmacht, ist ein Tierquäler!“\n" +
  "③ „Ihr könnt euch bis Freitag, 19. Februar, im Sekretariat anmelden.“\n" +
  "④ „Es wäre schön, wenn ihr eine Taschenlampe mitbringt.“";

// Ein Argument in drei Feldern (Behauptung, Begründung, Beispiel); Argument 4 ist freiwillig
const argumentFelder = (n, frei) => [
  { gruppe: "Argument " + n, label: "Behauptung", hilfe: "Was meine ich?", ...(frei ? { frei: true, zusatz: "freiwillig – wenn du es schreibst, zählen die drei besten Argumente" } : {}) },
  { gruppe: "Argument " + n, label: "Begründung", hilfe: "weil, denn, da …", ...(frei ? { frei: true } : {}) },
  { gruppe: "Argument " + n, label: "Beispiel", hilfe: "zum Beispiel …", ...(frei ? { frei: true } : {}) }
];
const ARGUMENT = (welches) => "Bewertet wird das " + welches + " der Argumente, die das Kind geschrieben hat (Argument 4 ist freiwillig; es zählen die drei besten, ein schwächeres fällt weg). " +
  "Je 1 Punkt: Behauptung – eine klare Aussage, warum man beim Krötenzaun mitmachen sollte · Begründung – ein Grund, der zur Behauptung passt (meist mit weil, denn oder da) · " +
  "Beispiel – ein konkreter Fall, der die Begründung zeigt, gern mit Angaben aus dem Artikel (1.870 gerettete Tiere, nur neun Helfer, Lea (13), Urkunde nach fünf Einsätzen …). " +
  "Steht ein Baustein im falschen Feld, zählt er trotzdem. Ein Argument, das inhaltlich schon gezählt wurde, zählt nicht noch einmal. Eine Beschimpfung der Leser ist kein Argument. " +
  "Mögliche Argumente: Tiere retten (ohne Zaun werden sie überfahren) · junge Helfer werden dringend gebraucht (nur noch neun, meist über 65) · ein echtes Erlebnis in der Natur · " +
  "Urkunde für die Bewerbung · Kröten sind nützlich (fressen Schnecken, Würmer, Insekten) · man lernt viel über Tiere (Kröten und Frösche unterscheiden).";

const M_A = [
  // ---------- Teil A: Planen ----------
  c("Kläre zuerst die Schreibaufgabe: Für wen schreibst du deinen Aufruf?", [
    "für meine Mitschülerinnen und Mitschüler, die die Schülerzeitung lesen",
    "für Gisela Berger und die Naturschutzgruppe",
    "für die Autofahrerinnen und Autofahrer auf der Waldstraße",
    "für die Lehrerinnen und Lehrer der Schule"], 0,
    { teil: TEIL_A, hinweis: "Lies die Schreibaufgabe oben noch einmal: Wo erscheint dein Aufruf, und wer liest ihn dort?" }),
  c("Was sollen deine Leserinnen und Leser tun, nachdem sie deinen Aufruf gelesen haben?", [
    "beim Krötenzaun mithelfen und sich dafür anmelden",
    "der Naturschutzgruppe Geld für einen neuen Zaun spenden",
    "einen Leserbrief an die Zeitung schreiben",
    "auf der Waldstraße langsamer fahren"], 0,
    { hinweis: "Ein Aufruf will, dass die Leser etwas tun. Lies nach, was die Naturschutzgruppe im Artikel sucht." }),
  m("Was gehört in einen Aufruf? Ordne jede Aussage zu.", [
    ["Informationen zum Thema", HINEIN],
    ["eine spannende, erfundene Geschichte", NICHT],
    ["Argumente mit Behauptung, Begründung und Beispiel", HINEIN],
    ["Sätze, die die Leser beschimpfen, wenn sie nicht mitmachen", NICHT],
    ["die direkte Anrede der Leser (ihr, euch)", HINEIN],
    ["Aufforderungssätze am Schluss", HINEIN]],
    { points: 2, hinweis: "Ein Aufruf informiert, überzeugt mit Argumenten und fordert freundlich zum Mitmachen auf. Was passt nicht dazu?" }),
  a("Sammle Informationen aus dem Zeitungsartikel. Schreibe vier Sachinformationen auf: Was erfährst du über die Kröten und ihr Problem? Stichworte genügen.",
    [kr("vier passende Sachinformationen", 4, "Je richtige, verschiedene Sachinformation aus dem Artikel 1 Punkt, höchstens 4. Richtig sind zum Beispiel: Kröten wandern im Frühjahr (März, nachts, ab etwa fünf Grad, wenn es regnet) vom Wald zum Mühlweiher, um dort ihre Eier (Laich) abzulegen · sie müssen dabei die Waldstraße überqueren · früher wurden jedes Frühjahr Hunderte Kröten überfahren · sie bleiben im Scheinwerferlicht sitzen, schon der Luftzug eines Autos kann sie verletzen · der Zaun ist 40 Zentimeter hoch und 400 Meter lang, die Kröten fallen in Eimer · im letzten Frühjahr wurden 1.870 Kröten, Frösche und Molche gerettet · es gibt nur noch neun Helfer, die meisten über 65 Jahre alt · Kröten sind nützlich (fressen Schnecken, Würmer, Insekten) und stehen unter Naturschutz · die Weibchen legen mehrere tausend Eier, die Männchen lassen sich tragen. Dieselbe Information zweimal zählt nur einmal. Was Helfer tun sollen (z. B. Eimer leeren, sich anmelden), ist eine Verhaltensweise und zählt hier nicht. Stichworte genügen.")],
    "Kröten wandern im März nachts vom Wald zum Mühlweiher und legen dort ihren Laich ab. · Sie müssen über die Waldstraße. · Früher wurden jedes Jahr Hunderte überfahren. · Im letzten Frühjahr wurden 1.870 Tiere gerettet.",
    ["weiher|laich|eier|wander", "straße|auto|überfahr|scheinwerfer", "1.870|1870|gerettet|zaun", "neun|65|nützlich|naturschutz|schnecken"],
    { text: "t1", teile: ["1.", "2.", "3.", "4."] }),
  a("Schreibe vier Verhaltensweisen aus dem Material auf: Was können Helferinnen und Helfer tun? Stichworte genügen.",
    [kr("vier passende Verhaltensweisen", 4, "Je richtige, verschiedene Verhaltensweise aus Artikel oder Infokasten 1 Punkt, höchstens 4. Richtig sind zum Beispiel: beim Aufbau des Zauns helfen (Samstag, 27. Februar) · morgens oder abends die Eimer kontrollieren und leeren · die Tiere zählen und in eine Liste eintragen · die Kröten über die Straße zum Weiher tragen · zum Infotreffen kommen · sich bis 19. Februar im Sekretariat anmelden · eine Stunde pro Woche mithelfen · mit einem Erwachsenen kommen und die Eltern um Erlaubnis fragen (unter 14) · Warnweste, Taschenlampe und feste Schuhe mitbringen. " + INFO + ". Dieselbe Verhaltensweise zweimal zählt nur einmal. Eine Sachinformation über die Kröten (z. B. sie wandern zum Weiher) zählt hier nicht. Stichworte genügen.")],
    "Eimer morgens oder abends leeren · Kröten über die Straße zum Weiher tragen · zum Infotreffen kommen und sich bis 19. Februar anmelden · Warnweste, Taschenlampe und feste Schuhe mitbringen.",
    ["eimer|zaun|aufbau|aufbauen", "tragen|zählen|liste", "anmeld|sekretariat|infotreffen", "warnweste|taschenlampe|schuhe|erwachsen|eltern"],
    { text: "t1", teile: ["1.", "2.", "3.", "4."] }),

  // ---------- Teil B: Schritt für Schritt schreiben ----------
  a("Die Überschrift: Formuliere eine Überschrift, die zum Thema passt und neugierig macht. Schreib nicht die Überschrift des Zeitungsartikels ab.",
    [kr("passt zum Thema", 1, "Es geht erkennbar um Kröten, den Krötenzaun oder das Helfen."),
      kr("macht neugierig", 1, "Eine Frage, ein Ausruf, ein Wortspiel oder eine überraschende Aussage, die zum Lesen einlädt, z. B. „Kröten in Not – wer hilft?“, „Krötenretter gesucht – bist du dabei?“, „Ein Herz für Kröten!“. 0 Punkte: die Überschrift des Artikels abgeschrieben („Krötenzaun an der Waldstraße: Naturschützer suchen Helfer“) oder nur ein einzelnes sachliches Wort wie „Krötenzaun“.")],
    "Krötenretter gesucht – bist du dabei?",
    ["kröte|krötenzaun|frosch|tier"],
    { teil: TEIL_B, teile: ["Überschrift"] }),
  a("Die Einleitung: Schreibe die Anrede und zwei bis drei Sätze, die deine Leser neugierig machen und zum Thema hinführen.",
    [kr("Anrede", 1, "Die Leser werden direkt angesprochen, z. B. „Liebe Mitschülerinnen und Mitschüler,“ oder „Hallo zusammen,“."),
      kr("weckt Interesse", 1, "Eine Frage an die Leser oder eine überraschende Information aus dem Material, z. B. „Wusstet ihr, dass jedes Frühjahr Hunderte Kröten nachts über die Waldstraße wandern?“"),
      kr("führt zum Thema hin", 1, "Es wird klar, worum es geht: Die Kröten brauchen Hilfe, für den Krötenzaun werden Helfer gesucht. Argumente und Aufforderungen sind hier noch nicht nötig.")],
    "Liebe Mitschülerinnen und Mitschüler, wusstet ihr, dass jedes Frühjahr Hunderte Kröten nachts über die Waldstraße wandern? Ohne Hilfe würden viele von ihnen überfahren. Genau dafür brauchen wir euch!",
    ["liebe|hallo", "wusstet|wisst|stellt euch|habt ihr", "kröte|krötenzaun|helfer|hilfe"],
    { text: "t1", teile: ["Anrede", "Einleitung (zwei bis drei Sätze)"] }),
  s("Der Hauptteil: Warum lohnt es sich, beim Krötenzaun mitzumachen? Schreibe mindestens drei vollständige Argumente. Jedes Argument hat eine Behauptung, eine Begründung und ein Beispiel – jeder Baustein kommt in sein eigenes Feld. Schreibe ganze Sätze und nutze Informationen aus dem Material. Beginne Argument 2 und 3 mit einem Verknüpfungswort (z. B. außerdem, zudem, ein weiterer Grund …).",
    [kr("erstes Argument: Behauptung, Begründung, Beispiel", 3, ARGUMENT("beste")),
      kr("zweites Argument: Behauptung, Begründung, Beispiel", 3, ARGUMENT("zweitbeste")),
      kr("drittes Argument: Behauptung, Begründung, Beispiel", 3, ARGUMENT("drittbeste")),
      kr("Verknüpfungswörter", 1, "1 Punkt: Argument 2 und Argument 3 beginnen mit einem Verknüpfungswort oder einer Überleitung (außerdem, zudem, auch, darüber hinaus, ein weiterer Grund, ein weiteres Argument …). Fehlt es bei einem der beiden, 0 Punkte."),
      kr("Sprachrichtigkeit", 2, "Rechtschreibung und Zeichensetzung in den Argumenten: höchstens 3 Fehler 2 Punkte, 4 bis 7 Fehler 1 Punkt, ab 8 Fehlern 0 Punkte. Derselbe Fehler mehrmals zählt einmal.", { rs: true })],
    { text: "t1", teile: argumentFelder(1).concat(argumentFelder(2), argumentFelder(3), argumentFelder(4, true)),
      expected: "Argument 1 – Behauptung: Wenn ihr mithelft, rettet ihr vielen Tieren das Leben. Begründung: Denn ohne Zaun werden die Kröten auf der Waldstraße überfahren. Beispiel: Im letzten Frühjahr wurden zum Beispiel 1.870 Kröten, Frösche und Molche sicher über die Straße getragen. " +
        "Argument 2 – Behauptung: Außerdem werden junge Helfer dringend gebraucht, Begründung: weil die Gruppe nur noch aus neun Leuten besteht, die meisten über 65. Beispiel: Wenn zum Beispiel zehn von uns nur eine Stunde pro Woche helfen, sind die Eimer jeden Morgen geleert. " +
        "Argument 3 – Behauptung: Zudem ist die Arbeit am Krötenzaun ein echtes Erlebnis, Begründung: denn man ist nachts draußen und hält wilde Tiere in der Hand. Beispiel: Lea (13) erzählt zum Beispiel, dass es richtig spannend war, mit der Stirnlampe an der Straße zu stehen." }),
  a("Der Schluss: Schreibe drei Aufforderungssätze, die genau sagen, was deine Leser tun sollen – nutze dafür die Angaben im Infokasten. Schreibe dann einen kräftigen Appell (einen letzten Satz, der zum Mitmachen mitreißt) und einen Gruß mit Absender. Unterschreibe nicht mit deinem echten Namen, sondern zum Beispiel mit „Eure Schülerzeitung“.",
    [kr("drei Aufforderungssätze", 3, "Je 1 Punkt (höchstens 3) für einen Aufforderungssatz – das Verb in der Befehlsform steht vorn, z. B. „Kommt …!“, „Meldet euch …!“, „Bringt … mit!“, „Helft …!“ –, der genau sagt, was die Leser tun sollen, möglichst mit Angaben aus dem Infokasten. " + INFO + ". Ein Satz wie „Ihr könnt euch anmelden.“ ist noch keine Aufforderung (0 Punkte). Fehlt bei einer echten Aufforderung nur das Ausrufezeichen, gibt es den Punkt trotzdem (die Lehrkraft kann halbe Punkte geben)."),
      kr("Appell", 1, "Ein kurzer, mitreißender Satz, der zum Mitmachen auffordert, z. B. „Jede gerettete Kröte zählt – macht mit!“ oder „Werdet Krötenretter!“"),
      kr("Gruß mit Absender", 1, "Ein Gruß und wer den Aufruf geschrieben hat, z. B. „Eure Redaktion der Schülerzeitung“ oder „Viele Grüße, eure 7b“. Ein Vorname oder die Klasse genügt.")],
    "Kommt am Mittwoch, 24. Februar, um 17 Uhr zum Infotreffen ins Feuerwehrhaus! · Meldet euch bis Freitag, 19. Februar, im Sekretariat an! · Bringt eine Warnweste und eine Taschenlampe mit! · Jede gerettete Kröte zählt – macht mit! · Eure Redaktion der Schülerzeitung",
    ["kommt|meldet|bringt|helft|fragt", "infotreffen|sekretariat|feuerwehrhaus|februar", "macht mit|mitmachen|dabei|zählt", "eure|euer|redaktion|grüße"],
    { text: "t2", teile: ["1. Aufforderung", "2. Aufforderung", "3. Aufforderung", "Appell", "Gruß"] }),

  // ---------- Teil C: Überarbeiten ----------
  c("Satz ① ist noch kein vollständiges Argument. Welcher Baustein fehlt?", [
    "das Beispiel", "die Behauptung", "die Begründung", "die Anrede"], 0,
    { teil: TEIL_C, vorgabe: TIM, hinweis: "Suche in Satz ① die drei Bausteine: Was meint Tim? Warum? Und welcher Fall zeigt es?" }),
  a("Ergänze zu Satz ① den Baustein, der fehlt. Schreibe einen ganzen Satz.",
    [kr("passender Baustein ergänzt", 1, "Ein konkretes Beispiel, das zeigt, dass die Arbeit am Krötenzaun Spaß macht oder spannend ist, z. B. „Lea hat zum Beispiel erzählt, dass es richtig spannend war, nachts mit der Stirnlampe an der Straße zu stehen.“ oder ein eigenes, passendes Erlebnis. 0 Punkte: nur eine weitere Begründung oder Behauptung ohne konkreten Fall.")],
    "Lea hat zum Beispiel erzählt, dass es richtig spannend war, nachts mit der Stirnlampe an der Straße zu stehen.",
    ["zum beispiel|beispiel|lea", "nachts|stirnlampe|spannend|hand"],
    { vorgabe: TIM, text: "t1", teile: ["Dein Satz zu Satz ①"] }),
  c("Warum gehört Satz ② nicht in einen Aufruf?", [
    "Er beschimpft die Leser – so überzeugt man niemanden.",
    "Er ist zu kurz für einen Aufruf.",
    "Er nennt kein Datum und keinen Ort.",
    "Er endet mit einem Ausrufezeichen."], 0,
    { vorgabe: TIM, hinweis: "Stell dir vor, du liest Satz ②. Wie fühlst du dich – und hast du danach Lust mitzumachen?" }),
  a("Verbessere Tims Sätze: Schreibe Satz ② sachlich und freundlich neu. Forme dann die Sätze ③ und ④ in Aufforderungssätze um.",
    [kr("Satz ② sachlich und freundlich", 1, "Ohne Beschimpfung, freundlich und werbend, z. B. „Jeder, der mitmacht, hilft den Tieren ganz direkt.“ oder „Wir freuen uns über jeden, der mithilft.“"),
      kr("Satz ③ als Aufforderungssatz", 1, "Das Verb in der Befehlsform steht vorn, der Inhalt bleibt: „Meldet euch bis Freitag, 19. Februar, im Sekretariat an!“ Fehlt nur das Ausrufezeichen, gibt es den Punkt trotzdem (die Lehrkraft kann halbe Punkte geben)."),
      kr("Satz ④ als Aufforderungssatz", 1, "Das Verb in der Befehlsform steht vorn, der Inhalt bleibt: „Bringt eine Taschenlampe mit!“ Fehlt nur das Ausrufezeichen, gibt es den Punkt trotzdem (die Lehrkraft kann halbe Punkte geben).")],
    "Satz ②: Jeder, der mitmacht, hilft den Tieren ganz direkt. · Satz ③: Meldet euch bis Freitag, 19. Februar, im Sekretariat an! · Satz ④: Bringt eine Taschenlampe mit!",
    ["hilft|freuen|jeder|danke", "meldet euch", "bringt"],
    { vorgabe: TIM, teile: ["Satz ② neu", "Satz ③ als Aufforderung", "Satz ④ als Aufforderung"] })
];

module.exports = {
  "d7-p9-m-a": probe(9, "M", "A", {
    title: "Probe 9 (M7): Einen Aufruf schreiben (zählt doppelt)",
    kurz: "Aufruf",
    scope: "Einen Aufruf schreiben · Schritt für Schritt · zählt doppelt",
    minutes: 45,
    hinweis: "Diese Probe zählt doppelt. Deine Schreibaufgabe: Eure Schülerzeitung möchte die Naturschutzgruppe unterstützen. Du schreibst dafür einen Aufruf. Darin forderst du deine Mitschülerinnen und Mitschüler auf, beim Krötenzaun mitzuhelfen. Lies zuerst den Zeitungsartikel mit dem Infokasten (Knopf „📖 Text lesen“). Du schreibst keinen zusammenhängenden Aufsatz: Du erarbeitest deinen Aufruf Schritt für Schritt, jeder Teil kommt in sein eigenes Feld. Arbeite allein. Nach der Abgabe kannst du nichts mehr ändern.",
    texte: [ARTIKEL, INFOKASTEN, WOERTER],
    items: M_A
  })
};
