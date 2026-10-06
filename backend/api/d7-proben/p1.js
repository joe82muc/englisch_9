"use strict";

/**
 * Deutsch 7 · Probe 1: Erzählen (Schritte eines Schreibplans ordnen, Aufbau einer Erzählung, Spannung, wörtliche Rede
 * und Gefühle, einen fremden Abschnitt überarbeiten, M7 zusätzlich: einen Schreibplan skizzieren; eigene Erzählung).
 * LehrplanPLUS D7 3.2 (erfundene oder erlebte Ereignisse anschaulich und zusammenhängend erzählen; Erzählmittel: direkte
 * Rede als Dialog, Sinneseindrücke; M7: Gedanken und Gefühle differenziert, Erzähllogik, Schreibplan), 3.3 (Texte
 * überarbeiten).
 * R7: 32 Punkte · M7: 36 Punkte · etwa 60 Minuten (rund 20 Minuten Vorarbeit, 35 Minuten Schreiben, 5 Minuten Durchlesen).
 * Schreibaufgaben: R7 setzt einen Erzählanfang fort (mindestens 120 Wörter), M7 schreibt zu drei Reizwörtern
 * (mindestens 160 Wörter). Die Mindestwortzahl ist keine eigene Rasterzeile; sie steht in „Inhalt“ und „Aufbau“.
 * Die kleinen Geschichten der Aufgaben 1 bis 5 (R7: bis 6) haben mit der Schreibaufgabe derselben Fassung nichts zu
 * tun, damit sie der eigenen Erzählung keine Ideen wegnehmen. Alle vier Fassungen haben eigene Geschichten, Namen und
 * Schauplätze. Keine Lesetexte (texte: []), alles eigenständig für GRUMI erstellt.
 * Die KI bekommt „vorgabe“ nicht mitgeschickt, und in der Korrekturansicht steht sie auch nicht: Darum wiederholt der
 * Erwartungshorizont jeder offenen Aufgabe die Vorlage („Vorlage: …“ im ersten Kriterium, beim Schreibplan die
 * Reizwörter im letzten) – so haben sie KI und Lehrkraft beim Korrigieren vor sich.
 * Bleibt auf dem Server (Lösungen). Bausteine: bau.js.
 */
const { c, m, o, a, kr, s, probe } = require("./bau");

/* ------------------------------ Aufgabenstellungen und Hinweise ------------------------------ */
const ORDNEN = (zahl) => "Für eine Erzählung stehen " + zahl + " Schritte in einem Schreibplan. Sie sind durcheinandergeraten. Bringe sie in die richtige Reihenfolge.";
const ORDNEN_TIPP = "Suche zuerst den Schritt, mit dem alles anfängt, und frage dich dann bei jedem weiteren: Was muss vorher schon geschehen sein?";

const AUFBAU = "Vier Ausschnitte aus einer Erzählung stehen hier durcheinander. Ordne jedem Ausschnitt zu, zu welchem Teil der Erzählung er gehört. Jeder Teil kommt genau einmal vor.";
const EINL = "Einleitung", HAUPT = "Hauptteil (die Spannung steigt)", HOEHE = "Höhepunkt (spannendste Stelle)", SCHLUSS = "Schluss";
const AUFBAU_TIPP = "Frage dich bei jedem Ausschnitt: Lerne ich hier erst Figuren und Ort kennen, wird es spannender, ist es die spannendste Stelle oder ist schon alles überstanden?";

const SPANNUNG_TIPP = "Das Wort „spannend“ macht einen Satz noch nicht spannend: Suche den Satz, der das Geschehen hinauszögert und genau zeigt, was man sieht, hört oder fühlt.";

// R7: einen langweiligen Satz spannender schreiben (3 Punkte)
const SPANNEND = "Dieser Satz erzählt eine aufregende Stelle ganz langweilig. Schreibe die Stelle spannender. Du darfst zwei bis drei Sätze daraus machen.";
const SPANNEND_KR = (vorlage, mittel) => [
  kr("Spannung erzeugt", 2, "Vorlage: „" + vorlage + "“ 2 Punkte: mindestens zwei Mittel, die Spannung aufbauen, z. B. " + mittel + ". 1 Punkt: nur ein Mittel, etwa ein einzelnes eingefügtes Wort wie „plötzlich“. 0 Punkte: der Satz ist nur abgeschrieben oder umgestellt."),
  kr("passt zum Inhalt", 1, "Erzählt wird weiter dieselbe Stelle wie in der Vorlage. Wie es danach ausgeht, muss nicht dastehen. 0 Punkte, wenn etwas ganz anderes erzählt oder die Vorlage nur abgeschrieben wird.")
];

// R7: eine Stelle um wörtliche Rede und ein Gefühl ergänzen (3 Punkte)
const REDE = (name) => "So beginnt eine Stelle aus einer Erzählung. Schreibe zwei bis drei Sätze, die direkt danach kommen. Lass dabei eine Figur etwas sagen (wörtliche Rede) und zeige, wie " + name + " sich fühlt.";
const REDE_KR = (vorlage, name, begleitsatz, gefuehl) => [
  kr("wörtliche Rede", 1, "Vorlage: „" + vorlage + "“ Mindestens eine Figur sagt etwas, und das ist als wörtliche Rede erkennbar (Anführungszeichen oder ein Begleitsatz wie „" + begleitsatz + "“). Fehlende oder falsch gesetzte Satzzeichen kosten hier keinen Punkt. 0 Punkte bei indirekter Rede („… sagte, dass …“)."),
  kr("Gefühl", 1, "Man erfährt, wie " + name + " sich fühlt – genannt oder gezeigt (z. B. " + gefuehl + ")."),
  kr("passt zur Stelle", 1, "Die Sätze schließen sinnvoll an die Vorlage an und passen zusammen. Auch ein einziger längerer Satz zählt, wenn er passt. 0 Punkte, wenn etwas ganz anderes erzählt oder nur die Vorlage abgeschrieben wird.")
];

