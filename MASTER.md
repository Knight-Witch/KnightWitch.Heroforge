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
| `/HISTORY/` | Durable project history, decisions, standalone references, and HeroForge engine notes. |
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
| Pose | `pose-tool` | `tools/Pose.js` | Live | Figure swap tool for Main/Extra designation. |
| Booth | `booth-tool` | `tools/Booth.js` | Live | Persistent booth view and black canvas workflow tool. Persistent Booth is considered working; only minor fixes remain. |
| JSON | `json-tool` | `tools/JSON_Tool.js` | Live | Bulk JSON library backup tool. |
| Utilities | `utilities` | `tools/Utilities.js` | Live | User-facing toggles for optional HeroForge UI utilities. |
| HF UI | `expanded-ui-scroll-guards` | `HeroForge_UI/Expanded_UI_Scroll_Guards.js` | Live / hidden | Scoped Decals scroll/resize targeting. |
| HF UI | `hf-ui-scroll-split-safe` | `HeroForge_UI/HF_UI_Scroll_Split_Safe.js` | Live / hidden | Split-layout scroll override. |
| HF UI | `hf-ui-slot-bridge` | `HeroForge_UI/HF_UI_Slot_Bridge.js` | Live / hidden | Conditional loader for expanded decal slots. |
| HF UI | loaded by bridge | `HeroForge_UI/Expanded_Decal_Slots.js` | Live / conditional | Conditional expanded slots when compatible HF Core Tweaks data is detected. |
| Planned | TBD | Photo Mode PNG Series Capture | Investigating / unresolved | High-resolution PNG sequence export from Photo Mode/photo booth while preserving HF effects/overlays. Separate from Persistent Booth. |
| Planned | TBD | Decal Slot Swapper | Investigating / unresolved | Move/swap decals between slots without reapplying the decal, manually copying coordinates/transforms, or recoloring. Candidate target: Witch Dock panel, native Decals UI injection, or both. |

## Reference Inventories

- Standalone/external/probe inventory: `HISTORY/STANDALONE_REFERENCES.md`.
- Photo Mode PNG capture feature spec: `HISTORY/BULLSHIT/PHOTO_MODE_PNG_CAPTURE.md`.
- HeroForge fragile behavior index: `HISTORY/Bullshit_Bible.md`.

## Live Tool Notes

### Witch Dock Core — `Witch_Dock.user.js`

- Userscript metadata version: `1.0.5`.
- Loads `manifest.json` from the `Witch_Scripts` raw GitHub URL.
- Uses `GM_xmlhttpRequest` to fetch manifest/modules.
- Uses `kw.witchDock.toolEnabled.*` for tool enablement.
- Uses `kw.witchDock.v1` for dock position/size/minimized/closed tab state.
- Provides shared dock UI, tabs, sections, drag/resize behavior, compact mode, hotkey handling, undo/redo controls, About/Disclaimer modals, and footer bone detection.
- Fragile area: footer bone detection uses delayed snapshot/diff behavior and tolerant scene graph probing. See `HISTORY/BULLSHIT/KITBASHING_AND_BONES.md` and `HISTORY/BULLSHIT/TIMING_AND_STATE.md`.

### Body Editor — `tools/Body_Editor.js`

- Manifest ID: `body-editor`.
- Registers into tab `Body Editor`.
- Current registered title: `Body Editor WITCH DOCK TEST v4`.
- Storage keys: `hfBodyEditorDock.v1`, `hfBodyEditorDock.buttBaselines.v1`.
- Uses CK undo queue snapshots and `CK.tryLoadCharacter` for character JSON edits.
- Current visible sections include arms, breast, and butt editing workflows.
- Fragile area: direct character JSON manipulation and undo queue integration must remain consistent.

### Pose — `tools/Pose.js`

- Manifest ID: `pose-tool`.
- Registers into tab `Pose`.
- Current function: `Figure Swap: Main / Extra`.
- Uses current character JSON from CK undo queue or CK getter candidates.
- Swaps `children.baseItem` and main figure data while preserving pinned environment/fx/base/baseRim/label/base decal/base slider data.
- Fragile area: do not remove pinned-data preservation when modifying figure swap behavior.

### Booth — `tools/Booth.js`

