# Handoff — Witch Dock Dev Auto Host

**Branch:** `wd/dev-auto-host`  
**Base:** `wd/10-modular-bootstrap` at `247d2da4da2056cfed9657ddae5a13a03eb7a549`  
**Status:** COMPLETE / live PASS on 2026-09-19, including Amanda's visual sanity confirmation.

## Architecture and decision

`devtools/Witch_Dock_DEV_Auto_Host.user.js` is a separate, one-time Tampermonkey install. It fetches the paused branch's existing `Witch_Dock_DEV.user.js` with a fresh cache key on each HeroForge page reload, validates its source contract, and executes it in the same sandbox with synthetic payload-correct `GM_info`.

This is delivery infrastructure only. It does not edit `Witch_Dock_DEV.user.js`, `Witch_Dock.user.js`, `manifest.json`, modules, Stable, or the paused refactor. The direct launcher remains the source of truth for behavior and visible version.

## Protected state

- Issue #10 remains paused at v1.4.6; do not resume extraction, integration, promotion, or Stable work.
- The auto host is a second userscript entry. Before its live gate, disable the direct `WITCH DOCK - DEV` install to avoid two launchers. Roll back by disabling the auto host and re-enabling the direct launcher.
- Human gates still decide UI/visual correctness.

## Completed checks

- `node --check devtools/Witch_Dock_DEV_Auto_Host.user.js`: PASS.
- `node --check tests/dev-auto-host.test.cjs`: PASS.
- `node tests/dev-auto-host.test.cjs`: PASS.
- `git diff --check`: PASS before the original candidate commit.
- One-time Tampermonkey install completed with the direct `WITCH DOCK - DEV` launcher disabled.
- First live state: host v0.1.0 -> `launcher-executed`, payload v1.4.6, one fetch attempt, no error; launcher v1.4.6 -> `running` / `error:null`; loader -> 23 total/enabled/started/fetched/executed, 0 failed, 388 ms.
- First DOM check: exactly one `#kwWitchDock`, one `#kwWDCompact`, and one `#kwWDCompactIcon`; Dock style remained 380x520 at x=820/y=244.
- Bridge-driven query-free reload completed successfully.
- Post-reload auto-host state had a fresh fetch/execute timestamp, still one attempt, payload v1.4.6, no error.
- Post-reload launcher remained `running` / `error:null`; loader again completed 23/23 / 0 failed in 216.4 ms.
- Post-reload DOM remained one Dock/compact/icon with the same 380x520 CSS geometry and x/y.
- Evidence requests: `hf-20260919-wd-auto-host-state-011`, `hf-20260919-wd-auto-host-live-012`, `hf-20260919-wd-auto-host-loader-013`, `hf-20260919-wd-auto-host-reload-014`, `hf-20260919-wd-auto-host-postreload-015`.

## Exact next action

No further auto-host validation is required. Leave the auto-host installed/enabled and the direct `WITCH DOCK - DEV` launcher disabled. Keep issue #10 paused until Amanda explicitly resumes it. Do not touch Stable. A future real Dev launcher revision can prove the moving-payload update path without another Tampermonkey install.
