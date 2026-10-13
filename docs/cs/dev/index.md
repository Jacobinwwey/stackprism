# Vývojářský manuál

Tato část je určena pro ty, kdo chtějí prozkoumat zdrojový kód, upravit pravidla nebo přispět pull requestem. Pokud chcete rozšíření pouze nainstalovat, postačí [Uživatelský průvodce](/cs/guide/).

## Kapitoly

- [Přehled architektury](./architecture.md) — adresářová struktura projektu, odpovědnosti jednotlivých modulů, datový tok
- [Formát souborů pravidel](./rule-format.md) — jak jsou organizovány JSON soubory v adresáři `public/rules/`, vnořené skupiny a dědičnost výchozích hodnot
- [Průběh detekce](./detection-flow.md) — od webRequest / vložení skriptu do stránky až po vykreslení vyskakovacího okna
- [Přispívání pravidel](./contribute-rules.md) — jak přidat novou technologii do vestavěné sady pravidel
- [Sestavení a vydání](./release.md) — lokální sestavení, balíčkování, podpis crx, pracovní postup pro vydání

## Přehled technologického stacku

Jádro projektu tvoří Vite 5 + Vue 3 + TypeScript + `@crxjs/vite-plugin` 2.x. Skript na pozadí je Manifest V3 ESM service worker, správce balíčků je pnpm.

Pravidla jsou uložena v adresáři `public/rules/` rozdělena do více JSON souborů podle zaměření — pravidla pro stránky, pravidla pro hlavičky odpovědí, ekosystém WordPress / Drupal a další. Při sestavení se pravidla předpracují a vloží se do nich pole `__hints` / `__legacyHints` / `__keywordCombined` sloužící k urychlení porovnávání.

## Běžné příkazy pro vývoj

```bash
pnpm install            # instalace závislostí
pnpm run dev            # spuštění vite dev serveru s hot reload pro rozšíření
pnpm run build          # sestavení do dist/ pro načtení do Chrome
pnpm run typecheck      # striktní typová kontrola přes vue-tsc
pnpm run lint           # kontrola ESLint
pnpm run docs:dev       # lokální náhled tohoto webu s dokumentací
pnpm run docs:build     # sestavení statické stránky dokumentace
```

V režimu dev podporují stránky rozšíření hot reload. Změny v popup / settings / help se zpravidla aktualizují automaticky; po změně souborů `src/background/` nebo content scriptu je nutné na stránce `chrome://extensions/` ručně kliknout na tlačítko obnovení na kartě rozšíření.

## Vstupní body Vue

Tři samostatné vstupní body SPA, sestavené nezávisle na sobě:

| Vstupní bod | Soubor                       | Popis                                                               |
| ----------- | ---------------------------- | ------------------------------------------------------------------- |
| popup       | `src/ui/popup/index.html`    | Malé okno 440 × 600 px, které se otevře kliknutím na ikonu rozšíření v prohlížeči |
| settings    | `src/ui/settings/index.html` | Stránka možností (options page) otevřená z detailního pohledu na `chrome://extensions/` |
| help        | `src/ui/help/index.html`     | Samostatná záložka otevřená kliknutím na „Nápověda" na stránce nastavení |

## Relevantní odkazy

- [Repozitář na GitHubu](https://github.com/setube/stackprism)
- [Seznam issues](https://github.com/setube/stackprism/issues)
- [Seznam releases](https://github.com/setube/stackprism/releases)