// M7: einen zu knapp erzählten Höhepunkt ausgestalten (4 Punkte)
const AUSGESTALTEN = (name) => "Diese Stelle soll der Höhepunkt einer Erzählung sein, sie ist aber viel zu knapp erzählt. Gestalte sie in vier bis fünf Sätzen aus: Zögere das Geschehen hinaus, verwende wörtliche Rede und zeige, was " + name + " denkt oder fühlt.";
const AUSGESTALTEN_KR = (vorlage, name, schritte, innen) => [
  kr("Spannung aufgebaut", 2, "Vorlage: „" + vorlage + "“ 2 Punkte: Das Geschehen wird in mehreren Schritten hinausgezögert und anschaulich erzählt (z. B. " + schritte + "; treffende Verben, Sinneseindrücke, kurze Sätze). 1 Punkt: etwas ausführlicher als die Vorlage, das Entscheidende steht aber weiter in einem einzigen Satz. 0 Punkte: nur abgeschrieben oder umgestellt, oder es wird etwas ganz anderes erzählt."),
  kr("wörtliche Rede", 1, "Mindestens eine Figur sagt oder ruft etwas, erkennbar als wörtliche Rede (Anführungszeichen oder Begleitsatz). Fehlende oder falsch gesetzte Satzzeichen kosten hier keinen Punkt."),
  kr("Gedanken oder Gefühle", 1, "Man erfährt genau, was " + name + " denkt oder fühlt (z. B. " + innen + "). Ein bloßes „hatte Angst“ oder „war aufgeregt“ ohne weitere Angabe genügt in M7 nicht.")
];

// Einen fremden Abschnitt überarbeiten (4 Punkte). Die Sätze der Vorlage sind nummeriert, je Zeile ein Satz.
const UEBERARBEITEN_R = "Dieser Abschnitt aus einer Erzählung ist noch nicht gut geschrieben. Verbessere drei Stellen:\n1. Ersetze ein Wort, das sich unnötig wiederholt.\n2. Ändere einen Satzanfang, damit nicht so viele Sätze gleich beginnen.\n3. Ersetze ein blasses Verb (wie „machen“ oder „sagen“) durch ein treffendes.\nSchreibe nur die Sätze auf, die du verbessert hast, mit ihrer Nummer.";
const UEBERARBEITEN_M = "Dieser Abschnitt stammt aus dem Entwurf einer Erzählung. Er hat drei Arten von Schwächen: Wörter wiederholen sich unnötig, mehrere Sätze beginnen gleich, einige Verben sind blass. Verbessere zu jeder Art eine Stelle. Schreibe nur die verbesserten Sätze mit ihrer Nummer auf.";
const UEBERARBEITEN_KR = (vorlage, wiederholung, anfang, verben) => [
  kr("Wiederholung vermieden", 1, "Vorlage: " + vorlage.replace(/\n/g, " ") + " – " + wiederholung + " Ein geänderter Satzanfang zählt nicht hier, sondern beim nächsten Kriterium."),
  kr("Satzanfang verändert", 1, anfang),
  kr("treffenderes Verb gewählt", 1, verben + " Dieselbe Änderung zählt nur bei einem Kriterium; zwei verschiedene Verbesserungen im selben Satz zählen beide."),
  kr("Inhalt bleibt erhalten", 1, "Die neuen Sätze erzählen dasselbe wie die Vorlage und sind vollständige, verständliche Sätze. Auch wer den ganzen Abschnitt verbessert abschreibt, bekommt den Punkt. 0 Punkte, wenn ein ganz anderer Text erfunden oder gar nichts verbessert wurde.")
];

// M7: Schreibplan zur eigenen Erzählung (4 Punkte)
const PLAN = "Bevor man eine Erzählung schreibt, plant man sie. In Aufgabe 7 schreibst du eine Erzählung zu den drei Reizwörtern im Kasten. Skizziere hier deinen Schreibplan: die Ausgangslage (Wer? Wo? Wann?), zwei bis drei Schritte der Handlung mit dem Höhepunkt und den Schluss. Stichpunkte genügen, du brauchst hier keine ganzen Sätze.";
const PLAN_KR = (woerter, ausgangslage) => [
  kr("Ausgangslage", 1, "Notiert ist, wer beteiligt ist und wo (möglichst auch wann) die Erzählung spielt, z. B. „" + ausgangslage + "“."),
  kr("Handlungsschritte mit Höhepunkt", 1, "Mindestens zwei Schritte der Handlung in sinnvoller Reihenfolge; einer davon ist als spannendste Stelle erkennbar (auch ohne das Wort „Höhepunkt“)."),
  kr("Schluss", 1, "Ein Stichpunkt zeigt, wie die Erzählung ausgeht."),
  kr("passt zur Schreibaufgabe", 1, "Alle drei Reizwörter (" + woerter + ") sind eingeplant und hängen sinnvoll zusammen. Der Plan besteht aus Stichpunkten oder kurzen Sätzen – wer hier schon die ganze Erzählung ausschreibt, bekommt diesen Punkt nicht.")
];

/* ------------------------------ Bewertungsraster der eigenen Erzählung ------------------------------ */
const RICHTIG = (grenze) => kr("Sprachrichtigkeit", 3, "Rechtschreibung, Zeichensetzung (auch bei der wörtlichen Rede) und Grammatik, gemessen an der Länge des Textes. 3 Punkte: nur wenige Fehler. 2 Punkte: mehrere Fehler, der Text bleibt aber gut lesbar. 1 Punkt: viele Fehler, das Lesen fällt schwer. 0 Punkte: kaum noch verständlich. Ein sehr kurzer Text (weniger als " + grenze + " Wörter) bekommt höchstens 1 Punkt.", { rs: true });

