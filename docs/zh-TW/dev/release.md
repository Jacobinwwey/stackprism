# 建置與發布

## 本地建置

```bash
bun install
bun run build
```

鏈路：

1. `bun run build:injected`（`build-scripts/build-injected.mjs`）：esbuild 把 `src/injected/page-detector.ts` 與 `page-source-search.ts` 各編譯成一個獨立 IIFE 檔案，輸出到 `public/injected/`
2. `vite build`（`@crxjs/vite-plugin`）：打包 background / popup / settings / help 四個入口，輸出到 `dist/`
3. `precompileRulesPlugin`（vite plugin closeBundle hook）：掃 `dist/rules/*.json`，給每條 leaf rule 注入 `__hints` / `__legacyHints` / `__keywordCombined`
4. `minifyJsonAssets`（vite plugin closeBundle hook）：所有 JSON 用 `JSON.stringify(parsed)` 重寫，去縮排與換行

最終 `dist/` 可直接在 `chrome://extensions/` 開發人員模式載入。

## 開發熱更新

```bash
bun run dev
```

vite dev server + crxjs HMR：改 `src/ui/**` 彈窗 / 設定頁 / 使用說明會自動熱替換。改 `src/background/**` 背景代碼或 `src/content/**` content script 需要在 `chrome://extensions/` 找到擴充功能卡片點重新整理按鈕重新載入。

## 型別與 lint

```bash
bun run typecheck    # vue-tsc --noEmit，全工程嚴格型別檢查
bun run lint         # eslint src
```

提交前統一跑一遍格式化：

```bash
npx prettier --write .
```

## 版本號管理

`package.json` 的 `version` 欄位是真源。`@crxjs/vite-plugin` 會自動把它同步到 `dist/manifest.json`。

常規功能、規則和修復改動遞增 patch。patch 走到 `99` 後進入下一個 minor，不使用 `1.1.100` 這種版本號：

```bash
# 1.1.98 -> 1.1.99
# 1.1.99 -> 1.2.0
```

只有需要發安裝包的版本才建立 GitHub Release：`x.y.0`、`x.y.10`、`x.y.20`、...、`x.y.90`。例如 `1.2.0`、`1.2.10` 要發，`1.2.5`、`1.2.15` 不發。

```bash
# 修改 package.json 版本後
git add package.json
git commit -m "chore: bump 1.2.10"
git push origin main
```

## GitHub Release 工作流程

`.github/workflows/release-extension.yml` 在兩種情況觸發：

1. 在 GitHub UI 發布一個 release（`release: published` 事件）
2. 在 Actions 頁面手動跑 workflow_dispatch（可選傳 release_tag input）

工作流程做的事：

1. checkout + 安裝 bun + Node 20
2. `bun install --frozen-lockfile`
3. `bun run build`
4. 從 `dist/manifest.json` 讀 version，校驗與 release tag 一致
5. 把 `dist/` 整個 zip 成 `stackprism-v{ver}.zip` + sha256
6. **如果配置了 secret `EXTENSION_PRIVATE_KEY`**，再用 `npx crx3` 簽署出 `stackprism-v{ver}.crx` + sha256；否則跳過 crx 僅傳 zip
7. `gh release upload --clobber` 把所有產物上傳到 release tag
8. `actions/upload-artifact` 同時備一份 artifact

## 發布說明

發布說明從上一個 release tag 到當前提交的 `git log --oneline vPREV..HEAD` 整理，不直接貼 commit 清單。寫法按使用者能看懂的方向歸類，比如：

- 規則增強
- 彈窗與設定頁
- 文件站
- 建置與發布流程

發布說明只寫使用者或維護者關心的變化，不寫本地跑了哪些格式化、型別檢查、lint 或建置指令。

## CRX 簽署金鑰

第一次發布前需要產生一個 RSA 私鑰，並把它配置到 GitHub repository secrets。

### 產生私鑰

```bash
openssl genrsa -out extension.pem 2048
```

::: warning
`extension.pem` **絕對不能遺失**——遺失了重新產生會換擴充功能 ID（= Chrome 把它當成另一個擴充功能）。本地存檔備份。
:::

### 配置到 GitHub

1. 儲存庫 Settings → Secrets and variables → Actions → New repository secret
2. Name: `EXTENSION_PRIVATE_KEY`
3. Secret: 把 `extension.pem` 檔案**整體內容**（包括 `-----BEGIN PRIVATE KEY-----` 和 `-----END PRIVATE KEY-----`）貼上去
4. 儲存

之後工作流程會自動用這個 key 簽署 crx。

### 不配置會怎樣

工作流程仍能跑，僅產物裡沒有 `.crx` 檔案。使用者只能用 zip 解壓縮載入。

## 發布檢查清單

- [ ] `npx prettier --write .` 已執行
- [ ] `bun run typecheck` 通過
- [ ] `bun run lint` 通過
- [ ] `bun run build` 通過
- [ ] 在 chrome 裡載入 `dist/` 手動測試關鍵路徑（彈窗開啟、識別一個站點、重新整理、複製完整技術棧報告、設定頁加規則）
- [ ] 把 `package.json` 的 version bump
- [ ] git commit + push
- [ ] 如果版本符合 release 節點，在 GitHub UI 發布 release（tag 為 `v{version}`，與 package.json 對齊）
- [ ] 等發布工作流程跑完，確認 release 資產裡有 zip / crx 與 sha256

## 發布到 Chrome Web Store

工作流程不自動上架到 Chrome Web Store——CWS 的 publish API 需要 OAuth2 流程，目前手動操作：

1. 把 `dist/` 資料夾打成 zip（同工作流程的 zip 產物）
2. [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) → 上傳新版本
3. 填變更說明，等審核（通常 1-3 個工作天）
