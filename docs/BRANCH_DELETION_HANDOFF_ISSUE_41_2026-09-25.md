# Branch Deletion Handoff — Issue #41 — 2026-09-25

**Scope:** mechanical deletion only. Do not re-audit or reinterpret unless live GitHub state contradicts this handoff.

Issue #41 — Update delivery hardening / header version visibility — is fully released. Dev v1.8.0 and Stable v2.2.1 have passed live smoke. The following temporary refs are disposable.

## DELETE exactly

- `wd/41-dev-auto-host-head-resolve` @ `55596c5e9b47fa93b1820d84d640111b19ef3581`
- `wd/41-dev-launcher` @ `37da6119acd15b9da1c3bcc49d50346935c272d4`
- `wd/41-dev-live-pass` @ `8ca58aa4f0db07aecc34ae9d5a6a449e0cd18c2d`
- `wd/41-dev-payload` @ `f64839aed1fca6e0490223075f1b7745a51a2a41`
- `wd/41-dev-update-host` @ `82479269ee49cdfc37c7c10195aacabe61699f4d`
- `wd/41-public-rc` @ `50b22b3f9d8bf030f958b5372e008bca5404fa1d`
- `wd/41-resize-reset-affordance` @ `3e036857ecc0fd8e4cf7e3c72d4ebe6a198c3696`
- `wd/41-resize-reset-dev-launcher` @ `29a3e02051b1c1795db7165170a1a3978b31a83e`
- `wd/41-resize-reset-dev-payload` @ `74f46948407116dc97bc861d1bf0df6f9fc1bb0a`
- `wd/41-smoke-handoff` @ `278153969825959b3ddcf8dbc83664abadd769b7`

The closeout branch `wd/41-release-closeout` will be added to this DELETE list after its exact merged PR-head SHA is known.

## Reachability / preservation evidence

- PR #47 merged the Auto Host head-resolution work into persistent KEEP branch `wd/dev-auto-host`.
- PRs #48, #49, #50, #52, #53, #54, #55, and #56 merged their respective #41 Dev branches into `WITCH_DEV_MAIN`.
- PR #51 promoted the exact `wd/41-public-rc` head to `Witch_Scripts`; current Stable is the same commit `50b22b3f9d8bf030f958b5372e008bca5404fa1d`.
- Canonical Dev v1.8.0 passed 25/25 immutable loader smoke with Dev Auto Host v0.2.0.
- Public Stable v2.2.1 passed self-host current-head resolution and 23/23 immutable loader smoke.
- Shared Shell/Core/Styles/Interactions/Utilities bytes were verified identical between the final Dev and promoted Stable payloads.

Protected KEEP inventory after the #37/#41 cleanup:
- `WITCH_DEV_MAIN`
- `Witch_Scripts`
- `archive/Witch_Scripts-pre-modular-20260920`
- `wd/dev-auto-host`
- `wd/payload-1.5.1`
- `wd/payload-1.5.4`
- `wd/28-public-payload-2.0.0`
- `wd/35-hr-diagnostic-capture` — handled only by the separate #35 deletion handoff; do not delete under #37/#41 cleanup.

The sibling #37 handoff deletes #37-only temporary refs. Those are not KEEP refs and must be handled only under that handoff.

## Verification

After executing both #37 and #41 deletion handoffs, the live branch inventory must be exactly the eight protected KEEP refs listed above. If any DELETE ref has moved from its expected SHA, stop and report the contradiction instead of deleting it.

## Paste-ready Work instruction

Read `WITCH_DEV_MAIN/docs/BRANCH_DELETION_HANDOFF_ISSUE_37_2026-09-25.md` and `WITCH_DEV_MAIN/docs/BRANCH_DELETION_HANDOFF_ISSUE_41_2026-09-25.md`. Do not re-audit. Delete exactly the listed #37/#41 temporary branches only when each ref still matches its recorded SHA. Preserve every protected KEEP ref. Verify the final branch inventory exactly matches the eight KEEP refs. Then record completion in the handoff docs and make the required documentation-only CHANGELOG/PRE_FLIGHT/ACTIVE_CONTEXT cleanup.
