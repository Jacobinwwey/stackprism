# Interpretazione dei risultati

## Livello di confidenza

Ogni tecnologia ha un indicatore di confidenza con tre livelli:

| Livello  | Colore | Significato                                                                                                 |
| -------- | ------ | ----------------------------------------------------------------------------------------------------------- |
| **Alta** | Verde  | Segnale forte: variabile globale (es. `window.React`), selettore DOM specifico, URL risorsa esplicito (es. `/_next/`) |
| **Media**| Giallo | Segnale medio: corrispondenza approssimativa intestazioni di risposta, prefisso classe CSS, insieme di variabili CSS   |
| **Bassa**| Grigio | Segnale debole: fallback su nome file script generico (es. `*.min.js`), regex generica                       |

Nella vista "In evidenza" vengono mostrati per default solo i risultati ad alta confidenza.

## Prove

La scheda mostra al massimo 4 righe di prove. Le prove più comuni includono markup DOM, URL risorse, intestazioni di risposta e record di caricamento dinamico, ad esempio:

```text
- Il nodo DOM contiene il marker React Fiber
- URL risorsa corrisponde a unpkg.com/react@18.2.0/umd/react.production.min.js
- Intestazione di risposta X-Powered-By: Next.js
```

In caso di falso positivo, controlla prima le prove. Di solito indicano se il problema riguarda una regola sulle risorse, una regola sulle intestazioni, o un matching DOM/class troppo ampio.

## Origine

L'etichetta di origine indica da dove è stato rilevato il risultato:

| Etichetta origine                  | Provenienza                                                              |
| ---------------------------------- | ------------------------------------------------------------------------ |
| `Intestazioni`                     | Intestazioni HTTP del documento principale (server / x-powered-by / set-cookie ecc.) |
| `Intestazioni · API`               | Intestazioni di risposta di una richiesta XHR / fetch dalla pagina       |
| `Intestazioni · iframe`            | Intestazioni del documento principale di un iframe annidato              |
| `Monitoraggio dinamico`            | Risorse / script caricati dinamicamente, raccolti da content script + MutationObserver |
| `Monitoraggio dinamico · post-interazione` | Risorse caricate dopo un'azione dell'utente (popup, login, pagamento) |
| `Tema WordPress`                   | Dedotto dall'header dello style.css del tema                             |

**Cliccando su qualsiasi etichetta di origine** si apre un pannello in basso con il sottoinsieme di dati JSON grezzi corrispondente a **quella tecnologia e quella origine**. Mostra direttamente le intestazioni grezze, l'elenco degli URL delle risorse o lo snapshot dinamico, senza dover cercare nel JSON completo.

## Ordinamento

Regole di ordinamento predefinite:

1. Indice di categoria (framework frontend → framework UI → runtime di build → CDN → ...)
2. All'interno della stessa categoria, per confidenza decrescente (Alta → Media → Bassa)
3. A parità di confidenza, per nome tecnologia con localeCompare

Selezionando una categoria specifica, l'ordinamento si applica solo a quella categoria. La vista "In evidenza" raccoglie tutte le tecnologie ad alta confidenza; se non ce n'è nessuna, prende le prime 30 per confidenza decrescente dall'elenco completo.

## Deduplicazione

Se la stessa tecnologia viene rilevata da più origini (ad es. React compare sia nelle intestazioni sia nel DOM), non viene mostrata più volte — viene unita in una voce sola, con la confidenza più alta, le prove combinate e deduplicate, e l'array delle origini con tutte quelle corrispondenti.

## Nessun rilevamento non significa assenza

Lo strumento rileva "**cosa la pagina espone al browser**". Se un sito:

- Rimuove tutte le tracce del runtime dopo l'SSR (es. siti Astro pre-renderizzati staticamente)
- Svuota tutti gli header di risposta personalizzati
- Applica hash ai nomi dei file bundle senza includere il nome originale del framework

il plugin potrebbe rilevare pochissimo o nulla. Di solito non è una mancanza delle regole, ma il fatto che la pagina non ha esposto abbastanza indizi al browser.

Gli indizi del build frontend non equivalgono al runtime backend. La presenza di `/_next/`, `/_nuxt/` o artefatti Vite indica solo la pipeline di build frontend; non si può dedurre direttamente che il server usi Node.js. Il linguaggio backend si ricava generalmente da `Server`, `X-Powered-By`, nomi dei cookie o intestazioni specifiche del framework.

## Pulsante di correzione

Il pulsante "Rilevamento impreciso, clicca per correggere" su ogni scheda apre una segnalazione GitHub Issue precompilata con:

- URL della pagina corrente
- JSON di questo risultato di rilevamento
- Le prove visualizzate
- Versione dell'estensione

Nella descrizione indica "cosa non va" o "cosa dovrebbe essere rilevato". Il manutentore modificherà la regola corrispondente in [`rules/`](https://github.com/setube/stackprism/tree/main/public/rules).
