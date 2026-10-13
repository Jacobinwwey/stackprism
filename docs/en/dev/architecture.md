# Architecture Overview

## Directory Structure

```text
stackprism/
├─ src/
│  ├─ manifest.config.ts        # MV3 manifest definition for @crxjs/vite-plugin
│  ├─ background/                # service worker (ESM module worker)
│  │  ├─ index.ts                # registers Chrome event listeners
│  │  ├─ message-router.ts       # onMessage router (8 message types)
│  │  ├─ tab-store.ts            # tab/popup cache read/write
│  │  ├─ headers.ts              # webRequest response header collection
│  │  ├─ detection.ts            # active detection / scheduleActivePageDetection
│  │  ├─ popup-cache.ts          # popup raw / display data construction
│  │  ├─ wordpress.ts            # WordPress theme style.css fetching
│  │  ├─ dynamic-snapshot.ts     # dynamic snapshot debounce handling
│  │  ├─ tech-links.ts           # tech-links.json lazy loading
│  │  ├─ rule-loader.ts          # rule JSON loading and merging
│  │  ├─ rule-matcher.ts         # compiled cache + hint index pre-filtering
│  │  ├─ detector-settings.ts    # settings / rule cache
│  │  ├─ content-injector.ts     # injects content script into already-open tabs on startup
│  │  └─ merge.ts                # tech list merge / dedup / suppress rules
│  ├─ content/
│  │  └─ content-observer.ts     # MutationObserver continuous dynamic collection
│  ├─ injected/                   # compiled as standalone IIFEs, injected into page MAIN world
│  │  ├─ page-detector.ts         # 990-line main detection function
│  │  └─ page-source-search.ts    # popup source code search
│  ├─ ui/
│  │  ├─ popup/                   # popup SPA
│  │  ├─ settings/                # settings page SPA
│  │  ├─ help/                    # help page SPA
│  │  ├─ components/Select.vue    # custom Select / Combobox component
│  │  └─ tokens.css               # global CSS variables + light/dark themes + scrollbar/checkbox styles
│  ├─ types/                      # shared types across scripts
│  │  ├─ messages.ts              # 8 message discriminated union
│  │  ├─ rules.ts                 # RuleConfig / TechnologyRecord / PageDetectionResult
│  │  ├─ settings.ts              # DetectorSettings + CUSTOM_RULE_LIMITS
│  │  └─ popup.ts                 # PopupResult / PopupRawResult
│  └─ utils/                      # shared helpers
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
│  ├─ icons/                      # 16/32/48/128 PNG icons
│  ├─ rules/                      # rule JSON files
│  ├─ tech-links.json             # 524 KB tech name → website URL mapping
│  └─ injected/                   # two IIFEs output by build:injected
├─ build-scripts/
│  └─ build-injected.mjs          # standalone esbuild compilation of injected scripts
├─ vite.config.ts                 # main build (CRXJS + Vue + TS) + custom plugins
├─ vite.injected.config.ts        # injected script standalone IIFE build
├─ docs/                          # this documentation site (VitePress)
└─ dist/                          # build output, loadable in Chrome
```

## Process Model

