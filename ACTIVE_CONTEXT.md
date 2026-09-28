# Active Context — issue #59 Booth diagnostic provider branch

**Updated:** 2026-09-27 UTC
**Branch:** `wd/59-booth-diagnostic-provider`
**Canonical Dev baseline:** v1.12.0 / immutable payload `504f5267a83a528ecbc4a6b2d797736575a74b02`
**Public Stable:** v2.3.1 / immutable payload `50405ca027e28227123f475c488538d214644b0d`
**Active issue:** #59 — Generic Bug Capture utility + HF.Status reproduction handoff

## Confirmed baseline

- General Capture v1 live gate PASS.
- Texture Quality provider schema v1 live gate PASS.
- Dev loader baseline: 30/30, 0 failed/fallback.
- Bug Capture UI v0.2.0 exposes feature providers as opt-in.

## Current Booth slice

- Booth -> v27.2.0 / `v27.2.0-diagnostic-state-seam`: adds bounded `getDiagnosticState()` only; old debug helper delegates to it.
- Booth Runtime Bootstrap -> v0.2.2 / `0.2.2-readonly-diagnostic-state`: `getState()` no longer mutates stored script-path diagnostic fields on first read.
- TRUE-resolution Readiness -> v1.1.0 / `1.1.0-diagnostic-readiness-state`: adds non-mutating `getState()`; existing `sync()` behavior preserved.
- Booth Diagnostic Provider -> v0.1.0 / `0.1.0-booth-state-adapter`.
- Provider sections: state, bootstrap, native-runtime, settings, presentation, components, media, failure-context, events.
- Settings are allowlisted from `composeDisplayState()`; `model` is excluded.
- Media evidence excludes output filenames and bytes.
- Settings/presentation retained failure history is explicitly partial; stable normalized Booth events are explicitly not captured yet.

Dev launcher v1.13.0 / `1.13.0-booth-diagnostic-provider` is pinned to immutable payload `1dd0d6b12eca3fa1fe00f4b9011ae3143a368999`.

## Protected behavior

- Booth provider snapshot must not activate/load/toggle Booth or start media capture.
- Do not call Booth settings save/apply operations during capture.
- Do not call TRUE-resolution readiness `sync()` during capture.
- Existing Booth/Black Canvas/persistence/media behavior must remain unchanged.
- General and Texture Quality capture behavior must remain unchanged.
- Public Stable remains untouched.

## Gate

1. syntax/static/manifest/version checks — PASS;
2. source delta limited to read-only seams + provider — PASS;
3. immutable Dev v1.13.0 payload — pinned to `1dd0d6b12eca3fa1fe00f4b9011ae3143a368999`;
4. reload once;
5. loader 31/31, zero failed/fallback;
6. providerCount=2 with `booth` present;
7. snapshot with only Booth provider while preserving current Booth state;
8. inspect state/bootstrap/settings/presentation/media coverage/privacy;
9. if Booth is already active, verify active state invariance; otherwise do not activate it merely for the snapshot gate.
