# Booth Runtime Bootstrap

Date: 2026-09-07
Feature ID: `booth.runtime-bootstrap`
Status: Public Stable; v0.1.1 Dev validated before promotion, final public smoke pending
Version: 0.1.1
Build: `0.1.1-dev-native-loader-coordination`
Current live-verified HeroForge build: `heroforge06.1.9.98` on 2026-09-08 clean Dev reload; bootstrap derives build dynamically.

## Purpose

Close the fresh-page startup gap for saved Booth Persistence without broadening the already-large Booth tool or depending on minified HeroForge implementation details, while coordinating with HeroForge's own lazy Booth loader so only one native Booth runtime exists.

## Confirmed original startup failure

Fresh HeroForge startup does not expose `window.BT`. HeroForge loads its gated Booth core later, normally when Photo Booth is needed.

Booth v27 improved runtime handling, but `readSavedBoothConfig()` still checks `CK.data.custom` only inside a BT-gated branch. That creates a circular dependency:

1. saved Booth Persistence is ON;
2. the figure already owns saved Photo Booth configuration in `CK.data.custom`;
3. Witch Dock needs that saved configuration to know Booth should be restored;
4. v27 refuses to inspect it until BT exists;
5. BT does not exist because Booth has not yet been activated.

The user reproduced the result on public v27 after the stale-manifest issue was cleared: Booth Persistence and Black Canvas defaults were ON but neither restored automatically.

## Prior runtime proof

The standalone bootstrap probe established:

- loading HeroForge's own same-origin `/gated/booth.js?version=<current-build>` creates `BT`;
- `boothui.js` is not required for this runtime activation;
- `BT.setBoothMode(savedMode)` is a named native seam that initializes/activates the Booth runtime;
- the active engine becomes available through named `BT.liveEngine || BT.maker`;
- the probe successfully restored the saved Booth/Black Canvas path without visiting native Photo Booth first.

This module integrates that already-proved behavior rather than introducing a speculative seam.

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

## Native runtime bootstrap — v0.1.1

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

## 2026-09-07 integrated Dev result

Live integrated Dev validation confirmed the bootstrap's primary startup job works: refreshing a figure with saved Booth setup while Booth Persistence and Black Canvas defaults were enabled automatically created/activated the native Booth runtime and restored Booth/Black Canvas without manually opening Photo Booth.

The subsequent `+ New Figure` failure was not a bootstrap eligibility failure. BT was already present from the first figure, so control returned to Booth v27's own saved-config detector, which still accepted bare `cfg.camera`. That consumer-side mismatch was corrected in Booth v27.0.1.

## 2026-09-07 Stable promotion

The exact validated Dev v0.1.0 runtime blob `3aaa110b4f09ab74df524e64056406b571357474` was promoted as hidden public module `booth-runtime-bootstrap`, ordered before `booth-tool`. It remained gated by the saved Booth Persistence default and strong saved Photo Booth signals; bare camera state remained insufficient. The module used HeroForge's own same-origin `/gated/booth.js` plus named `BT.setBoothMode()` and did not create a public dependency on HF-Chat-Bridge or HeroForge.Compatibility main.

## 2026-09-08 duplicate-runtime / black Spinny diagnosis

Public Witch Dock 1.2.1 later reproduced black/empty Spinny downloads and renewed Booth/Kitbash flashing.

HF-Chat-Bridge tracing established:

- native `BT.maker.takeScreenshot(1024,1024)` itself returned fully opaque black frames;
- disabling Witch Dock True Resolution did not repair it;
- temporarily disabling Black Canvas did not repair it;
- direct `CK.Effects.renderToCanvas()` with the current Booth camera and HeroForge's own temporary screenshot camera both produced valid figure renders;
- the destructive transition occurred inside HeroForge's native Booth compositor after the good model image was already present;
- `CK.scene` contained two complete `TokenBackground / TokenShadow / TokenFrame` trios;
- the DOM contained two matching `/gated/booth.js` tags: one inserted by the bootstrap and one later loaded by HeroForge's native lazy loader;
- current `BT.display.overlays` owned only the second trio, proving the first trio was orphaned;
- the orphan `TokenBackground` survived HeroForge's screenshot hide sequence and painted opaque black over the capture;
- removing only the proven orphan trio immediately restored healthy native screenshot output.

HeroForge's own lazy script contract was observed directly: relative Booth `src`, BODY parent, async execution, and `data-status` lifecycle. The clean Dev page also showed current versioned HeroForge resources on `heroforge06.1.9.98`; the bootstrap continues to derive this dynamically.

## v0.1.1 Dev repair and live validation

Dev bootstrap v0.1.1 / build `0.1.1-dev-native-loader-coordination` changes only native loader coordination and diagnostics; the existing persistence behavior/timing remains intact.

Live validation on a clean Dev reload:

- bootstrap loaded/runs exactly once: PASS;
- one Booth script, zero duplicates: PASS;
- one `TokenBackground / TokenShadow / TokenFrame` trio, all UUIDs matching current `BT.display.overlays`: PASS;
- native 1024 screenshot non-black: PASS;
- automated Spinny 1024 short test: PASS;
- automated Spinny 2048 short test: PASS;
- Amanda's all-three-resolution real capture smoke: PASS;
- native character refresh retained one Booth script/current overlay trio: PASS;
- automated 120-frame outer-framebuffer white-spike sampler: zero white/bright spike frames: PASS;
- Amanda visual Booth/Kitbash white-flash check: PASS, flashing gone.

Capture performance remains a separate investigation; this repair is correctness/lifecycle only.

## 2026-09-08 v0.1.1 Stable promotion

Public Stable promotes the exact Dev runtime blob `45f8833f89ec2226a2611c8873a3548fb6008d4c` and updates only the public bootstrap manifest identity/cache key. Booth v27.0.4, Black Canvas replay v0.1.5, Spinny, True Resolution, Utilities, gizmo, JSON, Developer Mode, Body, Pose, Decals, and shell v1.2.1 remain byte-unchanged.

Final public smoke remains required after branch movement; one short capture plus the previously failing Booth/Kitbash transition is sufficient because the exact runtime already passed Dev.
