import fs from 'fs'
import AdmZip from 'adm-zip'

export function createZip(files, outputZipPath) {
  const zip = new AdmZip()
  files.forEach((file) => {
    const fileData = fs.readFileSync(file)
    const fileName = file.split('/').pop()
    zip.addFile(normalizeFilename(fileName), fileData)
  })
  zip.writeZip(outputZipPath)
}

function normalizeFilename(filename, searchPattern, replaceWith) {
  if (new RegExp(searchPattern, 'i').test(filename)) {
    return replaceWith
  }

  // Wenn keine der Bedingungen zutrifft, gib den Originalnamen zurück
  return filename
}
