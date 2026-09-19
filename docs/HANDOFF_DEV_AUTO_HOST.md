# Handoff — Witch Dock Dev Auto Host

**Branch:** `wd/dev-auto-host`  
**Base:** `wd/10-modular-bootstrap` at `247d2da4da2056cfed9657ddae5a13a03eb7a549`  
**Status:** static candidate complete; no Tampermonkey/HeroForge install or live gate performed.

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
- `git diff --check`: PASS before the local commit.

## Exact next action

Push/open the draft PR, then perform the one-time Tampermonkey install from the branch raw URL. Disable the direct Dev launcher, reload HeroForge through the Bridge, and verify host state `launcher-executed`, payload v1.4.6, launcher `running/error:null`, loader 23/23 / 0 failed, and one Dock/compact/icon with preserved geometry. Only after that should a real later Dev launcher revision be used to prove the automatic reload path.
