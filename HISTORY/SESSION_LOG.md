# Session Log

Chronological development and testing notes. Use this for concise project-state updates that matter across chats.

## 2026-07-09 — Decals and Photo Capture History Backfill

- Target: old-chat/probe recovery for Decals scroll behavior and unfinished Photo Mode PNG series capture.
- Action: expanded `HISTORY/Bullshit_Bible.md`, `MASTER.md`, `HISTORY/DECISIONS.md`, `TIMING_AND_STATE.md`, `DOM_AND_LAYOUT.md`, `DECALS_AND_TEXTURES.md`, and `BOOTH_RENDERS_EXPORTS.md`.
- Result: Decals docs now explicitly preserve the three observed UI setups: right-side grouped, right/left split, and bottom compact. Photo capture docs now preserve the current unresolved PNG-series investigation, including official exporter observation, 512x512 early-capture warning, v0.7 probe notes, WebGL readPixels partial success, and booth effects/overlay constraints.
- Test notes: documentation-only update; no JavaScript or manifest behavior changed.
- Follow-up: if implementing PNG-series capture later, read `BOOTH_RENDERS_EXPORTS.md` and `TIMING_AND_STATE.md` before writing code. If editing Decals scroll later, read `DOM_AND_LAYOUT.md` and `DECALS_AND_TEXTURES.md` first.

## 2026-07-09 — Live Tool Documentation Backfill

- Target: current live Witch Dock modules and their integration points.
- Action: documented current-source status for Witch Dock core, Body Editor, Pose, Booth, JSON Tool, Utilities, and hidden HeroForge UI utilities.
- Result: `MASTER.md` now has live tool notes; Bullshit topic files now contain current-source findings for timing/state, DOM/layout, decals/textures, kitbashing/bones, booth behavior, and JSON/library behavior.
- Test notes: documentation-only update; no JavaScript or manifest behavior changed.
- Follow-up: perform old-chat recovery beginning with Decals/Utilities, then Booth, bones/kitbashing, JSON/library, and remaining standalone references.

## 2026-07-09 — Baseline Architecture Backfill

- Target: repo-wide documentation baseline.
- Action: updated `MASTER.md`, `STYLE_KEYS.md`, `HISTORY/DECISIONS.md`, and `HISTORY/BULLSHIT/MANIFEST_AND_LOADING.md` with current architecture, branch/install flow, manifest loading model, directory roles, style references, and durable repo decisions.
- Result: baseline project memory now documents `Witch_Scripts` as the live branch, `Witch_Dock.user.js` as the public install script, `manifest.json` as the live module inventory, `/tools/` as visible dock tools, and `/HeroForge_UI/` as hidden utilities.
- Test notes: documentation-only update; no JavaScript or manifest behavior changed.
- Follow-up: backfill Decals/Utilities history next, then Booth, bones/kitbashing, JSON/library, and remaining standalone references.

## 2026-07-09 — Documentation Architecture Scaffold

- Added the documentation/tracking structure for Witch Dock.
- No JavaScript or manifest behavior changed.
- Detailed prior-chat recovery still needs to be backfilled.

## Entry Template

### YYYY-MM-DD — Title

- Target:
- Action:
- Result:
- Test notes:
- Follow-up:
