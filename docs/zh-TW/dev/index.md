# 開發手冊

這一部分寫給準備看原始碼、改規則或提 PR 的人。只需要安裝擴充功能的話，看 [使用指南](/zh-TW/guide/) 就夠了。

## 章節

- [架構概覽](./architecture.md) — 專案目錄結構、各模組職責、資料流
- [規則檔案格式](./rule-format.md) — `public/rules/` 下 JSON 怎麼組織，nested groups + defaults 繼承
- [偵測流程](./detection-flow.md) — 從 webRequest / 頁面注入到彈窗渲染走過哪些環節
- [貢獻規則](./contribute-rules.md) — 怎麼往內建規則集合加入新技術
- [建置與發布](./release.md) — 本地建置、打包、簽署 crx、發布工作流程

## 技術棧概況

專案主體是 Vite 8 + Vue 3 + TypeScript + `@crxjs/vite-plugin` 3.x。背景腳本是 Manifest V3 ESM service worker，套件管理器用 bun。

規則放在 `public/rules/` 下，按頁面規則、回應標頭規則、WordPress / Drupal 生態等方向拆成多個 JSON 檔案。建置時會預處理規則，注入 `__hints` / `__legacyHints` / `__keywordCombined` 這類用於比對加速的欄位。

## 開發常用指令

```bash
bun install            # 安裝相依套件
bun run dev            # 啟動 vite dev server，擴充功能熱更新
bun run build          # 建置到 dist/，可載入到 chrome
bun run typecheck      # vue-tsc 嚴格型別檢查
bun run lint           # eslint 檢查
bun run docs:dev       # 啟動本文件站本地預覽
bun run docs:build     # 建置文件靜態站
```

dev 模式下，擴充功能頁面支援熱更新。改 popup / settings / help 通常會自動重新整理；改 `src/background/` 或 content script 後，需要到 `chrome://extensions/` 手動重新整理擴充功能卡片。

## Vue 入口

三個獨立 SPA 入口，分別建置，互不干擾：

| 入口     | 檔案                         | 說明                                                    |
| -------- | ---------------------------- | ------------------------------------------------------- |
| popup    | `src/ui/popup/index.html`    | 瀏覽器右上角點擴充功能圖示彈出的 440px × 600px 小視窗   |
| settings | `src/ui/settings/index.html` | 在 `chrome://extensions/` 詳細資訊頁開啟的 options page |
| help     | `src/ui/help/index.html`     | 設定頁裡點「使用說明」開啟的獨立分頁                    |

## 相關連結

- [GitHub 儲存庫](https://github.com/setube/stackprism)
- [Issue 清單](https://github.com/setube/stackprism/issues)
- [Release 清單](https://github.com/setube/stackprism/releases)