- Manifest ID: `booth-tool`.
- Tool ID: `booth-tool`.
- Build tag: `v16`.
- Registers into tab `Booth`.
- Storage keys: `kw.witchDock.booth.consent.v1`, `kw.witchDock.booth.directionsHidden.v1`.
- Exposes debug helpers: `window.KW_WD_BOOTH_DEBUG_DUMP`, `window.KW_WD_BOOTH_BUILD`.
- Current visible section: `Persistent Booth`.
- Status: Persistent Booth is live/working. It is not part of the open PNG-series capture todo. Remaining Booth work should be treated as minor fixes unless a new regression is confirmed.
- Core behaviors include booth persistence consent, booth view toggle, black canvas toggle, tokenizer/mode detection, frame hiding, shader/backdrop handling, and a runtime tick loop.
- Fragile area: heavy runtime behavior; do not simplify loops, tokenizer hooks, teardown/rearm logic, backdrop capture, or frame hiding without a tested reference.

### JSON Tool — `tools/JSON_Tool.js`

- Manifest ID: `json-tool`.
- Tool ID: `json-tool`.
- Registers into tab `JSON`.
- Current visible section: `Backup My Library (Bulk JSON)`.
- Loads JSZip from CDN when needed.
- Uses HeroForge config-service endpoints with credentials to read config metadata, marks/folders, and individual config JSON.
- Builds a ZIP with config JSON, metadata, marks, and failure records.
- Supports pause/resume and copying failure data.
- Fragile area: service endpoint assumptions, pagination, concurrency, folder/mark mapping, credentialed requests, and DOM/HF readiness timing.

### Utilities — `tools/Utilities.js`

- Manifest ID: `utilities`.
- Registers into tab `Utilities`.
- Current section: `HeroForge UI Patches`.
- User-facing toggles:
  - `expanded-ui-scroll-guards` / Decals Scroll Guards.
  - `hf-ui-slot-bridge` / Expanded Decal Slots.
- Reads/writes enablement through `kw.witchDock.toolEnabled.*`, localStorage, and GM storage where available.
- Loads utility scripts from raw GitHub at runtime when toggled/enabled.
- Fragile area: disabling utilities that already mutated HeroForge data may require refresh; preserve status messages and no-op behavior.

### Decals Scroll Guards — `HeroForge_UI/Expanded_UI_Scroll_Guards.js`

- Manifest ID: `expanded-ui-scroll-guards`.
- Internal version: `2026-07-03-layouts`.
- Exposes `window.KW_HeroForgeUI.scrollGuards` with `enable`, `disable`, `retarget`, and `isEnabled`.
- Detects Decals source menus from visible `#menuC` text/attributes.
- Detects slot grids from visible `#menuD` token scoring.
- Classifies layout as vertical, split, or bottom before applying styles.
- Retargets after click, pointerup, staged timeouts, and interval.
- Fragile area: content/position/layout detection is required because HeroForge reuses menu IDs.
- Historical note: must support all three observed Decals UI setups: right-side grouped, right/left split, and bottom compact.

### Scroll Split Safe — `HeroForge_UI/HF_UI_Scroll_Split_Safe.js`

- Manifest ID: `hf-ui-scroll-split-safe`.
- Reapplies split-layout CSS override on load, short timeouts, and interval.
- Purpose is narrow: keep split slot menu from inheriting unsafe resize/max-height behavior.

### Slot Bridge — `HeroForge_UI/HF_UI_Slot_Bridge.js`

- Manifest ID: `hf-ui-slot-bridge`.
- Checks `kw.witchDock.toolEnabled.hf-ui-slot-bridge` from localStorage.
- Exposes `window.KW_HeroForgeUI.slotBridge`.
- Conditionally loads `HeroForge_UI/Expanded_Decal_Slots.js` from raw GitHub.
- If disabled, writes a disabled `expandedDecalSlots` state object and does not load the expansion module.

### Expanded Decal Slots — `HeroForge_UI/Expanded_Decal_Slots.js`