Chrome extensions have four execution environments; StackPrism uses all of them:

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. Service Worker (ESM module)                              │
│    src/background/*.ts                                       │
│    - listens to chrome.webRequest for response headers       │
│    - routes chrome.runtime.onMessage                         │
│    - caches detection results in chrome.storage.session      │
│    - loads rules/* and tech-links.json                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 2. Content Script (page isolated world)                      │
│    src/content/content-observer.ts                           │
│    - MutationObserver continuously collects DOM changes      │
│    - PerformanceObserver collects resource loads             │
│    - throttles 800ms and sends back via sendMessage          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 3. Injected Script (page MAIN world)                         │
│    dist/injected/page-detector.iife.js                       │
│    dist/injected/page-source-search.iife.js                  │
│    - injected on demand via chrome.scripting.executeScript   │
│    - can read window.* / real DOM / globalKeys               │
│    - returns results and does not persist                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 4. Extension UI (popup / settings / help)                    │
│    src/ui/{popup,settings,help}/*.vue                        │
│    - Vue 3 + TS SPA                                          │
│    - communicates with background via chrome.runtime.sendMessage │
│    - reads/writes user config via chrome.storage.sync        │
└─────────────────────────────────────────────────────────────┘
```

## Cross-script Messages

All 8 message types are defined as a discriminated union in `src/types/messages.ts`, and all calls go through the `sendMessage<M>()` wrapper in `src/utils/messaging.ts`.

| Message                       | Direction     | Purpose                                          |
| ----------------------------- | ------------- | ------------------------------------------------ |
| `GET_HEADER_DATA`             | popup → bg    | fetch response header records                    |
| `GET_POPUP_RESULT`            | popup → bg    | fetch lightweight cache (popup main display)     |
| `GET_POPUP_RAW_RESULT`        | popup → bg    | fetch full raw data (raw clues / correction)     |
| `GET_TECH_LINK`               | popup → bg    | fallback lookup for a tech's website URL         |
| `START_BACKGROUND_DETECTION`  | popup → bg    | triggered by the Refresh button                  |
| `GET_WORDPRESS_THEME_DETAILS` | bg internal   | fetch theme style.css header                     |
| `DYNAMIC_PAGE_SNAPSHOT`       | content → bg  | content script continuously reports snapshots    |
| `PAGE_DETECTION_RESULT`       | injected → bg | page-detector returns its result after injection |

## The Injected Script Dual-track Problem

`page-detector.ts` originally needed to be both `importScripts`-ed by the background and serialized for injection via `executeScript({world:'MAIN', func})`. After switching to ESM, `Function.prototype.toString` can't handle imports, so that path doesn't work.

Solution: use `executeScript({files})` instead of `{func}`. `page-detector.ts` is compiled independently as a single IIFE file (`vite.injected.config.ts`) and injected via a two-step RPC:

```ts
// 1. write rules into a temporary global
chrome.scripting.executeScript({
  target: { tabId },
  world: 'MAIN',
  func: rules => {
    window.__SP_RULES__ = rules
  },
  args: [pageRules]
})

// 2. inject the IIFE; it reads __SP_RULES__ internally, then clears it and returns results
chrome.scripting.executeScript({
  target: { tabId },
  world: 'MAIN',
  files: ['injected/page-detector.iife.js']
})
```

This decouples the background from page-detector and allows the service worker to be an ESM module worker.

## Static Assets

`public/rules/` and `public/tech-links.json` are copied 1:1 by Vite into `dist/` and loaded at runtime via `chrome.runtime.getURL` + `fetch`. Do not `import rules from '...'` directly — that causes Rollup to inline the rule JSON into the bundle, which significantly increases service worker cold-start time.

Two Vite plugins process these JSON files at build time:

1. `precompileRulesPlugin`: walks every rule JSON recursively and injects `__hints` (required literals from the regex), `__legacyHints` (legacy pre-filter thresholds, only written for rules that need them), and `__keywordCombined` (merged regex source for keyword-type rules) into each leaf rule
2. `minifyJsonAssets`: rewrites all JSON with `JSON.stringify(parsed)` to strip indentation and whitespace

## State Management

Pinia is not used. Reasons:

- Popup state has 6 fields
- Settings state has 2 fields
- Popup and settings are two separate extension pages with separate `chrome.runtime` contexts — Pinia would need double instantiation
- Shared `DetectorSettings` uses `chrome.storage.sync` as the source of truth plus a local `reactive()` copy

## Theming (Light/Dark)

`src/utils/theme.ts` manages `getStoredTheme / setStoredTheme / cycleTheme / themeLabel`, stored in `chrome.storage.sync.stackPrismTheme`, three states: `auto` / `light` / `dark`.

`src/ui/tokens.css` uses `:root[data-theme='dark']` for forced dark, `@media (prefers-color-scheme: dark) :root:not([data-theme='light'])` to follow the system, and `color-scheme` to sync the browser's default UI.

Theme toggling is available in both the popup and settings toolbar via `chrome.storage.onChanged` for cross-page sync.
