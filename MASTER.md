# Witch Dock Master

This is the source bible for the current Witch Dock repository state. Keep this file current when tools are added, removed, migrated, blocked, or rejected.

## Current Architecture

- Public install script: `Witch_Dock.user.js`
- Live branch: `Witch_Scripts`
- Manifest loader: `manifest.json`
- Visible Witch Dock tools: `/tools/`
- Hidden HeroForge UI utilities: `/HeroForge_UI/`
- Runtime utility toggles: stored under `kw.witchDock.toolEnabled.*`

## Current Tool Inventory

| Area | File | Status | Notes |
|---|---|---|---|
| Core | `Witch_Dock.user.js` | Live | Floating dock shell, manifest loader, shared UI, undo/redo, footer utilities. |
| Manifest | `manifest.json` | Live | Loads visible tools and hidden HeroForge UI utilities. |
| Body | `tools/Body_Editor.js` | Live | Body symmetry and related editing tools. |
| Pose | `tools/Pose.js` | Live | Pose-related tools. |
| Booth | `tools/Booth.js` | Live | Photo booth workflow tools. |
| JSON | `tools/JSON_Tool.js` | Live | JSON workflow tools. |
| Utilities | `tools/Utilities.js` | Live | User-facing toggles for optional HeroForge UI utilities. |
| HF UI | `HeroForge_UI/Expanded_UI_Scroll_Guards.js` | Live | Scoped Decals scroll/resize targeting. |
| HF UI | `HeroForge_UI/HF_UI_Scroll_Split_Safe.js` | Live | Split-layout scroll override. |
| HF UI | `HeroForge_UI/HF_UI_Slot_Bridge.js` | Live | Conditional loader for expanded decal slots. |
| HF UI | `HeroForge_UI/Expanded_Decal_Slots.js` | Live | Conditional expanded slots when compatible HF Core Tweaks data is detected. |

## Active Tasks

- Backfill project history from previous chats.
- Identify standalone Tampermonkey references that remain canonical but unmigrated.
- Fill `HISTORY/BULLSHIT/` topic files with durable HeroForge engine discoveries.

## Migration Queue

Add standalone scripts here when they are ready to migrate into Witch Dock.

| Tool / Script | Canonical Source | Target Location | Status | Notes |
|---|---|---|---|---|
| TBD | TBD | TBD | TBD | TBD |

## Blockers / Watch Items

- HeroForge runtime behavior is unstable and can invalidate DOM paths, scene graph paths, timing assumptions, or UI container reuse.
- Tools that rely on HeroForge internal state must preserve known-good timing, retry, snapshot, and probing behavior.

## Removals / Rejected Ideas

Document removed, deprecated, or rejected work here with the reason.

| Item | Decision | Reason | Date |
|---|---|---|---|
| TBD | TBD | TBD | TBD |
