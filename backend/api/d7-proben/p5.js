"use strict";

/**
 * Deutsch 7 · Probe 5: Literatur (eine kurze Erzählung verstehen: Handlung, Figuren, Beziehungen, Verhalten erklären,
 * Textbelege mit Zeilenangaben, einfache Deutung, eine kleine gestaltende Aufgabe).
 * LehrplanPLUS D7 2.2 (literarische Texte: Figuren und ihr Verhalten, Deutungen am Text belegen; M7: Widerspruch von
 * Verhalten und Aussagen einer Figur, Zitate, sprachliche Bilder), 3.2 (Ergebnisse darstellen, gestaltend schreiben).
 * R7: 30 Punkte · M7: 34 Punkte · etwa 45 Minuten. Alle Erzählungen eigenständig für GRUMI erstellt.
 * Bleibt auf dem Server (Lösungen). Bausteine: bau.js.
 */
const { c, m, o, z, a, kr, text, probe } = require("./bau");

/* ------------------------------ Texte ------------------------------ */
// R7, Variante A: zwei Freundinnen, ein anvertrautes Geheimnis wird weitergesagt
const VERSPROCHEN = text("t1", "Versprochen", "Erzählung", [
  "Am Dienstag nach dem Sportunterricht zog Nelli ihre Freundin Ayla hinter die Turnhalle. „Ich muss dir etwas sagen“, flüsterte sie. „Aber du darfst es keinem erzählen.“ Ayla nickte. „Versprochen.“",
  "Nelli sah auf ihre Schuhe. „Ich kann nicht schwimmen. Nicht richtig. Und nächste Woche gehen wir mit der Klasse ins Hallenbad.“ Ayla wusste nicht, was sie sagen sollte. Sie drückte nur Nellis Hand.",
  "Am nächsten Morgen stand Ayla in der ersten Pause neben Carla und ihren Freundinnen. Sonst redete Carla nie mit ihr. Heute lachten alle über ein Video, und Ayla lachte mit, obwohl sie es gar nicht kannte. „Warum ist Nelli eigentlich so still, seit es ums Hallenbad geht?“, fragte Carla plötzlich. Alle sahen Ayla an. Es war ein gutes Gefühl, dass ihr einmal alle zuhörten. „Na ja“, sagte Ayla, „sie kann halt nicht schwimmen.“ Kaum war der Satz heraus, hätte sie ihn am liebsten zurückgeholt. „Aber sagt es nicht weiter!“ Carla grinste. „Klar.“",
  "In der zweiten Pause wusste es die halbe Klasse. Als Nelli über den Hof ging, ruderte ein Junge mit den Armen und rief: „Hilfe, ich gehe unter!“ Einige lachten. Nelli blieb stehen. Sie suchte Aylas Blick. Ayla schaute schnell auf den Boden. Da drehte Nelli sich um und ging, ohne ein Wort.",
  "Am Nachmittag lag Aylas Handy stumm auf dem Schreibtisch. Dreimal begann sie eine Nachricht an Nelli, dreimal löschte sie alles wieder. „Es tut mir leid“ sah auf dem Bildschirm so klein aus.",
  "Am Morgen darauf wartete Ayla am Schultor. Ihr Herz klopfte, als Nelli kam. „Ich war es“, sagte Ayla. „Ich habe es Carla erzählt. Ich wollte, dass sie mich mag. Das war mies von mir.“ Nelli sagte lange nichts. Dann sah sie Ayla an. „Weißt du, was das Schlimmste ist? Nicht, dass sie lachen. Sondern dass du es warst.“",
  "Sie ging an Ayla vorbei zum Eingang. Dort blieb sie stehen, ohne sich umzudrehen. „Kommst du jetzt oder nicht?“ Ayla wusste nicht, ob das schon ein Verzeihen war. Aber sie lief los."
]);

// R7, Variante B: ein neuer Mitschüler und eine Mutprobe, die eigentlich keiner will
const STUFEN = text("t1", "Zweiundzwanzig Stufen", "Erzählung", [
  "Seit Montag saß Davit in der 7b, ganz hinten am Fenster. In den Pausen stand er am Rand des Hofes und sah den anderen beim Kicken zu. Bisher hatte ihn keiner gefragt, ob er mitspielen wollte. Am Donnerstag winkte Oskar ihn heran. „Willst du bei uns mitmachen? Dann komm nach der Schule mit dem Rad zur Treppe im Stadtpark.“",
  "Joris stand daneben und wusste sofort, was das hieß. Die Treppe im Stadtpark hatte zweiundzwanzig Stufen aus Stein, steil, schmal und ohne Geländer. Wer zu Oskars Gruppe gehören wollte, musste einmal mit dem Rad hinunterfahren. Joris hatte es vor einem Jahr getan. Noch heute bekam er feuchte Hände, wenn er daran dachte.",
  "Am Nachmittag standen sie zu fünft oben an der Treppe. „Ist ganz leicht“, sagte Oskar. „Das hat jeder von uns geschafft.“ Davit sah hinunter. „Sicher“, sagte er leise. „Kein Problem.“ Er schob sein Rad bis an die oberste Stufe und stieg auf. Seine Hände am Lenker zitterten.",
  "Joris sah zu den anderen. Emil kaute an seinem Daumennagel. Tayo zog seine Kapuze tiefer ins Gesicht. Keiner lachte. Keiner feuerte Davit an. Eigentlich, dachte Joris, will das hier keiner sehen.",
  "„Warte!“ Seine Stimme war lauter, als er wollte. „Steig ab, Davit. Ich bin letztes Jahr da unten über den Lenker geflogen. Das war nicht leicht. Das war einfach nur dumm.“ Oskar starrte ihn an. „Spinnst du? Du hast es doch selbst gemacht!“ „Eben“, sagte Joris. „Und ich würde es nie wieder tun.“",
  "Eine Weile war es still. Dann sagte Emil: „Ich fand das schon immer blöd.“ Tayo nickte. Davit stieg langsam vom Rad. Er sagte nichts, aber er stellte sich neben Joris.",
  "„Dann eben nicht“, murmelte Oskar. „War sowieso nur Spaß.“ Er hob einen Stein auf und warf ihn die Stufen hinunter. Die anderen schoben ihre Räder schon in Richtung Bolzplatz, und Davit ging in ihrer Mitte. An der Wegbiegung drehte Joris sich noch einmal um. Oskar stand immer noch oben an der Treppe und sah hinunter. Ob er wütend war oder froh, konnte Joris nicht erkennen."
]);

