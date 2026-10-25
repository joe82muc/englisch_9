"use strict";

/**
 * Informatik 9 (9R und 9M gemeinsam): Proben zu den fünf Modulen. Lösungen und Erwartungshorizont bleiben
 * ausschließlich im Backend (nie in das Website-Repo kopieren).
 *
 * Auftrag der Lehrkraft (13.10.2026): R9 und M9 lernen dasselbe und schreiben DIESELBEN Proben, Niveau M9,
 * Notenschlüssel R für beide (50 % = Note 3; server.js: notenzug "R"). Deshalb steht jede Probe hier nur EINMAL
 * (GEMEINSAM). Daraus entstehen je zwei Kennungen mit demselben Inhalt und derselben Antwortreihenfolge:
 *   inf9-p<N>-r (zug "R") und inf9-p<N>-m (zug "M") – nur damit die Lehrkraft je Klasse getrennt freischalten kann.
 *
 *   thema: Modul der Übersicht (9M/Informatik/themen.js): netzwerke · internet · funktionen · diagramme · scratch
 *   choice: 1 Punkt · match: 1 Punkt je Paar (jedes Ziel kommt genau einmal vor) ·
 *   order: 1 Punkt je Schritt an der richtigen Stelle · text: 1 Punkt je Kriterium
 *   expected = Musterlösung, criteria = Erwartungshorizont (je Kriterium 1 Punkt), keywords = Stichwortgruppen
 *   für die vorläufige Bewertung ohne KI (dicht: true = Formeln, Leerzeichen zählen nicht). Bilder liegen in
 *   9M/Informatik/assets/proben (eigene Zeichnungen, ohne Kommentare im Quelltext – die Dateien sind öffentlich).
 *
 * Jede Probe dauert etwa 15 bis 20 Minuten und hat 20 Punkte (10 Punkte = 50 % = Note 3).
 * Aufgaben einer Probe, für die es schon Abgaben gibt, nicht mehr verändern (die Antwortreihenfolge hängt am Text).
 * Beispiele (Namen, Zahlen, Netze, Tabellen) stehen so in keiner Einheit.
 */

const c = (prompt, options, answer, extra) => ({ type: "choice", prompt, options, answer, points: 1, ...(extra || {}) });
const m = (prompt, pairs, extra) => ({ type: "match", prompt, pairs, points: pairs.length, ...(extra || {}) });
const o = (prompt, steps, extra) => ({ type: "order", prompt, steps, points: steps.length, ...(extra || {}) });
const t = (prompt, expected, criteria, keywords, extra) => ({ type: "text", prompt, expected, criteria, keywords, points: criteria.length, ...(extra || {}) });
// Richtig/falsch: 1 Punkt je Aussage – wird NICHT gemischt, also richtig und falsch von Hand abwechseln
const rf = (prompt, statements, extra) => ({ type: "tf", prompt, statements, points: statements.length, ...(extra || {}) });
// Filius-Datei (nt7.js, Aufgabenart "filius"): checks = Prüfprogramm, kiPunkte + kiKriterien = KI (wohlwollend)
const fl = (prompt, aufgabe, checks, kiPunkte, kiKriterien, expected, extra) => ({ type: "filius", prompt, aufgabe, checks, kiPunkte, kiKriterien, expected,
  points: checks.reduce((s, x) => s + x.punkte, 0) + kiPunkte, ...(extra || {}) });

// Je Probe: nr (1–5), thema, minutes, titel (ohne Klasse), scope, items
const PRAXIS = { image: "assets/proben/p1-praxis.svg", imageAlt: "Netzplan einer Arztpraxis. Links ein Switch, daran drei Rechner: Empfang (192.168.4.20), Zimmer 1 (192.168.4.21) und Zimmer 2 (192.168.4.22). Vom Switch führt ein Kabel zu einem Router in der Mitte. Rechts vom Router ein zweiter Switch mit dem Rechner Labor (192.168.6.20)." };

