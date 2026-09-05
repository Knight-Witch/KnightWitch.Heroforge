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

`Witch_Dock.user.js` itself is unchanged by the 2026-09-05 true-resolution Photo Booth promotion; existing installs receive that feature through manifest/module refresh.

## Live Feature Inventory

| Area | Manifest ID | File | Status | Notes |
|---|---|---|---|---|
| Core | n/a | `Witch_Dock.user.js` | Live | Floating dock shell, manifest loader, shared UI, storage, undo/redo, footer utilities, compact emblem launcher. |
| Body | `body-editor` | `tools/Body_Editor.js` | Live | Body editing/symmetry workflows. |
| Pose | `pose-tool` | `tools/Pose.js` | Live | Figure Main/Extra swap workflow. |
| Booth persistence | `booth-tool` | `tools/Booth.js` | Live | Current build `v24`; Persistent Booth, lighting/effects/overlay/background persistence, Black Canvas. |
| Photo Booth true resolution | `photo-booth-true-resolution` | `features/media/Photo_Booth_True_Resolution.js` | Live | `media.screenshot-resolution`; true 4K and grouped low-pressure true 8K provider plus direct Booth-tab buttons. |
| Photo Booth UI readiness | `photo-booth-true-resolution-readiness` | `HeroForge_UI/Photo_Booth_True_Resolution_Readiness.js` | Live / hidden | Keeps direct 4K/8K buttons synchronized when Photo Booth becomes ready after provider initialization. |
| JSON | `json-tool` | `tools/JSON_Tool.js` | Live | Bulk JSON library backup. |
| Utilities | `utilities` | `tools/Utilities.js` | Live | User-facing controls for optional HF UI helpers. |
| Decals | `decals-dev` | `tools/Decals.js` | Live | Bound decal gizmo host; legacy internal ID retained for tested parity. |
| HF UI | `expanded-ui-scroll-guards` | `HeroForge_UI/Expanded_UI_Scroll_Guards.js` | Live / hidden | Scoped Decals scroll/resize behavior. |
| HF UI | `hf-ui-scroll-split-safe` | `HeroForge_UI/HF_UI_Scroll_Split_Safe.js` | Live / hidden | Split-layout scroll safety. |
| HF UI | `hf-ui-slot-bridge` | `HeroForge_UI/HF_UI_Slot_Bridge.js` | Live / hidden | Conditional expanded decal-slot bridge. |
| HF UI | `corrected-bound-decal-gizmo` | `HeroForge_UI/Corrected_Bound_Decal_Gizmo.js` | Live / hidden | Stable corrected projector-centered bound decal gizmo, including validated undo/redo and transform-state preservation. |

## Photo Booth True Resolution

Feature ID: `media.screenshot-resolution`.

Validated source baseline: HeroForge.Compatibility standalone v0.6 on `heroforge07.1.9.98`.

Public behavior:

- intercepts only square 4096 and 8192 `BT.maker.takeScreenshot` calls;
- leaves all other capture sizes untouched;
- TRUE 4K uses one genuine 4096 Effects source;
- TRUE 8K uses four shifted 4096 Effects sources covering the complete native 64-phase 8K lattice;
- does not allocate an 8192 WebGL Effects target;
- preserves HeroForge's native Booth compositor and staging;
- temporarily wraps named `CK.Effects.renderToCanvas` only during repaired capture;
- restores owned runtime methods after capture/disable where ownership remains intact;
- passes through a future already-native full-resolution Effects path;
- current Lob/ADP may remain installed and supply the visible HeroForge 4096/8192 choices; Witch Dock repairs those requests downstream;
- without Lob, Witch Dock direct TRUE 4K/TRUE 8K buttons remain available;
- Lob-absent injection into HeroForge's own resolution selector remains a future adapter rather than part of the stable capture engine.

Detailed record: `HISTORY/BULLSHIT/PHOTO_BOOTH_TRUE_RESOLUTION.md`.

## Bound Decal Gizmo

Feature ID: `decals.gizmo.bound-correction`.

Current stable service build: `1.1.0-stable-undo-transform-preserve`.

Validated behavior includes projector-centered Move/Rotate/Scale, native floor/origin Transformer suppression, Move/Rotate/Scale undo-redo, Project state preservation, artwork-swap transform preservation, and signature-gated fresh-slot bad-default normalization. Unequal Project-OFF visible scaling, exact artwork-center polish, and corrected projector wireframe/bounding-box display remain deferred.

Detailed record: `HISTORY/BULLSHIT/BOUND_DECAL_GIZMO.md`.

## Current Integration Rules

- `Witch_Scripts` is production; experimental development occurs on separate branches/modules first.
- Public Witch Dock must not depend on `HeroForge.Compatibility/main`, HF-Chat-Bridge, or an unstable future Foundation head at runtime.
- Validated Compatibility features may be promoted as self-contained public modules after Dev integration testing and explicit approval.
- When Foundation exists, public consumers should use pinned/versioned stable Foundation releases.
- Do not merge diverged Dev branches wholesale into production; promote only the accepted feature delta.
- Preserve runtime capability checks, lifecycle restoration, timing/state sequencing, and failure isolation.

## Current Near-Term Queue

1. Perform a clean public smoke test of `media.screenshot-resolution` with temporary standalone/Dev test scripts disabled.
2. Add Lob-absent 4096/8192 injection into HeroForge's native Photo Booth resolution UI only after the current UI lifecycle is probed and a non-bundle-patch adapter is validated.
3. Continue Photo Mode WEBP/spin capture investigation separately from still-image true-resolution capture.
4. Continue planned Foundation/shared compatibility design; do not make public Stable depend on an unstable development head.
5. Keep Persistent Booth and corrected bound decal gizmo isolated from unrelated refactors.

## Durable Records

- `PRE_FLIGHT_Check.md` — current pre-flight decision; older entries preserved in Git history.
- `CHANGELOG.md` — current release entry; older entries preserved in Git history.
- `HISTORY/BULLSHIT/PHOTO_BOOTH_TRUE_RESOLUTION.md` — true-resolution still capture architecture/validation.
- `HISTORY/BULLSHIT/BOUND_DECAL_GIZMO.md` — corrected bound decal gizmo record.
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md` — broader Booth/render/export history.
- `HISTORY/Bullshit_Bible.md` — fragile HeroForge behavior index.

Historical detailed master state through public commit `1712b0ba24c8303d8d446d88cdf66199978045e7` remains preserved in Git history.
