"use strict";

/**
 * Deutsch 8 · Probe 5: Aufsatz – die begründete Stellungnahme (kurze Vorarbeit zum Argument, dann der eigene Text).
 * LehrplanPLUS D8 3.2 (Argumente formulieren und gewichten, Schlüsse ziehen, begründete Stellungnahme; M8: auf
 * Gegenargumente eingehen, Adverbialsätze zur Verknüpfung), 3.1 (Schreibplan), 3.3 (überarbeiten).
 * R8: 32 Punkte · M8: 42 Punkte · 60 Minuten. Die Schreibaufgabe hat ein Planungswerkzeug (form) – die Planung wird
 * aufbewahrt, aber nicht bewertet. Variante A: Sozialpraktikum, Variante B: Klassenzimmer selbst reinigen.
 * Alle Situationen sind erfunden. Bleibt auf dem Server (Erwartungshorizont). Bausteine: bau.js.
 */
const { c, m, o, a, kr, s, probe } = require("./bau");

/* ------------------------------ gemeinsame Formulierungen ------------------------------ */
const BAUSTEINE = "Aus welchen Bausteinen besteht dieses Argument? Ordne jedem Satz den passenden Baustein zu.";
const BAUSTEINE_HINWEIS = "Die Behauptung sagt, was stimmen soll. Die Begründung erklärt es (weil, denn). Das Beispiel zeigt einen einzelnen Fall. Die Schlussfolgerung zieht das Ergebnis (deshalb, also).";
const THESE_HINWEIS = "Eine These ist ein Standpunkt: Sie sagt klar, wofür oder wogegen jemand ist.";
const FOLGE = "In welcher Reihenfolge stehen diese Sätze in einer gut aufgebauten Stellungnahme? Ordne sie.";
const FOLGE_HINWEIS = "Einleitung: Streitfrage und Meinung. Hauptteil: Argumente, das stärkste zuletzt. Schluss: Zusammenfassung und Bitte.";
const FOLGE_M = "Diese vier Sätze stammen aus einer Stellungnahme. Bringe sie in die Reihenfolge, in der sie im Text stehen.";
const FOLGE_M_HINWEIS = "Achte auf die Signalwörter: „Zunächst“ eröffnet den Hauptteil, „Trotz dieser …“ greift nach den Argumenten den Einwand auf, „Wägt man ab“ leitet den Schluss ein.";
const HILFE_R = "Satzanfänge: Meiner Meinung nach … · Erstens … · Außerdem … · Am wichtigsten ist, dass … · Deshalb …";

