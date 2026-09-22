# Release Branch Deletion Handoff — Issue #20 / Public v2.0.1

**Status:** COMPLETE / SUPERSEDED BY CANONICAL ISSUE-CLOSEOUT HANDOFF  
**Repository:** `Knight-Witch/KnightWitch.Heroforge`  
**Prepared:** 2026-09-21  
**Release:** public Witch Dock v2.0.1 / Booth JSON repair  
**Source issue:** #20 — CLOSED / released  
**Janitorial tracking:** #14


The deletion was completed and verified through the canonical handoff `docs/BRANCH_DELETION_HANDOFF_ISSUE_20_2026-09-21.md`. This earlier release-specific handoff is retained only as historical context and must not be executed again.

## Purpose

Remove the temporary branches created for issue #20 development, immutable-payload staging, and public release validation now that all useful history is reachable from canonical branches.

The audit, ancestry checks, release validation, and KEEP/DELETE classification are already complete. Work must **not** redo the audit or reinterpret this list unless the live repository state directly contradicts this handoff.

## Preconditions — satisfied

- Public Stable v2.0.1 is live on `Witch_Scripts`.
- Public Stable smoke passed: Loader 23/23, 0 failures.
- Amanda confirmed real public Booth JSON export/import.
- Issue #20 is closed.
- Canonical Dev reconciliation is complete.
- Shared active/runtime parity check: 39 JS/CSS blobs compared, 0 differences.
- Issue #20 was removed from `DEV_DIVERGENCES.json`.
- Each DELETE ref is already safely reachable from canonical Dev or Stable history.

## DELETE exactly these four branches

1. `wd/payload-1.5.2` @ `791320c49d1038ce0d8d7c311ab2dea8abd7d983`
2. `wd/20-booth-json-repair` @ `dc6749ff2fe2be406958847756cdbb06f0de3e72`
3. `wd/20-public-payload-2.0.1` @ `f773cd9607d12a4479e31951973f288fa282543a`
4. `wd/20-public-rc` @ `fc2ef43d2e1360e6afa99f0518cfef3e9eb196d9`

Do not delete, rename, merge, rebase, retarget, or modify anything else.

## KEEP exactly these six branches

1. `WITCH_DEV_MAIN`
2. `Witch_Scripts`
3. `archive/Witch_Scripts-pre-modular-20260920`
4. `wd/dev-auto-host`
5. `wd/payload-1.5.1`
6. `wd/28-public-payload-2.0.0`

The KEEP SHAs may advance for `WITCH_DEV_MAIN` or `Witch_Scripts` due to documentation-only closeout commits. Branch **names and roles** are authoritative; do not attempt to reset them to older SHAs from this handoff.

## Execution rules

- Delete only the four named DELETE branch refs.
- Prefer normal GitHub branch deletion or `git push origin --delete <branch>`.
- If an attempted deletion has uncertain execution state, read the live branch inventory before retrying. Never blindly replay an uncertain delete.
- Do not modify code, issues, PRs, tags, releases, manifests, or canonical branches as part of this handoff.
- Do not delete immutable commits; only remove the named branch refs.
- Do not create replacement/archive branches for the deleted refs.

## Required verification

After deletion, fetch the live branch inventory and verify that **exactly these six branches remain**:

- `WITCH_DEV_MAIN`
- `Witch_Scripts`
- `archive/Witch_Scripts-pre-modular-20260920`
- `wd/dev-auto-host`
- `wd/payload-1.5.1`
- `wd/28-public-payload-2.0.0`

If and only if that exact inventory matches:

1. add a concise completion comment to issue #14 stating the four refs were deleted and the six-branch inventory was verified;
2. do not reopen #20;
3. no additional repo mutation is required.

If the live inventory does not match, stop and report the mismatch without deleting any unlisted branch.

## Paste-ready Work instruction

Clean up the completed issue #20 release branches in `Knight-Witch/KnightWitch.Heroforge`.

The audit, ancestry checks, release validation, and branch classification are complete. Do not redo the audit or reinterpret the lists unless the live repository state directly contradicts the handoff.

Read and execute:

`WITCH_DEV_MAIN/docs/RELEASE_BRANCH_DELETION_HANDOFF_ISSUE_20_2026-09-21.md`

Delete exactly the four branches listed under **DELETE exactly these four branches** and preserve exactly the six branches listed under **KEEP exactly these six branches**. Do not merge, rebase, retarget, rename, archive, or modify any KEEP branch.

After deletion, verify the live repository contains exactly the six KEEP branches. If it matches, record the result on issue #14. If it does not match, stop and report the discrepancy without deleting any unlisted branch.
