# Booth Black Canvas Display Replay

Date: 2026-09-07
Status: Dev candidate; live validation required
Feature: `booth.black-canvas-display-replay`
Dev candidate: v0.1.3 / `0.1.3-dev-editor-background-restore`
Public Stable: v0.1.1 / `0.1.1-stable-v24-state-fallback`
Target HeroForge build: `heroforge07.1.9.98`

## Purpose

Stop the one-frame white flash observed while Black Canvas is active without suppressing HeroForge's native character rebuild, while also allowing the saved Black Canvas default to restore before the gated Booth runtime exists.

## Confirmed causal boundary

Live HF-Chat-Bridge isolation established the common path:

`CK.character.refresh()`
→ `CK.character.display.change(data)`
→ resource load / `_loaded(...)`
→ `CK.character.display.update()`

A clean Black Canvas test that temporarily no-op'd only `display.update()` preserved `refresh()`, `display.change()`, and resource loading and produced no flash. Therefore the flash is inside the native `display.update()` rebuild/presentation boundary.

That result does not justify suppressing `display.update()` in maintained code. HeroForge must remain free to rebuild the model normally.

## Ruled-out paths

The following were isolated or traced and did not account for the flash:

- renderer `setClearColor()` / clear-color forcing;
- `renderer.autoClearColor = false`;
- `CK.renderManager.resize()`;
- renderer `setSize()` / `setDrawingBufferSize()`;
- repeated environment-visibility setter calls;
- Booth overlay `resize()` / `refresh()` / `applyVisibility()`;
- Booth Background component state;
- black `tokenBg` replay;
- hiding the main scene sky/background by itself;
- `display.isLoading()`;
- `applyLighting()`;
- `_updateGround()`;
- `_customUpdateStart()` / `_customUpdateEnd()`;
- `_requestUpdateFx()`;
- `_mirrorPose()`;
- `_applyPartParents()`.

`updateVisibility()` source only changes character mesh/material visibility and does not toggle the environment/background.

An observation-only trace of the flash-causing action also showed `_removeSlot()`, `_attachPart()`, and `_attachMesh()` affecting only the character text `label` (`SlavaUkraini`), not the Kitbash mesh. Combined with the same flash appearing in Booth, this rejected a Kitbash-specific geometry-replacement cause.

## Validated Black Canvas scene target with BT

The ordinary v27 Black Canvas enforcement did not hide HeroForge's real main-scene background object.

Live scene inspection from the named Booth scene root found a semantic path:

- scene root: `BT.display.overlays.backgroundPlane.parent`;
- named child: `environment`;
- named descendant/direct child: `background`.

Setting that background object's `visible` state to `false` restored the actual black viewport. Production replay discovers it by semantic names, captures prior visibility, hides it only while Black Canvas is active, and restores it when Black Canvas turns off or the module is disposed.

## Validated post-update replay implementation

The replay:

1. discovers the current primary `CK.character.display`;
2. wraps only that display instance's named `update()` method;
3. calls native `update()` untouched;
4. synchronously, in `finally`, reasserts Black Canvas presentation before the native scheduled render opportunity;
5. rewraps if HeroForge replaces the primary display instance;
6. restores only wrapper/background state that the module owns on dispose.

The replay reasserts:

- named Booth environment visibility OFF when available;
- Booth frame/shadow/mask hidden when available;
- semantic main-scene background hidden;
- renderer canvas and holder CSS black.

It deliberately does not force `overlays.backgroundPlane.visible`, because `tools/Booth.js` owns the user's Background component choice. It also does not call `requestRenderRefresh()`; native update already requests its normal render.

This post-update replay was live validated: the formerly reliable white flash no longer reproduced and Amanda reported it worked perfectly.

## Public Stable v0.1.1 state fallback

Public Stable added a compatibility fallback for determining whether Black Canvas is on. The replay first uses `KW_WD_BOOTH.getState().sessionBlackCanvas` when available, and falls back to `KW_WD_BOOTH_DIAG()` / `blackCanvasOn` if the main API shape is unavailable.

