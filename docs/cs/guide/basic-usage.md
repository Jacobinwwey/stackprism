# Základní použití

Vyskakovací okno má pevnou výšku 600 px a jeho hlavní obsahem je seznam technologií. Nahoře jsou informace o aktuální stránce a ovládací prvky pro filtrování, dole jsou pomocné nástroje — vyhledávání, surové stopy apod.

## Horní panel nástrojů

```text
[StackPrism  URL aktuální stránky]    [Motiv] [Nastavení] [Kopírovat] [Obnovit]
```

- **Vlevo**: název rozšíření + číslo verze + URL aktuální stránky (zkrácená, při najetí myší se zobrazí celá)
- **Čtyři ikonová tlačítka vpravo**:
  - **Motiv** (ikona slunce / měsíce / obrazovky): kliknutím cyklicky přepíná mezi stavy „automatický / světlý / tmavý"
  - **Nastavení**: otevře stránku nastavení (v samostatné záložce)
  - **Kopírovat**: zkopíruje URL aktuální stránky do schránky
  - **Obnovit**: pošle pozadí pokyn k opětovné detekci aktuální stránky; stávající výsledky z mezipaměti zůstanou ve vyskakovacím okně do doby, než budou nahrazeny

## Přehledová data

```text
22 technologií    274 zdrojů    0 hlaviček odpovědí
```

- **Technologie**: celkový počet detekovaných deduplikovaných technologií
- **Zdroje**: počet URL zdrojů (skripty, styly, iframe, obrázky apod.) načtených aktuální stránkou
- **Hlavičky odpovědí**: počet užitečných hlaviček extrahovaných z hlavního dokumentu odpovědi

## Lišta filtrování kategorií

```text
[ Klíčové 5  Vše 22 ]    [ Vybrat kategorii ▾ ]
```

- Vlevo je přepínač segmentů — „Klíčové" zobrazuje pouze výsledky s vysokou spolehlivostí, „Vše" zobrazuje vše
- Vpravo je rozevírací seznam kategorií se 24 kategoriemi (frontendové frameworky / UI frameworky / CDN / WAF / systémy pro správu webu / ...). Výběrem konkrétní kategorie se zobrazí pouze výsledky z dané kategorie. Každá volba zobrazuje počet (např. „Systémy pro správu webu · 4")

## Seznam technologií

Každá technologie má vlastní kartu:

```text
React                                         [Vysoká spolehlivost]
- DOM uzel obsahuje označení React Fiber
- URL zdroje odpovídá cdn.example.com/react.production.min.js
Zdroj: Hlavička odpovědi  Dynamické sledování
Detekce je nepřesná, klikněte pro opravu
```

- **Název technologie**: kliknutelný, přejde na oficiální web nebo repozitář technologie (při najetí myší se vpravo zobrazí ikona externího odkazu)
- **Indikátor spolehlivosti**: vysoká (zelená) / střední (žlutá) / nízká (šedá)
- **Důkazy**: max. 4 řádky zobrazující fragmenty DOM / zdrojů / hlaviček odpovědí, na jejichž základě rozšíření dospělo k danému závěru
- **Zdroj**: každý štítek je kliknutelný — **kliknutím se ve spodní části otevře zásuvka zobrazující surová JSON data pouze pro tuto technologii a tento zdroj**
- **Tlačítko pro opravu**: kliknutím se otevře formulář GitHub Issue s předvyplněnými výsledky detekce pro snadné hlášení falešných pozitiv / negativů

::: tip
Pokud stránka detekuje mnoho obsahu, začněte zobrazením „Klíčové". Zobrazuje pouze výsledky s vysokou spolehlivostí. Při kontrole falešných pozitiv nebo zobrazení celého technologického stacku přepněte na „Vše".
:::

## Dolní panel nástrojů

```text
[Hledat]  [Surové stopy]  [Kopírovat vše]                      GitHub
```

Tlačítka nástrojů vlevo — podrobnosti viz [Pomocné nástroje](./tools.md). Vyhledávání a surové stopy otevírají panel ze spodní části; dalším kliknutím na stejné tlačítko nebo tlačítkem zavřít v panelu jej skryjete. Kopírovat vše zapíše kompletní zprávu o technologickém stacku přímo do schránky.

## Chování při posouvání

Celková výška vyskakovacího okna je uzamčena na 600 px a posouvat se může pouze **oblast se seznamem technologií**. Horní panel nástrojů, přehledová data a lišta filtrování kategorií jsou vždy viditelné.

Při posunutí seznamu o přibližně 240 px dolů se v pravém dolním rohu zobrazí kulaté tlačítko (šipka nahoru). Kliknutím plynule přejdete zpět na začátek.
