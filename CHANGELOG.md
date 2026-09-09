# Changelog

## DOCK-2026-09-08-047 — Prevent duplicate Booth runtime and black Spinny output

Date: 2026-09-08

### Live report

Public Witch Dock 1.2.1 reproduced two regressions during the current Photo Booth/texture session:

- Spinny Mini WebP downloads were completely black/empty at both 1024 and 2048, including short 16-frame tests;
- the previously closed Booth/Kitbash white-flash symptom was visible again.

### Confirmed diagnosis

HF-Chat-Bridge tracing established that the WebP service was not the source of the black output:

- native `BT.maker.takeScreenshot(1024,1024)` itself returned 100% opaque black pixels;
- disabling Witch Dock True Resolution and separately disabling Black Canvas did not repair it;
- direct `CK.Effects.renderToCanvas()` of the current Booth camera and HeroForge's own screenshot-camera clone both rendered the figure correctly;
- HeroForge's native screenshot compositor had a good model image, then drew an opaque-black auxiliary frame/overlay render over it;
- a second top-level `TokenBackground` remained visible during that auxiliary render even though the current Booth runtime hid its own presentation objects;
- `CK.scene` contained two complete `TokenBackground / TokenShadow / TokenFrame` trios;
- the page contained two identical `/gated/booth.js` tags: one inserted by Witch Dock's persistence bootstrap and one later inserted by HeroForge's native lazy loader;
- current `BT.display.overlays` owned only the second trio, proving the first trio was an orphan runtime remnant;
- removing only the proven orphan trio immediately restored healthy native screenshot output.

HeroForge's native lazy script contract was then observed directly: relative Booth `src`, BODY ownership, async execution, and `data-status` lifecycle. The current clean page also confirmed all 35 observed versioned HeroForge resource/script URLs use `heroforge06.1.9.98`; the older `heroforge07.1.9.98` documentation target is stale for this live session.

### Dev change

- `booth.runtime-bootstrap` `0.1.0 -> 0.1.1` / build `0.1.1-dev-native-loader-coordination`;
- preserve the existing persistence default gate, strong saved-Booth signal detection, four consecutive 200 ms stable observations, named `BT.setBoothMode(savedMode)` activation, engine verification, and Witch Dock default reconciliation;
- reuse any already-present matching Booth script rather than only recognizing a bootstrap-owned tag;
- when Witch Dock must request Booth itself, use a relative `/gated/booth.js?...` `src`, append under BODY, set async, and participate in HeroForge's `data-status=loading/loaded/error` convention;
- expose requested path/URL, loader strategy, matching script count, duplicate count, and compact script topology through bootstrap diagnostics;
- refuse successful bootstrap completion when more than one matching Booth script is detected;
- bump Dev manifest registry/raw URL identity to v0.1.1/build `0.1.1-dev-native-loader-coordination`.

No Spinny, True Resolution, Booth v27.0.4, Black Canvas replay v0.1.5, Utilities, gizmo, JSON, Developer Mode, or Public Stable runtime code was changed.

### Live Dev validation

Clean reload with Dev v0.1.1:

- bootstrap loaded/runs exactly once: PASS;
- one Booth script, zero duplicates: PASS;
- one TokenBackground/TokenShadow/TokenFrame trio, all UUIDs matching current `BT.display.overlays`: PASS;
- native 1024 screenshot non-black: PASS;
- Spinny 1024 short test: 16/16 rendered and encoded, valid 1024x1024 animated WebP, ~978,702 bytes, rotation restored: PASS;
- Spinny 2048 short test: 16/16 rendered and encoded, valid 2048x2048 animated WebP, ~2,521,512 bytes, rotation restored: PASS;
- after native `CK.character.refresh()`: still one Booth script and three current overlay meshes: PASS;
- automated 120-frame outer-framebuffer sampling around the known refresh path: zero white/bright spike frames and no errors: PASS;
- final human Booth/Kitbash visual flash confirmation: pending.

The correctness smoke also measured about 42.4 seconds for 16 native 1024 frames and 110.4 seconds for 16 native 2048 frames on this complex figure. WebP capture performance optimization is explicitly parked as a separate investigation.

