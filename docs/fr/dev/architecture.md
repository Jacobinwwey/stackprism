# Architecture

## Structure des répertoires

```text
stackprism/
├─ src/
│  ├─ manifest.config.ts        # définition du manifest MV3 pour @crxjs/vite-plugin
│  ├─ background/                # service worker (ESM module worker)
│  │  ├─ index.ts                # enregistrement des écouteurs d'événements Chrome
│  │  ├─ message-router.ts       # routage onMessage (8 types de messages)
│  │  ├─ tab-store.ts            # lecture/écriture du cache tab/popup
│  │  ├─ headers.ts              # collecte des en-têtes de réponse via webRequest
│  │  ├─ detection.ts            # détection active / scheduleActivePageDetection
│  │  ├─ popup-cache.ts          # construction des données raw / display pour la popup
│  │  ├─ wordpress.ts            # récupération du style.css de thème WordPress
│  │  ├─ dynamic-snapshot.ts     # anti-rebond des instantanés dynamiques
│  │  ├─ tech-links.ts           # chargement paresseux de tech-links.json
│  │  ├─ rule-loader.ts          # chargement et fusion des JSON de règles
│  │  ├─ rule-matcher.ts         # cache de compilation + pré-filtrage par index de hints
│  │  ├─ detector-settings.ts    # cache des paramètres / règles
│  │  ├─ content-injector.ts     # injection du content script dans les onglets déjà ouverts au démarrage
│  │  └─ merge.ts                # fusion / déduplication / règles suppress de la liste de technologies
│  ├─ content/
│  │  └─ content-observer.ts     # collecte dynamique continue par MutationObserver
│  ├─ injected/                   # compilé en IIFE indépendant, injecté dans le monde MAIN de la page
│  │  ├─ page-detector.ts         # fonction principale de détection (~990 lignes)
│  │  └─ page-source-search.ts    # recherche dans le code source depuis la popup
│  ├─ ui/
│  │  ├─ popup/                   # SPA popup
│  │  ├─ settings/                # SPA page de paramètres
│  │  ├─ help/                    # SPA page d'aide
│  │  ├─ components/Select.vue    # composant Select / Combobox personnalisé
│  │  └─ tokens.css               # variables CSS globales + thèmes clair/sombre + styles scrollbar/checkbox
│  ├─ types/                      # types partagés entre les scripts
│  │  ├─ messages.ts              # 8 messages en discriminated union
│  │  ├─ rules.ts                 # RuleConfig / TechnologyRecord / PageDetectionResult
│  │  ├─ settings.ts              # DetectorSettings + CUSTOM_RULE_LIMITS
│  │  └─ popup.ts                 # PopupResult / PopupRawResult
│  └─ utils/                      # helpers partagés
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
│  ├─ rules/                      # fichiers JSON de règles
│  ├─ tech-links.json             # mapping nom de technologie → URL officielle (524 Ko)
│  └─ injected/                   # deux IIFE produits par build:injected
├─ build-scripts/
│  └─ build-injected.mjs          # compilation des scripts injectés avec esbuild
├─ vite.config.ts                 # build principal (CRXJS + Vue + TS) + plugins personnalisés
├─ vite.injected.config.ts        # build IIFE indépendant des scripts injectés
├─ docs/                          # ce site de documentation (VitePress)
└─ dist/                          # artefacts de build, à charger dans Chrome
```

## Modèle de processus