// Bewertungsraster der Schreibaufgabe (R8: 20 Punkte, M8: 26 Punkte)
const RASTER_R = (thema) => [
  kr("Inhalt: Meinung und Argumente", 8, "Die Meinung zu „" + thema + "“ ist klar. Drei Argumente passen zur Streitfrage; jedes hat eine Begründung und ein Beispiel. 8: drei vollständige Argumente · 5–6: drei Argumente, Begründung oder Beispiel fehlt teilweise · 3–4: zwei Argumente oder nur Behauptungen · 1–2: Meinung erkennbar, kaum begründet."),
  kr("Aufbau", 4, "Einleitung mit Streitfrage und Meinung, Hauptteil mit erkennbaren Absätzen, das stärkste Argument am Schluss, Schluss ohne neues Argument. 4: alles da · 2–3: ein Teil fehlt oder die Reihenfolge ist beliebig · 1: kaum gegliedert."),
  kr("Sprache und Verknüpfung", 4, "Sachlicher Ton, passend für die Schulleitung; Verknüpfungswörter (erstens, außerdem, deshalb, weil); abwechslungsreiche Satzanfänge. 4: durchgehend · 2–3: teilweise · 1: Umgangssprache, Sätze stehen unverbunden."),
  kr("Sprachrichtigkeit", 4, "Rechtschreibung, Zeichensetzung und Grammatik. 4: fast fehlerfrei · 3: einzelne Fehler · 2: mehrere Fehler, gut lesbar · 1: viele Fehler · 0: kaum lesbar.", { rs: true })
];
const RASTER_M = (thema) => [
  kr("Inhalt: These und Argumente", 9, "Die These zu „" + thema + "“ ist eindeutig. Drei stichhaltige Argumente in steigernder Reihenfolge, jedes mit Begründung und Beispiel oder Beleg. 9: drei vollständige, überzeugende Argumente · 6–7: drei Argumente, eines dünn begründet · 4–5: zwei Argumente oder Beispiele fehlen · 1–3: überwiegend Behauptungen."),
  kr("Gegenargument und Abwägung", 4, "Ein ernst zu nehmender Einwand der Gegenseite wird genannt und sachlich entkräftet; der Schluss wägt ab. 4: Einwand genannt, entkräftet, abgewogen · 2–3: Einwand genannt, aber nur behauptet, dass er nicht zählt · 1: Gegenseite nur erwähnt · 0: fehlt."),
  kr("Aufbau", 4, "Einleitung führt zum Thema und nennt die These; Hauptteil in Absätzen, steigernd; Schluss mit Fazit und Appell, ohne neues Argument. 4: alles da · 2–3: ein Teil fehlt · 1: kaum gegliedert."),
  kr("Sprache und Verknüpfung", 5, "Sachlich und adressatengerecht; Gedanken sind verknüpft (zunächst, hinzu kommt, allerdings, deshalb; Adverbialsätze mit weil, obwohl, sodass, damit); treffender Wortschatz. 5: durchgehend · 3–4: überwiegend · 1–2: einfache Reihung, Wiederholungen."),
  kr("Sprachrichtigkeit", 4, "Rechtschreibung, Zeichensetzung und Grammatik. 4: fast fehlerfrei · 3: einzelne Fehler · 2: mehrere Fehler, gut lesbar · 1: viele Fehler · 0: kaum lesbar.", { rs: true })
];

