# Architekturübersicht

## Verzeichnisstruktur

```text
stackprism/
├─ src/
│  ├─ manifest.config.ts        # MV3-Manifest-Definition für @crxjs/vite-plugin
│  ├─ background/                # Service Worker (ESM module worker)
│  │  ├─ index.ts                # Chrome-Event-Listener registrieren
│  │  ├─ message-router.ts       # onMessage-Routing (8 Nachrichtentypen)
│  │  ├─ tab-store.ts            # Tab/Popup-Cache lesen und schreiben
│  │  ├─ headers.ts              # webRequest-Antwortheader erfassen
│  │  ├─ detection.ts            # Aktive Erkennung / scheduleActivePageDetection
│  │  ├─ popup-cache.ts          # Popup raw/display-Daten aufbauen
│  │  ├─ wordpress.ts            # WordPress-Theme-style.css abrufen
│  │  ├─ dynamic-snapshot.ts     # Dynamische Snapshots mit Debounce verarbeiten
│  │  ├─ tech-links.ts           # tech-links.json lazy laden
│  │  ├─ rule-loader.ts          # Regel-JSON laden und zusammenführen
│  │  ├─ rule-matcher.ts         # Compile-Cache + Hint-Index-Vorfilterung
│  │  ├─ detector-settings.ts    # Einstellungen / Regel-Cache
│  │  ├─ content-injector.ts     # Beim Start Content Scripts in geöffnete Tabs injizieren
│  │  └─ merge.ts                # Technologieliste zusammenführen / deduplizieren / unterdrücken
│  ├─ content/
│  │  └─ content-observer.ts     # MutationObserver für kontinuierliche dynamische Erfassung
│  ├─ injected/                   # Wird als eigenständige IIFE kompiliert und in die MAIN world der Seite injiziert
│  │  ├─ page-detector.ts         # Haupt-Erkennungsfunktion (990 Zeilen)
│  │  └─ page-source-search.ts    # Quellcode-Suche für das Popup
│  ├─ ui/
│  │  ├─ popup/                   # Popup-SPA
│  │  ├─ settings/                # Einstellungsseite-SPA
│  │  ├─ help/                    # Hilfeseite-SPA
│  │  ├─ components/Select.vue    # Benutzerdefinierte Select/Combobox-Komponente
│  │  └─ tokens.css               # Globale CSS-Variablen + Hell-/Dunkelthema + Scrollbar/Checkbox-Stile
│  ├─ types/                      # Skriptübergreifend genutzte Typen
│  │  ├─ messages.ts              # 8 Nachrichtentypen als Discriminated Union
│  │  ├─ rules.ts                 # RuleConfig / TechnologyRecord / PageDetectionResult
│  │  ├─ settings.ts              # DetectorSettings + CUSTOM_RULE_LIMITS
│  │  └─ popup.ts                 # PopupResult / PopupRawResult
│  └─ utils/                      # Gemeinsam genutzte Hilfsfunktionen
│     ├─ normalize-settings.ts
│     ├─ category-order.ts
│     ├─ apply-custom-css.ts
│     ├─ build-issue-url.ts
│     ├─ tech-name.ts
│     ├─ url.ts
│     ├─ messaging.ts
│     ├─ theme.ts
│     └─ constants.ts
├─ public/
│  ├─ icons/                      # 16/32/48/128 PNG
│  ├─ rules/                      # Regel-JSON-Dateien
│  ├─ tech-links.json             # 524 KB große Zuordnung von Technologiename → offizielle Website
│  └─ injected/                   # Zwei IIFE-Dateien, ausgegeben von build:injected
├─ build-scripts/
│  └─ build-injected.mjs          # Injektionsskripte mit esbuild separat kompilieren
├─ vite.config.ts                 # Haupt-Build (CRXJS + Vue + TS) + benutzerdefinierte Plugins
├─ vite.injected.config.ts        # Eigenständiger IIFE-Build für Injektionsskripte
├─ docs/                          # Diese Dokumentationsseite (VitePress)
└─ dist/                          # Build-Ergebnis, in Chrome ladbar
```

## Prozessmodell

