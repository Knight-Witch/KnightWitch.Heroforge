# KnightWitch.Heroforge Branch Cleanup Handoff

**Status:** COMPLETE — historical execution record. The listed DELETE refs no longer exist; do not use this file as the current branch inventory. Current branch truth is in `ACTIVE_CONTEXT.md` and the live repository.

**Audit date:** 2026-09-20
**Repository:** `Knight-Witch/KnightWitch.Heroforge`
**Inventory:** 55 branches
**Target end state:** 6 retained branches, 49 deleted branches
**Execution owner:** ChatGPT Work / GitHub UI (standard connector currently lacks delete-ref)

## Keep — do not delete

1. `Witch_Scripts` — public Stable, currently v2.0.0.
2. `WITCH_DEV_MAIN` — canonical Dev/integration branch.
3. `archive/Witch_Scripts-pre-modular-20260920` — explicit pre-modular Stable rollback at `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`.
4. `wd/28-public-payload-2.0.0` — keeps immutable public payload commit `aa54a3cdb6785c5bf78a7b04b5ddccf09cc37b2a` durably reachable; current Stable runtime pins this SHA.
5. `wd/payload-1.5.1` — keeps immutable canonical Dev payload commit `6603911658b426c6b95367697bedcc4c7acf67eb` durably reachable; current Dev launcher pins this SHA.
6. `wd/dev-auto-host` — operational Dev infrastructure. Installed `WITCH DOCK - DEV AUTO HOST` v0.1.1 has its own update/download URLs on this branch and targets `WITCH_DEV_MAIN`.

The two payload branches could later be replaced by durable tags, and the Auto Host could later be moved onto canonical Dev, but do not fold those migrations into this cleanup. They are currently real dependencies, not clutter.

## Pre-delete prerequisites

### 1. Update ChatGPT project instructions before deleting `WITCH_DEV_UI`

The repository itself has already moved to `WITCH_DEV_MAIN`, but the external ChatGPT project instructions still say to read `PROJECT_CONTRACT.md` / `ACTIVE_CONTEXT.md` on `WITCH_DEV_UI`.

Before deleting `WITCH_DEV_UI`, change that project instruction to use `WITCH_DEV_MAIN`. No runtime code depends on `WITCH_DEV_UI`; this is only a stale ChatGPT-project bootstrap pointer.

### 2. Open issue #26 bone evidence — harvested

Legacy `GPT_DEV` contained two useful bone-selection references relevant to open issue #26. Exact copies are now preserved on canonical Dev under:

- `HISTORY/REFERENCES/OPEN_ISSUE_26_BONE_DETECTION/REFERENCE_DEV_Bone_Detection_Tool.user.js`
- `HISTORY/REFERENCES/OPEN_ISSUE_26_BONE_DETECTION/REFERENCE_DEV_Bone_Probe.user.js`

Source was `GPT_DEV` @ `291e477f1953a133ef8701128da8c42ba7d4b781`. Once this audit commit exists, `GPT_DEV` has no reason to survive.

## Open-task cross-check

- **#7 connection-error diagnosis:** no branch-specific implementation to preserve; current issue evidence is authoritative.
- **#20 Booth JSON import/export:** current issue explicitly requires fresh testing on canonical Dev; old Booth/candidate branches are superseded and not authoritative.
- **#21 Kickstarter splash:** no legacy branch implementation found/needed.
- **#22 decal slot reordering:** current corrected-gizmo implementation/history is already on canonical Dev. Old WITCH_DEV/gizmo candidates are superseded.
- **#23 additional Photo Booth lights:** current canonical Dev already contains the later consolidated research in `HISTORY/BULLSHIT/LIGHTING_AND_EXTRA_LIGHTS.md` and `HISTORY/BULLSHIT/LIGHTING_SHADOW_REFRESH_DIAGNOSTICS.md`. The old `docs/lighting-*` branches are superseded checkpoints.
- **#24/#25 High Res texture work:** current Texture Quality modules, current history, submitted-fixture issues, and accepted regression records are on canonical Dev/issues. `tq-v033-stage-20260914` is an obsolete earlier stage.
- **#26 Bone HUD:** legacy useful probe/reference code has been harvested above.
- **Spin/WebP future quality controls:** current Spinny implementation and backlog are canonical; old spinny materialize/helper/candidate branches are superseded.
- **Extra Characters revamp:** no dedicated live branch in this inventory needs retention.

