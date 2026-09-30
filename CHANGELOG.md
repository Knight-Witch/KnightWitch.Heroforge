# Current Change Summary

This file is intentionally **not** a full historical changelog. Git history, issues, and PRs preserve older changes. Replace the latest-change section on each commit instead of appending indefinitely.

## Latest repository change — 2026-09-30

- Canonical Dev launcher v1.15.6 pins immutable payload `acb517b4848e47f9acf842c34fac4b6d737bf016` with Bug Capture UI v0.4.3.
- The affected-save action now resolves the exact active HeroForge `config_id` when the editor has rewritten the browser URL to `/`, produces the canonical encoded `load_config%3D<ID>/` link, and no longer displays a placeholder that resembles attached data.
- Added contextual bug actions for High Res Image Capture, Spinny Mini WebP Capture, Texture Quality, and Utilities → Bug Capture. High Res Diagnostics remains intentionally action-free because it is an internal Dev diagnostic surface rather than a distinct reportable registry feature.
- Contextual bug glyph styling now overrides generic section-button chrome, uses a larger standard glyph, and remains immediately left of the section drag handle.
- Reopening the reporter while a report is already visible now preserves its original immutable source context and draft state instead of silently replacing them.
- Exact-source v1.15.6 Bridge regression passed: 36/36 modules loaded from the immutable payload with zero fallback/failure; each requested contextual action exists exactly once; High Res Diagnostics has none; icon computed style is 28×28, transparent, borderless, with the drag handle as its next sibling; the source-context guard preserved Body Editor → Butt Mirror across a second Utilities launch; and the save action returned `https://www.heroforge.com/load_config%3D59237060/`.
- The earlier real HF.Status E2E submission/triage remains valid at `HFBR-20260930-V4M8M2EA`; no duplicate report was created for CSS/context/save-link corrections.
- Amanda's final visual/interaction smoke remains. The obsolete local preview loader must be disabled/removed first because its rejected v0.3 payload now correctly aborts against the canonical non-writable reporter global and displays its own failure alert.
- The rejected preview v0.2.0 layer remains unused, #59 remains capture-only, #89 remains follow-up-only, and Public Stable is untouched.
- `wd/97-integrated-bug-reporter` remains `ACTIVE PROTECTED`.

## Latest Stable release — v2.3.2

- Public Stable remains `Witch_Scripts` v2.3.2 with immutable payload `9e0ac579d142808016a1fa4539be3acc4c65fb82`.
- Release #94 moved Booth JSON Save/Load into its own `Booth JSON Import / Export` section; Stable smoke and Amanda's visual gate passed.
- Detailed release history: issue #94 and PR #96.
