# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-24  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Active task:** issue #32 — **HR body paint zone collapse**  
**Completed tooling:** issue #35 — **High Res diagnostic capture**  
**Separate open bug:** issue #34 — **HR false restore warning / native body mask verification**  
**Public Stable:** v2.0.3 / `Witch_Scripts` @ `0a5ee9c99f1ca999ead93baa39948d8595830064`  
**Canonical Dev launcher:** v1.5.9 / payload `c4fe7ef7f6307578823706de552b44b8a2a378dd`

## Current route

Resume issue #32 using the validated High Res Diagnostic Capture instead of rebuilding ad hoc probes.

Current Dev diagnostic components:
- Texture Quality Native Reconcile v0.4.0 / `0.4.0-diagnostic-state-seam`;
- High Res Diagnostic Capture v0.1.3 / `0.1.3-addressable-comparison-sections`;
- High Res Diagnostic Capture UI v0.1.0 under Utilities;
- loader 25/25, 0 failed, immutable=25, fallback=0 on the integrated payload.

## #35 validation carried forward

- `Capture Current State` is observational: HR before/after state remained OFF, idle, error-free, and on the same native atlas/restore state.
- Controlled Native OFF → High Res ON comparison completed on #32 Robot config `59568049` and restored the original OFF state with native restore verification PASS.
- Whole snapshots can exceed Bridge result bounds; use manifest/summary and `getComparisonSection(snapshot, section)` / compact comparison facts for targeted retrieval.
- Robot was used only to validate the capture tool. Do not treat the validation observations as a completed #32 diagnosis.

## #32 next step

Run the diagnostic-driven #32 investigation from the existing Robot fixture/current issue state. Start from the standardized comparison evidence, then broaden only where the capture leaves an unexplained layer. Do not restart the fixture matrix or redo already durable #32 findings without contradictory evidence.

## Scope boundaries

- #32 remains separate from #34.
- #24 remains resolved unless its actual visual ON→OFF tint defect returns.
- Public Stable stays untouched unless a later issue explicitly reaches promotion.
- HF-Chat-Bridge is development infrastructure only and never a Witch Dock runtime dependency.
