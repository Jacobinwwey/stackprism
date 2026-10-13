# Developer Guide

This section is for people who want to read the source code, modify rules, or submit a pull request. If you only need to install and use the extension, the [User Guide](/en/guide/) is all you need.

## Sections

- [Architecture Overview](./architecture.md) — project directory structure, module responsibilities, data flow
- [Rule File Format](./rule-format.md) — how JSON under `public/rules/` is organized, nested groups + defaults inheritance
- [Detection Flow](./detection-flow.md) — the full pipeline from webRequest / page injection to popup rendering
- [Contributing Rules](./contribute-rules.md) — how to add a new technology to the built-in rule set
- [Build & Release](./release.md) — local builds, packaging, signing crx, release workflow

## Tech Stack

The project is built with Vite 5 + Vue 3 + TypeScript + `@crxjs/vite-plugin` 2.x. The background script is a Manifest V3 ESM service worker. Package manager is pnpm.

Rules live under `public/rules/`, split into multiple JSON files by detection direction (page rules, response header rules, WordPress/Drupal ecosystem, etc.). At build time a plugin preprocesses each rule and injects `__hints` / `__legacyHints` / `__keywordCombined` fields used to accelerate matching.

## Common Dev Commands

```bash
pnpm install            # install dependencies
pnpm run dev            # start Vite dev server with extension hot-reload
pnpm run build          # build to dist/, loadable in Chrome
pnpm run typecheck      # vue-tsc strict type check
pnpm run lint           # eslint check
pnpm run docs:dev       # start this doc site locally
pnpm run docs:build     # build the doc site as static files
```

In dev mode the extension supports hot-reload. Changes to popup / settings / help usually refresh automatically. Changes to `src/background/` or content scripts require manually clicking the refresh button on the extension card in `chrome://extensions/`.

## Vue Entry Points

Three independent SPAs, each built separately:

| Entry    | File                         | Description                                                      |
| -------- | ---------------------------- | ---------------------------------------------------------------- |
| popup    | `src/ui/popup/index.html`    | The 440 × 600 px window that opens when you click the icon       |
| settings | `src/ui/settings/index.html` | The options page opened from the extensions detail view          |
| help     | `src/ui/help/index.html`     | The standalone help tab opened from the settings page            |

## Links

- [GitHub repository](https://github.com/setube/stackprism)
- [Issue tracker](https://github.com/setube/stackprism/issues)
- [Releases](https://github.com/setube/stackprism/releases)
