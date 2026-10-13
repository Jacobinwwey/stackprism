# Règles personnalisées

Les règles personnalisées servent à couvrir les sites non pris en charge par les règles intégrées, ou à valider localement une nouvelle règle avant de la soumettre.

## Remplissage du formulaire

| Champ                  | Requis | Description                                                                                                          |
| ---------------------- | ------ | -------------------------------------------------------------------------------------------------------------------- |
| **Nom de la technologie** | Oui | Nom affiché dans la popup, par exemple `MyCMS`                                                                       |
| **Catégorie**          |        | Choisissez une catégorie intégrée (23 au total) ou saisissez-en une nouvelle. Par défaut « Autres bibliothèques ». Le composant Select accepte la saisie libre. |
| **Description du type** |       | Commentaire pour vous-même, ex. `CMS d'entreprise`, `Paiement tiers`. S'affiche en préfixe dans les preuves ; peut être vide. |
| **Niveau de confiance** |       | Haute / Moyenne / Faible, par défaut « Moyenne »                                                                     |
| **Mode de correspondance** |    | Mots-clés / Expression régulière, par défaut « Expression régulière »                                               |
| **URL officielle / dépôt** |    | Doit commencer par `http://` ou `https://`. Une fois renseignée, le nom de la technologie dans la popup est cliquable. |

Quatre zones supplémentaires sont disponibles en dessous :

- **Périmètre de correspondance** : détermine dans quelles sources de données les patterns / selectors / globals seront cherchés
  - URL de la page : adresse de la page web courante
  - URL des ressources : ressources chargées (scripts / styles / iframes)
  - DOM / Source : outerHTML de la page
  - En-têtes de réponse : document principal + API + iframes
  - Ressources dynamiques : ressources accumulées en continu par MutationObserver

- **Règles de correspondance (patterns)** : une par ligne. En mode mots-clés : correspondance de sous-chaîne littérale. En mode expression régulière : source JS de la regex (sans les délimiteurs `/.../i`, le flag `i` est ajouté automatiquement par l'extension)

- **Sélecteurs CSS (selectors)** : un par ligne, ex. `[data-v-app]`, `#__next`. Le périmètre doit inclure « DOM / Source »

- **Variables globales (globals)** : une par ligne, ex. `React`, `Vue.config`, `__NEXT_DATA__`. Une correspondance garantit un niveau de confiance Haute

## Ajouter / Mettre à jour

- **Ajouter une règle** (bouton principal vert) : enregistre le formulaire courant comme nouvelle règle
- **Mettre à jour la règle courante** : cliquez d'abord sur « Éditer » sur une règle existante dans la liste en bas à droite pour passer en « mode édition », puis sauvegardez

Il est ensuite nécessaire de cliquer sur « Enregistrer les paramètres » en haut à droite de la page pour écrire les règles dans le storage.

## Liste des règles ajoutées

Affichée en bas de la page, chaque règle indique :

- Titre : nom de la technologie
- Métadonnées : catégorie · type · confiance · mode · N patterns
- Actions : boutons « Éditer » et « Supprimer » (le bouton Supprimer vire au rouge au survol)

## Validation des règles

À chaque ajout / mise à jour / sauvegarde, les vérifications suivantes sont effectuées :

- Le nom est obligatoire
- Au moins un des champs patterns / selectors / globals doit être renseigné
- Au moins une option du périmètre doit être cochée
- Si le champ url est renseigné, il doit commencer par `http(s)://`
- En mode expression régulière, chaque pattern doit passer `new RegExp` sans erreur
- Chaque selector doit passer `document.createDocumentFragment().querySelector` sans erreur
- Chaque global doit respecter la syntaxe de variable à points, ex. `MyCMS` ou `google.maps`

En cas d'échec de validation, une bulle rouge apparaît et liste jusqu'à 6 problèmes.

## Exemple : mots-clés simples

Détecter ExampleCMS :

```text
Nom de la technologie : ExampleCMS
Catégorie :            Programmes de site
Mode :                 Mots-clés
Règles de correspondance :
  examplecms
  X-Generator: ExampleCMS
Périmètre : [x] URL page [x] URL ressources [x] DOM / Source [x] En-têtes de réponse
```

## Exemple : détecter un thème WordPress

```text
Nom de la technologie : Thème WordPress: oceanwp
Catégorie :            Thèmes / Modèles
Mode :                 Mots-clés
Règles de correspondance :
  /wp-content/themes/oceanwp/
Périmètre : [x] URL ressources [x] DOM / Source
```

## Exemple : détecter un SDK de paiement chargé dynamiquement

Le script de paiement n'est chargé qu'après un clic sur le bouton — cochez donc « Ressources dynamiques » :

```text
Nom de la technologie : ExamplePay
Catégorie :            Systèmes de paiement
Description du type :  Paiement tiers
Mode :                 Mots-clés
Règles de correspondance :
  pay.example.com
  examplepay-sdk
Périmètre : [x] Ressources dynamiques
```

## Exemple : détecter une bibliothèque versionnée avec une regex

```text
Nom de la technologie : ExampleLib
Catégorie :            Bibliothèques frontend
Mode :                 Expression régulière
Règles de correspondance :
  examplelib-[0-9.]+\.min\.js
Périmètre : [x] URL ressources [x] Ressources dynamiques
```

## Réduire les faux positifs

- Évitez les mots-clés trop génériques comme `app`, `main`, `login` — presque tous les sites en contiennent
- Préférez le **domaine complet** `pay.example.com` plutôt que `pay`
- Préférez les **chemins spécifiques** `/wp-content/themes/oceanwp/` plutôt que `oceanwp`
- En cas de doute, choisissez un niveau de confiance « Faible » — la popup affiche alors une pastille grise pour signaler que c'est une supposition
- Après avoir sauvegardé une règle, **rechargez toujours la page cible** avant de rouvrir la popup ; sinon l'ancien cache est encore affiché
