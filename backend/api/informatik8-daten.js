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
 *                     expected: Musterloesung, kriterien: Punkteverteilung fuer die KI,
 *                     keywords: Notfall ohne KI
 *
 * Aufbau (Absprache mit der Lehrkraft, 29.09.2026): Die Probe ist bewusst
 * einfach und fragt fast woertlich ab, was in den sechs Modulen geuebt wurde.
 *   Modul 1-6    je 4 Aufgaben = je 6 Punkte   36 Punkte
 *                (2x Anklicken, 1x Zuordnen mit 2 Zeilen, 1x Erklaeren)
 *   Transfer     2 neue Situationen           4 Punkte
 *   gesamt       26 Aufgaben                   40 Punkte
 *
 * Note 1 gibt es ab 35 Punkten. Wer ein ganzes Modul nicht kann (6 Punkte),
 * kommt hoechstens auf 34 Punkte und damit nicht mehr auf die Note 1.
 *
 * Notenschluessel: 50 Prozent sind Note 3 (siehe GRADE_SCALE unten).
 *   Punkte: 1 = 35-40, 2 = 29-34, 3 = 20-28, 4 = 15-19, 5 = 8-14, 6 = 0-7
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
  "Bewerte SEHR WOHLWOLLEND. Die Probe ist bewusst einfach gehalten.",
  "Bewerte AUSSCHLIESSLICH, ob die Antwort inhaltlich sinnvoll und fachlich richtig ist.",
  "Rechtschreibung, Grammatik, Zeichensetzung und Ausdruck sind voellig egal.",
  "Umgangssprache, Stichworte und eigene Worte sind ausdruecklich erlaubt.",
  "Fachbegriffe muessen NICHT genannt werden, wenn die Sache richtig beschrieben ist.",
  "Wenn die Antwort im Kern stimmt, gib die volle Punktzahl.",
  "Die Musterloesung ist nur ein Beispiel: Jede andere fachlich richtige Antwort zaehlt genauso.",
  "Wenn die Lehrkraft eine Punkteverteilung angibt, halte dich daran.",
  "Eine zusaetzliche ungenaue Nebenbemerkung zieht keine Punkte ab, solange das Richtige erkennbar ist.",
  "Im Zweifel entscheide zugunsten der Schuelerin oder des Schuelers.",
  "Die Schueler sind 13 bis 14 Jahre alt - erwarte keine perfekten Formulierungen.",
  "Eine unvollstaendige, aber richtige Antwort bekommt Teilpunkte.",
  "0 Punkte nur, wenn die Antwort leer, falsch oder themenfremd ist.",
  "Die Rueckmeldung ist freundlich und direkt an die Schuelerin oder den Schueler gerichtet (per du)."
].join("\n");

const M1 = "Modul 1 · Was sind Rechnernetze?";
const M2 = "Modul 2 · Kommunikation in Rechnernetzen";
const M3 = "Modul 3 · Digitale Informationssysteme";
const M4 = "Modul 4 · Aufbau von Webseiten und Apps";
const M5 = "Modul 5 · Datenschutz und Cookies";
const M6 = "Modul 6 · Lernbilanz: Fachbegriffe anwenden";
const TR = "Transfer · Wende dein Wissen an";

