# Regelformat

Die JSON-Dateien unter `public/rules/` sind nach Erkennungsrichtung aufgeteilt. `public/rules/index.json` ist das Manifest und listet die vom Build und zur Laufzeit zu ladenden Regeldateien auf.

## Struktur auf oberster Ebene

Eine Regel-JSON sieht in Auszügen so aus:

```json
{
  "page": {
    "frontendFrameworks": {
      "defaults": { "category": "前端框架" },
      "rules": [
        {
          "defaults": { "confidence": "高" },
          "rules": [
            {
              "name": "React",
              "patterns": ["react(?:\\.production|\\.development)?(?:\\.min)?\\.js"],
              "globals": ["React"]
            },
            {
              "name": "Vue",
              "patterns": ["vue(?:\\.runtime)?(?:\\.global)?(?:\\.prod)?(?:\\.min)?\\.js"],
              "globals": ["Vue"],
              "selectors": ["[data-v-app]"]
            }
          ]
        }
      ]
    }
  }
}
```

- Schlüssel auf oberster Ebene (z. B. `page` / `headers`) entsprechen Erkennungsmodulen im Hintergrundprozess, die per Name geladen werden
- Schlüssel auf zweiter Ebene (z. B. `frontendFrameworks` / `cdnProviders`) werden ebenfalls per Name abgerufen
- Objekte der Form `{ defaults, rules }` stellen eine **Regelgruppe** (rule group) dar
- Gruppen können Gruppen enthalten; die innerste Ebene sind „Leaf Rules" (ohne weiteres `rules`-Feld)

## Defaults-Vererbung in Regelgruppen

`defaults` (alternativ `$defaults`; beide sind gleichwertig) wird auf alle Leaf Rules der Gruppe vererbt. Bei mehreren Verschachtelungsebenen überschreiben innere Werte äußere. Die endgültig expandierte Leaf Rule ergibt sich aus `{ ...äußereDefaults, ...innereDefaults, ...blattFelder }`.

Beispiel:

```json
{
  "defaults": { "category": "前端框架" },
  "rules": [
    {
      "defaults": { "confidence": "高" },
      "rules": [{ "name": "React", "patterns": ["react.js"] }]
    }
  ]
}
```

Expandiert entspricht die React-Regel:

```json
{
  "category": "前端框架",
  "confidence": "高",
  "name": "React",
  "patterns": ["react.js"]
}
```

## Felder einer Leaf Rule

| Feld | Typ | Beschreibung |
| ---- | --- | ------------ |
| `name` | string | Im Popup angezeigter Name |
| `category` | string | Kategorie, sortiert nach `CATEGORY_ORDER` |
| `kind` | string | Typbeschreibung, optional. Wird als Präfix in Belegen angezeigt |
| `confidence` | `"高"` / `"中"` / `"低"` | Standard: `"中"` |
| `matchType` | `"keyword"` / `"regex"` | Standard: `"regex"` (direkt `new RegExp(p, 'i')`) |
| `patterns` | string[] | Muster. Keyword-Typ verwendet `escapeRegExp + RegExp` |
| `selectors` | string[] | CSS-Selektoren, Treffer ergibt hohe Konfidenz |
| `globals` | string[] | Globale Variablennamen (punkt-getrennte Pfade unterstützt), Treffer ergibt hohe Konfidenz |
| `classNames` | string[] | Exakte Klassen-Übereinstimmung im DOM, Treffer ergibt hohe Konfidenz |
| `classPrefixes` | string[] | DOM-Klassen mit diesem Präfix, Treffer ergibt hohe Konfidenz |
| `cssVariables` | string[] | Treffer, wenn N der CSS-Custom-Properties auf der Seite übereinstimmen, kombiniert mit `minCssVariableMatches` |
| `minCssVariableMatches` | number | Standard: 1 |
| `matchIn` | string[] | Schränkt patterns auf bestimmte Datenquellen ein: `url` / `resources` / `html` / `headers` / `dynamic`. Leeres Array / nicht angegeben = alle |
| `resourceOnly` | boolean | Nur Ressourcen-URL-Matching; überspringt DOM / globals / selectors |
| `resourceHints` | string[] | Manuell angegebene Vorfilter-Fingerabdrücke; Muster werden nur durchsucht, wenn der Text einen Hint enthält |
| `evidence` | string | Feste Belegmeldung bei Treffer; überschreibt den Standard „Ressourcen-URL-Treffer / DOM-Treffer" |
| `url` | string | Offizielle Website oder Repository der Technologie |

