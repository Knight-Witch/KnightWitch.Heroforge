# Booth, Renders, and Exports

HeroForge photo booth, render, screenshot, export, and media workflow discoveries.

## Known Rules

- Preserve tested timing and UI state assumptions for booth workflows.
- Document any HeroForge export/render behaviors that require retries, delays, or specific UI state.
- Booth runtime behavior is high-risk; avoid simplifying tokenizer, teardown, frame, shader, or backdrop handling without a working reference.

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
