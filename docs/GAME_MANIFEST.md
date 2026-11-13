# Game manifest (`game.yml`)

Every game repo describes its configs and mods in `game.yml` in the repo root.
It is validated against [`schema/game.schema.json`](../schema/game.schema.json)
(JSON Schema 2020-12) by `npm run validate` and `npm run build`, and read by the
installer `gco-install`. The shared contract is
[`docs/ARCHITECTURE.md`](./ARCHITECTURE.md).

Minimal manifest:

```yaml
schema: 1
id: example-game
name: Example Game
online: false
files: []
```

## Top-level fields

| Field         | Required | Description                                                                                        |
| ------------- | -------- | -------------------------------------------------------------------------------------------------- |
| `schema`      | yes      | Manifest version, always `1`.                                                                      |
| `id`          | yes      | Lowercase id (`a-z0-9-`), used for installer state folders.                                        |
| `name`        | yes      | Display name.                                                                                      |
| `online`      | yes      | Game has online play / anti-cheat. `true` forbids `onlineRisk: ban-reported` and `risk: injector`. |
| `gameVersion` | no       | Tested game version range, free text, e.g. `">=2.3 <2.4"`.                                         |
| `stores`      | no       | `steam.appid` (int), `epic.appName` + `epic.catalogItemId`, `gog.id` (string), `xbox.folder`.      |
| `detect.exe`  | no       | Path relative to `{GAME_DIR}` that must exist to accept a detected install.                        |
| `processes`   | no       | Process names that must not be running during install.                                             |
| `variants`    | no       | Selectable variants (`a-z0-9-`). The first one is the default. Use `{variant}` in `files[].src`.   |
| `files`       | yes      | Config files to install, see below.                                                                |
| `mods`        | no       | `layout` (allowed install roots relative to `{GAME_DIR}`) and `items` (mods), see below.           |
| `notes`       | no       | `launchOptions`, `linux`, `general`: free text shown by the installer and docs.                    |

## `files[]`

