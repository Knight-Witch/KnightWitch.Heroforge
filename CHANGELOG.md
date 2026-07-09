# Changelog

## DOCS-2026-07-09-002 — Baseline Architecture Backfill

Date: 2026-07-09
Time: 16:57 PDT

### Changed

- Expanded `MASTER.md` with current branch/release notes, loading model, directory roles, manifest IDs, status terms, and current watch items.
- Expanded `STYLE_KEYS.md` with baseline Witch Dock UI/style references and runtime UX constraints.
- Expanded `HISTORY/DECISIONS.md` with durable architecture decisions for live branch handling, manifest-driven loading, and standalone Tampermonkey canonical references.
- Expanded `HISTORY/BULLSHIT/MANIFEST_AND_LOADING.md` with the current load chain, manifest entries, storage/enablement notes, and branch/loading findings.
- Updated `PRE_FLIGHT_Check.md` and `HISTORY/SESSION_LOG.md` for this baseline documentation pass.

### Touched Files

- `MASTER.md`
- `STYLE_KEYS.md`
- `HISTORY/DECISIONS.md`
- `HISTORY/BULLSHIT/MANIFEST_AND_LOADING.md`
- `PRE_FLIGHT_Check.md`
- `HISTORY/SESSION_LOG.md`
- `CHANGELOG.md`

### Rollback Notes

- Docs-only baseline backfill.
- No JavaScript files changed.
- No `manifest.json` changes.
- No runtime behavior affected.

### Test Notes

- Not applicable. Documentation-only update.

## DOCS-2026-07-09-001 — Documentation Architecture Scaffold

Date: 2026-07-09
Time: 16:03 PDT

### Added

- Added root project tracking files: `MASTER.md`, `PRE_FLIGHT_Check.md`, and `STYLE_KEYS.md`.
- Added `HISTORY/` documentation structure for session logs, durable decisions, and HeroForge engine notes.
- Added `HISTORY/Bullshit_Bible.md` as the high-level index for fragile HeroForge behavior discoveries.
- Added segmented `HISTORY/BULLSHIT/` topic files for timing/state, DOM/layout, decals/textures, booth/renders/exports, kitbashing/bones, JSON/library, and manifest/loading.
- Added `DIFFS/README.md`, `ASSETS/README.md`, and `BACKUP_VAULT/README.md` to establish optional patch, asset, and major-refactor backup locations.

### Changed

- Updated `README.md` with a Project Tracking section linking to the new documentation structure.

### Touched Files

- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `STYLE_KEYS.md`
- `HISTORY/README.md`
- `HISTORY/SESSION_LOG.md`
- `HISTORY/DECISIONS.md`
- `HISTORY/Bullshit_Bible.md`
- `HISTORY/BULLSHIT/TIMING_AND_STATE.md`
- `HISTORY/BULLSHIT/DOM_AND_LAYOUT.md`
- `HISTORY/BULLSHIT/DECALS_AND_TEXTURES.md`
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
- `HISTORY/BULLSHIT/KITBASHING_AND_BONES.md`
- `HISTORY/BULLSHIT/JSON_AND_LIBRARY.md`
- `HISTORY/BULLSHIT/MANIFEST_AND_LOADING.md`
- `DIFFS/README.md`
- `ASSETS/README.md`
- `BACKUP_VAULT/README.md`
- `README.md`
- `CHANGELOG.md`

### Rollback Notes

- Docs-only scaffold. No JavaScript files changed.
- No `manifest.json` changes.
- No runtime behavior affected.

### Test Notes

- Not applicable. Documentation-only update.

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
