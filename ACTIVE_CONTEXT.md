# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-25  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Active task:** issue #83 — **Reusable Witch Dock notification / update-alert system**  
**Completed release:** issue #32 — **HR body paint zone collapse**  
**Separate open bug:** issue #34 — **HR false restore warning / native body mask verification**  
**Completed tooling:** issue #35 — **High Res diagnostic capture**  
**Public Stable:** v2.2.2 / `Witch_Scripts` @ `d2d2298e1949da71d64bb11e880f5af6868809f8`  
**Public immutable payload:** `1a586ec3540138694b2342a5fd074b5ec4b1a8e5`  
**Canonical Dev launcher:** v1.10.1 / payload `f1fac5e680e37549812d73ef497a28f3edb2510b`

## Current route

Issue #83 — Reusable Witch Dock notification / update-alert system — is the active Dev task. The generic notification service is staged as an isolated hidden module (`KWWitchDockNotifications` v0.2.0) with per-notice IDs, one-time page-storage acknowledgement, priority/queueing, optional primary actions, close/Escape handling, and an expandable modal surface. Release-specific copy is isolated in hidden module `Witch_Dock_Release_Notices.js` v0.2.0 rather than hard-coded into Core.

Amanda accepted the popup direction and requested a centered X, a larger emblem with less header margin, concise update instructions and release overview, and an expandable detailed release breakdown. The new Dev v1.10.1 payload contains Notifications v0.2.0, Release Notices v0.2.0, and Styles v0.8.0. Release copy is grounded in the fixed log: Booth JSON (#20), body color-bake restore (#24), body paint zones (#32), Dock size reset (#37/#41), update/header changes (#41), and approved UI polish (#58). #34 and #25 remain open; upcoming status/bug tools are labeled as planned. The existing no-repeat gate need not be replayed. Only new detail navigation/visuals and combined RC remain to be gated.

The first notice targets the upcoming combined public v2.3.0 release. Stable logic will show it only when `KWWitchDockStableHost.getState().installedWrapperVersion` proves the installed Tampermonkey wrapper is older than v2.3.0. It acknowledges on first successful display, links `Update Witch Dock` to the canonical public userscript URL, and tells the user this is a one-time wrapper refresh before normal automatic/runtime updates resume. Dev registers a separate one-time preview notice for visual validation.

Issue #58 — Bundle Polymorph display fonts for Witch Dock headers — has passed its Dev static/live/human gates on v1.9.6. Amanda approved the final typography/UI direction, including exact title/version baseline alignment. #58 is release-ready but intentionally held for the same public release as #83 rather than promoted separately. Dev v1.10.0 / `1.10.0-reusable-notifications` is pinned to immutable payload `a6e38936f30673528e7284127ed8bed42e808f3d`. Live Dev structural validation passed: Auto Host resolved canonical head `30cbe4a98ef850986ade4254251314a6d7758137`; loader passed 27/27 with 0 failed and 0 fallback; the Dev preview rendered with the canonical public Update link; acknowledgement was written on first display; after dismissal + reload the notice did not repeat. A non-persistent preview has been forced back on screen solely for Amanda's human visual gate. Public Stable remains v2.2.2 until the combined Dev/RC gates pass.

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
- #58 is Dev-accepted and release-ready; hold it for the combined #83 public release rather than promoting it separately.
- #83 is active and Dev-only until the generic notification service and v2.3.0 wrapper-update notice pass static/live/human gates.
- HF-Chat-Bridge is development infrastructure only and never a Witch Dock runtime dependency.
- Diagnostic capture is evidence collection, not a root-cause constraint: if captured evidence does not explain #32 when that issue resumes, inspect adjacent runtime/source behavior and identify missing capture layers.

## Cleanup

- #32 branch deletion handoff: `docs/BRANCH_DELETION_HANDOFF_ISSUE_32_2026-09-25.md`

- #37 branch deletion handoff: `docs/BRANCH_DELETION_HANDOFF_ISSUE_37_2026-09-25.md`
- #41 branch deletion handoff: `docs/BRANCH_DELETION_HANDOFF_ISSUE_41_2026-09-25.md`
- #35 branch deletion handoff remains separate: `docs/BRANCH_DELETION_HANDOFF_ISSUE_35_2026-09-24.md`
- `wd/dev-auto-host` is persistent development infrastructure and must be kept.
