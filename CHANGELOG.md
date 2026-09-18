# Changelog

Rolling current Dev log. Older detail remains durable in Git history/issues.

## DOCK-2026-09-18-020 — Close v1.4.2 tool-enablement live gate

Date: 2026-09-18

### Live PASS

- v1.4.2 launcher running / error null; preferences v0.3.0 configured; loader v0.1.2 started clean at 23/23 / 0 failed.
- Decals Scroll Guards OFF through the normal Utilities checkbox wrote `"false"` to `kw.witchDock.toolEnabled.expanded-ui-scroll-guards`, recorded one preference page write + one host write, and disabled the live scroll-guard style/classes.
- Reload while OFF produced 23 total / 22 enabled+executed / 0 failed; only `expanded-ui-scroll-guards` was marked `disabled`; Utilities restored the checkbox OFF.
- Normal checkbox ON restored page key `"true"`, mirrored page+host writes, and after async settle restored the scroll-guard API/style/status.
- Final reload restored 23/23 / 0 failed, checkbox ON, page key `"true"`.
- Evidence: `hf-20260917-wd10-v142-scrollguards-off-read-001`, `hf-20260917-wd10-v142-off-postreload-read-001`, `hf-20260917-wd10-v142-scrollguards-on-read-001`, `hf-20260917-wd10-v142-scrollguards-on-settle-read-001`, `hf-20260917-wd10-v142-final-snapshot-read-001`.

### Confirmed bootstrap hardening finding

- During installation, the page was still executing launcher v1.4.1 while its branch-relative preferences URL fetched current v0.3.0 source; v1.4.1 correctly rejected that newer build against its v0.2.0 expectation.
- A cache-busted v1.4.2 userscript install plus reload resolved the immediate mismatch.
- This is not a v1.4.2 preference API defect. It is a moving-task-branch bootstrap source skew hazard and remains an explicit issue #10 Stage E cleanup requirement.

**Runtime/module/manifest/public behavior changed:** none in this record-only commit; task-branch live evidence/routing only.

---

## DOCK-2026-09-17-019 — Centralize tool-enablement persistence without changing precedence

Date: 2026-09-17

### Prior gate closure

- v1.4.1 section collapse/order persistence PASS.
- Normal Booth header click recorded exactly one bounded write to `kw.witchDock.ui.booth-tool.booth.collapsed`; reload restored collapsed state; normal click restored expanded.
- Loader remained 23/23 / 0 failed and all 12 observed sections remained present in the same order.
- Evidence: `hf-20260917-wd10-v141-collapse-readback-001`, `hf-20260917-wd10-v141-postreload-001`, `hf-20260917-wd10-v141-restore-readback-001`.

### Candidate

- Dev launcher -> v1.4.2 / build `1.4.2-tool-enablement-preferences`.
- `witch-dock-preferences` -> v0.3.0 / build `0.3.0-tool-enablement-store`.
- `witch-dock-module-loader` -> v0.1.2 / build `0.1.2-preferences-enablement-read`.
- Utilities registry -> v1.2.2 / build `1.2.2-tool-enablement-preferences`.
- Centralizes only `kw.witchDock.toolEnabled.<id>` persistence. Existing precedence is preserved exactly: bootstrap host-only read; module loader page-only read; Utilities page-first then host fallback; Utility writes still mirror page string + host boolean.
- Module scheduling, fetch concurrency/order, execution order, enable/disable actions, and tool registration remain unchanged.
- Baseline before candidate: loader 23/23 / 0 failed; page keys for `expanded-ui-scroll-guards` and `hf-ui-slot-bridge` are `"true"`; both Utilities toggles are checked/enabled; module-loader page key is absent.
- Checked-in `Witch_Dock.user.js` remains unchanged. Public Stable and canonical Dev remain untouched.

**Runtime/module/manifest/public behavior changed:** task-branch persistence ownership and launcher/preferences/loader/Utilities registry versions changed; public Stable unchanged.

---

## DOCK-2026-09-17-018 — Route section collapse/order preferences through bounded host

Date: 2026-09-17

### Candidate

- Dev launcher -> v1.4.1 / build `1.4.1-section-preferences-host`.
- `witch-dock-preferences` -> v0.2.0 / build `0.2.0-section-state-host`.
- Adds bounded ownership for existing section-collapse keys `kw.witchDock.ui.<tool>.<section>.collapsed` and section-order keys `kw.witchDock.sectionOrder.<tool>`.
- Exact legacy fallback/serialization semantics are preserved: collapsed state defaults on null/undefined/read failure; section order returns [] on absent/invalid data and filters parsed values to strings; order writes remain JSON.
- Core `createSection()`, click handling, section drag logic, DOM ordering and drag indicators remain unchanged; only their persistence helpers become thin wrappers.
- Current Booth baseline before candidate: section `booth` present first and expanded; all 12 observed Dock sections report `data-collapsed="0"`.
- Tool enablement storage remains legacy and is not part of this slice.
- Checked-in `Witch_Dock.user.js` remains unchanged.
- Public Stable and canonical Dev remain untouched.

