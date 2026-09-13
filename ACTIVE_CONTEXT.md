# Active Context — WITCH_DEV_UI

**Updated:** 2026-09-12  
**Current task:** Texture Quality persistence + isolated Phase 1 announcement — finish live Dev regression and human visual/UX gate.  
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
- isolated beta notice v0.1.0 / build `0.1.0-phase1-announcement`.

Approved persistence semantics:

- default/first-time Texture Quality OFF;
- manual Enable is session-only when persistence is unchecked;
- `Persistent` stores only a boolean desired preference;
- page/figure changes always create a fresh reconcile session; no renderer/session/snapshot/mask/display/modded/atlas objects persist;
- manual Disable while persistent is checked suppresses High Res only for the page session; manual Enable or reload clears that suppression;
- unchecking persistence stops future automatic behavior without forcing an active session OFF;
- `Reconcile Now` remains under collapsed `Advanced`.

## Scheduler/readiness evidence

v0.2.0 failed when automatic persistence started in a hidden tab. Evidence #1755/#1757/#1760. Service v0.2.1 now gates automatic start on visible HeroForge and schedules again on `visibilitychange`; exact static validation passed #1761.

After Chrome restart, #1764 briefly observed a cold-start 1024-mask load failure; the final HeroForge figure identity then caused the bounded automatic path to run fresh and #1765 verified ON/no error with coherent 4096x4096 atlas and 2048 target allocations/used sizes. Recheck this on the final cold reload before release; do not alter the validated architecture unless it reproduces as a persistent defect.

## Phase 1 announcement

The notice is deliberately separate from the Texture Quality UI so optional announcement failure cannot break the tool. It waits for Witch Dock + Texture Quality service, shows `Nat 20: New Beta Unlocked!`, and stores only `kw.witchDock.textureQuality.betaNotice.phase1.v1 = ack` after the user clicks `OK`.

The copy covers Phase 1 scope/limits, expected load settling, future optimization/tier roadmap, crash-state recovery, and the instruction to disable only FRD/T's three Decal Resolution toggles rather than the whole script.

## Next gate

Use HF-Chat-Bridge autonomously for announcement static/runtime checks, persistence Disable/manual re-enable, atlas/mask + Booth smoke. Then clear the test acknowledgement marker and use one human reload for the true first-run modal visual gate plus cold-reload persistence check. Figure switching may require one human navigation action if Bridge cannot do it safely.

## Architecture that must not regress

Keep HeroForge native atlas/generation ownership. Texture Quality owns only source policy and exact real 1024 body-mask overrides for the active session. Do not reintroduce custom `CK.Atlas`, `buildAtlas` wrapping, direct atlas assignment, giant-atlas forcing, persistent atlas ownership, or stale cross-figure snapshots.
