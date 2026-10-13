# Interpretace výsledků

## Spolehlivost

Každá technologie má indikátor spolehlivosti se třemi úrovněmi:

| Úroveň      | Barva  | Význam                                                                                                                            |
| ----------- | ------ | --------------------------------------------------------------------------------------------------------------------------------- |
| **Vysoká**  | Zelená | Nalezen silný signál: globální proměnná (např. `window.React`), exkluzivní DOM selektor, jednoznačná URL zdroje (např. `/_next/`) |
| **Střední** | Žlutá  | Nalezen střední signál: přibližná shoda hlavičky odpovědi, prefix CSS třídy, sada CSS proměnných                                  |
| **Nízká**   | Šedá   | Nalezen slabý signál: obecný záložní název souboru skriptu (např. `*.min.js`), vágní regulární výraz                              |

Ve výchozím stavu zobrazuje záložka „Klíčové" pouze výsledky s vysokou spolehlivostí.

## Důkazy

Na kartě se zobrazí nejvýše 4 řádky důkazů. Mezi běžné důkazy patří DOM značky, URL zdrojů, hlavičky odpovědí a záznamy o dynamickém načítání, například:

```text
- DOM uzel obsahuje označení React Fiber
- URL zdroje odpovídá unpkg.com/react@18.2.0/umd/react.production.min.js
- Hlavička odpovědi X-Powered-By: Next.js
```

Při výskytu falešného pozitivu se nejprve podívejte na důkazy. Obvykle prozradí, zda problém spočívá v pravidle pro zdroje, pravidle pro hlavičky odpovědí, nebo v příliš obecné shodě DOM / třídy.

## Zdroj

Štítek zdroje označuje, odkud byl výsledek detekován:

| Štítek zdroje                        | Pochází z                                                                                  |
| ------------------------------------ | ------------------------------------------------------------------------------------------ |
| `Hlavičky odpovědí`                  | HTTP hlavičky odpovědi hlavního dokumentu (server / x-powered-by / set-cookie aj.)         |
| `Hlavičky odpovědí · API`            | Hlavičky odpovědi některého XHR / fetch požadavku aktuální stránky                         |
| `Hlavičky odpovědí · iframe`         | Hlavičky odpovědi hlavního dokumentu vnořeného iframe                                      |
| `Dynamické sledování`                | Zdroje / dynamicky načítané skripty průběžně zachycené content scriptem + MutationObserver |
| `Dynamické sledování · po interakci` | Zdroje načtené až po akci uživatele (vyskakovací okno, přihlášení, platba)                 |
| `Téma WordPress`                     | Zpětná rekonstrukce z hlavičky souboru style.css tématu                                    |

**Kliknutím na jakýkoli štítek zdroje** se v dolní části otevře panel zobrazující podmnožinu surových JSON dat **pro danou technologii a daný zdroj**. Zobrazí přímo surové hlavičky odpovědí, seznam URL zdrojů nebo dynamický snímek, aniž byste museli prohledávat celý JSON.

## Řazení

Výchozí pořadí řazení:

1. Index kategorie (frontendové frameworky → UI frameworky → build/runtime → CDN → ...)
2. Uvnitř kategorie sestupně podle spolehlivosti (vysoká → střední → nízká)
3. Při stejné spolehlivosti abecedně podle názvu technologie pomocí localeCompare

Při přepnutí na konkrétní kategorii se řadí pouze v rámci dané kategorie. Záložka „Klíčové" zobrazuje všechny technologie s vysokou spolehlivostí; pokud žádná s vysokou spolehlivostí neexistuje, záloha zobrazí horních 30 technologií ze všech seřazených sestupně podle spolehlivosti.

## Sloučení duplicit

Pokud je stejná technologie detekována z více zdrojů (např. React se objeví jak v hlavičkách odpovědí, tak v DOM), nezobrazí se vícekrát — sloučí se do jednoho záznamu. Spolehlivost se vezme z nejsilnějšího zdroje, pole důkazů se sloučí a deduplikují a pole sources vypíše všechny detekované zdroje.

## Absence detekce neznamená absenci technologie

Nástroj detekuje „**jaké stopy webová stránka odhaluje prohlížeči**". Pokud stránka:

- Odstraní všechny stopy za běhu po dokončení SSR (např. staticky pre-renderované weby Astro)
- Zcela vyprázdní vlastní hlavičky serveru
- Zahashuje názvy souborů bundlu bez původních názvů frameworku

... rozšíření může detekovat jen velmi málo, nebo vůbec nic. Zpravidla to neznamená, že pravidla jsou neúplná — stránka prostě neodhalila prohlížeči dostatečné stopy.

Stopy frontendového buildování také neodpovídají backendu za běhu. Například přítomnost `/_next/`, `/_nuxt/` nebo výstupu Vite vypovídá pouze o frontendovém buildovacím řetězci — z toho nelze přímo usuzovat, že serverový backend běží na Node.js. Backendový jazyk se zpravidla identifikuje pomocí hlaviček `Server`, `X-Powered-By`, názvů cookies nebo frameworkově specifických hlaviček odpovědí.

## Tlačítko pro opravu

Tlačítko „Detekce je nepřesná, klikněte pro opravu" na každé kartě otevře GitHub Issue s předvyplněnými informacemi:

- URL aktuální stránky
- JSON tohoto výsledku detekce
- Zobrazené důkazy
- Číslo verze rozšíření

V popisu stačí uvést „co je špatně" nebo „co by mělo být detekováno". Správce poté upraví příslušné pravidlo v adresáři [`rules/`](https://github.com/setube/stackprism/tree/main/public/rules).
