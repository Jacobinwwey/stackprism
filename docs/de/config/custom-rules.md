# Benutzerdefinierte Regeln

Benutzerdefinierte Regeln ergänzen Seiten, die von den eingebauten Regeln nicht abgedeckt werden, oder ermöglichen die lokale Validierung einer neuen Regel, bevor sie als verlässlich gilt.

## Formular ausfüllen

| Feld | Pflicht | Beschreibung |
| ---- | ------- | ------------ |
| **Technologiename** | Ja | Im Popup angezeigter Name, z. B. `MyCMS` |
| **Kategorie** | | Wähle eine der 23 eingebauten Kategorien oder gib eine neue ein. Standard: „Sonstige Bibliotheken". Das Select-Feld unterstützt freie Eingabe. |
| **Typbeschreibung** | | Eigene Notiz, z. B. `Enterprise-CMS`, `Drittanbieter-Zahlung`. Wird als Präfix in den Belegen angezeigt, kann leer bleiben. |
| **Konfidenz** | | Hoch / Mittel / Niedrig, Standard: „Mittel" |
| **Übereinstimmungstyp** | | Schlüsselwort / Regulärer Ausdruck, Standard: „Regulärer Ausdruck" |
| **Offizielle Website / Repository-URL** | | Muss `http://` oder `https://` beginnen. Wenn angegeben, wird der Technologiename im Popup anklickbar |

Darunter befinden sich vier weitere Bereiche:

- **Übereinstimmungsbereich**: Legt fest, in welchen Datenquellen patterns / selectors / globals gesucht werden
  - Seiten-URL: die aktuelle Webseitenadresse
  - Ressourcen-URL: von Skripten / Stylesheets / iFrames geladene Ressourcen
  - DOM / Quellcode: outerHTML der Seite
  - Antwortheader: Hauptdokument + API + iFrame-Antwortheader
  - Dynamische Ressourcen: durch MutationObserver kontinuierlich gesammelte Ressourcen

- **Übereinstimmungsregeln (patterns)**: Eine pro Zeile. Im Schlüsselwort-Modus: literal enthaltener String; im Regex-Modus: JS-Regex-Quelltext (ohne `/.../i`-Umrahmung – das `i`-Flag wird von der Erweiterung automatisch hinzugefügt)

- **CSS-Selektoren (selectors)**: Ein Selektor pro Zeile, z. B. `[data-v-app]`, `#__next`. Der Übereinstimmungsbereich muss „DOM / Quellcode" enthalten

- **Globale Variablen (globals)**: Eine pro Zeile, z. B. `React`, `Vue.config`, `__NEXT_DATA__`. Ein Treffer ergibt automatisch hohe Konfidenz

## Hinzufügen / Aktualisieren

- **Regel hinzufügen** (grüne Hauptschaltfläche): Speichert das aktuelle Formular als neue Regel
- **Aktuelle Regel aktualisieren**: Zuerst auf „Bearbeiten" neben einer Regel in der Liste unten rechts klicken, um in den Bearbeitungsmodus zu wechseln, dann nach den Änderungen speichern

Abschließend muss oben rechts auf der Seite „Einstellungen speichern" geklickt werden, damit die Regeln in den Storage geschrieben werden.

## Liste der hinzugefügten Regeln

Am unteren Rand der Seite, jede Regel mit:

- Titel: Technologiename der Regel
- Metadaten: Kategorie · Typ · Konfidenz · Übereinstimmungstyp · N patterns
- Aktionen: Schaltflächen „Bearbeiten" und „Löschen" (Löschen-Schaltfläche wird beim Hovern rot)

## Regelvalidierung

Bei jedem Hinzufügen / Aktualisieren / Speichern der Einstellungen werden folgende Prüfungen durchgeführt:

- Name ist erforderlich
- patterns / selectors / globals: mindestens eines muss ausgefüllt sein
- Übereinstimmungsbereich: mindestens eine Option muss ausgewählt sein
- url-Feld muss, falls ausgefüllt, mit http(s):// beginnen
- patterns (im Regex-Modus): jedes muss `new RegExp` bestehen
- selectors: jedes muss `document.createDocumentFragment().querySelector` bestehen
- globals: jedes muss dem Format `MyCMS` oder `google.maps` (punktgetrennter Variablenname) entsprechen

Bei Validierungsfehlern erscheint ein roter Hinweisdialog mit bis zu 6 Problemen.

## Beispiel: Einfaches Schlüsselwort

ExampleCMS erkennen:

```text
Technologiename: ExampleCMS
Kategorie:       CMS / Website-Programme
Übereinstimmungstyp: Schlüsselwort
Übereinstimmungsregeln:
  examplecms
  X-Generator: ExampleCMS
Übereinstimmungsbereich: [x] Seiten-URL [x] Ressourcen-URL [x] DOM / Quellcode [x] Antwortheader
```

## Beispiel: WordPress-Theme erkennen

```text
Technologiename: WordPress-Theme: oceanwp
Kategorie:       Themes / Templates
Übereinstimmungstyp: Schlüsselwort
Übereinstimmungsregeln:
  /wp-content/themes/oceanwp/
Übereinstimmungsbereich: [x] Ressourcen-URL [x] DOM / Quellcode
```

## Beispiel: Dynamisch geladenes Zahlungs-SDK erkennen

Das Zahlungs-SDK wird erst nach dem Klick auf den Zahlungsbutton geladen, daher „Dynamische Ressourcen" auswählen:

```text
Technologiename: ExamplePay
Kategorie:       Zahlungssysteme
Typbeschreibung: Drittanbieter-Zahlung
Übereinstimmungstyp: Schlüsselwort
Übereinstimmungsregeln:
  pay.example.com
  examplepay-sdk
Übereinstimmungsbereich: [x] Dynamische Ressourcen
```

## Beispiel: Bibliotheksdatei mit Versionsnummer per Regex erkennen

```text
Technologiename: ExampleLib
Kategorie:       Frontend-Frameworks
Übereinstimmungstyp: Regulärer Ausdruck
Übereinstimmungsregeln:
  examplelib-[0-9.]+\.min\.js
Übereinstimmungsbereich: [x] Ressourcen-URL [x] Dynamische Ressourcen
```

## Fehlerkennungen reduzieren

- Keine zu allgemeinen Schlüsselwörter wie `app`, `main`, `login` verwenden — fast alle Websites enthalten diese
- Vollständige Domain `pay.example.com` bevorzugen statt nur `pay`
- Spezifische Pfade `/wp-content/themes/oceanwp/` bevorzugen statt nur `oceanwp`
- Bei Unsicherheit Konfidenz auf „Niedrig" setzen — im Popup erscheint dann ein graues Badge als Hinweis auf einen unsicheren Treffer
- Nach dem Speichern **unbedingt die Zielseite neu laden** und dann das Popup öffnen, um die Wirkung zu prüfen — sonst zeigt der Cache noch alte Ergebnisse
