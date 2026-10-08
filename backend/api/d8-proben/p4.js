"use strict";

/**
 * Deutsch 8 · Probe 4: Zusammenfassen / informierendes Schreiben (einen Sachtext lesen, Kernaussagen erkennen, Wichtiges
 * von Einzelheiten trennen, den Einleitungssatz vorbereiten – dann die Zusammenfassung schreiben).
 * LehrplanPLUS D8 3.2 (zusammenfassen: kontinuierliche Texte; Informationen ordnen), 2.1 (Texte erschließen, zentrale
 * Aussagen erfassen), 3.1 (Schreibplan; Äußerungen aus dem Text sinngemäß oder in indirekter Rede wiedergeben), 3.3
 * (überarbeiten – M8: einen fehlerhaften Satz beurteilen und verbessern).
 * R8: 32 Punkte · M8: 40 Punkte · 60 Minuten. Variante A: Blindenführhunde, Variante B: Bergwacht.
 * Die Schreibaufgabe hat ein Planungswerkzeug (form "zusammenfassung", eigene Felder je Abschnitt) – die Planung wird
 * aufbewahrt, aber nicht bewertet. Alle Texte eigenständig für GRUMI erstellt; Personen, Tiere und Orte (Carola Stangl
 * und Juna, Rasmus Kessler und Arko, Sven, Tannbichl, Grauwand, Veronika Eder) sind erfunden.
 * Bleibt auf dem Server (Erwartungshorizont). Bausteine: bau.js.
 */
const { c, m, a, kr, s, text, probe } = require("./bau");

/* ------------------------------ Texte R8 ------------------------------ */
// Abschnitte: 1–7 · 8–18 · 19–29 · 30–38 · 39–49
const HUND_R = text("t1", "Augen auf vier Pfoten – der Blindenführhund", "Sachtext", [
  "An der Kreuzung bleibt die Hündin Juna stehen. Carola Stangl, die neben ihr geht, weiß sofort: Hier ist der Gehweg zu Ende. Frau Stangl ist seit ihrer Jugend blind. Trotzdem kommt sie sicher durch die Stadt, denn Juna ist ein Blindenführhund. Solche Hunde helfen blinden und stark sehbehinderten Menschen, sich im Alltag selbstständig zu bewegen.",
  "Ein Führhund hat viele Aufgaben. Er führt seinen Menschen um Hindernisse herum, zum Beispiel um Baustellen, Mülltonnen oder abgestellte Fahrräder. Vor Treppen und Bordsteinen bleibt er stehen. Auf ein Hörzeichen hin sucht er eine Tür, einen Zebrastreifen oder einen freien Sitzplatz im Bus. Die Farben einer Ampel kann der Hund allerdings nicht deuten. Ob die Straße frei ist, entscheidet der Mensch, der genau auf den Verkehr hört. Kommt trotzdem ein Auto, bleibt der Hund einfach stehen, auch wenn er das Zeichen zum Losgehen bekommen hat. Er darf also einen Befehl verweigern, wenn Gefahr droht.",
  "Bis ein Hund das alles kann, vergehen fast zwei Jahre. Nicht jedes Tier ist geeignet: Es muss gesund, ruhig und lernfreudig sein und darf sich nicht leicht erschrecken. Oft werden Labradore, Golden Retriever oder Schäferhunde ausgewählt. Das erste Lebensjahr verbringt der Welpe in einer Patenfamilie. Dort lernt er den Alltag kennen: Straßenlärm, Aufzüge, Busse und Geschäfte. Danach kommt er in eine Führhundschule. Mehrere Monate lang übt eine Trainerin mit ihm Schritt für Schritt alle Aufgaben. Zum Schluss lernen Hund und Mensch einige Wochen gemeinsam, bevor sie zusammen eine Prüfung ablegen.",
  "Bei der Arbeit trägt der Hund ein weißes Führgeschirr mit einem festen Bügel. Über diesen Bügel spürt der Mensch jede Bewegung des Tieres. Solange der Hund das Geschirr trägt, muss er sich stark konzentrieren. Deshalb gilt für alle anderen: nicht streicheln, nicht rufen, nicht füttern. Wer den Hund ablenkt, bringt seinen Menschen in Gefahr. Wer helfen möchte, spricht am besten zuerst den Menschen an. Ohne Geschirr hat der Hund frei. Dann darf er toben und spielen wie jeder andere Hund.",
  "Die Ausbildung eines Führhundes ist teuer, sie kostet oft mehr als 20 000 Euro. In Deutschland gilt der Hund als Hilfsmittel, ähnlich wie ein Rollstuhl. Deshalb bezahlt ihn in der Regel die Krankenkasse. Führhunde dürfen ihre Menschen auch dorthin begleiten, wo Hunde sonst verboten sind, etwa in Lebensmittelgeschäfte oder Arztpraxen. Nach einigen Jahren wird die Arbeit für den Hund zu anstrengend. Mit etwa zehn Jahren geht er in den Ruhestand. Viele Hunde bleiben dann als Haustier bei ihrem Menschen. Für Carola Stangl ist Juna schon heute viel mehr als eine Hilfe: „Sie schenkt mir Freiheit“, sagt sie."
]);

// Abschnitte: 1–7 · 8–18 · 19–28 · 29–38 · 39–48
const BERG_R = text("t1", "Wenn am Berg etwas passiert – die Bergwacht", "Sachtext", [
  "Ein falscher Schritt auf dem nassen Steig, und Sven liegt mit verdrehtem Knöchel zwischen den Felsen. Bis zur nächsten Straße sind es zwei Stunden Fußweg. Ein Rettungswagen kann hier nicht helfen. In solchen Fällen rückt die Bergwacht aus. Sie rettet Menschen, die in den Bergen oder in anderem schwer erreichbarem Gelände verunglückt sind oder sich verirrt haben.",
  "Die Einsätze der Bergwacht sind sehr verschieden. Im Sommer hilft sie vor allem Wanderern, Kletterern und Radfahrern, die gestürzt sind oder vor Erschöpfung nicht mehr weiterkönnen. Im Winter versorgt sie verletzte Skifahrer und sucht nach Menschen, die von einer Lawine verschüttet wurden. Die Retter leisten Erste Hilfe und bringen die Verletzten ins Tal. Ist das Gelände zu steil, kommt ein Hubschrauber und zieht den Verletzten an einem Seil nach oben. Bei Nebel oder Sturm kann er aber nicht fliegen. Dann tragen die Retter den Verletzten zu Fuß hinunter, manchmal stundenlang.",
  "Fast alle Mitglieder der Bergwacht arbeiten ehrenamtlich. Sie bekommen also kein Geld und haben einen ganz normalen Beruf, zum Beispiel als Schreinerin, Lehrer oder Krankenpfleger. Wird ein Notfall gemeldet, lassen sie alles stehen und liegen. Wer mitmachen will, muss sicher klettern und Ski fahren können und sehr fit sein. Die Ausbildung dauert etwa zwei bis drei Jahre. In dieser Zeit lernen die Anwärter, Verletzte zu versorgen, mit Seilen zu arbeiten und sich bei jedem Wetter im Gelände zurechtzufinden. Am Ende stehen mehrere Prüfungen.",
  "Wer am Berg in Not gerät, wählt die Nummer 112. Wichtig ist, ruhig zu sagen, was passiert ist, wo man sich befindet und wie viele Personen verletzt sind. Danach bleibt man am Unfallort und hält das Handy für Rückfragen frei. Gibt es kein Netz, hilft das alpine Notsignal: Man gibt sechsmal in einer Minute ein Zeichen, etwa mit einer Pfeife oder einer Lampe, und macht dann eine Minute Pause. Das wiederholt man, bis jemand antwortet. Sven hatte Glück: Sein Freund erreichte die Leitstelle, und nach vierzig Minuten waren die Retter bei ihm.",
  "Viele Unfälle ließen sich vermeiden. Oft überschätzen Menschen ihre Kraft, tragen ungeeignete Schuhe oder achten nicht auf den Wetterbericht. Die Bergwacht rät deshalb, jede Tour gut zu planen, genug zu trinken mitzunehmen und rechtzeitig umzukehren, wenn das Wetter umschlägt oder die Kräfte nachlassen. Außerdem sollte immer jemand wissen, wohin man unterwegs ist. Für ihre Ausrüstung, etwa Fahrzeuge, Seile und Funkgeräte, ist die Bergwacht auch auf Spenden angewiesen. Wer spendet, hilft also mit, dass im Notfall schnell jemand kommt."
]);

