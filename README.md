# Game Config Skeleton

> [Deutsche Readme Version hier](./README.de.md)

<!-- TEMPLATE START -->

Template repository for game configs and mod packs of the
[Gaming-Configs-Overdrive](https://github.com/Gaming-Configs-Overdrive) org. Each
game repo describes its config files and mods in `game.yml`; the build validates
it and packs release ZIPs, the installer `gco-install` applies them.

## Features

- One manifest per game: [`game.yml`](./game.yml), validated against [`schema/game.schema.json`](./schema/game.schema.json).
- Plain Node build (`npm run build`), no bundler.
- Release ZIPs with checksums (`SHA256SUMS`) and a `MODS.md` mod list.
- `fullrelease.zip` ships the installer `gco-install` (added by the release workflow).
- Thin CI callers for the org's reusable workflows (lint, release, pages, template sync).

## Getting Started

1. Create a repo with "Use this template" and clone it.
2. Replace this `README.md` with `README.template.md` and customize it (also `README.de.md`).
3. Install dependencies (Node 24, see `.nvmrc`):
   ```bash
   npm install
   ```
4. Edit `game.yml` (see [docs/GAME_MANIFEST.md](./docs/GAME_MANIFEST.md)).
5. Add config files in `configs/` and bundled mods in `mods/<mod-id>/` (paths relative to the game root).
6. Write documentation in `docs/`.
7. Validate and build:
   ```bash
   npm run validate
   npm run build
   ```
8. Add a `## [x.y.z]` section to `CHANGELOG.md`; a push to `main` releases it.

## Build Output (`dist/`)

| File              | Content                                                                 |
| ----------------- | ----------------------------------------------------------------------- |
| `config.zip`      | Contents of `configs/` for manual installation.                         |
| `modpack.zip`     | All bundled mods merged, relative to the game root.                     |
| `fullrelease.zip` | `game.yml`, `configs/`, `mods/`, `docs/` (+ installer in releases).     |
| `MODS.md`         | All mods with version, source, license; `link` mods must be downloaded. |
| `SHA256SUMS`      | Checksums in `sha256sum` format.                                        |

## Installing a Release

1. Download and extract `fullrelease.zip` from the releases.
2. Run `install.bat` (Windows) or `install.sh` (Linux), or call the installer directly:
   ```bash
   gco-install install --variant <variant> --dry-run
   gco-install install --variant <variant>
   ```
3. Undo with `gco-install restore`.

## Folder Structure

- `configs/`: Game config files referenced by `game.yml`.
- `mods/`: Bundled mods, `mods/<mod-id>/<path relative to game root>`.
- `docs/`: Documentation; [ARCHITECTURE.md](./docs/ARCHITECTURE.md) is the shared contract, [GAME_MANIFEST.md](./docs/GAME_MANIFEST.md) the manifest reference.
- `schema/`: JSON schema for `game.yml`.
- `scripts/`: Build and validation scripts.
- `test/`: Tests (`npm test`).

## Additional Notes

- You can provide README files in multiple languages by following the format `README.[tld].md`, where `[tld]` is the language code (e.g., `README.de.md` for German).
- Please ensure that all language-specific READMEs are linked in the main `README.md` file.
- `npm run format` formats all files with Prettier.

<!-- TEMPLATE END -->

## License

MIT