### Tracking repair

The bootstrap source commit `09136b6691bfa34fa4b2b628fb59ed287874f1e9` and manifest bump `efe279fc4718ab067ae6f20e0b4042e5fa3532af` landed before their required tracking update. This entry, the matching pre-flight/master/history updates, and their single multi-file documentation commit repair that gap.

**Runtime behavior changed:** yes in the preceding Dev bootstrap/manifest commits. This documentation commit itself changes no runtime behavior. Public Stable remains unchanged.

---

## DOCK-2026-09-08-046 — Repair fresh-slot Project-OFF decal normalization

Date: 2026-09-08

### Live report

A brand-new untouched projected decal currently shows Move `0 / 1.56 / 0` and Scale `1.82 / 1.82 / 2`; toggling Project OFF leaves those values unchanged instead of running the previously validated fresh-slot normalization.

### Diagnosis

- Public/Dev gizmo source still contains the v0.4.2 fresh-bind normalizer.
- Its bad-initializer detector is keyed to the previously observed raw profile `v≈1.50394`, `s≈sy≈1.76859` with ±0.035 tolerance.
- The current UI-observed initializer `v≈1.56`, `s≈sy≈1.82` lies outside that old detector envelope. Exact current raw floats remain unconfirmed because HF-Chat-Bridge request #752 did not return during this edit; the UI shift is therefore treated as supported inference pending live Dev validation.

### Dev change

- Corrected Bound Decal Gizmo `1.1.0 -> 1.1.1` / build `1.1.1-dev-fresh-slot-normalization`.
- Preserve the old confirmed initializer profile and add the current UI-observed profile with a tight ±0.025 matcher.
- Only a first-ever Project-OFF `freshBind` that matches a recognized untouched initializer is normalized.
- Fresh normalization now sets `h=0`, `v=0`, `s=-1.5`, `sy=-1.5`; depth/rotation/`sz` and unrelated fields remain untouched.
- Move/Rotate/Scale drag math, undo/redo, existing bound-transform preservation, artwork-swap preservation, and Project ON/OFF restoration are unchanged.
- Dev manifest now loads this gizmo from `WITCH_DEV_UI` rather than accidentally reusing the Stable gizmo URL.

### Gate

Dev only. Test a new untouched decal slot, then regression-check an already edited Project-OFF decal plus Project ON/OFF/artwork preservation before any Stable promotion.

**Runtime behavior changed:** yes — Dev corrected-gizmo fresh-slot normalization only. Public Stable unchanged.

---

## DOCK-2026-09-07-045 — Repair Booth editor-environment ownership after v27.0.3 live failure

Date: 2026-09-07

### Live result entering this repair

Amanda's v27.0.3 Dev smoke rejected the component-aware DOM matte and exposed a deeper environment-ownership conflict:

- Black Canvas ON + Booth Background OFF still showed checkerboard instead of the fantasy environment;
- the v27.0.3 matte covered almost the entire renderer and left only a tiny square around the figure, proving `BT.maker.getTokenViewOffset()` is not the visible editor 1:1 crop contract;
- Black Canvas ON -> OFF could temporarily restore the pedestal/editor environment, but toggling Lighting, Effects, Overlays, or Background could hide it again even while Black Canvas remained OFF;
- the fantasy backdrop image itself could stay missing even when the pedestal/ground returned.

### Confirmed diagnosis

- every Booth sub-toggle shares `refreshBTComponentRender()`, which was still invoking the broad native `overlays.resize()`, `overlays.refresh()`, and `overlays.applyVisibility()` sequence before reasserting Witch Dock state;
- current environment state can disagree between `CK.environment.background.visible` and `CK.environment.background.mesh.visible`; prior bridge reads observed both directions of mismatch, so wrapper-only restoration gating is insufficient;
- replay v0.1.4 can acquire the regular background mesh before BT exists, hide it for Black Canvas, then later drop the ownership snapshot when Booth delegation becomes available without restoring that mesh first;
- this can leave the fantasy background render node hidden while the Booth environment setter separately restores ground/pedestal visibility;
- v27.0.3's `getTokenViewOffset()` DOM matte is rejected by live visual evidence and is removed in this repair.

