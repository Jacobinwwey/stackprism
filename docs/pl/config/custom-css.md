# Niestandardowy styl okna

Na stronie ustawień znajduje się pole na niestandardowy CSS. Wpisany tu CSS jest zapisywany i wstrzykiwany do `<head>` okna podręcznego, strony ustawień i strony pomocy, nadpisując domyślne style.

## Przykład: bardziej wyraźne etykiety pewności

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

## Przykład: zmiana koloru akcentu

```css
:root {
  --accent: #d946ef;
  --accent-dark: #a21caf;
  --accent-soft: rgba(217, 70, 239, 0.1);
}
```

Segment, hover na linkach do technologii, przycisk odświeżania i inne elementy w oknie odwołują się do tych tokenów — zmiana kolorów zadziała wszędzie naraz.

## Przykład: powiększenie czcionki

```css
body {
  font-size: 15px;
}

.tech-name {
  font-size: 14px;
}
```

## Miejsce wstrzykiwania

Cały niestandardowy CSS trafia do tagu `<style id="stackPrismCustomCss">` z ustalonym ID, wstawianego na końcu `<head>`. Ponowne zapisanie zastępuje starą zawartość — bez duplikowania.

## Zakres

- Okno podręczne (popup)
- Strona ustawień (options page)
- Strona instrukcji obsługi (help page)

Nie wpływa na zwykłe strony internetowe — ten CSS działa tylko w obrębie własnego UI rozszerzenia.

## Wskazówka do debugowania

Otwórz okno podręczne lub stronę ustawień, kliknij prawym przyciskiem → Zbadaj element. W panelu Elements możesz zobaczyć wstrzyknięty tag style i sprawdzić, czy selektory działają poprawnie.

## Ograniczenia

- Limit długości: `CUSTOM_RULE_LIMITS.css` (domyślnie 10 000 znaków). Przekroczenie powoduje błąd zapisu.
- Niedozwolony `@import` zewnętrznych plików CSS — CSP rozszerzenia na to nie pozwala.
- Niedozwolone `url(...)` odwołujące się do zdalnych obrazów innych niż base64.