- Loaded by `HF_UI_Slot_Bridge.js` rather than directly by manifest.
- Target slot count: `96`.
- Egg part IDs: `3139`, `20091`.
- Exposes `window.KW_HeroForgeUI.expandedDecalSlots` state.
- Applies only when CK and CK.Options are available and the HF Core Tweaks signature is detected on part `21022`.
- Expands body upper, body lower, face, splatter font part, and egg parts.
- Fragile area: this must remain conditional. Without the expected HF Core Tweaks signature, it must remain a no-op.

### Decal Slot Swapper — Planned / Unresolved

- Not currently live in manifest.
- Goal: move or swap decals between existing slots without reapplying the decal, manually copying placement coordinates/transforms, or recoloring.
- Candidate UX paths: Witch Dock panel for organized/batch control; optional native HeroForge Decals UI injection for users who prefer in-panel actions.
- Must preserve decal identity, slot assignment, placement/transform data, projection/source target, color/material data, and undo/redo state.
- Investigate whether HeroForge's Photo Booth overlay swap behavior exposes a reusable interaction or data pattern.
- Fragile area: map the real decal data structure and update timing before mutation. Do not assume visible slot labels map directly to JSON array indexes without probes.

### Photo Mode PNG Series Capture — Planned / Unresolved

- Not currently live in manifest.
- Dedicated feature spec: `HISTORY/BULLSHIT/PHOTO_MODE_PNG_CAPTURE.md`.
- Goal: capture a high-resolution PNG sequence from Photo Mode/photo booth, ideally mimicking HeroForge's official spinny image-sequence exporter.
- Must preserve HeroForge Photo Booth effects/overlays/background behavior when those are the intended output.
- Separate from Persistent Booth. Persistent Booth itself is already live/working.
- Required output package: one ZIP containing ordered PNG frames and metadata/failure records where practical.
- Intended resolution options: 1024x1024 first, then 2048x2048, then 4K square if stable.
- Intended frame options: 36 / 72 / 120 or similar, with 72 matching the observed official exporter baseline.
- Prior official exporter observation: ZIP with roughly 72 frames at 512x512.
- Prior probe observation: WebGL `readPixels` captured real booth pixels but produced upside-down frames with grey margins and visible UI/fantasy background leakage.
- Prior probe v0.7: armed with `Alt+Shift+G`, captured after user clicked HF Capture, supported crop modes via `Alt+Shift+C`, and output `frames_2k_png.zip`.
- Current status: unfinished investigation. Read `PHOTO_MODE_PNG_CAPTURE.md`, `BOOTH_RENDERS_EXPORTS.md`, and `TIMING_AND_STATE.md` before attempting implementation.

## Status Terms

| Status | Meaning |
|---|---|
| Live | Loaded by the current install/manifest flow. |
| Live / hidden | Loaded by manifest but not exposed as a visible dock tab. |
| Live / conditional | Loaded only through another module or only applies when required runtime conditions are met. |
| Standalone canonical | Working Tampermonkey reference that must be preserved until migration is tested. |
| External canonical reference | Working external or user-provided script that must be compared before replacement or integration. |
| Historical diagnostic reference | Old standalone version/probe that explains a bug/regression but is not current live code. |
| Unresolved probe | Useful investigation code or behavior notes, but no confirmed finished implementation. |
| Migrating | In progress from standalone/probe form into Witch Dock architecture. |
| Investigating / unresolved | Known desired feature with useful probes/history but no confirmed working implementation. |
| Blocked | Known issue prevents reliable migration or release. |
| Deprecated | Should not be used with current Witch Dock. |

## Active Tasks

- Backfill project history from previous chats.
- Keep `HISTORY/STANDALONE_REFERENCES.md` current as standalone/probe sources are recovered.
- Fill `HISTORY/BULLSHIT/` topic files with durable HeroForge engine discoveries.
- Add deeper old-chat recovery notes for Booth minor fixes/effects edge cases, bones/kitbashing, JSON/library, and remaining standalone references.
- Investigate Photo Mode PNG Series Capture using existing probe history and the dedicated feature spec before writing new implementation.
- Investigate Decal Slot Swapper implementation paths for Witch Dock control, native Decals UI injection, or both.

## Migration Queue

Add standalone scripts here when they are ready to migrate into Witch Dock. Detailed reference statuses live in `HISTORY/STANDALONE_REFERENCES.md`.

