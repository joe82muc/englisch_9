"use strict";

/**
 * Deutsch 8 · Probe 3: Literatur und Textanalyse (eine Kurzgeschichte verstehen: Handlung ordnen, Figuren und ihr
 * Verhalten, Textstellen mit Zeilen, Deutung mit Textbeleg; M8: Erzählperspektive, ein sprachliches Bild erklären,
 * Zitate einbauen; zum Schluss eine gestaltende Aufgabe).
 * LehrplanPLUS D8 2.2 (literarische Texte: Figuren, Handlung und Konflikt erschließen, Deutungen am Text belegen; M8:
 * Erzählperspektive und sprachliche Bilder untersuchen und deuten), 3.1 (Zitate belegen), 3.2 (gestaltend schreiben:
 * R8 Nachricht an eine Figur, M8 innerer Monolog).
 * R8: 32 Punkte · M8: 38 Punkte · 45 Minuten. Alle Kurzgeschichten eigenständig für GRUMI erstellt; Personen, Orte und
 * Einrichtungen sind erfunden. R8 A „Die Wette“ (Sponsorenlauf), R8 B „Der Umweg“ (Eisvogel am Mühlbach),
 * M8 A „Halbzeit“ (Ich-Erzähler, Fußball und Vater), M8 B „Leihgabe“ (personaler Erzähler, Taschenuhr).
 * Bleibt auf dem Server (Lösungen und Erwartungshorizont). Bausteine: bau.js.
 */
const { c, m, o, z, a, kr, text, probe } = require("./bau");

/* ------------------------------ Texte ------------------------------ */
const WETTE_R = text("t1", "Die Wette", "Kurzgeschichte", [
  "Der Sponsorenlauf der Schule fand an einem kühlen Freitag im Mai statt. Auf dem Sportplatz roch es nach nassem Gras und Bratwurst. Torben band seine Schuhe zum dritten Mal neu, obwohl sie längst fest saßen.",
  "„Wetten, dass ich mehr Runden schaffe als du?“, sagte Kasimir neben ihm und grinste.",
  "„Du? Du bist letztes Jahr nach sechs Runden stehen geblieben.“",
  "„Eben. Dieses Jahr nicht. Wer verliert, trägt dem anderen eine ganze Woche lang die Schultasche.“",
  "Torben lachte. „Abgemacht.“ Sie schlugen ein.",
  "Der Startschuss fiel. Torben lief los, wie er immer lief: gleichmäßig, den Blick auf den Boden vor seinen Füßen. Schon in der dritten Runde überholte er Kasimir und rief ihm im Vorbeilaufen etwas zu, das im Jubel der Zuschauer unterging. Kasimir, das sah er an jeder Kurve, hatte immer weniger Runden hinter sich als er selbst. Das Spiel war eigentlich entschieden.",
  "In der vierzehnten Runde bemerkte Torben, dass Kasimir langsamer wurde. Sein Gesicht war rot, er hielt sich die Seite. Auf der Tribüne stand Kasimirs Mutter und rief: „Weiter, Kasi, du schaffst das!“ Torben kannte die Liste, die Kasimir überall herumgezeigt hatte. Die Nachbarn, die Oma und der Bäcker hatten für jede Runde Geld versprochen. Es ging um mehr als vierzig Euro für den neuen Schulgarten.",
  "Torben wurde langsamer. Er sagte sich, dass er müde sei. Dann lief er neben Kasimir her, genau im selben Tempo. „Komm“, sagte er. „Noch eine.“",
  "Kasimir keuchte. „Lass mich in Ruhe“, stieß er hervor. „Du läufst absichtlich so langsam.“",
  "„Quatsch. Ich bin einfach kaputt.“",
  "Kasimir sah ihn an. Zum ersten Mal an diesem Tag grinste er nicht. Gemeinsam liefen sie noch drei Runden. Am Ende hatte Torben fünfzehn Runden, Kasimir zehn. Kasimirs Mutter klatschte, bis ihre Hände rot waren.",
  "Nach dem Schlusspfiff saßen die beiden auf der Bank neben dem Getränkestand. Kasimir trank seine Flasche in einem Zug leer.",
  "„Zehn Runden“, sagte er. „Das ist mein Rekord. Und trotzdem …“ Er brach ab.",
  "„Was?“",
  "„Nichts.“ Kasimir drehte die leere Flasche in den Händen. „Ich wusste ab der Hälfte nicht mehr, ob ich wirklich so schnell bin oder ob du …“ Er zuckte mit den Schultern.",
  "Torben sagte nichts. Er wusste, dass er etwas sagen müsste. Ihm fiel nur ein, dass er Durst hatte.",
  "Am Montagmorgen wartete Kasimir vor dem Schultor. Er hielt die Hand auf. „Gib her“, sagte er. „Deine Tasche. Wette ist Wette.“",
  "„Du musst sie nicht tragen“, sagte Torben. „Es war doch nur …“",
  "„Ich habe verloren.“ Kasimir hängte sich den Riemen über die Schulter. „Fünfzehn zu zehn. Das hat jeder gesehen.“ Dann drehte er sich um und ging voraus. Torben folgte ihm und konnte nicht erkennen, ob Kasimir lachte oder nicht."
]);

const UMWEG_R = text("t1", "Der Umweg", "Kurzgeschichte", [
  "Leander stieg an diesem Dienstag eine Haltestelle zu früh aus dem Bus. Das machte er jetzt schon seit zwei Wochen so. Er wartete, bis sich die Türen mit einem Zischen schlossen und der Bus anfuhr, und zog die Kapuze tief in die Stirn. Erst als die letzten Gesichter hinter den Scheiben verschwunden waren, ging er los.",
  "Der Weg nach Hause war von hier aus doppelt so lang. Er führte am Mühlbach entlang, über eine wacklige Holzbrücke und durch ein Stück Schilf, in dem es raschelte. Früher war Leander hier gern gegangen, mit dem Fernglas um den Hals und dem kleinen Notizbuch in der Jackentasche. Jetzt schob er beides ganz nach unten in den Rucksack.",
  "Angefangen hatte es an einem Montag im Bus. Enrico hatte das Notizbuch aus Leanders Tasche gezogen und laut vorgelesen: „Drei Blaumeisen, ein Buntspecht, eine Amsel mit weißem Fleck.“ Dann hatte er gefragt: „Sag mal, wie alt bist du eigentlich? Achtzig?“ Mirja hatte gelacht, die anderen auch. Leander hatte ebenfalls gelacht, ein bisschen zu spät und ein bisschen zu laut. Seitdem nannten sie ihn „Opa Leander“. Böse gemeint war es vielleicht gar nicht. Aber er hörte es jedes Mal.",
  "An der Holzbrücke saß heute eine alte Frau auf der Bank. Sie hatte einen Wollschal um den Hals und ein Fernglas auf den Knien. „Pst“, flüsterte sie, ohne sich umzudrehen. „Komm ganz leise her und sieh auf den Ast über dem Wasser.“",
  "Leander zögerte, dann ging er auf Zehenspitzen zu ihr. Auf dem Ast saß ein kleiner Vogel mit leuchtend blauem Rücken und orangefarbener Brust, so still, als wäre er aus Glas.",
  "„Ein Eisvogel“, hauchte Leander.",
  "„Sieben Jahre habe ich hier keinen mehr gesehen“, sagte die Frau. Sie hieß Frau Jandl. Mit dem Kinn zeigte sie auf Leanders Fernglas, das aus dem Rucksack ragte. „Du bist auch einer von uns?“",
  "„Nur so ein bisschen“, antwortete Leander schnell.",
  "Der Vogel stieß ins Wasser und war verschwunden. Frau Jandl holte ein zerfleddertes Heft hervor und schrieb etwas hinein. Leander sah, dass auf jeder Seite Datum und Uhrzeit standen. Es war fast wie sein eigenes.",
  "„Sonst bin ich fast jeden Tag hier“, sagte sie. „Aber zwei Wochen lang ging es mit meiner Hüfte nicht. Und meine Augen werden schlechter. Es wäre schön, wenn jemand mit jungen Augen dabei wäre.“ Sie sah ihn nicht an, als sie das sagte.",
  "„Vielleicht“, sagte Leander.",
  "Am nächsten Morgen saß er im Bus und sah zu, wie die Haltestelle am Mühlbach näher kam. Mirja ließ sich neben ihn fallen. „Du steigst doch sonst immer schon vorher aus“, sagte sie. „Wo gehst du eigentlich hin?“",
  "Leander hatte die Hand schon am Haltegriff. Der Bus bremste. Die Türen gingen auf. Er stand auf der obersten Stufe, den Rucksack auf dem Rücken, in dem das Notizbuch ganz unten lag, und er sah nach links, wo der Weg zur Brücke führte, und nach rechts, wo seine Klasse wartete. „Steigst du jetzt aus oder nicht?“, rief jemand hinter ihm."
]);

