# Booth, Renders, and Exports

HeroForge photo booth, render, screenshot, export, and media workflow discoveries.

## Known Rules

- Preserve tested timing and UI state assumptions for booth workflows.
- Document any HeroForge export/render behaviors that require retries, delays, or specific UI state.
- Booth runtime behavior is high-risk; avoid simplifying tokenizer, teardown, frame, shader, or backdrop handling without a working reference.
- Photo Booth effects/overlays are part of the target output. Capture work must preserve HeroForge's booth render path when that is the point of the export.
- Browser/Tampermonkey capture is limited to final canvas-style output; do not assume access to hidden HDR/16-bit render buffers.

## Findings

### Booth Tool Uses Build Tag `v16`

Context:
- `tools/Booth.js` defines the current live Booth build tag.

Observed behavior:
- `BUILD_TAG` is `v16`.
- Debug helpers exposed: `window.KW_WD_BOOTH_DEBUG_DUMP` and `window.KW_WD_BOOTH_BUILD`.

Working approach:
- Preserve build/debug visibility when troubleshooting Booth regressions.
- Use debug dump/build tag before guessing about runtime state.

Affected tools:
- `tools/Booth.js`

### Booth Persistence Uses Consent and Runtime State Loop

Context:
- Current visible Booth section is `Persistent Booth`.

Observed behavior:
- Storage keys: `kw.witchDock.booth.consent.v1` and `kw.witchDock.booth.directionsHidden.v1`.
- State tracks consent, booth toggle, black canvas toggle, booth entry/exit, tokenizer mode, pending teardown, captured/original backdrop material/uniforms, frame hiding, shader frame hiding, and silent cycle state.
- Runtime loop continues through `requestAnimationFrame` when consent/background behavior requires it.

Working approach:
- Preserve consent gating and state flags.
- Do not remove the loop or teardown/rearm behavior without a live-tested replacement.

Affected tools:
- `tools/Booth.js`

### Booth Detects Mode Through Tokenizer and UI

Context:
- Booth persistence needs to know whether HeroForge is currently in photo booth mode.

Observed behavior:
- It checks tokenizer/current mode strings for booth state and falls back to UI detection.
- It tracks previous booth state to detect booth exits and schedule silent backdrop cycling.

Working approach:
- Preserve both tokenizer and UI detection paths.
- Do not replace this with only one mode check until proven stable.

Affected tools:
- `tools/Booth.js`

### Standalone Booth v12/v13 Persistence History

Context:
- Prior standalone Booth work found behavior that should not be rediscovered from scratch.

Observed behavior:
- Standalone booth v12 was the last version where overlays/effects/view/lighting persisted together.
- v13 and the official integrated Booth.js behavior were similar: backdrop persisted, but effects failed, and overlays only stuck after a manual Booth off -> on cycle.
- The suspected fix direction was not to hard-block all teardown. Backdrop still needed v13's one-shot allowance of `tokenizer.disable()` so it could commit.
- Effects should be restored after the tokenizer transition rather than by blocking teardown entirely.

Working approach:
- Treat v12 as important historical reference for overlays/effects/view/lighting persistence.
- Treat v13 as important reference for backdrop commit behavior.
- Do not "fix" effects by removing the one-shot tokenizer-disable allowance unless a tested replacement still preserves backdrop commit.
- Preserve manual off -> on behavior as a useful clue when debugging overlay persistence.

Affected tools:
- `tools/Booth.js`
- Future Booth persistence revisions

### Photo Booth Backdrop Is Not Plain CSS

Context:
- Earlier backdrop locking/probing investigated how HeroForge loads Photo Booth backgrounds.

Observed behavior:
- Photo Booth backdrop changes produced log spam such as `1772 configs loaded`, repeated `having trouble packing, used 16/20 iterations`, and `loading decal expansion`.
- The useful signal was not CSS.
- The relevant asset signal was `img.src` pointing to `/static/herobundles/decals/tokenBg/..._color_1024.png`.
- A hard-lock probe successfully captured a `/tokenBg/paintedBgMoodyPortrait/..._color_1024.png` URL and blocked other `/tokenBg/..._color_1024.png` loads.
- The lock worked inside Photo Booth but not outside it.

Working approach:
- For backdrop persistence, inspect image/src/tokenBg loading behavior, not just DOM styles.
- Treat tokenBg URLs as a useful capture/lock signal.
- Do not assume backdrop behavior works outside Booth just because it works inside Booth.

Affected tools:
- `tools/Booth.js`
- Future Photo Mode / PNG Series capture tool

### Photo Mode PNG Series Capture Goal

Context:
- A future tool is intended to capture a PNG series from HeroForge Photo Mode/photo booth.
- This has not been solved yet.

Observed behavior:
- HeroForge added an official high-quality spinny mini image-sequence exporter.
- The official exporter produced a ZIP folder with roughly 72 frames.
- The observed output was 512x512 PNGs.
- Desired behavior is to mimic that exact workflow at much higher resolution.
- The output must preserve HeroForge Photo Booth effects/overlays/background behavior when those are the reason for using Photo Mode.

