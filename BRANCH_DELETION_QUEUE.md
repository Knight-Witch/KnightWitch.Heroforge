# Witch Dock Branch Deletion Queue

**Status:** Binding pending-deletion queue  
**Canonical branch:** `WITCH_DEV_MAIN`  
**Last audited:** 2026-09-29 UTC

This file contains only branch refs that have already been classified as no longer needed and are ready for mechanical deletion.

A chat that cannot delete branches must still update this queue. “Safe to delete” stated only in chat is not a durable handoff.

## READY FOR DELETE SWEEP

| Branch | Expected head SHA | Reason | Source | Status |
|---|---|---|---|---|
| `wd/97-integrated-bug-reporter` | `860df72a87b5ed7eb6d30223649436a325607253` | #97 implementation is preserved in canonical Dev and shipped in Stable v2.4.0. | #97 | READY |

## Queue rules

- GitHub's native `protected` flag/ruleset state is not deletion authority. A branch reporting `protected: false` is still undeletable under project policy unless it appears here as an exact-SHA READY entry.
- Queue entries are exact-SHA deletion authorizations for mechanical cleanup, not suggestions to reclassify.
- Before deletion, confirm the live branch still exists at the expected SHA.
- If the SHA differs, **do not delete that ref**. Leave it queued, mark/report the mismatch, and re-audit only that branch.
- Never add a branch that is still PERMANENT, ACTIVE PROTECTED, PENDING PERMANENT PROMOTION APPROVAL, or PENDING ARCHIVE.
- Transition from ACTIVE PROTECTED to this queue must update `BRANCH_REGISTRY.md` in the same bounded closeout.
- After successful deletion and live-inventory verification, remove the queue row. Historical proof belongs in issue #14, `CHANGELOG.md`, `PRE_FLIGHT_Check.md`, and Git history rather than an ever-growing completed queue.
- A deletion sweep must not merge, rebase, rename, retarget, archive, or otherwise modify queued refs.
- Unlisted branches are out of scope for a deletion sweep.

## Mechanical sweep contract

A deletion-capable executor should:

1. read `BRANCH_REGISTRY.md` and this queue;
2. fetch live refs;
3. delete each READY entry only when the live SHA equals the recorded SHA;
4. verify every PERMANENT / ACTIVE PROTECTED / PENDING ARCHIVE ref remains;
5. verify no unregistered live branch appeared during the sweep;
6. remove successfully deleted rows from this file;
7. update issue #14 and the compact changelog/preflight record.

This is intentionally cheap: do not redo branch-history archaeology unless a live contradiction appears.
