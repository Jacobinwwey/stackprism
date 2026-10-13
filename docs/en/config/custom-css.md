# Custom Popup Styles

The settings page includes a custom CSS input field. CSS entered here is saved and injected into the `<head>` of the popup, settings page, and help page, overriding the default styles.

## Example: More Prominent Confidence Pills

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

## Example: Change the Accent Color

```css
:root {
  --accent: #d946ef;
  --accent-dark: #a21caf;
  --accent-soft: rgba(217, 70, 239, 0.1);
}
```

The segment switcher, tech link hover states, refresh button, and other elements all reference these tokens, so they update together.

## Example: Increase Font Size

```css
body {
  font-size: 15px;
}

.tech-name {
  font-size: 14px;
}
```

## Injection Point

All custom CSS is placed in a `<style id="stackPrismCustomCss">` tag and inserted at the end of `<head>`. Saving again replaces the old content rather than appending.

## Scope

- Popup
- Settings page (options page)
- Help page

This CSS has no effect on regular web pages — it only applies within the extension's own UI.

## Debugging Tips

Open the popup or settings page and right-click → Inspect. In the Elements panel you can see the injected style tag and verify that your selectors are matching.

## Limits

- Maximum length is `CUSTOM_RULE_LIMITS.css` (default 10,000 characters); saving fails if exceeded
- External CSS files cannot be imported (`@import` is blocked by the extension's CSP)
- `url(...)` can only reference base64 data URIs, not remote image URLs
