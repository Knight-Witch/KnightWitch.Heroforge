# Changelog

## 2026-07-03

### Added

- Added a Utilities tab as the final Witch Dock tab.
- Added toggle controls for Decals Scroll Guards and Expanded Decal Slots.
- Added a hidden HeroForge UI utility for Decals scroll guards.
- Added a hidden HeroForge UI bridge for conditional expanded decal slots when HF Core Tweaks is installed and detected.
- Added a runtime status object for decal slot expansion at `window.KW_HeroForgeUI.expandedDecalSlots` for quick console verification.

### Changed

- Scoped Decals scroll handling to the active Decals UI instead of globally styling HeroForge's reused `#menuC` and `#menuD` containers.
- Updated the scroll guard to identify the Decals source/object panel from exposed image labels such as Splatter and Decals, then pair it with the nearest slot grid below it.
- Updated the decal slot bridge to use `fetch()` for loading the expansion module from the live GitHub raw URL.
- Updated the slot bridge to respect the Utilities toggle before loading the expanded decal slot module.

### Fixed

- Fixed empty resizable zones appearing on non-Decals HeroForge tabs.
- Fixed Decals scroll targeting after HeroForge exposed source-panel names through labels instead of normal text content.
- Fixed the expanded decal slot bridge failing to load the expansion module from Witch Dock's dynamic manifest context.

### Notes

- The expanded decal slot utility is intentionally conditional. It only applies when the expected HF Core Tweaks decal-slot signature is present.
- Without HF Core Tweaks, the bridge remains a no-op.
- Witch Dock users receive these utilities through the live manifest after refreshing HeroForge.
- Some utilities can be disabled live; utilities that mutate HeroForge data may require a refresh to fully unload.

## Earlier Updates

Changelog started after the initial Witch Dock public setup. Earlier repo history contains the original Witch Dock install script, manifest loader, and visible dock tools for Body Editor, Pose, Booth, and JSON workflows.
