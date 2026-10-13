# Reguły niestandardowe

Reguły niestandardowe służą do uzupełnienia luk w wbudowanej bazie reguł lub do lokalnego przetestowania nowej reguły przed jej włączeniem do projektu.

## Wypełnianie formularza

| Pole                                     | Wymagane | Opis                                                                                                                               |
| ---------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Nazwa technologii**                    | Tak      | Nazwa wyświetlana w oknie podręcznym, np. `MyCMS`                                                                                  |
| **Kategoria**                            |          | Wybierz jedną z wbudowanych kategorii (23) lub wpisz własną. Domyślnie „Pozostałe biblioteki". Pole obsługuje swobodne wpisywanie. |
| **Opis typu**                            |          | Adnotacja dla własnych potrzeb, np. `Enterprise CMS`, `Płatności zewnętrzne`. Wyświetlana jako prefiks evidence; może być pusta.   |
| **Poziom pewności**                      |          | Wysoka / Średnia / Niska. Domyślnie „Średnia"                                                                                      |
| **Metoda dopasowania**                   |          | Słowo kluczowe / Wyrażenie regularne. Domyślnie „Wyrażenie regularne"                                                              |
| **URL oficjalnej strony / repozytorium** |          | Musi zaczynać się od `http://` lub `https://`. Po podaniu nazwa technologii w oknie staje się klikalna.                            |

Poniżej znajdują się cztery obszary:

- **Zakres dopasowania**: określa, w jakich źródłach danych szukać dopasowań dla patterns / selectors / globals
  - URL strony: adres bieżącej strony
  - URL zasobów: zasoby ładowane przez skrypty / style / iframe
  - DOM / kod źródłowy: outerHTML strony
  - Nagłówki odpowiedzi: nagłówki głównego dokumentu, API i iframe
  - Zasoby dynamiczne: zasoby zbierane przez MutationObserver

- **Reguły dopasowania (patterns)**: jedna reguła na wiersz. W trybie słowa kluczowego: literalne dopasowanie ciągu; w trybie wyrażenia regularnego: źródło wyrażenia JS (bez ograniczników `/.../i` — flaga `i` jest dodawana automatycznie)

- **Selektory CSS (selectors)**: jeden selektor na wiersz, np. `[data-v-app]`, `#__next`. Zakres dopasowania musi obejmować „DOM / kod źródłowy"

- **Zmienne globalne (globals)**: jedna zmienna na wiersz, np. `React`, `Vue.config`, `__NEXT_DATA__`. Trafienie oznacza wysoką pewność

## Dodawanie / aktualizowanie

- **Dodaj regułę** (zielony przycisk główny): zapisuje bieżący formularz jako nową regułę
- **Zaktualizuj bieżącą regułę**: kliknij „Edytuj" przy wybranej regule na liście, wprowadź zmiany i kliknij ten przycisk, aby zapisać

Na końcu kliknij „Zapisz ustawienia" w prawym górnym rogu strony, aby reguła trafiła do storage.

## Lista dodanych reguł

Wyświetlana na dole strony. Każda pozycja zawiera:

- Tytuł: nazwa technologii
- Metadane: kategoria · typ · pewność · metoda dopasowania · liczba patterns
- Akcje: przyciski „Edytuj" i „Usuń" (przycisk usuwania zmienia kolor na czerwony po najechaniu)

## Walidacja reguł

Przy każdym dodawaniu / aktualizowaniu / zapisywaniu ustawień wykonywane są następujące sprawdzenia:

- Nazwa jest wymagana
- Co najmniej jedno z: patterns / selectors / globals musi być wypełnione
- Zakres dopasowania musi zawierać co najmniej jedną opcję
- Pole URL, jeśli podane, musi zaczynać się od http(s)://
- Każda reguła w patterns (w trybie wyrażenia regularnego) musi przejść `new RegExp`
- Każdy selektor w selectors musi przejść `document.createDocumentFragment().querySelector`
- Każda zmienna w globals musi być zgodna z formatem `MyCMS` lub `google.maps` (nazwy rozdzielone kropkami)

Jeśli walidacja się nie powiedzie, nad formularzem pojawi się czerwona dymek z listą maksymalnie 6 problemów.

## Przykład: proste słowo kluczowe

Rozpoznawanie ExampleCMS:

```text
Nazwa technologii: ExampleCMS
Kategoria:         Programy stron
Metoda dopasowania: Słowo kluczowe
Reguły dopasowania:
  examplecms
  X-Generator: ExampleCMS
Zakres dopasowania: [x] URL strony [x] URL zasobów [x] DOM / kod źródłowy [x] Nagłówki odpowiedzi
```

## Przykład: rozpoznawanie motywu WordPress

```text
Nazwa technologii: Motyw WordPress: oceanwp
Kategoria:         Motywy / Szablony
Metoda dopasowania: Słowo kluczowe
Reguły dopasowania:
  /wp-content/themes/oceanwp/
Zakres dopasowania: [x] URL zasobów [x] DOM / kod źródłowy
```

## Przykład: rozpoznawanie dynamicznie ładowanego SDK płatności

Skrypt płatności jest ładowany dopiero po kliknięciu przycisku, dlatego zaznacz „Zasoby dynamiczne":

```text
Nazwa technologii: ExamplePay
Kategoria:         Systemy płatności
Opis typu:         Płatności zewnętrzne
Metoda dopasowania: Słowo kluczowe
Reguły dopasowania:
  pay.example.com
  examplepay-sdk
Zakres dopasowania: [x] Zasoby dynamiczne
```

## Przykład: wyrażenie regularne dla biblioteki z numerem wersji

```text
Nazwa technologii: ExampleLib
Kategoria:         Biblioteki frontendowe
Metoda dopasowania: Wyrażenie regularne
Reguły dopasowania:
  examplelib-[0-9.]+\.min\.js
Zakres dopasowania: [x] URL zasobów [x] Zasoby dynamiczne
```

## Ograniczanie fałszywych alarmów

- Unikaj zbyt ogólnych słów kluczowych, takich jak `app`, `main`, `login` — prawie każda strona je zawiera
- Preferuj **pełne domeny** `pay.example.com` zamiast `pay`
- Preferuj **specyficzne ścieżki** `/wp-content/themes/oceanwp/` zamiast `oceanwp`
- Przy wątpliwościach ustaw pewność na „Niska" — w oknie pojawi się szara etykieta sugerująca domysł
- Po zapisaniu reguły **koniecznie odśwież docelową stronę** przed otwarciem okna, inaczej nadal zobaczysz stare dane z cache
