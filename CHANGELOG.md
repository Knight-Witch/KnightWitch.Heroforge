# Changelog

This is the rolling current Dev changelog for `WITCH_DEV_MAIN`. Older Stable/legacy-Dev detail remains durable in Git history and issues.

## DOCK-2026-09-17-002 — Make canonical Dev identity/routing explicit

Date: 2026-09-17

### Summary

Established issue #19 as the canonical Dev-channel identity layer without modifying public Stable.

- Added `Witch_Dock_DEV.user.js` v1.2.2 / build `1.2.2-dev-channel-bootstrap` as the installed Dev entrypoint.
- Tampermonkey name and intended visible Dock title are the same identity: `WITCH DOCK - DEV v1.2.2`.
- Dev update/download URLs point to `WITCH_DEV_MAIN`.
- The narrow launcher fetches the Stable-derived shared `Witch_Dock.user.js` core from `WITCH_DEV_MAIN`, replaces only its manifest-channel declaration, and fails visibly if that expected seam is not found.
- Dev `manifest.json` now registers the Dev launcher and routes the bootstrap plus all 23 manifest-loaded modules to `WITCH_DEV_MAIN`; unaffected module source bytes remain Stable-equivalent until issue-linked work changes them.
- Added binding project/workflow/versioning rules requiring Dev identity synchronization and automatic post-Stable-smoke janitorial reconciliation without a second user approval.
- Recorded the intentional Dev channel divergence in `DEV_DIVERGENCES.json`.
- Public `Witch_Scripts` was not changed.

**Runtime/module/manifest/public behavior changed:** Dev runtime/manifest behavior changed; public Stable unchanged.

---

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
