# 安裝與啟用

StackPrism 面向 Chromium 核心瀏覽器（Chrome、Edge、Brave、Opera、Vivaldi、Arc 等），需要瀏覽器支援 Manifest V3。

## 方式一：從 Release 下載 crx

1. 開啟 [GitHub Releases](https://github.com/setube/stackprism/releases)
2. 選最新版本，下載 `stackprism-v{version}.crx`
3. 在瀏覽器網址列輸入 `chrome://extensions/`（Edge 是 `edge://extensions/`），開啟右上角「開發人員模式」
4. 把下載的 `.crx` 檔案拖進擴充功能頁面
5. 彈窗出現後確認「新增擴充功能」

::: tip
Chrome 有時會攔截 .crx 拖入安裝（提示「無法從此網站新增應用程式、擴充功能和使用者指令碼」）。這種情況請改用方式二。
:::

## 方式二：從 Release 下載 zip 解壓縮載入

1. 開啟 [GitHub Releases](https://github.com/setube/stackprism/releases)，下載 `stackprism-v{version}.zip`
2. 解壓縮到一個穩定的目錄（**別刪除，擴充功能執行依賴這個目錄**）
3. 開啟 `chrome://extensions/`，開啟「開發人員模式」
4. 點擊「載入未封裝項目」
5. 選取剛解壓縮的目錄

## 方式三：本機從原始碼建置

適合開發者 / 想跟最新主分支的使用者。

```bash
git clone https://github.com/setube/stackprism.git
cd stackprism
pnpm install
pnpm run build
```

建置產物在 `dist/`。在 `chrome://extensions/` 開發人員模式下載入 `dist/` 目錄即可。

修改原始碼後只要重跑 `pnpm run build`，擴充功能頁面點擴充功能卡片上的重新整理按鈕就能載入新版本。

## 啟用與權限

首次安裝會要求以下權限：

| 權限         | 用途                                                 |
| ------------ | ---------------------------------------------------- |
| `tabs`       | 讀取當前分頁 URL / title                             |
| `activeTab`  | 當前啟用頁面注入偵測腳本                             |
| `scripting`  | 注入 page-detector / page-source-search 到頁面主世界 |
| `storage`    | 存設定、快取偵測結果、主題偏好                       |
| `webRequest` | 監聽回應標頭收集 server / x-powered-by 等            |
| `<all_urls>` | 在所有 http(s) 網頁執行                              |

偵測過程不依賴外部 API：規則檔案隨擴充功能打包到本機，偵測結果只在瀏覽器記憶體與擴充功能 storage 內流轉。

## 解除安裝

`chrome://extensions/` → 找到 StackPrism → 移除。設定和快取會一起清除。
