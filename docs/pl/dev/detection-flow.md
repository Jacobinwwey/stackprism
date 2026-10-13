# Przepływ detekcji

## Trzy potoki danych

StackPrism uruchamia równolegle trzy potoki i scala ich wyniki:

```text
┌──────────────────────────────────────────────────────────┐
│ Potok A: Nagłówki odpowiedzi (chrome.webRequest)          │
│   - background webRequest.onHeadersReceived               │
│   - nagłówki server / x-powered-by itp. głównego          │
│     dokumentu, API i iframe                               │
│   - zapis do chrome.storage.session:                      │
│     tab:{id}.main / tab:{id}.apis[] / tab:{id}.frames[]   │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Potok B: Aktywna detekcja strony (chrome.scripting + injected) │
│   - wyzwalana przyciskiem „Odśwież" w oknie podręcznym   │
│   - bg wywołuje scripting.executeScript, wstrzykując page-detector │
│   - page-detector działa w MAIN world strony i zwraca wynik │
│   - wynik zapisywany do tab:{id}.page                    │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Potok C: Zbieranie dynamiczne (content script + MutationObserver) │
│   - bg wstrzykuje content-observer.ts przy załadowaniu strony │
│   - MutationObserver / PerformanceObserver ciągło zbiera dane │
│   - po 800ms throttle wysyła DYNAMIC_PAGE_SNAPSHOT        │
│   - bg debounce 800ms, następnie detectFromDynamicSnapshot│
│   - wynik zapisywany do tab:{id}.dynamic                 │
└──────────────────────────────────────────────────────────┘
```

Wszystkie trzy klucze tab są przechowywane w `chrome.storage.session`. Po ponownym uruchomieniu service workera stan jest przywracany ze storage, bez zależności od pamięci SW.

## Przepływ danych: od wyzwolenia do wyświetlenia w oknie

```text
Użytkownik klika ikonę rozszerzenia
  ↓
Montowanie okna podręcznego
  ↓
loadCachedDetection()
  ↓
chrome.runtime.sendMessage({ type: 'GET_POPUP_RESULT', tabId })
  ↓
bg.message-router kieruje do getPopupResultResponse(tabId)
  ↓
Sprawdzenie cache popup:{tabId} w chrome.storage.session
  ├─ trafienie + zgodny settingsKey → zwróć bezpośrednio
  └─ brak → uruchom buildPopupCacheRecord:
       1. odczyt page / main / apis / frames / dynamic z tab:{id}
       2. addStoredCustomHeaderRules (stosowanie niestandardowych reguł nagłówków)
       3. buildDisplayTechnologies:
          - scalenie 5 wyników w jedną tablicę
          - mergeDisplayTechnologyRecords: deduplikacja + zbieranie sources Set
          - filterTechnologiesBySettings (filtrowanie według ustawień)
       4. mergeResourceSummary (scalenie statystyk zasobów)
       5. cleanPopupTechnology + sortowanie wyniku
       6. zapis do cache popup:{tabId}
  ↓
bg zwraca PopupResult
  ↓
okno setState.result, wyświetlenie

Uwaga: background nadal przyjmuje przyrostowe aktualizacje z webRequest
i dynamicznych snapshotów — każda aktualizacja odświeża cache popup:{tabId}
  ↓
chrome.storage.onChanged wyzwala onStorageChange po stronie okna
  ↓
porównanie podpisu popupCacheSignature (wiele pól), wymiana state.result
tylko przy rzeczywistej zmianie
```

## Kiedy uruchamiana jest aktywna detekcja

Kliknięcie „Odśwież" w oknie podręcznym wysyła wiadomość `START_BACKGROUND_DETECTION`:

```ts
// background/detection.ts
const runActivePageDetection = async tabId => {
  const pageRules = await buildEffectivePageRules()

  // 1. zapis reguł do tymczasowej zmiennej globalnej strony
  await chrome.scripting.executeScript({
    target: { tabId },
    world: 'MAIN',
    func: rules => {
      window.__SP_RULES__ = rules
    },
    args: [pageRules]
  })

  // 2. wstrzyknięcie IIFE; IIFE zwraca wynik wewnętrznie
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    world: 'MAIN',
    files: ['injected/page-detector.iife.js']
  })

  // 3. zapis do tab:{id}.page, wyzwolenie saveTabDataAndBadge
  //    do przebudowania cache popup
  data.page = cleanPageDetectionRecord(result)
  await saveTabDataAndBadge(tabId, data)
}
```

## Throttling zbierania dynamicznego

Po stronie content-observer:

- każde wyzwolenie MutationObserver / PerformanceObserver kumuluje zmiany w stanie
- `scheduleSend()` ustawia timer 900ms; po upływie wysyła `DYNAMIC_PAGE_SNAPSHOT`
- kolejne zmiany w międzyczasie są kumulowane, a timer resetowany — maksymalnie jedna wiadomość na ~900ms

Po stronie background (`dynamic-snapshot.ts`):

- po otrzymaniu wiadomości: debounce 800ms
- po debounce: uruchomienie `detectFromDynamicSnapshot(snapshot, pageRules)`
- zapis do `tab:{id}.dynamic`, następnie `saveTabDataAndBadge`

## Warstwa dopasowania reguł (rule-matcher.ts)

Każda reguła jest używana na trzech poziomach:

```text
detectFromXxx(snapshot, rules)
  scanner.scan(lowerText)                       ─ jeden przebieg po tekście buduje indeks hints wszystkich reguł
  for (const rule of rules):
    1. passesResourceHintLookup(rule, lookup)   ─ próg resourceHints po stronie biznesowej
    2. passesHintLookup(rule, lookup)           ─ wstępne filtrowanie przez wymagane literały
       passesLegacyHintLookup(rule, lookup)     ─ stary próg (__legacyHints, gwarantuje niezmienność wyników)
    3. matchesCompiledRulePatterns(rule, text)  ─ uruchomienie właściwych wyrażeń / keyword
       ├─ keyword: getCompiledCombinedPattern — jeden test na jedno łączone wyrażenie regularne z cache
       └─ regex: getCompiledRulePatterns.some — każdy RegExp[] z cache testowany po kolei
    4. trafienie: add(category, name, confidence, evidence)
```

WeakMap cache zapewnia, że kompilacja wyrażeń regularnych i hints dla każdej reguły odbywa się tylko raz. Indeks hints jest buforowany per lista reguł i reużywany, gdy reguły się nie zmieniają.

## Liczba na plakietce

Po każdym zapisie cache popup przez `saveTabDataAndBadge` pobierana jest wartość `popupResult.counts.high` (liczba technologii o wysokiej pewności) i wywoływane `chrome.action.setBadgeText`, aby wyświetlić ją na ikonie rozszerzenia. Liczba widoczna po otwarciu okna jest równa liczbie na plakietce.

## Jak zmiana ustawień unieważnia cache

`buildSettingsCacheKey(settings)` serializuje kluczowe pola ustawień (disabledCategories / disabledTechnologies / customRules) do ciągu znaków. Warunkiem trafienia w `getCachedPopupResult(popup, settings)` jest m.in. `popup.settingsKey === buildSettingsCacheKey(settings)`.

Zmiana ustawień powoduje zmianę settingsKey, stary cache jest automatycznie nieważny, a kolejne `GET_POPUP_RESULT` przebudowuje go od zera.
