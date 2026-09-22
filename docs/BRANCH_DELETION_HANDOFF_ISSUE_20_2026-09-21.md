# Branch Deletion Handoff — Issue #20

**Status:** READY FOR EXECUTION  
**Created:** 2026-09-21  
**Repository:** `Knight-Witch/KnightWitch.Heroforge`  
**Source issue:** #20 — Booth JSON import/export repair  
**Janitorial policy:** #14  
**Purpose:** mechanical deletion of short-lived issue #20 refs after validated public release

## Scope

The issue #20 runtime work is complete and public Stable v2.0.1 is validated. Runtime/code/docs reconciliation is already complete. This handoff authorizes **branch-ref deletion only plus the narrow documentation closeout listed below**.

Do not redo the issue #20 diagnosis, release audit, promotion review, or branch classification unless the live repository state directly contradicts this handoff.

## DELETE exactly these four refs

1. `wd/payload-1.5.2`  
   Expected head: `791320c49d1038ce0d8d7c311ab2dea8abd7d983`

2. `wd/20-booth-json-repair`  
   Expected head: `dc6749ff2fe2be406958847756cdbb06f0de3e72`

3. `wd/20-public-payload-2.0.1`  
   Expected head: `f773cd9607d12a4479e31951973f288fa282543a`

4. `wd/20-public-rc`  
   Expected head: `fc2ef43d2e1360e6afa99f0518cfef3e9eb196d9`

Delete no other branch or tag.

## KEEP / protected refs

After deletion, exactly these six branches should remain:

1. `WITCH_DEV_MAIN`
2. `Witch_Scripts`
3. `archive/Witch_Scripts-pre-modular-20260920`
4. `wd/dev-auto-host`
5. `wd/payload-1.5.1`
6. `wd/28-public-payload-2.0.0`

Do not merge, rebase, force-move, retarget, rename, or otherwise modify any KEEP ref.

## Reachability evidence already proven

The deletion audit is complete. At handoff creation:

- `wd/payload-1.5.2` is fully reachable from canonical `WITCH_DEV_MAIN`; compare showed 0 commits unique to the delete ref.
- `wd/20-booth-json-repair` is fully reachable from canonical `WITCH_DEV_MAIN`; compare showed 0 commits unique to the delete ref.
- `wd/20-public-payload-2.0.1` is fully reachable from public `Witch_Scripts`; compare showed 0 commits unique to the delete ref.
- `wd/20-public-rc` is fully reachable from public `Witch_Scripts`; compare showed 0 commits unique to the delete ref.

The branch refs are therefore redundant pointers, not unique history.

## Execution procedure

1. Read the live branch inventory.
2. Confirm all four DELETE refs still exist at the expected heads above, or that any difference is a simple fast-forward descendant already reachable from the same canonical branch.
3. Confirm all six KEEP refs exist.
4. Delete exactly the four DELETE refs.
5. Read the live branch inventory again.
6. Require the final inventory to be exactly the six KEEP branches above.
7. Comment the verified result on issue #14. **Do not close #14**; it is the standing promotion/janitorial policy issue.
8. On `WITCH_DEV_MAIN`, mark this handoff `COMPLETE`, remove the issue #20 branch-deletion note from `ACTIVE_CONTEXT.md`, and add concise documentation-only entries to `CHANGELOG.md` and `PRE_FLIGHT_Check.md`.
9. Do not change runtime code, manifests, Stable payloads, Dev launcher identity, issue #24 runtime state, or HeroForge.Compatibility.

If any DELETE ref no longer matches the expected safe shape or any KEEP ref is missing, stop before deleting and report the contradiction. Do not reinterpret the delete set autonomously.

## Expected final inventory

```text
WITCH_DEV_MAIN
Witch_Scripts
archive/Witch_Scripts-pre-modular-20260920
wd/dev-auto-host
wd/payload-1.5.1
wd/28-public-payload-2.0.0
```

## Work prompt

Clean up the completed issue #20 branches in `Knight-Witch/KnightWitch.Heroforge`.

The deletion audit is complete. Do not redo the audit or reinterpret the KEEP/DELETE lists unless the live repository state directly contradicts the handoff.

Read and execute:

`WITCH_DEV_MAIN/docs/BRANCH_DELETION_HANDOFF_ISSUE_20_2026-09-21.md`

Delete exactly the four listed DELETE branches and preserve exactly the six KEEP branches. Do not merge, rebase, retarget, rename, force-move, or modify any KEEP branch.

After deletion, verify the final branch inventory is exactly the six KEEP branches, comment the result on issue #14 without closing #14, and complete the narrow documentation closeout specified in the handoff. Do not touch runtime code, Stable payloads, issue #24 implementation, or HeroForge.Compatibility.
