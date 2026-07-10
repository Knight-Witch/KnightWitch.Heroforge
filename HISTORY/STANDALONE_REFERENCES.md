# Standalone References

Inventory of standalone Tampermonkey scripts, external reference scripts, probes, and deprecated pre-Witch Dock scripts that matter to future repo work.

Use this file to prevent rehashing old investigations and to separate canonical working references from deprecated scripts and unfinished probes.

## Status Terms

| Status | Meaning |
|---|---|
| External canonical reference | Working external/user-provided script that Witch Dock may depend on or compare against. Do not reinterpret without direct comparison. |
| Historical diagnostic reference | Old standalone version/probe that explains a bug/regression but is not current live code. |
| Unresolved probe | Useful investigation code or behavior notes, but no confirmed finished implementation. |
| Deprecated | Old script should not be used with current Witch Dock unless explicitly resurrected for comparison. |
| Migrated / absorbed | Behavior has been moved into Witch Dock or current docs; keep reference only for regression history. |
| Needs recovery | Known or likely reference exists, but details still need old-chat/source recovery. |

## Canonical / High-Value References

### HF Core Tweaks / Lob Decal Slot Reference

Status:
- External canonical reference.

Current source state:
- Not stored as a Witch Dock module.
- Reference came from Lob/HF Core Tweaks-style Tampermonkey scripts provided outside the repo.

Known behavior / relevance:
- The working reference exposed extra decal slots beyond HeroForge default behavior.
- In prior testing, the visible result included alphabet slots and numeric slots `1` through `8`.
- Witch Dock's current `Expanded_Decal_Slots.js` does not replace HF Core Tweaks. It conditionally applies only when the expected HF Core Tweaks signature is present.

Rules:
- Treat the working HF Core Tweaks reference as canonical for decal-slot behavior until a Witch Dock-integrated version is tested and confirmed.
- Diagnose against the working reference before editing Witch Dock slot expansion.
- Do not make Witch Dock slot expansion unconditional.
- Do not change unrelated HF Core Tweaks behavior when experimenting with slot count expansion.

Related files:
- `HeroForge_UI/HF_UI_Slot_Bridge.js`
- `HeroForge_UI/Expanded_Decal_Slots.js`
- `tools/Utilities.js`
- `HISTORY/BULLSHIT/DECALS_AND_TEXTURES.md`

### Photo Mode PNG Series Probe v0.7

Status:
- Unresolved probe.

Known behavior / relevance:
- Did not depend on `CK.CanvasElement`.
- Zipped PNG frames into one download.
- Armed capture with `Alt+Shift+G`.
- Expected the user to click HeroForge Capture after arming.
- Crop mode cycled with `Alt+Shift+C`: `center` -> `bottom` -> `top`.
- Default ZIP name was `frames_2k_png.zip`.

Rules:
- Preserve explicit arming as a design concept unless a safer internal start path is found.
- Preserve ZIP output as the normal output package.
- Preserve user-selectable crop/aspect mode as a desired feature.
- Do not reintroduce a hard dependency on `CK.CanvasElement` without proving it is stable.
- Do not treat this probe as a finished tool.

Related files:
- `HISTORY/BULLSHIT/PHOTO_MODE_PNG_CAPTURE.md`
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
- `HISTORY/BULLSHIT/TIMING_AND_STATE.md`

### Photo Booth WebGL `readPixels` Probe

Status:
- Unresolved probe / partial success.

Known behavior / relevance:
- Captured real Booth pixels.
- Output frames were upside down.
- Grey margins appeared.
- Visible HeroForge fantasy/UI background leaked behind the booth area.

Rules:
- Do not discard this route only because raw output was flipped or margined.
- Treat flip/crop/mask/background cleanup as post-processing requirements if this route is reused.
- Do not mistake raw framebuffer readback for a finished Photo Booth export path.

Related files:
- `HISTORY/BULLSHIT/PHOTO_MODE_PNG_CAPTURE.md`
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md`

### Photo Booth Background / tokenBg Hard-Lock Probe

Status:
- Historical diagnostic reference.

Known behavior / relevance:
- Useful signal was image/source loading, not plain CSS.
- Backdrop asset signal used `/static/herobundles/decals/tokenBg/..._color_1024.png` URLs.
- One probe captured a `/tokenBg/paintedBgMoodyPortrait/..._color_1024.png` URL and blocked other `/tokenBg/..._color_1024.png` loads.
- Lock worked inside Photo Booth but not outside it.

Rules:
- For backdrop persistence or capture output, inspect tokenBg/image source behavior before assuming CSS is sufficient.
- Do not assume Photo Booth backdrop behavior generalizes outside Photo Booth.

Related files:
- `tools/Booth.js`
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md`

### Standalone Booth v12 / v13

Status:
- Historical diagnostic reference.

