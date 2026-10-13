"use strict";

/**
 * Vokabeltests Englisch 8M (Stand 13.10.2026) – je Unit zwei Tests mit 30 Wörtern, wie in Englisch 7M:
 * nur Deutsch -> Englisch, M-Zug-Notenschlüssel (50 % = Note 4; ohne "gradeScale" gilt er von selbst).
 *
 * Grundlage ist die Wortliste der Lehrkraft (Abschnitte der Units). Test 1 und Test 2 teilen die Unit so,
 * wie es die Lernlisten zum Abfragen tun (8M/Englisch/unit<N>/test/lernliste-1.html und -2.html):
 *   Unit 1  Test 1: Intro bis city words          Test 2: Text bis water transport
 *   Unit 2  Test 1: Intro bis air travel          Test 2: Text bis phrases with -ing
 *   Unit 3  Test 1: Intro bis Topic 2             Test 2: phrasal verbs bis Vocabulary skills
 *   Unit 4  Test 1: Intro bis Topic 2             Test 2: Text bis Speaking skills
 * Ausgelassen: Wörter, die im Deutschen gleich lauten (Statue, Zoo, Marathon), und Wörter, deren deutsche Vorgabe
 * nicht eindeutig zu machen wäre. Mehrdeutige Vorgaben haben einen Hinweis ("hint"); Hinweise nennen nie ein Testwort.
 * Eigennamen stehen groß in der Lösung (Italy, Turkish, the Caribbean) – so verlangt sie der Test auch groß.
 * Verben: Die Grundform genügt, mit oder ohne "to". Die drei Formen der unregelmäßigen Verben üben die Kinder im
 * Bereich „Unregelmäßige Verben“.
 */

const w = (prompt, solutions, hint) => ({ prompt, direction: "de-en", solutions: [solutions], ...(hint ? { hint } : {}) });

const U = {
  1: "Welcome to New York!", 2: "One country - different states", 3: "Southern life", 4: "Working in Canada"
};

