"use strict";

/**
 * Deutsch 7 · Probe 8: Rechtschreibung und Sprachtraining (Rechtschreibstrategien · Groß- und Kleinschreibung mit
 * Nominalisierung und Signalwörtern · Getrennt- und Zusammenschreibung · s, ss, ß und das/dass · Fremdwörter ·
 * Kommas bei Aufzählung und Satzgefüge, M7 auch eingeschobener Relativsatz, Einschub und Infinitivgruppe mit „um“ ·
 * Fehler finden und verbessern · einen Abschnitt überarbeiten). LehrplanPLUS D7 4.3.
 * R7: 30 Punkte, 12 Aufgaben · M7: 34 Punkte, 12 Aufgaben · 40 Minuten. Keine Lesetexte.
 * Offene Punkte: R7 5 (17 %), M7 8 (24 %).
 *
 * Kennzeichen – in dieser Probe das Wichtigste (Notenschutz: Rechtschreibung wird dann nicht gewertet):
 *   rs  alles, wobei ein Wort richtig geschrieben oder die richtige Schreibweise gewählt werden muss
 *   zs  Kommas setzen (k automatisch, dazu die Rasterzeile „Kommas“ der letzten Aufgabe)
 *   ohne Kennzeichen bleibt, was Regelwissen und Strategien prüft, ohne dass richtig geschrieben werden muss:
 *        Strategie zuordnen · Signalwort ankreuzen (R7) · Schreibung begründen · Ersatzprobe bei das/dass ·
 *        Bedeutung von Fremdwörtern · Kommas begründen (M7)
 *   Punkte ohne rs/zs: R7 10 von 30 · M7 11 von 34 (rs: R7 16, M7 18 · zs: R7 4, M7 5)
 *
 * Jede Fassung hat ihr eigenes Wortfeld, aus dem alle Wörter und Sätze stammen:
 * R7 A Ferien am See · R7 B Winter und Schnee · M7 A Museum und Technik · M7 B Konzert und Musik.
 * Kein Satz und kein Wortpaar steht so in einem Lernmodul (Rechtschreibung rs_01 bis rs_07, Fehlertraining
 * rs-fehler, Rechtschreib-Duelle rs-duell) – beim Ändern dort gegenprüfen.
 * Innerhalb einer Fassung steht kein Wort, das ein Kind selbst richtig schreiben muss, an anderer Stelle richtig
 * geschrieben da – auch nicht als Teil eines anderen Wortes (deshalb z. B. kein „Eingang“ neben dem Fehlerwort
 * „Rundgank“ und kein weiteres Verb auf -ieren in den M7-Fassungen).
 *
 * Groß-/Kleinschreibung in den Feldern: Bei Nomen und überall dort, wo groß oder klein die Aufgabe ist, zählt sie
 * (genau). Bei klein geschriebenen Wörtern, bei denen es um s-Laute oder Fremdwort-Bausteine geht, zählt sie nicht,
 * und im Fehlertext gilt bei solchen Wörtern auch der große Anfangsbuchstabe – Tablets setzen ihn im Feld von selbst.
 * Die KI bekommt „vorgabe“ nicht mitgeschickt: Bei der letzten Aufgabe steht die Vorlage deshalb im Erwartungshorizont.
 * Bleibt auf dem Server (Lösungen). Bausteine: bau.js.
 */
const { c, m, f, feld, k, a, kr, probe } = require("./bau");

/* ------------------------------ Schreibhilfen ------------------------------ */
const gross = (s) => s.charAt(0).toUpperCase() + s.slice(1);
// Wort richtig schreiben, Groß-/Kleinschreibung zählt: wort("das Flo_ aus Holz", "Floß", "das Floß")
const wort = (label, ...loesungen) => feld(label, loesungen, { genau: true, rs: true });
// Wort richtig schreiben, Groß-/Kleinschreibung zählt nicht (klein geschriebene Wörter, es geht um andere Stellen)
const wortKlein = (label, ...loesungen) => feld(label, loesungen, { rs: true });
// Verbform in die Lücke: Es zählt die Form allein – oder der ganze Satz mit der Form.
const verbform = (satz, angabe, form) => feld(satz + " (" + angabe + ")", [form, satz.replace("___", form)], { rs: true });
// Fehlerwort aus dem Fehlertext (Reihenfolge egal, Feld heißt für das Kind „1.“, „2.“ …). Bei klein geschriebenen
// Lösungen gilt auch der große Anfangsbuchstabe.
const fehler = (...loesungen) => feld("Wort", [...new Set(loesungen.concat(loesungen.filter((l) => l.charAt(0) !== gross(l).charAt(0)).map(gross)))], { genau: true, rs: true });

