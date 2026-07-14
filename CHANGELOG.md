# Changelog

## DOCS-2026-07-14-010 — Advanced Lighting Probe v0.6 Static Shadow Texture Correction

Date: 2026-07-14
Time: 16:40 PDT

### Changed

- Updated `MASTER.md` with the validated v0.6 result, corrected shadow-path status, revised active tasks, migration notes, watch items, and rejected assumptions.
- Updated `HISTORY/Bullshit_Bible.md` with the v0.6 correction that the traced `additionalSunShadowMap` textures are static environment-shadow image assets rather than the dynamic native sun-shadow path.
- Updated `HISTORY/BULLSHIT/LIGHTING_AND_EXTRA_LIGHTS.md` with the complete v0.6 controlled-test result, corrected `additionalSunShadowMap` interpretation, revised shadow-pipeline diagnosis, probe-split scope, and next investigation order.
- Updated `HISTORY/STANDALONE_REFERENCES.md` to mark Injection Probe v0.6.0 as a completed diagnostic correction milestone and record the exact static texture assets it identified.
- Updated `HISTORY/SESSION_LOG.md` with the controlled v0.6 test sequence, results, correction, and next investigation target.
- Updated `PRE_FLIGHT_Check.md` with the v0.6 result checkpoint, connected systems reviewed, conflict risks, and recommended next action.

### Confirmed / Corrected Documentation

- Confirmed the two traced `additionalSunShadowMap` textures are ordinary 512x512 `HTMLImageElement`-backed textures loaded from `summonCircle_shadow_512.webp` and `foliage_shadow_512.webp`.
- Confirmed those texture UUIDs, versions, dimensions, asset paths, and material bindings remained unchanged through baseline -> native-sun override -> restore.
- Confirmed the native `sun.shadow.map`, native shadow matrix, material shadow states, detailed bindings, resource trace, and captured texture-diagnostic structures also remained unchanged while the native sun position/intensity/color changed and then returned to baseline.
- Corrected the earlier working hypothesis that the traced `additionalSunShadowMap` resources might be the dynamic visible native sun-shadow textures.
- Recorded the strong current inference that direct native-sun mutation changes visible illumination without regenerating the native shadow projection/map; restoring the original sun transform realigns the unchanged shadow data, explaining why visible shadows return without a captured shadow-resource change.
- Recorded that the next focused Shadow Pipeline Probe should target the actual native `sun.shadow` update/render lifecycle and legitimate HeroForge lighting-state transitions.

### Touched Files