/* ------------------------------ R8, Variante A: Sozialpraktikum ------------------------------ */
const R_A = probe(5, "R", "A", {
  title: "Probe 5 (R8): Begründete Stellungnahme", kurz: "Aufsatz: Stellungnahme", scope: "Schreiben: Argument aufbauen, begründete Stellungnahme", minutes: 60,
  hinweis: "Arbeite allein. Löse zuerst die kurzen Aufgaben, dann schreibst du deinen Text. Bei der Schreibaufgabe hilft dir „Meine Planung“. Dein Text wird laufend gespeichert. Nach der Abgabe kannst du nichts mehr ändern.",
  texte: [],
  items: [
    c("Welcher Satz ist eine These (ein klarer Standpunkt)?", ["Jede achte Klasse sollte eine Woche lang in einer sozialen Einrichtung mithelfen.", "In unserer Stadt gibt es zwei Seniorenheime und fünf Kindergärten.", "Was ist eigentlich ein Sozialpraktikum?"], 0, { hinweis: THESE_HINWEIS }),
    m(BAUSTEINE, [
      ["Ein Sozialpraktikum macht selbstständiger.", "Behauptung"],
      ["Im Seniorenheim muss man nämlich allein auf fremde Menschen zugehen.", "Begründung"],
      ["Meine Schwester hat dort jeden Nachmittag eine Spielerunde geleitet.", "Beispiel"],
      ["Deshalb traut man sich danach mehr zu.", "Schlussfolgerung"]
    ], { hinweis: BAUSTEINE_HINWEIS }),
    o(FOLGE, [
      "An unserer Schule wird über ein Sozialpraktikum für alle achten Klassen gesprochen. Ich bin dafür.",
      "Erstens lernt man dabei Berufe kennen, in denen man mit Menschen arbeitet.",
      "Am wichtigsten ist aber, dass man erlebt, wie viel die eigene Hilfe anderen bedeutet.",
      "Aus diesen Gründen bitte ich die Schulleitung, das Sozialpraktikum einzuführen."
    ], { hinweis: FOLGE_HINWEIS }),
    a("Ergänze die Behauptung zu einem vollständigen Argument: „Ein Sozialpraktikum hilft bei der Berufswahl.“ Schreibe eine Begründung und ein Beispiel dazu.", [
      kr("Begründung passt zur Behauptung", 2, "Erklärt, warum das Praktikum bei der Berufswahl hilft, z. B. weil man ausprobieren kann, ob einem die Arbeit mit Kindern, Kranken oder alten Menschen liegt. 1 Punkt, wenn die Begründung die Behauptung nur wiederholt."),
      kr("Beispiel passt dazu", 1, "Ein einzelner Fall oder eine Erfahrung, z. B. jemand merkt im Kindergarten, dass er Erzieher werden möchte.")
    ], "Denn man merkt dort, ob einem die Arbeit mit Menschen liegt. Mein Bruder wusste nach einer Woche im Kindergarten, dass er Erzieher werden will.", ["weil|denn|da |nämlich", "beruf|arbeit|erzieher|pfleg|ausprobier|kennenlern"], { hilfe: "Beginne die Begründung mit „Denn …“ oder „Weil …“ und das Beispiel mit „Zum Beispiel …“.", hinweis: "Prüfe: Erklärt deine Begründung wirklich, warum die Behauptung stimmt?" }),
    s("Die Schulleitung überlegt, für alle achten Klassen ein einwöchiges Sozialpraktikum einzuführen: Jede Schülerin und jeder Schüler hilft eine Woche lang in einer sozialen Einrichtung mit, zum Beispiel im Seniorenheim, im Kindergarten oder bei der Tafel. In dieser Woche fällt der Unterricht aus. Schreibe eine begründete Stellungnahme an die Schulleitung: Bist du dafür oder dagegen?", RASTER_R("Sozialpraktikum"), {
      form: "stellungnahme", minWoerter: 110,
      vorgabe: "So gehst du vor:\n• Einleitung: Nenne die Streitfrage und deine Meinung.\n• Hauptteil: Begründe deine Meinung mit drei Argumenten. Jedes Argument braucht eine Begründung und ein Beispiel. Dein stärkstes Argument steht am Schluss.\n• Schluss: Fasse deine Meinung zusammen und richte eine Bitte an die Schulleitung.\nSchreibe mindestens 110 Wörter.",
      hilfe: HILFE_R, hinweis: "Plane beim nächsten Mal zuerst deine drei Argumente in Stichpunkten – jedes mit „weil“ und einem Beispiel."
    })
  ]
});

