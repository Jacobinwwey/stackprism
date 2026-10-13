# Tools

The popup's bottom toolbar has three tools: Search, Raw Clues, and Copy All. Search and Raw Clues open a panel from the bottom that takes up to 60% of the popup height; click the same button or the panel's close button to dismiss. Copy All does not open a panel — it writes the full tech-stack report directly to the clipboard.

## Page Source Search

Use this when you suspect a detection is wrong, or want to confirm whether a particular string or pattern actually appears in the page.

### Input

Supports plain text and regular expressions. Press Enter or click Search to run.

### Options

| Option           | Description                                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| Case sensitive   | Off by default; when enabled, `React` and `react` are treated as different                          |
| Whole word       | Active in plain-text mode; requires non-word characters on both sides of the match (uses `\b`)      |
| Regular expression | Treats the input as a JavaScript regex source, combined with the two flags above                  |

### Output

Results include:

- The query, match mode, source type (serialized DOM or outerHTML), and total source length
- Match count (shown as "100+" when there are too many, with the first N displayed)
- For each match: line number, column, character offset, and a context snippet (~60 characters around the match)

::: tip
Search serializes the current active page's DOM into a string before matching, so it covers hidden elements, inline scripts, and comments. It is not a network-source search — DOM mutations made by scripts after load are included.
:::

## Raw Clues

Use this when you want:

- The complete raw data before it was aggregated by the extension
- Full evidence to attach to an issue report
- To debug a custom rule

The output is the full JSON, structured as follows:

```json
{
  "url": "https://example.com",
  "title": "Example",
  "generatedAt": "2026-05-10T10:00:00.000Z",
  "technologies": [
    /* deduplicated, merged list */
  ],
  "resources": {
    /* resource summary */
  },
  "headers": {
    /* main document response headers */
  },
  "apiObservations": [
    /* url/headers/technologies for each API response */
  ],
  "frameObservations": [
    /* same structure for each iframe */
  ],
  "dynamicObservations": {
    /* dynamically collected scripts/styles/iframes/feedLinks/domMarkers */
  },
  "notes": [
    /* a few methodological remarks */
  ]
}
```

### Source tags → scoped JSON

If you only want the JSON subset for a specific technology and source, skip the full Raw Clues panel — click the source tag directly on the tech card (e.g., "Response Headers" or "Dynamic Monitor · After Interaction"). The same drawer opens, but it only shows the fields relevant to that source, and the technologies array is filtered to that one entry.

The drawer title changes to something like "Raw Clues · React · Response Headers" to indicate it's a scoped view. Clicking the Raw Clues button in the bottom toolbar switches back to the full JSON.

## Copy Full Tech-Stack Report

The Copy All button copies the full tech-stack report for the current page to the clipboard. The report includes:

- A human-readable Markdown summary
- A `stackprism.tech_stack_report.v1` structured JSON block
- The page URL, title, generation time, total technology count, resource count, and main document header count

It copies **the current popup state** — the Highlights/All segment and category dropdown filter do not affect it, but the category toggles and disable list in settings do.

Common uses:

- Attaching full tech-stack context to an issue or PR
- Recording a site's stack in docs or a knowledge base
- Passing to an AI agent for further analysis
