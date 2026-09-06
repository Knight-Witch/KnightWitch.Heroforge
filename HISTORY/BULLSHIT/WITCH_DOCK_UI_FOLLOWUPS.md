# Witch Dock UI / Spinny Integration Follow-Ups

Status: **active handoff queue**  
Branch: `WITCH_DEV_UI`  
Recorded: 2026-09-06

## Purpose

Preserve the Witch Dock side-project work discussed while the standalone 3072px Spinny/WebP validation capture was running, so those items do not get lost when development returns to the Spinny result.

This file is a planning/tracking note only. It does not authorize promotion to public Stable and does not change runtime behavior.

## Confirmed completed during the side discussion

- Compact `High Res Image Capture` standalone Dev UI visually loaded and looked correct in current public Witch Dock.
- Normal High Res presentation is intentionally compact: `Capture: [4K] [8K]`, hover feedback, compact status, no ordinary-user provider kill switch or implementation blurb.
- Developer Mode standalone module visually loaded and worked through the Witch Dock About UI.
- Developer Mode v0.2 canonical per-tool versions and the About `Module Versions` inventory were visible and looked correct.
- Canonical module-version registry and future version-bump policy are recorded in `manifest.json.moduleRegistry` and `MODULE_VERSIONING.md`.
- Dev manifest candidate places `Decals` after Booth-related entries and before `JSON`.
- The standalone 3072px Spinny capture has finished. Its result has **not yet been recorded here**; result intake/diagnostic review is the next Spinny task.

The visual UI confirmations above do not, by themselves, claim that direct 4K/8K capture regression, provider disable/re-enable recovery, or integrated Dev-manifest loading has passed.

## Pending — Witch Dock integration / promotion

### 1. Integrated Developer Mode + compact High Res smoke

The standalone overlays looked correct, but final integration still needs a real `WITCH_DEV_UI` load/smoke before promotion.

Verify:

- Developer Mode default-off behavior;
- About toggle persistence across reload;
- canonical module versions and runtime builds after normal manifest loading;
- High Res normal presentation with Developer Mode off;
- Developer-only provider kill switch with Developer Mode on;
- provider disable -> enable recovery;
- direct 4K and 8K captures through the compact UI;
- failure isolation if Developer Mode itself is unavailable.

### 2. High Res service/UI ownership cleanup

The current Dev presentation adapter re-registers the same `photo-booth-true-resolution` tool ID over the Stable capture service's legacy presentation. This was accepted as a low-risk Dev migration technique, not final architecture.

Before public promotion:

- make the capture service explicitly service-owned rather than retaining detached legacy UI nodes;
- give the presentation adapter clear UI ownership;
- preserve the validated 4K/8K provider/capture math byte-for-byte unless a separately justified change is required;
- keep the readiness adapter/capability gates intact.

### 3. Decals tab order

The Dev manifest already targets:

`... Booth -> Decals -> JSON -> Utilities`

Still pending: integrated Dev-manifest smoke confirming the actual tab order and that existing tab/tool behavior is unchanged.

## Pending — Spinny/WebP Witch Dock UX

### 4. Booth placement

Once the standalone Spinny gate is closed, integrate the Spinny capture toolset into Witch Dock Dev **directly below High Res Image Capture** by default.

Users may continue to use whatever Witch Dock rearrangement behavior is supported; this is only the default placement.

### 5. Popout mode

Desired UX:

- a Popout control opens the same Spinny panel as a floating movable panel;
- floating panel is draggable;
- small close `X` collapses the popout rather than destroying Spinny availability;
- Spinny always remains accessible from the Booth tab;
- while popped out, the Booth-tab Spinny section auto-collapses/minimizes so the dock stays compact;
- closing the popout restores normal Booth-tab use without losing current settings/state.

Do not duplicate capture engines between dock and popout. Both presentations should bind to the same Spinny service/state.

### 6. Pause / Resume

Desired capture invariant:

- Pause takes effect only **between completed frames**;
- any in-progress frame finishes first;
- already compressed/retained frames remain valid;
- Resume continues from the next angular sample;
- no repeated frame is inserted merely to represent the pause;
- figure orientation/angular cadence remains deterministic;
- arbitrary pause wall-clock time should not corrupt ETA math.

Diagnostics should eventually expose pause state/count/duration separately from active capture processing time.

### 7. Capture-invalidating interaction guards

While a Spinny capture is active or paused, protect it from Booth changes that would invalidate frame consistency.

Relevant actions include:

- leaving/exiting Photo Booth;
- camera/canvas pointer-drag attempts;
- Booth view/camera setting changes;
- backdrop/background changes;
- overlay/frame changes;
- lighting/effect changes;
- other Booth UI changes proven to alter captured frames.

Required behavior:

- intercept semantically, not by fixed screen coordinates;
- must work across HeroForge's left/right split layouts, grouped-right layout, and mobile/bottom layout;
- warning explains that proceeding will cancel the current capture;
- choosing to keep the capture prevents the attempted state-changing action;
- choosing to proceed cancels cleanly, restores figure rotation/state, then allows the requested action through a safe mechanism;
- Spinny's own Pause/Resume/Cancel/Popout controls must not be blocked by the guard.

A DOM/runtime probe was previously queued for this guard design; do not claim selector/classification findings until the probe result is actually reviewed.

## Explicitly deferred

### 8. 4096px / 4K animated WebP

4K Spinny is **out of the current stage**.

Reason: public High Res Image Capture owns square 4096/8192 `BT.maker.takeScreenshot` requests for still-image repair. A naive 4096 Spinny request collides with that provider path and would route each animation frame through still-image repair.

Current high-resolution Spinny ceiling for this stage: **3072px / 3K**.

Do not reintroduce 4096 Spinny until there is an explicit named native/upstream-frame capability or another clean compatibility seam. Do not temporarily disable/monkeypatch the Stable provider as a shortcut.

### 9. Optional Developer Mode hotkey

Not required and not implemented. The About-menu toggle is the accepted primary Developer Mode surface.

A secret/convenience hotkey can be considered later only if it provides real maintenance value and does not conflict with HeroForge/Witch Dock shortcuts.

## Next handoff

Return to `media.spinny-mini-webp` now that the 3072px capture has completed:

1. record the user's 3K output result;
2. inspect diagnostics only when safe/needed;
3. decide whether 3072 Standard passes the standalone gate;
4. then resume the Spinny Pause/guard/integration queue above.

Public `Witch_Scripts` remains untouched until Dev validation/promotion gates are explicitly satisfied.
