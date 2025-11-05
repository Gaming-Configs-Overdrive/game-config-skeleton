import path from 'path'
import { fileURLToPath } from 'url'
import { createZip } from 'utils/zipUtils.js'
import { getAllFiles } from 'utils/fileUtils.js'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default function buildFullReleasePlugin(options) {
  const { outputDir, packName, foldersToInclude } = options

  return {
    name: 'build-full-release-plugin',
    buildEnd() {
      const absoluteOutputDir = path.join(__dirname, outputDir)

      fs.mkdirSync(absoluteOutputDir, { recursive: true })

      const allFiles = foldersToInclude.flatMap((folder) => {
        const absoluteFolderPath = path.join(__dirname, folder)
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
