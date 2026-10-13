# Disable Specific Technologies

The category toggles filter by category. If you only want to block a few named technologies without turning off an entire category, use this input field instead.

## Usage

Enter one technology name per line. Names are case-insensitive and leading/trailing whitespace is stripped automatically:

```text
Google Analytics
Baidu Tongji
WordPress Plugin: akismet
Cloudflare
```

After saving, these technologies no longer appear in the popup's main list, regardless of their category, confidence level, or source.

::: tip
Name matching goes through `normalizeTechName(name)`: strip whitespace, lowercase, remove punctuation. So `WordPress` and `wordpress` are equivalent, and `Google Analytics` and `google-analytics` are equivalent.
:::

## When to Use This

- **You already know a site uses something and don't need to see it**: your own sites don't need Cloudflare or Vercel listed every time
- **Suppress a noisy false positive**: if a rule misfires often and you don't want to wait for a fix, block it temporarily
- **Simplify the output**: block RSS / Atom / Service Worker / HTTPS results to keep the list focused

## Interaction with Category Toggles

The two filters **stack**: category toggles apply first, then the disable list applies on top.

## Relationship to Raw Clues

Disabled technologies are **hidden only** — they are not removed from the raw JSON. The Raw Clues panel still contains the complete data, so you can review it later.

## Example

To see all CDN results except Cloudflare while keeping the CDN category fully enabled, add:

```text
Cloudflare
```

Cloudflare disappears from the popup, but Akamai, Fastly, and other CDNs remain.
