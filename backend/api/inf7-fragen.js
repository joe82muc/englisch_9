"use strict";

/**
 * Informatik 7 (7R und 7M): Proben zu den fünf Modulen, je eine Fassung für R-Klassen (zug "R") und M-Klassen
 * (zug "M"). Lösungen und Erwartungshorizont bleiben ausschließlich im Backend (nie in das Website-Repo kopieren).
 *
 *   thema: Modul der Übersicht (7M/Informatik/themen.js), unter dem die Probe steht:
 *          sicher · filius · gimp · inkscape · scratch
 *   choice: 1 Punkt · match: 1 Punkt je Paar (jedes Ziel kommt genau einmal vor) ·
 *   order: 1 Punkt je Schritt an der richtigen Stelle · text: 1 Punkt je Kriterium
 *   expected = Musterlösung, criteria = Erwartungshorizont (je Kriterium 1 Punkt), keywords = Stichwortgruppen
 *   für die vorläufige Bewertung ohne KI. Bilder liegen in 7M/Informatik/assets/proben (eigene Zeichnungen,
 *   ohne Kommentare im Quelltext – die Dateien sind öffentlich).
 *
 * Jede Probe dauert etwa 15 bis 20 Minuten. R: Ankreuzen, Zuordnen, Reihenfolge, wenig Text.
 * M: derselbe Stoff, dazu Fehler finden und kurz begründen.
 * Aufgaben einer Probe, für die es schon Abgaben gibt, nicht mehr verändern (die Antwortreihenfolge hängt am Text).
 */

const c = (prompt, options, answer, extra) => ({ type: "choice", prompt, options, answer, points: 1, ...(extra || {}) });
const m = (prompt, pairs, extra) => ({ type: "match", prompt, pairs, points: pairs.length, ...(extra || {}) });
const o = (prompt, steps, extra) => ({ type: "order", prompt, steps, points: steps.length, ...(extra || {}) });
const t = (prompt, expected, criteria, keywords, extra) => ({ type: "text", prompt, expected, criteria, keywords, points: criteria.length, ...(extra || {}) });

