# Witch Dock Project Contract

**Status:** Binding development contract  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Public Stable:** `Witch_Scripts`

## Bootstrap

Before material Witch Dock architecture/runtime work:

1. Read this file.
2. Read `ACTIVE_CONTEXT.md` on `WITCH_DEV_MAIN`.
3. Read only files routed by `ACTIVE_CONTEXT.md` or directly required by the task.
4. Use GitHub source/runtime evidence before guessing.

For any task that creates, deletes, renames, merges, promotes, archives, or closes work on a branch, also read `BRANCH_REGISTRY.md` and `BRANCH_DELETION_QUEUE.md`. Read `BRANCH_ARCHIVE.md` when permanent-branch replacement or archival is involved.

Do not preload full history, old changelogs/preflight logs, session logs, or legacy branch history. Legacy `WITCH_DEV_UI` and `WITCH_DEV` branch refs were retired after migration audit #12; never route active work to them. If a task genuinely needs legacy evidence, use Git history or the specific harvested reference/history file.

## Task/mode checkpoint

Use `TASK_MODE_ROUTER.md` only at meaningful checkpoints: active task changes, phase changes, unresolved diagnostics after multiple evidence passes, large repetitive multi-fixture work, unresolved engine behavior, final high-risk architecture/release review, or an explicit mode question.

Do not re-evaluate model/mode on ordinary messages or routine implementation steps. Default to Chat / Sol High unless the router identifies a material benefit from Work, Extra High, or Max. Finish any bounded in-progress mutation/test before recommending a switch.


## Branch roles

- `Witch_Scripts` is public Stable. Never use it as an experimental branch.
- `WITCH_DEV_MAIN` is the canonical integration/sandbox branch.
- Stable is the source of truth for any runtime/module with no open Dev reason to differ.
- Every intentional Dev runtime divergence must map to an open issue/task and be recorded in `DEV_DIVERGENCES.json`.
- Large, risky, or parallel work should use a short-lived issue-scoped branch from `WITCH_DEV_MAIN`; merge only after validation, then delete the temporary branch when no longer needed.
- Never bulk-merge legacy Dev history into New Dev. Harvest only specific validated fragments that remain relevant.

## Branch lifecycle registry

`BRANCH_REGISTRY.md` is the authoritative live branch classification. `BRANCH_DELETION_QUEUE.md` is the authoritative pending mechanical deletion queue. `BRANCH_ARCHIVE.md` is the immutable-snapshot ledger for retired permanent/critical branches.

Rules:

- Every live branch must be accounted for as PERMANENT, ACTIVE PROTECTED, PENDING ARCHIVE, or DELETE QUEUE.
- Every newly created branch must be added to ACTIVE PROTECTED immediately after creation and before material work begins. This includes task, fix, payload, RC, release, staging, helper, experiment, docs, and any additional branch created from another task branch.
- A branch does not inherit protection because its parent is protected.
- When non-permanent branch work is completed, merged, abandoned, or otherwise no longer needs a live ref, validate preservation, remove it from ACTIVE PROTECTED, and add its exact live head SHA to the deletion queue in the same bounded closeout. The finishing summary must say this happened.
- Inability to delete refs is not a reason to leave completed branches unqueued.
- Permanent additions or replacements require Amanda's explicit approval. Candidates remain ACTIVE PROTECTED and are also listed under PENDING PERMANENT PROMOTION APPROVAL until approved.
- Replacing a permanent branch moves the old branch to PENDING ARCHIVE after approval. Preserve its exact final head as a verified immutable Git tag and record it in `BRANCH_ARCHIVE.md` before the old branch may enter the deletion queue.
- Do not use long-lived `archive/*` branches as storage.
- A standard audit is a set reconciliation against the registry + deletion queue. Do not re-derive already-current classifications from branch history unless live state contradicts the records.

An unregistered live branch is a governance defect. Stop branch proliferation and correct the registry before continuing material work.

