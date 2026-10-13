# Regeln beitragen

## Wege

Beiträge lassen sich in zwei Kategorien unterteilen:

1. **Schnelles Feedback**: Auf der Technologiekarte im Popup auf „Erkennung ungenau, hier korrigieren" klicken. Das öffnet automatisch ein GitHub-Issue mit vorausgefülltem Kontext (Seiten-URL, aktuelles Regelübereinstimmungsergebnis, Erweiterungsversion). Der Maintainer passt daraufhin die Regel an.
2. **Direkter PR**: Repository forken, die entsprechende JSON-Datei unter `public/rules/` bearbeiten, lokal prüfen und einen PR einreichen.

Der folgende Abschnitt beschreibt hauptsächlich den direkten PR-Workflow.

## Die richtige Datei finden

`public/rules/` ist nach Aufgaben in Dateien aufgeteilt:

| Datei | Inhalt |
| ----- | ------ |
| `page/frontend-frameworks.json` | React / Vue / Angular / diverse Frontend-Frameworks |
| `page/ui-frameworks.json` | Tailwind / Bootstrap / Element / Antd und andere UI-Bibliotheken |
| `page/build-runtime.json` | Webpack / Vite / Rollup / Bun und andere Build-Tools |
| `page/frontend-cdn-libraries.json` | Benannte Frontend-Bibliotheken via CDN (jQuery, lodash, moment usw.) |
| `page/wordpress-plugins.json` | 4.500+ WordPress-Plugins |
| `page/drupal-modules.json` | 4.000+ Drupal-Module |
| `page/cms-themes.json` | CMS-Themes |
| `page/website-programs.json` | WordPress / Drupal / Discuz! und andere CMS selbst |
| `page/payment-systems.json` | Zahlungsplattformen |
| `page/third-party-logins.json` | Drittanbieter-Login |
| `page/saas-services.json` | SaaS (Sentry / Mixpanel / Intercom usw.) |
| `page/analytics-providers.json` | Analytics und Statistik |
| `page/cdn-providers.json` | CDN-Anbieter (Erkennung über Frontend-Laufzeit) |
| `headers/server-products.json` | Serverprodukte, erkannt über `Server:`-Header |
| `headers/cdn-providers.json` | CDNs, erkannt über Antwortheader |
| `headers/website-programs.json` | CMS, erkannt über Antwortheader |
| ... | |

Die vollständige Liste findet sich in `public/rules/index.json`.

## Minimales Beispiel für eine neue Regel

Angenommen, du möchtest ExampleCMS hinzufügen. In `page/website-programs.json` die passende Gruppe suchen (z. B. „selbstgehostetes CMS") und eine Regel ergänzen:

```json
{
  "name": "ExampleCMS",
  "url": "https://examplecms.example.com",
  "patterns": ["examplecms-[0-9.]+\\.min\\.js", "/_examplecms/"],
  "globals": ["ExampleCMS"],
  "selectors": ["[data-powered-by='examplecms']"]
}
```

Feldbedeutungen: siehe [Regelformat](./rule-format.md).

## In welche Gruppe?

Die entsprechende JSON-Datei öffnen; darin ist eine verschachtelte group-Struktur zu sehen:

```json
{
  "page": {
    "websitePrograms": {
      "defaults": { "category": "网站程序" },
      "rules": [
        {
          "defaults": { "confidence": "高" },
          "rules": [
            // Reihe von benannten CMS mit hoher Konfidenz
          ]
        },
        {
          "defaults": { "confidence": "中" },
          "rules": [
            // Reihe mit mittlerer Konfidenz
          ]
        }
      ]
    }
  }
}
```

Die Regel der Untergruppe zuordnen, die zur eigenen Einschätzung der Erkennungssicherheit passt. Die Reihenfolge der Regeln innerhalb des Arrays beeinflusst das Erkennungsergebnis nicht, nur die Übersicht beim Debugging.

## Regel validieren

Nach dem Bearbeiten:

```bash
pnpm run build
```

Der Build führt `precompileRulesPlugin` aus, das `__hints` und andere Felder in die Regeln injiziert. Anschließend unter `chrome://extensions/` das Verzeichnis `dist/` laden und die Regel auf einer echten ExampleCMS-Website prüfen.

Alternativ zunächst die Regel im Panel „Benutzerdefinierte Regeln" als Nutzerkonfigurations-Schicht schreiben, ihre Wirksamkeit bestätigen und sie dann nach `public/rules/` übertragen.

## Fehlerkennungen reduzieren

- **globals bevorzugen**: `window.X` zu treffen ist am verlässlichsten — nahezu null Fehlerkennungen
- **Exklusive Selektoren bevorzugen**: `[data-powered-by='examplecms']`, `[ng-version]` — offensichtlich von dieser Technologie geschriebene Attribute
- **Ressourcen-Patterns mit vollständiger Domain oder vollständigem Pfad**: `cdn.examplecms.com/sdk.js` statt nur `examplecms`
- **classNames / classPrefixes mit Präfix**: `example-cms-` statt `cms-`, um Kollisionen mit anderen Projekten zu vermeiden
- **Regex mit Ankern**: `^/_examplecms/` ist präziser als `/_examplecms/`
- **Konfidenz lieber konservativ**: Bei Unsicherheit „Mittel" verwenden — Nutzer sehen dann ein gelbes statt grünes Badge und werden nicht in die Irre geführt

## Workflow für Beiträge zum Hauptrepository

1. [setube/stackprism](https://github.com/setube/stackprism) forken
2. Lokal klonen, `pnpm install`, `pnpm run build` — sicherstellen, dass der Build korrekt durchläuft
3. Die entsprechende Datei unter `public/rules/` finden und die Regel ergänzen
4. 2–3 Belege aus [Wappalyzer rules](https://github.com/enthec/webappanalyzer), der offiziellen Website oder der Dokumentation sammeln und in die PR-Beschreibung aufnehmen
5. PR gegen den main-Branch einreichen

Die PR-Beschreibung muss mindestens enthalten: welche Technologien hinzugefügt wurden, auf welcher Seite die Regel getestet wurde und warum diese Merkmale keine anderen Websites fälschlicherweise treffen.
