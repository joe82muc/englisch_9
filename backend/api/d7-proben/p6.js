"use strict";

/**
 * Deutsch 7 · Probe 6: Grammatik I (Wortarten mit Relativ- und Demonstrativpronomen, M7 zusätzlich Reflexivpronomen ·
 * Zeitformen bestimmen und bilden bis Futur II · Aktiv und Passiv erkennen und umformen). LehrplanPLUS D7 4.2.
 * R7: 30 Punkte (Passiv im Präsens und Präteritum) · M7: 34 Punkte (Passiv auch im Perfekt und Futur I) · 40 Minuten.
 * Keine Lesetexte. Jede Fassung hat ihr eigenes Wortfeld, aus dem alle Beispielsätze stammen:
 * R7 A Sportfest · R7 B Wochenmarkt · M7 A Fahrradwerkstatt · M7 B Tierheim. Kein Satz steht in einem Lernmodul.
 * Bleibt auf dem Server (Lösungen). Bausteine: bau.js.
 */
const { c, m, f, feld, a, kr, probe } = require("./bau");

/* ------------------------------ Schreibhilfen ------------------------------ */
const gross = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const klein = (s) => s.charAt(0).toLowerCase() + s.slice(1);
// Lücke im Satz: Es zählt das Pronomen allein – oder der ganze Satz mit dem Pronomen.
const luecke = (satz, ...pronomen) => feld(satz, pronomen.concat(pronomen.map((p) => satz.replace("___", p))));
// Verbform: mit und ohne Subjekt
const form = (label, ...loesungen) => feld(label, loesungen);
// Satzumbau: ganzer Satz, 2 Punkte, alle vertretbaren Fassungen
const umbau = (satz, loesungen) => feld(satz, loesungen, { breit: true, punkte: 2 });
// Passivsatz in den üblichen Fassungen: mit dem Handelnden („von …“, auch vorangestellt) und ohne ihn.
// passiv("Der Rasen", "wird", ["vom Hausmeister", "von dem Hausmeister"], "gemäht")
const passiv = (subjekt, hilfsverb, von, rest) => {
  const vons = [].concat(von || []);
  return vons.map((v) => `${subjekt} ${hilfsverb} ${v} ${rest}.`)
    .concat([`${subjekt} ${hilfsverb} ${rest}.`])
    .concat(vons.map((v) => `${gross(v)} ${hilfsverb} ${klein(subjekt)} ${rest}.`));
};

/* ------------------------------ Aufgabenstellungen ------------------------------ */
const WORTART = "Welche Wortart hat das Wort in GROSSBUCHSTABEN? Ordne zu.";
const RELATIV = "Setze das passende Relativpronomen ein. Schreibe nur das fehlende Wort in das Feld.";
const DEMO = "In welchem Satz ist das Wort in GROSSBUCHSTABEN ein Demonstrativpronomen?";
const REFLEXIV = "In welchem Satz ist UNS ein Reflexivpronomen?";
const ZEITFORM = "In welcher Zeitform steht der Satz? Ordne zu.";
const VERBFORM = "Bilde die Verbform in der angegebenen Zeitform. Beispiel: ";
const FUTUR2 = "Setze den Satz ins Futur II.";
const AKTIV_PASSIV = "Aktiv oder Passiv? Ordne zu.";
const AKTIV_PASSIV_ZEIT = "Aktiv oder Passiv – und in welcher Zeitform? Ordne zu.";
const INS_PASSIV = "Forme die Sätze ins Passiv um. Die Zeitform bleibt gleich.";
const INS_PASSIV_M = "Forme die Sätze ins Passiv um. Die Zeitform bleibt gleich. Steht im Aktivsatz „man“, wird im Passivsatz kein Handelnder genannt.";
const INS_AKTIV = "Forme den Satz ins Aktiv um. Die Zeitform bleibt gleich.";
const WORAN_PASSIV = " Woran erkennst du, dass dieser Satz im Passiv steht? Erkläre.";
const WARUM_PASSIV = " Erkläre, warum das Passiv hier besser passt als ein Satz im Aktiv.";
const ZWEIMAL_WIRD = " Nur einer der beiden Sätze steht im Passiv. Erkläre, welcher es ist und woran du den Unterschied erkennst.";