- `MASTER.md`
- `HISTORY/Bullshit_Bible.md`
- `HISTORY/BULLSHIT/LIGHTING_AND_EXTRA_LIGHTS.md`
- `HISTORY/STANDALONE_REFERENCES.md`
- `HISTORY/SESSION_LOG.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Rollback Notes

- Documentation-only checkpoint and correction.
- No JavaScript files changed.
- No standalone userscript probe files changed.
- No `manifest.json` changes.
- No storage keys, UI, styles, APIs, globals, or runtime behavior changed.
- Rolling back would restore the superseded interpretation that the traced `additionalSunShadowMap` textures might be part of the unresolved dynamic native sun-shadow pipeline.

### Test Notes

- Runtime evidence came from `HF_Lighting_Injection_Probe_v0.6.0_2026-07-14T23-37-19-231Z.json`.
- Controlled sequence: enter Photo Booth with native shadows visible, inject the custom DirectionalLight with pre-attach shadows, run only the native-sun shadow comparison round, and download the report.
- Probe report contained no recorded errors.
- No Witch Dock or Persistent Booth runtime test was part of this checkpoint.

## DOCS-2026-07-13-009 — Advanced Lighting v0.4-v0.6 Documentation Correction

Date: 2026-07-13
Time: 19:12 PDT

### Added

- Added `HISTORY/BULLSHIT/LIGHTING_AND_EXTRA_LIGHTS.md` as the canonical combined sub-project specification and technical history for Advanced Lighting / Extra Lights.
- Added a durable probe-cleanup plan: after the v0.6 diagnostic result is reviewed, split the cumulative harness into a compact Lighting Injection Reference and a focused Shadow Pipeline Probe.
- Added the future integration direction: a separate `/tools/` lighting module intended to register into the Booth tab while keeping experimental lighting runtime logic separate from `tools/Booth.js` and Persistent Booth.

### Changed

- Replaced the narrower `HISTORY/BULLSHIT/LIGHTING_AND_SHADOWS.md` documentation model with `HISTORY/BULLSHIT/LIGHTING_AND_EXTRA_LIGHTS.md` so one dedicated file tracks project goals, architecture, probe history, current findings, risks, migration order, and future rim-light work.
- Updated `MASTER.md` with current Advanced Lighting status through Injection Probe v0.5.0, v0.6.0's current unvalidated diagnostic status, the future Booth-tab module direction, current tasks, migration queue, blockers, and rejected assumptions.
- Updated `HISTORY/README.md` and `HISTORY/Bullshit_Bible.md` to point to the renamed sub-project/spec file and corrected active shadow conclusions.
- Updated `HISTORY/STANDALONE_REFERENCES.md` with Injection Probe v0.4.0, v0.5.0, and v0.6.0 inventory/status entries and corrected v0.3's role.
- Updated `HISTORY/DECISIONS.md` with the one-spec-file sub-project structure, future separate Booth-tab module direction, and planned split of the cumulative probe harness.
- Updated `HISTORY/SESSION_LOG.md` with the stale-documentation correction and v0.4-v0.6 checkpoint.
- Updated `PRE_FLIGHT_Check.md` with target files, history reviewed, connected systems, conflict risks, out-of-scope repository boundary, and recommended action.

### Confirmed / Corrected Documentation

- Corrected the earlier active claim that v0.3 had proven reliable visible independent custom DirectionalLight shadows. Later controlled v0.4-v0.5 runs did not reproduce that visual result; independent visible custom shadows remain unconfirmed and currently appear non-working.
- Confirmed v0.4 found at least two `HF.summonCircle` materials using `additionalSunShadow: true` with `additionalSunShadowMap` textures distinct from the native `sun.shadow.map`.
- Confirmed that copying probe state onto the native sun caused visible native shadows to disappear and restoring the original native sun state caused visible shadows to return.
- Confirmed v0.5 retained the same native `sun.shadow.map` object and the same two `additionalSunShadowMap` texture objects across working baseline -> broken override -> restored state.
- Confirmed the direct material owners of the observed `additionalSunShadowMap` textures at `HF.summonCircle.children[0/1].material.uniforms.additionalSunShadowMap.value`.
- Recorded `HeroForge_Lighting_Injection_Probe_v0.6.0.txt` as the current active diagnostic probe for texture/source/image/backing-resource state, but explicitly not yet validated by a returned runtime report at this checkpoint.
- Preserved the confirmed second DirectionalLight behavior and the confirmed visually non-working but material-counted third SphereLight result.
- Preserved Persistent Booth as live/working and separate; no change to `tools/Booth.js` is justified by this investigation.
- Explicitly kept `Knight-Witch/HeroForge.Compatibility` out of scope for this work; it belongs to the separate Lob third-party script stabilization/refactor project.

### Touched Files

- `MASTER.md`
- `HISTORY/README.md`
- `HISTORY/Bullshit_Bible.md`
- `HISTORY/BULLSHIT/LIGHTING_AND_SHADOWS.md` (removed/replaced)
- `HISTORY/BULLSHIT/LIGHTING_AND_EXTRA_LIGHTS.md` (added)
- `HISTORY/STANDALONE_REFERENCES.md`
- `HISTORY/DECISIONS.md`
- `HISTORY/SESSION_LOG.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Rollback Notes

