# Texture Quality — Native Reconcile

**Status:** Public Stable v0.1.0 accepted; Dev persistence service v0.2.3 + UI v0.2.0 + isolated Phase 1 notice v0.1.2 under heavy-transition validation.  
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

## v0.2.1 — hidden-tab gate

v0.2.1 / `0.2.1-dev-visible-auto-enable` fixed automatic persistence starting in hidden HeroForge tabs by waiting for a visible runtime and rescheduling on `visibilitychange`.

## v0.2.2 — D4 promoted-mask edge case

D4 persisted `Persistent=true` correctly but automatic and manual enable failed because body parts already at `_usedTextureSize=2048` caused HeroForge `getMaskPath(...,1024)` to continue resolving nonexistent 2048 mask paths. Bridge #1785-#1787 proved an exact temporary 1024 seed resolves D4's real `humanToes_mask_1024.webp` / `human_mask_1024.webp` resources and restores the previous used-size immediately.

v0.2.2 / `0.2.2-dev-mask-path-clamp` implemented that narrow resolver and skipped native restore when a failure occurred before any Texture Quality-owned policy state was touched. D4 then passed automatic/manual enable, exact masks, Amanda visual quality and cold reload persistence (#1790-#1794).

## v0.2.3 — heavy figure automatic-start readiness

During fresh figure-transition testing, a normal library save passed while heavy Seya and Twilight Soak could display an early failure and later recover. Twilight Soak is Amanda's largest kitbash and is retained as the future motherload stress figure.

Bridge #1797 captured Twilight Soak with service OFF after `Timed out waiting for native reconciliation to settle.`; a transition verification had bodyLower packed at only 512x512. #1798 showed that after the failed attempt/restore, native HeroForge itself eventually reached a fully idle state with `finished=true`, `resourcesReady=true` and coherent 4096x4096 display/resource atlases.

One at-most-once manual v0.2.2 `enable()` after that settled state succeeded in about 3.9 seconds and verified native 4096x4096, 2048x2048 allocations for bodyLower/bodyUpper/face, scale 4 / bake 2048 / used 2048, and exact 1024 body masks (#1800). This directly rules out a demonstrated atlas-capacity failure for Twilight Soak in this test and identifies premature automatic start as the current defect.

v0.2.3 / `0.2.3-dev-stable-auto-readiness` therefore changes only the automatic Persistent gate. Before the existing `enable({automatic:true})` transaction is invoked, it requires:

- visible document;
- capabilities available;
- `_needsUpdating=false` and `_inUpdate=false`;
- display `resourcesReady` / `finished` not false;
- existing display atlas equal to native resource atlas;
- unchanged character, data, display, modded and atlas identities;
- unchanged full part identity signature plus bodyLower/bodyUpper/face allocations;
- the above state continuously stable for 1200 ms.

The quiet window resets on generation/signature change. The existing 30-second bound remains. If the page becomes hidden while waiting, the attempt exits without consuming the current identity so the foreground visibility path can schedule again. Manual Enable is unchanged.

This patch deliberately does not alter the High Res recipe, packing targets, mask contract, native reconcile lifecycle, verifier or rollback. Twilight Soak may still be useful for discovering the actual motherload capacity ceiling later, but this observed failure was timing, not that ceiling.

## Phase 1 announcement

`features/rendering/Texture_Quality_Beta_Notice.js` v0.1.2 / `0.1.2-centered-sleek-title` remains isolated from service/persistence state, uses the approved centered hierarchy and direct Discord link, and writes only `kw.witchDock.textureQuality.betaNotice.phase1.v1 = ack` after explicit `OK` acknowledgement.

## Next gate

Static-validate the exact v0.2.3 service/manifest candidate, then load it on settled Twilight Soak with stored Persistent=true. Next perform fresh Seya and Twilight Soak transitions without manual Texture Quality input. Require successful automatic ON state, coherent native atlas, valid target allocations, exact pinned 1024 masks and idle scheduler, plus Amanda visual confirmation. Stable remains untouched until explicit narrow promotion approval.
