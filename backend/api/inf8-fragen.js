"use strict";

/**
 * Informatik 8 (8R und 8M): Proben zu den fünf Modulen, je eine Fassung für R-Klassen (zug "R") und M-Klassen
 * (zug "M"). Lösungen und Erwartungshorizont bleiben ausschließlich im Backend (nie in das Website-Repo kopieren).
 *
 *   thema: Modul der Übersicht (8M/Informatik/themen.js), unter dem die Probe steht:
 *          infosys · daten · excel1 · excel2 · scratch
 *   choice: 1 Punkt · match: 1 Punkt je Paar (jedes Ziel kommt genau einmal vor) ·
 *   order: 1 Punkt je Schritt an der richtigen Stelle · text: 1 Punkt je Kriterium
 *   expected = Musterlösung, criteria = Erwartungshorizont (je Kriterium 1 Punkt), keywords = Stichwortgruppen
 *   für die vorläufige Bewertung ohne KI. Bilder liegen in 8M/Informatik/assets/proben (eigene Zeichnungen,
 *   ohne Kommentare im Quelltext – die Dateien sind öffentlich).
 *
 * Jede Probe dauert etwa 15 bis 20 Minuten. R: Ankreuzen, Zuordnen, Reihenfolge, wenig Text.
 * M: derselbe Stoff mit weniger Hilfen, dazu kurz begründen und bewerten.
 * Aufgaben einer Probe, für die es schon Abgaben gibt, nicht mehr verändern (die Antwortreihenfolge hängt am Text).
 * Beispiele (Namen, Zahlen, Dienste) stehen so in keiner Einheit.
 */

const c = (prompt, options, answer, extra) => ({ type: "choice", prompt, options, answer, points: 1, ...(extra || {}) });
const m = (prompt, pairs, extra) => ({ type: "match", prompt, pairs, points: pairs.length, ...(extra || {}) });
const o = (prompt, steps, extra) => ({ type: "order", prompt, steps, points: steps.length, ...(extra || {}) });
const t = (prompt, expected, criteria, keywords, extra) => ({ type: "text", prompt, expected, criteria, keywords, points: criteria.length, ...(extra || {}) });