/* ------------------------------ Texte M8 ------------------------------ */
// Abschnitte: 1–10 · 11–19 · 20–33 · 34–47 · 48–58 · 59–71
const HUND_M = text("t1", "Verlass auf vier Pfoten: Blindenführhunde im Einsatz", "Sachtext", [
  "Morgens um halb acht herrscht am Bahnhofsplatz dichtes Gedränge. Menschen eilen zu den Bussen, ein Lieferwagen parkt halb auf dem Gehweg, vor der Bäckerei steht ein Werbeschild. Rasmus Kessler sieht von alldem nichts – und kommt doch zügig voran. Der 46-Jährige ist blind. Sein Rüde Arko lenkt ihn um jedes Hindernis herum, ohne dass ein Wort fällt. Blindenführhunde wie Arko ermöglichen blinden und hochgradig sehbehinderten Menschen, sich ohne fremde Hilfe im Straßenverkehr zu bewegen. Für viele von ihnen bedeutet das ein großes Stück Unabhängigkeit.",
  "Die Idee, Hunde gezielt für diese Aufgabe auszubilden, ist gut hundert Jahre alt. 1916 entstand in Oldenburg die erste Schule für Blindenführhunde. Sie bildete Hunde für Soldaten aus, die im Ersten Weltkrieg ihr Augenlicht verloren hatten. Von Deutschland aus verbreitete sich der Gedanke in viele Länder. An den Grundsätzen hat sich seither wenig geändert, wohl aber an den Methoden: Früher wurde mit Strenge gearbeitet, heute lernen die Tiere vor allem über Lob und Belohnung.",
  "Der Weg zum Führhund ist lang, und nur ein Teil der Hunde schafft ihn. Infrage kommen Tiere, die gesund, nervenstark und arbeitsfreudig sind; häufig sind es Labradore, Golden Retriever, Schäferhunde oder Großpudel. Ihr erstes Lebensjahr verbringen die Welpen in Patenfamilien, wo sie an Verkehrslärm, Menschenmengen und Aufzüge gewöhnt werden. Erst danach beginnt die eigentliche Ausbildung in einer Führhundschule, die mehrere Monate bis zu einem Jahr dauert. Dort lernt der Hund, Hindernisse anzuzeigen und zu umgehen – auch solche in Kopfhöhe seines Menschen, etwa eine offene Ladeklappe oder einen tief hängenden Ast. Außerdem prägt er sich zahlreiche Hörzeichen ein, mit denen er zu Türen, Treppen, Zebrastreifen oder freien Sitzplätzen geschickt wird.",
  "Die vielleicht wichtigste Fähigkeit nennen Fachleute „intelligenten Ungehorsam“. Gemeint ist, dass der Hund ein Hörzeichen bewusst nicht befolgt, wenn es seinen Menschen gefährden würde. Gibt Herr Kessler das Zeichen zum Überqueren der Straße und nähert sich ein Auto, bleibt Arko stehen. Die Verantwortung liegt dennoch nicht allein beim Tier. Ampelfarben kann ein Hund nicht deuten; wann die Straße frei ist, erkennt der Mensch am Geräusch des Verkehrs. Auch den Weg muss er selbst kennen, denn der Hund ist kein Navigationsgerät: Er führt sicher, aber das Ziel bestimmt der Mensch. Erst im Zusammenspiel entsteht ein verlässliches Gespann. Deshalb werden beide am Ende der Ausbildung mehrere Wochen lang aufeinander eingestellt und gemeinsam geprüft.",
  "Im Dienst trägt der Hund ein weißes Führgeschirr mit starrem Bügel, über den sich jede seiner Bewegungen auf die Hand des Menschen überträgt. Das Geschirr ist zugleich ein Signal an die Umgebung: Dieser Hund arbeitet. Wer ihn jetzt anspricht, streichelt oder füttert, stört seine Konzentration und gefährdet damit das Gespann. Führhunde dürfen ihre Halter grundsätzlich auch an Orte begleiten, an denen Hunde sonst nicht zugelassen sind, etwa in Lebensmittelgeschäfte und Arztpraxen. Wird das Geschirr abgenommen, ist Feierabend, und der Hund darf rennen, schnüffeln und spielen wie seine Artgenossen.",
  "Billig ist ein solcher Helfer nicht. Die Ausbildung kostet oft mehr als 20 000 Euro; weil der Führhund in Deutschland als Hilfsmittel anerkannt ist, übernimmt in der Regel die Krankenkasse die Kosten. Mit etwa zehn Jahren lässt die Belastbarkeit nach, und der Hund geht in den Ruhestand. Für den Menschen heißt das, sich auf einen neuen Partner einzustellen. Nicht für jeden blinden Menschen ist ein Führhund die richtige Lösung: Das Tier braucht täglich Auslauf, Pflege und Zuwendung, und viele kommen mit dem weißen Langstock gut zurecht. Wer sich jedoch für einen Hund entscheidet, gewinnt mehr als eine Orientierungshilfe – nämlich einen Begleiter, auf den er sich buchstäblich blind verlassen kann."
]);

