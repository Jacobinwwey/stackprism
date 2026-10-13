# Rule File Format

JSON files under `public/rules/` are split by detection direction. `public/rules/index.json` is the manifest listing every file that needs to be loaded at build time and at runtime.

## Top-level Structure

A typical rule JSON looks like this (abbreviated):

```json
{
  "page": {
    "frontendFrameworks": {
      "defaults": { "category": "Frontend Frameworks" },
      "rules": [
        {
          "defaults": { "confidence": "high" },
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

- Top-level keys (e.g., `page` / `headers`) map to detection modules in the background that fetch them by name
- Second-level keys (e.g., `frontendFrameworks` / `cdnProviders`) are also fetched by name
- An object with `{ defaults, rules }` is a **rule group**
- Groups nest inside groups; the innermost objects without a `rules` field are **leaf rules**

## Rule Group defaults Inheritance

`defaults` (also written as `$defaults` — both are equivalent) propagates down to all leaf rules in that group. In nested groups, inner defaults override outer defaults. Each leaf rule ends up with `{ ...outerDefaults, ...innerDefaults, ...leafFields }`.

Example:

```json
{
  "defaults": { "category": "Frontend Frameworks" },
  "rules": [
    {
      "defaults": { "confidence": "high" },
      "rules": [{ "name": "React", "patterns": ["react.js"] }]
    }
  ]
}
```

After expansion, the React rule is equivalent to:

```json
{
  "category": "Frontend Frameworks",
  "confidence": "high",
  "name": "React",
  "patterns": ["react.js"]
}
```

## Leaf Rule Fields

| Field                   | Type                            | Description                                                                                                               |
| ----------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `name`                  | string                          | Name shown in the popup                                                                                                   |
| `category`              | string                          | Category, sorted by `CATEGORY_ORDER`                                                                                      |
| `kind`                  | string                          | Kind label, optional. Appears as evidence prefix.                                                                         |
| `confidence`            | `"high"` / `"medium"` / `"low"` | Defaults to `"medium"`                                                                                                    |
| `matchType`             | `"keyword"` / `"regex"`         | Defaults to `"regex"` (direct `new RegExp(p, 'i')`)                                                                       |
| `patterns`              | string[]                        | Match patterns. Keyword mode uses `escapeRegExp + RegExp`.                                                                |
| `selectors`             | string[]                        | CSS selectors; a match counts as high confidence                                                                          |
| `globals`               | string[]                        | Global variable names (supports dot-separated nesting); a match counts as high confidence                                 |
| `classNames`            | string[]                        | Exact DOM class match; counts as high confidence                                                                          |
| `classPrefixes`         | string[]                        | DOM class prefix match; counts as high confidence                                                                         |
| `cssVariables`          | string[]                        | Triggers when N of these CSS custom properties are present, combined with `minCssVariableMatches`                         |
| `minCssVariableMatches` | number                          | Defaults to 1                                                                                                             |
| `matchIn`               | string[]                        | Limit patterns to specific data sources: `url` / `resources` / `html` / `headers` / `dynamic`. Empty or absent means all. |
| `resourceOnly`          | boolean                         | Only match resource URLs; skip DOM / globals / selectors                                                                  |
| `resourceHints`         | string[]                        | Manually specified pre-filter fingerprints; the text must contain a hint before full pattern matching runs                |
| `evidence`              | string                          | Fixed evidence text displayed on a match, overriding the default "resource URL match / DOM match"                         |
| `url`                   | string                          | Tech official website or repository URL                                                                                   |

## Build-time Injected Fields

The `precompileRulesPlugin` in `vite.config.ts` injects these into every leaf rule at build time:

| Field               | Source                                                                                                                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `__hints`           | Required literal set from the regex (`src/utils/rule-hints.ts`): text matching any pattern must contain at least one hint — used only to skip impossible rules, never changes results                         |
| `__legacyHints`     | Pre-filter threshold from v1.3.79 and earlier (the three longest literal segments), written only for rules where this is stricter than `__hints` and `resourceHints` isn't set, to preserve identical results |
| `__keywordCombined` | For keyword-type rules, all patterns escaped and joined with `\|` into a single merged regex source                                                                                                           |

Manually written `__hints` in rule files are treated as old-format thresholds. At runtime, `getRuleAutoHints(rule)` and `getCompiledCombinedPattern(rule)` read these fields first and fall back to runtime calculation only when absent (custom rules only calculate required literals; they have no legacy threshold).

## Rule File Manifest

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

`page/*.json` serves the page detection path (used by page-detector and dynamic-snapshot). `headers/*.json` serves the response header detection path (used by headers.ts). The two paths are independent, but leaf rule field formats are identical.

## Loading Flow

`src/background/rule-loader.ts`:

1. Fetch `rules/index.json`
2. Fetch all JSON files in `files[]` in parallel
3. Run `normalizeRuleValue` recursively on each file to expand groups
4. `mergeRulePartial` merges all keys into one large object
5. Return `RuleConfig`; each detection module reads its slice by key

## Where to Make Changes

- Change detection for a specific technology: find the corresponding category JSON and edit it directly
- Add a new category: add the file to `rules/index.json` and make sure the background module reads it by key (via `loadTechRules` in `detector-settings.ts`)
- Large-scale bulk edits: write a script to generate JSON and overwrite the file
