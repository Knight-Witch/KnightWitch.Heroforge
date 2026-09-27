# Active Context — issue #59 implementation branch

**Updated:** 2026-09-26 UTC
**Branch:** `wd/59-generic-bug-capture`
**Base:** current `WITCH_DEV_MAIN` v1.10.3 / public Stable v2.3.1
**Active issue:** #59 — Generic Bug Capture utility + HF.Status reproduction handoff
**Open unrelated product bug:** #34 — HR false restore warning / native body mask verification

## Current route

Implement the first #59 slice only:

1. Diagnostics Core v0.1.0.
2. General Capture schema v1.
3. Minimal Utilities → Bug Capture UI.
4. Static/syntax checks.
5. Dev launcher v1.11.0 pinned to immutable payload `a80c9b094824e0a9143cb46e87e20e11b4044fde`.
6. Next: merge candidate into canonical Dev and run live validation through HF-Chat-Bridge.

Do not adapt Texture Quality until General-only capture passes its gate.

Design source remains issue #88 on `wd/88-diagnostic-capture-architecture`.

## Protected behavior

- Snapshot capture is read-only and freezes current state before passive enrichment.
- Bug Capture must not wait away a broken/updating state.
- No automatic upload or HF.Status runtime dependency.
- No account/auth/session data, arbitrary storage, full character JSON, screenshots/media, or unbounded console/network history.
- Optional provider failures cannot block General capture/export.
- Existing High Res diagnostics v0.1.3 remain untouched in this slice.
- Public Stable remains untouched.

## Candidate versions

- Diagnostics Core: v0.1.0 / `0.1.0-general-capture-v1`.
- Bug Capture UI: v0.1.0 / `0.1.0-general-capture-ui`.
- Dev launcher staged: v1.11.0 / `1.11.0-generic-bug-capture`.

## Gate

General-only package must validate:
- stable envelope and capture ID;
- General section manifest with deterministic hashes/sizes;
- environment/graphics/Witch Dock/HeroForge/scene/coverage evidence;
- bounded errors/events;
- no state mutation;
- local JSON download;
- no loader/module regressions.
