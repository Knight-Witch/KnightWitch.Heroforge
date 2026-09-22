# Release Branch Deletion Handoff — <issue / release>

**Status:** READY FOR WORK — exact mechanical deletion only  
**Repository:** `Knight-Witch/KnightWitch.Heroforge`  
**Prepared:** <YYYY-MM-DD>  
**Release:** <public version / feature>  
**Source issue:** <issue>  
**Janitorial tracking:** #14

## Purpose

Delete short-lived task, candidate, RC, helper, and staging branches created by a completed public release after useful history is safely reachable from canonical Dev/Stable.

The release owner must complete the audit and ancestry/reachability checks **before** writing this handoff. Work executes the exact list mechanically; it does not reclassify branches unless live state directly contradicts the handoff.

## Preconditions

Record the completed gates, at minimum:

- Stable promotion complete;
- Stable smoke PASS;
- human gate PASS when relevant;
- Dev reconciliation complete;
- resolved divergence removed;
- useful history reachable from canonical branches;
- accidental runtime drift check complete.

## DELETE exactly these branches

- `<branch>` @ `<sha>`

## KEEP exactly these branches

- `WITCH_DEV_MAIN`
- `Witch_Scripts`
- plus every rollback, infrastructure, or immutable payload ref intentionally retained for the current architecture.

Do not rely on an old generic KEEP list. Build the exact KEEP inventory from the live repository at handoff time.

## Execution rules

- Delete only the listed DELETE branch refs.
- Do not merge, rebase, retarget, rename, archive, or modify KEEP branches.
- If deletion execution is uncertain, read live state before retrying; never blindly replay.
- Do not create replacement/archive branches for disposable release refs.
- Do not modify runtime code as part of deletion execution.

## Verification

After deletion:

1. fetch the live branch inventory;
2. verify it equals the exact KEEP list;
3. record completion on issue #14;
4. if inventory differs, stop and report the mismatch without deleting unlisted refs.

## Paste-ready Work instruction

Clean up completed release branches in `Knight-Witch/KnightWitch.Heroforge`.

The audit and branch classification are complete. Do not redo them unless live repository state directly contradicts the handoff.

Read and execute:

`WITCH_DEV_MAIN/<handoff path>`

Delete exactly the listed DELETE branches, preserve exactly the listed KEEP branches, verify the final live inventory, and record the result on issue #14.