const PROBEN = {
  /* ================= Probe 1: Internet und Sicherheit (Modul 1) ================= */
  "inf7-p1-r": {
    id: "inf7-p1-r", zug: "R", thema: "sicher", minutes: 20,
    title: "Probe 1 (7R): Internet und Sicherheit",
    scope: "Wege der Kommunikation, E-Mail, Weg einer Nachricht, Spam und Phishing, Passwörter, Rechte im Netz",
    items: [
      c("Dein Fahrradlicht geht nicht mehr. Du möchtest viele Menschen fragen, die sich damit auskennen. Alle sollen die Antworten mitlesen können. Welcher Weg passt am besten?",
        ["Eine Frage in einem Forum", "Eine E-Mail an einen Freund", "Eine Videokonferenz mit der Klasse", "Ein gemeinsames Dokument"], 0),
      m("Ordne jedem Feld einer E-Mail zu, wofür es da ist.",
        [["Betreff", "Thema der E-Mail in wenigen Wörtern"], ["An", "Empfänger der Nachricht"], ["Bcc", "Kopie, die für die anderen unsichtbar bleibt"], ["Cc", "Kopie, die für alle sichtbar ist"]]),
      o("Elif schickt Jonas eine Nachricht. Das Handy von Jonas ist ausgeschaltet. Bringe den Weg der Nachricht in die richtige Reihenfolge.",
        ["Elif tippt auf „Senden“.", "Über das Internet kommt die Nachricht zum Server des Dienstes.", "Der Server hebt die Nachricht auf.", "Das Handy von Jonas geht online und bekommt die Nachricht."]),
      c("Du bekommst diese Nachricht: „Ihr Konto bei der Stadtbank wird heute gesperrt. Melden Sie sich sofort hier an: stadtbank.example.kunden-hilfe.example“. Was ist das?",
        ["Ein Betrugsversuch – jemand will an dein Passwort kommen.", "Eine echte Nachricht der Bank – du solltest dich schnell anmelden.", "Eine Warnung vor Betrügern – die Bank will dich schützen.", "Ein Versehen – die Nachricht war für jemand anderen bestimmt."], 0),
      c("Welche Adresse gehört wirklich zum Spieleladen „Spielekiste“?",
        ["www.spielekiste.example/angebote", "spielekiste.example.gratis-punkte.example/angebote", "www.spilekiste.example/angebote", "www.spielekiste-gewinn.example/angebote"], 0),
      m("Ordne jedem Begriff die passende Erklärung zu.",
        [["Spam", "Massen-Nachrichten, meist Werbung"], ["Phishing", "gefälschte Nachricht, die Passwörter stiehlt"], ["Kettenbrief", "Nachricht, die du weiterschicken sollst"], ["Falschmeldung", "erfundene Meldung, die aufregen soll"]]),
      c("Was macht ein Passwort sicher?",
        ["Es ist lang und mischt Buchstaben, Zahlen und Sonderzeichen.", "Es ist kurz und einfach, damit man es sich gut merken kann.", "Es besteht aus dem eigenen Vornamen und dem Geburtsjahr.", "Es ist genau dasselbe Passwort wie bei den besten Freunden."], 0),
      c("Eine Wecker-App möchte auf deine Fotos und deinen Standort zugreifen. Was machst du?",
        ["Ich lehne beides ab – ein Wecker braucht das nicht.", "Ich lehne ab – einer App darf man nie etwas erlauben.", "Ich erlaube beides – sonst klingelt der Wecker nicht.", "Ich erlaube beides – Apps fragen nur, was sie brauchen."], 0),
      m("Ordne zu: Was bedeutet das?",
        [["Recht am eigenen Bild", "Wer zu erkennen ist, entscheidet über das Foto."], ["Urheberrecht", "Wer etwas erschafft, bestimmt, wer es nutzen darf."], ["Quelle", "Sie nennt, woher ein Bild oder Text stammt."]]),
      c("Auf dem Wandertag hast du ein lustiges Foto von Samira gemacht. Sie möchte nicht, dass es in den Klassenchat kommt. Was ist richtig?",
        ["Ich schicke es nicht – Samira entscheidet über ihr Bild.", "Ich schicke es nicht – Fotos vom Wandertag sind immer verboten.", "Ich darf es schicken, weil ich das Foto selbst gemacht habe.", "Ich darf es schicken – der Klassenchat ist ja nicht öffentlich."], 0),
      c("In der Klassengruppe wird ein Mitschüler seit Tagen beleidigt. Was hilft ihm am meisten?",
        ["Ich halte zu ihm und hole eine Lehrkraft dazu.", "Ich lache mit, damit ich nicht selbst gemobbt werde.", "Ich leite die Nachrichten an andere Klassen weiter.", "Ich tue nichts – das hört von allein wieder auf."], 0),
      c("Welches Bild darfst du ohne zu fragen auf deine eigene Internetseite stellen?",
        ["ein Landschaftsfoto, das du selbst gemacht hast", "ein Foto aus der Bildersuche, bei dem nichts dabeisteht", "eine Seite aus einem Buch, die du abfotografiert hast", "das Profilbild einer bekannten Sängerin"], 0),
      t("Du bekommst diese SMS: „Mobinet: Deine Rechnung ist offen. Zahle bis heute 20 Uhr unter mobinet.example.rechnung-zahlen.example, sonst wird dein Handy gesperrt.“ Nenne zwei Warnzeichen und schreibe, was du mit der SMS machst. Stichworte genügen.",
        "Warnzeichen: Die SMS macht Zeitdruck („bis heute 20 Uhr“) und droht damit, das Handy zu sperren. Die Adresse gehört nicht zu Mobinet, denn direkt vor der Endung steht „rechnung-zahlen“. Ich tippe den Link nicht an, gebe nichts ein, lösche die SMS und sage es einem Erwachsenen.",
        ["ein richtiges Warnzeichen (z. B. Zeitdruck, Drohung, Geld zahlen über einen Link, fremde Adresse)", "ein zweites richtiges Warnzeichen", "richtige Reaktion (z. B. Link nicht antippen, nichts eingeben, löschen, einem Erwachsenen sagen)"],
        ["zeitdruck|20 uhr|heute|schnell|eilig|droh|sperr", "adresse|endung|rechnung-zahlen|geld|zahlen|unbekannt", "nicht an|nichts ein|lösch|ignorier|erwachsen|eltern|melde"])
    ]
  },
  "inf7-p1-m": {
    id: "inf7-p1-m", zug: "M", thema: "sicher", minutes: 20,
    title: "Probe 1 (7M): Internet und Sicherheit",
    scope: "E-Mail, Weg einer Nachricht, Spam und Phishing, Passwörter, Rechte im Netz, bearbeitete Bilder",
    items: [
      c("Du lädst per E-Mail 25 Familien zum Klassenfest ein. Niemand soll die Adressen der anderen sehen. In welches Feld schreibst du die Adressen?",
        ["Bcc", "Cc", "An", "Betreff"], 0),
      c("Ben stellt ein fremdes Foto auf seine Internetseite und schreibt darunter: „Quelle: Internet“. Was stimmt?",
        ["Das reicht nicht – er braucht eine Erlaubnis oder eine freie Lizenz.", "Das reicht – mit einer Quelle darf man jedes Bild veröffentlichen.", "Das reicht, wenn er das Foto vorher etwas verkleinert oder dreht.", "Das ist gar nicht nötig – Bilder im Internet gehören allen."], 0),
      o("Sofia schickt Herrn Kaya am Abend eine E-Mail. Sein Computer ist ausgeschaltet. Bringe den Weg der E-Mail in die richtige Reihenfolge.",
        ["Sofia klickt auf „Senden“.", "Sofias Computer schickt die E-Mail über das Internet los.", "Der Server des E-Mail-Dienstes nimmt die E-Mail an und speichert sie.", "Am nächsten Morgen schaltet Herr Kaya seinen Computer ein und öffnet den Posteingang.", "Der Server schickt die E-Mail an seinen Computer – jetzt kann er sie lesen."]),
      c("Welche Adresse führt wirklich zur Seite der Stadtbank?",
        ["https://www.stadtbank.example/anmelden", "https://stadtbank.example.sicherheit-pruefen.example/anmelden", "https://www.stadtbamk.example/anmelden", "https://anmelden-stadtbank.example.kundendienst.example"], 0),
      m("Um welche Art von Nachricht handelt es sich?",
        [["„Nur heute: 90 % Rabatt auf alle Uhren!“ – an Tausende verschickt", "Spam"], ["„Ihr Konto wird gesperrt. Bestätigen Sie hier Ihr Passwort.“", "Phishing"], ["„Schicke das an 15 Leute, sonst hast du 7 Jahre Pech.“", "Kettenbrief"], ["„UNGLAUBLICH!!! Ab Montag sind Handys für alle unter 16 verboten!“ – ohne Quelle", "Falschmeldung"]]),
      c("Eine Taschenrechner-App verlangt Zugriff auf deine Kontakte, das Mikrofon und deinen Standort. Was ist die beste Entscheidung?",
        ["Ablehnen – ein Taschenrechner braucht nichts davon.", "Ablehnen – einer App darf man grundsätzlich nichts erlauben.", "Alles erlauben – sonst rechnet die App vielleicht falsch.", "Nur den Standort erlauben – der ist immer harmlos."], 0),
      c("Welche Aussage über Passwörter stimmt?",
        ["Für jedes Konto nimmt man ein eigenes, langes Passwort.", "Ein kurzes Passwort reicht, wenn ein Sonderzeichen vorkommt.", "Am sichersten ist der eigene Vorname mit dem Geburtsjahr.", "Ein gutes Passwort darf man der besten Freundin verraten."], 0),
      m("Worum geht es in diesem Fall?",
        [["Jemand postet ohne zu fragen ein Foto, auf dem du gut zu erkennen bist.", "Recht am eigenen Bild"], ["Jemand lädt dein selbst gemaltes Bild unter seinem Namen hoch.", "Urheberrecht"], ["Jemand beleidigt dich seit Wochen immer wieder im Klassenchat.", "Cybermobbing"]]),
      t("Du bekommst diese E-Mail: „Hallo Nutzer, dein Abo bei Filmkiste endet heute!!! Gib bis 18 Uhr deine Kartennummer ein: filmkiste.example.abo-verlaengern.example – sonst kannst du ab morgen nichts mehr ansehen.“ Nenne zwei Warnzeichen und begründe, warum du dort nichts eingibst. Stichworte genügen.",
        "Warnzeichen: Die E-Mail macht Zeitdruck („bis 18 Uhr“) und droht damit, dass ich nichts mehr ansehen kann. Die Anrede ist unpersönlich („Hallo Nutzer“), und die Adresse gehört nicht zu Filmkiste, denn direkt vor der Endung steht „abo-verlaengern“. Ich gebe nichts ein, weil Betrüger mit der Kartennummer Geld stehlen können. Ein echter Anbieter fragt so etwas nie per E-Mail.",
        ["ein richtiges Warnzeichen (z. B. Zeitdruck, Drohung, unpersönliche Anrede, gefälschte Adresse, viele Ausrufezeichen)", "ein zweites richtiges Warnzeichen", "Begründung: Mit der Kartennummer können Betrüger Geld stehlen – ein echter Anbieter fragt nie per E-Mail danach"],
        ["zeitdruck|18 uhr|heute|schnell|eilig|sofort|droh", "adresse|endung|anrede|nutzer|ausrufezeichen|abo-verlaengern", "betrüger|betrug|stehlen|klauen|geld|fragt nie|nie per|nie nach|missbrauch|abbuchen"]),
      t("Für dein Referat verwendest du ein Foto aus dem Internet. Erkläre, warum du die Quelle angeben musst, und nenne zwei Angaben, die zu einer Quelle gehören. Stichworte genügen.",
        "Das Foto hat jemand anderes gemacht – diese Person ist der Urheber. Mit der Quelle zeige ich, von wem das Foto stammt und wo ich es gefunden habe. Zur Quelle gehören zum Beispiel der Name des Urhebers und die Internetadresse, dazu der Titel und das Datum, an dem ich das Bild abgerufen habe.",
        ["Begründung: Das Foto ist nicht von mir, es gehört dem Urheber – nur mit Quelle darf ich es im Referat zeigen (man sieht, woher es stammt)", "zwei passende Angaben (z. B. Name des Urhebers, Titel, Internetadresse, Datum des Abrufs)"],
        ["urheber|gehört|nicht von mir|jemand anderes|fremd|stammt", "name|adresse|link|seite|datum|titel"]),
      t("Ein Beitrag zeigt ein Foto mit dem Text: „So voll war es gestern im Freibad!“ Später kommt heraus: Das Foto wurde am Computer bearbeitet, die Menschen wurden mehrfach hineinkopiert. Erkläre, warum bearbeitete Bilder ein Problem sein können, und nenne eine Möglichkeit, ein Bild zu überprüfen. Stichworte genügen.",
        "Viele Menschen glauben einem Bild sofort. So verbreitet sich eine falsche Nachricht schnell, obwohl sie nicht stimmt. Ich prüfe, wer das Bild veröffentlicht hat und ob andere Quellen dasselbe zeigen.",
        ["Problem: Bilder wirken wie ein Beweis – ein falscher Eindruck verbreitet sich", "eine Möglichkeit zu prüfen (z. B. wer hat es veröffentlicht, andere Quellen suchen, mit anderen Bildern vergleichen, genau hinsehen, nachfragen)"],
        ["glauben|beweis|falsch|täusch|stimmt nicht|verbreitet|lüge", "quelle|wer |vergleich|woanders|nachfragen|suchen|prüf|hinsehen|genau|doppelt"])
    ]
  },

  /* ================= Probe 2: Netzwerke mit Filius (Modul 2) ================= */
  "inf7-p2-r": {
    id: "inf7-p2-r", zug: "R", thema: "filius", minutes: 20,
    title: "Probe 2 (7R): Netzwerke mit Filius",
    scope: "IP-Adresse, Switch und Sternnetz, Ping, Fehler finden, Server und Webseite, Router und Gateway",
    items: [
      c("Wozu braucht jedes Gerät in einem Netzwerk eine eigene IP-Adresse?",
        ["Damit Daten das richtige Gerät erreichen.", "Damit das Gerät schneller rechnen kann.", "Damit niemand das Gerät benutzen kann.", "Damit das Gerät weniger Strom braucht."], 0),
      m("Ordne jedem Begriff die passende Erklärung zu.",
        [["Router", "verbindet zwei Netze miteinander"], ["Webserver", "Programm, das Webseiten bereithält"], ["Webbrowser", "Programm, das Webseiten anzeigt"], ["Befehlszeile", "hier tippt man zum Beispiel ping ein"]]),
      c("Im Jugendtreff hängen drei Rechner an einem Gerät in der Mitte. Im Bild fehlt sein Name. Welches Gerät ist das?",
        ["ein Switch", "ein Server", "ein Notebook", "ein Kabel"], 0,
        { image: "assets/proben/netz-treff.svg", imageAlt: "Drei Rechner mit den Namen Theke (192.168.5.21), Büro (192.168.5.22) und Spielecke (192.168.5.23). Von jedem führt ein Kabel zu einem Gerät in der Mitte, das mit einem Fragezeichen markiert ist." }),
      c("Im Netz des Jugendtreffs haben die Rechner die Adressen 192.168.5.21, 192.168.5.22 und 192.168.5.23. Ein vierter Rechner kommt dazu. Welche Adresse passt?",
        ["192.168.5.24", "192.168.5.22", "192.168.6.24", "192.5.168.24"], 0),
      o("Du willst in Filius prüfen, ob zwei Rechner sich erreichen. Bringe die Schritte in die richtige Reihenfolge.",
        ["Zwei Rechner auf die weiße Fläche ziehen", "Die beiden Rechner mit einem Kabel verbinden", "In den Aktionsmodus wechseln", "Auf einem der Rechner die Befehlszeile installieren", "Den Befehl ping mit der Adresse des anderen Rechners tippen"]),
      c("Am Ende eines Pings steht: „4 Paket(e) gesendet, 0 Paket(e) empfangen, 100% Paketverlust“. Was bedeutet das?",
        ["Der andere Rechner hat nicht geantwortet.", "Alle vier Pakete sind gut angekommen.", "Der andere Rechner hat vier Programme.", "Das Netzwerk arbeitet besonders schnell."], 0),
      c("Drei Rechner sind in einem Netz. Ihre Adressen: 192.168.4.51, 192.168.4.52 und 192.168.4.52. Was stimmt hier nicht?",
        ["Zwei Rechner haben dieselbe Adresse.", "Die Adressen sind alle viel zu lang.", "Drei Rechner sind für ein Netz zu viel.", "Die Rechner brauchen noch ein Passwort."], 0),
      m("Was macht welcher Knopf in Filius?",
        [["Hammer", "Entwurfsmodus"], ["grüner Pfeil", "Aktionsmodus"], ["rotes Kabel", "Verbindung"], ["Diskette", "Speichern"]]),
      c("Emre ruft an seinem Laptop den Busfahrplan im Internet ab. Welches Gerät ist dabei der Client?",
        ["Emres Laptop", "der Rechner der Busfirma", "der Switch in der Schule", "das Kabel zum Internet"], 0),
      c("In Filius ist auf einem Rechner der Webserver installiert. Der Ping vom Notebook an diesen Rechner klappt. Trotzdem zeigt der Browser des Notebooks: „Server konnte nicht erreicht werden!“ Woran liegt es wahrscheinlich?",
        ["Der Webserver wurde nicht gestartet.", "Der Browser ist dafür viel zu neu.", "Der Switch ist dafür viel zu klein.", "Die Webseite ist insgesamt zu groß."], 0),
      c("Sieh dir das Bild an. Der Rechner K1 soll den Rechner L1 im anderen Netz erreichen. Was muss bei K1 als Gateway eingetragen sein?",
        ["192.168.5.1", "192.168.8.1", "192.168.8.21", "192.168.5.22"], 0,
        { image: "assets/proben/zwei-netze-r.svg", imageAlt: "Zwei Netze. Netz K: die Rechner K1 (192.168.5.21) und K2 (192.168.5.22) an einem gemeinsamen Gerät. Netz L: die Rechner L1 (192.168.8.21) und L2 (192.168.8.22) an einem gemeinsamen Gerät. Dazwischen steht ein Router. Sein Anschluss zu Netz K hat die Adresse 192.168.5.1, sein Anschluss zu Netz L die Adresse 192.168.8.1." }),
      c("Welche zwei Rechner liegen im selben Netz?",
        ["192.168.3.14 und 192.168.3.70", "192.168.3.14 und 192.168.4.14", "192.168.4.3 und 192.168.3.4", "192.168.6.14 und 192.168.7.14"], 0),
      t("Im Netz des Jugendtreffs schickt der Rechner „Theke“ einen Ping an den Rechner „Büro“. Es kommt nur „Timeout!“. a) Nenne zwei Dinge, die du nachprüfst. b) Wie testest du danach, ob es wieder klappt? Stichworte genügen.",
        "a) Ich prüfe, ob vom Rechner „Büro“ ein Kabel zum Switch führt. Ich prüfe, ob seine IP-Adresse stimmt und zum Netz passt. b) Danach schicke ich noch einmal einen Ping.",
        ["a) eine richtige Prüfung (z. B. Kabel zum Switch vorhanden)", "a) eine zweite richtige Prüfung (z. B. IP-Adresse richtig eingetragen, keine doppelte Adresse, beim Ping nicht vertippt)", "b) erneuter Test mit ping"],
        ["kabel|verbunden|verbindung|angeschlossen|switch", "adresse|vertippt|zahl|nummer|ip-|ip,|, ip|und ip|die ip|ip prüf|ip stimm|ip richtig|ip falsch", "ping"])
    ]
  },
  "inf7-p2-m": {
    id: "inf7-p2-m", zug: "M", thema: "filius", minutes: 20,
    title: "Probe 2 (7M): Netzwerke mit Filius",
    scope: "IP-Adresse und Netz, Switch, Ping und Fehlermeldungen, Server und Webseite, Router und Gateway, Fehler finden und begründen",
    items: [
      c("Im Netz einer Werkstatt haben drei Rechner die Adressen 192.168.7.31, 192.168.7.32 und 192.168.7.33. Welche Adresse kann ein vierter Rechner bekommen?",
        ["192.168.7.34", "192.168.7.32", "192.168.9.34", "192.7.168.34"], 0),
      m("Ordne jedem Begriff die passende Erklärung zu.",
        [["Switch", "verteilt Pakete innerhalb eines Netzes"], ["Router", "reicht Pakete in ein anderes Netz weiter"], ["Webserver", "Programm, das Webseiten bereithält"], ["Client", "Rechner, der einen Dienst abruft"]]),
      o("Du rufst in Filius eine Webseite ab. Bringe in die richtige Reihenfolge, was dabei passiert.",
        ["Du tippst die Adresse des Servers in den Browser.", "Dein Rechner schickt eine Anfrage los.", "Über den Switch kommt die Anfrage beim Server an.", "Der Webserver schickt die Seite zurück.", "Im Browser erscheint die Seite."]),
      c("Der Rechner 192.168.3.14 will vier andere Rechner erreichen. Bei welchem geht das nur über das Gateway?",
        ["192.168.4.14", "192.168.3.70", "192.168.3.15", "192.168.3.200"], 0),
      c("Sieh dir das Bild an. Welche Adresse trägst du beim Rechner L2 als Gateway ein?",
        ["192.168.9.1", "192.168.7.1", "192.168.9.21", "192.168.7.22"], 0,
        { image: "assets/proben/zwei-netze-m.svg", imageAlt: "Zwei Netze. Netz K: die Rechner K1 (192.168.7.21) und K2 (192.168.7.22) an einem Switch. Netz L: die Rechner L1 (192.168.9.21) und L2 (192.168.9.22) an einem Switch. Dazwischen steht ein Router. Sein Anschluss zu Netz K hat die Adresse 192.168.7.1, sein Anschluss zu Netz L die Adresse 192.168.9.1." }),
      c("An einem Switch hängen die Rechner „Kasse“, „Lager“ und „Werkbank“. „Kasse“ schickt ein Paket an „Lager“. Bei wem kommt es an?",
        ["nur bei „Lager“", "bei „Lager“ und „Werkbank“", "bei allen Rechnern im Haus", "bei keinem Rechner"], 0),
      c("Nach einem Ping stehen im Datenaustausch vier Zeilen „Echo Request (ping)“ und vier Zeilen „Echo Reply (pong)“. Was bedeutet das?",
        ["Alle vier Anfragen wurden beantwortet.", "Vier Pakete gingen unterwegs verloren.", "Der Ping wurde achtmal neu gestartet.", "Der andere Rechner ist ausgeschaltet."], 0),
      m("Filius zeigt eine Meldung. Was ist der Grund?",
        [["viermal „Timeout!“", "die Anfrage geht los, aber es kommt keine Antwort zurück"], ["„Zieladresse nicht erreichbar“", "der Absender kennt keinen Weg in das andere Netz"], ["„Maximale Anzahl angeschlossener Geräte überschritten“", "der Anschluss des Rechners ist schon belegt"]]),
      t("Im Bild siehst du das Netz eines Jugendtreffs. Darin stecken zwei Fehler. Nenne beide Fehler und schreibe zu jedem, wie du ihn behebst. Stichworte genügen.",
        "Fehler 1: Der Rechner „Büro“ hat kein Kabel zum Switch. Behebung: Ich verbinde ihn mit dem Switch. Fehler 2: „Theke“ und „Spielecke“ haben dieselbe Adresse 192.168.7.31. Behebung: Einer der beiden bekommt eine freie Adresse, zum Beispiel 192.168.7.33.",
        ["Fehler erkannt: Der Rechner „Büro“ ist nicht mit dem Switch verbunden (Kabel fehlt)", "Behebung: Kabel vom Rechner „Büro“ zum Switch legen", "Fehler erkannt: Zwei Rechner haben dieselbe Adresse", "Behebung: einem der beiden Rechner eine freie Adresse geben"],
        ["kabel|verbunden|verbindung|angeschlossen|büro", "verbinde|anschlie|ansteck|einsteck|kabel legen|kabel ziehen|kabel zum|kabel dran|kabel hin|hinzufüg|anbring", "selbe|gleich|doppel|zweimal|zwei mal|2 mal|2x|identisch", "änder|andere adresse|andere ip|neue adresse|neue ip|freie adresse|eigene adresse|eigene ip|andere nummer|andere zahl|.33|.34"],
        { image: "assets/proben/netz-pruefen.svg", imageAlt: "Ein Switch und drei Rechner: Theke (192.168.7.31), Büro (192.168.7.32) und Spielecke (192.168.7.31). Zum Switch führen zwei Kabel: eines vom Rechner Theke und eines vom Rechner Spielecke." }),
      t("In der Werkstatt ist auf dem Rechner „Lager“ ein Webserver installiert. Vom Rechner „Kasse“ aus klappt der Ping an „Lager“. Im Browser von „Kasse“ ist die Adresse richtig getippt. Trotzdem steht dort: „Server konnte nicht erreicht werden!“ a) Was ist also in Ordnung? b) Was ist wahrscheinlich der Fehler? Stichworte genügen.",
        "a) Der Rechner „Lager“ ist erreichbar: Kabel und Adresse stimmen, sonst würde der Ping nicht klappen. b) Das Programm Webserver läuft nicht – es wurde nicht gestartet oder wieder angehalten.",
        ["a) der Rechner ist erreichbar – Kabel und Adresse stimmen", "b) das Programm Webserver läuft nicht (nicht gestartet oder angehalten)"],
        ["erreichbar|verbindung|verbunden|kabel|adresse|antwortet|rechner ist da", "programm|gestartet|starten|angehalten|läuft nicht|nicht läuft|nicht an|ist aus|gestoppt|einschalten|anmachen|angemacht"]),
      t("Zwei Netze sind über einen Router verbunden. a) Wozu braucht ein Rechner ein Gateway? b) Welche Adresse trägst du als Gateway ein? Stichworte genügen.",
        "a) Das Gateway ist der Ausgang aus dem eigenen Netz: Dorthin schickt der Rechner alle Pakete, die in ein anderes Netz sollen. b) Eingetragen wird die Adresse des Routers im eigenen Netz.",
        ["a) Zweck: Pakete in ein anderes Netz schicken (Ausgang aus dem eigenen Netz)", "b) die Adresse des Routers („im eigenen Netz“ muss nicht dabeistehen; „im anderen Netz“ ist falsch)"],
        ["anderes netz|andere netz|anderen netz|zweite netz|zweiten netz|ausgang|hinaus|raus|aus dem netz|aus seinem netz|außerhalb|fremde", "router"])
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
