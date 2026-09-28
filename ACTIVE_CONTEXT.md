# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-27 UTC
**Canonical Dev:** `WITCH_DEV_MAIN` v1.13.0 / immutable payload `1dd0d6b12eca3fa1fe00f4b9011ae3143a368999`
**Public Stable:** `Witch_Scripts` v2.3.1 / immutable payload `50405ca027e28227123f475c488538d214644b0d`
**Active issue:** #59 — Generic Bug Capture utility + HF.Status reproduction handoff
**Open unrelated product bug:** #34 — HR false restore warning / native body mask verification

## Confirmed #59 runtime baseline

### General Capture v1 — PASS

- Diagnostics Core v0.1.0 / `0.1.0-general-capture-v1`.
- Bug Capture UI v0.2.0 / `0.2.0-provider-selection`.
- General-only capture is observational, locally downloadable, and has 8 addressable SHA-256 sections.
- Provider failures are isolated; no automatic upload or HF.Status runtime dependency.

### Texture Quality provider v1 — PASS

- Provider `texture-quality` schema v1 / v0.1.0.
- Generic snapshot produced 10 provider sections with healthy High Res verification.
- Native Reconcile lifecycle state was invariant across capture.
- Existing High Res Diagnostics v0.1.3 / Native Reconcile lifecycle behavior remains unchanged.
- Retained pre-cleanup #34-style failure context is explicitly unavailable rather than fabricated.

### Booth provider v1 — PASS (Booth OFF/native runtime unloaded)

- Dev v1.13.0 / `1.13.0-booth-diagnostic-provider`, payload `1dd0d6b12eca3fa1fe00f4b9011ae3143a368999`.
- Loader 31/31, failed=0, immutable=31, fallback=0.
- Diagnostics Core providerCount=2: `booth` + `texture-quality`.
- Booth v27.2.0 read-only diagnostic seam, Bootstrap v0.2.2 read-only state, and TRUE-resolution Readiness v1.1.0 loaded successfully.
- Bug Capture UI visibly exposes Booth and High Res / Texture Quality provider choices.
- Booth-only generic capture produced 17 total sections: 8 General + 9 Booth; errorCount=0.
- Booth sections:
  - state: captured;
  - bootstrap: captured;
  - native-runtime: captured;
  - settings: unavailable because Booth runtime was not loaded (`compose-display-state-unavailable`);
  - presentation/components/media: captured-bounded;
  - failure-context: partial with explicit retained-history limitation;
  - events: not-captured with explicit normalization limitation.
- Snapshot did **not** activate or bootstrap Booth: before/after `sessionBoothView=false`, `runtimeReady=false`, bootstrap attempts=0, bootstrapCount=0, directSessionRequests=0, and global `BT` remained absent.
- TRUE-resolution readiness stayed unchanged and no media capture ran.

## Current route

Continue #59 provider rollout from the frozen issue #88 architecture.

Next provider: **Decals**.

Implementation goals:
1. preserve UI selection -> ordered layer -> model mapping -> rendered binding/projector trace;
2. capture Project/bound-transform state;
3. expose corrected/native gizmo ownership and transform-preservation state through narrow read-only seams;
4. expose Expanded Decal Slots / Slot Bridge readiness;
5. retain bounded recent preservation/failure context where current code would otherwise destroy it;
6. snapshot must create no character mutation and no undo history;
7. live gate must validate the current selected/available decal state without manufacturing a decal/Project toggle if none exists.

After Decals, continue provider rollout based on actual diagnostic value. Keep HF.Status backend/storage/triage ownership separate.

## Protected behavior

- General remains usable with zero providers.
- Feature providers remain opt-in.
- Provider failure cannot block General export.
- Heavy/armed operations remain explicit.
- Booth snapshot must remain observational.
- Texture Quality/High Res lifecycle remains untouched.
- Public Stable remains untouched.
- #34 remains separate.

## Design source

Issue #88 / `wd/88-diagnostic-capture-architecture`, especially `docs/diagnostics/providers/DECALS.md`.
