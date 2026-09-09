# Witch Dock Master

This file tracks the current active state. Detailed historical state remains preserved in Git history.

## Current Branches

- Public Stable: `Witch_Scripts`
- Current public repository head before this Dev change: `f218244b2a6010e4d299ca5641a8d4f6f56f38f9`
- Dev integration branch: `WITCH_DEV_UI`
- Dev baseline before Black Canvas startup candidate: `6cf10845e394676344ebb8699c654009267c6c61`
- Live verified HeroForge build on the 2026-09-08 clean Dev reload: `heroforge06.1.9.98`; earlier investigation sessions observed `heroforge07.1.9.98`, so build identity is treated as runtime-discovered rather than hard-coded.
- HF-Chat-Bridge: private development diagnostics only; never a public runtime dependency.

## Booth duplicate-runtime / black Spinny repair — 2026-09-08

Feature ID: `booth.runtime-bootstrap`.

A public Witch Dock 1.2.1 session reproduced two apparently separate regressions: Spinny Mini WebP downloads were completely black/empty at both 1024 and 2048, and the previously closed Booth/Kitbash white-flash symptom was visible again.

Live bridge tracing confirmed a single root architectural defect below the WebP encoder:

- `BT.maker.takeScreenshot(1024,1024)` itself returned a fully opaque black image while direct `CK.Effects.renderToCanvas()` of the same Booth camera remained healthy;
- HeroForge's screenshot compositor rendered the model correctly, then composited a second frame/overlay render over it;
- that auxiliary render was opaque black because a top-level `TokenBackground` mesh remained visible even though the current Booth runtime hid its own background/frame/shadow set;
- `CK.scene` contained two complete `TokenBackground / TokenShadow / TokenFrame` trios;
- the page contained two identical `/gated/booth.js` scripts: Witch Dock bootstrap had manually inserted one, then HeroForge's native lazy loader inserted another later;
- `window.BT` referred to the second runtime, leaving the first runtime's overlay trio orphaned in the scene.

A reversible live recovery removed only the proven orphan trio. Native screenshots immediately became non-black, confirming the causal chain.

Dev bootstrap v0.1.1 / build `0.1.1-dev-native-loader-coordination` repairs the load boundary instead of patching Spinny or screenshot compositing. It preserves the existing four-stable-observation eligibility gate and named `BT.setBoothMode(savedMode)` activation, but now:

- reuses a matching Booth script already present regardless of whether Witch Dock or HeroForge created it;
- when it must request Booth itself, uses the native lazy-script contract observed in the live page: relative `/gated/booth.js?...` `src`, BODY ownership, async execution, and `data-status=loading/loaded/error` lifecycle;
- exposes script topology diagnostics;
- refuses to mark bootstrap complete if duplicate matching Booth scripts are detected.

Clean Dev validation on the live `heroforge06.1.9.98` page passed:

- bootstrap v0.1.1 loaded and ran exactly once;
- one Booth script only, with native-compatible relative `src`, BODY parent, and `data-status=loaded`;
- one `TokenBackground / TokenShadow / TokenFrame` trio only, and its UUIDs exactly matched `BT.display.overlays`;
- native 1024 screenshot contained normal figure image data;
- real Spinny 1024 short test: 16/16 rendered, 16/16 encoded, valid 1024x1024 animated WebP, ~979 KB, rotation restored, no download emitted by the bridge smoke;
- real Spinny 2048 short test: 16/16 rendered, 16/16 encoded, valid 2048x2048 animated WebP, ~2.52 MB, rotation restored, no download emitted by the bridge smoke;
- after both captures and a native `CK.character.refresh()` rebuild, script count remained one and overlay count remained three;
- a 120-animation-frame outer-framebuffer probe around the known refresh path recorded zero white/bright spikes and no probe errors.