### Changes

- Booth -> v27.0.4 / build `v27.0.4`;
- Black Canvas replay -> v0.1.5 / build `0.1.5-dev-restore-before-booth-handoff`;
- remove the v27.0.3 DOM matte and all `getTokenViewOffset()` crop ownership from Booth;
- editor-environment restoration now considers the actual background mesh, ground group, `hideGround`, and summon-circle state in addition to the background wrapper flag;
- when the editor fallback is explicitly required, the actual regular background mesh is re-shown after the named native environment setter so wrapper/mesh disagreement cannot strand the fantasy backdrop;
- component toggles no longer run the broad native overlay resize/refresh/applyVisibility sequence merely to redraw; they reassert their already-applied component state and request a render refresh instead;
- replay restores any background visibility it owned before handing full BT presentation to Booth, rather than dropping the snapshot while leaving the mesh hidden;
- the validated synchronous post-`CK.character.display.update()` replay location is unchanged.

### Deliberate temporary limitation

This repair prioritizes stable environment/component ownership. With Booth View + Black Canvas ON + Background OFF, the fantasy environment may extend outside the intended 1:1 crop until a correct frame-derived matte seam is separately validated. The rejected `getTokenViewOffset()` matte is not retained as a partial fix.

### Preserved boundaries

Booth bootstrap v0.1.0, Utilities v1.2.1, Dev loader v0.5.1, silent-cycle timing, native `display.update()` execution, corrected decal gizmo, Spinny, High Res, JSON, Developer Mode, Decals host, tabs, and Public Stable are unchanged.

### Validation gate

Booth/replay syntax, manifest identity/cache keys, wrapper-vs-mesh environment mock, narrow component-refresh mock, pre-BT replay handoff mock, native update passthrough, exact eight-file whitelist, protected blob equality, and committed-byte rerun must pass before Dev moves. Live validation then focuses on fantasy-background recovery and component-toggle stability before any new outer-matte work.

**Runtime behavior changed:** yes, Dev Booth/Black Canvas environment ownership only. Public Stable remains unchanged.

---

## DOCK-2026-09-07-044 — Make Black Canvas component-aware when Booth Background is off

Date: 2026-09-07

### Live result entering this repair

Dev v27.0.2 fixed the ordinary fantasy canvas restoration when Black Canvas turns OFF. Amanda then confirmed two remaining presentation symptoms:

- with Black Canvas OFF, toggling Booth Background OFF did not visually produce the expected distinction;
- with Black Canvas ON, Booth Background OFF correctly hid the Booth background but exposed checkerboard rather than the fantasy editor environment inside the 1:1 viewport.

The known white-flash regression remained closed.

### Confirmed diagnosis

Bridge reads proved the Background component itself is not stuck: with Black Canvas OFF + Background OFF, `BT.display.overlays.backgroundPlane.visible` remains false, Booth environment mesh remains false, and the regular `CK.environment` background/ground are visible. No second Booth backdrop layer was found in that state.

For Black Canvas ON + Background OFF, both Booth and replay were still globally hiding the regular environment. That necessarily leaves checkerboard once the Booth background plane is false.

HeroForge's current frame shader was also audited. Its outside-1:1 gray overlay is literal shader code (`vec4(0.5,0.5,0.5,0.7)`) selected by UVs outside `[0,1]`; there is no named color uniform. Two reversible custom WebGL matte probes were rejected after both returned `INVALID_OPERATION (1282)`.

HeroForge does expose a safer named viewport contract: `BT.maker.getTokenViewOffset()` returns full render size plus current crop offsets/size. The live canvas and render-manager dimensions aligned, and `#character-canvas` is an untransformed absolutely positioned renderer container.

### Changes

