"use strict";

/**
 * Deutsch 7 · Probe 7: Grammatik II (Konjunktiv I und indirekte Rede, M7 zusätzlich Konjunktiv II · Satzglieder mit
 * Umstellprobe und Adverbiale des Grundes · Satzreihe und Satzgefüge mit Kommas · Subjekt- und Objektsatz, M7 auch
 * Kausal-, Temporal- und Konditionalsatz). LehrplanPLUS D7 4.2.
 * R7: 30 Punkte · M7: 34 Punkte · 40 Minuten. Keine Lesetexte. Offene Punkte: R7 5 (17 %), M7 6 (18 %).
 * R7 bildet drei Konjunktiv-I-Formen, M7 vier Formen (je zwei im Konjunktiv I und II); die Umstellprobe zählt 1 Punkt.
 * M7: Konjunktiv II als Ersatzform steht nicht im Lernmodul gr_04 – die Aufgabenstellung sagt deshalb, was zu tun ist.
 * Jede Fassung hat ihr eigenes Wortfeld, aus dem alle Beispielsätze stammen:
 * R7 A Schulküche · R7 B Wandertag · M7 A Schülerzeitung · M7 B Theater-AG. Kein Satz steht in einem Lernmodul.
 * Innerhalb einer Fassung kommt keine Konjunktion und keine Verbform, die ein Kind selbst finden muss, in einer
 * anderen Aufgabe als Muster vor (deshalb z. B. kein „weil“-Satz außerhalb der Aufgabe „Sätze verbinden“).
 * Bleibt auf dem Server (Lösungen). Bausteine: bau.js.
 */
const { c, m, f, feld, k, a, kr, probe } = require("./bau");

/* ------------------------------ Schreibhilfen ------------------------------ */
const gross = (s) => s.charAt(0).toUpperCase() + s.slice(1);
// Verbform: mit und ohne Subjekt
const form = (label, ...loesungen) => feld(label, loesungen);
// Lücke im Satz: Es zählt die Verbform allein – oder der ganze Satz mit der Verbform.
const luecke = (satz, angabe, ...formen) => feld(satz + " (" + angabe + ")", formen.concat(formen.map((x) => satz.replace("___", x))));
// Satzumbau: ganzer Satz, 2 Punkte, alle vertretbaren Fassungen
const umbau = (satz, loesungen) => feld(satz, loesungen, { breit: true, punkte: 2 });
// Indirekte Rede ohne „dass“ (Verb an zweiter Stelle) und mit „dass“ (Verb am Ende)
// rede("Hanna sagt: „Ich bin müde.“", "Hanna sagt", "sie sei müde", "sie müde sei")
const rede = (direkt, einleitung, ohneDass, mitDass) => umbau(direkt, [].concat(ohneDass).map((s) => `${einleitung}, ${s}.`).concat([].concat(mitDass).map((s) => `${einleitung}, dass ${s}.`)));
// Satzgefüge in beiden Reihenfolgen und mit jeder passenden Konjunktion:
// gefuege("Die Soße schmeckt fad", "schmeckt die Soße fad", "das Salz fehlt", ["weil", "da"])
const gefuege = (hauptsatz, hauptsatzNachNebensatz, nebensatz, konjunktionen) =>
  konjunktionen.flatMap((kj) => [`${hauptsatz}, ${kj} ${nebensatz}.`, `${gross(kj)} ${nebensatz}, ${hauptsatzNachNebensatz}.`]);
// Umstellprobe: Das verlangte Satzglied steht vorn, das Verb an zweiter Stelle, der Rest in jeder Reihenfolge (1 Punkt).
const reihen = (teile) => (teile.length < 2 ? [teile] : teile.flatMap((t, i) => reihen(teile.filter((_, j) => j !== i)).map((r) => [t].concat(r))));
const umstellen = (satz, anfang, verb, rest) => feld(satz, reihen(rest).map((r) => `${anfang} ${verb} ${r.join(" ")}.`), { breit: true });