The final human Booth/Kitbash visual flash check remains required because the automated framebuffer sampler cannot prove every possible central/UI presentation flash. Spinny performance remains a separate optimization investigation: the clean short tests measured about 2.65 s/frame at 1024 and 6.9 s/frame at 2048 on this complex figure, consistent with the user's complaint that the current capture path is too slow even when correct.

Public Stable remains unchanged until the Dev visual gate passes.

## Corrected Bound Decal Gizmo fresh-slot repair — 2026-09-08

Feature ID: `decals.gizmo.bound-correction`.

Dev candidate v1.1.1 changes only first-ever untouched Project-OFF normalization. The previous v0.4.2 detector still exists but no longer recognizes the currently visible HeroForge initializer (`Move 0/1.56/0`, `Scale 1.82/1.82/2`). The candidate retains the old confirmed profile, adds the current UI-observed profile with a tight matcher, and normalizes a matching `freshBind` to H/V `0/0` and S/SY `-1.5/-1.5`.

Move/Rotate/Scale behavior, undo/redo, known bound-state restoration, artwork-swap preservation, and fragments are unchanged. Dev now loads the gizmo from `WITCH_DEV_UI` for this gate instead of reusing the Stable URL. Exact current raw initializer floats remain unconfirmed because bridge request #752 did not return during the edit; live Dev acceptance is therefore required before Stable promotion.

## Dev Loader Cache Repair

Dev loader v0.5.1 / userscript header 1.0.8.6 gives every page a unique manifest request key and every module a deterministic request key derived from the matching `moduleRegistry` ID/version/build/path plus raw URL. Existing module URL query parameters are preserved.

This repairs the stale branch-based raw GitHub delivery path in Dev without changing module execution order, enablement, or feature runtime code. Public Stable still uses shell v1.2.0 and remains unchanged until Dev live validation.

Static syntax/JSON/cache-identity/blob-preservation gates pass. Live delivery smoke remains required.

## Active Booth Runtime Bootstrap Candidate

Feature ID: `booth.runtime-bootstrap`.

Dev module v0.1.1 / build `0.1.1-dev-native-loader-coordination` retains the v0.1.0 saved-Booth fresh-page bootstrap behavior and adds native loader coordination to prevent duplicate Booth runtimes.

The original confirmed startup root cause remains:

- a fresh HeroForge page has no `BT` global before HeroForge's gated Booth core is loaded;
- Booth v27 `readSavedBoothConfig()` still gates `CK.data.custom` inspection behind an existing BT runtime;
- saved Booth Persistence can therefore be ON while v27 cannot see the saved figure configuration that would justify creating BT.

Bootstrap behavior:

- reads only the existing saved Booth Persistence default key;
- independently inspects character-owned `CK.data.custom` for strong saved Booth signals;
- bare camera data is explicitly insufficient, preserving `+ New Figure` exclusion;
- requires four consecutive 200 ms observations of the same `CK.data` object, mode, and strong-signal signature before acting;
- reuses a matching live/native Booth script or live `BT` when available;
- otherwise requests HeroForge's same-origin `/gated/booth.js` using the current runtime-discovered HeroForge build and the native lazy-script DOM/status contract;
- requires named `BT.setBoothMode()` and calls the saved mode rather than using minified/runtime-private helpers;
- verifies the native Booth engine becomes enabled;
- reconciles the existing v27 Witch Dock API afterward so default-owned Booth View and saved Black Canvas become active;
- single-flights bootstrap work and exposes diagnostics/dispose through `KW_WD_BOOTH_BOOTSTRAP`;
- reports matching/duplicate Booth script topology and fails closed on an unexpected duplicate after bootstrap;
- does not unload or replace HeroForge runtime code on dispose.

Static v0.1.0 gates remain valid for eligibility/activation. Live v0.1.1 clean-reload topology, native screenshot, 1024 Spinny, 2048 Spinny, and post-refresh duplicate checks all pass. Final human Booth/Kitbash flash confirmation remains pending before Stable promotion.

