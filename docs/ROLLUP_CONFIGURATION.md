# Rollup Configuration Guide

This document explains how to configure and use the Rollup setup for building game configurations and modding packs.

## Overview
The Rollup configuration is designed to be generic and reusable. It supports building and packaging game configurations, mod packs, and full releases using specialized plugins. The configuration creates ZIP archives for easy distribution of different components.

## Configuration Options
The Rollup configuration accepts the following options:

- **`input`**: The entry file for the Rollup build. Default: `src/index.js`.
- **`outputDir`**: The directory where the build output will be stored. Default: `dist`.

## Example Usage

### Custom Configuration
To customize the build, pass options to the Rollup configuration:

```javascript
import rollupConfig from './rollup.config.js';

export default rollupConfig({
  input: 'src/customEntry.js',
  outputDir: 'customDist',
});
```

### Plugin Configuration
The current configuration includes three main plugins:

- **Mod Pack Plugin**: Packages mod files from `../mods` into `modpack.zip`
- **Config Plugin**: Packages configuration files from `../config` into `config.zip`
- **Full Release Plugin**: Creates a comprehensive release package including configs, mods, and docs folders

## Running the Build
To build the packages, run the following command:

```bash
yarn build
```

## Output Structure
The build output will be stored in the specified `outputDir`. By default, the structure will look like this:

```
dist/
├── modpack.zip
├── config.zip
├── fullrelease.zip
└── [additional build artifacts]
```

## Utilizing Helper Functions in Utility Classes

When building or modifying a Rollup plugin for this repository, the utility functions provided in the `src/utils` directory can significantly simplify your workflow. Below is an overview of the available utility classes and their helper functions:

### `configUtils.js`

- **`removeCommentedLines(configContent, commentPrefix = '//')`**
  - **Purpose:** Removes commented lines from a configuration file.
  - **Usage:** Use this function to clean up configuration files by removing comments before processing them.
  - **Example:**
    ```javascript
    import { removeCommentedLines } from './utils/configUtils';

    const cleanedConfig = removeCommentedLines(configContent);
    ```

- **`applyOverrides(config, overrides)`**
  - **Purpose:** Applies key-value overrides to a configuration file.
  - **Usage:** Use this function to dynamically modify configuration values based on specific requirements.
  - **Example:**
    ```javascript
    import { applyOverrides } from './utils/configUtils';

    const updatedConfig = applyOverrides(config, { fps_max: '120' });
    ```

### `videoConfigUtils.js`

- **`applyVideoResolution(config, { widthConfigName, width, heightConfigName, height })`**
  - **Purpose:** Updates the resolution settings in a video configuration file.
  - **Usage:** Use this function to adjust resolution parameters for different video variants.
  - **Example:**
    ```javascript
    import { applyVideoResolution } from './utils/videoConfigUtils';

    const updatedConfig = applyVideoResolution(config, {
      widthConfigName: 'res_width',
      width: 1920,
      heightConfigName: 'res_height',
      height: 1080,
    });
    ```

### `zipUtils.js`

- **`createZip(files, outputZipPath)`**
  - **Purpose:** Creates a ZIP archive from a list of files.
  - **Usage:** Use this function to package configuration files for distribution.
  - **Example:**
    ```javascript
    import { createZip } from './utils/zipUtils';

    createZip(['file1.txt', 'file2.txt'], 'output.zip');
    ```

### `fileUtils.js`

- **`readFile(filePath)`**
  - **Purpose:** Reads the content of a file.
  - **Usage:** Use this function to load configuration files for processing.
  - **Example:**
    ```javascript
    import { readFile } from './utils/fileUtils';

    const content = readFile('config.txt');
    ```

- **`writeFile(filePath, content)`**
  - **Purpose:** Writes content to a file.
  - **Usage:** Use this function to save modified configuration files.
  - **Example:**
    ```javascript
    import { writeFile } from './utils/fileUtils';

    writeFile('config.txt', updatedContent);
    ```

- **`getFilesByPattern(dir, pattern)`**
  - **Purpose:** Retrieves files matching a specific pattern in a directory.
  - **Usage:** Use this function to locate specific configuration files for processing.
  - **Example:**
    ```javascript
    import { getFilesByPattern } from './utils/fileUtils';

    const files = getFilesByPattern('configs', /\.cfg$/);
    ```

- **`getAllFiles(dirPath, arrayOfFiles = [], basePath = dirPath)`**
  - **Purpose:** Recursively retrieves all files in a directory.
  - **Usage:** Use this function to gather all files in a directory tree for processing.
  - **Example:**
    ```javascript
    import { getAllFiles } from './utils/fileUtils';

    const allFiles = getAllFiles('configs');
    ```

By leveraging these helper functions, you can streamline the development of Rollup plugins and ensure consistency across different configuration builds.

## Rollup Plugins Overview

The Rollup configuration in this repository includes several plugins designed to streamline the process of building and packaging game configurations and modding packs. Below is an explanation of the current plugins and how they work:

### `buildConfigPlugin`

- **Purpose:** Packages configuration files into a ZIP archive.
- **Options:**
  - `inputDir`: The directory containing the configuration files to be packaged.
  - `outputDir`: The directory where the ZIP archive will be saved.
  - `packName`: The name of the resulting ZIP file.
- **Usage:**
  This plugin is used to bundle all configuration files (e.g., `.cfg`, `.ini`) into a single archive for easy distribution.
- **Example:**
  ```javascript
  buildConfigPlugin({
    inputDir: '../config',
    outputDir: 'dist',
    packName: 'config.zip',
  });
  ```

### `buildModPackPlugin`

- **Purpose:** Packages mod files into a ZIP archive.
- **Options:**
  - `inputDir`: The directory containing the mod files to be packaged.
  - `outputDir`: The directory where the ZIP archive will be saved.
  - `packName`: The name of the resulting ZIP file.
- **Usage:**
  This plugin is used to bundle all mod files into a single archive, making it easier to distribute mod packs.
- **Example:**
  ```javascript
  buildModPackPlugin({
    inputDir: '../mods',
    outputDir: 'dist',
    packName: 'modpack.zip',
  });
  ```

### `buildFullReleasePlugin`

- **Purpose:** Creates a comprehensive ZIP archive containing all essential folders for a full release.
- **Options:**
  - `outputDir`: The directory where the ZIP archive will be saved.
  - `packName`: The name of the resulting ZIP file.
  - `foldersToInclude`: An array of folder names to include in the archive.
- **Usage:**
  This plugin is used to create a complete release package, including configurations, mods, and documentation.
- **Example:**
  ```javascript
  buildFullReleasePlugin({
    outputDir: 'dist',
    packName: 'fullrelease.zip',
    foldersToInclude: ['configs', 'mods', 'docs'],
  });
  ```

### Adding New Plugins

To add a new plugin, follow these steps:
1. Create the plugin file in the `src` directory.
2. Import the plugin into the Rollup configuration file.
3. Add the plugin to the `plugins` array with the required options.

By leveraging these plugins, you can automate the packaging process and ensure consistency across different builds.

## License
MIT