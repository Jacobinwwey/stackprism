# Ergebnisse interpretieren

## Konfidenz

Jede Technologie trägt ein Konfidenz-Badge mit drei Stufen:

| Stufe       | Farbe | Bedeutung                                                                                                                     |
| ----------- | ----- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Hoch**    | Grün  | Starkes Signal: globale Variable (z. B. `window.React`), exklusiver DOM-Selektor, eindeutige Ressourcen-URL (z. B. `/_next/`) |
| **Mittel**  | Gelb  | Mittleres Signal: ungenaue Übereinstimmung im Antwortheader, CSS-Klassen-Präfix, CSS-Variablen-Set                            |
| **Niedrig** | Grau  | Schwaches Signal: generischer Skriptdateiname als Fallback (z. B. `*.min.js`), unspezifische Regex                            |

In der Ansicht „Highlights" werden standardmäßig nur Ergebnisse mit hoher Konfidenz angezeigt.

## Belege

Jede Karte zeigt bis zu 4 Belegzeilen. Typische Belege sind DOM-Markierungen, Ressourcen-URLs, Antwortheader und Datensätze dynamisch geladener Ressourcen, zum Beispiel:

```text
- DOM-Knoten enthält React-Fiber-Markierung
- Ressourcen-URL entspricht unpkg.com/react@18.2.0/umd/react.production.min.js
- Antwortheader X-Powered-By: Next.js
```

Bei Fehlerkennungen zuerst die Belege prüfen. Sie zeigen meist, ob das Problem an einer Ressourcenregel, einer Antwortheaderregel oder einer zu breiten DOM-/Class-Übereinstimmung liegt.

## Quellen

Das Quellen-Label gibt an, woher ein Ergebnis stammt:

| Quellen-Label                          | Herkunft                                                                                          |
| -------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `Antwortheader`                        | HTTP-Antwortheader des Hauptdokuments (server / x-powered-by / set-cookie usw.)                   |
| `Antwortheader · API`                  | Antwortheader einer XHR/fetch-Anfrage der aktuellen Seite                                         |
| `Antwortheader · iframe`               | Antwortheader des Hauptdokuments eines eingebetteten iFrames                                      |
| `Dynamisch`                            | Ressourcen / dynamisch geladene Skripte, die vom Content Script + MutationObserver erfasst wurden |
| `Dynamisch · nach Benutzerinteraktion` | Ressourcen, die erst nach einer Benutzeraktion geladen werden (Dialoge, Login, Zahlung)           |
| `WordPress-Theme`                      | Rückschluss aus dem Theme-style.css-Header                                                        |

**Ein Klick auf ein Quellen-Label** öffnet ein Panel am unteren Rand mit dem **rohen JSON-Datensatz für diese Technologie und diese Quelle**. Es zeigt direkt die Original-Antwortheader, die Ressourcen-URL-Liste oder den dynamischen Snapshot, ohne die gesamte JSON-Datei durchsuchen zu müssen.

## Sortierung

Standard-Sortierreihenfolge:

1. Kategorieindex (Frontend-Frameworks → UI-Frameworks → Build-Runtime → CDN → …)
2. Innerhalb einer Kategorie absteigend nach Konfidenz (Hoch → Mittel → Niedrig)
3. Bei gleicher Konfidenz alphabetisch per localeCompare

Bei Auswahl einer bestimmten Kategorie wird nur innerhalb dieser Kategorie sortiert. Die Ansicht „Highlights" zeigt alle Technologien mit hoher Konfidenz; falls keine vorhanden sind, werden die Top-30 aus allen Technologien nach Konfidenz absteigend angezeigt.

## Duplikat-Zusammenführung

Wenn dieselbe Technologie aus mehreren Quellen erkannt wird (z. B. React sowohl im Antwortheader als auch im DOM), wird sie nicht doppelt angezeigt — sie wird zu einem Eintrag zusammengeführt, wobei die höchste Konfidenz übernommen, Belege dedupliziert zusammengeführt und alle erkannten Quellen im sources-Array aufgelistet werden.

## Nicht erkannt bedeutet nicht abwesend

Das Werkzeug erkennt, „**welche Hinweise eine Webseite dem Browser preisgibt**". Wenn eine Website:

- alle Runtime-Spuren nach dem SSR-Rendering entfernt (z. B. statisch vorgerenderte Astro-Seiten)
- alle benutzerdefinierten Server-Header entfernt
- Bundle-Dateinamen vollständig gehasht ohne Framework-Namen

... kann die Erweiterung möglicherweise nur wenige oder gar keine Ergebnisse liefern. Das liegt in der Regel nicht an fehlenden Regeln, sondern daran, dass die Seite nicht ausreichend Hinweise an den Browser weitergibt.

Frontend-Build-Hinweise sind auch nicht gleichbedeutend mit dem serverseitigen Runtime. Das Vorhandensein von `/_next/`, `/_nuxt/` oder Vite-Artefakten belegt nur die Frontend-Build-Pipeline, nicht dass der Server zwingend Node.js verwendet. Backend-Sprachen erkennt man normalerweise an `Server`-, `X-Powered-By`-Headern, Cookie-Namen oder frameworkspezifischen Antwortheadern.

## Korrekturschaltfläche

Die Schaltfläche „Erkennung ungenau, hier korrigieren" auf jeder Karte öffnet ein GitHub-Issue, das automatisch folgende Informationen enthält:

- Aktuelle Seiten-URL
- JSON des Erkennungsergebnisses
- Sichtbare Belege
- Erweiterungsversion

Im Beschreibungsfeld genügt eine Erklärung, was falsch war oder was stattdessen erkannt werden sollte. Der Maintainer wird dann die entsprechende Regel unter [`rules/`](https://github.com/setube/stackprism/tree/main/public/rules) anpassen.