// M7, Variante A: große Schwester, kleiner Bruder – sie soll auf ihn aufpassen
const JACKE = text("t1", "Die gelbe Jacke", "Erzählung", [
  "„Du passt heute Nachmittag auf Mattis auf“, sagte Mama und schlüpfte in ihre Schuhe. „Meine Schicht im Laden geht bis sechs.“ Paulina stöhnte. Ausgerechnet heute wollten sich alle am Skatepark treffen. „Ich bin doch nicht sein Kindermädchen!“ Mama sah sie nur an. „Schon gut“, murmelte Paulina. „Ich lasse ihn keine Sekunde aus den Augen.“",
  "Auf dem Spielplatz hinter den Hochhäusern setzte sie sich auf die Bank und zog ihr Handy heraus. Mattis zupfte an ihrem Ärmel. „Schubst du mich auf der Schaukel an?“ „Später.“ „Schau mal, wie hoch ich klettern kann!“ „Mattis, du nervst. Geh spielen.“ Er blieb noch einen Moment stehen. Dann trottete er in seiner gelben Jacke zum Klettergerüst. Paulina schaute nicht hin. Im Gruppenchat schickte Selma gerade Fotos vom Skatepark. „Wo bleibst du?“, schrieb sie. „Komme bald“, tippte Paulina. „Muss nur noch kurz den Kleinen hüten.“",
  "Als sie das nächste Mal aufsah, war das Klettergerüst leer. Sie blickte zur Rutsche, zum Sandkasten, zur Schaukel. Nirgends eine gelbe Jacke. „Mattis?“ Eine Frau mit Kinderwagen schüttelte den Kopf. Paulina sah auf die Handyuhr: Zwanzig Minuten waren vergangen. Die Angst legte sich wie eine kalte Hand in ihren Nacken.",
  "Sie rannte los. Um die Hecke, über den Parkplatz, bis vor zur großen Straße, auf der die Autos vorbeirauschten. „Mattis!“ Ihre Stimme überschlug sich. Sie dachte an Mamas Blick. Sie dachte an alles, was einem Sechsjährigen an einer solchen Straße zustoßen konnte. Und sie dachte an ihren eigenen Satz: Du nervst.",
  "Zuletzt lief sie nach Hause, weil sie nicht mehr wusste, wo sie noch suchen sollte. Auf der Treppe vor der Haustür saß eine kleine Gestalt in einer gelben Jacke und malte mit einem Stock Kreise in den Staub. Paulina blieb stehen. Ihre Knie waren weich. „Bist du verrückt geworden?“, schrie sie. „Du kannst doch nicht einfach weglaufen!“ Dabei drückte sie ihn so fest an sich, dass er kaum Luft bekam.",
  "„Ich bin nicht weggelaufen“, sagte Mattis in ihre Jacke hinein. „Ich bin heimgegangen. Du hast gesagt, ich nerve.“",
  "Paulina ließ ihn los. Sie wollte etwas antworten, aber ihr fiel nichts ein, was gestimmt hätte. Schweigend schob sie das Handy tief in die Hosentasche und setzte sich neben ihn auf die Stufe. „Zeig mal, was du da malst“, sagte sie. Später spielten sie im Hof Fangen, und Paulina sah kein einziges Mal nach, wer ihr geschrieben hatte.",
  "Kurz nach sechs drehte sich der Schlüssel im Schloss. „Na, ihr zwei? Alles gut gegangen?“, fragte Mama. Paulina spürte, wie ihr Gesicht heiß wurde. Bevor sie etwas sagen konnte, antwortete Mattis: „Ja. Wir haben Fangen gespielt.“ Er sah Paulina dabei an, ganz ernst. Mama lächelte und ging in die Küche. Paulina sah ihr nach. Dann holte sie tief Luft."
]);

// M7, Variante B: eine gefundene Geldbörse – behalten oder zurückbringen?
const FUND = text("t1", "Fundsache", "Erzählung", [
  "Die Geldbörse lag unter der Bank an der Bushaltestelle, dunkelrot und abgegriffen. Jaro hob sie auf. Er dachte, sie sei leer. Sie war es nicht. Zwischen einem Ausweis und dem Foto eines dicken Dackels steckten vier Scheine: neunzig Euro.",
  "„Neunzig?“ Benno pfiff durch die Zähne. „Mann, behalt die! Wer so viel Geld herumliegen lässt, hat genug davon.“ Jaro dachte an die Fußballschuhe im Schaufenster am Marktplatz, an denen er jeden Tag vorbeiging. Neunundsiebzig Euro. Seine alten hatte Mama schon zweimal geklebt. „Gefunden ist nicht gestohlen“, sagte er und steckte die Geldbörse ein. „Das ist etwas ganz anderes.“",
  "Auf dem Heimweg lag sie in seiner Jackentasche wie ein heißer Stein. In seinem Zimmer schob er sie unter die Matratze, ganz nach hinten an die Wand. Als Mama am Abend an die Tür klopfte, um Gute Nacht zu sagen, zuckte er zusammen und zog die Decke bis zum Kinn. „Ist etwas?“, fragte sie. „Nein. Was soll denn sein?“",
  "Er konnte nicht schlafen. Gegen Mitternacht holte er die Geldbörse wieder hervor und leuchtete mit dem Handy hinein. Hinter dem Hundefoto steckte ein gefalteter Zettel, den er übersehen hatte. Eine zittrige Bleistiftschrift: Brot, Milch, Hundefutter, Tabletten. Hinter jedem Wort stand ein Preis, auf den Cent genau. Unter dem Strich stand eine Summe und daneben: „Der Rest muss bis zum Monatsende reichen.“",
  "Jaro kannte solche Zettel. Mama schrieb sie auch, spät abends am Küchentisch, wenn er eigentlich schon schlafen sollte. Er las die letzten Worte dreimal. Dann dachte er an Bennos Satz. Der Satz stimmte nicht. Auf dem Ausweis standen ein Name, Hedwig Aumüller, und eine Adresse: Lindenweg 4, keine zehn Minuten entfernt.",
  "Am nächsten Morgen ging er früher los als sonst. An der Kreuzung führte der Weg links zur Schule und zum Marktplatz, rechts zum Lindenweg. Jaro blieb stehen, bis die Ampel zum zweiten Mal grün wurde. Dann bog er nach rechts ab.",
  "Im Lindenweg 4 stand „Aumüller“ an der untersten Klingel. Jaro drückte auf den Knopf, bevor er es sich anders überlegen konnte. Eine kleine alte Frau öffnete, hinter ihren Beinen bellte ein dicker Dackel. Als sie die Geldbörse sah, hielt sie sich am Türrahmen fest. „Ich habe die ganze Nacht kein Auge zugemacht“, sagte sie. Ich auch nicht, dachte Jaro. Frau Aumüller zählte das Geld nicht nach. Sie nahm nur seine Hand zwischen ihre beiden Hände. „Dass es so ehrliche Jungen noch gibt!“",
  "Jaro bekam heiße Ohren. Ehrlich. Er dachte an die Matratze und an die Schuhe im Schaufenster. „Ist doch selbstverständlich“, murmelte er und zog seine Hand zurück.",
  "Auf dem Schulweg war seine Jackentasche leer und leicht. Am Schaufenster ging er vorbei, ohne stehen zu bleiben. Nur das Wort nahm er mit. Er wusste noch nicht, ob es ihm gehörte."
]);

/* ------------------------------ Aufgaben ------------------------------ */
const ORDNEN = "Bringe die Ereignisse in die Reihenfolge, in der sie in der Geschichte geschehen.";
const ORDNEN_HINWEIS = "Suche jedes Ereignis im Text und notiere dir seine Zeile. Dann siehst du die Reihenfolge.";
const FIGUREN_R = "Wer verhält sich so? Ordne jeder Figur das passende Verhalten zu.";
const FIGUREN_M = "Was erfährst du über die Figuren? Ordne jeder Figur die passende Aussage zu.";
const FIGUREN_HINWEIS = "Suche im Text die Stellen, an denen die Figur vorkommt, und lies genau, was sie dort tut oder sagt.";
const ZEILE_HINWEIS = "Suche im Text zuerst das Schlüsselwort aus der Frage. Lies dann den ganzen Satz und notiere seine Zeilen.";
const THEMA_R = "Worum geht es in der Geschichte vor allem?";
const THEMA_M = "Welche Aussage passt am besten zur ganzen Geschichte?";
const THEMA_HINWEIS = "Das Thema passt zu Anfang, Mitte und Schluss – nicht nur zu einer Stelle. Prüfe bei jeder Antwort: Zeigt die Geschichte das wirklich?";
const ERZAEHLT = "Wie wird die Geschichte erzählt?";
const ERZAEHLT_HINWEIS = "Achte auf die Pronomen (ich oder er/sie) und darauf, von welcher Figur du Gedanken und Gefühle erfährst.";
const DREI_SCHRITTE = "So kannst du schreiben: Am Anfang … Dann … Am Schluss …";

