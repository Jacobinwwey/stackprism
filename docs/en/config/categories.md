# Category Toggles

The first section of the settings page is the category toggles. Each checkbox corresponds to one category. Disabling a category removes all technologies in that category from the popup, including both built-in and custom rules.

## All Categories

| Category                   | Examples                                                                          |
| -------------------------- | --------------------------------------------------------------------------------- |
| Frontend Frameworks        | React, Vue, Angular, Next.js, Nuxt, Gatsby, Remix, SvelteKit, Astro              |
| UI / CSS Frameworks        | Tailwind CSS, Bootstrap, Material UI, Ant Design, Element Plus, Chakra UI         |
| Build / Runtime            | Webpack, Vite, Rollup, Parcel, esbuild, SWC, Turbopack, Bun                      |
| CDN / Hosting              | Cloudflare, Akamai, Fastly, AWS CloudFront, Vercel, Netlify, jsDelivr            |
| WAF / Firewall             | SafeLine, BT Panel WAF, Security Dog, YunSuo, Alibaba Cloud WAF, AWS WAF         |
| Backend Frameworks         | Django, Flask, Rails, Laravel, Express, Koa, Spring, ASP.NET                     |
| CMS / Website Programs     | WordPress, Drupal, Discuz!, Typecho, ZBlog, phpBB, MediaWiki                     |
| Themes / Templates         | WordPress themes, Drupal themes, CMS template path inference                     |
| Language / Runtime         | PHP, Node.js, Python, Ruby, Java, Go, Rust                                       |
| Analytics                  | Google Analytics, Baidu Tongji, CNZZ, Plausible, Umami                           |
| Third-party Login          | Google Sign-In, GitHub OAuth, WeChat Login, Auth0, Clerk                         |
| Payment Systems            | Stripe, PayPal, Alipay, WeChat Pay, UnionPay                                     |
| Ad / Marketing             | Google Ads, Facebook Pixel, TikTok Pixel                                         |
| SaaS Services              | Sentry, Mixpanel, Intercom, Crisp, HubSpot                                       |
| AI / LLM                   | Open WebUI, Dify, Flowise, Gradio, ComfyUI                                       |
| Monitoring / APM           | New Relic, Datadog, Pingdom, Hotjar                                               |
| RSS / Feeds                | RSS, Atom, JSON Feed                                                              |
| WordPress Plugins          | 4,500+ named plugins                                                              |
| Drupal Modules             | 4,000+ named modules                                                              |
| Security & Protocol        | HTTPS, CSP, Service Worker                                                        |
| Other Libraries            | Default category for custom rules and uncategorized detections                   |
| … 24 categories total      |                                                                                   |

Full list: the `CATEGORY_ORDER` array in `src/utils/category-order.ts`.

## Enable All / Disable All

The "Enable All" and "Disable All" buttons in the top-right corner let you toggle every category at once.

## Common Uses for Disabling Categories

- **Focus on the tech stack, not plugins**: disable WordPress Plugins and Drupal Modules to keep the list manageable
- **Backend only**: disable Frontend Frameworks, UI/CSS Frameworks, and Build/Runtime
- **Filter generic SaaS noise**: disable Ad/Marketing and Analytics to focus on core infrastructure

## Implementation Note

Disabled categories are not removed from the raw JSON. The Raw Clues panel still shows the complete detection data. Category toggles only affect what appears in the popup's main list.
