#!/usr/bin/env node
// 把 build-scripts/custom-icons/ 里的图标注入到 public/skills/，更新 skills-index.json
// 不清空现有文件，只追加/覆盖
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')
const CUSTOM_DIR = path.join(__dirname, 'custom-icons')
const OUTPUT_DIR = path.join(repoRoot, 'public', 'skills')
const MANIFEST_PATH = path.join(repoRoot, 'src', 'ui', 'components', 'skills-index.json')

const normalize = raw =>
  String(raw ?? '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\+/g, 'plus')
    .replace(/[^a-z0-9一-鿿]+/g, '')

let existing = { schemaVersion: 1, skillsIndex: {} }
if (fs.existsSync(MANIFEST_PATH)) {
  try {
    existing = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))
  } catch {
    // ignore parse errors
  }
}
const skillsIndex = { ...existing.skillsIndex }

fs.mkdirSync(OUTPUT_DIR, { recursive: true })

let added = 0
for (const f of fs.readdirSync(CUSTOM_DIR)) {
  if (!/\.(svg|png|ico)$/i.test(f)) continue
  const slug = normalize(f.replace(/\.(svg|png|ico)$/i, ''))
  if (!slug) continue
  const ext = path.extname(f).toLowerCase().slice(1)
  const filename = slug + '.' + ext
  const dst = path.join(OUTPUT_DIR, filename)
  fs.copyFileSync(path.join(CUSTOM_DIR, f), dst)
  skillsIndex[slug] = filename
  added++
}

const sortedIndex = {}
for (const k of Object.keys(skillsIndex).sort()) sortedIndex[k] = skillsIndex[k]
fs.writeFileSync(MANIFEST_PATH, JSON.stringify({ schemaVersion: 1, skillsIndex: sortedIndex }) + '\n', 'utf8')
console.log(`注入 ${added} 个自定义图标 → public/skills/`)
console.log(`索引总条数: ${Object.keys(sortedIndex).length}`)
