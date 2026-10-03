"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");
const express = require("express");
const { geschuetzterDateiserver, gesperrt } = require("./statisch");

let server, port, root;

test.before(async () => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "statisch-test-"));
  fs.mkdirSync(path.join(root, "unit3"));
  fs.mkdirSync(path.join(root, "backend", "data"), { recursive: true });
  fs.mkdirSync(path.join(root, "backend", "api"));
  fs.writeFileSync(path.join(root, "index.html"), "<h1>Startseite</h1>");
  fs.writeFileSync(path.join(root, "unit3", "seite.html"), "<p>Unit 3</p>");
  fs.writeFileSync(path.join(root, "backend", "data", "abgaben.json"), "{\"inhalt\":\"VERTRAULICH-4711 Abgaben der Kinder\"}");
  fs.writeFileSync(path.join(root, "backend", "api", "loesungen.js"), "// VERTRAULICH-4711 Loesungen");
  fs.mkdirSync(path.join(root, ".git"));
  fs.mkdirSync(path.join(root, "unit3", ".geheim"));
  fs.writeFileSync(path.join(root, ".git", "HEAD"), "VERTRAULICH-4711 ref");
  fs.writeFileSync(path.join(root, ".env"), "VERTRAULICH-4711=1");
  fs.writeFileSync(path.join(root, "unit3", ".geheim", "notiz.txt"), "VERTRAULICH-4711");
  const app = express();
  app.get("/api/vorher", (_req, res) => res.json({ ok: true }));
  app.use(geschuetzterDateiserver(root, path.join(root, "backend")));
  app.get("/api/nachher", (_req, res) => res.json({ ok: true }));
  await new Promise((resolve) => { server = app.listen(0, resolve); });
  port = server.address().port;
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
  fs.rmSync(root, { recursive: true, force: true });
});

// Die Adresse geht unverändert auf die Leitung (fetch würde /./ und /../ schon selbst auflösen)
const hole = (adresse) => new Promise((resolve, reject) => {
  http.request({ host: "127.0.0.1", port, path: adresse, method: "GET" }, (res) => {
    let body = "";
    res.on("data", (teil) => { body += teil; });
    res.on("end", () => resolve({ status: res.statusCode, body }));
  }).on("error", reject).end();
});

test("Normale Seiten werden ausgeliefert, Routen vor und nach dem Dateiserver bleiben erreichbar", async () => {
  assert.equal((await hole("/index.html")).status, 200);
  assert.match((await hole("/unit3/seite.html")).body, /Unit 3/);
  assert.equal((await hole("/api/vorher")).status, 200);
  assert.equal((await hole("/api/nachher")).status, 200);
});

test("Der Ordner backend und versteckte Ordner sind über keine Schreibweise der Adresse erreichbar", async () => {
  const umwege = [
    "/backend/data/abgaben.json", "/%62ackend/data/abgaben.json", "/b%61ckend/data/abgaben.json", "//backend/data/abgaben.json",
    "/./backend/data/abgaben.json", "/%2e/backend/data/abgaben.json", "/unit3/../backend/data/abgaben.json",
    "/unit3/%2e%2e/backend/data/abgaben.json", "/backend%2Fdata%2Fabgaben.json", "/backend%5Cdata%5Cabgaben.json",
    "/backend//data//abgaben.json", "/backend/./data/abgaben.json", "/backend/api/loesungen.js", "/%62ackend/api/loesungen.js",
    "/Backend/data/abgaben.json", "/BACKEND/DATA/abgaben.json", "/backend/data/abgaben.json?x=1", "/unit3/..%2Fbackend/data/abgaben.json",
    "/backend/data/abgaben.json%00.html", "/%ZZbackend/data/abgaben.json",
    "/.git/HEAD", "/%2egit/HEAD", "/unit3/../.git/HEAD", "/.env", "/unit3/.geheim/notiz.txt"
  ];
  for (const adresse of umwege) {
    const r = await hole(adresse);
    assert.notEqual(r.status, 200, adresse);
    assert.doesNotMatch(r.body, /VERTRAULICH-4711/, adresse);
  }
});

test("Die Prüfung richtet sich nach dem Ort der Datei, nicht nach der Schreibweise", () => {
  const sperre = path.join(root, "backend");
  assert.equal(gesperrt("/index.html", root, sperre), false);
  assert.equal(gesperrt("/unit3/seite.html", root, sperre), false);
  assert.equal(gesperrt("/api/health", root, sperre), false);
  assert.equal(gesperrt("/backend", root, sperre), true);
  assert.equal(gesperrt("/%62ackend/data/x.json", root, sperre), true);
  assert.equal(gesperrt("/unit3/node_modules/x.js", root, sperre), true);
  assert.equal(gesperrt("/%E0%A4%A", root, sperre), true, "nicht lesbare Adresse");
  // Liegt der Dateiserver selbst im gesperrten Ordner, liefert er nichts aus
  assert.equal(gesperrt("/index.html", path.join(root, "backend", "api"), sperre), true);
});
