# Active Context - WITCH_DEV_UI

**Updated:** 2026-09-15
**Current task:** Live-validate the exact Dev candidate for Texture Quality same-figure kitbash repair + projected `splatter` host priority.
**Protected public state:** Stable `Witch_Scripts` remains untouched and is not authorized for promotion.
**Base/handoff:** `54a9e692ae619265ad2d7e3171e67e3fd5060dd1`.
**Dev candidate modules:** core service v0.3.5 unchanged; same-figure drift guard v0.1.0 / `0.1.0-dev-stable-same-figure-repair`; active-decal priority v0.1.1 / `0.1.1-dev-projected-host-lifecycle-coordination`; UI v0.2.0 unchanged.

## Minimum continuation set

1. `PROJECT_CONTRACT.md`;
2. this file;
3. `MODULE_VERSIONING.md` before further runtime/version changes;
4. `features/rendering/Texture_Quality_Native_Reconcile.js` only if core behavior must change;
5. `features/rendering/Texture_Quality_Same_Figure_Drift_Guard.js`;
6. `features/rendering/Texture_Quality_Active_Decal_Priority.js`;
7. `manifest.json`;
8. rolling `CHANGELOG.md` / `PRE_FLIGHT_Check.md` only when committing.

Do not preload unrelated history. Do not consult HeroForge.Compatibility unless a new unresolved engine seam appears.

## Proven interactive lifecycle

A real Amanda-driven kitbash drag on D4 with wings was traced with a temporary observer. HeroForge emitted `character.change` containing both `transforms` and `atlasScale`; bodyLower/bodyUpper/face `atlasScale` ownership became absent immediately while the current atlas could still momentarily report 2048 allocations. Subsequent native generations produced the visible brief potato state.

The previously installed temporary stable guard was still active despite the prior handoff saying it had been removed. Its initial install state had `lastResult=null`; after Amanda's earlier automatic recovery it had `lastResult=true`. During the newly traced drag it later called `reconcile({sceneSync:true})` after HeroForge reached stable ready state, and Amanda observed potato -> recovered. Therefore the recovery mechanism is confirmed: stable same-figure policy-drift detection followed by the existing reconcile recipe.

Programmatic `CK.tweak` transform edits did not reproduce potato; do not equate any transform mutation with the interactive drag lifecycle.

All temporary observer/guard helpers were removed after capture. Bridge readback confirmed both globals absent and normal Dev wrappers restored.

## Candidate design

- New same-figure guard watches only an already-enabled core session with unchanged verified figure count. It detects loss/degradation of protected body/head scale/bake/source/allocation policy, but leaves figure membership changes to the existing core scene-sync path.
- It waits for the same readiness family as the core service: no `_needsUpdating` / `_inUpdate`, resources ready/finished, display atlas equals resource atlas, same c/data/display/modded/atlas refs and renderer signature stable for 1200 ms. No guessed repair delay and no weakened settle behavior.
- If drift remains after stable readiness, it invokes the existing `reconcile({sceneSync:true})` once. Bridge is development infrastructure only and is not a runtime dependency.
- Active-decal v0.1.1 adds only real non-core projected hosts selected by `data.decals.splatter[*].filter[key] === true`. It defers accessory policy mutation while core scene sync or same-figure repair is pending, so it cannot mask/race the drift signal.
- Intended atlas budget remains 8192×4096. Broader Enhanced Object Textures remains separate future work.

## Exact next work

1. Load the exact committed Dev candidate on the currently loaded D4-with-wings scene.
2. Read active-decal state and verify the eight projected wing-target filter hits produce the expected real wing host keys only; inspect scale/source/allocation and core verification.
3. Run one real kitbash drag. Confirm committed guard transitions pending -> one reconcile -> idle, and bodyLower/bodyUpper/face finish scale 4 / 2048 source / 2048×2048 packed with no loop/error.
4. Ask Amanda only for the human visual check: whether the brief potato resolves cleanly and whether the prior muddy/green leg/torso/hand color artifact remains.
5. Run a real 2–3 figure active-decal regression before considering Stable.

## Promotion gate

Not ready for Stable. Required gates are exact-commit single-figure lifecycle/projected-host validation, human visual acceptance, then the existing real multi-figure extension regression. Stable stays untouched until explicit narrow promotion approval.
