# Booth Runtime Bootstrap

Date: 2026-09-07
Feature ID: `booth.runtime-bootstrap`
Status: Dev candidate; duplicate-runtime/Spinny correctness live validated, final human flash gate pending
Version: 0.1.1
Build: `0.1.1-dev-native-loader-coordination`
Live verified HeroForge build on 2026-09-08 clean reload: `heroforge06.1.9.98` (prior investigation sessions observed `heroforge07.1.9.98`)

## Purpose

Close the remaining fresh-page startup gap for saved Booth Persistence without broadening the already-large Booth tool or depending on minified HeroForge implementation details, while coordinating with HeroForge's own lazy Booth loader so only one native Booth runtime exists.

## Confirmed failure

Fresh HeroForge startup does not expose `window.BT`. HeroForge loads its gated Booth core later, normally when Photo Booth is needed.

Booth v27 improved runtime handling, but `readSavedBoothConfig()` still checks `CK.data.custom` only inside a BT-gated branch. That creates a circular dependency:

1. saved Booth Persistence is ON;
2. the figure already owns saved Photo Booth configuration in `CK.data.custom`;
3. Witch Dock needs that saved configuration to know Booth should be restored;
4. v27 refuses to inspect it until BT exists;
5. BT does not exist because Booth has not yet been activated.

The user reproduced the result on current public v27 after the stale-manifest issue was cleared: Booth Persistence and Black Canvas defaults were ON but neither restored automatically.

## Prior runtime proof

The standalone bootstrap probe established:

- loading HeroForge's own same-origin `/gated/booth.js?version=<current-build>` creates `BT`;
- `boothui.js` is not required for this runtime activation;
- `BT.setBoothMode(savedMode)` is a named native seam that initializes/activates the Booth runtime;
- the active engine becomes available through named `BT.liveEngine || BT.maker`;
- the probe successfully restored the saved Booth/Black Canvas path without visiting native Photo Booth first.

This module integrates that already-proved behavior rather than introducing a new speculative seam.

## Eligibility

The bootstrap acts only when the existing saved default `kw.witchDock.booth.consent.v1` is ON.

It independently reads `CK.data.custom` and considers these strong saved Booth signals:

- `cameraSave`;
- `lighting`;
- `effects`;
- `filters.tokenBg`;
- `filters.tokenFrame`;
- `selected.tokenBg`;
- `selected.tokenFrame`.

Bare `camera` state is deliberately insufficient. This preserves the intended `+ New Figure` behavior because ordinary camera state alone does not prove the figure has ever had a Photo Booth setup.

## Figure settling guard

HeroForge can replace `CK.data` while the loaded figure settles. The module therefore requires four consecutive observations, 200 ms apart, with the same:

- `CK.data` object identity;
- saved mode;
- strong-signal signature.

Any data generation or eligibility change resets the count.

## Native runtime bootstrap

When eligibility is stable:

1. If named `BT.setBoothMode` already exists, reuse it and do not inject another script.
2. Otherwise discover the current HeroForge build string from existing loaded script/resource `?version=heroforge...` URLs.
3. Resolve the exact same-origin `/gated/booth.js?version=<current-build>` path and look for any existing matching script regardless of ownership.
4. If a matching HeroForge/Witch Dock Booth script already exists, wait for named `BT.setBoothMode` rather than adding another one.
5. If no matching script exists, request one using HeroForge's observed lazy-script contract: relative `src` attribute, BODY parent, async execution, and `data-status=loading/loaded/error` lifecycle.
6. Wait up to 12 seconds for named `BT.setBoothMode`.
7. Call `BT.setBoothMode(savedMode)`.
8. Verify `BT.liveEngine || BT.maker` exists and reports `enabled`.
9. Refuse to mark bootstrap complete if more than one matching Booth script is present.
10. Wait for the existing Witch Dock `KW_WD_BOOTH` API.
11. Reconcile the saved defaults through that API: default-owned Booth View ON and Black Canvas ON when their stored defaults require them.

No Webpack discovery, compiled-string matching, bundle rewriting, or minified local identifier is used.

## Lifecycle and failure isolation

Global diagnostic/API: `KW_WD_BOOTH_BOOTSTRAP`.

Exports:

- `getState()`;
- `dispose()`.

The module owns only its polling/timers and the script element it may request. It does not monkey-patch HeroForge methods.

`getState()` v0.1.1 additionally exposes the requested Booth script path/URL, loader strategy, matching Booth script count, duplicate count, and compact script topology.

`dispose()` stops module-owned polling and resets observation state. It does not attempt to unload HeroForge's native Booth core once HeroForge has initialized it; reverting that native runtime mid-session is not a safe owned operation. A page refresh is the clean unload boundary.

Failure to load/resolve the native Booth runtime or detection of an unexpected duplicate records diagnostics and leaves ordinary HeroForge behavior intact. No dependent Witch Dock feature is intentionally taken down.

## Static validation

### Saved figure

Mock contained a stable `custom.portrait` with cameraSave/lighting/effects/token-background signals.

Result:

- four-stable-observation gate: PASS;
- HeroForge build discovery: PASS;
- generated native Booth URL/path: PASS;
- `BT.setBoothMode('portrait')`: PASS;
- engine enabled verification: PASS;
- Black Canvas default reconciliation: PASS;
- bootstrap count exactly one: PASS.

