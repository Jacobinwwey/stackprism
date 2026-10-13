# 開発ハンドブック

このセクションは、ソースコードを読んだり、ルールを変更したり、PR を提出しようとしている人向けに書かれています。拡張機能をインストールするだけであれば、[使用ガイド](/ja/guide/) で十分です。

## 章構成

- [アーキテクチャ概要](./architecture.md) — プロジェクトのディレクトリ構造・各モジュールの役割・データフロー
- [ルールファイル形式](./rule-format.md) — `public/rules/` 以下の JSON の構成・ネストされたグループ + defaults の継承
- [検出フロー](./detection-flow.md) — webRequest / ページへの注入からポップアップのレンダリングまでの各ステップ
- [ルールの貢献](./contribute-rules.md) — 組み込みルールセットに新しい技術を追加する方法
- [ビルドとリリース](./release.md) — ローカルビルド・パッケージング・crx への署名・リリースワークフロー

## 技術スタックの概要

プロジェクトのメインは Vite 5 + Vue 3 + TypeScript + `@crxjs/vite-plugin` 2.x です。バックグラウンドスクリプトは Manifest V3 の ESM サービスワーカーで、パッケージマネージャーは pnpm を使用しています。

ルールは `public/rules/` 以下に配置され、ページルール・レスポンスヘッダールール・WordPress / Drupal エコシステムなどの方向別に複数の JSON ファイルに分割されています。ビルド時にルールが前処理され、マッチング高速化のための `__hints` / `__legacyHints` / `__keywordCombined` フィールドが注入されます。

## 開発でよく使うコマンド

```bash
pnpm install            # 依存関係のインストール
pnpm run dev            # Vite dev サーバーを起動、拡張機能のホットリロード
pnpm run build          # dist/ にビルド、Chrome に読み込み可能
pnpm run typecheck      # vue-tsc による厳密な型チェック
pnpm run lint           # ESLint チェック
pnpm run docs:dev       # このドキュメントサイトのローカルプレビューを起動
pnpm run docs:build     # ドキュメントの静的サイトをビルド
```

dev モードでは拡張機能ページのホットアップデートに対応しています。popup / settings / help の変更は通常自動で更新されます。`src/background/` やコンテンツスクリプトを変更した後は、`chrome://extensions/` で拡張機能カードを手動で更新する必要があります。

## Vue のエントリーポイント

3 つの独立した SPA エントリーポイントがあり、それぞれ独立してビルドされます：

| エントリーポイント | ファイル | 説明 |
| --- | --- | --- |
| popup | `src/ui/popup/index.html` | ブラウザー右上の拡張機能アイコンをクリックして表示される 440px × 600px のウィンドウ |
| settings | `src/ui/settings/index.html` | `chrome://extensions/` の詳細ページから開く options page |
| help | `src/ui/help/index.html` | 設定ページの「使い方説明」をクリックして開く独立したタブ |

## 関連リンク

- [GitHub リポジトリ](https://github.com/setube/stackprism)
- [Issue リスト](https://github.com/setube/stackprism/issues)
- [Release リスト](https://github.com/setube/stackprism/releases)
