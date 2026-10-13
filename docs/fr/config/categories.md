# Interrupteurs de catégories

La première section de la page de paramètres regroupe les interrupteurs de catégories. Chaque case à cocher correspond à une catégorie ; la désactiver supprime de la popup toutes les technologies de cette catégorie, qu'elles proviennent des règles intégrées ou des règles personnalisées.

## Toutes les catégories

| Catégorie                  | Exemples                                                                          |
| -------------------------- | --------------------------------------------------------------------------------- |
| Frameworks frontend        | React, Vue, Angular, Next.js, Nuxt, Gatsby, Remix, SvelteKit, Astro               |
| Frameworks UI / CSS        | Tailwind CSS, Bootstrap, Material UI, Ant Design, Element Plus, Chakra UI         |
| Runtime de build           | Webpack, Vite, Rollup, Parcel, esbuild, SWC, Turbopack, Bun                      |
| CDN / Hébergement          | Cloudflare, Akamai, Fastly, AWS CloudFront, Vercel, Netlify, jsDelivr             |
| WAF / Pare-feu             | SafeLine, BT Website Firewall, 安全狗, 云锁, Alibaba Cloud WAF, AWS WAF           |
| Frameworks backend         | Django, Flask, Rails, Laravel, Express, Koa, Spring, ASP.NET                     |
| Programmes de site         | WordPress, Drupal, Discuz!, Typecho, ZBlog, phpBB, MediaWiki                     |
| Thèmes / Modèles           | Thèmes WordPress, thèmes Drupal, reconstruction de chemins de modèles CMS        |
| Langages / Runtimes        | PHP, Node.js, Python, Ruby, Java, Go, Rust                                       |
| Statistiques / Analytique  | Google Analytics, Baidu Statistics, Umeng, Plausible, Umami                      |
| Connexions tierces         | Google Sign-In, GitHub OAuth, WeChat Login, Auth0, Clerk                         |
| Systèmes de paiement       | Stripe, PayPal, Alipay, WeChat Pay, UnionPay                                     |
| Publicité & Marketing      | Google Ads, Facebook Pixel, TikTok Pixel                                         |
| Services SaaS              | Sentry, Mixpanel, Intercom, Crisp, HubSpot                                       |
| IA / LLM                   | Open WebUI, Dify, Flowise, Gradio, ComfyUI                                       |
| Sondes / Monitoring        | New Relic, Datadog, Pingdom, Hotjar                                              |
| RSS / Abonnements          | RSS, Atom, JSON Feed                                                             |
| Plugins WordPress          | 4 500+ plugins nommés                                                            |
| Modules Drupal             | 4 000+ modules nommés                                                            |
| Sécurité & Protocoles      | HTTPS, CSP, Service Worker                                                       |
| Autres bibliothèques       | Catégorie par défaut des règles personnalisées et catégorie de repli             |
| … 24 catégories au total   |                                                                                   |

Liste complète : tableau `CATEGORY_ORDER` dans `src/utils/category-order.ts`.

## Tout activer / Tout désactiver

Les boutons « Tout activer » et « Tout désactiver » en haut à droite permettent de cocher ou décocher toutes les catégories en une fois.

## Cas d'usage courants pour désactiver des catégories

- **Voir uniquement la pile technologique, sans les plugins** : désactivez « Plugins WordPress » et « Modules Drupal » pour éviter que les noms de plugins n'allongent trop la liste
- **Voir uniquement le backend, pas le frontend** : désactivez les frameworks frontend / frameworks UI / runtime de build
- **Filtrer les SaaS génériques** : désactivez « Publicité & Marketing » et « Statistiques / Analytique » pour se concentrer sur la pile principale

## Détails d'implémentation

Les catégories désactivées ne sont pas retirées du JSON brut. Le panneau « Indices bruts » affiche toujours les résultats de détection complets. Les interrupteurs de catégories n'affectent que la liste principale de la popup.
