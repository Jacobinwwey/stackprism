# Panoramica dell'architettura

## Struttura delle directory

```text
stackprism/
├─ src/
│  ├─ manifest.config.ts        # definizione manifest MV3 per @crxjs/vite-plugin
│  ├─ background/                # service worker (ESM module worker)
│  │  ├─ index.ts                # registrazione listener eventi chrome
│  │  ├─ message-router.ts       # routing onMessage (8 tipi di messaggi)
│  │  ├─ tab-store.ts            # lettura/scrittura cache tab/popup
│  │  ├─ headers.ts              # raccolta intestazioni di risposta webRequest
│  │  ├─ detection.ts            # rilevamento attivo / scheduleActivePageDetection
│  │  ├─ popup-cache.ts          # costruzione dati raw / display per il popup
│  │  ├─ wordpress.ts            # recupero style.css tema WordPress
│  │  ├─ dynamic-snapshot.ts     # gestione debounce snapshot dinamici
│  │  ├─ tech-links.ts           # caricamento lazy tech-links.json
│  │  ├─ rule-loader.ts          # caricamento e fusione JSON delle regole
│  │  ├─ rule-matcher.ts         # cache di compilazione + pre-filtro indice hint
│  │  ├─ detector-settings.ts    # cache impostazioni / regole
│  │  ├─ content-injector.ts     # iniezione content script nelle schede già aperte all'avvio
│  │  └─ merge.ts                # fusione / dedup / regole suppress della lista tecnologie
│  ├─ content/
│  │  └─ content-observer.ts     # raccolta dinamica continua con MutationObserver
│  ├─ injected/                   # compilato come IIFE indipendente, iniettato nel MAIN world
│  │  ├─ page-detector.ts         # funzione principale di rilevamento (990 righe)
│  │  └─ page-source-search.ts    # ricerca nel sorgente della pagina nel popup
│  ├─ ui/
│  │  ├─ popup/                   # SPA popup
│  │  ├─ settings/                # SPA impostazioni
│  │  ├─ help/                    # SPA guida
│  │  ├─ components/Select.vue    # componente Select / Combobox personalizzato
│  │  └─ tokens.css               # variabili CSS globali + tema chiaro/scuro + stili scrollbar/checkbox
│  ├─ types/                      # tipi condivisi tra script
│  │  ├─ messages.ts              # discriminated union degli 8 messaggi
│  │  ├─ rules.ts                 # RuleConfig / TechnologyRecord / PageDetectionResult
│  │  ├─ settings.ts              # DetectorSettings + CUSTOM_RULE_LIMITS
│  │  └─ popup.ts                 # PopupResult / PopupRawResult
│  └─ utils/                      # helper condivisi in tre punti
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
│  ├─ rules/                      # file JSON delle regole
│  ├─ tech-links.json             # mappa nome tecnologia → link sito ufficiale (524 KB)
│  └─ injected/                   # due IIFE prodotti da build:injected
├─ build-scripts/
│  └─ build-injected.mjs          # compilazione separata degli script iniettati con esbuild
├─ vite.config.ts                 # build principale (CRXJS + Vue + TS) + plugin personalizzati
├─ vite.injected.config.ts        # build IIFE indipendente degli script iniettati
├─ docs/                          # questo sito di documentazione (VitePress)
└─ dist/                          # artefatti di build, caricabili in Chrome
```

## Modello di processo

