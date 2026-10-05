"use strict";

// Filius-Prüfung: Auslesen der Filius-Datei. Die Beispieldatei unten stammt aus Filius 2.14.0 (gekürzt um
// Lage-Angaben und Bilder): zwei Notebooks und ein Rechner. Notebook 1 und der Rechner haben die voreingestellte
// Adresse 192.168.0.10 behalten, der Rechner auch seinen voreingestellten Namen – beides schreibt Filius NICHT
// zum Knoten, nur in die Beschriftung.
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const path = require("path");
const { filiusAuslesen, zipEntryLesen, dateiPruefen } = require("./filiuspruefung");
const { TESTS } = require("./filiuspruefung-daten");

const XML = `<?xml version="1.0" encoding="UTF-8"?>
<java version="25.0.2" class="java.beans.XMLDecoder">
<string>Filius version: 2.14.0 (29.08.2026)</string>
<object class="java.util.LinkedList">
<void method="add">
<object class="filius.gui.netzwerksicht.GUIKnotenItem" id="GUIKnotenItem0">
<void property="imageLabel">
<object class="filius.gui.netzwerksicht.JSidebarButton" id="JSidebarButton0">
<void property="text">
<string>Notebook 1</string>
</void>
<void property="toolTipText">
<string>&lt;html&gt;&lt;pre&gt;IP-Adresse(n)/Netzmaske (MAC):
192.168.0.10 / 255.255.255.0 (95:78:70:4F:90:10)
Gateway: 
DNS-Server: &lt;/pre&gt;&lt;/html&gt;</string>
</void>
<void property="typ">
<string>Notebook</string>
</void>
</object>
</void>
<void property="knoten">
<object class="filius.hardware.knoten.Notebook" id="Notebook0">
<void property="name">
<string>Notebook 1</string>
</void>
<void id="LinkedList0" property="netzwerkInterfaces">
<void id="NetzwerkInterface0" index="0">
<void property="mac">
<string>95:78:70:4F:90:10</string>
</void>
<void id="Port0" property="port"/>
</void>
</void>
<void id="Betriebssystem0" property="systemSoftware">
<void property="DHCPServer">
<void property="name">
<string>Thread-1</string>
</void>
</void>
</void>
</object>
</void>
</object>
</void>
<void method="add">
<object class="filius.gui.netzwerksicht.GUIKnotenItem" id="GUIKnotenItem1">
<void property="imageLabel">
<object class="filius.gui.netzwerksicht.JSidebarButton">
<void property="text">
<string>Notebook 2</string>
</void>
<void property="toolTipText">
<string>&lt;html&gt;&lt;pre&gt;IP-Adresse(n)/Netzmaske (MAC):
192.168.0.11 / 255.255.255.0 (74:52:D4:BD:D6:37)
Gateway: 
DNS-Server: &lt;/pre&gt;&lt;/html&gt;</string>
</void>
<void property="typ">
<string>Notebook</string>
</void>
</object>
</void>
<void property="knoten">
<object class="filius.hardware.knoten.Notebook" id="Notebook1">
<void property="name">
<string>Notebook 2</string>
</void>
<void id="LinkedList1" property="netzwerkInterfaces">
<void id="NetzwerkInterface1" index="0">
<void property="ip">
<string>192.168.0.11</string>
</void>
<void property="mac">
<string>74:52:D4:BD:D6:37</string>
</void>
<void id="Port1" property="port"/>
</void>
</void>
<void id="Betriebssystem1" property="systemSoftware">
<void property="DHCPServer">
<void property="name">
<string>Thread-3</string>
</void>
</void>
</void>
</object>
</void>
</object>
</void>
<void method="add">
<object class="filius.gui.netzwerksicht.GUIKnotenItem">
<void property="imageLabel">
<object class="filius.gui.netzwerksicht.JSidebarButton">
<void property="text">
<string>Rechner</string>
</void>
<void property="toolTipText">
<string>&lt;html&gt;&lt;pre&gt;IP-Adresse(n)/Netzmaske (MAC):
192.168.0.10 / 255.255.255.0 (50:B9:6A:5C:95:9E)
Gateway: 192.168.0.1
DNS-Server: &lt;/pre&gt;&lt;/html&gt;</string>
</void>
<void property="typ">
<string>Rechner</string>
</void>
</object>
</void>
<void property="knoten">
<object class="filius.hardware.knoten.Rechner" id="Rechner0">
<void id="LinkedList2" property="netzwerkInterfaces">
<void index="0">
<void property="gateway">
<string>192.168.0.1</string>
</void>
<void property="mac">
<string>50:B9:6A:5C:95:9E</string>
</void>
</void>
</void>
<void id="Betriebssystem2" property="systemSoftware">
<void property="DHCPServer">
<void property="name">
<string>Thread-13</string>
</void>
</void>
</void>
</object>
</void>
</object>
</void>
</object>
<object class="java.util.LinkedList">
<void method="add">
<object class="filius.gui.netzwerksicht.GUIKabelItem" id="GUIKabelItem0">
<void property="dasKabel">
<object class="filius.hardware.Kabel">
<void property="anschluesse">
<array class="filius.hardware.Port" length="2">
<void index="0">
<object idref="Port0"/>
</void>
<void index="1">
<object idref="Port1"/>
</void>
</array>
</void>
</object>
</void>
<void property="kabelpanel">
<void property="ziel1">
<object idref="GUIKnotenItem0"/>
</void>
<void property="ziel2">
<object idref="GUIKnotenItem1"/>
</void>
</void>
</object>
</void>
</object>
<object class="java.util.ArrayList"/>
</java>
`;

