import fs from 'node:fs'
import path from 'node:path'

// Recursively lists files below dir as forward-slash relative paths, without .gitkeep.
export function listFiles(dir) {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir, { recursive: true })
    .filter((rel) => fs.statSync(path.join(dir, rel)).isFile())
    .map((rel) => rel.split(path.sep).join('/'))
    .filter((rel) => path.posix.basename(rel) !== '.gitkeep')
    .sort()
}
