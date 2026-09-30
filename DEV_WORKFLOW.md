# Witch Dock Development Workflow

## The simple model

- **Stable (`Witch_Scripts`)** is the public product.
- **Dev (`WITCH_DEV_MAIN`)** is the integration sandbox.
- **Issues** explain every intentional difference.
- **Short-lived task branches** isolate risky or parallel experiments.
- **Git history** is the archive; old branches are not filing cabinets.
- **`BRANCH_REGISTRY.md`** is the live source of truth for permanent/protected branch intent.
- **`BRANCH_DELETION_QUEUE.md`** is the live source of truth for refs already approved for mechanical deletion.

The canonical installed Dev userscript is `Witch_Dock_DEV.user.js`. It must visibly identify itself as Dev and update from `WITCH_DEV_MAIN`. The completed modular architecture may load a pinned immutable payload commit for manifest/core/module bytes; that payload is the compatibility-safe runtime snapshot for the launcher revision, while fallback routing remains canonical `WITCH_DEV_MAIN`. Tampermonkey script identity stays fixed as `WITCH DOCK - DEV`; the changing version belongs in `@version` and the visible Dock title, not in `@name`, so updates replace the existing Dev install instead of creating duplicates.

## 1. Starting work

Every non-trivial runtime change starts with an issue/task describing the problem, intended scope, and acceptance gate.

Before editing, compare the affected Dev file/module to Stable and determine whether Dev already has an intentional divergence. If it does not, Stable is the baseline.

For a small isolated change with no competing work, `WITCH_DEV_MAIN` may be used directly. For risky architecture work, parallel work, or experiments, branch from `WITCH_DEV_MAIN` using an issue-scoped name such as `wd/10-modular-bootstrap`.

Do not create permanent `candidate`, `helper`, `stage`, `final2`, or similar branches as storage. If tooling temporarily requires one, add it to `BRANCH_REGISTRY.md` ACTIVE PROTECTED immediately after creation and before material work begins. Every additional branch needs its own entry. When the branch is no longer needed, transition it to `BRANCH_DELETION_QUEUE.md`; do not leave the decision only in chat.

## 2. Keeping Dev accurate

`WITCH_DEV_MAIN` should equal:

**current Stable + intentional open work**

Nothing else.

`DEV_DIVERGENCES.json` records current runtime/module differences that are expected. Each entry must include an issue, affected paths, and reason.

If a runtime file differs from Stable but is not represented by an open divergence, investigate it. Do not normalize blindly when the cause is unclear, but do not let unexplained drift become normal.

When Stable receives an independent hotfix/change, mirror that new Stable state into Dev unless Dev has a tracked conflicting change for the same scope.

Dev channel routing itself is an intentional infrastructure divergence: the installed launcher updates from `WITCH_DEV_MAIN`, while each validated launcher revision may pin an immutable payload commit containing its manifest/core/module snapshot. Any fallback URLs in that payload must point to `WITCH_DEV_MAIN`. Unaffected module bytes should still match Stable until an issue changes them.

## 3. Feature-registry impact gate

Before validating a change that affects a user-facing Witch Dock feature, check the canonical HF.Status registry at `Knight-Witch/HF.Status:data/feature-registry.json`.

This gate applies when work:

- creates or removes a user-facing tool/function;
- renames a tool/function or tab/group;
- changes its Witch Dock module/path;
- moves implementation into or out of Compatibility/Foundation;
- changes maintenance/engineering ownership;
- retires, replaces, splits, or merges reporter-facing functionality.

Record in preflight either **registry updated** (with stable feature IDs), **no registry impact** (with reason), or **registry follow-up required** (with the linked HF.Status task). A reporter-facing migration with known stale routing is not release-ready.

Moving code alone does not create a new reporter feature ID.

## 4. Validation

Use the narrowest meaningful gates:

- syntax/static checks;
- manifest/version consistency;
- Dev channel identity/routing checks;
- HF-Chat-Bridge runtime inspection/probes;
- targeted regression checks;
- Amanda's visual confirmation when appearance/interaction is part of acceptance.

