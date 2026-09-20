# Pre-Flight Check Log

Rolling current Dev pre-flight record. Older detail remains in Git history/issues.

## PFC-2026-09-19-047 — Canonical payload fallback routing

Date: 2026-09-19

### PASS

- Manifest retains exactly 23 runtime modules.
- No payload manifest URL references `wd/10-modular-bootstrap`.
- Legacy fallback module URLs now resolve to `WITCH_DEV_MAIN`.
- Loader bootstrap fallback metadata points to Loader v0.2.0 / `0.2.0-immutable-payload-root`.
- Primary immutable payload-root resolution behavior is unchanged.
- No runtime module source bytes changed; public Stable untouched.

---

## PFC-2026-09-19-046 — Canonical Dev payload identity v1.5.1

Date: 2026-09-19

### PASS

- Base payload: `6cbc7c5530391d3b8611374ce051bde080ea1a2d`.
- Manifest retains 23 runtime modules and unchanged runtime module paths/versions/builds.
- Core remains v2.0.0 / `2.0.0-modular-orchestrator`.
- Loader remains v0.2.0 / `0.2.0-immutable-payload-root`.
- Only `witch-dock-dev-launcher` registry identity changes to v1.5.1 / `1.5.1-canonical-dev-reconcile`.
- No public Stable mutation.

### Next gate

Pin canonical `WITCH_DEV_MAIN/Witch_Dock_DEV.user.js` v1.5.1 to this payload commit SHA, then run canonical Dev smoke.

**Runtime/module/manifest/public behavior changed:** Dev launcher registry identity only.

---

## PFC-2026-09-19-042 — Stage E immutable payload candidate

Date: 2026-09-19

### Static / architecture checks

- Core v2.0.0 source parses and owns composition/startup only.
- Assets v0.1.0 source parses and preserves the exact legacy compact emblem data URL.
- Module Loader v0.2.0 source parses and preserves concurrent fetch + ordered execution + per-module failure isolation.
- Loader immutable mode resolves from `KWWitchDockPayloadRoot` and `moduleRegistry.path`; legacy `modules[].url` is fallback-only.
- Manifest remains 23 runtime modules; every runtime module has a registry path.
- Core/Assets/Loader registry version/build metadata is synchronized.
- No Stable code or legacy `Witch_Dock.user.js` mutation is included.

### Activation rule

Create this payload as a detached commit and readable payload ref first. Only after that commit exists may the Dev launcher be changed to pin the exact payload commit SHA. Do not move the live task branch onto a launcher that references a payload that does not yet exist.

**Runtime/module/manifest/public behavior changed:** isolated Stage E payload candidate; public Stable unchanged.

---

## PFC-2026-09-19-041 — Stage D COMPLETE / v1.4.13 Application live PASS

Date: 2026-09-19

### PASS

- Auto-host payload v1.4.13; launcher running/error-null.
- Application v0.1.0 configured=true / lastError=null.
- Loader 23/23 / 0 failed.
- 6 tabs / 9 tools / 12 sections.
- Public `WitchDock.registerTool`, `ensureDock`, `downloadBlob` remain callable.
- Dock geometry remains 380x520 CSS at x=820/y=244.
- Real section drag reorder persisted and inverse drag restored exact baseline order.
- Application telemetry: 2 drag starts / 2 drops; no error.

### Stage disposition

Stage D is complete. Proceed to Stage E final bootstrap reduction. Do not touch public Stable during Stage E development.

**Runtime/module/manifest/public behavior changed:** Dev ownership only; public Stable unchanged.

---

## PFC-2026-09-19-040 — v1.4.13 final Stage D Application Shell candidate

Date: 2026-09-19

### Static / contract checks

- Application v0.1.0 parses and contains the full guarded legacy el-through-registerTool application block with storage redirected to Preferences and history sync redirected to History.
- Application contains no raw GM_* privilege.
- v1.4.6 computed CSS width/height snapshot fix is physically present in Application.
- Launcher v1.4.13 parses, fetches/validates/configures Application, guards exactly one application-shell block and replaces it with thin wrappers.
- Obsolete source transforms for section collapse/order and Dock snapshot are removed.
- Isolated application-block transformed core parses.
- Manifest JSON parses and launcher/Application versions/builds are synchronized.

### Baseline

- Dock: 380x520 CSS at x=820/y=244.
- Tabs rendered in canonical order: Body Editor, Pose, Decals, Booth, JSON, Utilities; Booth active.
- Registry: 6 tabs / 9 tools / 0 pending.
- Sections: 12 total.
- Public WitchDock registerTool/ensureDock/downloadBlob all functions.
- Booth -> Utilities -> Booth normal clicks persist activeTab correctly and preserve geometry.
- Utilities sections: booth-features, bound-decal-gizmo, heroforge-ui.
- Evidence: `hf-20260919-wd10-stageD-app-baseline-044`, `hf-20260919-wd10-stageD-app-interaction-baseline-045`, `hf-20260919-wd10-stageD-section-baseline-046`.

### Required live gate

Auto-host v1.4.13, require Application configured/error-null and loader 23/23 / 0 failed; compare exact counts/order/public seams/geometry; repeat tab switch; perform one reversible Utilities section reorder and restore it before closing Stage D.

**Runtime/module/manifest/public behavior changed:** Dev ownership only; public Stable unchanged.

---

## PFC-2026-09-19-039 — v1.4.12 History live boundary PASS

Date: 2026-09-19

### PASS

- Auto-host payload: v1.4.12, launcher-executed, one attempt, no error.
- Launcher: running/error-null.
- History: v0.1.0 / build `0.1.0-undo-redo-owner`, configured=true, queueAvailable=true, lastError=null.
- Loader: 23/23 / 0 failed.
- Genuine queue remained length=1 / currentIndex=0 / canUndo=false / canRedo=false.
- Both Dock history buttons remained disabled and clicking both left queue/index unchanged.
- No fallback character load occurred; no synthetic queue history was introduced.
- Evidence: `hf-20260919-wd10-v1412-history-gate-043`.

### Next bounded action

Inventory remaining Stage D ownership against `ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md`. Do not begin Stage E until ordinary application-shell responsibilities are either externally owned or deliberately assigned to the final GitHub-owned application core.

**Runtime/module/manifest/public behavior changed:** Dev ownership only; public Stable unchanged.

---

## PFC-2026-09-19-038 — v1.4.12 undo/redo History candidate

Date: 2026-09-19

### Static / contract checks

