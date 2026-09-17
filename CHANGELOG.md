# Changelog

This is the rolling current Dev changelog. Older detailed entries remain durable in Git history and should be fetched only when relevant.

## DOCK-2026-09-17-082 -- Handoff to modular Dev shell architecture

Date: 2026-09-17

### Summary

Documentation-only handoff after issue #9 was fully validated and promoted to Stable.

- Issue #9 is closed after Dev loaded 23/23 modules with 0 failures in 432.8 ms and Stable loaded 23/23 with 0 failures in 451.4 ms.
- Public Stable is protected at `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`.
- New architecture issue #10 tracks replacement of the legacy monolithic `Witch_Dock_DEV.user.js` development foundation with a modular Dev shell/bootstrap.
- `ACTIVE_CONTEXT.md` now routes the next chat directly to monolith responsibility/seam mapping before any refactor.
- Issue #7 remains open but is explicitly deprioritized while issue #10 is active.

**Runtime behavior changed:** no. Documentation/task-routing only. No module source, manifest, or public Stable behavior changed.

---

## DOCK-2026-09-16-081 -- Repair Dev bootstrap page-context transport

Date: 2026-09-16

### Summary

Live validation of issue #9 candidate v0.1.0 exposed a page-context boundary bug before any parallel module fetches could begin.

- Confirmed Dev was actually active after Tampermonkey was switched from Stable to `Witch Dock DEV - Spinny Integration`.
- `KWDevModuleLoader` v0.1.0 ran but terminated immediately with `manifest-error: GM_xmlhttpRequest is not defined`.
- Root cause: the hidden bootstrap is executed through `new Function(code)()` and therefore cannot use Tampermonkey-only `GM_*` APIs.
- Bumped `witch-dock-dev-module-loader` to v0.1.1 (`0.1.1-page-fetch-ordered-exec`).
- Replaced bootstrap `GM_xmlhttpRequest` calls with normal page-context `fetch(..., { cache: "no-store" })` while preserving deterministic cache keys, concurrent request start, manifest-order execution, and per-module failure isolation.
- Page-context enablement checks now use the existing `kw.witchDock.toolEnabled.*` localStorage mirror when present and otherwise retain manifest defaults.
- No request timeout or Stable/public change is included.

**Runtime behavior changed:** yes, Dev bootstrap transport only. Public Stable is untouched.

---

## DOCK-2026-09-16-080 -- Dev parallel module-fetch candidate for issue #9

Initial v0.1.0 candidate. Live validation later showed its page-context bootstrap could not access `GM_xmlhttpRequest`; superseded by DOCK-2026-09-16-081.

---

## DOCK-2026-09-16-079 -- Reopen #7 and park JSON findings

Documentation-only routing correction after the connection-error diagnosis was closed too early and work briefly drifted into the JSON backlog item.

---

## Prior active history

DOCK-2026-09-16-078 and earlier detailed entries remain preserved in Git history.
