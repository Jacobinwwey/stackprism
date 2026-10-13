# Contribuire alle regole

## Percorsi

I contributi si dividono in due categorie:

1. **Feedback rapido**: clicca il pulsante "Rilevamento impreciso, clicca per correggere" sulla scheda della tecnologia nel popup — si apre automaticamente una segnalazione GitHub Issue precompilata con il contesto (URL della pagina, risultato del matching delle regole correnti, versione dell'estensione). Il manutentore la riceve e aggiusta la regola.
2. **PR diretta**: fai un fork del repository, modifica il JSON corrispondente in `public/rules/`, verifica in locale e apri una PR.

Di seguito viene descritto principalmente il flusso della PR diretta.

## Trovare il file giusto

`public/rules/` è suddiviso per responsabilità:

| File                               | Cosa contiene                                     |
| ---------------------------------- | ------------------------------------------------- |
| `page/frontend-frameworks.json`    | React / Vue / Angular / vari framework frontend   |
| `page/ui-frameworks.json`          | Tailwind / Bootstrap / Element / Antd ecc.        |
| `page/build-runtime.json`          | Webpack / Vite / Rollup / Bun ecc.                |
| `page/frontend-cdn-libraries.json` | Librerie frontend con nome distribuiti via CDN    |
| `page/wordpress-plugins.json`      | 4500+ plugin WordPress                            |
| `page/drupal-modules.json`         | 4000+ moduli Drupal                               |
| `page/cms-themes.json`             | Temi CMS                                          |
| `page/website-programs.json`       | WordPress / Drupal / Discuz! ecc.                 |
| `page/payment-systems.json`        | Piattaforme di pagamento                          |
| `page/third-party-logins.json`     | Login di terze parti                              |
| `page/saas-services.json`          | SaaS (Sentry / Mixpanel / Intercom ecc.)          |
| `page/analytics-providers.json`    | Analytics e statistiche                           |
| `page/cdn-providers.json`          | CDN (rilevamento lato runtime frontend)           |
| `headers/server-products.json`     | Prodotti server rilevati tramite header `Server:` |
| `headers/cdn-providers.json`       | CDN rilevati tramite intestazioni di risposta     |
| `headers/website-programs.json`    | CMS rilevati tramite intestazioni di risposta     |
| ...                                |                                                   |

Elenco completo in `public/rules/index.json`.

## Esempio minimo di nuova regola

Supponi di voler aggiungere il rilevamento di ExampleCMS. In `page/website-programs.json` trova il gruppo appropriato (es. "CMS self-hosted") e aggiungi:

```json
{
  "name": "ExampleCMS",
  "url": "https://examplecms.example.com",
  "patterns": ["examplecms-[0-9.]+\\.min\\.js", "/_examplecms/"],
  "globals": ["ExampleCMS"],
  "selectors": ["[data-powered-by='examplecms']"]
}
```

Il significato dei campi è spiegato in [Formato dei file di regole](./rule-format.md).

## In quale gruppo inserire la regola?

Apri il file JSON corrispondente: vedrai una struttura di gruppi annidati:

```json
{
  "page": {
    "websitePrograms": {
      "defaults": { "category": "网站程序" },
      "rules": [
        {
          "defaults": { "confidence": "高" },
          "rules": [
            // CMS con nome ad alta confidenza
          ]
        },
        {
          "defaults": { "confidence": "中" },
          "rules": [
            // CMS a media confidenza
          ]
        }
      ]
    }
  }
}
```

In base alla certezza del rilevamento, inserisci la regola nel sottogruppo di confidenza appropriato. L'ordine nell'array `rules` non influisce sui risultati del rilevamento, solo sull'ordine di navigazione durante il debug.

## Validare la regola

Dopo la modifica:

```bash
bun run build
```

La build esegue `precompileRulesPlugin` che inietta i campi `__hints` ecc. nelle regole. Poi carica `dist/` in `chrome://extensions/` e verifica su un sito ExampleCMS reale.

In alternativa usa il pannello "Regole personalizzate" per scrivere prima la regola nella configurazione utente, confermare che funziona, poi spostarla in `public/rules/`.

## Ridurre i falsi positivi

- **Preferisci globals**: `window.X` è il segnale più affidabile, quasi zero falsi positivi
- **Preferisci selettori specifici**: `[data-powered-by='examplecms']`, `[ng-version]` — attributi chiaramente scritti da quella tecnologia
- **Per i patterns sulle risorse, usa dominio / percorso completo**: `cdn.examplecms.com/sdk.js` è più stabile di `examplecms`
- **Per classNames / classPrefixes usa un prefisso univoco**: `example-cms-` invece di `cms-`, per non collidere con altri progetti che usano classi `cms-`
- **Aggiungi ancore alle regex**: `^/_examplecms/` è più preciso di `/_examplecms/`
- **Sii conservativo con la confidenza**: in caso di dubbio usa "Media" — l'utente vedrà una pillola gialla invece di verde, evitando false certezze

## Flusso per contribuire al repository principale

1. Fai un fork di [setube/stackprism](https://github.com/setube/stackprism)
2. Clona in locale, esegui `bun install`, `bun run build` per verificare che la build funzioni
3. Trova il file corrispondente in `public/rules/` e aggiungi la regola
4. Recupera 2-3 prove da [Wappalyzer rules](https://github.com/enthec/webappanalyzer), dal sito ufficiale o dalla documentazione e includile nella descrizione della PR
5. Apri una PR verso il branch main

Nella descrizione della PR indica chiaramente: quali tecnologie sono state aggiunte, su quale sito hai verificato, e perché queste caratteristiche non possono colpire per errore altri siti.
