# Visão geral da arquitetura

## Estrutura de diretórios

```text
stackprism/
├─ src/
│  ├─ manifest.config.ts        # Definição do manifest MV3 para @crxjs/vite-plugin
│  ├─ background/                # service worker (ESM module worker)
│  │  ├─ index.ts                # Registra os listeners de eventos do chrome
│  │  ├─ message-router.ts       # Roteamento de onMessage (8 tipos de mensagem)
│  │  ├─ tab-store.ts            # Leitura/escrita do cache por aba/popup
│  │  ├─ headers.ts              # Coleta de cabeçalhos de resposta via webRequest
│  │  ├─ detection.ts            # Detecção ativa / scheduleActivePageDetection
│  │  ├─ popup-cache.ts          # Construção dos dados raw / display do popup
│  │  ├─ wordpress.ts            # Busca do style.css do tema WordPress
│  │  ├─ dynamic-snapshot.ts     # Processamento com debounce de snapshots dinâmicos
│  │  ├─ tech-links.ts           # Carregamento lazy de tech-links.json
│  │  ├─ rule-loader.ts          # Carregamento e mesclagem dos JSONs de regras
│  │  ├─ rule-matcher.ts         # Cache de compilação + pré-filtragem por índice de hints
│  │  ├─ detector-settings.ts    # Cache de configurações / regras
│  │  ├─ content-injector.ts     # Injeta content script em abas já abertas na inicialização
│  │  └─ merge.ts                # Mesclagem / deduplicação / regras de supressão de tecnologias
│  ├─ content/
│  │  └─ content-observer.ts     # Coleta dinâmica contínua via MutationObserver
│  ├─ injected/                   # Compilado como IIFE independente, injetado no MAIN world da página
│  │  ├─ page-detector.ts         # Função principal de detecção (990 linhas)
│  │  └─ page-source-search.ts    # Pesquisa no código-fonte do popup
│  ├─ ui/
│  │  ├─ popup/                   # SPA do popup
│  │  ├─ settings/                # SPA da página de configurações
│  │  ├─ help/                    # SPA da página de ajuda
│  │  ├─ components/Select.vue    # Componente Select / Combobox personalizado
│  │  └─ tokens.css               # Variáveis CSS globais + temas claro/escuro + estilos de scrollbar/checkbox
│  ├─ types/                      # Tipos compartilhados entre scripts
│  │  ├─ messages.ts              # Discriminated union dos 8 tipos de mensagem
│  │  ├─ rules.ts                 # RuleConfig / TechnologyRecord / PageDetectionResult
│  │  ├─ settings.ts              # DetectorSettings + CUSTOM_RULE_LIMITS
│  │  └─ popup.ts                 # PopupResult / PopupRawResult
│  └─ utils/                      # Helpers compartilhados entre três locais
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
│  ├─ icons/                      # PNGs 16/32/48/128
│  ├─ rules/                      # Arquivos JSON de regras
│  ├─ tech-links.json             # Mapeamento nome de tecnologia → link oficial (524 KB)
│  └─ injected/                   # Os dois IIFEs gerados por build:injected
├─ build-scripts/
│  └─ build-injected.mjs          # Compila os scripts de injeção com esbuild separadamente
├─ vite.config.ts                 # Build principal (CRXJS + Vue + TS) + plugin personalizado
├─ vite.injected.config.ts        # Build IIFE independente para scripts de injeção
├─ docs/                          # Este site de documentação (VitePress)
└─ dist/                          # Artefatos de build; carregue no Chrome
```

## Modelo de processos

