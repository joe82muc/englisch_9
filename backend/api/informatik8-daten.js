"use strict";

/**
 * Probe "Digitaler Informationsaustausch" fuer Informatik 8 (8M und 8R).
 *
 * Diese Datei bleibt auf dem Server: Sie enthaelt die Loesungen.
 * Die Routen kommen aus infoaustausch.js und laufen unter /api/informatik8.
 *
 * Aufgabentypen
 * -------------
 *   type: "choice" -> Anklicken, answer = Index der richtigen Option
 *   type: "match"  -> Zuordnen, jede Zeile waehlt eine Option (1 Punkt je Zeile)
 *   type: "text"   -> Freier Text, die KI prueft den Inhalt (wohlwollend)
 *                     expected: Musterloesung, keywords: Notfall ohne KI
 *
 * Aufbau: 40 Punkte, orientiert an den Aufgaben der sechs Stunden
 *   Teil A  Aufgabe  1-12  Anklicken               12 Punkte
 *   Teil B  Aufgabe 13-15  Zuordnen                12 Punkte
 *   Teil C  Aufgabe 16-23  Erklaeren (KI prueft)   16 Punkte
 *
 * Notenschluessel: 50 Prozent sind Note 3 (siehe GRADE_SCALE unten).
 */

const GRADE_SCALE = [
  { grade: 1, min: 87 },
  { grade: 2, min: 73 },
  { grade: 3, min: 50 },
  { grade: 4, min: 37 },
  { grade: 5, min: 20 },
  { grade: 6, min: 0 }
];

const KI_REGELN = [
  "Du korrigierst Informatik-Aufgaben einer 8. Klasse an einer bayerischen Mittelschule.",
  "Thema: Digitaler Informationsaustausch (Rechnernetze, Dienste, Router, LAN und WLAN,",
  "Internet, Protokolle, Anfrage-Antwort-Prinzip, Peer-to-Peer, Client-Server, digitale",
  "Informationssysteme, Nutzen und Grenzen, vier Fragen zur Beurteilung, Aufbau von",
  "Webseiten und Apps, Menue, Navigation, Impressum, Datenschutzerklaerung, Datenspuren,",
  "Cookies, personenbezogene Daten, Privatsphaere).",
  "",
  "Bewerte AUSSCHLIESSLICH, ob die Antwort inhaltlich sinnvoll und fachlich richtig ist.",
  "Rechtschreibung, Grammatik, Zeichensetzung und Ausdruck sind voellig egal.",
  "Umgangssprache, Stichworte und eigene Worte sind ausdruecklich erlaubt.",
  "Fachbegriffe muessen NICHT genannt werden, wenn die Sache richtig beschrieben ist.",
  "Bewerte wohlwollend: Im Zweifel entscheide zugunsten der Schuelerin oder des Schuelers.",
  "Die Schueler sind 13 bis 14 Jahre alt - erwarte keine perfekten Formulierungen.",
  "Eine unvollstaendige, aber richtige Antwort bekommt Teilpunkte.",
  "Falsche oder themenfremde Aussagen bekommen 0 Punkte."
].join("\n");

