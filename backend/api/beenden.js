"use strict";

/**
 * Beim Beenden (Render schickt SIGTERM bei jedem Deploy und Neustart) erst alle Speicher
 * sichern, dann aussteigen. Lernfortschritt und Proben melden hier ihre Sicherung an,
 * damit keiner den Prozess beendet, bevor der andere fertig ist.
 */
const aufgaben = [];
let angemeldet = false;

function beimBeenden(sichern) {
  aufgaben.push(sichern);
  if (angemeldet) return;
  angemeldet = true;
  const ende = (signal) => {
    const fertig = () => process.exit(signal === "SIGINT" ? 130 : 0);
    setTimeout(fertig, 8000).unref();
    Promise.allSettled(aufgaben.map((f) => Promise.resolve().then(f))).then(fertig);
  };
  process.once("SIGTERM", () => ende("SIGTERM"));
  process.once("SIGINT", () => ende("SIGINT"));
}

module.exports = { beimBeenden };
