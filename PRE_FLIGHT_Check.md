# Pre-Flight Check Log

## PFC-2026-09-07-045 — Repair Booth editor-environment ownership after v27.0.3 live failure

Date: 2026-09-07

### Reviewed

- binding HeroForge.Compatibility project contract, master, pre-flight, changelog, architecture, feature inventory, compatibility, ownership, and testing state;
- current Witch Dock Dev master/pre-flight/changelog/manifest;
- Booth v27.0.3, replay v0.1.4, bootstrap v0.1.0, and Booth/replay histories;
- Amanda's v27.0.3 screenshots and state-sequence report;
- prior bridge evidence for `setDefaultEnvironmentVisibility`, wrapper/mesh visibility mismatch, frame UV/resize geometry, and rejected WebGL matte probes;
- current Dev head `ca27025e137049640e50b68d98d9cdca70ed59a8`.

### Confirmed findings

- `BT.maker.getTokenViewOffset()` does not describe the visible editor 1:1 Booth viewport; the v27.0.3 DOM matte is visually wrong and rejected;
- all Booth sub-toggles share the broad native overlay refresh sequence, matching the user's observation that any of Lighting/Effects/Overlays/Background can knock the editor environment back out;
- regular environment wrapper visibility and actual background mesh visibility can disagree;
- replay v0.1.4 drops its pre-BT semantic-background ownership without restoring the owned mesh before Booth delegation;
- Black Canvas ON -> OFF restoring pedestal/ground but not the fantasy backdrop is consistent with those separate ownership paths.

### Decision

First restore deterministic environment ownership. Remove the bad matte, narrow component redraw behavior, gate editor restoration on actual render/environment state, and restore replay-owned visibility before Booth handoff. Do not solve the outer-black crop in this candidate; return to that only after environment/component behavior is live stable.

### Target files

- `tools/Booth.js`
- `features/booth/Black_Canvas_Display_Replay.js`
- `manifest.json`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/BULLSHIT/BOOTH_V27_STABILIZATION.md`
- `HISTORY/BULLSHIT/BOOTH_BLACK_CANVAS_DISPLAY_REPLAY.md`

### Conflict risks / preservation requirements

- remove all v27.0.3 DOM matte state/DOM nodes and `getTokenViewOffset()` usage;
- preserve named native environment setter and existing component state application;
- do not call broad overlay resize/refresh/applyVisibility from component-toggle redraw;
- preserve layout/timing behavior elsewhere unless directly required by this repair;
- preserve native `CK.character.display.update()` and synchronous replay timing;
- replay must restore only visibility it previously owned before Booth handoff;
- do not touch bootstrap, Utilities, loader, Spinny, High Res, gizmo, JSON, Developer Mode, Decals, or Public Stable.

### Static gate

Booth/replay JavaScript syntax, manifest JSON/version/cache identity, absence of DOM matte/getTokenViewOffset path, wrapper-true/mesh-false editor restoration mock, no broad overlay calls in component refresh, replay pre-BT-to-BT ownership handoff, native update passthrough, exact eight-file changed whitelist, protected blob equality, committed-byte rerun.

### Live gate

Dev only: confirm Black Canvas OFF restores the full fantasy backdrop, all Booth component toggles can be changed without losing that editor environment, Background OFF fallthrough no longer checkerboards because of a stranded replay-owned mesh, `+ New` and white-flash behavior remain correct. Outer-black 1:1 matte remains a separate pending presentation gate.

**Runtime behavior changed:** yes, Dev only. Public Stable unchanged.

---

## PFC-2026-09-07-044 — Component-aware Black Canvas / Background fallthrough

Date: 2026-09-07

### Reviewed

- binding HeroForge.Compatibility contract/master/pre-flight/changelog/architecture/inventory/compatibility/ownership/testing state;
- current Witch Dock Dev master/pre-flight/changelog/manifest;
- Booth v27.0.2, replay v0.1.3, bootstrap v0.1.0, and their Booth/Black Canvas histories;
- Amanda's v27.0.2 visual acceptance/failure report;
- live bridge issues #725-#748 covering current overlay/environment state, frame shader source, rejected WebGL matte probes, native token-view math, renderer geometry, and stacking context.

### Confirmed findings

- Black Canvas OFF now restores the ordinary fantasy editor canvas correctly;
- Background OFF is technically preserved (`backgroundPlane.visible=false`) and does not re-enable a hidden Booth environment mesh;
- Black Canvas ON still globally hides the regular environment, causing checkerboard when Background OFF makes the 1:1 Booth plane transparent;
- current native gray surround is hard-coded in the frame shader and has no named runtime color uniform;
- custom WebGL matte attempts using both a cloned frame mesh and a fresh Mesh fail with GL `1282`; that route is rejected;
- named `BT.maker.getTokenViewOffset()` supplies the current crop rectangle from render-manager dimensions;
- `#character-canvas` is a suitable owned DOM host above the renderer without requiring a page-global overlay.

