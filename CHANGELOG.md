# Current Change Summary

This file is intentionally **not** a full historical changelog. Git history, issues, and PRs preserve older changes. Replace the latest-change section on each commit instead of appending indefinitely.

## Latest repository change — 2026-09-30

- Staged Dev launcher v1.15.5 metadata and Bug Capture UI v0.4.2 after the v1.15.4 accessor guard blocked HF-Chat-Bridge's safe named-path traversal.
- v0.4.2 publishes the canonical reporter as a configurable, non-writable **data property**. This preserves the Bridge/runtime data-property seam and causes the stale v0.3 preview assignment to abort before it starts its old contextual observer.
- The rejected preview v0.2.0 refinement layer remains unused and the temporary preview remains loader-sized.
- #59 remains capture-only, #89 remains follow-up-only, HF.Status registry impact remains none, and Public Stable is untouched.
- `wd/97-integrated-bug-reporter` remains `ACTIVE PROTECTED` through the remaining live/HFBR/human gates.

## Latest Stable release — v2.3.2

- Public Stable remains `Witch_Scripts` v2.3.2 with immutable payload `9e0ac579d142808016a1fa4539be3acc4c65fb82`.
- Release #94 moved Booth JSON Save/Load into its own `Booth JSON Import / Export` section; Stable smoke and Amanda's visual gate passed.
- Detailed release history: issue #94 and PR #96.



