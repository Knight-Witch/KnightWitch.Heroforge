# Investigation and Evidence Guide

**Status:** Current detailed authority for investigation records and bounded runtime diagnostics. Read only for the current task; do not preload historical fixture runs.

## One canonical record

A structured GitHub issue can be the full authoritative investigation record. Use a file here only when it adds useful bounded evidence or design depth; link it from the issue and active router. Do not duplicate an investigation merely to populate this directory.

Required fields:

- problem, strict scope, known-good baseline, fixture URL/label, exact channel/commit/build;
- confirmed observations, supported inferences, active hypotheses (separate them);
- ruled-out paths / DO NOT REPEAT and completed fixture/gate results;
- bounded evidence pointers (request IDs, exact commits/paths, addressable sections);
- current conclusion/ownership, uncertainties, and next discriminating test;
- disposition: active, blocked, resolved/shipped, superseded, or historical; link successor/current issue.

Accepted architecture belongs in existing decision/contract homes; implementation acceptance stays with its issue; only resumption state goes in active context. Runtime fixes follow [DEV_WORKFLOW.md](../../DEV_WORKFLOW.md), not historical plan instructions.

## Current investigation routes

| Scope | Canonical record / disposition |
|---|---|
| #25 / #7 — High Res host coverage and native connection warning | [#25 coverage closure](ISSUE_25_COVERAGE_CLOSURE_2026-10-04.md), [prior source/packing and #7 evidence](ISSUES_25_7_HIGH_RES_AND_CONNECTION_2026-10-03.md). Recovery completed; sole active #25 branch `wd/25-texture-coverage`. #7 awaits an actual warning transition; no new warning trial needed for #25. |
| #34 — HR false restore warning / native mask verification | [Issue #34](https://github.com/Knight-Witch/KnightWitch.Heroforge/issues/34). Compare expected-size/shared-cache hypotheses using retained pre-cleanup state. Do not equate visually valid restoration with a proved verifier cause. |
| #24 — HR ON→OFF body tint | [Issue #24](https://github.com/Knight-Witch/KnightWitch.Heroforge/issues/24), closed/shipped. [Old broad plan](ISSUE_24_TEXTURE_REGRESSION_PLAN_2026-09-22.md) and [failed-release reopen handoff](ISSUE_24_REOPEN_HANDOFF_2026-09-24.md) are non-executable provenance. |
| #32 — HR body paint-zone collapse | [Issue #32](https://github.com/Knight-Witch/KnightWitch.Heroforge/issues/32), shipped; do not fold into #24/#34. |
| #35 — High Res diagnostic provider | [Issue #35](https://github.com/Knight-Witch/KnightWitch.Heroforge/issues/35), implementation complete, standing open Dev-only owner. |
| #59/#88 diagnostic providers, #90 status client, #97 reporter | [ACTIVE_CONTEXT.md](../../ACTIVE_CONTEXT.md) routes their exact current branch/design/gates; preserve opt-in/privacy/failure boundaries. |

## Bridge and autonomous Work

HF-Chat-Bridge transport is the authorized development session → GitHub request/result mailbox in `Knight-Witch/HF-Chat-Bridge` → local relay → Bridge userscript → Amanda's authenticated HeroForge runtime. It is development infrastructure, not a Dock runtime dependency and not necessarily a named callable plugin.

Read the Bridge repository's current protocol/pattern only when using it. Do not claim it is unavailable because no named connector appears. Establish transport health with one narrow fresh `bridge.ping` mailbox round trip and read its actual result. Never substitute a cloud-browser HeroForge session for Amanda's authenticated local runtime.

Use Bridge autonomously for reads, navigation, bounded reversible probes, and verification. Mutations are at-most-once: if execution is uncertain, read back before any retry; never blindly replay. A new controlled trial uses a new request ID and known initial state. Let native HeroForge own its lifecycle; prefer named/capability seams to guessed private/minified ones.

Another desktop application's focus is not a Bridge failure. `visibilityState=hidden` is renderer-scheduling evidence, not proof of transport loss. After a timeout/intermediate readback, use bounded observations to distinguish stalled, terminal, rolled-back, or recovered state. Continue from a coherent known state. Request tab visibility only for a genuinely necessary controlled comparison or human visual gate, not as routine babysitting.

Before stopping, establish the proven blocker, check Bridge-capable next actions, and continue any safe unfinished step. Ask Amanda only for genuinely human-only interaction/subjective confirmation or a real approval boundary. Source/runtime evidence must resolve what it can before reasoning escalation or implementation.

## Bounded evidence and checkpoints

Use one compact diagnostic snapshot; after the first baseline retrieve changed keys/hashes/addressable sections rather than repeated giant objects. Record one distinct error signature and deduplicate repeats. Capture is not permission to mutate, arm expensive operations, upload private data, or broaden the fixture matrix.

At each material phase checkpoint record completed fixtures, exact source/build, first bad transition, decisive field differences, ownership/conclusion, branch/commit, uncertain mutation state, and first unfinished step. Persist then continue; checkpoints are not permission requests. On interruption resume that step without re-running completed probes solely to reconstruct history.

Fixture navigation uses Amanda's explicit HeroForge URL + label. Exported JSON IDs/names may belong to reused test figures; record a mismatch rather than silently relabeling the fixture. Restrict active fixtures to the current issue; old #24 mixed-scope lists do not revive #32 fixtures. Blood Moon historical evidence does not make it a required user-supplied fixture.

When integrated behavior regresses, compare the working standalone reference before modifying it. Preserve timing, polling, retries, tolerant structural paths, snapshots, and rollback. Inspect only the relevant [technical topic](../../HISTORY/Bullshit_Bible.md) or [reference inventory](../../HISTORY/STANDALONE_REFERENCES.md). Consult Compatibility only for a specific unresolved engine seam or validated implementation. Historical assets/slot/joint catalogs require live verification.

Before a human gate, summarize fixture, first bad transition, decisive model/mask/atlas/material differences, inferred owner, candidate seam, and the remaining visual question. Do not hand Amanda console dumps or ask her to run routine probes.
