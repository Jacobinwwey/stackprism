<div align="center">

[🇨🇳 简体中文](PRIVACY.zh-CN.md) · [🇬🇧 English](PRIVACY.en.md) · [🇹🇼 繁體中文](PRIVACY.zh-TW.md) · [🇯🇵 日本語](PRIVACY.ja.md) · [🇫🇷 Français](PRIVACY.fr.md) · [🇩🇪 Deutsch](PRIVACY.de.md) · [🇧🇷 Português](PRIVACY.pt.md) · [🇮🇹 Italiano](PRIVACY.it.md) · **🇨🇿 Čeština** · [🇵🇱 Polski](PRIVACY.pl.md)

</div>

# StackPrism Zásady ochrany osobních údajů

Poslední aktualizace: 2026-05-12

## Přehled

StackPrism (dále jen „rozšíření") je rozšíření prohlížeče pro identifikaci technologického stacku webových stránek, založené na Chrome / Edge Manifest V3. Rozšíření si velmi váží vašeho soukromí — veškeré zpracování dat probíhá lokálně ve vašem prohlížeči, **žádná vaše data nejsou nahrávána, sdílena ani prodávána žádnému vzdálenému serveru**.

## Přistupovaná data

Za účelem plnění jediné funkce „identifikace technologického stacku aktuálně navštívené stránky" rozšíření **lokálně čte** při vašem aktivním přístupu na webovou stránku následující informace. Veškerý přečtený obsah je **zpracován pouze v paměti prohlížeče nebo v chrome.storage** a nikdy neopustí váš prohlížeč.

### 1. Obsah webu

- Struktura DOM uzlů, CSS názvy tříd, CSS proměnné a tagy `<meta>` aktuálně navštívené stránky
- Názvy globálních proměnných injektovaných `<script>` do objektu `window` stránky (čtou se pouze názvy, ne hodnoty)
- URL zdrojů jako JavaScript / CSS / iframe / obrázky načtené stránkou
- Prvních několik bajtů JavaScript souborů **již načtených** na stránce (prostřednictvím mezipaměti prohlížeče, bez dodatečné síťové komunikace), pro identifikaci copyrightových komentářů `/*! @license ... */` a OAuth URL vložených do SPA

### 2. Síťové záznamy

- URL a název aktuálně navštívené stránky
- Hlavičky odpovědí (pole Server, X-Powered-By, Set-Cookie atd.) požadavků XHR / Fetch / iframe / WebSocket iniciovaných stránkou
- Verze HTTP protokolu (HTTP/1.1 / HTTP/2 / HTTP/3) dojednané stránkou

## Použití dat

Výše uvedená data jsou použita **výhradně** pro:

- Lokální porovnání s vestavěnou databází pravidel rozšíření pro identifikaci frontendových frameworků, backendových služeb, CDN, CMS, přihlašovacích, platebních, analytických a dalších technologických stacků použitých na stránce
- Zobrazení výsledků identifikace vám ve vyskakovacím okně rozšíření

## Uložení dat

- **Výsledky identifikace**: ukládány pouze v `chrome.storage.session`, zničeny po zavření prohlížeče, každá karta ukládá samostatně
- **Vaše nastavení** (zakázané kategorie, název technologie na černé listině, vlastní pravidla, preference motivu atd.): ukládána v `chrome.storage.sync`, šifrovaně synchronizována prohlížečem na váš účet Google / Microsoft; rozšíření **nemá přístup** k žádným jiným datům ve vašem účtu
- Rozšíření **neukládá** úplné HTML stránky, úplné hodnoty Cookie, přihlašovací údaje, obsah formulářů, hesla ani jakékoli jiné citlivé informace

## Přenos dat

- Rozšíření **nenahrává** vaše data o prohlížení, výsledky identifikace, osobní informace ani žádná jiná data na žádný vzdálený server
- Žádná telemetrie, žádné reklamní SDK, žádné analytiky třetích stran, žádné hlášení chyb do cloudu
- Rozšíření iniciuje pouze dva typy síťových požadavků, **žádný** neobsahuje vaše identifikační informace ani data o prohlížení:
  1. Asynchronní načtení prvního úseku několika málo JS souborů **již načtených aktuálně navštívenou stránkou** (prostřednictvím mezipaměti prohlížeče, bez dodatečné síťové komunikace), pro lokální skenování copyrightových komentářů a OAuth URL v daném JS
  2. Ikony technologických značek jsou **preferenčně načítány z vestavěné knihovny ikon rozšíření** (offline balíček 1300+ SVG / PNG hlavních technologií, bez síťových požadavků); pouze pokud určitá technologie není ve vestavěné knihovně ikon, je záložní ikona načtena z `cdn.simpleicons.org` (tělo požadavku obsahuje pouze jeden veřejný slug názvu technologie, např. react / vuedotjs / docker, bez URL navštívené stránky, výsledků identifikace ani jakýchkoli osobních informací); pokud CDN nenačte do 2 sekund, rozšíření automaticky přejde na lokálně generované barevné bloky s iniciálami a nikdy nezablokuje proces identifikace

## Sdílení s třetími stranami

- Rozšíření **neprodává, nesdílí ani nepřevádí** uživatelská data žádné třetí straně
- Rozšíření **nepoužívá** uživatelská data pro žádné účely nesouvisející s „identifikací technologického stacku"
- Rozšíření **není** určeno pro účely jako půjčky nebo hodnocení úvěruschopnosti

## Vaše oprávnění

Kdykoli můžete:

- Kliknutím na tlačítko „Obnovit" ve vyskakovacím okně rozšíření znovu skenovat aktuální stránku
- Na stránce nastavení rozšíření resetovat mezipaměť pravidel, zakázat libovolnou kategorii, blokovat zadané názvy technologií, přidat vlastní pravidla
- Odinstalovat rozšíření v `chrome://extensions`, přičemž všechna lokálně uložená data budou prohlížečem automaticky smazána

## Otevřený zdrojový kód

Rozšíření je plně open source; kdokoli může auditovat zdrojový kód a ověřit ochranu soukromí:

https://github.com/setube/stackprism

Licence open source je [MIT](https://opensource.org/licenses/MIT).

## Kontakt

V případě jakýchkoli dotazů týkajících se soukromí se obraťte na autora prostřednictvím GitHub Issues:

https://github.com/setube/stackprism/issues

## Změny zásad

Nejnovější verze těchto Zásad ochrany osobních údajů je vždy zveřejněna v [PRIVACY.md](https://github.com/setube/stackprism/blob/main/PRIVACY.md) tohoto repozitáře. V případě podstatných změn bude datum poslední aktualizace odpovídajícím způsobem aktualizováno.
