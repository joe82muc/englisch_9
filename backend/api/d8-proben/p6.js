"use strict";

/**
 * Deutsch 8 · Probe 6: Grammatik und Sprache I (Wortarten sicher bestimmen und Modalverben, M8 auch weitere Modalformen ·
 * Konjunktiv I und II erkennen, bilden, verwenden · indirekte Rede: Pronomen, Redeverb, Aussage und Frage umformen,
 * M8: Ersatzformen begründet wählen). LehrplanPLUS D8 4.2 (Wortarten sicher unterscheiden, M8: Modalformen des Verbs;
 * Konjunktiv I und II; indirekte Rede), 3.1 (indirekte Rede formgerecht verwenden). Lernmodule G1–G3 (gr_01 bis gr_03).
 * R8: 12 Aufgaben, 30 Punkte, offen 5 (17 %) · M8: 12 Aufgaben, 36 Punkte, offen 9 (25 %) · 40 Minuten. Keine Lesetexte.
 * Wortfelder: Variante A Schulfest · Variante B Schülerfirma (baut Nistkästen und Schlüsselbretter aus Holz).
 * Alle Sätze, Personen und Einrichtungen sind erfunden; kein Satz steht in einem Lernmodul oder in einer anderen Probe.
 *
 * Aufbau R8 (30): Wortarten 3 · während/seit 1 · Modalverben 3 · Modalverb einsetzen 2 · Modus 3 · Konjunktiv bilden 4 ·
 *   Verwendung 2 · Pronomen 2 · indirekte Rede (Aussage, Frage) 4 · Redeverb 1 · offen 2 (Konjunktiv I) · offen 3 (Konjunktiv II).
 * Aufbau M8 (36): Wortarten 3 · während/seit 1 · Modalformen 3 · „sein/haben + zu“ → müssen 4 · Modus 3 · Konjunktiv bilden 4 ·
 *   Verwendung (mit Ersatzform) 2 · indirekte Rede (Frage mit Pronomen, Ersatzform, W-Frage) 6 · Redeverb 1 ·
 *   offen 2 (nicht müssen/nicht dürfen) · offen 3 (Konjunktiv I und seine Wirkung) · offen 4 (würde-Ersatz begründen).
 * M8 ist anspruchsvoller: schwierigere Wortarten, Modalformen (sollte, dürfte, ist … zu), Ersatzform selbst erkennen und
 * begründen, mehr Umformungen. Begriffe wie in den Lernmodulen (Fähigkeit, Erlaubnis, Notwendigkeit, Auftrag, Wille,
 * Wunsch; Ratschlag, Vermutung; Wunsch – Unwirkliches – höfliche Bitte).
 * Innerhalb einer Fassung steht keine Verbform, die ein Kind selbst bilden muss, in einer anderen Aufgabe als Muster.
 * Kurze Eingaben: Es zählt die Form allein oder der ganze Satz; Groß-/Kleinschreibung und das Satzschlusszeichen zählen
 * nicht. Bei ganzen Sätzen zählen die Kommas (steht in der Aufgabe). Rechtschreibung wird nicht eigens gewertet.
 * Bleibt auf dem Server (Lösungen, Erwartungshorizont). Bausteine: bau.js.
 */
const { c, m, f, feld, a, kr, probe } = require("./bau");

/* ------------------------------ Schreibhilfen ------------------------------ */
// Lücke im Satz mit Angabe in Klammern: Es zählt das Wort allein – oder der ganze Satz mit dem Wort.
const luecke = (satz, angabe, ...woerter) => feld(satz + " (" + angabe + ")", woerter.concat(woerter.map((w) => satz.replace("___", w))));
// Pronomen-Lücke: wörtliche Rede → indirekte Rede mit Lücke
const pronomen = (direkt, indirekt, wort) => feld(direkt + " → " + indirekt, [wort, indirekt.replace("___", wort)]);
// Satzumbau: ganzer Satz, 2 Punkte, alle vertretbaren Fassungen
const umbau = (satz, loesungen) => feld(satz, loesungen, { breit: true, punkte: 2 });
// Indirekte Rede ohne „dass“ (Verb an zweiter Stelle) und mit „dass“ (Verb am Ende)
const rede = (direkt, einleitung, ohneDass, mitDass) => umbau(direkt, [].concat(ohneDass).map((s) => `${einleitung}, ${s}.`).concat([].concat(mitDass || []).map((s) => `${einleitung}, dass ${s}.`)));

/* ------------------------------ Aufgabenstellungen ------------------------------ */
const WORTART = "Welche Wortart hat das Wort in GROSSBUCHSTABEN? Ordne zu.";
const doppel = (wort, art) => `„${wort}“ kann eine Präposition oder eine Konjunktion sein. In welchem Satz ist ${wort.toUpperCase()} eine ${art}?`;
const MODAL_R = "Was drückt das Modalverb in GROSSBUCHSTABEN aus? Ordne zu.";
const MODAL_M = "Modalverben und andere Modalformen: Was drückt der Ausdruck in GROSSBUCHSTABEN aus? Ordne zu.";
const MODAL_LUECKE = "Setze das passende Modalverb in der richtigen Form ein. In Klammern steht, was es ausdrücken soll. Schreibe nur das fehlende Wort in das Feld.";
const MUESSEN = "Hier drückt „sein + zu“ oder „haben + zu“ eine Notwendigkeit aus. Schreibe jeden Satz mit dem Modalverb „müssen“. Beispiele: Die Tür ist abzuschließen. → Die Tür muss abgeschlossen werden. · Ihr habt zu warten. → Ihr müsst warten.";
const MODUS = "Indikativ, Konjunktiv I oder Konjunktiv II? Bestimme die Verbform in GROSSBUCHSTABEN und ordne zu.";
const KONJ_BILDEN = "Setze das Verb in der verlangten Form ein. Schreibe nur die Verbform in das Feld.";
const VERWENDUNG = "Wozu steht in dem Satz der Konjunktiv? Ordne zu.";
const WUNSCH = "Wunsch", UNWIRKLICH = "Unwirkliches (nur vorgestellt)", BITTE = "höfliche Bitte", WIEDERGABE = "Wiedergabe einer Aussage";
const PRONOMEN = "Aus der wörtlichen Rede wird indirekte Rede. Welches Pronomen fehlt? Schreibe in jedes Feld nur ein Wort.";
const INDIREKT_R = "Forme in die indirekte Rede um. Verwende den Konjunktiv I und denke an das Komma.";
const INDIREKT_M = "Forme in die indirekte Rede um. Verwende den Konjunktiv I. Lautet er genauso wie der Indikativ, nimmst du den Konjunktiv II als Ersatzform. Denke an das Komma.";
const REDEVERB = "Welches Redeverb passt am besten in die Lücke?";
const UNTERSCHIED = " Erkläre den Unterschied in der Bedeutung.";
const FASSUNG = " Welche Fassung passt besser in einen Bericht? Begründe mit der Verbform und mit ihrer Wirkung auf die Leser.";

