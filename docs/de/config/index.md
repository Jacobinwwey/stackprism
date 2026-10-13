# Konfigurationshandbuch

Die Einstellungsseite lässt sich über die Schaltfläche „Einstellungen" in der Popup-Werkzeugleiste öffnen oder über `chrome://extensions/` → StackPrism-Karte → „Details → Erweiterungsoptionen".

Die Einstellungsseite ist in fünf Bereiche unterteilt:

- [Erkennungsschalter](./categories.md) — 24 Kategorien aktivieren/deaktivieren (deaktivierte Kategorien werden im Popup nicht angezeigt)
- [Bestimmte Technologien deaktivieren](./disabled-technologies.md) — gezielt einzelne Technologien nach Name ausblenden (kategorieunabhängig)
- [Popup-Stil anpassen](./custom-css.md) — CSS schreiben, das den Popup- und Einstellungsstil überschreibt
- [Benutzerdefinierte Regeln](./custom-rules.md) — eigene Erkennungsregeln per Formular oder JSON hinzufügen
- [Regel-JSON importieren/exportieren](./json-export.md) — Regelsets über mehrere Browser und Geräte hinweg synchronisieren

## Speicherort der Konfiguration

Alle Einstellungen werden in `chrome.storage.sync` gespeichert und geräteübergreifend mit dem angemeldeten Google-/Edge-Konto synchronisiert. Der Schlüssel lautet `stackPrismSettings`. Um die Synchronisierung zu deaktivieren, schalte die Synchronisierungsfunktion des Browsers selbst aus.

`chrome.storage.sync` hat ein Kapazitätslimit von 100 KB, wobei ein einzelner Schlüssel maximal 8 KB umfassen darf. Das bedeutet:

- Benutzerdefinierte Regeln haben eine Obergrenze (sicher bei etwa 100 Regeln)
- Benutzerdefiniertes CSS hat eine Längenbegrenzung (max. 10.000 Zeichen)
- Die Sperrliste darf nicht zu lang werden

Die genauen Grenzen sind in `CUSTOM_RULE_LIMITS` in `src/types/settings.ts` definiert. Bei Überschreitung schlägt das Speichern fehl und eine Fehlermeldung wird angezeigt.

## Wann werden Änderungen wirksam?

| Änderung | Wann wirksam |
| -------- | ------------ |
| Erkennungsschalter / Deaktivierte Technologien / Benutzerdefiniertes CSS | Sofort nach erneutem Öffnen des Popups |
| Benutzerdefinierte Regeln | Beim nächsten Neuladen der Seite + erneutem Öffnen des Popups |
| JSON-Import | Wie oben |

Nach dem Klick auf „Einstellungen speichern" werden die Daten sofort in den Storage geschrieben; ein Neuladen der Einstellungsseite ist nicht erforderlich.
