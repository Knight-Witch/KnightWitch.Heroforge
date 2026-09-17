# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-17  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Active architecture branch:** `wd/10-modular-bootstrap`  
**Canonical installed Dev userscript:** `Witch_Dock_DEV.user.js`  
**Stable baseline:** `Witch_Scripts` @ `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`  
**Current phase:** issue #10 presentation/static extraction repair. v1.3.3 passed runtime/identity validation but the external compact-emblem candidate failed the required human visual gate; v1.3.4 restores the known-good inline emblem before any CSS extraction continues.

## Current priorities

1. #10 — validate v1.3.4 / build `1.3.4-restore-inline-compact-emblem`; only after the compact emblem is visually restored may core CSS extraction begin.
2. #19 — Dev Tampermonkey identity is fixed as `WITCH DOCK - DEV`; changing version belongs in `@version` and the visible Dock title, never in `@name`.
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

### v1.3.3 identity/runtime — PASS; compact emblem visual — FAIL

- Fixed Tampermonkey identity updated in place and runtime reported v1.3.3 correctly.
- Privileged host remained bounded and raw GM privileges were not page-exposed.
- Module loader completed 23/23 with 0 failures in 167.9 ms.
- External compact image was present and loaded successfully, but the human visual gate showed only a short white line on the dark compact button.
- Bridge request `hf-20260917-wd10-emblem-diagnose-002`: image complete=true, natural size 256x256, rendered 40x40, object-fit contain, opacity 1.
- Bridge request `hf-20260917-wd10-emblem-pixels-001`: `ASSETS/emblem.png` contains only 156 non-transparent pixels; visible bounds are x=41..255 and y=23..24. This confirms the repo asset itself is the wrong compact emblem graphic.

## Protected state

- Public `Witch_Scripts` remains untouched absent explicit narrow promotion approval.
- Canonical `WITCH_DEV_MAIN` remains untouched by this task branch until task validation passes.
- Checked-in `Witch_Dock.user.js` remains byte-identical to the Stable-derived monolith; v1.3.4 preserves its exact inline compact-emblem data URL instead of substituting the failed external asset.
- Existing storage keys, `WitchDock` public seams, cache-key behavior, module ordering/performance, enablement, Dock interactions, and feature lifecycle remain protected by `ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md`.
- HF-Chat-Bridge is development infrastructure only and must never become a Dock runtime dependency.
- Tampermonkey `@name` is a stable script identity. Future Dev versions must not embed their changing version in `@name`.
- Do not resume presentation/CSS extraction until the v1.3.4 compact-emblem human gate passes.

## v1.3.4 live gate — restore known-good inline compact emblem

1. Existing fixed-name Dev install updates in place to v1.3.4; visible title must be `WITCH DOCK - DEV v1.3.4`.
2. Bridge-read `KWWitchDockDevChannel`: `presentationAssetMode === "inline-core-emblem-restored"`, `compactEmblemUrl === "inline:data-url-from-core"`, `status: running`, `error: null`.
3. Bridge-read `#kwWDCompactIcon`: `src` must begin with `data:image/png;base64,` and load normally.
4. Confirm module loader still completes 23/23 with 0 failures.
5. Human visual gate: fully collapse Dock and confirm the original emblem has returned.
6. Only after this pass begin core CSS extraction as a separate versioned commit.

## Minimum continuation set

Read only: `PROJECT_CONTRACT.md`, this file, `ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md`, issue #10, issue #19, `Witch_Dock_DEV.user.js`, `manifest.json`, `DEV_DIVERGENCES.json`, and the exact `Witch_Dock.user.js` responsibility being extracted. Read `MODULE_VERSIONING.md` for runtime/version changes.

Do not preload MASTER, full old logs, unrelated HISTORY files, or HeroForge.Compatibility unless current evidence requires them.
