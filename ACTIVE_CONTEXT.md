# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-25  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Active task:** issue #41 — **Update delivery hardening / header version visibility**  
**Paused task:** issue #32 — **HR body paint zone collapse**  
**Separate open bug:** issue #34 — **HR false restore warning / native body mask verification**  
**Completed tooling:** issue #35 — **High Res diagnostic capture**  
**Public Stable:** v2.1.0 / `Witch_Scripts` @ `407d9b6d46dd93a2e2818e59bbea7aa6333b6b20`  
**Public immutable payload:** `002e0e62a21798091c96c3eb52668c8ae0844629`  
**Canonical Dev launcher:** v1.6.1 / payload `c050a600d878a834656fbb04fad747c24c50ec53`

## Current route

Issue #41 — Update delivery hardening / header version visibility — is active. Public v2.1.0 for #37 is published, but Amanda's installed Stable remained on v2.0.3 after reload, so the #37 Stable smoke is blocked by the updater seam rather than the Reset Size implementation.

#41 scope: harden Dev and Stable launcher delivery against stale mutable raw-branch responses; keep immutable payload pairing and visible failure behavior. As adjacent update observability, Stable will show its runtime version beside WITCH DOCK and Disclaimer moves from the header into About.

Issue #37 remains otherwise release-ready and previously passed Dev validation. #32 and #34 remain paused and untouched. Issue #42 is a later repository-wide Developer Mode/module/subtool version-display cleanup task.

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
