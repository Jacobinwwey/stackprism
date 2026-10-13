# Přepínače detekce

První sekce stránky nastavení obsahuje přepínače kategorií. Každé zaškrtávací políčko odpovídá jedné kategorii — po vypnutí se technologie dané kategorie přestanou zobrazovat ve vyskakovacím okně, a to jak u vestavěných, tak u vlastních pravidel.

## Všechny kategorie

| Kategorie                    | Příklady obsahu                                                                         |
| ---------------------------- | --------------------------------------------------------------------------------------- |
| Frontendové frameworky       | React, Vue, Angular, Next.js, Nuxt, Gatsby, Remix, SvelteKit, Astro                    |
| UI / CSS frameworky          | Tailwind CSS, Bootstrap, Material UI, Ant Design, Element Plus, Chakra UI               |
| Build / Runtime              | Webpack, Vite, Rollup, Parcel, esbuild, SWC, Turbopack, Bun                            |
| CDN / Hosting                | Cloudflare, Akamai, Fastly, AWS CloudFront, Vercel, Netlify, jsDelivr                  |
| WAF / Firewall               | SafeLine, BT-Panel Firewall, Security Dog, Yunluo, Alibaba Cloud WAF, AWS WAF          |
| Backendové frameworky        | Django, Flask, Rails, Laravel, Express, Koa, Spring, ASP.NET                           |
| Systémy pro správu webu      | WordPress, Drupal, Discuz!, Typecho, ZBlog, phpBB, MediaWiki                           |
| Témata / šablony             | Témata WordPress, témata Drupal, zpětná rekonstrukce cest šablon CMS                   |
| Jazyky / Runtime             | PHP, Node.js, Python, Ruby, Java, Go, Rust                                              |
| Analytika                    | Google Analytics, Baidu Analytics, CNZZ, Plausible, Umami                             |
| Přihlášení třetích stran     | Přihlášení Google, GitHub OAuth, WeChat Login, Auth0, Clerk                            |
| Platební systémy             | Stripe, PayPal, Alipay, WeChat Pay, UnionPay                                           |
| Reklamní marketing           | Google Ads, Facebook Pixel, TikTok Pixel                                               |
| SaaS služby                  | Sentry, Mixpanel, Intercom, Crisp, HubSpot                                             |
| AI / Velké jazykové modely   | Open WebUI, Dify, Flowise, Gradio, ComfyUI                                             |
| Monitorování                 | New Relic, Datadog, Pingdom, Hotjar                                                    |
| RSS / Odběr                  | RSS, Atom, JSON Feed                                                                   |
| Pluginy WordPress            | 4 500+ konkrétně pojmenovaných pluginů                                                 |
| Moduly Drupal                | 4 000+ konkrétně pojmenovaných modulů                                                  |
| Bezpečnost a protokoly       | HTTPS, CSP, Service Worker                                                             |
| Ostatní knihovny             | Výchozí kategorie pro vlastní pravidla, záchytná kategorie pro neklasifikované položky |
| ... celkem 24 kategorií      |                                                                                         |

Úplný seznam viz pole `CATEGORY_ORDER` v souboru `src/utils/category-order.ts`.

## Vybrat vše / Zrušit vše

V pravém horním rohu jsou dvě tlačítka — „Vybrat vše" a „Zrušit vše" — pro hromadné zaškrtnutí nebo odznačení všech kategorií.

## Obvyklé důvody pro vypnutí kategorií

- **Zobrazit pouze technologický stack bez pluginů**: vypněte „Pluginy WordPress" a „Moduly Drupal", aby seznam nerostl do délky
- **Zobrazit pouze backend bez frontendu**: vypněte frontendové frameworky / UI frameworky / build & runtime
- **Filtrovat obecné SaaS**: vypněte „Reklamní marketing" a „Analytiku" a zaměřte se na základní technologický stack

## Implementační detaily

Vypnuté kategorie nejsou odstraněny ze surového JSON. Panel „Surové stopy" stále zobrazuje kompletní výsledky detekce. Přepínače kategorií ovlivňují pouze zobrazení v hlavním seznamu vyskakovacího okna.
