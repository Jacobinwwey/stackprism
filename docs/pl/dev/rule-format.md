# Format pliku reguł

Pliki JSON w `public/rules/` są podzielone według kierunku detekcji. `public/rules/index.json` to manifest zawierający listę plików reguł ładowanych podczas budowania i w czasie działania.

## Struktura najwyższego poziomu

Przykładowy fragment pliku reguł:

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

- Klucz najwyższego poziomu (np. `page` / `headers`) odpowiada modułowi detekcji w background, który pobiera go według nazwy
- Klucz drugiego poziomu (np. `frontendFrameworks` / `cdnProviders`) jest również pobierany według nazwy
- Obiekt `{ defaults, rules }` reprezentuje **grupę reguł** (rule group)
- Grupy mogą być zagnieżdżane. Reguły w najgłębszej warstwie, bez pola `rules`, to „reguły liści" (leaf rules)

## Dziedziczenie defaults w grupach reguł

`defaults` (lub `$defaults` — oba są równoważne) są przekazywane do wszystkich reguł liści w danej grupie. W przypadku zagnieżdżania wartości zewnętrzne są nadpisywane przez wewnętrzne. Po rozwinięciu każda reguła liścia otrzymuje scalony wynik: `{ ...outerDefaults, ...innerDefaults, ...leafFields }`.

Przykład:

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

Po rozwinięciu reguła React jest równoważna:

```json
{
  "category": "前端框架",
  "confidence": "高",
  "name": "React",
  "patterns": ["react.js"]
}
```

## Pola reguł liści

| Pole                    | Typ                      | Opis                                                                                                               |
| ----------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `name`                  | string                   | Nazwa wyświetlana w oknie podręcznym                                                                               |
| `category`              | string                   | Kategoria sortowana przez `CATEGORY_ORDER`                                                                         |
| `kind`                  | string                   | Opis typu; może być pusty. Wyświetlany jako prefiks evidence                                                       |
| `confidence`            | `"高"` / `"中"` / `"低"` | Domyślnie `"中"`                                                                                                   |
| `matchType`             | `"keyword"` / `"regex"`  | Domyślnie `"regex"` (bezpośrednio `new RegExp(p, 'i')`)                                                           |
| `patterns`              | string[]                 | Reguły dopasowania. Typ keyword: `escapeRegExp + RegExp`                                                           |
| `selectors`             | string[]                 | Selektory CSS; trafienie oznacza wysoką pewność                                                                    |
| `globals`               | string[]                 | Nazwy zmiennych globalnych (obsługa zagnieżdżania przez kropkę); trafienie oznacza wysoką pewność                  |
| `classNames`            | string[]                 | Dokładne dopasowanie klasy CSS w DOM oznacza wysoką pewność                                                        |
| `classPrefixes`         | string[]                 | Klasa DOM zaczynająca się od tego prefiksu oznacza wysoką pewność                                                  |
| `cssVariables`          | string[]                 | Jeśli N właściwości niestandardowych CSS strony pasuje, wyzwala detekcję; konfigurowane przez `minCssVariableMatches` |
| `minCssVariableMatches` | number                   | Domyślnie 1                                                                                                        |
| `matchIn`               | string[]                 | Ogranicza `patterns` do konkretnych źródeł: `url` / `resources` / `html` / `headers` / `dynamic`. Pusta tablica lub brak = wszystkie |
| `resourceOnly`          | boolean                  | Tylko dopasowanie URL zasobów; pomija DOM / globals / selectors                                                    |
| `resourceHints`         | string[]                 | Ręcznie określone odciski palca do wstępnego filtrowania. Tekst musi zawierać jeden hint, aby przejść do pełnego dopasowania patterns |
| `evidence`              | string                   | Stały tekst evidence przy trafieniu; nadpisuje domyślny tekst „URL zasobu pasuje / dopasowanie DOM"                |
| `url`                   | string                   | URL oficjalnej strony lub repozytorium technologii                                                                 |

## Pola wstrzykiwane automatycznie (czas budowania)

Plugin `precompileRulesPlugin` w `vite.config.ts` wstrzykuje do każdej reguły liścia:

| Pole                | Źródło                                                                                                                           |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `__hints`           | Zbiór wymaganych literałów z wyrażeń regularnych (`src/utils/rule-hints.ts`): tekst trafiający w regułę musi zawierać jeden z nich; używane tylko do pomijania reguł, które nie mogą trafić — wynik się nie zmienia |
| `__legacyHints`     | Próg wstępnego filtrowania z wersji 1.3.79 i wcześniejszych (trzy najdłuższe segmenty literałowe); zapisywane tylko dla reguł bardziej restrykcyjnych niż `__hints` i bez `resourceHints`; gwarantuje niezmienność wyników |
| `__keywordCombined` | Dla reguł keyword: wszystkie patterns ze escape połączone przez `\|` jako źródło wyrażenia regularnego                           |

Ręcznie zapisane `__hints` w pliku reguł są traktowane jako stary próg dla tej reguły. W czasie działania `getRuleAutoHints(rule)` i `getCompiledCombinedPattern(rule)` odczytują najpierw te pola; jeśli brakuje, cofają się do obliczeń w czasie działania (reguły niestandardowe obliczają tylko wymagane literały, bez starego progu).

## Manifest plików reguł

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

Pliki `page/*.json` obsługują ścieżkę detekcji stron (page-detector + dynamic-snapshot). Pliki `headers/*.json` obsługują ścieżkę detekcji nagłówków (headers.ts). Oba są niezależne, ale format pól reguł liści jest identyczny.

## Przepływ ładowania

`src/background/rule-loader.ts`:

1. Pobierz `rules/index.json`
2. Równolegle pobierz wszystkie JSON z `files[]`
3. Każdy JSON jest rekurencyjnie rozwijany przez `normalizeRuleValue`
4. `mergeRulePartial` scala wszystkie klucze w jeden duży obiekt
5. Zwróć `RuleConfig`; moduły detekcji pobierają tablice według klucza

## Gdzie wprowadzać zmiany

- Zmiana reguły konkretnej technologii: znajdź odpowiedni plik JSON kategorii i edytuj bezpośrednio
- Dodawanie nowej kategorii: dodaj plik do `rules/index.json` i upewnij się, że odpowiedni moduł background pobiera go według klucza (`loadTechRules` w `detector-settings.ts`)
- Masowe zmiany: napisz skrypt generujący JSON i zastąp nim oryginalny plik