**Runtime/module/manifest/public behavior changed:** task-branch section preference ownership and module/launcher versions changed; public Stable unchanged.

---

## DOCK-2026-09-17-017 — Begin Stage D with bounded main preference store

Date: 2026-09-17

### Candidate

- Stage C is complete after v1.3.9 bone-footer human visual parity PASS.
- Dev launcher -> v1.4.0 / build `1.4.0-extracted-main-preferences`.
- Added `features/core/Witch_Dock_Preferences.js`, registry id `witch-dock-preferences`, v0.1.0 / build `0.1.0-main-store-host`.
- Moves only `kw.witchDock.v1` load/save/default orchestration out of the Stable-derived core and routes storage through the existing bounded host `storage.get/storage.set` capability.
- Preserves the exact storage key, defaults, JSON serialization, first-run fallback semantics, and existing mutable `prefs` object used by drag/resize/minimize/tab behavior.
- Core wrappers keep `loadPrefs()` / `savePrefs()` call sites unchanged; no drag/resize/minimize/compact/tab/section/undo/redo behavior moved in this slice.
- Existing section-collapse/order and manifest tool-enable storage are intentionally still legacy responsibilities for later bounded slices.
- Baseline before change: Dock open at left 368px / top 157px, width ~662px / height ~916px; compact launcher hidden; control set unchanged.
- Checked-in `Witch_Dock.user.js` remains unchanged.
- Public Stable and canonical Dev remain untouched.

### Live result

- v1.4.0 launcher running / error null; preferences v0.1.0 configured; loader 23/23 / 0 failed.
- Existing Dock geometry survived the update unchanged at startup: left 368 / top 157 / width 660 / height 914; compact launcher remained hidden.
- Controlled normal minimize action changed the Dock to minimized and advanced bounded preference saves with lastError null.
- Manual HeroForge reload then loaded the exact persisted startup snapshot with `minimized:true`, width 660, height 92, last-open width/height 660x914, active tab Booth, and firstRun false.
- Amanda visually confirmed the reloaded Dock looked good, then expanded/resized it normally; subsequent saves remained error-free.
- Main preference-store extraction PASS.

**Runtime/module/manifest/public behavior changed:** task-branch launcher/bootstrap preference ownership and registry changed; public Stable unchanged.

---

## DOCK-2026-09-17-016 — Extract bone HUD/detection behind bounded bootstrap module

Date: 2026-09-17

### Prior gate closure

- v1.3.8 About modal human visual gate PASS.
- User completed a real 4K capture successfully after the Booth/media readiness repair; the control was not merely enabled.
- Booth remained returned to OFF after automated validation.

### Candidate

- Dev launcher -> v1.3.9 / build `1.3.9-extracted-bone-hud`.
- Added `features/core/Witch_Dock_Bone_HUD.js`, registry id `witch-dock-bone-hud`, v0.1.0 / build `0.1.0-extracted-bone-hud`.
- The module is derived directly from the guarded Stable-derived `initBoneFooterAndDetection()` body. Detection candidate paths, scoring, 35 ms click delay, 60-try readiness loop, retry timing, DOM classes/text, capture listeners, and navigator clipboard fallback are preserved.
- Raw bone-copy `GM_setClipboard` use is removed from the extracted feature; it receives only the bounded host clipboard capability plus script metadata.
- Launcher fetches core/CSS/modals/bone HUD concurrently, validates the external API/version, and replaces the exact legacy bone HUD + `getScriptMeta()` block with a thin wrapper. Checked-in `Witch_Dock.user.js` remains unchanged.
- Baseline before extraction: one visible `.kwWDBoneRow`, idle text `No bone detected (click a body bone)`, disabled copy button, and the existing Dock/Undo/Redo footer hotkey line.
- Public Stable and canonical Dev remain untouched.

### Live parity result

- v1.3.9 launcher is running/error-null with external bone HUD v0.1.0 applied; loader completed 23/23 with 0 failures.
- Footer DOM/text/layout matches the pre-extraction baseline: one bone row, exact idle label/value, disabled copy button, and unchanged Dock/Undo/Redo hotkey line.
- Functional detector validation exposed a **pre-existing HeroForge compatibility bug**, not an extraction regression: current `HF.summonCircle` exists/ready, but all seven legacy fixed anchor paths resolve missing, so the preserved legacy detector cannot build candidates or attach listeners.
- Tracked separately as #26 and queued after #10; v1.3.9 is therefore gated on exact legacy parity plus human visual parity, not on pretending the already-broken detector works.
- Human visual gate PASS: Amanda confirmed the extracted Bone footer looks normal/unchanged.