- New History v0.1.0 source parses and preserves the live legacy CK.UndoQueue + CK.tryLoadCharacter behavior.
- Launcher v1.4.12 parses, fetches/validates History through the existing bounded repo transport, guards exactly one early history block, and replaces it with configure + thin wrappers.
- Isolated transformed Stable-derived core parses.
- Manifest JSON parses; launcher/history versions and builds are synchronized.
- History module receives no GM capability and HF-Chat-Bridge remains test infrastructure only.

### Safe baseline

- Genuine HeroForge queue: length=1, currentIndex=0.
- Undo button disabled; Redo button disabled.
- Clicking both at boundary leaves length/index exactly 1/0.
- No synthetic queue entry or model mutation was created merely to obtain test coverage.
- Evidence: `hf-20260919-wd10-v1412-undo-baseline-read-040`, `hf-20260919-wd10-v1412-history-boundary-041`.

### Required live gate

Bridge-reload through Dev auto-host, verify v1.4.12 / History v0.1.0 / loader 23/23, then require the same genuine boundary state and no-op behavior. Non-boundary undo/redo can be verified later when genuine history exists.

**Runtime/module/manifest/public behavior changed:** Dev task-branch ownership only; public Stable unchanged.

---

## PFC-2026-09-19-037 — v1.4.11 Dock hotkey live PASS

Date: 2026-09-19

### PASS

- Auto-host payload: v1.4.11, launcher-executed, one attempt, no error.
- Launcher: running/error-null.
- Interactions: v0.5.0 / build `0.5.0-dock-hotkey`, configured=true, lastError=null.
- Loader: 23/23 / 0 failed.
- Ctrl+Backquote left Dock open and compact hidden.
- Plain Backquote closed to compact.
- Second plain Backquote restored exact 380x520 Dock and hid compact.
- Telemetry: installDockHotkeyCalls=1, hotkeyToggleCalls=2, hotkeyIgnoredCalls=1.
- Evidence: `hf-20260919-wd10-v1411-hotkey-gate-039`.

### Next bounded slice

Inspect and extract undo/redo ownership without widening scope.

**Runtime/module/manifest/public behavior changed:** Dev ownership only; public Stable unchanged.

---

## PFC-2026-09-19-036 — v1.4.11 Dock hotkey candidate

Date: 2026-09-19

### Static / contract checks

- Interactions v0.5.0 parses and owns editable-target detection + the capture-phase Dock hotkey listener.
- Launcher v1.4.11 parses, pins interactions v0.5.0, requires `installDockHotkey`, guards exactly one legacy hotkey block, and replaces it with a thin wrapper while preserving the existing startup call site.
- Isolated transformed Stable-derived core parses.
- Manifest JSON parses and launcher/interactions registry versions/builds are synchronized.
- Undo/redo, DOM/CSS, storage keys, loader, and Stable are outside this slice.

### Baseline

- Ctrl+Backquote: ignored, Dock remains open.
- Plain Backquote: Dock closes to compact.
- Second plain Backquote: Dock reopens at exact 380x520, compact hidden.
- Evidence: `hf-20260919-wd10-v1411-hotkey-baseline-037`.

### Required live gate

Bridge-reload through Dev auto-host, verify v1.4.11 / interactions v0.5.0 / loader 23/23, repeat modifier-ignore + close/open sequence, and require exact parity plus hotkey telemetry.

**Runtime/module/manifest/public behavior changed:** Dev task-branch interaction ownership only; public Stable unchanged.

---

## PFC-2026-09-19-035 — v1.4.10 compact drag/click live PASS

Date: 2026-09-19

### PASS

- Auto-host payload: v1.4.10, launcher-executed, one attempt, no error.
- Launcher: running/error-null.
- Interactions: v0.4.0 / build `0.4.0-compact-drag-click`, configured=true, lastError=null.
- Loader: 23/23 / 0 failed.
- Real drag: compact 16/907 -> 34/921, prefs match, Dock remains hidden.
- Inverse real drag: compact restored exactly to 16/907.
- No-drag pointer cycle: compact hidden; Dock restored at 380x520.
- Telemetry: compact starts=3, moves=2, ends=3, cancels=0, click-expands=1.
- Evidence: `hf-20260919-wd10-v1410-compact-gate-036`.

### Next bounded slice

Extract Dock hotkey ownership only. Keep undo/redo outside this slice.

**Runtime/module/manifest/public behavior changed:** Dev ownership only; public Stable unchanged.

---

## PFC-2026-09-19-034 — v1.4.10 compact drag/click candidate

Date: 2026-09-19

### Static / contract checks

- Interactions v0.4.0 parses and owns the full compact pointer lifecycle.
- Launcher v1.4.10 parses, pins interactions v0.4.0, requires `startCompactDrag`, guards exactly one legacy compact-drag block, and replaces it with a thin wrapper.
- Isolated transformed Stable-derived core parses.
- Manifest JSON parses and launcher/interactions registry versions/builds are synchronized.
- Hotkey/undo-redo, DOM/CSS, storage keys, loader, and Stable are outside this slice.

### Baseline

- Collapse -> compact visible at x=16/y=907; Dock hidden.
- +18/+14 pointer movement crosses threshold -> compact x=34/y=921, prefs match, Dock stays hidden.
- Inverse drag -> exact x=16/y=907.
- No-drag pointerdown/up -> compact hidden; Dock reopens at 380x520.
- Evidence: `hf-20260919-wd10-v150-compact-baseline-034`.

### Required live gate

Bridge-reload through Dev auto-host, verify v1.4.10 / interactions v0.4.0 / loader 23/23, repeat drag/inverse/no-drag sequence, and require exact DOM/prefs parity plus compact interaction telemetry.

**Runtime/module/manifest/public behavior changed:** Dev task-branch interaction ownership only; public Stable unchanged.

---

## PFC-2026-09-19-033 — v1.4.9 Dock resize live PASS

Date: 2026-09-19

### PASS

- Auto-host payload: v1.4.9, launcher-executed, one attempt, no error.
- Launcher: running/error-null.
- Interactions: v0.3.0 / build `0.3.0-dock-resize`, configured=true, lastError=null.
- Loader: 23/23 / 0 failed.
- Corner: 380x520 -> 402x537 -> 380x520; all persisted width/height + last-open values matched.
- Bottom: 380x520 -> 380x547 -> 380x520; width remained unchanged, height + lastOpenHeight matched.
- Resize telemetry: corner 2/2/2 start/move/end; bottom 2/2/2.
- Evidence: `hf-20260919-wd10-v149-resize-gate-032`, `hf-20260919-wd10-v149-resize-telemetry-033`.

