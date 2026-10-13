# Budowanie i wydawanie

## Lokalne budowanie

```bash
bun install
bun run build
```

Łańcuch budowania:

1. `bun run build:injected` (`build-scripts/build-injected.mjs`): esbuild kompiluje `src/injected/page-detector.ts` i `page-source-search.ts` jako oddzielne pliki IIFE do `public/injected/`
2. `vite build` (`@crxjs/vite-plugin`): pakuje cztery wejścia — background / popup / settings / help — do `dist/`
3. `precompileRulesPlugin` (hook `closeBundle` pluginu Vite): skanuje `dist/rules/*.json` i dla każdej reguły liścia wstrzykuje `__hints` / `__legacyHints` / `__keywordCombined`
4. `minifyJsonAssets` (hook `closeBundle` pluginu Vite): wszystkie pliki JSON są przepisywane przez `JSON.stringify(parsed)`, usuwając wcięcia i białe znaki

Gotowy katalog `dist/` można bezpośrednio załadować w trybie dewelopera na stronie `chrome://extensions/`.

## Tryb deweloperski z hot reload

```bash
bun run dev
```

Serwer deweloperski Vite + HMR crxjs: zmiany w `src/ui/**` (okno podręczne / ustawienia / instrukcja obsługi) są automatycznie podstawiane bez przeładowania. Po zmianach w `src/background/**` lub `src/content/**` należy kliknąć przycisk odświeżania na karcie rozszerzenia w `chrome://extensions/`.

## Sprawdzanie typów i linting

```bash
bun run typecheck    # vue-tsc --noEmit, ścisłe sprawdzanie typów w całym projekcie
bun run lint         # eslint src
```

Przed zatwierdzeniem zmian uruchom formatowanie dla całego projektu:

```bash
npx prettier --write .
```

## Zarządzanie numerem wersji

Pole `version` w `package.json` jest źródłem prawdy. `@crxjs/vite-plugin` automatycznie synchronizuje go z `dist/manifest.json`.

Zwykłe zmiany funkcjonalności, reguł i poprawki zwiększają patch. Po osiągnięciu `99` przez patch następuje przejście do kolejnego minor — numer `1.1.100` nie jest używany:

```bash
# 1.1.98 -> 1.1.99
# 1.1.99 -> 1.2.0
```

GitHub Release jest tworzony tylko dla wersji wymagających nowej paczki instalacyjnej: `x.y.0`, `x.y.10`, `x.y.20`, ..., `x.y.90`. Na przykład `1.2.0` i `1.2.10` wymagają wydania, natomiast `1.2.5` i `1.2.15` — nie.

```bash
# po zmianie wersji w package.json
git add package.json
git commit -m "chore: bump 1.2.10"
git push origin main
```

## Przepływ wydania na GitHub

`.github/workflows/release-extension.yml` jest wyzwalany w dwóch sytuacjach:

1. Opublikowanie release w interfejsie GitHub (zdarzenie `release: published`)
2. Ręczne uruchomienie workflow_dispatch na stronie Actions (opcjonalne podanie `release_tag`)

Przepływ wydania:

1. checkout + instalacja bun + Node 20
2. `bun install --frozen-lockfile`
3. `bun run build`
4. Odczyt wersji z `dist/manifest.json`, weryfikacja zgodności z tagiem release
5. Spakowanie całego `dist/` do `stackprism-v{ver}.zip` + sha256
6. **Jeśli skonfigurowano sekret `EXTENSION_PRIVATE_KEY`**: podpisanie pliku `stackprism-v{ver}.crx` przez `npx crx3` + sha256; w przeciwnym razie krok pomijany, wysyłany tylko zip
7. `gh release upload --clobber` — przesłanie wszystkich artefaktów do tagu release
8. `actions/upload-artifact` — kopia zapasowa artefaktu

## Informacje o wydaniu

Informacje o wydaniu są przygotowywane na podstawie `git log --oneline vPREV..HEAD` od poprzedniego tagu release do bieżącego commitu — nie przez bezpośrednie wklejenie listy commitów. Zmiany są pogrupowane w sposób zrozumiały dla użytkownika, np.:

- Ulepszenia reguł
- Okno podręczne i strona ustawień
- Dokumentacja
- Proces budowania i wydawania

Informacje o wydaniu opisują tylko zmiany istotne dla użytkowników i opiekunów. Nie zawierają wzmianek o lokalnym formatowaniu, sprawdzaniu typów, lintingu ani poleceniach budowania.

## Klucz do podpisywania CRX

Przed pierwszym wydaniem należy wygenerować klucz prywatny RSA i skonfigurować go jako sekret repozytorium GitHub.

### Generowanie klucza prywatnego

```bash
openssl genrsa -out extension.pem 2048
```

::: warning
Pliku `extension.pem` **absolutnie nie wolno utracić** — wygenerowanie nowego zmieni ID rozszerzenia (Chrome uzna je za inne rozszerzenie). Przechowuj lokalną kopię zapasową.
:::

### Konfiguracja na GitHub

1. Ustawienia repozytorium → Secrets and variables → Actions → New repository secret
2. Name: `EXTENSION_PRIVATE_KEY`
3. Secret: wklej **całą zawartość** pliku `extension.pem` (włącznie z `-----BEGIN PRIVATE KEY-----` i `-----END PRIVATE KEY-----`)
4. Zapisz

Przepływ wydania będzie automatycznie używał tego klucza do podpisywania crx.

### Co się stanie bez konfiguracji

Przepływ wydania nadal działa, ale w artefaktach nie będzie pliku `.crx`. Użytkownicy będą mogli instalować rozszerzenie tylko przez rozpakowanie archiwum zip.

## Lista kontrolna przed wydaniem

- [ ] Wykonano `npx prettier --write .`
- [ ] `bun run typecheck` zakończone sukcesem
- [ ] `bun run lint` zakończone sukcesem
- [ ] `bun run build` zakończone sukcesem
- [ ] Ręczne testy kluczowych ścieżek w Chrome po załadowaniu `dist/` (otwarcie okna podręcznego, rozpoznanie strony, odświeżenie, skopiowanie pełnego raportu stosu technologicznego, dodanie reguły na stronie ustawień)
- [ ] Aktualizacja numeru wersji w `package.json`
- [ ] git commit + push
- [ ] Jeśli wersja spełnia kryterium wydania: opublikowanie release w interfejsie GitHub (tag w formacie `v{version}`, zgodny z `package.json`)
- [ ] Po zakończeniu przepływu wydania: potwierdzenie obecności zip / crx i sha256 w zasobach release

## Publikacja w Chrome Web Store

Przepływ wydania nie publikuje automatycznie w Chrome Web Store — interfejs API publikowania CWS wymaga przepływu OAuth2, więc proces jest ręczny:

1. Spakuj katalog `dist/` do archiwum zip (taki sam jak artefakt zip z przepływu)
2. [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) → Prześlij nową wersję
3. Uzupełnij opis zmian, poczekaj na weryfikację (zazwyczaj 1-3 dni robocze)