Current source state:
- Superseded by live `tools/Booth.js` / Persistent Booth.
- Persistent Booth is live/working. These notes are not an open rebuild task.

Known behavior / relevance:
- v12 was the last old standalone testing version in that sequence where overlays/effects/view/lighting persisted together.
- v13 and the old integrated behavior were similar during that old debugging period: backdrop persisted, effects failed, overlays stuck only after manual Booth off -> on.
- The suspected fix direction was not hard-blocking all teardown. Backdrop needed v13's one-shot allowance of `tokenizer.disable()` so it could commit.
- Effects should be restored after tokenizer transition rather than by blocking teardown entirely.

Rules:
- Use v12/v13 notes only when diagnosing a future Booth regression.
- Do not classify Persistent Booth as unfinished because of these historical notes.
- Do not rewrite Booth persistence while building PNG capture unless a concrete integration requirement is proven.

Related files:
- `tools/Booth.js`
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md`

## Deprecated Pre-Witch Dock Scripts

These are listed publicly in `README.md` as deprecated and conflicting with Witch Dock.

### Sync Extra Arms

Status:
- Deprecated.

Rules:
- Do not load alongside Witch Dock.
- Do not migrate as-is without a specific recovery need and direct source review.

### Body Editor / Body Editor BETA

Status:
- Deprecated.

Rules:
- Current Body Editor behavior lives in `tools/Body_Editor.js`.
- Do not use old standalone Body Editor/BETA as current source unless explicitly comparing a regression.

### JSON Bulk Backup Tool / Variations

Status:
- Deprecated.

Rules:
- Current JSON backup behavior lives in `tools/JSON_Tool.js`.
- Do not use old standalone JSON backup variants as current source unless explicitly comparing a regression.

## Migrated / Absorbed Behavior

### Decals Scroll Guard Probes / Layout Logs

Status:
- Migrated / absorbed.

Known behavior / relevance:
- Three Decals layouts were recovered and documented: right-side grouped, right/left split, and bottom compact.
- Current implementation lives in hidden HeroForge UI modules.

Rules:
- Use current docs and source as the baseline.
- Do not revive older broad `#menuC` / `#menuD` styling approaches.

Related files:
- `HeroForge_UI/Expanded_UI_Scroll_Guards.js`
- `HeroForge_UI/HF_UI_Scroll_Split_Safe.js`
- `HISTORY/BULLSHIT/DOM_AND_LAYOUT.md`
- `HISTORY/BULLSHIT/DECALS_AND_TEXTURES.md`

## Needs Recovery

### Bone / Kitbashing Standalone Probes

Status:
- Needs recovery.

Known behavior / relevance:
- Current Witch Dock footer bone detection uses tolerant scene-graph probing, baseline snapshots, delayed diffing, pointer/click listeners, and startup retries.
- Additional standalone probing history may exist and should be recovered before major bone/kitbashing changes.

Related files:
- `Witch_Dock.user.js`
- `HISTORY/BULLSHIT/KITBASHING_AND_BONES.md`
- `HISTORY/BULLSHIT/TIMING_AND_STATE.md`

### Remaining Standalone Tampermonkey Scripts from User Uploads

Status:
- Needs recovery.

Known behavior / relevance:
- User has provided external Tampermonkey script bundles during prior debugging.
- Each standalone script should be inventoried by filename/source once recovered or re-uploaded.

Rules:
- Do not assume an uploaded standalone is obsolete until reviewed.
- If a standalone script works, treat it as canonical for its behavior until the migrated Witch Dock version is tested and confirmed.

## Migration Queue Snapshot

| Reference | Status | Target | Action |
|---|---|---|---|
| HF Core Tweaks / Lob decal reference | External canonical reference | Maybe `HeroForge_UI/` or direct HF Core Tweaks edit, depending on final strategy | Compare before slot-expansion edits. |
| Photo Mode PNG Series Probe v0.7 | Unresolved probe | Future visible tool or separated Booth subsection | Use as design/probe reference, not final code. |
| Photo Booth `readPixels` probe | Unresolved probe | Future capture implementation detail | Keep as partial proof of booth pixel access. |
| Photo Booth tokenBg hard-lock probe | Historical diagnostic reference | Booth/capture diagnostics | Use for backdrop source behavior. |
| Standalone Booth v12/v13 | Historical diagnostic reference | Future minor Booth regression fixes only | Do not treat as open rebuild. |
| Sync Extra Arms | Deprecated | None | Do not use with Witch Dock. |
| Body Editor / Body Editor BETA | Deprecated | Current `tools/Body_Editor.js` | Only compare if debugging regression. |
| JSON Bulk Backup variants | Deprecated | Current `tools/JSON_Tool.js` | Only compare if debugging regression. |
| Bone/kitbashing probes | Needs recovery | TBD | Recover before major bone/kitbashing changes. |
