# Sestavení a vydání

## Lokální sestavení

```bash
bun install
bun run build
```

Postup sestavení:

1. `bun run build:injected` (`build-scripts/build-injected.mjs`): esbuild zkompiluje `src/injected/page-detector.ts` a `page-source-search.ts` každý do samostatného IIFE souboru, výstup do `public/injected/`
2. `vite build` (`@crxjs/vite-plugin`): zabalí čtyři vstupní body — background / popup / settings / help — do `dist/`
3. `precompileRulesPlugin` (vite plugin hook closeBundle): projde `dist/rules/*.json` a do každého listového pravidla vloží `__hints` / `__legacyHints` / `__keywordCombined`
4. `minifyJsonAssets` (vite plugin hook closeBundle): přepíše všechny JSON soubory pomocí `JSON.stringify(parsed)`, čímž odstraní odsazení a zalomení řádků

Výsledný adresář `dist/` lze přímo načíst v `chrome://extensions/` v režimu pro vývojáře.

## Hot reload při vývoji

```bash
bun run dev
```

Vite dev server + crxjs HMR: změny v `src/ui/**` (vyskakovací okno / nastavení / nápověda) se automaticky nahradí. Po změně kódu na pozadí v `src/background/**` nebo content scriptu je nutné v `chrome://extensions/` ručně kliknout na tlačítko obnovení na kartě rozšíření.

## Typová kontrola a lint

```bash
bun run typecheck    # vue-tsc --noEmit, striktní typová kontrola celého projektu
bun run lint         # eslint src
```

Před odevzdáním spusťte jednotné formátování:

```bash
npx prettier --write .
```

## Správa verzí

Pole `version` v souboru `package.json` je jediným zdrojem pravdy. `@crxjs/vite-plugin` jej automaticky synchronizuje do `dist/manifest.json`.

Běžné funkce, pravidla a opravy navyšují patch verzi. Po dosažení hodnoty `99` se přejde na nový minor — číslo verze `1.1.100` se nepoužívá:

```bash
# 1.1.98 -> 1.1.99
# 1.1.99 -> 1.2.0
```

GitHub Release se vytváří pouze pro verze, u nichž se vydává instalační balíček: `x.y.0`, `x.y.10`, `x.y.20`, ..., `x.y.90`. Například verze `1.2.0` a `1.2.10` se vydávají, verze `1.2.5` a `1.2.15` nikoliv.

```bash
# po úpravě verze v package.json
git add package.json
git commit -m "chore: bump 1.2.10"
git push origin main
```

## Pracovní postup GitHub Release

`.github/workflows/release-extension.yml` se spouští ve dvou případech:

1. Publikování release v uživatelském rozhraní GitHubu (událost `release: published`)
2. Ruční spuštění workflow_dispatch na stránce Actions (lze volitelně předat vstup release_tag)

Kroky pracovního postupu:

1. checkout + instalace bun + Node 20
2. `bun install --frozen-lockfile`
3. `bun run build`
4. Načtení verze z `dist/manifest.json` a ověření shody s tagem release
5. Zabalení celého adresáře `dist/` do `stackprism-v{ver}.zip` + sha256
6. **Pokud je nakonfigurován secret `EXTENSION_PRIVATE_KEY`**, podepsání pomocí `npx crx3` a vytvoření `stackprism-v{ver}.crx` + sha256; jinak se přeskočí a nahraje se pouze zip
7. `gh release upload --clobber` — nahrání všech artefaktů k tagu release
8. `actions/upload-artifact` — záloha artefaktu

## Poznámky k vydání

Poznámky k vydání se sestavují z výstupu `git log --oneline vPREV..HEAD` mezi předchozím tagem release a aktuálním commitem — není to přímé nakopírování seznamu commitů. Obsah je tříděn tak, aby byl srozumitelný pro uživatele, například:

- Vylepšení pravidel
- Vyskakovací okno a stránka nastavení
- Web s dokumentací
- Sestavení a pracovní postup vydání

Poznámky k vydání zahrnují pouze změny relevantní pro uživatele nebo správce; nezmiňují lokální formátování, typovou kontrolu, lint nebo příkazy sestavení.

## Podpisový klíč CRX

Před prvním vydáním je nutné vygenerovat RSA privátní klíč a nakonfigurovat jej v secrets repozitáře na GitHubu.

### Generování privátního klíče

```bash
openssl genrsa -out extension.pem 2048
```

::: warning
Soubor `extension.pem` **nesmí být ztracen** — jeho ztráta a opětovné vygenerování změní ID rozšíření (Chrome jej bude považovat za jiné rozšíření). Uchovejte lokální zálohu.
:::

### Konfigurace na GitHubu

1. Nastavení repozitáře → Secrets and variables → Actions → New repository secret
2. Název: `EXTENSION_PRIVATE_KEY`
3. Secret: vložte **celý obsah** souboru `extension.pem` (včetně řádků `-----BEGIN PRIVATE KEY-----` a `-----END PRIVATE KEY-----`)
4. Uložte

Pracovní postup bude od té doby automaticky podepisovat crx tímto klíčem.

### Co se stane bez konfigurace

Pracovní postup stále proběhne, ale artefakty nebudou obsahovat soubor `.crx`. Uživatelé budou moci použít pouze instalaci rozbalením zip archivu.

## Kontrolní seznam před vydáním

- [ ] `npx prettier --write .` byl spuštěn
- [ ] `bun run typecheck` prošel
- [ ] `bun run lint` prošel
- [ ] `bun run build` prošel
- [ ] Načtěte `dist/` v Chrome a ručně otestujte klíčové funkce (otevření vyskakovacího okna, detekce webu, obnovení, kopírování kompletní zprávy o technologickém stacku, přidání pravidla na stránce nastavení)
- [ ] Navyšte verzi v `package.json`
- [ ] git commit + push
- [ ] Pokud verze odpovídá bodu vydání, publikujte release v uživatelském rozhraní GitHubu (tag ve formátu `v{version}`, shodný s package.json)
- [ ] Počkejte na dokončení pracovního postupu vydání a ověřte, že artefakty release obsahují zip / crx a sha256

## Publikování do Chrome Web Store

Pracovní postup automaticky nepublikuje rozšíření do Chrome Web Store — API pro publikování v CWS vyžaduje OAuth2 tok, proto se provádí ručně:

1. Zabalte složku `dist/` do zip archivu (stejný zip jako artefakt pracovního postupu)
2. [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) → Nahrát novou verzi
3. Vyplňte poznámky ke změnám a počkejte na schválení (zpravidla 1–3 pracovní dny)
