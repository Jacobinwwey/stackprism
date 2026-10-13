# Installazione e attivazione

StackPrism è destinato ai browser basati su Chromium (Chrome, Edge, Brave, Opera, Vivaldi, Arc, ecc.) e richiede il supporto a Manifest V3.

## Metodo 1: scaricare il file crx dalla Release

1. Apri [GitHub Releases](https://github.com/setube/stackprism/releases)
2. Seleziona la versione più recente e scarica `stackprism-v{version}.crx`
3. Nella barra degli indirizzi del browser digita `chrome://extensions/` (su Edge: `edge://extensions/`), attiva la "Modalità sviluppatore" in alto a destra
4. Trascina il file `.crx` scaricato nella pagina delle estensioni
5. Quando appare il popup, conferma "Aggiungi estensione"

::: tip
A volte Chrome blocca l'installazione tramite trascinamento del .crx (messaggio "Impossibile aggiungere app, estensioni e script utente da questo sito"). In questo caso usa il metodo 2.
:::

## Metodo 2: scaricare lo zip dalla Release e caricarlo decompresso

1. Apri [GitHub Releases](https://github.com/setube/stackprism/releases) e scarica `stackprism-v{version}.zip`
2. Decomprimi in una directory stabile (**non eliminarla — l'estensione dipende da questa directory per funzionare**)
3. Apri `chrome://extensions/` e attiva la "Modalità sviluppatore"
4. Clicca su "Carica estensione non pacchettizzata"
5. Seleziona la directory appena decompressa

## Metodo 3: compilare dal sorgente in locale

Adatto agli sviluppatori o a chi vuole seguire l'ultimo commit del branch main.

```bash
git clone https://github.com/setube/stackprism.git
cd stackprism
bun install
bun run build
```

Il risultato della compilazione si trova in `dist/`. Carica la directory `dist/` in modalità sviluppatore da `chrome://extensions/`.

Dopo aver modificato il sorgente, basta rieseguire `bun run build` e cliccare il pulsante di aggiornamento sulla scheda dell'estensione in `chrome://extensions/`.

## Attivazione e permessi

Al primo avvio verranno richiesti i seguenti permessi:

| Permesso     | Utilizzo                                                                          |
| ------------ | --------------------------------------------------------------------------------- |
| `tabs`       | Legge l'URL e il titolo della scheda corrente                                     |
| `activeTab`  | Inietta script di rilevamento nella pagina attiva                                 |
| `scripting`  | Inietta page-detector / page-source-search nel MAIN world                         |
| `storage`    | Salva impostazioni, cache dei risultati, preferenze tema                          |
| `webRequest` | Intercetta le intestazioni di risposta per raccogliere server / x-powered-by ecc. |
| `<all_urls>` | Esegue su tutte le pagine http(s)                                                 |

Il rilevamento non dipende da API esterne: i file di regole sono inclusi nell'estensione e i risultati circolano solo nella memoria del browser e nello storage dell'estensione.

## Disinstallazione

`chrome://extensions/` → trova StackPrism → Rimuovi. Impostazioni e cache verranno cancellate insieme.