// R7 (16 Punkte): Der Anfang ist vorgegeben, das Kind schreibt Hauptteil und Schluss.
const RASTER_R = (weiter) => [
  kr("Inhalt und Ideen", 4, "4 Punkte: Die Erzählung führt den Anfang passend weiter (" + weiter + "), hat eine eigene, nachvollziehbare Idee und erzählt die spannendste Stelle ausführlich. 2–3 Punkte: passt zum Anfang, die Handlung bleibt aber dünn oder wird nur knapp berichtet. 0–1 Punkt: kaum Handlung oder kein Zusammenhang mit dem Anfang. Ein deutlich zu kurzer Text (weniger als etwa 80 Wörter) bekommt höchstens 2 Punkte; abgeschriebene Sätze des Anfangs zählen nicht zur Länge."),
  kr("Aufbau", 4, "4 Punkte: schließt an den vorgegebenen Anfang (die Einleitung) an, der Hauptteil erzählt Schritt für Schritt und führt zu einem Höhepunkt, ein Schluss rundet die Erzählung ab. 2–3 Punkte: Hauptteil und Schluss sind da, aber der Höhepunkt ist kaum zu erkennen, die Reihenfolge springt oder die Erzählung endet sehr plötzlich. 0–1 Punkt: bricht ohne Schluss ab oder ist ungeordnet. Ein deutlich zu kurzer Text (weniger als etwa 80 Wörter) bekommt höchstens 2 Punkte."),
  kr("Sprache", 5, "Je 1 Punkt für jedes Merkmal, das im Text deutlich vorkommt: treffende Verben und Adjektive (nicht nur „gehen“, „machen“, „sagen“) · abwechslungsreiche Satzanfänge (nicht fast immer „Dann“ oder „Ich“) · wörtliche Rede an mindestens einer Stelle · Gedanken oder Gefühle · durchgehend in der Vergangenheit erzählt (Präteritum; in der wörtlichen Rede sind andere Zeitformen richtig). Rechtschreibfehler zählen hier nicht."),
  RICHTIG(60)
];
const SCHREIBEN_R = (was) => "Lies den Anfang der Erzählung im Kasten. Erzähle weiter, " + was + ", und führe die Erzählung zu einem Schluss. Schreibe mindestens 120 Wörter.\nDenke an den Aufbau: Der Anfang im Kasten ist die Einleitung – schreibe ihn nicht ab. Von dir kommen der Hauptteil mit einem Höhepunkt und der Schluss. Erzähle in der Ich-Form und in der Vergangenheit. Verwende treffende Wörter und wörtliche Rede und schreibe auch, was du denkst und fühlst.";
const SCHREIBEN_R_HILFE = "Prüfe am Ende: Gibt es einen Höhepunkt und einen Schluss? Sprechen deine Figuren? Beginnen deine Sätze verschieden?";

// M7 (18 Punkte): Erzählung zu drei Reizwörtern.
const RASTER_M = (woerter) => [
  kr("Inhalt und Ideen", 4, "4 Punkte: eigene, in sich stimmige Idee; alle drei Reizwörter (" + woerter + ") kommen vor (auch gebeugt oder in einer Zusammensetzung) und sind für die Handlung wichtig; die spannendste Stelle ist anschaulich ausgestaltet. 2–3 Punkte: alle drei Reizwörter kommen vor, eines wird aber nur nebenbei erwähnt, oder die Handlung wird eher berichtet als erzählt. 0–1 Punkt: kaum Handlung oder am Thema vorbei. Fehlt ein Reizwort oder ist der Text deutlich zu kurz (weniger als etwa 110 Wörter), gibt es höchstens 2 Punkte."),
  kr("Aufbau und Erzähllogik", 5, "5 Punkte: knappe Einleitung (wer, wo, wann), ein Hauptteil, der die Spannung in mehreren Schritten bis zum Höhepunkt steigert, und ein Schluss, der die Erzählung abrundet; alles ist lückenlos und ohne Widersprüche nachvollziehbar. 3–4 Punkte: alle Teile sind da, aber unausgewogen (z. B. Höhepunkt nur in einem Satz, abruptes Ende) oder mit einer kleinen Lücke in der Logik. 1–2 Punkte: ein Teil fehlt, oder es gibt mehrere Sprünge und Widersprüche. 0 Punkte: kein Aufbau erkennbar. Ein deutlich zu kurzer Text (weniger als etwa 110 Wörter) bekommt höchstens 3 Punkte."),
  kr("Sprache", 6, "Je 1 Punkt für jedes Merkmal, das im Text deutlich vorkommt: treffende Verben · anschauliche Adjektive und Sinneseindrücke (was man sieht, hört oder spürt) · abwechslungsreiche Satzanfänge und Satzverknüpfungen · wörtliche Rede an passenden Stellen (ein kurzer Wortwechsel oder mindestens zwei Redebeiträge) · Gedanken und Gefühle werden genau beschrieben, nicht nur benannt („Mein Herz hämmerte“ statt „Ich hatte Angst“) · durchgehend im Präteritum (außer in der wörtlichen Rede) und in derselben Erzählform. Rechtschreibfehler zählen hier nicht."),
  RICHTIG(80)
];
const SCHREIBEN_M = "Schreibe zu den drei Reizwörtern im Kasten eine spannende Erzählung. Alle drei Wörter müssen vorkommen und für die Handlung wichtig sein. Umfang: mindestens 160 Wörter.\nNutze deinen Schreibplan aus Aufgabe 6. Achte auf einen klaren Aufbau mit Höhepunkt und auf eine logische Handlung. Erzähle anschaulich (treffende Wörter, wörtliche Rede, Gedanken und Gefühle), im Präteritum und durchgehend in derselben Erzählform (Ich-Form oder Er-/Sie-Form). Lies deinen Text am Ende durch und verbessere ihn.";

