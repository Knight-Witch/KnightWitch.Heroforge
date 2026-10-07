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


### Human smoke coverage gap and v0.1.13 correction

Amanda's first High Res Phase 2 human smoke on Counting Sheep confirmed that substantial coverage improved, but both bird-shield families and the battle hand fan remained visibly lower resolution.

Live runtime evidence isolates the cause:

- Bridge #4633/#4634: `shieldBirdWing`, `shieldBirdFlying`, and `fanBattle` all have verified 512 normal-source headroom with no failed source URLs. Their density plans were blocked during marginal-value packing.
- The rejected detached atlas reconstructed unrelated `eyebrowL` at 32x32 even though the live baseline is 128x128 (#4635).
- #4636/#4637 confirms the shield/fan metadata is eligible and `eyebrowL` is genuinely live at 128x128.
- #4638 shows `CK.Atlas` natively accepts `options.minimumSizes` as per-slot packing floors.
- #4639 shows HeroForge's real `buildAtlas` supplies the constructor's seventh options argument, while all-part v0.1.12's detached preflight omitted it.

All-part v0.1.13 / `0.1.13-native-baseline-preflight` corrects only that detached safety model: it passes the current live baseline allocation edges as native `minimumSizes` during preflight. This prevents the synthetic preflight from inventing unrelated shrinkage before evaluating a candidate. It does **not** relax the real runtime safety boundary: after the actual HeroForge rebuild, collateral detection still checks every live allocation and the existing owned rollback still rejects/restores any genuine shrink.

The Stable-compatible Beta wrapper is bumped to v0.1.1 / `0.1.1-native-baseline-preflight` and embeds exact all-part v0.1.13. Focused all-part, ownership, Beta-wrapper, and Beta-host tests pass 41/41. A new immutable package payload and manifest revision are required before live retest; manifest r3 remains default-OFF.


### Manifest revision 4 corrective machine gate

Revision 4 replaces only the `high-res-phase-2` assignment:

- version/build: v0.1.1 / `0.1.1-native-baseline-preflight`
- immutable payload: `cf0c24a4c31571df53f6c24b4e5dad3ac6bfc2d2`
- `defaultEnabled: false`
- Stable minimum remains v2.4.2.

Because Amanda's local preference for this module is already ON, a controlled manifest refresh may replace and reactivate the module in her current session. Treat that refresh as one at-most-once mutation and read back before any retry. The required live proof is specific: both bird-shield families and `fanBattle` must gain the intended density without shrinking `eyebrowL` below its 128x128 baseline or producing any unrelated collateral; then compare total skipped groups/rejection reasons, rollback once, and re-enable for human visual confirmation.


### r4 rollback and native-shadow preflight

Manifest r4 safely rejected the v0.1.13 baseline-floor approximation during live activation. Bridge #4645 retained the exact Beta error: `All-part promotion would downsize existing atlas allocations.` Readback #4644 confirmed the failed package left no all-part owner behind and restored exact Stable Active Decal Priority 0.1.1.

The next correction does not relax that guard. All-part v0.1.14 / `0.1.14-native-shadow-preflight` uses the live display's own `buildAtlas` method on a detached shadow object containing only cloned parts, candidate `atlasScale`, `isUHD()`, and a private `resourceAtlas` result slot. Because the native method retains HeroForge's lexical/private slot metadata and atlas options, the preflight now runs the same packing constructor path as the eventual live rebuild without mutating the live display.

If the native shadow builder is unavailable, the old direct `CK.Atlas` path remains only as a bounded fallback. Existing post-rebuild collateral detection and exact rollback are unchanged.

Regression coverage includes both directions: a native shadow build that preserves an unrelated 128 baseline permits the shield-style 512 plan, while a native shadow build that would shrink that unrelated slot rejects/downgrades the 512 candidate before mutation. Focused all-part/ownership/Beta tests pass 42/42. The Stable-compatible wrapper is v0.1.2 / `0.1.2-native-shadow-preflight`.


### Manifest revision 5 native-shadow machine gate

Revision 5 replaces the failed r4 Phase 2 package with:

- version/build: v0.1.2 / `0.1.2-native-shadow-preflight`
- immutable payload: `150e420e069dd1eb3cfd9872e71fe52a6ce9f063`
- embedded all-part: v0.1.14 / `0.1.14-native-shadow-preflight`
- `defaultEnabled: false`
- Stable minimum v2.4.2.

Amanda's saved local preference remains ON, so one controlled manifest refresh may replace and activate r5 automatically. Treat that refresh at-most-once and read back before any retry. Required proof: module must settle active without post-rebuild collateral failure; both bird-shield families and `fanBattle` must receive the selected density or be explicitly downgraded by the native-shadow planner; unrelated allocations must remain non-regressed; then perform rollback/settle and re-enable before human visual confirmation.
