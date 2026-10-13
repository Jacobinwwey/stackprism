# Disabilita tecnologie specifiche

I selettori di rilevamento filtrano per categoria; se vuoi escludere solo alcune tecnologie specifiche senza disabilitare un'intera categoria, usa questo campo di testo.

## Utilizzo

Una tecnologia per riga, il nome non distingue maiuscole/minuscole e gli spazi iniziali/finali vengono rimossi automaticamente:

```text
Google Analytics
Baidu Analytics
WordPress Plugin: akismet
Cloudflare
```

Dopo il salvataggio, queste tecnologie non appariranno più nell'elenco principale del popup, indipendentemente dalla categoria, dal livello di confidenza e dall'origine.

::: tip
Il confronto dei nomi usa `normalizeTechName(name)`: rimuove spazi, converte in minuscolo, rimuove la punteggiatura. Quindi `WordPress` e `wordpress` sono equivalenti, così come `Google Analytics` e `google-analytics`.
:::

## Scenari di esclusione comuni

- **Conosci già una tecnologia usata da un sito e non vuoi vederla**: il tuo sito non ha bisogno di mostrare Cloudflare / Vercel a ogni controllo
- **Evitare falsi positivi**: una regola di rilevamento ha un tasso di errore elevato e non vuoi aspettare la correzione — escludila temporaneamente
- **Semplificare l'output**: escludi risultati generici come RSS / Atom / Service Worker / HTTPS per rendere la lista più mirata

## Priorità tra esclusione e selettori di rilevamento

I due meccanismi **si sommano**: prima viene applicato il filtro dei selettori di categoria, poi quello della lista di esclusione.

## Relazione con gli indizi grezzi

Le tecnologie disabilitate **vengono solo nascoste**, non rimosse dal JSON grezzo. Il pannello "Indizi grezzi" mostra ancora i dati completi, per una verifica successiva.

## Esempio

Supponi di voler vedere solo i CDN diversi da Cloudflare, mantenendo attivo il rilevamento di tutti i CDN. Imposta:

```text
Cloudflare
```

Cloudflare non apparirà più nel popup, ma Akamai / Fastly e gli altri CDN saranno ancora presenti.
