# Changelog

This is the rolling current Dev changelog. Older detailed entries remain durable in Git history and should be fetched only when relevant.

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
