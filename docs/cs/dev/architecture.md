# Přehled architektury

## Adresářová struktura

```text
stackprism/
├─ src/
│  ├─ manifest.config.ts        # definice MV3 manifestu pro @crxjs/vite-plugin
│  ├─ background/                # service worker (ESM module worker)
│  │  ├─ index.ts                # registrace posluchačů Chrome událostí
│  │  ├─ message-router.ts       # směrování onMessage (8 typů zpráv)
│  │  ├─ tab-store.ts            # čtení a zápis mezipaměti záložek/vyskakovacího okna
│  │  ├─ headers.ts              # sběr hlaviček odpovědí přes webRequest
│  │  ├─ detection.ts            # aktivní detekce / scheduleActivePageDetection
│  │  ├─ popup-cache.ts          # sestavení raw / display dat vyskakovacího okna
│  │  ├─ wordpress.ts            # načítání style.css témat WordPress
│  │  ├─ dynamic-snapshot.ts     # zpracování dynamických snímků s debounce
│  │  ├─ tech-links.ts           # líné načítání tech-links.json
│  │  ├─ rule-loader.ts          # načítání a slučování JSON pravidel
│  │  ├─ rule-matcher.ts         # kompilační mezipaměť + předfiltrování hint indexu
│  │  ├─ detector-settings.ts    # mezipaměť nastavení / pravidel
│  │  ├─ content-injector.ts     # vložení content scriptu do již otevřených záložek při spuštění
│  │  └─ merge.ts                # slučování / deduplikace / suppress pravidla seznamu technologií
│  ├─ content/
│  │  └─ content-observer.ts     # průběžný dynamický sběr pomocí MutationObserver
│  ├─ injected/                   # kompilováno jako samostatný IIFE, vkládáno do MAIN world stránky
│  │  ├─ page-detector.ts         # hlavní detekční funkce (990 řádků)
│  │  └─ page-source-search.ts    # vyhledávání zdrojového kódu ve vyskakovacím okně
│  ├─ ui/
│  │  ├─ popup/                   # SPA vyskakovacího okna
│  │  ├─ settings/                # SPA stránky nastavení
│  │  ├─ help/                    # SPA stránky nápovědy
│  │  ├─ components/Select.vue    # vlastní komponenta Select / Combobox
│  │  └─ tokens.css               # globální CSS proměnné + světlé/tmavé téma + styly scrollbaru/zaškrtávacího pole
│  ├─ types/                      # typy sdílené napříč skripty
│  │  ├─ messages.ts              # discriminated union 8 typů zpráv
│  │  ├─ rules.ts                 # RuleConfig / TechnologyRecord / PageDetectionResult
│  │  ├─ settings.ts              # DetectorSettings + CUSTOM_RULE_LIMITS
│  │  └─ popup.ts                 # PopupResult / PopupRawResult
│  └─ utils/                      # sdílené helpery na třech místech
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
│  ├─ rules/                      # JSON soubory pravidel
│  ├─ tech-links.json             # mapování název technologie → odkaz na oficiální web (524 KB)
│  └─ injected/                   # dva IIFE soubory výstupu z build:injected
├─ build-scripts/
│  └─ build-injected.mjs          # samostatná kompilace vložených skriptů pomocí esbuild
├─ vite.config.ts                 # hlavní sestavení (CRXJS + Vue + TS) + vlastní plugin
├─ vite.injected.config.ts        # samostatné sestavení IIFE pro vložené skripty
├─ docs/                          # tento web s dokumentací (VitePress)
└─ dist/                          # výstup sestavení, načítáno do Chrome
```

## Model procesů

