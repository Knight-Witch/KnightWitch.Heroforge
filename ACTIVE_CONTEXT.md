# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-25  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Active task:** issue #37 — **Dock default-size reset utility**  
**Paused task:** issue #32 — **HR body paint zone collapse**  
**Separate open bug:** issue #34 — **HR false restore warning / native body mask verification**  
**Completed tooling:** issue #35 — **High Res diagnostic capture**  
**Public Stable:** v2.0.3 / `Witch_Scripts` @ `0a5ee9c99f1ca999ead93baa39948d8595830064`  
**Public immutable payload:** `caef7c8b54c695934f26b1cc88ee2c79df7d65b1`  
**Canonical Dev launcher:** v1.6.0 / payload `67f06a0e691c4a96a71c83258fac8130df73b950`

## Current route

Complete issue #37 — Dock default-size reset utility — as a narrow Dev-only Utilities addition, then route back to #32 after live validation.

Issue #37 scope: add one Utilities button that forces the live Dock size state back to the canonical 380×520 defaults and persists that size. Do not change position, High Res behavior, or unrelated Dock lifecycle.

Validated diagnostic runtime:
- Texture Quality Native Reconcile v0.4.0 / `0.4.0-diagnostic-state-seam`;
- High Res Diagnostic Capture v0.1.3 / `0.1.3-addressable-comparison-sections`;
- High Res Diagnostic Capture UI v0.1.0 under Utilities;
- schema v1 with current snapshot, controlled Native OFF → HR ON comparison, deterministic summaries/deltas, coverage manifest, local JSON export, and addressable comparison sections.

## #35 final gate

PASS on canonical Dev v1.5.9 / payload `c4fe7ef7f6307578823706de552b44b8a2a378dd`:
- loader 25/25 executed;
- 0 failed;
- immutable=25;
- fallback=0;
- Diagnostics v0.1.3 loaded;
- Utilities registry contains `texture-quality-diagnostics-ui`;
- standard Current State capture is observational;
- controlled comparison restores the original HR state;
- targeted OFF/ON sections are retrievable without whole-snapshot overflow.

Robot config `59568049` was used only as the diagnostic tool's validation fixture. Do not treat #35 validation observations as a completed #32 diagnosis.

## Scope boundaries

- #32 remains the active bug investigation.
- #34 remains separate.
- #24 remains resolved unless its actual visual ON→OFF tint defect returns.
- Public Stable stays untouched while #32 investigation continues.
- HF-Chat-Bridge is development infrastructure only and never a Witch Dock runtime dependency.
- Diagnostic capture is evidence collection, not a root-cause constraint: if captured evidence does not explain #32, inspect adjacent runtime/source behavior and identify missing capture layers.

## Cleanup

Issue #35 and PR #36 are closed. Temporary branch `wd/35-hr-diagnostic-capture` is disposable; deletion handoff: `docs/BRANCH_DELETION_HANDOFF_ISSUE_35_2026-09-24.md`.
