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
- Maintained feature services may live under `/features/` while future shared Foundation extraction is pending

Public Stable v1.1.0 adds the validated Spinny Mini animated-WebP feature and the privileged download host required by that feature. It does not promote the diverged `WITCH_DEV_UI` branch wholesale.

## Live Feature Inventory

| Area | Manifest ID | File | Status | Notes |
|---|---|---|---|---|
| Core | n/a | `Witch_Dock.user.js` | **Live v1.1.0** | Floating dock shell, manifest loader, shared UI, storage, undo/redo, footer utilities, compact emblem launcher, privileged Blob download host. |
| Body | `body-editor` | `tools/Body_Editor.js` | Live | Body editing/symmetry workflows. |
| Pose | `pose-tool` | `tools/Pose.js` | Live | Figure Main/Extra swap workflow. |
| Booth persistence | `booth-tool` | `tools/Booth.js` | Live | Current build `v24`; Persistent Booth, lighting/effects/overlay/background persistence, Black Canvas. |
| Photo Booth true resolution | `photo-booth-true-resolution` | `features/media/Photo_Booth_True_Resolution.js` | **Live / Stable validated** | `media.screenshot-resolution`; true 4K and grouped low-pressure true 8K provider plus direct Booth-tab buttons. |
| Photo Booth UI readiness | `photo-booth-true-resolution-readiness` | `HeroForge_UI/Photo_Booth_True_Resolution_Readiness.js` | **Live / Stable validated / hidden** | Keeps direct 4K/8K buttons synchronized when Photo Booth becomes ready after provider initialization. |
| Spinny service | `spinny-mini-webp` | `features/media/Spinny_Mini_WebP.js` | **Live / Stable promoted; public smoke pending** | `media.spinny-mini-webp` v0.5.1; 1024/2048 native frame source, TRUE-3K 3072 repair, Pause/Resume, cancel, ETA, interaction guards, animated-WebP mux and confirmed download host. |
| Spinny UI | `spinny-mini-webp-ui` | `features/media/Spinny_Mini_WebP_UI.js` | **Live / Stable promoted; public smoke pending** | Booth-tab controls plus shared-state draggable popout; public resolution labels are 1024px/2048px/3072px. Short Test remains hidden in ordinary public mode. |
| JSON | `json-tool` | `tools/JSON_Tool.js` | Live | Bulk JSON library backup. |
| Utilities | `utilities` | `tools/Utilities.js` | Live | User-facing controls for optional HF UI helpers. |
| Decals | `decals-dev` | `tools/Decals.js` | Live | Bound decal gizmo host; legacy internal ID retained for tested parity. |
| HF UI | `expanded-ui-scroll-guards` | `HeroForge_UI/Expanded_UI_Scroll_Guards.js` | Live / hidden | Scoped Decals scroll/resize behavior. |
| HF UI | `hf-ui-scroll-split-safe` | `HeroForge_UI/HF_UI_Scroll_Split_Safe.js` | Live / hidden | Split-layout scroll safety. |
| HF UI | `hf-ui-slot-bridge` | `HeroForge_UI/HF_UI_Slot_Bridge.js` | Live / hidden | Conditional expanded decal-slot bridge. |
| HF UI | `corrected-bound-decal-gizmo` | `HeroForge_UI/Corrected_Bound_Decal_Gizmo.js` | Live / hidden | Stable corrected projector-centered bound decal gizmo, including validated undo/redo and transform-state preservation. |

## Spinny Mini WebP

Feature ID: `media.spinny-mini-webp`.

Public Stable service version: `0.5.1`; build `0.5.1-witch-dock-stable-download-scroll-guard`.
Public Stable UI version: `0.1.1`; build `0.1.1-stable-download-ux`.
Compatibility target: `heroforge07.1.9.98`.

Validated behavior promoted from standalone -> Witch Dock Dev -> Stable review:

- 1024 and 2048 use native `BT.maker.takeScreenshot` frame production;
- 3072 uses the validated TRUE-3K `CK.Effects.renderToCanvas` phase-feed repair rather than HeroForge's blurry native 3072 source path;
- Standard / Slow / Slower / Very Slow retain 40 ms per-frame animation timing while slower rotations use more angular samples;
- frame-boundary Pause/Resume works without leaving a partial TRUE-3K wrapper installed;
- cancel while active or paused restores capture state;
- paused wall-clock time is excluded from active ETA accounting;
- camera/canvas and Booth-state interaction guards protect animation continuity;
- wheel/scroll during capture is silently suppressed without a warning modal;
- other continuity-invalidating interactions retain the Keep Capture / Cancel Capture warning;
- draggable popout shares the same service/control state as the docked UI;
- dropdowns use public labels `1024px`, `2048px`, `3072px` and dark option styling;
- public downloads use the userscript-level `GM_download` host and wait for success/error callbacks rather than relying on a silent page-anchor click;
- public UI keeps the 16-frame Short Test diagnostic hidden because Developer Mode is not part of this Stable promotion;
- 4096 animated WebP remains explicitly deferred.

Final integrated Dev re-smoke on 2026-09-06: download successful; silent scroll block successful; user reported the integrated feature works perfectly. The optional transient in-panel download-complete flash was not observed and is not a Stable acceptance gate because browser download confirmation and the privileged download callback are authoritative.

Detailed record: `HISTORY/BULLSHIT/SPINNY_MINI_WEBP.md`.

## Photo Booth True Resolution

Feature ID: `media.screenshot-resolution`.

Validated source baseline: HeroForge.Compatibility standalone v0.6 on `heroforge07.1.9.98`.

Public behavior remains unchanged by Spinny v1.1.0. The still provider continues to intercept only square 4096 and 8192 requests; all lower sizes including Spinny 1024/2048/3072 remain outside that owning provider boundary.

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
- Do not merge diverged Dev branches wholesale into production; promote only the accepted feature delta.
- Preserve runtime capability checks, lifecycle restoration, timing/state sequencing, and failure isolation.
- Spinny does not displace the existing 4096/8192 still-provider ownership of `BT.maker.takeScreenshot`.

## Current Near-Term Queue

1. Perform one clean public Stable Spinny smoke after userscript update/permission approval; do not reopen standalone/Dev investigation unless a regression appears.
2. Keep 4096 animated WebP deferred until a separately validated explicit frame path can coexist with the still provider.
3. Continue planned Foundation/shared compatibility design without making public Stable depend on an unstable development head.
4. Keep Persistent Booth, true-resolution still capture, and corrected bound decal gizmo isolated from unrelated refactors.
5. Compact High Res UI, Developer Mode, module-registry work, and other `WITCH_DEV_UI` changes remain separate Dev work and are not implicitly promoted by v1.1.0.

## Durable Records

- `PRE_FLIGHT_Check.md` — current pre-flight decision; older entries preserved in Git history.
- `CHANGELOG.md` — current release/validation entry; older entries preserved in Git history.
- `HISTORY/BULLSHIT/SPINNY_MINI_WEBP.md` — Spinny architecture, validation and public promotion record.
- `HISTORY/BULLSHIT/PHOTO_BOOTH_TRUE_RESOLUTION.md` — true-resolution still capture architecture/validation.
- `HISTORY/BULLSHIT/BOUND_DECAL_GIZMO.md` — corrected bound decal gizmo record.
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md` — broader Booth/render/export history.
- `HISTORY/Bullshit_Bible.md` — fragile HeroForge behavior index.

Historical detailed master state through public Stable v1.0.8 remains preserved in Git history.
