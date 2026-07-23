# Decisions

Durable decisions that should guide future repo work.

## Active Decisions

### 2026-07-22 — Large External HeroForge Archives Use Distilled Notes and a Source Manifest

Decision:
- Store extracted technical findings from large, unstable, or obsolete external HeroForge archives in focused `HISTORY/BULLSHIT/` topic files.
- Record exact filenames, SHA-256 hashes, provenance, archive inventory, and dataset statistics in `HISTORY/REFERENCES/README.md`.
- Do not copy old executable userscripts into live `/tools/`, `/HeroForge_UI/`, or `manifest.json` merely for preservation.
- Keep raw source files in the GPT project/file archive unless a later investigation materially requires repo-local copies.
- If raw copies are later committed, place them under `HISTORY/REFERENCES/`, use non-installing `.txt` filenames, and never register them as live modules.

Reason:
- The archived debug bundle and Lob script archive are valuable reverse-engineering references but contain stale APIs, partial compatibility patches, and executable code that should not sit beside production modules.
- Distilled notes make high-value findings searchable without implying that historical object paths or slot catalogs are current HeroForge contracts.
- Source hashes and inventory preserve provenance and make exact raw files recoverable or verifiable later.

Applies to:
- `HISTORY/REFERENCES/README.md`
- `HISTORY/BULLSHIT/DEBUG_UI_AND_INTERNALS.md`
- `HISTORY/BULLSHIT/SLOTS_JOINTS_AND_ATTACHMENTS.md`
- `HISTORY/STANDALONE_REFERENCES.md`
- future external HeroForge archives and recovered standalone references

### 2026-07-13 — Advanced Lighting Uses One Dedicated Sub-Project Spec and a Separate Future Booth-Tab Module

Decision:
- Use `HISTORY/BULLSHIT/LIGHTING_AND_EXTRA_LIGHTS.md` as the canonical combined sub-project specification and technical history for Advanced Lighting / Extra Lights.
- Follow the same documentation pattern as `HISTORY/BULLSHIT/DECAL_SLOT_SWAPPER.md`; do not create a second overlapping project-plan document that duplicates status, architecture, probe strategy, risks, and migration order.
- When the feature is ready to migrate, prefer a separate visible module such as `tools/Advanced_Lighting.js` that registers into the existing `Booth` tab.
- Do not merge experimental lighting runtime logic into `tools/Booth.js` merely because the user-facing controls are intended to appear under the Booth tab.
- After the current v0.6 shadow diagnostic milestone is reviewed, split the cumulative standalone harness into a compact Lighting Injection Reference and a focused Shadow Pipeline Probe.

Reason:
- The cumulative probe has grown into a menu of historical experiments that are no longer all relevant to the current test round.
- A compact known-good injection reference is safer for future parity testing and Witch Dock migration.
- A focused shadow probe reduces diagnostic noise and prevents obsolete controls from being mistaken for active implementation requirements.
- One dedicated sub-project/spec file matches the existing Decal Slot Swapper tracking model and avoids contradictory duplicate planning documents.
- Persistent Booth is production behavior and should remain isolated from experimental lighting work.

Applies to:
- `HISTORY/BULLSHIT/LIGHTING_AND_EXTRA_LIGHTS.md`
- `HISTORY/STANDALONE_REFERENCES.md`
- future standalone lighting probes
- future `tools/Advanced_Lighting.js` or equivalent lighting module
- `tools/Booth.js`
- future Booth-tab registration and manifest work

### 2026-07-12 — Documentation Checkpoints Are Required During Investigation

Decision:
- Treat repository documentation as the durable project memory, not chat history.
- Update the relevant tracking/history files after meaningful validated findings, corrections, status changes, architecture decisions, blockers, canonical-reference changes, or material probe milestones.
- Batch closely related low-level observations rather than committing every repeated test action.
- Do not begin the next material probe/code stage while the current docs are knowingly stale.
- Correct or remove outdated active claims instead of leaving contradictory statements in place.

Reason:
- Chat/model memory is not reliable enough to preserve fragile HeroForge findings across OpenAI updates, context resets, or future development sessions.
- Milestone-based checkpoints preserve critical state without creating noise from every minor test click.