// Abschnitte: 1–9 · 10–18 · 19–29 · 30–42 · 43–55 · 56–66
const BERG_M = text("t1", "Rettung, wo kein Rettungswagen hinkommt", "Sachtext", [
  "Kurz nach 15 Uhr schlägt an einem Samstag im Juli der Alarm an: Unterhalb der Grauwand ist eine Wanderin ausgerutscht und einen steilen Hang hinabgestürzt. Minuten später sitzen sechs Frauen und Männer der Bergwacht Tannbichl im Einsatzfahrzeug. Keiner von ihnen wird für diesen Nachmittag bezahlt. Die Bergwacht übernimmt den Rettungsdienst überall dort, wo Straßen enden und gewöhnliche Rettungskräfte nicht mehr weiterkommen: im Hochgebirge, in den Mittelgebirgen, in Schluchten und Höhlen.",
  "Gegründet wurde die Bergwacht 1920 in München – zunächst allerdings mit einem anderen Ziel. Nach dem Ersten Weltkrieg zog es immer mehr Menschen in die Berge, und nicht alle benahmen sich rücksichtsvoll. Die ersten Mitglieder wollten deshalb vor allem die Natur schützen und für Ordnung auf Hütten und Wegen sorgen. Bald zeigte sich jedoch, dass mit der Zahl der Ausflügler auch die Zahl der Unfälle stieg. So wurde aus einer Nebenaufgabe die Hauptaufgabe: die Rettung von Menschen. Der Naturschutz gehört bis heute dazu.",
  "Kein Einsatz gleicht dem anderen. Im Sommer geht es meist um gestürzte oder erschöpfte Wanderer, um Kletterer und zunehmend um Radfahrer; im Winter um verletzte Skifahrer und um Lawinenopfer, bei denen jede Minute zählt. Häufig arbeitet die Bergwacht mit einem Rettungshubschrauber zusammen, der Retter und Verletzte an einer Seilwinde aufnehmen kann. Doch die Technik hat Grenzen: Bei Nebel, Sturm oder Dunkelheit bleibt der Hubschrauber oft am Boden. Dann steigen die Einsatzkräfte zu Fuß auf, versorgen die Verletzten an Ort und Stelle und tragen sie in stundenlanger Arbeit ins Tal.",
  "Geleistet wird diese Arbeit fast ausschließlich von Ehrenamtlichen. Sie üben einen gewöhnlichen Beruf aus und halten sich in ihrer Freizeit bereit – an Wochenenden und Feiertagen, wenn besonders viele Menschen unterwegs sind, erst recht. Der Weg dorthin ist anspruchsvoll. Bewerber müssen zunächst in einem Eignungstest zeigen, dass sie sicher klettern und Ski fahren können. Darauf folgt eine Ausbildung von zwei bis drei Jahren, in der Notfallmedizin, Rettungstechnik im Sommer und im Winter sowie Naturschutz auf dem Plan stehen. „Man muss Verletzte versorgen können, während man selbst im Seil hängt“, sagt Veronika Eder, die die Bereitschaft in Tannbichl leitet. Auch nach den Prüfungen wird regelmäßig geübt.",
  "Dass die Retter vielerorts häufiger gebraucht werden als früher, hat mehrere Ursachen. Die Berge sind als Ausflugsziel beliebter denn je, und Fahrräder mit Elektromotor bringen auch Ungeübte in Höhen, die sie aus eigener Kraft kaum erreichen würden. Hinzu kommt mangelnde Vorbereitung: Manche brechen zu spät auf, tragen Turnschuhe statt Bergstiefel oder verlassen sich auf eine Karte im Handy, dessen Akku unterwegs leer wird. Nicht selten rufen Menschen um Hilfe, die gar nicht verletzt sind, sondern sich verstiegen haben und weder vor noch zurück können. Die Bergwacht rät daher, Touren passend zur eigenen Kondition zu wählen, den Wetterbericht zu beachten und im Zweifel rechtzeitig umzukehren.",
  "Tritt der Notfall dennoch ein, führt der Weg über den Notruf 112. Wo kein Netz vorhanden ist, hilft das alpine Notsignal: sechs Zeichen pro Minute, etwa Pfiffe oder Lichtsignale, dann eine Minute Pause. Die Kosten einer Rettung trägt bei Verletzten in der Regel die Krankenkasse. Wer dagegen unverletzt aus einer Notlage geholt wird, muss damit rechnen, den Einsatz selbst zu bezahlen. Fahrzeuge, Funkgeräte und Ausbildung finanziert die Bergwacht zu einem erheblichen Teil aus Spenden und Zuschüssen. Ohne die Bereitschaft Tausender Freiwilliger aber wäre all das nichts wert – sie ist das eigentliche Kapital der Bergrettung."
]);

/* ------------------------------ gemeinsame Arbeitsanweisungen und Tipps ------------------------------ */
const THEMA_TIPP = "Das Thema muss zum ganzen Text passen. Streiche die Antworten, die nur das Beispiel vom Anfang oder nur einen Abschnitt treffen.";
const UEBERSCHRIFTEN = "Der Text hat fünf Abschnitte. Ordne jedem Abschnitt die Überschrift zu, die sein Thema am besten trifft.";
const UEBERSCHRIFTEN_M = "Der Text hat sechs Abschnitte. Für vier davon steht hier eine Überschrift. Ordne sie den Abschnitten zu.";
const UEBERSCHRIFT_TIPP = "Lies von jedem Abschnitt den ersten und den letzten Satz und notiere dir ein Stichwort. Erst danach vergleichst du mit den Überschriften.";
const WICHTIG = "In eine Zusammenfassung gehört nur das Wichtigste. Entscheide bei jeder Aussage: Brauchst du sie für die Zusammenfassung, oder ist sie nur eine Einzelheit?";
const W = "wichtig für die Zusammenfassung", E = "Einzelheit";
const WICHTIG_TIPP = "Mache die Weglassprobe: Fehlt dem Leser etwas Wesentliches, wenn die Aussage nicht dasteht? Namen, Beispiele und einzelne Zahlen kann man meist weglassen.";
const SATZ_FRAGE = "Welcher dieser Sätze passt in eine Zusammenfassung des Textes?";
const SATZ_TIPP = "In eine Zusammenfassung gehören nur sachliche Aussagen im Präsens – keine eigene Meinung, keine Namen und Einzelheiten, keine Umgangssprache.";
const EINLEITUNG_R = "Schreibe den Einleitungssatz für deine Zusammenfassung. Er nennt die Textsorte, den Titel und das Thema des Textes.";
const EINLEITUNG_M = "Formuliere den Einleitungssatz für deine Zusammenfassung.";
const EINLEITUNG_HILFE = "Diese drei Angaben gehören in den Satz: Textsorte · Titel · Thema. Passende Verben: informiert über … · erklärt, wie … · handelt von …";
const EINLEITUNG_TIPP = "Prüfe deinen Einleitungssatz mit drei Fragen: Welche Textsorte? Wie heißt der Text? Worum geht es im ganzen Text?";
const KERN_TIPP = "Die Kernaussage ist das, was vom Abschnitt übrig bleibt, wenn du alle Beispiele und Einzelheiten streichst.";
const SATZ_VERBESSERN = "Nenne zwei Regeln für Zusammenfassungen, gegen die der Satz verstößt, und schreibe ihn so um, dass er in eine Zusammenfassung passt.";
const VERBESSERN_TIPP = "Prüfe jeden Satz deiner Zusammenfassung dreifach: Steht er im Präsens? Ist er frei von Meinung? Sagt er etwas Allgemeines statt eines Beispiels?";
const SATZANFAENGE = "Satzanfänge: Der Sachtext „…“ informiert darüber, … · Zuerst wird erklärt, … · Außerdem erfährt man, dass … · Danach geht es um … · Am Ende …";
const VORGABE_R = "So gehst du vor:\n• Beginne mit dem Einleitungssatz (Textsorte, Titel, Thema).\n• Gib aus jedem der fünf Abschnitte das Wichtigste wieder – in der Reihenfolge des Textes.\n• Schreibe mit eigenen Worten, sachlich und im Präsens.\n• Lass Namen, Beispiele, wörtliche Rede und deine eigene Meinung weg.\nSchreibe mindestens 90 Wörter.";
const VORGABE_M = "Deine Zusammenfassung soll\n• mit einem Einleitungssatz beginnen (Textsorte, Titel, Thema),\n• die Kernaussagen aller sechs Abschnitte in der Reihenfolge des Textes wiedergeben,\n• mit eigenen Worten, sachlich und im Präsens geschrieben sein,\n• ohne Beispiele, Namen, wörtliche Rede und eigene Meinung auskommen.\nSchreibe mindestens 130 Wörter.";
const SCHREIB_TIPP_R = "Markiere beim nächsten Mal in jedem Abschnitt zuerst den wichtigsten Satz – daraus wird deine Zusammenfassung.";
const SCHREIB_TIPP_M = "Notiere dir beim nächsten Mal zu jedem Abschnitt erst die Kernaussage in Stichworten und verbinde sie dann zu Sätzen.";

