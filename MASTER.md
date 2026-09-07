# Witch Dock Master

This is the canonical high-level source for current public Witch Dock state. Historical detail remains available in Git history and the HISTORY records.

## Current Stable

- Repository: `Knight-Witch/KnightWitch.Heroforge`
- Production branch: `Witch_Scripts`
- Public userscript: `Witch_Dock.user.js`
- Current public version: **1.2.0**
- HeroForge validation target for the promoted media/tooling work: `heroforge07.1.9.98`
- Runtime dependencies on HeroForge.Compatibility unstable head or HF-Chat-Bridge: **none**

Witch Dock v1.2.0 remains the public shell. The Black Canvas display replay is a manifest-delivered hidden compatibility module and does not require a userscript-shell version bump.

## Black Canvas display replay

Feature ID: `booth.black-canvas-display-replay`.

- Public module: v0.1.1 / build `0.1.1-stable-v24-state-fallback`.
- Dev replay behavior was live validated on `heroforge07.1.9.98`; the formerly reliable white flash no longer reproduced and Amanda reported the fix worked perfectly.
- HeroForge's native `CK.character.display.update()` remains untouched and always executes; the compatibility wrapper reasserts Black Canvas state immediately afterward.
- The real main-scene background is discovered semantically through named `environment` -> `background`, not diagnostic child indexes.
- Public Stable Booth remains v24. The public module reads v24's existing `KW_WD_BOOTH_DIAG().blackCanvasOn` when the newer Dev `KW_WD_BOOTH.getState().sessionBlackCanvas` API is unavailable.
- Stable-shaped syntax/lifecycle/fallback mock passed before promotion.
- No Booth v27 code is promoted by this feature.
- One clean public flash/background-restoration smoke is required after module refresh.

Detailed record: `HISTORY/BULLSHIT/BOOTH_BLACK_CANVAS_DISPLAY_REPLAY.md`.

## Public tab presentation

Default/structural visible tab order:

`Body -> Pose -> Decals -> Booth -> JSON -> Utilities(cog)`

- The historical `Body Editor` internal tab key remains compatible while the visible label is `Body`.
- Utilities is an icon-only cog with tooltip/ARIA label `Utilities`.
- Utilities is structurally pinned last; future/unknown tabs are inserted before it.
- Persisted active-tab behavior was live tested in Dev before promotion.

## Developer Mode

Public Developer Mode: `features/core/Witch_Dock_Developer_Mode.js` v0.3.0 / build `0.3.0-public-ready-manifest-source`.

- optional and OFF by default for users without a saved preference;
- toggled only from the Witch Dock About section;
- persists the user's chosen state;
- exposes canonical module versions/runtime builds and tool IDs for troubleshooting;
- About includes a `Module Versions` inventory covering active core, visible, hidden, and conditional modules;
- Developer-only controls such as Spinny Short Test and High Res provider diagnostics appear only while enabled;
- registry failure is diagnostic-only and must not disable ordinary Witch Dock behavior;
- registry source follows the manifest URL advertised by the active Witch Dock host, with public Stable manifest as fallback.

`manifest.json.moduleRegistry` is now the canonical public active-module version registry. Versioning policy: `MODULE_VERSIONING.md`.

## Photo Booth true resolution

Feature ID: `media.screenshot-resolution`.

- Service: v0.8.0 / build `0.8.0-service-only-provider`.
- UI: v0.3.0 / build `0.3.0-service-ui-ownership`.
- Readiness adapter: v1.0.0 / build `1.0.0-public-readiness`.
- The service exclusively owns validated TRUE 4K/8K capture/provider behavior.
- The compact UI exclusively owns the visible `High Res Image Capture` Booth section.
- Normal presentation is `Capture: [4K] [8K]` with compact status.
- Developer Mode reveals provider enable/recovery and build diagnostics.
- The service/UI ownership split, provider disable/re-enable recovery, direct TRUE 4K, direct TRUE 8K, and Spinny coexistence all passed live Dev validation before promotion.
- Validated capture/provider function bodies were preserved across the service/UI ownership cleanup.

Detailed record: `HISTORY/BULLSHIT/PHOTO_BOOTH_TRUE_RESOLUTION.md`.

## Spinny Mini WebP

Feature ID: `media.spinny-mini-webp`.

- Service remains public v0.5.1 / build `0.5.1-witch-dock-stable-download-scroll-guard`.
- UI remains public v0.1.1 / build `0.1.1-stable-download-ux`.
- This Black Canvas promotion does **not** modify the validated Spinny capture engine or UI source.
- 1024/2048 native capture and repaired TRUE-3K 3072 remain available.
- Pause/Resume, cancel, ETA/progress, draggable popout, silent wheel block, other capture-continuity warnings, and privileged downloads remain unchanged.
- Short Test remains hidden in normal mode and becomes visible when Developer Mode is enabled.

Detailed record: `HISTORY/BULLSHIT/SPINNY_MINI_WEBP.md`.

## Other live tools

- Body Editor / Body tab: live.
- Pose: live.
- Decals tab: live placeholder — `New decal tools coming shortly!`.
- Booth persistence/Black Canvas: Booth v24 remains live; hidden display replay v0.1.1 now protects Black Canvas across native display rebuilds.
- JSON: live.
- Utilities: live; its pinned cog hosts the Bound Decal Gizmo controls. The corrected gizmo service/runtime remains unchanged and Stable validated.

## Active module version contract

Every active runtime module has one canonical numeric version in `manifest.json.moduleRegistry`. Runtime/UI/API/storage/compatibility changes require a matching registry bump in the same committed update. Source-local build tags remain supplemental diagnostics.

## Current integration rules

- `Witch_Scripts` is production; experiments validate separately before promotion.
- Promote accepted deltas only; do not merge diverged Dev branches wholesale.
- Preserve validated capture math, timing/state sequencing, lifecycle restoration, capability gates, and failure isolation.
- Public Stable must not depend on HF-Chat-Bridge or an unstable Compatibility/Foundation development head.

## Current queue

1. Run one clean public Black Canvas replay smoke after Stable module refresh: visibly black viewport, formerly flash-causing update, Black Canvas OFF restoration, and ordinary character-update sanity.
2. Continue unrelated compatibility/reconstruction work only as separately scoped features.

The previously discussed 4096 animated-WebP expansion and Developer Mode hotkey are **not active roadmap items** and require no further work unless explicitly reopened later.

## Durable records

- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `MODULE_VERSIONING.md`
- `HISTORY/BULLSHIT/BOOTH_BLACK_CANVAS_DISPLAY_REPLAY.md`
- `HISTORY/BULLSHIT/WITCH_DOCK_DEVELOPER_MODE.md`
- `HISTORY/BULLSHIT/PHOTO_BOOTH_TRUE_RESOLUTION.md`
- `HISTORY/BULLSHIT/SPINNY_MINI_WEBP.md`
- `HISTORY/BULLSHIT/BOUND_DECAL_GIZMO.md`
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md`