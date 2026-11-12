# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
This file is based on the Semver-Model ('Added', 'Changed', 'Removed')

## [Unreleased]

## [2.0.0] - 2026-11-12

### Changed

- build: replace Rollup and Yarn with a plain Node 24 build (`npm run build`, `scripts/build.mjs`)
- build: `dist/` is cleaned before each build; ZIPs use forward slashes and skip `.gitkeep`
- ci: workflows are thin callers of the reusable workflows in `Gaming-Configs-Overdrive/.github` (`@v1`)
- ci: `publish-readme.yml` renamed to `pages.yml`; releases only run when `CHANGELOG.md` changes or manually
- docs: README (EN/DE) and `README.template.md` describe npm, `game.yml` and the installer `gco-install`

### Added

- `game.yml` manifest validated against `schema/game.schema.json` plus build rules (`npm run validate`)
- `dist/MODS.md` (mod list with sources and licenses) and `dist/SHA256SUMS`
- `docs/ARCHITECTURE.md` (shared contract) and `docs/GAME_MANIFEST.md` (manifest reference with engine examples)
- tests with `node:test` (`npm test`)
- `template-sync.yml`, `.templatesyncignore`, `renovate.json`, `_config.yml`, `.nvmrc`, `.prettierignore`

### Removed

- Rollup config, build plugins, `src/` utils and `yarn.lock`
- `docs/ROLLUP_CONFIGURATION.md`

## [1.0.0] - hello Champion

📦 build: initialize Game configuration project

### Added

- create initial project skeleton
