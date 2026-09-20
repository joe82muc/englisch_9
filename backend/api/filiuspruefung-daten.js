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
      "Baue in Filius das Netz aus dem Workshop nach und lade die gespeicherte Datei hoch.",
      "Halte dich genau an die Namen und die IP-Adressen. Die Netzmaske ist",
      "überall 255.255.255.0.",
      "",
      "SCHRITT 1 - Netz 0 aufbauen (2 Punkte)",
      "Setze einen Switch und drei Geräte darauf:",
      "   Rechner 0.10   IP 192.168.0.10",
      "   Rechner 0.11   IP 192.168.0.11",
      "   Server 0.12    IP 192.168.0.12",
      "Verbinde alle drei mit dem Switch 1.",
      "",
      "SCHRITT 2 - Netz 1 aufbauen (2 Punkte)",
      "Setze einen zweiten Switch und drei Geräte darauf:",
      "   Rechner 1.10   IP 192.168.1.10",
      "   Rechner 1.11   IP 192.168.1.11",
      "   Rechner 1.12   IP 192.168.1.12",
      "Verbinde alle drei mit dem Switch 2.",
      "Achtung: Beide Switches zusammen sind 2 Punkte wert.",
      "",
      "SCHRITT 3 - Router einbauen (4 Punkte)",
      "Ziehe einen Vermittlungsrechner zwischen die beiden Switches und wähle",
      "2 Schnittstellen. Setze die beiden IP-Adressen auf:",
      "   Anschluss zu Switch 1:  192.168.0.1   (1 Punkt)",
      "   Anschluss zu Switch 2:  192.168.1.1   (1 Punkt)",
      "Verbinde den Router per Kabel mit Switch 1 und mit Switch 2 (2 Punkte).",
      "",
      "SCHRITT 4 - Gateway eintragen (4 Punkte)",
      "Öffne jedes der sechs Geräte und trage das Gateway ein:",
      "   Rechner 0.10, 0.11, Server 0.12  ->  Gateway 192.168.0.1   (2 Punkte)",
      "   Rechner 1.10, 1.11, 1.12         ->  Gateway 192.168.1.1   (2 Punkte)",
      "Vergisst du auch nur ein Gerät, gibt es für dieses Netz keine Punkte.",
      "",
      "SCHRITT 5 - Echo-Server (2 Punkte)",
      "Installiere im Aktionsmodus auf Server 0.12 den Echo-Server und STARTE ihn",
      "auf Port 55555. Installiere auf Rechner 0.10 den Einfachen Client und",
      "schicke eine Nachricht an 192.168.0.12.",
      "",
      "SCHRITT 6 - Webserver mit eigener Seite (4 Punkte)",
      "Installiere auf Server 0.12 einen Webserver und einen Texteditor.",
      "Schreibe in die Datei index.html deine EIGENE Seite: eine Überschrift,",
      "mindestens zwei Absätze und eine Hintergrundfarbe (2 Punkte).",
      "Starte den Webserver (2 Punkte).",
      "",
      "SCHRITT 7 - Testen und speichern",
      "Teste im Aktionsmodus von Rechner 0.10 aus:",
      "   ping 192.168.1.10           (muss eine Antwort geben)",
      "Rufe deine Seite im Browser von Rechner 1.10 auf: 192.168.0.12",
      "Speichere die Datei als NACHNAME-Vorname.fls und lade sie hier hoch.",
      "",
      "ZUSATZ - Gesamtbewertung durch die KI (8 Punkte)",
      "Bewertet werden sauberer Aufbau, passende Namen und stimmige Adressen.",
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
      { id: "net1", typ: "netz",     praefix: "192.168.1.", mindestens: 3, punkte: 2,
        text: "Schritt 2: Drei Geräte im Netz 192.168.1.x" },
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