/* ------------------------------ „Dein nächster Schritt“ ------------------------------ */
const H_WORTART = "Frage bei jedem Wort: Was leistet es im Satz – beschreibt es, verbindet es Sätze, zeigt es auf etwas oder leitet es einen Relativsatz ein?";
const H_RELATIV_R = "Suche das Nomen vor dem Komma und seinen Artikel (der, die, das); frage dann im Relativsatz „Wer?“ oder „Wen?“.";
const H_RELATIV_M = "Suche das Nomen, auf das sich das Pronomen bezieht, und frage im Relativsatz: Wen? Wem? Wessen?";
const H_DEMO = "Ein Demonstrativpronomen zeigt auf etwas Bestimmtes – prüfe bei jedem Satz, ob das Wort zeigt, einen Nebensatz einleitet oder nur das Nomen begleitet.";
const H_REFLEXIV = "Ein Reflexivpronomen bezieht sich auf das Subjekt zurück: Prüfe in jedem Satz, ob Subjekt und Pronomen dieselben Personen meinen.";
const H_ZEITFORM = "Achte auf die Hilfsverben (hat/ist, hatte/war, wird) und darauf, ob am Satzende ein Partizip II oder ein Infinitiv steht.";
const H_VERBFORM = "Überlege zuerst, welches Hilfsverb die Zeitform braucht (haben, sein oder werden), und bilde dann das Partizip II des Verbs.";
const H_FUTUR2_SINN = "Suche die Zeitangabe im Satz und frage dich: Was ist bis zu diesem Zeitpunkt schon erledigt?";
const H_FUTUR2_SATZ = "Das Futur II hat drei Teile: die Form von „werden“ an zweiter Stelle, am Satzende das Partizip II und „haben“ oder „sein“.";
const H_AKTIV_PASSIV = "Suche „werden“ + Partizip II – nur das ist Passiv; „werden“ + Infinitiv ist Futur I im Aktiv.";
const H_AKTIV_PASSIV_ZEIT = "Suche zuerst „werden“ + Partizip II (Passiv) und bestimme dann die Zeitform am Hilfsverb: wird, wurde, ist … worden, wird … werden.";
const H_INS_PASSIV_R = "Gehe in drei Schritten vor: Das Akkusativobjekt wird zum Subjekt, das Verb wird zu „werden“ + Partizip II, die Zeitform bleibt gleich.";
const H_INS_PASSIV_M = "Das Akkusativobjekt wird zum Subjekt, das Verb wird zu „werden“ + Partizip II – im Perfekt mit „worden“, im Futur I mit „werden“ am Satzende.";
const H_INS_AKTIV_R = "Frage: Wer tut etwas? Diese Person wird zum Subjekt, und das Verb steht ohne „werden“ in derselben Zeitform.";
const H_INS_AKTIV_M = "Der Handelnde hinter „von“ wird zum Subjekt; das Verb steht ohne „werden“ in derselben Zeitform, bei trennbaren Verben rückt der erste Teil ans Satzende.";

const HILFE_WORAN = "Sieh dir das Verb genau an: Aus welchen zwei Teilen besteht es?";
const HILFE_WARUM = "So kannst du beginnen: Das Passiv passt hier besser, weil man …";

