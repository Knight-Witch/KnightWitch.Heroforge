# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-25  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Active task:** issue #32 — **HR body paint zone collapse**  
**Paused task:** issue #58 — **Bundle Polymorph display fonts for Witch Dock headers**  
**Separate open bug:** issue #34 — **HR false restore warning / native body mask verification**  
**Completed tooling:** issue #35 — **High Res diagnostic capture**  
**Public Stable:** v2.2.1 / `Witch_Scripts` @ `50b22b3f9d8bf030f958b5372e008bca5404fa1d`  
**Public immutable payload:** `d2be75fbab7a76a9833debe5145d7dd9e8e8b831`  
**Canonical Dev launcher:** v1.9.1 / payload `9aed4edee07e9ca746b6e49a8a8bf071e50fd996`

## Current route

Issue #32 — HR body paint zone collapse — is active. The diagnostic boundary is proven: promoted 2048 body atlas allocations drive native body AAID lookup toward unavailable 2048 body assets, producing HeroForge's shared 1×1 fallback even though paints, channels, masks, and atlas allocations remain valid. Work confirmed supported AAIDs restore real bindings when AAID source-size selection is decoupled from the 2048 destination allocation.

Texture Quality Native Reconcile v0.4.1 / `0.4.1-supported-body-aaid-binding` is the Dev candidate. It preloads each body's supported AAID at the native body source ceiling (up to 1024px) and temporarily overrides only native `paints.getTextureSize` during body `getAAID` resolution, while preserving the 2048 bake/atlas policy. The lookup wrapper is session-owned and restored before native OFF reconstruction. Canonical Dev v1.9.1 is pinned to the immutable #32 payload. Automated structural regression is PASS on Robot and Human: real supported body AAIDs are bound under HR ON while 2048 body allocations and supported masks remain intact; Robot native OFF restore also passed with the native AAID lookup restored. Human `59567957` is currently left HR ON for Amanda's visual paint-zone confirmation.

Issue #58 remains staged separately on canonical Dev v1.9.0 / payload `858416a37a31df48454f71c5a2493ddc733b5e7b`; its font-load/human visual gate is paused while #32 is active. Public Stable remains v2.2.1 and unchanged.

Issues #37/#41 are complete; only their separate mechanical branch cleanup remains under the existing handoffs. Issue #42 remains a later Developer Mode/module-version-display cleanup task.

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

- #32 is active; automated structural validation is PASS and production promotion is blocked only on the human visual gate.
- #34 remains separate.
- #24 remains resolved unless its actual visual ON→OFF tint defect returns.
- #58 remains Dev-only and paused pending Amanda's typography visual approval; its staged assets/styles are not part of #32.
- HF-Chat-Bridge is development infrastructure only and never a Witch Dock runtime dependency.
- Diagnostic capture is evidence collection, not a root-cause constraint: if captured evidence does not explain #32 when that issue resumes, inspect adjacent runtime/source behavior and identify missing capture layers.

## Cleanup

- #37 branch deletion handoff: `docs/BRANCH_DELETION_HANDOFF_ISSUE_37_2026-09-25.md`
- #41 branch deletion handoff: `docs/BRANCH_DELETION_HANDOFF_ISSUE_41_2026-09-25.md`
- #35 branch deletion handoff remains separate: `docs/BRANCH_DELETION_HANDOFF_ISSUE_35_2026-09-24.md`
- `wd/dev-auto-host` is persistent development infrastructure and must be kept.
