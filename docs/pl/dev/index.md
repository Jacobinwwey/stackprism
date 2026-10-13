# Podręcznik deweloperski

Ta część dokumentacji jest przeznaczona dla osób, które chcą przejrzeć kod źródłowy, modyfikować reguły lub przesłać PR. Jeśli potrzebujesz tylko zainstalować rozszerzenie, wystarczy [Przewodnik użytkownika](/pl/guide/).

## Rozdziały

- [Przegląd architektury](./architecture.md) — struktura katalogów projektu, odpowiedzialności modułów, przepływ danych
- [Format pliku reguł](./rule-format.md) — organizacja JSON w `public/rules/`, zagnieżdżone grupy i dziedziczenie defaults
- [Przepływ detekcji](./detection-flow.md) — etapy od webRequest / wstrzykiwania na stronie do renderowania w oknie
- [Wkład w reguły](./contribute-rules.md) — jak dodawać nowe technologie do wbudowanego zestawu reguł
- [Budowanie i wydawanie](./release.md) — lokalne budowanie, pakowanie, podpisywanie crx, przepływ wydania

## Przegląd stosu technologicznego

Główna część projektu to Vite 8 + Vue 3 + TypeScript + `@crxjs/vite-plugin` 3.x. Skrypt tła to Manifest V3 ESM service worker; menedżerem pakietów jest bun.

Reguły są przechowywane w `public/rules/` i podzielone na wiele plików JSON według kierunku: reguły stron, reguły nagłówków odpowiedzi, ekosystem WordPress/Drupal itp. Podczas budowania reguły są wstępnie przetwarzane i wstrzykiwane są pola `__hints` / `__legacyHints` / `__keywordCombined` do przyspieszenia dopasowania.

## Często używane polecenia

```bash
bun install            # instalacja zależności
bun run dev            # uruchomienie serwera dev Vite z HMR dla rozszerzenia
bun run build          # budowanie do dist/, gotowe do załadowania w Chrome
bun run typecheck      # ścisłe sprawdzanie typów przez vue-tsc
bun run lint           # sprawdzanie ESLint
bun run docs:dev       # lokalne podgląd tej dokumentacji
bun run docs:build     # budowanie statycznej dokumentacji
```

W trybie dev strony rozszerzenia obsługują hot reload. Zmiany w popup / settings / help zazwyczaj odświeżają się automatycznie; po zmianach w `src/background/` lub content script należy ręcznie odświeżyć kartę rozszerzenia na `chrome://extensions/`.

## Wejścia Vue

Trzy niezależne wejścia SPA, każde budowane osobno:

| Wejście  | Plik                         | Opis                                                                 |
| -------- | ---------------------------- | -------------------------------------------------------------------- |
| popup    | `src/ui/popup/index.html`    | Małe okno 440px × 600px wyświetlane po kliknięciu ikony rozszerzenia |
| settings | `src/ui/settings/index.html` | Strona opcji otwierana z poziomu szczegółów rozszerzenia             |
| help     | `src/ui/help/index.html`     | Osobna karta z instrukcją obsługi                                    |

## Powiązane linki

- [Repozytorium GitHub](https://github.com/setube/stackprism)
- [Lista zgłoszeń](https://github.com/setube/stackprism/issues)
- [Lista wydań](https://github.com/setube/stackprism/releases)