/* ============================== R7, Variante A – Wortfeld Sportfest ============================== */
const R_A = [
  m(WORTART, [
    ["Herr Yilmaz STOPPT die Zeit.", "Verb"],
    ["Mila trägt ihre NEUEN Turnschuhe.", "Adjektiv"],
    ["Der Ball fliegt ÜBER das Netz.", "Präposition"],
    ["Wir klatschen, WEIL unsere Staffel vorne liegt.", "Konjunktion"],
    ["DIESE Bahn ist für die Sprinter frei.", "Demonstrativpronomen"],
    ["Der Lehrer, DER das Rennen startet, hebt die Hand.", "Relativpronomen"]], { points: 3, hinweis: H_WORTART }),
  f(RELATIV, [
    luecke("Die Schülerin, ___ als Erste ins Ziel kommt, bekommt eine Medaille.", "die", "welche"),
    luecke("Das Zelt, ___ neben der Laufbahn steht, gehört den Sanitätern.", "das", "welches"),
    luecke("Der Staffelstab, ___ wir verloren haben, liegt im Gras.", "den", "welchen")
  ], { hinweis: H_RELATIV_R }),
  c(DEMO, [
    "DIESEN Pokal bekommt die beste Klasse.",
    "Der Pokal, DER auf dem Tisch steht, glänzt golden.",
    "Sofia hält IHREN Pokal in die Höhe.",
    "EIN Pokal steht noch im Schrank."], 0, { hinweis: H_DEMO }),
  m(ZEITFORM, [
    ["Sofia hat drei Runden geschafft.", "Perfekt"],
    ["Herr Yilmaz pfeift das Fußballspiel an.", "Präsens"],
    ["Bis zum Abend werden die Helfer alles aufgeräumt haben.", "Futur II"],
    ["Die Klasse 7a zog kräftig am Seil.", "Präteritum"],
    ["Vor dem Start hatten alle ihre Schuhe gebunden.", "Plusquamperfekt"],
    ["Nach der Pause wird der Staffellauf beginnen.", "Futur I"]], { points: 3, hinweis: H_ZEITFORM }),
  f(VERBFORM + "ich (turnen) – Präsens → ich turne", [
    form("wir (fallen) – Perfekt", "wir sind gefallen", "sind gefallen"),
    form("Mila (werfen) – Präteritum", "Mila warf", "warf", "sie warf"),
    form("ich (gewinnen) – Plusquamperfekt", "ich hatte gewonnen", "hatte gewonnen"),
    form("er (jubeln) – Futur II", "er wird gejubelt haben", "wird gejubelt haben")
  ], { hinweis: H_VERBFORM }),
  c("„Bis zur Siegerehrung wird Frau Brandt alle Urkunden unterschrieben haben.“ Was sagt dieser Satz aus?", [
    "Bei der Siegerehrung sind alle Urkunden schon unterschrieben.",
    "Frau Brandt unterschreibt die Urkunden erst nach der Siegerehrung.",
    "Frau Brandt hat die Urkunden schon gestern unterschrieben.",
    "Frau Brandt unterschreibt die Urkunden gerade."], 0, { hinweis: H_FUTUR2_SINN }),
  m(AKTIV_PASSIV, [
    ["Die Sandgrube wird frisch geharkt.", "Passiv"],
    ["Die Zuschauer feuern die Läufer an.", "Aktiv"],
    ["Die Ergebnisse wurden laut vorgelesen.", "Passiv"],
    ["Nach dem Sportfest wird die Klasse 7b feiern.", "Aktiv"]], { points: 2, hinweis: H_AKTIV_PASSIV }),
  f(INS_PASSIV, [
    umbau("Die Trainerin misst die Weite.", passiv("Die Weite", "wird", "von der Trainerin", "gemessen")),
    umbau("Der Hausmeister mäht den Rasen.", passiv("Der Rasen", "wird", ["vom Hausmeister", "von dem Hausmeister"], "gemäht")),
    umbau("Die Helfer zählten die Punkte.", passiv("Die Punkte", "wurden", "von den Helfern", "gezählt"))
  ], { hinweis: H_INS_PASSIV_R }),
  f(INS_AKTIV, [
    umbau("Der Ball wird von Noah gefangen.", ["Noah fängt den Ball.", "Den Ball fängt Noah."])
  ], { hinweis: H_INS_AKTIV_R }),
  a("„Die Hürden wurden in der Pause aufgestellt.“" + WORAN_PASSIV, [
    kr("Verbform genannt", 1, "Das Verb besteht aus einer Form von „werden“ („wurden“) und dem Partizip II („aufgestellt“)."),
    kr("Bedeutung erklärt", 1, "Mit den Hürden geschieht etwas, sie tun selbst nichts – oder: Der Satz sagt nicht, wer die Hürden aufgestellt hat.")
  ], "Das Verb besteht aus zwei Teilen: „wurden“ (eine Form von „werden“) und dem Partizip II „aufgestellt“. Außerdem sagt der Satz nicht, wer die Hürden aufgestellt hat.",
  ["werden|hilfsverb|partizip|mittelwort", "wer es|wer das|wer die|handel|jemand|selbst|täter"], { hilfe: HILFE_WORAN }),
  a("In der Schülerzeitung steht: „Während des Sportfests wurde ein Fenster der Turnhalle beschädigt.“" + WARUM_PASSIV, [
    kr("Grund genannt", 2, "Man weiß nicht, wer das Fenster beschädigt hat (der Handelnde ist unbekannt). 2 Punkte für den klar erklärten Grund, 1 Punkt, wenn er nur angedeutet ist."),
    kr("gesagt, was im Mittelpunkt steht", 1, "Wichtig ist, was geschehen ist: das beschädigte Fenster, nicht der Handelnde.")
  ], "Man weiß nicht, wer das Fenster beschädigt hat. Deshalb kann man niemanden nennen. Wichtig ist, was passiert ist: Das Fenster ist kaputt.",
  ["weiß nicht|weiß man nicht|nicht weiß|unbekannt|nicht bekannt|niemand weiß|keiner weiß|weiß keiner|weiß niemand", "wer es|wer das|wer den|wer die|täter|handel|jemand", "passiert|geschehen|geschah|mittelpunkt|vorgang"], { hilfe: HILFE_WARUM })
];