// Planungswerkzeug der Schreibaufgabe: ein Feld für den Einleitungssatz, eines je Abschnitt (wird nicht bewertet)
const PLAN = (abschnitte) => [{ id: "einleitung", label: "Einleitungssatz", hilfe: "Textsorte, Titel und Thema des Textes." }]
  .concat(Array.from({ length: abschnitte }, (_, i) => ({ id: "abschnitt-" + (i + 1), label: "Abschnitt " + (i + 1) + " – das Wichtigste", ...(i === 0 ? { hilfe: "Stichworte genügen. Mit eigenen Worten, ohne Beispiele." } : {}) })));

// Erwartungshorizont zum Einleitungssatz
const EINLEITUNG_KR_R = (titel, thema) => [
  kr("Textsorte genannt", 1, "Sachtext (auch: informierender Text)."),
  kr("Titel genannt", 1, "„" + titel + "“ – erkennbar richtig wiedergegeben, auch ohne Anführungszeichen."),
  kr("Thema treffend", 1, thema + " Nicht nur ein Stichwort und nicht nur ein Abschnitt.")
];
const EINLEITUNG_KR_M = (titel, thema) => [
  kr("Textsorte und Titel", 1, "Sachtext und „" + titel + "“ – beides genannt."),
  kr("Thema des ganzen Textes genau erfasst", 1, thema + " Nicht nur ein Stichwort und nicht nur ein Abschnitt."),
  kr("ein vollständiger, sachlicher Satz im Präsens", 1, "Ein ganzer Satz (kein Stichpunkt), ohne Wertung, im Präsens.")
];
const VERBESSERN_KR = (verstoesse, besser) => [
  kr("erster Verstoß benannt", 1, "Mögliche Verstöße: " + verstoesse),
  kr("zweiter, anderer Verstoß benannt", 1, "Ein weiterer Verstoß aus der Liste."),
  kr("Satz verbessert", 2, "Sachlich, im Präsens und verallgemeinert, z. B.: „" + besser + "“ 2 Punkte: alle Verstöße beseitigt · 1 Punkt: einer bleibt bestehen (z. B. noch Namen oder noch Präteritum).")
];

// Bewertungsraster der Zusammenfassung (R8: 18 Punkte, M8: 22 Punkte) – die Zeile „Inhalt“ ist je Text verschieden
const RASTER_R = (kernaussagen, einzelheiten) => [
  kr("Inhalt: Kernaussagen", 5, "Je Kernaussage 1 Punkt: " + kernaussagen),
  kr("Nur das Wichtigste", 3, "3 Punkte: keine Einzelheiten und Beispiele (z. B. " + einzelheiten + "), keine wörtliche Rede, keine eigene Meinung, nichts hinzuerfunden · 2 Punkte: einzelne unnötige Einzelheiten · 1 Punkt: viele Einzelheiten oder ein Satz mit eigener Meinung · 0 Punkte: der Text wird Satz für Satz nacherzählt."),
  kr("Aufbau", 4, "Einleitungssatz mit Textsorte, Titel und Thema (2 Punkte; fehlt eine Angabe: 1 Punkt) · die Reihenfolge folgt dem Text (1 Punkt) · die Sätze hängen zusammen, z. B. durch außerdem, danach, deshalb (1 Punkt)."),
  kr("Eigene Worte, Präsens, sachlich", 3, "Je 1 Punkt: mit eigenen Worten (keine ganzen Sätze abgeschrieben) · durchgehend im Präsens · sachliche Sprache ohne Umgangssprache und Ausrufe."),
  kr("Sprachrichtigkeit", 3, "Rechtschreibung, Zeichensetzung und Grammatik. 3 Punkte: fast fehlerfrei · 2 Punkte: einzelne Fehler, gut lesbar · 1 Punkt: viele Fehler · 0 Punkte: kaum lesbar.", { rs: true })
];
const RASTER_M = (kernaussagen, einzelheiten) => [
  kr("Inhalt: Kernaussagen", 7, "Je Kernaussage 1 Punkt: " + kernaussagen),
  kr("Nur das Wichtigste", 3, "3 Punkte: keine Einzelheiten und Beispiele (z. B. " + einzelheiten + "), keine eigene Meinung, nichts hinzuerfunden; alle Abschnitte sind angemessen gewichtet · 2 Punkte: einzelne unnötige Einzelheiten oder ein Abschnitt ist zu breit geraten · 1 Punkt: viele Einzelheiten oder eine Wertung · 0 Punkte: der Text wird Satz für Satz nacherzählt."),
  kr("Aufbau", 4, "Einleitungssatz mit Textsorte, Titel und Thema (2 Punkte; fehlt eine Angabe: 1 Punkt) · die Reihenfolge folgt dem Text, kein Abschnitt wird übergangen (1 Punkt) · die Aussagen sind verknüpft, Zusammenhänge werden deutlich, z. B. durch deshalb, dennoch, zudem, während (1 Punkt)."),
  kr("Eigene Worte, Präsens, sachlich", 4, "Je 1 Punkt: eigene Formulierungen (keine abgeschriebenen Sätze) · durchgehend Präsens, Vorzeitiges im Perfekt · sachlicher Stil ohne Wertungen und Umgangssprache · Äußerungen aus dem Text stehen nicht in wörtlicher Rede, sondern sind sinngemäß oder in indirekter Rede wiedergegeben."),
  kr("Sprachrichtigkeit", 4, "Rechtschreibung, Zeichensetzung und Grammatik. 4 Punkte: fast fehlerfrei · 3 Punkte: einzelne Fehler · 2 Punkte: mehrere Fehler, gut lesbar · 1 Punkt: viele Fehler · 0 Punkte: kaum lesbar.", { rs: true })
];

