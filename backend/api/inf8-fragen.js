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
  },

  /* ================= Probe 2: Datenschutz und Big Data (Modul 2) ================= */
  "inf8-p2-r": {
    id: "inf8-p2-r", zug: "R", thema: "daten", minutes: 20,
    title: "Probe 2 (8R): Datenschutz und Big Data",
    scope: "Datenspuren, Datenschutzbedingungen, Big Data, Schutzmaßnahmen",
    items: [
      c("Welche Angabe gehört zu den personenbezogenen Daten?",
        ["deine Wohnadresse", "die Öffnungszeiten des Freibads", "die Hauptstadt von Bayern", "der Preis einer Kinokarte"], 0),
      m("Ordne jedem Begriff die passende Erklärung zu.",
        [["Datenspur", "alles, was du bei der Nutzung im Netz hinterlässt"], ["Pflichtfeld", "muss in einem Formular ausgefüllt werden"], ["Einwilligung", "dein Ja zu den Bedingungen eines Dienstes"], ["Cookie", "legt eine Internetseite in deinem Browser ab"]]),
      c("Mert meldet sich in einem Forum für Angelfreunde an. Das Formular hat Felder mit und ohne Sternchen. Was ist am sparsamsten?",
        ["nur die Felder mit Sternchen ausfüllen", "alle Felder ausfüllen, das wirkt höflicher", "nur die Felder ohne Sternchen ausfüllen", "das Formular von einem Freund ausfüllen lassen"], 0),
      c("Eine Taschenrechner-App will auf dein Mikrofon und deinen Standort zugreifen. Was machst du?",
        ["beides ablehnen – zum Rechnen braucht sie das nicht", "beides erlauben – sonst rechnet sie vielleicht falsch", "nur den Standort erlauben – der ist immer harmlos", "beides erlauben – man kann es später nie mehr ändern"], 0),
      c("Du hast bei einer Hörbuch-App auf „Akzeptieren“ getippt. Eine Woche später willst du dein Ja zurücknehmen. Geht das?",
        ["Ja – eine Einwilligung darf ich jederzeit widerrufen.", "Nein – ein einmal gegebenes Ja gilt dann für immer.", "Nur, wenn ich mir dafür ein neues Handy kaufe.", "Nur noch am selben Tag bis genau Mitternacht."], 0),
      m("In den Bedingungen einer Wander-App steht: „Wir speichern deine Routen (1), um dir Touren vorzuschlagen (2), und geben sie an Sportgeschäfte weiter (3).“ Welche Frage beantwortet jede Stelle?",
        [["Stelle (1): deine Routen", "Welche Daten?"], ["Stelle (2): um dir Touren vorzuschlagen", "Wozu?"], ["Stelle (3): an Sportgeschäfte", "Wer bekommt sie?"]]),
      c("Bei welchem Beispiel steckt Big Data dahinter?",
        ["Eine Bahn-App zeigt an, welche Züge heute besonders voll sind.", "Du misst mit einem Lineal, wie lang und wie breit dein Heft ist.", "Du speicherst die neue Telefonnummer deiner Oma in deinem Handy.", "Du machst mit dem Handy ein Foto vom Tafelbild der letzten Stunde."], 0),
      c("Ein Supermarkt wertet aus, was eine Kundin mit ihrer Kundenkarte kauft: Windeln, Babybrei, Schnuller. Was kann der Computer daraus schließen?",
        ["Im Haushalt lebt wahrscheinlich ein Baby.", "Die Kundin ist von Beruf bestimmt Lehrerin.", "Die Kundin hat sicher keinen Führerschein.", "Der Supermarkt ist bald ganz ausverkauft."], 0),
      c("Eine Rätsel-App kostet nichts. Trotzdem verdient der Anbieter Geld. Wer bezahlt ihn?",
        ["Firmen, die in der App ihre Werbung zeigen", "der Hersteller, der dein Handy gebaut hat", "die Schule, in der du die App benutzt", "niemand – er arbeitet völlig umsonst"], 0),
      m("Welche Schutzmaßnahme passt zu welcher Situation?",
        [["Eine Schnitzeljagd-App soll Karlas Ort nur kennen, solange sie geöffnet ist.", "Standort nur beim Verwenden erlauben"], ["Selin will, dass nur ihre Freundinnen ihre Urlaubsbilder sehen.", "Profil auf privat stellen"], ["Ben will nach einer Suche nicht überall Skateboard-Werbung sehen.", "Werbe-Cookies ablehnen"], ["Eine Mal-App fragt beim ersten Start nach dem Adressbuch.", "Zugriff auf die Kontakte ablehnen"]]),
      c("Ein Cookie-Fenster hat einen großen Knopf „Alle akzeptieren“ und einen kleinen Link „Anpassen“. Wie kommst du zu den wenigsten Cookies?",
        ["über „Anpassen“ und dann nur die notwendigen erlauben", "über „Alle akzeptieren“, weil das am schnellsten geht", "indem du das Fenster einfach lange genug anschaust", "indem du die Seite in einem zweiten Tab öffnest"], 0),
      t("Die App einer Pizzeria fragt nach deiner Adresse und will auf deine Fotos zugreifen. Schreibe zu beidem: Braucht die App das? Begründe kurz. Stichworte genügen.",
        "Adresse: ja, sonst kann die Pizza nicht geliefert werden. Fotos: nein, zum Bestellen braucht die App meine Fotos nicht. Den Zugriff lehne ich ab.",
        ["Adresse: wird gebraucht, mit passendem Grund (Lieferung)", "Fotos: werden nicht gebraucht bzw. Zugriff ablehnen, mit passendem Grund"],
        ["liefer|bring|gebracht|komm|zustell|wohin|fahr|fähr|schick|wohn|find", "unnötig|nicht nötig|nicht notwendig|überflüssig|lehn|nein|verweiger|nichts an|braucht die app nicht|braucht sie nicht|braucht man nicht|braucht es nicht|brauche ich nicht|keine fotos|fotos nicht|egal"])
    ]
  },
  "inf8-p2-m": {
    id: "inf8-p2-m", zug: "M", thema: "daten", minutes: 20,
    title: "Probe 2 (8M): Datenschutz und Big Data",
    scope: "Personenbezogene Daten, Datenschutzbedingungen auswerten, Big Data, Schutzmaßnahmen bewerten",
    items: [
      c("Welche Aussage über personenbezogene Daten stimmt?",
        ["Auch dein Standort und dein Suchverlauf gehören dazu.", "Dazu zählt nur, was in deinem Ausweis steht.", "Dazu zählt nur, was du selbst eingetippt hast.", "Sie entstehen nur bei der Anmeldung in einer App."], 0),
      m("Ordne jedem Begriff die passende Erklärung zu.",
        [["Widerruf", "ein gegebenes Ja wieder zurücknehmen"], ["Dritte", "andere Firmen, die deine Daten bekommen"], ["Zweck", "sagt, wofür ein Anbieter Daten haben will"], ["Profil", "Bild einer Person aus vielen Einzeldaten"]]),
      t("In den Bedingungen einer Hausaufgaben-App steht: „Wir speichern deine Klasse und deine Fotos von Arbeitsblättern, um dir Lösungswege zu zeigen. Wir geben diese Daten an Nachhilfe-Firmen weiter.“ Beantworte in Stichworten: Welche Daten? Wozu? Wer bekommt sie?",
        "Welche Daten: die Klasse und die Fotos der Arbeitsblätter. Wozu: um Lösungswege zu zeigen. Wer bekommt sie: Nachhilfe-Firmen.",
        ["Daten richtig genannt (Klasse und/oder Fotos der Arbeitsblätter)", "Zweck richtig genannt (Lösungswege zeigen)", "Empfänger richtig genannt (Nachhilfe-Firmen)"],
        ["klasse|foto|arbeitsbl", "lösungsweg|lösung|zeigen|helfen|hilf|erklär", "nachhilfe|firmen|dritte"]),
      c("Noch einmal die Hausaufgaben-App: „Wir speichern deine Klasse und deine Fotos von Arbeitsblättern, um dir Lösungswege zu zeigen. Wir geben diese Daten an Nachhilfe-Firmen weiter.“ Was davon nützt vor allem dem Anbieter und nicht dir?",
        ["die Weitergabe an Nachhilfe-Firmen", "das Zeigen von Lösungswegen", "das Speichern der Klasse", "das Hochladen eines Arbeitsblatts"], 0),
      c("Ein Streamingdienst schlägt dir eine Serie vor. Woher weiß er, was zu dir passen könnte?",
        ["Er vergleicht dein Verhalten mit dem sehr vieler anderer Nutzer.", "Ein Mitarbeiter sucht für jeden Nutzer einzeln etwas heraus.", "Er zeigt allen Menschen auf der Welt dieselben Vorschläge.", "Er liest heimlich alle deine Nachrichten an Freunde mit."], 0),
      t("Ein Computer berechnet aus den Einkäufen eines Kunden: „Dieser Kunde zieht wahrscheinlich bald um.“ Nenne einen Vorteil und einen Nachteil solcher Berechnungen für den Kunden.",
        "Vorteil: Er bekommt passende Angebote, zum Beispiel für Umzugskartons. Nachteil: Das Unternehmen weiß sehr viel über ihn, und die Vermutung kann auch falsch sein.",
        ["ein passender Vorteil (z. B. passende Angebote, Rabatte, Vorschläge)", "ein passender Nachteil (z. B. das Unternehmen weiß viel, die Vermutung kann falsch sein, viel Werbung, Weitergabe der Daten)"],
        ["angebot|rabatt|passend|vorschl|empfehl|günstig|billig|spar|gutschein|praktisch|hilf|tipp", "weiß sehr viel|weiß viel|weiß alles|viel über|kennt|falsch|stimmt nicht|irr|weiter|privat|überwach|ausspion|beobacht|unheimlich|geht niemanden|nerv|mehr werbung|viel werbung"]),
      c("Nora hat ihr Profil auf privat gestellt. Trotzdem schickt ihr die App eine Übersicht: „Du warst diese Woche 9 Stunden online, meistens abends.“ Was zeigt das?",
        ["Der Anbieter sammelt weiter Daten – „privat“ gilt nur gegenüber anderen Nutzern.", "Das private Profil ist kaputt und muss von ihr ganz neu eingestellt werden.", "Fremde Nutzer können ihre Beiträge trotz der Einstellung doch noch sehen.", "Die App hat diese Zahl nur geraten – gespeichert wird bei ihr gar nichts."], 0),
      m("Welche Schutzmaßnahme passt zu welcher Situation?",
        [["Eine Angel-App soll Emres Angelplatz nur kennen, solange er sie benutzt.", "Standort nur beim Verwenden erlauben"], ["Paula will, dass Unbekannte ihre Zeichnungen nicht sehen.", "Profil auf privat stellen"], ["Nach dem Kauf von Inlinern will Tim nicht wochenlang Inliner-Werbung sehen.", "Werbe-Cookies ablehnen"], ["Ein Kartenspiel will beim Start die Telefonnummern deiner Freunde lesen.", "Zugriff auf die Kontakte ablehnen"]]),
      c("Ein Cookie-Fenster zeigt nur „Alle akzeptieren“ und „Einstellungen“. Luis sagt: „Dann muss ich wohl zustimmen.“ Was stimmt?",
        ["Nein – über „Einstellungen“ kann er fast alle Cookies abschalten.", "Ja – ohne seine Zustimmung darf er die Seite gar nicht ansehen.", "Ja – über „Einstellungen“ ändert man nur die Farben der Seite.", "Nein – das Fenster verschwindet, wenn er lange genug wartet."], 0),
      t("Eine kostenlose Würfel-App für Brettspiele verlangt Zugriff auf Kamera, Kontakte und Standort. Würdest du sie installieren? Bewerte die App und begründe mit zwei Punkten.",
        "Nein, ich würde sie nicht installieren. Zum Würfeln braucht die App weder meine Kamera noch meine Kontakte oder meinen Standort. Sie will offenbar vor allem Daten sammeln, vermutlich für Werbung.",
        ["klare Bewertung (nicht installieren bzw. nur ohne diese Berechtigungen)", "Begründung: die Berechtigungen sind für die Aufgabe der App nicht nötig", "weiterer Punkt (z. B. die App sammelt Daten, Werbung, Kontakte sind Daten anderer)"],
        ["nein|nicht installier|würde sie nicht|würde ich nicht|lieber nicht|nicht runterlad|nicht herunterlad|auf keinen fall|lehn", "brauch|nötig|unnötig|wozu|zum würfeln", "sammel|werbung|weiter|verkauf|daten anderer|daten von|nummern|misstrau|datenhungrig|ausspion|abhör|zuhör"]),
      c("Du willst wissen, welche Daten ein Shop über dich gespeichert hat. Was darfst du tun?",
        ["beim Shop Auskunft verlangen", "gar nichts – das ist ein Geschäftsgeheimnis", "nichts – das dürfen nur Erwachsene fragen", "die Daten selbst vom Server des Shops holen"], 0)
    ]
  },

  /* ================= Probe 3: Excel Grundlagen (Modul 3) ================= */
  "inf8-p3-r": {
    id: "inf8-p3-r", zug: "R", thema: "excel1", minutes: 20,
    title: "Probe 3 (8R): Excel Grundlagen",
    scope: "Zelle, Zeile, Spalte, Daten eingeben, erste Formeln, Formeln kopieren",
    items: [
      c("Die Klassen einer Schule sind bei einem Spendenlauf gelaufen. In welcher Zelle steht das Wort „Runden“?",
        ["C1", "1C", "B1", "C2"], 0, { image: "assets/proben/tabelle-spendenlauf.svg", imageAlt: "Tabelle mit den Spalten A bis E und den Zeilen 1 bis 6. Zeile 1: Klasse, Kinder, Runden, Euro je Runde, Spende. Zeile 2: 8a, 24, 120, 0,5. Zeile 3: 8b, 22, 95, 0,5. Zeile 4: 8c, 26, 140, 0,5. Zeile 5: 8d, 23, 110, 0,5. Zeile 6: Zusammen. Die Zellen E2 bis E6 sind leer und gelb markiert." }),
      c("Was steht in der Zelle A4?",
        ["8c", "8b", "140", "26"], 0, { image: "assets/proben/tabelle-spendenlauf.svg", imageAlt: "Tabelle mit den Spalten A bis E und den Zeilen 1 bis 6. Zeile 1: Klasse, Kinder, Runden, Euro je Runde, Spende. Zeile 2: 8a, 24, 120, 0,5. Zeile 3: 8b, 22, 95, 0,5. Zeile 4: 8c, 26, 140, 0,5. Zeile 5: 8d, 23, 110, 0,5. Zeile 6: Zusammen. Die Zellen E2 bis E6 sind leer und gelb markiert." }),
      c("Du klickst in Excel auf eine Zelle. Wo liest du ab, welche Adresse sie hat?",
        ["im Namenfeld", "in der Bearbeitungsleiste", "im Blattregister", "in der Titelleiste"], 0),
      c("Lena tippt in die Zelle C2 „120 Runden“ ein. Was ist das für Excel?",
        ["ein Text – damit kann Excel nicht rechnen", "eine Zahl – das Wort stört Excel nicht", "ein Datum – wegen der Zahl am Anfang", "eine Formel – wegen des Leerzeichens"], 0),
      c("Welche Eingabe versteht Excel als Zahl?",
        ["0,5", "0;5", "0,5 Euro", "ein halb"], 0),
      c("Welche Formel rechnet in E3 die Spende der 8b aus (Runden mal Euro je Runde)?",
        ["=C3*D3", "=B3*C3", "=C3xD3", "=C3+D3"], 0, { image: "assets/proben/tabelle-spendenlauf.svg", imageAlt: "Tabelle mit den Spalten A bis E und den Zeilen 1 bis 6. Zeile 1: Klasse, Kinder, Runden, Euro je Runde, Spende. Zeile 2: 8a, 24, 120, 0,5. Zeile 3: 8b, 22, 95, 0,5. Zeile 4: 8c, 26, 140, 0,5. Zeile 5: 8d, 23, 110, 0,5. Zeile 6: Zusammen. Die Zellen E2 bis E6 sind leer und gelb markiert." }),
      c("In einer anderen Tabelle steht in F2 die Formel =D2+E2. Sie wird mit dem Ausfüllkästchen bis F6 kopiert. Welche Formel steht danach in F6?",
        ["=D6+E6", "=D2+E2", "=F2+F6", "=D6+E2"], 0),
      c("Welche Formel zählt in E6 alle vier Spenden zusammen?",
        ["=SUMME(E2:E5)", "=SUMME(C2:D5)", "=E2:E5", "=E2+E5"], 0, { image: "assets/proben/tabelle-spendenlauf.svg", imageAlt: "Tabelle mit den Spalten A bis E und den Zeilen 1 bis 6. Zeile 1: Klasse, Kinder, Runden, Euro je Runde, Spende. Zeile 2: 8a, 24, 120, 0,5. Zeile 3: 8b, 22, 95, 0,5. Zeile 4: 8c, 26, 140, 0,5. Zeile 5: 8d, 23, 110, 0,5. Zeile 6: Zusammen. Die Zellen E2 bis E6 sind leer und gelb markiert." }),
      c("Die Gesamtspende in E6 soll gleichmäßig an 4 Vereine gehen. Welche Formel rechnet aus, was jeder Verein bekommt?",
        ["=E6/4", "=E6:4", "=E6*4", "=4/E6"], 0),
      m("Was zeigt Excel an? Ordne jeder Eingabe die Anzeige zu.",
        [["=C2+A2 (in A2 steht „8a“)", "#WERT!"], ["4.2 (gemeint ist die Zahl 4,2)", "04. Feb"], ["=C2/0", "#DIV/0!"], ["=SUME(E2:E5)", "#NAME?"]]),
      o("So kopierst du eine Formel nach unten. Bringe die Schritte in die richtige Reihenfolge.",
        ["Die Formel in die erste Zelle schreiben", "Die Zelle mit der Formel anklicken", "Auf das kleine Quadrat unten rechts zeigen", "Bei gedrückter Maustaste nach unten ziehen"]),
      t("In E2 steht die Zahl 60. Jemand hat sie mit dem Taschenrechner ausgerechnet und eingetippt. Warum wäre eine Formel besser? Ein Satz genügt.",
        "Mit einer Formel rechnet Excel von selbst neu, wenn sich die Zahl der Runden ändert. Eine eingetippte Zahl bleibt stehen und ist dann falsch.",
        ["die Formel rechnet von selbst neu bzw. passt sich an", "Bezug auf geänderte Zahlen (die eingetippte Zahl bleibt stehen und stimmt dann nicht mehr)"],
        ["rechnet neu|neu berechn|neu aus|selbst|selber|allein|automatisch|passt sich|aktualisier|rechnet mit|mitrechn", "änder|ander|mehr runden|weniger runden|bleibt stehen|stimmt nicht mehr|stimmt dann nicht|dann falsch|nicht mehr stimm"], { image: "assets/proben/tabelle-spendenlauf.svg", imageAlt: "Tabelle mit den Spalten A bis E und den Zeilen 1 bis 6. Zeile 1: Klasse, Kinder, Runden, Euro je Runde, Spende. Zeile 2: 8a, 24, 120, 0,5. Zeile 3: 8b, 22, 95, 0,5. Zeile 4: 8c, 26, 140, 0,5. Zeile 5: 8d, 23, 110, 0,5. Zeile 6: Zusammen. Die Zellen E2 bis E6 sind leer und gelb markiert." })
    ]
  },
  "inf8-p3-m": {
    id: "inf8-p3-m", zug: "M", thema: "excel1", minutes: 20,
    title: "Probe 3 (8M): Excel Grundlagen",
    scope: "Das Excel-Fenster, Daten eingeben, Formeln selbst schreiben und kopieren, Fehler erklären",
    items: [
      c("Die Klassen einer Schule sind bei einem Spendenlauf gelaufen. In welcher Zelle steht die Rundenzahl der 8c?",
        ["C4", "B4", "4C", "D4"], 0, { image: "assets/proben/tabelle-spendenlauf.svg", imageAlt: "Tabelle mit den Spalten A bis E und den Zeilen 1 bis 6. Zeile 1: Klasse, Kinder, Runden, Euro je Runde, Spende. Zeile 2: 8a, 24, 120, 0,5. Zeile 3: 8b, 22, 95, 0,5. Zeile 4: 8c, 26, 140, 0,5. Zeile 5: 8d, 23, 110, 0,5. Zeile 6: Zusammen. Die Zellen E2 bis E6 sind leer und gelb markiert." }),
      c("Welche Eingabe versteht Excel als Zahl?",
        ["0,5", "0;5", "0,5 Euro", "ein halb"], 0),
      t("Schreibe die drei Formeln auf. a) Die Formel für E2 (Spende der 8a: Runden mal Euro je Runde). b) Du kopierst die Formel aus E2 nach unten bis E5. Welche Formel steht dann in E4? c) Die Formel für E6 (alle vier Spenden zusammen).",
        "a) =C2*D2 b) =C4*D4 c) =SUMME(E2:E5)",
        ["a) richtige Formel für E2: =C2*D2 (auch =D2*C2); ohne Gleichheitszeichen kein Punkt", "b) richtige Formel für E4: =C4*D4 (auch =D4*C4); ohne Gleichheitszeichen kein Punkt", "c) richtige Formel für E6: =SUMME(E2:E5) oder =E2+E3+E4+E5; ohne Gleichheitszeichen kein Punkt"],
        ["=c2*d2|=d2*c2|= c2*d2|= d2*c2|=c2 * d2|=d2 * c2|= c2 * d2|= d2 * c2|=c2 *d2|=c2* d2", "=c4*d4|=d4*c4|= c4*d4|= d4*c4|=c4 * d4|=d4 * c4|= c4 * d4|= d4 * c4|=c4 *d4|=c4* d4", "=summe(e2:e5)|= summe(e2:e5)|=summe (e2:e5)|=summe(e2 : e5)|=e2+e3+e4+e5|= e2+e3+e4+e5|=e2 + e3 + e4 + e5|= e2 + e3 + e4 + e5|=summe(e2;e3;e4;e5)|=e5+e4+e3+e2"], { image: "assets/proben/tabelle-spendenlauf.svg", imageAlt: "Tabelle mit den Spalten A bis E und den Zeilen 1 bis 6. Zeile 1: Klasse, Kinder, Runden, Euro je Runde, Spende. Zeile 2: 8a, 24, 120, 0,5. Zeile 3: 8b, 22, 95, 0,5. Zeile 4: 8c, 26, 140, 0,5. Zeile 5: 8d, 23, 110, 0,5. Zeile 6: Zusammen. Die Zellen E2 bis E6 sind leer und gelb markiert." }),
      c("In einer anderen Tabelle steht in E3 die Formel =C3-D3. Du ziehst sie mit dem Ausfüllkästchen eine Zelle nach rechts, in F3. Welche Formel steht jetzt in F3?",
        ["=D3-E3", "=C3-D3", "=C4-D4", "=D4-E4"], 0),
      m("Welche Formel rechnet das aus? Ordne zu.",
        [["der Unterschied der Runden von 8c und 8a", "=C4-C2"], ["die Kinder der 8a und der 8b zusammen", "=B2+B3"], ["doppelt so viele Runden wie die 8d", "=C5*2"], ["Runden je Kind in der 8b", "=C3/B3"]], { image: "assets/proben/tabelle-spendenlauf.svg", imageAlt: "Tabelle mit den Spalten A bis E und den Zeilen 1 bis 6. Zeile 1: Klasse, Kinder, Runden, Euro je Runde, Spende. Zeile 2: 8a, 24, 120, 0,5. Zeile 3: 8b, 22, 95, 0,5. Zeile 4: 8c, 26, 140, 0,5. Zeile 5: 8d, 23, 110, 0,5. Zeile 6: Zusammen. Die Zellen E2 bis E6 sind leer und gelb markiert." }),
      m("Was zeigt Excel an? Ordne jeder Eingabe die Anzeige zu.",
        [["=C2+A2 (in A2 steht „8a“)", "#WERT!"], ["4.2 (gemeint ist die Zahl 4,2)", "04. Feb"], ["=C2/0", "#DIV/0!"], ["=SUME(E2:E5)", "#NAME?"]]),
      t("Tim tippt in C3 „95 Runden“. In E3 steht die Formel für die Spende – dort erscheint jetzt ein Fehlerwert statt einer Zahl. Erkläre den Fehler und schreibe, wie Tim ihn behebt.",
        "Wegen des Wortes hinter der Zahl ist der Eintrag für Excel ein Text. Mit Text kann die Formel nicht rechnen. Tim tippt in C3 nur die Zahl 95 ein.",
        ["Ursache: der Eintrag ist Text bzw. enthält ein Wort – damit kann Excel nicht rechnen", "Behebung: in C3 nur die Zahl eintippen (das Wort weglassen)"],
        ["text|ein wort|das wort|des wortes|wort hinter|wort dahinter|wörter|buchstabe|keine zahl|nicht als zahl|einheit", "nur die zahl|nur 95|nur die 95|ohne runden|ohne text|ohne einheit|ohne das wort|wort weg|runden weg|weglass|wegnehm|rausnehm|wegmach|wort lösch|runden lösch|text lösch|wort entfern|runden entfern|95 eintipp|95 eingeb|neu eintipp|neu tipp|überschrift"], { image: "assets/proben/tabelle-spendenlauf.svg", imageAlt: "Tabelle mit den Spalten A bis E und den Zeilen 1 bis 6. Zeile 1: Klasse, Kinder, Runden, Euro je Runde, Spende. Zeile 2: 8a, 24, 120, 0,5. Zeile 3: 8b, 22, 95, 0,5. Zeile 4: 8c, 26, 140, 0,5. Zeile 5: 8d, 23, 110, 0,5. Zeile 6: Zusammen. Die Zellen E2 bis E6 sind leer und gelb markiert." }),
      c("Welches Ergebnis zeigt eine Zelle mit der Formel =10+4*2?",
        ["18", "28", "16", "20"], 0),
      c("Die Zelle E3 zeigt 47,5. Du willst wissen, ob dort eine Formel oder eine getippte Zahl steht. Wo siehst du nach?",
        ["in der Bearbeitungsleiste", "im Namenfeld", "im Blattregister", "in der Spaltenüberschrift"], 0),
      t("In E2 steht die Zahl 60. Jemand hat sie mit dem Taschenrechner ausgerechnet und eingetippt. Erkläre, warum eine Formel hier besser ist.",
        "Mit einer Formel rechnet Excel von selbst neu, wenn sich die Zahl der Runden ändert. Eine eingetippte Zahl bleibt stehen und ist dann falsch.",
        ["die Formel rechnet von selbst neu bzw. passt sich an", "Bezug auf geänderte Zahlen (die eingetippte Zahl bleibt stehen und stimmt dann nicht mehr)"],
        ["rechnet neu|neu berechn|neu aus|selbst|selber|allein|automatisch|passt sich|aktualisier|rechnet mit|mitrechn", "änder|ander|mehr runden|weniger runden|bleibt stehen|stimmt nicht mehr|stimmt dann nicht|dann falsch|nicht mehr stimm"], { image: "assets/proben/tabelle-spendenlauf.svg", imageAlt: "Tabelle mit den Spalten A bis E und den Zeilen 1 bis 6. Zeile 1: Klasse, Kinder, Runden, Euro je Runde, Spende. Zeile 2: 8a, 24, 120, 0,5. Zeile 3: 8b, 22, 95, 0,5. Zeile 4: 8c, 26, 140, 0,5. Zeile 5: 8d, 23, 110, 0,5. Zeile 6: Zusammen. Die Zellen E2 bis E6 sind leer und gelb markiert." })
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
