# Import i eksport reguł JSON

Ostatnia sekcja strony ustawień wyświetla aktualne reguły niestandardowe w formacie JSON. Przydatna do tworzenia kopii zapasowych, przenoszenia reguł i zbiorczej edycji.

## Zastosowania

- Przenoszenie reguł między urządzeniami i kontami
- Tworzenie kopii zapasowych reguł za pomocą systemu kontroli wersji
- Zbiorcza edycja (wyszukaj i zamień w polu tekstowym, zamiast edytować każdą regułę z osobna)
- Programowe generowanie reguł (skrypt tworzący setki reguł)

## Struktura pól

Każda reguła jest obiektem:

```json
{
  "name": "MyCMS",
  "category": "网站程序",
  "kind": "自定义 CMS",
  "confidence": "中",
  "matchType": "regex",
  "patterns": ["mycms-[0-9.]+\\.js", "X-Generator: MyCMS"],
  "selectors": ["[data-powered-by='mycms']"],
  "globals": ["MyCMS"],
  "matchIn": ["url", "resources", "html", "headers", "dynamic"],
  "url": "https://mycms.example.com"
}
```

| Pole         | Typ                      | Wymagane       | Opis                                                                                         |
| ------------ | ------------------------ | -------------- | -------------------------------------------------------------------------------------------- |
| `name`       | string                   | Tak            | Nazwa wyświetlana w oknie podręcznym                                                         |
| `category`   | string                   |                | Kategoria. Domyślnie `其他库` (Pozostałe biblioteki)                                         |
| `kind`       | string                   |                | Opis typu. Domyślnie `自定义规则` (Reguła niestandardowa)                                    |
| `confidence` | `"高"` / `"中"` / `"低"` |                | Domyślnie `"中"` (Średnia)                                                                   |
| `matchType`  | `"keyword"` / `"regex"`  |                | Domyślnie `"regex"`                                                                          |
| `patterns`   | string[]                 | Jedno z trzech | Co najmniej jedno z: patterns / selectors / globals musi być niepuste                        |
| `selectors`  | string[]                 | Jedno z trzech | Lista selektorów CSS                                                                         |
| `globals`    | string[]                 | Jedno z trzech | Lista nazw zmiennych globalnych (`window.x.y` zapisz jako `x.y`)                             |
| `matchIn`    | string[]                 |                | Dowolna kombinacja `url` / `resources` / `html` / `headers` / `dynamic`. Domyślnie wszystkie |
| `url`        | string                   |                | Musi zaczynać się od `http(s)://`. Może być puste                                            |

## Przyciski operacji

W prawym górnym rogu tytułu sekcji znajdują się dwa przyciski:

- **Importuj z JSON**: parsuje zawartość pola tekstowego i po pomyślnej walidacji **całkowicie zastępuje** bieżącą listę reguł niestandardowych (nie scala)
- **Formatuj**: parsuje JSON i zapisuje go z powrotem z `JSON.stringify(rules, null, 2)`, poprawiając wcięcia

## Ukośniki odwrotne w ciągach znaków

W JSON wyrażenia regularne wymagają podwójnego escapowania. Aby dopasować `\.js`:

```json
{
  "matchType": "regex",
  "patterns": ["\\.js$"]
}
```

Parser JSON zamienia `\\` na pojedynczy `\`, rozszerzenie otrzymuje `\.js$`, które po przekazaniu do `new RegExp()` staje się prawdziwym „zescapowaną kropką".

## Walidacja atomowa

Podczas importu cała tablica jest najpierw parsowana. Jeśli jakiekolwiek pole w którymkolwiek rekordzie nie spełnia wymagań, cały import jest odrzucany. Nie istnieje stan pośredni, gdzie część reguł zostaje zaakceptowana. Komunikat błędu wskazuje, która reguła (numer) i które pole są problematyczne.

## Relacja z formularzem

- Zmiany w formularzu → automatycznie synchronizowane z polem JSON
- Zmiany w polu JSON → wymagają kliknięcia „Importuj z JSON", aby zsynchronizować z wewnętrzną listą reguł
- Kliknięcie „Zapisz ustawienia" bez importu zapisze ostatni stan z formularza lub poprzedniej operacji importu

## Limit liczby reguł

`CUSTOM_RULE_LIMITS.rules` wynosi domyślnie 100. Przekroczenie limitu powoduje odrzucenie importu. Pełna lista limitów w [`src/types/settings.ts`](https://github.com/setube/stackprism/blob/main/src/types/settings.ts):

| Pole                                           | Limit         |
| ---------------------------------------------- | ------------- |
| Łączna liczba reguł                            | 100           |
| name                                           | 80 znaków     |
| category                                       | 40 znaków     |
| kind                                           | 40 znaków     |
| Pojedynczy pattern / selector / global         | 240 znaków    |
| Długość tablicy patterns / selectors / globals | Po 80         |
| Długość tablicy matchIn                        | 8             |
| url                                            | 240 znaków    |
| customCss                                      | 10 000 znaków |