### Decision

Use an independent four-bar DOM matte driven by the named native token-view rectangle. Keep component/environment decisions in Booth and let replay delegate full BT reassertion to Booth after native `display.update()`. Retain replay's old pre-BT behavior only when the Booth API cannot own presentation.

### Target files

- `tools/Booth.js`
- `features/booth/Black_Canvas_Display_Replay.js`
- `manifest.json`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/BULLSHIT/BOOTH_V27_STABILIZATION.md`
- `HISTORY/BULLSHIT/BOOTH_BLACK_CANVAS_DISPLAY_REPLAY.md`

### Conflict risks / preservation requirements

- do not patch HeroForge's Booth bundle;
- do not use the failed custom WebGL matte route;
- do not alter native `CK.character.display.update()` or the synchronous post-update replay position;
- do not activate the editor matte inside native Photo Booth;
- do not make Black Canvas imply Booth View;
- do not call environment setters repeatedly after desired visibility already exists;
- matte DOM must be pointer-inert, renderer-scoped, geometry-keyed, and fully removable;
- capability failure must degrade to existing Black Canvas behavior rather than leave outside-crop fantasy content exposed;
- Public Stable remains untouched.

### Static gate

Booth/replay JavaScript syntax, manifest JSON/version/cache identity, DOM matte geometry mock, component-aware enforcement mock, replay delegation plus legacy/pre-BT fallback mocks, exact eight-file whitelist, protected blob equality, and committed-byte rerun.

### Live gate

Dev only: verify Black Canvas OFF behavior stays fixed; Black Canvas ON + Background OFF gives fantasy environment inside 1:1 and black outside; Background ON restores Booth background with black outside; the matte tracks resize; `+ New`, both-OFF restoration, and white-flash suppression remain correct. Re-check the reported Black-OFF Background visual after this repair before inferring any additional layer.

**Runtime behavior changed:** yes, Dev only. Public Stable unchanged.

---

## PFC-2026-09-07-043 — Booth frame and editor-environment fallthrough repair

Date: 2026-09-07

### Reviewed

- binding HeroForge.Compatibility contract/master/pre-flight/changelog/architecture/inventory/compatibility/ownership/testing state;
- current Witch Dock Dev master/pre-flight/changelog/manifest;
- Booth v27.0.1 source and `BOOTH_V27_STABILIZATION.md`;
- Black Canvas replay v0.1.3 and its history;
- Booth runtime bootstrap v0.1.0 and its history;
- Amanda's integrated Dev acceptance at head `7b6e37562d5bba0d63d410e418f769a71857a87a`;
- current screenshots showing the gray 1:1 frame and checkerboard fallthrough;
- live read-only/reversible HF-Chat-Bridge probes #721-#724.

### Confirmed findings

- lifecycle/startup/new-figure/editor-restoration/white-flash gates from v27.0.1 are live PASS;
- current BT facade uses `BT.display.overlays.framePlane`; `BT.display.framePlane` does not exist;
- the existing frame helper therefore misses the actual frame while Black Canvas is OFF;
- Background OFF correctly hides the Booth background plane, but the ordinary editor environment remains hidden by Booth state, exposing checkerboard;
- named `BT.display.environment.setDefaultEnvironmentVisibility(true)` restores the full ordinary environment state without changing the Booth background plane and can be reversed cleanly.

### Decision

Repair only Booth presentation ownership. Reuse the existing frame hide lifecycle with the correct current runtime fallback, and conditionally restore the ordinary editor environment behind persisted Booth only when Black Canvas is OFF and the editor background is actually hidden.

### Target files

- `tools/Booth.js`
- `manifest.json`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/BULLSHIT/BOOTH_V27_STABILIZATION.md`

### Conflict risks / preservation requirements

- do not modify Black Canvas replay or its validated post-`display.update()` white-flash sequencing;
- do not modify Booth bootstrap timing or same-origin native runtime activation;
- do not modify silent-cycle timing/rearm behavior;
- do not force editor environment visibility inside native Photo Booth;
- do not restore editor environment while Black Canvas is ON;
- do not call the environment setter continuously when the environment is already visible;
- Booth Background remains an independent overlay-plane toggle;
- Public Stable remains untouched.

### Static gate

- Booth JavaScript syntax;
- manifest JSON/identity;
- frame-path fallback mock;
- conditional environment-restoration mock including no repeated setter call after visibility is restored;
- Black Canvas/native-Photo-Booth gating invariants;
- exact six-file changed whitelist;
- protected blobs unchanged.