/* ------------------------------ R8, Variante A: Blindenführhunde ------------------------------ */
const R_A = [
  c("Welches Thema hat der Text?", [
    "Was Blindenführhunde leisten, wie sie ausgebildet werden und was man im Umgang mit ihnen beachten muss",
    "Wie man einen Welpen in der Familie richtig erzieht",
    "Warum blinde Menschen ohne Hund nicht in die Stadt gehen können",
    "Welche Hunderassen sich am besten als Haustiere eignen"], 0, { text: "t1", hinweis: THEMA_TIPP }),
  m(UEBERSCHRIFTEN, [
    ["Abschnitt 1 (Z. 1–7)", "Sicher durch die Stadt"],
    ["Abschnitt 2 (Z. 8–18)", "Was ein Führhund leistet"],
    ["Abschnitt 3 (Z. 19–29)", "Der lange Weg der Ausbildung"],
    ["Abschnitt 4 (Z. 30–38)", "Im Geschirr wird gearbeitet"],
    ["Abschnitt 5 (Z. 39–49)", "Kosten, Rechte und Ruhestand"]], { points: 3, text: "t1", hinweis: UEBERSCHRIFT_TIPP }),
  m(WICHTIG, [
    ["Die Hündin von Frau Stangl heißt Juna.", E],
    ["Führhunde helfen blinden Menschen, sich selbstständig zu bewegen.", W],
    ["Bei Gefahr darf der Hund einen Befehl verweigern.", W],
    ["Im Bus sucht der Hund einen freien Sitzplatz.", E],
    ["Wer den Hund bei der Arbeit ablenkt, bringt den Menschen in Gefahr.", W],
    ["Welpen lernen in der Patenfamilie auch Aufzüge kennen.", E]], { points: 3, text: "t1", hinweis: WICHTIG_TIPP }),
  a("Schreibe die Kernaussage von Abschnitt 3 (Z. 19–29) in ein bis zwei eigenen Sätzen auf.", [
    kr("Dauer oder Auswahl genannt", 1, "Die Ausbildung dauert lange (fast zwei Jahre), und nur geeignete Hunde kommen infrage – eines von beiden genügt."),
    kr("Stationen der Ausbildung", 1, "Patenfamilie und Führhundschule (auch: die gemeinsame Prüfung mit dem Menschen) – mindestens zwei Stationen."),
    kr("zusammengefasst in eigenen Worten", 1, "Höchstens zwei Sätze, ohne Einzelheiten (Hunderassen, Aufzüge, Busse), nicht aus dem Text abgeschrieben.")
  ], "Die Ausbildung eines Führhundes dauert fast zwei Jahre. Geeignete Hunde wachsen zuerst in einer Patenfamilie auf und lernen danach in einer Führhundschule ihre Aufgaben.",
  ["ausbildung|ausgebildet|lern", "patenfamilie|führhundschule|schule|prüfung", "zwei jahre|lange|geeignet"], { text: "t1", zeilen: [19, 29], hilfe: "So kannst du beginnen: In diesem Abschnitt geht es darum, dass …", hinweis: KERN_TIPP }),
  c(SATZ_FRAGE, [
    "Ein Führhund führt seinen Menschen um Hindernisse herum und bleibt vor Gefahren stehen.",
    "Ich finde es toll, dass Hunde so viele Aufgaben lernen können.",
    "Juna blieb an der Kreuzung stehen, und Frau Stangl wusste sofort Bescheid.",
    "Führhunde sind echt krasse Helfer, die einfach alles checken."], 0, { hinweis: SATZ_TIPP }),
  a(EINLEITUNG_R, EINLEITUNG_KR_R("Augen auf vier Pfoten – der Blindenführhund", "Worum es im ganzen Text geht: was Blindenführhunde leisten, wie sie ausgebildet werden und was man im Umgang mit ihnen beachten muss."),
    "Der Sachtext „Augen auf vier Pfoten – der Blindenführhund“ informiert darüber, welche Aufgaben Blindenführhunde haben, wie sie ausgebildet werden und was man im Umgang mit ihnen beachten muss.",
    ["sachtext|text", "augen auf vier pfoten|blindenführhund", "informiert|handelt|geht es|erklärt|beschreibt|thema"], { text: "t1", hilfe: EINLEITUNG_HILFE, hinweis: EINLEITUNG_TIPP }),
  s("Fasse den Sachtext „Augen auf vier Pfoten – der Blindenführhund“ zusammen.", RASTER_R(
    "(1) Blindenführhunde helfen blinden und stark sehbehinderten Menschen, sich selbstständig und sicher zu bewegen. (2) Aufgaben: Der Hund führt um Hindernisse herum, bleibt vor Treppen und Bordsteinen stehen und sucht Ziele; bei Gefahr verweigert er einen Befehl. (3) Die Ausbildung dauert fast zwei Jahre: Geeignete Hunde wachsen in einer Patenfamilie auf und lernen dann in der Führhundschule; am Ende steht eine gemeinsame Prüfung. (4) Im Führgeschirr arbeitet der Hund und darf nicht abgelenkt werden; ohne Geschirr hat er frei. (5) Die Ausbildung ist teuer und wird meist von der Krankenkasse bezahlt; Führhunde dürfen fast überallhin mit; mit etwa zehn Jahren gehen sie in den Ruhestand (zwei dieser drei Angaben genügen).",
    "Juna und Frau Stangl, Mülltonnen und Fahrräder, die Hunderassen, der Sitzplatz im Bus"), {
    form: "zusammenfassung", plan: PLAN(5), minWoerter: 90, text: "t1", vorgabe: VORGABE_R, hilfe: SATZANFAENGE, hinweis: SCHREIB_TIPP_R
  })
];