// R7, Variante A – „Versprochen“ (Absätze: 1–4 · 5–8 · 9–18 · 19–23 · 24–27 · 28–33 · 34–37)
const R_A = [
  o(ORDNEN, [
    "Nelli erzählt Ayla, dass sie nicht schwimmen kann.",
    "Carla stellt Ayla eine Frage über Nelli.",
    "Ein Junge macht sich auf dem Hof über Nelli lustig.",
    "Ayla löscht ihre Nachrichten wieder.",
    "Ayla sagt Nelli die Wahrheit."], { points: 3, text: "t1", hinweis: ORDNEN_HINWEIS }),
  c("Wann und wo erzählt Nelli Ayla ihr Geheimnis?", [
    "am Dienstag nach dem Sportunterricht hinter der Turnhalle",
    "am Dienstag vor dem Unterricht am Schultor",
    "am Mittwoch in der ersten Pause auf dem Hof",
    "am Donnerstag nach der Schule im Hallenbad"], 0, { text: "t1", hinweis: "Lies den Anfang der Geschichte noch einmal genau: Dort stehen Tag und Ort." }),
  m(FIGUREN_R, [
    ["Nelli", "sieht beim Sprechen auf ihre Schuhe"],
    ["Ayla", "bekommt am Schultor Herzklopfen"],
    ["Carla", "grinst und sagt: „Klar.“"],
    ["ein Junge auf dem Hof", "rudert mit den Armen"]], { points: 2, text: "t1", hinweis: FIGUREN_HINWEIS }),
  z("In welchen Zeilen verrät Ayla Nellis Geheimnis an Carla?", "t1", [[15, 16]], { hinweis: ZEILE_HINWEIS }),
  z("In welchen Zeilen sagt Nelli, was für sie das Schlimmste ist?", "t1", [[31, 33]], { hinweis: ZEILE_HINWEIS }),
  a("Warum erzählt Ayla Carla, dass Nelli nicht schwimmen kann? Erkläre den Grund und belege ihn mit einer Textstelle. Gib die Zeile an.", [
    kr("Grund erklärt", 2, "Ayla möchte bei Carla und ihren Freundinnen dazugehören bzw. von Carla gemocht werden: Carla redet sonst nie mit ihr, und Ayla genießt es, dass ihr einmal alle zuhören. 2 Punkte, wenn der Wunsch, dazuzugehören oder beachtet zu werden, erklärt ist; 1 Punkt für eine nur ungefähre Antwort (z. B. „weil Carla gefragt hat“)."),
    kr("passende Textstelle", 1, "z. B. „Es war ein gutes Gefühl, dass ihr einmal alle zuhörten“ (Z. 14–15) · „Sonst redete Carla nie mit ihr“ (Z. 10) · „Ich wollte, dass sie mich mag“ (Z. 30) · auch: Ayla lacht mit, obwohl sie das Video gar nicht kennt (Z. 11–12); wörtlich oder sinngemäß"),
    kr("Zeilenangabe stimmt", 1, "Z. 10, Z. 11–12, Z. 14–15 oder Z. 30, passend zur genannten Textstelle (± 1 Zeile)")
  ], "Ayla erzählt es, weil sie möchte, dass Carla und die anderen sie mögen. Sonst redet Carla nie mit ihr. In Zeile 14–15 steht: „Es war ein gutes Gefühl, dass ihr einmal alle zuhörten.“",
  ["mag|mögen|dazugehör|zuhör|beachte|beliebt|aufmerksam|interessant", "z.|zeile"], { text: "t1", hilfe: "So kannst du schreiben: Ayla erzählt es, weil … Das sieht man in Zeile …: „…“" }),
  a("Nelli sucht Aylas Blick, aber Ayla schaut schnell auf den Boden (Z. 22). Wie fühlt sich Ayla in diesem Moment? Erkläre, warum.", [
    kr("Gefühl benannt", 1, "Sie schämt sich / hat ein schlechtes Gewissen / fühlt sich schuldig (auch: Sie hat Angst, dass Nelli merkt, wer es verraten hat; auch: Sie fühlt sich feige, weil sie Nelli nicht hilft)."),
    kr("Begründung", 2, "Ayla hat das Geheimnis weitergesagt und sieht jetzt, dass Nelli deshalb ausgelacht wird. Darum kann sie Nelli nicht in die Augen sehen. 2 Punkte, wenn beides vorkommt (ihr Verrat und die Folge für Nelli), 1 Punkt für eines.")
  ], "Ayla schämt sich. Sie weiß, dass Nelli nur ausgelacht wird, weil sie das Geheimnis verraten hat. Deshalb kann sie Nelli nicht ansehen.",
  ["schäm|scham|schuld|gewissen|peinlich|feige|angst", "verraten|weitergesagt|weitererzählt|erzählt|geheimnis|ausgelacht|lachen|lacht"], { text: "t1", hilfe: "So kannst du beginnen: Ayla fühlt sich …, weil …" }),
  a("Beschreibe, wie sich die Freundschaft zwischen Ayla und Nelli im Lauf der Geschichte verändert.", [
    kr("Freundschaft am Anfang", 1, "Die beiden sind eng befreundet: Nelli vertraut Ayla ihr Geheimnis an, Ayla verspricht zu schweigen und drückt ihre Hand."),
    kr("was sich verändert und warum", 2, "Ayla sagt das Geheimnis weiter, Nelli wird ausgelacht. Nelli ist enttäuscht und verletzt, sie geht ohne ein Wort; die beiden reden nicht mehr miteinander. Je 1 Punkt für die Veränderung und für den Grund."),
    kr("Freundschaft am Schluss", 1, "Ayla gibt alles zu. Nelli ist noch verletzt, lässt Ayla aber mitkommen – es bleibt offen, ob sie ihr verzeiht (auch: Die Freundschaft bekommt eine neue Chance; auch: Sie ist noch nicht wieder wie vorher).")
  ], "Am Anfang sind die beiden enge Freundinnen, denn Nelli vertraut Ayla ihr Geheimnis an. Dann sagt Ayla es weiter, und Nelli ist enttäuscht und geht weg. Am Schluss gibt Ayla ihren Fehler zu. Nelli ist noch verletzt, aber sie wartet am Eingang auf Ayla.",
  ["vertrau|geheimnis|gute freund|beste freund", "verraten|weitergesagt|weitererzähl|enttäuscht|verletzt|sauer|wütend|traurig", "gibt zu|zugegeben|entschuldig|verzeih|chance|am eingang|mitkommen|bleibt offen|noch offen"], { text: "t1", hilfe: DREI_SCHRITTE }),
  c(THEMA_R, [
    "Es geht darum, was ein gebrochenes Versprechen mit einer Freundschaft macht.",
    "Es geht darum, dass man sich für eine Schwäche nicht schämen muss.",
    "Es geht darum, wie man in einer Gruppe schnell beliebt wird.",
    "Es geht darum, dass eine Nachricht auf dem Handy kein Gespräch ersetzt."], 0, { points: 2, text: "t1", hinweis: THEMA_HINWEIS }),
  a("Am Schluss fragt Nelli: „Kommst du jetzt oder nicht?“ (Z. 35). Was zeigt dieser Satz darüber, was Nelli jetzt über Ayla denkt und fühlt? Begründe deine Meinung mit dem Text.", [
    kr("eigene Deutung", 1, "Vertretbar ist z. B.: Nelli gibt Ayla noch eine Chance und will die Freundschaft nicht aufgeben. Auch: Nelli ist noch verletzt und hat nicht verziehen, will aber nicht allein in die Klasse gehen. Auch: Sie rechnet Ayla an, dass sie ehrlich war. Jede Deutung zählt, die zum Text passt; „alles ist wieder gut“ passt nicht (Z. 35–36)."),
    kr("Begründung mit dem Text", 2, "z. B. Sie bleibt am Eingang stehen und wartet (Z. 34–35) · Ayla hat alles zugegeben (Z. 29–31) · Nelli dreht sich nicht um und klingt kurz angebunden (Z. 34–35) · Sie sagt, das Schlimmste sei, dass es Ayla war (Z. 31–33). 2 Punkte für eine Begründung mit einer passenden Textstelle, 1 Punkt für eine Begründung ohne Bezug zum Text.")
  ], "Ich glaube, Nelli gibt Ayla noch eine Chance. Sie ist zwar noch verletzt, denn sie dreht sich nicht um. Aber sie bleibt am Eingang stehen und wartet, und Ayla hat ihr die Wahrheit gesagt.",
  ["chance|verzeih|vergeb|freundin|freundschaft|verletzt|sauer|böse|nicht allein", "am eingang|bleibt stehen|stehen bleibt|umzudrehen|umdreh|zugegeben|ehrlich|wahrheit|schlimmste|z.|zeile"], { text: "t1", hilfe: "So kannst du beginnen: Ich glaube, Nelli … Das passt zum Text, weil …" }),
  a("Die Geschichte endet am Morgen vor der Schule. Am Abend dieses Tages schreibt Nelli eine Nachricht an Ayla. Schreibe diese Nachricht in vier bis fünf Sätzen. Schreibe so, wie Nelli denkt und fühlt.", [
    kr("passt zur Handlung", 2, "Die Nachricht bezieht sich auf das, was passiert ist: das weitergesagte Geheimnis, das Auslachen auf dem Hof, Aylas Geständnis am Schultor. Nichts widerspricht der Geschichte. 2 Punkte bei mindestens zwei richtigen Bezügen, 1 Punkt bei einem."),
    kr("Gedanken und Gefühle der Figur", 2, "Nellis Sicht wird deutlich: z. B. enttäuscht, verletzt, bloßgestellt, wütend – aber auch froh, dass Ayla ehrlich war; was sie sich jetzt wünscht (Zeit, dass so etwas nie wieder vorkommt, dass Ayla zu ihr hält). Eine versöhnliche und eine strenge Nachricht sind beide richtig, wenn sie zu Nelli passen. 2 Punkte, wenn Gefühle genannt und begründet sind, 1 Punkt für ein bloß genanntes Gefühl."),
    kr("Ich-Form und passender Ton", 2, "Durchgehend aus Nellis Sicht in der Ich-Form, an Ayla gerichtet (Anrede „du“); klingt wie eine Nachricht unter Freundinnen; vier bis fünf Sätze. 1 Punkt, wenn die Form nur teilweise stimmt (z. B. Wechsel in die Sie-Form, nur zwei Sätze).")
  ], "Hallo Ayla, ich bin immer noch traurig, weil du mein Geheimnis verraten hast. Als alle gelacht haben, wollte ich am liebsten im Boden versinken. Trotzdem fand ich es mutig, dass du es heute zugegeben hast. Ich brauche noch ein bisschen Zeit. Aber morgen kannst du wieder neben mir sitzen. Nelli",
  ["traurig|verletzt|enttäuscht|wütend|sauer|weh getan|wehgetan|geschämt|peinlich", "geheimnis|verraten|schwimmen|gelacht|ausgelacht|zugegeben|ehrlich", "hallo|liebe ayla|hi ayla|hey|deine nelli|grüße"], { text: "t1", hilfe: "Beginne mit einer Anrede (Hallo Ayla, …). Schreibe als Nelli: Wie ging es mir in den letzten Tagen? Was wünsche ich mir jetzt von Ayla?" })
];

