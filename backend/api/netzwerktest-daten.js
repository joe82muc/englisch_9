"use strict";

/**
 * Testdefinitionen fuer die Netzwerke-Probe (Informatik 9).
 *
 * Diese Datei bleibt bewusst auf dem Server: Sie enthaelt die Loesungen.
 * An den Browser gehen ueber /api/netzwerktest/start nur die Aufgaben,
 * niemals das Feld "answer", "solutions" oder "expected".
 *
 * Aufgabentypen
 * -------------
 *   type: "choice" -> Anklicken, genau eine Antwort ist richtig
 *                     options: Auswahltexte, answer: Index der richtigen Option
 *   type: "text"   -> Freier Text, wird von der KI auf Sinnhaftigkeit geprueft
 *                     expected: Musterloesung (nur fuer KI + Lehrkraft)
 *                     keywords: Begriffe, die eine Antwort inhaltlich tragen
 *                               (Fallback, falls die KI nicht erreichbar ist)
 *
 * Bilder
 * ------
 * image verweist relativ auf den Ordner der Uebungsseite. Es werden bewusst
 * nur Bilder verwendet, die die Loesung NICHT schon im Titel verraten:
 * dafuer liegen beschriftungsfreie Zuschnitte in bilder/probe/.
 */

/* ==================================================================
   Informatik 9 - Netzwerke - Probe 1
   Passend zur Praesentation "Netzwerke verstehen" (6 Stunden)
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
        "Mindestens zwei Geraete, die Daten austauschen.",
        "Ein Programm zum Schreiben von Texten.",
        "Ein Kabel zwischen Drucker und Steckdose."
      ],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Eine Firma verbindet ihre Bueros in Muenchen und Hamburg. Welche Netzwerkart ist das?",
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
      imageAlt: "Drei Computer und ein Drucker haengen an einem gemeinsamen durchgehenden Kabel.",
      options: ["Ring", "Bus", "Stern", "Vermascht"],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Welche Topologie zeigt dieses Bild?",
      image: "bilder/probe/p-stern.png",
      imageAlt: "Drei Computer und ein Drucker sind einzeln an ein zentrales Geraet angeschlossen.",
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
      imageAlt: "Sternfoermiges Netz, bei dem die Leitung eines Computers zum zentralen Geraet unterbrochen ist.",
      options: [
        "Das ganze Netzwerk faellt aus.",
        "Nur dieser eine Computer hat keine Verbindung mehr.",
        "Alle Geraete hinter der Bruchstelle fallen aus.",
        "Die Daten nehmen automatisch den Rueckweg."
      ],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Welches Geraet leitet Daten gezielt an den richtigen Port weiter?",
      options: ["Repeater", "Hub", "Bridge", "Switch"],
      answer: 3,
      points: 1
    },
    {
      type: "choice",
      prompt: "Welches Geraet sendet ein Signal an alle angeschlossenen Geraete weiter?",
      options: ["Repeater", "Hub", "Bridge", "Switch"],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Welches Geraet siehst du hier in der Mitte des Netzes?",
      image: "bilder/probe/p-switch.png",
      imageAlt: "Nahaufnahme eines Geraetes mit acht Netzwerkbuchsen, an das mehrere Kabel fuehren.",
      options: ["Ein Router", "Ein Switch", "Ein Drucker", "Ein Server"],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Welche Aufgabe hat eine IP-Adresse?",
      options: [
        "Sie verschluesselt die Daten.",
        "Sie macht ein Geraet im Netzwerk eindeutig erreichbar.",
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
      prompt: "Wandle 192 in eine Binaerzahl um. Welche ist richtig?",
      options: ["11000000", "10000011", "11100000", "10011000"],
      answer: 0,
      points: 1
    },
    {
      type: "choice",
      prompt: "Bei der Netzmaske 255.255.255.0 (/24): Welcher Teil benennt das einzelne Geraet?",
      options: [
        "Der erste Block",
        "Die ersten drei Bloecke",
        "Der letzte Block",
        "Alle vier Bloecke"
      ],
      answer: 2,
      points: 1
    },

    /* ---------- Teil B: Freier Text (KI prueft den Sinn) ---------- */
    {
      type: "text",
      prompt: "Erklaere mit eigenen Worten, was ein Computernetzwerk ist.",
      expected: "Mindestens zwei Geraete sind verbunden und tauschen Daten bzw. Informationen aus, "
        + "zum Beispiel Nachrichten, Dateien oder Druckauftraege.",
      keywords: ["verbunden", "daten", "austausch", "geraete", "mehrere", "zwei"],
      points: 2,
      lines: 3
    },
    {
      type: "text",
      prompt: "Warum werden Dateien vor dem Verschicken in Pakete zerlegt?",
      expected: "Die Pakete koennen verschiedene Wege nehmen. Faellt ein Weg aus, nutzt das Netzwerk "
        + "einen anderen Weg, dadurch bleibt die Verbindung stabiler. Jedes Paket hat eine Nummer, "
        + "damit die Datei am Ziel wieder richtig zusammengesetzt werden kann.",
      keywords: ["weg", "wege", "ausfall", "stabil", "nummer", "reihenfolge", "zusammensetzen", "stoerung"],
      points: 2,
      lines: 3
    },
    {
      type: "text",
      prompt: "Erklaere den Unterschied zwischen einem Hub und einem Switch.",
      expected: "Der Hub sendet die Daten an alle angeschlossenen Geraete (verteilt blind). "
        + "Der Switch leitet die Daten gezielt nur an das Geraet weiter, fuer das sie bestimmt sind.",
      keywords: ["alle", "blind", "gezielt", "richtige", "empfaenger", "port"],
      points: 2,
      lines: 3
    },
    {
      type: "text",
      prompt: "Im Computerraum stehen 16 PCs und ein Drucker. Welche Topologie waehlst du und warum?",
      expected: "Stern-Topologie: Jedes Geraet hat ein eigenes Kabel zum zentralen Switch. "
        + "Das ist zuverlaessig, leicht zu erweitern, die Fehlersuche ist einfach und ein "
        + "Kabelausfall betrifft nur einen PC.",
      keywords: ["stern", "switch", "eigenes kabel", "erweitern", "fehlersuche", "ein pc", "zuverlaessig"],
      points: 2,
      lines: 4
    },
    {
      type: "text",
      prompt: "Nenne eine Schwachstelle der Stern-Topologie und eine Gegenmassnahme.",
      expected: "Schwachstelle: Der zentrale Switch ist ein Single Point of Failure - faellt er aus, "
        + "ist kein Geraet mehr erreichbar. Gegenmassnahme: einen Ersatz-Switch bereithalten "
        + "bzw. Redundanz einplanen.",
      keywords: ["switch", "zentral", "faellt aus", "ausfall", "ersatz", "redundanz", "alle"],
      points: 2,
      lines: 4
    },
    {
      type: "text",
      prompt: "Der Ping zwischen zwei Rechnern in Filius funktioniert nicht. Beschreibe, wie du den Fehler suchst.",
      expected: "Zuerst Kabel und Switch-Verbindung pruefen. Dann die IP-Adressen vergleichen: "
        + "Sind sie verschieden und im gleichen Netz? Danach die Netzmaske pruefen und erneut testen.",
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
