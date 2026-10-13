# Erkennungsschalter

Der erste Bereich der Einstellungsseite enthält Kategorie-Schalter. Jede Checkbox entspricht einer Kategorie; ist sie deaktiviert, werden Technologien dieser Kategorie im Popup nicht mehr angezeigt – das gilt für eingebaute und benutzerdefinierte Regeln gleichermaßen.

## Alle Kategorien

| Kategorie                 | Enthaltene Beispiele                                                              |
| ------------------------- | --------------------------------------------------------------------------------- |
| Frontend-Frameworks       | React, Vue, Angular, Next.js, Nuxt, Gatsby, Remix, SvelteKit, Astro               |
| UI / CSS-Frameworks       | Tailwind CSS, Bootstrap, Material UI, Ant Design, Element Plus, Chakra UI         |
| Build-Runtime             | Webpack, Vite, Rollup, Parcel, esbuild, SWC, Turbopack, Bun                       |
| CDN / Hosting             | Cloudflare, Akamai, Fastly, AWS CloudFront, Vercel, Netlify, jsDelivr             |
| WAF / Firewall            | SafeLine, Baota Web Firewall, 安全狗, 云锁, Alibaba Cloud WAF, AWS WAF            |
| Backend-Frameworks        | Django, Flask, Rails, Laravel, Express, Koa, Spring, ASP.NET                      |
| CMS / Website-Programme   | WordPress, Drupal, Discuz!, Typecho, ZBlog, phpBB, MediaWiki                      |
| Themes / Templates        | WordPress-Themes, Drupal-Themes, CMS-Template-Pfad-Rückschluss                    |
| Sprachen / Runtimes       | PHP, Node.js, Python, Ruby, Java, Go, Rust                                        |
| Analytics / Statistik     | Google Analytics, Baidu Statistics, Umami, Plausible                              |
| Drittanbieter-Login       | Google Login, GitHub OAuth, WeChat Login, Auth0, Clerk                            |
| Zahlungssysteme           | Stripe, PayPal, Alipay, WeChat Pay, UnionPay                                      |
| Werbung & Marketing       | Google Ads, Facebook Pixel, TikTok Pixel                                          |
| SaaS-Dienste              | Sentry, Mixpanel, Intercom, Crisp, HubSpot                                        |
| KI / LLM                  | Open WebUI, Dify, Flowise, Gradio, ComfyUI                                        |
| Monitoring                | New Relic, Datadog, Pingdom, Hotjar                                               |
| RSS / Feeds               | RSS, Atom, JSON Feed                                                              |
| WordPress-Plugins         | 4.500+ benannte Plugins                                                           |
| Drupal-Module             | 4.000+ benannte Module                                                            |
| Sicherheit & Protokolle   | HTTPS, CSP, Service Worker                                                        |
| Sonstige Bibliotheken     | Standard-Kategorie für benutzerdefinierte Regeln und nicht klassifizierte Treffer |
| … insgesamt 24 Kategorien |                                                                                   |

Die vollständige Liste findet sich im Array `CATEGORY_ORDER` in `src/utils/category-order.ts`.

## Alle aktivieren / alle deaktivieren

Oben rechts befinden sich die Schaltflächen „Alle aktivieren" und „Alle deaktivieren" zum Massenauswählen oder -abwählen aller Kategorien.

## Typische Anwendungsfälle für deaktivierte Kategorien

- **Nur Tech-Stack, keine Plugins**: „WordPress-Plugins" und „Drupal-Module" deaktivieren, damit Plugin-Namen die Liste nicht aufblähen
- **Nur Backend, kein Frontend**: Frontend-Frameworks, UI-Frameworks und Build-Runtime deaktivieren
- **Generische SaaS herausfiltern**: „Werbung & Marketing" und „Analytics / Statistik" deaktivieren, um den Fokus auf den Kern-Tech-Stack zu legen

## Implementierungsdetails

Deaktivierte Kategorien werden nicht aus dem rohen JSON entfernt. Das Panel „Rohdaten" zeigt weiterhin alle Erkennungsergebnisse. Erkennungsschalter beeinflussen ausschließlich die Anzeige in der Popup-Hauptliste.
