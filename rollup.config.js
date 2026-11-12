import buildConfigPlugin from './src/buildConfigPlugin.js'
import buildModPackPlugin from './src/buildModPackPlugin.js'
import buildFullReleasePlugin from './src/buildFullReleasePlugin.js'

export default ({ input = 'src/index.js', outputDir = 'dist' } = {}) => ({
  input,
  output: {
    dir: outputDir,
    format: 'cjs',
    sourcemap: false,
  },
  plugins: [
    buildModPackPlugin({
      inputDir: 'mods',
      outputDir: outputDir,
      packName: 'modpack.zip',
    }),
    buildConfigPlugin({
      inputDir: 'configs',
      outputDir: outputDir,
      packName: 'config.zip',
    }),
    buildFullReleasePlugin({
      outputDir: outputDir,
      packName: 'fullrelease.zip',
      foldersToInclude: ['configs', 'mods', 'docs'],
    }),
    // Hier können weitere Plugins hinzugefügt werden
  ],
})
