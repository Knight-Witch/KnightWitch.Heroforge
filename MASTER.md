# Witch Dock Master

This is the canonical high-level source for current public Witch Dock state. Detailed historical master content remains available in Git history; this file tracks the active live architecture and current feature boundaries.

## Current Architecture

- Repository: `Knight-Witch/KnightWitch.Heroforge`
- Live branch: `Witch_Scripts`
- Public install script: `Witch_Dock.user.js`
- Current public userscript version: `1.0.8`
- Manifest loader: `manifest.json`
- Public module delivery: raw GitHub files pinned to the live `Witch_Scripts` branch
- Visible tools: `/tools/` plus feature modules that register their own Witch Dock host
- Hidden HeroForge/runtime utilities: `/HeroForge_UI/`
- Maintained feature services may live under `/features/` while future shared Foundation extraction is pending

Public Stable remains unchanged by the current `WITCH_DEV_UI` work.

## Active Dev UI Candidate

Branch: `WITCH_DEV_UI`.

Current Dev-only UI work keeps the Stable true-resolution capture engine unchanged and layers presentation/diagnostics around it.

### High Res Image Capture

`features/media/Photo_Booth_True_Resolution_UI.js` build `0.2.0-dev-developer-mode` is the current presentation adapter over the existing `KWPhotoBoothTrueResolution` service.

Normal presentation:

- section title `High Res Image Capture`;
- compact `Capture: [4K] [8K]` row;
- visible violet hover state;
- idle text `Active — click 4K or 8K to begin image capture`;
- no provider kill switch or provider/Lob implementation notes in ordinary mode.

Developer Mode presentation adds the provider kill switch, UI/service/readiness builds, provider state, and implementation note.

The adapter remains standalone-installable for isolated Tampermonkey testing and future manifest loading.

### Developer Mode

`features/core/Witch_Dock_Developer_Mode.js` build `0.1.0-dev-registry-about-toggle` is the current Dev candidate.

Behavior:

- default off;
- persistent toggle injected into Witch Dock's existing `?` / About modal;
- reversible wrapper around named `WitchDock.registerTool`;
- records only declared build/version metadata;
- shows per-tool `DEV · <tool-id> · build <...>` rows while enabled;
- undeclared versions are explicitly shown as `build unreported` rather than guessed;
- exposes shared `KWDeveloperMode` API for feature-specific diagnostics/troubleshooting controls;
- does not touch HeroForge `CK`, `BT`, Webpack, bundles, character state, camera state, or Photo Booth renderer state;
- does not edit the public Witch Dock shell for the first candidate.

Detailed record: `HISTORY/BULLSHIT/WITCH_DOCK_DEVELOPER_MODE.md`.

### Default tab order candidate

The `WITCH_DEV_UI` manifest registers `Decals` after Booth-related modules and before `JSON`, yielding the intended default order `... Booth → Decals → JSON → Utilities` without coordinate/layout hacks.

## Live Feature Inventory

| Area | Manifest ID | File | Status | Notes |
|---|---|---|---|---|
| Core | n/a | `Witch_Dock.user.js` | Live | Floating dock shell, manifest loader, shared UI, storage, undo/redo, footer utilities, compact emblem launcher. |
| Developer Mode | `witch-dock-developer-mode` | `features/core/Witch_Dock_Developer_Mode.js` | **Dev candidate only** | Modular About toggle + declared build registry + feature diagnostics host. |
| Body | `body-editor` | `tools/Body_Editor.js` | Live | Body editing/symmetry workflows. |
| Pose | `pose-tool` | `tools/Pose.js` | Live | Figure Main/Extra swap workflow. |
| Booth persistence | `booth-tool` | `tools/Booth.js` | Live | Current build `v24`; Persistent Booth, lighting/effects/overlay/background persistence, Black Canvas. |
| Photo Booth true resolution | `photo-booth-true-resolution` | `features/media/Photo_Booth_True_Resolution.js` | **Live / Stable validated** | `media.screenshot-resolution`; true 4K and grouped low-pressure true 8K provider. Stable capture service unchanged by current Dev UI work. |
| Photo Booth true-resolution UI | `photo-booth-true-resolution-ui` | `features/media/Photo_Booth_True_Resolution_UI.js` | **Dev candidate only** | Compact UI adapter over the Stable service; Developer Mode consumer. |
| Photo Booth UI readiness | `photo-booth-true-resolution-readiness` | `HeroForge_UI/Photo_Booth_True_Resolution_Readiness.js` | **Live / Stable validated / hidden** | Keeps direct 4K/8K buttons synchronized with Booth readiness/provider state. |
| JSON | `json-tool` | `tools/JSON_Tool.js` | Live | Bulk JSON library backup. |
| Utilities | `utilities` | `tools/Utilities.js` | Live | User-facing controls for optional HF UI helpers. |
| Decals | `decals-dev` | `tools/Decals.js` | Live | Bound decal gizmo host; Dev manifest candidate moves tab before JSON by default. |
| HF UI | `expanded-ui-scroll-guards` | `HeroForge_UI/Expanded_UI_Scroll_Guards.js` | Live / hidden | Scoped Decals scroll/resize behavior. |
| HF UI | `hf-ui-scroll-split-safe` | `HeroForge_UI/HF_UI_Scroll_Split_Safe.js` | Live / hidden | Split-layout scroll safety. |
| HF UI | `hf-ui-slot-bridge` | `HeroForge_UI/HF_UI_Slot_Bridge.js` | Live / hidden | Conditional expanded decal-slot bridge. |
| HF UI | `corrected-bound-decal-gizmo` | `HeroForge_UI/Corrected_Bound_Decal_Gizmo.js` | Live / hidden | Stable corrected bound decal gizmo with validated undo/redo and transform preservation. |

