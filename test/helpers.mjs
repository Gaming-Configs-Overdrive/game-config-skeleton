import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import YAML from 'yaml'

const fixture = fileURLToPath(new URL('./fixtures/valid', import.meta.url))

// Copies the valid fixture to a temp dir, optionally mutating its game.yml.
export function fixtureCopy(t, mutate) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gco-skeleton-'))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  fs.cpSync(fixture, dir, { recursive: true })
  if (mutate) {
    const file = path.join(dir, 'game.yml')
    const manifest = YAML.parse(fs.readFileSync(file, 'utf8'))
    mutate(manifest, dir)
    fs.writeFileSync(file, YAML.stringify(manifest))
  }
  return dir
}
