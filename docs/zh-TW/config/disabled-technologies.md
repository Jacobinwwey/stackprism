# 停用指定技術

「識別開關」按分類過濾；如果只想屏蔽某幾個具名技術，不想關掉整個分類，用這個輸入框。

## 用法

每行一個技術名稱，名稱大小寫不敏感、首尾空白自動去除：

```text
Google Analytics
百度統計
WordPress 插件: akismet
Cloudflare
```

儲存後這些技術不會再出現在彈窗主列表裡，無論它們屬於哪個分類、可信度多少、來源是什麼。

::: tip
名稱比對會走 `normalizeTechName(name)`：去空白、轉小寫、去標點。所以 `WordPress` 和 `wordpress` 等價，`Google Analytics` 和 `google-analytics` 等價。
:::

## 適合屏蔽的情境

- **你已經知道某個站用了某個東西，不想看見它**：自家網站不用每次都看到 Cloudflare / Vercel
- **避免誤報**：某個識別規則誤報率太高，你又不想等修，先暫時屏蔽
- **簡化輸出**：屏蔽 RSS / Atom / Service Worker / HTTPS 這種通用結果，讓列表更聚焦

## 屏蔽與識別開關的優先級

兩者**疊加**：先按分類開關過濾，再按停用名單過濾。

## 與原始線索的關係

被停用的技術**只是不顯示**，不會從 raw JSON 裡刪除。「原始線索」面板拿到的資料仍然完整，方便之後複核。

## 範例

假設你只想看到非 Cloudflare 的 CDN，又想保留所有 CDN 分類下的偵測。設定：

```text
Cloudflare
```

彈窗裡 Cloudflare 不再出現，但 Akamai / Fastly 等其它 CDN 仍然在。