/* ------------------------------ R8, Variante B: Klassenzimmer selbst reinigen ------------------------------ */
const R_B = probe(5, "R", "B", {
  title: "Probe 5 (R8): Begründete Stellungnahme – Variante B", kurz: "Aufsatz: Stellungnahme", scope: "Schreiben: Argument aufbauen, begründete Stellungnahme", minutes: 60,
  hinweis: "Arbeite allein. Löse zuerst die kurzen Aufgaben, dann schreibst du deinen Text. Bei der Schreibaufgabe hilft dir „Meine Planung“. Dein Text wird laufend gespeichert. Nach der Abgabe kannst du nichts mehr ändern.",
  texte: [],
  items: [
    c("Welcher Satz ist eine These (ein klarer Standpunkt)?", ["Die Klassen sollten ihr Klassenzimmer einmal in der Woche selbst sauber machen.", "Unsere Schule hat zweiundzwanzig Klassenzimmer und drei Fachräume.", "Wer räumt eigentlich nach dem Unterricht die Zimmer auf?"], 0, { hinweis: THESE_HINWEIS }),
    m(BAUSTEINE, [
      ["Wer selbst putzt, geht sorgfältiger mit dem Klassenzimmer um.", "Behauptung"],
      ["Man weiß dann nämlich, wie viel Mühe ein sauberer Boden macht.", "Begründung"],
      ["Seit unserem Putzdienst im Schullandheim wirft bei uns keiner mehr Papier auf den Boden.", "Beispiel"],
      ["Also bleibt das Zimmer von selbst ordentlicher.", "Schlussfolgerung"]
    ], { hinweis: BAUSTEINE_HINWEIS }),
    o(FOLGE, [
      "Seit einigen Wochen wird bei uns über einen Putzdienst der Klassen gestritten. Ich halte ihn für sinnvoll.",
      "Erstens lernt man dabei, Verantwortung für den eigenen Raum zu übernehmen.",
      "Am wichtigsten ist aber, dass sich in einem sauberen Zimmer alle wohler fühlen.",
      "Deshalb bitte ich die Schulleitung, den Putzdienst ein halbes Jahr lang zu erproben."
    ], { hinweis: FOLGE_HINWEIS }),
    a("Ergänze die Behauptung zu einem vollständigen Argument: „Ein Putzdienst der Klasse stärkt die Gemeinschaft.“ Schreibe eine Begründung und ein Beispiel dazu.", [
      kr("Begründung passt zur Behauptung", 2, "Erklärt, warum gemeinsames Putzen die Gemeinschaft stärkt, z. B. weil alle zusammen anpacken und sich aufeinander verlassen müssen. 1 Punkt, wenn die Begründung die Behauptung nur wiederholt."),
      kr("Beispiel passt dazu", 1, "Ein einzelner Fall oder eine Erfahrung, z. B. beim Aufräumen nach dem Klassenfest haben alle zusammengeholfen.")
    ], "Denn alle müssen zusammen anpacken und sich aufeinander verlassen. Nach unserem Klassenfest haben wir gemeinsam aufgeräumt und dabei viel gelacht.", ["weil|denn|da |nämlich", "zusammen|gemeinsam|miteinander|helfen|team|verlassen"], { hilfe: "Beginne die Begründung mit „Denn …“ oder „Weil …“ und das Beispiel mit „Zum Beispiel …“.", hinweis: "Prüfe: Erklärt deine Begründung wirklich, warum die Behauptung stimmt?" }),
    s("Die Schulleitung überlegt, einen Putzdienst einzuführen: Jede Klasse soll ihr Klassenzimmer einmal in der Woche nach der letzten Stunde selbst reinigen – kehren, Tische wischen, Müll trennen. Das dauert etwa zwanzig Minuten. Schreibe eine begründete Stellungnahme an die Schulleitung: Bist du dafür oder dagegen?", RASTER_R("Putzdienst der Klassen"), {
      form: "stellungnahme", minWoerter: 110,
      vorgabe: "So gehst du vor:\n• Einleitung: Nenne die Streitfrage und deine Meinung.\n• Hauptteil: Begründe deine Meinung mit drei Argumenten. Jedes Argument braucht eine Begründung und ein Beispiel. Dein stärkstes Argument steht am Schluss.\n• Schluss: Fasse deine Meinung zusammen und richte eine Bitte an die Schulleitung.\nSchreibe mindestens 110 Wörter.",
      hilfe: HILFE_R, hinweis: "Plane beim nächsten Mal zuerst deine drei Argumente in Stichpunkten – jedes mit „weil“ und einem Beispiel."
    })
  ]
});

