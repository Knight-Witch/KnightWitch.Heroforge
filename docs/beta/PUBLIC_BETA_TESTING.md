# Witch Dock Public Beta Testing

## Purpose

Public Beta is an additive testing layer for normal Witch Dock Stable. Testers keep the canonical Stable userscript installed and add one standalone Beta Tester userscript. Stable remains the baseline and must continue to start and operate when Beta Tester is missing, disabled, offline, or broken.

## Delivery

Install/update URL:

`https://witchdock.knightwitch.dev/beta/Witch_Dock_Beta_Tester.user.js`

Manifest:

`https://witchdock.knightwitch.dev/beta/manifest.json`

The provider-independent Worker serves the moving Beta Tester/manifest files from canonical `WITCH_DEV_MAIN`. Beta module code itself must never load from a moving branch. Every active manifest entry pins an immutable 40-character payload commit and source path, and the Beta Tester executes only those explicit entries.

## Module lifecycle contract

A beta module source must register exactly one definition through:

`KWWitchDockBetaTester.registerModule(definition)`

Required definition fields:

- `id`: stable lowercase slug matching the manifest entry.
- `version`: semantic version matching the manifest entry.
- `build`: build identifier matching the manifest entry.
- `activate(context)`: bounded activation; may return a promise.
- `deactivate(context)`: complete reversible cleanup; may return a promise.

Optional fields:

- `render(container, context)`: render beta-specific status/controls inside the Beta Tester section.
- `getState()`: return bounded diagnostic state.
- `dispose(context)`: final cleanup before a module version is replaced in-page.

A module that cannot safely deactivate without page reload is not eligible for live Beta OFF. Its manifest entry must declare `requiresReloadToDisable: true`; the Beta Tester will not pretend the module was removed live.

Do not use Beta Tester to hot-swap arbitrary Stable core modules unless that beta package has an explicit tested replacement/restore contract. Additive modules and reversible overlays are the default.

## Manifest entry contract

Active entries use this shape:

```json
{
  "id": "example-feature",
  "title": "Example Feature",
  "version": "0.1.0",
  "build": "0.1.0-beta",
  "status": "active",
  "defaultEnabled": true,
  "payloadRef": "0123456789abcdef0123456789abcdef01234567",
  "path": "features/example/Example.js",
  "minimumStableVersion": "2.4.2",
  "diagnosticProviderIds": ["example-feature"],
  "reporting": {
    "featureId": "public-beta-testing"
  }
}
```

Status values are `active`, `paused`, and `graduated`. Only `active` entries may execute.

## Promotion and cleanup

When a beta module ships to Stable, change its manifest entry to `graduated` and disabled for one Beta manifest revision so an already-open page can deactivate it cleanly. On the next normal Beta-manifest maintenance pass, remove the tombstone entirely. Do not accumulate permanently disabled historical entries; Git history is the archive.

A later patch test may re-add the same module ID with a newer version/build and immutable payload. The Beta Tester treats a version/build/payload change as a replacement: deactivate/dispose the old module first, then load the new one.

## Reporting

The Beta Tester registers the `beta-tester` diagnostic provider with Witch Dock Diagnostics Core. The provider records only Beta channel state: host version/build, manifest revision, module IDs/versions/builds/payload refs, active/disabled/error state, and bounded module `getState()` output.

Each module row exposes a Beta bug-report action. It opens the canonical Witch Dock reporter with the HF.Status Beta/QA classification and requests `beta-tester` plus the module's declared diagnostic providers when the reporter supports contextual provider overrides.

HF.Status owns the `wd-beta-qa` / `public-beta-testing` taxonomy, storage/indexing, and triage bucket. Until that paired HF.Status change is live, the Beta Tester must degrade without blocking Stable or module use.

## Versioning

The standalone Beta Tester maintains its own semantic userscript version/build in source. The Beta manifest maintains a monotonic integer `revision`. Each beta module maintains its own version/build and immutable payload reference.

The normal Witch Dock `manifest.json.moduleRegistry` does not list the standalone Beta Tester or transient Beta modules because they are not part of the Stable/Dev application bootstrap. The separate Beta manifest is their runtime authority.
