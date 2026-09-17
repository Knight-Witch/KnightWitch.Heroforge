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

Do not preload full history, old changelogs/preflight logs, session logs, or legacy branch history. Legacy `WITCH_DEV_UI` / `WITCH_DEV` are reference sources only during migration audit #12.

## Branch roles

- `Witch_Scripts` is public Stable. Never use it as an experimental branch.
- `WITCH_DEV_MAIN` is the canonical integration/sandbox branch.
- Stable is the source of truth for any runtime/module with no open Dev reason to differ.
- Every intentional Dev runtime divergence must map to an open issue/task and be recorded in `DEV_DIVERGENCES.json`.
- Large, risky, or parallel work should use a short-lived issue-scoped branch from `WITCH_DEV_MAIN`; merge only after validation, then delete the temporary branch when no longer needed.
- Never bulk-merge legacy Dev history into New Dev. Harvest only specific validated fragments that remain relevant.

## Dev parity rule

An unaffected module should be byte-for-byte equivalent to Stable whenever practical. If Stable changes independently, reconcile that scope into Dev promptly unless an open issue explicitly requires Dev to stay different.

Unexpected Dev-vs-Stable runtime drift is a defect until explained.

## Canonical Dev runtime identity

- The canonical installed Dev userscript is `Witch_Dock_DEV.user.js`, not the public `Witch_Dock.user.js` entrypoint.
- Tampermonkey identity must remain stable across Dev versions: fixed `@name` `WITCH DOCK - DEV`, stable namespace, and stable channel-specific update/download URL.
- The active version belongs in userscript `@version`, runtime `DEV_VERSION`, the module registry, and the visible Dock title `WITCH DOCK - DEV v<version>`.
- Do not put the changing version into Tampermonkey `@name`; doing so can create duplicate Dev installs instead of updating the existing script.
- Tampermonkey and the visible Dock must clearly identify the same Dev channel, but the Tampermonkey name is intentionally unversioned while the Dock title is versioned.
- Dev update/download URLs, manifest routing, and manifest-loaded runtime URLs must resolve to `WITCH_DEV_MAIN`, never silently to `Witch_Scripts` or a legacy Dev branch.
- A Dev bootstrap/channel-seam failure must fail visibly rather than silently running Stable while appearing to be Dev.
- Keep the Dev launcher narrow. It is a channel/bootstrap boundary and temporary migration seam toward issue #10, not a second application core.

## Development flow

Normal flow:

issue/task -> diagnosis -> Dev implementation -> static checks -> live Dev validation -> human visual gate when relevant -> explicit narrow Stable promotion -> Stable smoke -> automatic Dev reconciliation/janitorial closeout.

Preserve known-working timing, polling, retries, readiness checks, ownership boundaries, snapshots, rollback behavior, cache-key behavior, module order, enablement behavior, and failure isolation unless testing proves a change safe.

HF-Chat-Bridge is development infrastructure only and must never become a Witch Dock runtime dependency.

## Tampermonkey boundary

The long-term userscript architecture should keep only the privileged userscript host/bootstrap in Tampermonkey. Application/core behavior should live in normal GitHub-owned modules where practical.

Expose bounded privileged operations rather than raw Tampermonkey capabilities into page context. Preserve current behavior while migrating incrementally.

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
- clean stale `ACTIVE_CONTEXT.md` routing;
- remove resolved entries from `DEV_DIVERGENCES.json`;
- verify untouched runtime files did not acquire accidental drift.

Promotion includes cleaning the workspace.

## Documentation discipline

- `ACTIVE_CONTEXT.md` is the small current-task router, not a transcript.
- GitHub issues hold standing backlog, migration records, and acceptance state.
- `DEV_WORKFLOW.md` defines the durable Dev operating model.
- `DEV_DIVERGENCES.json` records only intentional current runtime differences from Stable.
- `CHANGELOG.md` and `PRE_FLIGHT_Check.md` remain rolling compact logs; old detail belongs in Git history.

Every committed repository update must update `CHANGELOG.md` and add a concise `PRE_FLIGHT_Check.md` record. Documentation-only changes must explicitly state that no runtime/module/manifest/public behavior changed.
