# Interpretacja wyników

## Poziom pewności

Każda technologia ma etykietę poziomu pewności z trzema stopniami:

| Stopień    | Kolor  | Znaczenie                                                                                                           |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------------------- |
| **Wysoka** | Zielony | Trafienie silnego sygnału: zmienna globalna (np. `window.React`), dedykowany selektor DOM, jednoznaczny URL zasobu (np. `/_next/`) |
| **Średnia** | Żółty  | Trafienie sygnału o średniej sile: rozmyte dopasowanie nagłówka odpowiedzi, prefiks klasy CSS, zestaw zmiennych CSS |
| **Niska**  | Szary  | Trafienie słabego sygnału: ogólna nazwa pliku skryptu (np. `*.min.js`), rozmyte wyrażenie regularne                 |

W zakładce „Kluczowe" domyślnie widoczne są tylko wyniki o wysokiej pewności.

## Dowody

Na karcie wyświetlane są maksymalnie 4 linie dowodów. Typowe dowody obejmują znaczniki DOM, URL zasobów, nagłówki odpowiedzi i zapisy dynamicznego ładowania, na przykład:

```text
- Węzeł DOM zawiera znacznik React Fiber
- URL zasobu pasuje do unpkg.com/react@18.2.0/umd/react.production.min.js
- Nagłówek odpowiedzi X-Powered-By: Next.js
```

Przy fałszywych alarmach zacznij od sprawdzenia dowodów. Zazwyczaj wskazują one, czy problem leży w regule zasobu, regule nagłówka odpowiedzi, czy w zbyt szerokim dopasowaniu DOM / klasy.

## Źródło

Etykiety źródła wskazują, skąd pochodzi dane rozpoznanie:

| Etykieta źródła              | Skąd pochodzi                                                         |
| ----------------------------- | --------------------------------------------------------------------- |
| `Nagłówki odpowiedzi`         | Nagłówki HTTP głównego dokumentu (server / x-powered-by / set-cookie itp.) |
| `Nagłówki odpowiedzi · API`   | Nagłówki odpowiedzi na żądania XHR / fetch bieżącej strony           |
| `Nagłówki odpowiedzi · iframe`| Nagłówki głównego dokumentu zagnieżdżonego iframe                    |
| `Dynamiczne monitorowanie`    | Zasoby i dynamicznie ładowane skrypty zbierane przez content script + MutationObserver |
| `Dynamiczne monitorowanie · Po interakcji` | Zasoby załadowane dopiero po interakcji użytkownika (modalne okna, logowanie, płatności) |
| `Motyw WordPress`             | Rozpoznanie na podstawie nagłówka style.css motywu                    |

**Kliknięcie dowolnej etykiety źródła** otwiera od dołu panel z surowym podzbiorem JSON **dla tej technologii i tego źródła**. Dane surowe — nagłówki odpowiedzi, lista URL zasobów lub dynamyczny snapshot — są dostępne od razu, bez przeszukiwania pełnego JSON.

## Sortowanie

Domyślna kolejność sortowania:

1. Indeks kategorii (frameworki frontendowe → frameworki UI → środowisko wykonawcze kompilacji → CDN → ...)
2. W obrębie kategorii: malejąco według pewności (wysoka → średnia → niska)
3. W obrębie tego samego poziomu pewności: alfabetycznie według nazwy technologii (localeCompare)

Po przełączeniu na konkretną kategorię sortowanie odbywa się tylko w jej obrębie. Zakładka „Kluczowe" pokazuje wszystkie technologie o wysokiej pewności; jeśli nie ma żadnej, cofa się do wszystkich technologii posortowanych malejąco według pewności i pokazuje pierwsze 30.

## Scalanie duplikatów

Jeśli ta sama technologia została rozpoznana z wielu źródeł (np. React pojawia się zarówno w nagłówkach odpowiedzi, jak i w DOM), nie jest wyświetlana wielokrotnie — zostaje scalona w jedną pozycję z najsilniejszym poziomem pewności, połączonymi i zdeduplikowanymi dowodami oraz tablicą źródeł zawierającą wszystkie trafienia.

## Brak rozpoznania nie oznacza braku technologii

Narzędzie wykrywa „**jakie wskazówki strona udostępnia przeglądarce**". Jeśli strona:

- usuwa wszelkie ślady środowiska wykonawczego po SSR (np. statycznie prerenderowane strony Astro)
- czyści wszystkie niestandardowe nagłówki serwera
- haszuje nazwy plików bundle bez oryginalnych nazw frameworków

— rozszerzenie może znaleźć bardzo mało wskazówek lub żadnych. Zazwyczaj nie oznacza to luki w regułach, lecz to, że strona nie ujawnia wystarczających wskazówek przeglądarce.

Wskazówki kompilacji frontendowej nie są równoznaczne ze środowiskiem wykonawczym backendu. Na przykład obecność `/_next/`, `/_nuxt/` lub produktów Vite wskazuje wyłącznie na łańcuch kompilacji frontendu i nie pozwala bezpośrednio wnioskować, że serwer działa na Node.js. Język backendu zazwyczaj ujawniają nagłówki `Server`, `X-Powered-By`, nazwy plików cookie lub dedykowane nagłówki odpowiedzi frameworka.

## Przycisk korekty

Przycisk „Rozpoznanie nieprawidłowe — kliknij, aby poprawić" na każdej karcie otwiera zgłoszenie GitHub Issue z automatycznie wstępnie wypełnionymi informacjami:

- URL bieżącej strony
- JSON wyniku tego rozpoznania
- Widoczne przez ciebie dowody
- Numer wersji rozszerzenia

W opisie wystarczy napisać „co jest błędne" lub „jak powinno wyglądać poprawne rozpoznanie". Opiekun dostosuje odpowiednią regułę w [`rules/`](https://github.com/setube/stackprism/tree/main/public/rules).
