# Corrected Bound Decal Gizmo

Date promoted: 2026-09-05

Feature ID: `decals.gizmo.bound-correction`

## Purpose

Replace HeroForge's incorrect floor/origin transform gizmo for bound / Project-OFF splatter decals with a corrected projector-centered transform gizmo while preserving the native decal locator, state callbacks, undo/commit semantics, and unmodified HeroForge fallback.

## Accepted implementation

The public implementation is based on the runtime-confirmed WITCH_DEV v0.3.1 behavior.

Confirmed in the live user test:

- corrected gizmo activates for the selected bound / Project-OFF decal;
- native HeroForge Transformer visuals are used for Move, Rotate, and Scale;
- Move orientation follows the actual decal/projector frame;
- Move writes H/V/D correctly, including depth;
- Rotate behaves correctly;
- Scale controls propagate correctly; unequal Project-OFF visible scaling remains a separate deferred renderer enhancement;
- the original native floor/origin Transformer visualization is suppressed while correction owns the decal;
- disabling correction restores the native HeroForge gizmo;
- the corrected pivot is slightly offset from the visible artwork center but the actual movement/rotation pivot is accurate enough for release.

The visual-artwork-center offset is accepted polish debt, not a release blocker. The projector/bounding-box visualization is also deferred.

## Delivery

Public Witch Dock loads the corrected gizmo through `manifest.json` as hidden module `corrected-bound-decal-gizmo`, then loads `tools/Decals.js` as the visible `Decals` tab host.

`Witch_Dock.user.js` remains v1.0.8. This promotion is module/manifest-only, so installed users receive it on page refresh without a Tampermonkey shell update.

The current stable loader preserves the exact accepted DEV fragments and applies the four v0.3.1 source corrections transactionally before execution. Missing or ambiguous replacement anchors fail closed rather than partially initializing the feature.

The fragment layout is temporary technical debt retained for exact tested parity. Future HeroForge.Foundation migration may consolidate/rehome the source after a separate validation pass.

## Test-history correction

A duplicate Tampermonkey DEV script was accidentally active during the v0.3.1/v0.3.2 comparison, which initially made materially different builds appear identical.

After the duplicate was disabled and HeroForge was refreshed, v0.3.1 was re-tested alone with normal Witch Dock and was confirmed working. v0.3.2's custom Move-arrow experiment is rejected and is not promoted.

## Known limitations / follow-up

- Slight visual center offset from the visible decal artwork remains.
- Correcting/replacing the native projector wireframe/bounding box is deferred.
- Unequal Project-OFF visual scale remains deferred.
- Current H/V/D conversion evidence is current-build behavior and must remain compatibility-tested after HeroForge updates.
- Do not run the old standalone corrected-gizmo test or DEV add-on simultaneously with the public module.