Chrome-Erweiterungen haben vier Ausführungsumgebungen, von denen StackPrism alle verwendet:

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. Service Worker (ESM module)                              │
│    src/background/*.ts                                       │
│    - chrome.webRequest zum Erfassen von Antwortheadern      │
│    - chrome.runtime.onMessage-Routing                       │
│    - chrome.storage.session zum Cachen von Erkennungsdaten  │
│    - Lädt rules/* und tech-links.json                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 2. Content Script (isolierte Seiten-World)                  │
│    src/content/content-observer.ts                          │
│    - MutationObserver erfasst kontinuierlich DOM-Änderungen │
│    - PerformanceObserver erfasst Ressourcenladungen         │
│    - Sendet nach 800ms-Throttle via sendMessage an Background│
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 3. Injected Script (Seiten-MAIN-World)                      │
│    dist/injected/page-detector.iife.js                      │
│    dist/injected/page-source-search.iife.js                 │
│    - Bei Bedarf per chrome.scripting.executeScript({files}) │
│    - Kann window.* / echtes DOM / globalKeys lesen          │
│    - Gibt Ergebnis zurück, verbleibt nicht dauerhaft        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 4. Extension UI (popup / settings / help)                   │
│    src/ui/{popup,settings,help}/*.vue                       │
│    - Vue 3 + TS SPA                                         │
│    - Kommuniziert per chrome.runtime.sendMessage mit bg     │
│    - Liest/schreibt Nutzerkonfiguration via chrome.storage.sync │
└─────────────────────────────────────────────────────────────┘
```

## Skriptübergreifende Nachrichten

Alle 8 Nachrichtentypen sind in `src/types/messages.ts` als Discriminated Union typisiert; alle Aufrufe verwenden den `sendMessage<M>()`-Wrapper in `src/utils/messaging.ts`.

| Nachricht                     | Richtung      | Zweck                                                          |
| ----------------------------- | ------------- | -------------------------------------------------------------- |
| `GET_HEADER_DATA`             | popup → bg    | Antwortheader-Einträge abrufen                                 |
| `GET_POPUP_RESULT`            | popup → bg    | Kompakten Cache abrufen (Haupt-Popup-Anzeige)                  |
| `GET_POPUP_RAW_RESULT`        | popup → bg    | Vollständige Rohdaten abrufen (Rohdaten / Fehlerkorrektur)     |
| `GET_TECH_LINK`               | popup → bg    | Offizielle Website einer Technologie als Fallback nachschlagen |
| `START_BACKGROUND_DETECTION`  | popup → bg    | Aktive Erkennung durch „Aktualisieren"-Schaltfläche auslösen   |
| `GET_WORDPRESS_THEME_DETAILS` | bg intern     | Theme-style.css-Header abrufen                                 |
| `DYNAMIC_PAGE_SNAPSHOT`       | content → bg  | Content Script meldet kontinuierlich dynamische Snapshots      |
| `PAGE_DETECTION_RESULT`       | injected → bg | page-detector gibt nach der Injektion Ergebnis zurück          |

## Das Dual-Track-Problem bei injizierten Skripten

`page-detector.ts` wurde ursprünglich sowohl von background per `importScripts` eingebunden als auch per `executeScript({world:'MAIN', func})` injiziert. Nach der Umstellung auf ESM lässt sich `Function.prototype.toString` nicht mehr mit Imports verwenden, weshalb dieser Weg nicht mehr funktioniert.

Lösung: `executeScript({files})` statt `{func}`. `page-detector.ts` wird als eigenständige IIFE-Datei kompiliert (`vite.injected.config.ts`) und per zwei RPC-Aufrufen injiziert:

```ts
// 1. Temporäre globale Variable schreiben
chrome.scripting.executeScript({
  target: { tabId },
  world: 'MAIN',
  func: rules => {
    window.__SP_RULES__ = rules
  },
  args: [pageRules]
})

// 2. IIFE injizieren; IIFE liest __SP_RULES__, löscht es und gibt das Ergebnis zurück
chrome.scripting.executeScript({
  target: { tabId },
  world: 'MAIN',
  files: ['injected/page-detector.iife.js']
})
```

Dadurch hat background keine direkte Abhängigkeit mehr von page-detector, und der Service Worker kann als ESM-Module-Worker betrieben werden.

## Statische Assets

`public/rules/` und `public/tech-links.json` werden von Vite 1:1 nach `dist/` kopiert und zur Laufzeit per `chrome.runtime.getURL` + `fetch` geladen. Diese großen JSON-Dateien dürfen nicht per `import rules from '...'` direkt importiert werden — das würde Rollup veranlassen, die Regeln in das Bundle einzubetten, was den Kaltstart des Service Workers deutlich verlangsamen würde.

Beim Build verarbeiten zwei Vite-Plugins diese JSON-Dateien:

1. `precompileRulesPlugin`: Iteriert rekursiv über jede Regel-JSON-Datei und injiziert in jede Leaf Rule `__hints` (erforderliche Literale für Regex), `__legacyHints` (ältere Vorfilter-Schwellenwerte, nur bei Bedarf) und `__keywordCombined` (zusammengesetzter Regex-Quelltext für Keyword-Regeln)
2. `minifyJsonAssets`: Schreibt alle JSON-Dateien mit `JSON.stringify(parsed)` neu, um Einrückungen und Leerzeichen zu entfernen

## State-Management

Kein Pinia. Begründung:

- Popup-State hat 6 Felder
- Einstellungsseiten-State hat 2 Felder
- Popup und Einstellungen sind zwei unabhängige Erweiterungsseiten (getrennte chrome.runtime-Kontexte); Pinia müsste doppelt instanziiert werden
- Das gemeinsam genutzte `DetectorSettings` verwendet `chrome.storage.sync` als Single Source of Truth plus ein lokales `reactive()`-Duplikat

## Theme (Hell/Dunkel)

`src/utils/theme.ts` verwaltet `getStoredTheme / setStoredTheme / cycleTheme / themeLabel`, gespeichert unter `chrome.storage.sync.stackPrismTheme`, drei Zustände: `auto` / `light` / `dark`.

`src/ui/tokens.css` erzwingt den Dunkel-Modus per `:root[data-theme='dark']`, folgt dem System per `@media (prefers-color-scheme: dark) :root:not([data-theme='light'])` und synchronisiert `color-scheme` mit der Standard-Browser-UI.

Theme-Umschalter befinden sich oben in Popup und Einstellungen; die Synchronisierung zwischen Seiten erfolgt über `chrome.storage.onChanged`.
