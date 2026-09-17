# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-17  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Canonical installed Dev userscript:** `Witch_Dock_DEV.user.js`  
**Stable baseline used to create this branch:** `Witch_Scripts` @ `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`  
**Current phase:** establish/validate the unmistakable Dev channel, harvest only still-relevant legacy work, then modularize the oversized userscript core.

## Current priorities

1. #19 — validate the new canonical Dev launcher/channel identity: Tampermonkey name and Dock title must both say `WITCH DOCK - DEV v1.2.2`, manifest routing must resolve to `WITCH_DEV_MAIN`, and no runtime module request may silently fall back to Stable.
2. #12 — audit legacy `WITCH_DEV_UI` / `WITCH_DEV` for useful unfinished fragments without bulk-merging branch history.
3. #10 — reframe/implement the Dock architecture so Tampermonkey becomes a small privileged bootstrap/host and GitHub owns the application/core modules. The #19 launcher is a bounded temporary migration seam toward this target, not the final core architecture.
4. #7 / #8 — preserve open bug/backlog items and re-test them against the new Stable-derived Dev before migrating any old patch.
5. #13 — retire obsolete branches only after the harvest audit proves nothing useful is stranded there.
6. #14 — enforce Dev -> Stable post-rollout cleanup automatically once Stable smoke passes; do not ask Amanda for a separate cleanup approval.

## Protected state

- Public `Witch_Scripts` remains untouched unless Amanda explicitly authorizes a narrow promotion.
- New Dev began byte-for-byte from the current public Stable runtime before intentional Dev channel infrastructure was added.
- `Witch_Dock.user.js` on New Dev remains the Stable-derived shared core source; install `Witch_Dock_DEV.user.js` for Dev testing.
- `manifest.json` is intentionally Dev-routed so all manifest-loaded modules resolve to `WITCH_DEV_MAIN` while their bytes remain Stable-equivalent unless an issue records a divergence.
- Legacy Dev branches are evidence/reference only; newer-looking code is not automatically preferred.
- Closed/promoted legacy work should not be reintroduced merely because it exists in old branch history.

## Minimum continuation set

1. `PROJECT_CONTRACT.md`;
2. this file;
3. `DEV_WORKFLOW.md`;
4. `DEV_DIVERGENCES.json`;
5. the active GitHub issue(s) named above;
6. only source files directly required by the current task.

Do not preload `MASTER.md`, full historical logs, unrelated `HISTORY/BULLSHIT/*`, or HeroForge.Compatibility unless current evidence specifically requires them.

## Immediate next technical sequence

1. Install/update `Witch_Dock_DEV.user.js` from `WITCH_DEV_MAIN` with public Stable disabled for the Dev test.
2. Validate issue #19: title/name/version identity, `KWWitchDockManifestURL`, Dev manifest/module-loader routing, normal Dock/module startup, and visible failure behavior if the Dev core seam cannot be found.
3. Complete the legacy harvest classification for unresolved/open surfaces.
4. Continue #10 by replacing the temporary source-transform seam with a true small privileged host + GitHub-owned core in bounded stages.
5. Only after New Dev is healthy begin branch retirement #13.
