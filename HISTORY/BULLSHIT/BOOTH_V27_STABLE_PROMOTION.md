# Booth v27 Stable Promotion

Date: 2026-09-07
Status: Public Stable promotion candidate
Target HeroForge build: `heroforge07.1.9.98`

## Purpose

Record the narrow public promotion of the already-tested Booth v27 / Utilities v1.2.1 pair after the initial Black Canvas replay promotion left Stable on Booth v24 and Utilities v1.1.0.

## Exact promoted runtime blobs

- `tools/Booth.js`: `434b5382c9e8b01e9f9e8bf53d772e72eaf53090`
- `tools/Utilities.js`: `036fca4d7f68a1dee0f7d160777d453ac53274af`

These are the exact `WITCH_DEV_UI` blobs; they are not reconstructed Stable copies.

## Promoted Booth v27 behavior

- saved Booth/default detection no longer requires `BT.maker` merely to inspect character-owned Photo Booth config;
- named engine resolution uses `BT.liveEngine || BT.maker` when available;
- saved Booth figures can restore through the saved default while new/no-Booth figures remain excluded until a setup exists;
- Black Canvas saved default is separate from the Booth-tab session override;
- explicit Witch Dock `CK.character.refresh()` calls were removed from component/startup reconciliation;
- captured lighting replay uses identical next/previous state;
- figure-scoped Booth snapshots are cleared on character-generation changes;
- Black Canvas layout invalidation covers canvas/holder geometry, viewport, and DPR;
- existing tokenizer/teardown/silent-cycle timing is preserved.

## Promoted Utilities v1.2.1 behavior

Utilities now groups:

- `Booth Features` — saved Booth Persistence Across Sessions and Black Canvas Across Sessions;
- `Decal Features` — Bound Decal Gizmo controls;
- `HeroForge UI Patches` — existing optional HeroForge UI utilities.

The saved-default controls call the v27 `KW_WD_BOOTH` API and do not replace the Booth-tab session controls.

## Black Canvas replay coexistence

The public replay module remains v0.1.1 and unchanged. It already prefers `KW_WD_BOOTH.getState().sessionBlackCanvas`, so Booth v27 is its preferred state source; the v24 diagnostic path remains only as compatibility fallback.

The successful Dev flash smoke used Booth v27 + Utilities v1.2.1 + replay together. The formerly reliable white flash did not reproduce and Amanda reported the result worked perfectly.

## Exclusions

This promotion does not change:

- Witch Dock shell v1.2.0;
- Corrected Bound Decal Gizmo runtime/fragments;
- Spinny Mini WebP;
- High Res Image Capture;
- JSON;
- Developer Mode;
- Decals host;
- tab presentation/order;
- HF-Chat-Bridge remains development-only.

## Public smoke

After Stable refresh:

1. Developer Mode must show Booth v27.0.0 and Utilities v1.2.1.
2. Utilities must show `Booth Features`.
3. Black Canvas must remain black through the known flash-causing update.
4. Black Canvas OFF must restore the ordinary background.
