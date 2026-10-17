import assert from 'node:assert/strict'
import { test } from 'node:test'
import { loadPageRules, runPageDetector } from './helpers/rule-harness.mjs'

test('the extension detector rejects jQuery prose while preserving runtime and resource hits', async () => {
  const rules = loadPageRules(['page/frontend-frameworks.json'])
  const prose = await runPageDetector(rules, { html: '<p>A tutorial about jQuery.</p>' })
  assert.ok(!prose.some(technology => technology.name === 'jQuery'))
  const runtime = await runPageDetector(rules, { globals: ['jQuery'] })
  assert.ok(runtime.some(technology => technology.name === 'jQuery'))
  const resource = await runPageDetector(rules, { resources: ['https://example.com/jquery-3.7.1.min.js'] })
  assert.equal(resource.find(technology => technology.name === 'jQuery').version, '3.7.1')
})
