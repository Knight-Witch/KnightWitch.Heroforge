# Active Context - WITCH_DEV_UI

**Updated:** 2026-09-16  
**Current task:** Diagnose and repair issue #9, Witch Dock DEV module loading becoming extremely slow after Chrome has been running for a while.  
**Protected public state:** `Witch_Scripts` remains live and closed at Stable head `acaf18a0cfd2c751886e85a269b9427ddfaa5040`. Do not change Stable unless this Dev repair passes live validation and Amanda explicitly approves a narrow promotion.  
**Bridge status:** HF-Chat-Bridge main userscript v0.3.2 is healthy in the currently affected browser session; relay v0.2.2 and Power v0.1.0 unchanged.

## Minimum continuation set

1. `PROJECT_CONTRACT.md`;
2. this file;
3. GitHub issue `#9`;
4. `manifest.json`;
5. `features/core/Witch_Dock_DEV_Module_Loader.js`;
6. `Witch_Dock_DEV.user.js` only when comparing the legacy serial loader behavior;
7. `MODULE_VERSIONING.md` for runtime-version discipline;
8. rolling `CHANGELOG.md` / `PRE_FLIGHT_Check.md` only when committing.

Do not preload unrelated history. Issue #7 is paused, not closed; resume it after #9 unless Amanda changes priority.

## Active bug — #9 slow module loading

Confirmed:
- The legacy Dev shell loads manifest modules with Tampermonkey `GM_xmlhttpRequest` and historically did so strictly serially.
- Dev grew from 18 enabled module entries on September 8 to 23.
- HeroForge itself remains responsive while Witch Dock module arrival becomes extremely slow after browser uptime.
- After explicitly switching Tampermonkey from Stable to Dev, live runtime reports `KWWitchDockManifestURL` = WITCH_DEV_UI, so current testing is now on the correct userscript.
- The first concurrency candidate, `witch-dock-dev-module-loader` v0.1.0, did execute but failed before starting any module request: `GM_xmlhttpRequest is not defined`.
- Cause is the loader boundary: the bootstrap is itself evaluated through `new Function(code)()` and runs in page context without Tampermonkey-only `GM_*` APIs.

Supported inference:
- The original per-request slowdown may still be multiplied by strict serialization, but v0.1.0 did not test that theory because its bootstrap transport failed first.

Current Dev candidate:
- `witch-dock-dev-module-loader` v0.1.1 / `0.1.1-page-fetch-ordered-exec`.
- Keep `Witch_Dock_DEV.user.js` shell unchanged.
- `manifest.tools` loads one hidden bootstrap module; `manifest.devModules` preserves the prior 23-module list/order.
- Bootstrap uses page-context `fetch(..., { cache: "no-store" })` for its manifest/module reads.
- Enabled module fetches start concurrently, then await/execute in original manifest order.
- Deterministic cache keys, silent failure isolation, and `new Function(code)()` execution semantics are preserved.
- Enablement reads `kw.witchDock.toolEnabled.*` localStorage when present, otherwise manifest defaults.
- No request timeout is added in this change.

## Immediate validation sequence

1. Static syntax-check bootstrap v0.1.1 and JSON-parse manifest.
2. Commit Dev-only page-context transport repair with registry/log updates.
3. Refresh current HeroForge Dev page without restarting Chrome/computer.
4. Bridge-read `KWDevModuleLoader.getState()` and confirm 23 modules actually start/fetch/execute with no bootstrap error.
5. Human-check that Dock tabs/tools appear normally and compare load speed in the currently degraded Chrome session.
6. Do not touch Stable until Dev passes and Amanda explicitly approves promotion.

## Paused bug — #7 connection-error toast

Issue #7 remains open. Prior upstream-only closeout was premature. Resume bounded failed-network/transient-notification capture after #9 unless priority changes.
