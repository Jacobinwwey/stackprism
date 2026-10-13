# Hilfswerkzeuge

Am unteren Rand des Popups befinden sich drei Werkzeuge: „Suche", „Rohdaten" und „Alle kopieren". Suche und Rohdaten öffnen ein Panel von unten, das bis zu 60 % der Popup-Höhe einnehmen kann. Ein erneuter Klick auf die Schaltfläche oder die Schließen-Schaltfläche im Panel blendet es wieder aus. „Alle kopieren" öffnet kein Panel, sondern kopiert den vollständigen Tech-Stack-Bericht direkt in die Zwischenablage.

## Quellcode-Suche

Anwendungsfall: Du verdächtigst eine Fehlerkennung oder möchtest prüfen, ob eine bestimmte Zeichenkette bzw. ein Regex-Muster tatsächlich auf der Seite vorkommt.

### Eingabefeld

Unterstützt normalen Text und reguläre Ausdrücke. Suche starten mit Enter oder Klick auf „Suchen".

### Optionen

| Option                | Beschreibung                                                                              |
| --------------------- | ----------------------------------------------------------------------------------------- |
| Groß-/Kleinschreibung | Standard: aus. Aktiviert: `React` und `react` sind nicht mehr gleichwertig                |
| Ganzes Wort           | Im Nur-Text-Modus: erfordert Nicht-Wortzeichen vor und nach dem Treffer (`\b`-Umrahmung)  |
| Regulärer Ausdruck    | Interpretiert die Eingabe als JavaScript-Regex-Quelltext, kombiniert mit den obigen Flags |

### Ausgabe

Angezeigt werden:

- Suchanfrage, Muster, Quelltyp (serialisiertes HTML oder outerHTML), Gesamtlänge des Quellcodes
- Anzahl der Treffer (bei sehr vielen wird „100+" angezeigt und nur die ersten N ausgegeben)
- Für jeden Treffer: Zeile, Spalte, Zeichenoffset sowie ein Kontext-Snippet (~60 Zeichen vor und nach dem Treffer)

::: tip
Die Suche serialisiert das DOM der aktiven Seite in einen String und durchsucht diesen, sodass versteckte Elemente, Inline-Skripte und Kommentare abgedeckt sind. Es handelt sich nicht um eine Netzwerk-Quellcode-Suche; DOM-Änderungen durch Skripte nach dem Laden der Seite sind ebenfalls enthalten.
:::

## Rohdaten

Anwendungsfall:

- Vollständige Rohdaten anzeigen (alle Antwortheader / dynamische Snapshots / Erkennungsergebnisse vor der Zusammenführung durch die Erweiterung)
- Vollständige Belege für einen Issue-Bericht sammeln
- Debugging von benutzerdefinierten Regelübereinstimmungen

Die Ausgabe ist ein vollständiges JSON-Objekt mit folgendem Aufbau:

```json
{
  "url": "https://example.com",
  "title": "Example",
  "generatedAt": "2026-05-10T10:00:00.000Z",
  "technologies": [/* deduplizierte, zusammengeführte Liste */],
  "resources": {/* Ressourcenübersicht */},
  "headers": {/* Antwortheader des Hauptdokuments */},
  "apiObservations": [/* url/headers/technologies für jede API-Antwort */],
  "frameObservations": [/* wie oben für jeden iFrame */],
  "dynamicObservations": {/* dynamisch erfasste Skripte/Stylesheets/iFrames/feedLinks/domMarkers */},
  "notes": [/* kurze methodologische Hinweise */]
}
```

### Quelle → scoped JSON

Wenn du nur die JSON-Teilmenge einer **bestimmten Technologie aus einer bestimmten Quelle** sehen möchtest, musst du nicht die gesamten Rohdaten öffnen — klicke einfach auf das Quellen-Label unterhalb der Technologiekarte (z. B. „Antwortheader" oder „Dynamisch · nach Benutzerinteraktion"). Die gleiche Schublade öffnet sich, zeigt aber nur die quellrelevanten Felder, und das technologies-Array ist auf diese eine Technologie gefiltert.

Der Schubladentitel wechselt zu einer Form wie „Rohdaten · React · Antwortheader" und signalisiert so die scoped Ansicht. Ein Klick auf „Rohdaten" in der unteren Werkzeugleiste wechselt zurück zum vollständigen JSON.

## Vollständigen Tech-Stack-Bericht kopieren

Die Schaltfläche „Alle kopieren" am unteren Rand des Popups kopiert den vollständigen Tech-Stack-Bericht der aktuellen Seite in die Zwischenablage. Der Bericht enthält:

- Eine menschenlesbare Markdown-Zusammenfassung
- Strukturiertes JSON vom Typ `stackprism.tech_stack_report.v1`
- URL, Titel, Erstellungszeit, Gesamtanzahl der Technologien, Ressourcenanzahl und Antwortheaderanzahl des Hauptdokuments

Kopiert wird der **aktuelle Popup-Stand** — nicht beeinflusst von der „Highlights"-Ansicht oder dem Kategorie-Dropdown; Kategorie-Schalter und Sperrlisten aus den Einstellungen bleiben jedoch weiterhin wirksam. Der Bericht lässt sich direkt in Issues, Notizen, KI-Agent-Eingabefelder oder externe Textwerkzeuge einfügen.

Typische Anwendungsfälle:

- Vollständigen Tech-Stack-Kontext in Issues oder PRs beifügen
- Tech-Stack einer Website in Dokumentation oder einer Wissensdatenbank festhalten
- An einen KI-Agenten zur weiterführenden Analyse übergeben
