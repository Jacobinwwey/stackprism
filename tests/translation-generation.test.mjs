import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { copyFile, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { test } from 'node:test'
import { promisify } from 'node:util'

const exec = promisify(execFile)

test('translation generator runs as ESM and writes beside its module from another working directory', async () => {
  const directory = await mkdtemp(new URL('./translation-fixture-', import.meta.url))
  try {
    const script = path.join(directory, 'gen_trans.js')
    await copyFile(new URL('../src/i18n/gen_trans.js', import.meta.url), script)
    await writeFile(path.join(directory, 'package.json'), '{"type":"module"}')
    await exec(process.execPath, [script], { cwd: path.dirname(directory) })
    const translations = JSON.parse(await readFile(path.join(directory, 'evidence_translations.json'), 'utf8'))
    assert.equal(translations['Server 响应头包含 PostgREST'], 'Server response header contains PostgREST')
  } finally {
    // mkdtemp owns this exact directory; never remove the repository's translations.
    await rm(directory, { recursive: true, force: true })
  }
})
