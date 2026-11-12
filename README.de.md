# Game Config Skeleton

> [Englische Readme Version hier](./README.md)

<!-- TEMPLATE START -->

Template-Repository für Spielkonfigurationen und Mod-Pakete der Org
[Gaming-Configs-Overdrive](https://github.com/Gaming-Configs-Overdrive). Jedes
Spiel-Repo beschreibt seine Konfigurationsdateien und Mods in `game.yml`; der Build
validiert sie und packt Release-ZIPs, der Installer `gco-install` wendet sie an.

## Features

- Ein Manifest pro Spiel: [`game.yml`](./game.yml), validiert gegen [`schema/game.schema.json`](./schema/game.schema.json).
- Schlanker Node-Build (`npm run build`), kein Bundler.
- Release-ZIPs mit Prüfsummen (`SHA256SUMS`) und Mod-Liste `MODS.md`.
- `fullrelease.zip` enthält den Installer `gco-install` (fügt der Release-Workflow hinzu).
- Dünne CI-Caller für die Reusable Workflows der Org (Lint, Release, Pages, Template-Sync).

## Erste Schritte

1. Repo per „Use this template“ anlegen und klonen.
2. Diese `README.md` durch `README.template.md` ersetzen und anpassen (ebenso `README.de.md`).
3. Abhängigkeiten installieren (Node 24, siehe `.nvmrc`):
   ```bash
   npm install
   ```
4. `game.yml` bearbeiten (siehe [docs/GAME_MANIFEST.md](./docs/GAME_MANIFEST.md), Englisch).
5. Konfigurationsdateien in `configs/` und gebündelte Mods in `mods/<mod-id>/` ablegen (Pfade relativ zum Spielordner).
6. Dokumentation in `docs/` schreiben.
7. Validieren und bauen:
   ```bash
   npm run validate
   npm run build
   ```
8. Einen Abschnitt `## [x.y.z]` in `CHANGELOG.md` ergänzen; ein Push auf `main` erzeugt das Release.

## Build-Ergebnis (`dist/`)

| Datei             | Inhalt                                                                    |
| ----------------- | ------------------------------------------------------------------------- |
| `config.zip`      | Inhalt von `configs/` zur manuellen Installation.                         |
| `modpack.zip`     | Alle gebündelten Mods zusammengeführt, relativ zum Spielordner.           |
| `fullrelease.zip` | `game.yml`, `configs/`, `mods/`, `docs/` (+ Installer im Release).        |
| `MODS.md`         | Alle Mods mit Version, Quelle, Lizenz; `link`-Mods muss man selbst laden. |
| `SHA256SUMS`      | Prüfsummen im `sha256sum`-Format.                                         |

## Release installieren

1. `fullrelease.zip` aus den Releases herunterladen und entpacken.
2. `install.bat` (Windows) bzw. `install.sh` (Linux) starten oder den Installer direkt aufrufen:
   ```bash
   gco-install install --variant <variante> --dry-run
   gco-install install --variant <variante>
   ```
3. Rückgängig machen mit `gco-install restore`.

## Ordnerstruktur

- `configs/`: Konfigurationsdateien, auf die `game.yml` verweist.
- `mods/`: Gebündelte Mods, `mods/<mod-id>/<Pfad relativ zum Spielordner>`.
- `docs/`: Dokumentation; [ARCHITECTURE.md](./docs/ARCHITECTURE.md) ist der gemeinsame Vertrag, [GAME_MANIFEST.md](./docs/GAME_MANIFEST.md) die Manifest-Referenz.
- `schema/`: JSON-Schema für `game.yml`.
- `scripts/`: Build- und Validierungsskripte.
- `test/`: Tests (`npm test`).

## Zusätzliche Hinweise

- Sie können README-Dateien in mehreren Sprachen bereitstellen, indem Sie dem Format `README.[tld].md` folgen, wobei `[tld]` der Sprachcode ist (z. B. `README.de.md` für Deutsch).
- Bitte stellen Sie sicher, dass alle sprachspezifischen READMEs in der Haupt-`README.md` verlinkt sind.
- `npm run format` formatiert alle Dateien mit Prettier.

<!-- TEMPLATE END -->

## Lizenz

MIT
