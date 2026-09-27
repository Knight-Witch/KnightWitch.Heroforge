# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-26 UTC
**Canonical Dev:** `WITCH_DEV_MAIN` v1.11.0 / immutable payload `a80c9b094824e0a9143cb46e87e20e11b4044fde`
**Public Stable:** `Witch_Scripts` v2.3.1 / immutable payload `50405ca027e28227123f475c488538d214644b0d`
**Active issue:** #59 — Generic Bug Capture utility + HF.Status reproduction handoff
**Open unrelated product bug:** #34 — HR false restore warning / native body mask verification

## Current route

#59 first implementation slice is integrated in canonical Dev:

- Diagnostics Core v0.1.0 / `0.1.0-general-capture-v1`;
- General Capture schema v1;
- Bug Capture UI v0.1.0 / `0.1.0-general-capture-ui` registered into Utilities;
- Dev launcher v1.11.0 / `1.11.0-generic-bug-capture`;
- immutable payload `a80c9b094824e0a9143cb46e87e20e11b4044fde`.

Static/syntax/manifest/privacy checks passed.

## Exact next step

Run the live Dev gate through HF-Chat-Bridge:

1. reload canonical Dev once;
2. verify launcher v1.11.0 and loader 27/27 with zero failures/fallback;
3. verify `KWWitchDockDiagnostics` and Bug Capture UI are present;
4. run General-only capture and inspect manifest/coverage/section hashes;
5. verify capture is observational and local download succeeds;
6. only after that gate passes, adapt existing High Res Diagnostics v0.1.3 to the generic provider contract.

Two read-only Bridge pings (#3663/#3664) are currently open with no relay result. Do not infer live failure from that transport state and do not replay a mutation request blindly.

## Protected behavior

- General snapshot is read-only and freezes current state before enrichment.
- Bug Capture never uploads automatically; HF.Status is not a runtime dependency.
- Default capture excludes account/auth/session data, arbitrary storage, full character JSON, screenshots/media, and unbounded console/network history.
- Optional provider failures cannot block General capture/export.
- Existing High Res Diagnostics v0.1.3 remains untouched until the General-only gate passes.
- Public Stable remains untouched.

## Design source

Issue #88 / `wd/88-diagnostic-capture-architecture` remains the v1 capture/provider design baseline. HF.Status owns the shared diagnostic-report envelope and intake/triage backend.
