# Selettori di rilevamento

Il primo blocco della pagina delle impostazioni contiene i selettori di categoria. Ogni checkbox corrisponde a una categoria; disabilitandola, le tecnologie di quella categoria non vengono più mostrate nel popup, né per le regole integrate né per quelle personalizzate.

## Tutte le categorie

| Categoria               | Esempi                                                                      |
| ----------------------- | --------------------------------------------------------------------------- |
| Framework frontend      | React, Vue, Angular, Next.js, Nuxt, Gatsby, Remix, SvelteKit, Astro         |
| Framework UI / CSS      | Tailwind CSS, Bootstrap, Material UI, Ant Design, Element Plus, Chakra UI   |
| Build / Runtime         | Webpack, Vite, Rollup, Parcel, esbuild, SWC, Turbopack, Bun                 |
| CDN / Hosting           | Cloudflare, Akamai, Fastly, AWS CloudFront, Vercel, Netlify, jsDelivr       |
| WAF / Firewall          | SafeLine, Pagoda WAF, SafeDog, YunSuo, Alibaba Cloud WAF, AWS WAF           |
| Framework backend       | Django, Flask, Rails, Laravel, Express, Koa, Spring, ASP.NET                |
| CMS / Programmi web     | WordPress, Drupal, Discuz!, Typecho, ZBlog, phpBB, MediaWiki                |
| Temi / Template         | Temi WordPress, temi Drupal, percorsi template CMS                          |
| Linguaggi / Runtime     | PHP, Node.js, Python, Ruby, Java, Go, Rust                                  |
| Analytics / Statistiche | Google Analytics, Baidu Analytics, CNZZ, Plausible, Umami                   |
| Login di terze parti    | Google Login, GitHub OAuth, WeChat Login, Auth0, Clerk                      |
| Sistemi di pagamento    | Stripe, PayPal, Alipay, WeChat Pay, UnionPay                                |
| Pubblicità / Marketing  | Google Ads, Facebook Pixel, TikTok Pixel                                    |
| Servizi SaaS            | Sentry, Mixpanel, Intercom, Crisp, HubSpot                                  |
| AI / LLM                | Open WebUI, Dify, Flowise, Gradio, ComfyUI                                  |
| Monitoring / Probe      | New Relic, Datadog, Pingdom, Hotjar                                         |
| RSS / Feed              | RSS, Atom, JSON Feed                                                        |
| Plugin WordPress        | 4500+ plugin con nome                                                       |
| Moduli Drupal           | 4000+ moduli con nome                                                       |
| Sicurezza e protocolli  | HTTPS, CSP, Service Worker                                                  |
| Altre librerie          | Categoria predefinita per regole personalizzate e fallback non classificati |
| ... totale 24 categorie |                                                                             |

Elenco completo: array `CATEGORY_ORDER` in `src/utils/category-order.ts`.

## Attiva tutto / Disattiva tutto

In alto a destra ci sono due pulsanti "Attiva tutto" e "Disattiva tutto" per selezionare o deselezionare tutte le categorie in blocco.

## Utilizzi comuni della disabilitazione delle categorie

- **Solo stack tecnologico, senza plugin**: disabilita "Plugin WordPress" e "Moduli Drupal" per evitare che i nomi dei plugin appesantiscano la lista
- **Solo backend, niente frontend**: disabilita framework frontend / UI / build runtime
- **Filtrare SaaS generici**: disabilita "Pubblicità / Marketing" e "Analytics / Statistiche" per concentrarsi sullo stack core

## Dettagli implementativi

Le categorie disabilitate non vengono rimosse dal JSON grezzo. Il pannello "Indizi grezzi" mostra ancora i risultati completi del rilevamento. I selettori influenzano solo la visualizzazione nell'elenco principale del popup.
