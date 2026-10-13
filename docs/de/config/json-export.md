# Regel-JSON importieren/exportieren

Der letzte Bereich der Einstellungsseite zeigt die aktuellen benutzerdefinierten Regeln als JSON. Geeignet für Backups, Migration und Massenbearbeitung.

## Anwendungsfälle

- Benutzerdefinierte Regeln geräte- oder kontoübergreifend migrieren
- Regeln mit einem Versionsverwaltungstool sichern
- Massenbearbeitung (Suchen-und-Ersetzen im Eingabefeld ist schneller als das Formular Regel für Regel)
- Regeln programmatisch konstruieren (Skript generiert Hunderte von Regeln)

## Feldstruktur

Jede Regel ist ein Objekt:

```json
{
  "name": "MyCMS",
  "category": "网站程序",
  "kind": "自定义 CMS",
  "confidence": "中",
  "matchType": "regex",
  "patterns": ["mycms-[0-9.]+\\.js", "X-Generator: MyCMS"],
  "selectors": ["[data-powered-by='mycms']"],
  "globals": ["MyCMS"],
  "matchIn": ["url", "resources", "html", "headers", "dynamic"],
  "url": "https://mycms.example.com"
}
```

| Feld         | Typ                      | Pflicht          | Beschreibung                                                                                   |
| ------------ | ------------------------ | ---------------- | ---------------------------------------------------------------------------------------------- |
| `name`       | string                   | Ja               | Im Popup angezeigter Name                                                                      |
| `category`   | string                   |                  | Kategorie, Standard: `其他库`                                                                  |
| `kind`       | string                   |                  | Typbeschreibung, Standard: `自定义规则`                                                        |
| `confidence` | `"高"` / `"中"` / `"低"` |                  | Standard: `中`                                                                                 |
| `matchType`  | `"keyword"` / `"regex"`  |                  | Standard: `regex`                                                                              |
| `patterns`   | string[]                 | Eines von dreien | Mindestens eines von patterns / selectors / globals muss nicht leer sein                       |
| `selectors`  | string[]                 | Eines von dreien | CSS-Selektoren-Liste                                                                           |
| `globals`    | string[]                 | Eines von dreien | Liste globaler Variablennamen (`window.x.y` als `x.y` schreiben)                               |
| `matchIn`    | string[]                 |                  | Beliebige Kombination aus `url` / `resources` / `html` / `headers` / `dynamic`, Standard: alle |
| `url`        | string                   |                  | Muss `http(s)://` beginnen, kann leer sein                                                     |

## Schaltflächen

Oben rechts in der Titelleiste befinden sich zwei Schaltflächen:

- **Aus JSON importieren**: Parst den Inhalt des Eingabefelds und **ersetzt** bei bestandener Validierung die gesamte benutzerdefinierte Regellist (kein Zusammenführen)
- **Formatieren**: Parst und schreibt mit `JSON.stringify(rules, null, 2)` zurück, mit sauberer Einrückung

## Backslashes in Strings

In JSON müssen Backslashes doppelt maskiert werden. Um zum Beispiel `\.js` zu matchen:

```json
{
  "matchType": "regex",
  "patterns": ["\\.js$"]
}
```

Der JSON-Parser wandelt `\\` in ein einzelnes `\` um; die Erweiterung erhält `\.js$`, das nach `new RegExp()` als echtes „maskiertes Literal" gilt.

## Atomare Validierung

Beim Import wird das gesamte Array zuerst geparst. Wenn ein Regelfeld ungültig ist, wird der gesamte Import abgelehnt (atomisch) — es gibt keinen Zustand, in dem „die Hälfte importiert und die Hälfte abgelehnt" wurde. Die Fehlermeldung gibt an, bei welcher Regel und welchem Feld das Problem liegt.

## Verhältnis zum Formular

- Formular ändern → JSON-Eingabefeld wird automatisch synchronisiert
- JSON-Eingabefeld ändern → „Aus JSON importieren" klicken, um mit der internen Regelliste zu synchronisieren
- Ohne Import direkt auf „Einstellungen speichern" klicken → speichert den Stand nach der letzten Formular-/Import-Aktion

## Mengenlimit

`CUSTOM_RULE_LIMITS.rules` beträgt standardmäßig 100. Überschreitungen werden abgelehnt. Alle Grenzwerte in [`src/types/settings.ts`](https://github.com/setube/stackprism/blob/main/src/types/settings.ts):

| Feld                                            | Grenzwert      |
| ----------------------------------------------- | -------------- |
| Gesamtanzahl Regeln                             | 100            |
| name                                            | 80 Zeichen     |
| category                                        | 40 Zeichen     |
| kind                                            | 40 Zeichen     |
| Einzelnes pattern / selector / global           | 240 Zeichen    |
| Länge der arrays patterns / selectors / globals | je 80          |
| Länge von matchIn                               | 8              |
| url                                             | 240 Zeichen    |
| customCss                                       | 10.000 Zeichen |
