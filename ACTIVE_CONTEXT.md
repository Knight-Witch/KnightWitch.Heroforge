# Active Context — WITCH_DEV_UI

**Updated:** 2026-09-13  
**Current task:** Texture Quality multi-figure scope — validate count-agnostic service v0.3.0 against vanilla 1/2/3 figures and heavy non-primary figures.  
**Runtime posture:** public Stable Texture Quality v0.1.0 remains released/accepted and untouched.

## Minimum continuation set

Read only:

1. `PROJECT_CONTRACT.md`
2. this file
3. `HISTORY/BULLSHIT/TEXTURE_QUALITY_NATIVE_RECONCILE.md` when durable engine history is needed
4. `features/rendering/Texture_Quality_Native_Reconcile.js`
5. `features/rendering/Texture_Quality_Native_Reconcile_UI.js`
6. `MODULE_VERSIONING.md` before another code/version commit

Do not preload full repo history/changelog/preflight unless a current step specifically requires them.

## Public Stable — protected PASS

Public `Witch_Scripts` promotion commit: `4bb0cc9ff18b7d797ead8d16f7a63032250616cf`.

Stable remains service v0.1.0 / `0.1.0-dev-hfc-alpha3-port` + UI v0.1.0 / `0.1.0-dev-texture-quality-controls`. Blood Moon acceptance remains closed PASS. Stable has not been modified by the current investigation.

## Current Dev candidate

- service v0.3.0 / build `0.3.0-dev-multifigure-native-reconcile` — detached candidate until exact static review passes;
- UI v0.2.0 / build `0.2.0-dev-persistence-advanced-controls` unchanged;
- beta notice v0.1.2 / build `0.1.2-centered-sleek-title` unchanged.

Persistence semantics remain unchanged: default OFF; boolean-only Persistent intent; manual Disable while persistent is page-session suppression; manual Enable/reload clears suppression; unchecking persistence stops future automatic behavior without forcing an active session off.

## Closed prerequisites

- v0.2.2 fixed promoted 1024 body-mask path resolution on D4 and passed automatic/manual/cold-reload validation.
- v0.2.3 waits for a visible, coherent, idle, stable HeroForge generation before Persistent automatic enable.
- v0.2.4 expanded native settle to 120 seconds and checks ready state before enforcing expiry; this closed Seya's false timeout caused by heavy native work exceeding the old 12-second budget.

## Confirmed multi-figure root cause

Seya remained visually low quality because she was figure 2, while Texture Quality v0.2.4 only targeted `CK.character.data` / `CK.character.display` — the primary figure.

Live clean-scene mapping through HF-Chat-Bridge established:

- one figure: primary pipeline at `CK.character.display`;
- two figures: `CK.character.allDisplays` contains `""` plus `baseItem`; `baseItem.data.primary=false` and owns an independent coherent native atlas/resourceAtlas and independent body/head parts;
- three figures: registry contains `""`, `baseItem`, `baseItemB`; both extras are independent non-primary render pipelines;
- Colliefolk figure 2 part IDs: bodyLower 11426 / bodyUpper 11181 / face 26096;
- raccoonfolk figure 3 part IDs: bodyLower 26112 / bodyUpper 11181 / face 26130;
- each extra exposes its own `data.change()` and `modded.buildAtlas()`; root `CK.character.refresh()` remains the normal scene update request.

Therefore the service must enumerate current figure displays dynamically rather than hardcoding a count. This should naturally cover future Additional Minis figures if HeroForge registers them through the same `allDisplays` collection.

## v0.3.0 candidate architecture

- collect the primary display plus every unique compatible entry in `CK.character.allDisplays`;
- keep one session with independent per-figure data/display/modded/part/mask snapshots;
- apply the existing validated policy unchanged to each figure: BL/BU/face atlasScale 4, bake 2048, used-size seed 1024, exact real 1024 body masks;
- use each figure's native `data.change()` and `modded.buildAtlas()`, then one root `CK.character.refresh()`;
- settle only when the root scheduler is idle and every figure has finished/resources-ready coherent display/resource atlas identity;
- verify every figure independently while retaining primary-shaped top-level verification fields for UI compatibility;
- while High Res is active, detect figure-registry/target changes and queue a stable native resync so added figures inherit the policy without hardcoded figure limits.

No 8192 atlas forcing, global-4 policy, projected/splatter overrides, custom atlas ownership or direct atlas assignment belongs to v0.3.0.

## Next gate

1. Validate the exact detached v0.3.0 service blob and manifest JSON/diff.
2. Move `WITCH_DEV_UI` only after static checks pass.
3. Hot-load exact v0.3.0 on the current clean three-figure scene with Texture Quality OFF; manual Enable must verify all three pipelines and exact masks.
4. Exercise dynamic membership by adding/removing a figure while High Res stays ON.
5. Reload a scene with Seya as a non-primary figure and require Amanda visual confirmation that Seya now receives the quality improvement.
6. Heavy non-primary follow-up with Twilight Soak if practical.
7. Stable remains protected until explicit narrow promotion approval.
