import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv2020 from 'ajv/dist/2020.js'
import YAML from 'yaml'
import { listFiles } from './files.mjs'

const schemaPath = fileURLToPath(
  new URL('../../schema/game.schema.json', import.meta.url)
)
const validateSchema = new Ajv2020({
  allErrors: true,
}).compile(JSON.parse(fs.readFileSync(schemaPath, 'utf8')))

const isInside = (root, p) => {
  const rel = path.relative(root, p)
  return rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel)
}

// Validates <root>/game.yml against the schema and the extra build rules.
// Returns { manifest, errors }; errors are strings prefixed with their location.
export function validateManifest(root) {
  const manifestPath = path.join(root, 'game.yml')
  if (!fs.existsSync(manifestPath)) {
    return { manifest: null, errors: [`game.yml: file not found`] }
  }

  let manifest
  try {
    manifest = YAML.parse(fs.readFileSync(manifestPath, 'utf8'))
  } catch (err) {
    return {
      manifest: null,
      errors: [`game.yml: invalid YAML: ${err.message}`],
    }
  }

  if (!validateSchema(manifest)) {
    const errors = validateSchema.errors.map(
      (e) => `game.yml${e.instancePath || ''}: ${e.message}`
    )
    return { manifest, errors }
  }

  const errors = [
    ...checkFiles(root, manifest),
    ...checkMods(root, manifest),
    ...checkOnline(manifest),
  ]
  return { manifest, errors }
}

// Every files[].src must exist for every variant it is installed for.
function checkFiles(root, manifest) {
  const errors = []
  manifest.files.forEach((file, i) => {
    const where = `game.yml/files/${i}/src`
    const usesVariant = file.src.includes('{variant}')
    if (usesVariant && !manifest.variants) {
      errors.push(
        `${where}: uses {variant} but no top-level variants are defined`
      )
      return
    }
    const variants = usesVariant ? (file.variants ?? manifest.variants) : [null]
    for (const variant of variants) {
      const src = variant ? file.src.replaceAll('{variant}', variant) : file.src
      const abs = path.resolve(root, src)
      if (!isInside(root, abs)) {
        errors.push(`${where}: "${src}" points outside the repository`)
      } else if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) {
        errors.push(`${where}: "${src}" does not exist`)
      }
    }
  })
  return errors
}

// Every folder in mods/ must be a bundled mod, and every bundled file must
// start with an entry of mods.layout. Bundled mods must not overwrite each other.
function checkMods(root, manifest) {
  const errors = []
  const modsDir = path.join(root, 'mods')
  const items = manifest.mods?.items ?? []
  const layout = (manifest.mods?.layout ?? []).map((l) =>
    l.replace(/\\/g, '/').replace(/\/+$/, '').toLowerCase()
  )
  const bundled = new Map(
    items.filter((m) => m.distribute === 'bundle').map((m) => [m.id, m])
  )

  const entries = fs.existsSync(modsDir)
    ? fs.readdirSync(modsDir, { withFileTypes: true })
    : []
  for (const entry of entries) {
    if (entry.name === '.gitkeep') continue
    if (!entry.isDirectory()) {
      errors.push(
        `mods/${entry.name}: only mod folders mods/<mod-id>/ are allowed`
      )
    } else if (!bundled.has(entry.name)) {
      errors.push(
        `mods/${entry.name}: not declared as a mod with distribute: bundle in game.yml`
      )
    }
  }

  const seen = new Map()
  items.forEach((mod, i) => {
    if (mod.distribute !== 'bundle') return
    const dir = path.join(modsDir, mod.id)
    if (!fs.existsSync(dir)) {
      errors.push(
        `game.yml/mods/items/${i}: bundled mod folder mods/${mod.id}/ is missing`
      )
      return
    }
    for (const rel of listFiles(dir)) {
      const lower = rel.toLowerCase()
      if (!layout.some((l) => lower === l || lower.startsWith(`${l}/`))) {
        errors.push(
          `mods/${mod.id}/${rel}: path does not start with an entry of mods.layout`
        )
      }
      if (seen.has(lower)) {
        errors.push(
          `mods/${mod.id}/${rel}: also provided by mod "${seen.get(lower)}"`
        )
      } else {
        seen.set(lower, mod.id)
      }
    }
  })
  return errors
}

// online: true forbids ban-reported files and injector mods.
function checkOnline(manifest) {
  if (!manifest.online) return []
  const errors = []
  manifest.files.forEach((file, i) => {
    if (file.onlineRisk === 'ban-reported') {
      errors.push(
        `game.yml/files/${i}/onlineRisk: "ban-reported" is not allowed when online: true`
      )
    }
  })
  ;(manifest.mods?.items ?? []).forEach((mod, i) => {
    if (mod.risk === 'injector') {
      errors.push(
        `game.yml/mods/items/${i}/risk: "injector" is not allowed when online: true`
      )
    }
  })
  return errors
}