/* ------------------------------ R8, Variante B: Bergwacht ------------------------------ */
const R_B = [
  c("Welches Thema hat der Text?", [
    "Wie die Bergwacht arbeitet, wer dort mithilft und was man bei einem Notfall am Berg tun muss",
    "Wie man sich auf eine lange Wanderung im Hochgebirge vorbereitet",
    "Warum Hubschrauber bei schlechtem Wetter nicht fliegen können",
    "Wie sich ein Junge beim Wandern den Knöchel verletzt hat"], 0, { text: "t1", hinweis: THEMA_TIPP }),
  m(UEBERSCHRIFTEN, [
    ["Abschnitt 1 (Z. 1–7)", "Retter in schwierigem Gelände"],
    ["Abschnitt 2 (Z. 8–18)", "Einsätze im Sommer und im Winter"],
    ["Abschnitt 3 (Z. 19–28)", "Freiwillige mit langer Ausbildung"],
    ["Abschnitt 4 (Z. 29–38)", "So ruft man Hilfe"],
    ["Abschnitt 5 (Z. 39–48)", "Vorbeugen und unterstützen"]], { points: 3, text: "t1", hinweis: UEBERSCHRIFT_TIPP }),
  m(WICHTIG, [
    ["Die Bergwacht rettet Menschen aus schwer erreichbarem Gelände.", W],
    ["Sven hat sich auf dem Steig den Knöchel verdreht.", E],
    ["Die Mitglieder arbeiten ehrenamtlich und sind lange ausgebildet.", W],
    ["Manche Bergretter sind von Beruf Schreinerin oder Lehrer.", E],
    ["Die Retter waren nach vierzig Minuten am Unfallort.", E],
    ["Im Notfall wählt man die 112 oder gibt das alpine Notsignal.", W]], { points: 3, text: "t1", hinweis: WICHTIG_TIPP }),
  a("Schreibe die Kernaussage von Abschnitt 3 (Z. 19–28) in ein bis zwei eigenen Sätzen auf.", [
    kr("Ehrenamt genannt", 1, "Die Mitglieder arbeiten ehrenamtlich (ohne Bezahlung, neben ihrem Beruf)."),
    kr("Anforderungen oder Ausbildung", 1, "Wer mitmachen will, muss sehr fit sein und sicher klettern und Ski fahren können; die Ausbildung dauert zwei bis drei Jahre – eines von beiden genügt."),
    kr("zusammengefasst in eigenen Worten", 1, "Höchstens zwei Sätze, ohne Einzelheiten (Schreinerin, Lehrer, Seile), nicht aus dem Text abgeschrieben.")
  ], "Die Mitglieder der Bergwacht arbeiten ehrenamtlich neben ihrem Beruf. Sie müssen sehr sportlich sein und werden zwei bis drei Jahre lang ausgebildet.",
  ["ehrenamt|kein geld|freiwillig|ohne bezahlung|unbezahlt", "ausbildung|ausgebildet|jahre|fit|klettern|sportlich|prüfung"], { text: "t1", zeilen: [19, 28], hilfe: "So kannst du beginnen: In diesem Abschnitt geht es darum, dass …", hinweis: KERN_TIPP }),
  c(SATZ_FRAGE, [
    "Die Bergwacht rettet im Sommer und im Winter Menschen aus schwer erreichbarem Gelände.",
    "Meiner Meinung nach verdienen die Bergretter viel mehr Anerkennung.",
    "Sven lag mit verdrehtem Knöchel zwischen den Felsen und hatte großes Glück.",
    "Die Leute von der Bergwacht sind echt mega mutig unterwegs."], 0, { hinweis: SATZ_TIPP }),
  a(EINLEITUNG_R, EINLEITUNG_KR_R("Wenn am Berg etwas passiert – die Bergwacht", "Worum es im ganzen Text geht: wie die Bergwacht arbeitet, wer dort mithilft und was man bei einem Notfall am Berg tun muss."),
    "Der Sachtext „Wenn am Berg etwas passiert – die Bergwacht“ informiert darüber, wie die Bergwacht Menschen rettet, wer dort mitarbeitet und wie man sich bei einem Notfall am Berg verhält.",
    ["sachtext|text", "wenn am berg etwas passiert|bergwacht", "informiert|handelt|geht es|erklärt|beschreibt|thema"], { text: "t1", hilfe: EINLEITUNG_HILFE, hinweis: EINLEITUNG_TIPP }),
  s("Fasse den Sachtext „Wenn am Berg etwas passiert – die Bergwacht“ zusammen.", RASTER_R(
    "(1) Die Bergwacht rettet Menschen, die in den Bergen oder in schwer erreichbarem Gelände verunglückt sind oder sich verirrt haben. (2) Sie hilft im Sommer und im Winter, leistet Erste Hilfe und bringt Verletzte ins Tal – mit dem Hubschrauber oder zu Fuß. (3) Die Mitglieder arbeiten ehrenamtlich; sie müssen sehr fit sein und werden zwei bis drei Jahre ausgebildet. (4) Im Notfall wählt man die 112 und macht genaue Angaben; ohne Netz hilft das alpine Notsignal. (5) Viele Unfälle lassen sich durch gute Planung und rechtzeitiges Umkehren vermeiden; die Bergwacht ist auf Spenden angewiesen (eine dieser beiden Angaben genügt).",
    "Sven und sein Knöchel, die Berufe der Retter, Pfeife und Lampe, die vierzig Minuten"), {
    form: "zusammenfassung", plan: PLAN(5), minWoerter: 90, text: "t1", vorgabe: VORGABE_R, hilfe: SATZANFAENGE, hinweis: SCHREIB_TIPP_R
  })
];

