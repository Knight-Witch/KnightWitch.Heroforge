# Witch Dock Developer Mode

Status: **Dev candidate / not public**  
Branch: `WITCH_DEV_UI`  
Build: `0.1.0-dev-registry-about-toggle`

## Purpose

Provide one Witch Dock-wide switch for diagnostics and recovery controls that are useful to maintainers but unnecessary or confusing in normal user presentation.

Developer Mode is a Witch Dock concern, not a HeroForge runtime feature. It must not become a dependency for ordinary feature behavior.

## Product behavior

- Default: off.
- Persistence: `kw.witchDock.developerMode.v1` in page localStorage.
- User access: a `Developer Mode` checkbox injected into Witch Dock's existing `?` / About modal.
- No secret keyboard shortcut in the first candidate; that remains optional later.
- Turning Developer Mode on reveals developer-only tool metadata and any feature-specific troubleshooting controls that explicitly consume the shared mode.
- Turning it off returns the normal compact user presentation without disabling the underlying Witch Dock features.

## Shared runtime API

Global: `window.KWDeveloperMode`.

Candidate API:

- `build`
- `enabled` getter
- `setEnabled(value)`
- `toggle()`
- `onChange(listener)`
- `registerToolMeta(def)`
- `registrySnapshot()`
- `initialize()`
- `dispose()`

The module also emits `kw:witchdock-developer-mode` when the state changes.

## Tool build registry

The module wraps the named Witch Dock `registerTool` boundary rather than modifying the core shell. It records:

- tool ID;
- title;
- tab;
- declared `build`;
- declared `version`.

When Developer Mode is on, each mounted Witch Dock tool container receives a compact line:

`DEV · <tool-id> · build <declared-build>`

If a tool does not declare `build` or `version`, the UI says `build unreported`. Do not infer or invent a version from filenames, dates, titles, or unrelated globals.

Existing tools can add accurate metadata incrementally by including `build` or `version` in their `registerTool` definition. This should be treated as metadata-only work unless the module otherwise changes behavior.

## High Res Image Capture integration

`features/media/Photo_Booth_True_Resolution_UI.js` v0.2.0 consumes Developer Mode.

Normal mode remains:

- `High Res Image Capture`;
- `Capture: [4K] [8K]`;
- compact status only.

Developer Mode adds:

- `Repair provider enabled` checkbox using the existing service `enable()` / `disable()` API;
- UI adapter build;
- capture service build;
- readiness-adapter build;
- provider state;
- implementation note explaining that enabled square 4096/8192 HeroForge/Lob requests route through the maintained repair provider.

The capture service itself is unchanged.

## Architecture rationale

A hidden Witch Dock module is preferred over editing the large public shell for the first candidate because:

- the public shell remains a stable loader/UI host;
- Developer Mode can be independently enabled, disabled, tested, and disposed;
- tool registration is already a named Witch Dock API boundary;
- the module can be loaded before visible tools in the manifest and record their declared metadata;
- standalone Tampermonkey metadata allows isolated testing over current public Witch Dock before manifest promotion.

This is not a HeroForge patch and does not touch `CK`, `BT`, Webpack, bundle code, capture state, character state, or Photo Booth renderer state.

## Failure isolation / disposal

- If Witch Dock is not ready yet, the module waits and retries wrapping `registerTool`.
- If the About modal has not been created yet, the module waits; it does not force the modal open.
- Disposal clears timers, removes injected About/tool metadata UI, removes the dock developer-mode class, clears listeners, and restores the original `WitchDock.registerTool` function only if the module still owns the wrapper.
- If another module replaces `registerTool` after Developer Mode wraps it, disposal does not blindly overwrite that later owner.

## Validation status

Pre-commit local syntax:

- `Witch_Dock_Developer_Mode.js`: `node --check` PASS.
- High Res UI v0.2.0 consumer: `node --check` PASS.

Live validation pending after the active 3072px Spinny capture finishes. First live checks should cover:

1. About modal shows Developer Mode toggle.
2. Off state shows no developer metadata/control clutter.
3. On state reveals tool-ID/build lines.
4. High Res Image Capture reveals provider kill switch/build diagnostics only while Developer Mode is on.
5. Provider disable/enable works and direct 4K/8K readiness recovers.
6. Toggle state persists across reload.
7. No effect on HeroForge or Witch Dock behavior when Developer Mode remains off.

## Promotion gate

Do not promote Developer Mode to `Witch_Scripts` until live Dev smoke passes. Before claiming complete build visibility across all Witch Dock toolsets, add explicit build/version metadata to any older tool that currently reports `build unreported`; do not guess those values.
