# Guide de configuration

La page de paramètres est accessible via le bouton « Paramètres » en haut de la popup, ou depuis la fiche StackPrism dans `chrome://extensions/` via « Détails → Options de l'extension ».

La page de paramètres est divisée en cinq sections :

- [Interrupteurs de catégories](./categories.md) — activer/désactiver chacune des 24 catégories (les technologies de la catégorie désactivée ne s'affichent plus dans la popup)
- [Bloquer des technologies](./disabled-technologies.md) — masquer des technologies précises par leur nom, indépendamment de leur catégorie
- [Personnaliser le style de la popup](./custom-css.md) — écrire du CSS pour remplacer les styles par défaut de la popup / page de paramètres
- [Règles personnalisées](./custom-rules.md) — ajouter ses propres règles de détection via un formulaire ou du JSON
- [Import / export JSON des règles](./json-export.md) — synchroniser les règles entre navigateurs / appareils

## Emplacement de stockage de la configuration

Toute la configuration est stockée dans `chrome.storage.sync` et se synchronise entre appareils via votre compte Google / Edge connecté. La clé est `stackPrismSettings`. Pour désactiver la synchronisation, désactivez la synchronisation du navigateur lui-même.

La capacité de `chrome.storage.sync` est limitée à 100 Ko, avec 8 Ko maximum par clé. Cela signifie :

- Le nombre de règles personnalisées est limité (environ 100 règles en sécurité)
- La longueur du CSS personnalisé est limitée (10 000 caractères maximum)
- La liste de blocage ne peut pas être trop longue

Les limites effectives sont définies par `CUSTOM_RULE_LIMITS` dans `src/types/settings.ts` ; en cas de dépassement, la sauvegarde échoue avec un message d'erreur.

## Quand les modifications prennent-elles effet ?

| Modification                                                           | Prise d'effet                                                            |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Interrupteurs de catégories / technologies bloquées / CSS personnalisé | À la prochaine ouverture de la popup                                     |
| Règles personnalisées                                                  | Après sauvegarde, à la prochaine actualisation + réouverture de la popup |
| Import JSON                                                            | Idem                                                                     |

Après avoir cliqué sur « Enregistrer les paramètres », l'écriture dans le storage est immédiate — inutile de recharger la page de paramètres.
