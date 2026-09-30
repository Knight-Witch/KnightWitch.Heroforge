# Witch Dock Core Contract — Issue #10

**Status:** Accepted core invariants; issue #10 extraction completed
**Historical task branch:** `wd/10-modular-bootstrap` (retired; not an execution route)
**Canonical Dev:** `WITCH_DEV_MAIN`
**Public Stable:** `Witch_Scripts`

## Purpose

Preserve accepted storage/global/loader/interaction and bounded-host invariants. Current delivery procedure and immutable pairing live in [Runtime Delivery](../docs/policies/RUNTIME_DELIVERY.md); active work lives in [ACTIVE_CONTEXT.md](../ACTIVE_CONTEXT.md). The original extraction inventory/stages below are historical evidence, not pending work.

## Historical pre-extraction responsibilities in `Witch_Dock.user.js`

The original monolith owned the following responsibilities before the completed extraction:

1. **Tampermonkey privilege boundary**
   - `GM_xmlhttpRequest`
   - `GM_download`
   - `GM_getValue` / `GM_setValue`
   - `GM_setClipboard`
   - `GM_addStyle`
   - `GM_info`
   - `unsafeWindow`

2. **Bootstrap / delivery**
   - stable manifest declaration;
   - `UW.KWWitchDockManifestURL` publication;
   - deterministic hash/cache-key helpers;
   - privileged manifest/bootstrap fetch;
   - hidden bootstrap-tool execution.

3. **Dock application shell**
   - state object;
   - preference load/save;
   - root/header/tabs/body/footer construction;
   - drag, resize, minimize, compact launcher, viewport clamping;
   - tab ordering and active-tab persistence;
   - section ordering and pointer drag behavior;
   - tool registration/mounting.

4. **Shared UI presentation**
   - all core Dock CSS;
   - common element/icon helpers;
   - About and Disclaimer modals;
   - inline compact emblem payload.

5. **HeroForge integration currently embedded in core**
   - undo/redo queue integration;
   - grave/backquote Dock hotkey;
   - bone HUD and bone-name detection;
   - clipboard handling for bone names.

## Protected runtime contracts

These are preserved during architecture extraction unless a separate issue explicitly changes them and passes its own gate.

### Storage keys

- `kw.witchDock.v1`
- `kw.witchDock.toolEnabled.<module-id>`
- `kw.witchDock.sectionOrder.<tool-id>`

Do not migrate or rename these keys as part of pure architecture work.

### Public/global seams

Current public Dock host seams that existing modules may depend on:

- `UW.WitchDock.registerTool`
- `UW.WitchDock.ensureDock`
- `UW.WitchDock.downloadBlob`
- `UW.KWWitchDockManifestURL`
- module-loader runtime telemetry under `UW.KWModuleLoader`

Do not remove or rename these until compatibility is proven and a replacement seam is deliberately introduced.

### Manifest / loader behavior

Preserve:

- deterministic cache-key identity using module id/version/build/path/url;
- no-store/bootstrap cache busting semantics;
- module enablement semantics;
- manifest order as execution order;
- concurrent module fetch behavior in the v0.1.1 module loader;
- per-module failure isolation;
- current loader telemetry/status behavior.

### Dock interaction behavior

Preserve:

- current visual layout and CSS behavior;
- remembered position/size/minimized/closed state;
- compact launcher behavior and remembered position;
- tab ordering and active-tab behavior;
- tool/section ordering behavior;
- resize constraints;
- backquote hotkey behavior;
- undo/redo behavior and shortcuts;
- existing About/Disclaimer behavior;
- existing bone HUD behavior.

## True privileged boundary

The Tampermonkey entrypoint retains only capabilities that require the userscript sandbox plus startup/error handling.

Bounded host capability categories:

- repository text request/fetch;
- namespaced userscript storage read/write;
- download;
- clipboard write;
- style insertion;
- script metadata read;
- channel/bootstrap identity.

The raw `GM_*` APIs should not become a general page-global API. GitHub-owned core code should receive a bounded host object from the bootstrap.

## Historical extraction stages — non-executable

Issue #10 is closed/completed. The original Stage A–E text and stage acceptance model below are preserved verbatim as dated evidence; no pending gate or next action below overrides current routing.

### Stage A — contract freeze

- inventory responsibilities;
- freeze storage/global/loader/UI contracts;
- record extraction order.

**Status:** complete in source inventory; live baseline still required before behavioral extraction.

### Stage B — privileged host seam

- add a bounded privileged-host object inside the Dev launcher;
- keep current monolithic core behavior unchanged;
- validate host construction and Dev startup before moving any consumer.

### Stage C — low-risk presentation extraction

Candidates, in order:

1. compact emblem asset;
2. core CSS;
3. About/Disclaimer UI;
4. bone HUD/detection feature.

Each extraction must preserve DOM ids/classes and visible behavior.

### Stage D — application-shell extraction

Move, in bounded units:

- state/preferences orchestration;
- common UI helpers;
- tabs/tool/section registry;
- drag/resize/minimize/compact behavior;
- hotkey and undo/redo integration.

### Stage E — final bootstrap reduction

Replace the temporary Dev source-transform/eval seam with a true small userscript bootstrap that loads the GitHub-owned core through the bounded host.

## Acceptance model

For every stage:

1. static syntax/manifest/version checks;
2. compare affected contracts against this document;
3. live Dev runtime validation where behavior changes location/ownership;
4. human visual confirmation when presentation or interaction is involved;
5. no public Stable change until a later explicit narrow promotion.

Any unexplained behavior difference from Stable is treated as a regression, not an acceptable refactor side effect.

## Accepted modular composition

`features/core/Witch_Dock_Core.js` owns composition/startup and wires Preferences, Registry, Application, Shell, Interactions, History, Modals, Bone HUD, Assets, bounded host capabilities, and public WitchDock seams. The completed Dev architecture no longer requests/evaluates the legacy `Witch_Dock.user.js` monolith.

The primary detailed immutable delivery contract is [Runtime Delivery](../docs/policies/RUNTIME_DELIVERY.md#immutable-payload-pairing). It preserves one pinned manifest/core/module snapshot and strict component checks; loader invariants remain in this document. Bridge remains development infrastructure only.

The prior full Stage E delivery text remains retrievable at [bfd8c9f core contract](https://github.com/Knight-Witch/KnightWitch.Heroforge/blob/bfd8c9fc3a25d6589d1d51f3f9b4f95f11c16574/ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md).
