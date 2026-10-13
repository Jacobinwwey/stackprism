# Przegląd architektury

## Struktura katalogów

```text
stackprism/
├─ src/
│  ├─ manifest.config.ts        # definicja manifestu MV3 dla @crxjs/vite-plugin
│  ├─ background/                # service worker (ESM module worker)
│  │  ├─ index.ts                # rejestracja nasłuchiwaczy zdarzeń chrome
│  │  ├─ message-router.ts       # routing onMessage (8 typów wiadomości)
│  │  ├─ tab-store.ts            # odczyt i zapis cache tab/popup
│  │  ├─ headers.ts              # zbieranie nagłówków odpowiedzi przez webRequest
│  │  ├─ detection.ts            # aktywna detekcja / scheduleActivePageDetection
│  │  ├─ popup-cache.ts          # budowanie danych raw / display dla okna podręcznego
│  │  ├─ wordpress.ts            # pobieranie nagłówka style.css motywu WordPress
│  │  ├─ dynamic-snapshot.ts     # debounce dynamicznych snapshotów
│  │  ├─ tech-links.ts           # leniwe ładowanie tech-links.json
│  │  ├─ rule-loader.ts          # ładowanie i scalanie reguł JSON
│  │  ├─ rule-matcher.ts         # cache kompilacji + wstępne filtrowanie indeksem hints
│  │  ├─ detector-settings.ts    # cache ustawień / reguł
│  │  ├─ content-injector.ts     # wstrzykiwanie content script do już otwartych kart
│  │  └─ merge.ts                # scalanie / deduplikacja listy technologii / reguły suppress
│  ├─ content/
│  │  └─ content-observer.ts     # ciągłe dynamiczne zbieranie danych przez MutationObserver
│  ├─ injected/                   # kompilowane do samodzielnych IIFE, wstrzykiwane w MAIN world strony
│  │  ├─ page-detector.ts         # główna funkcja detekcji (990 linii)
│  │  └─ page-source-search.ts    # wyszukiwanie w kodzie źródłowym dla okna podręcznego
│  ├─ ui/
│  │  ├─ popup/                   # SPA okna podręcznego
│  │  ├─ settings/                # SPA strony ustawień
│  │  ├─ help/                    # SPA strony pomocy
│  │  ├─ components/Select.vue    # niestandardowy komponent Select / Combobox
│  │  └─ tokens.css               # globalne zmienne CSS + motywy jasny/ciemny + style scrollbar/checkbox
│  ├─ types/                      # typy współdzielone między skryptami
│  │  ├─ messages.ts              # discriminated union dla 8 typów wiadomości
│  │  ├─ rules.ts                 # RuleConfig / TechnologyRecord / PageDetectionResult
│  │  ├─ settings.ts              # DetectorSettings + CUSTOM_RULE_LIMITS
│  │  └─ popup.ts                 # PopupResult / PopupRawResult
│  └─ utils/                      # współdzielone helpery
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
│  ├─ icons/                      # PNG 16/32/48/128
│  ├─ rules/                      # pliki JSON reguł
│  ├─ tech-links.json             # mapa nazwa technologii → link do oficjalnej strony (524 KB)
│  └─ injected/                   # dwa pliki IIFE z build:injected
├─ build-scripts/
│  └─ build-injected.mjs          # osobna kompilacja skryptów wstrzykiwanych przez esbuild
├─ vite.config.ts                 # główny build (CRXJS + Vue + TS) + niestandardowe pluginy
├─ vite.injected.config.ts        # osobny build IIFE dla skryptów wstrzykiwanych
├─ docs/                          # ta dokumentacja (VitePress)
└─ dist/                          # artefakty buildu, ładowane do Chrome
```

## Model procesów

