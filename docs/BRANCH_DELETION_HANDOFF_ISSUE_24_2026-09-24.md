# Release Branch Deletion Handoff — issue #24 / public v2.0.3

**Status:** READY FOR WORK — exact mechanical deletion only  
**Repository:** `Knight-Witch/KnightWitch.Heroforge`  
**Prepared:** 2026-09-24  
**Release:** Witch Dock public v2.0.3  
**Source issue:** #24 — HR ON/OFF body visual paint tint change  
**Janitorial tracking:** #14

## Preconditions — PASS

- Stable promotion complete at `Witch_Scripts@0a5ee9c99f1ca999ead93baa39948d8595830064`.
- Stable runtime identity PASS: v2.0.3 / `2.0.3-issue-24-colorbake-restore`.
- Loader PASS: 23/23 executed, 0 failed, immutable=23, fallback=0.
- Texture Quality v0.3.7 passed the #24 visual gate; Amanda accepted the ON→OFF result.
- Intermittent restore warning is split to #34 and is not the #24 visual-tint acceptance criterion.
- Dev reconciliation PASS: exact Texture Quality source blob matches Stable, and all 36 shared non-launcher runtime JS/CSS paths are byte-identical.
- #24 is removed from `DEV_DIVERGENCES.json`.

## Reachability proof

- `wd/24-colorbake-cache-restore@a28ff093b53de90bb864752b412fd68ae24eec60` is an ancestor of `WITCH_DEV_MAIN`.
- `wd/24-dev-launcher-1.5.4@b98f94d8fe491fc4560d042f6e5fd70980d7f709` is canonical Dev history.
- `wd/24-native-restore-adoption@93a94dcafa48561eafa2b0ea040d12b01522a6ec` is an ancestor of `WITCH_DEV_MAIN`.
- `wd/24-public-2.0.2@9e9dcc0eaca02e556c2952a014bdac375de35099` is an ancestor of `Witch_Scripts`.
- `wd/24-public-2.0.3@0a5ee9c99f1ca999ead93baa39948d8595830064` is identical to current `Witch_Scripts`.
- `wd/24-public-payload-2.0.3@caef7c8b54c695934f26b1cc88ee2c79df7d65b1` is an ancestor of `Witch_Scripts`.

## DELETE exactly these branches

- `wd/24-colorbake-cache-restore` @ `a28ff093b53de90bb864752b412fd68ae24eec60`
- `wd/24-dev-launcher-1.5.4` @ `b98f94d8fe491fc4560d042f6e5fd70980d7f709`
- `wd/24-native-restore-adoption` @ `93a94dcafa48561eafa2b0ea040d12b01522a6ec`
- `wd/24-public-2.0.2` @ `9e9dcc0eaca02e556c2952a014bdac375de35099`
- `wd/24-public-2.0.3` @ `0a5ee9c99f1ca999ead93baa39948d8595830064`
- `wd/24-public-payload-2.0.3` @ `caef7c8b54c695934f26b1cc88ee2c79df7d65b1`

## KEEP exactly these branches

- `WITCH_DEV_MAIN`
- `Witch_Scripts`
- `archive/Witch_Scripts-pre-modular-20260920`
- `wd/dev-auto-host`
- `wd/payload-1.5.1`
- `wd/payload-1.5.4`
- `wd/28-public-payload-2.0.0`

Expected post-delete inventory: exactly 7 branches.

## Execution rules

Delete only the six listed refs. Do not merge, rebase, retarget, rename, archive, or modify KEEP branches. If deletion is uncertain, read live state before retrying; never blindly replay.

## Verification

After deletion, fetch the live inventory and verify exactly the seven KEEP branches remain. Record completion on issue #14. Mark this handoff COMPLETE, remove the temporary janitorial note from `ACTIVE_CONTEXT.md`, and add the required compact documentation-only CHANGELOG/PRE_FLIGHT closeout.

## Paste-ready Work instruction

Clean up completed issue #24 release branches in `Knight-Witch/KnightWitch.Heroforge`.

The audit, exact SHAs, reachability proof, DELETE list, and KEEP inventory are complete. Do not redo or reinterpret them unless live repository state directly contradicts the handoff.

Read and execute:

`WITCH_DEV_MAIN/docs/BRANCH_DELETION_HANDOFF_ISSUE_24_2026-09-24.md`

Delete exactly the six listed DELETE branches, preserve exactly the seven listed KEEP branches, verify the final live inventory, record the result on issue #14, then perform only the narrow documentation closeout specified by the handoff.