### Fresh figure

Mock contained only ordinary `custom.portrait.camera` data.

Result:

- eligible saved config: false;
- script insertions: zero;
- bootstrap attempts: zero.

## Dev integration

Manifest ID: `booth-runtime-bootstrap`.

Load order is before `booth-tool`, allowing its observation loop to begin while the normal Booth v27 module loads. Booth v27 itself remains byte-unchanged by the v0.1.1 loader-coordination repair.

Dev manifest registry and raw module URL identify bootstrap v0.1.1/build `0.1.1-dev-native-loader-coordination`. The Dev loader's cache keys keep that identity separate from prior v0.1.0 content.

## Live gate

With Dev loader only:

1. Load a saved Booth figure with Booth Persistence and Black Canvas defaults enabled.
2. Refresh HeroForge without manually opening Photo Booth.
3. Bootstrap must restore Booth and Black Canvas using exactly one Booth runtime/script.
4. Native screenshot capture must remain non-black.
5. Spinny 1024 and 2048 short tests must produce valid animated WebPs with non-black source frames.
6. A native character rebuild must not create duplicate Booth scripts/overlay trios.
7. The known Booth/Kitbash white-flash action must remain visually flash-free.
8. A fresh `+ New Figure` with no saved Booth setup must not auto-bootstrap Booth.

Do not promote this module to Stable until the remaining human visual flash gate passes and the separate public loader/cache promotion is reviewed.

## 2026-09-07 integrated Dev result

Live integrated Dev validation confirmed the bootstrap's primary job works: refreshing a figure with saved Booth setup while Booth Persistence and Black Canvas defaults were enabled automatically created/activated the native Booth runtime and restored Booth/Black Canvas without manually opening Photo Booth.

The subsequent `+ New Figure` failure was not a bootstrap eligibility failure. BT was already present from the first figure, so control returned to Booth v27's own saved-config detector, which still accepted bare `cfg.camera`. That consumer-side mismatch is corrected in Booth v27.0.1.

## 2026-09-08 duplicate Booth runtime / black Spinny diagnosis

Public Witch Dock 1.2.1 reproduced black/empty Spinny downloads at both 1024 and 2048 and renewed Booth/Kitbash flashing. HF-Chat-Bridge tracing separated the capture pipeline stage by stage:

- the WebP muxer received successfully encoded frames, but the source frames were implausibly tiny and visually black;
- direct native `BT.maker.takeScreenshot(1024,1024)` sampled as 100% opaque black;
- disabling Witch Dock's True Resolution provider did not change the failure;
- temporarily disabling Black Canvas did not change the failure;
- direct `CK.Effects.renderToCanvas()` with the current Booth camera and with HeroForge's own temporary screenshot camera both produced valid figure renders;
- the destructive transition occurred in HeroForge's native 2D Booth compositor after the good model image was already present;
- the auxiliary frame/overlay capture returned opaque black even with the current frame/background/shadow/character/environment visibility intentionally disabled and renderer clear alpha at zero;
- a scene traversal found another effectively visible top-level `TokenBackground` mesh not owned by current `BT.display.overlays`;
- `CK.scene` contained two complete `TokenBackground / TokenShadow / TokenFrame` trios;
- the DOM contained two identical `/gated/booth.js` script tags: one inserted by Witch Dock bootstrap and one later inserted by HeroForge;
- the current `BT.display.overlays` UUIDs belonged to the second trio, proving the first trio was orphaned;
- hiding/removing only the orphan `TokenBackground`/overlay trio made native screenshot capture healthy immediately.

This proves the empty WebP was not a WebP or high-resolution bug. It was a duplicate native Booth runtime created by loader ownership mismatch.

## 2026-09-08 v0.1.1 live validation

A clean Dev reload with v0.1.1 on live build `heroforge06.1.9.98` produced:

- bootstrap version/build: PASS (`0.1.1` / `0.1.1-dev-native-loader-coordination`);
- bootstrap attempts/count: one;
- matching Booth scripts: one;
- duplicate Booth scripts: zero;
- script contract: relative `/gated/booth.js?...` `src`, BODY parent, `data-status=loaded`;
- scene overlays: exactly three, all matching current `BT.display.overlays` UUIDs;
- native 1024 screenshot: non-black PASS;
- Spinny 1024 short test: 16/16 rendered + encoded, parsed 1024x1024 / 16 frames / 40 ms each, ~978,702 bytes, rotation restored;
- Spinny 2048 short test: 16/16 rendered + encoded, parsed 2048x2048 / 16 frames / 40 ms each, ~2,521,512 bytes, rotation restored;
- after a native `CK.character.refresh()` rebuild: one Booth script and three current overlays only;
- automated 120-frame outer-framebuffer sampling around the refresh path: zero white/bright spike frames, no refresh/sample error.

The short-test runtime also exposed a separate performance concern, not part of this repair: approximately 42.4 seconds for 16 native 1024 frames and 110.4 seconds for 16 native 2048 frames on the current complex figure. Capture optimization remains a separate investigation.

Final human visual confirmation of the Booth/Kitbash flash path remains pending because the framebuffer sampler intentionally does not claim full coverage of central/UI presentation.