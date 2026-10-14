<div align="center">

[🇨🇳 简体中文](PRIVACY.zh-CN.md) · [🇬🇧 English](PRIVACY.en.md) · **🇹🇼 繁體中文** · [🇯🇵 日本語](PRIVACY.ja.md) · [🇫🇷 Français](PRIVACY.fr.md) · [🇩🇪 Deutsch](PRIVACY.de.md) · [🇧🇷 Português](PRIVACY.pt.md) · [🇮🇹 Italiano](PRIVACY.it.md) · [🇨🇿 Čeština](PRIVACY.cs.md) · [🇵🇱 Polski](PRIVACY.pl.md)

</div>

# StackPrism 隱私權政策

最近更新：2026-05-12

## 概述

StackPrism / 棧稜鏡（以下簡稱「本擴充套件」）是一款基於 Chrome / Edge Manifest V3 的網頁技術棧識別瀏覽器擴充套件。本擴充套件非常重視您的隱私——所有資料處理均在您本人的瀏覽器本地完成，**不會向任何遠端伺服器上傳、共享或出售您的任何資料**。

## 存取的資料

為了實現「識別您目前訪問頁面所使用的技術棧」這一唯一功能，本擴充套件會在您主動訪問網頁時**本地讀取**以下資訊。所有讀取到的內容**僅在您的瀏覽器記憶體或 chrome.storage 中處理**，絕不會離開您的瀏覽器。

### 1. 網站內容

- 您目前訪問頁面的 DOM 節點結構、CSS 類別名稱、CSS 變數、`<meta>` 標籤
- 頁面 `window` 物件上由 `<script>` 注入的全域變數名稱（僅讀取名稱，不讀取值）
- 頁面載入的 JavaScript / CSS / iframe / 圖片等資源的 URL
- 該頁面**已經載入**的 JavaScript 檔案的開頭若干位元組（走瀏覽器快取，不增加額外網路流量），用於識別 `/*! @license ... */` 版權註解和 SPA 內嵌的 OAuth 入口 URL

### 2. 網路紀錄

- 您目前訪問頁面的 URL 和標題
- 頁面發起的 XHR / Fetch / iframe / WebSocket 等請求的回應標頭（Server、X-Powered-By、Set-Cookie 欄位名稱等）
- 頁面協商的 HTTP 協定版本（HTTP/1.1 / HTTP/2 / HTTP/3）

## 資料用途

上述資料**僅**用於：

- 在您本地比對擴充套件自帶的規則庫，識別該頁面所使用的前端框架、後端服務、CDN、CMS、登入、支付、統計等技術棧
- 在擴充套件彈出視窗中向您本人展示識別結果

## 資料儲存

- **識別結果**：僅儲存於 `chrome.storage.session`，瀏覽器關閉即銷毀，且每個分頁獨立保存
- **您的設定**（停用的分類、黑名單技術名稱、自訂規則、主題偏好等）：儲存於 `chrome.storage.sync`，由瀏覽器加密同步至您的 Google / Microsoft 帳號，本擴充套件**無法存取**您帳號內的任何其他資料
- 本擴充套件**不**儲存完整頁面 HTML、Cookie 完整值、登入憑證、表單填寫內容、密碼或任何其他敏感資訊

## 資料傳輸

- 本擴充套件**不會**向任何遠端伺服器上傳您的瀏覽資料、識別結果、個人資訊或任何其他資料
- 沒有遙測、沒有廣告 SDK、沒有第三方分析、沒有錯誤上報至雲端
- 擴充套件只發起兩類網路請求，**均不**攜帶您的任何身份資訊或瀏覽資料：
  1. 非同步抓取**您目前訪問頁面自身已經載入的**少量 JS 檔案首段（走瀏覽器快取，不增加額外網路流量），用於在本地掃描該 JS 中的版權註解和 OAuth 入口 URL
  2. 技術品牌圖示**優先從本擴充套件內建的圖示庫讀取**（已離線打包 1300+ 主流技術的 SVG / PNG，不發起任何網路請求）；僅當某項技術不在內建圖示庫中時，才會從 `cdn.simpleicons.org` 拉取兜底（請求體只包含一個公開技術名稱 slug，例如 react / vuedotjs / docker，不含您正在訪問的頁面 URL、識別結果或任何個人資訊）；CDN 如果 2 秒內未載入成功，擴充套件會自動回退到本地生成的首字母色塊，絕不阻塞識別流程

## 第三方共享

- 本擴充套件**不**向任何第三方出售、共享、轉讓使用者資料
- 本擴充套件**不**將使用者資料用於與「識別技術棧」無關的任何用途
- 本擴充套件**不**用於貸款、信用評估等用途

## 您的權限

您可以隨時：

- 在擴充套件彈出視窗中點「重新整理」按鈕重新掃描當前頁面
- 在擴充套件設定頁中重置規則快取、停用任意分類、封鎖指定技術名稱、新增自訂規則
- 在 `chrome://extensions` 中解除安裝本擴充套件，所有本地儲存資料將被瀏覽器自動清除

## 開放原始碼

本擴充套件完全開放原始碼，任何人都可以審計原始碼以確認隱私實踐：

https://github.com/setube/stackprism

開放原始碼協議為 [MIT](https://opensource.org/licenses/MIT)。

## 聯絡方式

如有任何隱私相關問題，請透過 GitHub Issues 聯絡作者：

https://github.com/setube/stackprism/issues

## 政策變更

本隱私權政策的最新版本始終發布於本儲存庫的 [PRIVACY.md](https://github.com/setube/stackprism/blob/main/PRIVACY.md)。如有重大變更，會同步更新最近更新日期。
