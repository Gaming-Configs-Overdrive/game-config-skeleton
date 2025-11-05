import path from 'path'
import { fileURLToPath } from 'url'
import { createZip } from 'utils/zipUtils.js'
import { getAllFiles } from 'utils/fileUtils.js'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default function buildModPackPlugin(options) {
  const { inputDir, outputDir, packName } = options

  return {
    name: 'build-mod-pack-plugin',
    buildEnd() {
      const absoluteInputDir = path.join(__dirname, inputDir)
      const absoluteOutputDir = path.join(__dirname, outputDir)

      fs.mkdirSync(absoluteOutputDir, { recursive: true })

      const allFiles = getAllFiles(absoluteInputDir).map((relativePath) => {
        return {
          fullPath: path.join(absoluteInputDir, relativePath),
          relativePath,
        }
      })

      const zipPath = path.join(absoluteOutputDir, packName)

      createZip(allFiles, zipPath)
      console.log(`Erzeugt Mod-Paket: ${zipPath}`)
    },
  }
}
