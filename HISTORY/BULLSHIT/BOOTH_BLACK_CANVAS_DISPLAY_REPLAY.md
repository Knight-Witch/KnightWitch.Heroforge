# Booth Black Canvas Display Replay

Date: 2026-09-07
Status: Stable promotion candidate; Dev flash suppression validated
Feature: `booth.black-canvas-display-replay`
Public module: v0.1.1 / `0.1.1-stable-v24-state-fallback`
Target HeroForge build: `heroforge07.1.9.98`

## Purpose

Prevent the one-frame white flash observed while Black Canvas is active without suppressing HeroForge's native character rebuild.

## Confirmed causal boundary

Live HF-Chat-Bridge isolation established:

`CK.character.refresh()`
-> `CK.character.display.change(data)`
-> resource load
-> `CK.character.display.update()`

Suppressing only `display.update()` removed the flash while earlier native stages still occurred. Maintained code therefore does not suppress the update; it lets HeroForge run normally and reasserts Black Canvas state immediately after the native update returns.

## Ruled-out paths

The flash remained after isolating renderer clear color/auto-clear, renderer resize/backing-store changes, Booth overlay resize/refresh, loading state, lighting, ground, custom update hooks, deferred FX, Kitbash mirror/parenting, and Kitbash mesh replacement. The same flash also occurs in Booth, rejecting a Kitbash-only production fix.

## Separate Black Canvas target

Live scene inspection confirmed Black Canvas also needed to hide HeroForge's real main-scene background. The maintained module discovers that object semantically from the Booth scene root through named `environment` -> `background`; diagnostic child indexes are not shipped.

## Dev validation

Dev module v0.1.0 / `0.1.0-dev-post-display-update-replay` was committed at `12383ca5a551acb1a6bf330f7cfad8ea68a82ad1` and live-smoked on the current HeroForge build.

Amanda's result after the previously reliable flash-causing action: **worked perfectly**. The white flash did not reproduce with Black Canvas visibly active.

Dev validation therefore confirms the replay/rendering behavior itself.

## Stable v24 compatibility adapter

Public Stable still uses Booth v24. Source review confirmed v24 does not expose the newer `KW_WD_BOOTH.getState().sessionBlackCanvas` API used by the Dev host, but it does expose existing `KW_WD_BOOTH_DIAG()` JSON with `blackCanvasOn`.

Public v0.1.1 therefore:

- prefers the newer `KW_WD_BOOTH.getState().sessionBlackCanvas` state seam when available;
- falls back to Stable v24 `KW_WD_BOOTH_DIAG().blackCanvasOn`;
- otherwise preserves the Dev-validated replay, wrapper, semantic-background, and lifecycle logic.

No Booth v27 code is promoted to Stable.

## Runtime behavior

The module:

1. wraps only the current primary `CK.character.display` instance's named `update()` method;
2. always calls HeroForge's original update;
3. reasserts Black Canvas in `finally` only while Black Canvas is ON;
4. hides frame/shadow/mask and the semantic scene background;
5. blackens the renderer canvas/holder;
6. leaves `overlays.backgroundPlane.visible` under Booth's existing Background component ownership;
7. rewraps safely if HeroForge replaces the primary display;
8. restores its owned wrapper/background state on dispose.

It does not call `requestRenderRefresh()` and does not suppress `refresh()`, `display.change()`, resource loading, or `display.update()`.

## Stable-candidate static validation

Exact public v0.1.1 candidate:

- JavaScript syntax: PASS;
- Stable-v24-shaped diagnostic fallback with no `KW_WD_BOOTH` API: PASS;
- native display update passthrough: PASS;
- post-update Black Canvas replay: PASS;
- semantic background hide: PASS;
- dispose/background restore: PASS.

## Preserved boundaries

Unchanged by this promotion:

- public `tools/Booth.js` v24;
- Witch Dock userscript shell v1.2.0;
- Corrected Bound Decal Gizmo;
- Spinny Mini WebP;
- High Res Image Capture;
- JSON, Utilities, Developer Mode, Decals host, and tab behavior;
- HF-Chat-Bridge remains development-only and is not a runtime dependency.

## Public smoke gate

After Stable promotion, refresh the public Witch Dock/page and verify:

1. Black Canvas is visibly black;
2. the formerly reliable flash-causing Booth/editor update does not flash white;
3. Black Canvas OFF restores the ordinary background;
4. ordinary character updates still apply.

If any public regression appears, revert the single Stable promotion commit or remove the hidden manifest entry.

## 2026-09-07 Stable promotion to replay v0.1.5

Public replay advances to the exact Dev-tested v0.1.5 blob `3f663f8349830490d17b0d44aa42525b35c97b5f`. The source retains Stable v0.1.1's `KW_WD_BOOTH` state preference plus diagnostic fallback, adds the pre-BT `CK.environment.background.mesh` compatibility path, preserves native `CK.character.display.update()` execution and the validated synchronous post-update replay timing, and restores replay-owned background visibility before handing presentation ownership to Booth.

This handoff repair corresponds to the live state where the environment wrapper reported visible while the actual background mesh remained hidden. The final Dev environment/component smoke passed before promotion.
