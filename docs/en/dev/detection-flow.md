# Detection Flow

## Three Data Source Pipelines

StackPrism runs three pipelines concurrently and merges their results:

```text
┌──────────────────────────────────────────────────────────┐
│ Pipeline A: Response Headers (chrome.webRequest)          │
│   - background webRequest.onHeadersReceived               │
│   - server / x-powered-by etc. from main doc / API /     │
│     iframe responses                                      │
│   - written to chrome.storage.session:                   │
│     tab:{id}.main / tab:{id}.apis[] / tab:{id}.frames[]  │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Pipeline B: Active Page Detection (scripting + injected)  │
│   - triggered when user clicks the Refresh button         │
│   - bg calls scripting.executeScript to inject            │
│     page-detector                                         │
│   - page-detector runs in page MAIN world, returns result │
│   - result written to tab:{id}.page                       │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Pipeline C: Dynamic Collection (content script +          │
│             MutationObserver)                             │
│   - bg injects content-observer.ts on page load           │
│   - MutationObserver / PerformanceObserver accumulate     │
│     data continuously                                     │
│   - throttled to one send per ~900ms via sendMessage      │
│     DYNAMIC_PAGE_SNAPSHOT                                 │
│   - bg debounces 800ms, runs detectFromDynamicSnapshot    │
│   - result written to tab:{id}.dynamic                    │
└──────────────────────────────────────────────────────────┘
```

All three tab keys are stored in `chrome.storage.session`. If the service worker restarts, it restores state from storage rather than relying on in-memory data.

## Data Flow: From Trigger to Popup Display

```text
User clicks extension icon
  ↓
Popup mounts
  ↓
loadCachedDetection()
  ↓
chrome.runtime.sendMessage({ type: 'GET_POPUP_RESULT', tabId })
  ↓
bg.message-router routes to getPopupResultResponse(tabId)
  ↓
Check chrome.storage.session for popup:{tabId} cache
  ├─ hit and settingsKey matches → return immediately
  └─ miss → buildPopupCacheRecord:
       1. read page / main / apis / frames / dynamic from tab:{id}
       2. addStoredCustomHeaderRules (apply user custom header rules)
       3. buildDisplayTechnologies:
          - merge 5 result sets into one array
          - mergeDisplayTechnologyRecords: dedup + collect sources Set
          - filterTechnologiesBySettings (apply settings filters)
       4. mergeResourceSummary (merge resource stats)
       5. cleanPopupTechnology + sort output
       6. write popup:{tabId} cache
  ↓
bg returns PopupResult
  ↓
Popup setState.result, render

Note: background continues receiving webRequest headers and dynamic
snapshots as incremental updates; each update rewrites popup:{tabId}
  ↓
chrome.storage.onChanged triggers popup onStorageChange
  ↓
compare popupCacheSignature multi-field signature; replace
state.result only when a real change is detected
```

## When Active Detection Runs

Clicking Refresh in the popup sends a `START_BACKGROUND_DETECTION` message:

```ts
// background/detection.ts
const runActivePageDetection = async tabId => {
  const pageRules = await buildEffectivePageRules()

  // 1. write rules to a temporary page global
  await chrome.scripting.executeScript({
    target: { tabId },
    world: 'MAIN',
    func: rules => {
      window.__SP_RULES__ = rules
    },
    args: [pageRules]
  })

  // 2. inject IIFE; IIFE reads the global and returns results
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    world: 'MAIN',
    files: ['injected/page-detector.iife.js']
  })

  // 3. store in tab:{id}.page, triggering saveTabDataAndBadge to
  //    rebuild the popup cache
  data.page = cleanPageDetectionRecord(result)
  await saveTabDataAndBadge(tabId, data)
}
```

## Dynamic Collection Throttling

Content observer side:

- Every MutationObserver / PerformanceObserver callback accumulates changes into state
- `scheduleSend()` sets a 900ms timer; when it fires, sends `DYNAMIC_PAGE_SNAPSHOT`
- Additional changes during the window reset the timer — at most one message per ~900ms

Background `dynamic-snapshot.ts`:

- Debounces incoming messages by 800ms
- When the debounce settles, runs `detectFromDynamicSnapshot(snapshot, pageRules)`
- Writes to `tab:{id}.dynamic`, then calls `saveTabDataAndBadge`

## Rule Matching Layer (rule-matcher.ts)

Each rule is used at three levels:

```text
detectFromXxx(snapshot, rules)
  scanner.scan(lowerText)                       — builds a hint index over all rules; scans text once
  for (const rule of rules):
    1. passesResourceHintLookup(rule, lookup)   — business-side resourceHints gate
    2. passesHintLookup(rule, lookup)           — required literal pre-filter (only skips impossible rules)
       passesLegacyHintLookup(rule, lookup)     — legacy threshold (__legacyHints, preserves results)
    3. matchesCompiledRulePatterns(rule, text)  — runs actual regex / keyword combined regex
       ├─ keyword: getCompiledCombinedPattern — cached merged regex, one test
       └─ regex: getCompiledRulePatterns.some — cached RegExp[], tested in sequence
    4. match: add(category, name, confidence, evidence)
```

A WeakMap cache ensures regex compilation and hint extraction run only once per rule; the hint index is cached per rule list and reused while the rules don't change.

## Badge Number

After every `saveTabDataAndBadge` call, the cache is updated and `popupResult.counts.high` (the high-confidence tech count) is read and passed to `chrome.action.setBadgeText` to update the icon badge. The number in the badge approximately matches the Highlights count in the popup.

## How Settings Changes Invalidate the Cache

`buildSettingsCacheKey(settings)` serializes the relevant settings fields (`disabledCategories` / `disabledTechnologies` / `customRules`) into a string. One condition for `getCachedPopupResult(popup, settings)` returning a hit is that `popup.settingsKey === buildSettingsCacheKey(settings)`.

When settings change, the key changes, the old cache misses automatically, and the next `GET_POPUP_RESULT` rebuilds the popup data from scratch.
