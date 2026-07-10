# Decisions

Durable decisions that should guide future repo work.

## Active Decisions

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
