# Standalone References

Inventory of standalone Tampermonkey scripts, external reference scripts, probes, and deprecated pre-Witch Dock scripts that matter to future repo work.

Use this file to prevent rehashing old investigations and to separate canonical working references from deprecated scripts and unfinished probes.

## Status Terms

| Status | Meaning |
|---|---|
| External canonical reference | Working external/user-provided script that Witch Dock may depend on or compare against. Do not reinterpret without direct comparison. |
| Standalone canonical | Working standalone probe/reference that must be preserved until migration is tested and confirmed. |
| Historical diagnostic reference | Old standalone version/probe that explains a bug/regression but is not current live code. |
| Unresolved probe | Useful investigation code or behavior notes, but no confirmed finished implementation. |
| Queued / unproven | Defined follow-up investigation that has not yet produced an active proof-of-concept. |
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

### HeroForge Lighting Probe v0.1.0

Status:
- Read-only unresolved probe / canonical diagnostic reference.

Files:
- `HeroForge_Lighting_Probe_v0.1.0.txt`
- `HeroForge_Lighting_Probe_v0.1.0_diff.txt`

Current source state:
- Developed and tested as standalone Tampermonkey probe files outside the live repository modules.
- Probe source is not currently stored as a live Witch Dock module.

Known behavior / relevance:
- Scans HeroForge globals, object graphs, light constructors, active lighting roots, material light counts, and bundle support.
- Identified `CK.environment.lighting`, native `sunlight`, native `_partLightGroup`, SphereLight instances, and dynamic renderer support for several light families.
- Exports diagnostic JSON without intentionally mutating the scene.

Rules:
- Preserve this probe as read-only.
- Do not turn it into the injection test harness.
- Use tolerant scene/object discovery rather than hard-coded child indexes or UUIDs.

