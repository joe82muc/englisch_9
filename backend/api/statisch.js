"use strict";

/**
 * Schutz für den statischen Dateiserver: Aufgabenlösungen, Abgaben und gespeicherte Daten liegen im Ordner backend
 * und dürfen nicht abrufbar sein – auch nicht über Umwege in der Adresse (%62ackend, //backend, /./backend,
 * /unit3/../backend, backend%2Fdata). Deshalb zählt der Ort der Datei auf der Festplatte, nicht die Schreibweise
 * der Adresse. (Eine Sperre nur für Adressen, die mit /backend beginnen, ließ sich so umgehen.)
 * Ebenfalls gesperrt: versteckte Ordner und Dateien (.git, .env) und node_modules.
 */

const express = require("express");
const path = require("path");

// true, wenn die Adresse in den gesperrten Ordner, in einen versteckten Ordner (.git, .env …) oder in ein
// node_modules zeigt – oder wenn sie sich nicht lesen lässt
function gesperrt(reqPath, staticRoot, sperrOrdner) {
  let p;
  try { p = decodeURIComponent(String(reqPath || "")); } catch (_error) { return true; }
  if (p.includes("\0")) return true;
  const rel = path.posix.normalize("/" + p.replace(/\\/g, "/"));
  const ziel = path.resolve(staticRoot, "." + rel).toLowerCase();
  const sperre = path.resolve(sperrOrdner).toLowerCase();
  if (ziel === sperre || ziel.startsWith(sperre + path.sep)) return true;
  return rel.toLowerCase().split("/").some((teil) => teil.startsWith(".") || teil === "node_modules");
}

// Dateiserver für staticRoot. Gesperrte Adressen überspringen ihn; die Anfrage läuft zu den übrigen Routen weiter
// (und endet ohne passende Route mit 404).
function geschuetzterDateiserver(staticRoot, sperrOrdner) {
  const dateien = express.static(staticRoot, { dotfiles: "ignore" });
  return (req, res, next) => (gesperrt(req.path, staticRoot, sperrOrdner) ? next() : dateien(req, res, next));
}

module.exports = { geschuetzterDateiserver, gesperrt };