/* ------------------------------ Aufgabenstellungen ------------------------------ */
const MODUS_R = "Indikativ (Wirklichkeitsform) oder Konjunktiv I? Ordne jede Verbform zu.";
const MODUS_M = "Indikativ, Konjunktiv I oder Konjunktiv II? Ordne jede Verbform zu.";
const KONJ1 = "Bilde den Konjunktiv I. Schreibe nur die Verbform in das Feld.";
const FORM_M = "Bilde die verlangte Verbform. Schreibe nur die Verbform in das Feld – auch bei den beiden Sätzen mit Lücke.";
const INDIREKT_R = "Forme die direkte Rede in die indirekte Rede um. Verwende den Konjunktiv I.";
const INDIREKT_M = "Forme die direkte Rede in die indirekte Rede um. Verwende den Konjunktiv I. Beim zweiten Satz ist der Konjunktiv I nicht vom Indikativ zu unterscheiden: Nimm dort den Konjunktiv II als Ersatzform.";
const SATZGLIED = "Welches Satzglied steht in GROSSBUCHSTABEN? Ordne zu.";
const KAUSAL_R = " Welches Satzglied ist die Adverbiale des Grundes (Kausaladverbiale)?";
const KAUSAL_M = "In welchem Satz ist das Satzglied in GROSSBUCHSTABEN eine Adverbiale des Grundes (Kausaladverbiale)?";
const UMSTELLEN_ZEIT = "Umstellprobe: Stelle den Satz so um, dass die Adverbiale der Zeit am Satzanfang steht.";
const UMSTELLEN_ORT = "Umstellprobe: Stelle den Satz so um, dass die Adverbiale des Ortes am Satzanfang steht.";
const UMSTELLEN_GRUND = "Umstellprobe: Stelle den Satz so um, dass die Adverbiale des Grundes (Kausaladverbiale) am Satzanfang steht.";
const REIHE_GEFUEGE = "Satzreihe oder Satzgefüge? Ordne zu.";
const VERBINDEN_R = "Verbinde die beiden Sätze zu einem Satzgefüge. Wähle dazu die passende Konjunktion: „weil“ oder „obwohl“. Denke an das Komma.";
const GEFUEGE_M = "Mache aus der Satzreihe ein Satzgefüge. Der Sinn bleibt gleich. Denke an das Komma.";
const KOMMA = "Setze die fehlenden Kommas.";
const NEBENSATZ_R = " Bestimme den Nebensatz in diesem Satz.";
const GLIEDSATZ_M = "Jeder Satz enthält einen Gliedsatz. Bestimme ihn und ordne zu.";
const KAUSALSATZ = "Kausalsatz (Grund)", TEMPORALSATZ = "Temporalsatz (Zeit)", KONDITIONALSATZ = "Konditionalsatz (Bedingung)";

/* ------------------------------ „Dein nächster Schritt“ ------------------------------ */
const H_MODUS_R = "Sieh dir bei jeder Form die Endung an und vergleiche sie mit der Form, die du im Alltag sagst (er lacht – er lache).";
const H_MODUS_M = "Stelle zu jedem Verb die drei Formen nebeneinander (er fliegt – er fliege – er flöge): Der Konjunktiv II kommt vom Präteritum und hat oft einen Umlaut.";
const H_KONJ1 = "Nimm den Verbstamm und hänge bei er, sie, es die Endung -e an; präge dir die Sonderform von „sein“ ein.";
const H_FORM_M = "Konjunktiv I: Verbstamm + -e (Sonderform bei „sein“). Konjunktiv II: Gehe vom Präteritum aus und prüfe, ob ein Umlaut dazukommt (flog – flöge).";
const H_INDIREKT_R = "Gehe in drei Schritten vor: Komma statt Doppelpunkt und Anführungszeichen, Pronomen anpassen (ich wird zu er oder sie), Verb in den Konjunktiv I setzen.";
const H_INDIREKT_M = "Komma statt Doppelpunkt und Anführungszeichen, Pronomen anpassen, Verb in den Konjunktiv I – sieht er aus wie der Indikativ, nimmst du den Konjunktiv II.";
const H_SATZGLIED = "Stelle zu jedem Satzglied die Frage mit dem Prädikat: Wer oder was? Wen oder was? Wem? Wann? Wo oder wohin?";
const H_KAUSAL_R = "Frage mit dem Prädikat „Warum …?“ – das Satzglied, das darauf antwortet, ist die Adverbiale des Grundes.";
const H_KAUSAL_M = "Frage in jedem Satz mit dem Prädikat: Warum? Woher? Wann? Wie? Nur auf „Warum?“ antwortet die Adverbiale des Grundes.";
const H_UMSTELLEN = "Bestimme zuerst die Satzglieder mit ihren Fragen; beim Umstellen bleibt jedes Satzglied zusammen und das gebeugte Verb an zweiter Stelle.";
const H_REIHE_R = "Prüfe jeden Teilsatz: Steht das gebeugte Verb an zweiter Stelle (Hauptsatz) oder am Ende (Nebensatz)?";
const H_REIHE_M = "Unterstreiche in jedem Teilsatz das gebeugte Verb: an zweiter Stelle = Hauptsatz, am Ende = Nebensatz. Auch Fragewörter können einen Nebensatz einleiten.";
const H_VERBINDEN_R = "Überlege zuerst, ob der zweite Satz einen Grund oder einen Gegensatz nennt; im Nebensatz rückt das gebeugte Verb ans Ende.";
const H_GEFUEGE_M = "Ersetze die Konjunktion der Satzreihe durch eine, die einen Nebensatz einleitet (Grund oder Gegensatz), und stelle im Nebensatz das gebeugte Verb ans Ende.";
const H_KOMMA_R = "Suche in jedem Satz die gebeugten Verben: Wo ein Teilsatz endet und der nächste beginnt, steht das Komma.";
const H_KOMMA_M = "Suche zuerst alle gebeugten Verben und grenze die Teilsätze ab; ein eingeschobener Nebensatz bekommt vorn und hinten ein Komma.";
const H_NEBENSATZ_R = "Ersetze den Nebensatz durch „das“ und frage mit dem Prädikat: „Wer oder was …?“ (Subjekt) oder „Wen oder was …?“ (Objekt).";
const H_GLIEDSATZ_M = "Mache die Ersatzprobe mit „das“ (Subjekt oder Objekt?) oder frage nach dem Nebensatz: Warum? Wann? Unter welcher Bedingung?";

