# Active Context - WITCH_DEV_UI

**Updated:** 2026-09-14
**Current task:** Public Stable promotion handoff. The next chat should perform a narrow `Witch_Scripts` Texture Quality promotion from the accepted Dev state, then run a narrow Stable smoke.
**Approval:** Amanda explicitly approved beginning the public-update phase in the next chat. This handoff itself does not mutate Stable.
**Runtime posture:** WITCH_DEV_UI Texture Quality v0.3.4 is accepted; public Stable remains unchanged.

## Minimum continuation set

Read only:

1. `PROJECT_CONTRACT.md`
2. this file
3. `MODULE_VERSIONING.md` before any runtime/version promotion
4. `features/rendering/Texture_Quality_Native_Reconcile.js` on `WITCH_DEV_UI`
5. `features/rendering/Texture_Quality_Native_Reconcile_UI.js` on `WITCH_DEV_UI`
6. the corresponding Texture Quality service/UI files and `manifest.json` on `Witch_Scripts`
7. `CHANGELOG.md` and `PRE_FLIGHT_Check.md` only when preparing the promotion commit
8. `HISTORY/BULLSHIT/TEXTURE_QUALITY_NATIVE_RECONCILE.md` only if an unresolved engine question genuinely requires old evidence

Do not preload full repo history, MASTER, session logs, unrelated changelogs/preflight history, or HeroForge.Compatibility.

## Accepted Dev state

- service v0.3.4 / build `0.3.4-dev-native-color-material-setup`;
- validated runtime commit `edd276b21af4ee4ce354857b09e5e7340fd007ad`;
- UI v0.2.0 / build `0.2.0-dev-persistence-advanced-controls`;
- current Dev acceptance/docs head before this handoff: `f3fe492913b34493b0373324d28e6f7613f9379d`.

Retain the validated ownership model:

- primary-only `Data.change()`;
- HeroForge parent-owned child display propagation;
- session-global first snapshots for shared Part objects;
- HeroForge-owned `colorBake.paints.setupMaterials('color')` for pinned mask material refresh;
- no direct child display mutation, direct atlas assignment, direct uniform assignment, fabricated/copied sim state, or unbounded retries.

## Dev acceptance - CLOSED PASS

The current Texture Quality multi-figure Dev phase is complete. Do not restart the investigation.

Validated coverage includes:

- committed-source Enable/Disable smoke;
- repeated Enable/Disable;
- three-figure 3->2 and 2->3 dynamic membership;
- shared-Part snapshot/restore;
- non-primary materialSim preservation;
- Seya shared-Part color-mask correction;
- human visual PASS on Seya as non-primary;
- heavy three-detailed-figure 1030% kitbash stress PASS;
- heavy Disable/restore and final re-enable PASS.

The 1030% scene demonstrated intended pressure scaling: one extra packed bodyLower/bodyUpper at the accepted 1024x1024 High Res floor while its face and the other headline targets reached 2048x2048. Amanda visually confirmed all three figures' body textures and decals looked excellent. This is valid current behavior, not a defect.

High Res policy remains floor-based: atlas scale 4, bake target 2048, source/allocation floor 1024, with native promotion toward 2048 when atlas pressure permits.

## Public Stable baseline - protected until promotion

`Witch_Scripts` currently remains at head `c93485d741fe9d1801b0f6924b7204a8d922792c`; its last runtime Texture Quality promotion commit is `4bb0cc9ff18b7d797ead8d16f7a63032250616cf`. Stable Texture Quality service/UI remain v0.1.0 at the start of the next chat.

## Promotion contract for the next chat

Amanda has approved starting the public update. Do not ask again merely to begin the narrow Texture Quality promotion.

1. Reconfirm `WITCH_DEV_UI` and `Witch_Scripts` branch heads before writing.
2. Inspect the exact Dev and Stable Texture Quality service/UI files plus their manifest registry/cache entries.
3. Determine the smallest complete Texture Quality promotion surface. Do **not** merge WITCH_DEV_UI wholesale and do not carry unrelated Dev changes into Stable.
4. Promote only the accepted Texture Quality behavior and required manifest/version/cache wiring, preserving unrelated Stable files and behavior.
5. Follow `MODULE_VERSIONING.md`; run syntax/static checks before moving Stable.
6. Every promotion commit must update the appropriate `CHANGELOG.md` and add a concise `PRE_FLIGHT_Check.md` record.
7. After promotion, load actual `Witch_Scripts` Stable and run the narrowest meaningful runtime smoke through HF-Chat-Bridge: service/version identity, renderer idle/readiness, Enable verification across the current three-figure scene if still available, Disable/restore, and material-state sanity.
8. If Stable behavior differs from the exact accepted Dev behavior, stop and diagnose rather than widening scope or patching blindly.

Stable is not an experimental branch.

## Deferred work

Ultra-heavy / "insanity mode" is a separate future phase. It begins only when HeroForge drives a targeted allocation below the validated 1024px High Res floor or a verified state is visibly degraded. Do not mix that work into this promotion.