### Next bounded slice

Extract compact launcher drag/click ownership. Keep hotkey/undo-redo outside this slice.

**Runtime/module/manifest/public behavior changed:** Dev ownership only; public Stable unchanged.

---

## PFC-2026-09-19-032 — v1.4.9 Dock resize candidate

Date: 2026-09-19

### Static / contract checks

- Interactions v0.3.0 parses and retains both legacy resize calculations and state/listener lifecycles.
- Launcher v1.4.9 parses, pins interactions v0.3.0, requires both resize methods, passes bounded `computeMinDockHeightCollapsed`/clamp/viewport/prefs helpers, and guards exactly one legacy resize block before replacing it with thin wrappers.
- Isolated transformed Stable-derived core parses.
- Manifest JSON parses; launcher/interactions registry versions/builds are synchronized.
- Compact drag, hotkey/undo-redo, CSS/DOM, storage keys, loader, and Stable are outside this slice.

### Baselines

- Corner: 380x520 -> 402x537, all width/height + last-open fields match; restored exactly to 380x520.
- Bottom: 380x520 -> 380x547, width remains unchanged and height + lastOpenHeight track; restored exactly to 380x520.
- Evidence: `hf-20260919-wd10-v149-corner-baseline-027`, `hf-20260919-wd10-v149-corner-restore-028`, `hf-20260919-wd10-v149-bottom-baseline-029`, `hf-20260919-wd10-v149-bottom-restore-030`.

### Required live gate

Bridge-reload through the Dev auto-host, verify v1.4.9 / interactions v0.3.0 / loader 23/23, then repeat both reversible resize sequences and require exact DOM/prefs parity plus module telemetry.

**Runtime/module/manifest/public behavior changed:** Dev task-branch interaction ownership only; public Stable unchanged.

---

## PFC-2026-09-19-031 — v1.4.8 main Dock drag live PASS

Date: 2026-09-19

### PASS

- Auto-host payload: v1.4.8, launcher-executed, one attempt, no error.
- Launcher: running/error-null.
- Interactions: v0.2.0 / build `0.2.0-main-dock-drag`, configured=true, lastError=null.
- Loader: 23/23 / 0 failed.
- Drag parity: 820/244 -> 844/262 for +24/+18, then exact inverse restore to 820/244 in both DOM and persisted prefs.
- Telemetry: startDockDragCalls=2, dockDragMoveCalls=2, dockDragEndCalls=2.
- Evidence: `hf-20260919-wd10-v148-state-025`, `hf-20260919-wd10-v148-drag-cycle-026`.

### Next bounded slice

Capture baseline and extract corner + bottom resize ownership only. Keep compact drag and hotkey/undo-redo out of that slice.

**Runtime/module/manifest/public behavior changed:** Dev task-branch ownership only; public Stable unchanged.

---

## PFC-2026-09-19-030 — v1.4.8 main Dock drag candidate

Date: 2026-09-19

### Static / contract checks

- Interactions v0.2.0 parses and retains legacy drag calculations/listener lifecycle.
- Launcher v1.4.8 parses, pins interactions v0.2.0, requires `startDockDrag`, passes bounded clamp/viewport/prefs helpers, and guards exactly one legacy drag block before replacing it with a thin wrapper.
- Isolated transformed Stable-derived core parses.
- Manifest JSON parses; launcher/interactions registry versions/builds are synchronized.
- No resize, compact-drag, hotkey/undo-redo, CSS/DOM, storage-key, loader, or Stable change is included.

### Baseline

- Start DOM/prefs x=820, y=244.
- +24/+18 drag -> DOM/prefs x=844, y=262.
- Inverse drag -> DOM/prefs restored exactly to x=820, y=244.
- Evidence: `hf-20260919-wd10-v148-drag-baseline-023`.

### Required live gate

Bridge-reload through the Dev auto-host, verify v1.4.8 and interactions v0.2.0, then repeat the reversible drag sequence and require exact DOM/prefs parity plus loader 23/23 / 0 failed.

**Runtime/module/manifest/public behavior changed:** Dev task-branch interaction ownership only; public Stable unchanged.

---

## PFC-2026-09-19-029 — v1.4.7 lifecycle extraction live PASS

Date: 2026-09-19

### PASS

- Auto-host payload: v1.4.7, launcher-executed, one attempt, no error.
- Launcher: running/error-null.
- `witch-dock-interactions`: v0.1.0 / build `0.1.0-minimize-compact-lifecycle`, configured=true, lastError=null.
- Loader: 23 total / 23 enabled / 23 executed / 0 failed.
- Baseline parity:
  - open 380x520 CSS at x=820/y=244;
  - minimize 380x92;
  - restore 380x520;
  - collapse hides Dock and shows compact at x=16/y=907;
  - no-drag compact reopen restores exact open geometry and hides compact.
- Module counters: toggleMinimizeCalls=2, closeDockCalls=1, expandFromCompactCalls=1.
- Evidence: `hf-20260919-wd10-v147-state-021`, `hf-20260919-wd10-v147-cycle-022`.

### Next bounded slice

Extract main Dock drag ownership only. Do not move resize, compact drag, hotkey, or undo/redo in the same slice.

**Runtime/module/manifest/public behavior changed:** Dev task-branch ownership only; public Stable unchanged.

---

## PFC-2026-09-19-028 — v1.4.7 lifecycle extraction candidate

Date: 2026-09-19

### Protected behavior

- Preserve 380x520 open CSS geometry and the v1.4.6 content-box snapshot correction.
- Preserve minimize height/restore behavior, close-to-compact visibility, remembered compact position, no-drag compact reopen, one root/compact/icon, and all preference keys.
- Keep compact pointer threshold/drag mechanics, main drag/resize, hotkey/undo-redo, tabs/sections, loader ordering/cache/failure isolation, and Stable outside this slice.

### Static evidence

- New interactions module parses and exposes only configured non-privileged lifecycle methods plus diagnostics.
- Launcher v1.4.7 parses, fetches/validates the new module through the existing bounded host transport, configures it from the transformed core, and guards exactly one legacy lifecycle block before replacing it with thin wrappers.
- Raw legacy lifecycle seam contains the expected minimize/close/expand contracts; the isolated transformed core parses.
- Manifest JSON parses; launcher and module registry versions/builds are synchronized.

### Pre-change live baseline

