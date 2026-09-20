# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-19  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Active architecture branch:** `wd/10-modular-bootstrap`  
**Canonical installed Dev userscript:** `Witch_Dock_DEV.user.js`  
**Stable baseline:** `Witch_Scripts` @ `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`  
**Current phase:** issue #10 Stage E ACTIVE. Immutable modular payload candidate is staged off the known-good Stage D head; activation launcher/live gate still pending.

## Current priorities

1. #10 — ACTIVE, Stage E. Build immutable payload commit first, then pin the v1.5.0 launcher to that exact commit SHA and run the full final Dev regression gate.
2. #19 — keep Tampermonkey identity fixed as `WITCH DOCK - DEV`; version belongs in `@version` and visible Dock title.
3. #12 / #7 / #8 / #13 / #14 remain standing migration/backlog/cleanup work; do not expand scope during #10.

## Completed live milestones

- v1.3.0 privileged host: PASS; raw GM privileges not page-exposed; loader 23/23, 0 failed.
- v1.3.1 host-owned core fetch: PASS.
- v1.3.3 stable Tampermonkey identity: PASS.
- v1.3.2/v1.3.3 external compact emblem: FAIL visual gate; wrong asset.
- v1.3.4 restored known-good inline emblem: PASS.
- v1.3.5 48x48 emblem inside 54x54 button: PASS human gate.
- v1.3.6 external core CSS: PASS automated + human visual gate; one effective stylesheet, correct 48x48 emblem, loader 23/23, 0 failed.
- Booth v0.1.2 cold-start blocker: PASS final native-owned lifecycle gate after a normal manual HeroForge refresh. Cold Booth request loaded one version-matched `/gated/booth.js`, native `BT.maker.enabled=true`, runtime/engine ready, 4K/8K/WebP enabled, no error; off/on cycle kept one script and preserved defaults/persistence. Bridge requests: `hf-20260917-wd10-booth-final-activate-001`, `hf-20260917-wd10-media-controls-final-001`, `hf-20260917-wd10-booth-cycle-final-001`.

## v1.3.7 candidate — extracted About/Disclaimer UI

- New `features/core/Witch_Dock_Modals.js`, registry id `witch-dock-modals`, v0.1.0 / build `0.1.0-extracted-about-disclaimer`.
- Launcher v1.3.7 fetches core, stylesheet, and modal module in parallel through bounded `PRIVILEGED_HOST.requestText`.
- Modal module receives only bounded script metadata plus existing GitHub/Ko-fi URLs; no raw GM capability is exposed.
- Launcher guards the exact legacy modal block and all six legacy modal function names, then replaces only those implementations with thin wrappers to `UW.KWWitchDockModals`.
- `getScriptMeta()` remains in the core because the bone HUD still uses it. Header button handlers and all modal DOM ids/classes/text/close semantics remain unchanged.
- Checked-in `Witch_Dock.user.js` remains byte-identical to the Stable-derived monolith; this is another guarded runtime ownership seam, not physical source deletion yet.
- The attempted Bridge static-fetch helper failed in the helper's nested config JSON before executing candidate code; it is not candidate-failure evidence. Final syntax/runtime proof belongs to the installed v1.3.7 live gate.

## Completed blocker repair — explicit Booth handoff

- On the v1.3.7 page, an explicit Booth request remained pending for 10 seconds while bootstrap attempts stayed at 0; the 200 ms timer-only trigger had not executed.
- Booth v27.0.5 now calls optional `KW_WD_BOOTH_BOOTSTRAP.requestSession()` when session Booth is enabled.
- Runtime bootstrap v0.2.0 handles that bounded request immediately and still delegates activation to HeroForge-native `BT.setBoothMode()`; polling remains a fallback.
- No direct maker-enable bypass is reintroduced.
- Final normal-refresh validation passed: cold activation, native maker/media readiness, off/on reuse, zero duplicates, and preserved defaults/persistence.

## v1.3.9 candidate — extracted bone HUD/detection

