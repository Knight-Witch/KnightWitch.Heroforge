# Timing and State

HeroForge timing/state discoveries that must be preserved across tools.

## Known Rules

- HeroForge state may update after `pointerup`, not immediately on `click`.
- Delayed snapshots and retry loops may be required to capture correct runtime state.
- Do not simplify timing behavior without testing against a working reference.
- If a tool uses staged timeouts, requestAnimationFrame loops, polling, or retry registration, assume that timing exists for a reason until proven otherwise.

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

Working approach:
- Preserve the staged retarget timing unless a tested replacement covers HeroForge tab/menu mutation timing.

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
