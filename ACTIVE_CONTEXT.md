# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-25  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Active task:** janitorial closeout for completed issues #37 and #41  
**Paused task:** issue #32 — **HR body paint zone collapse**  
**Separate open bug:** issue #34 — **HR false restore warning / native body mask verification**  
**Completed tooling:** issue #35 — **High Res diagnostic capture**  
**Public Stable:** v2.2.1 / `Witch_Scripts` @ `50b22b3f9d8bf030f958b5372e008bca5404fa1d`  
**Public immutable payload:** `d2be75fbab7a76a9833debe5145d7dd9e8e8b831`  
**Canonical Dev launcher:** v1.8.0 / payload `b4bd42695ab5280f723290525aa0b8f0e9b83dbf`

## Current route

Issues #37 — Dock default-size reset utility — and #41 — update delivery hardening / header version visibility — have passed their release gates.

Public Stable v2.2.1 is live. Stable self-host v1.0.0 resolved the exact current `Witch_Scripts` head through GitHub's ref API, reported `local-wrapper-current`, and loaded immutable payload `d2be75fbab7a76a9833debe5145d7dd9e8e8b831`. Stable loader smoke passed 23/23 executed, 0 failed, 23 immutable, 0 fallback. Amanda visually confirmed the RC reset-button and resize-border double-click behavior before the exact RC head was promoted.

Canonical Dev v1.8.0 is live through Dev Auto Host v0.2.0. The host resolved exact `WITCH_DEV_MAIN` head `6b59e9a509b0cc712dd17bb1b95b8c75a4e0e3ab`, loaded immutable payload `b4bd42695ab5280f723290525aa0b8f0e9b83dbf`, and passed 25/25 executed, 0 failed, 25 immutable, 0 fallback. Shared Shell/Core/Styles/Interactions/Utilities bytes were verified identical to the promoted Stable RC payload.

The only remaining #37/#41 work is mechanical branch cleanup under the exact deletion handoffs in `docs/`. Issue #32 remains paused; do not resume it until explicitly requested. Issue #42 remains a later Developer Mode/module-version-display cleanup task.

## Validated diagnostic runtime

- Texture Quality Native Reconcile v0.4.0 / `0.4.0-diagnostic-state-seam`;
- High Res Diagnostic Capture v0.1.3 / `0.1.3-addressable-comparison-sections`;
- High Res Diagnostic Capture UI v0.1.0 under Utilities;
- schema v1 with current snapshot, controlled Native OFF → HR ON comparison, deterministic summaries/deltas, coverage manifest, local JSON export, and addressable comparison sections.

## #35 final gate

PASS on canonical Dev diagnostic scope:
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

- #32 remains paused.
- #34 remains separate.
- #24 remains resolved unless its actual visual ON→OFF tint defect returns.
- No further Stable mutation is authorized by the completed #37/#41 rollout.
- HF-Chat-Bridge is development infrastructure only and never a Witch Dock runtime dependency.
- Diagnostic capture is evidence collection, not a root-cause constraint: if captured evidence does not explain #32 when that issue resumes, inspect adjacent runtime/source behavior and identify missing capture layers.

## Cleanup

- #37 branch deletion handoff: `docs/BRANCH_DELETION_HANDOFF_ISSUE_37_2026-09-25.md`
- #41 branch deletion handoff: `docs/BRANCH_DELETION_HANDOFF_ISSUE_41_2026-09-25.md`
- #35 branch deletion handoff remains separate: `docs/BRANCH_DELETION_HANDOFF_ISSUE_35_2026-09-24.md`
- `wd/dev-auto-host` is persistent development infrastructure and must be kept.
