# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
This file is based on the Semver-Model ('Added', 'Changed', 'Removed')

## [Unreleased]

### Fixed

- build: `yarn build` runs again (missing `src/index.js` entry, bare/extensionless imports, paths resolved from `src/` instead of the repo root, wrong `../config` input dir)
- build: ZIPs keep the folder structure, contain the real file contents and exclude `.gitkeep`; missing input folders are skipped with a warning
- ci(release): upload ZIPs from `dist/`, first release works without a previous tag, archived `actions/create-release` replaced by `gh release create`, `actions/setup-node@v4`
- ci(lint): fix `find` precedence for YAML, lint all `.ini` files, skip `node_modules` and lint every JSON file

## [1.0.0] - hello Champion

📦 build: initialize Game configuration project

### Added

- create initial project skeleton