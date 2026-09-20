# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-20
**Canonical Dev:** `WITCH_DEV_MAIN`
**Active task:** issue #13 — branch retirement execution
**Cleanup handoff:** `docs/BRANCH_CLEANUP_HANDOFF_2026-09-20.md`
**Audit commit:** `d00b7b598ecced06df87be2b3643557943d0b0f4`
**Public Stable:** `Witch_Scripts` @ `95b5cdae4c8840d950d984c73bce101ba887011e`
**Canonical Dev launcher:** v1.5.1 / payload `6603911658b426c6b95367697bedcc4c7acf67eb`

## Current state

Issue #28 public promotion is complete and Stable-smoke validated.

The full repository branch audit is complete:
- 55 total branches;
- 6 required keeps;
- 49 classified for deletion after the report prerequisites;
- issue #12 legacy harvest audit closed;
- legacy #26 bone-selection references harvested into canonical Dev;
- open issues #7 and #20-#26 cross-checked for branch dependencies.

## Exact next step

Use ChatGPT Work / GitHub UI to execute `docs/BRANCH_CLEANUP_HANDOFF_2026-09-20.md` exactly.

Do **not** redo the forensic audit.

Before deleting `WITCH_DEV_UI`, Amanda must update the external ChatGPT project instructions so project bootstrap reads `PROJECT_CONTRACT.md` and `ACTIVE_CONTEXT.md` from `WITCH_DEV_MAIN`, not `WITCH_DEV_UI`.

After deletion:
1. confirm exactly the six KEEP branches remain;
2. comment the result on issue #13 and close it;
3. close issue #11 if the final inventory matches the handoff;
4. return `ACTIVE_CONTEXT.md` to no active cleanup task.

## Protected state

Do not delete:
- `Witch_Scripts`;
- `WITCH_DEV_MAIN`;
- `archive/Witch_Scripts-pre-modular-20260920`;
- `wd/28-public-payload-2.0.0`;
- `wd/payload-1.5.1`;
- `wd/dev-auto-host`.

Do not mutate runtime code, Stable, payload contents, rollback contents, or Dev behavior during branch deletion.