Detailed record: `HISTORY/BULLSHIT/BOOTH_RUNTIME_BOOTSTRAP.md`.

## Black Canvas Display Replay

Feature ID: `booth.black-canvas-display-replay`.

- Dev candidate is v0.1.5 / build `0.1.5-dev-restore-before-booth-handoff`.
- It preserves the already live-validated post-`CK.character.display.update()` replay that eliminated the reliable white flash.
- It carries forward Public Stable v0.1.1's diagnostic Black Canvas state fallback, so Dev no longer drops that Stable behavior.
- When BT already exists, the validated semantic named `environment -> background` scene path remains preferred.
- Before BT exists, the candidate may use only `CK.environment.background.mesh.visible` as the conservative regular-scene fallback; that exact fresh-start visual mapping is a supported inference pending live Dev validation.
- Black Canvas alone does not bootstrap or enable Booth View.
- HeroForge native `CK.character.display.update()` remains untouched and always runs; replay occurs immediately after the update.
- Black Canvas OFF/dispose restores only replay-owned background visibility.
- Public Stable remains on replay v0.1.1 pending the final Dev smoke.

## Integrated Booth Lifecycle Smoke — 2026-09-07

The first combined startup smoke closed two gates and exposed two downstream lifecycle bugs.

Confirmed PASS:
- saved Booth figure refresh automatically bootstraps/restores Booth View;
- saved Black Canvas restores;
- the validated white-flash fix remains effective;
- Booth lighting/effects/overlay/background component toggles still work.

Confirmed FAIL before this repair:
- `+ New Figure` remained in default-owned Booth because Booth v27 still treated bare camera data as saved Booth;
- with Booth and Black Canvas OFF, the ordinary fantasy editor background could remain hidden, leaving white.

Dev v27.0.1 / replay v0.1.3 are the surgical candidate fixes. Black Canvas remains a separate persistent default: if Black Canvas Across Sessions is ON, a fresh figure may remain black, but it must not remain in Booth View or show the checkerboard Booth backdrop.

## Booth Presentation Follow-up — 2026-09-07

The v27.0.1 integrated lifecycle repair is live validated: startup restoration, `+ New Figure`, both shutdown orders, fantasy-background restoration, component toggles, and white-flash suppression all passed.

Remaining presentation-only failures before v27.0.2:

- persisted Booth View with Black Canvas OFF left HeroForge's gray 1:1 frame visible because current BT exposes the plane at `BT.display.overlays.framePlane` while the existing frame helper only checked `BT.display.framePlane`;
- turning Booth Background OFF could expose checkerboard because the Booth background plane was hidden correctly but the ordinary HeroForge editor environment remained in Booth-hidden state.

Live bridge probes proved HeroForge's named `BT.display.environment.setDefaultEnvironmentVisibility(true)` restores the ordinary background/ground state without re-enabling the Booth background plane. v27.0.2 uses that seam only when persisted Booth is active outside native Photo Booth, Black Canvas is OFF, and the regular editor background is actually hidden.

## Component-aware Black Canvas / Background Fallthrough — 2026-09-07

v27.0.2 live validation confirmed ordinary fantasy-canvas restoration when Black Canvas turns OFF. The remaining Black-ON/Background-OFF checkerboard is a separate composition problem: the Booth background plane is correctly OFF, but Black Canvas globally hides the regular environment beneath it.

Current HeroForge's gray outside-token overlay is not a usable runtime color seam: its shader literally writes 50% gray at 70% alpha outside UV `[0,1]`. Two reversible custom RawShaderMaterial matte probes both failed with WebGL `INVALID_OPERATION (1282)` and are rejected.

The maintained v27.0.3 approach uses HeroForge's named `BT.maker.getTokenViewOffset()` rectangle instead. Four pointer-inert black DOM bars live under `#character-canvas`, cover only the renderer outside the native crop, and update only when crop/canvas geometry changes. When this matte is available, Background OFF may reveal the fantasy environment inside the 1:1 crop while Black Canvas still owns black outside it. Failure falls back to the prior full-black behavior.

