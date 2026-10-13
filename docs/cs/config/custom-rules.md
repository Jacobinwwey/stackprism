# Vlastní pravidla

Vlastní pravidla slouží k pokrytí stránek, na které vestavěná pravidla nestačí, nebo k lokálnímu ověření nového pravidla před jeho zařazením do databáze.

## Vyplnění formuláře

| Pole                  | Povinné | Popis                                                                                                                                         |
| --------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Název technologie** | ano     | Název zobrazený ve vyskakovacím okně, např. `MyCMS`                                                                                           |
| **Kategorie**         |         | Vyberte jednu z vestavěných kategorií (23) nebo zadejte vlastní název. Výchozí hodnota je „Ostatní knihovny". Komponenta Select podporuje volný vstup. |
| **Popis typu**        |         | Poznámka pro vlastní potřebu, např. `Podnikový CMS`, `Platba třetí strany`. Zobrazí se jako předpona u důkazů; může být prázdné.               |
| **Spolehlivost**      |         | Vysoká / Střední / Nízká. Výchozí hodnota: „Střední"                                                                                          |
| **Způsob shody**      |         | Klíčová slova / Regulární výraz. Výchozí hodnota: „Regulární výraz"                                                                           |
| **URL webu / repozitáře** |     | Musí začínat `http://` nebo `https://`. Po vyplnění bude název technologie ve vyskakovacím okně klikatelný                                    |

Pod formulářem jsou čtyři další sekce:

- **Rozsah shody**: určuje, ve kterých zdrojích dat se budou hledat shody pro patterns / selectors / globals
  - URL stránky: adresa aktuální webové stránky
  - URL zdrojů: zdroje načtené skripty / styly / iframe
  - DOM / zdrojový kód: outerHTML stránky
  - Hlavičky odpovědí: hlavičky odpovědí hlavního dokumentu + API + iframe
  - Dynamické zdroje: zdroje průběžně sbírané pomocí MutationObserver

- **Pravidla shody (patterns)**: jedno pravidlo na řádek. V režimu klíčových slov jde o doslovné řetězce; v režimu regulárních výrazů jde o zdrojový kód regulárního výrazu JS (bez obálky `/.../i` — příznak i je přidán automaticky)

- **CSS selektory (selectors)**: jeden selektor na řádek, např. `[data-v-app]`, `#__next`. Rozsah shody musí zahrnovat „DOM / zdrojový kód"

- **Globální proměnné (globals)**: jedna proměnná na řádek, např. `React`, `Vue.config`, `__NEXT_DATA__`. Shoda automaticky znamená vysokou spolehlivost

## Přidání / Aktualizace

- **Přidat pravidlo** (zelené hlavní tlačítko): uloží aktuální formulář jako nové pravidlo
- **Aktualizovat aktuální pravidlo**: nejprve klikněte na „Upravit" u libovolného pravidla v seznamu vpravo dole pro vstup do „režimu úprav", po provedení změn uložte tímto tlačítkem

Na závěr je nutné kliknout na „Uložit nastavení" v pravém horním rohu stránky, aby se pravidla zapsala do úložiště.

## Seznam přidaných pravidel

Zobrazí se ve spodní části stránky; každé pravidlo obsahuje:

- název: název technologie pravidla
- metadata: kategorie · typ · spolehlivost · způsob shody · N pravidel
- akce: tlačítka „Upravit" a „Smazat" (tlačítko Smazat se po najetí myší zbarví červeně)

## Ověření pravidel

Při každém přidání / aktualizaci / uložení nastavení se provádí tyto kontroly:

- název je povinný
- alespoň jedno z polí patterns / selectors / globals musí být vyplněno
- alespoň jedna položka rozsahu shody musí být zaškrtnuta
- pole url, je-li vyplněno, musí začínat http(s)://
- každý pattern (v režimu regulárních výrazů) musí projít testem `new RegExp`
- každý selektor musí projít testem `document.createDocumentFragment().querySelector`
- každá globální proměnná musí odpovídat formátu `MyCMS` nebo `google.maps` (název oddělený tečkami)

Při selhání validace se zobrazí červená bublina s výčtem až 6 problémů.

## Příklad: jednoduché klíčové slovo

Detekce ExampleCMS:

```text
Název technologie: ExampleCMS
Kategorie:         Systémy pro správu webu
Způsob shody:      Klíčová slova
Pravidla shody:
  examplecms
  X-Generator: ExampleCMS
Rozsah shody: [x] URL stránky [x] URL zdrojů [x] DOM / zdrojový kód [x] Hlavičky odpovědí
```

## Příklad: detekce tématu WordPress

```text
Název technologie: Téma WordPress: oceanwp
Kategorie:         Témata / šablony
Způsob shody:      Klíčová slova
Pravidla shody:
  /wp-content/themes/oceanwp/
Rozsah shody: [x] URL zdrojů [x] DOM / zdrojový kód
```

## Příklad: detekce dynamicky načítaného platebního SDK

Skript pro platby se načte až po kliknutí na tlačítko platby — zaškrtněte „Dynamické zdroje":

```text
Název technologie: ExamplePay
Kategorie:         Platební systémy
Popis typu:        Platba třetí strany
Způsob shody:      Klíčová slova
Pravidla shody:
  pay.example.com
  examplepay-sdk
Rozsah shody: [x] Dynamické zdroje
```

## Příklad: regulární výraz pro soubory knihovny s číslem verze

```text
Název technologie: ExampleLib
Kategorie:         Frontendové knihovny
Způsob shody:      Regulární výraz
Pravidla shody:
  examplelib-[0-9.]+\.min\.js
Rozsah shody: [x] URL zdrojů [x] Dynamické zdroje
```

## Snížení počtu falešných pozitiv

- Nepoužívejte příliš obecná klíčová slova jako `app`, `main`, `login` — vyskytují se téměř na každém webu
- Upřednostňujte **úplné doménové jméno** `pay.example.com` před pouhým `pay`
- Upřednostňujte **specifické cesty** `/wp-content/themes/oceanwp/` před `oceanwp`
- V případě pochybností nastavte spolehlivost na „Nízkou" — ve vyskakovacím okně se zobrazí šedý indikátor naznačující, že jde pouze o odhad
- Po uložení pravidla **vždy obnovte cílovou stránku** a teprve pak otevřete vyskakovací okno — jinak bude stále zobrazena stará mezipaměť