/* ------------------------------ „Dein nächster Schritt“ ------------------------------ */
const H_WORTART_R = "Prüfe bei jedem Wort: Steht ein Artikel davor (Nomen)? Folgt ein Nomen mit Begleiter (Präposition)? Verbindet es Sätze oder Satzteile (Konjunktion)? Sagt es wann, wo oder wie (Adverb)?";
const H_WORTART_M = "Prüfe bei jedem Wort: Steht ein Artikel davor (Nomen)? Steht es für ein Nomen (Pronomen)? Folgt ein Nomen mit Begleiter (Präposition) oder ein ganzer Teilsatz (Konjunktion)?";
const H_DOPPEL = "Sieh nach, was auf das Wort folgt: nur ein Nomen mit Begleiter (Präposition) – oder ein ganzer Nebensatz mit dem Verb am Ende (Konjunktion).";
const H_MODAL_R = "Ersetze das Modalverb durch eine Umschreibung: ist fähig – hat die Erlaubnis – es ist nötig – hat den Auftrag – hat den festen Willen – hat den Wunsch. Was passt?";
const H_MODAL_M = "Achte auf die Form: „sollte“ rät nur, „soll“ gibt einen Auftrag weiter; „dürfte“ vermutet, „darf“ erlaubt; „ist … zu tun“ heißt „muss getan werden“.";
const H_MODAL_LUECKE = "Verboten oder erlaubt → dürfen · nötig → müssen. Achte darauf, dass die Form zum Subjekt passt.";
const H_MUESSEN = "„ist/sind … zu tun“ wird zu „muss/müssen getan werden“ (Passiv); „hat … zu tun“ wird zu „muss tun“ (Aktiv).";
const H_MODUS = "Stelle die drei Formen nebeneinander (er gibt – er gebe – er gäbe): Der Konjunktiv I kommt vom Verbstamm + e, der Konjunktiv II vom Präteritum, oft mit Umlaut.";
const H_KONJ = "Konjunktiv I: Verbstamm + e (Sonderform bei „sein“). Konjunktiv II: Gehe vom Präteritum aus und prüfe, ob ein Umlaut dazukommt (gab → gäbe).";
const H_VERWENDUNG = "Frage dich: Gibt der Satz wieder, was jemand gesagt hat? Wünscht sich jemand etwas (doch, nur)? Stellt sich jemand etwas vor, das nicht wirklich ist (Wenn …)? Oder bittet jemand besonders höflich?";
const H_PRONOMEN = "Überlege: Wer spricht? In der indirekten Rede wird aus „ich“ → „er“ oder „sie“ und aus „mein“ → „sein“ oder „ihr“.";
const H_INDIREKT_R = "Gehe in Schritten vor: Komma statt Doppelpunkt und Anführungszeichen, Verb in den Konjunktiv I. Eine Frage ohne Fragewort leitest du mit „ob“ ein, das Verb rückt ans Ende.";
const H_INDIREKT_M = "Komma statt Doppelpunkt, Pronomen anpassen, Verb in den Konjunktiv I. Prüfe bei „sie“ (Mehrzahl), ob die Form wie der Indikativ klingt – dann nimm den Konjunktiv II. Fragen: „ob“ oder das Fragewort, Verb ans Ende.";
const H_REDEVERB = "Lies den Hinweis vor dem Satz noch einmal: Ist die Person sicher oder unsicher, gibt sie ihr Wort, will sie etwas wissen?";
const H_K1 = "Merke dir: Der Konjunktiv I ist das Zeichen der indirekten Rede – er zeigt, dass jemand anderes etwas gesagt hat.";
const H_K2 = "Merke dir: Der Konjunktiv II (hätte, wäre, gäbe, könnte …) zeigt, dass etwas nur vorgestellt oder gewünscht ist.";
const H_NICHT = "Präge dir das Paar ein: „nicht müssen“ = nicht nötig, „nicht dürfen“ = verboten.";
const H_ERSATZ = "Prüfe in drei Schritten: Konjunktiv I – klingt er wie der Indikativ? Dann Konjunktiv II – klingt er wie das Präteritum? Dann „würde“ + Infinitiv.";

const HILFE_K1 = "So kannst du beginnen: Das Wort ist kein Fehler, sondern die Form … Sie zeigt den Lesern, dass …";
const HILFE_K2 = "So kannst du beginnen: Nein/Ja, denn die Verbformen „…“ und „…“ stehen im … Diese Form zeigt, dass …";

