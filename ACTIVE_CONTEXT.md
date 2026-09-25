# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-25  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Active task:** issue #58 — **Bundle Polymorph display fonts for Witch Dock headers**  
**Completed release:** issue #32 — **HR body paint zone collapse**  
**Separate open bug:** issue #34 — **HR false restore warning / native body mask verification**  
**Completed tooling:** issue #35 — **High Res diagnostic capture**  
**Public Stable:** v2.2.2 / `Witch_Scripts` @ `d2d2298e1949da71d64bb11e880f5af6868809f8`  
**Public immutable payload:** `1a586ec3540138694b2342a5fd074b5ec4b1a8e5`  
**Canonical Dev launcher:** v1.9.3 / payload `47208351d47baec3cc0fa08d6446b37e1b2261c4`

## Current route

Issue #58 — Bundle Polymorph display fonts for Witch Dock headers — is the active Dev task. Amanda's latest visual direction narrows Polymorph to the main brand title only: left-aligned, larger letter-spaced `WITCH [emblem] DOCK`, with the emblem substantially enlarged, tighter WITCH/DOCK spacing, and small muted Dev/version metadata tucked immediately after DOCK. Tabs, section/tool headers, modal titles, buttons, and labels use the existing readable system stack with lighter weights; section/tool/modal headers are larger, slightly letter-spaced, and uniformly uppercase. Polymorph Regular and Bold remain bundled so the title weight can be changed later without another asset recovery. Candidate module revisions are Core v2.3.0, Shell v0.5.1, and Styles v0.5.2. Dev v1.9.3 / `1.9.3-title-alignment-fix` is pinned to immutable payload `47208351d47baec3cc0fa08d6446b37e1b2261c4`. The prior v1.9.3 live gate passed, but Amanda rejected the centered layout and requested a much larger emblem, left alignment, tighter title/version spacing, less title-bar vertical padding, and better optical centering for button text. This new style-only refinement supersedes the v1.9.3 visual candidate. The Dev launcher registry is staged for v1.9.4 / `1.9.4-compact-left-brand-header`; this payload commit will be pinned by the launcher next. Public Stable remains v2.2.2; next gates are live verification and Amanda's visual approval.

Issue #32 — HR body paint zone collapse — is released and complete. Public Stable v2.2.2 / `2.2.2-issue-32-body-aaid-binding` uses immutable payload `1a586ec3540138694b2342a5fd074b5ec4b1a8e5` with Texture Quality v0.3.8 / `0.3.8-supported-body-aaid-binding`. Dev visual gates passed on Human and Robot; structural AAID/restore coverage passed on Robot, Human, and Canine. Stable smoke passed on Half Dragon with real 1024 body AAIDs under HR ON, 2048 body allocations, and clean native OFF restoration. Dev v0.4.1 remains the canonical diagnostic superset because issue #35 intentionally owns the extra diagnostic state seam.

#32's temporary branch refs are recorded for exact mechanical deletion in `docs/BRANCH_DELETION_HANDOFF_ISSUE_32_2026-09-25.md`. Public Stable otherwise remains unchanged. Issue #34 remains separate.

Issues #37/#41 are complete; their separate mechanical branch cleanup remains under existing handoffs. Issue #42 remains a later Developer Mode/module-version-display cleanup task.

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

- #32 is complete on public Stable v2.2.2; its temporary refs are deletion-handoff only.
- #34 remains separate.
- #24 remains resolved unless its actual visual ON→OFF tint defect returns.
- #58 is active and remains Dev-only pending static/live verification and Amanda's typography visual approval. Do not promote the typography without that human gate.
- HF-Chat-Bridge is development infrastructure only and never a Witch Dock runtime dependency.
- Diagnostic capture is evidence collection, not a root-cause constraint: if captured evidence does not explain #32 when that issue resumes, inspect adjacent runtime/source behavior and identify missing capture layers.

## Cleanup

- #32 branch deletion handoff: `docs/BRANCH_DELETION_HANDOFF_ISSUE_32_2026-09-25.md`

- #37 branch deletion handoff: `docs/BRANCH_DELETION_HANDOFF_ISSUE_37_2026-09-25.md`
- #41 branch deletion handoff: `docs/BRANCH_DELETION_HANDOFF_ISSUE_41_2026-09-25.md`
- #35 branch deletion handoff remains separate: `docs/BRANCH_DELETION_HANDOFF_ISSUE_35_2026-09-24.md`
- `wd/dev-auto-host` is persistent development infrastructure and must be kept.