| Field           | Required | Values / default                                       | Description                                                                           |
| --------------- | -------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| `src`           | yes      |                                                        | Payload path relative to the repo root, may contain `{variant}`.                      |
| `target`        | yes      |                                                        | Destination with path variables; for `registry`: `HKCU/Software/<Company>/<Product>`. |
| `format`        | yes      | `ini` `json` `kv` `xml` `registry` `opaque`            | How the file is parsed for merging. `opaque` = bytes, no parsing.                     |
| `strategy`      | yes      | `merge` `replace` `create-if-missing`                  | See [Strategies](#strategies).                                                        |
| `encoding`      | no       | `auto` `utf8` `utf8-bom` `utf16le-bom`, default `auto` | Encoding of the target file.                                                          |
| `readOnly`      | no       | default `false`                                        | Mark the target read-only after writing (stops the game from resetting it).           |
| `survivesPatch` | no       | default `true`                                         | `false` if game updates overwrite the file (re-run the installer).                    |
| `cloudSynced`   | no       | default `false`                                        | Target is synced by Steam Cloud or similar and may be overwritten.                    |
| `onlineRisk`    | no       | `none` `tos` `ban-reported`, default `none`            | See [Online games](#online-games-online-onlinerisk-risk).                             |
| `variants`      | no       | default: all                                           | Only install this file for these variants.                                            |

`npm run validate` checks that `src` exists for every variant it is installed for
and stays inside the repository.

### Path variables

| Variable           | Windows                                                               |
| ------------------ | --------------------------------------------------------------------- |
| `{GAME_DIR}`       | Detected install folder (Steam/Epic/GOG) or `--game-dir`.             |
| `{LOCALAPPDATA}`   | `%LOCALAPPDATA%`                                                      |
| `{APPDATA}`        | `%APPDATA%`                                                           |
| `{LOCALLOW}`       | `%USERPROFILE%\AppData\LocalLow`                                      |
| `{DOCUMENTS}`      | The user's Documents folder                                           |
| `{SAVED_GAMES}`    | `%USERPROFILE%\Saved Games`                                           |
| `{USERPROFILE}`    | `%USERPROFILE%`                                                       |
| `{STEAM_USERDATA}` | `<steam>/userdata/<steamid3>`                                         |
| `{UE_PLATFORM}`    | Unreal config platform folder: `Windows` or `WinGDK` (Xbox/Game Pass) |

Under Proton the installer maps the Windows variables into
`steamapps/compatdata/<appid>/pfx/drive_c/users/steamuser/…`. Always use `/` in
manifests.

### Strategies

- `merge`: parse the target with `format`, set only the keys from `src`, keep everything else.
- `replace`: overwrite the target with `src`.
- `create-if-missing`: write `src` only if the target does not exist.

The installer backs up every touched file before writing (`gco-install restore`).

## `mods`

```yaml
mods:
  layout: [archive/pc/mod, r6/scripts] # allowed roots relative to {GAME_DIR}
  items:
    - id: my-tweak # files in mods/my-tweak/<layout path>/…
      name: My Tweak
      version: 1.0.0
      source: { type: local }
      license: MIT
      distribute: bundle
    - id: tweakxl
      name: TweakXL
      version: 1.10.0
      source: { type: github, repo: psiberx/cp2077-tweak-xl }
      license: MIT
      distribute: link
      requires: [red4ext]
      notes: Install via the release ZIP.
```

| Field        | Required | Description                                                                                                                           |
| ------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `id`         | yes      | Lowercase id; bundled files live in `mods/<id>/`.                                                                                     |
| `name`       | yes      | Display name.                                                                                                                         |
| `version`    | no       | Mod version.                                                                                                                          |
| `source`     | yes      | `type`: `local`, `github` (`repo`, `asset`), `nexus` (`modId`, `fileId`), `url` (`url`).                                              |
| `sha256`     | no       | Expected hash of the downloaded file.                                                                                                 |
| `license`    | yes      | License or permission note.                                                                                                           |
| `distribute` | yes      | `bundle` (own mods or explicit redistribution permission, `source.type: local`) or `link` (never rehosted, only listed in `MODS.md`). |
| `requires`   | no       | Other mod ids, optionally with version: `tweakxl@>=1.10`.                                                                             |
| `risk`       | no       | `none` (default) or `injector` (DLL proxy, ReShade addon, upscaler swap).                                                             |
| `optional`   | no       | Default `false`.                                                                                                                      |
| `notes`      | no       | Free text, shown in `MODS.md`.                                                                                                        |

Every folder in `mods/` must be a declared `bundle` mod, and every bundled file must
start with an entry of `mods.layout`. `dist/modpack.zip` merges all bundled mods
relative to the game root.

## Online games (`online`, `onlineRisk`, `risk`)

Set `online: true` for games with online play or anti-cheat. The build then fails
for files with `onlineRisk: ban-reported` and mods with `risk: injector`.

| `onlineRisk`   | Meaning                                                           | Examples                                                                                                                                                                                                                                          |
| -------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `none`         | Engine feature, intended by the developer.                        | CS2 `autoexec.cfg` and launch options.                                                                                                                                                                                                            |
| `tos`          | Grey zone: terms forbid unauthorized file changes, no known bans. | Apex Legends `autoexec.cfg` / `videoconfig.txt`.                                                                                                                                                                                                  |
| `ban-reported` | Officially forbidden or reported bans.                            | Marvel Rivals ini edits ([official notice](https://www.marvelrivals.com/guide/20250226/41348_1214569.html)), Sea of Thieves install-folder edits ([Code of Conduct](https://athsupport-rare-prd.web.msrareservices.com/articles/24643308439314)). |

Injectors (ReShade addons, OptiScaler, DLL proxies) are always `risk: injector` and
therefore not allowed in online games.

## Engine examples

Paths marked **verify per game** are typical for the engine but differ between
games; check them on a real install before shipping.

### Unreal Engine: `Engine.ini` merge, read-only

```yaml
variants: [balanced, performance]
files:
  - src: configs/{variant}/Engine.ini
    # verify per game: <Project> is the game's internal project name
    target: '{LOCALAPPDATA}/<Project>/Saved/Config/{UE_PLATFORM}/Engine.ini'
    format: ini
    strategy: merge
    readOnly: true # the game rewrites Engine.ini on exit otherwise
```

### Source 2: `autoexec.cfg` replace + launch options

```yaml
stores:
  steam: { appid: 730 }
files:
  - src: configs/autoexec.cfg
    target: '{GAME_DIR}/game/csgo/cfg/autoexec.cfg' # CS2; verify per game
    format: kv
    strategy: replace
notes:
  launchOptions: '+exec autoexec'
```

### REDengine (Cyberpunk 2077): own `.ini` + `UserSettings.json` merge

```yaml
stores:
  steam: { appid: 1091500 }
  gog: { id: '1423049311' }
  epic: { appName: Ginger, catalogItemId: 5beededaad9743df90e8f07d92df153f }
detect:
  exe: bin/x64/Cyberpunk2077.exe
files:
  - src: configs/gco.ini # own file, the game loads every .ini in this folder
    target: '{GAME_DIR}/engine/config/platform/pc/gco.ini'
    format: ini
    strategy: replace
    survivesPatch: false
  - src: configs/{variant}/UserSettings.json
    target: '{LOCALAPPDATA}/CD Projekt Red/Cyberpunk 2077/UserSettings.json' # same for all stores
    format: json
    strategy: merge
```

Use the Epic `catalogItemId` above, not the namespace id (`77f2b98e…`).

### Unity: registry (PlayerPrefs)

```yaml
files:
  - src: configs/{variant}/playerprefs.json # key/value payload, see the installer docs
    # verify per game: company and product name from the game's Unity build
    target: HKCU/Software/<Company>/<Product>
    format: registry
    strategy: merge
```

Unity appends a hash suffix to PlayerPrefs value names (e.g. `Screenmanager Fullscreen mode_h3630240806`); verify per game.

### Creation Engine 2 (Starfield): `StarfieldCustom.ini`

```yaml
files:
  - src: configs/StarfieldCustom.ini
    target: '{DOCUMENTS}/My Games/Starfield/StarfieldCustom.ini'
    format: ini
    strategy: merge
```

### id Tech: `*Config.local`

```yaml
files:
  - src: configs/DOOMEternalConfig.local # lines like: r_swapInterval "0"
    target: '{SAVED_GAMES}/id Software/DOOMEternal/base/DOOMEternalConfig.local'
    format: kv
    strategy: merge
```

Source: [Bethesda support](https://help.bethesda.net/app/answers/detail/a_id/53109).
DOOM: The Dark Ages uses `{SAVED_GAMES}/id Software/DOOMTheDarkAges/base/DOOMTheDarkAgesConfig.local`
(file name verify per game), Indiana Jones and the Great Circle
`{SAVED_GAMES}/MachineGames/TheGreatCircle/base/TheGreatCircleConfig.local`.

### Decima (Horizon Forbidden West): registry

```yaml
files:
  - src: configs/{variant}/registry.json # DWORD values
    target: HKCU/Software/Guerrilla Games/Horizon Forbidden West Complete Edition
    format: registry
    strategy: merge
```

Source: [PCGamingWiki](https://www.pcgamingwiki.com/wiki/Horizon_Forbidden_West).

### Anvil (Assassin's Creed Shadows): ini

```yaml
files:
  - src: configs/ACShadows.ini
    target: "{DOCUMENTS}/Assassin's Creed Shadows/ACShadows.ini"
    format: ini
    strategy: merge
```

Source: [PCGamingWiki](https://www.pcgamingwiki.com/wiki/Assassin%27s_Creed_Shadows).
Mirage and Valhalla work the same way (verify per game).

### Snowdrop (Star Wars Outlaws, The Division 2): opaque replace

```yaml
files:
  - src: configs/{variant}/graphic settings.cfg
    target: '{DOCUMENTS}/My Games/Outlaws/graphic settings.cfg'
    format: opaque
    strategy: replace
```

Limitation: the file uses Lua table syntax (`sharpen2 = 1.0000000,`,
`["taa"] = 3,`), which the `kv` adapter does not support. Ship the whole file
with `opaque` + `replace`. The Division 1 used XML instead.

### RE Engine: ini in the game folder

```yaml
files:
  - src: configs/local_config.ini # Resident Evil 4 (2023)
    target: '{GAME_DIR}/local_config.ini'
    format: ini
    strategy: merge
    survivesPatch: false
```

Source: [Capcom support](https://www.capcom-support.com/hc/en-us/articles/8192772494108).
Monster Hunter Wilds uses `{GAME_DIR}/config.ini` with sections (same settings).
