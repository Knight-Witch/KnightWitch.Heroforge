# Witch Dock Module Versioning

This file defines the required versioning contract for active Witch Dock runtime modules.

## Canonical registry

`manifest.json` contains the canonical `moduleRegistry` array for active runtime modules. It includes normal manifest-loaded tools, hidden HeroForge UI modules, conditional runtime children, and the Witch Dock core shell.

Every active runtime module must have exactly one registry entry containing at minimum:

- stable module ID;
- source path;
- numeric version;
- load type / role where useful.

Existing source-local build tags remain valid diagnostics and may be recorded separately as `build`. The canonical numeric module version is the registry `version`.

Archived files, historical references, probes, backups, and dead/unused scripts are not part of the active module registry.

## Required version bump rule

Any commit that changes an active module's runtime behavior, UI, public/runtime API, storage behavior, compatibility logic, initialization/disposal behavior, or HeroForge integration must update that module's canonical version in `manifest.json` in the same commit.

A module source change must not be committed with an unchanged canonical version unless the change is strictly comments/formatting and has no runtime effect. When in doubt, bump the version.

Documentation-only changes do not require module-version bumps when no module source or runtime contract changes.

If a module also declares its own source-local `version`, `VERSION`, `BUILD`, `BUILD_TAG`, userscript `@version`, or equivalent identifier, update it consistently when that module changes. Do not leave a known stale source-local identifier behind the canonical registry.

`CHANGELOG.md` and `PRE_FLIGHT_Check.md` should identify every module version changed by a committed runtime update.

## Version scheme

Use semantic versioning for maintained numeric module versions:

- **PATCH** (`x.y.Z`): bug fix, compatibility repair, internal correction, or small UI correction that preserves the module's intended external contract.
- **MINOR** (`x.Y.0`): additive feature, meaningful new UI/control, new optional capability, or backward-compatible API expansion.
- **MAJOR** (`X.0.0`): breaking API/storage/behavior contract, replacement architecture requiring migration, or intentionally incompatible redesign.

New experimental modules may begin below `1.0.0` (for example `0.1.0`). Existing live modules that had no trustworthy historical version received a documented `1.0.0` baseline on 2026-09-06; this is a tracking baseline, not reconstructed release history.

## Initial normalization — 2026-09-06

Existing explicit identifiers were preserved where possible:

- Witch Dock core `1.0.8` -> canonical `1.0.8`.
- Body Editor legacy visible `v4` -> canonical `4.0.0`.
- Booth build `v24` -> canonical `24.0.0`.
- Corrected Bound Decal Gizmo `1.1.0-stable-undo-transform-preserve` -> canonical `1.1.0`.
- High Res Image Capture service `0.7.0-witch-dock-dev-provider` -> canonical `0.7.0`.
- Photo Booth True Resolution Readiness `1.0.0-public-readiness` -> canonical `1.0.0`.
- High Res Image Capture UI `0.2.0-dev-developer-mode` -> canonical `0.2.0`.
- Developer Mode v0.2 registry work -> canonical `0.2.0`.

The following active modules had no trustworthy numeric version and receive canonical `1.0.0` baselines as of 2026-09-06:

- Expanded UI Scroll Guards (existing build tag `2026-07-03-layouts` preserved separately);
- HF UI Scroll Split Safe;
- HF UI Slot Bridge;
- conditional Expanded Decal Slots;
- Pose;
- Decals host;
- JSON Tool;
- Utilities.

These baseline numbers do not claim prior historical release counts.

## Developer Mode display

Developer Mode reads `manifest.json.moduleRegistry` and uses it as the canonical version source. When a module also reports a runtime build tag, Developer Mode may show both, for example:

`DEV · booth-tool · v24.0.0 · build v24`

Developer Mode must never fabricate an unregistered version. Registry-fetch failure is diagnostic-only and must not disable normal Witch Dock behavior.
