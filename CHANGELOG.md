# Current Change Summary

This file is intentionally **not** a full historical changelog. Git history, issues, and PRs preserve older changes. Replace the latest-change section on each commit instead of appending indefinitely.

## Latest repository change — 2026-09-30

- Merged PR #98 into canonical Dev and staged synchronized launcher/manifest metadata for the #97 v1.15.3 immutable payload; the paired launcher pin follows in the next commit before the canonical ref moves.
- The staged payload pairs Bug Capture UI v0.4.0, HF.Status Public UI v0.2.0, Utilities v1.4.0, and Reporter Client v0.1.0; fixed Dev identity/update URLs and HF.Status Dev transport boundaries are unchanged.
- Registered #97's intentional Dev-only runtime divergence through its real capture/upload/report/HFBR/triage and final Amanda visual gates.
- The rejected preview layer remains unused and its loader-sized transport remains untouched. #59 stays capture-only, #89 stays follow-up-only, and Public Stable remains untouched.
- HF.Status feature-registry impact remains none: stable `bug-capture` and `script-status` IDs, paths, ownership, and placements are unchanged.
- `wd/97-integrated-bug-reporter` remains `ACTIVE PROTECTED` until the remaining live/human gates finish; Public Stable is unchanged.

## Latest Stable release — v2.3.2

- Public Stable remains `Witch_Scripts` v2.3.2 with immutable payload `9e0ac579d142808016a1fa4539be3acc4c65fb82`.
- Release #94 moved Booth JSON Save/Load into its own `Booth JSON Import / Export` section; Stable smoke and Amanda's visual gate passed.
- Detailed release history: issue #94 and PR #96.
