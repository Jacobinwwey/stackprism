# Instalacja i aktywacja

StackPrism jest przeznaczony dla przeglądarek opartych na silniku Chromium (Chrome, Edge, Brave, Opera, Vivaldi, Arc itp.) i wymaga obsługi Manifest V3.

## Metoda 1: Pobierz plik crx z Release

1. Otwórz [GitHub Releases](https://github.com/setube/stackprism/releases)
2. Wybierz najnowszą wersję i pobierz `stackprism-v{version}.crx`
3. W pasku adresu przeglądarki wpisz `chrome://extensions/` (Edge: `edge://extensions/`), włącz „Tryb dewelopera" w prawym górnym rogu
4. Przeciągnij pobrany plik `.crx` na stronę rozszerzeń
5. Gdy pojawi się okno dialogowe, potwierdź „Dodaj rozszerzenie"

::: tip
Chrome czasem blokuje instalację pliku .crx przez przeciąganie (komunikat „Nie można dodać aplikacji, rozszerzeń i skryptów użytkownika z tej witryny"). W takim przypadku użyj metody 2.
:::

## Metoda 2: Pobierz archiwum zip z Release i załaduj rozpakowany folder

1. Otwórz [GitHub Releases](https://github.com/setube/stackprism/releases), pobierz `stackprism-v{version}.zip`
2. Wypakuj do trwałego katalogu (**nie usuwaj go — rozszerzenie potrzebuje tego katalogu do działania**)
3. Otwórz `chrome://extensions/`, włącz „Tryb dewelopera"
4. Kliknij „Załaduj rozszerzenie bez pakietu"
5. Wskaż właśnie wypakowany katalog

## Metoda 3: Zbuduj lokalnie ze źródeł

Dla deweloperów lub użytkowników chcących korzystać z najnowszej gałęzi main.

```bash
git clone https://github.com/setube/stackprism.git
cd stackprism
bun install
bun run build
```

Wyniki budowania znajdziesz w `dist/`. W trybie dewelopera na stronie `chrome://extensions/` załaduj katalog `dist/`.

Po wprowadzeniu zmian w kodzie źródłowym wystarczy ponownie uruchomić `bun run build`, a następnie kliknąć przycisk odświeżania na karcie rozszerzenia.

## Aktywacja i uprawnienia

Przy pierwszej instalacji zostaniesz poproszony o przyznanie następujących uprawnień:

| Uprawnienie  | Zastosowanie                                                                  |
| ------------ | ----------------------------------------------------------------------------- |
| `tabs`       | Odczyt URL / tytułu aktywnej karty                                            |
| `activeTab`  | Wstrzykiwanie skryptu detekcji do aktywnej strony                             |
| `scripting`  | Wstrzykiwanie page-detector / page-source-search do świata głównego strony    |
| `storage`    | Przechowywanie ustawień, cache wyników detekcji, preferencji motywu           |
| `webRequest` | Nasłuchiwanie nagłówków odpowiedzi w celu zebrania server / x-powered-by itp. |
| `<all_urls>` | Działanie na wszystkich stronach http(s)                                      |

Proces detekcji nie zależy od zewnętrznych API: pliki reguł są dołączone do rozszerzenia, a wyniki detekcji pozostają wyłącznie w pamięci przeglądarki i storage rozszerzenia.

## Odinstalowanie

`chrome://extensions/` → znajdź StackPrism → Usuń. Ustawienia i cache zostaną wyczyszczone.