Related files:
- `HISTORY/BULLSHIT/LIGHTING_AND_EXTRA_LIGHTS.md`
- `HISTORY/BULLSHIT/TIMING_AND_STATE.md`
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md`

### HeroForge Lighting Injection Probe v0.1.0

Status:
- Historical diagnostic reference / partial success.

Files:
- `HeroForge_Lighting_Injection_Probe_v0.1.0.txt`
- `HeroForge_Lighting_Injection_Probe_v0.1.0_diff.txt`

Known behavior / relevance:
- Established tolerant active-rig discovery, custom owned-group attachment, cleanup, report export, and lifecycle monitoring.
- Confirmed a second non-shadow DirectionalLight can visibly illuminate the figure.
- Confirmed a third SphereLight can be counted by material light configuration while still producing no visible illumination.

Rules:
- Preserve the working DirectionalLight injection path when extending later probes.
- Do not interpret material light counts as proof of visible light contribution.
- Do not dispose cloned/shared resources during cleanup.

Related files:
- `HISTORY/BULLSHIT/LIGHTING_AND_EXTRA_LIGHTS.md`

### HeroForge Lighting Injection Probe v0.2.0

Status:
- Historical diagnostic reference / transform and post-attach-shadow control probe.

Files:
- `HeroForge_Lighting_Injection_Probe_v0.2.0.txt`
- `HeroForge_Lighting_Injection_Probe_v0.2.0_diff.txt`

Known behavior / relevance:
- Added DirectionalLight position, target, intensity, post-attachment shadow toggle, and expanded matrix/shadow diagnostics.
- Position and intensity controls worked in editor and Photo Booth.
- Target changes visibly affected Photo Booth but not the editor during that test.
- Enabling shadows after attachment was not the reliable working path.

Rules:
- Retain as the control/reference for post-attachment shadow failure.
- Do not replace the later pre-attach diagnostic path with this toggle-only path.

Related files:
- `HISTORY/BULLSHIT/LIGHTING_AND_EXTRA_LIGHTS.md`

### HeroForge Lighting Injection Probe v0.3.0

Status:
- Standalone canonical / partial working reference for the known-good second DirectionalLight injection behavior.
- Historical shadow-allocation diagnostic reference.

Files:
- `HeroForge_Lighting_Injection_Probe_v0.3.0.txt`
- `HeroForge_Lighting_Injection_Probe_v0.3.0_diff.txt`

Known behavior / relevance:
- Preserves working DirectionalLight illumination, position, intensity, target, report, lifecycle, and cleanup behavior.
- Added a pre-attachment `castShadow: true` path.
- Photo Booth allocated an independent custom shadow map and calculated matrix in one v0.3 run.
- A later test retained shadow state but showed a stale matrix after movement.
- Controlled detach/re-attach did not force a matrix refresh.
- Later controlled v0.4-v0.5 tests did not reproduce visible independent custom DirectionalLight shadows.

Rules:
- Preserve the working light-injection behavior as the current compact reference until a dedicated Lighting Injection Reference replaces it.
- Treat the pre-attachment shadow result as historical diagnostic behavior, not proof of a solved visible custom-shadow feature.
- Do not claim Witch Dock or Persistent Booth caused the shadow regression without isolated A/B evidence.
- Do not migrate the cumulative probe into Witch Dock.

Related files:
- `HISTORY/BULLSHIT/LIGHTING_AND_EXTRA_LIGHTS.md`
- `MASTER.md`

### HeroForge Lighting Injection Probe v0.4.0

Status:
- Historical diagnostic reference / native-sun shadow-path probe.

Files:
- `HeroForge_Lighting_Injection_Probe_v0.4.0.txt`
- `HeroForge_Lighting_Injection_Probe_v0.4.0_diff.txt`

Known behavior / relevance:
- Added detailed shadow-binding inspection, native-sun takeover, and native-sun restore tests.
- Confirmed the custom DirectionalLight still visibly rendered while visible custom shadows were absent.
- Identified two materials using `additionalSunShadow: true` with `additionalSunShadowMap` textures distinct from the native `sun.shadow.map`.
- Copying the probe DirectionalLight state onto the native sun caused visible native sun shadows to disappear.
- Restoring the original native sun state caused visible shadows to return.

Rules:
- Retain as the reference for the native-sun takeover/restore discovery.
- Do not assume direct DirectionalLight property mutation triggers HeroForge's visible shadow refresh path.

Related files:
- `HISTORY/BULLSHIT/LIGHTING_AND_EXTRA_LIGHTS.md`

### HeroForge Lighting Injection Probe v0.5.0

Status:
- Historical diagnostic reference / completed shadow-resource tracing milestone.

Files:
- `HeroForge_Lighting_Injection_Probe_v0.5.0.txt`
- `HeroForge_Lighting_Injection_Probe_v0.5.0_diff.txt`

Known behavior / relevance:
- Added `additionalSunShadowMap` reference tracing and owner-path tracing.
- Compared working baseline -> broken native-sun override -> restored native state.
- Confirmed the same native `sun.shadow.map` object persisted across all three states.
- Confirmed the same two `additionalSunShadowMap` texture objects persisted across all three states.
- Found direct owners at `HF.summonCircle.children[0/1].material.uniforms.additionalSunShadowMap.value`.
- Broad graph tracing hit the `20000` node ceiling.

Rules:
- Retain as the reference for stable shadow-resource object identity across working/broken/restored states.
- Do not interpret stable object identity as proof that texture contents or hidden renderer state are unchanged.

Related files:
- `HISTORY/BULLSHIT/LIGHTING_AND_EXTRA_LIGHTS.md`

### HeroForge Lighting Injection Probe v0.6.0

Status:
- Current active unresolved probe.
- Created but not yet validated by a returned runtime report at the 2026-07-13 documentation checkpoint.

Files:
- `HeroForge_Lighting_Injection_Probe_v0.6.0.txt`
- `HeroForge_Lighting_Injection_Probe_v0.6.0_diff.txt`

Purpose / relevance:
- Target `additionalSunShadowMap` texture state and backing-resource behavior.
- Inspect texture/source/image identity, versions, dimensions, render-target relationships, and targeted owner references.
- Compare the same working baseline -> broken override -> restored sequence.

Rules:
- Do not treat v0.6.0 as a validated result until its report is reviewed.
- After the v0.6 result is documented, split the cumulative harness into a compact Lighting Injection Reference and focused Shadow Pipeline Probe.

Related files:
- `HISTORY/BULLSHIT/LIGHTING_AND_EXTRA_LIGHTS.md`

### Camera-Relative Rim Lighting Probe

Status:
- Queued / unproven.

Current source state:
- No active script yet.
- Planned only after physical DirectionalLight stabilization.

Goal / relevance:
- Identify a stable HeroForge shader/material hook for a camera-relative Fresnel rim effect.
- Produce silhouette/grazing-angle illumination without broadly lighting the model's back side.
- Support later spin-capture use where the rim remains camera-relative.

Rules:
- Begin with a read-only shader-hook probe.
- Keep rim lighting separate from physical DirectionalLight and SphereLight injection.
- Do not patch shader source or bundle internals until the active material compile path is identified.

Related files:
- `HISTORY/BULLSHIT/LIGHTING_AND_EXTRA_LIGHTS.md`

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

## Migration Summary

| Reference | Status | Likely Destination | Current Rule |
|---|---|---|---|
| HF Core Tweaks / Lob decal reference | External canonical reference | Maybe `HeroForge_UI/` or direct HF Core Tweaks edit, depending on final strategy | Compare before slot-expansion edits. |
| HeroForge Lighting Probe v0.1.0 | Read-only unresolved probe | Diagnostics only | Preserve read-only; use for runtime/bundle discovery. |
| Lighting Injection Probe v0.1.0 | Historical diagnostic reference | None directly | Preserve proof of second DirectionalLight and non-working counted SphereLight. |
| Lighting Injection Probe v0.2.0 | Historical diagnostic reference | None directly | Preserve transform controls and post-attach-shadow control result. |
| Lighting Injection Probe v0.3.0 | Standalone canonical / partial working reference | Future Advanced Lighting subsystem after stabilization | Preserve known-good second DirectionalLight injection; do not claim solved custom shadows. |
| Lighting Injection Probe v0.4.0 | Historical diagnostic reference | Shadow-pipeline diagnostics | Preserve native-sun takeover/restore and `additionalSunShadowMap` discovery. |
| Lighting Injection Probe v0.5.0 | Historical diagnostic reference | Shadow-pipeline diagnostics | Preserve stable shadow-resource identity findings. |
| Lighting Injection Probe v0.6.0 | Current active unresolved probe | Shadow-pipeline diagnostics | Validate report, document result, then split cumulative harness. |
| Camera-Relative Rim Lighting Probe | Queued / unproven | Future shader/material subsystem | Start with read-only shader-hook discovery after DirectionalLight stabilization. |
| Photo Mode PNG Series Probe v0.7 | Unresolved probe | Future visible tool or separated Booth subsection | Use as design/probe reference, not final code. |
| Photo Booth `readPixels` probe | Unresolved probe | Future capture implementation detail | Keep as partial proof of booth pixel access. |
| Photo Booth tokenBg hard-lock probe | Historical diagnostic reference | Booth/capture diagnostics | Use for backdrop source behavior. |
| Standalone Booth v12/v13 | Historical diagnostic reference | Future minor Booth regression fixes only | Do not treat as open rebuild. |
| Sync Extra Arms | Deprecated | None | Do not use with Witch Dock. |
| Body Editor / Body Editor BETA | Deprecated | Current `tools/Body_Editor.js` | Only compare if debugging regression. |
| JSON Bulk Backup variants | Deprecated | Current `tools/JSON_Tool.js` | Only compare if debugging regression. |
| Bone/kitbashing probes | Needs recovery | TBD | Recover before major bone/kitbashing changes. |