## Delete after prerequisites

- `BASELINE`
- `BETA`
- `DEV_TEST`
- `GPT_DEV`
- `WITCH_DEV_BLACK_STARTUP_CANDIDATE_20260907`
- `WITCH_DEV_BOOTH_ENV_OWNERSHIP_CANDIDATE_20260907`
- `WITCH_DEV_BOOTH_LIFECYCLE_CANDIDATE_20260907`
- `WITCH_DEV_BOOTH_MATTE_CANDIDATE_20260907`
- `WITCH_DEV_BOOTH_PRESENTATION_CANDIDATE_20260907`
- `WITCH_DEV_CACHE_CANDIDATE_20260907`
- `WITCH_DEV_CACHE_CLEAN_20260907`
- `WITCH_DEV_CACHE_FINAL_20260907`
- `WITCH_DEV_GIZMO_FRESH_CANDIDATE_20260908`
- `WITCH_DEV_GIZMO_HELPER_20260908`
- `WITCH_DEV_GIZMO`
- `WITCH_DEV_PHOTO`
- `WITCH_DEV_UI`
- `WITCH_DEV`
- `WITCH_STABLE_BOOTH_CACHE_CANDIDATE_20260907`
- `WITCH_STABLE_GIZMO_CANDIDATE_20260908`
- `WITCH_STABLE_GIZMO_HELPER_20260908`
- `WITCH_STABLE_GIZMO_STAGE_20260908`
- `docs/heroforge-debug-slot-reference-2026-07-22`
- `docs/lighting-checkpoint-2026-07-12`
- `docs/lighting-checkpoint-2026-07-13`
- `docs/lighting-shadow-refresh-2026-07-14`
- `docs/lighting-v0.6-results-2026-07-14`
- `docs/shadow-pipeline-v0-2-v0-3-checkpoint`
- `main`
- `spinny-dev-download-ux-fix`
- `spinny-stable-candidate`
- `spinny-stable-promotion-helper`
- `spinny-wd-dev-materialize`
- `tmp-booth-v27-public-promotion`
- `tmp-booth-v27-public-promotion-2`
- `tq-v033-stage-20260914`
- `wd/payload-1.5.0`
- `wd/10-modular-bootstrap`
- `wd/28-public-rc`
- `wd/28-public-rc-host`
- `witch-booth-features-helper`
- `witch-booth-startup-v26-helper`
- `witch-decals-utilities-helper`
- `witch-devmode-public-helper`
- `witch-highres-ownership-helper`
- `witch-public-decals-utilities-promotion-helper`
- `witch-tab-cleanup-helper`
- `witch-v120-promotion-helper`
- `witch-v120-stable-candidate`

## Why the large delete set is safe

Branches that are behind canonical Dev with zero unique commits are direct deletion candidates. Candidate/helper/stage branches with unique commits contain superseded implementations, temporary patch scripts/workflows, or historical promotion scaffolding. Their accepted results now exist in current Stable/Dev, current issues, or canonical history files.

`WITCH_DEV_UI` and `WITCH_DEV` are explicitly legacy/reference-only under the current project contract. Their still-relevant work has either been promoted, superseded, captured by current backlog/issues, or (for #26) harvested above.

The repository's own workflow says Git history/issues are the archive and old branches are not filing cabinets.

## Work execution checklist

1. Confirm the external ChatGPT project instructions now bootstrap from `WITCH_DEV_MAIN`, not `WITCH_DEV_UI`.
2. Re-read this file only; do not redo the forensic audit.
3. Verify the six KEEP branches exist.
4. Delete exactly the 49 branches listed under **Delete after prerequisites**. Do not delete anything not on that list.
5. Re-list branches and confirm exactly the six KEEP branches remain.
6. Add a short result comment to issue #13 and close it if the branch count is correct.
7. Issue #12 may be closed as completed once this audit/harvest commit is present; no second legacy harvest is required unless a deletion-time discrepancy appears.

Do not mutate runtime code, Stable, canonical Dev behavior, payload contents, or rollback contents during branch deletion.
