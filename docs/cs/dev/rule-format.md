# Formát souborů pravidel

JSON soubory v adresáři `public/rules/` jsou rozděleny podle zaměření detekce. Soubor `public/rules/index.json` je manifest uvádějící soubory pravidel, které se načítají při sestavení i za běhu.

## Struktura na nejvyšší úrovni

Typický JSON soubor pravidel vypadá takto (zkráceno):

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

- Klíč nejvyšší úrovně (např. `page` / `headers`) odpovídá způsobu, jakým si ho detekční moduly na pozadí načítají podle názvu
- Klíče druhé úrovně (např. `frontendFrameworks` / `cdnProviders`) se také načítají podle názvu
- Objekt `{ defaults, rules }` uvnitř představuje **skupinu pravidel** (rule group)
- Skupiny se mohou vnořovat; nejhlouběji jsou „listová pravidla" (leaf rules — nemají pole `rules`)

## Dědičnost výchozích hodnot skupin

Pole `defaults` (lze zapsat i jako `$defaults` — obě formy jsou ekvivalentní) se přenáší na všechna listová pravidla v dané skupině. Při vícenásobném vnoření jsou vnější hodnoty přepsány vnitřními. Při rozbalení každé listové pravidlo obdrží sloučení `{ ...outerDefaults, ...innerDefaults, ...leafFields }`.

Příklad:

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

Po rozbalení je pravidlo React ekvivalentní:

```json
{
  "category": "前端框架",
  "confidence": "高",
  "name": "React",
  "patterns": ["react.js"]
}
```

## Pole listových pravidel

| Pole                    | Typ                      | Popis                                                                                                                                 |
| ----------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                  | string                   | Název zobrazený ve vyskakovacím okně                                                                                                  |
| `category`              | string                   | Kategorie, řazena podle `CATEGORY_ORDER`                                                                                              |
| `kind`                  | string                   | Popis typu, může být prázdný. Zobrazí se jako předpona u důkazů                                                                      |
| `confidence`            | `"高"` / `"中"` / `"低"` | Výchozí hodnota: `"中"`                                                                                                               |
| `matchType`             | `"keyword"` / `"regex"`  | Výchozí hodnota: `"regex"` (přímé `new RegExp(p, 'i')`)                                                                              |
| `patterns`              | string[]                 | Pravidla shody. Typ keyword používá `escapeRegExp + RegExp`                                                                          |
| `selectors`             | string[]                 | CSS selektory — shoda automaticky znamená vysokou spolehlivost                                                                        |
| `globals`               | string[]                 | Názvy globálních proměnných (podporuje vnořování oddělené tečkou) — shoda automaticky znamená vysokou spolehlivost                    |
| `classNames`            | string[]                 | Přesná shoda s názvem třídy DOM — vysoká spolehlivost                                                                                 |
| `classPrefixes`         | string[]                 | Shoda s třídou DOM začínající daným prefixem — vysoká spolehlivost                                                                   |
| `cssVariables`          | string[]                 | Spuštění při shodě N CSS vlastních vlastností stránky; v kombinaci s `minCssVariableMatches`                                         |
| `minCssVariableMatches` | number                   | Výchozí hodnota: 1                                                                                                                    |
| `matchIn`               | string[]                 | Omezení porovnávání vzorů na konkrétní zdroje dat: `url` / `resources` / `html` / `headers` / `dynamic`. Prázdné pole / chybějící = vše |
| `resourceOnly`          | boolean                  | Prochází pouze URL zdrojů, přeskočí DOM / globals / selectors                                                                        |
| `resourceHints`         | string[]                 | Ručně zadané předfiltrovací otisky na straně obchodní logiky; plné porovnávání vzorů proběhne jen tehdy, pokud text obsahuje hint     |
| `evidence`              | string                   | Pevný text důkazů při shodě, přepíše výchozí „shoda URL zdroje / DOM shoda"                                                         |
| `url`                   | string                   | URL oficiálního webu nebo repozitáře technologie                                                                                     |

## Automaticky vkládaná pole (buildtime)

Plugin `precompileRulesPlugin` v `vite.config.ts` vkládá do každého listového pravidla při sestavení:

| Pole                | Původ                                                                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `__hints`           | Sada nutných literálů regulárního výrazu (`src/utils/rule-hints.ts`): text, který vzor dokáže zasáhnout, musí nutně obsahovat alespoň jeden z nich; slouží pouze k přeskočení pravidel, která nemohou zasáhnout — nemění výsledky |
| `__legacyHints`     | Předfiltrovací práh starší verze (3 nejdelší literální segmenty z 1.3.79 a dříve); zapisuje se pouze tam, kde je přísnější než `__hints` a kde chybí `resourceHints`, aby výsledky detekce zůstaly nezměněny |
| `__keywordCombined` | Pro matchType keyword: zdroj sloučeného regulárního výrazu ze všech escapovaných vzorů spojených `\|`                                       |

Ručně zapsané `__hints` v souborech pravidel jsou považovány za starší práh daného pravidla. Za běhu `getRuleAutoHints(rule)` a `getCompiledCombinedPattern(rule)` čtou tato pole přednostně; teprve při jejich absenci přejdou na výpočet za běhu (vlastní pravidla počítají pouze nutné literály, nemají starší práh).

## Manifest souborů pravidel

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

Soubory `page/*.json` obsluhují cestu detekce stránek (page-detector + dynamic-snapshot), soubory `headers/*.json` obsluhují cestu detekce hlaviček (headers.ts). Tyto dvě cesty jsou nezávislé, ale formát polí listových pravidel je totožný.

## Průběh načítání

`src/background/rule-loader.ts`:

1. načte `rules/index.json`
2. paralelně načte všechny JSON soubory z `files[]`
3. každý JSON prochází `normalizeRuleValue` pro rekurzivní rozbalení skupin
4. `mergeRulePartial` sloučí všechny klíče do jednoho velkého objektu
5. vrátí `RuleConfig`, ze které si jednotlivé detekční moduly berou pole podle klíče

## Kde provádět změny

- Úprava pravidel pro konkrétní technologii: najděte příslušný JSON soubor kategorie a upravte jej přímo
- Přidání nové kategorie: přidejte soubor do `rules/index.json` a ujistěte se, že příslušný modul na pozadí čte klíč (`loadTechRules` v `detector-settings.ts`)
- Hromadné změny: vygenerujte JSON skriptem a přepište původní soubor
