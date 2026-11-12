import path from 'path'
import { createZip } from './utils/zipUtils.js'
import { getAllFiles } from './utils/fileUtils.js'
import fs from 'fs'

export default function buildConfigPlugin(options) {
  const { inputDir, outputDir, packName } = options

  return {
    name: 'build-config-plugin',
    buildEnd() {
      const absoluteInputDir = path.resolve(inputDir)
      const absoluteOutputDir = path.resolve(outputDir)

      if (!fs.existsSync(absoluteInputDir)) {
        console.warn(
          `Ordner ${inputDir} existiert nicht und wird übersprungen.`
        )
        return
      }

      fs.mkdirSync(absoluteOutputDir, { recursive: true })

      const allFiles = getAllFiles(absoluteInputDir).map((relativePath) => {
        return {
          fullPath: path.join(absoluteInputDir, relativePath),
          relativePath,
        }
      })

      const zipPath = path.join(absoluteOutputDir, packName)

      createZip(allFiles, zipPath)
      console.log(`Erzeugt Config-Paket: ${zipPath}`)
    },
  }
}
