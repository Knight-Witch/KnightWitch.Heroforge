# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-10-06 UTC
**Canonical Dev:** `WITCH_DEV_MAIN`, launcher v1.17.2 / `1.17.2-stable-asset-sync`, immutable payload `0a4b5a8de4eb825c881f5ecf21d236f202c08004`
**Public Stable:** `Witch_Scripts`, launcher v2.4.2 / `2.4.2-refresh-compatibility`, immutable payload `93c0de5cd0da1dece3ef286c5a9201c83f1addb7`, current ref `c518402f40e487b1840444efd8948fdff4968998` (separate legacy-wrapper compatibility commit; payload unchanged)

These are source identities, not a new live runtime validation. Current module versions/builds come from the channel manifest. Branch inventory/lifecycle comes only from [BRANCH_REGISTRY.md](BRANCH_REGISTRY.md) and [BRANCH_DELETION_QUEUE.md](BRANCH_DELETION_QUEUE.md).

## Active routes and next gates

| Track | Exact continuation source | Next gate / do not repeat |
|---|---|---|
| [#25 — High Res coverage](https://github.com/Knight-Witch/KnightWitch.Heroforge/issues/25) | [Dev implementation handoff](docs/investigations/ISSUE_25_DEV_IMPLEMENTATION_HANDOFF_2026-10-06.md), then [coverage closure and live evidence](docs/investigations/ISSUE_25_COVERAGE_CLOSURE_2026-10-04.md); sole branch `wd/25-texture-coverage` | Dev correction v0.1.3 is staged on the issue branch. Counting Sheep proved v0.1.2 still self-reconciled; controlled core reconcile preserved semantic display keys and sampled accessory metadata, so renderer-state signatures are no longer used as a user-change detector. v0.1.3 observes live figure-data `change(...)` instead, debounces outside changes by 600 ms, and suppression-scopes every Witch Dock-owned native reconcile so its own `data.change()` calls cannot requeue coverage. Observer ownership is reversible across figure replacement/disposal. Focused tests pass 18/18. Canonical Dev remains v1.17.2/payload `0a4b5a8de4eb825c881f5ecf21d236f202c08004` until v0.1.3 receives a new immutable pairing. Next gate is Counting Sheep anti-loop revalidation, then the remaining required fixture/lifecycle matrix. Do not repeat completed census/source/allocation discriminators. No blanket scale, global CreationKit patch, 64 MP atlas, developer UI, or Stable promotion. |
| [#7 — Native connection warning](https://github.com/Knight-Witch/KnightWitch.Heroforge/issues/7) | [Native emitter and completed recovery evidence](docs/investigations/ISSUES_25_7_HIGH_RES_AND_CONNECTION_2026-10-03.md) | Native notify branch proved; failing request not isolated. Scourge/Devastator/Twilight OFF and Wilds ON produced no warning; Bath's separate HR failure had no bad native `.ckb`/AAID candidate. Next gate is first-transition capture with URL/status/request owner/cache/state. |
| [#59 — Generic Bug Capture](https://github.com/Knight-Witch/KnightWitch.Heroforge/issues/59) | Canonical Dev Diagnostics Core/providers; paused checkpoint `wd/59-decals-diagnostic-provider`; [#88 Decals design](https://github.com/Knight-Witch/KnightWitch.Heroforge/blob/wd/88-diagnostic-capture-architecture/docs/diagnostics/providers/DECALS.md) | Resume remaining provider checkpoint from its latest issue/branch evidence. JSON/script-compat work is absorbed; its former branch is deleted. Do not repeat General/Texture Quality/Booth OFF validation merely to reconstruct context. |
| [#88 — Diagnostic provider architecture](https://github.com/Knight-Witch/KnightWitch.Heroforge/issues/88) | `wd/88-diagnostic-capture-architecture/docs/diagnostics/` | Active design source; preserve draft/accepted distinctions. Do not absorb/retire its protected branch as documentation cleanup. |
| [#34 — HR false restore warning](https://github.com/Knight-Witch/KnightWitch.Heroforge/issues/34) | Issue #34 contains observations, evidence IDs, two hypotheses, and next test | Separate product defect. Prove verifier-only versus real restore fault; do not reopen/repeat shipped #24/#32 fixes. |

## Recently released

- #104 HFJSON delivery aliases are live at `https://witchdock.knightwitch.dev/HFJSON/`; seven active Lob/HF JSON aliases currently redirect to GitGud. Paired HF.Status #89 is production-live and validated. The completed `wd/104-hfjson-delivery` branch was deleted from GitHub at exact queued SHA `7af8245e63e6fbe359542e26885a6b2f61106c1e`; Bitbucket recovery never carried that temporary ref.
- #90 and #97 shipped to public Stable v2.4.0. Script Status uses `https://status.knightwitch.dev`; integrated reporting uses Witch Dock-specific capabilities, contextual source preservation, General diagnostics/evidence, and HFBR receipts.
- Stable launcher/update/ref/payload delivery is provider-independent through `https://witchdock.knightwitch.dev`. GitHub and Bitbucket `Witch_Scripts` histories match exactly through the public release.
- Release notice formatting is v0.3.1 / `0.3.1-formatted-bug-reporting-notice`; the overview and expanded content use native headings and bullet lists.

## Protected behavior and evidence

- General capture works with zero providers; providers are opt-in and failures cannot block General export. Capture is local/observational by default; heavy/armed operations remain explicit, with no automatic upload.
- Booth snapshot must not activate/bootstrap Booth or capture media. Settings diagnostics observe/retain real user attempts and never retry save/load. High Res lifecycle remains unchanged; unavailable pre-cleanup failure context stays explicitly unavailable.
- JSON/ReCK diagnostics exclude editor text/raw character JSON; script-compat does not enumerate Tampermonkey/extensions or mutate external-script/HeroForge limits.
- #90 is optional/non-blocking. Dev uses `https://status-dev.knightwitch.dev`; Stable uses `https://status.knightwitch.dev`. Public status carries no reporter-token/private triage state. HF.Status backend/storage/triage ownership stays separate.
- #97 is shipped as a Witch Dock UI/submission client over the canonical HF.Status intake contract. Keep #59 provider capture and #89 post-submission status/follow-up ownership separate. Contextual launch freezes immutable source context; failed special reproduction evidence must not be silently replaced by fallback evidence.
- #97 preview code must remain loader-sized and must not become a second reporter implementation. Do not add another whole-document refinement observer over the reporter's existing lifecycle.
- HF-Chat-Bridge is GitHub-backed development infrastructure, not a plugin. Use the live GitHub/Bridge path directly; the HeroForge tab does not need foreground focus.
- Provider-independent delivery remains `https://witchdock.knightwitch.dev`: GitHub is primary, public Bitbucket `knightwitch/knightwitch.heroforge.recovery` is recovery, and installed URLs do not expose either provider. Dev Auto Host v0.2.3 uses only the custom-domain ref/payload paths.
- Public Stable v2.4.0 contains the approved #90/#97 scope; future Stable changes still require explicit narrow approval.

Completed #59 General/Texture Quality/Booth OFF results and #90 static/mock detail are preserved exactly in [bfd8c9f:ACTIVE_CONTEXT.md](https://github.com/Knight-Witch/KnightWitch.Heroforge/blob/bfd8c9fc3a25d6589d1d51f3f9b4f95f11c16574/ACTIVE_CONTEXT.md). Read only the needed section. [Investigation guide](docs/investigations/README.md) routes evidence/Bridge procedure; [MASTER.md](MASTER.md) maps other policy. Backlog remains [issue #8](https://github.com/Knight-Witch/KnightWitch.Heroforge/issues/8).