const inf8Probe1 = {
  id: "inf8-probe1",
  title: "Probe Digitaler Informationsaustausch",
  unit: "Informatik 8 · Module 1 bis 6 und Transfer",
  classLevel: "8",
  items: [

    /* ================= Modul 1: Rechnernetze ================= */
    {
      teil: M1,
      type: "choice",
      prompt: "Wann entsteht ein Rechnernetz?",
      options: [
        "Wenn mehrere digitale Geräte so verbunden sind, dass sie Daten austauschen können.",
        "Wenn viele Computer im selben Raum stehen.",
        "Wenn ein Computer eingeschaltet ist.",
        "Wenn ein Drucker genug Papier hat."
      ],
      answer: 0,
      points: 1
    },
    {
      teil: M1,
      type: "choice",
      prompt: "Welche Aufgabe hat der Router zu Hause?",
      options: [
        "Er druckt Dateien aus.",
        "Er verbindet die Geräte und leitet die Daten ins Internet weiter.",
        "Er speichert alle Fotos der Familie.",
        "Er lädt die Akkus der Handys auf."
      ],
      answer: 1,
      points: 1
    },
    {
      teil: M1,
      type: "match",
      prompt: "Kabel oder Funk? Ordne zu.",
      options: ["LAN (Kabel)", "WLAN (Funk)"],
      rows: [
        { text: "Der Schulcomputer steckt mit einem Netzwerkkabel in der Wanddose.", answer: 0 },
        { text: "Dein Handy ist zu Hause im Netz, ohne dass ein Kabel steckt.", answer: 1 }
      ]
    },
    {
      teil: M1,
      type: "text",
      prompt: "Nenne zwei Dienste, die man über ein Rechnernetz nutzen kann.",
      expected: "Zum Beispiel Drucken, Dateien speichern (Cloud, Schulserver), E-Mails versenden, Webseiten anzeigen, die Lernplattform nutzen, Videos schauen oder chatten.",
      kriterien: "Je passender Dienst 1 Punkt (höchstens 2). Auch Beispiele wie „Videos streamen“, „WhatsApp“, „online spielen“ oder „im Internet suchen“ zählen.",
      keywords: ["druck", "speicher", "cloud", "mail", "webseite", "internet", "lernplattform", "video", "chat", "spiel", "such"],
      points: 2,
      lines: 2
    },

    /* ================= Modul 2: Kommunikation ================= */
    {
      teil: M2,
      type: "choice",
      prompt: "Wie nennt man die Regeln für den Datenaustausch in Netzen?",
      options: ["Router", "Peers", "Protokolle", "Cookies"],
      answer: 2,
      points: 1
    },
    {
      teil: M2,
      type: "choice",
      prompt: "Was ist typisch für ein Peer-to-Peer-Netz?",
      options: [
        "Ein zentraler Server verwaltet alles.",
        "Es funktioniert nur mit Kabel.",
        "Nur ein einziges Gerät darf Daten senden.",
        "Die Geräte sind gleichberechtigt und können Daten anbieten und anfordern."
      ],
      answer: 3,
      points: 1
    },
    {
      teil: M2,
      type: "match",
      prompt: "Client oder Server? Ordne zu.",
      options: ["Client", "Server"],
      rows: [
        { text: "der Browser auf deinem Laptop", answer: 0 },
        { text: "der Rechner, auf dem die Lernplattform läuft", answer: 1 }
      ]
    },
    {
      teil: M2,
      type: "text",
      prompt: "Du rufst eine Webseite auf. Erkläre mit den Wörtern Anfrage und Antwort, was passiert.",
      expected: "Mein Gerät (der Browser) schickt eine Anfrage an den Webserver. Der Server verarbeitet die Anfrage und schickt die Daten der Webseite als Antwort zurück. Dann wird die Seite angezeigt.",
      kriterien: "1 Punkt: Mein Gerät / der Browser schickt eine Anfrage (fragt die Seite an). 1 Punkt: Der Server (oder „die Webseite“, „das Internet“) schickt die Seite / die Daten als Antwort zurück.",
      keywords: ["anfrage", "antwort", "server", "zurück", "schick"],
      points: 2,
      lines: 3
    },

    /* ================= Modul 3: Informationssysteme ================= */
    {
      teil: M3,
      type: "choice",
      prompt: "Welches Beispiel ist ein digitales Informationssystem?",
      options: [
        "eine Fahrplan-App",
        "ein Papierfahrplan an der Bushaltestelle",
        "ein Wörterbuch aus Papier",
        "eine Kreidetafel"
      ],
      answer: 0,
      points: 1
    },
    {
      teil: M3,
      type: "choice",
      prompt: "Welche Frage gehört zu den vier Fragen, mit denen man ein Informationssystem beurteilt?",
      options: [
        "Welche Farbe hat das Logo?",
        "Welchen Nutzen ziehe ich daraus?",
        "Wie viele Likes hat die App?",
        "Wie schwer ist das Tablet?"
      ],
      answer: 1,
      points: 1
    },
    {
      teil: M3,
      type: "match",
      prompt: "Nutzen oder Grenze eines Informationssystems? Ordne zu.",
      options: ["Nutzen", "Grenze"],
      rows: [
        { text: "Es spart Zeit, weil Informationen schnell verfügbar sind.", answer: 0 },
        { text: "Informationen können falsch oder veraltet sein.", answer: 1 }
      ]
    },
    {
      teil: M3,
      type: "text",
      prompt: "Luca findet in einer App einen Text für seine Hausaufgabe. Warum sollte er den Text prüfen, bevor er ihn übernimmt?",
      expected: "Weil nicht jede Information aus einem System richtig, aktuell oder passend ist. Der Text könnte falsch oder veraltet sein.",
      kriterien: "2 Punkte: Er nennt einen Grund, z. B. der Text kann falsch, veraltet, unpassend oder nicht vertrauenswürdig sein. 1 Punkt: Er sagt nur, dass man prüfen oder vergleichen soll, ohne Grund.",
      keywords: ["falsch", "veraltet", "aktuell", "stimmt", "richtig", "passend", "prüf", "vertrau"],
      points: 2,
      lines: 2
    },

    /* ================= Modul 4: Aufbau von Webseiten ================= */
    {
      teil: M4,
      type: "choice",
      prompt: "Wo findest du auf einer deutschen Webseite die Angaben zum Anbieter?",
      options: ["im Cookie-Banner", "im Impressum", "in der Suchleiste", "im Browserverlauf"],
      answer: 1,
      points: 1
    },
    {
      teil: M4,
      type: "choice",
      prompt: "Was zeigt dir das Menü einer Webseite oder App?",
      options: [
        "wie viel Akku dein Handy hat",
        "wer die Seite gerade besucht",
        "welche Cookies gespeichert sind",
        "welche Hauptbereiche das System anbietet"
      ],
      answer: 3,
      points: 1
    },
    {
      teil: M4,
      type: "match",
      prompt: "Wo steht das meistens auf einer Webseite? Ordne zu. Ein Bereich bleibt übrig.",
      options: ["Kopfbereich", "Inhaltsbereich", "Fußzeile"],
      rows: [
        { text: "das Logo der Schule", answer: 0 },
        { text: "der Link zum Impressum und zur Datenschutzerklärung", answer: 2 }
      ]
    },
    {
      teil: M4,
      type: "text",
      prompt: "Eine Seite verlangt für ein Gewinnspiel deine Adresse und Handynummer. Ein Impressum gibt es nicht. Was tust du? Begründe.",
      expected: "Ich gebe nichts ein und frage eine Lehrkraft oder meine Eltern. Es ist nicht zu erkennen, wer hinter der Seite steht, und es werden zu viele persönliche Daten verlangt. Das sind Warnzeichen.",
      kriterien: "1 Punkt: eine vernünftige Handlung (nichts eingeben, Seite verlassen/schließen, Erwachsene fragen). 1 Punkt: eine Begründung (kein Impressum, Anbieter unbekannt, zu viele persönliche Daten, wirkt unseriös, Betrug möglich).",
      keywords: ["nicht", "nichts", "eingeben", "impressum", "anbieter", "daten", "unseriös", "betrug", "fragen", "lehr", "eltern"],
      points: 2,
      lines: 3
    },

    /* ================= Modul 5: Datenschutz und Cookies ================= */
    {
      teil: M5,
      type: "choice",
      prompt: "Was ist eine Datenspur?",
      options: [
        "ein Kratzer auf dem Bildschirm",
        "ein Kabel zwischen zwei Geräten",
        "eine Information, die beim Nutzen digitaler Dienste entsteht",
        "eine Regel für den Datenaustausch"
      ],
      answer: 2,
      points: 1
    },
    {
      teil: M5,
      type: "choice",
      prompt: "Ein Cookie-Banner hat einen großen Knopf „Alles akzeptieren“ und einen kleinen Link „Einstellungen“. Was ist klug?",
      options: [
        "Sofort auf „Alles akzeptieren“ tippen, dann ist das Banner weg.",
        "In den Einstellungen die nicht notwendigen Cookies ablehnen.",
        "Die Seite so lange neu laden, bis das Banner verschwindet.",
        "Das Handy neu starten."
      ],
      answer: 1,
      points: 1
    },
    {
      teil: M5,
      type: "match",
      prompt: "Wofür wird der Cookie genutzt? Ordne zu.",
      options: ["technisch nötig", "zum Messen oder für Werbung"],
      rows: [
        { text: "Der Warenkorb im Online-Shop merkt sich deine Einkäufe.", answer: 0 },
        { text: "Dir wird Werbung für Schuhe gezeigt, die du dir vorher angesehen hast.", answer: 1 }
      ]
    },
    {
      teil: M5,
      type: "text",
      prompt: "Nenne zwei Dinge, mit denen du deine Privatsphäre im Netz schützen kannst.",
      expected: "Zum Beispiel: nur nötige Daten angeben, starke Passwörter nutzen, Privatsphäre-Einstellungen prüfen, Cookie-Banner nicht blind wegklicken, Standort nicht teilen, vorsichtig mit Fotos und Klassenchats sein.",
      kriterien: "Je sinnvolle Maßnahme 1 Punkt (höchstens 2). Alles, was persönliche Daten schützt, zählt, z. B. Profil auf privat stellen, keine Adresse posten, nicht notwendige Cookies ablehnen.",
      keywords: ["passwort", "einstellung", "privat", "cookie", "standort", "foto", "daten", "adresse", "nummer", "ablehnen"],
      points: 2,
      lines: 2
    },

    /* ================= Modul 6: Lernbilanz ================= */
    {
      teil: M6,
      type: "choice",
      prompt: "Zu welchem Bereich gehört: „Nicht notwendige Cookies ablehnen“?",
      options: ["Rechnernetze", "Informationssysteme", "Datenschutz"],
      answer: 2,
      points: 1
    },
    {
      teil: M6,
      type: "choice",
      prompt: "Welche Aussage stimmt?",
      options: [
        "Ein Browser ist ein Server.",
        "Protokolle sind besondere Kabel.",
        "Peer bedeutet dasselbe wie Server.",
        "Die Lernplattform ist ein digitales Informationssystem."
      ],
      answer: 3,
      points: 1
    },
    {
      teil: M6,
      type: "match",
      prompt: "Welcher Fachbegriff passt zur Situation? Ordne zu. Einige Begriffe bleiben übrig.",
      options: ["Informationssystem", "Datenspur", "personenbezogene Daten", "Cookie", "Navigation"],
      rows: [
        { text: "Über das Menü kommst du zur Unterseite „Sportfest“.", answer: 4 },
        { text: "dein Name, deine Klasse und dein Foto", answer: 2 }
      ]
    },
    {
      teil: M6,
      type: "text",
      prompt: "Wähle einen Begriff: Router, Server, Impressum oder Cookie. Erkläre ihn und nenne ein Beispiel aus deinem Alltag.",
      expected: "Beispiel Router: Der Router leitet Daten zwischen Netzen weiter. Bei uns zu Hause verbindet er Handy, Laptop und Fernseher mit dem Internet.",
      kriterien: "1 Punkt: Der gewählte Begriff ist richtig erklärt (Router leitet Daten zwischen Netzen/ins Internet weiter; Server stellt einen Dienst bereit und antwortet; Impressum nennt den Anbieter mit Kontakt; Cookie sind kleine Daten, die eine Webseite im Browser speichert). 1 Punkt: ein passendes Beispiel aus dem Alltag.",
      keywords: ["router", "server", "impressum", "cookie", "internet", "anbieter", "browser", "weiter", "dienst", "zuhause", "zu hause"],
      points: 2,
      lines: 3
    },

    /* ================= Transfer: neue Situationen ================= */
    {
      teil: TR,
      type: "text",
      prompt: "Bei einem beliebten Online-Spiel können am Abend plötzlich tausende Spielerinnen und Spieler nicht mehr spielen, obwohl ihr eigenes Internet funktioniert. Erkläre mit dem Client-Server-Modell, woran das liegen könnte.",
      expected: "Wahrscheinlich ist der Server des Spiels ausgefallen oder überlastet. Alle Spieler sind Clients und schicken ihre Anfragen an denselben zentralen Server. Fällt er aus, ist das Spiel für alle gleichzeitig nicht erreichbar.",
      kriterien: "1 Punkt: Der Server des Spiels ist ausgefallen, gestört, überlastet oder wird gewartet. 1 Punkt: Begründung, warum so viele gleichzeitig betroffen sind: Alle Spieler (Clients) hängen vom selben zentralen Server ab.",
      keywords: ["server", "ausgefallen", "ausfall", "überlast", "kaputt", "alle", "zentral", "client"],
      points: 2,
      lines: 3
    },
    {
      teil: TR,
      type: "text",
      prompt: "Eine kostenlose Taschenlampen-App will Zugriff auf deinen Standort, deine Kontakte und deine Fotos. Wie entscheidest du dich? Begründe mit dem, was du über Datenschutz gelernt hast.",
      expected: "Ich erlaube das nicht oder installiere die App nicht. Eine Taschenlampe braucht diese Daten nicht. Standort, Kontakte und Fotos sind personenbezogene Daten; zusammen verraten sie viel über mich und könnten weitergegeben oder für Werbung genutzt werden.",
      kriterien: "1 Punkt: eine sinnvolle Entscheidung (Zugriff ablehnen, App nicht installieren/löschen, eine andere App nehmen). 1 Punkt: eine Begründung (die App braucht die Daten nicht, persönliche/personenbezogene Daten, Datenspuren, Privatsphäre, Weitergabe oder Werbung).",
      keywords: ["ablehnen", "nicht", "braucht", "daten", "privat", "standort", "kontakt", "werbung", "weiter", "löschen"],
      points: 2,
      lines: 3
    }
  ]
};

// Notfall ohne KI: zwei passende Stichwoerter reichen fuer volle Punkte (wohlwollend,
// die Abgabe wird der Lehrkraft trotzdem zur Pruefung markiert).
inf8Probe1.items.forEach((it) => { if (it.type === "text") it.keywordsVoll = 2; });

const TESTS = {
  [inf8Probe1.id]: inf8Probe1
};

module.exports = { TESTS, GRADE_SCALE, KI_REGELN };
