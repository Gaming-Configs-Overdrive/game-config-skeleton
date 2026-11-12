import path from 'path'
import { createZip } from './utils/zipUtils.js'
import { getAllFiles } from './utils/fileUtils.js'
import fs from 'fs'

export default function buildFullReleasePlugin(options) {
  const { outputDir, packName, foldersToInclude } = options

  return {
    name: 'build-full-release-plugin',
    buildEnd() {
      const absoluteOutputDir = path.resolve(outputDir)

      fs.mkdirSync(absoluteOutputDir, { recursive: true })

      const allFiles = foldersToInclude.flatMap((folder) => {
        const absoluteFolderPath = path.resolve(folder)
        if (fs.existsSync(absoluteFolderPath)) {
          return getAllFiles(absoluteFolderPath).map((relativePath) => {
            return {
              fullPath: path.join(absoluteFolderPath, relativePath),
              relativePath: path.join(folder, relativePath),
            }
          })
        } else {
          console.warn(
            `Ordner ${folder} existiert nicht und wird übersprungen.`
          )
          return []
        }
      })

      const zipPath = path.join(absoluteOutputDir, packName)

      createZip(allFiles, zipPath)
      console.log(`Erzeugt vollständiges Release-Paket: ${zipPath}`)
    },
  }
}
