# Contributing Rules

## Two Paths

There are two ways to contribute:

1. **Quick feedback**: click the "Report inaccurate detection" button on any tech card in the popup. It opens a GitHub Issue prefilled with the page URL, the current rule match result, and the extension version. The maintainers will adjust the rule from there.
2. **Direct PR**: fork the repository, edit the relevant JSON file under `public/rules/`, verify locally, then open a PR.

The rest of this page covers the direct PR path.

## Find the Right File

`public/rules/` is split by responsibility:

| File                               | Contents                                                   |
| ---------------------------------- | ---------------------------------------------------------- |
| `page/frontend-frameworks.json`    | React, Vue, Angular, and other frontend frameworks         |
| `page/ui-frameworks.json`          | Tailwind, Bootstrap, Element, Ant Design, etc.             |
| `page/build-runtime.json`          | Webpack, Vite, Rollup, Bun, and other build tools          |
| `page/frontend-cdn-libraries.json` | Named frontend libraries loaded via CDN (jQuery, lodash, moment, etc.) |
| `page/wordpress-plugins.json`      | 4,500+ WordPress plugins                                   |
| `page/drupal-modules.json`         | 4,000+ Drupal modules                                      |
| `page/cms-themes.json`             | CMS themes                                                 |
| `page/website-programs.json`       | WordPress, Drupal, Discuz!, and other CMS platforms        |
| `page/payment-systems.json`        | Payment platforms                                          |
| `page/third-party-logins.json`     | Third-party login providers                                |
| `page/saas-services.json`          | SaaS (Sentry, Mixpanel, Intercom, etc.)                    |
| `page/analytics-providers.json`    | Analytics and tracking                                     |
| `page/cdn-providers.json`          | CDN providers (page-side detection)                        |
| `headers/server-products.json`     | Server products detected via `Server:` header              |
| `headers/cdn-providers.json`       | CDNs detected via response headers                         |
| `headers/website-programs.json`    | CMSes detected via response headers                        |
| ...                                |                                                            |

Full list in `public/rules/index.json`.

## Minimal Example of a New Rule

To add ExampleCMS detection, find the right group in `page/website-programs.json` (e.g., "self-hosted CMS") and add:

```json
{
  "name": "ExampleCMS",
  "url": "https://examplecms.example.com",
  "patterns": ["examplecms-[0-9.]+\\.min\\.js", "/_examplecms/"],
  "globals": ["ExampleCMS"],
  "selectors": ["[data-powered-by='examplecms']"]
}
```

Field meanings are in [Rule File Format](./rule-format.md).

## Which Group to Use

Open the target JSON and you'll see the nested group structure:

```json
{
  "page": {
    "websitePrograms": {
      "defaults": { "category": "CMS / Website Programs" },
      "rules": [
        {
          "defaults": { "confidence": "high" },
          "rules": [
            // named CMSes with high-confidence signals
          ]
        },
        {
          "defaults": { "confidence": "medium" },
          "rules": [
            // medium-confidence detections
          ]
        }
      ]
    }
  }
}
```

Place your rule in the subgroup that matches your confidence judgment. The order of entries within a `rules` array doesn't affect detection results, only readability when browsing.

## Verifying Your Rule

After making changes:

```bash
pnpm run build
```

The build runs `precompileRulesPlugin` to inject `__hints` and related fields. Then load `dist/` in `chrome://extensions/` and verify against a real ExampleCMS site.

Alternatively, use the Custom Rules panel in the settings page to test the rule at the user config layer first, then move it to `public/rules/` once you've confirmed it works.

## Reducing False Positives

- **Prefer globals**: a `window.X` match is the most reliable signal, nearly zero false positives
- **Prefer specific selectors**: `[data-powered-by='examplecms']`, `[ng-version]` — attributes clearly written by that tech
- **Write full domain / full path in resource patterns**: `cdn.examplecms.com/sdk.js` beats `examplecms`
- **Add a prefix to classNames / classPrefixes**: `example-cms-` rather than `cms-` to avoid collisions
- **Anchor regexes**: `^/_examplecms/` is more precise than `/_examplecms/`
- **Be conservative with confidence**: if unsure, use medium — a yellow pill is more honest than a misleading green one

## PR Workflow

1. Fork [setube/stackprism](https://github.com/setube/stackprism)
2. Clone locally, run `pnpm install`, verify `pnpm run build` succeeds
3. Edit the relevant file under `public/rules/`
4. Grab 2–3 evidence samples from [Wappalyzer rules](https://github.com/enthec/webappanalyzer), the official site, or docs, and include them in the PR description
5. Open a PR targeting the main branch

The PR description should state which technologies you added, which pages you verified against, and why the signals won't cause false positives on other sites.
