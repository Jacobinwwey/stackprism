# Rule JSON Import/Export

The last section of the settings page displays the current custom rules as JSON. It's useful for backups, migrations, and bulk edits.

## Use Cases

- Migrate custom rules across devices or browser profiles
- Back up rules with version control
- Bulk editing (search-and-replace in the text field is faster than editing row by row in the form)
- Programmatically generate a large rule set (write a script to produce the array)

## Field Structure

Each rule is an object:

```json
{
  "name": "MyCMS",
  "category": "CMS / Website Programs",
  "kind": "Custom CMS",
  "confidence": "medium",
  "matchType": "regex",
  "patterns": ["mycms-[0-9.]+\\.js", "X-Generator: MyCMS"],
  "selectors": ["[data-powered-by='mycms']"],
  "globals": ["MyCMS"],
  "matchIn": ["url", "resources", "html", "headers", "dynamic"],
  "url": "https://mycms.example.com"
}
```

| Field        | Type                            | Required     | Description                                                                              |
| ------------ | ------------------------------- | ------------ | ---------------------------------------------------------------------------------------- |
| `name`       | string                          | Yes          | Name shown in the popup                                                                  |
| `category`   | string                          |              | Category; defaults to `Other Libraries`                                                  |
| `kind`       | string                          |              | Kind label; defaults to `Custom Rule`                                                    |
| `confidence` | `"high"` / `"medium"` / `"low"` |              | Defaults to `medium`                                                                     |
| `matchType`  | `"keyword"` / `"regex"`         |              | Defaults to `regex`                                                                      |
| `patterns`   | string[]                        | One of three | At least one of patterns / selectors / globals must be non-empty                         |
| `selectors`  | string[]                        | One of three | CSS selector list                                                                        |
| `globals`    | string[]                        | One of three | Global variable name list (`window.x.y` written as `x.y`)                                |
| `matchIn`    | string[]                        |              | Any combination of `url` / `resources` / `html` / `headers` / `dynamic`; defaults to all |
| `url`        | string                          |              | Must be `http(s)://`; may be empty                                                       |

## Buttons

Two buttons appear in the section header:

- **Import from JSON**: parses the textarea content and, if validation passes, **replaces** the entire custom rule list (not a merge)
- **Format**: re-serializes the parsed rules with `JSON.stringify(rules, null, 2)` for clean indentation

## Backslashes in Strings

Regexes in JSON require double-escaping. To match `\.js`:

```json
{
  "matchType": "regex",
  "patterns": ["\\.js$"]
}
```

The JSON parser reads `\\` as a single `\`, giving the extension `\.js$`, which `new RegExp()` then interprets as an escaped dot.

## Atomic Validation

The entire array is parsed before any rule is committed. If any rule has an invalid field, the whole import is rejected — there is no partial import state. The error message identifies which rule number and which field failed.

## Relationship to the Form

- Form edits automatically sync to the JSON textarea
- JSON textarea edits require clicking "Import from JSON" to sync back to the internal rule list
- Clicking "Save Settings" without importing first saves the state from the last form edit or import operation

## Limits

`CUSTOM_RULE_LIMITS.rules` defaults to 100. Exceeding it causes the import to be rejected. Full limits in [`src/types/settings.ts`](https://github.com/setube/stackprism/blob/main/src/types/settings.ts):

| Field                                       | Limit        |
| ------------------------------------------- | ------------ |
| Total rules                                 | 100          |
| name                                        | 80 chars     |
| category                                    | 40 chars     |
| kind                                        | 40 chars     |
| Single pattern / selector / global          | 240 chars    |
| patterns / selectors / globals array length | 80 each      |
| matchIn array length                        | 8            |
| url                                         | 240 chars    |
| customCss                                   | 10,000 chars |