const SW_K1 = ["konjunktiv|möglichkeitsform", "indirekt|wiedergibt|wiedergegeben|wiedergabe|gesagt hat|seine aussage|nicht selbst|jemand anderes"];
const SW_K2 = ["nein|nicht|keine|kein", "konjunktiv", "vorgestellt|vorstell|unwirklich|nicht wirklich|wunsch|gewünscht|ausgedacht|nur gedacht|nicht echt"];
const SW_NICHT = ["nicht nötig|freiwillig|keine pflicht|nicht notwendig|wenn sie wollen|können aber|brauchen nicht|kein muss", "verboten|verbot|nicht erlaubt|untersagt|auf keinen fall"];
const SW_WIRKUNG = ["konjunktiv|möglichkeitsform", "indirekt|wiedergibt|wiedergabe|nur die aussage|aussage der|aussage des|nicht selbst|behauptet|neutral|distanz|ob es stimmt|gesagt hat"];
const SW_ERSATZ = ["indikativ|wirklichkeitsform|gleich|genauso|dieselbe form|kein unterschied", "präteritum|vergangenheit", "würde"];

/* ============================== R8, Variante A – Wortfeld Schulfest ============================== */
const R_A = [
  m(WORTART, [
    ["Die Klasse 8b baut HEUTE den Getränkestand auf.", "Adverb"],
    ["Das BASTELN der Girlanden dauert länger als geplant.", "Nomen"],
    ["WEGEN des Regens zieht die Tombola in die Turnhalle um.", "Präposition"],
    ["Die Band spielt nicht in der Aula, SONDERN auf der Bühne im Hof.", "Konjunktion"],
    ["HURRA, die Sonne kommt doch noch heraus!", "Interjektion"],
    ["Der Apfelkuchen von Dunjas Oma ist noch WARM.", "Adjektiv"]], { points: 3, hinweis: H_WORTART_R }),
  c(doppel("Während", "Präposition"), [
    "WÄHREND der Zaubershow bleibt es in der Aula ganz still.",
    "WÄHREND die Theatergruppe probt, schmücken wir den Flur.",
    "Kerem verkauft Lose, WÄHREND Lotta die Preise aufbaut."], 0, { hinweis: H_DOPPEL }),
  m(MODAL_R, [
    ["Vor dem Fest MÜSSEN wir die Bänke aus dem Keller holen.", "Notwendigkeit"],
    ["Tomke KANN mit fünf Bällen jonglieren.", "Fähigkeit"],
    ["Ich MÖCHTE gern beim Kinderschminken mithelfen.", "Wunsch"],
    ["Herr Zoller hat angeordnet: Wir SOLLEN alle Kabel am Boden festkleben.", "Auftrag"],
    ["Die Fünftklässler DÜRFEN heute bis acht Uhr abends bleiben.", "Erlaubnis"],
    ["Unsere Klasse WILL unbedingt den Preis für den schönsten Stand gewinnen.", "Wille"]], { points: 3, hinweis: H_MODAL_R }),
  f(MODAL_LUECKE, [
    luecke("Auf der Bühne ___ niemand essen oder trinken.", "Verbot", "darf"),
    luecke("Wer am Grill steht, ___ eine Schürze tragen.", "Notwendigkeit", "muss")
  ], { hinweis: H_MODAL_LUECKE }),
  m(MODUS, [
    ["Die Rektorin sagt, das Fest BEGINNE um 15 Uhr.", "Konjunktiv I"],
    ["DÜRFTE ich bitte das Mikrofon ausleihen?", "Konjunktiv II"],
    ["Die Tombola HAT in diesem Jahr 300 Lose.", "Indikativ"],
    ["Xaver erzählt, seine Schwester BRINGE Muffins mit.", "Konjunktiv I"],
    ["Gestern DURFTE die Technik-AG die neue Anlage testen.", "Indikativ"],
    ["KÖNNTEST du mir bitte die Kasse bringen?", "Konjunktiv II"]], { points: 3, hinweis: H_MODUS }),
  f(KONJ_BILDEN, [
    luecke("Lotta sagt, sie ___ noch zwei Bleche Pizza.", "haben – Konjunktiv I", "habe"),
    luecke("Herr Zoller meint, die Bühne ___ stabil genug.", "sein – Konjunktiv I", "sei"),
    luecke("Wenn der Pausenhof größer ___, hätten alle Stände Platz.", "sein – Konjunktiv II", "wäre"),
    luecke("Ohne den Stau ___ der Zauberer pünktlich.", "kommen – Konjunktiv II", "käme")
  ], { hinweis: H_KONJ }),
  m(VERWENDUNG, [
    ["Wüsste ich doch nur, wo der Schlüssel für die Aula liegt!", WUNSCH],
    ["Wenn Tomke zaubern könnte, müsste niemand die Bänke schleppen.", UNWIRKLICH],
    ["Würden Sie bitte die Musik etwas leiser stellen?", BITTE],
    ["Frau Lechner erklärt, der Erlös gehe an den Tierschutzverein.", WIEDERGABE]], { points: 2, hinweis: H_VERWENDUNG }),
  f(PRONOMEN, [
    pronomen("Niklas sagt: „Ich spiele heute Schlagzeug.“", "Niklas sagt, ___ spiele heute Schlagzeug.", "er"),
    pronomen("Lotta sagt: „Mein Bruder hilft am Grill.“", "Lotta sagt, ___ Bruder helfe am Grill.", "ihr")
  ], { hinweis: H_PRONOMEN }),
  f(INDIREKT_R, [
    rede("Frau Lechner erklärt: „Die Bühne steht im Pausenhof.“", "Frau Lechner erklärt", "die Bühne stehe im Pausenhof", "die Bühne im Pausenhof stehe"),
    umbau("Kerem fragt: „Kommt der Bürgermeister auch?“", ["Kerem fragt, ob der Bürgermeister auch komme.", "Kerem fragt, ob auch der Bürgermeister komme."])
  ], { hinweis: H_INDIREKT_R }),
  c(REDEVERB + " Herr Zoller ist sich nicht sicher, er nimmt es nur an: „Herr Zoller ___, der Strom reiche nicht für alle Stände.“", [
    "vermutet", "verspricht", "fragt", "befiehlt"], 0, { hinweis: H_REDEVERB }),
  a("In der Schülerzeitung steht: „Der Bürgermeister sagte, er spende 200 Euro für das Schulfest.“ Dunja meint: „Das Wort ‚spende‘ ist ein Tippfehler, richtig heißt es ‚spendet‘.“ Erkläre, warum „spende“ hier richtig ist.", [
    kr("Verbform benannt", 1, "„spende“ ist der Konjunktiv I (Möglichkeitsform) von „spenden“ – kein Tippfehler."),
    kr("Aufgabe der Form erklärt", 1, "Der Satz steht in der indirekten Rede: Die Schülerzeitung gibt wieder, was der Bürgermeister gesagt hat. Der Konjunktiv I zeigt, dass es seine Aussage ist.")
  ], "„spende“ ist kein Tippfehler, sondern der Konjunktiv I. Der Satz steht in der indirekten Rede: Die Schülerzeitung gibt nur wieder, was der Bürgermeister gesagt hat.",
  SW_K1, { hilfe: HILFE_K1, hinweis: H_K1 }),
  a("Tomke sagt: „Wenn unsere Turnhalle eine Kletterwand hätte, gäbe es beim Schulfest einen Kletterwettbewerb.“ Gibt es den Kletterwettbewerb? Begründe mit den Verbformen des Satzes.", [
    kr("Frage richtig beantwortet", 1, "Nein – die Turnhalle hat keine Kletterwand, also gibt es den Wettbewerb nicht. Tomke stellt es sich nur vor."),
    kr("Verbformen benannt", 1, "„hätte“ und „gäbe“ stehen im Konjunktiv II (es genügt, eine der beiden Formen richtig zu benennen)."),
    kr("Bedeutung erklärt", 1, "Der Konjunktiv II zeigt: Das ist nicht wirklich so, sondern nur vorgestellt oder gewünscht.")
  ], "Nein, den Kletterwettbewerb gibt es nicht. „hätte“ und „gäbe“ stehen im Konjunktiv II. Diese Form zeigt, dass Tomke sich das nur vorstellt: In Wirklichkeit hat die Turnhalle keine Kletterwand.",
  SW_K2, { hilfe: HILFE_K2, hinweis: H_K2 })
];