- Booth -> v27.0.3 / build `v27.0.3`;
- Black Canvas replay -> v0.1.4 / build `0.1.4-dev-component-aware-booth-reassert`;
- when Booth View + Black Canvas are ON, Background is OFF, and the page is outside native Photo Booth, Booth keeps the regular fantasy environment visible inside the native token crop;
- an owned four-bar DOM matte covers only the renderer area outside `BT.maker.getTokenViewOffset()`; layout is keyed and rewritten only when renderer/crop geometry changes;
- if the matte capability is unavailable, behavior degrades to the previous full-black/checkerboard path rather than partially exposing the canvas;
- native Photo Booth is excluded from the editor-fallback matte;
- Black Canvas OFF, figure changes, and restoration remove the owned matte;
- Booth exposes a narrow `reassertBlackCanvasPresentation()` API so the already-validated post-`CK.character.display.update()` replay can synchronously delegate component-aware BT presentation instead of re-hiding the fantasy environment;
- pre-BT/editor-only replay behavior remains available as the fallback path.

### Preserved boundaries

Booth bootstrap v0.1.0, Utilities v1.2.1, loader v0.5.1, established Booth timing/silent-cycle behavior, native `display.update()` execution, corrected decal gizmo, Spinny, High Res, JSON, Developer Mode, Decals host, tabs, and Public Stable remain unchanged.

### Validation gate

Booth/replay syntax, manifest identities, matte geometry math, component-aware enforcement, delegation/fallback replay mocks, exact eight-file whitelist, protected blobs, and committed-candidate rerun must pass before Dev moves. Live visual acceptance remains required afterward.

**Runtime behavior changed:** yes, Dev Booth/Black Canvas presentation only. Public Stable remains unchanged.

---

## DOCK-2026-09-07-043 — Repair Dev Booth frame and editor-environment fallthrough

Date: 2026-09-07

### Live acceptance entering this follow-up

Dev head `7b6e37562d5bba0d63d410e418f769a71857a87a` passed the integrated lifecycle smoke:

- saved Booth View + Black Canvas restored automatically on refresh;
- `+ New Figure` correctly dropped default-owned Booth while preserving the independent Black Canvas default;
- both Booth/Black Canvas OFF orders restored the fantasy editor background;
- the white-flash regression remained closed;
- Booth component toggles continued to work.

Two presentation defects remained while Booth View was active outside native Photo Booth with Black Canvas OFF: the gray 1:1 frame overlay remained visible, and a full saved Booth with Background OFF could expose checkerboard instead of the ordinary fantasy editor environment.

### Confirmed runtime diagnosis

HF-Chat-Bridge issues #721-#724 established the current runtime shape and state:

- `BT.display.framePlane` is absent while `BT.display.overlays.framePlane.visible` is `true`; Booth v27.0.1's frame helper therefore looks one level too high for the current BT facade;
- with Witch of the Wilds left in Booth View ON / Black Canvas OFF / Background OFF, `BT.display.overlays.backgroundPlane.visible` is correctly `false`, but `CK.environment.background.visible` and `CK.environment.groundGroup.visible` are also `false`, `CK.character.settings.hideGround` is `true`, and the ordinary editor environment is therefore still Booth-hidden;
- `BT.display.environment.setDefaultEnvironmentVisibility(true)` is a named native method whose source controls the regular environment visibility state;
- a reversible live probe changed background/ground to visible, `hideGround` to false, and summon-circle visibility to true while leaving the Booth background plane OFF, then cleanly restored the original hidden state.

### Changes

- Booth -> v27.0.2 / build `v27.0.2`;
- the existing shader/frame discovery now falls back from `TN.shader.framePlane` to `TN.shader.overlays.framePlane`, preserving the existing frame snapshot/hide/restore lifecycle;
- while Witch Dock Booth View is active outside native Photo Booth and Black Canvas is OFF, Booth conditionally restores HeroForge's ordinary editor environment only when `CK.environment.background.visible === false`;
- the environment setter is therefore not called every frame once the editor environment is already visible;
- Booth Background still owns only `BT.display.overlays.backgroundPlane`: Background OFF can now fall through to the fantasy editor environment instead of checkerboard;
- native Photo Booth and Black Canvas ON keep their existing behavior.

### Preserved boundaries

