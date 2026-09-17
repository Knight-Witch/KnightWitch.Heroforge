# Witch Dock Development Workflow

## The simple model

- **Stable (`Witch_Scripts`)** is the public product.
- **Dev (`WITCH_DEV_MAIN`)** is the integration sandbox.
- **Issues** explain every intentional difference.
- **Short-lived task branches** isolate risky or parallel experiments.
- **Git history** is the archive; old branches are not filing cabinets.

## 1. Starting work

Every non-trivial runtime change starts with an issue/task describing the problem, intended scope, and acceptance gate.

Before editing, compare the affected Dev file/module to Stable and determine whether Dev already has an intentional divergence. If it does not, Stable is the baseline.

For a small isolated change with no competing work, `WITCH_DEV_MAIN` may be used directly. For risky architecture work, parallel work, or experiments, branch from `WITCH_DEV_MAIN` using an issue-scoped name such as `wd/10-modular-bootstrap`.

Do not create permanent `candidate`, `helper`, `stage`, `final2`, or similar branches as storage. If tooling temporarily requires one, record its purpose and delete it after the result is safely reachable from a canonical branch.

## 2. Keeping Dev accurate

`WITCH_DEV_MAIN` should equal:

**current Stable + intentional open work**

Nothing else.

`DEV_DIVERGENCES.json` records current runtime/module differences that are expected. Each entry must include an issue, affected paths, and reason.

If a runtime file differs from Stable but is not represented by an open divergence, investigate it. Do not normalize blindly when the cause is unclear, but do not let unexplained drift become normal.

When Stable receives an independent hotfix/change, mirror that new Stable state into Dev unless Dev has a tracked conflicting change for the same scope.

## 3. Validation

Use the narrowest meaningful gates:

- syntax/static checks;
- manifest/version consistency;
- HF-Chat-Bridge runtime inspection/probes;
- targeted regression checks;
- Amanda's visual confirmation when appearance/interaction is part of acceptance.

A parse success is not runtime proof.

## 4. Promotion to public

Promotion is always explicit and narrow. Do not merge all of Dev merely because one feature is ready.

Identify the exact validated files/commits, promote only that scope to `Witch_Scripts`, then run the Stable smoke.

## 5. Post-promotion cleanup — required

After Stable passes:

1. reconcile the shipped scope in Dev to the final Stable state;
2. remove the resolved entry from `DEV_DIVERGENCES.json`;
3. remove temporary diagnostics/probes/flags/shims unless intentionally retained;
4. update or close the source issue;
5. delete short-lived task/promotion branches no longer needed;
6. trim `ACTIVE_CONTEXT.md` to current work;
7. compare untouched runtime/module paths for accidental drift.

The rollout is not complete until this cleanup is done.

## 6. Legacy branch retirement

Legacy Dev/candidate/helper branches are audited under #12/#13 before deletion. Useful unique work is referenced by exact commit/path in an issue or migrated narrowly. Promoted, superseded, or abandoned experiments are not carried into New Dev.

Once useful history is reachable/referenced durably, delete obsolete branches. Git commits/issues are the archive.
