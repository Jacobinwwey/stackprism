# Strumenti ausiliari

Il popup ha tre strumenti in basso: "Cerca", "Indizi grezzi" e "Copia tutto". Cerca e Indizi grezzi aprono un pannello dal basso, fino al 60% dell'altezza del popup; clicca di nuovo lo stesso pulsante o il pulsante di chiusura nel pannello per chiuderlo. Copia tutto non apre nessun pannello — copia direttamente il report completo dello stack tecnologico negli appunti.

## Ricerca nel sorgente della pagina

Utile quando sospetti che un rilevamento sia errato, o vuoi verificare se una stringa o un'espressione regolare è effettivamente presente nella pagina.

### Campo di input

Supporta testo semplice e regex. Premi Invio o clicca "Cerca" per eseguire.

### Opzioni

| Opzione              | Descrizione                                                                 |
| -------------------- | --------------------------------------------------------------------------- |
| Distingui maiuscole  | Disattivato per default; se attivato, `React` e `react` non sono equivalenti |
| Parola intera        | In modalità testo semplice, richiede che la corrispondenza sia delimitata da caratteri non alfanumerici (usa `\b`) |
| Espressione regolare | Interpreta l'input come sorgente regex JavaScript, combinato con le due opzioni sopra |

### Output

Vengono mostrati:

- La query stessa, il pattern, il tipo di origine (serializzazione HTML o outerHTML), la lunghezza totale del sorgente
- Numero di corrispondenze (se eccessivo viene mostrato "100+" con troncamento alle prime N)
- Per ogni corrispondenza: numero di riga, colonna, offset carattere, e snippet di contesto (circa 60 caratteri prima e dopo la corrispondenza)

::: tip
La ricerca serializza in stringa il DOM della pagina attiva prima di cercare, quindi copre elementi nascosti, script inline e commenti. Non è una ricerca nel sorgente di rete — anche le modifiche al DOM apportate da script in esecuzione rientrano nella ricerca.
:::

## Indizi grezzi

Utile quando:

- Vuoi vedere i dati grezzi completi (tutte le intestazioni di risposta, snapshot dinamici e risultati di rilevamento pagina prima dell'aggregazione del plugin)
- Devi allegare prove complete a una segnalazione
- Stai debuggando le corrispondenze delle regole personalizzate

L'output è JSON completo con questa struttura:

```json
{
  "url": "https://example.com",
  "title": "Example",
  "generatedAt": "2026-05-10T10:00:00.000Z",
  "technologies": [
    /* elenco deduplicato dopo la fusione */
  ],
  "resources": {
    /* riepilogo risorse */
  },
  "headers": {
    /* intestazioni di risposta del documento principale */
  },
  "apiObservations": [
    /* per ogni risposta API: url/headers/technologies */
  ],
  "frameObservations": [
    /* per ogni iframe: uguale */
  ],
  "dynamicObservations": {
    /* script/stili/iframe/feedLinks/domMarkers raccolti dinamicamente */
  },
  "notes": [
    /* note metodologiche */
  ]
}
```

### Origine → JSON con scope

Se vuoi vedere solo il sottoinsieme JSON relativo a **una tecnologia specifica e una origine specifica**, non è necessario aprire gli indizi grezzi completi — clicca semplicemente sull'etichetta di origine sotto la scheda tecnologia (es. "Intestazioni", "Monitoraggio dinamico · post-interazione"). Si apre lo stesso pannello ma mostra solo i campi relativi a quella origine, con l'array delle tecnologie filtrato su quella sola voce.

Il titolo del pannello cambia in "Indizi grezzi · React · Intestazioni" per indicare che si tratta di una vista con scope. Clicca "Indizi grezzi" nella barra degli strumenti inferiore per tornare al JSON completo.

## Copia report completo dello stack tecnologico

Il pulsante "Copia tutto" in basso nel popup copia negli appunti il report completo dello stack tecnologico della pagina corrente. Il report contiene:

- Un riepilogo Markdown leggibile dall'utente
- JSON strutturato `stackprism.tech_stack_report.v1`
- URL, titolo, ora di generazione, numero totale di tecnologie, conteggio risorse e conteggio intestazioni del documento principale

Copia i **risultati del popup corrente**, non influenzata dalla vista "In evidenza" o dal filtro categoria a tendina; i selettori di categoria e la lista di esclusione nelle impostazioni rimangono applicati. Puoi incollarlo direttamente in una segnalazione, in note, in un input per un AI Agent o in un editor di testo esterno.

Utilizzi comuni:

- Allegare il contesto completo dello stack tecnologico a una segnalazione o PR
- Registrare lo stack tecnologico di un sito in documentazione o knowledge base
- Passarlo a un AI Agent per analisi approfondita
