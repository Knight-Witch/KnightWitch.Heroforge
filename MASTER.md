# Witch Dock Master

This is the source bible for the current Witch Dock repository state. Keep this file current when tools are added, removed, migrated, blocked, or rejected.

## Current Architecture

- Repository: `Knight-Witch/KnightWitch.Heroforge`
- Live branch: `Witch_Scripts`
- Public install script: `Witch_Dock.user.js`
- Current public userscript version: `1.0.5`
- Install/update URL: raw GitHub `Witch_Scripts/Witch_Dock.user.js`
- Manifest loader: `manifest.json`
- Visible Witch Dock tools: `/tools/`
- Hidden HeroForge UI utilities: `/HeroForge_UI/`
- Runtime utility toggles: stored under `kw.witchDock.toolEnabled.*`
- Main dock preferences: stored under `kw.witchDock.v1`

## Branch / Release Notes

- `Witch_Scripts` is the active live branch used by the install URL and manifest raw URLs.
- `main` is not the live user-facing branch unless deliberately changed later.
- Do not update `manifest.json` unless adding, removing, renaming, or changing a live-loaded module.
- Do not update `README.md` unless install flow, public feature list, or developer documentation links change.

## Loading Model

1. Tampermonkey installs `Witch_Dock.user.js` from the live raw URL.
2. `Witch_Dock.user.js` loads `manifest.json` through `GM_xmlhttpRequest`.
3. Enabled manifest entries are fetched from raw GitHub URLs.
4. Loaded modules execute in the Witch Dock runtime context.
5. Visible tools register with `window.WitchDock.registerTool`.
6. Hidden HeroForge UI utilities patch or observe HeroForge UI/runtime behavior without adding visible tabs.

## Directory Roles

| Path | Purpose |
|---|---|
| `/tools/` | Visible Witch Dock panels registered into dock tabs. |
| `/HeroForge_UI/` | Hidden utilities and HeroForge UI/runtime patches loaded through manifest. |
| `/HISTORY/` | Durable project history, decisions, and HeroForge engine notes. |
| `/HISTORY/BULLSHIT/` | Segmented HeroForge behavior discoveries. |
| `/ASSETS/` | Repo assets only. |
| `/DIFFS/` | Optional standalone patches for complex/risky changes. |
| `/BACKUP_VAULT/` | Major-refactor backups only. |

## Current Tool Inventory

| Area | Manifest ID | File | Status | Notes |
|---|---|---|---|---|
| Core | n/a | `Witch_Dock.user.js` | Live | Floating dock shell, manifest loader, shared UI, undo/redo, footer utilities, storage preferences. |
| Manifest | n/a | `manifest.json` | Live | Loads visible tools and hidden HeroForge UI utilities. |
| Body | `body-editor` | `tools/Body_Editor.js` | Live | Body symmetry and related editing tools. |
| Pose | `pose-tool` | `tools/Pose.js` | Live | Pose-related tools. |
| Booth | `booth-tool` | `tools/Booth.js` | Live | Photo booth workflow tools. |
| JSON | `json-tool` | `tools/JSON_Tool.js` | Live | JSON workflow tools. |
| Utilities | `utilities` | `tools/Utilities.js` | Live | User-facing toggles for optional HeroForge UI utilities. |
| HF UI | `expanded-ui-scroll-guards` | `HeroForge_UI/Expanded_UI_Scroll_Guards.js` | Live / hidden | Scoped Decals scroll/resize targeting. |
| HF UI | `hf-ui-scroll-split-safe` | `HeroForge_UI/HF_UI_Scroll_Split_Safe.js` | Live / hidden | Split-layout scroll override. |
| HF UI | `hf-ui-slot-bridge` | `HeroForge_UI/HF_UI_Slot_Bridge.js` | Live / hidden | Conditional loader for expanded decal slots. |
| HF UI | loaded by bridge | `HeroForge_UI/Expanded_Decal_Slots.js` | Live / conditional | Conditional expanded slots when compatible HF Core Tweaks data is detected. |

## Status Terms

| Status | Meaning |
|---|---|
| Live | Loaded by the current install/manifest flow. |
| Live / hidden | Loaded by manifest but not exposed as a visible dock tab. |
| Live / conditional | Loaded only through another module or only applies when required runtime conditions are met. |
| Standalone canonical | Working Tampermonkey reference that must be preserved until migration is tested. |
| Migrating | In progress from standalone/probe form into Witch Dock architecture. |
| Blocked | Known issue prevents reliable migration or release. |
| Deprecated | Should not be used with current Witch Dock. |

## Active Tasks

- Backfill project history from previous chats.
- Identify standalone Tampermonkey references that remain canonical but unmigrated.
- Fill `HISTORY/BULLSHIT/` topic files with durable HeroForge engine discoveries.
- Add deeper tool-specific notes for Body, Pose, Booth, JSON, Utilities, and HeroForge UI helpers.

## Migration Queue

Add standalone scripts here when they are ready to migrate into Witch Dock.

| Tool / Script | Canonical Source | Target Location | Status | Notes |
|---|---|---|---|---|
| TBD | TBD | TBD | TBD | TBD |

## Blockers / Watch Items

- HeroForge runtime behavior is unstable and can invalidate DOM paths, scene graph paths, timing assumptions, or UI container reuse.
- Tools that rely on HeroForge internal state must preserve known-good timing, retry, snapshot, mutation, and probing behavior.
- Working standalone scripts remain canonical until the integrated Witch Dock version is tested and confirmed.
- Presentation is frozen unless UI/UX changes are explicitly requested.

## Removals / Rejected Ideas

Document removed, deprecated, or rejected work here with the reason.

| Item | Decision | Reason | Date |
|---|---|---|---|
| Mandatory standalone diff files for every update | Rejected | GitHub history plus `CHANGELOG.md`, `MASTER.md`, and `PRE_FLIGHT_Check.md` now serve as the primary rollback/reference system. `/DIFFS/` remains optional for complex/risky patches. | 2026-07-09 |
