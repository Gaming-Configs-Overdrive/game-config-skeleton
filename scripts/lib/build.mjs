import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import AdmZip from 'adm-zip'
import { listFiles } from './files.mjs'
import { validateManifest } from './validate.mjs'

// Builds dist/ for the game repo in root. Throws if game.yml is invalid.
export function build(root) {
  const { manifest, errors } = validateManifest(root)
  if (errors.length) {
    throw new Error(`game.yml is invalid:\n  ${errors.join('\n  ')}`)
  }

  const dist = path.join(root, 'dist')
  fs.mkdirSync(dist, { recursive: true })
  for (const name of fs.readdirSync(dist)) {
    if (name !== '.gitkeep') {
      fs.rmSync(path.join(dist, name), { recursive: true, force: true })
    }
  }

  writeZip(path.join(dist, 'config.zip'), dirEntries(root, 'configs', ''))

  const bundled = (manifest.mods?.items ?? []).filter(
    (m) => m.distribute === 'bundle'
  )
  writeZip(
    path.join(dist, 'modpack.zip'),
    bundled.flatMap((m) => dirEntries(root, `mods/${m.id}`, ''))
  )

  writeZip(path.join(dist, 'fullrelease.zip'), [
    { name: 'game.yml', file: path.join(root, 'game.yml') },
    ...['configs', 'mods', 'docs'].flatMap((d) => dirEntries(root, d, `${d}/`)),
  ])

  fs.writeFileSync(path.join(dist, 'MODS.md'), modsMarkdown(manifest))
  writeSha256Sums(dist)
  return fs.readdirSync(dist).filter((n) => n !== '.gitkeep')
}

function dirEntries(root, dir, prefix) {
  const abs = path.join(root, dir)
  return listFiles(abs).map((rel) => ({
    name: prefix + rel,
    file: path.join(abs, rel),
  }))
}

function writeZip(target, entries) {
  const zip = new AdmZip()
  for (const { name, file } of entries) {
    zip.addFile(name, fs.readFileSync(file))
  }
  zip.writeZip(target)
}

// Writes SHA256SUMS in the `sha256sum` format: "<hex>  <name>".
export function writeSha256Sums(dist) {
  const lines = fs
    .readdirSync(dist)
    .filter((n) => n !== '.gitkeep' && n !== 'SHA256SUMS')
    .sort()
    .map((n) => {
      const hash = crypto.createHash('sha256')
      hash.update(fs.readFileSync(path.join(dist, n)))
      return `${hash.digest('hex')}  ${n}`
    })
  fs.writeFileSync(path.join(dist, 'SHA256SUMS'), lines.join('\n') + '\n')
}

const cell = (v) =>
  String(v ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ')

function sourceLink(source) {
  const url =
    source.url ??
    (source.type === 'github' && source.repo
      ? `https://github.com/${source.repo}`
      : null)
  if (url) return `[${source.type}](${url})`
  if (source.type === 'nexus' && source.modId)
    return `Nexus Mods #${source.modId}`
  return source.type === 'local' ? 'bundled' : source.type
}

export function modsMarkdown(manifest) {
  const items = manifest.mods?.items ?? []
  const lines = [`# Mods for ${manifest.name}`, '']
  if (!items.length) return [...lines, 'No mods.', ''].join('\n')
  lines.push(
    '| Name | Version | Distribution | Source | License | Requires | Notes |',
    '| --- | --- | --- | --- | --- | --- | --- |'
  )
  for (const m of items) {
    const notes = [
      m.distribute === 'link'
        ? 'Not included: download it yourself from the source link.'
        : '',
      m.optional ? 'Optional.' : '',
      m.notes ?? '',
    ]
      .filter(Boolean)
      .join(' ')
    lines.push(
      `| ${[
        m.name,
        m.version,
        m.distribute,
        sourceLink(m.source),
        m.license,
        (m.requires ?? []).join(', '),
        notes,
      ]
        .map(cell)
        .join(' | ')} |`
    )
  }
  return [...lines, ''].join('\n')
}
