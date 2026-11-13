import { build } from './lib/build.mjs'

try {
  for (const name of build(process.cwd())) console.log(`dist/${name}`)
} catch (err) {
  console.error(err.message)
  process.exit(1)
}