- Open: 380x520 CSS / 382x522 rendered at x=820/y=244.
- Minimized: 380x92 CSS; restored exactly to 380x520.
- Collapsed: Dock hidden; compact visible at x=16/y=907.
- No-drag compact pointer cycle: Dock restored to exact original geometry; compact hidden.
- Evidence: `hf-20260919-wd10-v147-baseline-018`, `hf-20260919-wd10-v147-baseline-cycle-019`.

### Required live gate

Auto-host the pushed v1.4.7 revision, Bridge-reload HeroForge, then repeat the baseline sequence and require exact parity plus interactions module configured/error-null and loader 23/23 / 0 failed.

**Runtime/module/manifest/public behavior changed:** Dev task-branch ownership only; public Stable unchanged.

---

## PFC-2026-09-18-027 — v1.4.6 geometry live PASS / refactor pause

Date: 2026-09-18

### Gate result

- Launcher v1.4.6: `running`, `error:null`.
- Shell v0.2.0: one root create + one compact create, no error.
- Loader: 23/23 / 0 failed.
- Baseline persisted geometry: 380x520 CSS, x=292, y=845; rendered outer box 382x522.
- Collapse state: Dock hidden, compact visible, one root/compact/icon, persisted width/height and last-open width/height still 380x520.
- Reopen state: Dock visible, compact hidden, one root/compact/icon, persisted geometry still 380x520, rendered outer box still 382x522, x/y unchanged.
- No duplicate-node, loader, shell, or geometry regression remains.

### Required next action

- PAUSE issue #10 for the HF-Chat-Bridge upgrade.
- Do not perform another refactor extraction or promotion step until explicit resume.

**Runtime/module/manifest/public behavior changed:** none in this record-only commit.

---

## PFC-2026-09-18-026 — Compact geometry stability candidate

Date: 2026-09-18

### Confirmed cause

- Pre-cycle rendered outer box: 382x522 from persisted 380x520 CSS dimensions.
- Legacy snapshot captured the outer box and saved 382x522 as future CSS width/height.
- Reopen therefore rendered 384x524.
- Root is content-box; borders are outside the declared CSS width/height.
- Persisted test geometry has been restored to 380x520 before this candidate gate.

### Protected behavior

- Preserve x/y and anchored-state snapshot behavior.
- Preserve compact constructor and icon contract from v1.4.5.
- Preserve close/open lifecycle, compact drag threshold, minimize, expand, size constraints, preference ownership, loader and public seams.
- Change only width/height snapshot source from outer bounding box to computed CSS dimensions, falling back to bounding dimensions only if computed values are not finite.

### Static evidence

- Launcher v1.4.6 parses.
- Guard requires one exact `snapshotCurrentDockPositionToPrefs()` block and the two legacy bounding-box assignments before replacement.
- Transformed Stable-derived core parses and no longer contains the legacy width/height snapshot assignments.
- Manifest launcher registry is synchronized; normal manifest module count remains 23.
- Checked-in `Witch_Dock.user.js` remains unchanged.

### Required live gate

1. Update fixed-name Dev to v1.4.6 and reload.
2. Confirm launcher running/error null; loader 23/23 / 0 failed; shell v0.2.0 still applies once.
3. Confirm persisted CSS width/height and last-open dimensions start at 380x520; rendered outer Dock box is 382x522.
4. Normal Collapse-to-icon once; read back hidden Dock + visible compact with one root/compact/icon.
5. Normal no-drag compact reopen once.
6. Confirm persisted width/height and last-open dimensions remain exactly 380x520; rendered outer Dock box remains 382x522; compact hides; node counts remain 1/1/1.
7. Record PASS, then PAUSE issue #10 for the HF-Chat-Bridge upgrade. Do not begin another refactor slice.

**Runtime/module/manifest/public behavior changed:** task-branch geometry snapshot correction only; public Stable and canonical Dev unchanged.

---

## PFC-2026-09-18-025 — Compact launcher DOM extraction candidate

Date: 2026-09-18

### Protected behavior

- Preserve one `#kwWDCompact` with title `Open Witch Dock`.
- Preserve one `#kwWDCompactIcon`, inline emblem data URL, alt `Witch Dock`, draggable false, 48x48 icon inside the existing 54x54 compact button.
- Preserve `showClosedCompact`, `startCompactDrag`, `closeDock`, `expandFromCompact`, compact position persistence and Dock hotkey behavior unchanged.
- Preserve main Dock geometry and all loader/storage/tool behavior.

### Static evidence

- Shell v0.2.0 parses and adds only `createCompact()` plus one diagnostic counter.
- Launcher v1.4.5 parses, validates the expanded shell API, guards the exact compact constructor block and replaces only that constructor.
- The transformed Stable-derived core parses with legacy compact lifecycle/drag functions untouched.
- Manifest versions are synchronized; normal module count remains 23.
- Checked-in `Witch_Dock.user.js` remains unchanged.

### Required live gate

1. Update fixed-name Dev to v1.4.5 and reload.
2. Confirm launcher running/error null; shell v0.2.0 applied once; loader 23/23 / 0 failed.
3. Confirm one compact node/icon and exact baseline attributes/sizes.
4. Use the normal Collapse-to-icon control once; confirm main Dock hides and compact appears.
5. Click the compact launcher once without dragging; confirm main Dock returns, compact hides, geometry is preserved and no duplicate root/compact nodes exist.
6. Do not drag the compact launcher in this slice.

**Runtime/module/manifest/public behavior changed:** task-branch compact DOM ownership only; public Stable and canonical Dev unchanged.

---

## PFC-2026-09-18-024 — v1.4.4 main-shell DOM live PASS

Date: 2026-09-18

### Gate result

- Launcher v1.4.4: `running`, `error:null`.
- Shell v0.1.0 / build `0.1.0-main-root-dom`: applied exactly once, no shell error.
- Loader v0.1.2: complete at 23/23 / 0 failed.
- One Dock root only; exact root child order preserved.
- Header controls and tab-frame/right control structure match baseline.
- Body/footer/bottom-resizer/corner-resizer refs remain present.
- Compact launcher remains present exactly once.
- Rendered root box remains 382x522 at the preserved baseline position.
- No human visual gate required because the automated DOM and geometry parity checks matched exactly.

### Next action

- Diagnose compact/minimize/layout lifecycle only. Do not broaden into drag/resize or hotkey/undo-redo extraction.

**Runtime/module/manifest/public behavior changed:** none in this record-only commit.

