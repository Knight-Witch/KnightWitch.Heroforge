# Texture Quality — Native Reconcile

**Status:** Public Stable v0.1.0 accepted; Dev persistence service v0.2.2 + UI v0.2.0 + isolated Phase 1 notice v0.1.2 under final D4/cold-reload/figure-transition validation.  
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

Service v0.2.1 / `0.2.1-dev-visible-auto-enable` fixed the confirmed hidden-tab scheduler failure by refusing automatic start while HeroForge is hidden and scheduling the normal path on `visibilitychange`.

## D4 promoted-mask edge case and v0.2.2 fix

During the final persistence gate, Amanda enabled Persistent and reloaded D4. Bridge #1783 proved persistence storage was correct (`persistent=true`, localStorage `true`), while automatic and manual enable both failed on `Valid 1024px body masks did not load.`

#1785/#1786 reduced the cause to current HeroForge `Part.getMaskPath`: for non-artSource parts it updates `_usedTextureSize` only when the requested size is larger than the current value. D4's `humanToes` and `human` body parts had already reached `_usedTextureSize=2048`, so `getMaskPath(...,1024)` could not lower them and returned nonexistent `*_mask_2048` assets instead of the required 1024 body masks.

Bridge #1787 tested a bounded reversible correction: snapshot each body part's current `_usedTextureSize`, temporarily set it to exactly 1024 only while calling `getMaskPath`, then immediately restore the prior property/value before loading the resolved resources. D4 returned `humanToes_mask_1024.webp` and `human_mask_1024.webp`; both loaded as exact 1024x1024 textures and the original 2048 used-size state was restored with the character scheduler idle.

Service v0.2.2 / `0.2.2-dev-mask-path-clamp` implements that narrow resolver with the existing `own`/`restore` property-snapshot helpers. It does not change the native reconcile recipe or allow 2048 body masks. It also checks whether any owned policy snapshot was actually recorded before running the failure rollback/native restore path; a mask-load failure before `applyPolicy` no longer needlessly regenerates HeroForge state.

HeroForge.Compatibility `feature/rendering-texture-quality` was consulted for this unresolved engine edge case. Its maintained evidence already documented D4 native source promotion and the 1024-mask hazard; the native-reconcile alpha record also states Alpha.3 D4 live validation was still pending, explaining why this cross-figure defect survived the initial port.

## Phase 1 announcement

`features/rendering/Texture_Quality_Beta_Notice.js` is now v0.1.2 / `0.1.2-centered-sleek-title`. It remains isolated from service/persistence state, uses the approved centered hierarchy and direct Discord link, and writes only `kw.witchDock.textureQuality.betaNotice.phase1.v1 = ack` after explicit `OK` acknowledgement.

## Next gate

Static-validate the exact v0.2.2 service/manifest candidate, then live-test the current D4 with stored Persistent=true. Require successful automatic enable, coherent atlas/resource identity, valid target source/allocation bounds, exact pinned 1024 masks and idle scheduler; Amanda visually checks D4 body/decal quality. Then repeat a cold reload and fresh figure transition. Stable remains untouched until explicit narrow promotion approval.
