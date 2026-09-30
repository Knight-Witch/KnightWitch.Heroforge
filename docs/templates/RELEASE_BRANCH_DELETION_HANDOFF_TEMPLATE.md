# Release Branch Deletion Handoff — <issue / release>

**Status:** READY FOR WORK — exact mechanical deletion only  
**Repository:** `Knight-Witch/KnightWitch.Heroforge`  
**Prepared:** <YYYY-MM-DD>  
**Source issue/workstream:** <issue>  
**Janitorial tracking:** #14

## Authority

This handoff is generated from:

- `BRANCH_REGISTRY.md`
- `BRANCH_DELETION_QUEUE.md`

It must not independently invent a KEEP/DELETE classification. If live state contradicts either canonical file, stop on the contradiction and repair the registry/queue first.

## Preconditions

- useful work for every DELETE ref is merged, durably preserved, or explicitly abandoned;
- every DELETE ref is present in `BRANCH_DELETION_QUEUE.md`;
- every protected live ref is present in `BRANCH_REGISTRY.md`;
- expected DELETE SHAs were read from live GitHub when queued;
- permanent-promotion/archive requirements are resolved before any former permanent ref is queued.

## DELETE exactly these queued branches

- `<branch>` @ `<expected sha>`

## Protected inventory

Copy the current PERMANENT, ACTIVE PROTECTED, and PENDING ARCHIVE refs from `BRANCH_REGISTRY.md`.

Do not delete, rename, rebase, retarget, archive, or repurpose them.

Registry protection is procedural/project policy and remains binding even if GitHub reports `protected: false` or no branch ruleset exists. Native protection is defense-in-depth only; deletion permission comes only from the exact-SHA queue.

## Execution rules

- Delete only listed queue entries whose live SHA exactly matches the recorded SHA.
- If a queued branch head changed, skip that ref and report the mismatch.
- Never delete an unlisted branch merely because it appears stale or GitHub reports `protected: false`.
- If execution is uncertain, read back before retrying; never blindly replay.
- Do not modify runtime code during the deletion sweep.

## Verification

After deletion:

1. fetch the live branch inventory;
2. verify all registry-protected refs remain;
3. verify no unregistered live ref appeared;
4. remove successfully deleted rows from `BRANCH_DELETION_QUEUE.md`;
5. record completion on issue #14 and compact changelog/preflight;
6. report any skipped SHA mismatch.

## Paste-ready Work instruction

Clean up queued branches in `Knight-Witch/KnightWitch.Heroforge`.

Read `PROJECT_CONTRACT.md`, `BRANCH_REGISTRY.md`, and `BRANCH_DELETION_QUEUE.md` on `WITCH_DEV_MAIN`.

The branch classification is already complete. Delete only READY queue entries whose live head SHA exactly matches the queue. Preserve every PERMANENT / ACTIVE PROTECTED / PENDING ARCHIVE ref regardless of GitHub's native `protected` flag or ruleset state. Skip and report any SHA mismatch rather than reclassifying it.

After deletion, verify the live inventory, remove successfully deleted queue rows, and record the result on issue #14. Do not make unrelated runtime changes.
