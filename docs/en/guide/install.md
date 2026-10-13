# Install & Enable

StackPrism targets Chromium-based browsers (Chrome, Edge, Brave, Opera, Vivaldi, Arc, etc.) and requires Manifest V3 support.

## Option 1: Download the crx from a Release

1. Open [GitHub Releases](https://github.com/setube/stackprism/releases)
2. Pick the latest version and download `stackprism-v{version}.crx`
3. Navigate to `chrome://extensions/` (Edge: `edge://extensions/`), then enable Developer mode in the top-right corner
4. Drag the downloaded `.crx` file onto the extensions page
5. Confirm by clicking "Add extension" in the dialog

::: tip
Chrome sometimes blocks drag-to-install for `.crx` files ("Apps, extensions, and user scripts cannot be added from this website"). If that happens, use Option 2 instead.
:::

## Option 2: Download the zip from a Release and load unpacked

1. Open [GitHub Releases](https://github.com/setube/stackprism/releases) and download `stackprism-v{version}.zip`
2. Extract it to a stable directory (**do not delete it — the extension depends on this directory at runtime**)
3. Open `chrome://extensions/` and enable Developer mode
4. Click "Load unpacked"
5. Select the directory you just extracted

## Option 3: Build from source

Suitable for developers or users who want to track the latest main branch.

```bash
git clone https://github.com/setube/stackprism.git
cd stackprism
bun install
bun run build
```

The build output lands in `dist/`. Load the `dist/` directory in `chrome://extensions/` with Developer mode enabled.

After modifying source files, re-run `bun run build`, then click the refresh button on the extension card in the extensions page to load the new version.

## Enabling and Permissions

On first install the extension requests the following permissions:

| Permission   | Purpose                                                              |
| ------------ | -------------------------------------------------------------------- |
| `tabs`       | Read the current tab's URL and title                                 |
| `activeTab`  | Inject detection scripts into the active page                        |
| `scripting`  | Inject page-detector / page-source-search into the page's MAIN world |
| `storage`    | Persist settings, cache detection results, and theme preference      |
| `webRequest` | Intercept response headers to collect server / x-powered-by, etc.    |
| `<all_urls>` | Run on all http(s) pages                                             |

Detection does not rely on any external API. Rule files are bundled locally with the extension, and detection results stay within browser memory and extension storage.

## Uninstalling

Go to `chrome://extensions/`, find StackPrism, and click Remove. Settings and cached results are cleared along with it.
