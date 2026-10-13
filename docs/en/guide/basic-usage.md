# Basic Usage

The popup has a fixed height of 600px. The main body is the technology list. The top holds page info and filter controls; the bottom holds search, raw clues, and other tools.

## Top Toolbar

```text
[StackPrism  current page URL]    [Theme] [Settings] [Copy] [Refresh]
```

- **Left**: extension name + version + current page URL (truncated; hover to see the full URL)
- **Right — four icon buttons**:
  - **Theme** (sun / moon / monitor icon): cycles through Auto / Light / Dark
  - **Settings**: opens the settings page (in a separate tab)
  - **Copy**: copies the current page URL to the clipboard
  - **Refresh**: tells the background to re-detect the current page; any cached results remain visible while the new scan runs

## Overview Stats

```text
22 Technologies    274 Resources    0 Headers
```

- **Technologies**: total number of deduplicated technologies detected
- **Resources**: number of script, stylesheet, iframe, image, and other resource URLs loaded by the page
- **Headers**: number of useful headers extracted from the main document response

## Category Filter Bar

```text
[ Highlights 5  All 22 ]    [ Select category ▾ ]
```

- The left segment switcher: Highlights shows only high-confidence results; All shows everything
- The right dropdown: 24 categories (Frontend Frameworks / UI Frameworks / CDN / WAF / CMS / …); selecting one shows only that category's results. Each option includes a count (e.g., "CMS · 4")

## Technology List

Each technology gets its own card:

```text
React                                         [High]
- React Fiber marker found in DOM
- Resource URL matches cdn.example.com/react.production.min.js
Source: Response Headers  Dynamic Monitor
Report inaccurate detection
```

- **Tech name**: clickable, opens the technology's official website or repository (an external link icon appears on hover)
- **Confidence pill**: High (green) / Medium (yellow) / Low (gray)
- **Evidence**: up to 4 lines listing the DOM nodes, resources, or headers that led to this result
- **Source tags**: each tag is clickable — **clicking opens a drawer from the bottom showing the raw JSON for that specific technology and source**
- **Correction button**: opens a prefilled GitHub Issue with the detection result attached, for reporting false positives or misses

::: tip
When a page returns a lot of results, start with the Highlights view. It shows only high-confidence detections. Switch to All when you need the complete picture or want to investigate a false positive.
:::

## Bottom Toolbar

```text
[Search]  [Raw Clues]  [Copy All]                      GitHub
```

Left-side tool buttons — details in [Tools](./tools.md). Search and Raw Clues open a panel from the bottom (up to 60% of the popup height); click the same button or the panel's close button to dismiss. Copy All writes the full tech-stack report to the clipboard without opening any panel.

## Scroll Behavior

The popup's total height is locked at 600px. Only the **technology list area** scrolls independently. The top toolbar, overview stats, and category filter bar are always visible.

When the list is scrolled more than roughly 240px, a circular scroll-to-top button appears in the bottom-right corner and smoothly returns the list to the top when clicked.