---

## PFC-2026-09-18-023 — Main-shell DOM factory extraction candidate

Date: 2026-09-18

### Protected behavior

- Preserve exactly one `#kwWitchDock` root with the same direct child order and IDs.
- Preserve existing header drag, Disclaimer/About/minimize/close callbacks, tab frame, Undo/Redo callbacks, body/footer, and resize-handle callbacks.
- Preserve position/sizing, compact mode, main/compact drag, minimize/close/expand, tab overflow, hotkeys, undo/redo implementation, tabs/tools/sections, registry containers, storage and loader behavior.
- Do not move compact launcher DOM in this slice.

### Static evidence

- New `Witch_Dock_Shell.js` v0.1.0 parses and exposes only `createRoot()` plus diagnostics.
- Shell module requires the existing legacy `el()` helper and existing callbacks rather than duplicating their behavior.
- Launcher v1.4.4 parses, fetches/validates the shell module, and guards the exact legacy root-construction/state-ref block before replacing only that block.
- The raw-core shell-root seam is unique and the transformed core parses.
- Manifest registry includes `witch-dock-shell` v0.1.0 and synchronized launcher v1.4.4; normal module count remains 23.
- Checked-in `Witch_Dock.user.js` remains unchanged.

### Required live gate

1. Update fixed-name Dev to v1.4.4 and reload HeroForge.
2. Confirm launcher running/error null and shell v0.1.0 applied exactly once.
3. Confirm loader remains 23/23 / 0 failed.
4. Confirm exactly one `#kwWitchDock` exists and direct child order remains Header/Tabs/Body/Footer/BottomResize/CornerResize.
5. Confirm header controls, tab-frame/right controls, body/footer/resizer references and compact launcher all remain present.
6. Confirm current size/position remains normal and no visual difference appears.
7. Human visual gate only if appearance differs.

**Runtime/module/manifest/public behavior changed:** task-branch main-shell DOM ownership only; public Stable and canonical Dev unchanged.

---

## PFC-2026-09-18-022 — v1.4.3 registry-container live PASS

Date: 2026-09-18

### Gate result

- Launcher v1.4.3: `running`, `error:null`.
- Registry v0.1.0 / build `0.1.0-tab-tool-state-containers`: applied.
- Registry state after startup: 6 tabs, 9 tools, 0 pending.
- Loader v0.1.2: complete at 23/23 / 0 failed.
- Rendered tabs: Body Editor, Pose(active), Decals, Booth, JSON, Utilities.
- Rendered mounted tool IDs match the nine-tool baseline; 12 sections remain.
- `registerTool`, `ensureDock`, and `downloadBlob` all remain callable functions.
- No human visual gate required because this slice moved backing containers only and rendered layout/order matched baseline exactly.

### Next action

- Diagnose shell/layout ownership only. Keep drag/resize/minimize/compact, hotkeys and undo/redo outside the slice until their own bounded extraction.

**Runtime/module/manifest/public behavior changed:** none in this record-only commit.

---

## PFC-2026-09-18-021 — Registry backing-container extraction candidate

Date: 2026-09-18

### Protected behavior

- Preserve `UW.WitchDock.registerTool`, `UW.WitchDock.ensureDock`, and `UW.WitchDock.downloadBlob`.
- Preserve duplicate tool replacement, pending-before-UI queue semantics, tab creation/order/active-tab persistence, module render calls, section DOM lifecycle, section order/drag, and sizing.
- Do not introduce a synthetic section registry where none exists.
- Preserve loader order/concurrency/failure isolation and all v1.4.2 preference/storage behavior.

### Static evidence

- New `Witch_Dock_Registry.js` v0.1.0 parses and owns only one tabs Map, one toolsById Map, and one pending Array, with diagnostic `getState()`.
- Launcher v1.4.3 parses, fetches/validates the registry module, and guards the exact legacy three-allocation state block before redirecting only those fields.
- The exact raw-core registry allocation seam occurs once; the transformed core parses with the legacy allocation block absent.
- Manifest registry includes the new bootstrap module and synchronized launcher version; normal manifest module count remains 23.
- Checked-in `Witch_Dock.user.js` is unchanged.

### Required live gate

1. Update fixed-name Dev to v1.4.3 and reload HeroForge.
2. Confirm launcher running/error null and `KWWitchDockRegistry` v0.1.0 applied.
3. Confirm loader remains 23 total / 23 enabled / 23 executed / 0 failed.
4. Confirm registry reports six tabs, nine tools, zero pending after startup.
5. Confirm rendered tab order and Pose active state match baseline; rendered tool IDs and 12-section count match baseline.
6. Confirm `registerTool`, `ensureDock`, and `downloadBlob` remain callable.
7. No human visual gate is required unless the Dock appearance differs.

**Runtime/module/manifest/public behavior changed:** task-branch registry backing-state ownership only; public Stable and canonical Dev unchanged.

---

## PFC-2026-09-18-020 — v1.4.2 tool-enablement live PASS

Date: 2026-09-18

### Gate result

- Launcher v1.4.2: `running`, `error:null`.
- Preferences v0.3.0: configured, no tool-enablement errors.
- Loader v0.1.2 clean baseline/final: 23 total, 23 enabled, 23 started, 23 fetched, 23 executed, 0 failed.
- OFF persistence test: normal Decals Scroll Guards checkbox produced exact page key `"false"`, one page + one host preference write, live disable, then reload with 22 enabled/executed, 0 failed and only that module disabled.
- ON restore test: normal checkbox produced exact page key `"true"`, one page + one host write, async live API/style restoration, then final reload at 23/23 / 0 failed.
- No human visual gate required; this slice moved persistence ownership only and the Utility control/state behavior remained normal.

### Follow-up requirement retained

- The pre-update v1.4.1 launcher/newer-v0.3.0 preferences mismatch proves branch-relative bootstrap payloads can skew against an older installed launcher.
- Treat this as issue #10 Stage E bootstrap/orchestration hardening. Preserve strict module contracts while making launcher/runtime source identity immutable or otherwise compatibility-safe.
- Do not alter Stable or canonical Dev for this finding during task-branch Stage D work.

**Runtime/module/manifest/public behavior changed:** none in this record-only commit.

---

## PFC-2026-09-17-019 — Tool-enablement persistence extraction candidate

Date: 2026-09-17

### Protected behavior