/* ------------------------------ Aufgabenstellungen ------------------------------ */
const STRATEGIE = "Bei jedem Wort ist eine Stelle schwierig. Welche Rechtschreibstrategie hilft dir, diese Stelle richtig zu schreiben? Ordne zu.";
const S_VERL = "Verlängern", S_ABL = "Ableiten", S_SCHW = "Schwingen (in Silben sprechen)", S_MERK = "Merken oder nachschlagen";
const ANWENDEN = "Verlängere das Wort oder leite es ab. Schreibe dann das ganze Wort richtig in das Feld.";
const SIGNAL = (verb) => " Welches Wort zeigt dir, dass „" + verb + "“ hier großgeschrieben wird?";
const GROSS_KLEIN = "Groß oder klein? Schreibe das Wort in GROSSBUCHSTABEN so in das Feld, wie es im Satz richtig geschrieben wird.";
const WARUM_R = (wort_) => " Erkläre, warum „" + wort_ + "“ in diesem Satz einmal groß- und einmal kleingeschrieben wird.";
const WARUM_M = (klein, grossWort) => " Erkläre, warum man „" + klein + "“ klein-, „" + grossWort + "“ aber großschreibt. Nenne dabei das Signalwort.";
const GETRENNT_R = "Getrennt oder zusammen? Entscheide, wie die beiden Wörter in der Klammer im Satz geschrieben werden. Ordne zu.";
const GETRENNT_M = "Getrennt oder zusammen, groß oder klein? Schreibe die beiden Wörter aus der Klammer so in das Feld, wie sie im Satz richtig geschrieben werden.";
const S_LAUT_R = "s, ss oder ß? Schreibe das ganze Wort richtig in das Feld.";
const S_LAUT_M = "ss oder ß? Setze das Verb in der angegebenen Zeitform ein. Schreibe nur die Verbform in das Feld.";
const DAS_DASS = "das oder dass? In jedem Satz fehlt dieses Wort. Mache die Ersatzprobe und ordne zu, was du herausfindest.";
const E_DIESES = "„dieses“ lässt sich einsetzen", E_WELCHES = "„welches“ lässt sich einsetzen", E_KEIN = "kein Ersatzwort lässt sich einsetzen";
const BEDEUTUNG = "Was bedeutet das Fremdwort in GROSSBUCHSTABEN? Ordne das passende deutsche Wort zu.";
const FREMD_M = "In jedem Fremdwort fehlt eine Stelle. Schreibe das ganze Wort richtig in das Feld.";
const KOMMA = "Setze die fehlenden Kommas.";
const WARUM_KOMMA = " Erkläre, warum in diesem Satz zwei Kommas stehen.";
const FEHLER = (zahl) => "Im Text sind " + zahl + " Wörter falsch geschrieben. Finde sie und schreibe jedes Wort richtig in ein Feld – nur das Wort, nicht den ganzen Satz. Die Reihenfolge ist egal. Alle Kommas stehen schon richtig.";
const ABSCHRIFT = (woerter, kommas) => "Überarbeite den Abschnitt: Schreibe ihn vollständig und richtig ab. " + woerter + " Wörter sind falsch geschrieben. Außerdem fehlen " + kommas + " Kommas.";

/* ------------------------------ „Dein nächster Schritt“ ------------------------------ */
const H_STRATEGIE = "Frage dich bei jedem Wort, was genau unsicher ist: der Laut am Wortende, ä/e oder äu/eu, ein doppelter Konsonant – oder eine Stelle, die man nicht hören kann.";
const H_ANWENDEN = "Bilde bei einem unklaren Laut am Wortende eine längere Form (zum Beispiel die Mehrzahl) und suche bei ä oder e ein verwandtes Wort mit a.";
const H_SIGNAL = "Ein Signalwort steht vor dem Wort, das es zum Nomen macht: Prüfe, in welchem Wort ein Artikel steckt.";
const H_GROSS_R = "Prüfe bei jedem Wort, ob ein Signalwort davorsteht (Artikel, beim, zum, etwas, nichts, viel, wenig, alles) – ohne Signalwort bleiben Verben und Adjektive klein.";
const H_GROSS_M = "Suche vor jedem Wort ein Signalwort (Artikel, beim, zum, etwas, nichts, viel, wenig, alles) – auch wenn noch ein Adjektiv dazwischensteht – und denke an die Regel für Tageszeiten und Wochentage.";
const H_GETRENNT_R = "Sprich die Wörter laut: Hörst du nur eine Hauptbetonung, schreibst du zusammen; hörst du zwei, schreibst du getrennt.";
const H_GETRENNT_M = "Mache die Betonungsprobe und prüfe dann, ob vor der Verbindung ein Signalwort steht: Als Nomen wird sie anders geschrieben als im Satz mit Verb.";
const H_S_LAUT_R = "Sprich jedes Wort langsam: Klingt der s-Laut weich oder scharf – und ist der Vokal davor kurz oder lang?";
const H_S_LAUT_M = "Bilde die Verbform und sprich sie deutlich: Ist der Vokal vor dem s-Laut kurz oder lang?";
const H_DAS_DASS = "Setze in die Lücke nacheinander „dieses“ und „welches“ ein und lies den Satz leise: Klingt er dann noch richtig?";
const H_BEDEUTUNG = "Lies den ganzen Satz und setze die deutschen Wörter der Reihe nach für das Fremdwort ein: Welcher Satz ergibt einen Sinn?";
const H_FREMD_M = "Wiederhole die typischen Bausteine von Fremdwörtern und schlage unsichere Wörter im Wörterbuch nach.";
const H_KOMMA_R = "Suche zuerst die Aufzählung, dann die gebeugten Verben: Wo ein Teilsatz endet und der nächste beginnt, steht ein Komma.";
const H_KOMMA_M = "Grenze die Teilsätze an den gebeugten Verben ab und prüfe, ob ein Nebensatz oder eine Wortgruppe mit „um … zu“ eingeschoben oder angehängt ist.";
const H_FEHLER = "Lies den Text Wort für Wort und prüfe jedes unsichere Wort mit einer Strategie: verlängern, ableiten, Signalwort suchen, Ersatzprobe bei „das“.";

const HILFE_ABSCHRIFT = "Gehe so vor: Lies jeden Satz langsam. Prüfe zuerst die Nomen, dann die schwierigen Stellen (g oder k, ä oder e, doppelte Buchstaben) und am Ende die Kommas.";

