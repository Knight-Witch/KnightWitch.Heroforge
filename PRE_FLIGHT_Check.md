# Pre-Flight Check

## 2026-10-07 — #107 Public Beta Tester branch registration

- PASS: read canonical `PROJECT_CONTRACT.md`, `ACTIVE_CONTEXT.md`, `BRANCH_REGISTRY.md`, `BRANCH_DELETION_QUEUE.md`, runtime-delivery policy, module loader/registry/application seams, and current Stable reporter/diagnostic surfaces before implementation.
- PASS: GitHub issue #107 owns the Public Beta Tester workstream.
- PASS: new branch `wd/107-public-beta-tester` was created from canonical Dev head `810fd41892181d5965b6e2a2168c8f2f7e41f431`.
- PASS: branch is registered ACTIVE PROTECTED before material implementation.
- DESIGN BOUNDARY: Public Stable remains the unaffected host baseline; Beta Tester must fail independently and must not become part of Stable startup.
- DESIGN BOUNDARY: beta modules must be explicit allowlisted/versioned immutable payloads, not an implicit mirror of all current Dev modules.
- DESIGN BOUNDARY: live OFF should be supported through beta-module disposal/unmount contracts where applicable; no private/minified HeroForge seams are permitted.
- DESIGN BOUNDARY: Beta/QA bug reporting should reuse the canonical Witch Dock reporter client/overlay and diagnostics provider model. HF.Status owns the distinct Beta/QA taxonomy, backend storage/indexing, and triage bucket.
- Feature-registry impact: pending implementation review; no runtime registry change in this governance-only commit.
- No Public Stable promotion or runtime mutation is authorized or performed.
