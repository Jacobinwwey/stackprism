# 規則 JSON 匯入匯出

設定頁最後一塊會展示當前自訂規則的 JSON。適合備份、搬運和批次編輯。

## 用途

- 跨裝置 / 跨帳號搬運自訂規則
- 用版本管理工具備份規則
- 批次編輯（在輸入框裡搜尋取代，比表單逐條改快）
- 直接以程式構造規則陣列（腳本產生幾百條規則）

## 欄位結構

每條規則是一個物件：

```json
{
  "name": "MyCMS",
  "category": "網站程式",
  "kind": "自訂 CMS",
  "confidence": "中",
  "matchType": "regex",
  "patterns": ["mycms-[0-9.]+\\.js", "X-Generator: MyCMS"],
  "selectors": ["[data-powered-by='mycms']"],
  "globals": ["MyCMS"],
  "matchIn": ["url", "resources", "html", "headers", "dynamic"],
  "url": "https://mycms.example.com"
}
```

| 欄位         | 類型                     | 必填   | 說明                                                                    |
| ------------ | ------------------------ | ------ | ----------------------------------------------------------------------- |
| `name`       | string                   | 是     | 彈窗顯示名稱                                                            |
| `category`   | string                   |        | 分類，預設 `其他程式庫`                                                 |
| `kind`       | string                   |        | 類型說明，預設 `自訂規則`                                               |
| `confidence` | `"高"` / `"中"` / `"低"` |        | 預設 `中`                                                               |
| `matchType`  | `"keyword"` / `"regex"`  |        | 預設 `regex`                                                            |
| `patterns`   | string[]                 | 三選一 | 三選一（patterns / selectors / globals 至少有一個非空）                 |
| `selectors`  | string[]                 | 三選一 | CSS 選擇器清單                                                          |
| `globals`    | string[]                 | 三選一 | 全域變數名稱清單（`window.x.y` 寫成 `x.y`）                             |
| `matchIn`    | string[]                 |        | `url` / `resources` / `html` / `headers` / `dynamic` 任意組合，預設全選 |
| `url`        | string                   |        | 必須 `http(s)://`，可為空                                               |

## 操作按鈕

標題列右上角有兩個按鈕：

- **從 JSON 匯入**：解析輸入框內容，驗證通過後**整體取代**當前自訂規則清單（不是合併）
- **格式化**：解析後用 `JSON.stringify(rules, null, 2)` 重新寫回，縮排整齊

## 字串中的反斜線

JSON 裡寫正規表達式要雙重跳脫。比如要比對 `\.js`：

```json
{
  "matchType": "regex",
  "patterns": ["\\.js$"]
}
```

JSON parser 把 `\\` 解成單個 `\`，擴充功能拿到 `\.js$`，傳給 `new RegExp()` 後才是真正的「跳脫點」。

## 整體驗證

匯入時全陣列先 parse，任一條規則欄位不合格整個匯入會被拒絕（atomic），不會出現「半數被匯入半數被拒絕」的中間狀態。錯誤提示會指出第幾條規則的哪個欄位有問題。

## 與表單的關係

- 表單裡改 → 自動同步到 JSON 輸入框
- JSON 輸入框改完 → 必須點「從 JSON 匯入」才會同步回內部規則清單
- 不點匯入直接「儲存設定」，會用最近一次表單 / 匯入操作後的狀態儲存

## 數量上限

`CUSTOM_RULE_LIMITS.rules` 預設 100。超出會被拒絕。詳見 [`src/types/settings.ts`](https://github.com/setube/stackprism/blob/main/src/types/settings.ts) 的全部限制：

| 欄位                                    | 上限     |
| --------------------------------------- | -------- |
| 規則總數                                | 100      |
| name                                    | 80 字    |
| category                                | 40 字    |
| kind                                    | 40 字    |
| 單條 pattern / selector / global        | 240 字   |
| patterns / selectors / globals 陣列長度 | 各 80    |
| matchIn 陣列長度                        | 8        |
| url                                     | 240 字   |
| customCss                               | 10000 字 |
