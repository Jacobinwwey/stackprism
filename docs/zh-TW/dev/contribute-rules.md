# 貢獻規則

## 路徑

把貢獻分成兩類：

1. **快速回饋**：在彈窗對應技術卡片點「識別不準確，點擊糾正」按鈕，會自動開啟 GitHub Issue 並填好上下文（頁面 URL、當前規則比對結果、擴充功能版本）。維護者收到後調整規則。
2. **直接 PR**：fork 儲存庫，編輯 `public/rules/` 下對應 JSON，本地驗證後提 PR。

下面主要講直接 PR 的流程。

## 找到合適的檔案

`public/rules/` 按職責分檔案：

| 檔案                               | 收錄什麼                                               |
| ---------------------------------- | ------------------------------------------------------ |
| `page/frontend-frameworks.json`    | React / Vue / Angular / 各種前端框架                   |
| `page/ui-frameworks.json`          | Tailwind / Bootstrap / Element / Antd 等 UI 程式庫     |
| `page/build-runtime.json`          | Webpack / Vite / Rollup / Bun 等建置工具               |
| `page/frontend-cdn-libraries.json` | 透過 CDN 的具名前端程式庫（jQuery、lodash、moment 等） |
| `page/wordpress-plugins.json`      | 4500+ 個 WordPress 外掛                                |
| `page/drupal-modules.json`         | 4000+ 個 Drupal 模組                                   |
| `page/cms-themes.json`             | CMS 佈景主題                                           |
| `page/website-programs.json`       | WordPress / Drupal / Discuz! 等網站程式本身            |
| `page/payment-systems.json`        | 支付平台                                               |
| `page/third-party-logins.json`     | 第三方登入                                             |
| `page/saas-services.json`          | SaaS（Sentry / Mixpanel / Intercom 等）                |
| `page/analytics-providers.json`    | 統計與分析                                             |
| `page/cdn-providers.json`          | CDN 供應商（前端執行時識別）                           |
| `headers/server-products.json`     | 透過 `Server:` header 識別的伺服器產品                 |
| `headers/cdn-providers.json`       | 透過回應標頭識別的 CDN                                 |
| `headers/website-programs.json`    | 透過回應標頭識別的 CMS                                 |
| ...                                |                                                        |

完整清單見 `public/rules/index.json`。

## 寫一條新規則的最小範例

假設你想加 ExampleCMS 識別。在 `page/website-programs.json` 找到合適的組（比如「自部署 CMS」組），加一條：

```json
{
  "name": "ExampleCMS",
  "url": "https://examplecms.example.com",
  "patterns": ["examplecms-[0-9.]+\\.min\\.js", "/_examplecms/"],
  "globals": ["ExampleCMS"],
  "selectors": ["[data-powered-by='examplecms']"]
}
```

欄位含義見 [規則檔案格式](./rule-format.md)。

## 在哪個 group 裡？

開啟對應 JSON 檔案，會看到巢狀的 group 結構：

```json
{
  "page": {
    "websitePrograms": {
      "defaults": { "category": "網站程式" },
      "rules": [
        {
          "defaults": { "confidence": "高" },
          "rules": [
            // 一系列高可信度具名 CMS
          ]
        },
        {
          "defaults": { "confidence": "中" },
          "rules": [
            // 一系列中可信度的
          ]
        }
      ]
    }
  }
}
```

按你對識別確定性的判斷，放進合適可信度的子組裡。組內的 rules 陣列順序不影響識別結果，只影響除錯時瀏覽順序。

## 驗證規則

修改完後：

```bash
bun run build
```

建置會跑 `precompileRulesPlugin` 給規則注入 `__hints` 等欄位。然後在 `chrome://extensions/` 載入 `dist/`，找一個真實的 ExampleCMS 網站驗證。

或者用「自訂規則」面板先在使用者設定層寫一遍，確認規則有效後再搬到 `public/rules/`。

## 降低誤報

- **優先用 globals**：`window.X` 命中是最穩的，幾乎零誤報
- **優先用專屬 selector**：`[data-powered-by='examplecms']`、`[ng-version]` 這種明顯由該技術寫入的屬性
- **resource patterns 寫完整網域名稱 / 完整路徑**：`cdn.examplecms.com/sdk.js` 比 `examplecms` 穩
- **classNames / classPrefixes 要帶前綴**：`example-cms-` 而不是 `cms-`，避免撞上其它專案用 `cms-` 命名的類別
- **regex 加錨點**：`^/_examplecms/` 比 `/_examplecms/` 準
- **可信度寧可保守**：拿不準就用「中」，讓使用者在彈窗看到的是黃標籤而不是綠標籤——避免誤導

## 規則貢獻到主倉的流程

1. fork [setube/stackprism](https://github.com/setube/stackprism)
2. clone 到本地，`bun install`，`bun run build` 確保能正常建置
3. 找到 `public/rules/` 對應檔案，加規則
4. 在 [Wappalyzer rules](https://github.com/enthec/webappanalyzer)、官網、文件抓 2-3 條證據放在 PR 描述裡
5. 提 PR 到 main 分支

PR 描述裡至少寫清楚新增了哪些技術、用什麼頁面驗證過、為什麼這些特徵不會誤傷其它站點。