/* ============================== R8, Variante B – Wortfeld Schülerfirma ============================== */
const R_B = [
  m(WORTART, [
    ["Das VERPACKEN der Bestellungen übernimmt Imke.", "Nomen"],
    ["Im Werkraum stehen die Sägen, DORT bauen wir die Nistkästen.", "Adverb"],
    ["Juri schreibt die Rechnungen, ABER das Geld zählt Cem.", "Konjunktion"],
    ["Der neue Flyer der Firma ist richtig BUNT.", "Adjektiv"],
    ["OHNE einen genauen Plan verliert die Firma schnell Geld.", "Präposition"],
    ["OH, die Kasse stimmt ja auf den Cent genau!", "Interjektion"]], { points: 3, hinweis: H_WORTART_R }),
  c(doppel("Seit", "Präposition"), [
    "SEIT dem Herbst verkauft die Schülerfirma auch Schlüsselbretter.",
    "SEIT die Firma Werbung macht, kommen mehr Bestellungen.",
    "Die Kasse stimmt immer, SEIT Smilla die Buchhaltung führt."], 0, { hinweis: H_DOPPEL }),
  m(MODAL_R, [
    ["Ich MÖCHTE am liebsten in der Werbeabteilung mitarbeiten.", "Wunsch"],
    ["Alle Einnahmen MÜSSEN im Kassenbuch stehen.", "Notwendigkeit"],
    ["Raik KANN sehr genau mit der Stichsäge arbeiten.", "Fähigkeit"],
    ["Die Firma WILL bis zum Sommer unbedingt 500 Euro Gewinn erreichen.", "Wille"],
    ["Frau Petridis hat uns aufgetragen: Wir SOLLEN bis Freitag zehn Nistkästen bauen.", "Auftrag"],
    ["Nur die beiden Geschäftsführer DÜRFEN Geld aus der Kasse nehmen.", "Erlaubnis"]], { points: 3, hinweis: H_MODAL_R }),
  f(MODAL_LUECKE, [
    luecke("Wer etwas bestellt, ___ den Bestellzettel vollständig ausfüllen.", "Notwendigkeit", "muss"),
    luecke("An die Bohrmaschine ___ niemand ohne Schutzbrille.", "Verbot", "darf")
  ], { hinweis: H_MODAL_LUECKE }),
  m(MODUS, [
    ["Der Werkraum IST jeden Dienstag für die Firma reserviert.", "Indikativ"],
    ["Smilla berichtet, die Firma BRAUCHE neues Holz.", "Konjunktiv I"],
    ["Raik HÄTTE gern eine zweite Stichsäge.", "Konjunktiv II"],
    ["Im letzten Jahr HATTE die Firma nur vier Mitarbeiter.", "Indikativ"],
    ["Ohne Herrn Ahlers GÄBE es die Firma gar nicht.", "Konjunktiv II"],
    ["Cem meint, der Preis BLEIBE gleich.", "Konjunktiv I"]], { points: 3, hinweis: H_MODUS }),
  f(KONJ_BILDEN, [
    luecke("Imke meint, sie ___ die Flyer bis morgen drucken.", "können – Konjunktiv I", "könne"),
    luecke("Juri sagt, das Geld ___ heute noch zur Bank.", "gehen – Konjunktiv I", "gehe"),
    luecke("Wenn die Firma im Supermarkt verkaufen ___, hätten wir viel mehr Kunden.", "dürfen – Konjunktiv II", "dürfte"),
    luecke("Ich ___ gern, wie viele Kunden heute kommen.", "wissen – Konjunktiv II", "wüsste")
  ], { hinweis: H_KONJ }),
  m(VERWENDUNG, [
    ["Der Schulleiter sagt, die Firma leiste gute Arbeit.", WIEDERGABE],
    ["Käme doch endlich die Lieferung mit dem Holz!", WUNSCH],
    ["Wenn es Bretter regnen würde, müsste die Firma kein Holz kaufen.", UNWIRKLICH],
    ["Würdest du mir bitte den Akkuschrauber reichen?", BITTE]], { points: 2, hinweis: H_VERWENDUNG }),
  f(PRONOMEN, [
    pronomen("Vera sagt: „Mein Onkel spendet der Firma Holzreste.“", "Vera sagt, ___ Onkel spende der Firma Holzreste.", "ihr"),
    pronomen("Ludwig sagt: „Ich führe heute das Kassenbuch.“", "Ludwig sagt, ___ führe heute das Kassenbuch.", "er")
  ], { hinweis: H_PRONOMEN }),
  f(INDIREKT_R, [
    rede("Herr Ahlers erklärt: „Das Holz liegt im Werkraum.“", "Herr Ahlers erklärt", "das Holz liege im Werkraum", "das Holz im Werkraum liege"),
    umbau("Smilla fragt: „Reicht das Geld für neue Pinsel?“", ["Smilla fragt, ob das Geld für neue Pinsel reiche."])
  ], { hinweis: H_INDIREKT_R }),
  c(REDEVERB + " Der Schreiner gibt sein Wort: „Der Schreiner ___, er liefere das Holz bis Montag.“", [
    "verspricht", "vermutet", "fragt", "bezweifelt"], 0, { hinweis: H_REDEVERB }),
  a("Im Jahresbericht der Schule steht: „Der Schreiner sagte, er schenke der Schülerfirma eine Werkbank.“ Juri meint: „Das Wort ‚schenke‘ ist falsch, richtig heißt es ‚schenkt‘.“ Erkläre, warum „schenke“ hier richtig ist.", [
    kr("Verbform benannt", 1, "„schenke“ ist der Konjunktiv I (Möglichkeitsform) von „schenken“ – kein Fehler."),
    kr("Aufgabe der Form erklärt", 1, "Der Satz steht in der indirekten Rede: Der Jahresbericht gibt wieder, was der Schreiner gesagt hat. Der Konjunktiv I zeigt, dass es seine Aussage ist.")
  ], "„schenke“ ist der Konjunktiv I und deshalb richtig. Der Jahresbericht gibt in der indirekten Rede wieder, was der Schreiner gesagt hat – das erkennt man an dieser Form.",
  SW_K1, { hilfe: HILFE_K1, hinweis: H_K1 }),
  a("Raik sagt: „Wenn der Werkraum auch am Samstag offen wäre, könnte die Firma doppelt so viele Nistkästen bauen.“ Baut die Firma doppelt so viele Nistkästen? Begründe mit den Verbformen des Satzes.", [
    kr("Frage richtig beantwortet", 1, "Nein – der Werkraum ist am Samstag nicht offen, also baut die Firma nicht doppelt so viele. Raik stellt es sich nur vor."),
    kr("Verbformen benannt", 1, "„wäre“ und „könnte“ stehen im Konjunktiv II (es genügt, eine der beiden Formen richtig zu benennen)."),
    kr("Bedeutung erklärt", 1, "Der Konjunktiv II zeigt: Das ist nicht wirklich so, sondern nur vorgestellt oder gewünscht.")
  ], "Nein, die Firma baut nicht doppelt so viele Nistkästen. „wäre“ und „könnte“ stehen im Konjunktiv II. Daran sieht man, dass Raik es sich nur ausmalt: Am Samstag ist der Werkraum in Wirklichkeit geschlossen.",
  SW_K2, { hilfe: HILFE_K2, hinweis: H_K2 })
];