/* ------------------------------ Erwartungshorizont: Schreibung begründen ------------------------------ */
const OHNE_RS = " Die Rechtschreibung der Antwort zählt nicht.";
const GRUND_R = (signal, verb, verbKlein) => [
  kr("Großschreibung erklärt", 1, "„" + gross(signal) + " " + verb + "“: Das Verb wird hier wie ein Nomen gebraucht (Nominalisierung), davor steht das Signalwort „" + signal + "“, in dem ein Artikel steckt. Es genügt, das Signalwort oder den versteckten Artikel zu nennen." + OHNE_RS),
  kr("Kleinschreibung erklärt", 1, "„" + verbKlein + "“: Hier ist das Wort ein Verb – es sagt, was jemand tut – und es steht kein Signalwort davor. Ein richtiger Grund genügt." + OHNE_RS)
];
const GRUND_M = (verbKlein, signal, verb) => [
  kr("Kleinschreibung erklärt", 1, "„" + verbKlein + "“ ist ein gebeugtes Verb: Es sagt, was jemand tut, und es steht kein Signalwort davor. Ein richtiger Grund genügt." + OHNE_RS),
  kr("Großschreibung mit Signalwort erklärt", 1, "„" + verb + "“ wird als Nomen gebraucht (Nominalisierung), und das Signalwort „" + signal + "“ ist genannt (darin steckt ein Artikel). Den Punkt gibt es nur, wenn das Signalwort genannt ist." + OHNE_RS)
];
const KW_GRUND_R = ["signalwort|artikel|nomen|namenwort|hauptwort|nominalisier|begleiter", "verb|tunwort|tuwort|zeitwort|tätigkeit"];
const KW_GRUND_M = ["verb|tunwort|tuwort|zeitwort|gebeugt|konjugiert", "nomen|namenwort|hauptwort|nominalisier|artikel|zu dem|bei dem"];
const GRUND_KOMMA = (einschub, nomen_, rest) => [
  kr("gesagt, was zwischen den Kommas steht", 1, "„" + einschub + "“ ist ein Einschub (ein nachgestellter Zusatz): Er erklärt „" + nomen_ + "“ genauer. Der Fachbegriff muss nicht fallen; es genügt, den Teil als eingeschobene Erklärung zum Nomen zu beschreiben." + OHNE_RS),
  kr("Regel erklärt", 1, "Ein Einschub wird vorn und hinten mit einem Komma abgetrennt, weil der Satz danach weitergeht – ohne den Einschub bleibt ein vollständiger Satz („" + rest + "“). Ein richtiger Grund genügt.")
];
const KW_KOMMA = ["einschub|eingeschoben|zusatz|beisatz|apposition|näher|genauer|erläuter", "vorn und hinten|vorne und hinten|davor und dahinter|davor und danach|abgetrennt|abtrennen|eingeschlossen|beiden seiten|weglassen|ohne den"];

/* ------------------------------ Erwartungshorizont: Abschnitt überarbeiten ------------------------------ */
const RS_R = " 2 Punkte: Alle vier Wörter sind verbessert, und beim Abschreiben ist höchstens ein neuer Fehler entstanden. 1 Punkt: Zwei oder drei Wörter sind verbessert (oder alle vier, aber mit mehreren neuen Fehlern). 0 Punkte: Höchstens ein Wort ist verbessert, oder es ist weniger als die Hälfte des Abschnitts abgeschrieben.";
const ZS_R = " 1 Punkt nur, wenn beide Kommas gesetzt sind und kein falsches Komma dazugekommen ist. Das Komma, das schon in der Vorlage steht, bleibt stehen.";
const RS_M = " 2 Punkte: Alle fünf Wörter sind verbessert, und beim Abschreiben ist höchstens ein neuer Fehler entstanden. 1 Punkt: Drei oder vier Wörter sind verbessert (oder alle fünf, aber mit mehreren neuen Fehlern). 0 Punkte: Höchstens zwei Wörter sind verbessert, oder es ist weniger als die Hälfte des Abschnitts abgeschrieben.";
const ZS_M = " 2 Punkte: Alle drei Kommas sind gesetzt, und kein falsches Komma ist dazugekommen. 1 Punkt: Zwei der drei Kommas sind gesetzt (oder alle drei und zusätzlich ein falsches). 0 Punkte: Höchstens ein Komma ist gesetzt.";
// abschrift(Aufgabe, Vorlage mit Fehlern, richtige Fassung, „falsch → richtig“, fehlende Kommas, [Stufen RS, Stufen ZS, Punkte ZS], Stichwörter, extra)
const abschrift = (aufgabe, vorlage, richtig, woerter, kommas, stufen, stichwoerter, extra) => a(aufgabe, [
  kr("Rechtschreibung", 2, "Vorlage mit Fehlern: „" + vorlage + "“ – Falsch geschrieben sind: " + woerter + "." + stufen[0], { rs: true }),
  kr("Kommas", stufen[2], "Es fehlen: " + kommas + "." + stufen[1], { zs: true })
], richtig, stichwoerter, { vorgabe: vorlage, ...(extra || {}) });
const STUFEN_R = [RS_R, ZS_R, 1], STUFEN_M = [RS_M, ZS_M, 2];

