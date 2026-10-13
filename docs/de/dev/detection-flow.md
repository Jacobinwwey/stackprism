# Erkennungsfluss

## Drei Datenpipelines

StackPrism betreibt gleichzeitig drei Pipelines und führt deren Ergebnisse zusammen:

```text
┌──────────────────────────────────────────────────────────┐
│ Pipeline A: Antwortheader (chrome.webRequest)            │
│   - background webRequest.onHeadersReceived              │
│   - server / x-powered-by u. a. von Hauptdokument,      │
│     APIs und iFrames                                     │
│   - Schreibt in chrome.storage.session:                  │
│     tab:{id}.main / tab:{id}.apis[] / tab:{id}.frames[]  │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Pipeline B: Aktive Seitenerkennung                       │
│            (chrome.scripting + injected)                 │
│   - Ausgelöst durch START_BACKGROUND_DETECTION beim      │
│     Klick auf Aktualisieren im Popup                     │
│   - bg ruft scripting.executeScript auf, injiziert       │
│     page-detector                                        │
│   - page-detector läuft in der MAIN world und gibt       │
│     Ergebnis zurück                                      │
│   - Ergebnis wird in tab:{id}.page geschrieben           │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Pipeline C: Dynamische Erfassung                         │
│            (Content Script + MutationObserver)           │
│   - bg injiziert content-observer.ts beim Laden der Seite│
│   - MutationObserver / PerformanceObserver sammeln       │
│     kontinuierlich                                       │
│   - Nach 800ms-Throttle wird DYNAMIC_PAGE_SNAPSHOT       │
│     gesendet                                             │
│   - bg führt detectFromDynamicSnapshot nach 800ms-       │
│     Debounce aus                                         │
│   - Ergebnis wird in tab:{id}.dynamic geschrieben        │
└──────────────────────────────────────────────────────────┘
```

Alle drei tab-Schlüssel liegen in `chrome.storage.session`; nach einem Service-Worker-Neustart wird der Zustand aus dem Storage wiederhergestellt, ohne von SW-Speicher abhängig zu sein.

## Datenfluss: von der Auslösung bis zur Popup-Anzeige

```text
Nutzer klickt auf das Erweiterungs-Icon
  ↓
Popup mountet
  ↓
loadCachedDetection()
  ↓
chrome.runtime.sendMessage({ type: 'GET_POPUP_RESULT', tabId })
  ↓
bg.message-router leitet an getPopupResultResponse(tabId) weiter
  ↓
Prüft ob popup:{tabId}-Cache in chrome.storage.session vorhanden
  ├─ Treffer und settingsKey stimmt überein → direkt zurückgeben
  └─ Kein Treffer → buildPopupCacheRecord ausführen:
       1. page / main / apis / frames / dynamic aus tab:{id} lesen
       2. addStoredCustomHeaderRules (benutzerdefinierte Header-Regeln anwenden)
       3. buildDisplayTechnologies:
          - 5 Ergebnisquellen zu einem Array zusammenführen
          - mergeDisplayTechnologyRecords: deduplizieren + sources Set aufbauen
          - filterTechnologiesBySettings (nach Einstellungen filtern)
       4. mergeResourceSummary (Ressourcenstatistik zusammenführen)
       5. cleanPopupTechnology + Sortierung ausgeben
       6. In popup:{tabId}-Cache schreiben
  ↓
bg gibt PopupResult zurück
  ↓
Popup: setState.result, Anzeige

Hinweis: Der Hintergrundprozess empfängt weiterhin inkrementelle Updates
aus webRequest-Antwortheadern und dynamischen Snapshots;
bei jedem Update wird popup:{tabId}-Cache neu geschrieben
  ↓
chrome.storage.onChanged löst onStorageChange im Popup aus
  ↓
Mehrfeldige popupCacheSignature wird verglichen;
state.result wird nur bei tatsächlicher Änderung ersetzt
```

## Zeitpunkt der aktiven Erkennung