A extensão Chrome usa quatro ambientes de execução; o StackPrism usa todos eles:

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. Service Worker (ESM module)                              │
│    src/background/*.ts                                       │
│    - Monitora cabeçalhos de resposta via chrome.webRequest  │
│    - Roteia mensagens via chrome.runtime.onMessage          │
│    - Armazena resultados de detecção em chrome.storage.session │
│    - Carrega rules/* e tech-links.json                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 2. Content Script (isolated world da página)                │
│    src/content/content-observer.ts                          │
│    - Coleta mudanças no DOM via MutationObserver            │
│    - Coleta carregamento de recursos via PerformanceObserver │
│    - Envia ao background via sendMessage após throttle de 800ms │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 3. Injected Script (MAIN world da página)                   │
│    dist/injected/page-detector.iife.js                      │
│    dist/injected/page-source-search.iife.js                 │
│    - Injetado sob demanda via chrome.scripting.executeScript │
│    - Consegue ler window.* / DOM real / globalKeys          │
│    - Retorna resultado após execução; não fica residente     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 4. Extension UI (popup / settings / help)                   │
│    src/ui/{popup,settings,help}/*.vue                       │
│    - Vue 3 + TS SPA                                         │
│    - Comunica com background via chrome.runtime.sendMessage │
│    - Lê/grava configurações via chrome.storage.sync        │
└─────────────────────────────────────────────────────────────┘
```

## Mensagens entre scripts

Os 8 tipos de mensagem são definidos como discriminated union em `src/types/messages.ts`; todas as chamadas passam pelo wrapper `sendMessage<M>()` em `src/utils/messaging.ts`.

| Mensagem                      | Direção       | Finalidade                                                      |
| ----------------------------- | ------------- | --------------------------------------------------------------- |
| `GET_HEADER_DATA`             | popup → bg    | Buscar registros de cabeçalhos de resposta                      |
| `GET_POPUP_RESULT`            | popup → bg    | Buscar cache leve (exibição principal do popup)                 |
| `GET_POPUP_RAW_RESULT`        | popup → bg    | Buscar dados brutos completos (dados brutos / feedback de erro) |
| `GET_TECH_LINK`               | popup → bg    | Consulta fallback do link oficial de uma tecnologia             |
| `START_BACKGROUND_DETECTION`  | popup → bg    | Botão "Atualizar" aciona detecção ativa                         |
| `GET_WORDPRESS_THEME_DETAILS` | bg interno    | Buscar cabeçalho do style.css do tema                           |
| `DYNAMIC_PAGE_SNAPSHOT`       | content → bg  | Content script reporta snapshots dinâmicos continuamente        |
| `PAGE_DETECTION_RESULT`       | injected → bg | page-detector retorna resultado após injeção                    |

## O problema dos dois caminhos do script injetado

`page-detector.ts` na implementação original era referenciado pelo background via `importScripts` e também serializado via `executeScript({world:'MAIN', func})`. Com ESM, `Function.prototype.toString` não consegue processar imports, então esse caminho não funciona.

Solução: usar `executeScript({files})` em vez de `{func}`. `page-detector.ts` é compilado de forma independente como um único arquivo IIFE (`vite.injected.config.ts`) e injetado por dois RPCs:

```ts
// 1. Grava nas variáveis globais temporárias
chrome.scripting.executeScript({
  target: { tabId },
  world: 'MAIN',
  func: rules => {
    window.__SP_RULES__ = rules
  },
  args: [pageRules]
})

// 2. Injeta o IIFE; o IIFE lê __SP_RULES__ internamente, limpa e retorna o resultado
chrome.scripting.executeScript({
  target: { tabId },
  world: 'MAIN',
  files: ['injected/page-detector.iife.js']
})
```

Com isso, o background não depende mais diretamente do page-detector e o service worker pode usar ESM module worker.

## Recursos estáticos

`public/rules/` e `public/tech-links.json` são copiados 1:1 para `dist/` pelo Vite; no runtime são carregados via `chrome.runtime.getURL` + `fetch`. Não use `import rules from '...'` para importar esses JSONs grandes diretamente — isso faria o Rollup incluí-los inline no bundle, tornando a inicialização a frio do service worker significativamente mais lenta.

Durante o build, dois plugins Vite processam esses JSONs:

1. `precompileRulesPlugin`: percorre recursivamente cada JSON de regras e injeta `__hints` (literais obrigatórias das regexes), `__legacyHints` (limiar de pré-filtragem da versão anterior, apenas para regras que precisam) e `__keywordCombined` (fonte regex combinada para regras do tipo keyword) em cada leaf rule
2. `minifyJsonAssets`: reescreve todos os JSONs com `JSON.stringify(parsed)` para remover indentação e espaços em branco

## Gerenciamento de estado

Sem Pinia. Motivo:

- Estado do popup: 6 campos
- Estado das configurações: 2 campos
- Popup e settings são páginas de extensão independentes (contextos chrome.runtime independentes); Pinia exigiria instanciação dupla
- O `DetectorSettings` compartilhado usa `chrome.storage.sync` como fonte de verdade com uma cópia local via `reactive()`

## Tema (claro/escuro)

`src/utils/theme.ts` gerencia `getStoredTheme / setStoredTheme / cycleTheme / themeLabel`, armazenados em `chrome.storage.sync.stackPrismTheme`; três estados: `auto` / `light` / `dark`.

`src/ui/tokens.css` usa `:root[data-theme='dark']` para forçar o modo escuro, `@media (prefers-color-scheme: dark) :root:not([data-theme='light'])` para seguir o sistema, e `color-scheme` para sincronizar a UI padrão do navegador.

A alternância de tema está disponível no popup e nas configurações; a sincronização entre páginas é feita via `chrome.storage.onChanged`.
