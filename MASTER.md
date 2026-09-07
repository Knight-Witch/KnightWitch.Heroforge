# Witch Dock Master

This is the canonical high-level source for current public Witch Dock state. Historical detail remains available in Git history and the HISTORY records.

## Current Stable

- Repository: `Knight-Witch/KnightWitch.Heroforge`
- Production branch: `Witch_Scripts`
- Public userscript: `Witch_Dock.user.js`
- Current public shell version: **1.2.0**
- HeroForge validation target: `heroforge07.1.9.98`
- Runtime dependency on HeroForge.Compatibility unstable head or HF-Chat-Bridge: **none**

The public shell remains v1.2.0. Booth v27 and Utilities v1.2.1 are manifest-delivered module promotions; no userscript-shell bump is required.

## Booth / Black Canvas

Public Booth: `tools/Booth.js` v27.0.0 / build `v27`.

Public Black Canvas replay: `features/booth/Black_Canvas_Display_Replay.js` v0.1.1 / build `0.1.1-stable-v24-state-fallback`.

Current public behavior:

- Booth View and Black Canvas in the Booth tab are session controls.
- `Utilities -> Booth Features` owns the saved cross-session defaults.
- saved Booth persistence only auto-restores figures with meaningful saved Photo Booth configuration; `+ New Figure` / no-saved-Booth figures are excluded until a Booth setup exists.
- saved Black Canvas can reapply without requiring a Photo Booth visit.
- Booth runtime resolution no longer requires `BT.maker` merely to inspect saved figure config or enforce display-only Black Canvas state; named engine resolution uses `BT.liveEngine || BT.maker` when available.
- v27 removes Witch Dock's broad `CK.character.refresh()` from component/startup reconciliation and replays lighting with identical next/previous values.
- figure-scoped Booth snapshots are cleared when the loaded character generation changes to avoid cross-figure replay.
- the hidden Black Canvas replay lets native `CK.character.display.update()` run normally and reasserts black state immediately afterward.
- the replay semantically discovers the real scene `environment -> background` target; no diagnostic child indexes are shipped.
- v0.1.1 prefers v27 `KW_WD_BOOTH.getState().sessionBlackCanvas` and retains the v24 diagnostic fallback for compatibility.

Dev validation: with Booth v27 + Utilities v1.2.1 + replay loaded together, the formerly reliable white flash no longer reproduced; Amanda reported the result worked perfectly.

Detailed records:
- `HISTORY/BULLSHIT/BOOTH_V27_STABLE_PROMOTION.md`
- `HISTORY/BULLSHIT/BOOTH_BLACK_CANVAS_DISPLAY_REPLAY.md`

## Utilities

Public Utilities: `tools/Utilities.js` v1.2.1.

- `Booth Features`: saved Booth Persistence Across Sessions and Black Canvas Across Sessions defaults.
- `Decal Features`: Bound Decal Gizmo controls.
- `HeroForge UI Patches`: existing optional UI utilities.
- existing storage keys and corrected-gizmo service ownership are preserved.

## Public tab presentation

Default/structural visible tab order:

`Body -> Pose -> Decals -> Booth -> JSON -> Utilities(cog)`

- The historical `Body Editor` internal tab key remains compatible while the visible label is `Body`.
- Utilities is an icon-only cog with tooltip/ARIA label `Utilities` and is structurally pinned last.

## Developer Mode

Public Developer Mode: v0.3.0 / build `0.3.0-public-ready-manifest-source`.

- optional/default OFF;
- About-only toggle;
- persistent user choice;
- exposes canonical module versions/runtime builds and tool IDs for troubleshooting;
- reads the active public manifest registry.

`manifest.json.moduleRegistry` is the canonical public active-module version registry.

## Photo Booth true resolution

Feature ID: `media.screenshot-resolution`.

- Service: v0.8.0 / build `0.8.0-service-only-provider`.
- UI: v0.3.0 / build `0.3.0-service-ui-ownership`.
- Readiness adapter: v1.0.0 / build `1.0.0-public-readiness`.
- TRUE 4K/8K remains Stable validated and unchanged by the Booth promotion.

## Spinny Mini WebP

Feature ID: `media.spinny-mini-webp`.

- Service: v0.5.1 / build `0.5.1-witch-dock-stable-download-scroll-guard`.
- UI: v0.1.1 / build `0.1.1-stable-download-ux`.
- Capture engine/UI are unchanged by the Booth promotion.

## Other live tools

- Body: live.
- Pose: live.
- Decals: live placeholder.
- JSON: live.
- Corrected Bound Decal Gizmo runtime: Stable validated and unchanged.

## Current integration rules

- `Witch_Scripts` is production; experiments validate separately before promotion.
- Promote accepted deltas only; do not merge diverged Dev branches wholesale.
- Preserve validated timing/state sequencing, lifecycle restoration, capability gates, and failure isolation.
- Public Stable must not depend on HF-Chat-Bridge or an unstable Compatibility/Foundation head.

## Current queue

1. Clean public smoke after refresh: Developer Mode should report Booth v27.0.0 and Utilities v1.2.1; `Utilities -> Booth Features` should be present; Black Canvas should remain black through the formerly flash-causing action.
2. Verify Black Canvas OFF restores the ordinary background and ordinary character updates still apply.
3. Continue unrelated compatibility/reconstruction work only as separately scoped features.

## Durable records

- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `MODULE_VERSIONING.md`
- `HISTORY/BULLSHIT/BOOTH_V27_STABLE_PROMOTION.md`
- `HISTORY/BULLSHIT/BOOTH_BLACK_CANVAS_DISPLAY_REPLAY.md`
- `HISTORY/BULLSHIT/WITCH_DOCK_DEVELOPER_MODE.md`
- `HISTORY/BULLSHIT/PHOTO_BOOTH_TRUE_RESOLUTION.md`
- `HISTORY/BULLSHIT/SPINNY_MINI_WEBP.md`
- `HISTORY/BULLSHIT/BOUND_DECAL_GIZMO.md`
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
