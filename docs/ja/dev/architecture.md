# アーキテクチャ概要

## ディレクトリ構造

```text
stackprism/
├─ src/
│  ├─ manifest.config.ts        # @crxjs/vite-plugin 用の MV3 manifest 定義
│  ├─ background/                # サービスワーカー（ESM module worker）
│  │  ├─ index.ts                # 各 chrome イベントリスナーの登録
│  │  ├─ message-router.ts       # onMessage ルーター（8 種類のメッセージ）
│  │  ├─ tab-store.ts            # タブ / ポップアップのキャッシュ読み書き
│  │  ├─ headers.ts              # webRequest レスポンスヘッダー収集
│  │  ├─ detection.ts            # アクティブ検出 / scheduleActivePageDetection
│  │  ├─ popup-cache.ts          # ポップアップの raw / display データ構築
│  │  ├─ wordpress.ts            # WordPress テーマ style.css の取得
│  │  ├─ dynamic-snapshot.ts     # 動的スナップショットのデバウンス処理
│  │  ├─ tech-links.ts           # tech-links.json の遅延読み込み
│  │  ├─ rule-loader.ts          # ルール JSON の読み込みとマージ
│  │  ├─ rule-matcher.ts         # コンパイルキャッシュ + ヒントインデックスによる事前フィルタリング
│  │  ├─ detector-settings.ts    # 設定 / ルールキャッシュ
│  │  ├─ content-injector.ts     # 起動時に既に開いているタブにコンテンツスクリプトを注入
│  │  └─ merge.ts                # 技術リストのマージ / 重複排除 / suppress ルール
│  ├─ content/
│  │  └─ content-observer.ts     # MutationObserver による継続的な動的収集
│  ├─ injected/                   # 独立した IIFE にコンパイルされ、ページの MAIN world に注入
│  │  ├─ page-detector.ts         # 990 行の検出メイン関数
│  │  └─ page-source-search.ts    # ポップアップのソースコード検索
│  ├─ ui/
│  │  ├─ popup/                   # ポップアップ SPA
│  │  ├─ settings/                # 設定ページ SPA
│  │  ├─ help/                    # 使い方説明ページ SPA
│  │  ├─ components/Select.vue    # カスタム Select / Combobox コンポーネント
│  │  └─ tokens.css               # グローバル CSS 変数 + ライト / ダークテーマ + スクロールバー / チェックボックスのスタイル
│  ├─ types/                      # スクリプト間で共有される型
│  │  ├─ messages.ts              # 8 種類のメッセージの discriminated union
│  │  ├─ rules.ts                 # RuleConfig / TechnologyRecord / PageDetectionResult
│  │  ├─ settings.ts              # DetectorSettings + CUSTOM_RULE_LIMITS
│  │  └─ popup.ts                 # PopupResult / PopupRawResult
│  └─ utils/                      # 3 箇所で共有されるヘルパー
│     ├─ normalize-settings.ts
│     ├─ category-order.ts
│     ├─ apply-custom-css.ts
│     ├─ build-issue-url.ts
│     ├─ tech-name.ts
│     ├─ url.ts
│     ├─ messaging.ts
│     ├─ theme.ts
│     └─ constants.ts
├─ public/
│  ├─ icons/                      # 16/32/48/128 PNG
│  ├─ rules/                      # ルール JSON ファイル
│  ├─ tech-links.json             # 524 KB の技術名 → 公式サイトリンクのマッピング
│  └─ injected/                   # build:injected が出力する 2 つの IIFE
├─ build-scripts/
│  └─ build-injected.mjs          # esbuild で注入スクリプトを個別コンパイル
├─ vite.config.ts                 # メインビルド（CRXJS + Vue + TS）+ カスタムプラグイン
├─ vite.injected.config.ts        # 注入スクリプト独立 IIFE ビルド
├─ docs/                          # このドキュメントサイト（VitePress）
└─ dist/                          # ビルド成果物、Chrome に読み込み可能
```

## プロセスモデル

