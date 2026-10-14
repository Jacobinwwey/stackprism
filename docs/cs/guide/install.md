# Instalace a aktivace

StackPrism je určen pro prohlížeče na jádře Chromium (Chrome, Edge, Brave, Opera, Vivaldi, Arc aj.) a vyžaduje podporu Manifest V3.

## Instalace z obchodu s rozšířeními

- [Chrome Web Store](https://chromewebstore.google.com/detail/stackprism/cagpdifljieeiajlhlcboelglkalofak)
- [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/stackprism/ojgmhlogaoiegdonnlnibeoikbleccno)
- [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/stackprism/)

Pokud prohlížeč nelze rozpoznat automaticky, vyberte odpovídající obchod.

## Způsob 1: Stažení CRX ze stránky Release

1. Otevřete [GitHub Releases](https://github.com/setube/stackprism/releases)
2. Vyberte nejnovější verzi a stáhněte `stackprism-v{version}.crx`
3. Do adresního řádku prohlížeče zadejte `chrome://extensions/` (v Edge `edge://extensions/`), zapněte „Režim pro vývojáře" v pravém horním rohu
4. Přetáhněte stažený soubor `.crx` na stránku s rozšířeními
5. V zobrazeném dialogu potvrďte „Přidat rozšíření"

::: tip
Chrome někdy blokuje instalaci přetažením souboru .crx (zobrazí hlášení „Aplikace, rozšíření a uživatelské skripty z tohoto webu nelze přidat"). V takovém případě použijte způsob 2.
:::

## Způsob 2: Stažení ZIP ze stránky Release a načtení rozbalené složky

1. Otevřete [GitHub Releases](https://github.com/setube/stackprism/releases) a stáhněte `stackprism-v{version}.zip`
2. Rozbalte archiv do stabilní složky (**nesmazat — rozšíření tuto složku ke svému běhu potřebuje**)
3. Otevřete `chrome://extensions/` a zapněte „Režim pro vývojáře"
4. Klikněte na „Načíst rozbalené rozšíření"
5. Vyberte právě rozbalenou složku

## Způsob 3: Lokální sestavení ze zdrojového kódu

Vhodné pro vývojáře nebo uživatele, kteří chtějí sledovat nejnovější větev main.

```bash
git clone https://github.com/setube/stackprism.git
cd stackprism
bun install
bun run build
```

Výstup sestavení je ve složce `dist/`. V režimu pro vývojáře na `chrome://extensions/` načtěte složku `dist/`.

Po úpravě zdrojového kódu stačí znovu spustit `bun run build` a na stránce rozšíření kliknout na tlačítko obnovení u karty rozšíření, čímž se načte nová verze.

## Aktivace a oprávnění

Při prvním instalaci si rozšíření vyžádá následující oprávnění:

| Oprávnění    | Účel                                                                 |
| ------------ | -------------------------------------------------------------------- |
| `tabs`       | Čtení URL / titulku aktuální záložky                                 |
| `activeTab`  | Vložení detekčního skriptu do aktuálně aktivní stránky               |
| `scripting`  | Vložení page-detector / page-source-search do hlavního světa stránky |
| `storage`    | Ukládání nastavení, mezipaměti výsledků detekce a preferencí motivu  |
| `webRequest` | Sledování hlaviček odpovědí pro sběr server / x-powered-by aj.       |
| `<all_urls>` | Provoz na všech http(s) stránkách                                    |

Detekce nevyžaduje žádné externí API: soubory pravidel jsou přibaleny k rozšíření lokálně a výsledky detekce zůstávají výhradně v paměti prohlížeče a úložišti rozšíření.

## Odinstalace

`chrome://extensions/` → najděte StackPrism → Odebrat. Nastavení a mezipaměť budou smazány.