const HILFE_NEBENSATZ = "So kannst du beginnen: Der Nebensatz heißt … Ich erkenne ihn daran, dass …";
const HILFE_REIHE = "So kannst du beginnen: Das ist … Das erkenne ich daran, dass …";
const HILFE_REDE_A = "So kannst du beginnen: Hanna verwendet … Das Verb steht dann im … Die Leser erkennen daran, dass …";
const HILFE_REDE_B = "So kannst du beginnen: Samir sollte … Das Verb steht dann im … So erkennen die Leser, dass …";

/* ============================== R7, Variante A – Wortfeld Schulküche ============================== */
const R_A = [
  m(MODUS_R, [
    ["sie wisse", "Konjunktiv I"],
    ["er schneidet", "Indikativ"],
    ["es gibt", "Indikativ"],
    ["er nehme", "Konjunktiv I"],
    ["sie darf", "Indikativ"],
    ["es bleibe", "Konjunktiv I"]], { points: 3, hinweis: H_MODUS_R }),
  f(KONJ1, [
    form("er (haben)", "er habe", "habe"),
    form("Hanna (können)", "Hanna könne", "könne", "sie könne"),
    form("es (kommen)", "es komme", "komme")
  ], { hinweis: H_KONJ1 }),
  f(INDIREKT_R, [
    rede("Frau Seidel sagt: „Der Kuchen braucht noch zehn Minuten.“", "Frau Seidel sagt", "der Kuchen brauche noch zehn Minuten", "der Kuchen noch zehn Minuten brauche"),
    rede("Hanna sagt: „Ich bin mit dem Salat fertig.“", "Hanna sagt", ["sie sei mit dem Salat fertig", "sie sei fertig mit dem Salat"], ["sie mit dem Salat fertig sei", "sie fertig mit dem Salat sei"])
  ], { hinweis: H_INDIREKT_R }),
  m(SATZGLIED, [
    ["Frau Seidel VERTEILT die Schürzen.", "Prädikat"],
    ["Hanna reicht IHREM NACHBARN das Salz.", "Dativobjekt"],
    ["Den Tisch deckt MALIKS GRUPPE.", "Subjekt"],
    ["Okan wäscht DEN SALAT.", "Akkusativobjekt"],
    ["Alle spülen NACH DEM ESSEN das Geschirr.", "Adverbiale der Zeit"],
    ["Die Töpfe hängen ÜBER DEM HERD.", "Adverbiale des Ortes"]], { points: 3, hinweis: H_SATZGLIED }),
  c("„Okan öffnet nach dem Kochen wegen des Dampfes das Fenster.“" + KAUSAL_R, [
    "wegen des Dampfes",
    "nach dem Kochen",
    "das Fenster",
    "Okan"], 0, { hinweis: H_KAUSAL_R }),
  f(UMSTELLEN_ZEIT, [
    umstellen("Die Kochgruppe backt am Freitag in der Schulküche einen Apfelkuchen.", "Am Freitag", "backt", ["die Kochgruppe", "in der Schulküche", "einen Apfelkuchen"])
  ], { hinweis: H_UMSTELLEN }),
  m(REIHE_GEFUEGE, [
    ["Das Wasser kocht, aber die Nudeln fehlen noch.", "Satzreihe"],
    ["Als der Küchenwecker klingelte, holte Hanna das Blech aus dem Ofen.", "Satzgefüge"],
    ["Wir decken den Tisch, denn gleich kommen die Gäste.", "Satzreihe"],
    ["Okan hofft, dass der Pudding fest wird.", "Satzgefüge"]], { points: 2, hinweis: H_REIHE_R }),
  f(VERBINDEN_R, [
    umbau("Die Soße schmeckt fad. Das Salz fehlt.", gefuege("Die Soße schmeckt fad", "schmeckt die Soße fad", "das Salz fehlt", ["weil", "da"])),
    umbau("Der Kuchen ist lecker. Der Rand ist verbrannt.", gefuege("Der Kuchen ist lecker", "ist der Kuchen lecker", "der Rand verbrannt ist", ["obwohl", "obgleich"]))
  ], { hinweis: H_VERBINDEN_R }),
  k(KOMMA, [
    "Wenn der Ofen heiß ist, schieben wir das Blech hinein.",
    "Hanna fragt, ob noch Mehl im Schrank steht.",
    "Okan wollte Pfannkuchen backen, doch es gab keine Eier mehr."], { hinweis: H_KOMMA_R }),
  c("„Dass der Hefeteig aufgeht, freut die ganze Gruppe.“" + NEBENSATZ_R, [
    "Subjektsatz",
    "Objektsatz",
    "Relativsatz"], 0, { hinweis: H_NEBENSATZ_R }),
  a("„Wir waschen uns die Hände, bevor der Unterricht in der Schulküche beginnt.“ Welcher Teil dieses Satzes ist der Nebensatz? Erkläre, woran du ihn erkennst.", [
    kr("Nebensatz genannt", 1, "„bevor der Unterricht in der Schulküche beginnt“ (der Teil nach dem Komma)."),
    kr("Merkmal erklärt", 1, "Ein richtiges Merkmal genügt: Er beginnt mit der Konjunktion „bevor“ – oder: Das gebeugte Verb („beginnt“) steht am Ende – oder: Er kann nicht allein stehen.")
  ], "Der Nebensatz heißt „bevor der Unterricht in der Schulküche beginnt“. Ich erkenne ihn daran, dass er mit der Konjunktion „bevor“ anfängt und das gebeugte Verb „beginnt“ am Ende steht.",
  ["nach dem komma|hinter dem komma|zweite teil|zweiter teil|hintere teil|ab bevor|mit bevor", "konjunktion|bindewort|einleitewort|eingeleitet|am ende|ans ende|am schluss|letzter stelle|letzten stelle|nicht allein"], { hilfe: HILFE_NEBENSATZ }),
  a("Hanna hört vom Hausmeister: „Der neue Herd spart Strom.“ Diese Aussage will sie in ihrem Bericht für die Schulhomepage wiedergeben – aber ohne Anführungszeichen. Erkläre in zwei bis drei Sätzen, wie sie das macht und was die Leser daran erkennen.", [
    kr("Art der Wiedergabe genannt", 1, "Hanna verwendet die indirekte Rede: Sie nennt, wer es gesagt hat („Der Hausmeister sagt, …“)."),
    kr("Verbform genannt", 1, "Das Verb steht im Konjunktiv I (auch als Beispiel: aus „spart“ wird „spare“)."),
    kr("Wirkung erklärt", 1, "Die Leser erkennen: Das ist die Aussage des Hausmeisters, nicht Hannas eigene – sie behauptet es nicht selbst (ob es stimmt, lässt sie offen).")
  ], "Hanna verwendet die indirekte Rede: „Der Hausmeister sagt, …“. Das Verb steht dann im Konjunktiv I. Daran erkennen die Leser, dass es die Meinung des Hausmeisters ist und Hanna es nicht selbst behauptet.",
  ["indirekt|redeeinleitung|begleitsatz|hausmeister sagt|er sagt", "konjunktiv|möglichkeitsform|spare", "nicht ihre|nicht die eigene|eigene meinung|seine meinung|jemand anderes|ein anderer|gesagt hat|nicht selbst|behauptet"], { hilfe: HILFE_REDE_A })
];

