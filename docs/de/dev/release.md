# Build & Release

## Lokaler Build

```bash
pnpm install
pnpm run build
```

Ablauf:

1. `pnpm run build:injected` (`build-scripts/build-injected.mjs`): esbuild kompiliert `src/injected/page-detector.ts` und `page-source-search.ts` jeweils zu einer eigenständigen IIFE-Datei, ausgegeben nach `public/injected/`
2. `vite build` (`@crxjs/vite-plugin`): Bündelt die vier Einstiegspunkte background / popup / settings / help, ausgegeben nach `dist/`
3. `precompileRulesPlugin` (Vite-Plugin-Hook closeBundle): Durchsucht `dist/rules/*.json` und injiziert in jede Leaf Rule `__hints` / `__legacyHints` / `__keywordCombined`
4. `minifyJsonAssets` (Vite-Plugin-Hook closeBundle): Schreibt alle JSON-Dateien mit `JSON.stringify(parsed)` neu, entfernt Einrückungen und Zeilenumbrüche

Das fertige `dist/`-Verzeichnis kann direkt im Entwicklermodus unter `chrome://extensions/` geladen werden.

## Entwicklungs-Hot-Reload

```bash
pnpm run dev
```

Vite dev server + crxjs HMR: Änderungen an `src/ui/**` (Popup / Einstellungen / Hilfeseite) werden automatisch ersetzt. Nach Änderungen an `src/background/**` oder `src/content/**` muss die Erweiterungskarte unter `chrome://extensions/` manuell aktualisiert werden.

## Typen & Lint

```bash
pnpm run typecheck    # vue-tsc --noEmit, strikter Typcheck des gesamten Projekts
pnpm run lint         # eslint src
```

Vor dem Commit einmalig formatieren:

```bash
npx prettier --write .
```

## Versionsverwaltung

Das Feld `version` in `package.json` ist die einzige Quelle der Wahrheit. `@crxjs/vite-plugin` synchronisiert es automatisch in `dist/manifest.json`.

Normale Features, Regeln und Bugfixes erhöhen den Patch-Wert. Nach `99` wird der Minor-Wert erhöht; `1.1.100` wird nicht verwendet:

```bash
# 1.1.98 -> 1.1.99
# 1.1.99 -> 1.2.0
```

Nur Versionen, für die ein Installationspaket veröffentlicht werden soll, erhalten ein GitHub Release: `x.y.0`, `x.y.10`, `x.y.20`, …, `x.y.90`. Zum Beispiel erhalten `1.2.0` und `1.2.10` ein Release, `1.2.5` und `1.2.15` nicht.

```bash
# Nach Änderung der Version in package.json
git add package.json
git commit -m "chore: bump 1.2.10"
git push origin main
```

## GitHub-Release-Workflow

`.github/workflows/release-extension.yml` wird in zwei Fällen ausgelöst:

1. Veröffentlichung eines Releases in der GitHub-UI (`release: published`-Event)
2. Manueller Start über workflow_dispatch auf der Actions-Seite (optionaler release_tag-Input)

Was der Workflow tut:

1. Checkout + pnpm + Node 20 installieren
2. `pnpm install --frozen-lockfile`
3. `pnpm run build`
4. Version aus `dist/manifest.json` lesen, Übereinstimmung mit dem Release-Tag prüfen
5. `dist/` vollständig als `stackprism-v{ver}.zip` + SHA256 zippen
6. **Falls Secret `EXTENSION_PRIVATE_KEY` konfiguriert**: mit `npx crx3` `stackprism-v{ver}.crx` + SHA256 signieren; andernfalls diesen Schritt überspringen und nur zip hochladen
7. Alle Artefakte per `gh release upload --clobber` in das Release-Tag hochladen
8. Per `actions/upload-artifact` zusätzlich ein Backup-Artifact erstellen

## Release Notes

Die Release Notes werden aus `git log --oneline vPREV..HEAD` (vom vorherigen Release-Tag bis zum aktuellen Commit) zusammengestellt, nicht direkt als Commit-Liste eingefügt. Die Gliederung richtet sich nach dem, was Nutzer verstehen:

- Regelverbesserungen
- Popup & Einstellungsseite
- Dokumentationsseite
- Build & Release-Prozess

Release Notes enthalten nur Änderungen, die für Nutzer oder Maintainer relevant sind. Lokale Formatierungen, Typprüfungen, Lint-Läufe oder Build-Befehle werden nicht aufgeführt.

## CRX-Signierungsschlüssel

Vor der ersten Veröffentlichung muss ein RSA-Privatschlüssel erzeugt und als GitHub-Repository-Secret konfiguriert werden.

### Privatschlüssel erzeugen

```bash
openssl genrsa -out extension.pem 2048
```

::: warning
`extension.pem` **darf unter keinen Umständen verloren gehen** — eine neu generierte Datei ändert die Erweiterungs-ID (Chrome behandelt sie dann als andere Erweiterung). Lokal archivieren und sichern.
:::

### In GitHub konfigurieren

1. Repository Settings → Secrets and variables → Actions → New repository secret
2. Name: `EXTENSION_PRIVATE_KEY`
3. Secret: den **gesamten Inhalt** der Datei `extension.pem` (einschließlich `-----BEGIN PRIVATE KEY-----` und `-----END PRIVATE KEY-----`) einfügen
4. Speichern

Der Workflow verwendet diesen Schlüssel anschließend automatisch zum Signieren der CRX-Datei.

### Was passiert ohne diesen Schritt?

Der Workflow läuft weiterhin durch, produziert jedoch keine `.crx`-Datei. Nutzer können die Erweiterung dann nur per ZIP entpacken und manuell laden.

## Release-Checkliste

- [ ] `npx prettier --write .` ausgeführt
- [ ] `pnpm run typecheck` bestanden
- [ ] `pnpm run lint` bestanden
- [ ] `pnpm run build` bestanden
- [ ] `dist/` in Chrome geladen und kritische Pfade manuell getestet (Popup öffnen, eine Seite erkennen, aktualisieren, vollständigen Tech-Stack-Bericht kopieren, Einstellungsseite: Regel hinzufügen)
- [ ] `version` in `package.json` erhöht
- [ ] git commit + push
- [ ] Falls die Version ein Release-Punkt ist: Release in der GitHub-UI veröffentlichen (Tag `v{version}`, passend zu package.json)
- [ ] Auf den Abschluss des Release-Workflows warten und sicherstellen, dass zip / crx und SHA256 in den Release-Assets vorhanden sind

## Im Chrome Web Store veröffentlichen

Der Workflow lädt nicht automatisch in den Chrome Web Store hoch — die CWS Publish API erfordert einen OAuth2-Flow; derzeit erfolgt das manuell:

1. Das Verzeichnis `dist/` als ZIP packen (das gleiche Paket wie das Workflow-ZIP)
2. [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) → Neue Version hochladen
3. Änderungsnotizen ausfüllen, auf die Prüfung warten (in der Regel 1–3 Werktage)
