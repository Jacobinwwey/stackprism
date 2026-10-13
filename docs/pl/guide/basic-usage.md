# Podstawowe użytkowanie

Okno podręczne ma stałą wysokość 600px, a jego główną część zajmuje lista technologii. Na górze widoczne są informacje o bieżącej stronie i kontrolki filtrowania, na dole narzędzia pomocnicze: wyszukiwanie, surowe wskazówki i inne.

## Górny pasek narzędzi

```text
[StackPrism  URL bieżącej strony]    [Motyw] [Ustawienia] [Kopiuj] [Odśwież]
```

- **Po lewej**: nazwa rozszerzenia + numer wersji + URL bieżącej strony (skrócony; pełny URL widoczny po najechaniu)
- **Cztery przyciski po prawej**:
  - **Motyw** (ikona słońca / księżyca / ekranu): kliknięcie przełącza między trzema trybami: „auto / jasny / ciemny"
  - **Ustawienia**: otwiera stronę ustawień (w osobnej karcie)
  - **Kopiuj**: kopiuje URL bieżącej strony do schowka
  - **Odśwież**: nakazuje tłu ponownie wykryć bieżącą stronę; istniejące wyniki z cache pozostają w oknie do czasu ich zastąpienia

## Dane przeglądu

```text
22 technologie    274 zasoby    0 nagłówki odpowiedzi
```

- **Technologie**: łączna liczba wykrytych i deduplikowanych technologii
- **Zasoby**: liczba załadowanych na bieżącej stronie URL zasobów (skrypty, style, iframe, obrazy itp.)
- **Nagłówki odpowiedzi**: liczba przydatnych nagłówków wyodrębnionych z odpowiedzi głównego dokumentu

## Pasek filtrowania według kategorii

```text
[ Kluczowe 5  Wszystkie 22 ]    [ Wybierz kategorię ▾ ]
```

- Po lewej: przełącznik segmentów — „Kluczowe" pokazuje tylko wyniki o wysokiej pewności, „Wszystkie" pokazuje wszystko
- Po prawej: lista rozwijana z 24 kategoriami (frameworki frontendowe / frameworki UI / CDN / WAF / programy stron internetowych / ...). Wybranie konkretnej kategorii wyświetla tylko jej wyniki. Każda opcja pokazuje licznik (np. „Programy stron · 4")

## Lista technologii

Każda technologia jest wyświetlana jako karta:

```text
React                                         [Wysoka pewność]
- Węzeł DOM zawiera znacznik React Fiber
- URL zasobu pasuje do cdn.example.com/react.production.min.js
Źródło: Nagłówki odpowiedzi  Dynamiczne monitorowanie
Rozpoznanie nieprawidłowe — kliknij, aby poprawić
```

- **Nazwa technologii**: klikalny link do oficjalnej strony lub repozytorium technologii (ikona zewnętrznego linku pojawia się po najechaniu)
- **Etykieta pewności**: wysoka (zielona) / średnia (żółta) / niska (szara)
- **Dowody**: maksymalnie 4 linie z fragmentami DOM / zasobów / nagłówków, które doprowadziły do tego rozpoznania
- **Źródło**: każda etykieta jest klikalna — **kliknięcie otwiera panel na dole z surowym JSON dla tej konkretnej technologii i tego źródła**
- **Przycisk korekty**: otwiera formularz GitHub Issue wstępnie wypełniony wynikiem rozpoznania, ułatwiając zgłoszenie fałszywego alarmu lub pominięcia

::: tip
Jeśli na stronie wykryto dużo technologii, zacznij od widoku „Kluczowe". Pokazuje on tylko wyniki o wysokiej pewności. Do diagnozowania fałszywych alarmów lub przeglądania pełnego stosu technologicznego przełącz się na „Wszystkie".
:::

## Dolny pasek narzędzi

```text
[Szukaj]  [Surowe wskazówki]  [Kopiuj wszystko]                      GitHub
```

Przyciski narzędzi po lewej — szczegóły w [Narzędziach pomocniczych](./tools.md). Wyszukiwanie i surowe wskazówki otwierają panel od dołu; kliknięcie tego samego przycisku lub przycisku zamknięcia w panelu zamyka go. „Kopiuj wszystko" od razu kopiuje pełny raport stosu technologicznego do schowka.

## Zachowanie przy przewijaniu

Całkowita wysokość okna jest zablokowana na 600px; tylko **obszar listy technologii** jest przewijalny. Górny pasek narzędzi, przegląd i pasek filtrowania są zawsze widoczne.

Po przewinięciu listy w dół o około 240px w prawym dolnym rogu pojawia się okrągły przycisk (strzałka w górę), który po kliknięciu płynnie przewija widok z powrotem na górę.