Dev v0.1.0 had not yet carried this Stable-only state fallback. Dev candidate v0.1.2 intentionally incorporates it before any further promotion so the eventual Stable update is monotonic rather than dropping existing Stable behavior.

## 2026-09-07 pre-BT startup extension

Startup testing exposed a separate persistence boundary: Black Canvas can be saved ON while HeroForge has not yet loaded the gated Booth runtime. The replay can already determine saved Black Canvas state and blacken the renderer canvas/holder without BT, but its validated semantic background lookup begins at `BT.display.overlays.backgroundPlane.parent`.

Prior bridge evidence confirms the regular main display path uses `CK.environment.background`:

- `CK.character.display.applyLighting()` calls `CK.environment.background.updateValues(...)`;
- the background manager's own `updateValues()` operates through `this.mesh.material`.

Supported inference: `CK.environment.background.mesh` is therefore the conservative regular-scene render target for pre-BT visibility suppression. The exact fresh-start visual object identity is not yet live-proven, so v0.1.2 only accepts that fallback when the mesh exists and exposes a `visible` property. Missing/changed shape degrades to no-op/retry.

Discovery order in v0.1.2:

1. If the module already acquired the direct CK mesh before BT appeared, retain that same owned object to avoid restore/hide churn during the handoff.
2. Otherwise, if BT exists, use the already-validated semantic named `environment -> background` path.
3. If no BT semantic target exists, use `CK.environment.background.mesh` only when it has a visibility capability.

Black Canvas alone does not load `/gated/booth.js`, call `BT.setBoothMode()`, or otherwise enable Booth View. Booth Persistence remains a separate default owned by the runtime bootstrap feature.

## Lifecycle / failure isolation

- no HeroForge update/refresh/change call is suppressed;
- duplicate module load disposes the previous owned wrapper first;
- if current display/background capability is unavailable, the module waits and retries without blocking unrelated Witch Dock/HeroForge behavior;
- Black Canvas OFF performs no post-update mutation and restores replay-owned background visibility;
- dispose clears polling, restores the wrapped display method when still owned, and restores replay-owned background visibility;
- pre-BT fallback changes only a `visible` property and stores/restores its prior value;
- failure never bootstraps Booth as a fallback.

## Validation

Confirmed/live:

- original post-`display.update()` replay removes the reliable white flash;
- BT semantic named-background path restores true black canvas;
- Black Canvas OFF restoration worked in the validated replay path.

Static v0.1.2 candidate:

- JavaScript syntax: PASS;
- no-BT API-state lifecycle mock: PASS;
- Public Stable diagnostic-state fallback mock: PASS;
- BT-present semantic-path regression mock: PASS;
- native display update still executes in all mocks;
- Black Canvas OFF restores owned visibility;
- dispose restores original display update;
- candidate Git blob matches locally tested source.

Pending live Dev validation:

- fresh ordinary editor startup with Black Canvas Across Sessions ON becomes black before BT exists;
- Black Canvas alone does not activate Booth;
- saved-Booth persistence still bootstraps Booth when its own persistence default is ON;
- known white-flash action remains flash-free;
- Black Canvas OFF restores ordinary HeroForge background;
- fresh `+ New Figure` does not auto-bootstrap Booth.

Do not promote v0.1.2 to Stable until this combined Dev gate passes.

## 2026-09-07 editor-background restoration follow-up — v0.1.3

The integrated startup smoke kept the white-flash regression closed but reproduced a different historical failure: after Booth View and Black Canvas were both switched OFF, HeroForge's normal fantasy editor background could remain hidden and the viewport appeared white.

The replay's owned background snapshot explains the ordering hazard. While Booth is active, the real main-scene background can legitimately already be invisible; v0.1.2 captured that `false` and later restored it literally. If Booth itself was OFF by then, replaying the stale hidden value counteracted the editor-environment restoration.

v0.1.3 preserves the validated post-`display.update()` replay and all Black Canvas enforcement. When Booth is still active, it restores the captured visibility exactly as before. When BT exists but Booth View is now OFF, it instead reasserts the named default-environment visibility and makes the owned main-scene background visible. The no-BT Black Canvas path still restores its captured CK mesh visibility normally.
