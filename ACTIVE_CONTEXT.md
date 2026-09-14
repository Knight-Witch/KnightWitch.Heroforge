# Active Context - WITCH_DEV_UI

**Updated:** 2026-09-14
**Current task:** Texture Quality multi-figure Dev phase accepted; await explicit narrow Stable-promotion approval or a new task.
**Runtime posture:** public Stable Texture Quality v0.1.0 remains released/accepted and untouched.

## Minimum continuation set

Read only:

1. `PROJECT_CONTRACT.md`
2. this file
3. `features/rendering/Texture_Quality_Native_Reconcile.js` only if Texture Quality runtime work resumes
4. `features/rendering/Texture_Quality_Native_Reconcile_UI.js` only if UI/service API behavior becomes relevant
5. `MODULE_VERSIONING.md` before any later runtime/version commit
6. `HISTORY/BULLSHIT/TEXTURE_QUALITY_NATIVE_RECONCILE.md` only when older engine evidence is genuinely needed

Do not preload full repo history/changelog/preflight/session logs.

## Public Stable - protected PASS

Public `Witch_Scripts` promotion commit remains `4bb0cc9ff18b7d797ead8d16f7a63032250616cf`. Stable service/UI remain v0.1.0 and were not touched during the v0.3.x multi-figure investigation.

## Current Dev runtime

- service v0.3.4 / build `0.3.4-dev-native-color-material-setup`;
- runtime commit `edd276b21af4ee4ce354857b09e5e7340fd007ad`;
- UI v0.2.0 / build `0.2.0-dev-persistence-advanced-controls` unchanged;
- beta notice v0.1.2 unchanged.

v0.3.2 primary-only `Data.change()` ownership, v0.3.3 shared-Part snapshot ownership, and v0.3.4 HeroForge-owned color-material setup are all retained. No direct child display mutation, direct atlas assignment, direct uniform assignment, fabricated/copied sim state, or unbounded lifecycle retries are allowed.

## Current accepted behavior

High Res policy is intentionally floor-based rather than "force every target to 2048":

- atlas scale target = 4;
- bake target = 2048;
- `_usedTextureSize` seed / validated High Res floor = 1024;
- HeroForge may natively promote individual allocations to 2048 when atlas pressure permits;
- verification requires each targeted allocation to remain at least 1024 and no larger than 2048, with supported body masks pinned at their native ceiling up to 1024.

This distinction matters for heavy builds. A 1024 packed target under pressure is still a valid High Res result; future ultra-heavy / "insanity mode" work begins when HeroForge pushes a targeted allocation below 1024 or when a verified result is still visibly degraded.

## Multi-figure validation - PASS

Committed v0.3.4 passed the full current Dev gate:

- repeated Enable/Disable and committed-source smoke;
- three-figure dynamic 3->2 and 2->3 membership handling;
- shared Part snapshot/restore handling;
- non-primary materialSim preservation;
- Seya shared-Part color-mask correction;
- human Seya non-primary visual gate;
- heavy three-detailed-figure 1030% kitbash stress gate.

### 1030% stress evidence

Clean post-refresh OFF baseline:

- primary: bodyLower/bodyUpper 512x512, face 1024x1024;
- extra 1: bodyLower/bodyUpper 512x512, face 512x512;
- extra 2: bodyLower/bodyUpper 512x512, face 1024x1024.

Heavy Enable resolved true in ~4.05s:

- primary: bodyLower/bodyUpper/face 2048x2048;
- extra 1: bodyLower/bodyUpper 1024x1024, face 2048x2048;
- extra 2: bodyLower/bodyUpper/face 2048x2048;
- extra 1 still held 2048 bake/used targets, confirming HeroForge native atlas pressure selected the 1024 allocation;
- body masks stayed at the validated supported sizes;
- Amanda visually confirmed all three figures had stellar/high-resolution body textures and decals.

Heavy Disable resolved true in ~4.1s with root idle and non-primary material sims intact. Disable restores source policy but intentionally retains already-built native atlases until HeroForge rebuilds them. Final re-enable resolved true in ~3.49s and the active scene was left High Res ON.

Bridge evidence: #2177, #2178, #2181-#2194.

## Closed root causes retained for future reference

- v0.3.2: independent child `Data.change()` destroyed resolved child `modded.sim`; fixed by primary-only `Data.change()` and parent-owned propagation.
- v0.3.3: separate figure pipelines can share the same Part objects; fixed by session-global first snapshots keyed by object identity.
- v0.3.4: correct pinned mask could exist while an existing color-bake material retained a 512px uniform; fixed through HeroForge-owned `colorBake.paints.setupMaterials('color')` after policy install and during restore.

## Next step

Do not change runtime code merely because the 1030% scene produced a valid 1024 pressure-scaled body allocation. Current multi-figure scope is accepted.

If Amanda explicitly approves narrow Stable promotion, follow the contract: promote only the validated Texture Quality changes, then run the narrowest meaningful `Witch_Scripts` Stable smoke. Otherwise take the next task from Amanda and leave Stable untouched.
