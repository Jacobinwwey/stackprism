<div align="center">

[🇨🇳 简体中文](PRIVACY.zh-CN.md) · [🇬🇧 English](PRIVACY.en.md) · [🇹🇼 繁體中文](PRIVACY.zh-TW.md) · [🇯🇵 日本語](PRIVACY.ja.md) · [🇫🇷 Français](PRIVACY.fr.md) · **🇩🇪 Deutsch** · [🇧🇷 Português](PRIVACY.pt.md) · [🇮🇹 Italiano](PRIVACY.it.md) · [🇨🇿 Čeština](PRIVACY.cs.md) · [🇵🇱 Polski](PRIVACY.pl.md)

</div>

# StackPrism Datenschutzerklärung

Letzte Aktualisierung: 2026-05-12

## Überblick

StackPrism (im Folgenden „diese Erweiterung") ist eine auf Chrome / Edge Manifest V3 basierende Browser-Erweiterung zur Erkennung von Web-Tech-Stacks. Diese Erweiterung nimmt Ihren Datenschutz sehr ernst — alle Datenverarbeitung erfolgt lokal in Ihrem Browser. **Es werden keine Daten an Remote-Server hochgeladen, weitergegeben oder verkauft.**

## Zugriff auf Daten

Um die einzige Funktion — „Erkennung des Tech-Stacks der aktuell besuchten Seite" — zu realisieren, liest diese Erweiterung beim aktiven Besuch einer Webseite die folgenden Informationen **lokal**. Alle gelesenen Inhalte werden **ausschließlich im Arbeitsspeicher Ihres Browsers oder in chrome.storage verarbeitet** und verlassen Ihren Browser nicht.

### 1. Website-Inhalte

- DOM-Knotenstruktur, CSS-Klassennamen, CSS-Variablen und `<meta>`-Tags der aktuell besuchten Seite
- Namen globaler Variablen, die durch `<script>` in das `window`-Objekt der Seite injiziert wurden (nur Namen werden gelesen, keine Werte)
- URLs von durch die Seite geladenen Ressourcen wie JavaScript, CSS, iFrames und Bildern
- Die ersten paar Bytes bereits geladener JavaScript-Dateien der Seite (aus dem Browser-Cache, ohne zusätzlichen Netzwerkverkehr), zur Erkennung von `/*! @license ... */`-Urheberrechtskommentaren und in SPAs eingebetteten OAuth-Eingangs-URLs

### 2. Netzwerkaufzeichnungen

- URL und Titel der aktuell besuchten Seite
- Antwort-Header (Server, X-Powered-By, Set-Cookie-Feldnamen usw.) von XHR-, Fetch-, iFrame- und WebSocket-Anfragen der Seite
- Ausgehandelte HTTP-Protokollversion der Seite (HTTP/1.1 / HTTP/2 / HTTP/3)

## Datenverwendung

Die oben genannten Daten werden **ausschließlich** verwendet für:

- Lokalen Abgleich mit der integrierten Regelbibliothek der Erweiterung zur Erkennung des auf der Seite verwendeten Tech-Stacks (Frontend-Frameworks, Backend-Dienste, CDN, CMS, Login, Zahlungen, Analytics usw.)
- Anzeige der Erkennungsergebnisse für Sie im Erweiterungs-Popup

## Datenspeicherung

- **Erkennungsergebnisse**: Nur in `chrome.storage.session` gespeichert; werden beim Schließen des Browsers gelöscht; jeder Tab wird separat gespeichert
- **Ihre Einstellungen** (deaktivierte Kategorien, Blacklist-Technologienamen, benutzerdefinierte Regeln, Theme-Einstellungen usw.): In `chrome.storage.sync` gespeichert, vom Browser verschlüsselt mit Ihrem Google- / Microsoft-Konto synchronisiert; diese Erweiterung **hat keinen Zugriff** auf andere Daten in Ihrem Konto
- Diese Erweiterung speichert **kein** vollständiges Seiten-HTML, keine vollständigen Cookie-Werte, keine Anmeldedaten, keine Formulareingaben, keine Passwörter oder sonstige sensible Daten

## Datenübertragung

- Diese Erweiterung **überträgt** keine Browserdaten, Erkennungsergebnisse, personenbezogenen Informationen oder andere Daten an Remote-Server
- Kein Telemetrie, kein Werbe-SDK, keine Drittanbieter-Analytics, kein Fehler-Reporting in die Cloud
- Die Erweiterung initiiert nur zwei Arten von Netzwerkanfragen, die **keine** Ihrer Identitätsdaten oder Browserdaten enthalten:
  1. Asynchrones Abrufen der ersten Bytes einiger JS-Dateien, die **bereits von der aktuell besuchten Seite geladen wurden** (aus dem Browser-Cache, ohne zusätzlichen Netzwerkverkehr), zur lokalen Erkennung von Urheberrechtskommentaren und OAuth-Eingangs-URLs in diesem JS
  2. Technologie-Marken-Icons werden **vorrangig aus der integrierten Icon-Bibliothek der Erweiterung** geladen (1300+ SVG/PNG-Icons für gängige Technologien sind offline paketiert, ohne Netzwerkanfragen); nur wenn eine Technologie nicht in der integrierten Icon-Bibliothek enthalten ist, wird ein Fallback-Icon von `cdn.simpleicons.org` abgerufen (der Anfrageinhalt enthält nur einen öffentlichen Technologie-Namen-Slug, z. B. react / vuedotjs / docker, ohne die von Ihnen besuchte Seiten-URL, Erkennungsergebnisse oder personenbezogene Informationen); wenn das CDN nicht innerhalb von 2 Sekunden antwortet, greift die Erweiterung automatisch auf einen lokal generierten Buchstaben-Farbblock zurück, ohne den Erkennungsprozess zu blockieren

## Weitergabe an Dritte

- Diese Erweiterung **verkauft**, **teilt** oder **überträgt** keine Benutzerdaten an Dritte
- Diese Erweiterung verwendet Benutzerdaten **nicht** für Zwecke, die nichts mit der „Erkennung von Tech-Stacks" zu tun haben
- Diese Erweiterung wird **nicht** für Kreditvergabe, Bonitätsprüfung oder ähnliche Zwecke verwendet

## Ihre Rechte

Sie können jederzeit:

- Im Erweiterungs-Popup auf „Aktualisieren" klicken, um die aktuelle Seite neu zu scannen
- In den Erweiterungseinstellungen den Regel-Cache zurücksetzen, beliebige Kategorien deaktivieren, bestimmte Technologienamen sperren oder benutzerdefinierte Regeln hinzufügen
- Die Erweiterung unter `chrome://extensions` deinstallieren; alle lokalen Speicherdaten werden dann automatisch vom Browser gelöscht

## Open-Source-Code

Diese Erweiterung ist vollständig Open Source. Jeder kann den Quellcode prüfen, um die Datenschutzpraktiken zu bestätigen:

https://github.com/setube/stackprism

Die Open-Source-Lizenz ist [MIT](https://opensource.org/licenses/MIT).

## Kontakt

Bei datenschutzbezogenen Fragen wenden Sie sich bitte über GitHub Issues an den Autor:

https://github.com/setube/stackprism/issues

## Änderungen dieser Richtlinie

Die neueste Version dieser Datenschutzerklärung ist stets im Repository unter [PRIVACY.md](https://github.com/setube/stackprism/blob/main/PRIVACY.md) veröffentlicht. Bei wesentlichen Änderungen wird das Datum der letzten Aktualisierung entsprechend aktualisiert.
