# Photo Mode PNG Capture

Feature spec and investigation notes for the planned Photo Mode / PNG Series Capture tool.

This is separate from Persistent Booth. Persistent Booth is live/working. This file is for the unfinished capture/export tool that should preserve HeroForge Photo Booth output while producing a higher-resolution PNG sequence.

## Status

- Status: investigating / unresolved.
- Not currently live in `manifest.json`.
- Do not implement from scratch without reading this file, `BOOTH_RENDERS_EXPORTS.md`, and `TIMING_AND_STATE.md`.
- Persistent Booth is not on this todo list.

## Core Goal

Build a Witch Dock tool that can capture a PNG image sequence from HeroForge Photo Mode / Photo Booth, preferably by mimicking or instrumenting HeroForge's official spinny image-sequence exporter, but with user-controlled output settings.

The intended output is not merely a generic screenshot. The capture should preserve the rendered Photo Booth result: figure, pose, lighting, booth effects, overlays, background/backdrop, and any relevant Photo Booth composition behavior.

## Intended User-Facing Features

### Output Resolution

Required options:
- `1024x1024`
- `2048x2048`
- `3840x3840` / `4K square` if practical

Implementation priority:
1. Start with `1024x1024` for stability, speed, and manageable ZIP/download size.
2. Add `2048x2048` once the capture path is stable.
3. Add `4K` only after memory, browser-download, and frame timing behavior are proven reliable.

Notes:
- Do not assume the observed 512x512 official output is a hard HeroForge limit.
- 512x512 may have been an early-capture or export-setting symptom.
- Validate actual pixel dimensions of every captured frame before saving.

### Frame Count / Smoothness

Desired behavior:
- User controls frame count.
- Tool should support smoother-than-default sequences where practical.
- Do not blindly inherit HeroForge's internal `_targetFrames` or any official-export default.

Known reference:
- Official HF spinny image-sequence export was observed producing roughly 72 PNG frames.

Likely options:
- 36 frames: quick turntable / low download size.
- 72 frames: baseline matching observed official exporter.
- 120 frames: smoother sequence if capture timing and ZIP size remain practical.
- Custom frame count later if UI remains clean.

### Output Package

Required:
- ZIP download containing ordered PNG frames.
- Stable filename pattern with zero-padded frame numbers.
- Include metadata JSON in the ZIP if practical.

Preferred ZIP structure:

```text
photo_mode_png_capture_YYYY-MM-DD_HH-mm-ss/
  frames/
    frame_0001.png
    frame_0002.png
    ...
  meta/
    capture_settings.json
    failures.json
```

Metadata should record:
- requested resolution
- actual captured frame dimensions
- requested frame count
- actual saved frame count
- capture mode/path used
- timestamp
- any failures, dropped frames, duplicate-frame warnings, or timeout events

### Download Behavior

Preferred:
- Use Tampermonkey/GM download APIs where available if they improve reliability.
- Fall back to browser object URL download if GM download is unavailable or fails.
- Avoid one-download-per-frame unless specifically debugging; normal output should be one ZIP.

Future optional idea:
- A companion `.exe` / local helper could eventually handle large output, file naming, direct folder writes, or batch post-processing.
- This is not required for the userscript implementation and should not block the first working version.

### Workflow / UI Model

Desired UI should be simple and explicit.

Likely flow:
1. Open Witch Dock capture tool.
2. Select resolution.
3. Select frame count.
4. Select aspect/crop mode.
5. Arm capture.
6. User triggers HeroForge's capture/export path, or the tool triggers the safest known internal path if discovered.
7. Tool captures validated frames.
8. Tool builds one ZIP.
9. Tool reports success/failures with actual frame count and output dimensions.

Important:
- Preserve an explicit arming step. Prior v0.7 probe used `Alt+Shift+G` to arm before the user clicked HeroForge Capture.
- Avoid hidden auto-capture that starts unexpectedly while the user is editing.
- The UI should show capture status, frame count progress, and warnings if dimensions are wrong or repeated frames are detected.

### Aspect / Crop Modes

Known prior probe behavior:
- v0.7 supported crop cycling with `Alt+Shift+C`: `center` -> `bottom` -> `top`.

Desired options:
- Square / Photo Booth native composition.
- Center crop.
- Top crop.
- Bottom crop.
- Possible future 16:9 cinematic mode.

16:9 note:
- The 16:9 cinematic idea is desirable for future media workflows, but should not be the first blocking requirement.
- The first successful implementation should prioritize preserving HeroForge's Photo Booth output reliably.
- Do not assume a DOM/CSS resize can produce correct 16:9 output because the booth frame can be WebGL-baked.

### Effects / Overlay Preservation

Required:
- Preserve Photo Booth effects, overlays, lighting, and backdrop when they are part of the intended shot.
- Capture must use or mimic HeroForge's Photo Booth render path where possible.

Do not do:
- Do not build a generic canvas screenshot path that loses Photo Booth effects and call it done.
- Do not treat Persistent Booth as an unfinished dependency; it is live/working.
- Do not rewrite Persistent Booth just to build this capture tool unless a concrete integration issue is proven.

### Overlay / Layer Management Ideas