/* ------------------------------ Fehlertexte und Abschnitte ------------------------------ */
// R7 A: Wek · rudern · das · barfus
const FT_RA = "Gestern radelten wir zum Badesee. Der Wek dorthin war weit, aber das Wetter war herrlich. Beim rudern entdeckte ich im Schilf einen kleinen Krebs. Opa meinte, das man solche Tiere nur noch selten sieht. Danach liefen wir barfus über die Wiese zum Kiosk.";
const AB_RA = "Am letzten Ferientag fuhren wir noch einmal an den See. Mama hatte Kuchen Obst und Limonade dabei. Weil der Himmel grau war nahmen wir auch Jacken mit. Am Ufer raschelten nur die Bleter, sonst war es ganz stil. Zum abschied machte Papa ein Foto vom Sonnenuntergank.";
const AB_RA_RICHTIG = "Am letzten Ferientag fuhren wir noch einmal an den See. Mama hatte Kuchen, Obst und Limonade dabei. Weil der Himmel grau war, nahmen wir auch Jacken mit. Am Ufer raschelten nur die Blätter, sonst war es ganz still. Zum Abschied machte Papa ein Foto vom Sonnenuntergang.";
// R7 B: Wint · schaufeln · das · fleisig
const FT_RB = "Am Samstag lag der Garten unter einer dicken Schneedecke. Der Wint blies uns kalt ins Gesicht, doch das störte keinen. Beim schaufeln fand Lasse seinen verlorenen Handschuh wieder. Er rief, das er ihn schon lange gesucht hat. Danach räumten wir fleisig die Einfahrt frei.";
const AB_RB = "Am Sonntag machten wir einen Ausfluk in den Schnee. In Omas Rucksack steckten Kekse Nüsse und eine Kanne Tee. Obwohl es eisig kalt war blieben wir drei Stunden. Die Schlittenbahn war glat, deshalb waren wir sehr schnell unten. Zum aufwärmen gingen wir später in eine Hütte. An allen Dechern hingen lange Eiszapfen.";
const AB_RB_RICHTIG = "Am Sonntag machten wir einen Ausflug in den Schnee. In Omas Rucksack steckten Kekse, Nüsse und eine Kanne Tee. Obwohl es eisig kalt war, blieben wir drei Stunden. Die Schlittenbahn war glatt, deshalb waren wir sehr schnell unten. Zum Aufwärmen gingen wir später in eine Hütte. An allen Dächern hingen lange Eiszapfen.";
// M7 A: Rundgank · gewaltiges · das · experimentiren · Matematik · Abschlus
const FT_MA = "Am Donnerstag besuchte unsere Klasse das Technikmuseum. Der Rundgank begann in der großen Halle. Dort gab es etwas gewaltiges zu sehen: eine riesige Dampfmaschine. Ein Mitarbeiter erklärte uns, das sie früher die Maschinen einer ganzen Fabrik bewegte. Danach durften wir im Labor selbst experimentiren. In der Abteilung für Matematik fanden wir sogar eine Rechenmaschine aus dem Jahr 1890. Zum Abschlus kauften wir im Laden noch Postkarten.";
const AB_MA = "Im letzten Saal hängt ein echtes Flugzeuk von der Decke. Obwohl es über hundert Jahre alt ist sieht es fast neu aus. Die Konstrukzion die damals als Wunder galt besteht nur aus Holz und Stoff. Beim starten machte der Motor ein lautes Gereusch. Solche Erlebnise vergisst man nicht.";
const AB_MA_RICHTIG = "Im letzten Saal hängt ein echtes Flugzeug von der Decke. Obwohl es über hundert Jahre alt ist, sieht es fast neu aus. Die Konstruktion, die damals als Wunder galt, besteht nur aus Holz und Stoff. Beim Starten machte der Motor ein lautes Geräusch. Solche Erlebnisse vergisst man nicht.";
// M7 B: Vorhank · das · schlimmes · Atmosfäre · Schweis · gratulirte
const FT_MB = "Am Samstag trat unsere Schulband zum ersten Mal in der Stadthalle auf. Hinter dem Vorhank warteten wir aufgeregt auf unseren Einsatz. Tamara flüsterte, das ihre Finger ganz kalt seien. Zum Glück geschah auf der Bühne nichts schlimmes. Die Atmosfäre im Saal war großartig. Bald lief uns der Schweis über die Stirn. Nach der dritten Zugabe gratulirte uns sogar der Bürgermeister.";
const AB_MB = "Bei der Generalprobe ging zuerst alles schief. Weil ein Kabel locker war hörte niemand die Sengerin. Beim stimmen der Gitarren riss auch noch eine Saite. Die Komposizion die unser Lehrer selbst geschrieben hat klang trotzdem wunderschön. Nach solchen Hindernisen freuten wir uns doppelt über unseren Erfolk.";
const AB_MB_RICHTIG = "Bei der Generalprobe ging zuerst alles schief. Weil ein Kabel locker war, hörte niemand die Sängerin. Beim Stimmen der Gitarren riss auch noch eine Saite. Die Komposition, die unser Lehrer selbst geschrieben hat, klang trotzdem wunderschön. Nach solchen Hindernissen freuten wir uns doppelt über unseren Erfolg.";

