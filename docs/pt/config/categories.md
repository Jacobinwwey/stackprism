# Alternâncias de categoria

A primeira seção da página de configurações são as alternâncias de categoria. Cada checkbox corresponde a uma categoria; desativá-la oculta as tecnologias dessa categoria no popup, incluindo tanto as regras integradas quanto as regras personalizadas.

## Todas as categorias

| Categoria                  | Exemplos incluídos                                                        |
| -------------------------- | ------------------------------------------------------------------------- |
| Frameworks frontend        | React, Vue, Angular, Next.js, Nuxt, Gatsby, Remix, SvelteKit, Astro       |
| Frameworks UI / CSS        | Tailwind CSS, Bootstrap, Material UI, Ant Design, Element Plus, Chakra UI |
| Builds / Runtimes          | Webpack, Vite, Rollup, Parcel, esbuild, SWC, Turbopack, Bun               |
| CDN / Hospedagem           | Cloudflare, Akamai, Fastly, AWS CloudFront, Vercel, Netlify, jsDelivr     |
| WAF / Firewall             | SafeLine, Baota WAF, Safedog, YunSuo, Alibaba Cloud WAF, AWS WAF          |
| Frameworks backend         | Django, Flask, Rails, Laravel, Express, Koa, Spring, ASP.NET              |
| CMS / Programas web        | WordPress, Drupal, Discuz!, Typecho, ZBlog, phpBB, MediaWiki              |
| Temas / Templates          | Temas WordPress, temas Drupal, inferência de caminho de template CMS      |
| Linguagens / Runtimes      | PHP, Node.js, Python, Ruby, Java, Go, Rust                                |
| Analytics / Análise        | Google Analytics, Baidu Analytics, Plausible, Umami                       |
| Login de terceiros         | Login Google, GitHub OAuth, Auth0, Clerk                                  |
| Sistemas de pagamento      | Stripe, PayPal, Alipay, WeChat Pay, UnionPay                              |
| Publicidade / Marketing    | Google Ads, Facebook Pixel, TikTok Pixel                                  |
| Serviços SaaS              | Sentry, Mixpanel, Intercom, Crisp, HubSpot                                |
| AI / LLMs                  | Open WebUI, Dify, Flowise, Gradio, ComfyUI                                |
| Monitoramento / Probes     | New Relic, Datadog, Pingdom, Hotjar                                       |
| RSS / Feeds                | RSS, Atom, JSON Feed                                                      |
| Plugins WordPress          | 4500+ plugins nomeados                                                    |
| Módulos Drupal             | 4000+ módulos nomeados                                                    |
| Segurança e protocolos     | HTTPS, CSP, Service Worker                                                |
| Outras bibliotecas         | Fallback para regras personalizadas sem categoria definida                |
| ... 24 categorias no total |                                                                           |

Lista completa: array `CATEGORY_ORDER` em `src/utils/category-order.ts`.

## Ativar tudo / Desativar tudo

Os botões "Ativar tudo" e "Desativar tudo" no canto superior direito selecionam ou desmarcam todas as categorias em lote.

## Casos de uso comuns para desativar categorias

- **Ver apenas a stack, sem plugins**: desative "Plugins WordPress" e "Módulos Drupal" para evitar que nomes de plugins tornem a lista muito longa
- **Ver apenas backend, não frontend**: desative frameworks frontend / frameworks UI / builds e runtimes
- **Filtrar SaaS genérico**: desative "Publicidade / Marketing" e "Analytics / Análise" para focar na stack principal

## Detalhes de implementação

Categorias desativadas não são removidas do JSON bruto. O painel "Dados brutos" ainda mostra os resultados completos de detecção. As alternâncias de categoria afetam apenas a exibição na lista principal do popup.
