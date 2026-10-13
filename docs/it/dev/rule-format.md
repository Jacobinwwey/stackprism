# Formato dei file di regole

I file JSON in `public/rules/` sono suddivisi per direzione di rilevamento. `public/rules/index.json` è il manifesto che elenca i file di regole da caricare in fase di build e a runtime.

## Struttura di primo livello

Un tipico JSON di regole (estratto):

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

- Le chiavi di primo livello (es. `page` / `headers`) corrispondono ai moduli di rilevamento nel background che le recuperano per nome
- Le chiavi di secondo livello (es. `frontendFrameworks` / `cdnProviders`) sono anch'esse lette per nome
- Un oggetto `{ defaults, rules }` rappresenta un **gruppo di regole** (rule group)
- I gruppi si annidano; il livello più interno è la "regola foglia" (leaf rule, senza campo `rules`)

## Ereditarietà dei defaults nei gruppi

`defaults` (equivalente a `$defaults`) si propaga a tutte le leaf rule del gruppo. In caso di annidamento multiplo, il livello interno sovrascrive quello esterno. Al momento dell'espansione, ogni leaf rule riceve il risultato di `{ ...outerDefaults, ...innerDefaults, ...leafFields }`.

Esempio:

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

La regola React espansa equivale a:

```json
{
  "category": "前端框架",
  "confidence": "高",
  "name": "React",
  "patterns": ["react.js"]
}
```

## Campi della regola foglia

| Campo                   | Tipo                     | Descrizione                                                                                                     |
| ----------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------- |
| `name`                  | string                   | Nome visualizzato nel popup                                                                                     |
| `category`              | string                   | Categoria, ordinata da `CATEGORY_ORDER`                                                                         |
| `kind`                  | string                   | Descrizione del tipo, può essere vuota. Appare come prefisso nell'evidence                                      |
| `confidence`            | `"高"` / `"中"` / `"低"` | Predefinita `"中"`                                                                                              |
| `matchType`             | `"keyword"` / `"regex"`  | Predefinita `"regex"` (diretto `new RegExp(p, 'i')`)                                                            |
| `patterns`              | string[]                 | Pattern di matching. Tipo keyword usa `escapeRegExp + RegExp`                                                   |
| `selectors`             | string[]                 | Selettori CSS — corrispondenza = confidenza Alta                                                                |
| `globals`               | string[]                 | Nomi di variabili globali (supporta notazione punto per annidamento) — corrispondenza = confidenza Alta         |
| `classNames`            | string[]                 | Corrispondenza esatta di una classe nel DOM — confidenza Alta                                                   |
| `classPrefixes`         | string[]                 | Classe nel DOM con questo prefisso — confidenza Alta                                                            |
| `cssVariables`          | string[]                 | Proprietà CSS personalizzate della pagina: N corrispondenze attivano la regola, con `minCssVariableMatches`     |
| `minCssVariableMatches` | number                   | Predefinito 1                                                                                                   |
| `matchIn`               | string[]                 | Limita dove i patterns vengono cercati: `url` / `resources` / `html` / `headers` / `dynamic`. Vuoto = tutto     |
| `resourceOnly`          | boolean                  | Solo matching su URL risorsa, ignora DOM / globals / selectors                                                  |
| `resourceHints`         | string[]                 | Fingerprint di pre-filtro definiti manualmente. Il testo deve contenere almeno un hint per entrare nel matching |
| `evidence`              | string                   | Testo fisso dell'evidence alla corrispondenza, sovrascrive il default "URL risorsa / DOM corrispondente"        |
| `url`                   | string                   | URL del sito ufficiale o repository della tecnologia                                                            |

## Campi iniettati automaticamente (buildtime)

`precompileRulesPlugin` in `vite.config.ts` inietta in ogni leaf rule:

| Campo               | Origine                                                                                                                                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `__hints`           | Insieme di letterali necessari della regex (`src/utils/rule-hints.ts`): un testo che la pattern può colpire contiene almeno uno di questi; serve solo a saltare le regole impossibili, non altera i risultati |
| `__legacyHints`     | Soglia di pre-filtro di 1.3.79 e precedenti (i 3 frammenti letterali più lunghi); scritta solo per le regole più restrittive di `__hints` e senza `resourceHints`, garantisce invarianza dei risultati        |
| `__keywordCombined` | Per matchType keyword: sorgente regex combinata di tutti i patterns con escape uniti da `\|`                                                                                                                  |

I `__hints` scritti manualmente nel file di regole vengono trattati come soglia legacy di quella regola. A runtime `getRuleAutoHints(rule)` e `getCompiledCombinedPattern(rule)` leggono prima questi campi; se assenti, calcolano a runtime (le regole personalizzate calcolano solo i letterali necessari, senza soglia legacy).

## Manifesto dei file di regole

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

`page/*.json` serve il percorso di rilevamento pagina (usato da page-detector + dynamic-snapshot); `headers/*.json` serve il percorso di rilevamento intestazioni (usato da headers.ts). I due percorsi sono indipendenti ma il formato dei campi delle leaf rule è identico.

## Flusso di caricamento

`src/background/rule-loader.ts`:

1. fetch `rules/index.json`
2. fetch in parallelo tutti i JSON in `files[]`
3. ogni JSON viene processato da `normalizeRuleValue` che espande ricorsivamente i gruppi
4. `mergeRulePartial` fonde tutte le chiavi di ogni JSON in un unico oggetto
5. restituisce `RuleConfig`, che i moduli di rilevamento usano per accedere agli array per chiave

## Dove modificare

- Modificare la regola di rilevamento di una tecnologia specifica: trovare il file JSON della categoria corrispondente e modificarlo direttamente
- Aggiungere una nuova categoria: aggiungere il file in `rules/index.json` e assicurarsi che il modulo background corrispondente lo legga per chiave (`loadTechRules` in `detector-settings.ts`)
- Modifiche in blocco: generare il JSON con uno script e sovrascrivere il file originale
