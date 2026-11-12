import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'
import { validateManifest } from '../scripts/lib/validate.mjs'
import { fixtureCopy } from './helpers.mjs'

const errorsOf = (dir) => validateManifest(dir).errors

test('valid fixture passes', (t) => {
  assert.deepEqual(errorsOf(fixtureCopy(t)), [])
})

test('schema violation is reported with its path', (t) => {
  const dir = fixtureCopy(t, (m) => {
    m.files[0].format = 'toml'
  })
  const errors = errorsOf(dir)
  assert.ok(
    errors.some((e) => e.startsWith('game.yml/files/0/format:')),
    errors
  )
})

test('missing src for one variant fails', (t) => {
  const dir = fixtureCopy(t)
  fs.rmSync(path.join(dir, 'configs/high/Engine.ini'))
  assert.deepEqual(errorsOf(dir), [
    'game.yml/files/0/src: "configs/high/Engine.ini" does not exist',
  ])
})

test('src outside the repository fails', (t) => {
  const dir = fixtureCopy(t, (m) => {
    m.files[0].src = '../outside.ini'
  })
  assert.match(errorsOf(dir)[0], /points outside the repository/)
})

test('bundled mod file outside layout fails', (t) => {
  const dir = fixtureCopy(t)
  fs.mkdirSync(path.join(dir, 'mods/my-mod/bin/x64'), { recursive: true })
  fs.writeFileSync(path.join(dir, 'mods/my-mod/bin/x64/version.dll'), '')
  assert.deepEqual(errorsOf(dir), [
    'mods/my-mod/bin/x64/version.dll: path does not start with an entry of mods.layout',
  ])
})

test('undeclared mod folder fails', (t) => {
  const dir = fixtureCopy(t)
  fs.mkdirSync(path.join(dir, 'mods/other-mod/r6/scripts'), { recursive: true })
  fs.writeFileSync(path.join(dir, 'mods/other-mod/r6/scripts/x.reds'), '')
  assert.deepEqual(errorsOf(dir), [
    'mods/other-mod: not declared as a mod with distribute: bundle in game.yml',
  ])
})

test('online: true forbids injector mods and ban-reported files', (t) => {
  const dir = fixtureCopy(t, (m) => {
    m.mods.items[1].risk = 'injector'
    m.files[0].onlineRisk = 'ban-reported'
  })
  assert.deepEqual(errorsOf(dir), [
    'game.yml/files/0/onlineRisk: "ban-reported" is not allowed when online: true',
    'game.yml/mods/items/1/risk: "injector" is not allowed when online: true',
  ])
})

test('online: false allows injector mods', (t) => {
  const dir = fixtureCopy(t, (m) => {
    m.online = false
    m.mods.items[1].risk = 'injector'
  })
  assert.deepEqual(errorsOf(dir), [])
})
