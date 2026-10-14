<div align="center">

[🇨🇳 简体中文](PRIVACY.zh-CN.md) · [🇬🇧 English](PRIVACY.en.md) · [🇹🇼 繁體中文](PRIVACY.zh-TW.md) · [🇯🇵 日本語](PRIVACY.ja.md) · [🇫🇷 Français](PRIVACY.fr.md) · [🇩🇪 Deutsch](PRIVACY.de.md) · [🇧🇷 Português](PRIVACY.pt.md) · **🇮🇹 Italiano** · [🇨🇿 Čeština](PRIVACY.cs.md) · [🇵🇱 Polski](PRIVACY.pl.md)

</div>

# Informativa sulla Privacy di StackPrism

Ultimo aggiornamento: 2026-05-12

## Panoramica

StackPrism (di seguito denominata "l'Estensione") è un'estensione browser per il riconoscimento dello stack tecnologico delle pagine web basata su Chrome / Edge Manifest V3. L'Estensione tiene molto alla tua privacy — tutta l'elaborazione dei dati avviene localmente nel tuo browser, **senza caricare, condividere o vendere alcun dato a server remoti**.

## Dati a cui si accede

Per realizzare l'unica funzione di "riconoscere lo stack tecnologico della pagina attualmente visitata", l'Estensione **legge localmente** le seguenti informazioni quando accedi attivamente a una pagina web. Tutto il contenuto letto viene **elaborato solo nella memoria del browser o in chrome.storage** e non lascia mai il tuo browser.

### 1. Contenuto del sito web

- Struttura dei nodi DOM, nomi delle classi CSS, variabili CSS, tag `<meta>` della pagina corrente visitata
- Nomi delle variabili globali iniettate da `<script>` sull'oggetto `window` della pagina (solo i nomi, non i valori)
- URL delle risorse JavaScript / CSS / iframe / immagini caricate dalla pagina
- I primi byte dei file JavaScript **già caricati** dalla pagina (tramite cache del browser, senza traffico di rete aggiuntivo), per identificare commenti di copyright `/*! @license ... */` e URL di accesso OAuth incorporati nelle SPA

### 2. Registri di rete

- URL e titolo della pagina corrente visitata
- Header di risposta delle richieste XHR / Fetch / iframe / WebSocket avviate dalla pagina (campi Server, X-Powered-By, nome del campo Set-Cookie, ecc.)
- Versione del protocollo HTTP negoziata dalla pagina (HTTP/1.1 / HTTP/2 / HTTP/3)

## Utilizzo dei dati

I dati sopra indicati vengono utilizzati **esclusivamente** per:

- Abbinare localmente le regole integrate dell'estensione per identificare i framework frontend, i servizi backend, CDN, CMS, login, pagamenti, statistiche e altri stack tecnologici utilizzati dalla pagina
- Mostrarti i risultati del riconoscimento nel popup dell'estensione

## Archiviazione dei dati

- **Risultati del riconoscimento**: archiviati solo in `chrome.storage.session`, distrutti alla chiusura del browser, con salvataggio indipendente per ogni scheda
- **Le tue impostazioni** (categorie disabilitate, nomi di tecnologie in lista nera, regole personalizzate, preferenze del tema, ecc.): archiviate in `chrome.storage.sync`, sincronizzate in modo crittografato dal browser al tuo account Google / Microsoft; l'Estensione **non può accedere** ad altri dati del tuo account
- L'Estensione **non** archivia l'HTML completo della pagina, i valori completi dei cookie, le credenziali di accesso, il contenuto dei moduli compilati, le password o altre informazioni sensibili

## Trasmissione dei dati

- L'Estensione **non** carica i dati di navigazione, i risultati del riconoscimento, le informazioni personali o altri dati su server remoti
- Nessuna telemetria, nessun SDK pubblicitario, nessuna analisi di terze parti, nessuna segnalazione di errori nel cloud
- L'Estensione effettua solo due tipi di richieste di rete, **nessuna** delle quali trasporta informazioni di identità o dati di navigazione dell'utente:
  1. Recupero asincrono dei primi byte di alcuni file JS **già caricati dalla pagina corrente** (tramite cache del browser, senza traffico di rete aggiuntivo), per scansionare localmente i commenti di copyright e gli URL di accesso OAuth in quel JS
  2. Le icone dei brand tecnologici vengono **recuperate prioritariamente dalla libreria di icone integrata nell'Estensione** (già pacchettizzate offline con oltre 1300 SVG / PNG di tecnologie principali, senza richieste di rete); solo quando una tecnologia non è nella libreria integrata, viene recuperata da `cdn.simpleicons.org` come fallback (il corpo della richiesta contiene solo uno slug pubblico del nome della tecnologia, come react / vuedotjs / docker, senza l'URL della pagina visitata, i risultati del riconoscimento o informazioni personali); se il CDN non si carica entro 2 secondi, l'Estensione torna automaticamente a un blocco colorato con le iniziali generato localmente, senza mai bloccare il processo di riconoscimento

## Condivisione con terze parti

- L'Estensione **non** vende, condivide o trasferisce dati utente a terze parti
- L'Estensione **non** utilizza i dati utente per scopi non correlati al "riconoscimento dello stack tecnologico"
- L'Estensione **non** viene utilizzata per prestiti, valutazione del credito o scopi simili

## I tuoi diritti

Puoi in qualsiasi momento:

- Cliccare il pulsante "Aggiorna" nel popup dell'estensione per ripetere la scansione della pagina corrente
- Nelle impostazioni dell'estensione, reimpostare la cache delle regole, disabilitare qualsiasi categoria, bloccare nomi di tecnologie specifici, aggiungere regole personalizzate
- Disinstallare l'Estensione da `chrome://extensions`; tutti i dati di archiviazione locale verranno eliminati automaticamente dal browser

## Codice open source

L'Estensione è completamente open source; chiunque può verificare il codice sorgente per confermare le pratiche sulla privacy:

https://github.com/setube/stackprism

La licenza open source è [MIT](https://opensource.org/licenses/MIT).

## Contatti

Per qualsiasi domanda relativa alla privacy, contatta l'autore tramite GitHub Issues:

https://github.com/setube/stackprism/issues

## Modifiche alla politica

L'ultima versione di questa informativa sulla privacy è sempre pubblicata in [PRIVACY.md](https://github.com/setube/stackprism/blob/main/PRIVACY.md) in questo repository. In caso di modifiche significative, verrà aggiornata anche la data dell'ultimo aggiornamento.
