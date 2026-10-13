# Interpréter les résultats

## Niveau de confiance

Chaque technologie est accompagnée d'une pastille de confiance à trois niveaux :

| Niveau     | Couleur | Signification                                                                                                         |
| ---------- | ------- | --------------------------------------------------------------------------------------------------------------------- |
| **Haute**  | Vert    | Signal fort détecté : variable globale (ex. `window.React`), sélecteur DOM exclusif, URL de ressource explicite (ex. `/_next/`) |
| **Moyenne**| Jaune   | Signal moyen : correspondance floue d'en-tête de réponse, préfixe de classe CSS, ensemble de variables CSS            |
| **Faible** | Gris    | Signal faible : nom de fichier script générique en dernier recours (ex. `*.min.js`), expression régulière floue       |

Dans l'onglet « Essentiels », seuls les résultats à haute confiance sont affichés par défaut.

## Preuves

Chaque carte affiche jusqu'à 4 lignes de preuves. Les preuves courantes incluent des marqueurs DOM, des URL de ressources, des en-têtes de réponse et des enregistrements de chargement dynamique, par exemple :

```text
- Le DOM contient un marqueur React Fiber
- URL de ressource correspondant à unpkg.com/react@18.2.0/umd/react.production.min.js
- En-tête de réponse X-Powered-By: Next.js
```

En cas de faux positif, commencez par examiner les preuves. Elles indiquent généralement si le problème provient d'une règle sur les ressources, d'une règle sur les en-têtes de réponse ou d'une correspondance DOM / classe trop large.

## Source

L'étiquette de source indique d'où provient ce résultat :

| Étiquette de source             | Provenance                                                              |
| ------------------------------- | ----------------------------------------------------------------------- |
| `En-têtes de réponse`           | En-têtes HTTP du document principal (server / x-powered-by / set-cookie, etc.) |
| `En-têtes de réponse · API`     | En-têtes de réponse d'une requête XHR / fetch de la page courante       |
| `En-têtes de réponse · iframe`  | En-têtes de réponse du document principal d'un iframe imbriqué          |
| `Surveillance dynamique`        | Ressources / scripts chargés dynamiquement collectés par le content script + MutationObserver |
| `Surveillance dynamique · après interaction` | Ressources chargées après une action utilisateur (popup, connexion, paiement) |
| `Thème WordPress`               | Reconstruction depuis le header style.css du thème                      |

**Cliquer sur n'importe quelle étiquette de source** ouvre un panneau depuis le bas affichant le sous-ensemble JSON brut correspondant à **cette technologie et cette source**. Vous obtenez directement les en-têtes de réponse bruts, la liste des URL de ressources ou un instantané dynamique, sans avoir à parcourir le JSON complet.

## Tri

Ordre de tri par défaut :

1. Index de catégorie (frameworks frontend → frameworks UI → runtime de build → CDN → …)
2. Au sein d'une catégorie, par ordre décroissant de confiance (haute → moyenne → faible)
3. À confiance égale, par ordre alphabétique `localeCompare` du nom de technologie

Lors du passage à une catégorie spécifique, le tri s'applique uniquement à cette catégorie. L'onglet « Essentiels » liste toutes les technologies à haute confiance ; si aucune n'existe, il prend les 30 premières technologies toutes confiances confondues, par ordre décroissant.

## Déduplication

Si une même technologie est détectée depuis plusieurs sources (par exemple, React apparaît à la fois dans les en-têtes de réponse et dans le DOM), elle ne s'affiche qu'une seule fois — les entrées sont fusionnées, le niveau de confiance le plus élevé est retenu, les tableaux de preuves sont fusionnés et dédupliqués, et le tableau `sources` liste toutes les sources correspondantes.

## Absence de détection ≠ absence d'utilisation

L'outil détecte ce que **la page web expose au navigateur**. Si un site :

- Supprime toutes les traces de runtime après le SSR (ex. un site Astro en rendu statique)
- Efface tous les en-têtes de réponse personnalisés
- Hashe les noms de fichiers bundle sans conserver le nom du framework d'origine

L'extension peut ne détecter que très peu de choses, voire rien. Ce n'est généralement pas une lacune dans les règles, mais simplement le fait que la page n'expose pas suffisamment d'indices au navigateur.

Les indices du build frontend ne sont pas équivalents au runtime côté serveur. Par exemple, la présence de `/_next/`, `/_nuxt/` ou d'artefacts Vite indique uniquement la chaîne de build frontend — cela ne permet pas de déduire directement que le serveur tourne sous Node.js. Le langage backend se détermine habituellement par les en-têtes `Server`, `X-Powered-By`, les noms de cookies ou les en-têtes de réponse propres au framework.

## Bouton de correction

Le bouton « Détection incorrecte, cliquer pour corriger » sur chaque carte ouvre une issue GitHub pré-remplie avec :

- L'URL de la page courante
- Le JSON de ce résultat de détection
- Les preuves affichées
- Le numéro de version de l'extension

Dans la description, indiquez simplement « ce qui est incorrect » ou « ce qui devrait être détecté ». Le mainteneur ajustera la règle correspondante dans le répertoire [`rules/`](https://github.com/setube/stackprism/tree/main/public/rules).
