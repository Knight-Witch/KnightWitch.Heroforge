# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-17  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Active architecture branch:** `wd/10-modular-bootstrap`  
**Canonical installed Dev userscript:** `Witch_Dock_DEV.user.js`  
**Stable baseline:** `Witch_Scripts` @ `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`  
**Current phase:** issue #10 privileged-host/bootstrap modularization. v1.3.6 remains the core CSS extraction candidate; its live gate also exposed and now carries a bounded Booth cold-start compatibility candidate in `Booth_Runtime_Bootstrap` v0.1.2.

## Current priorities

1. #10 — finish validating v1.3.6 / build `1.3.6-extracted-core-css` plus the bounded Booth v0.1.2 cold-start blocker repair. Do not merge the task branch to canonical Dev until both clean live gates pass.
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

## Booth cold-start blocker candidate — v0.1.2

- Cold-page diagnosis confirmed Witch Dock can have `sessionBoothView=true` while HeroForge native `BT` is still absent.
- `Booth_Runtime_Bootstrap` v0.1.1 only reacted to persisted/saved Booth state; v0.1.2 adds the existing session Booth request as a bootstrap trigger.
- v0.1.2 loads the version-matched HeroForge `/gated/booth.js` only when needed and delegates activation to native `BT.setBoothMode(mode)`.
- Native source inspection proved `setBoothMode()` owns character-readiness deferral through `CharacterFinishedChanging` and later owns `maker.enable()`; do not replace this with a direct maker-enable bypass.
- A direct `maker.enable()` probe while HeroForge reported `character.isLoading()` threw inside `booth.js`; that experiment is discarded and not present in the candidate.
- The ready-state downstream target was observed once native maker activation completed: 4K/8K/WebP ready and module loader 23/23, 0 failed.
- Final clean-path cold-start validation is still required on a normally ready HeroForge page. The last Bridge-driven reload remained in HeroForge's own loading/missing-display-data state, so the candidate was deliberately not forced through it.

## Protected state

- Public `Witch_Scripts` remains untouched absent explicit narrow promotion approval.
- Canonical `WITCH_DEV_MAIN` remains untouched by this task branch until task validation passes.
- The correct compact emblem remains the exact inline data URL already present in the core; `ASSETS/emblem.png` is not used for compact mode.
- Existing storage keys, `WitchDock` public seams, cache-key behavior, module ordering/performance, enablement, Dock interactions, and feature lifecycle remain protected by `ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md`.
- HF-Chat-Bridge is development infrastructure only and must never become a Dock runtime dependency.
- Tampermonkey `@name` remains the stable `WITCH DOCK - DEV` identity.
- HeroForge retains native ownership of Booth character readiness and maker enablement.

## Required live gate

1. Confirm v1.3.6 CSS state: `coreStylesMode: "external-bootstrap-css"`, `coreStylesApplied: true`, `status: running`, `error: null`; `KWWitchDockStylesInfo` v0.1.0 applied by `privileged-bootstrap`.
2. Confirm one effective Dock stylesheet, correct 48x48 inline emblem, normal dimensions/classes, and module loader 23/23 with 0 failures.
3. On a fresh normally ready HeroForge page with native `BT` absent, toggle Booth View on once.
4. Confirm one version-matched `/gated/booth.js`, native `BT` appears, requested mode is active, maker becomes enabled through the native readiness path, and bootstrap error remains null.
5. Confirm 4K, 8K, and WebP controls are enabled/ready; toggling Booth View off/on afterward must not create a duplicate Booth script or alter persistence/default behavior.
6. Human visual/interaction gate: Dock appearance unchanged, compact icon correct/larger, tabs/modals/minimize/restore normal.
7. Only after these pass may the task branch be normalized to canonical Dev URLs and integrated to `WITCH_DEV_MAIN`.

## Minimum continuation set

Read only: `PROJECT_CONTRACT.md`, this file, `ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md`, issue #10, issue #19, `Witch_Dock_DEV.user.js`, `manifest.json`, `DEV_DIVERGENCES.json`, `features/core/Witch_Dock_Styles.css`, `features/booth/Booth_Runtime_Bootstrap.js`, and the exact `Witch_Dock.user.js` responsibility being extracted. Read `MODULE_VERSIONING.md` for runtime/version changes.

Do not preload MASTER, full old logs, unrelated HISTORY files, or HeroForge.Compatibility unless current evidence requires them.
