# Vlastní styl vyskakovacího okna

Na stránce nastavení je textové pole pro vlastní CSS. CSS zapsané zde se po uložení vloží do `<head>` vyskakovacího okna, stránky nastavení a stránky nápovědy a přepíše výchozí styly.

## Příklad: výraznější indikátory spolehlivosti

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

## Příklad: změna barvy zvýraznění

```css
:root {
  --accent: #d946ef;
  --accent-dark: #a21caf;
  --accent-soft: rgba(217, 70, 239, 0.1);
}
```

Segment, hover nad technologickými odkazy, tlačítko obnovení a další prvky ve vyskakovacím okně tyto tokeny používají — změna se projeví všude najednou.

## Příklad: zvětšení písma

```css
body {
  font-size: 15px;
}

.tech-name {
  font-size: 14px;
}
```

## Místo vložení

Veškeré vlastní CSS se umístí do tagu `<style id="stackPrismCustomCss">` s pevným ID a vloží se na konec `<head>`. Opětovné uložení nahradí starý obsah — nedochází k opakovanému přidávání.

## Rozsah platnosti

- Vyskakovací okno (popup)
- Stránka nastavení (options page)
- Stránka nápovědy (help page)

Nemá žádný vliv na běžné webové stránky — toto CSS působí pouze v rámci vlastního uživatelského rozhraní rozšíření.

## Tipy pro ladění

Otevřete vyskakovací okno nebo stránku nastavení a klikněte pravým tlačítkem → Prozkoumat. V panelu Elements lze vidět vložený tag style a snadno ověřit, zda selektor odpovídá.

## Omezení

- Maximální délka je `CUSTOM_RULE_LIMITS.css` (výchozí hodnota 10 000 znaků); při překročení se uložení nezdaří
- Nelze vkládat externí CSS soubory (nelze použít `@import`), protože to CSP rozšíření nedovoluje
- Nelze použít `url(...)` pro vzdálené obrázky jiné než v kódování base64
