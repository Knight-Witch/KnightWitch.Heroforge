# Witch Dock Developer Mode

Status: **Dev candidate / not public**  
Branch: `WITCH_DEV_UI`  
Build: `0.2.0-dev-module-version-registry`

## Purpose

Provide one Witch Dock-wide switch for diagnostics and recovery controls that are useful to maintainers but unnecessary or confusing in normal user presentation.

Developer Mode is a Witch Dock concern, not a HeroForge runtime feature. It must not become a dependency for ordinary feature behavior.

## Product behavior

- Default: off.
- Persistence: `kw.witchDock.developerMode.v1` in page localStorage.
- User access: a `Developer Mode` checkbox injected into Witch Dock's existing `?` / About modal.
- No secret keyboard shortcut in the current candidate; that remains optional later.
- Turning Developer Mode on reveals developer-only tool metadata and feature-specific troubleshooting controls that consume the shared mode.
- Turning it off returns the normal compact user presentation without disabling underlying Witch Dock features.
- Developer Mode also exposes a `Module Versions` list in About using the canonical module registry.

## Shared runtime API

Global: `window.KWDeveloperMode`.

Current API:

- `build`
- `version`
- `enabled` getter
- `setEnabled(value)`
- `toggle()`
- `onChange(listener)`
- `registerToolMeta(def)`
- `registerModuleMeta(meta)`
- `registrySnapshot()`
- `moduleRegistrySnapshot()`
- `reloadModuleRegistry()`
- `registryLoaded` getter
- `registryError` getter
- `initialize()`
- `dispose()`

The module also emits `kw:witchdock-developer-mode` when the state changes.

## Canonical module version registry

As of v0.2.0, Developer Mode reads the canonical `manifest.json.moduleRegistry` data and combines that with runtime-declared tool metadata when available. This avoids version-only edits across large validated runtime files while still giving every active Witch Dock module an explicit numeric identifier.

Detailed policy: `MODULE_VERSIONING.md`.

Visible tool containers can show lines such as:

`DEV · booth-tool · v24.0.0 · build v24`

The About modal's `Module Versions` list also covers hidden and conditional active modules that do not mount visible Witch Dock tool containers. Registry lookup failure is diagnostic-only and must not disable normal Witch Dock behavior.

## Version provenance

The 2026-09-06 registry initialization distinguishes:

- `existing`: an explicit numeric version already existed;
- `normalized-existing`: an existing legacy numeric tag such as `v4` or `v24` was normalized to `4.0.0` / `24.0.0`;
- `baseline-2026-09-06`: the active module had no trustworthy numeric version and received a new tracking baseline, normally `1.0.0`.

These baselines are not reconstructed historical release counts.

## High Res Image Capture integration

`features/media/Photo_Booth_True_Resolution_UI.js` v0.2.0 consumes Developer Mode. Normal mode remains compact; Developer Mode adds the repair-provider kill switch, UI/service/readiness builds, provider state, and the implementation note. The Stable capture service itself is unchanged.

## Architecture rationale

A hidden Witch Dock module is preferred over editing the large public shell because the shell remains a stable loader/UI host, Developer Mode is independently disposable, and the canonical version registry can live with the active loading inventory in `manifest.json`.

This is not a HeroForge patch and does not touch `CK`, `BT`, Webpack, bundle code, capture state, character state, or Photo Booth renderer state.

## Failure isolation / disposal

- If Witch Dock is not ready yet, the module waits and retries wrapping `registerTool`.
- If the About modal has not been created yet, the module waits; it does not force the modal open.
- If the module registry cannot be fetched, Developer Mode reports the registry error but normal Witch Dock behavior remains unaffected.
- Disposal clears timers, removes injected About/tool metadata UI, clears registries/listeners, and restores the original `WitchDock.registerTool` only when it still owns the wrapper.

## Validation status

v0.1.0 standalone Developer Mode and the compact High Res UI were user-confirmed working and visually accepted on 2026-09-06.

v0.2.0 module-registry expansion:

- local `node --check`: PASS;
- manifest JSON parse/unique-ID/coverage validation: PASS;
- live Module Versions registry display: pending.

## Promotion gate

Do not promote Developer Mode to `Witch_Scripts` until the v0.2.0 registry display is smoke-tested. Public promotion must also include the canonical module registry and `MODULE_VERSIONING.md` contract.
