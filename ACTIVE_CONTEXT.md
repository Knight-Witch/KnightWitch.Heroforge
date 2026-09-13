# Active Context — WITCH_DEV_UI

**Updated:** 2026-09-13  
**Current task:** Texture Quality persistence + Phase 1 announcement polish — finish v0.1.2 visual/UX gate and final cold-reload validation.  
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

- service v0.2.1 / build `0.2.1-dev-visible-auto-enable`;
- UI v0.2.0 / build `0.2.0-dev-persistence-advanced-controls`;
- isolated beta notice v0.1.2 / build `0.1.2-centered-sleek-title`.

Approved persistence semantics remain:

- default/first-time Texture Quality OFF;
- manual Enable is session-only when persistence is unchecked;
- `Persistent` stores only a boolean desired preference;
- page/figure changes always create a fresh reconcile session; no renderer/session/snapshot/mask/display/modded/atlas objects persist;
- manual Disable while persistent is checked suppresses High Res only for the page session; manual Enable or reload clears that suppression;
- unchecking persistence stops future automatic behavior without forcing an active session OFF;
- `Reconcile Now` remains under collapsed `Advanced`.

## Persistence/runtime evidence

v0.2.0 failed when automatic persistence started in a hidden tab. Evidence #1755/#1757/#1760. Service v0.2.1 gates automatic start on visible HeroForge and schedules again on `visibilitychange`; exact static validation passed #1761.

After Chrome restart, a transient cold-start mask-load failure at #1764 self-recovered on the final HeroForge figure identity; #1765 then verified ON/no error. Temporary Disable and manual re-enable passed #1769/#1770, and #1771/#1772 confirmed coherent atlas/masks plus Booth topology/UI presence.

## Phase 1 announcement

The announcement remains an isolated optional module so notice failure cannot break Texture Quality. It stores only `kw.witchDock.textureQuality.betaNotice.phase1.v1 = ack` after `OK`.

Amanda approved v0.1.1 copy density. v0.1.2 is the final hierarchy/font polish pass: centered section headings, a lighter/sleeker main-title font treatment, and two centered closing lines with the support/contact sentence on its own line. The Discord hyperlink and acknowledgement key remain unchanged.

## Chrome-only loader side observation

Amanda observed a sudden Chrome/Tampermonkey-only Witch Dock startup slowdown that does not reproduce in Firefox and affects both Dev and Stable. A live direct-fetch probe returned the same Dev manifest/Utilities/Texture Quality UI files in roughly 22–55 ms while feature modules were still unregistered, so no Witch Dock loader rewrite is justified yet. Treat Chrome/Tampermonkey/profile runtime state as the leading suspect unless further evidence changes that conclusion.

## Next gate

Static-check the exact v0.1.2 notice + manifest candidate, move `WITCH_DEV_UI` only after PASS, hot-load/clear only the Dev notice acknowledgement marker, then use Amanda for the revised modal visual/UX check. Continue Bridge validation autonomously for `OK` acknowledgement/no-repeat and the remaining cold-reload/figure persistence checks. Stable remains protected until explicit promotion.

## Architecture that must not regress

Keep HeroForge native atlas/generation ownership. Texture Quality owns only source policy and exact real 1024 body-mask overrides for the active session. Do not reintroduce custom `CK.Atlas`, `buildAtlas` wrapping, direct atlas assignment, giant-atlas forcing, persistent atlas ownership, or stale cross-figure snapshots.
