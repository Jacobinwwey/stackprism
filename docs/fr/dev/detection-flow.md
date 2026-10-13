# Flux de détection

## Trois pipelines de sources de données

StackPrism fait tourner trois pipelines en parallèle et fusionne leurs résultats :

```text
┌──────────────────────────────────────────────────────────┐
│ Pipeline A : en-têtes de réponse (chrome.webRequest)      │
│   - background webRequest.onHeadersReceived               │
│   - server / x-powered-by et autres en-têtes du document  │
│     principal / API / iframes                             │
│   - écriture dans chrome.storage.session                  │
│     tab:{id}.main / tab:{id}.apis[] / tab:{id}.frames[]   │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Pipeline B : détection active (chrome.scripting + injected)│
│   - déclenché par le bouton « Actualiser » de la popup    │
│   - bg appelle scripting.executeScript pour injecter      │
│     page-detector                                         │
│   - page-detector s'exécute dans le monde MAIN et retourne│
│     le résultat                                           │
│   - résultat écrit dans tab:{id}.page                     │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Pipeline C : collecte dynamique (content script +         │
│   MutationObserver)                                       │
│   - bg injecte content-observer.ts au chargement de la   │
│     page                                                  │
│   - MutationObserver / PerformanceObserver accumulent en  │
│     continu                                               │
│   - throttle de 800 ms puis sendMessage                   │
│     DYNAMIC_PAGE_SNAPSHOT                                 │
│   - bg anti-rebond 800 ms puis detectFromDynamicSnapshot  │
│   - résultat écrit dans tab:{id}.dynamic                  │
└──────────────────────────────────────────────────────────┘
```

Les trois clés `tab` sont stockées dans `chrome.storage.session` ; après un redémarrage du service worker, l'état est restauré depuis le storage sans dépendre de la mémoire du SW.

## Flux de données : du déclenchement à l'affichage dans la popup

```text
L'utilisateur clique sur l'icône de l'extension
  ↓
montage de la popup
  ↓
loadCachedDetection()
  ↓
chrome.runtime.sendMessage({ type: 'GET_POPUP_RESULT', tabId })
  ↓
bg.message-router route vers getPopupResultResponse(tabId)
  ↓
vérifie si popup:{tabId} existe dans chrome.storage.session
  ├─ présent et settingsKey identique → retourne directement
  └─ absent → construit buildPopupCacheRecord :
       1. lit page / main / apis / frames / dynamic depuis tab:{id}
       2. addStoredCustomHeaderRules (applique les règles d'en-têtes personnalisées)
       3. buildDisplayTechnologies :
          - fusionne les 5 sources dans un tableau
          - mergeDisplayTechnologyRecords : déduplique + collecte les sources
          - filterTechnologiesBySettings (filtre selon les paramètres)
       4. mergeResourceSummary (fusionne le résumé des ressources)
       5. cleanPopupTechnology + tri et sortie
       6. écriture dans le cache popup:{tabId}
  ↓
bg retourne PopupResult
  ↓
popup setState.result, affichage

Note : en arrière-plan, le background continue de recevoir des en-têtes de réponse
et des instantanés dynamiques en tant que mises à jour incrémentielles,
chacune réécrivant le cache popup:{tabId}
  ↓
chrome.storage.onChanged déclenche onStorageChange côté popup
  ↓
compare la signature multi-champs popupCacheSignature,
ne remplace state.result que si un vrai changement est détecté
```

## Déclenchement de la détection active

Cliquer sur « Actualiser » dans la popup envoie le message `START_BACKGROUND_DETECTION` :

```ts
// background/detection.ts
const runActivePageDetection = async tabId => {
  const pageRules = await buildEffectivePageRules()

  // 1. écriture de la variable globale temporaire dans la page
  await chrome.scripting.executeScript({
    target: { tabId },
    world: 'MAIN',
    func: rules => {
      window.__SP_RULES__ = rules
    },
    args: [pageRules]
  })

  // 2. injection du IIFE, qui retourne le résultat
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    world: 'MAIN',
    files: ['injected/page-detector.iife.js']
  })

  // 3. stockage dans tab:{id}.page, déclenchement de saveTabDataAndBadge
  //    pour reconstruire le cache popup
  data.page = cleanPageDetectionRecord(result)
  await saveTabDataAndBadge(tabId, data)
}
```

## Throttle de la collecte dynamique

Côté content-observer :

- Chaque déclenchement de MutationObserver / PerformanceObserver accumule les changements dans l'état
- `scheduleSend()` pose un timer de 900 ms ; à l'expiration, envoie `DYNAMIC_PAGE_SNAPSHOT`
- Si d'autres changements surviennent entre-temps, ils sont accumulés et le timer est réinitialisé — au total, au maximum un envoi toutes les ~900 ms

Côté background `dynamic-snapshot.ts` :

- À réception du message, anti-rebond de 800 ms
- À l'expiration, lance `detectFromDynamicSnapshot(snapshot, pageRules)`
- Écrit dans `tab:{id}.dynamic`, puis appelle `saveTabDataAndBadge`

## Couche de correspondance des règles (rule-matcher.ts)

Chaque règle est utilisée à trois niveaux :

```text
detectFromXxx(snapshot, rules)
  scanner.scan(lowerText)                       — un index est construit sur les hints de toutes les règles,
                                                  le texte n'est parcouru qu'une fois
  for (const rule of rules):
    1. passesResourceHintLookup(rule, lookup)   — seuil resourceHints côté métier
    2. passesHintLookup(rule, lookup)           — pré-filtrage par littéraux requis
                                                  (élimine uniquement les règles impossibles)
       passesLegacyHintLookup(rule, lookup)     — seuil hérité (__legacyHints, résultats inchangés)
    3. matchesCompiledRulePatterns(rule, text)  — exécute les expressions régulières / regex combinée
       ├─ keyword → getCompiledCombinedPattern : regex combinée en cache, une seule correspondance
       └─ regex → getCompiledRulePatterns.some : tableau de RegExp en cache, test un par un
    4. correspondance : add(category, name, confidence, evidence)
```

Le cache WeakMap fait que la compilation regex + hints de chaque règle n'est effectuée qu'une fois ; l'index de hints est mis en cache par liste de règles et réutilisé tant que les règles ne changent pas.

## Numéro de badge

Après chaque appel à `saveTabDataAndBadge` qui reconstruit le cache popup, `popupResult.counts.high` (nombre de technologies à haute confiance) est récupéré et `chrome.action.setBadgeText` est appelé pour l'afficher sur l'icône de l'extension. Le nombre affiché dans la popup ≈ le nombre du badge.

## Invalidation du cache lors d'un changement de paramètres

`buildSettingsCacheKey(settings)` sérialise les champs clés des paramètres (`disabledCategories` / `disabledTechnologies` / `customRules`) en une chaîne. L'une des conditions pour qu'un `getCachedPopupResult` soit valide est que `popup.settingsKey === buildSettingsCacheKey(settings)`.

Dès qu'un paramètre change, la `settingsKey` change, l'ancien cache est automatiquement invalidé, et la prochaine requête `GET_POPUP_RESULT` reconstruit le cache à la volée.
