# Configuration Guide

The settings page can be opened via the Settings button in the popup toolbar, or by navigating to `chrome://extensions/`, finding the StackPrism card, and clicking "Details → Extension options".

The settings page is divided into five sections:

- [Category Toggles](./categories.md) — enable or disable any of the 24 categories (disabled categories no longer appear in the popup)
- [Disable Specific Technologies](./disabled-technologies.md) — block named technologies by name regardless of category
- [Custom Popup Styles](./custom-css.md) — inject CSS to override popup and settings page styles
- [Custom Rules](./custom-rules.md) — add your own detection rules via a form or JSON
- [Rule JSON Import/Export](./json-export.md) — sync your rule set across browsers and devices

## Where Settings Are Stored

All settings are stored in `chrome.storage.sync` and sync across devices via your Google or Edge account. The storage key is `stackPrismSettings`. If you don't want sync, disable it in your browser's own sync settings.

`chrome.storage.sync` has a 100 KB total capacity, with a maximum of 8 KB per key. In practice:

- There's a cap on the number of custom rules (about 100 is safe)
- Custom CSS length is capped (no more than 10,000 characters)
- The disable list can't be too long

The exact limits are defined by `CUSTOM_RULE_LIMITS` in `src/types/settings.ts`. Saving will fail with an error if you exceed them.

## When Changes Take Effect

| Change                                         | When it takes effect                                    |
| ---------------------------------------------- | ------------------------------------------------------- |
| Category toggles / disabled technologies / custom CSS | Immediately on the next popup open              |
| Custom rules                                   | After saving, on the next page refresh + popup open     |
| JSON import                                    | Same as custom rules                                    |

Clicking "Save Settings" writes to storage immediately — no need to refresh the settings page.
