# Game Config Skeleton

> [Englische Readme Version hier](./README.md)

<!-- TEMPLATE START -->
Dieses Repository dient als Grundgerüst für die Erstellung und Verwaltung von Spielkonfigurationen und Modding-Paketen. Es unterstützt das Erstellen von Konfigurationen für verschiedene Spiele und deren Bereitstellung für Windows- und macOS-Gaming mit verschiedenen Unterkategorien der Vorkonfiguration.

## Features
- Modulare Struktur für spielspezifische Konfigurationen.
- Rollup-Integration zum Erstellen von Konfigurationen.
- Plattformübergreifende Bereitstellungsunterstützung.

## Erste Schritte
1. Repository klonen.
2. Diese `README.md` durch die `README.template.md` Datei ersetzen und für Ihr Projekt anpassen.
3. Abhängigkeiten installieren:
   ```bash
   yarn install
   ```
4. Ihre spielspezifischen Konfigurationen im `configs/` Ordner hinzufügen.
5. Ihre Mods und die benötigte Ordnerstruktur im `mods/` Ordner hinzufügen.
6. Dokumentation und Anleitungen im `docs/` Ordner verfassen.
7. Konfigurationen erstellen:
   ```bash
   yarn run build
   ```

## Ordnerstruktur
- `configs/`: Spielspezifische Konfigurationsdateien.
- `docs/`   : Dokumentation über Skripte oder Anleitungen für Konfigurationen oder Mods
- `mods/`   : Spielspezifische Mod-Dateien zum Verpacken des Modpacks
- `src/`    : Skripte und Plugins für das Erstellen oder Generieren im Rollup-Build

## Zusätzliche Hinweise
- Sie können README-Dateien in mehreren Sprachen bereitstellen, indem Sie dem Format `README.[tld].md` folgen, wobei `[tld]` der Sprachcode ist (z.B. `README.de.md` für Deutsch, `README.fr.md` für Französisch).
- Bitte stellen Sie sicher, dass alle sprachspezifischen READMEs in der Haupt-`README.md` Datei verlinkt sind.

<!-- TEMPLATE END -->

## Lizenz
MIT