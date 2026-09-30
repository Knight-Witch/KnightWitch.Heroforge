# Current Change Summary

This file is intentionally **not** a full historical changelog. Git history, issues, and PRs preserve older changes. Replace the latest-change section on each commit instead of appending indefinitely.

## Latest repository change — 2026-09-30

- Reconciled `wd/97-integrated-bug-reporter` onto the current canonical `WITCH_DEV_MAIN` documentation/governance baseline without changing the already-gated #97 runtime bytes.
- Preserved the #97 first implementation slice: HF.Status Reporter Client v0.1.0 / `0.1.0-shared-intake-contract` and Bug Capture UI v0.3.0 / `0.3.0-integrated-hf-status-reporter` with the matching manifest entries.
- Human preview gate confirmed the overlay/accordion, contextual classification prefill, automatic original diagnostic capture, and additive fresh diagnostic capture. Required UI/intake refinements are recorded on issue #97 before promotion.
- HF.Status registry impact: no taxonomy change; the reporter continues consuming the existing canonical stable IDs/contracts.
- Public Stable remains untouched; no Stable launcher, payload, update path, or runtime behavior changed.

## Latest Stable release — v2.3.2

- Public Stable remains `Witch_Scripts` v2.3.2 with immutable payload `9e0ac579d142808016a1fa4539be3acc4c65fb82`.
- Release #94 moved Booth JSON Save/Load into its own `Booth JSON Import / Export` section; Stable smoke and Amanda's visual gate passed.
- Detailed release history: issue #94 and PR #96.
