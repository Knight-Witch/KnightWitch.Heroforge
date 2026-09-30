# Branch Deletion Handoff — Issue #94 — 2026-09-29

> **HISTORICAL — NON-EXECUTABLE.** This handoff is superseded by the canonical [branch registry](../BRANCH_REGISTRY.md) and [exact-SHA deletion queue](../BRANCH_DELETION_QUEUE.md). Its original READY/KEEP/DELETE/next-step text below is dated evidence only and grants no current authority. Use [ACTIVE_CONTEXT.md](../ACTIVE_CONTEXT.md) for current work; do not recreate deleted refs or execute this old list.

Status: READY FOR MECHANICAL DELETION

Issue #94 is functionally complete. Dev v1.15.2 and public Stable v2.3.2 both passed the Booth JSON sibling-section gate; Stable also passed live Bridge/DOM smoke and Amanda visual review. This handoff exists only because the current connector cannot delete Git branch refs.

## DELETE exactly these refs

1. `wd/94-booth-json-subtool` @ `00361606de4ebfd21674e5a5424854ec51de79f9`
2. `release/94-booth-json-subtool` @ `e9225747a96ef47231e905270b5177f137a9662d`

Do not delete either ref if its live SHA differs. Stop and report the mismatch instead.

## Reachability evidence

- `wd/94-booth-json-subtool` is fully reachable from `WITCH_DEV_MAIN`: compare returned `WITCH_DEV_MAIN` ahead by 5, behind by 0, with merge-base exactly `00361606de4ebfd21674e5a5424854ec51de79f9`.
- `release/94-booth-json-subtool` is fully reachable from `Witch_Scripts`: compare returned Stable ahead by 1, behind by 0, with merge-base exactly `e9225747a96ef47231e905270b5177f137a9662d`.
- Useful history therefore remains reachable from canonical refs; branch names are no longer needed as archives.

## KEEP inventory

The repository currently has 39 branches. After deleting the two refs above, exactly 37 branches should remain. Preserve every branch in this list:

- `WITCH_DEV_MAIN`
- `Witch_Scripts`
- `archive/Witch_Scripts-pre-modular-20260920`
- `docs/feature-registry-impact-gate`
- `docs/90-dev-merge-gate`
- `wd/dev-auto-host`
- `wd/payload-1.5.1`
- `wd/payload-1.5.4`
- `wd/28-public-payload-2.0.0`
- `wd/32-body-aaid-binding`
- `wd/32-public-rc`
- `wd/35-hr-diagnostic-capture`
- `wd/37-dock-size-reset`
- `wd/37-dock-size-reset-launcher`
- `wd/37-live-gate-record`
- `wd/37-public-rc`
- `wd/37-version-meta`
- `wd/37-version-meta-launcher`
- `wd/37-version-meta-payload`
- `wd/41-dev-auto-host-head-resolve`
- `wd/41-dev-launcher`
- `wd/41-dev-live-pass`
- `wd/41-dev-payload`
- `wd/41-dev-update-host`
- `wd/41-public-rc`
- `wd/41-release-closeout`
- `wd/41-resize-reset-affordance`
- `wd/41-resize-reset-dev-launcher`
- `wd/41-resize-reset-dev-payload`
- `wd/41-smoke-handoff`
- `wd/59-booth-diagnostic-provider`
- `wd/59-decals-diagnostic-provider`
- `wd/59-generic-bug-capture`
- `wd/59-json-script-compat-capture`
- `wd/59-texture-quality-provider`
- `wd/88-diagnostic-capture-architecture`
- `wd/90-hf-status-public-client`

Do not merge, rebase, retarget, rename, or modify KEEP branches as part of this handoff.

## Verification

After deletion:
1. Verify both DELETE refs are absent.
2. Verify the branch count is exactly 37.
3. Verify every KEEP branch above still exists.
4. Do not re-audit old branch purpose/history unless the live inventory contradicts this handoff.
5. Update this file to COMPLETE, remove the temporary #94 janitorial note from `ACTIVE_CONTEXT.md`, close issue #94, and add documentation-only closeout entries to `CHANGELOG.md` and `PRE_FLIGHT_Check.md`. No runtime/module/manifest changes are required.

## Paste-ready Work instruction

Delete exactly two temporary branches in `Knight-Witch/KnightWitch.Heroforge` using `docs/BRANCH_DELETION_HANDOFF_ISSUE_94_2026-09-29.md`. Do not redo the audit. First verify each DELETE ref still matches the recorded SHA; if either differs, stop and report the mismatch. Delete only `wd/94-booth-json-subtool` and `release/94-booth-json-subtool`. Then verify both are absent, total branch count is 37, and every KEEP branch in the handoff remains. If verification passes, mark the handoff COMPLETE, remove its temporary note from `ACTIVE_CONTEXT.md`, close issue #94, and add concise documentation-only `CHANGELOG.md` / `PRE_FLIGHT_Check.md` closeout records. Do not change runtime/module/manifest files.
