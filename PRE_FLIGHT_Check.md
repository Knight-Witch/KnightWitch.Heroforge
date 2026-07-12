# Pre-Flight Check Log

Use this file before repo updates to record what was checked, what could conflict, and what action is recommended.

## PFC-2026-07-12-008 — Advanced Lighting Documentation Checkpoint

Date: 2026-07-12
Time: 14:08 PDT

Target files:
- `MASTER.md`
- `HISTORY/README.md`
- `HISTORY/Bullshit_Bible.md`
- `HISTORY/BULLSHIT/LIGHTING_AND_SHADOWS.md`
- `HISTORY/STANDALONE_REFERENCES.md`
- `HISTORY/DECISIONS.md`
- `HISTORY/SESSION_LOG.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

Relevant history checked:
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/README.md`
- `HISTORY/Bullshit_Bible.md`
- `HISTORY/STANDALONE_REFERENCES.md`
- `HISTORY/DECISIONS.md`
- `HISTORY/SESSION_LOG.md`
- `HISTORY/BULLSHIT/TIMING_AND_STATE.md`
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
- current standalone probe sources: `HeroForge_Lighting_Probe_v0.1.0.txt`, `HeroForge_Lighting_Injection_Probe_v0.1.0.txt`, `HeroForge_Lighting_Injection_Probe_v0.2.0.txt`, and `HeroForge_Lighting_Injection_Probe_v0.3.0.txt`
- current diagnostic reports for Injection Probe v0.1.0, v0.2.0, and v0.3.0
- current user corrections: native SphereLight count changes were manual isolation toggles; Persistent Booth is not to be modified; Witch Dock is not proven to have caused the later shadow regression

Connected modules reviewed:
- `tools/Booth.js` documentation and known runtime responsibilities through `MASTER.md` and `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
- `manifest.json` loading rules through `MASTER.md`; no manifest change required
- standalone probe lifecycle, custom object ownership, attachment path, target handling, shadow setup, cleanup, and report behavior

Conflict risks:
- No JavaScript files changed.
- No userscript probe files changed.
- No `manifest.json` changes.
- No storage keys, UI, or runtime behavior changed.
- Lighting probes remain standalone and unresolved; documentation must not classify them as live Witch Dock modules.
- A second DirectionalLight is confirmed working, but shadow refresh remains unresolved.
- A third SphereLight is counted but not visibly working; material counts must not be presented as proof of visible illumination.
- The later shadow failure involved both Witch Dock compatibility testing and a canvas preset; do not attribute causation to Witch Dock or Persistent Booth without isolated evidence.
- Persistent Booth remains live/working and separate from advanced lighting development.
- Fresnel/rim lighting is queued only; no shader hook has been proven.

Recommended action:
- Proceed with a documentation-only checkpoint.
- Add a dedicated lighting/shadow history file and inventory the standalone probes.
- Add a durable rule requiring documentation checkpoints after meaningful validated findings, corrections, status changes, decisions, blockers, or probe milestones.
- Batch trivial repeated observations, but update docs before starting the next material probe/code stage when current documentation is knowingly stale.
- Continue DirectionalLight shadow-refresh diagnosis in standalone probes before any Witch Dock migration.

## PFC-2026-07-09-007 — Standalone Reference Inventory Backfill

Date: 2026-07-09
Time: 18:44 PDT

Target files:
- `HISTORY/STANDALONE_REFERENCES.md`
- `HISTORY/README.md`
- `MASTER.md`
- `HISTORY/Bullshit_Bible.md`
- `HISTORY/DECISIONS.md`
- `HISTORY/SESSION_LOG.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

Relevant history checked:
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `README.md`
- `HISTORY/README.md`
- `HISTORY/Bullshit_Bible.md`
- `HISTORY/DECISIONS.md`
- `HISTORY/BULLSHIT/PHOTO_MODE_PNG_CAPTURE.md`
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
- Known external/standalone reference context for HF Core Tweaks/Lob decal slots, Booth v12/v13, Photo Mode PNG v0.7, WebGL readPixels, tokenBg backdrop probe, and deprecated pre-Witch Dock scripts

Conflict risks:
- No JavaScript files changed.
- No `manifest.json` changes.
- No runtime behavior affected.
- Reference statuses are documentation-only and can be refined as more source files are recovered.

Recommended action:
- Proceed with docs-only standalone reference inventory.
- Check `HISTORY/STANDALONE_REFERENCES.md` before migrating, replacing, or comparing standalone/probe behavior.

## PFC-2026-07-09-006 — Photo Mode PNG Capture Feature Spec Backfill

Date: 2026-07-09
Time: 18:31 PDT

Target files:
- `MASTER.md`
- `HISTORY/Bullshit_Bible.md`
- `HISTORY/DECISIONS.md`
- `HISTORY/BULLSHIT/PHOTO_MODE_PNG_CAPTURE.md`
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
- `HISTORY/BULLSHIT/TIMING_AND_STATE.md`
- `HISTORY/SESSION_LOG.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

Relevant history checked:
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/Bullshit_Bible.md`
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
- `HISTORY/BULLSHIT/TIMING_AND_STATE.md`
- prior capture discussion details: desired 1024/2048/4K options, ZIP output, frame count/smoothness options, explicit arming workflow, crop/aspect ideas, 16:9 future idea, GM/download fallback, companion helper idea, overlay/layer management ideas, and Persistent Booth separation

Conflict risks:
- No JavaScript files changed.
- No `manifest.json` changes.
- No runtime behavior affected.
- Adds a dedicated spec file; no live module path changed.
- Persistent Booth remains marked live/working and separate.

Recommended action:
- Proceed with docs-only feature-spec backfill.
- Before implementation, use `PHOTO_MODE_PNG_CAPTURE.md` as the product/requirements source and `BOOTH_RENDERS_EXPORTS.md` / `TIMING_AND_STATE.md` as the probe/constraint sources.

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
