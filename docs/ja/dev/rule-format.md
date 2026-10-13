# ルールファイル形式

`public/rules/` 以下の JSON ファイルは検出の方向別に分割されています。`public/rules/index.json` はマニフェストで、ビルド時と実行時に読み込む必要があるルールファイルが列挙されています。

## トップレベル構造

各ルール JSON はおおよそ以下のような形です（抜粋）：

```json
{
  "page": {
    "frontendFrameworks": {
      "defaults": { "category": "前端框架" },
      "rules": [
        {
          "defaults": { "confidence": "高" },
          "rules": [
            {
              "name": "React",
              "patterns": ["react(?:\\.production|\\.development)?(?:\\.min)?\\.js"],
              "globals": ["React"]
            },
            {
              "name": "Vue",
              "patterns": ["vue(?:\\.runtime)?(?:\\.global)?(?:\\.prod)?(?:\\.min)?\\.js"],
              "globals": ["Vue"],
              "selectors": ["[data-v-app]"]
            }
          ]
        }
      ]
    }
  }
}
```

- トップレベルのキー（例：`page` / `headers`）はバックグラウンドの各検出モジュールが名前で取得する
- 2 番目のキー（例：`frontendFrameworks` / `cdnProviders`）も名前で読み取られる
- 中にある `{ defaults, rules }` 形式のオブジェクトは**ルールグループ**（rule group）を表す
- グループはネストでき、最も内側が「リーフルール」（leaf rule、`rules` フィールドを持たない）

## ルールグループの defaults 継承

`defaults`（`$defaults` と記述しても同義）はそのグループのすべてのリーフルールに引き継がれます。複数レイヤーのネストでは外側が内側に上書きされます。最終的な展開時、各リーフルールは `{ ...outerDefaults, ...innerDefaults, ...leafFields }` のマージ結果を受け取ります。

例：

```json
{
  "defaults": { "category": "前端框架" },
  "rules": [
    {
      "defaults": { "confidence": "高" },
      "rules": [{ "name": "React", "patterns": ["react.js"] }]
    }
  ]
}
```

展開後、React ルールは以下と等価になります：

```json
{
  "category": "前端框架",
  "confidence": "高",
  "name": "React",
  "patterns": ["react.js"]
}
```

## リーフルールのフィールド

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `name` | string | ポップアップの表示名 |
| `category` | string | カテゴリー。`CATEGORY_ORDER` でソートされる |
| `kind` | string | 種類の説明。空白可。evidence のプレフィックスとして表示 |
| `confidence` | `"高"` / `"中"` / `"低"` | デフォルトは `"中"` |
| `matchType` | `"keyword"` / `"regex"` | デフォルトは `"regex"`（直接 `new RegExp(p, 'i')` に渡す） |
| `patterns` | string[] | マッチルール。keyword タイプは `escapeRegExp + RegExp` を使用 |
| `selectors` | string[] | CSS セレクター。マッチすると高信頼度 |
| `globals` | string[] | グローバル変数名（ドット区切りのネストに対応）。マッチすると高信頼度 |
| `classNames` | string[] | DOM 上の特定クラスにマッチすると高信頼度（完全一致） |
| `classPrefixes` | string[] | DOM 上のクラスがこのプレフィックスで始まる場合、高信頼度 |
| `cssVariables` | string[] | ページの CSS カスタムプロパティが N 件以上マッチすると発火。`minCssVariableMatches` と組み合わせる |
| `minCssVariableMatches` | number | デフォルトは 1 |
| `matchIn` | string[] | patterns をマッチングするデータソースを制限。`url` / `resources` / `html` / `headers` / `dynamic` の任意の組み合わせ。空配列 / 未指定はすべてを意味する |
| `resourceOnly` | boolean | リソース URL マッチングのみ実行し、DOM / globals / selectors をスキップ |
| `resourceHints` | string[] | ビジネス側で手動指定する事前フィルタリング指紋。マッチするテキストにヒントが含まれる場合のみ patterns の完全マッチを実行 |
| `evidence` | string | マッチ時の固定 evidence テキスト。デフォルトの「リソース URL マッチ / DOM マッチ」を上書き |
| `url` | string | 技術の公式サイトまたはリポジトリ URL |

## 自動注入フィールド（ビルド時）

ビルド段階の `vite.config.ts` の `precompileRulesPlugin` が各リーフルールに注入します：

| フィールド | 由来 |
| --- | --- |
| `__hints` | 正規表現の必須リテラルセット（`src/utils/rule-hints.ts`）：パターンにマッチできるテキストには必ずその中の 1 つが含まれる。マッチしえないルールをスキップするためだけに使用し、結果を変えない |
| `__legacyHints` | 1.3.79 以前の事前フィルタリング閾値（最長の 3 つのリテラルセグメント）。`__hints` より厳しく、かつ `resourceHints` を持たないルールにのみ書き込み、検出結果が変わらないことを保証 |
| `__keywordCombined` | matchType が keyword の場合、すべての patterns を escape 後に `\|` で連結したマージ正規表現ソースコード |

ルールファイルに手書きされた `__hints` はそのルールの旧閾値として扱われます。実行時の `getRuleAutoHints(rule)` と `getCompiledCombinedPattern(rule)` はこれらのフィールドを優先して読み取り、欠落している場合のみ実行時計算にフォールバックします（カスタムルールは必須リテラルのみを計算し、旧閾値はない）。

## ルールファイルのマニフェスト

`rules/index.json`：

```json
{
  "schemaVersion": 1,
  "files": [
    "page/feeds.json",
    "page/frontend-frameworks.json",
    "page/ui-frameworks.json",
    "page/build-runtime.json",
    "page/frontend-extra.json",
    "page/frontend-local-libraries.json",
    "page/frontend-cdn-libraries.json",
    "page/frontend-package-cdn-libraries.json",
    "page/frontend-regional-cdn-libraries.json",
    "page/wordpress-themes.json",
    "page/drupal-themes.json",
    "page/wordpress-plugins.json",
    "page/drupal-modules.json",
    "...",
    "headers/server-products.json",
    "headers/header-patterns.json",
    "headers/cdn-providers.json"
  ]
}
```

`page/*.json` はページ検出パス（page-detector + dynamic-snapshot が使用）に、`headers/*.json` はレスポンスヘッダー検出パス（headers.ts が使用）に対応します。2 つのパスは独立していますが、リーフルールのフィールド形式はまったく同じです。

## 読み込みフロー

`src/background/rule-loader.ts`：

1. `rules/index.json` を fetch
2. `files[]` 内のすべての JSON を並行 fetch
3. 各 JSON を `normalizeRuleValue` で再帰的にグループを展開
4. `mergeRulePartial` で各 JSON のすべてのキーを 1 つの大きなオブジェクトにマージ
5. `RuleConfig` を返し、各 detection モジュールがキーで配列を取得

## どこを変更するか

- 特定の技術の検出ルールを変更する：対応するカテゴリーの JSON ファイルを直接編集する
- 新しいカテゴリーを追加する：`rules/index.json` にファイルを追加し、バックグラウンドの対応モジュールがキーで読み取るようにする（`detector-settings.ts` の `loadTechRules`）
- 大量の変更：スクリプトで JSON を生成して元のファイルを上書きする
