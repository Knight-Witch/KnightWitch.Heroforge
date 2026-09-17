# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-17  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Active architecture branch:** `wd/10-modular-bootstrap`  
**Canonical installed Dev userscript:** `Witch_Dock_DEV.user.js`  
**Stable baseline:** `Witch_Scripts` @ `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`  
**Current phase:** issue #10 privileged-host/bootstrap modularization. The failed external compact-emblem experiment is rolled back; v1.3.4 restored the correct inline emblem and passed the human visual gate. v1.3.5 only enlarges that correct emblem inside the existing compact button before CSS extraction resumes.

## Current priorities

1. #10 — validate v1.3.5 / build `1.3.5-larger-compact-emblem`; then continue dedicated core CSS extraction as a separate step.
2. #19 — Dev Tampermonkey identity is fixed as `WITCH DOCK - DEV`; changing version belongs in `@version` and the visible Dock title, never in `@name`.
3. #12 — harvest only still-relevant legacy fragments; never bulk-merge legacy Dev.
4. #7 / #8 — preserve and re-test open bug/backlog surfaces against fresh Dev.
5. #13 — retire obsolete branches only after harvest proves nothing useful is stranded.
6. #14 — Stable-smoke success automatically triggers Dev janitorial reconciliation; no second cleanup approval.

## Completed live milestones

- **v1.3.0 privileged host:** PASS. Host API v0.1.0 present; raw GM privileges not page-exposed; loader 23/23, 0 failed.
- **v1.3.1 host-owned bootstrap fetch:** PASS. `bootstrapTransport: host.requestText`; loader 23/23, 0 failed.
- **v1.3.3 stable Tampermonkey identity/runtime:** PASS. Fixed-name install worked; loader 23/23, 0 failed in 167.9 ms.
- **v1.3.2/v1.3.3 external compact emblem:** FAIL visual gate. Bridge proved `ASSETS/emblem.png` itself is the wrong image (only 156 non-transparent pixels, essentially a thin white line).
- **v1.3.4 inline emblem restore:** PASS human visual gate. Amanda confirmed the original Witch Dock emblem is correct again.

## Protected state

- Public `Witch_Scripts` remains untouched absent explicit narrow promotion approval.
- Canonical `WITCH_DEV_MAIN` remains untouched by this task branch until task validation passes.
- Checked-in `Witch_Dock.user.js` remains byte-identical to the Stable-derived monolith through v1.3.5.
- The correct compact emblem remains the exact inline data URL already present in the core; `ASSETS/emblem.png` is not used for compact mode.
- v1.3.5 keeps the compact button itself at 54x54 and applies only a 48x48 icon override through the bounded host style capability; fold this into the extracted CSS module later.
- Existing storage keys, `WitchDock` public seams, cache-key behavior, module ordering/performance, enablement, Dock interactions, and feature lifecycle remain protected by `ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md`.
- HF-Chat-Bridge is development infrastructure only and must never become a Dock runtime dependency.
- Tampermonkey `@name` remains the stable `WITCH DOCK - DEV` identity.

## v1.3.5 live gate — larger correct compact emblem

1. Existing fixed-name Dev install updates in place to v1.3.5; visible title is `WITCH DOCK - DEV v1.3.5`.
2. Bridge-read `KWWitchDockDevChannel`: `compactIconSizePx === 48`, `presentationAssetMode === "inline-core-emblem-restored"`, `status: running`, `error: null`.
3. Bridge-read layout: `#kwWDCompactIcon` is 48x48 and `#kwWDCompact` remains 54x54.
4. Module loader remains 23/23 with 0 failures.
5. Human visual gate: emblem remains correct and the larger size looks appropriate.
6. Then continue core CSS extraction as the next separately versioned architecture step.

## Minimum continuation set

Read only: `PROJECT_CONTRACT.md`, this file, `ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md`, issue #10, issue #19, `Witch_Dock_DEV.user.js`, `manifest.json`, `DEV_DIVERGENCES.json`, and the exact `Witch_Dock.user.js` responsibility being extracted. Read `MODULE_VERSIONING.md` for runtime/version changes.

Do not preload MASTER, full old logs, unrelated HISTORY files, or HeroForge.Compatibility unless current evidence requires them.
