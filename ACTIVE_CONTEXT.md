# Active Context — WITCH_DEV_UI

**Updated:** 2026-09-12  
**Current task:** Texture Quality persistence v0.2.1 — fresh live Dev validation after hidden-tab scheduler repair.  
**Runtime posture:** public Stable Texture Quality v0.1.0 remains released/accepted and untouched.

## Minimum continuation set

Read only:

1. `PROJECT_CONTRACT.md`
2. this file
3. `HISTORY/BULLSHIT/TEXTURE_QUALITY_NATIVE_RECONCILE.md`
4. `features/rendering/Texture_Quality_Native_Reconcile.js`
5. `features/rendering/Texture_Quality_Native_Reconcile_UI.js`
6. `MODULE_VERSIONING.md` only if another code/version change is about to be committed

Do not preload the full repo history/changelog/preflight unless a new question specifically routes there.

## Public Stable — protected PASS

Public `Witch_Scripts` promotion commit: `4bb0cc9ff18b7d797ead8d16f7a63032250616cf`.

Stable modules remain:

- service v0.1.0 / build `0.1.0-dev-hfc-alpha3-port`;
- UI v0.1.0 / build `0.1.0-dev-texture-quality-controls`.

Stable Blood Moon validation remains accepted; Bridge evidence #1747/#1748/#1750 and Amanda visual PASS close that release.

## Current Dev candidate

- service v0.2.1 / build `0.2.1-dev-visible-auto-enable`;
- UI v0.2.0 / build `0.2.0-dev-persistence-advanced-controls`.

Approved persistence semantics remain:

- default/first-time state OFF;
- manual Enable is session-only when persistence is unchecked;
- `Persistent` stores only a boolean desired preference;
- page/figure changes must always build a fresh reconcile session; no renderer/session/snapshot/mask/display/modded/atlas objects persist;
- manual Disable while persistence is checked is a page-session suppression cleared by manual Enable or reload;
- unchecking persistence stops future automatic behavior without forcing the current active session OFF;
- `Reconcile Now` lives under collapsed `Advanced`.

## Newly confirmed scheduler constraint

Live Bridge validation of v0.2.0 exposed a hidden-tab failure: HeroForge can expose renderer capabilities while its native update loop is not progressing. Starting persistent auto-enable in that state left `_needsUpdating=true`, display/resource atlas identity mismatched, and both reconcile and restore timed out. Evidence: #1755/#1757/#1760.

v0.2.1 therefore refuses to start **automatic** persistence while `document.hidden` or `visibilityState !== 'visible'`, and listens for `visibilitychange` so it can schedule the normal safe enable path when HeroForge becomes visible. Manual Enable behavior is unchanged.

## Next gate

Chrome/Bridge were restarted after the failed v0.2.0 probe. Finish the v0.2.1 Dev commit/static checks, then use HF-Chat-Bridge autonomously for a clean runtime validation. Amanda is needed only for final visual/UX confirmation and any genuinely human figure-navigation step that cannot be performed safely by Bridge.

## Architecture that must not regress

Keep HeroForge native atlas/generation ownership. Texture Quality owns only source policy and exact real 1024 body-mask overrides for the active session. Do not reintroduce custom `CK.Atlas`, `buildAtlas` wrapping, direct atlas assignment, giant-atlas forcing, persistent atlas ownership, or stale cross-figure snapshots.