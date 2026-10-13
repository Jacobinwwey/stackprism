# Przewodnik konfiguracji

Stronę ustawień można otworzyć przyciskiem „Ustawienia" na górnym pasku okna podręcznego lub przez `chrome://extensions/` → karta StackPrism → „Szczegóły → Opcje rozszerzenia".

Strona ustawień podzielona jest na pięć sekcji:

- [Przełączniki kategorii](./categories.md) — włączanie i wyłączanie 24 kategorii (po wyłączeniu technologie z danej kategorii nie są wyświetlane w oknie podręcznym)
- [Zablokowane technologie](./disabled-technologies.md) — precyzyjne blokowanie konkretnych technologii według nazwy (niezależnie od kategorii)
- [Niestandardowy styl okna](./custom-css.md) — wpisanie fragmentu CSS nadpisującego wygląd okna podręcznego i strony ustawień
- [Reguły niestandardowe](./custom-rules.md) — dodawanie własnych reguł rozpoznawania za pomocą formularza lub JSON
- [Import i eksport reguł JSON](./json-export.md) — synchronizacja zestawu reguł między przeglądarkami i urządzeniami

## Miejsce przechowywania konfiguracji

Cała konfiguracja jest przechowywana w `chrome.storage.sync` i synchronizowana między urządzeniami za pomocą konta Google lub Edge. Klucz to `stackPrismSettings`. Jeśli nie chcesz synchronizacji, wyłącz ją w ustawieniach samej przeglądarki.

Limit pojemności `chrome.storage.sync` wynosi 100 KB, a pojedynczy klucz nie może przekroczyć 8 KB. Oznacza to:

- Liczba reguł niestandardowych jest ograniczona (bezpieczny zakres to ok. 100 reguł)
- Długość niestandardowego CSS jest ograniczona (do 10 000 znaków)
- Lista zablokowanych technologii nie może być zbyt długa

Rzeczywiste limity są określone przez `CUSTOM_RULE_LIMITS` w `src/types/settings.ts`. Przekroczenie limitu powoduje błąd zapisu.

## Kiedy zmiany wchodzą w życie

| Zmiana                                                                | Kiedy wchodzi w życie                                                     |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Przełączniki kategorii / zablokowane technologie / niestandardowy CSS | Natychmiast po ponownym otwarciu okna podręcznego                         |
| Reguły niestandardowe                                                 | Po zapisaniu — przy następnym odświeżeniu strony i ponownym otwarciu okna |
| Import JSON                                                           | Jak wyżej                                                                 |

Kliknięcie „Zapisz ustawienia" od razu zapisuje dane do storage, bez konieczności odświeżania strony ustawień.