L'extension Chrome utilise quatre environnements d'exécution, tous exploités par StackPrism :

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. Service Worker (ESM module)                              │
│    src/background/*.ts                                       │
│    - écoute chrome.webRequest pour les en-têtes de réponse  │
│    - routage chrome.runtime.onMessage                        │
│    - cache des résultats dans chrome.storage.session         │
│    - chargement de rules/* et tech-links.json                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 2. Content Script (monde isolé de la page)                   │
│    src/content/content-observer.ts                           │
│    - MutationObserver pour les changements DOM en continu    │
│    - PerformanceObserver pour les chargements de ressources  │
│    - envoi via sendMessage avec throttle de 800 ms           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 3. Injected Script (monde MAIN de la page)                   │
│    dist/injected/page-detector.iife.js                       │
│    dist/injected/page-source-search.iife.js                  │
│    - injecté à la demande via executeScript({files})         │
│    - peut lire window.* / DOM réel / globalKeys              │
│    - s'exécute, retourne le résultat, ne persiste pas        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 4. Extension UI (popup / settings / help)                    │
│    src/ui/{popup,settings,help}/*.vue                        │
│    - SPA Vue 3 + TS                                          │
│    - communication avec le background via sendMessage        │
│    - stockage/lecture de la config via chrome.storage.sync   │
└─────────────────────────────────────────────────────────────┘
```

## Messages inter-scripts

Les 8 types de messages sont tous définis avec un discriminated union dans `src/types/messages.ts`, et tous les appels passent par le wrapper `sendMessage<M>()` de `src/utils/messaging.ts`.

| Message                       | Direction     | Utilisation                                          |
| ----------------------------- | ------------- | ---------------------------------------------------- |
| `GET_HEADER_DATA`             | popup → bg    | récupérer les en-têtes de réponse enregistrés        |
| `GET_POPUP_RESULT`            | popup → bg    | récupérer le cache léger (affichage principal popup) |
| `GET_POPUP_RAW_RESULT`        | popup → bg    | récupérer le raw complet (indices bruts / correction)|
| `GET_TECH_LINK`               | popup → bg    | fallback pour l'URL officielle d'une technologie     |
| `START_BACKGROUND_DETECTION`  | popup → bg    | déclencher la détection active via « Actualiser »    |
| `GET_WORDPRESS_THEME_DETAILS` | bg interne    | récupérer le header du style.css du thème            |
| `DYNAMIC_PAGE_SNAPSHOT`       | content → bg  | rapport continu de l'instantané dynamique            |
| `PAGE_DETECTION_RESULT`       | injected → bg | résultat retourné par page-detector après injection  |

## Problème du double chemin des scripts injectés

`page-detector.ts` était à l'origine importé par le background via `importScripts` et sérialisé via `{func}` dans `executeScript`. Le passage à ESM a rendu `Function.prototype.toString` inutilisable avec des imports.

Solution : utiliser `executeScript({files})` à la place de `{func}`. `page-detector.ts` est compilé indépendamment en fichier IIFE unique (`vite.injected.config.ts`) et injecté en deux appels RPC :

```ts
// 1. écriture de la variable globale temporaire
chrome.scripting.executeScript({
  target: { tabId },
  world: 'MAIN',
  func: rules => {
    window.__SP_RULES__ = rules
  },
  args: [pageRules]
})

// 2. injection du IIFE, qui lit __SP_RULES__ puis le supprime et retourne le résultat
chrome.scripting.executeScript({
  target: { tabId },
  world: 'MAIN',
  files: ['injected/page-detector.iife.js']
})
```

Avec cette approche, le background ne dépend plus directement de page-detector, et le service worker peut rester un ESM module worker.

## Ressources statiques

`public/rules/` et `public/tech-links.json` sont copiés 1:1 dans `dist/` par Vite et chargés au runtime via `chrome.runtime.getURL` + `fetch`. Ne pas les importer avec `import rules from '...'` — cela ferait inliner les règles dans le bundle par Rollup, ralentissant significativement le démarrage à froid du service worker.

Deux plugins Vite traitent également ces JSON lors du build :

1. `precompileRulesPlugin` : parcourt récursivement chaque JSON de règles et injecte dans chaque règle feuille les champs `__hints` (littéraux requis des expressions régulières), `__legacyHints` (seuil de pré-filtrage hérité, uniquement pour les règles concernées) et `__keywordCombined` (source de la regex combinée pour les règles de type keyword)
2. `minifyJsonAssets` : réécrit tous les JSON avec `JSON.stringify(parsed)` pour supprimer indentations et espaces

## Gestion d'état

Pinia n'est pas utilisé. Raisons :
- 6 champs de state dans la popup
- 2 champs de state dans les paramètres
- popup et settings sont deux pages d'extension indépendantes (contextes chrome.runtime distincts) — Pinia nécessiterait une double instanciation
- Le `DetectorSettings` partagé utilise `chrome.storage.sync` comme source de vérité + une copie locale `reactive()` suffit

## Thème (clair/sombre)

`src/utils/theme.ts` gère `getStoredTheme / setStoredTheme / cycleTheme / themeLabel`, stocké sous `chrome.storage.sync.stackPrismTheme`, avec trois états : `auto` / `light` / `dark`.

`src/ui/tokens.css` utilise `:root[data-theme='dark']` pour forcer le thème sombre, `@media (prefers-color-scheme: dark) :root:not([data-theme='light'])` pour suivre le système, et `color-scheme` pour synchroniser l'UI par défaut du navigateur.

Le bouton de changement de thème est présent dans la popup et les paramètres, et se synchronise entre pages via `chrome.storage.onChanged`.