const FLOHMARKT = { image: "assets/proben/p3-flohmarkt.svg", imageAlt: "Tabelle mit den Spalten A Artikel, B Preis in Euro, C Stück und D Einnahmen in Euro. Zeile 2: Buch, 2,50, 8. Zeile 3: Brettspiel, 4,00, 3. Zeile 4: Kuscheltier, 1,50, 6. Zeile 5: Puzzle, 3,00, 4. Zeile 6: Hörspiel, 2,00, 5. Zeile 7: Summe. Die Spalte D ist noch leer." };
const ABZEICHEN = { image: "assets/proben/p3-abzeichen.svg", imageAlt: "Tabelle mit den Spalten A Name, B Punkte und C Ergebnis. Zeile 2: Kind 1, 30 Punkte. Zeile 3: Kind 2, 24 Punkte. Zeile 4: Kind 3, 37 Punkte. Die Spalte C ist noch leer." };
const BROETCHEN = { image: "assets/proben/p4-broetchen.svg", imageAlt: "Säulendiagramm „Verkaufte Brötchen am Pausenkiosk“. Die Achse links geht in Zehnerschritten von 0 bis 70 Stück. Fünf Säulen: Montag bis zur 40, Dienstag bis zur Mitte zwischen 50 und 60, Mittwoch bis zur 30, Donnerstag bis zur 60, Freitag bis zur Mitte zwischen 40 und 50." };
const HAUSTIERE = { image: "assets/proben/p4-haustiere.svg", imageAlt: "Kreisdiagramm „Welches Haustier habt ihr?“ mit vier Teilen und einer Legende ohne Zahlen: Der Teil für Hund füllt genau den halben Kreis, der Teil für Katze ein Viertel, die Teile für Fische und Hase sind kleiner." };
const TEMPERATUR = { image: "assets/proben/p4-temperatur.svg", imageAlt: "Liniendiagramm „Temperatur am Schulhof“ in Grad Celsius: um 8 Uhr 12 Grad, um 10 Uhr 15 Grad, um 12 Uhr 19 Grad, um 14 Uhr 22 Grad, um 16 Uhr 20 Grad, um 18 Uhr 16 Grad. Die Linie steigt bis 14 Uhr und fällt danach." };
const KLASSEN = { image: "assets/proben/p4-klassen.svg", imageAlt: "Tabelle mit den Spalten A Klasse und B Punkte. Zeile 1: die Überschriften. Zeilen 2 bis 6: 9a 48, 9b 55, 9c 41, 9d 52, 9e 37." };

// Probe 5: Programme aus den eigenen GRUMI-Blöcken (gezeichnet mit .codex-build/informatik9-werkzeug/proben-bloecke9.js,
// dort läuft jedes Programm zur Kontrolle einmal durch)
const LAUFEN = { image: "assets/proben/p5-laufen.png", imageAlt: "Programm aus Blöcken: Wenn Start angeklickt wird – gehe zu x: 0 y: 0 – wiederhole 4 mal: gehe 30 Schritte – danach, unter der Wiederholung: sage „Geschafft!“." };
const ZAEHLEN = { image: "assets/proben/p5-zaehlen.png", imageAlt: "Programm aus Blöcken: Wenn Start angeklickt wird – setze punkte auf 0 – wiederhole 3 mal: ändere punkte um 2 – danach, unter der Wiederholung: sage punkte." };
const TEST = { image: "assets/proben/p5-test.png", imageAlt: "Programm aus Blöcken: Wenn Start angeklickt wird – frage „Wie viele Punkte hast du?“ und warte – falls Antwort größer als 49 dann: sage „Bestanden!“ – sonst: sage „Übe noch.“" };
const RUNDEN = { image: "assets/proben/p5-runden.png", imageAlt: "Programm aus Blöcken: Wenn Start angeklickt wird – wiederhole 6 mal: setze runden auf 0, ändere runden um 1 – danach, unter der Wiederholung: sage runden." };

// Probe 1b: Praxis wie die Übung in der Einheit N1 (Prüfpunkte und KI-Kriterium an einer Stelle für Einheit und Probe)
const LADEN_AUFGABE = require("./inf9-filius-aufgaben").AUFGABEN["netz-start-laden"];
// Probe 1b: Bild zum Praxisteil (zwei Rechner, ein Kabel)
const LADEN = { image: "assets/proben/p1b-laden.svg", imageAlt: "Skizze „So soll dein Netz aussehen“: links ein Rechner mit dem Namen Kasse und der IP-Adresse 192.168.0.20, rechts ein Rechner mit dem Namen Büro und der IP-Adresse 192.168.0.21. Ein Kabel verbindet die beiden." };