/* ------------------------------ Vorlagen der offenen Aufgaben ------------------------------ */
// R7 A
const V_KONTROLLE = "Im Zug kam der Kontrolleur, und Dana fand ihre Fahrkarte nicht.";
const V_KUCHEN = "Am Sonntag hatte Selin zum ersten Mal ganz allein einen Kuchen gebacken. Oma biss in das erste Stück – und verzog das Gesicht.";
const V_FLOHMARKT = "(1) Am Samstag ging Jakob mit seinem Vater auf den Flohmarkt.\n(2) Dann gingen sie zu einem Stand mit alten Spielen.\n(3) Dann sah Jakob unter dem Tisch eine alte Kiste.\n(4) Dann machte er die Kiste auf.\n(5) In der Kiste waren Comics, und die Comics sahen aus wie neu.\n(6) Der Verkäufer sagte: „Die ganze Kiste kostet nur drei Euro!“";
const ANFANG_NACHT = "So beginnt die Erzählung:\nEs war unsere zweite Nacht im Schullandheim. Alle anderen im Zimmer schliefen längst, nur ich lag noch wach. Da hörte ich es: Draußen auf dem Flur schlurfte etwas über den Boden. Dann wurde es still – und plötzlich klapperte es direkt vor unserer Tür.";
// R7 B
const V_SCHNEEBALL = "Auf dem Pausenhof warf Linus einen Schneeball, und der traf die Rektorin.";
const V_FEIER = "An seinem Geburtstag kam Arda müde vom Training heim. Im dunklen Wohnzimmer ging plötzlich das Licht an – und da stand seine ganze Mannschaft.";
const V_TRETBOOT = "(1) In den Ferien war Malte mit seiner Schwester am Stadtsee.\n(2) Sie machten eine Fahrt mit dem Tretboot.\n(3) Sie fanden die Fahrt toll, und das Wetter war auch toll.\n(4) Sie kamen bis zu einer kleinen Insel.\n(5) Dort machte ein Pedal auf einmal ein lautes Geräusch.\n(6) Maltes Schwester sagte: „Jetzt kommen wir nicht mehr zurück!“";
const ANFANG_HUND = "So beginnt die Erzählung:\nNach dem Nachmittagsunterricht ging ich wie jeden Dienstag durch den Park nach Hause. Hinter mir hörte ich ein leises Tapsen. Ich drehte mich um: Ein struppiger Hund, den ich noch nie gesehen hatte, lief mir nach. Als ich stehen blieb, setzte er sich hin und sah mich an.";
// M7 A
const V_TORTE = "Kian trug die Geburtstagstorte ins Wohnzimmer. Auf der Türschwelle stolperte er.";
const V_PANNE = "(1) Am Morgen des Turniers fuhr Jule mit dem Rad zur Sporthalle.\n(2) Sie fuhr gerade über die Brücke, da machte es einen lauten Knall.\n(3) Sie sah, dass der Hinterreifen platt war.\n(4) Sie hatte kein Flickzeug dabei und hatte auch kein Handy dabei.\n(5) Da kam ihr Trainer mit dem Auto.\n(6) „Steig ein, wir schaffen das noch!“, sagte er.";
const W_AUFZUG = "Stromausfall – Aufzug – Taschenlampe";
// M7 B
const V_MATHE = "Herr Aydin teilte die Mathearbeiten aus. Leyla drehte ihr Blatt um.";
const V_POPCORN = "(1) Am Freitagabend wollte Rosa für den Filmabend Popcorn machen.\n(2) Sie machte Öl und Mais in den Topf und machte den Herd an.\n(3) Dann ging sie kurz ins Wohnzimmer.\n(4) Dann hörte sie aus der Küche ein lautes Geräusch.\n(5) Dann ging sie schnell zurück.\n(6) Ihr Bruder stand schon am Herd und sagte: „Du hast den Deckel vergessen!“";
const W_ZELTLAGER = "Zeltlager – Gewitter – Landkarte";