Applies to:
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/SESSION_LOG.md`
- `HISTORY/DECISIONS.md`
- `HISTORY/STANDALONE_REFERENCES.md`
- relevant `HISTORY/BULLSHIT/` topic files
- all standalone probe and migration work

### 2026-07-12 — Physical Lighting, Rim Lighting, and Persistent Booth Stay Separate

Decision:
- Keep custom physical DirectionalLight/SphereLight work separate from future Fresnel/shader-based rim lighting.
- Keep advanced lighting investigation separate from Persistent Booth implementation.
- Do not modify `tools/Booth.js` for lighting unless an isolated compatibility regression proves a concrete integration requirement.
- Treat `HeroForge_Lighting_Injection_Probe_v0.3.0.txt` as the compact partial working reference for the known-good second DirectionalLight injection behavior until the planned dedicated Lighting Injection Reference replaces it.
- Treat `HeroForge_Lighting_Injection_Probe_v0.6.0.txt` as the current active shadow diagnostic probe until its runtime report is reviewed.

Reason:
- Physical lights, shadow maps, and view-dependent rim shading use different renderer paths and failure modes.
- Persistent Booth is already live/working, while the lighting probes are standalone and unresolved.
- The initial Witch Dock compatibility regression was confounded by canvas-preset changes and does not prove Witch Dock or Persistent Booth caused shadow failure.

Applies to:
- `HISTORY/BULLSHIT/LIGHTING_AND_EXTRA_LIGHTS.md`
- `HISTORY/STANDALONE_REFERENCES.md`
- future lighting tools/modules
- future shader/rim-light probe
- `tools/Booth.js`

### 2026-07-09 — Witch Dock Documentation Structure

Decision:
- Use root-level tracking docs plus segmented `HISTORY/BULLSHIT/` topic files.

Reason:
- Witch Dock needs durable project memory and HeroForge engine notes without turning one file into an unusable junk drawer.

Applies to:
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `STYLE_KEYS.md`
- `HISTORY/`

### 2026-07-09 — GitHub History as Default Diff Source

Decision:
- Do not require standalone diff files for normal updates.
- Use GitHub commit history, `CHANGELOG.md`, `MASTER.md`, and `PRE_FLIGHT_Check.md` as the primary rollback/reference system.
- Use `/DIFFS/` only for complex or risky changes that need a preserved standalone patch.

Reason:
- Direct repo access makes mandatory separate diff files redundant for routine changes.

Applies to:
- Routine repo updates
- Rollback/reference workflow
- `DIFFS/`

### 2026-07-09 — `Witch_Scripts` Is the Live Branch

Decision:
- Treat `Witch_Scripts` as the live operational branch for Witch Dock unless explicitly changed.
- `main` is not the active install branch.

Reason:
- The public install/update URLs and manifest raw URLs point at `Witch_Scripts`.

Applies to:
- `Witch_Dock.user.js`
- `manifest.json`
- README install instructions
- Future release edits

### 2026-07-09 — Manifest-Driven Tool Loading

Decision:
- Use `manifest.json` as the live module inventory.
- Visible tools belong in `/tools/`.
- Hidden HeroForge UI utilities belong in `/HeroForge_UI/`.
- Only update `manifest.json` when adding, removing, renaming, or changing live-loaded modules.

Reason:
- Witch Dock already uses a manifest loader, and keeping module roles separated reduces conflicts between global dock behavior and internal tool logic.

Applies to:
- `manifest.json`
- `/tools/`
- `/HeroForge_UI/`
- New tool migration

### 2026-07-09 — Standalone Tampermonkey References Can Be Canonical

Decision:
- A working standalone Tampermonkey script remains canonical until the Witch Dock-integrated version is tested and confirmed.
- Migration should preserve behavior first and clean structure second.

Reason:
- HeroForge behavior is unstable enough that working timing, probing, and state logic should not be reinterpreted during migration.

Applies to:
- Standalone probes
- Tool migration queue
- Reference-vs-integrated debugging
- `HISTORY/STANDALONE_REFERENCES.md`

### 2026-07-09 — Standalone References Get a Separate Inventory

Decision:
- Track external scripts, standalone probes, deprecated scripts, and diagnostic references in `HISTORY/STANDALONE_REFERENCES.md`.
- Do not rely on memory or scattered changelog entries to determine whether a standalone script is canonical, deprecated, migrated, or unresolved.

Reason:
- Witch Dock uses working standalone probes as behavioral references, but not every standalone should be migrated or run beside the live dock.
- A separate inventory prevents confusing deprecated pre-Witch Dock scripts with canonical external references or unresolved probes.

Applies to:
- `HISTORY/STANDALONE_REFERENCES.md`
- `MASTER.md` migration queue
- Future migration decisions

### 2026-07-09 — Decals Scroll Must Support All Observed Layouts

Decision:
- Decals scroll/resize behavior must support right-side grouped, right/left split, and bottom compact layouts.
- Do not use global raw `#menuC` / `#menuD` styling as the implementation.

Reason:
- HeroForge reuses menu containers across tabs and layouts.
- Global styling previously caused empty resize zones and did not safely represent all three observed Decals UI setups.

Applies to:
- `HeroForge_UI/Expanded_UI_Scroll_Guards.js`
- `HeroForge_UI/HF_UI_Scroll_Split_Safe.js`
- `tools/Utilities.js`

### 2026-07-09 — Photo Mode PNG Series Must Preserve HF Booth Render Path

Decision:
- Future PNG series capture work should prioritize HeroForge's own Photo Booth/capture/export path where possible.
- Capture work must preserve booth effects, overlays, and backgrounds when those are the intended output.
- Do not treat DOM/CSS resizing or raw canvas capture as automatically equivalent to HeroForge Photo Booth export.

Reason:
- Prior probing found the 1:1 booth frame can be baked into the WebGL scene.
- The user specifically needs Photo Booth effects/overlays.
- Browser/Tampermonkey capture can access final pixels, but not hidden HDR/16-bit buffers.

Applies to:
- Future Photo Mode / PNG Series capture tool
- `tools/Booth.js`
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
- `HISTORY/BULLSHIT/PHOTO_MODE_PNG_CAPTURE.md`

### 2026-07-09 — Photo Mode PNG Capture Starts Conservative

Decision:
- First implementation target should be conservative: 1024x1024, around 72 PNG frames, ZIP output, metadata/failure records, explicit arming, and validated frame dimensions.
- 2048, 4K, 16:9 cinematic output, overlay compositing, and companion app ideas are later-stage features unless they fall out safely from the first working path.

Reason:
- High-resolution PNG sequences can stress browser memory, ZIP generation, and download behavior.
- The capture path is not solved yet, so reliability and correct Photo Booth output matter before max resolution or expanded feature surface.

Applies to:
- `HISTORY/BULLSHIT/PHOTO_MODE_PNG_CAPTURE.md`
- Future Photo Mode / PNG Series capture tool
- `MASTER.md` migration queue

## Entry Template

### YYYY-MM-DD — Decision Title

Decision:
- 

Reason:
- 

Applies to:
- 
