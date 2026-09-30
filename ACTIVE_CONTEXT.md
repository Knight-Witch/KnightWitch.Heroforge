# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-30 UTC
**Canonical Dev:** `WITCH_DEV_MAIN`, launcher v1.15.2 candidate, immutable payload `3c05f22a019278e2976d3c6ba8c847b333eff808`
**Public Stable:** `Witch_Scripts`, launcher v2.3.2, immutable payload `9e0ac579d142808016a1fa4539be3acc4c65fb82`

These are source identities, not a new live runtime validation. Current module versions/builds come from the channel manifest. Branch inventory/lifecycle comes only from [BRANCH_REGISTRY.md](BRANCH_REGISTRY.md) and [BRANCH_DELETION_QUEUE.md](BRANCH_DELETION_QUEUE.md).

## Active routes and next gates

| Track | Exact continuation source | Next gate / do not repeat |
|---|---|---|
| [#59 — Generic Bug Capture](https://github.com/Knight-Witch/KnightWitch.Heroforge/issues/59) | Canonical Dev Diagnostics Core/providers; paused checkpoint `wd/59-decals-diagnostic-provider`; [#88 Decals design](https://github.com/Knight-Witch/KnightWitch.Heroforge/blob/wd/88-diagnostic-capture-architecture/docs/diagnostics/providers/DECALS.md) | Resume remaining provider checkpoint from its latest issue/branch evidence. JSON/script-compat work is absorbed; its former branch is deleted. Do not repeat General/Texture Quality/Booth OFF validation merely to reconstruct context. |
| [#90 — Public status panel/client](https://github.com/Knight-Witch/KnightWitch.Heroforge/issues/90) | Canonical Dev `features/status/`; [PR #91](https://github.com/Knight-Witch/KnightWitch.Heroforge/pull/91) | Static/mock gates passed. Live canonical Dev loader/network/cache verification and Amanda's Utilities → Script Status visual/interaction gate remain before any Stable promotion. Prior v1.14.0/payload evidence is a checkpoint, not the current launcher identity. |
| [#97 — Integrated bug reporter](https://github.com/Knight-Witch/KnightWitch.Heroforge/issues/97) | `wd/97-integrated-bug-reporter`; issue's shared HF.Status contract links | Continue isolated implementation through the real Dev capture → upload → report → exact-report triage path, then human gate. No Stable integration yet. |
| [#88 — Diagnostic provider architecture](https://github.com/Knight-Witch/KnightWitch.Heroforge/issues/88) | `wd/88-diagnostic-capture-architecture/docs/diagnostics/` | Active design source; preserve draft/accepted distinctions. Do not absorb/retire its protected branch as documentation cleanup. |
| [#34 — HR false restore warning](https://github.com/Knight-Witch/KnightWitch.Heroforge/issues/34) | Issue #34 contains observations, evidence IDs, two hypotheses, and next test | Separate product defect. Prove verifier-only versus real restore fault; do not reopen/repeat shipped #24/#32 fixes. |

## Protected behavior and evidence

- General capture works with zero providers; providers are opt-in and failures cannot block General export. Capture is local/observational by default; heavy/armed operations remain explicit, with no automatic upload.
- Booth snapshot must not activate/bootstrap Booth or capture media. Settings diagnostics observe/retain real user attempts and never retry save/load. High Res lifecycle remains unchanged; unavailable pre-cleanup failure context stays explicitly unavailable.
- JSON/ReCK diagnostics exclude editor text/raw character JSON; script-compat does not enumerate Tampermonkey/extensions or mutate external-script/HeroForge limits.
- #90 is optional/non-blocking; its Dev endpoint is not a Stable endpoint. Public status must not carry reporter-token/private triage state. HF.Status backend/storage/triage ownership stays separate.
- Public Stable remains untouched until explicit narrow approval and all scoped gates pass.

Completed #59 General/Texture Quality/Booth OFF results and #90 static/mock detail are preserved exactly in [bfd8c9f:ACTIVE_CONTEXT.md](https://github.com/Knight-Witch/KnightWitch.Heroforge/blob/bfd8c9fc3a25d6589d1d51f3f9b4f95f11c16574/ACTIVE_CONTEXT.md). Read only the needed section. [Investigation guide](docs/investigations/README.md) routes evidence/Bridge procedure; [MASTER.md](MASTER.md) maps other policy. Backlog remains [issue #8](https://github.com/Knight-Witch/KnightWitch.Heroforge/issues/8).
