# Přispívání pravidel

## Způsoby přispívání

Příspěvky se dělí do dvou kategorií:

1. **Rychlá zpětná vazba**: klikněte na tlačítko „Detekce je nepřesná, klikněte pro opravu" na příslušné kartě technologie ve vyskakovacím okně — automaticky se otevře GitHub Issue s předvyplněným kontextem (URL stránky, aktuální výsledky porovnávání pravidel, verze rozšíření). Správce poté pravidla upraví.
2. **Přímý pull request**: forkujte repozitář, upravte příslušný JSON v `public/rules/`, lokálně ověřte a podejte PR.

Níže je popsán postup pro přímý pull request.

## Nalezení správného souboru

Soubory v `public/rules/` jsou rozděleny podle zaměření:

| Soubor                               | Co obsahuje                                                   |
| ------------------------------------ | ------------------------------------------------------------- |
| `page/frontend-frameworks.json`      | React / Vue / Angular / různé frontendové frameworky          |
| `page/ui-frameworks.json`            | Tailwind / Bootstrap / Element / Antd a podobné UI knihovny   |
| `page/build-runtime.json`            | Webpack / Vite / Rollup / Bun a podobné buildovací nástroje   |
| `page/frontend-cdn-libraries.json`   | Konkrétní frontendové knihovny přes CDN (jQuery, lodash, moment aj.) |
| `page/wordpress-plugins.json`        | 4 500+ pluginů WordPress                                      |
| `page/drupal-modules.json`           | 4 000+ modulů Drupal                                          |
| `page/cms-themes.json`               | Témata CMS                                                    |
| `page/website-programs.json`         | WordPress / Drupal / Discuz! a podobné CMS samotné            |
| `page/payment-systems.json`          | Platební platformy                                            |
| `page/third-party-logins.json`       | Přihlášení třetích stran                                      |
| `page/saas-services.json`            | SaaS služby (Sentry / Mixpanel / Intercom aj.)                |
| `page/analytics-providers.json`      | Analytika                                                     |
| `page/cdn-providers.json`            | Poskytovatelé CDN (detekce za běhu v prohlížeči)              |
| `headers/server-products.json`       | Serverové produkty identifikované podle hlavičky `Server:`    |
| `headers/cdn-providers.json`         | CDN identifikované podle hlaviček odpovědí                    |
| `headers/website-programs.json`      | CMS identifikované podle hlaviček odpovědí                    |
| ...                                  |                                                               |

Úplný seznam viz `public/rules/index.json`.

## Minimální příklad nového pravidla

Předpokládejme, že chcete přidat detekci pro ExampleCMS. V souboru `page/website-programs.json` najděte vhodnou skupinu (např. „samohostované CMS") a přidejte záznam:

```json
{
  "name": "ExampleCMS",
  "url": "https://examplecms.example.com",
  "patterns": ["examplecms-[0-9.]+\\.min\\.js", "/_examplecms/"],
  "globals": ["ExampleCMS"],
  "selectors": ["[data-powered-by='examplecms']"]
}
```

Popis polí viz [Formát souborů pravidel](./rule-format.md).

## Do které skupiny?

Po otevření příslušného JSON souboru uvidíte vnořenou strukturu skupin:

```json
{
  "page": {
    "websitePrograms": {
      "defaults": { "category": "网站程序" },
      "rules": [
        {
          "defaults": { "confidence": "高" },
          "rules": [
            // řada CMS s vysokou spolehlivostí
          ]
        },
        {
          "defaults": { "confidence": "中" },
          "rules": [
            // řada CMS se střední spolehlivostí
          ]
        }
      ]
    }
  }
}
```

Podle svého úsudku o spolehlivosti detekce zařaďte pravidlo do příslušné podskupiny. Pořadí pravidel v poli rules neovlivňuje výsledky detekce — má vliv jen na přehlednost při procházení.

## Ověření pravidla

Po provedení úprav spusťte:

```bash
pnpm run build
```

Sestavení spustí `precompileRulesPlugin`, který do pravidel vloží pole `__hints` a další. Poté v `chrome://extensions/` načtěte `dist/` a ověřte pravidlo na skutečném webu s ExampleCMS.

Alternativně lze pravidlo nejprve vyzkoušet na panelu „Vlastní pravidla" v uživatelské konfiguraci; po ověření funkčnosti jej přeneste do `public/rules/`.

## Snížení počtu falešných pozitiv

- **Upřednostňujte globals**: shoda s `window.X` je nejspolehlivější — falešná pozitiva jsou téměř nulová
- **Upřednostňujte exkluzivní selektory**: atributy jako `[data-powered-by='examplecms']` nebo `[ng-version]`, které technologie jednoznačně zapisuje do stránky
- **Vzory pro zdroje pište jako úplné domény nebo úplné cesty**: `cdn.examplecms.com/sdk.js` je spolehlivější než `examplecms`
- **U classNames / classPrefixes používejte předpony**: `example-cms-` místo `cms-`, aby nedošlo ke kolizi s projekty, které používají obecný název třídy `cms-`
- **Přidávejte kotvy do regulárních výrazů**: `^/_examplecms/` je přesnější než `/_examplecms/`
- **Spolehlivost raději podhodnoťte**: při nejistotě použijte „Střední" — uživatel ve vyskakovacím okně uvidí žlutý indikátor místo zeleného, což zamezí zavádějícím závěrům

## Postup pro přispění pravidel do hlavního repozitáře

1. Forkujte [setube/stackprism](https://github.com/setube/stackprism)
2. Naklonujte lokálně, spusťte `pnpm install` a `pnpm run build` a ověřte, že sestavení proběhne správně
3. Najděte příslušný soubor v `public/rules/` a přidejte pravidlo
4. Z [Wappalyzer rules](https://github.com/enthec/webappanalyzer), oficiální dokumentace nebo webu technologie získejte 2–3 důkazy a uveďte je v popisu PR
5. Podejte PR do větve main

V popisu PR jasně uveďte, které technologie přibývají, na jakém webu jste je ověřili a proč tyto znaky nemohou způsobit falešná pozitiva na jiných webech.
