# Custom Rules

Custom rules let you cover sites the built-in rules miss, or validate a new rule locally before contributing it upstream.

## Form Fields

| Field                | Required | Description                                                                                                       |
| -------------------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| **Tech name**        | Yes      | The name shown in the popup, e.g., `MyCMS`                                                                       |
| **Category**         |          | Pick a built-in category (23 available) or type your own. Defaults to "Other Libraries". The select supports free input. |
| **Kind label**       |          | A note for yourself, e.g., `Enterprise CMS`, `Third-party Payment`. Appears as an evidence prefix. Can be empty. |
| **Confidence**       |          | High / Medium / Low. Defaults to Medium.                                                                          |
| **Match mode**       |          | Keyword / Regex. Defaults to Regex.                                                                               |
| **Website / repo URL** |        | Must be `http://` or `https://`. When set, the tech name in the popup becomes a clickable link.                  |

Below those fields are four areas:

- **Match scope**: determines which data sources the patterns / selectors / globals are tested against
  - Page URL: the current page's address
  - Resource URLs: scripts, stylesheets, iframes loaded by the page
  - DOM / Source: the page's outerHTML
  - Response Headers: main document + API + iframe response headers
  - Dynamic Resources: resources continuously accumulated by the MutationObserver

- **Match patterns**: one per line. In keyword mode, each line is a literal substring match. In regex mode, each line is a JavaScript regex source (no `/.../i` wrapper — the `i` flag is added automatically).

- **CSS selectors**: one per line, e.g., `[data-v-app]`, `#__next`. Match scope must include DOM / Source.

- **Global variables**: one per line, e.g., `React`, `Vue.config`, `__NEXT_DATA__`. A match counts as high confidence.

## Adding / Updating

- **Add Rule** (green primary button): saves the current form as a new rule
- **Update current rule**: click the edit button on a rule in the list to enter edit mode, make changes, then save

You must click "Save Settings" in the top-right to write the rules to storage.

## Saved Rules List

Shown at the bottom of the page. Each entry shows:

- Title: the rule's tech name
- Metadata: category · kind · confidence · match mode · N patterns
- Actions: Edit and Delete buttons (Delete turns red on hover)

## Validation

Rules are validated on every add, update, and settings save:

- Name is required
- At least one of patterns / selectors / globals must be non-empty
- At least one match scope must be selected
- URL, if provided, must start with http(s)://
- Each pattern (in regex mode) must compile with `new RegExp`
- Each selector must pass `document.createDocumentFragment().querySelector`
- Each global must follow the `MyCMS` or `google.maps` dot-separated variable name format

Validation failures show a red tooltip listing up to 6 problems.

## Example: Simple Keyword Match

Detect ExampleCMS:

```text
Tech name:  ExampleCMS
Category:   CMS / Website Programs
Match mode: Keyword
Patterns:
  examplecms
  X-Generator: ExampleCMS
Scope: [x] Page URL [x] Resource URLs [x] DOM / Source [x] Response Headers
```

## Example: Detect a WordPress Theme

```text
Tech name:  WordPress Theme: oceanwp
Category:   Themes / Templates
Match mode: Keyword
Patterns:
  /wp-content/themes/oceanwp/
Scope: [x] Resource URLs [x] DOM / Source
```

## Example: Detect a Dynamically Loaded Payment SDK

The payment script only loads after the user clicks the payment button, so check Dynamic Resources:

```text
Tech name:  ExamplePay
Category:   Payment Systems
Kind:       Third-party Payment
Match mode: Keyword
Patterns:
  pay.example.com
  examplepay-sdk
Scope: [x] Dynamic Resources
```

## Example: Regex Match for a Versioned Library File

```text
Tech name:  ExampleLib
Category:   Frontend Libraries
Match mode: Regex
Patterns:
  examplelib-[0-9.]+\.min\.js
Scope: [x] Resource URLs [x] Dynamic Resources
```

## Reducing False Positives

- Avoid overly generic keywords like `app`, `main`, or `login` — almost every site has those
- Prefer a **full domain** `pay.example.com` over a short string `pay`
- Prefer a **specific path** `/wp-content/themes/oceanwp/` over just `oceanwp`
- When in doubt, set confidence to Low — the popup shows a gray pill to signal it's a guess
- After saving a rule, **always refresh the target page** before reopening the popup; otherwise the cache still reflects the old results