Potential future features:
- Layer visibility toggles for capture-only output.
- Named overlay states/presets.
- Capture with overlays on/off.
- Capture with background/backdrop on/off.
- Capture with UI-clean output only.

Current status:
- These are feature ideas, not first-pass requirements.
- First pass should preserve the output HeroForge is already rendering, not invent a full overlay compositor.

## Known Probe / Investigation History

### Official Exporter Observation

Observed:
- HeroForge added an official high-quality spinny mini image-sequence exporter.
- It produced a ZIP folder with roughly 72 PNG frames.
- Observed frames were `512x512`.

Interpretation:
- This is the preferred path to investigate because it likely captures the correct Photo Booth output/effects.
- 512x512 should not be assumed to be a hard limit without finding where resolution is set.

### v0.7 Probe

Observed:
- No longer depended on `CK.CanvasElement`.
- Zipped PNG frames into one download.
- Armed capture with `Alt+Shift+G`.
- Expected the user to click HeroForge Capture.
- Crop mode cycled with `Alt+Shift+C`: `center` -> `bottom` -> `top`.
- Default ZIP name was `frames_2k_png.zip`.

Carry forward:
- Explicit arming step.
- ZIP output.
- User-selectable crop mode.
- Avoid hard dependency on `CK.CanvasElement` unless proven stable.

### Canvas / WebGL Surface Findings

Observed:
- One visible render surface under `#character-canvas`.
- Example canvas dimensions around `1060x858`.
- The 1:1 Booth frame can be baked into the WebGL scene, not a plain DOM/CSS wrapper.

Carry forward:
- Verify exported pixels directly.
- Do not treat DOM size as proof of capture output size.
- Do not chase CSS-only frame/crop fixes as the primary route.

### WebGL `readPixels` Partial Success

Observed:
- Captured real Booth pixels.
- Output was upside down.
- Grey margins appeared.
- Visible HeroForge fantasy/UI background leaked behind the booth area.

Carry forward:
- `readPixels` is a valid partial proof, not a finished export path.
- If using it, add vertical flip, crop/mask, and background cleanup.
- Do not discard it only because raw output was flipped/margined.

### Browser Capture Limits

Observed:
- Canvas `toDataURL`, `toBlob`, `getImageData`, and WebGL framebuffer readback are final browser-readable pixel paths.
- True hidden HDR/16-bit render buffers are not realistically accessible from normal Tampermonkey/userscript code.

Carry forward:
- Promise practical high-resolution PNG output, not true HDR/16-bit extraction.
- Handle banding as a post/capture-quality issue if needed.

## Implementation Constraints

### Timing / Frame Acceptance

Required:
- Use render-state gating.
- Accept at most one frame per `requestAnimationFrame` tick.
- Validate actual frame dimensions before saving.
- Detect duplicate frames where possible.
- Add soft timeout handling.
- Report dropped/failed frames instead of silently producing a bad ZIP.

Do not:
- Do not accept multiple captures from one render update.
- Do not assume button click timing equals finished render timing.
- Do not treat `_targetFrames` as the desired user frame count.

### Memory / Browser Limits

Risk areas:
- 2048 and 4K PNG sequences can create very large ZIPs.
- Building the full ZIP in memory may become unstable at high frame count/resolution.
- Browser download behavior may fail or hang for very large blobs.

Approach:
- Start at 1024.
- Add progress/status and fail cleanly.
- Keep 2048/4K behind explicit user selection.
- Consider companion helper only after the userscript capture path proves useful.

### Output Quality

Priorities:
1. Correct Photo Booth output/effects.
2. Correct frame count/order.
3. Correct resolution.
4. No duplicated/early frames.
5. Clean crop/mask/background.
6. Higher frame counts / smoother output.
7. Higher resolutions.

## Open Questions

- Where does HeroForge's official image-sequence exporter set output resolution?
- Can the official exporter be safely instrumented to change resolution/frame count?
- Does the official exporter capture from Photo Booth's final render path or from a separate internal render path?
- Can frame capture be gated from a reliable internal completion event rather than rAF timing alone?
- At what resolution/frame-count does in-browser ZIP generation become unreliable?
- Is GM_download more reliable than object URL download for large ZIP blobs in this environment?
- Will 16:9 require camera/render-path changes, or only post-crop from a square capture?

## First Implementation Target

A conservative first working target should be:
- 1024x1024 output.
- 72 PNG frames by default.
- ZIP output.
- Explicit arm/start behavior.
- Preserve Photo Booth effects/overlays/background.
- Validate dimensions before saving frames.
- Use one-frame-per-rAF acceptance or a better confirmed render-complete signal.
- Include metadata JSON and failure records.

Do not include in first pass unless it is easy and safe:
- 4K output.
- 16:9 cinematic output.
- Overlay compositor/preset system.
- Companion `.exe`.
- Direct filesystem folder writing.

## Integration Options

Likely locations:
- Dedicated visible tool in `/tools/` if it becomes a full capture/export workflow.
- Booth-adjacent module only if it must share Booth internals.

Preferred first integration:
- Dedicated visible Witch Dock tool or clearly separated Booth subsection.
- Do not bury capture behavior inside Persistent Booth's working persistence logic.

Manifest rule:
- Add to `manifest.json` only once there is a real module to live-load.