/* ------------------------------ Aufgaben ------------------------------ */
// R7, Variante A – Schreibaufgabe: Erzählanfang „Nachts im Schullandheim“
// Kleine Geschichten davor: Schlüssel im Gully · Theateraufführung · Elfmeter · Fahrkartenkontrolle · Kuchen für Oma · Flohmarkt
const R_A = [
  o(ORDNEN("fünf"), [
    "Vor der Haustür rutscht Ilyas der Schlüssel aus der Hand.",
    "Der Schlüssel fällt durch das Gitter in den Gully.",
    "Die Nachbarin leiht Ilyas einen Magneten und eine Schnur.",
    "Vorsichtig angelt er den Schlüssel aus dem Schacht.",
    "Erleichtert schließt Ilyas die Haustür auf."], { points: 3, hinweis: ORDNEN_TIPP }),
  m(AUFBAU, [
    ["Nun stand Hanna allein im Scheinwerferlicht – und ihr Kopf war plötzlich völlig leer. Im Saal wurde es totenstill.", HOEHE],
    ["Am Freitagabend führte die Klasse 7c in der Aula ihr Theaterstück auf. Hanna spielte zum ersten Mal eine Hauptrolle.", EINL],
    ["Am Ende wollte der Beifall kaum aufhören. Hanna verbeugte sich und strahlte: Sie hatte es doch noch geschafft.", SCHLUSS],
    ["Die ersten Szenen klappten gut. Doch je näher Hannas langer Text rückte, desto trockener wurde ihr Mund.", HAUPT]], { points: 2, hinweis: AUFBAU_TIPP }),
  c("In einer Erzählung schießt Marlon in der letzten Minute einen Elfmeter. Welcher dieser Sätze baut am meisten Spannung auf?", [
    "Mit zitternden Knien legte Marlon den Ball auf den Punkt – jetzt hing alles von diesem einen Schuss ab.",
    "Marlon schoss in der letzten Minute den Elfmeter, und dann war das Spiel zu Ende.",
    "Der Elfmeter in der letzten Minute war für alle Zuschauer sehr, sehr spannend.",
    "Marlon durfte den Elfmeter schießen, weil er im Training immer der sicherste Schütze der ganzen Mannschaft gewesen war."], 0, { hinweis: SPANNUNG_TIPP }),
  a(SPANNEND, SPANNEND_KR(V_KONTROLLE, "das Geschehen wird hinausgezögert (der Kontrolleur kommt Reihe für Reihe näher), treffende Verben und Adjektive (wühlen, hastig), ein Gefühl oder ein Gedanke (Herzklopfen, „Wo ist sie nur?“), kurze Sätze oder eine Frage"),
    "Der Kontrolleur kam Reihe für Reihe näher. Hastig wühlte Dana in ihrem Rucksack, und ihr Herz klopfte bis zum Hals. Wo war nur die Fahrkarte?",
    ["näher|plötzlich|auf einmal|schritt für schritt|reihe für reihe", "herz|zitter|heiß|schweiß|panik|nervös|schluck|atem|kloß", "wühl|kramte|kramt|durchsuch|tastet|hastig|hektisch|fieberhaft"],
    { vorgabe: V_KONTROLLE, hilfe: "Wortspeicher: plötzlich · immer näher · hastig · wühlen · das Herz klopft" }),
  a(REDE("Selin"), REDE_KR(V_KUCHEN, "Selin", "fragte Oma", "„Sie schämte sich“, „Ihr Gesicht wurde heiß“, „Am liebsten wäre sie im Boden versunken“"),
    "„Kind, was hast du denn da hineingetan?“, fragte Oma und hustete. Selin wurde knallrot. Am liebsten wäre sie im Boden versunken, denn sie hatte Salz und Zucker verwechselt.",
    ["fragte|rief|sagte|meinte|murmelte|hustete|stotterte|flüsterte|lachte|antwortete", "knallrot|wurde rot|rot wurde|schämte|peinlich|erschrak|erschrocken|enttäuscht|traurig|herz|im boden|kloß|tränen|unangenehm"],
    { vorgabe: V_KUCHEN, hilfe: "So können deine Sätze beginnen: „…“, fragte Oma. – Selin spürte, wie …" }),
  a(UEBERARBEITEN_R, UEBERARBEITEN_KR(V_FLOHMARKT,
    "Wiederholt werden „Kiste“ (Satz 3 bis 6), „Comics“ (zweimal in Satz 5) und „ging – gingen“ (Satz 1 und 2). Mindestens eine Wiederholung ist beseitigt, z. B. durch ein Pronomen („Dann machte er sie auf“, „… und sie sahen aus wie neu“) oder ein anderes Wort.",
    "Die Sätze 2, 3 und 4 beginnen mit „Dann“. Mindestens einer beginnt jetzt anders (z. B. „Neugierig …“, „Unter dem Tisch …“, „Kurz darauf …“).",
    "Blass sind „ging/gingen“, „sah“, „machte … auf“, „waren“ und „sagte“. Mindestens eines ist durch ein genaueres Verb ersetzt (z. B. schlenderten, entdeckte, öffnete, lagen, rief)."),
    "(2) Neugierig schlenderten sie zu einem Stand mit alten Spielen. (4) Vorsichtig öffnete er sie. (5) Darin lagen Comics, die aussahen wie neu.",
    ["schlender|bummel|spazier|stöber|entdeckte|bemerkte|erblickte|öffnete|klappte|lagen|rief|meinte|grinste", "danach|später|schließlich|plötzlich|zuerst|neugierig|kurz darauf|vorsichtig|gespannt", "darin|sie sahen|die aussahen|hefte|er sie|sie auf|den deckel"],
    { vorgabe: V_FLOHMARKT, hilfe: "Wortspeicher: schlendern · stöbern · entdecken · öffnen · rufen · kurz darauf · neugierig · schließlich" }),
  s(SCHREIBEN_R("was in dieser Nacht geschieht"), RASTER_R("es wird erzählt, was hinter den Geräuschen auf dem Flur steckt"),
    { minWoerter: 120, material: ANFANG_NACHT, hilfe: SCHREIBEN_R_HILFE })
];

