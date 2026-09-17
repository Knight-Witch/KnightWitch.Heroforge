# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-17  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Active architecture branch:** `wd/10-modular-bootstrap`  
**Canonical installed Dev userscript:** `Witch_Dock_DEV.user.js`  
**Stable baseline used to create this branch:** `Witch_Scripts` @ `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`  
**Current phase:** issue #10 Stage A contract freeze complete; next introduce and validate a bounded privileged-host seam before extracting runtime responsibilities.

## Current priorities

1. #10 — modularize the oversized userscript core on `wd/10-modular-bootstrap`. Read `ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md` before changing runtime ownership. Stage B is a bounded privileged host inside the Dev launcher with no UI/application extraction yet.
2. #19 — canonical Dev identity remains protected: Tampermonkey name and Dock title must identify Dev consistently and runtime routing must remain explicit.
3. #12 — audit legacy `WITCH_DEV_UI` / `WITCH_DEV` only for still-useful unresolved fragments; do not bulk merge.
4. #7 / #8 — preserve open bug/backlog items and re-test them against the new Stable-derived Dev before migrating any old patch.
5. #13 — retire obsolete branches only after the harvest audit proves nothing useful is stranded there.
6. #14 — enforce Dev -> Stable post-rollout cleanup automatically once Stable smoke passes; do not ask Amanda for a separate cleanup approval.

## Protected state

- Public `Witch_Scripts` remains untouched unless Amanda explicitly authorizes a narrow promotion.
- `WITCH_DEV_MAIN` remains the canonical integration branch; `wd/10-modular-bootstrap` is short-lived issue-scoped work.
- `Witch_Dock.user.js` remains the Stable-derived shared monolithic core until issue #10 extraction stages replace responsibilities deliberately.
- Existing storage keys, public `WitchDock` seams, cache-key behavior, loader ordering/performance, module enablement, Dock appearance/interactions, and feature lifecycle behavior are protected by `ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md`.
- Legacy Dev branches are evidence/reference only; newer-looking code is not automatically preferred.

## Minimum continuation set

1. `PROJECT_CONTRACT.md`;
2. this file;
3. `ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md`;
4. issue #10;
5. `Witch_Dock_DEV.user.js`;
6. `Witch_Dock.user.js` only for the responsibility currently being extracted;
7. `manifest.json` / `MODULE_VERSIONING.md` when runtime/version changes are made;
8. `DEV_DIVERGENCES.json` when an intentional runtime divergence is introduced.

Do not preload `MASTER.md`, full historical logs, unrelated `HISTORY/BULLSHIT/*`, or HeroForge.Compatibility unless current evidence specifically requires them.

## Immediate next technical sequence

1. Add a bounded privileged-host object inside the architecture-branch Dev launcher; do not expose raw `GM_*` APIs as a general page API.
2. Bump/synchronize the Dev launcher identity only when the active runtime seam changes, following `MODULE_VERSIONING.md`.
3. Record issue #10 runtime divergence before merging/testing runtime changes.
4. Static-check launcher/manifest/version consistency.
5. Validate Dev startup and host seam before moving any application consumer to it.
6. Then extract the lowest-risk non-privileged responsibility in a separate bounded step.
