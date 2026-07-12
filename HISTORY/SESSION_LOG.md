# Session Log

Chronological development and testing notes. Use this for concise project-state updates that matter across chats.

## 2026-07-12 — Advanced Lighting Investigation Checkpoint

- Target: persist the current HeroForge custom-light investigation and close the documentation gap that left validated probe findings only in chat.
- Action: added `HISTORY/BULLSHIT/LIGHTING_AND_SHADOWS.md`; inventoried Lighting Probe v0.1.0 and Injection Probe v0.1.0-v0.3.0; updated `MASTER.md`, `HISTORY/Bullshit_Bible.md`, `HISTORY/STANDALONE_REFERENCES.md`, and `HISTORY/DECISIONS.md`; added a milestone-based documentation-checkpoint rule.
- Result: repo memory now records the working second DirectionalLight, position/intensity behavior, Photo Booth pre-attach shadow allocation, editor/Photo Booth targeting difference, stale shadow-matrix regression, non-working but counted third SphereLight, canvas-preset confounder, Persistent Booth separation, and queued Fresnel/rim-light investigation.
- Test notes: documentation-only update; no JavaScript, userscript metadata, `manifest.json`, storage keys, UI, or runtime behavior changed.
- Follow-up: stabilize custom DirectionalLight shadow refresh/lifecycle behavior with standalone probes. After that, begin a read-only shader-hook probe for camera-relative Fresnel rim lighting.

## 2026-07-09 — Standalone Reference Inventory Backfill

- Target: standalone scripts, external references, probes, deprecated scripts, and migration status.
- Action: added `HISTORY/STANDALONE_REFERENCES.md`, linked it from `HISTORY/README.md`, expanded `MASTER.md` migration/status notes, added a standalone-inventory decision, and updated Bullshit Bible critical rules/backfill queue.
- Result: repo memory now distinguishes HF Core Tweaks/Lob decal-slot reference, Photo Mode PNG v0.7 probe, WebGL readPixels probe, tokenBg backdrop probe, Booth v12/v13 history, deprecated pre-Witch Dock scripts, migrated Decals scroll probes, and bone/kitbashing references that still need recovery.
- Test notes: documentation-only update; no JavaScript or manifest behavior changed.
- Follow-up: when external script bundles or old probes are recovered/re-uploaded, add exact filenames/source notes to `HISTORY/STANDALONE_REFERENCES.md` before migration or replacement work.

## 2026-07-09 — Photo Mode PNG Capture Feature Spec Backfill

- Target: intended product/feature spec for the unresolved Photo Mode PNG Series Capture tool.
- Action: added `HISTORY/BULLSHIT/PHOTO_MODE_PNG_CAPTURE.md` and updated `MASTER.md`, `HISTORY/Bullshit_Bible.md`, `HISTORY/DECISIONS.md`, `TIMING_AND_STATE.md`, and `BOOTH_RENDERS_EXPORTS.md` with cross-links and requirements.
- Result: capture docs now distinguish product requirements from probe history. Intended first target is 1024x1024, around 72 PNG frames, ZIP output, metadata/failure records, explicit arming, validated dimensions, and preserved Photo Booth output/effects. Later-stage ideas include 2048, 4K, 16:9 cinematic output, overlay/layer controls, GM/download fallback, and possible companion helper.
- Test notes: documentation-only update; no JavaScript or manifest behavior changed.
- Follow-up: before implementing, use `PHOTO_MODE_PNG_CAPTURE.md` for requirements and `BOOTH_RENDERS_EXPORTS.md` / `TIMING_AND_STATE.md` for probe constraints. Persistent Booth remains live/working and separate.

## 2026-07-09 — Persistent Booth Status Clarification

- Target: documentation wording around Persistent Booth and PNG-series capture.
- Action: updated `MASTER.md` and `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md` to explicitly state that Persistent Booth is live/working and not part of the unresolved PNG-series capture todo.
- Result: future work should treat PNG-series capture as a separate planned/unresolved feature and treat Booth itself as live, with only minor fixes expected unless a regression is confirmed.
- Test notes: documentation-only correction; no JavaScript or manifest behavior changed.
- Follow-up: if a minor Booth fix is requested later, handle surgically against the live tool. If PNG-series capture is requested, preserve Booth output/effects but do not rebuild Persistent Booth.

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