- New `features/core/Witch_Dock_Bone_HUD.js`, v0.1.0 / build `0.1.0-extracted-bone-hud`.
- Derived directly from the guarded legacy `initBoneFooterAndDetection()` body; detection paths/scoring/timing/retries/listeners and footer DOM/text are preserved.
- Bone copy now receives only bounded host clipboard capability; the extracted module contains no raw `GM_setClipboard`.
- Launcher fetches the bone module in parallel with core/CSS/modals and replaces the exact legacy bone + script-meta block with a thin wrapper.
- Baseline Bridge request: `hf-20260917-wd10-bone-baseline-001`.
- Live automated parity PASS: v1.3.9 running/error-null, module v0.1.0 applied, loader 23/23 / 0 failed, exact baseline footer DOM/text/layout preserved.
- Current HeroForge compatibility finding: `HF.summonCircle` is ready but all seven legacy fixed anchor paths are absent; the same legacy detector logic was already stale before extraction. Tracked as #26 for post-refactor repair.
- Human footer visual parity PASS. Stage C presentation extraction is complete.
- #26 remains queued after #10 and is not part of the architecture migration.

## v1.4.0 candidate — bounded main preference store

- New `features/core/Witch_Dock_Preferences.js` v0.1.0 / build `0.1.0-main-store-host`.
- Owns only `kw.witchDock.v1` defaults/load/save through bounded host storage.
- Core call sites remain `loadPrefs()/savePrefs()` wrappers so drag/resize/minimize/compact/tab logic is unchanged.
- Section collapse/order and tool enablement storage remain legacy for later slices.
- Baseline Bridge request: `hf-20260917-wd10-stageD-prefs-baseline-001`.
- Live PASS: v1.4.0 running/error-null; loader 23/23; prior geometry preserved; controlled minimize saved successfully; manual reload startup snapshot loaded minimized=true from the same store; Amanda visual check good.
- Main preference-store extraction is closed.

## v1.4.1 live PASS — section collapse/order preferences

- `Witch_Dock_Preferences.js` v0.2.0 / build `0.2.0-section-state-host`.
- Normal Booth header click changed `data-collapsed` 0→1 and recorded exactly one bounded write to `kw.witchDock.ui.booth-tool.booth.collapsed`.
- Bridge-driven normal page reload restored Booth collapsed from the same key; launcher remained running/error-null and loader remained 23/23 / 0 failed.
- All 12 observed Dock sections remained present in the same order with no duplicate/missing symptoms.
- Booth was restored expanded through the same normal header click; bounded write diagnostics remained error-free.
- Evidence: `hf-20260917-wd10-v141-collapse-readback-001`, `hf-20260917-wd10-v141-postreload-001`, `hf-20260917-wd10-v141-restore-readback-001`.

## v1.4.2 live PASS — tool-enablement persistence

- Dev launcher v1.4.2 / build `1.4.2-tool-enablement-preferences`; preferences v0.3.0; module loader v0.1.2; Utilities registry v1.2.2.
- Initial clean startup: launcher running/error-null, loader 23 enabled/started/fetched/executed, 0 failed, both Utility page keys `"true"`.
- Normal Decals Scroll Guards checkbox OFF: page key became `"false"`, preferences recorded one page write + one host write with `lastError:null`, live scroll-guard style/classes were removed.
- Reload while OFF: loader remained complete with 23 total / 22 enabled+executed / 0 failed; only `expanded-ui-scroll-guards` was `disabled`; Utilities restored its checkbox OFF.
- Normal checkbox ON: page key returned `"true"`, mirrored page+host write diagnostics incremented, then async live re-enable restored the scroll-guard API/style and `Enabled for this session.` status.
- Final reload restored 23/23 / 0 failed with the Utility ON and page key `"true"`.
- Evidence: `hf-20260917-wd10-v142-scrollguards-off-read-001`, `hf-20260917-wd10-v142-off-postreload-read-001`, `hf-20260917-wd10-v142-scrollguards-on-read-001`, `hf-20260917-wd10-v142-scrollguards-on-settle-read-001`, `hf-20260917-wd10-v142-final-snapshot-read-001`.
- Confirmed bootstrap hardening finding: before the cache-busted v1.4.2 install took effect, installed launcher v1.4.1 fetched the moving task branch's newer preferences v0.3.0 and rejected it against its v0.2.0 expectation. Stage E must remove this launcher/module skew hazard with an immutable or otherwise compatibility-safe bootstrap source strategy; do not paper over it by weakening current module validation without a deliberate contract.