**Runtime/module/manifest/public behavior changed:** task-branch launcher/bootstrap bone-HUD ownership and registry changed; public Stable unchanged.

---

## DOCK-2026-09-17-015 — Make media readiness follow explicit Booth transitions

Date: 2026-09-17

### Summary

- v1.3.8 modal repair passed fresh-page automated lifecycle validation: About lazy-creates on first open, About/Disclaimer remain single-instance and mutually exclusive, and close button/backdrop/Escape all pass.
- The accompanying Booth/media smoke exposed a separate timer-delivery defect: Booth reached native runtime/engine ready, but 4K/8K/WebP controls remained disabled after 6 seconds because their existing polling intervals did not refresh the UI.
- Capability diagnosis proved the media services themselves were healthy: `KWPhotoBoothTrueResolutionReadiness.sync()` returned true and immediately enabled 4K/8K; `KWSpinnyMiniWebP.readCapabilities()` returned Ready and `KWSpinnyMiniWebPUI.refresh()` immediately enabled WebP.
- Booth v27.0.6 now invokes those existing optional named readiness seams after each explicit/default Booth session transition, so OFF immediately refreshes media readiness without depending on timers.
- Booth Runtime Bootstrap v0.2.1 invokes the same optional named seams when asynchronous native Booth bootstrap completes or fails, so media controls refresh when the native runtime actually becomes ready.
- Existing timer polling remains unchanged as fallback. Optional media failures are isolated; no media module source or HeroForge private internals changed.
- Public Stable and canonical Dev remain untouched.
- Live manual-reload gate PASS: loader 23/23 / 0 failed in 221.9 ms; first Booth ON booted native runtime with one Booth script / zero duplicates and enabled 4K/8K/WebP without manual readiness calls; OFF disabled them; second ON reused live BT with one script / zero duplicates and re-enabled all three; final state returned Booth OFF.
- v1.3.8 About modal was then opened successfully for the remaining human visual gate.

**Runtime/module/manifest/public behavior changed:** task-branch Booth tool/bootstrap versions and deterministic cache keys changed; public Stable unchanged.

---

## DOCK-2026-09-17-014 — Fix fresh-page About lazy creation

Date: 2026-09-17

### Summary

- Booth v27.0.5 / runtime bootstrap v0.2.0 final live regression passed on a normal manually refreshed HeroForge page: cold activation completed once, one native Booth script loaded, native maker became ready, 4K/8K/WebP enabled, loader remained 23/23 with zero failures, and off/on reused live BT with zero duplicates. Booth was left OFF; defaults/persistence remained unchanged.
- The required fresh-page human modal gate exposed a separate v1.3.7 bug before visual review: `KWWitchDockModals.openAbout()` did not create the About overlay when it had not already been created.
- Root cause is confirmed in source: `openDisclaimer()` calls its `ensureDisclaimer()` lazy creator, while `openAbout()` omitted `ensureAbout()`. The earlier structural probe had explicitly called `ensureAbout()` first and therefore masked the fresh-page path.
- Modal module patched to v0.1.1 / build `0.1.1-lazy-about-open`; `openAbout()` now invokes `ensureAbout()` before opening.
- Dev launcher bumped to v1.3.8 / build `1.3.8-modal-lazy-about-fix` so the corrected modal module has a fresh deterministic cache identity.
- No Booth/runtime-bootstrap code changed in this patch. Public Stable and canonical Dev remain untouched.

**Runtime/module/manifest/public behavior changed:** task-branch launcher/modal module and registry identity changed; public Stable unchanged.

---

## DOCK-2026-09-17-013 — Make explicit Booth activation independent of timer polling

Date: 2026-09-17

### Summary

- v1.3.7 modal extraction baseline passed: Dev running/error null, external modal module configured, lazy modal creation preserved, and loader 23/23 with 0 failures.
- About/Disclaimer structural lifecycle passed automated validation: one overlay each, correct Dev name/version/footer/links/content, no duplicate creation, and mutual exclusion preserved.
- A Booth regression check on the same page proved a separate reliability defect: an explicit session Booth request stayed pending for 10 seconds while `Booth_Runtime_Bootstrap` remained at attempts=0, showing its 200 ms timer-only trigger had not fired.
- Added a direct optional handoff from Booth v27.0.5 / build `v27.0.5-explicit-session-handoff` to Booth Runtime Bootstrap v0.2.0 when a Booth session is turned on.
- Synchronized Booth's source-local/public API version fields to 27.0.5 so runtime diagnostics match the manifest/build identity.
- Gave the corrected Booth candidate a fresh deterministic build/cache identity so a prior task-branch CDN response cannot survive the source-sync rewrite.
- The bootstrap still uses HeroForge-native `BT.setBoothMode()` and retains the existing polling path as fallback; no direct `maker.enable()` bypass was added.
- Direct handoff is failure-isolated: Booth continues normally if the optional bootstrap capability is absent.
- Public Stable and canonical Dev remain untouched; human modal visual gate and live direct-handoff regression are still required.

