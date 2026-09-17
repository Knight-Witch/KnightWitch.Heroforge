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
- The existing Dev shell loads manifest modules with `GM_xmlhttpRequest` to raw GitHub.
- It performs module network requests strictly serially: each fetch is awaited before the next begins.
- The loader has no request timeout.
- The loader implementation itself has not changed since the September 8 cache-key repair.
- Dev now has 23 enabled module entries versus 18 on September 8.
- HeroForge page context and HF-Chat-Bridge remained healthy while the Dock-specific slowdown was present.

Supported inference:
- Degraded per-request latency in the Chrome/Tampermonkey/raw-GitHub path is being multiplied by strict serialization; recent module-count growth made the weakness materially worse.

Current Dev candidate:
- Keep `Witch_Dock_DEV.user.js` shell unchanged.
- `manifest.tools` loads one hidden bootstrap module.
- `manifest.devModules` retains the prior module list and order.
- `Witch_Dock_DEV_Module_Loader.js` launches all enabled module fetches concurrently, then awaits/executes them in the original manifest order.
- Per-module enablement, deterministic cache keys, silent failure isolation, and `new Function(code)()` execution semantics are preserved.
- No request timeout is added in this change.

## Immediate validation sequence

1. Static syntax check bootstrap and JSON-parse manifest.
2. Commit Dev-only candidate with module registry/log updates.
3. Refresh current HeroForge Dev page.
4. Use Bridge to read `KWDevModuleLoader.getState()` and confirm all enabled modules fetched/executed in order with no errors.
5. Human-check that Dock tabs/tools appear normally and compare load speed in the currently degraded Chrome session.
6. Do not touch Stable until Dev passes and Amanda explicitly approves promotion.

## Paused bug — #7 connection-error toast

Issue #7 remains open. Prior upstream-only closeout was premature. Resume bounded failed-network/transient-notification capture after #9 unless priority changes.
