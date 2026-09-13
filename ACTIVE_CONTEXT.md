# Active Context — WITCH_DEV_UI

**Updated:** 2026-09-13  
**Current task:** Texture Quality persistence regression on D4 — validate service v0.2.2 promoted-mask path fix, then finish cold-reload/figure-change gates.  
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

Do not preload full repo history/changelog/preflight unless a new question specifically routes there.

## Public Stable — protected PASS

Public `Witch_Scripts` promotion commit: `4bb0cc9ff18b7d797ead8d16f7a63032250616cf`.

Stable remains service v0.1.0 / `0.1.0-dev-hfc-alpha3-port` + UI v0.1.0 / `0.1.0-dev-texture-quality-controls`. Blood Moon acceptance is closed PASS with Bridge #1747/#1748/#1750 and Amanda visual PASS.

## Current Dev candidate

- service v0.2.2 / build `0.2.2-dev-mask-path-clamp`;
- UI v0.2.0 / build `0.2.0-dev-persistence-advanced-controls`;
- isolated beta notice v0.1.2 / build `0.1.2-centered-sleek-title`.

Persistence semantics remain unchanged: default OFF; boolean-only `Persistent`; fresh page/figure session; manual Disable while persistent is page-session suppression; manual Enable/reload clears suppression; unchecking persistence stops future auto behavior without forcing an active session off; `Reconcile Now` remains under collapsed `Advanced`.

## D4 regression — confirmed root cause

Amanda enabled persistence and reloaded D4. Persistence itself worked: Bridge #1783 read both service `persistent=true` and stored `kw.witchDock.textureQuality.persistent = true`. Automatic enable and a later manual Enable failed with `Valid 1024px body masks did not load.`

#1785/#1786 confirmed D4 bodyLower `humanToes` and bodyUpper `human` had been promoted to `_usedTextureSize=2048`. Current HeroForge `getMaskPath(hiRez,size)` only raises `_usedTextureSize`; asking for 1024 cannot lower an existing 2048 state, so it resolves nonexistent `*_mask_2048` resources.

Bridge #1787 proved the narrow correction: snapshot each body's current used size, temporarily seed exactly 1024 only while resolving `getMaskPath`, immediately restore the prior value, then load the returned resources. D4 resolved `humanToes_mask_1024.webp` and `human_mask_1024.webp`, both genuine 1024x1024, while original 2048 used-size values were restored and the character remained idle.

Service v0.2.2 applies that exact temporary mask-path clamp. It also skips native restore/rebuild when enable fails before any Texture Quality-owned policy field was touched; pre-policy mask failures should not regenerate HeroForge state.

HeroForge.Compatibility evidence was consulted because this was an unresolved engine edge case. Its native-reconcile alpha notes explicitly show D4 source promotion and state that Alpha.3 D4 live validation was still pending before the architecture moved into Witch Dock.

## Phase 1 announcement

Notice v0.1.2 is visually approved for now. It remains isolated, uses the sleek centered title/section hierarchy and two-line centered closing copy, links `@ Knight.Witch` directly to Discord, and stores only `kw.witchDock.textureQuality.betaNotice.phase1.v1 = ack` after `OK`.

## Chrome-only loader side observation

Amanda separately observed sudden Chrome/Tampermonkey-only Witch Dock startup slowdown affecting Dev and Stable but not Firefox. Direct raw-file fetches remained fast while module registration lagged, so no Witch Dock loader change is justified from current evidence.

## Next gate

Static-check the exact detached v0.2.2 service + manifest candidate before advancing `WITCH_DEV_UI`. Then use the Bridge to replace the currently failed v0.2.1 live service once, allowing stored Persistent=true to auto-enable D4. Read back once before any retry. Require coherent atlas identity, scale/bake/used/allocation bounds, exact pinned 1024 masks, idle scheduler and no error. Amanda then performs the D4 visual body/decal gate. After that, test cold reload persistence and a fresh figure transition. Stable remains protected until explicit promotion approval.

## Architecture that must not regress

Keep HeroForge native atlas/generation ownership. Texture Quality owns only source policy and exact real 1024 body-mask overrides for the active session. Do not reintroduce custom `CK.Atlas`, `buildAtlas` wrapping, direct atlas assignment, giant-atlas forcing, persistent atlas ownership, or stale cross-figure snapshots.