const GEMEINSAM = [
  /* ================= Probe 1: Netzwerke mit Filius (Modul 1) ================= */
  { nr: 1, thema: "netzwerke", minutes: 20, titel: "Netzwerke",
    scope: "Netzwerk und Netzwerkgeräte, IP-Adressen, Netzplan lesen, Verbindung testen, einfache Fehler finden",
    items: [
      c("Was ist ein Netzwerk?",
        ["mehrere verbundene Geräte, die Daten austauschen", "ein Computer mit zwei Bildschirmen", "ein Programm zum Bearbeiten von Fotos", "ein Speicher für sehr große Dateien"], 0),
      m("Was brauchst du dafür? Ordne zu.",
        [["Vier Rechner in einem Raum sollen ein gemeinsames Netz bilden.", "Switch"], ["Das Netz der Schule soll mit dem Netz der Turnhalle verbunden werden.", "Router"], ["Tablets sollen ohne Kabel ins Netz kommen.", "Accesspoint"], ["Ein neuer Rechner soll an den Switch angeschlossen werden.", "Netzwerkkabel"]]),
      c("Sieh dir den Netzplan der Arztpraxis an. Wie viele Rechner (ohne den Router) gehören zum Netz 192.168.4.x?",
        ["drei", "zwei", "vier", "sechs"], 0, PRAXIS),
      c("Der Rechner am Empfang schickt ein Paket an den Rechner im Labor. Welchen Weg nimmt es laut Netzplan?",
        ["Switch – Router – Switch", "direkt durch ein einziges Kabel", "Switch – Zimmer 1 – Zimmer 2", "Router – Empfang – Switch"], 0, PRAXIS),
      c("Die Praxis bekommt einen vierten Rechner im Netz 192.168.4.x. Welche Adresse passt und ist noch frei?",
        ["192.168.4.23", "192.168.4.21", "192.168.6.23", "192.168.4"], 0, PRAXIS),
      c("Zwei Rechner im selben Netz haben beide die Adresse 192.168.4.30. Was ist die Folge?",
        ["Das Netz kann die beiden nicht unterscheiden – die Verbindung klappt nicht sicher.", "Beide Rechner werden dadurch doppelt so schnell.", "Der Switch schaltet sich aus und muss neu gekauft werden.", "Nichts – gleiche Adressen sind im selben Netz üblich."], 0),
      o("Du testest in Filius, ob zwei Rechner sich erreichen. Bringe die Schritte in die richtige Reihenfolge.",
        ["Zwei Rechner auf die Fläche ziehen, mit einem Kabel verbinden und ihnen verschiedene Adressen geben", "In den Aktionsmodus wechseln", "Auf einem Rechner die Befehlszeile installieren", "Den Befehl ping mit der Adresse des anderen Rechners eintippen"]),
      c("Die letzte Zeile nach einem ping lautet: „4 Paket(e) gesendet, 0 Paket(e) empfangen, 100% Paketverlust“. Was bedeutet das?",
        ["Der andere Rechner hat nicht geantwortet.", "Die Verbindung ist besonders schnell.", "Vier Rechner hängen am selben Switch.", "Der andere Rechner hat viermal geantwortet."], 0),
      c("Was trägst du bei einem Rechner im Feld „Gateway“ ein?",
        ["die Adresse des Routers im eigenen Netz", "die eigene IP-Adresse des Rechners", "die Adresse des Rechners, den du erreichen willst", "den Namen des Switch"], 0),
      m("Ein ping klappt nicht. Ordne jeder Beobachtung die passende Abhilfe zu.",
        [["Der ping an 192.168.4.99 meldet „Timeout!“. Im Netzplan gibt es kein Gerät mit dieser Adresse.", "die Adresse im Befehl berichtigen"],
         ["Der ping in das Nachbarnetz meldet sofort „Zieladresse nicht erreichbar“.", "beim Rechner das Gateway eintragen"],
         ["Die Adressen stimmen, aber ein Rechner steht ohne Linie auf der Fläche.", "den Rechner mit einem Kabel anschließen"]]),
      t("Im Netzplan fehlt noch ein zweiter Rechner für das Labor. Schreibe zwei Dinge auf, die du in Filius tun musst, damit er zum Netz gehört.",
        "Ich verbinde den Rechner mit einem Kabel mit dem Switch im Labor. Dann gebe ich ihm eine eigene, freie IP-Adresse aus dem Netz 192.168.6.x (und trage das Gateway ein).",
        ["mit einem Kabel an den Switch anschließen (verbinden)", "eine eigene, passende IP-Adresse vergeben (auch: das Gateway eintragen)"],
        ["kabel|verbind|anschlie|ansteck|switch", "adresse|ip-nummer|ip-|ip |gateway"])
    ] },

  /* ================= Probe 1b: nur Einheit N1 „Netzwerke kennenlernen“ (25.10.2026) =================
     Auftrag der Lehrkraft: gleiche Probe für 9M und 9R, 50 % = Note 3, nur über N1, mit einem kleinen Praxisteil:
     in Filius zwei Rechner verbinden, Datei abgeben, Prüfung mit KI – „ganz einfach“. Teil A 14 Punkte, Teil B 6.
     Nachträge (Lehrkraft, 25.10.2026): „mach so dass die kinder die datei im modul selber abgeben, die ki prüft und vergibt
     gleich punkte“ – dann: „nein die kinder sollen die aufgabe nochmal in der probe mit filius machen und im modul abgeben“
     mit der Rückfrage-Antwort „In der Probe hochladen“. Also: Am Ende der Einheit N1 üben die Kinder dieselbe Laden-Aufgabe
     (Abgabe dort, Prüfprogramm + KI sofort, zählt nicht), in der Probe bauen sie das Netz neu und laden die Datei hier hoch.
     Am PC wechseln die Kinder zu Filius und kopieren vielleicht die Adressen aus der Probe – darum weder fürs Verlassen
     noch fürs Kopieren eine Note 6 (wegSekunden 0, kopieren 0: nur Warnung und Vermerk). */
  { nr: "1b", thema: "netzwerke", minutes: 30, titel: "Netzwerke kennenlernen", wegSekunden: 0, kopieren: 0,
    scope: "Einheit N1: Netzwerk, IP-Adresse, Switch, Router, Accesspoint, Datenpakete, Filius (Entwurfs- und Aktionsmodus), ping, drei typische Fehler · Praxis: zwei Rechner in Filius verbinden",
    items: [
      // Gegengelesen 25.10.2026 (unabhängiger Leser): Ablenker ohne Scherzantworten, Aufgabe 5 mit echten Filius-Schritten,
      // Aufgabe 6 nennt die Zieladresse (ping an die eigene Adresse antwortet auch), Praxis-Schritte vollständig, KI nur Namen
      c("Wann spricht man von einem Netzwerk?",
        ["wenn Geräte verbunden sind und Daten austauschen", "wenn mehrere Geräte im selben Raum stehen", "wenn ein Computer am Strom angeschlossen ist", "wenn auf einem Computer viele Programme laufen"], 0),
      c("Warum braucht jedes Gerät im Netzwerk eine eigene IP-Adresse?",
        ["damit die Daten beim richtigen Gerät ankommen", "damit das Gerät einen Namen bekommt", "damit das Gerät schneller hochfährt", "damit man im Netz keinen Switch mehr braucht"], 0),
      m("Welches Gerät brauchst du? Ordne zu.",
        [["Im Computerraum sollen fünf PCs über Kabel Daten austauschen.", "Switch"],
         ["Das Netz der Bücherei soll mit dem Internet verbunden werden.", "Router"],
         ["Die Besucher sollen mit ihren Handys ins WLAN der Bücherei kommen.", "Accesspoint"]]),
      rf("Richtig oder falsch? Entscheide bei jeder Aussage.",
        [["Am Accesspoint braucht jedes Handy ein eigenes Kabel.", false],
         ["Daten reisen im Netzwerk in kleinen Paketen.", true],
         ["Ein Datenpaket kommt auch ohne die Adresse des Empfängers an.", false],
         ["Bei ping schickt ein Rechner Pakete los und wartet auf eine Antwort.", true]]),
      c("Du bist in Filius im Aktionsmodus (grüner Pfeil). Du willst die IP-Adresse eines Rechners ändern. Was machst du zuerst?",
        ["auf den Hammer klicken (Entwurfsmodus)", "in der Befehlszeile ping eintippen", "die Software-Installation öffnen", "das Kabel zum Rechner löschen"], 0),
      c("Auf einem Rechner tippst du ping 192.168.0.31 – das ist die Adresse des anderen Rechners. In der letzten Zeile steht: „4 Paket(e) gesendet, 4 Paket(e) empfangen, 0% Paketverlust“. Was heißt das?",
        ["Der andere Rechner hat geantwortet.", "Kein Paket ist zurückgekommen.", "Zwischen den Rechnern fehlt ein Kabel.", "Im Befehl steht eine falsche Adresse."], 0),
      m("Drei Kinder erreichen in Filius den zweiten Rechner nicht. Woran liegt es? Ordne zu.",
        [["Lena: Beide Rechner haben die Adresse 192.168.0.40. Ein Kabel verbindet sie.", "Adresse doppelt"],
         ["Tom: Die Rechner haben 192.168.0.40 und 192.168.0.41. Das Werkzeug „Verbindung“ hat Tom nicht benutzt.", "Kabel fehlt"],
         ["Ece: Die Rechner haben 192.168.0.40 und 192.168.0.41, ein Kabel verbindet sie. Zum Testen tippt Ece: ping 192.168.0.14", "falsche Adresse im Befehl"]]),
      // Praxis: dieselbe Aufgabe wie die Übung am Ende von N1 (gleiche Prüfpunkte), hier neu gebaut und hochgeladen.
      // Ist es genau die Datei aus der Übung, steht das in der Bewertung (uebung).
      fl("Praxis am PC: Baue in Filius das Netz eines kleinen Ladens – noch einmal neu, wie in der Übung am Ende der Einheit „Netzwerke kennenlernen“. Die Skizze zeigt, wie es aussehen soll. Speichere es und wähle die Datei hier aus.",
        ["1. Öffne Filius. Fragt es nach der Sprache, lass „Deutsch“ stehen und klicke auf Bestätigen. Siehst du schon ein Netz, klicke oben links auf das weiße Blatt (Neu) und dann auf Ja.",
         "2. Ziehe links aus der Leiste mit gedrückter Maustaste einen Rechner auf die weiße Fläche. Hole dir genauso einen zweiten.",
         "3. Doppelklick auf den ersten Rechner. Unten stehen seine Einstellungen. Schreibe bei Name: Kasse. Ändere die IP-Adresse in 192.168.0.20. Drücke nach jeder Eingabe die Eingabetaste (Enter).",
         "4. Doppelklick auf den zweiten Rechner. Schreibe bei Name: Büro. Ändere die IP-Adresse in 192.168.0.21. Wieder nach jeder Eingabe Enter.",
         "5. Klicke in der Leiste links ganz oben auf Verbindung (das rote Kabel). Klicke auf Kasse, dann auf Büro. Drücke dann Esc.",
         "6. Klicke oben auf die Diskette – das geht nur mit dem Hammer (Entwurfsmodus). Speichere in deinem Ordner unter dem Namen probe. Wähle die Datei probe.fls hier unten aus."],
        LADEN_AUFGABE.checks, LADEN_AUFGABE.kiPunkte, LADEN_AUFGABE.kiKriterien, LADEN_AUFGABE.expected,
        { ...LADEN, namen: LADEN_AUFGABE.namen, uebung: "netz-start-laden", einheit: "N1 Netzwerke kennenlernen" }),
      t("Mit welchem Befehl prüfst du auf dem Rechner Kasse, ob Büro antwortet? Schreibe den ganzen Befehl auf. Du kannst ihn in Filius ausprobieren: grüner Pfeil → Kasse anklicken → Software-Installation → Befehlszeile → oberer Pfeil → Änderungen annehmen → Befehlszeile öffnen.",
        "ping 192.168.0.21",
        ["ping und die Adresse von Büro: ping 192.168.0.21 (Groß-/Kleinschreibung und Leerzeichen egal; „ping Büro“ oder die eigene Adresse 192.168.0.20 zählen nicht)"],
        ["ping 192.168.0.21|ping192.168.0.21"])
    ] },

  /* ================= Probe 2: Internet verstehen (Modul 2) ================= */
  { nr: 2, thema: "internet", minutes: 20, titel: "Internet",
    scope: "Aufbau des Internets, Client und Server, URL und DNS, HTTP und HTTPS, Spuren im Internet",
    items: [
      c("Welcher Satz beschreibt das Internet am besten?",
        ["Viele Netze sind über Router miteinander verbunden.", "Ein einziger riesiger Computer speichert alle Seiten.", "Auf jedem Handy ist ein eigenes Internet installiert.", "Das Internet ist das WLAN bei dir zu Hause."], 0),
      m("Ordne jedem Teil seine Rolle zu.",
        [["Browser auf dem Handy", "fragt eine Seite an"], ["Webserver", "liefert die Seite aus"], ["Router", "verbindet das Heimnetz mit dem Internet"]]),
      o("Du tippst www.jugendtreff-nord.example in den Browser. Bringe in die richtige Reihenfolge, was dann passiert.",
        ["Der Browser fragt den DNS-Server nach der IP-Adresse zu diesem Namen.", "Der DNS-Server antwortet mit der IP-Adresse des Webservers.", "Der Browser schickt eine Anfrage (Request) an den Webserver.", "Der Webserver schickt die Seite als Antwort (Response), der Browser zeigt sie an."]),
      c("Der DNS-Server ist ausgefallen. Was passiert, wenn du www.jugendtreff-nord.example aufrufst?",
        ["Der Name wird nicht in eine IP-Adresse übersetzt – die Seite erscheint nicht.", "Die Seite erscheint, nur die Bilder fehlen.", "Die Seite erscheint doppelt so schnell wie sonst.", "Der Webserver löscht die Seite für immer."], 0),
      c("Die Seite www.jugendtreff-nord.example hat die IP-Adresse 198.51.100.7. Was tippst du in die Adresszeile, um sie ohne DNS-Server zu erreichen?",
        ["http://198.51.100.7", "http://www.198.example", "ping jugendtreff-nord", "http://dns.jugendtreff"], 0),
      c("Im Datenaustausch steht die Zeile „GET / HTTP/1.1“. Was bedeutet sie?",
        ["Der Browser fordert eine Seite an (Request).", "Der Webserver schickt die Seite (Response).", "Der DNS-Server nennt eine IP-Adresse.", "Der Router ist ausgeschaltet."], 0),
      c("Was bedeutet die Zeile „HTTP/1.1 200 OK“?",
        ["Der Webserver antwortet: Die Seite ist da und wird geschickt.", "Der Browser fragt nach einer neuen Seite.", "200 Geräte sind gerade im Netz.", "Die Verbindung ist verschlüsselt."], 0),
      m("Ordne jedem Begriff zu, was er bedeutet.",
        [["HTTP", "überträgt alles lesbar"], ["HTTPS", "überträgt verschlüsselt"], ["Zertifikat", "damit weist sich der Server aus"]]),
      c("Woran erkennst du im Browser eine HTTPS-Verbindung?",
        ["an https:// und dem Schloss in der Adresszeile", "an einem roten Rand um die Seite", "an der Endung .example", "an besonders vielen Bildern"], 0),
      c("Eine Seite zeigt das Schloss in der Adresszeile. Was sagt das Schloss NICHT aus?",
        ["dass alles stimmt, was auf der Seite steht", "dass die Daten unterwegs verschlüsselt sind", "dass der Server sich ausgewiesen hat", "dass niemand unterwegs mitlesen kann"], 0),
      c("Du surfst im „privaten Fenster“ (Inkognito). Was stimmt?",
        ["Der Browser merkt sich den Verlauf nicht – Server sehen deine Anfragen trotzdem.", "Niemand im Internet kann sehen, dass du eine Seite aufrufst.", "Deine Anfragen laufen dann nicht mehr über den Router.", "Der Webserver bekommt dann überhaupt keine Daten von dir."], 0),
      t("Jana sagt: „Wenn ich unter einem Fantasienamen schreibe, bin ich im Internet anonym.“ Erkläre in ein bis zwei Sätzen, warum das nicht stimmt.",
        "Jede Anfrage trägt die IP-Adresse des Absenders, der Server sieht sie. Der Internetanbieter weiß, zu welchem Anschluss diese Adresse gehört – so lässt sich herausfinden, wer es war.",
        ["Die IP-Adresse wird bei jeder Anfrage mitgeschickt (der Server sieht sie)", "Die Adresse lässt sich einem Anschluss oder einer Person zuordnen (zum Beispiel durch den Anbieter)"],
        ["adresse", "anbieter|anschluss|zuordnen|zugeordnet|herausfind|zurückverfolg|zurueckverfolg|nachverfolg|nachvollzieh|provider"])
    ] },

  /* ================= Probe 3: Excel-Funktionen (Modul 3) ================= */
  { nr: 3, thema: "funktionen", minutes: 20, titel: "Excel-Funktionen",
    scope: "Zellen und Formeln, Zellbezüge, SUMME, MITTELWERT, PRODUKT, QUOTIENT, RUNDEN, WURZEL, WENN, Anteil in Prozent",
    items: [
      c("Sieh dir die Tabelle des Flohmarkts an. In welcher Zelle steht der Preis für das Brettspiel?",
        ["B3", "C3", "B2", "A3"], 0, FLOHMARKT),
      c("Du tippst A1+A2 in eine Zelle – ohne Gleichheitszeichen davor. Was zeigt Excel?",
        ["den Text A1+A2 – Excel rechnet nicht", "die Summe der beiden Zellen", "die Meldung #DIV/0!", "eine leere Zelle"], 0),
      t("Schreibe die Formel für D2: Einnahmen = Preis mal Stück (Zeile 2).",
        "=B2*C2",
        ["Formel mit = und den Zellbezügen B2 und C2 (auch =PRODUKT(B2;C2))"],
        ["=b2*c2|=c2*b2|=produkt(b2;c2)|=produkt(c2;b2)|=produkt(b2:c2)"], { dicht: true, ...FLOHMARKT }),
      c("In einer anderen Tabelle steht in F2 die Formel =D2-E2. Du ziehst sie nach unten in F3. Was steht dann in F3?",
        ["=D3-E3", "=D2-E2", "=E3-F3", "=D2-E3"], 0),
      c("Welche Formel berechnet die Summe der Einnahmen von D2 bis D6?",
        ["=SUMME(D2:D6)", "=SUMME(D2;D6)", "SUMME(D2:D6)", "=D2:D6"], 0, FLOHMARKT),
      c("Was berechnet =MITTELWERT(B2:B6) in der Flohmarkt-Tabelle?",
        ["den Durchschnitt der fünf Preise", "die Summe der fünf Preise", "den höchsten der fünf Preise", "die Anzahl der Artikel"], 0, FLOHMARKT),
      m("Ordne jeder Funktion zu, was sie tut.",
        [["PRODUKT", "multipliziert Zahlen"], ["QUOTIENT", "teilt und zeigt nur die ganze Zahl"], ["RUNDEN", "macht aus 3,146 die Zahl 3,15"], ["WURZEL", "berechnet aus der Fläche eines Quadrats die Seitenlänge"]]),
      c("Was ergibt =QUOTIENT(17;5)?",
        ["3", "3,4", "2", "85"], 0),
      c("Was ergibt =RUNDEN(12,3456;2)?",
        ["12,35", "12,34", "12", "12,3"], 0),
      c("Was ergibt =WURZEL(64)?",
        ["8", "32", "128", "4096"], 0),
      c("In einer Zelle steht =WENN(C2>10;5;0). In C2 steht die Zahl 10. Was zeigt die Zelle?",
        ["0", "5", "10", "WAHR"], 0),
      t("Sportabzeichen: Ab 30 Punkten soll in C3 „Urkunde“ stehen, sonst „Teilnahme“. Die Punkte stehen in B3. Schreibe die WENN-Formel für C3.",
        "=WENN(B3>=30;\"Urkunde\";\"Teilnahme\")",
        ["WENN mit einer passenden Bedingung (B3>=30 oder gleichwertig)", "beide Texte in Anführungszeichen und an der Stelle, die zur Bedingung passt"],
        // Gruppe 2 hängt an der Bedingung: Bei >= 30 steht „Urkunde“ vorn, bei < 30 „Teilnahme“ – vertauschte Texte zählen nicht
        ["=wenn(b3>=30;|=wenn(b3>29;|=wenn(b3<30;|=wenn(b3<=29;", ">=30;\"urkunde\";\"teilnahme\")|>29;\"urkunde\";\"teilnahme\")|<30;\"teilnahme\";\"urkunde\")|<=29;\"teilnahme\";\"urkunde\")"], { dicht: true, ...ABZEICHEN }),
      c("Von 25 Kindern kommen 10 mit dem Fahrrad. Die 10 steht in B2, die 25 in B6. Welche Formel berechnet den Anteil in Prozent?",
        ["=B2/B6*100", "=B6/B2*100", "=B2*B6/100", "=B2+B6%"], 0),
      o("So trägst du eine Formel ein. Bringe die Schritte in die richtige Reihenfolge.",
        ["die Zelle anklicken, in der das Ergebnis stehen soll", "das Gleichheitszeichen und die Formel tippen", "die Eingabetaste drücken"])
    ] },

  /* ================= Probe 4: Excel-Diagramme (Modul 4) ================= */
  { nr: 4, thema: "diagramme", minutes: 20, titel: "Excel-Diagramme",
    scope: "Diagramme lesen, Säulen-, Balken-, Kreis-, Streifen- und Liniendiagramm, passenden Diagrammtyp wählen, Anteile",
    items: [
      c("Sieh dir das Säulendiagramm an. An welchem Tag wurden die meisten Brötchen verkauft?",
        ["Donnerstag", "Dienstag", "Freitag", "Montag"], 0, BROETCHEN),
      c("Wie viele Brötchen wurden am Mittwoch verkauft?",
        ["30", "40", "45", "55"], 0, BROETCHEN),
      c("In einem Säulendiagramm ist eine Säule doppelt so hoch wie die andere. Was bedeutet das?",
        ["Der Wert ist doppelt so groß.", "Der Wert ist um 2 größer.", "Der Wert wurde zweimal gemessen.", "Die Säule gehört zu zwei Tagen."], 0),
      c("Säulen- und Balkendiagramm zeigen dieselben Daten. Was ist der Unterschied?",
        ["Säulen stehen aufrecht, Balken liegen.", "Säulen zeigen Anteile, Balken zeigen Preise.", "Balken gibt es nur in Schwarz-Weiß.", "Säulen brauchen keinen Titel."], 0),
      m("Welches Diagramm passt am besten zu welcher Frage?",
        [["Wie hat sich der Preis einer Kinokarte in zehn Jahren entwickelt?", "Liniendiagramm"], ["Welchen Anteil haben vier Sportarten an allen Stimmen?", "Kreisdiagramm"], ["Welche von fünf Klassen hat die meisten Punkte gesammelt?", "Säulendiagramm"]]),
      c("Sieh dir das Kreisdiagramm an. Welches Haustier hat genau die Hälfte aller Stimmen?",
        ["Hund", "Katze", "Fische", "Hase"], 0, HAUSTIERE),
      c("Die Teile eines Kreisdiagramms ergeben zusammen immer …",
        ["100 %", "50 %", "360 %", "so viel wie die größte Zahl"], 0),
      c("Was ist ein Streifendiagramm?",
        ["ein Streifen, der in Abschnitte für die Anteile geteilt ist", "mehrere Linien, die nebeneinander nach oben laufen", "ein Kreis mit einem Loch in der Mitte", "eine Tabelle mit farbigen Zeilen"], 0),
      c("Von 40 befragten Kindern wählen 10 „Bus“. Wie groß ist dieser Anteil?",
        ["25 %", "10 %", "40 %", "4 %"], 0),
      o("Du erstellst in Excel ein Diagramm. Bringe die Schritte in die richtige Reihenfolge.",
        ["die Daten in die Tabelle eintragen", "den Datenbereich mit der Maus markieren", "über „Einfügen“ den Diagrammtyp auswählen", "einen passenden Diagrammtitel eintragen"]),
      c("Warum braucht jedes Diagramm einen Titel?",
        ["damit man sofort sieht, was es zeigt", "damit die Säulen höher werden", "weil Excel es sonst nicht speichert", "damit die Farben stimmen"], 0),
      c("Sieh dir das Liniendiagramm an. Wann fällt die Temperatur?",
        ["zwischen 14 Uhr und 18 Uhr", "zwischen 8 Uhr und 12 Uhr", "zwischen 10 Uhr und 14 Uhr", "sie fällt nie"], 0, TEMPERATUR),
      c("Ein Diagramm soll die Klassen und ihre Punkte zeigen. Welcher Datenbereich gehört dazu?",
        ["A1:B6", "B1:B6", "A1:A6", "A2:A6"], 0, KLASSEN),
      t("Lea zeigt mit einem Liniendiagramm, wie viele Kinder welche Lieblingsfarbe haben (Rot 8, Blau 11, Grün 5). Erkläre, warum die Linie hier nicht passt, und nenne ein besseres Diagramm.",
        "Eine Linie zeigt eine Entwicklung über die Zeit. Die Farben haben keinen Verlauf und keine feste Reihenfolge. Besser ist ein Säulendiagramm (oder ein Balken- oder Kreisdiagramm).",
        ["Eine Linie zeigt einen Verlauf über die Zeit – hier gibt es keine Zeit und keine Reihenfolge", "besser: Säulen-, Balken- oder Kreisdiagramm"],
        ["zeit|verlauf|entwicklung|reihenfolge", "säule|saeule|balken|kreis|streifen"])
    ] },

  /* ================= Probe 5: Programmieren mit Scratch (Modul 5) ================= */
  { nr: 5, thema: "scratch", minutes: 20, titel: "Programmieren mit Scratch",
    scope: "Programm und Anweisung, Eigenschaften einer Figur, Eingabe und Ausgabe, Variable, Bedingung, Wiederholung, eigene Blöcke, Fehler finden",
    items: [
      c("Welche Beschreibung passt zu einem Programm?",
        ["eine Folge von Anweisungen, die der Reihe nach ausgeführt werden", "ein Bild, das auf der Bühne als Hintergrund liegt", "ein Speicherplatz mit einem Namen für eine Zahl", "eine Figur, die sich auf der Bühne bewegen kann"], 0),
      m("Ordne jedem Block den passenden Fachbegriff zu.",
        [["frage „Wie viele Geschwister hast du?“ und warte", "Eingabe"], ["sage „Guten Morgen!“", "Ausgabe"], ["setze punkte auf 0", "Wertzuweisung"], ["falls Antwort = 5 dann", "Bedingung"]]),
      c("Sieh dir das Programm an. Die Figur schaut nach rechts. Bei welchem x-Wert steht sie am Ende?",
        ["120", "30", "34", "4"], 0, LAUFEN),
      c("Sieh dir das Programm noch einmal an. Wie oft sagt die Figur „Geschafft!“?",
        ["einmal", "viermal", "fünfmal", "gar nicht"], 0, LAUFEN),
      o("Die Figur soll nach einem Reiseziel fragen und dann eine gute Reise dorthin wünschen. Bringe die Blöcke in die richtige Reihenfolge.",
        ["Wenn Start angeklickt wird", "frage „In welche Stadt möchtest du reisen?“ und warte", "setze stadt auf Antwort", "sage verbinde „Gute Reise nach “ und stadt"]),
      c("Sieh dir das Programm mit der Variable punkte an. Was sagt die Figur am Ende?",
        ["6", "2", "3", "5"], 0, ZAEHLEN),
      c("Sieh dir das Programm an. Jemand tippt 49 ein. Was sagt die Figur?",
        ["„Übe noch.“", "„Bestanden!“", "erst „Bestanden!“, dann „Übe noch.“", "gar nichts"], 0, TEST),
      c("Tom will Runden zählen: Am Ende soll die Figur 6 sagen. Sie sagt aber 1. Wo liegt der Fehler?",
        ["„setze runden auf 0“ steht in der Wiederholung.", "Die Wiederholung läuft nur ein einziges Mal.", "Der Block „ändere runden um 1“ fehlt im Programm.", "Die Figur kann nur Texte sagen, keine Zahlen."], 0, RUNDEN),
      c("Wozu baust du in Scratch einen eigenen Block?",
        ["Er fasst mehrere Anweisungen unter einem Namen zusammen.", "Er macht die Figur auf der Bühne doppelt so groß.", "Er speichert das Projekt von selbst als Datei.", "Er löscht alle Variablen aus dem Programm."], 0),
      m("Welche Eigenschaft der Figur ändert der Block?",
        [["gehe zu x: -150 y: 120", "wo die Figur steht (Position)"], ["setze Größe auf 50", "wie groß die Figur ist"], ["setze Richtung auf 180 Grad", "wohin die Figur schaut (Richtung)"]]),
      t("Mia will, dass ihre Figur zwölfmal blinkt. Sie setzt zwölfmal hintereinander die beiden Blöcke „verstecke dich“ und „zeige dich“ in ihr Programm. Schreibe auf, wie es kürzer geht, und nenne einen Vorteil.",
        "Sie nimmt den Block „wiederhole 12 mal“ und setzt die beiden Blöcke nur einmal hinein. Das Programm ist kürzer und lässt sich leichter ändern.",
        ["den Block „wiederhole … mal“ nennen (Wiederholung, Schleife)", "einen Vorteil nennen: kürzer, übersichtlicher, weniger Blöcke oder leichter zu ändern"],
        ["wiederhol|schleife", "kürzer|kurz|übersicht|weniger|leichter|schneller|einfacher|spar|änder"])
    ] }
];

