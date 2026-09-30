# Witch Dock Repository Map

This is an index, not current release state or a task queue. Start with [PROJECT_CONTRACT.md](PROJECT_CONTRACT.md) and [ACTIVE_CONTEXT.md](ACTIVE_CONTEXT.md). The complete responsibility map is in [Documentation and Context](docs/policies/DOCUMENTATION_AND_CONTEXT.md).

## Operations

- [Development workflow](DEV_WORKFLOW.md): diagnosis, scoped work, validation, selective promotion, automatic release closeout, and cross-repository ownership.
- [HF.Status publication handoff template](docs/templates/HF_STATUS_PUBLICATION_HANDOFF_TEMPLATE.md): structured factual Stable-release handoff for HF.Status editorial review after every passing Stable smoke, including silent/version-only outcomes.
- [Branch registry](BRANCH_REGISTRY.md), [deletion queue](BRANCH_DELETION_QUEUE.md), [archive ledger](BRANCH_ARCHIVE.md): exclusive branch lifecycle authority.
- [Module versioning](MODULE_VERSIONING.md), [divergence ledger](DEV_DIVERGENCES.json), [delivery policy](docs/policies/RUNTIME_DELIVERY.md): version, channel, and immutable payload contracts.
- [Investigation guide](docs/investigations/README.md): evidence, Bridge work, checkpoints, and canonical investigation pointers.
- [Task mode router](TASK_MODE_ROUTER.md): advisory checkpoint decisions.
- [Issue #8](https://github.com/Knight-Witch/KnightWitch.Heroforge/issues/8): standing backlog; scoped issues own acceptance.

## Runtime and design

- `Witch_Dock_DEV.user.js`: installed canonical Dev bootstrap. `Witch_Dock.user.js` on `Witch_Scripts`: installed public Stable launcher/self-host. The copy of `Witch_Dock.user.js` on Dev is a retained legacy surface, not its installed entrypoint.
- `manifest.json.moduleRegistry`: active module inventory/version authority; read the correct channel/pinned payload.
- `features/core/`: modular application/core composition and shell services; [core contract](ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md) preserves storage, public seams, loading, and interactions.
- `tools/`, `features/`, `HeroForge_UI/`: tools, services/providers, and hidden/conditional UI integrations; the manifest determines live membership.
- [STYLE_KEYS.md](STYLE_KEYS.md), [ASSETS/](ASSETS/): presentation constraints and assets.
- [#88 design branch](https://github.com/Knight-Witch/KnightWitch.Heroforge/tree/wd/88-diagnostic-capture-architecture/docs/diagnostics): provider architecture/design source; acceptance status remains in that workstream.

## Durable knowledge

- [HISTORY/DECISIONS.md](HISTORY/DECISIONS.md): accepted decisions, including separate Advanced Lighting/physical/rim/Booth ownership and standalone migration rules.
- [HISTORY/Bullshit_Bible.md](HISTORY/Bullshit_Bible.md): index into focused technical evidence/specs, including lighting and Decal Slot Swapper. Load only the relevant topic.
- [Standalone references](HISTORY/STANDALONE_REFERENCES.md), [external archive manifest](HISTORY/REFERENCES/README.md), [history policy](HISTORY/README.md): behavioral references and provenance.
- [CHANGELOG.md](CHANGELOG.md), [PRE_FLIGHT_Check.md](PRE_FLIGHT_Check.md), Git history: change/validation records, not bootstrap input.
- [DIFFS/](DIFFS/), [BACKUP_VAULT/](BACKUP_VAULT/): optional patches and preserved major-refactor backups.

## Repository boundaries

[Workflow ownership](DEV_WORKFLOW.md#cross-repository-ownership) routes HF-Chat-Bridge development infrastructure, targeted HeroForge.Compatibility engine evidence, Foundation ownership, and HF.Status taxonomy/backend/publication contracts. Stable release facts flow outward through the publication-handoff template; HF.Status remains optional support infrastructure and never becomes a Witch Dock runtime dependency.

The former MASTER release diary is preserved at [bfd8c9f:MASTER.md](https://github.com/Knight-Witch/KnightWitch.Heroforge/blob/bfd8c9fc3a25d6589d1d51f3f9b4f95f11c16574/MASTER.md); its old versions and pending gates are historical, not current instructions.
