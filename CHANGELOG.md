## 2026-09-30 — #101 HF.Status publication handoff

- Added a mandatory factual HF.Status publication handoff after every validated Stable smoke, including version-truth-only, silent/internal, and no-publication outcomes.
- Witch Dock remains authoritative for shipped Stable version/source/runtime facts; HF.Status owns public wording, update grouping/prominence, notification class, and reviewed publication after Amanda approval.
- Added the reusable handoff template and repo-map routing; no duplicate version/status authority or runtime dependency was introduced.
- Documentation/governance only; no runtime/module/manifest/public behavior changed.

---

## 2026-09-30 — Rolling-log provenance compaction

- Compacted older CHANGELOG detail under the repository's provenance-preserving rolling-log policy while retaining the most recent release/governance records below.
- The complete pre-compaction CHANGELOG is immutable at `2ed5ef234d5f8f01a67d136608471f64e15311e5` in `Knight-Witch/KnightWitch.Heroforge`.
- Exact retrieval: `git show 2ed5ef234d5f8f01a67d136608471f64e15311e5:CHANGELOG.md`.
- Historical content was not rewritten; Git history remains the archive. Documentation-only; no runtime/module/manifest/public behavior changed.

---

## 2026-09-30 — Repository standardization closed out

- PR #100 merged; `docs/repository-operating-standard` was queued at `c19e720ce551c912e2aa08dbe6e40d5b8e0dfab5`, re-verified at that SHA, physically deleted, and verified absent. Removed the completed queue row.
- Live inventory reconciles exactly with three permanent and three existing active-protected refs; queue empty. Existing classifications and protected branch heads are preserved.
- Documentation/governance only; no runtime/module/manifest/public behavior changed. No Stable promotion or unrelated issue writes.

---

## 2026-09-30 — Standardization merged; task ref queued

- PR #100 merged to canonical Dev as `52ce0cb02129fbe9223570d60f958e54a07e10da`; merged tree exactly matches the validated publication tree.
- Moved only `docs/repository-operating-standard` from ACTIVE PROTECTED to READY deletion queue at exact final SHA `c19e720ce551c912e2aa08dbe6e40d5b8e0dfab5`. Other classifications remain unchanged.
- Documentation/governance only; no runtime/module/manifest/public behavior changed. Stable and unrelated issues untouched.

---

## 2026-09-30 — Repository operating-standard reconciliation

- Consolidated the compact constitution/current router/map, workflow, and focused documentation, delivery, and investigation authorities. Preserved existing decisions/specs, module versioning, branch policy, and issue-based roadmap.
- Corrected obsolete MASTER release state, historical execution authority, fixed-header wording, divergence notes, pre-modular delivery guidance, and stale style/source routing. Clarified Auto Host v0.2.1 source versus dated v0.2.0 gate without inventing runtime validation.
- Preserved exact original evidence through local historical notices and immutable Git links. Existing log history remains intact; provenance-preserving compaction is a bounded follow-up.
- Additional rules retained: Bridge mailbox/at-most-once/background handling, standalone-reference parity, native capture/lighting boundaries, tolerant layouts, backup retention, and separate Stable self-host behavior.
- Documentation/governance only; no runtime/module/manifest/public behavior changed. No Stable promotion or unrelated issue updates.

---

## 2026-09-30 — Register repository-standardization task

- Registered `docs/repository-operating-standard` as ACTIVE PROTECTED before material edits, from canonical Dev `8ee1dff85eeeeb8691ff955e049ad0ebc2ffe0b8`.
- Existing branch classifications and deletion queue are unchanged.
- Documentation/governance only; no runtime/module/manifest/public behavior changed.

---

## 2026-09-30 — Canonical branch deletion sweep complete

- Deleted four exact-SHA READY refs: `wd/41-dev-auto-host-head-resolve`, `wd/payload-1.5.1`, `wd/payload-1.5.4`, and `wd/28-public-payload-2.0.0`.
- Verified the complete live inventory is exactly the three PERMANENT refs and three ACTIVE PROTECTED refs recorded in `BRANCH_REGISTRY.md`; zero unregistered refs remain.
- Removed all completed rows from `BRANCH_DELETION_QUEUE.md`; the queue is empty.
- Documentation/governance only; no runtime/module/manifest/public behavior changed.

---

## 2026-09-29 — Clarify procedural vs native GitHub branch protection

- Branch lifecycle protection is now explicitly a project-governance classification independent of GitHub's native `protected` flag/ruleset availability.
- A branch may report `protected: false` and still be PERMANENT / ACTIVE PROTECTED / PENDING ARCHIVE under binding project policy.
- Native GitHub protection is defense-in-depth only; deletion authority comes exclusively from exact-SHA READY entries in `BRANCH_DELETION_QUEUE.md`.
- Updated contract, registry, deletion queue, workflow, and deletion-handoff template accordingly.
- Documentation/governance only; no runtime/module/manifest/public behavior changed.

---