/* ============================== M8, Variante A – Wortfeld Schulfest ============================== */
const M_A = [
  m(WORTART, [
    ["Das AUFRÄUMEN nach dem Fest übernimmt die Klasse 9a.", "Nomen"],
    ["OBWOHL es nieselt, bleiben die Gäste im Hof.", "Konjunktion"],
    ["DRAUSSEN stehen die Stände der fünften Klassen.", "Adverb"],
    ["NIEMAND wollte freiwillig den Abwasch übernehmen.", "Pronomen"],
    ["INNERHALB einer Stunde waren alle Lose verkauft.", "Präposition"],
    ["PST, gleich beginnt die Zaubershow!", "Interjektion"]], { points: 3, hinweis: H_WORTART_M }),
  c(doppel("Während", "Konjunktion"), [
    "WÄHREND die Jury die Stände bewertet, läuft im Hof schon die Tombola.",
    "WÄHREND der Siegerehrung stehen alle Helfer auf der Bühne.",
    "Zora verliert WÄHREND des Sackhüpfens einen Schuh.",
    "WÄHREND des ganzen Nachmittags spielt die Schulband."], 0, { hinweis: H_DOPPEL }),
  m(MODAL_M, [
    ["Jeder Stand IST nach dem Fest gründlich ZU REINIGEN.", "Notwendigkeit"],
    ["Du SOLLTEST die Kasse nie unbeaufsichtigt lassen.", "Ratschlag"],
    ["Der Regen DÜRFTE bis zum Nachmittag vorbei sein.", "Vermutung"],
    ["Die Klassensprecher DÜRFEN die Lautsprecheranlage bedienen.", "Erlaubnis"],
    ["Quirin KANN auf Stelzen laufen.", "Fähigkeit"],
    ["Die Rektorin hat angeordnet: Alle SOLLEN die Fluchtwege freihalten.", "Auftrag"]], { points: 3, hinweis: H_MODAL_M }),
  f(MUESSEN, [
    umbau("Die Stände sind bis 18 Uhr abzubauen.", [
      "Die Stände müssen bis 18 Uhr abgebaut werden.",
      "Bis 18 Uhr müssen die Stände abgebaut werden.",
      "Man muss die Stände bis 18 Uhr abbauen.",
      "Bis 18 Uhr muss man die Stände abbauen.",
      "Die Stände muss man bis 18 Uhr abbauen.",
      "Die Stände müssen bis 18 Uhr abgebaut sein.",
      "Bis 18 Uhr müssen die Stände abgebaut sein."]),
    umbau("Jede Klasse hat ihren Stand selbst aufzuräumen.", [
      "Jede Klasse muss ihren Stand selbst aufräumen.",
      "Ihren Stand muss jede Klasse selbst aufräumen."])
  ], { hinweis: H_MUESSEN }),
  m(MODUS, [
    ["Die SMV teilt mit, der Gewinn GEHE an die Partnerschule.", "Konjunktiv I"],
    ["Ohne den Förderverein GÄBE es keine Hüpfburg.", "Konjunktiv II"],
    ["Im letzten Jahr GAB es kein Feuerwerk.", "Indikativ"],
    ["Der Wirt des Getränkewagens behauptet, er WISSE nichts von einer Bestellung.", "Konjunktiv I"],
    ["Niemand WUSSTE, wo der Schlüssel zur Aula lag.", "Indikativ"],
    ["Thore WÜRDE am liebsten den ganzen Tag am Glücksrad stehen.", "Konjunktiv II"]], { points: 3, hinweis: H_MODUS }),
  f(KONJ_BILDEN, [
    luecke("Herr Reindl meint, die Bühne ___ rechtzeitig fertig.", "werden – Konjunktiv I", "werde"),
    luecke("Levke sagt, sie ___ noch die Plakate aufhängen.", "müssen – Konjunktiv I", "müsse"),
    luecke("___ ich doch nur etwas mehr Zeit für die Proben!", "haben – Konjunktiv II", "Hätte"),
    luecke("Wenn der Zauberer früher ___, bliebe mehr Zeit für die Tombola.", "kommen – Konjunktiv II", "käme")
  ], { hinweis: H_KONJ }),
  m(VERWENDUNG, [
    ["Bliebe es doch nur bis zum Abend trocken!", WUNSCH],
    ["Die Eltern sagen, sie wüssten nichts von einer Kuchenliste.", WIEDERGABE],
    ["Würden Sie bitte Ihr Auto vom Pausenhof fahren?", BITTE],
    ["Wenn die Aula doppelt so groß wäre, müsste niemand stehen.", UNWIRKLICH]], { points: 2, hinweis: H_VERWENDUNG }),
  f(INDIREKT_M, [
    umbau("Frau Okonkwo fragt Herrn Reindl: „Haben Sie meinen Schlüssel gesehen?“", ["Frau Okonkwo fragt Herrn Reindl, ob er ihren Schlüssel gesehen habe."]),
    rede("Die Neuntklässler sagen: „Wir können die Bühne allein aufbauen.“", "Die Neuntklässler sagen", "sie könnten die Bühne allein aufbauen", "sie die Bühne allein aufbauen könnten"),
    umbau("Der Reporter der Schülerzeitung fragt: „Wann beginnt die Zaubershow?“", ["Der Reporter der Schülerzeitung fragt, wann die Zaubershow beginne."])
  ], { hinweis: H_INDIREKT_M }),
  c(REDEVERB + " Tammo sagt etwas, kann es aber nicht beweisen: „Tammo ___, seine Klasse verkaufe die meisten Lose.“", [
    "behauptet", "fragt", "verspricht", "befiehlt"], 0, { hinweis: H_REDEVERB }),
  a("Vergleiche die beiden Sätze: „Die Fünftklässler müssen beim Abbau nicht helfen.“ – „Die Fünftklässler dürfen beim Abbau nicht helfen.“" + UNTERSCHIED, [
    kr("ersten Satz erklärt", 1, "„müssen nicht“: Es ist nicht nötig – die Fünftklässler können helfen, wenn sie wollen (freiwillig)."),
    kr("zweiten Satz erklärt", 1, "„dürfen nicht“: Es ist verboten bzw. nicht erlaubt – sie sollen auf keinen Fall mithelfen.")
  ], "Im ersten Satz ist das Helfen nicht nötig: Die Fünftklässler können mithelfen, wenn sie wollen. Im zweiten Satz ist es verboten: Sie sollen beim Abbau auf keinen Fall mit anpacken.",
  SW_NICHT, { hinweis: H_NICHT }),
  a("In der Schülerzeitung stehen zwei Fassungen: (1) „Der Bürgermeister sagt, die Stadt bezahlt die neue Bühne.“ (2) „Der Bürgermeister sagt, die Stadt bezahle die neue Bühne.“" + FASSUNG, [
    kr("richtig entschieden", 1, "Fassung 2 („bezahle“)."),
    kr("Verbform benannt", 1, "„bezahle“ ist Konjunktiv I, die Form der indirekten Rede („bezahlt“ ist Indikativ)."),
    kr("Wirkung erklärt", 1, "Der Konjunktiv I zeigt deutlich: Das ist nur die Aussage des Bürgermeisters. Die Zeitung gibt sie wieder, ohne selbst zu behaupten, dass es stimmt (sie bleibt neutral).")
  ], "Besser passt Fassung 2. „bezahle“ steht im Konjunktiv I, das ist die Form der indirekten Rede. Die Leser erkennen daran, dass die Zeitung nur wiedergibt, was der Bürgermeister gesagt hat, und es nicht selbst behauptet.",
  SW_WIRKUNG, { hinweis: H_K1 }),
  a("Die Technik-AG sagt: „Wir sammeln nach dem Fest alle Kabel ein.“ Thore schreibt dazu im Bericht: „Die Technik-AG sagt, sie sammeln nach dem Fest alle Kabel ein.“ Erkläre, warum die Leser an „sammeln“ die indirekte Rede nicht erkennen und warum auch „sammelten“ nicht hilft. Schreibe dann den Satz so auf, dass die Wiedergabe eindeutig ist.", [
    kr("Konjunktiv I = Indikativ erkannt", 1, "„sie sammeln“ lautet im Konjunktiv I genauso wie im Indikativ – man sieht nicht, dass es eine Wiedergabe ist."),
    kr("Konjunktiv II = Präteritum erkannt", 1, "„sie sammelten“ (Konjunktiv II) lautet wie das Präteritum – es klingt nach Vergangenheit und ist deshalb auch nicht eindeutig."),
    kr("Ersatzform genannt", 1, "Deshalb nimmt man die Umschreibung mit „würde“ + Infinitiv."),
    kr("Satz richtig gebildet", 1, "„Die Technik-AG sagt, sie würden nach dem Fest alle Kabel einsammeln.“ (auch: „…, dass sie nach dem Fest alle Kabel einsammeln würden.“)")
  ], "„sie sammeln“ sieht im Konjunktiv I genauso aus wie im Indikativ, deshalb erkennt man die indirekte Rede nicht. „sie sammelten“ ist zwar Konjunktiv II, sieht aber aus wie das Präteritum. Deshalb nimmt man die würde-Form: Die Technik-AG sagt, sie würden nach dem Fest alle Kabel einsammeln.",
  SW_ERSATZ, { hinweis: H_ERSATZ })
];

