# Changelog

This active Stable changelog is intentionally compact. Older detailed Stable entries remain durable in Git history.

## DOCK-2026-09-16-039 — Promote parallel module loading to public Stable

Date: 2026-09-16

### Summary

Narrowly promote the issue #9 module-loading repair after committed Dev candidate `547b86462f122cd67e96c861486d129a4cfdb3d5` passed live runtime and human gates in the already-degraded Chrome session.

- Added public `witch-dock-module-loader` v0.1.1 / build `0.1.1-stable-page-fetch-ordered-exec`.
- Public `Witch_Dock.user.js` remains byte-for-byte unchanged at v1.2.1.
- Public manifest now lets the existing core shell fetch one hidden bootstrap; the bootstrap then starts all 23 enabled module requests concurrently and executes them in the exact prior manifest order.
- Public bootstrap and every module URL point only to `Witch_Scripts`; no WITCH_DEV_UI or HF-Chat-Bridge runtime dependency is introduced.
- Deterministic module cache keys, ordered execution, failure isolation, and Utilities' `kw.witchDock.toolEnabled.*` localStorage enablement mirror are preserved.
- No request timeout, retry, readiness, ownership, polling, or feature-module behavior is changed.

Dev validation evidence: 23/23 fetched, 23/23 executed, 0 failures, total loader duration 432.8 ms; Amanda reported the Dock appeared noticeably faster in the same degraded browser session.

**Runtime behavior changed:** yes — public Stable module network fetches now overlap while module execution order remains unchanged.

---

## DOCK-2026-09-15-038 — Close public Texture Quality lifecycle/projected-host rollout

Public Texture Quality lifecycle/projected-host promotion passed its narrow Stable smoke and was closed. Detailed evidence remains in Git history.