## 2026-09-29 — Harden branch replacement/audit edge cases

- Permanent replacement now explicitly audits default-branch settings, raw install/update/download URLs, workflows, rulesets/protection, docs, and external ref consumers before approval/promotion.
- Standard branch audit now treats already-absent queued refs as completed deletions requiring queue cleanup rather than branch reconstruction.
- Archive tags are explicitly immutable recovery records and cannot be retargeted/deleted without approval.
- Documentation/governance only; no runtime/module/manifest/public behavior changed.

---

## 2026-09-29 — Supersede pre-registry branch handoffs

- Binding contract/registry now explicitly mark every branch cleanup/deletion handoff created before the 2026-09-29 registry baseline as historical and non-executable.
- Stale READY wording in old handoffs cannot override the canonical registry or exact-SHA deletion queue.
- Future executable handoffs must be regenerated from the current registry/queue.
- Documentation/governance only; no runtime/module/manifest/public behavior changed.

---

## 2026-09-29 — Canonical branch registry / deletion queue governance

- Added binding `BRANCH_REGISTRY.md`, `BRANCH_DELETION_QUEUE.md`, and `BRANCH_ARCHIVE.md`.
- Permanent NEVER DELETE refs are now explicit: `WITCH_DEV_MAIN`, `Witch_Scripts`, and canonical Auto Host distribution ref `wd/dev-auto-host`.
- Active-protected refs are explicit: `wd/59-decals-diagnostic-provider`, `wd/88-diagnostic-capture-architecture`, and `wd/97-integrated-bug-reporter`.
- Seeded the exact-SHA deletion queue with four validated stale refs: `wd/41-dev-auto-host-head-resolve`, `wd/payload-1.5.1`, `wd/payload-1.5.4`, and `wd/28-public-payload-2.0.0`.
- Defined mandatory registration for every newly created branch, active->delete transitions at closeout, explicit approval for permanent promotion/replacement, immutable tag + ledger archival before retiring a replaced permanent ref, and a cheap set-reconciliation audit.
- Updated project contract, development workflow, deletion-handoff template, and stale branch routing in `ACTIVE_CONTEXT.md`.
- Documentation/governance only; no runtime/module/manifest/public behavior changed.

---

## 2026-09-29 — #94 rollout complete; branch deletion handoff staged

- Public Stable v2.3.2 live smoke passed: payload `9e0ac579d142808016a1fa4539be3acc4c65fb82`, Booth `v27.1.1-json-subtool-section`, sibling Booth sections, zero JSON controls under Persistent Booth.
- Amanda public Stable visual gate passed.
- Removed resolved #94 runtime divergence; Dev Booth remains ahead only under open #59 diagnostics.
- Current GitHub connector cannot delete refs, so exact mechanical cleanup is staged in `docs/BRANCH_DELETION_HANDOFF_ISSUE_94_2026-09-29.md` for the two temporary #94 branches.
- Documentation/divergence-state only; no runtime/module/manifest/public behavior changed.

---

## 2026-09-29 — #94 Stable v2.3.2 merged; smoke pending

- PR #96 merged public Stable v2.3.2 / Booth v27.1.1 with immutable payload `9e0ac579d142808016a1fa4539be3acc4c65fb82`.
- Promotion diff was limited to the Stable launcher/pin, Booth subtool relocation/version, manifest metadata/cache key, and release logs; Dev-only diagnostics were excluded.
- Canonical Dev routing now records Stable v2.3.2 and keeps #94 open only for the required live Stable smoke/janitorial closeout.
- Documentation/divergence-state update only; no Dev runtime/module/manifest behavior changed.

---

## 2026-09-29 — #94 live Dev UI validation

- Dev v1.15.2 / payload `3c05f22a019278e2976d3c6ba8c847b333eff808` reloaded successfully through HF-Chat-Bridge.
- Live runtime reports Booth v27.3.1 / `v27.3.1-json-subtool-section`.
- DOM verification confirms `Persistent Booth` and `Booth JSON Import / Export` are separate sibling Witch Dock sections.
- `.kwBoothFileButtons` has zero matches under the Persistent Booth section and one match under the Booth JSON section; both Save Settings / Load Settings buttons and the Ready status are present in the JSON section.
- Persistent Booth Directions remains in the Persistent Booth section.
- Documentation-only validation record; no additional runtime/module/manifest/public Stable behavior changed.

---

## 2026-09-29 — #94 Dev v1.15.2 Booth JSON subtool pin

- Dev launcher -> v1.15.2 / `1.15.2-booth-json-subtool`.
- Pins immutable payload `3c05f22a019278e2976d3c6ba8c847b333eff808`, which contains Booth v27.3.1 and the dedicated `Booth JSON Import / Export` section.
- The payload also preserves the already-staged #59/#90 Dev runtime state unchanged.
- Public Stable unchanged.
- Next gate: reload canonical Dev through HF-Chat-Bridge and verify separate Booth section DOM + button/status wiring.
