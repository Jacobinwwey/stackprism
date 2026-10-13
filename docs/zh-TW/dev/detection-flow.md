# 偵測流程

## 三條資料來源管道

StackPrism 同時跑三條管道並把結果合併：

```text
┌──────────────────────────────────────────────────────────┐
│ 管道 A：回應標頭 (chrome.webRequest)                      │
│   - background webRequest.onHeadersReceived              │
│   - 主文件 / API / iframe 的 server / x-powered-by 等    │
│   - 寫入 chrome.storage.session 的 tab:{id}.main /       │
│     tab:{id}.apis[] / tab:{id}.frames[]                  │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ 管道 B：頁面主動偵測 (chrome.scripting + injected)        │
│   - 使用者點彈窗重新整理按鈕觸發 START_BACKGROUND_DETECTION │
│   - bg 呼叫 scripting.executeScript 注入 page-detector   │
│   - page-detector 在頁面 MAIN world 跑完返回結果         │
│   - 結果寫入 tab:{id}.page                              │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ 管道 C：動態採集 (content script + MutationObserver)      │
│   - bg 在頁面 load 時注入 content-observer.ts            │
│   - MutationObserver / PerformanceObserver 持續累積      │
│   - 800ms 節流後 sendMessage DYNAMIC_PAGE_SNAPSHOT       │
│   - bg 防抖 800ms 後跑 detectFromDynamicSnapshot         │
│   - 結果寫入 tab:{id}.dynamic                           │
└──────────────────────────────────────────────────────────┘
```

三個 tab key 都存在 `chrome.storage.session`，service worker 重啟後從 storage 恢復狀態，不依賴 SW 記憶體。

## 資料流：從觸發到彈窗顯示

```text
使用者點擊擴充功能圖示
  ↓
彈窗 mount
  ↓
loadCachedDetection()
  ↓
chrome.runtime.sendMessage({ type: 'GET_POPUP_RESULT', tabId })
  ↓
bg.message-router 路由到 getPopupResultResponse(tabId)
  ↓
檢查 chrome.storage.session 裡是否有 popup:{tabId} 快取
  ├─ 命中且 settingsKey 一致 → 直接返還
  └─ 未命中 → 現場跑 buildPopupCacheRecord:
       1. 從 tab:{id} 讀 page / main / apis / frames / dynamic
       2. addStoredCustomHeaderRules（套用使用者自訂回應標頭規則）
       3. buildDisplayTechnologies：
          - 把 5 路結果合併到一個陣列
          - mergeDisplayTechnologyRecords 去重 + sources Set 收集
          - filterTechnologiesBySettings（按設定頁過濾）
       4. mergeResourceSummary（合併資源統計）
       5. cleanPopupTechnology + 排序輸出
       6. 寫入 popup:{tabId} 快取
  ↓
bg 返回 PopupResult
  ↓
彈窗 setState.result，展示

注意：後續 background 還會持續接收 webRequest 回應標頭、動態快照等增量更新，
每次更新都重新寫 popup:{tabId} 快取
  ↓
chrome.storage.onChanged 觸發 popup 端 onStorageChange
  ↓
比對 popupCacheSignature 多欄位簽名，確認有真實變化才替換 state.result
```

## 主動偵測時機

彈窗裡點「重新整理」會觸發 `START_BACKGROUND_DETECTION` 訊息：

```ts
// background/detection.ts
const runActivePageDetection = async tabId => {
  const pageRules = await buildEffectivePageRules()

  // 1. 把規則寫到頁面暫時全域變數
  await chrome.scripting.executeScript({
    target: { tabId },
    world: 'MAIN',
    func: rules => {
      window.__SP_RULES__ = rules
    },
    args: [pageRules]
  })

  // 2. 注入 IIFE，IIFE 內部 return 結果
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    world: 'MAIN',
    files: ['injected/page-detector.iife.js']
  })

  // 3. 存到 tab:{id}.page，觸發 saveTabDataAndBadge 重建 popup 快取
  data.page = cleanPageDetectionRecord(result)
  await saveTabDataAndBadge(tabId, data)
}
```

## 動態採集節流

content-observer 端：

- 每次 MutationObserver / PerformanceObserver 觸發，把變化累加到 state
- `scheduleSend()` 設置 900ms 定時，定時到了發 `DYNAMIC_PAGE_SNAPSHOT`
- 中途如果還有變化繼續累積，定時器重置——總之每約 900ms 最多發一次

background 端 `dynamic-snapshot.ts`：

- 收到訊息後 800ms 防抖
- 防抖到點跑 `detectFromDynamicSnapshot(snapshot, pageRules)`
- 寫入 `tab:{id}.dynamic`，再走 `saveTabDataAndBadge`

## 規則比對層（rule-matcher.ts）

每條 rule 在三個層面被使用：

```text
detectFromXxx(snapshot, rules)
  scanner.scan(lowerText)                       ─ 所有規則的 hint 建一個索引，文字只掃一遍
  for (const rule of rules):
    1. passesResourceHintLookup(rule, lookup)   ─ 業務側 resourceHints 門檻
    2. passesHintLookup(rule, lookup)           ─ 必需字面量預篩（只跳過不可能命中的規則）
       passesLegacyHintLookup(rule, lookup)     ─ 舊版門檻（__legacyHints，保證結果不變）
    3. matchesCompiledRulePatterns(rule, text)  ─ 跑實際正規表達式 / keyword 合併正規表達式
       ├─ keyword 走 getCompiledCombinedPattern：快取的合併正規表達式一次比對
       └─ regex 走 getCompiledRulePatterns.some：快取的 RegExp[] 逐個 test
    4. 命中：add(category, name, confidence, evidence)
```

WeakMap 快取使每條 rule 的正規表達式 + hints 編譯只跑一次；hint 索引按規則清單快取，規則不變就複用。

## badge 數字

每次 `saveTabDataAndBadge` 寫完 popup 快取後會取 `popupResult.counts.high`（高可信度技術數），呼叫 `chrome.action.setBadgeText` 顯示在擴充功能圖示上。開啟彈窗看到的數字 ≈ badge 數字。

## 設定變更如何讓快取失效

`buildSettingsCacheKey(settings)` 把 settings 關鍵欄位（disabledCategories / disabledTechnologies / customRules）序列化成一個 string。`getCachedPopupResult(popup, settings)` 命中條件之一就是 `popup.settingsKey === buildSettingsCacheKey(settings)`。

設定一變，settingsKey 變，舊快取自動失效，下次 `GET_POPUP_RESULT` 會現場重新建構。