## Protected state

- Public `Witch_Scripts` and canonical `WITCH_DEV_MAIN` remain untouched during task-branch validation.
- Existing storage keys, `WitchDock` public seams, module ordering/cache keys/failure isolation, Dock layout/interactions, hotkeys, undo/redo, and bone HUD contracts remain protected by `ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md`.
- Correct compact emblem remains inline; `ASSETS/emblem.png` is not used.
- HeroForge retains native Booth character-readiness and maker-enable ownership.
- HF-Chat-Bridge remains development infrastructure only.

## Current blocker repair — media readiness handoff

- Booth/runtime capability is healthy, but 4K/8K/WebP polling timers failed to refresh controls even after 6 seconds.
- Manual existing named seams immediately fixed the controls: TRUE-resolution readiness `sync()` returned true and WebP `readCapabilities()` returned Ready / UI `refresh()` returned true.
- Booth v27.0.6 now refreshes those optional named seams on session transitions; bootstrap v0.2.1 refreshes them after async native Booth bootstrap completion/failure.
- Existing timers remain fallback; no capture service/UI implementation or private HeroForge internals changed.
- Live gate PASS on manual reload: loader 23/23 / 0 failed in 221.9 ms; first ON enabled 4K/8K/WebP after a single native Booth bootstrap; OFF disabled them; second ON reused live BT with one Booth script / zero duplicates and re-enabled them; final state Booth OFF.
- About modal human visual gate PASS. User also completed a real 4K capture successfully. Booth/media repair remains PASS.

## v1.3.8 modal lazy-open repair

- Fresh-page visual-gate setup proved `openAbout()` did not create its overlay unless `ensureAbout()` had already been called.
- Root cause: missing `ensureAbout()` at the start of `openAbout()`; Disclaimer already had the correct lazy-create pattern.
- `Witch_Dock_Modals.js` v0.1.1 / build `0.1.1-lazy-about-open` adds only that missing call.
- Launcher v1.3.8 pins modal v0.1.1 with a new deterministic cache identity.
- v1.3.8 modal lifecycle and human visual gate PASS.

## v1.3.8 live gate

1. Existing fixed-name Dev install updates in place to v1.3.8; Dev state reaches `running` / `error:null`, `coreModalsMode: external-bootstrap-module`, `coreModalsApplied:true`.
2. `KWWitchDockModalsInfo` and `KWWitchDockModals.getState()` report v0.1.1 / build `0.1.1-lazy-about-open` and configured=true; no modal overlays exist before first use.
3. About button creates exactly one `#kwWDAboutOverlay`; title/footer/links match prior behavior; close button, overlay click, and Escape work; reopen creates no duplicate.
4. Disclaimer creates exactly one `#kwWDDisclaimerOverlay`, closes About when opened, preserves exact content/footer, and closes via button/overlay/Escape without duplicates.
5. Loader remains 23/23 with 0 failures; v1.3.6 CSS remains healthy; Booth v27.0.6 + bootstrap v0.2.1 must pass the media-readiness handoff regression.
6. Human visual gate: PASS; About looked normal/unchanged.
7. Bone HUD/detection extraction is now the active Stage C slice; do not integrate/promote Stable yet.

## v1.4.3 live PASS — registry backing-container extraction

