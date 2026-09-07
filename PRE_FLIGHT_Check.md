# Pre-Flight Check Log

## PFC-2026-09-07-039 — Add Dev Booth runtime bootstrap

Date: 2026-09-07

### Required material reviewed

- binding HeroForge.Compatibility `PROJECT_CONTRACT.md`, `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, and `TESTING.md`;
- current Witch Dock Dev `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `manifest.json`, `tools/Booth.js` v27, `tools/Utilities.js` v1.2.1, and Black Canvas replay module;
- `HISTORY/BULLSHIT/BOOTH_V27_STABILIZATION.md` and the prior standalone Booth bootstrap investigation/results;
- current Dev head `12383ca5a551acb1a6bf330f7cfad8ea68a82ad1`;
- live public evidence after hard refresh confirming Booth v27 is actually loaded while saved Booth/Black Canvas startup still fails;
- live bridge evidence from the earlier bootstrap probe confirming same-origin HeroForge `/gated/booth.js` creates `BT` and named `BT.setBoothMode(savedMode)` successfully initializes/enables the Booth runtime.

### Confirmed findings

- fresh HeroForge startup has no `BT` global before Booth core is loaded;
- Booth v27 `readSavedBoothConfig()` still checks `CK.data.custom` only after an existing BT runtime is present;
- this creates a circular dependency: persistence needs saved config to justify Booth activation, but v27 refuses to inspect that saved config until Booth already exists;
- the user reproduced this on the current public v27 build: saved Booth Persistence and Black Canvas defaults were ON, yet neither restored at startup;
- the public stale-module issue is separate: after a hard refresh the page definitely loaded Booth v27, so the persistence failure is not a v24/cache artifact;
- HeroForge may replace `CK.data` while a figure is settling, so bootstrap eligibility must not be decided from one transient read;
- bare camera state must not qualify because a new figure can have ordinary camera data without a saved Photo Booth setup.

### Decision

Do not broaden the already-large Booth v27 tool. Add a separate hidden compatibility feature `booth.runtime-bootstrap` v0.1.0/build `0.1.0-dev-native-booth-bootstrap`.

The module:

- reads the existing `kw.witchDock.booth.consent.v1` default;
- inspects `CK.data.custom` independently of BT for strong saved Booth signals;
- excludes bare-camera-only figures;
- requires four consecutive 200 ms observations of the same `CK.data` object, mode, and signal signature;
- loads only HeroForge's own same-origin gated `booth.js` when BT is absent;
- derives the current HeroForge build from loaded script/resource URLs instead of hard-coding a minified bundle identity;
- requires named `BT.setBoothMode()` and uses the saved mode;
- verifies `BT.liveEngine || BT.maker` becomes enabled;
- then uses the existing `KW_WD_BOOTH` API to reconcile default-owned Booth View and Black Canvas;
- single-flights work, records diagnostics, and exposes `dispose()` to stop owned polling.

### Target files

- `features/booth/Booth_Runtime_Bootstrap.js` (new)
- `manifest.json`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/BULLSHIT/BOOTH_RUNTIME_BOOTSTRAP.md` (new)

### Conflict risks / preservation requirements

- `tools/Booth.js` must remain byte-unchanged at v27.0.0/build `v27`;
- `features/booth/Black_Canvas_Display_Replay.js` must remain byte-unchanged;
- `tools/Utilities.js` must remain byte-unchanged at v1.2.1;
- do not load HeroForge `boothui.js`;
- do not use Webpack/module/minified discovery when named `BT.setBoothMode` is available;
- do not bootstrap a camera-only/new figure;
- do not initialize when the persistence default is OFF;
- failure must degrade to ordinary unmodified HeroForge rather than suppressing model updates;
- public `Witch_Scripts` remains untouched until Dev validation.

### Static validation

- Node syntax check for `Booth_Runtime_Bootstrap.js`: PASS.
- Saved-figure mock: PASS. Four stable observations caused native `portrait` mode bootstrap, runtime enable verification, and saved Black Canvas reconciliation.
- Fresh-camera-only mock: PASS. Zero native script insertions and zero bootstrap attempts.
- Manifest entry is versioned in the same candidate and is ordered before `booth-tool` so polling can begin while the normal Booth tool loads.
- Dev-owned Booth/Utilities/replay URLs receive explicit version query keys in this manifest candidate to avoid stale module responses once the new manifest itself is obtained.
- The fixed manifest URL in the Dev/public shell remains a separate loader-cache problem and is not claimed fixed by this commit.
- No GitHub Actions workflow exists for this Dev branch; no CI claim is made.

### Live gate

Use the Dev userscript only. With Booth Persistence Across Sessions and Black Canvas Across Sessions ON, load a figure that already contains a saved Booth setup and refresh without manually opening Photo Booth. Expected result: Booth View restores and the viewport is black. Then verify the known flash-causing action remains flash-free and a fresh `+ New Figure` does not auto-bootstrap Booth.

Do not promote this module to Stable until the live gate passes. The separate public loader cache-busting repair must also be completed before public release.

**Runtime behavior changed:** yes, Dev only. Public Stable remains unchanged.

---

Historical pre-flight entries through PFC-2026-09-07-038 remain preserved in Git history at/before Dev commit `12383ca5a551acb1a6bf330f7cfad8ea68a82ad1`.