| Tool / Script | Canonical Source | Target Location | Status | Notes |
|---|---|---|---|---|
| HF Core Tweaks / Lob decal slot reference | External user-provided / Lob-style Tampermonkey script | TBD; maybe direct HF Core Tweaks edit or `HeroForge_UI/` bridge strategy | External canonical reference | Compare before any slot-expansion edit. Current Witch Dock expansion depends on HF Core Tweaks signature and does not replace it. |
| Decal Slot Swapper | New feature investigation / future probes | TBD, likely `/tools/` plus optional `/HeroForge_UI/` native Decals UI injection | Investigating / unresolved | Move/swap decal data between slots while preserving placement/transforms, color/material data, source/projection target, and undo/redo integration. |
| Photo Mode PNG Series Capture | Prior standalone probes / old-chat history + `HISTORY/BULLSHIT/PHOTO_MODE_PNG_CAPTURE.md` | TBD, likely `/tools/` or clearly separated Booth subsection | Investigating / unresolved | First target should be 1024x1024, around 72 PNG frames, ZIP output, metadata, explicit arming, validated dimensions, and preserved Photo Booth effects. Persistent Booth is separate and already working. |
| Booth v12/v13 standalone history | Prior standalone Booth scripts | None unless diagnosing a Booth regression | Historical diagnostic reference | Use only for future Booth persistence/effects regression diagnosis. Persistent Booth is currently live/working. |
| Photo Booth tokenBg hard-lock probe | Prior standalone probe / old-chat history | None unless diagnosing backdrop/capture behavior | Historical diagnostic reference | Use to remember tokenBg image source behavior; not a finished feature. |
| Sync Extra Arms | Deprecated pre-Witch Dock standalone | None | Deprecated | Listed in README as deprecated/conflicting. Do not use with Witch Dock. |
| Body Editor / Body Editor BETA | Deprecated pre-Witch Dock standalone | Current `tools/Body_Editor.js` if comparing regression | Deprecated | Do not use as current source unless explicitly comparing a regression. |
| JSON Bulk Backup variants | Deprecated pre-Witch Dock standalone | Current `tools/JSON_Tool.js` if comparing regression | Deprecated | Do not use as current source unless explicitly comparing a regression. |
| Bone/kitbashing probes | Prior probing history | TBD | Needs recovery | Recover before major bone/kitbashing changes. |

## Blockers / Watch Items

- HeroForge runtime behavior is unstable and can invalidate DOM paths, scene graph paths, timing assumptions, or UI container reuse.
- Tools that rely on HeroForge internal state must preserve known-good timing, retry, snapshot, mutation, and probing behavior.
- Working standalone scripts remain canonical until the integrated Witch Dock version is tested and confirmed.
- Presentation is frozen unless UI/UX changes are explicitly requested.
- Booth, Decals, bone detection, and JSON/library workflows have the highest fragility and need old-chat recovery before major changes.
- Persistent Booth is live/working. Do not classify it as an open PNG-series capture task.
- PNG series capture is not solved; avoid assumptions about 512x512 limits, DOM/CSS booth frame control, hidden HDR/16-bit buffer access, or large ZIP reliability.
- High-resolution PNG sequences may stress browser memory/download behavior; start at 1024 before scaling to 2048/4K.

## Removals / Rejected Ideas

Document removed, deprecated, or rejected work here with the reason.

| Item | Decision | Reason | Date |
|---|---|---|---|
| Mandatory standalone diff files for every update | Rejected | GitHub history plus `CHANGELOG.md`, `MASTER.md`, and `PRE_FLIGHT_Check.md` now serve as the primary rollback/reference system. `/DIFFS/` remains optional for complex/risky patches. | 2026-07-09 |
| Global raw `#menuC` / `#menuD` Decals scroll styling | Rejected | HeroForge reuses these containers; global styling caused empty resize zones and does not handle all Decals layouts safely. | 2026-07-09 |
| Treating Photo Booth frame as only DOM/CSS | Rejected | Prior probing found the 1:1 booth frame can be baked into the WebGL scene; export pixels must be verified directly. | 2026-07-09 |
| Treating Persistent Booth as unfinished PNG-capture work | Rejected | Persistent Booth is live/working; PNG Series Capture is a separate planned/export feature. | 2026-07-09 |
