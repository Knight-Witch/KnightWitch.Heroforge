# Current Change Summary

This file is intentionally **not** a full historical changelog. Git history, issues, and PRs preserve older changes. Replace the latest-change section on each commit instead of appending indefinitely.

## Latest repository change — 2026-09-30

- Implemented Amanda's #97 reporter refinements in the real Witch Dock modules: Script Status and Bug Capture are normal Utilities sections, contextual report actions use a deduplicated bug glyph before the drag handle, and the reporter overlay is draggable with normal Dock temporary-hide/restore behavior.
- Expanded the reporter to the shared HF.Status v1.3 intake: multiple affected saves and targets, safe save-link/figure-JSON sources, separate evidence and diagnostics, native HeroForge 2K capture, private follow-up/contact consent, and retained opaque reporter identity/receipt handling.
- Bumped `witch-dock-bug-capture-ui` to v0.4.0, `hf-status-public-ui` to v0.2.0, and `utilities` to v1.4.0 with synchronized manifest registry/URLs.
- The rejected preview v0.2.0 refinement layer was not reused; its loader-sized transport remains untouched. #59 remains capture-only, #89 remains follow-up-only, and Public Stable remains untouched.
- HF.Status registry impact: none. Existing `bug-capture` and `script-status` feature IDs, paths, ownership, and reporter placements already describe this presentation refinement.
- `wd/97-integrated-bug-reporter` remains `ACTIVE PROTECTED`; live Dev regression, real HF.Status submission/triage proof, and Amanda's final visual gate remain.

## Latest Stable release — v2.3.2

- Public Stable remains `Witch_Scripts` v2.3.2 with immutable payload `9e0ac579d142808016a1fa4539be3acc4c65fb82`.
- Release #94 moved Booth JSON Save/Load into its own `Booth JSON Import / Export` section; Stable smoke and Amanda's visual gate passed.
- Detailed release history: issue #94 and PR #96.
