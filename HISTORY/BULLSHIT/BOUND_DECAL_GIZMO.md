# Corrected Bound Decal Gizmo

Date promoted: 2026-09-05

Feature ID: `decals.gizmo.bound-correction`

## Purpose

Replace HeroForge's incorrect floor/origin transform gizmo for bound / Project-OFF splatter decals with a corrected projector-centered transform gizmo while preserving the native decal locator, state callbacks, undo/commit semantics, and unmodified HeroForge fallback.

## Accepted implementation

The public implementation began from the runtime-confirmed WITCH_DEV v0.3.1 native-visual behavior and was repaired/extended by the runtime-confirmed WITCH_DEV v0.4.2 behavior on 2026-09-05.

Confirmed in live user tests:

- corrected gizmo activates for the selected bound / Project-OFF decal;
- native HeroForge Transformer visuals are used for Move, Rotate, and Scale;
- Move orientation follows the actual decal/projector frame;
- Move writes H/V/D correctly, including depth;
- Rotate behaves correctly;
- Scale controls propagate correctly; unequal Project-OFF visible scaling remains a separate deferred renderer enhancement;
- the original native floor/origin Transformer visualization is suppressed while correction owns the decal;
- disabling correction restores the native HeroForge gizmo;
- the corrected pivot is slightly offset from the visible artwork center but the actual movement/rotation pivot is accurate enough for release;
- one corrected Move drag produces one usable HeroForge undo transaction rather than a stack of microscopic pointer-move snapshots;
- Ctrl+Z / Ctrl+Shift+Z work for corrected Move, Rotate, and Scale;
- normal Project ON/OFF toggling preserves previously established sane bound transform values;
- changing decal artwork while Project OFF preserves the user's bound transform rather than accepting HeroForge's replacement-art defaults;
- a brand-new decal slot's first Project-OFF conversion neutralizes only HeroForge's confirmed bad initializer values `v≈1.50394`, `s≈1.76859`, and `sy≈1.76859`, setting those three fields to `0` so the decal/gizmo starts in a usable location and scale.

The visual-artwork-center offset is accepted polish debt, not a release blocker. The projector/bounding-box visualization is also deferred.

## Undo transaction diagnosis and repair

### Confirmed

With correction disabled, HeroForge's native Project-OFF gizmo creates working undo entries. The earlier undo failure therefore belonged to the corrected-gizmo integration rather than to Project-OFF decals generally.

The corrected Move path had been calling `CK.activeTweak()` on every pointer movement. On the current runtime that routes through HeroForge character change/history behavior and records repeated intermediate snapshots. A single Ctrl+Z then walked backward through microscopic drag samples, making undo appear non-functional.

### Accepted repair

During a corrected Move drag, v0.4.2 updates character decal data through the current `character.data.change(...)` plus `character.refresh()` path without adding a history point on every pointer movement. The existing `CK.passiveChangeFinish()` path remains the single commit on drag release. Cancel/interrupted-drag restoration does not manufacture a history entry.

Human runtime validation passed for:

- Move -> Undo -> Redo;
- Rotate -> Undo -> Redo;
- Scale -> Undo -> Redo.

## Bound transform preservation

The repair uses `CK.Events.on('characterEnterChange', ...)` / `off(...)` to observe pending character updates while the feature is mounted.

Rules:

- Only actual Project-OFF records are treated as authoritative known bound transforms.
- Projected `s` / `sy` values are not treated as valid bound baselines for a fresh slot.
- When existing artwork is changed while the slot is already Project OFF, the prior bound transform fields are copied into the replacement record.
- When a previously known bound decal is toggled Project ON/OFF and HeroForge remembers sane state, the feature leaves it alone.
- When a first-ever Project-OFF conversion produces the exact observed bad-default signature, only `v`, `s`, and `sy` are normalized to zero. H/D/rotation and unrelated fields are not arbitrarily reset.
- The event listener and transform caches are removed/cleared on feature disposal.

Bound transform fields currently preserved when finite: `h`, `v`, `d`, `s`, `sy`, `a`, `i`, `u`, `sz`.

## Delivery

Public Witch Dock loads the corrected gizmo through `manifest.json` as hidden module `corrected-bound-decal-gizmo`, then loads `tools/Decals.js` as the visible `Decals` tab host.

`Witch_Dock.user.js` remains v1.0.8. The v1.1.0 gizmo repair is module-only, so installed users receive it on page refresh without a Tampermonkey shell update.

The current stable loader preserves the accepted source split into fragments and applies the validated source corrections transactionally before execution. Missing or ambiguous replacement anchors fail closed rather than partially initializing the feature.

The fragment/source-replacement layout remains technical debt retained to minimize risk against the exact tested behavior. Future HeroForge.Foundation migration may consolidate/rehome the source after a separate validation pass.

## Test-history correction

A duplicate Tampermonkey DEV script was accidentally active during the earlier v0.3.1/v0.3.2 comparison, which initially made materially different builds appear identical.

After the duplicate was disabled and HeroForge was refreshed, v0.3.1 was re-tested alone with normal Witch Dock and confirmed working. v0.3.2's custom Move-arrow experiment is rejected and is not promoted.

Later WITCH_DEV v0.4.0 established working undo/redo and transform preservation for existing Project-OFF state/artwork swaps. v0.4.1 failed the fresh-slot scale case because projected scale fields were incorrectly treated as a meaningful bound baseline. v0.4.2 corrected that model by caching only genuine bound state and was human-validated successfully.

## Known limitations / follow-up

- Slight visual center offset from the visible decal artwork remains.
- Correcting/replacing the native projector wireframe/bounding box is deferred.
- Unequal Project-OFF visual scale remains deferred.
- Current H/V/D conversion and observed bad-initializer values are current-build behavior and must remain compatibility-tested after HeroForge updates.
- Do not run the old standalone corrected-gizmo test or DEV add-on simultaneously with the public module.
