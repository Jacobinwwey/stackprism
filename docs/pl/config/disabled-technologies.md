# Zablokowane technologie

„Przełączniki kategorii" filtrują według kategorii. Jeśli chcesz zablokować tylko kilka konkretnych technologii bez wyłączania całej kategorii, użyj tego pola.

## Użycie

Wpisz jedną nazwę technologii w każdym wierszu. Nazwy nie rozróżniają wielkości liter, a spacje na początku i końcu są automatycznie usuwane:

```text
Google Analytics
百度统计
WordPress 插件: akismet
Cloudflare
```

Po zapisaniu te technologie nie będą pojawiać się w głównej liście okna podręcznego, niezależnie od kategorii, poziomu pewności ani źródła.

::: tip
Dopasowywanie nazw odbywa się przez `normalizeTechName(name)`: usuwa spacje, zamienia na małe litery, usuwa znaki interpunkcyjne. Dlatego `WordPress` i `wordpress` są równoważne, a `Google Analytics` i `google-analytics` są traktowane tak samo.
:::

## Kiedy blokować

- **Wiesz już, że dana strona używa jakiejś technologii i nie chcesz jej widzieć**: własna strona nie musi za każdym razem pokazywać Cloudflare / Vercel
- **Unikanie fałszywych alarmów**: dana reguła zbyt często generuje fałszywe alarmy, a ty nie chcesz czekać na poprawkę — tymczasowo ją zablokuj
- **Uproszczenie wyników**: zablokuj RSS / Atom / Service Worker / HTTPS, żeby lista była bardziej skupiona

## Priorytet blokowania względem przełączników kategorii

Obie metody **działają łącznie**: najpierw stosowane są przełączniki kategorii, potem lista zablokowanych.

## Relacja z surowymi wskazówkami

Zablokowane technologie są **tylko ukryte** — nie są usuwane z surowego JSON. Panel „Surowe wskazówki" nadal pokazuje kompletne dane, co pozwala je później zweryfikować.

## Przykład

Chcesz widzieć wszystkie CDN z wyjątkiem Cloudflare, ale zachować całą kategorię CDN. Wpisz:

```text
Cloudflare
```

Cloudflare nie będzie pojawiać się w oknie, natomiast Akamai, Fastly i inne CDN nadal będą widoczne.
