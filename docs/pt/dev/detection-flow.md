# Fluxo de detecção

## Três pipelines de fonte de dados

O StackPrism executa três pipelines em paralelo e mescla os resultados:

```text
┌──────────────────────────────────────────────────────────┐
│ Pipeline A: Cabeçalhos de resposta (chrome.webRequest)   │
│   - background webRequest.onHeadersReceived              │
│   - server / x-powered-by, etc. do documento principal, │
│     API e iframes                                        │
│   - Gravado em chrome.storage.session:                   │
│     tab:{id}.main / tab:{id}.apis[] / tab:{id}.frames[]  │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Pipeline B: Detecção ativa (chrome.scripting + injected) │
│   - Disparado quando o usuário clica no botão atualizar  │
│   - bg chama scripting.executeScript para injetar        │
│     page-detector                                        │
│   - page-detector executa no MAIN world da página e      │
│     retorna o resultado                                  │
│   - Resultado gravado em tab:{id}.page                   │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Pipeline C: Coleta dinâmica (content script + MutationObserver) │
│   - bg injeta content-observer.ts no carregamento da página │
│   - MutationObserver / PerformanceObserver acumula dados │
│   - Envia DYNAMIC_PAGE_SNAPSHOT via sendMessage após     │
│     throttle de 800ms                                    │
│   - bg executa detectFromDynamicSnapshot após debounce   │
│     de 800ms                                             │
│   - Resultado gravado em tab:{id}.dynamic                │
└──────────────────────────────────────────────────────────┘
```

As três chaves de tab ficam em `chrome.storage.session`; após reinício do service worker, o estado é restaurado do storage sem depender da memória do SW.

## Fluxo de dados: do disparo à exibição no popup

```text
Usuário clica no ícone da extensão
  ↓
Popup é montado
  ↓
loadCachedDetection()
  ↓
chrome.runtime.sendMessage({ type: 'GET_POPUP_RESULT', tabId })
  ↓
bg.message-router encaminha para getPopupResultResponse(tabId)
  ↓
Verifica se há cache popup:{tabId} em chrome.storage.session
  ├─ Encontrado e settingsKey igual → retorna diretamente
  └─ Não encontrado → executa buildPopupCacheRecord:
       1. Lê page / main / apis / frames / dynamic de tab:{id}
       2. addStoredCustomHeaderRules (aplica regras de cabeçalho personalizadas do usuário)
       3. buildDisplayTechnologies:
          - Mescla os 5 resultados em um único array
          - mergeDisplayTechnologyRecords deduplica + coleta Set de origens
          - filterTechnologiesBySettings (filtra conforme configurações)
       4. mergeResourceSummary (mescla estatísticas de recursos)
       5. cleanPopupTechnology + saída ordenada
       6. Grava no cache popup:{tabId}
  ↓
bg retorna PopupResult
  ↓
Popup setState.result, exibe

Nota: o background continua recebendo atualizações incrementais de
cabeçalhos de resposta, snapshots dinâmicos, etc.
Cada atualização recria o cache popup:{tabId}
  ↓
chrome.storage.onChanged dispara onStorageChange no popup
  ↓
Compara assinatura multi-campo popupCacheSignature; substitui
state.result apenas se houver mudança real
```

## Quando a detecção ativa é disparada

Clicar em "Atualizar" no popup dispara a mensagem `START_BACKGROUND_DETECTION`:

```ts
// background/detection.ts
const runActivePageDetection = async tabId => {
  const pageRules = await buildEffectivePageRules()

  // 1. Grava as regras na variável global temporária da página
  await chrome.scripting.executeScript({
    target: { tabId },
    world: 'MAIN',
    func: rules => {
      window.__SP_RULES__ = rules
    },
    args: [pageRules]
  })

  // 2. Injeta o IIFE; o IIFE retorna o resultado internamente
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    world: 'MAIN',
    files: ['injected/page-detector.iife.js']
  })

  // 3. Grava em tab:{id}.page, dispara saveTabDataAndBadge para reconstruir cache
  data.page = cleanPageDetectionRecord(result)
  await saveTabDataAndBadge(tabId, data)
}
```

## Throttle da coleta dinâmica

No lado do content-observer:

- A cada disparo do MutationObserver / PerformanceObserver, as mudanças são acumuladas no estado
- `scheduleSend()` configura um temporizador de 900ms; quando o tempo expira, envia `DYNAMIC_PAGE_SNAPSHOT`
- Se houver mais mudanças antes de expirar, o estado continua acumulando e o temporizador é redefinido — no máximo uma envio a cada ~900ms

No background `dynamic-snapshot.ts`:

- Ao receber a mensagem, aplica debounce de 800ms
- Após o debounce, executa `detectFromDynamicSnapshot(snapshot, pageRules)`
- Grava em `tab:{id}.dynamic` e chama `saveTabDataAndBadge`

## Camada de correspondência de regras (rule-matcher.ts)

Cada regra é usada em três camadas:

```text
detectFromXxx(snapshot, rules)
  scanner.scan(lowerText)                       ─ constrói um índice de hints de todas as regras; o texto é escaneado apenas uma vez
  for (const rule of rules):
    1. passesResourceHintLookup(rule, lookup)   ─ limiar de resourceHints definido manualmente
    2. passesHintLookup(rule, lookup)           ─ pré-filtragem por literais obrigatórias (ignora apenas regras impossíveis)
       passesLegacyHintLookup(rule, lookup)     ─ limiar anterior (__legacyHints; garante resultados imutáveis)
    3. matchesCompiledRulePatterns(rule, text)  ─ executa a regex real / regex combinada keyword
       ├─ keyword usa getCompiledCombinedPattern: regex combinada em cache, uma correspondência
       └─ regex usa getCompiledRulePatterns.some: RegExp[] em cache testados individualmente
    4. Correspondência: add(category, name, confidence, evidence)
```

Cache via WeakMap garante que a compilação de regex + hints de cada regra ocorra apenas uma vez; o índice de hints é cacheado pela lista de regras e reutilizado enquanto as regras não mudam.

## Número no badge

Após cada execução de `saveTabDataAndBadge`, o cache do popup é atualizado e `popupResult.counts.high` (número de tecnologias de alta confiança) é usado para chamar `chrome.action.setBadgeText` no ícone da extensão. O número exibido no popup é aproximadamente igual ao número no badge.

## Como mudanças nas configurações invalidam o cache

`buildSettingsCacheKey(settings)` serializa os campos-chave das configurações (disabledCategories / disabledTechnologies / customRules) em uma string. Uma das condições de acerto do cache em `getCachedPopupResult(popup, settings)` é `popup.settingsKey === buildSettingsCacheKey(settings)`.

Quando as configurações mudam, o settingsKey muda, o cache antigo é invalidado automaticamente, e a próxima requisição `GET_POPUP_RESULT` reconstrói o resultado do zero.
