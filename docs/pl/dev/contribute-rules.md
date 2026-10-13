# Wkład w reguły

## Ścieżki

Wkład dzieli się na dwa rodzaje:

1. **Szybkie zgłoszenie**: kliknij przycisk „Rozpoznanie nieprawidłowe — kliknij, aby poprawić" na karcie technologii w oknie podręcznym. Otworzy się GitHub Issue z automatycznie wypełnionym kontekstem (URL strony, wynik dopasowania reguły, wersja rozszerzenia). Opiekun dostosuje regułę po otrzymaniu zgłoszenia.
2. **Bezpośredni PR**: sforkuj repozytorium, edytuj odpowiedni plik JSON w `public/rules/`, sprawdź lokalnie i prześlij PR.

Poniżej opisany jest głównie przepływ bezpośredniego PR.

## Znalezienie właściwego pliku

`public/rules/` jest podzielone na pliki według odpowiedzialności:

| Plik                               | Zawiera                                                      |
| ---------------------------------- | ------------------------------------------------------------ |
| `page/frontend-frameworks.json`    | React / Vue / Angular / frameworki frontendowe               |
| `page/ui-frameworks.json`          | Tailwind / Bootstrap / Element / Antd i inne biblioteki UI   |
| `page/build-runtime.json`          | Webpack / Vite / Rollup / Bun i inne narzędzia budowania     |
| `page/frontend-cdn-libraries.json` | Biblioteki frontendowe z CDN (jQuery, lodash, moment itp.)   |
| `page/wordpress-plugins.json`      | Ponad 4500 wtyczek WordPress                                 |
| `page/drupal-modules.json`         | Ponad 4000 modułów Drupal                                    |
| `page/cms-themes.json`             | Motywy CMS                                                   |
| `page/website-programs.json`       | WordPress / Drupal / Discuz! i inne programy stron           |
| `page/payment-systems.json`        | Platformy płatności                                          |
| `page/third-party-logins.json`     | Logowania zewnętrzne                                         |
| `page/saas-services.json`          | SaaS (Sentry / Mixpanel / Intercom itp.)                     |
| `page/analytics-providers.json`    | Statystyki i analityka                                       |
| `page/cdn-providers.json`          | Dostawcy CDN (rozpoznawanie po stronie frontendu)            |
| `headers/server-products.json`     | Produkty serwerowe rozpoznawane przez nagłówek `Server:`     |
| `headers/cdn-providers.json`       | CDN rozpoznawane przez nagłówki odpowiedzi                   |
| `headers/website-programs.json`    | CMS rozpoznawane przez nagłówki odpowiedzi                   |
| ...                                |                                                              |

Pełna lista w `public/rules/index.json`.

## Minimalny przykład nowej reguły

Chcesz dodać rozpoznawanie ExampleCMS. W `page/website-programs.json` znajdź odpowiednią grupę (np. „samodzielnie hostowane CMS") i dodaj:

```json
{
  "name": "ExampleCMS",
  "url": "https://examplecms.example.com",
  "patterns": ["examplecms-[0-9.]+\\.min\\.js", "/_examplecms/"],
  "globals": ["ExampleCMS"],
  "selectors": ["[data-powered-by='examplecms']"]
}
```

Znaczenie pól opisane jest w [Formacie pliku reguł](./rule-format.md).

## Do której grupy należy reguła?

Otwierając odpowiedni plik JSON, zobaczysz zagnieżdżoną strukturę grup:

```json
{
  "page": {
    "websitePrograms": {
      "defaults": { "category": "网站程序" },
      "rules": [
        {
          "defaults": { "confidence": "高" },
          "rules": [
            // seria CMS o wysokiej pewności
          ]
        },
        {
          "defaults": { "confidence": "中" },
          "rules": [
            // seria o średniej pewności
          ]
        }
      ]
    }
  }
}
```

Umieść regułę w podgrupie odpowiadającej twojej ocenie pewności rozpoznania. Kolejność w tablicy `rules` nie wpływa na wyniki detekcji — ma znaczenie tylko przy przeglądaniu.

## Weryfikacja reguły

Po wprowadzeniu zmian uruchom:

```bash
pnpm run build
```

Budowanie uruchomi `precompileRulesPlugin`, który wstrzyknie do reguł pola `__hints` itp. Następnie załaduj `dist/` na stronie `chrome://extensions/` i zweryfikuj na prawdziwej stronie z ExampleCMS.

Możesz też najpierw przetestować regułę w panelu „Reguły niestandardowe" w warstwie konfiguracji użytkownika, a po potwierdzeniu działania przenieść ją do `public/rules/`.

## Ograniczanie fałszywych alarmów

- **Preferuj globals**: trafienie `window.X` jest najbardziej stabilne, prawie zerowe ryzyko fałszywego alarmu
- **Preferuj dedykowane selektory**: `[data-powered-by='examplecms']`, `[ng-version]` — atrybuty jednoznacznie zapisywane przez daną technologię
- **W patterns zasobów używaj pełnych domen / pełnych ścieżek**: `cdn.examplecms.com/sdk.js` jest bardziej pewne niż `examplecms`
- **classNames / classPrefixes z prefiksem**: `example-cms-` zamiast `cms-`, żeby uniknąć kolizji z innymi projektami używającymi `cms-`
- **Zakotwicz wyrażenia regularne**: `^/_examplecms/` jest precyzyjniejsze niż `/_examplecms/`
- **Bądź ostrożny z pewnością**: przy wątpliwościach użyj „Średnia" — użytkownik zobaczy żółtą etykietę zamiast zielonej i nie zostanie wprowadzony w błąd

## Przepływ zgłaszania PR do głównego repozytorium

1. Sforkuj [setube/stackprism](https://github.com/setube/stackprism)
2. Sklonuj lokalnie, uruchom `pnpm install`, potwierdź poprawność budowania przez `pnpm run build`
3. Znajdź odpowiedni plik w `public/rules/` i dodaj regułę
4. Zbierz 2-3 dowody ze [Wappalyzer rules](https://github.com/enthec/webappanalyzer), oficjalnej dokumentacji lub strony projektu i umieść je w opisie PR
5. Prześlij PR do gałęzi main

W opisie PR napisz wyraźnie: jakie technologie zostały dodane, na jakich stronach zostały zweryfikowane i dlaczego te cechy nie będą powodować fałszywych alarmów na innych stronach.