Rozszerzenie Chrome korzysta z czterech środowisk wykonawczych; StackPrism używa wszystkich czterech:

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. Service Worker (ESM module)                              │
│    src/background/*.ts                                       │
│    - nasłuchiwanie nagłówków odpowiedzi przez chrome.webRequest │
│    - routing chrome.runtime.onMessage                        │
│    - cache wyników detekcji w chrome.storage.session         │
│    - ładowanie rules/* i tech-links.json                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 2. Content Script (izolowany świat strony)                   │
│    src/content/content-observer.ts                           │
│    - ciągłe zbieranie zmian DOM przez MutationObserver       │
│    - zbieranie załadowanych zasobów przez PerformanceObserver│
│    - wysyłanie do background przez sendMessage po 800ms throttle │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 3. Injected Script (MAIN world strony)                       │
│    dist/injected/page-detector.iife.js                       │
│    dist/injected/page-source-search.iife.js                  │
│    - wstrzykiwany przez chrome.scripting.executeScript({files}) │
│    - ma dostęp do window.* / prawdziwego DOM / globalKeys    │
│    - zwraca wyniki po zakończeniu, nie działa w tle           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 4. Extension UI (popup / settings / help)                    │
│    src/ui/{popup,settings,help}/*.vue                        │
│    - Vue 3 + TS SPA                                          │
│    - komunikacja z background przez chrome.runtime.sendMessage │
│    - odczyt i zapis konfiguracji przez chrome.storage.sync   │
└─────────────────────────────────────────────────────────────┘
```

## Wiadomości między skryptami

Wszystkie 8 typów wiadomości jest zdefiniowanych jako discriminated union w `src/types/messages.ts`. Każde wywołanie przechodzi przez wrapper `sendMessage<M>()` z `src/utils/messaging.ts`.

| Wiadomość                     | Kierunek      | Zastosowanie                                         |
| ----------------------------- | ------------- | ---------------------------------------------------- |
| `GET_HEADER_DATA`             | popup → bg    | pobieranie zapisów nagłówków odpowiedzi              |
| `GET_POPUP_RESULT`            | popup → bg    | pobieranie lekkiego cache (główny widok okna)        |
| `GET_POPUP_RAW_RESULT`        | popup → bg    | pobieranie pełnego raw (surowe wskazówki / feedback) |
| `GET_TECH_LINK`               | popup → bg    | awaryjne wyszukiwanie linku do oficjalnej strony     |
| `START_BACKGROUND_DETECTION`  | popup → bg    | aktywna detekcja wywołana przyciskiem „Odśwież"      |
| `GET_WORDPRESS_THEME_DETAILS` | bg internal   | pobieranie nagłówka style.css motywu                 |
| `DYNAMIC_PAGE_SNAPSHOT`       | content → bg  | ciągłe raportowanie dynamicznych snapshotów          |
| `PAGE_DETECTION_RESULT`       | injected → bg | wynik zwrócony po wstrzyknięciu page-detector        |

## Problem dwóch ścieżek dla skryptów wstrzykiwanych

`page-detector.ts` w pierwotnej implementacji był zarówno importowany przez background przez `importScripts`, jak i serializowany do wstrzyknięcia przez `executeScript({world:'MAIN', func})`. Po migracji na ESM `Function.prototype.toString` nie potrafi obsłużyć importów, więc ta ścieżka przestała działać.

Rozwiązanie: użycie `executeScript({files})` zamiast `{func}`. `page-detector.ts` jest kompilowany niezależnie do pojedynczego pliku IIFE (`vite.injected.config.ts`) i wstrzykiwany przez dwa wywołania RPC:

```ts
// 1. zapisanie reguł do tymczasowej zmiennej globalnej
chrome.scripting.executeScript({
  target: { tabId },
  world: 'MAIN',
  func: rules => {
    window.__SP_RULES__ = rules
  },
  args: [pageRules]
})

// 2. wstrzyknięcie IIFE; IIFE wewnętrznie odczytuje __SP_RULES__, czyści je i zwraca wynik
chrome.scripting.executeScript({
  target: { tabId },
  world: 'MAIN',
  files: ['injected/page-detector.iife.js']
})
```

Dzięki temu background nie zależy już bezpośrednio od page-detector, a service worker może działać jako ESM module worker.

## Zasoby statyczne

`public/rules/` i `public/tech-links.json` są kopiowane przez Vite 1:1 do `dist/` i ładowane w czasie działania przez `chrome.runtime.getURL` + `fetch`. Nie używaj `import rules from '...'` do bezpośredniego importowania tych dużych plików JSON — to spowodowałoby ich wbudowanie w bundle przez Rollup i znacznie spowolniłoby zimny start service workera.

Podczas budowania dwa pluginy Vite przetwarzają te pliki JSON:

1. `precompileRulesPlugin`: rekurencyjnie przechodzi przez każdy plik JSON reguł i dla każdej reguły liścia wstrzykuje `__hints` (wymagane literały z wyrażeń regularnych), `__legacyHints` (stary próg wstępnego filtrowania) i `__keywordCombined` (połączone źródło wyrażenia regularnego dla reguł keyword)
2. `minifyJsonAssets`: przepisuje wszystkie pliki JSON przez `JSON.stringify(parsed)`, usuwając wcięcia i białe znaki

## Zarządzanie stanem

Projekt nie używa Pinia. Powody:

- stan popup: 6 pól
- stan settings: 2 pola
- popup i settings to dwa niezależne strony rozszerzenia (osobne konteksty chrome.runtime); Pinia wymagałaby dwukrotnej instancjacji
- współdzielone `DetectorSettings` są obsługiwane przez `chrome.storage.sync` jako źródło prawdy + lokalna kopia `reactive()`

## Motyw (jasny/ciemny)

`src/utils/theme.ts` zarządza `getStoredTheme / setStoredTheme / cycleTheme / themeLabel`, przechowując stan w `chrome.storage.sync.stackPrismTheme` jako jedną z trzech wartości: `auto` / `light` / `dark`.

`src/ui/tokens.css` używa `:root[data-theme='dark']` do wymuszonego trybu ciemnego, `@media (prefers-color-scheme: dark) :root:not([data-theme='light'])` do śledzenia systemu oraz `color-scheme` do synchronizacji domyślnego UI przeglądarki.

Przełącznik motywu znajduje się na górze okna podręcznego i strony ustawień; zmiany są synchronizowane między stronami przez `chrome.storage.onChanged`.
