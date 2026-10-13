# Build et publication

## Build local

```bash
pnpm install
pnpm run build
```

Chaîne de build :

1. `pnpm run build:injected` (`build-scripts/build-injected.mjs`) : esbuild compile `src/injected/page-detector.ts` et `page-source-search.ts` chacun en un fichier IIFE indépendant, avec sortie dans `public/injected/`
2. `vite build` (`@crxjs/vite-plugin`) : package background / popup / settings / help en quatre points d'entrée, avec sortie dans `dist/`
3. `precompileRulesPlugin` (hook `closeBundle` du plugin vite) : parcourt `dist/rules/*.json` et injecte `__hints` / `__legacyHints` / `__keywordCombined` dans chaque règle feuille
4. `minifyJsonAssets` (hook `closeBundle` du plugin vite) : réécrit tous les JSON avec `JSON.stringify(parsed)`, supprimant indentations et sauts de ligne

Le répertoire `dist/` final peut être chargé directement dans `chrome://extensions/` en mode développeur.

## Rechargement à chaud en développement

```bash
pnpm run dev
```

Serveur dev vite + HMR crxjs : les modifications dans `src/ui/**` (popup / page de paramètres / aide) se rechargent automatiquement. Les modifications dans `src/background/**` ou `src/content/**` (content script) nécessitent de cliquer sur le bouton de rechargement de la carte d'extension dans `chrome://extensions/`.

## Types et lint

```bash
pnpm run typecheck    # vue-tsc --noEmit, vérification stricte des types sur tout le projet
pnpm run lint         # eslint src
```

Avant de committer, lancez un formatage global :

```bash
npx prettier --write .
```

## Gestion des versions

Le champ `version` de `package.json` est la source de vérité. `@crxjs/vite-plugin` le synchronise automatiquement vers `dist/manifest.json`.

Les changements fonctionnels courants, les règles et les correctifs incrémentent le patch. Lorsque le patch atteint `99`, on passe au minor suivant — `1.1.100` n'est pas une version valide :

```bash
# 1.1.98 -> 1.1.99
# 1.1.99 -> 1.2.0
```

Seules les versions nécessitant une distribution font l'objet d'une GitHub Release : `x.y.0`, `x.y.10`, `x.y.20`, ..., `x.y.90`. Par exemple `1.2.0` et `1.2.10` déclenchent une release, mais `1.2.5` et `1.2.15` non.

```bash
# Après modification du numéro de version dans package.json
git add package.json
git commit -m "chore: bump 1.2.10"
git push origin main
```

## Workflow GitHub Release

`.github/workflows/release-extension.yml` se déclenche dans deux cas :

1. Publication d'une release dans l'interface GitHub (événement `release: published`)
2. Déclenchement manuel du workflow via Actions (`workflow_dispatch`, avec `release_tag` optionnel en entrée)

Ce que fait le workflow :

1. checkout + installation pnpm + Node 20
2. `pnpm install --frozen-lockfile`
3. `pnpm run build`
4. lit la `version` depuis `dist/manifest.json` et vérifie qu'elle correspond au tag de release
5. zip l'intégralité de `dist/` en `stackprism-v{ver}.zip` + sha256
6. **si le secret `EXTENSION_PRIVATE_KEY` est configuré**, signe également avec `npx crx3` pour produire `stackprism-v{ver}.crx` + sha256 ; sinon, cette étape est ignorée et seul le zip est produit
7. `gh release upload --clobber` téléverse tous les artefacts sur le tag de release
8. `actions/upload-artifact` conserve également une copie en tant qu'artifact

## Notes de publication

Les notes de publication sont préparées à partir du `git log --oneline vPREV..HEAD` entre le tag de release précédent et le commit courant — pas un simple copier-coller de la liste de commits. Elles sont organisées par catégories lisibles pour l'utilisateur, par exemple :

- Améliorations des règles
- Popup et page de paramètres
- Site de documentation
- Build et processus de publication

Les notes ne mentionnent pas les opérations locales de formatage, vérification de types, lint ou build.

## Clé de signature CRX

Avant la première publication, générez une clé privée RSA et configurez-la dans les secrets du dépôt GitHub.

### Générer la clé privée

```bash
openssl genrsa -out extension.pem 2048
```

::: warning
**Ne perdez jamais** `extension.pem` — si vous le perdez, régénérer une clé changera l'ID de l'extension (Chrome la traitera comme une extension différente). Faites-en une sauvegarde locale.
:::

### Configurer dans GitHub

1. Repository Settings → Secrets and variables → Actions → New repository secret
2. Name : `EXTENSION_PRIVATE_KEY`
3. Secret : collez le **contenu entier** du fichier `extension.pem` (y compris `-----BEGIN PRIVATE KEY-----` et `-----END PRIVATE KEY-----`)
4. Enregistrez

Le workflow utilisera automatiquement cette clé pour signer le crx.

### Si la clé n'est pas configurée

Le workflow continue de fonctionner, mais aucun fichier `.crx` ne sera produit. Les utilisateurs devront installer via le zip décompressé.

## Liste de vérification avant publication

- [ ] `npx prettier --write .` exécuté
- [ ] `pnpm run typecheck` réussi
- [ ] `pnpm run lint` réussi
- [ ] `pnpm run build` réussi
- [ ] Test manuel dans Chrome avec `dist/` chargé : ouverture de la popup, détection d'un site, actualisation, copie du rapport complet, ajout d'une règle dans la page de paramètres
- [ ] Numéro de version dans `package.json` mis à jour
- [ ] `git commit + push`
- [ ] Si la version correspond à un point de release, publiez la release dans l'interface GitHub (tag `v{version}`, aligné avec `package.json`)
- [ ] Attendez la fin du workflow de publication et vérifiez que les artefacts de release contiennent zip / crx et sha256

## Publier sur le Chrome Web Store

Le workflow ne publie pas automatiquement sur le Chrome Web Store — l'API publish de CWS nécessite un flux OAuth2 ; la publication est donc manuelle pour l'instant :

1. Préparez un zip du dossier `dist/` (identique à l'artefact zip du workflow)
2. [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) → Téléverser une nouvelle version
3. Remplissez les notes de changement et attendez la validation (généralement 1 à 3 jours ouvrés)
