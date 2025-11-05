# Game Config Skeleton

> [Deutsche Readme Version hier](./README.de.md)

<!-- TEMPLATE START -->
This repository serves as a skeleton for creating and managing game configurations and modding packs. It supports building configurations for various games and deploying them for both Windows and macOS gaming with different sub-axis of pre-configuration.

## Features
- Modular structure for game-specific configs.
- Rollup integration for building configurations.
- Cross-platform deployment support.

## Getting Started
1. Clone the repository.
2. Replace this `README.md` with the `README.template.md` file and customize it for your project.
3. Install dependencies:
   ```bash
   yarn install
   ```
4. Add your game-specific configs in the `configs/` folder.
5. Add your mods and the needed folder structure in the `mods/` folder.
6. Write down documentation and instructions in the `docs/` folder. 
7. Build the configs:
   ```bash
   yarn run build
   ```

## Folder Structure
- `configs/`: Game-specific configuration files.
- `docs/`   : Documentation about scripts or instructions for configs or mods
- `mods/`   : Game-specific mod files for packing the modpack
- `src/`    : scripts and plugins for building or generation in rollup building

## Additional Notes
- You can provide README files in multiple languages by following the format `README.[tld].md`, where `[tld]` is the language code (e.g., `README.de.md` for German, `README.fr.md` for French).
- Please ensure that all language-specific READMEs are linked in the main `README.md` file.

<!-- TEMPLATE END -->

## License
MIT