Chrome 拡張機能には 4 種類の実行環境があり、StackPrism はすべてを使用しています：

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. Service Worker (ESM module)                              │
│    src/background/*.ts                                       │
│    - chrome.webRequest でレスポンスヘッダーを監視           │
│    - chrome.runtime.onMessage のルーティング                │
│    - chrome.storage.session に検出結果をキャッシュ          │
│    - rules/* と tech-links.json を読み込む                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 2. Content Script (ページの isolated world)                 │
│    src/content/content-observer.ts                          │
│    - MutationObserver で DOM の変更を継続的に収集           │
│    - PerformanceObserver でリソースの読み込みを収集         │
│    - 800ms スロットリング後に sendMessage でバックグラウンドに送信 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 3. Injected Script (ページの MAIN world)                    │
│    dist/injected/page-detector.iife.js                      │
│    dist/injected/page-source-search.iife.js                 │
│    - chrome.scripting.executeScript({files}) でオンデマンド注入 │
│    - window.* / 実際の DOM / globalKeys にアクセス可能      │
│    - 実行完了後に結果を返す（常駐しない）                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 4. Extension UI (popup / settings / help)                   │
│    src/ui/{popup,settings,help}/*.vue                        │
│    - Vue 3 + TS SPA                                         │
│    - chrome.runtime.sendMessage でバックグラウンドと通信    │
│    - chrome.storage.sync でユーザー設定を読み書き           │
└─────────────────────────────────────────────────────────────┘
```

## スクリプト間のメッセージ

8 種類のメッセージはすべて `src/types/messages.ts` で discriminated union として型定義されており、すべての呼び出しは `src/utils/messaging.ts` の `sendMessage<M>()` ラッパーを経由します。

| メッセージ | 方向 | 用途 |
| --- | --- | --- |
| `GET_HEADER_DATA` | popup → bg | レスポンスヘッダー記録を取得 |
| `GET_POPUP_RESULT` | popup → bg | 軽量キャッシュを取得（ポップアップのメイン表示） |
| `GET_POPUP_RAW_RESULT` | popup → bg | 完全な raw データを取得（生の手がかり / 誤検知フィードバック） |
| `GET_TECH_LINK` | popup → bg | 特定の技術の公式サイトリンクをフォールバック取得 |
| `START_BACKGROUND_DETECTION` | popup → bg | 「更新」ボタンによるアクティブ検出のトリガー |
| `GET_WORDPRESS_THEME_DETAILS` | bg internal | テーマの style.css ヘッダーの取得 |
| `DYNAMIC_PAGE_SNAPSHOT` | content → bg | コンテンツスクリプトによる動的スナップショットの継続レポート |
| `PAGE_DETECTION_RESULT` | injected → bg | page-detector 注入完了後の結果返却 |

## 注入スクリプトのデュアルトラック問題

`page-detector.ts` はネイティブ実装ではバックグラウンドの `importScripts` からインポートされると同時に、`executeScript({world:'MAIN', func})` でシリアライズして注入されます。ESM に移行すると `Function.prototype.toString` が import を処理できないため、この方法は使えません。

解決策：`executeScript({func})` の代わりに `executeScript({files})` を使用します。`page-detector.ts` は独立した IIFE 単一ファイル（`vite.injected.config.ts`）としてコンパイルされ、2 回の RPC で注入されます：

```ts
// 1. 一時的なグローバル変数に書き込む
chrome.scripting.executeScript({
  target: { tabId },
  world: 'MAIN',
  func: rules => {
    window.__SP_RULES__ = rules
  },
  args: [pageRules]
})

// 2. IIFE を注入。IIFE 内部で __SP_RULES__ を読み取ってクリアし、結果を return
chrome.scripting.executeScript({
  target: { tabId },
  world: 'MAIN',
  files: ['injected/page-detector.iife.js']
})
```

この処理により、バックグラウンドが page-detector に直接依存しなくなり、サービスワーカーも ESM module worker を使用できます。

## 静的リソース

`public/rules/` と `public/tech-links.json` は Vite によって `dist/` に 1:1 でコピーされ、実行時に `chrome.runtime.getURL` + `fetch` で読み込まれます。これらの大きな JSON を `import rules from '...'` で直接インポートしないでください。Rollup がルールをバンドルにインライン化し、サービスワーカーのコールドスタートが著しく遅くなります。

ビルド時にはこれらの JSON を処理する 2 つの Vite プラグインがあります：

1. `precompileRulesPlugin`：各ルール JSON を再帰的に走査し、各 leaf rule に `__hints`（正規表現の必須リテラル）・`__legacyHints`（旧バージョンの事前フィルタリング閾値、必要なルールのみ）・`__keywordCombined`（keyword タイプのルールのマージ正規表現ソースコード）を注入する
2. `minifyJsonAssets`：すべての JSON を `JSON.stringify(parsed)` で書き直してインデント / 空白を削除する

## 状態管理

Pinia は使用していません。理由：

- popup の state は 6 フィールド
- settings の state は 2 フィールド
- popup / settings は 2 つの独立した拡張機能ページ（独立した chrome.runtime context）であり、Pinia の場合は 2 回インスタンス化が必要になる
- 共有の `DetectorSettings` は `chrome.storage.sync` を真のソースとし、`reactive()` のローカルコピーで十分

## テーマ（ライト / ダーク）

`src/utils/theme.ts` が `getStoredTheme / setStoredTheme / cycleTheme / themeLabel` を管理し、`chrome.storage.sync.stackPrismTheme` に保存します。3 状態：`auto` / `light` / `dark`。

`src/ui/tokens.css` は `:root[data-theme='dark']` でダークモードを強制し、`@media (prefers-color-scheme: dark) :root:not([data-theme='light'])` でシステムに追従し、`color-scheme` でブラウザーのデフォルト UI を同期します。

テーマ切り替えは popup と settings の両方の上部にボタンがあり、`chrome.storage.onChanged` でページ間同期されます。
