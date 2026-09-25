# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-25  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Active task:** issue #58 — **Bundle Polymorph display fonts for Witch Dock headers**  
**Paused task:** issue #32 — **HR body paint zone collapse**  
**Separate open bug:** issue #34 — **HR false restore warning / native body mask verification**  
**Completed tooling:** issue #35 — **High Res diagnostic capture**  
**Public Stable:** v2.2.1 / `Witch_Scripts` @ `50b22b3f9d8bf030f958b5372e008bca5404fa1d`  
**Public immutable payload:** `d2be75fbab7a76a9833debe5145d7dd9e8e8b831`  
**Canonical Dev launcher:** v1.8.0 / payload `b4bd42695ab5280f723290525aa0b8f0e9b83dbf`

## Current route

Issue #58 — Bundle Polymorph display fonts for Witch Dock headers — is active. Amanda's owned full-source Polymorph Regular and Bold TTFs were recovered and verified against the source SHA-256 identities recorded by Polymorph. Both faces are staged as Witch Dock core assets; Bold is the initial display face for Dock title/tabs/section/tool/modal headings while body copy remains on the existing system-font stack. Regular is bundled but not selected by default so the display weight can be switched later without another asset-recovery pass.

Current #58 candidate: Assets v0.2.0 / `0.2.0-polymorph-display-fonts`; Styles v0.4.0 / `0.4.0-polymorph-display-typography`. The font-face URLs resolve from the launcher's immutable payload root rather than a third-party CDN. Public Stable remains v2.2.1 and is unchanged. Next gate is canonical Dev payload/launcher integration, live font-load verification, then Amanda's visual approval.

Issues #37/#41 are complete; only their separate mechanical branch cleanup remains under the existing handoffs. Issue #32 remains paused; do not resume it until explicitly requested. Issue #42 remains a later Developer Mode/module-version-display cleanup task.

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
- #58 is Dev-only until Amanda visually approves the typography; Public Stable v2.2.1 remains unchanged.
- HF-Chat-Bridge is development infrastructure only and never a Witch Dock runtime dependency.
- Diagnostic capture is evidence collection, not a root-cause constraint: if captured evidence does not explain #32 when that issue resumes, inspect adjacent runtime/source behavior and identify missing capture layers.

## Cleanup

- #37 branch deletion handoff: `docs/BRANCH_DELETION_HANDOFF_ISSUE_37_2026-09-25.md`
- #41 branch deletion handoff: `docs/BRANCH_DELETION_HANDOFF_ISSUE_41_2026-09-25.md`
- #35 branch deletion handoff remains separate: `docs/BRANCH_DELETION_HANDOFF_ISSUE_35_2026-09-24.md`
- `wd/dev-auto-host` is persistent development infrastructure and must be kept.
