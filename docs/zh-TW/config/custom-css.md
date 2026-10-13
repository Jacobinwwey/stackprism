# 自訂彈窗樣式

設定頁裡有一個自訂 CSS 輸入框。這裡寫的 CSS 儲存後會注入到彈窗、設定頁和說明頁的 `<head>`，用於覆蓋預設樣式。

## 範例：讓可信度標籤更顯眼

```css
.confidence.high {
  background: #14532d;
  color: #fff;
  font-weight: 700;
}

.confidence.medium {
  background: #ca8a04;
  color: #fff;
}
```

## 範例：換主題色

```css
:root {
  --accent: #d946ef;
  --accent-dark: #a21caf;
  --accent-soft: rgba(217, 70, 239, 0.1);
}
```

彈窗裡的 segment、技術連結 hover、重新整理按鈕等都引用這些 token，改完會一起變色。

## 範例：放大字型大小

```css
body {
  font-size: 15px;
}

.tech-name {
  font-size: 14px;
}
```

## 注入位置

所有自訂 CSS 會放進固定 ID 的 `<style id="stackPrismCustomCss">` 標籤，並插入到 `<head>` 末尾。重新儲存會替換舊內容，不會重複追加。

## 適用範圍

- 彈窗（popup）
- 設定頁（options page）
- 使用說明頁（help page）

不會影響普通網頁——這段 CSS 只在擴充功能自己的 UI 範圍內生效。

## 除錯技巧

開啟彈窗或設定頁，右鍵 → 檢查。Elements 面板裡能看到注入的 style 標籤，方便確認選擇器是否命中。

## 限制

- 長度上限 `CUSTOM_RULE_LIMITS.css`（預設 10000 字元），超過後儲存會失敗
- 不能引入外部 CSS 檔案（不能 `@import`），因為擴充功能 CSP 不允許
- 不能用 `url(...)` 引用 base64 以外的遠端圖片
