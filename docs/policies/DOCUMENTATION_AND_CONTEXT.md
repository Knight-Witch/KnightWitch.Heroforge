# Documentation and Context Policy

**Status:** Current detailed authority for durable knowledge, selective loading, and historical disposition.

## Authority map

Paths below are repository-relative. Read a source only when its concern is needed.

| Concern | Primary detailed owner | Supporting sources / boundary |
|---|---|---|
| Binding constitution and two-file bootstrap | [PROJECT_CONTRACT.md](../../PROJECT_CONTRACT.md) | Follow task-specific routes, never preload history. |
| Current state / next gate / no-repeat constraints | [ACTIVE_CONTEXT.md](../../ACTIVE_CONTEXT.md) | Current source/manifest verifies identity; old issue snapshots are dated evidence. |
| System/document map | [MASTER.md](../../MASTER.md) | Index only, no task queue. |
| Backlog / scope / acceptance | [Issue #8](https://github.com/Knight-Witch/KnightWitch.Heroforge/issues/8) and scoped issues | No duplicate PROJECT_PLAN.md. |
| Development, promotion, release cleanup, divergence reconciliation | [DEV_WORKFLOW.md](../../DEV_WORKFLOW.md) | #14 retains standing authorization/evidence; no independently maintained release checklist in bootstrap. |
| Live branch intent / creation / closeout / permanent approval | [BRANCH_REGISTRY.md](../../BRANCH_REGISTRY.md) | Existing classifications remain binding independent of native protection. |
| Exact-SHA deletion and verification | [BRANCH_DELETION_QUEUE.md](../../BRANCH_DELETION_QUEUE.md) | [Handoff template](../templates/RELEASE_BRANCH_DELETION_HANDOFF_TEMPLATE.md) is generated from registry/queue, never a second authority. |
| Immutable branch archives | [BRANCH_ARCHIVE.md](../../BRANCH_ARCHIVE.md) | Verified immutable tags before deleting replaced permanent refs. |
| Current intentional runtime differences | [DEV_DIVERGENCES.json](../../DEV_DIVERGENCES.json) | Workflow owns maintenance; standing owners can remain open after implementation. |
| Module/version/build synchronization | [MODULE_VERSIONING.md](../../MODULE_VERSIONING.md) | `manifest.json.moduleRegistry` owns active numeric versions. |
| Install/update/delivery and immutable pairing | [RUNTIME_DELIVERY.md](RUNTIME_DELIVERY.md) | Actual channel source owns bytes; Auto Host branch notes contain dated gates. |
| Core storage/global/interaction invariants | [Core contract](../../ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md) | Historical extraction plan is locally marked non-executable. |
| Presentation preservation | [STYLE_KEYS.md](../../STYLE_KEYS.md) | Current assets/CSS are implementation evidence. |
| Investigation records / Bridge behavior / checkpoints | [Investigation guide](../investigations/README.md) | One canonical record per investigation, issue or file. |
| Accepted decisions / feature specifications | [HISTORY/DECISIONS.md](../../HISTORY/DECISIONS.md), `ARCHITECTURE/`, explicitly named topic spec | Preserve accepted locations, do not duplicate them under a new decisions tree. |
| HeroForge technical evidence | [HISTORY/Bullshit_Bible.md](../../HISTORY/Bullshit_Bible.md) → relevant `HISTORY/BULLSHIT/` topic | Technical constraints remain valid; dated status is not current execution authority. |
| Standalone behavioral references | [HISTORY/STANDALONE_REFERENCES.md](../../HISTORY/STANDALONE_REFERENCES.md) | Compare known-working reference before changing integration. |
| External archive provenance / storage | [HISTORY/README.md](../../HISTORY/README.md), [reference manifest](../../HISTORY/REFERENCES/README.md) | Non-installing historical artifacts; verify against live HeroForge. |
| GPT/Work mode checkpoints | [TASK_MODE_ROUTER.md](../../TASK_MODE_ROUTER.md) | Advisory; safe bounded work continues autonomously. |
| Cross-repository ownership / registry impact | [DEV_WORKFLOW.md](../../DEV_WORKFLOW.md) | #59/#88/#90/#97 and linked external contracts own their scoped requirements. |
| Historical authority / retention / handoffs | This policy | Branch registry owns the 2026-09-29 handoff supersession rule. |
| Change / validation evidence | [CHANGELOG.md](../../CHANGELOG.md), [PRE_FLIGHT_Check.md](../../PRE_FLIGHT_Check.md) | Every committed update records both. |
| Optional patches / major-refactor backups | [DIFFS/README.md](../../DIFFS/README.md), [BACKUP_VAULT/README.md](../../BACKUP_VAULT/README.md) | Git history is default; never delete existing vault backups. |

## Checkpoints and current-state discipline

Update durable records after material validated findings, corrections, decisions, blockers, canonical-reference changes, and probe milestones. Batch repetitive observations; do not enter the next material phase while relevant records are knowingly stale. Resume the first unfinished step, not the whole investigation.

Active context contains current conditions, active tracks, gates, exact continuation sources, and no-repeat constraints. Completed validation tables belong in the existing issue/record. When trimming, link an exact commit/path if the evidence is not duplicated elsewhere; do not require an unrelated issue edit to preserve it. Channel head, pinned payload, installed launcher, and validated checkpoint are different identities. Label each explicitly.

Accepted decisions remain in `HISTORY/DECISIONS.md` and existing contracts/topic specifications. A historical folder name does not invalidate an accepted technical invariant. Draft #88 provider designs remain on their protected branch until that workstream accepts/absorbs them; standardization is not design approval.

## Historical instructions

Obsolete handoffs/plans must display a local **HISTORICAL — NON-EXECUTABLE** notice before preserved instructions and link current routing/disposition. Old READY/ACTIVE/next-step/do-not-close text is evidence of its date, not permission to act now. All branch cleanup handoffs before the canonical 2026-09-29 baseline are superseded by the registry/queue; newer handoffs must also be generated from and linked to current canonical state.

Closed issue bodies and version snapshots in standing issues are historical evidence unless current active routing explicitly adopts the relevant bounded instruction. Preserve still-valid accepted rules, but use current source and active context for present identities. No old release prose grants new Stable authorization. Historical investigations must not widen a current issue's scope or reopen shipped work.

A handoff records the task, scope, exact branch/commit/build, evidence/conclusion, completed and ruled-out work, unresolved gate, uncertain mutation state, and next discriminating step. It links primary sources instead of copying whole transcripts.

## Rolling logs and preservation

Keep new entries concise and place current entries first. Every commit updates both logs and states runtime/public impact. No mandatory startup reading of either log.

Compaction is permitted only after preserving unambiguous retrieval: record the repository, immutable commit SHA, original path, retained date/scope, and retrieval command (`git show <sha>:<path>`) before removing content. Keep unfinished gates and unique current evidence accessible through the router. Never rewrite historical findings to fit later conclusions. Prefer a separate bounded maintenance change if provenance or retention is unclear.

This migration leaves existing log history intact; size reduction remains a follow-up under this rule. Source manifests retain original filenames, hashes, and provenance; do not normalize defects in archived datasets or install old executable sources as live modules.
