# Entwicklerhandbuch

Dieser Abschnitt richtet sich an Personen, die den Quellcode lesen, Regeln ändern oder einen PR einreichen möchten. Wer die Erweiterung nur installieren möchte, findet alle nötigen Informationen im [Benutzerhandbuch](/de/guide/).

## Kapitel

- [Architekturübersicht](./architecture.md) — Projektverzeichnisstruktur, Modulverantwortlichkeiten, Datenfluss
- [Regelformat](./rule-format.md) — Aufbau der JSON-Dateien unter `public/rules/`, nested groups und defaults-Vererbung
- [Erkennungsfluss](./detection-flow.md) — Ablauf von webRequest / Seiten-Injektion bis zur Popup-Darstellung
- [Regeln beitragen](./contribute-rules.md) — Neue Technologien zur eingebauten Regelsammlung hinzufügen
- [Build & Release](./release.md) — Lokaler Build, Paketierung, CRX-Signierung, Release-Workflow

## Tech-Stack-Übersicht

Das Projekt basiert auf Vite 8 + Vue 3 + TypeScript + `@crxjs/vite-plugin` 3.x. Das Hintergrundskript ist ein Manifest-V3-ESM-Service-Worker, als Paketmanager wird bun verwendet.

Regeln liegen unter `public/rules/` und sind nach Seiten-Regeln, Antwortheader-Regeln sowie WordPress-/Drupal-Ökosystem in mehrere JSON-Dateien aufgeteilt. Beim Build werden Regeln vorverarbeitet und Felder wie `__hints` / `__legacyHints` / `__keywordCombined` für schnelleres Matching injiziert.

## Häufig verwendete Entwicklungsbefehle

```bash
bun install            # Abhängigkeiten installieren
bun run dev            # Vite dev server starten, Erweiterung mit Hot-Reload
bun run build          # Build nach dist/, in Chrome ladbar
bun run typecheck      # vue-tsc strikter Typcheck
bun run lint           # ESLint-Prüfung
bun run docs:dev       # Lokale Vorschau dieser Dokumentationsseite
bun run docs:build     # Statische Dokumentationsseite bauen
```

Im Dev-Modus unterstützen Erweiterungsseiten Hot-Reload. Änderungen an popup / settings / help werden meist automatisch aktualisiert; nach Änderungen an `src/background/` oder Content Scripts muss die Erweiterungskarte unter `chrome://extensions/` manuell aktualisiert werden.

## Vue-Einstiegspunkte

Drei unabhängige SPA-Einstiegspunkte, jeweils separat gebaut und voneinander isoliert:

| Einstiegspunkt | Datei                        | Beschreibung                                                                         |
| -------------- | ---------------------------- | ------------------------------------------------------------------------------------ |
| popup          | `src/ui/popup/index.html`    | 440 px × 600 px kleines Fenster, das beim Klick auf das Erweiterungssymbol erscheint |
| settings       | `src/ui/settings/index.html` | Options Page, geöffnet über die Detailseite in `chrome://extensions/`                |
| help           | `src/ui/help/index.html`     | Separater Tab, geöffnet über „Nutzungsanleitung" in den Einstellungen                |

## Weiterführende Links

- [GitHub-Repository](https://github.com/setube/stackprism)
- [Issue-Liste](https://github.com/setube/stackprism/issues)
- [Release-Liste](https://github.com/setube/stackprism/releases)