- Documentation-only checkpoint and correction.
- No JavaScript files changed.
- No standalone userscript probe files changed.
- No `manifest.json` changes.
- No storage keys, UI, styles, APIs, globals, or runtime behavior changed.
- Rolling back would restore the stale v0.3-only lighting documentation, the older filename, and the superseded custom-shadow claim.

### Test Notes

- Not applicable. Documentation-only update.
- Documentation was cross-checked against the current standalone probe history, the v0.4.0 and v0.5.0 diagnostic reports, the current v0.6.0 source status, and the user's visual observation that native sun shadows returned after restore.

## DOCS-2026-07-12-008 — Advanced Lighting Investigation Checkpoint

Date: 2026-07-12
Time: 14:08 PDT

### Added

- Added `HISTORY/BULLSHIT/LIGHTING_AND_SHADOWS.md` as the dedicated source for HeroForge custom-light injection, shadow-path behavior, SphereLight failure findings, canvas/preset confounders, lifecycle risks, and queued Fresnel/rim-light work.
- Added a durable milestone-based documentation-checkpoint policy: validated findings, corrections, status changes, decisions, blockers, and material probe milestones must be persisted in GitHub documentation rather than left only in chat.

### Changed

- Updated `MASTER.md` with Advanced Lighting Controls and Camera-Relative Rim Lighting status, active tasks, migration queue entries, watch items, rejected assumptions, and documentation-as-project-memory rules.
- Updated `HISTORY/README.md` with documentation-checkpoint rules and a link to the lighting/shadow topic file.
- Updated `HISTORY/Bullshit_Bible.md` with lighting/shadow critical rules, the new topic-file index entry, and documentation checkpoint/correction rules.
- Updated `HISTORY/STANDALONE_REFERENCES.md` with exact inventory/status notes for Lighting Probe v0.1.0, Lighting Injection Probe v0.1.0-v0.3.0, and the queued rim-light shader probe.
- Updated `HISTORY/DECISIONS.md` with durable decisions for milestone-based documentation checkpoints and separation of physical lighting, shader-based rim lighting, and Persistent Booth.
- Updated `HISTORY/SESSION_LOG.md` with the current lighting investigation state and next diagnostic priority.
- Updated `PRE_FLIGHT_Check.md` with target files, history reviewed, connected systems, conflict risks, and recommended action.

### Confirmed / Corrected Documentation

- Confirmed a second custom DirectionalLight visibly renders and supports position and intensity changes.
- Confirmed pre-attachment `castShadow: true` can allocate an independent custom shadow map and calculated shadow matrix in Photo Booth.
- Documented the unresolved stale-shadow-matrix behavior after later movement/state changes.
- Corrected the earlier assumption that `numDirLightShadows` must become `1`; visible custom shadows and an allocated map were observed while the inspected value remained `0`.
- Corrected native SphereLight count interpretation: count reductions in the isolation test were caused by manual user toggles, not HeroForge lifecycle removal.
- Documented that a third SphereLight being counted does not prove visible contribution; it remained visually inactive even as the sole registered SphereLight.
- Preserved Persistent Booth as live/working and separate; Witch Dock is not proven to have caused the later shadow regression.

### Touched Files

