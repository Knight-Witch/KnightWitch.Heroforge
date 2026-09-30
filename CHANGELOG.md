# Current Change Summary

This file is intentionally **not** a full historical changelog. Git history, issues, and PRs preserve older changes. Replace the latest-change section on each commit instead of appending indefinitely.

## Latest repository change — 2026-09-30

- Recorded the rejected #97 preview v0.2.0 architecture after human testing showed HeroForge tab memory/CPU runaway from a second document-wide refinement observer layered over the reporter's own DOM lifecycle.
- Routed continuation back to the real #97 reporter/status modules; the prior ~150-line preview remains transport-only and must not become a second reporter implementation.
- Issue #97 now carries the full human refinement list, rejected-preview diagnosis, Bridge expectations, and autonomous Work handoff boundary.
- `wd/97-integrated-bug-reporter` remains `ACTIVE PROTECTED`; deletion queue remains empty and no branch lifecycle transition occurred.
- HF.Status registry impact: none; existing canonical v1.3 contracts and stable IDs remain authoritative.
- Documentation/routing only; **no runtime/module/manifest/public behavior changed**. Public Stable remains untouched.

## Latest Stable release — v2.3.2

- Public Stable remains `Witch_Scripts` v2.3.2 with immutable payload `9e0ac579d142808016a1fa4539be3acc4c65fb82`.
- Release #94 moved Booth JSON Save/Load into its own `Booth JSON Import / Export` section; Stable smoke and Amanda's visual gate passed.
- Detailed release history: issue #94 and PR #96.
