# Current Change Summary

This file is intentionally **not** a full historical changelog. Git history, issues, and PRs preserve older changes. Replace the latest-change section on each commit instead of appending indefinitely.

## Latest repository change — 2026-09-30

- Staged Dev launcher v1.15.6 metadata with Bug Capture UI v0.4.3; the paired launcher pin is still required before this payload is canonical.
- The affected-save action now resolves the exact active HeroForge `config_id` when the editor has rewritten the browser URL to `/`, produces the canonical encoded `load_config%3D<ID>/` link, and no longer displays a placeholder that resembles attached data.
- Added contextual bug actions for High Res Image Capture, Spinny Mini WebP Capture, Texture Quality, and Utilities → Bug Capture. High Res Diagnostics remains intentionally action-free because it is an internal Dev diagnostic surface rather than a distinct reportable registry feature.
- Contextual bug glyph styling now overrides generic section-button chrome, uses a larger standard glyph, and remains immediately left of the section drag handle.
- Reopening the reporter while a report is already visible now preserves its original immutable source context and draft state instead of silently replacing them.
- Canonical v1.15.5 already passed exact-source Bridge regression and real HF.Status E2E submission/triage for `HFBR-20260930-V4M8M2EA`. Corrective v1.15.6 live regression and Amanda's final visual smoke remain.
- The obsolete local preview loader must be disabled/removed before the final smoke. The rejected preview v0.2.0 layer remains unused, #59 remains capture-only, #89 remains follow-up-only, and Public Stable is untouched.
- `wd/97-integrated-bug-reporter` remains `ACTIVE PROTECTED`.

## Latest Stable release — v2.3.2

- Public Stable remains `Witch_Scripts` v2.3.2 with immutable payload `9e0ac579d142808016a1fa4539be3acc4c65fb82`.
- Release #94 moved Booth JSON Save/Load into its own `Booth JSON Import / Export` section; Stable smoke and Amanda's visual gate passed.
- Detailed release history: issue #94 and PR #96.
