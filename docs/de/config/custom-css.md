# Popup-Stil anpassen

Auf der Einstellungsseite befindet sich ein Eingabefeld für benutzerdefiniertes CSS. Das hier eingegebene CSS wird nach dem Speichern in den `<head>` des Popups, der Einstellungsseite und der Hilfeseite injiziert, um die Standardstile zu überschreiben.

## Beispiel: Konfidenz-Badges auffälliger gestalten

```css
.confidence.high {
  background: #14532d;
  color: #fff;
  font-weight: 700;
}

.confidence.medium {
  background: #ca8a04;
  color: #fff;
}
```

## Beispiel: Akzentfarbe ändern

```css
:root {
  --accent: #d946ef;
  --accent-dark: #a21caf;
  --accent-soft: rgba(217, 70, 239, 0.1);
}
```

Segment-Umschalter, Hover-Effekte für Tech-Links, Aktualisierungsschaltfläche und weitere Elemente im Popup referenzieren diese Tokens und ändern sich entsprechend mit.

## Beispiel: Schriftgröße erhöhen

```css
body {
  font-size: 15px;
}

.tech-name {
  font-size: 14px;
}
```

## Injektionsort

Das gesamte benutzerdefinierte CSS wird in ein `<style id="stackPrismCustomCss">`-Tag mit fester ID eingefügt und ans Ende des `<head>` angehängt. Beim erneuten Speichern wird der Inhalt ersetzt, nicht doppelt hinzugefügt.

## Geltungsbereich

- Popup
- Einstellungsseite (Options Page)
- Hilfeseite (Help Page)

Normale Webseiten werden nicht beeinflusst — dieses CSS wirkt ausschließlich innerhalb der eigenen Erweiterungs-UI.

## Debugging-Tipps

Öffne das Popup oder die Einstellungsseite, Rechtsklick → Untersuchen. Im Elements-Panel des DevTools lässt sich das injizierte Style-Tag sehen, was die Überprüfung von Selektoren erleichtert.

## Einschränkungen

- Längenbegrenzung: `CUSTOM_RULE_LIMITS.css` (Standard: 10.000 Zeichen); Speichern schlägt bei Überschreitung fehl
- Externe CSS-Dateien können nicht eingebunden werden (kein `@import`), da die Content Security Policy der Erweiterung dies nicht erlaubt
- `url(...)` mit externen Bildreferenzen (außer Base64) ist nicht erlaubt