/* ============================== R7, Variante B – Wortfeld Wandertag ============================== */
const R_B = [
  m(MODUS_R, [
    ["er trage", "Konjunktiv I"],
    ["sie läuft", "Indikativ"],
    ["es regne", "Konjunktiv I"],
    ["er will", "Indikativ"],
    ["sie sehe", "Konjunktiv I"],
    ["es wird", "Indikativ"]], { points: 3, hinweis: H_MODUS_R }),
  f(KONJ1, [
    form("es (sein)", "es sei", "sei"),
    form("Greta (müssen)", "Greta müsse", "müsse", "sie müsse"),
    form("er (gehen)", "er gehe", "gehe")
  ], { hinweis: H_KONJ1 }),
  f(INDIREKT_R, [
    rede("Herr Kovac sagt: „Die Hütte liegt hinter dem Wald.“", "Herr Kovac sagt", "die Hütte liege hinter dem Wald", "die Hütte hinter dem Wald liege"),
    rede("Anton sagt: „Ich habe großen Durst.“", "Anton sagt", "er habe großen Durst", "er großen Durst habe")
  ], { hinweis: H_INDIREKT_R }),
  m(SATZGLIED, [
    ["Herr Kovac zeigt DEN KINDERN die Wanderkarte.", "Dativobjekt"],
    ["AM VORMITTAG überquert die Gruppe eine Holzbrücke.", "Adverbiale der Zeit"],
    ["Greta FOTOGRAFIERT einen Wasserfall.", "Prädikat"],
    ["Eine Bank steht AUF DEM GIPFEL.", "Adverbiale des Ortes"],
    ["Samir trägt DEN SCHWEREN RUCKSACK.", "Akkusativobjekt"],
    ["Den Kompass hält DIE LEHRERIN.", "Subjekt"]], { points: 3, hinweis: H_SATZGLIED }),
  c("„Herr Kovac ändert am Morgen wegen des Nebels die Route.“" + KAUSAL_R, [
    "wegen des Nebels",
    "am Morgen",
    "die Route",
    "Herr Kovac"], 0, { hinweis: H_KAUSAL_R }),
  f(UMSTELLEN_ORT, [
    umstellen("Die Wandergruppe isst am Mittag auf einer Wiese ihre Brote.", "Auf einer Wiese", "isst", ["die Wandergruppe", "am Mittag", "ihre Brote"])
  ], { hinweis: H_UMSTELLEN }),
  m(REIHE_GEFUEGE, [
    ["Nachdem alle gegessen haben, sammelt Greta den Müll ein.", "Satzgefüge"],
    ["Der Rucksack ist schwer, denn Samir hat drei Flaschen eingepackt.", "Satzreihe"],
    ["Pia glaubt, dass die Hütte schon geöffnet hat.", "Satzgefüge"],
    ["Wir nehmen den kurzen Weg oder wir fahren mit der Seilbahn.", "Satzreihe"]], { points: 2, hinweis: H_REIHE_R }),
  f(VERBINDEN_R, [
    umbau("Die Klasse wandert weiter. Der Weg ist steil.", gefuege("Die Klasse wandert weiter", "wandert die Klasse weiter", "der Weg steil ist", ["obwohl", "obgleich"])),
    umbau("Die Steine sind rutschig. Der Regen war stark.", gefuege("Die Steine sind rutschig", "sind die Steine rutschig", "der Regen stark war", ["weil", "da"]))
  ], { hinweis: H_VERBINDEN_R }),
  k(KOMMA, [
    "Herr Kovac zählt die Kinder, damit niemand fehlt.",
    "Sobald der Regen aufhört, packen wir die Jacken ein.",
    "Anton wollte ein Foto machen, doch der Akku war leer."], { hinweis: H_KOMMA_R }),
  c("„Der Hüttenwirt erzählt, dass im Winter oft Schnee liegt.“" + NEBENSATZ_R, [
    "Objektsatz",
    "Subjektsatz",
    "Relativsatz"], 0, { hinweis: H_NEBENSATZ_R }),
  a("„Die Sonne brennt, aber im Wald ist es kühl.“ Ist das eine Satzreihe oder ein Satzgefüge? Begründe deine Entscheidung.", [
    kr("richtig entschieden", 1, "Der Satz ist eine Satzreihe."),
    kr("Begründung", 1, "Eine richtige Begründung genügt: Der Satz besteht aus zwei Hauptsätzen – oder: Beide Teilsätze können allein stehen – oder: In beiden Teilsätzen steht das gebeugte Verb an zweiter Stelle (es gibt keinen Nebensatz).")
  ], "Das ist eine Satzreihe. Das erkenne ich daran, dass der Satz aus zwei Hauptsätzen besteht: Jeder Teil kann allein stehen, und das gebeugte Verb steht beide Male an zweiter Stelle.",
  ["hauptsatz|hauptsätze|hauptsätzen", "zwei|beide|allein|zweiter stelle|zweite stelle|kein nebensatz|keinen nebensatz"], { hilfe: HILFE_REIHE }),
  a("Im Bericht über den Wandertag schreibt Samir: „Der Bus hält direkt am Waldparkplatz.“ Das weiß er aber nur vom Busfahrer. Erkläre in zwei bis drei Sätzen, was Samir an seinem Satz ändern sollte und warum.", [
    kr("Art der Wiedergabe genannt", 1, "Samir sollte die indirekte Rede verwenden: Er nennt, wer es gesagt hat („Der Busfahrer sagt, …“)."),
    kr("Verbform genannt", 1, "Das Verb steht dann im Konjunktiv I (auch als Beispiel: aus „hält“ wird „halte“)."),
    kr("Grund erklärt", 1, "Die Leser sollen erkennen: Das ist die Aussage des Busfahrers, nicht Samirs eigene – er hat es nicht selbst geprüft und stellt es nicht als Tatsache hin.")
  ], "Samir sollte die indirekte Rede verwenden: „Der Busfahrer sagt, …“. Das Verb steht dann im Konjunktiv I. So erkennen die Leser, dass Samir nur wiedergibt, was der Busfahrer gesagt hat, und es nicht selbst behauptet.",
  ["indirekt|anführungszeichen|redeeinleitung|begleitsatz|fahrer sagt|gesagt hat", "konjunktiv|möglichkeitsform|halte", "nicht seine|nicht die eigene|eigene meinung|eigene aussage|nicht selbst|selber nicht|tatsache|geprüft|wiedergibt|behauptet"], { hilfe: HILFE_REDE_B })
];