/* ------------------------------ M8, Variante A: Blindenführhunde ------------------------------ */
const M_A = [
  c("Welcher Satz beschreibt das Thema des Textes am genauesten?", [
    "Der Text erklärt, was Blindenführhunde leisten, wie sie ausgebildet werden und wo die Grenzen ihres Einsatzes liegen.",
    "Der Text schildert den Arbeitsweg eines blinden Mannes durch die Innenstadt.",
    "Der Text vergleicht den Führhund mit dem weißen Langstock und rät zum Stock.",
    "Der Text beschreibt, wie sich die Hundeerziehung seit dem Ersten Weltkrieg verändert hat."], 0, { text: "t1", hinweis: THEMA_TIPP }),
  m(UEBERSCHRIFTEN_M, [
    ["Abschnitt 1 (Z. 1–10)", "Unabhängig trotz Blindheit"],
    ["Abschnitt 2 (Z. 11–19)", "Eine Idee aus dem Jahr 1916"],
    ["Abschnitt 5 (Z. 48–58)", "Arbeitskleidung und Feierabend"],
    ["Abschnitt 6 (Z. 59–71)", "Kosten, Ruhestand und Grenzen"]], { points: 3, text: "t1", hinweis: UEBERSCHRIFT_TIPP }),
  a("Formuliere die Kernaussagen der Abschnitte 3 (Z. 20–33) und 4 (Z. 34–47) jeweils in einem eigenen Satz.", [
    kr("Kernaussage von Abschnitt 3", 2, "Nur geeignete Hunde kommen infrage; sie wachsen in einer Patenfamilie auf und lernen danach in der Führhundschule ihre Aufgaben (Hindernisse, Hörzeichen). 2 Punkte: Auswahl und Weg der Ausbildung · 1 Punkt: nur eine Seite, nur eine Einzelheit (z. B. nur „Labradore“) oder ein abgeschriebener Satz."),
    kr("Kernaussage von Abschnitt 4", 2, "Der Hund befolgt ein Hörzeichen nicht, wenn es gefährlich wäre (intelligenter Ungehorsam); trotzdem trägt der Mensch Verantwortung – erst zusammen sind beide ein verlässliches Gespann. 2 Punkte: Ungehorsam bei Gefahr und Mitverantwortung des Menschen · 1 Punkt: nur eine Seite, nur das Beispiel mit dem Auto oder ein abgeschriebener Satz.")
  ], "Abschnitt 3: Nur geeignete Hunde werden zuerst in einer Patenfamilie und danach in einer Führhundschule auf ihre Aufgaben vorbereitet. Abschnitt 4: Ein Führhund verweigert ein Hörzeichen, wenn Gefahr droht, doch die Verantwortung für Weg und Ziel bleibt beim Menschen.",
  ["geeignet|patenfamilie|führhundschule|ausbildung|ausgebildet", "ungehorsam|verweiger|nicht befolg|gefahr|gefähr", "verantwortung|gespann|zusammen|mensch"], { text: "t1", zeilen: [20, 47], hinweis: KERN_TIPP }),
  m(WICHTIG, [
    ["Vor der Bäckerei am Bahnhofsplatz steht ein Werbeschild.", E],
    ["Führhunde ermöglichen blinden Menschen, sich ohne fremde Hilfe zu bewegen.", W],
    ["Zu den geeigneten Rassen gehört der Großpudel.", E],
    ["Der Hund befolgt ein Hörzeichen nicht, wenn es seinen Menschen gefährden würde.", W],
    ["Hund und Mensch arbeiten als Gespann; Weg und Ziel bestimmt der Mensch.", W],
    ["Ein Hindernis in Kopfhöhe kann eine offene Ladeklappe sein.", E]], { points: 3, text: "t1", hinweis: WICHTIG_TIPP }),
  a("In einer Zusammenfassung des Textes steht dieser Satz: „Ich fand es beeindruckend, dass Arko stehen blieb, als Herr Kessler das Zeichen gab und ein Auto kam.“ " + SATZ_VERBESSERN,
    VERBESSERN_KR("eigene Meinung oder Wertung („Ich fand es beeindruckend“) · Präteritum statt Präsens (fand, blieb, gab, kam) · Einzelheit mit Namen aus dem Beispiel statt einer allgemeinen Aussage.", "Ein Führhund befolgt ein Hörzeichen nicht, wenn es seinen Menschen in Gefahr bringen würde."),
    "Der Satz enthält eine eigene Meinung („Ich fand es beeindruckend“) und steht im Präteritum statt im Präsens. Außerdem nennt er Namen aus dem Beispiel. Besser: Ein Führhund befolgt ein Hörzeichen nicht, wenn es seinen Menschen in Gefahr bringen würde.",
    ["meinung|wertung|bewert|ich fand|ich-form", "präteritum|vergangenheit|präsens|zeitform|gegenwart", "name|beispiel|einzelheit|allgemein"], { text: "t1", zeilen: [34, 39], hinweis: VERBESSERN_TIPP }),
  a(EINLEITUNG_M, EINLEITUNG_KR_M("Verlass auf vier Pfoten: Blindenführhunde im Einsatz", "Was Blindenführhunde leisten, wie sie ausgebildet werden und worauf es bei der Zusammenarbeit von Mensch und Hund ankommt."),
    "Der Sachtext „Verlass auf vier Pfoten: Blindenführhunde im Einsatz“ informiert darüber, was Blindenführhunde leisten, wie sie ausgebildet werden und worauf es bei der Zusammenarbeit von Mensch und Hund ankommt.",
    ["sachtext|text", "verlass auf vier pfoten|blindenführhund", "informiert|handelt|geht es|erklärt|beschreibt|stellt|thema"], { text: "t1", hinweis: EINLEITUNG_TIPP }),
  s("Schreibe eine Zusammenfassung des Sachtextes „Verlass auf vier Pfoten: Blindenführhunde im Einsatz“.", RASTER_M(
    "(1) Blindenführhunde ermöglichen blinden und stark sehbehinderten Menschen, sich ohne fremde Hilfe im Verkehr zu bewegen, und geben ihnen Unabhängigkeit. (2) Hunde werden seit gut hundert Jahren für diese Aufgabe ausgebildet; heute lernen sie über Lob statt über Strenge. (3) Nur geeignete Hunde kommen infrage; sie wachsen in Patenfamilien auf und lernen danach in der Führhundschule, Hindernisse zu umgehen und Hörzeichen zu befolgen. (4) Besonders wichtig ist der „intelligente Ungehorsam“: Der Hund befolgt ein Hörzeichen nicht, wenn Gefahr droht. (5) Der Mensch trägt Verantwortung mit (auf den Verkehr hören, den Weg kennen); Hund und Mensch werden gemeinsam eingearbeitet und geprüft. (6) Im Führgeschirr arbeitet der Hund und darf nicht abgelenkt werden; er darf seinen Halter fast überallhin begleiten; ohne Geschirr hat er frei (zwei dieser drei Angaben genügen). (7) Ein Führhund ist teuer (die Krankenkasse zahlt in der Regel), geht mit etwa zehn Jahren in den Ruhestand und ist nicht für jeden blinden Menschen die richtige Lösung (zwei dieser drei Angaben genügen).",
    "Bahnhofsplatz und Werbeschild, Arko und Herr Kessler, Oldenburg, die Hunderassen, die Ladeklappe"), {
    form: "zusammenfassung", plan: PLAN(6), minWoerter: 130, text: "t1", vorgabe: VORGABE_M, hinweis: SCHREIB_TIPP_M
  })
];