- Preserve exact `kw.witchDock.toolEnabled.<id>` keys.
- Preserve bootstrap Tampermonkey-only reads, module-loader page-local-only reads, Utilities page-first/host-fallback reads, and mirrored Utility page+host writes.
- Preserve all manifest scheduling, deterministic cache identity, parallel fetch, ordered execution, failure isolation, and Utility live enable/disable behavior.
- No tab/registry/drag/resize/minimize/hotkey/undo/redo ownership moves.

### Static evidence

- Preferences v0.3.0 parses and exposes explicit host-only, page-only, page→host, and mirrored-write tool-enablement methods.
- Launcher v1.4.2 parses, injects only bounded host storage plus bounded page getItem/setItem capability, and guards the exact legacy bootstrap `getToolEnabled()` block before replacing it with the host-only preference read.
- Module loader v0.1.2 parses and no longer directly reads `localStorage` for tool enablement; it uses the page-only preference method.
- Utilities source parses and no longer directly reads/writes localStorage or GM storage for `kw.witchDock.toolEnabled.*`; its existing read/write helpers delegate to preferences.
- Manifest remains valid with 23 normal modules and synchronized launcher/preferences/loader/Utilities versions.
- Checked-in `Witch_Dock.user.js` remains unchanged.

### Required live gate

1. Update fixed-name Dev to v1.4.2 and refresh HeroForge.
2. Confirm launcher running/error null; preferences v0.3.0; loader v0.1.2 complete with 23/23 / 0 failed.
3. Confirm the two Utilities HeroForge UI toggles remain checked/enabled and existing page keys remain `"true"`.
4. Toggle `expanded-ui-scroll-guards` OFF once through its normal Utility checkbox; confirm page key becomes `"false"`, preference page+host write diagnostics increment, and the feature disables normally.
5. Reload once; confirm loader records that module disabled from page storage while unrelated modules retain order/failure isolation.
6. Restore the Utility ON through normal UI, verify mirrored write diagnostics/page key `"true"`, then reload or otherwise confirm restored startup parity before leaving the gate.
7. Human visual gate only if appearance changes; this slice is persistence ownership only.

**Runtime/module/manifest/public behavior changed:** task-branch tool-enablement persistence ownership and module/launcher versions changed; public Stable unchanged.

---

## PFC-2026-09-17-018 — Section preference-store extraction candidate

Date: 2026-09-17

### Protected behavior

- Preserve exact `kw.witchDock.ui.<tool>.<section>.collapsed` and `kw.witchDock.sectionOrder.<tool>` keys.
- Preserve collapsed default/read-failure behavior, boolean writes, order JSON parse/filter/write behavior, DOM reorder algorithm, drag thresholds, and click semantics.
- No tool-enable, tab, drag/resize/minimize, undo/redo, or HeroForge integration ownership moves.

### Static evidence

- Preferences v0.2.0 parses, exposes bounded section collapsed/order methods, and contains no raw GM storage calls.
- Launcher v1.4.1 parses and requires the new preference API methods before evaluating the transformed core.
- Guarded transforms verify exact legacy collapse/order storage markers before replacing only storage helpers.
- Full transformed core parses; raw section-collapse/order GM storage calls are absent after transformation.
- Normal manifest-loaded module count remains 23.
- Checked-in `Witch_Dock.user.js` remains unchanged.

### Required live gate

1. Update fixed-name Dev to v1.4.1 and manually refresh HeroForge.
2. Confirm launcher running/error null, preferences v0.2.0, loader 23/23 / 0 failed.
3. Confirm Booth section remains first and expanded on initial load.
4. Toggle Booth section collapsed once; confirm bounded collapsed-write diagnostic increments with exact key `kw.witchDock.ui.booth-tool.booth.collapsed`.
5. Manually reload and confirm Booth section starts collapsed; restore it expanded and confirm no error.
6. Preserve section order and no duplicate/missing section symptoms.
7. Human visual gate only if section appearance changes; pure persistence extraction should be visually identical.

**Runtime/module/manifest/public behavior changed:** task-branch section preference ownership and module/launcher versions changed; public Stable unchanged.

---

## PFC-2026-09-17-017 — Stage D main preference-store extraction candidate

Date: 2026-09-17

### Protected behavior

- Storage key remains exactly `kw.witchDock.v1`.
- Defaults remain x/y null, 380x520, open/not minimized, remembered last-open values, activeTab null, compactX 16, compactY null, firstRun false.
- Legacy load behavior remains: missing/falsy/invalid/non-object data -> defaults + firstRun true; valid object -> defaults merged with stored object + firstRun false.
- Legacy save behavior remains JSON stringify to the same userscript storage namespace with errors swallowed by the core wrapper.
- No shell interaction ownership moves in this candidate.

### Static evidence

- Preferences module v0.1.0 parses and receives only bounded `storage.get/storage.set`; it contains no raw `GM_getValue` / `GM_setValue`.
- Launcher v1.4.0 parses and fetches core/CSS/modals/bone/preferences concurrently.
- Guarded transform requires one exact legacy preference declaration block and one exact main preference IO block before replacing them with wrappers to `KWWitchDockPreferences`.
- Full candidate CSS -> preferences -> bone -> modal -> manifest transform parses.
- Main-store raw `GM_getValue(STORE_KEY...)` / `GM_setValue(STORE_KEY...)` calls are absent after transformation.
- Manifest-loaded module count remains 23; preferences is bootstrap-owned, not another normal module.
- Checked-in `Witch_Dock.user.js` remains unchanged.

### Required live gate

1. Update fixed-name Dev to v1.4.0 and manually refresh HeroForge.
2. Confirm launcher running/error null, preferences v0.1.0 configured, loader 23/23 / 0 failed.
3. Confirm the pre-existing Dock position/size/open state survives the update/reload.
4. Exercise one normal preference write (bounded move/resize/minimize cycle) and confirm `KWWitchDockPreferences.getState()` records saves with no error.
5. Reload once and confirm the changed preference survives through the same `kw.witchDock.v1` store.
6. Confirm compact/minimize/tabs and unrelated modal/Booth behavior show no regression.
7. Human visual gate only if the shell visibly differs; otherwise this is persistence/behavioral, not a redesign.

### Live result

PASS:
- v1.4.0 / preferences v0.1.0 healthy; loader 23/23 / 0 failed.
- Pre-existing 368/157/660x914 open geometry survived initial update/reload.
- Minimize action persisted through bounded storage with no error.
- Exact post-reload module snapshot proves startup loaded `minimized:true`, width 660, height 92, last-open 660x914, activeTab Booth, firstRun false.
- Amanda confirmed the reloaded Dock looked good and then returned it to an expanded state through normal UI behavior.
- No persistence regression observed.

