# Timing and State

HeroForge timing/state discoveries that must be preserved across tools.

## Known Rules

- HeroForge state may update after `pointerup`, not immediately on `click`.
- Delayed snapshots and retry loops may be required to capture correct runtime state.
- Do not simplify timing behavior without testing against a working reference.
- If a tool uses staged timeouts, requestAnimationFrame loops, polling, or retry registration, assume that timing exists for a reason until proven otherwise.
- Image/PNG capture work must be gated by actual rendered frame state, not just by a click event or expected frame count.
- PNG-series capture should accept at most one frame per confirmed render update unless a better internal completion signal is discovered.

## Findings

### Witch Dock Bone Detection Uses Delayed Snapshot Diffing

Context:
- `Witch_Dock.user.js` contains footer bone detection.

Observed behavior:
- Detection builds candidate scene graph paths, captures a baseline snapshot, then compares delayed snapshots after user interaction.
- It listens on both `pointerup` and `click`, then waits `STATE.delayMs` before diffing.
- It retries startup until summon-circle data is available.

Working approach:
- Preserve baseline initialization, delayed diffing, retry startup, pointer/click listeners, and candidate path rebuilding.
- Do not convert the detector into a direct click-only lookup.

Affected tools:
- `Witch_Dock.user.js`

### Decals Scroll Guards Retarget on Multiple Timings

Context:
- `HeroForge_UI/Expanded_UI_Scroll_Guards.js` must detect reused HeroForge Decals UI containers.

Observed behavior:
- Retargeting runs immediately, after 150 ms, after 500 ms, after click, after pointerup, and on a 1500 ms interval.
- This was needed because HeroForge menu DOM/layout state can mutate after visible interaction.
- A single first-pass target can be wrong or incomplete if the Decals tab/menu has not finished reshaping.

Working approach:
- Preserve the staged retarget timing unless a tested replacement covers HeroForge tab/menu mutation timing.
- Preserve `click` and `pointerup` retarget triggers.
- Preserve interval retargeting as a safety net against late HeroForge DOM/layout changes.

Affected tools:
- `HeroForge_UI/Expanded_UI_Scroll_Guards.js`
- `tools/Utilities.js`

### Booth Runtime Loop Maintains Persistence State

Context:
- `tools/Booth.js` uses a runtime loop to maintain booth/background persistence.

Observed behavior:
- The tool tracks tokenizer mode, booth entry/exit, pending teardown, backdrop state, frame hiding, shader frame hiding, and black canvas enforcement.
- It uses `requestAnimationFrame` for the active loop and preserves several rearm/teardown flags.

Working approach:
- Do not simplify the Booth loop, tokenizer checks, teardown scheduling, or backdrop enforcement without a working reference and live test.

Affected tools:
- `tools/Booth.js`

### PNG Series Capture Needs Render-State Gating

Context:
- Prior PNG-series capture probing attempted to capture a sequence from HeroForge Photo Booth/photo mode.
- The goal was to mimic HeroForge's official spinny image-sequence exporter at higher resolution.
- Dedicated feature spec: `HISTORY/BULLSHIT/PHOTO_MODE_PNG_CAPTURE.md`.

Observed behavior:
- A 512x512 capture can mean the script captured too early, not that 512x512 is the only possible output.
- Repeated frames can happen if capture accepts multiple samples from the same render frame.
- HeroForge's own internal frame target should not be treated as the user's desired output frame count.
- `_targetFrames` should be user-defined for the script rather than blindly trusting an internal HeroForge constant.
- High-resolution PNG sequence generation can stress browser memory, ZIP generation, and download behavior.

Working approach:
- Use temporal and structural gating around `getImageData` / canvas capture acceptance.
- Accept at most one frame per `requestAnimationFrame` tick unless a better confirmed render-complete signal is discovered.
- Use a soft timeout so the sequence can fail cleanly instead of hanging forever.
- Validate actual rendered dimensions/content before accepting a frame.
- Treat 512x512 as an early-capture/export-setting symptom until proven otherwise.
- Start with 1024x1024 and around 72 frames before scaling to 2048, 4K, or smoother frame counts.
- Save metadata/failure records so timing failures are visible after ZIP generation.

Affected tools:
- Future Photo Mode / PNG Series capture tool
- Booth capture probes

### WebGL `readPixels` Probe Captured Real Booth Pixels But Needed Post-Processing

Context:
- A HeroForge probe previously captured real booth pixels through WebGL `readPixels`.

Observed behavior:
- The output contained real booth pixels.
- Frames were upside down.
- Grey margins were present.
- The visible HeroForge fantasy/UI background leaked behind the booth area.

Working approach:
- If using `readPixels`, flip the image vertically before saving.
- Add crop/mask/background handling instead of assuming the raw framebuffer is already the final desired PNG.
- Do not discard the approach entirely: it proved real booth pixels were reachable, but not yet in final export form.

Affected tools:
- Future Photo Mode / PNG Series capture tool
- Booth capture probes

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
