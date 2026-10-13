# Uso di base

Il popup ha un'altezza fissa di 600px; il corpo principale è l'elenco delle tecnologie. In alto si trovano le informazioni sulla pagina corrente e i controlli di filtro, in basso la ricerca e gli strumenti ausiliari.

## Barra degli strumenti superiore

```text
[StackPrism  URL pagina corrente]    [Tema] [Impostazioni] [Copia] [Aggiorna]
```

- **A sinistra**: nome dell'estensione + versione + URL della pagina corrente (troncato, hover per vedere il testo completo)
- **Quattro pulsanti icona a destra**:
  - **Tema** (icona sole / luna / schermo): clic per scorrere tra "automatico / chiaro / scuro"
  - **Impostazioni**: apre la pagina delle impostazioni (scheda separata)
  - **Copia**: copia l'URL della pagina corrente negli appunti
  - **Aggiorna**: notifica al backend di rilevare nuovamente la pagina corrente; i risultati dalla cache rimangono visibili nel popup durante il processo

## Dati di riepilogo

```text
22 tecnologie    274 risorse    0 intestazioni
```

- **Tecnologie**: numero totale di tecnologie rilevate (deduplicate)
- **Risorse**: numero di URL di risorse caricate dalla pagina (script, stili, iframe, immagini ecc.)
- **Intestazioni**: numero di header utili estratti dalle intestazioni di risposta del documento principale

## Barra di filtro per categoria

```text
[ In evidenza 5  Tutti 22 ]    [ Seleziona categoria ▾ ]
```

- A sinistra il selettore: "In evidenza" mostra solo i risultati ad alta confidenza, "Tutti" mostra tutto
- A destra il menu a tendina delle categorie (24 categorie: framework frontend / UI / CDN / WAF / CMS / ...). Selezionando una categoria specifica vengono mostrati solo i risultati di quella categoria, con il conteggio per ogni opzione (es. "CMS · 4")

## Elenco tecnologie

Ogni tecnologia ha la propria scheda:

```text
React                                         [Alta confidenza]
- Il nodo DOM contiene il marker React Fiber
- URL risorsa corrisponde a cdn.example.com/react.production.min.js
Origine: Intestazioni  Monitoraggio dinamico
Rilevamento impreciso, clicca per correggere
```

- **Nome tecnologia**: cliccabile, porta al sito ufficiale o al repository (appare l'icona link esterno al passaggio del mouse)
- **Indicatore di confidenza**: Alta (verde) / Media (giallo) / Bassa (grigio)
- **Prove**: fino a 4 righe con i frammenti DOM / risorse / intestazioni che hanno portato al rilevamento
- **Origine**: ogni etichetta è cliccabile — **cliccandola si apre un pannello in basso con il sottoinsieme di dati JSON grezzi per quella tecnologia e quella origine**
- **Pulsante correzione**: apre un modulo GitHub Issue precompilato con questo risultato, per segnalare falsi positivi o mancati rilevamenti

::: tip
Se una pagina restituisce molti risultati, guarda prima la vista "In evidenza". Mostra solo i risultati ad alta confidenza; per analizzare falsi positivi o vedere lo stack tecnologico completo, passa a "Tutti".
:::

## Barra degli strumenti inferiore

```text
[Cerca]  [Indizi grezzi]  [Copia tutto]                      GitHub
```

Pulsanti degli strumenti a sinistra, dettagli in [Strumenti ausiliari](./tools.md). Cerca e Indizi grezzi aprono un pannello dal basso; clicca di nuovo lo stesso pulsante o il pulsante di chiusura nel pannello per chiuderlo. Copia tutto copia direttamente il report completo dello stack tecnologico negli appunti.

## Comportamento di scorrimento

Il popup ha un'altezza fissa di 600px; solo la **zona dell'elenco tecnologie** scorre internamente. La barra degli strumenti superiore, il riepilogo e la barra di filtro per categoria rimangono sempre visibili.

Quando si scorre l'elenco per più di circa 240px, in basso a destra appare un pulsante circolare (freccia su) che al clic scorre uniformemente fino alla cima.
