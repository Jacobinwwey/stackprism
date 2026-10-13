# Grundlegende Nutzung

Das Popup hat eine feste Höhe von 600 px. Den Großteil nimmt die Technologieliste ein. Oben befinden sich Seiteninformationen und Filtersteuerelemente, unten Suche, Rohdaten und weitere Hilfswerkzeuge.

## Obere Werkzeugleiste

```text
[StackPrism  Aktuelle Seiten-URL]    [Theme] [Einstellungen] [Kopieren] [Aktualisieren]
```

- **Links**: Erweiterungsname + Versionsnummer + aktuelle Seiten-URL (gekürzt, vollständige URL beim Hovern)
- **Vier Icon-Schaltflächen rechts**:
  - **Theme** (Sonne / Mond / Bildschirm-Icon): Klick wechselt zwischen „Automatisch / Hell / Dunkel"
  - **Einstellungen**: Öffnet die Einstellungsseite (separater Tab)
  - **Kopieren**: Kopiert die aktuelle Seiten-URL in die Zwischenablage
  - **Aktualisieren**: Fordert den Hintergrundprozess auf, die aktuelle Seite neu zu analysieren; bestehende gecachte Ergebnisse bleiben zunächst im Popup sichtbar

## Übersichtsdaten

```text
22 Technologien    274 Ressourcen    0 Antwortheader
```

- **Technologien**: Gesamtanzahl deduplizierter erkannter Technologien
- **Ressourcen**: Anzahl der auf der aktuellen Seite geladenen Ressourcen-URLs (Skripte, Stylesheets, iFrames, Bilder usw.)
- **Antwortheader**: Anzahl nützlicher Header, die aus dem Antwortheader des Hauptdokuments extrahiert wurden

## Kategorie-Filterleiste

```text
[ Highlights 5  Alle 22 ]    [ Kategorie auswählen ▾ ]
```

- Links: Segment-Umschalter — „Highlights" zeigt nur Ergebnisse mit hoher Konfidenz, „Alle" zeigt alle
- Rechts: Kategorie-Dropdown mit 24 Kategorien (Frontend-Frameworks / UI-Frameworks / CDN / WAF / CMS / …); bei Auswahl einer Kategorie werden nur deren Ergebnisse angezeigt. Jede Option enthält eine Zahl (z. B. „CMS · 4")

## Technologieliste

Jede Technologie wird auf einer Karte dargestellt:

```text
React                                         [Hohe Konfidenz]
- DOM-Knoten enthält React-Fiber-Markierung
- Ressourcen-URL entspricht cdn.example.com/react.production.min.js
Quelle: Antwortheader  Dynamisch
Erkennung ungenau, hier korrigieren
```

- **Technologiename**: Klickbar, öffnet die offizielle Website oder das Repository der Technologie (beim Hovern erscheint rechts ein Extern-Link-Icon)
- **Konfidenz-Badge**: Hoch (grün) / Mittel (gelb) / Niedrig (grau)
- **Belege**: Bis zu 4 Zeilen, aufgelistet sind DOM-/Ressourcen-/Header-Fragmente, die zur Erkennung geführt haben
- **Quelle**: Jedes Label ist klickbar; **ein Klick öffnet unten eine Schublade, die nur die Rohdaten dieser Technologie aus dieser Quelle anzeigt**
- **Korrekturschaltfläche**: Öffnet ein GitHub-Issue-Formular mit dem Erkennungsergebnis, um Falsch- oder Fehltreffer zu melden

::: tip
Wenn eine Seite sehr viele Ergebnisse enthält, empfiehlt sich zunächst die Ansicht „Highlights". Sie zeigt nur Ergebnisse mit hoher Konfidenz. Zum Prüfen von Fehlerkennungen oder für den vollständigen Tech-Stack wechselst du zu „Alle".
:::

## Untere Werkzeugleiste

```text
[Suche]  [Rohdaten]  [Alle kopieren]                      GitHub
```

Links befinden sich die Werkzeugschaltflächen, Details dazu unter [Hilfswerkzeuge](./tools.md). Suche und Rohdaten öffnen ein Panel von unten; ein erneuter Klick auf die Schaltfläche oder die Schließen-Schaltfläche im Panel blendet es wieder aus. „Alle kopieren" schreibt den vollständigen Tech-Stack-Bericht direkt in die Zwischenablage.

## Scrollverhalten

Die Gesamthöhe des Popups ist auf 600 px gesperrt; nur der **Technologielisten-Bereich** scrollt eigenständig. Obere Werkzeugleiste, Übersicht und Kategorie-Filterleiste bleiben dauerhaft sichtbar.

Sobald die Liste mehr als etwa 240 px nach unten gescrollt wurde, erscheint unten rechts eine runde Schaltfläche (Pfeil nach oben), die beim Klicken sanft zum Seitenanfang zurückscrollt.