/* ============================== R7, Variante A – Wortfeld Ferien am See ============================== */
const R_A = [
  m(STRATEGIE, [
    ["der Ste_ (g oder k?)", S_VERL],
    ["die Schw_ne (ä oder e?)", S_ABL],
    ["die Eide_se (chs oder x?)", S_MERK],
    ["das Pa_el (d oder dd?)", S_SCHW],
    ["der Urlau_ (b oder p?)", S_VERL],
    ["das Ger_sch (äu oder eu?)", S_ABL]], { points: 3, hinweis: H_STRATEGIE }),
  f(ANWENDEN, [
    wort("der Sprun_ ins Wasser (g oder k?)", "Sprung", "der Sprung", "der Sprung ins Wasser"),
    wort("die Badestr_nde (ä oder e?)", "Badestrände", "die Badestrände")
  ], { hinweis: H_ANWENDEN }),
  c("„Finja braucht zum Schnorcheln eine Taucherbrille.“" + SIGNAL("Schnorcheln"), [
    "zum",
    "braucht",
    "eine",
    "Finja"], 0, { hinweis: H_SIGNAL }),
  f(GROSS_KLEIN, [
    wort("Am Kiosk kauft Hatice etwas LECKERES für alle.", "Leckeres"),
    wort("Marek möchte heute nur FAULENZEN.", "faulenzen"),
    wort("Das ANGELN hat Opa schon als Kind gelernt.", "Angeln")
  ], { hinweis: H_GROSS_R }),
  a("„Zum Baden ist der See heute zu kalt, aber wir baden trotzdem.“" + WARUM_R("baden"), GRUND_R("zum", "Baden", "wir baden"),
    "„Zum Baden“ schreibt man groß, weil das Signalwort „zum“ davorsteht: Das Verb wird zum Nomen. In „wir baden“ ist es ein gewöhnliches Verb ohne Signalwort, deshalb bleibt es klein.",
    KW_GRUND_R, { hilfe: "So kannst du beginnen: „Zum Baden“ schreibt man groß, weil … In „wir baden“ ist das Wort …" }),
  m(GETRENNT_R, [
    ["Am Nachmittag wollen wir (TRETBOOT + FAHREN).", "getrennt"],
    ["Vor dem Gewitter müssen alle (ZURÜCK + SCHWIMMEN).", "zusammen"],
    ["(IRGEND + WOHER) kommt laute Musik.", "zusammen"],
    ["Finja will im Sommer (SEGELN + LERNEN).", "getrennt"]], { points: 2, rs: true, hinweis: H_GETRENNT_R }),
  f(S_LAUT_R, [
    wort("das Flo_ aus Holz", "Floß", "das Floß", "das Floß aus Holz"),
    wort("die Schwimmflo_en", "Schwimmflossen", "die Schwimmflossen"),
    wort("der Kie_el am Ufer", "Kiesel", "der Kiesel", "der Kiesel am Ufer")
  ], { hinweis: H_S_LAUT_R }),
  m(DAS_DASS, [
    ["Das Kanu, ___ am Ufer liegt, gehört Opa.", E_WELCHES],
    ["Finja hofft, ___ die Sonne bald scheint.", E_KEIN],
    ["___ Segelboot gehört dem Bademeister.", E_DIESES],
    ["Wir sehen, ___ ein Gewitter aufzieht.", E_KEIN]], { points: 2, hinweis: H_DAS_DASS }),
  m(BEDEUTUNG, [
    ["Der KAPITÄN steuert das Schiff sicher in den Hafen.", "Schiffsführer"],
    ["Ohne TICKET darf niemand auf das Schiff.", "Fahrkarte"],
    ["Im Rucksack ist genug PROVIANT für den ganzen Tag.", "Vorrat an Essen"],
    ["Im Sommer kommen viele TOURISTEN an den See.", "Urlauber"]], { points: 2, hinweis: H_BEDEUTUNG }),
  k(KOMMA, [
    "In der Badetasche stecken Handtücher, Sonnencreme, Getränke und ein Ball.",
    "Marek bleibt am Ufer, weil er noch nicht schwimmen kann.",
    "Wenn die Sonne untergeht, wird es am See schnell kühl."], { hinweis: H_KOMMA_R }),
  f(FEHLER("vier"), [
    fehler("Weg", "der Weg", "Der Weg"),
    fehler("Rudern", "Beim Rudern"),
    fehler("dass"),
    fehler("barfuß")
  ], { menge: true, vorgabe: FT_RA, hinweis: H_FEHLER }),
  abschrift(ABSCHRIFT("Vier", "zwei"), AB_RA, AB_RA_RICHTIG,
    "Bleter → Blätter, stil → still, abschied → Abschied, Sonnenuntergank → Sonnenuntergang",
    "das Komma nach „Kuchen“ (Aufzählung) und das Komma nach „war“ („Weil der Himmel grau war, nahmen …“: Nebensatz vor dem Hauptsatz)",
    STUFEN_R, ["blätter|still", "abschied|sonnenuntergang"], { hilfe: HILFE_ABSCHRIFT })
];