A parse success is not runtime proof. For Dev startup specifically, verify the visible title says `WITCH DOCK - DEV v<version>`, the Tampermonkey entry is the fixed `WITCH DOCK - DEV` identity with matching `@version`, channel state reports `WITCH_DEV_MAIN`, `KWWitchDockManifestURL` points to the launcher's pinned immutable payload commit, loader requests resolve through that same immutable payload, fallback count is zero in the normal path, and no route silently resolves to Stable.

## 5. Promotion to public

Promotion is always explicit and narrow. Do not merge all of Dev merely because one feature is ready.

Identify the exact validated files/commits, promote only that scope to `Witch_Scripts`, then run the Stable smoke.

## 6. Post-promotion cleanup — automatic and required

A passing Stable smoke automatically enters this phase. The original promotion approval already authorizes this janitorial closeout; do not pause to ask Amanda for separate cleanup permission.

After Stable passes:

1. reconcile the shipped scope in Dev to the final Stable state;
2. remove the resolved entry from `DEV_DIVERGENCES.json`;
3. remove temporary diagnostics/probes/flags/shims unless intentionally retained;
4. update or close the source issue;
5. transition every short-lived task/promotion branch that is no longer needed from ACTIVE PROTECTED to `BRANCH_DELETION_QUEUE.md` with its exact current SHA;
   - delete directly only when the tool surface supports safe exact-ref deletion;
   - otherwise leave the READY queue entry for Work/GitHub UI;
   - per-issue deletion handoffs may be generated for complex releases, but must mirror the canonical registry/queue rather than replace them;
6. trim `ACTIVE_CONTEXT.md` to current work;
7. compare untouched runtime/module paths for accidental drift;
8. confirm the canonical Dev launcher/manifest still identify and route Dev correctly.

Do not call the rollout complete before those steps are done. This cleanup authorization does not permit unrelated Stable edits or scope expansion.

### Branch deletion handoff standard

At every issue closeout—not only large releases—inventory refs created or retained for that work.

1. read `BRANCH_REGISTRY.md` and the live branch inventory;
2. for each completed non-permanent ref, prove useful work is merged/preserved or explicitly abandoned;
3. remove that ref from ACTIVE PROTECTED and add it to `BRANCH_DELETION_QUEUE.md` with the exact current head SHA;
4. if deletion is available, execute only the exact matching queue entries;
5. if deletion is unavailable, leave the queue entries READY and optionally create a per-issue handoff from the canonical queue for Work;
6. after deletion, verify protected refs, remove completed queue rows, and update issue #14 / compact logs.

Never leave a completed branch merely because Chat cannot delete it.

## Branch lifecycle registry — authoritative

For any branch-affecting task, read `BRANCH_REGISTRY.md` and `BRANCH_DELETION_QUEUE.md` before mutation.

### Creating branches

- Decide the branch's issue/workstream and purpose before creation.
- Immediately after creating it, add it to ACTIVE PROTECTED.
- Do not begin material work until that registry update is durable.
- Additional helper/payload/release/staging branches each require separate entries.
- If creation succeeds but registration fails, stop instead of creating more refs.

### Closing branches

A completed non-permanent branch moves from ACTIVE PROTECTED -> DELETE QUEUE. This transition is part of issue/workstream closeout and must appear in the finishing summary.

### Permanent branch promotion

A proposed permanent branch stays ACTIVE PROTECTED and is also listed in PENDING PERMANENT PROMOTION APPROVAL. Amanda's explicit approval is required to move it into PERMANENT — NEVER DELETE.

When replacing an existing permanent branch, approval must identify the replacement. The old permanent ref moves to PENDING ARCHIVE, is preserved under a verified immutable tag recorded in `BRANCH_ARCHIVE.md`, and only then moves to DELETE QUEUE.

### Standard audit

A routine audit performs a set comparison between live refs and the registry/queue. Deep history/reachability work is required only for unregistered refs, stale active entries, SHA mismatches, or permanent/archive transitions.

This keeps normal audits cheap and prevents branch intent from living only in conversation history.

## 8. Legacy branch retirement

Legacy Dev/candidate/helper branches are audited under #12/#13 before deletion. Useful unique work is referenced by exact commit/path in an issue or migrated narrowly. Promoted, superseded, or abandoned experiments are not carried into New Dev.

Once useful history is reachable/referenced durably, delete obsolete branches. Git commits/issues are the archive.