/* ============================== R7, Variante B – Wortfeld Wochenmarkt ============================== */
const R_B = [
  m(WORTART, [
    ["Der Käsestand steht NEBEN dem Brunnen.", "Präposition"],
    ["DIESER Stand gehört einer Bäuerin aus dem Nachbarort.", "Demonstrativpronomen"],
    ["Die Händlerin PACKT die Tomaten in eine Tüte.", "Verb"],
    ["Der Mann, DER die Eier sortiert, pfeift ein Lied.", "Relativpronomen"],
    ["Auf dem Markt duftet es nach FRISCHEM Brot.", "Adjektiv"],
    ["Wir holen Kirschen, WEIL sie heute günstig sind.", "Konjunktion"]], { points: 3, hinweis: H_WORTART }),
  f(RELATIV, [
    luecke("Das Brot, ___ im Korb liegt, ist noch warm.", "das", "welches"),
    luecke("Der Käse, ___ wir ausgesucht haben, riecht kräftig.", "den", "welchen"),
    luecke("Die Händlerin, ___ frische Blumen anbietet, kennt alle Kunden.", "die", "welche")
  ], { hinweis: H_RELATIV_R }),
  c(DEMO, [
    "DIESEN Honig mag Opa am liebsten.",
    "Der Honig, DER im Regal steht, kommt vom Imker.",
    "Opa stellt SEINEN Honig in den Korb.",
    "EIN Glas Honig kostet heute fünf Euro."], 0, { hinweis: H_DEMO }),
  m(ZEITFORM, [
    ["Am Samstag wird der Markt früher öffnen.", "Futur I"],
    ["Der Bäcker gab mir eine Brezel.", "Präteritum"],
    ["Opa hat zwei Gläser Marmelade bezahlt.", "Perfekt"],
    ["Bis zum Mittag wird der Regen aufgehört haben.", "Futur II"],
    ["Frau Aksoy stapelt die Kisten hinter dem Stand.", "Präsens"],
    ["Vor dem Einkauf hatte Ida einen Zettel geschrieben.", "Plusquamperfekt"]], { points: 3, hinweis: H_ZEITFORM }),
  f(VERBFORM + "ich (winken) – Präsens → ich winke", [
    form("wir (bleiben) – Perfekt", "wir sind geblieben", "sind geblieben"),
    form("Opa (nehmen) – Präteritum", "Opa nahm", "nahm", "er nahm"),
    form("ich (helfen) – Plusquamperfekt", "ich hatte geholfen", "hatte geholfen"),
    form("er (kaufen) – Futur II", "er wird gekauft haben", "wird gekauft haben")
  ], { hinweis: H_VERBFORM }),
  c("„Bis zwölf Uhr wird der Fischhändler seinen Stand abgebaut haben.“ Was sagt dieser Satz aus?", [
    "Um zwölf Uhr ist der Stand des Fischhändlers schon abgebaut.",
    "Der Fischhändler baut seinen Stand erst nach zwölf Uhr ab.",
    "Der Fischhändler hat seinen Stand schon gestern abgebaut.",
    "Der Fischhändler baut seinen Stand gerade ab."], 0, { hinweis: H_FUTUR2_SINN }),
  m(AKTIV_PASSIV, [
    ["Der Bauer lobt seine Kartoffeln.", "Aktiv"],
    ["Die Gurken werden in Kisten geliefert.", "Passiv"],
    ["Am Nachmittag wird die Bäuerin nach Hause fahren.", "Aktiv"],
    ["Die Marktstände wurden früh aufgebaut.", "Passiv"]], { points: 2, hinweis: H_AKTIV_PASSIV }),
  f(INS_PASSIV, [
    umbau("Der Bäcker füllt den Korb.", passiv("Der Korb", "wird", ["vom Bäcker", "von dem Bäcker"], "gefüllt")),
    umbau("Die Verkäuferin wiegt die Melone.", passiv("Die Melone", "wird", "von der Verkäuferin", "gewogen")),
    umbau("Die Händler senkten die Preise.", passiv("Die Preise", "wurden", "von den Händlern", "gesenkt"))
  ], { hinweis: H_INS_PASSIV_R }),
  f(INS_AKTIV, [
    umbau("Der Kürbis wird von Ida getragen.", ["Ida trägt den Kürbis.", "Den Kürbis trägt Ida."])
  ], { hinweis: H_INS_AKTIV_R }),
  a("„Die Kisten wurden am Morgen ausgeladen.“" + WORAN_PASSIV, [
    kr("Verbform genannt", 1, "Das Verb besteht aus einer Form von „werden“ („wurden“) und dem Partizip II („ausgeladen“)."),
    kr("Bedeutung erklärt", 1, "Mit den Kisten geschieht etwas, sie tun selbst nichts – oder: Der Satz sagt nicht, wer die Kisten ausgeladen hat.")
  ], "Im Satz steht eine Form von „werden“ zusammen mit dem Partizip II: „wurden … ausgeladen“. Man erfährt nicht, wer die Kisten ausgeladen hat.",
  ["werden|hilfsverb|partizip|mittelwort", "wer es|wer das|wer die|handel|jemand|selbst|täter"], { hilfe: HILFE_WORAN }),
  a("Im Gemeindeblatt steht: „In der Nacht vor dem Markttag wurde ein Verkaufswagen aufgebrochen.“" + WARUM_PASSIV, [
    kr("Grund genannt", 2, "Man weiß nicht, wer den Verkaufswagen aufgebrochen hat (der Handelnde ist unbekannt). 2 Punkte für den klar erklärten Grund, 1 Punkt, wenn er nur angedeutet ist."),
    kr("gesagt, was im Mittelpunkt steht", 1, "Wichtig ist, was geschehen ist: der aufgebrochene Verkaufswagen, nicht der Handelnde.")
  ], "Niemand weiß, wer den Verkaufswagen aufgebrochen hat, also kann man den Täter nicht nennen. Im Mittelpunkt steht, was in der Nacht geschehen ist.",
  ["weiß nicht|weiß man nicht|nicht weiß|unbekannt|nicht bekannt|niemand weiß|keiner weiß|weiß keiner|weiß niemand", "wer es|wer das|wer den|wer die|täter|handel|jemand", "passiert|geschehen|geschah|mittelpunkt|vorgang"], { hilfe: HILFE_WARUM })
];