const inf8Probe1 = {
  id: "inf8-probe1",
  title: "Probe Digitaler Informationsaustausch",
  unit: "Informatik 8 · Rechnernetze, Informationssysteme, Datenschutz",
  classLevel: "8",
  items: [

    /* ================= Teil A: Anklicken ================= */

    {
      type: "choice",
      prompt: "Was beschreibt ein Rechnernetz am besten?",
      options: [
        "Mehrere digitale Geräte, die so verbunden sind, dass sie Daten austauschen können",
        "Viele Computer, die im selben Raum stehen",
        "Ein einzelner Computer mit sehr großem Bildschirm",
        "Ein Drucker mit vielen Papierfächern"
      ],
      answer: 0,
      points: 1
    },
    {
      type: "choice",
      prompt: "Welche Aufgabe hat ein Router?",
      options: [
        "Er druckt Dateien aus.",
        "Er leitet Daten zwischen Netzen weiter, zum Beispiel zwischen Heimnetz und Internet.",
        "Er speichert alle Passwörter der Klasse.",
        "Er ist das Programm, mit dem man Webseiten anschaut."
      ],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Was ist ein Protokoll?",
      options: [
        "ein Netzwerkkabel",
        "ein gleichberechtigtes Gerät im Netz",
        "eine Regel, wie Geräte im Netz Daten austauschen",
        "eine Webseite mit Angaben zum Anbieter"
      ],
      answer: 2,
      points: 1
    },
    {
      type: "choice",
      prompt: "Was ist typisch für ein Peer-to-Peer-Netz?",
      options: [
        "Ein zentraler Server verwaltet alles.",
        "Nur ein einziges Gerät darf Daten senden.",
        "Es funktioniert nur mit Kabel.",
        "Die Geräte sind gleichberechtigt und können Daten anbieten und anfordern."
      ],
      answer: 3,
      points: 1
    },
    {
      type: "choice",
      prompt: "Der Server der Lernplattform ist ausgefallen. Was bedeutet das?",
      options: [
        "Der Dienst ist für viele Nutzerinnen und Nutzer gleichzeitig nicht erreichbar.",
        "Nur ein einziges Tablet ist betroffen.",
        "Die Clients übernehmen automatisch die Aufgaben des Servers.",
        "Das hat keine Folgen, weil Server nie gebraucht werden."
      ],
      answer: 0,
      points: 1
    },
    {
      type: "choice",
      prompt: "Welches Beispiel ist ein digitales Informationssystem?",
      options: [
        "ein Papierfahrplan an der Bushaltestelle",
        "eine Fahrplan-App",
        "ein gedrucktes Wörterbuch",
        "eine Kreidetafel"
      ],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Was arbeitet im Hintergrund eines digitalen Informationssystems zusammen?",
      options: [
        "nur der Bildschirm",
        "Tastatur und Maus",
        "Programme, Datenbanken, Server und Netze",
        "Drucker und Papier"
      ],
      answer: 2,
      points: 1
    },
    {
      type: "choice",
      prompt: "Welche Frage gehört zu den vier Fragen, mit denen man ein Informationssystem beurteilt?",
      options: [
        "Welche Farbe hat das Logo?",
        "Wie schwer ist das Tablet?",
        "Wie viele Likes hat die App?",
        "Welche Informationen sind über das System bekannt?"
      ],
      answer: 3,
      points: 1
    },
    {
      type: "choice",
      prompt: "Wo findest du auf einer deutschen Webseite die Angaben zum Anbieter?",
      options: [
        "im Impressum",
        "im Cookie-Banner",
        "in der Suchleiste",
        "im Browserverlauf"
      ],
      answer: 0,
      points: 1
    },
    {
      type: "choice",
      prompt: "Welche Beobachtung ist ein Warnzeichen bei einer Webseite?",
      options: [
        "Es gibt ein Impressum mit Adresse und Telefonnummer.",
        "Das Menü ist übersichtlich.",
        "Kein Anbieter ist zu finden, aber es werden viele persönliche Daten abgefragt.",
        "Es gibt eine verständliche Datenschutzerklärung."
      ],
      answer: 2,
      points: 1
    },
    {
      type: "choice",
      prompt: "Was ist eine Datenspur?",
      options: [
        "ein Kratzer auf dem Bildschirm",
        "eine Information, die beim Nutzen digitaler Dienste entsteht",
        "ein Kabel zwischen zwei Geräten",
        "eine Regel für den Datenaustausch"
      ],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Ein Cookie-Banner hat einen großen Knopf „Alles akzeptieren“ und einen kleinen Link „Einstellungen“. Was ist klug?",
      options: [
        "Sofort auf „Alles akzeptieren“ tippen, dann ist das Banner weg.",
        "Die Seite so lange neu laden, bis das Banner verschwindet.",
        "Den Browser neu installieren.",
        "In den Einstellungen die nicht notwendigen Cookies ablehnen."
      ],
      answer: 3,
      points: 1
    },

    /* ================= Teil B: Zuordnen ================= */

    {
      type: "match",
      prompt: "Ordne jeder Erklärung den passenden Fachbegriff zu. Ein Begriff bleibt übrig.",
      options: ["Client", "Server", "Dienst", "Internet", "Navigation", "Router"],
      rows: [
        { text: "Gerät oder Programm, das eine Anfrage stellt", answer: 0 },
        { text: "stellt einen Dienst bereit und antwortet auf Anfragen", answer: 1 },
        { text: "Aufgabe, die ein Gerät oder Programm für andere erledigt, zum Beispiel Drucken", answer: 2 },
        { text: "weltweites Netz aus sehr vielen verbundenen Netzen", answer: 3 },
        { text: "Wegführung durch eine Webseite oder App", answer: 4 }
      ]
    },
    {
      type: "match",
      prompt: "Client oder Server? Ordne zu.",
      options: ["Client", "Server"],
      rows: [
        { text: "der Browser auf deinem Laptop", answer: 0 },
        { text: "der Rechner, auf dem die Lernplattform läuft", answer: 1 },
        { text: "die Wetter-App auf deinem Handy, die nach dem Wetter fragt", answer: 0 },
        { text: "der Rechner, der die Webseite der Schule ausliefert", answer: 1 }
      ]
    },
    {
      type: "match",
      prompt: "Wofür wird der Cookie genutzt? Ordne zu.",
      options: ["technisch nötig", "zum Messen oder für Werbung"],
      rows: [
        { text: "Der Warenkorb im Online-Shop merkt sich deine Einkäufe.", answer: 0 },
        { text: "Dir wird Werbung für Schuhe gezeigt, die du dir vorher angesehen hast.", answer: 1 },
        { text: "Du bleibst angemeldet, wenn du auf eine andere Unterseite wechselst.", answer: 0 }
      ]
    },

    /* ================= Teil C: Erklaeren (KI prueft) ================= */

    {
      type: "text",
      prompt: "Nenne zwei Dienste, die man über ein Rechnernetz nutzen kann. Erkläre bei einem, was er für dich erledigt.",
      expected: "Zum Beispiel Drucken, Dateien speichern (Cloud, Schulserver), E-Mail, Webseiten anzeigen, Lernplattform. Beim Drucken schickt mein Gerät die Datei über das Netz an den Drucker, der sie für mich ausdruckt.",
      keywords: ["drucken", "speicher", "cloud", "mail", "webseite", "lernplattform"],
      points: 2,
      lines: 3
    },
    {
      type: "text",
      prompt: "Erkläre das Anfrage-Antwort-Prinzip am Beispiel einer Webseite.",
      expected: "Mein Browser (Client) schickt eine Anfrage an den Webserver. Der Server verarbeitet die Anfrage und schickt die Daten der Webseite als Antwort zurück. Der Browser zeigt die Seite an.",
      keywords: ["anfrage", "antwort", "server", "browser"],
      points: 2,
      lines: 3
    },
    {
      type: "text",
      prompt: "Nenne je einen Vorteil und einen Nachteil des Client-Server-Modells.",
      expected: "Vorteil: übersichtlich, weil die Dienste zentral an einer Stelle bereitgestellt werden. Nachteil: Fällt der Server aus, ist der Dienst für viele Nutzer gleichzeitig nicht erreichbar.",
      keywords: ["zentral", "übersicht", "ausf", "nicht erreichbar"],
      points: 2,
      lines: 3
    },
    {
      type: "text",
      prompt: "Nenne einen Nutzen und eine Grenze eines digitalen Informationssystems, zum Beispiel einer Suchmaschine oder Lernplattform.",
      expected: "Nutzen: Es spart Zeit, macht Informationen schnell verfügbar und durchsucht große Datenmengen. Grenze: Nicht jede Information ist richtig, aktuell oder passend; manche Systeme sammeln viele Daten über die Nutzer.",
      keywords: ["zeit", "schnell", "falsch", "aktuell", "daten"],
      points: 2,
      lines: 3
    },
    {
      type: "text",
      prompt: "Warum lohnt sich bei einer unbekannten Webseite ein Blick ins Impressum und in die Datenschutzerklärung?",
      expected: "Im Impressum sehe ich, wer hinter der Seite steht und wie ich den Anbieter erreiche. Die Datenschutzerklärung sagt, welche persönlichen Daten verarbeitet werden. So kann ich einschätzen, ob die Seite vertrauenswürdig ist.",
      keywords: ["anbieter", "wer", "daten", "kontakt", "vertrau", "seriös"],
      points: 2,
      lines: 3
    },
    {
      type: "text",
      prompt: "Erkläre, was Datenspuren sind und warum sie zusammengesetzt viel über eine Person verraten können.",
      expected: "Datenspuren entstehen beim Suchen, Klicken, Anmelden, Posten oder Nutzen von Apps, teils automatisch (Uhrzeit, Standort, Gerät). Einzeln wirken sie harmlos, zusammengesetzt verraten sie Interessen, Gewohnheiten, Aufenthaltsorte und Kontakte.",
      keywords: ["entsteh", "such", "klick", "standort", "interesse", "gewohnheit", "zusammen"],
      points: 2,
      lines: 3
    },
    {
      type: "text",
      prompt: "Erkläre den Unterschied zwischen einem technisch nötigen Cookie und einem Cookie für Werbung. Nenne je ein Beispiel.",
      expected: "Ein technisch nötiger Cookie sorgt dafür, dass die Seite funktioniert, zum Beispiel beim Warenkorb oder bei der Anmeldung. Ein Werbe-Cookie misst mein Verhalten, damit mir passende Werbung gezeigt wird.",
      keywords: ["warenkorb", "anmeld", "funktion", "werbung", "mess", "verhalten"],
      points: 2,
      lines: 3
    },
    {
      type: "text",
      prompt: "Nenne drei Dinge, mit denen du deine Privatsphäre im Netz schützen kannst.",
      expected: "Nur nötige Daten angeben, starke Passwörter nutzen, Privatsphäre-Einstellungen prüfen, Cookie-Banner nicht blind wegklicken, vorsichtig mit Fotos, Standort und Klassenchats sein.",
      keywords: ["passwort", "einstellung", "cookie", "standort", "foto", "daten"],
      points: 2,
      lines: 3
    }
  ]
};

const TESTS = {
  [inf8Probe1.id]: inf8Probe1
};

module.exports = { TESTS, GRADE_SCALE, KI_REGELN };
