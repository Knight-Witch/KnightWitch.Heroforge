# Changelog

## DOCS-2026-07-09-005 — Persistent Booth Status Clarification

Date: 2026-07-09
Time: 18:18 PDT

### Changed

- Updated `MASTER.md` to explicitly state that Persistent Booth is live/working and separate from the unresolved Photo Mode PNG Series Capture feature.
- Updated `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md` to mark Persistent Booth as completed, retain v12/v13 notes as historical diagnostics, and prevent future PNG-capture scoping from treating Persistent Booth as an open rebuild.
- Updated `PRE_FLIGHT_Check.md` and `HISTORY/SESSION_LOG.md` for this clarification pass.

### Touched Files

- `MASTER.md`
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
- `PRE_FLIGHT_Check.md`
- `HISTORY/SESSION_LOG.md`
- `CHANGELOG.md`

### Rollback Notes

- Docs-only correction.
- No JavaScript files changed.
- No `manifest.json` changes.
- No runtime behavior affected.

### Test Notes

- Not applicable. Documentation-only update.

## DOCS-2026-07-09-004 — Decals and Photo Capture History Backfill

Date: 2026-07-09
Time: 18:03 PDT

### Changed

- Expanded `HISTORY/Bullshit_Bible.md` with high-risk summaries for Decals three-layout scroll behavior and unfinished Photo Mode PNG series capture.
- Expanded `MASTER.md` with planned/unresolved Photo Mode PNG Series Capture status, migration queue notes, watch items, and rejected assumptions.
- Expanded `HISTORY/DECISIONS.md` with durable decisions for Decals three-layout support and Photo Mode capture preserving HeroForge's booth render path.
- Expanded `HISTORY/BULLSHIT/DOM_AND_LAYOUT.md` with detailed Decals UI layout history for right-side grouped, right/left split, and bottom compact setups.
- Expanded `HISTORY/BULLSHIT/DECALS_AND_TEXTURES.md` with detailed Decals scroll/slot behavior notes, split-safe behavior, bottom horizontal overflow, attribute-text targeting, and utility separation.
- Expanded `HISTORY/BULLSHIT/TIMING_AND_STATE.md` with PNG-series render-state gating notes, early 512x512 capture warning, one-frame-per-rAF guidance, and WebGL readPixels timing/post-processing notes.
- Expanded `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md` with Booth persistence history, v12/v13 notes, tokenBg backdrop findings, official exporter observation, v0.7 probe behavior, browser capture limits, readPixels partial success, and current unresolved PNG-series capture problem.
- Updated `PRE_FLIGHT_Check.md` and `HISTORY/SESSION_LOG.md` for this history backfill pass.

### Touched Files

- `MASTER.md`
- `HISTORY/Bullshit_Bible.md`
- `HISTORY/DECISIONS.md`
- `HISTORY/BULLSHIT/TIMING_AND_STATE.md`
- `HISTORY/BULLSHIT/DOM_AND_LAYOUT.md`
- `HISTORY/BULLSHIT/DECALS_AND_TEXTURES.md`
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
- `PRE_FLIGHT_Check.md`
- `HISTORY/SESSION_LOG.md`
- `CHANGELOG.md`

### Rollback Notes

- Docs-only history backfill.
- No JavaScript files changed.
- No `manifest.json` changes.
- No runtime behavior affected.
- PNG-series capture remains explicitly unresolved; this pass documents findings and constraints only.

### Test Notes

- Not applicable. Documentation-only update.

## DOCS-2026-07-09-003 — Live Tool Documentation Backfill

Date: 2026-07-09
Time: 17:22 PDT

### Changed

- Expanded `MASTER.md` with current live tool notes for Witch Dock core, Body Editor, Pose, Booth, JSON Tool, Utilities, and hidden HeroForge UI utilities.
- Expanded `HISTORY/BULLSHIT/TIMING_AND_STATE.md` with current-source timing notes for bone detection, Decals scroll retargeting, and Booth runtime loop behavior.
- Expanded `HISTORY/BULLSHIT/DOM_AND_LAYOUT.md` with current-source layout notes for reused HeroForge menu containers, Decals menu targeting, and Witch Dock overlay constraints.
- Expanded `HISTORY/BULLSHIT/DECALS_AND_TEXTURES.md` with current-source notes for Decals scroll guards, HF Core Tweaks signature dependency, current slot target, and target part IDs.
- Expanded `HISTORY/BULLSHIT/KITBASHING_AND_BONES.md` with current-source notes for summon-circle probing, baseline/delta bone detection, and Body Editor joint key mappings.
- Expanded `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md` with current-source notes for Booth build tag, debug helpers, runtime loop state, tokenizer/UI mode detection, and persistence behavior.
- Expanded `HISTORY/BULLSHIT/JSON_AND_LIBRARY.md` with current-source notes for config-service endpoints, readiness waiting, JSZip usage, folder/mark mapping, and failure records.
- Updated `PRE_FLIGHT_Check.md` and `HISTORY/SESSION_LOG.md` for this live tool documentation pass.

### Touched Files

- `MASTER.md`
- `HISTORY/BULLSHIT/TIMING_AND_STATE.md`
- `HISTORY/BULLSHIT/DOM_AND_LAYOUT.md`
- `HISTORY/BULLSHIT/DECALS_AND_TEXTURES.md`
- `HISTORY/BULLSHIT/KITBASHING_AND_BONES.md`
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
- `HISTORY/BULLSHIT/JSON_AND_LIBRARY.md`
- `PRE_FLIGHT_Check.md`
- `HISTORY/SESSION_LOG.md`
- `CHANGELOG.md`

### Rollback Notes

- Docs-only live tool backfill.
- No JavaScript files changed.
- No `manifest.json` changes.
- No runtime behavior affected.
- Notes are based on current source, not full old-chat recovery.

### Test Notes

- Not applicable. Documentation-only update.

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
