# Changelog

This is the rolling current Dev changelog. Older detailed entries remain durable in Git history and should be fetched only when relevant.

## DOCK-2026-09-16-080 -- Dev parallel module-fetch candidate for issue #9

Date: 2026-09-16

### Summary

Dev-only loader performance repair candidate for Witch Dock module startup degradation after Chrome uptime.

- Added `witch-dock-dev-module-loader` v0.1.0 (`0.1.0-parallel-fetch-ordered-exec`).
- Kept the monolithic `Witch_Dock_DEV.user.js` shell unchanged.
- Extended Dev `manifest.json` with `devModules`; `manifest.tools` now loads only the hidden Dev module-loader bootstrap.
- The bootstrap starts enabled module network requests concurrently, but awaits and executes them in the exact prior module order.
- Preserved `kw.witchDock.toolEnabled.*` enablement, deterministic module cache-key identity, silent per-module failure isolation, and `new Function(code)()` execution semantics.
- Added bounded `KWDevModuleLoader.getState()` diagnostics for live validation.
- No request timeout or Stable/public change is included.
- Issue #7 is paused, not closed, while issue #9 is active.

**Runtime behavior changed:** yes, Dev module network fetches overlap; module execution order is intentionally unchanged. Public Stable is untouched.

---

## DOCK-2026-09-16-079 -- Reopen #7 and park JSON findings

Documentation-only routing correction after the connection-error diagnosis was closed too early and work briefly drifted into the JSON backlog item.

---

## DOCK-2026-09-16-078 -- Reclassify connection toast and route JSON re-test

Superseded in part by DOCK-2026-09-16-079.

---

## Prior active history

DOCK-2026-09-16-077 and earlier detailed entries remain preserved in Git history.
