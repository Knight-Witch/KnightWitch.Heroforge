# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-17  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Active architecture branch:** `wd/10-modular-bootstrap`  
**Canonical installed Dev userscript:** `Witch_Dock_DEV.user.js`  
**Stable baseline used to create this branch:** `Witch_Scripts` @ `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`  
**Current phase:** issue #10 Stage C candidate — Stage B privileged-host seam passed live; bootstrap core fetching now routes through the host before any monolith extraction.

## Current priorities

1. #10 — validate `Witch_Dock_DEV.user.js` v1.3.1 / build `1.3.1-host-owned-core-fetch` on `wd/10-modular-bootstrap`, then begin the first physical extraction from `Witch_Dock.user.js`.
2. #19 — canonical Dev identity remains protected. Task-branch self-routing is temporary and must normalize back to `WITCH_DEV_MAIN` before integration.
3. #12 — audit legacy `WITCH_DEV_UI` / `WITCH_DEV` only for still-useful unresolved fragments; do not bulk merge.
4. #7 / #8 — preserve open bug/backlog items and re-test them against the new Stable-derived Dev before migrating any old patch.
5. #13 — retire obsolete branches only after the harvest audit proves nothing useful is stranded there.
6. #14 — enforce Dev -> Stable post-rollout cleanup automatically once Stable smoke passes; do not ask Amanda for a separate cleanup approval.

## Completed live milestone — Stage B PASS

On task branch v1.3.0:

- human gate: Tampermonkey/Dock identity presented correctly and basic Dock behavior appeared normal;
- Bridge v0.3.2 was healthy and page context available;
- `KWWitchDockDevChannel` reported branch `wd/10-modular-bootstrap`, host API v0.1.0, correct task core/manifest URLs;
- `KWWitchDockHostInfo` reported `rawPrivilegesExposed: false` and all expected privileged capabilities available;
- visible `#kwWDTitle` was `WITCH DOCK - DEV v1.3.0` with task-branch provenance;
- module loader completed from the task manifest: 23 enabled / 23 started / 23 fetched / 23 executed / 0 failed in 505.7 ms;
- Dev state reported `running` with `error: null`.

## Protected state

- Public `Witch_Scripts` remains untouched unless Amanda explicitly authorizes a narrow promotion.
- `WITCH_DEV_MAIN` remains the canonical integration branch; `wd/10-modular-bootstrap` is short-lived issue-scoped work.
- `Witch_Dock.user.js` remains byte-identical to the Stable-derived monolithic core through Stage C.
- The task branch launcher/manifest self-route to `wd/10-modular-bootstrap` only so isolated live tests exercise the task branch accurately.
- Existing storage keys, public `WitchDock` seams, cache-key behavior, loader ordering/performance, module enablement, Dock appearance/interactions, and feature lifecycle behavior remain protected by `ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md`.
- The privileged host is launcher-local. Raw `GM_*` functions are not exposed as a page-global API; only `KWWitchDockHostInfo` diagnostic metadata is page-visible.

## Minimum continuation set

1. `PROJECT_CONTRACT.md`;
2. this file;
3. `ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md`;
4. issue #10;
5. `Witch_Dock_DEV.user.js`;
6. `manifest.json`;
7. `DEV_DIVERGENCES.json`;
8. `Witch_Dock.user.js` only for the responsibility currently being extracted;
9. `MODULE_VERSIONING.md` when runtime/version changes are made.

Do not preload `MASTER.md`, full historical logs, unrelated `HISTORY/BULLSHIT/*`, or HeroForge.Compatibility unless current evidence specifically requires them.

## Immediate next technical sequence

1. Install/update the raw task-branch `Witch_Dock_DEV.user.js` and confirm `WITCH DOCK - DEV v1.3.1`.
2. Use HF-Chat-Bridge to confirm `KWWitchDockHostInfo.bootstrapTransport === "host.requestText"` and Dev state reports the same bootstrap transport with `status: running` / no error.
3. Confirm module loader still completes 23/23 with zero failures from the task manifest and basic Dock interaction remains unchanged.
4. After Stage C passes, begin the first physical extraction: externalize presentation/static payload first (CSS and compact emblem), leaving storage, registration, interaction, and module-loader contracts unchanged.
5. Validate each extraction before proceeding to application-shell/state extraction.
