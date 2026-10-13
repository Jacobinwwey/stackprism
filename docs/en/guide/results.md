# Understanding Results

## Confidence

Every technology entry shows a confidence pill with one of three levels:

| Level      | Color  | Meaning                                                                                                                                      |
| ---------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **High**   | Green  | A strong signal matched: a global variable (e.g., `window.React`), a dedicated DOM selector, or a distinctive resource URL (e.g., `/_next/`) |
| **Medium** | Yellow | A moderate signal matched: a fuzzy response header, a CSS class prefix, or a set of CSS variables                                            |
| **Low**    | Gray   | A weak signal matched: a generic script filename fallback (e.g., `*.min.js`) or a broad regex                                                |

The Highlights tab shows only high-confidence results by default.

## Evidence

Each card shows up to 4 lines of evidence. Common evidence types include DOM markers, resource URLs, response headers, and dynamic-load records, for example:

```text
- React Fiber marker found in DOM
- Resource URL matches unpkg.com/react@18.2.0/umd/react.production.min.js
- Response header X-Powered-By: Next.js
```

When investigating a false positive, start by reading the evidence. It usually tells you whether the problem is in a resource rule, a response header rule, or an overly broad DOM/class match.

## Source

The source tag indicates where the detection came from:

| Source Tag                            | Origin                                                                                                   |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `Response Headers`                    | HTTP response headers from the main document (server / x-powered-by / set-cookie, etc.)                  |
| `Response Headers · API`              | Response headers from an XHR / fetch request made by the page                                            |
| `Response Headers · iframe`           | Main document response headers from a nested iframe                                                      |
| `Dynamic Monitor`                     | Resources and dynamically loaded scripts collected continuously by the content script + MutationObserver |
| `Dynamic Monitor · After Interaction` | Resources loaded after user interaction (modals, login, payment flows)                                   |
| `WordPress Theme`                     | Reverse-engineered from the theme's `style.css` header                                                   |

**Clicking any source tag** opens a panel from the bottom showing the raw JSON subset for **that technology and that source only**. It gives you the raw response headers, resource URL list, or dynamic snapshot directly, without having to dig through the full JSON.

## Sort Order

Default sort order:

1. Category index (Frontend Frameworks → UI Frameworks → Build/Runtime → CDN → …)
2. Within a category, descending by confidence (High → Medium → Low)
3. Within the same confidence level, by tech name via `localeCompare`

Switching to a specific category sorts within that category only. The Highlights tab shows all high-confidence technologies across categories; if there are none, it falls back to the top 30 results across all technologies sorted by confidence descending.

## Deduplication

If the same technology is detected from multiple sources (for example, React appearing in both response headers and the DOM), it is shown only once. The confidence takes the strongest level, evidence arrays are merged and deduplicated, and the sources array lists every matched source.

## No Detection Doesn't Mean Not Used

The extension detects "**what clues the page exposes to the browser**". If a site:

- Strips all runtime traces after SSR (e.g., a statically pre-rendered Astro site)
- Clears all custom server headers
- Hashes bundle filenames without including the original framework name

the extension may return very few results or none at all. That usually isn't a missing rule — the page simply hasn't exposed enough signals to the browser.

Frontend build signals are also not equivalent to backend runtime. Seeing `/_next/`, `/_nuxt/`, or Vite output tells you about the frontend build chain, but says nothing definitive about the server-side language. Backend language is usually inferred from `Server`, `X-Powered-By`, cookie names, or framework-specific response headers.

## Correction Button

The "Report inaccurate detection" button on each card opens a GitHub Issue prefilled with:

- The current page URL
- The raw JSON for this detection result
- The evidence you see
- The extension version

Describe what is wrong or what it should have detected instead. The maintainers will adjust the relevant rule in [`rules/`](https://github.com/setube/stackprism/tree/main/public/rules).
