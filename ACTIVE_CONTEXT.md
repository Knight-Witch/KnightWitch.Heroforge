# Active Context — WITCH_DEV_UI

**Updated:** 2026-09-13  
**Current task:** Texture Quality heavy-figure native settle timing — validate service v0.2.4 on Seya and Twilight Soak.  
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

- service v0.2.4 / build `0.2.4-dev-heavy-native-settle`;
- UI v0.2.0 / build `0.2.0-dev-persistence-advanced-controls`;
- isolated beta notice v0.1.2 / build `0.1.2-centered-sleek-title`.

Persistence semantics remain unchanged: default OFF; boolean-only `Persistent`; fresh page/figure session; manual Disable while persistent is page-session suppression; manual Enable/reload clears suppression; unchecking persistence stops future auto behavior without forcing an active session off; `Reconcile Now` remains under collapsed `Advanced`.

## D4 v0.2.2 — closed PASS

v0.2.2 fixed D4's promoted body-mask path case by resolving body mask paths under a temporary exact 1024 used-size seed and restoring the prior value immediately. D4 then passed automatic and manual High Res, exact 1024 mask verification, Amanda visual quality, and a genuine cold reload with stored Persistent=true. Bridge #1790-#1794.

## Heavy transition readiness — v0.2.3 finding

v0.2.3 fixed the early automatic-start race by waiting for a visible, coherent, idle HeroForge generation and a stable figure/part signature for 1200 ms before Persistent High Res starts.

On current Seya testing, that readiness gate worked, but the subsequent native reconcile still exposed a separate timing defect: the service could report `Timed out waiting for native reconciliation to settle.` while HeroForge was still doing legitimate heavy native work.

A normal Seya reconcile Bridge run lasted about 35.4 seconds and returned the timeout. A cleanup `disable()`/native restore lasted about 65.7 seconds and returned the same restore warning. After the warning, direct reads showed HeroForge fully idle and coherent again: `_needsUpdating=false`, `_inUpdate=false`, `finished=true`, `resourcesReady=true`, display/resource atlas 4096x4096.

Therefore the current confirmed defect is the fixed 12-second `settle()` budget, not a failure of the v0.2.3 automatic readiness gate.

## v0.2.4 change

Only native settle timing changes. `settle()` now has a 120-second bounded budget and checks current renderer coherence before enforcing the expired deadline. If control returns after the deadline with an already-ready renderer, it allows only a short bounded set of confirmation polls so the existing 3-sample stability rule can complete.

The High Res transaction, scale/bake/used policy, D4 mask-path fix, exact body masks, native atlas ownership, generation adoption, verifier, rollback semantics, automatic readiness gate, persistence storage, UI and notice are unchanged.

Exploratory 8192 atlas, broader non-body scaling and projected/splatter source-ceiling probes are not part of v0.2.4 and must not be treated as accepted architecture.

## Phase 1 announcement

Notice v0.1.2 is visually approved for now. It remains isolated, uses the centered sleek hierarchy and direct Discord link, and writes only `kw.witchDock.textureQuality.betaNotice.phase1.v1 = ack` after `OK`.

## Next gate

Static-check the exact detached v0.2.4 service/manifest candidate before moving `WITCH_DEV_UI`. Then hot-load exact v0.2.4 into the current clean Seya page with stored Persistent=true and no manual Enable. Require automatic ON, no timeout, coherent native atlas, valid target allocations, exact 1024 body masks and idle scheduler; Amanda confirms visual state. Then repeat fresh Seya/Twilight Soak transitions. Stable remains protected until explicit narrow promotion approval.

## Architecture that must not regress

Keep HeroForge native atlas/generation ownership. Texture Quality owns only source policy and exact real 1024 body-mask overrides for the active session. Do not reintroduce custom `CK.Atlas`, `buildAtlas` wrapping/replacement, direct atlas assignment, giant-atlas forcing, persistent atlas ownership, or stale cross-figure snapshots.
