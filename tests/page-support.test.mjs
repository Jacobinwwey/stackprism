import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { transform } from 'esbuild'

const source = await readFile(new URL('../src/utils/page-support.ts', import.meta.url), 'utf8')
const { code } = await transform(source, { loader: 'ts', format: 'esm', target: 'es2022' })
const { checkPageSupport } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`)

test('unsupported protocols expose the localization key already consumed by the popup', () => {
  for (const [url, reasonCode] of [
    ['', 'noPage'],
    ['chrome://settings', 'browserBuiltin'],
    ['edge://settings', 'browserBuiltin'],
    ['brave://settings', 'browserBuiltin'],
    ['opera://settings', 'browserBuiltin'],
    ['vivaldi://settings', 'browserBuiltin'],
    ['chrome-extension://id/popup.html', 'extensionPage'],
    ['moz-extension://id/popup.html', 'extensionPage'],
    ['safari-web-extension://id/popup.html', 'extensionPage'],
    ['about:blank', 'about'],
    ['view-source:https://example.com', 'viewSource'],
    ['devtools://devtools', 'devtools'],
    ['chrome-search://local-ntp', 'devtools'],
    ['chrome-untrusted://new-tab-page', 'devtools'],
    ['file:///tmp/a', 'localFile'],
    ['data:text/html,test', 'dataBlob'],
    ['blob:https://example.com/id', 'dataBlob'],
    ['ftp://example.com', 'unsupportedProtocol']
  ]) {
    assert.equal(checkPageSupport(url).supported, false)
    assert.equal(checkPageSupport(url).reasonCode, reasonCode)
    assert.ok(checkPageSupport(url).reason)
  }
  for (const url of ['http://example.com', 'https://example.com']) {
    assert.deepEqual(checkPageSupport(url), { supported: true, reason: '' })
  }
})