// R7, Variante B – „Zweiundzwanzig Stufen“ (Absätze: 1–6 · 7–12 · 13–17 · 18–21 · 22–27 · 28–30 · 31–37)
const R_B = [
  o(ORDNEN, [
    "Oskar winkt Davit zu sich.",
    "Davit schiebt sein Rad an die oberste Stufe.",
    "Joris ruft: „Warte!“",
    "Emil sagt, wie er die Sache findet.",
    "Die anderen schieben ihre Räder zum Bolzplatz."], { points: 3, text: "t1", hinweis: ORDNEN_HINWEIS }),
  c("Oskar lädt Davit ein. Wann und wohin soll Davit kommen?", [
    "am Donnerstag nach der Schule zur Treppe im Stadtpark",
    "am Montag in der Pause an den Rand des Hofes",
    "am Donnerstag in der Pause zum Bolzplatz",
    "am Freitag nach der Schule zum Bolzplatz"], 0, { text: "t1", hinweis: "Lies den ersten Abschnitt der Geschichte noch einmal genau: Dort stehen Tag und Ort." }),
  m(FIGUREN_R, [
    ["Davit", "sitzt ganz hinten am Fenster"],
    ["Oskar", "sagt: „Das hat jeder von uns geschafft.“"],
    ["Emil", "kaut an seinem Daumennagel"],
    ["Tayo", "zieht seine Kapuze tiefer ins Gesicht"]], { points: 2, text: "t1", hinweis: FIGUREN_HINWEIS }),
  z("In welchen Zeilen wird beschrieben, wie die Treppe aussieht?", "t1", [[7, 9]], { hinweis: ZEILE_HINWEIS }),
  z("In welchen Zeilen steht, was Oskar tut, nachdem er „War sowieso nur Spaß“ gesagt hat?", "t1", [[32, 32]], { hinweis: ZEILE_HINWEIS }),
  a("Warum ruft Joris „Warte!“ und hält Davit auf? Erkläre den Grund und belege ihn mit einer Textstelle. Gib die Zeile an.", [
    kr("Grund erklärt", 2, "Joris weiß aus eigener Erfahrung, wie gefährlich die Fahrt über die Treppe ist: Er ist selbst gestürzt und hat bis heute Angst davor. Er will nicht, dass Davit etwas passiert. Auch: Er merkt, dass Davit Angst hat und dass eigentlich keiner zusehen will. 2 Punkte für einen erklärten Grund, 1 Punkt für eine nur ungefähre Antwort (z. B. „weil es gefährlich ist“)."),
    kr("passende Textstelle", 1, "z. B. „Ich bin letztes Jahr da unten über den Lenker geflogen“ (Z. 23–24) · „Noch heute bekam er feuchte Hände“ (Z. 11–12) · „Seine Hände am Lenker zitterten“ (Z. 17) · „Eigentlich … will das hier keiner sehen“ (Z. 20–21); wörtlich oder sinngemäß"),
    kr("Zeilenangabe stimmt", 1, "Z. 11–12, Z. 17, Z. 20–21 oder Z. 23–24, passend zur genannten Textstelle (± 1 Zeile)")
  ], "Joris hält Davit auf, weil er weiß, wie gefährlich die Treppe ist. Er ist dort selbst schlimm gestürzt. In Zeile 23–24 sagt er: „Ich bin letztes Jahr da unten über den Lenker geflogen.“",
  ["geflogen|gestürzt|sturz|gefährlich|angst|feuchte hände|passiert|verletz|keiner sehen|keiner will", "z.|zeile"], { text: "t1", hilfe: "So kannst du schreiben: Joris ruft das, weil … Das sieht man in Zeile …: „…“" }),
  a("Davit sagt: „Kein Problem.“ (Z. 16). Wie fühlt er sich in diesem Moment wirklich? Erkläre, woran du das erkennst.", [
    kr("Gefühl benannt", 1, "Er hat Angst / ist unsicher / fühlt sich unter Druck (auch: Er traut sich nicht, Nein zu sagen)."),
    kr("Begründung", 2, "Er sagt es nur leise (Z. 15), und seine Hände am Lenker zittern (Z. 17). Auch: Er ist neu und will dazugehören, deshalb gibt er seine Angst nicht zu. 2 Punkte für zwei Hinweise oder für einen Hinweis mit Erklärung, 1 Punkt für einen Hinweis.")
  ], "Davit hat in Wirklichkeit Angst. Das erkennt man daran, dass er nur leise spricht und dass seine Hände zittern. Er sagt es trotzdem, weil er dazugehören will.",
  ["angst|unsicher|fürchte|mulmig|nervös|druck", "leise|hände|zitter|dazugehör|mitmachen"], { text: "t1", hilfe: "So kannst du beginnen: In Wirklichkeit fühlt sich Davit … Das erkenne ich daran, dass …" }),
  a("Wie gehen Davit und die anderen Jungen miteinander um? Beschreibe, wie sich das im Lauf der Geschichte verändert.", [
    kr("Umgang am Anfang", 1, "Davit ist neu und gehört nicht dazu: Er steht am Rand, schaut nur zu, keiner fragt ihn, ob er mitspielen will (Z. 1–4)."),
    kr("was sich verändert und warum", 2, "Davit soll sich an der Treppe beweisen. Joris setzt sich für ihn ein und hält ihn auf; Emil und Tayo geben Joris recht. Davit muss nicht hinunterfahren. Je 1 Punkt für die Veränderung und für den Grund."),
    kr("Umgang am Schluss", 1, "Davit gehört dazu, ohne die Treppe hinuntergefahren zu sein: Er stellt sich neben Joris und geht in der Mitte der anderen zum Bolzplatz (Z. 30, 33–34).")
  ], "Am Anfang gehört Davit nicht dazu. Er steht in der Pause am Rand und schaut nur zu. Dann soll er mit dem Rad die Treppe hinunterfahren, aber Joris hält ihn auf, und die anderen finden das richtig. Am Schluss geht Davit mit den anderen in der Mitte zum Bolzplatz. Jetzt gehört er dazu.",
  ["am rand|allein|zuschau|schaut nur zu|nicht dazu|keiner gefragt|keiner fragt", "joris|aufgehalten|hält ihn auf|geholfen|eingesetzt|hilft|steig ab", "in der mitte|in ihrer mitte|bolzplatz|gehört dazu|gehört er dazu|dazugehör|neben joris|neben ihn"], { text: "t1", hilfe: DREI_SCHRITTE }),
  c(THEMA_R, [
    "Es geht darum, dass es Mut braucht, in einer Gruppe als Erster Nein zu sagen.",
    "Es geht darum, dass neue Schüler sich ihren Platz erst verdienen müssen.",
    "Es geht darum, dass man beim Radfahren immer vorsichtig sein muss.",
    "Es geht darum, dass echte Freunde alles zusammen machen."], 0, { points: 2, text: "t1", hinweis: THEMA_HINWEIS }),
  a("Am Schluss steht Oskar immer noch oben an der Treppe und sieht hinunter (Z. 35–36). Was könnte Oskar in diesem Moment denken oder fühlen? Begründe deine Meinung mit dem Text.", [
    kr("eigene Deutung", 1, "Vertretbar ist z. B.: Oskar ist wütend oder gekränkt, weil keiner mehr auf ihn hört. Auch: Er ist insgeheim erleichtert, weil ihm die Treppe selbst nicht geheuer war. Auch: Er fühlt sich allein und überlegt, ob seine Idee ein Fehler war. Jede Deutung zählt, die zum Text passt."),
    kr("Begründung mit dem Text", 2, "z. B. Er murmelt „Dann eben nicht“ und wirft einen Stein die Stufen hinunter (Z. 31–32) · Er sagt „War sowieso nur Spaß“ – das klingt wie eine Ausrede (Z. 31) · Die anderen gehen ohne ihn los, er bleibt allein zurück (Z. 32–36) · Joris kann nicht erkennen, ob er wütend oder froh ist (Z. 36–37). 2 Punkte für eine Begründung mit einer passenden Textstelle, 1 Punkt für eine Begründung ohne Bezug zum Text.")
  ], "Ich glaube, Oskar ist wütend und fühlt sich allein. Er wirft einen Stein die Stufen hinunter, und die anderen gehen ohne ihn zum Bolzplatz. Vielleicht merkt er aber auch, dass seine Idee nicht gut war.",
  ["wütend|sauer|gekränkt|beleidigt|allein|erleichtert|froh|nachdenk|denkt nach|schäm|traurig", "stein|spaß|murmel|ohne ihn|bolzplatz|keiner|z.|zeile"], { text: "t1", hilfe: "So kannst du beginnen: Ich glaube, Oskar … Das passt zum Text, weil …" }),
  a("Die Geschichte endet am Nachmittag. Am Abend dieses Tages schreibt Davit eine Nachricht an Joris. Schreibe diese Nachricht in vier bis fünf Sätzen. Schreibe so, wie Davit denkt und fühlt.", [
    kr("passt zur Handlung", 2, "Die Nachricht bezieht sich auf das, was passiert ist: die Treppe im Stadtpark, Davit auf dem Rad, Joris’ Ruf, der Weg zum Bolzplatz. Nichts widerspricht der Geschichte. 2 Punkte bei mindestens zwei richtigen Bezügen, 1 Punkt bei einem."),
    kr("Gedanken und Gefühle der Figur", 2, "Davits Sicht wird deutlich: z. B. seine Angst oben an der Treppe, Erleichterung, Dankbarkeit gegenüber Joris, Freude, jetzt dabei zu sein, vielleicht auch Sorge wegen Oskar. Auch andere Gefühle sind richtig, wenn sie zu Davit passen. 2 Punkte, wenn Gefühle genannt und begründet sind, 1 Punkt für ein bloß genanntes Gefühl."),
    kr("Ich-Form und passender Ton", 2, "Durchgehend aus Davits Sicht in der Ich-Form, an Joris gerichtet (Anrede „du“); klingt wie eine Nachricht unter Mitschülern; vier bis fünf Sätze. 1 Punkt, wenn die Form nur teilweise stimmt (z. B. Wechsel in die Er-Form, nur zwei Sätze).")
  ], "Hi Joris, danke, dass du mich heute aufgehalten hast. Ich hatte oben an der Treppe riesige Angst, aber ich wollte es nicht zugeben. Ohne dich wäre ich wirklich hinuntergefahren. Es war schön, danach mit euch zum Bolzplatz zu gehen. Spielen wir morgen in der Pause zusammen? Davit",
  ["danke|dankbar|froh|erleichtert|angst|gezittert|mulmig", "treppe|stufen|stadtpark|aufgehalten|gerufen|bolzplatz|oskar", "hallo|hi joris|hey|lieber joris|dein davit|grüße"], { text: "t1", hilfe: "Beginne mit einer Anrede (Hallo Joris, …). Schreibe als Davit: Wie ging es mir oben an der Treppe? Was möchte ich Joris sagen?" })
];

