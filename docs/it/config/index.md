# Guida alla configurazione

La pagina delle impostazioni si apre dal pulsante "Impostazioni" in cima al popup, oppure trovando la scheda StackPrism in `chrome://extensions/` e cliccando "Dettagli → Opzioni estensione".

La pagina delle impostazioni è divisa in cinque sezioni:

- [Selettori di rilevamento](./categories.md) — attivazione/disattivazione delle 24 categorie (le tecnologie di una categoria disabilitata non appaiono più nel popup)
- [Disabilita tecnologie specifiche](./disabled-technologies.md) — esclusione per nome preciso di alcune tecnologie (indipendente dalla categoria)
- [Personalizza stile popup](./custom-css.md) — CSS personalizzato per sovrascrivere lo stile del popup / pagina impostazioni
- [Regole personalizzate](./custom-rules.md) — aggiunta di regole di rilevamento personalizzate tramite form o JSON
- [Importa/esporta regole JSON](./json-export.md) — sincronizzazione delle regole tra browser e dispositivi

## Dove vengono salvate le impostazioni

Tutte le impostazioni vengono salvate in `chrome.storage.sync` e si sincronizzano tra dispositivi tramite il tuo account Google / Edge. La chiave è `stackPrismSettings`. Se non vuoi la sincronizzazione, puoi disattivare quella del browser.

`chrome.storage.sync` ha un limite di 100KB totali e 8KB per singola chiave. Questo significa:

- Numero massimo di regole personalizzate (circa 100 in sicurezza)
- Lunghezza massima del CSS personalizzato (non oltre 10000 caratteri)
- Lista di esclusione non eccessivamente lunga

I limiti effettivi sono definiti da `CUSTOM_RULE_LIMITS` in `src/types/settings.ts`; superarli causa un errore al salvataggio.

## Quando entrano in vigore le modifiche

| Modifica                                         | Quando entra in vigore                                                   |
| ------------------------------------------------ | ------------------------------------------------------------------------ |
| Selettori / tecnologie disabilitate / CSS custom | Immediatamente alla prossima apertura del popup                          |
| Regole personalizzate                            | Al salvataggio, dopo il prossimo aggiornamento pagina + riapertura popup |
| Importazione JSON                                | Come sopra                                                               |

Cliccando "Salva impostazioni" vengono scritte immediatamente nello storage, senza bisogno di ricaricare la pagina delle impostazioni.
