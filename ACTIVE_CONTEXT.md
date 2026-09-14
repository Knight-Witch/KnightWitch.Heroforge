# Active Context - WITCH_DEV_UI

**Updated:** 2026-09-14
**Current task:** Texture Quality multi-figure lifecycle - validate exact committed v0.3.4, then complete non-primary visual gates.
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

- service v0.3.4 / build `0.3.4-dev-native-color-material-setup`;
- UI v0.2.0 / build `0.2.0-dev-persistence-advanced-controls` unchanged;
- beta notice v0.1.2 unchanged.

v0.3.2 primary-only `Data.change()` ownership and v0.3.3 shared-Part snapshot ownership remain intact. v0.3.4 is a PATCH correction that explicitly asks HeroForge to rebuild its own color-bake materials after the pinned mask policy is installed or restored. Texture recipe, settle timing, UI API, and persistence semantics are unchanged.

## Confirmed Seya/shared-Part color-material root cause

In the three-figure Seya scene, the primary and Seya share the exact HeroForge bodyLower/bodyUpper Part object references. Under committed v0.3.3 the primary received the correct supported 1024px mask texture and `masksMapOverride` identity remained pinned, but its existing color-bake material could still retain the native 512px `masksMap` uniform.

Runtime source inspection confirmed:

- `colorBake.paints.setupMaterials('color')` sets the material mask via `paints.getMask(mesh, key)`;
- `paints.getMask()` prefers `mesh.masksMapOverride`;
- the color-bake mesh returned by `colorBake.paints.bake.getColorMeshes()` is the same mesh object as `display.meshes`;
- a bounded probe with the 1024px override pinned made native `setupMaterials('color')` change the actual primary material uniform from 512px to that exact 1024px texture, with object identity matching.

Generation-retry/reapply and late `colorBake.refresh(true)` hypotheses were tested and rejected. No direct material uniform assignment is used.

## Live v0.3.4 candidate validation PASS

The exact live-only candidate based on committed v0.3.3 added only native color-material setup after policy application and during restore.

- exactly-one three-figure Enable PASS;
- root renderer idle and all three display/resource atlases coherent at 4096×4096;
- primary bodyLower/bodyUpper material masks both 1024×1024 and pinned;
- Seya non-primary `materialSim="color"` and `sim.clutPath` remained intact;
- exactly-one Disable PASS with renderer idle, all three atlases coherent, Seya material state intact, and source-restored OFF status.

Relevant Bridge evidence: #2147 confirms candidate Enable PASS; #2149 confirms paired Disable/restore PASS.

## Protected ownership boundaries

Do not reintroduce independent non-primary `Data.change()`, direct child `display.change()` / `display.update()`, direct atlas assignment, direct material-uniform assignment, fabricated/copied `sim` state, per-pipeline snapshots for shared Part objects, or unbounded generation retries. HeroForge retains parent-owned child display propagation and native color-material ownership.

## Immediate next steps

1. Reload live Dev so the manifest cache key loads exact committed v0.3.4 / `0.3.4-dev-native-color-material-setup`.
2. Non-mutating readback must show v0.3.4, renderer idle, coherent figure atlases, and Texture Quality OFF.
3. Run one narrow committed-source Enable/Disable smoke on the current three-figure Seya scene.
4. With committed v0.3.4 High Res ON, require Amanda's human visual check of Seya as a non-primary figure.
5. If practical, repeat a heavy non-primary visual case such as Twilight Soak.
6. Public Stable remains untouched until Amanda gives explicit narrow promotion approval.