const HALBZEIT_M = text("t1", "Halbzeit", "Kurzgeschichte", [
  "In der Pause zwischen der ersten und der zweiten Halbzeit sitzen wir auf der Bank am Spielfeldrand, vierzehn Jungs in nassen Trikots, und dampfen. Das Gras riecht nach Regen. Ferdi neben mir kaut auf seinem Mundstück herum, Herr Voss, unser Betreuer, malt mit einem Filzstift Pfeile auf die Taktiktafel. Wir liegen 1:2 hinten. Ich höre kaum zu.",
  "Ich höre meinen Vater. Er steht hinter der Bande, wie immer an derselben Stelle, bei dem Pfosten mit der abgeblätterten Farbe, und seine Stimme legt sich über den Platz wie ein Netz. „Silas! Zieh nach innen! Nicht so zögerlich!“ Er ruft es auch jetzt, obwohl gerade Pause ist und ich ihn eigentlich gar nicht hören kann. Ich höre ihn trotzdem. Seit vier Jahren höre ich ihn.",
  "Früher war das schön. Früher bin ich nach dem Spiel zu ihm gerannt, und er hat mir das Haar zerwuschelt, auch wenn wir verloren hatten. Als ich neun war, hat er mir die Fußballschuhe geschenkt, die ich mir gewünscht hatte, und er hat sie in Zeitungspapier gewickelt, damit ich nicht schon vorher sehe, was es ist. Ich habe die Schuhe geliebt. Ich habe sie noch.",
  "Heute weiß ich nicht mehr, wann ich zum letzten Mal gern auf dem Platz gestanden habe. Es gibt keinen einzelnen Moment, an dem es gekippt ist. Es ist eher so, als wäre der Ball mit der Zeit schwerer geworden, ohne dass jemand etwas dazugetan hätte. Ich laufe, ich passe, ich grätsche. Aber ich frage mich dabei jedes Mal, ob mein Vater zufrieden ist, und nicht, ob ich es bin.",
  "„Du siehst aus, als wolltest du abhauen“, sagt Ferdi leise. Er sagt es nicht böse. Ich zucke mit den Schultern. „Ich bin nur müde.“",
  "„Du bist seit Wochen müde“, sagt er. Dann ruft Herr Voss uns zusammen, und Ferdi sieht mich noch einmal kurz an, bevor er aufsteht.",
  "Im Kreis blickt Herr Voss mich lange an. „Silas, du gehst wieder auf die Zehn. Das ist deine Position, das weißt du.“ Ich nicke. Wieder habe ich nicht gesagt, was ich seit drei Wochen sagen will: dass ich im Sommer aufhören möchte, vielleicht schon früher. Ich habe den Satz im Kopf schon hundertmal geübt, im Bus, unter der Dusche, vor dem Einschlafen, und jedes Mal bleibt er mir im Hals stecken wie ein zu großes Stück Brot.",
  "Als wir aufs Feld traben, hebt mein Vater die Hand. Er hält den Daumen nach oben, so wie früher. Ich bleibe einen Moment stehen, mitten auf dem Rasen, und sehe ihn an. Er lächelt. Er sieht so froh aus, dass es wehtut.",
  "Der Schiedsrichter pfeift. Ich hebe auch die Hand, aber nicht ganz, nur bis zur Schulter, und ich weiß selbst nicht, ob das ein Gruß ist oder ein Stoppzeichen. Dann rollt der Ball auf mich zu, und ich laufe ihm entgegen."
]);

const LEIHGABE_M = text("t1", "Leihgabe", "Kurzgeschichte", [
  "Die Ausstellung im Treppenhaus der Schule sollte „Dinge, die bleiben“ heißen. Jeder aus der 8c hatte etwas mitbringen sollen, das in der Familie schon lange lag, und Herr Almer hatte zu jedem Stück ein Kärtchen geschrieben. Hanne las ihres im Vorbeigehen, ohne stehen zu bleiben: „Taschenuhr, Messing, um 1950. Leihgabe der Familie Sandner.“",
  "Dass es eine Leihgabe war, stimmte nicht ganz. Gefragt hatte Hanne nie. Am Sonntag war Opa nach dem Mittagessen auf dem Sofa eingenickt, und die Uhr hatte wie immer in der Glasschale auf der Kommode gelegen, neben den Briefmarken und der Lesebrille. Hanne hatte sie in ein Taschentuch gewickelt und eingesteckt. Nur für drei Tage, hatte sie sich gesagt. Er merkt es ja gar nicht.",
  "Die Uhr war nicht irgendeine. Sie hatte Opas Vater gehört, den Hanne nur von einem Foto kannte, einem Mann mit hartem Kinn, der in die Kamera sah, als wolle er sie wegschieben. Opa sprach nie von ihm. Aber die Uhr zog er jeden Morgen auf, mit zwei Fingern, vorsichtig, wie man einen Vogel hält. Sie ging eine Viertelstunde nach, und niemand durfte sie richtig stellen.",
  "Jetzt lag sie unter Glas, auf dunkelblauem Samt, mitten im Treppenhaus. Mitschüler blieben stehen. „Cool“, sagte Karim. „Ist die echt alt?“",
  "„Ja“, sagte Hanne. „Uralt.“ Sie war stolz, und gleichzeitig war ihr, als hätte sie etwas mitgenommen, das ihr nicht gehörte.",
  "Am Mittwochmorgen stand die Uhr. Hanne bemerkte es, als sie vor dem Glas stehen blieb: Der Zeiger zeigte auf zehn nach drei, und das Ticken, das sie sonst fast zu hören glaubte, fehlte. Sie hob die Haube an, nahm die Uhr in die Hand und schüttelte sie leicht. Nichts. Am Rand der Rückseite entdeckte sie einen Kratzer, hell wie ein Haar. Er war gestern noch nicht da gewesen. Oder sie hatte ihn nie bemerkt.",
  "„Alles in Ordnung?“, fragte Herr Almer, der mit einem Stapel Kärtchen vorbeikam. „Ja“, sagte Hanne zu schnell. „Ich wollte nur nachsehen.“ Er lächelte. „Deine Familie kann stolz sein. So etwas gibt man nicht jedem mit.“",
  "Das Wort ging in ihr herum wie ein Kiesel in der Schuhspitze.",
  "Nach der Schule ging sie nicht nach Hause, sondern den langen Weg um den Park. Sie trug die Uhr in beiden Händen, als könne sie sonst zerfallen. Die Straße, in der Opa wohnte, war ruhig. Hinter seinem Fenster brannte Licht. Sie stellte sich vor, wie er am Tisch saß und die Hand schon nach der Glasschale ausstreckte, wie er nichts darin fand. Hatte er es längst bemerkt? Wartete er darauf, dass sie von selbst kam?",
  "Sie stand vor der Tür. Ihr Finger lag auf der Klingel, so leicht, dass sie nicht läutete. Dahinter hörte sie Opas Schritte, und sie wusste nicht, ob sie sich darüber freute oder ob sie sich davor fürchtete."
]);

/* ------------------------------ gemeinsame Hinweise (nur allgemeine Arbeitsanweisungen) ------------------------------ */
const ORDNEN = "Bringe die Ereignisse in die Reihenfolge, in der sie in der Geschichte geschehen.";
const ORDNEN_HINWEIS = "Gehe die Geschichte noch einmal von vorn durch und achte auf Wörter wie „am nächsten Morgen“, „nach“ und „dann“.";
const ZEILE_HINWEIS = "Suche die Stelle im Text und lies die Zeilennummern am linken Rand ab.";

