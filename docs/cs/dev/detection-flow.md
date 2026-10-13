# Průběh detekce

## Tři datové kanály

StackPrism souběžně provozuje tři kanály a jejich výsledky slučuje:

```text
┌──────────────────────────────────────────────────────────┐
│ Kanál A: Hlavičky odpovědí (chrome.webRequest)           │
│   - background webRequest.onHeadersReceived              │
│   - server / x-powered-by atd. hlavního dokumentu,      │
│     API a iframe                                         │
│   - zápis do chrome.storage.session:                    │
│     tab:{id}.main / tab:{id}.apis[] / tab:{id}.frames[] │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Kanál B: Aktivní detekce stránky (chrome.scripting + injected) │
│   - spouštěno kliknutím na tlačítko Obnovit ve vyskakovacím okně │
│   - bg volá scripting.executeScript a vloží page-detector │
│   - page-detector proběhne v MAIN world stránky a vrátí výsledek │
│   - výsledek se zapíše do tab:{id}.page                 │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Kanál C: Dynamický sběr (content script + MutationObserver) │
│   - bg vloží content-observer.ts při načtení stránky    │
│   - MutationObserver / PerformanceObserver průběžně sbírá │
│   - po 800ms throttle odešle DYNAMIC_PAGE_SNAPSHOT      │
│   - bg po 800ms debounce spustí detectFromDynamicSnapshot │
│   - výsledek se zapíše do tab:{id}.dynamic              │
└──────────────────────────────────────────────────────────┘
```

Všechny tři klíče záložky jsou uloženy v `chrome.storage.session`; při restartu service workeru se stav obnoví z úložiště bez závislosti na paměti SW.

## Datový tok: od spuštění po zobrazení ve vyskakovacím okně

```text
Uživatel klikne na ikonu rozšíření
  ↓
Vyskakovací okno se připojí (mount)
  ↓
loadCachedDetection()
  ↓
chrome.runtime.sendMessage({ type: 'GET_POPUP_RESULT', tabId })
  ↓
bg.message-router směruje na getPopupResultResponse(tabId)
  ↓
Kontrola mezipaměti popup:{tabId} v chrome.storage.session
  ├─ nalezeno a settingsKey se shoduje → vrátí přímo
  └─ nenalezeno → spustí buildPopupCacheRecord:
       1. načte page / main / apis / frames / dynamic z tab:{id}
       2. addStoredCustomHeaderRules (aplikuje vlastní pravidla pro hlavičky)
       3. buildDisplayTechnologies:
          - sloučí 5 zdrojů výsledků do jednoho pole
          - mergeDisplayTechnologyRecords — deduplikace + sběr sources Set
          - filterTechnologiesBySettings (filtruje podle nastavení)
       4. mergeResourceSummary (sloučí statistiku zdrojů)
       5. cleanPopupTechnology + seřazení výstupu
       6. zápis do mezipaměti popup:{tabId}
  ↓
bg vrátí PopupResult
  ↓
vyskakovací okno setState.result a zobrazí

Poznámka: background bude i nadále přijímat přírůstková aktualizace z
webRequest hlaviček odpovědí a dynamických snímků; každá aktualizace
přepíše mezipaměť popup:{tabId}
  ↓
chrome.storage.onChanged spustí onStorageChange na straně vyskakovacího okna
  ↓
Porovná vícepolní podpis popupCacheSignature; nahradí state.result
pouze při skutečné změně
```

## Kdy se spouští aktivní detekce

Kliknutím na „Obnovit" ve vyskakovacím okně se odešle zpráva `START_BACKGROUND_DETECTION`:

```ts
// background/detection.ts
const runActivePageDetection = async tabId => {
  const pageRules = await buildEffectivePageRules()

  // 1. zápis pravidel do dočasné globální proměnné stránky
  await chrome.scripting.executeScript({
    target: { tabId },
    world: 'MAIN',
    func: rules => {
      window.__SP_RULES__ = rules
    },
    args: [pageRules]
  })

  // 2. vložení IIFE — IIFE vrátí výsledek
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    world: 'MAIN',
    files: ['injected/page-detector.iife.js']
  })

  // 3. zápis do tab:{id}.page, spustí saveTabDataAndBadge pro přestavění mezipaměti popup
  data.page = cleanPageDetectionRecord(result)
  await saveTabDataAndBadge(tabId, data)
}
```

## Throttle dynamického sběru

Strana content-observer:

- při každém spuštění MutationObserver / PerformanceObserver se změny akumulují do stavu
- `scheduleSend()` nastaví časovač na 900 ms; po jeho vypršení se odešle `DYNAMIC_PAGE_SNAPSHOT`
- pokud mezitím přibydou další změny, dál se akumulují a časovač se resetuje — celkem maximálně jedno odeslání za ~900 ms

Strana background `dynamic-snapshot.ts`:

- po přijetí zprávy 800ms debounce
- po uplynutí debounce spustí `detectFromDynamicSnapshot(snapshot, pageRules)`
- zapíše do `tab:{id}.dynamic`, pak `saveTabDataAndBadge`

## Vrstva porovnávání pravidel (rule-matcher.ts)

Každé pravidlo se využívá na třech úrovních:

```text
detectFromXxx(snapshot, rules)
  scanner.scan(lowerText)                       ─ všechna pravidla sdílí jeden index hintů; text se prochází jednou
  for (const rule of rules):
    1. passesResourceHintLookup(rule, lookup)   ─ práh resourceHints na straně obchodní logiky
    2. passesHintLookup(rule, lookup)           ─ předfiltr nutných literálů (pouze přeskočí nemožné shody)
       passesLegacyHintLookup(rule, lookup)     ─ starší práh (__legacyHints, zachovává výsledky)
    3. matchesCompiledRulePatterns(rule, text)  ─ spustí skutečné regulární výrazy / keyword sloučený regex
       ├─ keyword: getCompiledCombinedPattern — jeden průchod cachovaného sloučeného regexu
       └─ regex: getCompiledRulePatterns.some — cachovaný RegExp[] testovaný postupně
    4. shoda: add(category, name, confidence, evidence)
```

Cachování přes WeakMap zajišťuje, že regulární výrazy a hinty každého pravidla se kompilují pouze jednou; hint index se cachuje podle seznamu pravidel a znovu se použije, pokud se pravidla nezměnila.

## Číslo na odznaku

Po každém zápisu mezipaměti v `saveTabDataAndBadge` se vezme hodnota `popupResult.counts.high` (počet technologií s vysokou spolehlivostí) a zavolá se `chrome.action.setBadgeText` pro zobrazení na ikoně rozšíření. Číslo viditelné po otevření vyskakovacího okna ≈ číslu na odznaku.

## Jak změna nastavení způsobí neplatnost mezipaměti

`buildSettingsCacheKey(settings)` serializuje klíčová pole nastavení (disabledCategories / disabledTechnologies / customRules) do řetězce. Jednou z podmínek shody v `getCachedPopupResult(popup, settings)` je `popup.settingsKey === buildSettingsCacheKey(settings)`.

Při změně nastavení se settingsKey změní a stará mezipaměť se automaticky stane neplatnou; při příštím požadavku `GET_POPUP_RESULT` se mezipaměť sestaví znovu na místě.
