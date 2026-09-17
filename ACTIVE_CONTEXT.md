# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-17  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Active architecture branch:** `wd/10-modular-bootstrap`  
**Canonical installed Dev userscript:** `Witch_Dock_DEV.user.js`  
**Stable baseline used to create this branch:** `Witch_Scripts` @ `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`  
**Current phase:** issue #10 Stage B candidate — bounded privileged-host seam added to the architecture-branch Dev launcher; monolithic core behavior remains untouched pending live validation.

## Current priorities

1. #10 — validate `Witch_Dock_DEV.user.js` v1.3.0 / build `1.3.0-dev-privileged-host-seam` on `wd/10-modular-bootstrap`. Read `ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md` before changing runtime ownership.
2. #19 — canonical Dev identity remains protected. Task-branch self-routing is temporary and must normalize back to `WITCH_DEV_MAIN` before integration.
3. #12 — audit legacy `WITCH_DEV_UI` / `WITCH_DEV` only for still-useful unresolved fragments; do not bulk merge.
4. #7 / #8 — preserve open bug/backlog items and re-test them against the new Stable-derived Dev before migrating any old patch.
5. #13 — retire obsolete branches only after the harvest audit proves nothing useful is stranded there.
6. #14 — enforce Dev -> Stable post-rollout cleanup automatically once Stable smoke passes; do not ask Amanda for a separate cleanup approval.

## Protected state

- Public `Witch_Scripts` remains untouched unless Amanda explicitly authorizes a narrow promotion.
- `WITCH_DEV_MAIN` remains the canonical integration branch; `wd/10-modular-bootstrap` is short-lived issue-scoped work.
- `Witch_Dock.user.js` is still byte-identical to the Stable-derived monolithic core in Stage B.
- The task branch launcher/manifest self-route to `wd/10-modular-bootstrap` only so isolated live tests exercise the task branch accurately.
- Existing storage keys, public `WitchDock` seams, cache-key behavior, loader ordering/performance, module enablement, Dock appearance/interactions, and feature lifecycle behavior remain protected by `ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md`.
- The new privileged host is launcher-local. Raw `GM_*` functions are not exposed as a page-global API; only `KWWitchDockHostInfo` diagnostic metadata is page-visible.

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

1. Install/update the raw task-branch `Witch_Dock_DEV.user.js` with public Stable disabled.
2. Confirm Tampermonkey and Dock title show `WITCH DOCK - DEV v1.3.0`.
3. Confirm `KWWitchDockDevChannel.branch`, `coreUrl`, `manifestUrl`, and `KWWitchDockManifestURL` resolve to `wd/10-modular-bootstrap`.
4. Confirm `KWWitchDockHostInfo.apiVersion === "0.1.0"`, `rawPrivilegesExposed === false`, and expected capability flags are present.
5. Confirm `KWModuleLoader` completes with expected module count/zero unexpected failures and representative module URLs come from the task branch.
6. Confirm basic Dock interaction remains unchanged.
7. Only after Stage B passes begin the first low-risk extraction; do not combine extraction with the host-seam validation.
