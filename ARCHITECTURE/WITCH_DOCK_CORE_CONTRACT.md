# Witch Dock Core Contract — Issue #10

**Status:** Stage A baseline inventory  
**Task branch:** `wd/10-modular-bootstrap`  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Public Stable:** `Witch_Scripts`

## Purpose

Freeze the current Stable-derived Dock contracts before extracting the monolithic core. This document is a regression map, not a redesign specification.

## Confirmed current responsibilities in `Witch_Dock.user.js`

The current core owns multiple unrelated responsibilities that will be separated incrementally:

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

The long-term Tampermonkey entrypoint should retain only capabilities that require the userscript sandbox plus startup/error handling.

Planned bounded host capabilities:

- repository text request/fetch;
- namespaced userscript storage read/write;
- download;
- clipboard write;
- style insertion;
- script metadata read;
- channel/bootstrap identity.

The raw `GM_*` APIs should not become a general page-global API. GitHub-owned core code should receive a bounded host object from the bootstrap.

## Extraction stages

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

## Stage E final bootstrap contract

Issue #10 Stage E removes the temporary Dev path that fetched `Witch_Dock.user.js`, performed guarded runtime source-text transforms, and evaluated the transformed monolith.

Final delivery contract:

- `Witch_Dock_DEV.user.js` is a small channel/privilege/bootstrap host.
- Each launcher revision pins an immutable payload commit SHA. Human-readable payload refs may point to that commit for inspection, but runtime compatibility depends on the SHA.
- The payload contains the manifest, modular Core orchestrator, extracted core modules/assets, module loader, and feature-module sources.
- `KWWitchDockPayloadRoot` points at the immutable raw commit root. Module Loader resolves manifest modules from `moduleRegistry.path` under that root; legacy `modules[].url` remains fallback-only.
- Strict component version/build validation remains. Compatibility is achieved by immutable pairing, never by weakening checks.
- `features/core/Witch_Dock_Core.js` owns composition/startup only and wires Preferences, Registry, Application, Shell, Interactions, History, Modals, Bone HUD, Assets, bounded host capabilities, and public `WitchDock` seams.
- Module Loader retains concurrent fetch, deterministic manifest-order execution, cache-key behavior, and per-module failure isolation.
- `Witch_Dock.user.js` remains available for Stable/history during migration but is not requested or executed by Stage E Dev.
- HF-Chat-Bridge remains development infrastructure only and is never a Witch Dock runtime dependency.