// R7, Variante B – Schreibaufgabe: Erzählanfang „Der fremde Hund“
// Kleine Geschichten davor: Ball und Fensterscheibe · Schlittenfahrt · Kletterhalle · Schneeball · Überraschungsfeier · Tretboot
const R_B = [
  o(ORDNEN("fünf"), [
    "Luan und Piet werfen im Hof Körbe.",
    "Der Ball prallt vom Korb ab und fliegt über die Hecke.",
    "Drüben klirrt eine Fensterscheibe.",
    "Mit weichen Knien klingeln die beiden bei Frau Seidl.",
    "Als Wiedergutmachung mähen sie ihren Rasen."], { points: 3, hinweis: ORDNEN_TIPP }),
  m(AUFBAU, [
    ["Ein paar Mal sausten Samira und Timo die flache Bahn hinunter. Dann wagten sie sich auf die steile Bahn am Waldrand, und der Schlitten wurde schneller und schneller.", HAUPT],
    ["Durchgefroren, aber heil stapften die zwei nach Hause. Bei einem heißen Kakao waren sie sich einig: Die flache Bahn reicht völlig.", SCHLUSS],
    ["Plötzlich tauchte vor ihnen der Bach auf. „Bremsen!“, schrie Samira und stemmte beide Fersen in den Schnee.", HOEHE],
    ["In den Winterferien zogen Samira und ihr Cousin Timo ihren Schlitten auf den Mühlberg. Über Nacht hatte es kräftig geschneit.", EINL]], { points: 2, hinweis: AUFBAU_TIPP }),
  c("In einer Erzählung klettert Lia in der Kletterhalle an einer hohen Wand. Welcher dieser Sätze baut am meisten Spannung auf?", [
    "Lias Finger rutschten langsam vom Griff – und bis zum Boden waren es acht Meter.",
    "Lia kletterte an der Wand bis ganz nach oben und seilte sich dann wieder ab.",
    "Das Klettern an der hohen Wand war für Lia wirklich total spannend.",
    "Lia ging am Samstag mit ihrer Tante in die Kletterhalle, weil sie dort schon seit zwei Jahren so gern kletterte."], 0, { hinweis: SPANNUNG_TIPP }),
  a(SPANNEND, SPANNEND_KR(V_SCHNEEBALL, "das Geschehen wird hinausgezögert (der Schneeball fliegt, genau in diesem Moment geht die Tür auf), treffende Verben und Adjektive (ausholen, sausen), ein Gefühl oder ein Gedanke (Linus hält den Atem an, „Oh nein!“), kurze Sätze oder ein Ausruf"),
    "Linus holte aus und warf. Genau in diesem Moment öffnete sich die Schultür, und die Rektorin trat auf den Hof. Linus hielt den Atem an – klatsch!",
    ["plötzlich|in diesem moment|auf einmal|ausgerechnet|da öffnete|ging die tür", "atem|herz|erstarr|schreck|oh nein|zitter|blass|stockte|am liebsten", "sauste|zischte|klatsch|holte aus|schleuderte|segelte|pfiff|flog"],
    { vorgabe: V_SCHNEEBALL, hilfe: "Wortspeicher: plötzlich · ausholen · sausen · den Atem anhalten · erstarren" }),
  a(REDE("Arda"), REDE_KR(V_FEIER, "Arda", "riefen alle", "„Er freute sich riesig“, „Ihm blieb der Mund offen stehen“, „Vor Freude brachte er kein Wort heraus“"),
    "„Überraschung! Alles Gute zum Geburtstag!“, riefen alle durcheinander. Arda blieb der Mund offen stehen. Vor Freude wusste er gar nicht, was er sagen sollte.",
    ["rief|riefen|sagte|fragte|schrien|jubelte|jubelten|lachte|stotterte|flüsterte|stammelte", "freute|freude|glücklich|überrascht|gerührt|strahlte|sprachlos|herz|tränen|mund offen|kaum fassen|nicht fassen"],
    { vorgabe: V_FEIER, hilfe: "So können deine Sätze beginnen: „…“, riefen alle. – Arda spürte, wie …" }),
  a(UEBERARBEITEN_R, UEBERARBEITEN_KR(V_TRETBOOT,
    "Wiederholt werden „toll“ (zweimal in Satz 3), „Fahrt“ (Satz 2 und 3) und „machten – machte“ (Satz 2 und 5). Mindestens eine Wiederholung ist beseitigt, z. B. „… und das Wetter war herrlich“ oder durch ein Pronomen („Sie fanden sie toll“).",
    "Die Sätze 2, 3 und 4 beginnen mit „Sie“. Mindestens einer beginnt jetzt anders (z. B. „Zuerst …“, „Bald …“, „Nach einer Weile …“).",
    "Blass sind „war“, „machten eine Fahrt“, „kamen“, „machte … ein Geräusch“ und „sagte“. Mindestens eines ist durch ein genaueres Verb ersetzt (z. B. strampelten, erreichten, knackte, rief, stöhnte)."),
    "(3) Die Fahrt gefiel ihnen, und das Wetter war herrlich. (4) Bald erreichten sie eine kleine Insel. (5) Dort knackte ein Pedal auf einmal laut.",
    ["strampel|erreicht|knackte|krachte|knirschte|rief|stöhnte|kreischte|jammerte|steuerten|fuhren|quietschte", "zuerst|bald|danach|später|schließlich|nach einer weile|kurz darauf|gemeinsam|fröhlich|endlich", "herrlich|schön|wunderbar|sonnig|gefiel|genossen|spaß|sie toll|strahlte|schien"],
    { vorgabe: V_TRETBOOT, hilfe: "Wortspeicher: strampeln · erreichen · knacken · rufen · stöhnen · bald · kurz darauf · herrlich" }),
  s(SCHREIBEN_R("was du mit dem fremden Hund erlebst"), RASTER_R("es wird erzählt, was mit dem fremden Hund geschieht"),
    { minWoerter: 120, material: ANFANG_HUND, hilfe: SCHREIBEN_R_HILFE })
];

