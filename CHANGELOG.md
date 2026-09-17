# Changelog

This is the rolling current Dev changelog for `WITCH_DEV_MAIN`. Older Stable/legacy-Dev detail remains durable in Git history and issues.

## DOCK-2026-09-17-001 — Establish clean Stable-derived Dev baseline

Date: 2026-09-17

### Summary

Created the governance baseline for the new canonical Dev lane after branching `WITCH_DEV_MAIN` directly from public Stable commit `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`.

- Added a New Dev project contract and compact active-context router.
- Added `DEV_WORKFLOW.md` defining Stable parity, issue-scoped divergence, short-lived task branches, validation, narrow promotion, and mandatory post-promotion cleanup.
- Added `DEV_DIVERGENCES.json` with zero runtime divergences at baseline.
- Legacy `WITCH_DEV_UI` / `WITCH_DEV` remain reference-only pending migration audit #12; no legacy runtime code was merged.
- Tracking: #11 Dev baseline, #12 legacy harvest, #13 branch retirement, #14 promotion janitorial gate.

**Runtime/module/manifest/public behavior changed:** no. Documentation/governance only.

---

## Stable baseline inherited at branch creation

Public Stable commit `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4` contains the validated parallel module-loading promotion. Detailed Stable evidence remains in Git history.
