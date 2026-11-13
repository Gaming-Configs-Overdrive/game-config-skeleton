import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'
import AdmZip from 'adm-zip'
import { build } from '../scripts/lib/build.mjs'
import { fixtureCopy } from './helpers.mjs'

const zipNames = (file) =>
  new AdmZip(file)
    .getEntries()
    .map((e) => e.entryName)
    .sort()

test('build writes the expected ZIP contents', (t) => {
  const dir = fixtureCopy(t)
  fs.writeFileSync(path.join(dir, 'configs/.gitkeep'), '')
  fs.mkdirSync(path.join(dir, 'dist'))
  fs.writeFileSync(path.join(dir, 'dist/.gitkeep'), '')
  fs.writeFileSync(path.join(dir, 'dist/stale.zip'), 'old')

  build(dir)
  const dist = path.join(dir, 'dist')

  assert.deepEqual(fs.readdirSync(dist).sort(), [
    '.gitkeep',
    'MODS.md',
    'SHA256SUMS',
    'config.zip',
    'fullrelease.zip',
    'modpack.zip',
  ])
  assert.deepEqual(zipNames(path.join(dist, 'config.zip')), [
    'high/Engine.ini',
    'low/Engine.ini',
  ])
  assert.deepEqual(zipNames(path.join(dist, 'modpack.zip')), [
    'r6/scripts/example.reds',
  ])
  assert.deepEqual(zipNames(path.join(dist, 'fullrelease.zip')), [
    'configs/high/Engine.ini',
    'configs/low/Engine.ini',
    'docs/README.md',
    'game.yml',
    'mods/my-mod/r6/scripts/example.reds',
  ])

  const mods = fs.readFileSync(path.join(dist, 'MODS.md'), 'utf8')
  assert.match(mods, /\| My Mod \| 1\.0\.0 \| bundle \| bundled \| MIT \|/)
  assert.match(
    mods,
    /\| Other \\\| Mod \| {2}\| link \| \[github\]\(https:\/\/github\.com\/example\/other-mod\) \| GPL-3\.0 \| my-mod \| Not included: download/
  )
})

test('SHA256SUMS matches the dist files', (t) => {
  const dir = fixtureCopy(t)
  build(dir)
  const dist = path.join(dir, 'dist')
  const lines = fs
    .readFileSync(path.join(dist, 'SHA256SUMS'), 'utf8')
    .trimEnd()
    .split('\n')

  assert.equal(lines.length, 4)
  for (const line of lines) {
    const [, hex, name] = line.match(/^([a-f0-9]{64}) {2}(\S+)$/)
    const actual = crypto
      .createHash('sha256')
      .update(fs.readFileSync(path.join(dist, name)))
      .digest('hex')
    assert.equal(hex, actual, name)
  }
})

test('build fails on an invalid manifest', (t) => {
  const dir = fixtureCopy(t)
  fs.rmSync(path.join(dir, 'configs/low/Engine.ini'))
  assert.throws(() => build(dir), /configs\/low\/Engine\.ini" does not exist/)
})
