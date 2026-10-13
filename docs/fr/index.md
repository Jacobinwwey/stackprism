---
layout: home

hero:
  name: StackPrism
  text: Inspecteur de technologies web
  tagline: Ouvrez la popup de l'extension pour voir les indices de frameworks, CDN, CMS, statistiques, connexions, paiements et SaaS exposés par la page courante. Chaque résultat inclut une preuve et une source pour évaluer sa fiabilité.
  image:
    src: /icon.svg
    alt: StackPrism
  actions:
    - theme: brand
      text: Installation
      link: /fr/guide/install
    - theme: alt
      text: Voir sur GitHub
      link: https://github.com/setube/stackprism/blob/main/i18n/README.fr.md

features:
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'/></svg>"
    title: Base de règles locale
    details: Les règles sont embarquées avec l'extension. L'URL, les ressources, le DOM, les en-têtes de réponse et les ressources dynamiques sont tous analysés en local, sans compte ni API externe.
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z'/></svg>"
    title: Popup avec cache prioritaire
    details: Le background prépare un résultat léger à l'avance. À l'ouverture de la popup, les résultats importants du cache s'affichent en premier ; le JSON brut et les liens de technologies sont chargés à la demande.
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z'/></svg>"
    title: Règles personnalisées
    details: Ajoutez vos propres règles par mots-clés, expressions régulières, sélecteurs CSS ou variables globales depuis la page de paramètres, pour couvrir les sites non pris en charge par les règles intégrées.
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'/></svg>"
    title: Résultats traçables
    details: Nom de technologie, niveau de confiance, preuves et source sont regroupés sur une même carte. En cas de faux positif, dépliez la source correspondante pour accéder directement aux données brutes.
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12.67 19a2 2 0 0 0 1.416-.586l6.13-6.13a4.992 4.992 0 0 0 .832-2.65V5l-3 1.5L17.97 5h-1.97a4.992 4.992 0 0 0-2.65.832l-6.13 6.13a2 2 0 0 0-.586 1.416v3.288c0 .53.211 1.04.586 1.415l1.456 1.456c.375.375.884.586 1.414.586h3.287Z'/><path d='M16 8 2 22'/><path d='M17.5 15H9'/></svg>"
    title: Sortie filtrable
    details: Les interrupteurs de catégories, la liste de blocage et la vue « Essentiels » réduisent le bruit. Les données complètes restent accessibles dans les indices bruts pour une consultation ultérieure.
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m18 16 4-4-4-4'/><path d='m6 8-4 4 4 4'/><path d='m14.5 4-5 16'/></svg>"
    title: Règles auditables
    details: Les règles intégrées sont organisées par fichiers JSON par catégorie. Ajouter une nouvelle détection nécessite généralement d'ajouter une règle accompagnée de quelques preuves reproductibles.
---

## Qu'est-ce que c'est

StackPrism est une extension Chromium MV3. Elle ne « voit pas à travers » le serveur — elle organise uniquement les indices visibles par le navigateur : ressources scripts et styles, marqueurs DOM, variables globales, en-têtes de réponse, ressources chargées dynamiquement, feuilles de style de thème WordPress, etc.

Chaque résultat est annoté avec un **niveau de confiance**, des **preuves** et une **source**. Si un résultat semble incorrect, consultez d'abord les preuves, puis cliquez sur la source pour déplier le JSON brut correspondant.

## Par où commencer

- Première installation : voir [Installation](/fr/guide/install.md)
- Résultats incompréhensibles : voir [Interpréter les résultats](/fr/guide/results.md)
- Filtrer le bruit ou ajouter des règles : voir [Guide de configuration](/fr/config/)
- Modifier les règles intégrées : voir [Format des règles](/fr/dev/rule-format.md) et [Contribuer des règles](/fr/dev/contribute-rules.md)

## Limites de précision

Les résultats ne sont pas un rapport d'audit. Si un site masque ses en-têtes, hashe tous ses noms de ressources ou supprime les traces de framework après le SSR, l'extension ne peut produire que très peu de résultats, voire aucun.

Le parti pris de ce projet est d'exposer autant que possible les bases du jugement, afin que l'utilisateur sache « pourquoi la détection a donné ce résultat ». Les règles sont continuellement améliorées, mais les suppositions de faible qualité ne seront jamais présentées comme des conclusions certaines.
