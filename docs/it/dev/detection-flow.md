# Flusso di rilevamento

## Tre pipeline di dati

StackPrism esegue tre pipeline in parallelo e ne unisce i risultati:

```text
┌──────────────────────────────────────────────────────────┐
│ Pipeline A: Intestazioni (chrome.webRequest)              │
│   - background webRequest.onHeadersReceived              │
│   - server / x-powered-by ecc. di documento / API / iframe │
│   - scritto in chrome.storage.session su tab:{id}.main / │
│     tab:{id}.apis[] / tab:{id}.frames[]                  │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Pipeline B: Rilevamento attivo (chrome.scripting + injected) │
│   - attivato dal pulsante "Aggiorna" nel popup           │
│   - bg chiama scripting.executeScript per iniettare page-detector │
│   - page-detector viene eseguito nel MAIN world e restituisce il risultato │
│   - risultato scritto in tab:{id}.page                   │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Pipeline C: Raccolta dinamica (content script + MutationObserver) │
│   - bg inietta content-observer.ts al caricamento della pagina │
│   - MutationObserver / PerformanceObserver accumulano continuamente │
│   - throttle 800ms poi sendMessage DYNAMIC_PAGE_SNAPSHOT │
│   - bg con debounce 800ms esegue detectFromDynamicSnapshot │
│   - risultato scritto in tab:{id}.dynamic               │
└──────────────────────────────────────────────────────────┘
```

Le tre chiavi tab sono tutte in `chrome.storage.session`; dopo un riavvio del service worker lo stato viene ripristinato dallo storage senza dipendere dalla memoria del SW.

## Flusso dati: dal trigger alla visualizzazione nel popup

```text
Utente clicca l'icona estensione
  ↓
Popup mount
  ↓
loadCachedDetection()
  ↓
chrome.runtime.sendMessage({ type: 'GET_POPUP_RESULT', tabId })
  ↓
bg.message-router instrada a getPopupResultResponse(tabId)
  ↓
Verifica se esiste cache popup:{tabId} in chrome.storage.session
  ├─ presente e settingsKey invariato → risposta diretta
  └─ assente → esecuzione di buildPopupCacheRecord:
       1. legge page / main / apis / frames / dynamic da tab:{id}
       2. addStoredCustomHeaderRules (applica regole intestazioni personalizzate)
       3. buildDisplayTechnologies:
          - fonde i 5 risultati in un unico array
          - mergeDisplayTechnologyRecords: dedup + raccolta Set delle origini
          - filterTechnologiesBySettings (filtra per impostazioni)
       4. mergeResourceSummary (unisce statistiche risorse)
       5. cleanPopupTechnology + output ordinato
       6. scritto in cache popup:{tabId}
  ↓
bg restituisce PopupResult
  ↓
popup setState.result, visualizzazione

Nota: in seguito background continua a ricevere intestazioni webRequest, snapshot
dinamici e altri aggiornamenti incrementali; ogni aggiornamento riscrive la cache popup:{tabId}
  ↓
chrome.storage.onChanged attiva onStorageChange lato popup
  ↓
confronta firma multipla popupCacheSignature, sostituisce state.result solo se ci sono cambiamenti reali
```

## Timing del rilevamento attivo

Cliccando "Aggiorna" nel popup si attiva il messaggio `START_BACKGROUND_DETECTION`:

```ts
// background/detection.ts
const runActivePageDetection = async tabId => {
  const pageRules = await buildEffectivePageRules()

  // 1. scrittura regole nella variabile globale temporanea della pagina
  await chrome.scripting.executeScript({
    target: { tabId },
    world: 'MAIN',
    func: rules => {
      window.__SP_RULES__ = rules
    },
    args: [pageRules]
  })

  // 2. iniezione IIFE; l'IIFE restituisce internamente il risultato
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    world: 'MAIN',
    files: ['injected/page-detector.iife.js']
  })

  // 3. salvataggio in tab:{id}.page, triggera saveTabDataAndBadge per ricostruire la cache popup
  data.page = cleanPageDetectionRecord(result)
  await saveTabDataAndBadge(tabId, data)
}
```

## Throttle della raccolta dinamica

Lato content-observer:

- Ad ogni trigger di MutationObserver / PerformanceObserver, le variazioni vengono accumulate nello stato
- `scheduleSend()` imposta un timer da 900ms; allo scadere invia `DYNAMIC_PAGE_SNAPSHOT`
- Se nel frattempo arrivano altri cambiamenti, continuano ad accumularsi e il timer si azzera — in totale al massimo un invio ogni ~900ms

Lato background `dynamic-snapshot.ts`:

- Alla ricezione del messaggio, debounce di 800ms
- Allo scadere del debounce esegue `detectFromDynamicSnapshot(snapshot, pageRules)`
- Scrive in `tab:{id}.dynamic`, poi esegue `saveTabDataAndBadge`

## Livello di matching delle regole (rule-matcher.ts)

Ogni regola viene usata su tre livelli:

```text
detectFromXxx(snapshot, rules)
  scanner.scan(lowerText)                       ─ hint di tutte le regole in un indice, testo scansionato una sola volta
  for (const rule of rules):
    1. passesResourceHintLookup(rule, lookup)   ─ soglia resourceHints lato business
    2. passesHintLookup(rule, lookup)           ─ pre-filtro letterali necessari (salta solo le regole impossibili)
       passesLegacyHintLookup(rule, lookup)     ─ soglia legacy (__legacyHints, garantisce invarianza risultati)
    3. matchesCompiledRulePatterns(rule, text)  ─ esecuzione regex / keyword reale
       ├─ keyword usa getCompiledCombinedPattern: regex combinata in cache, un solo match
       └─ regex usa getCompiledCombinedPattern.some: RegExp[] in cache, test uno per uno
    4. corrispondenza: add(category, name, confidence, evidence)
```

La cache WeakMap fa sì che la compilazione di regex + hint di ogni regola avvenga una sola volta; l'indice hint viene messo in cache per lista di regole e riutilizzato se le regole non cambiano.

## Badge numerico

Ogni volta che `saveTabDataAndBadge` finisce di scrivere la cache popup, prende `popupResult.counts.high` (numero di tecnologie ad alta confidenza) e chiama `chrome.action.setBadgeText` per mostrarlo sull'icona dell'estensione. Il numero nel popup ≈ numero nel badge.

## Come le modifiche alle impostazioni invalidano la cache

`buildSettingsCacheKey(settings)` serializza i campi chiave delle impostazioni (disabledCategories / disabledTechnologies / customRules) in una stringa. Una delle condizioni di hit di `getCachedPopupResult(popup, settings)` è `popup.settingsKey === buildSettingsCacheKey(settings)`.

Appena le impostazioni cambiano, la settingsKey cambia, la cache precedente viene automaticamente invalidata e la prossima `GET_POPUP_RESULT` ricostruisce tutto da zero.
