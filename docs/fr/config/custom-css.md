# Personnaliser le style de la popup

La page de paramètres contient un champ de saisie CSS personnalisé. Le CSS saisi ici est injecté dans le `<head>` de la popup, de la page de paramètres et de la page d'aide après sauvegarde, pour remplacer les styles par défaut.

## Exemple : rendre les pastilles de confiance plus visibles

```css
.confidence.high {
  background: #14532d;
  color: #fff;
  font-weight: 700;
}

.confidence.medium {
  background: #ca8a04;
  color: #fff;
}
```

## Exemple : changer la couleur d'accent

```css
:root {
  --accent: #d946ef;
  --accent-dark: #a21caf;
  --accent-soft: rgba(217, 70, 239, 0.1);
}
```

Le segment, le survol des liens de technologies et le bouton d'actualisation de la popup référencent tous ces tokens — ils changeront tous en même temps.

## Exemple : augmenter la taille de police

```css
body {
  font-size: 15px;
}

.tech-name {
  font-size: 14px;
}
```

## Emplacement d'injection

Tout le CSS personnalisé est placé dans une balise `<style id="stackPrismCustomCss">` fixe, insérée à la fin du `<head>`. Une nouvelle sauvegarde remplace l'ancien contenu — il n'est pas ajouté en double.

## Périmètre d'application

- Popup
- Page de paramètres (options page)
- Page d'aide

Ce CSS n'affecte pas les pages web normales — il n'est actif qu'à l'intérieur de l'interface propre à l'extension.

## Conseils de débogage

Ouvrez la popup ou la page de paramètres, puis faites un clic droit → Inspecter. Le panneau Elements permet de voir la balise style injectée et de vérifier si vos sélecteurs correspondent.

## Limitations

- Longueur maximale : `CUSTOM_RULE_LIMITS.css` (10 000 caractères par défaut) — la sauvegarde échoue en cas de dépassement
- Les fichiers CSS externes ne peuvent pas être importés (`@import` est interdit par la CSP de l'extension)
- `url(...)` ne peut pas référencer des images distantes autres que du base64