/* ------------------------------ R8 Variante A: Die Wette ------------------------------ */
const R_A = [
  o(ORDNEN, [
    "Torben und Kasimir schließen vor dem Lauf eine Wette ab.",
    "Torben läuft zügig los und überholt Kasimir schon früh.",
    "Torben bemerkt Kasimirs Erschöpfung und passt sein Tempo an.",
    "Auf der Bank erzählt Kasimir von seinen Zweifeln.",
    "Am Montag fordert Kasimir Torbens Schultasche."], { points: 3, text: "t1", hinweis: ORDNEN_HINWEIS }),
  c("Was ist der Einsatz der Wette?", [
    "Der Verlierer trägt dem Gewinner eine Woche lang die Schultasche.",
    "Der Verlierer kauft dem Gewinner nach dem Lauf ein Eis.",
    "Der Verlierer macht eine Woche lang die Hausaufgaben des Gewinners.",
    "Der Verlierer spendet sein Taschengeld für den Schulgarten."], 0, { text: "t1", hinweis: "Die Wette wird ganz am Anfang abgeschlossen. Lies dort noch einmal nach." }),
  c("Wofür soll das Geld verwendet werden, das beim Lauf zusammenkommt?", [
    "für den neuen Schulgarten",
    "für die Klassenfahrt der Abschlussklasse",
    "für neue Sportgeräte in der Turnhalle",
    "für einen Ausflug in den Freizeitpark"], 0, { text: "t1", hinweis: "Die Angabe steht bei der Liste, die Kasimir herumgezeigt hat." }),
  m("Wer verhält sich so? Ordne jedes Verhalten der richtigen Figur zu.", [
    ["bindet die Schuhe zum dritten Mal neu", "Torben"],
    ["ruft von der Tribüne Mut zu", "Kasimirs Mutter"],
    ["dreht die leere Flasche in den Händen", "Kasimir"],
    ["hängt sich den Riemen der fremden Tasche über die Schulter", "Kasimir"]], { points: 2, text: "t1", hinweis: "Überlege bei jedem Verhalten, in welcher Szene es vorkommt und wer dort handelt." }),
  z("In welchen Zeilen steht, wer für Kasimirs Runden Geld versprochen hat?", "t1", [[23, 25]], { hinweis: ZEILE_HINWEIS }),
  z("In welchen Zeilen wirft Kasimir Torben vor, dass er absichtlich langsam läuft?", "t1", [[29, 30]], { hinweis: ZEILE_HINWEIS }),
  a("Warum wird Torben in der vierzehnten Runde langsamer? Erkläre den Grund und belege ihn mit einer Textstelle. Gib die Zeile an.", [
    kr("Grund erklärt", 2, "Torben sieht, dass Kasimir erschöpft ist, und will ihn nicht allein weiterlaufen lassen; auch Mitleid, Rücksicht oder der Gedanke an die Spenden für den Schulgarten sind möglich. 2 Punkte für einen erklärten, zum Text passenden Grund; 1 Punkt für eine ungenaue Antwort (z. B. „weil er müde ist“, denn das sagt er nur sich selbst)."),
    kr("passende Textstelle", 2, "z. B. „Sein Gesicht war rot, er hielt sich die Seite“ (Z. 20–21) · „Weiter, Kasi, du schaffst das!“ (Z. 21–22) · die Liste mit den Spenden (Z. 22–25) · „Komm. Noch eine.“ (Z. 27–28); wörtlich oder sinngemäß. 2 Punkte, wenn die Stelle zum genannten Grund passt, 1 Punkt, wenn sie nur ungefähr passt."),
    kr("Zeilenangabe stimmt", 1, "Z. 19–28, passend zur genannten Textstelle (± 1 Zeile)")
  ], "Torben wird langsamer, weil er sieht, dass Kasimir nicht mehr kann. In Zeile 20–21 steht, dass Kasimirs Gesicht rot war und er sich die Seite hielt. Torben will ihn nicht allein lassen, deshalb läuft er neben ihm her.",
  ["mitleid|erschöpf|müde|rot|seite|nicht allein|helfen|rücksicht|beistehen", "weil|denn|deshalb|darum", "zeile|zeilen"], { text: "t1", zeilen: [19, 28], hilfe: "Satzanfänge: „Torben wird langsamer, weil …“ · „Das sieht man in Zeile … : …“ · Wortspeicher: erschöpft, Mitleid, allein lassen, unterstützen, Rücksicht", hinweis: "Frage dich: Was sieht Torben in der vierzehnten Runde bei Kasimir? Dort findest du den Grund." }),
  a("Kasimir sagt zu Torben: „Lass mich in Ruhe.“ Warum reagiert er so? Erkläre seine Gefühle und belege sie mit einer Textstelle. Gib die Zeile an.", [
    kr("Gefühle erklärt", 2, "Kasimir fühlt sich bemitleidet und nicht ernst genommen; er möchte aus eigener Kraft laufen und fair verlieren oder gewinnen, nicht geschenkt bekommen; sein Stolz ist verletzt. 2 Punkte für eine erklärte, zum Text passende Deutung; 1 Punkt für eine ungenaue Antwort (z. B. „er ist wütend“, „er ist erschöpft“)."),
    kr("passende Textstelle", 2, "z. B. „Du läufst absichtlich so langsam“ (Z. 29–30) · „Zum ersten Mal an diesem Tag grinste er nicht“ (Z. 32–33) · „ob du …“ (Z. 43–44); wörtlich oder sinngemäß. 2 Punkte, wenn die Stelle zur Erklärung passt, 1 Punkt, wenn sie nur ungefähr passt."),
    kr("Zeilenangabe stimmt", 1, "Z. 29–33 oder Z. 43–44, passend zur genannten Textstelle (± 1 Zeile)")
  ], "Kasimir fühlt sich von Torben bemitleidet. Er merkt, dass Torben absichtlich langsam läuft (Z. 29–30), und das verletzt seinen Stolz. Er will seine Runden selbst schaffen und nicht geschenkt bekommen.",
  ["mitleid|bemitleidet|stolz|verletzt|ernst genommen|geschenkt|selbst|ehrlich|kränk", "absichtlich|langsam|ruhe|grinste", "zeile|zeilen"], { text: "t1", zeilen: [29, 44], hilfe: "Satzanfänge: „Kasimir fühlt sich …, weil …“ · „In Zeile … sagt er: …“ · Wortspeicher: bemitleidet, Stolz, selbst schaffen, ernst genommen, geschenkt", hinweis: "Was glaubt Kasimir über Torbens Tempo? Seine Worte zeigen es, und danach grinst er nicht mehr." }),
  a("Am Ende trägt Kasimir Torbens Tasche, und Torben kann nicht erkennen, ob Kasimir lacht. Was könnte Kasimir mit seinem Verhalten zeigen wollen? Gib eine eigene Deutung und belege sie mit einer Textstelle.", [
    kr("eigene Deutung", 2, "Vertretbar ist z. B.: Kasimir will die Wette ehrlich einlösen und zeigen, dass er ein guter Verlierer ist; er will Torben zeigen, dass er kein Mitleid braucht; er verzeiht Torben und macht daraus ein Spiel; er ist noch gekränkt und lässt es Torben spüren. 2 Punkte für eine ausgeführte, zum Text passende Deutung; 1 Punkt für eine ungenaue (z. B. „er hält sein Wort“)."),
    kr("Beleg aus dem Text", 2, "z. B. „Ich habe verloren … Fünfzehn zu zehn. Das hat jeder gesehen.“ (Z. 52–53) · „Wette ist Wette“ (Z. 48–49) · „konnte nicht erkennen, ob Kasimir lachte oder nicht“ (Z. 54–55). 2 Punkte für eine passende Stelle mit Zeile, 1 Punkt für eine Stelle ohne Zeile oder nur ungefähr passend."),
    kr("Offenheit erkannt", 1, "Das Kind sieht, dass der Schluss offen bleibt und Torben (und die Leser) nicht sicher wissen, wie Kasimir es meint (Z. 54–55).")
  ], "Ich glaube, Kasimir will zeigen, dass er kein Mitleid braucht. Er sagt: „Ich habe verloren. Fünfzehn zu zehn“ (Z. 52–53), obwohl Torben ihm die Tasche erlassen will. So bleibt er stolz und hält sein Wort. Ob er dabei lacht oder noch gekränkt ist, weiß man nicht genau (Z. 54–55).",
  ["stolz|mitleid|wort|verlierer|gekränkt|verzeih|wette|ehrlich", "weil|denn|deshalb|zeigt", "verloren|fünfzehn|zehn|wette ist wette|lachte"], { text: "t1", zeilen: [47, 55], hinweis: "Hier gibt es mehrere gute Deutungen. Wichtig ist, dass du sie mit einer Stelle aus dem Schluss begründest." }),
  a("Torben schreibt Kasimir am Montagabend eine Nachricht. Schreibe diese Nachricht in drei bis vier Sätzen. Zeige, was Torben denkt und was er Kasimir sagen möchte.", [
    kr("passt zur Geschichte", 2, "Die Nachricht bezieht sich auf Ereignisse oder Aussagen aus der Geschichte (Wette, Lauf, Tasche, Torbens langsames Laufen, Kasimirs Rekord) und widerspricht ihr nicht. 2 Punkte bei mindestens zwei richtigen Bezügen, 1 Punkt bei einem."),
    kr("Gedanken und Haltung Torbens", 3, "Torbens Sicht wird deutlich und passt zu ihm: z. B. er gibt zu, dass er aus Mitleid langsamer lief, er entschuldigt sich oder erklärt sich, er lobt Kasimirs Rekord, er sagt, dass er ihn nicht für schwach hält. 3 Punkte für zwei oder mehr begründete Gedanken oder Gefühle, 2 Punkte für einen begründeten, 1 Punkt für eine bloße Behauptung ohne Grund."),
    kr("Form der Nachricht", 2, "Torben spricht Kasimir direkt an (du), schreibt in der Ich-Form, im passenden Ton und in drei bis vier Sätzen. 1 Punkt, wenn die Form nur teilweise stimmt (z. B. zu kurz, Erzählung statt Nachricht)."),
    kr("Sprache", 1, "Verständliche Sätze, weitgehend richtige Rechtschreibung und Zeichensetzung. 1 Punkt bei höchstens drei Fehlern.", { rs: true })
  ], "Hallo Kasimir, ich muss dir etwas sagen. Ich bin am Freitag langsamer gelaufen, weil ich gesehen habe, dass du nicht mehr konntest. Das war nicht fair von mir, denn du wolltest es allein schaffen. Zehn Runden sind wirklich dein Rekord, und ich finde das stark.",
  ["entschuldig|tut mir leid|ehrlich|langsamer|mitleid", "rekord|runden|tasche|wette|stark|lauf", "du|dir|dich|kasimir"], { text: "t1", zeilen: [19, 55], hilfe: "Satzanfänge: „Hallo Kasimir, …“ · „Ich bin langsamer gelaufen, weil …“ · „Ich finde, dass du …“ · Wortspeicher: Rekord, Mitleid, entschuldigen, fair, Wette, stolz sein", hinweis: "Stell dir vor, du bist Torben am Montagabend: Was ist dir nach dem Lauf und nach dem Gespräch vor dem Schultor durch den Kopf gegangen?" })
];

