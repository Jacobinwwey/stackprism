# Import / export JSON des règles

La dernière section de la page de paramètres affiche le JSON des règles personnalisées actuelles. Pratique pour la sauvegarde, la migration et l'édition en masse.

## Cas d'usage

- Migrer des règles personnalisées entre appareils ou comptes
- Sauvegarder les règles avec un outil de gestion de versions
- Édition en masse (rechercher/remplacer dans le champ de texte, plus rapide que modifier chaque règle dans le formulaire)
- Construire des tableaux de règles par programmation (générer des centaines de règles via un script)

## Structure des champs

Chaque règle est un objet :

```json
{
  "name": "MyCMS",
  "category": "Programmes de site",
  "kind": "CMS personnalisé",
  "confidence": "中",
  "matchType": "regex",
  "patterns": ["mycms-[0-9.]+\\.js", "X-Generator: MyCMS"],
  "selectors": ["[data-powered-by='mycms']"],
  "globals": ["MyCMS"],
  "matchIn": ["url", "resources", "html", "headers", "dynamic"],
  "url": "https://mycms.example.com"
}
```

| Champ        | Type                     | Requis       | Description                                                                                      |
| ------------ | ------------------------ | ------------ | ------------------------------------------------------------------------------------------------ |
| `name`       | string                   | Oui          | Nom affiché dans la popup                                                                        |
| `category`   | string                   |              | Catégorie ; par défaut `其他库` (Autres bibliothèques)                                           |
| `kind`       | string                   |              | Description du type ; par défaut `自定义规则` (Règle personnalisée)                              |
| `confidence` | `"高"` / `"中"` / `"低"` |              | Par défaut `"中"` (Moyenne)                                                                      |
| `matchType`  | `"keyword"` / `"regex"`  |              | Par défaut `"regex"`                                                                             |
| `patterns`   | string[]                 | Un des trois | Au moins un des trois champs (patterns / selectors / globals) doit être non vide                 |
| `selectors`  | string[]                 | Un des trois | Liste de sélecteurs CSS                                                                          |
| `globals`    | string[]                 | Un des trois | Liste de noms de variables globales (`window.x.y` s'écrit `x.y`)                                 |
| `matchIn`    | string[]                 |              | Combinaison quelconque de `url` / `resources` / `html` / `headers` / `dynamic` ; par défaut tout |
| `url`        | string                   |              | Doit commencer par `http(s)://` ; peut être vide                                                 |

## Boutons d'action

Deux boutons sont disponibles en haut à droite du titre :

- **Importer depuis JSON** : parse le contenu du champ de texte, et si la validation passe, **remplace entièrement** la liste de règles personnalisées actuelles (pas une fusion)
- **Formater** : parse puis réécrit le contenu avec `JSON.stringify(rules, null, 2)` pour un affichage indenté propre

## Antislash dans les chaînes

En JSON, les expressions régulières nécessitent un double échappement. Par exemple, pour correspondre à `\.js` :

```json
{
  "matchType": "regex",
  "patterns": ["\\.js$"]
}
```

Le parser JSON transforme `\\` en un seul `\`, l'extension reçoit `\.js$` et le passe à `new RegExp()` pour obtenir l'échappement du point.

## Validation atomique

Lors de l'import, le tableau entier est d'abord parsé ; si un champ d'une règle est invalide, l'import entier est rejeté (atomique) — il n'existe pas d'état intermédiaire où certaines règles seraient importées et d'autres non. Le message d'erreur indique le numéro de la règle et le champ problématique.

## Relation avec le formulaire

- Modification dans le formulaire → synchronisation automatique vers le champ JSON
- Modification dans le champ JSON → il faut cliquer sur « Importer depuis JSON » pour que les règles internes soient mises à jour
- Cliquer sur « Enregistrer les paramètres » sans importer conserve l'état de la dernière opération formulaire / import

## Limite de quantité

`CUSTOM_RULE_LIMITS.rules` est 100 par défaut. Un dépassement est rejeté. Voir [`src/types/settings.ts`](https://github.com/setube/stackprism/blob/main/src/types/settings.ts) pour toutes les limites :

| Champ                                                | Limite            |
| ---------------------------------------------------- | ----------------- |
| Nombre total de règles                               | 100               |
| name                                                 | 80 caractères     |
| category                                             | 40 caractères     |
| kind                                                 | 40 caractères     |
| Pattern / selector / global individuel               | 240 caractères    |
| Longueur des tableaux patterns / selectors / globals | 80 chacun         |
| Longueur du tableau matchIn                          | 8                 |
| url                                                  | 240 caractères    |
| customCss                                            | 10 000 caractères |
