# Current Change Summary

This file is intentionally **not** a full historical changelog. Git history, issues, and PRs preserve older changes. Replace the latest-change section on each commit instead of appending indefinitely.

## Latest repository change — 2026-09-30

- Simplified Witch Dock log retention so `CHANGELOG.md` remains a bounded current summary and `PRE_FLIGHT_Check.md` records only the latest validation/current head.
- Ordinary replacement no longer creates separate compaction-history entries; prior contents already remain in Git history.
- Documentation/governance only; **no runtime/module/manifest/public behavior changed**.

## Latest Stable release — v2.3.2

- Public Stable remains `Witch_Scripts` v2.3.2 with immutable payload `9e0ac579d142808016a1fa4539be3acc4c65fb82`.
- Release #94 moved Booth JSON Save/Load into its own `Booth JSON Import / Export` section; Stable smoke and Amanda's visual gate passed.
- Detailed release history: issue #94 and PR #96.
