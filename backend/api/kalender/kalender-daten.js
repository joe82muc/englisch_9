(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.GrumiKalenderDaten = factory();
})(typeof window === "object" ? window : globalThis, function () {
  "use strict";
  // Amtliche Ferienordnung; die Grenzen sind inklusive. Geprueft am 07.10.2026.
  var ferien = [
    ["2026-08-03", "2026-09-14", "Sommerferien"],
    ["2026-11-02", "2026-11-06", "Herbstferien"],
    ["2026-12-24", "2027-01-08", "Weihnachtsferien"],
    ["2027-02-08", "2027-02-12", "Frühjahrsferien"],
    ["2027-03-22", "2027-04-02", "Osterferien"],
    ["2027-05-18", "2027-05-28", "Pfingstferien"],
    ["2027-08-02", "2027-09-13", "Sommerferien"]
  ];
  var feiertage = {
    "2026-10-03": "Tag der Deutschen Einheit", "2026-11-01": "Allerheiligen",
    "2026-12-25": "1. Weihnachtsfeiertag", "2026-12-26": "2. Weihnachtsfeiertag",
    "2027-01-01": "Neujahr", "2027-01-06": "Heilige Drei Könige",
    "2027-03-26": "Karfreitag", "2027-03-29": "Ostermontag", "2027-05-01": "Tag der Arbeit",
    "2027-05-06": "Christi Himmelfahrt", "2027-05-17": "Pfingstmontag", "2027-05-27": "Fronleichnam",
    // Unterhaching: weiterhin gesetzlicher Feiertag, nicht in jeder bayerischen Gemeinde.
    "2027-08-15": "Mariä Himmelfahrt (Unterhaching)"
  };
  function datumOk(s) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(s || ""))) return false;
    var d = new Date(s + "T12:00:00Z");
    return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
  }
  function plus(s, n) {
    var d = new Date(s + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }
  function klasse(s) {
    s = String(s || "").replace(/\s/g, "");
    if (/^(5|6|7|8|9|10)[MR]$/i.test(s)) return "";
    var m = /^(5|6|7|8|9|10)([a-z])([mr]?)$/i.exec(s);
    return m ? m[1] + m[2].toLowerCase() + (/m/i.test(m[3]) ? "M" : "") : "";
  }
  function markierungen(tag) {
    var out = [];
    ferien.forEach(function (f) { if (tag >= f[0] && tag <= f[1]) out.push({ art: "ferien", name: f[2] }); });
    if (feiertage[tag]) out.push({ art: "feiertag", name: feiertage[tag] });
    if (tag === "2026-11-18") out.push({ art: "frei", name: "Buß- und Bettag · unterrichtsfrei" });
    return out;
  }
  function warnungen(e, alle) {
    var w = markierungen(e.datum).map(function (m) { return m.name; });
    var d = new Date(e.datum + "T12:00:00Z"), wt = d.getUTCDay();
    if (wt === 0 || wt === 6) w.push("Wochenende");
    var fremde = alle.filter(function (a) { return a.id !== e.id && a.klasse === e.klasse; });
    var amTag = fremde.filter(function (a) { return a.datum === e.datum; });
    if (amTag.length) w.push(amTag.length + " weitere Probe(n) in " + e.klasse + " am selben Tag: " + amTag.map(function (a) { return a.fach; }).join(", "));
    var mo = plus(e.datum, -((wt + 6) % 7)), so = plus(mo, 6);
    var n = fremde.filter(function (a) { return a.datum >= mo && a.datum <= so; }).length;
    if (n >= 2) w.push(n + " weitere Probe(n) in dieser Woche");
    return w;
  }
  function finger(e) { return [e.datum, e.klasse, e.fach, e.titel, e.stunde || ""].join("|").toLowerCase(); }
  return {
    jahr: "2026/2027", von: "2026-09-01", bis: "2027-08-31", ferien: ferien, feiertage: feiertage,
    datumOk: datumOk, plus: plus, klasse: klasse, markierungen: markierungen, warnungen: warnungen, finger: finger,
    quellen: [
      "https://www.km.bayern.de/termine/ferien-und-feiertage",
      "https://www.gesetze-bayern.de/Content/Document/BayFTG/true",
      "https://www.muenchen.de/aktuell/feiertage-bayern-2026-und-2027",
      "https://www.unterhaching.de/neuigkeiten/news?id=2309&item=article&view=publish"
    ]
  };
});