const PROBEN = {
  /* ================= Probe 1: Digitale Informationssysteme (Modul 1) ================= */
  "inf8-p1-r": {
    id: "inf8-p1-r", zug: "R", thema: "infosys", minutes: 20,
    title: "Probe 1 (8R): Digitale Informationssysteme",
    scope: "EVA-Prinzip, Aufbau eines Informationssystems, filtern und sortieren, passendes System wählen",
    items: [
      c("Du willst wissen, wann am Samstag ein Bus zum Hallenbad fährt. Welches Informationssystem nutzt du?",
        ["eine Fahrplanauskunft", "ein Berufsportal", "eine Lernplattform", "einen Online-Shop"], 0),
      o("Kemal sucht auf der Seite eines Kinos einen Film für Samstag. Bringe die Schritte in die richtige Reihenfolge.",
        ["Kemal tippt den Namen des Films ein.", "Die Anfrage wird an den Server geschickt.", "Der Server sucht in den gespeicherten Vorstellungen.", "Die Spielzeiten erscheinen auf Kemals Bildschirm."]),
      m("Eine Übersetzer-App hilft dir im Urlaub. Ordne zu: Was gehört zu welchem Schritt?",
        [["das Wort im gespeicherten Wörterbuch nachschlagen", "Verarbeitung"], ["das übersetzte Wort anzeigen und vorlesen", "Ausgabe"], ["ein Wort in das Mikrofon sprechen", "Eingabe"]]),
      c("Was kann eine Lernplattform, was ein Arbeitsblatt aus Papier nicht kann?",
        ["Sie prüft deine Antwort sofort.", "Sie zeigt Aufgaben zu einem Thema.", "Sie bietet einen Text zum Lesen an.", "Sie hat Platz für deinen Namen."], 0),
      m("Ordne jedem Teil eines Informationssystems seine Aufgabe zu.",
        [["Datenbank", "speichert alle Daten geordnet"], ["Internet", "verbindet Gerät und Server"], ["Server", "beantwortet die Anfragen vieler Geräte"], ["Anwendung", "nimmt Eingaben an und zeigt die Ausgabe"]]),
      c("Die App des Schwimmvereins meldet: „Keine Verbindung zum Server“. Was ist der wahrscheinlichste Grund?",
        ["Das Tablet hat gerade kein Internet.", "In der Datenbank fehlen die Trainingszeiten.", "Das Training fällt heute aus.", "Der Verein hat ein neues Mitglied."], 0),
      c("Tarik sucht in einem Portal eine Jacke. Er stellt ein: „nur Größe M“. Was hat er benutzt?",
        ["einen Filter", "eine Sortierung", "eine Anzeige", "eine Datenbank"], 0),
      c("Was passiert, wenn du eine Trefferliste nach dem Preis sortierst?",
        ["Die Reihenfolge ändert sich, es fällt nichts weg.", "Teure Angebote werden aus der Liste gelöscht.", "Das Portal sucht dabei nach neuen Angeboten.", "Die Preise aller Angebote werden niedriger."], 0),
      c("Ein Portal zeigt drei Rucksäcke: einen grauen (22 €, 18 Liter), einen grünen (28 €, 22 Liter) und einen schwarzen (45 €, 30 Liter). Nele hat 30 €. Sie will möglichst viel Platz im Rucksack. Welchen nimmt sie?",
        ["den grünen", "den grauen", "den schwarzen", "keinen der drei"], 0),
      c("Über den Treffern eines Portals steht ein Angebot mit dem Wort „Anzeige“. Was weißt du jetzt?",
        ["Dafür wurde bezahlt – es muss nicht am besten passen.", "Es ist von allen das beste Angebot in der Liste.", "Es ist von allen das neueste Angebot in der Liste.", "Das Portal hat es selbst geprüft und empfohlen."], 0),
      m("Welches Informationssystem passt zu welcher Aufgabe?",
        [["den Preis einer Trinkflasche nachsehen", "Online-Shop"], ["herausfinden, wie ein Regenbogen entsteht", "Suchmaschine"], ["einen Ausbildungsplatz als Koch finden", "Berufsportal"], ["für die Mathe-Probe üben", "Lernplattform"]]),
      c("Zwei Portale zeigen freie Ausbildungsplätze. Portal A wurde letzte Woche geändert, Portal B vor drei Jahren. Welchem vertraust du eher?",
        ["Portal A, weil die Angaben aktuell sind", "Portal B, weil es schon länger besteht", "beiden gleich – das Alter spielt keine Rolle", "keinem – Portale stimmen grundsätzlich nie"], 0),
      t("Du suchst in der App der Stadtbücherei das Buch „Das Geheimnis der Mühle“. Schreibe auf: Was ist hier die Eingabe? Was ist die Ausgabe? Stichworte genügen.",
        "Eingabe: Ich tippe den Titel des Buches in das Suchfeld. Ausgabe: Die App zeigt an, ob das Buch vorhanden ist.",
        ["Eingabe richtig benannt (z. B. den Titel eintippen, ein Suchwort eingeben)", "Ausgabe richtig benannt (z. B. die App zeigt das Ergebnis: Buch vorhanden oder ausgeliehen)"],
        ["tipp|eingeb|eingegeb|schreib|schrieb|titel|suchwort|suchfeld|geheimnis|mühle|buchname|name des buch|name vom buch", "zeig|ergebnis|liste|erschein|bildschirm|vorhanden|verfügbar|ausgeliehen|antwort|ob das buch|ob es|da ist|gibt es|treffer|gefunden"])
    ]
  },
  "inf8-p1-m": {
    id: "inf8-p1-m", zug: "M", thema: "infosys", minutes: 20,
    title: "Probe 1 (8M): Digitale Informationssysteme",
    scope: "Aufbau und Nutzung digitaler Informationssysteme, Fehler einem Teil zuordnen, mit Kriterien entscheiden und bewerten",
    items: [
      c("Welche Aussage beschreibt ein digitales Informationssystem am besten?",
        ["Es speichert Daten und liefert auf eine Anfrage passende Informationen.", "Es ist jedes Gerät, das einen Bildschirm und eine Tastatur besitzt.", "Es ist ein Programm, mit dem man Bilder und Videos bearbeiten kann.", "Es ist ein kleines Netzwerk, das aus genau zwei Computern besteht."], 0),
      o("Sina sucht in der App der Stadtbücherei ein Buch. Bringe die Schritte in die richtige Reihenfolge.",
        ["Sina tippt den Titel in das Suchfeld.", "Die App schickt die Anfrage über das Internet zum Server.", "Der Server sucht in der Datenbank nach dem Titel.", "Der Server schickt das Ergebnis an die App zurück.", "Die App zeigt an, ob das Buch ausgeliehen ist."]),
      m("Ordne jedem Teil eines Informationssystems seine Aufgabe zu.",
        [["Datenbank", "speichert alle Daten geordnet"], ["Internet", "verbindet Gerät und Server"], ["Server", "beantwortet die Anfragen vieler Geräte"], ["Anwendung", "nimmt Eingaben an und zeigt die Ausgabe"]]),
      c("Die App eines Sportvereins zeigt die Trainingszeiten. Seit den Ferien stimmen sie nicht mehr, obwohl die App sofort lädt. Wo liegt der Fehler?",
        ["Die Daten auf dem Server wurden nicht aktualisiert.", "Das Handy hat gerade keine Verbindung zum Server.", "Der Server des Vereins ist ausgeschaltet.", "Die App wurde vom Handy gelöscht."], 0),
      c("Malte filtert in einem Portal für Ferienjobs nach „Gastronomie“ und „bis 3 km“. Er bekommt null Treffer. Was ist der sinnvollste nächste Schritt?",
        ["einen Filter lockern, zum Beispiel die Entfernung vergrößern", "die leere Trefferliste noch nach der Entfernung sortieren", "dieselbe Suche so lange wiederholen, bis Treffer kommen", "die Anzeige anklicken, die ganz oben steht"], 0),
      t("Ein Portal zeigt drei Zelte: ein gelbes (89 €, 2 Personen, 2,1 kg), ein blaues (75 €, 3 Personen, 3,4 kg) und ein rotes (119 €, 2 Personen, 1,3 kg). Jule und ihr Bruder wollen mit dem Rad zelten. Sie haben 100 €, und das Zelt soll möglichst leicht sein. Welches Zelt passt? Begründe mit zwei Angaben aus dem Portal.",
        "Das gelbe Zelt. Es kostet 89 € und liegt damit unter 100 €. Mit 2,1 kg ist es leichter als das blaue. Das rote ist am leichtesten, aber mit 119 € zu teuer.",
        ["richtiges Zelt gewählt: das gelbe", "Begründung mit dem Preis (unter 100 € bzw. das rote ist zu teuer)", "Begründung mit dem Gewicht (leichter als das blaue)"],
        ["gelb", "89|100|119|preis|teuer|günstig|billig|geld|euro|€|leisten|kost", "2,1|3,4|kg|kilo|leicht|gewicht|schwer|wieg"]),
      c("In einer Trefferliste steht ganz oben ein Angebot mit dem Wort „Anzeige“. Was folgt daraus?",
        ["Es steht oben, weil dafür bezahlt wurde.", "Es passt von allen am besten zur Suche.", "Es wurde vom Portal geprüft und empfohlen.", "Es ist das billigste Angebot der Liste."], 0),
      c("Filtern und Sortieren – worin liegt der Unterschied?",
        ["Filtern lässt Treffer weg, Sortieren ändert nur die Reihenfolge.", "Sortieren lässt Treffer weg, Filtern ändert nur die Reihenfolge.", "Beides lässt unpassende Treffer weg, nur verschieden schnell.", "Beides ändert nur die Reihenfolge, es fällt nie etwas weg."], 0),
      m("Welches Informationssystem passt zu welcher Aufgabe?",
        [["sehen, welche Aufgaben die Lehrkraft eingestellt hat", "Lernplattform"], ["eine Seite zu einem unbekannten Thema finden", "Suchmaschine"], ["Verbindungen mit Umsteigen nachsehen", "Fahrplanauskunft"], ["die Voraussetzungen für einen Beruf nachlesen", "Berufsportal"]]),
      t("Zwei Portale informieren über Ausbildungsberufe. „Azubihafen“: Anbieter ist eine Handwerkskammer, letzte Änderung vor drei Tagen, keine Anmeldung nötig. „Jobwirbel“: Anbieter ist eine Werbefirma, letzte Änderung vor zwei Jahren, Anmeldung mit Adresse und Geburtsdatum. Welches Portal empfiehlst du? Begründe mit zwei Kriterien.",
        "Ich empfehle Azubihafen. Die Angaben sind aktuell, denn sie wurden vor drei Tagen geändert. Bei Jobwirbel sind sie zwei Jahre alt. Außerdem verlangt Azubihafen keine Anmeldung mit persönlichen Daten.",
        ["empfiehlt Azubihafen", "ein richtiges Kriterium (z. B. Angaben sind aktuell; Anbieter ist keine Werbefirma; keine Anmeldung nötig)", "ein zweites richtiges Kriterium"],
        ["azubihafen|azubi hafen|azubi-hafen", "aktuell|drei tage|veraltet|zwei jahre|geändert|älter|neuer", "anmeld|adresse|geburtsdatum|anbieter|handwerkskammer|werbefirma|werbung|persönliche daten"]),
      t("Lenas Handy ist kaputt. Sie meldet sich auf einem neuen Handy in der App der Musikschule an. Ihr Stundenplan und alle Nachrichten sind sofort wieder da. Erkläre, warum.",
        "Stundenplan und Nachrichten waren nie nur auf dem alten Handy gespeichert, sondern auf dem Server der Musikschule. Das neue Handy ruft sie von dort ab.",
        ["die Daten liegen auf dem Server bzw. in einer Datenbank (nicht auf dem Handy)", "das Gerät holt oder lädt die Daten von dort (Anfrage an den Server)"],
        ["server|datenbank|zentral|im internet|online|cloud|nicht auf dem handy|nicht im handy", "hol|lad|läd|abruf|ruft|anfrag|bekomm|schick|übertrag"])
    ]
  }
};

// als Kopie: Das Mischen verändert die Aufgaben
module.exports = JSON.parse(JSON.stringify(PROBEN));

// Antwortreihenfolge fest mischen (beim Schreiben steht die richtige Antwort meist an derselben Stelle), siehe proben-mischen.js
require("./proben-mischen").mischeAlle(module.exports);

// nur für Tests: die Vorlage ohne Mischen
Object.defineProperty(module.exports, "__vorlage", { value: PROBEN, enumerable: false });
// (c, m, o, t werden mit den Proben gebraucht)
void [c, m, o, t];
