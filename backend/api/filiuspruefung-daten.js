"use strict";

/**
 * Praktische Prüfung zum Filius-Workshop (Informatik 9).
 *
 * Diese Datei bleibt auf dem Server: Sie enthält die Lösungen.
 *
 * Inhaltlich deckungsgleich mit dem Workshop unter 9/Informatik_9/Filius/.
 * Jede Frage stammt aus einem der Videos 01, 02 und 04 bis 12
 * (YouTube-Kanal Herr Sauer, verlinkt im Skript 05_FILIUS.pdf).
 * Themen, die in den Videos nicht vorkommen (z. B. DHCP, E-Mail), sind
 * bewusst nicht enthalten.
 *
 * Teil A: Fragen zum Ankreuzen (answer = Index der richtigen Option)
 * Teil B: Abgabe der Filius-Datei. Der Server liest sie aus und prueft die
 *         Pflichtpunkte exakt; die KI vergibt zusätzlich kiPunkte für die
 *         Qualität der Gesamtlösung.
 */

const inf9FiliusPruefung1 = {
  id: "inf9-filius-pruefung1",
  title: "Praktische Prüfung - Filius-Workshop",
  unit: "Informatik 9 / Filius",
  classLevel: "9",

  /* ---------------- Teil A: Ankreuzen ---------------- */
  items: [
    {
      type: "choice",
      prompt: "Du hast zwei Rechner direkt mit einem Kabel verbunden. Wie nennt man das?",
      options: ["Client-Server", "Peer-to-Peer", "Stern-Topologie", "Gateway"],
      answer: 1, points: 1
    },
    {
      type: "choice",
      prompt: "In welchem Modus baust du das Netz auf (Geräte ziehen, IPs vergeben)?",
      options: ["Im Aktionsmodus", "Im Entwurfsmodus", "Im Testmodus", "Im Servermodus"],
      answer: 1, points: 1
    },
    {
      type: "choice",
      prompt: "Mit welchem Befehl prüfst du, ob ein anderer Rechner antwortet?",
      options: ["ipconfig", "dir", "ping", "host"],
      answer: 2, points: 1
    },
    {
      type: "choice",
      prompt: "Der Ping meldet: 4 Pakete gesendet, 4 empfangen, 0 % Paketverlust. Was heisst das?",
      options: [
        "Die Verbindung funktioniert einwandfrei.",
        "Vier Pakete sind verloren gegangen.",
        "Der Rechner ist ausgeschaltet.",
        "Die IP-Adresse ist falsch."
      ],
      answer: 0, points: 1
    },
    {
      type: "choice",
      prompt: "Welcher Befehl zeigt dir die eigene IP-Adresse an?",
      options: ["ipconfig", "ping", "traceroute", "netstat"],
      answer: 0, points: 1
    },
    {
      type: "choice",
      prompt: "Wie öffnest du das Fenster, in dem du die einzelnen Pakete siehst?",
      options: [
        "Doppelklick auf den Rechner",
        "Rechtsklick auf den Rechner, dann Datenaustausch anzeigen",
        "Über das Kabel-Werkzeug",
        "Mit der Taste Esc"
      ],
      answer: 1, points: 1
    },
    {
      type: "choice",
      prompt: "Du hängst ein drittes Gerät per Kabel direkt an einen Rechner. Was passiert?",
      options: [
        "Es funktioniert problemlos.",
        "Filius meldet, dass die maximale Anzahl angeschlossener Geräte überschritten ist.",
        "Der Rechner startet neu.",
        "Die IP-Adresse ändert sich."
      ],
      answer: 1, points: 1
    },
    {
      type: "choice",
      prompt: "Womit laesst sich ein Switch am besten vergleichen?",
      options: [
        "Mit einer Mehrfachsteckdose",
        "Mit einem Telefonbuch",
        "Mit einer Haustür",
        "Mit einem Briefkasten"
      ],
      answer: 0, points: 1
    },
    {
      type: "choice",
      prompt: "Was macht der Echo-Server?",
      options: [
        "Er speichert deine Nachricht dauerhaft.",
        "Er schickt genau dieselbe Nachricht zurück.",
        "Er verteilt IP-Adressen.",
        "Er verbindet zwei Netze."
      ],
      answer: 1, points: 1
    },
    {
      type: "choice",
      prompt: "Was ist mit dem Wort Server eigentlich gemeint?",
      options: [
        "Nur das Gerät, also die Hardware.",
        "Die Software bzw. das Programm, das darauf läuft.",
        "Das Netzwerkkabel.",
        "Die IP-Adresse."
      ],
      answer: 1, points: 1
    },
    {
      type: "choice",
      prompt: "Welches Gerät verbindet zwei verschiedene Netze miteinander?",
      options: ["Switch", "Hub", "Vermittlungsrechner (Router)", "Repeater"],
      answer: 2, points: 1
    },
    {
      type: "choice",
      prompt: "Was ist die Gateway-IP anschaulich gesagt?",
      options: [
        "Die Haustür des eigenen Netzes.",
        "Das Passwort des Routers.",
        "Die Nummer des Switches.",
        "Die Geschwindigkeit der Leitung."
      ],
      answer: 0, points: 1
    },
    {
      type: "choice",
      prompt: "Der Ping in ein anderes Netz meldet 'Zieladresse nicht erreichbar'. Woran liegt das?",
      options: [
        "Der Router ist kaputt.",
        "Bei den Rechnern fehlt noch das Gateway.",
        "Das Kabel ist zu kurz.",
        "Die IP-Adressen sind doppelt vergeben."
      ],
      answer: 1, points: 1
    },
    {
      type: "choice",
      prompt: "Wie muss die Startseite eines Webservers heißen?",
      options: ["start.html", "index.html", "home.html", "seite1.html"],
      answer: 1, points: 1
    },
    {
      type: "choice",
      prompt: "Wofür steht bgcolor im HTML-Code?",
      options: [
        "Für die Schriftgröße",
        "Für die Hintergrundfarbe (background color)",
        "Für die Breite der Seite",
        "Für den Namen der Datei"
      ],
      answer: 1, points: 1
    },
    {
      type: "choice",
      prompt: "Du tippst www.willkommen.de in den Browser. Was passiert zuerst?",
      options: [
        "Der Rechner fragt beim DNS-Server nach der IP-Adresse.",
        "Die Seite wird sofort angezeigt.",
        "Der Router startet neu.",
        "Der Webserver sucht den Namen."
      ],
      answer: 0, points: 1
    }
  ],

  /* ---------------- Teil B: Filius-Datei ---------------- */
  upload: {
    aufgabe: [
      "Baue in Filius das Netz aus dem Workshop nach und lade die Datei hoch.",
      "Die Netzmaske ist überall 255.255.255.0 - die musst du nicht ändern.",
      "Die Namen darfst du frei wählen, nur die IP-Adressen müssen stimmen.",
      "",
      "============================================================",
      "SCHRITT 1 - Netz 0 aufbauen                       (2 Punkte)",
      "============================================================",
      "Ziehe im ENTWURFSMODUS einen Switch und drei Rechner auf die Fläche.",
      "Doppelklick auf jeden Rechner und die IP eintragen:",
      "",
      "   1. Rechner   192.168.0.10",
      "   2. Rechner   192.168.0.11",
      "   3. Rechner   192.168.0.12     <- das wird später dein Server",
      "",
      "Verbinde alle drei per Kabel mit dem Switch.",
      "TIPP: Nach dem Kabelziehen Esc drücken, sonst klebt das Kabel weiter.",
      "",
      "============================================================",
      "SCHRITT 2 - Netz 1 aufbauen                       (2 Punkte)",
      "============================================================",
      "Ein zweiter Switch und zwei Rechner:",
      "",
      "   4. Rechner   192.168.1.10",
      "   5. Rechner   192.168.1.11",
      "",
      "Verbinde beide mit dem zweiten Switch.",
      "TIPP: Achte auf die dritte Zahl! Netz 0 hat eine 0, Netz 1 hat eine 1.",
      "",
      "============================================================",
      "SCHRITT 3 - Router einbauen                       (4 Punkte)",
      "============================================================",
      "Ziehe einen VERMITTLUNGSRECHNER zwischen die beiden Switches.",
      "Filius fragt nach der Zahl der Schnittstellen -> 2 auswählen.",
      "",
      "Doppelklick auf den Router. Er hat zwei Anschlüsse, jeder braucht",
      "eine eigene IP:",
      "",
      "   Anschluss Richtung Netz 0:   192.168.0.1",
      "   Anschluss Richtung Netz 1:   192.168.1.1",
      "",
      "Dann beide Kabel ziehen: Switch 1 -> Router -> Switch 2.",
      "TIPP: Der Router bekommt in jedem Netz die .1 - das ist üblich so.",
      "",
      "============================================================",
      "SCHRITT 4 - Gateway eintragen                     (4 Punkte)",
      "============================================================",
      "Das ist der Schritt, den die meisten vergessen! Ohne Gateway kommt",
      "kein Ping ins andere Netz.",
      "",
      "Das Gateway ist immer die Router-IP AUF DER EIGENEN SEITE:",
      "",
      "   Die drei Rechner in Netz 0  ->  Gateway 192.168.0.1",
      "   Die zwei Rechner in Netz 1  ->  Gateway 192.168.1.1",
      "",
      "SO GEHT ES:",
      "  1. Doppelklick auf einen Rechner",
      "  2. Im Feld GATEWAY die Adresse eintippen",
      "  3. Fenster schließen, nächster Rechner",
      "",
      "TIPP 1: Du kannst die Adresse einmal kopieren (Strg+C) und bei den",
      "        anderen Rechnern einfach einfügen (Strg+V).",
      "TIPP 2: Der Router selbst braucht KEIN Gateway - nur die Rechner.",
      "TIPP 3: Zähle am Ende nach: Es müssen genau 5 Rechner sein, bei",
      "        denen etwas im Gateway-Feld steht.",
      "ACHTUNG: Fehlt es auch nur bei einem Rechner, gibt es für dieses",
      "        ganze Netz 0 Punkte.",
      "",
      "============================================================",
      "SCHRITT 5 - Echo-Server                           (2 Punkte)",
      "============================================================",
      "Wechsle in den AKTIONSMODUS (Pfeil oben).",
      "",
      "  1. Doppelklick auf den Rechner 192.168.0.12",
      "  2. Software-Installation anklicken",
      "  3. ECHO-SERVER auswählen, Pfeil nach rechts, Änderungen annehmen",
      "  4. Den Echo-Server öffnen und auf STARTEN klicken",
      "",
      "ACHTUNG: Installieren allein reicht nicht - er muss auch LAUFEN.",
      "TIPP: Wenn er läuft, steht dort Anhalten statt Starten.",
      "",
      "============================================================",
      "SCHRITT 6 - Webserver mit eigener Seite           (4 Punkte)",
      "============================================================",
      "Auf demselben Rechner 192.168.0.12:",
      "",
      "  1. Software-Installation -> WEBSERVER und TEXTEDITOR installieren",
      "  2. Texteditor öffnen -> Datei öffnen -> Ordner webserver",
      "     -> index.html anklicken -> Öffnen",
      "  3. Den alten Text löschen und diesen hier eintippen.",
      "     Schreibe überall dort, wo DEIN NAME steht, deinen eigenen Text:",
      "",
      "-------------------- Vorlage index.html --------------------",
      "<html>",
      "  <head>",
      "    <title>Meine Seite</title>",
      "  </head>",
      "  <body bgcolor=\"#ccddff\">",
      "    <h2>Das Netzwerk von DEIN NAME</h2>",
      "    <p>Herzlich willkommen auf meiner Seite!</p>",
      "    <p>Hier siehst du mein Netzwerk aus der Informatik-Prüfung.</p>",
      "  </body>",
      "</html>",
      "------------------------------------------------------------",
      "",
      "  4. Speichern",
      "  5. Den Webserver öffnen und auf STARTEN klicken",
      "",
      "TIPP 1: Groß- und Kleinschreibung genau übernehmen.",
      "TIPP 2: Jede spitze Klammer < und > muss stehen bleiben.",
      "TIPP 3: Die Farbe hinter bgcolor darfst du ändern, zum Beispiel",
      "        \"#ffdddd\" für rosa oder \"#ddffdd\" für hellgrün.",
      "",
      "============================================================",
      "SCHRITT 7 - Testen und abgeben",
      "============================================================",
      "  1. Befehlszeile auf dem Rechner 192.168.0.10 installieren",
      "  2. ping 192.168.1.10 eingeben -> es muss eine Antwort kommen",
      "  3. Auf Rechner 192.168.1.10 einen Webbrowser installieren und",
      "     192.168.0.12 aufrufen -> deine Seite muss erscheinen",
      "",
      "Dann in den Entwurfsmodus wechseln, speichern als",
      "NACHNAME-Vorname.fls und hier hochladen.",
      "",
      "============================================================",
      "ZUSATZ - Bewertung durch die KI                   (8 Punkte)",
      "============================================================",
      "Bewertet werden sauberer Aufbau und stimmige Adressen.",
      "Wer mehr einbaut als verlangt (zum Beispiel einen DNS-Server mit",
      "www.willkommen.de), bekommt hier mehr Punkte."
    ].join("\n"),

    /* Punkte, die die KI zusätzlich für die Qualität des Netzes vergibt. */
    kiPunkte: 8,

    checks: [
      { id: "sw", typ: "geraet",   art: "Switch", mindestens: 2, punkte: 2,
        text: "Schritt 1+2: Zwei Switches vorhanden" },
      { id: "rt", typ: "router2", punkte: 2,
        text: "Schritt 3: Router mit zwei Schnittstellen und beiden Kabeln" },
      { id: "net0", typ: "netz",     praefix: "192.168.0.", mindestens: 3, punkte: 2,
        text: "Schritt 1: Drei Geräte im Netz 192.168.0.x" },
      { id: "net1", typ: "netz",     praefix: "192.168.1.", mindestens: 2, punkte: 2,
        text: "Schritt 2: Zwei Geräte im Netz 192.168.1.x" },
      { id: "rip0", typ: "ip",       ip: "192.168.0.1", punkte: 1,
        text: "Schritt 3: Router hat die IP 192.168.0.1" },
      { id: "rip1", typ: "ip",       ip: "192.168.1.1", punkte: 1,
        text: "Schritt 3: Router hat die IP 192.168.1.1" },
      { id: "gw0", typ: "gateway",  praefix: "192.168.0.", gateway: "192.168.0.1", punkte: 2,
        text: "Schritt 4: Alle Geräte im Netz 0 haben Gateway 192.168.0.1" },
      { id: "gw1", typ: "gateway",  praefix: "192.168.1.", gateway: "192.168.1.1", punkte: 2,
        text: "Schritt 4: Alle Geräte im Netz 1 haben Gateway 192.168.1.1" },
      { id: "echo", typ: "laeuft",   name: "ServerBaustein", punkte: 2,
        text: "Schritt 5: Echo-Server installiert und gestartet" },
      { id: "seite", typ: "webseite", dateiname: "index.html", mindestZeichen: 60, punkte: 2,
        text: "Schritt 6: Eigene Seite in index.html geschrieben" },
      { id: "web", typ: "laeuft",   name: "WebServer", punkte: 2,
        text: "Schritt 6: Webserver installiert und gestartet" }
    ]
  }
};

const TESTS = {
  [inf9FiliusPruefung1.id]: inf9FiliusPruefung1
};

module.exports = { TESTS };
