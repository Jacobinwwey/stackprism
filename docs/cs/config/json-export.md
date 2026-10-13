# Import a export pravidel JSON

Poslední sekce stránky nastavení zobrazuje JSON aktuálních vlastních pravidel. Hodí se pro zálohování, přenos a hromadné úpravy.

## Použití

- Přenos vlastních pravidel mezi zařízeními / účty
- Zálohování pravidel pomocí nástrojů pro správu verzí
- Hromadné úpravy (vyhledávání a nahrazování v textovém poli je rychlejší než úprava pravidel po jednom)
- Programové sestavování pravidel (skript vygeneruje stovky pravidel)

## Struktura polí

Každé pravidlo je objekt:

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

| Pole         | Typ                      | Povinné      | Popis                                                                                  |
| ------------ | ------------------------ | ------------ | -------------------------------------------------------------------------------------- |
| `name`       | string                   | ano          | Název zobrazený ve vyskakovacím okně                                                   |
| `category`   | string                   |              | Kategorie. Výchozí: `其他库`                                                           |
| `kind`       | string                   |              | Popis typu. Výchozí: `自定义规则`                                                      |
| `confidence` | `"高"` / `"中"` / `"低"` |              | Výchozí: `中`                                                                          |
| `matchType`  | `"keyword"` / `"regex"`  |              | Výchozí: `regex`                                                                       |
| `patterns`   | string[]                 | jedno ze tří | Ze tří polí (patterns / selectors / globals) musí být alespoň jedno neprázdné          |
| `selectors`  | string[]                 | jedno ze tří | Seznam CSS selektorů                                                                   |
| `globals`    | string[]                 | jedno ze tří | Názvy globálních proměnných (`window.x.y` se zapíše jako `x.y`)                        |
| `matchIn`    | string[]                 |              | Libovolná kombinace `url` / `resources` / `html` / `headers` / `dynamic`. Výchozí: vše |
| `url`        | string                   |              | Musí začínat `http(s)://`; může být prázdné                                            |

## Tlačítka

V pravém horním rohu záhlaví jsou dvě tlačítka:

- **Importovat z JSON**: zpracuje obsah textového pole a po úspěšném ověření **celý seznam vlastních pravidel nahradí** (není to sloučení)
- **Formátovat**: zpracuje JSON a přepíše jej jako `JSON.stringify(rules, null, 2)` s upraveným odsazením

## Zpětná lomítka v řetězcích

Pro zápis regulárních výrazů v JSON je nutné dvojité escapování. Příklad pro shodu s `\.js`:

```json
{
  "matchType": "regex",
  "patterns": ["\\.js$"]
}
```

JSON parser převede `\\` na jedno `\`; rozšíření obdrží `\.js$`, které teprve po předání do `new RegExp()` funguje jako „escapovaná tečka".

## Celkové ověření

Při importu se nejprve zpracuje celé pole; pokud má jakékoli pravidlo neplatné pole, celý import se odmítne (atomicky) — nikdy nedojde k situaci, kdy je importována jen část pravidel. Chybová zpráva uvede, které pravidlo a které pole je problematické.

## Vztah k formuláři

- Změny v formuláři → automaticky se promítnou do textového pole JSON
- Změny v textovém poli JSON → je nutné kliknout na „Importovat z JSON", aby se promítly zpět do interního seznamu pravidel
- Přímé kliknutí na „Uložit nastavení" bez předchozího importu uloží stav z poslední operace formuláře / importu

## Limit počtu pravidel

Výchozí hodnota `CUSTOM_RULE_LIMITS.rules` je 100. Překročení bude odmítnuto. Kompletní přehled limitů je v souboru [`src/types/settings.ts`](https://github.com/setube/stackprism/blob/main/src/types/settings.ts):

| Pole                                         | Limit        |
| -------------------------------------------- | ------------ |
| Celkový počet pravidel                       | 100          |
| name                                         | 80 znaků     |
| category                                     | 40 znaků     |
| kind                                         | 40 znaků     |
| Jeden pattern / selektor / globální proměnná | 240 znaků    |
| Délka polí patterns / selectors / globals    | 80 každé     |
| Délka pole matchIn                           | 8            |
| url                                          | 240 znaků    |
| customCss                                    | 10 000 znaků |