/* ============================== M7, Variante A – Wortfeld Fahrradwerkstatt ============================== */
const M_A = [
  m(WORTART, [
    ["Die Werkstatt öffnet MORGENS um acht Uhr.", "Adverb"],
    ["Das Werkzeug hängt AN der Wand.", "Präposition"],
    ["Frau Okafor sagt, DASS die Klingel fehlt.", "Konjunktion"],
    ["Der Ständer wackelt. DEN müssen wir festschrauben.", "Demonstrativpronomen"],
    ["Die Zange, DIE auf der Werkbank liegt, ist neu.", "Relativpronomen"],
    ["Tarik ärgert SICH über den platten Reifen.", "Reflexivpronomen"]], { points: 3, hinweis: H_WORTART }),
  f(RELATIV, [
    luecke("Der Helm, ___ wir gestern bestellt haben, ist schon da.", "den", "welchen"),
    luecke("Dort wartet der Kunde, ___ das rote Rennrad gehört.", "dem", "welchem"),
    luecke("Die Lehrlinge, ___ die Arbeit Spaß macht, bleiben oft länger.", "denen", "welchen"),
    luecke("Das Rad, ___ Lenker verbogen ist, steht in der Ecke.", "dessen")
  ], { hinweis: H_RELATIV_M }),
  c(REFLEXIV, [
    "Wir beeilen UNS mit der Reparatur.",
    "Die Meisterin zeigt UNS die neue Bremse.",
    "Der Kunde ruft UNS morgen an.",
    "Dieses Werkzeug gehört UNS."], 0, { hinweis: H_REFLEXIV }),
  m(ZEITFORM, [
    ["Die Lieferung ist am Vormittag angekommen.", "Perfekt"],
    ["Nächste Woche wird die Werkstatt neue Helme anbieten.", "Futur I"],
    ["Gestern rief ein Kunde wegen seiner Bremse an.", "Präteritum"],
    ["Bis Freitag wird der Lehrling alle Speichen gespannt haben.", "Futur II"],
    ["Tarik zieht die Schrauben am Sattel fest.", "Präsens"],
    ["Vor der Probefahrt hatte Mira das Licht geprüft.", "Plusquamperfekt"]], { points: 3, hinweis: H_ZEITFORM }),
  f(VERBFORM + "ich (schrauben) – Präsens → ich schraube", [
    form("er (schieben) – Präteritum", "er schob", "schob"),
    form("die Kette (reißen) – Perfekt", "die Kette ist gerissen", "ist gerissen", "sie ist gerissen"),
    form("wir (absteigen) – Plusquamperfekt", "wir waren abgestiegen", "waren abgestiegen"),
    form("ihr (bremsen) – Futur II", "ihr werdet gebremst haben", "werdet gebremst haben")
  ], { hinweis: H_VERBFORM }),
  f(FUTUR2, [
    umbau("Bis Samstag flickt Tarik alle Reifen.", [
      "Bis Samstag wird Tarik alle Reifen geflickt haben.",
      "Tarik wird bis Samstag alle Reifen geflickt haben.",
      "Tarik wird alle Reifen bis Samstag geflickt haben.",
      "Alle Reifen wird Tarik bis Samstag geflickt haben."])
  ], { hinweis: H_FUTUR2_SATZ }),
  m(AKTIV_PASSIV_ZEIT, [
    ["Die Kette wird regelmäßig geölt.", "Passiv im Präsens"],
    ["Der Paketbote ist schon weggefahren.", "Aktiv im Perfekt"],
    ["Das Rad wird morgen abgeholt werden.", "Passiv im Futur I"],
    ["Das Schaufenster wurde neu gestaltet.", "Passiv im Präteritum"],
    ["Mira wird den Gepäckträger anschrauben.", "Aktiv im Futur I"],
    ["Der Sattel ist höher gestellt worden.", "Passiv im Perfekt"]], { points: 3, hinweis: H_AKTIV_PASSIV_ZEIT }),
  f(INS_PASSIV_M, [
    umbau("Die Meisterin wechselte den Schlauch.", passiv("Der Schlauch", "wurde", "von der Meisterin", "gewechselt")),
    umbau("Man hat die Bremsen geprüft.", passiv("Die Bremsen", "sind", null, "geprüft worden")),
    umbau("Der Lehrling wird die Felgen säubern.", passiv("Die Felgen", "werden", ["vom Lehrling", "von dem Lehrling"], "gesäubert werden"))
  ], { hinweis: H_INS_PASSIV_M }),
  f(INS_AKTIV, [
    umbau("Der Kindersitz wird von Frau Okafor abgenommen.", ["Frau Okafor nimmt den Kindersitz ab.", "Den Kindersitz nimmt Frau Okafor ab."])
  ], { hinweis: H_INS_AKTIV_M }),
  a("In einer Anleitung der Werkstatt steht: „Zuerst wird das Hinterrad ausgebaut. Dann wird der Mantel abgezogen.“ Erkläre, warum in Anleitungen oft das Passiv steht. Gehe dabei auf den Handelnden ein.", [
    kr("Rolle des Handelnden erklärt", 2, "Es ist nicht wichtig (und nicht festgelegt), wer die Arbeit ausführt: Die Anleitung gilt für jeden, deshalb wird der Handelnde weggelassen. 2 Punkte für die klare Erklärung, 1 Punkt, wenn sie nur angedeutet ist."),
    kr("gesagt, worauf es in der Anleitung ankommt", 1, "Im Mittelpunkt steht der Vorgang: was der Reihe nach mit dem Rad gemacht wird.")
  ], "In einer Anleitung ist nicht wichtig, wer die Arbeit macht, denn sie gilt für jeden. Deshalb wird der Handelnde weggelassen. Wichtig sind nur die Arbeitsschritte: Was wird der Reihe nach gemacht?",
  ["nicht wichtig|unwichtig|egal|jeder|jede person|nicht genannt|weggelassen|fehlt", "vorgang|schritt|was gemacht|was getan|was passiert|ablauf|reihenfolge|reihe nach|tätigkeit"]),
  a("Vergleiche: „Die Klingel wird angebracht.“ – „Die Klingel wird läuten.“" + ZWEIMAL_WIRD, [
    kr("Passivsatz richtig bestimmt", 1, "Der erste Satz („Die Klingel wird angebracht.“) steht im Passiv."),
    kr("Passivform erklärt", 1, "„wird“ + Partizip II („angebracht“) – mit der Klingel geschieht etwas."),
    kr("den anderen Satz erklärt", 1, "„wird“ + Infinitiv („läuten“) ist Futur I im Aktiv: Die Klingel tut selbst etwas.")
  ], "Der erste Satz steht im Passiv, weil dort „wird“ mit dem Partizip II „angebracht“ steht: Mit der Klingel geschieht etwas. Im zweiten Satz steht „wird“ mit dem Infinitiv „läuten“ – das ist Futur I im Aktiv.",
  ["erste|ersten|erster|1. satz|satz 1", "partizip|mittelwort", "infinitiv|grundform|futur|zukunft"])
];

