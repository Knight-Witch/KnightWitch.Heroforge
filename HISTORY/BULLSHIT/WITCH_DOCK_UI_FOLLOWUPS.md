# Witch Dock UI / Spinny Integration Follow-Ups

Status: **active handoff queue**  
Branch: `WITCH_DEV_UI`  
Recorded: 2026-09-06

## 2026-09-06 integrated Spinny smoke result

User smoke confirms the integrated Witch Dock Dev Spinny placement, shared-state draggable popout, Pause/Resume, cancellation, Developer-Mode Short Test visibility, and interaction guards all behave correctly. Remaining defects were isolated to final download initiation plus select-popup contrast; requested polish is plain resolution labels, icon-only Pop Out, brief confirmed-download feedback, and silent wheel/scroll blocking while keeping warnings for other guarded mutations.

Dev hardening versions: loader v0.2.0, Spinny service v0.5.1, Spinny UI v0.1.1. Re-smoke is required before Stable promotion. Public `Witch_Scripts` remains unchanged.

## 2026-09-06 tab cleanup + Developer Mode direction

Accepted tab target for the next Dev smoke:

`Body -> Pose -> Decals -> Booth -> JSON -> Utilities(cog)`

- `Body Editor` remains the internal tab key for preference compatibility but displays as `Body`.
- Utilities uses an icon-only cog with tooltip `Utilities`.
- Utilities must remain structurally last, not merely last by current manifest order.
- Unknown future tabs should appear before Utilities automatically.

Developer Mode product direction is now decided: it should eventually be available in public Stable, default OFF, toggled from About, primarily to expose module/version/build diagnostics during troubleshooting. No separate toolbar control or hotkey is required.

After tab cleanup smoke/promotion, resume the compact High Res integration/service-UI ownership work, then the Developer Mode Stable promotion gate.

---

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

## Integrated / validation — Spinny/WebP Witch Dock UX

### 4. Booth placement — PASS

Once the standalone Spinny gate is closed, integrate the Spinny capture toolset into Witch Dock Dev **directly below High Res Image Capture** by default.

Users may continue to use whatever Witch Dock rearrangement behavior is supported; this is only the default placement.

### 5. Popout mode — PASS

Desired UX:

- a Popout control opens the same Spinny panel as a floating movable panel;
- floating panel is draggable;
- small close `X` collapses the popout rather than destroying Spinny availability;
- Spinny always remains accessible from the Booth tab;
- while popped out, the Booth-tab Spinny section auto-collapses/minimizes so the dock stays compact;
- closing the popout restores normal Booth-tab use without losing current settings/state.

Do not duplicate capture engines between dock and popout. Both presentations should bind to the same Spinny service/state.

### 6. Pause / Resume — PASS

Desired capture invariant:

- Pause takes effect only **between completed frames**;
- any in-progress frame finishes first;
- already compressed/retained frames remain valid;
- Resume continues from the next angular sample;
- no repeated frame is inserted merely to represent the pause;
- figure orientation/angular cadence remains deterministic;
- arbitrary pause wall-clock time should not corrupt ETA math.

Diagnostics should eventually expose pause state/count/duration separately from active capture processing time.

### 7. Capture-invalidating interaction guards — PASS with wheel UX hardening

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

## 2026-09-06 implementation checkpoint

The standalone Spinny gate is now closed at v0.5.0 and the planned Witch Dock Dev UX has been implemented for live smoke:

- Booth placement below High Res Image Capture: implemented in Dev manifest load order;
- one shared Spinny service: implemented;
- draggable popout: implemented;
- close/Dock returns the same controls to the Booth section: implemented;
- frame-boundary Pause/Resume: inherited from validated v0.5 service;
- interaction guards: inherited from validated v0.5 service and updated to recognize Witch Dock Spinny-owned UI;
- Short Test Developer-Mode-only visibility: implemented;
- 4096 Spinny: still deferred.

Status: **implementation complete, integrated Dev smoke pending**. Public Stable remains untouched until user approval.

## 2026-09-06 tab-cleanup validation — PASS

User live smoke passed the Dev tab cleanup at `cb973c983dfaa723d7e6cb6d7c4474a1c875682e`:

- `Body -> Pose -> Decals -> Booth -> JSON -> Utilities(cog)` order: PASS;
- Utilities cog tooltip: PASS;
- all tabs open the correct tool: PASS;
- active-tab persistence across refresh: PASS.

The next UI stage is compact High Res Image Capture integration with explicit service/UI ownership cleanup, followed by public Developer Mode promotion work.
