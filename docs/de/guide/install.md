# Installation & Aktivierung

StackPrism unterstützt Chromium-basierte Browser (Chrome, Edge, Brave, Opera, Vivaldi, Arc usw.) und setzt Manifest V3 voraus.

## Aus einem Erweiterungs-Store installieren

- [Chrome Web Store](https://chromewebstore.google.com/detail/stackprism/cagpdifljieeiajlhlcboelglkalofak)
- [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/stackprism/ojgmhlogaoiegdonnlnibeoikbleccno)
- [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/stackprism/)

Wenn der Browser nicht automatisch erkannt wird, wählen Sie den passenden Store.

## Methode 1: CRX aus dem Release herunterladen

1. Öffne [GitHub Releases](https://github.com/setube/stackprism/releases)
2. Wähle die neueste Version und lade `stackprism-v{version}.crx` herunter
3. Gib in der Adressleiste `chrome://extensions/` ein (Edge: `edge://extensions/`), aktiviere den „Entwicklermodus" oben rechts
4. Ziehe die heruntergeladene `.crx`-Datei in die Erweiterungsseite
5. Bestätige im erscheinenden Dialog „Erweiterung hinzufügen"

::: tip
Chrome blockiert gelegentlich die Installation per Drag & Drop einer .crx-Datei (Meldung „Apps, Erweiterungen und Benutzerskripte von dieser Website können nicht hinzugefügt werden"). Verwende in diesem Fall Methode 2.
:::

## Methode 2: ZIP aus dem Release herunterladen und entpacken

1. Öffne [GitHub Releases](https://github.com/setube/stackprism/releases) und lade `stackprism-v{version}.zip` herunter
2. Entpacke die Datei in ein stabiles Verzeichnis (**nicht löschen – die Erweiterung benötigt dieses Verzeichnis**)
3. Öffne `chrome://extensions/` und aktiviere den „Entwicklermodus"
4. Klicke auf „Entpackte Erweiterung laden"
5. Wähle das soeben entpackte Verzeichnis aus

## Methode 3: Lokal aus dem Quellcode bauen

Geeignet für Entwickler oder Nutzer, die immer den aktuellen Hauptzweig verwenden möchten.

```bash
git clone https://github.com/setube/stackprism.git
cd stackprism
bun install
bun run build
```

Das Build-Ergebnis liegt in `dist/`. Lade das Verzeichnis `dist/` im Entwicklermodus unter `chrome://extensions/`.

Nach Quelltextänderungen genügt es, `bun run build` erneut auszuführen und anschließend auf der Erweiterungsseite die Schaltfläche „Aktualisieren" auf der Erweiterungskarte zu klicken.

## Aktivierung & Berechtigungen

Bei der Erstinstallation werden folgende Berechtigungen angefragt:

| Berechtigung | Zweck                                                                      |
| ------------ | -------------------------------------------------------------------------- |
| `tabs`       | URL / Titel des aktuellen Tabs lesen                                       |
| `activeTab`  | Erkennungsskript in die aktive Seite injizieren                            |
| `scripting`  | page-detector / page-source-search in die MAIN world der Seite injizieren  |
| `storage`    | Einstellungen, gecachte Erkennungsergebnisse und Theme-Präferenz speichern |
| `webRequest` | Antwortheader für server / x-powered-by u. a. mithören                     |
| `<all_urls>` | Auf allen http(s)-Seiten ausführen                                         |

Der Erkennungsvorgang ist nicht auf externe APIs angewiesen: Regeldateien werden mit der Erweiterung gebündelt und lokal ausgeliefert; Erkennungsergebnisse verbleiben im Browserspeicher und im Extension Storage.

## Deinstallation

`chrome://extensions/` → StackPrism suchen → Entfernen. Einstellungen und Cache werden dabei ebenfalls gelöscht.
