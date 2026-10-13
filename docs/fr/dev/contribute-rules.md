# Contribuer des règles

## Deux approches

1. **Retour rapide** : cliquez sur « Détection incorrecte, cliquer pour corriger » sur la carte de la technologie concernée dans la popup. Cela ouvre automatiquement une issue GitHub pré-remplie avec le contexte (URL de la page, résultat de correspondance de règle courant, version de l'extension). Le mainteneur ajustera la règle à réception.
2. **PR directe** : forkez le dépôt, éditez le JSON correspondant dans `public/rules/`, vérifiez localement et soumettez une PR.

La suite détaille le flux de la PR directe.

## Trouver le bon fichier

`public/rules/` est découpé par responsabilité :

| Fichier                              | Contenu                                                   |
| ------------------------------------ | --------------------------------------------------------- |
| `page/frontend-frameworks.json`      | React / Vue / Angular / divers frameworks frontend        |
| `page/ui-frameworks.json`            | Tailwind / Bootstrap / Element / Antd et autres UI        |
| `page/build-runtime.json`            | Webpack / Vite / Rollup / Bun et autres outils de build   |
| `page/frontend-cdn-libraries.json`   | Bibliothèques frontend nommées chargées via CDN           |
| `page/wordpress-plugins.json`        | 4 500+ plugins WordPress                                  |
| `page/drupal-modules.json`           | 4 000+ modules Drupal                                     |
| `page/cms-themes.json`               | Thèmes CMS                                                |
| `page/website-programs.json`         | WordPress / Drupal / Discuz! et autres CMS                |
| `page/payment-systems.json`          | Plateformes de paiement                                   |
| `page/third-party-logins.json`       | Connexions tierces                                        |
| `page/saas-services.json`            | SaaS (Sentry / Mixpanel / Intercom, etc.)                 |
| `page/analytics-providers.json`      | Statistiques et analytique                                |
| `page/cdn-providers.json`            | CDN (détection côté runtime frontend)                     |
| `headers/server-products.json`       | Produits serveurs identifiés par l'en-tête `Server:`      |
| `headers/cdn-providers.json`         | CDN identifiés par les en-têtes de réponse                |
| `headers/website-programs.json`      | CMS identifiés par les en-têtes de réponse                |
| ...                                  |                                                           |

Liste complète dans `public/rules/index.json`.

## Exemple minimal pour ajouter une nouvelle règle

Supposons que vous vouliez ajouter la détection d'ExampleCMS. Dans `page/website-programs.json`, trouvez le groupe approprié (par exemple « CMS auto-hébergés ») et ajoutez :

```json
{
  "name": "ExampleCMS",
  "url": "https://examplecms.example.com",
  "patterns": ["examplecms-[0-9.]+\\.min\\.js", "/_examplecms/"],
  "globals": ["ExampleCMS"],
  "selectors": ["[data-powered-by='examplecms']"]
}
```

La signification des champs est décrite dans [Format des règles](./rule-format.md).

## Dans quel groupe ?

Ouvrez le fichier JSON correspondant — vous verrez une structure de groupes imbriqués :

```json
{
  "page": {
    "websitePrograms": {
      "defaults": { "category": "网站程序" },
      "rules": [
        {
          "defaults": { "confidence": "高" },
          "rules": [
            // CMS nommés à haute confiance
          ]
        },
        {
          "defaults": { "confidence": "中" },
          "rules": [
            // CMS à confiance moyenne
          ]
        }
      ]
    }
  }
}
```

Placez la règle dans le sous-groupe de confiance qui correspond à votre estimation de la fiabilité de la détection. L'ordre dans le tableau `rules` d'un groupe n'affecte pas les résultats de détection, seulement l'ordre de parcours lors du débogage.

## Valider la règle

Après modification :

```bash
pnpm run build
```

Le build lance `precompileRulesPlugin` qui injecte les champs `__hints` et autres dans les règles. Chargez ensuite `dist/` dans `chrome://extensions/` et vérifiez sur un vrai site ExampleCMS.

Vous pouvez aussi utiliser le panneau « Règles personnalisées » pour écrire la règle d'abord au niveau de la configuration utilisateur, valider son efficacité, puis la transférer dans `public/rules/`.

## Réduire les faux positifs

- **Préférez les globals** : une correspondance sur `window.X` est la plus fiable, quasi sans faux positifs
- **Préférez les sélecteurs exclusifs** : `[data-powered-by='examplecms']`, `[ng-version]` — des attributs clairement écrits par la technologie cible
- **Patterns de ressources : utilisez le domaine complet ou le chemin complet** : `cdn.examplecms.com/sdk.js` est plus fiable qu'`examplecms`
- **classNames / classPrefixes : ajoutez un préfixe** : `example-cms-` plutôt que `cms-`, pour éviter les collisions avec d'autres projets utilisant `cms-`
- **Ancrez les regex** : `^/_examplecms/` est plus précis que `/_examplecms/`
- **Soyez conservateur sur la confiance** : en cas de doute, utilisez « Moyenne » — la popup affiche une pastille jaune plutôt que verte, ce qui évite d'induire l'utilisateur en erreur

## Processus pour contribuer au dépôt principal

1. Forkez [setube/stackprism](https://github.com/setube/stackprism)
2. Clonez localement, lancez `pnpm install` puis `pnpm run build` pour vérifier que le build fonctionne
3. Trouvez le fichier correspondant dans `public/rules/` et ajoutez la règle
4. Récupérez 2 à 3 preuves depuis [Wappalyzer rules](https://github.com/enthec/webappanalyzer), le site officiel ou la documentation, et incluez-les dans la description de la PR
5. Soumettez la PR sur la branche `main`

La description de la PR doit au minimum indiquer : les technologies ajoutées, les pages utilisées pour valider, et pourquoi ces caractéristiques ne risquent pas de produire des faux positifs sur d'autres sites.
