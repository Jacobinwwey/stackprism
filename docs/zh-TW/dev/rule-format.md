# 規則檔案格式

`public/rules/` 下的 JSON 檔案按識別方向拆分。`public/rules/index.json` 是清單，列出了建置和執行時需要載入的規則檔案。

## 頂層結構

每個規則 JSON 大致長這樣（節選）：

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

- 頂層 key（如 `page` / `headers`）對應 background 各偵測模組按名拉取
- 二級 key（如 `frontendFrameworks` / `cdnProviders`）也是按名讀取
- 裡面 `{ defaults, rules }` 這種物件表示一個**規則組**（rule group）
- group 巢狀 group，最裡層是「葉規則」（leaf rule，不再有 `rules` 欄位）

## 規則組的 defaults 繼承

`defaults`（也可寫 `$defaults`，兩者等價）會下沉到該組所有 leaf rule。多層巢狀時，外層的會被內層 override。最終展開時，每條 leaf rule 拿到 `{ ...outerDefaults, ...innerDefaults, ...leafFields }` 的合併結果。

範例：

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

展開後 React 規則等價於：

```json
{
  "category": "前端框架",
  "confidence": "高",
  "name": "React",
  "patterns": ["react.js"]
}
```

## 葉規則欄位

| 欄位                    | 類型                     | 說明                                                                                                             |
| ----------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `name`                  | string                   | 彈窗顯示名稱                                                                                                     |
| `category`              | string                   | 分類，會被 `CATEGORY_ORDER` 排序                                                                                 |
| `kind`                  | string                   | 類型說明，可空。會顯示在 evidence 前綴                                                                           |
| `confidence`            | `"高"` / `"中"` / `"低"` | 預設 `"中"`                                                                                                      |
| `matchType`             | `"keyword"` / `"regex"`  | 預設 `"regex"`（直接 `new RegExp(p, 'i')`）                                                                      |
| `patterns`              | string[]                 | 比對規則。keyword 類型走 `escapeRegExp + RegExp`                                                                 |
| `selectors`             | string[]                 | CSS 選擇器，命中即高可信度                                                                                       |
| `globals`               | string[]                 | 全域變數名稱（支援點分隔巢狀），命中即高可信度                                                                   |
| `classNames`            | string[]                 | 命中 DOM 上某個 class（精確比對）即高可信度                                                                      |
| `classPrefixes`         | string[]                 | 命中 DOM 上某個 class 以此為前綴即高可信度                                                                       |
| `cssVariables`          | string[]                 | 頁面 CSS 自訂屬性命中其中 N 個則觸發，配合 `minCssVariableMatches`                                               |
| `minCssVariableMatches` | number                   | 預設 1                                                                                                           |
| `matchIn`               | string[]                 | 限制 patterns 在哪些資料來源比對，可選 `url` / `resources` / `html` / `headers` / `dynamic`。空陣列 / 缺省視為全部 |
| `resourceOnly`          | boolean                  | 只走資源 URL 比對，跳過 DOM / globals / selectors                                                                |
| `resourceHints`         | string[]                 | 業務側手動指定的預過濾指紋。命中文字裡有 hint 才會進 patterns 全量比對                                           |
| `evidence`              | string                   | 命中時的固定 evidence 文案，覆蓋預設的「資源 URL 比對 / DOM 比對」                                               |
| `url`                   | string                   | 技術官網或儲存庫 URL                                                                                             |

## 自動注入欄位（buildtime）

build 階段 `vite.config.ts` 裡的 `precompileRulesPlugin` 給每條 leaf rule 注入：

| 欄位                | 來自                                                                                                                          |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `__hints`           | 正規表達式的必需字面量集合（`src/utils/rule-hints.ts`）：pattern 能命中的文字一定含其中一個，只用來跳過不可能命中的規則，不改變結果 |
| `__legacyHints`     | 1.3.79 及以前的預篩門檻（最長的 3 段字面量），只寫給比 `__hints` 更嚴、且沒有 `resourceHints` 的規則，保證識別結果不變        |
| `__keywordCombined` | matchType 為 keyword 時把所有 patterns escape 後用 `\|` 拼成的合併正規表達式來源碼                                             |

規則檔案裡手寫的 `__hints` 會被當作這條規則的舊門檻。執行時 `getRuleAutoHints(rule)` 與 `getCompiledCombinedPattern(rule)` 優先讀這些欄位，缺失才退回執行時計算（自訂規則只算必需字面量，沒有舊門檻）。

## 規則檔案清單

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

`page/*.json` 服務於頁面偵測路徑（page-detector + dynamic-snapshot 用），`headers/*.json` 服務於回應標頭偵測路徑（headers.ts 用）。兩個路徑獨立，但 leaf rule 的欄位格式完全一致。

## 載入流程

`src/background/rule-loader.ts`：

1. fetch `rules/index.json`
2. 並行 fetch `files[]` 裡所有 JSON
3. 每份 JSON 走 `normalizeRuleValue` 遞迴展開 group
4. `mergeRulePartial` 把每份的所有 key 合併到一個大物件
5. 返回 `RuleConfig`，供各 detection 模組按 key 取陣列

## 在哪裡改

- 改一個具體技術的識別規則：找對應分類的 JSON 檔案直接編輯
- 加新分類：在 `rules/index.json` 加檔案，並確保 background 對應模組按 key 讀取（`detector-settings.ts` 的 `loadTechRules`）
- 大批量批改：寫腳本產生 JSON，覆蓋原檔案
