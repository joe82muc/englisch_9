"use strict";

/**
 * Testdefinitionen für die Netzwerke-Probe (Informatik 9).
 *
 * Diese Datei bleibt bewusst auf dem Server: Sie enthaelt die Lösungen.
 * An den Browser gehen ueber /api/netzwerktest/start nur die Aufgaben,
 * niemals das Feld "answer", "solutions" oder "expected".
 *
 * Aufgabentypen
 * -------------
 *   type: "choice" -> Anklicken, genau eine Antwort ist richtig
 *                     options: Auswahltexte, answer: Index der richtigen Option
 *   type: "text"   -> Freier Text, wird von der KI auf Sinnhaftigkeit geprueft
 *                     expected: Musterloesung (nur für KI + Lehrkraft)
 *                     keywords: Begriffe, die eine Antwort inhaltlich tragen
 *                               (Fallback, falls die KI nicht erreichbar ist)
 *
 * Bilder
 * ------
 * image verweist relativ auf den Ordner der Uebungsseite. Es werden bewusst
 * nur Bilder verwendet, die die Lösung NICHT schon im Titel verraten:
 * dafuer liegen beschriftungsfreie Zuschnitte in bilder/probe/.
 */

/* ==================================================================
   Informatik 9 - Netzwerke - Probe 1
   Passend zur Präsentation "Netzwerke verstehen" (6 Stunden)
   ================================================================== */
