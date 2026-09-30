# Witch Dock Project Contract

**Status:** Binding constitution
**Canonical Dev:** `WITCH_DEV_MAIN` · **Public Stable:** `Witch_Scripts`

## Bootstrap and authority

Before material work, read this file and [ACTIVE_CONTEXT.md](ACTIVE_CONTEXT.md) on canonical Dev. Then read only the sources routed there or directly required by the task. Do not preload changelogs, preflight/session logs, old handoffs, or full investigation histories.

- [DEV_WORKFLOW.md](DEV_WORKFLOW.md) owns diagnosis, development, selective release, divergence reconciliation, and automatic bounded closeout.
- [MASTER.md](MASTER.md) maps systems and detailed authorities; it is not a competing task router.
- [Documentation/context policy](docs/policies/DOCUMENTATION_AND_CONTEXT.md) owns knowledge placement, retention, and historical authority.
- [Investigation guide](docs/investigations/README.md) owns evidence records, bounded autonomous Bridge work, and resumable checkpoints.
- [TASK_MODE_ROUTER.md](TASK_MODE_ROUTER.md) is advisory at meaningful task/phase checkpoints only; do not re-evaluate on routine messages or interrupt a bounded step to switch modes.

For every branch-affecting task, additionally read [BRANCH_REGISTRY.md](BRANCH_REGISTRY.md) and [BRANCH_DELETION_QUEUE.md](BRANCH_DELETION_QUEUE.md); read [BRANCH_ARCHIVE.md](BRANCH_ARCHIVE.md) for permanent replacement/archival. Register every new branch before material work. Completed non-permanent branches transition to the exact-SHA queue. Permanent changes require Amanda's explicit approval. Native GitHub protection is defense-in-depth; only the queue authorizes deletion.

## Binding preservation and release boundaries

Diagnose before editing; inspect source/runtime evidence before guessing HeroForge internals. Distinguish confirmed findings, supported inference, and hypothesis. Working standalone references remain behavioral authority until migration is tested and confirmed.

Preserve timing, polling, retries, readiness, snapshots, rollback, ownership, tolerant structural probes, cache keys, module order/enablement, and failure isolation unless testing proves a change safe. Preserve presentation during functional fixes unless explicitly authorized or the visual behavior is the defect. [Core contract](ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md) and [STYLE_KEYS.md](STYLE_KEYS.md) retain the specific invariants.

Stable is public, never experimental. Stable is the baseline for unaffected runtime; every intentional Dev difference needs an open owner and [DEV_DIVERGENCES.json](DEV_DIVERGENCES.json). Never bulk-merge legacy history or whole Dev merely to ship one feature. Retired `WITCH_DEV_UI` / `WITCH_DEV` refs are not active routes.

Required flow: diagnosis → Dev implementation → static checks → live Dev validation → relevant human visual gate → explicit narrow Stable approval/promotion → Stable smoke → automatic bounded reconciliation/cleanup. Successful authorized promotion includes its cleanup without a second permission request; it does not authorize unrelated work or additional Stable changes.

## Runtime and system boundaries

[Runtime delivery policy](docs/policies/RUNTIME_DELIVERY.md) owns channel/install/update paths and immutable pairing. Keep the Dev launcher narrow, fixed Tampermonkey identity, visible Dev/version metadata, canonical fallback routing, and visible channel failure. Never silently run Stable as Dev. Expose bounded host capabilities, not raw Tampermonkey privileges to page context.

[MODULE_VERSIONING.md](MODULE_VERSIONING.md) owns version/build synchronization; `manifest.json.moduleRegistry` is the active version authority. Runtime changes need appropriate synchronized bumps and the narrowest meaningful live regression.

HF-Chat-Bridge is development infrastructure only, never a runtime dependency. Use it autonomously with at-most-once mutations and readback before uncertain retries. Compatibility is targeted upstream engine evidence/reconstruction; Foundation ownership must not move implicitly. HF.Status owns taxonomy/backend/storage/triage contracts; Witch Dock owns runtime/provider/UI implementation. All optional integrations must fail independently of Dock startup/core. Detailed ownership and the feature-registry impact gate live in [DEV_WORKFLOW.md](DEV_WORKFLOW.md).

## Durable records

Every committed repository update must update [CHANGELOG.md](CHANGELOG.md) and add a concise [PRE_FLIGHT_Check.md](PRE_FLIGHT_Check.md) record. Documentation-only records must state: **no runtime/module/manifest/public behavior changed**. Keep logs rolling and compact under the provenance-preserving retention policy. Current work goes in active context, backlog in issue #8, evidence in its indexed investigation/issue, and accepted decisions in their existing homes.
