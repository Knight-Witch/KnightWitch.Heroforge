# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-17  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Active architecture branch:** `wd/10-modular-bootstrap`  
**Canonical installed Dev userscript:** `Witch_Dock_DEV.user.js`  
**Stable baseline:** `Witch_Scripts` @ `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`  
**Current phase:** issue #10 privileged-host/bootstrap modularization. v1.3.5 passed its live/runtime and human visual gates. v1.3.6 is the dedicated core CSS extraction candidate.

## Current priorities

1. #10 — validate v1.3.6 / build `1.3.6-extracted-core-css`: GitHub-owned core stylesheet, guarded parity against legacy inline CSS, host-owned style insertion, unchanged Dock behavior.
2. #19 — Dev Tampermonkey identity is fixed as `WITCH DOCK - DEV`; changing version belongs in `@version` and the visible Dock title, never in `@name`.
3. #12 — harvest only still-relevant legacy fragments; never bulk-merge legacy Dev.
4. #7 / #8 — preserve and re-test open bug/backlog surfaces against fresh Dev.
5. #13 — retire obsolete branches only after harvest proves nothing useful is stranded.
6. #14 — Stable-smoke success automatically triggers Dev janitorial reconciliation; no second cleanup approval.

## Completed live milestones

- **v1.3.0 privileged host:** PASS. Host API v0.1.0 present; raw GM privileges not page-exposed; loader 23/23, 0 failed.
- **v1.3.1 host-owned bootstrap fetch:** PASS. `bootstrapTransport: host.requestText`; loader 23/23, 0 failed.
- **v1.3.3 stable Tampermonkey identity/runtime:** PASS. Fixed-name install worked; loader 23/23, 0 failed in 167.9 ms.
- **v1.3.2/v1.3.3 external compact emblem:** FAIL visual gate. `ASSETS/emblem.png` is the wrong image.
- **v1.3.4 inline emblem restore:** PASS human visual gate.
- **v1.3.5 larger correct emblem:** PASS. Bridge confirmed v1.3.5 running, icon 48x48, correct inline data URL, loader 23/23 with 0 failures in 294.8 ms; Amanda confirmed the larger icon looks better. Bridge request: `hf-20260917-wd10-v135-live-002`.

## v1.3.6 candidate — extracted core CSS

- New GitHub-owned `features/core/Witch_Dock_Styles.css`, registry id `witch-dock-styles`, v0.1.0 / build `0.1.0-extracted-core-css`.
- Launcher v1.3.6 fetches the Stable-derived core and external stylesheet in parallel through `PRIVILEGED_HOST.requestText`.
- Before applying the stylesheet, the launcher extracts the legacy inline CSS contract from the fetched core and requires exact parity after only the already-approved compact-icon delta from 40px to 48px.
- CSS is inserted through the bounded host `styles.add` capability before the core builds UI.
- The runtime source-transform replaces the legacy `addStyles()` implementation with a no-op so the Dock receives one stylesheet, not duplicate inline + external copies.
- The temporary v1.3.5 post-core 48px override is removed; 48px now belongs to the extracted stylesheet.
- `Witch_Dock.user.js` remains byte-identical to the Stable-derived monolith during this bounded migration step. Physical deletion of the now-duplicated legacy CSS source waits for the later true GitHub-owned core split.

## Protected state

- Public `Witch_Scripts` remains untouched absent explicit narrow promotion approval.
- Canonical `WITCH_DEV_MAIN` remains untouched by this task branch until task validation passes.
- The correct compact emblem remains the exact inline data URL already present in the core; `ASSETS/emblem.png` is not used for compact mode.
- Existing storage keys, `WitchDock` public seams, cache-key behavior, module ordering/performance, enablement, Dock interactions, and feature lifecycle remain protected by `ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md`.
- HF-Chat-Bridge is development infrastructure only and must never become a Dock runtime dependency.
- Tampermonkey `@name` remains the stable `WITCH DOCK - DEV` identity.

## v1.3.6 live gate — external core stylesheet

1. Existing fixed-name Dev install updates in place to v1.3.6; visible title is `WITCH DOCK - DEV v1.3.6`.
2. Dev state reports `coreStylesMode: "external-bootstrap-css"`, `coreStylesApplied: true`, `status: running`, `error: null`.
3. `KWWitchDockStylesInfo` reports v0.1.0 / build `0.1.0-extracted-core-css`, owner `privileged-bootstrap`, and applied=true.
4. Confirm only one effective Dock stylesheet is injected from the bootstrap seam and `#kwWDCompactIcon` remains 48x48 with the correct inline emblem source.
5. Module loader remains 23/23 with 0 failures.
6. Human visual/interaction gate: Dock appearance is unchanged, compact icon remains correct/larger, tabs/modals/minimize/restore remain normal.
7. If clean, continue Stage C with the next low-risk presentation/application extraction rather than changing Stable.

## Minimum continuation set

Read only: `PROJECT_CONTRACT.md`, this file, `ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md`, issue #10, issue #19, `Witch_Dock_DEV.user.js`, `manifest.json`, `DEV_DIVERGENCES.json`, `features/core/Witch_Dock_Styles.css`, and the exact `Witch_Dock.user.js` responsibility being extracted. Read `MODULE_VERSIONING.md` for runtime/version changes.

Do not preload MASTER, full old logs, unrelated HISTORY files, or HeroForge.Compatibility unless current evidence requires them.
