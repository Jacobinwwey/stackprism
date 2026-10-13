---
layout: home

hero:
  name: StackPrism
  text: ウェブ技術クルー検索ビューアー
  tagline: 拡張機能のポップアップを開いて、現在のページが公開しているフレームワーク、CDN、CMS、アナリティクス、ログイン、決済、SaaS の手がかりを確認できます。各結果には証拠とソースが付いており、信頼性を判断するのに役立ちます。
  image:
    src: /icon.svg
    alt: StackPrism
  actions:
    - theme: brand
      text: インストールと有効化
      link: /ja/guide/install
    - theme: alt
      text: GitHub で見る
      link: https://github.com/setube/stackprism/blob/main/i18n/README.ja.md

features:
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'/></svg>"
    title: ローカルルールベース
    details: ルールは拡張機能にバンドルされており、ページ URL・リソース・DOM・レスポンスヘッダー・動的リソースはすべてローカルでマッチングします。アカウントや外部 API は不要です。
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z'/></svg>"
    title: キャッシュ優先のポップアップ
    details: バックグラウンドで軽量な結果を先に整理します。ポップアップを開くとキャッシュされた重要な結果を優先表示し、生の JSON と技術リンクはオンデマンドで読み込みます。
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z'/></svg>"
    title: カスタムルール
    details: 設定ページで独自のキーワード・正規表現・CSS セレクター・グローバル変数ルールを追加でき、組み込みルールがカバーしていないサイトに対応できます。
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'/></svg>"
    title: 結果のトレーサビリティ
    details: 技術名・信頼度・証拠・ソースが同じカードにまとまっています。誤検知を調査するときは、対応するソースの生データを直接展開できます。
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12.67 19a2 2 0 0 0 1.416-.586l6.13-6.13a4.992 4.992 0 0 0 .832-2.65V5l-3 1.5L17.97 5h-1.97a4.992 4.992 0 0 0-2.65.832l-6.13 6.13a2 2 0 0 0-.586 1.416v3.288c0 .53.211 1.04.586 1.415l1.456 1.456c.375.375.884.586 1.414.586h3.287Z'/><path d='M16 8 2 22'/><path d='M17.5 15H9'/></svg>"
    title: フィルタリング可能な出力
    details: カテゴリースイッチ・無効リスト・重要ビューでノイズを減らせます。完全なデータは生の手がかりに保持されており、後で確認できます。
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m18 16 4-4-4-4'/><path d='m6 8-4 4 4 4'/><path d='m14.5 4-5 16'/></svg>"
    title: 監査可能なルール
    details: 組み込みルールは JSON ファイルでカテゴリー別に管理されています。新しい検出を追加するには通常、ルール 1 件と再現可能な証拠を数件追加するだけです。
---

## これは何ですか

StackPrism は Chromium MV3 拡張機能です。サーバーの内部を「見透かす」のではなく、ブラウザーが見ることのできる手がかりを整理します。具体的には、スクリプト・スタイルシートのリソース、DOM マーカー、グローバル変数、レスポンスヘッダー、動的に読み込まれたリソース、WordPress テーマのスタイルシートなどです。

各結果には**信頼度**・**証拠**・**ソース**が付いています。ある結果がおかしいと思ったら、まず証拠を確認し、次にソースをクリックして対応する生の JSON を展開してください。

## どこから始めるか

- 初めてインストールする場合：[インストールと有効化](/ja/guide/install.md) を参照
- 結果の見方がわからない場合：[結果の解読](/ja/guide/results.md) を参照
- ノイズを減らしたい・ルールを追加したい場合：[設定ガイド](/ja/config/) を参照
- 組み込みルールを変更したい場合：[ルールファイル形式](/ja/dev/rule-format.md) と [ルールの貢献](/ja/dev/contribute-rules.md) を参照

## 精度の限界

検出結果は監査レポートではありません。サイトがレスポンスヘッダーを隠し、リソース名をすべてハッシュ化し、SSR 後にフレームワークの痕跡を削除している場合、拡張機能が返す結果は非常に少ないか、まったくない可能性があります。

このプロジェクトのトレードオフは、判断の根拠をできる限り公開し、ユーザーが「なぜこのように検出されたか」を理解できるようにすることです。ルールは継続的に補完されますが、低品質な推測を確定的な結論として提示することはしません。
