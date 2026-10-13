# Bestimmte Technologien deaktivieren

Mit den Erkennungsschaltern lässt sich nach Kategorien filtern. Wenn du nur einzelne benannte Technologien ausblenden möchtest, ohne die gesamte Kategorie zu deaktivieren, verwende dieses Eingabefeld.

## Verwendung

Ein Technologiename pro Zeile. Groß-/Kleinschreibung wird nicht berücksichtigt, führende und nachfolgende Leerzeichen werden automatisch entfernt:

```text
Google Analytics
百度统计
WordPress 插件: akismet
Cloudflare
```

Nach dem Speichern erscheinen diese Technologien nicht mehr in der Popup-Hauptliste, unabhängig von ihrer Kategorie, Konfidenz oder Quelle.

::: tip
Die Namensübereinstimmung verwendet `normalizeTechName(name)`: Leerzeichen entfernen, Kleinschreibung, Satzzeichen entfernen. `WordPress` und `wordpress` sind daher gleichwertig, ebenso `Google Analytics` und `google-analytics`.
:::

## Typische Anwendungsfälle

- **Du weißt bereits, dass eine Seite etwas verwendet, und möchtest es nicht mehr sehen**: Eigene Websites müssen nicht jedes Mal Cloudflare / Vercel anzeigen
- **Fehlerkennungen vermeiden**: Eine Erkennungsregel hat eine zu hohe Fehlerquote, und du möchtest nicht auf eine Korrektur warten – vorübergehend sperren
- **Ausgabe vereinfachen**: RSS / Atom / Service Worker / HTTPS ausblenden, damit die Liste fokussierter bleibt

## Priorität gegenüber Erkennungsschaltern

Beide wirken **additiv**: Zuerst nach Kategorien gefiltert, dann nach der Sperrliste.

## Verhältnis zu den Rohdaten

Deaktivierte Technologien werden **nur ausgeblendet**, nicht aus dem rohen JSON entfernt. Das Panel „Rohdaten" liefert weiterhin vollständige Daten, sodass bei Bedarf nachgeprüft werden kann.

## Beispiel

Angenommen, du möchtest nur CDNs sehen, die nicht Cloudflare sind, aber alle anderen CDN-Erkennungen behalten. Einstellung:

```text
Cloudflare
```

Cloudflare erscheint nicht mehr im Popup; Akamai, Fastly und andere CDNs bleiben weiterhin sichtbar.