### Live gate

With Dev only: Booth ON + Black Canvas OFF must show the fantasy editor environment outside the 1:1 viewport without the gray frame; Background OFF must reveal fantasy environment inside the square instead of checkerboard; Background ON must still show the Booth background; Black Canvas ON must remain black; `+ New`, both-OFF restoration, and white-flash behavior must remain correct.

**Runtime behavior changed:** yes, Dev only. Public Stable unchanged.

---

## PFC-2026-09-07-042 — Integrated Booth lifecycle regression repair

Date: 2026-09-07

### Reviewed

- binding HeroForge.Compatibility contract, master, pre-flight, changelog, architecture, feature inventory, compatibility, ownership, and testing state;
- current Witch Dock Dev master/pre-flight/changelog/module versioning;
- Booth v27 source and `BOOTH_V27_STABILIZATION.md`;
- Booth runtime bootstrap v0.1.0 and its investigation record;
- Black Canvas replay v0.1.2 and its investigation record;
- Amanda's integrated Dev smoke result after Dev head `a28d83c56264bf5e153415705c0043f792c13f2c`.

### Confirmed findings

- saved Booth + Black Canvas fresh-page startup: PASS;
- white-flash regression: PASS;
- Booth sub-toggle behavior: PASS;
- `+ New Figure`: FAIL because v27 accepts bare `cfg.camera` as saved Booth despite the established strong-signal rule;
- ordinary editor background restoration with Booth + Black Canvas OFF: FAIL;
- replay can retain a legitimate Booth-hidden background visibility snapshot and replay it after Booth is no longer active.

### Decision

Surgically align Booth v27 saved-config detection with the already-validated bootstrap rule and repair shutdown/restoration ownership. Preserve all established Booth timing/retry/silent-cycle behavior.

### Target files

- `tools/Booth.js`
- `features/booth/Black_Canvas_Display_Replay.js`
- `manifest.json`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/BULLSHIT/BOOTH_V27_STABILIZATION.md`
- `HISTORY/BULLSHIT/BOOTH_RUNTIME_BOOTSTRAP.md`
- `HISTORY/BULLSHIT/BOOTH_BLACK_CANVAS_DISPLAY_REPLAY.md`

### Conflict risks / preservation requirements

- do not alter Booth bootstrap timing, same-origin native Booth load, or `BT.setBoothMode` activation;
- do not alter the validated `CK.character.display.update()` white-flash replay sequencing;
- do not alter internal silent-cycle teardown/rearm timing;
- Black Canvas remains independent from Booth Persistence;
- a fresh figure may keep Black Canvas ON if its separate Utilities default is ON, but default-owned Booth View must fall OFF when no strong saved Booth setup exists;
- manual current-session switches remain session overrides;
- Public Stable stays untouched.

### Static gate

Exact source patching, syntax, manifest identity, replay lifecycle mocks, and protected-file equality must pass before Dev moves.

### Live gate

Re-test saved-figure refresh, `+ New Figure`, both toggle-off orders, fantasy editor background restoration, white-flash behavior, and Booth component toggles. Public migration remains blocked until these pass.

**Runtime behavior changed:** yes, Dev only. Public Stable unchanged.

---

## PFC-2026-09-07-041 — Black Canvas pre-BT fallback

Date: 2026-09-07

### Required material reviewed

- binding HeroForge.Compatibility contract/master/preflight/changelog/architecture/inventory/compatibility/ownership/testing material already reviewed for this stage;
- current Witch Dock Dev `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `manifest.json`, loader, Booth v27, Utilities v1.2.1, Booth runtime bootstrap, and Black Canvas replay;
- Public Stable replay v0.1.1;
- `MODULE_VERSIONING.md`;
- `HISTORY/BULLSHIT/BOOTH_BLACK_CANVAS_DISPLAY_REPLAY.md`;
- prior bridge evidence for `CK.environment.background`, `CK.character.display.applyLighting()`, and the background manager's `updateValues()` implementation;
- current Dev baseline after loader repair `6cf10845e394676344ebb8699c654009267c6c61`.

### Confirmed findings

- Black Canvas saved state is exposed through the Booth API before BT exists;
- Public Stable replay v0.1.1 has a diagnostic state fallback that Dev v0.1.0 did not yet carry;
- the regular HeroForge display lighting path uses `CK.environment.background`;
- that background manager's `updateValues()` operates on `this.mesh.material`;
- current replay can blacken renderer canvas/holder without BT but its semantic main-background discovery starts from BT.

### Supported inference

`CK.environment.background.mesh` is the conservative regular-scene render target for pre-BT visibility suppression. This exact fresh-start visual mapping is not yet live-proven; therefore the candidate only uses it when it exposes a `visible` capability and treats absence/failure as no-op/retry.

