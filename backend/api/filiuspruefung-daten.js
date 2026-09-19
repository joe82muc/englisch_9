"use strict";

/**
 * Praktische Pruefung zum Filius-Workshop (Informatik 9).
 *
 * Diese Datei bleibt auf dem Server: Sie enthaelt die Loesungen.
 *
 * Teil A: Fragen zum Ankreuzen (type "choice", answer = Index der richtigen Option)
 * Teil B: Abgabe der Filius-Datei. Die Datei wird vom Server ausgelesen und
 *         gegen die Liste "checks" geprueft. Jeder Check ist ein Pflichtpunkt
 *         und wird exakt bewertet - nicht von der KI geschaetzt.
 *
 * Check-Typen (siehe filiuspruefung.js):
 *   geraet     { art, mindestens }            - Anzahl Geraete einer Art
 *   ip         { ip }                          - diese IP existiert im Netz
 *   netz       { praefix, mindestens }         - so viele Geraete im Netz x.y.z.
 *   gateway    { praefix, gateway }            - alle Geraete im Netz haben dieses Gateway
 *   software   { name }                        - diese Software ist installiert
 *   dhcp       { }                             - irgendwo ist DHCP aktiviert
 *   router2    { }                             - Router mit mindestens 2 Schnittstellen
 */

const inf9FiliusPruefung1 = {
  id: "inf9-filius-pruefung1",
  title: "Praktische Pruefung - Filius-Workshop",
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
      prompt: "Mit welchem Befehl pruefst du, ob ein anderer Rechner antwortet?",
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
        "Er schickt genau dieselbe Nachricht zurueck.",
        "Er verteilt IP-Adressen.",
        "Er verbindet zwei Netze."
      ],
      answer: 1, points: 1
    },
    {
      type: "choice",
      prompt: "Welches Geraet verbindet zwei verschiedene Netze miteinander?",
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
        "Die Haustuer des eigenen Netzes.",
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
        "Er uebersetzt Namen in IP-Adressen.",
        "Er verschickt E-Mails."
      ],
      answer: 1, points: 1
    },
    {
      type: "choice",
      prompt: "Welches Geraet bekommt sinnvollerweise eine feste IP statt DHCP?",
      options: ["Ein Gast-Handy", "Ein Schueler-Tablet", "Der Netzwerkdrucker", "Ein Laptop im Lesesaal"],
      answer: 2, points: 1
    },
    {
      type: "choice",
      prompt: "Wozu dient ein DNS-Server?",
      options: [
        "Er uebersetzt Namen wie www.test.de in IP-Adressen.",
        "Er vergibt IP-Adressen.",
        "Er speichert E-Mails.",
        "Er verstaerkt das Signal."
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
      prompt: "Warum kommt eine E-Mail an, obwohl der Empfaenger offline ist?",
      options: [
        "Sie wartet auf deinem Rechner.",
        "Sie liegt beim Mailserver und wird spaeter abgeholt.",
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
        "Eine der IPs ist ungueltig.",
        "Sie koennen sich nie erreichen."
      ],
      answer: 1, points: 1
    },
    {
      type: "choice",
      prompt: "Welche Netzmaske gehoert zu einem 192.168.0.x-Netz mit /24?",
      options: ["255.0.0.0", "255.255.0.0", "255.255.255.0", "255.255.255.255"],
      answer: 2, points: 1
    }
  ],

  /* ---------------- Teil B: Filius-Datei ---------------- */
  upload: {
    aufgabe:
      "Baue in Filius dieses Netz und lade die gespeicherte Datei hoch:\n" +
      "1) Netz 0 mit mindestens drei Geraeten an einem Switch, IPs 192.168.0.x\n" +
      "2) Netz 1 mit mindestens zwei Geraeten an einem zweiten Switch, IPs 192.168.1.x\n" +
      "3) Ein Vermittlungsrechner (Router) verbindet beide Netze (192.168.0.1 / 192.168.1.1)\n" +
      "4) Bei allen Geraeten ist das passende Gateway eingetragen\n" +
      "5) Ein Webserver laeuft auf einem Server im Netz 0",
    checks: [
      { id: "sw",    typ: "geraet",   art: "Switch", mindestens: 2, punkte: 2,
        text: "Mindestens zwei Switches vorhanden" },
      { id: "rt",    typ: "router2",  punkte: 2,
        text: "Vermittlungsrechner mit mindestens zwei Schnittstellen" },
      { id: "net0",  typ: "netz",     praefix: "192.168.0.", mindestens: 3, punkte: 2,
        text: "Mindestens drei Geraete im Netz 192.168.0.x" },
      { id: "net1",  typ: "netz",     praefix: "192.168.1.", mindestens: 2, punkte: 2,
        text: "Mindestens zwei Geraete im Netz 192.168.1.x" },
      { id: "rip0",  typ: "ip",       ip: "192.168.0.1", punkte: 1,
        text: "Router hat die IP 192.168.0.1" },
      { id: "rip1",  typ: "ip",       ip: "192.168.1.1", punkte: 1,
        text: "Router hat die IP 192.168.1.1" },
      { id: "gw0",   typ: "gateway",  praefix: "192.168.0.", gateway: "192.168.0.1", punkte: 2,
        text: "Geraete im Netz 0 haben das Gateway 192.168.0.1" },
      { id: "gw1",   typ: "gateway",  praefix: "192.168.1.", gateway: "192.168.1.1", punkte: 2,
        text: "Geraete im Netz 1 haben das Gateway 192.168.1.1" },
      { id: "web",   typ: "software", name: "WebServer", punkte: 2,
        text: "Ein Webserver ist installiert" }
    ]
  }
};

const TESTS = {
  [inf9FiliusPruefung1.id]: inf9FiliusPruefung1
};

module.exports = { TESTS };
