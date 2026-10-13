# Personalizza stile popup

Nella pagina delle impostazioni è presente un campo CSS personalizzato. Il CSS scritto qui viene salvato e iniettato nel `<head>` del popup, della pagina delle impostazioni e della pagina di aiuto, sovrascrivendo gli stili predefiniti.

## Esempio: rendere più visibili gli indicatori di confidenza

```css
.confidence.high {
  background: #14532d;
  color: #fff;
  font-weight: 700;
}

.confidence.medium {
  background: #ca8a04;
  color: #fff;
}
```

## Esempio: cambiare il colore principale

```css
:root {
  --accent: #d946ef;
  --accent-dark: #a21caf;
  --accent-soft: rgba(217, 70, 239, 0.1);
}
```

Il segmento nel popup, i link hover alle tecnologie, il pulsante aggiorna e altri elementi fanno riferimento a questi token — cambiarli li aggiorna tutti insieme.

## Esempio: aumentare la dimensione del testo

```css
body {
  font-size: 15px;
}

.tech-name {
  font-size: 14px;
}
```

## Posizione di iniezione

Tutto il CSS personalizzato viene inserito in un tag `<style id="stackPrismCustomCss">` con ID fisso, aggiunto in fondo al `<head>`. Il salvataggio di nuovo sostituisce il contenuto precedente senza duplicarlo.

## Ambito di applicazione

- Popup
- Pagina delle impostazioni (options page)
- Pagina di aiuto

Non influisce sulle pagine web normali — questo CSS è attivo solo nell'interfaccia utente dell'estensione.

## Suggerimenti per il debug

Apri il popup o la pagina delle impostazioni, poi tasto destro → Ispeziona. Nel pannello Elements puoi vedere il tag style iniettato e verificare se i selettori corrispondono.

## Limitazioni

- Lunghezza massima `CUSTOM_RULE_LIMITS.css` (default 10000 caratteri) — superarla causa un errore al salvataggio
- Non è possibile importare file CSS esterni (no `@import`) — la CSP dell'estensione non lo consente
- Non è possibile usare `url(...)` con immagini remote diverse da base64