**Runtime/module/manifest/public behavior changed:** task-branch launcher/bootstrap preference ownership and registry changed; public Stable unchanged.

---

## PFC-2026-09-17-016 — Bone HUD/detection extraction candidate

Date: 2026-09-17

### Baseline / protected behavior

- Current in-core baseline captured through Bridge: one visible bone row; label `Bone:`; value `No bone detected (click a body bone)`; copy button disabled; footer hotkey text preserved; no toast until copy.
- Preserve exact detection candidate paths/scoring, pointerup + click capture listeners, 35 ms post-click sample delay, 60 readiness tries, 250/1000 ms retry cadence, 750 ms post-start rebuild check, failure/retry UI, and copy toast behavior.
- Preserve CSS ownership in already-extracted `Witch_Dock_Styles.css`.

### Candidate checks

- `Witch_Dock_Bone_HUD.js` v0.1.0 / build `0.1.0-extracted-bone-hud` parses successfully.
- Extracted module contains no direct `GM_setClipboard`; bounded launcher host clipboard is injected via `configure()`.
- Launcher v1.3.9 parses successfully and fetches core/CSS/modals/bone HUD in parallel.
- Guarded transform requires exactly one legacy bone init and one legacy `getScriptMeta()` seam before replacing them with a wrapper to `KWWitchDockBoneHUD.init()`.
- Manifest registry adds only the bootstrap-owned bone module; manifest-loaded module count remains 23.
- Checked-in `Witch_Dock.user.js` remains unchanged.

### Required live gate

1. Update fixed-name Dev install to v1.3.9 and manually refresh past HeroForge's promotional splash.
2. Confirm launcher running/error null, bone module v0.1.0 configured/initialized, loader 23/23 / 0 failed.
3. Confirm one bone row and exact baseline footer text/layout; no duplicate row/toast/listener symptom.
4. Compare current detector readiness against the legacy source contract. If current HeroForge no longer satisfies the legacy anchors, record that as a separate compatibility bug rather than expanding #10.
5. Confirm no extraction-specific duplicate row/listener/toast symptom and preserve retry/failure behavior.
6. Human visual gate: bone footer looks unchanged.

### Live result

- Launcher v1.3.9: running / error null; bone module v0.1.0 configured+initialized; loader 23/23 / 0 failed in 504 ms.
- One bone row with exact pre-extraction idle text/layout and disabled copy button; no toast present.
- `HF.summonCircle` exists and reports ready, but every legacy anchor candidate used by both Stable-derived core and extracted module is absent on current HeroForge.
- Detector therefore remains stopped/unattached exactly because the preserved legacy candidate builder returns no paths. This is not extraction-caused.
- Opened #26 for post-refactor reconstruction of a current stable bone-selection seam.
- Human visual gate PASS: Amanda confirmed the Bone footer looks normal/unchanged.
- Stage C is complete; proceed to Stage D application-shell extraction without pulling #26 repair into the refactor.

**Runtime/module/manifest/public behavior changed:** task-branch launcher/bootstrap bone-HUD ownership and registry changed; public Stable unchanged.

---

## PFC-2026-09-17-015 — Event-driven media readiness handoff

Date: 2026-09-17

### Diagnosis

- v1.3.8 launcher/modal baseline: running/error null; modal v0.1.1 configured; loader 23/23 / 0 failed in 345.1 ms.
- Fresh modal lifecycle: About first-open/reopen and Disclaimer mutual exclusion/reopen passed with one overlay each; all six close paths (button/backdrop/Escape for both) passed.
- Booth v27.0.5 / bootstrap v0.2.0 remained native-ready/error-null with one Booth script, but 4K/8K/WebP stayed disabled after 2.5 s and 6 s.
- Manual existing readiness seams immediately corrected UI: TRUE-resolution readiness `sync()` returned true; WebP capability returned Ready; WebP UI `refresh()` returned true; all three capture surfaces became enabled.
- This confirms stale timer-driven UI synchronization, not unavailable capture capability.

### Candidate

- Booth -> v27.0.6 / build `v27.0.6-media-readiness-handoff`.
- Booth Runtime Bootstrap -> v0.2.1 / build `0.2.1-media-readiness-handoff`.
- Booth transition invokes optional `KWPhotoBoothTrueResolutionReadiness.sync()` and `KWSpinnyMiniWebPUI.refresh()`.
- Bootstrap completion/failure invokes the same optional capability seams after clearing in-flight state.
- Polling timers remain as fallback; no capture service/UI source changed.
- Manifest registry and deterministic URLs/cache keys synchronized.

### Required live gate

1. Fresh-load the new Booth/bootstrap module identities.
2. With HeroForge ready and Booth OFF, turn Booth ON once.
3. Confirm native Booth ready, one Booth script / zero duplicates / bootstrap error null.
4. Without manual media sync calls, confirm 4K/8K/WebP become enabled.
5. Turn Booth OFF; confirm media controls refresh/disable without relying on interval polling.
6. Turn Booth ON again; confirm live-BT reuse, zero duplicates, and media controls enable again.
7. Leave Booth OFF.
8. Human modal visual gate remains required after automated regressions pass.

### Live result

PASS on a manual HeroForge reload:
- loader 23/23 / 0 failed in 221.9 ms;
- Booth v27.0.6 + bootstrap v0.2.1 loaded from the task branch;
- first ON bootstrapped native Booth, one matching Booth script / zero duplicates / no bootstrap error, and 4K/8K/WebP enabled without manual `sync()` / `refresh()`;
- OFF disabled all three media surfaces;
- second ON reused live BT, retained one Booth script / zero duplicates, and re-enabled all three;
- final state returned Booth OFF;
- About modal v0.1.1 is open for the remaining human visual gate.

**Runtime/module/manifest/public behavior changed:** task-branch Booth tool/bootstrap and cache identities changed; public Stable unchanged.

---

## PFC-2026-09-17-013 — Explicit Booth session handoff candidate

Date: 2026-09-17

### Scope

Issue #10 task branch: remove the proven dependency of an explicit Booth View request on the bootstrap's 200 ms polling timer while preserving HeroForge's native Booth ownership contract.

### Evidence / candidate

