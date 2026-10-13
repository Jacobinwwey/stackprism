# 架構概覽

## 目錄結構

```text
stackprism/
├─ src/
│  ├─ manifest.config.ts        # @crxjs/vite-plugin 用的 MV3 manifest 定義
│  ├─ background/                # service worker（ESM module worker）
│  │  ├─ index.ts                # 註冊各 chrome 事件監聽
│  │  ├─ message-router.ts       # onMessage 路由（8 種訊息）
│  │  ├─ tab-store.ts            # tab/popup 快取讀寫
│  │  ├─ headers.ts              # webRequest 回應標頭收集
│  │  ├─ detection.ts            # 主動偵測 / scheduleActivePageDetection
│  │  ├─ popup-cache.ts          # 彈窗 raw / display 資料建構
│  │  ├─ wordpress.ts            # WordPress 佈景主題 style.css 抓取
│  │  ├─ dynamic-snapshot.ts     # 動態快照防抖處理
│  │  ├─ tech-links.ts           # tech-links.json 延遲載入
│  │  ├─ rule-loader.ts          # 規則 JSON 的載入與合併
│  │  ├─ rule-matcher.ts         # 編譯快取 + hint 索引預篩
│  │  ├─ detector-settings.ts    # 設定 / 規則快取
│  │  ├─ content-injector.ts     # 啟動時給已開分頁注入 content script
│  │  └─ merge.ts                # 技術清單合併 / 去重 / suppress 規則
│  ├─ content/
│  │  └─ content-observer.ts     # MutationObserver 持續動態採集
│  ├─ injected/                   # 編譯為獨立 IIFE，注入到頁面 MAIN world
│  │  ├─ page-detector.ts         # 990 行的偵測主函式
│  │  └─ page-source-search.ts    # 彈窗的原始碼搜尋
│  ├─ ui/
│  │  ├─ popup/                   # 彈窗 SPA
│  │  ├─ settings/                # 設定頁 SPA
│  │  ├─ help/                    # 使用說明頁 SPA
│  │  ├─ components/Select.vue    # 自訂 Select / Combobox 元件
│  │  └─ tokens.css               # 全域 CSS 變數 + 淺暗主題 + scrollbar/checkbox 樣式
│  ├─ types/                      # 跨腳本共享型別
│  │  ├─ messages.ts              # 8 種訊息 discriminated union
│  │  ├─ rules.ts                 # RuleConfig / TechnologyRecord / PageDetectionResult
│  │  ├─ settings.ts              # DetectorSettings + CUSTOM_RULE_LIMITS
│  │  └─ popup.ts                 # PopupResult / PopupRawResult
│  └─ utils/                      # 三處共享 helper
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
│  ├─ rules/                      # 規則 JSON 檔案
│  ├─ tech-links.json             # 524 KB 的技術名稱 → 官網連結對應表
│  └─ injected/                   # build:injected 輸出的兩個 IIFE
├─ build-scripts/
│  └─ build-injected.mjs          # 用 esbuild 單獨編譯注入腳本
├─ vite.config.ts                 # 主建置（CRXJS + Vue + TS）+ 自訂 plugin
├─ vite.injected.config.ts        # 注入腳本獨立 IIFE 建置
├─ docs/                          # 本文件站（VitePress）
└─ dist/                          # build 產物，載入到 chrome
```

## 進程模型

