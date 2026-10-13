---
layout: home

hero:
  name: StackPrism
  text: Visualizzatore di indizi tecnologici web
  tagline: Apri il popup dell'estensione per vedere i framework, CDN, CMS, analytics, login, pagamenti e indizi SaaS esposti dalla pagina corrente. Ogni risultato include prove e origine, per valutarne l'affidabilità.
  image:
    src: /icon.svg
    alt: StackPrism
  actions:
    - theme: brand
      text: Installazione e attivazione
      link: /it/guide/install
    - theme: alt
      text: Vedi su GitHub
      link: https://github.com/setube/stackprism/blob/main/i18n/README.it.md

features:
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'/></svg>"
    title: Regole locali
    details: Le regole sono incluse nell'estensione. URL, risorse, DOM, intestazioni di risposta e risorse dinamiche vengono confrontate in locale, senza account o API esterne.
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z'/></svg>"
    title: Popup con priorità alla cache
    details: Il backend prepara in anticipo risultati leggeri. All'apertura del popup vengono mostrati prima i risultati principali dalla cache; il JSON grezzo e i link alle tecnologie vengono caricati su richiesta.
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z'/></svg>"
    title: Regole personalizzate
    details: Nella pagina impostazioni puoi aggiungere le tue regole con parole chiave, espressioni regolari, selettori CSS e variabili globali, per coprire i siti non gestiti dalle regole integrate.
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'/></svg>"
    title: Risultati tracciabili
    details: Nome della tecnologia, livello di confidenza, prove e origine sono mostrati nella stessa scheda. Per verificare falsi positivi, puoi espandere i dati grezzi della relativa origine.
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12.67 19a2 2 0 0 0 1.416-.586l6.13-6.13a4.992 4.992 0 0 0 .832-2.65V5l-3 1.5L17.97 5h-1.97a4.992 4.992 0 0 0-2.65.832l-6.13 6.13a2 2 0 0 0-.586 1.416v3.288c0 .53.211 1.04.586 1.415l1.456 1.456c.375.375.884.586 1.414.586h3.287Z'/><path d='M16 8 2 22'/><path d='M17.5 15H9'/></svg>"
    title: Output filtrabile
    details: I selettori di categoria, la lista di esclusione e la vista in evidenza riducono il rumore. I dati completi rimangono negli indizi grezzi per consultazioni successive.
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m18 16 4-4-4-4'/><path d='m6 8-4 4 4 4'/><path d='m14.5 4-5 16'/></svg>"
    title: Regole verificabili
    details: Le regole integrate sono organizzate in file JSON per categoria. Aggiungere un nuovo rilevamento di solito richiede solo una regola e alcune prove riproducibili.
---

## Cos'è

StackPrism è un'estensione Chromium MV3. Non "vede attraverso" il server, ma organizza gli indizi visibili al browser: risorse script e stile, markup DOM, variabili globali, intestazioni di risposta, risorse caricate dinamicamente, fogli di stile dei temi WordPress e altro.

Ogni risultato è annotato con **livello di confidenza**, **prove** e **origine**. Se un risultato sembra errato, controlla prima le prove, poi clicca sull'origine per espandere il JSON grezzo corrispondente.

## Da dove iniziare

- Prima installazione: leggi [Installazione e attivazione](/it/guide/install.md)
- Risultati incomprensibili: leggi [Interpretazione dei risultati](/it/guide/results.md)
- Vuoi filtrare il rumore o aggiungere regole: leggi la [Guida alla configurazione](/it/config/)
- Vuoi modificare le regole integrate: leggi [Formato dei file di regole](/it/dev/rule-format.md) e [Contribuire alle regole](/it/dev/contribute-rules.md)

## Limiti di accuratezza

I risultati del rilevamento non sono un report di audit. Se un sito nasconde le intestazioni di risposta, imposta hash su tutti i nomi delle risorse, o rimuove le tracce del framework dopo l'SSR, il plugin può restituire pochissimi risultati o nessuno.

La scelta di questo progetto è di esporre quanto più possibile i criteri di giudizio, in modo che l'utente possa capire "perché è stato rilevato così". Le regole vengono continuamente aggiornate, ma le ipotesi di bassa qualità non vengono presentate come conclusioni certe.
