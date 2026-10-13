# Manuel du développeur

Cette section est destinée aux personnes qui souhaitent explorer le code source, modifier des règles ou soumettre une PR. Si vous souhaitez uniquement installer l'extension, le [Guide d'utilisation](/fr/guide/) suffit.

## Chapitres

- [Architecture](./architecture.md) — structure des répertoires du projet, responsabilités des modules, flux de données
- [Format des règles](./rule-format.md) — organisation des JSON dans `public/rules/`, héritage des groupes imbriqués + defaults
- [Flux de détection](./detection-flow.md) — étapes de webRequest / injection de page jusqu'au rendu de la popup
- [Contribuer des règles](./contribute-rules.md) — comment ajouter une nouvelle technologie aux règles intégrées
- [Build et publication](./release.md) — build local, packaging, signature crx, workflow de publication

## Aperçu de la pile technique

Le projet repose sur Vite 8 + Vue 3 + TypeScript + `@crxjs/vite-plugin` 3.x. Le script background est un ESM service worker Manifest V3, et le gestionnaire de paquets est bun.

Les règles se trouvent dans `public/rules/` et sont réparties en plusieurs fichiers JSON selon leur domaine : règles de page, règles d'en-têtes de réponse, écosystèmes WordPress / Drupal, etc. Lors du build, les règles sont prétraitées pour injecter les champs `__hints` / `__legacyHints` / `__keywordCombined` qui accélèrent la correspondance.

## Commandes de développement courantes

```bash
bun install            # installer les dépendances
bun run dev            # démarrer le serveur vite dev avec rechargement à chaud de l'extension
bun run build          # construire dans dist/, chargeable dans Chrome
bun run typecheck      # vérification stricte des types avec vue-tsc
bun run lint           # vérification ESLint
bun run docs:dev       # prévisualisation locale de ce site de documentation
bun run docs:build     # build statique du site de documentation
```

En mode dev, l'extension supporte le rechargement à chaud. Les modifications de popup / settings / help se rechargent généralement automatiquement ; les modifications de `src/background/` ou des content scripts nécessitent un rechargement manuel de la carte d'extension dans `chrome://extensions/`.

## Points d'entrée Vue

Trois SPA indépendantes, construites séparément sans interférence :

| Point d'entrée | Fichier                      | Description                                                                |
| -------------- | ---------------------------- | -------------------------------------------------------------------------- |
| popup          | `src/ui/popup/index.html`    | Fenêtre de 440 × 600 px qui s'ouvre en cliquant sur l'icône de l'extension |
| settings       | `src/ui/settings/index.html` | Page d'options accessible depuis les détails dans `chrome://extensions/`   |
| help           | `src/ui/help/index.html`     | Page d'aide indépendante ouverte depuis la page de paramètres              |

## Liens utiles

- [Dépôt GitHub](https://github.com/setube/stackprism)
- [Liste des issues](https://github.com/setube/stackprism/issues)
- [Liste des releases](https://github.com/setube/stackprism/releases)
