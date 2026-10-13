# 検出スイッチ

設定ページの最初のセクションはカテゴリースイッチです。各チェックボックスは 1 つのカテゴリーに対応しており、無効にするとそのカテゴリーの技術はポップアップに表示されなくなります。組み込みルールとカスタムルールの両方が対象です。

## 全カテゴリー

| カテゴリー                   | 含まれる例                                                                         |
| ---------------------------- | ---------------------------------------------------------------------------------- |
| フロントエンドフレームワーク | React、Vue、Angular、Next.js、Nuxt、Gatsby、Remix、SvelteKit、Astro                |
| UI / CSS フレームワーク      | Tailwind CSS、Bootstrap、Material UI、Ant Design、Element Plus、Chakra UI          |
| ビルドランタイム             | Webpack、Vite、Rollup、Parcel、esbuild、SWC、Turbopack、Bun                        |
| CDN / ホスティング           | Cloudflare、Akamai、Fastly、AWS CloudFront、Vercel、Netlify、jsDelivr              |
| WAF / ファイアウォール       | 雷池 SafeLine、宝塔 Web ファイアウォール、安全狗、云锁、Alibaba Cloud WAF、AWS WAF |
| バックエンドフレームワーク   | Django、Flask、Rails、Laravel、Express、Koa、Spring、ASP.NET                       |
| CMS / ウェブサイトプログラム | WordPress、Drupal、Discuz!、Typecho、ZBlog、phpBB、MediaWiki                       |
| テーマ / テンプレート        | WordPress テーマ、Drupal テーマ、CMS テンプレートのパス逆推論                      |
| 開発言語 / ランタイム        | PHP、Node.js、Python、Ruby、Java、Go、Rust                                         |
| アナリティクス / 分析        | Google Analytics、百度統計、友盟、Plausible、Umami                                 |
| サードパーティログイン       | Google ログイン、GitHub OAuth、WeChat ログイン、Auth0、Clerk                       |
| 決済システム                 | Stripe、PayPal、Alipay、WeChat Pay、UnionPay                                       |
| 広告 / マーケティング        | Google Ads、Facebook Pixel、TikTok Pixel                                           |
| SaaS サービス                | Sentry、Mixpanel、Intercom、Crisp、HubSpot                                         |
| AI / 大規模モデル            | Open WebUI、Dify、Flowise、Gradio、ComfyUI                                         |
| モニタリング / プローブ      | New Relic、Datadog、Pingdom、Hotjar                                                |
| RSS / 購読                   | RSS、Atom、JSON Feed                                                               |
| WordPress プラグイン         | 4500 件以上の具名プラグイン                                                        |
| Drupal モジュール            | 4000 件以上の具名モジュール                                                        |
| セキュリティとプロトコル     | HTTPS、CSP、Service Worker                                                         |
| その他のライブラリ           | カスタムルールのデフォルト分類・未分類のフォールバック                             |
| ... 全 24 カテゴリー         |                                                                                    |

完全なリストは `src/utils/category-order.ts` の `CATEGORY_ORDER` 配列を参照してください。

## すべて有効 / すべて無効

右上に「すべて有効」「すべて無効」の 2 つのボタンがあり、すべてのカテゴリーを一括でオン / オフにできます。

## カテゴリーを無効にする一般的な用途

- **技術スタックのみ見る（プラグインは見ない）**：「WordPress プラグイン」「Drupal モジュール」を無効にしてリストが長くなりすぎるのを防ぐ
- **バックエンドのみ見る（フロントエンドは見ない）**：フロントエンドフレームワーク / UI フレームワーク / ビルドランタイムを無効にする
- **汎用 SaaS をフィルタリング**：「広告 / マーケティング」「アナリティクス / 分析」を無効にしてコア技術スタックに集中する

## 実装の詳細

無効化されたカテゴリーは生の JSON から削除されません。「生の手がかり」パネルでは完全な検出結果を引き続き確認できます。検出スイッチはポップアップのメインリストの表示にのみ影響します。