/* ============================== M7, Variante B – Wortfeld Tierheim ============================== */
const M_B = [
  m(WORTART, [
    ["Die Leinen hängen NEBEN der Tür.", "Präposition"],
    ["Der Welpe fürchtet SICH vor dem Staubsauger.", "Reflexivpronomen"],
    ["Die Pflegerin kommt ABENDS noch einmal vorbei.", "Adverb"],
    ["Die Hündin, DIE neu gekommen ist, frisst noch wenig.", "Relativpronomen"],
    ["Nuria erzählt, DASS der Igel wieder gesund ist.", "Konjunktion"],
    ["Der Korb ist zu klein. DEN tauschen wir aus.", "Demonstrativpronomen"]], { points: 3, hinweis: H_WORTART }),
  f(RELATIV, [
    luecke("Dort sitzt der Hund, ___ der grüne Napf gehört.", "dem", "welchem"),
    luecke("Die Katze, ___ Pfote verletzt ist, liegt im Körbchen.", "deren"),
    luecke("Der Hamster, ___ wir gestern aufgenommen haben, ist ganz zahm.", "den", "welchen"),
    luecke("Die Welpen, ___ das neue Futter schmeckt, wachsen schnell.", "denen", "welchen")
  ], { hinweis: H_RELATIV_M }),
  c(REFLEXIV, [
    "Wir kümmern UNS um die jungen Katzen.",
    "Die Pflegerin zeigt UNS den Auslauf.",
    "Der alte Hund begrüßt UNS am Zaun.",
    "Die Futterspende hilft UNS sehr."], 0, { hinweis: H_REFLEXIV }),
  m(ZEITFORM, [
    ["Im Sommer wird das Tierheim ein Fest feiern.", "Futur I"],
    ["Die Pflegerin schließt jeden Abend die Käfige ab.", "Präsens"],
    ["Vor der Fütterung hatte Nuria die Näpfe gespült.", "Plusquamperfekt"],
    ["Zwei Kaninchen sind am Montag neu eingezogen.", "Perfekt"],
    ["Bis Weihnachten werden viele Tiere ein Zuhause gefunden haben.", "Futur II"],
    ["Gestern lief ein junger Hund durch das offene Tor.", "Präteritum"]], { points: 3, hinweis: H_ZEITFORM }),
  f(VERBFORM + "ich (helfen) – Präsens → ich helfe", [
    form("er (kriechen) – Präteritum", "er kroch", "kroch"),
    form("der Hund (fliehen) – Perfekt", "der Hund ist geflohen", "ist geflohen", "er ist geflohen"),
    form("wir (einschlafen) – Plusquamperfekt", "wir waren eingeschlafen", "waren eingeschlafen"),
    form("ihr (füttern) – Futur II", "ihr werdet gefüttert haben", "werdet gefüttert haben")
  ], { hinweis: H_VERBFORM }),
  f(FUTUR2, [
    umbau("Bis Sonntag bürstet Nuria alle Hunde.", [
      "Bis Sonntag wird Nuria alle Hunde gebürstet haben.",
      "Nuria wird bis Sonntag alle Hunde gebürstet haben.",
      "Nuria wird alle Hunde bis Sonntag gebürstet haben.",
      "Alle Hunde wird Nuria bis Sonntag gebürstet haben."])
  ], { hinweis: H_FUTUR2_SATZ }),
  m(AKTIV_PASSIV_ZEIT, [
    ["Die Tierärztin wird den Igel verbinden.", "Aktiv im Futur I"],
    ["Der Zaun wurde im Frühjahr erneuert.", "Passiv im Präteritum"],
    ["Der Auslauf ist gründlich gekehrt worden.", "Passiv im Perfekt"],
    ["Die Hunde werden zweimal täglich ausgeführt.", "Passiv im Präsens"],
    ["Die Handwerker sind schon gegangen.", "Aktiv im Perfekt"],
    ["Das Katzenhaus wird nächstes Jahr vergrößert werden.", "Passiv im Futur I"]], { points: 3, hinweis: H_AKTIV_PASSIV_ZEIT }),
  f(INS_PASSIV_M, [
    umbau("Man hat die Käfige gereinigt.", passiv("Die Käfige", "sind", null, "gereinigt worden")),
    umbau("Der Pfleger wird die Näpfe füllen.", passiv("Die Näpfe", "werden", ["vom Pfleger", "von dem Pfleger"], "gefüllt werden")),
    umbau("Die Tierärztin impfte den Kater.", passiv("Der Kater", "wurde", "von der Tierärztin", "geimpft"))
  ], { hinweis: H_INS_PASSIV_M }),
  f(INS_AKTIV, [
    umbau("Der Besucher wird von Frau Lindner angesprochen.", ["Frau Lindner spricht den Besucher an.", "Den Besucher spricht Frau Lindner an."])
  ], { hinweis: H_INS_AKTIV_M }),
  a("Auf einem Aushang im Tierheim steht: „Zuerst wird das Gehege gefegt. Danach wird frisches Stroh verteilt.“ Erkläre, warum auf solchen Aushängen oft das Passiv steht. Gehe dabei auf den Handelnden ein.", [
    kr("Rolle des Handelnden erklärt", 2, "Es ist nicht wichtig (und nicht festgelegt), wer die Arbeit ausführt: Der Aushang gilt für alle, die Dienst haben, deshalb wird der Handelnde weggelassen. 2 Punkte für die klare Erklärung, 1 Punkt, wenn sie nur angedeutet ist."),
    kr("gesagt, worauf es auf dem Aushang ankommt", 1, "Im Mittelpunkt steht der Vorgang: was der Reihe nach im Gehege gemacht wird.")
  ], "Auf dem Aushang ist egal, wer gerade Dienst hat – die Schritte gelten für alle Helfer. Deshalb wird niemand genannt. Es kommt nur darauf an, was getan wird und in welcher Reihenfolge.",
  ["nicht wichtig|unwichtig|egal|jeder|jede person|nicht genannt|weggelassen|fehlt", "vorgang|schritt|was gemacht|was getan|was passiert|ablauf|reihenfolge|reihe nach|tätigkeit"]),
  a("Vergleiche: „Die Katze wird fauchen.“ – „Die Katze wird gewogen.“" + ZWEIMAL_WIRD, [
    kr("Passivsatz richtig bestimmt", 1, "Der zweite Satz („Die Katze wird gewogen.“) steht im Passiv."),
    kr("Passivform erklärt", 1, "„wird“ + Partizip II („gewogen“) – mit der Katze geschieht etwas."),
    kr("den anderen Satz erklärt", 1, "„wird“ + Infinitiv („fauchen“) ist Futur I im Aktiv: Die Katze tut selbst etwas.")
  ], "Im Passiv steht der zweite Satz: „wird“ + Partizip II „gewogen“ – mit der Katze wird etwas gemacht. Der erste Satz ist Futur I im Aktiv, denn nach „wird“ folgt der Infinitiv „fauchen“.",
  ["zweite|zweiten|zweiter|2. satz|satz 2", "partizip|mittelwort", "infinitiv|grundform|futur|zukunft"])
];

const ALLE = { kurz: "Grammatik I", scope: "Wortarten und Pronomen · Zeitformen · Aktiv und Passiv", minutes: 40, texte: [] };
module.exports = {
  "d7-p6-r-a": probe(6, "R", "A", { ...ALLE, title: "Probe 6 (R7): Grammatik I", items: R_A }),
  "d7-p6-r-b": probe(6, "R", "B", { ...ALLE, title: "Probe 6 (R7): Grammatik I – Variante B", items: R_B }),
  "d7-p6-m-a": probe(6, "M", "A", { ...ALLE, title: "Probe 6 (M7): Grammatik I", items: M_A }),
  "d7-p6-m-b": probe(6, "M", "B", { ...ALLE, title: "Probe 6 (M7): Grammatik I – Variante B", items: M_B })
};
