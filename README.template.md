[![Release](INSERT_BADGE_URL)](INSERT_BADGE_LINK)
[![Lint](INSERT_BADGE_URL)](INSERT_BADGE_LINK)
[![Pages](INSERT_BADGE_URL)](INSERT_BADGE_LINK)

# <INSERT_PROJECT_NAME>

> [Deutsche Readme Version hier](./README.de.md)
>
> [Release Changelog](./CHANGELOG.md)

<INSERT_PROJECT_DESCRIPTION>

## What is this about?

- **<INSERT_FILE_NAME>:**  
  <INSERT_FILE_DESCRIPTION>

Variants: <INSERT_VARIANTS> (see `variants` in [game.yml](./game.yml)).

## Installing (recommended)

1. Download `fullrelease.zip` from the [Releases](INSERT_RELEASE_LINK) and extract it.
2. Close the game.
3. Run `install.bat` (Windows) or `install.sh` (Linux/Steam Deck), or use the installer directly:
   ```bash
   gco-install install --variant <INSERT_VARIANT> --dry-run
   gco-install install --variant <INSERT_VARIANT>
   ```
   The installer detects the game (Steam/Epic/GOG, Proton), shows a plan and backs up every file it touches.
4. Undo everything with `gco-install restore`.

## Installing manually

1. Download `config.zip` (configs) and, if needed, `modpack.zip` (mods, relative to the game folder).
2. Copy the config files to:
   `<INSERT_PATH>`
3. Extract `modpack.zip` into the game folder.
4. Download the mods listed as `link` in `MODS.md` from their source.

Verify downloads with `sha256sum -c SHA256SUMS`.

## Launch Options

Add the following in the game's launch options:
`<INSERT_LAUNCH_OPTIONS>`

| Command            | Description          |
| ------------------ | -------------------- |
| `<INSERT_COMMAND>` | <INSERT_DESCRIPTION> |

## Mods

See `MODS.md` in the release for versions, sources and licenses.

## General Advice

- If you experience performance issues or poor visuals, try simpler variants first. If your PC is more powerful, move on to higher quality variants.
- Game updates can reset config files; run the installer again after a patch.

## Development

```bash
npm install
npm run validate
npm run build
npm test
```

Manifest reference: [docs/GAME_MANIFEST.md](./docs/GAME_MANIFEST.md).
