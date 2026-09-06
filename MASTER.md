# Witch Dock Master

This is the canonical high-level source for current public Witch Dock state. Detailed historical master content remains available in Git history; this file tracks the active live architecture and current feature boundaries.

## Current Architecture

- Repository: `Knight-Witch/KnightWitch.Heroforge`
- Live branch: `Witch_Scripts`
- Public install script: `Witch_Dock.user.js`
- Current public userscript version: `1.1.0`
- Manifest loader: `manifest.json`
- Public module delivery: raw GitHub files pinned to the live `Witch_Scripts` branch
- Visible tools: `/tools/` plus feature modules that register their own Witch Dock host
- Hidden HeroForge/runtime utilities: `/HeroForge_UI/`
- Maintained feature services may live under `/features/`

Public Stable v1.1.0 is the current production baseline. The tab cleanup below remains Dev-only until its own smoke/promotion gate.

## Module Version Contract

`manifest.json.moduleRegistry` is the canonical active-module version registry in the current Dev candidate.

- Every active runtime module must have an explicit numeric version.
- Hidden and conditional runtime modules are included, not only visible toolsets.
- Existing source-local build tags remain useful and may be displayed alongside the canonical numeric version.
- Runtime/UI/API/storage/compatibility changes require a version bump in the same commit.
- Documentation-only changes do not require a module bump when runtime source is unchanged.
- Do not reconstruct fake historical release numbers; registry provenance records existing, normalized, and newly baselined versions.

Detailed policy: `MODULE_VERSIONING.md`.

## Active Dev UI Candidate

Branch: `WITCH_DEV_UI`.

### High Res Image Capture

`features/media/Photo_Booth_True_Resolution_UI.js` v0.3.0 / build `0.3.0-service-ui-ownership` is the sole compact presentation owner over service-only `Photo_Booth_True_Resolution.js` v0.8.0 / build `0.8.0-service-only-provider`.

Normal mode:

- title `High Res Image Capture`;
- compact `Capture: [4K] [8K]` row;
- visible hover feedback;
- compact status only;
- provider kill switch and implementation notes hidden from ordinary users.

Developer Mode adds the provider kill switch and implementation/build diagnostics.

Prior compact visual smoke: **PASS by user report**. Service/UI ownership cleanup is implemented in Dev; direct 4K/8K regression and provider disable/re-enable recovery are the current live gate.

### Developer Mode

`features/core/Witch_Dock_Developer_Mode.js` build `0.2.0-dev-module-version-registry` is the current Dev candidate.

- default off;
- persistent About-menu toggle;
- reversible `WitchDock.registerTool` wrapper;
- canonical module-version registry read from `manifest.json`;
- per-visible-tool canonical version/runtime build display;
- Developer-only About `Module Versions` inventory covering core, visible, hidden, and conditional active modules;
- registry failure is diagnostic-only;
- no HeroForge runtime patching and no public shell edit required.

Standalone visual smoke for Developer Mode, canonical version rows, and About module inventory: **PASS by user report**.

Detailed record: `HISTORY/BULLSHIT/WITCH_DOCK_DEVELOPER_MODE.md`.

### Default tab order / tab presentation candidate

Current accepted target:

`Body -> Pose -> Decals -> Booth -> JSON -> Utilities(cog)`

Dev core presentation keeps the existing `Body Editor` tab key for preference compatibility while displaying `Body`. Utilities renders as an icon-only cog with native hover tooltip/ARIA label `Utilities`. The core reorders known tabs and assigns unknown future tabs ahead of Utilities, so Utilities remains structurally pinned last instead of relying only on manifest load order. Integrated Dev smoke is pending.

## Active Module Version Baseline — 2026-09-06

