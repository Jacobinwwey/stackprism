# Build e rilascio

## Build locale

```bash
bun install
bun run build
```

Sequenza:

1. `bun run build:injected` (`build-scripts/build-injected.mjs`): esbuild compila `src/injected/page-detector.ts` e `page-source-search.ts` ciascuno come file IIFE indipendente, con output in `public/injected/`
2. `vite build` (`@crxjs/vite-plugin`): pacchettizza i quattro entry point background / popup / settings / help, con output in `dist/`
3. `precompileRulesPlugin` (hook closeBundle del vite plugin): scansiona `dist/rules/*.json` e inietta `__hints` / `__legacyHints` / `__keywordCombined` in ogni leaf rule
4. `minifyJsonAssets` (hook closeBundle del vite plugin): riscrive tutti i JSON con `JSON.stringify(parsed)`, rimuovendo indentazione e spazi

Il risultato finale in `dist/` può essere caricato direttamente in modalità sviluppatore da `chrome://extensions/`.

## Hot-reload per lo sviluppo

```bash
bun run dev
```

vite dev server + crxjs HMR: le modifiche a `src/ui/**` (popup / impostazioni / guida) vengono sostituite automaticamente. Le modifiche a `src/background/**` o al content script richiedono di cliccare il pulsante di aggiornamento sulla scheda dell'estensione in `chrome://extensions/`.

## Tipi e lint

```bash
bun run typecheck    # vue-tsc --noEmit, controllo rigoroso dei tipi su tutto il progetto
bun run lint         # eslint src
```

Prima del commit, esegui la formattazione su tutto il progetto:

```bash
npx prettier --write .
```

## Gestione del numero di versione

Il campo `version` in `package.json` è la sorgente di verità. `@crxjs/vite-plugin` lo sincronizza automaticamente in `dist/manifest.json`.

Le modifiche ordinarie (funzionalità, regole, fix) incrementano il patch. Quando il patch raggiunge `99` si passa al minor successivo, senza usare versioni tipo `1.1.100`:

```bash
# 1.1.98 -> 1.1.99
# 1.1.99 -> 1.2.0
```

Viene creata una GitHub Release solo per le versioni che richiedono un pacchetto di installazione: `x.y.0`, `x.y.10`, `x.y.20`, ..., `x.y.90`. Ad esempio `1.2.0` e `1.2.10` vengono rilasciate; `1.2.5` e `1.2.15` no.

```bash
# Dopo aver modificato la versione in package.json
git add package.json
git commit -m "chore: bump 1.2.10"
git push origin main
```

## Workflow GitHub Release

`.github/workflows/release-extension.yml` si attiva in due casi:

1. Pubblicazione di una release nell'interfaccia GitHub (evento `release: published`)
2. Esecuzione manuale di workflow_dispatch dalla pagina Actions (con input opzionale release_tag)

Cosa fa il workflow:

1. checkout + installazione bun + Node 20
2. `bun install --frozen-lockfile`
3. `bun run build`
4. legge la versione da `dist/manifest.json` e verifica che corrisponda al tag della release
5. comprime l'intera `dist/` in `stackprism-v{ver}.zip` + sha256
6. **se è configurato il secret `EXTENSION_PRIVATE_KEY`**, usa `npx crx3` per firmare e produrre `stackprism-v{ver}.crx` + sha256; altrimenti salta il crx e genera solo lo zip
7. `gh release upload --clobber` carica tutti gli artefatti nel tag della release
8. `actions/upload-artifact` ne conserva una copia come artifact

## Note di rilascio

Le note di rilascio vengono elaborate a partire dal `git log --oneline vPREV..HEAD` tra il tag della release precedente e il commit corrente, senza incollare direttamente la lista dei commit. Il formato raggruppa le modifiche in modo comprensibile per l'utente, ad esempio:

- Miglioramenti alle regole
- Popup e pagina impostazioni
- Sito di documentazione
- Build e processo di rilascio

Le note di rilascio includono solo le modifiche rilevanti per l'utente o il manutentore, non la formattazione locale, il controllo dei tipi, il lint o i comandi di build eseguiti.

## Chiave di firma CRX

Prima del primo rilascio è necessario generare una chiave RSA privata e configurarla nei secret del repository GitHub.

### Generare la chiave privata

```bash
openssl genrsa -out extension.pem 2048
```

::: warning
**Non perdere mai** `extension.pem` — rigenerarla cambierebbe l'ID dell'estensione (Chrome la tratterebbe come un'altra estensione). Fai un backup locale.
:::

### Configurare su GitHub

1. Repository Settings → Secrets and variables → Actions → New repository secret
2. Name: `EXTENSION_PRIVATE_KEY`
3. Secret: incolla **l'intero contenuto** del file `extension.pem` (incluse le righe `-----BEGIN PRIVATE KEY-----` e `-----END PRIVATE KEY-----`)
4. Salva

Da quel momento il workflow usa questa chiave per firmare il crx.

### Cosa succede senza la configurazione

Il workflow funziona comunque, ma gli artefatti non includeranno il file `.crx`. Gli utenti potranno caricare solo lo zip decompresso.

## Checklist pre-rilascio

- [ ] `npx prettier --write .` eseguito
- [ ] `bun run typecheck` passa
- [ ] `bun run lint` passa
- [ ] `bun run build` passa
- [ ] Caricato `dist/` in Chrome e testato manualmente i percorsi critici (apertura popup, rilevamento su un sito, aggiornamento, copia report completo stack tecnologico, aggiunta regola nella pagina impostazioni)
- [ ] Versione aggiornata in `package.json`
- [ ] git commit + push
- [ ] Se la versione corrisponde a un nodo di release, pubblicare la release su GitHub (tag `v{version}`, allineato a package.json)
- [ ] Attendere il completamento del workflow di pubblicazione e verificare che gli artefatti della release contengano zip / crx e sha256

## Pubblicazione su Chrome Web Store

Il workflow non pubblica automaticamente su Chrome Web Store — la publish API di CWS richiede un flusso OAuth2; al momento l'operazione è manuale:

1. Comprimi la cartella `dist/` in uno zip (lo stesso prodotto dal workflow)
2. [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) → Carica nuova versione
3. Compila le note di modifica e attendi la revisione (di solito 1-3 giorni lavorativi)
