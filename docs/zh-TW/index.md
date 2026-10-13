---
layout: home

hero:
  name: StackPrism
  text: 網頁技術線索查看器
  tagline: 開啟擴充功能彈窗，查看當前頁面暴露出的框架、CDN、CMS、統計、登入、支付和 SaaS 線索。每條結果都帶有證據和來源，便於判斷是否可信。
  image:
    src: /icon.svg
    alt: StackPrism
  actions:
    - theme: brand
      text: 安裝與啟用
      link: /zh-TW/guide/install
    - theme: alt
      text: 在 GitHub 上查看
      link: https://github.com/setube/stackprism/blob/main/i18n/README.zh-Hant.md

features:
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'/></svg>"
    title: 本地規則庫
    details: 規則隨擴充功能打包，頁面 URL、資源、DOM、回應標頭和動態資源都在本機比對，不需要帳號或外部 API。
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z'/></svg>"
    title: 快取優先的彈窗
    details: 背景先整理輕量結果。開啟彈窗時優先顯示快取裡的重點結果，原始 JSON 和技術連結按需載入。
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z'/></svg>"
    title: 自訂規則
    details: 可在設定頁補上自己的關鍵字、正規表達式、CSS 選擇器和全域變數規則，用來覆蓋內建規則未照顧到的站點。
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'/></svg>"
    title: 結果可追溯
    details: 技術名稱、可信度、證據、來源放在同一張卡片裡。需要排查誤報時，可以直接展開對應來源的原始資料。
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12.67 19a2 2 0 0 0 1.416-.586l6.13-6.13a4.992 4.992 0 0 0 .832-2.65V5l-3 1.5L17.97 5h-1.97a4.992 4.992 0 0 0-2.65.832l-6.13 6.13a2 2 0 0 0-.586 1.416v3.288c0 .53.211 1.04.586 1.415l1.456 1.456c.375.375.884.586 1.414.586h3.287Z'/><path d='M16 8 2 22'/><path d='M17.5 15H9'/></svg>"
    title: 可過濾輸出
    details: 分類開關、停用名單和重點視圖可以減少雜訊。完整資料仍保留在原始線索裡，方便回顧。
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m18 16 4-4-4-4'/><path d='m6 8-4 4 4 4'/><path d='m14.5 4-5 16'/></svg>"
    title: 規則可審閱
    details: 內建規則按 JSON 檔案分類維護。新增識別通常只需要補一條規則和幾條能重現的證據。
---

## 這是什麼

StackPrism 是一個 Chromium MV3 擴充功能。它不「看穿」伺服器內部，只整理瀏覽器能看到的線索：腳本和樣式資源、DOM 標記、全域變數、回應標頭、動態載入的資源、WordPress 佈景主題樣式表等。

每條結果都會標注**可信度**、**證據**和**來源**。如果某個結果看起來不對，可以先看證據，再點來源展開對應的原始 JSON。

## 從哪裡開始

- 第一次安裝：看 [安裝與啟用](/zh-TW/guide/install.md)
- 看不懂結果：看 [結果解讀](/zh-TW/guide/results.md)
- 想屏蔽雜訊或補規則：看 [設定指南](/zh-TW/config/)
- 想改內建規則：看 [規則檔案格式](/zh-TW/dev/rule-format.md) 和 [貢獻規則](/zh-TW/dev/contribute-rules.md)

## 準確性邊界

識別結果不是稽核報告。站點如果隱藏回應標頭、把資源名全部 hash 化、SSR 後移除框架痕跡，外掛就只能給出很少的結果，甚至沒有結果。

這個專案的取捨是：盡量把判斷依據放出來，讓使用者能知道「為什麼識別成這樣」。規則會持續補充，但不會把低品質猜測包裝成確定結論。