Black Canvas replay v0.1.3, Booth runtime bootstrap v0.1.0, Utilities v1.2.1, loader v0.5.1, white-flash post-update replay sequencing, silent-cycle timing, corrected decal gizmo, Spinny, High Res, JSON, Developer Mode, Decals host, tabs, and Public Stable are unchanged.

### Validation gate

Static syntax, manifest identity, helper behavior mocks, exact changed-file whitelist, protected-blob equality, and committed-candidate validation must pass before Dev moves. Live validation then checks the gray frame, Background OFF fallthrough, Black Canvas, `+ New`, editor restoration, and white-flash regression.

**Runtime behavior changed:** yes, Dev Booth presentation only. Public Stable remains unchanged.

---

## DOCK-2026-09-07-042 — Repair Dev Booth figure lifecycle and editor background restore

Date: 2026-09-07

### Live result that triggered this repair

The integrated Dev smoke confirmed that saved Booth View and Black Canvas now restore automatically on page refresh and the validated white-flash fix remains effective. It also exposed two lifecycle regressions:

- creating a fresh `+ New Figure` after a saved Booth figure left default-owned Booth View active and showed the empty checkerboard Booth backdrop;
- with Booth View and Black Canvas both OFF, the ordinary HeroForge fantasy editor background did not return and the viewport remained white.

All Booth component toggles continued to work.

### Confirmed source diagnosis

- Booth v27 `readSavedBoothConfig()` still counted plain `cfg.camera` as a saved-Booth signal even though the runtime bootstrap correctly rejects bare camera data. Fresh figures may have ordinary camera data, so an already-loaded BT runtime let v27 falsely classify the new figure as having saved Booth setup.
- `restoreBTCanvasVisualState()` already contains the semantic environment restoration used by the older working behavior, but a real `onUserBoothToggle(false)` did not reassert it after Booth teardown when Black Canvas was already OFF.
- the Black Canvas replay captured the named main-scene background's current visibility. While Booth was active that value could correctly be `false`; later restoring that stale `false` after Booth itself was OFF could re-hide the fantasy editor background.

### Changes

- Booth -> v27.0.1 / build `v27.0.1`;
- bare `cfg.camera` no longer qualifies as saved Booth configuration; all previously accepted stronger Booth signals remain;
- non-internal Booth shutdown reasserts the existing `restoreBTCanvasVisualState()` path when Black Canvas is already OFF; internal silent-cycle behavior is unchanged;
- Black Canvas replay -> v0.1.3 / build `0.1.3-dev-editor-background-restore`;
- replay still restores the captured background visibility while Booth remains active, but when BT exists and Booth View is OFF it restores the default environment and makes the owned main-scene background visible instead of replaying a stale hidden value;
- no timing windows, tokenizer retry/rearm behavior, `display.update()` replay sequencing, or Booth bootstrap timings were changed.

### Preserved boundaries

Booth runtime bootstrap v0.1.0, Dev loader v0.5.1, Utilities v1.2.1, corrected decal gizmo, Spinny, High Res, JSON, Developer Mode, Decals host, tab infrastructure, and Public Stable are unchanged.

### Validation

- exact source replacement counts: PASS;
- Booth/replay JavaScript syntax: PASS;
- manifest JSON parse and version/cache identity assertions: PASS;
- replay lifecycle mocks: PASS for no-BT Black Canvas, BT+Booth active restoration, BT+Booth OFF editor restoration, diagnostic state fallback, and native `display.update()` passthrough;
- Booth source invariant: PASS — bare `camera` is not a saved signal, stronger signals remain, and internal silent-cycle shutdown is excluded from editor-background restoration;
- live Dev regression smoke: pending.

**Runtime behavior changed:** yes, Dev Booth lifecycle/restoration only. Public Stable remains unchanged.

---

## DOCK-2026-09-07-041 — Add Dev Black Canvas pre-BT fallback

Date: 2026-09-07

### Summary

Bumped `booth.black-canvas-display-replay` to v0.1.2. The Dev module now carries forward Public Stable v0.1.1's diagnostic Black Canvas state fallback and, only when the validated BT scene path is unavailable, may hide `CK.environment.background.mesh` so Black Canvas can restore before the gated Booth runtime exists.