- v1.3.7 modal baseline passed: running/error null; modal v0.1.0 configured; no overlays before first use; loader 23/23, 0 failed in 499.8 ms.
- About/Disclaimer automated lifecycle passed: one overlay each, expected title/footer/content/links, mutual exclusion, no duplicate creation, and final closed state.
- Ready HeroForge page with native BT absent: explicit Booth session request remained pending for both 2.5 s and 10 s while bootstrap attempts stayed at 0; 4K/8K/WebP remained disabled. The timer-only trigger did not execute on that page.
- `booth-runtime-bootstrap` is v0.2.0 / build `0.2.0-explicit-session-handoff` and exposes bounded `requestSession()`.
- Booth is v27.0.5 / build `v27.0.5-explicit-session-handoff`; its source-local/public API version fields are also synchronized at 27.0.5.
- The source-sync correction uses a fresh deterministic build/cache identity so validation cannot reuse the earlier stale branch-ref response.
- `onUserBoothToggle(true)` invokes the optional bootstrap handoff after updating current-session state; the existing 200 ms poll remains a fallback.
- Bootstrap still loads at most one version-matched HeroForge `/gated/booth.js`, delegates activation to native `BT.setBoothMode()`, and does not directly force `maker.enable()`.
- Manifest registry and deterministic module URL cache keys are synchronized. Static syntax checks passed for both changed modules and manifest JSON.

### Required live gate

1. Fresh-load v27.0.5 / bootstrap v0.2.0.
2. From a ready page with BT absent, request Booth once; `directSessionRequests` and `attempts` must increment.
3. Confirm one Booth script, BT/maker ready, bootstrap error null, and 4K/8K/WebP enabled.
4. Loader remains 23/23 with zero failures.
5. Booth off/on creates no duplicate script and leaves saved/default settings unchanged.
6. Human gate: About and Disclaimer look/behave normal.

**Runtime/module/manifest/public behavior changed:** task-branch Booth activation handoff and module/cache-key versions changed; public Stable unchanged.

---

## PFC-2026-09-17-012 — Extracted About/Disclaimer candidate

Date: 2026-09-17

### Scope

Issue #10 on `wd/10-modular-bootstrap`: move About/Disclaimer UI implementation out of the Stable-derived monolith into a GitHub-owned bootstrap module without changing visible behavior or unrelated Dock contracts.

### Prior live evidence

- v1.3.6 external CSS automated + human visual gates passed.
- Booth v0.1.2 blocker final PASS after normal manual HeroForge refresh: one native Booth script, native maker/runtime ready, 4K/8K/WebP enabled, no error; off/on cycle created no duplicate and preserved persistence/defaults. Bridge requests: `hf-20260917-wd10-booth-final-activate-001`, `hf-20260917-wd10-media-controls-final-001`, `hf-20260917-wd10-booth-cycle-final-001`.

### Candidate

- Launcher v1.3.7 / build `1.3.7-extracted-core-modals`; fixed Tampermonkey `@name WITCH DOCK - DEV` retained.
- New `features/core/Witch_Dock_Modals.js`, registry id `witch-dock-modals`, v0.1.0 / build `0.1.0-extracted-about-disclaimer`, load role `bootstrap-module`.
- Core, CSS, and modal JS are fetched in parallel through bounded repository `requestText`.
- Modal module is configured only with bounded script metadata plus existing GitHub/Ko-fi URLs; raw Tampermonkey APIs are not exposed.
- Launcher guards exactly one legacy modal block and exactly one occurrence of each six legacy modal functions before replacing only those implementations with wrappers to `UW.KWWitchDockModals`.
- `getScriptMeta()` remains in core for bone HUD. Existing buildUI header handlers are unchanged.
- Checked-in `Witch_Dock.user.js` remains byte-identical to the Stable-derived source.
- Manifest registry is synchronized: launcher v1.3.7, modal v0.1.0, Booth v0.1.2 retained; normal manifest modules remain 23 and bootstrap loader remains unchanged.
- Attempted Bridge pre-install parser helper `hf-20260917-wd10-modals-static-001` failed in the helper's nested config JSON before candidate code executed (`ConfigError`); do not treat it as candidate syntax evidence or retry that mutation request.

### Required live gate

1. Existing fixed-name Dev install updates in place to v1.3.7 and page starts with Dev state `running`, `error:null`, `coreModalsMode:external-bootstrap-module`, `coreModalsApplied:true`.
2. `KWWitchDockModalsInfo` is v0.1.0/build `0.1.0-extracted-about-disclaimer`, applied by `bootstrap-module`; `KWWitchDockModals.getState()` is configured with no overlays before first use.
3. About creates one legacy-id overlay/modal, correct title/version/links/content, supports close button/overlay/Escape, and reopening does not duplicate it.
4. Disclaimer creates one legacy-id overlay/modal, closes About, preserves exact content/version, supports close button/overlay/Escape, and reopening does not duplicate it.
5. Module loader remains 23/23 with zero failures; external CSS and Booth/media readiness remain healthy.
6. Human visual gate: About and Disclaimer look normal/unchanged.

Do not continue to bone HUD extraction if this gate fails; repair/rollback only the modal ownership seam.

**Runtime/module/manifest/public behavior changed:** task-branch launcher/modal ownership and manifest registry changed; public Stable unchanged.

---

## PFC-2026-09-17-011 — Booth cold-start compatibility repair

- `Booth_Runtime_Bootstrap.js` v0.1.2 / build `0.1.2-session-cold-start` reacts to current-session Booth View, loads one version-matched native Booth script, and delegates mode/engine ownership to HeroForge `BT.setBoothMode()`.
- Direct `maker.enable()` bypass experiment was rejected and removed.
- Final clean live gate PASS: normal-ready cold page -> Booth request -> one script, maker enabled, runtime/engine ready, 4K/8K/WebP enabled, zero bootstrap errors; off/on cycle no duplicate or persistence/default drift.

---

## PFC-2026-09-17-010 — External core stylesheet

- v1.3.6 / `Witch_Dock_Styles.css` v0.1.0, guarded parity, bounded host insertion, one effective stylesheet.
- Loader 23/23, 0 failed; Amanda confirmed Dock visual appearance normal.

---

## Current prior pre-flights

- **009:** 48px compact emblem in unchanged button; PASS.
- **008:** known-good inline emblem restore; PASS.
- **007:** stable Tampermonkey Dev identity; PASS.
- **006:** external emblem candidate; visual FAIL and rolled back.
- **005:** v1.3.1 host-owned core fetch; PASS.
- **004:** v1.3.0 privileged-host seam; PASS.
- **003:** issue #10 monolith contract freeze.
