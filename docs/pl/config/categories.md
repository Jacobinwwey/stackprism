# Przełączniki kategorii

Pierwsza sekcja strony ustawień to przełączniki kategorii. Każde pole wyboru odpowiada jednej kategorii. Po wyłączeniu kategorii technologie z niej nie pojawiają się w oknie podręcznym — dotyczy to zarówno reguł wbudowanych, jak i niestandardowych.

## Wszystkie kategorie

| Kategoria                  | Przykłady                                                                     |
| -------------------------- | ----------------------------------------------------------------------------- |
| Frameworki frontendowe     | React, Vue, Angular, Next.js, Nuxt, Gatsby, Remix, SvelteKit, Astro           |
| Frameworki UI / CSS        | Tailwind CSS, Bootstrap, Material UI, Ant Design, Element Plus, Chakra UI     |
| Środowisko kompilacji      | Webpack, Vite, Rollup, Parcel, esbuild, SWC, Turbopack, Bun                   |
| CDN / Hosting              | Cloudflare, Akamai, Fastly, AWS CloudFront, Vercel, Netlify, jsDelivr         |
| WAF / Zapora               | SafeLine, Baota WAF, Safedog, YunSuo, Alibaba Cloud WAF, AWS WAF              |
| Frameworki backendowe      | Django, Flask, Rails, Laravel, Express, Koa, Spring, ASP.NET                  |
| Programy stron             | WordPress, Drupal, Discuz!, Typecho, ZBlog, phpBB, MediaWiki                  |
| Motywy / Szablony          | Motywy WordPress, motywy Drupal, ścieżki szablonów CMS                        |
| Języki / Środowisko        | PHP, Node.js, Python, Ruby, Java, Go, Rust                                    |
| Statystyki / Analityka     | Google Analytics, Baidu Analytics, Umami, Plausible                           |
| Logowania zewnętrzne       | Google Login, GitHub OAuth, WeChat Login, Auth0, Clerk                        |
| Systemy płatności          | Stripe, PayPal, Alipay, WeChat Pay, UnionPay                                  |
| Reklamy i marketing        | Google Ads, Facebook Pixel, TikTok Pixel                                      |
| Usługi SaaS                | Sentry, Mixpanel, Intercom, Crisp, HubSpot                                    |
| AI / Modele językowe       | Open WebUI, Dify, Flowise, Gradio, ComfyUI                                    |
| Monitoring / Probes        | New Relic, Datadog, Pingdom, Hotjar                                            |
| RSS / Subskrypcje          | RSS, Atom, JSON Feed                                                           |
| Wtyczki WordPress          | Ponad 4500 nazwanych wtyczek                                                   |
| Moduły Drupal              | Ponad 4000 nazwanych modułów                                                   |
| Bezpieczeństwo i protokoły | HTTPS, CSP, Service Worker                                                     |
| Pozostałe biblioteki       | Domyślna kategoria dla reguł niestandardowych i nieprzypisanych technologii    |
| … łącznie 24 kategorie     |                                                                               |

Pełna lista znajduje się w tablicy `CATEGORY_ORDER` w pliku `src/utils/category-order.ts`.

## Zaznacz wszystkie / Odznacz wszystkie

W prawym górnym rogu znajdują się przyciski „Zaznacz wszystkie" i „Odznacz wszystkie" do zbiorczego zaznaczania lub odznaczania wszystkich kategorii.

## Typowe zastosowania wyłączania kategorii

- **Tylko stos technologiczny, bez wtyczek**: wyłącz „Wtyczki WordPress" i „Moduły Drupal", aby lista nie była zbyt długa
- **Tylko backend bez frontendu**: wyłącz frameworki frontendowe, frameworki UI i środowisko kompilacji
- **Filtrowanie ogólnych SaaS**: wyłącz „Reklamy i marketing" oraz „Statystyki / Analityka", aby skupić się na podstawowym stosie

## Szczegóły implementacji

Wyłączone kategorie nie są usuwane z surowego JSON. Panel „Surowe wskazówki" nadal pokazuje pełne wyniki rozpoznawania. Przełączniki kategorii wpływają tylko na wyświetlanie w głównej liście okna podręcznego.
