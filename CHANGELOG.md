# Current Change Summary

This file is intentionally **not** a full historical changelog. Git history, issues, and PRs preserve older changes. Replace the latest-change section on each commit instead of appending indefinitely.

## Latest repository change — 2026-09-30

- Paired canonical Dev launcher v1.15.4 with immutable payload `b3e1a58502468187a75a1865b0e4abca90d315c9` for Bug Capture UI v0.4.1.
- The candidate preserves the canonical higher-version reporter API when the still-installed loader-sized preview transport attempts to republish reporter v0.3.0.
- The v1.15.3 loader itself had already passed with 36 immutable resolutions, zero fallback resolutions, and zero module failures; v1.15.4 now requires exact-source Bridge regression followed by the real capture/upload/report/HFBR/triage gate.
- The rejected preview v0.2.0 refinement layer remains unused. #59 remains capture-only, #89 remains follow-up-only, HF.Status registry impact remains none, and Public Stable is untouched.
- `wd/97-integrated-bug-reporter` remains `ACTIVE PROTECTED` through the remaining live/HFBR/human gates.

## Latest Stable release — v2.3.2

- Public Stable remains `Witch_Scripts` v2.3.2 with immutable payload `9e0ac579d142808016a1fa4539be3acc4c65fb82`.
- Release #94 moved Booth JSON Save/Load into its own `Booth JSON Import / Export` section; Stable smoke and Amanda's visual gate passed.
- Detailed release history: issue #94 and PR #96.


