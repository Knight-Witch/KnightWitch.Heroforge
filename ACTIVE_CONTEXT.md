# Active Context — Dev Auto Host

**Updated:** 2026-09-19  
**Branch:** `wd/dev-auto-host`  
**Current host candidate:** v0.1.1  
**Target:** canonical `WITCH_DEV_MAIN`  
**Release task:** issue #28  
**Public Stable:** untouched.

## Current state

The original v0.1.0 auto-host completed its live gate while issue #10 was isolated on `wd/10-modular-bootstrap`.

Issue #10 is now complete and its architecture has been reconciled into canonical `WITCH_DEV_MAIN`. The auto-host therefore advances narrowly to v0.1.1 so normal Dev delivery follows canonical Dev instead of the retired task branch.

Only the delivery target changes:
- host version 0.1.0 -> 0.1.1;
- `TARGET_BRANCH`: `wd/10-modular-bootstrap` -> `WITCH_DEV_MAIN`.

Identity/grant validation, retries, synthetic launcher `GM_info`, duplicate-host protection, direct-launcher conflict rejection, and visible failure behavior are unchanged.

## Required live gate

1. Update/install auto-host v0.1.1 once.
2. Keep direct `WITCH DOCK - DEV` disabled.
3. Reload HeroForge through the Bridge.
4. Require host target `WITCH_DEV_MAIN`, payload v1.5.1, launcher branch `WITCH_DEV_MAIN`, pinned payload `6603911658b426c6b95367697bedcc4c7acf67eb`, Core v2.0.0, Loader 23/23 / 0 failed.
5. Preserve human visual gate only if the canonical smoke shows an unexpected visual difference.

## Boundaries

- This host is development delivery infrastructure only.
- HF-Chat-Bridge remains development infrastructure only.
- Public `Witch_Scripts` is not changed by this update.
- Do not reintroduce task-branch routing after canonical smoke.