const WOERTER = {
  "u1-test1": ["Intro bis city words", [
    // --- Intro ---
    w("Stadtteil; Bezirk", "borough"),
    w("Einwanderer; Einwanderin", "immigrant"),
    w("Bevölkerung; Einwohnerzahl", "population"),
    w("Italien", "Italy"),
    w("Bote, Botin; Kurier, Kurierin", "messenger; courier"),
    // --- Topic 1 ---
    w("Zeitschrift", "magazine"),
    w("Entscheidung", "decision"),
    w("auswandern", "to emigrate; emigrate"),
    w("Heimatland; Heimat", "home country"),
    w("arm", "poor", "nicht reich"),
    w("Chance; Gelegenheit", "opportunity; chance"),
    w("Heimweh haben", "to be homesick; be homesick"),
    w("Zukunft", "future; the future"),
    w("erfolgreich", "successful"),
    w("Staatsbürger; Staatsbürgerin", "citizen"),
    w("Viel Glück!", "Good luck"),
    // --- Das kenne ich schon: going to a new country ---
    w("verschieden; anders", "different"),
    w("vermissen", "to miss; miss"),
    w("umziehen", "to move; move", "in eine andere Wohnung"),
    // --- Topic 2 ---
    w("Staatsangehörigkeit; Nationalität", "nationality"),
    w("Sprache", "language"),
    w("geboren werden", "to be born; be born"),
    w("Gehweg; Bürgersteig", "sidewalk; pavement"),
    w("türkisch", "Turkish"),
    w("Nachbarschaft", "neighborhood; neighbourhood"),
    w("nachts", "at night"),
    // --- Das kenne ich schon: city words ---
    w("Gebäude", "building"),
    w("Verkehr", "traffic", "auf der Straße"),
    w("Hauptstadt", "capital; capital city"),
    w("laut", "noisy; loud", "Die Straße ist ..."),
  ]],
  "u1-test2": ["Text bis water transport", [
    // --- Text ---
    w("Zeuge; Zeugin", "witness"),
    w("Paket", "package; parcel"),
    w("liefern", "to deliver; deliver"),
    w("Brief", "letter", "kommt mit der Post"),
    w("Lieferwagen; Transporter", "van"),
    w("Ecke", "corner"),
    w("aussteigen", "to get out; get out", "aus dem Auto"),
    w("Kratzer", "scratch"),
    w("demoliert; zerstört", "wrecked; destroyed"),
    w("einsteigen", "to get in; get in", "ins Auto"),
    w("wegfahren", "to drive off; drive off; to drive away; drive away"),
    w("lügen", "to lie; lie"),
    w("beweisen", "to prove; prove"),
    w("Wahrheit", "truth; the truth"),
    // --- Film ---
    w("Ehre", "honor; honour"),
    w("Aufzug; Lift", "elevator; lift"),
    // --- More about ---
    w("Zuwanderung; Immigration", "immigration"),
    w("krank", "sick; ill"),
    w("Krankheit", "disease; illness"),
    w("ein paar; einige", "a few; some"),
    // --- Internet research skills ---
    w("Halbinsel", "peninsula"),
    w("Meeresfrüchte", "seafood"),
    w("Wal", "whale"),
    w("Kajakfahren", "kayaking"),
    w("Führer; Führerin", "guide", "zeigt Gästen die Stadt"),
    w("kontaktieren; sich in Verbindung setzen", "to contact; contact"),
    // --- Das kenne ich schon: water transport ---
    w("Schiff", "ship; boat"),
    w("Floß", "raft"),
    w("paddeln", "to paddle; paddle"),
    w("Welle", "wave", "im Meer"),
  ]],
  "u2-test1": ["Intro bis air travel", [
    // --- Intro ---
    w("westlich von", "west of"),
    w("Flugzeug", "plane; airplane; aeroplane"),
    w("Wildnis", "wilderness"),
    w("benannt nach", "named after"),
    w("riesig; Riesen-", "giant; huge"),
    w("Wahrzeichen", "landmark"),
    w("Erdbeben", "earthquake"),
    w("herstellen; erzeugen", "to produce; produce"),
    w("Gemüse", "vegetable; vegetables; veg"),
    w("Arbeiter; Arbeiterin", "worker"),
    w("Mexiko", "Mexico"),
    // --- Topic 1 ---
    w("sich freuen auf", "to look forward to; look forward to"),
    w("Wald", "wood; woods; forest"),
    w("Fotos machen", "to take pictures; take pictures; to take photos; take photos"),
    w("unterrichten; beibringen", "to teach; teach"),
    w("gewöhnt sein an", "to be used to; be used to"),
    w("Flug", "flight"),
    w("Flughafen", "airport"),
    // --- Das kenne ich schon: reflexive pronouns ---
    w("sich selbst", "herself", "für eine Frau oder ein Mädchen (she)"),
    w("uns selbst", "ourselves"),
    // --- Topic 2 ---
    w("Reisepass", "passport"),
    w("verspätet", "delayed; late"),
    w("landen", "to land; land"),
    w("Flugbegleiter; Flugbegleiterin", "flight attendant"),
    w("sich beschweren", "to complain; complain"),
    w("Koffer", "suitcase"),
    w("Mitarbeiter; Angestellter", "employee"),
    w("Passagier; Passagierin", "passenger"),
    // --- Das kenne ich schon: air travel ---
    w("Reise", "journey; trip"),
    w("ankommen", "to arrive; arrive"),
  ]],
  "u2-test2": ["Text bis phrases with -ing", [
    // --- Text ---
    w("schütteln; beben", "to shake; shake"),
    w("passieren; sich ereignen", "to happen; happen"),
    w("verursachen", "to cause; cause"),
    w("Schaden", "damage"),
    w("nervös; aufgeregt", "nervous"),
    w("zerstören", "to destroy; destroy"),
    w("sich vorbereiten (auf)", "to prepare; prepare; to prepare for; prepare for; to get ready for; get ready for"),
    w("Gegenstand; Ding", "item; thing"),
    w("Dose", "can; tin", "aus Metall, für Essen"),
    // --- Film ---
    w("Tierheim", "animal shelter"),
    w("Helfer; Helferin", "helper"),
    w("sobald", "as soon as"),
    w("Arbeitszeit", "working hours"),
    w("genießen", "to enjoy; enjoy"),
    w("sich kümmern (um)", "to care for; care for; to care; care; to look after; look after; to take care of; take care of"),
    w("den Hund ausführen", "to walk the dog; walk the dog"),
    w("Kellnerin", "waitress"),
    w("(sich) entwickeln", "to develop; develop"),
    w("Gegend; Gebiet", "area; region"),
    w("verdienen", "to earn; earn", "Geld ..."),
    // --- More about ---
    w("Wasserfall", "waterfall"),
    w("Wüste", "desert"),
    w("Tierwelt", "wildlife"),
    w("Gletscher", "glacier"),
    // --- Dictionary skills ---
    w("Geruch; Duft", "smell"),
    w("fernhalten", "to keep away; keep away"),
    w("Schlitten", "sled; sledge"),
    w("Vorräte", "supplies"),
    // --- Das kenne ich schon: phrases with -ing ---
    w("gut sein in", "to be good at; be good at"),
    w("hassen", "to hate; hate"),
  ]],
  "u3-test1": ["Intro bis Topic 2", [
    // --- Intro ---
    w("südlich; Süd-", "southern; south"),
    w("die Karibik", "the Caribbean; Caribbean"),
    w("Sumpf", "swamp"),
    w("Dampfschiff; Dampfer", "steamboat; steamship"),
    w("stolz (auf)", "proud; proud of"),
    w("Klima", "climate"),
    w("Wirbelsturm; Hurrikan", "hurricane"),
    w("unabhängig", "independent"),
    w("Musiker; Musikerin", "musician"),
    // --- Topic 1 ---
    w("Ehemann", "husband"),
    w("(etwas tun) können; fähig sein", "to be able to; be able to", "nicht: can"),
    w("Truthahn; Pute", "turkey"),
    w("Fleisch", "meat"),
    w("Gericht; Speise", "dish; meal"),
    w("Kartoffel", "potato"),
    w("dankbar", "thankful; grateful"),
    w("(etwas tun) dürfen", "to be allowed to; be allowed to", "nicht: may"),
    w("am Verhungern; sehr hungrig", "starving"),
    // --- Das kenne ich schon: food and drink ---
    w("Mahlzeit", "meal"),
    w("Hähnchen; Huhn", "chicken"),
    w("Erdbeere", "strawberry"),
    w("Pommes frites", "chips; fries; French fries"),
    // --- Topic 2 ---
    w("gestern Abend", "last night; yesterday evening"),
    w("Krankenpfleger; Krankenschwester", "nurse"),
    w("Gewalt", "violence"),
    w("kompliziert", "complicated"),
    w("vermeiden; aus dem Weg gehen", "to avoid; avoid"),
    w("Tierarzt; Tierärztin", "vet"),
    w("Friseur; Friseurin", "hairdresser"),
    w("anderer Meinung sein", "to disagree; disagree"),
  ]],
  "u3-test2": ["phrasal verbs bis Vocabulary skills", [
    // --- Das kenne ich schon: phrasal verbs ---
    w("herausfinden", "to find out; find out"),
    w("aufstehen", "to get up; get up", "morgens aus dem Bett"),
    w("aufgeben", "to give up; give up"),
    w("sich hinsetzen", "to sit down; sit down"),
    // --- Text ---
    w("Haupt-", "main", "die ...straße"),
    w("Hütte", "cabin; hut"),
    w("entkommen; fliehen", "to escape; escape"),
    w("tot", "dead"),
    w("damit; sodass", "so that"),
    w("suchen (nach)", "to look for; look for; to search for; search for"),
    w("Himmel", "sky"),
    w("wahrscheinlich", "probably"),
    w("Ast; Zweig", "branch"),
    w("Rauch", "smoke"),
    w("scheinen", "to seem; seem", "Er scheint müde zu sein."),
    w("erklären", "to explain; explain"),
    w("wenigstens; mindestens", "at least"),
    w("während", "while; during"),
    w("erkunden; erforschen", "to explore; explore"),
    w("Höhle", "cave"),
    // --- Das kenne ich schon: conjunctions ---
    w("weil", "because"),
    // --- Film ---
    w("abstimmen; wählen", "to vote; vote"),
    w("Luftballon", "balloon"),
    w("schrecklich; furchtbar", "terrible; awful; horrible"),
    // --- More about ---
    w("Seeräuber; Pirat", "pirate"),
    w("angreifen", "to attack; attack"),
    w("reich", "rich"),
    w("Soldat; Soldatin", "soldier"),
    // --- Vocabulary skills ---
    w("Bewegung", "movement"),
    w("unmöglich", "impossible"),
  ]],
  "u4-test1": ["Intro bis Topic 2", [
    // --- Intro ---
    w("Eishockey", "ice hockey"),
    w("Ahorn", "maple"),
    w("Blatt", "leaf", "am Baum"),
    w("kanadisch", "Canadian"),
    w("Grenze", "border"),
    w("Siedler; Siedlerin", "settler"),
    w("französisch", "French"),
    w("Mehrheit", "majority"),
    w("Amtssprache", "official language"),
    w("Arktis", "Arctic; the Arctic"),
    // --- Topic 1 ---
    w("privat", "private"),
    w("verrückt", "crazy; mad"),
    w("statt; anstatt", "instead of; instead"),
    w("Urheberrecht", "copyright"),
    w("Anleitung", "tutorial", "als Video im Internet"),
    w("Folge", "episode", "einer Serie"),
    w("herunterladen", "to download; download"),
    w("trotzdem; sowieso", "anyway"),
    // --- Topic 2 ---
    w("Bewerbung", "application"),
    w("Fähigkeit; Fertigkeit", "skill"),
    w("Muttersprachler; Muttersprachlerin", "native speaker"),
    w("fließend", "fluent", "eine Sprache ... sprechen"),
    w("anbieten; bieten", "to offer; offer"),
    w("Gehalt", "salary"),
    w("Lebenslauf", "CV; curriculum vitae"),
    w("sich bewerben (für/um)", "to apply; apply; to apply for; apply for"),
    w("Erfahrung", "experience"),
    w("Praktikum", "internship; work experience"),
    w("selbstbewusst; selbstsicher", "confident"),
    w("zuverlässig; verlässlich", "reliable"),
  ]],
  "u4-test2": ["Text bis Speaking skills", [
    // --- Text ---
    w("Bahnhof", "railway station; train station; station"),
    w("flexibel", "flexible"),
    w("Arbeitszeit", "working hours"),
    w("umgehen (mit)", "to deal with; deal with; to deal; deal"),
    w("Reisebürokaufmann; Reisebürokauffrau", "travel agent"),
    w("freundlich", "friendly; kind"),
    w("Verantwortung; Aufgabe", "responsibility"),
    w("Abschluss; Qualifikation", "qualification"),
    w("Geburtsdatum", "date of birth"),
    w("Bildung; Ausbildung", "education"),
    w("Grundschule", "primary school; elementary school"),
    w("russisch", "Russian"),
    w("Arbeitszeugnis; Referenz", "reference"),
    w("verfügbar; erhältlich", "available"),
    w("Anfrage", "request"),
    // --- Das kenne ich schon: travel words ---
    w("Frühstückspension", "bed and breakfast; bed & breakfast; B&B; B & B"),
    w("aussteigen", "to get off; get off", "aus dem Bus oder Zug"),
    // --- Film ---
    w("vorziehen; lieber mögen", "to prefer; prefer"),
    w("sich konzentrieren (auf)", "to focus; focus; to focus on; focus on; to concentrate; concentrate; to concentrate on; concentrate on"),
    w("vertrauen", "to trust; trust"),
    w("hervorragend", "excellent"),
    // --- More about ---
    w("Pfannkuchen", "pancake"),
    w("Seife", "soap"),
    w("nördlich; Nord-", "northern; north"),
    w("Feld; Wiese", "field"),
    w("Wanderweg; Strecke", "trail; path"),
    w("gefroren", "frozen"),
    w("Gebirge; Bergkette", "mountain range; mountains"),
    // --- Das kenne ich schon: climate ---
    w("trocken", "dry"),
    // --- Speaking skills ---
    w("Stellenanzeige", "job ad; job advert; job advertisement"),
  ]]
};

const TESTS = {};
for (const [key, [stoff, items]] of Object.entries(WOERTER)) {
  const [, unit, nr] = /^u(\d)-test(\d)$/.exec(key);
  if (items.length !== 30) throw new Error(`Vokabeltest 8M ${key}: ${items.length} Wörter statt 30`);
  const id = `e8m-${key}`;
  TESTS[id] = {
    id,
    title: `8M · Unit ${unit} · Vokabeltest ${nr} - ${stoff}`,
    unit: `Englisch 8M / Unit ${unit}`,
    thema: U[unit],
    classLevel: "8M",
    direction: "de-en",
    items
  };
}

module.exports = { TESTS };