/* ------------------------------ M8, Variante A: Sozialpraktikum ------------------------------ */
const EINWAND = "Entkräfte den Einwand sachlich in zwei bis drei Sätzen. Nimm ihn zuerst ernst und zeige dann, warum er nicht so schwer wiegt.";
const EINWAND_KR = (erwartet) => [
  kr("Einwand aufgegriffen und ernst genommen", 1, "Der Einwand wird genannt oder anerkannt (z. B. „Das stimmt zwar …“, „Dieser Einwand ist berechtigt …“)."),
  kr("Sachlich entkräftet", 3, erwartet + " 3: stichhaltiger Grund, der zum Einwand passt · 2: Grund genannt, aber nur knapp · 1: nur widersprochen, ohne Grund.")
];
const M_A = probe(5, "M", "A", {
  title: "Probe 5 (M8): Begründete Stellungnahme", kurz: "Aufsatz: Stellungnahme", scope: "Schreiben: Argument, Einwand entkräften, begründete Stellungnahme mit Abwägung", minutes: 60,
  hinweis: "Arbeite allein. Bearbeite zuerst die Vorarbeit, dann verfasst du deinen Text. Für die Schreibaufgabe steht dir „Meine Planung“ zur Verfügung. Dein Text wird laufend gespeichert. Nach der Abgabe kannst du nichts mehr ändern.",
  texte: [],
  items: [
    c("Welche Aussage ist eine These, zu der man begründet Stellung nehmen kann?", ["Ein verpflichtendes Sozialpraktikum gehört in den Stundenplan jeder achten Klasse.", "Viele soziale Einrichtungen arbeiten mit Ehrenamtlichen zusammen.", "Welche Einrichtungen kämen für ein Sozialpraktikum überhaupt infrage?"], 0, { hinweis: THESE_HINWEIS }),
    m(BAUSTEINE, [
      ["Ein Sozialpraktikum baut Vorurteile ab.", "Behauptung"],
      ["Wer mit alten oder kranken Menschen spricht, erlebt sie nämlich nicht mehr als Fremde.", "Begründung"],
      ["Eine Mitschülerin besucht „ihre“ Bewohnerin aus dem Seniorenheim bis heute.", "Beispiel"],
      ["Folglich verändert eine solche Woche den Blick auf andere Generationen.", "Schlussfolgerung"]
    ], { hinweis: BAUSTEINE_HINWEIS }),
    o(FOLGE_M, [
      "Kaum ein Vorschlag wird bei uns so unterschiedlich beurteilt wie das Sozialpraktikum. Ich halte es für einen Gewinn.",
      "Zunächst lernt man dabei Berufe kennen, an die man vorher nie gedacht hat.",
      "Trotz dieser Vorteile wenden Gegner ein, dass eine Woche Unterricht verloren geht. Dem lässt sich entgegenhalten, dass sich Stoff nachholen lässt.",
      "Wägt man beide Seiten ab, überwiegt der Nutzen. Ich bitte die Schulleitung daher, das Praktikum zu erproben."
    ], { hinweis: FOLGE_M_HINWEIS }),
    a("Einwand der Gegenseite: „In einer Woche ohne Unterricht verpassen wir zu viel Stoff.“ " + EINWAND, EINWAND_KR("Zum Beispiel: Der Stoff einer Woche lässt sich nachholen oder die Woche wird in eine ruhige Zeit des Schuljahres gelegt; die Erfahrungen im Praktikum lassen sich dagegen im Unterricht nicht machen."),
      "Es stimmt, dass eine Woche Unterricht fehlt. Allerdings lässt sich dieser Stoff nachholen, wenn das Praktikum in eine Zeit ohne Proben gelegt wird. Die Erfahrungen im Praktikum kann dagegen keine Schulstunde ersetzen.",
      ["zwar|stimmt|berechtigt|allerdings|dennoch|trotzdem|jedoch|aber", "nachhol|aufhol|planen|zeitpunkt|ersetz|erfahrung"], { hinweis: "Benutze beim nächsten Mal ein Signalwort wie „allerdings“ oder „dennoch“ und nenne danach einen Grund." }),
    a("Stütze die Behauptung „Ein Sozialpraktikum erleichtert die Berufswahl“ mit einer Begründung und einem Beispiel oder Beleg.", [
      kr("Begründung trägt die Behauptung", 2, "Erklärt den Zusammenhang, z. B. man kann erproben, ob einem die Arbeit mit Menschen liegt, bevor man sich bewirbt. 1 Punkt, wenn die Begründung die Behauptung nur umformuliert."),
      kr("Beispiel oder Beleg passt", 1, "Konkreter Fall oder Erfahrung, z. B. jemand entscheidet sich nach der Woche in der Kinderkrippe für eine Ausbildung zur Kinderpflegerin.")
    ], "Im Praktikum kann man erproben, ob einem die Arbeit mit Menschen liegt, bevor man sich für eine Ausbildung bewirbt. Meine Cousine hat sich nach ihrer Woche in der Kinderkrippe für den Beruf der Kinderpflegerin entschieden.", ["weil|denn|da |nämlich|bevor|ob ", "beruf|ausbildung|arbeit|bewirb|erprob|ausprobier"], { hinweis: "Eine Begründung erklärt, sie wiederholt nicht. Frage dich: Warum ist das so?" }),
    s("Die Schulleitung erwägt, für alle achten Klassen ein einwöchiges Sozialpraktikum einzuführen: Jede Schülerin und jeder Schüler arbeitet eine Woche lang in einer sozialen Einrichtung mit, etwa im Seniorenheim, in einer Kindertagesstätte oder bei der Tafel. Der Unterricht entfällt in dieser Zeit. Verfasse eine begründete Stellungnahme an die Schulleitung.", RASTER_M("Sozialpraktikum"), {
      form: "argumentation", minWoerter: 160,
      vorgabe: "Deine Stellungnahme soll\n• in der Einleitung zum Thema hinführen und deine These nennen,\n• drei Argumente in steigernder Reihenfolge enthalten, jeweils mit Begründung und Beispiel oder Beleg,\n• einen Einwand der Gegenseite aufgreifen und entkräften,\n• im Schluss abwägen und mit einem Appell enden.\nSchreibe mindestens 160 Wörter.",
      hinweis: "Plane beim nächsten Mal den Einwand der Gegenseite gleich mit ein – am besten vor deinem stärksten Argument oder vor dem Schluss."
    })
  ]
});

