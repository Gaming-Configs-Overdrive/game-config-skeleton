# Architecture contract

Shared contract between `game-config-skeleton`, the org `.github` repo (reusable
workflows) and `game-config-installer`. Change it here first.

## Manifest

Every game repo has a `game.yml` in its root, validated against
`schema/game.schema.json` (JSON Schema 2020-12). It describes stores, detection,
variants, config files (`files[]`) and mods (`mods`).

Path variables in `files[].target`: `{GAME_DIR}` `{LOCALAPPDATA}` `{APPDATA}`
`{LOCALLOW}` `{DOCUMENTS}` `{SAVED_GAMES}` `{USERPROFILE}` `{STEAM_USERDATA}`
(`<steam>/userdata/<steamid3>`) `{UE_PLATFORM}` (`Windows` or `WinGDK`).
`{variant}` is allowed in `files[].src`. Under Proton the installer maps the
Windows variables into `steamapps/compatdata/<appid>/pfx/drive_c/users/steamuser/…`.

Bundled mods live in `mods/<mod-id>/` with paths relative to the game root
(Vortex/MO2 layout). Every path must start with an entry of `mods.layout`.
Mods with `distribute: link` are never rehosted; only listed in `MODS.md`.

## Build (`npm run build`, Node 24)

1. Validate `game.yml` (schema + rules: `src` files exist for every variant,
   bundled mods match `layout`, `online: true` forbids `onlineRisk: ban-reported`
   and `risk: injector`).
2. Clean `dist/` (keep `.gitkeep`).
3. Write `dist/config.zip` (`configs/`), `dist/modpack.zip` (all `mods/<id>/`
   merged, game-root relative), `dist/fullrelease.zip` (`game.yml`, `configs/`,
   `mods/`, `docs/`), `dist/MODS.md`, `dist/SHA256SUMS`.

## Release (reusable workflow `game-release.yml` in `Gaming-Configs-Overdrive/.github`)

Version = first `## [x.y.z]` heading in `CHANGELOG.md`. Skipped if tag `vX.Y.Z`
exists. Builds, adds installer binaries (`gco-install.exe`, `gco-install`) and
wrappers (`install.bat`, `install.sh`) from `game-config-installer` to the
root of `fullrelease.zip`, regenerates `SHA256SUMS`, attests provenance, creates
the GitHub release with the changelog section as notes.

## Installer (`gco-install`)

`gco-install [install|restore|status|detect] [--variant X] [--dry-run]
[--game-dir PATH] [--manifest PATH] [--yes]`. Reads `game.yml` next to the
binary by default. Detects Steam/Epic/GOG (+ Proton on Linux), shows a plan,
backs up every touched file, writes atomically, records state in
`%LOCALAPPDATA%\gaming-configs-overdrive\<id>\` or
`~/.local/state/gaming-configs-overdrive/<id>/`. No network, no admin, no paths
outside resolved roots.