/* ============================== R7, Variante B – Wortfeld Winter und Schnee ============================== */
const R_B = [
  m(STRATEGIE, [
    ["die K_lte (ä oder e?)", S_ABL],
    ["der Zwei_ (g oder k?)", S_VERL],
    ["zi_ern (t oder tt?)", S_SCHW],
    ["die F_stlinge (äu oder eu?)", S_ABL],
    ["der Ad_ent (f oder v?)", S_MERK],
    ["der Abhan_ (g oder k?)", S_VERL]], { points: 3, hinweis: H_STRATEGIE }),
  f(ANWENDEN, [
    wort("die Schneeb_lle (ä oder e?)", "Schneebälle", "die Schneebälle"),
    wort("der Schneepflu_ (g oder k?)", "Schneepflug", "der Schneepflug")
  ], { hinweis: H_ANWENDEN }),
  c("„Pinar hat beim Schlittern ihren Schal verloren.“" + SIGNAL("Schlittern"), [
    "beim",
    "hat",
    "ihren",
    "verloren"], 0, { hinweis: H_SIGNAL }),
  f(GROSS_KLEIN, [
    wort("Das FRIEREN hört am warmen Ofen schnell auf.", "Frieren"),
    wort("Unter dem Schnee findet der Hase wenig GRÜNES.", "Grünes"),
    wort("Malin will morgen wieder RODELN.", "rodeln")
  ], { hinweis: H_GROSS_R }),
  a("„Beim Rutschen lachen alle, deshalb rutschen wir gleich noch einmal.“" + WARUM_R("rutschen"), GRUND_R("beim", "Rutschen", "rutschen wir"),
    "„Beim Rutschen“ wird großgeschrieben, weil „beim“ ein Signalwort ist – darin steckt der Artikel „dem“. So wird aus dem Verb ein Nomen. In „rutschen wir“ sagt das Wort, was wir tun: Es ist ein Verb und bleibt klein.",
    KW_GRUND_R, { hilfe: "So kannst du beginnen: „Beim Rutschen“ schreibt man groß, weil … In „rutschen wir“ ist das Wort …" }),
  m(GETRENNT_R, [
    ["Am Wochenende wollen wir (SCHLITTSCHUH + LAUFEN).", "getrennt"],
    ["(IRGEND + WIE) passt mein Helm nicht mehr.", "zusammen"],
    ["Nach dem Abendessen wollen alle (SCHLAFEN + GEHEN).", "getrennt"],
    ["Malin will den Hügel (HINUNTER + SAUSEN).", "zusammen"]], { points: 2, rs: true, hinweis: H_GETRENNT_R }),
  f(S_LAUT_R, [
    wortKlein("ein bi_chen Schnee", "bisschen", "ein bisschen", "ein bisschen Schnee"),
    wort("die Mei_e am Futterhaus", "Meise", "die Meise", "die Meise am Futterhaus"),
    wort("der Ru_ im Kamin", "Ruß", "der Ruß", "der Ruß im Kamin")
  ], { hinweis: H_S_LAUT_R }),
  m(DAS_DASS, [
    ["Malin wünscht sich, ___ die Ferien länger dauern.", E_KEIN],
    ["Das Vogelhaus, ___ wir gebaut haben, ist schon leer.", E_WELCHES],
    ["Lasse spürt, ___ seine Finger kalt werden.", E_KEIN],
    ["___ Eis auf dem Teich trägt noch nicht.", E_DIESES]], { points: 2, hinweis: H_DAS_DASS }),
  m(BEDEUTUNG, [
    ["Die PISTE ist heute frisch gewalzt.", "Strecke zum Skifahren"],
    ["Pinar zieht ihren neuen ANORAK an.", "Winterjacke"],
    ["Vom Gipfel aus sehen wir ein tolles PANORAMA.", "weite Aussicht"],
    ["Die Kinder bauen aus Schneeblöcken ein IGLU.", "Schneehaus"]], { points: 2, hinweis: H_BEDEUTUNG }),
  k(KOMMA, [
    "Bogdan trägt Mütze, Schal, Handschuhe und dicke Stiefel.",
    "Als der erste Schnee fiel, stürmten wir in den Garten.",
    "Malin zieht den Schlitten, obwohl der Weg steil ist."], { hinweis: H_KOMMA_R }),
  f(FEHLER("vier"), [
    fehler("Wind", "der Wind", "Der Wind"),
    fehler("Schaufeln", "Beim Schaufeln"),
    fehler("dass"),
    fehler("fleißig")
  ], { menge: true, vorgabe: FT_RB, hinweis: H_FEHLER }),
  abschrift(ABSCHRIFT("Vier", "zwei"), AB_RB, AB_RB_RICHTIG,
    "Ausfluk → Ausflug, glat → glatt, aufwärmen → Aufwärmen, Dechern → Dächern",
    "das Komma nach „Kekse“ (Aufzählung) und das Komma nach „war“ („Obwohl es eisig kalt war, blieben …“: Nebensatz vor dem Hauptsatz)",
    STUFEN_R, ["ausflug|glatt", "aufwärmen|dächern"], { hilfe: HILFE_ABSCHRIFT })
];

