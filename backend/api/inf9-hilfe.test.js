"use strict";

// Informatik 9: KI-Lernhilfe in drei Stufen – eigener Auftrag je Stufe, die Lösung wird nie genannt.
const assert = require("node:assert/strict");
const test = require("node:test");
const express = require("express");
const { registerInf9HilfeRoutes, systemHilfe, verdecke } = require("./inf9-hilfe");

let server, base, kiModus = "ok", letzteFrage = "", letztesSystem = "";

test.before(async () => {
  const app = express();
  app.use(express.json());
  registerInf9HilfeRoutes(app, {
    proStunde: 4,
    kindZumCode: async (code) => (code === "911" ? { code: "911", klasse: "9aM" } : code === "922" ? { code: "922", klasse: "9b" } : code === "000" ? { code: "000", klasse: "Lehrkraft" }
      : code === "811" ? { code: "811", klasse: "8aM" } : code === "999" ? { gesperrt: true } : null),
    askKi: async (system, user) => {
      letztesSystem = system; letzteFrage = user;
      if (kiModus === "weg") throw new Error("offline");
      if (kiModus === "leer") return "";
      // die „KI“ verrät absichtlich die Lösung – der Server muss sie verdecken
      return "Laptop B braucht die Adresse 192.168.0.11, dann klappt ping 192.168.0.11.";
    }
  });
  await new Promise((resolve) => { server = app.listen(0, resolve); });
  base = `http://127.0.0.1:${server.address().port}`;
});
test.after(() => new Promise((resolve) => server.close(resolve)));

const hilfe = (body) => fetch(base + "/api/inf9/hilfe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
  .then(async (r) => ({ status: r.status, data: await r.json() }));
const gut = { code: "911", einheit: "netz-start", aufgabe: "a5", titel: "Zwei Laptops verbinden", auftrag: "Baue das kleinste Netzwerk der Welt.",
  frage: "Warum können die beiden Computer nicht miteinander reden?", stufe: 1, kontext: "Erwartete Lösung: Laptop B hat 192.168.0.11.", geheim: ["192.168.0.11"] };

test("Jede Stufe hat ihren eigenen Auftrag; in keiner steht, dass die Lösung genannt werden darf", () => {
  const [s1, s2, s3] = [1, 2, 3].map(systemHilfe);
  assert.match(s1, /KLEINEN TIPP/); assert.doesNotMatch(s1, /KONKRETEN HINWEIS|SCHRITT FÜR SCHRITT/);
  assert.match(s2, /KONKRETEN HINWEIS/); assert.doesNotMatch(s2, /KLEINEN TIPP|SCHRITT FÜR SCHRITT/);
  assert.match(s3, /SCHRITT FÜR SCHRITT/); assert.doesNotMatch(s3, /KLEINEN TIPP|KONKRETEN HINWEIS/);
  [s1, s2, s3].forEach((s) => { assert.match(s, /höchstens 60 Wörter/); assert.match(s, /Erfinde keine Menüs/); assert.doesNotMatch(s, /nenne (jetzt )?die (richtige )?Lösung/i); });
  assert.equal(systemHilfe(7), s1, "unbekannte Stufe = Stufe 1");
});

test("Verdecken: genaue Lösungswerte werden zu ___, anderes bleibt", () => {
  assert.equal(verdecke("Nimm 192.168.0.11 und nicht 192.168.0.110.", ["192.168.0.11"]), "Nimm ___ und nicht 192.168.0.110.");
  assert.equal(verdecke("Schreibe =SUMME(A1:A3) oder = summe( a1 : a3 ).", ["=SUMME(A1:A3)"]), "Schreibe ___ oder ___.");
  assert.equal(verdecke("Es kommen 4 Pakete an, nicht 14.", ["4"]), "Es kommen ___ Pakete an, nicht 14.");
  assert.equal(verdecke("Schau auf das Kabel.", ["192.168.0.11"]), "Schau auf das Kabel.");
  assert.equal(verdecke("Text bleibt.", []), "Text bleibt.");
});

test("Hilfe mit Code: Antwort kommt, die Lösung ist verdeckt, die Frage des Kindes steht abgegrenzt im Auftrag", async () => {
  kiModus = "ok";
  const { status, data } = await hilfe(gut);
  assert.equal(status, 200);
  assert.equal(data.stufe, 1);
  assert.equal(data.antwort, "Laptop B braucht die Adresse ___, dann klappt ping ___.");
  assert.equal(letztesSystem, systemHilfe(1));
  assert.match(letzteFrage, /Stufe der Hilfe: 1/);
  assert.match(letzteFrage, /Frage des Kindes: <<<Warum können die beiden Computer/);
  assert.match(letzteFrage, /Material der Lehrkraft \(nur für dich\)/);
  const r3 = await hilfe({ ...gut, stufe: 3 });
  assert.equal(r3.data.stufe, 3);
  assert.equal(letztesSystem, systemHilfe(3));
  assert.doesNotMatch(r3.data.antwort, /192\.168\.0\.11/, "auch Stufe 3 nennt den Wert nicht");
});

test("HTML in den Angaben der Seite wird entfernt, überlange Texte werden gekürzt", async () => {
  const { status } = await hilfe({ ...gut, auftrag: "<b>Baue</b> das <script>x</script> Netz. " + "x".repeat(2000), kontext: "k".repeat(5000) });
  assert.equal(status, 200);
  assert.doesNotMatch(letzteFrage, /<b>|<script>/);
  assert.ok(letzteFrage.length < 3200, "Auftrag an die KI bleibt kurz: " + letzteFrage.length);
});

test("Nur mit Code einer 9. Klasse oder dem Lehrercode; falsche Angaben werden abgelehnt", async () => {
  assert.equal((await hilfe({ ...gut, code: "" })).status, 401);
  assert.equal((await hilfe({ ...gut, code: "555" })).status, 401);
  assert.equal((await hilfe({ ...gut, code: "999" })).status, 429);
  assert.equal((await hilfe({ ...gut, code: "811" })).status, 403, "8. Klasse");
  assert.equal((await hilfe({ ...gut, code: "000" })).status, 200, "Lehrercode");
  assert.equal((await hilfe({ ...gut, code: "922", einheit: "Netz Start!" })).status, 400);
  assert.equal((await hilfe({ ...gut, code: "922", frage: "hä" })).status, 400);
  assert.equal((await hilfe({ ...gut, code: "922", titel: "" })).status, 400);
});

test("Grenze je Code und Stunde; KI-Ausfall -> 503 mit Hinweis auf die Hinweise der Seite", async () => {
  kiModus = "ok";
  // Code 911 hat schon drei Fragen gestellt (oben), proStunde = 4
  assert.equal((await hilfe(gut)).status, 200, "vierte Frage");
  const zuviel = await hilfe(gut);
  assert.equal(zuviel.status, 429);
  assert.match(zuviel.data.error, /Hinweise unter der Aufgabe/);
  kiModus = "weg";
  const weg = await hilfe({ ...gut, code: "922" });
  assert.equal(weg.status, 503);
  assert.match(weg.data.error, /Hinweise unter der Aufgabe/);
  kiModus = "leer";
  assert.equal((await hilfe({ ...gut, code: "922" })).status, 503);
  kiModus = "ok";
});
