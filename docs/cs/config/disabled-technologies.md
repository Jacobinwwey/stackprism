# Zakázat konkrétní technologie

Přepínače detekce filtrují podle kategorie. Pokud chcete zablokovat jen několik konkrétně pojmenovaných technologií, aniž byste vypnuli celou kategorii, použijte toto textové pole.

## Použití

Jeden název technologie na řádek. Název nerozlišuje velikost písmen a přední / zadní mezery se automaticky oříznou:

```text
Google Analytics
Baidu Analytics
WordPress Plugin: akismet
Cloudflare
```

Po uložení se tyto technologie přestanou zobrazovat v hlavním seznamu vyskakovacího okna, bez ohledu na jejich kategorii, spolehlivost nebo zdroj.

::: tip
Porovnávání názvů prochází funkcí `normalizeTechName(name)`: odstranění mezer, převod na malá písmena, odstranění interpunkce. Proto jsou `WordPress` a `wordpress` totožné a `Google Analytics` a `google-analytics` jsou totožné.
:::

## Vhodné scénáře pro blokování

- **Víte, že daný web určitou technologii používá a nechcete ji vidět**: vlastní weby, kde nepotřebujete pokaždé vidět Cloudflare / Vercel
- **Zamezení falešným pozitivům**: pravidlo detektor příliš často hlásí falešné pozitivum a nechcete čekat na opravu; dočasně ji zablokujte
- **Zjednodušení výstupu**: zablokujte RSS / Atom / Service Worker / HTTPS a podobné obecné výsledky, aby byl seznam přehlednější

## Priorita blokování vs. přepínačů detekce

Oboje se **kombinuje**: nejprve se aplikují přepínače kategorií, poté seznam zakázaných technologií.

## Vztah k surovým stopám

Zakázané technologie se **jen nezobrazují** — nejsou odstraněny ze surového JSON. Panel „Surové stopy" stále obsahuje kompletní data pro pozdější ověření.

## Příklad

Předpokládejme, že chcete vidět pouze CDN jiné než Cloudflare, ale zachovat detekci všech CDN. Nastavení:

```text
Cloudflare
```

Cloudflare se ve vyskakovacím okně přestane zobrazovat, ale ostatní CDN jako Akamai / Fastly zůstanou.