test("Filius-Datei: voreingestellte Adresse 192.168.0.10 und voreingestellter Name werden gelesen", () => {
  const netz = filiusAuslesen(XML);
  assert.deepEqual(netz.geraete.map((g) => [g.art, g.name, g.ips, g.gateway, g.maske]), [
    ["Notebook", "Notebook 1", ["192.168.0.10"], "", "255.255.255.0"],
    ["Notebook", "Notebook 2", ["192.168.0.11"], "", "255.255.255.0"],
    ["Rechner", "Rechner", ["192.168.0.10"], "192.168.0.1", "255.255.255.0"]
  ]);
  assert.deepEqual(netz.ips, ["192.168.0.10", "192.168.0.11"]);
});

test("Filius-Datei: ein Rechner mit voreingestellter Adresse zählt in seinem Netz mit", () => {
  // Dieselbe Datei als ZIP wäre eine .fls; hier genügt die Prüfung der Regeln über einen unkomprimierten Eintrag
  const name = Buffer.from("projekt/konfiguration.xml"), daten = Buffer.from(XML, "utf8");
  const kopf = Buffer.alloc(30);
  kopf.writeUInt32LE(0x04034b50, 0); kopf.writeUInt16LE(0, 8);
  kopf.writeUInt32LE(daten.length, 18); kopf.writeUInt32LE(daten.length, 22); kopf.writeUInt16LE(name.length, 26);
  const fls = Buffer.concat([kopf, name, daten]);
  assert.equal(zipEntryLesen(fls, "konfiguration.xml"), XML);
  const r = dateiPruefen(fls, { checks: [
    { id: "net0", typ: "netz", praefix: "192.168.0.", mindestens: 3, punkte: 2, text: "Drei Geräte im Netz 192.168.0.x" },
    { id: "ip10", typ: "ip", ip: "192.168.0.10", punkte: 1, text: "Adresse 192.168.0.10 vorhanden" },
    { id: "gw0", typ: "gateway", praefix: "192.168.0.", gateway: "192.168.0.1", punkte: 2, text: "Gateway bei allen" }
  ] });
  assert.deepEqual(r.details.map((d) => [d.id, d.erfuellt]), [["net0", true], ["ip10", true], ["gw0", false]]);
  assert.match(r.details[2].ist, /2 ohne bzw\. mit falschem Gateway/, "die beiden Notebooks haben kein Gateway – auch das mit der voreingestellten Adresse zählt jetzt");
});

test("Filius-Prüfung: die Beispieldatei der Lehrkraft erfüllt weiter alle festen Prüfpunkte", () => {
  const datei = path.join(__dirname, "..", "dateien", "beispiel-netz.fls");
  if (!fs.existsSync(datei)) return;
  const aufgabe = Object.values(TESTS).map((t) => t.upload || t).find((u) => Array.isArray(u.checks)) || Object.values(TESTS)[0];
  const checks = aufgabe.checks || (Object.values(TESTS)[0].upload || {}).checks;
  const r = dateiPruefen(fs.readFileSync(datei), { checks });
  assert.equal(r.lesbar, true);
  assert.equal(r.punkte, r.maxPunkte, r.details.filter((d) => !d.erfuellt).map((d) => d.id + ": " + d.ist).join(", "));
});