- Diagnosis confirmed there is no independent section registry in the current core. Sections are created through `api.ui.createSection(...)`, then discovered from rendered DOM by `finalizeToolSections()`; section collapse/order/drag behavior remains legacy-owned.
- The actual registry backing state is exactly `state.tabs`, `state.toolsById`, and pre-UI `state.pending`.
- New `features/core/Witch_Dock_Registry.js` v0.1.0 / build `0.1.0-tab-tool-state-containers` owns only those three containers and exposes diagnostic `getState()`.
- Launcher v1.4.3 / build `1.4.3-registry-state-containers` fetches/validates the registry module through the existing bounded bootstrap transport and guards the exact three-allocation legacy state block before redirecting the core state fields to the external containers.
- `ensureTab()`, `setActiveTab()`, `mountTool()`, `registerTool()`, duplicate replacement, pending flush, tab ordering, tool rendering, section creation/finalization, drag/order behavior, sizing and all public `UW.WitchDock` seams are unchanged.
- Baseline Bridge evidence `hf-20260918-wd10-v143-registry-baseline-compact-read-001`: loader 23/23 / 0 failed; tab order Body Editor, Pose(active), Decals, Booth, JSON, Utilities; nine mounted tool containers; 12 sections; `registerTool`, `ensureDock`, and `downloadBlob` all functions.
- Live gate PASS: launcher v1.4.3 running/error-null; registry v0.1.0 applied; loader 23/23 / 0 failed; registry reports 6 tabs / 9 tools / 0 pending; rendered order remains Body Editor, Pose(active), Decals, Booth, JSON, Utilities; nine mounted tool IDs and 12 sections match baseline; registerTool/ensureDock/downloadBlob remain functions. Evidence: `hf-20260918-wd10-v143-live-gate-read-001`.
- Moving task-branch launcher/module skew remains a separate confirmed Stage E hardening requirement.

## v1.4.4 live PASS — main Dock root DOM factory

- Diagnosis isolated the smallest safe shell seam: the main `#kwWitchDock` root tree only.
- New `features/core/Witch_Dock_Shell.js` v0.1.0 / build `0.1.0-main-root-dom` creates the existing header, title/disclaimer controls, About/minimize/close controls, tab frame, undo/redo controls, body/footer and bottom/corner resize handles using the existing legacy `el()` helper plus injected legacy callbacks.
- Launcher v1.4.4 / build `1.4.4-main-shell-dom` fetches/validates the shell module and guards the exact legacy root-construction + state-ref assignment block before replacing only that block.
- Position/size application, compact launcher DOM, minimize/close/expand behavior, main/compact drag, resize logic, active-tab logic, hotkeys, undo/redo implementation, tabs/tools/sections, registry containers and public `WitchDock` seams remain unchanged.
- Baseline evidence `hf-20260918-wd10-v144-shell-baseline-read-001`: root children are Header/Tabs/Body/Footer/BottomResize/CornerResize; controls and tab-frame child IDs match legacy; current rect 382x522 CSS box; compact launcher remains present.
- Live gate PASS: launcher v1.4.4 running/error-null; shell v0.1.0 applied once with no error; loader 23/23 / 0 failed; exactly one Dock root exists; direct child order, header controls, tab-frame/right controls and body/footer/resizer references match baseline; compact launcher count remains one; rendered root geometry remains exactly 382x522 at the preserved position. Evidence: `hf-20260918-wd10-v144-live-gate-read-001`.
- No human visual gate is required unless appearance differs.

## v1.4.5 candidate — compact launcher DOM factory

- Diagnosis separated compact DOM construction from compact lifecycle/interaction.
- `Witch_Dock_Shell.js` advances to v0.2.0 / build `0.2.0-main-and-compact-dom` and adds only `createCompact(...)`.
- Launcher v1.4.5 / build `1.4.5-compact-dom-factory` guards the exact legacy compact constructor and replaces it with the shell factory while leaving `state.compactExpandBtn`, append-to-body, show/hide/position, click-vs-drag threshold, persistence and expand/close logic unchanged.
- Baseline `hf-20260918-wd10-v145-compact-baseline-read-001`: one `#kwWDCompact`, title `Open Witch Dock`, one `#kwWDCompactIcon`, 54x54 container, 48x48 icon, inline PNG data URL, alt `Witch Dock`, draggable false, hidden while Dock is open.
- Required live gate: install/update v1.4.5, confirm shell v0.2.0 applied once; loader 23/23 / 0 failed; one compact launcher/icon with exact baseline attributes/sizes; Dock remains open with compact hidden; then perform one reversible normal Collapse-to-icon -> compact click-open cycle and confirm no duplicate roots/compact nodes and preserved Dock geometry.
- Dragging the compact launcher is not part of this slice and must not be exercised as a mutation gate.