Protection labels in the registry are project-governance classifications and do not depend on GitHub's native `protected` flag or ruleset availability. A branch may report `protected: false` and still be protected by this contract. Native branch protection is defense-in-depth only; deletion authority comes exclusively from `BRANCH_DELETION_QUEUE.md`.

## Dev parity rule

An unaffected module should be byte-for-byte equivalent to Stable whenever practical. If Stable changes independently, reconcile that scope into Dev promptly unless an open issue explicitly requires Dev to stay different.

Unexpected Dev-vs-Stable runtime drift is a defect until explained.

## Canonical Dev runtime identity

- The canonical installed Dev userscript is `Witch_Dock_DEV.user.js`, not the public `Witch_Dock.user.js` entrypoint.
- Tampermonkey identity must remain stable across Dev versions: fixed `@name` `WITCH DOCK - DEV`, stable namespace, and stable channel-specific update/download URL.
- The active version belongs in userscript `@version`, runtime `DEV_VERSION`, the module registry, and the visible Dock header. The branded `WITCH DOCK` title may be visually separated from smaller `DEV` / `v<version>` metadata, whether inline or on a secondary row, but the Dev channel and version must remain unmistakable.
- Do not put the changing version into Tampermonkey `@name`; doing so can create duplicate Dev installs instead of updating the existing script.
- Tampermonkey and the visible Dock must clearly identify the same Dev channel, but the Tampermonkey name is intentionally unversioned while the Dock header exposes the active Dev/version metadata.
- Dev `@updateURL` and `@downloadURL` resolve to `WITCH_DEV_MAIN` so the installed Dev launcher updates from the canonical channel.
- The completed modular architecture may pin its manifest/core/runtime modules to an immutable payload commit SHA. That payload must be derived from canonical Dev, and any fallback URLs must resolve to `WITCH_DEV_MAIN`, never Stable or a retired task branch.
- A Dev bootstrap/channel-seam failure must fail visibly rather than silently running Stable while appearing to be Dev.
- Keep the Dev launcher narrow: privileged channel/bootstrap host only. Application/core behavior belongs in GitHub-owned modules; issue #10's migration is complete.

## Development flow

Normal flow:

issue/task -> diagnosis -> Dev implementation -> static checks -> live Dev validation -> human visual gate when relevant -> explicit narrow Stable promotion -> Stable smoke -> automatic Dev reconciliation/janitorial closeout.

Preserve known-working timing, polling, retries, readiness checks, ownership boundaries, snapshots, rollback behavior, cache-key behavior, module order, enablement behavior, and failure isolation unless testing proves a change safe.

HF-Chat-Bridge is development infrastructure only and must never become a Witch Dock runtime dependency.

## Tampermonkey boundary

The long-term userscript architecture should keep only the privileged userscript host/bootstrap in Tampermonkey. Application/core behavior should live in normal GitHub-owned modules where practical.

Expose bounded privileged operations rather than raw Tampermonkey capabilities into page context. Preserve current behavior while migrating incrementally.

## HF.Status feature registry

HF.Status `data/feature-registry.json` is the canonical cross-repository bug-report taxonomy and routing registry. Witch Dock source/manifest remains authoritative for Witch Dock runtime implementation; the HF.Status registry maps stable reporter feature IDs to the current Witch Dock tab/module/repository/ownership context.

Any task that adds, removes, renames, moves, splits, merges, retires, or changes ownership of a user-facing Witch Dock tool/function must perform a registry-impact check before merge. If implementation moves but the user-facing function remains the same, preserve the stable reporter feature ID and update the mapping rather than inventing a new identity.

When HF.Status registry access is temporarily unavailable, record a blocking/follow-up link rather than silently promoting known-stale routing.

## Versioning and manifests

`manifest.json.moduleRegistry` is canonical for active module versions. Follow `MODULE_VERSIONING.md` for version/build changes. Runtime changes require syntax/static validation and the narrowest meaningful live regression.

## Release janitorial gate

