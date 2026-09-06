# Spinny Mini WebP

Feature ID: `media.spinny-mini-webp`
Public status: **Witch Dock Stable promoted / public smoke pending**
Last verified HeroForge build: `heroforge07.1.9.98`
Standalone source baseline: `Knight-Witch/HeroForge.Compatibility` v0.5.0
Public service: `features/media/Spinny_Mini_WebP.js` v0.5.1
Public UI: `features/media/Spinny_Mini_WebP_UI.js` v0.1.1

## Purpose

Provide high-quality animated Spinny Mini WebP export without Lob's brittle compiled-bundle GIF patching, while supporting higher resolution, slower rotations, safe Pause/Resume, continuity protection and a Witch Dock-hosted download boundary.

## Public architecture

```text
Spinny Witch Dock UI
    ↓
Spinny service
    ↓
rotation + display refresh sequencing
    ↓
frame-source adapter
    ├── 1024 / 2048: BT.maker.takeScreenshot
    └── 3072: TRUE-3K CK.Effects phase-feed repair
    ↓
browser static WebP encode per frame
    ↓
project-owned RIFF animated-WebP mux
    ↓
parser validation
    ↓
WitchDock.downloadBlob -> GM_download
```

No HeroForge bundle patch is used. Compressed WebP frame payloads are retained until final assembly; raw RGBA is not accumulated for the full animation.

## Resolution behavior

### 1024 / 2048

Use HeroForge's native `BT.maker.takeScreenshot(size,size)` frame path.

### 3072 TRUE-3K

Native HeroForge 3072 was rejected because runtime tracing showed a structurally 3072 final capture sourced from repeated 768px Effects phase renders, producing visibly blurred/upscaled detail.

The maintained repair temporarily wraps matching `CK.Effects.renderToCanvas` requests during one explicit 3072 frame, renders one genuine 3072x3072 Effects source, derives the native compositor's requested phase canvases from that source, validates phase topology/completeness, and restores the exact original Effects method after every frame.

The repair never takes ownership of `BT.maker.takeScreenshot`. Existing public true-resolution still capture therefore retains ownership of square 4096/8192 requests.

## Rotation profiles

All profiles encode at 40 ms/frame / 25 FPS. Slower rotations add angular samples rather than repeating frames:

- Standard: 250 frames / 10 s;
- Slow: 375 frames / 15 s;
- Slower: 500 frames / 20 s;
- Very Slow: 750 frames / 30 s.

## Pause / Resume

Pause is honored only at a completed encoded-frame boundary. The current frame finishes, temporary TRUE-3K state is already restored, and no next angular sample begins until resume. Compressed frames remain retained. Cancel while paused releases the waiter and proceeds through normal restoration. Paused wall-clock time is tracked separately from active ETA.

## Interaction guards

While capture is active or paused, Spinny-owned controls remain usable and HeroForge actions that could invalidate continuity are intercepted before mutation.

- camera/canvas pointer interaction: warning with Keep Capture / Cancel Capture;
- Photo Booth/state-changing UI interaction: warning with Keep Capture / Cancel Capture;
- wheel/scroll: silently suppressed with no popup, per final user-approved behavior;
- choosing Cancel cancels capture first and requires the user to repeat the intended action after cleanup;
- pointer sequences are not blindly replayed.

## Witch Dock UI

- visible under the Booth tab after the existing High Resolution Capture service;
- resolution choices display only `1024px`, `2048px`, `3072px`;
- dark select/option styling;
- Standard / Slow / Slower / Very Slow rotation selector;
- Capture / Pause-Resume / Cancel controls;
- progress and measured ETA;
- icon-only popout control with tooltip;
- draggable shared-state popout; closing returns the same controls to the dock;
- 16-frame Short Test remains in the service for diagnostics but is hidden in ordinary public Stable because Developer Mode is not promoted here.

## Download boundary

The first integrated Dev build successfully generated/muxed files but its page-context anchor click did not initiate a visible browser download. The accepted repair moved download ownership to the userscript shell:

- public `Witch_Dock.user.js` grants `GM_download`;
- `WitchDock.downloadBlob(blob, filename)` returns a Promise;
- Spinny awaits `GM_download` success/error/timeout callbacks;
- service diagnostics record download method/filename/confirmed state;
- only a confirmed userscript-host result receives status `downloaded`.

Final Dev re-smoke confirmed the WebP downloads correctly and appears in the browser's normal download UI.

An optional in-panel `Download complete` flash remains best-effort presentation; the user did not observe it in final smoke and explicitly did not consider that a problem. It is not part of the functional acceptance contract.

## Validation record

Standalone / pre-integration validation on `heroforge07.1.9.98` includes:

- 1024 Standard / 250 frames: PASS;
- 2048 Standard / 250 frames: PASS;
- 1024 Very Slow / 750 frames: PASS;
- 2048 Slower / 500 frames: PASS;
- 3072 Standard / 250 frames TRUE-3K: PASS;
- 3072 Slower / 500 frames TRUE-3K: PASS;
- 3072 Short Test / 16 frames: PASS;
- parser/mux, progress, ETA, repeat use, starting-rotation restoration and cancel: PASS;
- frame-boundary Pause/Resume at native 1024 and TRUE-3K 3072: PASS;
- cancel while paused and paused-time ETA accounting: PASS;
- camera/Booth guards and guard-triggered cancellation: PASS.

Integrated Witch Dock Dev validation:

- Booth placement: PASS;
- docked controls/popout shared state: PASS;
- popout movement/return: PASS;
- Pause/Resume/Cancel/guards: PASS;
- silent scroll suppression after final hardening: PASS;
- privileged WebP download after final hardening: PASS;
- user conclusion: everything works perfectly; explicit public rollout approval received.

## Excluded / deferred

- 4096 animated WebP remains deferred because public true-resolution still capture owns square 4096/8192 screenshot requests.
- Developer Mode is not promoted by this release.
- compact High Res UI is not promoted by this release.
- Dev module-registry work is not promoted by this release.
- HF-Chat-Bridge is not a runtime dependency.

## Revalidation triggers

Revalidate Spinny when:

- HeroForge screenshot tile topology changes;
- `CK.Effects.renderToCanvas` or capture-camera view geometry changes;
- display rotation/refresh sequencing changes;
- browser/userscript WebP or Blob download behavior changes;
- the public 4096/8192 provider ownership boundary changes;
- Pause or interaction-guard lifecycle changes;
- high-cost resource limits are observed on supported hardware.