## v1.4.5 live result — compact DOM good; lifecycle gate exposed legacy drift

- Startup parity PASS: launcher v1.4.5 running/error-null; shell v0.2.0 created root and compact DOM exactly once; loader 23/23 / 0 failed; one root/compact/icon only; 54x54 compact + 48x48 inline icon contract preserved.
- Normal Collapse-to-icon PASS: one root/compact/icon remained; Dock hid and compact displayed normally.
- Normal no-drag compact reopen restored the Dock and hid compact with no duplicate nodes.
- Full geometry criterion did not pass: pre-cycle outer box was 382x522; post-cycle outer box became 384x524.
- Diagnosis confirmed this is legacy lifecycle math, not the v1.4.5 constructor extraction: root is content-box with a border; legacy snapshot stores border-inclusive `getBoundingClientRect().width/height` as future CSS `width/height`, causing +2 px growth.
- Test-induced persisted width/height and lastOpenWidth/lastOpenHeight were restored from 382x522 to the original 380x520 CSS values through the bounded preferences API; x/y and all other state were preserved. Evidence: `hf-20260918-wd10-v146-geometry-verify-read-001`.

## v1.4.6 live PASS — compact close/open geometry stability

- Dev launcher v1.4.6 / build `1.4.6-compact-geometry-stability`.
- No shell-module API/version change; compact DOM extraction from v1.4.5 remains intact.
- Guarded runtime patch changes only `snapshotCurrentDockPositionToPrefs()`: preserve the Dock's computed CSS width/height values instead of copying border-inclusive bounding-box dimensions into future CSS dimensions.
- Snapshot x/y, anchored-state detection, close/open lifecycle, compact DOM, drag threshold, minimize/expand, size enforcement, persistence owner, loader and public seams remain unchanged.
- Live gate PASS: postreload baseline was 380x520 persisted CSS geometry / 382x522 rendered outer box with one root/compact/icon, shell v0.2.0 created once and loader 23/23 / 0 failed. Normal Collapse-to-icon preserved 380x520 persisted width/height and last-open dimensions while hiding Dock/showing compact. One no-drag compact reopen restored Dock and hid compact with persisted geometry still exactly 380x520, rendered outer box exactly 382x522, x/y unchanged, node counts 1/1/1 and loader still 23/23 / 0 failed. Evidence: `hf-20260918-wd10-v146-baseline-read-001`, `hf-20260918-wd10-v146-after-collapse-read-001`, `hf-20260918-wd10-v146-final-read-001`.
- Issue #10 is now PAUSED for the HF-Chat-Bridge upgrade. Do not begin another extraction slice until explicitly resumed.


## v1.4.7 candidate — minimize / compact lifecycle extraction

- New `features/core/Witch_Dock_Interactions.js` v0.1.0 / build `0.1.0-minimize-compact-lifecycle`.
- Moves only `toggleMinimize()`, `closeDock()`, and `expandFromCompact()` behavior behind a configured non-privileged module. The existing shell button handlers and compact pointer-drag/click threshold remain wired through thin core wrappers.
- The module receives existing mutable `state` / `prefs` references plus bounded legacy helpers; it receives no raw `GM_*` capability and does not depend on HF-Chat-Bridge.
- Drag, resize, compact dragging mechanics, hotkey, undo/redo, tab/section behavior, storage keys, geometry snapshot fix, and loader behavior remain unchanged in this slice.
- Captured v1.4.6 baseline before editing: open Dock 380x520 CSS / 382x522 rendered at x=820/y=244; minimize -> 92px CSS height and restore -> 520px; collapse -> compact visible at x=16/y=907; no-drag compact pointer cycle -> exact original open geometry.
- Baseline evidence: `hf-20260919-wd10-v147-baseline-018`, `hf-20260919-wd10-v147-baseline-cycle-019`.
- Live PASS: auto-host fetched v1.4.7 without a Tampermonkey update; launcher running/error-null; interactions v0.1.0 configured/error-null; loader 23/23 / 0 failed; minimize -> 92px, restore -> 520px, collapse -> compact visible at x=16/y=907, and no-drag compact reopen -> exact 380x520 CSS / 382x522 rendered geometry at x=820/y=244.
- Interaction module telemetry after the gate: toggleMinimizeCalls=2, closeDockCalls=1, expandFromCompactCalls=1, lastError=null.
- Evidence: `hf-20260919-wd10-v147-state-021`, `hf-20260919-wd10-v147-cycle-022`.


