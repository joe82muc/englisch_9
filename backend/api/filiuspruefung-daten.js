"use strict";

/**
 * Praktische Prüfung zum Filius-Workshop (Informatik 9).
 *
 * Diese Datei bleibt auf dem Server: Sie enthält die Lösungen.
 *
 * Teil A: Fragen zum Ankreuzen (type "choice", answer = Index der richtigen Option)
 * Teil B: Abgabe der Filius-Datei. Die Datei wird vom Server ausgelesen und
 *         gegen die Liste "checks" geprüft. Jeder Check ist ein Pflichtpunkt
 *         und wird exakt bewertet - nicht von der KI geschätzt.
 *
 * Check-Typen (siehe filiuspruefung.js):
 *   geraet     { art, mindestens }            - Anzahl Geräte einer Art
 *   ip         { ip }                          - diese IP existiert im Netz
 *   netz       { praefix, mindestens }         - so viele Geräte im Netz x.y.z.
 *   gateway    { praefix, gateway }            - alle Geräte im Netz haben dieses Gateway
 *   software   { name }                        - diese Software ist installiert
 *   dhcp       { }                             - irgendwo ist DHCP aktiviert
 *   router2    { }                             - Router mit mindestens 2 Schnittstellen
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
      prompt: "Mit welchem Befehl prüfst du, ob ein anderer Rechner antwortet?",
      options: ["ipconfig", "dir", "ping", "host"],
      answer: 2, points: 1
    },
    {
      type: "choice",
      prompt: "Welcher Befehl zeigt dir die eigene IP-Adresse an?",
      options: ["ipconfig", "ping", "traceroute", "netstat"],
      answer: 0, points: 1
    },
    {
      type: "choice",
      prompt: "Warum brauchst du ab drei Rechnern einen Switch?",
      options: [
        "Weil jeder Rechner nur einen Netzwerkanschluss hat.",
        "Weil die Kabel sonst zu lang werden.",
        "Weil Filius das vorschreibt.",
        "Weil der Strom sonst nicht reicht."
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
      prompt: "Welches Gerät verbindet zwei verschiedene Netze miteinander?",
      options: ["Switch", "Hub", "Vermittlungsrechner (Router)", "Repeater"],
      answer: 2, points: 1
    },
    {
      type: "choice",
      prompt: "Rechner 0.10 soll 192.168.1.10 erreichen. Was muss eingetragen sein?",
      options: [
        "Ein zweites Kabel",
        "Das Gateway 192.168.0.1",
        "Die Netzmaske 255.255.0.0",
        "Ein DNS-Server"
      ],
      answer: 1, points: 1
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
      prompt: "Wozu dient ein DHCP-Server?",
      options: [
        "Er speichert Webseiten.",
        "Er verteilt automatisch IP-Adressen.",
        "Er übersetzt Namen in IP-Adressen.",
        "Er verschickt E-Mails."
      ],
      answer: 1, points: 1
    },
    {
      type: "choice",
      prompt: "Welches Gerät bekommt sinnvollerweise eine feste IP statt DHCP?",
      options: ["Ein Gast-Handy", "Ein Schüler-Tablet", "Der Netzwerkdrucker", "Ein Laptop im Lesesaal"],
      answer: 2, points: 1
    },
    {
      type: "choice",
      prompt: "Wozu dient ein DNS-Server?",
      options: [
        "Er übersetzt Namen wie www.test.de in IP-Adressen.",
        "Er vergibt IP-Adressen.",
        "Er speichert E-Mails.",
        "Er verstärkt das Signal."
      ],
      answer: 0, points: 1
    },
    {
      type: "choice",
      prompt: "In welcher Sprache sind Webseiten geschrieben?",
      options: ["DNS", "HTML", "DHCP", "SMTP"],
      answer: 1, points: 1
    },
    {
      type: "choice",
      prompt: "Du tippst www.willkommen.de in den Browser. Was passiert zuerst?",
      options: [
        "Der Browser fragt den DNS-Server nach der IP.",
        "Die Seite wird sofort angezeigt.",
        "Der DHCP-Server vergibt eine Adresse.",
        "Der Router startet neu."
      ],
      answer: 0, points: 1
    },
    {
      type: "choice",
      prompt: "Warum kommt eine E-Mail an, obwohl der Empfänger offline ist?",
      options: [
        "Sie wartet auf deinem Rechner.",
        "Sie liegt beim Mailserver und wird später abgeholt.",
        "Sie geht verloren.",
        "Sie wird laufend neu verschickt."
      ],
      answer: 1, points: 1
    },
    {
      type: "choice",
      prompt: "Zwei Rechner haben 192.168.0.10 und 192.168.1.10. Was gilt?",
      options: [
        "Sie sind im selben Netz.",
        "Sie sind in verschiedenen Netzen und brauchen einen Router.",
        "Eine der IPs ist ungültig.",
        "Sie können sich nie erreichen."
      ],
      answer: 1, points: 1
    },
    {
      type: "choice",
      prompt: "Welche Netzmaske gehört zu einem 192.168.0.x-Netz mit /24?",
      options: ["255.0.0.0", "255.255.0.0", "255.255.255.0", "255.255.255.255"],
      answer: 2, points: 1
    }
  ],

  /* ---------------- Teil B: Filius-Datei ---------------- */
  upload: {
    aufgabe:
      "Baue in Filius das folgende Netz nach und lade die gespeicherte Datei hoch.\n" +
      "Halte dich genau an die Namen und die IP-Adressen. Die Netzmaske ist\n" +
      "überall 255.255.255.0.\n" +
      "\n" +
      "SCHRITT 1 - Netz 0 aufbauen (2 Punkte)\n" +
      "Setze einen Switch und drei Geräte darauf:\n" +
      "   PC 0.10      IP 192.168.0.10\n" +
      "   PC 0.11      IP 192.168.0.11\n" +
      "   Server 0.12  IP 192.168.0.12   (nimm hier einen Rechner, keinen Notebook)\n" +
      "Verbinde alle drei mit dem Switch 1.\n" +
      "\n" +
      "SCHRITT 2 - Netz 1 aufbauen (2 Punkte)\n" +
      "Setze einen zweiten Switch und zwei Geräte darauf:\n" +
      "   PC 1.10      IP 192.168.1.10\n" +
      "   PC 1.11      IP 192.168.1.11\n" +
      "Verbinde beide mit dem Switch 2.\n" +
      "Achtung: Beide Switches zusammen sind 2 Punkte wert.\n" +
      "\n" +
      "SCHRITT 3 - Router einbauen (4 Punkte)\n" +
      "Ziehe einen Vermittlungsrechner zwischen die beiden Switches und wähle\n" +
      "2 Schnittstellen. Setze die beiden IP-Adressen auf:\n" +
      "   Anschluss zu Switch 1:  192.168.0.1   (1 Punkt)\n" +
      "   Anschluss zu Switch 2:  192.168.1.1   (1 Punkt)\n" +
      "Verbinde den Router per Kabel mit Switch 1 und mit Switch 2 (2 Punkte).\n" +
      "\n" +
      "SCHRITT 4 - Gateway eintragen (4 Punkte)\n" +
      "Öffne jedes der fünf Geräte und trage das Gateway ein:\n" +
      "   PC 0.10, PC 0.11, Server 0.12  ->  Gateway 192.168.0.1   (2 Punkte)\n" +
      "   PC 1.10, PC 1.11               ->  Gateway 192.168.1.1   (2 Punkte)\n" +
      "Vergisst du auch nur ein Gerät, gibt es für dieses Netz keine Punkte.\n" +
      "\n" +
      "SCHRITT 5 - Webserver einrichten (2 Punkte)\n" +
      "Wechsle in den Aktionsmodus und installiere auf Server 0.12 einen\n" +
      "Webserver. Starte ihn.\n" +
      "\n" +
      "SCHRITT 6 - Testen und speichern\n" +
      "Teste im Aktionsmodus mit der Befehlszeile von PC 0.10:\n" +
      "   ping 192.168.1.10     (muss eine Antwort geben)\n" +
      "Speichere dann die Datei als NACHNAME-Vorname.fls und lade sie hier hoch.\n" +
      "\n" +
      "ZUSATZ - Gesamtbewertung durch die KI (8 Punkte)\n" +
      "Bewertet werden sauberer Aufbau, passende Namen und stimmige Adressen.\n" +
      "Wer mehr einbaut als verlangt (zum Beispiel DNS-Server, DHCP oder einen\n" +
      "Mailserver), bekommt hier mehr Punkte.",

    /* Punkte, die die KI zusaetzlich für die Qualitaet des Netzes vergibt.
       Die Pflichtpunkte unten bleiben davon unberuehrt. */
    kiPunkte: 8,

    checks: [
      { id: "sw",    typ: "geraet",   art: "Switch", mindestens: 2, punkte: 2,
        text: "Schritt 1+2: Zwei Switches vorhanden" },
      { id: "rt",    typ: "router2",  punkte: 2,
        text: "Schritt 3: Router mit zwei Schnittstellen und beiden Kabeln" },
      { id: "net0",  typ: "netz",     praefix: "192.168.0.", mindestens: 3, punkte: 2,
        text: "Schritt 1: Drei Geräte im Netz 192.168.0.x" },
      { id: "net1",  typ: "netz",     praefix: "192.168.1.", mindestens: 2, punkte: 2,
        text: "Schritt 2: Zwei Geräte im Netz 192.168.1.x" },
      { id: "rip0",  typ: "ip",       ip: "192.168.0.1", punkte: 1,
        text: "Schritt 3: Router hat die IP 192.168.0.1" },
      { id: "rip1",  typ: "ip",       ip: "192.168.1.1", punkte: 1,
        text: "Schritt 3: Router hat die IP 192.168.1.1" },
      { id: "gw0",   typ: "gateway",  praefix: "192.168.0.", gateway: "192.168.0.1", punkte: 2,
        text: "Schritt 4: Alle Geräte im Netz 0 haben Gateway 192.168.0.1" },
      { id: "gw1",   typ: "gateway",  praefix: "192.168.1.", gateway: "192.168.1.1", punkte: 2,
        text: "Schritt 4: Alle Geräte im Netz 1 haben Gateway 192.168.1.1" },
      { id: "web",   typ: "software", name: "WebServer", punkte: 2,
        text: "Schritt 5: Webserver auf Server 0.12 installiert" }
    ]
  }
};

const TESTS = {
  [inf9FiliusPruefung1.id]: inf9FiliusPruefung1
};

module.exports = { TESTS };