Working approach:
- Treat this as an unfinished investigation, not a completed feature.
- Prefer using or mimicking HeroForge's official capture/export flow rather than building an unrelated screenshot path that loses booth effects.
- Keep frame count user-controlled rather than assuming HeroForge's internal frame count is the desired count.
- Preserve notes about failed/partial approaches before writing new capture code.

Affected tools:
- Future Photo Mode / PNG Series capture tool
- `tools/Booth.js` if integrated there later

### Canvas / Capture Surface Findings

Context:
- Earlier probing inspected the visible HeroForge render surface.

Observed behavior:
- The observed render surface was a single canvas under `#character-canvas`, with an example canvas size around `1060x858`.
- The 1:1 booth frame was baked into the WebGL scene, not a simple DOM/CSS container that could be resized away.
- Changing the WebGL canvas/camera aspect may affect capture dimensions, but the visible HeroForge chrome/frame can still remain visually square if the booth frame is rendered inside the scene.

Working approach:
- Do not treat the booth frame as normal CSS.
- Do not assume changing a DOM wrapper fixes booth crop/aspect.
- Verify actual exported pixels, not just DOM dimensions.

Affected tools:
- Future Photo Mode / PNG Series capture tool
- Booth capture probes

### Browser Capture Cannot Force True HDR/16-Bit Export

Context:
- User wanted high-quality image capture and asked about preserving Photo Booth effects.

Observed behavior:
- Browser/Tampermonkey-level capture such as canvas `toDataURL`, `toBlob`, `getImageData`, or final WebGL framebuffer readback is effectively final 8-bit-style output.
- Hidden float/HDR render buffers are not realistically accessible through a normal userscript path.

Working approach:
- Use maximum practical resolution and clean capture timing.
- Do not promise true HDR/16-bit export from Tampermonkey.
- If banding becomes an issue, handle it as a post/capture-quality workflow problem, not as a guaranteed hidden-buffer extraction feature.

Affected tools:
- Future Photo Mode / PNG Series capture tool

### Prior PNG Series Probe v0.7

Context:
- Earlier PNG-series probe work attempted to capture frames into a ZIP.

Observed behavior:
- v0.7 no longer depended on `CK.CanvasElement`.
- It zipped PNG frames into one download.
- It armed capture with `Alt+Shift+G`, then expected the user to click HeroForge Capture.
- Crop mode cycled with `Alt+Shift+C`: `center` -> `bottom` -> `top`.
- Default output name was `frames_2k_png.zip`.

Working approach:
- Preserve the idea of explicit arming before invoking HF capture.
- Preserve user-selectable crop mode if reviving this probe.
- Do not reintroduce hard dependency on `CK.CanvasElement` without proving it is stable.

Affected tools:
- Future Photo Mode / PNG Series capture tool

### PNG Series Needs rAF-Gated Frame Acceptance

Context:
- Earlier analysis identified duplicate/early-frame issues.

Observed behavior:
- 512x512 output can be "too early" rather than inherently wrong.
- Accepting multiple samples per render update can produce duplicate frames.
- Internal `_targetFrames` should not define the desired user frame count by itself.

Working approach:
- Gate accepted frames on `requestAnimationFrame`.
- Accept only one frame per rAF tick.
- Use temporal + structural gating around pixel read/capture.
- Add soft timeout handling.
- Validate dimensions/content before writing the PNG to the ZIP.

Affected tools:
- Future Photo Mode / PNG Series capture tool

### WebGL `readPixels` Probe Was Partial Success

Context:
- A prior HeroForge probe used WebGL readback.

Observed behavior:
- It captured real booth pixels.
- Frames were upside-down.
- Grey margins appeared.
- The visible UI fantasy background appeared behind the booth.

Working approach:
- Keep this as a valid partial proof of access to booth pixels.
- Add vertical flip, crop/mask, and background cleanup if continuing with this route.
- Do not mistake raw framebuffer capture for final clean export.

Affected tools:
- Future Photo Mode / PNG Series capture tool

## Current Unresolved Capture Problem

Goal:
- Capture a high-resolution PNG sequence from HeroForge Photo Mode/photo booth, preferably mimicking the official image-sequence exporter, while preserving Photo Booth effects/overlays.

Known partial paths:
- Official HF exporter exists but produced 512x512 observed output.
- v0.7 probe could arm/capture/ZIP frames but was not final.
- WebGL `readPixels` proved real booth pixels can be captured, but output needed flip/crop/background cleanup.
- Canvas capture can read final pixels but cannot provide true hidden HDR/16-bit data.

Current likely next investigation:
- Locate and instrument the official image-sequence exporter path.
- Identify where frame count, output size, and capture timing are set.
- Use rAF-gated, one-frame-per-render acceptance.
- Preserve Photo Booth effects by triggering/capturing through HeroForge's own booth/capture path where possible.

Do not repeat:
- Do not assume 512x512 is the hard limit without checking capture timing/export settings.
- Do not chase DOM/CSS resizing as the only fix; the booth frame can be WebGL-baked.
- Do not discard readPixels solely because raw output was flipped/margined; those are post-processing problems.

## Entry Template

### Finding Title

Context:
- 

Observed behavior:
- 

Working approach:
- 

Affected tools:
- 
