# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-19  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Active release task:** issue #28 — modular architecture public promotion  
**Validated source task:** issue #10 COMPLETE/CLOSED  
**Canonical Dev candidate:** launcher v1.5.1 / build `1.5.1-canonical-dev-reconcile`  
**Pinned immutable payload:** `6603911658b426c6b95367697bedcc4c7acf67eb`  
**Public Stable baseline:** `Witch_Scripts` @ `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4` — protected and untouched.

## Current phase

Release preparation only. Reconcile the validated issue #10 architecture into canonical Dev, smoke that exact canonical channel, then build an isolated public RC. No new feature work.

The canonical candidate differs from the validated v1.5.0 architecture only at the Dev channel/release boundary:
- launcher advances to v1.5.1;
- update/download URLs and channel state identify `WITCH_DEV_MAIN`;
- runtime payload pins immutable commit `6603911658b426c6b95367697bedcc4c7acf67eb`;
- payload fallback URLs are normalized to `WITCH_DEV_MAIN`;
- Core remains v2.0.0, Loader remains v0.2.0, and feature/module source bytes remain the validated architecture.

## Immediate sequence

1. Complete the two-parent reconciliation merge into `WITCH_DEV_MAIN`, preserving the main-only task/mode governance commit and validated #10 history.
2. Bridge-reload HeroForge through the installed Dev auto-host.
3. Require canonical smoke: v1.5.1, branch `WITCH_DEV_MAIN`, pinned payload `660391...`, legacy monolith/source transforms false, Core v2.0.0 running, Loader 23/23 / 0 failed, immutable resolution count 23 / fallback 0, Dock normal.
4. Preserve current Stable as an immutable rollback ref.
5. Create an isolated public RC/publicization branch.
6. Convert only explicit Dev/public channel identity and release metadata; remove migration-only scaffolding not appropriate for public.
7. Test the exact public-ready RC on HeroForge.
8. Stop at the explicit Stable-promotion approval gate.
9. After approved promotion + Stable smoke, run issue #14 janitorial/reconciliation automatically.

## Protected state

- Do not reopen or resume issue #10.
- Do not mutate `Witch_Scripts` before Amanda approves the tested public RC.
- Preserve storage keys, module order/cache behavior, failure isolation, public `WitchDock` seams, layout/interactions, and immutable payload pairing.
- Keep the fixed Tampermonkey Dev identity `WITCH DOCK - DEV`; version stays in `@version` and visible Dock title.
- HF-Chat-Bridge remains validation infrastructure only.

## Current divergences

- #19: canonical Dev channel identity/runtime routing.
- #28: validated modular architecture awaiting public RC/promotion.

## Minimum continuation set

1. `PROJECT_CONTRACT.md`
2. this file
3. issue #28
4. issue #14
5. `DEV_DIVERGENCES.json`
6. `Witch_Dock_DEV.user.js`
7. `manifest.json`
8. only files directly required by the release phase

Do not preload old #10 logs/history unless a specific release discrepancy requires provenance.