/* ------------------------------ R8 Variante B: Der Umweg ------------------------------ */
const R_B = [
  o(ORDNEN, [
    "Enrico liest vor den Mitschülern aus Leanders Notizbuch vor.",
    "Leander steigt eine Haltestelle früher aus dem Bus.",
    "Leander beobachtet mit einer älteren Frau einen Eisvogel.",
    "Die Frau wünscht sich jemanden mit jungen Augen.",
    "Mirja fragt Leander im Bus, wohin er geht."], { points: 3, text: "t1", hinweis: ORDNEN_HINWEIS }),
  c("Wie nennen Leanders Mitschüler ihn, seit Enrico das Notizbuch vorgelesen hat?", [
    "„Opa Leander“",
    "„Vogel-Leander“",
    "„Professor Leander“",
    "„Leander Fernglas“"], 0, { text: "t1", hinweis: "Der Spitzname steht in dem Abschnitt, der zurückblickt." }),
  c("Wie lange hat Frau Jandl am Mühlbach keinen Eisvogel mehr gesehen?", [
    "sieben Jahre",
    "zwei Wochen",
    "ein Jahr",
    "drei Winter"], 0, { text: "t1", hinweis: "Die Zahl nennt Frau Jandl, als der Vogel auf dem Ast sitzt." }),
  m("Wer verhält sich so? Ordne jedes Verhalten der richtigen Figur zu.", [
    ["zieht die Kapuze tief in die Stirn", "Leander"],
    ["liest aus einem fremden Heft laut vor", "Enrico"],
    ["flüstert und zeigt auf einen Ast über dem Wasser", "Frau Jandl"],
    ["setzt sich neben Leander und fragt nach", "Mirja"]], { points: 2, text: "t1", hinweis: "Überlege bei jedem Verhalten, in welcher Szene es vorkommt und wer dort handelt." }),
  z("In welchen Zeilen liest Enrico aus Leanders Notizbuch vor?", "t1", [[13, 16]], { hinweis: ZEILE_HINWEIS }),
  z("In welchen Zeilen sagt Frau Jandl, dass sie sich Hilfe beim Beobachten wünscht?", "t1", [[39, 42]], { hinweis: ZEILE_HINWEIS }),
  a("Warum steigt Leander schon eine Haltestelle zu früh aus dem Bus? Erkläre den Grund und belege ihn mit einer Textstelle. Gib die Zeile an.", [
    kr("Grund erklärt", 2, "Leander will seinen Mitschülern aus dem Weg gehen, weil sie sich über sein Hobby lustig gemacht haben und ihn „Opa Leander“ nennen; er schämt sich und will nicht noch einmal verspottet werden. 2 Punkte für einen erklärten, zum Text passenden Grund; 1 Punkt für eine ungenaue Antwort (z. B. „er hat keine Lust auf den Bus“)."),
    kr("passende Textstelle", 2, "z. B. Enrico liest aus dem Notizbuch vor und fragt, ob Leander achtzig sei (Z. 13–17) · „Seitdem nannten sie ihn ‚Opa Leander‘“ (Z. 19) · „Jetzt schob er beides ganz nach unten in den Rucksack“ (Z. 11–12); wörtlich oder sinngemäß. 2 Punkte, wenn die Stelle zum Grund passt, 1 Punkt, wenn sie nur ungefähr passt."),
    kr("Zeilenangabe stimmt", 1, "Z. 11–21, passend zur genannten Textstelle (± 1 Zeile)")
  ], "Leander steigt früher aus, weil er den anderen aus dem Bus aus dem Weg gehen will. Enrico hat sein Notizbuch vorgelesen und ihn gefragt, ob er achtzig sei (Z. 13–17). Seitdem nennen sie ihn „Opa Leander“ (Z. 19), und er schämt sich.",
  ["schäm|spott|auslach|aus dem weg|mitschüler|enrico|opa linus|notizbuch|hobby", "weil|denn|deshalb|darum", "zeile|zeilen"], { text: "t1", zeilen: [1, 21], hilfe: "Satzanfänge: „Leander steigt früher aus, weil …“ · „Das sieht man in Zeile … : …“ · Wortspeicher: verspotten, sich schämen, aus dem Weg gehen, Hobby, Spitzname", hinweis: "Der Grund steht nicht am Anfang, sondern in der Erinnerung an einen Montag im Bus." }),
  a("Frau Jandl fragt, ob Leander „auch einer von uns“ ist, und Leander antwortet: „Nur so ein bisschen.“ Warum antwortet er so? Erkläre seine Gefühle und belege sie mit einer Textstelle. Gib die Zeile an.", [
    kr("Gefühle erklärt", 2, "Leander liebt die Vogelbeobachtung eigentlich, hat aber Angst, wieder ausgelacht zu werden; er spielt sein Hobby herunter, um sich zu schützen. 2 Punkte für eine erklärte, zum Text passende Deutung; 1 Punkt für eine ungenaue Antwort (z. B. „er ist schüchtern“)."),
    kr("passende Textstelle", 2, "z. B. „antwortete Leander schnell“ (Z. 34) · „Früher war Leander hier gern gegangen“ (Z. 9–10) · „ein bisschen zu spät und ein bisschen zu laut“ (Z. 18–19) · „Es war fast wie sein eigenes“ (Z. 38); wörtlich oder sinngemäß. 2 Punkte, wenn die Stelle zur Erklärung passt, 1 Punkt, wenn sie nur ungefähr passt."),
    kr("Zeilenangabe stimmt", 1, "Z. 9–12, Z. 18–19, Z. 34 oder Z. 38, passend zur genannten Textstelle (± 1 Zeile)")
  ], "Leander sagt „Nur so ein bisschen“, weil er Angst hat, wieder ausgelacht zu werden. Eigentlich liebt er die Vögel, denn früher war er gern am Mühlbach unterwegs (Z. 9–10). Doch nach dem Spott im Bus spielt er sein Hobby herunter.",
  ["angst|ausgelacht|spott|herunter|schäm|schützen|unsicher|liebt|gern", "weil|denn|doch|aber|eigentlich", "schnell|bisschen|früher|zeile|z\\."], { text: "t1", zeilen: [9, 38], hilfe: "Satzanfänge: „Leander antwortet so, weil …“ · „Eigentlich …, aber …“ · Wortspeicher: Hobby herunterspielen, Angst, ausgelacht werden, schützen, unsicher", hinweis: "Vergleiche, was Leander früher am Mühlbach getan hat und wie er jetzt vor einer Fremden spricht." }),
  a("Am Ende steht Leander an der offenen Bustür und weiß nicht, ob er aussteigen soll. Was könnte er tun? Gib eine eigene Deutung und belege sie mit einer Textstelle.", [
    kr("eigene Deutung", 2, "Vertretbar ist z. B.: Leander steigt aus und geht zu Frau Jandl, weil ihm das Beobachten wichtig ist und sie ihn braucht; oder er fährt weiter, weil die Angst vor den Mitschülern größer ist; oder er geht zur Brücke und lässt Mirja mitkommen. 2 Punkte für eine ausgeführte, zum Text passende Deutung; 1 Punkt für eine ungenaue (z. B. „er steigt aus“)."),
    kr("Beleg aus dem Text", 2, "z. B. Frau Jandl’ Wunsch (Z. 39–42) · der Eisvogel (Z. 26–29) · Leanders Blick nach links und nach rechts (Z. 51–52) · Mirjas Frage (Z. 46–47). 2 Punkte für eine passende Stelle mit Zeile, 1 Punkt für eine Stelle ohne Zeile oder nur ungefähr passend."),
    kr("Offenheit erkannt", 1, "Das Kind sieht, dass der Schluss offen bleibt: Leander hat sich noch nicht entschieden, die Frage „Steigst du jetzt aus oder nicht?“ bleibt unbeantwortet (Z. 52–53).")
  ], "Ich glaube, dass Leander aussteigt und zu Frau Jandl geht. Sie hat sich gewünscht, dass jemand mit jungen Augen dabei ist (Z. 41–42), und Leander hat sich bei dem Eisvogel richtig gefreut. Sicher ist es aber nicht, denn am Schluss weiß er selbst nicht, was er tun soll (Z. 52–53).",
  ["aussteig|weiterfahr|frau pilz|mühlbach|eisvogel|angst|mitschüler", "weil|denn|aber|dagegen|trotzdem", "augen|links|rechts|selin|brücke|offen"], { text: "t1", zeilen: [39, 53], hinweis: "Hier gibt es mehrere gute Antworten. Wichtig ist, dass du sie mit einer Stelle aus dem Text begründest." }),
  a("Leander schreibt Frau Jandl am Abend eine Nachricht. Schreibe diese Nachricht in drei bis vier Sätzen. Zeige, was Leander denkt und was er Frau Jandl sagen möchte.", [
    kr("passt zur Geschichte", 2, "Die Nachricht bezieht sich auf Ereignisse aus der Geschichte (Eisvogel, Notizbuch, Mühlbach, Spitzname, Frau Jandl’ Bitte) und widerspricht ihr nicht. 2 Punkte bei mindestens zwei richtigen Bezügen, 1 Punkt bei einem."),
    kr("Gedanken und Haltung von Leander", 3, "Leanders Sicht wird deutlich und passt zu ihm: z. B. er freut sich über den Eisvogel, er gesteht, dass er sich vor Spott fürchtet, er sagt zu oder zögert noch und nennt einen Grund. 3 Punkte für zwei oder mehr begründete Gedanken oder Gefühle, 2 Punkte für einen begründeten, 1 Punkt für eine bloße Behauptung ohne Grund."),
    kr("Form der Nachricht", 2, "Leander spricht Frau Jandl direkt an (Sie oder Frau Jandl), schreibt in der Ich-Form, im passenden Ton und in drei bis vier Sätzen. 1 Punkt, wenn die Form nur teilweise stimmt (z. B. zu kurz, Erzählung statt Nachricht)."),
    kr("Sprache", 1, "Verständliche Sätze, weitgehend richtige Rechtschreibung und Zeichensetzung. 1 Punkt bei höchstens drei Fehlern.", { rs: true })
  ], "Liebe Frau Jandl, danke, dass Sie mir den Eisvogel gezeigt haben. Ich habe mich so gefreut wie lange nicht mehr. Ich habe mein Fernglas nur versteckt, weil mich in der Klasse manche auslachen. Vielleicht komme ich morgen wieder zur Brücke.",
  ["eisvogel|fernglas|brücke|mühlbach|notizbuch|auslach|spott", "danke|gefreut|vielleicht|morgen|komme|angst|schäm", "sie|ihnen|frau pilz"], { text: "t1", zeilen: [22, 53], hilfe: "Satzanfänge: „Liebe Frau Jandl, …“ · „Ich habe mich versteckt, weil …“ · „Vielleicht komme ich …“ · Wortspeicher: Eisvogel, Fernglas, auslachen, Mut, wiederkommen", hinweis: "Stell dir vor, du bist Leander am Abend: Was ist dir seit der Begegnung am Mühlbach durch den Kopf gegangen?" })
];