// M7, Variante A – Schreibaufgabe: Reizwörter Stromausfall – Aufzug – Taschenlampe
// Kleine Geschichten davor: entflogener Wellensittich · Seifenkistenrennen · Alarm im Museum · Geburtstagstorte · Fahrradpanne
const M_A = [
  o(ORDNEN("sechs"), [
    "Levi öffnet den Käfig, um frisches Futter hineinzustellen.",
    "Der Wellensittich flattert durch das offene Fenster davon.",
    "Levi hängt im ganzen Viertel Suchzettel mit einem Foto auf.",
    "Drei Tage später ruft eine Frau aus der Nachbarstraße an.",
    "Auf ihrem Balkon sitzt der Vogel zwischen den Blumentöpfen.",
    "Mit einem Hirsekolben lockt Levi ihn in den Käfig zurück."], { points: 3, hinweis: ORDNEN_TIPP }),
  m(AUFBAU, [
    ["Am Abend stellte Opa den kleinen Pokal auf die Werkbank. „Nächstes Jahr“, sagte er und zwinkerte Greta zu, „bauen wir bessere Räder ein.“", SCHLUSS],
    ["Nach dem Start lag Greta weit hinten. Kurve um Kurve holte sie auf, bis nur noch die rote Kiste mit der Nummer 7 vor ihr rollte.", HAUPT],
    ["Wochenlang hatten Greta und ihr Opa in der Garage an der Seifenkiste geschraubt. Am ersten Sonntag im Mai war es so weit: Am Kirchberg startete das Rennen.", EINL],
    ["In der letzten Kurve begann Gretas Vorderrad zu flattern. Sie umklammerte das Lenkrad. Wenn es jetzt abfiel, war alles vorbei!", HOEHE]], { points: 2, hinweis: AUFBAU_TIPP }),
  c("In einer Erzählung löst Jan im Museum den Alarm aus. Welcher dieser Sätze baut am meisten Spannung auf?", [
    "Nur noch eine Handbreit trennte Jans Finger von der alten Vase – da zerriss ein schrilles Heulen die Stille.",
    "Jan kam der alten Vase zu nahe, und deshalb ging im Saal sofort die Alarmanlage los.",
    "Als plötzlich der Alarm losging, war das für Jan ein unglaublich spannender Moment.",
    "Im Museum gab es eine moderne Alarmanlage, die Jan an diesem Nachmittag aus Versehen auslöste, als er sich die Vase ansehen wollte."], 0, { hinweis: SPANNUNG_TIPP }),
  a(AUSGESTALTEN("Kian"), AUSGESTALTEN_KR(V_TORTE, "Kian", "Kian balanciert die Torte, sein Fuß bleibt hängen, die Torte gerät ins Rutschen", "„Bitte nicht!“, schoss es ihm durch den Kopf; sein Herz blieb fast stehen"),
    "Kian balancierte die Torte auf beiden Händen und setzte vorsichtig einen Fuß vor den anderen. Da blieb seine Schuhspitze an der Türschwelle hängen. „Vorsicht!“, schrie seine Schwester. Die Torte kippte nach vorn, und die Kerzen wackelten. Bitte nicht, schoss es Kian durch den Kopf, und sein Herz blieb fast stehen.",
    ["rief|schrie|brüllte|kreischte|flüsterte|stöhnte|keuchte|riefen", "herz|dachte|durch den kopf|magen|zitter|atem|bitte nicht|hoffentlich", "langsam|plötzlich|vorsichtig|rutsch|kippte|wackel|schwank|in diesem moment|zeitlupe|balancier"],
    { vorgabe: V_TORTE }),
  a(UEBERARBEITEN_M, UEBERARBEITEN_KR(V_PANNE,
    "Wiederholt werden „fuhr“ (Satz 1 und 2) und „hatte … dabei“ (zweimal in Satz 4). Mindestens eine Wiederholung ist beseitigt, z. B. „Gerade rollte sie über die Brücke …“ oder „Weder Flickzeug noch ein Handy hatte sie dabei“.",
    "Die Sätze 2, 3 und 4 beginnen mit „Sie“. Mindestens einer beginnt jetzt anders (z. B. „Gerade rollte sie …“, „Erschrocken …“, „Leider …“).",
    "Blass sind „fuhr“, „machte es einen Knall“, „sah“, „kam“ und „sagte“. Mindestens eines ist durch ein genaueres Verb ersetzt (z. B. radelte, knallte es, bemerkte, hielt neben ihr, rief)."),
    "(2) Gerade rollte sie über die Brücke, da knallte es laut. (3) Erschrocken bemerkte sie, dass der Hinterreifen platt war. (4) Weder Flickzeug noch ein Handy hatte sie dabei.",
    ["radelte|rollte|knallte|krachte|bemerkte|entdeckte|stellte fest|rief|hielt|bremste|strampelte|sauste", "erschrocken|entsetzt|plötzlich|leider|zum glück|kurz darauf|in diesem moment|gerade als|als sie|verzweifelt|gerade rollte|ausgerechnet", "weder|noch ein handy|und auch kein handy|außerdem|nicht einmal|ebenso wenig|fehlte"],
    { vorgabe: V_PANNE }),
  a(PLAN, PLAN_KR(W_AUFZUG, "ich und meine Oma, Hochhaus, Freitagabend"),
    "Ausgangslage: Freitagabend, ich besuche Oma im Hochhaus und will den Müll hinunterbringen · Hauptteil: Der Aufzug ruckt und bleibt zwischen zwei Stockwerken stehen – Stromausfall, alles dunkel · Der Notrufknopf bleibt stumm, ich bekomme Panik · Höhepunkt: Es klopft, ein Lichtstrahl fällt durch den Türspalt – der Hausmeister mit der Taschenlampe · Schluss: Er stemmt die Tür auf, ich klettere hinaus und nehme ab jetzt die Treppe",
    ["dunkel|finster|schwarz|kein licht|licht aus", "steck|stehen bleib|bleibt stehen|blieb stehen|ruckt|ruckelt|notruf|knopf|eingeschlossen", "angst|panik|herz|klopf|schreie|schreit|schrie|rufen|ruft|zitter", "gerettet|befreit|erleichtert|froh|treppe|hausmeister|feuerwehr|geht wieder an|licht an|wieder strom"],
    { vorgabe: "Reizwörter: " + W_AUFZUG }),
  s(SCHREIBEN_M, RASTER_M(W_AUFZUG), { minWoerter: 160, material: "Reizwörter: " + W_AUFZUG })
];

