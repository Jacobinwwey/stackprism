# Utilisation de base

La popup a une hauteur fixe de 600 px et son contenu principal est la liste des technologies. En haut se trouvent les informations de la page courante et les contrôles de filtrage ; en bas, la recherche, les indices bruts et autres outils auxiliaires.

## Barre d'outils supérieure

```text
[StackPrism  URL de la page courante]    [Thème] [Paramètres] [Copier] [Actualiser]
```

- **À gauche** : nom de l'extension + numéro de version + URL de la page courante (tronquée, survol affiche l'URL complète)
- **À droite, quatre boutons icônes** :
  - **Thème** (soleil / lune / icône écran) : cycle entre les trois états « Auto / Clair / Sombre »
  - **Paramètres** : ouvre la page de paramètres (onglet séparé)
  - **Copier** : copie l'URL de la page courante dans le presse-papiers
  - **Actualiser** : demande au background de relancer la détection sur la page courante ; les résultats déjà en cache restent affichés

## Aperçu des données

```text
22 technologies    274 ressources    0 en-têtes de réponse
```

- **Technologies** : nombre total de technologies détectées, après dédoublonnage
- **Ressources** : nombre d'URL de ressources chargées par la page courante (scripts / styles / iframes / images, etc.)
- **En-têtes de réponse** : nombre d'en-têtes utiles extraits de la réponse du document principal

## Barre de filtrage par catégorie

```text
[ Essentiels 5  Tout 22 ]    [ Choisir une catégorie ▾ ]
```

- À gauche, un sélecteur de segment : « Essentiels » ne liste que les résultats à haute confiance, « Tout » liste l'ensemble
- À droite, un menu déroulant de catégories (24 catégories : frameworks frontend / frameworks UI / CDN / WAF / programmes de site / …). Choisir une catégorie spécifique n'affiche que les résultats de cette catégorie. Chaque option est suivie d'un compteur (par exemple « Programmes de site · 4 »)

## Liste des technologies

Chaque technologie est représentée par une carte :

```text
React                                         [Haute confiance]
- Le DOM contient un marqueur React Fiber
- L'URL de ressource correspond à cdn.example.com/react.production.min.js
Source : En-têtes de réponse  Surveillance dynamique
Détection incorrecte, cliquer pour corriger
```

- **Nom de la technologie** : cliquable, ouvre le site officiel ou le dépôt de la technologie (une icône de lien externe apparaît au survol)
- **Pastille de confiance** : Haute (vert) / Moyenne (jaune) / Faible (gris)
- **Preuves** : jusqu'à 4 lignes, montrant les fragments de DOM / ressources / en-têtes de réponse qui ont conduit à cette détection
- **Source** : chaque étiquette est cliquable ; **un clic ouvre un panneau en bas de la popup affichant uniquement les données JSON brutes de cette technologie et de cette source**
- **Bouton de correction** : ouvre un formulaire d'issue GitHub pré-rempli avec ce résultat de détection, pour faciliter le signalement de faux positifs ou de détections manquantes

::: tip
Si une page contient beaucoup de résultats, commencez par la vue « Essentiels ». Elle ne liste que les résultats à haute confiance ; pour vérifier les faux positifs ou consulter la pile technologique complète, passez ensuite à « Tout ».
:::

## Barre d'outils inférieure

```text
[Rechercher]  [Indices bruts]  [Copier tout]                      GitHub
```

Les boutons d'outils à gauche sont décrits dans [Outils auxiliaires](./tools.md). La recherche et les indices bruts ouvrent un panneau depuis le bas ; cliquer à nouveau sur le même bouton ou sur le bouton de fermeture du panneau le replie. « Copier tout » copie directement le rapport complet de la pile technologique dans le presse-papiers.

## Comportement de défilement

La popup entière conserve une hauteur fixe de 600 px ; seule la **zone de la liste des technologies** défile. La barre d'outils supérieure, l'aperçu et la barre de filtrage restent toujours visibles.

Lorsque le défilement de la liste dépasse environ 240 px, un bouton circulaire (flèche vers le haut) apparaît en bas à droite ; un clic ramène en douceur en haut de la liste.
