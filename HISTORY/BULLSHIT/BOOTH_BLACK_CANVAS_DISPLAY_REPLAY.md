# Booth Black Canvas Display Replay

Date: 2026-09-07
Status: Dev experiment; live validation required
Feature: `booth.black-canvas-display-replay`
Module: v0.1.0 / `0.1.0-dev-post-display-update-replay`
Target HeroForge build: `heroforge07.1.9.98`
Public Stable: unchanged

## Purpose

Stop the one-frame white flash observed while Black Canvas is active without suppressing HeroForge's native character rebuild. The flash is not treated as a Kitbash-only defect: Amanda confirmed the same class of flash also occurs while working in Booth.

## Confirmed causal boundary

Live HF-Chat-Bridge isolation established the common path:

`CK.character.refresh()`
→ `CK.character.display.change(data)`
→ resource load / `_loaded(...)`
→ `CK.character.display.update()`

A clean Black Canvas test that temporarily no-op'd only `display.update()` preserved `refresh()`, `display.change()`, and resource loading and produced **no flash**. Therefore the flash is inside the native `display.update()` rebuild/presentation boundary.

That result does **not** justify suppressing `display.update()` in maintained code. HeroForge must remain free to rebuild the model normally.

## Ruled-out paths

The following were isolated or traced and did not account for the flash:

### Renderer / canvas

- renderer `setClearColor()` / clear-color forcing;
- `renderer.autoClearColor = false`;
- `CK.renderManager.resize()`;
- renderer `setSize()`;
- renderer `setDrawingBufferSize()`.

The flash reproduced with zero resize/backing-buffer calls around the matching rebuild.

### Booth / Black Canvas presentation helpers

- repeated environment-visibility setter calls;
- Booth overlay `resize()`;
- Booth overlay `refresh()` / `applyVisibility()`;
- Booth Background component state;
- black `tokenBg` replay;
- hiding the main scene sky/background by itself.

### `display.update()` sub-stages

The flash still reproduced while individually suppressing:

- `display.isLoading()` presentation state;
- `applyLighting()`;
- `_updateGround()`;
- `_customUpdateStart()`;
- `_customUpdateEnd()`;
- `_requestUpdateFx()` / deferred FX flag;
- `_mirrorPose()`;
- `_applyPartParents()`.

`updateVisibility()` source only changes character mesh/material visibility and does not toggle the environment/background.

### Kitbash remove/attach hypothesis

An observation-only trace of the flash-causing action showed `_removeSlot()`, `_attachPart()`, and `_attachMesh()` did run, but only for the character text `label` (`SlavaUkraini`). The Kitbash mesh itself was not removed or re-attached. This, plus the same flash occurring in Booth, rejects the Kitbash-specific geometry-replacement direction.

## Separate confirmed Black Canvas bug

The ordinary v27 Black Canvas enforcement does not hide HeroForge's real main-scene background object.

Live scene inspection from the named Booth scene root found a semantic path:

- scene root: `BT.display.overlays.backgroundPlane.parent`;
- named child: `environment`;
- named descendant/direct child: `background`.

Setting that background object's `visible` state to `false` restored the actual black viewport. Diagnostic work temporarily used a child-index path to prove the object, but **production code must not use child indexes**.

The Dev module therefore discovers the target by semantic names, captures its previous visibility, hides it only while Black Canvas is active, and restores it when Black Canvas turns off or the module is disposed.

## Dev implementation decision

Do not continue line-by-line suppression of HeroForge's minified rebuild internals.

Instead, add a separate hidden Dev compatibility module that:

1. discovers the current primary `CK.character.display`;
2. wraps only that display instance's named `update()` method;
3. calls the native `update()` untouched;
4. synchronously, in `finally`, reasserts Black Canvas presentation before the native scheduled render opportunity;
5. rewraps if HeroForge replaces the primary display instance;
6. restores only wrapper/background state that the module owns on dispose.

The replay reasserts:

- named Booth environment visibility OFF;
- Booth frame/shadow/mask hidden;
- semantic main-scene `environment -> background` hidden;
- renderer canvas and holder CSS black.

It deliberately does **not** force `overlays.backgroundPlane.visible`, because `tools/Booth.js` owns the user's Background component choice.

It deliberately does **not** call `requestRenderRefresh()`; the native update already requests its normal render, and the purpose is to restore Black Canvas state before that paint rather than schedule extra renderer churn.

## Lifecycle / failure isolation

- module is Dev-only and hidden;
- public `tools/Booth.js` API is read-only from this module except for `getState()`;
- no HeroForge update/refresh/change call is suppressed;
- duplicate module load disposes the previous owned wrapper first;
- if current display shape is unavailable, the module waits and retries without blocking unrelated Witch Dock/HeroForge behavior;
- Black Canvas OFF performs no post-update mutation and restores the module-owned semantic background visibility;
- dispose clears polling, restores the wrapped display method when still owned, and restores semantic background visibility.

## Risks

- `CK.character.display.update` is a named runtime method but remains an undocumented HeroForge integration seam; capability/shape changes must degrade safely.
- If HeroForge paints the white frame synchronously *inside* `display.update()` before the wrapper's `finally` executes, this post-return strategy will not fix the visible flash. That remains a live-test question.
- The semantic scene-background object may be replaced during future HeroForge builds; the module rediscovers it rather than pinning an index.

## Static validation

Before commit:

- Node syntax check: PASS.
- Mock lifecycle test: PASS.
  - wrapper installed;
  - native update still executed;
  - Black Canvas replay hid semantic background and frame/shadow/mask;
  - canvas/holder became black;
  - Black Canvas OFF restored semantic background;
  - dispose restored original display update.

## Live validation gate

After refreshing `WITCH_DEV_UI`:

1. confirm Black Canvas is visibly black;
2. perform one action that reliably produced the one-frame white flash, including native Booth if desired;
3. record **no flash** or **still flashes**;
4. toggle Black Canvas OFF and confirm the ordinary background returns;
5. confirm ordinary character updates still apply.

Do not promote to Stable until the live flash test and restoration smoke pass.
