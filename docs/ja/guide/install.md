# インストールと有効化

StackPrism は Chromium カーネルを使用するブラウザー（Chrome、Edge、Brave、Opera、Vivaldi、Arc など）向けで、Manifest V3 に対応したブラウザーが必要です。

## 方法 1：Release から crx をダウンロード

1. [GitHub Releases](https://github.com/setube/stackprism/releases) を開く
2. 最新バージョンを選択し、`stackprism-v{version}.crx` をダウンロード
3. ブラウザーのアドレスバーに `chrome://extensions/`（Edge の場合は `edge://extensions/`）を入力し、右上の「デベロッパーモード」を有効化
4. ダウンロードした `.crx` ファイルを拡張機能ページにドラッグ＆ドロップ
5. ダイアログが表示されたら「拡張機能を追加」を確認

::: tip
Chrome では .crx ファイルのドラッグ＆ドロップによるインストールがブロックされる場合があります（「このウェブサイトのアプリ、拡張機能、ユーザー スクリプトは追加できません」というメッセージが表示される）。その場合は方法 2 を使用してください。
:::

## 方法 2：Release から zip をダウンロードして解凍して読み込む

1. [GitHub Releases](https://github.com/setube/stackprism/releases) を開き、`stackprism-v{version}.zip` をダウンロード
2. 安定したディレクトリに解凍する（**削除しないこと — 拡張機能はこのディレクトリに依存して動作します**）
3. `chrome://extensions/` を開き、「デベロッパーモード」を有効化
4. 「パッケージ化されていない拡張機能を読み込む」をクリック
5. 解凍したディレクトリを選択

## 方法 3：ソースコードからローカルビルド

開発者または最新の main ブランチを追いたいユーザー向けです。

```bash
git clone https://github.com/setube/stackprism.git
cd stackprism
pnpm install
pnpm run build
```

ビルド成果物は `dist/` に出力されます。`chrome://extensions/` のデベロッパーモードで `dist/` ディレクトリを読み込んでください。

ソースコードを変更した後は `pnpm run build` を再実行し、拡張機能ページの拡張機能カードにある更新ボタンをクリックすれば新しいバージョンが読み込まれます。

## 有効化と権限

初回インストール時に以下の権限が要求されます：

| 権限 | 用途 |
| --- | --- |
| `tabs` | 現在のタブの URL とタイトルを読み取る |
| `activeTab` | 現在アクティブなページに検出スクリプトを注入する |
| `scripting` | page-detector / page-source-search をページのメインワールドに注入する |
| `storage` | 設定・検出結果のキャッシュ・テーマ設定を保存する |
| `webRequest` | レスポンスヘッダーを監視して server / x-powered-by などを収集する |
| `<all_urls>` | すべての http(s) ウェブページで動作する |

検出処理は外部 API に依存しません。ルールファイルは拡張機能にバンドルされており、検出結果はブラウザーのメモリと拡張機能のストレージ内でのみ処理されます。

## アンインストール

`chrome://extensions/` → StackPrism を見つける → 削除。設定とキャッシュも一緒に削除されます。
