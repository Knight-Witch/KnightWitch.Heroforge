# Witch Dock Branch Registry

**Status:** Binding branch-lifecycle registry  
**Canonical branch:** `WITCH_DEV_MAIN`  
**Last audited:** 2026-09-29 UTC

This file is the authoritative classification of live Witch Dock branches. Branch intent must not be reconstructed from chat memory, branch names, old handoffs, or issue state when this registry already answers it.

A live branch must be accounted for by exactly one lifecycle disposition:

- **PERMANENT — NEVER DELETE**
- **ACTIVE PROTECTED**
- **PENDING ARCHIVE**
- **DELETE QUEUE** in `BRANCH_DELETION_QUEUE.md`

`PENDING PERMANENT PROMOTION APPROVAL` is an overlay on an ACTIVE PROTECTED branch; it does not replace the branch's protected status before approval.

An unregistered live branch is a governance defect. Do not create additional branches or perform material work on an unregistered branch until the registry is corrected.

## PERMANENT — NEVER DELETE

| Branch | Role / dependency | Change control |
|---|---|---|
| `WITCH_DEV_MAIN` | Canonical Dev integration branch and Dev launcher/update source. | Never delete, rename, or repurpose. |
| `Witch_Scripts` | Public Stable / repository default branch. | Never delete, rename, or repurpose without explicit permanent-promotion approval. |
| `wd/dev-auto-host` | Canonical installed Dev Auto Host distribution branch. The userscript's raw install, `@updateURL`, and `@downloadURL` depend on this exact ref. | Never delete, rename, or repurpose while it is the canonical Auto Host distribution ref. |

Permanent entries may change only through the **Permanent promotion / replacement contract** below.

## ACTIVE PROTECTED

| Branch | Owner / source | Why protected | Exit condition |
|---|---|---|---|
| `wd/59-decals-diagnostic-provider` | #59 | Paused Decals provider checkpoint with unique unmerged work. | When #59 no longer needs the branch, validate preservation, remove this row, and add the exact head to `BRANCH_DELETION_QUEUE.md`. |
| `wd/88-diagnostic-capture-architecture` | #88 | Authoritative diagnostic capture/provider design source still referenced by active work. | When #88/design ownership is fully absorbed or retired, validate preservation, remove this row, and queue the exact head for deletion. |
| `wd/97-integrated-bug-reporter` | #97 | Active integrated HF.Status reporter implementation branch. | On merge/closeout/abandonment, validate preservation, remove this row, and queue the exact head for deletion. |

### Active-protected creation rule

Every newly created non-permanent branch — including task, fix, payload, RC, release, staging, helper, experiment, docs, or temporary branches — must be added here **immediately after creation and before material work begins**.

The entry must name the issue/workstream, purpose, and exit condition. If branch creation succeeds but the registry update fails, stop; do not continue work or create another branch until the new ref is accounted for.

Creating an additional branch from an already-active branch does not inherit protection implicitly. The new branch needs its own row.

### Active-protected closeout rule

When an ACTIVE PROTECTED branch is no longer needed:

1. prove any useful work is merged, otherwise durably preserved or explicitly abandoned;
2. read its exact current head SHA;
3. remove it from ACTIVE PROTECTED;
4. add it to `BRANCH_DELETION_QUEUE.md` with that SHA, reason, source issue/workstream, and READY status;
5. state that transition explicitly in the finishing summary.

If the current chat/tool cannot delete refs, that is not a reason to leave the branch undocumented. The deletion queue is the durable handoff to Work or another deletion-capable executor.

## PENDING PERMANENT PROMOTION APPROVAL

None.

A candidate here must also remain listed under ACTIVE PROTECTED until approval is resolved.

### Permanent promotion / replacement contract

Permanent branch changes require Amanda's explicit approval.

For a **new permanent branch**:

1. create/register it as ACTIVE PROTECTED;
2. add it to this section with proposed permanent role and dependency;
3. validate the permanent role;
4. obtain explicit approval;
5. move it to PERMANENT — NEVER DELETE and remove the pending entry.

For a **replacement of an existing permanent branch**:

1. keep the proposed replacement ACTIVE PROTECTED and list it here;
2. identify the exact permanent branch being replaced;
3. validate migration/update-path consequences. Default branch, raw install/update/download URLs, workflows, rulesets/protection, docs, and any external consumers that name the old ref must be identified and migrated/verified as applicable;
4. obtain explicit approval naming the replacement;
5. promote the new branch to PERMANENT — NEVER DELETE;
6. remove the old branch from PERMANENT and place it under PENDING ARCHIVE;
7. archive and verify the old branch using `BRANCH_ARCHIVE.md`;
8. only after archival verification, remove it from PENDING ARCHIVE and add its exact head to `BRANCH_DELETION_QUEUE.md`.

Never silently swap permanent refs because a new branch “looks canonical.”

## PENDING ARCHIVE

None.

Branches in this section are still protected from deletion. Archive means:

- preserve the old permanent/critical branch's final commit under an immutable Git tag;
- use tag form `branch-archive/<sanitized-branch>/<YYYYMMDD>-<shortsha>`;
- verify the tag resolves to the exact final branch head;
- add the archival record to `BRANCH_ARCHIVE.md`;
- then remove the branch from this section and add the branch ref to the deletion queue.

Do **not** create long-lived `archive/*` branches as storage. Git tags + the archive ledger are the retrieval mechanism.

Archive tags are immutable recovery records: never retarget or delete one without explicit approval for that archival record.

If the active tool cannot create/verify the archive tag, leave the branch here and hand archival off to Work/GitHub tooling. Never delete first and “archive later.”

## Standard branch audit

A normal branch audit is a set reconciliation, not a forensic restart.

1. Read `PROJECT_CONTRACT.md`, this file, and `BRANCH_DELETION_QUEUE.md`.
2. Fetch the live branch inventory.
3. Compare live refs against:
   - PERMANENT — NEVER DELETE;
   - ACTIVE PROTECTED;
   - PENDING ARCHIVE;
   - DELETE QUEUE.
4. If a DELETE QUEUE ref is already absent, verify the ref is genuinely gone, treat the deletion as completed, remove its queue row, and record the closeout instead of re-creating or re-auditing the branch.
5. Report only:
   - unregistered live branches;
   - registered/protected branches missing from live GitHub;
   - ACTIVE PROTECTED branches whose issue/workstream is now complete and therefore need transition to DELETE QUEUE;
   - DELETE QUEUE entries whose live SHA no longer matches;
   - pending permanent promotions or archives requiring action.
6. Do not re-audit branch history for entries whose classification is current and internally consistent.
7. Perform deeper reachability/history inspection only for an unregistered branch, a stale ACTIVE PROTECTED entry, a SHA mismatch, or a proposed permanent/archive transition.

The desired steady state is: **every live branch is accounted for, with zero branch intent held only in chat memory.**

## Summary contract

Any task that creates, reclassifies, queues, promotes, archives, or deletes a branch must say so in its final summary, including the exact branch name and new lifecycle state.

## Historical handoff authority

Branch cleanup/deletion handoffs created before the 2026-09-29 registry baseline are non-executable historical records, regardless of stale READY wording inside them. Only the current registry + deletion queue authorize present branch actions. A future per-issue handoff must be generated from those canonical files to become executable.
