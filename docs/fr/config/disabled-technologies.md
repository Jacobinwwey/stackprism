# Bloquer des technologies

Les interrupteurs de catégories filtrent par catégorie ; si vous souhaitez masquer uniquement quelques technologies nommées sans désactiver toute une catégorie, utilisez ce champ de saisie.

## Utilisation

Une technologie par ligne, insensible à la casse, les espaces en début et fin de ligne sont supprimés automatiquement :

```text
Google Analytics
Baidu Statistics
WordPress Plugin: akismet
Cloudflare
```

Après sauvegarde, ces technologies n'apparaissent plus dans la liste principale de la popup, quelle que soit leur catégorie, leur niveau de confiance ou leur source.

::: tip
La correspondance des noms passe par `normalizeTechName(name)` : suppression des espaces, passage en minuscules, suppression de la ponctuation. Ainsi `WordPress` et `wordpress` sont équivalents, tout comme `Google Analytics` et `google-analytics`.
:::

## Cas d'usage typiques

- **Vous savez déjà qu'un site utilise une technologie et ne voulez plus la voir** : votre propre site n'a pas besoin d'afficher Cloudflare / Vercel à chaque fois
- **Éviter les faux positifs** : une règle de détection produit trop de faux positifs et vous ne voulez pas attendre un correctif — bloquez-la temporairement
- **Simplifier la sortie** : masquez RSS / Atom / Service Worker / HTTPS pour que la liste reste centrée sur l'essentiel

## Priorité entre blocage et interrupteurs de catégories

Les deux s'**additionnent** : le filtre par catégorie est appliqué en premier, puis le filtre par liste de blocage.

## Relation avec les indices bruts

Les technologies bloquées ne sont **que masquées** — elles ne sont pas supprimées du JSON brut. Le panneau « Indices bruts » affiche toujours les données complètes pour une vérification ultérieure.

## Exemple

Supposons que vous vouliez voir tous les CDN sauf Cloudflare, sans désactiver toute la catégorie CDN. Paramètre :

```text
Cloudflare
```

Cloudflare n'apparaît plus dans la popup, mais Akamai / Fastly et les autres CDN restent présents.