Replay v0.1.4 delegates full BT presentation to Booth through `reassertBlackCanvasPresentation()` after native `display.update()`; its pre-BT compatibility path is retained. The established white-flash timing boundary is unchanged.

## v27.0.3 Live Rejection / Environment Ownership Repair — 2026-09-07

Amanda's live v27.0.3 smoke rejected the `getTokenViewOffset()` DOM matte: it mapped to a tiny token/render crop rather than the visible editor 1:1 viewport. That implementation is removed in v27.0.4 and is not a maintained fallback.

The same smoke isolated the deeper environment problem. Any Booth component toggle could hide the pedestal/editor environment after Black Canvas OFF, because all component toggles shared a broad native overlay resize/refresh/applyVisibility redraw. Separately, replay v0.1.4 could hide the regular background mesh before BT existed and then drop its visibility snapshot without restoring it before Booth delegation, leaving the fantasy backdrop stranded hidden while ground/pedestal state returned.

v27.0.4 / replay v0.1.5 repair those ownership paths first. Component redraw is narrow, editor restoration checks the actual mesh/ground state rather than only the wrapper flag, and replay restores what it owns before Booth takes presentation ownership. The outer-black 1:1 matte is deliberately deferred until a correct frame-derived viewport seam is validated.

## Booth / Utilities

- Dev Booth: v27.0.4 / build `v27.0.4`.
- Dev Utilities: v1.2.1.
- Dev Booth runtime bootstrap: v0.1.1 / build `0.1.1-dev-native-loader-coordination`.
- The Booth runtime bootstrap and Black Canvas replay remain separate hidden compatibility features.
- Utilities continues to own saved defaults under `Booth Features`; Booth tab switches remain session overrides.
- Black Canvas Across Sessions and Booth Persistence Across Sessions remain conceptually separate: Black Canvas alone must not force Booth activation.

## Public Loader Cache Issue

A separate public-delivery defect is confirmed:

- `Witch_Dock.user.js` v1.2.0 requests branch-based raw GitHub manifest/module URLs without durable cache keys;
- a live public page remained on an intermediate Stable manifest for more than nine minutes after the branch advanced;
- hard refresh then loaded Booth v27 correctly, proving repository promotion was valid and the stale state was in the loader/cache path.

The corresponding repair is implemented in Dev only. Public shell v1.2.0 still requires a separate narrow v1.2.1 promotion after Dev live validation. Do not confuse this delivery issue with Booth runtime persistence.

## Protected Validated Features

The following remain outside this Dev change:

- `media.screenshot-resolution` — Witch Dock Stable validated TRUE 4K/8K;
- `media.spinny-mini-webp` — service code unchanged by the bootstrap repair; clean 1024/2048 short captures now pass once duplicate Booth runtime creation is prevented;
- `decals.gizmo.bound-correction` — Stable validated Move/Rotate/Scale + undo/redo/state preservation;
- JSON, Developer Mode, Decals host, tab ordering, High Res UI/service — unchanged by this Booth bootstrap repair.

## Current Gate

1. Human visual check: exercise the Booth menu and Kitbash actions that previously produced the white flash while Dev v0.1.1 is active. The automated 120-frame outer-framebuffer refresh probe passed, but visual confirmation is still required.
2. Keep the existing v27.0.4 Booth presentation/environment gates separate; this bootstrap repair does not claim to solve the deferred outer-black 1:1 matte problem.
3. If the visual flash check passes, the duplicate-runtime/black-Spinny defect is Dev validated and the bootstrap+manifest change can be reviewed for narrow Stable promotion.
4. Spinny performance optimization is a separate investigation; correctness is restored but current per-frame times remain unacceptably high for complex figures.
