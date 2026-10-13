---
layout: home

hero:
  name: StackPrism
  text: Web Technology Clue Viewer
  tagline: Open the extension popup to see the frameworks, CDNs, CMSes, analytics, login providers, payment systems, and SaaS signals exposed by the current page. Every result includes evidence and a source, so you can judge how reliable it is.
  image:
    src: /icon.svg
    alt: StackPrism
  actions:
    - theme: brand
      text: Install & Enable
      link: /en/guide/install
    - theme: alt
      text: View on GitHub
      link: https://github.com/setube/stackprism/blob/main/i18n/README.en.md

features:
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'/></svg>"
    title: Local Rule Database
    details: Rules are bundled with the extension. Page URLs, resources, DOM, response headers, and dynamic assets are all matched locally — no account or external API required.
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z'/></svg>"
    title: Cache-first Popup
    details: The background worker prepares a lightweight result set ahead of time. When you open the popup, the cached highlights appear immediately; raw JSON and tech links load on demand.
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z'/></svg>"
    title: Custom Rules
    details: Add your own keyword, regex, CSS selector, and global variable rules in the settings page to cover sites the built-in rules miss.
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'/></svg>"
    title: Traceable Results
    details: Tech name, confidence, evidence, and source are shown together on a single card. When something looks off, expand the corresponding source to inspect the raw data directly.
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12.67 19a2 2 0 0 0 1.416-.586l6.13-6.13a4.992 4.992 0 0 0 .832-2.65V5l-3 1.5L17.97 5h-1.97a4.992 4.992 0 0 0-2.65.832l-6.13 6.13a2 2 0 0 0-.586 1.416v3.288c0 .53.211 1.04.586 1.415l1.456 1.456c.375.375.884.586 1.414.586h3.287Z'/><path d='M16 8 2 22'/><path d='M17.5 15H9'/></svg>"
    title: Filterable Output
    details: Category toggles, a disable list, and the Highlights view reduce noise. The full data is still available in the raw clues panel whenever you need it.
  - icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m18 16 4-4-4-4'/><path d='m6 8-4 4 4 4'/><path d='m14.5 4-5 16'/></svg>"
    title: Auditable Rules
    details: Built-in rules are maintained as categorized JSON files. Adding a new detection usually requires only one rule entry and a few reproducible evidence samples.
---

## What Is This

StackPrism is a Chromium MV3 extension. It doesn't "see through" the server — it collects the clues the browser can actually see: script and style resources, DOM markers, global variables, response headers, dynamically loaded assets, WordPress theme stylesheets, and more.

Every result is annotated with **confidence**, **evidence**, and **source**. If something looks wrong, check the evidence first, then click the source tag to expand the raw JSON.

## Where to Start

- First install: see [Install & Enable](/en/guide/install.md)
- Can't read the results: see [Understanding Results](/en/guide/results.md)
- Want to suppress noise or add rules: see [Configuration Guide](/en/config/)
- Want to edit built-in rules: see [Rule File Format](/en/dev/rule-format.md) and [Contributing Rules](/en/dev/contribute-rules.md)

## Accuracy Limits

Detection results are not an audit report. If a site hides response headers, hashes all resource names, or strips framework traces after SSR, the extension may return very few results or none at all.

The project's tradeoff is to expose the reasoning behind each result so you can judge why something was detected the way it was. Rules will keep improving, but low-quality guesses will never be dressed up as definitive conclusions.