### Decision

Build replay v0.1.2 as the union of Public Stable v0.1.1 state detection and one conservative no-BT background visibility fallback. Preserve the validated BT named `environment -> background` path whenever BT already exists. Do not bootstrap Booth for Black Canvas alone and do not change the validated post-`display.update()` replay sequencing.

### Target files

- `features/booth/Black_Canvas_Display_Replay.js`
- `manifest.json`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/BULLSHIT/BOOTH_BLACK_CANVAS_DISPLAY_REPLAY.md`

### Conflict risks / preservation requirements

- native `CK.character.display.update()` must always execute;
- existing Stable diagnostic state fallback must be retained;
- BT semantic named-background discovery remains preferred for BT-first sessions;
- the direct CK fallback may only own/restore the visibility value it changed;
- Black Canvas default must not enable Booth View or load gated Booth core by itself;
- failure to find the CK mesh must be a no-op/retry, not partial initialization;
- Booth v27, Utilities v1.2.1, Booth runtime bootstrap, loader v0.5.1, Spinny, High Res, corrected decal gizmo, JSON, Developer Mode, Decals host, and public Stable remain untouched.

### Static validation

- replay syntax: PASS;
- no-BT API-state lifecycle mock: PASS;
- Stable diagnostic-state fallback mock: PASS;
- BT-present semantic-path regression mock: PASS;
- manifest v0.1.2/build/query identity: PASS;
- candidate replay Git blob matches the locally tested source exactly: PASS.

### Live gate

Use the Dev userscript only. Verify Black Canvas Across Sessions ON can restore a fresh ordinary editor page to black without forcing Booth View ON. Separately verify saved-Booth persistence still bootstraps Booth when its own persistence default is ON, the known white-flash action remains flash-free, Black Canvas OFF restores the ordinary background, and `+ New Figure` remains untouched.

**Runtime behavior changed:** yes, Dev Black Canvas startup only. Public Stable remains unchanged.

---

## PFC-2026-09-07-040 — Dev loader cache repair

Date: 2026-09-07

### Required material reviewed

- binding HeroForge.Compatibility contract/master/preflight/changelog/architecture/inventory/compatibility/ownership/testing documents;
- current Witch Dock Dev `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `manifest.json`, and `Witch_Dock_DEV.user.js`;
- `HISTORY/BULLSHIT/MANIFEST_AND_LOADING.md`;
- current Dev baseline `2f3500e301e6f76367faa587e9728da3b29ae467`;
- live public stale-manifest evidence and the subsequent hard-refresh confirmation that the repository itself already contained Booth v27 / Utilities v1.2.1.

### Confirmed findings

- branch-based raw GitHub URLs can return a stale manifest/module snapshot despite the loader sending `Cache-Control: no-cache`;
- the fixed branch URL therefore needs a changing request identity for the manifest;
- module requests need a deterministic identity that changes when the manifest declares a new module version/build;
- `manifest.moduleRegistry` is the maintained source of module ID/version/build/path identity and can be indexed by each `tools[]` entry ID.

### Decision

Repair the Dev loader only. Use one per-page cache token for the manifest and deterministic module cache keys derived from `moduleRegistry`; preserve existing request flow, tool enablement, execution order, and module runtime code.

### Target files

- `Witch_Dock_DEV.user.js`
- `manifest.json`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/BULLSHIT/MANIFEST_AND_LOADING.md`

### Conflict risks / preservation requirements

- do not change Booth v27, Utilities v1.2.1, or the validated Black Canvas display replay;
- do not change manifest tool order or enabled/default semantics;
- preserve pre-existing query parameters on module URLs;
- do not use a random per-module token that would defeat deterministic module identity;
- public `Witch_Scripts` must remain untouched until Dev validation.

### Static validation

- `node --check Witch_Dock_DEV.user.js`: PASS.
- `python3 -m json.tool manifest.json`: PASS.
- every current `tools[]` ID resolves to a `moduleRegistry[]` identity: PASS.
- deterministic module-key test, build-change invalidation test, and existing-query preservation test: PASS.
- `git diff --check`: PASS.
- protected blob checks for Booth v27, Utilities v1.2.1, and Dev Black Canvas replay: PASS.

### Live gate

Use the Dev userscript. Confirm a normal page load obtains current Dev modules without requiring `Ctrl+Shift+R`, then perform the already-pending Booth persistence/Black Canvas startup smoke. Stable loader v1.2.1 promotion remains blocked until this Dev gate passes.

**Runtime behavior changed:** yes, Dev loader delivery only. Public Stable remains unchanged.

---

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
- requires four consecutive 200 ms observations of the same `CK.data` object, mode, and strong-signal signature;
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
