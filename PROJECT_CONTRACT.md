# Witch Dock Project Contract

**Status:** Binding development contract  
**Scope:** `Knight-Witch/KnightWitch.Heroforge`, all active branches  
**Purpose:** Keep Witch Dock development, HeroForge compatibility work, live diagnostics, testing, and Stable promotion safe without forcing every chat to reload the repository history.

## Required bootstrap

Before material code, architecture, compatibility, migration, or committed documentation work:

1. Read this `PROJECT_CONTRACT.md`.
2. Read `ACTIVE_CONTEXT.md` on `WITCH_DEV_UI`.
3. Read only the policy/history/source files routed by `ACTIVE_CONTEXT.md` or directly required by the task.
4. Inspect the target files and directly connected modules before editing.

Do **not** automatically reread `MASTER.md`, the full changelog, the full pre-flight log, `HISTORY/SESSION_LOG.md`, `HISTORY/STANDALONE_REFERENCES.md`, or unrelated `HISTORY/BULLSHIT/*` files. Git history is durable memory; old detail should be fetched only when materially relevant.

## Branch and release boundaries

- `WITCH_DEV_UI` is the development/integration branch and the only normal test environment for new Witch Dock behavior.
- `Witch_Scripts` is public Stable. Do not use it as an experimental branch.
- Promotion order is: diagnose/reference -> Dev implementation -> static validation -> live Dev runtime validation -> human visual gate when appearance matters -> explicit Stable promotion -> narrow Stable smoke.
- Stable promotions must be narrow. Prefer exact validated blobs or surgical equivalent changes; do not merge unrelated Dev work merely because it is available.
- Existing Stable behavior is protected until a replacement has passed its required gate.

## Diagnose before editing

Determine what Witch Dock and HeroForge actually do before changing behavior. Do not guess HeroForge internals when source/runtime inspection can answer the question.

Classify technical claims as:

- **Confirmed** — observed in source/runtime or validated by test.
- **Supported inference** — strongly supported but not directly proven.
- **Hypothesis** — plausible and unverified.

Preserve known-working timing, polling, retries, readiness checks, state sequencing, snapshots, rollback behavior, cache-key behavior, ownership boundaries, and tolerant capability probing unless testing proves a safer replacement.

For HeroForge integration, prefer stable/named runtime state and capabilities over private/minified implementation details. Do not replace native engine ownership when a source-policy or adapter seam is sufficient.

## HF-Chat-Bridge is the development control plane

`Knight-Witch/HF-Chat-Bridge` exists so Amanda does **not** have to be the console/probe middleman.

Use it autonomously for runtime reads, diagnostics, reversible tests, state inspection, bounded mutations, and verification whenever that reduces human work. Ask Amanda only for genuinely human actions such as loading/updating a userscript, clicking an interaction that cannot be driven safely, or subjective visual confirmation.

Mutation-capable bridge work is at-most-once. If a mutation times out or its execution is uncertain, read back state before considering any retry. Never blindly replay an uncertain mutation.

The Bridge is development infrastructure only. Witch Dock public/runtime code must never depend on HF-Chat-Bridge.

## Relationship to HeroForge.Compatibility

`Knight-Witch/HeroForge.Compatibility` is the upstream investigation/reconstruction repository for difficult HeroForge engine behavior. Consult it when the Witch Dock task requires unresolved engine evidence or an existing validated compatibility implementation.

Do not load Compatibility history by default for ordinary Witch Dock work. Once behavior has been validated and vendored into Witch Dock, Witch Dock owns its integration lifecycle. There must be no public runtime dependency on a Compatibility feature branch.

## Failure isolation and visual acceptance

Optional feature failure must not intentionally break Witch Dock core, unrelated modules, or unmodified HeroForge. Risky changes should fail closed and restore only state they own where practical.

Runtime coherence is not proof of visual correctness. When appearance is part of acceptance, Amanda's visual confirmation is required before the visual gate is called passed.

## Module and manifest discipline

`manifest.json.moduleRegistry` is the canonical active-module version registry. Follow `MODULE_VERSIONING.md` for version bumps and source-local identifiers.

For active runtime changes:

- bump the relevant module version when required;
- keep source-local version/build identifiers consistent;
- validate JavaScript syntax and manifest structure;
- preserve deterministic cache-keyed delivery;
- run the narrowest meaningful live regression;
- do not claim success from parsing alone.

## Durable documentation without context bloat

- `ACTIVE_CONTEXT.md` is the small task router and should contain only the current goal, protected state, next step, and minimum continuation set.
- `MASTER.md` is a compact repo-wide architecture/status index, not a running investigation transcript.
- `CHANGELOG.md` and `PRE_FLIGHT_Check.md` are rolling current logs. Older detailed entries remain in Git history.
- `HISTORY/BULLSHIT/*` holds durable feature/engine detail and is read only when routed by the current task.
- `HISTORY/SESSION_LOG.md`, `HISTORY/STANDALONE_REFERENCES.md`, and other large historical files are never mandatory startup reading.

Every committed repository update must update `CHANGELOG.md` and add a concise `PRE_FLIGHT_Check.md` record. Documentation-only changes must explicitly state that no runtime/module/manifest/public behavior changed.

After a meaningful live milestone, record the conclusion and evidence reference; do not force future chats to reload raw Bridge payloads.

## Working style

Put TLDR first. Diagnose before editing. Continue autonomously through safe investigation/implementation steps instead of stopping at intermediate narration checkpoints. Use GitHub directly when available; do not claim the connector is unavailable without actually trying it.

For GitHub userscripts, provide raw update/install links rather than downloaded replacement files unless Amanda explicitly asks for a file.

## Final operating principle

Keep startup context tiny, use the Bridge instead of Amanda as the probe layer, preserve validated behavior, isolate failures, test in Dev before Stable, and treat Git/history files as durable memory rather than mandatory prompt payload.