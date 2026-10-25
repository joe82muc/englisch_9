"use strict";

/**
 * Informatik 9: Filius-Aufträge, die das Kind in einer Einheit abgibt und die der Server bewertet (filius-modul.js,
 * Route /api/inf9/filius/pruefen). Die Punkte zählen für eine Probe: Dort steht eine Aufgabe
 * { type: "filius", ausModul: "<Kennung>" } (nt7.js) – sie übernimmt die beste Abgabe aus der Einheit.
 *
 * Auftrag der Lehrkraft (25.10.2026): „mach so dass die kinder die datei im modul selber abgeben, die ki prüft und
 * vergibt gleich punkte“ – die Laden-Aufgabe der Probe 1b steht am Ende der Einheit N1 (netz-start.html).
 *
 *   checks      Prüfprogramm (filiuspruefung.js: endgeraete, kabel, ip …) – genau, immer gleich
 *   kiPunkte    zusätzlich von der KI (kiKriterien, wohlwollend); fällt sie aus, prüft der Server die Namen (namen)
 *   Diese Datei bleibt auf dem Server (Lösung).
 */
const AUFGABEN = {
  "netz-start-laden": {
    titel: "Das Netz eines Ladens (Praxis für Probe 1b)",
    einheit: "N1 Netzwerke kennenlernen",
    auftrag: "In Filius zwei Rechner aufbauen: Kasse mit der IP-Adresse 192.168.0.20 und Büro mit 192.168.0.21. " +
      "Die beiden sind mit einem Kabel verbunden. Das Netz ist als .fls-Datei gespeichert.",
    checks: [
      { id: "zwei", typ: "endgeraete", anzahl: 2, punkte: 1, text: "Genau zwei Rechner stehen auf der Fläche" },
      { id: "kabel", typ: "kabel", punkte: 1, text: "Die beiden Rechner sind mit einem Kabel verbunden" },
      { id: "ip20", typ: "ip", ip: "192.168.0.20", punkte: 1, text: "Ein Rechner hat die IP-Adresse 192.168.0.20" },
      { id: "ip21", typ: "ip", ip: "192.168.0.21", punkte: 1, text: "Ein Rechner hat die IP-Adresse 192.168.0.21" }
    ],
    kiPunkte: 1,
    kiText: "Die Rechner heißen Kasse und Büro",
    kiKriterien: ["Nur die Namen zählen: Ein Rechner heißt Kasse, der andere Büro. Groß- und Kleinschreibung, „Buero“ statt „Büro“ und kleine Tippfehler zählen als richtig. Kabel und IP-Adressen hat das Prüfprogramm schon bewertet – fehlt dort etwas, gibt es den Punkt für die Namen trotzdem."],
    namen: ["Kasse", "Büro"],
    expected: "Zwei Rechner auf der Fläche, mit einem Kabel verbunden: Kasse 192.168.0.20 und Büro 192.168.0.21, gespeichert als .fls-Datei."
  }
};

const maxPunkte = (a) => a.checks.reduce((s, c) => s + c.punkte, 0) + (a.kiPunkte || 0);

module.exports = { AUFGABEN, maxPunkte };