/* ------------------------------ M8, Variante B: Klassenzimmer selbst reinigen ------------------------------ */
const M_B = probe(5, "M", "B", {
  title: "Probe 5 (M8): Begründete Stellungnahme – Variante B", kurz: "Aufsatz: Stellungnahme", scope: "Schreiben: Argument, Einwand entkräften, begründete Stellungnahme mit Abwägung", minutes: 60,
  hinweis: "Arbeite allein. Bearbeite zuerst die Vorarbeit, dann verfasst du deinen Text. Für die Schreibaufgabe steht dir „Meine Planung“ zur Verfügung. Dein Text wird laufend gespeichert. Nach der Abgabe kannst du nichts mehr ändern.",
  texte: [],
  items: [
    c("Welche Aussage ist eine These, zu der man begründet Stellung nehmen kann?", ["Ein wöchentlicher Putzdienst der Klassen sollte an unserer Schule zur Pflicht werden.", "Die Reinigung eines Schulgebäudes kostet eine Gemeinde jedes Jahr viel Geld.", "Wie oft werden die Klassenzimmer bisher eigentlich gereinigt?"], 0, { hinweis: THESE_HINWEIS }),
    m(BAUSTEINE, [
      ["Ein Putzdienst verändert den Umgang mit fremdem Eigentum.", "Behauptung"],
      ["Wer den Kaugummi selbst vom Tisch kratzen muss, klebt nämlich keinen mehr darunter.", "Begründung"],
      ["In der Klasse meines Bruders ist seit dem Putzdienst kein Tisch mehr bekritzelt worden.", "Beispiel"],
      ["Somit schont die Regelung Möbel und Räume.", "Schlussfolgerung"]
    ], { hinweis: BAUSTEINE_HINWEIS }),
    o(FOLGE_M, [
      "Über den Putzdienst der Klassen gehen die Meinungen an unserer Schule weit auseinander. Aus meiner Sicht spricht vieles dafür.",
      "Zunächst gehen Schüler mit einem Raum sorgfältiger um, den sie selbst sauber halten.",
      "Trotz dieser Gründe wenden Kritiker ein, dass Putzen nicht Aufgabe der Schüler sei. Dem ist entgegenzuhalten, dass es nur um den eigenen Schmutz geht.",
      "Wägt man beide Seiten ab, überwiegen die Vorteile. Ich bitte die Schulleitung deshalb, den Putzdienst zu erproben."
    ], { hinweis: FOLGE_M_HINWEIS }),
    a("Einwand der Gegenseite: „Putzen ist Aufgabe des Reinigungspersonals, nicht der Schüler.“ " + EINWAND, EINWAND_KR("Zum Beispiel: Das Reinigungspersonal wird nicht ersetzt, sondern entlastet (Grundreinigung bleibt); es geht um den eigenen Raum und um Verantwortung, nicht um Sparen auf Kosten anderer."),
      "Dieser Einwand ist verständlich, denn niemand soll seine Arbeit verlieren. Allerdings ersetzt der Putzdienst das Reinigungspersonal nicht: Die gründliche Reinigung bleibt seine Aufgabe, die Klassen kümmern sich nur um den Schmutz, den sie selbst verursachen.",
      ["zwar|stimmt|verständlich|berechtigt|allerdings|dennoch|trotzdem|jedoch|aber", "ersetz|entlast|bleibt|eigen|selbst|verantwort|grundreinig"], { hinweis: "Benutze beim nächsten Mal ein Signalwort wie „allerdings“ oder „dennoch“ und nenne danach einen Grund." }),
    a("Stütze die Behauptung „Ein Putzdienst stärkt den Zusammenhalt der Klasse“ mit einer Begründung und einem Beispiel oder Beleg.", [
      kr("Begründung trägt die Behauptung", 2, "Erklärt den Zusammenhang, z. B. alle arbeiten an einer gemeinsamen Aufgabe und müssen sich absprechen. 1 Punkt, wenn die Begründung die Behauptung nur umformuliert."),
      kr("Beispiel oder Beleg passt", 1, "Konkreter Fall oder Erfahrung, z. B. beim gemeinsamen Aufräumen nach dem Schulfest kamen Schüler ins Gespräch, die sonst nie miteinander reden.")
    ], "Beim Putzen arbeiten alle an einer gemeinsamen Aufgabe und müssen sich absprechen, wer was übernimmt. Nach dem Schulfest haben beim Aufräumen sogar Mitschüler zusammengearbeitet, die sonst kaum ein Wort wechseln.", ["weil|denn|da |nämlich|müssen|sodass", "gemeinsam|zusammen|absprech|miteinander|team|aufgabe"], { hinweis: "Eine Begründung erklärt, sie wiederholt nicht. Frage dich: Warum ist das so?" }),
    s("Die Schulleitung erwägt, einen Putzdienst einzuführen: Jede Klasse reinigt ihr Klassenzimmer einmal in der Woche nach der letzten Stunde selbst – kehren, Tische wischen, Müll trennen. Dafür sind etwa zwanzig Minuten vorgesehen. Verfasse eine begründete Stellungnahme an die Schulleitung.", RASTER_M("Putzdienst der Klassen"), {
      form: "argumentation", minWoerter: 160,
      vorgabe: "Deine Stellungnahme soll\n• in der Einleitung zum Thema hinführen und deine These nennen,\n• drei Argumente in steigernder Reihenfolge enthalten, jeweils mit Begründung und Beispiel oder Beleg,\n• einen Einwand der Gegenseite aufgreifen und entkräften,\n• im Schluss abwägen und mit einem Appell enden.\nSchreibe mindestens 160 Wörter.",
      hinweis: "Plane beim nächsten Mal den Einwand der Gegenseite gleich mit ein – am besten vor deinem stärksten Argument oder vor dem Schluss."
    })
  ]
});

module.exports = { [R_A.id]: R_A, [R_B.id]: R_B, [M_A.id]: M_A, [M_B.id]: M_B };
