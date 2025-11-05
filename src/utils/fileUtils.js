import fs from 'fs'
import path from 'path'

export function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8')
}

export function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf-8')
}

export function getFilesByPattern(dir, pattern) {
  const files = fs.readdirSync(dir).map((f) => path.join(dir, f))
  return files.filter((file) => pattern.test(path.basename(file)))
}

export function getAllFiles(dirPath, arrayOfFiles = [], basePath = dirPath) {
  const files = fs.readdirSync(dirPath)

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file)
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles, basePath)
    } else {
      arrayOfFiles.push(path.relative(basePath, fullPath))
    }
  })

  return arrayOfFiles
}