Chrome rozšíření má čtyři spouštěcí prostředí — StackPrism využívá všechna:

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. Service Worker (ESM module)                              │
│    src/background/*.ts                                       │
│    - chrome.webRequest sledování hlaviček odpovědí          │
│    - chrome.runtime.onMessage směrování                     │
│    - chrome.storage.session mezipaměť výsledků detekce     │
│    - načítání rules/* a tech-links.json                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 2. Content Script (izolovaný svět stránky)                  │
│    src/content/content-observer.ts                           │
│    - MutationObserver průběžně sbírá změny DOM              │
│    - PerformanceObserver sbírá načítání zdrojů              │
│    - po 800ms throttle odesílá sendMessage zpět do background │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 3. Injected Script (MAIN world stránky)                     │
│    dist/injected/page-detector.iife.js                       │
│    dist/injected/page-source-search.iife.js                  │
│    - vkládáno na vyžádání přes chrome.scripting.executeScript({files}) │
│    - má přístup k window.* / skutečnému DOM / globalKeys    │
│    - po dokončení vrátí výsledek, netrvá natrvalo           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 4. Extension UI (popup / settings / help)                   │
│    src/ui/{popup,settings,help}/*.vue                        │
│    - Vue 3 + TS SPA                                         │
│    - komunikuje s background přes chrome.runtime.sendMessage │
│    - čte/zapisuje uživatelskou konfiguraci přes chrome.storage.sync │
└─────────────────────────────────────────────────────────────┘
```

## Zprávy napříč skripty

Všech 8 typů zpráv je definováno jako discriminated union v `src/types/messages.ts`; všechna volání procházejí wrapperem `sendMessage<M>()` v `src/utils/messaging.ts`.

| Zpráva                        | Směr          | Účel                                        |
| ----------------------------- | ------------- | ------------------------------------------- |
| `GET_HEADER_DATA`             | popup → bg    | načtení záznamu hlaviček odpovědí           |
| `GET_POPUP_RESULT`            | popup → bg    | načtení odlehčené mezipaměti (hlavní zobrazení vyskakovacího okna) |
| `GET_POPUP_RAW_RESULT`        | popup → bg    | načtení kompletního raw (surové stopy / zpětná vazba pro opravu) |
| `GET_TECH_LINK`               | popup → bg    | záložní dotaz na odkaz na oficiální web technologie |
| `START_BACKGROUND_DETECTION`  | popup → bg    | aktivní detekce spuštěná tlačítkem „Obnovit" |
| `GET_WORDPRESS_THEME_DETAILS` | bg interní    | načtení hlavičky style.css tématu           |
| `DYNAMIC_PAGE_SNAPSHOT`       | content → bg  | průběžné hlášení dynamických snímků z content scriptu |
| `PAGE_DETECTION_RESULT`       | injected → bg | výsledek vrácený po vložení page-detector   |

## Problém dvou cest pro vložené skripty

`page-detector.ts` byl v původní implementaci jak importován pomocí `importScripts` v background, tak serializován a vkládán přes `executeScript({world:'MAIN', func})`. Po přechodu na ESM `Function.prototype.toString` neumí zpracovat importy, takže tato cesta nefunguje.

Řešení: místo `{func}` se používá `executeScript({files})`. `page-detector.ts` se samostatně kompiluje jako IIFE do jednoho souboru (`vite.injected.config.ts`) a vkládá se ve dvou RPC krocích:

```ts
// 1. zápis do dočasné globální proměnné
chrome.scripting.executeScript({
  target: { tabId },
  world: 'MAIN',
  func: rules => {
    window.__SP_RULES__ = rules
  },
  args: [pageRules]
})

// 2. vložení IIFE — IIFE uvnitř přečte __SP_RULES__, poté ji vymaže a vrátí výsledek
chrome.scripting.executeScript({
  target: { tabId },
  world: 'MAIN',
  files: ['injected/page-detector.iife.js']
})
```

Díky tomuto přístupu background přímo nezávisí na page-detector a service worker může používat ESM module worker.

## Statické zdroje

`public/rules/` a `public/tech-links.json` Vite kopíruje 1:1 do `dist/`; za běhu se načítají přes `chrome.runtime.getURL` + `fetch`. Nepoužívejte `import rules from '...'` pro přímý import těchto velkých JSON souborů — Rollup by pravidla vložil inline do bundlu a studený start service workeru by se výrazně zpomalil.

Při sestavení ještě dva vite pluginy zpracovávají tyto JSON soubory:

1. `precompileRulesPlugin`: rekurzivně prochází každý JSON pravidel a do každého listového pravidla vkládá `__hints` (nutné literály regulárního výrazu), `__legacyHints` (předfiltrovací práh starší verze, zapisuje se pouze tam, kde je potřeba) a `__keywordCombined` (sloučený zdroj regulárního výrazu pro pravidla typu keyword)
2. `minifyJsonAssets`: všechny JSON soubory přepíše pomocí `JSON.stringify(parsed)`, čímž odstraní odsazení a prázdné znaky

## Správa stavu

Pinia se nepoužívá. Důvody:

- stav vyskakovacího okna má 6 polí
- stav nastavení má 2 pole
- vyskakovací okno a nastavení jsou dvě samostatné stránky rozšíření (samostatné chrome.runtime kontexty) — Pinia by vyžadovala druhou instanci
- sdílené `DetectorSettings` postačuje `chrome.storage.sync` jako skutečný zdroj pravdy + lokální kopie jako `reactive()`

## Téma (světlé/tmavé)

`src/utils/theme.ts` spravuje `getStoredTheme / setStoredTheme / cycleTheme / themeLabel`; uloženo v `chrome.storage.sync.stackPrismTheme` se třemi stavy: `auto` / `light` / `dark`.

`src/ui/tokens.css` používá `:root[data-theme='dark']` pro vynucení tmavého motivu, `@media (prefers-color-scheme: dark) :root:not([data-theme='light'])` pro sledování systémového motivu a `color-scheme` pro synchronizaci výchozího uživatelského rozhraní prohlížeče.

Přepínač tématu je k dispozici v horní části vyskakovacího okna i stránky nastavení; synchronizace napříč stránkami probíhá přes `chrome.storage.onChanged`.
