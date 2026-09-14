# Active Context - WITCH_DEV_UI

**Updated:** 2026-09-14
**Current task:** Texture Quality multi-figure lifecycle - validate exact committed v0.3.3, then complete non-primary visual gates.
**Runtime posture:** public Stable Texture Quality v0.1.0 remains released/accepted and untouched.

## Minimum continuation set

Read only:

1. `PROJECT_CONTRACT.md`
2. this file
3. `features/rendering/Texture_Quality_Native_Reconcile.js`
4. `features/rendering/Texture_Quality_Native_Reconcile_UI.js` only if UI/service API behavior becomes relevant
5. `MODULE_VERSIONING.md` before any later runtime/version commit
6. `HISTORY/BULLSHIT/TEXTURE_QUALITY_NATIVE_RECONCILE.md` only when older engine evidence is genuinely needed

Do not preload full repo history/changelog/preflight/session logs.

## Public Stable - protected PASS

Public `Witch_Scripts` promotion commit remains `4bb0cc9ff18b7d797ead8d16f7a63032250616cf`. Stable service/UI remain v0.1.0 and are untouched by this investigation.

## Current Dev state

- service v0.3.3 / build `0.3.3-dev-shared-part-snapshots`;
- UI v0.2.0 / build `0.2.0-dev-persistence-advanced-controls` unchanged;
- beta notice v0.1.2 unchanged.

v0.3.2's primary-only `Data.change()` ownership fix remains intact. v0.3.3 is a PATCH correction to snapshot ownership for shared HeroForge Part objects; texture recipe, settle timing, UI API, and persistence semantics are unchanged.

## Confirmed shared-Part root cause

Two separate Colliefolk extra figures had distinct data/modded/display/mesh objects but shared the exact same bodyLower and bodyUpper Part object references. v0.3.2 stored Part snapshots per pipeline, so the second pipeline could capture the shared Part after the first pipeline had already promoted it to High Res. Disable then restored the first native snapshot and immediately overwrote it with the contaminated later snapshot.

v0.3.3 keeps one first-seen native snapshot per Part object for the whole active session. A dynamically-added figure also derives supported mask size from that stored native bake ceiling rather than the already-promoted live Part.

## Live v0.3.3 validation PASS

The exact live-only candidate passed:

- three-figure Enable;
- Disable restoring shared Collie native bake ceilings;
- immediate re-Enable without the prior false 1024px bodyUpper mask failure;
- automatic 3->2 removal while High Res remained ON;
- automatic 2->3 addition while High Res remained ON;
- Disable after dynamic addition, restoring both Collies to bodyLower=1024 and bodyUpper=512 with materialSim=color intact.

Bridge evidence: #2098 confirms dynamic-add 3-figure coherent ON state; #2100 confirms the final dynamic-add restore values.

## Protected ownership boundaries

Do not reintroduce independent non-primary `Data.change()`, direct child `display.change()` / `display.update()`, direct atlas assignment, fabricated/copied `sim` state, or per-pipeline snapshots for shared Part objects. HeroForge retains parent-owned child display propagation.

## Immediate next steps

1. Reload live Dev so the manifest cache key loads exact committed v0.3.3.
2. Non-mutating readback must show v0.3.3 / `0.3.3-dev-shared-part-snapshots`, renderer idle, coherent figure atlases, and Texture Quality OFF.
3. Run one narrow committed-source Enable/Disable smoke.
4. Validate Seya as a non-primary figure visually; then a heavy non-primary case such as Twilight Soak if practical.
5. Stable remains untouched until explicit narrow promotion approval.
