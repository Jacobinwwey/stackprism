# 識別開關

設定頁第一塊是分類開關。每個 checkbox 對應一個分類，關掉後彈窗裡不再顯示該分類下的技術，包括內建規則和自訂規則。

## 全部分類

| 分類              | 包含範例                                                                  |
| ----------------- | ------------------------------------------------------------------------- |
| 前端框架          | React、Vue、Angular、Next.js、Nuxt、Gatsby、Remix、SvelteKit、Astro       |
| UI / CSS 框架     | Tailwind CSS、Bootstrap、Material UI、Ant Design、Element Plus、Chakra UI |
| 建置執行時        | Webpack、Vite、Rollup、Parcel、esbuild、SWC、Turbopack、Bun               |
| CDN / 託管        | Cloudflare、Akamai、Fastly、AWS CloudFront、Vercel、Netlify、jsDelivr     |
| WAF / 防火牆      | 雷池 SafeLine、寶塔網站防火牆、安全狗、雲鎖、阿里雲 WAF、AWS WAF          |
| 後端框架          | Django、Flask、Rails、Laravel、Express、Koa、Spring、ASP.NET              |
| 網站程式          | WordPress、Drupal、Discuz!、Typecho、ZBlog、phpBB、MediaWiki              |
| 佈景主題 / 模板   | WordPress 佈景主題、Drupal 佈景主題、CMS 模板路徑反推                     |
| 開發語言 / 執行時 | PHP、Node.js、Python、Ruby、Java、Go、Rust                                |
| 統計 / 分析       | Google Analytics、百度統計、友盟、Plausible、Umami                        |
| 第三方登入        | Google 登入、GitHub OAuth、微信登入、Auth0、Clerk                         |
| 支付系統          | Stripe、PayPal、支付寶、微信支付、銀聯                                    |
| 廣告行銷          | Google Ads、Facebook Pixel、TikTok Pixel                                  |
| SaaS 服務         | Sentry、Mixpanel、Intercom、Crisp、HubSpot                                |
| AI / 大型語言模型 | Open WebUI、Dify、Flowise、Gradio、ComfyUI                                |
| 探針 / 監控       | New Relic、Datadog、Pingdom、Hotjar                                       |
| RSS / 訂閱        | RSS、Atom、JSON Feed                                                      |
| WordPress 外掛    | 4500+ 個具名外掛                                                          |
| Drupal 模組       | 4000+ 個具名模組                                                          |
| 安全與協定        | HTTPS、CSP、Service Worker                                                |
| 其他程式庫        | 自訂規則預設歸類、未明確分類的兜底                                        |
| ... 等共 24 類    |

完整清單：`src/utils/category-order.ts` 的 `CATEGORY_ORDER` 陣列。

## 全開 / 全關

右上角有「全開」「全關」兩個按鈕，用來批次勾選或取消所有分類。

## 關閉分類的常見用途

- **只看技術棧，不看外掛**：關「WordPress 外掛」「Drupal 模組」，避免外掛名稱把列表撐得太長
- **只看後端不看前端**：關掉前端框架 / UI 框架 / 建置執行時
- **過濾通用 SaaS**：關「廣告行銷」「統計 / 分析」聚焦核心技術棧

## 實作細節

被關閉的分類不會從 raw JSON 裡刪除。「原始線索」面板仍能看到完整識別結果。識別開關只影響彈窗主列表的顯示。
