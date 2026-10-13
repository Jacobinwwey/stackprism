# Importa/esporta regole JSON

L'ultimo blocco della pagina delle impostazioni mostra il JSON delle regole personalizzate correnti. Utile per backup, migrazione e modifica in blocco.

## Utilizzi

- Migrare le regole personalizzate tra dispositivi o account
- Backup delle regole con un sistema di controllo versione
- Modifica in blocco (cerca e sostituisci nel campo di testo è più rapido che modificare voce per voce)
- Costruire array di regole tramite script (genera centinaia di regole programmaticamente)

## Struttura dei campi

Ogni regola è un oggetto:

```json
{
  "name": "MyCMS",
  "category": "网站程序",
  "kind": "自定义 CMS",
  "confidence": "中",
  "matchType": "regex",
  "patterns": ["mycms-[0-9.]+\\.js", "X-Generator: MyCMS"],
  "selectors": ["[data-powered-by='mycms']"],
  "globals": ["MyCMS"],
  "matchIn": ["url", "resources", "html", "headers", "dynamic"],
  "url": "https://mycms.example.com"
}
```

| Campo        | Tipo                     | Obbligatorio | Descrizione                                                                          |
| ------------ | ------------------------ | ------------ | ------------------------------------------------------------------------------------ |
| `name`       | string                   | Sì           | Nome visualizzato nel popup                                                          |
| `category`   | string                   |              | Categoria, predefinita `其他库`                                                      |
| `kind`       | string                   |              | Descrizione del tipo, predefinita `自定义规则`                                       |
| `confidence` | `"高"` / `"中"` / `"低"` |              | Predefinita `"中"`                                                                   |
| `matchType`  | `"keyword"` / `"regex"`  |              | Predefinita `"regex"`                                                                |
| `patterns`   | string[]                 | Uno dei tre  | Almeno uno tra patterns / selectors / globals deve essere non vuoto                 |
| `selectors`  | string[]                 | Uno dei tre  | Lista di selettori CSS                                                               |
| `globals`    | string[]                 | Uno dei tre  | Lista di variabili globali (`window.x.y` si scrive `x.y`)                           |
| `matchIn`    | string[]                 |              | Qualsiasi combinazione di `url` / `resources` / `html` / `headers` / `dynamic`, predefinito tutto |
| `url`        | string                   |              | Deve iniziare con `http(s)://`, può essere vuoto                                    |

## Pulsanti operativi

In alto a destra nel titolo ci sono due pulsanti:

- **Importa da JSON**: analizza il contenuto del campo, se la validazione ha successo **sostituisce in blocco** la lista delle regole personalizzate corrente (non è una fusione)
- **Formatta**: analizza e riscrive con `JSON.stringify(rules, null, 2)` per un'indentazione regolare

## Backslash nelle stringhe

Nel JSON le regex richiedono doppio escape. Per corrispondere a `\.js`:

```json
{
  "matchType": "regex",
  "patterns": ["\\.js$"]
}
```

Il parser JSON converte `\\` in un singolo `\`, l'estensione riceve `\.js$` e lo passa a `new RegExp()` come escape del punto.

## Validazione globale

All'importazione l'intero array viene analizzato prima; se un campo di qualsiasi regola non è valido, l'intera importazione viene rifiutata (atomica) — non si verifica mai uno stato intermedio con alcune regole importate e altre no. Il messaggio di errore indica quale regola e quale campo hanno il problema.

## Relazione con il modulo

- Modifica nel modulo → sincronizzazione automatica nel campo JSON
- Modifica nel campo JSON → è necessario cliccare "Importa da JSON" per sincronizzare la lista interna delle regole
- Se si clicca "Salva impostazioni" senza importare, viene salvato lo stato dell'ultima operazione nel modulo o dell'ultima importazione

## Limite di quantità

`CUSTOM_RULE_LIMITS.rules` predefinito a 100. Superarlo causa il rifiuto. Tutti i limiti in [`src/types/settings.ts`](https://github.com/setube/stackprism/blob/main/src/types/settings.ts):

| Campo                                   | Limite    |
| --------------------------------------- | --------- |
| Numero totale di regole                 | 100       |
| name                                    | 80 char   |
| category                                | 40 char   |
| kind                                    | 40 char   |
| Singolo pattern / selector / global     | 240 char  |
| Lunghezza array patterns / selectors / globals | 80 ciascuno |
| Lunghezza array matchIn                 | 8         |
| url                                     | 240 char  |
| customCss                               | 10000 char|