### Evidence / boundary

- prior HF-Chat-Bridge reads confirmed the regular main display uses `CK.environment.background`;
- `CK.character.display.applyLighting()` calls `CK.environment.background.updateValues(...)`;
- that background manager's `updateValues()` operates through `this.mesh.material`, supporting `CK.environment.background.mesh` as the conservative pre-BT render target;
- the exact fresh-start visual object identity remains a supported inference pending live Dev validation;
- when BT already exists, the previously validated semantic named `environment -> background` scene path remains preferred;
- Black Canvas alone does not load or enable Booth.

### Preserved behavior

- native `CK.character.display.update()` always executes;
- the live-validated post-update white-flash replay sequencing is unchanged;
- Public Stable v0.1.1 diagnostic state fallback is retained;
- Black Canvas OFF/dispose restores only the visibility value owned by the replay;
- Booth v27, Utilities v1.2.1, Booth runtime bootstrap, Dev loader v0.5.1, Spinny, High Res, corrected decal gizmo, JSON, Developer Mode, Decals host, and tab infrastructure are unchanged;
- public `Witch_Scripts` remains unchanged.

### Validation

- replay syntax: PASS;
- no-BT API-state lifecycle mock: PASS — direct CK background mesh hidden, native update still executes, OFF restores visibility, dispose restores original update;
- Public Stable diagnostic-state fallback mock: PASS;
- BT-present regression mock: PASS — named semantic background path remains preferred and restores correctly;
- manifest v0.1.2/build/query identity: PASS;
- live fresh-start visual validation: pending.

**Runtime behavior changed:** yes, Dev Black Canvas startup only. Public Stable unchanged.

---

## DOCK-2026-09-07-040 — Add Dev loader cache keys

Date: 2026-09-07

### Summary

Repaired the Dev Witch Dock loader so branch-based raw GitHub delivery no longer relies on `Cache-Control: no-cache` alone. The manifest now receives a per-page cache-busting key, while each module request receives a deterministic key derived from the matching manifest registry identity.

### Confirmed diagnosis

- the public v1.2.0 loader fetched branch-based raw GitHub manifest/module URLs without durable cache keys;
- a live Stable page demonstrably remained on an intermediate manifest snapshot until a hard refresh;
- the Dev loader used the same vulnerable `gmGetText(MANIFEST_URL)` / `gmGetText(url)` pattern;
- `moduleRegistry` already provides stable module IDs plus version/build/path metadata, so module cache identity can be derived without changing module runtime behavior.

### Changes

- bumped Dev userscript loader header `1.0.8.5` -> `1.0.8.6`;
- bumped manifest registry identity `witch-dock-dev-loader` to v0.5.1 / build `1.0.8.6-cache-keyed-loader`;
- manifest fetches now append a unique per-page `kwcache=session-...` query key;
- module fetches now append deterministic `kwcache=module-...` keys derived from module ID + registry version + registry build + registry path + raw URL;
- existing module query parameters such as explicit `?v=` keys are preserved;
- `Cache-Control: no-cache` remains as an additional request hint rather than the sole invalidation mechanism.

### Preserved boundaries

- `tools/Booth.js` remains byte-identical v27.0.0/build `v27`;
- `tools/Utilities.js` remains byte-identical v1.2.1;
- `features/booth/Black_Canvas_Display_Replay.js` remains byte-identical;
- Booth runtime bootstrap, corrected decal gizmo, Spinny Mini WebP, High Res Image Capture, JSON, Developer Mode, Decals host, and tab infrastructure are unchanged;
- public `Witch_Scripts` is unchanged;
- HF-Chat-Bridge remains development-only and is not a runtime dependency.

### Validation

- Dev userscript JavaScript syntax: PASS (`node --check`).
- Manifest JSON parse: PASS.
- Manifest tool IDs map to registry identities: PASS.
- Cache-key unit checks: PASS — existing query parameters survive, identical registry identity is deterministic, and changing registry build changes the module request URL.
- `git diff --check`: PASS.
- Protected Booth/Utilities/replay blob checks: PASS.
- Live Dev delivery/startup smoke: pending.

