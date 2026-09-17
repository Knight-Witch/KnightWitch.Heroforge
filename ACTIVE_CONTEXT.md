# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-17  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Active architecture branch:** `wd/10-modular-bootstrap`  
**Canonical installed Dev userscript:** `Witch_Dock_DEV.user.js`  
**Stable baseline:** `Witch_Scripts` @ `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`  
**Current phase:** issue #10 presentation/static extraction. Stage C passed live; v1.3.2 external compact-emblem candidate is the next gate.

## Current priorities

1. #10 — validate v1.3.2 / build `1.3.2-external-compact-emblem`; then extract core CSS separately.
2. #19 — canonical Dev identity/routing remains protected; task-branch self-routing must normalize to `WITCH_DEV_MAIN` before integration.
3. #12 — harvest only still-relevant legacy fragments; never bulk-merge legacy Dev.
4. #7 / #8 — preserve and re-test open bug/backlog surfaces against fresh Dev.
5. #13 — retire obsolete branches only after harvest proves nothing useful is stranded.
6. #14 — Stable-smoke success automatically triggers Dev janitorial reconciliation; no second cleanup approval.

## Completed live milestones

### Stage B — privileged host seam PASS

- Dev v1.3.0 identity/provenance correct and basic Dock behavior normal.
- Host API v0.1.0 present; `rawPrivilegesExposed: false`; expected capabilities available.
- Module loader: 23/23 fetched/executed, 0 failed, 505.7 ms.

### Stage C — host-owned bootstrap fetch PASS

- Dev v1.3.1 reported `bootstrapTransport: "host.requestText"`, `status: running`, `error: null`.
- Visible title/provenance correct.
- Module loader: 23/23 fetched/executed, 0 failed, 458 ms.
- HF-Chat-Bridge request: `hf-20260917-wd10-stagec-verify-001`.

## Protected state

- Public `Witch_Scripts` remains untouched absent explicit narrow promotion approval.
- Canonical `WITCH_DEV_MAIN` remains untouched by this task branch until task validation passes.
- Checked-in `Witch_Dock.user.js` remains byte-identical to the Stable-derived monolith through the v1.3.2 candidate; temporary guarded source seams move runtime ownership without rewriting unrelated behavior.
- Existing storage keys, `WitchDock` public seams, cache-key behavior, module ordering/performance, enablement, Dock interactions, and feature lifecycle remain protected by `ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md`.
- HF-Chat-Bridge is development infrastructure only and must never become a Dock runtime dependency.

## v1.3.2 live gate — external compact emblem

1. Update/reload the raw task-branch `Witch_Dock_DEV.user.js`; identity must show `WITCH DOCK - DEV v1.3.2`.
2. Bridge-read `KWWitchDockDevChannel`: `presentationAssetMode === "external-compact-emblem"`, expected task `ASSETS/emblem.png` URL, `status: running`, `error: null`.
3. Bridge-read `#kwWDCompactIcon`: `src` must resolve to task-branch `ASSETS/emblem.png`.
4. Confirm module loader still completes 23/23 with 0 failures.
5. Human visual gate: collapse Dock to compact icon and confirm the emblem looks unchanged.
6. Only after this pass begin core CSS extraction as a separate versioned commit.

## Minimum continuation set

Read only: `PROJECT_CONTRACT.md`, this file, `ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md`, issue #10, `Witch_Dock_DEV.user.js`, `manifest.json`, `DEV_DIVERGENCES.json`, and the exact `Witch_Dock.user.js` responsibility being extracted. Read `MODULE_VERSIONING.md` for runtime/version changes.

Do not preload MASTER, full old logs, unrelated HISTORY files, or HeroForge.Compatibility unless current evidence requires them.