/* ------------------------------ M8 Variante A: Halbzeit ------------------------------ */
const M_A = [
  o(ORDNEN, [
    "Silas hört in der Pause die Stimme seines Vaters vom Spielfeldrand.",
    "Ferdi spricht Silas auf seine anhaltende Müdigkeit an.",
    "Herr Voss stellt Silas wieder auf seine Position, und Silas schweigt.",
    "Der Vater hebt zur zweiten Halbzeit den Daumen.",
    "Silas hebt die Hand nur bis zur Schulter."], { points: 3, text: "t1", hinweis: ORDNEN_HINWEIS }),
  c("Aus welcher Sicht wird die Geschichte erzählt?", [
    "Ein Ich-Erzähler, der das Geschehen selbst erlebt und kommentiert",
    "Ein allwissender Erzähler, der in alle Figuren hineinsehen kann",
    "Ein Er-Erzähler, der Silas nur von außen beobachtet",
    "Mehrere Erzähler, die sich nach jedem Abschnitt abwechseln"], 0, { text: "t1", hinweis: "Achte auf die Fürwörter („ich“, „wir“, „er“) und darauf, wessen Gedanken du erfährst." }),
  c("Wie hat Silas’ Vater die Fußballschuhe damals verpackt?", [
    "in Zeitungspapier",
    "in einen Stoffbeutel",
    "in einen Schuhkarton mit Schleife",
    "gar nicht, er gab sie ihm einfach so"], 0, { text: "t1", hinweis: "Die Erinnerung steht im dritten Abschnitt." }),
  m("Ordne jedem Zitat die passende Deutung zu.", [
    ["„Du bist seit Wochen müde.“", "Ferdi nimmt Silas’ Zustand ernster wahr, als Silas zugibt."],
    ["„Ich habe sie noch.“", "Silas hängt an der gemeinsamen Zeit mit dem Vater."],
    ["„Er sieht so froh aus, dass es wehtut.“", "Die Freude des Vaters verstärkt Silas’ Schuldgefühl."],
    ["„nicht ganz, nur bis zur Schulter“", "Silas bleibt zwischen Zustimmung und Widerstand unentschieden."]], { points: 3, text: "t1", hinweis: "Überlege, in welcher Situation das Zitat fällt und was es über Silas’ Gefühle oder die Figur sagt." }),
  z("In welchen Zeilen erinnert sich Silas an das Geschenk seines Vaters?", "t1", [[16, 20]], { hinweis: ZEILE_HINWEIS }),
  z("In welchen Zeilen steht, dass Silas den Satz, den er sagen will, schon oft geübt hat?", "t1", [[38, 41]], { hinweis: ZEILE_HINWEIS }),
  a("Beschreibe das Verhältnis zwischen Silas und seinem Vater früher und heute. Belege deine Aussagen mit zwei Zitaten, die du in eigene Sätze einbaust. Gib jeweils die Zeile an.", [
    kr("Verhältnis beschrieben", 3, "Früher: nah und herzlich, gemeinsame Freude (Z. 14–20). Heute: Silas spürt Druck und Erwartung, hört den Vater ständig, fragt sich, ob dieser zufrieden ist (Z. 7–13, 25–27); zugleich liebt er ihn und möchte ihn nicht enttäuschen (Z. 42–45). 3 Punkte, wenn früher und heute mit Gründen beschrieben sind, 2 Punkte, wenn nur eine Zeit oder beide ungenau, 1 Punkt für eine knappe Behauptung."),
    kr("Zitate eingebaut", 2, "Mindestens ein wörtliches Zitat in Anführungszeichen steht passend und grammatisch richtig in einem eigenen Satz (z. B. Silas fragt sich, „ob mein Vater zufrieden ist“, Z. 26–27) und hat eine Zeilenangabe; 2 Punkte für zwei richtig eingebaute Zitate, 1 Punkt für eines oder für Zitate ohne Einbau (nur angehängt)."),
    kr("Entwicklung erkannt", 2, "Das Kind sieht, dass sich die Beziehung verändert hat, ohne dass es einen einzelnen Streit gab (Z. 21–24), und dass Silas sich heute mehr nach dem Vater richtet als nach sich selbst. 2 Punkte für eine begründete Entwicklung, 1 Punkt für eine ungenaue.")
  ], "Früher war das Verhältnis zwischen Silas und seinem Vater eng. Silas rannte nach dem Spiel zu ihm, und der Vater hat ihm „das Haar zerwuschelt“ (Z. 15), auch wenn sie verloren hatten. Heute spürt Silas vor allem Druck, denn er hört die Stimme des Vaters ständig und fragt sich, „ob mein Vater zufrieden ist“ (Z. 26–27). Dass er ihn trotzdem liebt, sieht man daran, dass es wehtut, wie froh der Vater aussieht (Z. 45). Es gab keinen Streit, die Beziehung hat sich langsam verändert.",
  ["früher|heute|druck|erwartung|zufrieden|enttäusch|zerwuschelt|nähe|liebt|verändert", "weil|denn|obwohl|zwar|aber|dagegen", "zeile|zeilen|zitat|z\\. "], { text: "t1", zeilen: [7, 45] }),
  a("Silas’ Vater wird mit einem Bild beschrieben: „seine Stimme legt sich über den Platz wie ein Netz“ (Z. 9–10). Benenne das sprachliche Bild und erkläre, was es über Silas’ Gefühle und das Verhältnis zum Vater aussagt.", [
    kr("Bild benannt", 1, "Es handelt sich um einen Vergleich (erkennbar am Wort „wie“); auch „Bild“ oder „sprachliches Bild“ mit Hinweis auf „wie ein Netz“ genügt."),
    kr("Bedeutung erklärt", 3, "Ein Netz umgibt, fängt ein und hält fest; man kommt nicht leicht heraus. Die Stimme des Vaters ist überall auf dem Platz, Silas kann ihr nicht ausweichen und fühlt sich beobachtet und gebunden. Zugleich kann ein Netz auch Halt geben, die Stimme ist also nicht nur Last. 3 Punkte für eine erklärte Übertragung (Netz → Gefühl des Festhaltens), 2 Punkte, wenn nur das Gefühl genannt wird, 1 Punkt für eine bloße Umschreibung des Wortlauts."),
    kr("Bezug zum Text", 2, "Das Bild wird mit anderen Stellen verbunden: „Ich höre ihn trotzdem“ (Z. 12), die Frage, ob der Vater zufrieden ist (Z. 25–27), der Satz, der im Hals stecken bleibt (Z. 40–41). 2 Punkte für eine passende Stelle mit Zeile, 1 Punkt für einen ungenauen Bezug.")
  ], "Das ist ein Vergleich, denn er enthält das Wort „wie“. Ein Netz hält etwas fest und umgibt es von allen Seiten. So ist es auch mit der Stimme des Vaters: Silas kann ihr auf dem Platz nicht entkommen und fühlt sich gebunden. Das passt zu der Stelle „Ich höre ihn trotzdem“ (Z. 12) und zeigt, dass der Vater Silas auch dann beschäftigt, wenn er gar nichts ruft.",
  ["vergleich|bild|wie", "netz|festhalten|fest|gefangen|gebunden|eng|kontroll|entkommen|ausweichen", "höre ihn trotzdem|zufrieden|hals|druck"], { text: "t1", zeilen: [7, 13] }),
  a("Die Geschichte heißt „Halbzeit“. Deute den Titel mit Hilfe des ganzen Textes und besonders des Schlusses (Z. 46–49). Belege deine Deutung mit einem Zitat.", [
    kr("Deutung des Titels", 3, "Wörtlich: die Pause im Spiel, in der die Geschichte spielt. Übertragen: ein Zwischenstand und Wendepunkt in Silas’ Entscheidung, ob er weitermacht oder aufhört; auch die „halbe“ Geste am Ende und das Dazwischen zwischen Vater und eigenem Willen. 3 Punkte für wörtliche und übertragene Deutung, 2 Punkte für eine von beiden gut erklärt, 1 Punkt für eine knappe Behauptung."),
    kr("Textbeleg", 2, "Passendes Zitat mit Zeile: „nicht ganz, nur bis zur Schulter“ (Z. 46–47) · „ein Gruß … oder ein Stoppzeichen“ (Z. 47–48) · „seit drei Wochen sagen will“ (Z. 36–37). 2 Punkte für ein richtig eingebautes Zitat mit Zeile, 1 Punkt für Zitat ohne Zeile oder ohne Einbau."),
    kr("offener Schluss gedeutet", 2, "Das Kind erkennt, dass offen bleibt, ob Silas seinem Vater die Wahrheit sagt und wie er sich entscheidet; es begründet, was der Schluss über seinen inneren Zwiespalt zeigt. 2 Punkte für eine begründete Deutung, 1 Punkt für die bloße Feststellung, dass der Schluss offen ist.")
  ], "Der Titel meint zuerst die Pause im Spiel. Übertragen steht „Halbzeit“ für Silas’ Lage: Er steht in der Mitte zwischen Weitermachen und Aufhören, zwischen dem Wunsch des Vaters und seinem eigenen. Am Ende hebt er die Hand „nicht ganz, nur bis zur Schulter“ (Z. 46–47) und weiß selbst nicht, ob es „ein Gruß oder ein Stoppzeichen“ ist (Z. 47–48). Der Schluss bleibt offen, Silas hat seine Entscheidung also noch nicht getroffen.",
  ["pause|spiel|mitte|zwischen|entscheid|wendepunkt|aufhören|weitermachen|zwiespalt|halb", "schulter|gruß|stoppzeichen|hand|daumen|drei wochen", "offen|unentschieden|noch nicht|weiß selbst nicht"], { text: "t1", zeilen: [34, 49] }),
  a("Schreibe einen inneren Monolog von Silas an der Stelle, an der er mitten auf dem Rasen stehen bleibt und seinen Vater ansieht (Z. 42–45). Schreibe in der Ich-Form und im Präsens, etwa fünf Sätze.", [
    kr("Anknüpfung an die Situation", 2, "Der Monolog knüpft an die Stelle an (Rasen, Vater mit erhobenem Daumen, Lächeln, bevorstehende zweite Halbzeit) und widerspricht der Geschichte nicht. 2 Punkte bei zwei oder mehr passenden Bezügen, 1 Punkt bei einem."),
    kr("Gedanken und Konflikt", 3, "Silas’ innerer Konflikt wird deutlich: Zuneigung zum Vater, Wunsch aufzuhören, Angst, ihn zu enttäuschen, Müdigkeit, Erinnerung an früher. 3 Punkte für zwei oder mehr gegensätzliche Gedanken, die begründet werden; 2 Punkte für einen begründeten Gedanken; 1 Punkt für eine bloße Aussage."),
    kr("Form des Monologs", 2, "Ich-Form, Präsens, gedankliche Sprache (z. B. Fragen, Sprünge, Auslassungen, kurze Sätze), etwa fünf Sätze. 1 Punkt, wenn nur ein Teil der Merkmale erfüllt ist."),
    kr("Sprache", 1, "Verständliche Sätze, weitgehend richtige Rechtschreibung und Zeichensetzung. 1 Punkt bei höchstens drei Fehlern.", { rs: true })
  ], "Da steht er und lächelt, als wäre alles in Ordnung. Wie soll ich ihm sagen, dass ich nicht mehr will, wenn er so froh aussieht? Vielleicht ist es nur eine Phase, vielleicht bin ich einfach müde. Aber ich will nicht länger für ihn spielen, sondern für mich. Wenn ich nur wüsste, wie der Satz anfängt.",
  ["vater|daumen|lächel|froh|müde|aufhören|enttäusch|angst|will|spiel", "ich|mir|mich", "vielleicht|aber|wie|warum"], { text: "t1", zeilen: [42, 49] })
];

