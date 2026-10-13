<div align="center">

[🇨🇳 简体中文](PRIVACY.zh-CN.md) · [🇬🇧 English](PRIVACY.en.md) · [🇹🇼 繁體中文](PRIVACY.zh-TW.md) · [🇯🇵 日本語](PRIVACY.ja.md) · [🇫🇷 Français](PRIVACY.fr.md) · [🇩🇪 Deutsch](PRIVACY.de.md) · [🇧🇷 Português](PRIVACY.pt.md) · [🇮🇹 Italiano](PRIVACY.it.md) · [🇨🇿 Čeština](PRIVACY.cs.md) · **🇵🇱 Polski**

</div>

# StackPrism Polityka Prywatności

Ostatnia aktualizacja: 2026-05-12

## Przegląd

StackPrism / Pryzmat Stosu (zwany dalej „rozszerzeniem") to rozszerzenie przeglądarki do identyfikacji stosu technologicznego stron internetowych, oparte na Chrome / Edge Manifest V3. Rozszerzenie przykłada dużą wagę do Twojej prywatności — całe przetwarzanie danych odbywa się lokalnie w Twojej przeglądarce, **bez przesyłania, udostępniania ani sprzedawania jakichkolwiek Twoich danych do żadnych zdalnych serwerów**.

## Gromadzone Dane

Aby realizować jedyną funkcję — „identyfikacja stosu technologicznego aktualnie odwiedzanej strony" — rozszerzenie **lokalnie odczytuje** poniższe informacje podczas aktywnego odwiedzania stron. Wszelkie odczytane treści **są przetwarzane wyłącznie w pamięci przeglądarki lub w chrome.storage** i nigdy nie opuszczają Twojej przeglądarki.

### 1. Zawartość Strony

- Struktura węzłów DOM, nazwy klas CSS, zmienne CSS, tagi `<meta>` aktualnie odwiedzanej strony
- Nazwy globalnych zmiennych wstrzykniętych przez `<script>` do obiektu `window` (odczytywane są tylko nazwy, nie wartości)
- Adresy URL zasobów JavaScript / CSS / iframe / obrazów załadowanych na stronie
- Pierwsze kilka bajtów **już załadowanych** plików JavaScript (z pamięci podręcznej przeglądarki, bez dodatkowego ruchu sieciowego) — do identyfikacji komentarzy praw autorskich `/*! @license ... */` i wbudowanych adresów URL wejść OAuth w aplikacjach SPA

### 2. Rekordy Sieciowe

- Adres URL i tytuł aktualnie odwiedzanej strony
- Nagłówki odpowiedzi żądań XHR / Fetch / iframe / WebSocket (pola Server, X-Powered-By, nazwy pól Set-Cookie itp.)
- Wersja protokołu HTTP wynegocjowana przez stronę (HTTP/1.1 / HTTP/2 / HTTP/3)

## Zastosowanie Danych

Powyższe dane są używane **wyłącznie** do:

- Lokalnego dopasowania do wbudowanej bazy reguł rozszerzenia, identyfikując frameworki frontendowe, usługi backendowe, CDN, CMS, logowanie, płatności, statystyki i inne technologie stosowane na tej stronie
- Wyświetlania wyników identyfikacji Tobie w wyskakującym oknie rozszerzenia

## Przechowywanie Danych

- **Wyniki identyfikacji**: przechowywane wyłącznie w `chrome.storage.session`, usuwane po zamknięciu przeglądarki, zapisywane niezależnie dla każdej karty
- **Twoje ustawienia** (wyłączone kategorie, zablokowane nazwy technologii, niestandardowe reguły, preferencje motywu itp.): przechowywane w `chrome.storage.sync`, szyfrowane i synchronizowane przez przeglądarkę z Twoim kontem Google / Microsoft — rozszerzenie **nie ma dostępu** do żadnych innych danych na Twoim koncie
- Rozszerzenie **nie** przechowuje pełnego HTML strony, pełnych wartości Cookie, danych logowania, treści formularzy, haseł ani żadnych innych poufnych informacji

## Transmisja Danych

- Rozszerzenie **nie będzie** przesyłać Twoich danych przeglądania, wyników identyfikacji, danych osobowych ani żadnych innych danych do żadnych zdalnych serwerów
- Brak telemetrii, brak SDK reklamowego, brak analityki zewnętrznej, brak raportowania błędów do chmury
- Rozszerzenie inicjuje tylko dwa rodzaje żądań sieciowych, **żadne** z nich nie zawiera Twoich danych identyfikacyjnych ani danych przeglądania:
  1. Asynchroniczne pobieranie pierwszych fragmentów małej liczby plików JS **już załadowanych przez aktualnie odwiedzaną stronę** (z pamięci podręcznej przeglądarki, bez dodatkowego ruchu sieciowego) — do lokalnego skanowania komentarzy praw autorskich i adresów URL wejść OAuth w tych plikach JS
  2. Ikony marek technologii **preferowane z wbudowanej biblioteki ikon rozszerzenia** (zawiera offline ponad 1300 głównych technologii SVG / PNG, bez żadnych żądań sieciowych); tylko gdy dana technologia nie znajduje się w wbudowanej bibliotece ikon, zostanie pobrana z `cdn.simpleicons.org` jako fallback (ciało żądania zawiera tylko publiczny slug nazwy technologii, np. react / vuedotjs / docker, bez adresu URL odwiedzanej strony, wyników identyfikacji ani żadnych danych osobowych); jeśli CDN nie załaduje się w ciągu 2 sekund, rozszerzenie automatycznie przełączy się na lokalnie generowane kolorowe bloki z inicjałami — nigdy nie blokując procesu identyfikacji

## Udostępnianie Osobom Trzecim

- Rozszerzenie **nie** sprzedaje, nie udostępnia ani nie przekazuje danych użytkowników żadnym podmiotom trzecim
- Rozszerzenie **nie** wykorzystuje danych użytkowników do żadnych celów niezwiązanych z „identyfikacją stosu technologicznego"
- Rozszerzenie **nie** jest używane do celów pożyczkowych, oceny kredytowej ani podobnych

## Twoje Uprawnienia

Możesz w dowolnym momencie:

- Kliknąć przycisk „Odśwież" w wyskakującym oknie rozszerzenia, aby ponownie przeskanować bieżącą stronę
- Na stronie ustawień rozszerzenia zresetować pamięć podręczną reguł, wyłączyć dowolną kategorię, zablokować określone nazwy technologii, dodać niestandardowe reguły
- Odinstalować rozszerzenie w `chrome://extensions` — przeglądarka automatycznie usunie wszystkie lokalne dane przechowywane przez rozszerzenie

## Kod Źródłowy

Rozszerzenie jest w pełni open source — każdy może przejrzeć kod źródłowy, aby potwierdzić praktyki prywatności:

https://github.com/setube/stackprism

Licencja: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).

## Kontakt

W przypadku pytań dotyczących prywatności skontaktuj się z autorem przez GitHub Issues:

https://github.com/setube/stackprism/issues

## Zmiany Polityki

Najnowsza wersja tej polityki prywatności jest zawsze publikowana w [PRIVACY.md](https://github.com/setube/stackprism/blob/main/PRIVACY.md) w tym repozytorium. W przypadku istotnych zmian data ostatniej aktualizacji zostanie zaktualizowana.
