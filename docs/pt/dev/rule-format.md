# Formato dos arquivos de regras

Os arquivos JSON em `public/rules/` são divididos por direção de detecção. `public/rules/index.json` é o manifesto que lista os arquivos de regras a serem carregados durante o build e em runtime.

## Estrutura de nível superior

Cada JSON de regras tem aproximadamente esta forma (trecho):

```json
{
  "page": {
    "frontendFrameworks": {
      "defaults": { "category": "前端框架" },
      "rules": [
        {
          "defaults": { "confidence": "高" },
          "rules": [
            {
              "name": "React",
              "patterns": ["react(?:\\.production|\\.development)?(?:\\.min)?\\.js"],
              "globals": ["React"]
            },
            {
              "name": "Vue",
              "patterns": ["vue(?:\\.runtime)?(?:\\.global)?(?:\\.prod)?(?:\\.min)?\\.js"],
              "globals": ["Vue"],
              "selectors": ["[data-v-app]"]
            }
          ]
        }
      ]
    }
  }
}
```

- A chave de nível superior (como `page` / `headers`) corresponde ao módulo de detecção do background que a busca pelo nome
- A chave de segundo nível (como `frontendFrameworks` / `cdnProviders`) também é lida pelo nome
- Um objeto `{ defaults, rules }` representa um **grupo de regras** (rule group)
- Grupos podem ser aninhados; o nível mais interno é uma "leaf rule" (sem campo `rules`)

## Herança de defaults em grupos

`defaults` (também pode ser escrito como `$defaults`; os dois são equivalentes) é propagado para todas as leaf rules do grupo. Em aninhamento múltiplo, os valores internos sobrescrevem os externos. No resultado final expandido, cada leaf rule recebe `{ ...outerDefaults, ...innerDefaults, ...leafFields }`.

Exemplo:

```json
{
  "defaults": { "category": "前端框架" },
  "rules": [
    {
      "defaults": { "confidence": "高" },
      "rules": [{ "name": "React", "patterns": ["react.js"] }]
    }
  ]
}
```

Após expansão, a regra React equivale a:

```json
{
  "category": "前端框架",
  "confidence": "高",
  "name": "React",
  "patterns": ["react.js"]
}
```

## Campos de leaf rule

| Campo                   | Tipo                     | Descrição                                                                                                                                  |
| ----------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`                  | string                   | Nome exibido no popup                                                                                                                      |
| `category`              | string                   | Categoria; ordenada por `CATEGORY_ORDER`                                                                                                   |
| `kind`                  | string                   | Descrição do tipo; pode ser vazio. Aparece como prefixo nas evidências                                                                     |
| `confidence`            | `"高"` / `"中"` / `"低"` | Padrão: `"中"`                                                                                                                             |
| `matchType`             | `"keyword"` / `"regex"`  | Padrão: `"regex"` (usa diretamente `new RegExp(p, 'i')`)                                                                                   |
| `patterns`              | string[]                 | Regras de correspondência. O tipo keyword usa `escapeRegExp + RegExp`                                                                      |
| `selectors`             | string[]                 | Seletores CSS; uma correspondência resulta em alta confiança                                                                               |
| `globals`               | string[]                 | Nomes de variáveis globais (suporta aninhamento por ponto); uma correspondência resulta em alta confiança                                  |
| `classNames`            | string[]                 | Correspondência exata de classe no DOM resulta em alta confiança                                                                           |
| `classPrefixes`         | string[]                 | Classe no DOM começando com este prefixo resulta em alta confiança                                                                         |
| `cssVariables`          | string[]                 | Propriedades CSS customizadas da página; N correspondências acionam a regra, com `minCssVariableMatches`                                   |
| `minCssVariableMatches` | number                   | Padrão: 1                                                                                                                                  |
| `matchIn`               | string[]                 | Restringe onde os patterns são correspondidos: `url` / `resources` / `html` / `headers` / `dynamic`. Array vazio ou ausente significa tudo |
| `resourceOnly`          | boolean                  | Apenas correspondência por URL de recurso; ignora DOM / globals / selectors                                                                |
| `resourceHints`         | string[]                 | Fingerprints de pré-filtragem definidas manualmente. Patterns completos só rodam se o texto contiver um hint                               |
| `evidence`              | string                   | Texto de evidência fixo quando há correspondência; sobrescreve o padrão "recurso URL correspondendo / DOM correspondendo"                  |
| `url`                   | string                   | URL do site oficial ou repositório da tecnologia                                                                                           |

## Campos injetados automaticamente (buildtime)

O plugin `precompileRulesPlugin` em `vite.config.ts` injeta nas leaf rules:

| Campo               | Origem                                                                                                                                                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `__hints`           | Conjunto de literais obrigatórias da regex (`src/utils/rule-hints.ts`): o texto que pode ser correspondido pela pattern sempre contém pelo menos uma; usada apenas para ignorar regras impossíveis, não altera resultados |
| `__legacyHints`     | Limiar de pré-filtragem anterior a 1.3.79 (os 3 segmentos literais mais longos); escrito apenas para regras mais estritas que `__hints` e sem `resourceHints`, garantindo que os resultados de detecção não mudem         |
| `__keywordCombined` | Para matchType keyword, a fonte regex combinada de todos os patterns concatenados com `\|` após escape                                                                                                                    |

`__hints` escritos manualmente nos arquivos de regras são tratados como o limiar anterior dessa regra. Em runtime, `getRuleAutoHints(rule)` e `getCompiledCombinedPattern(rule)` leem esses campos primeiro; se ausentes, recalculam em runtime (regras personalizadas calculam apenas os literais obrigatórios, sem limiar antigo).

## Manifesto de arquivos de regras

`rules/index.json`:

```json
{
  "schemaVersion": 1,
  "files": [
    "page/feeds.json",
    "page/frontend-frameworks.json",
    "page/ui-frameworks.json",
    "page/build-runtime.json",
    "page/frontend-extra.json",
    "page/frontend-local-libraries.json",
    "page/frontend-cdn-libraries.json",
    "page/frontend-package-cdn-libraries.json",
    "page/frontend-regional-cdn-libraries.json",
    "page/wordpress-themes.json",
    "page/drupal-themes.json",
    "page/wordpress-plugins.json",
    "page/drupal-modules.json",
    "...",
    "headers/server-products.json",
    "headers/header-patterns.json",
    "headers/cdn-providers.json"
  ]
}
```

`page/*.json` serve o caminho de detecção de página (usado por page-detector + dynamic-snapshot); `headers/*.json` serve o caminho de detecção por cabeçalho de resposta (usado por headers.ts). Os dois caminhos são independentes, mas o formato dos campos das leaf rules é idêntico.

## Fluxo de carregamento

`src/background/rule-loader.ts`:

1. Faz fetch de `rules/index.json`
2. Faz fetch em paralelo de todos os JSONs em `files[]`
3. Cada JSON passa por `normalizeRuleValue` para expandir grupos recursivamente
4. `mergeRulePartial` mescla todas as chaves de cada arquivo em um único objeto
5. Retorna `RuleConfig`; cada módulo de detecção busca os arrays pelo nome da chave

## Onde modificar

- Alterar a regra de uma tecnologia específica: encontre o arquivo JSON da categoria correspondente e edite diretamente
- Adicionar nova categoria: adicione o arquivo em `rules/index.json` e garanta que o módulo do background leia pelo nome da chave (`loadTechRules` em `detector-settings.ts`)
- Edição em lote: escreva um script para gerar o JSON e sobrescreva o arquivo original