| Module ID | Canonical Version | Existing Build / Provenance |
|---|---:|---|
| `witch-dock-core` | 1.0.8 | existing public userscript version |
| `expanded-ui-scroll-guards` | 1.0.0 | baseline; build `2026-07-03-layouts` preserved |
| `hf-ui-scroll-split-safe` | 1.0.0 | new tracking baseline |
| `hf-ui-slot-bridge` | 1.0.0 | new tracking baseline |
| `expanded-decal-slots` | 1.0.0 | new tracking baseline; conditional child |
| `corrected-bound-decal-gizmo` | 1.1.0 | existing build `1.1.0-stable-undo-transform-preserve` |
| `witch-dock-developer-mode` | 0.2.0 | Dev registry candidate |
| `body-editor` | 4.0.0 | normalized from existing `v4` identity |
| `pose-tool` | 1.0.0 | new tracking baseline |
| `booth-tool` | 24.0.0 | normalized from existing `v24` build |
| `photo-booth-true-resolution` | 0.7.0 | existing build `0.7.0-witch-dock-dev-provider` |
| `photo-booth-true-resolution-readiness` | 1.0.0 | existing build `1.0.0-public-readiness` |
| `photo-booth-true-resolution-ui` | 0.2.0 | existing Dev UI version/build |
| `decals-dev` | 1.0.0 | new tracking baseline |
| `json-tool` | 1.0.0 | new tracking baseline |
| `utilities` | 1.0.0 | new tracking baseline |

New `1.0.0` values are tracking anchors only, not reconstructed historical release counts.

## Live Feature Inventory

| Area | Manifest ID | File | Status | Notes |
|---|---|---|---|---|
| Core | n/a | `Witch_Dock.user.js` | Live | Dock shell/loader/shared UI. |
| Developer Mode | `witch-dock-developer-mode` | `features/core/Witch_Dock_Developer_Mode.js` | **Dev candidate only** | Modular diagnostics/version registry; standalone visual smoke passed. |
| Body | `body-editor` | `tools/Body_Editor.js` | Live | Body editing/symmetry. |
| Pose | `pose-tool` | `tools/Pose.js` | Live | Main/Extra swap. |
| Booth | `booth-tool` | `tools/Booth.js` | Live | Build `v24`; Persistent Booth/Black Canvas. |
| Photo Booth true resolution | `photo-booth-true-resolution` | `features/media/Photo_Booth_True_Resolution.js` | **Live / Stable validated** | TRUE 4K/8K service. |
| Photo Booth true-resolution UI | `photo-booth-true-resolution-ui` | `features/media/Photo_Booth_True_Resolution_UI.js` | **Dev candidate only** | Compact UI/Developer Mode consumer; standalone visual smoke passed. |
| Photo Booth readiness | `photo-booth-true-resolution-readiness` | `HeroForge_UI/Photo_Booth_True_Resolution_Readiness.js` | **Live / Stable validated / hidden** | Direct-button readiness sync. |
| JSON | `json-tool` | `tools/JSON_Tool.js` | Live | Bulk JSON library backup. |
| Utilities | `utilities` | `tools/Utilities.js` | Live | Optional HF UI controls. |
| Decals | `decals-dev` | `tools/Decals.js` | Live | Bound decal gizmo host. |
| HF UI | `expanded-ui-scroll-guards` | `HeroForge_UI/Expanded_UI_Scroll_Guards.js` | Live / hidden | Decal UI scroll/layout. |
| HF UI | `hf-ui-scroll-split-safe` | `HeroForge_UI/HF_UI_Scroll_Split_Safe.js` | Live / hidden | Split-layout safety. |
| HF UI | `hf-ui-slot-bridge` | `HeroForge_UI/HF_UI_Slot_Bridge.js` | Live / hidden | Conditional slot bridge. |
| HF UI | `expanded-decal-slots` | `HeroForge_UI/Expanded_Decal_Slots.js` | Live / conditional | Conditional expanded slots. |
| HF UI | `corrected-bound-decal-gizmo` | `HeroForge_UI/Corrected_Bound_Decal_Gizmo.js` | Live / hidden | Stable corrected gizmo. |

## Photo Booth True Resolution

Feature ID: `media.screenshot-resolution`. Validated on `heroforge07.1.9.98`. Public TRUE 4K uses one 4096 Effects source; TRUE 8K uses four shifted 4096 Effects sources and avoids an 8192 WebGL Effects target. Public Stable smoke passed on 2026-09-05.

Detailed record: `HISTORY/BULLSHIT/PHOTO_BOOTH_TRUE_RESOLUTION.md`.

## Bound Decal Gizmo

Feature ID: `decals.gizmo.bound-correction`. Current Stable service build: `1.1.0-stable-undo-transform-preserve`. Move/Rotate/Scale, undo/redo, Project-state preservation, artwork-swap preservation, and fresh-slot normalization are validated.