## Automatisch injizierte Felder (Build-Zeit)

Das `precompileRulesPlugin` in `vite.config.ts` injiziert in jede Leaf Rule:

| Feld | Herkunft |
| ---- | -------- |
| `__hints` | Erforderliche Literalmengen aus dem Regex (`src/utils/rule-hints.ts`): Text, der ein Muster treffen kann, enthält immer eines davon. Dient nur zum Überspringen unmöglicher Treffer, ändert das Ergebnis nicht |
| `__legacyHints` | Ältere Vorfilter-Schwellenwerte (die 3 längsten Literalsegmente, bis Version 1.3.79). Wird nur für Regeln ohne `resourceHints` geschrieben, bei denen `__hints` strenger ist — stellt sicher, dass sich Erkennungsergebnisse nicht ändern |
| `__keywordCombined` | Bei `matchType: keyword`: alle Patterns nach dem Escapen mit `\|` zu einem kombinierten Regex-Quelltext zusammengefügt |

Manuell in Regeldateien geschriebene `__hints` werden als ältere Schwellenwerte dieser Regel behandelt. Zur Laufzeit lesen `getRuleAutoHints(rule)` und `getCompiledCombinedPattern(rule)` bevorzugt diese Felder und fallen erst bei deren Fehlen auf die Laufzeitberechnung zurück (benutzerdefinierte Regeln berechnen nur erforderliche Literale, haben keine alten Schwellenwerte).

## Regeldatei-Manifest

`rules/index.json`:

```json
{
  "schemaVersion": 1,
  "files": [
    "page/feeds.json",
    "page/frontend-frameworks.json",
    "page/ui-frameworks.json",
    "page/build-runtime.json",
    "page/frontend-extra.json",
    "page/frontend-local-libraries.json",
    "page/frontend-cdn-libraries.json",
    "page/frontend-package-cdn-libraries.json",
    "page/frontend-regional-cdn-libraries.json",
    "page/wordpress-themes.json",
    "page/drupal-themes.json",
    "page/wordpress-plugins.json",
    "page/drupal-modules.json",
    "...",
    "headers/server-products.json",
    "headers/header-patterns.json",
    "headers/cdn-providers.json"
  ]
}
```

`page/*.json` dient dem Seiten-Erkennungspfad (verwendet von page-detector und dynamic-snapshot); `headers/*.json` dient dem Antwortheader-Erkennungspfad (verwendet von headers.ts). Beide Pfade sind unabhängig, das Leaf-Rule-Feldformat ist jedoch identisch.

## Ladevorgang

`src/background/rule-loader.ts`:

1. `rules/index.json` abrufen
2. Alle JSON-Dateien aus `files[]` parallel abrufen
3. Jede JSON-Datei mit `normalizeRuleValue` rekursiv auf Gruppen aufteilen
4. `mergeRulePartial` führt alle Schlüssel der einzelnen Dateien zu einem großen Objekt zusammen
5. Gibt `RuleConfig` zurück, aus der die einzelnen Erkennungsmodule Arrays nach Schlüssel entnehmen

## Wo Änderungen vornehmen

- Erkennungsregel einer bestimmten Technologie ändern: die entsprechende JSON-Datei nach Kategorie direkt bearbeiten
- Neue Kategorie hinzufügen: Datei in `rules/index.json` eintragen und sicherstellen, dass das entsprechende Hintergrundmodul den Schlüssel liest (`loadTechRules` in `detector-settings.ts`)
- Massenänderungen: JSON per Skript generieren und die Originaldatei überschreiben