Chrome Extensions usa quattro ambienti di esecuzione; StackPrism li usa tutti:

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. Service Worker (ESM module)                              │
│    src/background/*.ts                                       │
│    - ascolto intestazioni di risposta chrome.webRequest     │
│    - routing chrome.runtime.onMessage                       │
│    - cache risultati in chrome.storage.session              │
│    - caricamento rules/* e tech-links.json                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 2. Content Script (isolated world della pagina)             │
│    src/content/content-observer.ts                          │
│    - MutationObserver per raccolta continua variazioni DOM  │
│    - PerformanceObserver per raccolta caricamenti risorse   │
│    - throttle 800ms, poi sendMessage verso background       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 3. Injected Script (MAIN world della pagina)                │
│    dist/injected/page-detector.iife.js                      │
│    dist/injected/page-source-search.iife.js                 │
│    - iniettato su richiesta via chrome.scripting.executeScript({files}) │
│    - può leggere window.* / DOM reale / globalKeys          │
│    - restituisce il risultato dopo l'esecuzione, non persiste |
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 4. Extension UI (popup / settings / help)                   │
│    src/ui/{popup,settings,help}/*.vue                       │
│    - Vue 3 + TS SPA                                         │
│    - comunicazione con background via chrome.runtime.sendMessage │
│    - lettura/scrittura configurazione utente via chrome.storage.sync │
└─────────────────────────────────────────────────────────────┘
```

## Messaggi tra script

Gli 8 tipi di messaggi sono definiti come discriminated union in `src/types/messages.ts`; tutte le chiamate usano il wrapper `sendMessage<M>()` in `src/utils/messaging.ts`.

| Messaggio                     | Direzione     | Scopo                                            |
| ----------------------------- | ------------- | ------------------------------------------------ |
| `GET_HEADER_DATA`             | popup → bg    | recupera record delle intestazioni di risposta   |
| `GET_POPUP_RESULT`            | popup → bg    | recupera cache leggera (visualizzazione popup)   |
| `GET_POPUP_RAW_RESULT`        | popup → bg    | recupera raw completo (indizi grezzi / feedback) |
| `GET_TECH_LINK`               | popup → bg    | fallback query link ufficiale di una tecnologia  |
| `START_BACKGROUND_DETECTION`  | popup → bg    | avvia rilevamento attivo dal pulsante "Aggiorna" |
| `GET_WORDPRESS_THEME_DETAILS` | bg interno    | recupera header style.css del tema               |
| `DYNAMIC_PAGE_SNAPSHOT`       | content → bg  | content script invia snapshot dinamici           |
| `PAGE_DETECTION_RESULT`       | injected → bg | page-detector restituisce il risultato           |

## Il problema del doppio binario degli script iniettati

`page-detector.ts` nell'implementazione originale veniva sia importato da background con `importScripts`, sia serializzato tramite `executeScript({world:'MAIN', func})`. Dopo il passaggio a ESM, `Function.prototype.toString` non può gestire gli import, quindi questo approccio non funziona più.

Soluzione: usare `executeScript({files})` invece di `{func}`. `page-detector.ts` viene compilato separatamente come file IIFE singolo (`vite.injected.config.ts`) e iniettato con due RPC:

```ts
// 1. scrittura variabile globale temporanea
chrome.scripting.executeScript({
  target: { tabId },
  world: 'MAIN',
  func: rules => {
    window.__SP_RULES__ = rules
  },
  args: [pageRules]
})

// 2. iniezione IIFE; l'IIFE legge __SP_RULES__ internamente, lo cancella, restituisce il risultato
chrome.scripting.executeScript({
  target: { tabId },
  world: 'MAIN',
  files: ['injected/page-detector.iife.js']
})
```

Con questo approccio, background non dipende più direttamente da page-detector e il service worker può usare ESM module worker.

## Risorse statiche

`public/rules/` e `public/tech-links.json` vengono copiati 1:1 in `dist/` da Vite e caricati a runtime tramite `chrome.runtime.getURL` + `fetch`. Non usare `import rules from '...'` per importare direttamente questi JSON di grandi dimensioni — Rollup li inlinerebbe nel bundle e rallenterebbe notevolmente il cold start del service worker.

In fase di build due vite plugin processano questi JSON:

1. `precompileRulesPlugin`: scansiona ricorsivamente ogni JSON di regole, inietta in ogni leaf rule `__hints` (letterali necessari della regex), `__legacyHints` (soglia di pre-filtro della versione precedente) e `__keywordCombined` (regex combinata per regole di tipo keyword)
2. `minifyJsonAssets`: riscrive tutti i JSON con `JSON.stringify(parsed)` per rimuovere indentazione e spazi

## Gestione dello stato

Nessun Pinia. Motivo:

- stato popup: 6 campi
- stato settings: 2 campi
- popup / settings sono due pagine estensione indipendenti (contesti chrome.runtime separati) — Pinia richiederebbe una seconda istanziazione
- `DetectorSettings` condiviso usa `chrome.storage.sync` come sorgente di verità + copia locale `reactive()`

## Tema (chiaro/scuro)

`src/utils/theme.ts` gestisce `getStoredTheme / setStoredTheme / cycleTheme / themeLabel`, salvati in `chrome.storage.sync.stackPrismTheme`, tre stati: `auto` / `light` / `dark`.

`src/ui/tokens.css` usa `:root[data-theme='dark']` per forzare il tema scuro, `@media (prefers-color-scheme: dark) :root:not([data-theme='light'])` per seguire il sistema, e `color-scheme` per sincronizzare l'interfaccia predefinita del browser.

Il cambio tema è disponibile nei pulsanti in cima al popup e alle impostazioni, sincronizzato tra le pagine tramite `chrome.storage.onChanged`.