// M7, Variante A – „Die gelbe Jacke“ (Absätze: 1–6 · 7–16 · 17–22 · 23–28 · 29–35 · 36–37 · 38–43 · 44–49)
const M_A = [
  o(ORDNEN, [
    "Mama schlüpft in ihre Schuhe.",
    "Mattis zupft seine Schwester am Ärmel.",
    "Eine Frau mit Kinderwagen schüttelt den Kopf.",
    "Paulina rennt über den Parkplatz.",
    "Die Geschwister spielen im Hof Fangen.",
    "Der Schlüssel dreht sich im Schloss."], { points: 4, text: "t1", hinweis: ORDNEN_HINWEIS }),
  c(ERZAEHLT, [
    "In der Sie-Form (3. Person); man erfährt nur die Gedanken und Gefühle von Paulina.",
    "In der Ich-Form (1. Person); Paulina erzählt selbst, was sie erlebt hat.",
    "In der Sie-Form (3. Person); man erfährt die Gedanken und Gefühle aller Figuren.",
    "In der Ich-Form (1. Person); Mattis erzählt von seinem Nachmittag."], 0, { text: "t1", hinweis: ERZAEHLT_HINWEIS }),
  m(FIGUREN_M, [
    ["Mama", "muss am Nachmittag arbeiten"],
    ["Mattis", "ist sechs Jahre alt"],
    ["Selma", "verbringt den Nachmittag am Skatepark"],
    ["die Frau mit dem Kinderwagen", "kann bei der Suche nicht helfen"]], { points: 2, text: "t1", hinweis: FIGUREN_HINWEIS }),
  z("In welchen Zeilen bemerkt Paulina, dass ihr Bruder nicht mehr auf dem Spielplatz ist?", "t1", [[17, 19]], { hinweis: ZEILE_HINWEIS }),
  z("In welchen Zeilen steht, wo Paulina ihren Bruder wiederfindet?", "t1", [[30, 32]], { hinweis: ZEILE_HINWEIS }),
  a("Mattis geht vom Spielplatz weg, ohne seiner Schwester etwas zu sagen. Erkläre, warum er das tut. Belege deine Erklärung mit einem wörtlichen Zitat und gib die Zeile an.", [
    kr("Grund erklärt", 2, "Mattis fühlt sich abgewiesen und überflüssig: Paulina hat keine Zeit für ihn, vertröstet ihn („Später“), sagt, dass er nervt, und schaut nicht hin. Er glaubt, dass er stört, und geht deshalb heim. 2 Punkte, wenn erklärt wird, wie Mattis sich fühlt oder was er denkt; 1 Punkt, wenn nur Paulinas Satz wiederholt wird."),
    kr("wörtliches Zitat", 1, "z. B. „Mattis, du nervst. Geh spielen.“ (Z. 10–11) · „Du hast gesagt, ich nerve.“ (Z. 37) · „Paulina schaute nicht hin.“ (Z. 13) · „Später.“ (Z. 10) – wörtlich übernommen und in Anführungszeichen"),
    kr("Zeilenangabe stimmt", 1, "passend zum Zitat (± 1 Zeile)")
  ], "Mattis geht heim, weil er sich abgewiesen fühlt. Paulina hat keine Zeit für ihn und schaut ihm nicht einmal beim Klettern zu. Er glaubt, dass er nur stört. Das zeigt sein Satz: „Du hast gesagt, ich nerve.“ (Z. 37)",
  ["abgewiesen|stört|überflüssig|lästig|allein|traurig|verletzt|gekränkt|keine zeit|unerwünscht|ignorier|beachtet", "nerv|später|schaute nicht hin", "z.|zeile"], { text: "t1" }),
  a("An mehreren Stellen der Geschichte passt das, was Paulina sagt, nicht zu dem, was sie tut oder fühlt. Nenne eine dieser Stellen mit wörtlichem Zitat und Zeilenangabe und erkläre den Widerspruch.", [
    kr("Aussage zitiert, mit Zeilenangabe", 1, "z. B. „Ich lasse ihn keine Sekunde aus den Augen.“ (Z. 6) · auch: „Bist du verrückt geworden?“ (Z. 33) · auch: „Muss nur noch kurz den Kleinen hüten.“ (Z. 15–16)"),
    kr("Verhalten, das nicht dazu passt", 1, "zu Z. 6: Sie schaut auf ihr Handy und nicht hin (Z. 8, 13); zwanzig Minuten vergehen, ohne dass sie nach Mattis sieht (Z. 21). · zu Z. 33: Sie schreit ihn an, drückt ihn dabei aber fest an sich (Z. 34–35). · zu Z. 15–16: Sie „hütet“ ihn gar nicht, sondern schreibt im Chat."),
    kr("Widerspruch erklärt", 2, "zu Z. 6 und Z. 15–16: Sie sagt es nur, weil Mama sie streng ansieht; in Wirklichkeit ist sie mit den Gedanken bei ihren Freunden am Skatepark und nimmt die Aufgabe nicht ernst. · zu Z. 33: Die Worte klingen wütend, aber die Umarmung zeigt, dass sie große Angst um ihn hatte und erleichtert ist. 2 Punkte für eine einleuchtende Erklärung, 1 Punkt, wenn der Gegensatz nur festgestellt wird.")
  ], "Paulina sagt zu Mama: „Ich lasse ihn keine Sekunde aus den Augen.“ (Z. 6) Auf dem Spielplatz schaut sie aber nur auf ihr Handy und sieht zwanzig Minuten lang nicht nach Mattis. Sie hat das nur gesagt, damit Mama beruhigt ist. In Wirklichkeit wäre sie lieber bei ihren Freunden am Skatepark.",
  ["keine sekunde|aus den augen|verrückt geworden|den kleinen hüten", "handy|schaute nicht|schaut nicht|zwanzig minuten|gruppenchat|chatte|drückt|umarm|fest an sich", "z.|zeile"], { text: "t1" }),
  a("„Die Angst legte sich wie eine kalte Hand in ihren Nacken“ (Z. 21–22). Erkläre dieses sprachliche Bild: Was wird hier womit verglichen, und was erfährst du dadurch über Paulina?", [
    kr("Vergleich erkannt", 1, "Die Angst wird mit einer kalten Hand verglichen, die sich in den Nacken legt (Vergleich mit „wie“)."),
    kr("Bedeutung erklärt", 2, "Die Angst kommt plötzlich und ist am ganzen Körper zu spüren – wie eine Berührung, bei der man erschrickt und friert. Paulina begreift in diesem Moment, dass ihrem Bruder etwas zugestoßen sein könnte; die Angst packt sie und lässt sie nicht mehr los. 2 Punkte, wenn die Wirkung des Bildes und Paulinas Lage verbunden werden, 1 Punkt für „sie hat große Angst“.")
  ], "Die Angst wird mit einer kalten Hand im Nacken verglichen. So eine Hand spürt man plötzlich, man erschrickt und bekommt eine Gänsehaut. Das Bild zeigt, dass Paulina auf einmal richtig Angst um Mattis bekommt und dass sie diese Angst am ganzen Körper spürt.",
  ["plötzlich|erschrick|erschreck|gänsehaut|schauer|friert|körper|spürt|packt|den rücken", "mattis|bruder|passiert|verschwunden|sorge|zugestoßen|zustoßen"], { text: "t1" }),
  a("Beschreibe, wie sich Paulinas Verhalten gegenüber ihrem Bruder im Lauf der Geschichte verändert. Gehe auf den Anfang, den Auslöser der Veränderung und den Schluss ein.", [
    kr("Verhalten am Anfang", 1, "Paulina empfindet Mattis als lästig: Sie will nicht auf ihn aufpassen, weist ihn ab („Später“, „du nervst“) und beschäftigt sich mit dem Handy."),
    kr("Auslöser der Veränderung", 1, "Mattis ist verschwunden; Paulina bekommt große Angst und denkt an ihren eigenen Satz. Auch: Mattis’ Satz „Du hast gesagt, ich nerve“ – sie merkt, dass sie ihn verletzt hat."),
    kr("Verhalten am Schluss", 1, "Sie wendet sich ihm zu: steckt das Handy weg, setzt sich zu ihm, interessiert sich für das, was er malt, und spielt mit ihm Fangen.")
  ], "Am Anfang ist Mattis für Paulina nur lästig. Sie schaut auf ihr Handy und schickt ihn weg. Als er verschwunden ist, bekommt sie große Angst und merkt, dass ihr Satz ihn verletzt hat. Am Schluss steckt sie das Handy weg, setzt sich zu ihm und spielt mit ihm.",
  ["lästig|genervt|nerv|handy|schickt ihn weg|abweis|keine lust", "angst|verschwunden|weg war|gesucht|sucht ihn|schreck|schuld|gewissen", "fangen gespielt|fangen spielen|spielt|setzt sich|steckt|kümmert|zeit für"], { text: "t1" }),
  c(THEMA_M, [
    "Auf jemanden aufzupassen bedeutet mehr, als nur in seiner Nähe zu sein.",
    "Ältere Geschwister wissen meistens besser, was für die Kleinen gut ist.",
    "Ein Fehler ist nicht schlimm, solange niemand davon erfährt.",
    "Kleine Kinder sollten nie ohne Erwachsene auf einen Spielplatz gehen."], 0, { points: 2, text: "t1", hinweis: THEMA_HINWEIS }),
  a("Die Geschichte endet mit dem Satz „Dann holte sie tief Luft.“ (Z. 49). Was könnte Paulina in diesem Moment vorhaben? Begründe deine Deutung mit dem Text.", [
    kr("eigene Deutung des Schlusses", 1, "Vertretbar ist z. B.: Paulina will Mama die Wahrheit sagen. Auch: Sie atmet erleichtert auf und schweigt, weil alles gut ausgegangen ist und Mattis sie nicht verraten hat. Auch: Sie nimmt sich vor, mit Mattis zu reden und sich bei ihm zu entschuldigen oder zu bedanken. Auch: Sie nimmt sich vor, künftig wirklich aufzupassen. Jede Deutung zählt, die zum Text passt."),
    kr("Begründung mit dem Text", 2, "z. B. Ihr Gesicht wird heiß – sie hat ein schlechtes Gewissen (Z. 45–46) · Mattis sieht sie „ganz ernst“ an und erzählt nur einen Teil (Z. 47–48) · Sie hat sich am Nachmittag schon verändert: Handy weggesteckt, mit ihm gespielt (Z. 39–43) · Tief Luft holt man, bevor man etwas Schwieriges sagt. 2 Punkte für eine Begründung mit einer passenden Textstelle, 1 Punkt für eine Begründung ohne Bezug zum Text.")
  ], "Ich glaube, Paulina will Mama gleich die Wahrheit sagen. Ihr Gesicht wird heiß, als Mama fragt, sie hat also ein schlechtes Gewissen. Außerdem holt man tief Luft, bevor man etwas Schwieriges sagt. Sie will nicht, dass Mattis für sie etwas verschweigen muss.",
  ["weil|denn|obwohl|aber|bevor|damit|also", "wahrheit|zugeben|gesteh|beicht|erleichtert|schweig|verschweig|entschuldig|bedank|gesicht|gewissen|ganz ernst|fangen gespielt|verraten"], { text: "t1" }),
  a("Am Abend schreibt Paulina in ihr Tagebuch. Schreibe diesen Eintrag in sechs bis acht Sätzen. Zeige, was Paulina über den Nachmittag denkt und fühlt.", [
    kr("passt zur Handlung", 2, "Der Eintrag gibt wichtige Ereignisse des Nachmittags richtig wieder (z. B. Aufpassen statt Skatepark, Handy auf dem Spielplatz, Mattis verschwunden, Suche, Wiederfinden auf der Treppe, Mamas Frage). Nichts widerspricht der Geschichte. 2 Punkte bei mindestens drei richtigen Bezügen, 1 Punkt bei ein bis zwei."),
    kr("Gedanken und Gefühle der Figur", 2, "Paulinas Innensicht wird deutlich und passt zur Geschichte: z. B. Ärger am Anfang, Angst bei der Suche, schlechtes Gewissen wegen ihres Satzes, Erleichterung, Nachdenken über sich selbst oder über Mattis’ Antwort am Schluss. 2 Punkte, wenn mindestens zwei verschiedene Gefühle oder Gedanken begründet vorkommen, 1 Punkt für eines."),
    kr("Ich-Form und Ton eines Tagebuchs", 2, "Durchgehend Ich-Form aus Paulinas Sicht, Rückblick auf den Tag (Vergangenheit), persönlicher Ton; sechs bis acht Sätze. 1 Punkt, wenn die Form nur teilweise stimmt (z. B. Nacherzählung in der Sie-Form, deutlich zu kurz).")
  ], "Liebes Tagebuch, heute sollte ich auf Mattis aufpassen, obwohl ich viel lieber am Skatepark gewesen wäre. Ich war so sauer, dass ich auf dem Spielplatz nur auf mein Handy geschaut habe. Plötzlich war er weg. Ich habe noch nie solche Angst gehabt wie in diesem Moment. Als ich ihn auf der Treppe fand, hätte ich fast geweint. Er ist heimgegangen, weil ich gesagt habe, dass er nervt. Das tut mir furchtbar leid. Morgen schubse ich ihn auf der Schaukel an, so lange er will.",
  ["angst|panik|schreck|erschrocken|gezittert", "tut mir leid|leidgetan|leid getan|gewissen|schuld|schäm|froh|erleichtert|glücklich", "handy|spielplatz|treppe|skatepark|gesucht|weg war|verschwunden|fangen gespielt"], { text: "t1" })
];