## v1.4.8 candidate — main Dock drag extraction

- `Witch_Dock_Interactions.js` advances to v0.2.0 / build `0.2.0-main-dock-drag`.
- Moves only `startDockDrag(e)` and its temporary window pointermove/pointerup handlers. It preserves controls/resize-handle exclusion, right/bottom clearing, viewport clamping, per-move x/y persistence, and listener cleanup.
- Existing shell still binds the header to a thin core wrapper; no DOM/CSS change.
- Resize corner/bottom, compact pointer drag/click threshold, lifecycle methods, hotkey/undo-redo, tabs/sections, and loader remain unchanged.
- Baseline: pointer delta +24/+18 moved DOM and prefs 820/244 -> 844/262; inverse drag restored both exactly to 820/244. Evidence: `hf-20260919-wd10-v148-drag-baseline-023`.
- Live PASS: auto-host delivered v1.4.8; launcher running/error-null; interactions v0.2.0 configured/error-null; loader 23/23 / 0 failed. +24/+18 drag moved DOM/prefs 820/244 -> 844/262; inverse drag restored both exactly to 820/244. Telemetry: startDockDragCalls=2, dockDragMoveCalls=2, dockDragEndCalls=2, lastError=null. Evidence: `hf-20260919-wd10-v148-state-025`, `hf-20260919-wd10-v148-drag-cycle-026`.


## v1.4.9 candidate — Dock resize extraction

- `Witch_Dock_Interactions.js` advances to v0.3.0 / build `0.3.0-dock-resize`.
- Moves both legacy resize handlers as one ownership seam: corner width+height and bottom height-only. Preserves closed/minimized guards, preventDefault/stopPropagation, `state.isResizing` + `resizeStart`, min/max viewport clamping, per-move width/height + last-open persistence, pointer listener cleanup, and final `enforceSizeConstraints()`.
- Compact pointer drag/click mechanics and hotkey/undo-redo remain legacy-owned.
- v1.4.8 baselines: corner 380x520 -> 402x537 then restored 380x520; bottom 380x520 -> 380x547 then restored 380x520; persisted width/height + lastOpenWidth/Height matched every DOM step.
- Evidence: `hf-20260919-wd10-v149-corner-baseline-027`, `hf-20260919-wd10-v149-corner-restore-028`, `hf-20260919-wd10-v149-bottom-baseline-029`, `hf-20260919-wd10-v149-bottom-restore-030`.
- Live PASS: auto-host v1.4.9, launcher running/error-null, interactions v0.3.0 configured/error-null, loader 23/23 / 0 failed. Corner sequence matched 380x520 -> 402x537 -> 380x520; bottom matched 380x520 -> 380x547 -> 380x520; persisted width/height and last-open fields matched each DOM step. Telemetry: corner start/move/end = 2/2/2, bottom start/move/end = 2/2/2, lastError=null. Evidence: `hf-20260919-wd10-v149-resize-gate-032`, `hf-20260919-wd10-v149-resize-telemetry-033`.


## v1.4.10 candidate — compact drag/click extraction