**Runtime/module/manifest/public behavior changed:** task-branch Booth tool/bootstrap integration and module/cache-key versions changed; public Stable unchanged.

---

## DOCK-2026-09-17-012 — Extract About/Disclaimer UI behind bootstrap module

Date: 2026-09-17

- Completed the Booth v0.1.2 blocker live gate after a normal manual HeroForge refresh: one version-matched native Booth script, native maker/runtime ready, 4K/8K/WebP enabled, no bootstrap error, and off/on cycle preserved one script plus existing persistence/default values.
- Bumped the task launcher to v1.3.7 / build `1.3.7-extracted-core-modals` while preserving fixed Tampermonkey `@name WITCH DOCK - DEV`.
- Added `features/core/Witch_Dock_Modals.js`, registry id `witch-dock-modals`, v0.1.0 / build `0.1.0-extracted-about-disclaimer`.
- Launcher now fetches core, CSS, and modal JS in parallel through bounded `PRIVILEGED_HOST.requestText`; modal JS receives only bounded script metadata and the existing GitHub/Ko-fi URLs.
- Added guarded runtime extraction for the exact legacy About/Disclaimer block: all six legacy modal functions must exist exactly once, then their implementations are replaced with thin wrappers to `UW.KWWitchDockModals`.
- `getScriptMeta()` remains in core because bone HUD still consumes it. Header handlers, modal DOM ids/classes/content, mutual exclusion, close/Escape/overlay behavior, links, and version display are preserved.
- Checked-in `Witch_Dock.user.js` remains unchanged/Stable-derived; no storage, registry, drag/minimize, hotkey, undo/redo, bone-HUD, loader, or unrelated feature ownership moved.
- The Bridge helper used for pre-install static fetch did not execute candidate code because its nested helper config JSON failed to parse; this is recorded as probe-transport failure, not candidate failure. Installed v1.3.7 is the required syntax/runtime gate.
- Public `Witch_Scripts` and canonical `WITCH_DEV_MAIN` remain untouched.

**Runtime/module/manifest/public behavior changed:** task-branch launcher/modal ownership and registry changed; public Stable unchanged.

---

## DOCK-2026-09-17-011 — Repair cold-page Booth activation during v1.3.6 validation

- Bumped `booth-runtime-bootstrap` to v0.1.2 / build `0.1.2-session-cold-start` with deterministic cache key.
- Current-session Booth View now cold-starts HeroForge's version-matched `/gated/booth.js` when native `BT` is absent, then delegates activation to native `BT.setBoothMode()`; no direct `maker.enable()` bypass remains.
- Final live PASS: native `BT.maker.enabled=true`, runtime/engine ready, one Booth script / zero duplicates, 4K/8K/WebP enabled, no error; off/on cycle preserved defaults and persistence. Bridge: `hf-20260917-wd10-booth-final-activate-001`, `hf-20260917-wd10-media-controls-final-001`, `hf-20260917-wd10-booth-cycle-final-001`.

---

## DOCK-2026-09-17-010 — Extract core Dock CSS behind privileged bootstrap

- v1.3.6 / build `1.3.6-extracted-core-css`; added `features/core/Witch_Dock_Styles.css` v0.1.0.
- Core + stylesheet fetched in parallel through the bounded host; guarded CSS parity permits only the approved compact-icon 40px→48px delta; legacy `addStyles()` is no-op'd at runtime to prevent duplicate insertion.
- Live automated and Amanda visual gates passed; one effective stylesheet, correct 48px emblem, normal Dock appearance, loader 23/23 / 0 failed.

---

## Current prior milestones

- **009:** enlarged correct compact emblem to 48px inside unchanged 54px button; human gate PASS.
- **008:** restored known-good inline emblem after external asset failed visual gate.
- **007:** stabilized Tampermonkey identity as fixed `WITCH DOCK - DEV`.
- **006:** external compact-emblem experiment; runtime pass / visual fail.
- **005:** v1.3.1 host-owned bootstrap core fetch.
- **004:** v1.3.0 bounded privileged-host seam.
- **003:** issue #10 core contract freeze.
- **002:** canonical Dev identity/routing and cleanup rules.
- **001:** clean Stable-derived `WITCH_DEV_MAIN` governance baseline.
