# 検出フロー

## 3 つのデータソースパイプライン

StackPrism は 3 つのパイプラインを並行して実行し、結果をマージします：

```text
┌──────────────────────────────────────────────────────────┐
│ パイプライン A：レスポンスヘッダー (chrome.webRequest)    │
│   - background webRequest.onHeadersReceived              │
│   - メインドキュメント / API / iframe の server /        │
│     x-powered-by など                                   │
│   - chrome.storage.session の tab:{id}.main /            │
│     tab:{id}.apis[] / tab:{id}.frames[] に書き込む       │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ パイプライン B：ページアクティブ検出                      │
│     (chrome.scripting + injected)                        │
│   - ユーザーがポップアップの更新ボタンをクリックすると   │
│     START_BACKGROUND_DETECTION が発火                    │
│   - bg が scripting.executeScript を呼び出して           │
│     page-detector を注入                                 │
│   - page-detector がページの MAIN world で実行されて     │
│     結果を返す                                           │
│   - 結果を tab:{id}.page に書き込む                      │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ パイプライン C：動的収集                                  │
│     (content script + MutationObserver)                  │
│   - bg がページ load 時に content-observer.ts を注入     │
│   - MutationObserver / PerformanceObserver が継続的に    │
│     累積                                                 │
│   - 800ms スロットリング後に DYNAMIC_PAGE_SNAPSHOT を     │
│     sendMessage                                          │
│   - bg が 800ms デバウンス後に                           │
│     detectFromDynamicSnapshot を実行                     │
│   - 結果を tab:{id}.dynamic に書き込む                   │
└──────────────────────────────────────────────────────────┘
```

3 つのタブキーはすべて `chrome.storage.session` に保存されます。サービスワーカーが再起動した場合もストレージから状態を復元でき、SW のメモリには依存しません。

## データフロー：トリガーからポップアップ表示まで

```text
ユーザーが拡張機能アイコンをクリック
  ↓
ポップアップのマウント
  ↓
loadCachedDetection()
  ↓
chrome.runtime.sendMessage({ type: 'GET_POPUP_RESULT', tabId })
  ↓
bg.message-router が getPopupResultResponse(tabId) にルーティング
  ↓
chrome.storage.session に popup:{tabId} のキャッシュがあるか確認
  ├─ ヒット且つ settingsKey が一致 → そのまま返す
  └─ 未ヒット → buildPopupCacheRecord をその場で実行：
       1. tab:{id} から page / main / apis / frames / dynamic を読み取る
       2. addStoredCustomHeaderRules（ユーザーのカスタムレスポンスヘッダールールを適用）
       3. buildDisplayTechnologies：
          - 5 つのソースの結果を 1 つの配列にマージ
          - mergeDisplayTechnologyRecords で重複排除 + sources Set の収集
          - filterTechnologiesBySettings（設定ページのフィルターを適用）
       4. mergeResourceSummary（リソース統計をマージ）
       5. cleanPopupTechnology + ソート出力
       6. popup:{tabId} キャッシュに書き込む
  ↓
bg が PopupResult を返す
  ↓
ポップアップが setState.result を更新して表示

注意：その後もバックグラウンドは webRequest のレスポンスヘッダーや
動的スナップショットなどの増分更新を受け続け、
更新のたびに popup:{tabId} キャッシュを再構築する
  ↓
chrome.storage.onChanged がポップアップ側の onStorageChange を発火
  ↓
popupCacheSignature の複数フィールドの署名を比較し、
真の変化があった場合のみ state.result を置き換える
```

## アクティブ検出のタイミング

ポップアップで「更新」をクリックすると `START_BACKGROUND_DETECTION` メッセージが発火されます：

```ts
// background/detection.ts
const runActivePageDetection = async tabId => {
  const pageRules = await buildEffectivePageRules()

  // 1. ルールをページの一時的なグローバル変数に書き込む
  await chrome.scripting.executeScript({
    target: { tabId },
    world: 'MAIN',
    func: rules => {
      window.__SP_RULES__ = rules
    },
    args: [pageRules]
  })

  // 2. IIFE を注入。IIFE 内部で結果を return
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    world: 'MAIN',
    files: ['injected/page-detector.iife.js']
  })

  // 3. tab:{id}.page に保存し、saveTabDataAndBadge がポップアップキャッシュを再構築
  data.page = cleanPageDetectionRecord(result)
  await saveTabDataAndBadge(tabId, data)
}
```

## 動的収集のスロットリング

content-observer 側：

- MutationObserver / PerformanceObserver が発火するたびに変化を state に累積
- `scheduleSend()` が 900ms のタイマーをセット。タイマーが切れたら `DYNAMIC_PAGE_SNAPSHOT` を送信
- その間に追加の変化があれば累積を続け、タイマーをリセット — 最大 900ms に 1 回しか送信しない

background 側の `dynamic-snapshot.ts`：

- メッセージを受信後 800ms デバウンス
- デバウンス後に `detectFromDynamicSnapshot(snapshot, pageRules)` を実行
- `tab:{id}.dynamic` に書き込み、`saveTabDataAndBadge` を実行

## ルールマッチングレイヤー（rule-matcher.ts）

各ルールは 3 つの段階で使用されます：

```text
detectFromXxx(snapshot, rules)
  scanner.scan(lowerText)                       ─ すべてのルールのヒントでインデックスを構築、テキストは 1 回だけスキャン
  for (const rule of rules):
    1. passesResourceHintLookup(rule, lookup)   ─ ビジネス側の resourceHints 閾値
    2. passesHintLookup(rule, lookup)           ─ 必須リテラルの事前フィルタリング（マッチしえないルールをスキップ）
       passesLegacyHintLookup(rule, lookup)     ─ 旧バージョンの閾値（__legacyHints、結果が変わらないことを保証）
    3. matchesCompiledRulePatterns(rule, text)  ─ 実際の正規表現 / キーワードマージ正規表現を実行
       ├─ keyword は getCompiledCombinedPattern：キャッシュされたマージ正規表現で 1 回マッチ
       └─ regex は getCompiledRulePatterns.some：キャッシュされた RegExp[] を順に test
    4. ヒット：add(category, name, confidence, evidence)
```

WeakMap キャッシュにより、各ルールの正規表現 + ヒントのコンパイルは 1 回だけ実行されます。ヒントインデックスはルールリスト単位でキャッシュされ、ルールが変わらない限り再利用されます。

## バッジの数字

`saveTabDataAndBadge` がポップアップキャッシュを書き込むたびに `popupResult.counts.high`（高信頼度技術の数）を取得し、`chrome.action.setBadgeText` を呼び出して拡張機能アイコンに表示します。ポップアップを開いて見える数字 ≈ バッジの数字です。

## 設定変更によるキャッシュの無効化

`buildSettingsCacheKey(settings)` は settings の主要フィールド（disabledCategories / disabledTechnologies / customRules）を 1 つの文字列にシリアライズします。`getCachedPopupResult(popup, settings)` のキャッシュヒット条件の 1 つは `popup.settingsKey === buildSettingsCacheKey(settings)` です。

設定が変わると settingsKey が変わり、古いキャッシュが自動的に無効化されます。次の `GET_POPUP_RESULT` でその場で再構築されます。
