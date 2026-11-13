import { validateManifest } from './lib/validate.mjs'

const { errors } = validateManifest(process.cwd())
if (errors.length) {
  console.error(`game.yml is invalid:\n  ${errors.join('\n  ')}`)
  process.exit(1)
}
console.log('game.yml is valid')
