# Manuale di sviluppo

Questa sezione è per chi vuole leggere il codice sorgente, modificare le regole o aprire una PR. Se hai solo bisogno di installare l'estensione, la [Guida all'uso](/it/guide/) è sufficiente.

## Sezioni

- [Panoramica dell'architettura](./architecture.md) — struttura delle directory del progetto, responsabilità dei moduli, flusso dei dati
- [Formato dei file di regole](./rule-format.md) — come sono organizzati i JSON in `public/rules/`, gruppi annidati e ereditarietà dei defaults
- [Flusso di rilevamento](./detection-flow.md) — le fasi dal webRequest / iniezione nella pagina fino al rendering nel popup
- [Contribuire alle regole](./contribute-rules.md) — come aggiungere nuove tecnologie all'insieme delle regole integrate
- [Build e rilascio](./release.md) — build locale, packaging, firma crx, workflow di pubblicazione

## Stack tecnologico

Il progetto principale usa Vite 5 + Vue 3 + TypeScript + `@crxjs/vite-plugin` 2.x. Lo script in background è un service worker ESM Manifest V3, il gestore di pacchetti è pnpm.

Le regole si trovano in `public/rules/`, suddivise in più file JSON per direzione (regole di pagina, regole sulle intestazioni, ecosistema WordPress / Drupal ecc.). In fase di build le regole vengono pre-elaborate con l'iniezione dei campi `__hints` / `__legacyHints` / `__keywordCombined` per accelerare il matching.

## Comandi di sviluppo comuni

```bash
pnpm install            # installare le dipendenze
pnpm run dev            # avvia il vite dev server, hot-reload dell'estensione
pnpm run build          # compila in dist/, caricabile in Chrome
pnpm run typecheck      # controllo rigoroso dei tipi con vue-tsc
pnpm run lint           # controllo eslint
pnpm run docs:dev       # anteprima locale della documentazione
pnpm run docs:build     # compila il sito di documentazione statico
```

In modalità dev, le pagine dell'estensione supportano l'hot update. Le modifiche a popup / settings / help di solito si aggiornano automaticamente; dopo aver modificato `src/background/` o il content script, è necessario aggiornare manualmente la scheda dell'estensione in `chrome://extensions/`.

## Entry point Vue

Tre SPA indipendenti, compilate separatamente, senza interferenze:

| Entry point | File                         | Descrizione                                                     |
| ----------- | ---------------------------- | --------------------------------------------------------------- |
| popup       | `src/ui/popup/index.html`    | Finestra 440px × 600px che appare cliccando l'icona in alto a destra |
| settings    | `src/ui/settings/index.html` | Options page aperta dai dettagli in `chrome://extensions/`      |
| help        | `src/ui/help/index.html`     | Pagina indipendente aperta cliccando "Guida" nelle impostazioni |

## Link correlati

- [Repository GitHub](https://github.com/setube/stackprism)
- [Lista delle segnalazioni](https://github.com/setube/stackprism/issues)
- [Lista delle release](https://github.com/setube/stackprism/releases)