/* ============================== M7, Variante A – Wortfeld Museum und Technik ============================== */
const M_A = [
  m(STRATEGIE, [
    ["das Geh_se (äu oder eu?)", S_ABL],
    ["die A_se (chs oder x?)", S_MERK],
    ["sie schrau_t (b oder p?)", S_VERL],
    ["die Ke_e (t oder tt?)", S_SCHW],
    ["der Antrie_ (b oder p?)", S_VERL],
    ["die Dr_hte (ä oder e?)", S_ABL]], { points: 3, hinweis: H_STRATEGIE }),
  f(GROSS_KLEIN, [
    wort("In der Ausstellung entdeckt Jasper viel ERSTAUNLICHES.", "Erstaunliches"),
    wort("Das laute RATTERN der Webstühle hört man im ganzen Haus.", "Rattern"),
    wort("Die Führung beginnt MITTWOCHS um zehn Uhr.", "mittwochs")
  ], { hinweis: H_GROSS_M }),
  a("„Wer gern tüftelt, findet im Museum genug Platz zum Tüfteln.“" + WARUM_M("tüftelt", "Tüfteln"), GRUND_M("tüftelt", "zum", "Tüfteln"),
    "„tüftelt“ ist ein gebeugtes Verb und sagt, was jemand tut, deshalb bleibt es klein. Vor „Tüfteln“ steht das Signalwort „zum“ (zu dem): Das Verb wird als Nomen gebraucht und großgeschrieben.",
    KW_GRUND_M),
  f(GETRENNT_M, [
    wort("Im Garten des Museums dürfen alle (EISENBAHN + FAHREN).", "Eisenbahn fahren"),
    wort("Das (EISENBAHN + FAHREN) gefällt auch den Erwachsenen.", "Eisenbahnfahren"),
    wort("In das alte Feuerwehrauto dürfen Kinder (HINEIN + KLETTERN).", "hineinklettern")
  ], { hinweis: H_GETRENNT_M }),
  f(S_LAUT_M, [
    verbform("Der Strom ___ durch das Kabel.", "fließen – Präteritum", "floss"),
    verbform("Frau Winkler ___ die Länge des Flügels.", "messen – Präteritum", "maß")
  ], { hinweis: H_S_LAUT_M }),
  m(DAS_DASS, [
    ["___ die Führung ausfällt, ärgert die ganze Klasse.", E_KEIN],
    ["Das Modell, ___ Sibel gebaut hat, fährt mit Solarstrom.", E_WELCHES],
    ["Pavel behauptet, ___ sei das älteste Auto der Sammlung.", E_DIESES],
    ["Frau Winkler erklärt, ___ die Maschine mit Dampf arbeitet.", E_KEIN]], { points: 2, hinweis: H_DAS_DASS }),
  m(BEDEUTUNG, [
    ["Die alte Schreibmaschine steht in einer VITRINE.", "Schaukasten"],
    ["Das Motorrad im ersten Saal ist keine Kopie, sondern ein ORIGINAL.", "echtes Stück"],
    ["Jeder Saal zeigt eine andere EPOCHE der Technik.", "Zeitabschnitt"],
    ["Mit diesem APPARAT wurden früher Nachrichten verschickt.", "Gerät"]], { points: 2, hinweis: H_BEDEUTUNG }),
  f(FREMD_M, [
    wortKlein("funktion_ren (i oder ie?)", "funktionieren"),
    wort("der Z_linder (ü oder y?)", "Zylinder", "der Zylinder")
  ], { hinweis: H_FREMD_M }),
  k(KOMMA, [
    "Jasper zeichnet Zahnräder, Hebel und Ventile ab, weil er später ein Modell bauen will.",
    "Die Lokomotive, die in der großen Halle steht, wiegt über achtzig Tonnen.",
    "Sibel drückt einen Knopf, um den Roboter zu wecken."], { hinweis: H_KOMMA_M }),
  a("„Die Druckerpresse, ein Nachbau aus Holz, steht gleich neben der Kasse.“" + WARUM_KOMMA, GRUND_KOMMA("ein Nachbau aus Holz", "die Druckerpresse", "Die Druckerpresse steht gleich neben der Kasse."),
    "„ein Nachbau aus Holz“ ist ein Einschub: Er erklärt die Druckerpresse genauer. Einen Einschub trennt man vorn und hinten mit einem Komma ab, denn der Satz geht danach weiter.",
    KW_KOMMA),
  f(FEHLER("sechs"), [
    fehler("Rundgang", "der Rundgang", "Der Rundgang"),
    fehler("Gewaltiges", "etwas Gewaltiges"),
    fehler("dass"),
    fehler("experimentieren"),
    fehler("Mathematik", "für Mathematik"),
    fehler("Abschluss", "Zum Abschluss")
  ], { menge: true, vorgabe: FT_MA, hinweis: H_FEHLER }),
  abschrift(ABSCHRIFT("Fünf", "drei"), AB_MA, AB_MA_RICHTIG,
    "Flugzeuk → Flugzeug, Konstrukzion → Konstruktion, starten → Starten, Gereusch → Geräusch, Erlebnise → Erlebnisse",
    "das Komma nach „ist“ („Obwohl es über hundert Jahre alt ist, sieht …“: Nebensatz vor dem Hauptsatz) und die beiden Kommas nach „Konstruktion“ und nach „galt“ (eingeschobener Relativsatz)",
    STUFEN_M, ["flugzeug|konstruktion|geräusch", "erlebnisse|starten"])
];