Ein Klick auf „Aktualisieren" im Popup sendet die Nachricht `START_BACKGROUND_DETECTION`:

```ts
// background/detection.ts
const runActivePageDetection = async tabId => {
  const pageRules = await buildEffectivePageRules()

  // 1. Regeln in temporäre globale Seitenvariable schreiben
  await chrome.scripting.executeScript({
    target: { tabId },
    world: 'MAIN',
    func: rules => {
      window.__SP_RULES__ = rules
    },
    args: [pageRules]
  })

  // 2. IIFE injizieren; IIFE gibt intern das Ergebnis zurück
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    world: 'MAIN',
    files: ['injected/page-detector.iife.js']
  })

  // 3. In tab:{id}.page speichern, saveTabDataAndBadge löst
  //    Popup-Cache-Neuaufbau aus
  data.page = cleanPageDetectionRecord(result)
  await saveTabDataAndBadge(tabId, data)
}
```

## Dynamisches Erfassungs-Throttling

Content-Observer-Seite:

- Bei jedem Auslösen von MutationObserver / PerformanceObserver werden Änderungen akkumuliert
- `scheduleSend()` setzt einen 900ms-Timer; bei Ablauf wird `DYNAMIC_PAGE_SNAPSHOT` gesendet
- Treten zwischendurch weitere Änderungen auf, werden sie weiter gesammelt und der Timer zurückgesetzt — insgesamt maximal ein Sendevorgang pro ~900ms

Background `dynamic-snapshot.ts`:

- Beim Empfang der Nachricht wird 800ms gewartet (Debounce)
- Nach dem Debounce: `detectFromDynamicSnapshot(snapshot, pageRules)` ausführen
- In `tab:{id}.dynamic` schreiben, dann `saveTabDataAndBadge` aufrufen

## Regelabgleichsschicht (rule-matcher.ts)

Jede Regel durchläuft drei Ebenen:

```text
detectFromXxx(snapshot, rules)
  scanner.scan(lowerText)                       ─ Index über alle Regel-Hints; Text nur einmal scannen
  for (const rule of rules):
    1. passesResourceHintLookup(rule, lookup)   ─ resourceHints-Schwellenwert (business-seitig)
    2. passesHintLookup(rule, lookup)           ─ Vorfilterung mit erforderlichen Literalen
       passesLegacyHintLookup(rule, lookup)     ─ Älterer Schwellenwert (__legacyHints, unverändertes Ergebnis)
    3. matchesCompiledRulePatterns(rule, text)  ─ Eigentlichen Regex / Keyword-Muster ausführen
       ├─ keyword: getCompiledCombinedPattern — gecachter kombinierter Regex, einmaliger Treffer
       └─ regex:   getCompiledRulePatterns.some — gecachtes RegExp[]-Array, nacheinander testen
    4. Treffer: add(category, name, confidence, evidence)
```

WeakMap-Cache stellt sicher, dass Regex und Hints jeder Regel nur einmal kompiliert werden; der Hint-Index wird pro Regelliste gecacht und bei unveränderter Regelliste wiederverwendet.

## Badge-Zahl

Nach jedem `saveTabDataAndBadge`-Aufruf wird `popupResult.counts.high` (Anzahl der Technologien mit hoher Konfidenz) ausgelesen und per `chrome.action.setBadgeText` auf dem Erweiterungs-Icon angezeigt. Die im Popup sichtbare Zahl entspricht in der Regel der Badge-Zahl.

## Wie Einstellungsänderungen den Cache invalidieren

`buildSettingsCacheKey(settings)` serialisiert die relevanten Einstellungsfelder (`disabledCategories` / `disabledTechnologies` / `customRules`) zu einem String. Eine der Bedingungen für einen Cache-Treffer in `getCachedPopupResult(popup, settings)` ist `popup.settingsKey === buildSettingsCacheKey(settings)`.

Ändert sich eine Einstellung, ändert sich der settingsKey, der alte Cache wird automatisch invalidiert, und beim nächsten `GET_POPUP_RESULT` wird der Cache neu aufgebaut.