/* ============================== M7, Variante A – Wortfeld Schülerzeitung ============================== */
const M_A = [
  m(MODUS_M, [
    ["er schriebe", "Konjunktiv II"],
    ["sie liest", "Indikativ"],
    ["es gebe", "Konjunktiv I"],
    ["er wüsste", "Konjunktiv II"],
    ["sie nehme", "Konjunktiv I"],
    ["es blieb", "Indikativ"]], { points: 3, hinweis: H_MODUS_M }),
  f(FORM_M, [
    form("er (sein) – Konjunktiv I", "er sei", "sei"),
    form("Selin (können) – Konjunktiv I", "Selin könne", "könne", "sie könne"),
    luecke("Wenn wir einen zweiten Drucker ___, würde alles schneller gehen.", "haben – Konjunktiv II", "hätten"),
    luecke("Jule seufzt: „___ doch schon alle Texte fertig!“", "sein – Konjunktiv II", "Wären")
  ], { hinweis: H_FORM_M }),
  f(INDIREKT_M, [
    rede("Jule sagt: „Ich habe meinen Artikel schon abgegeben.“", "Jule sagt", "sie habe ihren Artikel schon abgegeben", "sie ihren Artikel schon abgegeben habe"),
    rede("Die Fotografen sagen: „Wir müssen die Bilder noch sortieren.“", "Die Fotografen sagen", "sie müssten die Bilder noch sortieren", "sie die Bilder noch sortieren müssten")
  ], { hinweis: H_INDIREKT_M }),
  m(SATZGLIED, [
    ["Im Computerraum arbeitet DIE REDAKTION DER SCHÜLERZEITUNG.", "Subjekt"],
    ["Selin schickt DEM HAUSMEISTER ihre Fragen.", "Dativobjekt"],
    ["Darius HAT das Titelbild am Bildschirm ENTWORFEN.", "Prädikat"],
    ["Die fertigen Hefte liegen SEIT GESTERN im Sekretariat.", "Adverbiale der Zeit"],
    ["Jule wirft ihren Text IN DEN BRIEFKASTEN DER REDAKTION.", "Adverbiale des Ortes"],
    ["Frau Albrecht liest JEDEN ARTIKEL zweimal.", "Akkusativobjekt"]], { points: 3, hinweis: H_SATZGLIED }),
  c(KAUSAL_M, [
    "AUS ZEITMANGEL kürzt die Redaktion das Interview.",
    "AUS DEM DRUCKER kommt ein leeres Blatt.",
    "VOR DEM REDAKTIONSSCHLUSS liest Selin alle Texte.",
    "MIT GROSSER SORGFALT zeichnet Darius das Titelbild."], 0, { hinweis: H_KAUSAL_M }),
  f(UMSTELLEN_GRUND, [
    umstellen("Frau Albrecht verlängert wegen eines Stromausfalls den Abgabetermin um zwei Tage.", "Wegen eines Stromausfalls", "verlängert", ["Frau Albrecht", "den Abgabetermin", "um zwei Tage"])
  ], { hinweis: H_UMSTELLEN }),
  m(REIHE_GEFUEGE, [
    ["Niemand weiß, wann der Drucker repariert wird.", "Satzgefüge"],
    ["Die Fotos sind fertig und die Überschriften stehen schon.", "Satzreihe"],
    ["Ob die Ausgabe pünktlich erscheint, entscheidet sich am Montag.", "Satzgefüge"],
    ["Darius zeichnet nicht mit dem Stift, sondern er arbeitet am Tablet.", "Satzreihe"]], { points: 2, hinweis: H_REIHE_M }),
  f(GEFUEGE_M, [
    umbau("Die Ausgabe wird teurer, denn das Papier kostet mehr.", gefuege("Die Ausgabe wird teurer", "wird die Ausgabe teurer", "das Papier mehr kostet", ["weil", "da"])),
    umbau("Der Kopierer streikte, aber die Zeitung wurde pünktlich fertig.", gefuege("Die Zeitung wurde pünktlich fertig", "wurde die Zeitung pünktlich fertig", "der Kopierer streikte", ["obwohl", "obgleich"]))
  ], { hinweis: H_GEFUEGE_M }),
  k(KOMMA, [
    "Die Umfrage, die Jule ausgewertet hat, kommt auf Seite drei.",
    "Bevor die Hefte in den Druck gehen, liest Frau Albrecht jede Seite.",
    "Selin hofft, dass viele Kinder die Zeitung kaufen, doch sicher ist das nicht."], { hinweis: H_KOMMA_M }),
  m(GLIEDSATZ_M, [
    ["Wer einen Leserbrief schreibt, bekommt eine Antwort.", "Subjektsatz"],
    ["Selin fragt, ob der Rektor Zeit für ein Interview hat.", "Objektsatz"],
    ["Da das Sekretariat geschlossen ist, kopiert Darius in der Bücherei.", KAUSALSATZ],
    ["Nachdem alle Texte geprüft waren, begann Jule mit dem Layout.", TEMPORALSATZ],
    ["Falls noch Platz bleibt, drucken wir ein Rätsel.", KONDITIONALSATZ],
    ["Was auf der letzten Seite steht, bleibt noch geheim.", "Subjektsatz"]], { points: 3, hinweis: H_GLIEDSATZ_M }),
  a("„Wenn der Rektor zustimmen würde, käme jeden Monat eine neue Ausgabe heraus.“ Kommt jeden Monat eine neue Ausgabe heraus? Erkläre, woran du das an den Verbformen erkennst.", [
    kr("Frage richtig beantwortet", 1, "Nein – es ist nur vorgestellt, in Wirklichkeit kommt nicht jeden Monat eine Ausgabe heraus."),
    kr("Verbformen benannt", 1, "„würde“ und „käme“ stehen im Konjunktiv II."),
    kr("Bedeutung erklärt", 1, "Der Konjunktiv II drückt etwas Unwirkliches aus (nur gedacht oder gewünscht): Der Rektor hat nicht zugestimmt.")
  ], "Nein, es kommt nicht jeden Monat eine neue Ausgabe heraus. Die Verbformen „würde“ und „käme“ stehen im Konjunktiv II. Er zeigt, dass etwas nur vorgestellt und nicht wirklich ist: Der Rektor hat nicht zugestimmt.",
  ["nein|nicht jeden|stimmt nicht", "konjunktiv ii|konjunktiv 2|konjunktiv zwei", "unwirklich|nicht wirklich|vorgestellt|vorstellung|wunsch|nur gedacht|nicht zugestimmt|irreal"]),
  a("„Dass die erste Ausgabe ausverkauft ist, freut die Redaktion.“ Ist der Nebensatz ein Subjektsatz oder ein Objektsatz? Begründe mit der passenden Frage und mit der Ersatzprobe.", [
    kr("Gliedsatz richtig bestimmt", 1, "Der Nebensatz ist ein Subjektsatz."),
    kr("passende Frage gestellt", 1, "„Wer oder was freut die Redaktion?“ – Antwort: dass die erste Ausgabe ausverkauft ist."),
    kr("Ersatzprobe durchgeführt", 1, "Der Nebensatz lässt sich durch „das“ (oder „es“) ersetzen: „Das freut die Redaktion.“ – „das“ ist das Subjekt.")
  ], "Der Nebensatz ist ein Subjektsatz. Ich frage: Wer oder was freut die Redaktion? Die Antwort ist der Nebensatz. Ersatzprobe: „Das freut die Redaktion.“ – hier ist „das“ das Subjekt.",
  ["wer oder was|wer/was|wer o. was", "das freut|es freut|durch das|durch es|ersetz"])
];

