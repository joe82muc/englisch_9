"use strict";

/**
 * Testdefinitionen für die Probe "Digitaler Informationsaustausch" (Informatik 7).
 *
 * Diese Datei bleibt bewusst auf dem Server: Sie enthaelt die Lösungen.
 * An den Browser gehen ueber /api/infoaustausch/start nur die Aufgaben,
 * niemals das Feld "answer" oder "expected".
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
 * Notenschluessel: 50 Prozent sind Note 3 (siehe infoaustausch.js).
 *
 * Aufbau der Probe: 40 Punkte
 *   Teil A  Aufgabe  1-16  Anklicken          16 Punkte
 *   Teil B  Aufgabe 17-24  Anklicken (Fälle)   8 Punkte
 *   Teil C  Aufgabe 25-32  Freier Text        16 Punkte
 *
 * Die Probe fragt genau das ab, was in den acht Lernmodulen steht.
 */

const inf7InfoProbe1 = {
  id: "inf7-info-probe1",
  title: "Probe Digitaler Informationsaustausch",
  unit: "Informatik 7 / Lernbereich 1",
  classLevel: "7",
  items: [

    /* ================= Teil A: Grundwissen zum Anklicken ================= */

    {
      type: "choice",
      prompt: "Wofür steht die Abkürzung EDV?",
      options: [
        "einfache Datenverwaltung",
        "elektronische Datenverarbeitung",
        "elektrische Datenverbindung",
        "einheitliche Datenverschlüsselung"
      ],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Wie sitzt du richtig am Computer?",
      options: [
        "Der Bildschirm steht etwa 20 Zentimeter vor dem Gesicht.",
        "Die Füße stehen fest auf dem Boden, der Rücken ist gerade.",
        "Man sitzt möglichst weit vorne auf der Stuhlkante.",
        "Die Sonne sollte direkt auf den Bildschirm scheinen."
      ],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Wie nennt man den Anbieter eines E-Mail-Postfachs?",
      options: ["Server", "Provider", "Browser", "Account"],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Du schickst eine Einladung an 30 Personen, die sich nicht kennen. Niemand soll die Adressen der anderen sehen. Welches Feld benutzt du?",
      options: ["An", "Cc", "Bcc", "Betreff"],
      answer: 2,
      points: 1
    },
    {
      type: "choice",
      prompt: "Wofür steht die Abkürzung Cc bei einer E-Mail?",
      options: [
        "carbon copy, also eine Kopie, die alle sehen",
        "clean copy, also eine fehlerfreie Fassung",
        "closed copy, also eine geschlossene Nachricht",
        "cancel copy, also eine gelöschte Nachricht"
      ],
      answer: 0,
      points: 1
    },
    {
      type: "choice",
      prompt: "Welcher Betreff ist für eine E-Mail am besten geeignet?",
      options: [
        "Hallo!!!",
        "wichtig",
        "Frage zur Hausaufgabe vom Montag",
        "(kein Betreff)"
      ],
      answer: 2,
      points: 1
    },
    {
      type: "choice",
      prompt: "Wie heißt eine Gemeinschaft im Internet, in der Mitglieder Profile anlegen und Inhalte teilen?",
      options: ["Provider", "Community", "Netiquette", "Impressum"],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Welche Angabe gehört auf keinen Fall in ein öffentliches Profil?",
      options: [
        "der Lieblingssport",
        "die eigene Wohnadresse",
        "der Vorname",
        "das Lieblingsbuch"
      ],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Was besagt das Recht am eigenen Bild?",
      options: [
        "Jeder darf Fotos aus dem Internet frei benutzen.",
        "Jeder Mensch entscheidet selbst, ob Fotos von ihm veröffentlicht werden.",
        "Fotos dürfen nur von Erwachsenen gemacht werden.",
        "Bilder dürfen nur in der Zeitung erscheinen."
      ],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Was ist eine Abmahnung?",
      options: [
        "eine freundliche Erinnerung per E-Mail",
        "eine schriftliche Verwarnung mit Geldforderung und rechtlichen Folgen",
        "eine Nachricht des Moderators im Chat",
        "eine Warnung des Antivirenprogramms"
      ],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Aus welchen zwei Wörtern setzt sich das Kunstwort „Netiquette“ zusammen?",
      options: [
        "Netz und Quittung",
        "Net und Etiquette",
        "Netto und Etikett",
        "Network und Quiz"
      ],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Was bedeutet das Wort Spam?",
      options: [
        "eine besonders wichtige Nachricht",
        "ungewollte Werbe-Mails",
        "ein Antivirenprogramm",
        "ein Chatraum für Jugendliche"
      ],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Wie nennt man das „Fischen“ nach Passwörtern und persönlichen Daten?",
      options: ["Phishing", "Ransomware", "Blogging", "Streaming"],
      answer: 0,
      points: 1
    },
    {
      type: "choice",
      prompt: "Was macht ein Erpressungstrojaner (Ransomware)?",
      options: [
        "Er zeigt nur nervige Werbung an.",
        "Er verschlüsselt die Daten und fordert Lösegeld.",
        "Er beschleunigt den Computer.",
        "Er löscht automatisch alle Spam-Mails."
      ],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Was sind social bots?",
      options: [
        "Computerprogramme, die künstliche Profile steuern",
        "besonders freundliche Chat-Moderatoren",
        "Roboter, die im Haushalt helfen",
        "Programme zum Bearbeiten von Fotos"
      ],
      answer: 0,
      points: 1
    },
    {
      type: "choice",
      prompt: "Woran erkennst du eine seriöse Webseite?",
      options: [
        "Sie hat besonders viel Werbung.",
        "Sie hat ein Impressum.",
        "Sie hat eine sehr lange Internetadresse.",
        "Sie hat viele Rechtschreibfehler."
      ],
      answer: 1,
      points: 1
    },

    /* ================= Teil B: Fälle beurteilen ================= */

    {
      type: "choice",
      prompt: "Stefan filmt seine Mitschülerin Laura heimlich in der Videokonferenz und will das Video teilen. Welches Recht verletzt er damit?",
      options: [
        "das Urheberrecht an der Videosoftware",
        "den Schutz gegen unbefugte Bildaufnahmen",
        "das Hausrecht der Schule",
        "gar keines, es war ja nur ein Spaß"
      ],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Du findest ein schönes Foto im Internet und möchtest es auf deinem Profil posten. Was ist richtig?",
      options: [
        "Ich darf es nehmen, es steht ja frei im Internet.",
        "Ich darf es nehmen, wenn ich es vorher verändere.",
        "Ich brauche vorher die Erlaubnis des Urhebers.",
        "Ich darf es nehmen, wenn ich kein Geld damit verdiene."
      ],
      answer: 2,
      points: 1
    },
    {
      type: "choice",
      prompt: "Jemand, den du nur aus einem Chat kennst, will sich mit dir treffen. Wie reagierst du richtig?",
      options: [
        "Ich gehe hin, wir schreiben ja schon lange.",
        "Ich gehe hin, nehme aber eine Freundin mit.",
        "Ich treffe mich nicht und erzähle es meinen Eltern.",
        "Ich schicke erst einmal ein Foto von mir."
      ],
      answer: 2,
      points: 1
    },
    {
      type: "choice",
      prompt: "Du bekommst eine E-Mail von einem unbekannten Absender mit einem Anhang. Was tust du?",
      options: [
        "Den Anhang öffnen, um nachzusehen, was drin ist.",
        "Den Anhang nicht öffnen und die Mail löschen.",
        "Den Anhang an Freunde weiterleiten.",
        "Auf die Mail antworten und nachfragen."
      ],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Auf dem Bildschirm erscheint plötzlich eine Lösegeldforderung. Was ist richtig?",
      options: [
        "Sofort bezahlen, dann sind die Daten sicher zurück.",
        "Nichts bezahlen, Erwachsene informieren und die Polizei einschalten.",
        "Den Erpressern schreiben und über den Preis verhandeln.",
        "Den Computer einfach verkaufen."
      ],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Ein Spiel wirbt mit „7 Tage kostenlos testen“. Worauf musst du besonders achten?",
      options: [
        "auf die Anzahl der Downloads",
        "auf das Kleingedruckte, in dem sich Kosten verstecken können",
        "auf die Farbe der Werbung",
        "auf gar nichts, kostenlos ist kostenlos"
      ],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Ein Troll provoziert in den Kommentaren unter einem Beitrag. Wie reagierst du am besten?",
      options: [
        "kräftig zurückschreiben",
        "nicht darauf eingehen und ihn melden",
        "seine Kommentare teilen",
        "ihn zu einer Diskussion herausfordern"
      ],
      answer: 1,
      points: 1
    },
    {
      type: "choice",
      prompt: "Eine Schlagzeile lautet: „SCHOCK! Regierung verschweigt seit Jahren die Wahrheit!“ Was ist das wahrscheinlichste?",
      options: [
        "Es ist eine besonders gut recherchierte Nachricht.",
        "Es ist eine reißerische Schlagzeile und ein Warnsignal für Fake News.",
        "Es ist immer die Wahrheit, sonst dürfte man es nicht schreiben.",
        "Solche Überschriften gibt es nur in seriösen Zeitungen."
      ],
      answer: 1,
      points: 1
    },

    /* ================= Teil C: Freie Antworten (KI-Bewertung) ================= */

    {
      type: "text",
      prompt: "Nenne zwei Regeln, die im Computerraum gelten, und begründe eine davon.",
      expected: "Zum Beispiel: Essen und Trinken sind verboten, weil Getränke auslaufen und die Technik zerstören können. Jeder bleibt an seinem Rechner. An der Verkabelung darf nur die Lehrkraft etwas verändern. Vor dem Unterricht Hände waschen. Am Ende abmelden und aufräumen.",
      keywords: ["essen", "trinken", "kabel", "abmelden", "hände", "aufräumen", "rechner"],
      points: 2,
      lines: 3
    },
    {
      type: "text",
      prompt: "Erkläre den Unterschied zwischen dem Feld Cc und dem Feld Bcc bei einer E-Mail.",
      expected: "Bei Cc sehen alle Empfänger, wer die Nachricht noch bekommen hat. Bei Bcc bleibt die Adresse verborgen, die anderen Empfänger sehen sie nicht.",
      keywords: ["sehen", "sichtbar", "verborgen", "geheim", "kopie", "blind"],
      points: 2,
      lines: 3
    },
    {
      type: "text",
      prompt: "Warum solltest du mit persönlichen Angaben in deinem Profil vorsichtig sein? Nenne zwei Gründe.",
      expected: "Fremde können die Daten sehen und missbrauchen, zum Beispiel um einen zu finden oder sich als jemand anderes auszugeben. Außerdem vergisst das Internet nichts: Veröffentlichte Angaben bekommt man oft nicht mehr weg. Auch Firmen schauen später im Netz nach.",
      keywords: ["fremde", "missbrauch", "vergisst", "löschen", "finden", "daten"],
      points: 2,
      lines: 3
    },
    {
      type: "text",
      prompt: "Nenne zwei der vier Persönlichkeitsrechte und erkläre eines davon in eigenen Worten.",
      expected: "Schutz der Ehre (keine Beleidigungen), Schutz des gesprochenen Wortes (keine heimlichen Tonaufnahmen), Schutz gegen unbefugte Bildaufnahmen (niemanden ungefragt fotografieren oder filmen), Recht am eigenen Bild (jeder entscheidet selbst, ob Fotos von ihm veröffentlicht werden).",
      keywords: ["ehre", "beleidigung", "wort", "tonaufnahme", "bildaufnahme", "eigenen bild", "foto"],
      points: 2,
      lines: 4
    },
    {
      type: "text",
      prompt: "Was ist Cybermobbing? Erkläre außerdem, was man tun sollte, wenn man selbst betroffen ist.",
      expected: "Cybermobbing bedeutet, jemanden über Internet oder Messenger zu beleidigen, bloßzustellen oder zu schikanieren. Betroffene sollten nicht antworten, Beweise mit Screenshots sichern, die Person blockieren oder melden und unbedingt mit Eltern oder einer Lehrkraft sprechen. Cybermobbing ist strafbar.",
      keywords: ["beleidigen", "bloßstellen", "schikane", "screenshot", "beweise", "eltern", "lehrkraft", "melden"],
      points: 2,
      lines: 4
    },
    {
      type: "text",
      prompt: "Nenne zwei Chancen, die Kommunikationsplattformen bieten.",
      expected: "Kontakte zu Freunden und Verwandten halten, auch über große Entfernungen. Informationen für Schule und Referate finden. Gemeinsam lernen und Hausaufgaben machen. Anteilnahme zeigen und über Spendenaktionen anderen helfen. Die eigene Persönlichkeit entwickeln durch Rückmeldung.",
      keywords: ["kontakt", "freunde", "informationen", "lernen", "helfen", "spenden", "austausch"],
      points: 2,
      lines: 3
    },
    {
      type: "text",
      prompt: "Woran erkennst du eine Phishing-Mail? Nenne mindestens drei Merkmale.",
      expected: "Unpersönliche Anrede, viele Rechtschreibfehler, Drohungen und Zeitdruck, eine seltsame Absenderadresse, die Aufforderung Passwörter oder Kontodaten einzugeben, und Links auf gefälschte Seiten, die echt aussehen.",
      keywords: ["anrede", "rechtschreib", "fehler", "druck", "drohung", "adresse", "passwort", "link", "daten"],
      points: 2,
      lines: 4
    },
    {
      type: "text",
      prompt: "Du siehst im Netz eine Nachricht, die dich schockiert. Beschreibe drei Schritte, mit denen du prüfst, ob sie stimmt.",
      expected: "Das Datum prüfen und schauen, ob mehrere seriöse Quellen berichten. Den Absender und das Profil kontrollieren: Gibt es das Profil schon länger? Die Quelle prüfen: Hat die Seite ein Impressum, ist viel Werbung darauf? Die Bilder mit der umgekehrten Bildsuche prüfen. Auf reißerische Schlagzeilen und Rechtschreibfehler achten.",
      keywords: ["datum", "quelle", "impressum", "absender", "profil", "bild", "suche", "schlagzeile", "vergleich"],
      points: 2,
      lines: 4
    }
  ]
};

const TESTS = {
  [inf7InfoProbe1.id]: inf7InfoProbe1
};

module.exports = { TESTS };
