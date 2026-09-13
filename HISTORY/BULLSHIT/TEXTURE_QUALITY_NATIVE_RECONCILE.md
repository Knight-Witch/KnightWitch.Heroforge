# Texture Quality — Native Reconcile

**Status:** Public Stable v0.1.0 accepted; Dev persistence service v0.2.1 + UI v0.2.0 + isolated Phase 1 notice v0.1.0 awaiting final acceptance.  
**Public release:** `Witch_Scripts` commit `4bb0cc9ff18b7d797ead8d16f7a63032250616cf`

## Validated architecture

Texture Quality owns source policy for the active figure/session only: atlasScale BL/BU/face = 4, bake seed 2048, used-size seed 1024 minimum, exact real 1024 body masks, and HeroForge-native data/change/buildAtlas/refresh/update ownership. Verification requires coherent display/resource atlas identity, valid target allocations and exact pinned 1024 body color-bake masks.

Do not reintroduce custom `CK.Atlas`, `buildAtlas` wrapping/replacement, direct atlas assignment, giant-atlas forcing, persistent atlas ownership, or stale cross-figure snapshots.

## Stable baseline

Stable v0.1.0 has no persistence. Blood Moon public acceptance is closed PASS; Bridge #1747/#1748/#1750 and Amanda's visual confirmation remain the protected baseline.

## Dev persistence UX

- default OFF;
- manual Enable is session-only without persistence;
- `Persistent` stores only boolean desired intent;
- reload/figure change creates a fresh reconcile session;
- manual Disable while persistent is a page-session suppression cleared by manual Enable or reload;
- unchecking persistence stops future automatic behavior but does not force an active session OFF;
- `Reconcile Now` is under collapsed `Advanced`.

Service v0.2.1 / `0.2.1-dev-visible-auto-enable` fixes the confirmed hidden-tab scheduler failure by refusing automatic start while HeroForge is hidden and scheduling the normal path on `visibilitychange`. Manual Enable and the validated reconcile/restore architecture are unchanged.

## Clean-restart runtime note

Bridge #1764 saw one cold-start automatic attempt fail before the exact 1024 body masks were available. The final HeroForge figure identity then triggered a fresh bounded attempt, and #1765 verified the same runtime ON with no error, coherent 4096x4096 atlas, generation adoption, 2048 BL/BU/face allocations and 2048 used sizes. This is currently a self-recovering startup transition; final cold reload must confirm it does not become a persistent user-visible defect.

## Phase 1 announcement

`features/rendering/Texture_Quality_Beta_Notice.js` v0.1.0 / `0.1.0-phase1-announcement` is an isolated optional module. It waits for Witch Dock and the Texture Quality service, presents the one-time `Nat 20: New Beta Unlocked!` rollout notice, and writes only `kw.witchDock.textureQuality.betaNotice.phase1.v1 = ack` after explicit `OK` acknowledgement. It has no renderer or persistence-preference ownership.

## Next gate

Validate the notice first-run/dismissal/no-repeat behavior and finish persistence session regression, atlas/mask verification and Booth smoke. Then Amanda performs the final modal/Utilities visual gate and a cold reload; figure-change navigation follows if needed. Stable remains untouched until explicit narrow promotion.
