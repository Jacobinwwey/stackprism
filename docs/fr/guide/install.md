# Installation

StackPrism est destiné aux navigateurs basés sur Chromium (Chrome, Edge, Brave, Opera, Vivaldi, Arc, etc.) avec support de Manifest V3.

## Méthode 1 : télécharger le fichier crx depuis les Releases

1. Ouvrez [GitHub Releases](https://github.com/setube/stackprism/releases)
2. Choisissez la dernière version et téléchargez `stackprism-v{version}.crx`
3. Dans la barre d'adresse du navigateur, entrez `chrome://extensions/` (ou `edge://extensions/` sur Edge) et activez le « Mode développeur » en haut à droite
4. Faites glisser le fichier `.crx` téléchargé dans la page des extensions
5. Confirmez « Ajouter l'extension » dans la boîte de dialogue

::: tip
Chrome bloque parfois l'installation par glisser-déposer d'un fichier .crx (message « Impossible d'ajouter une application, une extension ou un script utilisateur depuis ce site web »). Dans ce cas, utilisez la méthode 2.
:::

## Méthode 2 : télécharger le zip depuis les Releases et charger le dossier décompressé

1. Ouvrez [GitHub Releases](https://github.com/setube/stackprism/releases) et téléchargez `stackprism-v{version}.zip`
2. Décompressez l'archive dans un répertoire stable (**ne supprimez pas ce dossier — l'extension en dépend pour fonctionner**)
3. Ouvrez `chrome://extensions/` et activez le « Mode développeur »
4. Cliquez sur « Charger l'extension non empaquetée »
5. Sélectionnez le dossier décompressé

## Méthode 3 : construire depuis les sources

Recommandée pour les développeurs ou ceux qui souhaitent suivre la branche principale.

```bash
git clone https://github.com/setube/stackprism.git
cd stackprism
pnpm install
pnpm run build
```

Les artefacts de construction se trouvent dans `dist/`. Chargez le répertoire `dist/` en mode développeur depuis `chrome://extensions/`.

Après toute modification du code source, relancez `pnpm run build` puis cliquez sur le bouton de rechargement de la carte de l'extension dans `chrome://extensions/`.

## Activation et permissions

Lors de la première installation, les permissions suivantes sont demandées :

| Permission   | Utilisation                                                          |
| ------------ | -------------------------------------------------------------------- |
| `tabs`       | Lire l'URL et le titre de l'onglet actif                             |
| `activeTab`  | Injecter les scripts de détection dans la page active               |
| `scripting`  | Injecter page-detector / page-source-search dans le monde MAIN       |
| `storage`    | Stocker les paramètres, mettre en cache les résultats et les thèmes  |
| `webRequest` | Intercepter les en-têtes de réponse (server, x-powered-by, etc.)     |
| `<all_urls>` | Fonctionner sur toutes les pages http(s)                             |

La détection ne repose sur aucune API externe : les fichiers de règles sont embarqués avec l'extension et les résultats ne circulent que dans la mémoire du navigateur et le storage de l'extension.

## Désinstallation

Rendez-vous dans `chrome://extensions/`, trouvez StackPrism et cliquez sur « Supprimer ». Les paramètres et le cache sont effacés en même temps.