const { mischen } = require("./proben-mischen");
const PROBEN = {}, VORLAGE = {};
for (const p of GEMEINSAM) {
  // erst einmal mischen (feste Reihenfolge aus Kennung und Aufgabentext), dann für beide Züge übernehmen
  const basis = mischen({ id: "inf9-p" + p.nr, thema: p.thema, minutes: p.minutes, scope: p.scope, items: JSON.parse(JSON.stringify(p.items)) });
  for (const [zug, kurz] of [["R", "r"], ["M", "m"]]) {
    const id = "inf9-p" + p.nr + "-" + kurz, kopf = { id, zug, thema: p.thema, minutes: p.minutes, title: "Probe " + p.nr + " (9" + zug + "): " + p.titel, scope: p.scope,
      // eigene Testregeln (Probe 1b): 0 = für Verlassen bzw. Kopieren keine Note 6
      ...(Number.isInteger(p.wegSekunden) ? { wegSekunden: p.wegSekunden } : {}), ...(Number.isInteger(p.kopieren) ? { kopieren: p.kopieren } : {}) };
    PROBEN[id] = { ...kopf, items: JSON.parse(JSON.stringify(basis.items)) };
    VORLAGE[id] = { ...kopf, items: p.items };
  }
}

module.exports = PROBEN;
// nur für Tests: die Vorlage ohne Mischen
Object.defineProperty(module.exports, "__vorlage", { value: VORLAGE, enumerable: false });
// (c, m, o, t werden mit den Proben gebraucht)
void [c, m, o, t, rf, fl];
