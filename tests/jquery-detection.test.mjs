import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { test } from 'node:test'
import { build } from 'esbuild'
import { repoRoot, loadPageRules, runPageDetector } from './helpers/rule-harness.mjs'

test('the extension detector rejects jQuery prose while preserving runtime and resource hits', async () => {
  const rules = loadPageRules(['page/frontend-frameworks.json'])
  const prose = await runPageDetector(rules, { html: '<p>A tutorial about jQuery.</p>' })
  assert.ok(!prose.some(technology => technology.name === 'jQuery'))
  const runtime = await runPageDetector(rules, { globals: ['jQuery'] })
  assert.ok(runtime.some(technology => technology.name === 'jQuery'))
  const resource = await runPageDetector(rules, { resources: ['https://example.com/jquery-3.7.1.min.js'] })
  assert.equal(resource.find(technology => technology.name === 'jQuery').version, '3.7.1')
})

test('dynamic snapshots reject jQuery in titles while retaining script resource detection', async () => {
  const source = await readFile(new URL('../src/background/dynamic-snapshot.ts', import.meta.url), 'utf8')
  const compiled = await build({
    stdin: {
      contents: `${source.replaceAll('export const ', 'const ')}\nexport { detectFromDynamicSnapshot };`,
      loader: 'ts',
      resolveDir: path.join(repoRoot, 'src/background')
    },
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node',
    plugins: [
      {
        name: 'exclude-extension-io',
        setup(build) {
          // The exported pure matcher does not need tab storage, timers or extension orchestration.
          build.onResolve({ filter: /^\.\/(tab-store|detection|detector-settings|bundle-license|tab-write-lock)$/ }, args => ({
            path: args.path,
            external: true,
            sideEffects: false
          }))
        }
      }
    ]
  })
  const { detectFromDynamicSnapshot } = await import(
    `data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`
  )
  const rules = loadPageRules(['page/frontend-frameworks.json', 'page/dynamic-technologies.json'])
  const snapshot = {
    url: 'https://example.com/',
    title: 'A tutorial about jQuery.',
    resources: [],
    scripts: [],
    stylesheets: [],
    iframes: [],
    feedLinks: [],
    domMarkers: []
  }
  assert.ok(!detectFromDynamicSnapshot(snapshot, rules).some(technology => technology.name === 'jQuery'))
  const positive = detectFromDynamicSnapshot({ ...snapshot, scripts: ['https://example.com/jquery-3.7.1.min.js'] }, rules)
  assert.ok(positive.some(technology => technology.name === 'jQuery'))
})