const inf9NetzProbe1 = {
  id: "inf9-netz-probe1",
  title: "Probe Netzwerke - Grundlagen bis IP-Adressen",
  unit: "Informatik 9 / Netzwerke",
  classLevel: "9",
  items: [
    /* ---------- Teil A: Anklicken ---------- */
    {
      type: "choice",
      prompt: "Was ist ein Computernetzwerk?",
      options: [
        "Ein einzelner Computer mit mehreren Bildschirmen.",
        "Mindestens zwei Geräte, die Daten austauschen.",
        "Ein Programm zum Schreiben von Texten.",
        "Ein Kabel zwischen Drucker und Steckdose."
      ],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Eine Firma verbindet ihre Büros in München und Hamburg. Welche Netzwerkart ist das?",
      options: ["LAN", "MAN", "WAN", "GAN"],
      answer: 2,
      points: 1
    },
    {
      type: "choice",
      prompt: "Welche Netzwerkart beschreibt das Internet als Netz vieler Netze?",
      options: ["LAN", "MAN", "WAN", "GAN"],
      answer: 3,
      points: 1
    },
    {
      type: "choice",
      prompt: "Welche Topologie zeigt dieses Bild?",
      image: "bilder/probe/p-ring.png",
      imageAlt: "Vier Computer sind in einem Kreis mit einem Kabel verbunden.",
      options: ["Ring", "Bus", "Stern", "Vermascht"],
      answer: 0,
      points: 1
    },
    {
      type: "choice",
      prompt: "Welche Topologie zeigt dieses Bild?",
      image: "bilder/probe/p-bus.png",
      imageAlt: "Drei Computer und ein Drucker hängen an einem gemeinsamen durchgehenden Kabel.",
      options: ["Ring", "Bus", "Stern", "Vermascht"],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Welche Topologie zeigt dieses Bild?",
      image: "bilder/probe/p-stern.png",
      imageAlt: "Drei Computer und ein Drucker sind einzeln an ein zentrales Gerät angeschlossen.",
      options: ["Ring", "Bus", "Stern", "Vermascht"],
      answer: 2,
      points: 1
    },
    {
      type: "choice",
      prompt: "Welche Topologie zeigt dieses Bild?",
      image: "bilder/probe/p-vermascht.png",
      imageAlt: "Vier Computer sind alle direkt untereinander verbunden.",
      options: ["Ring", "Bus", "Stern", "Vermascht"],
      answer: 3,
      points: 1
    },
    {
      type: "choice",
      prompt: "In diesem Netz ist ein Kabel gebrochen (rotes Kreuz). Was passiert?",
      image: "bilder/probe/p-stern-bruch.png",
      imageAlt: "Sternförmiges Netz, bei dem die Leitung eines Computers zum zentralen Gerät unterbrochen ist.",
      options: [
        "Das ganze Netzwerk fällt aus.",
        "Nur dieser eine Computer hat keine Verbindung mehr.",
        "Alle Geräte hinter der Bruchstelle fallen aus.",
        "Die Daten nehmen automatisch den Rückweg."
      ],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Welches Gerät leitet Daten gezielt an den richtigen Port weiter?",
      options: ["Repeater", "Hub", "Bridge", "Switch"],
      answer: 3,
      points: 1
    },
    {
      type: "choice",
      prompt: "Welches Gerät sendet ein Signal an alle angeschlossenen Geräte weiter?",
      options: ["Repeater", "Hub", "Bridge", "Switch"],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Welches Gerät siehst du hier in der Mitte des Netzes?",
      image: "bilder/probe/p-switch.png",
      imageAlt: "Nahaufnahme eines Gerätes mit acht Netzwerkbuchsen, an das mehrere Kabel führen.",
      options: ["Ein Router", "Ein Switch", "Ein Drucker", "Ein Server"],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Welche Aufgabe hat eine IP-Adresse?",
      options: [
        "Sie verschlüsselt die Daten.",
        "Sie macht ein Gerät im Netzwerk eindeutig erreichbar.",
        "Sie misst die Geschwindigkeit der Leitung.",
        "Sie speichert die Dateien des Nutzers."
      ],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Wie viele Stellen (Bit) hat jeder Block einer IPv4-Adresse?",
      options: ["4", "6", "8", "16"],
      answer: 2,
      points: 1
    },
    {
      type: "choice",
      prompt: "Welche Dezimalzahl entspricht 10101000?",
      options: ["148", "168", "172", "188"],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Wandle 192 in eine Binärzahl um. Welche ist richtig?",
      options: ["11000000", "10000011", "11100000", "10011000"],
      answer: 0,
      points: 1
    },
    {
      type: "choice",
      prompt: "Bei der Netzmaske 255.255.255.0 (/24): Welcher Teil benennt das einzelne Gerät?",
      options: [
        "Der erste Block",
        "Die ersten drei Blöcke",
        "Der letzte Block",
        "Alle vier Blöcke"
      ],
      answer: 2,
      points: 1
    },

    /* ---------- Teil B: Freier Text (KI prueft den Sinn) ---------- */
    {
      type: "text",
      prompt: "Erkläre mit eigenen Worten, was ein Computernetzwerk ist.",
      expected: "Mindestens zwei Geräte sind verbunden und tauschen Daten bzw. Informationen aus, "
        + "zum Beispiel Nachrichten, Dateien oder Druckaufträge.",
      keywords: ["verbunden", "daten", "austausch", "geraete", "mehrere", "zwei"],
      points: 2,
      lines: 3
    },
    {
      type: "text",
      prompt: "Warum werden Dateien vor dem Verschicken in Pakete zerlegt?",
      expected: "Die Pakete können verschiedene Wege nehmen. Fällt ein Weg aus, nutzt das Netzwerk "
        + "einen anderen Weg, dadurch bleibt die Verbindung stabiler. Jedes Paket hat eine Nummer, "
        + "damit die Datei am Ziel wieder richtig zusammengesetzt werden kann.",
      keywords: ["weg", "wege", "ausfall", "stabil", "nummer", "reihenfolge", "zusammensetzen", "stoerung"],
      points: 2,
      lines: 3
    },
    {
      type: "text",
      prompt: "Erkläre den Unterschied zwischen einem Hub und einem Switch.",
      expected: "Der Hub sendet die Daten an alle angeschlossenen Geräte (verteilt blind). "
        + "Der Switch leitet die Daten gezielt nur an das Gerät weiter, für das sie bestimmt sind.",
      keywords: ["alle", "blind", "gezielt", "richtige", "empfaenger", "port"],
      points: 2,
      lines: 3
    },
    {
      type: "text",
      prompt: "Im Computerraum stehen 16 PCs und ein Drucker. Welche Topologie wählst du und warum?",
      expected: "Stern-Topologie: Jedes Gerät hat ein eigenes Kabel zum zentralen Switch. "
        + "Das ist zuverlässig, leicht zu erweitern, die Fehlersuche ist einfach und ein "
        + "Kabelausfall betrifft nur einen PC.",
      keywords: ["stern", "switch", "eigenes kabel", "erweitern", "fehlersuche", "ein pc", "zuverlaessig"],
      points: 2,
      lines: 4
    },
    {
      type: "text",
      prompt: "Nenne eine Schwachstelle der Stern-Topologie und eine Gegenmaßnahme.",
      expected: "Schwachstelle: Der zentrale Switch ist ein Single Point of Failure - fällt er aus, "
        + "ist kein Gerät mehr erreichbar. Gegenmaßnahme: einen Ersatz-Switch bereithalten "
        + "bzw. Redundanz einplanen.",
      keywords: ["switch", "zentral", "faellt aus", "ausfall", "ersatz", "redundanz", "alle"],
      points: 2,
      lines: 4
    },
    {
      type: "text",
      prompt: "Der Ping zwischen zwei Rechnern in Filius funktioniert nicht. Beschreibe, wie du den Fehler suchst.",
      expected: "Zuerst Kabel und Switch-Verbindung prüfen. Dann die IP-Adressen vergleichen: "
        + "Sind sie verschieden und im gleichen Netz? Danach die Netzmaske prüfen und erneut testen.",
      keywords: ["kabel", "verbindung", "ip", "adresse", "verschieden", "netzmaske", "testen"],
      points: 2,
      lines: 4
    }
  ]
};

const TESTS = {
  [inf9NetzProbe1.id]: inf9NetzProbe1
};

module.exports = { TESTS };
