# Pre-Flight Check Log

This is the compact operational preflight log. Older detailed records remain in Git history; they are not mandatory startup context.

## PFC-2026-09-16-081 -- Issue #9 page-context bootstrap repair

Date: 2026-09-16

### Scope

Dev-only correction to the module-loader bootstrap transport. Public Stable is not changed.

### Failed live gate captured

- Amanda switched Tampermonkey so Stable was OFF and `Witch Dock DEV - Spinny Integration` was ON, then refreshed without restarting Chrome/computer.
- Bridge confirmed `KWWitchDockManifestURL` pointed to `WITCH_DEV_UI`.
- Bridge confirmed `KWDevModuleLoader` v0.1.0 / `0.1.0-parallel-fetch-ordered-exec` existed.
- Loader state was `manifest-error` with zero modules started/fetched/executed.
- Exact live error: `GM_xmlhttpRequest is not defined`.
- Therefore the v0.1.0 concurrency design was not yet exercised; the slowdown result from that refresh cannot be used to judge parallel module loading.

### Root cause / repair

- Bootstrap source is evaluated through the outer userscript's `new Function(code)()` path and therefore runs in page context without Tampermonkey `GM_*` globals.
- `witch-dock-dev-module-loader` is bumped to v0.1.1 / `0.1.1-page-fetch-ordered-exec`.
- Manifest/module requests use page-context `fetch(..., { cache: "no-store" })`.
- Deterministic module cache keys, concurrent fetch starts, ordered execution, and silent per-module failure isolation remain unchanged.
- Enablement reads the existing `kw.witchDock.toolEnabled.*` localStorage mirror when present and otherwise uses manifest defaults.
- No timeout/failure-policy change is bundled.

### Static validation required before live gate

- JavaScript syntax-check v0.1.1 bootstrap.
- Parse updated `manifest.json`.
- Confirm registry/bootstrap URL both report v0.1.1 and 23 unique `devModules` remain registered.

### Next live gate

- Refresh Dev again without restarting Chrome/computer.
- Bridge-read `KWDevModuleLoader.getState()` while the affected browser remains degraded.
- Confirm 23 module requests start, fetch, and execute with no bootstrap error.
- Human-check normal tabs/tools and compare startup speed.
- Stable promotion remains prohibited until this passes and Amanda explicitly approves it.

**Runtime behavior changed:** yes, Dev-only bootstrap transport. Stable remains protected at `acaf18a0cfd2c751886e85a269b9427ddfaa5040`.

---

## PFC-2026-09-16-080 -- Issue #9 Dev module-loader concurrency candidate

Initial v0.1.0 candidate; superseded after live page-context transport failure was captured.

---

## PFC-2026-09-16-079 -- Reopen #7 / park JSON detour

Documentation-only routing correction. No Witch Dock runtime source or public Stable change.

---

## Prior current preflight

PFC-2026-09-16-078 and earlier detailed records remain preserved in Git history.
