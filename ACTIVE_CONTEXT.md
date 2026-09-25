# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-25  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Active task:** issue #58 — **Bundle Polymorph display fonts for Witch Dock headers**  
**Completed release:** issue #32 — **HR body paint zone collapse**  
**Separate open bug:** issue #34 — **HR false restore warning / native body mask verification**  
**Completed tooling:** issue #35 — **High Res diagnostic capture**  
**Public Stable:** v2.2.2 / `Witch_Scripts` @ `d2d2298e1949da71d64bb11e880f5af6868809f8`  
**Public immutable payload:** `1a586ec3540138694b2342a5fd074b5ec4b1a8e5`  
**Canonical Dev launcher:** v1.9.6 / payload `4d7a92d183515fb59f93685632c2afeec0691a00`

## Current route

Issue #58 — Bundle Polymorph display fonts for Witch Dock headers — remains the active Dev task and now also owns the accompanying Dock UI consistency pass requested during visual review. The brand remains left-aligned `WITCH [emblem] DOCK` in Polymorph Bold with a large emblem and muted inline Dev/version metadata; this pass tightens the word/emblem spacing further. Tabs, subtool headers, buttons, checkboxes, hover states, and the main body scrollbar are being standardized around the readable system stack and the Dock's existing purple accent. Tool tabs use fixed-height flex centering; section/tool header vertical padding is reduced; common text buttons use consistent 12px semibold typography and 30px control height where appropriate; checked checkboxes use the purple accent; tab/tool-button hover uses the same purple treatment as High Res; the main scrollbar track is dark. High Res persistence now matches Utilities persistence styling and uses the label `Enabled`. Polymorph Regular and Bold remain bundled. Candidate module revisions are Core v2.3.0, Shell v0.5.1, Styles v0.6.0, and Texture Quality UI v0.3.0. Dev v1.9.5 / `1.9.5-ui-standardization` is pinned to immutable payload `1f8333aa0b18bf9d880ccf9fa16ca03ef3102433`. Live Dev verification passed: Auto Host resolved exact canonical head `23e003d03824d70d036f988ae00c854461f482b9`; loader passed 25/25 with 0 failed and 0 fallback; Polymorph Bold loaded from the immutable payload. Tool tabs now render at a fixed 30px height; decal gizmo and High Res primary buttons both render at 30px; High Res persistence visibly reads `Enabled`; visible section headers are ~36.9px tall with reduced vertical padding; title width shrank from ~216.6px to ~199.4px while retaining the 34px emblem box, confirming the tighter word/emblem spacing. Amanda approved the overall v1.9.5 typography direction and requested one final optical correction: move the muted Dev/version metadata down 3px so its bottom aligns with the 16px Polymorph title glyphs. Styles v0.6.1 / `0.6.1-title-version-baseline` implements that correction. Dev v1.9.6 / `1.9.6-title-version-baseline` is pinned to immutable payload `4d7a92d183515fb59f93685632c2afeec0691a00`. Public Stable remains v2.2.2; next gates are live geometry verification and Amanda's final visual approval before promotion.

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
