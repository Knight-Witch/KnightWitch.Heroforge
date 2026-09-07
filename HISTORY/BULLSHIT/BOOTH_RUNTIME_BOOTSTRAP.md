# Booth Runtime Bootstrap

Date: 2026-09-07
Feature ID: `booth.runtime-bootstrap`
Status: Dev candidate
Version: 0.1.0
Build: `0.1.0-dev-native-booth-bootstrap`
Target HeroForge build: `heroforge07.1.9.98`

## Purpose

Close the remaining fresh-page startup gap for saved Booth Persistence without broadening the already-large Booth tool or depending on minified HeroForge implementation details.

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
3. Insert one same-origin script element for `/gated/booth.js`, carrying that build version when found.
4. Wait up to 12 seconds for named `BT.setBoothMode`.
5. Call `BT.setBoothMode(savedMode)`.
6. Verify `BT.liveEngine || BT.maker` exists and reports `enabled`.
7. Wait for the existing Witch Dock `KW_WD_BOOTH` API.
8. Reconcile the saved defaults through that API: default-owned Booth View ON and Black Canvas ON when their stored defaults require them.

No Webpack discovery, compiled-string matching, bundle rewriting, or minified local identifier is used.

## Lifecycle and failure isolation

Global diagnostic/API: `KW_WD_BOOTH_BOOTSTRAP`.

Exports:

- `getState()`;
- `dispose()`.

The module owns only its polling/timers and the script element it may request. It does not monkey-patch HeroForge methods.

`dispose()` stops module-owned polling and resets observation state. It does not attempt to unload HeroForge's native Booth core once HeroForge has initialized it; reverting that native runtime mid-session is not a safe owned operation. A page refresh is the clean unload boundary.

Failure to load/resolve the native Booth runtime records diagnostics and leaves ordinary HeroForge behavior intact. No dependent Witch Dock feature is intentionally taken down.

## Static validation

### Saved figure

Mock contained a stable `custom.portrait` with cameraSave/lighting/effects/token-background signals.

Result:

- four-stable-observation gate: PASS;
- HeroForge build discovery: `heroforge07.1.9.98`;
- generated native URL: `/gated/booth.js?version=heroforge07.1.9.98`;
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

Load order is before `booth-tool`, allowing its observation loop to begin while the normal Booth v27 module loads. Booth v27 itself remains byte-unchanged.

Dev manifest URLs for the bootstrap, Booth v27, Black Canvas replay, and Utilities v1.2.1 include explicit version query keys. This prevents stale module-body responses after the current manifest has been obtained, but does not fix the separate fixed-manifest-URL cache issue in the Witch Dock userscript shell.

## Live gate

With Dev loader only:

1. Turn on Utilities `Enable Booth Persistence Across Sessions` and `Enable Black Canvas Across Sessions`.
2. Load a figure with an existing saved Photo Booth setup.
3. Refresh HeroForge without manually opening Photo Booth.
4. Booth View must restore automatically.
5. Black Canvas must be visibly black.
6. The known white-flash action must remain flash-free.
7. A fresh `+ New Figure` with no saved Booth setup must not auto-bootstrap Booth.

Do not promote this module to Stable until the live gate passes and the separate public loader cache-busting defect is repaired.