/* ============================== M7, Variante B – Wortfeld Konzert und Musik ============================== */
const M_B = [
  m(STRATEGIE, [
    ["die _ioline (V oder W?)", S_MERK],
    ["es klin_t (g oder k?)", S_VERL],
    ["die Tro_el (m oder mm?)", S_SCHW],
    ["der Verst_rker (ä oder e?)", S_ABL],
    ["der Gesan_ (g oder k?)", S_VERL],
    ["die Kl_nge (ä oder e?)", S_ABL]], { points: 3, hinweis: H_STRATEGIE }),
  f(GROSS_KLEIN, [
    wort("Das leise SUMMEN der Lautsprecher stört niemanden.", "Summen"),
    wort("Die Band probt FREITAGS im Keller der Schule.", "freitags"),
    wort("Auf dem Programm steht heute wenig BEKANNTES.", "Bekanntes")
  ], { hinweis: H_GROSS_M }),
  a("„Wer täglich übt, merkt beim Üben schnell seine Fortschritte.“" + WARUM_M("übt", "Üben"), GRUND_M("übt", "beim", "Üben"),
    "Vor „Üben“ steht das Signalwort „beim“ (bei dem), deshalb ist das Wort hier ein Nomen und wird großgeschrieben. „übt“ ist dagegen ein gebeugtes Verb: Es sagt, was jemand tut, und bleibt klein.",
    KW_GRUND_M),
  f(GETRENNT_M, [
    wort("Beim letzten Lied dürfen alle (MIT + SINGEN).", "mitsingen"),
    wort("Tamara möchte später in einer Band (SCHLAGZEUG + SPIELEN).", "Schlagzeug spielen"),
    wort("Vom lauten (SCHLAGZEUG + SPIELEN) dröhnen Enno die Ohren.", "Schlagzeugspielen")
  ], { hinweis: H_GETRENNT_M }),
  f(S_LAUT_M, [
    verbform("Vor Aufregung ___ Mateo fast seinen Einsatz.", "vergessen – Präteritum", "vergaß"),
    verbform("Der ganze Saal ___ die Musik.", "genießen – Präteritum", "genoss")
  ], { hinweis: H_S_LAUT_M }),
  m(DAS_DASS, [
    ["Das Stück, ___ die Band zuletzt spielt, dauert zehn Minuten.", E_WELCHES],
    ["Azra meint, ___ sei der beste Auftritt des Jahres.", E_DIESES],
    ["___ der Saal so voll ist, überrascht die Musiker.", E_KEIN],
    ["Mateo hofft, ___ seine Kraft bis zum Schluss reicht.", E_KEIN]], { points: 2, hinweis: H_DAS_DASS }),
  m(BEDEUTUNG, [
    ["Die Band geht im Herbst auf TOURNEE.", "Konzertreise"],
    ["Nach dem letzten Lied gibt es lauten APPLAUS.", "Beifall"],
    ["Morgen feiert das neue Musical PREMIERE.", "erste Aufführung"],
    ["Das PUBLIKUM steht schon dicht vor der Bühne.", "Zuhörer"]], { points: 2, hinweis: H_BEDEUTUNG }),
  f(FREMD_M, [
    wortKlein("dirig_ren (i oder ie?)", "dirigieren"),
    wort("die H_mne (ü oder y?)", "Hymne", "die Hymne")
  ], { hinweis: H_FREMD_M }),
  k(KOMMA, [
    "Der Gitarrist, der heute Geburtstag hat, bekommt eine Torte auf die Bühne.",
    "Tamara zählt leise mit, um ihren Einsatz nicht zu verpassen.",
    "Die Band verstaut Gitarren, Kabel und Notenständer im Bus, sobald der letzte Ton verklungen ist."], { hinweis: H_KOMMA_M }),
  a("„Azras Geige, ein Geschenk ihres Großvaters, hat einen besonders warmen Ton.“" + WARUM_KOMMA, GRUND_KOMMA("ein Geschenk ihres Großvaters", "Azras Geige", "Azras Geige hat einen besonders warmen Ton."),
    "Zwischen den Kommas steht ein Einschub: „ein Geschenk ihres Großvaters“ sagt genauer, was das für eine Geige ist. Weil der Satz danach weitergeht, steht vor und hinter dem Einschub ein Komma.",
    KW_KOMMA),
  f(FEHLER("sechs"), [
    fehler("Vorhang", "dem Vorhang"),
    fehler("dass"),
    fehler("Schlimmes", "nichts Schlimmes"),
    fehler("Atmosphäre", "die Atmosphäre", "Die Atmosphäre"),
    fehler("Schweiß", "der Schweiß"),
    fehler("gratulierte")
  ], { menge: true, vorgabe: FT_MB, hinweis: H_FEHLER }),
  abschrift(ABSCHRIFT("Fünf", "drei"), AB_MB, AB_MB_RICHTIG,
    "Sengerin → Sängerin, stimmen → Stimmen, Komposizion → Komposition, Hindernisen → Hindernissen, Erfolk → Erfolg",
    "das Komma nach „war“ („Weil ein Kabel locker war, hörte …“: Nebensatz vor dem Hauptsatz) und die beiden Kommas nach „Komposition“ und nach „hat“ (eingeschobener Relativsatz)",
    STUFEN_M, ["sängerin|komposition|hindernissen", "erfolg|stimmen"])
];

const ALLE = { kurz: "Rechtschreibung", scope: "Strategien · groß und klein · getrennt und zusammen · s-Laute und das/dass · Fremdwörter · Kommas", minutes: 40, texte: [],
  hinweis: "Arbeite allein und lies jede Aufgabe genau. In dieser Probe kommt es auf die genaue Schreibweise an – bei vielen Feldern auch auf groß und klein. Prüfe deshalb jedes Feld, bevor du abgibst: Steht der erste Buchstabe so da, wie du ihn haben willst? Plane für die beiden letzten Aufgaben etwa 12 Minuten ein. Nach der Abgabe kannst du nichts mehr ändern." };
module.exports = {
  "d7-p8-r-a": probe(8, "R", "A", { ...ALLE, title: "Probe 8 (R7): Rechtschreibung und Sprachtraining", items: R_A }),
  "d7-p8-r-b": probe(8, "R", "B", { ...ALLE, title: "Probe 8 (R7): Rechtschreibung und Sprachtraining – Variante B", items: R_B }),
  "d7-p8-m-a": probe(8, "M", "A", { ...ALLE, title: "Probe 8 (M7): Rechtschreibung und Sprachtraining", items: M_A }),
  "d7-p8-m-b": probe(8, "M", "B", { ...ALLE, title: "Probe 8 (M7): Rechtschreibung und Sprachtraining – Variante B", items: M_B })
};