/* ------------------------------ M8 Variante B: Leihgabe ------------------------------ */
const M_B = [
  o(ORDNEN, [
    "Hanne nimmt die Uhr unbemerkt aus der Glasschale mit.",
    "Die Uhr liegt in der Ausstellung unter Glas, und Karim bewundert sie.",
    "Hanne entdeckt, dass die Uhr steht und einen Kratzer hat.",
    "Herr Almer lobt Hannes Familie für das Stück.",
    "Hanne steht mit dem Finger auf der Klingel vor Opas Tür."], { points: 3, text: "t1", hinweis: ORDNEN_HINWEIS }),
  c("Wer erzählt die Geschichte, und was erfährt man dadurch?", [
    "Ein Erzähler, der nur Hannes Gedanken und Gefühle kennt und die anderen von außen zeigt",
    "Hanne selbst, die in der Ich-Form von ihren Erlebnissen berichtet",
    "Ein allwissender Erzähler, der auch Opas und Herrn Almers Gedanken kennt",
    "Ein Erzähler, der nur beschreibt und keine Gedanken wiedergibt"], 0, { text: "t1", hinweis: "Achte darauf, ob „ich“ oder „sie“ erzählt, und darauf, wessen Gedanken du erfährst." }),
  c("Was ist mit der Taschenuhr, bevor sie ausgestellt wird, schon lange so?", [
    "Sie geht eine Viertelstunde nach.",
    "Sie geht einige Minuten vor.",
    "Sie hat keinen Zeiger mehr für die Minuten.",
    "Sie hat ein gesprungenes Glas."], 0, { text: "t1", hinweis: "Die Angabe steht dort, wo von Opa und seinem Vater erzählt wird." }),
  m("Ordne jedem Zitat die passende Deutung zu.", [
    ["„Er merkt es ja gar nicht.“", "Hanne redet sich das Mitnehmen schön und beruhigt ihr Gewissen."],
    ["„wie man einen Vogel hält“", "Opa behandelt die Uhr mit Vorsicht und Zuneigung."],
    ["„Uralt.“", "Hanne ist stolz, aber zugleich unsicher."],
    ["„Deine Familie kann stolz sein.“", "Das Lob von Herrn Almer verstärkt Hannes schlechtes Gewissen."]], { points: 3, text: "t1", hinweis: "Überlege, in welcher Situation das Zitat fällt und was es über Hannes Gefühle oder die Figur sagt." }),
  z("In welchen Zeilen wird beschrieben, wie Hanne die Uhr mitnimmt?", "t1", [[10, 13]], { hinweis: ZEILE_HINWEIS }),
  z("In welchen Zeilen entdeckt Hanne den Kratzer auf der Rückseite?", "t1", [[31, 34]], { hinweis: ZEILE_HINWEIS }),
  a("Hanne ist stolz auf die Ausstellung und fühlt sich zugleich schuldig. Erkläre diesen Widerspruch. Belege deine Aussagen mit zwei Zitaten, die du in eigene Sätze einbaust. Gib jeweils die Zeile an.", [
    kr("Widerspruch erklärt", 3, "Stolz: Die Uhr beeindruckt die Mitschüler (Z. 21–25). Schuld: Hanne hat nie gefragt (Z. 7–8), redet sich das Mitnehmen schön (Z. 12–13), fühlt sich, als hätte sie etwas mitgenommen, das ihr nicht gehört (Z. 24–26), und das Lob verstärkt das Gefühl (Z. 35–40). 3 Punkte, wenn Stolz und Schuld mit Gründen beschrieben sind, 2 Punkte, wenn nur eine Seite oder beide ungenau, 1 Punkt für eine knappe Behauptung."),
    kr("Zitate eingebaut", 2, "Mindestens ein wörtliches Zitat in Anführungszeichen steht passend und grammatisch richtig in einem eigenen Satz (z. B. Hanne sagt sich: „Er merkt es ja gar nicht“, Z. 13) und hat eine Zeilenangabe; 2 Punkte für zwei richtig eingebaute Zitate, 1 Punkt für eines oder für Zitate ohne Einbau (nur angehängt)."),
    kr("Steigerung erkannt", 2, "Das Kind sieht, dass das Schuldgefühl im Lauf der Geschichte wächst: vom schnellen Einstecken über das Unbehagen vor der Vitrine bis zum Weg zu Opa (Z. 27–52). 2 Punkte für eine begründete Entwicklung, 1 Punkt für eine ungenaue.")
  ], "Hanne ist stolz, denn ihre Mitschüler finden die Uhr „cool“ (Z. 22), und sie sagt selbst „Uralt“ (Z. 24). Gleichzeitig fühlt sie sich schuldig, weil sie Opa nie gefragt hat (Z. 7–8) und sich einredet: „Er merkt es ja gar nicht“ (Z. 13). Das Gefühl wird schlimmer, als die Uhr stehen bleibt und Herr Almer die Familie lobt. Am Ende trägt sie die Uhr zu Opa zurück (Z. 41–42).",
  ["stolz|schuld|gewissen|unsicher|schlecht|gefragt|cool|uralt|lob|widerspruch|steiger", "weil|denn|obwohl|zwar|aber|gleichzeitig", "zeile|zeilen|zitat|z\\. "], { text: "t1", zeilen: [7, 52] }),
  a("Über Herrn Almers Lob heißt es: „Das Wort ging in ihr herum wie ein Kiesel in der Schuhspitze“ (Z. 39–40). Benenne das sprachliche Bild und erkläre, was es über Hannes Gefühle aussagt.", [
    kr("Bild benannt", 1, "Es handelt sich um einen Vergleich (erkennbar am Wort „wie“); auch „Bild“ oder „sprachliches Bild“ mit Hinweis auf „wie ein Kiesel“ genügt."),
    kr("Bedeutung erklärt", 3, "Ein Kiesel im Schuh ist klein, aber bei jedem Schritt zu spüren; man kann ihn nicht ignorieren, bis man ihn herausnimmt. So ist auch das Wort „stolz“ ein kleiner Stich, den Hanne mit jedem Schritt spürt, solange sie die Sache nicht in Ordnung bringt. 3 Punkte für eine erklärte Übertragung (Kiesel → ständiges, kleines, aber nicht zu ignorierendes Unbehagen), 2 Punkte, wenn nur das Gefühl genannt wird, 1 Punkt für eine bloße Umschreibung des Wortlauts."),
    kr("Bezug zum Text", 2, "Das Bild wird mit anderen Stellen verbunden: „Ja“, sagte Hanne zu schnell (Z. 36), Hannes Weg zu Opa (Z. 41–48), die Frage, ob Opa es längst bemerkt hat (Z. 47–48). 2 Punkte für eine passende Stelle mit Zeile, 1 Punkt für einen ungenauen Bezug.")
  ], "Das ist ein Vergleich, denn er enthält das Wort „wie“. Ein Kiesel im Schuh ist klein, aber man spürt ihn bei jedem Schritt und kann ihn erst vergessen, wenn man ihn entfernt. So drückt Herrn Almers Lob Hanne: Es ist ein kleiner Satz, aber er erinnert sie dauernd an ihr schlechtes Gewissen. Das passt dazu, dass sie „zu schnell“ antwortet (Z. 36) und danach sofort zu Opa geht.",
  ["vergleich|bild|wie", "kiesel|schuh|drück|stich|spürt|schritt|unbehagen|gewissen|erinner", "zu schnell|opa|lob|stolz"], { text: "t1", zeilen: [35, 40] }),
  a("Die Geschichte heißt „Leihgabe“. Deute den Titel mit Hilfe des ganzen Textes und besonders des Schlusses (Z. 49–52). Belege deine Deutung mit einem Zitat.", [
    kr("Deutung des Titels", 3, "Wörtlich: Auf dem Kärtchen steht „Leihgabe der Familie Sandner“, aber ausgeliehen hat Hanne die Uhr eigentlich nur sich selbst. Übertragen: Hanne hat sich etwas genommen, das ihr nicht gehört, nämlich auch Opas Vertrauen und seine Erinnerung an seinen Vater; sie muss es zurückgeben, um es wieder gutzumachen. 3 Punkte für wörtliche und übertragene Deutung, 2 Punkte für eine von beiden gut erklärt, 1 Punkt für eine knappe Behauptung."),
    kr("Textbeleg", 2, "Passendes Zitat mit Zeile: „Leihgabe der Familie Sandner“ (Z. 5–6) · „Gefragt hatte Hanne nie“ (Z. 7–8) · „Nur für drei Tage“ (Z. 12) · „etwas mitgenommen, das ihr nicht gehörte“ (Z. 25–26). 2 Punkte für ein richtig eingebautes Zitat mit Zeile, 1 Punkt für Zitat ohne Zeile oder ohne Einbau."),
    kr("offener Schluss gedeutet", 2, "Das Kind erkennt, dass offen bleibt, ob Hanne klingelt, was sie Opa sagt und wie er reagiert; es begründet, was der Schluss über ihre Angst und Hoffnung zeigt (Z. 49–52). 2 Punkte für eine begründete Deutung, 1 Punkt für die bloße Feststellung, dass der Schluss offen ist.")
  ], "Auf dem Kärtchen steht „Leihgabe der Familie Sandner“ (Z. 5–6), aber Hanne hat die Uhr heimlich mitgenommen und nie gefragt (Z. 7–8). Der Titel zeigt also, dass die Leihe nur vorgetäuscht ist. Übertragen hat sie sich auch Opas Vertrauen genommen, und das muss sie zurückgeben. Ob sie klingelt und was Opa sagt, bleibt offen (Z. 49–52).",
  ["leihgabe|kärtchen|geliehen|vorgetäuscht|vertrauen|zurückgeben|gefragt|wiedergutmachen", "familie lorenz|nie gefragt|drei tage|nicht gehörte|opa", "offen|klingel|schritte|angst|hoffnung|weiß nicht"], { text: "t1", zeilen: [1, 52] }),
  a("Schreibe einen inneren Monolog von Hanne an der Stelle, an der sie vor Opas Tür steht und ihr Finger auf der Klingel liegt (Z. 49–52). Schreibe in der Ich-Form und im Präsens, etwa fünf Sätze.", [
    kr("Anknüpfung an die Situation", 2, "Der Monolog knüpft an die Stelle an (Tür, Klingel, Opas Schritte, Uhr in den Händen, Kratzer, Stillstand) und widerspricht der Geschichte nicht. 2 Punkte bei zwei oder mehr passenden Bezügen, 1 Punkt bei einem."),
    kr("Gedanken und Konflikt", 3, "Hannes innerer Konflikt wird deutlich: Angst vor Opas Reaktion, Scham über das heimliche Mitnehmen, der Wunsch, alles zu erklären, die Sorge um die Uhr, Hoffnung auf Verzeihung. 3 Punkte für zwei oder mehr gegensätzliche Gedanken, die begründet werden; 2 Punkte für einen begründeten Gedanken; 1 Punkt für eine bloße Aussage."),
    kr("Form des Monologs", 2, "Ich-Form, Präsens, gedankliche Sprache (z. B. Fragen, Sprünge, Auslassungen, kurze Sätze), etwa fünf Sätze. 1 Punkt, wenn nur ein Teil der Merkmale erfüllt ist."),
    kr("Sprache", 1, "Verständliche Sätze, weitgehend richtige Rechtschreibung und Zeichensetzung. 1 Punkt bei höchstens drei Fehlern.", { rs: true })
  ], "Ich höre seine Schritte. Gleich macht er auf, und dann muss ich es sagen. Was, wenn er die Uhr gar nicht ansehen will, weil sie nicht mehr tickt? Ich hätte ihn fragen müssen, bevor ich sie genommen habe. Vielleicht wird er nicht schreien, sondern nur still sein, und das wäre noch schlimmer.",
  ["uhr|tür|klingel|schritte|opa|angst|scham|schäm|kratzer|tickt", "ich|mir|mich", "vielleicht|aber|was wenn|warum|hätte"], { text: "t1", zeilen: [49, 52] })
];

