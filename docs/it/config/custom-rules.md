# Regole personalizzate

Le regole personalizzate servono a coprire i siti non gestiti dalle regole integrate, o per validare localmente una nuova regola prima di proporla.

## Compilazione del modulo

| Campo                  | Obbligatorio | Descrizione                                                                                                                           |
| ---------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Nome tecnologia**    | Sì           | Il nome visualizzato nel popup, es. `MyCMS`                                                                                           |
| **Categoria**          |              | Seleziona una categoria integrata (23) o inseriscine una nuova. Predefinita: "Altre librerie". Il campo supporta input libero.        |
| **Tipo**               |              | Nota descrittiva per uso personale, es. `CMS aziendale`, `Pagamento terze parti`. Appare come prefisso nella prova. Può essere vuoto. |
| **Confidenza**         |              | Alta / Media / Bassa, predefinita "Media"                                                                                             |
| **Metodo di matching** |              | Parola chiave / Espressione regolare, predefinito "Espressione regolare"                                                              |
| **URL sito / repo**    |              | Deve iniziare con `http://` o `https://`. Se compilato, il nome della tecnologia nel popup diventa cliccabile.                        |

Sotto ci sono quattro aree:

- **Ambito di matching**: decide dove vengono cercati i pattern / selectors / globals
  - URL pagina: indirizzo della pagina web corrente
  - URL risorse: risorse caricate da script / stili / iframe
  - DOM / Sorgente: outerHTML della pagina
  - Intestazioni di risposta: intestazioni di documento principale + API + iframe
  - Risorse dinamiche: risorse accumulate continuamente da MutationObserver

- **Pattern di matching (patterns)**: uno per riga. In modalità parola chiave: stringa letterale da trovare; in modalità regex: sorgente regex JS (senza delimitatori `/.../i` — il flag `i` viene aggiunto automaticamente)

- **Selettori CSS (selectors)**: uno per riga, es. `[data-v-app]`, `#__next`. L'ambito deve includere "DOM / Sorgente"

- **Variabili globali (globals)**: una per riga, es. `React`, `Vue.config`, `__NEXT_DATA__`. Una corrispondenza dà confidenza Alta

## Aggiunta / Aggiornamento

- **Aggiungi regola** (pulsante principale verde): salva il modulo corrente come nuova regola
- **Aggiorna regola corrente**: clicca il pulsante modifica su una regola nell'elenco in basso per entrare in "modalità modifica", poi salva con questo pulsante

Clicca "Salva impostazioni" in alto a destra nella pagina per scrivere le regole nello storage.

## Elenco regole aggiunte

Mostrato in fondo alla pagina. Ogni voce include:

- Titolo: nome della tecnologia
- Metadati: categoria · tipo · confidenza · metodo di matching · N pattern
- Azioni: pulsanti "Modifica" e "Elimina" (il pulsante elimina diventa rosso all'hover)

## Validazione delle regole

Ad ogni aggiunta / aggiornamento / salvataggio vengono eseguiti questi controlli:

- Il nome è obbligatorio
- Almeno uno tra patterns / selectors / globals deve essere compilato
- Almeno un ambito di matching deve essere selezionato
- Il campo url, se compilato, deve iniziare con http(s)://
- Ogni pattern (in modalità regex) deve essere valido con `new RegExp`
- Ogni selettore deve essere valido con `document.createDocumentFragment().querySelector`
- Ogni variabile globale deve rispettare il formato `MyCMS` o `google.maps` (nome con punti)

In caso di errore appare un messaggio rosso con al massimo 6 problemi elencati.

## Esempio: parola chiave semplice

Rilevare ExampleCMS:

```text
Nome tecnologia: ExampleCMS
Categoria:       CMS / Programmi web
Metodo:          Parola chiave
Pattern:
  examplecms
  X-Generator: ExampleCMS
Ambito: [x] URL pagina [x] URL risorse [x] DOM / Sorgente [x] Intestazioni
```

## Esempio: rilevare un tema WordPress

```text
Nome tecnologia: Tema WordPress: oceanwp
Categoria:       Temi / Template
Metodo:          Parola chiave
Pattern:
  /wp-content/themes/oceanwp/
Ambito: [x] URL risorse [x] DOM / Sorgente
```

## Esempio: rilevare un SDK di pagamento caricato dinamicamente

Il pulsante di pagamento richiede lo script solo al clic, quindi seleziona "Risorse dinamiche":

```text
Nome tecnologia: ExamplePay
Categoria:       Sistemi di pagamento
Tipo:            Pagamento terze parti
Metodo:          Parola chiave
Pattern:
  pay.example.com
  examplepay-sdk
Ambito: [x] Risorse dinamiche
```

## Esempio: usare regex per file con numero di versione

```text
Nome tecnologia: ExampleLib
Categoria:       Librerie frontend
Metodo:          Espressione regolare
Pattern:
  examplelib-[0-9.]+\.min\.js
Ambito: [x] URL risorse [x] Risorse dinamiche
```

## Ridurre i falsi positivi

- Evita parole chiave troppo generiche come `app`, `main`, `login` — presenti su quasi tutti i siti
- Preferisci **domini completi** `pay.example.com` invece di `pay`
- Preferisci **percorsi specifici** `/wp-content/themes/oceanwp/` invece di `oceanwp`
- Se non sei sicuro, imposta la confidenza su "Bassa" — nel popup apparirà una pillola grigia che indica che si tratta di un'ipotesi
- Dopo aver salvato la regola **ricarica sempre la pagina di destinazione** prima di aprire il popup, altrimenti vedrai ancora la cache precedente
