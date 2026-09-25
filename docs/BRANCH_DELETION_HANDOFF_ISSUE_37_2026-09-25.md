# Branch Deletion Handoff — Issue #37 — 2026-09-25

**Scope:** mechanical deletion only. Do not re-audit or reinterpret unless live GitHub state contradicts this handoff.

Issue #37 — Dock default-size reset utility — is fully released through public Stable v2.2.1. The following temporary refs are disposable.

## DELETE exactly

- `wd/37-dock-size-reset` @ `4abbca9010b22b27e8e48277c6f3a620986a1d9f`
- `wd/37-dock-size-reset-launcher` @ `cff13d7db19b38967a67b7f52a859927fe951fbd`
- `wd/37-live-gate-record` @ `f30a9c1d926c0439106640bbc82702cb389f534b`
- `wd/37-public-rc` @ `407d9b6d46dd93a2e2818e59bbea7aa6333b6b20`
- `wd/37-version-meta` @ `a5a8ed20730fdf1f93e9810c9ffa672fd405537e`
- `wd/37-version-meta-launcher` @ `35b0a5e619df13e25b45d0f7e6ec78cda2dde97e`
- `wd/37-version-meta-payload` @ `3ce5687ef27390294098ffb9fbf2fb8f6cb166e3`

## Reachability / preservation evidence

- PR #38 merged `wd/37-dock-size-reset` into `WITCH_DEV_MAIN`.
- PR #39 merged `wd/37-dock-size-reset-launcher` into `WITCH_DEV_MAIN`.
- PR #40 merged `wd/37-live-gate-record` into `WITCH_DEV_MAIN`.
- PRs #43, #44, and #45 merged the version-metadata branches into `WITCH_DEV_MAIN`.
- PR #46 promoted `wd/37-public-rc`; its exact head became public Stable v2.1.0 and is preserved in the ancestry of current Stable v2.2.1.
- Current public Stable is `Witch_Scripts` @ `50b22b3f9d8bf030f958b5372e008bca5404fa1d`.
- Current canonical Dev is v1.8.0 and retains the released reset behavior.

Protected KEEP inventory after the #37/#41 cleanup:
- `WITCH_DEV_MAIN`
- `Witch_Scripts`
- `archive/Witch_Scripts-pre-modular-20260920`
- `wd/dev-auto-host`
- `wd/payload-1.5.1`
- `wd/payload-1.5.4`
- `wd/28-public-payload-2.0.0`
- `wd/35-hr-diagnostic-capture` — handled only by the separate #35 deletion handoff; do not delete under #37/#41 cleanup.

The sibling #41 handoff deletes #41-only temporary refs. Those are not KEEP refs and must be handled only under that handoff.

## Verification

After executing both #37 and #41 deletion handoffs, the live branch inventory must be exactly the eight protected KEEP refs listed above. If any DELETE ref has moved from its expected SHA, stop and report the contradiction instead of deleting it.

## Paste-ready Work instruction

Read `WITCH_DEV_MAIN/docs/BRANCH_DELETION_HANDOFF_ISSUE_37_2026-09-25.md` and `WITCH_DEV_MAIN/docs/BRANCH_DELETION_HANDOFF_ISSUE_41_2026-09-25.md`. Do not re-audit. Delete exactly the listed #37/#41 temporary branches only when each ref still matches its recorded SHA. Preserve every protected KEEP ref. Verify the final branch inventory exactly matches the eight KEEP refs. Then record completion in the handoff docs and make the required documentation-only CHANGELOG/PRE_FLIGHT/ACTIVE_CONTEXT cleanup.