## Photo Booth True Resolution

Feature ID: `media.screenshot-resolution`.

Validated source baseline: HeroForge.Compatibility standalone v0.6 on `heroforge07.1.9.98`.

Public behavior:

- intercepts only square 4096 and 8192 `BT.maker.takeScreenshot` calls;
- leaves all other capture sizes untouched;
- TRUE 4K uses one genuine 4096 Effects source;
- TRUE 8K uses four shifted 4096 Effects sources;
- does not allocate an 8192 WebGL Effects target;
- preserves HeroForge's native Booth compositor/staging;
- temporarily wraps named `CK.Effects.renderToCanvas` only during repaired capture;
- restores owned runtime methods after capture/disable where ownership remains intact;
- current Lob/ADP may remain installed and supply HeroForge's visible 4096/8192 choices; Witch Dock repairs those requests downstream.

Public Stable smoke on 2026-09-05 passed for HeroForge/Lob 4K/8K, Witch Dock direct TRUE 4K/8K, and readiness behavior.

Detailed record: `HISTORY/BULLSHIT/PHOTO_BOOTH_TRUE_RESOLUTION.md`.

## Bound Decal Gizmo

Feature ID: `decals.gizmo.bound-correction`.

Current Stable service build: `1.1.0-stable-undo-transform-preserve`.

Validated behavior includes projector-centered Move/Rotate/Scale, native floor/origin Transformer suppression, Move/Rotate/Scale undo-redo, Project state preservation, artwork-swap transform preservation, and signature-gated fresh-slot bad-default normalization.

Detailed record: `HISTORY/BULLSHIT/BOUND_DECAL_GIZMO.md`.

## Current Integration Rules

- `Witch_Scripts` is production; experimental development occurs on separate branches/modules first.
- Public Witch Dock must not depend on `HeroForge.Compatibility/main`, HF-Chat-Bridge, or an unstable future Foundation head at runtime.
- Validated Compatibility features may be promoted as self-contained public modules after Dev integration testing and explicit approval.
- Do not merge diverged Dev branches wholesale into production; promote only accepted feature deltas.
- Preserve runtime capability checks, lifecycle restoration, timing/state sequencing, and failure isolation.
- Developer Mode must remain optional: normal Witch Dock operation cannot depend on it.

## Current Near-Term Queue

1. Finish the active 3072px Spinny Standard validation without disturbing the running capture.
2. After the Spinny run completes, live-test Developer Mode and High Res Image Capture UI independently over current public Witch Dock.
3. Validate Developer Mode off/on persistence, About toggle, tool metadata rows, and High Res provider kill-switch recovery.
4. Validate compact High Res direct 4K/8K capture behavior.
5. Smoke the Dev manifest default `Booth → Decals → JSON` order.
6. Add accurate `build`/`version` metadata incrementally to older Witch Dock tool registrations that currently report `build unreported`.
7. Cleanly separate High Res capture service UI ownership before public promotion; do not ship the same-ID replacement technique as the final architecture.
8. Integrate the separately validated Spinny/WebP tool beneath High Res Image Capture in Witch Dock Dev only after standalone Spinny validation closes.
9. Keep Persistent Booth and corrected bound decal gizmo isolated from unrelated refactors.

## Durable Records

- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/BULLSHIT/WITCH_DOCK_DEVELOPER_MODE.md`
- `HISTORY/BULLSHIT/PHOTO_BOOTH_TRUE_RESOLUTION.md`
- `HISTORY/BULLSHIT/BOUND_DECAL_GIZMO.md`
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
- `HISTORY/Bullshit_Bible.md`

Historical detailed state remains available in Git history.