// M7, Variante B – Schreibaufgabe: Reizwörter Zeltlager – Gewitter – Landkarte
// Kleine Geschichten davor: Modellflugzeug auf dem Dach · Zahnspange im Müll · Minigolf · Mathearbeit · Popcorn
const M_B = [
  o(ORDNEN("sechs"), [
    "Von seinem Onkel bekommt Moritz ein Modellflugzeug geschenkt.",
    "Auf dem Sportplatz lässt er es zum ersten Mal fliegen.",
    "Eine Windböe treibt das Flugzeug auf das Dach der Turnhalle.",
    "Moritz klingelt beim Hausmeister und bittet ihn um Hilfe.",
    "Der Hausmeister lehnt eine lange Leiter an die Wand.",
    "Mit einem Kratzer am Flügel bekommt Moritz sein Flugzeug zurück."], { points: 3, hinweis: ORDNEN_TIPP }),
  m(AUFBAU, [
    ["Erst in der Englischstunde fuhr Luisa mit der Zunge über die Zähne und erstarrte. Sie rannte zurück, doch die Tabletts waren abgeräumt, und vor der Küche standen drei pralle Müllsäcke.", HAUPT],
    ["Draußen hupte schon der Müllwagen. Hastig wühlte Luisa zwischen kalten Nudeln und Bananenschalen – da schimmerte ganz unten etwas Rosafarbenes.", HOEHE],
    ["Zu Hause schrubbte Luisa das gute Stück dreimal mit Zahnpasta. Seitdem wandert die Spange beim Essen nur noch in ihre Dose.", SCHLUSS],
    ["Es war ein gewöhnlicher Dienstag in der Mensa. Wie immer wickelte Luisa ihre Zahnspange vor dem Essen in eine Serviette und legte sie auf das Tablett.", EINL]], { points: 2, hinweis: AUFBAU_TIPP }),
  c("In einer Erzählung entscheidet Sinas letzter Schlag beim Minigolf über den Sieg. Welcher dieser Sätze baut am meisten Spannung auf?", [
    "Der Ball rollte auf das Loch zu, wurde langsamer, immer langsamer – und blieb zitternd am Rand liegen.",
    "Sinas letzter Ball rollte auf das Loch zu und blieb dann genau am Rand liegen.",
    "Es war plötzlich unglaublich spannend, ob Sinas letzter Ball ins Loch fallen würde.",
    "Sina brauchte auf der letzten Bahn nur noch einen einzigen Schlag, um das Turnier gegen ihren älteren Bruder zu gewinnen."], 0, { hinweis: SPANNUNG_TIPP }),
  a(AUSGESTALTEN("Leyla"), AUSGESTALTEN_KR(V_MATHE, "Leyla", "Herr Aydin kommt Reihe für Reihe näher, legt das Blatt verdeckt hin, Leyla dreht es ganz langsam um", "„Hoffentlich hat das Lernen gereicht“, dachte sie; ihre Hände wurden feucht"),
    "Reihe für Reihe kam Herr Aydin näher. Leylas Hände wurden feucht. Hatte das Lernen am Wochenende gereicht? „Sieh es dir in Ruhe an“, sagte er leise und legte das Blatt mit der Rückseite nach oben auf ihren Tisch. Leyla hielt den Atem an und drehte es ganz langsam um.",
    ["sagte|meinte|flüsterte|murmelte|fragte|raunte|rief|lächelte", "herz|hände|magen|atem|dachte|hoffentlich|bitte|zitter|kloß|feucht", "langsam|näher|reihe für reihe|zögernd|endlich|vorsichtig|millimeter|sekunde|schritt"],
    { vorgabe: V_MATHE }),
  a(UEBERARBEITEN_M, UEBERARBEITEN_KR(V_POPCORN,
    "Wiederholt werden „machen – machte – machte“ (Satz 1 und 2) und „ging“ (Satz 3 und 5). Mindestens eine Wiederholung ist beseitigt, z. B. „Sie gab Öl und Mais in den Topf und schaltete den Herd ein“ oder „… rannte sie zurück“.",
    "Die Sätze 3, 4 und 5 beginnen mit „Dann“. Mindestens einer beginnt jetzt anders (z. B. „Plötzlich …“, „Kurz darauf …“, „So schnell sie konnte, …“).",
    "Blass sind „machte“, „ging“, „hörte … ein lautes Geräusch“ und „sagte“. Mindestens eines ist durch ein genaueres Verb ersetzt (z. B. gab, schaltete ein, schlenderte, knallte es, rannte, rief)."),
    "(2) Sie gab Öl und Mais in den Topf und schaltete den Herd ein. (4) Plötzlich knallte es in der Küche. (5) So schnell sie konnte, rannte sie zurück.",
    ["goss|schüttete|füllte|schaltete|drehte|stellte|zubereiten|gab öl", "plötzlich|kurz darauf|danach|währenddessen|auf einmal|sofort|so schnell|erschrocken|wenig später|inzwischen", "rannte|stürzte|eilte|sauste|flitzte|schlenderte|knallte|prasselte|krachte|rief|lachte|grinste"],
    { vorgabe: V_POPCORN }),
  a(PLAN, PLAN_KR(W_ZELTLAGER, "unsere Dreiergruppe, Zeltlager am Waldsee, zweiter Tag"),
    "Ausgangslage: zweiter Tag im Zeltlager am Waldsee, Geländespiel in Dreiergruppen, ich trage die Landkarte · Hauptteil: Wir finden zwei Stationen, dann wird der Himmel schwarz – ein Gewitter zieht auf · Der Regen weicht die Landkarte auf, an der Weggabelung wissen wir nicht weiter · Höhepunkt: Es blitzt und donnert direkt über uns, Fenja erkennt auf der Karte gerade noch die Schutzhütte, wir rennen los · Schluss: Ein Betreuer holt uns dort ab, im Küchenzelt gibt es heißen Tee, die zerknitterte Karte behalte ich als Andenken",
    ["donner|blitz|regnet|regenguss|sturm|wolken|himmel", "verlaufen|verirr|orientier|richtung|abzweig|gabelung|kreuzung|aufgeweicht|weggeweht|zerriss|nass", "angst|panik|zitter|herz|schreie|schreit|schrie|rennen|rannten|laufen los", "hütte|unterstand|betreuer|gerettet|erleichtert|froh|gefunden|trocken|sonne|zurück im lager"],
    { vorgabe: "Reizwörter: " + W_ZELTLAGER }),
  s(SCHREIBEN_M, RASTER_M(W_ZELTLAGER), { minWoerter: 160, material: "Reizwörter: " + W_ZELTLAGER })
];

const ALLE = { kurz: "Erzählen", scope: "Schreibplan · Aufbau · Spannung · eigene Erzählung", minutes: 60, texte: [],
  hinweis: "Arbeite allein und lies jede Aufgabe genau. Teile dir die Zeit ein: etwa 20 Minuten für die Aufgaben 1 bis 6, etwa 35 Minuten für deine Erzählung (Aufgabe 7) und 5 Minuten zum Durchlesen. Nach der Abgabe kannst du nichts mehr ändern." };
module.exports = {
  "d7-p1-r-a": probe(1, "R", "A", { ...ALLE, title: "Probe 1 (R7): Erzählen", items: R_A }),
  "d7-p1-r-b": probe(1, "R", "B", { ...ALLE, title: "Probe 1 (R7): Erzählen – Variante B", items: R_B }),
  "d7-p1-m-a": probe(1, "M", "A", { ...ALLE, title: "Probe 1 (M7): Erzählen", items: M_A }),
  "d7-p1-m-b": probe(1, "M", "B", { ...ALLE, title: "Probe 1 (M7): Erzählen – Variante B", items: M_B })
};