- `Witch_Dock_Interactions.js` advances to v0.4.0 / build `0.4.0-compact-drag-click`.
- Moves the full compact pointer lifecycle: primary/left-button guards, preventDefault, pointer capture/release, 5 px drag threshold, viewport clamping, compactX/Y persistence, capture-phase window move/up/cancel listener cleanup, and no-drag reopen.
- Existing compact DOM remains owned by the shell module and still calls a thin `startCompactDrag(e)` wrapper.
- Hotkey and undo/redo remain legacy-owned.
- v1.4.9 baseline: collapse shows compact at 16/907; +18/+14 real drag -> 34/921 and Dock remains closed; inverse drag -> exact 16/907; no-drag pointerdown/up reopens Dock at 380x520 and hides compact.
- Evidence: `hf-20260919-wd10-v150-compact-baseline-034`.
- Live PASS: auto-host v1.4.10, launcher running/error-null, interactions v0.4.0 configured/error-null, loader 23/23 / 0 failed. Compact 16/907 -> 34/921 -> 16/907 matched exactly; Dock remained closed during real drags; no-drag pointer cycle reopened the 380x520 Dock and hid compact. Telemetry: startCompactDragCalls=3, compactDragMoveCalls=2, compactDragEndCalls=3, compactDragCancelCalls=0, compactClickExpandCalls=1, lastError=null. Evidence: `hf-20260919-wd10-v1410-compact-gate-036`.


## v1.4.11 candidate — Dock hotkey extraction

- `Witch_Dock_Interactions.js` advances to v0.5.0 / build `0.5.0-dock-hotkey`.
- Moves `isEditableTarget()` + `installDockHotkey()` into the interaction module while preserving repeat/modifier/editable-target/non-Backquote guards, capture-phase document listener, preventDefault, and closed/open dispatch to the already-extracted close/expand lifecycle.
- The Stable-derived core keeps only a thin `installDockHotkey()` wrapper so its existing startup call remains unchanged.
- Undo/redo dispatch and buttons remain legacy-owned.
- v1.4.10 baseline: Ctrl+Backquote ignored with Dock open; plain Backquote closes to compact; second plain Backquote reopens exact 380x520 Dock and hides compact.
- Evidence: `hf-20260919-wd10-v1411-hotkey-baseline-037`.
- Live PASS: auto-host v1.4.11, launcher running/error-null, interactions v0.5.0 configured/error-null, loader 23/23 / 0 failed. Ctrl+Backquote was ignored; plain Backquote closed to compact; second plain Backquote restored the exact 380x520 Dock. Telemetry: installDockHotkeyCalls=1, hotkeyToggleCalls=2, hotkeyIgnoredCalls=1, lastError=null. Evidence: `hf-20260919-wd10-v1411-hotkey-gate-039`.


## v1.4.12 candidate — undo / redo History extraction

- New `features/core/Witch_Dock_History.js` v0.1.0 / build `0.1.0-undo-redo-owner`.
- Moves the actual live Dock history seam: `CK.UndoQueue` lookup, `CK.tryLoadCharacter` fallback, button enablement sync, triggerUndo/Redo, and queue-method wrapping. It preserves the existing named HeroForge contract and `__kwDockWrapped` marker.
- The later duplicate keyboard-dispatch undo/redo functions lived inside the legacy minimize block and were already removed by the v1.4.7 lifecycle transform; they are not the live button implementation.
- Baseline live queue currently has length=1/currentIndex=0; Undo and Redo are both disabled, and programmatic clicks leave queue/index unchanged. No synthetic history was injected.
- Evidence: `hf-20260919-wd10-v1412-undo-baseline-read-040`, `hf-20260919-wd10-v1412-history-boundary-041`.
- Live PASS at the genuine queue boundary: auto-host v1.4.12; History v0.1.0 configured/error-null; loader 23/23 / 0 failed; queue length/index remained 1/0; canUndo/canRedo false; both buttons disabled; clicking both remained a no-op; fallbackLoadCalls=0; lastError=null. Evidence: `hf-20260919-wd10-v1412-history-gate-043`. A real non-boundary undo/redo remains opportunistic regression evidence when genuine HeroForge history exists.


## v1.4.13 candidate — final Stage D Application Shell extraction