- `MASTER.md`
- `HISTORY/README.md`
- `HISTORY/Bullshit_Bible.md`
- `HISTORY/BULLSHIT/LIGHTING_AND_SHADOWS.md`
- `HISTORY/STANDALONE_REFERENCES.md`
- `HISTORY/DECISIONS.md`
- `HISTORY/SESSION_LOG.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Rollback Notes

- Documentation-only checkpoint.
- No JavaScript files changed.
- No userscript probe files changed.
- No `manifest.json` changes.
- No storage keys, UI, styles, APIs, globals, or runtime behavior changed.
- Removing this update would discard the durable lighting investigation record and documentation-checkpoint policy, but would not alter live Witch Dock behavior.

### Test Notes

- Not applicable. Documentation-only update.
- Documentation was cross-checked against the current standalone probe reports and user-observed test results.

## DOCS-2026-07-09-007 — Standalone Reference Inventory Backfill

Date: 2026-07-09
Time: 18:44 PDT

### Added

- Added `HISTORY/STANDALONE_REFERENCES.md` as the inventory for standalone scripts, external references, probes, deprecated scripts, migrated/absorbed behavior, and references that still need recovery.

### Changed

- Updated `HISTORY/README.md` to include the standalone reference inventory.
- Updated `MASTER.md` with a Reference Inventories section, expanded status terms, and a fuller migration queue covering HF Core Tweaks/Lob decal reference, Photo Mode PNG probes, Booth v12/v13 history, tokenBg/readPixels probes, deprecated scripts, and bone/kitbashing recovery.
- Updated `HISTORY/Bullshit_Bible.md` with a rule to check standalone references before editing systems with external/probe history.
- Updated `HISTORY/DECISIONS.md` with a decision to keep standalone references in a separate inventory.
- Updated `PRE_FLIGHT_Check.md` and `HISTORY/SESSION_LOG.md` for this standalone-reference backfill pass.

### Touched Files

- `HISTORY/STANDALONE_REFERENCES.md`
- `HISTORY/README.md`
- `MASTER.md`
- `HISTORY/Bullshit_Bible.md`
- `HISTORY/DECISIONS.md`
- `PRE_FLIGHT_Check.md`
- `HISTORY/SESSION_LOG.md`
- `CHANGELOG.md`

### Rollback Notes

- Docs-only reference inventory.
- No JavaScript files changed.
- No `manifest.json` changes.
- No runtime behavior affected.
- Reference statuses can be refined later as more source files are recovered.

### Test Notes

- Not applicable. Documentation-only update.

## DOCS-2026-07-09-006 — Photo Mode PNG Capture Feature Spec Backfill

Date: 2026-07-09
Time: 18:31 PDT

### Added

- Added `HISTORY/BULLSHIT/PHOTO_MODE_PNG_CAPTURE.md` as the dedicated feature-spec file for the unresolved Photo Mode PNG Series Capture tool.

### Changed

- Updated `HISTORY/Bullshit_Bible.md` to include the new Photo Mode PNG capture spec file and first-target summary.
- Updated `MASTER.md` with Photo Mode PNG capture requirements, migration queue details, watch items, and rejected assumptions.
- Updated `HISTORY/DECISIONS.md` with a conservative first-target decision for PNG capture: 1024x1024, around 72 PNG frames, ZIP output, metadata/failure records, explicit arming, and validated dimensions.
- Updated `HISTORY/BULLSHIT/TIMING_AND_STATE.md` with capture timing requirements around one-frame-per-render acceptance, dimension validation, timeouts, and memory/download risk.
- Updated `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md` to cross-link the dedicated feature spec while keeping probe history separate.
- Updated `PRE_FLIGHT_Check.md` and `HISTORY/SESSION_LOG.md` for this feature-spec backfill pass.

### Touched Files

- `MASTER.md`
- `HISTORY/Bullshit_Bible.md`
- `HISTORY/DECISIONS.md`
- `HISTORY/BULLSHIT/PHOTO_MODE_PNG_CAPTURE.md`
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
- `HISTORY/BULLSHIT/TIMING_AND_STATE.md`
- `PRE_FLIGHT_Check.md`
- `HISTORY/SESSION_LOG.md`
- `CHANGELOG.md`

### Rollback Notes

- Docs-only feature-spec backfill.
- No JavaScript files changed.
- No `manifest.json` changes.
- No runtime behavior affected.
- New spec file can be removed if this capture feature is abandoned.

### Test Notes

- Not applicable. Documentation-only update.

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