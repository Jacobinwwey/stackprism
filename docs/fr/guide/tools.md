# Outils auxiliaires

La popup comporte trois outils en bas : « Rechercher », « Indices bruts » et « Copier tout ». La recherche et les indices bruts ouvrent un panneau depuis le bas, occupant au maximum 60 % de la hauteur de la popup ; cliquer à nouveau sur le même bouton ou sur le bouton de fermeture du panneau le replie. « Copier tout » ne ouvre pas de panneau — il copie directement le rapport complet de la pile technologique dans le presse-papiers.

## Recherche dans le code source de la page

Cas d'usage : vous suspectez une détection incorrecte, ou vous voulez vérifier si une chaîne ou expression régulière particulière apparaît vraiment dans la page.

### Champ de saisie

Prend en charge le texte libre et les expressions régulières. Appuyez sur Entrée ou cliquez sur « Rechercher » pour lancer.

### Options

| Option               | Description                                                                 |
| -------------------- | --------------------------------------------------------------------------- |
| Respecter la casse   | Désactivé par défaut ; activé, `React` et `react` sont distincts            |
| Mot entier           | Applicable en mode texte libre ; exige des caractères non-mot autour (`\b`) |
| Expression régulière | Interprète la saisie comme la source d'une expression régulière JavaScript  |

### Résultat

Affiche :

- La requête, le motif, le type de source (HTML sérialisé ou outerHTML) et la longueur totale du source
- Nombre de correspondances (« 100+ » si trop nombreuses, avec les N premières affichées)
- Pour chaque correspondance : numéro de ligne, colonne, décalage de caractère, et un extrait de contexte (~60 caractères autour de la correspondance)

::: tip
La recherche sérialise le DOM de la page active avant de le parcourir, donc elle couvre les éléments cachés, les scripts inline et les commentaires. Ce n'est pas une recherche sur le source réseau — les modifications du DOM effectuées par des scripts après le chargement sont incluses.
:::

## Indices bruts

Cas d'usage :

- Consulter les données brutes complètes (tous les en-têtes de réponse / instantanés dynamiques / résultats bruts de détection de page, avant agrégation par l'extension)
- Joindre des preuves complètes à une issue
- Déboguer les correspondances de règles personnalisées

La sortie est un JSON complet dont la structure est la suivante :

```json
{
  "url": "https://example.com",
  "title": "Example",
  "generatedAt": "2026-05-10T10:00:00.000Z",
  "technologies": [/* liste dédupliquée et fusionnée */],
  "resources": {/* résumé des ressources */},
  "headers": {/* en-têtes de réponse du document principal */},
  "apiObservations": [/* url/headers/technologies de chaque réponse API */],
  "frameObservations": [/* idem pour chaque iframe */],
  "dynamicObservations": {/* scripts/styles/iframes/feedLinks/domMarkers collectés dynamiquement */},
  "notes": [/* quelques remarques méthodologiques */]
}
```

### Source → JSON scopé

Si vous voulez uniquement voir le sous-ensemble JSON d'**une technologie et d'une source** précises, inutile d'ouvrir l'intégralité des indices bruts — cliquez directement sur l'étiquette de source sous la carte de technologie (par exemple « En-têtes de réponse » ou « Surveillance dynamique · après interaction »). Le même panneau s'ouvre, mais n'affiche que les champs liés à cette source, et le tableau `technologies` ne contient que cette technologie.

Le titre du panneau devient alors « Indices bruts · React · En-têtes de réponse » pour indiquer la vue scopée. Cliquer sur « Indices bruts » dans la barre d'outils inférieure revient au JSON complet.

## Copier le rapport complet de la pile technologique

Le bouton « Copier tout » en bas de la popup copie dans le presse-papiers le rapport complet de la pile technologique de la page courante. Ce rapport contient :

- Un résumé Markdown lisible par un humain
- Un JSON structuré `stackprism.tech_stack_report.v1`
- L'URL, le titre, l'heure de génération, le nombre total de technologies, le nombre de ressources et le nombre d'en-têtes de réponse du document principal

Ce qui est copié correspond aux **résultats actuels de la popup** et n'est pas affecté par la vue « Essentiels » ou le filtre de catégorie ; les interrupteurs de catégories et la liste de blocage de la page de paramètres restent appliqués. Vous pouvez coller directement dans une issue, des notes, une entrée d'agent IA ou un outil texte externe.

Cas d'usage courants :

- Joindre le contexte complet de la pile technologique à une issue ou PR
- Enregistrer la pile technologique d'un site dans une documentation ou une base de connaissances
- Transmettre à un agent IA pour une analyse approfondie