/* ============================== M8, Variante B – Wortfeld Schülerfirma ============================== */
const M_B = [
  m(WORTART, [
    ["JEMAND hat die Kasse nicht abgeschlossen.", "Pronomen"],
    ["NEBENAN liegt das Lager der Schülerfirma.", "Adverb"],
    ["HOPPLA, da fehlt ja eine Schraube!", "Interjektion"],
    ["Das KALKULIEREN der Preise fällt Rieke leicht.", "Nomen"],
    ["FALLS das Holz nicht reicht, bestellen wir nach.", "Konjunktion"],
    ["AUSSERHALB der Schulzeit bleibt der Werkraum zu.", "Präposition"]], { points: 3, hinweis: H_WORTART_M }),
  c(doppel("Seit", "Konjunktion"), [
    "SEIT die Firma einen Onlineshop hat, kommen Bestellungen aus dem ganzen Ort.",
    "SEIT den Osterferien arbeitet Nuri in der Buchhaltung.",
    "Die Firma schreibt SEIT einem halben Jahr schwarze Zahlen.",
    "SEIT dem ersten Verkaufstag führt Edda das Kassenbuch."], 0, { hinweis: H_DOPPEL }),
  m(MODAL_M, [
    ["Pelle KANN Preisschilder am Computer gestalten.", "Fähigkeit"],
    ["Das neue Holz DÜRFTE morgen geliefert werden.", "Vermutung"],
    ["Der Schulleiter hat festgelegt: Die Firma SOLL jeden Monat einen Bericht abgeben.", "Auftrag"],
    ["Jede Ausgabe IST im Kassenbuch ZU NOTIEREN.", "Notwendigkeit"],
    ["Nur Frau Steinbach DARF Geld vom Firmenkonto abheben.", "Erlaubnis"],
    ["Falk SOLLTE die Rechnungen besser zweimal prüfen.", "Ratschlag"]], { points: 3, hinweis: H_MODAL_M }),
  f(MUESSEN, [
    umbau("Die Rechnungen sind bis Monatsende zu bezahlen.", [
      "Die Rechnungen müssen bis Monatsende bezahlt werden.",
      "Bis Monatsende müssen die Rechnungen bezahlt werden.",
      "Man muss die Rechnungen bis Monatsende bezahlen.",
      "Bis Monatsende muss man die Rechnungen bezahlen.",
      "Die Rechnungen muss man bis Monatsende bezahlen.",
      "Die Rechnungen müssen bis Monatsende bezahlt sein.",
      "Bis Monatsende müssen die Rechnungen bezahlt sein."]),
    umbau("Jede Abteilung hat ihre Ausgaben genau aufzuschreiben.", [
      "Jede Abteilung muss ihre Ausgaben genau aufschreiben.",
      "Ihre Ausgaben muss jede Abteilung genau aufschreiben."])
  ], { hinweis: H_MUESSEN }),
  m(MODUS, [
    ["Gestern KAM eine Bestellung über zwanzig Schlüsselbretter.", "Indikativ"],
    ["Der Schreiner sagt, das Holz KOMME aus dem Stadtwald.", "Konjunktiv I"],
    ["Mit einer zweiten Säge GINGE die Arbeit viel schneller.", "Konjunktiv II"],
    ["Edda berichtet, der Kindergarten ZAHLE erst nächste Woche.", "Konjunktiv I"],
    ["Ohne die Holzspenden der Schreinerei KÄME die Firma nicht weit.", "Konjunktiv II"],
    ["Die erste Lieferung GING an den Kindergarten.", "Indikativ"]], { points: 3, hinweis: H_MODUS }),
  f(KONJ_BILDEN, [
    luecke("Frau Steinbach erklärt, der Werkraum ___ in den Ferien geschlossen.", "bleiben – Konjunktiv I", "bleibe"),
    luecke("Pelle sagt, er ___ die Lackfarben nur mit Handschuhen benutzen.", "dürfen – Konjunktiv I", "dürfe"),
    luecke("___ ich doch nur, wo der Kassenschlüssel liegt!", "wissen – Konjunktiv II", "Wüsste"),
    luecke("Wenn es im Ort einen Baumarkt ___, wäre die Lieferung kein Problem.", "geben – Konjunktiv II", "gäbe")
  ], { hinweis: H_KONJ }),
  m(VERWENDUNG, [
    ["Dürfte ich Sie um eine Unterschrift bitten?", BITTE],
    ["Die Kunden sagen, sie kämen gern wieder.", WIEDERGABE],
    ["Wäre der Werkraum doch nur jeden Tag frei!", WUNSCH],
    ["Wenn ein Schultag zwölf Stunden hätte, könnten wir doppelt so viel bauen.", UNWIRKLICH]], { points: 2, hinweis: H_VERWENDUNG }),
  f(INDIREKT_M, [
    umbau("Herr Krasniqi fragt Frau Steinbach: „Haben Sie meine Bestellung erhalten?“", ["Herr Krasniqi fragt Frau Steinbach, ob sie seine Bestellung erhalten habe."]),
    rede("Die Verkäufer sagen: „Wir müssen die Preise leicht erhöhen.“", "Die Verkäufer sagen", "sie müssten die Preise leicht erhöhen", "sie die Preise leicht erhöhen müssten"),
    umbau("Eine Kundin fragt: „Wie lange dauert die Lieferung?“", ["Eine Kundin fragt, wie lange die Lieferung dauere."])
  ], { hinweis: H_INDIREKT_M }),
  c(REDEVERB + " Edda ist sich nicht sicher, sie nimmt es nur an: „Edda ___, der Fehler liege in der Abrechnung vom Mai.“", [
    "vermutet", "befiehlt", "verspricht", "fragt"], 0, { hinweis: H_REDEVERB }),
  a("Vergleiche die beiden Sätze: „Die Praktikanten müssen die Kasse nicht zählen.“ – „Die Praktikanten dürfen die Kasse nicht zählen.“" + UNTERSCHIED, [
    kr("ersten Satz erklärt", 1, "„müssen nicht“: Es ist nicht nötig – die Praktikanten können die Kasse zählen, wenn sie wollen (freiwillig)."),
    kr("zweiten Satz erklärt", 1, "„dürfen nicht“: Es ist verboten bzw. nicht erlaubt – die Praktikanten sollen die Kasse auf keinen Fall zählen.")
  ], "Der erste Satz bedeutet: Niemand verlangt es von den Praktikanten, sie könnten die Kasse aber freiwillig zählen. Der zweite Satz ist ein Verbot: Sie sollen die Kasse gar nicht anfassen.",
  SW_NICHT, { hinweis: H_NICHT }),
  a("Im Jahresbericht stehen zwei Fassungen: (1) „Die Schulleiterin sagt, die Schülerfirma bekomme einen eigenen Raum.“ (2) „Die Schulleiterin sagt, die Schülerfirma bekommt einen eigenen Raum.“" + FASSUNG, [
    kr("richtig entschieden", 1, "Fassung 1 („bekomme“)."),
    kr("Verbform benannt", 1, "„bekomme“ ist Konjunktiv I, die Form der indirekten Rede („bekommt“ ist Indikativ)."),
    kr("Wirkung erklärt", 1, "Der Konjunktiv I zeigt deutlich: Das ist nur die Aussage der Schulleiterin. Der Bericht gibt sie wieder, ohne selbst zu behaupten, dass es stimmt (er bleibt neutral).")
  ], "In den Bericht gehört Fassung 1, denn „bekomme“ ist Konjunktiv I. An dieser Form sieht man sofort die indirekte Rede: Der Bericht gibt nur die Aussage der Schulleiterin weiter und legt sich nicht fest, ob es wirklich so kommt.",
  SW_WIRKUNG, { hinweis: H_K1 }),
  a("Die Werbeabteilung sagt: „Wir verteilen in der Pause 200 Flyer.“ Falk schreibt ins Protokoll: „Die Werbeabteilung sagt, sie verteilen in der Pause 200 Flyer.“ Erkläre, warum die Leser an „verteilen“ die indirekte Rede nicht erkennen und warum auch „verteilten“ nicht hilft. Schreibe dann den Satz so auf, dass die Wiedergabe eindeutig ist.", [
    kr("Konjunktiv I = Indikativ erkannt", 1, "„sie verteilen“ lautet im Konjunktiv I genauso wie im Indikativ – man sieht nicht, dass es eine Wiedergabe ist."),
    kr("Konjunktiv II = Präteritum erkannt", 1, "„sie verteilten“ (Konjunktiv II) lautet wie das Präteritum – es klingt nach Vergangenheit und ist deshalb auch nicht eindeutig."),
    kr("Ersatzform genannt", 1, "Deshalb nimmt man die Umschreibung mit „würde“ + Infinitiv."),
    kr("Satz richtig gebildet", 1, "„Die Werbeabteilung sagt, sie würden in der Pause 200 Flyer verteilen.“ (auch: „…, dass sie in der Pause 200 Flyer verteilen würden.“)")
  ], "Bei „sie verteilen“ sind Konjunktiv I und Indikativ gleich, man merkt also nicht, dass Falk nur etwas wiedergibt. Der Konjunktiv II „sie verteilten“ klingt wie das Präteritum. Eindeutig ist erst die würde-Form: Die Werbeabteilung sagt, sie würden in der Pause 200 Flyer verteilen.",
  SW_ERSATZ, { hinweis: H_ERSATZ })
];

const ALLE = {
  kurz: "Grammatik und Sprache I", scope: "Wortarten und Modalverben · Konjunktiv I und II · indirekte Rede", minutes: 40, texte: [],
  hinweis: "Arbeite allein. Lies jede Aufgabe genau: Dort steht, in welcher Form du antworten sollst. Wenn du ganze Sätze schreibst, zählen auch die Kommas. Deine Antworten werden laufend gespeichert. Nach der Abgabe kannst du nichts mehr ändern."
};
module.exports = {
  "d8-p6-r-a": probe(6, "R", "A", { ...ALLE, title: "Probe 6 (R8): Grammatik und Sprache I", items: R_A }),
  "d8-p6-r-b": probe(6, "R", "B", { ...ALLE, title: "Probe 6 (R8): Grammatik und Sprache I – Variante B", items: R_B }),
  "d8-p6-m-a": probe(6, "M", "A", { ...ALLE, title: "Probe 6 (M8): Grammatik und Sprache I", items: M_A }),
  "d8-p6-m-b": probe(6, "M", "B", { ...ALLE, title: "Probe 6 (M8): Grammatik und Sprache I – Variante B", items: M_B })
};
