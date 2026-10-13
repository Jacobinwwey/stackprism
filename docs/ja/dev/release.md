# ビルドとリリース

## ローカルビルド

```bash
pnpm install
pnpm run build
```

ビルドチェーン：

1. `pnpm run build:injected`（`build-scripts/build-injected.mjs`）：esbuild が `src/injected/page-detector.ts` と `page-source-search.ts` をそれぞれ独立した IIFE ファイルにコンパイルし、`public/injected/` に出力
2. `vite build`（`@crxjs/vite-plugin`）：background / popup / settings / help の 4 つのエントリーポイントをバンドルし、`dist/` に出力
3. `precompileRulesPlugin`（vite plugin の closeBundle フック）：`dist/rules/*.json` をスキャンし、各 leaf rule に `__hints` / `__legacyHints` / `__keywordCombined` を注入
4. `minifyJsonAssets`（vite plugin の closeBundle フック）：すべての JSON を `JSON.stringify(parsed)` で書き直してインデントと改行を削除

最終的な `dist/` は `chrome://extensions/` のデベロッパーモードで直接読み込めます。

## 開発ホットリロード

```bash
pnpm run dev
```

Vite dev サーバー + crxjs HMR：`src/ui/**` の popup / settings / help を変更すると自動でホットリプレースされます。`src/background/**` のバックグラウンドコードや `src/content/**` のコンテンツスクリプトを変更した後は、`chrome://extensions/` で拡張機能カードの更新ボタンをクリックして再読み込みが必要です。

## 型チェックと lint

```bash
pnpm run typecheck    # vue-tsc --noEmit、プロジェクト全体の厳密な型チェック
pnpm run lint         # eslint src
```

コミット前に全体のフォーマットを統一：

```bash
npx prettier --write .
```

## バージョン番号の管理

`package.json` の `version` フィールドが真のソースです。`@crxjs/vite-plugin` がそれを自動的に `dist/manifest.json` に同期します。

通常の機能・ルール・修正の変更はパッチを増分します。パッチが `99` に達したら次の minor に進み、`1.1.100` のようなバージョン番号は使用しません：

```bash
# 1.1.98 -> 1.1.99
# 1.1.99 -> 1.2.0
```

インストールパッケージを公開する必要があるバージョンのみ GitHub Release を作成します：`x.y.0`・`x.y.10`・`x.y.20`・...・`x.y.90`。例えば `1.2.0`・`1.2.10` は公開し、`1.2.5`・`1.2.15` は公開しません。

```bash
# package.json のバージョンを変更した後
git add package.json
git commit -m "chore: bump 1.2.10"
git push origin main
```

## GitHub Release ワークフロー

`.github/workflows/release-extension.yml` は 2 つのケースでトリガーされます：

1. GitHub UI で release を公開する（`release: published` イベント）
2. Actions ページでワークフローを手動実行する（オプションで release_tag の input を渡せる）

ワークフローが行うこと：

1. checkout + pnpm + Node 20 のインストール
2. `pnpm install --frozen-lockfile`
3. `pnpm run build`
4. `dist/manifest.json` から version を読み取り、release タグと一致することを確認
5. `dist/` 全体を `stackprism-v{ver}.zip` + sha256 に圧縮
6. **secret `EXTENSION_PRIVATE_KEY` が設定されている場合**、`npx crx3` で `stackprism-v{ver}.crx` + sha256 を署名して生成。設定されていない場合は crx をスキップして zip のみ
7. `gh release upload --clobber` ですべての成果物を release タグにアップロード
8. `actions/upload-artifact` でアーティファクトとして同時にバックアップ

## リリースノート

リリースノートは前の release タグから現在のコミットまでの `git log --oneline vPREV..HEAD` を整理して作成します。コミットリストをそのまま貼り付けません。ユーザーが理解できる方向で分類して記述します。例：

- ルールの強化
- ポップアップと設定ページ
- ドキュメントサイト
- ビルドとリリースフロー

リリースノートにはユーザーまたはメンテナーが関心を持つ変更のみを記述し、ローカルで実行したフォーマット・型チェック・lint・ビルドコマンドは記述しません。

## CRX 署名キー

初回リリース前に RSA 秘密鍵を生成し、GitHub リポジトリの secrets に設定する必要があります。

### 秘密鍵の生成

```bash
openssl genrsa -out extension.pem 2048
```

::: warning
`extension.pem` は**絶対に紛失してはいけません** — 紛失して再生成すると拡張機能の ID が変わります（Chrome が別の拡張機能として扱います）。ローカルにバックアップを保存してください。
:::

### GitHub への設定

1. リポジトリの Settings → Secrets and variables → Actions → New repository secret
2. Name: `EXTENSION_PRIVATE_KEY`
3. Secret: `extension.pem` ファイルの**内容全体**（`-----BEGIN PRIVATE KEY-----` と `-----END PRIVATE KEY-----` を含む）を貼り付ける
4. 保存

以降のワークフローはこのキーを使って crx に自動署名します。

### 設定しない場合

ワークフローは引き続き実行できますが、成果物に `.crx` ファイルが含まれません。ユーザーは zip を解凍して読み込む方法のみ使用できます。

## リリースチェックリスト

- [ ] `npx prettier --write .` を実行済み
- [ ] `pnpm run typecheck` が通過
- [ ] `pnpm run lint` が通過
- [ ] `pnpm run build` が通過
- [ ] Chrome で `dist/` を読み込んで主要なパスを手動テスト（ポップアップを開く・サイトを検出・更新・完全な技術スタックレポートのコピー・設定ページでルールを追加）
- [ ] `package.json` の version を bump
- [ ] git commit + push
- [ ] バージョンが release ノードに該当する場合、GitHub UI で release を公開（タグは `v{version}`、package.json と一致させる）
- [ ] リリースワークフローが完了するのを待ち、release の assets に zip / crx と sha256 があることを確認

## Chrome Web Store への公開

ワークフローは Chrome Web Store への自動公開は行いません。CWS の publish API は OAuth2 フローが必要なため、現在は手動操作です：

1. `dist/` フォルダーを zip に圧縮する（ワークフローの zip 成果物と同じ）
2. [Chrome Web Store デベロッパーダッシュボード](https://chrome.google.com/webstore/devconsole) → 新しいバージョンをアップロード
3. 変更内容を記入し、審査を待つ（通常 1〜3 営業日）