// M7, Variante B – „Fundsache“ (Absätze: 1–5 · 6–12 · 13–18 · 19–25 · 26–31 · 32–35 · 36–44 · 45–47 · 48–50)
const M_B = [
  o(ORDNEN, [
    "Jaro hebt unter einer Bank etwas auf.",
    "Benno pfeift durch die Zähne.",
    "Jaro zieht die Decke bis zum Kinn.",
    "Jaro leuchtet mit dem Handy in die Geldbörse.",
    "An einer Ampel bleibt Jaro lange stehen.",
    "Ein dicker Dackel bellt."], { points: 4, text: "t1", hinweis: ORDNEN_HINWEIS }),
  c(ERZAEHLT, [
    "In der Er-Form (3. Person); man erfährt nur die Gedanken und Gefühle von Jaro.",
    "In der Ich-Form (1. Person); Jaro erzählt selbst, was er erlebt hat.",
    "In der Er-Form (3. Person); man erfährt die Gedanken und Gefühle aller Figuren.",
    "In der Ich-Form (1. Person); Frau Aumüller erzählt von ihrem Verlust."], 0, { text: "t1", hinweis: ERZAEHLT_HINWEIS }),
  m(FIGUREN_M, [
    ["Benno", "gibt sofort einen Rat"],
    ["Mama", "kommt am Abend, um Gute Nacht zu sagen"],
    ["Frau Aumüller", "wohnt keine zehn Minuten entfernt"],
    ["Jaro", "geht am Morgen früher los als sonst"]], { points: 2, text: "t1", hinweis: FIGUREN_HINWEIS }),
  z("In welchen Zeilen steht, was Jaro an der Bushaltestelle in der Geldbörse entdeckt?", "t1", [[3, 5]], { hinweis: ZEILE_HINWEIS }),
  z("In welchen Zeilen wird beschrieben, wie Frau Aumüller reagiert, als sie ihre Geldbörse wiedersieht?", "t1", [[39, 44]], { hinweis: ZEILE_HINWEIS }),
  a("Jaro steckt die Geldbörse erst einmal ein, statt sie gleich zurückzugeben. Erkläre, warum er das tut. Belege deine Erklärung mit einem wörtlichen Zitat und gib die Zeile an.", [
    kr("Grund erklärt", 2, "Das Geld ist für Jaro eine große Versuchung: Er wünscht sich die Fußballschuhe aus dem Schaufenster (79 Euro), seine alten sind kaputt, und seine Familie hat offenbar wenig Geld. Auch: Benno redet ihm zu, und Jaro redet sich ein, dass Behalten kein Stehlen ist. 2 Punkte, wenn der Wunsch und Jaros Lage erklärt sind; 1 Punkt für „weil er Schuhe will“ oder „weil Benno es sagt“."),
    kr("wörtliches Zitat", 1, "z. B. „Seine alten hatte Mama schon zweimal geklebt.“ (Z. 9–10) · „Jaro dachte an die Fußballschuhe im Schaufenster“ (Z. 7–8) · „Wer so viel Geld herumliegen lässt, hat genug davon.“ (Z. 7) – wörtlich übernommen und in Anführungszeichen"),
    kr("Zeilenangabe stimmt", 1, "passend zum Zitat (± 1 Zeile)")
  ], "Jaro steckt die Geldbörse ein, weil er sich schon lange die Fußballschuhe aus dem Schaufenster wünscht. Seine Familie hat wenig Geld, denn im Text steht: „Seine alten hatte Mama schon zweimal geklebt.“ (Z. 9–10) Mit den neunzig Euro könnte er sich die Schuhe endlich kaufen.",
  ["fußballschuh|schuhe|wenig geld|leisten|versuchung|wünscht|benno", "geklebt|schaufenster|genug davon|neunundsiebzig", "z.|zeile"], { text: "t1" }),
  a("An mehreren Stellen der Geschichte passt das, was Jaro sagt, nicht zu dem, was er tut oder fühlt. Nenne eine dieser Stellen mit wörtlichem Zitat und Zeilenangabe und erkläre den Widerspruch.", [
    kr("Aussage zitiert, mit Zeilenangabe", 1, "z. B. „Gefunden ist nicht gestohlen“ / „Das ist etwas ganz anderes.“ (Z. 10–12) · auch: „Nein. Was soll denn sein?“ (Z. 18) · auch: „Ist doch selbstverständlich“ (Z. 46–47)"),
    kr("Verhalten, das nicht dazu passt", 1, "zu Z. 10–12: Die Geldbörse fühlt sich an „wie ein heißer Stein“, er versteckt sie unter der Matratze, zuckt zusammen, als Mama klopft, und kann nicht schlafen (Z. 13–19) – so verhält sich jemand, der etwas zu verbergen hat. · zu Z. 18: Er behauptet, es sei nichts, obwohl er erschrickt und wach liegt. · zu Z. 46–47: Selbstverständlich war es für ihn gerade nicht – er hat eine Nacht lang gezögert und noch an der Ampel gewartet (Z. 34–35)."),
    kr("Widerspruch erklärt", 2, "Jaro redet sich ein, dass er nichts Unrechtes tut, spürt aber, dass es nicht stimmt: Er hat ein schlechtes Gewissen. · zu Z. 46–47: Er schämt sich für sein Zögern und will es vor Frau Aumüller nicht zugeben. 2 Punkte für eine einleuchtende Erklärung, 1 Punkt, wenn der Gegensatz nur festgestellt wird.")
  ], "Jaro sagt: „Gefunden ist nicht gestohlen“ (Z. 10–11). Zu Hause versteckt er die Geldbörse aber unter der Matratze und zuckt zusammen, als seine Mutter klopft. Er benimmt sich also wie jemand, der etwas Verbotenes getan hat. Eigentlich weiß er, dass es nicht richtig ist, und hat ein schlechtes Gewissen.",
  ["gefunden ist nicht gestohlen|ganz anderes|was soll denn sein|selbstverständlich", "matratze|versteck|zuckt|schlafen|die decke|gezögert|zöger|ampel", "z.|zeile"], { text: "t1" }),
  a("„Auf dem Heimweg lag sie [die Geldbörse] in seiner Jackentasche wie ein heißer Stein“ (Z. 13–14). Erkläre dieses sprachliche Bild: Was wird hier womit verglichen, und was erfährst du dadurch über Jaro?", [
    kr("Vergleich erkannt", 1, "Die Geldbörse in der Jackentasche wird mit einem heißen Stein verglichen (Vergleich mit „wie“)."),
    kr("Bedeutung erklärt", 2, "Einen heißen Stein spürt man die ganze Zeit: Er brennt, ist schwer, und man möchte ihn loswerden. Jaro kann die Geldbörse nicht vergessen, sie belastet ihn – er hat ein schlechtes Gewissen, obwohl er behauptet, alles sei in Ordnung. 2 Punkte, wenn die Wirkung des Bildes und Jaros Lage verbunden werden, 1 Punkt für „er fühlt sich nicht wohl“.")
  ], "Die Geldbörse wird mit einem heißen Stein verglichen. Einen heißen Stein kann man nicht vergessen, weil er brennt und schwer ist. Das Bild zeigt, dass Jaro die ganze Zeit an das fremde Geld denken muss und ein schlechtes Gewissen hat.",
  ["brenn|schwer|loswerden|vergessen|spürt|belastet|unangenehm|drückt", "gewissen|schuld|unwohl|nicht richtig|gehört ihm nicht|nicht seins|unrecht|fremde"], { text: "t1" }),
  a("Wie denkt Jaro über das gefundene Geld? Beschreibe, wie sich das im Lauf der Geschichte verändert. Gehe auf den Anfang, den Auslöser der Veränderung und den Schluss ein.", [
    kr("Einstellung am Anfang", 1, "Jaro will das Geld behalten und redet sich ein, dass das in Ordnung ist; er denkt an die Fußballschuhe."),
    kr("Auslöser der Veränderung", 1, "Der Einkaufszettel: Jaro merkt, dass die Besitzerin jeden Cent zählen muss – wie seine eigene Mutter. Bennos Satz („hat genug davon“) stimmt nicht."),
    kr("Einstellung am Schluss", 1, "Er bringt die Geldbörse mit dem ganzen Geld zurück, geht am Schaufenster vorbei und fragt sich, ob er wirklich „ehrlich“ ist.")
  ], "Am Anfang will Jaro das Geld behalten, weil er sich davon Fußballschuhe kaufen könnte. Dann findet er den Einkaufszettel und merkt, dass die Besitzerin selbst sehr wenig Geld hat, so wie seine Mutter. Am Schluss bringt er alles zurück und geht an den Schuhen im Schaufenster einfach vorbei.",
  ["behalten|schuhe|einstecken|eingesteckt|haben wollen", "zettel|einkauf|wenig geld|cent|mutter|mama|reichen", "zurück|bringt|abgegeben|klingel|vorbei|ehrlich"], { text: "t1" }),
  c(THEMA_M, [
    "Das Richtige zu tun ist nicht immer leicht – manchmal muss man lange mit sich kämpfen.",
    "Wer etwas findet, darf es behalten, wenn er es dringend braucht.",
    "Auf den Rat guter Freunde kann man sich in schwierigen Lagen verlassen.",
    "Wer ehrlich ist, bekommt dafür am Ende eine Belohnung."], 0, { points: 2, text: "t1", hinweis: THEMA_HINWEIS }),
  a("Frau Aumüller nennt Jaro „ehrlich“. Der letzte Satz der Geschichte (Z. 50) zeigt: Jaro ist sich nicht sicher, ob dieses Wort zu ihm passt. Was meinst du: Ist Jaro ehrlich? Begründe deine Deutung mit dem Text.", [
    kr("eigene Deutung des Schlusses", 1, "Vertretbar ist z. B.: Ja – am Ende zählt, dass er alles zurückgebracht hat, obwohl er das Geld gut hätte brauchen können. Auch: Nur zum Teil oder nein – er wollte das Geld zuerst behalten, hat es versteckt und seiner Mutter nichts gesagt. Auch: Gerade weil er selbst zweifelt und sich nicht besser macht, als er ist, ist er ehrlich. Jede Deutung zählt, die zum Text passt."),
    kr("Begründung mit dem Text", 2, "z. B. Er bringt die Geldbörse mit dem ganzen Geld zurück; Frau Aumüller muss nicht nachzählen (Z. 42) · Er geht am Schaufenster vorbei (Z. 48–49) · dagegen: Er steckt sie zuerst ein (Z. 11–12), versteckt sie (Z. 14–15), sagt „Nein. Was soll denn sein?“ (Z. 18) und zögert noch an der Ampel (Z. 34–35) · Er bekommt heiße Ohren, als er gelobt wird (Z. 45). 2 Punkte für eine Begründung mit einer passenden Textstelle, 1 Punkt für eine Begründung ohne Bezug zum Text.")
  ], "Ich finde, das Wort passt nur zum Teil. Jaro hat die Geldbörse zuerst eingesteckt und unter der Matratze versteckt. Aber am Ende hat er alles zurückgebracht, obwohl er das Geld selbst gut hätte brauchen können. Dass er heiße Ohren bekommt und zweifelt, zeigt, dass er es ernst meint.",
  ["weil|denn|obwohl|aber|trotzdem|zwar|also", "zurück|versteck|matratze|eingesteckt|behalten|zöger|ampel|schaufenster|nachgezählt|mutter|mama|ohren"], { text: "t1" }),
  a("Am Abend nach dem Besuch im Lindenweg schreibt Jaro in sein Tagebuch. Schreibe diesen Eintrag in sechs bis acht Sätzen. Zeige, was Jaro über die letzten beiden Tage denkt und fühlt.", [
    kr("passt zur Handlung", 2, "Der Eintrag gibt wichtige Ereignisse richtig wieder (z. B. Fund an der Bushaltestelle, Bennos Rat, die Schuhe, das Versteck unter der Matratze, der Einkaufszettel, der Besuch bei Frau Aumüller). Nichts widerspricht der Geschichte. 2 Punkte bei mindestens drei richtigen Bezügen, 1 Punkt bei ein bis zwei."),
    kr("Gedanken und Gefühle der Figur", 2, "Jaros Innensicht wird deutlich und passt zur Geschichte: z. B. die Versuchung, das schlechte Gewissen in der Nacht, Mitgefühl mit Frau Aumüller, Erleichterung, Zweifel, ob er das Lob verdient, vielleicht auch Bedauern wegen der Schuhe. 2 Punkte, wenn mindestens zwei verschiedene Gefühle oder Gedanken begründet vorkommen, 1 Punkt für eines."),
    kr("Ich-Form und Ton eines Tagebuchs", 2, "Durchgehend Ich-Form aus Jaros Sicht, Rückblick (Vergangenheit), persönlicher Ton; sechs bis acht Sätze. 1 Punkt, wenn die Form nur teilweise stimmt (z. B. Nacherzählung in der Er-Form, deutlich zu kurz).")
  ], "Liebes Tagebuch, gestern habe ich an der Bushaltestelle eine Geldbörse mit neunzig Euro gefunden. Zuerst wollte ich das Geld behalten, weil ich mir so sehr die Fußballschuhe wünsche. Aber in der Nacht konnte ich nicht schlafen. Dann habe ich den Einkaufszettel entdeckt und gemerkt, dass die Frau selbst kaum Geld hat. Heute Morgen habe ich ihr alles zurückgebracht. Sie hat sich riesig gefreut und mich ehrlich genannt. Dabei habe ich mich ein bisschen geschämt. Trotzdem bin ich froh, dass ich es gemacht habe.",
  ["gewissen|geschämt|schäm|schlafen|unwohl|schuld", "froh|erleichtert|stolz|gefreut|tut mir leid|leidgetan|mitleid|mitgefühl", "geldbörse|neunzig|zettel|matratze|schuhe|bushaltestelle|dackel|zurückgebracht"], { text: "t1" })
];

const ALLE = { kurz: "Literatur", scope: "Handlung · Figuren · Textbelege · Deutung", minutes: 45 };
module.exports = {
  "d7-p5-r-a": probe(5, "R", "A", { ...ALLE, title: "Probe 5 (R7): Literatur", texte: [VERSPROCHEN], items: R_A }),
  "d7-p5-r-b": probe(5, "R", "B", { ...ALLE, title: "Probe 5 (R7): Literatur – Variante B", texte: [STUFEN], items: R_B }),
  "d7-p5-m-a": probe(5, "M", "A", { ...ALLE, title: "Probe 5 (M7): Literatur", texte: [JACKE], items: M_A }),
  "d7-p5-m-b": probe(5, "M", "B", { ...ALLE, title: "Probe 5 (M7): Literatur – Variante B", texte: [FUND], items: M_B })
};
