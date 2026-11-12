import fs from 'fs'
import path from 'path'
import AdmZip from 'adm-zip'

export function createZip(files, outputZipPath) {
  const zip = new AdmZip()
  files
    .filter((file) => path.basename(file.fullPath) !== '.gitkeep')
    .forEach((file) => {
      const entryName = file.relativePath.split(path.sep).join('/')
      zip.addFile(entryName, fs.readFileSync(file.fullPath))
    })
  zip.writeZip(outputZipPath)
}
