# Pomocné nástroje

Ve spodní části vyskakovacího okna se nacházejí tři nástroje: „Hledat", „Surové stopy" a „Kopírovat vše". Hledání a surové stopy otevírají panel ze spodní části, který může zabírat až 60 % výšky vyskakovacího okna; dalším kliknutím na tlačítko nebo tlačítkem zavřít v panelu jej skryjete. Kopírovat vše panel neotevírá — zkopíruje kompletní zprávu o technologickém stacku přímo do schránky.

## Vyhledávání ve zdrojovém kódu webové stránky

Vhodné pro: podezření na nesprávnou detekci nebo ověření, zda se na stránce skutečně vyskytuje určitý řetězec / regulární výraz.

### Vstupní pole

Podporuje prostý text i regulární výrazy. Spustí se stisknutím Enter nebo kliknutím na „Hledat".

### Možnosti

| Možnost             | Popis                                                                                                 |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| Rozlišovat velikost | Výchozí: vypnuto. Po zapnutí `React` a `react` nejsou totožné                                         |
| Celé slovo          | Platí v režimu prostého textu; vyžaduje, aby před i za shodou byl ne-slovní znak (použije `\b`)       |
| Regulární výraz     | Zpracuje vstup jako zdrojový kód regulárního výrazu JavaScriptu v kombinaci s výše uvedenými příznaky |

### Výstup

Zobrazí se:

- dotaz samotný, vzor, typ zdroje (serializovaný HTML výsledek nebo outerHTML) a celková délka zdrojového kódu
- počet shod (při příliš velkém počtu se zobrazí „100+" a první N výsledků)
- číslo řádku, sloupce, znakový offset a kontextový výňatek kolem každé shody (přibližně 60 znaků před a za)

::: tip
Vyhledávání serializuje DOM aktuálně aktivní stránky do řetězce před porovnáváním — pokrývá tedy skryté prvky, inline skripty i komentáře. Nejde o vyhledávání ve zdrojovém kódu sítě; DOM změněný skripty po načtení stránky bude také zahrnut.
:::

## Surové stopy

Vhodné pro:

- zobrazení kompletních surových dat (všechny hlavičky odpovědí, dynamické snímky, surové výsledky detekce stránky před agregací)
- přiložení úplných důkazů k nahlášení problému
- ladění shod vlastních pravidel

Výstupem je kompletní JSON s následující strukturou:

```json
{
  "url": "https://example.com",
  "title": "Example",
  "generatedAt": "2026-05-10T10:00:00.000Z",
  "technologies": [/* sloučený deduplikovaný seznam */],
  "resources": {/* souhrn zdrojů */},
  "headers": {/* hlavičky odpovědí hlavního dokumentu */},
  "apiObservations": [/* url/headers/technologies pro každý API požadavek */],
  "frameObservations": [/* totéž pro každý iframe */],
  "dynamicObservations": {/* dynamicky zachycené skripty/styly/iframe/feedLinks/domMarkers */},
  "notes": [/* několik vysvětlivek k metodologii */]
}
```

### Zdroj → scoped JSON

Pokud chcete zobrazit pouze podmnožinu JSON **pro konkrétní technologii a konkrétní zdroj**, nemusíte otevírat celé surové stopy — stačí kliknout na štítek zdroje pod kartou technologie (např. „Hlavičky odpovědí" nebo „Dynamické sledování · po interakci"). Otevře se stejná zásuvka, ale zobrazí pouze pole relevantní pro daný zdroj a pole technologies bude obsahovat pouze tuto jednu technologii.

Záhlaví zásuvky se změní na tvar „Surové stopy · React · Hlavičky odpovědí" a naznačí tak, že jde o zobrazení s omezeným rozsahem. Kliknutím na „Surové stopy" v dolním panelu nástrojů přepnete zpět na kompletní JSON.

## Kopírování kompletní zprávy o technologickém stacku

Tlačítko „Kopírovat vše" ve spodní části vyskakovacího okna zkopíruje kompletní zprávu o technologickém stacku aktuální stránky do schránky. Zpráva obsahuje:

- čitelný souhrn ve formátu Markdown
- strukturovaný JSON `stackprism.tech_stack_report.v1`
- URL stránky, název, čas vygenerování, celkový počet technologií, počet zdrojů a počet hlaviček odpovědí hlavního dokumentu

Zkopírují se **výsledky aktuálního vyskakovacího okna** bez ohledu na aktivní filtr „Klíčové" nebo výběr kategorie v rozevíracím seznamu; přepínače kategorií a seznam zakázaných technologií na stránce nastavení jsou stále respektovány. Výsledek lze přímo vložit do hlášení problému, poznámek, vstupního pole AI agenta nebo jiného textového nástroje.

Obvyklé případy použití:

- přiložení kontextu celého technologického stacku k hlášení problému / pull requestu
- zdokumentování technologického stacku webu do dokumentace nebo znalostní báze
- předání dat AI agentovi k další analýze
