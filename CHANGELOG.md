# Changelog

## 2026-09-20 — Issue #28 RC host gate prepared

- Added durable handoff state for temporary Public RC Host v0.1.0 at `wd/28-public-rc-host` commit `536b89c7747e0a2f1f0f31561b1194ea00f73f3f`.
- Recorded static PASS and healthy HF-Chat-Bridge v0.4.0 ping (#2961).
- Exact next step is now the one-time Tampermonkey RC-host install/disable switch followed by Bridge-driven live validation.
- No runtime/module/manifest/public Stable code changed on canonical Dev.

**Runtime/module/manifest/public behavior changed:** no; documentation/handoff only.

---

Rolling current Dev log. Older detail remains durable in Git history/issues.

## DOCK-2026-09-20-051 — Public promotion handoff checkpoint

Date: 2026-09-20

- Persisted issue #28 release state after canonical Dev PASS and public RC construction.
- Public RC is `wd/28-public-rc` @ `95b5cdae4c8840d950d984c73bce101ba887011e`.
- Public immutable payload is `aa54a3cdb6785c5bf78a7b04b5ddccf09cc37b2a`.
- Stable remains `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`; rollback archive exists.
- Exact RC live gate remains pending.
- Recorded that HF-Chat-Bridge host lacks GM_addStyle/GM_setClipboard/GM_download and therefore cannot faithfully host the public launcher directly.
- Exact next action is a temporary isolated Public RC Host followed by the explicit Stable-promotion approval gate.

**Runtime/module/manifest/public behavior changed:** none; handoff/router only.

---

## DOCK-2026-09-20-049 — Canonical Dev v1.5.1 smoke PASS

Date: 2026-09-20

- Auto-host v0.1.1 successfully retargeted normal delivery to canonical `WITCH_DEV_MAIN`.
- Canonical launcher v1.5.1 / `1.5.1-canonical-dev-reconcile` ran from pinned payload `6603911658b426c6b95367697bedcc4c7acf67eb`.
- Core v2.0.0 running; Loader v0.2.0 completed 23/23 with 0 failures, immutable resolution=23, fallback=0.
- Legacy monolith fetch/source transforms remained false.
- One Dock/compact/icon and visible `WITCH DOCK - DEV v1.5.1` title confirmed.
- Evidence: `hf-20260920-wd28-canonical-dev-reload-069`, `hf-20260920-wd28-canonical-dev-smoke-070`.
- Public Stable remains untouched.

**Runtime/module/manifest/public behavior changed:** none; canonical smoke record only.

---

## DOCK-2026-09-19-048 — Canonical Dev reconciliation candidate v1.5.1

Date: 2026-09-19

- Release issue #28 begins; issue #10 remains closed.
- Canonical Dev candidate preserves the validated modular runtime while advancing only the Dev launcher/channel identity to v1.5.1 / build `1.5.1-canonical-dev-reconcile`.
- Launcher update/download URLs and runtime branch identity are normalized to `WITCH_DEV_MAIN`.
- Launcher pins immutable payload `6603911658b426c6b95367697bedcc4c7acf67eb`.
- Payload fallback URLs are canonicalized to `WITCH_DEV_MAIN`; normal Loader v0.2.0 resolution remains immutable-payload-root.
- Main-only `TASK_MODE_ROUTER.md` governance is preserved in the reconciliation merge.
- No feature/core/module source behavior changed from the validated architecture.
- Public Stable remains untouched.

**Runtime/module/manifest/public behavior changed:** Dev channel/release identity only; public Stable unchanged.

---

## DOCK-2026-09-19-045 — Issue #10 COMPLETE / final human visual PASS

Date: 2026-09-19

- Amanda reviewed the live v1.5.0 Dock after the complete Stage E automated regression and confirmed it looks normal.
- Stage E and issue #10 are complete.
- Validated architecture baseline: Dev launcher v1.5.0, Core v2.0.0, Loader v0.2.0, immutable payload commit `6cbc7c5530391d3b8611374ce051bde080ea1a2d`, 23/23 modules executed, 0 failed.
- The temporary Stable-monolith fetch/source-transform bootstrap is retired from Dev.
- Public Stable remains unchanged; no promotion is implied or authorized by closing #10.

**Runtime/module/manifest/public behavior changed:** documentation/acceptance state only in this commit; public Stable unchanged.

---

## DOCK-2026-09-19-044 — Stage E automated live PASS

Date: 2026-09-19

- Dev v1.5.0 loaded through the auto-host from immutable payload commit `6cbc7c5530391d3b8611374ce051bde080ea1a2d`.
- Launcher diagnostics: running/error-null, immutablePayload=true, legacyMonolithFetched=false, legacySourceTransforms=false.
- Core v2.0.0 running.
- Loader v0.2.0 completed 23/23 modules with 0 failures; immutableResolutionCount=23 and fallbackResolutionCount=0.
- Final bounded regressions passed for Dock lifecycle, drag, corner/bottom resize, compact threshold/click, hotkey guard/toggle, History boundary, modals, Bone HUD, public WitchDock seams, representative tools, and section-order persistence.
- Temporary test state was fully restored: Booth active, 380x520 Dock, compact hidden, Utilities order `booth-features, bound-decal-gizmo, heroforge-ui`, all three Utilities sections expanded.
- Automated Stage E is complete. One human visual gate remains before issue #10 closure.

**Runtime/module/manifest/public behavior changed:** Dev Stage E candidate validated; public Stable unchanged.

---

## DOCK-2026-09-19-043 — v1.5.0 immutable launcher activation candidate

Date: 2026-09-19

- Dev launcher advances to v1.5.0 / build `1.5.0-immutable-modular-bootstrap`.
- Launcher shrinks to a small channel/privilege/bootstrap host and pins payload commit `6cbc7c5530391d3b8611374ce051bde080ea1a2d` directly.
- Human-readable payload ref `wd/payload-1.5.0` points to that commit, but runtime compatibility depends on the immutable SHA.
- Launcher contains no legacy monolith fetch, `devSource` text surgery, or Stable-derived block sentinels.
- Bootstrap component versions/builds remain strict.
- Stage E live regression is still required before issue #10 can be called complete.

**Runtime/module/manifest/public behavior changed:** Dev Stage E activation candidate only; public Stable unchanged.

---

## DOCK-2026-09-19-042 — Stage E immutable payload candidate

Date: 2026-09-19

- Added `Witch_Dock_Core.js` v2.0.0 / build `2.0.0-modular-orchestrator` as the final composition/startup owner.
- Added `Witch_Dock_Assets.js` v0.1.0 preserving the exact known-good compact emblem data URL.
- Advanced Module Loader to v0.2.0 / build `0.2.0-immutable-payload-root`.
- Loader keeps concurrent fetch, deterministic manifest-order execution, cache-key behavior, and per-module failure isolation, but now prefers `KWWitchDockPayloadRoot + moduleRegistry.path` when an immutable payload root is supplied.
- Manifest remains 23 runtime modules and every runtime module has a registry path.
- This commit is the immutable Stage E payload candidate only; launcher activation and live regression follow in a separate commit so the Dev task branch cannot expose a half-migrated runtime.
- Public Stable and legacy `Witch_Dock.user.js` are unchanged.

**Runtime/module/manifest/public behavior changed:** isolated Stage E payload candidate; public Stable unchanged.

---

## DOCK-2026-09-19-041 — Stage D COMPLETE / v1.4.13 Application live PASS

Date: 2026-09-19

- Auto-host delivered v1.4.13 with Application v0.1.0 configured/error-null.
- Loader remained 23/23 / 0 failed.
- Preserved 6 tabs, 9 mounted tools, 12 sections, active-tab persistence, public `WitchDock.registerTool` / `ensureDock` / `downloadBlob` seams, and 380x520 Dock geometry at x=820/y=244.
- Real section drag persisted order `bound-decal-gizmo, booth-features, heroforge-ui`; inverse drag restored exact baseline `booth-features, bound-decal-gizmo, heroforge-ui`.
- Application telemetry after restore: sectionDragStarts=2, sectionDragDrops=2, lastError=null.
- Stage D application-shell extraction is complete. Stage E final bootstrap reduction begins next.
- Evidence: `hf-20260919-wd10-v1413-state-048`, `hf-20260919-wd10-v1413-section-reorder-real-050`, `hf-20260919-wd10-v1413-section-restore-051`.

**Runtime/module/manifest/public behavior changed:** Dev ownership only; public Stable unchanged.

---

## DOCK-2026-09-19-040 — v1.4.13 final Stage D Application Shell candidate

Date: 2026-09-19

- Launcher advances to v1.4.13.
- Added `witch-dock-application` v0.1.0 / build `0.1.0-shell-registry-orchestration`.
- Moves the remaining contiguous ordinary application-shell block: shared DOM/layout helpers, active-tab/tab creation/order, section creation/collapse/order/drag, tool API/mount/registration.
- Application uses existing Preferences + History APIs and Registry-owned containers; no raw GM capability is exposed.
- The validated v1.4.6 content-box geometry correction now lives physically in the Application module instead of launcher source transformation.
- Removed obsolete launcher source transforms for section collapse/order and Dock snapshot.
- Baseline: 6 canonical tabs, Booth active, 9 tools, 12 sections, one 380x520 Dock at 820/244, public WitchDock seams intact; Booth->Utilities->Booth selection persistence passed; Utilities section order is booth-features / bound-decal-gizmo / heroforge-ui.

**Runtime/module/manifest/public behavior changed:** Dev task-branch ownership only; public Stable unchanged.

---

## DOCK-2026-09-19-039 — v1.4.12 History live boundary PASS

Date: 2026-09-19

- Auto-host delivered v1.4.12 without Tampermonkey intervention.
- Launcher: running/error-null; History v0.1.0 configured/error-null; loader 23/23 / 0 failed.
- Genuine HeroForge UndoQueue remained length=1/currentIndex=0 with canUndo=false/canRedo=false.
- Undo and Redo buttons remained disabled; programmatic clicks were no-ops and did not alter queue/index.
- History telemetry remained clean: fallbackLoadCalls=0, lastError=null. Queue hooks were installed only on methods actually present.
- No synthetic HeroForge history was created merely to obtain a non-boundary test.
- Evidence: `hf-20260919-wd10-v1412-history-gate-043`.

**Runtime/module/manifest/public behavior changed:** Dev ownership only; public Stable unchanged.

---

## DOCK-2026-09-19-038 — v1.4.12 undo/redo History candidate

Date: 2026-09-19

- Launcher advances to v1.4.12.
- Added `witch-dock-history` v0.1.0 / build `0.1.0-undo-redo-owner`.
- Moves the live CK.UndoQueue-backed Dock undo/redo seam into a dedicated non-privileged module while preserving native undo/redo preference, fallback index/load behavior, button-state sync, queue wrapping, and `__kwDockWrapped`.
- Confirmed the later keyboard-dispatch duplicates are inside the legacy minimize block already removed by the lifecycle transform and are not the current live button implementation.
- Safe baseline at genuine queue boundary: length=1/index=0, both buttons disabled, clicks no-op; no synthetic HeroForge history created.

**Runtime/module/manifest/public behavior changed:** Dev task-branch ownership only; public Stable unchanged.

---

## DOCK-2026-09-19-037 — v1.4.11 Dock hotkey live PASS

Date: 2026-09-19

- Auto-host delivered v1.4.11 without Tampermonkey intervention.
- Launcher: running/error-null; interactions v0.5.0 configured/error-null; loader 23/23 / 0 failed.
- Ctrl+Backquote remained ignored.
- Plain Backquote closed the Dock to compact; a second plain Backquote restored exact 380x520 geometry.
- Hotkey telemetry: install calls=1, toggles=2, ignored=1, lastError=null.
- Evidence: `hf-20260919-wd10-v1411-hotkey-gate-039`.

**Runtime/module/manifest/public behavior changed:** Dev ownership only; public Stable unchanged.

---

## DOCK-2026-09-19-036 — v1.4.11 Dock hotkey candidate

Date: 2026-09-19

- Launcher advances to v1.4.11; interactions module advances to v0.5.0.
- Grave-key Dock hotkey ownership moves behind the interaction module with the exact legacy repeat/modifier/editable-target/code guards, capture-phase document listener, preventDefault, and close/expand dispatch.
- Undo/redo, loader contracts, storage keys, DOM/CSS, and Stable remain unchanged.
- Baseline: Ctrl+Backquote ignored; plain Backquote closes to compact; second plain Backquote restores the exact 380x520 Dock.

**Runtime/module/manifest/public behavior changed:** Dev task-branch interaction ownership only; public Stable unchanged.

---

## DOCK-2026-09-19-035 — v1.4.10 compact drag/click live PASS

Date: 2026-09-19

- Auto-host delivered v1.4.10 without Tampermonkey intervention.
- Launcher: running/error-null; interactions v0.4.0 configured/error-null; loader 23/23 / 0 failed.
- Compact drag parity: x/y 16/907 -> 34/921 for +18/+14, Dock remained closed; inverse drag restored exact 16/907.
- No-drag pointerdown/up reopened the Dock at 380x520 and hid compact.
- Telemetry: startCompactDragCalls=3, compactDragMoveCalls=2, compactDragEndCalls=3, compactDragCancelCalls=0, compactClickExpandCalls=1, lastError=null.
- Evidence: `hf-20260919-wd10-v1410-compact-gate-036`.

**Runtime/module/manifest/public behavior changed:** Dev ownership only; public Stable unchanged.

---

## DOCK-2026-09-19-034 — v1.4.10 compact drag/click candidate

Date: 2026-09-19

- Launcher advances to v1.4.10; interactions module advances to v0.4.0.
- Compact icon pointer ownership moves behind the interaction module with the exact legacy primary/button guards, pointer capture, 5 px threshold, viewport clamping, compact position persistence, capture-phase listener cleanup/cancel, and no-drag reopen behavior.
- Shell DOM, hotkey/undo-redo, loader contracts, storage keys, and Stable remain unchanged.
- Baseline: compact 16/907 -> 34/921 on +18/+14 drag while Dock stays closed; inverse drag restores 16/907; no-drag release reopens 380x520 Dock and hides compact.

**Runtime/module/manifest/public behavior changed:** Dev task-branch interaction ownership only; public Stable unchanged.

---

## DOCK-2026-09-19-033 — v1.4.9 Dock resize live PASS

Date: 2026-09-19

- Auto-host delivered v1.4.9 without Tampermonkey intervention.
- Launcher: running/error-null; interactions v0.3.0 configured/error-null; loader 23/23 / 0 failed.
- Corner resize parity: 380x520 -> 402x537 -> 380x520, with persisted width/height + last-open fields matching every DOM state.
- Bottom resize parity: 380x520 -> 380x547 -> 380x520, with width preserved and height + lastOpenHeight matching.
- Extracted telemetry: corner start/move/end 2/2/2; bottom start/move/end 2/2/2; lastError=null.
- Evidence: `hf-20260919-wd10-v149-resize-gate-032`, `hf-20260919-wd10-v149-resize-telemetry-033`.

**Runtime/module/manifest/public behavior changed:** Dev ownership only; public Stable unchanged.

---

## DOCK-2026-09-19-032 — v1.4.9 Dock resize candidate

Date: 2026-09-19

- Launcher advances to v1.4.9; interactions module advances to v0.3.0.
- Corner and bottom resize ownership move together behind the interaction module with the exact legacy guards, clamps, width/height persistence, last-open updates, resize state lifecycle, listener cleanup, and final size-constraint enforcement.
- Compact drag mechanics, hotkey/undo-redo, loader contracts, storage keys, and Stable remain unchanged.
- Reversible baselines: corner 380x520 -> 402x537 -> 380x520; bottom 380x520 -> 380x547 -> 380x520.

**Runtime/module/manifest/public behavior changed:** Dev task-branch interaction ownership only; public Stable unchanged.

---

## DOCK-2026-09-19-031 — v1.4.8 main Dock drag live PASS

Date: 2026-09-19

- Dev auto-host fetched launcher v1.4.8 on Bridge reload with no Tampermonkey update.
- Launcher reached running/error-null; interactions v0.2.0 configured/error-null; loader remained 23/23 / 0 failed.
- Reversible parity matched exactly: 820/244 -> 844/262 for +24/+18 pointer delta, then inverse drag restored both DOM and persisted prefs to 820/244.
- Interaction telemetry proved extracted ownership: 2 drag starts, 2 move callbacks, 2 end callbacks.
- Evidence: `hf-20260919-wd10-v148-state-025`, `hf-20260919-wd10-v148-drag-cycle-026`.

**Runtime/module/manifest/public behavior changed:** Dev task-branch ownership only; public Stable unchanged.

---

## DOCK-2026-09-19-030 — v1.4.8 main Dock drag candidate

Date: 2026-09-19

- Launcher advances to v1.4.8; interactions module advances to v0.2.0.
- Main Dock header drag ownership moves behind the existing interaction module with exact legacy exclusions, viewport clamp, x/y writes, and pointer listener cleanup.
- Resize, compact-drag mechanics, lifecycle behavior, hotkeys/undo-redo, loader contracts, storage keys, and Stable are unchanged.
- Reversible baseline: 820/244 -> 844/262 for +24/+18 pointer delta, then exact restore to 820/244.

**Runtime/module/manifest/public behavior changed:** Dev task-branch interaction ownership only; public Stable unchanged.

---

## DOCK-2026-09-19-029 — v1.4.7 lifecycle extraction live PASS

Date: 2026-09-19

- Dev auto-host fetched launcher v1.4.7 on a Bridge-driven reload with no Tampermonkey update.
- Launcher reached running/error-null; interactions v0.1.0 configured with lastError:null; loader remained 23/23 / 0 failed.
- Minimize/restore matched the v1.4.6 baseline exactly: 380x520 -> 380x92 -> 380x520 CSS.
- Collapse/reopen matched baseline exactly: Dock hidden + compact visible at x=16/y=907, then no-drag compact pointer cycle restored the Dock to 380x520 CSS / 382x522 rendered at x=820/y=244 with compact hidden.
- Module telemetry proved extracted ownership: 2 minimize calls, 1 close call, 1 expand call.
- Evidence: `hf-20260919-wd10-v147-state-021`, `hf-20260919-wd10-v147-cycle-022`.

**Runtime/module/manifest/public behavior changed:** ownership moved on Dev task branch only; public Stable unchanged.

---

## DOCK-2026-09-19-028 — v1.4.7 minimize / compact lifecycle candidate

Date: 2026-09-19

- Issue #10 Stage D resumed after the Bridge runtime-host and Dev auto-host gates passed.
- Added `witch-dock-interactions` v0.1.0 / build `0.1.0-minimize-compact-lifecycle`.
- Launcher advances to v1.4.7 / build `1.4.7-extracted-minimize-compact-lifecycle`.
- Only minimize, close-to-compact, and expand-from-compact lifecycle ownership moves; drag/resize, compact pointer mechanics, hotkeys/undo-redo, storage keys, loader behavior, and Stable remain unchanged.
- Pre-change live baseline captured the exact v1.4.6 minimize/restore/collapse/reopen transitions for parity comparison.

**Runtime/module/manifest/public behavior changed:** Dev task-branch ownership only; public Stable unchanged.

---

## DOCK-2026-09-18-027 — Close v1.4.6 geometry gate and pause issue #10

Date: 2026-09-18

### Live PASS

- Launcher v1.4.6 is running with `error:null`.
- Shell v0.2.0 / build `0.2.0-main-and-compact-dom` remains applied once with no shell error.
- Loader remains complete at 23 total / 23 enabled / 23 executed / 0 failed.
- Pre-cycle persisted Dock geometry is exactly 380x520 CSS width/height and last-open width/height; rendered outer box is 382x522 at unchanged x/y.
- Normal Collapse-to-icon kept the persisted geometry at 380x520 while hiding the Dock and showing the compact launcher.
- One no-drag compact reopen restored the Dock, hid the compact launcher, preserved one root/compact/icon only, and kept persisted geometry exactly 380x520 with rendered outer box exactly 382x522.
- The legacy +2 px growth is therefore fixed by the v1.4.6 snapshot correction.
- Evidence: `hf-20260918-wd10-v146-baseline-read-001`, `hf-20260918-wd10-v146-after-collapse-read-001`, `hf-20260918-wd10-v146-final-read-001`.

### Pause

- Issue #10 is intentionally PAUSED here for the planned HF-Chat-Bridge upgrade.
- Do not continue Stage D extraction, Stage E cleanup, integration, promotion, or Stable work until explicit resume after the Bridge upgrade.

**Runtime/module/manifest/public behavior changed:** none in this record-only commit.

---

## DOCK-2026-09-18-026 — Stabilize compact close/open Dock geometry

Date: 2026-09-18

### v1.4.5 live finding

- Compact DOM extraction itself passed startup and interaction parity: one root/compact/icon, correct 54x54 / 48x48 structure, loader 23/23 / 0 failed, normal collapse and no-drag reopen both worked.
- The full gate exposed an existing lifecycle bug: 382x522 rendered outer geometry reopened as 384x524.
- Root CSS uses content-box sizing with a border. Legacy `snapshotCurrentDockPositionToPrefs()` saves border-inclusive `getBoundingClientRect()` dimensions into values later applied as CSS content-box width/height, producing +2 px growth each cycle.
- Test-induced persisted geometry was restored to the original 380x520 CSS values with position unchanged.

### Candidate

- Dev launcher -> v1.4.6 / build `1.4.6-compact-geometry-stability`.
- No shell-module version/API change.
- Guarded transform changes only last-open width/height snapshot math to use computed CSS dimensions, with bounding-box values retained only as fallback.
- No close/open, compact DOM, drag, minimize, size-enforcement, storage ownership, loader or public-seam logic moves.
- Checked-in `Witch_Dock.user.js` remains unchanged; normal manifest module count remains 23.
- After live PASS, pause issue #10 for the planned HF-Chat-Bridge upgrade.

**Runtime/module/manifest/public behavior changed:** task-branch legacy geometry snapshot correction + launcher version only; public Stable and canonical Dev unchanged.

---

## DOCK-2026-09-18-025 — Externalize compact launcher DOM factory

Date: 2026-09-18

### Diagnosis

- Compact launcher DOM construction is separable from its lifecycle and drag behavior.
- `showClosedCompact()`, `startCompactDrag()`, `closeDock()`, `expandFromCompact()`, hotkey behavior and compact position persistence remain legacy-owned.

### Candidate

- Dev launcher -> v1.4.5 / build `1.4.5-compact-dom-factory`.
- `witch-dock-shell` -> v0.2.0 / build `0.2.0-main-and-compact-dom`.
- Adds only a compact DOM factory using the existing legacy `el()` helper, inline emblem URL and legacy pointerdown callback.
- Launcher guards and replaces only the legacy compact constructor; append-to-body and all lifecycle consumers remain unchanged.
- Baseline: one 54x54 `#kwWDCompact`, one 48x48 `#kwWDCompactIcon`, inline PNG data URL, title/alt preserved, draggable false, hidden while Dock is open.
- Normal manifest-loaded module count remains 23. Checked-in `Witch_Dock.user.js` remains unchanged.

**Runtime/module/manifest/public behavior changed:** task-branch compact DOM ownership and launcher/shell versions changed; public Stable and canonical Dev unchanged.

---

## DOCK-2026-09-18-024 — Close v1.4.4 main-shell DOM live gate

Date: 2026-09-18

### Live PASS

- Dev launcher v1.4.4 is running with `error:null`.
- `witch-dock-shell` v0.1.0 / build `0.1.0-main-root-dom` is applied exactly once; shell diagnostics report one create call and no error.
- Loader remains complete at 23 total / 23 enabled / 23 started / 23 fetched / 23 executed / 0 failed.
- Exactly one `#kwWitchDock` root exists.
- Direct child order remains Header, Tabs, Body, Footer, Bottom Resize, Corner Resize.
- Header controls remain About, Minimize/Expand, Collapse-to-icon with unchanged ids/text/titles/classes.
- Tab frame remains Left/Shade/Right with unchanged cue, Undo and Redo controls.
- Body/footer and both resizer references remain present; compact launcher count remains one.
- Rendered root geometry remains exactly the baseline 382x522 box at the preserved position.
- Evidence: `hf-20260918-wd10-v144-live-gate-read-001`.

### Next bounded slice

- Diagnose compact/minimize/layout lifecycle ownership before editing. Keep drag/resize and hotkey/undo-redo behavior isolated until their own bounded extraction.

**Runtime/module/manifest/public behavior changed:** none in this record-only commit.

---

## DOCK-2026-09-18-023 — Externalize main Dock root DOM factory

Date: 2026-09-18

### Diagnosis

- The safest next Stage D shell seam is the main `#kwWitchDock` root tree only.
- Compact launcher DOM and all position/size/minimize/close/expand/drag/resize behavior remain coupled and are intentionally not moved with this slice.
- Tabs/tools/sections remain under their existing legacy consumers; registry containers remain owned by the v1.4.3 registry module.

### Candidate

- Dev launcher -> v1.4.4 / build `1.4.4-main-shell-dom`.
- New `witch-dock-shell` -> v0.1.0 / build `0.1.0-main-root-dom`.
- Shell module creates the existing root/header/title/disclaimer/About/minimize/close/tab-frame/undo/redo/body/footer/resizer DOM using the existing legacy `el()` helper and injected legacy callbacks.
- Launcher guards the exact legacy root-construction + state-reference block before replacing only that block with `KWWitchDockShell.createRoot(...)`.
- Position/sizing, compact launcher creation, minimize/close/expand, drag/resize, tab overflow, hotkeys, undo/redo implementation, tabs/tools/sections and public `WitchDock` seams remain unchanged.
- Baseline `hf-20260918-wd10-v144-shell-baseline-read-001`: root children Header/Tabs/Body/Footer/BottomResize/CornerResize; legacy control/tab-frame IDs present; compact launcher present; current rendered box 382x522.
- Normal manifest-loaded module count remains 23. Checked-in `Witch_Dock.user.js` remains unchanged.

**Runtime/module/manifest/public behavior changed:** task-branch main-shell DOM ownership and launcher/module versions changed; public Stable and canonical Dev unchanged.

---

## DOCK-2026-09-18-022 — Close v1.4.3 registry-container live gate

Date: 2026-09-18

### Live PASS

- Dev launcher v1.4.3 is running with `error:null`.
- `witch-dock-registry` v0.1.0 / build `0.1.0-tab-tool-state-containers` is applied.
- Loader remains complete at 23 total / 23 enabled / 23 started / 23 fetched / 23 executed / 0 failed.
- Registry diagnostics report 6 tabs, 9 tools and 0 pending after startup.
- Rendered visual tab order remains Body Editor, Pose, Decals, Booth, JSON, Utilities with Pose active.
- Rendered mounted tool IDs remain the same nine baseline tools and section count remains 12.
- Public `WitchDock.registerTool`, `WitchDock.ensureDock`, and `WitchDock.downloadBlob` remain functions.
- Registry Map insertion order differs from visual tab order by design because visual order is still owned by the legacy tab reorder logic; this is not a regression.
- Evidence: `hf-20260918-wd10-v143-live-gate-read-001`.

### Next bounded slice

- Diagnose shell/layout ownership before editing. Do not move resize/drag/minimize/compact/hotkey/undo-redo behavior opportunistically.

**Runtime/module/manifest/public behavior changed:** none in this record-only commit.

---

## DOCK-2026-09-18-021 — Externalize tab/tool registry backing state

Date: 2026-09-18

### Diagnosis

- Current core has no independent section registry. Sections are created through `api.ui.createSection(...)` and discovered from rendered DOM by `finalizeToolSections()`.
- The actual registry backing state is exactly `state.tabs`, `state.toolsById`, and pre-UI `state.pending`.
- Existing tab DOM/order/activation, tool mounting/rendering/replacement, section creation/finalization/order/drag, sizing and public `UW.WitchDock` seams remain coupled to the legacy core and are intentionally not moved in this slice.

### Candidate

- Dev launcher -> v1.4.3 / build `1.4.3-registry-state-containers`.
- New `witch-dock-registry` -> v0.1.0 / build `0.1.0-tab-tool-state-containers`.
- The bootstrap fetches and validates the registry module through the existing bounded repository-text transport.
- The guarded core transform replaces exactly three legacy allocations with the external backing containers; all consumers continue using `state.tabs`, `state.toolsById`, and `state.pending` exactly as before.
- Normal manifest-loaded module count remains 23. Checked-in `Witch_Dock.user.js` remains unchanged.
- Baseline Bridge evidence `hf-20260918-wd10-v143-registry-baseline-compact-read-001`: 23/23 / 0 failed; tabs Body Editor, Pose(active), Decals, Booth, JSON, Utilities; nine mounted tool IDs; 12 sections; all three public seams are functions.

**Runtime/module/manifest/public behavior changed:** task-branch registry backing-state ownership and launcher/module versions changed; public Stable and canonical Dev unchanged.

---

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
