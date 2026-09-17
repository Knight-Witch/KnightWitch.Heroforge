# Changelog

This is the rolling current Dev changelog for `WITCH_DEV_MAIN`. Older Stable/legacy-Dev detail remains durable in Git history and issues.

## DOCK-2026-09-17-004 — Add issue #10 privileged-host seam candidate

Date: 2026-09-17

### Summary

Implemented Stage B on short-lived branch `wd/10-modular-bootstrap` without changing the Stable-derived monolithic application core.

- Bumped architecture-branch Dev launcher to v1.3.0 / build `1.3.0-dev-privileged-host-seam`.
- Added a launcher-local bounded privileged host contract for repository text requests, namespaced userscript storage, downloads, clipboard writes, style insertion, and script metadata.
- The actual privileged host object is not exposed page-globally; only frozen `KWWitchDockHostInfo` diagnostic metadata is exposed for validation.
- Storage access is restricted to `kw.*`; repository text requests are restricted to this repository's raw GitHub prefix.
- The task branch self-routes launcher/core/manifest/module URLs to `wd/10-modular-bootstrap` so live validation exercises the actual architecture branch.
- Recorded issue #10 as an intentional task-branch divergence. Canonical issue #19 routing requirements remain protected for `WITCH_DEV_MAIN` and must be restored before integration.
- `Witch_Dock.user.js` remains unchanged in Stage B.
- Public `Witch_Scripts` remains untouched.

**Runtime/module/manifest/public behavior changed:** task-branch Dev launcher/manifest behavior changed; monolithic core and public Stable unchanged.

---

## DOCK-2026-09-17-003 — Freeze issue #10 monolith contract before extraction

Date: 2026-09-17

### Summary

Started issue #10 on short-lived architecture branch `wd/10-modular-bootstrap` with a source-grounded contract inventory before runtime extraction.

- Added `ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md`.
- Recorded the current monolith responsibilities: privileged userscript APIs, bootstrap/delivery, Dock shell/application state, CSS/presentation, tool/section registry, undo/redo/hotkeys, About/Disclaimer, compact asset, and embedded bone HUD/detection.
- Froze current storage keys, public/global seams, loader/cache behavior, interaction behavior, and extraction gates as protected architecture-refactor contracts.
- Defined staged migration order: privileged host seam -> low-risk presentation/feature extraction -> application-shell extraction -> final small bootstrap.
- Public `Witch_Scripts`, canonical `WITCH_DEV_MAIN`, manifest versions, and runtime source are unchanged by this commit.

**Runtime/module/manifest/public behavior changed:** no. Documentation/architecture baseline only.

---

## DOCK-2026-09-17-002 — Make canonical Dev identity/routing explicit

Date: 2026-09-17

### Summary

Established issue #19 as the canonical Dev-channel identity layer without modifying public Stable.

- Added `Witch_Dock_DEV.user.js` v1.2.2 / build `1.2.2-dev-channel-bootstrap` as the installed Dev entrypoint.
- Tampermonkey name and intended visible Dock title are the same identity: `WITCH DOCK - DEV v1.2.2`.
- Dev update/download URLs point to `WITCH_DEV_MAIN`.
- The narrow launcher fetches the Stable-derived shared `Witch_Dock.user.js` core from `WITCH_DEV_MAIN`, replaces only its manifest-channel declaration, and fails visibly if that expected seam is not found.
- Dev `manifest.json` registers the Dev launcher and routes runtime modules to `WITCH_DEV_MAIN`.
- Added binding project/workflow/versioning rules requiring Dev identity synchronization and automatic post-Stable-smoke janitorial reconciliation without a second user approval.
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

**Runtime/module/manifest/public behavior changed:** no. Documentation/governance only.