/* ============================== M7, Variante B – Wortfeld Theater-AG ============================== */
const M_B = [
  m(MODUS_M, [
    ["sie käme", "Konjunktiv II"],
    ["er trägt", "Indikativ"],
    ["es heiße", "Konjunktiv I"],
    ["sie ginge", "Konjunktiv II"],
    ["er dürfe", "Konjunktiv I"],
    ["es fiel", "Indikativ"]], { points: 3, hinweis: H_MODUS_M }),
  f(FORM_M, [
    form("es (sein) – Konjunktiv I", "es sei", "sei"),
    form("Milan (müssen) – Konjunktiv I", "Milan müsse", "müsse", "er müsse"),
    luecke("Wenn die Bühne größer ___, würden alle Tänzer darauf passen.", "sein – Konjunktiv II", "wäre"),
    luecke("Thea wünscht sich: „___ ich doch nur ohne Lampenfieber spielen!“", "können – Konjunktiv II", "Könnte")
  ], { hinweis: H_FORM_M }),
  f(INDIREKT_M, [
    rede("Milan sagt: „Ich kenne meine Rolle längst auswendig.“", "Milan sagt", "er kenne seine Rolle längst auswendig", "er seine Rolle längst auswendig kenne"),
    rede("Die Techniker sagen: „Wir wissen über den neuen Ablauf Bescheid.“", "Die Techniker sagen", "sie wüssten über den neuen Ablauf Bescheid", "sie über den neuen Ablauf Bescheid wüssten")
  ], { hinweis: H_INDIREKT_M }),
  m(SATZGLIED, [
    ["Zoe leiht IHREM SPIELPARTNER das Textbuch.", "Dativobjekt"],
    ["Hinter dem Vorhang wartet DIE GANZE GRUPPE DER TÄNZER.", "Subjekt"],
    ["Thea trägt die Kostüme IN DEN KELLER DER SCHULE.", "Adverbiale des Ortes"],
    ["Milan HAT seinen Einsatz schon wieder VERPASST.", "Prädikat"],
    ["Herr Baumann probt SEIT DEN HERBSTFERIEN mit der Theater-AG.", "Adverbiale der Zeit"],
    ["Die Technikgruppe prüft JEDEN SCHEINWERFER einzeln.", "Akkusativobjekt"]], { points: 3, hinweis: H_SATZGLIED }),
  c(KAUSAL_M, [
    "VOR AUFREGUNG vergisst Thea ihren ersten Satz.",
    "VOR DEM AUFTRITT schminkt Zoe die Tänzer.",
    "AUS DER GARDEROBE holt Milan die Hüte.",
    "MIT LAUTER STIMME spricht der König seinen Text."], 0, { hinweis: H_KAUSAL_M }),
  f(UMSTELLEN_GRUND, [
    umstellen("Herr Baumann verschiebt wegen einer Tonpanne die Hauptprobe um eine Stunde.", "Wegen einer Tonpanne", "verschiebt", ["Herr Baumann", "die Hauptprobe", "um eine Stunde"])
  ], { hinweis: H_UMSTELLEN }),
  m(REIHE_GEFUEGE, [
    ["Die Kulissen stehen nicht im Keller, sondern sie lagern in der Turnhalle.", "Satzreihe"],
    ["Wie lange die Aufführung dauert, weiß nur Herr Baumann.", "Satzgefüge"],
    ["Zoe fragt, wo die Requisiten liegen.", "Satzgefüge"],
    ["Milan lernt seinen Text oder er übt den Schwertkampf.", "Satzreihe"]], { points: 2, hinweis: H_REIHE_M }),
  f(GEFUEGE_M, [
    umbau("Der Vorhang klemmte, aber das Publikum bemerkte nichts.", gefuege("Das Publikum bemerkte nichts", "bemerkte das Publikum nichts", "der Vorhang klemmte", ["obwohl", "obgleich"])),
    umbau("Die Probe dauert länger, denn zwei Szenen sind neu.", gefuege("Die Probe dauert länger", "dauert die Probe länger", "zwei Szenen neu sind", ["weil", "da"]))
  ], { hinweis: H_GEFUEGE_M }),
  k(KOMMA, [
    "Während die Tänzer üben, bauen die Techniker das Licht auf.",
    "Das Stück, das die Theater-AG ausgesucht hat, spielt in einem Schloss.",
    "Milan glaubt, dass er seinen Text kann, doch bei der Probe stockt er."], { hinweis: H_KOMMA_M }),
  m(GLIEDSATZ_M, [
    ["Bevor die Probe beginnt, sprechen alle einen Zungenbrecher.", TEMPORALSATZ],
    ["Herr Baumann erklärt, wie die Kampfszene ablaufen soll.", "Objektsatz"],
    ["Dass Thea ihre Rolle tauschen will, ärgert die Gruppe.", "Subjektsatz"],
    ["Falls ein Scheinwerfer ausfällt, hilft die Technikgruppe.", KONDITIONALSATZ],
    ["Da die Kostüme zu lang sind, kürzt Zoe die Ärmel.", KAUSALSATZ],
    ["Milan vergisst oft, wann sein Einsatz kommt.", "Objektsatz"]], { points: 3, hinweis: H_GLIEDSATZ_M }),
  a("Vergleiche: „Wenn der Hausmeister uns den Schlüssel gibt, proben wir auf der großen Bühne.“ – „Wenn der Hausmeister uns den Schlüssel gäbe, würden wir auf der großen Bühne proben.“ Erkläre den Unterschied in der Bedeutung. Gehe dabei auf die Verbformen ein.", [
    kr("ersten Satz erklärt", 1, "Im ersten Satz steht der Indikativ („gibt“, „proben“): Es ist gut möglich, dass der Hausmeister den Schlüssel gibt und die Probe auf der großen Bühne stattfindet."),
    kr("Verbformen des zweiten Satzes benannt", 1, "„gäbe“ und „würden“ stehen im Konjunktiv II."),
    kr("Bedeutung des zweiten Satzes erklärt", 1, "Der Konjunktiv II drückt etwas Unwirkliches aus (nur gedacht oder gewünscht): Der Hausmeister gibt den Schlüssel nicht her, die Probe auf der großen Bühne findet nicht statt.")
  ], "Im ersten Satz steht der Indikativ: Es kann gut sein, dass der Hausmeister den Schlüssel gibt. Im zweiten Satz stehen „gäbe“ und „würden“ im Konjunktiv II. Das zeigt, dass es nur vorgestellt ist: Der Hausmeister gibt den Schlüssel nicht her.",
  ["indikativ|wirklichkeitsform|möglich|kann sein|kann gut sein|kann passieren|tatsächlich", "konjunktiv ii|konjunktiv 2|konjunktiv zwei", "unwirklich|nicht wirklich|vorgestellt|vorstellung|wunsch|nur gedacht|irreal|nicht her"]),
  a("„Ob die Kostüme passen, prüft Zoe am Montag.“ Milan behauptet: „Der Nebensatz steht vorn, also ist er ein Subjektsatz.“ Hat Milan recht? Begründe mit der passenden Frage und mit der Ersatzprobe.", [
    kr("Behauptung richtig beurteilt", 1, "Milan hat nicht recht: Der Nebensatz ist ein Objektsatz. Auf die Stellung im Satz kommt es nicht an."),
    kr("passende Frage gestellt", 1, "„Wen oder was prüft Zoe am Montag?“ – Antwort: ob die Kostüme passen. (Das Subjekt ist „Zoe“: Wer prüft?)"),
    kr("Ersatzprobe durchgeführt", 1, "Der Nebensatz lässt sich durch „das“ (oder „es“) ersetzen: „Das prüft Zoe am Montag.“ / „Zoe prüft es am Montag.“ – „das“ ist das Akkusativobjekt.")
  ], "Milan hat nicht recht, der Nebensatz ist ein Objektsatz. Ich frage: Wen oder was prüft Zoe am Montag? Die Antwort ist der Nebensatz. Ersatzprobe: „Das prüft Zoe am Montag.“ – hier ist „das“ das Akkusativobjekt, das Subjekt ist Zoe.",
  ["nicht recht|unrecht|falsch|stimmt nicht|objektsatz", "wen oder was|wen/was|wen o. was", "das prüft|prüft es|prüft das|durch das|durch es|ersetz"])
];

const ALLE = { kurz: "Grammatik II", scope: "Konjunktiv und indirekte Rede · Satzglieder · Satzreihe und Satzgefüge", minutes: 40, texte: [] };
module.exports = {
  "d7-p7-r-a": probe(7, "R", "A", { ...ALLE, title: "Probe 7 (R7): Grammatik II", items: R_A }),
  "d7-p7-r-b": probe(7, "R", "B", { ...ALLE, title: "Probe 7 (R7): Grammatik II – Variante B", items: R_B }),
  "d7-p7-m-a": probe(7, "M", "A", { ...ALLE, title: "Probe 7 (M7): Grammatik II", items: M_A }),
  "d7-p7-m-b": probe(7, "M", "B", { ...ALLE, title: "Probe 7 (M7): Grammatik II – Variante B", items: M_B })
};
