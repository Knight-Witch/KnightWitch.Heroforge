# Booth v27 Stabilization

Date: 2026-09-06
Status: Dev candidate; live validation required
Feature: `booth.persistence`
Target build: `v27` / `27.0.0`
Public Stable: unchanged

## Purpose

Record the diagnosis and reconstruction intent for the Booth v27 stabilization pass after v26 introduced fresh-load regressions. This is a surgical Booth repair, not a decal-gizmo rewrite and not a Stable promotion.

## User-observed v26 regressions

- saved Booth View / Black Canvas switches survived reload but actual visual/runtime application could wait until Photo Booth was opened later;
- several white flashes occurred when the delayed startup path finally woke up;
- visible Booth effects/lighting could reset even though their saved values still existed;
- a projected decal's rotation/scale was observed corrupted after the startup churn;
- Black Canvas showed a thin 1:1 square edge and, in some responsive layouts, a wider right-edge strip.

The projected-decal symptom is treated as a Booth regression until proven otherwise. `HeroForge_UI/Corrected_Bound_Decal_Gizmo.js` remains immutable for this pass.

## Confirmed diagnosis

### 1. Startup was incorrectly gated on `BT.maker`

v26 `resolveRuntime()` returned no current HeroForge runtime until `BT.maker` existed. The main loop and startup-default path both depended on that resolver. In the live session, Booth initialized long before native Photo Booth runtime; the v26 startup/default work only began when the native runtime later appeared.

This explains the mismatch between remembered checkbox state and delayed actual behavior.

### 2. Black Canvas startup replayed whole-character refreshes

v26 `kickStartupBlackCanvas()` ran the working Black Canvas activation/refresh path repeatedly through the delayed startup settle window. `refreshBTComponentRender()` contained an explicit `CK.character.refresh()`.

The live v26 debug log showed six startup kicks. Therefore v26 could invoke the explicit whole-character refresh six times from Black Canvas startup alone.

### 3. Lighting replay supplied the wrong previous-state argument

Current HeroForge `BT.display.lighting.apply(next, previous)` applies lighting and then checks sphere-light differences. Its source includes a fallback to `CK.character.refresh()` when `previous.sphereLights` and `next.sphereLights` do not compare equal.

v26 called:

`lighting.apply(capturedLighting, null)`

A live HF-Chat-Bridge Power probe instead called:

`BT.display.lighting.apply(savedLighting, savedLighting)`

while temporarily tracing `CK.character.refresh()`. Result: zero refresh calls.

This gives v27 a named-runtime, live-proven replay path that preserves the lighting state without forcing a redundant whole-character rebuild merely because the previous value was omitted.

### 4. Saved effects and lighting were not deleted

Live character inspection confirmed the saved portrait config still contained effects and lighting. Enabled effect passes included `Highlights`, `Vignette`, `ColorLevels`, and `BloomFilter`. The regression was renderer/application churn rather than loss of saved character data.

### 5. `cameraSave` is not a sufficient saved-Booth requirement

The live saved portrait config currently exposes:

- `camera`
- `effects`
- `filters`
- `lighting`
- `selected`
- `useEnvAsBg`

`cameraSave` was undefined. Saved Booth eligibility therefore cannot depend on `cameraSave` alone, and it does not require an already-live maker object merely to inspect character-owned Booth config.

### 6. Thin square Black Canvas edge remains in the mask/shader path

Live state while the artifact was visible showed:

- Booth background plane visible;
- frame plane hidden;
- shadow plane hidden;
- environment hidden;
- renderer/holder background black;
- renderer size and Booth `screenSize` aligned;
- background shader inputs include 1024x1024 `texMaskBg` and `texMaskFrame` textures.

The exposed shader source on the inspectable material is only a placeholder, not the compiled HeroForge shader. Therefore v27 does not guess at or patch the mask shader. The thin 1:1 edge stays explicitly unresolved.

The wider responsive right-edge strip is treated separately as a layout synchronization issue. v27 broadens layout invalidation so HeroForge's existing overlay resize/refresh/visibility sequence runs when canvas/holder geometry or viewport state changes even if backing dimensions remain unchanged.

## v27 implementation intent

### Runtime availability

- return a BT facade once `BT` exists rather than waiting for `BT.maker`;
- use `BT.liveEngine || BT.maker` as the named engine when available;
- allow character-owned saved-config detection and Black Canvas display enforcement before that engine exists;
- when Booth View is intended and the engine later becomes available, enable the engine through its existing named `enable()` path.

### Saved-character state

- scan current character-owned portrait/token mode configuration for meaningful Booth fields;
- seed figure-scoped captured effects, lighting, and token-background state from that saved config;
- preserve the established real-Booth-visit fallback for figures without preexisting saved setup.

### Figure switching

Use the current `CK.data` object generation plus `CK.character.uuid` as figure-generation signals. On change:

- clear figure-scoped captured backdrop/effect/lighting/token-background references;
- reset automatic-detection state;
- preserve saved Utilities defaults and explicit current session switches;
- give HeroForge a short settle window before a default-owned Booth session decides that the new figure lacks saved Booth config.

This avoids replaying figure A's captured renderer state onto figure B.

### Refresh discipline

- remove Witch Dock's explicit `CK.character.refresh()` from `refreshBTComponentRender()`;
- replay captured lighting with identical `next` / `previous` values;
- Black Canvas startup retries reassert Black Canvas/display state only;
- preserve current tokenizer disable/re-enable and silent-cycle timing unless live v27 testing isolates a separate failure.

### Responsive Black Canvas

The layout signature now covers:

- backing width/height;
- client width/height;
- canvas bounding rectangle;
- holder bounding rectangle;
- viewport width/height;
- device pixel ratio.

Geometry is quarter-pixel quantized to avoid meaningless subpixel noise. A changed signature invokes HeroForge's native overlay `resize()`, `refresh()`, and `applyVisibility()` sequence before reasserting Black Canvas visibility.

## Preserved boundaries

Unchanged by v27:

- public `Witch_Scripts`;
- `HeroForge_UI/Corrected_Bound_Decal_Gizmo.js`;
- Utilities behavior and storage keys;
- Spinny Mini WebP;
- High Res Image Capture;
- JSON;
- Dev tab infrastructure;
- Black Canvas mask/shader implementation.

## Validation gate

Before Stable consideration, live `WITCH_DEV_UI` must verify:

1. saved Booth figure fresh reload;
2. Black Canvas applies without requiring manual Photo Booth entry where current runtime capabilities permit it;
3. v26 white-flash storm is gone;
4. saved effects and lighting remain visibly applied;
5. the existing projected decal keeps its rotation/scale through reload/startup;
6. same-page saved-figure switching does not cross-contaminate captured state;
7. `+ New Figure` / no-saved-Booth figure is not incorrectly given default-owned Booth View;
8. manual Booth View / Black Canvas session overrides still work and do not rewrite Utilities defaults;
9. component toggles still update correctly;
10. responsive wide right-edge Black Canvas strip is gone or narrowed to the separately unresolved thin mask edge.

The thin 1:1 mask edge is not a v27 acceptance blocker unless behavior worsens; it remains a separate investigation requiring a proven mask/shader seam.
