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


## Live Stable + Beta validation

Validated 2026-10-07 against Public Stable v2.4.2 with Beta Tester v0.1.0 installed.

- Stable remained authoritative and the Dev channel was absent.
- Beta Tester reached `ready`, loaded manifest revision 1 without error, registered `beta-tester` diagnostics, and correctly reported zero staged/active modules for the intentionally empty manifest.
- Master Beta OFF then ON completed reversibly without changing Stable version, ref, payload, or status.
- The live Stable dock visibly exposed `Beta Tester: ON`, `Refresh Beta Manifest`, and `Report Beta Channel Bug`.
- HF.Status #112 owns the separate `wd-beta-qa` / `public-beta-testing` backend taxonomy and triage implementation.
- Automatic Beta-specific provider selection in the canonical Stable reporter remains separately gated on Bug Capture UI v0.4.6.


## Current smoke module

Manifest revision 2 assigns `beta-channel-smoke` / **Beta Channel Smoke Test** to immutable payload `fc758733f445624b39797fc8edef91e130627237`.

This module is intentionally non-feature-mutating. It proves the full Public Beta module path: immutable fetch, registration, automatic/default activation, visible `IN BETA` module UI, live module OFF/ON, bounded module state inside the `beta-tester` diagnostic provider, and the canonical Beta bug-report action.

It includes a local **Mark Smoke Check** button. The counter exists only in the loaded module instance and is not persisted or uploaded automatically.


## High Res Phase 2 Stable-compatible package — controlled manifest gate

The first real feature Beta is `high-res-phase-2` v0.1.0 / `0.1.0-stable-compat-phase2`. Manifest revision 3 exposes this package as an active but `defaultEnabled: false` entry pinned to immutable payload `58ea087c63f61d945396a20eb9bffca8f383c9ee`. This is a controlled machine-validation gate: existing/new testers are not automatically opted into Phase 2.

The package deliberately keeps Stable Native Reconcile in place and fails closed unless the live baseline is exactly Native Reconcile 0.3.8 / `0.3.8-supported-body-aaid-binding` plus Active Decal Priority 0.1.1 / `0.1.1-dev-projected-host-lifecycle-coordination`.

While active it disposes Stable priority through its public cleanup contract, loads exact Dev Active Decal Priority 0.1.2 / `0.1.2-preserve-external-scales`, then layers exact all-part v0.1.12 / `0.1.12-independent-normal-headroom`. The generated package pins source blobs `24246a918e7132158941caee74ca6f5f3ff7d76d`, `9f24f18b3f91fcb0d2c49546e904282cfb85b9f8`, and Stable restore blob `a89c57e09cdaa2f4213f6b3a8eed95118f4c4d14`.

Stable 0.3.8's lexical automatic-enable / scene-sync calls bypass public owner wrappers. The Beta package compensates only after the native core settles: a bounded display-identity bridge refreshes the 0.1.2 priority owner, waits for its reconcile, then ensures one all-part coverage pass. It schedules only on a stable OFF→ON transition or changed live display identity and suppresses emissions caused by its own repair pass.

Beta OFF disposes all-part first, disposes Beta priority second, then restores the exact Stable 0.1.1 priority source in-page. The Stable Native Reconcile object is never replaced. Focused regression covers fail-closed identity checks, owner swap/restore, core identity preservation, repeated-emission anti-loop behavior, and one-repair-per-display-change. The live Public Stable machine gate has now passed; human visual/performance confirmation remains before public/default enablement.


### Manifest revision 3 machine gate

Revision 3 retains `beta-channel-smoke` and adds `high-res-phase-2` default-OFF. The live machine gate PASSED on Amanda's Public Stable v2.4.2 session:

- Bridge #4615: manifest r3 loaded cleanly; Phase 2 remained inactive/preferred OFF by default.
- #4616/#4624: one activation preserved Native Reconcile 0.3.8, installed Active Decal Priority 0.1.2 and all-part 0.1.12, verified two figures, and settled with 104 active bindings / 69 density selections / zero failures.
- #4625: bounded Beta diagnostics showed lifecycle repair count 2 with no pending work; the count remained exactly 2 across a quiet 3-second interval, proving no self-loop.
- #4626/#4627: Beta OFF removed the all-part global, restored exact Stable priority 0.1.1, and Stable settled with High Res still ON/persistent, verified, and error-free.
- #4628/#4629: a new activation from the known Stable baseline settled normally; Phase 2 is active with 104 bindings, no error, no pending repair, and the Stable core remains 0.3.8.

Amanda's local module preference is intentionally left ON for the human visual/performance smoke. Manifest r3 remains default-OFF for everyone else. Do not make a later revision default-ON until Amanda confirms the visual gate.
