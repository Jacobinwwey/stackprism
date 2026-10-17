import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { transform } from 'esbuild'

const source = await readFile(new URL('../src/utils/page-support.ts', import.meta.url), 'utf8')
const { code } = await transform(source, { loader: 'ts', format: 'esm', target: 'es2022' })
const { checkPageSupport } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`)

test('unsupported protocols expose the localization key already consumed by the popup', () => {
  const fallbackReasons = {
    noPage: '当前标签页还没有加载网页。',
    browserBuiltin: '浏览器内置页面无法注入检测脚本。',
    extensionPage: '扩展程序内部页面无法识别。',
    about: '浏览器内部页面无法注入检测脚本。',
    viewSource: '查看源码页面不支持检测。',
    devtools: '当前页面不支持检测。',
    localFile: '本地文件页面暂不检测。',
    dataBlob: '当前页面类型不支持检测。',
    unsupportedProtocol: '当前页面类型不支持检测。'
  }
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
    const reason = url.startsWith('chrome:')
      ? 'Chrome 浏览器内置页面无法注入检测脚本。'
      : url.startsWith('edge:')
        ? 'Edge 浏览器内置页面无法注入检测脚本。'
        : fallbackReasons[reasonCode]
    assert.equal(checkPageSupport(url).reason, reason)
  }
  for (const url of ['http://example.com', 'https://example.com']) {
    assert.deepEqual(checkPageSupport(url), { supported: true, reason: '' })
  }
})
