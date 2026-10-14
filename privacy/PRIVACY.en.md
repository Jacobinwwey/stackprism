<div align="center">

[🇨🇳 简体中文](PRIVACY.zh-CN.md) · **🇬🇧 English** · [🇹🇼 繁體中文](PRIVACY.zh-TW.md) · [🇯🇵 日本語](PRIVACY.ja.md) · [🇫🇷 Français](PRIVACY.fr.md) · [🇩🇪 Deutsch](PRIVACY.de.md) · [🇧🇷 Português](PRIVACY.pt.md) · [🇮🇹 Italiano](PRIVACY.it.md) · [🇨🇿 Čeština](PRIVACY.cs.md) · [🇵🇱 Polski](PRIVACY.pl.md)

</div>

# StackPrism Privacy Policy

Last updated: 2026-05-12

## Overview

StackPrism (the "Extension") is a browser extension based on Chrome / Edge Manifest V3 that identifies the tech stack of web pages. The Extension takes your privacy seriously — all data processing happens locally in your browser, and **no data is ever uploaded, shared, or sold to any remote server**.

## Data Accessed

To deliver the sole function of "identifying the tech stack of the page you are currently visiting", the Extension **locally reads** the following information when you actively visit a web page. Everything read is **processed only in your browser's memory or chrome.storage** and never leaves your browser.

### 1. Website Content

- DOM node structure, CSS class names, CSS variables, and `<meta>` tags of the current page
- Names of global variables injected by `<script>` tags on the `window` object (names only — values are never read)
- URLs of JavaScript, CSS, iframe, image, and other resources loaded by the page
- The first few bytes of JavaScript files **already loaded** by the page (served from the browser cache, with no additional network traffic), used to identify `/*! @license ... */` copyright comments and OAuth entry URLs embedded in SPAs

### 2. Network Records

- The URL and title of the current page
- Response headers (Server, X-Powered-By, Set-Cookie field names, etc.) from XHR / Fetch / iframe / WebSocket requests issued by the page
- The HTTP protocol version negotiated by the page (HTTP/1.1 / HTTP/2 / HTTP/3)

## How Data Is Used

The data above is used **exclusively** to:

- Match against the Extension's built-in rule library locally on your device, to identify frontend frameworks, backend services, CDNs, CMSs, login providers, payment processors, analytics tools, and other technologies used by the page
- Display the identification results to you in the Extension popup

## Data Storage

- **Identification results**: stored only in `chrome.storage.session`; destroyed when the browser closes, and kept separately per tab
- **Your settings** (disabled categories, blocked tech names, custom rules, theme preference, etc.): stored in `chrome.storage.sync`, encrypted and synced to your Google / Microsoft account by the browser — the Extension **cannot access** any other data in your account
- The Extension does **not** store full page HTML, complete Cookie values, login credentials, form contents, passwords, or any other sensitive information

## Data Transmission

- The Extension **does not** upload your browsing data, identification results, personal information, or any other data to any remote server
- No telemetry, no ad SDKs, no third-party analytics, no cloud error reporting
- The Extension makes only two types of network requests, **neither of which** carries any identifying information or browsing data:
  1. Asynchronously fetching the first section of a small number of JS files **already loaded by the page you are currently visiting** (served from the browser cache, with no additional network traffic), used to scan for copyright comments and OAuth entry URLs locally
  2. Technology brand icons are **read first from the Extension's built-in icon library** (1,300+ mainstream technology SVGs / PNGs packaged offline, with no network requests). Only when a technology is not in the built-in library is a fallback fetched from `cdn.simpleicons.org` (the request contains only a public tech name slug such as `react` / `vuedotjs` / `docker` — no page URL, identification result, or personal information). If the CDN does not respond within 2 seconds, the Extension automatically falls back to a locally generated initial-letter color block and never blocks the identification process

## Third-Party Sharing

- The Extension **does not** sell, share, or transfer user data to any third party
- The Extension **does not** use user data for any purpose unrelated to "tech stack identification"
- The Extension **is not** used for loans, credit assessments, or similar purposes

## Your Rights

You may at any time:

- Click the "Refresh" button in the Extension popup to re-scan the current page
- Reset the rule cache, disable any category, block specific tech names, or add custom rules in the Extension settings page
- Uninstall the Extension from `chrome://extensions` — all locally stored data will be cleared automatically by the browser

## Open Source

The Extension is fully open source; anyone can audit the source code to verify these privacy practices:

https://github.com/setube/stackprism

Licensed under [MIT](https://opensource.org/licenses/MIT).

## Contact

For any privacy-related questions, please reach out via GitHub Issues:

https://github.com/setube/stackprism/issues

## Policy Changes

The latest version of this privacy policy is always published in this repository at [PRIVACY.md](https://github.com/setube/stackprism/blob/main/PRIVACY.md). The last-updated date will be updated alongside any significant changes.
