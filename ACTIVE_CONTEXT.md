# Active Context - WITCH_DEV_UI

**Updated:** 2026-09-14
**Current task:** Texture Quality smart active-decal priority Dev validation.
**Protected public state:** Stable service v0.3.4 / UI v0.2.0 and public notice v0.2.1 remain accepted; Stable is not the experimental environment.
**Dev candidate target:** service v0.3.5 / build `0.3.5-preserve-native-source-floor` plus new active-decal policy v0.1.0 / build `0.1.0-dev-active-decal-scale-policy`.

## Minimum continuation set

1. `PROJECT_CONTRACT.md`;
2. this file;
3. `MODULE_VERSIONING.md` before runtime/version changes;
4. `features/rendering/Texture_Quality_Native_Reconcile.js`;
5. `features/rendering/Texture_Quality_Active_Decal_Priority.js`;
6. `features/rendering/Texture_Quality_Native_Reconcile_UI.js` only if UI behavior/controls are being changed;
7. `manifest.json` for active module identity/load order;
8. rolling `CHANGELOG.md` / `PRE_FLIGHT_Check.md` only when committing.

Do not reopen unrelated Booth/decal-gizmo/history work. Do not consult HeroForge.Compatibility unless a new HeroForge engine seam remains unresolved after live source/runtime inspection.

## Confirmed diagnosis

- The accepted v0.3.4 body/head policy can still leave an actually-decaled accessory below its available texture ceiling.
- HeroForge exposes actually applied per-figure decal slots through `figureData.decals`; this is a cleaner selector than promoting every part with `hasAvailableDecals`.
- Current heavy primary figure: six part-backed active decal slots versus 37 decal-capable parts.
- `k_9` / `clothVDress` was 1024×1024 with a 2048 baked ceiling.
- 8192×8192 budget alone did not improve it because the slot still requested scale 1.
- Selective scale 4 on actual applied decal slots promoted that dress to used=2048 / allocation=2048×2048.
- The dress remained 2048×2048 after the atlas ceiling returned to 8192×4096; verification remained PASS.

## Candidate ownership boundaries

Core Texture Quality service continues to own:

- bodyLower/bodyUpper/face scale 4;
- body/head bake/source policy and masks;
- persistence, lifecycle, reconcile, verification, snapshots/restore.

New active-decal policy owns only while High Res is desired/active:

- raises HeroForge's allowed atlas maxima to at least 8192×4096 only when a reliable hardware texture limit confirms support, without lowering a larger outside/native setting;
- scale 4 for non-core atlas slots that currently contain applied decals in `figureData.decals`;
- restoration of its own accessory scale snapshots and settings on removal/disable;
- dynamic detection through the existing service/UI refresh cadence, with a dirty-policy retry so a rebuild is not lost to a transient busy race;
- optional failure isolation from the core service.

The v0.3.5 core patch also corrects `USED=1024` to behave as a floor rather than forcing an already-higher native source back to 1024.

## Next gate

1. Commit the exact Dev candidate atomically with manifest/version/log updates.
2. Hot-load the exact committed Dev service + active-decal policy through HF-Chat-Bridge.
3. Verify module provenance/identity and current heavy-figure allocations.
4. Run the narrow live regression: active decal add/remove, disable/restore, figure lifecycle/multi-figure preservation, no errors.
5. Ask Amanda only for the human visual comparison/gate when the technical state is verified.
6. Promote narrowly to `Witch_Scripts` only after explicit approval, then Stable smoke.

## Deferred follow-on

A broader opt-in object/global texture-quality feature is desired separately. Lob's FRD global ×4 behavior can improve arbitrary object textures (user report: the “egg”), but normal High Res should remain the targeted active-decal path. Design the heavier object mode as a separate toggle after this candidate is validated; add graphics-tier controls only if testing shows they are needed.
