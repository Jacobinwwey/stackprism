# Průvodce konfigurací

Stránku nastavení lze otevřít tlačítkem „Nastavení" v horní části vyskakovacího okna nebo na `chrome://extensions/` vyhledáním karty StackPrism a kliknutím na „Podrobnosti → Možnosti rozšíření".

Stránka nastavení je rozdělena do pěti sekcí:

- [Přepínače detekce](./categories.md) — zapnutí/vypnutí 24 kategorií (po vypnutí se technologie dané kategorie přestanou zobrazovat ve vyskakovacím okně)
- [Zakázat konkrétní technologie](./disabled-technologies.md) — přesné blokování technologií podle názvu (bez ohledu na kategorii)
- [Vlastní styl vyskakovacího okna](./custom-css.md) — CSS pro přepsání výchozích stylů vyskakovacího okna / stránky nastavení
- [Vlastní pravidla](./custom-rules.md) — přidání vlastních detekčních pravidel pomocí formuláře nebo JSON
- [Import a export pravidel JSON](./json-export.md) — synchronizace sad pravidel mezi prohlížeči / zařízeními

## Umístění konfigurace

Veškerá konfigurace je uložena v `chrome.storage.sync` a synchronizuje se napříč zařízeními prostřednictvím přihlášeného účtu Google / Edge. Klíčem je `stackPrismSettings`. Pokud synchronizaci nechcete, vypněte ji přímo v prohlížeči.

Kapacitní limit `chrome.storage.sync` je 100 KB a jeden klíč nesmí přesáhnout 8 KB. To znamená:

- Počet vlastních pravidel je omezen (bezpečně přibližně do 100 pravidel)
- Délka vlastního CSS je omezena (nejvýše 10 000 znaků)
- Seznam zakázaných technologií nesmí být příliš dlouhý

Konkrétní omezení jsou definována v `CUSTOM_RULE_LIMITS` v souboru `src/types/settings.ts`. Při překročení limitu se uložení nezdaří a zobrazí se chybová zpráva.

## Kdy se změny projeví

| Změna                                             | Kdy se projeví                                        |
| ------------------------------------------------- | ----------------------------------------------------- |
| Přepínače detekce / zakázané technologie / vlastní CSS | Ihned po opětovném otevření vyskakovacího okna   |
| Vlastní pravidla                                  | Po uložení při příštím obnovení stránky + opětovném otevření vyskakovacího okna |
| Import JSON                                       | Totéž co výše                                         |

Po kliknutí na „Uložit nastavení" se data okamžitě zapíší do úložiště; stránku nastavení není potřeba obnovovat.
