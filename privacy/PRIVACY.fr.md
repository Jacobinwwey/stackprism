<div align="center">

[🇨🇳 简体中文](PRIVACY.zh-CN.md) · [🇬🇧 English](PRIVACY.en.md) · [🇹🇼 繁體中文](PRIVACY.zh-TW.md) · [🇯🇵 日本語](PRIVACY.ja.md) · **🇫🇷 Français** · [🇩🇪 Deutsch](PRIVACY.de.md) · [🇧🇷 Português](PRIVACY.pt.md) · [🇮🇹 Italiano](PRIVACY.it.md) · [🇨🇿 Čeština](PRIVACY.cs.md) · [🇵🇱 Polski](PRIVACY.pl.md)

</div>

# Politique de Confidentialité de StackPrism

Dernière mise à jour : 2026-05-12

## Aperçu

StackPrism / Stack Prism (ci-après « l'extension ») est une extension de navigateur basée sur Chrome / Edge Manifest V3 pour identifier les stacks technologiques des pages web. L'extension accorde une grande importance à votre vie privée — tout le traitement des données s'effectue localement dans votre propre navigateur, **aucune donnée n'est téléchargée, partagée ou vendue à quelque serveur distant que ce soit**.

## Données Accédées

Pour accomplir sa seule et unique fonction — « identifier la stack technologique utilisée par la page que vous consultez actuellement » — l'extension **lit localement** les informations suivantes lorsque vous accédez activement à une page web. Tout ce qui est lu **est traité uniquement dans la mémoire de votre navigateur ou dans chrome.storage** et ne quitte jamais votre navigateur.

### 1. Contenu du Site Web

- La structure des nœuds DOM, les noms de classes CSS, les variables CSS et les balises `<meta>` de la page que vous visitez actuellement
- Les noms de variables globales injectés par `<script>` sur l'objet `window` de la page (seuls les noms sont lus, pas les valeurs)
- Les URL des ressources JavaScript / CSS / iframe / image et autres ressources chargées par la page
- Les premiers octets des fichiers JavaScript **déjà chargés** par la page (depuis le cache du navigateur, sans générer de trafic réseau supplémentaire), utilisés pour identifier les commentaires de copyright `/*! @license ... */` et les URL d'entrée OAuth intégrées dans les SPA

### 2. Enregistrements Réseau

- L'URL et le titre de la page que vous visitez actuellement
- Les en-têtes de réponse des requêtes XHR / Fetch / iframe / WebSocket lancées par la page (champs Server, X-Powered-By, Set-Cookie, etc.)
- La version du protocole HTTP négociée par la page (HTTP/1.1 / HTTP/2 / HTTP/3)

## Utilisation des Données

Les données ci-dessus sont utilisées **uniquement** pour :

- Faire correspondre localement la bibliothèque de règles intégrée de l'extension afin d'identifier les frameworks frontend, les services backend, CDN, CMS, connexion, paiement, statistiques et autres stacks technologiques utilisés par la page
- Vous afficher les résultats d'identification dans le popup de l'extension

## Stockage des Données

- **Résultats d'identification** : stockés uniquement dans `chrome.storage.session`, détruits à la fermeture du navigateur, chaque onglet ayant son propre stockage indépendant
- **Vos paramètres** (catégories désactivées, noms de technologies en liste noire, règles personnalisées, préférences de thème, etc.) : stockés dans `chrome.storage.sync`, synchronisés de manière chiffrée par le navigateur vers votre compte Google / Microsoft ; l'extension **ne peut accéder** à aucune autre donnée de votre compte
- L'extension ne **stocke pas** le HTML complet de la page, les valeurs complètes des cookies, les identifiants de connexion, le contenu des formulaires remplis, les mots de passe ni aucune autre information sensible

## Transmission des Données

- L'extension **ne télécharge pas** vos données de navigation, vos résultats d'identification, vos informations personnelles ou toute autre donnée vers quelque serveur distant que ce soit
- Pas de télémétrie, pas de SDK publicitaire, pas d'analytique tiers, pas de rapport d'erreurs vers le cloud
- L'extension n'effectue que deux types de requêtes réseau, **aucune** ne transporte vos informations d'identité ou données de navigation :
  1. Récupération asynchrone des premiers segments de quelques fichiers JS **déjà chargés par la page que vous visitez actuellement** (depuis le cache du navigateur, sans générer de trafic réseau supplémentaire), pour scanner localement les commentaires de copyright dans ces JS et les URL d'entrée OAuth
  2. Les icônes des technologies sont **en priorité lues depuis la bibliothèque d'icônes intégrée à l'extension** (plus de 1300 SVG / PNG de technologies courantes déjà empaquetés hors ligne, sans aucune requête réseau) ; uniquement si une technologie ne figure pas dans la bibliothèque d'icônes intégrée, une requête de repli est effectuée depuis `cdn.simpleicons.org` (le corps de la requête ne contient qu'un slug de nom de technologie public, par exemple react / vuedotjs / docker, sans l'URL de la page visitée, les résultats d'identification ou toute information personnelle) ; si le CDN ne se charge pas dans les 2 secondes, l'extension revient automatiquement à un bloc de couleur avec initiale généré localement, sans jamais bloquer le processus d'identification

## Partage avec des Tiers

- L'extension **ne vend pas, ne partage pas et ne transfère pas** les données des utilisateurs à des tiers
- L'extension **n'utilise pas** les données des utilisateurs à des fins autres que « l'identification de la stack technologique »
- L'extension **n'est pas** utilisée à des fins de prêt, d'évaluation de crédit ou similaires

## Vos Droits

Vous pouvez à tout moment :

- Cliquer sur le bouton « Actualiser » dans le popup de l'extension pour rescanner la page actuelle
- Dans la page des paramètres de l'extension, réinitialiser le cache des règles, désactiver n'importe quelle catégorie, bloquer des noms de technologies spécifiques, ajouter des règles personnalisées
- Désinstaller l'extension dans `chrome://extensions` — toutes les données stockées localement seront automatiquement effacées par le navigateur

## Code Source Ouvert

L'extension est entièrement open source et n'importe qui peut auditer le code source pour confirmer les pratiques de confidentialité :

https://github.com/setube/stackprism

La licence open source est [MIT](https://opensource.org/licenses/MIT).

## Contact

Pour toute question relative à la confidentialité, veuillez contacter l'auteur via GitHub Issues :

https://github.com/setube/stackprism/issues

## Modifications de la Politique

La dernière version de cette politique de confidentialité est toujours publiée dans [PRIVACY.md](https://github.com/setube/stackprism/blob/main/PRIVACY.md) de ce dépôt. En cas de modifications importantes, la date de dernière mise à jour sera également actualisée.
