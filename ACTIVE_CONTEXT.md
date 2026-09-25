# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-25  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Active task:** issue #37 — **Dock default-size reset utility / Stable promotion**  
**Paused task:** issue #32 — **HR body paint zone collapse**  
**Separate open bug:** issue #34 — **HR false restore warning / native body mask verification**  
**Completed tooling:** issue #35 — **High Res diagnostic capture**  
**Public Stable:** v2.0.3 / `Witch_Scripts` @ `0a5ee9c99f1ca999ead93baa39948d8595830064`  
**Public immutable payload:** `caef7c8b54c695934f26b1cc88ee2c79df7d65b1`  
**Canonical Dev launcher:** v1.6.1 / payload `c050a600d878a834656fbb04fad747c24c50ec53`

## Current route

Issue #37 — Dock default-size reset utility — has explicit Stable promotion approval. A narrow Developer-Mode version metadata refinement is pinned in Dev v1.6.1 and is being re-smoked before exact promotion; #32 remains paused and untouched.

Issue #37 prior live gate PASS: on Dev v1.6.0, the actual Utilities Reset Size button reset a seeded 500×966 Dock to 380×520, preserved x=954/y=261, persisted 380×520, and remained correct after reload. Public Stable is unchanged.

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
- Public Stable may change only for the explicitly authorized #37 release and #41 delivery maintenance; #32/#34 runtime scope remains untouched.
- HF-Chat-Bridge is development infrastructure only and never a Witch Dock runtime dependency.
- Diagnostic capture is evidence collection, not a root-cause constraint: if captured evidence does not explain #32, inspect adjacent runtime/source behavior and identify missing capture layers.

## Cleanup

Issue #35 and PR #36 are closed. Temporary branch `wd/35-hr-diagnostic-capture` is disposable; deletion handoff: `docs/BRANCH_DELETION_HANDOFF_ISSUE_35_2026-09-24.md`.


## Immediate maintenance after #37

Issue #41 — update delivery hardening — is authorized next because stale mutable raw-branch delivery can undermine Dev/Stable validation. Preserve all paused #32/#34 state while doing that maintenance. Issue #42 is a later, non-bug Developer Mode version-display cleanup task.
