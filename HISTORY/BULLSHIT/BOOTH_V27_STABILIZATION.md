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

## 2026-09-07 integrated lifecycle follow-up — v27.0.1

The first combined Dev startup smoke proved the new runtime bootstrap works: a previously saved Booth figure restored Booth View and Black Canvas automatically on refresh, and the white-flash fix remained effective. The same smoke exposed a downstream v27 detector mismatch on `+ New Figure`.

`readSavedBoothConfig()` still counted plain `cfg.camera` as a saved-Booth signal. That contradicts the bootstrap's established strong-signal rule and the v27 acceptance requirement that a fresh/no-saved-Booth figure not receive default-owned Booth View. Because BT was already loaded from the previous saved figure, the new figure's ordinary camera data was enough for v27 to keep Booth alive.

v27.0.1 removes bare `camera` from the qualifying signal set while preserving `cameraSave`, lighting, effects, token-background/frame filters, and selected token background/frame signals. The existing 1.8 s figure-settle window and missing-config tick threshold are unchanged.

The same live smoke reproduced the historical blank-white editor restoration class. v27.0.1 reuses the already-existing `restoreBTCanvasVisualState()` semantic restoration path after a real/manual/default Booth shutdown when Black Canvas is already OFF. Internal silent-cycle teardown is explicitly excluded so its validated timing/rearm behavior is unchanged.

## 2026-09-07 presentation follow-up — v27.0.2

After v27.0.1 passed the integrated startup/lifecycle smoke, two presentation artifacts remained with Witch Dock Booth View active outside native Photo Booth and Black Canvas OFF.

### Gray 1:1 frame

Live bridge issue #721 confirmed `BT.display.framePlane` is absent while `BT.display.overlays.framePlane.visible` is true. The existing `getShaderFramePlane()` looked only at `TN.shader.framePlane`; for the BT facade `TN.shader === BT.display`, so the helper could never acquire the actual current overlay frame. Black Canvas hid the correct `overlays.framePlane`, explaining why the artifact existed only when Black Canvas was OFF.

v27.0.2 preserves the existing frame snapshot/hide/restore lifecycle and adds only the current-shape fallback `TN.shader.overlays.framePlane`.

### Checkerboard when Booth Background is OFF

On the live Witch of the Wilds saved Booth state, bridge issues #722-#723 confirmed:

- Booth background plane: false, as requested by the Background toggle;
- regular `CK.environment.background.visible`: false;
- regular ground group: false;
- `CK.character.settings.hideGround`: true;
- summon circle: false.

Thus the checkerboard was not the Booth background plane failing to hide; it was the ordinary editor environment remaining in Booth-hidden state underneath the transparent square.

The named native method `BT.display.environment.setDefaultEnvironmentVisibility(e)` directly owns this state. A reversible live probe (#724) called it with `true`, observed background/ground/summon-circle visibility restore and `hideGround` clear while the Booth background plane stayed false, then called it with `false` and verified the original hidden state returned.

v27.0.2 conditionally calls that named setter only when all of the following are true:

- Witch Dock Booth View is active;
- the page is outside native Photo Booth;
- Black Canvas is OFF;
- the regular HeroForge background currently reports `visible === false`.

Once the editor environment is visible the helper is a no-op, so the RAF polling loop does not continuously invoke the setter. Native Photo Booth and Black Canvas ON remain excluded.

The Black Canvas replay module is not changed by this presentation follow-up.

## 2026-09-07 component-aware Black Canvas follow-up — v27.0.3

v27.0.2 closed the ordinary editor-background restoration defect but exposed the distinction between Black Canvas and the Booth Background component. With Black Canvas ON and Background OFF, `backgroundPlane.visible` was correctly false while Black Canvas still hid the regular environment, so checkerboard was inevitable inside the transparent token crop.

The current native frame shader was inspected from `/gated/booth.js?version=heroforge07.1.9.98`. Its gray surround is hard-coded as `vec4(0.5,0.5,0.5,0.7)` whenever frame UV lies outside `[0,1]`; there is no named runtime matte-color uniform. The frame geometry itself spans UV `-3.5..4.5`, confirming the crop purpose, but two bounded custom RawShaderMaterial probes — one on a cloned frame mesh and one on a fresh mesh sharing only geometry/transform — both returned WebGL error 1282. That custom-renderer route is rejected.

HeroForge's named `BT.maker.getTokenViewOffset()` provides a cleaner independent-UI seam. Its source derives `{fullWidth, fullHeight, offsetX, offsetY, width, height}` from current render-manager dimensions, token relative size/aspect, and camera zoom. Live reads confirmed the canvas CSS/render dimensions align and `#character-canvas` is an untransformed absolutely positioned host.

v27.0.3 therefore owns a four-bar DOM matte. It maps the native token rectangle into current canvas CSS dimensions, keys geometry at quarter-pixel precision, and rewrites bar rectangles only when that key changes. The matte is pointer-inert, renderer-scoped, hidden when unused, and removed on Black Canvas restoration or figure-generation reset.

Component-aware Black Canvas behavior is now:

- Booth OFF + Black Canvas ON: preserve prior full-black editor behavior;
- Booth ON + Background ON + Black Canvas ON: preserve Booth background inside and black outside;
- Booth ON + Background OFF + Black Canvas ON outside native Photo Booth: if the native token rectangle/matte capability is available, restore the regular fantasy environment and cover only outside the crop with black; if capability is unavailable, fall back to prior full-black behavior;
- native Photo Booth: no editor DOM matte.

A narrow `reassertBlackCanvasPresentation()` Booth API lets the separate display replay synchronously request this exact policy after native `CK.character.display.update()` without duplicating component decisions.