Chrome 擴充功能有四種執行環境，StackPrism 全部用上：

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. Service Worker (ESM module)                              │
│    src/background/*.ts                                       │
│    - chrome.webRequest 監聽回應標頭                          │
│    - chrome.runtime.onMessage 路由                           │
│    - chrome.storage.session 快取偵測結果                     │
│    - 載入 rules/* 與 tech-links.json                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 2. Content Script（頁面 isolated world）                     │
│    src/content/content-observer.ts                           │
│    - MutationObserver 持續採集 DOM 變化                      │
│    - PerformanceObserver 採集資源載入                        │
│    - 累積 800ms 節流後透過 sendMessage 發回 background       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 3. Injected Script（頁面 MAIN world）                        │
│    dist/injected/page-detector.iife.js                       │
│    dist/injected/page-source-search.iife.js                  │
│    - 透過 chrome.scripting.executeScript({files}) 按需注入   │
│    - 能讀 window.* / 真實 DOM / globalKeys                   │
│    - 跑完返回結果，不常駐                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 4. Extension UI（popup / settings / help）                   │
│    src/ui/{popup,settings,help}/*.vue                        │
│    - Vue 3 + TS SPA                                          │
│    - 透過 chrome.runtime.sendMessage 與 background 通訊      │
│    - 透過 chrome.storage.sync 存讀使用者設定                 │
└─────────────────────────────────────────────────────────────┘
```

## 跨腳本訊息

8 種訊息全部在 `src/types/messages.ts` 用 discriminated union 定義型別，所有呼叫走 `src/utils/messaging.ts` 的 `sendMessage<M>()` wrapper。

| 訊息                          | 方向          | 用途                                |
| ----------------------------- | ------------- | ----------------------------------- |
| `GET_HEADER_DATA`             | popup → bg    | 拉取回應標頭記錄                    |
| `GET_POPUP_RESULT`            | popup → bg    | 拉取輕量快取（彈窗主顯示）          |
| `GET_POPUP_RAW_RESULT`        | popup → bg    | 拉取完整 raw（原始線索 / 糾錯回饋） |
| `GET_TECH_LINK`               | popup → bg    | 兜底查詢某技術的官網連結            |
| `START_BACKGROUND_DETECTION`  | popup → bg    | 「重新整理」按鈕觸發主動偵測        |
| `GET_WORDPRESS_THEME_DETAILS` | bg internal   | 抓取佈景主題 style.css header       |
| `DYNAMIC_PAGE_SNAPSHOT`       | content → bg  | content script 持續回報動態快照     |
| `PAGE_DETECTION_RESULT`       | injected → bg | page-detector 注入完返回結果        |

## 注入腳本的雙軌問題

`page-detector.ts` 在原生實作裡既被 background `importScripts` 引入，又被 `executeScript({world:'MAIN', func})` 序列化注入。切到 ESM 後，`Function.prototype.toString` 不能處理 import，所以這條路走不通。

解決方案：用 `executeScript({files})` 取代 `{func}`。`page-detector.ts` 獨立編譯為 IIFE 單一檔案（`vite.injected.config.ts`），透過兩次 RPC 注入：

```ts
// 1. 寫入暫時全域變數
chrome.scripting.executeScript({
  target: { tabId },
  world: 'MAIN',
  func: rules => {
    window.__SP_RULES__ = rules
  },
  args: [pageRules]
})

// 2. 注入 IIFE，IIFE 內部讀 __SP_RULES__ 後清空，return 結果
chrome.scripting.executeScript({
  target: { tabId },
  world: 'MAIN',
  files: ['injected/page-detector.iife.js']
})
```

這樣處理後，background 不再直接依賴 page-detector，service worker 也可以使用 ESM module worker。

## 靜態資源

`public/rules/` 和 `public/tech-links.json` 由 Vite 1:1 複製到 `dist/`，執行時透過 `chrome.runtime.getURL` + `fetch` 載入。不要用 `import rules from '...'` 直接匯入這些大型 JSON；那會讓 Rollup 把規則內聯進 bundle，service worker 冷啟動會明顯變慢。

build 期還有兩個 vite plugin 處理這些 JSON：

1. `precompileRulesPlugin`：遞迴走每個規則 JSON，給每條 leaf rule 注入 `__hints`（正規表達式的必需字面量）、`__legacyHints`（舊版預篩門檻，只寫給需要的規則）和 `__keywordCombined`（keyword 類型規則的合併正規表達式來源碼）
2. `minifyJsonAssets`：把所有 JSON 用 `JSON.stringify(parsed)` 重寫一遍消除縮排 / 空白

## 狀態管理

不引入 Pinia。原因：

- popup state 6 個欄位
- settings state 2 個欄位
- popup / settings 是兩個獨立擴充功能頁面（獨立 chrome.runtime context），Pinia 反而要二次實例化
- 共享的 `DetectorSettings` 用 `chrome.storage.sync` 作真源 + `reactive()` 本地副本即可

## 主題（明暗）

`src/utils/theme.ts` 管理 `getStoredTheme / setStoredTheme / cycleTheme / themeLabel`，存在 `chrome.storage.sync.stackPrismTheme`，三態：`auto` / `light` / `dark`。

`src/ui/tokens.css` 用 `:root[data-theme='dark']` 強制暗色、`@media (prefers-color-scheme: dark) :root:not([data-theme='light'])` 跟隨系統、`color-scheme` 同步瀏覽器預設 UI。

主題切換在 popup 與 settings 頂部都有按鈕，透過 `chrome.storage.onChanged` 跨頁同步。
