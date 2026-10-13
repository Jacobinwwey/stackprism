# Format des règles

Les fichiers JSON dans `public/rules/` sont organisés par direction de détection. `public/rules/index.json` est le manifeste listant les fichiers de règles à charger lors du build et à l'exécution.

## Structure de premier niveau

Un fichier de règles ressemble à ceci (extrait) :

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

- La clé de premier niveau (ex. `page` / `headers`) correspond au module de détection du background qui la charge par nom
- La clé de deuxième niveau (ex. `frontendFrameworks` / `cdnProviders`) est également lue par nom
- Un objet de la forme `{ defaults, rules }` représente un **groupe de règles** (rule group)
- Les groupes peuvent s'imbriquer ; les objets les plus internes sans champ `rules` sont des « règles feuilles » (leaf rules)

## Héritage des defaults dans les groupes

`defaults` (ou `$defaults`, les deux sont équivalents) est propagé vers le bas à toutes les règles feuilles du groupe. En cas d'imbrication, les valeurs internes écrasent les externes. Après expansion, chaque règle feuille reçoit le résultat de `{ ...outerDefaults, ...innerDefaults, ...leafFields }`.

Exemple :

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

Après expansion, la règle React est équivalente à :

```json
{
  "category": "前端框架",
  "confidence": "高",
  "name": "React",
  "patterns": ["react.js"]
}
```

## Champs d'une règle feuille

| Champ                   | Type                     | Description                                                                                                                 |
| ----------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `name`                  | string                   | Nom affiché dans la popup                                                                                                   |
| `category`              | string                   | Catégorie, triée par `CATEGORY_ORDER`                                                                                       |
| `kind`                  | string                   | Description du type, optionnel. S'affiche en préfixe dans les preuves                                                       |
| `confidence`            | `"高"` / `"中"` / `"低"` | Par défaut `"中"`                                                                                                           |
| `matchType`             | `"keyword"` / `"regex"`  | Par défaut `"regex"` (passe directement à `new RegExp(p, 'i')`)                                                             |
| `patterns`              | string[]                 | Règles de correspondance. En mode keyword : `escapeRegExp + RegExp`                                                         |
| `selectors`             | string[]                 | Sélecteurs CSS ; une correspondance implique une haute confiance                                                            |
| `globals`               | string[]                 | Noms de variables globales (notation pointée supportée) ; une correspondance implique une haute confiance                   |
| `classNames`            | string[]                 | Correspondance exacte d'un class name dans le DOM ; haute confiance                                                         |
| `classPrefixes`         | string[]                 | Correspondance d'un class name commençant par ce préfixe dans le DOM ; haute confiance                                      |
| `cssVariables`          | string[]                 | Propriétés CSS personnalisées de la page — N correspondances déclenchent la règle, combiné avec `minCssVariableMatches`     |
| `minCssVariableMatches` | number                   | Par défaut 1                                                                                                                |
| `matchIn`               | string[]                 | Limite les patterns aux sources : `url` / `resources` / `html` / `headers` / `dynamic`. Tableau vide / absent = toutes      |
| `resourceOnly`          | boolean                  | Ne fait correspondre que les URL de ressources, ignore DOM / globals / selectors                                            |
| `resourceHints`         | string[]                 | Empreintes de pré-filtrage définies manuellement ; la correspondance complète n'est tentée que si le texte contient un hint |
| `evidence`              | string                   | Texte de preuve fixe à l'affichage, remplace le texte par défaut « URL de ressource correspondante / correspondance DOM »   |
| `url`                   | string                   | URL du site officiel ou du dépôt de la technologie                                                                          |

## Champs injectés automatiquement (buildtime)

Le plugin `precompileRulesPlugin` dans `vite.config.ts` injecte ces champs dans chaque règle feuille lors du build :

| Champ               | Provenance                                                                                                                                                                                                     |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `__hints`           | Ensemble de littéraux requis des expressions régulières (`src/utils/rule-hints.ts`) : sert uniquement à ignorer les règles impossibles à faire correspondre, sans modifier les résultats                       |
| `__legacyHints`     | Seuil de pré-filtrage des versions ≤ 1.3.79 (les 3 segments littéraux les plus longs) ; uniquement pour les règles plus strictes que `__hints` et sans `resourceHints`, pour garantir des résultats identiques |
| `__keywordCombined` | Source de la regex combinée pour les règles de type keyword : tous les patterns sont échappés et joints avec `\|`                                                                                              |

Les champs `__hints` écrits manuellement dans les fichiers de règles sont traités comme l'ancien seuil de cette règle. À l'exécution, `getRuleAutoHints(rule)` et `getCompiledCombinedPattern(rule)` lisent ces champs en priorité ; en leur absence, le calcul est effectué au runtime (les règles personnalisées ne calculent que les littéraux requis, sans ancien seuil).

## Manifeste des fichiers de règles

`rules/index.json` :

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

Les fichiers `page/*.json` servent le chemin de détection des pages (utilisés par page-detector + dynamic-snapshot) ; les fichiers `headers/*.json` servent le chemin de détection des en-têtes (utilisés par headers.ts). Les deux chemins sont indépendants, mais le format des champs des règles feuilles est identique.

## Flux de chargement

`src/background/rule-loader.ts` :

1. fetch `rules/index.json`
2. fetch en parallèle tous les JSON listés dans `files[]`
3. chaque JSON est récursivement expansé par `normalizeRuleValue`
4. `mergeRulePartial` fusionne toutes les clés de chaque JSON dans un objet global
5. retourne `RuleConfig`, utilisé par chaque module de détection pour lire les tableaux par clé

## Où modifier

- Modifier la règle de détection d'une technologie existante : trouvez le fichier JSON de la catégorie correspondante et éditez-le directement
- Ajouter une nouvelle catégorie : ajoutez le fichier dans `rules/index.json` et vérifiez que le module background correspondant le lit par clé (`loadTechRules` dans `detector-settings.ts`)
- Modification en masse : générez le JSON par script et écrasez le fichier d'origine
