# Witch Dock Development Workflow

## Roles

- **Stable (`Witch_Scripts`)** is the public product.
- **Dev (`WITCH_DEV_MAIN`)** is the integration sandbox.
- **Issues** explain every intentional difference.
- **Short-lived task branches** isolate risky or parallel experiments.
- **Git history** is the archive; old branches are not filing cabinets.
- **`BRANCH_REGISTRY.md`** is the live source of truth for permanent/protected branch intent.
- **`BRANCH_DELETION_QUEUE.md`** is the live source of truth for refs already approved for mechanical deletion.

Detailed channel identity and immutable delivery are owned by [Runtime Delivery](docs/policies/RUNTIME_DELIVERY.md); numeric/build synchronization is owned by [MODULE_VERSIONING.md](MODULE_VERSIONING.md).

## 1. Starting work

Read the two-file bootstrap in [PROJECT_CONTRACT.md](PROJECT_CONTRACT.md), then only task-specific sources. Diagnose from source/runtime evidence before editing; use the [Investigation guide](docs/investigations/README.md) for non-trivial debugging. Preserve named/capability seams and native ownership where possible.

Every non-trivial runtime change starts with an issue/task describing the problem, intended scope, and acceptance gate.

Before editing, compare the affected Dev file/module to Stable and determine whether Dev already has an intentional divergence. If it does not, Stable is the baseline.

For a small isolated change with no competing work, `WITCH_DEV_MAIN` may be used directly. For risky architecture work, parallel work, or experiments, branch from `WITCH_DEV_MAIN` using an issue-scoped name such as `wd/10-modular-bootstrap`.

Every additional branch must be registered before material work, including helper/payload/RC/release/docs refs. [BRANCH_REGISTRY.md](BRANCH_REGISTRY.md) owns creation and permanent/archive transitions; follow it rather than creating branches as storage.

## 2. Keeping Dev accurate

`WITCH_DEV_MAIN` should equal:

**current Stable + intentional open work**

Nothing else.

`DEV_DIVERGENCES.json` records current runtime/module differences that are expected. Each entry must include an open issue/task owner, affected paths, and reason. Implementation completion does not close a standing divergence owner (#19/#35). `stableBaseline` is a historical reconciliation anchor, not the moving Stable head: compare current live Stable for new work. Retain its exact SHA until a scoped reconciliation intentionally advances it with evidence; annotate dated acceptance snapshots rather than treating them as current runtime identity.

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

A parse success is not runtime proof. For startup/delivery changes use the exact [delivery checks](docs/policies/RUNTIME_DELIVERY.md#release-and-delivery-checks). The visible header may separate the brand from Dev/version metadata; do not require one obsolete literal layout string. Documentation-only changes with unchanged runtime need reference/scope checks, not a forced HeroForge reload or version bump.

## 5. Promotion to public

Promotion is always explicit and narrow. Do not merge all of Dev merely because one feature is ready.

Identify the exact validated files/commits, promote only that scope to `Witch_Scripts`, then run the Stable smoke.

## 6. Post-promotion cleanup — automatic and required

A passing Stable smoke automatically enters this phase. The original promotion approval already authorizes this janitorial closeout; do not pause to ask Amanda for separate cleanup permission.

After Stable passes:

1. reconcile the shipped scope in Dev to the final Stable state;
2. remove the resolved entry from `DEV_DIVERGENCES.json`;
3. remove temporary diagnostics/probes/flags/shims, migration adapters, and test assets unless intentionally retained and documented;
4. update or close the source issue;
5. transition every short-lived task/promotion branch that is no longer needed from ACTIVE PROTECTED to `BRANCH_DELETION_QUEUE.md` with its exact current SHA;
   - delete directly only when the tool surface supports safe exact-ref deletion;
   - otherwise leave the READY queue entry for Work/GitHub UI;
   - per-issue deletion handoffs may be generated for complex releases, but must mirror the canonical registry/queue rather than replace them;
6. trim `ACTIVE_CONTEXT.md` to current work;
7. compare untouched runtime/module paths for accidental drift;
8. confirm the canonical Dev launcher/manifest still identify and route Dev correctly.

Do not call the rollout complete before those steps are done. This cleanup authorization does not permit unrelated Stable edits or scope expansion.


## 7. Every workstream closeout

Inventory refs retained/created for the completed scope, prove preservation, then follow [registry closeout](BRANCH_REGISTRY.md#active-protected-closeout-rule) and the [exact-SHA queue](BRANCH_DELETION_QUEUE.md). Delete only matching READY refs, verify absence/protected inventory, clear completed rows, and record bounded closeout. Tool limitations do not excuse leaving a completed branch unqueued. Complex handoffs use the [canonical template](docs/templates/RELEASE_BRANCH_DELETION_HANDOFF_TEMPLATE.md), not independent classifications. Existing legacy cleanup handoffs are historical, not executable.

Update current routing, durable evidence, and concise changelog/preflight for every committed change. Use [context/retention policy](docs/policies/DOCUMENTATION_AND_CONTEXT.md) for handoffs and log compaction.

## Cross-repository ownership

- Witch Dock owns its runtime/module implementation, UI, evidence providers, and optional client integration. Source/manifest owns runtime truth; HF.Status taxonomy does not replace it.
- HF-Chat-Bridge is development infrastructure only. Its GitHub mailbox transport and at-most-once behavior are routed by the [investigation guide](docs/investigations/README.md); no runtime dependency.
- `Knight-Witch/HeroForge.Compatibility` owns upstream engine investigation/reconstruction. Consult only for a specific unresolved seam or validated compatibility implementation; never preload it for ordinary Dock work. Do not couple Stable to an unstable upstream head.
- Foundation ownership must remain separate; moving tools into/out of Foundation requires explicit ownership and registry-impact handling, not an implicit migration during refactoring.
- HF.Status owns `data/feature-registry.json`, reporter taxonomy, shared intake/draft/evidence schemas, storage, validation, triage, report IDs, and reviewed public projections. Preserve stable feature IDs when implementation moves; the feature-registry impact gate above is mandatory. If access is unavailable, record the blocking/follow-up link, not a silently stale promotion.
- #59 owns Generic Bug Capture implementation; #88 owns provider design contracts. Keep these optional, locally usable, opt-in, and failure-isolated. No private/session/account data in default capture; raw character JSON requires separate explicit staging.
- #90 owns public-status UI/client, with cached reviewed data and bounded anonymous ETag refresh; no reporter tokens/private state and no temporary Dev hostname in Stable. #89 is separate post-submission reporter sync.
- #97 owns integrated reporter UI/client and evidence binding, consuming the HF.Status contracts linked from that issue. HF.Status owns backend semantics; no duplicate taxonomy. Submission retries preserve idempotency, uploads obey live capabilities, and failures cannot block Dock core. Keep #59 independently usable and follow the issue's real end-to-end/human gates.

For accepted feature-specific constraints (lighting versus Persistent Booth, native capture output, tolerant Decals layouts, canonical standalone references), use [accepted decisions](HISTORY/DECISIONS.md) and the relevant [technical topic](HISTORY/Bullshit_Bible.md); do not erase these because they predate the current documentation structure.
