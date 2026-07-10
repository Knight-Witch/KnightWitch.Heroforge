# Pre-Flight Check Log

Use this file before repo updates to record what was checked, what could conflict, and what action is recommended.

## PFC-2026-07-09-005 — Persistent Booth Status Clarification

Date: 2026-07-09
Time: 18:18 PDT

Target files:
- `MASTER.md`
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
- `HISTORY/SESSION_LOG.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

Relevant history checked:
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
- user correction that Persistent Booth is already fully working, with only minor fixes expected later

Conflict risks:
- No JavaScript files changed.
- No `manifest.json` changes.
- No runtime behavior affected.
- Documentation correction only; separates live Persistent Booth from unresolved PNG-series capture work.

Recommended action:
- Proceed with docs-only correction.
- Treat Persistent Booth as live/working unless a specific regression or minor fix is later identified.

## PFC-2026-07-09-004 — Decals and Photo Capture History Backfill

Date: 2026-07-09
Time: 18:03 PDT

Target files:
- `MASTER.md`
- `HISTORY/Bullshit_Bible.md`
- `HISTORY/DECISIONS.md`
- `HISTORY/BULLSHIT/TIMING_AND_STATE.md`
- `HISTORY/BULLSHIT/DOM_AND_LAYOUT.md`
- `HISTORY/BULLSHIT/DECALS_AND_TEXTURES.md`
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
- `HISTORY/SESSION_LOG.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

Relevant history checked:
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/Bullshit_Bible.md`
- `HISTORY/BULLSHIT/TIMING_AND_STATE.md`
- `HISTORY/BULLSHIT/DOM_AND_LAYOUT.md`
- `HISTORY/BULLSHIT/DECALS_AND_TEXTURES.md`
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
- current source for Decals scroll guards, split safe, slot bridge, expanded decal slots, Booth, and Witch Dock core
- recovered prior-chat context for Decals three-layout scroll behavior and unfinished Photo Mode PNG series capture probing

Conflict risks:
- No JavaScript files changed.
- No `manifest.json` changes.
- No runtime behavior affected.
- Notes mix current source with recovered old-chat/probe history; unresolved PNG capture details are explicitly marked unresolved rather than completed.

Recommended action:
- Proceed with docs-only history backfill.
- Treat Decals scroll and PNG-series capture notes as mandatory pre-read material before editing those systems.

## PFC-2026-07-09-003 — Live Tool Documentation Backfill

Date: 2026-07-09
Time: 17:22 PDT

Target files:
- `MASTER.md`
- `HISTORY/BULLSHIT/TIMING_AND_STATE.md`
- `HISTORY/BULLSHIT/DOM_AND_LAYOUT.md`
- `HISTORY/BULLSHIT/DECALS_AND_TEXTURES.md`
- `HISTORY/BULLSHIT/KITBASHING_AND_BONES.md`
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
- `HISTORY/BULLSHIT/JSON_AND_LIBRARY.md`
- `HISTORY/SESSION_LOG.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

Relevant history checked:
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/Bullshit_Bible.md`
- relevant `HISTORY/BULLSHIT/` topic files
- `Witch_Dock.user.js`
- `tools/Body_Editor.js`
- `tools/Pose.js`
- `tools/Booth.js`
- `tools/JSON_Tool.js`
- `tools/Utilities.js`
- `HeroForge_UI/Expanded_UI_Scroll_Guards.js`
- `HeroForge_UI/HF_UI_Scroll_Split_Safe.js`
- `HeroForge_UI/HF_UI_Slot_Bridge.js`
- `HeroForge_UI/Expanded_Decal_Slots.js`

Conflict risks:
- No JavaScript files changed.
- No `manifest.json` changes.
- No runtime behavior affected.
- Notes are based on current source, not old-chat recovery.

Recommended action:
- Proceed with docs-only live tool status backfill.
- Use this pass as the current-source baseline before old-chat recovery for Decals/Utilities, Booth, bones/kitbashing, and JSON/library.

## PFC-2026-07-09-002 — Baseline Architecture Backfill

Date: 2026-07-09
Time: 16:57 PDT

Target files:
- `MASTER.md`
- `STYLE_KEYS.md`
- `HISTORY/DECISIONS.md`
- `HISTORY/BULLSHIT/MANIFEST_AND_LOADING.md`
- `HISTORY/SESSION_LOG.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

Relevant history checked:
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/Bullshit_Bible.md`
- `HISTORY/BULLSHIT/MANIFEST_AND_LOADING.md`
- `README.md`
- `manifest.json`
- `Witch_Dock.user.js`

Conflict risks:
- No JavaScript files changed.
- No `manifest.json` changes.
- No runtime behavior affected.
- Documentation only clarifies existing branch, install, manifest, directory, style, and rollback/reference rules.

Recommended action:
- Proceed with docs-only baseline backfill.
- Follow with segmented tool/history passes, starting with Decals/Utilities because they are the freshest fragile systems.

## PFC-2026-07-09-001 — Documentation Architecture Scaffold

Date: 2026-07-09
Time: 16:03 PDT

Target files:
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `STYLE_KEYS.md`
- `HISTORY/`
- `HISTORY/BULLSHIT/`
- `DIFFS/README.md`
- `BACKUP_VAULT/README.md`
- `ASSETS/README.md`
- `README.md`
- `CHANGELOG.md`

Relevant history checked:
- Current `README.md`
- Current `CHANGELOG.md`
- Current `manifest.json`
- Current HeroForge UI utility layout
- Current uploaded coding rules

Conflict risks:
- No JavaScript files changed.
- No manifest changes.
- No runtime behavior affected.

Recommended action:
- Create documentation structure first, then backfill detailed history in later passes.
