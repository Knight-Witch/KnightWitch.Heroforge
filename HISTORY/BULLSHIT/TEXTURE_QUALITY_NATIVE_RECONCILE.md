# Texture Quality — Native Reconcile

**Status:** Public Stable v0.1.0 accepted; Dev v0.2.1 persistence candidate awaiting fresh live validation.  
**Public release:** `Witch_Scripts` commit `4bb0cc9ff18b7d797ead8d16f7a63032250616cf`

## Validated architecture

Texture Quality owns source policy for the active figure/session only:

- `atlasScale.bodyLower/bodyUpper/face = 4`;
- seed `bakeSize = 2048`;
- seed `_usedTextureSize = 1024` minimum;
- exact real 1024 bodyLower/bodyUpper mask textures are pinned;
- HeroForge retains native atlas/generation ownership and its normal data/change/buildAtlas/refresh/update lifecycle;
- replacement display/modded generations may be adopted only while character/data/target-part identity remains valid;
- verification requires coherent display/resource atlas identity, valid high-resolution target allocations, and exact 1024 body color-bake masks.

Do **not** reintroduce custom `CK.Atlas`, `buildAtlas` wrapping/replacement, direct atlas assignment, giant-atlas forcing, persistent atlas ownership, or stale cross-figure snapshots.

## Public Stable v0.1.0

Stable has no persistent preference. Same-figure native renderer refresh remains ON; figure change discards the active session OFF; page reload starts OFF/inert.

Stable Blood Moon acceptance is closed PASS. Bridge evidence #1747/#1748/#1750 and Amanda's visual confirmation remain the protected release baseline.

## Dev persistence UX

Approved behavior:

- first-time/default state OFF;
- manual Enable is session-only when persistence is unchecked;
- `Persistent` stores only a boolean desired preference;
- each page/figure always creates a fresh reconcile session; no snapshots, masks, atlas/display/modded objects, or other renderer state persist;
- manual Disable while persistence is checked is a page-session suppression cleared by manual Enable or reload;
- unchecking persistence stops future automatic behavior without forcing the active current session OFF;
- `Reconcile Now` is retained under collapsed `Advanced` with recovery guidance.

UI candidate remains v0.2.0 / build `0.2.0-dev-persistence-advanced-controls`.

## Hidden-tab failure and v0.2.1 correction

The first service persistence candidate, v0.2.0, was live-tested through HF-Chat-Bridge while the HeroForge tab was hidden. HeroForge exposed the required capability objects, but its native update loop did not progress. The automatic reconcile remained `_needsUpdating=true`, display/resource atlas identity diverged, and both reconcile and recovery restore timed out. Evidence: Bridge #1755/#1757/#1760.

This is a scheduler/readiness issue, not a reason to alter the validated texture architecture.

Service v0.2.1 / build `0.2.1-dev-visible-auto-enable` therefore:

- refuses to start **automatic** persistent enable while `document.hidden` or `visibilityState !== 'visible'`;
- listens for `visibilitychange` and schedules the same safe automatic enable path once HeroForge becomes visible;
- leaves manual Enable unchanged;
- leaves stale-figure refusal, native ownership, source policy, mask pinning, settle/verify/restore behavior, boolean persistence, and temporary session suppression otherwise unchanged.

Chrome/Bridge were restarted after the failed v0.2.0 probe, providing a clean runtime for v0.2.1 validation.

## Next gate

Validate v0.2.1 on `WITCH_DEV_UI`: clean load, default/persisted startup behavior, visible-tab automatic enable, hidden-tab no-op, temporary Disable suppression, manual re-enable, figure-change fresh-session behavior, atlas/mask verification, Booth topology smoke, then Amanda visual/UX confirmation. Public Stable remains untouched until an explicit narrow promotion.