A Dev -> Stable rollout is not complete merely because Stable works. Once the authorized Stable promotion passes its smoke test, Dev cleanup begins immediately as part of that same authorized rollout. Do **not** stop to ask Amanda whether Dev should now be cleaned; no second approval is required for the janitorial work below.

This standing authorization covers only reconciliation/cleanup required to finish the already-approved promotion in Dev, its issue/task branches, and project records. It does not authorize unrelated runtime work or additional public Stable changes.

Before closing the rollout:

- confirm the exact promoted scope;
- pass Stable smoke;
- reconcile promoted versions/builds/manifests back into Dev;
- remove temporary diagnostics, probes, flags, shims, migration adapters, and test assets unless intentionally retained/documented;
- update/close the source issue;
- remove short-lived task/promotion/candidate branches once safely reachable from canonical history;
- if the active tool surface cannot delete branch refs directly, create an exact release-branch deletion handoff from the live inventory before moving on; the handoff must list DELETE refs with SHAs, the complete KEEP branch inventory, verification rules, and a paste-ready Work instruction;
- execute that handoff through Work/GitHub UI as mechanical cleanup without re-auditing unless live state contradicts it;
- clean stale `ACTIVE_CONTEXT.md` routing;
- remove resolved entries from `DEV_DIVERGENCES.json`;
- verify untouched runtime files did not acquire accidental drift.

Promotion includes cleaning the workspace.

### Historical handoff supersession

All branch cleanup/deletion handoff documents created before the 2026-09-29 canonical registry baseline are historical evidence only, even if their original text says READY FOR WORK. They must not be executed as current authority.

Current execution authority is only:
- `BRANCH_REGISTRY.md` for protected/permanent/archive state; and
- `BRANCH_DELETION_QUEUE.md` for exact-SHA deletion work.

A per-issue handoff is executable only when it is newly generated from the current registry/queue and explicitly linked from current issue/router state. If an old handoff conflicts with the registry/queue, the registry/queue wins.

### Completed-issue branch deletion handoff

At every issue/workstream closeout, inspect all refs created or retained for that work.

- If an ACTIVE PROTECTED ref is no longer needed, validate preservation, remove it from `BRANCH_REGISTRY.md`, and add it to `BRANCH_DELETION_QUEUE.md` with its exact current SHA.
- If the current executor can delete refs safely, it may execute the queue entry after the exact-SHA precondition passes.
- If the current executor cannot delete refs, leave the READY queue entry in place. Work/GitHub UI can execute it later without reclassification unless the live SHA contradicts the queue.
- Per-issue deletion handoffs remain valid for complicated releases, but they must be generated from and reconciled with the canonical registry/queue; they are not a substitute for them.
- After deletion, verify the live inventory, remove the completed queue row, clean stale `ACTIVE_CONTEXT.md` routing, and add concise closeout records.
- A completed issue must not leave an unregistered or silently-retained temporary branch.

Git history/issues/tags are the archive; active branch refs are not filing cabinets.

## Documentation discipline

- `ACTIVE_CONTEXT.md` is the small current-task router, not a transcript.
- GitHub issues hold standing backlog, migration records, and acceptance state.
- `DEV_WORKFLOW.md` defines the durable Dev operating model.
- `DEV_DIVERGENCES.json` records only intentional current runtime differences from Stable.
- `BRANCH_REGISTRY.md` records permanent, active-protected, pending-promotion, and pending-archive branch state.
- `BRANCH_DELETION_QUEUE.md` records exact-SHA refs awaiting mechanical deletion.
- `BRANCH_ARCHIVE.md` records verified immutable archives of retired permanent/critical refs.
- `CHANGELOG.md` and `PRE_FLIGHT_Check.md` remain rolling compact logs; old detail belongs in Git history.

Every committed repository update must update `CHANGELOG.md` and add a concise `PRE_FLIGHT_Check.md` record. Documentation-only changes must explicitly state that no runtime/module/manifest/public behavior changed.