/* ------------------------------ die vier Fassungen ------------------------------ */
const R8 = {
  kurz: "Literatur und Textanalyse", scope: "Lesen: Handlung, Figuren und ihr Verhalten, Textstellen mit Zeilen, Deutung mit Textbeleg; Schreiben: eine Nachricht aus Sicht einer Figur", minutes: 45,
  hinweis: "Arbeite allein. Lies zuerst die ganze Geschichte. Du kannst sie während der Probe jederzeit wieder aufrufen. Antworte bei offenen Fragen in ganzen Sätzen und gib bei Belegen die Zeile an. Deine Antworten werden laufend gespeichert. Nach der Abgabe kannst du nichts mehr ändern."
};
const M8 = {
  kurz: "Literatur und Textanalyse", scope: "Lesen: Handlung, Erzählperspektive, Figuren, Textstellen mit Zeilen, sprachliches Bild, Deutung mit Zitaten; Schreiben: ein innerer Monolog", minutes: 45,
  hinweis: "Arbeite allein. Lies zuerst die ganze Geschichte; sie bleibt während der Probe abrufbar. Antworte bei offenen Fragen in ganzen Sätzen, belege deine Aussagen mit Zitaten und Zeilenangaben und baue die Zitate in deine Sätze ein. Deine Antworten werden laufend gespeichert. Nach der Abgabe kannst du nichts mehr ändern."
};
const TITEL = "Literatur und Textanalyse";
const R_AP = probe(3, "R", "A", { ...R8, title: "Probe 3 (R8): " + TITEL, texte: [WETTE_R], items: R_A });
const R_BP = probe(3, "R", "B", { ...R8, title: "Probe 3 (R8): " + TITEL + " – Variante B", texte: [UMWEG_R], items: R_B });
const M_AP = probe(3, "M", "A", { ...M8, title: "Probe 3 (M8): " + TITEL, texte: [HALBZEIT_M], items: M_A });
const M_BP = probe(3, "M", "B", { ...M8, title: "Probe 3 (M8): " + TITEL + " – Variante B", texte: [LEIHGABE_M], items: M_B });

module.exports = { [R_AP.id]: R_AP, [R_BP.id]: R_BP, [M_AP.id]: M_AP, [M_BP.id]: M_BP };
