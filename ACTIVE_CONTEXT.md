# Active Context — WITCH_DEV_UI

**Updated:** 2026-09-13  
**Current task:** Texture Quality heavy-figure persistence race — validate service v0.2.3 stable-renderer auto-readiness on Seya and Twilight Soak.  
**Runtime posture:** public Stable Texture Quality v0.1.0 remains released/accepted and untouched.

## Minimum continuation set

Read only:

1. `PROJECT_CONTRACT.md`
2. this file
3. `HISTORY/BULLSHIT/TEXTURE_QUALITY_NATIVE_RECONCILE.md`
4. `features/rendering/Texture_Quality_Native_Reconcile.js`
5. `features/rendering/Texture_Quality_Native_Reconcile_UI.js`
6. `features/rendering/Texture_Quality_Beta_Notice.js`
7. `MODULE_VERSIONING.md` only if another code/version change is about to be committed

Do not preload full repo history/changelog/preflight unless a current question specifically routes there.

## Public Stable — protected PASS

Public `Witch_Scripts` promotion commit: `4bb0cc9ff18b7d797ead8d16f7a63032250616cf`.

Stable remains service v0.1.0 / `0.1.0-dev-hfc-alpha3-port` + UI v0.1.0 / `0.1.0-dev-texture-quality-controls`. Blood Moon acceptance is closed PASS with Bridge #1747/#1748/#1750 and Amanda visual PASS.

## Current Dev candidate

- service v0.2.3 / build `0.2.3-dev-stable-auto-readiness`;
- UI v0.2.0 / build `0.2.0-dev-persistence-advanced-controls`;
- isolated beta notice v0.1.2 / build `0.1.2-centered-sleek-title`.

Persistence semantics remain unchanged: default OFF; boolean-only `Persistent`; fresh page/figure session; manual Disable while persistent is page-session suppression; manual Enable/reload clears suppression; unchecking persistence stops future auto behavior without forcing an active session off; `Reconcile Now` remains under collapsed `Advanced`.

## D4 v0.2.2 — closed PASS

v0.2.2 fixed D4's promoted body-mask path case by resolving body mask paths under a temporary exact 1024 used-size seed and restoring the prior value immediately. D4 then passed automatic and manual High Res, exact 1024 mask verification, Amanda visual quality, and a genuine cold reload with stored Persistent=true. Bridge #1790-#1794.

## Heavy transition race — confirmed

A normal library save transitioned successfully, but heavy Seya and Twilight Soak could show an early Persistent High Res failure while the figure was still loading. Twilight Soak is Amanda's largest kitbash and remains the preferred future motherload benchmark.

Bridge #1797 captured Twilight Soak failed with `Timed out waiting for native reconciliation to settle.`; one transition verification had bodyLower packed at 512x512. #1798 later showed the restored native Twilight state fully idle with `finished=true`, `resourcesReady=true`, and coherent 4096x4096 display/resource atlases.

One bounded manual v0.2.2 Enable on that already-settled Twilight state succeeded in about 3.9 seconds, verified native 4096x4096, 2048x2048 bodyLower/bodyUpper/face allocations, and exact 1024 body masks (#1800). Therefore this observed failure is an automatic-start readiness race, not a demonstrated Phase 1 atlas-capacity limit.

## v0.2.3 change

Only automatic Persistent start timing changes. Before calling the existing `enable({automatic:true})` path, the service requires HeroForge scheduler idle, resources/finished not false, coherent native atlas identity, and the same character/data/display/modded/atlas plus full part signature and target allocations to remain unchanged for 1200 ms. The 30-second bound and visibility gating remain. Manual Enable is unchanged.

The High Res transaction, scale/bake/used policy, D4 mask-path fix, native atlas ownership, generation adoption, verifier, rollback, UI, persistence storage semantics and notice are unchanged.

## Phase 1 announcement

Notice v0.1.2 is visually approved for now. It remains isolated, uses the centered sleek hierarchy and direct Discord link, and writes only `kw.witchDock.textureQuality.betaNotice.phase1.v1 = ack` after `OK`.

## Next gate

Static-check the exact detached v0.2.3 service/manifest candidate before moving `WITCH_DEV_UI`. Then load exact v0.2.3 into the current settled Twilight page and confirm stored Persistent=true auto-enables cleanly. After that Amanda switches, without touching Texture Quality, to Seya and then Twilight Soak. Bridge verifies each fresh figure waits for quiescence and reaches ON with coherent atlas, valid target allocations, exact 1024 body masks and idle scheduler. Amanda supplies visual confirmation. Stable remains protected until explicit narrow promotion approval.

## Architecture that must not regress

Keep HeroForge native atlas/generation ownership. Texture Quality owns only source policy and exact real 1024 body-mask overrides for the active session. Do not reintroduce custom `CK.Atlas`, `buildAtlas` wrapping, direct atlas assignment, giant-atlas forcing, persistent atlas ownership, or stale cross-figure snapshots.
