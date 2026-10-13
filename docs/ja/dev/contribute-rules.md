# ルールの貢献

## 方法

貢献は 2 種類に分かれます：

1. **クイックフィードバック**：ポップアップの対応する技術カードで「検出が不正確な場合はここをクリックして修正」ボタンをクリックすると、GitHub Issue が自動的に開き、コンテキスト（ページ URL・現在のルールマッチ結果・拡張機能のバージョン）が入力されます。メンテナーが確認してルールを調整します。
2. **直接 PR**：リポジトリをフォークして `public/rules/` 内の対応する JSON を編集し、ローカルで検証してから PR を提出します。

以下では主に直接 PR のフローについて説明します。

## 適切なファイルを見つける

`public/rules/` は役割別にファイルが分割されています：

| ファイル                           | 収録内容                                                              |
| ---------------------------------- | --------------------------------------------------------------------- |
| `page/frontend-frameworks.json`    | React / Vue / Angular / 各種フロントエンドフレームワーク              |
| `page/ui-frameworks.json`          | Tailwind / Bootstrap / Element / Antd などの UI ライブラリ            |
| `page/build-runtime.json`          | Webpack / Vite / Rollup / Bun などのビルドツール                      |
| `page/frontend-cdn-libraries.json` | CDN 経由の具名フロントエンドライブラリ（jQuery・lodash・moment など） |
| `page/wordpress-plugins.json`      | 4500 件以上の WordPress プラグイン                                    |
| `page/drupal-modules.json`         | 4000 件以上の Drupal モジュール                                       |
| `page/cms-themes.json`             | CMS テーマ                                                            |
| `page/website-programs.json`       | WordPress / Drupal / Discuz! などの CMS 本体                          |
| `page/payment-systems.json`        | 決済プラットフォーム                                                  |
| `page/third-party-logins.json`     | サードパーティログイン                                                |
| `page/saas-services.json`          | SaaS（Sentry / Mixpanel / Intercom など）                             |
| `page/analytics-providers.json`    | アナリティクスと分析                                                  |
| `page/cdn-providers.json`          | CDN プロバイダー（フロントエンドランタイム検出）                      |
| `headers/server-products.json`     | `Server:` ヘッダーで識別されるサーバー製品                            |
| `headers/cdn-providers.json`       | レスポンスヘッダーで識別される CDN                                    |
| `headers/website-programs.json`    | レスポンスヘッダーで識別される CMS                                    |
| ...                                |                                                                       |

完全なリストは `public/rules/index.json` を参照してください。

## 新しいルールを書く最小限の例

ExampleCMS の検出を追加したい場合、`page/website-programs.json` で適切なグループ（例：「セルフホスト型 CMS」グループ）を見つけ、以下を追加します：

```json
{
  "name": "ExampleCMS",
  "url": "https://examplecms.example.com",
  "patterns": ["examplecms-[0-9.]+\\.min\\.js", "/_examplecms/"],
  "globals": ["ExampleCMS"],
  "selectors": ["[data-powered-by='examplecms']"]
}
```

フィールドの意味は [ルールファイル形式](./rule-format.md) を参照してください。

## どのグループに入れるか

対応する JSON ファイルを開くと、ネストされたグループ構造が見えます：

```json
{
  "page": {
    "websitePrograms": {
      "defaults": { "category": "网站程序" },
      "rules": [
        {
          "defaults": { "confidence": "高" },
          "rules": [
            // 一連の高信頼度の具名 CMS
          ]
        },
        {
          "defaults": { "confidence": "中" },
          "rules": [
            // 一連の中信頼度のもの
          ]
        }
      ]
    }
  }
}
```

検出の確実性に対する判断に基づいて、適切な信頼度のサブグループに配置します。グループ内の rules 配列の順序は検出結果に影響しません。デバッグ時の閲覧順序にのみ影響します。

## ルールの検証

変更後：

```bash
bun run build
```

ビルドが `precompileRulesPlugin` を実行してルールに `__hints` などのフィールドを注入します。次に `chrome://extensions/` で `dist/` を読み込み、実際の ExampleCMS サイトで検証します。

または「カスタムルール」パネルでユーザー設定レイヤーに先に書いて、ルールが有効であることを確認してから `public/rules/` に移植することもできます。

## 誤検知を減らす

- **globals を優先する**：`window.X` のマッチが最も安定しており、誤検知はほぼゼロ
- **専用セレクターを優先する**：`[data-powered-by='examplecms']`・`[ng-version]` など、その技術が書き込んだことが明らかな属性
- **resource patterns には完全ドメイン / 完全パスを書く**：`examplecms` より `cdn.examplecms.com/sdk.js` の方が安定
- **classNames / classPrefixes にはプレフィックスを付ける**：`cms-` ではなく `example-cms-` にして他のプロジェクトの `cms-` という命名と衝突しないようにする
- **正規表現にはアンカーを付ける**：`/_examplecms/` より `^/_examplecms/` の方が正確
- **信頼度は保守的に**：確信が持てなければ「中」を使い、ポップアップに黄色いバッジを表示させる — 緑のバッジでユーザーを誤誘導しない

## メインリポジトリへのルール貢献フロー

1. [setube/stackprism](https://github.com/setube/stackprism) をフォーク
2. ローカルにクローンして `bun install`、`bun run build` で正常にビルドできることを確認
3. `public/rules/` の対応するファイルを見つけてルールを追加
4. [Wappalyzer rules](https://github.com/enthec/webappanalyzer)・公式サイト・ドキュメントから証拠を 2〜3 件 PR の説明に記載する
5. main ブランチに PR を提出

PR の説明には少なくとも、追加した技術・検証に使ったページ・これらの特徴が他のサイトに誤って適用されない理由を明記してください。
