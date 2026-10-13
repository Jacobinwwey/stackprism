# Build & Release

## Local Build

```bash
bun install
bun run build
```

Build pipeline:

1. `bun run build:injected` (`build-scripts/build-injected.mjs`): esbuild compiles `src/injected/page-detector.ts` and `page-source-search.ts` into two standalone IIFE files, output to `public/injected/`
2. `vite build` (`@crxjs/vite-plugin`): bundles background, popup, settings, and help entry points, output to `dist/`
3. `precompileRulesPlugin` (vite plugin closeBundle hook): scans `dist/rules/*.json` and injects `__hints` / `__legacyHints` / `__keywordCombined` into each leaf rule
4. `minifyJsonAssets` (vite plugin closeBundle hook): rewrites all JSON with `JSON.stringify(parsed)` to strip indentation and whitespace

The resulting `dist/` can be loaded directly in `chrome://extensions/` with Developer mode enabled.

## Dev Hot-reload

```bash
bun run dev
```

Vite dev server + crxjs HMR: changes to `src/ui/**` (popup, settings, help) hot-reload automatically. Changes to `src/background/**` or `src/content/**` require clicking the refresh button on the extension card in `chrome://extensions/`.

## Type Check and Lint

```bash
bun run typecheck    # vue-tsc --noEmit, strict type check across the project
bun run lint         # eslint src
```

Before committing, run the formatter:

```bash
npx prettier --write .
```

## Version Management

`package.json`'s `version` field is the source of truth. `@crxjs/vite-plugin` syncs it automatically into `dist/manifest.json`.

Regular features, rules, and bug fixes increment the patch version. When patch reaches `99`, roll into the next minor — `1.1.100` is not used:

```bash
# 1.1.98 -> 1.1.99
# 1.1.99 -> 1.2.0
```

Only versions that need a distributable package get a GitHub Release: `x.y.0`, `x.y.10`, `x.y.20`, …, `x.y.90`. For example, `1.2.0` and `1.2.10` get releases; `1.2.5` and `1.2.15` do not.

```bash
# after bumping package.json
git add package.json
git commit -m "chore: bump 1.2.10"
git push origin main
```

## GitHub Release Workflow

`.github/workflows/release-extension.yml` triggers in two cases:

1. Publishing a release in the GitHub UI (`release: published` event)
2. Manually running via workflow_dispatch from the Actions tab (optional `release_tag` input)

What the workflow does:

1. Checkout + install bun + Node 20
2. `bun install --frozen-lockfile`
3. `bun run build`
4. Read version from `dist/manifest.json`, verify it matches the release tag
5. Zip the entire `dist/` into `stackprism-v{ver}.zip` + sha256
6. **If the `EXTENSION_PRIVATE_KEY` secret is configured**, sign the zip into `stackprism-v{ver}.crx` + sha256 using `npx crx3`; otherwise skip the crx and upload only the zip
7. `gh release upload --clobber` uploads all artifacts to the release tag
8. `actions/upload-artifact` saves a copy as a workflow artifact

## Release Notes

Release notes are compiled from `git log --oneline vPREV..HEAD` since the previous release tag — not a raw commit list paste. Write them grouped by what users or maintainers care about, for example:

- Rule additions
- Popup and settings page
- Documentation
- Build and release process

Omit local formatting, type checking, lint, and build command runs.

## CRX Signing Key

Generate an RSA private key before the first release and configure it as a GitHub repository secret.

### Generate the key

```bash
openssl genrsa -out extension.pem 2048
```

::: warning
**Never lose `extension.pem`** — regenerating it changes the extension ID (Chrome treats it as a different extension). Keep a local backup.
:::

### Add it to GitHub

1. Repository Settings → Secrets and variables → Actions → New repository secret
2. Name: `EXTENSION_PRIVATE_KEY`
3. Secret: paste the **entire content** of `extension.pem` (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)
4. Save

The workflow uses this key automatically from that point on.

### Without the key

The workflow still runs successfully — the release artifacts just won't include a `.crx` file. Users can load the extension from the zip.

## Release Checklist

- [ ] `npx prettier --write .` done
- [ ] `bun run typecheck` passes
- [ ] `bun run lint` passes
- [ ] `bun run build` passes
- [ ] Load `dist/` in Chrome and manually test critical paths (open popup, detect a site, refresh, copy full tech-stack report, add a rule in settings)
- [ ] Bump `version` in `package.json`
- [ ] `git commit + push`
- [ ] If this version is a release point, publish the release in the GitHub UI (tag as `v{version}`, matching package.json)
- [ ] Wait for the release workflow to finish, confirm the release assets contain zip, crx, and sha256 files

## Publish to Chrome Web Store

The workflow does not auto-publish to the Chrome Web Store — the CWS publish API requires an OAuth2 flow, so this is done manually:

1. Zip the `dist/` folder (same as the workflow's zip artifact)
2. [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) → upload new version
3. Fill in the change notes and wait for review (typically 1–3 business days)