/* ------------------------------ M8, Variante B: Bergwacht ------------------------------ */
const M_B = [
  c("Welcher Satz beschreibt das Thema des Textes am genauesten?", [
    "Der Text stellt die Bergwacht vor: ihre Entstehung, ihre Einsätze, die Arbeit der Ehrenamtlichen und die Gründe, warum sie häufiger gebraucht wird.",
    "Der Text schildert die Rettung einer abgestürzten Wanderin an einem Samstag im Juli.",
    "Der Text warnt davor, ohne Bergführer ins Hochgebirge zu gehen.",
    "Der Text erklärt, wie man sich um einen Ausbildungsplatz bei der Bergwacht bewirbt."], 0, { text: "t1", hinweis: THEMA_TIPP }),
  m(UEBERSCHRIFTEN_M, [
    ["Abschnitt 1 (Z. 1–9)", "Rettungsdienst abseits der Straßen"],
    ["Abschnitt 2 (Z. 10–18)", "Vom Naturschutz zur Rettung"],
    ["Abschnitt 5 (Z. 43–55)", "Warum die Einsätze zunehmen"],
    ["Abschnitt 6 (Z. 56–66)", "Notruf, Kosten und Finanzierung"]], { points: 3, text: "t1", hinweis: UEBERSCHRIFT_TIPP }),
  a("Formuliere die Kernaussagen der Abschnitte 3 (Z. 19–29) und 4 (Z. 30–42) jeweils in einem eigenen Satz.", [
    kr("Kernaussage von Abschnitt 3", 2, "Die Einsätze sind je nach Jahreszeit verschieden; häufig hilft ein Hubschrauber, bei schlechtem Wetter müssen die Retter aber zu Fuß aufsteigen. 2 Punkte: Vielfalt der Einsätze und Rettung mit oder ohne Hubschrauber · 1 Punkt: nur eine Seite, nur eine Einzelheit (z. B. nur „Lawinen“) oder ein abgeschriebener Satz."),
    kr("Kernaussage von Abschnitt 4", 2, "Die Arbeit leisten fast nur Ehrenamtliche, die einen Eignungstest bestehen und eine Ausbildung von zwei bis drei Jahren durchlaufen müssen. 2 Punkte: Ehrenamt und anspruchsvolle Ausbildung · 1 Punkt: nur eine Seite, nur eine Einzelheit (z. B. nur „Ski fahren“) oder ein abgeschriebener Satz.")
  ], "Abschnitt 3: Die Einsätze unterscheiden sich je nach Jahreszeit, und wenn der Hubschrauber nicht fliegen kann, müssen die Retter zu Fuß helfen. Abschnitt 4: Die Arbeit leisten Ehrenamtliche, die dafür einen Eignungstest bestehen und eine mehrjährige Ausbildung durchlaufen.",
  ["einsatz|einsätze|sommer|winter|jahreszeit", "hubschrauber|zu fuß|wetter", "ehrenamt|freiwillig|ausbildung|ausgebildet|eignungstest"], { text: "t1", zeilen: [19, 42], hinweis: KERN_TIPP }),
  m(WICHTIG, [
    ["Die Bergwacht leistet Rettungsdienst dort, wo andere Rettungskräfte nicht hinkommen.", W],
    ["Der Alarm geht an einem Samstag im Juli kurz nach 15 Uhr ein.", E],
    ["Die Einsatzkräfte arbeiten ehrenamtlich und sind mehrere Jahre ausgebildet.", W],
    ["Manche Wanderer tragen Turnschuhe statt Bergstiefel.", E],
    ["Veronika Eder leitet die Bereitschaft in Tannbichl.", E],
    ["Bei schlechtem Wetter muss die Rettung ohne Hubschrauber gelingen.", W]], { points: 3, text: "t1", hinweis: WICHTIG_TIPP }),
  a("In einer Zusammenfassung des Textes steht dieser Satz: „Ich fand es mutig, dass die sechs Retter aus Tannbichl sofort losfuhren, obwohl sie für den Einsatz kein Geld bekamen.“ " + SATZ_VERBESSERN,
    VERBESSERN_KR("eigene Meinung oder Wertung („Ich fand es mutig“) · Präteritum statt Präsens (fand, losfuhren, bekamen) · Einzelheit aus dem Beispiel (sechs Retter aus Tannbichl) statt einer allgemeinen Aussage.", "Die Einsatzkräfte der Bergwacht arbeiten ehrenamtlich und rücken bei einem Notfall sofort aus."),
    "Der Satz bewertet („Ich fand es mutig“), was in einer Zusammenfassung nicht erlaubt ist, und er steht im Präteritum. Außerdem gibt er eine Einzelheit aus dem Beispiel wieder. Besser: Die Einsatzkräfte der Bergwacht arbeiten ehrenamtlich und rücken bei einem Notfall sofort aus.",
    ["meinung|wertung|bewert|ich fand|ich-form", "präteritum|vergangenheit|präsens|zeitform|gegenwart", "name|beispiel|einzelheit|allgemein|ort"], { text: "t1", zeilen: [1, 6], hinweis: VERBESSERN_TIPP }),
  a(EINLEITUNG_M, EINLEITUNG_KR_M("Rettung, wo kein Rettungswagen hinkommt", "Die Bergwacht: ihre Entstehung, ihre Einsätze, die Arbeit und Ausbildung der Ehrenamtlichen und die Gründe für die wachsende Zahl von Notfällen."),
    "Der Sachtext „Rettung, wo kein Rettungswagen hinkommt“ stellt die Bergwacht vor: ihre Entstehung, ihre Einsätze, die Ausbildung der ehrenamtlichen Retter und die Gründe für die wachsende Zahl von Notfällen.",
    ["sachtext|text", "rettung, wo kein rettungswagen hinkommt|bergwacht", "informiert|handelt|geht es|erklärt|beschreibt|stellt|thema"], { text: "t1", hinweis: EINLEITUNG_TIPP }),
  s("Schreibe eine Zusammenfassung des Sachtextes „Rettung, wo kein Rettungswagen hinkommt“.", RASTER_M(
    "(1) Die Bergwacht übernimmt den Rettungsdienst dort, wo andere Rettungskräfte nicht hinkommen (Gebirge, Schluchten, Höhlen). (2) Sie wurde 1920 gegründet, zunächst für Naturschutz und Ordnung in den Bergen; die Rettung von Menschen wurde erst später zur Hauptaufgabe. (3) Die Einsätze sind je nach Jahreszeit verschieden (Wanderer, Kletterer, Radfahrer – Skifahrer, Lawinenopfer). (4) Oft hilft ein Hubschrauber; bei schlechtem Wetter oder Dunkelheit müssen die Retter zu Fuß aufsteigen und die Verletzten ins Tal tragen. (5) Die Einsatzkräfte arbeiten ehrenamtlich und brauchen eine anspruchsvolle Ausbildung (Eignungstest, zwei bis drei Jahre). (6) Die Retter werden häufiger gebraucht, weil mehr Menschen in die Berge gehen und viele schlecht vorbereitet sind; die Bergwacht rät zu guter Planung und rechtzeitigem Umkehren. (7) Im Notfall gilt der Notruf 112 oder das alpine Notsignal; bei Verletzten zahlt die Krankenkasse, Unverletzte müssen den Einsatz unter Umständen selbst bezahlen; die Bergwacht ist auf Spenden und Freiwillige angewiesen (zwei dieser drei Angaben genügen).",
    "Samstag im Juli, Grauwand und Tannbichl, Frau Eder, Turnschuhe, der leere Akku"), {
    form: "zusammenfassung", plan: PLAN(6), minWoerter: 130, text: "t1", vorgabe: VORGABE_M, hinweis: SCHREIB_TIPP_M
  })
];

/* ------------------------------ die vier Fassungen ------------------------------ */
const R8 = {
  kurz: "Zusammenfassen", scope: "Schreiben: Kernaussagen erkennen, Wichtiges von Einzelheiten trennen, Einleitungssatz, Zusammenfassung eines Sachtextes", minutes: 60,
  hinweis: "Arbeite allein. Lies zuerst den ganzen Text. Löse dann die kurzen Aufgaben – sie bereiten deine Zusammenfassung vor. Bei der Schreibaufgabe hilft dir „Meine Planung“. Dein Text wird laufend gespeichert. Nach der Abgabe kannst du nichts mehr ändern."
};
const M8 = {
  kurz: "Zusammenfassen", scope: "Schreiben: Kernaussagen formulieren, Wichtiges von Einzelheiten trennen, einen Satz überarbeiten, Einleitungssatz, Zusammenfassung eines Sachtextes", minutes: 60,
  hinweis: "Arbeite allein. Lies zuerst den ganzen Text. Bearbeite dann die Vorarbeit – sie bereitet deine Zusammenfassung vor. Für die Schreibaufgabe steht dir „Meine Planung“ zur Verfügung. Dein Text wird laufend gespeichert. Nach der Abgabe kannst du nichts mehr ändern."
};
const TITEL = "Sachtext zusammenfassen";
const R_AP = probe(4, "R", "A", { ...R8, title: "Probe 4 (R8): " + TITEL, texte: [HUND_R], items: R_A });
const R_BP = probe(4, "R", "B", { ...R8, title: "Probe 4 (R8): " + TITEL + " – Variante B", texte: [BERG_R], items: R_B });
const M_AP = probe(4, "M", "A", { ...M8, title: "Probe 4 (M8): " + TITEL, texte: [HUND_M], items: M_A });
const M_BP = probe(4, "M", "B", { ...M8, title: "Probe 4 (M8): " + TITEL + " – Variante B", texte: [BERG_M], items: M_B });

module.exports = { [R_AP.id]: R_AP, [R_BP.id]: R_BP, [M_AP.id]: M_AP, [M_BP.id]: M_BP };