- New `features/core/Witch_Dock_Application.js` v0.1.0 / build `0.1.0-shell-registry-orchestration`.
- Moves the remaining contiguous ordinary application-shell block from `el()` through `registerTool()`: DOM helper, clamp/viewport/position/size/minimized/compact display helpers, active-tab sizing/switching/order, tab creation, section create/collapse/order/drag, tool API construction, mount and registration.
- Uses the already-extracted Preferences API for section state/order and the History API for undo/redo button synchronization; contains no raw GM capability.
- The v1.4.6 content-box geometry fix is now physical module code rather than a runtime source patch.
- Existing Registry module remains the owner of tabs/tools/pending containers; Shell remains root/compact DOM owner; Interactions remains drag/resize/minimize/compact/hotkey owner; History remains CK.UndoQueue owner.
- Pre-change baseline: one 380x520 Dock at x=820/y=244; rendered tabs Body/Pose/Decals/Booth/JSON/Utilities with Booth active; Registry 6 tabs / 9 tools / 0 pending; 12 sections; public registerTool/ensureDock/downloadBlob functions present. Tab switch Booth -> Utilities -> Booth persisted activeTab correctly and preserved geometry.
- Utilities section baseline order: `booth-features`, `bound-decal-gizmo`, `heroforge-ui`.
- Evidence: `hf-20260919-wd10-stageD-app-baseline-044`, `hf-20260919-wd10-stageD-app-interaction-baseline-045`, `hf-20260919-wd10-stageD-section-baseline-046`.
- Required live gate: auto-host v1.4.13; Application v0.1.0 configured/error-null; loader 23/23 / 0 failed; exact tabs/tools/sections/public seams/geometry parity; reversible Booth<->Utilities tab switch; reversible Utilities section reorder/restore; no duplicates.


## Stage E — final bootstrap reduction

- Stage D is COMPLETE through v1.4.13.
- Stage E must remove the temporary pattern where the Dev launcher fetches the Stable-derived `Witch_Dock.user.js`, text-transforms guarded blocks at runtime, and evals the transformed monolith.
- Final target: a small Tampermonkey userscript retaining only metadata/channel identity, bounded privileged host capabilities, startup/error handling, and deterministic loading of the GitHub-owned application/core modules.
- The confirmed moving-branch launcher/module version-skew hazard from v1.4.2 must be eliminated by immutable/compatibility-safe bootstrap sourcing; do not weaken module version validation.
- Preserve loader order/cache/failure isolation, storage keys, public `WitchDock` seams, visual/interaction behavior, and all passed Stage C/D contracts.
- HF-Chat-Bridge remains development infrastructure only and must not become a runtime dependency.


## Stage E payload candidate

- New Core v2.0.0 / build `2.0.0-modular-orchestrator` owns composition/startup only.
- New Assets v0.1.0 preserves the exact known-good compact emblem data URL.
- Module Loader advances to v0.2.0 / build `0.2.0-immutable-payload-root`.
- Loader behavior remains concurrent-fetch + deterministic manifest-order execution + per-module failure isolation, but when `KWWitchDockPayloadRoot` is present it resolves each enabled module from `moduleRegistry.path` under that immutable root.
- Manifest remains 23 runtime modules; every runtime module has a registry path.
- Payload commit will be created before the activation launcher. The launcher will pin the payload commit SHA directly, not a moving branch.
- Public Stable and legacy `Witch_Dock.user.js` remain untouched.

## Minimum continuation set

Read only: `PROJECT_CONTRACT.md`, this file, `ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md`, issue #10/#19, `MODULE_VERSIONING.md`, `Witch_Dock_DEV.user.js`, `manifest.json`, `DEV_DIVERGENCES.json`, `features/core/Witch_Dock_Styles.css`, `features/core/Witch_Dock_Modals.js`, `features/core/Witch_Dock_Preferences.js`, `features/core/Witch_Dock_Module_Loader.js`, `tools/Utilities.js`, `features/booth/Booth_Runtime_Bootstrap.js`, and the exact core responsibility being extracted.

Do not preload MASTER, full old logs, unrelated HISTORY files, or HeroForge.Compatibility unless current evidence requires them.
