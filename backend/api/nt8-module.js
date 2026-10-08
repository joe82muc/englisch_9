"use strict";

/**
 * NT 8: Titel der Lernmodule je Kennung – wie in der Modulliste der Website (8M/NT/themen.js).
 * Die Block-Proben (nt8-block-*.js) nennen bei jeder Aufgabe ihr Modul nur mit der Kennung; der Titel wird hier
 * ergänzt und steht dann in der Probe, in der Korrektur und in der Rückgabe („📘 Der Elektromagnet“).
 * Neues Modul auf der Website = neue Zeile hier (nt8.test.js prüft, dass jede Aufgabe einen Titel findet).
 * BEREICHE: Themenbereich -> seine Module (= Stoff einer Probe).
 */
const TITEL = {
  // Magnetismus und Induktion (LehrplanPLUS NT8 2.1, 2.2)
  "magnetismus": "Magnete: Pole, Kräfte und Felder",
  "elektromagnet": "Der Elektromagnet",
  "elektromotor": "Von der Leiterschaukel zum Elektromotor",
  "induktion": "Induktion: Spannung aus Bewegung",
  "generator-trafo": "Generator, Wechselspannung und Transformator",
  // Energie nutzen (2.3, 2.4, 2.5)
  "energieformen": "Energie: Formen, Umwandlung, Erhaltung",
  "leistung": "Elektrische Leistung und Stromkosten",
  "kraftwerke": "Kraftwerke und der Weg des Stroms",
  "reaktionsenergie": "Energie bei chemischen Reaktionen",
  // Mensch und Gesundheit (3.1 bis 3.5)
  "mikroorganismen": "Mikroorganismen: winzig und wichtig",
  "infektion": "Infektionskrankheiten und Immunabwehr",
  "sucht": "Genussmittel, Drogen und Abhängigkeit",
  "entwicklung": "Schwangerschaft, Verhütung, Verantwortung",
  "schall": "Schall und Gehör",
  // Atome, Ionen und chemische Reaktionen (4.1, 4.2)
  "atom-ion": "Vom Atom zum Ion",
  "ionenbindung": "Alkalimetalle, Halogene und die Ionenbindung",
  "reaktionen": "Chemische Reaktionen erkennen",
  "reaktionen-auswerten": "Reaktionen verstehen und auswerten",
  // Säuren, Laugen und Salze (4.3, 4.4)
  "sauer-basisch": "Saure und basische Lösungen im Alltag",
  "ph-wert": "Indikatoren und pH-Wert",
  "saeuren-laugen": "Säuren und Laugen: Herstellung und Anwendung",
  "salze": "Neutralisation und Salze"
};
const BEREICHE = {
  magnet: ["magnetismus", "elektromagnet", "elektromotor", "induktion", "generator-trafo"],
  energie: ["energieformen", "leistung", "kraftwerke", "reaktionsenergie"],
  gesundheit: ["mikroorganismen", "infektion", "sucht", "entwicklung", "schall"],
  stoffe: ["atom-ion", "ionenbindung", "reaktionen", "reaktionen-auswerten"],
  saeuren: ["sauer-basisch", "ph-wert", "saeuren-laugen", "salze"]
};

module.exports = { TITEL, BEREICHE };