Detailed record: `HISTORY/BULLSHIT/BOUND_DECAL_GIZMO.md`.

## Spinny / Witch Dock Follow-Up Queue

The Witch Dock UX/integration decisions discussed while the standalone 3072px Spinny run was active are preserved in:

`HISTORY/BULLSHIT/WITCH_DOCK_UI_FOLLOWUPS.md`

Key pending items:

- integrated Developer Mode + compact High Res Dev smoke/promotion;
- High Res service/UI ownership cleanup before Stable;
- integrated `Booth -> Decals -> JSON` order smoke;
- Spinny beneath High Res Image Capture: integrated; placement smoke PASS;
- shared-state draggable Spinny popout: integrated; user smoke PASS;
- Pause/Resume: integrated; user smoke PASS;
- capture-invalidating interaction guards: integrated; user smoke PASS; wheel/scroll now silently blocks without a modal;
- 4096 animated WebP explicitly deferred because of the confirmed 4096 still-provider collision;
- optional Developer Mode hotkey remains non-required/deferred.

The standalone 3072px Spinny run has completed; detailed user result intake is now the immediate next task.

## Current Integration Rules

- `Witch_Scripts` is production; experiments stay on Dev branches/modules first.
- Public Witch Dock must not depend on unstable Compatibility/Foundation heads or HF-Chat-Bridge.
- Promote only accepted feature deltas; do not merge diverged Dev branches wholesale.
- Preserve capability checks, lifecycle restoration, timing/state sequencing, and failure isolation.
- Developer Mode must remain optional. Accepted Stable direction: default OFF, user-toggleable only through About, with module/build/version diagnostics available when troubleshooting.
- Every active module runtime change must obey `MODULE_VERSIONING.md` and bump the canonical version in the same commit.

## Current Near-Term Queue

1. Smoke the Dev tab cleanup: `Body -> Pose -> Decals -> Booth -> JSON -> Utilities(cog)`, with Utilities pinned last.
2. Promote the accepted tab cleanup separately after user approval.
3. Smoke integrated Developer Mode + compact High Res behavior, including provider disable/re-enable and direct 4K/8K regression.
4. Cleanly separate High Res service/UI ownership before promoting the compact High Res presentation.
5. Promote Developer Mode as an About-only, default-OFF public diagnostic feature after its integrated smoke.
6. Keep 4096 animated WebP deferred until a clean frame-source ownership seam exists.

## Durable Records

- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `MODULE_VERSIONING.md`
- `HISTORY/BULLSHIT/WITCH_DOCK_UI_FOLLOWUPS.md`
- `HISTORY/BULLSHIT/WITCH_DOCK_DEVELOPER_MODE.md`
- `HISTORY/BULLSHIT/PHOTO_BOOTH_TRUE_RESOLUTION.md`
- `HISTORY/BULLSHIT/BOUND_DECAL_GIZMO.md`
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
- `HISTORY/Bullshit_Bible.md`

Historical detailed state remains available in Git history.

## Spinny Mini WebP — Active Dev Candidate

`media.spinny-mini-webp` is now integrated into `WITCH_DEV_UI` as a two-module service/UI pair. Service v0.5.1 preserves the validated 1024/2048/TRUE-3K 3072 capture engine while hardening the Witch Dock download boundary and making wheel/scroll guard behavior silent. UI v0.1.1 registers `Spinny Mini WebP` directly after High Res Image Capture, keeps the validated shared-state draggable popout, fixes dark select options, uses plain resolution labels and an icon-only Pop Out control, and adds confirmed-download feedback.

Normal mode hides Short Test. Developer Mode reveals the 16-frame diagnostic control. Initial integrated Dev smoke passed capture/Pause/guard/popout behavior; the final download initiation failed and triggered this hardening pass. Live re-smoke of download/UI changes is pending. 4K animated WebP remains deferred and public `Witch_Scripts` is unchanged.


### Default tab order — validated Dev candidate

Dev tab cleanup is live-smoke validated. Default/structural order is `Body -> Pose -> Decals -> Booth -> JSON -> Utilities(cog)`. Utilities is pinned last by the Dev dock core rather than relying only on manifest timing, the cog tooltip reads `Utilities`, and persisted active-tab selection remains compatible.