### Rollback

Revert this Dev commit. No module runtime files need rollback because the change is confined to the Dev loader, manifest loader identity, and tracking documentation.

**Runtime behavior changed:** yes, Dev loader delivery only. Public Stable remains unchanged.

---

## DOCK-2026-09-07-039 — Add Dev Booth runtime bootstrap

Date: 2026-09-07

### Summary

Added a separate hidden Dev compatibility module that closes the saved-Booth fresh-page circular dependency without modifying Booth v27, Utilities v1.2.1, or the validated Black Canvas display replay.

### Confirmed diagnosis

- fresh HeroForge startup has no `BT` global before the native gated Booth core is loaded;
- Booth v27 still gates saved `CK.data.custom` Booth inspection behind an existing BT runtime;
- saved Booth Persistence can therefore be enabled while v27 cannot see the saved configuration needed to activate Booth;
- current public v27 reproduced the failure after the stale-manifest problem was cleared by hard refresh, proving this is a real v27 startup issue rather than old v24 code;
- the earlier standalone bootstrap probe already proved HeroForge's same-origin `/gated/booth.js` plus named `BT.setBoothMode(savedMode)` is a viable runtime activation seam.

### Changes

- added hidden `booth-runtime-bootstrap` v0.1.0 / build `0.1.0-dev-native-booth-bootstrap` at `features/booth/Booth_Runtime_Bootstrap.js`;
- bootstrap reads the existing saved Booth Persistence default and independently inspects `CK.data.custom` for strong saved Booth signals;
- bare camera state is explicitly excluded from eligibility;
- bootstrap requires four consecutive 200 ms observations of the same `CK.data` object, mode, and signal signature to avoid acting on HeroForge's transient figure-load state;
- when eligible and BT is absent, bootstrap loads only HeroForge's own same-origin gated `booth.js`;
- current HeroForge version is derived from loaded script/resource URLs rather than hard-coded;
- named `BT.setBoothMode(savedMode)` is required and used; no minified/Webpack seam is added;
- native engine enablement is verified through `BT.liveEngine || BT.maker`;
- after runtime activation, the existing `KW_WD_BOOTH` API reconciles default-owned Booth View and saved Black Canvas;
- module work is single-flight and exposes diagnostics plus `dispose()` through `KW_WD_BOOTH_BOOTSTRAP`;
- Dev manifest orders bootstrap before Booth and adds version query keys to Dev Booth, Utilities, replay, and bootstrap module URLs so module fetches cannot reuse older responses once the current manifest is loaded.

### Preserved boundaries

- `tools/Booth.js`: unchanged v27.0.0 / build `v27`;
- `tools/Utilities.js`: unchanged v1.2.1;
- `features/booth/Black_Canvas_Display_Replay.js`: unchanged v0.1.0 Dev runtime;
- Corrected Bound Decal Gizmo, Spinny Mini WebP, High Res Image Capture, JSON, Developer Mode, Decals host, and tab infrastructure unchanged;
- public `Witch_Scripts` unchanged;
- HF-Chat-Bridge remains development-only and is not a runtime dependency.

### Validation

- JavaScript syntax: PASS.
- Saved-figure mock: PASS — native `portrait` mode bootstrap, engine enable verification, Black Canvas reconciliation.
- Fresh-camera-only mock: PASS — no script insertion/bootstrap.
- Live Dev startup validation: pending.
- Public shell/manifest cache-busting repair: still pending separately; this commit only adds version keys to Dev module URLs after manifest load.
- No Dev GitHub Actions workflow exists; no CI claim is made.

### Rollback

Remove/disable the `booth-runtime-bootstrap` manifest entry or revert this Dev commit. Booth v27 and the Black Canvas replay are not modified by this feature.

**Runtime behavior changed:** yes, Dev only. Public Stable remains unchanged.

---

Historical changelog through DOCK-2026-09-07-038 remains preserved in Git history at Dev commit `12383ca5a551acb1a6bf330f7cfad8ea68a82ad1`.
