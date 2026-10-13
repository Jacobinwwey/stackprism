# Narzędzia pomocnicze

Na dole okna podręcznego znajdują się trzy narzędzia: „Szukaj", „Surowe wskazówki" i „Kopiuj wszystko". Wyszukiwanie i surowe wskazówki otwierają panel od dołu, zajmujący maksymalnie 60% wysokości okna. Ponowne kliknięcie przycisku lub kliknięcie przycisku zamknięcia w panelu go zamyka. „Kopiuj wszystko" nie otwiera panelu — od razu kopiuje pełny raport stosu technologicznego do schowka.

## Wyszukiwanie w źródle strony

Zastosowanie: podejrzewasz, że jakieś rozpoznanie jest błędne, albo chcesz sprawdzić, czy na stronie rzeczywiście pojawia się dany ciąg znaków lub wyrażenie regularne.

### Pole wyszukiwania

Obsługuje zwykły tekst i wyrażenia regularne. Wciśnij Enter lub kliknij „Szukaj", aby wykonać wyszukiwanie.

### Opcje

| Opcja                    | Opis                                                                                     |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| Rozróżniaj wielkość liter | Domyślnie wyłączone; po włączeniu `React` i `react` są traktowane jako różne ciągi      |
| Całe słowo               | Działa w trybie zwykłego tekstu; wymaga, aby przed i po dopasowaniu znajdował się znak niebędący literą (owija wyrażenie w `\b`) |
| Wyrażenie regularne      | Traktuje wprowadzony tekst jako źródło wyrażenia regularnego JavaScript, łącząc je z powyższymi flagami |

### Wyniki

Wyświetlane są:

- Zapytanie, wzorzec, typ źródła (serializacja DOM lub outerHTML) i łączna długość źródła
- Liczba dopasowań (bardzo duże liczby są wyświetlane jako „100+" z obciętymi wynikami)
- Numer wiersza, kolumny i offset każdego dopasowania oraz fragment kontekstu (ok. 60 znaków przed i po trafieniu)

::: tip
Wyszukiwanie serializuje DOM aktywnej strony do ciągu znaków przed dopasowaniem, dzięki czemu obejmuje ukryte elementy, inline scripts i komentarze. To nie jest wyszukiwanie w sieciowym kodzie źródłowym — DOM zmodyfikowany przez skrypty po załadowaniu strony również jest uwzględniany.
:::

## Surowe wskazówki

Zastosowanie:

- Chcesz zobaczyć pełne surowe dane (wszystkie nagłówki odpowiedzi / dynamiczne snapshoty / surowe wyniki detekcji strony przed agregacją przez rozszerzenie)
- Chcesz dołączyć kompletne dowody do zgłoszenia
- Debugujesz dopasowanie reguł niestandardowych

Wynikiem jest pełny JSON o następującej strukturze:

```json
{
  "url": "https://example.com",
  "title": "Example",
  "generatedAt": "2026-05-10T10:00:00.000Z",
  "technologies": [
    /* scalona i zdeduplikowana lista */
  ],
  "resources": {
    /* podsumowanie zasobów */
  },
  "headers": {
    /* nagłówki odpowiedzi głównego dokumentu */
  },
  "apiObservations": [
    /* url/headers/technologies dla każdego żądania API */
  ],
  "frameObservations": [
    /* j.w. dla każdego iframe */
  ],
  "dynamicObservations": {
    /* skrypty/style/iframe/feedLinks/domMarkers zebrane dynamicznie */
  },
  "notes": [
    /* kilka uwag metodologicznych */
  ]
}
```

### Źródło → JSON z zakresem

Jeśli chcesz zobaczyć tylko podzbiór JSON **dla konkretnej technologii i konkretnego źródła**, nie musisz otwierać pełnych surowych wskazówek — kliknij etykietę źródła pod kartą technologii (np. „Nagłówki odpowiedzi" lub „Dynamiczne monitorowanie · Po interakcji"). Ten sam panel otworzy się, ale wyświetli tylko pola powiązane z tym źródłem, a tablica technologies będzie zawierać tylko tę jedną technologię.

Tytuł panelu zmieni się na „Surowe wskazówki · React · Nagłówki odpowiedzi", sygnalizując, że to widok z zakresem. Kliknięcie przycisku „Surowe wskazówki" na dolnym pasku narzędzi przywraca pełny JSON.

## Kopiowanie pełnego raportu stosu technologicznego

Przycisk „Kopiuj wszystko" na dole okna kopiuje pełny raport stosu technologicznego bieżącej strony do schowka. Raport zawiera:

- Czytelne dla człowieka podsumowanie w Markdown
- Ustrukturyzowany JSON `stackprism.tech_stack_report.v1`
- URL strony, tytuł, czas wygenerowania, łączną liczbę technologii, liczbę zasobów i liczbę nagłówków odpowiedzi głównego dokumentu

Kopiowane są **wyniki z bieżącego okna** — bez wpływu na filtrowanie widoku „Kluczowe" ani listy rozwijanej kategorii; przełączniki kategorii i lista zablokowanych technologii ze strony ustawień nadal działają. Raport można wkleić bezpośrednio do zgłoszenia, notatek, pola wejściowego agenta AI lub zewnętrznego narzędzia tekstowego.

Typowe zastosowania:

- Dołączanie pełnego kontekstu stosu technologicznego do zgłoszeń i PR
- Zapisywanie stosu technologicznego strony w dokumentacji lub bazie wiedzy
- Przekazywanie danych agentowi AI do dalszej analizy
