# Bound Decal Gizmo — WITCH_DEV

Date: 2026-09-04

Feature ID: `decals.gizmo.bound-correction`

## Purpose

Dev-only Witch Dock integration of the validated corrected bound/Project-OFF decal gizmo. It keeps the validated v0.4.1 projector-center behavior while moving control into a new Witch Dock `Decals` tab.

## Scope

- Corrected projector-volume-center anchor for bound decals.
- Camera-plane Move using direct H/V/D state writes through `CK.activeTweak`.
- Rotate and Scale through a separate corrected `EX.Transformer` proxy while retaining HeroForge's native locator/callback state path.
- 400 ms binding/state refresh plus per-frame camera reprojection, preserving the validated timing model.
- Native floor/origin Transformer visualization is hidden with `nativeTransformer.visible = false` only while correction owns the active bound decal; the native `decalLocator` and listeners remain alive.
- Disable/dispose restores the exact prior native Transformer visibility value.
- A concurrent standalone corrected-gizmo test is detected and the Witch Dock correction fails closed to avoid duplicate corrected Transformers.

## Dev delivery

The public `Witch_Scripts` branch is untouched. `Witch_Dock_Gizmo_DEV.user.js` is a temporary DEV add-on that waits for the normal Witch Dock runtime, loads the WITCH_DEV gizmo source, and registers `tools/Decals.js` as a `Decals` tab.

The gizmo source is stored as five `.jsfrag` files only because the current connected GitHub write path cannot upload the locally assembled ~49 KB source as one file atomically. The DEV loader concatenates the fragments before evaluation. Before public Stable promotion, consolidate these fragments into one maintained module file.

## Pre-flight / conflict risks

Reviewed current Witch Dock `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, current live manifest/module boundary, Compatibility project contract/status, validated v0.4.1 behavior, and current Lob ADP v0.99.30 coexistence evidence.

Risks:

- `nativeTransformer.visible = false` has not yet received a dedicated live suppression probe result from HF-Chat-Bridge; this is an explicit WITCH_DEV acceptance item.
- Existing standalone v0.4.1 test must be disabled before this DEV module can activate.
- Project-OFF unequal visible scaling remains a known renderer limitation and is not part of this feature.
- Current Move H/V/D 4/4/8 conversion is current-build evidence, not a guaranteed stable HeroForge API.

## Static test status

- Assembled corrected gizmo source: `node --check` PASS.
- Witch Dock Decals UI module: `node --check` PASS.
- DEV add-on userscript: `node --check` PASS.
- Live WITCH_DEV integration: pending Amanda test.

## Required Dev acceptance

1. Normal Witch Dock remains functional.
2. New `Decals` tab appears.
3. Select a bound / Project-OFF decal and enable HeroForge's native decal gizmo.
4. Corrected gizmo appears at the projector center and native floor/origin gizmo disappears.
5. Move center and H/V/D axes behave normally.
6. Rotate behaves normally.
7. Scale controls still propagate as in v0.4.1; unequal Project-OFF visible scale is not required.
8. Toggle correction OFF: corrected gizmo disappears and native HeroForge gizmo returns.
9. Toggle correction ON: corrected gizmo returns without duplication.
10. Switch/select away from the bound decal: correction releases native gizmo cleanly.

Public `Witch_Scripts` promotion requires a separate explicit review after this acceptance pass.
